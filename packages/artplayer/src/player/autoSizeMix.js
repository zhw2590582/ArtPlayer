import { setStyle, addClass, removeClass, hasClass, def } from '../utils';

export default function resizeMix(art) {
    const { $container, $player, $video } = art.template;

    def(art, 'autoSize', {
        get() {
            return hasClass($container, 'art-auto-size');
        },
        set(value) {
            if (value) {
                const { videoWidth, videoHeight } = $video;
                const { width, height } = $container.getBoundingClientRect();
                const videoRatio = videoWidth / videoHeight;
                const containerRatio = width / height;
                addClass($container, 'art-auto-size');
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
            } else {
                removeClass($container, 'art-auto-size');
                setStyle($player, 'width', null);
                setStyle($player, 'height', null);
                art.emit('autoSize');
            }
        },
    });
}
