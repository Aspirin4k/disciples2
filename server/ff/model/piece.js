export class Piece {
    constructor() {
        this.sourceX = 0;
        this.sourceY = 0;
        this.width = 0;
        this.height = 0;
        this.resultX = 0;
        this.resultY = 0;
    }

    setSourceCoordinates(x, y) {
        this.sourceX = x;
        this.sourceY = y;
    }

    getSourceX() {
        return this.sourceX;
    }

    getSourceY() {
        return this.sourceY;
    }

    setResultCoordinates(x, y) {
        this.resultX = x;
        this.resultY = y;
    }

    getResultX() {
        return this.resultX;
    }

    getResultY() {
        return this.resultY;
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
}