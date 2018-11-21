export default class Hotkey {
  constructor(art) {
    this.art = art;
    if (this.art.option.hotkey) {
      this.art.on('firstCanplay', () => {
        this.init();
      });
    }
  }

  init() {
    const { player, events: { proxy } } = this.art;
    proxy(window, 'keydown', event => {
      if (this.art.isFocus) {
        const tag = document.activeElement.tagName.toUpperCase();
        const editable = document.activeElement.getAttribute('contenteditable');
        if (
          tag !== 'INPUT' &&
          tag !== 'TEXTAREA' &&
          editable !== '' &&
          editable !== 'true'
        ) {
          this.art.emit('hotkey', event);
          switch (event.keyCode) {
            case 39:
              event.preventDefault();
              player.seek(player.currentTime + 10);
              break;
            case 37:
              event.preventDefault();
              player.seek(player.currentTime - 10);
              break;
            case 38:
              event.preventDefault();
              player.volume += 0.05;
              break;
            case 40:
              event.preventDefault();
              player.volume -= 0.05;
              break;
            case 32:
              event.preventDefault();
              player.toggle();
              break;
            default:
              break;
          }
        }
      }
    });
  }
}
