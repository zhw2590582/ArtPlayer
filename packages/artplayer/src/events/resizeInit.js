import { debounce } from '../utils';

export default function resizeInit(art, events) {
    const { option, constructor } = art;

    art.on('resize', () => {
        const { aspectRatio, notice } = art;
        if (art.state === 'standard' && option.autoSize) {
            art.autoSize();
        }
        art.aspectRatio = aspectRatio;
        notice.show = '';
    });

    const resizeFn = debounce(() => art.emit('resize'), constructor.RESIZE_TIME);
    events.proxy(window, ['orientationchange', 'resize'], () => resizeFn());
    if (screen && screen.orientation && screen.orientation.onchange) {
        events.proxy(screen.orientation, 'change', () => resizeFn());
    }
}
