import { append, tooltip } from '../utils';
import icons from '../icons';

export default class Screenshot {
    constructor(option) {
        this.option = option;
    }

    apply(art, $control) {
        const {
            events: { proxy },
            i18n,
            player,
        } = art;
        this.$screenshot = append($control, icons.screenshot);
        tooltip(this.$screenshot, i18n.get('Screenshot'));
        proxy(this.$screenshot, 'click', () => {
            player.screenshot();
        });
    }
}
