import { debounce } from '../utils';

export default function mousemoveInitInit(art, events) {
    const {
        template: { $player, $video },
    } = art;

    const autoHide = debounce(() => {
        $player.classList.add('artplayer-hide-cursor');
        $player.classList.remove('artplayer-hover');
        art.controls.hide();
    }, 5000);

    art.on('hoverleave', () => {
        if (art.isPlaying) {
            autoHide();
        }
    });

    events.proxy($player, 'mousemove', event => {
        autoHide.clearTimeout();
        $player.classList.remove('artplayer-hide-cursor');
        art.controls.show();
        if (!art.player.pipState && art.isPlaying && event.target === $video) {
            autoHide();
        }
    });
}
