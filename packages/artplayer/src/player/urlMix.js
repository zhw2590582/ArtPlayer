import { getExt, def, sleep } from '../utils';

export default function urlMix(art) {
    const {
        option,
        template: { $video },
    } = art;

    def(art, 'url', {
        get() {
            return $video.src;
        },
        async set(url) {
            if (url) {
                const oldUrl = art.url;
                const typeName = option.type || getExt(url);
                const typeCallback = option.customType[typeName];

                if (typeName && typeCallback) {
                    await sleep();
                    art.loading.show = true;
                    typeCallback.call(art, $video, url, art);
                } else {
                    $video.src = url;
                }

                if (oldUrl !== art.url) {
                    art.option.url = url;
                    if (art.isReady && oldUrl) {
                        art.once('video:canplay', () => {
                            art.emit('restart', url);
                        });
                    }
                }
            } else {
                await sleep();
                art.loading.show = true;
            }
        },
    });
}
