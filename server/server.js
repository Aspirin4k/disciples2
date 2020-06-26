import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import {getTrees, unpackVpks} from "./vpk/vpk-loader";

import config from '../gameconfig';
import webpackConfig from '../webpack.server.config';
import {convertVideos} from "./video/converter";

const app = express();
app.set('view engine', 'ejs');

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.use('/resources', express.static(path.join(__dirname, config.server_resources)));
app.use('', express.static(__dirname));

app.get('/vpktree', (req, res) => {
    res.set('content-type', 'application/json');
    res.json(getTrees());
});

app.get('/vpk', (req, res) => {
    res.set('content-type', 'application/json');
    unpackVpks();
    res.json('ok');
});

app.get('/video', (req, res) => {
    res.set('content-type', 'application/json');
    convertVideos();
    res.json('ok');
});

app.get('*', (req, res) => {
    res.set('content-type', 'text/html');
    res.render(
        path.join(__dirname, 'index'),
        {
            title: 'Disciples II',
            data: 'her'
        }
    );
});

app.listen(config.server_port, () => {
    console.log(`App is listening on port ${config.server_port}`);
});