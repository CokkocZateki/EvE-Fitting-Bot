/*
*   Express router for /register/ path
*/

"use strict";



// <============== Static requirements
var Q       = require("q");
var Express = require("express");
var winston = require("winston");
var User    = require(__dirname+"/../user.class.js");



// Router initilization
var router = Express.Router();



/*
    Index route:
    User is not authenticated.
*/
router.get("/", function(req, res, next) {
    // Load user
    var user = (new User()).loadDiscordId(req.query.discordId);
    // Check verification code
    user.checkRegisterLink(req.query.verifCode).catch(next).then(function() {
        // Register Discord ID in the session
        req.session.discordId = req.query.discordId;
        // Register redirectUrl in session so that user will be redirected here after authentication.
        req.session.redirectUrl = "/register/complete/";
        // Redirect to EvE SSO
        res.redirect("/sso/");
    }).catch(next).done();
});

/*
    "complete" route:
    User is now authenticated locally and with EvE.
    We retrieve his/her EvE ID.
*/
router.get("/complete/", function(req, res, next) {
    // Load user and save data
    var user = (new User()).loadDiscordId(req.session.discordId);
    user.initEvE(req.session.oauth).then(function() {
        winston.loggers.get("main").info("New user registered: "+user.data.eveName+".");
        res.render("registration_complete");
    }).catch(next).done();
});



module.exports = router;