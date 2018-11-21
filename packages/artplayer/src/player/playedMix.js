export default function seekMix(art, player) {
    Object.defineProperty(player, 'played', {
        get: () => art.refs.$video.currentTime / art.refs.$video.duration,
    });
}
