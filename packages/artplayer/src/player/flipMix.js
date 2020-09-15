import { errorHandle, def } from '../utils';

export default function flipMix(art, player) {
    const {
        template: { $player },
        i18n,
        notice,
    } = art;

    def(player, 'flip', {
        get() {
            return $player.dataset.flip;
        },
        set(flip) {
            const flipList = [false, 'normal', 'horizontal', 'vertical'];
            errorHandle(flipList.includes(flip), `'flip' only accept ${flipList.toString()} as parameters`);

            if (!flip || flip === 'normal') {
                delete $player.dataset.flip;
            } else {
                $player.dataset.flip = flip;
            }

            if (typeof flip === 'string') {
                const word = flip.replace(flip[0], flip[0].toUpperCase());
                notice.show = `${i18n.get('Flip')}: ${i18n.get(word)}`;
            }

            art.emit('flip', flip);
        },
    });

    def(player, 'flipReset', {
        set(value) {
            if (value && player.flip) {
                const { flip } = player;
                player.flip = flip;
            }
        },
    });
}
