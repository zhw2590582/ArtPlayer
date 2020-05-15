import { clamp, secondToTime } from '../utils';

export default function gestureInit(art, events) {
    if (art.isMobile && !art.option.isLive) {
        const {
            player,
            notice,
            template: { $video },
        } = art;

        let isDroging = false;
        let startX = 0;
        let currentTime = 0;

        events.proxy($video, 'touchstart', (event) => {
            if (event.touches.length === 1) {
                isDroging = true;
                startX = event.touches[0].clientX;
            }
        });

        events.proxy(document, 'touchmove', (event) => {
            if (event.touches.length === 1 && isDroging) {
                const widthDiff = event.touches[0].clientX - startX;
                const proportion = clamp(widthDiff / $video.clientWidth, -1, 1);
                currentTime = clamp(player.currentTime + 60 * proportion, 0, player.duration);
                notice.show = `${secondToTime(currentTime)} / ${secondToTime(player.duration)}`;
            }
        });

        events.proxy(document, 'touchend', () => {
            if (isDroging && currentTime) {
                player.seek = currentTime;
            }
            isDroging = false;
            startX = 0;
            currentTime = 0;
        });
    }
}
