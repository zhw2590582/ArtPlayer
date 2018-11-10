import icons from './icons';
import { append, setStyle } from './utils';

export default class Mask {
  constructor(art) {
    this.art = art;
    const { refs: { $mask } } = art;
    append($mask, icons.playBig);
  }

  show() {
    const { $mask } = this.art.refs;
    setStyle($mask, 'display', 'flex');
    this.art.emit('mask:show', $mask);
  }

  hide() {
    const { $mask } = this.art.refs;
    setStyle($mask, 'display', 'none');
    this.art.emit('mask:show', $mask);
  }
}
