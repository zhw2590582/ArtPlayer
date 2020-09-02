import { secondToTime, def } from '../utils';

export default function seekMix(art, player) {
    const { notice } = art;

    def(player, 'seek', {
        set(time) {
            player.currentTime = time;
            art.emit('seek', player.currentTime);
            if (player.duration) {
                notice.show = `${secondToTime(player.currentTime)} / ${secondToTime(player.duration)}`;
            }
        },
    });

    def(player, 'forward', {
        set(time) {
            player.seek = player.currentTime + time;
        },
    });

    def(player, 'backward', {
        set(time) {
            player.seek = player.currentTime - time;
        },
    });
}
