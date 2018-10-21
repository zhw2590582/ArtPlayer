import { secondToTime, clamp } from '../utils';
import validControl from '../verification/control';
import Danmu from './danmu';
import Fullscreen from './fullscreen';
import Pip from './pip';
import PlayAndPause from './playAndPause';
import Progress from './progress';
import Subtitle from './subtitle';
import Time from './time';
import Volume from './volume';
import Setting from './setting';
import Thumbnails from './thumbnails';

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
      position: 'top',
      index: 10
    });

    this.add({
      control: Thumbnails,
      disable: !this.art.option.thumbnails.url,
      position: 'top',
      index: 20
    });

    this.add({
      control: PlayAndPause,
      disable: false,
      position: 'left',
      index: 10
    });

    this.add({
      control: Volume,
      disable: false,
      tooltip: 'Volume',
      position: 'left',
      index: 20
    });

    this.add({
      control: Time,
      disable: false,
      tooltip: 'Volume',
      position: 'left',
      index: 30
    });

    this.add({
      control: Danmu,
      disable: false,
      tooltip: 'Danmu',
      position: 'right',
      index: 10
    });

    this.add({
      control: Subtitle,
      disable: false,
      tooltip: 'Subtitle',
      position: 'right',
      index: 20
    });

    this.add({
      control: Setting,
      disable: false,
      tooltip: 'Setting',
      position: 'right',
      index: 30
    });

    this.add({
      control: Pip,
      disable: false,
      tooltip: 'Pip',
      position: 'right',
      index: 40
    });

    this.add({
      control: Fullscreen,
      disable: false,
      tooltip: 'Fullscreen',
      position: 'right',
      index: 50
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
      option.ref = $control;
      this.commonMethod(option);
      this[name] = new option.control(this.art, option);
      this.$map[option.position].push($control);
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

  commonMethod(option) {
    Object.defineProperty(option.control.prototype, 'hide', {
      value: () => {
        option.ref.style.display = 'none';
        this.art.emit('control:hide', option.ref);
      }
    });

    Object.defineProperty(option.control.prototype, 'show', {
      value: () => {
        option.ref.style.display =
          option.position === 'top' ? 'block' : 'inline-block';
        this.art.emit('control:show', option.ref);
      }
    });

    Object.defineProperty(option.control.prototype, 'getPosFromEvent', {
      value: event => {
        const { $video, $progress } = this.art.refs;
        const { left } = $progress.getBoundingClientRect();
        const width = clamp(event.x - left, 0, $progress.clientWidth);
        const second = width / $progress.clientWidth * $video.duration;
        const time = secondToTime(second);
        const percentage = clamp(width / $progress.clientWidth, 0, 1);
        return { second, time, width, percentage };
      }
    });
  }

  show() {
    const { $player } = this.art.refs;
    $player.classList.add('controls-show');
  }

  hide() {
    const { $player } = this.art.refs;
    $player.classList.remove('controls-show');
  }
}
