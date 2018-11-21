import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default class PlayAndPause {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    const { events: { proxy }, player, i18n } = art;
    this.$play = append($control, icons.play);
    this.$pause = append($control, icons.pause);
    tooltip(this.$play, i18n.get('Play'));
    tooltip(this.$pause, i18n.get('Pause'));
    setStyle(this.$pause, 'display', 'none');

    proxy(this.$play, 'click', () => {
      player.play();
    });

    proxy(this.$pause, 'click', () => {
      player.pause();
    });

    art.on('video:playing', () => {
      setStyle(this.$play, 'display', 'none');
      setStyle(this.$pause, 'display', 'flex');
    });

    art.on('video:pause', () => {
      setStyle(this.$play, 'display', 'flex');
      setStyle(this.$pause, 'display', 'none');
    });
  }
}
