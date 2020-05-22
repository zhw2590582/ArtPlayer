import { append, tooltip } from '../utils';

export default function fullscreen(option) {
    return art => ({
        ...option,
        tooltip: art.i18n.get('Fullscreen'),
        mounted: $control => {
            const {
                events: { proxy },
                icons,
                i18n,
                player,
            } = art;

            append($control, icons.fullscreen);

            proxy($control, 'click', () => {
                player.fullscreenToggle = true;
            });

            art.on('fullscreen', value => {
                tooltip($control, i18n.get(value ? 'Exit fullscreen' : 'Fullscreen'));
            });
        },
    });
}
