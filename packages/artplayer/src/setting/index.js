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

            this.art.on('blur', () => {
                this.hide();
            });
        }
    }

    init() {
        const {
            template: { $setting },
            events: { proxy },
        } = this.art;

        proxy($setting, 'click', e => {
            if (e.target === $setting) {
                this.hide();
            }
        });

        this.add(
            flip({
                disable: false,
                name: 'flip',
                index: 10,
            }),
        );
    }

    add(item, callback) {
        this.id += 1;
        const { $settingBody } = this.art.template;
        return component(this.art, this, $settingBody, item, callback, 'setting');
    }

    show() {
        const { $player } = this.art.template;
        this.state = true;
        $player.classList.add('artplayer-setting-show');
        this.art.emit('setting:show');
    }

    hide() {
        const { $player } = this.art.template;
        this.state = false;
        $player.classList.remove('artplayer-setting-show');
        this.art.emit('setting:hide');
    }

    toggle() {
        if (this.state) {
            this.hide();
        } else {
            this.show();
        }
    }
}
