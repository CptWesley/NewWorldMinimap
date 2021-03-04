# Sample - TS
Example-ts is an example app, meant to be used as a reference for developers who are new to Overwolf.
The app is meant to demonstrate some basic points and flows that are relevant when developing Overwolf apps:

- Auto-launch when a game starts.
- Register to the overwolf.games.events API and receive real time events from the game.
- Define a custom hotkey to be used in-game.
- Communicate between the app windows according to our best practices.


## Setting up
In order to run the app, you must first complete several steps:
1. Download and install [NodeJS](https://nodejs.org/).
After installing, run the following commands in a terminal of your choice:
```
node -v
npm -v
```
If they run successfully, proceed to the next steps.

2. Download and install the [Overwolf desktop client](https://download.overwolf.com/install/Download).

3. Download the repository as a zip file and extract it.

4. In your terminal, run the following commands:
```
cd <insert path to your extracted 'ts' folder here>
npm install
npm run build
```

5. Open the Overwolf desktop client settings (by right-clicking the client and selecting
"Support" or by clicking on the wrench icon in the dock and going to the "Support" tab).

6. Click on "Development options".

7. In the opened window, click on "Load unpacked extension" and select the `ts/dist/` folder.
This will add the app to your dock.

8. Click on the app's icon in your dock.

## Building an .opk for distribution
When you run run ```npm run build``` in your terminal, an .opk is created in releases/ directory

## Changing the version number quickly
We have included a webpack plugin that can change the .opk version quickly with just a command line argument. Simply add ```--env setVersion=1.0.1``` to your build command.
Example:
```
npm run build --env setVersion=1.0.1
```

This will change the app version both in package.json and app's manifest.json

## What will you find inside?

### public/
All of the static resources used by the app, like icons, images and CSS

##### public/manifest.json
This file defines all of the aspects of the app.
Read all about Overwolf's manifest.json mechanism [here](https://overwolf.github.io/docs/api/manifest-json#welcome-to-the-manifestjson-file).
In our manifest.json file, we have [```{ "start_window": "background" }```](https://overwolf.github.io/docs/api/manifest-json#start_window) defined.
This sets our [background](###windows/background) window as the app's starting point.
All of this app's windows' properties can be found under the [```windows```](https://overwolf.github.io/docs/api/manifest-json#window-data) object.
Please refer to the [dev site](https://overwolf.github.io/docs/api/manifest-json#welcome-to-the-manifestjson-file) to learn more about each property.

#### src/
Source .html & .ts files for the app

##### src/background/
This directory contains files of the background window, which serves as the application's starting point and window orchestrator.
The window's ```run()``` method detects whether a Fortnite game is currently running, decides which window to launch accordingly, and listens for changes.

The background window has no visual representation, which can be gleaned from the empty background.html file or from the
[```{ is_background_page: true }```](https://overwolf.github.io/docs/api/manifest-json#is_background_page)
property the background window has in our manifest.json.

##### src/in_game/
The in_game window listens to [Info Events](https://overwolf.github.io/docs/api/overwolf-games-events#oninfoupdates2) and
[Game Events](https://overwolf.github.io/docs/api/overwolf-games-events#onnewevents) emitted by the game and
displays an ad. Furthermore, it defines the behavior for the show/hide hotkey.
Read all about hotkeys [here](https://overwolf.github.io/docs/topics/hotkeys-best-practices).

##### src/desktop/
This window serves a purely visual purpose and has no special logic.

##### src/AppWindow.js
This is a base class that holds the logic shared by the in_game and desktop windows, such as minimize/close, drag, etc.


## Notes
Editing the author or app name in the manifest will prevent loading the app as an unpacked app.

For any further information or questions, contact developers@overwolf.com
