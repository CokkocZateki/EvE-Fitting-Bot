/*
*   CrestAPI class
*   CREST API wrapper (clearly not complete).
*/

"use strict";



// <============== Static requirements
var Q       = require("q");
var url     = require("url");
var request = require("request-promise");
var db      = require("json-db-lite");
var winston = require("winston");
var SSO     = require(__dirname+"/eveSso.class.js");
var config  = require(__dirname+"/../utils/config.single.js");



/*
*   CrestAPI constructor
*/
var CrestAPI = function() {
    this.USER_AGENT = "EvE Fitting Bot";
};

/*
*   getCharacterData()
*   Request and return the EvE character data (ID, name, etc.).
*   Attention, this method does not cache results (as character id is not known).
*   Return a promise.
*/
CrestAPI.prototype.getCharacterData = function(authorizationCode) {
    return request({
        method: "GET",
        uri: "https://"+config.get("sso_host")+"/oauth/verify",
        headers: {
            authorization:  "Bearer "+authorizationCode,
        }
    }).then(function(body) {
        return JSON.parse(body);
    });
};

/*
*   fromCache()
*   Load data from cache.
*   Return null if cache does not exists or is deprecated.
*/
CrestAPI.prototype.fromCache = function(path) {
    var cache = db.get(path);
    if(cache != null && cache.exipres > new Date().getTime()) {
        return cache.data;
    } else {
        return null;
    }
};

/*
*   toCache()
*   Save data in cache.
*   Return a promise.
*/
CrestAPI.prototype.toCache = function(path, data, cacheLength) {
    return db.set(path, {
        data: data,
        exipres: new Date().getTime() + (cacheLength*1000)
    }).save();
};

/*
*   request()
*   Request data from CREST API.
*   Return a promise.
*/
CrestAPI.prototype.request = function(oauth, endpoint) {
    var self = this;
    // Send a first request with access_token
    return self.sendRequest(oauth, endpoint).catch(function(err) {
        if(err.message.match(/Unauthorized/i)) {
            // Authentication denied, access_token is probably outdated
            // Let's get a new one and retry
            return Q().then(function() {
                // Request new access_token using refresh_toekn
                winston.loggers.get("main").info("access_token seems outdated, requesting a new one...");
                return new SSO().refresh(oauth.refresh_token);
            }).then(function(data) {
                // Store new access_token and retry
                oauth.access_token = data.access_token;
                oauth.expire = new Date().getTime() + (data.expire*1000);
                return self.sendRequest(oauth, endpoint);
            });
        } else {
            throw err;
        }
    });
};

/*
*   sendRequest()
*   Send a GET request to CREST.
*   Return a promise.
*/
CrestAPI.prototype.sendRequest = function(oauth, endpoint) {
    return request({
        method: "GET",
        uri: url.format({
            protocol: "https",
            host:     config.get("crest_host"),
            pathname: endpoint
        }),
        auth: { bearer: oauth.access_token },
        headers: { "User-Agent": this.USER_AGENT }
    }).then(function(body) {
        return JSON.parse(body);
    });
};

/*
*   getCharFits()
*   Retrieve and return character fits.
*   Return a promise.
*/
CrestAPI.prototype.getCharFits = function(oauth, charId) {
    var CACHE_LENGTH = 60; // seconds
    var self = this;
    // Try to load from cache first
    var data = self.fromCache("crest.fits."+charId);
    if(data != null) {
        winston.loggers.get("main").info("Loaded "+data.items.length+" fits from cache for "+charId+".");
        return Q(data);
    }
    // Else, request data from CREST
    return this.request(oauth, "/characters/"+charId+"/fittings/").then(function(data) {
        winston.loggers.get("main").info("Loaded "+data.items.length+" fits from CREST for "+charId+".");
        self.toCache("crest.fits."+charId, data, CACHE_LENGTH);
        return data;
    });
};



module.exports = CrestAPI;