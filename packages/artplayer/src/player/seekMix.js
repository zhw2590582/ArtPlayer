import { secondToTime } from '../utils';

export default function seekMix(art, player) {
  const { refs: { $video }, notice } = art;

  Object.defineProperty(player, 'seek', {
    value: time => {
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
