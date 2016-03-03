# EvE-Fitting-Bot


## Description

EvE Fitting Bot is a bot for Discord able (at the moment) to retrive player fittings and display them.

The project is more a Proof Of Concept made for EvE Online API Challenge (https://developers.eveonline.com/blog/article/the-eve-online-api-challenge). But it relies on pretty solid bases and could be easily improved up to a complete and useful bot.


##  Install

1. Create an account on https://developers.eveonline.com with the "CharacterFittingRead" permission. Callback URL is `https://<your_host>/sso/auth_response/`.
2. Install Node and NPM (for example, `apt-get install nodejs npm`).
3. Make sure node version is at least 0.12.1 by running `node --version`.
4. Clone repository: `git clone https://github.com/ShadowRyanis/EvE-Fitting-Bot.git`.
5. Install dependencies using npm: `npm install`.
6. Create a Discord account for the Bot and join your server(s) (the program does not do it alone at the moment).
7. Make sure to setup configuration file (rename config.json.example to config.json and change values).



## Start

Run `node ./src/start.script.js`.
You should see an output similar to:
```node ./src/start.script.js
info: HTTP server started on port 8080.
info: Bot has loaded 4 command(s).
info: Bot ready, serving in 14 channels.```

* You may want to edit the above script if you are not using port 80.
* It is strongly recommanded to use an HTTPS proxy in front of your server or switch to HTTPS (this last action probably requires code modifications).


## Example

You can see a working example by joining https://discord.gg/0rZvLaS6EJ4DbUPO (you don't even need a Discord account for it !).

For example, try to type `.efb help`.

If nothing happens, or for questions, you can PM "Shadow" from the above Discord server or drop a mail to `ryanis.shadow[dot]gmail.com`.


## Configuration

The list below describes briefly each configuration directive.
* `session_secret` : password used internally to encrypt session data. Just set something random here.
* `discord_username` : Discord username of the bot. You need to register an account on Discord manually.
* `discord_password` : Discord password of the bot.
* `local_protocol` : protocol of the local server on which the application is deployed (you generally want "https").
* `local_hostname` : hostname of the above server.
* `hash_salt` : salt used during hashing. Just set something random here.
* `app_client_id`: client ID of CREST account (you can create one on developers.eveonline.com).
* `app_client_secret` : client secret of the above account.
* `command_prefix` : command prefix for triggerring Bot answer (defaults to ".efb").
* `sso_host` : hostname of SSO server (that's currently "login.eveonline.com" and should not change).
* `crest_host` : hostname of CREST server (that's currently "crest-tq.eveonline.com" and should not change).


## Improvements

Potential improvements (totally not a roadmap).
* Add automatic tests.
* Add more commands (example: ship info, map...).
* Identify fittings by name instead of ID.
* Improve formatting and readability.
* Add an index page.
* Automate Discord account creation.
* ...


## Contributing

* Feel free to clone, copy or edit this project.
* Pull requests are welcomed.


## Copyright Notice

EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide.
All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf
All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf.

CCP hf. has granted permission to use EVE Online and all associated logos and designs for promotional and information purposes on its website but does not endorse, and is not in any way affiliated with the developer.
CCP is in no way responsible for the content on or functioning of this website, nor can it be liable for any damage arising from the use of this website.
