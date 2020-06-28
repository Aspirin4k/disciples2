import {CHAR_SIZE} from "../consts";

const loadString = (binaryBuffer, indexStart) => {
    let current = indexStart;

    let result = '';
    while (binaryBuffer[current] !== 0) {
        result += String.fromCharCode(binaryBuffer[current]);
        current += CHAR_SIZE;
    }
    current += CHAR_SIZE;

    return {
        result,
        indexFinish: current
    }
};

export { loadString };