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
            art.emit('focus');
        } else {
            art.isInput = false;
            art.isFocus = false;
            art.emit('blur');
        }
    });

    let clickTime = 0;
    events.proxy($video, 'click', () => {
        const now = Date.now();

        if (now - clickTime <= constructor.DB_CLICE_TIME) {
            art.emit('dblclick');

            if (isMobile) {
                if (!art.isLock) {
                    art.toggle();
                }
            } else {
                art.fullscreen = !art.fullscreen;
            }
        } else {
            art.emit('click');

            if (!isMobile) {
                art.toggle();
            }
        }

        clickTime = now;
    });
}
