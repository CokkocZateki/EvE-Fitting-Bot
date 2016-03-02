/*
*   PingCommand class
*   Implements the "ping" command.
*/

"use strict";



/*
*   HelpCommand constructor
*/
var PingCommand = function() {
    this.bot = null;
};

/*
*   parse()
*   Parse @message and do stuff.
*/
PingCommand.prototype.init = function(bot) {
    this.bot = bot;
    return "ping"; // the name of the command
};

/*
*   run()
*   Answer to the command.
*/
PingCommand.prototype.run = function(message) {
    return this.bot.client.reply(message, "pong")
        .catch(function(err) { throw err });
};



module.exports = PingCommand;