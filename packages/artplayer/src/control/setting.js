import { append, tooltip } from '../utils';

export default function setting(option) {
    return art => ({
        ...option,
        tooltip: art.i18n.get('Show setting'),
        mounted: $control => {
            const {
                events: { proxy },
                icons,
                i18n,
                setting,
            } = art;

            append($control, icons.setting);

            proxy($control, 'click', () => {
                setting.toggle = true;
            });

            art.on('setting', value => {
                tooltip($control, i18n.get(value ? 'Hide setting' : 'Show setting'));
            });
        },
    });
}
