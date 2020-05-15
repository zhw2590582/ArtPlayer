import { throttle } from '../utils';

export default function resizeInit(art, events) {
    const { option, player } = art;

    const resizeFn = throttle(() => {
        if (option.autoSize) {
            if (!player.fullscreen && !player.fullscreenWeb && !player.fullscreenRotate && !player.pip && !player.min) {
                player.autoSize = true;
            } else {
                player.autoSize = false;
            }
        }
        player.aspectRatioReset = true;
        art.emit('resize', {
            width: player.width,
            height: player.height,
        });
    }, 500);

    events.proxy(window, ['orientationchange', 'resize'], () => {
        resizeFn();
    });
}
