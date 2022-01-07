import screenfull from 'screenfull';
import { addClass, removeClass, def, get } from '../utils';

const nativeScreenfull = (art) => {
    const { $player } = art.template;

    screenfull.on('change', () => art.emit('fullscreen', screenfull.isFullscreen));

    def(art, 'fullscreen', {
        get() {
            return screenfull.isFullscreen;
        },
        set(value) {
            if (value) {
                screenfull.request($player).then(() => {
                    addClass($player, 'art-fullscreen');
                    art.aspectRatioReset = true;
                    art.autoSize = false;
                    art.emit('resize');
                    art.emit('fullscreen', true);
                });
            } else {
                screenfull.exit().then(() => {
                    removeClass($player, 'art-fullscreen');
                    art.aspectRatioReset = true;
                    art.autoSize = art.option.autoSize;
                    art.emit('resize');
                    art.emit('fullscreen');
                });
            }
        },
    });
};

const webkitScreenfull = (art) => {
    const { $video } = art.template;

    def(art, 'fullscreen', {
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

export default function fullscreenMix(art) {
    const {
        i18n,
        notice,
        template: { $video },
    } = art;

    art.once('ready', () => {
        if (screenfull.isEnabled) {
            nativeScreenfull(art);
        } else if (document.fullscreenEnabled || $video.webkitSupportsFullscreen) {
            webkitScreenfull(art);
        } else {
            def(art, 'fullscreen', {
                get() {
                    return false;
                },
                set() {
                    notice.show = i18n.get('Fullscreen not supported');
                },
            });
        }

        // Asynchronous setting
        def(art, 'fullscreen', get(art, 'fullscreen'));
    });
}
