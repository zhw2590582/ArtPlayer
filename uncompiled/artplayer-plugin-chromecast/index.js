// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"NDQPH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginChromecast);
const loadScript = (src)=>new Promise((resolve, reject)=>{
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
const getMimeType = (url)=>{
    const extension = url.split("?")[0].split("#")[0].split(".").pop().toLowerCase();
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
    return mimeTypes[extension] || "application/octet-stream";
};
function artplayerPluginChromecast(option) {
    const DEFAULT_ICON = `<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M512 96H64v99c-13-2-26.4-3-40-3H0V96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H288V456c0-13.6-1-27-3-40H512V96zM24 224c128.1 0 232 103.9 232 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM0 344c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24z"/></svg>`;
    const DEFAULT_SDK = "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
    let isCastInitialized = false;
    let castSession = null;
    let castState = null;
    const initializeCastApi = ()=>{
        return new Promise((resolve, reject)=>{
            window["__onGCastApiAvailable"] = (isAvailable)=>{
                if (isAvailable) {
                    const context = window.cast.framework.CastContext.getInstance();
                    context.setOptions({
                        receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                        autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                    });
                    // Listen for session state changes
                    context.addEventListener(window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED, (event)=>{
                        const SessionState = window.cast.framework.SessionState;
                        castState = event.sessionState;
                        castSession = event.session;
                        switch(event.sessionState){
                            case SessionState.NO_SESSION:
                                option.onStateChange?.("disconnected");
                                updateCastButton("disconnected");
                                break;
                            case SessionState.SESSION_STARTING:
                                option.onStateChange?.("connecting");
                                updateCastButton("connecting");
                                break;
                            case SessionState.SESSION_STARTED:
                                option.onStateChange?.("connected");
                                updateCastButton("connected");
                                break;
                            case SessionState.SESSION_ENDING:
                                option.onStateChange?.("disconnecting");
                                updateCastButton("disconnecting");
                                break;
                            case SessionState.SESSION_RESUMED:
                                option.onStateChange?.("connected");
                                updateCastButton("connected");
                                break;
                        }
                    });
                    // Listen for cast state changes
                    context.addEventListener(window.cast.framework.CastContextEventType.CAST_STATE_CHANGED, (event)=>{
                        const CastState = window.cast.framework.CastState;
                        switch(event.castState){
                            case CastState.NO_DEVICES_AVAILABLE:
                                option.onCastAvailable?.(false);
                                break;
                            case CastState.NOT_CONNECTED:
                                option.onCastAvailable?.(true);
                                break;
                            case CastState.CONNECTING:
                            case CastState.CONNECTED:
                                option.onCastAvailable?.(true);
                                break;
                        }
                    });
                    isCastInitialized = true;
                    resolve();
                } else reject(new Error("Cast API is not available"));
            };
            if (!window.chrome || !window.chrome.cast) loadScript(option.sdk || DEFAULT_SDK).catch(reject);
        });
    };
    const castVideo = (art, session)=>{
        const url = option.url || art.option.url;
        const mediaInfo = new window.chrome.cast.media.MediaInfo(url, option.mimeType || getMimeType(url));
        const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
        session.loadMedia(request).then(()=>{
            art.notice.show = "Casting started";
            option.onCastStart?.();
        }).catch((error)=>{
            art.notice.show = "Error casting media";
            option.onError?.(error);
            throw error;
        });
    };
    const updateCastButton = (state)=>{
        const button = document.querySelector(".art-icon-cast");
        if (button) switch(state){
            case "connected":
                button.style.color = "red";
                break;
            case "connecting":
            case "disconnecting":
                button.style.color = "orange";
                break;
            case "disconnected":
            default:
                button.style.color = "white";
                break;
        }
    };
    return async (art)=>{
        art.controls.add({
            name: "chromecast",
            position: "right",
            tooltip: "Chromecast",
            html: `<i class="art-icon art-icon-cast">${option.icon || DEFAULT_ICON}</i>`,
            click: async ()=>{
                if (!isCastInitialized) try {
                    await initializeCastApi();
                } catch (error) {
                    art.notice.show = "Failed to initialize Cast API";
                    option.onError?.(error);
                    throw error;
                }
                const context = window.cast.framework.CastContext.getInstance();
                if (castSession) castVideo(art, castSession);
                else try {
                    const session = await context.requestSession();
                    castVideo(art, session);
                } catch (error) {
                    art.notice.show = "Error connecting to cast session";
                    option.onError?.(error);
                    throw error;
                }
            }
        });
        return {
            name: "artplayerPluginChromecast",
            getCastState: ()=>castState,
            isCasting: ()=>castSession !== null
        };
    };
}
if (typeof window !== "undefined") window["artplayerPluginChromecast"] = artplayerPluginChromecast;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5dUr6":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["NDQPH"], "NDQPH", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
