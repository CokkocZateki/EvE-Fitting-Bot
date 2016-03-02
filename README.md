# EvE-Fitting-Bot


## Description

EvE Fitting Bot is a bot for Discord able (at the moment) to retrive player fittings and display them.

The project is more a Proof Of Concept made for EvE Online API Challenge (https://developers.eveonline.com/blog/article/the-eve-online-api-challenge). But it relies on pretty solid bases and could be a lot improved and become really interesting.


##  Install

1. Create an account on https://developers.eveonline.com with the "CharacterFittingRead" permission.
 
Callback URL is `https://<your_host>/sso/auth_response/`.

2. Install Node and NPM (for example, `apt-get install nodejs npm`)

3. Make sure node version is at least 0.12.1 by running `node --version`

4. Install application using npm: `npm install eve-fitting-bot`

5. Make sure to setup configuration file (rename config.json.example to config.json and change values).
You will need to create the Bot account on Discord first (the program does not do it alone at the moment).


## Start

Run `node ./src/start.script.js`.

* You may want to edit the above script if you are not using port 80 (it is strongly recommanded to use an HTTPS proxy in front of your server, which is what is done for developements, or switch to HTTPS server in the code). *


## Example

You can see a working example by joining https://discord.gg/0rZvLaS6EJ4DbUPO (you don't even need a Discord account for it !).

For example, try to type `.efb help`.

If nothing happens, or for questions, you can PM "Shadow" from the above Discord server or drop a mail to `ryanis.shadow[dot]gmail.com`.


## Configuration

Some explanatiosn about configuration directives should be added here in the future.
