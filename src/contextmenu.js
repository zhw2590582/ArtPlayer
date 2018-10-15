export default class Contextmenu {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const {
      option,
      i18n,
      refs,
      events: { proxy }
    } = this.art;

    option.contextmenu.push(
      {
        text: i18n.get('Video info'),
        click: art => {
          art.info.show();
        }
      },
      {
        text: i18n.get('About author'),
        link: 'https://github.com/zhw2590582'
      },
      {
        text: 'ArtPlayer __VERSION__',
        link: 'https://github.com/zhw2590582/artplayer'
      }
    );

    proxy(refs.$container, 'contextmenu', event => {
      event.preventDefault();
      if (!refs.$contextmenu) {
        this.creatMenu();
      }
      this.show();
      this.setPos(event);
    });

    proxy(refs.$container, 'click', event => {
      if (refs.$contextmenu && !event.path.includes(refs.$contextmenu)) {
        this.hide();
      }
    });
  }

  creatMenu() {
    const {
      option,
      refs,
      events: { proxy }
    } = this.art;
    refs.$contextmenu = document.createElement('div');
    refs.$contextmenu.classList.add('artplayer-contextmenu');
    option.contextmenu.forEach(item => {
      const $menu = document.createElement('a');
      $menu.innerHTML = item.text;
      $menu.classList.add('art-menu');
      if (item.link) {
        $menu.target = '_blank';
        $menu.href = item.link;
      } else if (item.click) {
        $menu.href = '#';
        proxy($menu, 'click', event => {
          event.preventDefault();
          item.click(this.art, event);
          this.hide();
        });
      }
      refs.$contextmenu.appendChild($menu);
    });
    refs.$wrap.appendChild(refs.$contextmenu);
  }

  setPos(event) {
    const { refs } = this.art;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = refs.$container.getBoundingClientRect();
    const { height: mHeight, width: mWidth } = refs.$contextmenu.getBoundingClientRect();

    let menuLeft = mouseX - cLeft;
    let menuTop = mouseY - cTop;

    if (mouseX + mWidth > cLeft + cWidth) {
      menuLeft -= mWidth;
    }

    if (mouseY + mHeight > cTop + cHeight) {
      menuTop -= mHeight;
    }

    refs.$contextmenu.style.left = `${menuLeft}px`;
    refs.$contextmenu.style.top = `${menuTop}px`;
  }

  hide() {
    const { refs } = this.art;
    refs.$contextmenu && (refs.$contextmenu.style.display = 'none');
  }

  show() {
    const { refs } = this.art;
    refs.$contextmenu && (refs.$contextmenu.style.display = 'block');
  }
}
