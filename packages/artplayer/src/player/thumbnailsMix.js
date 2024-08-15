import { def, setStyle, isMobile } from '../utils';

export default function thumbnailsMix(art) {
    const {
        option,
        events: { loadImg },
        template: { $progress, $video },
    } = art;

    let timer = null;
    let image = null;
    let loading = false;
    let isLoad = false;

    function reset() {
        clearTimeout(timer);
        timer = null;
        image = null;
        loading = false;
        isLoad = false;
    }

    function showThumbnails(posWidth) {
        const $thumbnails = art.controls?.thumbnails;
        if (!$thumbnails) return;

        const { url, number, column, width, height } = option.thumbnails;
        const width2 = width || image.naturalWidth / column;
        const height2 = height || width2 / ($video.videoWidth / $video.videoHeight);
        const perWidth = $progress.clientWidth / number;
        const perIndex = Math.floor(posWidth / perWidth);
        const yIndex = Math.ceil(perIndex / column) - 1;
        const xIndex = perIndex % column || column - 1;
        setStyle($thumbnails, 'backgroundImage', `url(${url})`);
        setStyle($thumbnails, 'height', `${height2}px`);
        setStyle($thumbnails, 'width', `${width2}px`);
        setStyle($thumbnails, 'backgroundPosition', `-${xIndex * width2}px -${yIndex * height2}px`);
        if (posWidth <= width2 / 2) {
            setStyle($thumbnails, 'left', 0);
        } else if (posWidth > $progress.clientWidth - width2 / 2) {
            setStyle($thumbnails, 'left', `${$progress.clientWidth - width2}px`);
        } else {
            setStyle($thumbnails, 'left', `${posWidth - width2 / 2}px`);
        }
    }

    art.on('setBar', async (type, percentage, event) => {
        const $thumbnails = art.controls?.thumbnails;
        const { url } = option.thumbnails;
        if (!$thumbnails || !url) return;

        const isMobileDroging = type === 'played' && event && isMobile;

        if (type === 'hover' || isMobileDroging) {
            if (!loading) {
                loading = true;
                image = await loadImg(url);
                isLoad = true;
            }

            if (!isLoad) return;

            const width = $progress.clientWidth * percentage;
            setStyle($thumbnails, 'display', 'flex');

            if (width > 0 && width < $progress.clientWidth) {
                showThumbnails(width);
            } else {
                if (!isMobile) {
                    setStyle($thumbnails, 'display', 'none');
                }
            }

            if (isMobileDroging) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    setStyle($thumbnails, 'display', 'none');
                }, 500);
            }
        }
    });

    def(art, 'thumbnails', {
        get() {
            return art.option.thumbnails;
        },
        set(thumbnails) {
            if (thumbnails.url && !art.option.isLive) {
                art.option.thumbnails = thumbnails;
                reset();
            }
        },
    });
}
