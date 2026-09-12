/*!
 * artplayer-tool-thumbnail.js v4.4.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
class Emitter {
  on(name, fn, ctx) {
    const e = this.e || (this.e = {});
    (e[name] || (e[name] = [])).push({ fn, ctx });
    return this;
  }
  once(name, fn, ctx) {
    const self = this;
    function listener(...args) {
      self.off(name, listener);
      fn.apply(ctx, args);
    }
    listener._ = fn;
    return this.on(name, listener, ctx);
  }
  emit(name, ...data) {
    const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    for (let i = 0; i < evtArr.length; i += 1) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    return this;
  }
  off(name, callback) {
    const e = this.e || (this.e = {});
    const evts = e[name];
    const liveEvents = [];
    if (evts && callback) {
      for (let i = 0, len = evts.length; i < len; i += 1) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }
    if (liveEvents.length) {
      e[name] = liveEvents;
    } else {
      delete e[name];
    }
    return this;
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function runPromisesInSeries(ps) {
  return ps.reduce((p, next) => p.then(next), Promise.resolve());
}
function getFileName(name) {
  const nameArray = name.split(".");
  nameArray.pop();
  return nameArray.join(".");
}
function clamp(num, a, b) {
  return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}
const inputs = /* @__PURE__ */ new WeakMap();
function release(record) {
  let failure;
  for (const [name, callback] of record.listeners.splice(0)) {
    try {
      record.input.removeEventListener(name, callback);
    } catch (error) {
      failure || (failure = error);
    }
  }
  if (record.wrapper) {
    try {
      if (record.input.parentNode)
        record.input.parentNode.removeChild(record.input);
    } catch (error) {
      failure || (failure = error);
    }
    if (record.wrapper.style.position === "relative")
      record.wrapper.style.position = record.position;
  }
  if (failure)
    throw failure;
}
function connect(record, callbacks) {
  try {
    for (const [name, callback] of callbacks) {
      record.listeners.push([name, callback]);
      record.input.addEventListener(name, callback);
    }
  } catch (error) {
    try {
      release(record);
    } catch {
    }
    throw error;
  }
}
function setupInput(tool, patch) {
  const option = Object.assign({}, tool.option, patch);
  const target = option.fileInput;
  tool.errorHandle(target instanceof Element, "The 'fileInput' is not a Element");
  for (const name of ["number", "width", "column", "begin", "end"])
    tool.errorHandle(typeof option[name] === "number", `The '${name}' is not a number`);
  option.number = clamp(option.number, 10, 1e3);
  option.width = clamp(option.width, 10, 1e3);
  option.column = clamp(option.column, 1, 1e3);
  const previous = inputs.get(tool);
  if (previous && (target === previous.input || target === previous.wrapper)) {
    option.fileInput = previous.input;
    return option;
  }
  const record = { input: target, wrapper: null, position: "", listeners: [], callbacks: previous?.callbacks || null };
  try {
    if (!(target.tagName === "INPUT" && target.type === "file")) {
      record.wrapper = target;
      record.position = target.style.position;
      record.input = document.createElement("input");
      record.input.type = "file";
      Object.assign(record.input.style, { position: "absolute", width: "100%", height: "100%", left: "0", top: "0", right: "0", bottom: "0", opacity: "0" });
      target.style.position = "relative";
      target.appendChild(record.input);
    }
    if (record.callbacks)
      connect(record, record.callbacks);
  } catch (error) {
    try {
      release(record);
    } catch {
    }
    throw error;
  }
  option.fileInput = record.input;
  inputs.set(tool, record);
  tool.option = option;
  if (previous)
    release(previous);
  return option;
}
function connectInput(tool, dragover) {
  const record = inputs.get(tool);
  record.callbacks = [["change", tool.inputChange], ["dragover", dragover], ["drop", tool.ondrop]];
  connect(record, record.callbacks);
}
function releaseInput(tool) {
  const record = inputs.get(tool);
  if (!record)
    return;
  inputs.delete(tool);
  release(record);
}
function screenshotPoints(option, duration) {
  const { number, width, height, column, begin } = option;
  const timeGap = duration / number;
  const timePoints = [begin + timeGap];
  while (timePoints.length < number) {
    const last = timePoints[timePoints.length - 1];
    timePoints.push(last + timeGap);
  }
  return timePoints.map((item, index) => ({
    time: item - timeGap / 2,
    x: index % column * width,
    y: Math.floor(index / column) * height
  }));
}
function createSheet(option) {
  const { number, width, height, column } = option;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = width * column;
  canvas.height = Math.ceil(number / column) * height + 30;
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "14px Georgia";
  context.fillStyle = "#fff";
  context.fillText(
    `From: https://artplayer.org/, Number: ${number}, Width: ${width}, Height: ${height}, Column: ${column}`,
    10,
    canvas.height - 11
  );
  return canvas;
}
function downloadSheet(file, url) {
  const link = document.createElement("a");
  const name = `${getFileName(file.name)}.png`;
  link.download = name;
  link.href = url;
  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    if (link.parentNode)
      link.parentNode.removeChild(link);
  }
  return name;
}
const destroyed = /* @__PURE__ */ new WeakSet();
class ArtplayerToolThumbnail extends Emitter {
  constructor(option = {}) {
    super();
    this.processing = false;
    this.option = {};
    try {
      this.setup(Object.assign({}, ArtplayerToolThumbnail.DEFAULTS, option));
      this.video = ArtplayerToolThumbnail.creatVideo();
      this.duration = 0;
      this.inputChange = this.inputChange.bind(this);
      this.ondrop = this.ondrop.bind(this);
      connectInput(this, ArtplayerToolThumbnail.ondragover);
    } catch (error) {
      try {
        releaseInput(this);
      } catch {
      }
      try {
        if (this.video?.parentNode)
          this.video.parentNode.removeChild(this.video);
      } catch {
      }
      throw error;
    }
  }
  static get DEFAULTS() {
    return {
      number: 60,
      width: 160,
      height: 90,
      column: 10,
      begin: 0,
      end: Number.NaN
    };
  }
  static ondragover(event) {
    event.preventDefault();
  }
  ondrop(event) {
    if (destroyed.has(this))
      return;
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    this.loadVideo(file);
  }
  setup(option = {}) {
    if (!destroyed.has(this))
      this.option = setupInput(this, option);
    return this;
  }
  static creatVideo() {
    const video = document.createElement("video");
    video.style.position = "absolute";
    video.style.top = "-9999px";
    video.style.left = "-9999px";
    video.muted = true;
    video.controls = true;
    try {
      document.body.appendChild(video);
    } catch (error) {
      if (video.parentNode)
        video.parentNode.removeChild(video);
      throw error;
    }
    return video;
  }
  inputChange(event) {
    if (destroyed.has(this))
      return;
    const file = this.option.fileInput.files[0];
    this.loadVideo(file);
    event.target.value = "";
  }
  loadVideo(file) {
    if (file && !destroyed.has(this)) {
      const canPlayType = this.video.canPlayType(file.type);
      this.errorHandle(
        canPlayType === "maybe" || canPlayType === "probably",
        `Playback of this file format is not supported: ${file.type}`
      );
      const videoUrl = URL.createObjectURL(file);
      this.videoUrl = videoUrl;
      this.file = file;
      this.emit("file", this.file);
      this.video.src = videoUrl;
      this.emit("video", this.video);
    }
  }
  start() {
    if (!this.video.duration)
      return sleep(1e3).then(() => this.start());
    const { width, number, begin, end } = this.option;
    const height = this.video.videoHeight / this.video.videoWidth * width;
    this.option.height = height;
    this.option.begin = clamp(begin, 0, this.video.duration);
    this.option.end = clamp(end || this.video.duration, begin, this.video.duration);
    this.errorHandle(this.option.end > this.option.begin, `End time must be greater than the start time`);
    this.duration = this.option.end - this.option.begin;
    this.density = number / this.duration;
    this.errorHandle(this.file && this.video, "Please select the video file first");
    this.errorHandle(!this.processing, "There is currently a task in progress, please wait a moment...");
    this.errorHandle(this.density <= 1, `The preview density cannot be greater than 1, but got ${this.density}`);
    const screenshotDate = this.creatScreenshotDate();
    const canvas = this.creatCanvas();
    const context2D = canvas.getContext("2d");
    this.emit("canvas", canvas);
    const promiseList = screenshotDate.map((item, index) => () => {
      return new Promise((resolve) => {
        this.video.oncanplay = () => {
          context2D.drawImage(this.video, item.x, item.y, width, height);
          canvas.toBlob((blob) => {
            if (this.thumbnailUrl) {
              URL.revokeObjectURL(this.thumbnailUrl);
            }
            this.thumbnailUrl = URL.createObjectURL(blob);
            this.emit("update", this.thumbnailUrl, (index + 1) / number);
            this.video.oncanplay = null;
            resolve();
          });
        };
        this.video.currentTime = item.time;
      });
    });
    this.processing = true;
    return runPromisesInSeries(promiseList).then(() => {
      this.processing = false;
      this.emit("done");
    }).catch((err) => {
      this.processing = false;
      this.emit("error", err.message);
      throw err;
    });
  }
  creatScreenshotDate() {
    return screenshotPoints(this.option, this.duration);
  }
  creatCanvas() {
    return createSheet(this.option);
  }
  download() {
    this.errorHandle(
      this.file && this.thumbnailUrl,
      "Download does not seem to be ready, please create preview first"
    );
    this.errorHandle(!this.processing, "There is currently a task in progress, please wait a moment...");
    const name = downloadSheet(this.file, this.thumbnailUrl);
    this.emit("download", name);
    return this;
  }
  errorHandle(condition, msg) {
    if (!condition) {
      this.emit("error", msg);
      throw new Error(msg);
    }
  }
  destroy() {
    if (destroyed.has(this))
      return;
    destroyed.add(this);
    let failure;
    for (const cleanup of [
      () => releaseInput(this),
      () => this.video.parentNode?.removeChild(this.video),
      () => this.videoUrl && URL.revokeObjectURL(this.videoUrl),
      () => this.thumbnailUrl && URL.revokeObjectURL(this.thumbnailUrl),
      () => this.emit("destroy")
    ]) {
      try {
        cleanup();
      } catch (error) {
        failure || (failure = error);
      }
    }
    if (failure)
      throw failure;
  }
}
export {
  ArtplayerToolThumbnail as default
};
