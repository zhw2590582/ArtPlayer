export default function toggleMix(art, player) {
  Object.defineProperty(player, 'toggle', {
    value: () => {
      if (art.isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    }
  });
}
