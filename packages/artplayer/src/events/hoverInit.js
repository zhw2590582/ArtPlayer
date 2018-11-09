export default function hoverInit(art, events) {
  const { refs: { $player } } = art;
  events.hover(
    $player,
    () => {
      $player.classList.add('artplayer-hover');
      art.emit('hoverenter');
    },
    () => {
      $player.classList.remove('artplayer-hover');
      $player.classList.remove('artplayer-hide-cursor');
      art.emit('hoverleave');
    }
  );
}
