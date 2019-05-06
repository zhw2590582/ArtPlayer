import { errorHandle } from '../utils';

export default function playbackRateMix(art, player) {
    const {
        template: { $video, $player },
        i18n,
        notice,
    } = art;

    Object.defineProperty(player, 'playbackRateState', {
        get: () => $player.dataset.playbackRate,
    });

    Object.defineProperty(player, 'playbackRate', {
        value: rate => {
            const rateList = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
            errorHandle(rateList.includes(rate), `'playbackRate' only accept ${rateList.toString()} as parameters`);

            if (rate === $player.dataset.playbackRate) {
                return;
            }

            $video.playbackRate = rate;
            $player.dataset.playbackRate = rate;
            notice.show(`${i18n.get('Rate')}: ${rate === 1.0 ? i18n.get('Normal') : `${rate}x`}`);
            art.emit('playbackRateChange', rate);
        },
    });

    Object.defineProperty(player, 'playbackRateRemove', {
        value: () => {
            if (player.playbackRateState) {
                player.playbackRate(1);
                delete $player.dataset.playbackRate;
                art.emit('playbackRateRemove');
            }
        },
    });

    Object.defineProperty(player, 'playbackRateReset', {
        value: () => {
            const { playbackRate } = $player.dataset;
            if (playbackRate) {
                player.playbackRate(Number(playbackRate));
                art.emit('playbackRateReset');
            }
        },
    });
}
