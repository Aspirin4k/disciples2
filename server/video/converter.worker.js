const { parentPort } = require('worker_threads');
// сбилдил https://github.com/Kagami/ffmpeg.js/
// demuxer - bink
// decoders - bink binkaudio_dct binkaudio_rdft
// TODO: убрать лишние декодеры из билда?
const ffmpeg = require('./vendor/ffmpeg-mp4.js')

const path = require('path');
const fs = require('fs');

const TARGET_FORMAT = '.mp4';

const convertBikToMP4 = (absoluteFileName) => {
    console.log(absoluteFileName);
    const inputData = fs.readFileSync(absoluteFileName);
    const fileName = path.basename(absoluteFileName);
    const filePath = path.dirname(absoluteFileName);
    const fileNameWithoutExtenstion = path.basename(absoluteFileName, path.extname(absoluteFileName));
    
    const targetFileName = fileNameWithoutExtenstion + TARGET_FORMAT
    
    const result = ffmpeg({
        MEMFS: [{name: fileName, data: inputData}],
        arguments: ['-i', fileName, targetFileName],
        print: (data) => { console.log(data); },
        printErr: (data) => { console.log(data); }
    });

    const out = result.MEMFS[0];
    fs.writeFileSync(path.join(filePath, out.name), Buffer.from(out.data));
};

parentPort.on('message', (workerData) => {
    const fileName = workerData;
    convertBikToMP4(fileName);
    parentPort.postMessage('ok');
})