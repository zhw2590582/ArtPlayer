export default function seekMix(art, player) {
    const { $video } = art.template;
    Object.defineProperty(player, 'loaded', {
        get: () => ($video.buffered.length ? $video.buffered.end($video.buffered.length - 1) / $video.duration : 0),
    });

    Object.defineProperty(player, 'loadedTime', {
        get: () => ($video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0),
    });
}
