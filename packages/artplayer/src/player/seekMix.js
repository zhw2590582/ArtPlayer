import { secondToTime, def } from '../utils';

export default function seekMix(art, player) {
    const { notice } = art;

    def(player, 'seek', {
        set(time) {
            player.currentTime = time;
            notice.show = `${secondToTime(player.currentTime)} / ${secondToTime(player.duration)}`;
            art.emit('seek', player.currentTime);
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
