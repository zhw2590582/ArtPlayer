import { clamp, def } from '../utils';

export default function currentTimeMix(art, player) {
    const { $video } = art.template;

    def(player, 'currentTime', {
        get: () => $video.currentTime || 0,
        set: time => {
            $video.currentTime = clamp(time, 0, player.duration);
        },
    });
}
