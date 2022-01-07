import { clamp, def } from '../utils';

export default function currentTimeMix(art) {
    const { $video } = art.template;

    def(art, 'currentTime', {
        get: () => $video.currentTime || 0,
        set: (time) => {
            // Fixed: The provided double value is non-finite
            $video.currentTime = clamp(parseFloat(time.toFixed(3)), 0, art.duration);
        },
    });
}
