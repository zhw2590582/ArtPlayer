import { addClass, removeClass, hasClass } from '../utils';

export default function fullscreenWebMix(art, player) {
    const {
        template: { $player },
    } = art;

    Object.defineProperty(player, 'fullscreenWeb', {
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

    Object.defineProperty(player, 'fullscreenWebToggle', {
        set(value) {
            if (value) {
                player.fullscreenWeb = !player.fullscreenWeb;
            }
        },
    });
}
