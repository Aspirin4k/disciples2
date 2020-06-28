export class Animation {
    constructor() {
        this.frames = [];
    }

    addFrame(framName) {
        this.frames.push(framName);
    }

    getFrames() {
        return this.frames;
    }
}