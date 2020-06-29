export class Animation {
    constructor() {
        this.framesNames = [];
        this.frames = {};
    }

    addFrame(frame) {
        this.frames[frame.getName()] = frame;
    }

    getFrame(frameName) {
        return this.frames[frameName];
    }

    getFrames() {
        return this.frames;
    }

    isFrameBelongs(frame) {
        return !!this.framesNames.find((frameName) => {
            return frameName === frame.getName();
        })
    }

    addFrameName(framName) {
        this.framesNames.push(framName);
    }

    getFramesNames() {
        return this.framesNames;
    }
}