export default function fullscreenWebMix(art, player) {
  const { refs: { $player } } = art;

  Object.defineProperty(player, 'fullscreenWebState', {
    get: () => $player.classList.contains('artplayer-web-fullscreen')
  });

  Object.defineProperty(player, 'fullscreenWebEnabled', {
    value: () => {
      if (player.fullscreenState) {
        player.fullscreenExit();
      }
      $player.classList.add('artplayer-web-fullscreen');
      art.emit('fullscreenWeb:enabled');
    }
  });

  Object.defineProperty(player, 'fullscreenWebExit', {
    value: () => {
      if (player.fullscreenState) {
        player.fullscreenExit();
        $player.classList.remove('artplayer-web-fullscreen');
        art.emit('fullscreenWeb:exit');
      }
    }
  });

  Object.defineProperty(player, 'fullscreenWebToggle', {
    value: () => {
      if (player.fullscreenWebState) {
        player.fullscreenWebExit();
      } else {
        player.fullscreenWebEnabled();
      }
    }
  });
}
