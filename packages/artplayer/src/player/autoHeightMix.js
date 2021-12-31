import { setStyle, hasClass, addClass, removeClass, def } from '../utils';

export default function autoHeightMix(art, player) {
    const { $container, $video } = art.template;

    def(player, 'autoHeight', {
        get() {
            return hasClass($container, 'art-auto-height');
        },
        set(value) {
            if (value) {
                const { clientWidth } = $container;
                const { videoHeight, videoWidth } = $video;
                const height = videoHeight * (clientWidth / videoWidth) + 'px';
                setStyle($container, 'height', height);
                addClass($container, 'art-auto-height');
                art.emit('autoHeight', height);
            } else {
                setStyle($container, 'height', null);
                removeClass($container, 'art-auto-size');
                art.emit('autoHeight');
            }
        },
    });
}
