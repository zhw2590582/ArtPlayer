import { setStyle } from '../utils';
import { getPosFromEvent } from './progress';

export default function thumbnails(options) {
    return (art) => ({
        ...options,
        mounted: ($control) => {
            const {
                option,
                template: { $progress, $video },
                events: { proxy, loadImg },
            } = art;

            let image = null;
            let loading = false;
            let isLoad = false;

            function showThumbnails(event) {
                const { width: posWidth } = getPosFromEvent(art, event);
                const { url, number, column, width, height } = option.thumbnails;
                const width2 = width || image.naturalWidth / column;
                const height2 = height || width2 / ($video.videoWidth / $video.videoHeight);
                const perWidth = $progress.clientWidth / number;
                const perIndex = Math.floor(posWidth / perWidth);
                const yIndex = Math.ceil(perIndex / column) - 1;
                const xIndex = perIndex % column || column - 1;
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

            proxy($progress, 'mousemove', async (event) => {
                if (!loading) {
                    loading = true;
                    const img = await loadImg(option.thumbnails.url);
                    image = img;
                    isLoad = true;
                }

                if (isLoad) {
                    setStyle($control, 'display', 'flex');
                    showThumbnails(event);
                }
            });

            proxy($progress, 'mouseleave', () => {
                setStyle($control, 'display', 'none');
            });

            art.on('hover', (state) => {
                if (!state) {
                    setStyle($control, 'display', 'none');
                }
            });
        },
    });
}
