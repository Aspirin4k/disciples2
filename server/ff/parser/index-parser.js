import fs from 'fs';
import path from 'path';

import { FILE_FF_INDEX, INT_SIZE } from "../../consts";
import { Frame } from "../model/frame";
import { BinaryWrapper } from "../../binary/BinaryWrapper";
import { logger } from '../../logger';

const LOG_INTERVAL = 1000;

/**
 * Извлекает кадры из -INDEX.OPT. Каждый кадр состоит из идентификатора MQRC,
 * в котором лежит PNG, из которого необходимо составить данный кадр, строковый идентификатор кадра,
 * а также 2 байта какой-то херни.
 * 
 * @param {*} folderName
 */
const getFrames = (folderName) => {
    logger.debug('Starting extracting frames ' + folderName);

    const result = [];
    const framesBuffer = new BinaryWrapper(fs.readFileSync(path.join(folderName, FILE_FF_INDEX)));

    const framesCount = framesBuffer.readInt();
    logger.debug('Frames count: ' + framesCount);
    for (let iterator = 0; iterator < framesCount; iterator++) {
        const frame = new Frame();
        frame.setFileID(framesBuffer.readInt());
        frame.setName(framesBuffer.readString());
        
        framesBuffer.shiftCursor(2 * INT_SIZE);
        
        result.push(frame);
        if (iterator % LOG_INTERVAL === 0) {
            logger.debug('Processed ' + iterator + '/' + framesCount + ' frames');
        }
    }

    logger.debug('Processed ' + framesCount + '/' + framesCount + ' frames');
    return result;
};

export { getFrames };