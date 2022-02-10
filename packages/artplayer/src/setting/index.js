import Component from '../utils/component';
import { append, addClass, setStyle, inverseClass } from '../utils/dom';
import playbackRate from './playbackRate';
import aspectRatio from './aspectRatio';
import flip from './flip';
import subtitleOffset from './subtitleOffset';

function makeRecursion(option) {
    if (!option) return option;
    for (let index = 0; index < option.length; index++) {
        const item = option[index];
        if (!item.goBack) {
            if (item.items) {
                item.items.unshift({
                    html: item.html,
                    items: option,
                    goBack: true,
                });
            }
            makeRecursion(item.items);
        }
    }
    return option;
}

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
        this.option = [];

        if (option.setting) {
            if (option.playbackRate) {
                this.option.push(playbackRate(art));
            }

            if (option.aspectRatio) {
                this.option.push(aspectRatio(art));
            }

            if (option.flip) {
                this.option.push(flip(art));
            }

            if (option.subtitleOffset) {
                this.option.push(subtitleOffset(art));
            }

            this.option = makeRecursion(this.option);

            art.once('ready', () => {
                this.init(this.option);
            });

            art.on('blur', () => {
                this.show = false;
                this.init(this.option);
            });
        }
    }

    creatItem(item, option) {
        const $item = document.createElement('div');
        const $left = append($item, `<div class="art-setting-item-left"></div>`);
        const $right = append($item, `<div class="art-setting-item-right"></div>`);

        const { icons } = this.art;
        addClass($item, 'art-setting-item');
        const hasItems = item.items && item.items.length;

        if (item.current && !hasItems) {
            addClass($item, 'art-current');
        }

        if (item.goBack) {
            append($left, icons.arrowLeft);
            addClass($item, 'art-setting-item-back');
        } else {
            if (hasItems) {
                append($left, '<i class="art-icon"></i>');
            } else {
                append($left, icons.check);
            }
        }

        append($left, item.html);

        if (hasItems && !item.goBack) {
            append($right, icons.arrowRight);
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
            } else {
                for (let index = 0; index < option.length; index++) {
                    option[index].current = false;
                }
                item.current = true;
                inverseClass($item, 'art-current');
            }
        };

        $item.addEventListener('click', callback);
        this.events.push(() => $item.removeEventListener('click', callback));

        return $item;
    }

    add(callback) {
        console.log(callback);
        this.option.push(callback(this.art));
        this.option = makeRecursion(this.option);
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
            const $item = this.creatItem(item, option);
            append(this.$parent, $item);
        }
    }
}
