import fs from 'fs';
import path from 'path';

import { FILE_FF_ANIMATIONS } from "../../consts";
import { Animation } from './../model/animation';
import { BinaryWrapper } from "../../binary/BinaryWrapper";
import { logger } from '../../logger';

const getAnimations = (folderName) => {
    logger.debug('Staring extracting animations: ' + folderName);
    if (!fs.existsSync(path.join(folderName, FILE_FF_ANIMATIONS))) {
        return null;
    }

    const animationsBuffer = new BinaryWrapper(fs.readFileSync(path.join(folderName, FILE_FF_ANIMATIONS)));
    const animations = [];
    while (!animationsBuffer.isEnd()) {
        const animation = new Animation()
        const animationFrameCount = animationsBuffer.readInt();
        for (let iterator = 0; iterator < animationFrameCount; iterator++) {
            const animationName = animationsBuffer.readString();
            animation.addFrameName(animationName);
        }
        animations.push(animation);
    }
    return animations;
}

export { getAnimations };