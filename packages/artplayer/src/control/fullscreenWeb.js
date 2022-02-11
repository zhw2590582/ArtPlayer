import { append, tooltip } from '../utils';

export default function fullscreenWeb(option) {
    return (art) => ({
        ...option,
        tooltip: art.i18n.get('Web Fullscreen'),
        mounted: ($control) => {
            const {
                events: { proxy },
                icons,
                i18n,
            } = art;

            append($control, icons.fullscreenWeb);

            proxy($control, 'click', () => {
                art.fullscreenWeb = !art.fullscreenWeb;
            });

            art.on('fullscreenWeb', (value) => {
                tooltip($control, i18n.get(value ? 'Exit Web Fullscreen' : 'Web Fullscreen'));
            });
        },
    });
}
