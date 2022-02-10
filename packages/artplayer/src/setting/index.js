import Component from '../utils/component';
import { append, addClass, setStyle } from '../utils/dom';
import playbackRate from './playbackRate';

export default class Setting extends Component {
    constructor(art) {
        super(art);

        const {
            option,
            template: { $setting },
        } = art;

        this.art = art;
        this.name = 'setting';
        this.$parent = $setting;
        this.events = [];

        if (option.setting) {
            this.option = this.makeRecursion([playbackRate(art), playbackRate(art), playbackRate(art)]);

            art.once('ready', () => {
                this.init(this.option);
            });

            art.on('blur', () => {
                this.show = false;
                this.init(this.option);
            });
        }
    }

    creatItem(item) {
        const $item = document.createElement('div');
        addClass($item, 'art-setting-item');
        append($item, `<div class="art-setting-item-left">${item.html}</div>`);
        const $right = append($item, `<div class="art-setting-item-right"></div>`);
        const hasItems = item.items && item.items.length;

        if (hasItems) {
            append($right, this.art.icons.arrowRight);
        }

        const callback = (event) => {
            if (typeof item.click === 'function') {
                item.click.call(this, event);
            }

            if (hasItems) {
                this.init(item.items);
                if (item.width) {
                    setStyle(this.$parent, 'width', `${item.width}px`);
                }
            }
        };

        $item.addEventListener('click', callback);
        this.events.push(() => $item.removeEventListener('click', callback));

        return $item;
    }

    makeRecursion(option) {
        return option;
    }

    add(item) {
        this.option.push(item);
        this.option = this.makeRecursion(this.option);
        this.init(this.option);
    }

    init(option) {
        for (let index = 0; index < this.events.length; index++) {
            this.events[index]();
        }

        this.events = [];
        this.$parent.innerHTML = '';
        setStyle(this.$parent, 'width', '200px');

        for (let index = 0; index < option.length; index++) {
            const item = option[index];
            const $item = this.creatItem(item);
            append(this.$parent, $item);
        }
    }
}
