import { append, tooltip, setStyle } from '../utils';

export default function fullscreenWeb(controlOption) {
    return art => ({
        ...controlOption,
        mounted: $control => {
            const {
                events: { proxy },
                i18n,
                player,
            } = art;
            
            const $fullscreenWeb = append($control, art.icons.fullscreenWeb);
            tooltip($fullscreenWeb, i18n.get('Web fullscreen'));

            proxy($control, 'click', () => {
                player.fullscreenWebToggle();
            });

            art.on('fullscreenWeb:enabled', () => {
                setStyle($fullscreenWeb, 'opacity', '0.8');
                tooltip($fullscreenWeb, i18n.get('Exit web fullscreen'));
            });

            art.on('fullscreenWeb:exit', () => {
                setStyle($fullscreenWeb, 'opacity', '1');
                tooltip($fullscreenWeb, i18n.get('Web fullscreen'));
            });
        },
    });
}
