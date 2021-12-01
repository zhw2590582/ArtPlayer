import screenfull from 'screenfull';
import { addClass, removeClass, def, get } from '../utils';

const nativeScreenfull = (art, player) => {
    const { $player } = art.template;

    screenfull.on('change', () => art.emit('fullscreen', screenfull.isFullscreen));

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
                art.emit('fullscreen', true);
            } else {
                $video.webkitExitFullscreen();
                art.emit('fullscreen');
            }
        },
    });
};

export default function fullscreenMix(art, player) {
    const {
        i18n,
        notice,
        template: { $video },
    } = art;

    art.once('ready', () => {
        if (screenfull.isEnabled) {
            nativeScreenfull(art, player);
        } else if (document.fullscreenEnabled || $video.webkitSupportsFullscreen) {
            webkitScreenfull(art, player);
        } else {
            def(player, 'fullscreen', {
                get() {
                    return false;
                },
                set() {
                    notice.show = i18n.get('Fullscreen not supported');
                },
            });
        }

        // 异步设置
        def(art, 'fullscreen', get(player, 'fullscreen'));
    });

    def(player, 'fullscreenToggle', {
        set(value) {
            if (value) {
                player.fullscreen = !player.fullscreen;
            }
        },
    });
}
