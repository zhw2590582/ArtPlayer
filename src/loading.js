import icons from './icons';
import { append } from './utils';

export default class Loading {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { option, refs: { $loading } } = this.art;
    if (option.loading) {
      append($loading, option.loading);
    } else {
      append($loading, icons.loading);
    }
  }

  hide() {
    this.art.refs.$loading.style.display = 'none';
  }

  show() {
    this.art.refs.$loading.style.display = 'flex';
  }
}
