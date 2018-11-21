import './style';
import 'balloon-css/balloon.min.css';
import Emitter from 'tiny-emitter';
import optionValidator from 'option-validator';
import merge from 'deepmerge';
import * as utils from './utils';
import scheme from './scheme';
import config from './config';
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

let id = 0;
class Artplayer extends Emitter {
    constructor(option) {
        super();
        this.option = merge(Artplayer.DEFAULTS, option);
        optionValidator(this.option, scheme);
        this.init();
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

    static get DEFAULTS() {
        return {
            container: '#artplayer',
            url: '',
            poster: '',
            title: '',
            type: '',
            mimeCodec: '',
            theme: '#f00',
            volume: 0.7,
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
            lang: navigator.language.toLowerCase(),
        };
    }

    static use(...args) {
        const plugin = args[0];
        const installedPlugins = this.plugins || (this.plugins = []);
        if (installedPlugins.indexOf === -1) {
            installedPlugins.push(plugin);
            args.unshift(this);
            plugin(...args.slice(1));
            this.prototype.emit('use', plugin);
        }
        return this;
    }

    init() {
        this.isFocus = false;
        this.isPlaying = false;
        this.refs = {};

        if (this.option.container instanceof Element) {
            this.refs.$container = this.option.container;
        } else {
            this.refs.$container = document.querySelector(this.option.container);
        }

        if (Artplayer.instances.some(art => art.refs.$container === this.refs.$container)) {
            utils.errorHandle(false, 'Cannot mount multiple instances on the same dom element');
        }

        this.template = new Template(this);
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

        id += 1;
        this.id = id;
        Artplayer.instances.push(this);
    }

    destroy(removeHtml = false) {
        this.events.destroy();
        Artplayer.instances.splice(Artplayer.instances.indexOf(this), 1);
        if (removeHtml) {
            this.refs.$container.innerHTML = '';
        } else {
            this.refs.$player.classList.add('artplayer-destroy');
        }
        this.emit('destroy');
    }
}

Object.defineProperty(Artplayer, 'instances', {
    value: [],
});

window.Artplayer = Artplayer;
export default Artplayer;
