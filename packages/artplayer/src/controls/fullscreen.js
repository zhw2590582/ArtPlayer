import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default function fullscreen(controlOption) {
    return art => ({
        ...controlOption,
        mounted: $control => {
            const {
                events: { proxy },
                i18n,
                player,
            } = art;
            
            const $fullscreen = append($control, icons.fullscreen);
            tooltip($fullscreen, i18n.get('Fullscreen'));

            proxy($control, 'click', () => {
                player.fullscreenToggle();
            });

            art.on('fullscreen:enabled', () => {
                setStyle($fullscreen, 'opacity', '0.8');
                tooltip($fullscreen, i18n.get('Exit fullscreen'));
            });

            art.on('fullscreen:exit', () => {
                setStyle($fullscreen, 'opacity', '1');
                tooltip($fullscreen, i18n.get('Fullscreen'));
            });
        },
    });
}
