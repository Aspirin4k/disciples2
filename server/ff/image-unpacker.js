import { getAnimations } from './parser/anim-parser';
import { generateAnimationImages } from './generator/png-anim-generator';
import { generateStaticImages } from './generator/png-static-generator';
import { getFrames } from './parser/index-parser';
import { getImages } from './parser/image-parser';

const unpackImages = (folderName, ff) => {
    let frames = getFrames(folderName);
    linkMQRC(frames, ff);
    frames = frames.filter((frame) => {
        // Есть странные фреймы, которые ссылаются на MQRC 0xFFFFFFFF
        return !!frame.getMQRC();
    })

    const images = getImages(folderName);
    linkImages(frames, images);

    const animations = getAnimations(folderName);
    if (!!animations) {
        linkAnimations(frames, animations);
        generateAnimationImages(folderName, animations);
    }

    generateStaticImages(folderName, frames.filter((frame) => { return !frame.getAnimation(); }));
};

// Привязываю MQRC к фреймам
const linkMQRC = (frames, ff) => {
    frames.forEach((frame) => {
        frame.setMQRC(ff.getMQRC(frame.getFileID()));
    });
}

// Привязываю кадры к анимациям и наоборот
const linkAnimations = (frames, animations) => {
    frames.forEach((frame) => {
        animations.forEach((animation) => {
            if (animation.isFrameBelongs(frame)) {
                animation.addFrame(frame);
                frame.setAnimation(animation);
            }
        })
    })
};

// Привязываю информацию об изображении к кадру
const linkImages = (frames, images) => {
    frames.forEach((frame) => {
        frame.setImage(images.find((image) => {
            return image.getFrameName() === frame.getName();
        }))
    })
}

export { unpackImages };