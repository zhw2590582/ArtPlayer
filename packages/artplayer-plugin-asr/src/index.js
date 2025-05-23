import style from 'bundle-text:./style.less';

export default function artplayerPluginAsr(option = {}) {
    const {
        length = 3,
        interval = 100,
        sampleRate = 16000,
        autoHideTimeout = 10000,
        onAudioChunk = () => null,
    } = option;

    return (art) => {
        let started = false;
        let audioCtx = null;
        let sourceNode = null;
        let recorderNode = null;
        let gainNode = null;
        let bufferChunks = [];
        let timer = null;
        let workletLoaded = false;
        let hideTimer = null;
        let mediaStream = null;
        let mediaStreamSource = null;

        const $asr = art.layers.add({
            name: 'asr',
            html: '',
        });

        function splitByPunctuation(text) {
            return (
                text
                    // eslint-disable-next-line no-useless-escape
                    .split(/(?<=[、。！？!?\.])\s*/u)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(-length)
            );
        }

        function hide() {
            $asr.style.display = 'none';
        }

        function append(subtitle) {
            if (typeof subtitle !== 'string') return;
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hide, autoHideTimeout);
            $asr.style.display = '';
            $asr.innerHTML = splitByPunctuation(subtitle)
                .map((line) => `<div class="art-asr-line">${line}</div>`)
                .join('');
        }

        const recorderProcessorCode = `
            class RecorderProcessor extends AudioWorkletProcessor {
                process(inputs) {
                    const input = inputs[0];
                    if (input && input[0]) {
                        this.port.postMessage(input[0]);
                    }
                    return true;
                }
            }
            registerProcessor('recorder-processor', RecorderProcessor);
        `;

        const createWorkletBlobUrl = () => {
            const blob = new Blob([recorderProcessorCode], { type: 'application/javascript' });
            return URL.createObjectURL(blob);
        };

        function floatTo16BitPCM(float32Array) {
            const len = float32Array.length;
            const buffer = new ArrayBuffer(len * 2);
            const view = new DataView(buffer);
            for (let i = 0; i < len; i++) {
                let s = Math.max(-1, Math.min(1, float32Array[i]));
                view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
            }
            return buffer;
        }

        async function setupAudioContext() {
            if (audioCtx) return audioCtx;
            audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
            if (audioCtx.state === 'suspended') await audioCtx.resume();
            return audioCtx;
        }

        async function setupAudioSource() {
            if (!sourceNode && art.video) {
                try {
                    sourceNode = audioCtx.createMediaElementSource(art.video);
                    return sourceNode;
                } catch (err) {
                    console.warn('[artplayerPluginAsr] Direct connection failed, trying fallback...', err);
                }
            }

            try {
                if (!mediaStream) {
                    mediaStream = await captureAudioFromVideo(art.video);
                }
                if (mediaStream) {
                    mediaStreamSource = audioCtx.createMediaStreamSource(mediaStream);
                    return mediaStreamSource;
                }
            } catch (err) {
                console.warn('[artplayerPluginAsr] MediaStream fallback failed:', err);
            }

            return null;
        }

        async function captureAudioFromVideo(videoElement) {
            try {
                if (videoElement.captureStream) return videoElement.captureStream();
                if (videoElement.mozCaptureStream) return videoElement.mozCaptureStream();
                console.warn('[artplayerPluginAsr] captureStream not supported');
                return null;
            } catch (err) {
                console.warn('[artplayerPluginAsr] Error capturing stream:', err);
                return null;
            }
        }

        async function startCapture() {
            if (started) return;

            try {
                await setupAudioContext();
                const audioSource = await setupAudioSource();
                if (!audioSource) throw new Error('Could not establish audio source');

                if (!workletLoaded) {
                    const blobUrl = createWorkletBlobUrl();
                    await audioCtx.audioWorklet.addModule(blobUrl);
                    URL.revokeObjectURL(blobUrl);
                    workletLoaded = true;
                }

                gainNode = audioCtx.createGain();
                gainNode.gain.value = 1;
                recorderNode = new AudioWorkletNode(audioCtx, 'recorder-processor');
                recorderNode.port.onmessage = (event) => {
                    bufferChunks.push(new Float32Array(event.data));
                };
                audioSource.connect(recorderNode);
                audioSource.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                const CHUNK_SAMPLES = sampleRate * (interval / 1000);
                timer = setInterval(async () => {
                    if (bufferChunks.length === 0) return;

                    let accumulated = new Float32Array(0);
                    while (accumulated.length < CHUNK_SAMPLES && bufferChunks.length) {
                        const next = bufferChunks.shift();
                        const tmp = new Float32Array(accumulated.length + next.length);
                        tmp.set(accumulated, 0);
                        tmp.set(next, accumulated.length);
                        accumulated = tmp;
                    }

                    if (accumulated.length < CHUNK_SAMPLES) return;

                    const chunkToSend = accumulated.slice(0, CHUNK_SAMPLES);
                    const buffer = floatTo16BitPCM(chunkToSend);
                    const subtitle = await onAudioChunk(buffer);
                    append(subtitle);
                }, interval);

                started = true;
            } catch (err) {
                console.error('[artplayerPluginAsr] Initialization failed:', err);
                await stopCapture();
            }
        }

        async function stopCapture() {
            if (!started) return;
            started = false;

            clearInterval(timer);
            timer = null;

            if (recorderNode) {
                recorderNode.disconnect();
                recorderNode.port.onmessage = null;
                recorderNode = null;
            }

            if (gainNode) {
                gainNode.disconnect();
                gainNode = null;
            }

            bufferChunks = [];
        }

        async function destroy() {
            await stopCapture();

            if (mediaStreamSource) {
                mediaStreamSource.disconnect();
                mediaStreamSource = null;
            }

            if (sourceNode) {
                sourceNode.disconnect();
                sourceNode = null;
            }

            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
                mediaStream = null;
            }

            if (audioCtx) {
                await audioCtx.close();
                audioCtx = null;
            }

            workletLoaded = false;
        }

        art.on('play', startCapture);
        art.on('pause', stopCapture);
        art.on('destroy', destroy);

        return {
            name: 'artplayerPluginAsr',
            stop: destroy,
            hide,
            append,
        };
    };
}

if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-plugin-asr')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-plugin-asr';
        $style.textContent = style;
        document.head.appendChild($style);
    }
}

if (typeof window !== 'undefined') {
    window['artplayerPluginAsr'] = artplayerPluginAsr;
}
