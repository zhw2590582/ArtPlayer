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
const states = /* @__PURE__ */ new WeakMap();
function stateFor(tool) {
  if (!states.has(tool)) {
    states.set(tool, {
      closed: false,
      epoch: 0,
      inputEpoch: 0,
      job: null,
      video: null,
      sourceUrl: null,
      thumbnailUrl: null,
      sourceUrls: /* @__PURE__ */ new Set(),
      thumbnailUrls: /* @__PURE__ */ new Set(),
      sourceListeners: [],
      loading: false
    });
  }
  return states.get(tool);
}
function cancellation(reason) {
  const error = new Error(`Thumbnail task cancelled: ${reason}`);
  error.name = "AbortError";
  return error;
}
function revoke(urls, url) {
  if (!url)
    return;
  urls.delete(url);
  URL.revokeObjectURL(url);
}
function cleanupAll(callbacks) {
  let failure;
  for (const callback of callbacks) {
    try {
      callback();
    } catch (error) {
      failure || (failure = error);
    }
  }
  if (failure)
    throw failure;
}
function closeState(tool, reason = "destroyed") {
  const state = stateFor(tool);
  if (state.closed)
    return false;
  state.closed = true;
  state.epoch++;
  state.job?.cancel(reason);
  return true;
}
function releaseMedia(tool) {
  const state = stateFor(tool);
  const sources = /* @__PURE__ */ new Set([...state.sourceUrls, tool.videoUrl]);
  const thumbnails = /* @__PURE__ */ new Set([...state.thumbnailUrls, tool.thumbnailUrl]);
  const media = [];
  for (const video of /* @__PURE__ */ new Set([state.video, tool.video])) {
    if (video) {
      media.push(
        () => video.pause?.(),
        () => video.removeAttribute?.("src"),
        () => video.load?.(),
        () => video.parentNode?.removeChild(video)
      );
    }
  }
  cleanupAll([
    ...state.sourceListeners.splice(0),
    ...media,
    ...[...sources].map((url) => () => revoke(state.sourceUrls, url)),
    ...[...thumbnails].map((url) => () => revoke(state.thumbnailUrls, url))
  ]);
}
function loadSource(tool, file) {
  const state = stateFor(tool);
  if (!file || state.closed)
    return;
  const initialEpoch = state.epoch;
  const video = tool.video;
  const support = video.canPlayType(file.type);
  tool.errorHandle(support === "maybe" || support === "probably", `Playback of this file format is not supported: ${file.type}`);
  if (state.closed || state.epoch !== initialEpoch)
    return;
  const url = URL.createObjectURL(file);
  state.sourceUrls.add(url);
  if (state.closed || state.epoch !== initialEpoch) {
    revoke(state.sourceUrls, url);
    return;
  }
  const epoch = ++state.epoch;
  const initialWait = !state.sourceUrl && !tool.file && state.job?.adopt(epoch);
  if (!initialWait)
    state.job?.cancel("source changed");
  state.loading = true;
  const current = () => !state.closed && state.epoch === epoch;
  const previousListeners = state.sourceListeners;
  const listeners = [];
  state.sourceListeners = listeners;
  let pendingCleanup = () => {
  };
  let reported = false;
  const error = () => {
    if (!current() || reported || video.currentSrc && video.currentSrc !== url)
      return;
    reported = true;
    state.loading = false;
    const failure = new Error(`Unable to load video: media error ${video.error?.code || 0}`);
    if (state.job)
      state.job.fail(failure);
    else
      tool.emit("error", failure.message);
  };
  const ready = () => {
    if (current() && (!video.currentSrc || video.currentSrc === url)) {
      state.loading = false;
      state.job?.ready();
    }
  };
  try {
    cleanupAll(previousListeners.splice(0));
    if (!current()) {
      revoke(state.sourceUrls, url);
      return;
    }
    for (const [name, callback] of [["error", error], ["loadedmetadata", ready]]) {
      pendingCleanup = () => video.removeEventListener(name, callback);
      listeners.push(pendingCleanup);
      video.addEventListener(name, callback);
      if (!current()) {
        cleanupAll([pendingCleanup, ...listeners.splice(0)]);
        revoke(state.sourceUrls, url);
        return;
      }
    }
    tool.videoUrl = url;
    tool.file = file;
    tool.emit("file", file);
    if (!current()) {
      revoke(state.sourceUrls, url);
      return;
    }
    video.src = url;
    if (!current()) {
      revoke(state.sourceUrls, url);
      return;
    }
    state.sourceUrl = url;
    for (const previous of [...state.sourceUrls]) {
      if (previous !== url)
        revoke(state.sourceUrls, previous);
    }
    if (current())
      tool.emit("video", video);
  } catch (error2) {
    if (current()) {
      state.loading = false;
      state.job?.cancel("source setup failed");
    }
    try {
      cleanupAll([pendingCleanup, ...listeners.splice(0)]);
    } catch {
    }
    revoke(state.sourceUrls, url);
    throw error2;
  }
}
function replaceThumbnail(tool, blob, live) {
  const state = stateFor(tool);
  const url = URL.createObjectURL(blob);
  state.thumbnailUrls.add(url);
  if (!live()) {
    revoke(state.thumbnailUrls, url);
    return null;
  }
  const previous = /* @__PURE__ */ new Set([...state.thumbnailUrls, tool.thumbnailUrl]);
  state.thumbnailUrl = url;
  tool.thumbnailUrl = url;
  for (const old of previous) {
    if (old && old !== url)
      revoke(state.thumbnailUrls, old);
  }
  return live() ? url : null;
}
function getFileName(name) {
  const nameArray = name.split(".");
  nameArray.pop();
  return nameArray.join(".");
}
function clamp(num, a, b) {
  return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}
