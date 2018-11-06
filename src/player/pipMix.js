import Draggabilly from 'draggabilly';
import { setStyle, append } from '../utils';

let draggie = null;
export default function pipMix(art, player) {
  const { option, i18n, refs: { $player, $pipClose, $pipTitle }, events: { destroyEvents, proxy } } = art;

  Object.defineProperty(player, 'pipState', {
    get: () => $player.classList.contains('artplayer-pip')
  });

  Object.defineProperty(player, 'pipDraggie', {
    get: () => draggie
  });

  Object.defineProperty(player, 'pipEnabled', {
    value: () => {
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
      }
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
      setStyle($player, 'left', null);
      setStyle($player, 'top', null);
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
