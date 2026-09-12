/*!
 * artplayer-tool-iframe.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
const requests = /* @__PURE__ */ new WeakMap();
let lastId = 0;
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
      }
    };
    pending.add(request);
    const loop = () => {
      request.timer = void 0;
      if (!pending.has(request))
        return;
      if (host.destroyed) {
        request.callbacks.reject(new Error("The instance has been destroyed"));
        return;
      }
      try {
        if (host.injected) {
          const id = Math.max(Date.now(), lastId + 1);
          lastId = id;
          request.id = id;
          host.promises[id] = request.callbacks;
          host.$iframe.contentWindow.postMessage({ type, data, id }, "*");
        } else {
          request.timer = setTimeout(loop, 200);
        }
      } catch (error) {
        request.callbacks.reject(error);
      }
    };
    loop();
  });
}
function cancelRequests(host) {
  const pending = requests.get(host);
  if (!pending)
    return;
  for (const request of [...pending])
    request.callbacks.reject(new Error("The instance has been destroyed"));
}
const connections = /* @__PURE__ */ new WeakMap();
function connect(host) {
  const owner = window;
  const receiver = host.onMessage;
  connections.set(host, () => owner.removeEventListener("message", receiver));
  owner.addEventListener("message", receiver);
  host.$iframe.src = host.url;
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
function acceptsMessage(event, peer) {
  if (event.source !== void 0 && event.source !== null && event.source !== peer)
    return false;
  const data = event.data;
  return typeof data === "object" && data !== null && "type" in data && typeof data.type === "string";
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
      {
        type,
        data,
        id
      },
      "*"
    );
  }
  static async onMessage(event) {
    if (!ArtplayerToolIframe.iframe) {
      throw new Error('The "ArtplayerToolIframe.onMessage" method can only be used in iframe');
    }
    if (!acceptsMessage(event, window.parent))
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
    ArtplayerToolIframe.postMessage({ type: "inject" });
    window.addEventListener("message", ArtplayerToolIframe.onMessage);
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
    if (this.destroyed || !acceptsMessage(event, this.$iframe.contentWindow))
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
