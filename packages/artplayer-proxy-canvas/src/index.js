export default function artplayerProxyCanvas(callback) {
    return (art) => {
        const { constructor } = art;
        const { createElement } = constructor.utils;

        const canvas = createElement('canvas');
        const video = createElement('video');
        const ctx = canvas.getContext('2d');

        let animationId = null;

        const originalCanvasMethods = {};
        for (const prop in canvas) {
            if (typeof canvas[prop] === 'function') {
                originalCanvasMethods[prop] = canvas[prop].bind(canvas);
            }
        }

        for (const prop in video) {
            if (!(prop in canvas)) {
                Object.defineProperty(canvas, prop, {
                    get() {
                        const value = video[prop];
                        return typeof value === 'function' ? value.bind(video) : value;
                    },
                    set(value) {
                        video[prop] = value;
                    },
                    configurable: true,
                    enumerable: true,
                });
            }
        }

        for (const prop in originalCanvasMethods) {
            canvas[prop] = function (...args) {
                if (prop in originalCanvasMethods) {
                    return originalCanvasMethods[prop](...args);
                }
                return video[prop].apply(video, args);
            };
        }

        setupEventListeners();
        setupArtPlayerEvents();

        return canvas;

        function setupEventListeners() {
            const { events } = constructor.config;
            setTimeout(() => {
                events.forEach((event) => {
                    art.proxy(video, event, (event) => {
                        art.emit(`video:${event.type}`, event);
                    });
                });
            });
        }

        async function draw() {
            try {
                if (typeof createImageBitmap !== 'undefined') {
                    const bitmap = await createImageBitmap(video);
                    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                    bitmap.close();
                } else {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                }
                callback && callback(ctx, video);
                art.emit('artplayerProxyCanvas:draw', ctx, video);
            } catch (error) {
                art.emit('artplayerProxyCanvas:error', error);
            }
        }

        async function animation() {
            await draw();
            animationId = requestAnimationFrame(animation);
        }

        function resize() {
            const player = art.template?.$player;
            if (!player || art.option.autoSize) return;

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
        }

        function setupArtPlayerEvents() {
            art.on('video:loadedmetadata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });

            art.on('video:play', () => {
                cancelAnimationFrame(animationId);
                animation();
            });

            art.on('video:pause', () => {
                cancelAnimationFrame(animationId);
            });

            art.on('resize', () => {
                resize();
                draw();
            });

            art.on('destroy', () => {
                cancelAnimationFrame(animationId);
            });
        }
    };
}

if (typeof window !== 'undefined') {
    window['artplayerProxyCanvas'] = artplayerProxyCanvas;
}
