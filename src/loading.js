import icons from './icons';
import { append, setStyle } from './utils';

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
    setStyle($loading, 'display', 'none');
    this.art.emit('loading:hide', $loading);
  }

  show() {
    const { $loading } = this.art.refs;
    setStyle($loading, 'display', 'flex');
    this.art.emit('loading:show', $loading);
  }
}
