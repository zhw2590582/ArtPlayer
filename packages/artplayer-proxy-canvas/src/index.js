export default function artplayerProxyCanvas(callback) {
    return (art) => {
        const { option, constructor } = art;
        const { createElement, def, append, sleep } = constructor.utils;

        const canvas = createElement('canvas');
        const ctx = canvas.getContext('2d');
        const video = createElement('video');
        const track = createElement('track');
        track.default = true;
        track.kind = 'metadata';
        append(video, track);

        let animationFrame = null;
        const { propertys, methods, prototypes, events } = constructor.config;
        const keys = [...propertys, ...methods, ...prototypes];

        // 存储 canvas 的原始属性
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

        const drawFrame = async () => {
            if (!video.videoWidth || !video.videoHeight) {
                console.log('Video dimensions not ready yet');
                return;
            }
            try {
                if (video.readyState >= 2) {
                    // HAVE_CURRENT_DATA or higher
                    // 使用 createImageBitmap 进行预处理
                    const bitmap = await createImageBitmap(video);
                    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                    bitmap.close();
                } else {
                    console.log('Video not ready for frame extraction');
                }
            } catch (error) {
                console.error('Error drawing video frame:', error);
            }
        };

        // 使用 requestVideoFrameCallback 进行精确同步
        let videoFrameCallback;
        if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
            videoFrameCallback = () => {
                drawFrame();
                video.requestVideoFrameCallback(videoFrameCallback);
            };
        } else {
            // 降级方案：使用 requestAnimationFrame
            videoFrameCallback = () => {
                drawFrame();
                animationFrame = requestAnimationFrame(videoFrameCallback);
            };
        }

        const resize = () => {
            try {
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

                // 设置 canvas 大小为实际显示大小
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                // 居中 canvas
                const paddingLeft = (containerWidth - canvasWidth) / 2;
                const paddingTop = (containerHeight - canvasHeight) / 2;

                Object.assign(canvas.style, {
                    padding: `${paddingTop}px ${paddingLeft}px`,
                });
            } catch (error) {
                console.error('Error in resize function:', error);
            }
        };

        // 在视频元数据加载完成后设置 canvas 尺寸并绘制第一帧
        art.on('video:loadedmetadata', async () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            resize();
        });

        // 在视频数据可用时绘制第一帧
        art.on('video:canplay', async () => {
            await sleep(300);
            drawFrame();
        });

        art.on('video:play', () => {
            if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
                video.requestVideoFrameCallback(videoFrameCallback);
            } else {
                cancelAnimationFrame(animationFrame);
                animationFrame = requestAnimationFrame(videoFrameCallback);
            }
        });

        art.on('video:pause', () => {
            if (!('requestVideoFrameCallback' in HTMLVideoElement.prototype)) {
                cancelAnimationFrame(animationFrame);
            }
        });

        art.on('resize', resize);

        const destroy = () => {
            if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
                video.cancelVideoFrameCallback(videoFrameCallback);
            } else {
                cancelAnimationFrame(animationFrame);
            }
            // 清理其他可能的资源...
        };

        art.on('destroy', destroy);

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
