import flip from './flip';
import aspectRatio from './aspectRatio';
import playbackRate from './playbackRate';
import subtitleOffset from './subtitleOffset';
import Component from '../utils/component';
import { append, addClass, setStyle, inverseClass, includeFromEvent } from '../utils';

function makeRecursion(option, parentItem, parentList) {
    for (let index = 0; index < option.length; index++) {
        const item = option[index];
        item._parentItem = parentItem;
        item._parentList = parentList;
        if (item.selector) {
            makeRecursion(item.selector, item, option);
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
            art.once('ready', () => {
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

    creatHeader(item) {
        const {
            icons,
            events: { proxy },
        } = this.art;

        const $item = document.createElement('div');
        addClass($item, 'art-setting-item');
        addClass($item, 'art-setting-item-back');
        const $left = append($item, '<div class="art-setting-item-left"></div>');
        const $iconLeft = document.createElement('div');
        addClass($iconLeft, 'art-setting-item-left-icon');
        append($iconLeft, icons.arrowLeft);
        append($left, $iconLeft);
        append($left, item._parentItem.html);

        proxy($item, 'click', () => {
            this.init(item._parentList);
        });

        return $item;
    }

    creatItem(item) {
        const {
            icons,
            events: { proxy },
        } = this.art;

        const hasChildren = item.selector && item.selector.length;
        const $item = document.createElement('div');
        addClass($item, 'art-setting-item');

        if (item.default) {
            addClass($item, 'art-current');
        }

        if (item.value) {
            $item.dataset.value = item.value;
        }

        const $left = append($item, '<div class="art-setting-item-left"></div>');
        const $right = append($item, '<div class="art-setting-item-right"></div>');

        const $iconLeft = document.createElement('div');
        addClass($iconLeft, 'art-setting-item-left-icon');
        append($iconLeft, hasChildren ? item.icon || icons.config : icons.check);
        append($left, $iconLeft);
        append($left, item.html);

        if (hasChildren) {
            const $desc = document.createElement('div');
            addClass($desc, 'art-setting-item-right-desc');
            append($right, $desc);
            if (item.desc) {
                $desc.innerText = item.desc;
            }

            const $iconRight = document.createElement('div');
            addClass($iconRight, 'art-setting-item-right-icon');
            append($iconRight, icons.arrowRight);
            append($right, $iconRight);
        }

        proxy($item, 'click', (event) => {
            if (hasChildren) {
                this.init(item.selector, item.width);
            } else {
                inverseClass($item, 'art-current');
                if (item._parentItem && item._parentItem.onSelect) {
                    const result = item._parentItem.onSelect.call(this.art, item, $item, event);
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

            if (option[0] && option[0]._parentItem) {
                append($panel, this.creatHeader(option[0]));
            }

            for (let index = 0; index < option.length; index++) {
                const $item = this.creatItem(option[index]);
                option[index].$item = $item;
                append($panel, $item);
            }

            $panel.dataset.width = width || this.width;
            append(this.$parent, $panel);
            this.cache.set(option, $panel);
            inverseClass($panel, 'art-current');
            setStyle(this.$parent, 'width', `${$panel.dataset.width}px`);

            if (option[0] && option[0]._parentItem && option[0]._parentItem.mounted) {
                option[0]._parentItem.mounted.call(this.art, $panel, option[0]._parentItem);
            }
        }
    }
}
