export default function attachUrlMix(art, player) {
    const {
        option: { type, customType },
        refs: { $video },
    } = art;

    Object.defineProperty(player, 'returnUrl', {
        writable: true,
        value: url => url,
    });

    Object.defineProperty(player, 'attachUrl', {
        value: url => {
            const typeCallback = customType[type];
            if (type && typeCallback) {
                art.emit('beforeCustomType', url);
                typeCallback($video, player.returnUrl(url), art);
                art.emit('afterCustomType', url);
            } else {
                art.emit('beforeAttachUrl', url);
                $video.src = player.returnUrl(url);
                art.emit('afterAttachUrl', url);
            }
        },
    });
}
