import { def } from '../utils';

export default function toggleMix(art, player) {
    def(player, 'toggle', {
        value() {
            if (player.playing) {
                return player.pause();
            } else {
                return player.play();
            }
        },
    });
}
