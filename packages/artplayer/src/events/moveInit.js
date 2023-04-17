export default function moveInit(art, events) {
    const { $player } = art.template;

    events.proxy($player, 'mousemove', (event) => {
        art.emit('mousemove', event);
    });
}
