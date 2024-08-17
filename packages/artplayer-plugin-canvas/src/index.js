export default class ArtplayerPluginCanvas extends HTMLCanvasElement {
    constructor(art) {
        super();

        this.art = art;
        console.log(art);

        this._muted = false;
        this._volume = 1;
        this._src = '';
        this._currentTime = 0;
        this._playbackRate = 1;

        this.loop = false;
        this.ended = false;
        this.paused = true;
        this.readyState = 0;
        this.videoWidth = 0;
        this.videoHeight = 0;
        this.autoplay = false;
        this.duration = NaN;

        this.buffered = {
            length: 0,
            start: () => 0,
            end: () => 0,
        };

        this.textTracks = [{ activeCues: [] }];
    }

    get muted() {
        console.log('get muted');
        return this._muted;
    }

    set muted(muted) {
        console.log('set muted');
        this._muted = muted;
    }

    get volume() {
        console.log('get volume');
        return this._volume;
    }

    set volume(percentage) {
        console.log('set volume');
        this._volume = percentage;
    }

    get src() {
        console.log('get src');
        return this._src;
    }

    set src(newSrc) {
        console.log('set src');
        this._src = newSrc;
    }

    get currentTime() {
        console.log('get currentTime');
        return this._currentTime;
    }

    set currentTime(time) {
        console.log('set currentTime');
        this._currentTime = time;
    }

    get playbackRate() {
        console.log('get playbackRate');
        return this._playbackRate;
    }

    set playbackRate(rate) {
        console.log('set playbackRate');
        this._playbackRate = rate;
    }

    async play() {
        console.log('play');
        return true;
    }

    pause() {
        console.log('pause');
    }
}

if (typeof window !== 'undefined') {
    window['ArtplayerPluginCanvas'] = ArtplayerPluginCanvas;

    if (!customElements.get('art-plugin-canvas')) {
        customElements.define('art-plugin-canvas', ArtplayerPluginCanvas, { extends: 'canvas' });
    }
}
