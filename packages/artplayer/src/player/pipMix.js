import Draggabilly from 'draggabilly';
import { setStyle, append } from '../utils';

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
        template: { $player, $pipClose, $pipTitle },
        events: { destroyEvents, proxy },
    } = art;
    let cachePos = null;
    let draggie = null;

    Object.defineProperty(player, 'pip', {
        get() {
            return $player.classList.contains('artplayer-pip');
        },
        set(value) {
            if (value) {
                if (player.autoSize) {
                    player.autoSize = false;
                }

                if (!draggie) {
                    draggie = new Draggabilly($player, {
                        handle: '.artplayer-pip-header',
                    });

                    append($pipTitle, option.title || i18n.get('Mini player'));

                    proxy($pipClose, 'click', () => {
                        player.pip = false;
                    });

                    destroyEvents.push(() => {
                        draggie.destroy();
                    });
                } else if (cachePos && cachePos.x !== 0 && cachePos.y !== 0) {
                    setStyle($player, 'left', `${cachePos.x}px`);
                    setStyle($player, 'top', `${cachePos.y}px`);
                }

                $player.classList.add('artplayer-pip');
                player.fullscreen = false;
                player.fullscreenWeb = false;
                player.aspectRatio = false;
                player.playbackRate = false;
                art.emit('pipEnabled');
            } else if (player.pip) {
                $player.classList.remove('artplayer-pip');
                cachePos = draggie.position;
                setStyle($player, 'left', null);
                setStyle($player, 'top', null);
                player.fullscreen = false;
                player.fullscreenWeb = false;
                player.aspectRatio = false;
                player.playbackRate = false;
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
