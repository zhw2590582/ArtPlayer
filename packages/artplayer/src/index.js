import './style';
import 'balloon-css/balloon.min.css';
import Emitter from 'tiny-emitter';
import optionValidator from 'option-validator';
import * as utils from './utils';
import scheme from './scheme';
import config from './config';
import Whitelist from './whitelist';
import Template from './template';
import I18n from './i18n';
import Player from './player';
import Controls from './controls';
import Contextmenu from './contextmenu';
import Info from './info';
import Subtitle from './subtitle';
import Events from './events';
import Hotkey from './hotkey';
import Layers from './layers';
import Loading from './loading';
import Notice from './notice';
import Mask from './mask';
import Setting from './setting';
import Storage from './storage';
import Plugins from './plugins';
import Mobile from './mobile';

let id = 0;
class Artplayer extends Emitter {
    constructor(option) {
        super();
        utils.errorHandle(typeof window.Promise === 'function', "Unsupported 'Promise' method");
        this.option = utils.mergeDeep(Artplayer.DEFAULTS, option);
        optionValidator(this.option, scheme);
        this.init();
    }

    static get version() {
        return '__VERSION__';
    }

    static get env() {
        return '__ENV__';
    }

    static get config() {
        return config;
    }

    static get utils() {
        return utils;
    }

    static get Emitter() {
        return Emitter;
    }

    static get validator() {
        return optionValidator;
    }

    static get DEFAULTS() {
        return {
            container: '#artplayer',
            url: '',
            poster: '',
            title: '',
            theme: '#f00',
            volume: 0.7,
            muted: false,
            autoplay: false,
            autoSize: false,
            loop: false,
            playbackRate: false,
            aspectRatio: false,
            screenshot: false,
            setting: false,
            hotkey: true,
            pip: false,
            mutex: true,
            fullscreen: false,
            fullscreenWeb: false,
            layers: [],
            contextmenu: [],
            quality: [],
            controls: [],
            highlight: [],
            plugins: [],
            whitelist: [],
            thumbnails: {
                url: '',
                number: 60,
                width: 160,
                height: 90,
                column: 10,
            },
            subtitle: {
                url: '',
                style: {},
            },
            moreVideoAttr: {
                controls: false,
                preload: 'auto',
            },
            icons: {
                loading: '',
                playBig: '',
            },
            customType: {},
            lang: navigator.language.toLowerCase(),
        };
    }

    init() {
        this.whitelist = new Whitelist(this);
        this.template = new Template(this);
        if (this.whitelist.state) {
            this.isFocus = false;
            this.isDestroy = false;
            this.storage = new Storage(this);
            this.i18n = new I18n(this);
            this.notice = new Notice(this);
            this.events = new Events(this);
            this.player = new Player(this);
            this.layers = new Layers(this);
            this.controls = new Controls(this);
            this.contextmenu = new Contextmenu(this);
            this.subtitle = new Subtitle(this);
            this.info = new Info(this);
            this.loading = new Loading(this);
            this.hotkey = new Hotkey(this);
            this.mask = new Mask(this);
            this.setting = new Setting(this);
            this.plugins = new Plugins(this);
        } else {
            this.mobile = new Mobile(this);
        }

        id += 1;
        this.id = id;
        Artplayer.instances.push(this);
    }

    destroy(removeHtml = false) {
        if (this.events) {
            this.events.destroy();
        }
        this.template.destroy(removeHtml);
        Artplayer.instances.splice(Artplayer.instances.indexOf(this), 1);
        this.isDestroy = true;
        this.emit('destroy');
    }
}

Object.defineProperty(Artplayer, 'instances', {
    value: [],
});

window.Artplayer = Artplayer;
export default Artplayer;
