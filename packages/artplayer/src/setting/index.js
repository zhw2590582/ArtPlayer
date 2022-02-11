import flip from './flip';
import aspectRatio from './aspectRatio';
import playbackRate from './playbackRate';
import subtitleOffset from './subtitleOffset';
import Component from '../utils/component';
import { append, addClass, setStyle, inverseClass, includeFromEvent } from '../utils';

function makeRecursion(option) {
    for (let index = 0; index < option.length; index++) {
        const item = option[index];
        if (!item.back && item.children) {
            item.children.unshift({
                html: item.html,
                children: option,
                back: true,
            });
            makeRecursion(item.children);
        }
    }
    return option;
}

export default class Setting extends Component {
    constructor(art) {
        super(art);

        const {
            option,
            events: { proxy },
            template: { $setting, $player },
        } = art;

        this.art = art;
        this.name = 'setting';
        this.$parent = $setting;

        this.width = 200;
        this.option = [];
        this.cache = new Map();

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

            for (let index = 0; index < option.settings.length; index++) {
                this.option.push(option.settings[index]);
            }

            this.option = makeRecursion(this.option);

            art.once('ready', () => {
                this.init(this.option);
            });

            art.on('blur', () => {
                this.show = false;
                this.init(this.option);
            });

            proxy($player, 'click', (event) => {
                if (
                    this.show &&
                    !includeFromEvent(event, art.controls.setting) &&
                    !includeFromEvent(event, this.$parent)
                ) {
                    this.show = false;
                    this.init(this.option);
                }
            });
        }
    }

    creatItem(item) {
        const {
            icons,
            events: { proxy },
        } = this.art;

        const $item = document.createElement('div');
        const hasChildren = item.children && item.children.length;

        const $left = append($item, `<div class="art-setting-item-left"></div>`);
        const $right = append($item, `<div class="art-setting-item-right"></div>`);

        addClass($item, 'art-setting-item');
        if (item.current) {
            addClass($item, 'art-current');
        }

        if (item.back) {
            addClass($item, 'art-setting-item-back');
            append($left, icons.arrowLeft);
            append($left, item.html);
        } else {
            if (hasChildren) {
                const $icon = append($left, item.icon || icons.config);
                addClass($icon, 'art-setting-item-left-icon');
                append($right, icons.arrowRight);
            } else {
                append($left, icons.check);
            }
            append($left, item.html);
        }

        proxy($item, 'click', (event) => {
            if (typeof item.click === 'function') {
                item.click.call(this.art, this, event);
            }

            if (hasChildren) {
                this.init(item.children);
                setStyle(this.$parent, 'width', `${item.width || this.width}px`);
            } else {
                inverseClass($item, 'art-current');
            }
        });

        return $item;
    }

    add(callback) {
        this.option.push(callback(this.art));
        this.option = makeRecursion(this.option);
        this.init(this.option);
    }

    init(option) {
        if (this.cache.has(option)) {
            const $panel = this.cache.get(option);
            inverseClass($panel, 'art-current');
        } else {
            const $panel = document.createElement('div');
            addClass($panel, 'art-setting-panel');
            for (let index = 0; index < option.length; index++) {
                append($panel, this.creatItem(option[index]));
            }
            append(this.$parent, $panel);
            this.cache.set(option, $panel);
            inverseClass($panel, 'art-current');
        }
        setStyle(this.$parent, 'width', `${this.width}px`);
    }
}
