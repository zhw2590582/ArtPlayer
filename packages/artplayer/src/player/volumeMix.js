import { clamp, def } from '../utils';

export default function volumeMix(art) {
    const {
        template: { $video },
        i18n,
        notice,
        storage,
    } = art;

    def(art, 'volume', {
        get: () => $video.volume || 0,
        set: (percentage) => {
            $video.volume = clamp(percentage, 0, 1);
            notice.show = `${i18n.get('Volume')}: ${parseInt($video.volume * 100, 10)}`;
            if ($video.volume !== 0) {
                storage.set('volume', $video.volume);
            }
        },
    });

    def(art, 'muted', {
        get: () => $video.muted,
        set: (muted) => {
            $video.muted = muted;
        },
    });
}
