import fs from 'fs';
import path from 'path';
import { encode, decode, toRGBA8 } from 'upng-js';

import { logger } from '../../logger';

const FRAMES_IN_ROW = 5;
const PNG_CHANNELS = 4;

const generateAnimationImages = (folderName, animations) => {
    let atlasCache = {};
    animations.forEach((animation) => {
        const firstFrame = animation.getFrame(animation.getFramesNames()[0]);
        const targetFileName = path.join(folderName, `${path.basename(firstFrame.getMQRC().getName(), '.PNG')}_result.PNG`);
        logger.debug('Generating ' + targetFileName);

        const framesCount = animation.getFramesNames().length;
        const resultAtlasWidth = FRAMES_IN_ROW * firstFrame.getImage().getWidth();
        const resultAtlasHeight = (Math.floor(framesCount / FRAMES_IN_ROW) + 1) * firstFrame.getImage().getHeight();
        const resultBuffer = new Uint8Array(new ArrayBuffer(resultAtlasHeight * resultAtlasWidth * PNG_CHANNELS));

        animation.getFramesNames().forEach((frameName, index) => {
            const frame = animation.getFrame(frameName);
            const atlasName = frame.getMQRC().getName();
            if (!atlasCache[frame.getFileID()]) {
                atlasCache = {};
                const atlasData = fs.readFileSync(path.join(folderName, atlasName));

                const atlasImage = decode(atlasData);
                const atlasBuffer = toRGBA8(atlasImage)[0];
                atlasCache[frame.getFileID()] = {
                    image: atlasImage,
                    buffer: new Uint8Array(atlasBuffer)
                };
            }

            const atlas = atlasCache[frame.getFileID()];
            const image = frame.getImage();
            image.getPieces().forEach((piece) => {
                for (let x = 0; x < piece.getWidth(); x++) {
                    for (let y = 0; y < piece.getHeight(); y++) {
                        const atlasWidth = atlas.image.width;
                        const atlasBuffer = atlas.buffer;
                        const sourcePixelIndex = ((piece.getSourceY() + y) * atlasWidth + (piece.getSourceX() + x)) * PNG_CHANNELS;
                        const sourceR = atlasBuffer[sourcePixelIndex];
                        const sourceG = atlasBuffer[sourcePixelIndex + 1];
                        const sourceB = atlasBuffer[sourcePixelIndex + 2];
                        const sourceA = atlasBuffer[sourcePixelIndex + 3];

                        const destinationXOffset = (index % FRAMES_IN_ROW) * image.getWidth();
                        const destinationYOffset = (Math.floor(index / FRAMES_IN_ROW)) * image.getHeight();
                        const destinationPixelIndex = ((destinationYOffset + y + piece.getResultY()) * resultAtlasWidth + (destinationXOffset + x + piece.getResultX())) * PNG_CHANNELS;

                        resultBuffer[destinationPixelIndex] = sourceR;
                        resultBuffer[destinationPixelIndex + 1] = sourceG;
                        resultBuffer[destinationPixelIndex + 2] = sourceB;
                        resultBuffer[destinationPixelIndex + 3] = sourceA;
                    }
                }
            });
        })

        logger.debug('Writing ' + targetFileName);
        const result = encode([resultBuffer.buffer], resultAtlasWidth, resultAtlasHeight, 0);
        fs.writeFileSync(targetFileName, new Uint8Array(result));
    });
}

export { generateAnimationImages };