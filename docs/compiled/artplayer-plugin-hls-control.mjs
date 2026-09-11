/*!
 * artplayer-plugin-hls-control.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
const $audio = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="18"><path fill="#fff" d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80l0-16 0-48 0-48C0 146.6 114.6 32 256 32s256 114.6 256 256l0 48 0 48 0 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"/></svg>';
function uniqueLabels(items) {
  const seen = /* @__PURE__ */ new Map();
  return items.filter((item) => {
    if (item.html === void 0)
      return true;
    const first = seen.get(item.html);
    if (first) {
      if (item.default) {
        first.default = true;
        first.value = item.value;
      }
      return false;
    }
    seen.set(item.html, item);
    return true;
  });
}
function qualitySelection(hls) {
  return hls.autoLevelEnabled === true ? -1 : hls.currentLevel;
}
function qualityModel(hls, config) {
  if (!hls.levels.length)
    return null;
  const auto = config.auto || "Auto";
  const getName = config.getName || ((level2) => level2.name || `${level2.height}P`);
  const selected = qualitySelection(hls);
  const level = hls.levels[selected];
  const html = level ? getName(level) : auto;
  const selector = uniqueLabels(hls.levels.map((item, index) => ({ html: getName(item, index), value: index, default: selected === index }))).sort((a, b) => b.value - a.value);
  selector.push({ html: auto, value: -1, default: selected === -1 });
  return { html, title: config.title || "Quality", selector };
}
function audioModel(hls, config) {
  if (!hls.audioTracks.length)
    return null;
  const auto = config.auto || "Auto";
  const getName = config.getName || ((track2) => track2.name || track2.lang || track2.language);
  const track = hls.audioTracks[hls.audioTrack];
  const html = track ? getName(track) : auto;
  const selector = uniqueLabels(hls.audioTracks.map((item, index) => ({ html: getName(item, index), value: item.id, default: hls.audioTrack === item.id })));
  return { html, title: config.title || "Audio", selector };
}
function createMenu(art, name, field, icon, active, select) {
  let current;
  const owned = { control: false, setting: false };
  function remove(surface) {
    if (!owned[surface])
      return;
    owned[surface] = false;
    art[surface === "control" ? "controls" : "setting"].remove(name);
  }
  function clear() {
    current = void 0;
    remove("control");
    remove("setting");
  }
  function check(state, item) {
    for (const entry of state.model.selector)
      entry.default = entry === item;
    if (state.config.control)
      art.controls.check(item);
    if (state !== current || !active(state.hls))
      return;
    if (state.config.setting)
      art.setting.check(item);
  }
  function update(hls, config, model, force) {
    if (!model) {
      clear();
      return;
    }
    const previous = current;
    const selectedIndex = model.selector.findIndex((item) => item.default);
    const reusable = !force && previous?.hls === hls && previous.model.title === model.title && (selectedIndex !== -1 || !previous.model.selector.some((item) => item.default) && previous.model.html === model.html) && owned.control === Boolean(config.control) && owned.setting === Boolean(config.setting) && previous.model.selector.length === model.selector.length && previous.model.selector.every((item, index) => item.html === model.selector[index].html && item.value === model.selector[index].value);
    if (reusable) {
      previous.config = config;
      const target = previous.model.selector[selectedIndex];
      if (target && (!target.default || previous.model.html !== model.html)) {
        previous.model.html = model.html;
        check(previous, target);
      }
      return;
    }
    const state = { hls, config, model };
    current = state;
    const valid = () => current === state && active(hls);
    const onSelect = (item) => select(() => {
      if (!valid())
        return item.html;
      hls[field] = item.value;
      if (!valid())
        return item.html;
      model.html = item.html;
      art.notice.show = `${model.title}: ${item.html}`;
      if (valid())
        check(state, item);
      return item.html;
    });
    if (config.control) {
      owned.control = true;
      art.controls.update({ name, position: "right", html: model.html, style: { padding: "0 10px" }, selector: model.selector, onSelect });
    } else {
      remove("control");
    }
    if (!valid())
      return;
    if (config.setting) {
      owned.setting = true;
      art.setting.update({ name, tooltip: model.html, html: model.title, icon, width: 200, selector: model.selector, onSelect });
    } else {
      remove("setting");
    }
  }
  function invalidate() {
    current = void 0;
  }
  return { update, clear, invalidate };
}
const $quality = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="18"><path fill="#fff" d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l96 0 32 0 208 0c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>';
function subscribeHls(hls, refresh, destroyed) {
  const events = hls.constructor?.Events;
  if (!events || typeof hls.on !== "function" || typeof hls.off !== "function")
    return () => {
    };
  const subscriptions = [];
  let active = true;
  function release() {
    if (!active)
      return;
    active = false;
    for (const [event, callback] of subscriptions)
      hls.off(event, callback);
    subscriptions.length = 0;
  }
  try {
    for (const key of ["MANIFEST_PARSED", "LEVELS_UPDATED", "LEVEL_SWITCHED", "AUDIO_TRACKS_UPDATED", "AUDIO_TRACK_SWITCHED", "DESTROYING"]) {
      const event = events[key];
      if (typeof event !== "string" || subscriptions.some(([name]) => name === event))
        continue;
      const callback = () => {
        if (!active)
          return;
        if (key === "DESTROYING")
          destroyed();
        else
          refresh();
      };
      subscriptions.push([event, callback]);
      hls.on(event, callback);
    }
  } catch (error) {
    release();
    throw error;
  }
  return release;
}
function artplayerPluginHlsControl(option = {}) {
  return (art) => {
    const { $video } = art.template;
    const { errorHandle } = art.constructor.utils;
    let closed = false;
    let revision = 0;
    let engine;
    let unsubscribe = () => {
    };
    let selecting = 0;
    let pending;
    const retired = /* @__PURE__ */ new WeakSet();
    const active = (hls) => !closed && !retired.has(hls) && art.hls === hls && hls.media === $video;
    const quality = createMenu(art, "hls-quality", "currentLevel", $quality, active, select);
    const audio = createMenu(art, "hls-audio", "audioTrack", $audio, active, select);
    function select(callback) {
      selecting++;
      let succeeded = false;
      try {
        const result = callback();
        succeeded = true;
        return result;
      } finally {
        selecting--;
        if (!selecting) {
          const hls = pending;
          pending = void 0;
          if (succeeded && hls)
            refresh(hls, false);
        }
      }
    }
    function refresh(hls, force) {
      if (!active(hls))
        return;
      const version = ++revision;
      const config = option.quality || {};
      const model = qualityModel(hls, config);
      if (!active(hls) || version !== revision)
        return;
      quality.update(hls, config, model, force);
      if (!active(hls) || version !== revision)
        return;
      const audioConfig = option.audio || {};
      const audioView = audioModel(hls, audioConfig);
      if (active(hls) && version === revision)
        audio.update(hls, audioConfig, audioView, force);
    }
    function update() {
      if (closed)
        return;
      const hls = art.hls;
      errorHandle(hls?.media === $video, 'Cannot find instance of HLS from "art.hls"');
      if (retired.has(hls))
        return;
      if (engine !== hls) {
        unsubscribe();
        engine = hls;
        try {
          unsubscribe = subscribeHls(hls, () => {
            if (selecting)
              pending = hls;
            else
              refresh(hls, false);
          }, () => {
            retired.add(hls);
            unsubscribe();
            if (engine === hls) {
              engine = void 0;
              if (!closed) {
                quality.clear();
                audio.clear();
              }
            }
          });
        } catch (error) {
          engine = void 0;
          throw error;
        }
      }
      refresh(hls, true);
    }
    function destroy() {
      if (closed)
        return;
      closed = true;
      revision++;
      pending = void 0;
      quality.invalidate();
      audio.invalidate();
      unsubscribe();
      art.off("ready", update);
      art.off("restart", update);
      art.off("destroy", destroy);
    }
    art.on("ready", update);
    art.on("restart", update);
    art.on("destroy", destroy);
    return { name: "artplayerPluginHlsControl", update };
  };
}
export {
  artplayerPluginHlsControl as default
};
