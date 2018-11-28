export default function hoverInit(art, events) {
    const {
        template: { $player },
    } = art;
    events.hover(
        $player,
        () => {
            $player.classList.add('artplayer-hover');
            art.emit('hoverenter');
        },
        () => {
            $player.classList.remove('artplayer-hover');
            art.emit('hoverleave');
        },
    );
}
