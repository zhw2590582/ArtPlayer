import { def } from '../utils';

export default function playedMix(art, player) {
    def(player, 'played', {
        get: () => player.currentTime / player.duration,
    });
}
