import { append, setStyle, hasClass, addClass, removeClass } from '../utils';

export default function lock(art) {
    const {
        layers,
        icons,
        template: { $player },
    } = art;

    layers.add({
        name: 'lock',
        mounted($el) {
            const $lock = append($el, icons.lock);
            const $unlock = append($el, icons.unlock);
            setStyle($lock, 'display', 'none');

            art.on('lock', (state) => {
                if (state) {
                    setStyle($lock, 'display', 'inline-flex');
                    setStyle($unlock, 'display', 'none');
                } else {
                    setStyle($lock, 'display', 'none');
                    setStyle($unlock, 'display', 'inline-flex');
                }
            });
        },
        click() {
            if (hasClass($player, 'art-lock')) {
                removeClass($player, 'art-lock');
                this.isLock = false;
                art.emit('lock', false);
            } else {
                addClass($player, 'art-lock');
                this.isLock = true;
                art.emit('lock', true);
            }
        },
    });

    return {
        name: 'lock',
        get state() {
            return hasClass($player, 'art-lock');
        },
    };
}
