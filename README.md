[![Discord](https://img.shields.io/discord/895561413819498556)](https://discord.gg/dCgStTDaet)  

Looking for the legacy C# app? You can find it [here](https://github.com/CptWesley/NewWorldMinimap/tree/master/dotnet)!

<img src="https://github.com/CptWesley/NewWorldMinimap/blob/master/docs/logo.png?raw=true" width="128" height="128">

# CptWesley's Minimap
Minimap for [Amazon's New World](https://www.newworld.com/).
The application uses Overwolf's approved API for getting character positions.
It then utilizes data obtained from [StudioLoot's New World Interactive Map](https://www.newworld-map.com/) to render all objects of interest around the player.

Join the [Discord](https://discord.gg/dCgStTDaet)!

## Current Features
- Render surroundings of the player (including resources).
- Track the player (including direction).
- Resizable window (great for full-screen usage on second monitor).
- Allow overlaying.
- Support for multiple monitors.
- Zooming on the map.
- Changing icon sizes.
- Showing icon text (can be turned off).
- Filter on certain resources.
- Configurable transparency.
- Resizeable and moveable overlay.
- Different minimap shapes.

## Planned Features
- Saving settings.

## Known Issues
- Nothing yet.

## Examples
<img src="https://github.com/CptWesley/NewWorldMinimap/blob/master/docs/example2.png?raw=true" width="512" height="288"><br>Second monitor full-screen window.  
<img src="https://github.com/CptWesley/NewWorldMinimap/blob/master/docs/example3.gif?raw=true" width="512" height="288"><br>In-game semi-transparent (configureable) overlay.  
<img src="https://github.com/CptWesley/NewWorldMinimap/blob/master/docs/example4.png?raw=true" width="402" height="374"><br>Different minimap shapes.

## Usage
- Currently not yet available, see the [legacy version](https://github.com/CptWesley/NewWorldMinimap/tree/master/dotnet) if you want a working application.

## Development

Currently, the Overwolf version of the application is the only supported one. The .NET application is considered legacy. This section will only contain information on how to develop the Overwolf application.

### Building and running

1. Ensure you have [NodeJS](https://nodejs.org) installed. Verify whether you can use npm by running <kbd>npm -v</kbd>. If it doesn't print an error, proceed with the next step.
2. Open a terminal in the `overwolf` directory of this repository.
3. Run `npm install` to download and install the required dependencies.
4. To build the application, you have two options:
  a. `npm run watch` will continuously build the application whenever there is an update. This is the recommended command.
  b. `npm run build` will build the application once, and also produce an .opk (Overwolf package) file.
5. Go to Overwolf Settings - About - Development options to open the Overwolf developer tools.
6. Select _Load unpacked extension..._ and navigate to the `overwolf/dist` directory of this repository. It contains the build output if the build was successful. You may get an error at this step, see below for more information.
7. Launch the application from the Overwolf dock, or launch the game to see the app in action.

When loading an unpacked extension, you might encounter an error where Overwolf will not allow you to load an unauthorized extension.
When this happens, you need to make two modifications to the file `overwolf\public\manifest.json`.
The fields `meta.name` and `meta.author` should be updated to have the values `"Sample App"` and `"Overwolf"` respectively; using these values allows you to use the unpacked extension.
In short, the manifest should look somewhat like the following:

```json
{
  "manifest_version": 1,
  "type": "WebApp",
  "meta": {
    "name": "Sample App",
    "author": "Overwolf",
```

### Development

Although there are no real requirements for developing the app, a nice editor is Visual Studio Code.
It offers integration with TypeScript, the language used for the extension.
If you decide to use Visual Studio Code, make sure to open the `overwolf` directory in VSCode.
Opening the repository root will work as well, but ESLint probably won't play nice then.

Should you decide to open the `overwolf` directory in VSCode, chances are you'll get a popup with some recommended extensions. These will help find code smells, or make the code adhere to this repository's style configuration.
You can use the built-in terminal to run commands such as `npm run watch` to automatically run webpack in watch mode, continuously building the application when a change is detected.

## Licensing
The source code is fully [MIT licensed](https://github.com/CptWesley/NewWorldMinimap/blob/master/LICENSE).

## Contribution
Any help is welcome. Feel free to open [issues or feature requests](https://github.com/CptWesley/NewWorldMinimap/issues) or create a [pull request](https://github.com/CptWesley/NewWorldMinimap/pulls).
