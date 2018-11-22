import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default function playAndPause(controlOption) {
    return art => ({
        ...controlOption,
        mounted: $control => {
            const {
                events: { proxy },
                player,
                i18n,
            } = art;
            const $play = append($control, icons.play);
            const $pause = append($control, icons.pause);
            tooltip($play, i18n.get('Play'));
            tooltip($pause, i18n.get('Pause'));
            setStyle($pause, 'display', 'none');

            proxy($play, 'click', () => {
                player.play();
            });

            proxy($pause, 'click', () => {
                player.pause();
            });

            art.on('video:playing', () => {
                setStyle($play, 'display', 'none');
                setStyle($pause, 'display', 'flex');
            });

            art.on('video:pause', () => {
                setStyle($play, 'display', 'flex');
                setStyle($pause, 'display', 'none');
            });
        },
    });
}
