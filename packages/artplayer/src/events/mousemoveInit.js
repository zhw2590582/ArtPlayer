export default function mousemoveInitInit(art, events) {
    const { $player } = art.template;

    events.proxy($player, 'mousemove', (event) => {
        art.emit('mousemove', event);
    });
}
