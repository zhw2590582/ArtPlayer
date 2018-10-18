import icons from './icons';
import { append } from './utils';

export default class Loading {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { option, refs: { $loading } } = this.art;
    append($loading, option.loading || icons.loading);
  }

  hide() {
    const { $loading } = this.art.refs;
    $loading.style.display = 'none';
    this.art.emit('loading:hide', $loading);
  }

  show() {
    const { $loading } = this.art.refs;
    $loading.style.display = 'flex';
    this.art.emit('loading:show', $loading);
  }
}
