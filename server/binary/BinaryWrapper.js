import { CHAR_SIZE, INT_SIZE } from "../consts";

export class BinaryWrapper {
    constructor(binaryBuffer) {
        this.binaryBuffer = binaryBuffer;
        this.current = 0;
    }

    /**
     * Устанавливает курсор на заданную позицию
     * 
     * @param {int} position 
     */
    setCursor(position) {
        this.current = position;
    }

    /**
     * Смещает курсор на указанное количество байт в сторону конца файла
     * 
     * @param {int} offset 
     */
    shiftCursor(offset) {
        this.current += offset;
    }

    getCursorPosition() {
        return this.current;
    }

    getBuffer() {
        return this.binaryBuffer;
    }

    /**
     * Считывает символы из файла в строку
     * 
     * @param {int} count - количество символов, которое надо считать
     */
    readChar(count = 1) {
        let result = '';
        for (let i = 0; i < count; i++) {
            result += String.fromCharCode(this.binaryBuffer[this.current]);
            this.current += CHAR_SIZE;
        }
        return result;
    }

    readInt() {
        const result = parseInt(this.binaryBuffer.slice(this.current, this.current + INT_SIZE).swap32().toString('hex'), 16);
        this.current += INT_SIZE;
        return result;
    }

    readIntReverse() {
        const result = parseInt(this.binaryBuffer.slice(this.current, this.current + INT_SIZE).toString('hex'), 16);
        this.current += INT_SIZE;
        return result;
    }
}