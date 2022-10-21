import { def } from '../utils';

export default function typeMix(art) {
    def(art, 'type', {
        get() {
            return art.option.type;
        },
        set(type) {
            art.option.type = type;
        },
    });
}
