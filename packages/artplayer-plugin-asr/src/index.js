export default function artplayerPluginAsr(option = {}) {
    const { hideTimeout = 3000, interval = 100, sampleRate = 16000, onAudioChunk = () => null } = option;

    return (art) => {
        let started = false;
        let audioCtx = null;
        let sourceNode = null;
        let recorderNode = null;
        let bufferChunks = [];
        let timer = null;
        let workletLoaded = false;
        let autoClearTimer = null;

        function hide() {
            //
        }

        function append(subtitle) {
            if (typeof subtitle !== 'string') return;
            clearTimeout(autoClearTimer);
            autoClearTimer = setTimeout(hide, hideTimeout);
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

        async function startCapture() {
            if (started) return;
            started = true;

            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
                if (audioCtx.state === 'suspended') {
                    await audioCtx.resume();
                }
            }

            if (!sourceNode) {
                try {
                    sourceNode = audioCtx.createMediaElementSource(art.video);
                    sourceNode.connect(audioCtx.destination);
                } catch (err) {
                    console.warn('[artplayerPluginAsr] Failed to access audio stream:', err);
                    return;
                }
            }

            if (!workletLoaded) {
                const blobUrl = createWorkletBlobUrl();
                await audioCtx.audioWorklet.addModule(blobUrl);
                URL.revokeObjectURL(blobUrl);
                workletLoaded = true;
            }

            recorderNode = new AudioWorkletNode(audioCtx, 'recorder-processor');
            recorderNode.port.onmessage = (event) => {
                bufferChunks.push(new Float32Array(event.data));
            };

            sourceNode.connect(recorderNode);
            recorderNode.connect(audioCtx.destination);

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
                const pcm = floatTo16BitPCM(chunkToSend);
                const subtitle = await onAudioChunk(pcm);
                append(subtitle);
            }, interval);
        }

        function stopCapture() {
            if (!started) return;
            started = false;

            if (timer) {
                clearInterval(timer);
                timer = null;
            }

            if (recorderNode) {
                try {
                    recorderNode.disconnect();
                } catch {}
                recorderNode = null;
            }

            bufferChunks = [];
        }

        art.on('play', startCapture);
        art.on('pause', stopCapture);
        art.on('destroy', stopCapture);

        return {
            name: 'artplayerPluginAsr',
            hide,
            append,
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginAsr'] = artplayerPluginAsr;
}
