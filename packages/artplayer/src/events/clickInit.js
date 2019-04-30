export default function clickInit(art, events) {
    const {
        template: { $player },
    } = art;
    events.proxy(document, ['click', 'contextmenu'], event => {
        if (event.composedPath().indexOf($player) > -1) {
            art.isFocus = true;
            art.emit('focus');
        } else {
            art.isFocus = false;
            art.emit('blur');
        }
    });
}
