import { append, setStyle, addClass, removeClass, hasClass, def, isInViewport } from '../utils';

export default function miniMix(art, player) {
    const {
        i18n,
        option,
        storage,
        events: { proxy },
        template: { $player, $miniClose, $miniTitle, $miniHeader },
    } = art;

    let cacheStyle = '';
    let isDroging = false;
    let lastPageX = 0;
    let lastPageY = 0;
    let lastPlayerLeft = 0;
    let lastPlayerTop = 0;

    proxy($miniHeader, 'mousedown', (event) => {
        isDroging = true;
        lastPageX = event.pageX;
        lastPageY = event.pageY;
        lastPlayerLeft = player.left;
        lastPlayerTop = player.top;
    });

    proxy(document, 'mousemove', (event) => {
        if (isDroging) {
            addClass($player, 'art-is-dragging');
            const top = lastPlayerTop + event.pageY - lastPageY;
            const left = lastPlayerLeft + event.pageX - lastPageX;
            setStyle($player, 'top', `${top}px`);
            setStyle($player, 'left', `${left}px`);
            storage.set('top', top);
            storage.set('left', left);
        }
    });

    proxy(document, 'mouseup', () => {
        isDroging = false;
        removeClass($player, 'art-is-dragging');
    });

    proxy($miniClose, 'click', () => {
        player.mini = false;
        isDroging = false;
        removeClass($player, 'art-is-dragging');
    });

    append($miniTitle, option.title || i18n.get('Mini player'));

    def(player, 'mini', {
        get() {
            return hasClass($player, 'art-mini');
        },
        set(value) {
            if (value) {
                player.autoSize = false;
                cacheStyle = $player.style.cssText;
                addClass($player, 'art-mini');
                const top = storage.get('top');
                const left = storage.get('left');
                if (top && left) {
                    setStyle($player, 'top', `${top}px`);
                    setStyle($player, 'left', `${left}px`);
                    if (!isInViewport($miniHeader)) {
                        storage.del('top');
                        storage.del('left');
                        player.mini = true;
                    }
                } else {
                    const $body = document.body;
                    const top = $body.clientHeight - player.height - 50;
                    const left = $body.clientWidth - player.width - 50;
                    storage.set('top', top);
                    storage.set('left', left);
                    setStyle($player, 'top', `${top}px`);
                    setStyle($player, 'left', `${left}px`);
                }
                player.aspectRatio = false;
                player.playbackRate = false;
                art.emit('mini', true);
            } else {
                $player.style.cssText = cacheStyle;
                removeClass($player, 'art-mini');
                setStyle($player, 'top', null);
                setStyle($player, 'left', null);
                player.aspectRatio = false;
                player.playbackRate = false;
                player.autoSize = option.autoSize;
                art.emit('mini');
            }
        },
    });

    def(player, 'miniToggle', {
        set(value) {
            if (value) {
                player.mini = !player.mini;
            }
        },
    });
}
