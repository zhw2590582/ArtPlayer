import { def } from '../utils';

export default function pauseMix(art, player) {
    const {
        template: { $video },
        i18n,
        notice,
    } = art;

    def(player, 'pause', {
        value() {
            $video.pause();
            notice.show = i18n.get('Pause');
            art.emit('pause');
        },
    });
}
