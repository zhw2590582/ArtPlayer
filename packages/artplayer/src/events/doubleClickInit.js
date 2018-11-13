export default function doubleClickInit(art, events) {
  const { refs: { $video } } = art;
  events.proxy($video, 'dblclick', () => {
    art.player.fullscreenToggle();
    art.emit('dblclick');
  });
}
