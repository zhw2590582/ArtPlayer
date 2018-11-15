export default function currentTimeMix(art, player) {
  Object.defineProperty(player, 'currentTime', {
    get: () => art.refs.$video.currentTime || 0
  });
}
