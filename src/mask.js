import Icons from './icons';

export default class Mask {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    this.art.refs.$mask.appendChild(Icons.play);
  }

  show() {
    this.art.refs.$mask.style.display = 'flex';
  }

  hide() {
    this.art.refs.$mask.style.display = 'none';
  }
}
