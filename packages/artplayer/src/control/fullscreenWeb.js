import { append, tooltip } from '../utils';

export default function fullscreenWeb(option) {
    return art => ({
        ...option,
        tooltip: art.i18n.get('Web fullscreen'),
        mounted: $control => {
            const {
                events: { proxy },
                icons,
                i18n,
                player,
            } = art;

            append($control, icons.fullscreenWeb);

            proxy($control, 'click', () => {
                player.fullscreenWebToggle = true;
            });

            art.on('fullscreenWeb', value => {
                tooltip($control, i18n.get(value ? 'Exit web fullscreen' : 'Web fullscreen'));
            });
        },
    });
}
