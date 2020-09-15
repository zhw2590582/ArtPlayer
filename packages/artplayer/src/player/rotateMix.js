import { def } from '../utils';

export default function rotateMix(art, player) {
    def(player, 'rotate', {
        get: () => 'rotate',
    });
}
