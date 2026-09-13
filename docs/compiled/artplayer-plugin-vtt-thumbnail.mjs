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
function invalid(line, message) {
  throw new TypeError(`Invalid VTT thumbnail at line ${line}: ${message}`);
}
function timestamp(value, line) {
  if (!/^\d{2,}(?::\d{2}){0,2}(?:\.\d{3})?$/.test(value))
    invalid(line, "invalid timestamp");
  const [whole, fraction = "0"] = value.split(".");
  const seconds = whole.split(":").reduce((total, part) => total * 60 + Number(part), 0) + Number(fraction) / 1e3;
  if (!Number.isSafeInteger(Math.floor(seconds)))
    invalid(line, "timestamp exceeds the supported numeric range");
  return seconds;
}
function rectangle(text, vttUrl, line) {
  const match = text.match(/^(.+)#([xywh]{4})=(.*)$/);
  if (!match || new Set(match[2]).size !== 4)
    invalid(line, "expected an image URL and four distinct xywh keys");
  const values = match[3].split(",").map((value) => value.trim());
  if (values.length !== 4)
    invalid(line, "expected four rectangle coordinates");
  const rect = {};
  for (let index2 = 0; index2 < 4; index2++) {
    const key = match[2][index2];
    const value = values[index2];
    if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) || !Number.isFinite(Number(value)))
      invalid(line, "rectangle coordinates must be finite non-negative decimals");
    if ((key === "w" || key === "h") && Number(value) === 0)
      invalid(line, "rectangle width and height must be positive");
    rect[key] = value;
  }
  let url = match[1];
  if (!/^\/|(?:https?|ftp|file):\/\//i.test(url)) {
    const segments = vttUrl.split("/");
    segments.pop();
    segments.push(url);
    url = segments.join("/");
  }
  return { url, ...rect };
}
function findThumbnail(thumbnails, second) {
  return thumbnails.find((item) => second >= item.start && second <= item.end);
}
function parseVtt(text, vttUrl = "") {
  if (typeof text !== "string")
    invalid(1, "expected text");
  const lines = text.replace(/^\uFEFF/, "").split(/\r\n|\r|\n/);
  let index2 = 0;
  function skipEmpty() {
    while (index2 < lines.length && !lines[index2].trim())
      index2++;
  }
  skipEmpty();
  if (index2 === lines.length)
    return [];
  if (!/^WEBVTT(?:[\t ].*)?$/.test(lines[index2].trim()) || lines[index2].includes("-->"))
    invalid(index2 + 1, "expected WEBVTT header");
  index2++;
  const thumbnails = [];
  while (index2 < lines.length) {
    skipEmpty();
    if (index2 === lines.length)
      break;
    const first = lines[index2].trim();
    if (/^NOTE(?:[\t ]|$)/.test(first) || first === "STYLE" || first === "REGION") {
      while (index2 < lines.length && lines[index2].trim())
        index2++;
      continue;
    }
    const identifierLine = index2 + 1;
    if (!first.includes("-->")) {
      index2++;
      if (index2 === lines.length || !lines[index2].trim())
        invalid(identifierLine, "cue identifier must be followed by timing");
    }
    const timingLine = index2 + 1;
    const timing = lines[index2].trim().match(/^([\d:.]+)[\t ]*-->[\t ]*([\d:.]+)(?:[\t ].*)?$/);
    if (!timing)
      invalid(timingLine, "invalid cue timing");
    const start = timestamp(timing[1], timingLine);
    const end = timestamp(timing[2], timingLine);
    if (end < start)
      invalid(timingLine, "cue end precedes its start");
    index2++;
    skipEmpty();
    if (index2 === lines.length)
      invalid(timingLine, "missing sprite image");
    const image = rectangle(lines[index2].trim(), vttUrl, index2 + 1);
    thumbnails.push({ start: Math.floor(start), end: Math.floor(end), ...image });
    index2++;
  }
  return thumbnails;
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
    if (width <= Number(cue.w) / 2)
      style(control, "left", 0);
    else if (width > progress.clientWidth - Number(cue.w) / 2)
      style(control, "left", `${progress.clientWidth - Number(cue.w)}px`);
    else
      style(control, "left", `${width - Number(cue.w) / 2}px`);
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
    const cue = findThumbnail(thumbnails, second);
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
    const { setStyle, isMobile, addClass } = art.constructor.utils;
    const { $progress } = art.template;
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
const index = Object.assign(artplayerPluginVttThumbnail, { default: artplayerPluginVttThumbnail });
export {
  index as default
};
