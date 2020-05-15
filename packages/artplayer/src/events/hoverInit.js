import { addClass, removeClass } from '../utils';

export default function hoverInit(art, events) {
    const {
        controls,
        template: { $player },
    } = art;

    events.hover(
        $player,
        () => {
            addClass($player, 'art-hover');
            art.emit('hoverenter');
        },
        () => {
            removeClass($player, 'art-hover');
            art.emit('hoverleave');
        },
    );

    art.on('hoverleave', () => {
        controls.delayHide();
    });
}
