import { append } from '../utils';
import icons from '../icons';

export default class PlayAndPause {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { events: { proxy }, player } = this.art;

    this.$play = append(this.option.$control, icons.play);
    this.$pause = append(this.option.$control, icons.pause);
    this.$pause.style.display = 'none';

    proxy(this.$play, 'click', () => {
      player.play();
    });

    proxy(this.$pause, 'click', () => {
      player.pause();
    });

    this.art.on('video:playing', () => {
      this.$play.style.display = 'none';
      this.$pause.style.display = 'block';
    });

    this.art.on('video:pause', () => {
      this.$play.style.display = 'block';
      this.$pause.style.display = 'none';
    });
  }
}
