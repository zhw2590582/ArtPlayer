import { def } from '../utils';

export default function durationMix(art, player) {
    def(player, 'duration', {
        get: () => art.template.$video.duration || Infinity,
    });
}
