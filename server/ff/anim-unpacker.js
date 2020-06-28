import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

import { Animation } from './animation';
import { BinaryWrapper } from '../binary/BinaryWrapper';
import { FILE_FF_INDEX, FILE_FF_ANIMATIONS, INT_SIZE, FILE_FF_IMAGES } from '../consts';
import { logger } from '../logger';
import { Frame } from './frame';

const unpackAnimation = (folderName) => {
    const animations = getAnimations(folderName);
    const frames = getFrames(folderName, animations);
    generateImages(folderName, frames);
};

const getAnimations = (folderName) => {
    const animationsBuffer = new BinaryWrapper(fs.readFileSync(path.join(folderName, FILE_FF_ANIMATIONS)));
    const animations = [];
    while (!animationsBuffer.isEnd()) {
        const animation = new Animation()
        const animationFrameCount = animationsBuffer.readInt();
        for (let iterator = 0; iterator < animationFrameCount; iterator++) {
            const animationName = animationsBuffer.readString();
            animation.addFrame(animationName);
        }
        animations.push(animation);
    }
    return animations;
}

const getFrames = (folderName, animations) => {
    const framesBuffer = new BinaryWrapper(fs.readFileSync(path.join(folderName, FILE_FF_INDEX)));
    const frames = [];

    const framesCount = framesBuffer.readInt();
    for (let iterator = 0; iterator < framesCount; iterator++) {
        const frame = new Frame();
        frame.setID(framesBuffer.readInt());
        frame.setName(framesBuffer.readString());
        setAnimationToFrame(frame, animations);

        framesBuffer.shiftCursor(2 * INT_SIZE);
        
        frames.push(frame);
    }

    return frames;
};

const setAnimationToFrame = (frame, animations) => {
    for (const [animationIndex, animation] of animations.entries()) {
        for (const [frameIndex, animationFrame] of animation.getFrames().entries()) {
            if (animationFrame.localeCompare(frame.getName()) === 0) {
                frame.setAnimationNumber(animationIndex);
                frame.setAnimationFrameNumber(frameIndex);
            }
        }
    }
};

const generateImages = (folderName, frames) => {
    const imagesBuffer = new BinaryWrapper(fs.readFileSync(path.join(folderName, FILE_FF_IMAGES)));
    
    let atlas;
    for (let iterator = 0; iterator < frames.length; iterator++) {
        imagesBuffer.shiftCursor(0xb + 256 * INT_SIZE);

        const imagesCount = imagesBuffer.readInt();
        let previousID = 0;
        for (let j = 0; j < imagesCount; j++) {
            const imageName = imagesBuffer.readString();

            const frame = frames.find((frame) => {
                return frame.getName().localeCompare(imageName) === 0;
            })

            if (!frame) {
                logger.error('Couldn\'t find frame with name ' + imageName);
            }

            if (frame.getID() !== previousID) {
                const atlasData = fs.readFileSync(path.join(folderName, `${frame.getID()}.PNG`));
                atlas = PNG.sync.read(atlasData);
                previousID = frame.getID();
            }

            const piecesCount = imagesBuffer.readInt();
            const imageWidth = imagesBuffer.readInt();
            const imageHeight = imagesBuffer.readInt();

            const imageOut = new PNG({
                width: imageWidth,
                height: imageHeight
            });
            for (let k = 0; k < piecesCount; k++) {
                const pieceX1 = imagesBuffer.readInt();
                const pieceY1 = imagesBuffer.readInt();
                const pieceX2 = imagesBuffer.readInt();
                const pieceY2 = imagesBuffer.readInt();
                const piecedX = imagesBuffer.readInt();
                const piecedY = imagesBuffer.readInt();

                PNG.bitblt(atlas, imageOut, pieceX2, pieceY2, piecedX, piecedY, pieceX1, pieceY1);
            }

            const targetFileName = path.join(folderName, `${frame.getAnimationNumber()}_${frame.getAnimationFrameNumber()}.PNG`);
            logger.debug('Writing ' + targetFileName);
            fs.writeFileSync(targetFileName, PNG.sync.write(imageOut));
        }
    }
}

export { unpackAnimation };