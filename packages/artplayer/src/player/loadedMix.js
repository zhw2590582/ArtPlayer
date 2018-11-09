export default function seekMix(art, player) {
  Object.defineProperty(player, 'loaded', {
    get: () => {
      const { $video } = art.refs;
      return $video.buffered.length
        ? $video.buffered.end($video.buffered.length - 1) / $video.duration
        : 0;
    }
  });
}
