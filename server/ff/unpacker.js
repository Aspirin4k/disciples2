import fs from 'fs';
import path from 'path';

import { FF_SIGNATURE, FF_MQRC_SIGNATURE, INT_SIZE } from '../consts';
import { BinaryWrapper } from '../binary/BinaryWrapper';
import { logger } from '../logger';

// Благодарность Андрею Фролову
// https://www.extractor.ru/files/6762baed64c88af84c7d9c2fab817808/
const unpack = (fileName) => {
    // Распакуем в папку с названием файла
    const fileNameFolder = path.join(path.dirname(fileName), path.basename(fileName, path.extname(fileName)));
    fs.mkdirSync(fileNameFolder, { recursive: true });

    const binaryWrapper = new BinaryWrapper(fs.readFileSync(fileName));
    
    const MQDB = binaryWrapper.readChar(4);
    if (FF_SIGNATURE !== MQDB) {
        return;
    }

    // Прыжок к MQRC
    binaryWrapper.setCursor(0x1c);
    const mqrcList = getMQRC(binaryWrapper);

    const mqrc2 = mqrcList.find((mqrc) => {
        return mqrc.ID === 2;
    })
    binaryWrapper.setCursor(mqrc2.Offset);
    const filesCount = binaryWrapper.readInt();
    logger.debug('Files Count: ' + filesCount);
    for (let iterator = 0; iterator < filesCount; iterator++) {
        const fileName = binaryWrapper.readChar(256).replace(/\u0000/g, '');
        const fileMqrcId = binaryWrapper.readInt();
        logger.debug('File MQRC ID: ' + fileMqrcId);
        logger.debug('File Name: ' + fileName);

        const mqrc = mqrcList.find((mqrc) => {
            return mqrc.ID === fileMqrcId;
        })
        fs.writeFileSync(
            path.join(fileNameFolder, fileName), 
            binaryWrapper.getBuffer().slice(mqrc.Offset, mqrc.Offset + mqrc.Size)
        );
    }
}

const getMQRC = (binaryWrapper) => {
    const result = [];
    while (true) {
        const MQRC = binaryWrapper.readChar(4);
        if (FF_MQRC_SIGNATURE !== MQRC) {
            break;
        }

        binaryWrapper.shiftCursor(INT_SIZE);
        const mqrcId = binaryWrapper.readInt();
        const mqrcSize = binaryWrapper.readInt();
        binaryWrapper.shiftCursor(3 * INT_SIZE);
        const mqrcOffset = binaryWrapper.getCursorPosition();
        logger.debug('MQRC ID: ' + mqrcId);
        logger.debug('MQRC Size: ' + mqrcSize);
        logger.debug('MQRC Offset: ' + mqrcOffset);

        // Пропускаем блок MQRC
        binaryWrapper.shiftCursor(mqrcSize);
        result.push({
            ID: mqrcId,
            Size: mqrcSize,
            Offset: mqrcOffset
        })
    }

    return result;
}

export { unpack };