import Component from '../utils/component';
import flip from './flip';
import aspectRatio from './aspectRatio';
import playbackRate from './playbackRate';

export default class Setting extends Component {
    constructor(art) {
        super(art);

        this.name = 'setting';

        const {
            option,
            template: { $setting, $settingBody },
            events: { proxy },
        } = art;

        this.$parent = $settingBody;

        if (option.setting) {
            art.once('ready', () => {
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

            art.on('blur', () => {
                this.show = false;
            });
        }
    }
}
