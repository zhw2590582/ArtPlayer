import screenfull from 'screenfull';

export default function fullscreenMix(art, player) {
    const {
        notice,
        events: { destroyEvents },
        template: { $player },
    } = art;

    const screenfullChange = () => {
        art.emit('fullscreen', screenfull.isFullscreen);
    };

    const screenfullError = () => {
        notice.show('Your browser does not seem to support full screen functionality.');
    };

    try {
        screenfull.on('change', screenfullChange);
        screenfull.on('error', screenfullError);
        destroyEvents.push(() => {
            screenfull.off('change', screenfullChange);
            screenfull.off('error', screenfullError);
        });
    } catch (error) {
        console.error(error);
    }

    Object.defineProperty(player, 'fullscreenState', {
        get: () => screenfull.isFullscreen,
    });

    Object.defineProperty(player, 'fullscreenEnabled', {
        value: () => {
            if (player.fullscreenWebState) {
                player.fullscreenWebExit();
            }
            screenfull.request($player);
            $player.classList.add('artplayer-fullscreen');
            player.aspectRatioReset();
            art.emit('fullscreen:enabled');
        },
    });

    Object.defineProperty(player, 'fullscreenExit', {
        value: () => {
            if (player.fullscreenState) {
                player.fullscreenWebExit();
                $player.classList.remove('artplayer-fullscreen');
                screenfull.exit();
                player.aspectRatioReset();
                art.emit('fullscreen:exit');
            }
        },
    });

    Object.defineProperty(player, 'fullscreenToggle', {
        value: () => {
            if (player.fullscreenState) {
                player.fullscreenExit();
            } else {
                player.fullscreenEnabled();
            }
        },
    });
}
