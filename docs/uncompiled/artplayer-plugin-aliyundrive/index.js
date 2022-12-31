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
})({"33P4p":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _styleLess = require("bundle-text:./style.less");
var _styleLessDefault = parcelHelpers.interopDefault(_styleLess);
function artplayerPluginAliyundrive(option = {
    onlyOnFullscreen: true,
    playlist: []
}) {
    return (art)=>{
        const { template: { $player , $bottom  } , constructor: { utils: { append , query , secondToTime , setStyle  }  }  } = art;
        let index = 0;
        function play() {
            const playItme = option.playlist[index];
            if (!playItme) return;
            art.poster = playItme.poster || "";
            playItme.quality = playItme.quality || [];
            const quality = playItme.quality.find((item)=>item.default) || playItme.quality[0];
            art.url = playItme.url || quality.url || "";
        }
        function next() {
            const nextIndex = index + 1;
            index = nextIndex > option.playlist.length - 1 ? 0 : nextIndex;
            play();
        }
        function prev() {
            const prevIndex = index - 1;
            index = prevIndex < 0 ? 0 : prevIndex;
            play();
        }
        function initControl() {
            const $control = append($player, `
                    <div class="artplayer-plugin-aliyundrive">
                        <div class="apa-control">
                            <div class="apa-control-current"></div>
                            <div class="apa-control-progress">
                                <div class="apa-control-progress-inner">
                                    <div class="apa-control-loaded"></div>
                                    <div class="apa-control-played">
                                        <div class="apa-control-indicator"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="apa-control-duration"></div>
                        </div>
                        <div class="apa-tool"></div>
                    </div>
                `);
            const $current = query(".apa-control-current", $control);
            const $duration = query(".apa-control-duration", $control);
            const $played = query(".apa-control-played", $control);
            const $loaded = query(".apa-control-loaded", $control);
            const events = [
                "video:loadedmetadata",
                "video:timeupdate",
                "video:progress"
            ];
            for(let index = 0; index < events.length; index++)art.on(events[index], ()=>{
                $current.innerText = secondToTime(art.currentTime);
                $duration.innerText = secondToTime(art.duration);
                setStyle($played, "width", `${art.played * 100}%`);
                setStyle($loaded, "width", `${art.loaded * 100}%`);
            });
            if (option.onlyOnFullscreen) {
                setStyle($control, "display", "none");
                setStyle($bottom, "display", null);
                const events1 = [
                    "fullscreen",
                    "fullscreenWeb"
                ];
                for(let index1 = 0; index1 < events1.length; index1++)art.on(events1[index1], (state)=>{
                    if (state) {
                        setStyle($control, "display", null);
                        setStyle($bottom, "display", "none");
                    } else {
                        setStyle($control, "display", "none");
                        setStyle($bottom, "display", null);
                    }
                });
            } else setStyle($bottom, "display", "none");
        }
        initControl();
        play();
        return {
            name: "artplayerPluginAliyundrive",
            play,
            next,
            prev
        };
    };
}
exports.default = artplayerPluginAliyundrive;
artplayerPluginAliyundrive.env = "development";
artplayerPluginAliyundrive.version = "1.0.6";
artplayerPluginAliyundrive.build = "2022-12-31 10:36:57";
if (typeof document !== "undefined") {
    if (!document.getElementById("artplayer-plugin-aliyundrive")) {
        const $style = document.createElement("style");
        $style.id = "artplayer-plugin-aliyundrive";
        $style.textContent = (0, _styleLessDefault.default);
        document.head.appendChild($style);
    }
}
if (typeof window !== "undefined") window["artplayerPluginAliyundrive"] = artplayerPluginAliyundrive;

},{"bundle-text:./style.less":"5Amth","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5Amth":[function(require,module,exports) {
module.exports = ".art-video-player .artplayer-plugin-aliyundrive {\n  z-index: 130;\n  height: 68px;\n  width: 520px;\n  user-select: none;\n  opacity: 0;\n  background-color: #313136;\n  border-radius: 10px;\n  flex-direction: row;\n  font-size: 13px;\n  transition: opacity .3s;\n  display: flex;\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control {\n  width: 100%;\n  height: 40px;\n  justify-content: space-between;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-current, .art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-duration {\n  width: 70px;\n  justify-content: center;\n  line-height: 1;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress {\n  height: 12px;\n  cursor: pointer;\n  border-radius: 4px;\n  flex: 1;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress .apa-control-progress-inner {\n  height: 4px;\n  width: 100%;\n  background-color: #ffffff40;\n  position: relative;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress .apa-control-progress-inner .apa-control-loaded {\n  z-index: 0;\n  background-color: #ffffff40;\n  border-radius: 4px;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress .apa-control-progress-inner .apa-control-played {\n  z-index: 10;\n  background-color: var(--theme);\n  border-radius: 4px;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress .apa-control-progress-inner .apa-control-played .apa-control-indicator {\n  width: 2px;\n  height: 14px;\n  background-color: #fff;\n  position: absolute;\n  top: -5px;\n  right: 0;\n}\n\n.art-video-player.art-control-show .artplayer-plugin-aliyundrive, .art-video-player.art-hover .artplayer-plugin-aliyundrive {\n  opacity: 1;\n  visibility: visible;\n}\n\n";

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

},{}]},["33P4p"], "33P4p", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
