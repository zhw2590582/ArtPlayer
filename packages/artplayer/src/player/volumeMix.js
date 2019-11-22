import { clamp, def } from '../utils';

export default function volumeMix(art, player) {
    const {
        template: { $video },
        i18n,
        notice,
        storage,
    } = art;

    def(player, 'volume', {
        get: () => $video.volume || 0,
        set: percentage => {
            $video.volume = clamp(percentage, 0, 1);
            notice.show(`${i18n.get('Volume')}: ${parseInt($video.volume * 100, 10)}`);
            if ($video.volume !== 0) {
                storage.set('volume', $video.volume);
            }
            art.emit('volume', $video.volume);
        },
    });

    def(player, 'muted', {
        get: () => $video.muted,
        set: muted => {
            $video.muted = muted;
            art.emit('volume', $video.volume);
        },
    });
}
