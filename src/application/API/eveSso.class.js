/*
*   SSO class
*   Handles OAuth2 authentication with EvE.
*/

"use strict";



// <============== Static requirements
var Q       = require("q");
var crypto  = require("crypto");
var url     = require("url");
var request = require("request-promise");
var config  = require(__dirname+"/../utils/config.single.js");



/*
*   SSO constructor
*/
var SSO = function() {
};

/*
*   getOAtuthState()
*   Return the Oauth state parameter based on a clientSecret.
*/
SSO.prototype.getOAtuthState = function(clientSecret, state, code) {
    var salt = config.get("hash_salt") || "re6gv56zsvg6vgzspok";
    var hash = crypto.createHmac("sha512", salt);
    return hash.update(clientSecret).digest("hex");
};

/*
*   getAuthUrl()
*   Start the web server on given port (@port) and setup HTTP routes.
*/
SSO.prototype.getAuthUrl = function(clientSecret) {
    // First, hash the clietn secret because it will be leaked in the URL
    var secret = this.getOAtuthState(clientSecret);
    // Then build the URL
    return url.format({
        protocol:   "https",
        host:       config.get("sso_host"),
        pathname:   "/oauth/authorize",
        query: {
            response_type:  "code",
            redirect_uri:   config.get("local_protocol")+"://"+config.get("local_hostname")+"/sso/auth_response/",
            client_id:      config.get("app_client_id"),
            scope:          "publicData characterFittingsRead",
            state:          secret
        }
    });
};

/*
*   validate()
*   Validate state and authorization code.
*/
SSO.prototype.validate = function(clientSecret, state, code) {
    // 1 - Validate state parameter
    if(state != this.getOAtuthState(clientSecret)) {
        throw new Error("Invalid state parameter for this user.");
    }
    // 2 - Validate code token
    return request({
        method: 'POST',
        uri: "https://"+config.get("sso_host")+"/oauth/token",
        auth: {
            user: config.get("app_client_id"),
            pass: config.get("app_client_secret"),
            sendImmediately: true
        },
        form: {
            "grant_type": "authorization_code",
            "code": code
        },
        resolveWithFullResponse: true // Request full response and not only the body
    }).then(function(response) {
        var data = JSON.parse(response.body);
        return data;
    });
};

/*
*   refresh()
*   Get a new access_token using stored refresh_token.
*/
SSO.prototype.refresh = function(refresh_token) {
    return request({
        method: 'POST',
        uri: "https://"+config.get("sso_host")+"/oauth/token",
        auth: {
            user: config.get("app_client_id"),
            pass: config.get("app_client_secret"),
            "sendImmediately": true
        },
        form: {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token
        },
        resolveWithFullResponse: true // Request full response and not only the body
    }).then(function(response) {
        return JSON.parse(response.body);
    });
};



module.exports = SSO;