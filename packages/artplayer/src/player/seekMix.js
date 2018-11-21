import { secondToTime } from '../utils';

export default function seekMix(art, player) {
    const { notice } = art;

    Object.defineProperty(player, 'seek', {
        value: time => {
            let newTime = Math.max(time, 0);
            if (player.duration) {
                newTime = Math.min(newTime, player.duration);
            }
            player.currentTime = newTime;
            notice.show(`${secondToTime(newTime)} / ${secondToTime(player.duration)}`);
            art.emit('seek', newTime);
        },
    });
}
