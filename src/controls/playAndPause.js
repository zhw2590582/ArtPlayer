import { append } from '../utils';
import icons from '../icons';

export default class PlayAndPause {
  constructor(art, option) {
    this.art = art;
    this.option = option;
    this.init();
  }

  init() {
    const { events: { proxy }, player } = this.art;

    this.$play = append(this.option.ref, icons.play);
    this.$pause = append(this.option.ref, icons.pause);
    this.$pause.style.display = 'none';

    proxy(this.$play, 'click', () => {
      player.play();
    });

    proxy(this.$pause, 'click', () => {
      player.pause();
    });

    this.art.on('video:playing', () => {
      this.$play.style.display = 'none';
      this.$pause.style.display = 'inline-block';
    });

    this.art.on('video:pause', () => {
      this.$play.style.display = 'inline-block';
      this.$pause.style.display = 'none';
    });
  }
}
