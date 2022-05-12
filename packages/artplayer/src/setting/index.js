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

    creatSelector(item) {
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

        const $left = append($item, '<div class="art-setting-item-left"></div>');
        const $right = append($item, '<div class="art-setting-item-right"></div>');

        const $icon = document.createElement('div');
        addClass($icon, 'art-setting-item-left-icon');
        append($icon, hasChildren ? item.icon || icons.config : icons.check);
        append($left, $icon);
        item._$icon = $icon;

        def(item, 'icon', {
            get() {
                return $icon.innerHTML;
            },
            set(value) {
                if (typeof value === 'string' || typeof value === 'number') {
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
                if (typeof value === 'string' || typeof value === 'number') {
                    $html.innerHTML = value;
                }
            },
        });

        if (hasChildren) {
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
                    if (typeof value === 'string' || typeof value === 'number') {
                        $tooltip.innerHTML = value;
                    }
                },
            });

            const $arrow = document.createElement('div');
            addClass($arrow, 'art-setting-item-right-icon');
            append($arrow, icons.arrowRight);
            append($right, $arrow);
        }

        const event = proxy($item, 'click', async (event) => {
            if (hasChildren) {
                this.init(item.selector, item.width);
            } else {
                inverseClass($item, 'art-current');

                if (item._parentList) {
                    this.init(item._parentList);
                }

                if (item._parentItem && item._parentItem.onSelect) {
                    const result = await item._parentItem.onSelect.call(this.art, item, $item, event);
                    if (item._parentItem._$tooltip) {
                        if (typeof result === 'string' || typeof result === 'number') {
                            item._parentItem._$tooltip.innerHTML = result;
                        }
                    }
                }
            }
        });

        this.events.push(event);

        return $item;
    }

    creatSwitch(item) {
        const {
            icons,
            events: { proxy },
        } = this.art;

        const $item = document.createElement('div');
        addClass($item, 'art-setting-item');

        const $left = append($item, '<div class="art-setting-item-left"></div>');
        const $right = append($item, '<div class="art-setting-item-right"></div>');

        const $icon = document.createElement('div');
        addClass($icon, 'art-setting-item-left-icon');
        append($icon, item.icon || icons.config);
        append($left, $icon);

        const $html = document.createElement('div');
        addClass($html, 'art-setting-item-left-text');
        append($html, item.html || '');
        append($left, $html);

        const $switch = document.createElement('div');
        addClass($switch, 'art-setting-item-right-switch');
        append($switch, item.switch ? icons.switchOn : icons.switchOff);
        append($right, $switch);

        const event = proxy($item, 'click', async (event) => {
            if (item.onSwitch) {
                const result = await item.onSwitch.call(this.art, item, $item, event);
                item.switch = result;
                $switch.innerHTML = '';
                append($switch, result ? icons.switchOn : icons.switchOff);
            }
        });

        this.events.push(event);

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
                    append($panel, this.creatSwitch(item));
                } else {
                    append($panel, this.creatSelector(item));
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
