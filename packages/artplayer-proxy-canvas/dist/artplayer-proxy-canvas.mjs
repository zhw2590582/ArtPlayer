/*!
 * artplayer-proxy-canvas.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function forwardMedia(canvas, video, active, invalidate, mount) {
  const methods = /* @__PURE__ */ new Map();
  for (const name in canvas) {
    const value = Reflect.get(canvas, name);
    if (typeof value === "function")
      methods.set(name, (...args) => Reflect.apply(value, canvas, args));
  }
  for (const name in video) {
    if (name in canvas)
      continue;
    Object.defineProperty(canvas, name, {
      get() {
        const value = Reflect.get(video, name);
        if (typeof value !== "function")
          return value;
        return (...args) => {
          if (!active())
            return name === "play" ? Promise.resolve() : void 0;
          if (name === "load")
            invalidate();
          if (name === "play")
            mount();
          return Reflect.apply(value, video, args);
        };
      },
      set(value) {
        if (!active())
          return;
        if (name === "src" || name === "srcObject")
          invalidate();
        Reflect.set(video, name, value);
      },
      configurable: true,
      enumerable: true
    });
  }
  for (const [name, method] of methods)
    Reflect.set(canvas, name, method);
}
function hasDimensions(video) {
  return Number.isFinite(video.videoWidth) && Number.isFinite(video.videoHeight) && video.videoWidth > 0 && video.videoHeight > 0;
}
function resizeCanvas(canvas, video, player, autoSize) {
  if (!player || autoSize || !hasDimensions(video))
    return;
  const width = player.clientWidth;
  const height = player.clientHeight;
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
    return;
  const aspect = video.videoWidth / video.videoHeight;
  const canvasWidth = width / height > aspect ? height * aspect : width;
  const canvasHeight = width / height > aspect ? height : width / aspect;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.padding = `${(height - canvasHeight) / 2}px ${(width - canvasWidth) / 2}px`;
}
function ownMedia(video, parent, active) {
  let mounted = false;
  return {
    mount() {
      if (mounted || !active())
        return;
      const target = parent();
      if (!target)
        return;
      video.setAttribute("aria-hidden", "true");
      video.tabIndex = -1;
      video.playsInline = true;
      Object.assign(video.style, { position: "absolute", width: "auto", height: "auto", opacity: "0", pointerEvents: "none", left: "0", top: "0" });
      target.appendChild(video);
      mounted = true;
      if (!active())
        video.remove();
    },
    destroy() {
      const failures = [];
      const clearObject = () => {
        video.srcObject = null;
      };
      for (const release of [() => video.pause(), () => video.removeAttribute("src"), clearObject, () => video.load(), () => video.remove()]) {
        try {
          release();
        } catch (error) {
          failures.push(error);
        }
      }
      mounted = false;
      if (failures.length)
        throw failures[0];
    }
  };
}
function createRenderer(canvas, video, callback, notify, error) {
  const context = canvas.getContext("2d");
  let reported = false;
  return {
    available() {
      if (context)
        return true;
      if (!reported) {
        reported = true;
        error(new Error("Canvas 2D context is unavailable"));
      }
      return false;
    },
    async draw(valid) {
      const usable = () => valid() && video.readyState >= 2 && !video.seeking;
      if (!context || !usable() || !hasDimensions(video) || !canvas.width || !canvas.height)
        return;
      let acquiring = false;
      try {
        if (typeof createImageBitmap !== "undefined") {
          acquiring = true;
          const bitmap = await createImageBitmap(video);
          acquiring = false;
          try {
            if (usable())
              context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          } finally {
            bitmap.close();
          }
        } else {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        if (!usable())
          return;
        if (callback)
          callback(context, video);
        if (usable())
          notify(context, video);
      } catch (failure) {
        const awaitingFirstFrame = acquiring && typeof failure === "object" && failure !== null && "name" in failure && failure.name === "InvalidStateError" && video.currentTime === 0 && typeof video.getVideoPlaybackQuality === "function" && video.getVideoPlaybackQuality().totalVideoFrames === 0;
        if (usable() && !awaitingFirstFrame)
          error(failure);
      }
    }
  };
}
function createFrameScheduler(draw, active) {
  let running = false;
  let closed = false;
  let busy = false;
  let pending = false;
  let generation = 0;
  let frame = null;
  function cancel() {
    if (frame !== null)
      cancelAnimationFrame(frame);
    frame = null;
  }
  function drain() {
    if (busy || closed || !active())
      return;
    if (pending) {
      pending = false;
      busy = true;
      const version = generation;
      const valid = () => !closed && active() && generation === version;
      const complete = () => {
        busy = false;
        drain();
      };
      void draw(valid).then(complete, complete);
    } else if (running && frame === null) {
      frame = requestAnimationFrame(() => {
        frame = null;
        pending = true;
        drain();
      });
    }
  }
  function request() {
    if (closed || !active())
      return;
    generation++;
    pending = true;
    cancel();
    drain();
  }
  function stop() {
    running = false;
    pending = false;
    generation++;
    cancel();
  }
  return {
    request,
    start() {
      if (running || closed || !active())
        return;
      running = true;
      request();
    },
    stop,
    destroy() {
      closed = true;
      stop();
    }
  };
}
function artplayerProxyCanvas(callback) {
  return (art) => {
    const constructor = art.constructor;
    const canvas = constructor.utils.createElement("canvas");
    const video = constructor.utils.createElement("video");
    let host = art;
    let closed = art.isDestroy;
    let timer = null;
    const releases = [];
    const active = () => !closed && !host?.isDestroy;
    const media = ownMedia(video, () => host?.template?.$player, active);
    const renderer = createRenderer(canvas, video, callback, (context, source) => host?.emit("artplayerProxyCanvas:draw", context, source), (error) => host?.emit("artplayerProxyCanvas:error", error));
    const scheduler = createFrameScheduler(renderer.draw, active);
    forwardMedia(canvas, video, active, scheduler.stop, media.mount);
    if (closed) {
      host = null;
      return canvas;
    }
    function destroy() {
      if (closed)
        return;
      closed = true;
      scheduler.destroy();
      if (timer !== null)
        clearTimeout(timer);
      timer = null;
      const failures = [];
      for (const release of [...releases.splice(0).reverse(), media.destroy]) {
        try {
          release();
        } catch (error) {
          failures.push(error);
        }
      }
      host = null;
      canvas.width = 0;
      canvas.height = 0;
      if (failures.length)
        throw failures[0];
    }
    function listen(name, handler) {
      if (!active())
        return;
      const listener = () => {
        if (name === "destroy" || active())
          handler();
      };
      const release = () => art.off(name, listener);
      releases.push(release);
      art.on(name, listener);
      if (closed)
        release();
    }
    function request() {
      if (renderer.available())
        scheduler.request();
    }
    try {
      listen("destroy", destroy);
      listen("video:loadedmetadata", () => {
        if (hasDimensions(video)) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
      });
      listen("video:play", () => {
        media.mount();
        if (renderer.available())
          scheduler.start();
      });
      listen("video:pause", scheduler.stop);
      listen("video:emptied", scheduler.stop);
      listen("video:seeked", request);
      listen("resize", () => {
        resizeCanvas(canvas, video, host?.template?.$player, host?.option.autoSize);
        request();
      });
      if (active()) {
        timer = setTimeout(() => {
          timer = null;
          if (!active())
            return;
          try {
            media.mount();
            for (const name of constructor.config.events) {
              if (!active())
                break;
              const forward = (event) => {
                if (active())
                  host?.emit(`video:${event.type}`, event);
              };
              const remove = () => video.removeEventListener(name, forward);
              releases.push(remove);
              const release = art.proxy(video, name, forward);
              if (active())
                releases.push(release);
              else
                release();
            }
          } catch (error) {
            try {
              destroy();
            } catch {
            }
            art.emit("artplayerProxyCanvas:error", error);
          }
        });
      }
    } catch (error) {
      try {
        destroy();
      } catch {
      }
      throw error;
    }
    return canvas;
  };
}
export {
  artplayerProxyCanvas as default
};
