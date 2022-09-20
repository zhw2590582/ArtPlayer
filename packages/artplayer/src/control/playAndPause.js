import { append, tooltip, setStyle } from '../utils';

export default function playAndPause(option) {
    return (art) => ({
        ...option,
        mounted: ($control) => {
            const { proxy, icons, i18n } = art;

            const $play = append($control, icons.play);
            const $pause = append($control, icons.pause);
            tooltip($play, i18n.get('Play'));
            tooltip($pause, i18n.get('Pause'));

            proxy($play, 'click', () => {
                art.play();
            });

            proxy($pause, 'click', () => {
                art.pause();
            });

            function showPlay() {
                setStyle($play, 'display', 'flex');
                setStyle($pause, 'display', 'none');
            }

            function showPause() {
                setStyle($play, 'display', 'none');
                setStyle($pause, 'display', 'flex');
            }

            if (art.playing) {
                showPause();
            } else {
                showPlay();
            }

            art.on('video:playing', () => {
                showPause();
            });

            art.on('video:pause', () => {
                showPlay();
            });
        },
    });
}
