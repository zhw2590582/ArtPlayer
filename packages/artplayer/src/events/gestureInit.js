import { clamp, secondToTime, isMobile } from '../utils';

export default function gestureInit(art, events) {
    if (isMobile && !art.option.isLive) {
        const {
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

        events.proxy($video, 'touchmove', (event) => {
            if (event.touches.length === 1 && isDroging) {
                const widthDiff = event.touches[0].clientX - startX;
                const proportion = clamp(widthDiff / $video.clientWidth, -1, 1);
                currentTime = clamp(art.currentTime + 60 * proportion, 0, art.duration);
                notice.show = `${secondToTime(currentTime)} / ${secondToTime(art.duration)}`;
            }
        });

        events.proxy(document, 'touchend', () => {
            if (isDroging && currentTime) {
                art.seek = currentTime;
            }
            isDroging = false;
            startX = 0;
            currentTime = 0;
        });
    }
}
