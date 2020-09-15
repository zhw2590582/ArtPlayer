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
            if (deg === false) deg = 0;

            const degList = [-270, -180, -90, 0, 90, 180, 270];
            errorHandle(degList.includes(deg), `'rotate' only accept ${degList.toString()} as parameters`);

            if (!deg) {
                setStyle($video, 'width', null);
                setStyle($video, 'height', null);
                setStyle($video, 'padding', null);
                delete $player.dataset.rotate;
            } else {
                const { videoWidth, videoHeight } = $video;
                const { clientWidth, clientHeight } = $player;
                const degFormat = deg < 0 ? deg + 360 : deg;
                $player.dataset.rotate = deg;
            }

            notice.show = `${i18n.get('Rotate')}: ${deg}°`;
            art.emit('rotate', deg);
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
