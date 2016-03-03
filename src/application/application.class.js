/*
*   Application class
*   Initialize and start services.
*/

"use strict";



// <============== Static requirements
var Q       = require("q");
var winston = require("winston");
var db      = require("json-db-lite");
var Server  = require(__dirname+"/server/server.class.js");
var config  = require(__dirname+"/utils/config.single.js");
var Bot     = require(__dirname+"/bot.class.js");



/*
*   Application constructor
*/
var Application = function() {
    // HTTP server
    this.httpServer = null;
    // Discord Bot
    this.bot = null;
};

/*
*   start()
*   Initialisa and start application.
*   Return a promise.
*/
Application.prototype.start = function(httpPort) {
    var self = this;
    Q().then(function() {
        // Load configuraiton file
        return config.load();
    }).then(function() {
        // Init and load database
        db.setDbFile(__dirname+"/../database.json");
        return db.load().catch(function(err) {
            if(err.message.match(/ENOENT/i)) {
                // That's ok, the file is probably not created yet.
            } else {
                throw err;
            }
        });
    }).then(function() {
        // Create and start HTTP server
        self.httpServer = new Server();
        self.httpServer.listen(httpPort);
        return Q();
    }).then(function() {
        // Initilise logger
        winston.loggers.add("main", {
            transports: [
                new (winston.transports.Console)({ level: "info",  colorize: true, name: "console" }),
                new (winston.transports.File)   ({ level: 'info',  filename: __dirname+"/../log/info.log", name: 'info_file' }),
                new (winston.transports.File)   ({ level: 'error', filename: __dirname+"/../log/error.log", name: 'error_file' })
            ]
        });
        return Q();
    }).then(function() {
        // Create and initialise bot
        self.bot = new Bot();
        return self.bot.init();
    }).catch(function(err) {
        // Handle errors
        winston.loggers.get("main").error(err.stack);
    }).done();
};



module.exports = Application;