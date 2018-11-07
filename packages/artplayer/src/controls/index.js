import { insertByIndex } from '../utils';
import Fullscreen from './fullscreen';
import FullscreenWeb from './fullscreenWeb';
import Pip from './pip';
import PlayAndPause from './playAndPause';
import Progress from './progress';
import Subtitle from './subtitle';
import Time from './time';
import Volume from './volume';
import Setting from './setting';
import Thumbnails from './thumbnails';
import Screenshot from './screenshot';
import Quality from './quality';

let id = 0;
export default class Controls {
  constructor(art) {
    this.art = art;
    this.art.on('firstCanplay', () => {
      this.init();
    });
  }

  init() {
    this.add(new Progress({
      name: 'progress',
      disable: false,
      position: 'top',
      index: 10
    }));

    this.add(new Thumbnails({
      name: 'thumbnails',
      disable: !this.art.option.thumbnails.url,
      position: 'top',
      index: 20
    }));

    this.add(new PlayAndPause({
      name: 'playAndPause',
      disable: false,
      position: 'left',
      index: 10
    }));

    this.add(new Volume({
      name: 'volume',
      disable: false,
      position: 'left',
      index: 20
    }));

    this.add(new Time({
      name: 'time',
      disable: false,
      position: 'left',
      index: 30
    }));

    this.add(new Quality({
      name: 'quality',
      disable: this.art.option.quality.length === 0,
      position: 'right',
      index: 10
    }));

    this.add(new Screenshot({
      name: 'screenshot',
      disable: !this.art.option.screenshot,
      position: 'right',
      index: 20
    }));

    this.add(new Subtitle({
      name: 'subtitle',
      disable: !this.art.option.subtitle.url,
      position: 'right',
      index: 30
    }));

    this.add(new Setting({
      name: 'setting',
      disable: !this.art.option.setting,
      position: 'right',
      index: 40
    }));

    this.add(new Pip({
      name: 'pip',
      disable: !this.art.option.pip,
      position: 'right',
      index: 50
    }));

    this.add(new FullscreenWeb({
      name: 'fullscreenWeb',
      disable: !this.art.option.fullscreenWeb,
      position: 'right',
      index: 60
    }));

    this.add(new Fullscreen({
      name: 'fullscreen',
      disable: !this.art.option.fullscreen,
      position: 'right',
      index: 70
    }));

    this.art.option.controls.forEach(item => {
      this.add(item);
    });
  }

  add(control) {
    const { option } = control;
    if (option && !option.disable) {
      id++;
      const name = option.name || control.constructor.name.toLowerCase() || `control${id}`;
      const $control = document.createElement('div');
      $control.setAttribute('class', `art-control art-control-${name}`);
      this.mount(option.position, $control, option.index || id);
      control.apply && control.apply(this.art, $control);
      this[name] = control;
    }
  }

  mount(position, $control, index) {
    const { $progress, $controlsLeft, $controlsRight } = this.art.refs;
    switch (position) {
      case 'top':
        insertByIndex($progress, $control, index);
        break;
      case 'left':
        insertByIndex($controlsLeft, $control, index);
        break;
      case 'right':
        insertByIndex($controlsRight, $control, index);
        break;
      default:
        break;
    }
  }

  show() {
    const { $player } = this.art.refs;
    $player.classList.add('artplayer-controls-show');
  }

  hide() {
    const { $player } = this.art.refs;
    $player.classList.remove('artplayer-controls-show');
  }
}
