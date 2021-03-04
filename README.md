# Overwolf sample app

This repository contains sample apps that demonstrate some basic points and flows that are relevant when developing Overwolf apps:

- The apps will launch automatically when Fortnite starts
- Register to the overwolf.games.events API in order to receive real time events from the game.
- Define a custom hotkey to be used in-game
- Communication between the app windows according to our best practices 

## Sample app versions

This repository contains two variants of the sample app:

* native - pure js version without any external js framework.
* ts - typeScript version of the app, that uses external packages,etc.

In the future we will add more variants like React, Vue, etc.

## How to load the app

### Download from the store

It's highly recommended to follow the build steps for setting up the sample app, including download the source code and built it manually.  
For those who need it, here is a [direct download link]((https://www.overwolf.com/app/Overwolf-Sample_App)) to the latest version on the store.

### Load as unpackged extension.

You can load the native version of the sample app "as is", without any build process. Just download the repo and under Overwolf's settings, choose Support tab and then Development options. Click the Load unpacked button and choose the relevant folder of the native folder from the repository you just downloaded.

* To load the typescript version, first you should build it. More details on the readme page under the "ts" folder in this repo.

## Notes

Editing the author or app name in the manifest will prevent loading the app as unpacked app.  

For any further information or questions, contact developers@overwolf.com
