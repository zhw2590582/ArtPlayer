import { setStyle, errorHandle, def } from '../utils';

export default function aspectRatioMix(art) {
    const {
        template: { $video, $player },
        i18n,
        notice,
    } = art;

    def(art, 'aspectRatio', {
        get() {
            return $player.dataset.aspectRatio || 'default';
        },
        set(ratio) {
            if (!ratio) ratio = 'default';
            const ratioList = ['default', '4:3', '16:9'];
            errorHandle(ratioList.includes(ratio), `'aspectRatio' only accept ${ratioList.toString()} as parameters`);

            if (ratio === 'default') {
                setStyle($video, 'width', null);
                setStyle($video, 'height', null);
                setStyle($video, 'padding', null);
                delete $player.dataset.aspectRatio;
            } else {
                const ratioArray = ratio.split(':').map(Number);
                const { videoWidth, videoHeight } = $video;
                const { clientWidth, clientHeight } = $player;
                const videoRatio = videoWidth / videoHeight;
                const setupRatio = ratioArray[0] / ratioArray[1];
                if (videoRatio > setupRatio) {
                    const percentage = (setupRatio * videoHeight) / videoWidth;
                    setStyle($video, 'width', `${percentage * 100}%`);
                    setStyle($video, 'height', '100%');
                    setStyle($video, 'padding', `0 ${(clientWidth - clientWidth * percentage) / 2}px`);
                } else {
                    const percentage = videoWidth / setupRatio / videoHeight;
                    setStyle($video, 'width', '100%');
                    setStyle($video, 'height', `${percentage * 100}%`);
                    setStyle($video, 'padding', `${(clientHeight - clientHeight * percentage) / 2}px 0`);
                }
                $player.dataset.aspectRatio = ratio;
            }

            notice.show = `${i18n.get('Aspect Ratio')}: ${ratio === 'default' ? i18n.get('Default') : ratio}`;
            art.emit('aspectRatio', ratio);
        },
    });

    def(art, 'aspectRatioReset', {
        set(value) {
            if (value) {
                const { aspectRatio } = art;
                art.aspectRatio = aspectRatio;
            }
        },
    });
}
