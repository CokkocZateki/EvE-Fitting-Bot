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
*   Return a promise.
*/
ShowCommand.prototype.run = function(message) {
    // Check if user is authenticated
    var user = (new User()).loadDiscordId(message.author.id);
    if(user.isAuthenticated()) {
        // If authenticated, load fits
        return this.loadFit(message);
    } else {
        // Else, ask for authentication
        return this.requestAuthentication(message);
    }
};

/*
*   requestAuthentication()
*   Send a private message to Discord client with instsructions for registering.
*   Return a promise.
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
*   Return a promise.
*/
ShowCommand.prototype.loadFit = function(message) {
    var self = this;
    // Read arguments from message
    var args = message.content.split(" ");
    if(args.length < 3) // If there is not a 3rd argument, then command is incorrect
        return self.bot.client.reply(message, "incorrect command: not fit ID provided.").catch(function(err) { throw err });
    var id = args[2];
    // Get fits
    var user = (new User()).loadDiscordId(message.author.id);
    return user.getAllFits().then(function(fits) {
        // Find the requested fit in list
        for(var i in fits.items) {
            var fit = fits.items[i];
            if(fit.fittingID == id) { // Found
                return self.bot.client.reply(message, self.formatFit(fit)).catch(function(err) { throw err });
            }
        }
        // If fit is not found, reply with error
        return self.bot.client.reply(message, "no fit with "+id+" ID found.").catch(function(err) { throw err });
    }).done();
};

/*
*   formatFit()
*   Format fit as a string and return it.
*/
ShowCommand.prototype.formatFit = function(fit) {
    // Stringify and format modules
    var modules = fit.items.map(function(mod) {
        if(mod.quantity > 1) {
            return mod.type.name + " x" + mod.quantity;
        } else {
            return mod.type.name;
        }
    });
    // Format fit with name, description and modules
    return  "**"+fit.name+"**\n"
        + "_Description: "+fit.description + "_\n\n"
        + modules.join("\n");
};



module.exports = ShowCommand;