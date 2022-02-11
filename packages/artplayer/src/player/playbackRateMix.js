import { errorHandle, def } from '../utils';

export default function playbackRateMix(art) {
    const {
        template: { $video, $player },
        i18n,
        notice,
    } = art;

    def(art, 'playbackRate', {
        get() {
            return $player.dataset.playbackRate || 1.0;
        },
        set(rate) {
            if (rate) {
                if (rate === $player.dataset.playbackRate) return;
                const rateList = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
                errorHandle(rateList.includes(rate), `'playbackRate' only accept ${rateList.toString()} as parameters`);
                $video.playbackRate = rate;
                $player.dataset.playbackRate = rate;
                notice.show = `${i18n.get('Rate')}: ${rate === 1.0 ? i18n.get('Normal') : `${rate}x`}`;
                art.emit('playbackRate', rate);
            } else if (art.playbackRate) {
                art.playbackRate = 1;
                delete $player.dataset.playbackRate;
                art.emit('playbackRate');
            }
        },
    });

    def(art, 'playbackRateReset', {
        set(value) {
            if (value) {
                const { playbackRate } = $player.dataset;
                if (playbackRate) {
                    art.playbackRate = Number(playbackRate);
                }
            }
        },
    });
}
