export default function clickInit(art, events) {
    const { $player } = art.template;
    events.proxy(document, ['click', 'contextmenu'], (event) => {
        if (event.composedPath && event.composedPath().indexOf($player) > -1) {
            art.isFocus = true;
            art.emit('focus');
        } else if (art.isFocus) {
            art.isFocus = false;
            art.emit('blur');
        }
    });
}
