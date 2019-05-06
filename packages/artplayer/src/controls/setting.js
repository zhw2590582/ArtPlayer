import { append, tooltip, setStyle } from '../utils';

export default function setting(controlOption) {
    return art => ({
        ...controlOption,
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

            art.on('setting:show', () => {
                setStyle($setting, 'opacity', '0.8');
                tooltip($setting, i18n.get('Hide setting'));
            });

            art.on('setting:hide', () => {
                setStyle($setting, 'opacity', '1');
                tooltip($setting, i18n.get('Show setting'));
            });
        },
    });
}
