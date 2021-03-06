const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const config = require('./gameconfig.json');

module.exports = {
    mode: 'development',
    entry: {
        server: './server/server.js',
        ['unpacker.worker']: './server/ff/unpacker.worker.js',
        ['converter.worker']: './server/video/converter.worker.js'
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [
        nodeExternals(), 
        function (context, request, callback) {
            if (/\/vendor\/.+$/.test(request)){
                // Externalize to a commonjs module using the request path
                return callback(null, 'commonjs ' + request);
              }
        
              // Continue without externalizing the import
              callback();
        }
    ],
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    watchOptions: {
        ignored: ['dist/**']
    },
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
            cleanOnceBeforeBuildPatterns: [
                '**/*', 
                '!_resources', 
                '!_resources/**/*',
                '!vendor',  // Этим занимается CopyPlugin
                '!vendor/*'
            ]
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: 'vendor', 
                    to: 'vendor',
                    force: true
                }
            ]
        })
    ]
};