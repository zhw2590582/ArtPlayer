import { def, capitalize } from '../utils';

export default function flipMix(art) {
    const {
        template: { $player },
        i18n,
        notice,
    } = art;

    def(art, 'flip', {
        get() {
            return $player.dataset.flip || 'normal';
        },
        set(flip) {
            if (!flip) flip = 'normal';
            if (flip === 'normal') {
                delete $player.dataset.flip;
            } else {
                $player.dataset.flip = flip;
            }

            notice.show = `${i18n.get('Video Flip')}: ${i18n.get(capitalize(flip))}`;
            art.emit('flip', flip);
        },
    });
}
