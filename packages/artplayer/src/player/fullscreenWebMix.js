import { addClass, removeClass, hasClass, def } from '../utils';

export default function fullscreenWebMix(art, player) {
    const { $player } = art.template;

    def(player, 'fullscreenWeb', {
        get() {
            return hasClass($player, 'art-fullscreen-web');
        },
        set(value) {
            if (value) {
                addClass($player, 'art-fullscreen-web');
                player.aspectRatioReset = true;
                art.emit('fullscreenWebChange', true);
            } else {
                removeClass($player, 'art-fullscreen-web');
                player.aspectRatioReset = true;
                art.emit('fullscreenWebChange', false);
            }
        },
    });

    def(player, 'fullscreenWebToggle', {
        set(value) {
            if (value) {
                player.fullscreenWeb = !player.fullscreenWeb;
            }
        },
    });
}
