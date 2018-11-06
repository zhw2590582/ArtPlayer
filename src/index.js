import './style';
import 'balloon-css/balloon.min.css';
import { deepMerge } from './utils';
import optionValidator from 'option-validator';
import scheme from './scheme';
import config from './config';
import Emitter from 'tiny-emitter';
import Template from './template';
import I18n from './i18n';
import Player from './player';
import Controls from './controls';
import Contextmenu from './contextmenu';
import Danmu from './danmu';
import Info from './info';
import Subtitle from './subtitle';
import Events from './events';
import Hotkey from './hotkey';
import Layers from './layers';
import Loading from './loading';
import Notice from './notice';
import Mask from './mask';
import Setting from './setting';

let id = 0;
export const instances = [];

class Artplayer extends Emitter {
  constructor(option) {
    super();
    this.emit('init:start');
    this.option = deepMerge({}, Artplayer.DEFAULTS, option);
    optionValidator(this.option, scheme);
    this.init();
    this.emit('init:end');
  }

  static get version() {
    return '__VERSION__';
  }

  static get config() {
    return config;
  }

  static get DEFAULTS() {
    return {
      container: '.artplayer',
      url: '',
      poster: '',
      title: '',
      volume: 0.7,
      thumbnails: {
        url: '',
        number: 60,
        width: 160,
        height: 90,
        column: 10
      },
      screenshot: true,
      autoplay: false,
      playbackRate: true,
      aspectRatio: true,
      loop: false,
      type: '',
      mimeCodec: '',
      layers: [],
      contextmenu: [],
      quality: [],
      loading: '',
      play: '',
      theme: '#f00',
      setting: false,
      hotkey: true,
      pip: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitle: {
        url: '',
        style: {}
      },
      controls: [],
      highlight: [],
      moreVideoAttr: {
        'crossOrigin': 'anonymous',
        'controls': false,
        'preload': 'auto',
        'webkit-playsinline': true,
        'playsinline': true
      },
      lang: navigator.language.toLowerCase()
    };
  }

  static use(Plugin) {
    const name = Plugin.name.toLowerCase();
    const installedPlugins = this.plugins || (this.plugins = {});
    if (!installedPlugins[name]) {
      const args = Array.from(arguments).slice(1);
      args.unshift(this);
      installedPlugins[name] = new Plugin(...args);
      this.prototype.emit('use', Plugin);
    }
    return this;
  }

  init() {
    this.isError = false;
    this.isFocus = false;
    this.isPlaying = false;
    this.refs = {};

    if (this.option.container instanceof Element) {
      this.refs.$container = this.option.container;
    } else {
      this.refs.$container = document.querySelector(this.option.container);
    }

    this.template = new Template(this);
    this.i18n = new I18n(this);
    this.notice = new Notice(this);
    this.events = new Events(this);
    this.player = new Player(this);
    this.layers = new Layers(this);
    this.controls = new Controls(this);
    this.contextmenu = new Contextmenu(this);
    this.danmu = new Danmu(this);
    this.subtitle = new Subtitle(this);
    this.info = new Info(this);
    this.loading = new Loading(this);
    this.hotkey = new Hotkey(this);
    this.mask = new Mask(this);
    this.setting = new Setting(this);

    this.id = id++;
    instances.push(this);
    return this;
  }

  destroy(removeHtml = false) {
    this.events.destroy();
    instances.splice(instances.indexOf(this), 1);
    if (removeHtml) {
      this.refs.$container.innerHTML = '';
    } else {
      this.refs.$player.classList.add('artplayer-destroy');
    }
    this.emit('destroy');
  }
}

window.Artplayer = Artplayer;
export default Artplayer;
