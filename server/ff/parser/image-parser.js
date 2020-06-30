import fs from 'fs';
import path from 'path';

import { BinaryWrapper } from "../../binary/BinaryWrapper";
import { FILE_FF_IMAGES, INT_SIZE } from "../../consts";
import { Image } from '../model/image';
import { Piece } from '../model/piece';
import { logger } from '../../logger';

/**
 * Извлекает информацию непосредственно об изображении в кадре из файла -IMAGES.OPT. 
 * Каждое изображение может состоять из множества кусочков, которые вырезаются из атласа.
 * 
 * @param {*} folderName
 */
const getImages = (folderName) => {
    logger.debug('Starting extracting images ' + folderName);
    const imagesBuffer = new BinaryWrapper(fs.readFileSync(path.join(folderName, FILE_FF_IMAGES)));
    
    const result = [];
    while (!imagesBuffer.isEnd()) {
        imagesBuffer.shiftCursor(0xb + 256 * INT_SIZE);

        const imagesCount = imagesBuffer.readInt();
        for (let iterator = 0; iterator < imagesCount; iterator++) {
            const image = getImage(imagesBuffer);
            result.push(image);
        }
    }

    logger.debug('Finished extracting images ' + folderName);
    return result;
}

const getImage = (imagesBuffer) => {
    const image = new Image();

    image.setFrameName(imagesBuffer.readString());
    const piecesCount = imagesBuffer.readInt();

    const imageWidth = imagesBuffer.readInt();
    const imageHeight = imagesBuffer.readInt();
    image.setSize(imageWidth, imageHeight);
    
    const pieces = getPieces(imagesBuffer, piecesCount);
    image.setPieces(pieces);

    return image;
}

const getPieces = (imagesBuffer, piecesCount) => {
    const result = [];

    for (let k = 0; k < piecesCount; k++) {
        const piece = new Piece();

        const atlasX = imagesBuffer.readInt();
        const atlasY = imagesBuffer.readInt();
        piece.setResultCoordinates(atlasX, atlasY);
        const imageX = imagesBuffer.readInt();
        const imageY = imagesBuffer.readInt();
        piece.setSourceCoordinates(imageX, imageY);
        const pieceWidth = imagesBuffer.readInt();
        const pieceHeight = imagesBuffer.readInt();
        piece.setSize(pieceWidth, pieceHeight);

        result.push(piece);
    }

    return result;
};

export { getImages };