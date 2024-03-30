import { includeFromEvent, isMobile } from '../utils';

export default function clickInit(art, events) {
    const {
        constructor,
        template: { $player, $video },
    } = art;

    events.proxy(document, ['click', 'contextmenu'], (event) => {
        if (includeFromEvent(event, $player)) {
            art.isInput = event.target.tagName === 'INPUT';
            art.isFocus = true;
            art.emit('focus', event);
        } else {
            art.isInput = false;
            art.isFocus = false;
            art.emit('blur', event);
        }
    });

    let clickTimes = [];
    events.proxy($video, 'click', (event) => {
        const now = Date.now();
        clickTimes.push(now);
        const { MOBILE_CLICK_PLAY, DBCLICK_TIME, MOBILE_DBCLICK_PLAY, DBCLICK_FULLSCREEN } = constructor;

        const clicks = clickTimes.filter((t) => now - t <= DBCLICK_TIME);
        switch (clicks.length) {
            case 1:
                art.emit('click', event);

                if (isMobile) {
                    if (!art.isLock && MOBILE_CLICK_PLAY) {
                        art.toggle();
                    }
                } else {
                    art.toggle();
                }
                clickTimes = clicks;
                break;
            case 2:
                art.emit('dblclick', event);

                if (isMobile) {
                    if (!art.isLock && MOBILE_DBCLICK_PLAY) {
                        art.toggle();
                    }
                } else {
                    if (DBCLICK_FULLSCREEN) {
                        art.fullscreen = !art.fullscreen;
                    }
                }
                clickTimes = [];
                break;
            default:
                clickTimes = [];
        }
    });
}
