import { setStyle, hasClass, addClass, removeClass, def } from '../utils';

export default function autoHeightMix(art) {
    const {
        option,
        template: { $container, $video },
    } = art;

    const heightCache = $container.style.height;

    def(art, 'autoHeight', {
        get() {
            return hasClass($container, 'art-auto-height');
        },
        set(value) {
            if (value) {
                const { clientWidth } = $container;
                const { videoHeight, videoWidth } = $video;
                const height = videoHeight * (clientWidth / videoWidth);
                setStyle($container, 'height', height + 'px');
                addClass($container, 'art-auto-height');
                art.autoSize = option.autoSize;
                art.emit('autoHeight', height);
            } else {
                setStyle($container, 'height', heightCache);
                removeClass($container, 'art-auto-height');
                art.autoSize = option.autoSize;
                art.emit('autoHeight');
            }
        },
    });
}
