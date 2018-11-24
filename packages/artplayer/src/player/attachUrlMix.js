import { getExt } from '../utils';

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
            const typeName = type || getExt(url);
            const typeCallback = customType[typeName];
            if (typeName && typeCallback) {
                art.emit('beforeCustomType', typeName);
                typeCallback($video, player.returnUrl(url), art);
                art.emit('afterCustomType', typeName);
            } else {
                art.emit('beforeAttachUrl', url);
                $video.src = player.returnUrl(url);
                art.emit('afterAttachUrl', $video.src);
            }
        },
    });
}
