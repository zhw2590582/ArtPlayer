import { append, tooltip } from '../utils';

export default function pip(controlOption) {
    return art => ({
        ...controlOption,
        mounted: $control => {
            const {
                events: { proxy },
                i18n,
                player,
            } = art;
            const $pip = append($control, art.icons.pip);
            tooltip($pip, i18n.get('Mini player'));
            proxy($control, 'click', () => {
                player.pipEnabled();
            });
        },
    });
}
