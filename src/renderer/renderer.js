import { VideoPlayer } from "./video";

const WINDOW_HEIGHT = 768;
const WINDOW_WIDTH = 1024;

const createRenderer = (document, canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.canvas.height = WINDOW_HEIGHT;
    ctx.canvas.width = WINDOW_WIDTH;

    const video = document.createElement('video');
    video.src = '/resources/video/sf.webm';
    new VideoPlayer(ctx, video, WINDOW_WIDTH, WINDOW_HEIGHT);

    return () => {

    }
};

export { createRenderer };