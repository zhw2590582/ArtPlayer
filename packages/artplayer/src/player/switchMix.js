import { def } from '../utils';

export default function switchMix(art) {
    function switchUrl(url, currentTime) {
        return new Promise((resolve, reject) => {
            if (url === art.url) return;
            const { playing, aspectRatio, playbackRate, option } = art;

            art.pause();
            art.url = url;
            art.once('video:error', reject);
            art.once('video:canplay', () => {
                art.playbackRate = playbackRate;
                art.aspectRatio = aspectRatio;
                art.currentTime = currentTime;
                art.notice.show = '';

                if (option.autoSize) {
                    art.autoSize = true;
                }

                if (playing) {
                    art.play();
                }

                resolve();
            });
        });
    }

    def(art, 'switchQuality', {
        value: (url) => {
            return switchUrl(url, art.currentTime);
        },
    });

    def(art, 'switchUrl', {
        value: (url) => {
            return switchUrl(url, 0);
        },
    });

    def(art, 'switch', {
        set: art.switchUrl,
    });
}
