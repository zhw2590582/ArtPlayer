export default function switchMix(art, player) {
    const {
        refs: { $video },
        i18n,
        notice,
        option,
    } = art;

    Object.defineProperty(player, 'switchQuality', {
        value: (url, name = 'unknown') => {
            if (url !== option.url) {
                const { isPlaying } = art;
                const { currentTime } = player;
                art.emit('beforeMountUrl', url);
                $video.src = player.mountUrl(url);
                art.emit('afterMountUrl', url);
                option.url = url;
                player.playbackRateRemove();
                player.aspectRatioRemove();
                player.seek(currentTime);
                if (isPlaying) {
                    player.play();
                }
                notice.show(`${i18n.get('Switch video')}: ${name}`);
                art.emit('switch', url);
            }
        },
    });
}
