import { def } from '../utils';

export default function seekMix(art, player) {
    def(player, 'played', {
        get: () => art.template.$video.currentTime / art.template.$video.duration,
    });
}
