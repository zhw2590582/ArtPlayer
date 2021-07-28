import { append, tooltip, addClass, removeClass } from '../utils';

export default function play(option) {
    return art => ({
        ...option,
        mounted: $control => {
            const {
                events: { proxy },
                icons,
                i18n,
                player,
            } = art;

            const $play = append($control, icons.play);
            

            proxy($play, 'click', () => {
                player.toggle = true
            });

            function showPlay() {
                removeClass($play, 'art-icon-play--playing');
                tooltip($play, i18n.get('Play'));
            }

            function showPause() {
                addClass($play, 'art-icon-play--playing');
                tooltip($play, i18n.get('Pause'));
            }

            if (player.playing) {
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
