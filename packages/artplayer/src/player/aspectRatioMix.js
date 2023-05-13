import { setStyle, def } from '../utils';

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
                setStyle($video, 'margin', null);
                delete $player.dataset.aspectRatio;
            } else {
                const ratioArray = ratio.split(':').map(Number);
                const { clientWidth, clientHeight } = $player;
                const playerRatio = clientWidth / clientHeight;
                const setupRatio = ratioArray[0] / ratioArray[1];

                if (playerRatio > setupRatio) {
                    setStyle($video, 'width', `${setupRatio * clientHeight}px`);
                    setStyle($video, 'height', '100%');
                    setStyle($video, 'margin', '0 auto');
                } else {
                    setStyle($video, 'width', '100%');
                    setStyle($video, 'height', `${clientWidth / setupRatio}px`);
                    setStyle($video, 'margin', 'auto 0');
                }

                $player.dataset.aspectRatio = ratio;
            }

            notice.show = `${i18n.get('Aspect Ratio')}: ${ratio === 'default' ? i18n.get('Default') : ratio}`;
            art.emit('aspectRatio', ratio);
        },
    });
}
