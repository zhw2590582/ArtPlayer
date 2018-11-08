import { setStyle, append, insertByIndex } from '../utils';
import Common from './common';

let id = 0;
export default class Setting {
  constructor(art) {
    id = 0;
    this.art = art;
    this.state = false;
    if (art.option.setting) {
      this.init();
    }
  }

  init() {
    const { refs: { $settingClose }, events: { proxy } } = this.art;

    proxy($settingClose, 'click', () => {
      this.hide();
    });

    this.add(new Common({
      name: 'common',
      title: 'Common',
      disable: false,
      index: 10
    }));
  }

  add(setting) {
    const { refs } = this.art;
    const { option } = setting;
    if (option && !option.disable) {
      id++;
      const name = option.name || setting.constructor.name.toLowerCase() || `setting${id}`;
      const title = option.title || name;
      const $setting = document.createElement('div');
      $setting.setAttribute('class', `art-setting art-setting-${name}`);
      $setting.dataset.settingIndex = option.index || id;
      append($setting, `<div class="art-setting-header">${this.art.i18n.get(title)}</div>`);
      append($setting, '<div class="art-setting-body"></div>');
      setting.apply && setting.apply(this.art, $setting);
      this[name] = $setting;
      insertByIndex(refs.$settingBody, $setting, option.index || id);
    }
  }

  show() {
    const { refs: { $setting }, i18n, notice } = this.art;
    setStyle($setting, 'display', 'flex');
    this.state = true;
    notice.show(i18n.get('Show setting'));
    this.art.emit('setting:show', $setting);
  }

  hide() {
    const { refs: { $setting }, i18n, notice } = this.art;
    setStyle($setting, 'display', 'none');
    this.state = false;
    notice.show(i18n.get('Hide setting'));
    this.art.emit('setting:hide', $setting);
  }

  toggle() {
    if (this.state) {
      this.hide();
    } else {
      this.show();
    }
  }
}
