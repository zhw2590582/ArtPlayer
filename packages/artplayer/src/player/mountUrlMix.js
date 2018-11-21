export default function mountUrlMix(art, player) {
    Object.defineProperty(player, 'mountUrl', {
        writable: true,
        value: url => url,
    });
}
