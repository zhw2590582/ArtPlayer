import { setStyle, errorHandle, def } from '../utils';

export default function rotateMix(art, player) {
    const {
        template: { $video, $player },
        i18n,
        notice,
    } = art;

    def(player, 'rotate', {
        get: () => Number($player.dataset.rotate) || 0,
        set: (deg) => {
            const degList = [-270, -180, -90, 0, 90, 180, 270];
            errorHandle(degList.includes(deg), `'rotate' only accept ${degList.toString()} as parameters`);
            player.flip = false;
            player.aspectRatio = false;
            notice.show = `${i18n.get('Rotate')}: ${deg}°`;

            if (deg) {
                const { videoWidth, videoHeight } = $video;
                const { clientWidth, clientHeight } = $player;
                const degFormat = deg < 0 ? deg + 360 : deg;

                $player.dataset.rotate = deg;
                art.emit('rotate', deg);
            } else {
                setStyle($video, 'width', null);
                setStyle($video, 'height', null);
                setStyle($video, 'padding', null);
                delete $player.dataset.rotate;
                art.emit('rotate', 0);
            }
        },
    });

    def(player, 'rotateReset', {
        set(value) {
            if (value && player.rotate) {
                const { rotate } = player;
                player.rotate = rotate;
            }
        },
    });
}
