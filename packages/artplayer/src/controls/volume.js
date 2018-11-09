import { append, clamp, tooltip, setStyle, sleep, getStyle } from '../utils';
import icons from '../icons';

export default class Volume {
  constructor(option) {
    this.option = option;
    this.isDroging = false;
  }

  apply(art, $control) {
    const { events: { proxy, hover }, player, i18n, storage } = art;
    this.$volume = append($control, icons.volume);
    this.$volumeClose = append($control, icons.volumeClose);
    this.$volumePanel = append($control, '<div class="art-volume-panel"></div>');
    this.$volumeHandle = append(this.$volumePanel, '<div class="art-volume-slider-handle"></div>');
    tooltip(this.$volume, i18n.get('Mute'));
    setStyle(this.$volumeClose, 'display', 'none');

    art.on('volume', percentage => {
      if (percentage === 0) {
        setStyle(this.$volume, 'display', 'none');
        setStyle(this.$volumeClose, 'display', 'block');
      } else {
        setStyle(this.$volume, 'display', 'block');
        setStyle(this.$volumeClose, 'display', 'none');
      }
    });

    art.on('video:volumechange', () => {
      this.setVolumeHandle(player.volume);
    });

    proxy(this.$volume, 'click', () => {
      player.volume = 0;
    });

    proxy(this.$volumeClose, 'click', () => {
      player.volume = storage.get('volume');
    });

    hover($control, () => {
      this.$volumePanel.classList.add('art-volume-panel-hover');
      sleep(200).then(() => {
        this.setVolumeHandle(player.volume);
      });
    }, () => {
      this.$volumePanel.classList.remove('art-volume-panel-hover');
    });

    proxy(this.$volumePanel, 'click', event => {
      player.volume = this.volumeChangeFromEvent(event);
    });

    proxy(this.$volumeHandle, 'mousedown', () => {
      this.isDroging = true;
    });

    proxy(this.$volumeHandle, 'mousemove', event => {
      if (this.isDroging) {
        player.volume = this.volumeChangeFromEvent(event);
      }
    });

    proxy(document, 'mouseup', () => {
      if (this.isDroging) {
        this.isDroging = false;
      }
    });
  }

  volumeChangeFromEvent(event) {
    const { left: panelLeft, width: panelWidth } = this.$volumePanel.getBoundingClientRect();
    const { width: handleWidth } = this.$volumeHandle.getBoundingClientRect();
    const percentage = clamp(event.x - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) / (panelWidth - handleWidth);
    return percentage;
  }

  setVolumeHandle(percentage = 0.7) {
    const panelWidth = getStyle(this.$volumePanel, 'width');
    const handleWidth = getStyle(this.$volumeHandle, 'width');
    const width = handleWidth / 2 + (panelWidth - handleWidth) * percentage - handleWidth / 2;
    setStyle(this.$volumeHandle, 'left', `${width}px`);
  }
}
