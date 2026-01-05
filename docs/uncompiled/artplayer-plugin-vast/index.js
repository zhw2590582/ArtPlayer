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
/**
 * ArtPlayer Plugin VAST
 * Based on Google IMA SDK
 * 
 * @license MIT
 * @author Harvey Zack
 */ // ============================================================================
// 1. Constants & Enums
// ============================================================================
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginVast);
const SDK_URL = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
const STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    PLAYING: 'playing',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    ERROR: 'error'
};
const EVENTS = {
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
// ============================================================================
// 2. Modules
// ============================================================================
/**
 * Service to handle Google IMA SDK loading and initialization
 */ class IMAService {
    constructor(){
        this.sdkLoaded = false;
    }
    async load() {
        if (window.google && window.google.ima) {
            this.sdkLoaded = true;
            return window.google.ima;
        }
        return new Promise((resolve, reject)=>{
            const script = document.createElement('script');
            script.src = SDK_URL;
            script.async = true;
            script.onload = ()=>{
                this.sdkLoaded = true;
                resolve(window.google.ima);
            };
            script.onerror = (err)=>{
                reject(new Error('Failed to load Google IMA SDK'));
            };
            document.body.appendChild(script);
        });
    }
    configureSettings() {
        if (!this.sdkLoaded) return;
        const ima = window.google.ima;
        // Explicitly disable VPAID as requested
        if (ima.ImaSdkSettings && ima.ImaSdkSettings.VpaidMode) ima.settings.setVpaidMode(ima.ImaSdkSettings.VpaidMode.DISABLED);
        // Disable Companion Ads (we don't handle them)
        ima.settings.setDisableCustomPlaybackForIOS10Plus(true);
    }
}
/**
 * State Machine for Ad Lifecycle
 */ class AdStateMachine {
    constructor(){
        this.current = STATES.IDLE;
    }
    transition(newState) {
        this.current = newState;
    }
    is(state) {
        return this.current === state;
    }
    reset() {
        this.current = STATES.IDLE;
    }
}
/**
 * Manages the DOM container for Ads
 */ class AdContainer {
    constructor(art){
        this.art = art;
        this.$el = null;
        this.$play = null;
        this.onPlay = null;
    }
    mount() {
        if (this.$el) return this.$el;
        const { template, constructor } = this.art;
        const { createElement, setStyles } = constructor.utils;
        // Main Ad Container
        this.$el = createElement('div');
        this.$el.id = `art-vast-${Date.now()}`;
        setStyles(this.$el, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            zIndex: '150',
            display: 'none',
            pointerEvents: 'auto'
        });
        // Resume/Play Overlay
        this.$play = createElement('div');
        setStyles(this.$play, {
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
        this.$play.innerHTML = `
        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="rgba(255,255,255,0.9)">
            <path d="M8 5v14l11-7z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
    `;
        this.$play.addEventListener('click', (e)=>{
            e.stopPropagation();
            if (this.onPlay) this.onPlay();
        });
        template.$player.appendChild(this.$el);
        template.$player.appendChild(this.$play);
        return this.$el;
    }
    show() {
        if (this.$el) this.$el.style.display = 'block';
    }
    hide() {
        if (this.$el) this.$el.style.display = 'none';
        this.hidePlay();
    }
    showPlay() {
        if (this.$play) this.$play.style.display = 'block';
    }
    hidePlay() {
        if (this.$play) this.$play.style.display = 'none';
    }
    destroy() {
        if (this.$el && this.$el.parentNode) this.$el.parentNode.removeChild(this.$el);
        if (this.$play && this.$play.parentNode) this.$play.parentNode.removeChild(this.$play);
        this.$el = null;
        this.$play = null;
        this.onPlay = null;
    }
}
/**
 * Bridge to control ArtPlayer behavior during Ads
 */ class ArtPlayerBridge {
    constructor(art){
        this.art = art;
        this.originalState = {};
        this.isHijacked = false;
    }
    hijack() {
        if (this.isHijacked) return;
        const { art } = this;
        // Save original states
        this.originalState = {
            hotkey: art.option.hotkey,
            scrubbing: art.option.scrubbing,
            controls: art.controls.show,
            contextmenu: art.option.contextmenu,
            lock: art.option.lock,
            autoPlayback: art.option.autoPlayback
        };
        // Disable user interactions
        art.option.hotkey = false;
        art.option.scrubbing = false;
        art.controls.show = false;
        // Pause main video if it's playing
        if (!art.paused) art.pause();
        this.isHijacked = true;
    }
    release() {
        if (!this.isHijacked) return;
        const { art } = this;
        const { originalState } = this;
        // Restore states
        art.option.hotkey = originalState.hotkey;
        art.option.scrubbing = originalState.scrubbing;
        art.controls.show = originalState.controls;
        this.isHijacked = false;
    }
}
// ============================================================================
// 3. Main Controller
// ============================================================================
class VastController {
    constructor(art, options){
        this.art = art;
        this.options = options || {};
        this.imaService = new IMAService();
        this.stateMachine = new AdStateMachine();
        this.container = new AdContainer(art);
        this.bridge = new ArtPlayerBridge(art);
        // Setup resume callback
        this.container.onPlay = ()=>{
            if (this.adsManager) this.adsManager.resume();
        };
        this.adsLoader = null;
        this.adsManager = null;
        this.adDisplayContainer = null;
        this.adDisplayContainerInitialized = false;
        // Bind context
        this.onResize = this.onResize.bind(this);
        this.onContentPauseRequested = this.onContentPauseRequested.bind(this);
        this.onContentResumeRequested = this.onContentResumeRequested.bind(this);
        this.onAdError = this.onAdError.bind(this);
        this.onAdEvent = this.onAdEvent.bind(this);
        // Initialize
        this.init();
    }
    async init() {
        try {
            const ima = await this.imaService.load();
            this.imaService.configureSettings();
            // Listen to ArtPlayer resize to resize AdsManager
            this.art.on('resize', this.onResize);
            this.art.on('fullscreen', this.onResize);
            this.art.on('destroy', ()=>this.destroy());
        } catch (error) {
            console.error('[ArtPlayer VAST] Failed to load IMA SDK:', error);
            this.stateMachine.transition(STATES.ERROR);
        }
    }
    createAdsLoader() {
        if (this.adsLoader) return;
        const ima = window.google.ima;
        const $container = this.container.mount();
        const $video = this.art.template.$video;
        this.adDisplayContainer = new ima.AdDisplayContainer($container, $video);
        // NOTE: Do NOT call initialize() here. It must be called as the result of a user action.
        this.adsLoader = new ima.AdsLoader(this.adDisplayContainer);
        // Set up event listeners
        this.adsLoader.addEventListener(ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (e)=>this.onAdsManagerLoaded(e), false);
        this.adsLoader.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false);
    }
    requestAds(adsRequest) {
        // Requirement 1: Prevent re-entry if not IDLE
        if (!this.stateMachine.is(STATES.IDLE)) {
            console.warn('[ArtPlayer VAST] Cannot request ads while state is not IDLE');
            return;
        }
        if (!this.adsLoader) this.createAdsLoader();
        // Requirement 2: Initialize AdDisplayContainer on first request (user interaction)
        if (!this.adDisplayContainerInitialized && this.adDisplayContainer) {
            this.adDisplayContainer.initialize();
            this.adDisplayContainerInitialized = true;
        }
        // Reset state
        this.stateMachine.transition(STATES.LOADING);
        // Request ads
        try {
            this.adsLoader.requestAds(adsRequest);
        } catch (e) {
            this.onAdError({
                getError: ()=>e
            });
        }
    }
    playAdTag(url, options = {}) {
        if (!window.google || !window.google.ima) {
            console.warn('[ArtPlayer VAST] SDK not loaded yet. Queueing request...');
            this.imaService.load().then(()=>this.playAdTag(url, options));
            return;
        }
        // Requirement 1: Check state before creating request
        if (!this.stateMachine.is(STATES.IDLE)) {
            console.warn('[ArtPlayer VAST] Cannot request ads while state is not IDLE');
            return;
        }
        const ima = window.google.ima;
        const adsRequest = new ima.AdsRequest();
        adsRequest.adTagUrl = url;
        // Apply options
        Object.assign(adsRequest, options);
        this.requestAds(adsRequest);
    }
    playAdsResponse(adsResponse, options = {}) {
        if (!window.google || !window.google.ima) {
            this.imaService.load().then(()=>this.playAdsResponse(adsResponse, options));
            return;
        }
        // Requirement 1: Check state before creating request
        if (!this.stateMachine.is(STATES.IDLE)) {
            console.warn('[ArtPlayer VAST] Cannot request ads while state is not IDLE');
            return;
        }
        const ima = window.google.ima;
        const adsRequest = new ima.AdsRequest();
        adsRequest.adsResponse = adsResponse;
        Object.assign(adsRequest, options);
        this.requestAds(adsRequest);
    }
    onAdsManagerLoaded(adsManagerLoadedEvent) {
        const ima = window.google.ima;
        // Requirement 4: Ensure single instance of AdsManager
        if (this.adsManager) {
            this.adsManager.destroy();
            this.adsManager = null;
        }
        const adsRenderingSettings = new ima.AdsRenderingSettings();
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        adsRenderingSettings.enablePreloading = true;
        this.adsManager = adsManagerLoadedEvent.getAdsManager(this.art.template.$video, adsRenderingSettings);
        this.adsManager.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, this.onAdError);
        // Lifecycle events
        this.adsManager.addEventListener(ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested);
        this.adsManager.addEventListener(ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onContentResumeRequested);
        // Ad events
        const events = [
            ima.AdEvent.Type.ALL_ADS_COMPLETED,
            ima.AdEvent.Type.LOADED,
            ima.AdEvent.Type.STARTED,
            ima.AdEvent.Type.COMPLETE,
            ima.AdEvent.Type.SKIPPED,
            ima.AdEvent.Type.CLICK,
            ima.AdEvent.Type.PAUSED,
            ima.AdEvent.Type.RESUMED
        ];
        events.forEach((eventType)=>{
            this.adsManager.addEventListener(eventType, this.onAdEvent);
        });
        try {
            const { width, height } = this.art.template.$player.getBoundingClientRect();
            this.adsManager.init(width, height, ima.ViewMode.NORMAL);
            this.adsManager.start();
        } catch (adError) {
            this.onAdError({
                getError: ()=>adError
            });
        }
    }
    onContentPauseRequested() {
        // Requirement 3: Semantics - Just hijack and show container, state is LOADING
        this.stateMachine.transition(STATES.LOADING);
        this.bridge.hijack();
        this.container.show();
        // Ensure video is paused
        this.art.pause();
    // NOTE: Do NOT emit adStarted here. Wait for actual AdEvent.STARTED.
    }
    onContentResumeRequested() {
        // Requirement 6: Idempotent check
        // If we are not in an active ad state (LOADING or PLAYING), ignore.
        // This prevents double resume calls from VMAP or error handlers.
        if (this.stateMachine.is(STATES.IDLE) || this.stateMachine.is(STATES.COMPLETED)) return;
        // Requirement 4: Clean up AdsManager to prevent leaks in VMAP
        if (this.adsManager) {
            this.adsManager.destroy();
            this.adsManager = null;
        }
        this.stateMachine.transition(STATES.COMPLETED);
        this.bridge.release();
        this.container.hide();
        // Resume video
        this.art.play();
        this.art.emit(`vast:${EVENTS.ALL_ADS_COMPLETED}`);
        // Reset to IDLE for next ad request
        this.stateMachine.reset();
    }
    onAdEvent(adEvent) {
        const ima = window.google.ima;
        const type = adEvent.type;
        const ad = adEvent.getAd();
        // Map IMA events to plugin events
        switch(type){
            case ima.AdEvent.Type.LOADED:
                this.art.emit(`vast:${EVENTS.AD_LOADED}`, adEvent);
                break;
            case ima.AdEvent.Type.STARTED:
                // Requirement 3: Transition to PLAYING only here
                this.stateMachine.transition(STATES.PLAYING);
                this.container.hidePlay();
                this.art.emit(`vast:${EVENTS.AD_STARTED}`, adEvent);
                break;
            case ima.AdEvent.Type.COMPLETE:
                this.art.emit(`vast:${EVENTS.AD_COMPLETE}`, adEvent);
                break;
            case ima.AdEvent.Type.SKIPPED:
                this.art.emit(`vast:${EVENTS.AD_SKIPPED}`, adEvent);
                break;
            case ima.AdEvent.Type.CLICK:
                this.art.emit(`vast:${EVENTS.AD_CLICK}`, adEvent);
                break;
            case ima.AdEvent.Type.PAUSED:
                this.stateMachine.transition(STATES.PAUSED);
                this.container.showPlay();
                this.art.emit(`vast:${EVENTS.AD_PAUSED}`, adEvent);
                break;
            case ima.AdEvent.Type.RESUMED:
                this.stateMachine.transition(STATES.PLAYING);
                this.container.hidePlay();
                this.art.emit(`vast:${EVENTS.AD_RESUMED}`, adEvent);
                break;
        }
    }
    onAdError(adErrorEvent) {
        const error = adErrorEvent.getError();
        console.error('[ArtPlayer VAST] Ad Error:', error);
        // Requirement 4: Clean up AdsManager on error
        if (this.adsManager) {
            this.adsManager.destroy();
            this.adsManager = null;
        }
        this.stateMachine.transition(STATES.ERROR);
        this.art.emit(`vast:${EVENTS.AD_ERROR}`, error);
        // Recovery
        this.bridge.release();
        this.container.hide();
        this.art.play();
        // Reset state
        this.stateMachine.reset();
    }
    onResize() {
        // Requirement 7: Null check for adsManager
        if (this.adsManager && this.adDisplayContainer) {
            const { width, height } = this.art.template.$player.getBoundingClientRect();
            const ima = window.google.ima;
            this.adsManager.resize(width, height, ima.ViewMode.NORMAL);
        }
    }
    destroy() {
        // Requirement 8: Strict destroy order
        // 1. Reset state
        this.stateMachine.reset();
        // 2. Destroy adsManager
        if (this.adsManager) {
            this.adsManager.destroy();
            this.adsManager = null;
        }
        // 3. Hide + destroy container
        this.container.destroy();
        // 4. Release ArtPlayerBridge
        this.bridge.release();
        // 5. Clean up adsLoader / adDisplayContainer
        // Requirement 5: Do NOT call adsLoader.destroy()
        this.adsLoader = null;
        if (this.adDisplayContainer) {
            this.adDisplayContainer.destroy();
            this.adDisplayContainer = null;
        }
        // 6. Off events
        this.art.off('resize', this.onResize);
        this.art.off('fullscreen', this.onResize);
    }
}
function artplayerPluginVast(options) {
    return (art)=>{
        const controller = new VastController(art, options);
        return {
            name: 'artplayerPluginVast',
            // Public API
            playAdTag: (url, config)=>controller.playAdTag(url, config),
            playAdsResponse: (res, config)=>controller.playAdsResponse(res, config),
            init: ()=>controller.init(),
            destroy: ()=>controller.destroy(),
            // Getters for debugging/advanced usage
            get adsLoader () {
                return controller.adsLoader;
            },
            get adsManager () {
                return controller.adsManager;
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
