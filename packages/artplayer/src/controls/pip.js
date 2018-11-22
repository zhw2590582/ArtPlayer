import { append, tooltip } from '../utils';
import icons from '../icons';

export default function pip(controlOption) {
    return art => ({
        ...controlOption,
        mounted: $control => {
            const {
                events: { proxy },
                i18n,
                player,
            } = art;
            const $pip = append($control, icons.pip);
            tooltip($pip, i18n.get('Mini player'));
            proxy($control, 'click', () => {
                player.pipEnabled();
            });
        },
    });
}
