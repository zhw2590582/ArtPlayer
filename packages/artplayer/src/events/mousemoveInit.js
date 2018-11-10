import { debounce } from '../utils';

export default function mousemoveInitInit(art, events) {
  const { refs: { $player } } = art;

  const hideCursor = debounce(() => {
    $player.classList.add('artplayer-hide-cursor');
  }, 5000);

  const hideControl = debounce(() => {
    $player.classList.remove('artplayer-hover');
    art.controls.hide();
  }, 5000);

  art.on('hoverleave', () => {
    hideControl();
    hideCursor.clearTimeout();
    $player.classList.remove('artplayer-hide-cursor');
  });

  events.proxy($player, 'mousemove', () => {
    hideControl.clearTimeout();
    art.controls.show();
    $player.classList.remove('artplayer-hide-cursor');
    art.controls.show();
    if (!art.player.pipState) {
      hideCursor();
    } else {
      hideCursor.clearTimeout();
    }
  });
}
