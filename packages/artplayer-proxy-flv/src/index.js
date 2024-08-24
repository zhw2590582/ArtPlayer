import WXInlinePlayer from './WXInlinePlayer';

export default function artplayerProxyFlv(opt = {}) {
    return (art) => {
        const { option, constructor } = art;
        const { createElement, def } = constructor.utils;

        if (!WXInlinePlayer.isSupport()) {
            throw new Error('WXInlinePlayer is not support');
        }

        let player = null;
        const canvas = createElement('canvas');

        const state = {
            playing: false,
            duration: 0,
            videoWidth: 0,
            videoHeight: 0,
            currentTime: 0,
            playbackRate: 1,
            paused: true,
            ended: false,
            readyState: 0,
            autoplay: option.autoplay,
        };

        function reset() {
            Object.assign(state, {
                playing: false,
                duration: 0,
                videoWidth: 0,
                videoHeight: 0,
                currentTime: 0,
                playbackRate: 1,
                paused: true,
                ended: false,
                readyState: 0,
                autoplay: option.autoplay,
            });
        }

        function resize() {
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
        }

        async function init() {
            WXInlinePlayer.init({
                asmUrl: opt.asmUrl,
                wasmUrl: opt.wasmUrl,
            });

            await WXInlinePlayer.ready();

            if (player) {
                player.destroy();
                player = null;
            }

            player = new WXInlinePlayer({
                url: option.url,
                $container: canvas,
                ...opt,
            });

            state.readyState = 4;

            player.on('loadError', (e) => {
                console.error('loadError', e);
            });

            player.on('loadSuccess', () => {
                console.log('loadSuccess');
            });

            player.on('mediaInfo', (mediaInfo) => {
                console.log('mediaInfo', mediaInfo);
            });

            player.on('play', () => {
                console.log('play');
            });

            player.on('buffering', () => {
                console.log('buffering');
            });

            player.on('playing', () => {
                console.log('playing');
            });

            player.on('paused', () => {
                console.log('paused');
            });

            player.on('resumed', () => {
                console.log('resumed');
            });

            player.on('stopped', () => {
                console.log('stopped');
            });

            player.on('ended', () => {
                console.log('ended');
            });

            player.on('timeUpdate', (timestamp) => {
                console.log('timeUpdate', timestamp);
            });

            player.on('performance', ({ averageDecodeCost, averageUnitDuration }) => {
                console.log('performance', averageDecodeCost, averageUnitDuration);
            });
        }

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
            get: () => (player ? player.volume() : 1),
            set: (val) => {
                if (state.readyState < 4) return;
                player.volume(val);
                art.emit('video:volumechange', { type: 'volumechange' });
            },
        });

        def(canvas, 'currentTime', {
            get: () => (player ? player.getCurrentTime() : 0),
            set: (val) => {
                if (state.readyState < 4) return;
                const newTime = Math.max(0, Math.min(val, state.duration));
                //
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
                    if (option.autoplay) {
                        canvas.play();
                    }
                });
            },
        });

        def(canvas, 'playbackRate', {
            get: () => state.playbackRate,
            set: (val) => {
                //
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
            get: () => (player ? player.mute() : false),
            set: (val) => {
                player.mute(val);
                art.emit('video:volumechange', { type: 'volumechange' });
            },
        });

        def(canvas, 'buffered', {
            get: () => ({
                start: () => 0,
                end: () => (player ? player.getAvaiableDuration() : 0),
                length: 1,
            }),
        });

        def(canvas, 'play', {
            value: async () => {
                if (state.readyState < 4) return false;
                if (canvas.currentTime) {
                    player.resume();
                } else {
                    player.play();
                }
                art.emit('video:play', { type: 'play' });
                art.emit('video:playing', { type: 'playing' });
                return true;
            },
        });

        def(canvas, 'pause', {
            value: () => {
                player.pause();
                state.playing = false;
                state.paused = true;
                art.emit('video:pause', { type: 'pause' });
            },
        });

        art.on('destroy', () => {
            player.stop();
            if (player) {
                player.destroy();
                player = null;
            }
        });

        art.on('resize', resize);

        return canvas;
    };
}

if (typeof window !== 'undefined') {
    window['artplayerProxyFlv'] = artplayerProxyFlv;
}
