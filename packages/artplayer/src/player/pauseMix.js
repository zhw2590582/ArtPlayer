export default function pauseMin(art, player) {
    const {
        template: { $video },
        i18n,
        notice,
    } = art;

    Object.defineProperty(player, 'pause', {
        get() {
            return $video.paused;
        },
        set(value) {
            if (value) {
                $video.pause();
                notice.show(i18n.get('Pause'));
                art.emit('pause');
            } else {
                player.play = true;
            }
        },
    });
}
