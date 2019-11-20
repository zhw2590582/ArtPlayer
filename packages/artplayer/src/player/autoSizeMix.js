import { setStyle, addClass, removeClass, hasClass } from '../utils';

export default function resizeMix(art, player) {
    const {
        template: { $container, $player, $video },
    } = art;

    Object.defineProperty(player, 'autoSize', {
        get() {
            return hasClass($container, 'artplayer-auto-size');
        },
        set(value) {
            if (value) {
                const { videoWidth, videoHeight } = $video;
                const { width, height } = $container.getBoundingClientRect();
                const videoRatio = videoWidth / videoHeight;
                const containerRatio = width / height;
                addClass($container, 'artplayer-auto-size');
                if (containerRatio > videoRatio) {
                    const percentage = ((height * videoRatio) / width) * 100;
                    setStyle($player, 'width', `${percentage}%`);
                    setStyle($player, 'height', '100%');
                } else {
                    const percentage = (width / videoRatio / height) * 100;
                    setStyle($player, 'width', '100%');
                    setStyle($player, 'height', `${percentage}%`);
                }
                art.emit('autoSizeChange', {
                    width: player.width,
                    height: player.height,
                });
            } else {
                removeClass($container, 'artplayer-auto-size');
                setStyle($player, 'width', null);
                setStyle($player, 'height', null);
                art.emit('autoSizeRemove');
            }
        },
    });
}
