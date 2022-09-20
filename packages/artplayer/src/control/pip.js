import { append, tooltip } from '../utils';

export default function pip(option) {
    return (art) => ({
        ...option,
        tooltip: art.i18n.get('PIP Mode'),
        mounted: ($control) => {
            const { proxy, icons, i18n } = art;

            append($control, icons.pip);

            proxy($control, 'click', () => {
                art.pip = !art.pip;
            });

            art.on('pip', (value) => {
                tooltip($control, i18n.get(value ? 'Exit PIP Mode' : 'PIP Mode'));
            });
        },
    });
}
