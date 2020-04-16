export default function clickInit(art, events) {
    const { $player } = art.template;
    events.proxy(document, ['click', 'contextmenu'], (event) => {
        if (event.composedPath && event.composedPath().indexOf($player) > -1) {
            if (!art.isFocus) {
                art.isFocus = true;
                art.emit('focus');
            }
            art.emit(event.type, event);
        } else if (art.isFocus) {
            art.isFocus = false;
            art.emit('blur');
        }
    });
}
