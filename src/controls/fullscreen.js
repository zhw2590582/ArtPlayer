import { append, tooltip, setStyle, sleep } from '../utils';
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
    const { events: { destroyEvents, proxy }, i18n, player, notice, refs: { $player } } = art;
    this.$fullscreen = append($control, icons.fullscreen);
    tooltip(this.$fullscreen, i18n.get('Fullscreen'));

    proxy($control, 'click', () => {
      if (screenfull.enabled) {
        if (screenfull.isFullscreen) {
          screenfull.exit();
          $player.classList.remove('artplayer-fullscreen');
          setStyle(this.$fullscreen, 'opacity', '1');
          tooltip(this.$fullscreen, i18n.get('Fullscreen'));
        } else {
          $player.classList.add('artplayer-fullscreen');
          setStyle(this.$fullscreen, 'opacity', '0.8');
          tooltip(this.$fullscreen, i18n.get('Exit fullscreen'));
          screenfull.request($player);
        }
      } else {
        notice.show('Your browser does not seem to support full screen functionality.');
      }
    });

    const screenfullChange = () => {
      player.resetAspectRatio();
      art.emit('fullscreen', screenfull.isFullscreen);
    };

    screenfull.on('change', screenfullChange);
    destroyEvents.push(() => {
      screenfull.off('change', screenfullChange);
    });
  }

  exit() {
    screenfull.exit();
  }

  toggle() {
    const { $player } = this.art.refs;
    screenfull.toggle($player);
  }
}
