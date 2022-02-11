import { append, tooltip } from '../utils';

export default function subtitle(option) {
    return art => ({
        ...option,
        tooltip: art.i18n.get('Hide Subtitle'),
        mounted: $control => {
            const {
                events: { proxy },
                icons,
                i18n,
                subtitle,
            } = art;

            append($control, icons.subtitle);

            proxy($control, 'click', () => {
                subtitle.toggle = true;
            });

            art.on('subtitle', value => {
                tooltip($control, i18n.get(value ? 'Hide Subtitle' : 'Show Subtitle'));
            });
        },
    });
}
