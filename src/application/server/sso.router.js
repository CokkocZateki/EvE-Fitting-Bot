/*
*   Express router for /sso/ path
*/

"use strict";



// <============== Static requirements
var Q       = require("q");
var Express = require("express");
var SSO     = require(__dirname+"/../API/eveSso.class.js");



// Router initilization
var router = Express.Router();



/*
    Index route:
    User is not authenticated.
*/
router.get("/", function(req, res, next) {
    // Build redirect URL
    var sso = new SSO();
    var url = sso.getAuthUrl(req.session.id);
    // Redirect to EvE login
    res.redirect(url);
});

/*
    /auth_response/ route:
    User should be authenticated to EvE and send authorization code
    to prove it.
*/
router.get("/auth_response/", function(req, res, next) {
    // Validate state and authorization code
    var sso = new SSO();
    sso.validate(req.session.id, req.query.state, req.query.code).then(function(data) {
        // Validation success: save tokens
        req.session.oauth = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expire: (new Date()).getTime() + data.expires_in
        };
        // Redirect
        if(req.session.redirectUrl) {
            res.redirect(req.session.redirectUrl);
            req.session.redirectUrl = null;
        } else {
            res.redirect("/");
        }
    }).catch(next).done();
});

/*
    /disconnect/ route:
    Delete session from server (but don't propagate to EvE).
*/
router.get("/disconnect/", function(req, res, next) {
    // Destroy session
    req.session.destroy();
    // Redirect to index
    res.redirect("/");
});



module.exports = router;