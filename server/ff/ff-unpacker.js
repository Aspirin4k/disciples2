import fs from 'fs';
import path from 'path';

import { FF_SIGNATURE } from '../consts';
import { BinaryWrapper } from '../binary/BinaryWrapper';
import { logger } from '../logger';
import { unpackAnimation } from './anim-unpacker';
import { FF } from './model/ff';
import { getMQRC } from './parser/mqrc-parser';

// Благодарность Андрею Фролову
// https://www.extractor.ru/files/6762baed64c88af84c7d9c2fab817808/
const unpack = (fileName) => {
    // Распакуем в папку с названием файла
    const fileNameFolder = path.join(path.dirname(fileName), path.basename(fileName, path.extname(fileName)));
    fs.mkdirSync(fileNameFolder, { recursive: true });

    logger.debug('Unpacking ' + fileNameFolder);

    const binaryWrapper = new BinaryWrapper(fs.readFileSync(fileName));
    
    const MQDB = binaryWrapper.readChar(4);
    if (FF_SIGNATURE !== MQDB) {
        return;
    }

    const ff = new FF();
    // Прыжок к MQRC
    binaryWrapper.setCursor(0x1c);

    ff.addMQRCList(getMQRC(binaryWrapper));

    const archiveDescription = ff.getMQRCArchiveDescription();
    binaryWrapper.setCursor(archiveDescription.getOffset());

    const filesCount = binaryWrapper.readInt();
    logger.debug('Files Count: ' + filesCount);
    for (let iterator = 0; iterator < filesCount; iterator++) {
        const fileName = binaryWrapper.readChar(256).replace(/\u0000/g, '');
        const fileMqrcId = binaryWrapper.readInt();
        logger.debug('File MQRC ID: ' + fileMqrcId);
        logger.debug('File Name: ' + fileName);

        ff.setMQRCName(fileMqrcId, fileName);
        const mqrc = ff.getMQRC(fileMqrcId);
        fs.writeFileSync(
            path.join(fileNameFolder, fileName), 
            binaryWrapper.getBuffer().slice(mqrc.getOffset(), mqrc.getOffset() + mqrc.getSize())
        );
    }

    unpackAnimation(fileNameFolder, ff);
}



export { unpack };