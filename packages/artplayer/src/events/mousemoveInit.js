import { debounce } from '../utils';

export default function mousemoveInitInit(art, events) {
    const {
        template: { $player, $video },
        player,
    } = art;

    const autoHide = debounce(() => {
        $player.classList.add('artplayer-hide-cursor');
        $player.classList.remove('artplayer-hover');
        art.controls.show = false;
    }, 3000);

    art.on('hoverleave', () => {
        if (player.playing) {
            autoHide();
        }
    });

    events.proxy($player, 'mousemove', event => {
        autoHide.clearTimeout();
        $player.classList.remove('artplayer-hide-cursor');
        art.controls.show = true;
        if (!art.player.pip && player.playing && event.target === $video) {
            autoHide();
        }
    });
}
