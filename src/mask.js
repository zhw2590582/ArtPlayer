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
      option,
      refs,
      events: { proxy }
    } = this.art;

    const playClone = icons.play.cloneNode(true);
    playClone.style.backgroundColor = option.theme;
    append(refs.$mask, playClone);

    proxy(refs.$mask, 'click', () => {
      player.play();
      this.hide();
    });
  }

  show() {
    const { $mask } = this.art.refs;
    $mask.style.display = 'flex';
    this.art.emit('mask:show', $mask);
  }

  hide() {
    const { $mask } = this.art.refs;
    $mask.style.display = 'none';
    this.art.emit('mask:show', $mask);
  }
}
