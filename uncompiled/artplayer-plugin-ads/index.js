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
})({"gEVO5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _styleLess = require("bundle-text:./style.less");
var _styleLessDefault = parcelHelpers.interopDefault(_styleLess);
function artplayerPluginAds(option) {
    return (art)=>{
        const { template: { $player  } , icons: { volume , volumeClose , fullscreenOn , fullscreenOff , loading  } , constructor: { validator , utils: { query , append , setStyle  } ,  } ,  } = art;
        option = validator({
            html: "",
            video: "",
            url: "",
            playDuration: 5,
            totalDuration: 10,
            muted: false,
            i18n: {
                close: "\u5173\u95ED\u5E7F\u544A",
                countdown: "%s\u79D2",
                detail: "\u67E5\u770B\u8BE6\u60C5",
                canBeClosed: "%s\u79D2\u540E\u53EF\u5173\u95ED\u5E7F\u544A"
            },
            ...option
        }, {
            html: "?string",
            video: "?string",
            url: "?string",
            playDuration: "number",
            totalDuration: "number",
            muted: "?boolean",
            i18n: {
                close: "string",
                countdown: "string",
                detail: "string",
                canBeClosed: "string"
            }
        });
        let $ads = null;
        let $timer = null;
        let $close = null;
        let $countdown = null;
        let $control = null;
        let $loading = null;
        let time = 0;
        let timer = null;
        let isEnd = false;
        let isInit = false;
        let isCanClose = false;
        function getI18n(val, str) {
            return str.replace("%s", val);
        }
        function skip() {
            isEnd = true;
            art.play();
            if (option.video) $ads.pause();
            setStyle(art.template.$ads, "display", "none");
            art.emit("artplayerPluginAds:skip", option);
        }
        function play() {
            if (isEnd) return;
            timer = setTimeout(()=>{
                time += 1;
                const playDuration = option.playDuration - time;
                if (playDuration >= 1) $close.innerHTML = getI18n(playDuration, option.i18n.canBeClosed);
                else {
                    $close.innerHTML = option.i18n.close;
                    if (!isCanClose) isCanClose = true;
                }
                $countdown.innerHTML = getI18n(option.totalDuration - time, option.i18n.countdown);
                if (time >= option.totalDuration) skip();
                else play();
            }, 1000);
        }
        function pause() {
            if (isEnd) return;
            clearTimeout(timer);
        }
        function show() {
            art.template.$ads = append($player, '<div class="artplayer-plugin-ads"></div>');
            $ads = append(art.template.$ads, option.video ? `<video class="artplayer-plugin-ads-video" src="${option.video}" loop playsInline></video>` : `<div class="artplayer-plugin-ads-html">${option.html}</div>`);
            $loading = append(art.template.$ads, '<div class="artplayer-plugin-ads-loading"></div>');
            append($loading, loading);
            $timer = append(art.template.$ads, `<div class="artplayer-plugin-ads-timer">
                    <div class="artplayer-plugin-ads-close">${option.playDuration <= 0 ? option.i18n.close : getI18n(option.playDuration, option.i18n.canBeClosed)}</div>
                    <div class="artplayer-plugin-ads-countdown">${getI18n(option.totalDuration, option.i18n.countdown)}</div>
                </div>`);
            $close = query(".artplayer-plugin-ads-close", $timer);
            $countdown = query(".artplayer-plugin-ads-countdown", $timer);
            if (option.playDuration >= option.totalDuration) setStyle($close, "display", "none");
            art.proxy($close, "click", ()=>{
                if (isCanClose) skip();
            });
            $control = append(art.template.$ads, `<div class="artplayer-plugin-ads-control">
                    <div class="artplayer-plugin-ads-detail">${option.i18n.detail}</div>
                    <div class="artplayer-plugin-ads-muted"></div>
                    <div class="artplayer-plugin-ads-fullscreen"></div>
                </div>`);
            const $detail = query(".artplayer-plugin-ads-detail", $control);
            const $muted = query(".artplayer-plugin-ads-muted", $control);
            const $fullscreen = query(".artplayer-plugin-ads-fullscreen", $control);
            if (option.url) art.proxy($detail, "click", ()=>{
                window.open(option.url);
                art.emit("artplayerPluginAds:click", option);
            });
            else setStyle($detail, "display", "none");
            if (option.video) {
                const $volume = append($muted, volume);
                const $volumeClose = append($muted, volumeClose);
                setStyle($volumeClose, "display", "none");
                // If the ad was set to muted initially, match the icon
                if (option.muted) {
                    $ads.muted = true;
                    setStyle($volume, "display", "none");
                    setStyle($volumeClose, "display", "inline-flex");
                }
                art.proxy($muted, "click", ()=>{
                    $ads.muted = !$ads.muted;
                    if ($ads.muted) {
                        setStyle($volume, "display", "none");
                        setStyle($volumeClose, "display", "inline-flex");
                    } else {
                        setStyle($volume, "display", "inline-flex");
                        setStyle($volumeClose, "display", "none");
                    }
                });
            } else setStyle($muted, "display", "none");
            const $fullscreenOn = append($fullscreen, fullscreenOn);
            const $fullscreenOff = append($fullscreen, fullscreenOff);
            setStyle($fullscreenOff, "display", "none");
            art.proxy($fullscreen, "click", ()=>{
                art.fullscreen = !art.fullscreen;
                if (art.fullscreen) {
                    setStyle($fullscreenOn, "display", "inline-flex");
                    setStyle($fullscreenOff, "display", "none");
                } else {
                    setStyle($fullscreenOn, "display", "none");
                    setStyle($fullscreenOff, "display", "inline-flex");
                }
            });
            art.proxy($ads, "click", ()=>{
                if (option.url) window.open(option.url);
                art.emit("artplayerPluginAds:click", option);
            });
        }
        function init() {
            if (isInit) return;
            isInit = true;
            show();
            art.pause();
            if (option.video) {
                art.proxy($ads, "error", skip);
                art.proxy($ads, "loadedmetadata", ()=>{
                    play();
                    $ads.play();
                    setStyle($timer, "display", "flex");
                    setStyle($control, "display", "flex");
                    setStyle($loading, "display", "none");
                });
            } else {
                play();
                setStyle($timer, "display", "flex");
                setStyle($control, "display", "flex");
                setStyle($loading, "display", "none");
            }
            art.proxy(document, "visibilitychange", ()=>{
                if (document.hidden) pause();
                else play();
            });
        }
        art.on("ready", ()=>{
            art.once("play", init);
            art.once("video:playing", init);
        });
        return {
            name: "artplayerPluginAds",
            skip,
            pause,
            play
        };
    };
}
exports.default = artplayerPluginAds;
artplayerPluginAds.env = "development";
artplayerPluginAds.version = "1.0.5";
artplayerPluginAds.build = "1659407621565";
if (typeof document !== "undefined") {
    if (!document.getElementById("artplayer-plugin-ads")) {
        const $style = document.createElement("style");
        $style.id = "artplayer-plugin-ads";
        $style.textContent = (0, _styleLessDefault.default);
        document.head.appendChild($style);
    }
}
if (typeof window !== "undefined") window["artplayerPluginAds"] = artplayerPluginAds;

},{"bundle-text:./style.less":"1ZB0H","@parcel/transformer-js/src/esmodule-helpers.js":"8MjWm"}],"1ZB0H":[function(require,module,exports) {
module.exports = ".artplayer-plugin-ads {\n  z-index: 150;\n  width: 100%;\n  height: 100%;\n  color: #fff;\n  background-color: #000;\n  font-size: 13px;\n  line-height: 1;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\n.artplayer-plugin-ads .artplayer-plugin-ads-html {\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.artplayer-plugin-ads .artplayer-plugin-ads-video {\n  width: 100%;\n  height: 100%;\n}\n\n.artplayer-plugin-ads .artplayer-plugin-ads-timer {\n  display: none;\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}\n\n.artplayer-plugin-ads .artplayer-plugin-ads-timer > div {\n  cursor: pointer;\n  background-color: #00000080;\n  border-radius: 15px;\n  align-items: center;\n  margin-left: 5px;\n  padding: 5px 10px;\n  display: flex;\n}\n\n.artplayer-plugin-ads .artplayer-plugin-ads-control {\n  display: none;\n  position: absolute;\n  bottom: 10px;\n  right: 10px;\n}\n\n.artplayer-plugin-ads .artplayer-plugin-ads-control > div {\n  cursor: pointer;\n  background-color: #00000080;\n  border-radius: 15px;\n  align-items: center;\n  margin-left: 5px;\n  padding: 5px 10px;\n  display: flex;\n}\n\n.artplayer-plugin-ads .artplayer-plugin-ads-control .art-icon svg {\n  width: 20px;\n  height: 20px;\n}\n\n.artplayer-plugin-ads .artplayer-plugin-ads-loading {\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  position: absolute;\n  inset: 0;\n}\n\n";

},{}],"8MjWm":[function(require,module,exports) {
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

},{}]},["gEVO5"], "gEVO5", "parcelRequirea5da")

//# sourceMappingURL=index.js.map
