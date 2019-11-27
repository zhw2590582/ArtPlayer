import { def } from '../utils';

export default function playMix(art, player) {
    const {
        i18n,
        notice,
        option: { mutex },
        template: { $video },
    } = art;

    def(player, 'play', {
        set(value) {
            if (value) {
                const promise = $video.play();
                if (promise !== undefined) {
                    promise.then().catch(err => {
                        notice.show = err;
                        throw err;
                    });
                }

                if (mutex) {
                    art.constructor.instances
                        .filter(item => item !== art)
                        .forEach(item => {
                            item.player.pause = true;
                        });
                }

                notice.show = i18n.get('Play');
                art.emit('play');
            } else {
                player.pause = true;
            }
        },
    });
}
