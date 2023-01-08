import { def } from '../utils';

export default function playbackRateMix(art) {
    const {
        template: { $video },
        i18n,
        notice,
    } = art;

    def(art, 'playbackRate', {
        get() {
            return $video.playbackRate;
        },
        set(rate) {
            if (rate) {
                if (rate === $video.playbackRate) return;
                $video.playbackRate = rate;
                notice.show = `${i18n.get('Rate')}: ${rate === 1.0 ? i18n.get('Normal') : `${rate}x`}`;
            } else {
                art.playbackRate = 1;
            }
        },
    });
}
