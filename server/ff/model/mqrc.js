export class MQRC {
    constructor() {
        this.ID = 0;
        this.name = '';
        // Смещение до самого файла в псевдоархиве
        this.offset = 0;
        this.size = 0;
    }

    setID(id) {
        this.ID = id;
    }

    getID() {
        return this.ID;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setOffset(offset) {
        this.offset = offset;
    }

    getOffset() {
        return this.offset;
    }

    setSize(size) {
        this.size = size;
    }

    getSize() {
        return this.size;
    }
}