export default function switchMix(art, player) {
    const { i18n, notice, option } = art;

    Object.defineProperty(player, 'switchQuality', {
        value: (url, name = 'unknown') => {
            if (url !== option.url) {
                const { currentTime, playing } = player;
                return player.attachUrl(url).then(() => {
                    option.url = url;
                    player.playbackRate = false;
                    player.aspectRatio = false;
                    art.once('video:canplay', () => {
                        player.currentTime = currentTime;
                    });
                    if (playing) {
                        player.play = true;
                    }
                    notice.show(`${i18n.get('Switch video')}: ${name}`);
                    art.emit('switch', url);
                });
            }
            return null;
        },
    });

    Object.defineProperty(player, 'switchUrl', {
        value: (url, name = 'unknown') => {
            if (url !== option.url) {
                const { playing } = player;
                return player.attachUrl(url).then(() => {
                    option.url = url;
                    player.playbackRate = false;
                    player.aspectRatio = false;
                    player.currentTime = 0;
                    if (playing) {
                        player.play = true;
                    }
                    notice.show(`${i18n.get('Switch video')}: ${name}`);
                    art.emit('switch', url);
                });
            }
            return null;
        },
    });
}
