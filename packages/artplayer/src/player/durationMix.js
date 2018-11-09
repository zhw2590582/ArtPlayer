export default function durationMix(art, player) {
  Object.defineProperty(player, 'duration', {
    get: () => art.refs.$video.duration || 0
  });
}
