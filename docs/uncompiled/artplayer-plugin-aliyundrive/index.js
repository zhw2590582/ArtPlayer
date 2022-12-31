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
var _nextSvg = require("bundle-text:./icons/next.svg");
var _nextSvgDefault = parcelHelpers.interopDefault(_nextSvg);
function artplayerPluginAliyundrive(option = {
    onlyOnFullscreen: true,
    playlist: []
}) {
    return (art)=>{
        const { template: { $player , $bottom  } , constructor: { utils: { append , query , secondToTime , setStyle , clamp , addClass , tooltip , errorHandle , isMobile  }  }  } = art;
        setStyle($bottom, "display", "none");
        let index = 0;
        let $control = null;
        let $next = null;
        function next() {
            const nextIndex = index + 1;
            index = nextIndex > option.playlist.length - 1 ? 0 : nextIndex;
            init();
        }
        function prev() {
            const prevIndex = index - 1;
            index = prevIndex < 0 ? 0 : prevIndex;
            init();
        }
        function updateI18n() {
            art.i18n.update({
                "zh-cn": {
                    Next: "下一个"
                },
                "zh-tw": {
                    Next: "下一個"
                }
            });
        }
        function createIcon(html, name) {
            const icon = document.createElement("i");
            addClass(icon, "art-icon");
            addClass(icon, `art-icon-${name}`);
            append(icon, html);
            return icon;
        }
        function createControl() {
            $control = append($player, `
                    <div class="artplayer-plugin-aliyundrive">
                        <div class="apa-control">
                            <div class="apa-control-current"></div>
                            <div class="apa-control-progress">
                                <div class="apa-control-progress-inner">
                                    <div class="apa-control-loaded"></div>
                                    <div class="apa-control-played">
                                        <div class="apa-control-indicator"></div>
                                    </div>
                                    <div class="apa-control-time"></div>
                                </div>
                            </div>
                            <div class="apa-control-duration"></div>
                        </div>
                        <div class="apa-tool">
                            <div class="apa-tool-left">
                                <div class="apa-tool-state"></div>
                                <div class="apa-tool-next"></div>
                                <div class="apa-tool-volume"></div>
                            </div>
                            <div class="apa-tool-right">2</div>
                        </div>
                    </div>
                `);
        }
        function createProgress() {
            let isDroging = false;
            const $progress = query(".apa-control-progress", $control);
            const $current = query(".apa-control-current", $control);
            const $duration = query(".apa-control-duration", $control);
            const $played = query(".apa-control-played", $control);
            const $loaded = query(".apa-control-loaded", $control);
            const $time = query(".apa-control-time", $control);
            function getPosFromEvent(event) {
                const { left  } = $progress.getBoundingClientRect();
                const width = clamp(event.pageX - left, 0, $progress.clientWidth);
                const percentage = clamp(width / $progress.clientWidth, 0, 1);
                const second = width / $progress.clientWidth * art.duration;
                const time = secondToTime(second);
                return {
                    width,
                    second,
                    percentage,
                    time
                };
            }
            art.proxy($progress, "mousemove", (event)=>{
                setStyle($time, "display", "block");
                const { time , width  } = getPosFromEvent(event);
                $time.innerText = time;
                const tipWidth = $time.clientWidth;
                setStyle($time, "left", `${width - tipWidth / 2}px`);
            });
            art.proxy($progress, "mouseout", ()=>{
                setStyle($time, "display", "none");
            });
            art.proxy($progress, "mousedown", (event)=>{
                if (event.button === 0) {
                    isDroging = true;
                    const { percentage , second  } = getPosFromEvent(event);
                    setStyle($played, "width", `${percentage * 100}%`);
                    art.seek = second;
                }
            });
            art.proxy(document, "mousemove", (event)=>{
                if (isDroging) {
                    const { percentage , second  } = getPosFromEvent(event);
                    setStyle($played, "width", `${percentage * 100}%`);
                    art.seek = second;
                }
            });
            art.proxy(document, "mouseup", ()=>{
                if (isDroging) isDroging = false;
            });
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
        }
        function createState() {
            const $state = query(".apa-tool-state", $control);
            const $play = append($state, art.icons.play);
            const $pause = append($state, art.icons.pause);
            tooltip($play, art.i18n.get("Play"));
            tooltip($pause, art.i18n.get("Pause"));
            art.proxy($play, "click", ()=>{
                art.play();
            });
            art.proxy($pause, "click", ()=>{
                art.pause();
            });
            function showPlay() {
                setStyle($play, "display", "flex");
                setStyle($pause, "display", "none");
            }
            function showPause() {
                setStyle($play, "display", "none");
                setStyle($pause, "display", "flex");
            }
            if (art.playing) showPause();
            else showPlay();
            art.on("video:playing", ()=>{
                showPause();
            });
            art.on("video:pause", ()=>{
                showPlay();
            });
        }
        function createNext() {
            $next = query(".apa-tool-next", $control);
            append($next, createIcon((0, _nextSvgDefault.default), "next"));
            tooltip($next, art.i18n.get("Next"));
            art.proxy($next, "click", ()=>{
                next();
                console.log(index);
                art.play();
            });
        }
        function createVolume() {
            let isDroging = false;
            const $wrap = query(".apa-tool-volume", $control);
            const panelWidth = art.constructor.VOLUME_PANEL_WIDTH;
            const handleWidth = art.constructor.VOLUME_HANDLE_WIDTH;
            const $volume = append($wrap, art.icons.volume);
            const $volumeClose = append($wrap, art.icons.volumeClose);
            const $volumePanel = append($wrap, '<div class="apa-tool-volume-panel"></div>');
            const $volumeHandle = append($volumePanel, '<div class="apa-tool-volume-handle"></div>');
            tooltip($volume, art.i18n.get("Mute"));
            setStyle($volumeClose, "display", "none");
            if (isMobile) setStyle($volumePanel, "display", "none");
            function volumeChangeFromEvent(event) {
                const { left: panelLeft  } = $volumePanel.getBoundingClientRect();
                const percentage = clamp(event.pageX - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) / (panelWidth - handleWidth);
                return percentage;
            }
            function setVolumeHandle(percentage = 0.7) {
                if (art.muted || percentage === 0) {
                    setStyle($volume, "display", "none");
                    setStyle($volumeClose, "display", "flex");
                    setStyle($volumeHandle, "left", "0");
                } else {
                    const width = (panelWidth - handleWidth) * percentage;
                    setStyle($volume, "display", "flex");
                    setStyle($volumeClose, "display", "none");
                    setStyle($volumeHandle, "left", `${width}px`);
                }
            }
            setVolumeHandle(art.volume);
            art.on("video:volumechange", ()=>{
                setVolumeHandle(art.volume);
            });
            art.proxy($volume, "click", ()=>{
                art.muted = true;
            });
            art.proxy($volumeClose, "click", ()=>{
                art.muted = false;
            });
            art.proxy($volumePanel, "click", (event)=>{
                art.muted = false;
                art.volume = volumeChangeFromEvent(event);
            });
            art.proxy($volumeHandle, "mousedown", ()=>{
                isDroging = true;
            });
            art.proxy($wrap, "mousemove", (event)=>{
                if (isDroging) {
                    art.muted = false;
                    art.volume = volumeChangeFromEvent(event);
                }
            });
            art.proxy(document, "mouseup", ()=>{
                if (isDroging) isDroging = false;
            });
        }
        function init() {
            const playItme = option.playlist[index];
            if (!playItme) return;
            art.poster = playItme.poster || "";
            playItme.quality = playItme.quality || [];
            const quality = playItme.quality.find((item)=>item.default) || playItme.quality[0];
            errorHandle(quality && quality.url, "Unable to find the default quality url");
            art.url = quality.url;
        }
        updateI18n();
        createControl();
        createProgress();
        createState();
        createNext();
        createVolume();
        init();
        return {
            name: "artplayerPluginAliyundrive",
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

},{"bundle-text:./style.less":"5Amth","bundle-text:./icons/next.svg":"kZMRS","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5Amth":[function(require,module,exports) {
module.exports = ".art-video-player .artplayer-plugin-aliyundrive {\n  z-index: 130;\n  height: 68px;\n  width: 520px;\n  user-select: none;\n  opacity: 0;\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n  backdrop-filter: saturate(180%) blur(20px);\n  background-color: #000000b3;\n  border-radius: 10px;\n  flex-direction: column;\n  font-size: 13px;\n  transition: opacity .3s;\n  display: flex;\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  transform: translateX(-50%);\n  box-shadow: 0 10px 15px -3px #0003, 0 4px 6px -4px #0003;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control {\n  width: 100%;\n  height: 35px;\n  justify-content: space-between;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-current, .art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-duration {\n  width: 70px;\n  justify-content: center;\n  line-height: 1;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress {\n  height: 12px;\n  cursor: pointer;\n  flex: 1;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress .apa-control-progress-inner {\n  height: 4px;\n  width: 100%;\n  background-color: #ffffff40;\n  border-radius: 4px;\n  position: relative;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress .apa-control-progress-inner .apa-control-loaded {\n  z-index: 0;\n  background-color: #ffffff40;\n  border-radius: 4px;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress .apa-control-progress-inner .apa-control-played {\n  z-index: 10;\n  background-color: var(--theme);\n  border-radius: 4px;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress .apa-control-progress-inner .apa-control-played .apa-control-indicator {\n  width: 2px;\n  height: 14px;\n  background-color: #fff;\n  position: absolute;\n  top: -5px;\n  right: 0;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-control .apa-control-progress .apa-control-progress-inner .apa-control-time {\n  z-index: 50;\n  height: 20px;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  background: #000000b3;\n  border-radius: 3px;\n  padding: 0 5px;\n  font-size: 12px;\n  font-weight: bold;\n  line-height: 20px;\n  display: none;\n  position: absolute;\n  top: -25px;\n  left: 0;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool {\n  flex: 1;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 15px;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left {\n  align-items: center;\n  gap: 20px;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-state, .art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-next {\n  cursor: pointer;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-state .art-icon-next, .art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-next .art-icon-next {\n  transform: scale(1.25);\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-volume {\n  align-items: center;\n  gap: 10px;\n  display: flex;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-volume .art-icon {\n  cursor: pointer;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-volume .apa-tool-volume-panel {\n  float: left;\n  width: 60px;\n  height: 22px;\n  cursor: pointer;\n  transition: margin .2s cubic-bezier(.4, 0, 1, 1), width .2s cubic-bezier(.4, 0, 1, 1);\n  position: relative;\n  overflow: hidden;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-volume .apa-tool-volume-panel .apa-tool-volume-handle {\n  width: 12px;\n  height: 12px;\n  background: #fff;\n  border-radius: 12px;\n  margin-top: -6px;\n  position: absolute;\n  top: 50%;\n  left: 0;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-volume .apa-tool-volume-panel .apa-tool-volume-handle:before {\n  background: #fff;\n  left: -54px;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-volume .apa-tool-volume-panel .apa-tool-volume-handle:after {\n  background: #fff3;\n  left: 6px;\n}\n\n.art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-volume .apa-tool-volume-panel .apa-tool-volume-handle:before, .art-video-player .artplayer-plugin-aliyundrive .apa-tool .apa-tool-left .apa-tool-volume .apa-tool-volume-panel .apa-tool-volume-handle:after {\n  content: \"\";\n  height: 3px;\n  width: 60px;\n  margin-top: -2px;\n  display: block;\n  position: absolute;\n  top: 50%;\n}\n\n.art-video-player.art-control-show .artplayer-plugin-aliyundrive, .art-video-player.art-hover .artplayer-plugin-aliyundrive {\n  opacity: 1;\n  visibility: visible;\n}\n\n";

},{}],"kZMRS":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M17.5 18q-.425 0-.712-.288q-.288-.287-.288-.712V7q0-.425.288-.713Q17.075 6 17.5 6t.712.287q.288.288.288.713v10q0 .425-.288.712q-.287.288-.712.288ZM7.05 16.975q-.5.35-1.025.05q-.525-.3-.525-.9v-8.25q0-.6.525-.888q.525-.287 1.025.038l6.2 4.15q.45.3.45.825q0 .525-.45.825Z\"></path></svg>";

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
