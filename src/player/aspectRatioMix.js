import { setStyle, sublings } from '../utils';

export default function aspectRatioMix(art, player) {
  Object.defineProperty(player, 'aspectRatio', {
    value: ratio => {
      console.log(1);
      const { refs: { $video, $player }, i18n, notice } = art;
      const ratioName = ratio.length === 2 ? `${ratio[0]}:${ratio[1]}` : i18n.get('Default');

      if (ratio.length === 2) {
        const { videoWidth, videoHeight } = $video;
        const { clientWidth, clientHeight } = $player;
        const videoRatio = videoWidth / videoHeight;
        const setupRatio = Number(ratio[0]) / Number(ratio[1]);

        if (videoRatio > setupRatio) {
          const percentage = setupRatio * videoHeight / videoWidth;
          setStyle($video, 'width', `${percentage * 100}%`);
          setStyle($video, 'height', '100%');
          setStyle($video, 'padding', `0 ${(clientWidth - clientWidth * percentage) / 2}px`);
        } else {
          const percentage = videoWidth / setupRatio / videoHeight;
          setStyle($video, 'width', '100%');
          setStyle($video, 'height', `${percentage * 100}%`);
          setStyle($video, 'padding', `${(clientHeight - clientHeight * percentage) / 2}px 0`);
        }

        $player.dataset.aspectRatio = ratioName;
      } else {
        setStyle($video, 'width', null);
        setStyle($video, 'height', null);
        setStyle($video, 'padding', null);
        delete $player.dataset.aspectRatio;
      }

      notice.show(`${i18n.get('Aspect ratio')}: ${ratioName}`);
      art.emit('aspectRatio', ratio);
    }
  });

  Object.defineProperty(player, 'removeAspectRatio', {
    value: () => {
      const { refs: { $video }, contextmenu: { $aspectRatio } } = art;
      setStyle($video, 'width', null);
      setStyle($video, 'height', null);
      setStyle($video, 'padding', null);
      if ($aspectRatio) {
        const $default = $aspectRatio.querySelector('.default');
        sublings($default).forEach(item => item.classList.remove('current'));
        $default.classList.add('current');
      }
    }
  });

  Object.defineProperty(player, 'resetAspectRatio', {
    value: () => {
      const { refs: { $player } } = art;
      const { aspectRatio } = $player.dataset;
      if (aspectRatio) {
        player.aspectRatio(aspectRatio.split(':'));
      }
    }
  });
}
