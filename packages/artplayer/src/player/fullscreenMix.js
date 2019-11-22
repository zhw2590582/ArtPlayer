import screenfull from 'screenfull';
import { addClass, removeClass } from '../utils';

export default function fullscreenMix(art, player) {
    const {
        i18n,
        notice,
        events: { destroyEvents },
        template: { $player },
    } = art;

    const screenfullChange = () => {
        art.emit('fullscreenChange', screenfull.isFullscreen);
    };

    const screenfullError = () => {
        notice.show(i18n.get('Does not support fullscreen'));
    };

    if (player.fullscreenIsEnabled) {
        screenfull.on('change', screenfullChange);
        screenfull.on('error', screenfullError);
        destroyEvents.push(() => {
            screenfull.off('change', screenfullChange);
            screenfull.off('error', screenfullError);
        });
    }

    Object.defineProperty(player, 'fullscreen', {
        get() {
            return screenfull.isFullscreen;
        },
        set(value) {
            if (!player.fullscreenIsEnabled) {
                screenfullError();
                return;
            }

            if (value) {
                if (player.fullscreenWeb) {
                    player.fullscreenWeb = false;
                }

                screenfull.request($player).then(() => {
                    addClass($player, 'art-fullscreen');
                    player.aspectRatioReset = true;
                    art.emit('fullscreenEnabled');
                });
            } else {
                if (player.fullscreenWeb) {
                    player.fullscreenWeb = false;
                }

                screenfull.exit().then(() => {
                    removeClass($player, 'art-fullscreen');
                    player.aspectRatioReset = true;
                    art.emit('fullscreenExit');
                });
            }
        },
    });

    Object.defineProperty(player, 'fullscreenToggle', {
        set(value) {
            if (value) {
                player.fullscreen = !player.fullscreen;
            }
        },
    });

    Object.defineProperty(player, 'fullscreenIsEnabled', {
        get() {
            return screenfull.isEnabled;
        },
    });
}
