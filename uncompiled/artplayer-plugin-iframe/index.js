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
})({"2DXkq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class ArtplayerPluginIframe {
    static get iframe() {
        return window.top !== window;
    }
    static postMessage({ type , data , id =0  }) {
        if (!ArtplayerPluginIframe.iframe) throw new Error('The "ArtplayerPluginIframe.postMessage" method can only be used in iframe');
        window.parent.postMessage({
            type: type,
            data: data,
            id: id
        }, "*");
    }
    static async onMessage(event) {
        if (!ArtplayerPluginIframe.iframe) throw new Error('The "ArtplayerPluginIframe.onMessage" method can only be used in iframe');
        const { type , data , id  } = event.data;
        switch(type){
            case "commit":
                try {
                    if (data.match(/\bresolve\((.*?)\)/)) {
                        const string = `return new Promise(function(resolve){\n${data}\n})`;
                        const result = await new Function(string)();
                        ArtplayerPluginIframe.postMessage({
                            type: "response",
                            data: result,
                            id
                        });
                    } else {
                        const result1 = new Function(data)();
                        ArtplayerPluginIframe.postMessage({
                            type: "response",
                            data: result1,
                            id
                        });
                    }
                } catch (error) {
                    ArtplayerPluginIframe.postMessage({
                        type: "error",
                        data: error.message,
                        id
                    });
                    throw error;
                }
                break;
            default:
                break;
        }
    }
    static inject() {
        if (!ArtplayerPluginIframe.iframe) throw new Error('The "ArtplayerPluginIframe.inject" method can only be used in iframe');
        ArtplayerPluginIframe.postMessage({
            type: "inject"
        });
        window.addEventListener("message", ArtplayerPluginIframe.onMessage);
    }
    constructor({ iframe , url  }){
        if (iframe instanceof HTMLIFrameElement === false) throw new Error('"option.iframe" needs to be a HTMLIFrameElement');
        if (typeof url !== "string") throw new Error('"option.url" needs to be a string');
        this.url = url;
        this.$iframe = iframe;
        this.promises = {};
        this.injected = false;
        this.destroyed = false;
        this.messageCallback = ()=>null;
        this.onMessage = this.onMessage.bind(this);
        window.addEventListener("message", this.onMessage);
        this.$iframe.src = this.url;
    }
    onMessage(event) {
        const { type , data , id  } = event.data;
        switch(type){
            case "inject":
                this.injected = true;
                break;
            default:
                break;
        }
        if (this.promises[id]) {
            if (type === "error") this.promises[id].reject(new Error(data));
            else this.promises[id].resove(data);
            delete this.promises[id];
        }
        if (this.messageCallback) this.messageCallback({
            type,
            data
        });
    }
    postMessage({ type , data  }) {
        return new Promise((resove, reject)=>{
            (function loop() {
                if (this.destroyed) reject(new Error("The instance has been destroyed"));
                else if (this.injected) {
                    const id = Date.now();
                    this.promises[id] = {
                        resove,
                        reject
                    };
                    this.$iframe.contentWindow.postMessage({
                        type: type,
                        data: data,
                        id: id
                    }, "*");
                } else setTimeout(loop.bind(this), 200);
            }).call(this);
        });
    }
    commit(callback) {
        if (typeof callback !== "function") throw new Error('"commit.callback" needs to be a function');
        const callbackString = callback.toString();
        const bodyString = callbackString.substring(callbackString.indexOf("{") + 1, callbackString.lastIndexOf("}"));
        return this.postMessage({
            type: "commit",
            data: bodyString
        });
    }
    message(callback) {
        if (typeof callback !== "function") throw new Error('"message.callback" needs to be a function');
        this.messageCallback = callback;
    }
    destroy() {
        this.destroyed = true;
        window.removeEventListener("message", this.onMessage);
    }
}
exports.default = ArtplayerPluginIframe;
if (typeof window !== "undefined") window["ArtplayerPluginIframe"] = ArtplayerPluginIframe;

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
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
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

},{}]},["2DXkq"], "2DXkq", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
