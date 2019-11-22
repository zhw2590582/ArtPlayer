import Component from '../utils/components';
import component from '../utils/component';
import flip from './flip';
import aspectRatio from './aspectRatio';
import playbackRate from './playbackRate';

export default class Setting extends Component {
    constructor(art) {
        super(art);

        const {
            option,
            template: { $setting },
            events: { proxy },
        } = this.art;

        if (art.option.setting) {
            this.art.on('ready', () => {
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
            });

            this.art.on('blur', () => {
                this.show = false;
            });
        }
    }

    add(item, callback) {
        this.id += 1;
        const { $settingBody } = this.art.template;
        return component(this.art, this, $settingBody, item, callback, 'setting');
    }
}
