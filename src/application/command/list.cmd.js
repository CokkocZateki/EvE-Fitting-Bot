/*
*   ListCommand class
*   Implements the "list" command.
*/

"use strict";



// <============== Static requirements
var Q    = require("q");
var User = require(__dirname+"/../user.class.js");



/*
*   HelpCommand constructor
*/
var ListCommand = function() {
    this.bot = null;
};

/*
*   parse()
*   Parse @message and do stuff.
*/
ListCommand.prototype.init = function(bot) {
    this.bot = bot;
    return "list"; // the name of the command
};

/*
*   run()
*   Answer to the command.
*/
ListCommand.prototype.run = function(message) {
    // Check if user is authenticated
    var user = (new User()).loadDiscordId(message.author.id);
    if(user.isAuthenticated()) {
        return this.loadFits(message);
    } else {
        return this.requestAuthentication(message);
    }
};

/*
*   run()
*   Answer to the command.
*/
ListCommand.prototype.requestAuthentication = function(message) {
    var self = this;
    var user = (new User()).loadDiscordId(message.author.id);
    return Q().all([
        self.bot.client.sendMessage( message.author, "please use the following link to register. \n" + user.getRegisterLink() ), 
        self.bot.client.reply( message, "you are not registered, please follow the link sent by private message." )
    ]);
};

/*
*   loadFits()
*   Return the list of fits, as requested.
*/
ListCommand.prototype.loadFits = function(message) {
    var self = this;
    // Get fits
    var user = (new User()).loadDiscordId(message.author.id);
    return user.getAllFits().then(function(fits) {
        // Stringify and format results
        var fitList = fits.items.map(function(fit) {
            return "["+fit.fittingID+"] "+fit.name+" ("+fit.ship.name+")";
        });
        // Answer to user, but split in different messages as we are limited to 2000 characters per message.
        while(fitList.length > 0) {
            self.bot.client.reply(message, fitList.splice(0, 30).join("\n")).catch(function(err) { throw err });
        }
    }).done();
};



module.exports = ListCommand;