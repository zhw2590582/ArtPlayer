import { def } from '../utils';

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
                $video.requestPictureInPicture().catch((err) => {
                    notice.show = err;
                    throw err;
                });
            } else {
                document.exitPictureInPicture().catch((err) => {
                    notice.show = err;
                    throw err;
                });
            }
        },
    });

    proxy($video, 'enterpictureinpicture', () => {
        art.emit('pip', true);
    });

    proxy($video, 'leavepictureinpicture', () => {
        art.emit('pip');
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
                art.emit('pip', true);
            } else {
                $video.webkitSetPresentationMode('inline');
                art.emit('pip');
            }
        },
    });
}

export default function pipMix(art, player) {
    const {
        i18n,
        notice,
        template: { $video },
    } = art;
    if (document.pictureInPictureEnabled) {
        nativePip(art, player);
    } else if ($video.webkitSupportsPresentationMode) {
        webkitPip(art, player);
    } else {
        def(player, 'pip', {
            get() {
                return false;
            },
            set() {
                notice.show = i18n.get('PIP not supported');
            },
        });
    }

    def(player, 'pipToggle', {
        set(value) {
            if (value) {
                player.pip = !player.pip;
            }
        },
    });
}
