import { throttle, setStyle } from '../utils';

export default function resizeInit(art, events) {
    const {
        option,
        constructor,
        template: { $player },
    } = art;

    art.on('resize', () => {
        const { aspectRatio, notice } = art;
        if (art.state === 'standard') {
            art.aspectRatio = aspectRatio;
            if (option.autoSize) art.autoSize();
        } else {
            // TODO: 全屏时计算不准确
            art.aspectRatio = 'default';
            setStyle($player, 'width', null);
            setStyle($player, 'height', null);
        }
        notice.show = '';
    });

    const resizeFn = throttle(() => art.emit('resize'), constructor.RESIZE_TIME);
    events.proxy(window, ['orientationchange', 'resize'], () => resizeFn());
    if (screen && screen.orientation && screen.orientation.onchange) {
        events.proxy(screen.orientation, 'change', () => resizeFn());
    }
}
