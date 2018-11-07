import { append, setStyles, setStyle } from '../utils';
import playbackRate from './playbackRate';
import aspectRatio from './aspectRatio';
import info from './info';
import version from './version';
import close from './close';

let id = 0;
export default class Contextmenu {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { option, refs, events: { proxy } } = this.art;

    option.contextmenu.push(
      playbackRate,
      aspectRatio,
      info,
      version,
      close
    );

    proxy(refs.$player, 'contextmenu', event => {
      event.preventDefault();
      if (!refs.$contextmenu) {
        this.creatMenu();
      }
      this.show();
      this.setPos(event);
    });

    proxy(refs.$player, 'click', event => {
      if (refs.$contextmenu && !event.composedPath().includes(refs.$contextmenu)) {
        this.hide();
      }
    });
  }

  creatMenu() {
    const { option, refs, events: { proxy } } = this.art;
    refs.$contextmenu = document.createElement('div');
    refs.$contextmenu.classList.add('artplayer-contextmenu');
    option.contextmenu
      .filter(item => !item.disable)
      .map(item => {
        id++;
        const menu = typeof item === 'function' ? item(this.art) : item;
        const $menu = document.createElement('div');
        $menu.dataset.artMenuId = menu.index || id;
        $menu.setAttribute('class', `art-menu art-menu-${menu.name || id}`);
        append($menu, menu.html);
        setStyles($menu, menu.style || {});
        if (menu.click) {
          proxy($menu, 'click', event => {
            event.preventDefault();
            menu.click.call(this, event);
            this.art.emit('contextmenu:click', $menu);
          });
        }
        this[`$${menu.name || id}`] = $menu;
        return $menu;
      })
      .sort(
        (a, b) =>
          Number(a.dataset.artMenuId) - Number(b.dataset.artMenuId)
      ).forEach(item => {
        append(refs.$contextmenu, item);
      });
    append(refs.$player, refs.$contextmenu);
  }

  setPos(event) {
    const { refs } = this.art;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = refs.$player.getBoundingClientRect();
    const { height: mHeight, width: mWidth } = refs.$contextmenu.getBoundingClientRect();
    let menuLeft = mouseX - cLeft;
    let menuTop = mouseY - cTop;

    if (mouseX + mWidth > cLeft + cWidth) {
      menuLeft = cWidth - mWidth;
    }

    if (mouseY + mHeight > cTop + cHeight) {
      menuTop = cHeight - mHeight;
    }

    setStyle(refs.$contextmenu, 'left', `${menuLeft}px`);
    setStyle(refs.$contextmenu, 'top', `${menuTop}px`);
  }

  hide() {
    const { refs: { $contextmenu } } = this.art;
    if ($contextmenu) {
      setStyle($contextmenu, 'display', 'none');
      this.art.emit('contextmenu:hide', $contextmenu);
    }
  }

  show() {
    const { refs: { $contextmenu } } = this.art;
    if ($contextmenu) {
      setStyle($contextmenu, 'display', 'block');
      this.art.emit('contextmenu:show', $contextmenu);
    }
  }
}
