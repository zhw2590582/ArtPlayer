import './style/index.scss';
import verification from './utils/verification';
import config from './config';
import Emitter from 'tiny-emitter';
import Template from './template';
import I18n from './i18n';
import Player from './player';
import Mse from './mse';
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

let id = 0;
export const instances = [];

class Artplayer extends Emitter {
  constructor(option) {
    super();
    this.art.emit('init:start');
    this.option = Object.assign({}, Artplayer.DEFAULTS, option);
    verification(this.option);
    this.init();
    this.art.emit('init:end');
  }

  static get version() {
    return '__VERSION__';
  }

  static get config() {
    return config;
  }

  static get DEFAULTS() {
    return {
      container: document.querySelector('.artplayer'),
      url: '',
      poster: '',
      volume: 0.7,
      autoplay: false,
      preload: 'auto',
      type: '',
      mimeCodec: '',
      layers: [],
      contextmenu: [],
      loading: '',
      theme: '#1aafff',
      hotkey: true,
      subtitle: '',
      subtitleStyle: {},
      lang: navigator.language.toLowerCase()
    };
  }

  static use(plugin) {
    const installedPlugins = this.plugins || (this.plugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    const args = Array.from(arguments).slice(1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  }

  init() {
    this.focus = false;
    this.playing = false;
    this.refs = {};

    if (this.option.container instanceof Element) {
      this.refs.$container = this.option.container;
    } else {
      this.refs.$container = document.querySelector(this.option.container);
    }

    this.template = new Template(this);
    this.i18n = new I18n(this);
    this.events = new Events(this);
    this.player = new Player(this);
    this.mse = new Mse(this);
    this.layers = new Layers(this);
    this.controls = new Controls(this);
    this.contextmenu = new Contextmenu(this);
    this.danmu = new Danmu(this);
    this.subtitle = new Subtitle(this);
    this.info = new Info(this);
    this.loading = new Loading(this);
    this.notice = new Notice(this);
    this.hotkey = new Hotkey(this);
    this.mask = new Mask(this);

    this.id = id++;
    instances.push(this);
    return this;
  }

  destroy() {
    this.events.destroy();
    this.refs.$container.innerHTML = '';
    instances.splice(instances.indexOf(this), 1);
    this.art.emit('destroy');
  }
}

window.Artplayer = Artplayer;
export default Artplayer;
