import { hasClass, addClass, removeClass } from '../utils';

export default function fastForward(art) {
    const {
        layers,
        icons,
        events: { proxy },
        template: { $player },
    } = art;

    layers.add({
        name: 'fast-forward',
        html: icons.fastForward,
        mounted($layer) {
            let isPress = false;

            proxy($layer, 'touchstart', () => {
                isPress = true;
                art.playbackRate = 3;
                addClass($player, 'art-fast-forward');
            });

            proxy(document, 'touchend', () => {
                if (isPress) {
                    isPress = false;
                    art.playbackRate = 1;
                    removeClass($player, 'art-fast-forward');
                }
            });
        },
    });

    return {
        name: 'fastForward',
        get state() {
            return hasClass($player, 'art-fast-forward');
        },
    };
}
