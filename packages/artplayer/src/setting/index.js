import { setStyle } from '../utils';
import component from '../utils/component';
import flip from './flip';

export default class Setting {
    constructor(art) {
        this.id = 0;
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
            template: { $settingClose },
            events: { proxy },
        } = this.art;

        proxy($settingClose, 'click', () => {
            this.hide();
        });

        this.add(flip({
            disable: false,
            name: 'flip',
            index: 10,
        }));
    }

    add(item, callback) {
        const { $settingBody } = this.art.template;
        component(this.art, this, $settingBody, item, callback, 'setting');
    }

    show() {
        const { $setting } = this.art.template;
        setStyle($setting, 'display', 'flex');
        this.state = true;
        this.art.emit('setting:show', $setting);
    }

    hide() {
        const { $setting } = this.art.template;
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
