import screenfull from 'screenfull';

export default function fullscreenMix(art, player) {
    const {
        i18n,
        notice,
        events: { destroyEvents },
        template: { $player },
    } = art;

    const screenfullChange = () => {
        art.emit('fullscreen:change', screenfull.isFullscreen);
    };

    const screenfullError = () => {
        notice.show(i18n.get('This does not seem to support full screen functionality'));
    };

    try {
        screenfull.on('change', screenfullChange);
        screenfull.on('error', screenfullError);
        destroyEvents.push(() => {
            screenfull.off('change', screenfullChange);
            screenfull.off('error', screenfullError);
        });
    } catch (error) {
        screenfullError();
    }

    Object.defineProperty(player, 'fullscreen', {
        get() {
            return screenfull.isFullscreen;
        },
        set(value) {
            if (value) {
                if (player.fullscreenWeb) {
                    player.fullscreenWeb = false;
                }
                screenfull.request($player).then(() => {
                    $player.classList.add('artplayer-fullscreen');
                    player.aspectRatioReset = true;
                    art.emit('fullscreen:enabled');
                });
            } else {
                if (player.fullscreenWeb) {
                    player.fullscreenWeb = false;
                }
                screenfull.exit().then(() => {
                    $player.classList.remove('artplayer-fullscreen');
                    player.aspectRatioReset = true;
                    art.emit('fullscreen:exit');
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
}
