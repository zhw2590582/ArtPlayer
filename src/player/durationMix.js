export default function durationMix(art, player) {
  Object.defineProperty(player, 'duration', {
    value: () => art.refs.$video.duration || 0
  });
}
