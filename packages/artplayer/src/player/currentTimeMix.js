import { clamp, def } from '../utils';

export default function currentTimeMix(art, player) {
    const { $video } = art.template;

    def(player, 'currentTime', {
        get: () => $video.currentTime || 0,
        set: (time) => {
            // Fixed: The provided double value is non-finite
            $video.currentTime = clamp(parseFloat(time.toFixed(3)), 0, player.duration);
        },
    });
}
