import { setStyle, append } from '../utils';
import Danmu from './danmu';
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
    this.$map = {};
    this.art.on('firstCanplay', () => {
      this.init();
      this.mount();
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

    this.add(new Danmu({
      name: 'danmu',
      disable: false,
      position: 'right',
      index: 20
    }));

    this.add(new Screenshot({
      name: 'screenshot',
      disable: !this.art.option.screenshot,
      position: 'right',
      index: 30
    }));

    this.add(new Subtitle({
      name: 'subtitle',
      disable: !this.art.option.subtitle.url,
      position: 'right',
      index: 40
    }));

    this.add(new Setting({
      name: 'setting',
      disable: !this.art.option.setting,
      position: 'right',
      index: 50
    }));

    this.add(new Pip({
      name: 'pip',
      disable: !this.art.option.pip,
      position: 'right',
      index: 60
    }));

    this.add(new FullscreenWeb({
      name: 'fullscreenWeb',
      disable: !this.art.option.fullscreenWeb,
      position: 'right',
      index: 70
    }));

    this.add(new Fullscreen({
      name: 'fullscreen',
      disable: !this.art.option.fullscreen,
      position: 'right',
      index: 80
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
      $control.dataset.controlIndex = option.index || id;
      this.commonMethod(control);
      (this.$map[option.position] || (this.$map[option.position] = [])).push($control);
      control.apply && control.apply(this.art, $control);
      this[name] = control;
    }
  }

  mount() {
    const { $progress, $controlsLeft, $controlsRight } = this.art.refs;
    Object.keys(this.$map).forEach(key => {
      this.$map[key]
        .sort(
          (a, b) =>
            Number(a.dataset.controlIndex) - Number(b.dataset.controlIndex)
        )
        .forEach($control => {
          switch (key) {
            case 'top':
              append($progress, $control);
              break;
            case 'left':
              append($controlsLeft, $control);
              break;
            case 'right':
              append($controlsRight, $control);
              break;
            default:
              break;
          }
        });
    });
  }

  commonMethod(control) {
    Object.defineProperty(control, 'hide', {
      value: () => {
        setStyle(control.option.$control, 'display', 'none');
        this.art.emit('control:hide', control.option.$control);
      }
    });

    Object.defineProperty(control, 'show', {
      value: () => {
        setStyle(control.option.$control, 'display', 'block');
        this.art.emit('control:show', control.option.$control);
      }
    });
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
