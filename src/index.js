import './style/index.scss';
import verification from './utils/verification';
import Emitter from 'tiny-emitter';
import Template from './template';
import I18n from './i18n';
import Player from './player';
import Mse from './mse';
import Controls from './controls';
import Contextmenu from './contextmenu';
import Danmaku from './danmaku';
import Info from './info';
import Subtitle from './subtitle';
import Events from './events';
import Hotkey from './hotkey';

let id = 0;
export const instances = [];

class Artplayer extends Emitter {
  constructor(option) {
    super();
    this.option = Object.assign({}, Artplayer.DEFAULTS, option);
    verification(this.option);
    this.init();
  }

  static get version() {
    return '__VERSION__';
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
    this.refs = {
      $container: this.option.container
    };

    this.destroyEvents = [];

    this.template = new Template(this);
    this.i18n = new I18n(this);
    this.player = new Player(this);
    this.mse = new Mse(this);
    this.controls = new Controls(this);
    this.contextmenu = new Contextmenu(this);
    this.danmaku = new Danmaku(this);
    this.subtitle = new Subtitle(this);
    this.info = new Info(this);
    this.events = new Events(this);
    this.hotkey = new Hotkey(this);

    this.id = id++;
    instances.push(this);
  }

  destroy() {
    this.destroyEvents.forEach(event => event());
    this.refs.container.innerHTML = '';
    instances.splice(instances.indexOf(this), 1);
  }
}

window.Artplayer = Artplayer;
export default Artplayer;
