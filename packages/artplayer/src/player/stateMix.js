import { def } from '../utils';

export default function stateMix(art) {
    const states = ['mini', 'pip', 'fullscreen', 'fullscreenWeb'];
    def(art, 'state', {
        get: () => states.find((name) => art[name]) || 'standard',
        set(name) {
            for (let index = 0; index < states.length; index++) {
                const prop = states[index];
                if (prop !== name && art[prop]) {
                    art[prop] = false;
                }
            }
        },
    });
}
