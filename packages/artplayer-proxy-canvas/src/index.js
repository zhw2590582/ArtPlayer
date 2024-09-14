export default function artplayerProxyCanvas(callback) {
    return (art) => {
        const { option, constructor } = art;
        const { createElement, def, append } = constructor.utils;

        const canvas = createElement('canvas');
        const ctx = canvas.getContext('2d');

        const video = createElement('video');
        video.playsInline = true;
        window.video = video;

        const track = createElement('track');
        track.default = true;
        track.kind = 'metadata';
        append(video, track);

        let animationFrame = null;
        const { propertys, methods, prototypes, events } = constructor.config;
        const keys = [...propertys, ...methods, ...prototypes];

        const originalCanvasProperties = {};
        ['width', 'height'].forEach((prop) => {
            originalCanvasProperties[prop] = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, prop);
        });

        keys.forEach((key) => {
            if (key === 'width' || key === 'height') {
                def(canvas, key, {
                    get() {
                        return originalCanvasProperties[key].get.call(this);
                    },
                    set(value) {
                        originalCanvasProperties[key].set.call(this, value);
                        video[key] = value;
                    },
                });
            } else {
                def(canvas, key, {
                    get() {
                        const value = video[key];
                        return typeof value === 'function' ? value.bind(video) : value;
                    },
                    set(value) {
                        video[key] = value;
                    },
                });
            }
        });

        setTimeout(() => {
            for (let index = 0; index < events.length; index++) {
                const event = events[index];
                art.proxy(video, event, (event) => {
                    art.emit(`video:${event.type}`, event);
                });
            }
        });

        const draw = () => {
            console.log(video.currentTime);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            art.emit('artplayerProxyCanvas:draw', ctx);
        };

        const animation = () => {
            draw();
            animationFrame = requestAnimationFrame(animation);
        };

        const resize = () => {
            const player = art.template?.$player;
            if (!player || option.autoSize) return;

            const aspectRatio = video.videoWidth / video.videoHeight;
            const containerWidth = player.clientWidth;
            const containerHeight = player.clientHeight;
            const containerRatio = containerWidth / containerHeight;

            let canvasWidth, canvasHeight;
            if (containerRatio > aspectRatio) {
                canvasHeight = containerHeight;
                canvasWidth = canvasHeight * aspectRatio;
            } else {
                canvasWidth = containerWidth;
                canvasHeight = canvasWidth / aspectRatio;
            }

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const paddingLeft = (containerWidth - canvasWidth) / 2;
            const paddingTop = (containerHeight - canvasHeight) / 2;

            Object.assign(canvas.style, {
                padding: `${paddingTop}px ${paddingLeft}px`,
            });
        };

        art.on('video:loadedmetadata', async () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });

        art.on('video:play', () => {
            console.log('video:play');
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(animation);
        });

        art.on('video:pause', () => {
            cancelAnimationFrame(animationFrame);
        });

        art.on('resize', () => {
            resize();
            draw();
        });

        art.on('destroy', () => {
            cancelAnimationFrame(animationFrame);
        });

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
