import { def } from '../utils';

export default function themeMix(art) {
    const { option } = art;

    def(art, 'theme', {
        get() {
            return art.cssProperty('--art-theme');
        },
        set(theme) {
            option.theme = theme;
            art.cssProperty('--art-theme', theme);
        },
    });
}
