# Example-ts
Example-ts is an example app, meant to be used as a reference for developers new
to Overwolf.

## Setting up
In order to run the app, you must have several things installed:
1. First, you must have [NodeJS](https://nodejs.org/) installed.
After installing, run the following commands:
```
node -v
npm -v
```
If they run successfully, proceed to the next steps.

2. Next, download the [Overwolf desktop client](https://download.overwolf.com/install/Download).

3. Download the repository as a zip file and extract it.

4. Open the extracted folder in your preferred IDE.

5. From within the folder, run the following commands:
```
npm install
npm run dev
```

6. Open the Overwolf desktop client settings (by right-clicking the client and selecting "Support" or by clicking on the wrench icon in the dock and going to the "Support" tab).

7. Click on "Development options".

8. In the opened window, click on "Load unpacked extension" and select the extracted folder. This will add the app to your dock.

9. Click on the app's icon in your dock.


## What will you find inside?
### manifest.json
This file defines all of the aspects of the app. Read all about Overwolf's manifest.json mechanism [here](https://overwolf.github.io/docs/api/manifest-json#welcome-to-the-manifestjson-file).
In our manifest.json file, we have [```{ "start_window": "background" }```](https://overwolf.github.io/docs/api/manifest-json#start_window) defined. This sets our [background](###windows/background) window as the app's starting point. All of this app's windows' properties can be found under the [```windows```](https://overwolf.github.io/docs/api/manifest-json#window-data) object. Please refer to the [dev site](https://overwolf.github.io/docs/api/manifest-json#welcome-to-the-manifestjson-file) to learn more about each property.


### windows/background
This folder holds the background window, which serves as the application's starting point and window orchestrator. The window's ```run()``` method detects whether a Fortnite game is currently running, decides which window to launch accordingly, and listens for changes.

The background window has no visual representation, which can be gleaned from the empty background.html file or from the [```{ is_background_page: true }```](https://overwolf.github.io/docs/api/manifest-json#is_background_page) property the background window has in our manifest.json.


### windows/in_game
The in_game window listens to [Info Events](https://overwolf.github.io/docs/api/overwolf-games-events#oninfoupdates2) and [Game Events](https://overwolf.github.io/docs/api/overwolf-games-events#onnewevents) emitted by the game and displays an ad. Furthermore, it defines the behavior for the show/hide hotkey. Read all about hotkeys [here](https://overwolf.github.io/docs/topics/hotkeys-best-practices).


### windos/desktop
This window serves a purely visual purpose and has no special logic.


### windows/AppWindow
This is a base class that holds the logic shared by the in_game and desktop windows, such as minimize/close, drag, etc.


### odk-ts and types
Currently, the Overwolf SDK is written in javascript. These folders hold typescript wrappers and type definitions for the SDK methods used in this app.

We are constantly working on improving our SDK, and a full conversion to typescript is one of our future goals.


### css, icons, and images
All of the visual resources used by the app.