import { setStyle, def, clamp } from '../utils';

export default function aspectRatioMix(art) {
    const {
        i18n,
        notice,
        template: { $video, $player },
    } = art;

    def(art, 'aspectRatio', {
        get() {
            return $player.dataset.aspectRatio || 'default';
        },
        set(ratio) {
            if (!ratio) ratio = 'default';
            if (ratio === 'default') {
                setStyle($video, 'width', null);
                setStyle($video, 'height', null);
                setStyle($video, 'padding', null);
                delete $player.dataset.aspectRatio;
            } else {
                const ratioArray = ratio.split(':').map(Number);
                const { clientWidth, clientHeight } = $player;
                const playerRatio = clientWidth / clientHeight;
                const setupRatio = ratioArray[0] / ratioArray[1];

                if (playerRatio > setupRatio) {
                    const width = clamp(setupRatio * clientHeight, 0, clientWidth);
                    setStyle($video, 'width', `${width}px`);
                    setStyle($video, 'height', '100%');
                    setStyle($video, 'padding', `0 ${(clientWidth - width) / 2}px`);
                } else {
                    const height = clamp(clientWidth / setupRatio, 0, clientHeight);
                    setStyle($video, 'width', '100%');
                    setStyle($video, 'height', `${height}px`);
                    setStyle($video, 'padding', `${(clientHeight - height) / 2}px 0`);
                }

                $player.dataset.aspectRatio = ratio;
            }

            notice.show = `${i18n.get('Aspect Ratio')}: ${ratio === 'default' ? i18n.get('Default') : ratio}`;
            art.emit('aspectRatio', ratio);
        },
    });
}
