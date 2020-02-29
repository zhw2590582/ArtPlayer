import { def, getStyle, setStyle } from '../utils';

export default function lightMix(art, player) {
    const { $undercover } = art.template;

    def(player, 'light', {
        get() {
            return getStyle($undercover, 'display', false) !== 'none';
        },
        set(value) {
            setStyle($undercover, 'display', value ? 'block' : 'none');
            art.emit('light', value);
        },
    });
}
