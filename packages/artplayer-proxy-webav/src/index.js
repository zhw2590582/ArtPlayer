import { MP4Clip } from '@webav/av-cliper';

export default function artplayerProxyWebAV(option) {
    return (art) => {
        const { option, constructor } = art;
        const { createElement, def } = constructor.utils;

        const canvas = createElement('canvas');
        const ctx = canvas.getContext('2d');
        const audioCtx = new AudioContext();

        let clip = null;
        let timer = null;
        let audioSource = null;

        let playing = false;
        let duration = 0;
        let videoWidth = 0;
        let videoHeight = 0;
        let currentTime = 0;
        let loadedTime = 0;
        let volume = 1;
        let autoplay = false;
        let playbackRate = 1;
        let paused = true;
        let ended = false;
        let readyState = 0;
        let muted = false;

        function reset() {
            playing = false;
            duration = 0;
            videoWidth = 0;
            videoHeight = 0;
            currentTime = 0;
            loadedTime = 0;
            volume = 1;
            autoplay = false;
            playbackRate = 1;
            paused = true;
            ended = false;
            readyState = 0;
            muted = false;
        }

        function stop() {
            clearInterval(timer);
            audioSource?.stop();
        }

        function play() {
            let curTime = currentTime * 1e6;
            let startAt = 0;
            let first = true;

            stop();

            timer = setInterval(async () => {
                const { state, video, audio } = await clip.tick(Math.round(curTime));

                curTime += (1000 / 30) * 1000;
                currentTime = curTime / 1e6;

                art.emit('video:timeupdate', { type: 'timeupdate' });

                if (state === 'done') {
                    clearInterval(timer);
                    return;
                }

                if (video != null && state === 'success') {
                    ctx.clearRect(0, 0, videoWidth, videoHeight);
                    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
                    video.close();
                }

                if (first) {
                    first = false;
                    return;
                }

                const len = audio[0]?.length ?? 0;
                if (len === 0) return;
                const buf = audioCtx.createBuffer(2, len, 48000);
                buf.copyToChannel(audio[0], 0);
                buf.copyToChannel(audio[1], 1);
                audioSource = audioCtx.createBufferSource();
                audioSource.buffer = buf;
                audioSource.connect(audioCtx.destination);
                startAt = Math.max(audioCtx.currentTime, startAt);
                audioSource.start(startAt);
                startAt += buf.duration;
            }, 1000 / 30);
        }

        async function preview(time) {
            const { video } = await clip.tick(time * 1e6);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        async function init() {
            stop();
            reset();

            if (clip) {
                clip.destroy();
                art.emit('video:abort', { type: 'abort' });
                art.emit('video:emptied', { type: 'emptied' });
            }

            try {
                art.emit('video:loadstart', { type: 'loadstart' });
                const response = await fetch(option.url);

                if (!response.body) {
                    const error = new Error('No response body');
                    art.emit('video:error', error);
                    throw error;
                }

                clip = new MP4Clip(response.body);
            } catch (error) {
                art.emit('video:error', error);
                throw error;
            }

            const info = await clip.ready;

            readyState = 4;
            duration = Math.round(info.duration / 1e6);
            videoWidth = info.width;
            videoHeight = info.height;

            canvas.width = videoWidth;
            canvas.height = videoHeight;
            preview(0.1);

            art.emit('video:loadedmetadata', { type: 'loadedmetadata' });
            art.emit('video:durationchange', { type: 'durationchange' });
            art.emit('video:loadeddata', { type: 'loadeddata' });
            art.emit('video:canplay', { type: 'canplay' });
            art.emit('video:canplaythrough', { type: 'canplaythrough' });
        }

        def(canvas, 'textTracks', {
            get: () => [{}],
        });

        def(canvas, 'loadedTime', {
            get: () => loadedTime,
        });

        def(canvas, 'duration', {
            get: () => duration,
        });

        def(canvas, 'videoWidth', {
            get: () => videoWidth,
        });

        def(canvas, 'videoHeight', {
            get: () => videoHeight,
        });

        def(canvas, 'volume', {
            get: () => volume,
            set: (val) => {
                volume = val;
                art.emit('video:volumechange', { type: 'volumechange' });
            },
        });

        def(canvas, 'currentTime', {
            get: () => currentTime,
            set: (val) => {
                currentTime = val;
                preview(val);
            },
        });

        def(canvas, 'autoplay', {
            get: () => autoplay,
            set: (val) => {
                autoplay = val;
            },
        });

        def(canvas, 'src', {
            get: () => option.url,
            set: (val) => {
                option.url = val;
                init();
            },
        });

        def(canvas, 'playbackRate', {
            get: () => playbackRate,
            set: (val) => {
                playbackRate = val;
                art.emit('video:ratechange', { type: 'ratechange' });
            },
        });

        def(canvas, 'playing', {
            get: () => playing,
        });

        def(canvas, 'paused', {
            get: () => paused,
        });

        def(canvas, 'ended', {
            get: () => ended,
        });

        def(canvas, 'readyState', {
            get: () => readyState,
        });

        def(canvas, 'muted', {
            get: () => muted,
            set: (val) => {
                muted = val;
                art.emit('video:volumechange', { type: 'volumechange' });
            },
        });

        def(canvas, 'play', {
            value: async () => {
                play();
                playing = true;
                paused = false;
                art.emit('video:play', { type: 'play' });
                art.emit('video:playing', { type: 'playing' });
            },
        });

        def(canvas, 'pause', {
            value: () => {
                stop();
                playing = false;
                paused = true;
                art.emit('video:pause', { type: 'pause' });
            },
        });

        return canvas;
    };
}

if (typeof window !== 'undefined') {
    window['artplayerProxyWebAV'] = artplayerProxyWebAV;
}
