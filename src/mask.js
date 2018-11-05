import icons from './icons';
import { append, setStyle } from './utils';

export default class Mask {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { option, refs: { $mask } } = this.art;
    append($mask, option.play || icons.playBig);
  }

  show() {
    const { $mask } = this.art.refs;
    setStyle($mask, 'display', 'block');
    this.art.emit('mask:show', $mask);
  }

  hide() {
    const { $mask } = this.art.refs;
    setStyle($mask, 'display', 'none');
    this.art.emit('mask:show', $mask);
  }
}
