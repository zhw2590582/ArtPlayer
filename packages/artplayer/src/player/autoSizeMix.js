import { setStyle, floatCeil } from '../utils';

export default function resizeMix(art, player) {
    const {
        template: { $container, $player, $video },
    } = art;

    Object.defineProperty(player, 'autoSize', {
        get() {
            return $container.classList.contains('artplayer-auto-size');
        },
        set(value) {
            if (value) {
                const { videoWidth, videoHeight } = $video;
                const { width, height } = $container.getBoundingClientRect();
                const videoRatio = videoWidth / videoHeight;
                const containerRatio = width / height;
                $container.classList.add('artplayer-auto-size');
                if (containerRatio > videoRatio) {
                    const percentage = floatCeil(((height * videoRatio) / width) * 100, 1);
                    setStyle($player, 'width', `${percentage}%`);
                    setStyle($player, 'height', '100%');
                } else {
                    const percentage = floatCeil((width / videoRatio / height) * 100, 1);
                    setStyle($player, 'width', '100%');
                    setStyle($player, 'height', `${percentage}%`);
                }
                art.emit('autoSizeChange');
            } else {
                $container.classList.remove('artplayer-auto-size');
                setStyle($player, 'width', null);
                setStyle($player, 'height', null);
                art.emit('autoSizeRemove');
            }
        },
    });
}
