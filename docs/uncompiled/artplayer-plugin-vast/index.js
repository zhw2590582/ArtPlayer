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
})({"chARl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginVast);
const SDK_URL = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
function artplayerPluginVast(option) {
    return (art)=>{
        const { template: { $player, $video }, constructor: { utils: { setStyle, setStyles, append, remove, isMobile } } } = art;
        let adsLoader = null;
        let adsManager = null;
        let adDisplayContainer = null;
        let adDisplayContainerInitialized = false;
        let $container = null;
        let $play = null;
        let isAdPlaying = false;
        let originalState = {};
        const events = {
            ADS_MANAGER_LOADED: 'adsManagerLoaded',
            AD_LOADED: 'adLoaded',
            AD_STARTED: 'adStarted',
            AD_PAUSED: 'adPaused',
            AD_RESUMED: 'adResumed',
            AD_SKIPPED: 'adSkipped',
            AD_COMPLETE: 'adComplete',
            ALL_ADS_COMPLETED: 'allAdsCompleted',
            AD_ERROR: 'adError',
            AD_CLICK: 'adClick'
        };
        function loadSdk() {
            return new Promise((resolve, reject)=>{
                if (window.google && window.google.ima) resolve(window.google.ima);
                else {
                    const script = document.createElement('script');
                    script.src = SDK_URL;
                    script.async = true;
                    script.onload = ()=>resolve(window.google.ima);
                    script.onerror = reject;
                    document.body.appendChild(script);
                }
            });
        }
        function createContainer() {
            if ($container) return;
            $container = document.createElement('div');
            $container.id = 'artplayer-vast';
            setStyles($container, {
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                zIndex: '150',
                display: 'none',
                pointerEvents: 'auto'
            });
            append($player, $container);
            $play = document.createElement('div');
            setStyles($play, {
                position: 'absolute',
                zIndex: '160',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                display: 'none',
                width: '70px',
                height: '70px'
            });
            $play.innerHTML = `
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="rgba(255,255,255,0.9)">
                    <path d="M8 5v14l11-7z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            `;
            append($player, $play);
            $play.addEventListener('click', ()=>{
                if (adsManager) adsManager.resume();
            });
        }
        function hijack() {
            if (isAdPlaying) return;
            isAdPlaying = true;
            originalState = {
                hotkey: art.option.hotkey,
                scrubbing: art.option.scrubbing,
                controls: art.controls.show,
                contextmenu: art.option.contextmenu,
                lock: art.option.lock,
                autoPlayback: art.option.autoPlayback
            };
            art.option.hotkey = false;
            art.option.scrubbing = false;
            art.controls.show = false;
            if (!art.paused) art.pause();
            if ($container) setStyle($container, 'display', 'block');
        }
        function release() {
            if (!isAdPlaying) return;
            isAdPlaying = false;
            art.option.hotkey = originalState.hotkey;
            art.option.scrubbing = originalState.scrubbing;
            art.controls.show = originalState.controls;
            if ($container) setStyle($container, 'display', 'none');
            if ($play) setStyle($play, 'display', 'none');
            art.play();
        }
        function onAdError(event) {
            const error = event.getError();
            art.emit(`vast:${events.AD_ERROR}`, error);
            console.error('Vast Error:', error);
            if (adsManager) adsManager.destroy();
            release();
        }
        function onAdEvent(event) {
            const type = event.type;
            const ima = window.google.ima;
            switch(type){
                case ima.AdEvent.Type.LOADED:
                    art.emit(`vast:${events.AD_LOADED}`, event);
                    break;
                case ima.AdEvent.Type.STARTED:
                    art.emit(`vast:${events.AD_STARTED}`, event);
                    setStyle($play, 'display', 'none');
                    break;
                case ima.AdEvent.Type.PAUSED:
                    art.emit(`vast:${events.AD_PAUSED}`, event);
                    setStyle($play, 'display', 'block');
                    break;
                case ima.AdEvent.Type.RESUMED:
                    art.emit(`vast:${events.AD_RESUMED}`, event);
                    setStyle($play, 'display', 'none');
                    break;
                case ima.AdEvent.Type.COMPLETE:
                    art.emit(`vast:${events.AD_COMPLETE}`, event);
                    break;
                case ima.AdEvent.Type.SKIPPED:
                    art.emit(`vast:${events.AD_SKIPPED}`, event);
                    break;
                case ima.AdEvent.Type.CLICK:
                    art.emit(`vast:${events.AD_CLICK}`, event);
                    break;
                case ima.AdEvent.Type.ALL_ADS_COMPLETED:
                    art.emit(`vast:${events.ALL_ADS_COMPLETED}`, event);
                    release();
                    break;
            }
        }
        function onContentPauseRequested() {
            hijack();
        }
        function onContentResumeRequested() {
            release();
        }
        function initAdsManager(adsManagerLoadedEvent) {
            const ima = window.google.ima;
            const adsRenderingSettings = new ima.AdsRenderingSettings();
            adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
            if (adsManager) adsManager.destroy();
            adsManager = adsManagerLoadedEvent.getAdsManager($video, adsRenderingSettings);
            adsManager.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, onAdError);
            adsManager.addEventListener(ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
            adsManager.addEventListener(ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested);
            [
                ima.AdEvent.Type.LOADED,
                ima.AdEvent.Type.STARTED,
                ima.AdEvent.Type.PAUSED,
                ima.AdEvent.Type.RESUMED,
                ima.AdEvent.Type.COMPLETE,
                ima.AdEvent.Type.SKIPPED,
                ima.AdEvent.Type.CLICK,
                ima.AdEvent.Type.ALL_ADS_COMPLETED
            ].forEach((eventType)=>{
                adsManager.addEventListener(eventType, onAdEvent);
            });
            try {
                const { width, height } = $player.getBoundingClientRect();
                adsManager.init(width, height, ima.ViewMode.NORMAL);
                adsManager.start();
            } catch (adError) {
                onAdError({
                    getError: ()=>adError
                });
            }
        }
        function requestAds(adsRequest) {
            loadSdk().then((ima)=>{
                createContainer();
                if (!adsLoader) {
                    if (ima.ImaSdkSettings && ima.ImaSdkSettings.VpaidMode) ima.settings.setVpaidMode(ima.ImaSdkSettings.VpaidMode.DISABLED);
                    ima.settings.setDisableCustomPlaybackForIOS10Plus(true);
                    adDisplayContainer = new ima.AdDisplayContainer($container, $video);
                    adsLoader = new ima.AdsLoader(adDisplayContainer);
                    adsLoader.addEventListener(ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, initAdsManager, false);
                    adsLoader.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);
                }
                if (!adDisplayContainerInitialized && adDisplayContainer) {
                    adDisplayContainer.initialize();
                    adDisplayContainerInitialized = true;
                }
                adsLoader.requestAds(adsRequest);
            }).catch((err)=>{
                console.error('Vast SDK Load Error:', err);
            });
        }
        function playAdTag(url) {
            loadSdk().then((ima)=>{
                const adsRequest = new ima.AdsRequest();
                adsRequest.adTagUrl = url;
                requestAds(adsRequest);
            });
        }
        function playAdsResponse(response) {
            loadSdk().then((ima)=>{
                const adsRequest = new ima.AdsRequest();
                adsRequest.adsResponse = response;
                requestAds(adsRequest);
            });
        }
        function resize() {
            if (adsManager && $player) {
                const { width, height } = $player.getBoundingClientRect();
                adsManager.resize(width, height, window.google.ima.ViewMode.NORMAL);
            }
        }
        art.on('resize', resize);
        art.on('destroy', ()=>{
            if (adsManager) adsManager.destroy();
            if (adDisplayContainer) adDisplayContainer.destroy();
            if ($container) remove($container);
            if ($play) remove($play);
        });
        if (option.url) playAdTag(option.url);
        else if (option.adsResponse) playAdsResponse(option.adsResponse);
        return {
            name: 'artplayerPluginVast',
            playAdTag,
            playAdsResponse,
            get adsLoader () {
                return adsLoader;
            },
            get adsManager () {
                return adsManager;
            }
        };
    };
}
if (typeof window !== 'undefined') window.artplayerPluginVast = artplayerPluginVast;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"8oCsH":[function(require,module,exports,__globalThis) {
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

},{}]},["chARl"], "chARl", "parcelRequire4dc0", {})

//# sourceMappingURL=index.js.map
