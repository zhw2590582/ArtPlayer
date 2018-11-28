export default function pauseMin(art, player) {
    const {
        template: { $video },
        i18n,
        notice,
    } = art;

    Object.defineProperty(player, 'pause', {
        value: () => {
            $video.pause();
            notice.show(i18n.get('Pause'));
            art.emit('pause');
        },
    });
}
