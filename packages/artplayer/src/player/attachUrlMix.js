import { getExt, sleep, errorHandle } from '../utils';

export default function attachUrlMix(art, player) {
    const {
        option: { type, customType },
        template: { $video },
    } = art;

    Object.defineProperty(player, 'attachUrl', {
        value: url =>
            sleep().then(() => {
                function attachUrl(videoUrl) {
                    const typeName = type || getExt(videoUrl);
                    const typeCallback = customType[typeName];
                    if (typeName && typeCallback) {
                        art.loading.show();
                        art.emit('beforeCustomType', typeName);
                        typeCallback.call(art, $video, videoUrl, art);
                        art.emit('afterCustomType', typeName);
                    } else {
                        art.emit('beforeAttachUrl', videoUrl);
                        $video.src = videoUrl;
                        art.emit('afterAttachUrl', videoUrl);
                    }
                    return Promise.resolve(videoUrl);
                }

                if (typeof url === 'function') {
                    const result = url.call(art);
                    errorHandle(
                        typeof result.then === 'function',
                        'If url is a function, it needs to return a promise.',
                    );
                    return result.then(videoUrl => {
                        art.loading.show();
                        return attachUrl(videoUrl);
                    });
                }

                return attachUrl(url);
            }),
    });
}
