import { append, setStyle } from '../utils';

function nativePip(art, player) {
    const {
        notice,
        template: { $video },
        events: { proxy },
    } = art;

    $video.disablePictureInPicture = false;

    Object.defineProperty(player, 'pip', {
        get() {
            return document.pictureInPictureElement;
        },
        set(value) {
            if (value) {
                $video.requestPictureInPicture().catch(error => {
                    notice.show(error, true, 3000);
                    console.warn(error);
                });
            } else {
                document.exitPictureInPicture().catch(error => {
                    notice.show(error, true, 3000);
                    console.warn(error);
                });
            }
        },
    });

    proxy($video, 'enterpictureinpicture', () => {
        art.emit('pipEnabled');
    });

    proxy($video, 'leavepictureinpicture', () => {
        art.emit('pipExit');
    });

    art.on('destroy', () => {
        if (player.pip) {
            player.pip = false;
        }
    });
}

function webkitPip(art, player) {
    const { $video } = art.template;

    $video.webkitSetPresentationMode('inline');

    Object.defineProperty(player, 'pip', {
        get() {
            return $video.webkitPresentationMode === 'picture-in-picture';
        },
        set(value) {
            if (value) {
                $video.webkitSetPresentationMode('picture-in-picture');
                art.emit('pipEnabled');
            } else {
                $video.webkitSetPresentationMode('inline');
                art.emit('pipExit');
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
            $player.classList.add('is-dragging');
            setStyle($player, 'left', `${lastPlayerLeft + event.pageX - lastPageX}px`);
            setStyle($player, 'top', `${lastPlayerTop + event.pageY - lastPageY}px`);
        }
    });

    proxy(document, 'mouseup', () => {
        isDroging = false;
        $player.classList.remove('is-dragging');
    });

    proxy($pipClose, 'click', () => {
        player.pip = false;
        isDroging = false;
        $player.classList.remove('is-dragging');
    });

    append($pipTitle, option.title || i18n.get('Mini player'));
    Object.defineProperty(player, 'pip', {
        get() {
            return $player.classList.contains('artplayer-pip');
        },
        set(value) {
            if (value) {
                player.autoSize = false;
                cacheStyle = $player.style.cssText;
                $player.classList.add('artplayer-pip');
                const $body = document.body;
                setStyle($player, 'top', `${$body.clientHeight - player.height - 50}px`);
                setStyle($player, 'left', `${$body.clientWidth - player.width - 50}px`);
                player.fullscreen = false;
                player.fullscreenWeb = false;
                player.aspectRatio = false;
                player.playbackRate = false;
                art.emit('pipEnabled');
            } else if (player.pip) {
                $player.style.cssText = cacheStyle;
                $player.classList.remove('artplayer-pip');
                setStyle($player, 'top', null);
                setStyle($player, 'left', null);
                player.fullscreen = false;
                player.fullscreenWeb = false;
                player.aspectRatio = false;
                player.playbackRate = false;
                player.autoSize = true;
                art.emit('pipExit');
            }
        },
    });
}

export default function pipMix(art, player) {
    const { $video } = art.template;
    if (document.pictureInPictureEnabled) {
        nativePip(art, player);
    } else if ($video.webkitSupportsPresentationMode && typeof $video.webkitSetPresentationMode === 'function') {
        webkitPip(art, player);
    } else {
        customPip(art, player);
    }

    Object.defineProperty(player, 'pipToggle', {
        set(value) {
            if (value) {
                player.pip = !player.pip;
            }
        },
    });
}
