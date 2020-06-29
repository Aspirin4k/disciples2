import fs from 'fs';
import path from 'path';

import { logger } from "../../logger";

import { FILE_FF_INDEX, INT_SIZE } from "../../consts";
import { Frame } from "../model/frame";
import { BinaryWrapper } from "../../binary/BinaryWrapper";

const setFrames = (folderName, animations) => {
    logger.debug('Starting parsing frames ' + folderName);

    const framesBuffer = new BinaryWrapper(fs.readFileSync(path.join(folderName, FILE_FF_INDEX)));

    const framesCount = framesBuffer.readInt();
    for (let iterator = 0; iterator < framesCount; iterator++) {
        const frame = new Frame();
        frame.setFileID(framesBuffer.readInt());
        frame.setName(framesBuffer.readString());
        setToAnimation(frame, animations);

        framesBuffer.shiftCursor(2 * INT_SIZE);
    }
};

const setToAnimation = (frame, animations) => {
    for (const animation of animations) {
        if (animation.isFrameBelongs(frame)) {
            animation.addFrame(frame);
        }
    }
};

export { setFrames };