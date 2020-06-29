import { MQRC } from './../model/mqrc';
import { FF_MQRC_SIGNATURE, INT_SIZE } from '../../consts';
import { logger } from '../../logger';

/**
 * Считывает из потока блоки MQRC
 * 
 * @param {BinaryWrapper} binaryWrapper 
 */
const getMQRC = (binaryWrapper) => {
    const result = [];
    while (true) {
        const signature = binaryWrapper.readChar(4);
        if (FF_MQRC_SIGNATURE !== signature) {
            break;
        }

        binaryWrapper.shiftCursor(INT_SIZE);

        const mqrc = new MQRC();
        mqrc.setID(binaryWrapper.readInt());
        mqrc.setSize(binaryWrapper.readInt());

        binaryWrapper.shiftCursor(3 * INT_SIZE);
        mqrc.setOffset(binaryWrapper.getCursorPosition());

        logger.debug('MQRC ID: ' + mqrc.getID());
        logger.debug('MQRC Size: ' + mqrc.getSize());
        logger.debug('MQRC Offset: ' + mqrc.getOffset());

        // Пропускаем блок с данными MQRC (Считаем позднее)
        binaryWrapper.shiftCursor(mqrc.getSize());

        result.push(mqrc);
    }

    return result;
}

export { getMQRC };