import flip from './flip';
import aspectRatio from './aspectRatio';
import playbackRate from './playbackRate';
import subtitleOffset from './subtitleOffset';
import Component from '../utils/component';
import { append, addClass, setStyle, inverseClass, includeFromEvent, def, has } from '../utils';

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

function isHtmlType(val) {
    return ['string', 'number'].includes(typeof val);
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

        this.option = [];
        this.events = [];
        this.cache = new Map();

        if (option.setting) {
            art.once('video:loadedmetadata', () => {
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
                if (this.show) {
                    this.show = false;
                    this.init(this.option);
                }
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

    add(callback) {
        if (typeof callback === 'function') {
            this.option.push(callback(this.art));
        } else {
            this.option.push(callback);
        }

        this.cache = new Map();
        this.events.forEach((event) => event());
        this.events = [];
        this.$parent.innerHTML = '';
        this.option = makeRecursion(this.option);
        this.init(this.option);
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
        const $icon = document.createElement('div');
        addClass($icon, 'art-setting-item-left-icon');
        append($icon, icons.arrowLeft);
        append($left, $icon);
        append($left, item._parentItem.html);

        const event = proxy($item, 'click', () => {
            this.init(item._parentList);
        });

        this.events.push(event);

        return $item;
    }

    creatItem(type, item) {
        const {
            icons,
            events: { proxy },
        } = this.art;

        const $item = document.createElement('div');
        addClass($item, 'art-setting-item');

        if (item.name) {
            addClass($item, `art-setting-item-${item.name}`);
        }

        const $left = append($item, '<div class="art-setting-item-left"></div>');
        const $right = append($item, '<div class="art-setting-item-right"></div>');

        const $icon = document.createElement('div');
        addClass($icon, 'art-setting-item-left-icon');

        switch (type) {
            case 'switch':
                append($icon, item.icon || icons.config);
                break;
            case 'selector':
                append($icon, item.selector && item.selector.length ? item.icon || icons.config : icons.check);
                break;
            default:
                break;
        }

        append($left, $icon);
        item._$icon = $icon;

        def(item, 'icon', {
            get() {
                return $icon.innerHTML;
            },
            set(value) {
                if (isHtmlType(value)) {
                    $icon.innerHTML = value;
                }
            },
        });

        const $html = document.createElement('div');
        addClass($html, 'art-setting-item-left-text');
        append($html, item.html || '');
        append($left, $html);
        item._$html = $html;

        def(item, 'html', {
            get() {
                return $html.innerHTML;
            },
            set(value) {
                if (isHtmlType(value)) {
                    $html.innerHTML = value;
                }
            },
        });

        const $tooltip = document.createElement('div');
        addClass($tooltip, 'art-setting-item-right-tooltip');
        append($tooltip, item.tooltip || '');
        append($right, $tooltip);
        item._$tooltip = $tooltip;

        def(item, 'tooltip', {
            get() {
                return $tooltip.innerHTML;
            },
            set(value) {
                if (isHtmlType(value)) {
                    $tooltip.innerHTML = value;
                }
            },
        });

        switch (type) {
            case 'switch': {
                const $state = document.createElement('div');
                addClass($state, 'art-setting-item-right-icon');
                const $switchOn = append($state, icons.switchOn);
                const $switchOff = append($state, icons.switchOff);
                setStyle(item.switch ? $switchOff : $switchOn, 'display', 'none');
                append($right, $state);
                item._$switch = item.switch;

                def(item, 'switch', {
                    get() {
                        return item._$switch;
                    },
                    set(value) {
                        item._$switch = value;
                        if (value) {
                            setStyle($switchOff, 'display', 'none');
                            setStyle($switchOn, 'display', null);
                        } else {
                            setStyle($switchOff, 'display', null);
                            setStyle($switchOn, 'display', 'none');
                        }
                    },
                });
                break;
            }
            case 'selector':
                if (item.selector && item.selector.length) {
                    const $state = document.createElement('div');
                    addClass($state, 'art-setting-item-right-icon');
                    append($state, icons.arrowRight);
                    append($right, $state);
                }
                break;
            default:
                break;
        }

        const event = proxy($item, 'click', async (event) => {
            switch (type) {
                case 'switch':
                    if (item.onSwitch) {
                        item.switch = await item.onSwitch.call(this.art, item, $item, event);
                    }
                    break;
                case 'selector':
                    if (item.selector && item.selector.length) {
                        this.init(item.selector, item.width);
                    } else {
                        inverseClass($item, 'art-current');

                        if (item._parentList) {
                            this.init(item._parentList);
                        }

                        if (item._parentItem && item._parentItem.onSelect) {
                            const result = await item._parentItem.onSelect.call(this.art, item, $item, event);
                            if (item._parentItem._$tooltip && isHtmlType(result)) {
                                item._parentItem._$tooltip.innerHTML = result;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        });

        this.events.push(event);

        switch (type) {
            case 'switch':
                if (item.mounted) {
                    item.mounted.call(this.art, item, $item);
                }
                break;
            case 'selector':
                if (item.default) {
                    addClass($item, 'art-current');
                }
                break;
            default:
                break;
        }

        return $item;
    }

    init(option, width) {
        const { constructor } = this.art;

        if (this.cache.has(option)) {
            const $panel = this.cache.get(option);
            inverseClass($panel, 'art-current');
            setStyle(this.$parent, 'width', `${$panel.dataset.width}px`);
            setStyle(this.$parent, 'height', `${$panel.dataset.height}px`);
        } else {
            const $panel = document.createElement('div');
            addClass($panel, 'art-setting-panel');
            $panel.dataset.width = width || constructor.SETTING_WIDTH;
            $panel.dataset.height = option.length * constructor.SETTING_ITEM_HEIGHT;

            if (option[0] && option[0]._parentItem) {
                append($panel, this.creatHeader(option[0]));
                $panel.dataset.height = Number($panel.dataset.height) + constructor.SETTING_ITEM_HEIGHT;
            }

            for (let index = 0; index < option.length; index++) {
                const item = option[index];
                if (has(item, 'switch')) {
                    append($panel, this.creatItem('switch', item));
                } else {
                    append($panel, this.creatItem('selector', item));
                }
            }

            append(this.$parent, $panel);
            this.cache.set(option, $panel);
            inverseClass($panel, 'art-current');
            setStyle(this.$parent, 'width', `${$panel.dataset.width}px`);
            setStyle(this.$parent, 'height', `${$panel.dataset.height}px`);

            if (option[0] && option[0]._parentItem && option[0]._parentItem.mounted) {
                option[0]._parentItem.mounted.call(this.art, $panel, option[0]._parentItem);
            }
        }
    }
}
