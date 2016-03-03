/*
*   Server class
*   Create a web server listening on given port and serve contents.
*/

"use strict";



// <============== Static requirements
var Q            = require("q");
var fs           = require("fs");
var https        = require("https");
var Express      = require("express");
var Compression  = require("compression");
var session      = require("express-session");
var fileStore    = require("session-file-store")(session);
var winston      = require("winston");
var config       = require(__dirname+"/../utils/config.single.js");



/*
*   Server constructor
*/
var Server = function() {
};

/*
*   listen()
*   Start the web server on given port (@port) and setup HTTP routes.
*/
Server.prototype.listen = function(port) {
    
    // Initialize Express
    var app = Express();
    app.set("views", __dirname+"/../template/"); // Specify template folder
    app.set("view engine", "ejs");               // Set EJS template engine
    app.set("x-powered-by", false);              // Disable "x-powered-by" HTTP header
    app.use(Compression());                      // Use compression module
    
    // Init session
    if(config.get("session_secret") === null) throw new Error("Bad configuration: session_secret is undefined");
    app.use(session({
        secret: config.get("session_secret"),
        store: new fileStore({ encrypt : true, path: __dirname+"/../../sessions" }),
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }
    }));
    
    // Remove requests from Discord (who tries to get a screenshot of each posted link).
    app.use(function(req, res, next) {
       if(req.headers["user-agent"].match(/Discordbot/i)) {
            winston.loggers.get("main").info("Discarding Discord HTTP request.", {ip: req.ip, uri: req.originalUrl});
       } else {
            next();
       }
    });
    
    // Log HTTP request
    app.use(function(req, res, next) {
        winston.loggers.get("main").info("New HTTP request.", {ip: req.ip, uri: req.originalUrl});
        next();
    });
    
    // Static contents
    app.use(Express.static(__dirname+"/static/"));
    
    // Bind routers
    app.use("/sso/", require("./sso.router.js") );
    app.use("/register/", require("./register.router.js") );
    
    // Index page route
    app.get("/", function(req, res, next) {
        // Just print index page (pure HTML)
        res.render("index");
    });
    
    // Error handler
    var errorHandler = require("./errorHandler.js");
    app.use(errorHandler);
    
    // Start listening
    if(config.get("https_ppk") != null && config.get("https_cert") != null) {
        // HTTPS server initialisation
        https.createServer({
            key: fs.readFileSync( config.get("https_ppk") ),
            cert: fs.readFileSync( config.get("https_cert") )
        }, app).listen(port);
    } else {
        // HTTP server initialisation
        app.listen(port);
    }
    winston.loggers.get("main").info("HTTP server started on port "+port+".");

};



module.exports = Server;