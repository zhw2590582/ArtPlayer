import { def } from '../utils';

export default function playingMix(art) {
    const { $video } = art.template;
    def(art, 'playing', {
        get: () => !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2),
    });
}
