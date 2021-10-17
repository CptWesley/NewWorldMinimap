const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OverwolfPlugin = require('./overwolf.webpack');

const appName = "CptWesley's Minimap";
const appVersion = require('./package.json').version;
const appDate = new Date().toISOString();

module.exports = (env, argv) => {
    const prod = argv['mode'] !== 'development';
    const templateParameters = {
        appName,
        appVersion,
        appDate,
        prod,
    };

    return {
        entry: {
            background: './src/OverwolfWindows/background/background.ts',
            desktop: './src/OverwolfWindows/desktop/desktop.ts',
            in_game: './src/OverwolfWindows/in_game/in_game.ts'
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                "@": path.resolve(__dirname, 'src'),
            },
        },
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: 'js/[name].js'
        },
        plugins: [
            new CleanWebpackPlugin,
            new CopyPlugin({
                patterns: [{ from: "public", to: "./" }],
            }),
            new HtmlWebpackPlugin({
                template: './src/OverwolfWindows/background/background.html',
                templateParameters,
                filename: path.resolve(__dirname, './dist/background.html'),
                chunks: ['background']
            }),
            new HtmlWebpackPlugin({
                template: './src/OverwolfWindows/desktop/desktop.html',
                templateParameters,
                filename: path.resolve(__dirname, './dist/desktop.html'),
                chunks: ['desktop']
            }),
            new HtmlWebpackPlugin({
                template: './src/OverwolfWindows/in_game/in_game.html',
                templateParameters,
                filename: path.resolve(__dirname, './dist/in_game.html'),
                chunks: ['in_game']
            }),
            new OverwolfPlugin(env)
        ]
    };
};
