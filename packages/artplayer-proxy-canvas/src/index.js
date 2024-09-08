export default function artplayerProxyCanvas(callback) {
    return (art) => {
        const { option, constructor } = art;
        const { createElement, def } = constructor.utils;

        const canvas = createElement('canvas');
        const ctx = canvas.getContext('2d');
        const video = createElement('video');

        let animationFrame = null;
        const { propertys, methods, prototypes, events } = constructor.config;
        const keys = [...propertys, ...methods, ...prototypes];

        keys.forEach((key) => {
            def(canvas, key, {
                get() {
                    const value = video[key];
                    return typeof value === 'function' ? value.bind(video) : value;
                },
                set(value) {
                    video[key] = value;
                },
            });
        });

        setTimeout(() => {
            for (let index = 0; index < events.length; index++) {
                const event = events[index];
                art.proxy(video, event, (event) => {
                    art.emit(`video:${event.type}`, event);
                });
            }
        });

        let lastDrawTime = 0;
        const drawFrame = (timestamp) => {
            if (!video.paused && !video.ended) {
                if (timestamp - lastDrawTime > 1000 / 30) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    lastDrawTime = timestamp;
                }
                animationFrame = requestAnimationFrame(drawFrame);
            }
        };

        const resize = () => {
            const player = art.template?.$player;
            if (!player || option.autoSize) return;

            const aspectRatio = canvas.videoWidth / canvas.videoHeight;
            const containerWidth = player.clientWidth;
            const containerHeight = player.clientHeight;
            const containerRatio = containerWidth / containerHeight;

            let paddingLeft = 0;
            let paddingTop = 0;

            if (containerRatio > aspectRatio) {
                const canvasWidth = containerHeight * aspectRatio;
                paddingLeft = (containerWidth - canvasWidth) / 2;
            } else {
                const canvasHeight = containerWidth / aspectRatio;
                paddingTop = (containerHeight - canvasHeight) / 2;
            }

            Object.assign(canvas.style, {
                padding: `${paddingTop}px ${paddingLeft}px`,
            });
        };

        art.on('video:loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            resize();
        });

        art.on('video:play', () => {
            console.log('video:play');
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(drawFrame);
        });

        art.on('video:pause', () => {
            cancelAnimationFrame(animationFrame);
        });

        art.on('resize', resize);

        if (typeof callback === 'function') {
            callback.call(art, video, option.url, art);
        } else {
            video.src = option.url;
        }

        return canvas;
    };
}

if (typeof window !== 'undefined') {
    window['artplayerProxyCanvas'] = artplayerProxyCanvas;
}
