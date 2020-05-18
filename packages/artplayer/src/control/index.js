import { errorHandle, addClass, debounce, removeClass } from '../utils';
import Component from '../utils/component';
import fullscreen from './fullscreen';
import fullscreenWeb from './fullscreenWeb';
import pip from './pip';
import playAndPause from './playAndPause';
import progress from './progress';
import subtitle from './subtitle';
import time from './time';
import volume from './volume';
import setting from './setting';
import thumbnails from './thumbnails';
import screenshot from './screenshot';
import quality from './quality';
import loop from './loop';

export default class Control extends Component {
    constructor(art) {
        super(art);

        this.name = 'control';

        const {
            option,
            player,
            template: { $player },
        } = art;

        this.delayHide = debounce(() => {
            if (player.playing && this.show) {
                addClass($player, 'art-hide-cursor');
                removeClass($player, 'art-hover');
                this.show = false;
            }
        }, 3000);

        this.cancelDelayHide = this.delayHide.clearTimeout;

        art.once('ready', () => {
            this.add(
                progress({
                    name: 'progress',
                    disable: option.isLive,
                    position: 'top',
                    index: 10,
                }),
            );

            this.add(
                thumbnails({
                    name: 'thumbnails',
                    disable: !option.thumbnails.url || option.isLive,
                    position: 'top',
                    index: 20,
                }),
            );

            this.add(
                loop({
                    name: 'loop',
                    disable: false,
                    position: 'top',
                    index: 30,
                }),
            );

            this.add(
                playAndPause({
                    name: 'playAndPause',
                    disable: false,
                    position: 'left',
                    index: 10,
                }),
            );

            this.add(
                volume({
                    name: 'volume',
                    disable: false,
                    position: 'left',
                    index: 20,
                }),
            );

            this.add(
                time({
                    name: 'time',
                    disable: option.isLive,
                    position: 'left',
                    index: 30,
                }),
            );

            this.add(
                quality({
                    name: 'quality',
                    disable: option.quality.length === 0,
                    position: 'right',
                    index: 10,
                }),
            );

            this.add(
                screenshot({
                    name: 'screenshot',
                    disable: !option.screenshot,
                    position: 'right',
                    index: 20,
                }),
            );

            this.add(
                subtitle({
                    name: 'subtitle',
                    disable: !option.subtitle.url,
                    position: 'right',
                    index: 30,
                }),
            );

            this.add(
                setting({
                    name: 'setting',
                    disable: !option.setting,
                    position: 'right',
                    index: 40,
                }),
            );

            this.add(
                pip({
                    name: 'pip',
                    disable: !option.pip,
                    position: 'right',
                    index: 50,
                }),
            );

            this.add(
                fullscreenWeb({
                    name: 'fullscreenWeb',
                    disable: !option.fullscreenWeb,
                    position: 'right',
                    index: 60,
                }),
            );

            this.add(
                fullscreen({
                    name: 'fullscreen',
                    disable: !option.fullscreen,
                    position: 'right',
                    index: 70,
                }),
            );

            option.controls.forEach((item) => {
                this.add(item);
            });
        });
    }

    add(getOption, callback) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        errorHandle(
            ['top', 'left', 'right'].includes(option.position),
            `Control option.position must one of 'top', 'left', 'right'`,
        );
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
                break;
        }

        super.add(option, ($ref) => {
            if (
                !option.disable &&
                option.position !== 'top' &&
                !($ref.firstElementChild && $ref.firstElementChild.tagName === 'I')
            ) {
                addClass($ref, 'art-control-onlyText');
            }

            if (callback) {
                callback($ref, this, this.art);
            }
        });
    }
}
