// сбилдил https://github.com/Kagami/ffmpeg.js/
// demuxer - bink
// decoders - bink binkaudio_dct binkaudio_rdft
import ffmpeg from './vendor/ffmpeg-mp4.js'
import glob from 'glob';
import path from 'path';
import fs from 'fs';

import config from '../../gameconfig';
import { logger } from "../logger";

const TARGET_FORMAT = '.mp4';

// TODO: ускорить. треды?
const convertVideos = () => {
    const files = glob.sync(path.join(__dirname, config.server_resources, '**/*.bik'));
    files.forEach(convertBikToMP4);
}

const convertBikToMP4 = (absoluteFileName) => {
    const inputData = fs.readFileSync(absoluteFileName);
    const fileName = path.basename(absoluteFileName);
    const filePath = path.dirname(absoluteFileName);
    const fileNameWithoutExtenstion = path.basename(absoluteFileName, path.extname(absoluteFileName));
    
    const targetFileName = fileNameWithoutExtenstion + TARGET_FORMAT
    
    const result = ffmpeg({
        MEMFS: [{name: fileName, data: inputData}],
        arguments: ['-i', fileName, targetFileName],
        print: (data) => { logger.debug(data); },
        printErr: (data) => { logger.error(data); }
    });

    const out = result.MEMFS[0];
    fs.writeFileSync(path.join(filePath, out.name), Buffer.from(out.data));
};

export { convertVideos };