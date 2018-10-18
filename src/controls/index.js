import { append, setStyle } from '../utils';
import validControl from '../verification/control';
import Danmu from './danmu';
import Fullscreen from './fullscreen';
import Highlight from './highlight';
import Pip from './pip';
import PlayAndPause from './playAndPause';
import Progress from './progress';
import Screenshot from './screenshot';
import Subtitle from './subtitle';
import Time from './time';
import Volume from './volume';
import Setting from './setting';

let id = 0;
export default class Controls {
  constructor(art) {
    this.art = art;
    this.$map = {
      top: [],
      left: [],
      right: []
    };
    this.init();
    this.mount();
  }

  init() {
    this.add({
      control: Progress,
      disable: false,
      html: 'Progress',
      position: 'top',
      index: 0
    });

    this.add({
      control: Highlight,
      disable: false,
      html: 'Highlight',
      position: 'top',
      index: 10
    });

    this.add({
      control: Screenshot,
      disable: false,
      html: 'Screenshot',
      position: 'top',
      index: 20
    });

    this.add({
      control: PlayAndPause,
      disable: false,
      html: 'PlayAndPause',
      tooltip: 'PlayAndPause',
      position: 'left',
      index: 0
    });

    this.add({
      control: Volume,
      disable: false,
      html: 'Volume',
      tooltip: 'Volume',
      position: 'left',
      index: 10
    });

    this.add({
      control: Time,
      disable: false,
      html: 'Time',
      tooltip: 'Volume',
      position: 'left',
      index: 20
    });

    this.add({
      control: Danmu,
      disable: false,
      html: 'Danmu',
      tooltip: 'Danmu',
      position: 'right',
      index: 0
    });

    this.add({
      control: Subtitle,
      disable: false,
      html: 'Subtitle',
      tooltip: 'Subtitle',
      position: 'right',
      index: 10
    });

    this.add({
      control: Setting,
      disable: false,
      html: 'Setting',
      tooltip: 'Setting',
      position: 'right',
      index: 20
    });

    this.add({
      control: Pip,
      disable: false,
      html: 'Pip',
      tooltip: 'Pip',
      position: 'right',
      index: 30
    });

    this.add({
      control: Fullscreen,
      disable: false,
      html: 'Fullscreen',
      tooltip: 'Fullscreen',
      position: 'right',
      index: 40
    });

    this.art.option.controls.forEach(item => {
      this.add(item);
    });
  }

  add(option) {
    validControl(option);
    if (!option.disable) {
      id++;
      const name = option.control.name.toLowerCase() || `control${id}`;
      const $control = document.createElement('div');
      $control.setAttribute('class', `art-control art-control-${name}`);
      $control.setAttribute('data-control-index', String(option.index) || id);
      setStyle($control, option.style || {});
      append($control, option.html);
      option.ref = $control;
      this.commonMethod(option);
      this[name] = new option.control(this.art, option);
      this.$map[option.position].push($control);
    }
  }

  mount() {
    const { $progress, $controlsLeft, $controlsRight } = this.art.refs;
    Object.keys(this.$map).forEach(key => {
      const $list = this.$map[key].sort(
        (a, b) =>
          Number(a.dataset.controlIndex) - Number(b.dataset.controlIndex)
      );

      $list.forEach($control => {
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

  commonMethod(option) {
    Object.defineProperty(option.control.prototype, 'hide', {
      value: () => {
        option.ref.style.display = 'none';
        this.art.emit('control:hide', option.ref);
      }
    });

    Object.defineProperty(option.control.prototype, 'show', {
      value: () => {
        option.ref.style.display = option.position === 'top' ? 'block' : 'inline-block';
        this.art.emit('control:show', option.ref);
      }
    });

    Object.defineProperty(option.control.prototype, 'addMenu', {
      value: (menus) => {
        console.log(menus);
      }
    });
  }

  show() {
    const { $wrap } = this.art.refs;
    $wrap.classList.add('controls-show');
  }

  hide() {
    const { $wrap } = this.art.refs;
    $wrap.classList.remove('controls-show');
  }
}
