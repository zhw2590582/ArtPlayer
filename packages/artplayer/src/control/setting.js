import { append, tooltip, setStyle } from '../utils';

export default function setting(option) {
    return art => ({
        ...option,
        mounted: $control => {
            const {
                events: { proxy },
                icons,
                i18n,
                setting,
            } = art;

            const $setting = append($control, icons.setting);
            tooltip($setting, i18n.get('Show setting'));

            proxy($control, 'click', () => {
                setting.toggle();
            });

            art.on('setting:toggle', value => {
                if (value) {
                    setStyle($setting, 'opacity', '0.8');
                    tooltip($setting, i18n.get('Hide setting'));
                } else {
                    setStyle($setting, 'opacity', '1');
                    tooltip($setting, i18n.get('Show setting'));
                }
            });
        },
    });
}
