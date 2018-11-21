import { ResizeObserver } from 'resize-observer';
import { sleep } from '../utils';

export default function resizeInit(art, events) {
    const {
        option,
        refs: { $player },
    } = art;
    const resizeObserver = new ResizeObserver(() => {
        sleep().then(() => {
            if (option.autoSize) {
                if (!art.player.fullscreenState && !art.player.fullscreenWebState && !art.player.pipState) {
                    art.player.autoSize();
                } else {
                    art.player.autoSizeRemove();
                }
            }
            art.player.aspectRatioReset();
            art.emit('resize', $player);
        });
    });
    resizeObserver.observe($player);
    events.destroyEvents.push(() => {
        resizeObserver.unobserve($player);
    });
}
