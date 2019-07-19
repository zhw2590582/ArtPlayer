import { errorHandle } from '../utils';
import component from '../utils/component';
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

export default class Controls {
    constructor(art) {
        this.id = 0;
        this.art = art;
        this.art.once('video:canplay', () => {
            this.init();
        });
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
                disable: !option.thumbnails.url || option.isLive,
                position: 'top',
                index: 20,
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

        option.controls.forEach(item => {
            this.add(item);
        });
    }

    add(item, callback) {
        const option = typeof item === 'function' ? item(this.art) : item;
        const { $progress, $controlsLeft, $controlsRight } = this.art.template;
        let parent;
        switch (option.position) {
            case 'top':
                parent = $progress;
                break;
            case 'left':
                parent = $controlsLeft;
                break;
            case 'right':
                parent = $controlsRight;
                break;
            default:
                break;
        }

        errorHandle(parent, 'Controls option.position can not be empty');
        this.id += 1;
        const control = component(this.art, this, parent, option, callback, 'control');
        if (
            !option.disable &&
            option.position !== 'top' &&
            !(control.$ref.firstElementChild && control.$ref.firstElementChild.tagName === 'I')
        ) {
            control.$ref.classList.add('art-control-onlyText');
        }
        return control;
    }

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            this.state = true;
            $player.classList.add('artplayer-controls-show');
            this.art.emit('controls:show');
        } else {
            this.state = false;
            $player.classList.remove('artplayer-controls-show');
            this.art.emit('controls:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
