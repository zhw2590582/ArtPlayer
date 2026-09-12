/*!
 * artplayer-plugin-document-pip.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function releaseAll(releases) {
  const errors = [];
  for (const release of releases) {
    try {
      release();
    } catch (error) {
      errors.push(error);
    }
  }
  return errors;
}
function createDelay() {
  let finish;
  const promise = new Promise((resolve) => {
    finish = resolve;
  });
  let timer = setTimeout(() => {
    timer = null;
    finish();
  }, 100);
  return {
    promise,
    cancel() {
      if (timer !== null)
        clearTimeout(timer);
      timer = null;
      finish();
    }
  };
}
function createControl(art, toggle, alive) {
  const utils = art.constructor.utils;
  const releases = [];
  let closed = false;
  return {
    mount() {
      if (closed || !alive())
        return;
      releases.push(() => art.controls.remove("document-pip"));
      art.controls.add({
        name: "document-pip",
        position: "right",
        index: 40,
        tooltip: art.i18n.get("PIP Mode"),
        mounted: (control) => {
          if (closed || !alive())
            return;
          utils.append(control, art.icons.pip);
          const click = () => {
            if (alive())
              toggle();
          };
          releases.push(() => control.removeEventListener("click", click));
          const unbind = art.proxy(control, "click", click);
          if (closed)
            unbind();
          else
            releases.push(unbind);
          if (closed || !alive())
            return;
          const update = (active) => {
            if (alive())
              utils.tooltip(control, art.i18n.get(active ? "Exit PIP Mode" : "PIP Mode"));
          };
          releases.push(() => art.off("document-pip", update));
          art.on("document-pip", update);
        }
      });
      if (closed)
        art.controls.remove("document-pip");
    },
    destroy() {
      if (closed)
        return;
      closed = true;
      const errors = releaseAll(releases.splice(0).reverse());
      if (errors.length)
        throw errors[0];
    }
  };
}
const style = ".artplayer-document-pip.art-video-player {\n  width: 100% !important;\n  height: 100% !important;\n}\n";
function installStyle(document2) {
  const id = "artplayer-plugin-document-pip";
  const existing = document2.getElementById(id);
  if (existing) {
    existing.textContent = style;
    return;
  }
  const element = document2.createElement("style");
  element.id = id;
  element.textContent = style;
  const insert = () => {
    document2.removeEventListener("DOMContentLoaded", insert);
    const current = document2.getElementById(id);
    if (current)
      current.textContent = style;
    else
      (document2.head || document2.documentElement).appendChild(element);
  };
  if (document2.readyState === "loading")
    document2.addEventListener("DOMContentLoaded", insert);
  else
    insert();
}
function copyStyles(source, target, own, alive) {
  const append = (node) => {
    if (!alive())
      return;
    own(node);
    target.head.appendChild(node);
    if (!alive())
      node.remove();
  };
  const base = target.createElement("style");
  base.textContent = `
    html, body { margin:0; padding:0; width:100%; height:100%; background:#000; overflow:hidden; }
    #__art_dpip_root { position:absolute; inset:0; display:flex; }
    #__art_dpip_root > * { width:100% !important; height:100% !important; }
  `;
  append(base);
  if (!target.querySelector('meta[name="viewport"]')) {
    const meta = target.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width,initial-scale=1";
    append(meta);
  }
  try {
    source.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const clone = target.createElement("link");
      clone.rel = "stylesheet";
      clone.href = link.href;
      if (link.media)
        clone.media = link.media;
      if (link.crossOrigin)
        clone.crossOrigin = link.crossOrigin;
      if (link.referrerPolicy)
        clone.referrerPolicy = link.referrerPolicy;
      append(clone);
    });
  } catch {
  }
  try {
    source.querySelectorAll("style").forEach((element) => {
      const clone = target.createElement("style");
      clone.textContent = element.textContent;
      append(clone);
    });
  } catch {
  }
}
function createProjection(player, target, text) {
  const source = player.ownerDocument;
  const parent = player.parentNode;
  const next = player.nextSibling;
  if (!parent)
    throw new Error("Document Picture-in-Picture requires a mounted player");
  const placeholder = source.createElement("div");
  placeholder.className = "artplayer-document-pip-placeholder";
  placeholder.style.cssText = "display:flex;justify-content:center;align-items:center;width:100%;height:100%;";
  placeholder.textContent = text ?? "";
  const root = target.createElement("div");
  root.id = "__art_dpip_root";
  const nodes = [];
  let closed = false;
  const restore = () => {
    const anchor = placeholder.parentNode === parent ? placeholder : next?.parentNode === parent ? next : null;
    if (player.parentNode !== parent || player.nextSibling !== anchor) {
      try {
        parent.insertBefore(player, anchor);
      } catch (error) {
        source.body.appendChild(player);
        throw error;
      }
    }
  };
  const cleanup = () => {
    const errors = releaseAll([restore, () => placeholder.remove(), ...nodes.splice(0).map((node) => () => node.remove()), () => root.remove()]);
    if (errors.length)
      throw errors[0];
  };
  return {
    mount() {
      if (closed)
        return;
      parent.insertBefore(placeholder, next?.parentNode === parent ? next : null);
      if (!closed)
        target.body.appendChild(root);
      if (!closed)
        copyStyles(source, target, (node) => nodes.push(node), () => !closed);
      if (!closed) {
        const adopted = target.adoptNode(player);
        if (!closed)
          root.appendChild(adopted);
      }
      if (closed)
        cleanup();
    },
    destroy() {
      if (closed)
        return;
      closed = true;
      cleanup();
    }
  };
}
function createWindowSession(hooks) {
  let destroyed = false;
  let revision = 0;
  let session = null;
  let pending = null;
  let delay = null;
  const alive = () => !destroyed && hooks.alive();
  const valid = (value) => value === revision && alive();
  function invalidate() {
    revision++;
    pending?.finish();
    pending = null;
    delay?.cancel();
    delay = null;
  }
  function dispose(current) {
    const errors = releaseAll(current.releases.splice(0));
    errors.push(...releaseAll([() => current.window.close()]));
    return errors;
  }
  async function resizeLater(value) {
    if (!valid(value))
      return;
    const current = createDelay();
    delay = current;
    await current.promise;
    if (delay === current)
      delay = null;
    if (valid(value))
      hooks.resize();
  }
  async function close() {
    invalidate();
    const value = revision;
    const current = session;
    session = null;
    if (!current)
      return;
    const errors = dispose(current);
    if (current.announced) {
      try {
        hooks.activate(false);
      } catch (error) {
        errors.push(error);
      }
    }
    if (errors.length && alive())
      hooks.report("close", errors[0]);
    if (valid(value))
      await resizeLater(value);
  }
  async function open() {
    if (!alive() || session)
      return;
    if (pending)
      return pending.promise;
    invalidate();
    const value = revision;
    let finish;
    let reject;
    const promise = new Promise((resolve, fail) => {
      finish = resolve;
      reject = fail;
    });
    const ticket = { promise, finish };
    pending = ticket;
    const settle = () => {
      if (pending === ticket)
        pending = null;
      finish();
    };
    const failed = (error) => {
      if (valid(value)) {
        const current = session;
        session = null;
        if (current) {
          dispose(current);
          if (current.announced)
            releaseAll([() => hooks.activate(false)]);
        }
        try {
          hooks.report("open", error);
        } catch (noticeError) {
          reject(noticeError);
        }
      }
    };
    const receive = async (window2) => {
      if (!valid(value)) {
        if (session?.window !== window2)
          releaseAll([() => window2.close()]);
        return;
      }
      const current = { window: window2, releases: [], announced: false };
      session = current;
      try {
        const projection = hooks.project(window2.document);
        current.releases.push(projection.destroy);
        projection.mount();
        if (!valid(value)) {
          dispose(current);
          return;
        }
        for (const [event, callback] of [["resize", () => {
          if (valid(value))
            hooks.nativeResize();
        }], ["pagehide", () => {
          void close();
        }], ["unload", () => {
          void close();
        }]]) {
          current.releases.unshift(() => window2.removeEventListener(event, callback));
          window2.addEventListener(event, callback);
          if (!valid(value)) {
            dispose(current);
            return;
          }
        }
        current.announced = true;
        hooks.activate(true);
        await resizeLater(value);
      } catch (error) {
        failed(error);
      }
    };
    try {
      const request = hooks.request();
      void Promise.resolve(request).then(receive, failed).then(settle, (error) => {
        if (valid(value))
          reject(error);
        settle();
      });
    } catch (error) {
      try {
        failed(error);
      } finally {
        settle();
      }
    }
    return promise;
  }
  return {
    get active() {
      return session !== null;
    },
    get opening() {
      return pending !== null;
    },
    open,
    close,
    destroy() {
      if (destroyed)
        return;
      destroyed = true;
      void close().catch(() => {
      });
    }
  };
}
function artplayerPluginDocumentPip(userOptions = {}) {
  const options = { width: 480, height: 270, fallbackToVideoPiP: true, placeholder: "Playing in Document Picture-in-Picture", ...userOptions };
  return (art) => {
    const browser = window;
    const isSupported = "documentPictureInPicture" in browser && typeof browser.documentPictureInPicture?.requestWindow === "function";
    let host = art;
    let player = art.template.$player;
    let closed = art.isDestroy;
    const utils = art.constructor.utils;
    const alive = () => !closed && !!host && !host.isDestroy;
    const session = createWindowSession({
      alive,
      request: () => browser.documentPictureInPicture.requestWindow({ width: options.width, height: options.height }),
      project: (document2) => createProjection(player, document2, options.placeholder),
      activate(active) {
        if (!host || !player)
          return;
        if (active)
          utils.addClass(player, "artplayer-document-pip");
        else
          utils.removeClass(player, "artplayer-document-pip");
        if (!alive())
          return;
        host.events.bindGlobalEvents?.();
        if (alive())
          host.emit("document-pip", active);
      },
      resize: () => {
        if (alive())
          host.emit("resize");
      },
      nativeResize: () => {
        if (alive())
          host.resize?.();
      },
      report(action, error) {
        if (!alive())
          return;
        host.notice.show = `Document Picture-in-Picture ${action} failed`;
        console.warn(`[artplayer-plugin-document-pip] ${action} failed:`, error);
      }
    });
    async function open() {
      if (!alive())
        return;
      if (!isSupported && options.fallbackToVideoPiP) {
        host.pip = true;
        console.warn("[artplayer-plugin-document-pip] Document Picture-in-Picture is not supported, falling back to Video Picture-in-Picture");
        return;
      }
      return session.open();
    }
    function toggle() {
      if (!alive())
        return;
      if (session.active || session.opening)
        void session.close();
      else
        void open();
    }
    let control = createControl(art, toggle, alive);
    function destroy() {
      if (closed)
        return;
      closed = true;
      const current = host;
      const previousControl = control;
      control = null;
      const errors = releaseAll([session.destroy, () => previousControl?.destroy(), () => current?.off("destroy", destroy)]);
      host = null;
      player = null;
      if (errors.length)
        console.warn("[artplayer-plugin-document-pip] cleanup failed:", errors[0]);
    }
    const result = {
      name: "artplayerPluginDocumentPip",
      get isSupported() {
        return isSupported;
      },
      get isActive() {
        return session.active;
      },
      open,
      close: session.close,
      toggle
    };
    if (closed) {
      host = null;
      player = null;
      return result;
    }
    try {
      art.on("destroy", destroy);
      if (alive())
        control?.mount();
      else
        art.off("destroy", destroy);
    } catch (error) {
      destroy();
      throw error;
    }
    return result;
  };
}
if (typeof document !== "undefined")
  installStyle(document);
export {
  artplayerPluginDocumentPip as default
};
