import fs from 'fs';
import path from 'path';

import { logger } from '../../logger';
import { PNG } from './png';

const generateStaticImages = (folderName, frames) => {
    let atlasCache = {};
    frames.forEach((frame) => {
        const atlasName = frame.getMQRC().getName();
        
        const targetFileName = path.join(folderName, `${path.basename(atlasName, '.PNG')}_result.PNG`);
        logger.debug('Generating ' + targetFileName);
        
        if (!atlasCache[frame.getFileID()]) {
            atlasCache = {};
            const atlasData = fs.readFileSync(path.join(folderName, atlasName));
            atlasCache[frame.getFileID()] = PNG.fromFileBuffer(atlasData);
        }

        const atlas = atlasCache[frame.getFileID()];
        const image = frame.getImage();
        const resultImageOut = new PNG(image.getWidth(), image.getHeight());
        image.getPieces().forEach((piece) => {
            resultImageOut.bitblt(
                atlas, 
                piece.getResultX(), 
                piece.getResultY(),
                piece.getWidth(), 
                piece.getHeight(),
                piece.getSourceX(), 
                piece.getSourceY()
            );
        });

        logger.debug('Writing ' + targetFileName);
        fs.writeFileSync(targetFileName, resultImageOut.toFileBuffer());
    });
}

export { generateStaticImages };