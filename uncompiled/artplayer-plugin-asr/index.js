var artplayerPluginAsr = (function() {
  "use strict";
  const style = ".art-video-player .art-layer-asr {\n  pointer-events: none !important;\n  position: absolute;\n  z-index: 150;\n  inset: 0px;\n  display: flex;\n  flex-direction: column;\n  justify-content: end;\n  padding: 0 2%;\n  font-size: 1rem;\n  gap: var(--art-subtitle-gap);\n  padding-bottom: var(--art-subtitle-bottom);\n  transition: padding-bottom var(--art-transition-duration) ease;\n  text-shadow: var(--art-subtitle-border) 1px 0 1px, var(--art-subtitle-border) 0 1px 1px, var(--art-subtitle-border) -1px 0 1px, var(--art-subtitle-border) 0 -1px 1px, var(--art-subtitle-border) 1px 1px 1px, var(--art-subtitle-border) -1px -1px 1px, var(--art-subtitle-border) 1px -1px 1px, var(--art-subtitle-border) -1px 1px 1px;\n}\n.art-video-player.art-control-show .art-layer-asr {\n  padding-bottom: calc(var(--art-control-height) + var(--art-subtitle-bottom));\n}\n";
  function artplayerPluginAsr2(option = {}) {
    const {
      length = 3,
      interval = 100,
      sampleRate = 16e3,
      autoHideTimeout = 1e4,
      onAudioChunk = () => null
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
        name: "asr",
        html: ""
      });
      function splitByPunctuation(text) {
        return text.split(/(?<=[、。！？!?.])\s*/u).map((s) => s.trim()).filter(Boolean).slice(-length);
      }
      function hide() {
        $asr.style.display = "none";
      }
      function append(subtitle) {
        if (typeof subtitle !== "string")
          return;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hide, autoHideTimeout);
        $asr.style.display = "";
        $asr.innerHTML = splitByPunctuation(subtitle).map((line) => `<div class="art-asr-line">${line}</div>`).join("");
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
        const blob = new Blob([recorderProcessorCode], { type: "application/javascript" });
        return URL.createObjectURL(blob);
      };
      function floatTo16BitPCM(float32Array) {
        const len = float32Array.length;
        const buffer = new ArrayBuffer(len * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < len; i++) {
          const s = Math.max(-1, Math.min(1, float32Array[i]));
          view.setInt16(i * 2, s < 0 ? s * 32768 : s * 32767, true);
        }
        return buffer;
      }
      function pcmToWav(pcmBuffer, sampleRate2) {
        const pcmLength = pcmBuffer.byteLength;
        const wavBuffer = new ArrayBuffer(44 + pcmLength);
        const view = new DataView(wavBuffer);
        const writeString = (offset, str) => {
          for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
          }
        };
        writeString(0, "RIFF");
        view.setUint32(4, 36 + pcmLength, true);
        writeString(8, "WAVE");
        writeString(12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate2, true);
        view.setUint32(28, sampleRate2 * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, "data");
        view.setUint32(40, pcmLength, true);
        new Uint8Array(wavBuffer).set(new Uint8Array(pcmBuffer), 44);
        return wavBuffer;
      }
      async function setupAudioContext() {
        if (audioCtx)
          return audioCtx;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
        if (audioCtx.state === "suspended")
          await audioCtx.resume();
        return audioCtx;
      }
      async function setupAudioSource() {
        if (!sourceNode && art.video) {
          try {
            sourceNode = audioCtx.createMediaElementSource(art.video);
            return sourceNode;
          } catch (err) {
            console.warn("[artplayerPluginAsr] Direct connection failed:", err);
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
          console.warn("[artplayerPluginAsr] MediaStream fallback failed:", err);
        }
        return null;
      }
      async function captureAudioFromVideo(videoElement) {
        try {
          if (videoElement.captureStream)
            return videoElement.captureStream();
          if (videoElement.mozCaptureStream)
            return videoElement.mozCaptureStream();
          console.warn("[artplayerPluginAsr] captureStream not supported");
          return null;
        } catch (err) {
          console.warn("[artplayerPluginAsr] Error capturing stream:", err);
          return null;
        }
      }
      async function startCapture() {
        if (started)
          return;
        try {
          await setupAudioContext();
          const audioSource = await setupAudioSource();
          if (!audioSource)
            throw new Error("Could not establish audio source");
          if (!workletLoaded) {
            const blobUrl = createWorkletBlobUrl();
            await audioCtx.audioWorklet.addModule(blobUrl);
            URL.revokeObjectURL(blobUrl);
            workletLoaded = true;
          }
          gainNode = audioCtx.createGain();
          gainNode.gain.value = 1;
          recorderNode = new AudioWorkletNode(audioCtx, "recorder-processor");
          recorderNode.port.onmessage = (event) => {
            bufferChunks.push(new Float32Array(event.data));
          };
          audioSource.connect(recorderNode);
          audioSource.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          const CHUNK_SAMPLES = sampleRate * (interval / 1e3);
          timer = setInterval(async () => {
            if (bufferChunks.length === 0)
              return;
            let accumulated = new Float32Array(0);
            while (accumulated.length < CHUNK_SAMPLES && bufferChunks.length) {
              const next = bufferChunks.shift();
              const tmp = new Float32Array(accumulated.length + next.length);
              tmp.set(accumulated, 0);
              tmp.set(next, accumulated.length);
              accumulated = tmp;
            }
            if (accumulated.length < CHUNK_SAMPLES)
              return;
            const chunkToSend = accumulated.slice(0, CHUNK_SAMPLES);
            const pcm = floatTo16BitPCM(chunkToSend);
            const wav = pcmToWav(pcm, sampleRate);
            const subtitle = await onAudioChunk({ pcm, wav });
            append(subtitle);
          }, interval);
          started = true;
        } catch (err) {
          console.error("[artplayerPluginAsr] Initialization failed:", err);
          await stopCapture();
        }
      }
      async function stopCapture() {
        if (!started)
          return;
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
      art.on("video:volumechange", () => {
        if (gainNode) {
          gainNode.gain.value = art.volume;
        }
      });
      art.on("play", startCapture);
      art.on("pause", stopCapture);
      art.on("destroy", destroy);
      return {
        name: "artplayerPluginAsr",
        stop: destroy,
        hide,
        append
      };
    };
  }
  if (typeof document !== "undefined") {
    if (!document.getElementById("artplayer-plugin-asr")) {
      const $style = document.createElement("style");
      $style.id = "artplayer-plugin-asr";
      $style.textContent = style;
      document.head.appendChild($style);
    }
  }
  return artplayerPluginAsr2;
})();
