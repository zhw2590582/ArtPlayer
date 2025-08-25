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
})({"ica5N":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginAmbilight);
function artplayerPluginAmbilight(option = {}) {
    return (art)=>{
        const { $video } = art.template;
        const { createElement, addClass, setStyles } = art.constructor.utils;
        const { blur = "50px", opacity = 0.5, frequency = 10, duration = 0.3 } = option;
        const $ambilight = createElement("div");
        const gridItems = createGridItems($ambilight);
        setupAmbilight($ambilight, $video);
        setupGridItems(gridItems, blur, opacity, duration);
        const updateColors = createColorUpdater($video, gridItems, frequency);
        let animationFrameId = null;
        function start() {
            if (!animationFrameId) updateColors();
        }
        function stop() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
        art.on("ready", start);
        art.on("destroy", stop);
        return {
            name: "artplayerPluginAmbilight",
            start,
            stop
        };
        function createGridItems($ambilight) {
            $ambilight.innerHTML = Array(9).fill("<div></div>").join("");
            return Array.from($ambilight.children);
        }
        function setupAmbilight($ambilight, $video) {
            addClass($ambilight, "artplayer-plugin-ambilight");
            $video.parentNode.insertBefore($ambilight, $video);
            setStyles($ambilight, {
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 9,
                inset: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gridTemplateRows: "1fr 1fr 1fr"
            });
        }
        function setupGridItems(gridItems, blur, opacity, duration) {
            gridItems.forEach(($item)=>{
                setStyles($item, {
                    opacity,
                    filter: `blur(${blur})`,
                    transition: `background-color ${duration}s ease`
                });
            });
        }
        function createColorUpdater($video, gridItems, frequency) {
            const canvas = createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 3;
            canvas.height = 3;
            function getAverageColor(x, y, w, h) {
                ctx.drawImage($video, x, y, w, h, 0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                return `rgb(${r}, ${g}, ${b})`;
            }
            let lastUpdateTime = 0;
            return function updateColors() {
                const now = performance.now();
                if (now - lastUpdateTime < 1000 / frequency || !art.playing) {
                    animationFrameId = requestAnimationFrame(updateColors);
                    return;
                }
                lastUpdateTime = now;
                const w = $video.videoWidth / 3;
                const h = $video.videoHeight / 3;
                const colors = [
                    [
                        0,
                        0
                    ],
                    [
                        w,
                        0
                    ],
                    [
                        2 * w,
                        0
                    ],
                    [
                        0,
                        h
                    ],
                    [
                        w,
                        h
                    ],
                    [
                        2 * w,
                        h
                    ],
                    [
                        0,
                        2 * h
                    ],
                    [
                        w,
                        2 * h
                    ],
                    [
                        2 * w,
                        2 * h
                    ]
                ].map(([x, y])=>getAverageColor(x, y, w, h));
                gridItems.forEach(($item, index)=>{
                    $item.style.backgroundColor = colors[index];
                });
                animationFrameId = requestAnimationFrame(updateColors);
            };
        }
    };
}
if (typeof window !== "undefined") window["artplayerPluginAmbilight"] = artplayerPluginAmbilight;

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

},{}]},["ica5N"], "ica5N", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
