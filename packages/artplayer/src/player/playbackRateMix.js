import { clamp } from '../utils';

export default function playbackRateMix(art, player) {
  const { refs: { $video, $player }, i18n, notice } = art;

  Object.defineProperty(player, 'playbackRateState', {
    get: () => $player.dataset.playbackRate
  });

  Object.defineProperty(player, 'playbackRate', {
    value: rate => {
      const newRate = clamp(rate, 0.1, 10);
      $video.playbackRate = newRate;
      $player.dataset.playbackRate = newRate;
      notice.show(`${i18n.get('Rate')}: ${newRate === 1 ? i18n.get('Normal') : `${newRate}x`}`);
      art.emit('playbackRateChange', newRate);
    }
  });

  Object.defineProperty(player, 'playbackRateRemove', {
    value: () => {
      if (player.$playbackRateState) {
        player.playbackRate(1);
        delete $player.dataset.playbackRate;
        art.emit('playbackRateRemove');
      }
    }
  });

  Object.defineProperty(player, 'playbackRateReset', {
    value: () => {
      const { playbackRate } = $player.dataset;
      if (playbackRate) {
        player.playbackRate(Number(playbackRate));
        art.emit('playbackRateReset');
      }
    }
  });
}
