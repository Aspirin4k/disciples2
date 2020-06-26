const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    entry: {
        server: './server/server.js'
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [
        nodeExternals(), 
        {
            "./vendor/ffmpeg-mp4.js": "commonjs2 ./vendor/ffmpeg-mp4.js"
        }
    ],
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                // Transpiles ES6-8 into ES5
                test: /\.js$/,
                exclude: /node_modules|vendor/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['**/*', '!_resources', '!_resources/**/*']
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: 'vendor', 
                    to: 'vendor',
                    force: true
                }
            ]
        }),
    ]
};