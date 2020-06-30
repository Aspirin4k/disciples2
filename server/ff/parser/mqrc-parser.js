import { MQRC } from './../model/mqrc';
import { FF_MQRC_SIGNATURE, INT_SIZE } from '../../consts';

/**
 * Считывает из потока блоки MQRC.
 * Файл .ff состоит из блоков MQRC. Каждый блок обладает следующим:
 * * Идентификатором MQRC 
 * * Размером блока 
 * * Собственно данными
 * Особый блок с идентификатором 2 содержит названия файлов, которые содержатся в
 * данном псевдоархиве.
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

        // Пропускаем блок с данными MQRC (Считаем позднее)
        binaryWrapper.shiftCursor(mqrc.getSize());

        result.push(mqrc);
    }

    return result;
}

export { getMQRC };