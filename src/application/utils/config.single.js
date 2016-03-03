/*
*   Config singleton
*   Read and parse configuration file.
*/

"use strict";



// <============== Static requirements
var fs = require("fs");
var Q  = require("q");



/*
*   Config constructor
*/
var Config = function() {
    this.cfgFile = __dirname+"/../config.json";
    this.data = null;
};

/*
*   load()
*   Read and parse configuraitçon file.
*   Return a promise.
*/
Config.prototype.load = function(fileName) {
    var self = this;
    if(self.data == null) {
        // If data was not loaded, do it now
        return Q.denodeify(fs.readFile)(this.cfgFile, "utf8").then(function(data) {
            return self.data = JSON.parse(data);
        });
    } else {
        // Else, just return preivously loaded data
        return Q(self.dat);
    }
};

/*
*   get()
*   Return the value of requested @parameter or null if it does ot exist.
*   Configuration must be loaded before.
*/
Config.prototype.get = function(parameter) {
    if(this.data === null) throw new Error("Configuration not loaded");
    if(typeof this.data[parameter] == "undefined") {
        return null;
    } else {
        return this.data[parameter];
    }
};



module.exports = new Config();