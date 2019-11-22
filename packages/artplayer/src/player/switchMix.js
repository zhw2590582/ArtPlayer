export default function switchMix(art, player) {
    const { i18n, notice, option } = art;

    Object.defineProperty(player, 'switchQuality', {
        value: (url, name = 'unknown') => {
            if (url !== player.url) {
                URL.revokeObjectURL(player.url);
                const { currentTime, playing } = player;
                return player.attachUrl(url).then(() => {
                    option.url = url;
                    player.playbackRate = false;
                    player.aspectRatio = false;
                    art.on('ready', () => {
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
            if (url !== player.url) {
                URL.revokeObjectURL(player.url);
                const { playing } = player;
                return player.attachUrl(url).then(() => {
                    option.url = url;
                    player.playbackRate = false;
                    player.aspectRatio = false;
                    art.on('ready', () => {
                        player.currentTime = 0;
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
}
