/*
*   ShowCommand class
*   Implements the "show" command.
*/

"use strict";



// <============== Static requirements
var Q    = require("q");
var User = require(__dirname+"/../user.class.js");



/*
*   HelpCommand constructor
*/
var ShowCommand = function() {
    this.bot = null;
};

/*
*   parse()
*   Parse @message and do stuff.
*/
ShowCommand.prototype.init = function(bot) {
    this.bot = bot;
    return "show"; // the name of the command
};

/*
*   run()
*   Answer to the command.
*/
ShowCommand.prototype.run = function(message) {
    // Check if user is authenticated
    var user = (new User()).loadDiscordId(message.author.id);
    if(user.isAuthenticated()) {
        return this.loadFit(message);
    } else {
        return this.requestAuthentication(message);
    }
};

/*
*   run()
*   Answer to the command.
*/
ShowCommand.prototype.requestAuthentication = function(message) {
    var self = this;
    var user = (new User()).loadDiscordId(message.author.id);
    return Q().all([
        self.bot.client.sendMessage( message.author, "please use the following link to register. \n" + user.getRegisterLink() ), 
        self.bot.client.reply( message, "you are not registered, please follow the link sent by private message." )
    ]);
};

/*
*   loadFit()
*   Return the requested fit.
*/
ShowCommand.prototype.loadFit = function(message) {
    var self = this;
    // Get fits
    var user = (new User()).loadDiscordId(message.author.id);
    return user.getAllFits().then(function(fits) {
        // Read arguments from message
        var args = message.content.split(" ");
        if(args.length < 3) // If there is not a 3rd argument, then command is incorrect
            return self.bot.client.reply(message, "incorrect command: not fit ID provided.").catch(function(err) { throw err });
        var id = args[2];
        // Find the requested fit in list
        for(var i in fits.items) {
            var fit = fits.items[i];
            if(fit.fittingID == id) { // Found
                // Stringify and format fitting
                var modules = fit.items.map(function(mod) {
                    if(mod.quantity > 1)
                        return mod.type.name + " x" + mod.quantity;
                    else
                        return mod.type.name;
                });
                // Answer
                var answer = "**"+fit.name+"**\n"
                    + "*Description: "+fit.description + "*\n\n"
                    + modules.join("\n");
                return self.bot.client.reply(message, answer).catch(function(err) { throw err });
            }
        }
        // If fit is not found, reply with error
        return self.bot.client.reply(message, "no fit with "+id+" ID found.").catch(function(err) { throw err });
    }).done();
};



module.exports = ShowCommand;