import { append, tooltip } from '../utils';

export default function setting(option) {
    return (art) => ({
        ...option,
        tooltip: art.i18n.get('Show Setting'),
        mounted: ($control) => {
            const { proxy, icons, i18n } = art;

            append($control, icons.setting);

            proxy($control, 'click', () => {
                art.setting.toggle();
                art.setting.updateStyle();
            });

            art.on('setting', (value) => {
                tooltip($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'));
            });
        },
    });
}
