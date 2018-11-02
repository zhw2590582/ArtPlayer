import { setStyle, append } from '../utils';
import Common from './common';

let id = 0;
export default class Setting {
  constructor(art) {
    this.art = art;
    this.isOpen = false;
    this.$settings = [];
    if (art.option.setting) {
      this.init();
      this.mount();
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
      option.$setting = $setting;
      this.$settings.push($setting);
      setting.apply && setting.apply(this.art);
      this[name] = setting;
    }
  }

  mount() {
    this.$settings
      .sort(
        (a, b) =>
          Number(a.dataset.settingIndex) - Number(b.dataset.settingIndex)
      )
      .forEach($setting => {
        append(this.art.refs.$settingBody, $setting);
      });
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
