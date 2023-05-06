import { setStyle, def } from '../utils';

export default function autoHeightMix(art) {
    const {
        template: { $container, $video },
    } = art;

    def(art, 'autoHeight', {
        value() {
            const { clientWidth } = $container;
            const { videoHeight, videoWidth } = $video;
            const height = videoHeight * (clientWidth / videoWidth);
            setStyle($container, 'height', height + 'px');
            art.emit('autoHeight', height);
        },
    });
}
