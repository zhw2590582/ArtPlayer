import Emitter from 'tiny-emitter';
import CheckSupport from './checkSupport';
import EventProxy from './eventProxy';
import CreatMediaSource from './creatMediaSource';
import * as utils from './utils';
import config from './config';

let id = 0;
class Flv extends Emitter {
    constructor(mediaElement, url) {
        super();
        utils.errorHandle(mediaElement instanceof HTMLVideoElement, 'The first parameter is not a video tag element');
        utils.errorHandle(typeof url === 'string', 'The second parameter is not a string type');
        this.mediaElement = mediaElement;
        this.url = url;

        this.support = new CheckSupport(this);
        this.events = new EventProxy(this);
        this.mediaSource = new CreatMediaSource(this);

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
        console.log(this.id);
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
