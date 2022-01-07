import { setStyle, errorHandle, def } from '../utils';

export default function rotateMix(art) {
    const {
        template: { $video, $player },
        i18n,
        notice,
    } = art;

    def(art, 'rotate', {
        get: () => Number($player.dataset.rotate) || 0,
        set: (deg) => {
            if (!deg) deg = 0;

            const degList = [-270, -180, -90, 0, 90, 180, 270];
            errorHandle(degList.includes(deg), `'rotate' only accept ${degList.toString()} as parameters`);

            if (deg === 0) {
                delete $player.dataset.rotate;
                setStyle($video, 'transform', null);
            } else {
                art.flip = false;
                art.autoSize = true;
                $player.dataset.rotate = deg;

                const getScaleValue = () => {
                    const { videoWidth, videoHeight } = $video;
                    return videoWidth > videoHeight ? videoHeight / videoWidth : videoWidth / videoHeight;
                };

                let degValue = 0;
                let scaleValue = 1;
                switch (deg) {
                    case -270:
                        degValue = 90;
                        scaleValue = getScaleValue();
                        break;
                    case -180:
                        degValue = 180;
                        break;
                    case -90:
                        degValue = 270;
                        scaleValue = getScaleValue();
                        break;
                    case 90:
                        degValue = 90;
                        scaleValue = getScaleValue();
                        break;
                    case 180:
                        degValue = 180;
                        break;
                    case 270:
                        degValue = 270;
                        scaleValue = getScaleValue();
                        break;
                    default:
                        break;
                }

                setStyle($video, 'transform', `rotate(${degValue}deg) scale(${scaleValue})`);
            }

            notice.show = `${i18n.get('Rotate')}: ${deg}°`;
            art.emit('rotate', deg);
        },
    });

    def(art, 'rotateReset', {
        set(value) {
            if (value && art.rotate) {
                const { rotate } = art;
                art.rotate = rotate;
            }
        },
    });
}
