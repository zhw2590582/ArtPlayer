export default class CreatMediaSource {
    constructor(flv) {
        this.mediaSource = new MediaSource();
        this.url = URL.createObjectURL(this.mediaSource);
        flv.mediaElement.src = this.url;
    }
}