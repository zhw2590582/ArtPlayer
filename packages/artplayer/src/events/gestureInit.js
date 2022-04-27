import { clamp, secondToTime, isMobile } from '../utils';

export function indicatorGestureInit(art, $indicator, setBar) {
    if (isMobile && !art.option.isLive) {
        const {
            plugins,
            template: { $progress },
            events: { proxy },
        } = art;

        let isDroging = false;

        proxy($indicator, 'touchstart', (event) => {
            if (event.touches.length === 1) {
                isDroging = true;
            }
        });

        proxy(document, 'touchmove', (event) => {
            if (event.touches.length === 1 && isDroging) {
                const autoOrientation = plugins.autoOrientation && plugins.autoOrientation.state;

                const { left, top } = $progress.getBoundingClientRect();
                const { clientX, clientY } = event.touches[0];

                const width = clamp(clientX - left, 0, $progress.clientWidth);
                const height = clamp(clientY - top, 0, $progress.clientWidth);
                const size = autoOrientation ? height : width;

                const secondX = (width / $progress.clientWidth) * art.duration;
                const secondY = (height / $progress.clientWidth) * art.duration;

                const second = autoOrientation ? secondY : secondX;
                const percentage = clamp(size / $progress.clientWidth, 0, 1);

                setBar('played', percentage);
                art.seek = second;
            }
        });

        proxy(document, 'touchend', () => {
            if (isDroging) {
                isDroging = false;
            }
        });
    }
}

export default function gestureInit(art, events) {
    if (isMobile && !art.option.isLive) {
        const {
            notice,
            plugins,
            template: { $video },
        } = art;

        let isDroging = false;
        let startX = 0;
        let startY = 0;
        let currentTime = 0;
        let pressTimer = null;

        events.proxy($video, 'touchstart', (event) => {
            if (event.touches.length === 1) {
                isDroging = true;
                const { clientX, clientY } = event.touches[0];
                startX = clientX;
                startY = clientY;

                clearTimeout(pressTimer);
                pressTimer = setTimeout(() => {
                    art.playbackRate = 3;
                }, 1000);
            }
        });

        events.proxy($video, 'touchmove', (event) => {
            if (event.touches.length === 1 && isDroging) {
                const autoOrientation = plugins.autoOrientation && plugins.autoOrientation.state;

                const { clientX, clientY } = event.touches[0];
                const ratioX = clamp((clientX - startX) / art.width, -1, 1);
                const ratioY = clamp((clientY - startY) / art.height, -1, 1);

                if (art.duration) {
                    if (autoOrientation) {
                        currentTime = clamp(art.currentTime + art.duration * ratioY, 0, art.duration);
                    } else {
                        currentTime = clamp(art.currentTime + art.duration * ratioX, 0, art.duration);
                    }
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
                startY = 0;
                currentTime = 0;
                isDroging = false;
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        });
    }
}
