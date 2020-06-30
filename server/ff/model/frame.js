export class Frame {
    constructor() {
        this.name = '';
        this.fileID = 0;
        this.MQRC = null;
        this.animation = null;
        this.image = null;
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

    setMQRC(mqrc) {
        this.MQRC = mqrc;
    }

    getMQRC() {
        return this.MQRC;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    getAnimation() {
        return this.animation;
    }

    setImage(image) {
        this.image = image;
    }

    getImage() {
        return this.image;
    }
};