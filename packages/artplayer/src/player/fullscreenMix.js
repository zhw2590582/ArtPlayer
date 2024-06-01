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

    const isFullscreenEnabled = () => {
        return (
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled ||
            $video.webkitSupportsFullscreen
        );
    };

    const webkitScreenfull = (art) => {
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

        const isFullscreen = () => {
            return (
                document.fullscreenElement === $video ||
                document.webkitFullscreenElement === $video ||
                document.mozFullScreenElement === $video ||
                document.msFullscreenElement === $video ||
                $video.webkitDisplayingFullscreen
            );
        };

        const handleFullscreenChange = () => {
            if (isFullscreen()) {
                art.state = 'fullscreen';
                art.emit('fullscreen', true);
            } else {
                art.emit('fullscreen', false);
            }
            art.emit('resize');
        };

        art.proxy(document, 'fullscreenchange', handleFullscreenChange);
        art.proxy(document, 'webkitfullscreenchange', handleFullscreenChange);
        art.proxy(document, 'mozfullscreenchange', handleFullscreenChange);
        art.proxy(document, 'MSFullscreenChange', handleFullscreenChange);

        def(art, 'fullscreen', {
            get() {
                return isFullscreen();
            },
            set(value) {
                if (value) {
                    requestFullscreen.call($video);
                } else {
                    exitFullscreen.call(document);
                }
            },
        });
    };

    art.once('video:loadedmetadata', () => {
        if (screenfull.isEnabled) {
            nativeScreenfull(art);
        } else if (isFullscreenEnabled()) {
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
