import { debounce } from './utils';

export default class Events {
  constructor(art) {
    this.art = art;
    this.destroyEvents = [];
    this.proxy = this.proxy.bind(this);
    this.hover = this.hover.bind(this);
    this.init();
  }

  init() {
    const { refs: { $player } } = this.art;

    this.hover($player, () => {
      $player.classList.add('artplayer-hover');
      this.art.emit('hoverenter');
    }, () => {
      $player.classList.remove('artplayer-hover');
      $player.classList.remove('artplayer-hide-cursor');
      this.art.emit('hoverleave');
    });

    this.proxy(document, ['click', 'contextmenu'], event => {
      if (event.composedPath().indexOf($player) > -1) {
        this.art.isFocus = true;
      } else {
        this.art.isFocus = false;
        this.art.contextmenu.hide();
      }
    });

    const hideCursor = debounce(() => {
      $player.classList.add('artplayer-hide-cursor');
      if (this.art.player.fullscreenState || this.art.player.fullscreenWebState) {
        $player.classList.remove('artplayer-hover');
        this.art.controls.hide();
      }
    }, 5000);

    this.proxy($player, 'mousemove', () => {
      $player.classList.remove('artplayer-hide-cursor');
      this.art.controls.show();
      if (!this.art.player.pipState) {
        hideCursor();
      } else {
        hideCursor.clearTimeout();
      }
    });
  }

  proxy(target, name, callback, option = {}) {
    if (Array.isArray(name)) {
      name.forEach(item => this.proxy(target, item, callback, option));
      return;
    }

    target.addEventListener(name, callback, option);
    this.destroyEvents.push(() => {
      target.removeEventListener(name, callback, option);
    });
  }

  hover(target, mouseenter, mouseleave) {
    this.proxy(target, 'mouseenter', mouseenter);
    this.proxy(target, 'mouseleave', mouseleave);
  }

  destroy() {
    this.destroyEvents.forEach(event => event());
  }
}
