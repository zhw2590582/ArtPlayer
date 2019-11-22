import { def } from '../utils';

export default function seekMix(art, player) {
    const { $video } = art.template;
    def(player, 'loaded', {
        get: () => ($video.buffered.length ? $video.buffered.end($video.buffered.length - 1) / $video.duration : 0),
    });

    def(player, 'loadedTime', {
        get: () => ($video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0),
    });
}
