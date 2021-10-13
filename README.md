[![Discord](https://img.shields.io/discord/895561413819498556)](https://discord.gg/dCgStTDaet)  

# Note: The project is currently being rewritten to use Overwolf. This should allow us to read the characters through an approved API rather than performing non-approved OCR. This also means more accurate results.

<img src="https://github.com/CptWesley/NewWorldMinimap/blob/master/src/NewWorldMinimap/Resources/icons/app_128.png?raw=true" width="128" height="128">

# CptWesley's Minimap
Minimap for [Amazon's New World](https://www.newworld.com/).
The application takes screenshots of your desktop and performing **Optical Character Recognition** (OCR) to detect your position on the world map.
It then utilizes data obtained from [StudioLoot's New World Interactive Map](https://www.newworld-map.com/) to render all objects of interest around the player.
The application **DOES NOT** actively interact with the game window itself. It **DOES NOT** inject itself. It **DOES NOT** read out memory. It **DOES NOT** feed input into the game.
It **ONLY** takes screenshots of your screen.

Join the [Discord](https://discord.gg/dCgStTDaet)!

## Examples
<img src="https://github.com/CptWesley/NewWorldMinimap/blob/master/docs/example1.jpg?raw=true" width="512" height="288">

## Current Features
- Render surroundings of the player (including resources).
- Track the player.
- Resizable window (great for full-screen usage on second monitor).
- Allow overlaying (always-on-top) flag.
- Support for multiple monitors.
- Configure refresh rate of minimap to spare your CPU.
- CTRL + D hotkey to enable/disable Overlay Mode.
- CTRL + S hotkey to hide/show the map.
- Circle shape mode.

## Planned Features
- Better OCR results.
- More (nicer) icons.
- Enable/disable certain icons (and other configuration option).

## Known Issues
- The Optical Character Recognition (OCR) algorithm is not perfect so it sometimes jumps a bit.
- Position accuracy results may vary based on your graphics settings of the game (only tested on default brightness/gamma on 1080p monitor, 1440p monitors and 4k monitors).
- Currently it only works if the game is running on your primary monitor.

## Usage
- Download the latest version found on the [Download page](https://github.com/CptWesley/NewWorldMinimap/releases).
- Unzip the `.zip`.
- Run the application (the `.exe` file).
- Enable the option 'Show FPS' in-game.
- Right click the minimap to configure some settings.

## Licensing
The source code is fully [MIT licensed](https://github.com/CptWesley/NewWorldMinimap/blob/master/LICENSE).
However, the binary distribution contains statically linked [Apache-2.0](https://github.com/CptWesley/NewWorldMinimap/blob/master/dependency_licenses/tesseract_LICENSE) dependencies (tesseract, ImageSharp) and dependencies with custom licenses (leptonica).
The license files of the dependencies can be found in the `./dependency_licenses` directory.

## Contribution
Any help is welcome. Feel free to open [issues or feature requests](https://github.com/CptWesley/NewWorldMinimap/issues) or create a [pull request](https://github.com/CptWesley/NewWorldMinimap/pulls).
