import { addClass, removeClass } from '../utils';

export default function hoverInit(art, events) {
    const { $player } = art.template;

    events.hover(
        $player,
        (event) => {
            addClass($player, 'art-hover');
            art.emit('hover', true, event);
        },
        (event) => {
            removeClass($player, 'art-hover');
            art.emit('hover', false, event);
        },
    );
}
