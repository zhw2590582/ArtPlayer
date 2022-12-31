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
})({"guaft":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _styleLess = require("bundle-text:./style.less");
var _styleLessDefault = parcelHelpers.interopDefault(_styleLess);
function checkVersion(art) {
    const { version , utils: { errorHandle  } ,  } = art.constructor;
    const arr = version.split(".").map(Number);
    const major = arr[0];
    const minor = arr[1] / 100;
    errorHandle(major + minor >= 4.06, `Artplayer.js@${version} is not compatible the artplayerPluginControl@${artplayerPluginControl.version}. Please update it to version Artplayer.js@4.6.x`);
}
function artplayerPluginControl() {
    return (art)=>{
        checkVersion(art);
        const { template: { $bottom , $player  } , constructor: { utils: { append , secondToTime , addClass , removeClass , hasClass , isMobile  } ,  } ,  } = art;
        if (isMobile) return;
        const className = "artplayer-plugin-control";
        addClass($player, className);
        const $current = append($bottom, `<div class="apa-control-current"></div>`);
        const $duration = append($bottom, `<div class="apa-control-duration"></div>`);
        const events = [
            "video:loadedmetadata",
            "video:timeupdate",
            "video:progress"
        ];
        for(let index = 0; index < events.length; index++)art.on(events[index], ()=>{
            $current.innerText = secondToTime(art.currentTime);
            $duration.innerText = secondToTime(art.duration);
        });
        return {
            name: "artplayerPluginControl",
            get enable () {
                return hasClass($player, className);
            },
            set enable (state){
                if (state) addClass($player, className);
                else removeClass($player, className);
            }
        };
    };
}
exports.default = artplayerPluginControl;
artplayerPluginControl.env = "development";
artplayerPluginControl.version = "1.0.0";
artplayerPluginControl.build = "2022-12-31 23:46:57";
if (typeof document !== "undefined") {
    if (!document.getElementById("artplayer-plugin-control")) {
        const $style = document.createElement("style");
        $style.id = "artplayer-plugin-control";
        $style.textContent = (0, _styleLessDefault.default);
        document.head.appendChild($style);
    }
}
if (typeof window !== "undefined") window["artplayerPluginControl"] = artplayerPluginControl;

},{"bundle-text:./style.less":"cLvfB","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"cLvfB":[function(require,module,exports) {
module.exports = ".artplayer-plugin-control .art-bottom {\n  height: 68px;\n  min-width: 400px;\n  max-width: 600px;\n  user-select: none;\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n  backdrop-filter: saturate(180%) blur(20px);\n  pointer-events: auto;\n  background-color: #000000b3;\n  background-image: none;\n  border-radius: 10px;\n  flex-direction: column;\n  align-items: center;\n  padding: 0;\n  font-size: 13px;\n  display: flex;\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  transform: translateX(-50%);\n  box-shadow: 0 10px 15px -3px #0003, 0 4px 6px -4px #0003;\n}\n\n.artplayer-plugin-control .art-bottom .art-progress {\n  width: 65%;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n  display: flex;\n}\n\n.artplayer-plugin-control .art-bottom .art-progress .art-control-thumbnails {\n  bottom: 35px;\n}\n\n.artplayer-plugin-control .art-bottom .art-progress .art-control-progress {\n  width: 100%;\n}\n\n.artplayer-plugin-control .art-bottom .art-progress .art-control-progress .art-control-progress-inner, .artplayer-plugin-control .art-bottom .art-progress .art-control-progress .art-progress-loaded, .artplayer-plugin-control .art-bottom .art-progress .art-control-progress .art-progress-played {\n  border-radius: 5px;\n}\n\n.artplayer-plugin-control .art-bottom .art-progress .art-progress-tip {\n  top: -40px !important;\n}\n\n.artplayer-plugin-control .art-bottom .art-controls {\n  width: 100%;\n  height: auto;\n  flex: 1;\n  padding: 0 5px;\n}\n\n.artplayer-plugin-control .art-bottom .art-controls .art-control-time, .artplayer-plugin-control .art-bottom .art-controls .art-controls-center {\n  display: none;\n}\n\n.artplayer-plugin-control .art-bottom .art-controls .art-volume-panel {\n  width: 60px !important;\n}\n\n.artplayer-plugin-control .art-bottom .art-selector-list {\n  background-color: #000c !important;\n}\n\n.artplayer-plugin-control .art-bottom .apa-control-current, .artplayer-plugin-control .art-bottom .apa-control-duration {\n  width: 17.5%;\n  justify-content: center;\n  line-height: 1;\n  display: flex;\n  position: absolute;\n  top: 10px;\n}\n\n.artplayer-plugin-control .art-bottom .apa-control-current {\n  left: 0;\n}\n\n.artplayer-plugin-control .art-bottom .apa-control-duration {\n  right: 0;\n}\n\n.artplayer-plugin-control .art-settings {\n  bottom: 85px;\n}\n\n.artplayer-plugin-control.art-control-show .art-subtitle {\n  bottom: 80px;\n}\n\n.apa-control-current, .apa-control-duration {\n  display: none;\n}\n\n";

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

},{}]},["guaft"], "guaft", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
