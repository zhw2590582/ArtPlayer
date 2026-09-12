/*!
 * artplayer-plugin-ambilight.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function isCanvas(source) {
  return source.nodeName === "CANVAS";
}
function createColorSampler(canvas, video, createCanvas) {
  let context;
  try {
    context = canvas.getContext("2d");
    canvas.width = 3;
    canvas.height = 3;
  } catch (error) {
    canvas.width = 0;
    canvas.height = 0;
    throw error;
  }
  let destroyed = false;
  let replaceCanvas = false;
  function read(active) {
    if (destroyed || !active())
      return null;
    const canvasOutput = isCanvas(video);
    const width = canvasOutput ? video.width : video.videoWidth;
    const height = canvasOutput ? video.height : video.videoHeight;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
      return null;
    const w = width / 3;
    const h = height / 3;
    const colors = [];
    try {
      if (replaceCanvas) {
        const replacement = createCanvas();
        if (destroyed || !active()) {
          replacement.width = 0;
          replacement.height = 0;
          return null;
        }
        canvas = replacement;
        context = null;
        context = canvas.getContext("2d");
        if (destroyed || !active()) {
          canvas.width = 0;
          canvas.height = 0;
          return null;
        }
        canvas.width = 3;
        canvas.height = 3;
        replaceCanvas = false;
      }
      if (!context)
        return null;
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          if (destroyed || !active())
            return null;
          context.drawImage(video, column * w, row * h, w, h, 0, 0, 1, 1);
          if (destroyed || !active())
            return null;
          const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
          colors.push(`rgb(${r}, ${g}, ${b})`);
        }
      }
      return colors;
    } catch {
      if (!destroyed) {
        replaceCanvas = true;
        canvas.width = 0;
        canvas.height = 0;
      }
      return null;
    }
  }
  function destroy() {
    if (destroyed)
      return;
    destroyed = true;
    canvas.width = 0;
    canvas.height = 0;
  }
  return { read, destroy };
}
function createFrameLoop(frequency, playing, update) {
  let state = "stopped";
  let pending = null;
  let generation = 0;
  let inFrame = false;
  let lastUpdateTime = 0;
  function schedule() {
    const current = generation;
    try {
      pending = requestAnimationFrame(() => {
        if (state !== "running" || current !== generation)
          return;
        pending = null;
        tick();
      });
    } catch (error) {
      state = "stopped";
      generation++;
      throw error;
    }
  }
  function tick() {
    const current = generation;
    const active = () => state === "running" && current === generation;
    inFrame = true;
    try {
      const now = performance.now();
      if (now - lastUpdateTime < 1e3 / frequency || !playing() || !active())
        return;
      lastUpdateTime = now;
      update(active);
    } finally {
      inFrame = false;
      if (state === "running" && pending === null)
        schedule();
    }
  }
  function start() {
    if (state !== "stopped")
      return;
    state = "running";
    generation++;
    if (!inFrame)
      tick();
  }
  function stop() {
    if (state === "destroyed")
      return;
    state = "stopped";
    generation++;
    const frame = pending;
    pending = null;
    if (frame !== null)
      cancelAnimationFrame(frame);
  }
  function destroy() {
    if (state === "destroyed")
      return;
    state = "destroyed";
    generation++;
    const frame = pending;
    pending = null;
    if (frame !== null)
      cancelAnimationFrame(frame);
  }
  return { start, stop, destroy };
}
function createAmbilightView(utils) {
  const element = utils.createElement("div");
  element.innerHTML = Array.from({ length: 9 }).fill("<div></div>").join("");
  const items = Array.from(element.children);
  function mount(video, option, active) {
    if (!active())
      return;
    utils.addClass(element, "artplayer-plugin-ambilight");
    if (!active())
      return;
    video.parentNode.insertBefore(element, video);
    if (!active())
      return;
    utils.setStyles(element, { position: "absolute", top: 0, left: 0, zIndex: 9, inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr 1fr" });
    for (const item of items) {
      if (!active())
        return;
      utils.setStyles(item, { opacity: option.opacity, filter: `blur(${option.blur})`, transition: `background-color ${option.duration}s ease` });
    }
  }
  function render(colors, active) {
    for (let index2 = 0; index2 < colors.length; index2++) {
      if (!active())
        return;
      const item = items[index2];
      const color = colors[index2];
      if (item && color !== void 0)
        item.style.backgroundColor = color;
    }
  }
  function destroy() {
    try {
      element.parentNode?.removeChild(element);
    } finally {
      items.length = 0;
    }
  }
  return { mount, render, destroy };
}
function artplayerPluginAmbilight(option = {}) {
  return (art) => {
    let host = art;
    let closed = art.isDestroy;
    let view = null;
    let sampler = null;
    let loop = null;
    const subscriptions = [];
    const result = {
      name: "artplayerPluginAmbilight",
      start() {
        if (!closed)
          loop?.start();
      },
      stop() {
        if (!closed)
          loop?.stop();
      }
    };
    if (closed) {
      host = null;
      return result;
    }
    function releaseResources() {
      const releases = [loop?.destroy, sampler?.destroy, view?.destroy];
      loop = null;
      sampler = null;
      view = null;
      const failures = [];
      for (const release of releases) {
        try {
          release?.();
        } catch (error) {
          failures.push(error);
        }
      }
      if (failures.length)
        throw failures[0];
    }
    function destroy() {
      if (closed)
        return;
      closed = true;
      const current = host;
      host = null;
      const failures = [];
      for (const [event, callback] of subscriptions.splice(0)) {
        try {
          current?.off(event, callback);
        } catch (error) {
          failures.push(error);
        }
      }
      try {
        releaseResources();
      } catch (error) {
        failures.push(error);
      }
      if (failures.length)
        throw failures[0];
    }
    function listen(event, callback) {
      subscriptions.push([event, callback]);
      host?.on(event, callback);
    }
    try {
      listen("destroy", destroy);
      if (closed)
        return result;
      const { $video } = art.template;
      const utils = art.constructor.utils;
      const { blur = "50px", opacity = 0.5, frequency = 10, duration = 0.3 } = option;
      if (closed)
        return result;
      view = createAmbilightView(utils);
      if (!closed)
        view.mount($video, { blur, opacity, duration }, () => !closed);
      if (closed) {
        releaseResources();
        return result;
      }
      const canvas = utils.createElement("canvas");
      if (closed) {
        canvas.width = 0;
        canvas.height = 0;
        return result;
      }
      sampler = createColorSampler(canvas, $video, () => utils.createElement("canvas"));
      if (closed) {
        releaseResources();
        return result;
      }
      loop = createFrameLoop(frequency, () => Boolean(host?.playing), (valid) => {
        const colors = sampler?.read(valid);
        if (colors && valid())
          view?.render(colors, valid);
      });
      listen("ready", result.start);
      if (closed)
        releaseResources();
    } catch (error) {
      try {
        destroy();
      } catch {
      }
      try {
        releaseResources();
      } catch {
      }
      throw error;
    }
    return result;
  };
}
const index = Object.assign(artplayerPluginAmbilight, { default: artplayerPluginAmbilight });
export {
  index as default
};
