export default function seekMix(art, player) {
  Object.defineProperty(player, 'played', {
    get: () => {
      const { $video } = art.refs;
      return $video.currentTime / $video.duration;
    }
  });
}
