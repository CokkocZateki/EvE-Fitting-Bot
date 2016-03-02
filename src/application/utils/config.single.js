/*
*   Config class
*   Read and parse configuration file.
*/

"use strict";



// <============== Static requirements
var fs = require("fs");
var Q  = require("q");



/*
*   Server constructor
*/
var Config = function() {
    this.cfgFile = __dirname+"/../config.json";
    this.data = null;
};

/*
*   load()
*   Read and parse configuraitçon file.
*/
Config.prototype.load = function(fileName) {
    var self = this;
    if(self.data == null) {
        return Q.denodeify(fs.readFile)(this.cfgFile, "utf8").then(function(data) {
            return self.data = JSON.parse(data);
        });
    } else {
        return Q(self.dat);
    }
};

/*
*   get()
*   Return the value of requested @parameter or null if it does ot exist.
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