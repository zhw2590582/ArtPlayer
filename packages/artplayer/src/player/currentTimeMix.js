import { clamp, errorHandle } from '../utils';

export default function currentTimeMix(art, player) {
    Object.defineProperty(player, 'currentTime', {
        get: () => art.template.$video.currentTime || 0,
        set: currentTime => {
            errorHandle(
                player.duration,
                'Cannot set current time, the video seems to be not ready for mate information.',
            );
            art.template.$video.currentTime = clamp(currentTime, 0, player.duration);
        },
    });
}
