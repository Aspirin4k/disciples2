import fs from 'fs';
import {INT_SIZE, SHORT_SIZE, VPK_SIGNATURE, VPK_VERSION} from "./consts";
import {loadString} from "./helpers";


const getTree = (filename) => {
    const binaryBuffer = fs.readFileSync(filename);

    let current = 0;
    const signature = parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;
    if (VPK_SIGNATURE !== signature) {
        return null;
    }

    const version = parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;
    if (VPK_VERSION !== version) {
        return null;
    }

    // Размер древа директорий в байтах
    const treeSize = parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;
    // Сколько информации файла хранится в этом VPK (У Disciples 2 это, похоже, 0)
    const fileDataSectionSize = parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;
    // Размер секции с контрольными суммами для внешних файлов
    const archiveMd5SectionSize =  parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;
    // Размер секции с контрольными суммами для контента этого файла (Должен быть 48)
    const otherMd5SectionSize =  parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;
    // Размер секции, которая содержит публичный ключ и подпись
    const signatureSectionSize =  parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;

    const tree = {};

    while (binaryBuffer[current] !== 0) {
        const loadedString = loadString(binaryBuffer, current);
        const extension = loadedString.result;
        current = loadedString.indexFinish;

        const loadedExtension = getExtension(binaryBuffer, current);
        current = loadedExtension.indexFinish;
        tree[extension] = loadedExtension.result;
        current += SHORT_SIZE;
    }

    console.log(current);

    return tree;
};

const getExtension = (binaryBuffer, indexStart) => {
    let current = indexStart;

    const extension = {};

    while (binaryBuffer[current] !== 0) {
        const loadedString = loadString(binaryBuffer, current);
        const filepath = loadedString.result;
        current = loadedString.indexFinish;

        const loadedPath = getFilepath(binaryBuffer, current);
        current = loadedPath.indexFinish;
        extension[filepath] = loadedPath.result;
    }

    return {
        result: extension,
        indexFinish: current
    }
};

const getFilepath = (binaryBuffer, indexStart) => {
    let current = indexStart;

    const filepath = {};

    while (binaryBuffer[current] !== 0) {
        const loadedString = loadString(binaryBuffer, current);
        const filename = loadedString.result;
        current = loadedString.indexFinish;

        const loadedFile = getFile(binaryBuffer, current);
        current = loadedFile.indexFinish;
        filepath[filename] = loadedFile.result;
    }

    return {
        result: filepath,
        indexFinish: current
    };
};

const getFile = (binaryBuffer, indexStart) => {
    let current = indexStart;

    // https://en.wikipedia.org/wiki/Cyclic_redundancy_check
    const CRC = parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;
    // Количество байт целевого файла, которые содержатся в этом файле
    const preloadBytes = parseInt(binaryBuffer.slice(current, current + SHORT_SIZE).swap16().toString('hex'), 16);
    current += SHORT_SIZE;
    // Индекс файла, в котором находится данный файл
    const archiveIndex = parseInt(binaryBuffer.slice(current, current + SHORT_SIZE).swap16().toString('hex'), 16);
    current += SHORT_SIZE;
    // Смещение от начала файла в целевом файле
    const archiveOffset = parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;
    // Длина файла в целевом файле начиная со смещения
    const fileLength = parseInt(binaryBuffer.slice(current, current + INT_SIZE).swap32().toString('hex'), 16);
    current += INT_SIZE;
    // Терминатор. Должен быть 0xffff
    const terminator = parseInt(binaryBuffer.slice(current, current + SHORT_SIZE).swap16().toString('hex'), 16);
    current += SHORT_SIZE;

    return {
        result: {},
        indexFinish: current
    }
};

export { getTree };