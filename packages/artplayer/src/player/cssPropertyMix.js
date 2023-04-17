import { def } from '../utils';

export default function cssPropertyMix(art) {
    const { $player } = art.template;

    def(art, 'cssProperty', {
        value(key, value) {
            if (value) {
                return $player.style.setProperty(key, value);
            } else {
                return getComputedStyle($player).getPropertyValue(key);
            }
        },
    });
}
