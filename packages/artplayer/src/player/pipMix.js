import { def } from '../utils';

function nativePip(art) {
    const {
        template: { $video },
        proxy,
        notice,
    } = art;

    $video.disablePictureInPicture = false;

    def(art, 'pip', {
        get() {
            return document.pictureInPictureElement;
        },
        set(value) {
            if (value) {
                art.state = 'pip';
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
        art.emit('pip', false);
    });
}

function webkitPip(art) {
    const { $video } = art.template;

    $video.webkitSetPresentationMode('inline');

    def(art, 'pip', {
        get() {
            return $video.webkitPresentationMode === 'picture-in-picture';
        },
        set(value) {
            if (value) {
                art.state = 'pip';
                $video.webkitSetPresentationMode('picture-in-picture');
                art.emit('pip', true);
            } else {
                $video.webkitSetPresentationMode('inline');
                art.emit('pip', false);
            }
        },
    });
}

export default function pipMix(art) {
    const {
        i18n,
        notice,
        template: { $video },
    } = art;
    if (document.pictureInPictureEnabled) {
        nativePip(art);
    } else if ($video.webkitSupportsPresentationMode) {
        webkitPip(art);
    } else {
        def(art, 'pip', {
            get() {
                return false;
            },
            set() {
                notice.show = i18n.get('PIP Not Supported');
            },
        });
    }
}
