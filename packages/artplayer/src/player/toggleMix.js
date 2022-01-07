import { def } from '../utils';

export default function toggleMix(art) {
    def(art, 'toggle', {
        value() {
            if (art.playing) {
                return art.pause();
            } else {
                return art.play();
            }
        },
    });
}
