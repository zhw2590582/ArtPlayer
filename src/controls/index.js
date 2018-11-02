import { setStyle } from '../utils';
import Danmu from './danmu';
import Fullscreen from './fullscreen';
import FullscreenWeb from './fullscreen-web';
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
      disable: false,
      position: 'top',
      index: 10
    }));

    this.add(new Thumbnails({
      disable: !this.art.option.thumbnails.url,
      position: 'top',
      index: 20
    }));

    this.add(new PlayAndPause({
      disable: false,
      position: 'left',
      index: 10
    }));

    this.add(new Volume({
      disable: false,
      position: 'left',
      index: 20
    }));

    this.add(new Time({
      disable: false,
      position: 'left',
      index: 30
    }));

    this.add(new Quality({
      disable: this.art.option.quality.length === 0,
      position: 'right',
      index: 10
    }));

    this.add(new Danmu({
      disable: false,
      position: 'right',
      index: 20
    }));

    this.add(new Screenshot({
      disable: !this.art.option.screenshot,
      position: 'right',
      index: 30
    }));

    this.add(new Subtitle({
      disable: !this.art.option.subtitle.url,
      position: 'right',
      index: 40
    }));

    this.add(new Setting({
      disable: !this.art.option.setting,
      position: 'right',
      index: 50
    }));

    this.add(new Pip({
      disable: !this.art.option.pip,
      position: 'right',
      index: 60
    }));

    this.add(new FullscreenWeb({
      disable: !this.art.option.fullscreenWeb,
      position: 'right',
      index: 70
    }));

    this.add(new Fullscreen({
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
      const name = control.constructor.name.toLowerCase() || `control${id}`;
      const $control = document.createElement('div');
      $control.setAttribute('class', `art-control art-control-${name}`);
      $control.setAttribute('data-control-index', String(option.index) || id);
      option.$control = $control;
      this.commonMethod(control);
      (this.$map[option.position] || (this.$map[option.position] = [])).push($control);
      control.apply && control.apply(this.art);
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
              $progress.appendChild($control);
              break;
            case 'left':
              $controlsLeft.appendChild($control);
              break;
            case 'right':
              $controlsRight.appendChild($control);
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
