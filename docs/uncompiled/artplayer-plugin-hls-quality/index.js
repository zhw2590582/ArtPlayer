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
})({"hMiLQ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _imageSvg = require("bundle-text:./image.svg");
var _imageSvgDefault = parcelHelpers.interopDefault(_imageSvg);
function artplayerPluginHlsQuality(option) {
    return (art)=>{
        const { $video  } = art.template;
        const { errorHandle  } = art.constructor.utils;
        function update() {
            const hls = art.hls || window.hls;
            errorHandle(hls && hls.media === $video, 'Cannot find instance of HLS from "art.hls" or "window.hls"');
            const auto = option.auto || "Auto";
            const title = option.title || "Quality";
            const getResolution = option.getResolution || ((level)=>(level.height || "Unknown ") + "P");
            const defaultLevel = hls.levels[hls.currentLevel];
            const defaultHtml = defaultLevel ? getResolution(defaultLevel) : auto;
            if (option.control) art.controls.add({
                name: "hls-quality",
                position: "right",
                html: defaultHtml,
                style: {
                    padding: "0 10px"
                },
                selector: hls.levels.map((item, index)=>{
                    return {
                        html: getResolution(item),
                        level: item.level || index,
                        default: defaultLevel === item
                    };
                }),
                onSelect (item) {
                    hls.nextLevel = item.level;
                    return item.html;
                }
            });
            if (option.setting) art.setting.add({
                name: "hls-quality",
                tooltip: defaultHtml,
                html: title,
                icon: (0, _imageSvgDefault.default),
                width: 200,
                selector: hls.levels.map((item, index)=>{
                    return {
                        html: getResolution(item),
                        level: item.level || index,
                        default: defaultLevel === item
                    };
                }),
                onSelect: function(item) {
                    hls.nextLevel = item.level;
                    return item.html;
                }
            });
        }
        art.on("ready", update);
        return {
            name: "artplayerPluginHlsQuality"
        };
    };
}
exports.default = artplayerPluginHlsQuality;
artplayerPluginHlsQuality.env = "development";
artplayerPluginHlsQuality.version = "1.0.1";
artplayerPluginHlsQuality.build = "2023-02-18 11:28:03";
if (typeof window !== "undefined") window["artplayerPluginHlsQuality"] = artplayerPluginHlsQuality;

},{"bundle-text:./image.svg":"1HFaU","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"1HFaU":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg t=\"1666857514489\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2580\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"24\" height=\"24\"><path d=\"M870.4 176 153.6 176C104.128 176 64 216.128 64 265.6l0 492.736c0 49.472 40.128 89.6 89.6 89.6L870.4 847.936c49.472 0 89.6-40.128 89.6-89.6L960 265.6C960 216.128 919.872 176 870.4 176zM870.4 668.8 825.6 668.8c0 0-29.696-65.792-89.6-89.6s-134.4 89.6-134.4 89.6S535.04 596.992 467.2 444.8C399.36 292.608 153.6 624 153.6 624l0-358.4L870.4 265.6 870.4 668.8zM668.8 489.6c37.056 0 67.2-30.144 67.2-67.264 0-37.056-30.144-67.2-67.2-67.2C631.68 355.2 601.6 385.344 601.6 422.4 601.6 459.52 631.68 489.6 668.8 489.6z\" p-id=\"2581\" fill=\"#ffffff\"></path>\n</svg>";

},{}],"5dUr6":[function(require,module,exports) {
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

},{}]},["hMiLQ"], "hMiLQ", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
