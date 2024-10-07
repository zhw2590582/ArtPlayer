import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';

export default function artplayerPluginDanmukuMask(option = {}) {
    return (art) => {
        const {
            template: { $player, $video, $danmuku },
        } = art;

        let segmenter = null;
        let canvas = null;
        let ctx = null;
        let animationFrameId = null;

        async function initSegmenter() {
            await tf.setBackend('webgl');
            const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;

            const segmenterConfig = {
                runtime: 'mediapipe', // or 'tfjs'
                solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
                modelType: 'general',
            };

            segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
        }

        function createCanvas() {
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.opacity = '0';
            $player.appendChild(canvas);
        }

        async function segmentBody() {
            if ($video.paused || $video.ended) {
                animationFrameId = requestAnimationFrame(segmentBody);
                return;
            }

            try {
                canvas.width = $video.videoWidth;
                canvas.height = $video.videoHeight;

                const segmentation = await segmenter.segmentPeople($video);

                if (!segmentation) {
                    animationFrameId = requestAnimationFrame(segmentBody);
                    return;
                }

                const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
                const backgroundColor = { r: 255, g: 255, b: 255, a: 255 };
                const drawContour = false;
                const foregroundThreshold = 0.6;

                const mask = await bodySegmentation.toBinaryMask(
                    segmentation,
                    foregroundColor,
                    backgroundColor,
                    drawContour,
                    foregroundThreshold,
                );

                const opacity = 1;
                const maskBlurAmount = 1;
                await bodySegmentation.drawMask(canvas, $video, mask, opacity, maskBlurAmount);

                $danmuku.style.webkitMaskImage = `url(${canvas.toDataURL()})`;
                $danmuku.style.maskImage = `url(${canvas.toDataURL()})`;
            } catch (error) {
                console.error('Error in segmentBody:', error);
            }

            animationFrameId = requestAnimationFrame(segmentBody);
        }

        async function startSegmentation() {
            if (!segmenter) {
                await initSegmenter();
            }

            if (!canvas) {
                createCanvas();
            }

            segmentBody();
        }

        function stopSegmentation() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }

        art.on('ready', startSegmentation);
        art.on('destroy', stopSegmentation);

        return {
            name: 'artplayerPluginDanmukuMask',
            start: startSegmentation,
            stop: stopSegmentation,
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginDanmukuMask'] = artplayerPluginDanmukuMask;
}
