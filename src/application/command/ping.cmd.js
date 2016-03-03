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
*   Return command name as string.
*/
PingCommand.prototype.init = function(bot) {
    this.bot = bot;
    return "ping"; // the name of the command
};

/*
*   run()
*   Answer to the command.
*   Return a promise.
*/
PingCommand.prototype.run = function(message) {
    return this.bot.client.reply(message, "pong")
        .catch(function(err) { throw err });
};



module.exports = PingCommand;