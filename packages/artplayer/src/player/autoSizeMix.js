import { setStyle, def, getRect } from '../utils';

export default function autoSizeMix(art) {
    const { $container, $player, $video } = art.template;

    def(art, 'autoSize', {
        value() {
            const { videoWidth, videoHeight } = $video;
            const { width, height } = getRect($container);
            const videoRatio = videoWidth / videoHeight;
            const containerRatio = width / height;
            if (containerRatio > videoRatio) {
                const percentage = ((height * videoRatio) / width) * 100;
                setStyle($player, 'width', `${percentage}%`);
                setStyle($player, 'height', '100%');
            } else {
                const percentage = (width / videoRatio / height) * 100;
                setStyle($player, 'width', '100%');
                setStyle($player, 'height', `${percentage}%`);
            }
            art.emit('autoSize', {
                width: art.width,
                height: art.height,
            });
        },
    });
}
