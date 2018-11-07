export default function currentTimeMix(art, player) {
  Object.defineProperty(player, 'currentTime', {
    value: () => art.refs.$video.currentTime || 0
  });
}
