import { def } from '../utils';

export default function pauseMix(art, player) {
    const {
        template: { $video },
        i18n,
        notice,
    } = art;

    def(player, 'pause', {
        get() {
            return $video.paused;
        },
        set(value) {
            if (value) {
                $video.pause();
                notice.show = i18n.get('Pause');
                art.emit('pause');
            } else {
                player.play = true;
            }
        },
    });
}
