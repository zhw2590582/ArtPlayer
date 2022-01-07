import { secondToTime, def } from '../utils';

export default function seekMix(art) {
    const { notice } = art;

    def(art, 'seek', {
        set(time) {
            art.currentTime = time;
            art.emit('seek', art.currentTime);
            if (art.duration) {
                notice.show = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`;
            }
        },
    });

    def(art, 'forward', {
        set(time) {
            art.seek = art.currentTime + time;
        },
    });

    def(art, 'backward', {
        set(time) {
            art.seek = art.currentTime - time;
        },
    });
}
