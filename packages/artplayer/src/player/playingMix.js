import { def } from '../utils';

export default function playingMix(art, player) {
    const { $video } = art.template;
    def(player, 'playing', {
        get: () => !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2),
    });
}
