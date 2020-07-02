export class VideoPlayer {
    constructor(context, video, width, height) {
        this.context = context;
        this.video = video;
        this.width = width;
        this.height = height;

        this.video.addEventListener('play', () => {
            this.render();
        });
        this.video.addEventListener('loadeddata', () => {
            this.video.play();
        })
    }

    render() {
        if (!this.video || this.video.ended) {
            return;
        }

        this.context.drawImage(this.video, 0, 0, this.width, this.height);

        setTimeout(() => {
            this.render()
        }, 16);
    }
}