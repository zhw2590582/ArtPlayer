import { append, tooltip } from '../utils';
import icons from '../icons';

export default class PlayAndPause {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    const { events: { proxy }, player, i18n } = art;
    this.$play = append(this.option.$control, icons.play);
    this.$pause = append(this.option.$control, icons.pause);
    tooltip(this.$play, i18n.get('Play'));
    tooltip(this.$pause, i18n.get('Pause'));
    this.$pause.style.display = 'none';

    proxy(this.$play, 'click', () => {
      player.play();
    });

    proxy(this.$pause, 'click', () => {
      player.pause();
    });

    art.on('video:playing', () => {
      this.$play.style.display = 'none';
      this.$pause.style.display = 'block';
    });

    art.on('video:pause', () => {
      this.$play.style.display = 'block';
      this.$pause.style.display = 'none';
    });
  }
}
