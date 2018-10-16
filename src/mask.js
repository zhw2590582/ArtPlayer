import Icons from './icons';

export default class Mask {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const {
      option,
      refs,
      events: { proxy }
    } = this.art;

    Icons.play.style.backgroundColor = option.theme;
    refs.$mask.appendChild(Icons.play);

    proxy(refs.$mask, 'click', () => {
      refs.$video.play();
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
