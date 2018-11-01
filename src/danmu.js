import { setStyle } from './utils';

export default class Danmu {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    //
  }

  show() {
    const { $danmu } = this.art.refs;
    setStyle($danmu, 'display', 'block');
    this.art.emit('danmu:show', $danmu);
  }

  hide() {
    const { $danmu } = this.art.refs;
    setStyle($danmu, 'display', 'none');
    this.art.emit('danmu:hide', $danmu);
  }
}
