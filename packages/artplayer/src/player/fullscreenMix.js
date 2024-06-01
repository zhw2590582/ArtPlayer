import screenfull from '../libs/screenfull';
import { addClass, removeClass, def, get } from '../utils';

export default function fullscreenMix(art) {
    const {
        i18n,
        notice,
        template: { $video, $player },
    } = art;

    const nativeScreenfull = (art) => {
        screenfull.on('change', () => {
            art.emit('fullscreen', screenfull.isFullscreen);
        });

        screenfull.on('error', (event) => {
            art.emit('fullscreenError', event);
        });

        def(art, 'fullscreen', {
            get() {
                return screenfull.isFullscreen;
            },
            async set(value) {
                if (value) {
                    art.state = 'fullscreen';
                    await screenfull.request($player);
                    addClass($player, 'art-fullscreen');
                } else {
                    await screenfull.exit();
                    removeClass($player, 'art-fullscreen');
                }
                art.emit('resize');
            },
        });
    };

    const requestFullscreen =
        $video.requestFullscreen ||
        $video.mozRequestFullScreen ||
        $video.webkitRequestFullscreen ||
        $video.msRequestFullscreen;

    const exitFullscreen =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;

    const isFullscreenEnabled =
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled ||
        $video.webkitSupportsFullscreen;

    const webkitScreenfull = (art) => {
        def(art, 'fullscreen', {
            get() {
                return document.fullscreenElement || $video.webkitDisplayingFullscreen;
            },
            set(value) {
                if (value) {
                    art.state = 'fullscreen';
                    requestFullscreen.call($video);
                    art.emit('fullscreen', true);
                } else {
                    exitFullscreen.call(document);
                    art.emit('fullscreen', false);
                }
                art.emit('resize');
            },
        });
    };

    art.once('video:loadedmetadata', () => {
        if (screenfull.isEnabled) {
            nativeScreenfull(art);
        } else if (isFullscreenEnabled) {
            webkitScreenfull(art);
        } else {
            def(art, 'fullscreen', {
                get() {
                    return false;
                },
                set() {
                    notice.show = i18n.get('Fullscreen Not Supported');
                },
            });
        }

        // Asynchronous setting
        def(art, 'fullscreen', get(art, 'fullscreen'));
    });
}
