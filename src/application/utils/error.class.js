"use strict";

var MyError = function(privMsg, pubMsg, httpStatus) {
    
    var error = Error.apply(this, arguments);
    
    this.privMsg = error.privMsg;
    this.pubMsg = pubMsg || "Internal server error.";
    this.httpStatus = httpStatus || 500;
    
    // Standard error alias
    this.message = this.getPrivateMsg();
    
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