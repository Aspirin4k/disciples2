export class Image {
    constructor() {
        this.pieces = [];
        this.width = 0;
        this.height = 0;
        this.frameName = '';
    }

    addPiece(piece) {
        this.pieces.push(piece);
    }

    setPieces(pieces) {
        this.pieces = pieces;
    }

    getPieces() {
        return this.pieces;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    setFrameName(frameName) {
        this.frameName = frameName;
    }

    getFrameName() {
        return this.frameName;
    }
}