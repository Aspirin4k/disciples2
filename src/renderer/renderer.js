import { VideoPlayer } from "./video";

const WINDOW_HEIGHT = 1024;
const WINDOW_WIDTH = 1280;

const createRenderer = (document, canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.canvas.height = WINDOW_HEIGHT;
    ctx.canvas.width = WINDOW_WIDTH;

    // const video = document.createElement('video');
    // video.src = '/resources/video/intro.bik';
    // new VideoPlayer(ctx, video);

    return () => {
        ctx.fillStyle = 'green';
        ctx.fillRect(10, 10, 150, 100)
    }
};

export { createRenderer };