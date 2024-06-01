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

    const webkitScreenfull = (art) => {
        def(art, 'fullscreen', {
            get() {
                console.log('webkitDisplayingFullscreen', $video.webkitDisplayingFullscreen);
                return $video.webkitDisplayingFullscreen;
            },
            set(value) {
                console.log('set', value);
                if (value) {
                    art.state = 'fullscreen';
                    $video.webkitEnterFullscreen();
                    art.emit('fullscreen', true);
                } else {
                    $video.webkitExitFullscreen();
                    art.emit('fullscreen', false);
                }
                art.emit('resize');
            },
        });
    };

    art.once('video:loadedmetadata', () => {
        console.log('screenfull.isEnabled', screenfull.isEnabled);
        console.log('document.fullscreenEnabled', document.fullscreenEnabled);
        console.log('$video.webkitSupportsFullscreen', $video.webkitSupportsFullscreen);
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
                    notice.show = i18n.get('Fullscreen Not Supported');
                },
            });
        }

        // Asynchronous setting
        def(art, 'fullscreen', get(art, 'fullscreen'));
    });
}
