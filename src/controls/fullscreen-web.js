import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default class FullscreenWeb {
  constructor(option) {
    this.option = option;
    this.state = false;
  }

  apply(art, $control) {
    const { events: { proxy }, i18n, player, controls, refs: { $player } } = art;
    this.$fullscreenWeb = append($control, icons.fullscreenWeb);
    tooltip(this.$fullscreenWeb, i18n.get('Web fullscreen'));
    proxy($control, 'click', () => {
      if (controls.fullscreen) {
        controls.fullscreen.exit();
      }

      if (this.state) {
        this.state = false;
        $player.classList.remove('artplayer-web-fullscreen');
        setStyle(this.$fullscreenWeb, 'opacity', '1');
        tooltip(this.$fullscreenWeb, i18n.get('Web fullscreen'));
      } else {
        this.state = true;
        $player.classList.add('artplayer-web-fullscreen');
        setStyle(this.$fullscreenWeb, 'opacity', '0.8');
        tooltip(this.$fullscreenWeb, i18n.get('Exit web fullscreen'));
      }
      player.resetAspectRatio();
      art.emit('fullscreenWeb', this.state);
    });
  }
}
