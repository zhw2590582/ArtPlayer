import { def } from '../utils';

export default function loadedMix(art) {
    const { $video } = art.template;

    def(art, 'loaded', {
        get: () => art.loadedTime / $video.duration,
    });

    def(art, 'loadedTime', {
        get: () => {
            return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0;
        },
    });
}
