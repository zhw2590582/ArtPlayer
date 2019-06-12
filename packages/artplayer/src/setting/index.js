import component from '../utils/component';
import flip from './flip';
import aspectRatio from './aspectRatio';
import playbackRate from './playbackRate';

export default class Setting {
    constructor(art) {
        this.id = 0;
        this.art = art;
        this.state = false;
        if (art.option.setting) {
            this.art.once('video:canplay', () => {
                this.init();
            });

            this.art.on('blur', () => {
                this.show = false;
            });
        }
    }

    init() {
        const {
            option,
            template: { $setting },
            events: { proxy },
        } = this.art;

        proxy($setting, 'click', e => {
            if (e.target === $setting) {
                this.show = false;
            }
        });

        this.add(
            flip({
                disable: !option.flip,
                name: 'flip',
            }),
        );

        this.add(
            aspectRatio({
                disable: !option.aspectRatio,
                name: 'aspectRatio',
            }),
        );

        this.add(
            playbackRate({
                disable: !option.playbackRate,
                name: 'playbackRate',
            }),
        );
    }

    add(item, callback) {
        this.id += 1;
        const { $settingBody } = this.art.template;
        return component(this.art, this, $settingBody, item, callback, 'setting');
    }

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            this.state = true;
            $player.classList.add('artplayer-setting-show');
            this.art.emit('setting:show');
        } else {
            this.state = false;
            $player.classList.remove('artplayer-setting-show');
            this.art.emit('setting:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
