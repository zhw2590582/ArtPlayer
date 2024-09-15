export default function artplayerProxyCanvas() {
    return (art) => {
        const { option, constructor } = art;
        const { createElement, def } = constructor.utils;

        let animationId = null;
        const canvas = createElement('canvas');
        const ctx = canvas.getContext('2d');
        const video = createElement('video');

        const canvasProperties = {};
        const canvasKeys = ['width', 'height'];
        const { propertys, methods, prototypes, events } = constructor.config;
        const videoKeys = [...propertys, ...methods, ...prototypes];

        initCanvasProperties();
        proxyVideoToCanvas();
        setupEventListeners();
        setupArtPlayerEvents();

        return canvas;

        function initCanvasProperties() {
            canvasKeys.forEach((prop) => {
                canvasProperties[prop] = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, prop);
            });
        }

        function proxyVideoToCanvas() {
            videoKeys.forEach((key) => {
                if (canvasKeys.includes(key)) {
                    def(canvas, key, {
                        get() {
                            return canvasProperties[key].get.call(this);
                        },
                        set(value) {
                            canvasProperties[key].set.call(this, value);
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
        }

        function setupEventListeners() {
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
                const bitmap = await createImageBitmap(video);
                ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                bitmap.close();
                art.emit('artplayerProxyCanvas:draw', ctx);
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
        }

        function setupArtPlayerEvents() {
            art.on('video:loadedmetadata', async () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });

            art.on('video:play', () => {
                cancelAnimationFrame(animationId);
                animationId = requestAnimationFrame(animation);
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
