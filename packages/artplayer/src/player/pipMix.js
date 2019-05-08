import Draggabilly from 'draggabilly';
import { setStyle, append } from '../utils';

function nativePip(art, player) {
    const {
        notice,
        template: { $video },
        events: { proxy },
    } = art;

    $video.disablePictureInPicture = false;

    Object.defineProperty(player, 'pipState', {
        get: () => document.pictureInPictureElement,
    });

    Object.defineProperty(player, 'pipEnabled', {
        value: () => {
            $video.requestPictureInPicture().catch(error => {
                notice.show(error, true, 3000);
                console.warn(error);
            });
        },
    });

    Object.defineProperty(player, 'pipExit', {
        value: () => {
            document.exitPictureInPicture().catch(error => {
                notice.show(error, true, 3000);
                console.warn(error);
            });
        },
    });

    proxy($video, 'enterpictureinpicture', () => {
        art.emit('pipEnabled');
    });

    proxy($video, 'leavepictureinpicture', () => {
        art.emit('pipExit');
    });

    art.on('destroy', () => {
        if (player.pipState) {
            player.pipExit();
        }
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

    Object.defineProperty(player, 'pipState', {
        get: () => $player.classList.contains('artplayer-pip'),
    });

    Object.defineProperty(player, 'pipEnabled', {
        value: () => {
            if (player.autoSizeState) {
                player.autoSizeRemove();
            }

            if (!draggie) {
                draggie = new Draggabilly($player, {
                    handle: '.artplayer-pip-header',
                });

                append($pipTitle, option.title || i18n.get('Mini player'));

                proxy($pipClose, 'click', () => {
                    player.pipExit();
                });

                destroyEvents.push(() => {
                    draggie.destroy();
                });
            } else if (cachePos && cachePos.x !== 0 && cachePos.y !== 0) {
                setStyle($player, 'left', `${cachePos.x}px`);
                setStyle($player, 'top', `${cachePos.y}px`);
            }

            $player.classList.add('artplayer-pip');
            player.fullscreenExit();
            player.fullscreenWebExit();
            player.aspectRatioRemove();
            player.playbackRateRemove();
            art.emit('pipEnabled');
        },
    });

    Object.defineProperty(player, 'pipExit', {
        value: () => {
            if (player.pipState) {
                $player.classList.remove('artplayer-pip');
                cachePos = draggie.position;
                setStyle($player, 'left', null);
                setStyle($player, 'top', null);
                player.fullscreenExit();
                player.fullscreenWebExit();
                player.aspectRatioRemove();
                player.playbackRateRemove();
                art.emit('pipExit');
            }
        },
    });
}

export default function pipMix(art, player) {
    if (document.pictureInPictureEnabled) {
        nativePip(art, player);
    } else {
        customPip(art, player);
    }

    Object.defineProperty(player, 'pipToggle', {
        value: () => {
            if (player.pipState) {
                player.pipExit();
            } else {
                player.pipEnabled();
            }
        },
    });
}
