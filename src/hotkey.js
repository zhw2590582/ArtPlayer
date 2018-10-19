export default class Hotkey {
  constructor(art) {
    this.art = art;
    if (this.art.option.hotkey) {
      this.init();
    }
  }

  init() {
    const {
      player,
      notice,
      i18n,
      refs: { $player },
      events: { proxy }
    } = this.art;

    proxy(document, 'click', event => {
      this.art.isFocus = event.path.indexOf($player) > -1;
    });

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
          let percentage;
          switch (event.keyCode) {
            case 39:
              event.preventDefault();
              player.seek(player.currentTime() + 10);
              notice.show(i18n.get('Fast forward 10 seconds'), true);
              break;
            case 37:
              event.preventDefault();
              player.seek(player.currentTime() - 10);
              notice.show(i18n.get('Rewind 10 seconds'), true);
              break;
            case 38:
              event.preventDefault();
              percentage = player.volume() + 0.1;
              player.volume(percentage);
              notice.show(i18n.get('10% increase in volume'), true);
              break;
            case 40:
              event.preventDefault();
              percentage = player.volume() - 0.1;
              player.volume(percentage);
              notice.show(i18n.get('10% reduction in volume'), true);
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
