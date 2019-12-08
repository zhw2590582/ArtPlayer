import { secondToTime, def } from '../utils';

export default function seekMix(art, player) {
    const { notice } = art;

    def(player, 'seek', {
        set(time) {
            player.currentTime = time;
            notice.show = `${secondToTime(time)} / ${secondToTime(player.duration)}`;
            art.emit('seek', time);
        },
    });
}
