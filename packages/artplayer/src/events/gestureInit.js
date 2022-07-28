import { clamp, secondToTime, isMobile, includeFromEvent } from '../utils';

export default function gestureInit(art, events) {
    if (isMobile && !art.option.isLive) {
        const { $video, $bottom, $controls } = art.template;

        let isDroging = false;
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        const onTouchStart = (event) => {
            if (event.touches.length === 1 && !art.isLock) {
                isDroging = true;
                const { clientX, clientY } = event.touches[0];
                startX = clientX;
                startY = clientY;
                startTime = art.currentTime;
            }
        };

        const onTouchMove = (event) => {
            if (event.touches.length === 1 && isDroging && art.duration) {
                const autoOrientation = art.plugins.autoOrientation && art.plugins.autoOrientation.state;
                const { clientX, clientY } = event.touches[0];
                const ratioX = clamp((clientX - startX) / art.width, -1, 1);
                const ratioY = clamp((clientY - startY) / art.height, -1, 1);
                const ratio = autoOrientation ? ratioY : ratioX;
                const currentTime = clamp(
                    startTime + art.duration * ratio * art.constructor.TOUCH_MOVE_RATIO,
                    0,
                    art.duration,
                );
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
            }
        };

        events.proxy($bottom, 'touchstart', (event) => {
            if (!includeFromEvent(event, $controls)) {
                onTouchStart(event);
            }
        });

        events.proxy($bottom, 'touchmove', onTouchMove);
        events.proxy($video, 'touchstart', onTouchStart);
        events.proxy($video, 'touchmove', onTouchMove);
        events.proxy(document, 'touchend', onTouchEnd);
    }
}
