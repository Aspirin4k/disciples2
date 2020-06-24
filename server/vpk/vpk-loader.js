import path from 'path';
import glob from 'glob';

import config from '../../gameconfig';
import {getTree} from "./tree-loader";
import {unpack} from "./unpacker";

const getTrees = () => {
    const files = glob.sync(path.join(config.game_directory, 'vpks/*_dir.vpk'));

    const resultTree = files.reduce(
        (accumulator, fileName) => {
            const tree = getHumanReadableTree(getTree(fileName));
            return {
                ...accumulator,
                ...tree
            }
        },
        {}
    );

    return resultTree;
};

const unpackVpks = () => {
    const files = glob.sync(path.join(config.game_directory, 'vpks/*_dir.vpk'));

    files.forEach((fileName) => {
        const tree = getHumanReadableTree(getTree(fileName));
        const regex = /^(.+)_dir\.vpk$/;
        const baseFileName = fileName.match(regex)[1];
        unpack(tree, baseFileName);
    })
};

const getHumanReadableTree = (vpkTree) => {
    const humanReadable = {};
    Object.keys(vpkTree).forEach((extension) => {
        Object.keys(vpkTree[extension]).forEach((filepath) => {
            Object.keys(vpkTree[extension][filepath]).forEach((filename) => {
                humanReadable[path.join(filepath, filename) + '.' + extension] = vpkTree[extension][filepath][filename];
            })
        })
    });
    return humanReadable;
};

export { getTrees, unpackVpks };