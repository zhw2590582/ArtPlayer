import { getExt, sleep } from '../utils';

export default function attachUrlMix(art, player) {
    const {
        option: { type, customType },
        template: { $video },
    } = art;

    Object.defineProperty(player, 'attachUrl', {
        value: url => sleep().then(() => {
            function attachUrl(videoUrl) {
                const typeName = type || getExt(videoUrl);
                const typeCallback = customType[typeName];
                if (typeName && typeCallback) {
                    art.emit('beforeCustomType', typeName);
                    typeCallback.call(art, $video, videoUrl, art);
                    art.emit('afterCustomType', typeName);
                } else {
                    art.emit('beforeAttachUrl');
                    $video.src = videoUrl;
                    art.emit('afterAttachUrl');
                }
                return Promise.resolve(videoUrl);
            }

            if (typeof url === 'function') {
                return url.call(art).then(videoUrl => {
                    art.loading.show();
                    return attachUrl(videoUrl);
                });
            }

            return attachUrl(url);
        }),
    });
}
