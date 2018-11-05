import { secondToTime } from '../utils';

export default function seekMix(art, player) {
  Object.defineProperty(player, 'seek', {
    value: time => {
      const { refs: { $video }, notice } = art;
      let newTime = Math.max(time, 0);
      if ($video.duration) {
        newTime = Math.min(newTime, $video.duration);
      }
      $video.currentTime = newTime;
      notice.show(`${secondToTime(newTime)} / ${secondToTime($video.duration)}`);
      art.emit('seek', newTime);
    }
  });
}
