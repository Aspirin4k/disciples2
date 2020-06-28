import path from 'path';
import glob from 'glob';

const { unpack } = require("./unpacker")
import config from '../../gameconfig.json';

const unpackFFs = () => {
    const files = glob.sync(path.join(__dirname, config.server_resources, '**/*.ff'));

    files.forEach((fileName) => {
        unpack(fileName);
    });
}

export { unpackFFs };