import { setStyle, errorHandle } from '../utils';

export default function aspectRatioMix(art, player) {
    const {
        refs: { $video, $player },
        i18n,
        notice,
    } = art;

    Object.defineProperty(player, 'aspectRatioState', {
        get: () => $player.dataset.aspectRatio || '',
    });

    Object.defineProperty(player, 'aspectRatio', {
        value: ratio => {
            const ratioList = ['default', '4:3', '16:9'];
            errorHandle(ratioList.includes(ratio), `'aspectRatio' only accept ${ratioList.toString()} as parameters`);
            
            if (ratio === $player.dataset.aspectRatio) {
                return;
            }

            if (ratio === 'default') {
                player.aspectRatioRemove();
            } else {
                const ratioArray = ratio.split(':');
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
            }

            $player.dataset.aspectRatio = ratio;
            notice.show(`${i18n.get('Aspect ratio')}: ${ratio}`);
            art.emit('aspectRatioChange', ratio);
        },
    });

    Object.defineProperty(player, 'aspectRatioRemove', {
        value: () => {
            if (player.aspectRatioState) {
                setStyle($video, 'width', null);
                setStyle($video, 'height', null);
                setStyle($video, 'padding', null);
                delete $player.dataset.aspectRatio;
                art.emit('aspectRatioRemove');
            }
        },
    });

    Object.defineProperty(player, 'aspectRatioReset', {
        value: () => {
            const { aspectRatio } = $player.dataset;
            if (aspectRatio) {
                player.aspectRatio(aspectRatio);
                art.emit('aspectRatioReset');
            }
        },
    });
}
