import { append, tooltip } from '../utils';
import icons from '../icons';

export default function screenshot(controlOption) {
    return art => ({
        ...controlOption,
        mounted: $control => {
            const {
                events: { proxy },
                i18n,
                player,
            } = art;
            
            const $screenshot = append($control, icons.screenshot);
            tooltip($screenshot, i18n.get('Screenshot'));
            proxy($screenshot, 'click', () => {
                player.screenshot();
            });
        },
    });
}
