import { append, setStorage, getStorage, clamp } from '../utils';
import icons from '../icons';

export default class Volume {
  constructor(art, option) {
    this.art = art;
    this.option = option;
    this.isDroging = false;
    this.init();
  }

  init() {
    const { events: { proxy }, player } = this.art;
    this.$volume = append(this.option.ref, icons.volume);
    this.$volumeClose = append(this.option.ref, icons.volumeClose);
    this.$volumePanel = append(this.option.ref, '<div class="art-volume-panel"></div>');
    this.$volumeHandle = append(this.$volumePanel, '<div class="art-volume-slider-handle"></div>');
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
      this.$volumePanel.style.width = '100px';
    });

    proxy(this.option.ref, 'mouseleave', () => {
      this.$volumePanel.style.width = '0';
    });

    proxy(this.$volumePanel, 'click', event => {
      this.volumeChangeFromEvent(event);
    });

    proxy(this.$volumeHandle, 'mousedown', () => {
      this.isDroging = true;
    });

    proxy(document, 'mousemove', event => {
      if (this.isDroging) {
        this.volumeChangeFromEvent(event);
      }
    });

    proxy(document, 'mouseup', () => {
      if (this.isDroging) {
        this.isDroging = false;
      }
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

  volumeChangeFromEvent(event) {
    const { player } = this.art;
    const volumeHandleWidth = this.$volumeHandle.clientWidth / 2;
    const { left } = this.$volumePanel.getBoundingClientRect();
    const width = clamp(event.x - left, volumeHandleWidth, this.$volumePanel.clientWidth - volumeHandleWidth);
    const percentage = clamp(width / this.$volumePanel.clientWidth, 0, 1);
    this.$volumeHandle.style.left = `calc(${percentage * 100}% - ${volumeHandleWidth}px)`;
    player.volume(percentage);
  }
}
