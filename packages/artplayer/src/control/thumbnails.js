import { setStyle, isMobile } from '../utils';

export default function thumbnails(options) {
    return (art) => ({
        ...options,
        mounted: ($control) => {
            const {
                option,
                events: { loadImg },
                template: { $progress, $video },
            } = art;

            let timer = null;
            let image = null;
            let loading = false;
            let isLoad = false;

            function showThumbnails(posWidth) {
                const { url, number, column, width, height, interval } = option.thumbnails;
                const width2 = width || image.naturalWidth / column;
                const height2 = height || width2 / ($video.videoWidth / $video.videoHeight);

                let perIndex, xIndex, yIndex;
                if (interval === 0) {
                    const perWidth = $progress.clientWidth / number;
                    perIndex = Math.floor(posWidth / perWidth);
                    yIndex = Math.ceil(perIndex / column) - 1;
                    xIndex = perIndex % column || column - 1;
                } else {
                    const currentTime = $video.currentTime;
                    perIndex = Math.floor(currentTime / interval);
                    yIndex = Math.floor(perIndex / column);
                    xIndex = perIndex % column;
                }

                setStyle($control, 'backgroundImage', `url(${url})`);
                setStyle($control, 'height', `${height2}px`);
                setStyle($control, 'width', `${width2}px`);
                setStyle($control, 'backgroundPosition', `-${xIndex * width2}px -${yIndex * height2}px`);
                if (posWidth <= width2 / 2) {
                    setStyle($control, 'left', 0);
                } else if (posWidth > $progress.clientWidth - width2 / 2) {
                    setStyle($control, 'left', `${$progress.clientWidth - width2}px`);
                } else {
                    setStyle($control, 'left', `${posWidth - width2 / 2}px`);
                }
            }

            art.on('setBar', async (type, percentage, event) => {
                const isMobileDroging = type === 'played' && event && isMobile;

                if (type === 'hover' || isMobileDroging) {
                    if (!loading) {
                        loading = true;
                        image = await loadImg(option.thumbnails.url);
                        isLoad = true;
                    }

                    if (!isLoad) return;

                    const width = $progress.clientWidth * percentage;
                    setStyle($control, 'display', 'flex');

                    if (width > 0 && width < $progress.clientWidth) {
                        showThumbnails(width);
                    } else {
                        if (!isMobile) {
                            setStyle($control, 'display', 'none');
                        }
                    }

                    if (isMobileDroging) {
                        clearTimeout(timer);
                        timer = setTimeout(() => {
                            setStyle($control, 'display', 'none');
                        }, 500);
                    }
                }
            });
        },
    });
}
