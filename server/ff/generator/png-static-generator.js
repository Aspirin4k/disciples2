import fs from 'fs';
import path from 'path';

import { logger } from '../../logger';

const generateStaticImages = (folderName, frames) => {
    let atlasCache = {};
    frames.forEach((frame) => {
        const atlasName = frame.getMQRC().getName();
        
        const targetFileName = path.join(folderName, `${path.basename(atlasName, '.PNG')}_result.PNG`);
        logger.debug('Generating ' + targetFileName);
        
        if (!atlasCache[frame.getFileID()]) {
            const atlasData = fs.readFileSync(path.join(folderName, atlasName));
            atlasCache[frame.getFileID()] = PNG.sync.read(atlasData);
        }

        const atlas = atlasCache[frame.getFileID()];
        const image = frame.getImage();
        const resultImageOut = new PNG({
            width: image.getWidth(),
            height: image.getHeight()
        })
        image.getPieces().forEach((piece) => {
            PNG.bitblt(
                atlas, 
                resultImageOut, 
                piece.getSourceX(), 
                piece.getSourceY(), 
                piece.getWidth(), 
                piece.getHeight(), 
                piece.getResultX(), 
                piece.getResultY()
            );
        });

        logger.debug('Writing ' + targetFileName);
        fs.writeFileSync(targetFileName, PNG.sync.write(resultImageOut));
    });
}

export { generateStaticImages };