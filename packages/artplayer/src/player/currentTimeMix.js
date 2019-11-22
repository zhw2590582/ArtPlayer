import { clamp, def } from '../utils';

export default function currentTimeMix(art, player) {
    def(player, 'currentTime', {
        get: () => art.template.$video.currentTime || 0,
        set: currentTime => {
            art.template.$video.currentTime = clamp(currentTime, 0, player.duration);
        },
    });
}
