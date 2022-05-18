import { errorHandle, addClass, removeClass, isMobile } from '../utils';
import Component from '../utils/component';
import fullscreen from './fullscreen';
import fullscreenWeb from './fullscreenWeb';
import pip from './pip';
import playAndPause from './playAndPause';
import progress from './progress';
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
            constructor,
            events: { proxy },
            template: { $player },
        } = art;

        let activeTime = Date.now();

        proxy($player, ['click', 'mousemove', 'touchstart', 'touchmove'], () => {
            this.show = true;
            removeClass($player, 'art-hide-cursor');
            addClass($player, 'art-hover');
            activeTime = Date.now();
        });

        art.on('video:timeupdate', () => {
            if (!art.isInput && art.playing && this.show && Date.now() - activeTime >= constructor.CONTROL_HIDE_TIME) {
                this.show = false;
                addClass($player, 'art-hide-cursor');
                removeClass($player, 'art-hover');
            }
        });

        this.init();
    }

    init() {
        const { option } = this.art;

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
                disable: !option.thumbnails.url || option.isLive || isMobile,
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
                disable: !option.screenshot || isMobile,
                position: 'right',
                index: 20,
            }),
        );

        this.add(
            setting({
                name: 'setting',
                disable: !option.setting,
                position: 'right',
                index: 30,
            }),
        );

        this.add(
            pip({
                name: 'pip',
                disable: !option.pip,
                position: 'right',
                index: 40,
            }),
        );

        this.add(
            fullscreenWeb({
                name: 'fullscreenWeb',
                disable: !option.fullscreenWeb,
                position: 'right',
                index: 50,
            }),
        );

        this.add(
            fullscreen({
                name: 'fullscreen',
                disable: !option.fullscreen,
                position: 'right',
                index: 60,
            }),
        );

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
}
