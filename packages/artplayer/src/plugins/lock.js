import { append, setStyle, hasClass, addClass, removeClass } from '../utils';

export default function lock(art) {
    const {
        layers,
        icons,
        template: { $player },
    } = art;

    function getState() {
        return hasClass($player, 'art-lock');
    }

    function setLock() {
        addClass($player, 'art-lock');
        art.isLock = true;
        art.emit('lock', true);
    }

    function setUnlock() {
        removeClass($player, 'art-lock');
        art.isLock = false;
        art.emit('lock', false);
    }

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
            if (getState()) {
                setUnlock();
            } else {
                setLock();
            }
        },
    });

    return {
        name: 'lock',
        get state() {
            return getState();
        },
        set state(value) {
            if (value) {
                setLock();
            } else {
                setUnlock();
            }
        },
    };
}
