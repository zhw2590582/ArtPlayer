import { def } from '../utils';

export default function seekMix(art, player) {
    const { $video } = art.template;

    def(player, 'loaded', {
        get: () => player.loadedTime / $video.duration,
    });

    def(player, 'loadedTime', {
        get: () => ($video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0),
    });
}
