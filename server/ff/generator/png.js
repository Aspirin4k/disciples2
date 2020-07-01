import { encode, decode, toRGBA8 } from 'upng-js';

const CHANNEL_COUNT = 4;

export class PNG {
    constructor(width, height, buffer) {
        this.width = width;
        this.height = height;
        this.buffer = buffer || new Uint8Array(new ArrayBuffer(this.width * this.height * CHANNEL_COUNT));
    }

    static fromFileBuffer(fileBuffer) {
        const image = decode(fileBuffer);
        return new PNG(image.width, image.height, new Uint8Array(toRGBA8(image)[0]));
    }

    toFileBuffer() {
        return new Uint8Array(encode([this.buffer.buffer], this.width, this.height, 0));
    }

    getPixel(x, y) {
        const pixelIndex = this.getPixelIndex(x, y);
        return {
            r: this.buffer[pixelIndex],
            g: this.buffer[pixelIndex + 1],
            b: this.buffer[pixelIndex + 2],
            a: this.buffer[pixelIndex + 3]
        }
    }

    setPixel(pixel, x, y) {
        const pixelIndex = this.getPixelIndex(x, y);
        this.buffer[pixelIndex] = pixel.r;
        this.buffer[pixelIndex + 1] = pixel.g;
        this.buffer[pixelIndex + 2] = pixel.b;
        this.buffer[pixelIndex + 3] = pixel.a;
    }

    getPixelIndex(x, y) {
        return (y * this.width + x) * CHANNEL_COUNT;;
    }

    bitblt(sourceImage, destX, destY, width, height, sourceX, sourceY) {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const sourcePixel = sourceImage.getPixel(sourceX + x, sourceY + y);
                this.setPixel(sourcePixel, destX + x, destY + y);
            }
        }
    }
}