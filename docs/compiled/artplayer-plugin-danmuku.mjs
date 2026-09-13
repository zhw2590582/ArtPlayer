/*!
 * artplayer-plugin-danmuku.js v5.3.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function defaultOption() {
  return {
    danmuku: [],
    speed: 5,
    margin: [10, "25%"],
    opacity: 1,
    color: "#FFFFFF",
    mode: 0,
    modes: [0, 1, 2],
    fontSize: 25,
    antiOverlap: true,
    synchronousPlayback: false,
    mount: void 0,
    heatmap: false,
    width: 512,
    points: [],
    filter: () => true,
    beforeEmit: () => true,
    beforeVisible: () => true,
    visible: true,
    emitter: true,
    maxLength: 200,
    lockTime: 5,
    theme: "dark",
    OPACITY: {},
    FONT_SIZE: {},
    MARGIN: {},
    SPEED: {},
    COLOR: []
  };
}
function optionScheme() {
  return {
    danmuku: "array|function|string|promise",
    speed: "number",
    margin: "array",
    opacity: "number",
    color: "string",
    mode: "number",
    modes: "array",
    fontSize: "number|string",
    antiOverlap: "boolean",
    synchronousPlayback: "boolean",
    mount: "?htmldivelement|string",
    heatmap: "object|boolean",
    width: "number",
    points: "array",
    filter: "function",
    beforeEmit: "function",
    beforeVisible: "function",
    visible: "boolean",
    emitter: "boolean",
    maxLength: "number",
    lockTime: "number",
    theme: "string",
    OPACITY: "object",
    FONT_SIZE: "object",
    MARGIN: "object",
    SPEED: "object",
    COLOR: "array"
  };
}
function isPromiseInput(value) {
  return value instanceof Promise || Object.prototype.toString.call(value) === "[object Promise]";
}
function optionChanged(previous, update) {
  return Object.keys(update).some((key) => {
    const before = previous[key];
    const after = update[key];
    if (typeof before === "function" || typeof after === "function" || isPromiseInput(before) || isPromiseInput(after))
      return before !== after;
    return JSON.stringify(before) !== JSON.stringify(after);
  });
}
function normalizeOption(previous, update, { defaults, validate, clamp, mount }) {
  const next = Object.assign({}, defaults, previous, update);
  validate(next);
  next.mode = clamp(next.mode, 0, 2);
  next.speed = clamp(next.speed, 1, 10);
  next.opacity = clamp(next.opacity, 0, 1);
  next.lockTime = clamp(next.lockTime, 1, 60);
  next.maxLength = clamp(next.maxLength, 1, 1e3);
  next.mount = next.mount || mount;
  return next;
}
function getMode(key) {
  switch (key) {
    case 1:
    case 2:
    case 3:
      return 0;
    case 4:
      return 2;
    case 5:
      return 1;
    default:
      return 0;
  }
}
function bilibiliDanmuParseFromXml(xmlString) {
  if (typeof xmlString !== "string")
    return [];
  const reg = /<d[^>]*?p="(?<p>[^"]+)"[^>]*>(?<text>.*?)<\/d>/gs;
  const matches = xmlString.matchAll(reg);
  return Array.from(matches).map((match) => {
    const attr = match.groups.p.split(",");
    if (attr.length >= 8) {
      const text = match.groups.text.trim().replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
      return {
        text,
        time: Number(attr[0]),
        mode: getMode(Number(attr[1])),
        fontSize: Number(attr[2]),
        color: `#${Number(attr[3]).toString(16)}`,
        timestamp: Number(attr[4]),
        pool: Number(attr[5]),
        userID: attr[6],
        rowID: Number(attr[7])
      };
    } else {
      return null;
    }
  }).filter(Boolean);
}
function onmessage({ data }) {
  const { xml, id } = data;
  const danmus = bilibiliDanmuParseFromXml(xml);
  globalThis.postMessage({ danmus, id });
}
let nextRequest$1 = 0;
function abortError(signal) {
  if (signal?.reason !== void 0)
    return signal.reason;
  const error = new Error("Bilibili Danmu loading cancelled");
  error.name = "AbortError";
  return error;
}
function bilibiliDanmuParseFromUrl(url, { signal, onCancel } = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let worker;
    let workerUrl;
    let releaseCancel;
    const id = ++nextRequest$1;
    const cancel = () => finish(void 0, abortError(signal));
    function releaseWorker() {
      let error;
      let failed = false;
      try {
        if (worker) {
          const current = worker;
          worker = void 0;
          current.onmessage = null;
          current.onerror = null;
          current.onmessageerror = null;
          current.terminate();
        }
      } catch (failure) {
        error = failure;
        failed = true;
      }
      if (workerUrl !== void 0) {
        const current = workerUrl;
        workerUrl = void 0;
        try {
          URL.revokeObjectURL(current);
        } catch (failure) {
          if (!failed)
            error = failure;
          failed = true;
        }
      }
      if (failed)
        throw error;
    }
    function finish(value, error) {
      if (settled)
        return;
      settled = true;
      let failed = arguments.length > 1;
      signal?.removeEventListener("abort", cancel);
      releaseCancel?.();
      try {
        releaseWorker();
      } catch (cleanupError) {
        if (!failed)
          error = cleanupError;
        failed = true;
      }
      if (failed)
        reject(error);
      else resolve(value);
    }
    function fallback(xml, error) {
      if (settled)
        return;
      console.error("Error parsing Bilibili Danmu:", error);
      try {
        finish(bilibiliDanmuParseFromXml(xml));
      } catch (failure) {
        finish(void 0, failure);
      }
    }
    async function read() {
      const response = signal ? await fetch(url, { signal }) : await fetch(url);
      if (settled)
        return;
      const xml = await response.text();
      if (settled)
        return;
      try {
        const workerText = `
          ${getMode.toString()}
          ${bilibiliDanmuParseFromXml.toString()}
          onmessage = ${onmessage.toString()}
        `;
        workerUrl = URL.createObjectURL(new Blob([workerText], { type: "application/javascript" }));
        if (settled) {
          releaseWorker();
          return;
        }
        worker = new Worker(workerUrl);
        if (settled) {
          releaseWorker();
          return;
        }
        worker.onmessage = (event) => {
          if (settled || event.data?.id !== id)
            return;
          const { danmus } = event.data;
          if (!Array.isArray(danmus)) {
            finish(void 0, new Error("Invalid Bilibili Danmu worker response"));
            return;
          }
          finish(danmus);
        };
        worker.onerror = (event) => {
          event.preventDefault?.();
          fallback(xml, event.error || event);
        };
        worker.onmessageerror = (event) => fallback(xml, event.error || event);
        worker.postMessage({ xml, id });
      } catch (error) {
        fallback(xml, error);
      }
    }
    if (signal?.aborted) {
      cancel();
      return;
    }
    signal?.addEventListener("abort", cancel);
    releaseCancel = onCancel?.(cancel);
    if (settled) {
      releaseCancel?.();
      return;
    }
    read().catch((error) => finish(void 0, error));
  });
}
const inputs = /* @__PURE__ */ new WeakMap();
const cancelled$1 = /* @__PURE__ */ Symbol("cancelled danmuku input");
function stateFor(owner) {
  if (!inputs.has(owner))
    inputs.set(owner, { closed: false, tasks: /* @__PURE__ */ new Set(), emitting: [] });
  return inputs.get(owner);
}
function inputActive(owner) {
  const state = stateFor(owner);
  const task = state.emitting[state.emitting.length - 1];
  return !state.closed && !owner.art.isDestroy && (!task || task.active());
}
function beginInput(owner, replace) {
  const state = stateFor(owner);
  if (replace) {
    for (const task2 of [...state.tasks]) {
      if (task2.replace)
        task2.cancel();
    }
  }
  let stopped = state.closed || owner.art.isDestroy;
  let resolveCancel;
  const cancellation = new Promise((resolve) => resolveCancel = resolve);
  const handlers = /* @__PURE__ */ new Set();
  const controller = typeof AbortController === "function" ? new AbortController() : void 0;
  const task = {
    replace,
    signal: controller?.signal,
    active: () => !stopped && !state.closed && !owner.art.isDestroy,
    onCancel(callback) {
      if (!task.active()) {
        callback();
        return () => {
        };
      }
      handlers.add(callback);
      return () => handlers.delete(callback);
    },
    cancel() {
      if (stopped)
        return;
      stopped = true;
      resolveCancel(cancelled$1);
      controller?.abort();
      for (const callback of [...handlers]) callback();
      handlers.clear();
    },
    wait: (value) => Promise.race([value, cancellation]),
    emit(danmu) {
      state.emitting.push(task);
      try {
        return owner.emit(danmu);
      } finally {
        state.emitting.pop();
      }
    },
    finish() {
      state.tasks.delete(task);
      handlers.clear();
    }
  };
  if (stopped)
    resolveCancel(cancelled$1);
  else state.tasks.add(task);
  return task;
}
function cancelInputs(owner) {
  const state = stateFor(owner);
  state.closed = true;
  for (const task of [...state.tasks]) task.cancel();
}
function readInput(target, task) {
  if (typeof target === "function")
    return { asynchronous: true, value: target() };
  if (isPromiseInput(target))
    return { asynchronous: true, value: target };
  if (typeof target === "string")
    return { asynchronous: true, value: bilibiliDanmuParseFromUrl(target, task) };
  return { asynchronous: false, value: Array.isArray(target) ? target : [] };
}
function filterState(owner, state, callback) {
  const danmus = owner.states[state] || [];
  for (let index = 0; index < danmus.length; index++) callback(danmus[index]);
  return danmus;
}
function readyItems(owner) {
  const { currentTime } = owner.art;
  const result = [];
  filterState(owner, "ready", (danmu) => result.push(danmu));
  filterState(owner, "wait", (danmu) => {
    if (currentTime + 0.1 >= danmu.time && danmu.time >= currentTime - 0.1)
      result.push(danmu);
  });
  return result;
}
function setItemState(owner, danmu, state) {
  owner.states[danmu.$state] = owner.states[danmu.$state].filter((item) => item !== danmu);
  danmu.$state = state;
  if (danmu.$ref)
    danmu.$ref.dataset.state = state;
  owner.states[state].push(danmu);
}
class Renderer {
  constructor(owner) {
    this.owner = owner;
    this.nodes = /* @__PURE__ */ new Set();
  }
  acquire() {
    const $ref = this.owner.$refs.pop() || document.createElement("div");
    $ref.style.cssText = this.owner.constructor.cssText;
    $ref.dataset.mode = "";
    $ref.dataset.id = "";
    $ref.className = "";
    this.nodes.add($ref);
    return $ref;
  }
  get visibles() {
    const result = [];
    const { clientWidth } = this.owner.$player;
    const clientLeft = this.owner.getLeft(this.owner.$player);
    this.owner.filter("emit", (danmu) => {
      const top = danmu.$ref.offsetTop;
      const left = this.owner.getLeft(danmu.$ref) - clientLeft;
      const height = danmu.$ref.clientHeight;
      const width = danmu.$ref.clientWidth;
      const distance = left + width;
      const right = clientWidth - distance;
      const speed = distance / danmu.$restTime;
      const emit = {};
      emit.top = top;
      emit.left = left;
      emit.height = height;
      emit.width = width;
      emit.right = right;
      emit.speed = speed;
      emit.distance = distance;
      emit.time = danmu.$restTime;
      emit.mode = danmu.mode;
      result.push(emit);
    });
    return result;
  }
  left($ref) {
    const rect = $ref.getBoundingClientRect();
    return this.owner.isRotate ? rect.top : rect.left;
  }
  makeWait(danmu) {
    this.owner.setState(danmu, "wait");
    if (danmu.$ref) {
      danmu.$ref.style.cssText = this.owner.constructor.cssText;
      danmu.$ref.style.visibility = "hidden";
      danmu.$ref.style.marginLeft = "0px";
      danmu.$ref.style.transform = "translateX(0px)";
      danmu.$ref.style.transition = "transform 0s linear 0s";
      this.owner.$refs.push(danmu.$ref);
      danmu.$ref = null;
    }
  }
  resize() {
    const { clientWidth } = this.owner.$player;
    this.owner.filter("stop", (danmu) => {
      switch (danmu.mode) {
        // 滚动的弹幕
        case 0:
          danmu.$ref.style.left = `${clientWidth}px`;
          break;
      }
    });
    this.owner.filter("emit", (danmu) => {
      danmu.$lastStartTime = Date.now();
      switch (danmu.mode) {
        // 滚动的弹幕
        case 0: {
          const distance = clientWidth + danmu.$ref.clientWidth;
          danmu.$ref.style.left = `${clientWidth}px`;
          danmu.$ref.style.transform = `translateX(${-distance}px)`;
          danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
          break;
        }
      }
    });
  }
  continue() {
    const { clientWidth } = this.owner.$player;
    this.owner.filter("stop", (danmu) => {
      this.owner.setState(danmu, "emit");
      danmu.$lastStartTime = Date.now();
      switch (danmu.mode) {
        // 继续滚动的弹幕
        case 0: {
          const distance = clientWidth + danmu.$ref.clientWidth;
          danmu.$ref.style.transform = `translateX(${-distance}px)`;
          danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
          break;
        }
      }
    });
    return this;
  }
  suspend() {
    const { clientWidth } = this.owner.$player;
    this.owner.filter("emit", (danmu) => {
      this.owner.setState(danmu, "stop");
      switch (danmu.mode) {
        // 停止滚动的弹幕
        case 0: {
          const translateX = clientWidth - (this.owner.getLeft(danmu.$ref) - this.owner.getLeft(this.owner.$player));
          danmu.$ref.style.transform = `translateX(${-translateX}px)`;
          danmu.$ref.style.transition = "transform 0s linear 0s";
          break;
        }
      }
    });
    return this;
  }
  prepare(danmu, operation) {
    const owner = this.owner;
    const ref = owner.$ref;
    operation.danmu = danmu;
    operation.ref = ref;
    danmu.$ref = ref;
    ref.textContent = danmu.text;
    owner.$danmuku.appendChild(ref);
    ref.style.opacity = owner.option.opacity;
    ref.style.fontSize = `${owner.fontSize}px`;
    ref.style.color = danmu.color;
    ref.style.border = danmu.border ? `1px solid ${danmu.color}` : null;
    ref.style.backgroundColor = danmu.border ? "rgb(0 0 0 / 50%)" : null;
    owner.utils.setStyles(ref, danmu.style);
    return ref;
  }
  place(danmu, ref, top, distance, clientWidth) {
    ref.style.top = `${top}px`;
    ref.style.visibility = "visible";
    ref.dataset.mode = danmu.mode;
    ref.dataset.id = danmu.id || "";
    switch (danmu.mode) {
      case 0:
        ref.style.left = `${clientWidth}px`;
        ref.style.marginLeft = "0px";
        ref.style.transform = `translateX(${-distance}px)`;
        ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
        break;
      case 1:
      case 2:
        ref.style.left = "50%";
        ref.style.marginLeft = `-${ref.clientWidth / 2}px`;
        break;
    }
  }
  release(operation) {
    const { danmu, ref } = operation;
    if (ref && danmu.$ref === ref) {
      ref.style.cssText = this.owner.constructor.cssText;
      ref.style.visibility = "hidden";
      this.owner.$refs.push(ref);
      danmu.$ref = null;
    }
    operation.ref = null;
  }
  clear() {
    this.destroy();
    this.owner.$refs = [];
    this.owner.$danmuku.textContent = "";
  }
  destroy() {
    for (const node of this.nodes) {
      if (node.parentElement)
        node.parentElement.removeChild(node);
    }
    for (const danmu of this.owner.queue) danmu.$ref = null;
    this.owner.$refs.length = 0;
    this.nodes.clear();
  }
}
const cancelled = /* @__PURE__ */ Symbol("cancelled danmuku frame");
class Scheduler {
  constructor(owner) {
    this.owner = owner;
    this.generation = 0;
    this.starts = 0;
    this.frame = null;
    this.operation = null;
    this.closed = false;
    this.running = false;
    this.fault = false;
    this.failedItems = /* @__PURE__ */ new Set();
  }
  active(operation) {
    const owner = this.owner;
    return !this.closed && !this.fault && !owner.art.isDestroy && !owner.isStop && !owner.isHide && operation.generation === this.generation;
  }
  release(operation) {
    this.owner.renderer.release(operation);
  }
  invalidate() {
    this.generation++;
    if (this.frame !== null)
      window.cancelAnimationFrame(this.frame);
    this.frame = null;
    this.owner.timer = null;
    if (this.operation) {
      const operation = this.operation;
      this.operation = null;
      operation.cancel();
      this.release(operation);
    }
    this.owner.workerClient?.cancel();
    this.failedItems.clear();
  }
  report(error) {
    try {
      this.owner.art.emit("artplayerPluginDanmuku:error", error);
    } catch (listenerError) {
      console.warn("Failed to report danmuku scheduling error:", listenerError);
    }
  }
  fail(error) {
    if (this.closed || this.fault)
      return;
    this.fault = true;
    this.invalidate();
    this.report(error);
  }
  recover() {
    if (this.closed || this.owner.art.isDestroy)
      return;
    this.failedItems.clear();
    if (this.fault) {
      try {
        this.owner.workerClient?.dispose();
        this.owner.createWorker();
        this.fault = false;
      } catch (error) {
        this.report(error);
      }
    }
  }
  schedule() {
    const owner = this.owner;
    if (!this.running || this.closed || this.fault || owner.art.isDestroy || owner.isStop || this.frame !== null || this.operation)
      return;
    this.frame = window.requestAnimationFrame(() => {
      this.frame = null;
      owner.timer = null;
      if (this.closed || this.fault || owner.isStop || owner.art.isDestroy)
        return;
      let cancel;
      const cancellation = new Promise((resolve) => cancel = () => resolve(cancelled));
      const operation = { generation: this.generation, cancel, wait: (value) => Promise.race([value, cancellation]), ref: null };
      this.operation = operation;
      return this.run(operation).catch((error) => {
        if (this.active(operation))
          this.fail(error);
      }).finally(() => {
        this.release(operation);
        if (this.operation === operation) {
          this.operation = null;
          this.schedule();
        }
      });
    });
    owner.timer = this.frame;
  }
  async run(operation) {
    const owner = this.owner;
    if (!owner.art.playing || !this.active(operation))
      return;
    owner.filter("emit", (danmu) => {
      const emitTime = (Date.now() - danmu.$lastStartTime) / 1e3;
      danmu.$restTime -= emitTime;
      danmu.$lastStartTime = Date.now();
      if (danmu.$restTime <= 0)
        owner.makeWait(danmu);
    });
    const readys = owner.readys;
    for (const danmu of readys) {
      if (!this.active(operation))
        return;
      if (this.failedItems.has(danmu))
        continue;
      let state;
      try {
        state = await operation.wait(owner.option.beforeVisible(danmu));
      } catch (error) {
        if (!this.active(operation))
          return;
        this.failedItems.add(danmu);
        this.report(error);
        continue;
      }
      if (!this.active(operation))
        return;
      if (!state)
        continue;
      const { clientWidth, clientHeight } = owner.$player;
      const ref = owner.renderer.prepare(danmu, operation);
      if (!this.active(operation))
        return;
      danmu.$lastStartTime = Date.now();
      danmu.$restTime = owner.speed;
      const distance = clientWidth + ref.clientWidth;
      const reply = await operation.wait(owner.postMessage({
        type: "getDanmuTop",
        target: { mode: danmu.mode, height: ref.clientHeight, speed: distance / danmu.$restTime },
        visibles: owner.visibles,
        antiOverlap: owner.option.antiOverlap,
        clientWidth,
        clientHeight,
        // Valid margins are numeric. Preserve the old raw fallback for unsupported strings.
        marginBottom: owner.marginBottom,
        marginTop: owner.marginTop
      }));
      const top = typeof reply === "symbol" ? void 0 : reply.result;
      if (!this.active(operation) || danmu.$ref !== ref)
        return;
      if (top !== void 0) {
        owner.setState(danmu, "emit");
        owner.renderer.place(danmu, ref, top, distance, clientWidth);
        operation.ref = null;
        owner.art.emit("artplayerPluginDanmuku:visible", danmu);
      } else {
        owner.setState(danmu, "ready");
        this.release(operation);
      }
    }
  }
  destroy() {
    this.closed = true;
    this.invalidate();
  }
}
let nextRequest = 0;
class WorkerClient {
  constructor(createWorker, onFailure) {
    this.pending = /* @__PURE__ */ new Map();
    this.closed = false;
    this.failed = false;
    this.onFailure = onFailure;
    this.worker = createWorker();
    try {
      this.worker.onmessage = (event) => {
        const request = this.pending.get(event.data?.id);
        if (!request)
          return;
        this.pending.delete(event.data.id);
        request.resolve(event.data);
      };
      this.worker.onerror = (event) => {
        event.preventDefault?.();
        this.fail(event.error || event);
      };
      this.worker.onmessageerror = (event) => this.fail(event.error || event);
    } catch (error) {
      try {
        this.dispose();
      } catch {
      }
      throw error;
    }
  }
  request(message) {
    message.id = ++nextRequest;
    const { id } = message;
    if (this.closed || this.failed)
      return Promise.resolve({ id, result: void 0 });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      try {
        this.worker.postMessage(message);
      } catch (error) {
        this.fail(error);
      }
    });
  }
  fail(error) {
    if (this.closed || this.failed)
      return;
    this.failed = true;
    for (const request of this.pending.values()) request.reject(error);
    this.pending.clear();
    try {
      this.dispose();
    } catch {
    }
    this.onFailure(error);
  }
  cancel() {
    for (const [id, request] of this.pending) request.resolve({ id, result: void 0 });
    this.pending.clear();
  }
  dispose() {
    if (this.closed)
      return;
    this.closed = true;
    this.cancel();
    let failed = false;
    let error;
    const attempt = (callback) => {
      try {
        callback();
      } catch (failure) {
        if (!failed)
          error = failure;
        failed = true;
      }
    };
    for (const name of ["onmessage", "onerror", "onmessageerror"]) {
      attempt(() => this.worker[name] = null);
    }
    attempt(() => this.worker.terminate());
    if (failed)
      throw error;
  }
}
const jsContent = '/*!\n * artplayer-plugin-danmuku.js v5.3.0\n * Github: https://github.com/zhw2590582/ArtPlayer\n * (c) 2017-2026 Harvey Zhao\n * Released under the MIT License.\n */\nfunction getDanmuTop({ target, visibles, clientWidth, clientHeight, marginBottom, marginTop, antiOverlap }) {\n  const maxTop = clientHeight - marginBottom;\n  const danmus = visibles.filter((item) => item.mode === target.mode && item.top <= maxTop).sort((prev, next) => prev.top - next.top);\n  if (danmus.length === 0) {\n    if (target.mode === 2) {\n      return maxTop - target.height;\n    } else {\n      return marginTop;\n    }\n  }\n  danmus.unshift({\n    type: "top",\n    top: 0,\n    left: 0,\n    right: 0,\n    height: marginTop,\n    width: clientWidth,\n    speed: 0,\n    distance: clientWidth\n  });\n  danmus.push({\n    type: "bottom",\n    top: maxTop,\n    left: 0,\n    right: 0,\n    height: marginBottom,\n    width: clientWidth,\n    speed: 0,\n    distance: clientWidth\n  });\n  if (target.mode === 2) {\n    for (let index = danmus.length - 2; index >= 0; index -= 1) {\n      const item = danmus[index];\n      const prev = danmus[index + 1];\n      const itemBottom = item.top + item.height;\n      const diff = prev.top - itemBottom;\n      if (diff >= target.height) {\n        return prev.top - target.height;\n      }\n    }\n  } else {\n    for (let index = 1; index < danmus.length; index += 1) {\n      const item = danmus[index];\n      const prev = danmus[index - 1];\n      const prevBottom = prev.top + prev.height;\n      const diff = item.top - prevBottom;\n      if (diff >= target.height) {\n        return prevBottom;\n      }\n    }\n  }\n  const topMap = [];\n  for (let index = 1; index < danmus.length - 1; index += 1) {\n    const item = danmus[index];\n    if (topMap.length) {\n      const last = topMap[topMap.length - 1];\n      if (last[0].top === item.top) {\n        last.push(item);\n      } else {\n        topMap.push([item]);\n      }\n    } else {\n      topMap.push([item]);\n    }\n  }\n  if (antiOverlap) {\n    switch (target.mode) {\n      case 0: {\n        const result = topMap.find((list) => {\n          return list.every((danmu) => {\n            if (clientWidth < danmu.distance)\n              return false;\n            if (target.speed < danmu.speed)\n              return true;\n            const overlapTime = danmu.right / (target.speed - danmu.speed);\n            if (overlapTime > danmu.time)\n              return true;\n            return false;\n          });\n        });\n        return result && result[0] ? result[0].top : void 0;\n      }\n      // 静止弹幕没有重叠问题\n      case 1:\n      case 2:\n        return void 0;\n    }\n  } else {\n    switch (target.mode) {\n      case 0:\n        topMap.sort((prev, next) => {\n          const nextMinRight = Math.min(...next.map((item) => item.right));\n          const prevMinRight = Math.min(...prev.map((item) => item.right));\n          return nextMinRight * next.length - prevMinRight * prev.length;\n        });\n        break;\n      case 1:\n      case 2:\n        topMap.sort((prev, next) => {\n          const nextMaxWidth = Math.max(...next.map((item) => item.width));\n          const prevMaxWidth = Math.max(...prev.map((item) => item.width));\n          return prevMaxWidth * prev.length - nextMaxWidth * next.length;\n        });\n        break;\n    }\n    return topMap[0][0].top;\n  }\n}\nonmessage = (event) => {\n  const { data } = event;\n  if (!data.id || !data.type)\n    return;\n  const fns = { getDanmuTop };\n  const fn = fns[data.type];\n  const result = fn(data);\n  globalThis.postMessage({\n    result,\n    id: data.id\n  });\n};\n';
const blob = typeof self !== "undefined" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", jsContent], { type: "text/javascript;charset=utf-8" });
function WorkerWrapper(options) {
  let objURL;
  try {
    objURL = blob && (self.URL || self.webkitURL).createObjectURL(blob);
    if (!objURL) throw "";
    const worker = new Worker(objURL, {
      type: "module",
      name: options?.name
    });
    worker.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(objURL);
    });
    return worker;
  } catch (e) {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(jsContent),
      {
        type: "module",
        name: options?.name
      }
    );
  }
}
class Danmuku {
  constructor(art, option) {
    const { constructor, template } = art;
    this.utils = constructor.utils;
    this.validator = constructor.validator;
    this.$danmuku = template.$danmuku;
    this.$player = template.$player;
    this.art = art;
    this.queue = [];
    this.$refs = [];
    this.isStop = false;
    this.isHide = false;
    this.timer = null;
    this.index = 0;
    this.worker = null;
    this.workerClient = null;
    this.renderer = new Renderer(this);
    this.scheduler = new Scheduler(this);
    this.option = Danmuku.option;
    this.states = { wait: [], ready: [], emit: [], stop: [] };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.resize = this.resize.bind(this);
    this.destroy = this.destroy.bind(this);
    this.seek = this.seek.bind(this);
    inputActive(this);
    art.on("destroy", this.destroy);
    try {
      this.config(option, true);
      if (!inputActive(this))
        return;
      this.createWorker();
    } catch (error) {
      art.off("destroy", this.destroy);
      cancelInputs(this);
      this.scheduler.destroy();
      throw error;
    }
    art.on("video:play", this.start);
    art.on("video:playing", this.start);
    art.on("video:pause", this.stop);
    art.on("video:waiting", this.stop);
    art.on("resize", this.resize);
    art.on("video:seeking", this.seek);
    this.load().catch((error) => console.warn("Failed to load initial danmuku:", error));
  }
  // 默认配置
  static get option() {
    return defaultOption();
  }
  // 配置校验
  static get scheme() {
    return optionScheme();
  }
  // 初始弹幕样式
  static get cssText() {
    return `
            user-select: none;
            position: absolute;
            white-space: pre;
            pointer-events: none;
            perspective: 500px;
            display: inline-block;
            will-change: transform;
            font-weight: normal;
            line-height: 1.125;
            visibility: hidden;
            font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif;
            text-shadow: rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px;
        `;
  }
  // 是否在移动端使用了自动旋屏，会影响弹幕的left和top值
  get isRotate() {
    return this.art.plugins?.autoOrientation?.state;
  }
  // 计算上空白边距
  get marginTop() {
    const { clamp } = this.utils;
    const value = this.option.margin[0];
    const { clientHeight } = this.$player;
    if (typeof value === "number") {
      return clamp(value, 0, clientHeight);
    }
    if (typeof value === "string" && value.endsWith("%")) {
      const ratio = Number.parseFloat(value) / 100;
      return clamp(clientHeight * ratio, 0, clientHeight);
    }
    return Danmuku.option.margin[0];
  }
  // 计算下空白边距
  get marginBottom() {
    const { clamp } = this.utils;
    const value = this.option.margin[1];
    const { clientHeight } = this.$player;
    if (typeof value === "number") {
      return clamp(value, 0, clientHeight);
    }
    if (typeof value === "string" && value.endsWith("%")) {
      const ratio = Number.parseFloat(value) / 100;
      return clamp(clientHeight * ratio, 0, clientHeight);
    }
    return Danmuku.option.margin[1];
  }
  // 计算弹幕字体大小
  get fontSize() {
    const { clamp } = this.utils;
    const { clientHeight } = this.$player;
    const fontSize = this.option.fontSize;
    if (typeof fontSize === "number") {
      return Math.round(clamp(fontSize, 12, clientHeight));
    }
    if (typeof fontSize === "string" && fontSize.endsWith("%")) {
      const ratio = Number.parseFloat(fontSize) / 100;
      return Math.round(clamp(clientHeight * ratio, 12, clientHeight));
    }
    return Danmuku.option.fontSize;
  }
  // 获取弹幕DOM节点
  get $ref() {
    return this.renderer.acquire();
  }
  // 获取准备好发送的弹幕
  get readys() {
    return readyItems(this);
  }
  // 可见的弹幕的数据，用于计算下一个弹幕的top值
  get visibles() {
    return this.renderer.visibles;
  }
  // 计算弹幕速度
  get speed() {
    return this.option.synchronousPlayback && this.art.playbackRate ? this.option.speed / Number(this.art.playbackRate) : this.option.speed;
  }
  // 加载弹幕
  async load(danmuku) {
    const { errorHandle } = this.utils;
    const task = beginInput(this, danmuku === void 0);
    try {
      if (!task.active())
        return this;
      const target = danmuku || this.option.danmuku;
      const input = readInput(target, task);
      const danmus = input.asynchronous ? await task.wait(input.value) : input.value;
      if (!task.active())
        return this;
      errorHandle(Array.isArray(danmus), "Danmuku need return an array as result");
      const rows = danmus;
      if (danmuku === void 0) {
        this.reset();
        if (!task.active())
          return this;
        this.queue = [];
        this.states = { wait: [], ready: [], emit: [], stop: [] };
        this.renderer.clear();
      }
      for (let index = 0; index < rows.length; index++) {
        if (!task.active())
          return this;
        const danmu = rows[index];
        await task.emit(danmu);
      }
      if (task.active())
        this.art.emit("artplayerPluginDanmuku:loaded", this.queue);
    } catch (error) {
      if (!task.active())
        return this;
      this.art.emit("artplayerPluginDanmuku:error", error);
      throw error;
    } finally {
      task.finish();
    }
    return this;
  }
  // 把原始弹幕转换到弹幕队列
  async emit(danmu) {
    const { clamp } = this.utils;
    if (!inputActive(this))
      return this;
    this.validator(danmu, {
      id: "?string",
      // 弹幕唯一标识
      text: "string",
      // 弹幕文本
      mode: "?number",
      // 弹幕模式: 0: 滚动，1: 顶部，2: 底部
      color: "?string",
      // 弹幕颜色
      time: "?number",
      // 弹幕时间
      border: "?boolean",
      // 弹幕是否有边框
      style: "?object"
      // 弹幕额外样式
    });
    if (!danmu.text.trim())
      return this;
    if (danmu.time || danmu.time === 0) {
      danmu.time = clamp(danmu.time, 0, Infinity);
    } else {
      danmu.time = this.art.currentTime + 0.5;
    }
    if (danmu.mode === void 0) {
      danmu.mode = this.option.mode;
    }
    if (danmu.style === void 0) {
      danmu.style = {};
    }
    if (danmu.color === void 0) {
      danmu.color = this.option.color;
    }
    if (![0, 1, 2].includes(danmu.mode))
      return this;
    if (!this.option.filter(danmu))
      return this;
    if (!inputActive(this))
      return this;
    const item = {
      ...danmu,
      $state: "wait",
      // 弹幕初始状态
      $index: this.index++,
      // 弹幕索引
      $ref: null,
      // 弹幕 DOM 节点
      $restTime: 0,
      // 弹幕剩余时间
      $lastStartTime: 0
      // 弹幕上次开始时间
    };
    this.setState(item, "wait");
    this.queue.push(item);
    return this;
  }
  // 动态配置
  config(option, isInit = false) {
    const { clamp } = this.utils;
    const { $controlsCenter } = this.art.template;
    const changed = optionChanged(this.option, option);
    if (!changed && !isInit)
      return this;
    const next = normalizeOption(this.option, option, {
      defaults: Danmuku.option,
      validate: (value) => this.validator(value, Danmuku.scheme),
      clamp,
      mount: $controlsCenter
    });
    if (!inputActive(this))
      return this;
    const beforeVisibleChanged = this.option.beforeVisible !== next.beforeVisible;
    this.option = next;
    if (beforeVisibleChanged) {
      this.scheduler.invalidate();
      this.scheduler.schedule();
    }
    if (option.fontSize) {
      this.reset();
      if (!inputActive(this))
        return this;
    }
    if (this.option.visible) {
      this.show();
    } else {
      this.hide();
    }
    if (inputActive(this))
      this.art.emit("artplayerPluginDanmuku:config", this.option);
    return this;
  }
  // 计算DOM的left值，受到旋屏影响
  getLeft($ref) {
    return this.renderer.left($ref);
  }
  // 复杂运算交给 Web Worker 处理
  // Keep the historical empty default; unknown message types receive no reply.
  postMessage(message = {}) {
    return this.workerClient.request(message);
  }
  createWorker() {
    this.workerClient = new WorkerClient(() => new WorkerWrapper(), (error) => this.scheduler.fail(error));
    this.worker = this.workerClient.worker;
  }
  // 根据状态获取弹幕
  filter(state, callback) {
    return filterState(this, state, callback);
  }
  // 设置弹幕状态
  setState(danmu, state) {
    setItemState(this, danmu, state);
  }
  // 重置弹幕到wait状态，回收弹幕DOM节点
  makeWait(danmu) {
    this.renderer.makeWait(danmu);
  }
  // 实时更新弹幕
  update() {
    this.scheduler.running = true;
    this.scheduler.schedule();
    return this;
  }
  // 重置正在显示的弹幕: stop/emit 状态的弹幕
  resize() {
    this.renderer.resize();
  }
  // 继续弹幕
  continue() {
    this.renderer.continue();
    return this;
  }
  // 暂停弹幕
  suspend() {
    this.renderer.suspend();
    return this;
  }
  stop() {
    this.isStop = true;
    this.scheduler.running = false;
    this.scheduler.invalidate();
    this.suspend();
    this.art.emit("artplayerPluginDanmuku:stop");
    return this;
  }
  start() {
    if (this.scheduler.closed || this.art.isDestroy)
      return this;
    const start = ++this.scheduler.starts;
    const generation = this.scheduler.generation;
    this.isStop = false;
    this.scheduler.recover();
    const obsolete = this.scheduler.closed || this.art.isDestroy || this.isStop || this.scheduler.fault || generation !== this.scheduler.generation || start !== this.scheduler.starts;
    if (obsolete)
      return this;
    this.continue();
    this.update();
    this.art.emit("artplayerPluginDanmuku:start");
    return this;
  }
  reset() {
    this.scheduler.invalidate();
    this.queue.forEach((danmu) => this.makeWait(danmu));
    this.art.emit("artplayerPluginDanmuku:reset");
    this.scheduler.recover();
    this.scheduler.schedule();
    return this;
  }
  seek() {
    this.scheduler.invalidate();
    this.scheduler.schedule();
  }
  show() {
    this.isHide = false;
    this.$danmuku.style.opacity = 1;
    this.option.visible = true;
    this.art.emit("artplayerPluginDanmuku:show");
    return this;
  }
  hide() {
    this.isHide = true;
    this.scheduler.invalidate();
    this.$danmuku.style.opacity = 0;
    this.option.visible = false;
    this.art.emit("artplayerPluginDanmuku:hide");
    this.scheduler.schedule();
    return this;
  }
  destroy() {
    cancelInputs(this);
    this.scheduler.destroy();
    try {
      try {
        this.stop();
      } finally {
        this.workerClient?.dispose();
      }
    } finally {
      this.renderer.destroy();
      this.art.off("video:play", this.start);
      this.art.off("video:playing", this.start);
      this.art.off("video:pause", this.stop);
      this.art.off("video:waiting", this.stop);
      this.art.off("resize", this.resize);
      this.art.off("video:seeking", this.seek);
      this.art.off("destroy", this.destroy);
      this.art.emit("artplayerPluginDanmuku:destroy");
    }
  }
}
const MAX_HEATMAP_POINTS = 4294967295;
function upperBound(values, value) {
  let start = 0;
  let end = values.length;
  while (start < end) {
    const middle = Math.floor((start + end) / 2);
    if (values[middle] <= value)
      start = middle + 1;
    else end = middle;
  }
  return start;
}
function sampleHeatmap(queue, width, duration, sampling) {
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(duration) || duration <= 0 || !Number.isFinite(sampling) || sampling <= 0 || Math.floor(width / sampling) + 1 > MAX_HEATMAP_POINTS) {
    return [];
  }
  const times = queue.map((item) => item.time).filter((time) => typeof time === "number" && !Number.isNaN(time)).sort((a, b) => a - b);
  const points = [];
  const gap = duration / width;
  if (!Number.isFinite(gap))
    return [];
  for (let x = 0; x <= width; x += sampling) {
    if (points.length >= MAX_HEATMAP_POINTS || x + sampling === x)
      return [];
    const left = x * gap;
    const right = (x + sampling) * gap;
    points.push([x, upperBound(times, right) - upperBound(times, left)]);
  }
  return points;
}
function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
function line(pointA, pointB) {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return { length: Math.sqrt(lengthX ** 2 + lengthY ** 2), angle: Math.atan2(lengthY, lengthX) };
}
function heatmapGeometry({ width, height, duration, queue, option, points: input = [] }) {
  if (![width, height, duration].every((value) => Number.isFinite(value) && value > 0))
    return null;
  const defaults = {
    xMin: 0,
    xMax: width,
    yMin: 0,
    yMax: 128,
    scale: 0.25,
    opacity: 0.2,
    minHeight: Math.floor(height * 0.05),
    sampling: Math.max(1, Math.floor(width / 100)),
    smoothing: 0.2,
    flattening: 0.2
  };
  const configured = Object.assign({}, typeof option === "object" ? option : {});
  const options = Object.assign({}, defaults, configured);
  for (const key of Object.keys(defaults)) {
    if (!Number.isFinite(options[key]))
      options[key] = defaults[key];
  }
  if (options.sampling <= 0)
    options.sampling = defaults.sampling;
  if (options.xMin === options.xMax || options.yMin === options.yMax)
    return null;
  const hasCustomPoints = Array.isArray(input) && input.length > 0;
  const points = hasCustomPoints ? [...input] : sampleHeatmap(queue, width, duration, options.sampling);
  if (!points.length || !points.every((point) => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1]))) {
    return null;
  }
  const lastPoint = points[points.length - 1];
  if (lastPoint[0] !== width) {
    if (points.length === MAX_HEATMAP_POINTS)
      return null;
    points.push([width, lastPoint[1]]);
  }
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const point of points) {
    yMin = Math.min(yMin, point[1]);
    yMax = Math.max(yMax, point[1]);
  }
  const yMid = (yMin + yMax) / 2;
  for (const point of points) {
    const y = point[1];
    point[1] = y * (y > yMid ? 1 + options.scale : 1 - options.scale) + options.minHeight;
  }
  const automatic = !hasCustomPoints && !Number.isFinite(configured.yMin) && !Number.isFinite(configured.yMax);
  let peak = 0;
  for (const point of points) peak = Math.max(peak, point[1]);
  const fitted = automatic && peak > defaults.yMax / 4;
  if (fitted)
    options.yMax = peak * 4;
  const boundY = (value) => fitted ? Math.min(height, Math.max(height * 0.75, value)) : value;
  const controlPoint = (current, previous, next, reverse) => {
    const geometry = line(previous || current, next || current);
    const flat = map(Math.cos(geometry.angle) * options.flattening, 0, 1, 1, 0);
    const angle = geometry.angle * flat + (reverse ? Math.PI : 0);
    const length = geometry.length * options.smoothing;
    return [current[0] + Math.cos(angle) * length, boundY(current[1] + Math.sin(angle) * length)];
  };
  const positions = points.map((point) => [map(point[0], options.xMin, options.xMax, 0, width), boundY(map(point[1], options.yMin, options.yMax, height, 0))]);
  if (!positions.every((point) => point.every(Number.isFinite)))
    return null;
  const path = positions.map((point, index, all) => {
    if (index === 0)
      return `M ${all[all.length - 1][0]},${height} L ${point[0]},${height} L ${point[0]},${point[1]}`;
    const start = controlPoint(all[index - 1], all[index - 2], point);
    const end = controlPoint(point, all[index - 1], all[index + 1], true);
    return `C ${start[0]},${start[1]} ${end[0]},${end[1]} ${point[0]},${point[1]}${index === all.length - 1 ? " z" : ""}`;
  }).join(" ");
  if (/NaN|Infinity/u.test(path))
    return null;
  return { path, opacity: options.opacity, width, height };
}
let nextGradient = 0;
function heatmap(art, danmuku, option) {
  if (art.isDestroy)
    return;
  const { query } = art.constructor.utils;
  let gradient;
  const subscriptions = [];
  let element;
  let start;
  let stop;
  let closed = false;
  const active = () => !closed && !art.isDestroy;
  function listen(name, callback) {
    const listener = callback;
    subscriptions.push([name, listener]);
    art.on(name, listener);
  }
  function dispose(removeControl) {
    if (closed)
      return;
    closed = true;
    start = null;
    stop = null;
    let failure;
    let failed = false;
    const attempt = (callback) => {
      try {
        callback();
      } catch (error) {
        if (!failed)
          failure = error;
        failed = true;
      }
    };
    for (const [name, callback] of subscriptions.splice(0))
      attempt(() => art.off(name, callback));
    if (removeControl && element && art.controls.heatmap === element)
      attempt(() => art.controls.remove("heatmap"));
    element = void 0;
    if (failed)
      throw failure;
  }
  function progress(value) {
    if (active() && start && stop) {
      start.setAttribute("offset", `${value * 100}%`);
      stop.setAttribute("offset", `${value * 100}%`);
    }
  }
  function draw(points = []) {
    if (!active())
      return;
    start = null;
    stop = null;
    const target = element;
    target.innerHTML = "";
    if (art.option.isLive)
      return;
    const shape = heatmapGeometry({ width: target.offsetWidth, height: target.offsetHeight, duration: art.duration, queue: danmuku.queue, option, points });
    if (!shape || !active())
      return;
    const document2 = target.ownerDocument;
    if (!gradient)
      gradient = document2 ? "heatmap-solids" : `heatmap-solids-${++nextGradient}`;
    while (document2?.getElementById(gradient))
      gradient = `heatmap-solids-${++nextGradient}`;
    target.innerHTML = `
      <svg viewBox="0 0 ${shape.width} ${shape.height}">
        <defs>
          <linearGradient id="${gradient}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${shape.opacity}" />
            <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${shape.opacity}" id="heatmap-start" />
            <stop offset="0%" style="stop-color:var(--art-progress-color);stop-opacity:1" id="heatmap-stop" />
            <stop offset="100%" style="stop-color:var(--art-progress-color);stop-opacity:1" />
          </linearGradient>
        </defs>
        <path fill="url(#${gradient})" d="${shape.path}"></path>
      </svg>
    `;
    start = query("#heatmap-start", target);
    stop = query("#heatmap-stop", target);
    progress(art.played);
  }
  function update(points) {
    try {
      draw(points);
    } catch (error) {
      try {
        dispose(true);
      } catch {
      }
      throw error;
    }
  }
  listen("destroy", () => dispose(true));
  try {
    art.controls.add({
      name: "heatmap",
      position: "top",
      html: "",
      style: {
        position: "absolute",
        top: "-100px",
        left: "0px",
        right: "0px",
        height: "100px",
        width: "100%",
        pointerEvents: "none"
      },
      beforeUnmount() {
        dispose(false);
      },
      mounted(value) {
        element = value;
        if (closed) {
          if (art.controls.heatmap === value)
            art.controls.remove("heatmap");
          element = void 0;
          return;
        }
        if (!active()) {
          dispose(true);
          return;
        }
        listen("video:timeupdate", () => progress(art.played));
        listen("setBar", (type, percentage) => {
          if (type === "played")
            progress(percentage);
        });
        listen("ready", () => update());
        listen("resize", () => update());
        listen("artplayerPluginDanmuku:loaded", () => update());
        listen("artplayerPluginDanmuku:points", (points) => update(points));
      }
    });
  } catch (error) {
    try {
      dispose(true);
    } catch {
    }
    throw error;
  }
  return () => dispose(true);
}
const properties = /* @__PURE__ */ new WeakMap();
class SettingLifecycle {
  constructor(art) {
    this.art = art;
    this.closed = false;
    this.disposers = /* @__PURE__ */ new Set();
    this.cancelled = new Promise((resolve) => this.cancel = resolve);
  }
  get active() {
    return !this.closed && !this.art.isDestroy;
  }
  own(dispose) {
    if (this.closed)
      dispose();
    else this.disposers.add(dispose);
  }
  write(host, key, value, apply = (value2) => host[key] = value2) {
    const target = host;
    if (!this.active)
      return;
    const priority = () => typeof target.getPropertyPriority === "function" ? target.getPropertyPriority(key) : void 0;
    let keys = properties.get(target);
    if (!keys) {
      keys = /* @__PURE__ */ new Map();
      properties.set(target, keys);
    }
    let entry = keys.get(key);
    if (!entry) {
      entry = {
        original: target[key],
        present: key in target || target[key] !== void 0,
        priority: priority(),
        owners: /* @__PURE__ */ new Map(),
        apply
      };
      keys.set(key, entry);
    }
    if (!entry.owners.has(this)) {
      this.own(() => {
        const owners = [...entry.owners.keys()];
        const current = owners[owners.length - 1] === this;
        entry.owners.delete(this);
        if (current && target[key] === entry.last && priority() === entry.lastPriority) {
          const values = [...entry.owners.values()];
          if (values.length) {
            entry.apply(values[values.length - 1]);
            entry.last = target[key];
            entry.lastPriority = priority();
          } else if (entry.priority !== void 0) {
            target.setProperty(key, entry.original, entry.priority);
          } else if (entry.present) {
            entry.apply(entry.original);
          } else {
            delete target[key];
          }
        }
        if (!entry.owners.size) {
          keys.delete(key);
          if (!keys.size)
            properties.delete(target);
        }
      });
    }
    entry.owners.delete(this);
    entry.owners.set(this, value);
    entry.apply(value);
    entry.last = target[key];
    entry.lastPriority = priority();
  }
  on(name, callback) {
    if (!this.active)
      return;
    const lifecycle = this;
    function listener(...args) {
      if (lifecycle.active)
        return callback.apply(this, args);
    }
    const dispose = () => this.art.off(name, listener);
    this.own(dispose);
    try {
      this.art.on(name, listener);
      if (!this.active)
        dispose();
    } catch (error) {
      this.release(dispose);
      throw error;
    }
  }
  proxy(target, name, callback) {
    if (!this.active)
      return;
    const lifecycle = this;
    function listener(...args) {
      if (lifecycle.active)
        return callback.apply(this, args);
    }
    let remove;
    const dispose = () => {
      if (typeof remove === "function") {
        const registry = this.art.events;
        if (typeof registry?.remove === "function" && registry.destroyEvents?.has(remove))
          registry.remove(remove);
        else remove();
      } else {
        target.removeEventListener?.(name, listener);
      }
    };
    this.own(dispose);
    try {
      remove = this.art.proxy(target, name, listener);
      if (!this.active)
        dispose();
    } catch (error) {
      this.release(dispose);
      throw error;
    }
  }
  wait(value) {
    return Promise.race([value, this.cancelled]);
  }
  release(dispose) {
    try {
      dispose();
    } catch (error) {
      console.warn("Failed to dispose danmuku setting resource:", error);
    }
  }
  close() {
    if (this.closed)
      return;
    this.closed = true;
    this.cancel();
    for (const dispose of this.disposers) {
      this.release(dispose);
    }
    this.disposers.clear();
  }
}
async function emitSetting(setting) {
  const { lifecycle, template: { $input } } = setting;
  if (!lifecycle.active)
    return;
  const text = $input.value.trim();
  if (!text.length || setting.isLock || setting.emitting)
    return;
  const danmu = {
    text,
    mode: setting.option.mode,
    color: setting.option.color,
    time: setting.art.currentTime
  };
  const report = (error) => {
    if (lifecycle.active)
      console.error("Error emitting danmuku:", error);
  };
  try {
    setting.emitting = true;
    const state = await lifecycle.wait(setting.option.beforeEmit(danmu));
    if (!lifecycle.active)
      return;
    setting.emitting = false;
    if (state !== true)
      return;
    danmu.border = true;
    delete danmu.time;
    Promise.resolve(setting.danmuku.emit(danmu)).catch(report);
    if (!lifecycle.active)
      return;
    $input.value = "";
    setting.lock();
  } catch (error) {
    report(error);
    if (lifecycle.active)
      setting.emitting = false;
  }
}
function lockSetting(setting) {
  if (!setting.lifecycle.active)
    return;
  const { addClass } = setting.utils;
  const { $send } = setting.template;
  clearTimeout(setting.timer);
  setting.isLock = true;
  let time = setting.option.lockTime;
  $send.textContent = time;
  addClass($send, "apd-lock");
  const loop = () => {
    setting.timer = setTimeout(() => {
      if (!setting.lifecycle.active)
        return;
      if (time === 0) {
        setting.unlock();
      } else {
        time -= 1;
        $send.textContent = time;
        loop();
      }
    }, 1e3);
  };
  loop();
}
function unlockSetting(setting) {
  clearTimeout(setting.timer);
  setting.timer = null;
  setting.isLock = false;
  if (!setting.lifecycle.active)
    return;
  const { removeClass } = setting.utils;
  const { $send } = setting.template;
  $send.textContent = "发送";
  removeClass($send, "apd-lock");
}
function createSlider({ min, max, container, findIndex, onChange, steps = [] }) {
  const { lifecycle } = this;
  if (!lifecycle.active)
    return { reset() {
    } };
  const { query, clamp, setStyle } = this.utils;
  setStyle(container, "touch-action", "none");
  container.innerHTML = `
            <div class="apd-slider-line">
                <div class="apd-slider-points">
                    ${steps.map(() => `<div class="apd-slider-point"></div>`).join("")}
                </div>
                <div class="apd-slider-progress"></div>
            </div>
            <div class="apd-slider-dot"></div>
            <div class="apd-slider-steps">
                ${steps.map((step) => step.hide ? "" : `<div class="apd-slider-step">${step.name}</div>`).join("")}
            </div>
        `;
  const $dot = query(".apd-slider-dot", container);
  const $progress = query(".apd-slider-progress", container);
  let isDroging = false;
  lifecycle.own(() => isDroging = false);
  function reset(index) {
    if (!lifecycle.active)
      return;
    if (index === void 0)
      index = findIndex();
    if (index < min || index > max)
      return;
    const percentage = (index - min) / (max - min);
    $dot.style.left = `${percentage * 100}%`;
    if (steps.length === 0) {
      $progress.style.width = $dot.style.left;
    }
    onChange(index);
  }
  function updateLeft(event) {
    const { top, height, left, width } = container.getBoundingClientRect();
    if (this.art.isRotate) {
      const value = clamp(event.clientY - top, 0, height);
      const index = Math.round(value / height * (max - min) + min);
      reset(index);
    } else {
      const value = clamp(event.clientX - left, 0, width);
      const index = Math.round(value / width * (max - min) + min);
      reset(index);
    }
  }
  lifecycle.proxy(container, "click", (event) => {
    updateLeft.call(this, event);
  });
  lifecycle.proxy(container, "pointerdown", (event) => {
    isDroging = event.button === 0;
  });
  lifecycle.on("document:pointermove", (event) => {
    if (isDroging) {
      updateLeft.call(this, event);
    }
  });
  lifecycle.on("document:pointerup", (event) => {
    if (isDroging) {
      isDroging = false;
      updateLeft.call(this, event);
    }
  });
  return { reset };
}
const $check_off = '<svg  class="apd-icon apd-check-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32" width="32"  height="32" ><path d="M8 6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z" fill="#FFFFFF"></path></svg>';
const $check_on = '<svg class="apd-icon apd-check-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32" width="32"  height="32" ><path d="m13 18.25-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z" fill="#00AEEC"></path></svg>';
const $config = '<svg class="apd-icon apd-config-icon" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24" width="24"  height="24" ><path fill-rule="evenodd" d="m15.645 4.881 1.06-1.473a.998.998 0 1 0-1.622-1.166L13.22 4.835a110.67 110.67 0 0 0-1.1-.007h-.131c-.47 0-.975.004-1.515.012L8.783 2.3A.998.998 0 0 0 7.12 3.408l.988 1.484c-.688.019-1.418.042-2.188.069a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363c1.903.094 3.317.141 5.513.141a.988.988 0 0 0 0-1.975 97.58 97.58 0 0 1-5.416-.139 2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.005.183.01.07.014-.038.004-.096.008-.189.011-.081a.987.987 0 1 0 1.974-.069c-.004-.105-.007-.009-.011.09-.002.056-.004.112-.007.135l-.002.01a.574.574 0 0 1-.005-.091v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.905-.032-1.752-.058-2.543-.079Zm-3.113 4.703h-1.307v4.643h2.2v.04l.651-1.234c.113-.215.281-.389.482-.509v-.11h.235c.137-.049.283-.074.433-.074h1.553V9.584h-1.264a8.5 8.5 0 0 0 .741-1.405l-1.078-.381c-.24.631-.501 1.23-.806 1.786h-1.503l.686-.305c-.228-.501-.5-.959-.806-1.394l-1.034.348c.294.392.566.839.817 1.35Zm-1.7 5.502h2.16l-.564 1.068h-1.595v-1.068Zm-2.498-1.863.152-1.561h1.96V8.289H7.277v.969h2.048v1.435h-1.84l-.306 3.51h2.254c0 1.155-.043 1.906-.12 2.255-.076.348-.38.523-.925.523-.305 0-.61-.022-.893-.055l.294 1.056.061.005c.282.02.546.039.81.039.991-.065 1.547-.414 1.677-1.046.11-.631.175-1.883.175-3.757H8.334Zm5.09-.8v.85h-1.188v-.85h1.187Zm-1.188-.955h1.187v-.893h-1.187v.893Zm2.322.007v-.893h1.241v.893h-1.241Zm.528 2.757a1.26 1.26 0 0 1 1.087-.627l4.003-.009a1.26 1.26 0 0 1 1.094.63l1.721 2.982c.226.39.225.872-.001 1.263l-1.743 3a1.26 1.26 0 0 1-1.086.628l-4.003.009a1.26 1.26 0 0 1-1.094-.63l-1.722-2.982a1.26 1.26 0 0 1 .002-1.263l1.742-3Zm1.967.858a1.26 1.26 0 0 0-1.08.614l-.903 1.513a1.26 1.26 0 0 0-.002 1.289l.885 1.492c.227.384.64.62 1.086.618l2.192-.005a1.26 1.26 0 0 0 1.08-.615l.904-1.518a1.26 1.26 0 0 0 .001-1.288l-.884-1.489a1.26 1.26 0 0 0-1.086-.616l-2.193.005Zm2.517 2.76a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z" clip-rule="evenodd"></path></svg>';
const $mode_0_off = '<svg class="apd-icon apd-mode-0-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h11.674A7 7 0 0 1 23 15zM11 9h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm2-1a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1z" fill="#00AEEC"></path><path d="M26.536 18.464a5 5 0 0 0-7.071 0 5 5 0 0 0 0 7.071 5 5 0 1 0 7.071-7.071zm-5.657 5.657a3 3 0 0 1-.586-3.415l4.001 4.001a3 3 0 0 1-3.415-.586zm4.829-.827-4.001-4.001a3.002 3.002 0 0 1 4.001 4.001z" fill="#00AEEC"></path></svg>';
const $mode_0_on = '<svg class="apd-icon apd-mode-0-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM11 9h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2z" fill="#FFFFFF"></path></svg>';
const $mode_1_off = '<svg class="apd-icon apd-mode-1-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h11.674A7 7 0 0 1 23 15zm-4-8h2v2h-2V7zM9 9H7V7h2v2zm4 0h-2V7h2v2zm2-2h2v2h-2V7z" fill="#00AEEC"></path><path d="M26.536 18.464a5 5 0 0 0-7.071 0 5 5 0 0 0 0 7.071 5 5 0 1 0 7.071-7.071zm-5.657 5.657a3 3 0 0 1-.586-3.415l4.001 4.001a3 3 0 0 1-3.415-.586zm4.829-.827-4.001-4.001a3.002 3.002 0 0 1 4.001 4.001z" fill="#00AEEC"></path></svg>';
const $mode_1_on = '<svg class="apd-icon apd-mode-1-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM9 9H7V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2z" fill="#FFFFFF"></path></svg>';
const $mode_2_off = '<svg class="apd-icon apd-mode-2-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h11.674A7 7 0 0 1 23 15zM9 21H7v-2h2v2zm4 0h-2v-2h2v2z" fill="#00AEEC"></path><path d="M26.536 18.464a5 5 0 0 0-7.071 0 5 5 0 0 0 0 7.071 5 5 0 1 0 7.071-7.071zm-5.657 5.657a3 3 0 0 1-.586-3.415l4.001 4.001a3 3 0 0 1-3.415-.586zm4.829-.827-4.001-4.001a3.002 3.002 0 0 1 4.001 4.001z" fill="#00AEEC"></path></svg>';
const $mode_2_on = '<svg class="apd-icon apd-mode-2-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM9 21H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="#FFFFFF"></path></svg>';
const $off = '<svg class="apd-icon apd-toggle-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24" width="24"  height="24" ><path fill-rule="evenodd" d="m8.085 4.891-.999-1.499a1.008 1.008 0 0 1 1.679-1.118l1.709 2.566c.54-.008 1.045-.012 1.515-.012h.13c.345 0 .707.003 1.088.007l1.862-2.59a1.008 1.008 0 0 1 1.637 1.177l-1.049 1.46c.788.02 1.631.046 2.53.078 1.958.069 3.468 1.6 3.74 3.507.088.613.13 2.158.16 3.276l.001.027c.01.333.017.63.025.856a.987.987 0 0 1-1.974.069c-.008-.23-.016-.539-.025-.881v-.002c-.028-1.103-.066-2.541-.142-3.065-.143-1.004-.895-1.78-1.854-1.813-2.444-.087-4.466-.13-6.064-.131-1.598 0-3.619.044-6.063.13a2.037 2.037 0 0 0-1.945 1.748c-.15 1.04-.225 2.341-.225 3.904 0 1.874.11 3.474.325 4.798.154.949.95 1.66 1.91 1.708a97.58 97.58 0 0 0 5.416.139.988.988 0 0 1 0 1.975c-2.196 0-3.61-.047-5.513-.141A4.012 4.012 0 0 1 2.197 17.7c-.236-1.446-.351-3.151-.351-5.116 0-1.64.08-3.035.245-4.184A4.013 4.013 0 0 1 5.92 4.96c.761-.027 1.483-.05 2.164-.069Zm4.436 4.707h-1.32v4.63h2.222v.848h-2.618v1.078h2.431a5.01 5.01 0 0 1 3.575-3.115V9.598h-1.276a8.59 8.59 0 0 0 .748-1.42l-1.089-.384a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.289h-3.2v.979h2.067v1.43H7.483l-.308 3.454h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.004c.285.02.551.04.818.04 1.001-.066 1.562-.418 1.694-1.056.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858H15.8Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902H15.8v.902h-1.254Zm3.517 10.594a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-.002-1.502a2.5 2.5 0 0 1-2.217-3.657l3.326 3.398a2.49 2.49 0 0 1-1.109.259Zm2.5-2.5c0 .42-.103.815-.286 1.162l-3.328-3.401a2.5 2.5 0 0 1 3.614 2.239Z" clip-rule="evenodd"></path></svg>';
const $on = '<svg class="apd-icon apd-toggle-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24" width="24"  height="24" ><path fill-rule="evenodd" d="M11.989 4.828c-.47 0-.975.004-1.515.012l-1.71-2.566a1.008 1.008 0 0 0-1.678 1.118l.999 1.5c-.681.018-1.403.04-2.164.068a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363l.906.046c1.205.063 1.808.095 3.607.095a.988.988 0 0 0 0-1.975c-1.758 0-2.339-.03-3.501-.092l-.915-.047a2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.01.342.017.65.025.88a.987.987 0 1 0 1.974-.068c-.008-.226-.016-.523-.025-.856v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.9-.032-1.743-.058-2.531-.078l1.05-1.46a1.008 1.008 0 0 0-1.638-1.177l-1.862 2.59c-.38-.004-.744-.007-1.088-.007h-.13Zm.521 4.775h-1.32v4.631h2.222v.847h-2.618v1.078h2.618l.003.678c.36.026.714.163 1.01.407h.11v-1.085h2.694v-1.078h-2.695v-.847H16.8v-4.63h-1.276a8.59 8.59 0 0 0 .748-1.42L15.183 7.8a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.294h-3.2v.98H9.33v1.43H7.472l-.308 3.453h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.005c.285.02.551.04.818.04 1.001-.067 1.562-.419 1.694-1.057.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858h1.254Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902h1.254v.902h-1.254Z" clip-rule="evenodd"></path><path fill="#00AEEC" fill-rule="evenodd" d="M22.846 14.627a1 1 0 0 0-1.412.075l-5.091 5.703-2.216-2.275-.097-.086-.008-.005a1 1 0 0 0-1.322 1.493l2.963 3.041.093.083.007.005c.407.315 1 .27 1.354-.124l5.81-6.505.08-.102.005-.008a1 1 0 0 0-.166-1.295Z" clip-rule="evenodd"></path></svg>';
const $style = '<svg class="apd-icon apd-style-icon" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 22 22" viewBox="0 0 22 22" width="36"  height="24" ><path d="M17 16H5c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1zM6.96 15c.39 0 .74-.24.89-.6l.65-1.6h5l.66 1.6c.15.36.5.6.89.6.69 0 1.15-.71.88-1.34l-3.88-8.97C11.87 4.27 11.46 4 11 4s-.87.27-1.05.69l-3.88 8.97c-.27.63.2 1.34.89 1.34zM11 5.98 12.87 11H9.13L11 5.98z"></path></svg>';
function settingIcons() {
  return {
    $on,
    $off,
    $config,
    $style,
    $mode_0_off,
    $mode_0_on,
    $mode_1_off,
    $mode_1_on,
    $mode_2_off,
    $mode_2_on,
    $check_on,
    $check_off
  };
}
function settingTemplate() {
  const { option } = this;
  return `
            <div class="apd-toggle">
                ${$on}${$off}
            </div>
            <div class="apd-config">
                ${$config}
                <div class="apd-config-panel">
                    <div class="apd-config-panel-inner">
                        <div class="apd-config-mode">
                            按类型屏蔽
                            <div class="apd-modes">
                                <div data-mode="0" class="apd-mode">
                                    ${$mode_0_off}${$mode_0_on}
                                    <div>滚动</div>
                                </div>
                                <div data-mode="1" class="apd-mode">
                                    ${$mode_1_off}${$mode_1_on}
                                    <div>顶部</div>
                                </div>
                                <div data-mode="2" class="apd-mode">
                                    ${$mode_2_off}${$mode_2_on}
                                    <div>底部</div>
                                </div>
                            </div>
                        </div>
                        <div class="apd-config-other">
                            <div class="apd-other apd-anti-overlap">
                                ${$check_on}${$check_off}
                                防止弹幕重叠
                            </div>
                            <div class="apd-other apd-sync-video">
                                ${$check_on}${$check_off}
                                同步视频速度
                            </div>
                        </div>
                        <div class="apd-config-slider apd-config-opacity">
                            不透明度
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-margin">
                            显示区域
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-fontSize">
                            弹幕字号
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-speed">
                            弹幕速度
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="apd-emitter">
                <div class="apd-style">
                    ${$style}
                    <div class="apd-style-panel">
                        <div class="apd-style-panel-inner">
                            <div class="apd-style-mode">
                                模式
                                <div class="apd-modes">
                                    <div data-mode="0" class="apd-mode">
                                        ${$mode_0_on}
                                        <div>滚动</div>
                                    </div>
                                    <div data-mode="1" class="apd-mode">
                                        ${$mode_1_on}
                                        <div>顶部</div>
                                    </div>
                                    <div data-mode="2" class="apd-mode">
                                        ${$mode_2_on}
                                        <div>底部</div>
                                    </div>
                                </div>
                            </div>
                            <div class="apd-style-color">
                                颜色
                                <div class="apd-colors">
                                    ${this.COLOR.map((color) => `<div data-color="${color}" class="apd-color" style="background-color: ${color}"></div>`).join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <input class="apd-input" placeholder="发个友善的弹幕见证当下" autocomplete="off" maxLength="${option.maxLength}" />
                <div class="apd-send">发送</div>
            </div>
        `;
}
const style = ".artplayer-plugin-danmuku {\n  display: flex;\n  position: relative;\n  z-index: 99;\n  align-items: center;\n  justify-content: center;\n  font-size: 12px;\n  height: 32px;\n  width: 100%;\n  color: #fff;\n  font-weight: 300;\n  flex-shrink: 0;\n  gap: 10px;\n}\n.artplayer-plugin-danmuku .apd-icon {\n  cursor: pointer;\n  opacity: 0.75;\n  transition: all 0.2s ease;\n  fill: #fff;\n}\n.artplayer-plugin-danmuku .apd-icon:hover {\n  opacity: 1;\n}\n.artplayer-plugin-danmuku .apd-config {\n  display: flex;\n  position: relative;\n}\n.artplayer-plugin-danmuku .apd-config .apd-config-panel {\n  position: absolute;\n  bottom: 24px;\n  left: 0;\n  width: 320px;\n  padding: 10px;\n  opacity: 0;\n  pointer-events: none;\n}\n.artplayer-plugin-danmuku .apd-config .apd-config-panel .apd-config-panel-inner {\n  width: 100%;\n  border-radius: 3px;\n  background-color: rgba(0, 0, 0, 0.85);\n  padding: 10px;\n}\n.artplayer-plugin-danmuku .apd-config:hover .apd-config-panel {\n  opacity: 100;\n  pointer-events: all;\n}\n.artplayer-plugin-danmuku .apd-config-mode,\n.artplayer-plugin-danmuku .apd-config-slider,\n.artplayer-plugin-danmuku .apd-config-other,\n.artplayer-plugin-danmuku .apd-style-mode {\n  margin-bottom: 15px;\n}\n.artplayer-plugin-danmuku .apd-modes {\n  display: flex;\n  align-items: center;\n  margin-top: 5px;\n  gap: 20px;\n}\n.artplayer-plugin-danmuku .apd-modes .apd-mode {\n  cursor: pointer;\n  text-align: center;\n}\n.artplayer-plugin-danmuku .apd-modes .apd-mode:hover {\n  color: #00a1d6;\n}\n.artplayer-plugin-danmuku .apd-config-slider {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.artplayer-plugin-danmuku .apd-config-slider .apd-value {\n  width: 32px;\n  text-align: right;\n}\n.artplayer-plugin-danmuku .apd-slider {\n  position: relative;\n  flex: 1;\n  display: flex;\n  height: 20px;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.artplayer-plugin-danmuku .apd-slider .apd-slider-line {\n  position: relative;\n  height: 2px;\n  width: 100%;\n  overflow: hidden;\n  border-radius: 3px;\n  background-color: rgba(255, 255, 255, 0.25);\n}\n.artplayer-plugin-danmuku .apd-slider .apd-slider-points {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.artplayer-plugin-danmuku .apd-slider .apd-slider-points .apd-slider-point {\n  width: 2px;\n  height: 2px;\n  border-radius: 50%;\n  background-color: rgba(255, 255, 255, 0.5);\n}\n.artplayer-plugin-danmuku .apd-slider .apd-slider-progress {\n  width: 0%;\n  height: 100%;\n  background-color: #00a1d6;\n}\n.artplayer-plugin-danmuku .apd-slider .apd-slider-dot {\n  position: absolute;\n  transform: translateX(-6px);\n  left: 0%;\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  background-color: #00a1d6;\n}\n.artplayer-plugin-danmuku .apd-slider .apd-slider-steps {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  position: absolute;\n  bottom: -12px;\n  width: calc(100% + 32px);\n  color: #777;\n}\n.artplayer-plugin-danmuku .apd-slider .apd-slider-steps .apd-slider-step {\n  flex-shrink: 0;\n  width: 36px;\n  text-align: center;\n  scale: 0.95;\n}\n.artplayer-plugin-danmuku .apd-config-other {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n}\n.artplayer-plugin-danmuku .apd-config-other .apd-check-off,\n.artplayer-plugin-danmuku .apd-config-other .apd-check-on {\n  width: 16px;\n  height: 16px;\n}\n.artplayer-plugin-danmuku .apd-config-other .apd-other {\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n  gap: 2px;\n}\n.artplayer-plugin-danmuku .apd-config-other .apd-other:hover {\n  color: #00a1d6;\n}\n.artplayer-plugin-danmuku .apd-emitter {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  height: 100%;\n  background-color: rgba(255, 255, 255, 0.25);\n  border-radius: 5px;\n}\n.artplayer-plugin-danmuku .apd-style {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.artplayer-plugin-danmuku .apd-style .apd-style-panel {\n  position: absolute;\n  bottom: 24px;\n  left: 0;\n  width: 200px;\n  padding: 10px;\n  opacity: 0;\n  pointer-events: none;\n}\n.artplayer-plugin-danmuku .apd-style .apd-style-panel .apd-style-panel-inner {\n  width: 100%;\n  border-radius: 3px;\n  background-color: rgba(0, 0, 0, 0.85);\n  padding: 10px;\n}\n.artplayer-plugin-danmuku .apd-style:hover .apd-style-panel {\n  opacity: 100;\n  pointer-events: all;\n}\n.artplayer-plugin-danmuku .apd-colors {\n  display: flex;\n  flex-wrap: wrap;\n  margin-top: 5px;\n  gap: 8px;\n}\n.artplayer-plugin-danmuku .apd-colors .apd-color {\n  width: 16px;\n  height: 16px;\n  border-radius: 2px;\n  cursor: pointer;\n}\n.artplayer-plugin-danmuku .apd-colors .apd-color.apd-active {\n  border: 1px solid black;\n  box-shadow: 0 0 0 1px #fff;\n}\n.artplayer-plugin-danmuku .apd-input {\n  outline: none;\n  height: 100%;\n  flex: 1;\n  min-width: 0;\n  width: auto;\n  border: none;\n  line-height: 1;\n  color: #fff;\n  background-color: transparent;\n}\n.artplayer-plugin-danmuku .apd-input::placeholder {\n  color: rgba(255, 255, 255, 0.5);\n}\n.artplayer-plugin-danmuku .apd-send {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  width: 60px;\n  flex-shrink: 0;\n  cursor: pointer;\n  text-shadow: none;\n  border-top-right-radius: 5px;\n  border-bottom-right-radius: 5px;\n  background-color: #00a1d6;\n}\n.artplayer-plugin-danmuku .apd-send.apd-lock {\n  cursor: not-allowed;\n  color: #666;\n  background-color: #e7e7e7;\n}\n.art-controls-center .apd-emitter {\n  width: 260px;\n  flex: none;\n}\n.art-fullscreen .artplayer-plugin-danmuku,\n.art-fullscreen-web .artplayer-plugin-danmuku {\n  height: 38px;\n  gap: 16px;\n}\n.art-fullscreen .artplayer-plugin-danmuku .apd-config-icon,\n.art-fullscreen-web .artplayer-plugin-danmuku .apd-config-icon,\n.art-fullscreen .artplayer-plugin-danmuku .apd-toggle-off,\n.art-fullscreen-web .artplayer-plugin-danmuku .apd-toggle-off,\n.art-fullscreen .artplayer-plugin-danmuku .apd-toggle-on,\n.art-fullscreen-web .artplayer-plugin-danmuku .apd-toggle-on {\n  width: 28px;\n  height: 28px;\n}\n.art-fullscreen .artplayer-plugin-danmuku .apd-emitter,\n.art-fullscreen-web .artplayer-plugin-danmuku .apd-emitter {\n  width: 400px;\n  flex: none;\n}\n.art-video-player > .artplayer-plugin-danmuku {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: -40px;\n  padding: 0 10px;\n}\n.art-video-player:has(> .artplayer-plugin-danmuku) {\n  margin-bottom: 40px;\n}\n[data-danmuku-emitter='false'] .apd-emitter {\n  display: none !important;\n}\n[data-danmuku-emitter='false'] .art-controls-center .artplayer-plugin-danmuku {\n  justify-content: flex-end;\n  gap: 18px;\n}\n[data-danmuku-emitter='false'].art-fullscreen .art-controls-center .artplayer-plugin-danmuku,\n[data-danmuku-emitter='false'].art-fullscreen-web .art-controls-center .artplayer-plugin-danmuku {\n  gap: 24px;\n}\n[data-danmuku-theme='light'] > .artplayer-plugin-danmuku .apd-icon {\n  fill: #333;\n}\n[data-danmuku-theme='light'] > .artplayer-plugin-danmuku .apd-emitter {\n  background-color: #f1f2f3;\n}\n[data-danmuku-theme='light'] > .artplayer-plugin-danmuku .apd-input {\n  color: #000;\n}\n[data-danmuku-theme='light'] > .artplayer-plugin-danmuku .apd-input::placeholder {\n  color: rgba(0, 0, 0, 0.3);\n}\n[data-danmuku-visible='false'] .apd-toggle-off {\n  display: block;\n}\n[data-danmuku-visible='false'] .apd-toggle-on {\n  display: none;\n}\n[data-danmuku-visible='true'] .apd-toggle-off {\n  display: none;\n}\n[data-danmuku-visible='true'] .apd-toggle-on {\n  display: block;\n}\n[data-danmuku-anti-overlap='false'] .apd-anti-overlap .apd-check-on {\n  display: none;\n}\n[data-danmuku-anti-overlap='false'] .apd-anti-overlap .apd-check-off {\n  display: block;\n}\n[data-danmuku-anti-overlap='true'] .apd-anti-overlap .apd-check-on {\n  display: block;\n}\n[data-danmuku-anti-overlap='true'] .apd-anti-overlap .apd-check-off {\n  display: none;\n}\n[data-danmuku-sync-video='false'] .apd-sync-video .apd-check-on {\n  display: none;\n}\n[data-danmuku-sync-video='false'] .apd-sync-video .apd-check-off {\n  display: block;\n}\n[data-danmuku-sync-video='true'] .apd-sync-video .apd-check-on {\n  display: block;\n}\n[data-danmuku-sync-video='true'] .apd-sync-video .apd-check-off {\n  display: none;\n}\n[data-danmuku-mode0='false'] .apd-config-mode .apd-mode-0-off {\n  display: block;\n}\n[data-danmuku-mode0='false'] .apd-config-mode .apd-mode-0-on {\n  display: none;\n}\n[data-danmuku-mode0='false'] .art-danmuku [data-mode='0'] {\n  opacity: 0 !important;\n}\n[data-danmuku-mode0='true'] .apd-config-mode .apd-mode-0-off {\n  display: none;\n}\n[data-danmuku-mode0='true'] .apd-config-mode .apd-mode-0-on {\n  display: block;\n}\n[data-danmuku-mode='0'] .apd-style-mode [data-mode='0'] {\n  color: #00a1d6;\n}\n[data-danmuku-mode='0'] .apd-style-mode [data-mode='0'] path {\n  fill: #00a1d6;\n}\n[data-danmuku-mode1='false'] .apd-config-mode .apd-mode-1-off {\n  display: block;\n}\n[data-danmuku-mode1='false'] .apd-config-mode .apd-mode-1-on {\n  display: none;\n}\n[data-danmuku-mode1='false'] .art-danmuku [data-mode='1'] {\n  opacity: 0 !important;\n}\n[data-danmuku-mode1='true'] .apd-config-mode .apd-mode-1-off {\n  display: none;\n}\n[data-danmuku-mode1='true'] .apd-config-mode .apd-mode-1-on {\n  display: block;\n}\n[data-danmuku-mode='1'] .apd-style-mode [data-mode='1'] {\n  color: #00a1d6;\n}\n[data-danmuku-mode='1'] .apd-style-mode [data-mode='1'] path {\n  fill: #00a1d6;\n}\n[data-danmuku-mode2='false'] .apd-config-mode .apd-mode-2-off {\n  display: block;\n}\n[data-danmuku-mode2='false'] .apd-config-mode .apd-mode-2-on {\n  display: none;\n}\n[data-danmuku-mode2='false'] .art-danmuku [data-mode='2'] {\n  opacity: 0 !important;\n}\n[data-danmuku-mode2='true'] .apd-config-mode .apd-mode-2-off {\n  display: none;\n}\n[data-danmuku-mode2='true'] .apd-config-mode .apd-mode-2-on {\n  display: block;\n}\n[data-danmuku-mode='2'] .apd-style-mode [data-mode='2'] {\n  color: #00a1d6;\n}\n[data-danmuku-mode='2'] .apd-style-mode [data-mode='2'] path {\n  fill: #00a1d6;\n}\n";
if (typeof document !== "undefined") {
  const id = "artplayer-plugin-danmuku";
  const pending = /* @__PURE__ */ Symbol.for("artplayer-plugin-danmuku.pending-style");
  const styleDocument = document;
  let $style2 = document.getElementById(id) || styleDocument[pending];
  if (!$style2) {
    $style2 = document.createElement("style");
    $style2.id = id;
    if (document.readyState === "loading") {
      styleDocument[pending] = $style2;
      const ready = () => {
        document.removeEventListener("DOMContentLoaded", ready);
        if (styleDocument[pending] === $style2)
          delete styleDocument[pending];
        const existing = document.getElementById(id);
        if (existing)
          existing.textContent = $style2.textContent;
        else
          (document.head || document.documentElement).appendChild($style2);
      };
      document.addEventListener("DOMContentLoaded", ready, { once: true });
    } else {
      (document.head || document.documentElement).appendChild($style2);
    }
  }
  $style2.textContent = style;
}
class Setting {
  constructor(art, danmuku) {
    this.art = art;
    this.danmuku = danmuku;
    this.utils = art.constructor.utils;
    const { setStyle } = this.utils;
    const { $controlsCenter } = art.template;
    this.template = {
      $controlsCenter,
      $mount: $controlsCenter,
      $danmuku: null,
      $toggle: null,
      $config: null,
      $configPanel: null,
      $configModes: null,
      $style: null,
      $stylePanel: null,
      $styleModes: null,
      $colors: null,
      $opacitySlider: null,
      $opacityValue: null,
      $marginSlider: null,
      $marginValue: null,
      $fontSizeSlider: null,
      $fontSizeValue: null,
      $speedSlider: null,
      $speedValue: null,
      $input: null,
      $send: null
    };
    this.slider = {
      opacity: null,
      margin: null,
      fontSize: null,
      speed: null
    };
    this.emitting = false;
    this.isLock = false;
    this.timer = null;
    this.lifecycle = new SettingLifecycle(art);
    this.destroy = this.destroy.bind(this);
    this.lifecycle.own(() => art.off("destroy", this.destroy));
    try {
      art.on("destroy", this.destroy);
      if (!this.lifecycle.active)
        return;
      this.lifecycle.write($controlsCenter.style, "display", "flex", (value) => setStyle($controlsCenter, "display", value));
      this.createTemplate();
      if (!this.lifecycle.active)
        return;
      this.createSliders();
      if (!this.lifecycle.active)
        return;
      this.createEvents();
      this.mount(this.option.mount);
      if (!this.lifecycle.active)
        return;
      this.lifecycle.on("resize", () => this.resize());
      this.lifecycle.on("fullscreen", (state) => this.onFullscreen(state));
      this.lifecycle.on("fullscreenWeb", (state) => this.onFullscreen(state));
      this.lifecycle.proxy(this.template.$config, "mouseenter", () => {
        this.onMouseEnter({
          $control: this.template.$config,
          $panel: this.template.$configPanel
        });
      });
      this.lifecycle.proxy(this.template.$style, "mouseenter", () => {
        this.onMouseEnter({
          $control: this.template.$style,
          $panel: this.template.$stylePanel
        });
      });
    } catch (error) {
      try {
        this.destroy();
      } catch (cleanupError) {
        console.warn("Failed to roll back danmuku setting:", cleanupError);
      }
      throw error;
    }
  }
  static get icons() {
    return settingIcons();
  }
  get option() {
    return this.danmuku.option;
  }
  get outside() {
    return this.template.$mount !== this.template.$controlsCenter;
  }
  get TEMPLATE() {
    return settingTemplate.call(this);
  }
  get OPACITY() {
    return {
      min: 0,
      max: 100,
      steps: [],
      ...this.option.OPACITY
    };
  }
  get FONT_SIZE() {
    return {
      min: 12,
      max: 120,
      steps: [],
      ...this.option.FONT_SIZE
    };
  }
  get MARGIN() {
    return {
      min: 0,
      max: 3,
      steps: [
        {
          name: "1/4",
          value: [10, "75%"]
        },
        {
          name: "半屏",
          value: [10, "50%"]
        },
        {
          name: "3/4",
          value: [10, "25%"]
        },
        {
          name: "满屏",
          value: [10, 10]
        }
      ],
      ...this.option.MARGIN
    };
  }
  get SPEED() {
    return {
      min: 0,
      max: 4,
      steps: [
        {
          name: "极慢",
          value: 10
        },
        {
          name: "较慢",
          value: 7.5,
          hide: true
        },
        {
          name: "适中",
          value: 5
        },
        {
          name: "较快",
          value: 2.5,
          hide: true
        },
        {
          name: "极快",
          value: 1
        }
      ],
      ...this.option.SPEED
    };
  }
  get COLOR() {
    return this.option.COLOR.length ? this.option.COLOR : [
      "#FE0302",
      "#FF7204",
      "#FFAA02",
      "#FFD302",
      "#FFFF00",
      "#A0EE00",
      "#00CD00",
      "#019899",
      "#4266BE",
      "#89D5FF",
      "#CC0273",
      "#222222",
      "#9B9B9B",
      "#FFFFFF"
    ];
  }
  query(selector) {
    const { query } = this.utils;
    const { $danmuku } = this.template;
    return query(selector, $danmuku);
  }
  append(el, target) {
    if (!this.lifecycle.active)
      return;
    const { append } = this.utils;
    const children = [...el.children];
    if (children.includes(target))
      return;
    append(el, target);
  }
  setData(key, value) {
    if (!this.lifecycle.active)
      return;
    const { $player } = this.art.template;
    const { $mount } = this.template;
    this.lifecycle.write($player.dataset, key, value);
    if (this.outside) {
      this.lifecycle.write($mount.dataset, key, value);
    }
  }
  createTemplate() {
    const { createElement, tooltip } = this.utils;
    const $danmuku = createElement("div");
    this.template.$danmuku = $danmuku;
    $danmuku.className = "artplayer-plugin-danmuku";
    $danmuku.innerHTML = this.TEMPLATE;
    this.template.$toggle = this.query(".apd-toggle");
    this.template.$config = this.query(".apd-config");
    this.template.$configPanel = this.query(".apd-config-panel");
    this.template.$configModes = this.query(".apd-config-mode .apd-modes");
    this.template.$style = this.query(".apd-style");
    this.template.$stylePanel = this.query(".apd-style-panel");
    this.template.$styleModes = this.query(".apd-style-mode .apd-modes");
    this.template.$colors = this.query(".apd-colors");
    this.template.$antiOverlap = this.query(".apd-anti-overlap");
    this.template.$syncVideo = this.query(".apd-sync-video");
    this.template.$opacitySlider = this.query(".apd-config-opacity .apd-slider");
    this.template.$opacityValue = this.query(".apd-config-opacity .apd-value");
    this.template.$marginSlider = this.query(".apd-config-margin .apd-slider");
    this.template.$marginValue = this.query(".apd-config-margin .apd-value");
    this.template.$fontSizeSlider = this.query(".apd-config-fontSize .apd-slider");
    this.template.$fontSizeValue = this.query(".apd-config-fontSize .apd-value");
    this.template.$speedSlider = this.query(".apd-config-speed .apd-slider");
    this.template.$speedValue = this.query(".apd-config-speed .apd-value");
    this.template.$input = this.query(".apd-input");
    this.template.$send = this.query(".apd-send");
    const { $toggle } = this.template;
    this.lifecycle.on("artplayerPluginDanmuku:show", () => {
      tooltip($toggle, "关闭弹幕");
    });
    this.lifecycle.on("artplayerPluginDanmuku:hide", () => {
      tooltip($toggle, "打开弹幕");
    });
  }
  createEvents() {
    const { $toggle, $configModes, $styleModes, $colors, $antiOverlap, $syncVideo, $send, $input } = this.template;
    this.lifecycle.proxy($toggle, "click", () => {
      this.danmuku.config({
        visible: !this.option.visible
      });
      this.reset();
    });
    this.lifecycle.proxy($configModes, "click", (event) => {
      const $mode = event.target.closest(".apd-mode");
      if (!$mode)
        return;
      const mode = Number($mode.dataset.mode);
      if (this.option.modes.includes(mode)) {
        this.danmuku.config({
          modes: this.option.modes.filter((m) => m !== mode)
        });
      } else {
        this.danmuku.config({
          modes: [...this.option.modes, mode]
        });
      }
      this.reset();
    });
    this.lifecycle.proxy($antiOverlap, "click", () => {
      this.danmuku.config({
        antiOverlap: !this.option.antiOverlap
      });
      this.reset();
    });
    this.lifecycle.proxy($syncVideo, "click", () => {
      this.danmuku.config({
        synchronousPlayback: !this.option.synchronousPlayback
      });
      this.reset();
    });
    this.lifecycle.proxy($styleModes, "click", (event) => {
      const $mode = event.target.closest(".apd-mode");
      if (!$mode)
        return;
      const mode = Number($mode.dataset.mode);
      this.danmuku.config({
        mode
      });
      this.reset();
    });
    this.lifecycle.proxy($colors, "click", (event) => {
      const $color = event.target.closest(".apd-color");
      if (!$color)
        return;
      this.danmuku.config({
        color: $color.dataset.color
      });
      this.reset();
    });
    this.lifecycle.proxy($send, "click", () => this.emit());
    this.lifecycle.proxy($input, "keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.emit();
      }
    });
  }
  createSliders() {
    this.slider.opacity = this.createSlider({
      ...this.OPACITY,
      container: this.template.$opacitySlider,
      findIndex: () => {
        return Math.round(this.option.opacity * 100);
      },
      onChange: (index) => {
        const { $opacityValue } = this.template;
        $opacityValue.textContent = `${index}%`;
        this.danmuku.config({
          opacity: index / 100
        });
      }
    });
    this.slider.margin = this.createSlider({
      ...this.MARGIN,
      container: this.template.$marginSlider,
      findIndex: () => {
        return this.MARGIN.steps.findIndex(
          (item) => item.value[0] === this.option.margin[0] && item.value[1] === this.option.margin[1]
        );
      },
      onChange: (index) => {
        const margin = this.MARGIN.steps[index];
        if (!margin)
          return;
        const { $marginValue } = this.template;
        $marginValue.textContent = margin.name;
        this.danmuku.config({
          margin: margin.value
        });
      }
    });
    this.slider.fontSize = this.createSlider({
      ...this.FONT_SIZE,
      container: this.template.$fontSizeSlider,
      findIndex: () => {
        return this.danmuku.fontSize;
      },
      onChange: (index) => {
        const { $fontSizeValue } = this.template;
        $fontSizeValue.textContent = `${index}px`;
        if (index === this.danmuku.fontSize)
          return;
        this.danmuku.config({
          fontSize: index
        });
      }
    });
    this.slider.speed = this.createSlider({
      ...this.SPEED,
      container: this.template.$speedSlider,
      findIndex: () => {
        return this.SPEED.steps.findIndex((item) => item.value === this.option.speed);
      },
      onChange: (index) => {
        const speed = this.SPEED.steps[index];
        if (!speed)
          return;
        const { $speedValue } = this.template;
        $speedValue.textContent = speed.name;
        this.danmuku.config({
          speed: speed.value
        });
      }
    });
  }
  createSlider(option) {
    return createSlider.call(this, option);
  }
  onFullscreen(state) {
    if (!this.lifecycle.active)
      return;
    const { $danmuku, $controlsCenter, $mount } = this.template;
    if (this.outside) {
      if (state) {
        this.append($controlsCenter, $danmuku);
      } else {
        this.append($mount, $danmuku);
      }
    } else {
      this.append($controlsCenter, $danmuku);
    }
  }
  onMouseEnter({ $control, $panel }) {
    if (!this.lifecycle.active)
      return;
    const { $player } = this.art.template;
    const controlRect = $control.getBoundingClientRect();
    const panelRect = $panel.getBoundingClientRect();
    const playerRect = $player.getBoundingClientRect();
    const half = panelRect.width / 2 - controlRect.width / 2;
    const left = playerRect.left - (controlRect.left - half);
    const right = controlRect.right + half - playerRect.right;
    if (left > 0) {
      $panel.style.left = `${-half + left}px`;
    } else if (right > 0) {
      $panel.style.left = `${-half - right}px`;
    } else {
      $panel.style.left = `${-half}px`;
    }
  }
  emit() {
    return emitSetting(this);
  }
  lock() {
    lockSetting(this);
  }
  unlock() {
    unlockSetting(this);
  }
  resize() {
    if (!this.lifecycle.active)
      return;
    if (this.outside)
      return;
    if (this.art.fullscreen)
      return;
    if (this.art.fullscreenWeb)
      return;
    const { $player, $controlsCenter } = this.art.template;
    const { $danmuku } = this.template;
    if (this.art.width < this.option.width) {
      this.append($player, $danmuku);
    } else {
      this.append($controlsCenter, $danmuku);
    }
  }
  reset() {
    if (!this.lifecycle.active)
      return;
    const { inverseClass, tooltip } = this.utils;
    const { $toggle, $colors } = this.template;
    for (const slider of Object.values(this.slider)) {
      slider.reset();
      if (!this.lifecycle.active)
        return;
    }
    this.setData("danmukuVisible", this.option.visible);
    this.setData("danmukuMode", this.option.mode);
    this.setData("danmukuColor", this.option.color);
    this.setData("danmukuMode0", this.option.modes.includes(0));
    this.setData("danmukuMode1", this.option.modes.includes(1));
    this.setData("danmukuMode2", this.option.modes.includes(2));
    this.setData("danmukuAntiOverlap", this.option.antiOverlap);
    this.setData("danmukuSyncVideo", this.option.synchronousPlayback);
    this.setData("danmukuTheme", this.option.theme);
    this.setData("danmukuEmitter", this.option.emitter);
    const colors = $colors.children;
    const $color = Array.from(colors).find((item) => item.dataset.color === this.option.color.toUpperCase());
    $color && inverseClass($color, "apd-active");
    tooltip($toggle, this.option.visible ? "关闭弹幕" : "打开弹幕");
    this.resize();
  }
  mount(target) {
    if (!this.lifecycle.active)
      return;
    const { errorHandle } = this.utils;
    const $el = typeof target === "string" ? document.querySelector(target) : target;
    errorHandle($el, `Can not find the mount point: ${target}`);
    this.append($el, this.template.$danmuku);
    this.template.$mount = $el;
    this.reset();
  }
  destroy() {
    if (this.lifecycle.closed)
      return;
    this.lifecycle.close();
    clearTimeout(this.timer);
    this.timer = null;
    this.emitting = false;
    this.isLock = false;
    const $danmuku = this.template.$danmuku;
    if ($danmuku?.parentElement)
      $danmuku.parentElement.removeChild($danmuku);
  }
}
function artplayerPluginDanmuku(option) {
  return (art) => {
    const danmuku = new Danmuku(art, option);
    let setting;
    try {
      setting = art.isDestroy ? void 0 : new Setting(art, danmuku);
      if (!art.isDestroy && danmuku.option.heatmap) {
        heatmap(art, danmuku, danmuku.option.heatmap);
      }
    } catch (error) {
      try {
        setting?.destroy();
      } catch {
      }
      try {
        danmuku.destroy();
      } catch {
      }
      throw error;
    }
    return {
      name: "artplayerPluginDanmuku",
      emit: danmuku.emit.bind(danmuku),
      load: danmuku.load.bind(danmuku),
      config: danmuku.config.bind(danmuku),
      hide: danmuku.hide.bind(danmuku),
      show: danmuku.show.bind(danmuku),
      reset: danmuku.reset.bind(danmuku),
      mount: setting ? setting.mount.bind(setting) : () => {
      },
      get option() {
        return danmuku.option;
      },
      get isHide() {
        return danmuku.isHide;
      },
      get isStop() {
        return danmuku.isStop;
      }
    };
  };
}
artplayerPluginDanmuku.icons = Setting.icons;
export {
  artplayerPluginDanmuku as default
};
