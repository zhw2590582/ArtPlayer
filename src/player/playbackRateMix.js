import { clamp, sublings } from '../utils';

export default function playbackRateMix(art, player) {
  Object.defineProperty(player, 'playbackRate', {
    value: rate => {
      const { refs: { $video, $player }, i18n, notice } = art;
      const newRate = clamp(rate, 0.1, 10);
      $video.playbackRate = newRate;
      $player.dataset.playbackRate = newRate;
      notice.show(`${i18n.get('Rate')}: ${newRate === 1 ? i18n.get('Normal') : `${newRate}x`}`);
      art.emit('playbackRate', newRate);
    }
  });

  Object.defineProperty(player, 'removePlaybackRate', {
    value: () => {
      const { contextmenu: { $playbackRate } } = art;
      if ($playbackRate) {
        const $normal = $playbackRate.querySelector('.normal');
        sublings($normal).forEach(item => item.classList.remove('current'));
        $normal.classList.add('current');
      }
    }
  });

  Object.defineProperty(player, 'resetPlaybackRate', {
    value: () => {
      const { refs: { $player } } = art;
      const { playbackRate } = $player.dataset;
      if (playbackRate) {
        player.playbackRate(Number(playbackRate));
      }
    }
  });
}
