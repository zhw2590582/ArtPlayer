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
      player.aspectRatioReset();
      art.emit('fullscreenWeb', true);
    }
  });

  Object.defineProperty(player, 'fullscreenWebExit', {
    value: () => {
      if (player.fullscreenState) {
        player.fullscreenExit();
      }
      $player.classList.remove('artplayer-web-fullscreen');
      player.aspectRatioReset();
      art.emit('fullscreenWeb', false);
    }
  });

  Object.defineProperty(player, 'fullscreenWebToggle', {
    value: () => {
      if (player.fullscreenWebState) {
        player.exit();
      } else {
        player.enabled();
      }
    }
  });
}
