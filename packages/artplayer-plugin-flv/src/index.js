import Emitter from 'tiny-emitter';
import checkSupport from './utils/checkSupport';
import EventProxy from './eventProxy';
import CreatWorker from './creatWorker';
import CreatMediaSource from './creatMediaSource';
import FlvParse from './flvParse';
import * as utils from './utils';
import config from './config';

let id = 0;
class Flv extends Emitter {
    constructor(options) {
        super();
        this.options = Object.assign({}, Flv.DEFAULTS, options);
        console.log(this.options);
        checkSupport(this.options);
        id += 1;
        this.id = id;
        Flv.instances.push(this);
    }

    static get DEFAULTS() {
        return {
            mediaElement: '',
            url: '',
        };
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
        this.workers = new CreatWorker(this);
        this.mediaSource = new CreatMediaSource(this);
        this.flvData = new FlvParse(this);
    }

    destroy() {
        this.events.destroy();
        this.workers.killAll();
        Flv.instances.splice(Flv.instances.indexOf(this), 1);
        this.emit('destroy');
    }
}

Object.defineProperty(Flv, 'instances', {
    value: [],
});

window.Flv = Flv;
export default Flv;
