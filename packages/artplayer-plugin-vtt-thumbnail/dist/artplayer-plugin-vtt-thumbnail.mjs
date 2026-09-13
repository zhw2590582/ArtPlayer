/*!
 * artplayer-plugin-vtt-thumbnail.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function createLifetime(art) {
  let closed = Boolean(art.isDestroy);
  const cleanups = /* @__PURE__ */ new Set();
  let cancel;
  const cancelled = new Promise((resolve) => {
    cancel = resolve;
  });
  const lifetime = {
    get closed() {
      return closed;
    },
    own(cleanup) {
      if (closed)
        run(cleanup);
      else
        cleanups.add(cleanup);
      return () => cleanups.delete(cleanup);
    },
    listen(name, callback) {
      if (closed)
        return;
      lifetime.own(() => art.off(name, callback));
      art.on(name, callback);
    },
    wait(value) {
      return Promise.race([value, cancelled]);
    },
    dispose() {
      if (closed)
        return;
      closed = true;
      cancel();
      const pending = [...cleanups].reverse();
      cleanups.clear();
      for (const cleanup of pending)
        run(cleanup);
    }
  };
  function run(cleanup) {
    try {
      cleanup();
    } catch (error) {
      console.warn("Failed to clean up VTT thumbnails:", error);
    }
  }
  try {
    lifetime.listen("destroy", lifetime.dispose);
  } catch (error) {
    lifetime.dispose();
    throw error;
  }
  return lifetime;
}
function padEnd(str, targetLength, padString) {
  if (str.length > targetLength) {
    return String(str);
  } else {
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length);
    }
    return String(str) + padString.slice(0, targetLength);
  }
}
function t2d(time) {
  const arr = time.split(".");
  const left = arr[0].split(":") || [];
  const right = padEnd(arr[1] || "0", 3, "0");
  const ms = Number(right) / 1e3;
  const h = Number(left[left.length - 3] || 0) * 3600;
  const m = Number(left[left.length - 2] || 0) * 60;
  const s = Number(left[left.length - 1] || 0);
  return h + m + s + ms;
}
function parseVtt(vttString, vttUrl = "") {
  const lines = vttString.split(/[\n\r]/g).filter((item) => item.trim());
  const vttArray = [];
  for (let i = 1; i < lines.length; i += 2) {
    const time = lines[i];
    const text = lines[i + 1];
    if (!text.trim())
      continue;
    const timeReg = /((?:\d{2}:)?(?:\d{2}:)?\d{2}(?:.\d{3})?) ?--> ?((?:\d{2}:)?(?:\d{2}:)?\d{2}(?:.\d{3})?)/;
    const timeMatch = time.match(timeReg);
    const textReg = /(.*)#(\w{4})=(.*)/;
    const textMatch = text.match(textReg);
    const start = Math.floor(t2d(timeMatch[1]));
    const end = Math.floor(t2d(timeMatch[2]));
    let url = textMatch[1];
    const isAbsoluteUrl = /^\/|(?:https?|ftp|file):\/\//i.test(url);
    if (!isAbsoluteUrl) {
      const urlArr = vttUrl.split("/");
      urlArr.pop();
      urlArr.push(url);
      url = urlArr.join("/");
    }
    const result = { start, end, url };
    const keys = textMatch[2].split("");
    const values = textMatch[3].split(",");
    for (let j = 0; j < keys.length; j++) {
      result[keys[j]] = values[j];
    }
    vttArray.push(result);
  }
  return vttArray;
}
function createPreview({ lifetime, thumbnails, progress, duration, setStyle, isMobile }) {
  let timer = null;
  let generation = 0;
  lifetime.own(() => {
    generation++;
    if (timer !== null) {
      const previous = timer;
      timer = null;
      clearTimeout(previous);
    }
  });
  function style(control, key, value) {
    if (!lifetime.closed)
      setStyle(control, key, value);
  }
  function show(control, cue, width) {
    style(control, "backgroundImage", `url(${cue.url})`);
    style(control, "height", `${cue.h}px`);
    style(control, "width", `${cue.w}px`);
    style(control, "backgroundPosition", `-${cue.x}px -${cue.y}px`);
    if (width <= cue.w / 2)
      style(control, "left", 0);
    else if (width > progress.clientWidth - cue.w / 2)
      style(control, "left", `${progress.clientWidth - cue.w}px`);
    else
      style(control, "left", `${width - cue.w / 2}px`);
  }
  return (control) => async (type, percentage, event) => {
    if (lifetime.closed)
      return;
    const dragging = type === "played" && event && isMobile;
    if (type !== "hover" && !dragging)
      return;
    const width = progress.clientWidth * percentage;
    const second = percentage * duration();
    style(control, "display", "flex");
    if (lifetime.closed)
      return;
    const cue = thumbnails.find((item) => second >= item.start && second <= item.end);
    if (!cue)
      return style(control, "display", "none");
    if (width > 0 && width < progress.clientWidth)
      show(control, cue, width);
    else if (!isMobile)
      style(control, "display", "none");
    if (dragging && !lifetime.closed) {
      const current = ++generation;
      if (timer !== null)
        clearTimeout(timer);
      if (lifetime.closed)
        return;
      const id = setTimeout(() => {
        if (current !== generation || lifetime.closed)
          return;
        timer = null;
        style(control, "display", "none");
      }, 500);
      if (lifetime.closed || current !== generation)
        clearTimeout(id);
      else
        timer = id;
    }
  };
}
async function requestVtt(url = "", lifetime) {
  if (lifetime.closed)
    return;
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const release = lifetime.own(() => controller?.abort());
  try {
    if (lifetime.closed)
      return;
    const response = await lifetime.wait(controller ? fetch(url, { signal: controller.signal }) : fetch(url));
    if (lifetime.closed)
      return;
    if (response.ok === false)
      throw new Error(`Failed to fetch VTT thumbnails: HTTP ${response.status}`);
    if (lifetime.closed)
      return;
    return await lifetime.wait(response.text());
  } finally {
    release();
  }
}
function artplayerPluginVttThumbnail(option) {
  return async (art) => {
    const { constructor: { utils: { setStyle, isMobile, addClass } }, template: { $progress } } = art;
    const lifetime = createLifetime(art);
    const result = { name: "artplayerPluginVttThumbnail" };
    try {
      if (lifetime.closed)
        return result;
      const url = option.vtt;
      const text = await requestVtt(url, lifetime);
      if (lifetime.closed)
        return result;
      const thumbnails = parseVtt(text, url);
      const preview = createPreview({ lifetime, thumbnails, progress: $progress, duration: () => art.duration, setStyle, isMobile });
      const style = option.style || {};
      if (lifetime.closed)
        return result;
      art.controls.add({
        name: "vtt-thumbnail",
        position: "top",
        index: 20,
        style,
        mounted(control) {
          lifetime.own(() => {
            if (art.controls["vtt-thumbnail"] === control)
              art.controls.remove("vtt-thumbnail");
          });
          if (lifetime.closed)
            return;
          addClass(control, "art-control-thumbnails");
          lifetime.listen("setBar", preview(control));
        }
      });
      return result;
    } catch (error) {
      lifetime.dispose();
      throw error;
    }
  };
}
export {
  artplayerPluginVttThumbnail as default
};
