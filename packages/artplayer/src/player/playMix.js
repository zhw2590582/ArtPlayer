import { def } from '../utils';

export default function playMix(art) {
    const {
        i18n,
        notice,
        option,
        constructor: { instances },
        template: { $video },
    } = art;

    def(art, 'play', {
        value() {
            const promise = $video.play();

            if (promise && promise.then) {
                promise.then().catch((err) => {
                    notice.show = err;
                    throw err;
                });
            }

            if (option.mutex) {
                instances.filter((item) => item !== art).forEach((item) => item.pause());
            }

            notice.show = i18n.get('Play');
            art.emit('play');

            return promise;
        },
    });
}
