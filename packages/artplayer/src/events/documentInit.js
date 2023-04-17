export default function documentInit(art, events) {
    events.proxy(document, 'mousemove', (event) => {
        art.emit('document:mousemove', event);
    });

    events.proxy(document, 'mouseup', (event) => {
        art.emit('document:mouseup', event);
    });
}
