export class Frame {
    constructor() {
        this.name = '';
        this.fileID = 0;
        this.animationNumber = 0;
        this.animationFrameNumber = 0;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setFileID(id) {
        this.fileID = id;
    }

    getFileID() {
        return this.fileID;
    }

    setAnimationNumber(animationNumber) {
        this.animationNumber = animationNumber;
    }

    getAnimationNumber() {
        return this.animationNumber;
    }

    setAnimationFrameNumber(frameNumber) {
        this.animationFrameNumber = frameNumber;
    }

    getAnimationFrameNumber() {
        return this.animationFrameNumber;
    }
};