import icons from './icons';
import { append } from './utils';

export default class Mask {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const {
      player,
      refs,
      events: { proxy }
    } = this.art;

    append(refs.$mask, icons.playBig);

    proxy(refs.$mask, 'click', () => {
      player.play();
      this.hide();
    });
  }

  show() {
    const { $mask } = this.art.refs;
    $mask.style.display = 'block';
    this.art.emit('mask:show', $mask);
  }

  hide() {
    const { $mask } = this.art.refs;
    $mask.style.display = 'none';
    this.art.emit('mask:show', $mask);
  }
}
