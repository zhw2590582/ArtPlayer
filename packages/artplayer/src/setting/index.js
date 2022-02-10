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

        this.events = [];
        this.parentItem = null;
        this.parentList = [];

        if (option.setting) {
            this.option = [playbackRate(art), playbackRate(art), playbackRate(art)];

            art.once('ready', () => {
                this.init(this.option);
            });

            art.on('blur', () => {
                this.show = false;
                this.init(this.option);
            });
        }
    }

    creatItme(item, option) {
        const { icons } = this.art;

        const $item = document.createElement('div');
        addClass($item, 'art-setting-item');
        append($item, `<div class="art-setting-item-left">${item.html}</div>`);
        const $right = append($item, `<div class="art-setting-item-right"></div>`);

        if (item.items && item.items.length) {
            append($right, icons.arrowRight);
        }

        const callback = (event) => {
            if (typeof item.click === 'function') {
                item.click.call(this, event);
            }
            if (item.items && item.items.length) {
                this.parentItem = item;
                this.parentList = option;
                this.init(item.items);
            }
        };

        $item.addEventListener('click', callback);
        this.events.push(() => $item.removeEventListener('click', callback));

        return $item;
    }

    init(option) {
        for (let index = 0; index < this.events.length; index++) {
            this.events[index]();
        }

        this.events = [];
        this.$parent.innerHTML = '';

        if (this.parentList === this.option) {
            this.parentItem = null;
            this.parentList = [];
        }

        if (this.parentItem) {
            //
        }

        for (let index = 0; index < option.length; index++) {
            const item = option[index];
            const $item = this.creatItme(item, option);
            append(this.$parent, $item);
        }
    }
}
