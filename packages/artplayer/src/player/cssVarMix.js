import { def } from '../utils';

export default function cssVarMix(art) {
    const { $player } = art.template;

    def(art, 'cssVar', {
        value(key, value) {
            if (value) {
                return $player.style.setProperty(key, value);
            } else {
                return getComputedStyle($player).getPropertyValue(key);
            }
        },
    });
}
