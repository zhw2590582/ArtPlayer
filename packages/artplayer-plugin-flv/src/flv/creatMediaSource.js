export default class CreatMediaSource {
    constructor(art) {
        this.mediaSource = new MediaSource();
        this.url = URL.createObjectURL(this.mediaSource);
    }
}