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

    icons.play.style.backgroundColor = option.theme;
    append(refs.$mask, icons.play);

    proxy(refs.$mask, 'click', () => {
      player.play();
      this.hide();
    });
  }

  show() {
    this.art.refs.$mask.style.display = 'flex';
  }

  hide() {
    this.art.refs.$mask.style.display = 'none';
  }
}
