import { append, setStyle, addClass, removeClass, hasClass, def } from '../utils';

function nativePip(art, player) {
    const {
        template: { $video },
        events: { proxy },
        notice,
    } = art;

    $video.disablePictureInPicture = false;

    def(player, 'pip', {
        get() {
            return document.pictureInPictureElement;
        },
        set(value) {
            if (value) {
                $video.requestPictureInPicture().catch(err => {
                    notice.show = err;
                    throw err;
                });
            } else {
                document.exitPictureInPicture().catch(err => {
                    notice.show = err;
                    throw err;
                });
            }
        },
    });

    proxy($video, 'enterpictureinpicture', () => {
        art.emit('pipChange', true);
    });

    proxy($video, 'leavepictureinpicture', () => {
        art.emit('pipChange', false);
    });
}

function webkitPip(art, player) {
    const { $video } = art.template;

    $video.webkitSetPresentationMode('inline');

    def(player, 'pip', {
        get() {
            return $video.webkitPresentationMode === 'picture-in-picture';
        },
        set(value) {
            if (value) {
                $video.webkitSetPresentationMode('picture-in-picture');
                art.emit('pipChange', true);
            } else {
                $video.webkitSetPresentationMode('inline');
                art.emit('pipChange', false);
            }
        },
    });
}

function customPip(art, player) {
    const {
        option,
        i18n,
        template: { $player, $pipClose, $pipTitle, $pipHeader },
        events: { proxy },
    } = art;

    let cacheStyle = '';
    let isDroging = false;
    let lastPageX = 0;
    let lastPageY = 0;
    let lastPlayerLeft = 0;
    let lastPlayerTop = 0;

    proxy($pipHeader, 'mousedown', event => {
        isDroging = true;
        lastPageX = event.pageX;
        lastPageY = event.pageY;
        lastPlayerLeft = player.left;
        lastPlayerTop = player.top;
    });

    proxy($pipHeader, 'mousemove', event => {
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

    proxy($pipClose, 'click', () => {
        player.pip = false;
        isDroging = false;
        removeClass($player, 'art-is-dragging');
    });

    append($pipTitle, option.title || i18n.get('Mini player'));

    def(player, 'pip', {
        get() {
            return hasClass($player, 'art-pip');
        },
        set(value) {
            if (value) {
                player.autoSize = false;
                cacheStyle = $player.style.cssText;
                addClass($player, 'art-pip');
                const $body = document.body;
                setStyle($player, 'top', `${$body.clientHeight - player.height - 50}px`);
                setStyle($player, 'left', `${$body.clientWidth - player.width - 50}px`);
                player.aspectRatio = false;
                player.playbackRate = false;
                art.emit('pipChange', true);
            } else if (player.pip) {
                $player.style.cssText = cacheStyle;
                removeClass($player, 'art-pip');
                setStyle($player, 'top', null);
                setStyle($player, 'left', null);
                player.aspectRatio = false;
                player.playbackRate = false;
                player.autoSize = true;
                art.emit('pipChange', false);
            }
        },
    });
}

export default function pipMix(art, player) {
    const { $video } = art.template;
    if (document.pictureInPictureEnabled) {
        nativePip(art, player);
    } else if ($video.webkitSupportsPresentationMode) {
        webkitPip(art, player);
    } else {
        customPip(art, player);
    }

    def(player, 'pipToggle', {
        set(value) {
            if (value) {
                player.pip = !player.pip;
            }
        },
    });
}
