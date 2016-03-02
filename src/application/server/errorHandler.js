/*
 *  Error Handler for Express
*/



"use strict";

// <============== Static requirements
var winston = require("winston");



/*
*   Handler for @err
*/
var Handler = function(err, req, res, next) {
    // Log error
    winston.loggers.get("main").error(err.stack);
    // Set HTTP return code (500 by default)
    if(typeof err.getStatus == "function") {
        res.status(err.getStatus());
    } else {
        res.status(500);
    }
    // Print a message to client
    if(typeof err.getPublicMessage == "function") {
        res.render("error", { msg: err.getPublicMessage() });
    } else {
        res.render("error", { msg: "Internal server error." });
    }
};

module.exports = Handler;