<img src="https://raw.githubusercontent.com/CptWesley/NewWorldMinimap/master/Resources/icons/app_128.png" width="128" height="128">

# CptWesley's Minimap
Minimap for [Amazon's New World](https://www.newworld.com/).
The application takes screenshots of your desktop and performing **Optical Character Recognition** (OCR) to detect your position on the world map.
It then utilizes data obtained from [StudioLoot's New World Interactive Map](https://www.newworld-map.com/) to render all objects of interest around the player.
The application **DOES NOT** actively interact with the game window itself. It **DOES NOT** inject itself. It **DOES NOT** read out memory. It **DOES NOT** feed input into the game.
It **ONLY** takes screenshots of your screen.

## Examples
TODO

## Current Features
- Render surroundings of the player (including resources).
- Track the player.
- Resizable window (great for full-screen usage on second monitor).

## Planned Features
- Better OCR results.
- More (nicer) icons.
- Allow overlaying (always-on-top) flag.
- Support instances where game is running on different monitor than primary monitor.
- Enable/disable certain icons (and other configuration option).

## Known Issues
- The Optical Character Recognition (OCR) algorithm is not perfect so it sometimes jumps a bit.
- Position accuracy results may vary based on your graphics settings of the game (only tested on default brightness/gamma on 1080p monitor).
- Currently it only works if the game is running on your primary monitor.

## Usage
- Download the latest version found on the [Download page](https://github.com/CptWesley/NewWorldMinimap/releases).
- Unzip the `.zip`.
- Run the application (the `.exe` file).
- Enable the option 'Show FPS' in-game.

## Licensing
The source code is fully [MIT licensed](https://github.com/CptWesley/NewWorldMinimap/blob/master/LICENSE).
However, the binary distribution contains a statically linked [Apache V2 licensed](https://github.com/CptWesley/NewWorldMinimap/blob/master/dependency_licenses/tesseract_LICENSE) dependency (tesseract).

## Contribution
Any help is welcome. Feel free to open [issues or feature requests](https://github.com/CptWesley/NewWorldMinimap/issues) or create a [pull request](https://github.com/CptWesley/NewWorldMinimap/pulls).
