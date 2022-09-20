import { append, tooltip, setStyle } from '../utils';

export default function fullscreenWeb(option) {
    return (art) => ({
        ...option,
        tooltip: art.i18n.get('Web Fullscreen'),
        mounted: ($control) => {
            const { proxy, icons, i18n } = art;

            const $fullscreenWebOn = append($control, icons.fullscreenWebOn);
            const $fullscreenWebOff = append($control, icons.fullscreenWebOff);
            setStyle($fullscreenWebOff, 'display', 'none');

            proxy($control, 'click', () => {
                art.fullscreenWeb = !art.fullscreenWeb;
            });

            art.on('fullscreenWeb', (value) => {
                if (value) {
                    tooltip($control, i18n.get('Exit Web Fullscreen'));
                    setStyle($fullscreenWebOn, 'display', 'none');
                    setStyle($fullscreenWebOff, 'display', 'inline-flex');
                } else {
                    tooltip($control, i18n.get('Web Fullscreen'));
                    setStyle($fullscreenWebOn, 'display', 'inline-flex');
                    setStyle($fullscreenWebOff, 'display', 'none');
                }
            });
        },
    });
}
