export default function toggleMix(art, player) {
    Object.defineProperty(player, 'toggle', {
        set(value) {
            if (value) {
                if (player.playing) {
                    player.pause = true;
                } else {
                    player.play = true;
                }
            }
        },
    });
}
