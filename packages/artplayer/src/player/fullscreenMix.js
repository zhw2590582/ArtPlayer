import screenfull from 'screenfull';
import { addClass, removeClass, def } from '../utils';

const nativeScreenfull = (art, player) => {
    const { $player } = art.template;

    def(player, 'fullscreen', {
        get() {
            return screenfull.isFullscreen;
        },
        set(value) {
            if (value) {
                screenfull.request($player).then(() => {
                    addClass($player, 'art-fullscreen');
                    player.aspectRatioReset = true;
                    art.emit('resize');
                    art.emit('fullscreen', true);
                });
            } else {
                screenfull.exit().then(() => {
                    removeClass($player, 'art-fullscreen');
                    player.aspectRatioReset = true;
                    player.autoSize = art.option.autoSize;
                    art.emit('resize');
                    art.emit('fullscreen');
                });
            }
        },
    });
};

const webkitScreenfull = (art, player) => {
    const { $video } = art.template;

    def(player, 'fullscreen', {
        get() {
            return $video.webkitDisplayingFullscreen;
        },
        set(value) {
            if (value) {
                $video.webkitEnterFullscreen();
            } else {
                $video.webkitExitFullscreen();
            }
        },
    });
};

export default function fullscreenMix(art, player) {
    const { $video } = art.template;

    if (screenfull.isEnabled) {
        nativeScreenfull(art, player);
    } else if ($video.webkitSupportsFullscreen) {
        webkitScreenfull(art, player);
    } else {
        def(player, 'fullscreen', {
            get() {
                return false;
            },
            set() {
                return false;
            },
        });
    }

    def(player, 'fullscreenToggle', {
        set(value) {
            if (value) {
                player.fullscreen = !player.fullscreen;
            }
        },
    });
}
