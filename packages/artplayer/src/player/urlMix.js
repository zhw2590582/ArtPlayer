import { getExt, def, sleep } from '../utils';

export default function urlMix(art, player) {
    const {
        option: { type, customType },
        template: { $video },
    } = art;

    def(player, 'url', {
        get() {
            return $video.src;
        },
        set(url) {
            const typeName = type || getExt(url);
            const typeCallback = customType[typeName];
            if (typeName && typeCallback) {
                sleep().then(() => {
                    art.loading.show = true;
                    typeCallback.call(art, $video, url, art);
                    art.emit('customType', typeName);
                });
            } else {
                $video.src = url;
                art.option.url = url;
                art.emit('urlChange', url);
            }
        },
    });
}
