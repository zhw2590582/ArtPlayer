import { addClass, removeClass } from '../utils';

export default function hoverInit(art, events) {
    const {
        template: { $player },
    } = art;
    events.hover(
        $player,
        () => {
            addClass($player, 'artplayer-hover');
            art.emit('hoverenter');
        },
        () => {
            removeClass($player, 'artplayer-hover');
            art.emit('hoverleave');
        },
    );
}
