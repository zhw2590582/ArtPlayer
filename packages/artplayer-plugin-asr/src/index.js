export default function artplayerPluginAsr(option = {}) {
    const { autoClearTimeout = 3000, interval = 1000, sampleRate = 16000, onAudioChunk = () => null } = option;

    return (art) => {
        let started = false;
        let audioCtx = null;
        let sourceNode = null;
        let recorderNode = null;
        let bufferChunks = [];
        let timer = null;
        let workletLoaded = false;
        let autoClearTimer = null;

        function clear() {
            //
        }

        function append(subtitle) {
            if (typeof subtitle !== 'string') return;
            clearTimeout(autoClearTimer);
            autoClearTimer = setTimeout(clear, autoClearTimeout);
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

        function mergeFloat32Array(chunks) {
            const length = chunks.reduce((acc, cur) => acc + cur.length, 0);
            const result = new Float32Array(length);
            let offset = 0;
            chunks.forEach((chunk) => {
                result.set(chunk, offset);
                offset += chunk.length;
            });
            return result;
        }

        function encodeWavPCM(buffers, sampleRate) {
            const samples = mergeFloat32Array(buffers);
            const dataLength = samples.length * 2;
            const buffer = new ArrayBuffer(44 + dataLength);
            const view = new DataView(buffer);

            function writeStr(offset, str) {
                for (let i = 0; i < str.length; i++) {
                    view.setUint8(offset + i, str.charCodeAt(i));
                }
            }

            writeStr(0, 'RIFF');
            view.setUint32(4, 36 + dataLength, true);
            writeStr(8, 'WAVE');
            writeStr(12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, 1, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * 2, true);
            view.setUint16(32, 2, true);
            view.setUint16(34, 16, true);
            writeStr(36, 'data');
            view.setUint32(40, dataLength, true);

            const pcm = floatTo16BitPCM(samples);
            new Uint8Array(buffer).set(new Uint8Array(pcm), 44);

            return new Blob([view], { type: 'audio/wav' });
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

            timer = setInterval(async () => {
                if (bufferChunks.length === 0) return;
                const wav = encodeWavPCM(bufferChunks, audioCtx.sampleRate);
                const buffer = await wav.arrayBuffer();
                const subtitle = await onAudioChunk({ buffer });
                bufferChunks = [];
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
            clear,
            append,
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginAsr'] = artplayerPluginAsr;
}
