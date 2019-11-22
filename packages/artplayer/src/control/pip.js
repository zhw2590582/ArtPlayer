import { append, tooltip } from '../utils';

export default function pip(option) {
    return art => ({
        ...option,
        mounted: $control => {
            const {
                events: { proxy },
                icons,
                i18n,
                player,
            } = art;
            const $pip = append($control, icons.pip);
            tooltip($pip, i18n.get('Mini player'));
            proxy($control, 'click', () => {
                player.pip = true;
            });
        },
    });
}
