import { setStyle, secondToTime } from '../utils';

export default function screenshotMix(art, player) {
  const { option, notice } = art;

  function captureFrame() {
    const { $video } = art.refs;
    const canvas = document.createElement('canvas');
    canvas.width = $video.videoWidth;
    canvas.height = $video.videoHeight;
    canvas.getContext('2d').drawImage($video, 0, 0);
    const dataUri = canvas.toDataURL('image/png');
    const elink = document.createElement('a');
    setStyle(elink, 'display', 'none');
    elink.href = dataUri;
    elink.download = `${option.title || 'artplayer'}_${secondToTime($video.currentTime)}.png`;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }

  Object.defineProperty(player, 'screenshot', {
    value: () => {
      try {
        captureFrame();
        art.emit('screenshot');
      } catch (error) {
        notice.show(error);
        console.warn(error);
      }
    }
  });
}
