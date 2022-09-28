import { clamp, secondToTime, isMobile } from '../utils';
import { setCurrentTime } from '../control/progress';

export default function gestureInit(art, events) {
    if (isMobile && !art.option.isLive) {
        const { $video, $progress } = art.template;

        let touchTarget = null;
        let isDroging = false;
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        const onTouchStart = (event) => {
            if (event.touches.length === 1 && !art.isLock) {
                if (touchTarget === $progress) {
                    setCurrentTime(art, event);
                }

                isDroging = true;
                const { clientX, clientY } = event.touches[0];
                startX = clientX;
                startY = clientY;
                startTime = art.currentTime;
            }
        };

        const onTouchMove = (event) => {
            if (event.touches.length === 1 && isDroging && art.duration) {
                const { clientX, clientY } = event.touches[0];
                const ratioX = clamp((clientX - startX) / art.width, -1, 1);
                const ratioY = clamp((clientY - startY) / art.height, -1, 1);
                const ratio = art.isRotate ? ratioY : ratioX;
                const TOUCH_MOVE_RATIO = touchTarget === $video ? art.constructor.TOUCH_MOVE_RATIO : 1;
                const currentTime = clamp(startTime + art.duration * ratio * TOUCH_MOVE_RATIO, 0, art.duration);
                art.seek = currentTime;
                art.emit('setBar', 'played', clamp(currentTime / art.duration, 0, 1));
                art.notice.show = `${secondToTime(currentTime)} / ${secondToTime(art.duration)}`;
            }
        };

        const onTouchEnd = () => {
            if (isDroging) {
                startX = 0;
                startY = 0;
                startTime = 0;
                isDroging = false;
                touchTarget = null;
            }
        };

        events.proxy($progress, 'touchstart', (event) => {
            touchTarget = $progress;
            onTouchStart(event);
        });

        events.proxy($video, 'touchstart', (event) => {
            touchTarget = $video;
            onTouchStart(event);
        });

        events.proxy($video, 'touchmove', onTouchMove);
        events.proxy($progress, 'touchmove', onTouchMove);
        events.proxy(document, 'touchend', onTouchEnd);
    }
}
