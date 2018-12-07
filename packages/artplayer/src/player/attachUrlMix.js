import { getExt, sleep } from '../utils';

export default function attachUrlMix(art, player) {
    const {
        option: { type, customType },
        template: { $video },
    } = art;

    Object.defineProperty(player, 'returnUrl', {
        writable: true,
        value: url => url,
    });

    Object.defineProperty(player, 'attachUrl', {
        value: url => {
            function attachUrl(videoUrl) {
                const typeName = type || getExt(videoUrl);
                const typeCallback = customType[typeName];
                return sleep().then(() => {
                    if (typeName && typeCallback) {
                        art.emit('beforeCustomType', typeName);
                        typeCallback($video, player.returnUrl(videoUrl), art);
                        art.emit('afterCustomType', typeName);
                    } else {
                        art.emit('beforeAttachUrl', videoUrl);
                        $video.src = player.returnUrl(videoUrl);
                        art.emit('afterAttachUrl', $video.src);
                    }
                });                
            }

            if (typeof url === 'function') {
                return url().then(videoUrl => {
                    art.loading.show();
                    return attachUrl(videoUrl);
                });
            }

            return attachUrl(url);
        },
    });
}
