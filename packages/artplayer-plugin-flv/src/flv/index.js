import Emitter from 'tiny-emitter';
import CheckSupport from './checkSupport';
import CreatMediaSource from './creatMediaSource';

class Flv extends Emitter {
    constructor(mediaElement, url) {
        super();
        this.mediaElement = mediaElement;
        this.url = url;
        this.support = new CheckSupport(this);
        this.mediaSource = new CreatMediaSource(this);
    }

    load() {
        console.log(this);
    }

    destroy() {
        console.log(this);
    }
}

window.Flv = Flv;
export default Flv;
