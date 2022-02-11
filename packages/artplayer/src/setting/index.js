import flip from './flip';
import aspectRatio from './aspectRatio';
import playbackRate from './playbackRate';
import subtitleOffset from './subtitleOffset';
import Component from '../utils/component';
import { append, addClass, setStyle, inverseClass, includeFromEvent } from '../utils';

function makeRecursion(option) {
    for (let index = 0; index < option.length; index++) {
        const item = option[index];
        if (!item.back && item.selector) {
            item.selector.unshift({
                html: item.html,
                selector: option,
                back: true,
            });
            makeRecursion(item.selector);
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
        const hasChildren = item.selector && item.selector.length;

        const $left = append($item, `<div class="art-setting-item-left"></div>`);
        const $right = append($item, `<div class="art-setting-item-right"></div>`);

        addClass($item, 'art-setting-item');
        if (item.default) {
            addClass($item, 'art-current');
        }

        const $icon = document.createElement('div');
        addClass($icon, 'art-setting-item-left-icon');

        if (item.back) {
            addClass($item, 'art-setting-item-back');
            append($icon, icons.arrowLeft);
        } else {
            if (hasChildren) {
                append($icon, item.icon || icons.config);
                append($right, icons.arrowRight);
            } else {
                append($icon, icons.check);
            }
        }

        append($left, $icon);
        append($left, item.html);

        proxy($item, 'click', (event) => {
            if (hasChildren) {
                this.init(item.selector, item.width);
            } else {
                inverseClass($item, 'art-current');
                if (item.onSelect) {
                    const result = item.onSelect.call(this.art, item, $item, event);
                    if (typeof result === 'string') {
                        $item.innerHTML = result;
                    }
                }
            }
        });

        return $item;
    }

    add(callback) {
        this.option.push(callback(this.art));
        this.option = makeRecursion(this.option);
        this.init(this.option);
    }

    init(option, width) {
        if (this.cache.has(option)) {
            const $panel = this.cache.get(option);
            inverseClass($panel, 'art-current');
            setStyle(this.$parent, 'width', `${$panel.dataset.width}px`);
        } else {
            const $panel = document.createElement('div');
            addClass($panel, 'art-setting-panel');
            for (let index = 0; index < option.length; index++) {
                append($panel, this.creatItem(option[index]));
            }
            $panel.dataset.width = width || this.width;
            append(this.$parent, $panel);
            this.cache.set(option, $panel);
            inverseClass($panel, 'art-current');
            setStyle(this.$parent, 'width', `${$panel.dataset.width}px`);
        }
    }
}
