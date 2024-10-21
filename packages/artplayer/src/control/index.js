import Component from '../utils/component';
import fullscreen from './fullscreen';
import fullscreenWeb from './fullscreenWeb';
import pip from './pip';
import playAndPause from './playAndPause';
import progress from './progress';
import time from './time';
import volume from './volume';
import setting from './setting';
import screenshot from './screenshot';
import airplay from './airplay';
import {
    def,
    sleep,
    append,
    addClass,
    isMobile,
    removeClass,
    errorHandle,
    inverseClass,
    createElement,
    includeFromEvent,
} from '../utils';

export default class Control extends Component {
    constructor(art) {
        super(art);

        this.isHover = false;
        this.name = 'control';
        this.timer = Date.now();

        const { constructor } = art;
        const { $player, $bottom } = this.art.template;

        art.on('mousemove', () => {
            if (!isMobile) {
                this.show = true;
            }
        });

        art.on('click', () => {
            if (isMobile) {
                this.toggle();
            } else {
                this.show = true;
            }
        });

        art.on('document:mousemove', (event) => {
            this.isHover = includeFromEvent(event, $bottom);
        });

        art.on('video:timeupdate', () => {
            if (
                !art.setting.show &&
                !this.isHover &&
                !art.isInput &&
                art.playing &&
                this.show &&
                Date.now() - this.timer >= constructor.CONTROL_HIDE_TIME
            ) {
                this.show = false;
            }
        });

        art.on('control', (state) => {
            if (state) {
                removeClass($player, 'art-hide-cursor');
                addClass($player, 'art-hover');
                this.timer = Date.now();
            } else {
                addClass($player, 'art-hide-cursor');
                removeClass($player, 'art-hover');
            }
        });

        this.init();
    }

    init() {
        const { option } = this.art;

        if (!option.isLive) {
            this.add(
                progress({
                    name: 'progress',
                    position: 'top',
                    index: 10,
                }),
            );
        }

        this.add({
            name: 'thumbnails',
            position: 'top',
            index: 20,
        });

        this.add(
            playAndPause({
                name: 'playAndPause',
                position: 'left',
                index: 10,
            }),
        );

        this.add(
            volume({
                name: 'volume',
                position: 'left',
                index: 20,
            }),
        );

        if (!option.isLive) {
            this.add(
                time({
                    name: 'time',
                    position: 'left',
                    index: 30,
                }),
            );
        }

        if (option.quality.length) {
            sleep().then(() => {
                this.art.quality = option.quality;
            });
        }

        if (option.screenshot && !isMobile) {
            this.add(
                screenshot({
                    name: 'screenshot',
                    position: 'right',
                    index: 20,
                }),
            );
        }

        if (option.setting) {
            this.add(
                setting({
                    name: 'setting',
                    position: 'right',
                    index: 30,
                }),
            );
        }

        if (option.pip) {
            this.add(
                pip({
                    name: 'pip',
                    position: 'right',
                    index: 40,
                }),
            );
        }

        if (option.airplay && window.WebKitPlaybackTargetAvailabilityEvent) {
            this.add(
                airplay({
                    name: 'airplay',
                    position: 'right',
                    index: 50,
                }),
            );
        }

        if (option.fullscreenWeb) {
            this.add(
                fullscreenWeb({
                    name: 'fullscreenWeb',
                    position: 'right',
                    index: 60,
                }),
            );
        }

        if (option.fullscreen) {
            this.add(
                fullscreen({
                    name: 'fullscreen',
                    position: 'right',
                    index: 70,
                }),
            );
        }

        for (let index = 0; index < option.controls.length; index++) {
            this.add(option.controls[index]);
        }
    }

    add(getOption) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        const { $progress, $controlsLeft, $controlsRight } = this.art.template;

        switch (option.position) {
            case 'top':
                this.$parent = $progress;
                break;
            case 'left':
                this.$parent = $controlsLeft;
                break;
            case 'right':
                this.$parent = $controlsRight;
                break;
            default:
                errorHandle(false, `Control option.position must one of 'top', 'left', 'right'`);
                break;
        }

        super.add(option);
    }

    check(target) {
        target.$control_value.innerHTML = target.html;
        for (let index = 0; index < target.$control_option.length; index++) {
            const item = target.$control_option[index];
            item.default = item === target;
            if (item.default) {
                inverseClass(item.$control_item, 'art-current');
            }
        }
    }

    selector(option, $ref, events) {
        const { proxy } = this.art.events;

        addClass($ref, 'art-control-selector');
        const $value = createElement('div');
        addClass($value, 'art-selector-value');
        append($value, option.html);
        $ref.innerText = '';
        append($ref, $value);

        const $list = createElement('div');
        addClass($list, 'art-selector-list');
        append($ref, $list);

        for (let index = 0; index < option.selector.length; index++) {
            const item = option.selector[index];
            const $item = createElement('div');
            addClass($item, 'art-selector-item');
            if (item.default) addClass($item, 'art-current');
            $item.dataset.index = index;
            $item.dataset.value = item.value;
            $item.innerHTML = item.html;
            append($list, $item);

            def(item, '$control_option', {
                get: () => option.selector,
            });

            def(item, '$control_item', {
                get: () => $item,
            });

            def(item, '$control_value', {
                get: () => $value,
            });
        }

        const event = proxy($list, 'click', async (event) => {
            const path = event.composedPath() || [];
            const item = option.selector.find(
                (item) => item.$control_item === path.find(($item) => item.$control_item === $item),
            );
            this.check(item);
            if (option.onSelect) {
                $value.innerHTML = await option.onSelect.call(this.art, item, item.$control_item, event);
            }
        });

        events.push(event);
    }
}
