import { setStyle, append, insertByIndex } from '../utils';
import flip from './flip';

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
        const {
            refs: { $settingClose },
            events: { proxy },
        } = this.art;

        proxy($settingClose, 'click', () => {
            this.hide();
        });

        this.add(flip({
            disable: false,
            title: 'Flip',
            name: 'flip',
            index: 10,
        }));
    }

    add(item, callback) {
        const setting = typeof item === 'function' ? item(this.art) : item;
        if (!setting.disable) {
            const {
                i18n,
                refs: { $settingBody },
                events: { proxy },
            } = this.art;
            id += 1;
            const name = setting.name || `setting${id}`;
            const title = setting.title || name;
            const $setting = document.createElement('div');
            $setting.classList.value = `art-setting art-setting-${name}`;
            append($setting, `<div class="art-setting-header">${i18n.get(title)}</div>`);
            const $settingInner = append($setting, '<div class="art-setting-body"></div>');
            if (setting.html) {
                append($settingInner , setting.html);
            }
            if ($settingInner.click) {
                proxy($settingInner, 'click', event => {
                    event.preventDefault();
                    setting.click.call(this, event);
                    this.art.emit('setting:click', $setting);
                });
            }
            insertByIndex($settingBody, $setting, setting.index || id);
            if (setting.mounted) {
                setting.mounted($settingInner);
            }
            if (callback) {
                callback($settingInner);
            }
            this[name] = $setting;
            this.art.emit('setting:add', $setting);
        }
    }

    show() {
        const {
            refs: { $setting },
        } = this.art;
        setStyle($setting, 'display', 'flex');
        this.state = true;
        this.art.emit('setting:show', $setting);
    }

    hide() {
        const {
            refs: { $setting },
        } = this.art;
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
