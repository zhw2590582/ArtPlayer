import { append, setStorage, getStorage } from '../utils';
import icons from '../icons';

export default class Volume {
  constructor(art, option) {
    this.art = art;
    this.option = option;
    this.init();
  }

  init() {
    const { events: { proxy }, player } = this.art;
    this.$volume = append(this.option.ref, icons.volume);
    this.$volumeClose = append(this.option.ref, icons.volumeClose);
    this.$volumeClose.style.display = 'none';

    proxy(this.$volume, 'click', () => {
      this.$volume.style.display = 'none';
      this.$volumeClose.style.display = 'block';
      setStorage('volume', player.volume());
      player.volume(0);
    });

    proxy(this.$volumeClose, 'click', () => {
      this.$volume.style.display = 'block';
      this.$volumeClose.style.display = 'none';
      player.volume(getStorage('volume') || 0.7);
    });

    proxy(this.option.ref, 'mouseenter', () => {
      console.log('mouseenter');
    });

    proxy(this.option.ref, 'mouseleave', () => {
      console.log('mouseleave');
    });

    this.art.on('video:volumechange', () => {
      if (player.volume() === 0) {
        this.$volume.style.display = 'none';
        this.$volumeClose.style.display = 'block';
      } else {
        this.$volume.style.display = 'block';
        this.$volumeClose.style.display = 'none';
      }
    });
  }
}
