import { setStyle, addClass, removeClass, hasClass } from '../utils';

export default function autoOrientation(art) {
    const {
        option,
        constructor,
        template: { $player, $video },
    } = art;

    art.on('fullscreenWeb', (state) => {
        if (state) {
            const { videoWidth, videoHeight } = $video;
            const { clientWidth: viewWidth, clientHeight: viewHeight } = document.documentElement;
            if (
                (videoWidth > videoHeight && viewWidth < viewHeight) ||
                (videoWidth < videoHeight && viewWidth > viewHeight)
            ) {
                // There is a conflict with the fullscreen event, and it is changed to asynchronous execution
                setTimeout(() => {
                    setStyle($player, 'width', `${viewHeight}px`);
                    setStyle($player, 'height', `${viewWidth}px`);
                    setStyle($player, 'transform-origin', '0 0');
                    setStyle($player, 'transform', `rotate(90deg) translate(0, -${viewWidth}px)`);
                    addClass($player, 'art-auto-orientation');
                }, constructor.MOBILE_AUTO_ORIENTATION_TIME);
            }
        } else {
            if (hasClass($player, 'art-auto-orientation')) {
                setStyle($player, 'width', null);
                setStyle($player, 'height', null);
                setStyle($player, 'transform', null);
                setStyle($player, 'transform-origin', null);
                removeClass($player, 'art-auto-orientation');
                art.aspectRatioReset = true;
                art.autoSize = option.autoSize;
                art.notice.show = '';
            }
        }
    });

    art.on('fullscreen', (state) => {
        const lastOrientation = screen.orientation.type;
        if (state) {
            const { videoWidth, videoHeight } = $video;
            const { clientWidth: viewWidth, clientHeight: viewHeight } = document.documentElement;
            if (
                (videoWidth > videoHeight && viewWidth < viewHeight) ||
                (videoWidth < videoHeight && viewWidth > viewHeight)
            ) {
                const oppositeOrientation = lastOrientation.startsWith('portrait') ? 'landscape' : 'portrait';
                screen.orientation.lock(oppositeOrientation).then(() => {
                    addClass($player, 'art-auto-orientation-fullscreen');
                });
            }
        } else {
            if (hasClass($player, 'art-auto-orientation-fullscreen')) {
                screen.orientation.lock(lastOrientation).then(() => {
                    removeClass($player, 'art-auto-orientation-fullscreen');
                });
            }
        }
    });

    return {
        name: 'autoOrientation',
        get state() {
            return hasClass($player, 'art-auto-orientation');
        },
    };
}
