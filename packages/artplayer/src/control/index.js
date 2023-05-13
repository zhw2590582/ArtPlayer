import { errorHandle, addClass, removeClass, isMobile, sleep } from '../utils';
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
import loop from './loop';
import airplay from './airplay';

export default class Control extends Component {
    constructor(art) {
        super(art);

        this.name = 'control';

        const {
            proxy,
            constructor,
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

        if (!option.isLive) {
            this.add(
                progress({
                    name: 'progress',
                    position: 'top',
                    index: 10,
                }),
            );
        }

        if (option.thumbnails.url && !option.isLive && !isMobile) {
            this.add(
                thumbnails({
                    name: 'thumbnails',
                    position: 'top',
                    index: 20,
                }),
            );
        }

        this.add(
            loop({
                name: 'loop',
                position: 'top',
                index: 30,
            }),
        );

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
}
