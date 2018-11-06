export default function pipMix(art, player) {
  const { refs: { $player } } = art;

  Object.defineProperty(player, 'pipState', {
    get: () => $player.classList.contains('artplayer-pip')
  });

  Object.defineProperty(player, 'pipEnabled', {
    value: () => {
      $player.classList.add('artplayer-pip');
      player.fullscreenExit();
      player.fullscreenWebExit();
      player.aspectRatioRemove();
      player.playbackRateRemove();
      art.emit('pip', true);
    }
  });

  Object.defineProperty(player, 'pipExit', {
    value: () => {
      $player.classList.remove('artplayer-pip');
      player.fullscreenExit();
      player.fullscreenWebExit();
      player.aspectRatioRemove();
      player.playbackRateRemove();
      art.emit('pip', false);
    }
  });

  Object.defineProperty(player, 'pipToggle', {
    value: () => {
      if (player.pipState) {
        player.pipExit();
      } else {
        player.pipEnabled();
      }
    }
  });
}
