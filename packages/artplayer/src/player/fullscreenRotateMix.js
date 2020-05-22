import { addClass, removeClass, hasClass, def, setStyle } from '../utils';

export default function fullscreenRotateMix(art, player) {
    const { $container, $player } = art.template;

    def(player, 'fullscreenRotate', {
        get() {
            return hasClass($container, 'art-fullscreen-rotate');
        },
        set: (value) => {
            if (value) {
                addClass($container, 'art-fullscreen-rotate');
                player.autoSize = true;
                const { clientHeight: bodyHeight, clientWidth: bodyWidth } = document.body;
                const { clientHeight: playerHeight, clientWidth: playerWidth } = $player;
                const bodyRatio = bodyWidth / bodyHeight;
                const videoRatio = playerWidth / playerHeight;
                const needSpin = bodyRatio < videoRatio;
                if (needSpin) {
                    const scale = Math.min(bodyHeight / playerWidth, bodyWidth / playerHeight).toFixed(2);
                    setStyle($player, 'transform', `rotate(90deg) scale(${scale},${scale})`);
                    art.emit('resize');
                    art.emit('fullscreenRotate', true);
                }
            } else {
                removeClass($container, 'art-fullscreen-rotate');
                player.autoSize = art.option.autoSize;
                setStyle($player, 'transform', null);
                art.emit('resize');
                art.emit('fullscreenRotate');
            }
        },
    });

    def(player, 'fullscreenRotateToggle', {
        set(value) {
            if (value) {
                player.fullscreenRotate = !player.fullscreenRotate;
            }
        },
    });
}
