import { secondToTime, def } from '../utils';

export default function seekMix(art) {
    const { notice } = art;

    def(art, 'seek', {
        set(time) {
            art.currentTime = time;
            if (art.duration) {
                notice.show = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`;
            }
            art.emit('seek', art.currentTime);
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
