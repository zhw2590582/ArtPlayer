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

        def(art, 'fullscreen', {
            get() {
                return screenfull.isFullscreen;
            },
            async set(value) {
                if (value) {
                    art.state = 'fullscreen';
                    art.aspectRatioReset();
                    art.autoSize = false;
                    await screenfull.request($player);
                    addClass($player, 'art-fullscreen');
                    art.emit('resize');
                    notice.show = '';
                } else {
                    art.aspectRatioReset();
                    art.autoSize = art.option.autoSize;
                    await screenfull.exit();
                    removeClass($player, 'art-fullscreen');
                    art.emit('resize');
                    notice.show = '';
                }
            },
        });
    };

    const webkitScreenfull = (art) => {
        def(art, 'fullscreen', {
            get() {
                return $video.webkitDisplayingFullscreen;
            },
            set(value) {
                if (value) {
                    art.state = 'fullscreen';
                    $video.webkitEnterFullscreen();
                    art.emit('fullscreen', true);
                    notice.show = '';
                } else {
                    $video.webkitExitFullscreen();
                    art.emit('fullscreen', false);
                    notice.show = '';
                }
            },
        });
    };

    art.once('video:loadedmetadata', () => {
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
