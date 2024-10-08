import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';

export default function artplayerPluginDanmukuMask(option = {}) {
    return (art) => {
        const {
            template: { $video, $danmuku },
        } = art;

        let segmenter = null;
        let canvas = null;
        let ctx = null;
        let animationFrameId = null;
        let isInitialized = false;

        const config = {
            solutionPath: option.solutionPath || 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
            modelSelection: option.modelSelection || 1,
            smoothSegmentation: option.smoothSegmentation !== undefined ? option.smoothSegmentation : true,
            minDetectionConfidence: option.minDetectionConfidence || 0.5,
            minTrackingConfidence: option.minTrackingConfidence || 0.5,
            selfieMode: option.selfieMode || false,
            drawContour: option.drawContour || false,
            foregroundThreshold: option.foregroundThreshold || 0.5,
            opacity: option.opacity || 1,
            maskBlurAmount: option.maskBlurAmount || 3,
        };

        async function initTensorFlow() {
            try {
                await tf.setBackend('webgl');
            } catch (error) {
                console.warn('WebGL backend not available, falling back to CPU');
                await tf.setBackend('cpu');
            }
        }

        async function initSegmenter() {
            await initTensorFlow();
            const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;

            const segmenterConfig = {
                runtime: 'mediapipe',
                modelType: 'general',
                solutionPath: config.solutionPath,
                modelSelection: config.modelSelection,
                smoothSegmentation: config.smoothSegmentation,
                minDetectionConfidence: config.minDetectionConfidence,
                minTrackingConfidence: config.minTrackingConfidence,
                selfieMode: config.selfieMode,
            };

            try {
                segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
                console.log('Segmenter initialized:', segmenter);
                isInitialized = true;
            } catch (error) {
                console.error('Error initializing segmenter:', error);
                isInitialized = false;
            }
        }

        function setupDanmukuStyle() {
            Object.assign($danmuku.style, {
                maskMode: 'alpha',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
            });
        }

        function createCanvas() {
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
        }

        function makeWhiteTransparent(imageData) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 250 && data[i + 1] > 250 && data[i + 2] > 250) {
                    data[i + 3] = 0;
                }
            }
            return imageData;
        }

        async function segmentBody() {
            if (!isInitialized || $video.paused || $video.ended) {
                animationFrameId = requestAnimationFrame(segmentBody);
                return;
            }

            try {
                canvas.width = $video.videoWidth;
                canvas.height = $video.videoHeight;

                const segmentation = await segmenter.segmentPeople($video);

                if (!segmentation || segmentation.length === 0) {
                    animationFrameId = requestAnimationFrame(segmentBody);
                    return;
                }

                const foregroundColor = { r: 255, g: 255, b: 255, a: 255 };
                const backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
                const mask = await bodySegmentation.toBinaryMask(
                    segmentation,
                    foregroundColor,
                    backgroundColor,
                    config.drawContour,
                    config.foregroundThreshold,
                );

                await bodySegmentation.drawMask(canvas, $video, mask, config.opacity, config.maskBlurAmount);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                ctx.putImageData(makeWhiteTransparent(imageData), 0, 0);
                $danmuku.style.maskImage = `url(${canvas.toDataURL()})`;
            } catch (error) {
                console.error('Error in segmentBody:', error);
            }

            animationFrameId = requestAnimationFrame(segmentBody);
        }

        async function startSegmentation() {
            if (!isInitialized) {
                await initSegmenter();
            }
            if (!canvas) {
                createCanvas();
            }
            setupDanmukuStyle();
            segmentBody();
        }

        function stopSegmentation() {
            $danmuku.style.maskImage = 'none';
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
