import { removeClass } from '../utils';

export default function mousemoveInitInit(art, events) {
    const {
        template: { $player, $video },
        player,
        controls,
    } = art;

    events.proxy($player, 'mousemove', (event) => {
        art.emit('mousemove', event);
    });

    art.on('mousemove', (event) => {
        controls.cancelDelayHide();
        removeClass($player, 'art-hide-cursor');
        controls.show = true;
        if (!player.pip && event.target === $video) {
            controls.delayHide();
        }
    });
}
