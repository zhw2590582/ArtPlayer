import { append } from '../utils';
import validControl from '../utils/validControl';
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
    this.init();
  }

  init() {
    this.progress = new Progress(this.art);
    this.highlight = new Highlight(this.art);
    this.screenshot = new Screenshot(this.art);

    this.add({
      control: PlayAndPause,
      disable: false,
      icon: 'PlayAndPause',
      position: 'left',
      index: 0
    });

    this.add({
      control: Volume,
      disable: false,
      icon: 'Volume',
      position: 'left',
      index: 10
    });

    this.add({
      control: Time,
      disable: false,
      icon: 'Time',
      position: 'left',
      index: 20
    });

    this.add({
      control: Danmu,
      disable: false,
      icon: 'Danmu',
      position: 'right',
      index: 0
    });

    this.add({
      control: Subtitle,
      disable: false,
      icon: 'Subtitle',
      position: 'right',
      index: 10
    });

    this.add({
      control: Setting,
      disable: false,
      icon: 'Setting',
      position: 'right',
      index: 20
    });

    this.add({
      control: Pip,
      disable: false,
      icon: 'Pip',
      position: 'right',
      index: 30
    });

    this.add({
      control: Fullscreen,
      disable: false,
      icon: 'Fullscreen',
      position: 'right',
      index: 40
    });

    this.art.option.controls.forEach(item => {
      this.add(item);
    });
  }

  add(option) {
    validControl(option);
    const { $progress, $controlsLeft, $controlsRight } = this.art.refs;
    if (!option.disable) {
      id++;
      const name = option.control.name.toLowerCase() || `control${id}`;
      const $control = document.createElement('div');
      $control.setAttribute('class', `art-control art-control-${name}`);
      $control.setAttribute('data-control-index', option.index || id);
      append($control, option.icon);
      this[name] = new option.control(this.art);
      this[name].ref = $control;
      this[name].show = function show() {
        $control.style.display = 'inline-block';
      };
      this[name].hide = function show() {
        $control.style.display = 'none';
      };
    }
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
