import { addClass, removeClass, hasClass, def } from '../utils';

export default function fullscreenWebMix(art, player) {
    const {
        template: { $player },
    } = art;

    def(player, 'fullscreenWeb', {
        get() {
            return hasClass($player, 'art-web-fullscreen');
        },
        set(value) {
            if (value) {
                if (player.fullscreen) {
                    player.fullscreen = false;
                }
                addClass($player, 'art-web-fullscreen');
                player.aspectRatioReset = true;
                art.emit('fullscreenWebEnabled');
            } else {
                if (player.fullscreen) {
                    player.fullscreen = false;
                }
                removeClass($player, 'art-web-fullscreen');
                player.aspectRatioReset = true;
                art.emit('fullscreenWebExit');
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
