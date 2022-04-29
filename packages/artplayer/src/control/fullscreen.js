import { append, tooltip, setStyle } from '../utils';

export default function fullscreen(option) {
    return (art) => ({
        ...option,
        tooltip: art.i18n.get('Fullscreen'),
        mounted: ($control) => {
            const {
                events: { proxy },
                icons,
                i18n,
            } = art;

            const $fullscreenOn = append($control, icons.fullscreenOn);
            const $fullscreenOff = append($control, icons.fullscreenOff);
            setStyle($fullscreenOff, 'display', 'none');

            proxy($control, 'click', () => {
                art.fullscreen = !art.fullscreen;
            });

            art.on('fullscreen', (value) => {
                if (value) {
                    tooltip($control, i18n.get('Exit Fullscreen'));
                    setStyle($fullscreenOn, 'display', 'none');
                    setStyle($fullscreenOff, 'display', 'inline-flex');
                } else {
                    tooltip($control, i18n.get('Fullscreen'));
                    setStyle($fullscreenOn, 'display', 'inline-flex');
                    setStyle($fullscreenOff, 'display', 'none');
                }
            });
        },
    });
}
