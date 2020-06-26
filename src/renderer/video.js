export class VideoPlayer {
    constructor(context, video) {
        this.context = context;
        this.video = video;

        this.video.addEventListener('play', () => {

        });
        this.video.addEventListener('loadeddata', () => {
            this.video.play();
        })
    }

    render() {
        if (!this.video || this.video.ended) {
            return;
        }

        this.context.drawImage(this.video, 0, 0, this.video.width, this.video.height);

        setTimeout(() => {
            this.render()
        }, 16);
    }
}