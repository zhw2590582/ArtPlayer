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
            art.emit('hover', true);
        },
        () => {
            removeClass($player, 'art-hover');
            art.emit('hover');
        },
    );

    art.on('hover', (value) => {
        if (!value) {
            controls.delayHide();
        }
    });
}
