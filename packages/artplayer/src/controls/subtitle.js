import { append, tooltip, setStyle } from '../utils';

export default function subtitle(controlOption) {
    return art => ({
        ...controlOption,
        mounted: $control => {
            const {
                events: { proxy },
                i18n,
                subtitle,
            } = art;
            
            const $subtitle = append($control, art.icons.subtitle);
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
