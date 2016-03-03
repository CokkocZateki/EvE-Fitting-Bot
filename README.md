# EvE-Fitting-Bot


## What is it ?

### Description

EvE Fitting Bot is a bot for Discord able (at the moment) to retrive player fittings and display them.

The project is more a Proof Of Concept made for EvE Online API Challenge (https://developers.eveonline.com/blog/article/the-eve-online-api-challenge). But it relies on pretty solid bases and could be easily improved up to a complete and useful bot.

|                        A few screenshots                        |
|:---------------------------------------------------------------:|
| ![efb help](http://img4.hostingpics.net/pics/302549efbhelp.png) |
| ![efb list](http://img4.hostingpics.net/pics/465930efblist.png) |
| ![efb show](http://img4.hostingpics.net/pics/581883efbshow.png) |

### Example

You can see a working example by joining https://discord.gg/0rZvLaS6EJ4DbUPO (you don't even need a Discord account for it !).

For example, try to type `.efb help`.

_If nothing happens, or for questions, you can PM "Shadow" from the above Discord server or drop a mail to `ryanis.shadow[dot]gmail.com`._


## How to use it ?

###  Install

1. Create an account on https://developers.eveonline.com with the "CharacterFittingRead" permission.
  * Callback URL is `https://<your_host>/sso/auth_response/`.
2. Install Node and NPM (for example, `apt-get install nodejs npm`).
3. Make sure node version is at least **0.12.1** by running `node --version`.
4. Clone repository: `git clone https://github.com/ShadowRyanis/EvE-Fitting-Bot.git`.
5. Install dependencies using npm: `npm install`.
6. Create a Discord account for the Bot and join your server(s) (the program does not do it alone at the moment).
7. Make sure to setup configuration file (rename config.json.example to config.json and change values).

### Start

Running the server is pretty simple:
* Run `node ./src/start.script.js` in your favorite shell.
* You should see an output similar to:

```
node ./src/start.script.js
info: HTTP server started on port 8080.
info: Bot has loaded 4 command(s).
info: Bot ready, serving in 14 channels.
```

* You may want to edit start.script.js if you are not using port 80.
* It is strongly recommanded to use an HTTPS proxy in front of your server or switch to HTTPS (this last action probably requires code modifications).

### Configuration

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


### How registration works

In order to retreive player fittings from CREST API, the application (the "Bot") needs to link Discord ID with EvE Online ID.
This is done in the following way:
* When a client issues a command requireing CREST access, the server checks in local database if his/her Discord ID is registered.
* If not, a link is built and sent by private message. The link contains:
  * The Discord ID of the user ;
  * A verification code generated randomly and stored in cache on the server (to prevent someone else to register with this ID).
* The user visits this link and is redirected to EvE SSO for authentication (standard OAuth protocol).
* Once authenticated, the user is redirected to the server where OAuth credentials are verified.
* Then, the server requests the associated character ID and links it with Discord ID.
* OAuth tokens and both IDs are then saved in database for future usage.
Next time, when the user requests a fitting, the server finds EvE ID from Discord ID and uses OAuth tokens to request CREST API.

Basically, this is what database looks like:

Discord ID         | EvE Character ID | OAuth access\_token | OAuth refresh\_token | Cached CREST data |
------------------ | ---------------- | ------------------- | -------------------- | ----------------- |
147811543390617999 | 92130600         | N7HQx3HD...96TREEU0 | F7GTXZ3X...C96MMPOAA | _json-data_       |
147811543390600000 | 92100000         | 96TREEU0...N7HQx3HD | 96MMPOAA...F7GTXZ3XC | null              |
147810001268645011 | null             | null                | null                 | null              |


## Going further

### Improvements

Potential improvements (totally not a roadmap):
* [x] Basic bot functionalities with `list` and `show` commands.
* [ ] Add automatic tests (quality).
* [ ] Automaticaly build help instead of using hardcoded values (quality).
* [ ] Change answer behaviour to remove mentions (Discord bots best practices).
* [ ] Add several characters for each Discord account (ergonomy).
* [ ] Identify fittings by name instead of ID (ergonomy).
* [ ] Improve formatting and readability (ergonomy).
* [ ] Add an index page (ergonomy).
* [ ] Automate Discord account creation (ergonomy).
* [ ] Add more commands like ship info, map... (fonctionality).

### Contributing

* Feel free to clone, copy or edit this project.
* Bugs should be reported on GitHub using the pretty standard "issues" fonction.
* Pull requests are welcomed.



## Copyright Notice

EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide.
All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf
All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf.

CCP hf. has granted permission to use EVE Online and all associated logos and designs for promotional and information purposes on its website but does not endorse, and is not in any way affiliated with the developer.
CCP is in no way responsible for the content on or functioning of this website, nor can it be liable for any damage arising from the use of this website.
