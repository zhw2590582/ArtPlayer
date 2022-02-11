import { def } from '../utils';

export default function switchMix(art) {
    const { i18n, option, notice } = art;

    function switchUrl(url, name, currentTime) {
        return new Promise((resolve) => {
            if (url === art.url) return resolve(url);
            URL.revokeObjectURL(art.url);
            art.url = url;
            art.once('video:canplay', () => {
                art.playbackRate = false;
                art.aspectRatio = false;
                art.flip = 'normal';
                art.autoSize = option.autoSize;
                art.currentTime = currentTime;
                art.notice.show = '';
                if (art.playing) {
                    art.play();
                }
                if (name) {
                    notice.show = `${i18n.get('Switch Video')}: ${name}`;
                }
                art.emit('switch', url);
                resolve(url);
            });
        });
    }

    def(art, 'switchQuality', {
        value: (url, name) => {
            return switchUrl(url, name, art.currentTime);
        },
    });

    def(art, 'switchUrl', {
        value: (url, name) => {
            return switchUrl(url, name, 0);
        },
    });
}
