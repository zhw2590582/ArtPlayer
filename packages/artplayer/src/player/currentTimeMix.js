import { clamp, def } from '../utils';

export default function currentTimeMix(art) {
    const { $video } = art.template;

    def(art, 'currentTime', {
        get: () => $video.currentTime || 0,
        set: (time) => {
            time = parseFloat(time);
            if (Number.isNaN(time)) return;
            $video.currentTime = clamp(time, 0, art.duration);
        },
    });
}
