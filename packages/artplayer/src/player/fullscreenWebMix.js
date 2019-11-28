import { addClass, removeClass, hasClass, def } from '../utils';

export default function fullscreenWebMix(art, player) {
    const { $player } = art.template;

    def(player, 'fullscreenWeb', {
        get() {
            return hasClass($player, 'art-web-fullscreen');
        },
        set(value) {
            if (player.fullscreen) {
                player.fullscreen = false;
            }

            if (value) {
                addClass($player, 'art-web-fullscreen');
                player.aspectRatioReset = true;
                art.emit('fullscreenWebChange', true);
            } else {
                removeClass($player, 'art-web-fullscreen');
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
