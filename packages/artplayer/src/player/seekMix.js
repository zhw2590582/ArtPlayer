import { secondToTime } from '../utils';

export default function seekMix(art, player) {
    const { notice } = art;

    Object.defineProperty(player, 'seek', {
        value: time => {
            player.currentTime = time;
            notice.show(`${secondToTime(time)} / ${secondToTime(player.duration)}`);
            art.emit('seek', time);
        },
    });
}
