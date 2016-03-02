/*
*   HelpCommand class
*   Implements the "help" command.
*/

"use strict";



/*
*   HelpCommand constructor
*/
var HelpCommand = function() {
    this.bot = null;
};

/*
*   parse()
*   Parse @message and do stuff.
*/
HelpCommand.prototype.init = function(bot) {
    this.bot = bot;
    return "help"; // the name of the command
};

/*
*   run()
*   Answer to the command.
*/
HelpCommand.prototype.run = function(message) {
    return this.bot.client.reply(message, this.getHelp())
        .catch(function(err) { throw err });
};

/*
*   getHelp()
*   Return usage instruction as a string.
*/
HelpCommand.prototype.getHelp = function(message) {
    return [
        "**Eve Fitting Bot Usage**",
        "`" + this.bot.msgPrefix + " help`" + " - show this message,",
        "`" + this.bot.msgPrefix + " ping`" + " - reply \"pong\" (test command),",
        "`" + this.bot.msgPrefix + " list fits`" + " - list all character fits,",
        "`" + this.bot.msgPrefix + " get <id>`" + " - return @fit_name contents.",
        ].join("\n");
};



module.exports = HelpCommand;