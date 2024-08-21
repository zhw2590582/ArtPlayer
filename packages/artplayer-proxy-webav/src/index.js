import { MP4Clip } from '@webav/av-cliper';

export default function artplayerProxyWebAV() {
    return (art) => {
        const { option, constructor } = art;
        const { createElement, def } = constructor.utils;

        const canvas = createElement('canvas');
        const ctx = canvas.getContext('2d');
        let audioCtx;
        let gainNode;

        let clip = null;
        let timer = null;
        let audioSource = null;

        const state = {
            playing: false,
            duration: 0,
            videoWidth: 0,
            videoHeight: 0,
            currentTime: 0,
            volume: 1,
            autoplay: false,
            playbackRate: 1,
            paused: true,
            ended: false,
            readyState: 0,
            muted: false,
            buffered: 0,
        };

        function reset() {
            Object.assign(state, {
                playing: false,
                duration: 0,
                videoWidth: 0,
                videoHeight: 0,
                currentTime: 0,
                volume: 1,
                autoplay: false,
                playbackRate: 1,
                paused: true,
                ended: false,
                readyState: 0,
                muted: false,
                buffered: 0,
            });
        }

        function stop() {
            clearInterval(timer);
            if (audioSource) {
                audioSource.stop();
                audioSource = null;
            }
        }

        function updateVolume() {
            if (gainNode) {
                const effectiveVolume = state.muted ? 0 : state.volume;
                gainNode.gain.setValueAtTime(effectiveVolume, audioCtx.currentTime);
            }
        }

        async function play() {
            if (!audioCtx) {
                audioCtx = new AudioContext();
                gainNode = audioCtx.createGain();
                gainNode.connect(audioCtx.destination);
            }

            let curTime = state.currentTime * 1e6;
            let startAt = 0;
            let first = true;

            stop();

            updateVolume();

            timer = setInterval(async () => {
                const { state: clipState, video, audio } = await clip.tick(Math.round(curTime));

                curTime += (1000 / 30) * 1000 * state.playbackRate;
                state.currentTime = curTime / 1e6;

                // 更新缓冲状态
                state.buffered = Math.max(state.buffered, state.currentTime);

                art.emit('video:timeupdate', { type: 'timeupdate' });
                art.emit('video:progress', { type: 'progress' });

                if (clipState === 'done') {
                    stop();
                    state.ended = true;
                    state.playing = false;
                    state.paused = true;
                    art.emit('video:ended', { type: 'ended' });
                    return;
                }

                if (video && clipState === 'success') {
                    ctx.clearRect(0, 0, state.videoWidth, state.videoHeight);
                    ctx.drawImage(video, 0, 0, state.videoWidth, state.videoHeight);
                    video.close();
                }

                if (first) {
                    first = false;
                    return;
                }

                if (audio?.[0]?.length) {
                    const buf = audioCtx.createBuffer(2, audio[0].length, 48000);
                    buf.copyToChannel(audio[0], 0);
                    buf.copyToChannel(audio[1], 1);
                    audioSource = audioCtx.createBufferSource();
                    audioSource.buffer = buf;
                    audioSource.connect(gainNode);
                    audioSource.playbackRate.setValueAtTime(state.playbackRate, audioCtx.currentTime);
                    startAt = Math.max(audioCtx.currentTime, startAt);
                    audioSource.start(startAt);
                    startAt += buf.duration / state.playbackRate;
                }
            }, 1000 / 30);

            state.playing = true;
            state.paused = false;
        }

        async function preview(time) {
            const { video } = await clip.tick(time * 1e6);
            if (video) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                video.close();
            }
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
                await Promise.resolve();
                art.emit('video:loadstart', { type: 'loadstart' });
                const response = await fetch(option.url);

                if (!response.body) {
                    throw new Error('No response body');
                }

                clip = new MP4Clip(response.body);
            } catch (error) {
                art.emit('video:error', error);
                throw error;
            }

            const info = await clip.ready;

            Object.assign(state, {
                readyState: 4,
                duration: Math.round(info.duration / 1e6),
                videoWidth: info.width,
                videoHeight: info.height,
            });

            canvas.width = state.videoWidth;
            canvas.height = state.videoHeight;
            await preview(0.1);

            art.emit('video:loadedmetadata', { type: 'loadedmetadata' });
            art.emit('video:durationchange', { type: 'durationchange' });
            art.emit('video:loadeddata', { type: 'loadeddata' });
            art.emit('video:canplay', { type: 'canplay' });
            art.emit('video:canplaythrough', { type: 'canplaythrough' });
        }

        def(canvas, 'textTracks', {
            get: () => [{}],
        });

        def(canvas, 'duration', {
            get: () => state.duration,
        });

        def(canvas, 'videoWidth', {
            get: () => state.videoWidth,
        });

        def(canvas, 'videoHeight', {
            get: () => state.videoHeight,
        });

        def(canvas, 'volume', {
            get: () => state.volume,
            set: (val) => {
                state.volume = Math.max(0, Math.min(1, val));
                updateVolume();
                art.emit('video:volumechange', { type: 'volumechange' });
            },
        });

        def(canvas, 'currentTime', {
            get: () => state.currentTime,
            set: (val) => {
                const newTime = Math.max(0, Math.min(val, state.duration));
                state.currentTime = newTime;
                preview(newTime);
                if (state.playing) {
                    stop();
                    play();
                }
                art.emit('video:timeupdate', { type: 'timeupdate' });
            },
        });

        def(canvas, 'autoplay', {
            get: () => state.autoplay,
            set: (val) => {
                state.autoplay = val;
                if (val && state.readyState >= 4) {
                    canvas.play();
                }
            },
        });

        def(canvas, 'src', {
            get: () => option.url,
            set: (val) => {
                option.url = val;
                init().then(() => {
                    if (state.autoplay) {
                        canvas.play();
                    }
                });
            },
        });

        def(canvas, 'playbackRate', {
            get: () => state.playbackRate,
            set: (val) => {
                state.playbackRate = Math.max(0.25, Math.min(2, val));
                if (audioSource) {
                    audioSource.playbackRate.setValueAtTime(state.playbackRate, audioCtx.currentTime);
                }
                art.emit('video:ratechange', { type: 'ratechange' });
            },
        });

        def(canvas, 'playing', {
            get: () => state.playing,
        });

        def(canvas, 'paused', {
            get: () => state.paused,
        });

        def(canvas, 'ended', {
            get: () => state.ended,
        });

        def(canvas, 'readyState', {
            get: () => state.readyState,
        });

        def(canvas, 'muted', {
            get: () => state.muted,
            set: (val) => {
                state.muted = val;
                updateVolume();
                art.emit('video:volumechange', { type: 'volumechange' });
            },
        });

        def(canvas, 'buffered', {
            get: () => ({
                start: () => 0,
                end: () => state.buffered,
                length: 1,
            }),
        });

        // Define methods
        def(canvas, 'play', {
            value: async () => {
                await play();
                art.emit('video:play', { type: 'play' });
                art.emit('video:playing', { type: 'playing' });
            },
        });

        def(canvas, 'pause', {
            value: () => {
                stop();
                state.playing = false;
                state.paused = true;
                art.emit('video:pause', { type: 'pause' });
            },
        });

        return canvas;
    };
}

if (typeof window !== 'undefined') {
    window['artplayerProxyWebAV'] = artplayerProxyWebAV;
}
