import { clamp, setStorage } from '../utils';

export default function volumeMix(art, player) {
  Object.defineProperty(player, 'volume', {
    value: percentage => {
      const { refs: { $video }, i18n, notice } = art;
      if (percentage !== undefined) {
        $video.volume = clamp(percentage, 0, 1);
        notice.show(`${i18n.get('Volume')}: ${parseInt($video.volume * 100)}`);
        if ($video.volume !== 0) {
          setStorage('volume', $video.volume);
        }
        art.emit('volume', $video.volume);
      }
      return $video.volume || 0;
    }
  });
}
