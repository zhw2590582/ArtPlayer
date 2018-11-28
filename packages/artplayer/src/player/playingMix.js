export default function playingMix(art, player) {
    const { $video } = art.template;
    Object.defineProperty(player, 'playing', {
        get: () => !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2),
    });
}
