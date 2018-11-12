export default function doubleClickInit(art, events) {
  const { refs: { $player } } = art;
  events.proxy($player, 'dblclick', () => {
    art.player.fullscreenToggle();
    art.emit('dblclick');
  });
}
