import './style/index.scss';
import validator from 'option-validator';
import Emitter from './utils/emitter';
import * as utils from './utils';
import scheme from './scheme';
import config from './config';
import Whitelist from './whitelist';
import Template from './template';
import I18n from './i18n';
import Player from './player';
import Control from './control';
import Contextmenu from './contextmenu';
import Info from './info';
import Subtitle from './subtitle';
import Events from './events';
import Hotkey from './hotkey';
import Layer from './layer';
import Loading from './loading';
import Notice from './notice';
import Mask from './mask';
import Icons from './icons';
import Setting from './setting';
import Storage from './storage';
import Plugins from './plugins';
import Mobile from './mobile';

let id = 0;
const instances = [];
export default class Artplayer extends Emitter {
    constructor(option) {
        super();
        this.option = validator(utils.mergeDeep(Artplayer.option, option), scheme);
        this.isFocus = false;
        this.isDestroy = false;
        this.userAgent = utils.userAgent;
        this.isMobile = utils.isMobile;
        this.isWechat = utils.isWechat;
        this.whitelist = new Whitelist(this);
        this.template = new Template(this);
        this.events = new Events(this);
        if (this.whitelist.state) {
            this.storage = new Storage(this);
            this.icons = new Icons(this);
            this.i18n = new I18n(this);
            this.notice = new Notice(this);
            this.player = new Player(this);
            this.layers = new Layer(this);
            this.controls = new Control(this);
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
        instances.push(this);
    }

    static get instances() {
        return instances;
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

    static get scheme() {
        return scheme;
    }

    static get Emitter() {
        return Emitter;
    }

    static get validator() {
        return validator;
    }

    static get kindOf() {
        return validator.kindOf;
    }

    static get option() {
        return {
            container: '#artplayer',
            url: '',
            poster: '',
            title: '',
            theme: '#f00',
            volume: 0.7,
            isLive: false,
            muted: false,
            autoplay: false,
            autoSize: false,
            autoMin: false,
            loop: false,
            flip: false,
            playbackRate: false,
            aspectRatio: false,
            screenshot: false,
            setting: false,
            hotkey: true,
            pip: false,
            mutex: true,
            light: false,
            backdrop: true,
            fullscreen: false,
            fullscreenWeb: false,
            subtitleOffset: false,
            miniProgressBar: false,
            localVideo: false,
            localSubtitle: false,
            networkMonitor: false,
            layers: [],
            contextmenu: [],
            controls: [],
            quality: [],
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
                preload: utils.isSafari ? 'auto' : 'metadata',
            },
            icons: {},
            customType: {},
            lang: navigator.language.toLowerCase(),
        };
    }

    destroy(removeHtml = true) {
        this.events.destroy();
        this.template.destroy(removeHtml);
        instances.splice(instances.indexOf(this), 1);
        this.isDestroy = true;
        this.emit('destroy');
    }
}

// eslint-disable-next-line no-console
console.log(
    '%c ArtPlayer %c __VERSION__ %c https://artplayer.org',
    'color: #fff; background: #5f5f5f',
    'color: #fff; background: #4bc729',
    '',
);
