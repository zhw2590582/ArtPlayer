import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';
import screenfull from 'screenfull';

export default class Fullscreen {
  constructor(option) {
    this.option = option;
    this.state = false;
  }

  apply(art, $control) {
    this.art = art;
    const { events: { proxy }, i18n, player, refs: { $player } } = art;
    this.$fullscreen = append($control, icons.fullscreen);
    tooltip(this.$fullscreen, i18n.get('Fullscreen'));
    proxy($control, 'click', () => {
      if (this.state) {
        screenfull.exit();
        this.state = false;
        $player.classList.remove('artplayer-fullscreen');
        setStyle(this.$fullscreen, 'opacity', '1');
        tooltip(this.$fullscreen, i18n.get('Fullscreen'));
      } else {
        if (screenfull.enabled) {
          this.state = true;
          $player.classList.add('artplayer-fullscreen');
          setStyle(this.$fullscreen, 'opacity', '0.8');
          tooltip(this.$fullscreen, i18n.get('Exit fullscreen'));
          screenfull.request($player);
        }
      }
      player.resetAspectRatio();
      art.emit('fullscreen', this.state);
    });
  }

  exit() {
    screenfull.exit();
    this.state = false;
  }

  toggle() {
    const { $player } = this.art.refs;
    screenfull.toggle($player);
    this.state = screenfull.isFullscreen;
  }
}
