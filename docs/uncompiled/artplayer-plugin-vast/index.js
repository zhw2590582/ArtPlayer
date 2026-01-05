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
const DEFAULT_SDK_URL = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
const STATES = Object.freeze({
    IDLE: 'idle',
    SDK_LOADING: 'sdk_loading',
    READY: 'ready',
    REQUESTING: 'requesting',
    AD_PLAYING: 'ad_playing',
    AD_PAUSED: 'ad_paused',
    COMPLETED: 'completed',
    ERROR: 'error',
    DESTROYED: 'destroyed'
});
const EVENTS = Object.freeze({
    READY: 'ready',
    SDK_LOADED: 'sdkLoaded',
    ADS_MANAGER_LOADED: 'adsManagerLoaded',
    AD_LOADED: 'adLoaded',
    AD_STARTED: 'adStarted',
    AD_PAUSED: 'adPaused',
    AD_RESUMED: 'adResumed',
    AD_SKIPPED: 'adSkipped',
    AD_COMPLETE: 'adComplete',
    ALL_ADS_COMPLETED: 'allAdsCompleted',
    AD_ERROR: 'adError',
    AD_CLICK: 'adClick',
    CONTENT_PAUSE_REQUESTED: 'contentPauseRequested',
    CONTENT_RESUME_REQUESTED: 'contentResumeRequested'
});
const globalImaLoaderKey = '__ARTPLAYER_IMA_SDK_PROMISE__';
function getGlobal() {
    // eslint-disable-next-line no-new-func
    return new Function('return this')();
}
function once(fn) {
    let called = false;
    let result;
    return function(...args) {
        if (called) return result;
        called = true;
        result = fn.apply(this, args);
        return result;
    };
}
// 优化工具：防抖函数
function debounce(fn, ms = 200) {
    let timer;
    return (...args)=>{
        if (timer) clearTimeout(timer);
        timer = setTimeout(()=>fn.apply(this, args), ms);
    };
}
function safeCall(fn) {
    try {
        return fn();
    } catch (e) {
        return undefined;
    }
}
function clampZIndex(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 150;
    return Math.max(1, Math.min(2147483647, Math.floor(n)));
}
/**
 * SDK loader (全局单例模式，防止多次加载)
 */ function loadImaSdk(sdkUrl) {
    const g = getGlobal();
    if (g.google && g.google.ima) return Promise.resolve(g.google.ima);
    if (!g[globalImaLoaderKey]) g[globalImaLoaderKey] = new Promise((resolve, reject)=>{
        const script = document.createElement('script');
        script.src = sdkUrl || DEFAULT_SDK_URL;
        script.async = true;
        script.onload = ()=>{
            if (g.google && g.google.ima) resolve(g.google.ima);
            else reject(new Error('IMA SDK loaded but window.google.ima is missing'));
        };
        script.onerror = ()=>reject(new Error('Failed to load IMA SDK script'));
        document.head.appendChild(script);
    });
    return g[globalImaLoaderKey];
}
function artplayerPluginVast(userOption = {}) {
    return (art)=>{
        const { template: { $player, $video }, constructor: { utils: { setStyle, setStyles, append, remove } } } = art;
        const option = {
            sdkUrl: DEFAULT_SDK_URL,
            url: '',
            adsResponse: '',
            // UI 配置
            zIndex: 150,
            showBigPlayOnPause: true,
            // IMA 设置
            disableVpaid: true,
            disableCustomPlaybackForIOS10Plus: true,
            restoreCustomPlaybackStateOnAdBreakComplete: true,
            // 行为配置
            autoInit: true,
            debug: false,
            ...userOption
        };
        let state = STATES.IDLE;
        let ima = null;
        let adDisplayContainer = null;
        let adsLoader = null;
        let adsManager = null;
        let adContainerEl = null;
        let bigPlayEl = null;
        let initializedByUserGesture = false;
        let destroyed = false;
        // 记录广告前的状态
        let contentWasPlayingBeforeAd = false;
        // ===== 辅助函数 =====
        function log(...args) {
            if (option.debug) console.log('[artplayer-plugin-vast]', ...args);
        }
        function emit(name, payload) {
            art.emit(`vast:${name}`, payload);
        }
        function setState(next) {
            state = next;
        }
        function getPlayerRect() {
            const rect = $player.getBoundingClientRect();
            const width = Math.max(1, Math.floor(rect.width));
            const height = Math.max(1, Math.floor(rect.height));
            return {
                width,
                height
            };
        }
        function ensureUi() {
            if (adContainerEl) return;
            // 广告容器
            adContainerEl = document.createElement('div');
            adContainerEl.className = 'artplayer-ima-ad-container';
            setStyles(adContainerEl, {
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                display: 'none',
                pointerEvents: 'auto',
                zIndex: String(clampZIndex(option.zIndex))
            });
            append($player, adContainerEl);
            // 大播放按钮 (用于广告暂停或移动端手势触发)
            bigPlayEl = document.createElement('button');
            bigPlayEl.type = 'button';
            bigPlayEl.className = 'artplayer-ima-bigplay';
            bigPlayEl.setAttribute('aria-label', 'Play Ad');
            setStyles(bigPlayEl, {
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '72px',
                height: '72px',
                border: '0',
                padding: '0',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.35)',
                cursor: 'pointer',
                display: 'none',
                zIndex: String(clampZIndex(option.zIndex) + 1)
            });
            bigPlayEl.innerHTML = `
                <svg viewBox="0 0 24 24" width="42" height="42" fill="rgba(255,255,255,0.92)" style="margin-left:3px;">
                    <path d="M8 5v14l11-7z"></path>
                </svg>
            `;
            append($player, bigPlayEl);
            bigPlayEl.addEventListener('click', ()=>{
                if (destroyed) return;
                // 点击按钮算作一次用户手势，尝试初始化 AdContainer
                initializedByUserGesture = true;
                if (!adDisplayContainer) safeCall(()=>init());
                if (adsManager) safeCall(()=>adsManager.resume());
            });
        }
        function showAdLayer(show) {
            if (!adContainerEl) return;
            setStyle(adContainerEl, 'display', show ? 'block' : 'none');
        }
        function showBigPlay(show) {
            if (!bigPlayEl) return;
            setStyle(bigPlayEl, 'display', show ? 'block' : 'none');
        }
        function lockContentForAd() {
            // 记录当前播放状态
            contentWasPlayingBeforeAd = !art.paused;
            if (!art.paused) art.pause();
            showAdLayer(true);
            if (option.showBigPlayOnPause) showBigPlay(false);
        }
        function releaseContentAfterAd() {
            showAdLayer(false);
            showBigPlay(false);
            if (contentWasPlayingBeforeAd) {
                // 优化点：捕获自动播放失败的错误
                const playPromise = art.play();
                if (playPromise && typeof playPromise.catch === 'function') playPromise.catch((e)=>{
                    log('Resume content failed (likely autoplay policy):', e);
                });
            }
        }
        function cleanupAdsObjects() {
            if (adsManager) {
                safeCall(()=>adsManager.destroy());
                adsManager = null;
            }
            if (adsLoader) {
                safeCall(()=>adsLoader.destroy && adsLoader.destroy());
                adsLoader = null;
            }
            if (adDisplayContainer) {
                safeCall(()=>adDisplayContainer.destroy());
                adDisplayContainer = null;
            }
        }
        // 优化点：音量同步逻辑
        function syncVolume() {
            if (!adsManager || destroyed) return;
            // Artplayer volume 是 0-1，IMA 也是 0-1
            const vol = art.muted ? 0 : art.volume;
            safeCall(()=>adsManager.setVolume(vol));
        }
        // ===== IMA 事件处理 =====
        function onAdError(event) {
            const err = event && event.getError ? event.getError() : event;
            setState(STATES.ERROR);
            emit(EVENTS.AD_ERROR, err);
            log('Ad error:', err);
            cleanupAdsObjects();
            releaseContentAfterAd();
        }
        function onContentPauseRequested() {
            emit(EVENTS.CONTENT_PAUSE_REQUESTED);
            lockContentForAd();
        }
        function onContentResumeRequested() {
            emit(EVENTS.CONTENT_RESUME_REQUESTED);
            releaseContentAfterAd();
        }
        function onAdEvent(e) {
            if (!ima || !ima.AdEvent || !ima.AdEvent.Type) return;
            const t = e.type;
            switch(t){
                case ima.AdEvent.Type.LOADED:
                    emit(EVENTS.AD_LOADED, e);
                    break;
                case ima.AdEvent.Type.STARTED:
                    setState(STATES.AD_PLAYING);
                    emit(EVENTS.AD_STARTED, e);
                    showBigPlay(false);
                    break;
                case ima.AdEvent.Type.PAUSED:
                    setState(STATES.AD_PAUSED);
                    emit(EVENTS.AD_PAUSED, e);
                    if (option.showBigPlayOnPause) showBigPlay(true);
                    break;
                case ima.AdEvent.Type.RESUMED:
                    setState(STATES.AD_PLAYING);
                    emit(EVENTS.AD_RESUMED, e);
                    showBigPlay(false);
                    break;
                case ima.AdEvent.Type.COMPLETE:
                    emit(EVENTS.AD_COMPLETE, e);
                    break;
                case ima.AdEvent.Type.SKIPPED:
                    emit(EVENTS.AD_SKIPPED, e);
                    break;
                case ima.AdEvent.Type.CLICK:
                    emit(EVENTS.AD_CLICK, e);
                    break;
                case ima.AdEvent.Type.ALL_ADS_COMPLETED:
                    setState(STATES.COMPLETED);
                    emit(EVENTS.ALL_ADS_COMPLETED, e);
                    break;
                default:
                    break;
            }
        }
        function initAdsManager(adsManagerLoadedEvent) {
            if (destroyed) return;
            emit(EVENTS.ADS_MANAGER_LOADED, adsManagerLoadedEvent);
            const adsRenderingSettings = new ima.AdsRenderingSettings();
            adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = !!option.restoreCustomPlaybackStateOnAdBreakComplete;
            if (adsManager) safeCall(()=>adsManager.destroy());
            adsManager = adsManagerLoadedEvent.getAdsManager($video, adsRenderingSettings);
            // 绑定事件
            adsManager.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, onAdError);
            adsManager.addEventListener(ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
            adsManager.addEventListener(ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested);
            const adEvents = [
                ima.AdEvent.Type.LOADED,
                ima.AdEvent.Type.STARTED,
                ima.AdEvent.Type.PAUSED,
                ima.AdEvent.Type.RESUMED,
                ima.AdEvent.Type.COMPLETE,
                ima.AdEvent.Type.SKIPPED,
                ima.AdEvent.Type.CLICK,
                ima.AdEvent.Type.ALL_ADS_COMPLETED
            ];
            adEvents.forEach((type)=>adsManager.addEventListener(type, onAdEvent));
            // 初始化 AdsManager
            try {
                const { width, height } = getPlayerRect();
                adsManager.init(width, height, ima.ViewMode.NORMAL);
                // 优化点：初始化时立即同步音量
                syncVolume();
                adsManager.start();
            } catch (e) {
                onAdError({
                    getError: ()=>e
                });
            }
        }
        // ===== 核心逻辑 =====
        const init = once(()=>{
            if (destroyed) return Promise.reject(new Error('Plugin destroyed'));
            ensureUi();
            setState(STATES.SDK_LOADING);
            return loadImaSdk(option.sdkUrl).then((loadedIma)=>{
                if (destroyed) return;
                ima = loadedIma;
                emit(EVENTS.SDK_LOADED);
                log('IMA SDK loaded');
                // SDK 全局配置
                if (option.disableVpaid && ima.ImaSdkSettings && ima.ImaSdkSettings.VpaidMode) safeCall(()=>ima.settings.setVpaidMode(ima.ImaSdkSettings.VpaidMode.DISABLED));
                if (option.disableCustomPlaybackForIOS10Plus) safeCall(()=>ima.settings.setDisableCustomPlaybackForIOS10Plus(true));
                if (!adDisplayContainer) adDisplayContainer = new ima.AdDisplayContainer(adContainerEl, $video);
                if (!adsLoader) {
                    adsLoader = new ima.AdsLoader(adDisplayContainer);
                    adsLoader.addEventListener(ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, initAdsManager, false);
                    adsLoader.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);
                }
                setState(STATES.READY);
                emit(EVENTS.READY);
            }).catch((e)=>{
                setState(STATES.ERROR);
                emit(EVENTS.AD_ERROR, e);
                throw e;
            });
        });
        function initializeAdDisplayContainerFromUserGesture() {
            if (destroyed) return;
            if (!ima || !adDisplayContainer) return;
            if (initializedByUserGesture) return;
            initializedByUserGesture = true;
            // 移动端核心：必须在手势回调中同步调用 initialize()
            safeCall(()=>adDisplayContainer.initialize());
            log('AdDisplayContainer.initialize() called (user gesture)');
        }
        function requestAds(adsRequest) {
            if (destroyed) return Promise.reject(new Error('Plugin destroyed'));
            return init().then(()=>{
                if (destroyed) return;
                setState(STATES.REQUESTING);
                ensureUi();
                safeCall(()=>adsLoader.requestAds(adsRequest));
            });
        }
        function playAdTag(url) {
            if (!url) return Promise.reject(new Error('Missing adTagUrl'));
            return init().then(()=>{
                const req = new ima.AdsRequest();
                req.adTagUrl = url;
                return requestAds(req);
            });
        }
        function playAdsResponse(response) {
            if (!response) return Promise.reject(new Error('Missing adsResponse'));
            return init().then(()=>{
                const req = new ima.AdsRequest();
                req.adsResponse = response;
                return requestAds(req);
            });
        }
        // 优化点：使用 debounce 包裹 resize 逻辑
        const resize = debounce(()=>{
            if (!adsManager || destroyed) return;
            const { width, height } = getPlayerRect();
            safeCall(()=>adsManager.resize(width, height, ima.ViewMode.NORMAL));
        }, 100);
        function destroy() {
            if (destroyed) return;
            destroyed = true;
            setState(STATES.DESTROYED);
            cleanupAdsObjects();
            if (adContainerEl) remove(adContainerEl);
            if (bigPlayEl) remove(bigPlayEl);
            adContainerEl = null;
            bigPlayEl = null;
            // 优化点：清理音量监听
            art.off('video:volume', syncVolume);
            art.off('video:muted', syncVolume);
        }
        // ===== 自动初始化逻辑 (User Gesture) =====
        const onUserGesture = ()=>{
            if (destroyed) return;
            // 即使未播放广告，也尝试尽早初始化容器，以便后续播放无需手势
            init().then(()=>initializeAdDisplayContainerFromUserGesture()).catch(()=>{});
            detachUserGestureHooks();
        };
        function attachUserGestureHooks() {
            $player.addEventListener('pointerdown', onUserGesture, {
                capture: true,
                passive: true
            });
            $player.addEventListener('touchend', onUserGesture, {
                capture: true,
                passive: true
            });
            $player.addEventListener('click', onUserGesture, {
                capture: true,
                passive: true
            });
        }
        function detachUserGestureHooks() {
            $player.removeEventListener('pointerdown', onUserGesture, {
                capture: true
            });
            $player.removeEventListener('touchend', onUserGesture, {
                capture: true
            });
            $player.removeEventListener('click', onUserGesture, {
                capture: true
            });
        }
        // ===== ArtPlayer 生命周期集成 =====
        // 优化点：绑定音量变化
        art.on('video:volume', syncVolume);
        art.on('video:muted', syncVolume);
        art.on('resize', resize);
        window.addEventListener('resize', resize, {
            passive: true
        });
        art.on('destroy', ()=>{
            window.removeEventListener('resize', resize);
            detachUserGestureHooks();
            destroy();
        });
        // ===== 自动执行 =====
        ensureUi();
        if (option.autoInit) attachUserGestureHooks();
        if (option.url) playAdTag(option.url).catch((e)=>log('playAdTag failed:', e));
        else if (option.adsResponse) playAdsResponse(option.adsResponse).catch((e)=>log('playAdsResponse failed:', e));
        // ===== Public API =====
        return {
            name: 'artplayerPluginVast',
            get state () {
                return state;
            },
            get isAdPlaying () {
                return state === STATES.AD_PLAYING || state === STATES.AD_PAUSED;
            },
            get ima () {
                return ima;
            },
            get adsLoader () {
                return adsLoader;
            },
            get adsManager () {
                return adsManager;
            },
            get adDisplayContainer () {
                return adDisplayContainer;
            },
            init,
            requestAds,
            playAdTag,
            playAdsResponse,
            resize,
            destroy,
            initializeFromUserGesture () {
                init().then(()=>initializeAdDisplayContainerFromUserGesture()).catch(()=>{});
            },
            EVENTS,
            STATES
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
