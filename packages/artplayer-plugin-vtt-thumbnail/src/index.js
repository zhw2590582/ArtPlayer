import getVttArray from './getVttArray';

export default function artplayerPluginVttThumbnail(option) {
    return async (art) => {
        const {
            constructor: {
                utils: { setStyle, clamp },
            },
            template: { $progress },
            events: { proxy },
        } = art;

        const vttArray = await getVttArray(option.vtt);

        function getPosFromEvent(art, event) {
            const { $progress } = art.template;
            const { left } = $progress.getBoundingClientRect();
            const width = clamp(event.pageX - left, 0, $progress.clientWidth);
            const second = (width / $progress.clientWidth) * art.duration;
            return { width, second };
        }

        art.controls.add({
            name: 'thumbnails',
            position: 'top',
            index: 20,
            style: option.style || {},
            mounted($control) {
                proxy($progress, 'mousemove', async (event) => {
                    setStyle($control, 'display', 'block');
                    const { second, width } = getPosFromEvent(art, event);
                    const find = vttArray.find((item) => second >= item.start && second <= item.end);
                    if (!find) return setStyle($control, 'display', 'none');

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

        return {
            name: 'artplayerPluginVttThumbnail',
        };
    };
}

artplayerPluginVttThumbnail.env = process.env.NODE_ENV;
artplayerPluginVttThumbnail.version = process.env.APP_VER;
artplayerPluginVttThumbnail.build = process.env.BUILD_DATE;

if (typeof window !== 'undefined') {
    window['artplayerPluginVttThumbnail'] = artplayerPluginVttThumbnail;
}
