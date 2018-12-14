import Emitter from 'tiny-emitter';
import CheckSupport from './checkSupport';
import CreatMediaSource from './creatMediaSource';
import { errorHandle } from './utils';

class Flv extends Emitter {
    constructor(mediaElement, url) {
        super();
        this.support = new CheckSupport();
        if (mediaElement) {
            this.attachMediaElement(mediaElement);
        }
        if (url) {
            this.loadUrl(url);
        }
    }

    attachMediaElement(mediaElement) {
        errorHandle(
            mediaElement instanceof HTMLVideoElement && mediaElement.tagName === 'VIDEO',
            "The 'mediaElement' does not seem to be a HTMLVideoElement",
        );
        this.mediaElement = mediaElement;
        return this;
    }

    loadUrl(url) {
        const type = typeof url;
        errorHandle(type === 'string', `The 'url' require 'string' type, but got '${type}'`);
        this.url = url;
        return this;
    }

    start() {
        this.mediaSource = new CreatMediaSource();
        console.log('start');
        return this;
    }
}

window.Flv = Flv;
export default Flv;
