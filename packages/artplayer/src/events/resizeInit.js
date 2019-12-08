import { throttle } from '../utils';

export default function resizeInit(art, events) {
    const {
        option,
        player,
        template: { $player },
    } = art;

    const object = document.createElement('object');
    object.setAttribute('aria-hidden', 'true');
    object.setAttribute('tabindex', -1);
    object.type = 'text/html';
    object.data = 'about:blank';
    let playerWidth = player.width;
    let playerHeight = player.height;
    const resizeFn = throttle(() => {
        if (player.width !== playerWidth || player.height !== playerHeight) {
            playerWidth = player.width;
            playerHeight = player.height;
            if (option.autoSize) {
                if (!player.fullscreen && !player.fullscreenWeb && !player.pip) {
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
        }
    }, 500);

    events.proxy(object, 'load', () => {
        events.proxy(object.contentDocument.defaultView, 'resize', resizeFn);
    });

    $player.appendChild(object);
}
