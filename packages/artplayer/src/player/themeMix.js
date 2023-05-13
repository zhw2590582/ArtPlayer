import { def } from '../utils';

export default function themeMix(art) {
    def(art, 'theme', {
        get() {
            return art.cssVar('--art-theme');
        },
        set(theme) {
            art.cssVar('--art-theme', theme);
        },
    });
}
