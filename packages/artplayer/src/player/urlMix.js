import { getExt, def, sleep } from '../utils';

export default function urlMix(art, player) {
    const {
        option,
        template: { $video },
    } = art;

    def(player, 'url', {
        get() {
            return $video.currentSrc;
        },
        set(url) {
            const typeName = option.type || getExt(url);
            const typeCallback = option.customType[typeName];
            if (typeName && typeCallback) {
                sleep().then(() => {
                    art.loading.show = true;
                    typeCallback.call(art, $video, url, art);
                });
            } else {
                $video.src = url;
                art.option.url = url;
                art.emit('url', url);
            }
        },
    });
}
