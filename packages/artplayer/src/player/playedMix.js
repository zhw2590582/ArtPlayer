import { def } from '../utils';

export default function playedMix(art) {
    def(art, 'played', {
        get: () => art.currentTime / art.duration,
    });
}
