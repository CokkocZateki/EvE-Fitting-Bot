/*
*   Bot class
*   Implements bot behaviour.
*/

"use strict";



// <============== Static requirements
var fs      = require("fs");
var Q       = require("q");
var Discord = require("discord.js");
var winston = require("winston");
var config  = require(__dirname+"/utils/config.single.js");



/*
*   Bot constructor
*/
var Bot = function() {
    // Discord client (aka. "bot")
    this.client = null;
    // Messages prefix
    this.msgPrefix = config.get("command_prefix") || ".efb";
    // Available commands handlers
    this.commands = {};
};

/*
*   init()
*   Create Discord client (the "bot") and initialize behaviour.
*/
Bot.prototype.init = function() {
    var self = this;
    self.client = new Discord.Client();
    
    // Message handler
    self.client.on("message", function(message) {
        self.parse(message);
    });
    
    // Log when ready
    self.client.on("ready", function () {
    	winston.loggers.get("main").info("Bot ready, serving in " + self.client.channels.length + " channels.");
    });

    // Disconection
    self.client.on("disconnected", function () {
    	winston.loggers.get("main").info("Bot disconnected.");
    });
    
    // Load commands
    return self.loadCmd().then(function() {
        // Discord login
        var user = config.get("discord_username");
        var pass = config.get("discord_password");
        return self.client.login(user, pass).catch(function(err) { throw err.error });
    });
};

/*
*   loadCmd()
*   Look in ./command/ and load all commands from files.
*/
Bot.prototype.loadCmd = function() {
    var self = this; var nbCmd = 0;
    // Read directory
    return Q.denodeify(fs.readdir)(__dirname+"/command").then(function(files) {
        files.map(function(fileName) {
            if(fileName.substr(-7) == ".cmd.js") { // only parse .cmd.js files
                try {
                    // Instanciate the command and register it
                    var Command = require(__dirname+"/command/"+fileName);
                    var cmd = new Command();
                    var name = cmd.init(self);
                    self.commands[name] = cmd;
                    nbCmd++;
                } catch(err) {
    	            winston.loggers.get("main").error("Error parsing command file "+fileName+":\n"+err.stack);
                }
            }
        });
        winston.loggers.get("main").info("Bot has loaded "+nbCmd+" command(s).");
    });
};

/*
*   parse()
*   Parse @message and do stuff.
*/
Bot.prototype.parse = function(message) {
    // Split command into argumetns
    var args = message.content.split(" ");
    // If message does not begin by (message prefix (".efb"), we don't need to do anything
    if(args.shift() !== this.msgPrefix) return;
    // Get command and check if the is a command handler registered for it
    var cmd = args.shift();
    if(typeof this.commands[cmd] == "undefined") {
        // If unknown command, show an error message.
        return this.client.reply(message, "unknown command \""+cmd+"\". \n"+"Try `"+this.msgPrefix+" help`.")
            .catch(function(err) { throw err });
    } else {
        // Else, just run the command
        return this.commands[cmd].run(message);
    }
};



module.exports = Bot;