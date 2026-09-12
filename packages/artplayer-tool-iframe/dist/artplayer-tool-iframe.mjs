/*!
 * artplayer-tool-iframe.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
const sessionType = "artplayer-tool-iframe:session";
function sessionMetadata(packet) {
  const value = packet.__artplayerIframe;
  if (value?.version === 1 && typeof value.document === "string" && value.document && ["inject", "message", "ack", "leave", "resume", "fragment"].includes(value.phase))
    return value;
}
function withSession(packet, documentId, phase) {
  return { ...packet, __artplayerIframe: { version: 1, document: documentId, phase } };
}
function acceptsMessage(event, peer) {
  if (event.source !== void 0 && event.source !== null && event.source !== peer)
    return false;
  const data = event.data;
  return typeof data === "object" && data !== null && "type" in data && typeof data.type === "string";
}
let session;
function prepareChildSession() {
  if (session?.owner === window.document && session)
    return;
  const random = new Uint32Array(4);
  if (window.crypto?.getRandomValues)
    window.crypto.getRandomValues(random);
  else
    random.forEach((_, index) => random[index] = Math.floor(Math.random() * 4294967296));
  session = { owner: window.document, id: `${Date.now()}-${Array.from(random).join("-")}`, acknowledged: false, lifecycle: false, receivers: /* @__PURE__ */ new Set() };
}
function childEnvelope(packet) {
  if (session && (packet.type === "inject" || session.acknowledged))
    return withSession(packet, session.id, packet.type === "inject" ? "inject" : "message");
  return packet;
}
function consumeChildSession(packet) {
  const metadata = sessionMetadata(packet);
  if (!metadata)
    return false;
  if (packet.type === sessionType) {
    if (session && metadata.document === session.id && metadata.phase === "ack")
      session.acknowledged = true;
    return true;
  }
  return !session || metadata.document !== session.id;
}
function connectChildSession(receiver) {
  const current = session;
  const added = !current.receivers.has(receiver);
  const installing = !current.lifecycle;
  const notify = (phase, data) => {
    if (!current.acknowledged)
      return;
    try {
      window.parent.postMessage(withSession({ type: sessionType, data, id: 0 }, current.id, phase), "*");
    } catch {
    }
  };
  const leave = () => notify("leave");
  const fragment = () => notify("fragment", window.location.href);
  const resume = (event) => {
    if (event.persisted)
      notify("resume");
  };
  try {
    window.addEventListener("message", receiver);
    current.receivers.add(receiver);
    if (!installing)
      return;
    window.addEventListener("pagehide", leave);
    window.addEventListener("pageshow", resume);
    window.addEventListener("hashchange", fragment);
    current.lifecycle = true;
  } catch (error) {
    const cleanups = [];
    if (installing) {
      cleanups.push(() => window.removeEventListener("pagehide", leave));
      cleanups.push(() => window.removeEventListener("pageshow", resume));
      cleanups.push(() => window.removeEventListener("hashchange", fragment));
    }
    if (added)
      cleanups.push(() => window.removeEventListener("message", receiver));
    for (const cleanup of cleanups) {
      try {
        cleanup();
      } catch {
      }
    }
    if (added)
      current.receivers.delete(receiver);
    throw error;
  }
}
const requests = /* @__PURE__ */ new WeakMap();
const boundaries = /* @__PURE__ */ new WeakMap();
let lastId = 0;
function setRequestBoundary(host, boundary) {
  if (boundary)
    boundaries.set(host, boundary);
  else
    boundaries.delete(host);
}
function postRequest(host, { type, data }) {
  return new Promise((resolve, reject) => {
    if (host.destroyed) {
      reject(new Error("The instance has been destroyed"));
      return;
    }
    const pending = requests.get(host) || /* @__PURE__ */ new Set();
    requests.set(host, pending);
    const finish = (request2) => {
      if (!pending.delete(request2))
        return false;
      if (request2.timer !== void 0)
        clearTimeout(request2.timer);
      if (request2.id !== void 0)
        delete host.promises[request2.id];
      if (!pending.size)
        requests.delete(host);
      return true;
    };
    const request = {
      callbacks: {
        resove(value) {
          if (finish(request))
            resolve(value);
        },
        reject(error) {
          if (finish(request))
            reject(error);
        }
      },
      cancel(error) {
        if (finish(request))
          reject(error);
      }
    };
    pending.add(request);
    const loop = () => {
      request.timer = void 0;
      if (!pending.has(request))
        return;
      if (host.destroyed) {
        request.cancel(new Error("The instance has been destroyed"));
        return;
      }
      try {
        boundaries.get(host)?.prepare();
        if (!pending.has(request))
          return;
        if (host.injected) {
          const id = Math.max(Date.now(), lastId + 1);
          lastId = id;
          request.id = id;
          host.promises[id] = request.callbacks;
          const packet = { type, data, id };
          host.$iframe.contentWindow.postMessage(boundaries.get(host)?.envelope(packet) || packet, "*");
        } else {
          request.timer = setTimeout(loop, 200);
        }
      } catch (error) {
        request.cancel(error);
      }
    };
    loop();
  });
}
function cancelRequests(host, reason = new Error("The instance has been destroyed")) {
  const pending = requests.get(host);
  if (!pending)
    return;
  for (const request of [...pending])
    request.cancel(reason);
}
function captureRequests(host) {
  const captured = [...requests.get(host) || []];
  return (reason) => {
    for (const request of captured)
      request.cancel(reason);
  };
}
const navigations = /* @__PURE__ */ new WeakMap();
const withoutHash = (value) => value.split("#")[0];
function sourceOf(host) {
  const frame = host.$iframe;
  return frame.hasAttribute?.("srcdoc") ? `srcdoc:${frame.getAttribute("srcdoc")}` : `src:${withoutHash(frame.src || "")}`;
}
function rawSourceOf(host) {
  const frame = host.$iframe;
  return frame.hasAttribute?.("srcdoc") ? `srcdoc:${frame.getAttribute("srcdoc")}` : `src:${frame.getAttribute?.("src") ?? frame.src ?? ""}`;
}
function invalidate(host, state) {
  if (!state.waiting) {
    if (state.documentId)
      state.cancelPrevious = captureRequests(host);
    else
      cancelRequests(host, new Error("The iframe document has changed"));
  }
  state.waiting = true;
  host.injected = false;
}
function leaveDocument(host, state) {
  if (state.cancelPrevious)
    state.cancelPrevious(new Error("The iframe document has changed"));
  else if (!state.waiting)
    cancelRequests(host, new Error("The iframe document has changed"));
  state.cancelPrevious = void 0;
  state.waiting = true;
  host.injected = false;
}
function sourceChanged(host, state, records) {
  if (sourceOf(host) !== state.source)
    return true;
  if (!state.documentId)
    return false;
  if (rawSourceOf(host) !== state.rawSource)
    return true;
  return records.some((record) => {
    if (record.attributeName === "srcdoc")
      return true;
    if (record.attributeName !== "src" || host.$iframe.hasAttribute?.("srcdoc"))
      return false;
    return true;
  });
}
function observeSource(host, state, records) {
  const rawSource = rawSourceOf(host);
  if (!records.length && rawSource === state.rawSource)
    return;
  const changed = sourceChanged(host, state, records);
  state.rawSource = rawSource;
  state.source = sourceOf(host);
  if (changed)
    invalidate(host, state);
}
function prepareNavigation(host) {
  const state = navigations.get(host);
  if (!state || host.destroyed)
    return;
  const records = state.observer?.takeRecords() || [];
  observeSource(host, state, records);
}
function createNavigation(host) {
  const state = { source: sourceOf(host), rawSource: rawSourceOf(host), hasHandshake: false, waiting: false };
  navigations.set(host, state);
  setRequestBoundary(host, {
    prepare: () => prepareNavigation(host),
    envelope: (packet) => state.documentId ? withSession(packet, state.documentId, "message") : packet
  });
  return {
    start() {
      if (typeof window.MutationObserver !== "function")
        return;
      state.observer = new window.MutationObserver((records) => {
        if (host.destroyed)
          return;
        observeSource(host, state, records);
      });
      state.observer.observe(host.$iframe, { attributes: true, attributeOldValue: true, attributeFilter: ["src", "srcdoc"] });
    },
    dispose() {
      navigations.delete(host);
      setRequestBoundary(host, void 0);
      state.cancelPrevious = void 0;
      state.observer?.disconnect();
    }
  };
}
function activate(host, state, documentId) {
  if (state.hasHandshake && state.documentId !== documentId) {
    if (state.cancelPrevious)
      state.cancelPrevious(new Error("The iframe document has changed"));
    else if (!state.waiting)
      cancelRequests(host, new Error("The iframe document has changed"));
  }
  state.cancelPrevious = void 0;
  state.documentId = documentId;
  state.hasHandshake = true;
  state.waiting = false;
  host.injected = true;
  try {
    host.$iframe.contentWindow?.postMessage(withSession({ type: sessionType, data: void 0, id: 0 }, documentId, "ack"), "*");
  } catch {
  }
}
function consumeNavigation(host, packet) {
  const state = navigations.get(host);
  if (!state)
    return false;
  prepareNavigation(host);
  const metadata = sessionMetadata(packet);
  if (metadata && packet.type === sessionType) {
    if (metadata.phase === "resume") {
      activate(host, state, metadata.document);
    } else if (metadata.document === state.documentId) {
      if (metadata.phase === "leave")
        leaveDocument(host, state);
      else if (metadata.phase === "fragment" && state.cancelPrevious && !host.$iframe.hasAttribute?.("srcdoc") && packet.data === host.$iframe.src)
        activate(host, state, metadata.document);
    }
    return true;
  }
  if (packet.type === "inject") {
    if (metadata?.phase === "inject") {
      if (state.waiting && metadata.document === state.documentId)
        return true;
      activate(host, state, metadata.document);
    } else {
      if (state.waiting) {
        state.cancelPrevious?.(new Error("The iframe document has changed"));
        state.cancelPrevious = void 0;
        state.documentId = void 0;
      }
      state.hasHandshake = true;
      state.waiting = false;
    }
    return false;
  }
  return Boolean(metadata && (state.waiting && !state.cancelPrevious || metadata.document !== state.documentId));
}
const connections = /* @__PURE__ */ new WeakMap();
function connect(host) {
  const owner = window;
  const receiver = host.onMessage;
  const cleanups = [() => owner.removeEventListener("message", receiver)];
  connections.set(host, () => {
    let failed = false;
    let failure;
    for (const cleanup of cleanups) {
      try {
        cleanup();
      } catch (error) {
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
    }
    if (failed)
      throw failure;
  });
  owner.addEventListener("message", receiver);
  host.$iframe.src = host.url;
  const navigation = createNavigation(host);
  cleanups.push(navigation.dispose);
  navigation.start();
}
function releaseConnection(host) {
  const disconnect = connections.get(host);
  connections.delete(host);
  try {
    disconnect?.();
  } finally {
    cancelRequests(host);
  }
}
class ArtplayerToolIframe {
  static get iframe() {
    return window.top !== window;
  }
  static postMessage({ type, data, id = 0 }) {
    if (!ArtplayerToolIframe.iframe) {
      throw new Error('The "ArtplayerToolIframe.postMessage" method can only be used in iframe');
    }
    window.parent.postMessage(
      childEnvelope({
        type,
        data,
        id
      }),
      "*"
    );
  }
  static async onMessage(event) {
    if (!ArtplayerToolIframe.iframe) {
      throw new Error('The "ArtplayerToolIframe.onMessage" method can only be used in iframe');
    }
    if (!acceptsMessage(event, window.parent) || consumeChildSession(event.data))
      return;
    const { type, data, id } = event.data;
    switch (type) {
      case "commit":
        try {
          if (data.match(/\bresolve\((.*?)\)/)) {
            const string = `return new Promise(function(resolve){
${data}
})`;
            const result = await new Function(string)();
            ArtplayerToolIframe.postMessage({ type: "response", data: result, id });
          } else {
            const result = new Function(data)();
            ArtplayerToolIframe.postMessage({ type: "response", data: result, id });
          }
        } catch (error) {
          ArtplayerToolIframe.postMessage({ type: "error", data: error.message, id });
          throw error;
        }
        break;
    }
  }
  static inject() {
    if (!ArtplayerToolIframe.iframe) {
      throw new Error('The "ArtplayerToolIframe.inject" method can only be used in iframe');
    }
    prepareChildSession();
    ArtplayerToolIframe.postMessage({ type: "inject" });
    connectChildSession(ArtplayerToolIframe.onMessage);
  }
  constructor({ iframe, url }) {
    if (iframe instanceof HTMLIFrameElement === false) {
      throw new TypeError('"option.iframe" needs to be a HTMLIFrameElement');
    }
    if (typeof url !== "string") {
      throw new TypeError('"option.url" needs to be a string');
    }
    this.url = url;
    this.$iframe = iframe;
    this.promises = {};
    this.injected = false;
    this.destroyed = false;
    this.messageCallback = () => null;
    this.onMessage = this.onMessage.bind(this);
    try {
      connect(this);
    } catch (error) {
      this.destroyed = true;
      try {
        releaseConnection(this);
      } catch {
      }
      throw error;
    }
  }
  onMessage(event) {
    if (this.destroyed || !acceptsMessage(event, this.$iframe.contentWindow) || consumeNavigation(this, event.data))
      return;
    const { type, data, id } = event.data;
    switch (type) {
      case "inject":
        this.injected = true;
        break;
    }
    if (id !== void 0 && Object.prototype.hasOwnProperty.call(this.promises, id) && this.promises[id]) {
      if (type === "error") {
        this.promises[id].reject(new Error(data));
      } else {
        this.promises[id].resove(data);
      }
      delete this.promises[id];
    }
    if (this.messageCallback) {
      this.messageCallback({ type, data });
    }
  }
  postMessage(message) {
    prepareNavigation(this);
    return postRequest(this, message);
  }
  commit(callback) {
    if (typeof callback !== "function") {
      throw new TypeError('"commit.callback" needs to be a function');
    }
    const callbackString = callback.toString();
    const bodyString = callbackString.substring(callbackString.indexOf("{") + 1, callbackString.lastIndexOf("}"));
    return this.postMessage({ type: "commit", data: bodyString });
  }
  message(callback) {
    if (typeof callback !== "function") {
      throw new TypeError('"message.callback" needs to be a function');
    }
    this.messageCallback = callback;
  }
  destroy() {
    this.destroyed = true;
    releaseConnection(this);
  }
}
export {
  ArtplayerToolIframe as default
};
