import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

import { BinaryWrapper } from "../../binary/BinaryWrapper";
import { FILE_FF_IMAGES, INT_SIZE } from '../../consts';
import { logger } from '../../logger';

const setImages = (folderName, animations, ff) => {
    logger.debug('Starting extracting images ' + folderName);
    const imagesBuffer = new BinaryWrapper(fs.readFileSync(path.join(folderName, FILE_FF_IMAGES)));
    
    let atlasCache = {};
    while (!imagesBuffer.isEnd()) {
        imagesBuffer.shiftCursor(0xb + 256 * INT_SIZE);

        const imagesCount = imagesBuffer.readInt();
        for (let iterator = 0; iterator < imagesCount; iterator++) {
            const frameName = imagesBuffer.readString();

            let frame = animations.reduce((x, animation) => {
                const frame = animation.getFrame(frameName);
                return !!frame ? frame : x;
            }, null);
            if (!frame) {
                logger.error('Couldn\'t find frame with name ' + frameName);
                return;
            }

            if (!atlasCache[frame.getFileID()]) {
                const atlasData = fs.readFileSync(path.join(folderName, ff.getMQRC(frame.getFileID()).getName()));
                atlasCache[frame.getFileID()] = PNG.sync.read(atlasData);
            }

            const piecesCount = imagesBuffer.readInt();
            const imageWidth = imagesBuffer.readInt();
            const imageHeight = imagesBuffer.readInt();

            const atlas = atlasCache[frame.getFileID()];
            const imageOut = new PNG({
                width: imageWidth,
                height: imageHeight
            });
            for (let k = 0; k < piecesCount; k++) {
                const atlasX = imagesBuffer.readInt();
                const atlasY = imagesBuffer.readInt();
                const imageX = imagesBuffer.readInt();
                const imageY = imagesBuffer.readInt();
                const pieceWidth = imagesBuffer.readInt();
                const pieceHeight = imagesBuffer.readInt();

                PNG.bitblt(atlas, imageOut, imageX, imageY, pieceWidth, pieceHeight, atlasX, atlasY);
            }

            const targetFileName = path.join(folderName, `${ff.getMQRC(frame.getFileID()).getName()}_${frame.getName()}.PNG`);
            logger.debug('Writing ' + targetFileName);
            fs.writeFileSync(targetFileName, PNG.sync.write(imageOut));
        }
    }
}

export { setImages }