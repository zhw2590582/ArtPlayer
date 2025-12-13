// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
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

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
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
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

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
    }
  }
})({"iN7Pn":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginLiquidGlass);
var _styleLess = require("bundle-text:./style.less");
var _styleLessDefault = parcelHelpers.interopDefault(_styleLess);
function artplayerPluginLiquidGlass(option = {}) {
    return (art)=>{
        const { constructor } = art;
        const { addClass, append, createElement } = constructor.utils;
        const { $bottom, $progress, $controls, $player } = art.template;
        const $liquidGlass = createElement('div');
        addClass($player, 'artplayer-plugin-liquid-glass');
        addClass($liquidGlass, 'art-liquid-glass');
        append($bottom, $liquidGlass);
        append($liquidGlass, $progress);
        append($liquidGlass, $controls);
        art.on('control', (state)=>{
            if (state) $liquidGlass.style.width = option.width || '500px';
            else $liquidGlass.style.width = '';
        });
        return {
            name: 'artplayerPluginLiquidGlass'
        };
    };
}
if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-liquid-glass';
    let $style = document.getElementById(id);
    if (!$style) {
        $style = document.createElement('style');
        $style.id = id;
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>{
            document.head.appendChild($style);
        });
        else (document.head || document.documentElement).appendChild($style);
    }
    $style.textContent = (0, _styleLessDefault.default);
}
if (typeof window !== 'undefined') window.artplayerPluginLiquidGlass = artplayerPluginLiquidGlass;

},{"bundle-text:./style.less":"aTKsv","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"aTKsv":[function(require,module,exports,__globalThis) {
module.exports = ".artplayer-plugin-liquid-glass.art-control-show {\n  --art-control-height: 42px !important;\n  --art-control-icon-size: 24px !important;\n  --art-control-icon-scale: 1.1 !important;\n}\n\n.artplayer-plugin-liquid-glass.art-control-show .art-bottom {\n  padding-bottom: var(--art-padding);\n  background-image: none;\n  align-items: center;\n}\n\n.artplayer-plugin-liquid-glass.art-control-show .art-bottom .art-liquid-glass {\n  backdrop-filter: blur(12px);\n  padding: var(--art-padding) calc(var(--art-padding) * 1.5) 5px;\n  background-color: #00000040;\n  border-radius: 8px;\n}\n\n.artplayer-plugin-liquid-glass.art-control-show .art-bottom .art-control-progress-inner {\n  border-radius: 5px;\n  overflow: hidden;\n}\n\n.artplayer-plugin-liquid-glass.art-control-show .art-settings {\n  bottom: calc(var(--art-control-height)  + var(--art-bottom-gap)  + var(--art-padding));\n}\n\n.artplayer-plugin-liquid-glass.art-control-show .art-layer-auto-playback {\n  bottom: calc(var(--art-control-height)  + var(--art-bottom-gap)  + var(--art-padding) * 4 + 10px);\n}\n";

},{}],"8oCsH":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
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

},{}]},["iN7Pn"], "iN7Pn", "parcelRequire4dc0", {})

//# sourceMappingURL=index.js.map
