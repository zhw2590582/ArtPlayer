import { setStyle, hasClass, addClass, removeClass, def } from '../utils';

export default function autoHeightMix(art, player) {
    const { $container, $video } = art.template;
    const heightCache = $container.style.height;

    def(player, 'autoHeight', {
        get() {
            return hasClass($container, 'art-auto-height');
        },
        set(value) {
            if (value) {
                const { clientWidth } = $container;
                const { videoHeight, videoWidth } = $video;
                const height = videoHeight * (clientWidth / videoWidth);
                if (height) {
                    setStyle($container, 'height', height + 'px');
                    addClass($container, 'art-auto-height');
                    art.emit('autoHeight', height);
                }
            } else {
                setStyle($container, 'height', heightCache);
                removeClass($container, 'art-auto-height');
                art.emit('autoHeight');
            }
        },
    });
}
