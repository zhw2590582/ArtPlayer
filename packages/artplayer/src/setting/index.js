import Component from '../utils/component';
import playbackRate from './playbackRate';

export default class Setting extends Component {
    constructor(art) {
        super(art);

        this.name = 'setting';

        const {
            option,
            template: { $setting },
        } = art;

        this.$parent = $setting;

        if (option.setting) {
            art.once('ready', () => {
                this.add(playbackRate(art));
            });

            art.on('blur', () => {
                this.show = false;
            });
        }
    }

    add(option) {
        console.log(option);
    }
}
