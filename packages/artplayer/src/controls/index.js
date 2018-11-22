import { insertByIndex, setStyle, append } from '../utils';
import Fullscreen from './fullscreen';
import FullscreenWeb from './fullscreenWeb';
import Pip from './pip';
import PlayAndPause from './playAndPause';
import Progress from './progress';
import Subtitle from './subtitle';
import Time from './time';
import Volume from './volume';
import Setting from './setting';
import Thumbnails from './thumbnails';
import Screenshot from './screenshot';
import Quality from './quality';

let id = 0;
export default class Controls {
    constructor(art) {
        id = 0;
        this.art = art;
        this.art.on('firstCanplay', () => {
            this.init();
        });
    }

    init() {
        const { option } = this.art;
        this.add(
            new Progress({
                name: 'progress',
                disable: false,
                position: 'top',
                index: 10,
            }),
        );

        this.add(
            new Thumbnails({
                name: 'thumbnails',
                disable: !option.thumbnails.url,
                position: 'top',
                index: 20,
            }),
        );

        this.add(
            new PlayAndPause({
                name: 'playAndPause',
                disable: false,
                position: 'left',
                index: 10,
            }),
        );

        this.add(
            new Volume({
                name: 'volume',
                disable: false,
                position: 'left',
                index: 20,
            }),
        );

        this.add(
            new Time({
                name: 'time',
                disable: false,
                position: 'left',
                index: 30,
            }),
        );

        this.add(
            new Quality({
                name: 'quality',
                disable: option.quality.length === 0,
                position: 'right',
                index: 10,
            }),
        );

        this.add(
            new Screenshot({
                name: 'screenshot',
                disable: !option.screenshot,
                position: 'right',
                index: 20,
            }),
        );

        this.add(
            new Subtitle({
                name: 'subtitle',
                disable: !option.subtitle.url,
                position: 'right',
                index: 30,
            }),
        );

        this.add(
            new Setting({
                name: 'setting',
                disable: !option.setting,
                position: 'right',
                index: 40,
            }),
        );

        this.add(
            new Pip({
                name: 'pip',
                disable: !option.pip,
                position: 'right',
                index: 50,
            }),
        );

        this.add(
            new FullscreenWeb({
                name: 'fullscreenWeb',
                disable: !option.fullscreenWeb,
                position: 'right',
                index: 60,
            }),
        );

        this.add(
            new Fullscreen({
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
        const control = typeof item === 'function' ? item(this.art) : item.option;
        if (control && !control.disable) {
            const {
                events: { proxy },
            } = this.art;
            id += 1;
            const name = control.name || `control${id}`;
            const $control = document.createElement('div');
            $control.classList.value = `art-control art-control-${name}`;
            if (control.html) {
                append($control, control.html);
            }
            if (control.click) {
                proxy($control, 'click', event => {
                    event.preventDefault();
                    control.click.call(this, event);
                    this.art.emit('control:click', $control);
                });
            }
            if (item.apply) {
                item.apply(this.art, $control);
            }
            this.mount(control.position, $control, control.index || id);
            if (control.mounted) {
                control.mounted($control);
            }
            if (callback) {
                callback($control);
            }
            this.commonMethod(control, $control);
            this[name] = control;
            this.art.emit('control:add', $control);
        }
    }

    mount(position, $control, index) {
        const { $progress, $controlsLeft, $controlsRight } = this.art.refs;
        switch (position) {
            case 'top':
                insertByIndex($progress, $control, index);
                break;
            case 'left':
                insertByIndex($controlsLeft, $control, index);
                break;
            case 'right':
                insertByIndex($controlsRight, $control, index);
                break;
            default:
                break;
        }
    }

    commonMethod(control, $control) {
        Object.defineProperty(control, '$ref', {
            get: () => $control,
        });

        Object.defineProperty(control, 'hide', {
            value: () => {
                setStyle($control, 'display', 'none');
                this.art.emit('control:hide', $control);
            },
        });

        Object.defineProperty(control, 'show', {
            value: () => {
                setStyle($control, 'display', 'block');
                this.art.emit('control:show', $control);
            },
        });
    }

    show() {
        const { $player } = this.art.refs;
        $player.classList.add('artplayer-controls-show');
    }

    hide() {
        const { $player } = this.art.refs;
        $player.classList.remove('artplayer-controls-show');
    }
}
