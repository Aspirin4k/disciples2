import { setImages } from './parser/image-parser';
import { getAnimations } from './parser/anim-parser';
import { setFrames } from './parser/frame-parser';
import { logger } from '../logger';

const unpackAnimation = (folderName, ff) => {
    const animations = getAnimations(folderName);
    if (!animations) {
        return;
    }

    setFrames(folderName, animations);
    setImages(folderName, animations, ff);
};

export { unpackAnimation };