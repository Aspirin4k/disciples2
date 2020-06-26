const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js']
    },
    target: 'web',
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Disciples II',
            filename: 'index.ejs',
            template: '!!raw-loader!index.ejs',
            excludeChunks: [ 'server' ],
            inject: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        noEmitOnErrors: true
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
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    }
};