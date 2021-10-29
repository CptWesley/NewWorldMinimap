# cptwesley-minimap-server

This directory contains the source code for `cptwesley-minimap-server`, which is the server component. Currently, the features are:

- Sharing real-time game data with channels the player is in.
- [Deprecated] Sharing real-time game data with other players directly. This feature is replaced by the Channels feature, and will be removed in the future.

## Building and running

This application requires Node.js to run, and Yarn for dependency management.

1. Run `yarn install` to install the required dependencies.
2. Copy the file `.env.default` to `.env`, and optionally modify the setttings in `.env`.
3. Run `yarn start` to launch the web server.
4. You may also build the application by running `yarn build`. This will invoke the TypeScript compiler, and transpile the source code to JavaScript source files, in the `build` directory.
