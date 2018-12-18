import Emitter from 'tiny-emitter';
import checkSupport from './utils/checkSupport';
import EventProxy from './eventProxy';
import CreatMediaSource from './creatMediaSource';
import FlvParse from './flvParse';
import * as utils from './utils';
import config from './config';

let id = 0;
class Flv extends Emitter {
    constructor(mediaElement, url) {
        super();
        checkSupport(mediaElement, url);
        this.mediaElement = mediaElement;
        this.url = url;

        id += 1;
        this.id = id;
        Flv.instances.push(this);
    }

    static get version() {
        return '__VERSION__';
    }

    static get config() {
        return config;
    }

    static get utils() {
        return utils;
    }

    load() {
        this.events = new EventProxy(this);
        this.mediaSource = new CreatMediaSource(this);
        this.flvData = new FlvParse(this);
    }

    destroy() {
        this.events.destroy();
        Flv.instances.splice(Flv.instances.indexOf(this), 1);
        this.emit('destroy');
    }
}

Object.defineProperty(Flv, 'instances', {
    value: [],
});

window.Flv = Flv;
export default Flv;
