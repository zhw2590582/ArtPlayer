import { debounce, addClass, removeClass } from '../utils';

export default function mousemoveInitInit(art, events) {
    const {
        template: { $player, $video },
        player,
    } = art;

    const autoHide = debounce(() => {
        addClass($player, 'art-hide-cursor');
        removeClass($player, 'art-hover');
        art.controls.show = false;
    }, 3000);

    art.on('hoverleave', () => {
        if (player.playing) {
            autoHide();
        }
    });

    events.proxy($player, 'mousemove', event => {
        autoHide.clearTimeout();
        removeClass($player, 'art-hide-cursor');
        art.controls.show = true;
        if (!art.player.pip && player.playing && event.target === $video) {
            autoHide();
        }
        art.emit('mousemove');
    });
}
