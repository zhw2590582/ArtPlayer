import { append, setStyles, setStyle, sublings } from './utils';

let id = 0;
export default class Contextmenu {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { option, player, i18n, refs, events: { proxy } } = this.art;

    option.contextmenu.push(
      {
        disable: !option.playbackRate,
        name: 'playbackRate',
        html: `
          ${i18n.get('Play speed')}:
          <span data-rate="0.5">0.5</span>
          <span data-rate="0.75">0.75</span>
          <span data-rate="1" class="normal current">${i18n.get('Normal')}</span>
          <span data-rate="1.25">1.25</span>
          <span data-rate="1.5">1.5</span>
          <span data-rate="2.0">2.0</span>
        `,
        click: (art, event) => {
          const { target } = event;
          const { rate } = target.dataset;
          if (rate) {
            player.playbackRate(Number(rate));
            sublings(target).forEach(item => item.classList.remove('current'));
            target.classList.add('current');
            this.hide();
          }
        }
      },
      {
        disable: !option.aspectRatio,
        name: 'aspectRatio',
        html: `
          ${i18n.get('Aspect ratio')}:
          <span data-ratio="default" class="default current">${i18n.get('Default')}</span>
          <span data-ratio="4:3">4:3</span>
          <span data-ratio="16:9">16:9</span>
        `,
        click: (art, event) => {
          const { target } = event;
          const { ratio } = target.dataset;
          if (ratio) {
            player.aspectRatio(ratio.split(':'));
            sublings(target).forEach(item => item.classList.remove('current'));
            target.classList.add('current');
            this.hide();
          }
        }
      },
      {
        disable: false,
        name: 'info',
        html: i18n.get('Video info'),
        click: () => {
          this.art.info.show();
          this.hide();
        }
      },
      {
        disable: false,
        name: 'version',
        html: '<a href="https://github.com/zhw2590582/artplayer" target="_blank">ArtPlayer __VERSION__</a>'
      },
      {
        disable: false,
        name: 'close',
        html: i18n.get('Close'),
        click: () => {
          this.hide();
        }
      }
    );

    proxy(refs.$player, 'contextmenu', event => {
      event.preventDefault();
      this.art.isFocus = true;
      if (!refs.$contextmenu) {
        this.creatMenu();
      }
      this.show();
      this.setPos(event);
    });

    proxy(refs.$player, 'click', event => {
      if (refs.$contextmenu && !event.path.includes(refs.$contextmenu)) {
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
      .forEach(item => {
        id++;
        const $menu = document.createElement('div');
        $menu.setAttribute('data-art-menu-id', id);
        $menu.setAttribute('class', `art-menu art-menu-${item.name || id}`);
        append($menu, item.html);
        setStyles($menu, item.style || {});
        if (item.click) {
          proxy($menu, 'click', event => {
            event.preventDefault();
            item.click(this.art, event);
            this.art.emit('contextmenu:click', $menu);
          });
        }
        this[`$${item.name || id}`] = append(refs.$contextmenu, $menu);
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
