import { def } from '../utils';

export default function themeMix(art) {
    const {
        option,
        template: { $player },
    } = art;

    def(art, 'theme', {
        get() {
            return getComputedStyle($player).getPropertyValue('--art-theme');
        },
        set(theme) {
            option.theme = theme;
            $player.style.setProperty('--art-theme', theme);
        },
    });
}
