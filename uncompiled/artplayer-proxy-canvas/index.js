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
})({"bBRui":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerProxyCanvas);
function artplayerProxyCanvas(callback) {
    return (art)=>{
        const { constructor } = art;
        const { createElement } = constructor.utils;
        const canvas = createElement("canvas");
        const video = createElement("video");
        const ctx = canvas.getContext("2d");
        let animationId = null;
        const originalCanvasMethods = {};
        for(const prop in canvas)if (typeof canvas[prop] === "function") originalCanvasMethods[prop] = canvas[prop].bind(canvas);
        for(const prop in video)if (!(prop in canvas)) Object.defineProperty(canvas, prop, {
            get () {
                const value = video[prop];
                return typeof value === "function" ? value.bind(video) : value;
            },
            set (value) {
                video[prop] = value;
            },
            configurable: true,
            enumerable: true
        });
        for(const prop in originalCanvasMethods)canvas[prop] = function(...args) {
            if (prop in originalCanvasMethods) return originalCanvasMethods[prop](...args);
            return video[prop].apply(video, args);
        };
        setupEventListeners();
        setupArtPlayerEvents();
        return canvas;
        function setupEventListeners() {
            const { events } = constructor.config;
            setTimeout(()=>{
                events.forEach((event)=>{
                    art.proxy(video, event, (event)=>{
                        art.emit(`video:${event.type}`, event);
                    });
                });
            });
        }
        async function draw() {
            try {
                if (typeof createImageBitmap !== "undefined") {
                    const bitmap = await createImageBitmap(video);
                    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                    bitmap.close();
                } else ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                callback && callback(ctx, video);
                art.emit("artplayerProxyCanvas:draw", ctx, video);
            } catch (error) {
                art.emit("artplayerProxyCanvas:error", error);
            }
        }
        async function animation() {
            await draw();
            animationId = requestAnimationFrame(animation);
        }
        function resize() {
            const player = art.template?.$player;
            if (!player || art.option.autoSize) return;
            const aspectRatio = video.videoWidth / video.videoHeight;
            const containerWidth = player.clientWidth;
            const containerHeight = player.clientHeight;
            const containerRatio = containerWidth / containerHeight;
            let canvasWidth, canvasHeight;
            if (containerRatio > aspectRatio) {
                canvasHeight = containerHeight;
                canvasWidth = canvasHeight * aspectRatio;
            } else {
                canvasWidth = containerWidth;
                canvasHeight = canvasWidth / aspectRatio;
            }
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const paddingLeft = (containerWidth - canvasWidth) / 2;
            const paddingTop = (containerHeight - canvasHeight) / 2;
            Object.assign(canvas.style, {
                padding: `${paddingTop}px ${paddingLeft}px`
            });
        }
        function setupArtPlayerEvents() {
            art.on("video:loadedmetadata", ()=>{
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });
            art.on("video:play", ()=>{
                cancelAnimationFrame(animationId);
                animation();
            });
            art.on("video:pause", ()=>{
                cancelAnimationFrame(animationId);
            });
            art.on("resize", ()=>{
                resize();
                draw();
            });
            art.on("destroy", ()=>{
                cancelAnimationFrame(animationId);
            });
        }
    };
}
if (typeof window !== "undefined") window["artplayerProxyCanvas"] = artplayerProxyCanvas;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"kBreb"}],"kBreb":[function(require,module,exports) {
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

},{}]},["bBRui"], "bBRui", "parcelRequire94c2")

//# sourceMappingURL=index.js.map
