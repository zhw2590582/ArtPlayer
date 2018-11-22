import { setStyle } from '../utils';
import { getPosFromEvent } from './progress';

export default function thumbnails(controlOption) {
    return art => ({
        ...controlOption,
        mounted: $control => {
            const {
                refs: { $progress },
                events: { proxy, loadImg },
            } = art;
            let loading = false;
            let isLoad = false;

            function showThumbnails(event) {
                const { width: posWidth } = getPosFromEvent(art, event);
                const { url, height, width, number, column } = art.option.thumbnails;
                const perWidth = $progress.clientWidth / number;
                const perIndex = Math.ceil(posWidth / perWidth);
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

            proxy($progress, 'mousemove', event => {
                if (!loading) {
                    loading = true;
                    loadImg(art.option.thumbnails.url).then(() => {
                        isLoad = true;
                    });
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
