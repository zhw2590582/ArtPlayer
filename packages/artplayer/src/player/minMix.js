import { append, setStyle, addClass, removeClass, hasClass, def } from '../utils';

export default function minMix(art, player) {
    const {
        i18n,
        option,
        events: { proxy },
        template: { $player, $minClose, $minTitle, $minHeader },
    } = art;

    let cacheStyle = '';
    let isDroging = false;
    let lastPageX = 0;
    let lastPageY = 0;
    let lastPlayerLeft = 0;
    let lastPlayerTop = 0;

    proxy($minHeader, 'mousedown', (event) => {
        isDroging = true;
        lastPageX = event.pageX;
        lastPageY = event.pageY;
        lastPlayerLeft = player.left;
        lastPlayerTop = player.top;
    });

    proxy(document, 'mousemove', (event) => {
        if (isDroging) {
            addClass($player, 'art-is-dragging');
            setStyle($player, 'left', `${lastPlayerLeft + event.pageX - lastPageX}px`);
            setStyle($player, 'top', `${lastPlayerTop + event.pageY - lastPageY}px`);
        }
    });

    proxy(document, 'mouseup', () => {
        isDroging = false;
        removeClass($player, 'art-is-dragging');
    });

    proxy($minClose, 'click', () => {
        player.min = false;
        isDroging = false;
        removeClass($player, 'art-is-dragging');
    });

    append($minTitle, option.title || i18n.get('Mini player'));

    def(player, 'min', {
        get() {
            return hasClass($player, 'art-min');
        },
        set(value) {
            if (value) {
                player.autoSize = false;
                cacheStyle = $player.style.cssText;
                addClass($player, 'art-min');
                const $body = document.body;
                setStyle($player, 'top', `${$body.clientHeight - player.height - 50}px`);
                setStyle($player, 'left', `${$body.clientWidth - player.width - 50}px`);
                player.aspectRatio = false;
                player.playbackRate = false;
                art.emit('minChange', true);
            } else if (player.min) {
                $player.style.cssText = cacheStyle;
                removeClass($player, 'art-min');
                setStyle($player, 'top', null);
                setStyle($player, 'left', null);
                player.aspectRatio = false;
                player.playbackRate = false;
                player.autoSize = option.autoSize;
                art.emit('minChange', false);
            }
        },
    });
}
