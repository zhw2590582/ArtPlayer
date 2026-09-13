/*!
 * artplayer-plugin-asr.js v2.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
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
class AudioGraph {
  constructor(video, sampleRate) {
    this.video = video;
    this.sampleRate = sampleRate;
    this.closed = false;
    this.direct = false;
    this.workletLoaded = false;
  }
  assertOpen() {
    if (this.closed)
      throw new Error("Audio capture was closed");
  }
  revokeWorklet() {
    if (this.blobUrl !== void 0) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = void 0;
    }
  }
  async initialize() {
    this.assertOpen();
    const platform = window;
    const Context = window.AudioContext || platform.webkitAudioContext;
    if (!Context)
      throw new Error("AudioContext is not supported");
    const context = this.context ?? (this.context = new Context({ sampleRate: this.sampleRate }));
    if (context.state === "suspended")
      await context.resume();
    this.assertOpen();
    if (!this.workletLoaded) {
      this.blobUrl = URL.createObjectURL(new Blob([recorderProcessorCode], { type: "application/javascript" }));
      try {
        await context.audioWorklet.addModule(this.blobUrl);
        this.workletLoaded = true;
      } finally {
        this.revokeWorklet();
      }
    }
    this.assertOpen();
    if (!this.source) {
      try {
        this.source = context.createMediaElementSource(this.video);
        this.direct = true;
      } catch (error) {
        console.warn("[artplayerPluginAsr] Direct connection failed:", error);
        const capture = this.video.captureStream || this.video.mozCaptureStream;
        if (!capture)
          throw new Error("Could not establish audio source");
        this.stream = capture.call(this.video);
        this.source = context.createMediaStreamSource(this.stream);
      }
    }
  }
  prepare() {
    this.preparation ?? (this.preparation = this.initialize().catch((error) => {
      this.preparation = void 0;
      throw error;
    }));
    return this.preparation;
  }
  get ownsMediaConnection() {
    return this.direct;
  }
  idle() {
    const gain = this.gain;
    this.disconnect();
    if (this.direct && this.context && this.source) {
      this.gain = gain || this.context.createGain();
      if (!gain)
        this.gain.gain.value = 1;
      this.source.connect(this.gain);
      this.gain.connect(this.context.destination);
    }
  }
  connect(receive) {
    this.assertOpen();
    const context = this.context;
    const source = this.source;
    if (!context || !source)
      throw new Error("Audio capture is not prepared");
    const previousGain = this.gain;
    this.disconnect();
    const gain = this.gain = previousGain || context.createGain();
    if (!previousGain)
      gain.gain.value = 1;
    const recorder = this.recorder = new AudioWorkletNode(context, "recorder-processor");
    recorder.port.onmessage = (event) => {
      if (!this.closed && this.recorder === recorder)
        receive(event.data);
    };
    source.connect(recorder);
    source.connect(gain);
    gain.connect(context.destination);
  }
  volume(value) {
    if (this.gain)
      this.gain.gain.value = value;
  }
  disconnect() {
    if (this.recorder) {
      this.recorder.port.onmessage = null;
      this.recorder.disconnect();
      this.recorder = void 0;
    }
    this.gain?.disconnect();
    this.gain = void 0;
    this.source?.disconnect();
  }
  async close() {
    if (this.closed)
      return;
    this.closed = true;
    this.disconnect();
    this.revokeWorklet();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = void 0;
    const context = this.context;
    this.context = void 0;
    this.source = void 0;
    if (context && context.state !== "closed")
      await context.close();
  }
}
function encodeAudio(samples, sampleRate) {
  const pcm = new ArrayBuffer(samples.length * 2);
  const pcmView = new DataView(pcm);
  for (let index = 0; index < samples.length; index++) {
    const value = Math.max(-1, Math.min(1, samples[index]));
    pcmView.setInt16(index * 2, value < 0 ? value * 32768 : value * 32767, true);
  }
  const wav = new ArrayBuffer(44 + pcm.byteLength);
  const header = new DataView(wav);
  function writeString(offset, value) {
    for (let index = 0; index < value.length; index++)
      header.setUint8(offset + index, value.charCodeAt(index));
  }
  writeString(0, "RIFF");
  header.setUint32(4, 36 + pcm.byteLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  header.setUint32(16, 16, true);
  header.setUint16(20, 1, true);
  header.setUint16(22, 1, true);
  header.setUint32(24, sampleRate, true);
  header.setUint32(28, sampleRate * 2, true);
  header.setUint16(32, 2, true);
  header.setUint16(34, 16, true);
  writeString(36, "data");
  header.setUint32(40, pcm.byteLength, true);
  new Uint8Array(wav).set(new Uint8Array(pcm), 44);
  return { pcm, wav };
}
class SampleQueue {
  constructor() {
    this.offset = 0;
    this.size = 0;
  }
  get length() {
    return this.size;
  }
  push(input) {
    if (input.length === 0)
      return;
    const block = { samples: new Float32Array(input) };
    if (this.tail)
      this.tail.next = block;
    else
      this.head = block;
    this.tail = block;
    this.size += input.length;
  }
  take(count) {
    if (!Number.isSafeInteger(count) || count <= 0)
      throw new RangeError("Sample count must be a positive safe integer");
    if (count > this.size)
      return null;
    const output = new Float32Array(count);
    let written = 0;
    while (this.head && written < count) {
      const samples = this.head.samples;
      const amount = Math.min(samples.length - this.offset, count - written);
      output.set(samples.subarray(this.offset, this.offset + amount), written);
      written += amount;
      this.offset += amount;
      if (this.offset === samples.length) {
        this.head = this.head.next;
        this.offset = 0;
      }
    }
    if (!this.head)
      this.tail = void 0;
    this.size -= count;
    return output;
  }
  clear() {
    this.head = void 0;
    this.tail = void 0;
    this.offset = 0;
    this.size = 0;
  }
}
class Capture {
  constructor(video, options, append) {
    this.video = video;
    this.options = options;
    this.append = append;
    this.queue = new SampleQueue();
    this.closing = Promise.resolve();
    this.running = false;
    this.terminal = false;
    this.epoch = 0;
  }
  reset() {
    this.epoch++;
    this.pending = void 0;
    this.queue.clear();
  }
  pause() {
    this.reset();
    this.running = false;
    clearInterval(this.timer);
    this.timer = void 0;
    this.starting = void 0;
    this.graph?.idle();
  }
  restart() {
    const active = this.running || Boolean(this.starting);
    this.pause();
    if (this.graph && !this.graph.ownsMediaConnection)
      return this.stop().then(() => active ? this.start() : void 0);
    return active ? this.start() : Promise.resolve();
  }
  start() {
    if (this.terminal || this.running)
      return Promise.resolve();
    if (this.starting)
      return this.starting;
    const epoch = this.epoch;
    const current = () => !this.terminal && this.epoch === epoch;
    const operation = (async () => {
      await this.closing;
      if (!current())
        return;
      const { sampleRate, interval } = this.options;
      const count = Math.floor(sampleRate * interval / 1e3);
      if (!Number.isSafeInteger(count) || count < 1 || !Number.isFinite(interval) || interval <= 0)
        throw new Error("Audio chunk length must be positive and finite");
      const graph = this.graph ?? (this.graph = new AudioGraph(this.video, sampleRate));
      await graph.prepare();
      if (!current()) {
        if (!this.running && this.graph === graph)
          graph.idle();
        return;
      }
      graph.connect((samples) => {
        if (!this.running || this.graph !== graph)
          return;
        if (this.queue.length + samples.length > Math.max(sampleRate * 60, count * 2)) {
          console.error("[artplayerPluginAsr] Audio callback backlog exceeded its capture limit");
          this.pause();
          return;
        }
        this.queue.push(samples);
      });
      this.running = true;
      this.timer = setInterval(() => this.tick(count), interval);
    })().catch(async (error) => {
      if (current()) {
        console.error("[artplayerPluginAsr] Initialization failed:", error);
        await this.stop();
      }
    }).finally(() => {
      if (this.starting === operation)
        this.starting = void 0;
    });
    this.starting = operation;
    return operation;
  }
  async tick(count) {
    if (!this.running || this.pending)
      return;
    const samples = this.queue.take(count);
    if (!samples)
      return;
    const epoch = this.epoch;
    const pending = this.pending = {};
    try {
      const text = await this.options.onAudioChunk(encodeAudio(samples, this.options.sampleRate));
      if (this.running && !this.terminal && this.epoch === epoch)
        this.append(text);
    } catch (error) {
      if (this.epoch === epoch && !this.terminal)
        console.error("[artplayerPluginAsr] Audio callback failed:", error);
    } finally {
      if (this.pending === pending)
        this.pending = void 0;
    }
  }
  volume(value) {
    this.graph?.volume(value);
  }
  stop(terminal = false) {
    this.terminal || (this.terminal = terminal);
    this.pause();
    const graph = this.graph;
    if (terminal || !graph?.ownsMediaConnection) {
      this.graph = void 0;
      this.closing = Promise.all([this.closing, graph?.close()]).then(() => void 0);
    }
    return this.closing;
  }
}
const style = ".art-video-player .art-layer-asr {\n  pointer-events: none !important;\n  position: absolute;\n  z-index: 150;\n  inset: 0px;\n  display: flex;\n  flex-direction: column;\n  justify-content: end;\n  padding: 0 2%;\n  font-size: 1rem;\n  gap: var(--art-subtitle-gap);\n  padding-bottom: var(--art-subtitle-bottom);\n  transition: padding-bottom var(--art-transition-duration) ease;\n  text-shadow: var(--art-subtitle-border) 1px 0 1px, var(--art-subtitle-border) 0 1px 1px, var(--art-subtitle-border) -1px 0 1px, var(--art-subtitle-border) 0 -1px 1px, var(--art-subtitle-border) 1px 1px 1px, var(--art-subtitle-border) -1px -1px 1px, var(--art-subtitle-border) 1px -1px 1px, var(--art-subtitle-border) -1px 1px 1px;\n}\n.art-video-player.art-control-show .art-layer-asr {\n  padding-bottom: calc(var(--art-control-height) + var(--art-subtitle-bottom));\n}\n";
function createSubtitles(layer, length, autoHideTimeout) {
  let timer;
  let destroyed = false;
  function cancelTimer() {
    clearTimeout(timer);
    timer = void 0;
  }
  function hide() {
    if (!destroyed)
      layer.style.display = "none";
  }
  function append(subtitle) {
    if (destroyed || typeof subtitle !== "string")
      return;
    cancelTimer();
    timer = setTimeout(hide, autoHideTimeout);
    layer.style.display = "";
    layer.innerHTML = subtitle.split(/(?<=[、。！？!?.])\s*/u).map((line) => line.trim()).filter(Boolean).slice(-length).map((line) => `<div class="art-asr-line">${line}</div>`).join("");
  }
  return {
    append,
    hide,
    destroy() {
      destroyed = true;
      cancelTimer();
    }
  };
}
function artplayerPluginAsr(option = {}) {
  const { length = 3, interval = 100, sampleRate = 16e3, autoHideTimeout = 1e4, onAudioChunk = () => null } = option;
  return (art) => {
    const layer = art.layers.add({ name: "asr", html: "" });
    if (!layer)
      throw new Error("Could not create ASR subtitle layer");
    const subtitles = createSubtitles(layer, length, autoHideTimeout);
    const capture = new Capture(art.video, { interval, sampleRate, onAudioChunk }, subtitles.append);
    const volume = () => capture.volume(art.volume);
    const play = () => capture.start();
    const pause = () => capture.pause();
    const restart = () => capture.restart();
    const stop = () => capture.stop();
    const destroy = () => {
      subtitles.destroy();
      art.off("video:volumechange", volume);
      art.off("play", play);
      art.off("pause", pause);
      art.off("restart", restart);
      art.off("destroy", destroy);
      return capture.stop(true);
    };
    art.on("video:volumechange", volume);
    art.on("play", play);
    art.on("pause", pause);
    art.on("restart", restart);
    art.on("destroy", destroy);
    return { name: "artplayerPluginAsr", stop, hide: subtitles.hide, append: subtitles.append };
  };
}
Object.defineProperty(artplayerPluginAsr, "default", { value: artplayerPluginAsr });
if (typeof document !== "undefined" && !document.getElementById("artplayer-plugin-asr")) {
  const styleElement = document.createElement("style");
  styleElement.id = "artplayer-plugin-asr";
  styleElement.textContent = style;
  document.head.appendChild(styleElement);
}
export {
  artplayerPluginAsr as default
};
