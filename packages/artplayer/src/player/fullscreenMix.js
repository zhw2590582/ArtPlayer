import screenfull from 'screenfull';
import { addClass, removeClass, def } from '../utils';

export default function fullscreenMix(art, player) {
    const { $player } = art.template;

    def(player, 'fullscreen', {
        get() {
            return screenfull.isFullscreen;
        },
        set(value) {
            if (player.fullscreenWeb) {
                player.fullscreenWeb = false;
            }

            if (value) {
                screenfull.request($player).then(() => {
                    addClass($player, 'art-fullscreen');
                    player.aspectRatioReset = true;
                    art.emit('fullscreenChange', true);
                });
            } else {
                screenfull.exit().then(() => {
                    removeClass($player, 'art-fullscreen');
                    player.aspectRatioReset = true;
                    art.emit('fullscreenChange', false);
                });
            }
        },
    });

    def(player, 'fullscreenToggle', {
        set(value) {
            if (value) {
                player.fullscreen = !player.fullscreen;
            }
        },
    });
}
