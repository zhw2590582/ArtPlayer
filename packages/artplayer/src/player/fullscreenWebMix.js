export default function fullscreenWebMix(art, player) {
    const {
        template: { $player },
    } = art;

    Object.defineProperty(player, 'fullscreenWeb', {
        get() {
            return $player.classList.contains('artplayer-web-fullscreen');
        },
        set(value) {
            if (value) {
                if (player.fullscreen) {
                    player.fullscreen = false;
                }
                $player.classList.add('artplayer-web-fullscreen');
                player.aspectRatioReset = true;
                art.emit('fullscreenWeb:enabled');
            } else {
                if (player.fullscreen) {
                    player.fullscreen = false;
                }
                $player.classList.remove('artplayer-web-fullscreen');
                player.aspectRatioReset = true;
                art.emit('fullscreenWeb:exit');
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
