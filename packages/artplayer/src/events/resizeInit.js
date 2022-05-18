import { throttle } from '../utils';

export default function resizeInit(art, events) {
    const { option } = art;

    const resizeFn = throttle(() => {
        if (art.normalSize) {
            art.autoSize = option.autoSize;
        }
        art.aspectRatioReset = true;
        art.notice.show = '';
        art.emit('resize');
    }, art.constructor.RESIZE_TIME);

    events.proxy(window, ['orientationchange', 'resize'], () => {
        resizeFn();
    });

    if (screen && screen.orientation && screen.orientation.onchange) {
        events.proxy(screen.orientation, 'change', () => {
            resizeFn();
        });
    }
}
