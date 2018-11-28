export default function switchMix(art, player) {
    const {
        i18n,
        notice,
        option,
    } = art;

    Object.defineProperty(player, 'switchQuality', {
        value: (url, name = 'unknown') => {
            if (url !== option.url) {
                const { isPlaying } = art;
                const { currentTime } = player;
                player.attachUrl(url).then(() => {
                    option.url = url;
                    player.playbackRateRemove();
                    player.aspectRatioRemove();
                    player.seek(currentTime);
                    if (isPlaying) {
                        player.play();
                    }
                    notice.show(`${i18n.get('Switch video')}: ${name}`);
                    art.emit('switch', url);
                });
            }
        },
    });
}
