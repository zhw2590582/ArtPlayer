import { setStyle, append, insertByIndex } from '../utils';
import Flip from './flip';

let id = 0;
export default class Setting {
  constructor(art) {
    id = 0;
    this.art = art;
    this.state = false;
    if (art.option.setting) {
      this.art.on('firstCanplay', () => {
        this.init();
      });
    }
  }

  init() {
    const { refs: { $settingClose }, events: { proxy } } = this.art;

    proxy($settingClose, 'click', () => {
      this.hide();
    });

    this.add(new Flip({
      name: 'flip',
      title: 'Flip',
      disable: false,
      index: 10
    }));
  }

  add(setting, callback) {
    const { option } = setting;
    if (option && !option.disable) {
      id++;
      const { refs, i18n } = this.art;
      const name = option.name || `setting${id}`;
      const title = option.title || name;
      const $setting = document.createElement('div');
      $setting.setAttribute('class', `art-setting art-setting-${name}`);
      append($setting, `<div class="art-setting-header">${i18n.get(title)}</div>`);
      append($setting, '<div class="art-setting-body"></div>');
      setting.apply && setting.apply(this.art, $setting);
      insertByIndex(refs.$settingBody, $setting, option.index || id);
      this[name] = $setting;
      callback && callback($setting);
      this.art.emit('setting:add', $setting);
    }
  }

  show() {
    const { refs: { $setting } } = this.art;
    setStyle($setting, 'display', 'flex');
    this.state = true;
    this.art.emit('setting:show', $setting);
  }

  hide() {
    const { refs: { $setting } } = this.art;
    setStyle($setting, 'display', 'none');
    this.state = false;
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
