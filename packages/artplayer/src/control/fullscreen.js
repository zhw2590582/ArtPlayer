import { append, tooltip } from '../utils';

export default function fullscreen(option) {
    return (art) => ({
        ...option,
        tooltip: art.i18n.get('Fullscreen'),
        mounted: ($control) => {
            const {
                events: { proxy },
                icons,
                i18n,
            } = art;

            append($control, icons.fullscreen);

            proxy($control, 'click', () => {
                art.fullscreen = !art.fullscreen;
            });

            art.on('fullscreen', (value) => {
                tooltip($control, i18n.get(value ? 'Exit fullscreen' : 'Fullscreen'));
            });
        },
    });
}
