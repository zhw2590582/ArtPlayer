import { includeFromEvent } from '../utils';

export default function clickInit(art, events) {
    const {
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
}
