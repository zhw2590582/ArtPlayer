import { throttle, isInViewport } from '../utils';

export default function viewInit(art, events) {
    const {
        player,
        option,
        template: { $container },
    } = art;

    const scrollFn = throttle(() => {
        art.emit('view', isInViewport($container, 50));
    }, 200);

    events.proxy(window, 'scroll', () => {
        scrollFn();
    });

    art.on('view', (state) => {
        if (option.autoMini) {
            art.mini = !state;
        }
    });
}
