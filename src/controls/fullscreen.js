import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';
import screenfull from 'screenfull';

export default class Fullscreen {
  constructor(option) {
    this.option = option;
  }

  get state() {
    return screenfull.isFullscreen;
  }

  apply(art, $control) {
    this.art = art;
    const { events: { destroyEvents, proxy }, i18n, player, controls, notice } = art;
    this.$fullscreen = append($control, icons.fullscreen);
    tooltip(this.$fullscreen, i18n.get('Fullscreen'));

    proxy($control, 'click', () => {
      if (controls.fullscreenWeb) {
        controls.fullscreenWeb.exit();
      }

      this.toggle();
    });

    const screenfullChange = () => {
      player.resetAspectRatio();
      art.emit('fullscreen', screenfull.isFullscreen);
    };

    const screenfullError = () => {
      notice.show('Your browser does not seem to support full screen functionality.');
    };

    screenfull.on('change', screenfullChange);
    screenfull.on('error', screenfullError);
    destroyEvents.push(() => {
      screenfull.off('change', screenfullChange);
      screenfull.off('error', screenfullError);
    });
  }

  enabled() {
    const { i18n, refs: { $player } } = this.art;
    $player.classList.add('artplayer-fullscreen');
    setStyle(this.$fullscreen, 'opacity', '0.8');
    tooltip(this.$fullscreen, i18n.get('Exit fullscreen'));
    screenfull.request($player);
  }

  exit() {
    const { i18n, refs: { $player } } = this.art;
    $player.classList.remove('artplayer-fullscreen');
    setStyle(this.$fullscreen, 'opacity', '1');
    tooltip(this.$fullscreen, i18n.get('Fullscreen'));
    screenfull.exit();
  }

  toggle() {
    if (screenfull.enabled) {
      if (screenfull.isFullscreen) {
        this.exit();
      } else {
        this.enabled();
      }
    }
  }
}
