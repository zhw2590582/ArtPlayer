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
    const { refs: { $danmu }, i18n, notice } = this.art;
    setStyle($danmu, 'display', 'block');
    notice.show(i18n.get('Show danmu'));
    this.art.emit('danmu:show', $danmu);
  }

  hide() {
    const { refs: { $danmu }, i18n, notice } = this.art;
    setStyle($danmu, 'display', 'none');
    notice.show(i18n.get('Hide danmu'));
    this.art.emit('danmu:hide', $danmu);
  }
}
