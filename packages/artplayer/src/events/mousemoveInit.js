import { debounce } from '../utils';

export default function mousemoveInitInit(art, events) {
  const { refs: { $player } } = art;

  const hideCursor = debounce(() => {
    $player.classList.add('artplayer-hide-cursor');
    if (art.player.fullscreenState || art.player.fullscreenWebState) {
      $player.classList.remove('artplayer-hover');
      art.controls.hide();
    }
  }, 5000);

  art.on('hoverleave', () => {
    hideCursor.clearTimeout();
    $player.classList.remove('artplayer-hide-cursor');
  });

  events.proxy($player, 'mousemove', () => {
    $player.classList.remove('artplayer-hide-cursor');
    art.controls.show();
    if (!art.player.pipState) {
      hideCursor();
    } else {
      hideCursor.clearTimeout();
    }
  });
}
