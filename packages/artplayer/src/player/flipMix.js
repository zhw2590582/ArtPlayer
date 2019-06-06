import { errorHandle } from '../utils';

export default function flipMix(art, player) {
    Object.defineProperty(player, 'flip', {
        get() {
            return art.template.$player.dataset.flip;
        },
        set(flip) {
            if (flip) {
                const flipList = ['normal', 'horizontal', 'vertical'];
                errorHandle(flipList.includes(flip), `'flip' only accept ${flipList.toString()} as parameters`);
                art.template.$player.dataset.flip = flip;
                art.emit('flipChange', flip);
            } else {
                delete art.template.$player.dataset.flip;
                art.emit('flipRemove');
            }
        },
    });
}
