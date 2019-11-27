import { def } from '../utils';

export default function switchMix(art, player) {
    const { i18n, notice, option } = art;

    function switchUrl(url, name, currentTime) {
        if (url === player.url) return Promise.resolve(url);
        URL.revokeObjectURL(player.url);
        return player.attachUrl(url).then(() => {
            option.url = url;
            player.playbackRate = false;
            player.aspectRatio = false;
            art.once('video:canplay', () => {
                player.currentTime = currentTime;
            });
            if (player.playing) {
                player.play = true;
            }
            if (name) {
                notice.show = `${i18n.get('Switch video')}: ${name}`;
            }
            art.emit('switch', url);
        });
    }

    def(player, 'switchQuality', {
        value: (url, name) => {
            return switchUrl(url, name, player.currentTime);
        },
    });

    def(player, 'switchUrl', {
        value: (url, name) => {
            return switchUrl(url, name, 0);
        },
    });
}
