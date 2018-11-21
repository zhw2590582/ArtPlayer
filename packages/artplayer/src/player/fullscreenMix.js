import screenfull from 'screenfull';

export default function fullscreenMix(art, player) {
    const {
        notice,
        events: { destroyEvents },
        refs: { $player },
    } = art;

    const screenfullChange = () => {
        art.emit('fullscreen', screenfull.isFullscreen);
    };

    const screenfullError = () => {
        notice.show('Your browser does not seem to support full screen functionality.');
    };

    screenfull.on('change', screenfullChange);
    screenfull.on('error', screenfullError);
    destroyEvents.push(() => {
        screenfull.off('change', screenfullChange);
        screenfull.off('error', screenfullError);
    });

    Object.defineProperty(player, 'fullscreenState', {
        get: () => screenfull.isFullscreen,
    });

    Object.defineProperty(player, 'fullscreenEnabled', {
        value: () => {
            if (player.fullscreenWebState) {
                player.fullscreenWebExit();
            }
            $player.classList.add('artplayer-fullscreen');
            screenfull.request($player);
            art.emit('fullscreen:enabled');
        },
    });

    Object.defineProperty(player, 'fullscreenExit', {
        value: () => {
            if (player.fullscreenState) {
                player.fullscreenWebExit();
                $player.classList.remove('artplayer-fullscreen');
                screenfull.exit();
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
