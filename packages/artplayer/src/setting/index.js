import Component from '../utils/component';
import { append, addClass } from '../utils/dom';

import playbackRate from './playbackRate';

export default class Setting extends Component {
    constructor(art) {
        super(art);

        this.art = art;
        this.name = 'setting';

        const {
            option,
            template: { $setting },
        } = art;

        this.$parent = $setting;

        if (option.setting) {
            art.once('ready', () => {
                this.add(playbackRate(art));
                this.add(playbackRate(art));
                this.add(playbackRate(art));
            });

            art.on('blur', () => {
                this.show = false;
            });
        }
    }

    creatItme(item) {
        const {
            icons,
            events: { proxy },
        } = this.art;

        const $item = document.createElement('div');
        addClass($item, 'art-setting-item');
        append($item, `<div class="art-setting-item-left">${item.html}</div>`);
        const $right = append($item, `<div class="art-setting-item-right"></div>`);

        if (item.items && item.items.length) {
            append($right, icons.arrowRight);
        }

        if (typeof item.click === 'function') {
            proxy($item, 'click', (event) => {
                item.click.call(this.art, event);
            });
        }

        return $item;
    }

    add(option) {
        const $item = this.creatItme(option);
        append(this.$parent, $item);
    }
}
