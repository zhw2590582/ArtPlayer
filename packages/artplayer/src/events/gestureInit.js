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
        let pressTimer = null;

        events.proxy($video, 'touchstart', (event) => {
            if (event.touches.length === 1) {
                isDroging = true;
                startX = event.touches[0].clientX;

                clearTimeout(pressTimer);
                pressTimer = setTimeout(() => {
                    art.playbackRate = 3;
                }, 1000);
            }
        });

        events.proxy($video, 'touchmove', (event) => {
            if (event.touches.length === 1 && isDroging) {
                const { clientX } = event.touches[0];
                const ratioX = clamp((clientX - startX) / art.width, -1, 1);

                if (art.duration) {
                    currentTime = clamp(art.currentTime + art.duration * ratioX, 0, art.duration);
                    notice.show = `${secondToTime(currentTime)} / ${secondToTime(art.duration)}`;
                }
            }
        });

        events.proxy(document, 'touchend', () => {
            if (isDroging) {
                if (currentTime) {
                    art.seek = currentTime;
                }

                if (art.playbackRate === 3) {
                    art.playbackRate = 1;
                }

                startX = 0;
                currentTime = 0;
                isDroging = false;
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        });
    }
}
