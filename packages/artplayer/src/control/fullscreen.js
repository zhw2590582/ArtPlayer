import { append, tooltip, setStyle } from '../utils';

export default function fullscreen(option) {
    return art => ({
        ...option,
        mounted: $control => {
            const {
                events: { proxy },
                icons,
                i18n,
                player,
            } = art;

            const $fullscreen = append($control, icons.fullscreen);
            tooltip($fullscreen, i18n.get('Fullscreen'));

            proxy($control, 'click', () => {
                player.fullscreenToggle = true;
            });

            art.on('fullscreenEnabled', () => {
                setStyle($fullscreen, 'opacity', '0.8');
                tooltip($fullscreen, i18n.get('Exit fullscreen'));
            });

            art.on('fullscreenExit', () => {
                setStyle($fullscreen, 'opacity', '1');
                tooltip($fullscreen, i18n.get('Fullscreen'));
            });
        },
    });
}
