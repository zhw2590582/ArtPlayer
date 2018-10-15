import Icons from './icons';

export default class Loading {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { option } = this.art;
    if (option.loading) {
      this.art.refs.$loading.insertAdjacentHTML('beforeend', option.loading);
    } else {
      this.art.refs.$loading.appendChild(Icons.loading);
    }
  }

  hide() {
    this.art.refs.$loading.style.display = 'none';
  }

  show() {
    this.art.refs.$loading.style.display = 'block';
  }
}