function prepare(tool, job) {
  const { video } = job;
  const { width, number, begin, end } = tool.option;
  const height = video.videoHeight / video.videoWidth * width;
  const guard = (condition, message) => {
    try {
      tool.errorHandle(condition, message);
    } catch (error) {
      job.reported = error;
      job.wasReported = true;
      throw error;
    }
  };
  tool.option.height = height;
  tool.option.begin = clamp(begin, 0, video.duration);
  tool.option.end = clamp(end || video.duration, begin, video.duration);
  guard(tool.option.end > tool.option.begin, "End time must be greater than the start time");
  guard(Number.isFinite(video.duration), "Video duration must be finite");
  tool.duration = tool.option.end - tool.option.begin;
  tool.density = number / tool.duration;
  guard(tool.file && video, "Please select the video file first");
  guard(!tool.processing, "There is currently a task in progress, please wait a moment...");
  guard(tool.density <= 1, `The preview density cannot be greater than 1, but got ${tool.density}`);
  const points = tool.creatScreenshotDate();
  const canvas = tool.creatCanvas();
  const context = canvas.getContext("2d");
  tool.emit("canvas", canvas);
  return { width, height, number, points, canvas, context };
}
function createJob(tool, state) {
  let epoch = state.epoch;
  const video = tool.video;
  let resolve;
  let reject;
  let timer;
  let settled = false;
  let running = false;
  let job;
  let frameCleanup = () => {
  };
  const listeners = [];
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  promise.catch(() => {
  });
  const live = () => !settled && !state.closed && state.epoch === epoch && state.job === job;
  function finish() {
    if (settled)
      return false;
    settled = true;
    if (state.job === job) {
      state.job = null;
      tool.processing = false;
    }
    cleanupAll([() => clearTimeout(timer), frameCleanup, ...listeners.splice(0)]);
    return true;
  }
  function fail(error, report = true) {
    if (settled)
      return;
    try {
      finish();
    } catch (cleanupError) {
      error || (error = cleanupError);
    }
    if (report) {
      try {
        tool.emit("error", error?.message);
      } catch (listenerError) {
        error = listenerError;
      }
    }
    reject(error);
  }
  function complete() {
    if (!live())
      return;
    try {
      finish();
      tool.emit("done");
      resolve();
    } catch (error) {
      let failure = error;
      try {
        tool.emit("error", error?.message);
      } catch (listenerError) {
        failure = listenerError;
      }
      reject(failure);
    }
  }
  function extract(plan) {
    if (!live())
      return;
    running = true;
    tool.processing = true;
    let index = 0;
    const next = () => {
      if (!live())
        return;
      if (index === plan.points.length) {
        complete();
        return;
      }
      const point = plan.points[index];
      let drawing = false;
      let encoded = false;
      const previous = video.oncanplay;
      const draw = () => {
        if (!live() || drawing || video.seeking || video.readyState !== void 0 && video.readyState < 2)
          return;
        drawing = true;
        try {
          frameCleanup();
          plan.context.drawImage(video, point.x, point.y, plan.width, plan.height);
          if (!live())
            return;
          plan.canvas.toBlob((blob) => {
            if (!live() || encoded)
              return;
            encoded = true;
            try {
              if (!blob)
                throw new Error("Unable to create thumbnail image");
              const url = replaceThumbnail(tool, blob, live);
              if (!url)
                return;
              tool.emit("update", url, (index + 1) / plan.number);
              index++;
              Promise.resolve().then(next);
            } catch (error) {
              fail(error);
            }
          });
        } catch (error) {
          fail(error);
        }
      };
      frameCleanup = () => {
        if (video.oncanplay === draw)
          video.oncanplay = previous;
        video.removeEventListener("seeked", draw);
      };
      try {
        video.oncanplay = draw;
        video.addEventListener("seeked", draw);
        video.currentTime = point.time;
        if (video.readyState >= 2 && !video.seeking)
          Promise.resolve().then(draw);
      } catch (error) {
        fail(error);
      }
    };
    Promise.resolve().then(next);
  }
  function ready(synchronous = false) {
    if (!live() || running)
      return;
    clearTimeout(timer);
    if (!state.loading && video.duration) {
      running = true;
      try {
        const plan = prepare(tool, job);
        extract(plan);
      } catch (error) {
        fail(error, !synchronous && !(job.wasReported && error === job.reported));
        if (synchronous)
          throw error;
      }
    } else {
      timer = setTimeout(() => ready(), 1e3);
      if (!live())
        clearTimeout(timer);
    }
  }
  job = {
    video,
    promise,
    ready,
    fail,
    cancel(reason) {
      fail(cancellation(reason), false);
    },
    adopt(sourceEpoch) {
      if (settled || running || video !== tool.video)
        return false;
      epoch = sourceEpoch;
      return true;
    }
  };
  state.job = job;
  try {
    for (const [name, callback] of [
      ["error", () => {
        if (live())
          fail(new Error(`Unable to load video: media error ${video.error?.code || 0}`));
      }],
      ["loadedmetadata", () => ready()],
      ["durationchange", () => ready()]
    ]) {
      listeners.push(() => video.removeEventListener(name, callback));
      video.addEventListener(name, callback);
      if (!live()) {
        cleanupAll([() => video.removeEventListener(name, callback), ...listeners.splice(0)]);
        return promise;
      }
    }
    if (video.error)
      fail(new Error(`Unable to load video: media error ${video.error.code}`));
    else
      ready(true);
  } catch (error) {
    fail(error, false);
    throw error;
  }
  return promise;
}
function startExtraction(tool) {
  const state = stateFor(tool);
  if (state.closed) {
    const promise = Promise.reject(cancellation("destroyed"));
    promise.catch(() => {
    });
    return promise;
  }
  tool.errorHandle(!state.job, "There is currently a task in progress, please wait a moment...");
  return createJob(tool, state);
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
  const state = stateFor(tool);
  const epoch = ++state.inputEpoch;
  const current = () => !state.closed && state.inputEpoch === epoch;
  const option = Object.assign({}, tool.option, patch);
  const target = option.fileInput;
  tool.errorHandle(target instanceof Element, "The 'fileInput' is not a Element");
  for (const name of ["number", "width", "column", "begin", "end"])
    tool.errorHandle(typeof option[name] === "number", `The '${name}' is not a number`);
  option.number = clamp(option.number, 10, 1e3);
  option.width = clamp(option.width, 10, 1e3);
  option.column = clamp(option.column, 1, 1e3);
  if (!current())
    throw cancellation("input setup superseded");
  const previous = inputs.get(tool);
  if (previous && (target === previous.input || target === previous.wrapper)) {
    option.fileInput = previous.input;
    tool.option = option;
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
    if (!current())
      throw cancellation("input setup superseded");
    if (record.callbacks)
      connect(record, record.callbacks);
    if (!current())
      throw cancellation("input setup superseded");
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
class ArtplayerToolThumbnail extends Emitter {
  constructor(option = {}) {
    super();
    this.processing = false;
    this.option = {};
    try {
      this.setup(Object.assign({}, ArtplayerToolThumbnail.DEFAULTS, option));
      this.video = ArtplayerToolThumbnail.creatVideo();
      stateFor(this).video = this.video;
      this.duration = 0;
      this.inputChange = this.inputChange.bind(this);
      this.ondrop = this.ondrop.bind(this);
      connectInput(this, ArtplayerToolThumbnail.ondragover);
    } catch (error) {
      closeState(this, "construction failed");
      try {
        releaseInput(this);
      } catch {
      }
      try {
        releaseMedia(this);
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
    if (stateFor(this).closed)
      return;
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    this.loadVideo(file);
  }
  setup(option = {}) {
    if (!stateFor(this).closed)
      setupInput(this, option);
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
    if (stateFor(this).closed)
      return;
    const file = this.option.fileInput.files[0];
    this.loadVideo(file);
    event.target.value = "";
  }
  loadVideo(file) {
    loadSource(this, file);
  }
  start() {
    return startExtraction(this);
  }
  creatScreenshotDate() {
    return screenshotPoints(this.option, this.duration);
  }
  creatCanvas() {
    return createSheet(this.option);
  }
  download() {
    if (stateFor(this).closed)
      return this;
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
    if (!closeState(this))
      return;
    cleanupAll([
      () => releaseInput(this),
      () => releaseMedia(this),
      () => this.emit("destroy")
    ]);
  }
}
export {
  ArtplayerToolThumbnail as default
};
