import fs from 'fs';
import path from 'path';

import { logger } from '../../logger';
import { PNG } from './png';

const FRAMES_IN_ROW = 5;

const generateAnimationImages = (folderName, animations) => {
    let atlasCache = {};
    animations.forEach((animation) => {
        const firstFrame = animation.getFrame(animation.getFramesNames()[0]);
        const targetFileName = path.join(folderName, `${path.basename(firstFrame.getMQRC().getName(), '.PNG')}_result.PNG`);
        logger.debug('Generating ' + targetFileName);

        const framesCount = animation.getFramesNames().length;
        const resultAtlasWidth = FRAMES_IN_ROW * firstFrame.getImage().getWidth();
        const resultAtlasHeight = (Math.floor(framesCount / FRAMES_IN_ROW) + 1) * firstFrame.getImage().getHeight();
        const resultAtlas = new PNG(resultAtlasWidth, resultAtlasHeight);

        animation.getFramesNames().forEach((frameName, index) => {
            const frame = animation.getFrame(frameName);
            const atlasName = frame.getMQRC().getName();
            if (!atlasCache[frame.getFileID()]) {
                atlasCache = {};
                const atlasData = fs.readFileSync(path.join(folderName, atlasName));
                atlasCache[frame.getFileID()] = PNG.fromFileBuffer(atlasData);
            }

            const atlas = atlasCache[frame.getFileID()];
            const image = frame.getImage();
            image.getPieces().forEach((piece) => {
                resultAtlas.bitblt(
                    atlas,
                    (index % FRAMES_IN_ROW) * image.getWidth() + piece.getResultX(),
                    Math.floor(index / FRAMES_IN_ROW) * image.getHeight() + piece.getResultY(),
                    piece.getWidth(),
                    piece.getHeight(),
                    piece.getSourceX(),
                    piece.getSourceY()
                )
            });
        })

        logger.debug('Writing ' + targetFileName);
        fs.writeFileSync(targetFileName, resultAtlas.toFileBuffer());
    });
}

export { generateAnimationImages };