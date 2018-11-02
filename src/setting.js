import { setStyle } from './utils';

export default class Setting {
  constructor(art) {
    this.art = art;
    this.isOpen = false;
    this.init();
  }

  init() {
    //
  }

  add() {
    //
  }

  switch(name) {
    console.log(name);
  }

  show() {
    const { refs: { $setting }, i18n, notice } = this.art;
    setStyle($setting, 'display', 'flex');
    this.isOpen = true;
    notice.show(i18n.get('Show setting'));
    this.art.emit('setting:show', $setting);
  }

  hide() {
    const { refs: { $setting }, i18n, notice } = this.art;
    setStyle($setting, 'display', 'none');
    this.isOpen = false;
    notice.show(i18n.get('Hide setting'));
    this.art.emit('setting:hide', $setting);
  }
}
