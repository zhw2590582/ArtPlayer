export default function toggleMix(art, player) {
    Object.defineProperty(player, 'toggle', {
        value: () => {
            if (player.playing) {
                player.pause();
            } else {
                player.play();
            }
        },
    });
}
