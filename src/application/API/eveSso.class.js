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
*   getOAuthState()
*   Return the Oauth state parameter based on a clientSecret (as string).
*/
SSO.prototype.getOAuthState = function(clientSecret, state, code) {
    var salt = config.get("hash_salt") || "re6gv56zsvg6vgzspok";
    var hash = crypto.createHmac("sha512", salt);
    return hash.update(clientSecret).digest("hex");
};

/*
*   getAuthUrl()
*   Return the redirectUrl parameter of OAuth authentication (as string).
*   After the user has authenticated with EvE SSO, he/she will be redirected to this URL.
*/
SSO.prototype.getAuthUrl = function(clientSecret) {
    // First, hash the clietn secret because it will be leaked in the URL
    var secret = this.getOAuthState(clientSecret);
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
*   Validate OAuth "state" parameter and "authorization_code".
*   Return a promise.
*/
SSO.prototype.validate = function(clientSecret, state, code) {
    // 1 - Validate state parameter
    if(state != this.getOAuthState(clientSecret)) {
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
        }
    }).then(function(body) {
        var data = JSON.parse(body);
        return data;
    });
};

/*
*   refresh()
*   Get a new access_token using refresh_token.
*   Return a promise.
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
        }
    }).then(function(body) {
        return JSON.parse(body);
    });
};



module.exports = SSO;