import { append, setStyle, addClass, removeClass, hasClass, def, isInViewport } from '../utils';

export default function miniMix(art) {
    const {
        i18n,
        option,
        storage,
        proxy,
        template: { $player, $miniClose, $miniTitle, $miniHeader },
    } = art;

    let isDroging = false;
    let lastPageX = 0;
    let lastPageY = 0;
    let lastPlayerLeft = 0;
    let lastPlayerTop = 0;

    proxy($miniHeader, 'mousedown', (event) => {
        isDroging = true;
        lastPageX = event.pageX;
        lastPageY = event.pageY;
        lastPlayerLeft = art.left;
        lastPlayerTop = art.top;
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
        art.mini = false;
        isDroging = false;
        removeClass($player, 'art-is-dragging');
    });

    append($miniTitle, option.title || i18n.get('Mini Player'));

    def(art, 'mini', {
        get() {
            return hasClass($player, 'art-mini');
        },
        set(value) {
            if (value) {
                art.normalSize = 'mini';
                art.autoSize = false;
                addClass($player, 'art-mini');
                const top = storage.get('top');
                const left = storage.get('left');
                if (top && left) {
                    setStyle($player, 'top', `${top}px`);
                    setStyle($player, 'left', `${left}px`);
                    if (!isInViewport($miniHeader)) {
                        storage.del('top');
                        storage.del('left');
                        art.mini = true;
                    }
                } else {
                    const top = window.innerHeight - art.height - 50;
                    const left = window.innerWidth - art.width - 50;
                    storage.set('top', top);
                    storage.set('left', left);
                    setStyle($player, 'top', `${top}px`);
                    setStyle($player, 'left', `${left}px`);
                }
                art.aspectRatio = false;
                art.playbackRate = false;
                art.notice.show = '';
                art.emit('mini', true);
            } else {
                removeClass($player, 'art-mini');
                setStyle($player, 'top', null);
                setStyle($player, 'left', null);
                art.aspectRatio = false;
                art.playbackRate = false;
                art.autoSize = option.autoSize;
                art.notice.show = '';
                art.emit('mini', false);
            }
        },
    });
}
