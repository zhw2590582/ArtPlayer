import { debounce } from '../utils';

export default function autoPip(art) {
    const { events, player, template } = art;
    const scrollDebounce = debounce(() => {
        const { top, height } = template.$player.getBoundingClientRect();
        if (top + height <= 0 && !player.pip && player.playing) {
            player.pip = true;
            art.emit('artplayerPluginAutoPip', true);
        } else if (player.pip) {
            player.pip = false;
            art.emit('artplayerPluginAutoPip', false);
        }
    }, 300);
    events.proxy(window, 'scroll', scrollDebounce);

    return {
        name: 'autoPip',
    };
}
