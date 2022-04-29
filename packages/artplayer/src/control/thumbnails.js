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
                const { url, number, column } = option.thumbnails;
                const width = image.naturalWidth / column;
                const height = width / ($video.videoWidth / $video.videoHeight);
                const perWidth = $progress.clientWidth / number;
                const perIndex = Math.floor(posWidth / perWidth);
                const yIndex = Math.ceil(perIndex / column) - 1;
                const xIndex = perIndex % column || column - 1;
                setStyle($control, 'backgroundImage', `url(${url})`);
                setStyle($control, 'height', `${height}px`);
                setStyle($control, 'width', `${width}px`);
                setStyle($control, 'backgroundPosition', `-${xIndex * width}px -${yIndex * height}px`);
                if (posWidth <= width / 2) {
                    setStyle($control, 'left', 0);
                } else if (posWidth > $progress.clientWidth - width / 2) {
                    setStyle($control, 'left', `${$progress.clientWidth - width}px`);
                } else {
                    setStyle($control, 'left', `${posWidth - width / 2}px`);
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
                    setStyle($control, 'display', 'block');
                    showThumbnails(event);
                }
            });

            proxy($progress, 'mouseout', () => {
                setStyle($control, 'display', 'none');
            });
        },
    });
}
