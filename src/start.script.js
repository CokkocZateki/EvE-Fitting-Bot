/*
 *  This script starts the application in a default Cloud9 environment.
 *  Change port at your convenience.
 */

"use strict";

var port = 80; // default
if(typeof process.env.PORT != "undefined") // Cloud9 environement
    port = process.env.PORT;

var Application = require("./application/application.class.js");
(new Application()).start(port);