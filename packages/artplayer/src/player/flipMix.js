import { errorHandle } from '../utils';

export default function flipMix(art, player) {
    Object.defineProperty(player, 'flipState', {
        get: () => art.template.$player.dataset.flip,
    });

    Object.defineProperty(player, 'flip', {
        value: flip => {
            const flipList = ['normal', 'horizontal', 'vertical'];
            errorHandle(flipList.includes(flip), `'flip' only accept ${flipList.toString()} as parameters`);
            art.template.$player.dataset.flip = flip;
            art.emit('flipChange', flip);
        },
    });

    Object.defineProperty(player, 'flipRemove', {
        value: () => {
            delete art.template.$player.dataset.flip;
            art.emit('flipRemove');
        },
    });
}
