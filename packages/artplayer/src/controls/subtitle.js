import { append, tooltip, setStyle } from '../utils';

export default function subtitle(option) {
    return art => ({
        ...option,
        mounted: $control => {
            const {
                events: { proxy },
                icons,
                i18n,
                subtitle,
            } = art;

            const $subtitle = append($control, icons.subtitle);
            tooltip($subtitle, i18n.get('Hide subtitle'));

            proxy($control, 'click', () => {
                subtitle.toggle();
            });

            art.on('subtitle:show', () => {
                setStyle($subtitle, 'opacity', '1');
                tooltip($subtitle, i18n.get('Hide subtitle'));
            });

            art.on('subtitle:hide', () => {
                setStyle($subtitle, 'opacity', '0.8');
                tooltip($subtitle, i18n.get('Show subtitle'));
            });
        },
    });
}
