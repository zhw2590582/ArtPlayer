/*!
 * artplayer-plugin-chromecast.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
const icon = '<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h17v14h-8M3 11a10 10 0 0 1 10 10M3 16a5 5 0 0 1 5 5"/><circle cx="3" cy="21" r="1" fill="currentColor" stroke="none"/></svg>\r\n';
const mimeTypes = {
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  ogv: "video/ogg",
  mp3: "audio/mp3",
  wav: "audio/wav",
  flv: "video/x-flv",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  wmv: "video/x-ms-wmv",
  mpd: "application/dash+xml",
  m3u8: "application/x-mpegURL"
};
function loadMedia(sdk, session, option, currentUrl) {
  const url = option.url || currentUrl;
  const extension = url.split("?")[0].split("#")[0].split(".").pop().toLowerCase();
  const info = new sdk.media.MediaInfo(url, option.mimeType || mimeTypes[extension] || "application/octet-stream");
  return session.loadMedia(new sdk.media.LoadRequest(info));
}
const DEFAULT_SDK = "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
const pending = /* @__PURE__ */ new WeakMap();
const configured = /* @__PURE__ */ new WeakSet();
function ready(host) {
  const framework = host.cast?.framework;
  const api = host.chrome?.cast;
  if (typeof framework?.CastContext?.getInstance === "function" && framework.CastContextEventType && framework.SessionState && framework.CastState && typeof api?.media?.MediaInfo === "function" && typeof api.media.LoadRequest === "function" && api.AutoJoinPolicy) {
    return { framework, media: api.media, autoJoinPolicy: api.AutoJoinPolicy.ORIGIN_SCOPED };
  }
}
function configure(sdk) {
  const context = sdk.framework.CastContext.getInstance();
  if (!configured.has(context)) {
    context.setOptions({ receiverApplicationId: sdk.media.DEFAULT_MEDIA_RECEIVER_APP_ID, autoJoinPolicy: sdk.autoJoinPolicy });
    configured.add(context);
  }
  return context;
}
function lease(loading, onReady) {
  let subscriber;
  const promise = new Promise((resolve, reject) => {
    subscriber = { ready: onReady, resolve, reject };
    loading.subscribers.add(subscriber);
  });
  let released = false;
  return { promise, release: () => {
    if (released)
      return;
    released = true;
    loading.subscribers.delete(subscriber);
    subscriber.reject(new Error("Cast initialization cancelled"));
    if (!loading.subscribers.size)
      loading.cancel();
  } };
}
function loadSdk(src, onReady) {
  const host = window;
  const loaded = ready(host);
  if (loaded) {
    const promise = new Promise((resolve, reject) => {
      try {
        onReady(loaded);
        resolve(loaded);
      } catch (error) {
        reject(error);
      }
    });
    return { promise, release: () => {
    } };
  }
  const existing = pending.get(host);
  if (existing)
    return lease(existing, onReady);
  const loading = { subscribers: /* @__PURE__ */ new Set(), cancel: () => finish(void 0, new Error("Cast initialization cancelled")) };
  pending.set(host, loading);
  const subscription = lease(loading, onReady);
  const previous = host.__onGCastApiAvailable;
  let script;
  let timer;
  let settled = false;
  function finish(sdk, error) {
    if (settled)
      return;
    settled = true;
    if (timer !== void 0)
      host.clearTimeout(timer);
    pending.delete(host);
    if (host.__onGCastApiAvailable === available)
      host.__onGCastApiAvailable = previous;
    if (script) {
      script.onload = null;
      script.onerror = null;
      if (!sdk)
        script.remove();
    }
    for (const subscriber of loading.subscribers) {
      try {
        if (sdk) {
          subscriber.ready(sdk);
          subscriber.resolve(sdk);
        } else {
          subscriber.reject(error);
        }
      } catch (error2) {
        subscriber.reject(error2);
      }
    }
    loading.subscribers.clear();
  }
  function available(value, errorInfo) {
    try {
      previous?.call(host, value, errorInfo);
    } finally {
      const sdk = value ? ready(host) : void 0;
      finish(sdk, new Error("Cast API is not available"));
    }
  }
  host.__onGCastApiAvailable = available;
  try {
    timer = host.setTimeout(() => finish(void 0, new Error("Timed out initializing Cast API")), 3e4);
    script = document.createElement("script");
    script.src = src || DEFAULT_SDK;
    script.onerror = (error) => finish(void 0, error);
    script.onload = () => {
      const sdk = ready(host);
      if (sdk)
        finish(sdk);
    };
    document.body.appendChild(script);
  } catch (error) {
    finish(void 0, error);
  }
  return subscription;
}
function createController(art, option) {
  let disposed = false;
  let sdk;
  let context;
  let session = null;
  let state = null;
  let activeClick;
  let releaseLoader;
  let generation = 0;
  let operationStarted = false;
  let cancelOperation;
  let cancel;
  const cancelled = new Promise((resolve) => {
    cancel = () => resolve(void 0);
  });
  let element;
  const active = () => !disposed && !art.isDestroy;
  const update = (value) => {
    option.onStateChange?.(value);
    if (!active())
      return;
    const button = element?.querySelector(".art-icon-cast");
    if (button)
      button.style.color = value === "connected" ? "red" : value === "connecting" || value === "disconnecting" ? "orange" : "white";
  };
  const onSession = (event) => {
    if (!active() || !sdk)
      return;
    state = event.sessionState;
    const states = sdk.framework.SessionState;
    if (state === states.NO_SESSION || state === states.SESSION_ENDED || state === states.SESSION_START_FAILED) {
      if (state !== states.NO_SESSION || operationStarted) {
        generation++;
        cancelOperation?.();
      }
      session = null;
      update("disconnected");
    } else {
      if (state === states.SESSION_ENDING || session && event.session && event.session !== session) {
        generation++;
        cancelOperation?.();
      }
      session = event.session || null;
      if (state === states.SESSION_STARTING)
        update("connecting");
      else if (state === states.SESSION_ENDING)
        update("disconnecting");
      else if (state === states.SESSION_STARTED || state === states.SESSION_RESUMED)
        update("connected");
    }
  };
  const onAvailability = (event) => {
    if (!active() || !sdk)
      return;
    const states = sdk.framework.CastState;
    if (event.castState === states.NO_DEVICES_AVAILABLE)
      option.onCastAvailable?.(false);
    else if (event.castState === states.NOT_CONNECTED || event.castState === states.CONNECTING || event.castState === states.CONNECTED)
      option.onCastAvailable?.(true);
  };
  const detach = () => {
    const ownedContext = context;
    const ownedSdk = sdk;
    context = void 0;
    sdk = void 0;
    if (ownedContext && ownedSdk) {
      const events = ownedSdk.framework.CastContextEventType;
      const errors = [];
      try {
        ownedContext.removeEventListener(events.SESSION_STATE_CHANGED, onSession);
      } catch (error) {
        errors.push(error);
      }
      try {
        ownedContext.removeEventListener(events.CAST_STATE_CHANGED, onAvailability);
      } catch (error) {
        errors.push(error);
      }
      if (errors.length)
        throw errors[0];
    }
  };
  const destroy = () => {
    if (disposed)
      return;
    disposed = true;
    cancel();
    const release = releaseLoader;
    releaseLoader = void 0;
    const errors = [];
    for (const cleanup of [release, detach, () => art.off("destroy", destroy)]) {
      try {
        cleanup?.();
      } catch (error) {
        errors.push(error);
      }
    }
    session = null;
    element = void 0;
    if (errors.length)
      throw errors[0];
  };
  async function cast() {
    const epoch = generation;
    const currentOperation = () => active() && generation === epoch;
    let stop;
    const superseded = new Promise((resolve) => {
      stop = () => resolve(void 0);
    });
    cancelOperation = stop;
    let failureNotice = "Failed to initialize Cast API";
    try {
      if (!sdk || !context) {
        const loading = loadSdk(option.sdk, (available) => {
          if (!currentOperation())
            return;
          sdk = available;
          context = configure(sdk);
          if (!currentOperation())
            return;
          const events = sdk.framework.CastContextEventType;
          try {
            context.addEventListener(events.SESSION_STATE_CHANGED, onSession);
            if (active())
              context.addEventListener(events.CAST_STATE_CHANGED, onAvailability);
          } catch (error) {
            try {
              detach();
            } catch {
            }
            throw error;
          }
        });
        releaseLoader = loading.release;
        await Promise.race([loading.promise, cancelled, superseded]);
        loading.release();
        releaseLoader = void 0;
      }
      if (!currentOperation() || !context || !sdk)
        return;
      failureNotice = "Error connecting to cast session";
      operationStarted = true;
      let current = context.getCurrentSession();
      if (!currentOperation())
        return;
      if (!current) {
        await Promise.race([context.requestSession(), cancelled, superseded]);
        if (!currentOperation())
          return;
        current = context.getCurrentSession();
      }
      if (!currentOperation())
        return;
      if (!current)
        throw new Error("No active Cast session");
      session = current;
      failureNotice = "Error casting media";
      await Promise.race([loadMedia(sdk, current, option, art.option.url), cancelled, superseded]);
      if (currentOperation()) {
        art.notice.show = "Casting started";
        option.onCastStart?.();
      }
    } catch (error) {
      if (currentOperation()) {
        art.notice.show = failureNotice;
        option.onError?.(error);
        throw error;
      }
    } finally {
      releaseLoader?.();
      releaseLoader = void 0;
      if (cancelOperation === stop)
        cancelOperation = void 0;
      operationStarted = false;
    }
  }
  const click = () => {
    if (!active())
      return Promise.resolve();
    if (!activeClick) {
      let resolve;
      let reject;
      activeClick = new Promise((yes, no) => {
        resolve = yes;
        reject = no;
      });
      activeClick.catch(() => {
      });
      cast().then(() => {
        activeClick = void 0;
        resolve();
      }, (error) => {
        activeClick = void 0;
        reject(error);
      });
    }
    return activeClick;
  };
  art.controls.add({
    name: "chromecast",
    position: "right",
    tooltip: "Chromecast",
    html: `<i class="art-icon art-icon-cast">${option.icon || icon}</i>`,
    mounted(control) {
      if (active())
        element = control;
    },
    click
  });
  art.on("destroy", destroy);
  if (art.isDestroy)
    destroy();
  return { name: "artplayerPluginChromecast", getCastState: () => state, isCasting: () => session !== null };
}
function artplayerPluginChromecast(option) {
  return async (art) => createController(art, option);
}
Object.defineProperty(artplayerPluginChromecast, "default", { value: artplayerPluginChromecast, writable: true, configurable: true });
export {
  artplayerPluginChromecast as default
};
