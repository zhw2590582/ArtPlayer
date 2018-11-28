export default function durationMix(art, player) {
    Object.defineProperty(player, 'duration', {
        get: () => art.template.$video.duration || 0,
    });
}
