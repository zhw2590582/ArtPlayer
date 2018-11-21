import Draggabilly from 'draggabilly';
import { setStyle, append } from '../utils';

export default function pipMix(art, player) {
  const { option, i18n, refs: { $player, $pipClose, $pipTitle }, events: { destroyEvents, proxy } } = art;
  let cachePos = null;
  let draggie = null;

  Object.defineProperty(player, 'pipState', {
    get: () => $player.classList.contains('artplayer-pip')
  });

  Object.defineProperty(player, 'pipDraggie', {
    get: () => draggie
  });

  Object.defineProperty(player, 'pipEnabled', {
    value: () => {
      if (player.autoSizeState) {
        player.autoSizeRemove();
      }

      if (!draggie) {
        draggie = new Draggabilly($player, {
          handle: '.artplayer-pip-header'
        });

        append($pipTitle, option.title || i18n.get('Mini player'));

        proxy($pipClose, 'click', () => {
          player.pipExit();
        });

        destroyEvents.push(() => {
          draggie.destroy();
        });
      } else {
        setStyle($player, 'left', `${cachePos.x}px`);
        setStyle($player, 'top', `${cachePos.y}px`);
      }

      $player.classList.add('artplayer-pip');
      player.fullscreenExit();
      player.fullscreenWebExit();
      player.aspectRatioRemove();
      player.playbackRateRemove();
      art.emit('pipEnabled');
    }
  });

  Object.defineProperty(player, 'pipExit', {
    value: () => {
      if (player.pipState) {
        $player.classList.remove('artplayer-pip');
        cachePos = draggie.position;
        setStyle($player, 'left', null);
        setStyle($player, 'top', null);
        player.fullscreenExit();
        player.fullscreenWebExit();
        player.aspectRatioRemove();
        player.playbackRateRemove();
        art.emit('pipExit');
      }
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
