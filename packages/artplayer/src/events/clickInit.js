import { includeFromEvent } from '../utils';

export default function clickInit(art, events) {
    const {
        controls,
        template: { $player },
    } = art;

    events.proxy(document, ['click', 'contextmenu'], (event) => {
        if (includeFromEvent(event, $player)) {
            art.isFocus = true;
            art.emit('focus');
        } else {
            art.isFocus = false;
            art.emit('blur');
        }
    });

    art.on('blur', () => {
        controls.delayHide();
    });
}
