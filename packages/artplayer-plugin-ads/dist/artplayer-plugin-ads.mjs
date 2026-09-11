/*!
 * artplayer-plugin-ads.js v2.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function normalizeOptions(input, validate) {
  return validate({
    html: "",
    video: "",
    url: "",
    playDuration: 5,
    totalDuration: 10,
    muted: false,
    i18n: {
      close: "关闭广告",
      countdown: "%s秒",
      detail: "查看详情",
      canBeClosed: "%s秒后可关闭广告"
    },
    ...input
  }, {
    html: "?string",
    video: "?string",
    url: "?string",
    playDuration: "number",
    totalDuration: "number",
    muted: "?boolean",
    i18n: { close: "string", countdown: "string", detail: "string", canBeClosed: "string" }
  });
}
function createCountdown(total, render, complete) {
  let elapsed = 0;
  let ready = false;
  let running = false;
  let closed = false;
  let timer;
  function schedule() {
    if (!ready || !running || closed || timer !== void 0)
      return;
    timer = setTimeout(() => {
      timer = void 0;
      if (closed || !running)
        return;
      elapsed += 1;
      render(elapsed);
      if (closed)
        return;
      if (elapsed >= total())
        complete();
      else
        schedule();
    }, 1e3);
  }
  function pause() {
    running = false;
    if (timer !== void 0)
      clearTimeout(timer);
    timer = void 0;
  }
  return {
    start() {
      if (ready || closed)
        return;
      ready = true;
      running = true;
      schedule();
    },
    play() {
      if (!ready || closed)
        return;
      running = true;
      schedule();
    },
    pause,
    stop() {
      closed = true;
      pause();
    }
  };
}
function report(error) {
  console.warn("Artplayer Ads:", error);
}
function createResources(host) {
  const cleaners = [];
  let closed = false;
  function install(add, remove) {
    if (closed)
      return;
    cleaners.push(remove);
    try {
      add();
    } finally {
      if (closed)
        remove();
    }
  }
  return {
    on(name, callback) {
      const listener = () => {
        if (!closed)
          callback();
      };
      install(() => {
        host.on(name, listener);
      }, () => {
        host.off(name, listener);
      });
    },
    dom(target, name, callback) {
      const listener = () => {
        if (!closed)
          callback();
      };
      install(() => target.addEventListener(name, listener), () => target.removeEventListener(name, listener));
    },
    dispose() {
      if (closed)
        return;
      closed = true;
      for (const clean of cleaners.splice(0).reverse()) {
        try {
          clean();
        } catch (error) {
          report(error);
        }
      }
    }
  };
}
const translate = (value, text) => text.replace("%s", String(value));
function createView(parent, icons, option, utils, own) {
  const { append, query, setStyle } = utils;
  const root = append(parent, '<div class="artplayer-plugin-ads"></div>');
  own(root);
  const content = append(root, option.video ? '<video class="artplayer-plugin-ads-video" loop playsInline></video>' : `<div class="artplayer-plugin-ads-html">${option.html}</div>`);
  const video = option.video ? content : null;
  const loading = append(root, '<div class="artplayer-plugin-ads-loading"></div>');
  append(loading, icons.loading);
  const timer = append(root, `<div class="artplayer-plugin-ads-timer">
    <div class="artplayer-plugin-ads-close"></div>
    <div class="artplayer-plugin-ads-countdown"></div>
  </div>`);
  const close = query(".artplayer-plugin-ads-close", timer);
  const countdown = query(".artplayer-plugin-ads-countdown", timer);
  const control = append(root, `<div class="artplayer-plugin-ads-control">
    <div class="artplayer-plugin-ads-detail">${option.i18n.detail}</div>
    <div class="artplayer-plugin-ads-muted"></div>
    <div class="artplayer-plugin-ads-fullscreen"></div>
  </div>`);
  const detail = query(".artplayer-plugin-ads-detail", control);
  const muted = query(".artplayer-plugin-ads-muted", control);
  const fullscreen = query(".artplayer-plugin-ads-fullscreen", control);
  let canClose = option.playDuration <= 0;
  if (option.playDuration >= option.totalDuration)
    setStyle(close, "display", "none");
  if (!option.url)
    setStyle(detail, "display", "none");
  if (video) {
    append(muted, icons.volume);
    append(muted, icons.volumeClose);
    video.muted = Boolean(option.muted);
    syncMuted();
  } else {
    setStyle(muted, "display", "none");
  }
  append(fullscreen, icons.fullscreenOn);
  append(fullscreen, icons.fullscreenOff);
  function syncMuted() {
    setStyle(icons.volume, "display", video?.muted ? "none" : "inline-flex");
    setStyle(icons.volumeClose, "display", video?.muted ? "inline-flex" : "none");
  }
  function render(elapsed) {
    const remaining = option.playDuration - elapsed;
    canClose = elapsed === 0 ? option.playDuration <= 0 : remaining < 1 || Number.isNaN(remaining);
    close.innerHTML = canClose ? option.i18n.close : translate(remaining, option.i18n.canBeClosed);
    countdown.innerHTML = translate(option.totalDuration - elapsed, option.i18n.countdown);
  }
  render(0);
  return {
    root,
    video,
    render,
    ready() {
      setStyle(timer, "display", "flex");
      setStyle(control, "display", "flex");
      setStyle(loading, "display", "none");
    },
    hide() {
      setStyle(root, "display", "none");
    },
    fullscreen(active) {
      setStyle(icons.fullscreenOn, "display", active ? "none" : "inline-flex");
      setStyle(icons.fullscreenOff, "display", active ? "inline-flex" : "none");
    },
    bind(events, callbacks) {
      events.dom(close, "click", () => {
        if (canClose)
          callbacks.skip();
      });
      events.dom(content, "click", callbacks.click);
      if (option.url)
        events.dom(detail, "click", callbacks.click);
      if (video) {
        events.dom(muted, "click", () => {
          video.muted = !video.muted;
          syncMuted();
        });
      }
      events.dom(fullscreen, "click", callbacks.fullscreen);
    }
  };
}
function createSession(art, option, icons, utils) {
  const events = createResources(art);
  const lifetime = createResources(art);
  const template = art.template;
  let state = "waiting";
  let initialized = false;
  let armed = false;
  let mediaReady = false;
  let root;
  let view;
  const clock = createCountdown(() => option.totalDuration, (time) => view?.render(time), skip);
  const active = () => state === "active" && !art.isDestroy;
  const destroyed = () => state === "destroyed" || art.isDestroy;
  function pauseVideo(video) {
    try {
      video?.pause();
    } catch (error) {
      report(error);
    }
  }
  function requestPlay(start, rejected, late) {
    try {
      Promise.resolve(start()).then(() => {
        if (!active())
          late?.();
      }, rejected).catch(report);
    } catch (error) {
      rejected(error);
    }
  }
  function skip() {
    if (state === "ended" || state === "destroyed" || art.isDestroy)
      return;
    state = "ended";
    clock.stop();
    events.dispose();
    if (initialized) {
      requestPlay(() => art.play(), (error) => {
        if (state !== "destroyed")
          report(error);
      });
      if (destroyed())
        return;
      pauseVideo(view?.video);
      if (destroyed())
        return;
      view?.hide();
    }
    if (!destroyed())
      art.emit("artplayerPluginAds:skip", option);
  }
  function disposeView() {
    const video = view?.video;
    pauseVideo(video);
    if (video) {
      try {
        video.removeAttribute("src");
        video.load();
      } catch (error) {
        report(error);
      }
    }
    try {
      root?.remove();
    } catch (error) {
      report(error);
    } finally {
      if (template.$ads === root)
        delete template.$ads;
    }
  }
  function destroy() {
    if (state === "destroyed")
      return;
    state = "destroyed";
    clock.stop();
    events.dispose();
    lifetime.dispose();
    disposeView();
  }
  function init() {
    if (state !== "waiting" || art.isDestroy)
      return;
    state = "active";
    initialized = true;
    try {
      view = createView(template.$player, icons, option, utils, (node) => {
        root = node;
        template.$ads = node;
      });
      if (!active()) {
        disposeView();
        return;
      }
      art.pause();
      if (!active())
        return;
      const current = view;
      const document2 = root.ownerDocument;
      current.fullscreen(art.fullscreen);
      current.bind(events, {
        skip,
        click() {
          if (option.url)
            (document2.defaultView || window).open(option.url);
          if (active())
            art.emit("artplayerPluginAds:click", option);
        },
        fullscreen() {
          art.fullscreen = !art.fullscreen;
          if (active())
            current.fullscreen(art.fullscreen);
        }
      });
      events.on("fullscreen", () => current.fullscreen(art.fullscreen));
      const visibility = () => document2.hidden ? clock.pause() : clock.play();
      events.dom(document2, "visibilitychange", visibility);
      events.on("document:visibilitychange", visibility);
      const ready = () => {
        if (!active() || mediaReady)
          return;
        mediaReady = true;
        clock.start();
        if (document2.hidden)
          clock.pause();
        if (current.video) {
          const video = current.video;
          requestPlay(() => video.play(), (error) => {
            if (active()) {
              report(error);
              skip();
            }
          }, () => pauseVideo(video));
        }
        if (active())
          current.ready();
      };
      if (current.video) {
        events.dom(current.video, "error", skip);
        events.dom(current.video, "loadedmetadata", ready);
        current.video.src = option.video;
      } else {
        ready();
      }
    } catch (error) {
      destroy();
      throw error;
    }
  }
  try {
    lifetime.on("destroy", destroy);
    events.on("ready", () => {
      if (armed || state !== "waiting")
        return;
      armed = true;
      events.on("play", init);
      events.on("video:playing", init);
    });
    if (art.isDestroy)
      destroy();
  } catch (error) {
    destroy();
    throw error;
  }
  return { name: "artplayerPluginAds", skip, pause: clock.pause, play: clock.play };
}
const style = ".artplayer-plugin-ads {\n  position: absolute;\n  z-index: 150;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  font-size: 13px;\n  line-height: 1;\n  color: #fff;\n  background-color: #000;\n}\n.artplayer-plugin-ads .artplayer-plugin-ads-html {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n.artplayer-plugin-ads .artplayer-plugin-ads-video {\n  width: 100%;\n  height: 100%;\n}\n.artplayer-plugin-ads .artplayer-plugin-ads-timer {\n  display: none;\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}\n.artplayer-plugin-ads .artplayer-plugin-ads-timer > div {\n  display: flex;\n  align-items: center;\n  background-color: rgba(0, 0, 0, 0.5);\n  border-radius: 15px;\n  margin-left: 5px;\n  padding: 5px 10px;\n  cursor: pointer;\n}\n.artplayer-plugin-ads .artplayer-plugin-ads-control {\n  display: none;\n  position: absolute;\n  bottom: 10px;\n  right: 10px;\n}\n.artplayer-plugin-ads .artplayer-plugin-ads-control > div {\n  display: flex;\n  align-items: center;\n  background-color: rgba(0, 0, 0, 0.5);\n  border-radius: 15px;\n  margin-left: 5px;\n  padding: 5px 10px;\n  cursor: pointer;\n}\n.artplayer-plugin-ads .artplayer-plugin-ads-control .art-icon svg {\n  width: 20px;\n  height: 20px;\n}\n.artplayer-plugin-ads .artplayer-plugin-ads-loading {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n}\n";
function artplayerPluginAds(input) {
  return (art) => {
    const constructor = art.constructor;
    if (typeof constructor.validator !== "function" || !["append", "query", "setStyle"].every((name) => typeof Reflect.get(constructor.utils || {}, name) === "function")) {
      throw new Error("Artplayer Ads requires the core validator and DOM utilities");
    }
    const option = normalizeOptions(input, constructor.validator);
    const { volume, volumeClose, fullscreenOn, fullscreenOff, loading } = art.icons;
    return createSession(art, option, { volume, volumeClose, fullscreenOn, fullscreenOff, loading }, constructor.utils);
  };
}
if (typeof document !== "undefined" && !document.getElementById("artplayer-plugin-ads")) {
  const element = document.createElement("style");
  element.id = "artplayer-plugin-ads";
  element.textContent = style;
  document.head.appendChild(element);
}
export {
  artplayerPluginAds as default
};
