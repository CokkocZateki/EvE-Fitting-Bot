/*
*   MyError class
*   Error implementation with a few more fonctionalities
*/


"use strict";


/*
*   MyError constructor
*   Also inherit classic JS error.
*/
var MyError = function(privMsg, pubMsg, httpStatus) {
    
    // Inherit JS Error
    var error = Error.apply(this, arguments);
    
    // New attributes
    this.privMsg = error.privMsg;
    this.pubMsg = pubMsg || "Internal server error.";
    this.httpStatus = httpStatus || 500;
    
    // Standard error alias
    this.message = this.getPrivateMsg();
    
    // Build error stack
    var stack = (new Error(privMsg)).stack.split("\n");
    stack.splice(1, 1); // Remove extra first line : "at new MyError (.../error.class.js:7:18)"
    this.stack = stack.join("\n");
    
};

MyError.prototype.getPrivateMsg = function() {
    return this.privMsg;
};

MyError.prototype.getPublicMessage = function() {
    return this.pubMsg;
};

MyError.prototype.getStatus = function() {
    return this.httpStatus;
};

MyError.prototype.getTrace = function() {
    return this.stack;
};

MyError.prototype.toString = function() {
    return this.getPublicMessage();
};


module.exports = MyError;