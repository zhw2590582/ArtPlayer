import { errorHandle, def } from '../utils';

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
                const rateList = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0, 4.0];
                errorHandle(rateList.includes(rate), `'playbackRate' only accept ${rateList.toString()} as parameters`);
                $video.playbackRate = rate;
                notice.show = `${i18n.get('Rate')}: ${rate === 1.0 ? i18n.get('Normal') : `${rate}x`}`;
                art.emit('playbackRate', rate);
            } else {
                art.playbackRate = 1;
                art.emit('playbackRate');
            }
        },
    });
}
