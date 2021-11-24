import { def } from '../utils';

export default function switchMix(art, player) {
    const { i18n, notice } = art;

    function switchUrl(url, name, currentTime) {
        if (url === player.url) return;
        URL.revokeObjectURL(player.url);
        const { playing } = player;
        player.url = url;
        art.once('video:canplay', () => {
            player.playbackRate = false;
            player.aspectRatio = false;
            player.flip = 'normal';
            player.autoSize = true;
            player.currentTime = currentTime;
            if (playing) {
                player.play();
            }
        });
        if (name) {
            notice.show = `${i18n.get('Switch video')}: ${name}`;
        }
        art.emit('switch', url);
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
