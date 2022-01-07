import { def } from '../utils';

export default function titleMix(art) {
    def(art, 'title', {
        get() {
            return art.option.title;
        },
        set(title) {
            art.option.title = title;
        },
    });
}
