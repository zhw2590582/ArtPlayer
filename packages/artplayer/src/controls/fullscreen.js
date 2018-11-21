import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default class Fullscreen {
    constructor(option) {
        this.option = option;
    }

    apply(art, $control) {
        const {
            events: { proxy },
            i18n,
            player,
        } = art;
        this.$fullscreen = append($control, icons.fullscreen);
        tooltip(this.$fullscreen, i18n.get('Fullscreen'));

        proxy($control, 'click', () => {
            player.fullscreenToggle();
        });

        art.on('fullscreen:enabled', () => {
            setStyle(this.$fullscreen, 'opacity', '0.8');
            tooltip(this.$fullscreen, i18n.get('Exit fullscreen'));
        });

        art.on('fullscreen:exit', () => {
            setStyle(this.$fullscreen, 'opacity', '1');
            tooltip(this.$fullscreen, i18n.get('Fullscreen'));
        });
    }
}
