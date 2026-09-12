/*!
 * artplayer-plugin-auto-thumbnail.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function readOptions(option, getFallbackUrl) {
  const config = {
    url: option.url || getFallbackUrl(),
    width: option.width || 160,
    number: option.number || 100,
    scale: option.scale || 1
  };
  if (!Number.isFinite(Number(config.width)) || config.width <= 0 || !Number.isFinite(Number(config.number)) || config.number <= 0)
    throw new TypeError("Auto-thumbnail width and number must be finite positive numbers");
  return config;
}
function sheetSize(config, video) {
  if (!Number.isFinite(video.duration) || video.duration <= 0 || !Number.isFinite(video.videoWidth) || video.videoWidth <= 0 || !Number.isFinite(video.videoHeight) || video.videoHeight <= 0)
    throw new TypeError("Auto-thumbnail requires finite media duration and dimensions");
  const height = Math.floor(config.width * video.videoHeight / video.videoWidth);
  const canvasWidth = Math.trunc(config.width * 10);
  const canvasHeight = Math.trunc(height * Math.ceil(config.number / 10));
  if (![height, canvasWidth, canvasHeight].every((value) => Number.isSafeInteger(value) && value > 0 && value <= 4294967295))
    throw new RangeError("Auto-thumbnail canvas dimensions are invalid");
  return { height, canvasWidth, canvasHeight };
}
function createVideo(job) {
  const video = document.createElement("video");
  job.own(() => video.remove());
  job.own(() => video.load());
  job.own(() => video.removeAttribute("src"));
  job.own(() => video.pause());
  for (const property of ["onloadedmetadata", "onseeked", "onerror"])
    job.own(() => {
      video[property] = null;
    });
  if (!job.active())
    return video;
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.tabIndex = -1;
  video.setAttribute("aria-hidden", "true");
  video.style.cssText = "position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;display:block;width:auto;height:auto;max-width:none;max-height:none";
  document.documentElement.appendChild(video);
  if (!job.active())
    video.remove();
  return video;
}
function extract(job, config) {
  const video = createVideo(job);
  if (!job.active())
    return;
  video.onerror = job.guard(() => {
    throw video.error || new Error("Auto-thumbnail media failed to load");
  });
  video.onloadedmetadata = job.guard(() => {
    video.onloadedmetadata = null;
    const duration = video.duration;
    const videoHeight = video.videoHeight;
    const videoWidth = video.videoWidth;
    const { height, canvasWidth, canvasHeight } = sheetSize(config, {
      duration,
      videoHeight,
      videoWidth
    });
    if (!job.active())
      return;
    video.width = videoWidth;
    video.height = videoHeight;
    video.style.width = `${videoWidth}px`;
    video.style.height = `${videoHeight}px`;
    const canvas = document.createElement("canvas");
    if (!job.active())
      return;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error("Auto-thumbnail canvas context is unavailable");
    if (!job.active())
      return;
    let index = 0;
    const seek = job.guard(() => {
      if (index >= config.number) {
        job.dispose();
        return;
      }
      const target = duration * index / config.number;
      let retries = 0;
      video.onseeked = job.guard(() => {
        if (video.seeking)
          return;
        const time = video.currentTime;
        if (!job.active())
          return;
        if (!Number.isFinite(time) || Math.abs(time - target) > 0.05) {
          if (++retries > 3)
            throw new Error("Auto-thumbnail seek did not reach the requested time");
          video.currentTime = target;
          return;
        }
        video.onseeked = null;
        ctx.drawImage(video, index % 10 * config.width, Math.floor(index / 10) * height, config.width, height);
        if (!job.active())
          return;
        let delivered = false;
        canvas.toBlob(job.guard((blob) => {
          if (delivered)
            return;
          delivered = true;
          job.publish(blob, { height, column: 10, number: config.number, width: config.width, scale: config.scale });
          if (job.active()) {
            index += 1;
            seek();
          }
        }), "image/jpeg");
      });
      if (job.active())
        video.currentTime = target;
    });
    seek();
  });
  if (job.active())
    video.src = config.url;
}
function cleanupAll(actions) {
  let failure;
  let failed = false;
  for (const action of actions) {
    try {
      action();
    } catch (error) {
      if (!failed) {
        failed = true;
        failure = error;
      }
    }
  }
  return { failed, failure };
}
function createSession(publish, report) {
  let closed = false;
  let current;
  let lastUrl;
  const urls = /* @__PURE__ */ new Set();
  function release(url) {
    if (urls.delete(url))
      URL.revokeObjectURL(url);
  }
  function cancel() {
    const previous = current;
    current = void 0;
    previous?.dispose();
  }
  function destroy() {
    if (closed)
      return;
    closed = true;
    const result = cleanupAll([cancel, ...[...urls].map((url) => () => release(url))]);
    lastUrl = void 0;
    if (result.failed)
      report(result.failure);
  }
  function start() {
    if (closed)
      return;
    const previous = current;
    const actions = [];
    let disposed = false;
    const job = {
      active: () => !closed && !disposed && current === job,
      own(action) {
        if (disposed) {
          const result = cleanupAll([action]);
          if (result.failed)
            report(result.failure);
        } else {
          actions.push(action);
        }
      },
      dispose() {
        if (disposed)
          return;
        disposed = true;
        if (current === job)
          current = void 0;
        const result = cleanupAll(actions.splice(0).reverse());
        if (result.failed)
          report(result.failure);
      },
      fail(error) {
        if (!job.active())
          return;
        job.dispose();
        report(error);
      },
      guard(callback) {
        return (...args) => {
          if (!job.active())
            return;
          try {
            return callback(...args);
          } catch (error) {
            job.fail(error);
          }
        };
      },
      publish(blob, config) {
        if (!job.active())
          return;
        if (!blob)
          throw new Error("Auto-thumbnail encoding returned no Blob");
        const url = URL.createObjectURL(blob);
        urls.add(url);
        if (!job.active()) {
          release(url);
          return;
        }
        const previousUrl = lastUrl;
        lastUrl = url;
        try {
          publish({ url, ...config });
        } catch (error) {
          if (lastUrl === url)
            lastUrl = urls.has(previousUrl) ? previousUrl : void 0;
          const result = cleanupAll([() => release(url)]);
          if (result.failed)
            report(result.failure);
          throw error;
        }
        release(previousUrl);
      }
    };
    current = job;
    previous?.dispose();
    return job;
  }
  return {
    start,
    cancel,
    destroy,
    get closed() {
      return closed;
    }
  };
}
function artplayerPluginAutoThumbnail(option) {
  return async (art) => {
    const report = (error) => console.warn("ArtPlayer auto-thumbnail failed:", error);
    const session = createSession((config) => {
      art.thumbnails = config;
    }, report);
    const subscriptions = [];
    const onMetadata = () => {
      const job = session.start();
      if (job) {
        job.guard(() => {
          const config = readOptions(option, () => art.option.url);
          if (job.active())
            extract(job, config);
        })();
      }
    };
    const onDestroy = () => {
      const actions = subscriptions.splice(0);
      const result = cleanupAll([session.destroy, ...actions]);
      if (result.failed)
        report(result.failure);
    };
    try {
      for (const [name, callback] of [["destroy", onDestroy], ["restart", session.cancel], ["video:loadedmetadata", onMetadata]]) {
        if (session.closed)
          break;
        subscriptions.push(() => art.off(name, callback));
        art.on(name, callback);
        if (session.closed)
          art.off(name, callback);
      }
    } catch (error) {
      onDestroy();
      throw error;
    }
    return { name: "artplayerPluginAutoThumbnail" };
  };
}
export {
  artplayerPluginAutoThumbnail as default
};
