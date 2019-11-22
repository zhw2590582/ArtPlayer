import { def } from '../utils';

export default function toggleMix(art, player) {
    def(player, 'toggle', {
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
