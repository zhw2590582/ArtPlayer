import { hasClass, addClass, removeClass } from '../utils';

export default function fastForward(art) {
    const {
        constructor,
        events: { proxy },
        template: { $player, $video },
    } = art;

    let timer = null;
    let isPress = false;

    const onStart = (event) => {
        if (event.touches.length === 1 && art.playing && !art.isLock) {
            timer = setTimeout(() => {
                isPress = true;
                art.playbackRate = constructor.FAST_FORWARD_VALUE;
                addClass($player, 'art-fast-forward');
            }, constructor.FAST_FORWARD_TIME);
        }
    };

    const onStop = () => {
        clearTimeout(timer);
        if (isPress) {
            isPress = false;
            art.playbackRate = 1;
            removeClass($player, 'art-fast-forward');
        }
    };

    proxy($video, 'touchstart', onStart);
    proxy(document, 'touchmove', onStop);
    proxy(document, 'touchend', onStop);

    return {
        name: 'fastForward',
        get state() {
            return hasClass($player, 'art-fast-forward');
        },
    };
}
