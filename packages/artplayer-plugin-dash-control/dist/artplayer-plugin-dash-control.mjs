/*!
 * artplayer-plugin-dash-control.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
const $audio = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="18"><path fill="#fff" d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80l0-16 0-48 0-48C0 146.6 114.6 32 256 32s256 114.6 256 256l0 48 0 48 0 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"/></svg>';
function qualityAdapter(dash) {
  const modern = typeof dash.getRepresentationsByType === "function";
  return {
    levels: () => modern ? dash.getRepresentationsByType("video") : dash.getBitrateInfoListFor("video"),
    current(levels) {
      if (modern)
        return dash.getCurrentRepresentationForType("video");
      const quality = dash.getQualityFor("video");
      return levels.find((level) => level.qualityIndex === quality);
    },
    item(level, index, selected, automatic) {
      return modern ? { value: index, id: level.id, default: !automatic && selected != null && level.id === selected.id } : { value: level.qualityIndex, default: !automatic && selected != null && level.qualityIndex === selected.qualityIndex };
    },
    select(item, valid) {
      const automatic = item.value === "auto";
      dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: automatic } } } });
      if (!automatic && valid()) {
        if (modern)
          dash.setRepresentationForTypeById("video", item.id);
        else
          dash.setQualityFor("video", item.value);
      }
    }
  };
}
function uniqueLabels(items) {
  const seen = /* @__PURE__ */ new Map();
  return items.filter((item) => {
    if (item.html === void 0)
      return true;
    const first = seen.get(item.html);
    if (first) {
      if (item.default)
        Object.assign(first, item);
      return false;
    }
    seen.set(item.html, item);
    return true;
  });
}
function qualityModel(dash, config, active) {
  const adapter = qualityAdapter(dash);
  const levels = adapter.levels();
  if (!active() || !levels?.length)
    return null;
  const auto = config.auto || "Auto";
  const getName = config.getName || ((level) => `${level.height}p`);
  const selected = adapter.current(levels);
  if (!active())
    return null;
  const automatic = dash.getSettings().streaming.abr.autoSwitchBitrate.video;
  if (!active())
    return null;
  const html = !automatic && selected ? getName(selected) : auto;
  if (!active())
    return null;
  const items = [];
  for (const [index, level] of levels.entries()) {
    const label = getName(level);
    if (!active())
      return null;
    items.push({ html: label, ...adapter.item(level, index, selected, automatic) });
  }
  const selector = uniqueLabels(items).sort((left, right) => right.value - left.value);
  selector.push({ html: auto, value: "auto", default: automatic });
  return { html, title: config.title || "Quality", selector, select: adapter.select };
}
function selectedTrack(tracks, current) {
  if (tracks.includes(current))
    return current;
  if (current.id == null && current.index == null)
    return void 0;
  const fields = ["id", "index", "lang"];
  const matching = tracks.filter((track) => fields.every((key) => current[key] == null || track[key] === current[key]));
  return matching.length === 1 ? matching[0] : void 0;
}
function audioModel(dash, config, active) {
  const tracks = dash.getTracksFor("audio");
  if (!active() || !tracks?.length)
    return null;
  const auto = config.auto || "Auto";
  const getName = config.getName || ((track) => track.lang || track.id);
  const current = dash.getCurrentTrackFor("audio") || tracks[0];
  if (!active())
    return null;
  const html = current ? getName(current) : auto;
  if (!active())
    return null;
  const selected = selectedTrack(tracks, current);
  const items = [];
  for (const track of tracks) {
    const label = getName(track);
    if (!active())
      return null;
    items.push({ html: label, value: track, default: track === selected });
  }
  const selector = uniqueLabels(items);
  return { html, title: config.title || "Audio", selector, select: (item) => dash.setCurrentTrack(item.value) };
}
function createMenu(art, name, icon) {
  let current;
  const owned = /* @__PURE__ */ new Map();
  function remove(surface, callback = owned.get(surface)) {
    if (!callback || owned.get(surface) !== callback)
      return;
    owned.delete(surface);
    const registry = art[surface];
    if (surface === "controls" && registry.cache?.get && registry.cache.get(name)?.option?.onSelect !== callback)
      return;
    if (surface === "setting" && registry.find && registry.find(name)?.onSelect !== callback)
      return;
    registry.remove(name);
  }
  function clear() {
    current = void 0;
    let failure;
    for (const [surface, callback] of [...owned]) {
      try {
        remove(surface, callback);
      } catch (error) {
        failure || (failure = error);
      }
    }
    if (failure)
      throw failure;
  }
  function update(config, model, active) {
    if (!model) {
      clear();
      return;
    }
    const state = {};
    current = state;
    const valid = () => state === current && active();
    const onSelect = (item) => {
      if (!valid())
        return item.html;
      model.select(item, valid);
      if (!valid())
        return item.html;
      art.notice.show = `${model.title}: ${item.html}`;
      if (valid() && config.control)
        art.controls.check(item);
      if (valid() && config.setting)
        art.setting.check(item);
      return item.html;
    };
    if (config.control) {
      owned.set("controls", onSelect);
      art.controls.update({ name, position: "right", html: model.html, style: { padding: "0 10px" }, selector: model.selector, onSelect });
    } else {
      remove("controls");
    }
    if (!valid())
      return;
    if (config.setting) {
      owned.set("setting", onSelect);
      art.setting.update({ name, tooltip: model.html, html: model.title, icon, width: 200, selector: model.selector, onSelect });
    } else {
      remove("setting");
    }
  }
  return { update, clear };
}
const $quality = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="18"><path fill="#fff" d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l96 0 32 0 208 0c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>';
function observeSDK(options) {
  let binding;
  const active = (record) => binding === record && options.active(record.dash);
  const automatic = (record) => record.dash.getSettings().streaming.abr.autoSwitchBitrate.video;
  function release() {
    const record = binding;
    if (!record)
      return;
    binding = void 0;
    record.epoch++;
    let failure;
    for (const [name, callback] of record.callbacks.splice(0)) {
      try {
        record.off.call(record.dash, name, callback);
      } catch (error) {
        failure || (failure = error);
      }
    }
    if (failure)
      throw failure;
  }
  function fail(record, error) {
    if (binding === record) {
      try {
        release();
      } catch (cleanupError) {
        console.warn("ArtPlayer DASH subscription cleanup failed:", cleanupError);
      }
      if (!binding && options.active(record.dash)) {
        try {
          options.reset();
        } catch (cleanupError) {
          console.warn("ArtPlayer DASH cleanup failed:", cleanupError);
        }
      }
    }
    console.warn("ArtPlayer DASH refresh failed:", error);
  }
  function schedule(record) {
    if (!active(record) || record.suspended || record.queued || record.running)
      return;
    record.queued = true;
    const epoch = record.epoch;
    void Promise.resolve().then(() => {
      if (!active(record) || record.epoch !== epoch || record.suspended)
        return;
      record.queued = false;
      record.running = true;
      try {
        record.automatic = automatic(record);
        if (active(record))
          options.refresh();
      } catch (error) {
        fail(record, error);
      } finally {
        record.running = false;
      }
    });
  }
  function bind(dash) {
    const previous = binding;
    if (previous?.dash === dash) {
      const value = automatic(previous);
      if (active(previous)) {
        previous.automatic = value;
        previous.suspended = false;
      }
      return;
    }
    release();
    if (binding || !options.active(dash) || typeof dash.on !== "function" || typeof dash.off !== "function")
      return;
    const record = { dash, off: dash.off, callbacks: [], epoch: 0, queued: false, running: false, suspended: false, automatic: false };
    binding = record;
    const on = dash.on;
    try {
      record.automatic = automatic(record);
      const changed = ["qualityChangeRequested", "qualityChangeRendered", "trackChangeRendered", "streamUpdated", "streamInitialized"];
      const entries = changed.map((name) => [name, () => {
        if (name === "streamUpdated" || name === "streamInitialized")
          record.suspended = false;
        schedule(record);
      }]);
      entries.push(["playbackTimeUpdated", () => {
        if (!active(record) || record.suspended)
          return;
        try {
          const value = automatic(record);
          if (active(record) && value !== record.automatic) {
            record.automatic = value;
            schedule(record);
          }
        } catch (error) {
          fail(record, error);
        }
      }]);
      entries.push(["streamTeardownComplete", () => {
        if (!active(record))
          return;
        record.epoch++;
        record.queued = false;
        record.suspended = true;
        try {
          options.reset();
        } catch (error) {
          fail(record, error);
        }
      }]);
      for (const entry of entries) {
        if (!active(record))
          break;
        record.callbacks.push(entry);
        on.call(dash, ...entry);
      }
    } catch (error) {
      if (binding === record) {
        try {
          release();
        } catch (cleanupError) {
          console.warn("ArtPlayer DASH subscription cleanup failed:", cleanupError);
        }
      }
      throw error;
    }
  }
  return { bind, release };
}
function artplayerPluginDashControl(option = {}) {
  return (player) => {
    const art = player;
    const { $video } = art.template;
    const { errorHandle } = art.constructor.utils;
    let closed = false;
    let revision = 0;
    const quality = createMenu(art, "dash-quality", $quality);
    const audio = createMenu(art, "dash-audio", $audio);
    const subscriptions = [];
    const observer = observeSDK({
      active: (dash) => !closed && !art.isDestroy && art.dash === dash,
      refresh: update,
      reset() {
        const version = ++revision;
        clear(() => version === revision);
      }
    });
    function clear(current = () => true) {
      let failure;
      for (const cleanup of [quality.clear, audio.clear]) {
        if (!current())
          break;
        try {
          cleanup();
        } catch (error) {
          failure || (failure = error);
        }
      }
      if (failure)
        throw failure;
    }
    function update() {
      if (closed || art.isDestroy)
        return;
      const version = ++revision;
      const dash = art.dash;
      const current = () => !closed && !art.isDestroy && version === revision && art.dash === dash;
      const valid = () => current() && dash.getVideoElement() === $video && current();
      try {
        errorHandle(dash.getVideoElement() === $video, 'Cannot find instance of DASH from "art.dash"');
        if (!current())
          return;
        observer.bind(dash);
        if (!valid())
          return;
        const qualityConfig = option.quality || {};
        const qualities = qualityModel(dash, qualityConfig, valid);
        if (!valid())
          return;
        quality.update(qualityConfig, qualities, valid);
        if (!valid())
          return;
        const audioConfig = option.audio || {};
        const tracks = audioModel(dash, audioConfig, valid);
        if (valid())
          audio.update(audioConfig, tracks, valid);
      } catch (error) {
        if (current()) {
          const cleanupVersion = ++revision;
          for (const cleanup of [observer.release, () => clear(() => revision === cleanupVersion)]) {
            try {
              cleanup();
            } catch (cleanupError) {
              console.warn("ArtPlayer DASH cleanup failed:", cleanupError);
            }
          }
        }
        throw error;
      }
    }
    function destroy() {
      if (closed)
        return;
      closed = true;
      revision++;
      let failure;
      const actions = [observer.release, clear, ...subscriptions.splice(0).map(([name, callback]) => () => art.off(name, callback))];
      for (const action of actions) {
        try {
          action();
        } catch (error) {
          failure || (failure = error);
        }
      }
      if (failure)
        throw failure;
    }
    try {
      const entries = [["ready", update], ["restart", update], ["destroy", destroy]];
      for (const entry of entries) {
        if (closed)
          break;
        subscriptions.push(entry);
        art.on(...entry);
      }
    } catch (error) {
      try {
        destroy();
      } catch (cleanupError) {
        console.warn("ArtPlayer DASH subscription cleanup failed:", cleanupError);
      }
      throw error;
    }
    return { name: "artplayerPluginDashControl", update };
  };
}
export {
  artplayerPluginDashControl as default
};
