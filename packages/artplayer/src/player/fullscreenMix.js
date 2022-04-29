import screenfull from 'screenfull';
import { addClass, removeClass, def, get } from '../utils';

const nativeScreenfull = (art) => {
    const {
        notice,
        template: { $player },
    } = art;

    screenfull.on('change', () => art.emit('fullscreen', screenfull.isFullscreen));

    def(art, 'fullscreen', {
        get() {
            return screenfull.isFullscreen;
        },
        set(value) {
            if (value) {
                art.normalSize = 'fullscreen';
                art.aspectRatioReset = true;
                art.autoSize = false;
                screenfull.request($player).then(() => {
                    addClass($player, 'art-fullscreen');
                    art.emit('resize');
                    art.emit('fullscreen', true);
                    notice.show = '';
                });
            } else {
                art.aspectRatioReset = true;
                art.autoSize = art.option.autoSize;
                screenfull.exit().then(() => {
                    removeClass($player, 'art-fullscreen');
                    art.emit('resize');
                    art.emit('fullscreen');
                    notice.show = '';
                });
            }
        },
    });
};

const webkitScreenfull = (art) => {
    const {
        notice,
        template: { $video },
    } = art;

    def(art, 'fullscreen', {
        get() {
            return $video.webkitDisplayingFullscreen;
        },
        set(value) {
            if (value) {
                art.normalSize = 'fullscreen';
                $video.webkitEnterFullscreen();
                art.emit('fullscreen', true);
                notice.show = '';
            } else {
                $video.webkitExitFullscreen();
                art.emit('fullscreen');
                notice.show = '';
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
