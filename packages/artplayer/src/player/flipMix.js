import { errorHandle, def } from '../utils';

export default function flipMix(art, player) {
    const { $player } = art.template;
    def(player, 'flip', {
        get() {
            return $player.dataset.flip;
        },
        set(flip) {
            if (flip) {
                const flipList = ['normal', 'horizontal', 'vertical'];
                errorHandle(flipList.includes(flip), `'flip' only accept ${flipList.toString()} as parameters`);
                $player.dataset.flip = flip;
                art.emit('flip', flip);
            } else {
                delete $player.dataset.flip;
                art.emit('flip');
            }
        },
    });
}
