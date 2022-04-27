import { hasClass, addClass, removeClass } from '../utils';

export default function fastForward(art) {
    const {
        events: { proxy },
        template: { $player, $video },
    } = art;

    let isPress = false;
    let timer = null;

    const onStart = () => {
        if (art.playing) {
            timer = setTimeout(() => {
                isPress = true;
                art.playbackRate = 3;
                addClass($player, 'art-fast-forward');
            }, 1000);
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
