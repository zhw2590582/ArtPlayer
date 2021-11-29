import Component from '../utils/component';
import flip from './flip';
import rotate from './rotate';
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
                proxy($setting, 'click', (event) => {
                    if (event.target === $setting) {
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
                    rotate({
                        disable: !option.rotate,
                        name: 'rotate',
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

                option.settings.forEach((item) => {
                    this.add(item);
                });
            });

            art.on('blur', () => {
                this.show = false;
            });
        }
    }
}
