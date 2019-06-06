import { ResizeObserver } from 'resize-observer';

export default function resizeInit(art, events) {
    const {
        option,
        template: { $player },
    } = art;
    
    const resizeObserver = new ResizeObserver(() => {
        if (option.autoSize) {
            if (!art.player.fullscreen && !art.player.fullscreenWeb && !art.player.pip) {
                art.player.autoSize = true;
            } else {
                art.player.autoSize = false;
            }
        }
        art.player.aspectRatioReset = true;
        art.emit('resize', $player);
    });
    resizeObserver.observe($player);
    events.destroyEvents.push(() => {
        resizeObserver.unobserve($player);
    });
}
