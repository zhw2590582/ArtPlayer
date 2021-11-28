import { def } from '../utils';

export default function toggleMix(art, player) {
    def(player, 'toggle', {
        value() {
            if (player.playing) {
                player.pause();
            } else {
                player.play();
            }
        },
    });
}
