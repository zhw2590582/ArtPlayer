import { debounce, isInViewport } from '../utils';

export default function viewInit(art, events) {
    const {
        player,
        option: { autoMin },
        template: { $container },
    } = art;

    const scrollFn = debounce(() => {
        art.emit('view', isInViewport($container));
    }, 200);

    events.proxy(window, 'scroll', () => {
        scrollFn();
    });

    art.on('view', (state) => {
        if (autoMin) {
            player.min = !state;
        }
    });
}
