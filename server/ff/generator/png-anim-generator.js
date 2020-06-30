import fs from 'fs';
import path from 'path';

import { PNG } from 'pngjs';
import { logger } from '../../logger';

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
        const resultAtlas = new PNG({
            width: resultAtlasWidth,
            height: resultAtlasHeight
        })

        animation.getFramesNames().forEach((frameName, index) => {
            const frame = animation.getFrame(frameName);
            const atlasName = frame.getMQRC().getName();
            if (!atlasCache[frame.getFileID()]) {
                const atlasData = fs.readFileSync(path.join(folderName, atlasName));
                atlasCache[frame.getFileID()] = PNG.sync.read(atlasData);
            }

            const atlas = atlasCache[frame.getFileID()];
            const image = frame.getImage();
            image.getPieces().forEach((piece) => {
                PNG.bitblt(
                    atlas, 
                    resultAtlas, 
                    piece.getSourceX(), 
                    piece.getSourceY(), 
                    piece.getWidth(), 
                    piece.getHeight(), 
                    (index % FRAMES_IN_ROW) * image.getWidth() + piece.getResultX(), 
                    Math.floor(index / FRAMES_IN_ROW) * image.getHeight() + piece.getResultY()
                );
            });
        })

        logger.debug('Writing ' + targetFileName);
        fs.writeFileSync(targetFileName, PNG.sync.write(resultAtlas));
    });
}

export { generateAnimationImages };