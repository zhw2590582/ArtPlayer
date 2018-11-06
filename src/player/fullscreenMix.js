import screenfull from 'screenfull';

export default function fullscreenMix(art, player) {
  const { notice, events: { destroyEvents }, refs: { $player } } = art;

  const screenfullChange = () => {
    player.aspectRatioReset();
    art.emit('fullscreen', screenfull.isFullscreen);
  };

  const screenfullError = () => {
    notice.show('Your browser does not seem to support full screen functionality.');
  };

  screenfull.on('change', screenfullChange);
  screenfull.on('error', screenfullError);
  destroyEvents.push(() => {
    screenfull.off('change', screenfullChange);
    screenfull.off('error', screenfullError);
  });

  Object.defineProperty(player, 'fullscreenState', {
    get: () => screenfull.isFullscreen
  });

  Object.defineProperty(player, 'fullscreenEnabled', {
    value: () => {
      if (player.fullscreenWebState) {
        player.fullscreenWebExit();
      }
      $player.classList.add('artplayer-fullscreen');
      screenfull.request($player);
    }
  });

  Object.defineProperty(player, 'fullscreenExit', {
    value: () => {
      if (player.fullscreenWebState) {
        player.fullscreenWebExit();
      }
      $player.classList.remove('artplayer-fullscreen');
      screenfull.exit();
    }
  });

  Object.defineProperty(player, 'fullscreenToggle', {
    value: () => {
      if (screenfull.enabled) {
        if (screenfull.isFullscreen) {
          player.fullscreenExit();
        } else {
          player.fullscreenEnabled();
        }
      }
    }
  });
}
