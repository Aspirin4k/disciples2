export class Frame {
    constructor() {
        this.name = '';
        this.ID = 0;
        this.animationNumber = 0;
        this.animationFrameNumber = 0;
    }

    setName(name) {
        this.name = name;
    }

    getName(name) {
        return this.name;
    }

    setID(id) {
        this.ID = id;
    }

    getID() {
        return this.ID;
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