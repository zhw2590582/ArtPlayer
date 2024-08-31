import getVttArray from './getVttArray';

export default function artplayerPluginVttThumbnail(option) {
    return async (art) => {
        const {
            constructor: {
                utils: { setStyle, isMobile, addClass },
            },
            template: { $progress },
        } = art;

        let timer = null;
        const thumbnails = await getVttArray(option.vtt);

        function showThumbnails($control, find, width) {
            setStyle($control, 'backgroundImage', `url(${find.url})`);
            setStyle($control, 'height', `${find.h}px`);
            setStyle($control, 'width', `${find.w}px`);
            setStyle($control, 'backgroundPosition', `-${find.x}px -${find.y}px`);
            if (width <= find.w / 2) {
                setStyle($control, 'left', 0);
            } else if (width > $progress.clientWidth - find.w / 2) {
                setStyle($control, 'left', `${$progress.clientWidth - find.w}px`);
            } else {
                setStyle($control, 'left', `${width - find.w / 2}px`);
            }
        }

        art.controls.add({
            name: 'vtt-thumbnail',
            position: 'top',
            index: 20,
            style: option.style || {},
            mounted($control) {
                addClass($control, 'art-control-thumbnails');
                art.on('setBar', async (type, percentage, event) => {
                    const isMobileDroging = type === 'played' && event && isMobile;

                    if (type === 'hover' || isMobileDroging) {
                        const width = $progress.clientWidth * percentage;
                        const second = percentage * art.duration;
                        setStyle($control, 'display', 'flex');

                        const find = thumbnails.find((item) => second >= item.start && second <= item.end);
                        if (!find) return setStyle($control, 'display', 'none');

                        if (width > 0 && width < $progress.clientWidth) {
                            showThumbnails($control, find, width);
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

        return {
            name: 'artplayerPluginVttThumbnail',
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginVttThumbnail'] = artplayerPluginVttThumbnail;
}
