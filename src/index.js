import './style/index.scss';
import Emitter from 'tiny-emitter';
import { verification } from './utils';
import I18n from './i18n';
import Player from './player';
import Controls from './controls';
import Contextmenu from './contextmenu';
import Danmu from './danmu';
import Info from './info';
import Captions from './captions';
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
      //
    };
  }

  init() {
    this.refs = {};
    this.destroyEvents = [];

    this.i18n = new I18n(this);
    this.player = new Player(this);
    this.controls = new Controls(this);
    this.contextmenu = new Contextmenu(this);
    this.danmu = new Danmu(this);
    this.captions = new Captions(this);
    this.info = new Info(this);
    this.events = new Events(this);
    this.hotkey = new Hotkey(this);

    this.id = id++;
    instances.push(this);

    console.log(this);
  }

  destroy() {
    this.destroyEvents.forEach(event => event.destroy());
    this.refs.container.innerHTML = '';
  }
}

window.Artplayer = Artplayer;
export default Artplayer;
