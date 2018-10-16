import Icons from './icons';

export default class Loading {
  constructor(art) {
    this.art = art;
    this.state = false;
    this.init();
  }

  init() {
    const { option, refs: { $loading } } = this.art;
    if (option.loading) {
      $loading.insertAdjacentHTML('beforeend', option.loading);
    } else {
      $loading.appendChild(Icons.loading);
    }
  }

  hide() {
    this.state = false;
    this.art.refs.$loading.style.display = 'none';
  }

  show() {
    this.state = true;
    this.art.refs.$loading.style.display = 'flex';
  }
}
