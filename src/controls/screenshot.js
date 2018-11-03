import { append, tooltip, secondToTime, setStyle } from '../utils';
import icons from '../icons';

export default class Screenshot {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    this.art = art;
    const { events: { proxy }, i18n, notice } = this.art;
    this.$screenshot = append($control, icons.screenshot);
    tooltip(this.$screenshot, i18n.get('Screenshot'));
    proxy(this.$screenshot, 'click', () => {
      try {
        this.captureFrame();
      } catch (error) {
        notice.show(error);
      }
    });
  }

  captureFrame() {
    const { $video } = this.art.refs;
    const canvas = document.createElement('canvas');
    canvas.width = $video.videoWidth;
    canvas.height = $video.videoHeight;
    canvas.getContext('2d').drawImage($video, 0, 0);
    const dataUri = canvas.toDataURL('image/png');
    const elink = document.createElement('a');
    setStyle(elink, 'display', 'none');
    elink.href = dataUri;
    elink.download = `ArtPlayer_${secondToTime($video.currentTime)}.png`;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }
}
