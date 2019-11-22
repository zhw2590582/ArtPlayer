import { setStyle, addClass, removeClass } from '../utils';
import component from '../utils/component';
import playbackRate from './playbackRate';
import aspectRatio from './aspectRatio';
import info from './info';
import version from './version';
import close from './close';

export default class Contextmenu {
    constructor(art) {
        this.id = 0;
        this.art = art;

        art.on('ready', () => {
            this.init();
        });

        art.on('blur', () => {
            this.show = false;
        });
    }

    init() {
        const {
            option,
            template: { $player, $contextmenu },
            events: { proxy },
        } = this.art;

        this.add(
            playbackRate({
                disable: !option.playbackRate,
                name: 'playbackRate',
                index: 10,
            }),
        );

        this.add(
            aspectRatio({
                disable: !option.aspectRatio,
                name: 'aspectRatio',
                index: 20,
            }),
        );

        this.add(
            info({
                disable: false,
                name: 'info',
                index: 30,
            }),
        );

        this.add(
            version({
                disable: false,
                name: 'version',
                index: 40,
            }),
        );

        this.add(
            close({
                disable: false,
                name: 'close',
                index: 50,
            }),
        );

        option.contextmenu.forEach(item => {
            this.add(item);
        });

        proxy($player, 'contextmenu', event => {
            event.preventDefault();
            this.show = true;
            this.setPos(event);
        });

        proxy($player, 'click', event => {
            if (!event.composedPath().includes($contextmenu)) {
                this.show = false;
            }
        });
    }

    add(item, callback) {
        this.id += 1;
        const { $contextmenu } = this.art.template;
        return component(this.art, this, $contextmenu, item, callback, 'contextmenu');
    }

    setPos(event) {
        const { $player, $contextmenu } = this.art.template;
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = $player.getBoundingClientRect();
        const { height: mHeight, width: mWidth } = $contextmenu.getBoundingClientRect();
        let menuLeft = mouseX - cLeft;
        let menuTop = mouseY - cTop;

        if (mouseX + mWidth > cLeft + cWidth) {
            menuLeft = cWidth - mWidth;
        }

        if (mouseY + mHeight > cTop + cHeight) {
            menuTop = cHeight - mHeight;
        }

        setStyle($contextmenu, 'left', `${menuLeft}px`);
        setStyle($contextmenu, 'top', `${menuTop}px`);
    }

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            addClass($player, 'art-contextmenu-show');
            this.art.emit('contextmenu:show');
        } else {
            removeClass($player, 'art-contextmenu-show');
            this.art.emit('contextmenu:hide');
        }
    }
}
