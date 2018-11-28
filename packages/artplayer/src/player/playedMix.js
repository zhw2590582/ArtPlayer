export default function seekMix(art, player) {
    Object.defineProperty(player, 'played', {
        get: () => art.template.$video.currentTime / art.template.$video.duration,
    });
}
