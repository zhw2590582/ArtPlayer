import { def, clamp } from '../utils';

export default function loopMin(art, player) {
    let interval = [];
    def(player, 'loop', {
        get: () => interval,
        set: (value) => {
            if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
                const start = clamp(value[0], 0, Math.min(value[1], player.duration));
                const end = clamp(value[1], start, player.duration);
                if (end - start >= 1) {
                    interval = [start, end];
                    art.emit('loop', interval);
                } else {
                    interval = [];
                    art.emit('loop');
                }
            } else {
                interval = [];
                art.emit('loop');
            }
        },
    });

    art.on('video:timeupdate', () => {
        if (interval.length) {
            if (player.currentTime < interval[0] || player.currentTime > interval[1]) {
                player.seek = interval[0];
            }
        }
    });
}
