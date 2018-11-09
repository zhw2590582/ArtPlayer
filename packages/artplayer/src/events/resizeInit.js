import { sleep } from '../utils';
import { ResizeObserver } from 'resize-observer';

export default function clickInit(art, events) {
  const { refs: { $player } } = art;
  const resizeObserver = new ResizeObserver(() => {
    sleep().then(() => {
      art.player.aspectRatioReset();
      art.emit('resize');
    });
  });
  resizeObserver.observe($player);
  events.destroyEvents.push(() => {
    resizeObserver.unobserve($player);
  });
}
