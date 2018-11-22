import { append, insertByIndex, setStyle } from '../utils';
import playbackRate from './playbackRate';
import aspectRatio from './aspectRatio';
import info from './info';
import version from './version';
import close from './close';

let id = 0;
export default class Contextmenu {
    constructor(art) {
        id = 0;
        this.art = art;
        this.art.on('firstCanplay', () => {
            this.init();
        });
    }

    init() {
        const {
            option,
            refs: { $player, $contextmenu },
            events: { proxy },
        } = this.art;

        this.add(playbackRate({
            disable: !option.playbackRate,
            name: 'playbackRate',
            index: 10,
        }));

        this.add(aspectRatio({
            disable: !option.aspectRatio,
            name: 'aspectRatio',
            index: 20,
        }));

        this.add(info({
            disable: false,
            name: 'info',
            index: 30,
        }));

        this.add(version({
            disable: false,
            name: 'version',
            index: 40,
        }));

        this.add(close({
            disable: false,
            name: 'close',
            index: 50,
        }));

        option.contextmenu.forEach(item => {
            this.add(item);
        });

        proxy($player, 'contextmenu', event => {
            event.preventDefault();
            this.show();
            this.setPos(event);
        });

        proxy($player, 'click', event => {
            if (!event.composedPath().includes($contextmenu)) {
                this.hide();
            }
        });
    }

    add(item, callback) {
        const menu = typeof item === 'function' ? item(this.art) : item;
        if (!menu.disable) {
            const {
                refs: { $contextmenu },
                events: { proxy },
            } = this.art;
            id += 1;
            const name = menu.name || `contextmenu${id}`;
            const $menu = document.createElement('div');
            $menu.classList.value = `art-contextmenu art-contextmenu-${name}`;
            if (menu.html) {
                append($menu, menu.html);
            }
            if (menu.click) {
                proxy($menu, 'click', event => {
                    event.preventDefault();
                    menu.click.call(this, event);
                    this.art.emit('contextmenu:click', $menu);
                });
            }
            insertByIndex($contextmenu, $menu, menu.index || id);
            if (menu.mounted) {
                menu.mounted($menu);
            }
            if (callback) {
                callback($menu);
            }
            this.commonMethod(menu, $menu);
            this[name] = menu;
            this.art.emit('contextmenu:add', menu);
        }
    }

    setPos(event) {
        const {
            refs: { $player, $contextmenu },
        } = this.art;
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

    commonMethod(menu, $menu) {
        Object.defineProperty(menu, '$ref', {
            get: () => $menu,
        });

        Object.defineProperty(menu, 'hide', {
            value: () => {
                setStyle($menu, 'display', 'none');
                this.art.emit('menu:hide', $menu);
            },
        });

        Object.defineProperty(menu, 'show', {
            value: () => {
                setStyle($menu, 'display', 'block');
                this.art.emit('menu:show', $menu);
            },
        });
    }

    hide() {
        const {
            refs: { $contextmenu },
        } = this.art;
        setStyle($contextmenu, 'display', 'none');
        this.art.emit('contextmenu:hide', $contextmenu);
    }

    show() {
        const {
            refs: { $contextmenu },
        } = this.art;
        setStyle($contextmenu, 'display', 'block');
        this.art.emit('contextmenu:show', $contextmenu);
    }
}
