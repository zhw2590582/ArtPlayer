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
})({"gqawh":[function(require,module,exports,__globalThis) {
/**
 * ArtPlayer MediaBunny Proxy
 * Main entry point
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerProxyMediabunny);
var _videoShimJs = require("./VideoShim.js");
var _videoShimJsDefault = parcelHelpers.interopDefault(_videoShimJs);
function artplayerProxyMediabunny(option = {}) {
    return (art)=>{
        const { constructor } = art;
        const { createElement } = constructor.utils;
        // Create canvas element
        const canvas = createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Create video shim
        const shim = new (0, _videoShimJsDefault.default)({
            art,
            canvas,
            ctx,
            option
        });
        // Proxy canvas methods to shim
        const originalCanvasMethods = {};
        for(const prop in canvas)if (typeof canvas[prop] === 'function') originalCanvasMethods[prop] = canvas[prop].bind(canvas);
        // Get all properties from shim instance and prototype
        const propertyNames = new Set([
            ...Object.getOwnPropertyNames(shim),
            ...Object.getOwnPropertyNames(Object.getPrototypeOf(shim))
        ]);
        // Add shim properties to canvas
        for (const prop of propertyNames){
            if (prop === 'constructor') continue;
            if (!(prop in canvas)) Object.defineProperty(canvas, prop, {
                get () {
                    const value = shim[prop];
                    return typeof value === 'function' ? value.bind(shim) : value;
                },
                set (v) {
                    shim[prop] = v;
                },
                configurable: true,
                enumerable: true
            });
        }
        // Restore original canvas methods
        for(const prop in originalCanvasMethods)canvas[prop] = (...args)=>originalCanvasMethods[prop](...args);
        // Handle resize
        function resize() {
            const player = art.template?.$player;
            if (!player || art.option.autoSize) return;
            Object.assign(canvas.style, {
                width: '100%',
                height: '100%',
                objectFit: 'contain'
            });
        }
        art.on('resize', resize);
        art.on('video:loadedmetadata', resize);
        // Cleanup on destroy
        art.on('destroy', ()=>{
            shim.destroy();
        });
        return canvas;
    };
}
if (typeof window !== 'undefined') window.artplayerProxyMediabunny = artplayerProxyMediabunny;

},{"./VideoShim.js":"l1ksT","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"l1ksT":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _eventTargetJs = require("./EventTarget.js");
var _eventTargetJsDefault = parcelHelpers.interopDefault(_eventTargetJs);
/**
 * Video Element Shim
 * Simulates HTMLVideoElement interface for MediaBunny
 */ var _mediaBunnyEngineJs = require("./MediaBunnyEngine.js");
var _mediaBunnyEngineJsDefault = parcelHelpers.interopDefault(_mediaBunnyEngineJs);
function clamp(v, min, max) {
    return Math.max(min, Math.min(max, Number(v) || 0));
}
class VideoShim {
    constructor({ art, canvas, ctx, option }){
        this.art = art;
        this.canvas = canvas;
        this.option = option;
        // Event system
        this.events = new (0, _eventTargetJsDefault.default)();
        // MediaBunny engine
        this.engine = new (0, _mediaBunnyEngineJsDefault.default)({
            canvas,
            ctx,
            events: this.events,
            option
        });
        // Internal state
        this._src = null;
        this._volume = option.volume ?? 0.7;
        this._muted = !!option.muted;
        this._playbackRate = 1;
        // Apply initial volume
        this.engine.setVolume(this._volume, this._muted);
        // Forward events to ArtPlayer
        this.setupEventForwarding();
        // Auto-load source
        if (option.source) this.src = option.source;
        else if (art.option?.url) this.src = art.option.url;
    }
    setupEventForwarding() {
        const { events: artEvents } = this.art.constructor.config;
        artEvents.forEach((name)=>{
            this.events.addEventListener(name, (e)=>{
                this.art.emit(`video:${e.type}`, e);
            });
        });
    }
    // Event methods
    addEventListener(type, fn) {
        this.events.addEventListener(type, fn);
    }
    removeEventListener(type, fn) {
        this.events.removeEventListener(type, fn);
    }
    // Source
    get src() {
        return this._src;
    }
    set src(v) {
        this._src = v;
        if (v) this.engine.load(v);
    }
    get currentSrc() {
        return this._src;
    }
    // Time
    get currentTime() {
        return this.engine.currentTime;
    }
    set currentTime(t) {
        this.engine.seek(Number(t) || 0);
    }
    get duration() {
        return this.engine.duration;
    }
    // Buffered/Played/Seekable
    get buffered() {
        return this.createTimeRanges(0, this.engine.duration);
    }
    get played() {
        return this.createTimeRanges(0, this.engine.currentTime);
    }
    get seekable() {
        return this.createTimeRanges(0, this.engine.duration);
    }
    createTimeRanges(start, end) {
        const duration = this.engine.duration;
        if (!duration || Number.isNaN(duration) || end <= 0) return {
            length: 0,
            start: ()=>0,
            end: ()=>0
        };
        return {
            length: 1,
            start: ()=>start,
            end: ()=>end
        };
    }
    // Playback state
    get paused() {
        return this.engine.paused;
    }
    get playing() {
        return !this.engine.paused && !this.engine.ended;
    }
    get ended() {
        return this.engine.ended;
    }
    get seeking() {
        return this.engine.seeking;
    }
    // Ready state
    get readyState() {
        return this.engine.readyState;
    }
    get networkState() {
        return this.engine.networkState;
    }
    get error() {
        return this.engine.error;
    }
    // Playback rate
    get playbackRate() {
        return this._playbackRate;
    }
    set playbackRate(v) {
        const rate = Number(v);
        if (Number.isNaN(rate) || rate <= 0) return;
        this._playbackRate = rate;
        this.engine.setPlaybackRate(rate);
        this.events.emit('ratechange');
    }
    // Volume
    get volume() {
        return this._volume;
    }
    set volume(v) {
        this._volume = clamp(v, 0, 1);
        this._muted = false;
        this.engine.setVolume(this._volume, this._muted);
        this.events.emit('volumechange');
    }
    get muted() {
        return this._muted;
    }
    set muted(v) {
        this._muted = !!v;
        this.engine.setVolume(this._volume, this._muted);
        this.events.emit('volumechange');
    }
    // Playback methods
    play() {
        return this.engine.play();
    }
    pause() {
        this.engine.pause();
    }
    load() {
        if (this._src) this.engine.load(this._src);
    }
    // Video dimensions
    get videoWidth() {
        return this.engine.videoWidth;
    }
    get videoHeight() {
        return this.engine.videoHeight;
    }
    // Other properties
    get poster() {
        return this.option.poster || '';
    }
    set poster(v) {
        this.option.poster = v;
    }
    get autoplay() {
        return this.option.autoplay || false;
    }
    set autoplay(v) {}
    get loop() {
        return this.option.loop || false;
    }
    set loop(v) {}
    get controls() {
        return false;
    }
    set controls(v) {}
    get playsInline() {
        return true;
    }
    set playsInline(v) {}
    get crossOrigin() {
        return this.option.crossOrigin || '';
    }
    set crossOrigin(v) {}
    get preload() {
        return 'auto';
    }
    set preload(v) {}
    get defaultMuted() {
        return false;
    }
    set defaultMuted(v) {}
    get defaultPlaybackRate() {
        return 1;
    }
    set defaultPlaybackRate(v) {}
    // Methods
    canPlayType(_type) {
        return 'maybe';
    }
    getBoundingClientRect() {
        return this.canvas.getBoundingClientRect();
    }
    requestVideoFrameCallback(callback) {
        const id = requestAnimationFrame((time)=>{
            callback(time, {
                presentationTime: this.engine.currentTime,
                expectedDisplayTime: time + 16.6,
                width: this.engine.videoWidth,
                height: this.engine.videoHeight,
                mediaTime: this.engine.currentTime,
                presentedFrames: 0,
                processingDuration: 0,
                captureTime: time,
                receiveTime: time,
                rtpTimestamp: 0
            });
        });
        return id;
    }
    cancelVideoFrameCallback(id) {
        cancelAnimationFrame(id);
    }
    setAttribute(name, value) {
        if (name === 'src') this.src = value;
        else if (name === 'autoplay') this.autoplay = value;
        else if (name === 'loop') this.loop = value;
        else if (name === 'muted') this.muted = true;
        else this.canvas.setAttribute(name, value);
    }
    destroy() {
        this.engine.destroy();
    }
}
exports.default = VideoShim;

},{"./EventTarget.js":"7Odz0","./MediaBunnyEngine.js":"j1QXy","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"7Odz0":[function(require,module,exports,__globalThis) {
/**
 * Event Target Implementation
 * Simple event system for video events
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class EventTarget {
    constructor(){
        this.listeners = new Map();
    }
    addEventListener(type, fn) {
        if (!this.listeners.has(type)) this.listeners.set(type, []);
        this.listeners.get(type).push(fn);
    }
    removeEventListener(type, fn) {
        const list = this.listeners.get(type);
        if (!list) return;
        const index = list.indexOf(fn);
        if (index >= 0) list.splice(index, 1);
    }
    emit(type, detail) {
        const evt = new Event(type);
        evt.detail = detail;
        const list = this.listeners.get(type);
        if (list) list.forEach((fn)=>fn(evt));
    }
}
exports.default = EventTarget;

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

},{}],"j1QXy":[function(require,module,exports,__globalThis) {
/**
 * Main MediaBunny Engine
 * Coordinates audio and video playback
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _audioEngineJs = require("./AudioEngine.js");
var _audioEngineJsDefault = parcelHelpers.interopDefault(_audioEngineJs);
var _videoEngineJs = require("./VideoEngine.js");
var _videoEngineJsDefault = parcelHelpers.interopDefault(_videoEngineJs);
class MediaBunnyEngine {
    constructor({ canvas, ctx, events, option = {} }){
        this.events = events;
        this.option = option;
        // Create audio and video engines
        this.audio = new (0, _audioEngineJsDefault.default)(events);
        this.video = new (0, _videoEngineJsDefault.default)({
            canvas,
            ctx,
            events,
            timeupdateInterval: option.timeupdateInterval ?? 250,
            avSyncTolerance: option.avSyncTolerance ?? 0.12,
            dropLateFrames: option.dropLateFrames ?? false,
            poster: option.poster ?? '',
            preflightRange: option.preflightRange ?? false
        });
        // Playback state
        this.paused = true;
        this.ended = false;
        this.readyState = 0;
        this.networkState = 0;
        this.error = null;
        this.seeking = false;
        this.loadSeq = 0;
        // Listen to ended event
        events.addEventListener?.('ended', ()=>{
            this.ended = true;
            this.paused = true;
        });
    }
    async load(src) {
        const id = ++this.loadSeq;
        this.pause();
        this.ended = false;
        this.error = null;
        this.networkState = 2 // NETWORK_LOADING
        ;
        this.readyState = 0 // HAVE_NOTHING
        ;
        setTimeout(()=>this.events.emit('waiting'), 0);
        setTimeout(()=>this.events.emit('loadstart'), 0);
        const loadTimeout = Number.isFinite(this.option.loadTimeout) ? this.option.loadTimeout : 0;
        try {
            await Promise.race([
                this.performLoad(src, id),
                loadTimeout > 0 ? this.createTimeout(loadTimeout) : new Promise(()=>{})
            ]);
        } catch (err) {
            if (id !== this.loadSeq) return;
            this.loadSeq++;
            this.error = {
                code: 4,
                message: err.message
            };
            this.networkState = 3 // NETWORK_NO_SOURCE
            ;
            this.events.emit('error');
        }
    }
    async performLoad(src, id) {
        let videoMetadataLoaded = false;
        let audioMetadataLoaded = false;
        const checkMetadata = ()=>{
            if (videoMetadataLoaded && audioMetadataLoaded) {
                this.readyState = 1 // HAVE_METADATA
                ;
                this.events.emit('loadedmetadata');
                this.events.emit('durationchange');
                this.events.emit('progress');
            }
        };
        try {
            await Promise.all([
                this.video.load(src, ()=>{
                    if (id !== this.loadSeq) return;
                    videoMetadataLoaded = true;
                    checkMetadata();
                }),
                this.audio.load(src, ()=>{
                    if (id !== this.loadSeq) return;
                    audioMetadataLoaded = true;
                    checkMetadata();
                })
            ]);
            if (id !== this.loadSeq) return;
            this.readyState = 4 // HAVE_ENOUGH_DATA
            ;
            this.networkState = 1 // NETWORK_IDLE
            ;
            this.events.emit('loadeddata');
            this.events.emit('canplay');
            this.events.emit('canplaythrough');
            this.events.emit('progress');
        } catch (err) {
            if (id !== this.loadSeq) return;
            this.error = {
                code: 4,
                message: err.message
            };
            this.networkState = 3;
            this.events.emit('error');
            console.error('MediaBunny load error:', err);
        }
    }
    createTimeout(ms) {
        return new Promise((_, reject)=>{
            setTimeout(()=>reject(new Error('Load timeout')), ms);
        });
    }
    async play() {
        if (!this.paused) return;
        if (this.ended) {
            this.ended = false;
            await this.seek(0);
        }
        this.paused = false;
        await this.audio.play();
        this.video.start(this.audio);
        this.events.emit('play');
        this.events.emit('playing');
    }
    pause() {
        if (this.paused) return;
        this.paused = true;
        this.audio.pause();
        this.video.stop();
        this.events.emit('pause');
    }
    async seek(time) {
        const shouldResume = !this.paused;
        this.ended = false;
        this.seeking = true;
        this.events.emit('seeking');
        this.events.emit('waiting');
        this.pause();
        await Promise.all([
            this.audio.seek(time),
            this.video.seek(time)
        ]);
        this.seeking = false;
        this.events.emit('seeked');
        if (shouldResume && !this.ended) await this.play();
    }
    setVolume(volume, muted) {
        this.audio.setVolume(volume, muted);
    }
    setPlaybackRate(rate) {
        this.audio.setPlaybackRate(rate);
        this.video.setPlaybackRate(rate);
    }
    destroy() {
        this.pause();
        this.audio.destroy();
        this.video.destroy();
    }
    // Getters
    get currentTime() {
        return this.audio.currentTime;
    }
    get duration() {
        return this.audio.duration || this.video.duration;
    }
    get videoWidth() {
        return this.video.width;
    }
    get videoHeight() {
        return this.video.height;
    }
}
exports.default = MediaBunnyEngine;

},{"./AudioEngine.js":"fhVqP","./VideoEngine.js":"aylqP","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"fhVqP":[function(require,module,exports,__globalThis) {
/**
 * Audio Engine for MediaBunny
 * Handles audio playback using Web Audio API
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _mediabunny = require("mediabunny");
class AudioEngine {
    constructor(events){
        this.events = events;
        // MediaBunny instances
        this.input = null;
        this.audioSink = null;
        this.audioIterator = null;
        // Web Audio API
        this.audioContext = null;
        this.gainNode = null;
        // Playback state
        this.audioContextStartTime = 0;
        this.playbackTimeAtStart = 0;
        this.latestScheduledEndTime = 0;
        this.duration = Number.NaN;
        this.paused = true;
        // Audio settings
        this.volume = 0.7;
        this.muted = false;
        this.playbackRate = 1;
        // Async control
        this.asyncId = 0;
        this.queuedNodes = new Set();
    }
    get currentTime() {
        if (this.paused) return this.playbackTimeAtStart;
        return (this.audioContext.currentTime - this.audioContextStartTime) * this.playbackRate + this.playbackTimeAtStart;
    }
    normalizeSource(src) {
        if (typeof src === 'string') return new (0, _mediabunny.UrlSource)(src);
        if (src instanceof Blob) return new (0, _mediabunny.BlobSource)(src);
        if (typeof ReadableStream !== 'undefined' && src instanceof ReadableStream) return new (0, _mediabunny.ReadableStreamSource)(src);
        return src;
    }
    ensureAudioContext(sampleRate) {
        if (this.audioContext) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        try {
            this.audioContext = new AudioContext({
                sampleRate
            });
        } catch  {
            this.audioContext = new AudioContext();
        }
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.updateGain();
    }
    updateGain() {
        if (!this.gainNode) return;
        const v = this.muted ? 0 : this.volume;
        this.gainNode.gain.value = v * v;
    }
    stopQueuedNodes() {
        this.queuedNodes.forEach((node)=>node.stop());
        this.queuedNodes.clear();
    }
    async stopIterator() {
        await this.audioIterator?.return();
        this.audioIterator = null;
    }
    async load(src, onMetadata) {
        const id = ++this.asyncId;
        await this.stopIterator();
        this.stopQueuedNodes();
        this.paused = true;
        this.playbackTimeAtStart = 0;
        this.audioContextStartTime = 0;
        const source = this.normalizeSource(src);
        if (!source) return;
        this.input = new (0, _mediabunny.Input)({
            source,
            formats: (0, _mediabunny.ALL_FORMATS)
        });
        this.duration = await this.input.computeDuration();
        if (id !== this.asyncId) return;
        const audioTrack = await this.input.getPrimaryAudioTrack();
        if (!audioTrack) {
            this.audioSink = null;
            this.ensureAudioContext();
            onMetadata?.();
            return;
        }
        if (audioTrack.codec === null || !await audioTrack.canDecode()) {
            this.audioSink = null;
            this.ensureAudioContext();
            onMetadata?.();
            return;
        }
        this.ensureAudioContext(audioTrack.sampleRate);
        this.audioSink = new (0, _mediabunny.AudioBufferSink)(audioTrack);
        onMetadata?.();
    }
    async runIterator(localId) {
        if (!this.audioSink) return;
        await this.stopIterator();
        this.audioIterator = this.audioSink.buffers(this.currentTime);
        while(true){
            if (localId !== this.asyncId || this.paused) return;
            const nextPromise = this.audioIterator.next();
            // Monitor for buffer starvation
            const checkStarvation = setInterval(()=>{
                if (localId !== this.asyncId || this.paused) {
                    clearInterval(checkStarvation);
                    return;
                }
                if (this.audioContext.state === 'running' && this.audioContext.currentTime >= this.latestScheduledEndTime - 0.2) {
                    this.audioContext.suspend();
                    this.events.emit('waiting');
                }
            }, 50);
            let result;
            try {
                result = await nextPromise;
            } catch (e) {
                console.error('Audio iterator error:', e);
                break;
            } finally{
                clearInterval(checkStarvation);
            }
            if (localId !== this.asyncId || this.paused) return;
            // Resume if was suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
                this.events.emit('canplay');
                this.events.emit('playing');
            }
            if (result.done) break;
            const { buffer, timestamp } = result.value;
            // Schedule audio buffer
            const node = this.audioContext.createBufferSource();
            node.buffer = buffer;
            node.connect(this.gainNode);
            node.playbackRate.value = this.playbackRate;
            const startAt = this.audioContextStartTime + (timestamp - this.playbackTimeAtStart) / this.playbackRate;
            const duration = buffer.duration;
            const endAt = startAt + duration / this.playbackRate;
            if (endAt > this.latestScheduledEndTime) this.latestScheduledEndTime = endAt;
            if (startAt >= this.audioContext.currentTime) node.start(startAt);
            else node.start(this.audioContext.currentTime, (this.audioContext.currentTime - startAt) * this.playbackRate);
            this.queuedNodes.add(node);
            node.onended = ()=>this.queuedNodes.delete(node);
        }
    }
    async play() {
        if (!this.paused) return;
        if (!this.audioContext) this.ensureAudioContext();
        if (this.audioContext.state === 'suspended') await this.audioContext.resume();
        this.audioContextStartTime = this.audioContext.currentTime;
        this.latestScheduledEndTime = this.audioContextStartTime;
        this.paused = false;
        const id = ++this.asyncId;
        this.runIterator(id);
    }
    pause() {
        if (this.paused) return;
        this.playbackTimeAtStart = this.currentTime;
        this.paused = true;
        this.stopIterator();
        this.stopQueuedNodes();
    }
    async seek(time) {
        this.playbackTimeAtStart = Math.max(0, time);
        this.audioContextStartTime = this.audioContext.currentTime;
        this.latestScheduledEndTime = this.audioContextStartTime;
        const id = ++this.asyncId;
        if (!this.paused) this.runIterator(id);
    }
    setVolume(volume, muted) {
        this.volume = volume;
        this.muted = muted;
        this.updateGain();
    }
    setPlaybackRate(rate) {
        if (rate === this.playbackRate) return;
        if (!this.paused) {
            this.playbackTimeAtStart = this.currentTime;
            this.audioContextStartTime = this.audioContext.currentTime;
        }
        this.playbackRate = rate;
        if (!this.paused) {
            const id = ++this.asyncId;
            this.runIterator(id);
        }
    }
    destroy() {
        this.asyncId++;
        this.pause();
        this.audioContext?.close();
        this.audioContext = null;
        this.input = null;
        this.audioSink = null;
    }
}
exports.default = AudioEngine;

},{"mediabunny":"6p2EH","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"6p2EH":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ /// <reference types="dom-mediacapture-transform" preserve="true" />
/// <reference types="dom-webcodecs" preserve="true" />
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Output", ()=>(0, _outputJs.Output));
parcelHelpers.export(exports, "OutputFormat", ()=>(0, _outputFormatJs.OutputFormat));
parcelHelpers.export(exports, "AdtsOutputFormat", ()=>(0, _outputFormatJs.AdtsOutputFormat));
parcelHelpers.export(exports, "FlacOutputFormat", ()=>(0, _outputFormatJs.FlacOutputFormat));
parcelHelpers.export(exports, "IsobmffOutputFormat", ()=>(0, _outputFormatJs.IsobmffOutputFormat));
parcelHelpers.export(exports, "MkvOutputFormat", ()=>(0, _outputFormatJs.MkvOutputFormat));
parcelHelpers.export(exports, "MovOutputFormat", ()=>(0, _outputFormatJs.MovOutputFormat));
parcelHelpers.export(exports, "Mp3OutputFormat", ()=>(0, _outputFormatJs.Mp3OutputFormat));
parcelHelpers.export(exports, "Mp4OutputFormat", ()=>(0, _outputFormatJs.Mp4OutputFormat));
parcelHelpers.export(exports, "OggOutputFormat", ()=>(0, _outputFormatJs.OggOutputFormat));
parcelHelpers.export(exports, "WavOutputFormat", ()=>(0, _outputFormatJs.WavOutputFormat));
parcelHelpers.export(exports, "WebMOutputFormat", ()=>(0, _outputFormatJs.WebMOutputFormat));
parcelHelpers.export(exports, "MediaSource", ()=>(0, _mediaSourceJs.MediaSource));
parcelHelpers.export(exports, "VideoSource", ()=>(0, _mediaSourceJs.VideoSource));
parcelHelpers.export(exports, "AudioSource", ()=>(0, _mediaSourceJs.AudioSource));
parcelHelpers.export(exports, "SubtitleSource", ()=>(0, _mediaSourceJs.SubtitleSource));
parcelHelpers.export(exports, "AudioBufferSource", ()=>(0, _mediaSourceJs.AudioBufferSource));
parcelHelpers.export(exports, "AudioSampleSource", ()=>(0, _mediaSourceJs.AudioSampleSource));
parcelHelpers.export(exports, "CanvasSource", ()=>(0, _mediaSourceJs.CanvasSource));
parcelHelpers.export(exports, "EncodedAudioPacketSource", ()=>(0, _mediaSourceJs.EncodedAudioPacketSource));
parcelHelpers.export(exports, "EncodedVideoPacketSource", ()=>(0, _mediaSourceJs.EncodedVideoPacketSource));
parcelHelpers.export(exports, "MediaStreamAudioTrackSource", ()=>(0, _mediaSourceJs.MediaStreamAudioTrackSource));
parcelHelpers.export(exports, "MediaStreamVideoTrackSource", ()=>(0, _mediaSourceJs.MediaStreamVideoTrackSource));
parcelHelpers.export(exports, "TextSubtitleSource", ()=>(0, _mediaSourceJs.TextSubtitleSource));
parcelHelpers.export(exports, "VideoSampleSource", ()=>(0, _mediaSourceJs.VideoSampleSource));
parcelHelpers.export(exports, "VIDEO_CODECS", ()=>(0, _codecJs.VIDEO_CODECS));
parcelHelpers.export(exports, "AUDIO_CODECS", ()=>(0, _codecJs.AUDIO_CODECS));
parcelHelpers.export(exports, "PCM_AUDIO_CODECS", ()=>(0, _codecJs.PCM_AUDIO_CODECS));
parcelHelpers.export(exports, "NON_PCM_AUDIO_CODECS", ()=>(0, _codecJs.NON_PCM_AUDIO_CODECS));
parcelHelpers.export(exports, "SUBTITLE_CODECS", ()=>(0, _codecJs.SUBTITLE_CODECS));
parcelHelpers.export(exports, "canEncode", ()=>(0, _encodeJs.canEncode));
parcelHelpers.export(exports, "canEncodeVideo", ()=>(0, _encodeJs.canEncodeVideo));
parcelHelpers.export(exports, "canEncodeAudio", ()=>(0, _encodeJs.canEncodeAudio));
parcelHelpers.export(exports, "canEncodeSubtitles", ()=>(0, _encodeJs.canEncodeSubtitles));
parcelHelpers.export(exports, "getEncodableCodecs", ()=>(0, _encodeJs.getEncodableCodecs));
parcelHelpers.export(exports, "getEncodableVideoCodecs", ()=>(0, _encodeJs.getEncodableVideoCodecs));
parcelHelpers.export(exports, "getEncodableAudioCodecs", ()=>(0, _encodeJs.getEncodableAudioCodecs));
parcelHelpers.export(exports, "getEncodableSubtitleCodecs", ()=>(0, _encodeJs.getEncodableSubtitleCodecs));
parcelHelpers.export(exports, "getFirstEncodableVideoCodec", ()=>(0, _encodeJs.getFirstEncodableVideoCodec));
parcelHelpers.export(exports, "getFirstEncodableAudioCodec", ()=>(0, _encodeJs.getFirstEncodableAudioCodec));
parcelHelpers.export(exports, "getFirstEncodableSubtitleCodec", ()=>(0, _encodeJs.getFirstEncodableSubtitleCodec));
parcelHelpers.export(exports, "Quality", ()=>(0, _encodeJs.Quality));
parcelHelpers.export(exports, "QUALITY_VERY_LOW", ()=>(0, _encodeJs.QUALITY_VERY_LOW));
parcelHelpers.export(exports, "QUALITY_LOW", ()=>(0, _encodeJs.QUALITY_LOW));
parcelHelpers.export(exports, "QUALITY_MEDIUM", ()=>(0, _encodeJs.QUALITY_MEDIUM));
parcelHelpers.export(exports, "QUALITY_HIGH", ()=>(0, _encodeJs.QUALITY_HIGH));
parcelHelpers.export(exports, "QUALITY_VERY_HIGH", ()=>(0, _encodeJs.QUALITY_VERY_HIGH));
parcelHelpers.export(exports, "Target", ()=>(0, _targetJs.Target));
parcelHelpers.export(exports, "BufferTarget", ()=>(0, _targetJs.BufferTarget));
parcelHelpers.export(exports, "FilePathTarget", ()=>(0, _targetJs.FilePathTarget));
parcelHelpers.export(exports, "NullTarget", ()=>(0, _targetJs.NullTarget));
parcelHelpers.export(exports, "StreamTarget", ()=>(0, _targetJs.StreamTarget));
parcelHelpers.export(exports, "ALL_TRACK_TYPES", ()=>(0, _outputJs.ALL_TRACK_TYPES));
parcelHelpers.export(exports, "Source", ()=>(0, _sourceJs.Source));
parcelHelpers.export(exports, "BlobSource", ()=>(0, _sourceJs.BlobSource));
parcelHelpers.export(exports, "BufferSource", ()=>(0, _sourceJs.BufferSource));
parcelHelpers.export(exports, "FilePathSource", ()=>(0, _sourceJs.FilePathSource));
parcelHelpers.export(exports, "StreamSource", ()=>(0, _sourceJs.StreamSource));
parcelHelpers.export(exports, "ReadableStreamSource", ()=>(0, _sourceJs.ReadableStreamSource));
parcelHelpers.export(exports, "UrlSource", ()=>(0, _sourceJs.UrlSource));
parcelHelpers.export(exports, "InputFormat", ()=>(0, _inputFormatJs.InputFormat));
parcelHelpers.export(exports, "AdtsInputFormat", ()=>(0, _inputFormatJs.AdtsInputFormat));
parcelHelpers.export(exports, "IsobmffInputFormat", ()=>(0, _inputFormatJs.IsobmffInputFormat));
parcelHelpers.export(exports, "MatroskaInputFormat", ()=>(0, _inputFormatJs.MatroskaInputFormat));
parcelHelpers.export(exports, "Mp3InputFormat", ()=>(0, _inputFormatJs.Mp3InputFormat));
parcelHelpers.export(exports, "Mp4InputFormat", ()=>(0, _inputFormatJs.Mp4InputFormat));
parcelHelpers.export(exports, "OggInputFormat", ()=>(0, _inputFormatJs.OggInputFormat));
parcelHelpers.export(exports, "QuickTimeInputFormat", ()=>(0, _inputFormatJs.QuickTimeInputFormat));
parcelHelpers.export(exports, "WaveInputFormat", ()=>(0, _inputFormatJs.WaveInputFormat));
parcelHelpers.export(exports, "WebMInputFormat", ()=>(0, _inputFormatJs.WebMInputFormat));
parcelHelpers.export(exports, "FlacInputFormat", ()=>(0, _inputFormatJs.FlacInputFormat));
parcelHelpers.export(exports, "ALL_FORMATS", ()=>(0, _inputFormatJs.ALL_FORMATS));
parcelHelpers.export(exports, "ADTS", ()=>(0, _inputFormatJs.ADTS));
parcelHelpers.export(exports, "MATROSKA", ()=>(0, _inputFormatJs.MATROSKA));
parcelHelpers.export(exports, "MP3", ()=>(0, _inputFormatJs.MP3));
parcelHelpers.export(exports, "MP4", ()=>(0, _inputFormatJs.MP4));
parcelHelpers.export(exports, "OGG", ()=>(0, _inputFormatJs.OGG));
parcelHelpers.export(exports, "QTFF", ()=>(0, _inputFormatJs.QTFF));
parcelHelpers.export(exports, "WAVE", ()=>(0, _inputFormatJs.WAVE));
parcelHelpers.export(exports, "WEBM", ()=>(0, _inputFormatJs.WEBM));
parcelHelpers.export(exports, "FLAC", ()=>(0, _inputFormatJs.FLAC));
parcelHelpers.export(exports, "Input", ()=>(0, _inputJs.Input));
parcelHelpers.export(exports, "InputDisposedError", ()=>(0, _inputJs.InputDisposedError));
parcelHelpers.export(exports, "InputTrack", ()=>(0, _inputTrackJs.InputTrack));
parcelHelpers.export(exports, "InputVideoTrack", ()=>(0, _inputTrackJs.InputVideoTrack));
parcelHelpers.export(exports, "InputAudioTrack", ()=>(0, _inputTrackJs.InputAudioTrack));
parcelHelpers.export(exports, "EncodedPacket", ()=>(0, _packetJs.EncodedPacket));
parcelHelpers.export(exports, "AudioSample", ()=>(0, _sampleJs.AudioSample));
parcelHelpers.export(exports, "VideoSample", ()=>(0, _sampleJs.VideoSample));
parcelHelpers.export(exports, "AudioBufferSink", ()=>(0, _mediaSinkJs.AudioBufferSink));
parcelHelpers.export(exports, "AudioSampleSink", ()=>(0, _mediaSinkJs.AudioSampleSink));
parcelHelpers.export(exports, "BaseMediaSampleSink", ()=>(0, _mediaSinkJs.BaseMediaSampleSink));
parcelHelpers.export(exports, "CanvasSink", ()=>(0, _mediaSinkJs.CanvasSink));
parcelHelpers.export(exports, "EncodedPacketSink", ()=>(0, _mediaSinkJs.EncodedPacketSink));
parcelHelpers.export(exports, "VideoSampleSink", ()=>(0, _mediaSinkJs.VideoSampleSink));
parcelHelpers.export(exports, "Conversion", ()=>(0, _conversionJs.Conversion));
parcelHelpers.export(exports, "CustomVideoDecoder", ()=>(0, _customCoderJs.CustomVideoDecoder));
parcelHelpers.export(exports, "CustomVideoEncoder", ()=>(0, _customCoderJs.CustomVideoEncoder));
parcelHelpers.export(exports, "CustomAudioDecoder", ()=>(0, _customCoderJs.CustomAudioDecoder));
parcelHelpers.export(exports, "CustomAudioEncoder", ()=>(0, _customCoderJs.CustomAudioEncoder));
parcelHelpers.export(exports, "registerDecoder", ()=>(0, _customCoderJs.registerDecoder));
parcelHelpers.export(exports, "registerEncoder", ()=>(0, _customCoderJs.registerEncoder));
parcelHelpers.export(exports, "RichImageData", ()=>(0, _metadataJs.RichImageData)) // 🐡🦔
;
parcelHelpers.export(exports, "AttachedFile", ()=>(0, _metadataJs.AttachedFile));
var _outputJs = require("./output.js");
var _outputFormatJs = require("./output-format.js");
var _mediaSourceJs = require("./media-source.js");
var _codecJs = require("./codec.js");
var _encodeJs = require("./encode.js");
var _targetJs = require("./target.js");
var _sourceJs = require("./source.js");
var _inputFormatJs = require("./input-format.js");
var _inputJs = require("./input.js");
var _inputTrackJs = require("./input-track.js");
var _packetJs = require("./packet.js");
var _sampleJs = require("./sample.js");
var _mediaSinkJs = require("./media-sink.js");
var _conversionJs = require("./conversion.js");
var _customCoderJs = require("./custom-coder.js");
var _metadataJs = require("./metadata.js");

},{"./output.js":false,"./output-format.js":false,"./media-source.js":false,"./codec.js":false,"./encode.js":false,"./target.js":false,"./source.js":"99VTc","./input-format.js":"fr7dQ","./input.js":"4IqVo","./input-track.js":false,"./packet.js":false,"./sample.js":false,"./media-sink.js":"6Ym7M","./conversion.js":false,"./custom-coder.js":false,"./metadata.js":false,"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"4oSIO":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "VIDEO_CODECS", ()=>VIDEO_CODECS);
parcelHelpers.export(exports, "PCM_AUDIO_CODECS", ()=>PCM_AUDIO_CODECS);
parcelHelpers.export(exports, "NON_PCM_AUDIO_CODECS", ()=>NON_PCM_AUDIO_CODECS);
parcelHelpers.export(exports, "AUDIO_CODECS", ()=>AUDIO_CODECS);
parcelHelpers.export(exports, "SUBTITLE_CODECS", ()=>SUBTITLE_CODECS);
parcelHelpers.export(exports, "VP9_LEVEL_TABLE", ()=>VP9_LEVEL_TABLE);
parcelHelpers.export(exports, "buildVideoCodecString", ()=>buildVideoCodecString);
parcelHelpers.export(exports, "generateVp9CodecConfigurationFromCodecString", ()=>generateVp9CodecConfigurationFromCodecString);
parcelHelpers.export(exports, "generateAv1CodecConfigurationFromCodecString", ()=>generateAv1CodecConfigurationFromCodecString);
parcelHelpers.export(exports, "extractVideoCodecString", ()=>extractVideoCodecString);
parcelHelpers.export(exports, "buildAudioCodecString", ()=>buildAudioCodecString);
parcelHelpers.export(exports, "extractAudioCodecString", ()=>extractAudioCodecString);
parcelHelpers.export(exports, "aacFrequencyTable", ()=>aacFrequencyTable);
parcelHelpers.export(exports, "aacChannelMap", ()=>aacChannelMap);
parcelHelpers.export(exports, "parseAacAudioSpecificConfig", ()=>parseAacAudioSpecificConfig);
parcelHelpers.export(exports, "buildAacAudioSpecificConfig", ()=>buildAacAudioSpecificConfig);
parcelHelpers.export(exports, "OPUS_SAMPLE_RATE", ()=>OPUS_SAMPLE_RATE);
parcelHelpers.export(exports, "parsePcmCodec", ()=>parsePcmCodec);
parcelHelpers.export(exports, "inferCodecFromCodecString", ()=>inferCodecFromCodecString);
parcelHelpers.export(exports, "getVideoEncoderConfigExtension", ()=>getVideoEncoderConfigExtension);
parcelHelpers.export(exports, "getAudioEncoderConfigExtension", ()=>getAudioEncoderConfigExtension);
parcelHelpers.export(exports, "validateVideoChunkMetadata", ()=>validateVideoChunkMetadata);
parcelHelpers.export(exports, "validateAudioChunkMetadata", ()=>validateAudioChunkMetadata);
parcelHelpers.export(exports, "validateSubtitleMetadata", ()=>validateSubtitleMetadata);
var _miscJs = require("./misc.js");
const VIDEO_CODECS = [
    'avc',
    'hevc',
    'vp9',
    'av1',
    'vp8'
];
const PCM_AUDIO_CODECS = [
    'pcm-s16',
    'pcm-s16be',
    'pcm-s24',
    'pcm-s24be',
    'pcm-s32',
    'pcm-s32be',
    'pcm-f32',
    'pcm-f32be',
    'pcm-f64',
    'pcm-f64be',
    'pcm-u8',
    'pcm-s8',
    'ulaw',
    'alaw'
];
const NON_PCM_AUDIO_CODECS = [
    'aac',
    'opus',
    'mp3',
    'vorbis',
    'flac'
];
const AUDIO_CODECS = [
    ...NON_PCM_AUDIO_CODECS,
    ...PCM_AUDIO_CODECS
];
const SUBTITLE_CODECS = [
    'webvtt'
]; // TODO add the rest
// https://en.wikipedia.org/wiki/Advanced_Video_Coding
const AVC_LEVEL_TABLE = [
    {
        maxMacroblocks: 99,
        maxBitrate: 64000,
        level: 0x0A
    },
    {
        maxMacroblocks: 396,
        maxBitrate: 192000,
        level: 0x0B
    },
    {
        maxMacroblocks: 396,
        maxBitrate: 384000,
        level: 0x0C
    },
    {
        maxMacroblocks: 396,
        maxBitrate: 768000,
        level: 0x0D
    },
    {
        maxMacroblocks: 396,
        maxBitrate: 2000000,
        level: 0x14
    },
    {
        maxMacroblocks: 792,
        maxBitrate: 4000000,
        level: 0x15
    },
    {
        maxMacroblocks: 1620,
        maxBitrate: 4000000,
        level: 0x16
    },
    {
        maxMacroblocks: 1620,
        maxBitrate: 10000000,
        level: 0x1E
    },
    {
        maxMacroblocks: 3600,
        maxBitrate: 14000000,
        level: 0x1F
    },
    {
        maxMacroblocks: 5120,
        maxBitrate: 20000000,
        level: 0x20
    },
    {
        maxMacroblocks: 8192,
        maxBitrate: 20000000,
        level: 0x28
    },
    {
        maxMacroblocks: 8192,
        maxBitrate: 50000000,
        level: 0x29
    },
    {
        maxMacroblocks: 8704,
        maxBitrate: 50000000,
        level: 0x2A
    },
    {
        maxMacroblocks: 22080,
        maxBitrate: 135000000,
        level: 0x32
    },
    {
        maxMacroblocks: 36864,
        maxBitrate: 240000000,
        level: 0x33
    },
    {
        maxMacroblocks: 36864,
        maxBitrate: 240000000,
        level: 0x34
    },
    {
        maxMacroblocks: 139264,
        maxBitrate: 240000000,
        level: 0x3C
    },
    {
        maxMacroblocks: 139264,
        maxBitrate: 480000000,
        level: 0x3D
    },
    {
        maxMacroblocks: 139264,
        maxBitrate: 800000000,
        level: 0x3E
    }
];
// https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding
const HEVC_LEVEL_TABLE = [
    {
        maxPictureSize: 36864,
        maxBitrate: 128000,
        tier: 'L',
        level: 30
    },
    {
        maxPictureSize: 122880,
        maxBitrate: 1500000,
        tier: 'L',
        level: 60
    },
    {
        maxPictureSize: 245760,
        maxBitrate: 3000000,
        tier: 'L',
        level: 63
    },
    {
        maxPictureSize: 552960,
        maxBitrate: 6000000,
        tier: 'L',
        level: 90
    },
    {
        maxPictureSize: 983040,
        maxBitrate: 10000000,
        tier: 'L',
        level: 93
    },
    {
        maxPictureSize: 2228224,
        maxBitrate: 12000000,
        tier: 'L',
        level: 120
    },
    {
        maxPictureSize: 2228224,
        maxBitrate: 30000000,
        tier: 'H',
        level: 120
    },
    {
        maxPictureSize: 2228224,
        maxBitrate: 20000000,
        tier: 'L',
        level: 123
    },
    {
        maxPictureSize: 2228224,
        maxBitrate: 50000000,
        tier: 'H',
        level: 123
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 25000000,
        tier: 'L',
        level: 150
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 100000000,
        tier: 'H',
        level: 150
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 40000000,
        tier: 'L',
        level: 153
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 160000000,
        tier: 'H',
        level: 153
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 60000000,
        tier: 'L',
        level: 156
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 240000000,
        tier: 'H',
        level: 156
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 60000000,
        tier: 'L',
        level: 180
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 240000000,
        tier: 'H',
        level: 180
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 120000000,
        tier: 'L',
        level: 183
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 480000000,
        tier: 'H',
        level: 183
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 240000000,
        tier: 'L',
        level: 186
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 800000000,
        tier: 'H',
        level: 186
    }
];
const VP9_LEVEL_TABLE = [
    {
        maxPictureSize: 36864,
        maxBitrate: 200000,
        level: 10
    },
    {
        maxPictureSize: 73728,
        maxBitrate: 800000,
        level: 11
    },
    {
        maxPictureSize: 122880,
        maxBitrate: 1800000,
        level: 20
    },
    {
        maxPictureSize: 245760,
        maxBitrate: 3600000,
        level: 21
    },
    {
        maxPictureSize: 552960,
        maxBitrate: 7200000,
        level: 30
    },
    {
        maxPictureSize: 983040,
        maxBitrate: 12000000,
        level: 31
    },
    {
        maxPictureSize: 2228224,
        maxBitrate: 18000000,
        level: 40
    },
    {
        maxPictureSize: 2228224,
        maxBitrate: 30000000,
        level: 41
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 60000000,
        level: 50
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 120000000,
        level: 51
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 180000000,
        level: 52
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 180000000,
        level: 60
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 240000000,
        level: 61
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 480000000,
        level: 62
    }
];
// https://en.wikipedia.org/wiki/AV1
const AV1_LEVEL_TABLE = [
    {
        maxPictureSize: 147456,
        maxBitrate: 1500000,
        tier: 'M',
        level: 0
    },
    {
        maxPictureSize: 278784,
        maxBitrate: 3000000,
        tier: 'M',
        level: 1
    },
    {
        maxPictureSize: 665856,
        maxBitrate: 6000000,
        tier: 'M',
        level: 4
    },
    {
        maxPictureSize: 1065024,
        maxBitrate: 10000000,
        tier: 'M',
        level: 5
    },
    {
        maxPictureSize: 2359296,
        maxBitrate: 12000000,
        tier: 'M',
        level: 8
    },
    {
        maxPictureSize: 2359296,
        maxBitrate: 30000000,
        tier: 'H',
        level: 8
    },
    {
        maxPictureSize: 2359296,
        maxBitrate: 20000000,
        tier: 'M',
        level: 9
    },
    {
        maxPictureSize: 2359296,
        maxBitrate: 50000000,
        tier: 'H',
        level: 9
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 30000000,
        tier: 'M',
        level: 12
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 100000000,
        tier: 'H',
        level: 12
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 40000000,
        tier: 'M',
        level: 13
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 160000000,
        tier: 'H',
        level: 13
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 60000000,
        tier: 'M',
        level: 14
    },
    {
        maxPictureSize: 8912896,
        maxBitrate: 240000000,
        tier: 'H',
        level: 14
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 60000000,
        tier: 'M',
        level: 15
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 240000000,
        tier: 'H',
        level: 15
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 60000000,
        tier: 'M',
        level: 16
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 240000000,
        tier: 'H',
        level: 16
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 100000000,
        tier: 'M',
        level: 17
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 480000000,
        tier: 'H',
        level: 17
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 160000000,
        tier: 'M',
        level: 18
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 800000000,
        tier: 'H',
        level: 18
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 160000000,
        tier: 'M',
        level: 19
    },
    {
        maxPictureSize: 35651584,
        maxBitrate: 800000000,
        tier: 'H',
        level: 19
    }
];
const VP9_DEFAULT_SUFFIX = '.01.01.01.01.00';
const AV1_DEFAULT_SUFFIX = '.0.110.01.01.01.0';
const buildVideoCodecString = (codec, width, height, bitrate)=>{
    if (codec === 'avc') {
        const profileIndication = 0x64; // High Profile
        const totalMacroblocks = Math.ceil(width / 16) * Math.ceil(height / 16);
        // Determine the level based on the table
        const levelInfo = AVC_LEVEL_TABLE.find((level)=>totalMacroblocks <= level.maxMacroblocks && bitrate <= level.maxBitrate) ?? (0, _miscJs.last)(AVC_LEVEL_TABLE);
        const levelIndication = levelInfo ? levelInfo.level : 0;
        const hexProfileIndication = profileIndication.toString(16).padStart(2, '0');
        const hexProfileCompatibility = '00';
        const hexLevelIndication = levelIndication.toString(16).padStart(2, '0');
        return `avc1.${hexProfileIndication}${hexProfileCompatibility}${hexLevelIndication}`;
    } else if (codec === 'hevc') {
        const profilePrefix = ''; // Profile space 0
        const profileIdc = 1; // Main Profile
        const compatibilityFlags = '6'; // Taken from the example in ISO 14496-15
        const pictureSize = width * height;
        const levelInfo = HEVC_LEVEL_TABLE.find((level)=>pictureSize <= level.maxPictureSize && bitrate <= level.maxBitrate) ?? (0, _miscJs.last)(HEVC_LEVEL_TABLE);
        const constraintFlags = 'B0'; // Progressive source flag
        return 'hev1.' + `${profilePrefix}${profileIdc}.` + `${compatibilityFlags}.` + `${levelInfo.tier}${levelInfo.level}.` + `${constraintFlags}`;
    } else if (codec === 'vp8') return 'vp8'; // Easy, this one
    else if (codec === 'vp9') {
        const profile = '00'; // Profile 0
        const pictureSize = width * height;
        const levelInfo = VP9_LEVEL_TABLE.find((level)=>pictureSize <= level.maxPictureSize && bitrate <= level.maxBitrate) ?? (0, _miscJs.last)(VP9_LEVEL_TABLE);
        const bitDepth = '08'; // 8-bit
        return `vp09.${profile}.${levelInfo.level.toString().padStart(2, '0')}.${bitDepth}`;
    } else if (codec === 'av1') {
        const profile = 0; // Main Profile, single digit
        const pictureSize = width * height;
        const levelInfo = AV1_LEVEL_TABLE.find((level)=>pictureSize <= level.maxPictureSize && bitrate <= level.maxBitrate) ?? (0, _miscJs.last)(AV1_LEVEL_TABLE);
        const level = levelInfo.level.toString().padStart(2, '0');
        const bitDepth = '08'; // 8-bit
        return `av01.${profile}.${level}${levelInfo.tier}.${bitDepth}`;
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new TypeError(`Unhandled codec '${codec}'.`);
};
const generateVp9CodecConfigurationFromCodecString = (codecString)=>{
    // Reference: https://www.webmproject.org/docs/container/#vp9-codec-feature-metadata-codecprivate
    const parts = codecString.split('.'); // We can derive the required values from the codec string
    const profile = Number(parts[1]);
    const level = Number(parts[2]);
    const bitDepth = Number(parts[3]);
    const chromaSubsampling = parts[4] ? Number(parts[4]) : 1;
    return [
        1,
        1,
        profile,
        2,
        1,
        level,
        3,
        1,
        bitDepth,
        4,
        1,
        chromaSubsampling
    ];
};
const generateAv1CodecConfigurationFromCodecString = (codecString)=>{
    // Reference: https://aomediacodec.github.io/av1-isobmff/
    const parts = codecString.split('.'); // We can derive the required values from the codec string
    const marker = 1;
    const version = 1;
    const firstByte = (marker << 7) + version;
    const profile = Number(parts[1]);
    const levelAndTier = parts[2];
    const level = Number(levelAndTier.slice(0, -1));
    const secondByte = (profile << 5) + level;
    const tier = levelAndTier.slice(-1) === 'H' ? 1 : 0;
    const bitDepth = Number(parts[3]);
    const highBitDepth = bitDepth === 8 ? 0 : 1;
    const twelveBit = 0;
    const monochrome = parts[4] ? Number(parts[4]) : 0;
    const chromaSubsamplingX = parts[5] ? Number(parts[5][0]) : 1;
    const chromaSubsamplingY = parts[5] ? Number(parts[5][1]) : 1;
    const chromaSamplePosition = parts[5] ? Number(parts[5][2]) : 0; // CSP_UNKNOWN
    const thirdByte = (tier << 7) + (highBitDepth << 6) + (twelveBit << 5) + (monochrome << 4) + (chromaSubsamplingX << 3) + (chromaSubsamplingY << 2) + chromaSamplePosition;
    const initialPresentationDelayPresent = 0; // Should be fine
    const fourthByte = initialPresentationDelayPresent;
    return [
        firstByte,
        secondByte,
        thirdByte,
        fourthByte
    ];
};
const extractVideoCodecString = (trackInfo)=>{
    const { codec, codecDescription, colorSpace, avcCodecInfo, hevcCodecInfo, vp9CodecInfo, av1CodecInfo } = trackInfo;
    if (codec === 'avc') {
        (0, _miscJs.assert)(trackInfo.avcType !== null);
        if (avcCodecInfo) {
            const bytes = new Uint8Array([
                avcCodecInfo.avcProfileIndication,
                avcCodecInfo.profileCompatibility,
                avcCodecInfo.avcLevelIndication
            ]);
            return `avc${trackInfo.avcType}.${(0, _miscJs.bytesToHexString)(bytes)}`;
        }
        if (!codecDescription || codecDescription.byteLength < 4) throw new TypeError('AVC decoder description is not provided or is not at least 4 bytes long.');
        return `avc${trackInfo.avcType}.${(0, _miscJs.bytesToHexString)(codecDescription.subarray(1, 4))}`;
    } else if (codec === 'hevc') {
        let generalProfileSpace;
        let generalProfileIdc;
        let compatibilityFlags;
        let generalTierFlag;
        let generalLevelIdc;
        let constraintFlags;
        if (hevcCodecInfo) {
            generalProfileSpace = hevcCodecInfo.generalProfileSpace;
            generalProfileIdc = hevcCodecInfo.generalProfileIdc;
            compatibilityFlags = (0, _miscJs.reverseBitsU32)(hevcCodecInfo.generalProfileCompatibilityFlags);
            generalTierFlag = hevcCodecInfo.generalTierFlag;
            generalLevelIdc = hevcCodecInfo.generalLevelIdc;
            constraintFlags = [
                ...hevcCodecInfo.generalConstraintIndicatorFlags
            ];
        } else {
            if (!codecDescription || codecDescription.byteLength < 23) throw new TypeError('HEVC decoder description is not provided or is not at least 23 bytes long.');
            const view = (0, _miscJs.toDataView)(codecDescription);
            const profileByte = view.getUint8(1);
            generalProfileSpace = profileByte >> 6 & 0x03;
            generalProfileIdc = profileByte & 0x1F;
            compatibilityFlags = (0, _miscJs.reverseBitsU32)(view.getUint32(2));
            generalTierFlag = profileByte >> 5 & 0x01;
            generalLevelIdc = view.getUint8(12);
            constraintFlags = [];
            for(let i = 0; i < 6; i++)constraintFlags.push(view.getUint8(6 + i));
        }
        let codecString = 'hev1.';
        codecString += [
            '',
            'A',
            'B',
            'C'
        ][generalProfileSpace] + generalProfileIdc;
        codecString += '.';
        codecString += compatibilityFlags.toString(16).toUpperCase();
        codecString += '.';
        codecString += generalTierFlag === 0 ? 'L' : 'H';
        codecString += generalLevelIdc;
        while(constraintFlags.length > 0 && constraintFlags[constraintFlags.length - 1] === 0)constraintFlags.pop();
        if (constraintFlags.length > 0) {
            codecString += '.';
            codecString += constraintFlags.map((x)=>x.toString(16).toUpperCase()).join('.');
        }
        return codecString;
    } else if (codec === 'vp8') return 'vp8'; // Easy, this one
    else if (codec === 'vp9') {
        if (!vp9CodecInfo) {
            // Calculate level based on dimensions
            const pictureSize = trackInfo.width * trackInfo.height;
            let level = (0, _miscJs.last)(VP9_LEVEL_TABLE).level; // Default to highest level
            for (const entry of VP9_LEVEL_TABLE)if (pictureSize <= entry.maxPictureSize) {
                level = entry.level;
                break;
            }
            // We don't really know better, so let's return a general-purpose, common codec string and hope for the best
            return `vp09.00.${level.toString().padStart(2, '0')}.08`;
        }
        const profile = vp9CodecInfo.profile.toString().padStart(2, '0');
        const level = vp9CodecInfo.level.toString().padStart(2, '0');
        const bitDepth = vp9CodecInfo.bitDepth.toString().padStart(2, '0');
        const chromaSubsampling = vp9CodecInfo.chromaSubsampling.toString().padStart(2, '0');
        const colourPrimaries = vp9CodecInfo.colourPrimaries.toString().padStart(2, '0');
        const transferCharacteristics = vp9CodecInfo.transferCharacteristics.toString().padStart(2, '0');
        const matrixCoefficients = vp9CodecInfo.matrixCoefficients.toString().padStart(2, '0');
        const videoFullRangeFlag = vp9CodecInfo.videoFullRangeFlag.toString().padStart(2, '0');
        let string = `vp09.${profile}.${level}.${bitDepth}.${chromaSubsampling}`;
        string += `.${colourPrimaries}.${transferCharacteristics}.${matrixCoefficients}.${videoFullRangeFlag}`;
        if (string.endsWith(VP9_DEFAULT_SUFFIX)) string = string.slice(0, -VP9_DEFAULT_SUFFIX.length);
        return string;
    } else if (codec === 'av1') {
        if (!av1CodecInfo) {
            // Calculate level based on dimensions
            const pictureSize = trackInfo.width * trackInfo.height;
            let level = (0, _miscJs.last)(VP9_LEVEL_TABLE).level; // Default to highest level
            for (const entry of VP9_LEVEL_TABLE)if (pictureSize <= entry.maxPictureSize) {
                level = entry.level;
                break;
            }
            // We don't really know better, so let's return a general-purpose, common codec string and hope for the best
            return `av01.0.${level.toString().padStart(2, '0')}M.08`;
        }
        // https://aomediacodec.github.io/av1-isobmff/#codecsparam
        const profile = av1CodecInfo.profile; // Single digit
        const level = av1CodecInfo.level.toString().padStart(2, '0');
        const tier = av1CodecInfo.tier ? 'H' : 'M';
        const bitDepth = av1CodecInfo.bitDepth.toString().padStart(2, '0');
        const monochrome = av1CodecInfo.monochrome ? '1' : '0';
        const chromaSubsampling = 100 * av1CodecInfo.chromaSubsamplingX + 10 * av1CodecInfo.chromaSubsamplingY + 1 * (av1CodecInfo.chromaSubsamplingX && av1CodecInfo.chromaSubsamplingY ? av1CodecInfo.chromaSamplePosition : 0);
        // The defaults are 1 (ITU-R BT.709)
        const colorPrimaries = colorSpace?.primaries ? (0, _miscJs.COLOR_PRIMARIES_MAP)[colorSpace.primaries] : 1;
        const transferCharacteristics = colorSpace?.transfer ? (0, _miscJs.TRANSFER_CHARACTERISTICS_MAP)[colorSpace.transfer] : 1;
        const matrixCoefficients = colorSpace?.matrix ? (0, _miscJs.MATRIX_COEFFICIENTS_MAP)[colorSpace.matrix] : 1;
        const videoFullRangeFlag = colorSpace?.fullRange ? 1 : 0;
        let string = `av01.${profile}.${level}${tier}.${bitDepth}`;
        string += `.${monochrome}.${chromaSubsampling.toString().padStart(3, '0')}`;
        string += `.${colorPrimaries.toString().padStart(2, '0')}`;
        string += `.${transferCharacteristics.toString().padStart(2, '0')}`;
        string += `.${matrixCoefficients.toString().padStart(2, '0')}`;
        string += `.${videoFullRangeFlag}`;
        if (string.endsWith(AV1_DEFAULT_SUFFIX)) string = string.slice(0, -AV1_DEFAULT_SUFFIX.length);
        return string;
    }
    throw new TypeError(`Unhandled codec '${codec}'.`);
};
const buildAudioCodecString = (codec, numberOfChannels, sampleRate)=>{
    if (codec === 'aac') {
        // If stereo or higher channels and lower sample rate, likely using HE-AAC v2 with PS
        if (numberOfChannels >= 2 && sampleRate <= 24000) return 'mp4a.40.29'; // HE-AAC v2 (AAC LC + SBR + PS)
        // If sample rate is low, likely using HE-AAC v1 with SBR
        if (sampleRate <= 24000) return 'mp4a.40.5'; // HE-AAC v1 (AAC LC + SBR)
        // Default to standard AAC-LC for higher sample rates
        return 'mp4a.40.2'; // AAC-LC
    } else if (codec === 'mp3') return 'mp3';
    else if (codec === 'opus') return 'opus';
    else if (codec === 'vorbis') return 'vorbis';
    else if (codec === 'flac') return 'flac';
    else if (PCM_AUDIO_CODECS.includes(codec)) return codec;
    throw new TypeError(`Unhandled codec '${codec}'.`);
};
const extractAudioCodecString = (trackInfo)=>{
    const { codec, codecDescription, aacCodecInfo } = trackInfo;
    if (codec === 'aac') {
        if (!aacCodecInfo) throw new TypeError('AAC codec info must be provided.');
        if (aacCodecInfo.isMpeg2) return 'mp4a.67';
        else {
            const audioSpecificConfig = parseAacAudioSpecificConfig(codecDescription);
            return `mp4a.40.${audioSpecificConfig.objectType}`;
        }
    } else if (codec === 'mp3') return 'mp3';
    else if (codec === 'opus') return 'opus';
    else if (codec === 'vorbis') return 'vorbis';
    else if (codec === 'flac') return 'flac';
    else if (codec && PCM_AUDIO_CODECS.includes(codec)) return codec;
    throw new TypeError(`Unhandled codec '${codec}'.`);
};
const aacFrequencyTable = [
    96000,
    88200,
    64000,
    48000,
    44100,
    32000,
    24000,
    22050,
    16000,
    12000,
    11025,
    8000,
    7350
];
const aacChannelMap = [
    -1,
    1,
    2,
    3,
    4,
    5,
    6,
    8
];
const parseAacAudioSpecificConfig = (bytes)=>{
    if (!bytes || bytes.byteLength < 2) throw new TypeError('AAC description must be at least 2 bytes long.');
    const bitstream = new (0, _miscJs.Bitstream)(bytes);
    let objectType = bitstream.readBits(5);
    if (objectType === 31) objectType = 32 + bitstream.readBits(6);
    const frequencyIndex = bitstream.readBits(4);
    let sampleRate = null;
    if (frequencyIndex === 15) sampleRate = bitstream.readBits(24);
    else if (frequencyIndex < aacFrequencyTable.length) sampleRate = aacFrequencyTable[frequencyIndex];
    const channelConfiguration = bitstream.readBits(4);
    let numberOfChannels = null;
    if (channelConfiguration >= 1 && channelConfiguration <= 7) numberOfChannels = aacChannelMap[channelConfiguration];
    return {
        objectType,
        frequencyIndex,
        sampleRate,
        channelConfiguration,
        numberOfChannels
    };
};
const buildAacAudioSpecificConfig = (config)=>{
    let frequencyIndex = aacFrequencyTable.indexOf(config.sampleRate);
    let customSampleRate = null;
    if (frequencyIndex === -1) {
        frequencyIndex = 15;
        customSampleRate = config.sampleRate;
    }
    const channelConfiguration = aacChannelMap.indexOf(config.numberOfChannels);
    if (channelConfiguration === -1) throw new TypeError(`Unsupported number of channels: ${config.numberOfChannels}`);
    let bitCount = 13;
    if (config.objectType >= 32) bitCount += 6;
    if (frequencyIndex === 15) bitCount += 24;
    const byteCount = Math.ceil(bitCount / 8);
    const bytes = new Uint8Array(byteCount);
    const bitstream = new (0, _miscJs.Bitstream)(bytes);
    if (config.objectType < 32) bitstream.writeBits(5, config.objectType);
    else {
        bitstream.writeBits(5, 31);
        bitstream.writeBits(6, config.objectType - 32);
    }
    bitstream.writeBits(4, frequencyIndex);
    if (frequencyIndex === 15) bitstream.writeBits(24, customSampleRate);
    bitstream.writeBits(4, channelConfiguration);
    return bytes;
};
const OPUS_SAMPLE_RATE = 48000;
const PCM_CODEC_REGEX = /^pcm-([usf])(\d+)+(be)?$/;
const parsePcmCodec = (codec)=>{
    (0, _miscJs.assert)(PCM_AUDIO_CODECS.includes(codec));
    if (codec === 'ulaw') return {
        dataType: 'ulaw',
        sampleSize: 1,
        littleEndian: true,
        silentValue: 255
    };
    else if (codec === 'alaw') return {
        dataType: 'alaw',
        sampleSize: 1,
        littleEndian: true,
        silentValue: 213
    };
    const match = PCM_CODEC_REGEX.exec(codec);
    (0, _miscJs.assert)(match);
    let dataType;
    if (match[1] === 'u') dataType = 'unsigned';
    else if (match[1] === 's') dataType = 'signed';
    else dataType = 'float';
    const sampleSize = Number(match[2]) / 8;
    const littleEndian = match[3] !== 'be';
    const silentValue = codec === 'pcm-u8' ? 128 : 0;
    return {
        dataType,
        sampleSize,
        littleEndian,
        silentValue
    };
};
const inferCodecFromCodecString = (codecString)=>{
    // Video codecs
    if (codecString.startsWith('avc1') || codecString.startsWith('avc3')) return 'avc';
    else if (codecString.startsWith('hev1') || codecString.startsWith('hvc1')) return 'hevc';
    else if (codecString === 'vp8') return 'vp8';
    else if (codecString.startsWith('vp09')) return 'vp9';
    else if (codecString.startsWith('av01')) return 'av1';
    // Audio codecs
    if (codecString.startsWith('mp4a.40') || codecString === 'mp4a.67') return 'aac';
    else if (codecString === 'mp3' || codecString === 'mp4a.69' || codecString === 'mp4a.6B' || codecString === 'mp4a.6b') return 'mp3';
    else if (codecString === 'opus') return 'opus';
    else if (codecString === 'vorbis') return 'vorbis';
    else if (codecString === 'flac') return 'flac';
    else if (codecString === 'ulaw') return 'ulaw';
    else if (codecString === 'alaw') return 'alaw';
    else if (PCM_CODEC_REGEX.test(codecString)) return codecString;
    // Subtitle codecs
    if (codecString === 'webvtt') return 'webvtt';
    return null;
};
const getVideoEncoderConfigExtension = (codec)=>{
    if (codec === 'avc') return {
        avc: {
            format: 'avc'
        }
    };
    else if (codec === 'hevc') return {
        hevc: {
            format: 'hevc'
        }
    };
    return {};
};
const getAudioEncoderConfigExtension = (codec)=>{
    if (codec === 'aac') return {
        aac: {
            format: 'aac'
        }
    };
    else if (codec === 'opus') return {
        opus: {
            format: 'opus'
        }
    };
    return {};
};
const VALID_VIDEO_CODEC_STRING_PREFIXES = [
    'avc1',
    'avc3',
    'hev1',
    'hvc1',
    'vp8',
    'vp09',
    'av01'
];
const AVC_CODEC_STRING_REGEX = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/;
const HEVC_CODEC_STRING_REGEX = /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/;
const VP9_CODEC_STRING_REGEX = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/;
const AV1_CODEC_STRING_REGEX = /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/;
const validateVideoChunkMetadata = (metadata)=>{
    if (!metadata) throw new TypeError('Video chunk metadata must be provided.');
    if (typeof metadata !== 'object') throw new TypeError('Video chunk metadata must be an object.');
    if (!metadata.decoderConfig) throw new TypeError('Video chunk metadata must include a decoder configuration.');
    if (typeof metadata.decoderConfig !== 'object') throw new TypeError('Video chunk metadata decoder configuration must be an object.');
    if (typeof metadata.decoderConfig.codec !== 'string') throw new TypeError('Video chunk metadata decoder configuration must specify a codec string.');
    if (!VALID_VIDEO_CODEC_STRING_PREFIXES.some((prefix)=>metadata.decoderConfig.codec.startsWith(prefix))) throw new TypeError("Video chunk metadata decoder configuration codec string must be a valid video codec string as specified in the WebCodecs Codec Registry.");
    if (!Number.isInteger(metadata.decoderConfig.codedWidth) || metadata.decoderConfig.codedWidth <= 0) throw new TypeError('Video chunk metadata decoder configuration must specify a valid codedWidth (positive integer).');
    if (!Number.isInteger(metadata.decoderConfig.codedHeight) || metadata.decoderConfig.codedHeight <= 0) throw new TypeError('Video chunk metadata decoder configuration must specify a valid codedHeight (positive integer).');
    if (metadata.decoderConfig.description !== undefined) {
        if (!(0, _miscJs.isAllowSharedBufferSource)(metadata.decoderConfig.description)) throw new TypeError("Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
    }
    if (metadata.decoderConfig.colorSpace !== undefined) {
        const { colorSpace } = metadata.decoderConfig;
        if (typeof colorSpace !== 'object') throw new TypeError('Video chunk metadata decoder configuration colorSpace, when provided, must be an object.');
        const primariesValues = Object.keys((0, _miscJs.COLOR_PRIMARIES_MAP));
        if (colorSpace.primaries != null && !primariesValues.includes(colorSpace.primaries)) throw new TypeError(`Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of` + ` ${primariesValues.join(', ')}.`);
        const transferValues = Object.keys((0, _miscJs.TRANSFER_CHARACTERISTICS_MAP));
        if (colorSpace.transfer != null && !transferValues.includes(colorSpace.transfer)) throw new TypeError(`Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of` + ` ${transferValues.join(', ')}.`);
        const matrixValues = Object.keys((0, _miscJs.MATRIX_COEFFICIENTS_MAP));
        if (colorSpace.matrix != null && !matrixValues.includes(colorSpace.matrix)) throw new TypeError(`Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of` + ` ${matrixValues.join(', ')}.`);
        if (colorSpace.fullRange != null && typeof colorSpace.fullRange !== 'boolean') throw new TypeError('Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.');
    }
    if (metadata.decoderConfig.codec.startsWith('avc1') || metadata.decoderConfig.codec.startsWith('avc3')) {
        // AVC-specific validation
        if (!AVC_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) throw new TypeError("Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.");
    // `description` may or may not be set, depending on if the format is AVCC or Annex B, so don't perform any
    // validation for it.
    // https://www.w3.org/TR/webcodecs-avc-codec-registration
    } else if (metadata.decoderConfig.codec.startsWith('hev1') || metadata.decoderConfig.codec.startsWith('hvc1')) {
        // HEVC-specific validation
        if (!HEVC_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) throw new TypeError("Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.");
    // `description` may or may not be set, depending on if the format is HEVC or Annex B, so don't perform any
    // validation for it.
    // https://www.w3.org/TR/webcodecs-hevc-codec-registration
    } else if (metadata.decoderConfig.codec.startsWith('vp8')) {
        // VP8-specific validation
        if (metadata.decoderConfig.codec !== 'vp8') throw new TypeError('Video chunk metadata decoder configuration codec string for VP8 must be "vp8".');
    } else if (metadata.decoderConfig.codec.startsWith('vp09')) {
        // VP9-specific validation
        if (!VP9_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) throw new TypeError('Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.');
    } else if (metadata.decoderConfig.codec.startsWith('av01')) {
        // AV1-specific validation
        if (!AV1_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) throw new TypeError('Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.');
    }
};
const VALID_AUDIO_CODEC_STRING_PREFIXES = [
    'mp4a',
    'mp3',
    'opus',
    'vorbis',
    'flac',
    'ulaw',
    'alaw',
    'pcm'
];
const validateAudioChunkMetadata = (metadata)=>{
    if (!metadata) throw new TypeError('Audio chunk metadata must be provided.');
    if (typeof metadata !== 'object') throw new TypeError('Audio chunk metadata must be an object.');
    if (!metadata.decoderConfig) throw new TypeError('Audio chunk metadata must include a decoder configuration.');
    if (typeof metadata.decoderConfig !== 'object') throw new TypeError('Audio chunk metadata decoder configuration must be an object.');
    if (typeof metadata.decoderConfig.codec !== 'string') throw new TypeError('Audio chunk metadata decoder configuration must specify a codec string.');
    if (!VALID_AUDIO_CODEC_STRING_PREFIXES.some((prefix)=>metadata.decoderConfig.codec.startsWith(prefix))) throw new TypeError("Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the WebCodecs Codec Registry.");
    if (!Number.isInteger(metadata.decoderConfig.sampleRate) || metadata.decoderConfig.sampleRate <= 0) throw new TypeError('Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).');
    if (!Number.isInteger(metadata.decoderConfig.numberOfChannels) || metadata.decoderConfig.numberOfChannels <= 0) throw new TypeError('Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).');
    if (metadata.decoderConfig.description !== undefined) {
        if (!(0, _miscJs.isAllowSharedBufferSource)(metadata.decoderConfig.description)) throw new TypeError("Audio chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
    }
    if (metadata.decoderConfig.codec.startsWith('mp4a') && metadata.decoderConfig.codec !== 'mp4a.69' && metadata.decoderConfig.codec !== 'mp4a.6B' && metadata.decoderConfig.codec !== 'mp4a.6b') {
        // AAC-specific validation
        const validStrings = [
            'mp4a.40.2',
            'mp4a.40.02',
            'mp4a.40.5',
            'mp4a.40.05',
            'mp4a.40.29',
            'mp4a.67'
        ];
        if (!validStrings.includes(metadata.decoderConfig.codec)) throw new TypeError("Audio chunk metadata decoder configuration codec string for AAC must be a valid AAC codec string as specified in https://www.w3.org/TR/webcodecs-aac-codec-registration/.");
        if (!metadata.decoderConfig.description) throw new TypeError("Audio chunk metadata decoder configuration for AAC must include a description, which is expected to be an AudioSpecificConfig as specified in ISO 14496-3.");
    } else if (metadata.decoderConfig.codec.startsWith('mp3') || metadata.decoderConfig.codec.startsWith('mp4a')) {
        // MP3-specific validation
        if (metadata.decoderConfig.codec !== 'mp3' && metadata.decoderConfig.codec !== 'mp4a.69' && metadata.decoderConfig.codec !== 'mp4a.6B' && metadata.decoderConfig.codec !== 'mp4a.6b') throw new TypeError('Audio chunk metadata decoder configuration codec string for MP3 must be "mp3", "mp4a.69" or "mp4a.6B".');
    } else if (metadata.decoderConfig.codec.startsWith('opus')) {
        // Opus-specific validation
        if (metadata.decoderConfig.codec !== 'opus') throw new TypeError('Audio chunk metadata decoder configuration codec string for Opus must be "opus".');
        if (metadata.decoderConfig.description && metadata.decoderConfig.description.byteLength < 18) // Description is optional for Opus per-spec, so we shouldn't enforce it
        throw new TypeError("Audio chunk metadata decoder configuration description, when specified, is expected to be an Identification Header as specified in Section 5.1 of RFC 7845.");
    } else if (metadata.decoderConfig.codec.startsWith('vorbis')) {
        // Vorbis-specific validation
        if (metadata.decoderConfig.codec !== 'vorbis') throw new TypeError('Audio chunk metadata decoder configuration codec string for Vorbis must be "vorbis".');
        if (!metadata.decoderConfig.description) throw new TypeError("Audio chunk metadata decoder configuration for Vorbis must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-vorbis-codec-registration/.");
    } else if (metadata.decoderConfig.codec.startsWith('flac')) {
        // FLAC-specific validation
        if (metadata.decoderConfig.codec !== 'flac') throw new TypeError('Audio chunk metadata decoder configuration codec string for FLAC must be "flac".');
        const minDescriptionSize = 42; // 'fLaC' + metadata block header + STREAMINFO block
        if (!metadata.decoderConfig.description || metadata.decoderConfig.description.byteLength < minDescriptionSize) throw new TypeError("Audio chunk metadata decoder configuration for FLAC must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-flac-codec-registration/.");
    } else if (metadata.decoderConfig.codec.startsWith('pcm') || metadata.decoderConfig.codec.startsWith('ulaw') || metadata.decoderConfig.codec.startsWith('alaw')) {
        // PCM-specific validation
        if (!PCM_AUDIO_CODECS.includes(metadata.decoderConfig.codec)) throw new TypeError('Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM' + ` codecs (${PCM_AUDIO_CODECS.join(', ')}).`);
    }
};
const validateSubtitleMetadata = (metadata)=>{
    if (!metadata) throw new TypeError('Subtitle metadata must be provided.');
    if (typeof metadata !== 'object') throw new TypeError('Subtitle metadata must be an object.');
    if (!metadata.config) throw new TypeError('Subtitle metadata must include a config object.');
    if (typeof metadata.config !== 'object') throw new TypeError('Subtitle metadata config must be an object.');
    if (typeof metadata.config.description !== 'string') throw new TypeError('Subtitle metadata config description must be a string.');
};

},{"./misc.js":"kkhLS","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"kkhLS":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "assert", ()=>assert);
parcelHelpers.export(exports, "normalizeRotation", ()=>normalizeRotation);
parcelHelpers.export(exports, "last", ()=>last);
parcelHelpers.export(exports, "isU32", ()=>isU32);
parcelHelpers.export(exports, "Bitstream", ()=>Bitstream);
parcelHelpers.export(exports, "readExpGolomb", ()=>readExpGolomb);
parcelHelpers.export(exports, "readSignedExpGolomb", ()=>readSignedExpGolomb);
parcelHelpers.export(exports, "writeBits", ()=>writeBits);
parcelHelpers.export(exports, "toUint8Array", ()=>toUint8Array);
parcelHelpers.export(exports, "toDataView", ()=>toDataView);
parcelHelpers.export(exports, "textDecoder", ()=>textDecoder);
parcelHelpers.export(exports, "textEncoder", ()=>textEncoder);
parcelHelpers.export(exports, "isIso88591Compatible", ()=>isIso88591Compatible);
parcelHelpers.export(exports, "COLOR_PRIMARIES_MAP", ()=>COLOR_PRIMARIES_MAP);
parcelHelpers.export(exports, "COLOR_PRIMARIES_MAP_INVERSE", ()=>COLOR_PRIMARIES_MAP_INVERSE);
parcelHelpers.export(exports, "TRANSFER_CHARACTERISTICS_MAP", ()=>TRANSFER_CHARACTERISTICS_MAP);
parcelHelpers.export(exports, "TRANSFER_CHARACTERISTICS_MAP_INVERSE", ()=>TRANSFER_CHARACTERISTICS_MAP_INVERSE);
parcelHelpers.export(exports, "MATRIX_COEFFICIENTS_MAP", ()=>MATRIX_COEFFICIENTS_MAP);
parcelHelpers.export(exports, "MATRIX_COEFFICIENTS_MAP_INVERSE", ()=>MATRIX_COEFFICIENTS_MAP_INVERSE);
parcelHelpers.export(exports, "colorSpaceIsComplete", ()=>colorSpaceIsComplete);
parcelHelpers.export(exports, "isAllowSharedBufferSource", ()=>isAllowSharedBufferSource);
parcelHelpers.export(exports, "AsyncMutex", ()=>AsyncMutex);
parcelHelpers.export(exports, "bytesToHexString", ()=>bytesToHexString);
parcelHelpers.export(exports, "reverseBitsU32", ()=>reverseBitsU32);
parcelHelpers.export(exports, "binarySearchExact", ()=>binarySearchExact);
parcelHelpers.export(exports, "binarySearchLessOrEqual", ()=>binarySearchLessOrEqual);
parcelHelpers.export(exports, "insertSorted", ()=>insertSorted);
parcelHelpers.export(exports, "promiseWithResolvers", ()=>promiseWithResolvers);
parcelHelpers.export(exports, "removeItem", ()=>removeItem);
parcelHelpers.export(exports, "findLast", ()=>findLast);
parcelHelpers.export(exports, "findLastIndex", ()=>findLastIndex);
parcelHelpers.export(exports, "toAsyncIterator", ()=>toAsyncIterator);
parcelHelpers.export(exports, "validateAnyIterable", ()=>validateAnyIterable);
parcelHelpers.export(exports, "assertNever", ()=>assertNever);
parcelHelpers.export(exports, "getUint24", ()=>getUint24);
parcelHelpers.export(exports, "getInt24", ()=>getInt24);
parcelHelpers.export(exports, "setUint24", ()=>setUint24);
parcelHelpers.export(exports, "setInt24", ()=>setInt24);
parcelHelpers.export(exports, "setInt64", ()=>setInt64);
parcelHelpers.export(exports, "mapAsyncGenerator", ()=>mapAsyncGenerator);
parcelHelpers.export(exports, "clamp", ()=>clamp);
parcelHelpers.export(exports, "UNDETERMINED_LANGUAGE", ()=>UNDETERMINED_LANGUAGE);
parcelHelpers.export(exports, "roundIfAlmostInteger", ()=>roundIfAlmostInteger);
parcelHelpers.export(exports, "roundToMultiple", ()=>roundToMultiple);
parcelHelpers.export(exports, "ilog", ()=>ilog);
parcelHelpers.export(exports, "isIso639Dash2LanguageCode", ()=>isIso639Dash2LanguageCode);
parcelHelpers.export(exports, "SECOND_TO_MICROSECOND_FACTOR", ()=>SECOND_TO_MICROSECOND_FACTOR);
parcelHelpers.export(exports, "mergeRequestInit", ()=>mergeRequestInit);
parcelHelpers.export(exports, "retriedFetch", ()=>retriedFetch);
parcelHelpers.export(exports, "computeRationalApproximation", ()=>computeRationalApproximation);
parcelHelpers.export(exports, "CallSerializer", ()=>CallSerializer);
parcelHelpers.export(exports, "isWebKit", ()=>isWebKit);
parcelHelpers.export(exports, "isFirefox", ()=>isFirefox);
parcelHelpers.export(exports, "isChromium", ()=>isChromium);
parcelHelpers.export(exports, "getChromiumVersion", ()=>getChromiumVersion);
parcelHelpers.export(exports, "coalesceIndex", ()=>coalesceIndex);
parcelHelpers.export(exports, "closedIntervalsOverlap", ()=>closedIntervalsOverlap);
parcelHelpers.export(exports, "keyValueIterator", ()=>keyValueIterator);
parcelHelpers.export(exports, "imageMimeTypeToExtension", ()=>imageMimeTypeToExtension);
parcelHelpers.export(exports, "base64ToBytes", ()=>base64ToBytes);
parcelHelpers.export(exports, "bytesToBase64", ()=>bytesToBase64);
parcelHelpers.export(exports, "uint8ArraysAreEqual", ()=>uint8ArraysAreEqual);
parcelHelpers.export(exports, "polyfillSymbolDispose", ()=>polyfillSymbolDispose);
parcelHelpers.export(exports, "isNumber", ()=>isNumber);
function assert(x) {
    if (!x) throw new Error('Assertion failed.');
}
const normalizeRotation = (rotation)=>{
    const mappedRotation = (rotation % 360 + 360) % 360;
    if (mappedRotation === 0 || mappedRotation === 90 || mappedRotation === 180 || mappedRotation === 270) return mappedRotation;
    else throw new Error(`Invalid rotation ${rotation}.`);
};
const last = (arr)=>{
    return arr && arr[arr.length - 1];
};
const isU32 = (value)=>{
    return value >= 0 && value < 2 ** 32;
};
class Bitstream {
    constructor(bytes){
        this.bytes = bytes;
        /** Current offset in bits. */ this.pos = 0;
    }
    seekToByte(byteOffset) {
        this.pos = 8 * byteOffset;
    }
    readBit() {
        const byteIndex = Math.floor(this.pos / 8);
        const byte = this.bytes[byteIndex] ?? 0;
        const bitIndex = 7 - (this.pos & 7);
        const bit = (byte & 1 << bitIndex) >> bitIndex;
        this.pos++;
        return bit;
    }
    readBits(n) {
        if (n === 1) return this.readBit();
        let result = 0;
        for(let i = 0; i < n; i++){
            result <<= 1;
            result |= this.readBit();
        }
        return result;
    }
    writeBits(n, value) {
        const end = this.pos + n;
        for(let i = this.pos; i < end; i++){
            const byteIndex = Math.floor(i / 8);
            let byte = this.bytes[byteIndex];
            const bitIndex = 7 - (i & 7);
            byte &= ~(1 << bitIndex);
            byte |= (value & 1 << end - i - 1) >> end - i - 1 << bitIndex;
            this.bytes[byteIndex] = byte;
        }
        this.pos = end;
    }
    readAlignedByte() {
        // Ensure we're byte-aligned
        if (this.pos % 8 !== 0) throw new Error('Bitstream is not byte-aligned.');
        const byteIndex = this.pos / 8;
        const byte = this.bytes[byteIndex] ?? 0;
        this.pos += 8;
        return byte;
    }
    skipBits(n) {
        this.pos += n;
    }
    getBitsLeft() {
        return this.bytes.length * 8 - this.pos;
    }
    clone() {
        const clone = new Bitstream(this.bytes);
        clone.pos = this.pos;
        return clone;
    }
}
const readExpGolomb = (bitstream)=>{
    let leadingZeroBits = 0;
    while(bitstream.readBits(1) === 0 && leadingZeroBits < 32)leadingZeroBits++;
    if (leadingZeroBits >= 32) throw new Error('Invalid exponential-Golomb code.');
    const result = (1 << leadingZeroBits) - 1 + bitstream.readBits(leadingZeroBits);
    return result;
};
const readSignedExpGolomb = (bitstream)=>{
    const codeNum = readExpGolomb(bitstream);
    return (codeNum & 1) === 0 ? -(codeNum >> 1) : codeNum + 1 >> 1;
};
const writeBits = (bytes, start, end, value)=>{
    for(let i = start; i < end; i++){
        const byteIndex = Math.floor(i / 8);
        let byte = bytes[byteIndex];
        const bitIndex = 7 - (i & 7);
        byte &= ~(1 << bitIndex);
        byte |= (value & 1 << end - i - 1) >> end - i - 1 << bitIndex;
        bytes[byteIndex] = byte;
    }
};
const toUint8Array = (source)=>{
    if (source.constructor === Uint8Array) return source;
    else if (ArrayBuffer.isView(source)) return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    else return new Uint8Array(source);
};
const toDataView = (source)=>{
    if (source.constructor === DataView) return source;
    else if (ArrayBuffer.isView(source)) return new DataView(source.buffer, source.byteOffset, source.byteLength);
    else return new DataView(source);
};
const textDecoder = /* #__PURE__ */ new TextDecoder();
const textEncoder = /* #__PURE__ */ new TextEncoder();
const isIso88591Compatible = (text)=>{
    for(let i = 0; i < text.length; i++){
        const code = text.charCodeAt(i);
        if (code > 255) return false;
    }
    return true;
};
const invertObject = (object)=>{
    return Object.fromEntries(Object.entries(object).map(([key, value])=>[
            value,
            key
        ]));
};
const COLOR_PRIMARIES_MAP = {
    bt709: 1,
    bt470bg: 5,
    smpte170m: 6,
    bt2020: 9,
    smpte432: 12
};
const COLOR_PRIMARIES_MAP_INVERSE = /* #__PURE__ */ invertObject(COLOR_PRIMARIES_MAP);
const TRANSFER_CHARACTERISTICS_MAP = {
    'bt709': 1,
    'smpte170m': 6,
    'linear': 8,
    'iec61966-2-1': 13,
    'pq': 16,
    'hlg': 18
};
const TRANSFER_CHARACTERISTICS_MAP_INVERSE = /* #__PURE__ */ invertObject(TRANSFER_CHARACTERISTICS_MAP);
const MATRIX_COEFFICIENTS_MAP = {
    'rgb': 0,
    'bt709': 1,
    'bt470bg': 5,
    'smpte170m': 6,
    'bt2020-ncl': 9
};
const MATRIX_COEFFICIENTS_MAP_INVERSE = /* #__PURE__ */ invertObject(MATRIX_COEFFICIENTS_MAP);
const colorSpaceIsComplete = (colorSpace)=>{
    return !!colorSpace && !!colorSpace.primaries && !!colorSpace.transfer && !!colorSpace.matrix && colorSpace.fullRange !== undefined;
};
const isAllowSharedBufferSource = (x)=>{
    return x instanceof ArrayBuffer || typeof SharedArrayBuffer !== 'undefined' && x instanceof SharedArrayBuffer || ArrayBuffer.isView(x);
};
class AsyncMutex {
    constructor(){
        this.currentPromise = Promise.resolve();
    }
    async acquire() {
        let resolver;
        const nextPromise = new Promise((resolve)=>{
            resolver = resolve;
        });
        const currentPromiseAlias = this.currentPromise;
        this.currentPromise = nextPromise;
        await currentPromiseAlias;
        return resolver;
    }
}
const bytesToHexString = (bytes)=>{
    return [
        ...bytes
    ].map((x)=>x.toString(16).padStart(2, '0')).join('');
};
const reverseBitsU32 = (x)=>{
    x = x >> 1 & 0x55555555 | (x & 0x55555555) << 1;
    x = x >> 2 & 0x33333333 | (x & 0x33333333) << 2;
    x = x >> 4 & 0x0f0f0f0f | (x & 0x0f0f0f0f) << 4;
    x = x >> 8 & 0x00ff00ff | (x & 0x00ff00ff) << 8;
    x = x >> 16 & 0x0000ffff | (x & 0x0000ffff) << 16;
    return x >>> 0; // Ensure it's treated as an unsigned 32-bit integer
};
const binarySearchExact = (arr, key, valueGetter)=>{
    let low = 0;
    let high = arr.length - 1;
    let ans = -1;
    while(low <= high){
        const mid = low + high >> 1;
        const midVal = valueGetter(arr[mid]);
        if (midVal === key) {
            ans = mid;
            high = mid - 1; // Continue searching left to find the lowest index
        } else if (midVal < key) low = mid + 1;
        else high = mid - 1;
    }
    return ans;
};
const binarySearchLessOrEqual = (arr, key, valueGetter)=>{
    let low = 0;
    let high = arr.length - 1;
    let ans = -1;
    while(low <= high){
        const mid = low + (high - low + 1) / 2 | 0;
        const midVal = valueGetter(arr[mid]);
        if (midVal <= key) {
            ans = mid;
            low = mid + 1;
        } else high = mid - 1;
    }
    return ans;
};
const insertSorted = (arr, item, valueGetter)=>{
    const insertionIndex = binarySearchLessOrEqual(arr, valueGetter(item), valueGetter);
    arr.splice(insertionIndex + 1, 0, item); // This even behaves correctly for the -1 case
};
const promiseWithResolvers = ()=>{
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        resolve: resolve,
        reject: reject
    };
};
const removeItem = (arr, item)=>{
    const index = arr.indexOf(item);
    if (index !== -1) arr.splice(index, 1);
};
const findLast = (arr, predicate)=>{
    for(let i = arr.length - 1; i >= 0; i--){
        if (predicate(arr[i])) return arr[i];
    }
    return undefined;
};
const findLastIndex = (arr, predicate)=>{
    for(let i = arr.length - 1; i >= 0; i--){
        if (predicate(arr[i])) return i;
    }
    return -1;
};
const toAsyncIterator = async function*(source) {
    if (Symbol.iterator in source) // @ts-expect-error Trust me
    yield* source[Symbol.iterator]();
    else // @ts-expect-error Trust me
    yield* source[Symbol.asyncIterator]();
};
const validateAnyIterable = (iterable)=>{
    if (!(Symbol.iterator in iterable) && !(Symbol.asyncIterator in iterable)) throw new TypeError('Argument must be an iterable or async iterable.');
};
const assertNever = (x)=>{
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Unexpected value: ${x}`);
};
const getUint24 = (view, byteOffset, littleEndian)=>{
    const byte1 = view.getUint8(byteOffset);
    const byte2 = view.getUint8(byteOffset + 1);
    const byte3 = view.getUint8(byteOffset + 2);
    if (littleEndian) return byte1 | byte2 << 8 | byte3 << 16;
    else return byte1 << 16 | byte2 << 8 | byte3;
};
const getInt24 = (view, byteOffset, littleEndian)=>{
    // The left shift pushes the most significant bit into the sign bit region, and the subsequent right shift
    // then correctly interprets the sign bit.
    return getUint24(view, byteOffset, littleEndian) << 8 >> 8;
};
const setUint24 = (view, byteOffset, value, littleEndian)=>{
    // Ensure the value is within 24-bit unsigned range (0 to 16777215)
    value = value >>> 0; // Convert to unsigned 32-bit
    value = value & 0xFFFFFF; // Mask to 24 bits
    if (littleEndian) {
        view.setUint8(byteOffset, value & 0xFF);
        view.setUint8(byteOffset + 1, value >>> 8 & 0xFF);
        view.setUint8(byteOffset + 2, value >>> 16 & 0xFF);
    } else {
        view.setUint8(byteOffset, value >>> 16 & 0xFF);
        view.setUint8(byteOffset + 1, value >>> 8 & 0xFF);
        view.setUint8(byteOffset + 2, value & 0xFF);
    }
};
const setInt24 = (view, byteOffset, value, littleEndian)=>{
    // Ensure the value is within 24-bit signed range (-8388608 to 8388607)
    value = clamp(value, -8388608, 8388607);
    // Convert negative values to their 24-bit representation
    if (value < 0) value = value + 0x1000000 & 0xFFFFFF;
    setUint24(view, byteOffset, value, littleEndian);
};
const setInt64 = (view, byteOffset, value, littleEndian)=>{
    if (littleEndian) {
        view.setUint32(byteOffset + 0, value, true);
        view.setInt32(byteOffset + 4, Math.floor(value / 2 ** 32), true);
    } else {
        view.setInt32(byteOffset + 0, Math.floor(value / 2 ** 32), true);
        view.setUint32(byteOffset + 4, value, true);
    }
};
const mapAsyncGenerator = (generator, map)=>{
    return {
        async next () {
            const result = await generator.next();
            if (result.done) return {
                value: undefined,
                done: true
            };
            else return {
                value: map(result.value),
                done: false
            };
        },
        return () {
            return generator.return();
        },
        throw (error) {
            return generator.throw(error);
        },
        [Symbol.asyncIterator] () {
            return this;
        }
    };
};
const clamp = (value, min, max)=>{
    return Math.max(min, Math.min(max, value));
};
const UNDETERMINED_LANGUAGE = 'und';
const roundIfAlmostInteger = (value)=>{
    const rounded = Math.round(value);
    if (Math.abs(value / rounded - 1) < 10 * Number.EPSILON) return rounded;
    else return value;
};
const roundToMultiple = (value, multiple)=>{
    return Math.round(value / multiple) * multiple;
};
const ilog = (x)=>{
    let ret = 0;
    while(x){
        ret++;
        x >>= 1;
    }
    return ret;
};
const ISO_639_2_REGEX = /^[a-z]{3}$/;
const isIso639Dash2LanguageCode = (x)=>{
    return ISO_639_2_REGEX.test(x);
};
const SECOND_TO_MICROSECOND_FACTOR = 1e6 * (1 + Number.EPSILON);
const mergeRequestInit = (init1, init2)=>{
    const merged = {
        ...init1,
        ...init2
    };
    // Special handling for headers
    if (init1.headers || init2.headers) {
        const headers1 = init1.headers ? normalizeHeaders(init1.headers) : {};
        const headers2 = init2.headers ? normalizeHeaders(init2.headers) : {};
        const mergedHeaders = {
            ...headers1
        };
        // For each header in headers2, check if a case-insensitive match exists in mergedHeaders
        Object.entries(headers2).forEach(([key2, value2])=>{
            const existingKey = Object.keys(mergedHeaders).find((key1)=>key1.toLowerCase() === key2.toLowerCase());
            if (existingKey) delete mergedHeaders[existingKey];
            mergedHeaders[key2] = value2;
        });
        merged.headers = mergedHeaders;
    }
    return merged;
};
/** Normalizes HeadersInit to a Record<string, string> format. */ const normalizeHeaders = (headers)=>{
    if (headers instanceof Headers) {
        const result = {};
        headers.forEach((value, key)=>{
            result[key] = value;
        });
        return result;
    }
    if (Array.isArray(headers)) {
        const result = {};
        headers.forEach(([key, value])=>{
            result[key] = value;
        });
        return result;
    }
    return headers;
};
const retriedFetch = async (fetchFn, url, requestInit, getRetryDelay, shouldStop)=>{
    let attempts = 0;
    while(true)try {
        return await fetchFn(url, requestInit);
    } catch (error) {
        if (shouldStop()) throw error;
        attempts++;
        const retryDelayInSeconds = getRetryDelay(attempts, error, url);
        if (retryDelayInSeconds === null) throw error;
        console.error('Retrying failed fetch. Error:', error);
        if (!Number.isFinite(retryDelayInSeconds) || retryDelayInSeconds < 0) throw new TypeError('Retry delay must be a non-negative finite number.');
        if (retryDelayInSeconds > 0) await new Promise((resolve)=>setTimeout(resolve, 1000 * retryDelayInSeconds));
        if (shouldStop()) throw error;
    }
};
const computeRationalApproximation = (x, maxDenominator)=>{
    // Handle negative numbers
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    let prevNumerator = 0, prevDenominator = 1;
    let currNumerator = 1, currDenominator = 0;
    // Continued fraction algorithm
    let remainder = x;
    while(true){
        const integer = Math.floor(remainder);
        // Calculate next convergent
        const nextNumerator = integer * currNumerator + prevNumerator;
        const nextDenominator = integer * currDenominator + prevDenominator;
        if (nextDenominator > maxDenominator) return {
            numerator: sign * currNumerator,
            denominator: currDenominator
        };
        prevNumerator = currNumerator;
        prevDenominator = currDenominator;
        currNumerator = nextNumerator;
        currDenominator = nextDenominator;
        remainder = 1 / (remainder - integer);
        // Guard against precision issues
        if (!isFinite(remainder)) break;
    }
    return {
        numerator: sign * currNumerator,
        denominator: currDenominator
    };
};
class CallSerializer {
    constructor(){
        this.currentPromise = Promise.resolve();
    }
    call(fn) {
        return this.currentPromise = this.currentPromise.then(fn);
    }
}
let isWebKitCache = null;
const isWebKit = ()=>{
    if (isWebKitCache !== null) return isWebKitCache;
    // This even returns true for WebKit-wrapping browsers such as Chrome on iOS
    return isWebKitCache = !!(typeof navigator !== 'undefined' && (navigator.vendor?.match(/apple/i) || /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) || /\b(iPad|iPhone|iPod)\b/.test(navigator.userAgent)));
};
let isFirefoxCache = null;
const isFirefox = ()=>{
    if (isFirefoxCache !== null) return isFirefoxCache;
    return isFirefoxCache = typeof navigator !== 'undefined' && navigator.userAgent?.includes('Firefox');
};
let isChromiumCache = null;
const isChromium = ()=>{
    if (isChromiumCache !== null) return isChromiumCache;
    return isChromiumCache = !!(typeof navigator !== 'undefined' && (navigator.vendor?.includes('Google Inc') || /Chrome/.test(navigator.userAgent)));
};
let chromiumVersionCache = null;
const getChromiumVersion = ()=>{
    if (chromiumVersionCache !== null) return chromiumVersionCache;
    if (typeof navigator === 'undefined') return null;
    const match = /\bChrome\/(\d+)/.exec(navigator.userAgent);
    if (!match) return null;
    return chromiumVersionCache = Number(match[1]);
};
const coalesceIndex = (a, b)=>{
    return a !== -1 ? a : b;
};
const closedIntervalsOverlap = (startA, endA, startB, endB)=>{
    return startA <= endB && startB <= endA;
};
const keyValueIterator = function*(object) {
    for(const key in object){
        const value = object[key];
        if (value === undefined) continue;
        yield {
            key,
            value
        };
    }
};
const imageMimeTypeToExtension = (mimeType)=>{
    switch(mimeType.toLowerCase()){
        case 'image/jpeg':
        case 'image/jpg':
            return '.jpg';
        case 'image/png':
            return '.png';
        case 'image/gif':
            return '.gif';
        case 'image/webp':
            return '.webp';
        case 'image/bmp':
            return '.bmp';
        case 'image/svg+xml':
            return '.svg';
        case 'image/tiff':
            return '.tiff';
        case 'image/avif':
            return '.avif';
        case 'image/x-icon':
        case 'image/vnd.microsoft.icon':
            return '.ico';
        default:
            return null;
    }
};
const base64ToBytes = (base64)=>{
    const decoded = atob(base64);
    const bytes = new Uint8Array(decoded.length);
    for(let i = 0; i < decoded.length; i++)bytes[i] = decoded.charCodeAt(i);
    return bytes;
};
const bytesToBase64 = (bytes)=>{
    let string = '';
    for(let i = 0; i < bytes.length; i++)string += String.fromCharCode(bytes[i]);
    return btoa(string);
};
const uint8ArraysAreEqual = (a, b)=>{
    if (a.length !== b.length) return false;
    for(let i = 0; i < a.length; i++){
        if (a[i] !== b[i]) return false;
    }
    return true;
};
const polyfillSymbolDispose = ()=>{
    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html
    // @ts-expect-error Readonly
    Symbol.dispose ??= Symbol('Symbol.dispose');
};
const isNumber = (x)=>{
    return typeof x === 'number' && !Number.isNaN(x);
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"99VTc":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * The source base class, representing a resource from which bytes can be read.
 * @group Input sources
 * @public
 */ parcelHelpers.export(exports, "Source", ()=>Source);
/**
 * A source backed by an ArrayBuffer or ArrayBufferView, with the entire file held in memory.
 * @group Input sources
 * @public
 */ parcelHelpers.export(exports, "BufferSource", ()=>BufferSource);
/**
 * A source backed by a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). Since a
 * [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) is also a `Blob`, this is the source to use when
 * reading files off the disk.
 * @group Input sources
 * @public
 */ parcelHelpers.export(exports, "BlobSource", ()=>BlobSource);
/**
 * A source backed by a URL. This is useful for reading data from the network. Requests will be made using an optimized
 * reading and prefetching pattern to minimize request count and latency.
 * @group Input sources
 * @public
 */ parcelHelpers.export(exports, "UrlSource", ()=>UrlSource);
/**
 * A source backed by a path to a file. Intended for server-side usage in Node, Bun, or Deno.
 *
 * Make sure to call `.dispose()` on the corresponding {@link Input} when done to explicitly free the internal file
 * handle acquired by this source.
 * @group Input sources
 * @public
 */ parcelHelpers.export(exports, "FilePathSource", ()=>FilePathSource);
/**
 * A general-purpose, callback-driven source that can get its data from anywhere.
 * @group Input sources
 * @public
 */ parcelHelpers.export(exports, "StreamSource", ()=>StreamSource);
/**
 * A source backed by a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of
 * `Uint8Array`, representing an append-only byte stream of unknown length. This is the source to use for incrementally
 * streaming in input files that are still being constructed and whose size we don't yet know, like for example the
 * output chunks of [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder).
 *
 * This source is *unsized*, meaning calls to `.getSize()` will throw and readers are more limited due to the
 * lack of random file access. You should only use this source with sequential access patterns, such as reading all
 * packets from start to end. This source does not work well with random access patterns unless you increase its
 * max cache size.
 *
 * @group Input sources
 * @public
 */ parcelHelpers.export(exports, "ReadableStreamSource", ()=>ReadableStreamSource);
var _miscJs = require("./misc.js");
var _nodeJs = require("./node.js");
var _inputJs = require("./input.js");
const node = typeof _nodeJs !== 'undefined' ? _nodeJs // Aliasing it prevents some bundler warnings
 : undefined;
class Source {
    constructor(){
        /** @internal */ this._disposed = false;
        /** @internal */ this._sizePromise = null;
        /** Called each time data is retrieved from the source. Will be called with the retrieved range (end exclusive). */ this.onread = null;
    }
    /**
     * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
     * will retrieve the size.
     *
     * Returns null if the source is unsized.
     */ async getSizeOrNull() {
        if (this._disposed) throw new (0, _inputJs.InputDisposedError)();
        return this._sizePromise ??= Promise.resolve(this._retrieveSize());
    }
    /**
     * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
     * will retrieve the size.
     *
     * Throws an error if the source is unsized.
     */ async getSize() {
        if (this._disposed) throw new (0, _inputJs.InputDisposedError)();
        const result = await this.getSizeOrNull();
        if (result === null) throw new Error('Cannot determine the size of an unsized source.');
        return result;
    }
}
class BufferSource extends Source {
    /**
     * Creates a new {@link BufferSource} backed by the specified `ArrayBuffer`, `SharedArrayBuffer`,
     * or `ArrayBufferView`.
     */ constructor(buffer){
        if (!(buffer instanceof ArrayBuffer) && !(typeof SharedArrayBuffer !== 'undefined' && buffer instanceof SharedArrayBuffer) && !ArrayBuffer.isView(buffer)) throw new TypeError('buffer must be an ArrayBuffer, SharedArrayBuffer, or ArrayBufferView.');
        super();
        /** @internal */ this._onreadCalled = false;
        this._bytes = (0, _miscJs.toUint8Array)(buffer);
        this._view = (0, _miscJs.toDataView)(buffer);
    }
    /** @internal */ _retrieveSize() {
        return this._bytes.byteLength;
    }
    /** @internal */ _read() {
        if (!this._onreadCalled) {
            // We just say the first read retrives all bytes from the source (which, I mean, it does)
            this.onread?.(0, this._bytes.byteLength);
            this._onreadCalled = true;
        }
        return {
            bytes: this._bytes,
            view: this._view,
            offset: 0
        };
    }
    /** @internal */ _dispose() {}
}
class BlobSource extends Source {
    /**
     * Creates a new {@link BlobSource} backed by the specified
     * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
     */ constructor(blob, options = {}){
        if (!(blob instanceof Blob)) throw new TypeError('blob must be a Blob.');
        if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
        if (options.maxCacheSize !== undefined && (!(0, _miscJs.isNumber)(options.maxCacheSize) || options.maxCacheSize < 0)) throw new TypeError('options.maxCacheSize, when provided, must be a non-negative number.');
        super();
        /** @internal */ this._readers = new WeakMap();
        this._blob = blob;
        this._orchestrator = new ReadOrchestrator({
            maxCacheSize: options.maxCacheSize ?? 8 * 2 ** 20 /* 8 MiB */ ,
            maxWorkerCount: 4,
            runWorker: this._runWorker.bind(this),
            prefetchProfile: PREFETCH_PROFILES.fileSystem
        });
    }
    /** @internal */ _retrieveSize() {
        const size = this._blob.size;
        this._orchestrator.fileSize = size;
        return size;
    }
    /** @internal */ _read(start, end) {
        return this._orchestrator.read(start, end);
    }
    /** @internal */ async _runWorker(worker) {
        let reader = this._readers.get(worker);
        if (reader === undefined) {
            // https://github.com/Vanilagy/mediabunny/issues/184
            // WebKit has critical bugs with blob.stream():
            // - WebKitBlobResource error 1 when streaming large files
            // - Memory buildup and reload loops on iOS (network process crashes)
            // - ReadableStream stalls under backpressure (especially video)
            // Affects Safari and all iOS browsers (Chrome, Firefox, etc.).
            // Use arrayBuffer() fallback for WebKit browsers.
            if ('stream' in this._blob && !(0, _miscJs.isWebKit)()) {
                // Get a reader of the blob starting at the required offset, and then keep it around
                const slice = this._blob.slice(worker.currentPos);
                reader = slice.stream().getReader();
            } else // We'll need to use more primitive ways
            reader = null;
            this._readers.set(worker, reader);
        }
        while(worker.currentPos < worker.targetPos && !worker.aborted)if (reader) {
            const { done, value } = await reader.read();
            if (done) {
                this._orchestrator.forgetWorker(worker);
                throw new Error('Blob reader stopped unexpectedly before all requested data was read.');
            }
            if (worker.aborted) break;
            this.onread?.(worker.currentPos, worker.currentPos + value.length);
            this._orchestrator.supplyWorkerData(worker, value);
        } else {
            const data = await this._blob.slice(worker.currentPos, worker.targetPos).arrayBuffer();
            if (worker.aborted) break;
            this.onread?.(worker.currentPos, worker.currentPos + data.byteLength);
            this._orchestrator.supplyWorkerData(worker, new Uint8Array(data));
        }
        worker.running = false;
    }
    /** @internal */ _dispose() {
        this._orchestrator.dispose();
    }
}
const URL_SOURCE_MIN_LOAD_AMOUNT = 0.5 * 2 ** 20; // 0.5 MiB
const DEFAULT_RETRY_DELAY = (previousAttempts, error, src)=>{
    // Check if this could be a CORS error. If so, we cannot recover from it and
    // should not attempt to retry.
    // CORS errors are intentionally not opaque, so we need to rely on heuristics.
    const couldBeCorsError = error instanceof Error && (error.message.includes('Failed to fetch') // Chrome
     || error.message.includes('Load failed') // Safari
     || error.message.includes('NetworkError when attempting to fetch resource') // Firefox
    );
    if (couldBeCorsError) {
        let originOfSrc = null;
        // Checking if the origin is different, because only then a CORS error could originate
        try {
            if (typeof window !== 'undefined' && typeof window.location !== 'undefined') originOfSrc = new URL(src instanceof Request ? src.url : src, window.location.href).origin;
        } catch  {
        // URL parse failed
        }
        // If user is offline, it is probably not a CORS error.
        const isOnline = typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true;
        if (isOnline && originOfSrc !== null && originOfSrc !== window.location.origin) {
            console.warn(`Request will not be retried because a CORS error was suspected due to different origins. You can` + ` modify this behavior by providing your own function for the 'getRetryDelay' option.`);
            return null;
        }
    }
    return Math.min(2 ** (previousAttempts - 2), 16);
};
class UrlSource extends Source {
    /** Creates a new {@link UrlSource} backed by the resource at the specified URL. */ constructor(url, options = {}){
        if (typeof url !== 'string' && !(url instanceof URL) && !(typeof Request !== 'undefined' && url instanceof Request)) throw new TypeError('url must be a string, URL or Request.');
        if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
        if (options.requestInit !== undefined && (!options.requestInit || typeof options.requestInit !== 'object')) throw new TypeError('options.requestInit, when provided, must be an object.');
        if (options.getRetryDelay !== undefined && typeof options.getRetryDelay !== 'function') throw new TypeError('options.getRetryDelay, when provided, must be a function.');
        if (options.maxCacheSize !== undefined && (!(0, _miscJs.isNumber)(options.maxCacheSize) || options.maxCacheSize < 0)) throw new TypeError('options.maxCacheSize, when provided, must be a non-negative number.');
        if (options.fetchFn !== undefined && typeof options.fetchFn !== 'function') throw new TypeError('options.fetchFn, when provided, must be a function.');
        super();
        /** @internal */ this._existingResponses = new WeakMap();
        this._url = url;
        this._options = options;
        this._getRetryDelay = options.getRetryDelay ?? DEFAULT_RETRY_DELAY;
        this._orchestrator = new ReadOrchestrator({
            maxCacheSize: options.maxCacheSize ?? 64 * 2 ** 20 /* 64 MiB */ ,
            // Most files in the real-world have a single sequential access pattern, but having two in parallel can
            // also happen
            maxWorkerCount: 2,
            runWorker: this._runWorker.bind(this),
            prefetchProfile: PREFETCH_PROFILES.network
        });
    }
    /** @internal */ async _retrieveSize() {
        // Retrieving the resource size for UrlSource is optimized: Almost always (= always), the first bytes we have to
        // read are the start of the file. This means it's smart to combine size fetching with fetching the start of the
        // file. We additionally use this step to probe if the server supports range requests, killing three birds with
        // one stone.
        const abortController = new AbortController();
        const response = await (0, _miscJs.retriedFetch)(this._options.fetchFn ?? fetch, this._url, (0, _miscJs.mergeRequestInit)(this._options.requestInit ?? {}, {
            headers: {
                // We could also send a non-range request to request the same bytes (all of them), but doing it like
                // this is an easy way to check if the server supports range requests in the first place
                Range: 'bytes=0-'
            },
            signal: abortController.signal
        }), this._getRetryDelay, ()=>this._disposed);
        if (!response.ok) // eslint-disable-next-line @typescript-eslint/no-base-to-string
        throw new Error(`Error fetching ${String(this._url)}: ${response.status} ${response.statusText}`);
        let worker;
        let fileSize;
        if (response.status === 206) {
            fileSize = this._getTotalLengthFromRangeResponse(response);
            worker = this._orchestrator.createWorker(0, Math.min(fileSize, URL_SOURCE_MIN_LOAD_AMOUNT));
        } else {
            // Server probably returned a 200.
            const contentLength = response.headers.get('Content-Length');
            if (contentLength) {
                fileSize = Number(contentLength);
                worker = this._orchestrator.createWorker(0, fileSize);
                this._orchestrator.options.maxCacheSize = Infinity; // 🤷
                console.warn("HTTP server did not respond with 206 Partial Content, meaning the entire remote resource now has to be downloaded. For efficient media file streaming across a network, please make sure your server supports range requests.");
            } else throw new Error(`HTTP response (status ${response.status}) must surface Content-Length header.`);
        }
        this._orchestrator.fileSize = fileSize;
        this._existingResponses.set(worker, {
            response,
            abortController
        });
        this._orchestrator.runWorker(worker);
        return fileSize;
    }
    /** @internal */ _read(start, end) {
        return this._orchestrator.read(start, end);
    }
    /** @internal */ async _runWorker(worker) {
        // The outer loop is for resuming a request if it dies mid-response
        while(true){
            const existing = this._existingResponses.get(worker);
            this._existingResponses.delete(worker);
            let abortController = existing?.abortController;
            let response = existing?.response;
            if (!abortController) {
                abortController = new AbortController();
                response = await (0, _miscJs.retriedFetch)(this._options.fetchFn ?? fetch, this._url, (0, _miscJs.mergeRequestInit)(this._options.requestInit ?? {}, {
                    headers: {
                        Range: `bytes=${worker.currentPos}-`
                    },
                    signal: abortController.signal
                }), this._getRetryDelay, ()=>this._disposed);
            }
            (0, _miscJs.assert)(response);
            if (!response.ok) // eslint-disable-next-line @typescript-eslint/no-base-to-string
            throw new Error(`Error fetching ${String(this._url)}: ${response.status} ${response.statusText}`);
            if (worker.currentPos > 0 && response.status !== 206) throw new Error("HTTP server did not respond with 206 Partial Content to a range request. To enable efficient media file streaming across a network, please make sure your server supports range requests.");
            if (!response.body) throw new Error("Missing HTTP response body stream. The used fetch function must provide the response body as a ReadableStream.");
            const reader = response.body.getReader();
            while(true){
                if (worker.currentPos >= worker.targetPos || worker.aborted) {
                    abortController.abort();
                    worker.running = false;
                    return;
                }
                let readResult;
                try {
                    readResult = await reader.read();
                } catch (error) {
                    if (this._disposed) // No need to try to retry
                    throw error;
                    const retryDelayInSeconds = this._getRetryDelay(1, error, this._url);
                    if (retryDelayInSeconds !== null) {
                        console.error('Error while reading response stream. Attempting to resume.', error);
                        await new Promise((resolve)=>setTimeout(resolve, 1000 * retryDelayInSeconds));
                        break;
                    } else throw error;
                }
                if (worker.aborted) break;
                const { done, value } = readResult;
                if (done) {
                    if (worker.currentPos >= worker.targetPos) {
                        // All data was delivered, we're good
                        this._orchestrator.forgetWorker(worker);
                        worker.running = false;
                        return;
                    }
                    break;
                }
                this.onread?.(worker.currentPos, worker.currentPos + value.length);
                this._orchestrator.supplyWorkerData(worker, value);
            }
            if (worker.aborted) break;
        }
        worker.running = false;
    // The previous UrlSource had logic for circumventing https://issues.chromium.org/issues/436025873; I haven't
    // been able to observe this bug with the new UrlSource (maybe because we're using response streaming), so the
    // logic for that has vanished for now. Leaving a comment here if this becomes relevant again.
    }
    /** @internal */ _getTotalLengthFromRangeResponse(response) {
        const contentRange = response.headers.get('Content-Range');
        if (contentRange) {
            const match = /\/(\d+)/.exec(contentRange);
            if (match) return Number(match[1]);
        }
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) return Number(contentLength);
        else throw new Error("Partial HTTP response (status 206) must surface either Content-Range or Content-Length header.");
    }
    /** @internal */ _dispose() {
        this._orchestrator.dispose();
    }
}
class FilePathSource extends Source {
    /** Creates a new {@link FilePathSource} backed by the file at the specified file path. */ constructor(filePath, options = {}){
        if (typeof filePath !== 'string') throw new TypeError('filePath must be a string.');
        if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
        if (options.maxCacheSize !== undefined && (!(0, _miscJs.isNumber)(options.maxCacheSize) || options.maxCacheSize < 0)) throw new TypeError('options.maxCacheSize, when provided, must be a non-negative number.');
        super();
        /** @internal */ this._fileHandle = null;
        // Let's back this source with a StreamSource, makes the implementation very simple
        this._streamSource = new StreamSource({
            getSize: async ()=>{
                this._fileHandle = await node.fs.open(filePath, 'r');
                const stats = await this._fileHandle.stat();
                return stats.size;
            },
            read: async (start, end)=>{
                (0, _miscJs.assert)(this._fileHandle);
                const buffer = new Uint8Array(end - start);
                await this._fileHandle.read(buffer, 0, end - start, start);
                return buffer;
            },
            maxCacheSize: options.maxCacheSize,
            prefetchProfile: 'fileSystem'
        });
    }
    /** @internal */ _read(start, end) {
        return this._streamSource._read(start, end);
    }
    /** @internal */ _retrieveSize() {
        return this._streamSource._retrieveSize();
    }
    /** @internal */ _dispose() {
        this._streamSource._dispose();
        this._fileHandle?.close();
        this._fileHandle = null;
    }
}
class StreamSource extends Source {
    /** Creates a new {@link StreamSource} whose behavior is specified by `options`.  */ constructor(options){
        if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
        if (typeof options.getSize !== 'function') throw new TypeError('options.getSize must be a function.');
        if (typeof options.read !== 'function') throw new TypeError('options.read must be a function.');
        if (options.dispose !== undefined && typeof options.dispose !== 'function') throw new TypeError('options.dispose, when provided, must be a function.');
        if (options.maxCacheSize !== undefined && (!(0, _miscJs.isNumber)(options.maxCacheSize) || options.maxCacheSize < 0)) throw new TypeError('options.maxCacheSize, when provided, must be a non-negative number.');
        if (options.prefetchProfile && ![
            'none',
            'fileSystem',
            'network'
        ].includes(options.prefetchProfile)) throw new TypeError('options.prefetchProfile, when provided, must be one of \'none\', \'fileSystem\' or \'network\'.');
        super();
        this._options = options;
        this._orchestrator = new ReadOrchestrator({
            maxCacheSize: options.maxCacheSize ?? 8 * 2 ** 20 /* 8 MiB */ ,
            maxWorkerCount: 2,
            prefetchProfile: PREFETCH_PROFILES[options.prefetchProfile ?? 'none'],
            runWorker: this._runWorker.bind(this)
        });
    }
    /** @internal */ _retrieveSize() {
        const result = this._options.getSize();
        if (result instanceof Promise) return result.then((size)=>{
            if (!Number.isInteger(size) || size < 0) throw new TypeError('options.getSize must return or resolve to a non-negative integer.');
            this._orchestrator.fileSize = size;
            return size;
        });
        else {
            if (!Number.isInteger(result) || result < 0) throw new TypeError('options.getSize must return or resolve to a non-negative integer.');
            this._orchestrator.fileSize = result;
            return result;
        }
    }
    /** @internal */ _read(start, end) {
        return this._orchestrator.read(start, end);
    }
    /** @internal */ async _runWorker(worker) {
        while(worker.currentPos < worker.targetPos && !worker.aborted){
            const originalCurrentPos = worker.currentPos;
            const originalTargetPos = worker.targetPos;
            let data = this._options.read(worker.currentPos, originalTargetPos);
            if (data instanceof Promise) data = await data;
            if (worker.aborted) break;
            if (data instanceof Uint8Array) {
                data = (0, _miscJs.toUint8Array)(data); // Normalize things like Node.js Buffer to Uint8Array
                if (data.length !== originalTargetPos - worker.currentPos) // Yes, we're that strict
                throw new Error(`options.read returned a Uint8Array with unexpected length: Requested ${originalTargetPos - worker.currentPos} bytes, but got ${data.length}.`);
                this.onread?.(worker.currentPos, worker.currentPos + data.length);
                this._orchestrator.supplyWorkerData(worker, data);
            } else if (data instanceof ReadableStream) {
                const reader = data.getReader();
                while(worker.currentPos < originalTargetPos && !worker.aborted){
                    const { done, value } = await reader.read();
                    if (done) {
                        if (worker.currentPos < originalTargetPos) // Yes, we're *that* strict
                        throw new Error(`ReadableStream returned by options.read ended before supplying enough data.` + ` Requested ${originalTargetPos - originalCurrentPos} bytes, but got ${worker.currentPos - originalCurrentPos}`);
                        break;
                    }
                    if (!(value instanceof Uint8Array)) throw new TypeError('ReadableStream returned by options.read must yield Uint8Array chunks.');
                    if (worker.aborted) break;
                    const data = (0, _miscJs.toUint8Array)(value); // Normalize things like Node.js Buffer to Uint8Array
                    this.onread?.(worker.currentPos, worker.currentPos + data.length);
                    this._orchestrator.supplyWorkerData(worker, data);
                }
            } else throw new TypeError('options.read must return or resolve to a Uint8Array or a ReadableStream.');
        }
        worker.running = false;
    }
    /** @internal */ _dispose() {
        this._orchestrator.dispose();
        this._options.dispose?.();
    }
}
class ReadableStreamSource extends Source {
    /** Creates a new {@link ReadableStreamSource} backed by the specified `ReadableStream<Uint8Array>`. */ constructor(stream, options = {}){
        if (!(stream instanceof ReadableStream)) throw new TypeError('stream must be a ReadableStream.');
        if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
        if (options.maxCacheSize !== undefined && (!(0, _miscJs.isNumber)(options.maxCacheSize) || options.maxCacheSize < 0)) throw new TypeError('options.maxCacheSize, when provided, must be a non-negative number.');
        super();
        /** @internal */ this._reader = null;
        /** @internal */ this._cache = [];
        /** @internal */ this._pendingSlices = [];
        /** @internal */ this._currentIndex = 0;
        /** @internal */ this._targetIndex = 0;
        /** @internal */ this._maxRequestedIndex = 0;
        /** @internal */ this._endIndex = null;
        /** @internal */ this._pulling = false;
        this._stream = stream;
        this._maxCacheSize = options.maxCacheSize ?? 16 * 2 ** 20 /* 16 MiB */ ;
    }
    /** @internal */ _retrieveSize() {
        return this._endIndex; // Starts out as null, meaning this source is unsized
    }
    /** @internal */ _read(start, end) {
        if (this._endIndex !== null && end > this._endIndex) return null;
        this._maxRequestedIndex = Math.max(this._maxRequestedIndex, end);
        const cacheStartIndex = (0, _miscJs.binarySearchLessOrEqual)(this._cache, start, (x)=>x.start);
        const cacheStartEntry = cacheStartIndex !== -1 ? this._cache[cacheStartIndex] : null;
        if (cacheStartEntry && cacheStartEntry.start <= start && end <= cacheStartEntry.end) // The request can be satisfied with a single cache entry
        return {
            bytes: cacheStartEntry.bytes,
            view: cacheStartEntry.view,
            offset: cacheStartEntry.start
        };
        let lastEnd = start;
        const bytes = new Uint8Array(end - start);
        if (cacheStartIndex !== -1) // Walk over the cache to see if we can satisfy the request using multiple cache entries
        for(let i = cacheStartIndex; i < this._cache.length; i++){
            const cacheEntry = this._cache[i];
            if (cacheEntry.start >= end) break;
            const cappedStart = Math.max(start, cacheEntry.start);
            if (cappedStart > lastEnd) // We're too far behind
            this._throwDueToCacheMiss();
            const cappedEnd = Math.min(end, cacheEntry.end);
            if (cappedStart < cappedEnd) {
                bytes.set(cacheEntry.bytes.subarray(cappedStart - cacheEntry.start, cappedEnd - cacheEntry.start), cappedStart - start);
                lastEnd = cappedEnd;
            }
        }
        if (lastEnd === end) return {
            bytes,
            view: (0, _miscJs.toDataView)(bytes),
            offset: start
        };
        // We need to pull more data
        if (this._currentIndex > lastEnd) // We're too far behind
        this._throwDueToCacheMiss();
        const { promise, resolve, reject } = (0, _miscJs.promiseWithResolvers)();
        this._pendingSlices.push({
            start,
            end,
            bytes,
            resolve,
            reject
        });
        this._targetIndex = Math.max(this._targetIndex, end);
        // Start pulling from the stream if we're not already doing it
        if (!this._pulling) {
            this._pulling = true;
            this._pull().catch((error)=>{
                this._pulling = false;
                if (this._pendingSlices.length > 0) {
                    this._pendingSlices.forEach((x)=>x.reject(error)); // Make sure to propagate any errors
                    this._pendingSlices.length = 0;
                } else throw error; // So it doesn't get swallowed
            });
        }
        return promise;
    }
    /** @internal */ _throwDueToCacheMiss() {
        throw new Error("Read is before the cached region. With ReadableStreamSource, you must access the data more sequentially or increase the size of its cache.");
    }
    /** @internal */ async _pull() {
        this._reader ??= this._stream.getReader();
        // This is the loop that keeps pulling data from the stream until a target index is reached, filling requests
        // in the process
        while(this._currentIndex < this._targetIndex && !this._disposed){
            const { done, value } = await this._reader.read();
            if (done) {
                for (const pendingSlice of this._pendingSlices)pendingSlice.resolve(null);
                this._pendingSlices.length = 0;
                this._endIndex = this._currentIndex; // We know how long the file is now!
                break;
            }
            const startIndex = this._currentIndex;
            const endIndex = this._currentIndex + value.byteLength;
            // Fill the pending slices with the data
            for(let i = 0; i < this._pendingSlices.length; i++){
                const pendingSlice = this._pendingSlices[i];
                const cappedStart = Math.max(startIndex, pendingSlice.start);
                const cappedEnd = Math.min(endIndex, pendingSlice.end);
                if (cappedStart < cappedEnd) {
                    pendingSlice.bytes.set(value.subarray(cappedStart - startIndex, cappedEnd - startIndex), cappedStart - pendingSlice.start);
                    if (cappedEnd === pendingSlice.end) {
                        // Pending slice fully filled
                        pendingSlice.resolve({
                            bytes: pendingSlice.bytes,
                            view: (0, _miscJs.toDataView)(pendingSlice.bytes),
                            offset: pendingSlice.start
                        });
                        this._pendingSlices.splice(i, 1);
                        i--;
                    }
                }
            }
            this._cache.push({
                start: startIndex,
                end: endIndex,
                bytes: value,
                view: (0, _miscJs.toDataView)(value),
                age: 0
            });
            // Do cache eviction, based on the distance from the last-requested index. It's important that we do it like
            // this and not based on where the reader is at, because if the reader is fast, we'll unnecessarily evict
            // data that we still might need.
            while(this._cache.length > 0){
                const firstEntry = this._cache[0];
                const distance = this._maxRequestedIndex - firstEntry.end;
                if (distance <= this._maxCacheSize) break;
                this._cache.shift();
            }
            this._currentIndex += value.byteLength;
        }
        this._pulling = false;
    }
    /** @internal */ _dispose() {
        this._pendingSlices.length = 0;
        this._cache.length = 0;
    }
}
const PREFETCH_PROFILES = {
    none: (start, end)=>({
            start,
            end
        }),
    fileSystem: (start, end)=>{
        const padding = 2 ** 16;
        start = Math.floor((start - padding) / padding) * padding;
        end = Math.ceil((end + padding) / padding) * padding;
        return {
            start,
            end
        };
    },
    network: (start, end, workers)=>{
        // Add a slight bit of start padding because backwards reading is painful
        const paddingStart = 2 ** 16;
        start = Math.max(0, Math.floor((start - paddingStart) / paddingStart) * paddingStart);
        // Remote resources have extreme latency (relatively speaking), so the benefit from intelligent
        // prefetching is great. The network prefetch strategy is as follows: When we notice
        // successive reads to a worker's read region, we prefetch more data at the end of that region,
        // growing exponentially (up to a cap). This performs well for real-world use cases: Either we read a
        // small part of the file once and then never need it again, in which case the requested about of data
        // is small. Or, we're repeatedly doing a sequential access pattern (common in media files), in which
        // case we can become more and more confident to prefetch more and more data.
        for (const worker of workers){
            const maxExtensionAmount = 8 * 2 ** 20; // 8 MiB
            // When the read region cross the threshold point, we trigger a prefetch. This point is typically
            // in the middle of the worker's read region, or a fixed offset from the end if the region has grown
            // really large.
            const thresholdPoint = Math.max((worker.startPos + worker.targetPos) / 2, worker.targetPos - maxExtensionAmount);
            if ((0, _miscJs.closedIntervalsOverlap)(start, end, thresholdPoint, worker.targetPos)) {
                const size = worker.targetPos - worker.startPos;
                // If we extend by maxExtensionAmount
                const a = Math.ceil((size + 1) / maxExtensionAmount) * maxExtensionAmount;
                // If we extend to the next power of 2
                const b = 2 ** Math.ceil(Math.log2(size + 1));
                const extent = Math.min(b, a);
                end = Math.max(end, worker.startPos + extent);
            }
        }
        end = Math.max(end, start + URL_SOURCE_MIN_LOAD_AMOUNT);
        return {
            start,
            end
        };
    }
};
/**
 * Godclass for orchestrating complex, cached read operations. The reading model is as follows: Any reading task is
 * delegated to a *worker*, which is a sequential reader positioned somewhere along the file. All workers run in
 * parallel and can be stopped and resumed in their forward movement. When read requests come in, this orchestrator will
 * first try to satisfy the request with only the cached data. If this isn't possible, workers are spun up for all
 * missing parts (or existing workers are repurposed), and these workers will then fill the holes in the data as they
 * march along the file.
 */ class ReadOrchestrator {
    constructor(options){
        this.options = options;
        this.fileSize = null;
        this.nextAge = 0; // Used for LRU eviction of both cache entries and workers
        this.workers = [];
        this.cache = [];
        this.currentCacheSize = 0;
        this.disposed = false;
    }
    read(innerStart, innerEnd) {
        (0, _miscJs.assert)(this.fileSize !== null);
        const prefetchRange = this.options.prefetchProfile(innerStart, innerEnd, this.workers);
        const outerStart = Math.max(prefetchRange.start, 0);
        const outerEnd = Math.min(prefetchRange.end, this.fileSize);
        (0, _miscJs.assert)(outerStart <= innerStart && innerEnd <= outerEnd);
        let result = null;
        const innerCacheStartIndex = (0, _miscJs.binarySearchLessOrEqual)(this.cache, innerStart, (x)=>x.start);
        const innerStartEntry = innerCacheStartIndex !== -1 ? this.cache[innerCacheStartIndex] : null;
        // See if the read request can be satisfied by a single cache entry
        if (innerStartEntry && innerStartEntry.start <= innerStart && innerEnd <= innerStartEntry.end) {
            innerStartEntry.age = this.nextAge++;
            result = {
                bytes: innerStartEntry.bytes,
                view: innerStartEntry.view,
                offset: innerStartEntry.start
            };
        // Can't return yet though, still need to check if the prefetch range might lie outside the cached area
        }
        const outerCacheStartIndex = (0, _miscJs.binarySearchLessOrEqual)(this.cache, outerStart, (x)=>x.start);
        const bytes = result ? null : new Uint8Array(innerEnd - innerStart);
        let contiguousBytesWriteEnd = 0; // Used to track if the cache is able to completely cover the bytes
        let lastEnd = outerStart;
        // The "holes" in the cache (the parts we need to load)
        const outerHoles = [];
        // Loop over the cache and build up the list of holes
        if (outerCacheStartIndex !== -1) {
            for(let i = outerCacheStartIndex; i < this.cache.length; i++){
                const entry = this.cache[i];
                if (entry.start >= outerEnd) break;
                if (entry.end <= outerStart) continue;
                const cappedOuterStart = Math.max(outerStart, entry.start);
                const cappedOuterEnd = Math.min(outerEnd, entry.end);
                (0, _miscJs.assert)(cappedOuterStart <= cappedOuterEnd);
                if (lastEnd < cappedOuterStart) outerHoles.push({
                    start: lastEnd,
                    end: cappedOuterStart
                });
                lastEnd = cappedOuterEnd;
                if (bytes) {
                    const cappedInnerStart = Math.max(innerStart, entry.start);
                    const cappedInnerEnd = Math.min(innerEnd, entry.end);
                    if (cappedInnerStart < cappedInnerEnd) {
                        const relativeOffset = cappedInnerStart - innerStart;
                        // Fill the relevant section of the bytes with the cached data
                        bytes.set(entry.bytes.subarray(cappedInnerStart - entry.start, cappedInnerEnd - entry.start), relativeOffset);
                        if (relativeOffset === contiguousBytesWriteEnd) contiguousBytesWriteEnd = cappedInnerEnd - innerStart;
                    }
                }
                entry.age = this.nextAge++;
            }
            if (lastEnd < outerEnd) outerHoles.push({
                start: lastEnd,
                end: outerEnd
            });
        } else outerHoles.push({
            start: outerStart,
            end: outerEnd
        });
        if (bytes && contiguousBytesWriteEnd >= bytes.length) // Multiple cache entries were able to completely cover the requested bytes!
        result = {
            bytes,
            view: (0, _miscJs.toDataView)(bytes),
            offset: innerStart
        };
        if (outerHoles.length === 0) {
            (0, _miscJs.assert)(result);
            return result;
        }
        // We need to read more data, so now we're in async land
        const { promise, resolve, reject } = (0, _miscJs.promiseWithResolvers)();
        const innerHoles = [];
        for (const outerHole of outerHoles){
            const cappedStart = Math.max(innerStart, outerHole.start);
            const cappedEnd = Math.min(innerEnd, outerHole.end);
            if (cappedStart === outerHole.start && cappedEnd === outerHole.end) innerHoles.push(outerHole); // Can reuse without allocating a new object
            else if (cappedStart < cappedEnd) innerHoles.push({
                start: cappedStart,
                end: cappedEnd
            });
        }
        // Fire off workers to take care of patching the holes
        for (const outerHole of outerHoles){
            const pendingSlice = bytes && {
                start: innerStart,
                bytes,
                holes: innerHoles,
                resolve,
                reject
            };
            let workerFound = false;
            for (const worker of this.workers){
                // A small tolerance in the case that the requested region is *just* after the target position of an
                // existing worker. In that case, it's probably more efficient to repurpose that worker than to spawn
                // another one so close to it
                const gapTolerance = 2 ** 17;
                // This check also implies worker.currentPos <= outerHole.start, a critical condition
                if ((0, _miscJs.closedIntervalsOverlap)(outerHole.start - gapTolerance, outerHole.start, worker.currentPos, worker.targetPos)) {
                    worker.targetPos = Math.max(worker.targetPos, outerHole.end); // Update the worker's target position
                    workerFound = true;
                    if (pendingSlice && !worker.pendingSlices.includes(pendingSlice)) worker.pendingSlices.push(pendingSlice);
                    if (!worker.running) // Kick it off if it's idle
                    this.runWorker(worker);
                    break;
                }
            }
            if (!workerFound) {
                // We need to spawn a new worker
                const newWorker = this.createWorker(outerHole.start, outerHole.end);
                if (pendingSlice) newWorker.pendingSlices = [
                    pendingSlice
                ];
                this.runWorker(newWorker);
            }
        }
        if (!result) {
            (0, _miscJs.assert)(bytes);
            result = promise.then((bytes)=>({
                    bytes,
                    view: (0, _miscJs.toDataView)(bytes),
                    offset: innerStart
                }));
        }
        return result;
    }
    createWorker(startPos, targetPos) {
        const worker = {
            startPos,
            currentPos: startPos,
            targetPos,
            running: false,
            // Due to async shenanigans, it can happen that workers are started after disposal. In this case, instead of
            // simply not creating the worker, we allow it to run but immediately label it as aborted, so it can then
            // shut itself down.
            aborted: this.disposed,
            pendingSlices: [],
            age: this.nextAge++
        };
        this.workers.push(worker);
        // LRU eviction of the other workers
        while(this.workers.length > this.options.maxWorkerCount){
            let oldestIndex = 0;
            let oldestWorker = this.workers[0];
            for(let i = 1; i < this.workers.length; i++){
                const worker = this.workers[i];
                if (worker.age < oldestWorker.age) {
                    oldestIndex = i;
                    oldestWorker = worker;
                }
            }
            if (oldestWorker.running && oldestWorker.pendingSlices.length > 0) break;
            oldestWorker.aborted = true;
            this.workers.splice(oldestIndex, 1);
        }
        return worker;
    }
    runWorker(worker) {
        (0, _miscJs.assert)(!worker.running);
        (0, _miscJs.assert)(worker.currentPos < worker.targetPos);
        worker.running = true;
        worker.age = this.nextAge++;
        this.options.runWorker(worker).catch((error)=>{
            worker.running = false;
            if (worker.pendingSlices.length > 0) {
                worker.pendingSlices.forEach((x)=>x.reject(error)); // Make sure to propagate any errors
                worker.pendingSlices.length = 0;
            } else throw error; // So it doesn't get swallowed
        });
    }
    /** Called by a worker when it has read some data. */ supplyWorkerData(worker, bytes) {
        (0, _miscJs.assert)(!worker.aborted);
        const start = worker.currentPos;
        const end = start + bytes.length;
        this.insertIntoCache({
            start,
            end,
            bytes,
            view: (0, _miscJs.toDataView)(bytes),
            age: this.nextAge++
        });
        worker.currentPos += bytes.length;
        worker.targetPos = Math.max(worker.targetPos, worker.currentPos); // In case it overshoots
        // Now, let's see if we can use the read bytes to fill any pending slice
        for(let i = 0; i < worker.pendingSlices.length; i++){
            const pendingSlice = worker.pendingSlices[i];
            const clampedStart = Math.max(start, pendingSlice.start);
            const clampedEnd = Math.min(end, pendingSlice.start + pendingSlice.bytes.length);
            if (clampedStart < clampedEnd) pendingSlice.bytes.set(bytes.subarray(clampedStart - start, clampedEnd - start), clampedStart - pendingSlice.start);
            for(let j = 0; j < pendingSlice.holes.length; j++){
                // The hole is intentionally not modified here if the read section starts somewhere in the middle of
                // the hole. We don't need to do "hole splitting", since the workers are spawned *by* the holes,
                // meaning there's always a worker which will consume the hole left to right.
                const hole = pendingSlice.holes[j];
                if (start <= hole.start && end > hole.start) hole.start = end;
                if (hole.end <= hole.start) {
                    pendingSlice.holes.splice(j, 1);
                    j--;
                }
            }
            if (pendingSlice.holes.length === 0) {
                // The slice has been fulfilled, everything has been read. Let's resolve the promise
                pendingSlice.resolve(pendingSlice.bytes);
                worker.pendingSlices.splice(i, 1);
                i--;
            }
        }
        // Remove other idle workers if we "ate" into their territory
        for(let i = 0; i < this.workers.length; i++){
            const otherWorker = this.workers[i];
            if (worker === otherWorker || otherWorker.running) continue;
            if ((0, _miscJs.closedIntervalsOverlap)(start, end, otherWorker.currentPos, otherWorker.targetPos)) {
                this.workers.splice(i, 1);
                i--;
            }
        }
    }
    forgetWorker(worker) {
        const index = this.workers.indexOf(worker);
        (0, _miscJs.assert)(index !== -1);
        this.workers.splice(index, 1);
    }
    insertIntoCache(entry) {
        if (this.options.maxCacheSize === 0) return; // No caching
        let insertionIndex = (0, _miscJs.binarySearchLessOrEqual)(this.cache, entry.start, (x)=>x.start) + 1;
        if (insertionIndex > 0) {
            const previous = this.cache[insertionIndex - 1];
            if (previous.end >= entry.end) // Previous entry swallows the one to be inserted; we don't need to do anything
            return;
            if (previous.end > entry.start) {
                // Partial overlap with the previous entry, let's join
                const joined = new Uint8Array(entry.end - previous.start);
                joined.set(previous.bytes, 0);
                joined.set(entry.bytes, entry.start - previous.start);
                this.currentCacheSize += entry.end - previous.end;
                previous.bytes = joined;
                previous.view = (0, _miscJs.toDataView)(joined);
                previous.end = entry.end;
                // Do the rest of the logic with the previous entry instead
                insertionIndex--;
                entry = previous;
            } else {
                this.cache.splice(insertionIndex, 0, entry);
                this.currentCacheSize += entry.bytes.length;
            }
        } else {
            this.cache.splice(insertionIndex, 0, entry);
            this.currentCacheSize += entry.bytes.length;
        }
        for(let i = insertionIndex + 1; i < this.cache.length; i++){
            const next = this.cache[i];
            if (entry.end <= next.start) break;
            if (entry.end >= next.end) {
                // The inserted entry completely swallows the next entry
                this.cache.splice(i, 1);
                this.currentCacheSize -= next.bytes.length;
                i--;
                continue;
            }
            // Partial overlap, let's join
            const joined = new Uint8Array(next.end - entry.start);
            joined.set(entry.bytes, 0);
            joined.set(next.bytes, next.start - entry.start);
            this.currentCacheSize -= entry.end - next.start; // Subtract the overlap
            entry.bytes = joined;
            entry.view = (0, _miscJs.toDataView)(joined);
            entry.end = next.end;
            this.cache.splice(i, 1);
            break; // After the join case, we're done: the next entry cannot possibly overlap with the inserted one.
        }
        // LRU eviction of cache entries
        while(this.currentCacheSize > this.options.maxCacheSize){
            let oldestIndex = 0;
            let oldestEntry = this.cache[0];
            for(let i = 1; i < this.cache.length; i++){
                const entry = this.cache[i];
                if (entry.age < oldestEntry.age) {
                    oldestIndex = i;
                    oldestEntry = entry;
                }
            }
            if (this.currentCacheSize - oldestEntry.bytes.length <= this.options.maxCacheSize) break;
            this.cache.splice(oldestIndex, 1);
            this.currentCacheSize -= oldestEntry.bytes.length;
        }
    }
    dispose() {
        for (const worker of this.workers)worker.aborted = true;
        this.workers.length = 0;
        this.cache.length = 0;
        this.disposed = true;
    }
}

},{"./misc.js":"kkhLS","./node.js":"9f8My","./input.js":"4IqVo","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"9f8My":[function(require,module,exports,__globalThis) {
"use strict";

},{}],"4IqVo":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Represents an input media file. This is the root object from which all media read operations start.
 * @group Input files & tracks
 * @public
 */ parcelHelpers.export(exports, "Input", ()=>Input);
/**
 * Thrown when an operation was prevented because the corresponding {@link Input} has been disposed.
 * @group Input files & tracks
 * @public
 */ parcelHelpers.export(exports, "InputDisposedError", ()=>InputDisposedError);
var _inputFormatJs = require("./input-format.js");
var _miscJs = require("./misc.js");
var _readerJs = require("./reader.js");
var _sourceJs = require("./source.js");
(0, _miscJs.polyfillSymbolDispose)();
class Input {
    /** True if the input has been disposed. */ get disposed() {
        return this._disposed;
    }
    /**
     * Creates a new input file from the specified options. No reading operations will be performed until methods are
     * called on this instance.
     */ constructor(options){
        /** @internal */ this._demuxerPromise = null;
        /** @internal */ this._format = null;
        /** @internal */ this._disposed = false;
        if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
        if (!Array.isArray(options.formats) || options.formats.some((x)=>!(x instanceof (0, _inputFormatJs.InputFormat)))) throw new TypeError('options.formats must be an array of InputFormat.');
        if (!(options.source instanceof (0, _sourceJs.Source))) throw new TypeError('options.source must be a Source.');
        if (options.source._disposed) throw new Error('options.source must not be disposed.');
        this._formats = options.formats;
        this._source = options.source;
        this._reader = new (0, _readerJs.Reader)(options.source);
    }
    /** @internal */ _getDemuxer() {
        return this._demuxerPromise ??= (async ()=>{
            this._reader.fileSize = await this._source.getSizeOrNull();
            for (const format of this._formats){
                const canRead = await format._canReadInput(this);
                if (canRead) {
                    this._format = format;
                    return format._createDemuxer(this);
                }
            }
            throw new Error('Input has an unsupported or unrecognizable format.');
        })();
    }
    /**
     * Returns the source from which this input file reads its data. This is the same source that was passed to the
     * constructor.
     */ get source() {
        return this._source;
    }
    /**
     * Returns the format of the input file. You can compare this result directly to the {@link InputFormat} singletons
     * or use `instanceof` checks for subset-aware logic (for example, `format instanceof MatroskaInputFormat` is true
     * for both MKV and WebM).
     */ async getFormat() {
        await this._getDemuxer();
        (0, _miscJs.assert)(this._format);
        return this._format;
    }
    /**
     * Computes the duration of the input file, in seconds. More precisely, returns the largest end timestamp among
     * all tracks.
     */ async computeDuration() {
        const demuxer = await this._getDemuxer();
        return demuxer.computeDuration();
    }
    /** Returns the list of all tracks of this input file. */ async getTracks() {
        const demuxer = await this._getDemuxer();
        return demuxer.getTracks();
    }
    /** Returns the list of all video tracks of this input file. */ async getVideoTracks() {
        const tracks = await this.getTracks();
        return tracks.filter((x)=>x.isVideoTrack());
    }
    /** Returns the list of all audio tracks of this input file. */ async getAudioTracks() {
        const tracks = await this.getTracks();
        return tracks.filter((x)=>x.isAudioTrack());
    }
    /** Returns the primary video track of this input file, or null if there are no video tracks. */ async getPrimaryVideoTrack() {
        const tracks = await this.getTracks();
        return tracks.find((x)=>x.isVideoTrack()) ?? null;
    }
    /** Returns the primary audio track of this input file, or null if there are no audio tracks. */ async getPrimaryAudioTrack() {
        const tracks = await this.getTracks();
        return tracks.find((x)=>x.isAudioTrack()) ?? null;
    }
    /** Returns the full MIME type of this input file, including track codecs. */ async getMimeType() {
        const demuxer = await this._getDemuxer();
        return demuxer.getMimeType();
    }
    /**
     * Returns descriptive metadata tags about the media file, such as title, author, date, cover art, or other
     * attached files.
     */ async getMetadataTags() {
        const demuxer = await this._getDemuxer();
        return demuxer.getMetadataTags();
    }
    /**
     * Disposes this input and frees connected resources. When an input is disposed, ongoing read operations will be
     * canceled, all future read operations will fail, any open decoders will be closed, and all ongoing media sink
     * operations will be canceled. Disallowed and canceled operations will throw an {@link InputDisposedError}.
     *
     * You are expected not to use an input after disposing it. While some operations may still work, it is not
     * specified and may change in any future update.
     */ dispose() {
        if (this._disposed) return;
        this._disposed = true;
        this._source._disposed = true;
        this._source._dispose();
    }
    /**
     * Calls `.dispose()` on the input, implementing the `Disposable` interface for use with
     * JavaScript Explicit Resource Management features.
     */ [Symbol.dispose]() {
        this.dispose();
    }
}
class InputDisposedError extends Error {
    /** Creates a new {@link InputDisposedError}. */ constructor(message = 'Input has been disposed.'){
        super(message);
        this.name = 'InputDisposedError';
    }
}

},{"./input-format.js":"fr7dQ","./misc.js":"kkhLS","./reader.js":"fr2Ka","./source.js":"99VTc","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"fr7dQ":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Base class representing an input media file format.
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "InputFormat", ()=>InputFormat);
/**
 * Format representing files compatible with the ISO base media file format (ISOBMFF), like MP4 or MOV files.
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "IsobmffInputFormat", ()=>IsobmffInputFormat);
/**
 * MPEG-4 Part 14 (MP4) file format.
 *
 * Do not instantiate this class; use the {@link MP4} singleton instead.
 *
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "Mp4InputFormat", ()=>Mp4InputFormat);
/**
 * QuickTime File Format (QTFF), often called MOV.
 *
 * Do not instantiate this class; use the {@link QTFF} singleton instead.
 *
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "QuickTimeInputFormat", ()=>QuickTimeInputFormat);
/**
 * Matroska file format.
 *
 * Do not instantiate this class; use the {@link MATROSKA} singleton instead.
 *
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "MatroskaInputFormat", ()=>MatroskaInputFormat);
/**
 * WebM file format, based on Matroska.
 *
 * Do not instantiate this class; use the {@link WEBM} singleton instead.
 *
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "WebMInputFormat", ()=>WebMInputFormat);
/**
 * MP3 file format.
 *
 * Do not instantiate this class; use the {@link MP3} singleton instead.
 *
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "Mp3InputFormat", ()=>Mp3InputFormat);
/**
 * WAVE file format, based on RIFF.
 *
 * Do not instantiate this class; use the {@link WAVE} singleton instead.
 *
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "WaveInputFormat", ()=>WaveInputFormat);
/**
 * Ogg file format.
 *
 * Do not instantiate this class; use the {@link OGG} singleton instead.
 *
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "OggInputFormat", ()=>OggInputFormat);
/**
 * FLAC file format.
 *
 * Do not instantiate this class; use the {@link FLAC} singleton instead.
 *
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "FlacInputFormat", ()=>FlacInputFormat);
/**
 * ADTS file format.
 *
 * Do not instantiate this class; use the {@link ADTS} singleton instead.
 *
 * @group Input formats
 * @public
 */ parcelHelpers.export(exports, "AdtsInputFormat", ()=>AdtsInputFormat);
parcelHelpers.export(exports, "MP4", ()=>MP4);
parcelHelpers.export(exports, "QTFF", ()=>QTFF);
parcelHelpers.export(exports, "MATROSKA", ()=>MATROSKA);
parcelHelpers.export(exports, "WEBM", ()=>WEBM);
parcelHelpers.export(exports, "MP3", ()=>MP3);
parcelHelpers.export(exports, "WAVE", ()=>WAVE);
parcelHelpers.export(exports, "OGG", ()=>OGG);
parcelHelpers.export(exports, "ADTS", ()=>ADTS);
parcelHelpers.export(exports, "FLAC", ()=>FLAC);
parcelHelpers.export(exports, "ALL_FORMATS", ()=>ALL_FORMATS);
var _isobmffDemuxerJs = require("./isobmff/isobmff-demuxer.js");
var _ebmlJs = require("./matroska/ebml.js");
var _matroskaDemuxerJs = require("./matroska/matroska-demuxer.js");
var _mp3DemuxerJs = require("./mp3/mp3-demuxer.js");
var _mp3MiscJs = require("../shared/mp3-misc.js");
var _id3Js = require("./id3.js");
var _mp3ReaderJs = require("./mp3/mp3-reader.js");
var _oggDemuxerJs = require("./ogg/ogg-demuxer.js");
var _waveDemuxerJs = require("./wave/wave-demuxer.js");
var _adtsReaderJs = require("./adts/adts-reader.js");
var _adtsDemuxerJs = require("./adts/adts-demuxer.js");
var _readerJs = require("./reader.js");
var _flacDemuxerJs = require("./flac/flac-demuxer.js");
class InputFormat {
}
class IsobmffInputFormat extends InputFormat {
    /** @internal */ async _getMajorBrand(input) {
        let slice = input._reader.requestSlice(0, 12);
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return null;
        slice.skip(4);
        const fourCc = (0, _readerJs.readAscii)(slice, 4);
        if (fourCc !== 'ftyp') return null;
        return (0, _readerJs.readAscii)(slice, 4);
    }
    /** @internal */ _createDemuxer(input) {
        return new (0, _isobmffDemuxerJs.IsobmffDemuxer)(input);
    }
}
class Mp4InputFormat extends IsobmffInputFormat {
    /** @internal */ async _canReadInput(input) {
        const majorBrand = await this._getMajorBrand(input);
        return !!majorBrand && majorBrand !== 'qt  ';
    }
    get name() {
        return 'MP4';
    }
    get mimeType() {
        return 'video/mp4';
    }
}
class QuickTimeInputFormat extends IsobmffInputFormat {
    /** @internal */ async _canReadInput(input) {
        const majorBrand = await this._getMajorBrand(input);
        return majorBrand === 'qt  ';
    }
    get name() {
        return 'QuickTime File Format';
    }
    get mimeType() {
        return 'video/quicktime';
    }
}
class MatroskaInputFormat extends InputFormat {
    /** @internal */ async isSupportedEBMLOfDocType(input, desiredDocType) {
        let headerSlice = input._reader.requestSlice(0, (0, _ebmlJs.MAX_HEADER_SIZE));
        if (headerSlice instanceof Promise) headerSlice = await headerSlice;
        if (!headerSlice) return false;
        const varIntSize = (0, _ebmlJs.readVarIntSize)(headerSlice);
        if (varIntSize === null) return false;
        if (varIntSize < 1 || varIntSize > 8) return false;
        const id = (0, _ebmlJs.readUnsignedInt)(headerSlice, varIntSize);
        if (id !== (0, _ebmlJs.EBMLId).EBML) return false;
        const dataSize = (0, _ebmlJs.readElementSize)(headerSlice);
        if (dataSize === null) return false; // Miss me with that shit
        let dataSlice = input._reader.requestSlice(headerSlice.filePos, dataSize);
        if (dataSlice instanceof Promise) dataSlice = await dataSlice;
        if (!dataSlice) return false;
        const startPos = headerSlice.filePos;
        while(dataSlice.filePos <= startPos + dataSize - (0, _ebmlJs.MIN_HEADER_SIZE)){
            const header = (0, _ebmlJs.readElementHeader)(dataSlice);
            if (!header) break;
            const { id, size } = header;
            const dataStartPos = dataSlice.filePos;
            if (size === null) return false;
            switch(id){
                case (0, _ebmlJs.EBMLId).EBMLVersion:
                    {
                        const ebmlVersion = (0, _ebmlJs.readUnsignedInt)(dataSlice, size);
                        if (ebmlVersion !== 1) return false;
                    }
                    break;
                case (0, _ebmlJs.EBMLId).EBMLReadVersion:
                    {
                        const ebmlReadVersion = (0, _ebmlJs.readUnsignedInt)(dataSlice, size);
                        if (ebmlReadVersion !== 1) return false;
                    }
                    break;
                case (0, _ebmlJs.EBMLId).DocType:
                    {
                        const docType = (0, _ebmlJs.readAsciiString)(dataSlice, size);
                        if (docType !== desiredDocType) return false;
                    }
                    break;
                case (0, _ebmlJs.EBMLId).DocTypeVersion:
                    {
                        const docTypeVersion = (0, _ebmlJs.readUnsignedInt)(dataSlice, size);
                        if (docTypeVersion > 4) return false;
                    }
                    break;
            }
            dataSlice.filePos = dataStartPos + size;
        }
        return true;
    }
    /** @internal */ _canReadInput(input) {
        return this.isSupportedEBMLOfDocType(input, 'matroska');
    }
    /** @internal */ _createDemuxer(input) {
        return new (0, _matroskaDemuxerJs.MatroskaDemuxer)(input);
    }
    get name() {
        return 'Matroska';
    }
    get mimeType() {
        return 'video/x-matroska';
    }
}
class WebMInputFormat extends MatroskaInputFormat {
    /** @internal */ _canReadInput(input) {
        return this.isSupportedEBMLOfDocType(input, 'webm');
    }
    get name() {
        return 'WebM';
    }
    get mimeType() {
        return 'video/webm';
    }
}
class Mp3InputFormat extends InputFormat {
    /** @internal */ async _canReadInput(input) {
        let slice = input._reader.requestSlice(0, 10);
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return false;
        let currentPos = 0;
        let id3V2HeaderFound = false;
        while(true){
            let slice = input._reader.requestSlice(currentPos, (0, _id3Js.ID3_V2_HEADER_SIZE));
            if (slice instanceof Promise) slice = await slice;
            if (!slice) break;
            const id3V2Header = (0, _id3Js.readId3V2Header)(slice);
            if (!id3V2Header) break;
            id3V2HeaderFound = true;
            currentPos = slice.filePos + id3V2Header.size;
        }
        const firstResult = await (0, _mp3ReaderJs.readNextFrameHeader)(input._reader, currentPos, currentPos + 4096);
        if (!firstResult) return false;
        if (id3V2HeaderFound) // If there was an ID3v2 tag at the start, we can be pretty sure this is MP3 by now
        return true;
        currentPos = firstResult.startPos + firstResult.header.totalSize;
        // Fine, we found one frame header, but we're still not entirely sure this is MP3. Let's check if we can find
        // another header right after it:
        const secondResult = await (0, _mp3ReaderJs.readNextFrameHeader)(input._reader, currentPos, currentPos + (0, _mp3MiscJs.FRAME_HEADER_SIZE));
        if (!secondResult) return false;
        const firstHeader = firstResult.header;
        const secondHeader = secondResult.header;
        // In a well-formed MP3 file, we'd expect these two frames to share some similarities:
        if (firstHeader.channel !== secondHeader.channel || firstHeader.sampleRate !== secondHeader.sampleRate) return false;
        // We have found two matching consecutive MP3 frames, a strong indicator that this is an MP3 file
        return true;
    }
    /** @internal */ _createDemuxer(input) {
        return new (0, _mp3DemuxerJs.Mp3Demuxer)(input);
    }
    get name() {
        return 'MP3';
    }
    get mimeType() {
        return 'audio/mpeg';
    }
}
class WaveInputFormat extends InputFormat {
    /** @internal */ async _canReadInput(input) {
        let slice = input._reader.requestSlice(0, 12);
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return false;
        const riffType = (0, _readerJs.readAscii)(slice, 4);
        if (riffType !== 'RIFF' && riffType !== 'RIFX' && riffType !== 'RF64') return false;
        slice.skip(4);
        const format = (0, _readerJs.readAscii)(slice, 4);
        return format === 'WAVE';
    }
    /** @internal */ _createDemuxer(input) {
        return new (0, _waveDemuxerJs.WaveDemuxer)(input);
    }
    get name() {
        return 'WAVE';
    }
    get mimeType() {
        return 'audio/wav';
    }
}
class OggInputFormat extends InputFormat {
    /** @internal */ async _canReadInput(input) {
        let slice = input._reader.requestSlice(0, 4);
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return false;
        return (0, _readerJs.readAscii)(slice, 4) === 'OggS';
    }
    /** @internal */ _createDemuxer(input) {
        return new (0, _oggDemuxerJs.OggDemuxer)(input);
    }
    get name() {
        return 'Ogg';
    }
    get mimeType() {
        return 'application/ogg';
    }
}
class FlacInputFormat extends InputFormat {
    /** @internal */ async _canReadInput(input) {
        let slice = input._reader.requestSlice(0, 4);
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return false;
        return (0, _readerJs.readAscii)(slice, 4) === 'fLaC';
    }
    get name() {
        return 'FLAC';
    }
    get mimeType() {
        return 'audio/flac';
    }
    /** @internal */ _createDemuxer(input) {
        return new (0, _flacDemuxerJs.FlacDemuxer)(input);
    }
}
class AdtsInputFormat extends InputFormat {
    /** @internal */ async _canReadInput(input) {
        let slice = input._reader.requestSliceRange(0, (0, _adtsReaderJs.MIN_FRAME_HEADER_SIZE), (0, _adtsReaderJs.MAX_FRAME_HEADER_SIZE));
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return false;
        const firstHeader = (0, _adtsReaderJs.readFrameHeader)(slice);
        if (!firstHeader) return false;
        slice = input._reader.requestSliceRange(firstHeader.frameLength, (0, _adtsReaderJs.MIN_FRAME_HEADER_SIZE), (0, _adtsReaderJs.MAX_FRAME_HEADER_SIZE));
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return false;
        const secondHeader = (0, _adtsReaderJs.readFrameHeader)(slice);
        if (!secondHeader) return false;
        return firstHeader.objectType === secondHeader.objectType && firstHeader.samplingFrequencyIndex === secondHeader.samplingFrequencyIndex && firstHeader.channelConfiguration === secondHeader.channelConfiguration;
    }
    /** @internal */ _createDemuxer(input) {
        return new (0, _adtsDemuxerJs.AdtsDemuxer)(input);
    }
    get name() {
        return 'ADTS';
    }
    get mimeType() {
        return 'audio/aac';
    }
}
const MP4 = /* #__PURE__ */ new Mp4InputFormat();
const QTFF = /* #__PURE__ */ new QuickTimeInputFormat();
const MATROSKA = /* #__PURE__ */ new MatroskaInputFormat();
const WEBM = /* #__PURE__ */ new WebMInputFormat();
const MP3 = /* #__PURE__ */ new Mp3InputFormat();
const WAVE = /* #__PURE__ */ new WaveInputFormat();
const OGG = /* #__PURE__ */ new OggInputFormat();
const ADTS = /* #__PURE__ */ new AdtsInputFormat();
const FLAC = /* #__PURE__ */ new FlacInputFormat();
const ALL_FORMATS = [
    MP4,
    QTFF,
    MATROSKA,
    WEBM,
    WAVE,
    OGG,
    FLAC,
    MP3,
    ADTS
];

},{"./isobmff/isobmff-demuxer.js":"hzGAw","./matroska/ebml.js":"b6nkD","./matroska/matroska-demuxer.js":"lx8cS","./mp3/mp3-demuxer.js":"aMGxe","../shared/mp3-misc.js":"k3lpY","./id3.js":"5tvk3","./mp3/mp3-reader.js":"kFP95","./ogg/ogg-demuxer.js":"2yNaV","./wave/wave-demuxer.js":"aafYY","./adts/adts-reader.js":"jOxJW","./adts/adts-demuxer.js":"fMkVV","./reader.js":"fr2Ka","./flac/flac-demuxer.js":"kBazS","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"hzGAw":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "IsobmffDemuxer", ()=>IsobmffDemuxer);
var _codecJs = require("../codec.js");
var _codecDataJs = require("../codec-data.js");
var _demuxerJs = require("../demuxer.js");
var _inputTrackJs = require("../input-track.js");
var _miscJs = require("../misc.js");
var _packetJs = require("../packet.js");
var _isobmffMiscJs = require("./isobmff-misc.js");
var _isobmffReaderJs = require("./isobmff-reader.js");
var _readerJs = require("../reader.js");
var _metadataJs = require("../metadata.js");
class IsobmffDemuxer extends (0, _demuxerJs.Demuxer) {
    constructor(input){
        super(input);
        this.moovSlice = null;
        this.currentTrack = null;
        this.tracks = [];
        this.metadataPromise = null;
        this.movieTimescale = -1;
        this.movieDurationInTimescale = -1;
        this.isQuickTime = false;
        this.metadataTags = {};
        this.currentMetadataKeys = null;
        this.isFragmented = false;
        this.fragmentTrackDefaults = [];
        this.currentFragment = null;
        /**
         * Caches the last fragment that was read. Based on the assumption that there will be multiple reads to the
         * same fragment in quick succession.
         */ this.lastReadFragment = null;
        this.reader = input._reader;
    }
    async computeDuration() {
        const tracks = await this.getTracks();
        const trackDurations = await Promise.all(tracks.map((x)=>x.computeDuration()));
        return Math.max(0, ...trackDurations);
    }
    async getTracks() {
        await this.readMetadata();
        return this.tracks.map((track)=>track.inputTrack);
    }
    async getMimeType() {
        await this.readMetadata();
        const codecStrings = await Promise.all(this.tracks.map((x)=>x.inputTrack.getCodecParameterString()));
        return (0, _isobmffMiscJs.buildIsobmffMimeType)({
            isQuickTime: this.isQuickTime,
            hasVideo: this.tracks.some((x)=>x.info?.type === 'video'),
            hasAudio: this.tracks.some((x)=>x.info?.type === 'audio'),
            codecStrings: codecStrings.filter(Boolean)
        });
    }
    async getMetadataTags() {
        await this.readMetadata();
        return this.metadataTags;
    }
    readMetadata() {
        return this.metadataPromise ??= (async ()=>{
            let currentPos = 0;
            while(true){
                let slice = this.reader.requestSliceRange(currentPos, (0, _isobmffReaderJs.MIN_BOX_HEADER_SIZE), (0, _isobmffReaderJs.MAX_BOX_HEADER_SIZE));
                if (slice instanceof Promise) slice = await slice;
                if (!slice) break;
                const startPos = currentPos;
                const boxInfo = (0, _isobmffReaderJs.readBoxHeader)(slice);
                if (!boxInfo) break;
                if (boxInfo.name === 'ftyp') {
                    const majorBrand = (0, _readerJs.readAscii)(slice, 4);
                    this.isQuickTime = majorBrand === 'qt  ';
                } else if (boxInfo.name === 'moov') {
                    // Found moov, load it
                    let moovSlice = this.reader.requestSlice(slice.filePos, boxInfo.contentSize);
                    if (moovSlice instanceof Promise) moovSlice = await moovSlice;
                    if (!moovSlice) break;
                    this.moovSlice = moovSlice;
                    this.readContiguousBoxes(this.moovSlice);
                    // Put default tracks first
                    this.tracks.sort((a, b)=>Number(b.disposition.default) - Number(a.disposition.default));
                    for (const track of this.tracks){
                        // Modify the edit list offset based on the previous segment durations. They are in different
                        // timescales, so we first convert to seconds and then into the track timescale.
                        const previousSegmentDurationsInSeconds = track.editListPreviousSegmentDurations / this.movieTimescale;
                        track.editListOffset -= Math.round(previousSegmentDurationsInSeconds * track.timescale);
                    }
                    break;
                }
                currentPos = startPos + boxInfo.totalSize;
            }
            if (this.isFragmented && this.reader.fileSize !== null) {
                // The last 4 bytes may contain the size of the mfra box at the end of the file
                let lastWordSlice = this.reader.requestSlice(this.reader.fileSize - 4, 4);
                if (lastWordSlice instanceof Promise) lastWordSlice = await lastWordSlice;
                (0, _miscJs.assert)(lastWordSlice);
                const lastWord = (0, _readerJs.readU32Be)(lastWordSlice);
                const potentialMfraPos = this.reader.fileSize - lastWord;
                if (potentialMfraPos >= 0 && potentialMfraPos <= this.reader.fileSize - (0, _isobmffReaderJs.MAX_BOX_HEADER_SIZE)) {
                    let mfraHeaderSlice = this.reader.requestSliceRange(potentialMfraPos, (0, _isobmffReaderJs.MIN_BOX_HEADER_SIZE), (0, _isobmffReaderJs.MAX_BOX_HEADER_SIZE));
                    if (mfraHeaderSlice instanceof Promise) mfraHeaderSlice = await mfraHeaderSlice;
                    if (mfraHeaderSlice) {
                        const boxInfo = (0, _isobmffReaderJs.readBoxHeader)(mfraHeaderSlice);
                        if (boxInfo && boxInfo.name === 'mfra') {
                            // We found the mfra box, allowing for much better random access. Let's parse it.
                            let mfraSlice = this.reader.requestSlice(mfraHeaderSlice.filePos, boxInfo.contentSize);
                            if (mfraSlice instanceof Promise) mfraSlice = await mfraSlice;
                            if (mfraSlice) this.readContiguousBoxes(mfraSlice);
                        }
                    }
                }
            }
        })();
    }
    getSampleTableForTrack(internalTrack) {
        if (internalTrack.sampleTable) return internalTrack.sampleTable;
        const sampleTable = {
            sampleTimingEntries: [],
            sampleCompositionTimeOffsets: [],
            sampleSizes: [],
            keySampleIndices: null,
            chunkOffsets: [],
            sampleToChunk: [],
            presentationTimestamps: null,
            presentationTimestampIndexMap: null
        };
        internalTrack.sampleTable = sampleTable;
        (0, _miscJs.assert)(this.moovSlice);
        const stblContainerSlice = this.moovSlice.slice(internalTrack.sampleTableByteOffset);
        this.currentTrack = internalTrack;
        this.traverseBox(stblContainerSlice);
        this.currentTrack = null;
        const isPcmCodec = internalTrack.info?.type === 'audio' && internalTrack.info.codec && (0, _codecJs.PCM_AUDIO_CODECS).includes(internalTrack.info.codec);
        if (isPcmCodec && sampleTable.sampleCompositionTimeOffsets.length === 0) {
            // If the audio has PCM samples, the way the samples are defined in the sample table is somewhat
            // suboptimal: Each individual audio sample is its own sample, meaning we can have 48000 samples per second.
            // Because we treat each sample as its own atomic unit that can be decoded, this would lead to a huge
            // amount of very short samples for PCM audio. So instead, we make a transformation: If the audio is in PCM,
            // we say that each chunk (that normally holds many samples) now is one big sample. We can this because
            // the samples in the chunk are contiguous and the format is PCM, so the entire chunk as one thing still
            // encodes valid audio information.
            (0, _miscJs.assert)(internalTrack.info?.type === 'audio');
            const pcmInfo = (0, _codecJs.parsePcmCodec)(internalTrack.info.codec);
            const newSampleTimingEntries = [];
            const newSampleSizes = [];
            for(let i = 0; i < sampleTable.sampleToChunk.length; i++){
                const chunkEntry = sampleTable.sampleToChunk[i];
                const nextEntry = sampleTable.sampleToChunk[i + 1];
                const chunkCount = (nextEntry ? nextEntry.startChunkIndex : sampleTable.chunkOffsets.length) - chunkEntry.startChunkIndex;
                for(let j = 0; j < chunkCount; j++){
                    const startSampleIndex = chunkEntry.startSampleIndex + j * chunkEntry.samplesPerChunk;
                    const endSampleIndex = startSampleIndex + chunkEntry.samplesPerChunk; // Exclusive, outside of chunk
                    const startTimingEntryIndex = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.sampleTimingEntries, startSampleIndex, (x)=>x.startIndex);
                    const startTimingEntry = sampleTable.sampleTimingEntries[startTimingEntryIndex];
                    const endTimingEntryIndex = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.sampleTimingEntries, endSampleIndex, (x)=>x.startIndex);
                    const endTimingEntry = sampleTable.sampleTimingEntries[endTimingEntryIndex];
                    const firstSampleTimestamp = startTimingEntry.startDecodeTimestamp + (startSampleIndex - startTimingEntry.startIndex) * startTimingEntry.delta;
                    const lastSampleTimestamp = endTimingEntry.startDecodeTimestamp + (endSampleIndex - endTimingEntry.startIndex) * endTimingEntry.delta;
                    const delta = lastSampleTimestamp - firstSampleTimestamp;
                    const lastSampleTimingEntry = (0, _miscJs.last)(newSampleTimingEntries);
                    if (lastSampleTimingEntry && lastSampleTimingEntry.delta === delta) lastSampleTimingEntry.count++;
                    else // One sample for the entire chunk
                    newSampleTimingEntries.push({
                        startIndex: chunkEntry.startChunkIndex + j,
                        startDecodeTimestamp: firstSampleTimestamp,
                        count: 1,
                        delta
                    });
                    // Instead of determining the chunk's size by looping over the samples sizes in the sample table, we
                    // can directly compute it as we know how many PCM frames are in this chunk, and the size of each
                    // PCM frame. This also improves compatibility with some files which fail to write proper sample
                    // size values into their sample tables in the PCM case.
                    const chunkSize = chunkEntry.samplesPerChunk * pcmInfo.sampleSize * internalTrack.info.numberOfChannels;
                    newSampleSizes.push(chunkSize);
                }
                chunkEntry.startSampleIndex = chunkEntry.startChunkIndex;
                chunkEntry.samplesPerChunk = 1;
            }
            sampleTable.sampleTimingEntries = newSampleTimingEntries;
            sampleTable.sampleSizes = newSampleSizes;
        }
        if (sampleTable.sampleCompositionTimeOffsets.length > 0) {
            // If composition time offsets are defined, we must build a list of all presentation timestamps and then
            // sort them
            sampleTable.presentationTimestamps = [];
            for (const entry of sampleTable.sampleTimingEntries)for(let i = 0; i < entry.count; i++)sampleTable.presentationTimestamps.push({
                presentationTimestamp: entry.startDecodeTimestamp + i * entry.delta,
                sampleIndex: entry.startIndex + i
            });
            for (const entry of sampleTable.sampleCompositionTimeOffsets)for(let i = 0; i < entry.count; i++){
                const sampleIndex = entry.startIndex + i;
                const sample = sampleTable.presentationTimestamps[sampleIndex];
                if (!sample) continue;
                sample.presentationTimestamp += entry.offset;
            }
            sampleTable.presentationTimestamps.sort((a, b)=>a.presentationTimestamp - b.presentationTimestamp);
            sampleTable.presentationTimestampIndexMap = Array(sampleTable.presentationTimestamps.length).fill(-1);
            for(let i = 0; i < sampleTable.presentationTimestamps.length; i++)sampleTable.presentationTimestampIndexMap[sampleTable.presentationTimestamps[i].sampleIndex] = i;
        }
        return sampleTable;
    }
    async readFragment(startPos) {
        if (this.lastReadFragment?.moofOffset === startPos) return this.lastReadFragment;
        let headerSlice = this.reader.requestSliceRange(startPos, (0, _isobmffReaderJs.MIN_BOX_HEADER_SIZE), (0, _isobmffReaderJs.MAX_BOX_HEADER_SIZE));
        if (headerSlice instanceof Promise) headerSlice = await headerSlice;
        (0, _miscJs.assert)(headerSlice);
        const moofBoxInfo = (0, _isobmffReaderJs.readBoxHeader)(headerSlice);
        (0, _miscJs.assert)(moofBoxInfo?.name === 'moof');
        let entireSlice = this.reader.requestSlice(startPos, moofBoxInfo.totalSize);
        if (entireSlice instanceof Promise) entireSlice = await entireSlice;
        (0, _miscJs.assert)(entireSlice);
        this.traverseBox(entireSlice);
        const fragment = this.lastReadFragment;
        (0, _miscJs.assert)(fragment && fragment.moofOffset === startPos);
        for (const [, trackData] of fragment.trackData){
            const track = trackData.track;
            const { fragmentPositionCache } = track;
            if (!trackData.startTimestampIsFinal) {
                // It may be that some tracks don't define the base decode time, i.e. when the fragment begins. This
                // we'll need to figure out the start timestamp another way. We'll compute the timestamp by accessing
                // the lookup entries and fragment cache, which works out nicely with the lookup algorithm: If these
                // exist, then the lookup will automatically start at the furthest possible point. If they don't, the
                // lookup starts sequentially from the start, incrementally summing up all fragment durations. It's sort
                // of implicit, but it ends up working nicely.
                const lookupEntry = track.fragmentLookupTable.find((x)=>x.moofOffset === fragment.moofOffset);
                if (lookupEntry) // There's a lookup entry, let's use its timestamp
                offsetFragmentTrackDataByTimestamp(trackData, lookupEntry.timestamp);
                else {
                    const lastCacheIndex = (0, _miscJs.binarySearchLessOrEqual)(fragmentPositionCache, fragment.moofOffset - 1, (x)=>x.moofOffset);
                    if (lastCacheIndex !== -1) {
                        // Let's use the timestamp of the previous fragment in the cache
                        const lastCache = fragmentPositionCache[lastCacheIndex];
                        offsetFragmentTrackDataByTimestamp(trackData, lastCache.endTimestamp);
                    }
                }
                trackData.startTimestampIsFinal = true;
            }
            // Let's remember that a fragment with a given timestamp is here, speeding up future lookups if no
            // lookup table exists
            const insertionIndex = (0, _miscJs.binarySearchLessOrEqual)(fragmentPositionCache, trackData.startTimestamp, (x)=>x.startTimestamp);
            if (insertionIndex === -1 || fragmentPositionCache[insertionIndex].moofOffset !== fragment.moofOffset) fragmentPositionCache.splice(insertionIndex + 1, 0, {
                moofOffset: fragment.moofOffset,
                startTimestamp: trackData.startTimestamp,
                endTimestamp: trackData.endTimestamp
            });
        }
        return fragment;
    }
    readContiguousBoxes(slice) {
        const startIndex = slice.filePos;
        while(slice.filePos - startIndex <= slice.length - (0, _isobmffReaderJs.MIN_BOX_HEADER_SIZE)){
            const foundBox = this.traverseBox(slice);
            if (!foundBox) break;
        }
    }
    // eslint-disable-next-line @stylistic/generator-star-spacing
    *iterateContiguousBoxes(slice) {
        const startIndex = slice.filePos;
        while(slice.filePos - startIndex <= slice.length - (0, _isobmffReaderJs.MIN_BOX_HEADER_SIZE)){
            const startPos = slice.filePos;
            const boxInfo = (0, _isobmffReaderJs.readBoxHeader)(slice);
            if (!boxInfo) break;
            yield {
                boxInfo,
                slice
            };
            slice.filePos = startPos + boxInfo.totalSize;
        }
    }
    traverseBox(slice) {
        const startPos = slice.filePos;
        const boxInfo = (0, _isobmffReaderJs.readBoxHeader)(slice);
        if (!boxInfo) return false;
        const contentStartPos = slice.filePos;
        const boxEndPos = startPos + boxInfo.totalSize;
        switch(boxInfo.name){
            case 'mdia':
            case 'minf':
            case 'dinf':
            case 'mfra':
            case 'edts':
                this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                break;
            case 'mvhd':
                {
                    const version = (0, _readerJs.readU8)(slice);
                    slice.skip(3); // Flags
                    if (version === 1) {
                        slice.skip(16);
                        this.movieTimescale = (0, _readerJs.readU32Be)(slice);
                        this.movieDurationInTimescale = (0, _readerJs.readU64Be)(slice);
                    } else {
                        slice.skip(8);
                        this.movieTimescale = (0, _readerJs.readU32Be)(slice);
                        this.movieDurationInTimescale = (0, _readerJs.readU32Be)(slice);
                    }
                }
                break;
            case 'trak':
                {
                    const track = {
                        id: -1,
                        demuxer: this,
                        inputTrack: null,
                        disposition: {
                            ...(0, _metadataJs.DEFAULT_TRACK_DISPOSITION)
                        },
                        info: null,
                        timescale: -1,
                        durationInMovieTimescale: -1,
                        durationInMediaTimescale: -1,
                        rotation: 0,
                        internalCodecId: null,
                        name: null,
                        languageCode: (0, _miscJs.UNDETERMINED_LANGUAGE),
                        sampleTableByteOffset: -1,
                        sampleTable: null,
                        fragmentLookupTable: [],
                        currentFragmentState: null,
                        fragmentPositionCache: [],
                        editListPreviousSegmentDurations: 0,
                        editListOffset: 0
                    };
                    this.currentTrack = track;
                    this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                    if (track.id !== -1 && track.timescale !== -1 && track.info !== null) {
                        if (track.info.type === 'video' && track.info.width !== -1) {
                            const videoTrack = track;
                            track.inputTrack = new (0, _inputTrackJs.InputVideoTrack)(this.input, new IsobmffVideoTrackBacking(videoTrack));
                            this.tracks.push(track);
                        } else if (track.info.type === 'audio' && track.info.numberOfChannels !== -1) {
                            const audioTrack = track;
                            track.inputTrack = new (0, _inputTrackJs.InputAudioTrack)(this.input, new IsobmffAudioTrackBacking(audioTrack));
                            this.tracks.push(track);
                        }
                    }
                    this.currentTrack = null;
                }
                break;
            case 'tkhd':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    const version = (0, _readerJs.readU8)(slice);
                    const flags = (0, _readerJs.readU24Be)(slice);
                    // Spec says disabled tracks are to be treated like they don't exist, but in practice, they are treated
                    // more like non-default tracks.
                    const trackEnabled = !!(flags & 0x1);
                    track.disposition.default = trackEnabled;
                    // Skip over creation & modification time to reach the track ID
                    if (version === 0) {
                        slice.skip(8);
                        track.id = (0, _readerJs.readU32Be)(slice);
                        slice.skip(4);
                        track.durationInMovieTimescale = (0, _readerJs.readU32Be)(slice);
                    } else if (version === 1) {
                        slice.skip(16);
                        track.id = (0, _readerJs.readU32Be)(slice);
                        slice.skip(4);
                        track.durationInMovieTimescale = (0, _readerJs.readU64Be)(slice);
                    } else throw new Error(`Incorrect track header version ${version}.`);
                    slice.skip(16);
                    const matrix = [
                        (0, _isobmffReaderJs.readFixed_16_16)(slice),
                        (0, _isobmffReaderJs.readFixed_16_16)(slice),
                        (0, _isobmffReaderJs.readFixed_2_30)(slice),
                        (0, _isobmffReaderJs.readFixed_16_16)(slice),
                        (0, _isobmffReaderJs.readFixed_16_16)(slice),
                        (0, _isobmffReaderJs.readFixed_2_30)(slice),
                        (0, _isobmffReaderJs.readFixed_16_16)(slice),
                        (0, _isobmffReaderJs.readFixed_16_16)(slice),
                        (0, _isobmffReaderJs.readFixed_2_30)(slice)
                    ];
                    const rotation = (0, _miscJs.normalizeRotation)((0, _miscJs.roundToMultiple)(extractRotationFromMatrix(matrix), 90));
                    (0, _miscJs.assert)(rotation === 0 || rotation === 90 || rotation === 180 || rotation === 270);
                    track.rotation = rotation;
                }
                break;
            case 'elst':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    const version = (0, _readerJs.readU8)(slice);
                    slice.skip(3); // Flags
                    let relevantEntryFound = false;
                    let previousSegmentDurations = 0;
                    const entryCount = (0, _readerJs.readU32Be)(slice);
                    for(let i = 0; i < entryCount; i++){
                        const segmentDuration = version === 1 ? (0, _readerJs.readU64Be)(slice) : (0, _readerJs.readU32Be)(slice);
                        const mediaTime = version === 1 ? (0, _readerJs.readI64Be)(slice) : (0, _readerJs.readI32Be)(slice);
                        const mediaRate = (0, _isobmffReaderJs.readFixed_16_16)(slice);
                        if (segmentDuration === 0) continue;
                        if (relevantEntryFound) {
                            console.warn('Unsupported edit list: multiple edits are not currently supported. Only using first edit.');
                            break;
                        }
                        if (mediaTime === -1) {
                            previousSegmentDurations += segmentDuration;
                            continue;
                        }
                        if (mediaRate !== 1) {
                            console.warn('Unsupported edit list entry: media rate must be 1.');
                            break;
                        }
                        track.editListPreviousSegmentDurations = previousSegmentDurations;
                        track.editListOffset = mediaTime;
                        relevantEntryFound = true;
                    }
                }
                break;
            case 'mdhd':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    const version = (0, _readerJs.readU8)(slice);
                    slice.skip(3); // Flags
                    if (version === 0) {
                        slice.skip(8);
                        track.timescale = (0, _readerJs.readU32Be)(slice);
                        track.durationInMediaTimescale = (0, _readerJs.readU32Be)(slice);
                    } else if (version === 1) {
                        slice.skip(16);
                        track.timescale = (0, _readerJs.readU32Be)(slice);
                        track.durationInMediaTimescale = (0, _readerJs.readU64Be)(slice);
                    }
                    let language = (0, _readerJs.readU16Be)(slice);
                    if (language > 0) {
                        track.languageCode = '';
                        for(let i = 0; i < 3; i++){
                            track.languageCode = String.fromCharCode(0x60 + (language & 31)) + track.languageCode;
                            language >>= 5;
                        }
                        if (!(0, _miscJs.isIso639Dash2LanguageCode)(track.languageCode)) // Sometimes the bytes are garbage
                        track.languageCode = (0, _miscJs.UNDETERMINED_LANGUAGE);
                    }
                }
                break;
            case 'hdlr':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    slice.skip(8); // Version + flags + pre-defined
                    const handlerType = (0, _readerJs.readAscii)(slice, 4);
                    if (handlerType === 'vide') track.info = {
                        type: 'video',
                        width: -1,
                        height: -1,
                        codec: null,
                        codecDescription: null,
                        colorSpace: null,
                        avcType: null,
                        avcCodecInfo: null,
                        hevcCodecInfo: null,
                        vp9CodecInfo: null,
                        av1CodecInfo: null
                    };
                    else if (handlerType === 'soun') track.info = {
                        type: 'audio',
                        numberOfChannels: -1,
                        sampleRate: -1,
                        codec: null,
                        codecDescription: null,
                        aacCodecInfo: null
                    };
                }
                break;
            case 'stbl':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    track.sampleTableByteOffset = startPos;
                    this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                }
                break;
            case 'stsd':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    if (track.info === null || track.sampleTable) break;
                    const stsdVersion = (0, _readerJs.readU8)(slice);
                    slice.skip(3); // Flags
                    const entries = (0, _readerJs.readU32Be)(slice);
                    for(let i = 0; i < entries; i++){
                        const sampleBoxStartPos = slice.filePos;
                        const sampleBoxInfo = (0, _isobmffReaderJs.readBoxHeader)(slice);
                        if (!sampleBoxInfo) break;
                        track.internalCodecId = sampleBoxInfo.name;
                        const lowercaseBoxName = sampleBoxInfo.name.toLowerCase();
                        if (track.info.type === 'video') {
                            if (lowercaseBoxName === 'avc1' || lowercaseBoxName === 'avc3') {
                                track.info.codec = 'avc';
                                track.info.avcType = lowercaseBoxName === 'avc1' ? 1 : 3;
                            } else if (lowercaseBoxName === 'hvc1' || lowercaseBoxName === 'hev1') track.info.codec = 'hevc';
                            else if (lowercaseBoxName === 'vp08') track.info.codec = 'vp8';
                            else if (lowercaseBoxName === 'vp09') track.info.codec = 'vp9';
                            else if (lowercaseBoxName === 'av01') track.info.codec = 'av1';
                            else console.warn(`Unsupported video codec (sample entry type '${sampleBoxInfo.name}').`);
                            slice.skip(24);
                            track.info.width = (0, _readerJs.readU16Be)(slice);
                            track.info.height = (0, _readerJs.readU16Be)(slice);
                            slice.skip(50);
                            this.readContiguousBoxes(slice.slice(slice.filePos, sampleBoxStartPos + sampleBoxInfo.totalSize - slice.filePos));
                        } else {
                            if (lowercaseBoxName === 'mp4a') ;
                            else if (lowercaseBoxName === 'opus') track.info.codec = 'opus';
                            else if (lowercaseBoxName === 'flac') track.info.codec = 'flac';
                            else if (lowercaseBoxName === 'twos' || lowercaseBoxName === 'sowt' || lowercaseBoxName === 'raw ' || lowercaseBoxName === 'in24' || lowercaseBoxName === 'in32' || lowercaseBoxName === 'fl32' || lowercaseBoxName === 'fl64' || lowercaseBoxName === 'lpcm' || lowercaseBoxName === 'ipcm' // ISO/IEC 23003-5
                             || lowercaseBoxName === 'fpcm' // "
                            ) ;
                            else if (lowercaseBoxName === 'ulaw') track.info.codec = 'ulaw';
                            else if (lowercaseBoxName === 'alaw') track.info.codec = 'alaw';
                            else console.warn(`Unsupported audio codec (sample entry type '${sampleBoxInfo.name}').`);
                            slice.skip(8);
                            const version = (0, _readerJs.readU16Be)(slice);
                            slice.skip(6);
                            let channelCount = (0, _readerJs.readU16Be)(slice);
                            let sampleSize = (0, _readerJs.readU16Be)(slice);
                            slice.skip(4);
                            // Can't use fixed16_16 as that's signed
                            let sampleRate = (0, _readerJs.readU32Be)(slice) / 0x10000;
                            if (stsdVersion === 0 && version > 0) {
                                // Additional QuickTime fields
                                if (version === 1) {
                                    slice.skip(4);
                                    sampleSize = 8 * (0, _readerJs.readU32Be)(slice);
                                    slice.skip(8);
                                } else if (version === 2) {
                                    slice.skip(4);
                                    sampleRate = (0, _readerJs.readF64Be)(slice);
                                    channelCount = (0, _readerJs.readU32Be)(slice);
                                    slice.skip(4); // Always 0x7f000000
                                    sampleSize = (0, _readerJs.readU32Be)(slice);
                                    const flags = (0, _readerJs.readU32Be)(slice);
                                    slice.skip(8);
                                    if (lowercaseBoxName === 'lpcm') {
                                        const bytesPerSample = sampleSize + 7 >> 3;
                                        const isFloat = Boolean(flags & 1);
                                        const isBigEndian = Boolean(flags & 2);
                                        const sFlags = flags & 4 ? -1 : 0; // I guess it means "signed flags" or something?
                                        if (sampleSize > 0 && sampleSize <= 64) {
                                            if (isFloat) {
                                                if (sampleSize === 32) track.info.codec = isBigEndian ? 'pcm-f32be' : 'pcm-f32';
                                            } else {
                                                if (sFlags & 1 << bytesPerSample - 1) {
                                                    if (bytesPerSample === 1) track.info.codec = 'pcm-s8';
                                                    else if (bytesPerSample === 2) track.info.codec = isBigEndian ? 'pcm-s16be' : 'pcm-s16';
                                                    else if (bytesPerSample === 3) track.info.codec = isBigEndian ? 'pcm-s24be' : 'pcm-s24';
                                                    else if (bytesPerSample === 4) track.info.codec = isBigEndian ? 'pcm-s32be' : 'pcm-s32';
                                                } else if (bytesPerSample === 1) track.info.codec = 'pcm-u8';
                                            }
                                        }
                                        if (track.info.codec === null) console.warn('Unsupported PCM format.');
                                    }
                                }
                            }
                            if (track.info.codec === 'opus') sampleRate = (0, _codecJs.OPUS_SAMPLE_RATE); // Always the same
                            track.info.numberOfChannels = channelCount;
                            track.info.sampleRate = sampleRate;
                            // PCM codec assignments
                            if (lowercaseBoxName === 'twos') {
                                if (sampleSize === 8) track.info.codec = 'pcm-s8';
                                else if (sampleSize === 16) track.info.codec = 'pcm-s16be';
                                else {
                                    console.warn(`Unsupported sample size ${sampleSize} for codec 'twos'.`);
                                    track.info.codec = null;
                                }
                            } else if (lowercaseBoxName === 'sowt') {
                                if (sampleSize === 8) track.info.codec = 'pcm-s8';
                                else if (sampleSize === 16) track.info.codec = 'pcm-s16';
                                else {
                                    console.warn(`Unsupported sample size ${sampleSize} for codec 'sowt'.`);
                                    track.info.codec = null;
                                }
                            } else if (lowercaseBoxName === 'raw ') track.info.codec = 'pcm-u8';
                            else if (lowercaseBoxName === 'in24') track.info.codec = 'pcm-s24be';
                            else if (lowercaseBoxName === 'in32') track.info.codec = 'pcm-s32be';
                            else if (lowercaseBoxName === 'fl32') track.info.codec = 'pcm-f32be';
                            else if (lowercaseBoxName === 'fl64') track.info.codec = 'pcm-f64be';
                            else if (lowercaseBoxName === 'ipcm') track.info.codec = 'pcm-s16be'; // Placeholder, will be adjusted by the pcmC box
                            else if (lowercaseBoxName === 'fpcm') track.info.codec = 'pcm-f32be'; // Placeholder, will be adjusted by the pcmC box
                            this.readContiguousBoxes(slice.slice(slice.filePos, sampleBoxStartPos + sampleBoxInfo.totalSize - slice.filePos));
                        }
                    }
                }
                break;
            case 'avcC':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info);
                    track.info.codecDescription = (0, _readerJs.readBytes)(slice, boxInfo.contentSize);
                }
                break;
            case 'hvcC':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info);
                    track.info.codecDescription = (0, _readerJs.readBytes)(slice, boxInfo.contentSize);
                }
                break;
            case 'vpcC':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info?.type === 'video');
                    slice.skip(4); // Version + flags
                    const profile = (0, _readerJs.readU8)(slice);
                    const level = (0, _readerJs.readU8)(slice);
                    const thirdByte = (0, _readerJs.readU8)(slice);
                    const bitDepth = thirdByte >> 4;
                    const chromaSubsampling = thirdByte >> 1 & 7;
                    const videoFullRangeFlag = thirdByte & 1;
                    const colourPrimaries = (0, _readerJs.readU8)(slice);
                    const transferCharacteristics = (0, _readerJs.readU8)(slice);
                    const matrixCoefficients = (0, _readerJs.readU8)(slice);
                    track.info.vp9CodecInfo = {
                        profile,
                        level,
                        bitDepth,
                        chromaSubsampling,
                        videoFullRangeFlag,
                        colourPrimaries,
                        transferCharacteristics,
                        matrixCoefficients
                    };
                }
                break;
            case 'av1C':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info?.type === 'video');
                    slice.skip(1); // Marker + version
                    const secondByte = (0, _readerJs.readU8)(slice);
                    const profile = secondByte >> 5;
                    const level = secondByte & 31;
                    const thirdByte = (0, _readerJs.readU8)(slice);
                    const tier = thirdByte >> 7;
                    const highBitDepth = thirdByte >> 6 & 1;
                    const twelveBit = thirdByte >> 5 & 1;
                    const monochrome = thirdByte >> 4 & 1;
                    const chromaSubsamplingX = thirdByte >> 3 & 1;
                    const chromaSubsamplingY = thirdByte >> 2 & 1;
                    const chromaSamplePosition = thirdByte & 3;
                    // Logic from https://aomediacodec.github.io/av1-spec/av1-spec.pdf
                    const bitDepth = profile === 2 && highBitDepth ? twelveBit ? 12 : 10 : highBitDepth ? 10 : 8;
                    track.info.av1CodecInfo = {
                        profile,
                        level,
                        tier,
                        bitDepth,
                        monochrome,
                        chromaSubsamplingX,
                        chromaSubsamplingY,
                        chromaSamplePosition
                    };
                }
                break;
            case 'colr':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info?.type === 'video');
                    const colourType = (0, _readerJs.readAscii)(slice, 4);
                    if (colourType !== 'nclx') break;
                    const colourPrimaries = (0, _readerJs.readU16Be)(slice);
                    const transferCharacteristics = (0, _readerJs.readU16Be)(slice);
                    const matrixCoefficients = (0, _readerJs.readU16Be)(slice);
                    const fullRangeFlag = Boolean((0, _readerJs.readU8)(slice) & 0x80);
                    track.info.colorSpace = {
                        primaries: (0, _miscJs.COLOR_PRIMARIES_MAP_INVERSE)[colourPrimaries],
                        transfer: (0, _miscJs.TRANSFER_CHARACTERISTICS_MAP_INVERSE)[transferCharacteristics],
                        matrix: (0, _miscJs.MATRIX_COEFFICIENTS_MAP_INVERSE)[matrixCoefficients],
                        fullRange: fullRangeFlag
                    };
                }
                break;
            case 'wave':
                this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                break;
            case 'esds':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info?.type === 'audio');
                    slice.skip(4); // Version + flags
                    const tag = (0, _readerJs.readU8)(slice);
                    (0, _miscJs.assert)(tag === 0x03); // ES Descriptor
                    (0, _isobmffReaderJs.readIsomVariableInteger)(slice); // Length
                    slice.skip(2); // ES ID
                    const mixed = (0, _readerJs.readU8)(slice);
                    const streamDependenceFlag = (mixed & 0x80) !== 0;
                    const urlFlag = (mixed & 0x40) !== 0;
                    const ocrStreamFlag = (mixed & 0x20) !== 0;
                    if (streamDependenceFlag) slice.skip(2);
                    if (urlFlag) {
                        const urlLength = (0, _readerJs.readU8)(slice);
                        slice.skip(urlLength);
                    }
                    if (ocrStreamFlag) slice.skip(2);
                    const decoderConfigTag = (0, _readerJs.readU8)(slice);
                    (0, _miscJs.assert)(decoderConfigTag === 0x04); // DecoderConfigDescriptor
                    const decoderConfigDescriptorLength = (0, _isobmffReaderJs.readIsomVariableInteger)(slice); // Length
                    const payloadStart = slice.filePos;
                    const objectTypeIndication = (0, _readerJs.readU8)(slice);
                    if (objectTypeIndication === 0x40 || objectTypeIndication === 0x67) {
                        track.info.codec = 'aac';
                        track.info.aacCodecInfo = {
                            isMpeg2: objectTypeIndication === 0x67
                        };
                    } else if (objectTypeIndication === 0x69 || objectTypeIndication === 0x6b) track.info.codec = 'mp3';
                    else if (objectTypeIndication === 0xdd) track.info.codec = 'vorbis'; // "nonstandard, gpac uses it" - FFmpeg
                    else console.warn(`Unsupported audio codec (objectTypeIndication ${objectTypeIndication}) - discarding track.`);
                    slice.skip(12);
                    if (decoderConfigDescriptorLength > slice.filePos - payloadStart) {
                        // There's a DecoderSpecificInfo at the end, let's read it
                        const decoderSpecificInfoTag = (0, _readerJs.readU8)(slice);
                        (0, _miscJs.assert)(decoderSpecificInfoTag === 0x05); // DecoderSpecificInfo
                        const decoderSpecificInfoLength = (0, _isobmffReaderJs.readIsomVariableInteger)(slice);
                        track.info.codecDescription = (0, _readerJs.readBytes)(slice, decoderSpecificInfoLength);
                        if (track.info.codec === 'aac') {
                            // Let's try to deduce more accurate values directly from the AudioSpecificConfig:
                            const audioSpecificConfig = (0, _codecJs.parseAacAudioSpecificConfig)(track.info.codecDescription);
                            if (audioSpecificConfig.numberOfChannels !== null) track.info.numberOfChannels = audioSpecificConfig.numberOfChannels;
                            if (audioSpecificConfig.sampleRate !== null) track.info.sampleRate = audioSpecificConfig.sampleRate;
                        }
                    }
                }
                break;
            case 'enda':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info?.type === 'audio');
                    const littleEndian = (0, _readerJs.readU16Be)(slice) & 0xff; // 0xff is from FFmpeg
                    if (littleEndian) {
                        if (track.info.codec === 'pcm-s16be') track.info.codec = 'pcm-s16';
                        else if (track.info.codec === 'pcm-s24be') track.info.codec = 'pcm-s24';
                        else if (track.info.codec === 'pcm-s32be') track.info.codec = 'pcm-s32';
                        else if (track.info.codec === 'pcm-f32be') track.info.codec = 'pcm-f32';
                        else if (track.info.codec === 'pcm-f64be') track.info.codec = 'pcm-f64';
                    }
                }
                break;
            case 'pcmC':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info?.type === 'audio');
                    slice.skip(4); // Version + flags
                    // ISO/IEC 23003-5
                    const formatFlags = (0, _readerJs.readU8)(slice);
                    const isLittleEndian = Boolean(formatFlags & 0x01);
                    const pcmSampleSize = (0, _readerJs.readU8)(slice);
                    if (track.info.codec === 'pcm-s16be') {
                        // ipcm
                        if (isLittleEndian) {
                            if (pcmSampleSize === 16) track.info.codec = 'pcm-s16';
                            else if (pcmSampleSize === 24) track.info.codec = 'pcm-s24';
                            else if (pcmSampleSize === 32) track.info.codec = 'pcm-s32';
                            else {
                                console.warn(`Invalid ipcm sample size ${pcmSampleSize}.`);
                                track.info.codec = null;
                            }
                        } else {
                            if (pcmSampleSize === 16) track.info.codec = 'pcm-s16be';
                            else if (pcmSampleSize === 24) track.info.codec = 'pcm-s24be';
                            else if (pcmSampleSize === 32) track.info.codec = 'pcm-s32be';
                            else {
                                console.warn(`Invalid ipcm sample size ${pcmSampleSize}.`);
                                track.info.codec = null;
                            }
                        }
                    } else if (track.info.codec === 'pcm-f32be') {
                        // fpcm
                        if (isLittleEndian) {
                            if (pcmSampleSize === 32) track.info.codec = 'pcm-f32';
                            else if (pcmSampleSize === 64) track.info.codec = 'pcm-f64';
                            else {
                                console.warn(`Invalid fpcm sample size ${pcmSampleSize}.`);
                                track.info.codec = null;
                            }
                        } else {
                            if (pcmSampleSize === 32) track.info.codec = 'pcm-f32be';
                            else if (pcmSampleSize === 64) track.info.codec = 'pcm-f64be';
                            else {
                                console.warn(`Invalid fpcm sample size ${pcmSampleSize}.`);
                                track.info.codec = null;
                            }
                        }
                    }
                    break;
                }
            case 'dOps':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info?.type === 'audio');
                    slice.skip(1); // Version
                    // https://www.opus-codec.org/docs/opus_in_isobmff.html
                    const outputChannelCount = (0, _readerJs.readU8)(slice);
                    const preSkip = (0, _readerJs.readU16Be)(slice);
                    const inputSampleRate = (0, _readerJs.readU32Be)(slice);
                    const outputGain = (0, _readerJs.readI16Be)(slice);
                    const channelMappingFamily = (0, _readerJs.readU8)(slice);
                    let channelMappingTable;
                    if (channelMappingFamily !== 0) channelMappingTable = (0, _readerJs.readBytes)(slice, 2 + outputChannelCount);
                    else channelMappingTable = new Uint8Array(0);
                    // https://datatracker.ietf.org/doc/html/draft-ietf-codec-oggopus-06
                    const description = new Uint8Array(19 + channelMappingTable.byteLength);
                    const view = new DataView(description.buffer);
                    view.setUint32(0, 0x4f707573, false); // 'Opus'
                    view.setUint32(4, 0x48656164, false); // 'Head'
                    view.setUint8(8, 1); // Version
                    view.setUint8(9, outputChannelCount);
                    view.setUint16(10, preSkip, true);
                    view.setUint32(12, inputSampleRate, true);
                    view.setInt16(16, outputGain, true);
                    view.setUint8(18, channelMappingFamily);
                    description.set(channelMappingTable, 19);
                    track.info.codecDescription = description;
                    track.info.numberOfChannels = outputChannelCount;
                // Don't copy the input sample rate, irrelevant, and output sample rate is fixed
                }
                break;
            case 'dfLa':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.info?.type === 'audio');
                    slice.skip(4); // Version + flags
                    // https://datatracker.ietf.org/doc/rfc9639/
                    const BLOCK_TYPE_MASK = 0x7f;
                    const LAST_METADATA_BLOCK_FLAG_MASK = 0x80;
                    const startPos = slice.filePos;
                    while(slice.filePos < boxEndPos){
                        const flagAndType = (0, _readerJs.readU8)(slice);
                        const metadataBlockLength = (0, _readerJs.readU24Be)(slice);
                        const type = flagAndType & BLOCK_TYPE_MASK;
                        // It's a STREAMINFO block; let's extract the actual sample rate and channel count
                        if (type === (0, _codecDataJs.FlacBlockType).STREAMINFO) {
                            slice.skip(10);
                            // Extract sample rate and channel count
                            const word = (0, _readerJs.readU32Be)(slice);
                            const sampleRate = word >>> 12;
                            const numberOfChannels = (word >> 9 & 7) + 1;
                            track.info.sampleRate = sampleRate;
                            track.info.numberOfChannels = numberOfChannels;
                            slice.skip(20);
                        } else // Simply skip ahead to the next block
                        slice.skip(metadataBlockLength);
                        if (flagAndType & LAST_METADATA_BLOCK_FLAG_MASK) break;
                    }
                    const endPos = slice.filePos;
                    slice.filePos = startPos;
                    const bytes = (0, _readerJs.readBytes)(slice, endPos - startPos);
                    const description = new Uint8Array(4 + bytes.byteLength);
                    const view = new DataView(description.buffer);
                    view.setUint32(0, 0x664c6143, false); // 'fLaC'
                    description.set(bytes, 4);
                    // Set the codec description to be 'fLaC' + all metadata blocks
                    track.info.codecDescription = description;
                }
                break;
            case 'stts':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    if (!track.sampleTable) break;
                    slice.skip(4); // Version + flags
                    const entryCount = (0, _readerJs.readU32Be)(slice);
                    let currentIndex = 0;
                    let currentTimestamp = 0;
                    for(let i = 0; i < entryCount; i++){
                        const sampleCount = (0, _readerJs.readU32Be)(slice);
                        const sampleDelta = (0, _readerJs.readU32Be)(slice);
                        track.sampleTable.sampleTimingEntries.push({
                            startIndex: currentIndex,
                            startDecodeTimestamp: currentTimestamp,
                            count: sampleCount,
                            delta: sampleDelta
                        });
                        currentIndex += sampleCount;
                        currentTimestamp += sampleCount * sampleDelta;
                    }
                }
                break;
            case 'ctts':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    if (!track.sampleTable) break;
                    slice.skip(4); // Version + flags
                    const entryCount = (0, _readerJs.readU32Be)(slice);
                    let sampleIndex = 0;
                    for(let i = 0; i < entryCount; i++){
                        const sampleCount = (0, _readerJs.readU32Be)(slice);
                        const sampleOffset = (0, _readerJs.readI32Be)(slice);
                        track.sampleTable.sampleCompositionTimeOffsets.push({
                            startIndex: sampleIndex,
                            count: sampleCount,
                            offset: sampleOffset
                        });
                        sampleIndex += sampleCount;
                    }
                }
                break;
            case 'stsz':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    if (!track.sampleTable) break;
                    slice.skip(4); // Version + flags
                    const sampleSize = (0, _readerJs.readU32Be)(slice);
                    const sampleCount = (0, _readerJs.readU32Be)(slice);
                    if (sampleSize === 0) for(let i = 0; i < sampleCount; i++){
                        const sampleSize = (0, _readerJs.readU32Be)(slice);
                        track.sampleTable.sampleSizes.push(sampleSize);
                    }
                    else track.sampleTable.sampleSizes.push(sampleSize);
                }
                break;
            case 'stz2':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    if (!track.sampleTable) break;
                    slice.skip(4); // Version + flags
                    slice.skip(3); // Reserved
                    const fieldSize = (0, _readerJs.readU8)(slice); // in bits
                    const sampleCount = (0, _readerJs.readU32Be)(slice);
                    const bytes = (0, _readerJs.readBytes)(slice, Math.ceil(sampleCount * fieldSize / 8));
                    const bitstream = new (0, _miscJs.Bitstream)(bytes);
                    for(let i = 0; i < sampleCount; i++){
                        const sampleSize = bitstream.readBits(fieldSize);
                        track.sampleTable.sampleSizes.push(sampleSize);
                    }
                }
                break;
            case 'stss':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    if (!track.sampleTable) break;
                    slice.skip(4); // Version + flags
                    track.sampleTable.keySampleIndices = [];
                    const entryCount = (0, _readerJs.readU32Be)(slice);
                    for(let i = 0; i < entryCount; i++){
                        const sampleIndex = (0, _readerJs.readU32Be)(slice) - 1; // Convert to 0-indexed
                        track.sampleTable.keySampleIndices.push(sampleIndex);
                    }
                    if (track.sampleTable.keySampleIndices[0] !== 0) // Some files don't mark the first sample a key sample, which is basically almost always incorrect.
                    // Here, we correct for that mistake:
                    track.sampleTable.keySampleIndices.unshift(0);
                }
                break;
            case 'stsc':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    if (!track.sampleTable) break;
                    slice.skip(4);
                    const entryCount = (0, _readerJs.readU32Be)(slice);
                    for(let i = 0; i < entryCount; i++){
                        const startChunkIndex = (0, _readerJs.readU32Be)(slice) - 1; // Convert to 0-indexed
                        const samplesPerChunk = (0, _readerJs.readU32Be)(slice);
                        const sampleDescriptionIndex = (0, _readerJs.readU32Be)(slice);
                        track.sampleTable.sampleToChunk.push({
                            startSampleIndex: -1,
                            startChunkIndex,
                            samplesPerChunk,
                            sampleDescriptionIndex
                        });
                    }
                    let startSampleIndex = 0;
                    for(let i = 0; i < track.sampleTable.sampleToChunk.length; i++){
                        track.sampleTable.sampleToChunk[i].startSampleIndex = startSampleIndex;
                        if (i < track.sampleTable.sampleToChunk.length - 1) {
                            const nextChunk = track.sampleTable.sampleToChunk[i + 1];
                            const chunkCount = nextChunk.startChunkIndex - track.sampleTable.sampleToChunk[i].startChunkIndex;
                            startSampleIndex += chunkCount * track.sampleTable.sampleToChunk[i].samplesPerChunk;
                        }
                    }
                }
                break;
            case 'stco':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    if (!track.sampleTable) break;
                    slice.skip(4); // Version + flags
                    const entryCount = (0, _readerJs.readU32Be)(slice);
                    for(let i = 0; i < entryCount; i++){
                        const chunkOffset = (0, _readerJs.readU32Be)(slice);
                        track.sampleTable.chunkOffsets.push(chunkOffset);
                    }
                }
                break;
            case 'co64':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    if (!track.sampleTable) break;
                    slice.skip(4); // Version + flags
                    const entryCount = (0, _readerJs.readU32Be)(slice);
                    for(let i = 0; i < entryCount; i++){
                        const chunkOffset = (0, _readerJs.readU64Be)(slice);
                        track.sampleTable.chunkOffsets.push(chunkOffset);
                    }
                }
                break;
            case 'mvex':
                this.isFragmented = true;
                this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                break;
            case 'mehd':
                {
                    const version = (0, _readerJs.readU8)(slice);
                    slice.skip(3); // Flags
                    const fragmentDuration = version === 1 ? (0, _readerJs.readU64Be)(slice) : (0, _readerJs.readU32Be)(slice);
                    this.movieDurationInTimescale = fragmentDuration;
                }
                break;
            case 'trex':
                {
                    slice.skip(4); // Version + flags
                    const trackId = (0, _readerJs.readU32Be)(slice);
                    const defaultSampleDescriptionIndex = (0, _readerJs.readU32Be)(slice);
                    const defaultSampleDuration = (0, _readerJs.readU32Be)(slice);
                    const defaultSampleSize = (0, _readerJs.readU32Be)(slice);
                    const defaultSampleFlags = (0, _readerJs.readU32Be)(slice);
                    // We store these separately rather than in the tracks since the tracks may not exist yet
                    this.fragmentTrackDefaults.push({
                        trackId,
                        defaultSampleDescriptionIndex,
                        defaultSampleDuration,
                        defaultSampleSize,
                        defaultSampleFlags
                    });
                }
                break;
            case 'tfra':
                {
                    const version = (0, _readerJs.readU8)(slice);
                    slice.skip(3); // Flags
                    const trackId = (0, _readerJs.readU32Be)(slice);
                    const track = this.tracks.find((x)=>x.id === trackId);
                    if (!track) break;
                    const word = (0, _readerJs.readU32Be)(slice);
                    const lengthSizeOfTrafNum = (word & 48) >> 4;
                    const lengthSizeOfTrunNum = (word & 12) >> 2;
                    const lengthSizeOfSampleNum = word & 3;
                    const functions = [
                        (0, _readerJs.readU8),
                        (0, _readerJs.readU16Be),
                        (0, _readerJs.readU24Be),
                        (0, _readerJs.readU32Be)
                    ];
                    const readTrafNum = functions[lengthSizeOfTrafNum];
                    const readTrunNum = functions[lengthSizeOfTrunNum];
                    const readSampleNum = functions[lengthSizeOfSampleNum];
                    const numberOfEntries = (0, _readerJs.readU32Be)(slice);
                    for(let i = 0; i < numberOfEntries; i++){
                        const time = version === 1 ? (0, _readerJs.readU64Be)(slice) : (0, _readerJs.readU32Be)(slice);
                        const moofOffset = version === 1 ? (0, _readerJs.readU64Be)(slice) : (0, _readerJs.readU32Be)(slice);
                        readTrafNum(slice);
                        readTrunNum(slice);
                        readSampleNum(slice);
                        track.fragmentLookupTable.push({
                            timestamp: time,
                            moofOffset
                        });
                    }
                    // Sort by timestamp in case it's not naturally sorted
                    track.fragmentLookupTable.sort((a, b)=>a.timestamp - b.timestamp);
                    // Remove multiple entries for the same time
                    for(let i = 0; i < track.fragmentLookupTable.length - 1; i++){
                        const entry1 = track.fragmentLookupTable[i];
                        const entry2 = track.fragmentLookupTable[i + 1];
                        if (entry1.timestamp === entry2.timestamp) {
                            track.fragmentLookupTable.splice(i + 1, 1);
                            i--;
                        }
                    }
                }
                break;
            case 'moof':
                this.currentFragment = {
                    moofOffset: startPos,
                    moofSize: boxInfo.totalSize,
                    implicitBaseDataOffset: startPos,
                    trackData: new Map()
                };
                this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                this.lastReadFragment = this.currentFragment;
                this.currentFragment = null;
                break;
            case 'traf':
                (0, _miscJs.assert)(this.currentFragment);
                this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                // It is possible that there is no current track, for example when we don't care about the track
                // referenced in the track fragment header.
                if (this.currentTrack) {
                    const trackData = this.currentFragment.trackData.get(this.currentTrack.id);
                    if (trackData) {
                        const { currentFragmentState } = this.currentTrack;
                        (0, _miscJs.assert)(currentFragmentState);
                        if (currentFragmentState.startTimestamp !== null) {
                            offsetFragmentTrackDataByTimestamp(trackData, currentFragmentState.startTimestamp);
                            trackData.startTimestampIsFinal = true;
                        }
                    }
                    this.currentTrack.currentFragmentState = null;
                    this.currentTrack = null;
                }
                break;
            case 'tfhd':
                {
                    (0, _miscJs.assert)(this.currentFragment);
                    slice.skip(1); // Version
                    const flags = (0, _readerJs.readU24Be)(slice);
                    const baseDataOffsetPresent = Boolean(flags & 0x000001);
                    const sampleDescriptionIndexPresent = Boolean(flags & 0x000002);
                    const defaultSampleDurationPresent = Boolean(flags & 0x000008);
                    const defaultSampleSizePresent = Boolean(flags & 0x000010);
                    const defaultSampleFlagsPresent = Boolean(flags & 0x000020);
                    const durationIsEmpty = Boolean(flags & 0x010000);
                    const defaultBaseIsMoof = Boolean(flags & 0x020000);
                    const trackId = (0, _readerJs.readU32Be)(slice);
                    const track = this.tracks.find((x)=>x.id === trackId);
                    if (!track) break;
                    const defaults = this.fragmentTrackDefaults.find((x)=>x.trackId === trackId);
                    this.currentTrack = track;
                    track.currentFragmentState = {
                        baseDataOffset: this.currentFragment.implicitBaseDataOffset,
                        sampleDescriptionIndex: defaults?.defaultSampleDescriptionIndex ?? null,
                        defaultSampleDuration: defaults?.defaultSampleDuration ?? null,
                        defaultSampleSize: defaults?.defaultSampleSize ?? null,
                        defaultSampleFlags: defaults?.defaultSampleFlags ?? null,
                        startTimestamp: null
                    };
                    if (baseDataOffsetPresent) track.currentFragmentState.baseDataOffset = (0, _readerJs.readU64Be)(slice);
                    else if (defaultBaseIsMoof) track.currentFragmentState.baseDataOffset = this.currentFragment.moofOffset;
                    if (sampleDescriptionIndexPresent) track.currentFragmentState.sampleDescriptionIndex = (0, _readerJs.readU32Be)(slice);
                    if (defaultSampleDurationPresent) track.currentFragmentState.defaultSampleDuration = (0, _readerJs.readU32Be)(slice);
                    if (defaultSampleSizePresent) track.currentFragmentState.defaultSampleSize = (0, _readerJs.readU32Be)(slice);
                    if (defaultSampleFlagsPresent) track.currentFragmentState.defaultSampleFlags = (0, _readerJs.readU32Be)(slice);
                    if (durationIsEmpty) track.currentFragmentState.defaultSampleDuration = 0;
                }
                break;
            case 'tfdt':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(track.currentFragmentState);
                    const version = (0, _readerJs.readU8)(slice);
                    slice.skip(3); // Flags
                    const baseMediaDecodeTime = version === 0 ? (0, _readerJs.readU32Be)(slice) : (0, _readerJs.readU64Be)(slice);
                    track.currentFragmentState.startTimestamp = baseMediaDecodeTime;
                }
                break;
            case 'trun':
                {
                    const track = this.currentTrack;
                    if (!track) break;
                    (0, _miscJs.assert)(this.currentFragment);
                    (0, _miscJs.assert)(track.currentFragmentState);
                    if (this.currentFragment.trackData.has(track.id)) {
                        console.warn('Can\'t have two trun boxes for the same track in one fragment. Ignoring...');
                        break;
                    }
                    const version = (0, _readerJs.readU8)(slice);
                    const flags = (0, _readerJs.readU24Be)(slice);
                    const dataOffsetPresent = Boolean(flags & 0x000001);
                    const firstSampleFlagsPresent = Boolean(flags & 0x000004);
                    const sampleDurationPresent = Boolean(flags & 0x000100);
                    const sampleSizePresent = Boolean(flags & 0x000200);
                    const sampleFlagsPresent = Boolean(flags & 0x000400);
                    const sampleCompositionTimeOffsetsPresent = Boolean(flags & 0x000800);
                    const sampleCount = (0, _readerJs.readU32Be)(slice);
                    let dataOffset = track.currentFragmentState.baseDataOffset;
                    if (dataOffsetPresent) dataOffset += (0, _readerJs.readI32Be)(slice);
                    let firstSampleFlags = null;
                    if (firstSampleFlagsPresent) firstSampleFlags = (0, _readerJs.readU32Be)(slice);
                    let currentOffset = dataOffset;
                    if (sampleCount === 0) {
                        // Don't associate the fragment with the track if it has no samples, this simplifies other code
                        this.currentFragment.implicitBaseDataOffset = currentOffset;
                        break;
                    }
                    let currentTimestamp = 0;
                    const trackData = {
                        track,
                        startTimestamp: 0,
                        endTimestamp: 0,
                        firstKeyFrameTimestamp: null,
                        samples: [],
                        presentationTimestamps: [],
                        startTimestampIsFinal: false
                    };
                    this.currentFragment.trackData.set(track.id, trackData);
                    for(let i = 0; i < sampleCount; i++){
                        let sampleDuration;
                        if (sampleDurationPresent) sampleDuration = (0, _readerJs.readU32Be)(slice);
                        else {
                            (0, _miscJs.assert)(track.currentFragmentState.defaultSampleDuration !== null);
                            sampleDuration = track.currentFragmentState.defaultSampleDuration;
                        }
                        let sampleSize;
                        if (sampleSizePresent) sampleSize = (0, _readerJs.readU32Be)(slice);
                        else {
                            (0, _miscJs.assert)(track.currentFragmentState.defaultSampleSize !== null);
                            sampleSize = track.currentFragmentState.defaultSampleSize;
                        }
                        let sampleFlags;
                        if (sampleFlagsPresent) sampleFlags = (0, _readerJs.readU32Be)(slice);
                        else {
                            (0, _miscJs.assert)(track.currentFragmentState.defaultSampleFlags !== null);
                            sampleFlags = track.currentFragmentState.defaultSampleFlags;
                        }
                        if (i === 0 && firstSampleFlags !== null) sampleFlags = firstSampleFlags;
                        let sampleCompositionTimeOffset = 0;
                        if (sampleCompositionTimeOffsetsPresent) {
                            if (version === 0) sampleCompositionTimeOffset = (0, _readerJs.readU32Be)(slice);
                            else sampleCompositionTimeOffset = (0, _readerJs.readI32Be)(slice);
                        }
                        const isKeyFrame = !(sampleFlags & 0x00010000);
                        trackData.samples.push({
                            presentationTimestamp: currentTimestamp + sampleCompositionTimeOffset,
                            duration: sampleDuration,
                            byteOffset: currentOffset,
                            byteSize: sampleSize,
                            isKeyFrame
                        });
                        currentOffset += sampleSize;
                        currentTimestamp += sampleDuration;
                    }
                    trackData.presentationTimestamps = trackData.samples.map((x, i)=>({
                            presentationTimestamp: x.presentationTimestamp,
                            sampleIndex: i
                        })).sort((a, b)=>a.presentationTimestamp - b.presentationTimestamp);
                    for(let i = 0; i < trackData.presentationTimestamps.length; i++){
                        const currentEntry = trackData.presentationTimestamps[i];
                        const currentSample = trackData.samples[currentEntry.sampleIndex];
                        if (trackData.firstKeyFrameTimestamp === null && currentSample.isKeyFrame) trackData.firstKeyFrameTimestamp = currentSample.presentationTimestamp;
                        if (i < trackData.presentationTimestamps.length - 1) {
                            // Update sample durations based on presentation order
                            const nextEntry = trackData.presentationTimestamps[i + 1];
                            currentSample.duration = nextEntry.presentationTimestamp - currentEntry.presentationTimestamp;
                        }
                    }
                    const firstSample = trackData.samples[trackData.presentationTimestamps[0].sampleIndex];
                    const lastSample = trackData.samples[(0, _miscJs.last)(trackData.presentationTimestamps).sampleIndex];
                    trackData.startTimestamp = firstSample.presentationTimestamp;
                    trackData.endTimestamp = lastSample.presentationTimestamp + lastSample.duration;
                    this.currentFragment.implicitBaseDataOffset = currentOffset;
                }
                break;
            // Metadata section
            // https://exiftool.org/TagNames/QuickTime.html
            // https://mp4workshop.com/about
            case 'udta':
                {
                    const iterator = this.iterateContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                    for (const { boxInfo, slice } of iterator){
                        if (boxInfo.name !== 'meta' && !this.currentTrack) {
                            const startPos = slice.filePos;
                            this.metadataTags.raw ??= {};
                            if (boxInfo.name[0] === "\xa9") // https://mp4workshop.com/about
                            // Box name starting with © indicates "international text"
                            this.metadataTags.raw[boxInfo.name] ??= (0, _isobmffReaderJs.readMetadataStringShort)(slice);
                            else this.metadataTags.raw[boxInfo.name] ??= (0, _readerJs.readBytes)(slice, boxInfo.contentSize);
                            slice.filePos = startPos;
                        }
                        switch(boxInfo.name){
                            case 'meta':
                                slice.skip(-boxInfo.headerSize);
                                this.traverseBox(slice);
                                break;
                            case "\xa9nam":
                            case 'name':
                                if (this.currentTrack) this.currentTrack.name = (0, _miscJs.textDecoder).decode((0, _readerJs.readBytes)(slice, boxInfo.contentSize));
                                else this.metadataTags.title ??= (0, _isobmffReaderJs.readMetadataStringShort)(slice);
                                break;
                            case "\xa9des":
                                if (!this.currentTrack) this.metadataTags.description ??= (0, _isobmffReaderJs.readMetadataStringShort)(slice);
                                break;
                            case "\xa9ART":
                                if (!this.currentTrack) this.metadataTags.artist ??= (0, _isobmffReaderJs.readMetadataStringShort)(slice);
                                break;
                            case "\xa9alb":
                                if (!this.currentTrack) this.metadataTags.album ??= (0, _isobmffReaderJs.readMetadataStringShort)(slice);
                                break;
                            case 'albr':
                                if (!this.currentTrack) this.metadataTags.albumArtist ??= (0, _isobmffReaderJs.readMetadataStringShort)(slice);
                                break;
                            case "\xa9gen":
                                if (!this.currentTrack) this.metadataTags.genre ??= (0, _isobmffReaderJs.readMetadataStringShort)(slice);
                                break;
                            case "\xa9day":
                                if (!this.currentTrack) {
                                    const date = new Date((0, _isobmffReaderJs.readMetadataStringShort)(slice));
                                    if (!Number.isNaN(date.getTime())) this.metadataTags.date ??= date;
                                }
                                break;
                            case "\xa9cmt":
                                if (!this.currentTrack) this.metadataTags.comment ??= (0, _isobmffReaderJs.readMetadataStringShort)(slice);
                                break;
                            case "\xa9lyr":
                                if (!this.currentTrack) this.metadataTags.lyrics ??= (0, _isobmffReaderJs.readMetadataStringShort)(slice);
                                break;
                        }
                    }
                }
                break;
            case 'meta':
                {
                    if (this.currentTrack) break; // Only care about movie-level metadata for now
                    // The 'meta' box comes in two flavors, one with flags/version and one without. To know which is which,
                    // let's read the next 4 bytes, which are either the version or the size of the first subbox.
                    const word = (0, _readerJs.readU32Be)(slice);
                    const isQuickTime = word !== 0;
                    this.currentMetadataKeys = new Map();
                    if (isQuickTime) this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                    else this.readContiguousBoxes(slice.slice(contentStartPos + 4, boxInfo.contentSize - 4));
                    this.currentMetadataKeys = null;
                }
                break;
            case 'keys':
                {
                    if (!this.currentMetadataKeys) break;
                    slice.skip(4); // Version + flags
                    const entryCount = (0, _readerJs.readU32Be)(slice);
                    for(let i = 0; i < entryCount; i++){
                        const keySize = (0, _readerJs.readU32Be)(slice);
                        slice.skip(4); // Key namespace
                        const keyName = (0, _miscJs.textDecoder).decode((0, _readerJs.readBytes)(slice, keySize - 8));
                        this.currentMetadataKeys.set(i + 1, keyName);
                    }
                }
                break;
            case 'ilst':
                {
                    if (!this.currentMetadataKeys) break;
                    const iterator = this.iterateContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
                    for (const { boxInfo, slice } of iterator){
                        let metadataKey = boxInfo.name;
                        // Interpret the box name as a u32be
                        const nameAsNumber = (metadataKey.charCodeAt(0) << 24) + (metadataKey.charCodeAt(1) << 16) + (metadataKey.charCodeAt(2) << 8) + metadataKey.charCodeAt(3);
                        if (this.currentMetadataKeys.has(nameAsNumber)) // An entry exists for this number
                        metadataKey = this.currentMetadataKeys.get(nameAsNumber);
                        const data = (0, _isobmffReaderJs.readDataBox)(slice);
                        this.metadataTags.raw ??= {};
                        this.metadataTags.raw[metadataKey] ??= data;
                        switch(metadataKey){
                            case "\xa9nam":
                            case 'titl':
                            case 'com.apple.quicktime.title':
                            case 'title':
                                if (typeof data === 'string') this.metadataTags.title ??= data;
                                break;
                            case "\xa9des":
                            case 'desc':
                            case 'dscp':
                            case 'com.apple.quicktime.description':
                            case 'description':
                                if (typeof data === 'string') this.metadataTags.description ??= data;
                                break;
                            case "\xa9ART":
                            case 'com.apple.quicktime.artist':
                            case 'artist':
                                if (typeof data === 'string') this.metadataTags.artist ??= data;
                                break;
                            case "\xa9alb":
                            case 'albm':
                            case 'com.apple.quicktime.album':
                            case 'album':
                                if (typeof data === 'string') this.metadataTags.album ??= data;
                                break;
                            case 'aART':
                            case 'album_artist':
                                if (typeof data === 'string') this.metadataTags.albumArtist ??= data;
                                break;
                            case "\xa9cmt":
                            case 'com.apple.quicktime.comment':
                            case 'comment':
                                if (typeof data === 'string') this.metadataTags.comment ??= data;
                                break;
                            case "\xa9gen":
                            case 'gnre':
                            case 'com.apple.quicktime.genre':
                            case 'genre':
                                if (typeof data === 'string') this.metadataTags.genre ??= data;
                                break;
                            case "\xa9lyr":
                            case 'lyrics':
                                if (typeof data === 'string') this.metadataTags.lyrics ??= data;
                                break;
                            case "\xa9day":
                            case 'rldt':
                            case 'com.apple.quicktime.creationdate':
                            case 'date':
                                if (typeof data === 'string') {
                                    const date = new Date(data);
                                    if (!Number.isNaN(date.getTime())) this.metadataTags.date ??= date;
                                }
                                break;
                            case 'covr':
                            case 'com.apple.quicktime.artwork':
                                if (data instanceof (0, _metadataJs.RichImageData)) {
                                    this.metadataTags.images ??= [];
                                    this.metadataTags.images.push({
                                        data: data.data,
                                        kind: 'coverFront',
                                        mimeType: data.mimeType
                                    });
                                } else if (data instanceof Uint8Array) {
                                    this.metadataTags.images ??= [];
                                    this.metadataTags.images.push({
                                        data,
                                        kind: 'coverFront',
                                        mimeType: 'image/*'
                                    });
                                }
                                break;
                            case 'track':
                                if (typeof data === 'string') {
                                    const parts = data.split('/');
                                    const trackNum = Number.parseInt(parts[0], 10);
                                    const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                                    if (Number.isInteger(trackNum) && trackNum > 0) this.metadataTags.trackNumber ??= trackNum;
                                    if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) this.metadataTags.tracksTotal ??= tracksTotal;
                                }
                                break;
                            case 'trkn':
                                if (data instanceof Uint8Array && data.length >= 6) {
                                    const view = (0, _miscJs.toDataView)(data);
                                    const trackNumber = view.getUint16(2, false);
                                    const tracksTotal = view.getUint16(4, false);
                                    if (trackNumber > 0) this.metadataTags.trackNumber ??= trackNumber;
                                    if (tracksTotal > 0) this.metadataTags.tracksTotal ??= tracksTotal;
                                }
                                break;
                            case 'disc':
                            case 'disk':
                                if (data instanceof Uint8Array && data.length >= 6) {
                                    const view = (0, _miscJs.toDataView)(data);
                                    const discNumber = view.getUint16(2, false);
                                    const discNumberMax = view.getUint16(4, false);
                                    if (discNumber > 0) this.metadataTags.discNumber ??= discNumber;
                                    if (discNumberMax > 0) this.metadataTags.discsTotal ??= discNumberMax;
                                }
                                break;
                        }
                    }
                }
                break;
        }
        slice.filePos = boxEndPos;
        return true;
    }
}
class IsobmffTrackBacking {
    constructor(internalTrack){
        this.internalTrack = internalTrack;
        this.packetToSampleIndex = new WeakMap();
        this.packetToFragmentLocation = new WeakMap();
    }
    getId() {
        return this.internalTrack.id;
    }
    getCodec() {
        throw new Error('Not implemented on base class.');
    }
    getInternalCodecId() {
        return this.internalTrack.internalCodecId;
    }
    getName() {
        return this.internalTrack.name;
    }
    getLanguageCode() {
        return this.internalTrack.languageCode;
    }
    getTimeResolution() {
        return this.internalTrack.timescale;
    }
    getDisposition() {
        return this.internalTrack.disposition;
    }
    async computeDuration() {
        const lastPacket = await this.getPacket(Infinity, {
            metadataOnly: true
        });
        return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
    }
    async getFirstTimestamp() {
        const firstPacket = await this.getFirstPacket({
            metadataOnly: true
        });
        return firstPacket?.timestamp ?? 0;
    }
    async getFirstPacket(options) {
        const regularPacket = await this.fetchPacketForSampleIndex(0, options);
        if (regularPacket || !this.internalTrack.demuxer.isFragmented) // If there's a non-fragmented packet, always prefer that
        return regularPacket;
        return this.performFragmentedLookup(null, (fragment)=>{
            const trackData = fragment.trackData.get(this.internalTrack.id);
            if (trackData) return {
                sampleIndex: 0,
                correctSampleFound: true
            };
            return {
                sampleIndex: -1,
                correctSampleFound: false
            };
        }, -Infinity, Infinity, options);
    }
    mapTimestampIntoTimescale(timestamp) {
        // Do a little rounding to catch cases where the result is very close to an integer. If it is, it's likely
        // that the number was originally an integer divided by the timescale. For stability, it's best
        // to return the integer in this case.
        return (0, _miscJs.roundIfAlmostInteger)(timestamp * this.internalTrack.timescale) + this.internalTrack.editListOffset;
    }
    async getPacket(timestamp, options) {
        const timestampInTimescale = this.mapTimestampIntoTimescale(timestamp);
        const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack);
        const sampleIndex = getSampleIndexForTimestamp(sampleTable, timestampInTimescale);
        const regularPacket = await this.fetchPacketForSampleIndex(sampleIndex, options);
        if (!sampleTableIsEmpty(sampleTable) || !this.internalTrack.demuxer.isFragmented) // Prefer the non-fragmented packet
        return regularPacket;
        return this.performFragmentedLookup(null, (fragment)=>{
            const trackData = fragment.trackData.get(this.internalTrack.id);
            if (!trackData) return {
                sampleIndex: -1,
                correctSampleFound: false
            };
            const index = (0, _miscJs.binarySearchLessOrEqual)(trackData.presentationTimestamps, timestampInTimescale, (x)=>x.presentationTimestamp);
            const sampleIndex = index !== -1 ? trackData.presentationTimestamps[index].sampleIndex : -1;
            const correctSampleFound = index !== -1 && timestampInTimescale < trackData.endTimestamp;
            return {
                sampleIndex,
                correctSampleFound
            };
        }, timestampInTimescale, timestampInTimescale, options);
    }
    async getNextPacket(packet, options) {
        const regularSampleIndex = this.packetToSampleIndex.get(packet);
        if (regularSampleIndex !== undefined) // Prefer the non-fragmented packet
        return this.fetchPacketForSampleIndex(regularSampleIndex + 1, options);
        const locationInFragment = this.packetToFragmentLocation.get(packet);
        if (locationInFragment === undefined) throw new Error('Packet was not created from this track.');
        return this.performFragmentedLookup(locationInFragment.fragment, (fragment)=>{
            if (fragment === locationInFragment.fragment) {
                const trackData = fragment.trackData.get(this.internalTrack.id);
                if (locationInFragment.sampleIndex + 1 < trackData.samples.length) // We can simply take the next sample in the fragment
                return {
                    sampleIndex: locationInFragment.sampleIndex + 1,
                    correctSampleFound: true
                };
            } else {
                const trackData = fragment.trackData.get(this.internalTrack.id);
                if (trackData) return {
                    sampleIndex: 0,
                    correctSampleFound: true
                };
            }
            return {
                sampleIndex: -1,
                correctSampleFound: false
            };
        }, -Infinity, Infinity, options);
    }
    async getKeyPacket(timestamp, options) {
        const timestampInTimescale = this.mapTimestampIntoTimescale(timestamp);
        const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack);
        const sampleIndex = getKeyframeSampleIndexForTimestamp(sampleTable, timestampInTimescale);
        const regularPacket = await this.fetchPacketForSampleIndex(sampleIndex, options);
        if (!sampleTableIsEmpty(sampleTable) || !this.internalTrack.demuxer.isFragmented) // Prefer the non-fragmented packet
        return regularPacket;
        return this.performFragmentedLookup(null, (fragment)=>{
            const trackData = fragment.trackData.get(this.internalTrack.id);
            if (!trackData) return {
                sampleIndex: -1,
                correctSampleFound: false
            };
            const index = (0, _miscJs.findLastIndex)(trackData.presentationTimestamps, (x)=>{
                const sample = trackData.samples[x.sampleIndex];
                return sample.isKeyFrame && x.presentationTimestamp <= timestampInTimescale;
            });
            const sampleIndex = index !== -1 ? trackData.presentationTimestamps[index].sampleIndex : -1;
            const correctSampleFound = index !== -1 && timestampInTimescale < trackData.endTimestamp;
            return {
                sampleIndex,
                correctSampleFound
            };
        }, timestampInTimescale, timestampInTimescale, options);
    }
    async getNextKeyPacket(packet, options) {
        const regularSampleIndex = this.packetToSampleIndex.get(packet);
        if (regularSampleIndex !== undefined) {
            // Prefer the non-fragmented packet
            const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack);
            const nextKeyFrameSampleIndex = getNextKeyframeIndexForSample(sampleTable, regularSampleIndex);
            return this.fetchPacketForSampleIndex(nextKeyFrameSampleIndex, options);
        }
        const locationInFragment = this.packetToFragmentLocation.get(packet);
        if (locationInFragment === undefined) throw new Error('Packet was not created from this track.');
        return this.performFragmentedLookup(locationInFragment.fragment, (fragment)=>{
            if (fragment === locationInFragment.fragment) {
                const trackData = fragment.trackData.get(this.internalTrack.id);
                const nextKeyFrameIndex = trackData.samples.findIndex((x, i)=>x.isKeyFrame && i > locationInFragment.sampleIndex);
                if (nextKeyFrameIndex !== -1) // We can simply take the next key frame in the fragment
                return {
                    sampleIndex: nextKeyFrameIndex,
                    correctSampleFound: true
                };
            } else {
                const trackData = fragment.trackData.get(this.internalTrack.id);
                if (trackData && trackData.firstKeyFrameTimestamp !== null) {
                    const keyFrameIndex = trackData.samples.findIndex((x)=>x.isKeyFrame);
                    (0, _miscJs.assert)(keyFrameIndex !== -1); // There must be one
                    return {
                        sampleIndex: keyFrameIndex,
                        correctSampleFound: true
                    };
                }
            }
            return {
                sampleIndex: -1,
                correctSampleFound: false
            };
        }, -Infinity, Infinity, options);
    }
    async fetchPacketForSampleIndex(sampleIndex, options) {
        if (sampleIndex === -1) return null;
        const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack);
        const sampleInfo = getSampleInfo(sampleTable, sampleIndex);
        if (!sampleInfo) return null;
        let data;
        if (options.metadataOnly) data = (0, _packetJs.PLACEHOLDER_DATA);
        else {
            let slice = this.internalTrack.demuxer.reader.requestSlice(sampleInfo.sampleOffset, sampleInfo.sampleSize);
            if (slice instanceof Promise) slice = await slice;
            (0, _miscJs.assert)(slice);
            data = (0, _readerJs.readBytes)(slice, sampleInfo.sampleSize);
        }
        const timestamp = (sampleInfo.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale;
        const duration = sampleInfo.duration / this.internalTrack.timescale;
        const packet = new (0, _packetJs.EncodedPacket)(data, sampleInfo.isKeyFrame ? 'key' : 'delta', timestamp, duration, sampleIndex, sampleInfo.sampleSize);
        this.packetToSampleIndex.set(packet, sampleIndex);
        return packet;
    }
    async fetchPacketInFragment(fragment, sampleIndex, options) {
        if (sampleIndex === -1) return null;
        const trackData = fragment.trackData.get(this.internalTrack.id);
        const fragmentSample = trackData.samples[sampleIndex];
        (0, _miscJs.assert)(fragmentSample);
        let data;
        if (options.metadataOnly) data = (0, _packetJs.PLACEHOLDER_DATA);
        else {
            let slice = this.internalTrack.demuxer.reader.requestSlice(fragmentSample.byteOffset, fragmentSample.byteSize);
            if (slice instanceof Promise) slice = await slice;
            (0, _miscJs.assert)(slice);
            data = (0, _readerJs.readBytes)(slice, fragmentSample.byteSize);
        }
        const timestamp = (fragmentSample.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale;
        const duration = fragmentSample.duration / this.internalTrack.timescale;
        const packet = new (0, _packetJs.EncodedPacket)(data, fragmentSample.isKeyFrame ? 'key' : 'delta', timestamp, duration, fragment.moofOffset + sampleIndex, fragmentSample.byteSize);
        this.packetToFragmentLocation.set(packet, {
            fragment,
            sampleIndex
        });
        return packet;
    }
    /** Looks for a packet in the fragments while trying to load as few fragments as possible to retrieve it. */ async performFragmentedLookup(// The fragment where we start looking
    startFragment, // This function returns the best-matching sample in a given fragment
    getMatchInFragment, // The timestamp with which we can search the lookup table
    searchTimestamp, // The timestamp for which we know the correct sample will not come after it
    latestTimestamp, options) {
        const demuxer = this.internalTrack.demuxer;
        let currentFragment = null;
        let bestFragment = null;
        let bestSampleIndex = -1;
        if (startFragment) {
            const { sampleIndex, correctSampleFound } = getMatchInFragment(startFragment);
            if (correctSampleFound) return this.fetchPacketInFragment(startFragment, sampleIndex, options);
            if (sampleIndex !== -1) {
                bestFragment = startFragment;
                bestSampleIndex = sampleIndex;
            }
        }
        // Search for a lookup entry; this way, we won't need to start searching from the start of the file
        // but can jump right into the correct fragment (or at least nearby).
        const lookupEntryIndex = (0, _miscJs.binarySearchLessOrEqual)(this.internalTrack.fragmentLookupTable, searchTimestamp, (x)=>x.timestamp);
        const lookupEntry = lookupEntryIndex !== -1 ? this.internalTrack.fragmentLookupTable[lookupEntryIndex] : null;
        const positionCacheIndex = (0, _miscJs.binarySearchLessOrEqual)(this.internalTrack.fragmentPositionCache, searchTimestamp, (x)=>x.startTimestamp);
        const positionCacheEntry = positionCacheIndex !== -1 ? this.internalTrack.fragmentPositionCache[positionCacheIndex] : null;
        const lookupEntryPosition = Math.max(lookupEntry?.moofOffset ?? 0, positionCacheEntry?.moofOffset ?? 0) || null;
        let currentPos;
        if (!startFragment) currentPos = lookupEntryPosition ?? 0;
        else if (lookupEntryPosition === null || startFragment.moofOffset >= lookupEntryPosition) {
            currentPos = startFragment.moofOffset + startFragment.moofSize;
            currentFragment = startFragment;
        } else // Use the lookup entry
        currentPos = lookupEntryPosition;
        while(true){
            if (currentFragment) {
                const trackData = currentFragment.trackData.get(this.internalTrack.id);
                if (trackData && trackData.startTimestamp > latestTimestamp) break;
            }
            // Load the header
            let slice = demuxer.reader.requestSliceRange(currentPos, (0, _isobmffReaderJs.MIN_BOX_HEADER_SIZE), (0, _isobmffReaderJs.MAX_BOX_HEADER_SIZE));
            if (slice instanceof Promise) slice = await slice;
            if (!slice) break;
            const boxStartPos = currentPos;
            const boxInfo = (0, _isobmffReaderJs.readBoxHeader)(slice);
            if (!boxInfo) break;
            if (boxInfo.name === 'moof') {
                currentFragment = await demuxer.readFragment(boxStartPos);
                const { sampleIndex, correctSampleFound } = getMatchInFragment(currentFragment);
                if (correctSampleFound) return this.fetchPacketInFragment(currentFragment, sampleIndex, options);
                if (sampleIndex !== -1) {
                    bestFragment = currentFragment;
                    bestSampleIndex = sampleIndex;
                }
            }
            currentPos = boxStartPos + boxInfo.totalSize;
        }
        // Catch faulty lookup table entries
        if (lookupEntry && (!bestFragment || bestFragment.moofOffset < lookupEntry.moofOffset)) {
            // The lookup table entry lied to us! We found a lookup entry but no fragment there that satisfied
            // the match. In this case, let's search again but using the lookup entry before that.
            const previousLookupEntry = this.internalTrack.fragmentLookupTable[lookupEntryIndex - 1];
            (0, _miscJs.assert)(!previousLookupEntry || previousLookupEntry.timestamp < lookupEntry.timestamp);
            const newSearchTimestamp = previousLookupEntry?.timestamp ?? -Infinity;
            return this.performFragmentedLookup(null, getMatchInFragment, newSearchTimestamp, latestTimestamp, options);
        }
        if (bestFragment) // If we finished looping but didn't find a perfect match, still return the best match we found
        return this.fetchPacketInFragment(bestFragment, bestSampleIndex, options);
        return null;
    }
}
class IsobmffVideoTrackBacking extends IsobmffTrackBacking {
    constructor(internalTrack){
        super(internalTrack);
        this.decoderConfigPromise = null;
        this.internalTrack = internalTrack;
    }
    getCodec() {
        return this.internalTrack.info.codec;
    }
    getCodedWidth() {
        return this.internalTrack.info.width;
    }
    getCodedHeight() {
        return this.internalTrack.info.height;
    }
    getRotation() {
        return this.internalTrack.rotation;
    }
    async getColorSpace() {
        return {
            primaries: this.internalTrack.info.colorSpace?.primaries,
            transfer: this.internalTrack.info.colorSpace?.transfer,
            matrix: this.internalTrack.info.colorSpace?.matrix,
            fullRange: this.internalTrack.info.colorSpace?.fullRange
        };
    }
    async canBeTransparent() {
        return false;
    }
    async getDecoderConfig() {
        if (!this.internalTrack.info.codec) return null;
        return this.decoderConfigPromise ??= (async ()=>{
            if (this.internalTrack.info.codec === 'vp9' && !this.internalTrack.info.vp9CodecInfo) {
                const firstPacket = await this.getFirstPacket({});
                this.internalTrack.info.vp9CodecInfo = firstPacket && (0, _codecDataJs.extractVp9CodecInfoFromPacket)(firstPacket.data);
            } else if (this.internalTrack.info.codec === 'av1' && !this.internalTrack.info.av1CodecInfo) {
                const firstPacket = await this.getFirstPacket({});
                this.internalTrack.info.av1CodecInfo = firstPacket && (0, _codecDataJs.extractAv1CodecInfoFromPacket)(firstPacket.data);
            }
            return {
                codec: (0, _codecJs.extractVideoCodecString)(this.internalTrack.info),
                codedWidth: this.internalTrack.info.width,
                codedHeight: this.internalTrack.info.height,
                description: this.internalTrack.info.codecDescription ?? undefined,
                colorSpace: this.internalTrack.info.colorSpace ?? undefined
            };
        })();
    }
}
class IsobmffAudioTrackBacking extends IsobmffTrackBacking {
    constructor(internalTrack){
        super(internalTrack);
        this.decoderConfig = null;
        this.internalTrack = internalTrack;
    }
    getCodec() {
        return this.internalTrack.info.codec;
    }
    getNumberOfChannels() {
        return this.internalTrack.info.numberOfChannels;
    }
    getSampleRate() {
        return this.internalTrack.info.sampleRate;
    }
    async getDecoderConfig() {
        if (!this.internalTrack.info.codec) return null;
        return this.decoderConfig ??= {
            codec: (0, _codecJs.extractAudioCodecString)(this.internalTrack.info),
            numberOfChannels: this.internalTrack.info.numberOfChannels,
            sampleRate: this.internalTrack.info.sampleRate,
            description: this.internalTrack.info.codecDescription ?? undefined
        };
    }
}
const getSampleIndexForTimestamp = (sampleTable, timescaleUnits)=>{
    if (sampleTable.presentationTimestamps) {
        const index = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.presentationTimestamps, timescaleUnits, (x)=>x.presentationTimestamp);
        if (index === -1) return -1;
        return sampleTable.presentationTimestamps[index].sampleIndex;
    } else {
        const index = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.sampleTimingEntries, timescaleUnits, (x)=>x.startDecodeTimestamp);
        if (index === -1) return -1;
        const entry = sampleTable.sampleTimingEntries[index];
        return entry.startIndex + Math.min(Math.floor((timescaleUnits - entry.startDecodeTimestamp) / entry.delta), entry.count - 1);
    }
};
const getKeyframeSampleIndexForTimestamp = (sampleTable, timescaleUnits)=>{
    if (!sampleTable.keySampleIndices) // Every sample is a keyframe
    return getSampleIndexForTimestamp(sampleTable, timescaleUnits);
    if (sampleTable.presentationTimestamps) {
        const index = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.presentationTimestamps, timescaleUnits, (x)=>x.presentationTimestamp);
        if (index === -1) return -1;
        // Walk the samples in presentation order until we find one that's a keyframe
        for(let i = index; i >= 0; i--){
            const sampleIndex = sampleTable.presentationTimestamps[i].sampleIndex;
            const isKeyFrame = (0, _miscJs.binarySearchExact)(sampleTable.keySampleIndices, sampleIndex, (x)=>x) !== -1;
            if (isKeyFrame) return sampleIndex;
        }
        return -1;
    } else {
        const sampleIndex = getSampleIndexForTimestamp(sampleTable, timescaleUnits);
        const index = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.keySampleIndices, sampleIndex, (x)=>x);
        return sampleTable.keySampleIndices[index] ?? -1;
    }
};
const getSampleInfo = (sampleTable, sampleIndex)=>{
    const timingEntryIndex = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.sampleTimingEntries, sampleIndex, (x)=>x.startIndex);
    const timingEntry = sampleTable.sampleTimingEntries[timingEntryIndex];
    if (!timingEntry || timingEntry.startIndex + timingEntry.count <= sampleIndex) return null;
    const decodeTimestamp = timingEntry.startDecodeTimestamp + (sampleIndex - timingEntry.startIndex) * timingEntry.delta;
    let presentationTimestamp = decodeTimestamp;
    const offsetEntryIndex = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.sampleCompositionTimeOffsets, sampleIndex, (x)=>x.startIndex);
    const offsetEntry = sampleTable.sampleCompositionTimeOffsets[offsetEntryIndex];
    if (offsetEntry && sampleIndex - offsetEntry.startIndex < offsetEntry.count) presentationTimestamp += offsetEntry.offset;
    const sampleSize = sampleTable.sampleSizes[Math.min(sampleIndex, sampleTable.sampleSizes.length - 1)];
    const chunkEntryIndex = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.sampleToChunk, sampleIndex, (x)=>x.startSampleIndex);
    const chunkEntry = sampleTable.sampleToChunk[chunkEntryIndex];
    (0, _miscJs.assert)(chunkEntry);
    const chunkIndex = chunkEntry.startChunkIndex + Math.floor((sampleIndex - chunkEntry.startSampleIndex) / chunkEntry.samplesPerChunk);
    const chunkOffset = sampleTable.chunkOffsets[chunkIndex];
    const startSampleIndexOfChunk = chunkEntry.startSampleIndex + (chunkIndex - chunkEntry.startChunkIndex) * chunkEntry.samplesPerChunk;
    let chunkSize = 0;
    let sampleOffset = chunkOffset;
    if (sampleTable.sampleSizes.length === 1) {
        sampleOffset += sampleSize * (sampleIndex - startSampleIndexOfChunk);
        chunkSize += sampleSize * chunkEntry.samplesPerChunk;
    } else for(let i = startSampleIndexOfChunk; i < startSampleIndexOfChunk + chunkEntry.samplesPerChunk; i++){
        const sampleSize = sampleTable.sampleSizes[i];
        if (i < sampleIndex) sampleOffset += sampleSize;
        chunkSize += sampleSize;
    }
    let duration = timingEntry.delta;
    if (sampleTable.presentationTimestamps) {
        // In order to accurately compute the duration, we need to take the duration to the next sample in presentation
        // order, not in decode order
        const presentationIndex = sampleTable.presentationTimestampIndexMap[sampleIndex];
        (0, _miscJs.assert)(presentationIndex !== undefined);
        if (presentationIndex < sampleTable.presentationTimestamps.length - 1) {
            const nextEntry = sampleTable.presentationTimestamps[presentationIndex + 1];
            const nextPresentationTimestamp = nextEntry.presentationTimestamp;
            duration = nextPresentationTimestamp - presentationTimestamp;
        }
    }
    return {
        presentationTimestamp,
        duration,
        sampleOffset,
        sampleSize,
        chunkOffset,
        chunkSize,
        isKeyFrame: sampleTable.keySampleIndices ? (0, _miscJs.binarySearchExact)(sampleTable.keySampleIndices, sampleIndex, (x)=>x) !== -1 : true
    };
};
const getNextKeyframeIndexForSample = (sampleTable, sampleIndex)=>{
    if (!sampleTable.keySampleIndices) return sampleIndex + 1;
    const index = (0, _miscJs.binarySearchLessOrEqual)(sampleTable.keySampleIndices, sampleIndex, (x)=>x);
    return sampleTable.keySampleIndices[index + 1] ?? -1;
};
const offsetFragmentTrackDataByTimestamp = (trackData, timestamp)=>{
    trackData.startTimestamp += timestamp;
    trackData.endTimestamp += timestamp;
    for (const sample of trackData.samples)sample.presentationTimestamp += timestamp;
    for (const entry of trackData.presentationTimestamps)entry.presentationTimestamp += timestamp;
};
/** Extracts the rotation component from a transformation matrix, in degrees. */ const extractRotationFromMatrix = (matrix)=>{
    const [m11, , , m21] = matrix;
    const scaleX = Math.hypot(m11, m21);
    const cosTheta = m11 / scaleX;
    const sinTheta = m21 / scaleX;
    // Invert the rotation because matrices are post-multiplied in ISOBMFF
    const result = -Math.atan2(sinTheta, cosTheta) * (180 / Math.PI);
    if (!Number.isFinite(result)) // Can happen if the entire matrix is 0, for example
    return 0;
    return result;
};
const sampleTableIsEmpty = (sampleTable)=>{
    return sampleTable.sampleSizes.length === 0;
};

},{"../codec.js":"4oSIO","../codec-data.js":"bzpVB","../demuxer.js":"dZcnn","../input-track.js":"dPVVR","../misc.js":"kkhLS","../packet.js":"esYjd","./isobmff-misc.js":"2usK6","./isobmff-reader.js":"hjB9E","../reader.js":"fr2Ka","../metadata.js":"3j8h1","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"bzpVB":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "AvcNalUnitType", ()=>AvcNalUnitType);
parcelHelpers.export(exports, "HevcNalUnitType", ()=>HevcNalUnitType);
parcelHelpers.export(exports, "findNalUnitsInAnnexB", ()=>findNalUnitsInAnnexB);
parcelHelpers.export(exports, "transformAnnexBToLengthPrefixed", ()=>transformAnnexBToLengthPrefixed);
parcelHelpers.export(exports, "extractAvcNalUnits", ()=>extractAvcNalUnits);
parcelHelpers.export(exports, "extractAvcDecoderConfigurationRecord", ()=>extractAvcDecoderConfigurationRecord);
parcelHelpers.export(exports, "serializeAvcDecoderConfigurationRecord", ()=>serializeAvcDecoderConfigurationRecord);
parcelHelpers.export(exports, "deserializeAvcDecoderConfigurationRecord", ()=>deserializeAvcDecoderConfigurationRecord);
parcelHelpers.export(exports, "parseAvcSps", ()=>parseAvcSps);
parcelHelpers.export(exports, "extractHevcNalUnits", ()=>extractHevcNalUnits);
parcelHelpers.export(exports, "extractNalUnitTypeForHevc", ()=>extractNalUnitTypeForHevc);
parcelHelpers.export(exports, "extractHevcDecoderConfigurationRecord", ()=>extractHevcDecoderConfigurationRecord);
parcelHelpers.export(exports, "serializeHevcDecoderConfigurationRecord", ()=>serializeHevcDecoderConfigurationRecord);
parcelHelpers.export(exports, "extractVp9CodecInfoFromPacket", ()=>extractVp9CodecInfoFromPacket);
parcelHelpers.export(exports, "iterateAv1PacketObus", ()=>iterateAv1PacketObus);
parcelHelpers.export(exports, "extractAv1CodecInfoFromPacket", ()=>extractAv1CodecInfoFromPacket);
parcelHelpers.export(exports, "parseOpusIdentificationHeader", ()=>parseOpusIdentificationHeader);
parcelHelpers.export(exports, "parseOpusTocByte", ()=>parseOpusTocByte);
parcelHelpers.export(exports, "parseModesFromVorbisSetupPacket", ()=>parseModesFromVorbisSetupPacket);
parcelHelpers.export(exports, "determineVideoPacketType", ()=>determineVideoPacketType);
parcelHelpers.export(exports, "FlacBlockType", ()=>FlacBlockType);
parcelHelpers.export(exports, "readVorbisComments", ()=>readVorbisComments);
parcelHelpers.export(exports, "createVorbisComments", ()=>createVorbisComments);
var _codecJs = require("./codec.js");
var _miscJs = require("./misc.js");
var AvcNalUnitType;
(function(AvcNalUnitType) {
    AvcNalUnitType[AvcNalUnitType["IDR"] = 5] = "IDR";
    AvcNalUnitType[AvcNalUnitType["SEI"] = 6] = "SEI";
    AvcNalUnitType[AvcNalUnitType["SPS"] = 7] = "SPS";
    AvcNalUnitType[AvcNalUnitType["PPS"] = 8] = "PPS";
    AvcNalUnitType[AvcNalUnitType["SPS_EXT"] = 13] = "SPS_EXT";
})(AvcNalUnitType || (AvcNalUnitType = {}));
var HevcNalUnitType;
(function(HevcNalUnitType) {
    HevcNalUnitType[HevcNalUnitType["RASL_N"] = 8] = "RASL_N";
    HevcNalUnitType[HevcNalUnitType["RASL_R"] = 9] = "RASL_R";
    HevcNalUnitType[HevcNalUnitType["BLA_W_LP"] = 16] = "BLA_W_LP";
    HevcNalUnitType[HevcNalUnitType["RSV_IRAP_VCL23"] = 23] = "RSV_IRAP_VCL23";
    HevcNalUnitType[HevcNalUnitType["VPS_NUT"] = 32] = "VPS_NUT";
    HevcNalUnitType[HevcNalUnitType["SPS_NUT"] = 33] = "SPS_NUT";
    HevcNalUnitType[HevcNalUnitType["PPS_NUT"] = 34] = "PPS_NUT";
    HevcNalUnitType[HevcNalUnitType["PREFIX_SEI_NUT"] = 39] = "PREFIX_SEI_NUT";
    HevcNalUnitType[HevcNalUnitType["SUFFIX_SEI_NUT"] = 40] = "SUFFIX_SEI_NUT";
})(HevcNalUnitType || (HevcNalUnitType = {}));
const findNalUnitsInAnnexB = (packetData)=>{
    const nalUnits = [];
    let i = 0;
    while(i < packetData.length){
        let startCodePos = -1;
        let startCodeLength = 0;
        for(let j = i; j < packetData.length - 3; j++){
            // Check for 3-byte start code (0x000001)
            if (packetData[j] === 0 && packetData[j + 1] === 0 && packetData[j + 2] === 1) {
                startCodePos = j;
                startCodeLength = 3;
                break;
            }
            // Check for 4-byte start code (0x00000001)
            if (j < packetData.length - 4 && packetData[j] === 0 && packetData[j + 1] === 0 && packetData[j + 2] === 0 && packetData[j + 3] === 1) {
                startCodePos = j;
                startCodeLength = 4;
                break;
            }
        }
        if (startCodePos === -1) break; // No more start codes found
        // If this isn't the first start code, extract the previous NAL unit
        if (i > 0 && startCodePos > i) {
            const nalData = packetData.subarray(i, startCodePos);
            if (nalData.length > 0) nalUnits.push(nalData);
        }
        i = startCodePos + startCodeLength;
    }
    // Extract the last NAL unit if there is one
    if (i < packetData.length) {
        const nalData = packetData.subarray(i);
        if (nalData.length > 0) nalUnits.push(nalData);
    }
    return nalUnits;
};
/** Finds all NAL units in an AVC packet in length-prefixed format. */ const findNalUnitsInLengthPrefixed = (packetData, lengthSize)=>{
    const nalUnits = [];
    let offset = 0;
    const dataView = new DataView(packetData.buffer, packetData.byteOffset, packetData.byteLength);
    while(offset + lengthSize <= packetData.length){
        let nalUnitLength;
        if (lengthSize === 1) nalUnitLength = dataView.getUint8(offset);
        else if (lengthSize === 2) nalUnitLength = dataView.getUint16(offset, false);
        else if (lengthSize === 3) nalUnitLength = (0, _miscJs.getUint24)(dataView, offset, false);
        else if (lengthSize === 4) nalUnitLength = dataView.getUint32(offset, false);
        else {
            (0, _miscJs.assertNever)(lengthSize);
            (0, _miscJs.assert)(false);
        }
        offset += lengthSize;
        const nalUnit = packetData.subarray(offset, offset + nalUnitLength);
        nalUnits.push(nalUnit);
        offset += nalUnitLength;
    }
    return nalUnits;
};
const removeEmulationPreventionBytes = (data)=>{
    const result = [];
    const len = data.length;
    for(let i = 0; i < len; i++)// Look for the 0x000003 pattern
    if (i + 2 < len && data[i] === 0x00 && data[i + 1] === 0x00 && data[i + 2] === 0x03) {
        result.push(0x00, 0x00); // Push the first two bytes
        i += 2; // Skip the 0x03 byte
    } else result.push(data[i]);
    return new Uint8Array(result);
};
const transformAnnexBToLengthPrefixed = (packetData)=>{
    const NAL_UNIT_LENGTH_SIZE = 4;
    const nalUnits = findNalUnitsInAnnexB(packetData);
    if (nalUnits.length === 0) // If no NAL units were found, it's not valid Annex B data
    return null;
    let totalSize = 0;
    for (const nalUnit of nalUnits)totalSize += NAL_UNIT_LENGTH_SIZE + nalUnit.byteLength;
    const avccData = new Uint8Array(totalSize);
    const dataView = new DataView(avccData.buffer);
    let offset = 0;
    // Write each NAL unit with its length prefix
    for (const nalUnit of nalUnits){
        const length = nalUnit.byteLength;
        dataView.setUint32(offset, length, false);
        offset += 4;
        avccData.set(nalUnit, offset);
        offset += nalUnit.byteLength;
    }
    return avccData;
};
const extractAvcNalUnits = (packetData, decoderConfig)=>{
    if (decoderConfig.description) {
        // Stream is length-prefixed. Let's extract the size of the length prefix from the decoder config
        const bytes = (0, _miscJs.toUint8Array)(decoderConfig.description);
        const lengthSizeMinusOne = bytes[4] & 3;
        const lengthSize = lengthSizeMinusOne + 1;
        return findNalUnitsInLengthPrefixed(packetData, lengthSize);
    } else // Stream is in Annex B format
    return findNalUnitsInAnnexB(packetData);
};
const extractNalUnitTypeForAvc = (data)=>{
    return data[0] & 0x1F;
};
const extractAvcDecoderConfigurationRecord = (packetData)=>{
    try {
        const nalUnits = findNalUnitsInAnnexB(packetData);
        const spsUnits = nalUnits.filter((unit)=>extractNalUnitTypeForAvc(unit) === AvcNalUnitType.SPS);
        const ppsUnits = nalUnits.filter((unit)=>extractNalUnitTypeForAvc(unit) === AvcNalUnitType.PPS);
        const spsExtUnits = nalUnits.filter((unit)=>extractNalUnitTypeForAvc(unit) === AvcNalUnitType.SPS_EXT);
        if (spsUnits.length === 0) return null;
        if (ppsUnits.length === 0) return null;
        // Let's get the first SPS for profile and level information
        const spsData = spsUnits[0];
        const spsInfo = parseAvcSps(spsData);
        (0, _miscJs.assert)(spsInfo !== null);
        const hasExtendedData = spsInfo.profileIdc === 100 || spsInfo.profileIdc === 110 || spsInfo.profileIdc === 122 || spsInfo.profileIdc === 144;
        return {
            configurationVersion: 1,
            avcProfileIndication: spsInfo.profileIdc,
            profileCompatibility: spsInfo.constraintFlags,
            avcLevelIndication: spsInfo.levelIdc,
            lengthSizeMinusOne: 3,
            sequenceParameterSets: spsUnits,
            pictureParameterSets: ppsUnits,
            chromaFormat: hasExtendedData ? spsInfo.chromaFormatIdc : null,
            bitDepthLumaMinus8: hasExtendedData ? spsInfo.bitDepthLumaMinus8 : null,
            bitDepthChromaMinus8: hasExtendedData ? spsInfo.bitDepthChromaMinus8 : null,
            sequenceParameterSetExt: hasExtendedData ? spsExtUnits : null
        };
    } catch (error) {
        console.error('Error building AVC Decoder Configuration Record:', error);
        return null;
    }
};
const serializeAvcDecoderConfigurationRecord = (record)=>{
    const bytes = [];
    // Write header
    bytes.push(record.configurationVersion);
    bytes.push(record.avcProfileIndication);
    bytes.push(record.profileCompatibility);
    bytes.push(record.avcLevelIndication);
    bytes.push(0xFC | record.lengthSizeMinusOne & 0x03); // Reserved bits (6) + lengthSizeMinusOne (2)
    // Reserved bits (3) + numOfSequenceParameterSets (5)
    bytes.push(0xE0 | record.sequenceParameterSets.length & 0x1F);
    // Write SPS
    for (const sps of record.sequenceParameterSets){
        const length = sps.byteLength;
        bytes.push(length >> 8); // High byte
        bytes.push(length & 0xFF); // Low byte
        for(let i = 0; i < length; i++)bytes.push(sps[i]);
    }
    bytes.push(record.pictureParameterSets.length);
    // Write PPS
    for (const pps of record.pictureParameterSets){
        const length = pps.byteLength;
        bytes.push(length >> 8); // High byte
        bytes.push(length & 0xFF); // Low byte
        for(let i = 0; i < length; i++)bytes.push(pps[i]);
    }
    if (record.avcProfileIndication === 100 || record.avcProfileIndication === 110 || record.avcProfileIndication === 122 || record.avcProfileIndication === 144) {
        (0, _miscJs.assert)(record.chromaFormat !== null);
        (0, _miscJs.assert)(record.bitDepthLumaMinus8 !== null);
        (0, _miscJs.assert)(record.bitDepthChromaMinus8 !== null);
        (0, _miscJs.assert)(record.sequenceParameterSetExt !== null);
        bytes.push(0xFC | record.chromaFormat & 0x03); // Reserved bits + chroma_format
        bytes.push(0xF8 | record.bitDepthLumaMinus8 & 0x07); // Reserved bits + bit_depth_luma_minus8
        bytes.push(0xF8 | record.bitDepthChromaMinus8 & 0x07); // Reserved bits + bit_depth_chroma_minus8
        bytes.push(record.sequenceParameterSetExt.length);
        // Write SPS Ext
        for (const spsExt of record.sequenceParameterSetExt){
            const length = spsExt.byteLength;
            bytes.push(length >> 8); // High byte
            bytes.push(length & 0xFF); // Low byte
            for(let i = 0; i < length; i++)bytes.push(spsExt[i]);
        }
    }
    return new Uint8Array(bytes);
};
const deserializeAvcDecoderConfigurationRecord = (data)=>{
    try {
        const view = (0, _miscJs.toDataView)(data);
        let offset = 0;
        // Read header
        const configurationVersion = view.getUint8(offset++);
        const avcProfileIndication = view.getUint8(offset++);
        const profileCompatibility = view.getUint8(offset++);
        const avcLevelIndication = view.getUint8(offset++);
        const lengthSizeMinusOne = view.getUint8(offset++) & 0x03;
        const numOfSequenceParameterSets = view.getUint8(offset++) & 0x1F;
        // Read SPS
        const sequenceParameterSets = [];
        for(let i = 0; i < numOfSequenceParameterSets; i++){
            const length = view.getUint16(offset, false);
            offset += 2;
            sequenceParameterSets.push(data.subarray(offset, offset + length));
            offset += length;
        }
        const numOfPictureParameterSets = view.getUint8(offset++);
        // Read PPS
        const pictureParameterSets = [];
        for(let i = 0; i < numOfPictureParameterSets; i++){
            const length = view.getUint16(offset, false);
            offset += 2;
            pictureParameterSets.push(data.subarray(offset, offset + length));
            offset += length;
        }
        const record = {
            configurationVersion,
            avcProfileIndication,
            profileCompatibility,
            avcLevelIndication,
            lengthSizeMinusOne,
            sequenceParameterSets,
            pictureParameterSets,
            chromaFormat: null,
            bitDepthLumaMinus8: null,
            bitDepthChromaMinus8: null,
            sequenceParameterSetExt: null
        };
        // Check if there are extended profile fields
        if ((avcProfileIndication === 100 || avcProfileIndication === 110 || avcProfileIndication === 122 || avcProfileIndication === 144) && offset + 4 <= data.length) {
            const chromaFormat = view.getUint8(offset++) & 0x03;
            const bitDepthLumaMinus8 = view.getUint8(offset++) & 0x07;
            const bitDepthChromaMinus8 = view.getUint8(offset++) & 0x07;
            const numOfSequenceParameterSetExt = view.getUint8(offset++);
            record.chromaFormat = chromaFormat;
            record.bitDepthLumaMinus8 = bitDepthLumaMinus8;
            record.bitDepthChromaMinus8 = bitDepthChromaMinus8;
            // Read SPS Ext
            const sequenceParameterSetExt = [];
            for(let i = 0; i < numOfSequenceParameterSetExt; i++){
                const length = view.getUint16(offset, false);
                offset += 2;
                sequenceParameterSetExt.push(data.subarray(offset, offset + length));
                offset += length;
            }
            record.sequenceParameterSetExt = sequenceParameterSetExt;
        }
        return record;
    } catch (error) {
        console.error('Error deserializing AVC Decoder Configuration Record:', error);
        return null;
    }
};
const parseAvcSps = (sps)=>{
    try {
        const bitstream = new (0, _miscJs.Bitstream)(removeEmulationPreventionBytes(sps));
        bitstream.skipBits(1); // forbidden_zero_bit
        bitstream.skipBits(2); // nal_ref_idc
        const nalUnitType = bitstream.readBits(5);
        if (nalUnitType !== 7) return null;
        const profileIdc = bitstream.readAlignedByte();
        const constraintFlags = bitstream.readAlignedByte();
        const levelIdc = bitstream.readAlignedByte();
        (0, _miscJs.readExpGolomb)(bitstream); // seq_parameter_set_id
        let chromaFormatIdc = null;
        let bitDepthLumaMinus8 = null;
        let bitDepthChromaMinus8 = null;
        // Handle high profile chroma_format_idc
        if (profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244 || profileIdc === 44 || profileIdc === 83 || profileIdc === 86 || profileIdc === 118 || profileIdc === 128) {
            chromaFormatIdc = (0, _miscJs.readExpGolomb)(bitstream);
            if (chromaFormatIdc === 3) bitstream.skipBits(1); // separate_colour_plane_flag
            bitDepthLumaMinus8 = (0, _miscJs.readExpGolomb)(bitstream);
            bitDepthChromaMinus8 = (0, _miscJs.readExpGolomb)(bitstream);
            bitstream.skipBits(1); // qpprime_y_zero_transform_bypass_flag
            const seqScalingMatrixPresentFlag = bitstream.readBits(1);
            if (seqScalingMatrixPresentFlag) for(let i = 0; i < (chromaFormatIdc !== 3 ? 8 : 12); i++){
                const seqScalingListPresentFlag = bitstream.readBits(1);
                if (seqScalingListPresentFlag) {
                    const sizeOfScalingList = i < 6 ? 16 : 64;
                    let lastScale = 8;
                    let nextScale = 8;
                    for(let j = 0; j < sizeOfScalingList; j++){
                        if (nextScale !== 0) {
                            const deltaScale = (0, _miscJs.readSignedExpGolomb)(bitstream);
                            nextScale = (lastScale + deltaScale + 256) % 256;
                        }
                        lastScale = nextScale === 0 ? lastScale : nextScale;
                    }
                }
            }
        }
        (0, _miscJs.readExpGolomb)(bitstream); // log2_max_frame_num_minus4
        const picOrderCntType = (0, _miscJs.readExpGolomb)(bitstream);
        if (picOrderCntType === 0) (0, _miscJs.readExpGolomb)(bitstream); // log2_max_pic_order_cnt_lsb_minus4
        else if (picOrderCntType === 1) {
            bitstream.skipBits(1); // delta_pic_order_always_zero_flag
            (0, _miscJs.readSignedExpGolomb)(bitstream); // offset_for_non_ref_pic
            (0, _miscJs.readSignedExpGolomb)(bitstream); // offset_for_top_to_bottom_field
            const numRefFramesInPicOrderCntCycle = (0, _miscJs.readExpGolomb)(bitstream);
            for(let i = 0; i < numRefFramesInPicOrderCntCycle; i++)(0, _miscJs.readSignedExpGolomb)(bitstream); // offset_for_ref_frame[i]
        }
        (0, _miscJs.readExpGolomb)(bitstream); // max_num_ref_frames
        bitstream.skipBits(1); // gaps_in_frame_num_value_allowed_flag
        (0, _miscJs.readExpGolomb)(bitstream); // pic_width_in_mbs_minus1
        (0, _miscJs.readExpGolomb)(bitstream); // pic_height_in_map_units_minus1
        const frameMbsOnlyFlag = bitstream.readBits(1);
        return {
            profileIdc,
            constraintFlags,
            levelIdc,
            frameMbsOnlyFlag,
            chromaFormatIdc,
            bitDepthLumaMinus8,
            bitDepthChromaMinus8
        };
    } catch (error) {
        console.error('Error parsing AVC SPS:', error);
        return null;
    }
};
const extractHevcNalUnits = (packetData, decoderConfig)=>{
    if (decoderConfig.description) {
        // Stream is length-prefixed. Let's extract the size of the length prefix from the decoder config
        const bytes = (0, _miscJs.toUint8Array)(decoderConfig.description);
        const lengthSizeMinusOne = bytes[21] & 3;
        const lengthSize = lengthSizeMinusOne + 1;
        return findNalUnitsInLengthPrefixed(packetData, lengthSize);
    } else // Stream is in Annex B format
    return findNalUnitsInAnnexB(packetData);
};
const extractNalUnitTypeForHevc = (data)=>{
    return data[0] >> 1 & 0x3F;
};
const extractHevcDecoderConfigurationRecord = (packetData)=>{
    try {
        const nalUnits = findNalUnitsInAnnexB(packetData);
        const vpsUnits = nalUnits.filter((unit)=>extractNalUnitTypeForHevc(unit) === HevcNalUnitType.VPS_NUT);
        const spsUnits = nalUnits.filter((unit)=>extractNalUnitTypeForHevc(unit) === HevcNalUnitType.SPS_NUT);
        const ppsUnits = nalUnits.filter((unit)=>extractNalUnitTypeForHevc(unit) === HevcNalUnitType.PPS_NUT);
        const seiUnits = nalUnits.filter((unit)=>extractNalUnitTypeForHevc(unit) === HevcNalUnitType.PREFIX_SEI_NUT || extractNalUnitTypeForHevc(unit) === HevcNalUnitType.SUFFIX_SEI_NUT);
        if (spsUnits.length === 0 || ppsUnits.length === 0) return null;
        const sps = spsUnits[0];
        const bitstream = new (0, _miscJs.Bitstream)(removeEmulationPreventionBytes(sps));
        bitstream.skipBits(16); // NAL header
        bitstream.readBits(4); // sps_video_parameter_set_id
        const sps_max_sub_layers_minus1 = bitstream.readBits(3);
        const sps_temporal_id_nesting_flag = bitstream.readBits(1);
        const { general_profile_space, general_tier_flag, general_profile_idc, general_profile_compatibility_flags, general_constraint_indicator_flags, general_level_idc } = parseProfileTierLevel(bitstream, sps_max_sub_layers_minus1);
        (0, _miscJs.readExpGolomb)(bitstream); // sps_seq_parameter_set_id
        const chroma_format_idc = (0, _miscJs.readExpGolomb)(bitstream);
        if (chroma_format_idc === 3) bitstream.skipBits(1); // separate_colour_plane_flag
        (0, _miscJs.readExpGolomb)(bitstream); // pic_width_in_luma_samples
        (0, _miscJs.readExpGolomb)(bitstream); // pic_height_in_luma_samples
        if (bitstream.readBits(1)) {
            (0, _miscJs.readExpGolomb)(bitstream); // conf_win_left_offset
            (0, _miscJs.readExpGolomb)(bitstream); // conf_win_right_offset
            (0, _miscJs.readExpGolomb)(bitstream); // conf_win_top_offset
            (0, _miscJs.readExpGolomb)(bitstream); // conf_win_bottom_offset
        }
        const bit_depth_luma_minus8 = (0, _miscJs.readExpGolomb)(bitstream);
        const bit_depth_chroma_minus8 = (0, _miscJs.readExpGolomb)(bitstream);
        (0, _miscJs.readExpGolomb)(bitstream); // log2_max_pic_order_cnt_lsb_minus4
        const sps_sub_layer_ordering_info_present_flag = bitstream.readBits(1);
        const maxNum = sps_sub_layer_ordering_info_present_flag ? 0 : sps_max_sub_layers_minus1;
        for(let i = maxNum; i <= sps_max_sub_layers_minus1; i++){
            (0, _miscJs.readExpGolomb)(bitstream); // sps_max_dec_pic_buffering_minus1[i]
            (0, _miscJs.readExpGolomb)(bitstream); // sps_max_num_reorder_pics[i]
            (0, _miscJs.readExpGolomb)(bitstream); // sps_max_latency_increase_plus1[i]
        }
        (0, _miscJs.readExpGolomb)(bitstream); // log2_min_luma_coding_block_size_minus3
        (0, _miscJs.readExpGolomb)(bitstream); // log2_diff_max_min_luma_coding_block_size
        (0, _miscJs.readExpGolomb)(bitstream); // log2_min_luma_transform_block_size_minus2
        (0, _miscJs.readExpGolomb)(bitstream); // log2_diff_max_min_luma_transform_block_size
        (0, _miscJs.readExpGolomb)(bitstream); // max_transform_hierarchy_depth_inter
        (0, _miscJs.readExpGolomb)(bitstream); // max_transform_hierarchy_depth_intra
        if (bitstream.readBits(1)) {
            if (bitstream.readBits(1)) skipScalingListData(bitstream);
        }
        bitstream.skipBits(1); // amp_enabled_flag
        bitstream.skipBits(1); // sample_adaptive_offset_enabled_flag
        if (bitstream.readBits(1)) {
            bitstream.skipBits(4); // pcm_sample_bit_depth_luma_minus1
            bitstream.skipBits(4); // pcm_sample_bit_depth_chroma_minus1
            (0, _miscJs.readExpGolomb)(bitstream); // log2_min_pcm_luma_coding_block_size_minus3
            (0, _miscJs.readExpGolomb)(bitstream); // log2_diff_max_min_pcm_luma_coding_block_size
            bitstream.skipBits(1); // pcm_loop_filter_disabled_flag
        }
        const num_short_term_ref_pic_sets = (0, _miscJs.readExpGolomb)(bitstream);
        skipAllStRefPicSets(bitstream, num_short_term_ref_pic_sets);
        if (bitstream.readBits(1)) {
            const num_long_term_ref_pics_sps = (0, _miscJs.readExpGolomb)(bitstream);
            for(let i = 0; i < num_long_term_ref_pics_sps; i++){
                (0, _miscJs.readExpGolomb)(bitstream); // lt_ref_pic_poc_lsb_sps[i]
                bitstream.skipBits(1); // used_by_curr_pic_lt_sps_flag[i]
            }
        }
        bitstream.skipBits(1); // sps_temporal_mvp_enabled_flag
        bitstream.skipBits(1); // strong_intra_smoothing_enabled_flag
        let min_spatial_segmentation_idc = 0;
        if (bitstream.readBits(1)) min_spatial_segmentation_idc = parseVuiForMinSpatialSegmentationIdc(bitstream, sps_max_sub_layers_minus1);
        // Parse PPS for parallelismType
        let parallelismType = 0;
        if (ppsUnits.length > 0) {
            const pps = ppsUnits[0];
            const ppsBitstream = new (0, _miscJs.Bitstream)(removeEmulationPreventionBytes(pps));
            ppsBitstream.skipBits(16); // NAL header
            (0, _miscJs.readExpGolomb)(ppsBitstream); // pps_pic_parameter_set_id
            (0, _miscJs.readExpGolomb)(ppsBitstream); // pps_seq_parameter_set_id
            ppsBitstream.skipBits(1); // dependent_slice_segments_enabled_flag
            ppsBitstream.skipBits(1); // output_flag_present_flag
            ppsBitstream.skipBits(3); // num_extra_slice_header_bits
            ppsBitstream.skipBits(1); // sign_data_hiding_enabled_flag
            ppsBitstream.skipBits(1); // cabac_init_present_flag
            (0, _miscJs.readExpGolomb)(ppsBitstream); // num_ref_idx_l0_default_active_minus1
            (0, _miscJs.readExpGolomb)(ppsBitstream); // num_ref_idx_l1_default_active_minus1
            (0, _miscJs.readSignedExpGolomb)(ppsBitstream); // init_qp_minus26
            ppsBitstream.skipBits(1); // constrained_intra_pred_flag
            ppsBitstream.skipBits(1); // transform_skip_enabled_flag
            if (ppsBitstream.readBits(1)) (0, _miscJs.readExpGolomb)(ppsBitstream); // diff_cu_qp_delta_depth
            (0, _miscJs.readSignedExpGolomb)(ppsBitstream); // pps_cb_qp_offset
            (0, _miscJs.readSignedExpGolomb)(ppsBitstream); // pps_cr_qp_offset
            ppsBitstream.skipBits(1); // pps_slice_chroma_qp_offsets_present_flag
            ppsBitstream.skipBits(1); // weighted_pred_flag
            ppsBitstream.skipBits(1); // weighted_bipred_flag
            ppsBitstream.skipBits(1); // transquant_bypass_enabled_flag
            const tiles_enabled_flag = ppsBitstream.readBits(1);
            const entropy_coding_sync_enabled_flag = ppsBitstream.readBits(1);
            if (!tiles_enabled_flag && !entropy_coding_sync_enabled_flag) parallelismType = 0;
            else if (tiles_enabled_flag && !entropy_coding_sync_enabled_flag) parallelismType = 2;
            else if (!tiles_enabled_flag && entropy_coding_sync_enabled_flag) parallelismType = 3;
            else parallelismType = 0;
        }
        const arrays = [
            ...vpsUnits.length ? [
                {
                    arrayCompleteness: 1,
                    nalUnitType: HevcNalUnitType.VPS_NUT,
                    nalUnits: vpsUnits
                }
            ] : [],
            ...spsUnits.length ? [
                {
                    arrayCompleteness: 1,
                    nalUnitType: HevcNalUnitType.SPS_NUT,
                    nalUnits: spsUnits
                }
            ] : [],
            ...ppsUnits.length ? [
                {
                    arrayCompleteness: 1,
                    nalUnitType: HevcNalUnitType.PPS_NUT,
                    nalUnits: ppsUnits
                }
            ] : [],
            ...seiUnits.length ? [
                {
                    arrayCompleteness: 1,
                    nalUnitType: extractNalUnitTypeForHevc(seiUnits[0]),
                    nalUnits: seiUnits
                }
            ] : []
        ];
        const record = {
            configurationVersion: 1,
            generalProfileSpace: general_profile_space,
            generalTierFlag: general_tier_flag,
            generalProfileIdc: general_profile_idc,
            generalProfileCompatibilityFlags: general_profile_compatibility_flags,
            generalConstraintIndicatorFlags: general_constraint_indicator_flags,
            generalLevelIdc: general_level_idc,
            minSpatialSegmentationIdc: min_spatial_segmentation_idc,
            parallelismType,
            chromaFormatIdc: chroma_format_idc,
            bitDepthLumaMinus8: bit_depth_luma_minus8,
            bitDepthChromaMinus8: bit_depth_chroma_minus8,
            avgFrameRate: 0,
            constantFrameRate: 0,
            numTemporalLayers: sps_max_sub_layers_minus1 + 1,
            temporalIdNested: sps_temporal_id_nesting_flag,
            lengthSizeMinusOne: 3,
            arrays
        };
        return record;
    } catch (error) {
        console.error('Error building HEVC Decoder Configuration Record:', error);
        return null;
    }
};
const parseProfileTierLevel = (bitstream, maxNumSubLayersMinus1)=>{
    const general_profile_space = bitstream.readBits(2);
    const general_tier_flag = bitstream.readBits(1);
    const general_profile_idc = bitstream.readBits(5);
    let general_profile_compatibility_flags = 0;
    for(let i = 0; i < 32; i++)general_profile_compatibility_flags = general_profile_compatibility_flags << 1 | bitstream.readBits(1);
    const general_constraint_indicator_flags = new Uint8Array(6);
    for(let i = 0; i < 6; i++)general_constraint_indicator_flags[i] = bitstream.readBits(8);
    const general_level_idc = bitstream.readBits(8);
    const sub_layer_profile_present_flag = [];
    const sub_layer_level_present_flag = [];
    for(let i = 0; i < maxNumSubLayersMinus1; i++){
        sub_layer_profile_present_flag.push(bitstream.readBits(1));
        sub_layer_level_present_flag.push(bitstream.readBits(1));
    }
    if (maxNumSubLayersMinus1 > 0) for(let i = maxNumSubLayersMinus1; i < 8; i++)bitstream.skipBits(2); // reserved_zero_2bits
    for(let i = 0; i < maxNumSubLayersMinus1; i++){
        if (sub_layer_profile_present_flag[i]) bitstream.skipBits(88);
        if (sub_layer_level_present_flag[i]) bitstream.skipBits(8);
    }
    return {
        general_profile_space,
        general_tier_flag,
        general_profile_idc,
        general_profile_compatibility_flags,
        general_constraint_indicator_flags,
        general_level_idc
    };
};
const skipScalingListData = (bitstream)=>{
    for(let sizeId = 0; sizeId < 4; sizeId++)for(let matrixId = 0; matrixId < (sizeId === 3 ? 2 : 6); matrixId++){
        const scaling_list_pred_mode_flag = bitstream.readBits(1);
        if (!scaling_list_pred_mode_flag) (0, _miscJs.readExpGolomb)(bitstream); // scaling_list_pred_matrix_id_delta
        else {
            const coefNum = Math.min(64, 1 << 4 + (sizeId << 1));
            if (sizeId > 1) (0, _miscJs.readSignedExpGolomb)(bitstream); // scaling_list_dc_coef_minus8
            for(let i = 0; i < coefNum; i++)(0, _miscJs.readSignedExpGolomb)(bitstream); // scaling_list_delta_coef
        }
    }
};
const skipAllStRefPicSets = (bitstream, num_short_term_ref_pic_sets)=>{
    const NumDeltaPocs = [];
    for(let stRpsIdx = 0; stRpsIdx < num_short_term_ref_pic_sets; stRpsIdx++)NumDeltaPocs[stRpsIdx] = skipStRefPicSet(bitstream, stRpsIdx, num_short_term_ref_pic_sets, NumDeltaPocs);
};
const skipStRefPicSet = (bitstream, stRpsIdx, num_short_term_ref_pic_sets, NumDeltaPocs)=>{
    let NumDeltaPocsThis = 0;
    let inter_ref_pic_set_prediction_flag = 0;
    let RefRpsIdx = 0;
    if (stRpsIdx !== 0) inter_ref_pic_set_prediction_flag = bitstream.readBits(1);
    if (inter_ref_pic_set_prediction_flag) {
        if (stRpsIdx === num_short_term_ref_pic_sets) {
            const delta_idx_minus1 = (0, _miscJs.readExpGolomb)(bitstream);
            RefRpsIdx = stRpsIdx - (delta_idx_minus1 + 1);
        } else RefRpsIdx = stRpsIdx - 1;
        bitstream.readBits(1); // delta_rps_sign
        (0, _miscJs.readExpGolomb)(bitstream); // abs_delta_rps_minus1
        // The number of iterations is NumDeltaPocs[RefRpsIdx] + 1
        const numDelta = NumDeltaPocs[RefRpsIdx] ?? 0;
        for(let j = 0; j <= numDelta; j++){
            const used_by_curr_pic_flag = bitstream.readBits(1);
            if (!used_by_curr_pic_flag) bitstream.readBits(1); // use_delta_flag
        }
        NumDeltaPocsThis = NumDeltaPocs[RefRpsIdx];
    } else {
        const num_negative_pics = (0, _miscJs.readExpGolomb)(bitstream);
        const num_positive_pics = (0, _miscJs.readExpGolomb)(bitstream);
        for(let i = 0; i < num_negative_pics; i++){
            (0, _miscJs.readExpGolomb)(bitstream); // delta_poc_s0_minus1[i]
            bitstream.readBits(1); // used_by_curr_pic_s0_flag[i]
        }
        for(let i = 0; i < num_positive_pics; i++){
            (0, _miscJs.readExpGolomb)(bitstream); // delta_poc_s1_minus1[i]
            bitstream.readBits(1); // used_by_curr_pic_s1_flag[i]
        }
        NumDeltaPocsThis = num_negative_pics + num_positive_pics;
    }
    return NumDeltaPocsThis;
};
const parseVuiForMinSpatialSegmentationIdc = (bitstream, sps_max_sub_layers_minus1)=>{
    if (bitstream.readBits(1)) {
        const aspect_ratio_idc = bitstream.readBits(8);
        if (aspect_ratio_idc === 255) {
            bitstream.readBits(16); // sar_width
            bitstream.readBits(16); // sar_height
        }
    }
    if (bitstream.readBits(1)) bitstream.readBits(1); // overscan_appropriate_flag
    if (bitstream.readBits(1)) {
        bitstream.readBits(3); // video_format
        bitstream.readBits(1); // video_full_range_flag
        if (bitstream.readBits(1)) {
            bitstream.readBits(8); // colour_primaries
            bitstream.readBits(8); // transfer_characteristics
            bitstream.readBits(8); // matrix_coeffs
        }
    }
    if (bitstream.readBits(1)) {
        (0, _miscJs.readExpGolomb)(bitstream); // chroma_sample_loc_type_top_field
        (0, _miscJs.readExpGolomb)(bitstream); // chroma_sample_loc_type_bottom_field
    }
    bitstream.readBits(1); // neutral_chroma_indication_flag
    bitstream.readBits(1); // field_seq_flag
    bitstream.readBits(1); // frame_field_info_present_flag
    if (bitstream.readBits(1)) {
        (0, _miscJs.readExpGolomb)(bitstream); // def_disp_win_left_offset
        (0, _miscJs.readExpGolomb)(bitstream); // def_disp_win_right_offset
        (0, _miscJs.readExpGolomb)(bitstream); // def_disp_win_top_offset
        (0, _miscJs.readExpGolomb)(bitstream); // def_disp_win_bottom_offset
    }
    if (bitstream.readBits(1)) {
        bitstream.readBits(32); // vui_num_units_in_tick
        bitstream.readBits(32); // vui_time_scale
        if (bitstream.readBits(1)) (0, _miscJs.readExpGolomb)(bitstream); // vui_num_ticks_poc_diff_one_minus1
        if (bitstream.readBits(1)) skipHrdParameters(bitstream, true, sps_max_sub_layers_minus1);
    }
    if (bitstream.readBits(1)) {
        bitstream.readBits(1); // tiles_fixed_structure_flag
        bitstream.readBits(1); // motion_vectors_over_pic_boundaries_flag
        bitstream.readBits(1); // restricted_ref_pic_lists_flag
        const min_spatial_segmentation_idc = (0, _miscJs.readExpGolomb)(bitstream);
        // skip the rest
        (0, _miscJs.readExpGolomb)(bitstream); // max_bytes_per_pic_denom
        (0, _miscJs.readExpGolomb)(bitstream); // max_bits_per_min_cu_denom
        (0, _miscJs.readExpGolomb)(bitstream); // log2_max_mv_length_horizontal
        (0, _miscJs.readExpGolomb)(bitstream); // log2_max_mv_length_vertical
        return min_spatial_segmentation_idc;
    }
    return 0;
};
const skipHrdParameters = (bitstream, commonInfPresentFlag, maxNumSubLayersMinus1)=>{
    let nal_hrd_parameters_present_flag = false;
    let vcl_hrd_parameters_present_flag = false;
    let sub_pic_hrd_params_present_flag = false;
    if (commonInfPresentFlag) {
        nal_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
        vcl_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
        if (nal_hrd_parameters_present_flag || vcl_hrd_parameters_present_flag) {
            sub_pic_hrd_params_present_flag = bitstream.readBits(1) === 1;
            if (sub_pic_hrd_params_present_flag) {
                bitstream.readBits(8); // tick_divisor_minus2
                bitstream.readBits(5); // du_cpb_removal_delay_increment_length_minus1
                bitstream.readBits(1); // sub_pic_cpb_params_in_pic_timing_sei_flag
                bitstream.readBits(5); // dpb_output_delay_du_length_minus1
            }
            bitstream.readBits(4); // bit_rate_scale
            bitstream.readBits(4); // cpb_size_scale
            if (sub_pic_hrd_params_present_flag) bitstream.readBits(4); // cpb_size_du_scale
            bitstream.readBits(5); // initial_cpb_removal_delay_length_minus1
            bitstream.readBits(5); // au_cpb_removal_delay_length_minus1
            bitstream.readBits(5); // dpb_output_delay_length_minus1
        }
    }
    for(let i = 0; i <= maxNumSubLayersMinus1; i++){
        const fixed_pic_rate_general_flag = bitstream.readBits(1) === 1;
        let fixed_pic_rate_within_cvs_flag = true; // Default assumption if general is true
        if (!fixed_pic_rate_general_flag) fixed_pic_rate_within_cvs_flag = bitstream.readBits(1) === 1;
        let low_delay_hrd_flag = false; // Default assumption
        if (fixed_pic_rate_within_cvs_flag) (0, _miscJs.readExpGolomb)(bitstream); // elemental_duration_in_tc_minus1[i]
        else low_delay_hrd_flag = bitstream.readBits(1) === 1;
        let CpbCnt = 1; // Default if low_delay is true
        if (!low_delay_hrd_flag) {
            const cpb_cnt_minus1 = (0, _miscJs.readExpGolomb)(bitstream); // cpb_cnt_minus1[i]
            CpbCnt = cpb_cnt_minus1 + 1;
        }
        if (nal_hrd_parameters_present_flag) skipSubLayerHrdParameters(bitstream, CpbCnt, sub_pic_hrd_params_present_flag);
        if (vcl_hrd_parameters_present_flag) skipSubLayerHrdParameters(bitstream, CpbCnt, sub_pic_hrd_params_present_flag);
    }
};
const skipSubLayerHrdParameters = (bitstream, CpbCnt, sub_pic_hrd_params_present_flag)=>{
    for(let i = 0; i < CpbCnt; i++){
        (0, _miscJs.readExpGolomb)(bitstream); // bit_rate_value_minus1[i]
        (0, _miscJs.readExpGolomb)(bitstream); // cpb_size_value_minus1[i]
        if (sub_pic_hrd_params_present_flag) {
            (0, _miscJs.readExpGolomb)(bitstream); // cpb_size_du_value_minus1[i]
            (0, _miscJs.readExpGolomb)(bitstream); // bit_rate_du_value_minus1[i]
        }
        bitstream.readBits(1); // cbr_flag[i]
    }
};
const serializeHevcDecoderConfigurationRecord = (record)=>{
    const bytes = [];
    bytes.push(record.configurationVersion);
    bytes.push((record.generalProfileSpace & 0x3) << 6 | (record.generalTierFlag & 0x1) << 5 | record.generalProfileIdc & 0x1F);
    bytes.push(record.generalProfileCompatibilityFlags >>> 24 & 0xFF);
    bytes.push(record.generalProfileCompatibilityFlags >>> 16 & 0xFF);
    bytes.push(record.generalProfileCompatibilityFlags >>> 8 & 0xFF);
    bytes.push(record.generalProfileCompatibilityFlags & 0xFF);
    bytes.push(...record.generalConstraintIndicatorFlags);
    bytes.push(record.generalLevelIdc & 0xFF);
    bytes.push(0xF0 | record.minSpatialSegmentationIdc >> 8 & 0x0F); // Reserved + high nibble
    bytes.push(record.minSpatialSegmentationIdc & 0xFF); // Low byte
    bytes.push(0xFC | record.parallelismType & 0x03);
    bytes.push(0xFC | record.chromaFormatIdc & 0x03);
    bytes.push(0xF8 | record.bitDepthLumaMinus8 & 0x07);
    bytes.push(0xF8 | record.bitDepthChromaMinus8 & 0x07);
    bytes.push(record.avgFrameRate >> 8 & 0xFF); // High byte
    bytes.push(record.avgFrameRate & 0xFF); // Low byte
    bytes.push((record.constantFrameRate & 0x03) << 6 | (record.numTemporalLayers & 0x07) << 3 | (record.temporalIdNested & 0x01) << 2 | record.lengthSizeMinusOne & 0x03);
    bytes.push(record.arrays.length & 0xFF);
    for (const arr of record.arrays){
        bytes.push((arr.arrayCompleteness & 0x01) << 7 | 0 | arr.nalUnitType & 0x3F);
        bytes.push(arr.nalUnits.length >> 8 & 0xFF); // High byte
        bytes.push(arr.nalUnits.length & 0xFF); // Low byte
        for (const nal of arr.nalUnits){
            bytes.push(nal.length >> 8 & 0xFF); // High byte
            bytes.push(nal.length & 0xFF); // Low byte
            for(let i = 0; i < nal.length; i++)bytes.push(nal[i]);
        }
    }
    return new Uint8Array(bytes);
};
const extractVp9CodecInfoFromPacket = (packet)=>{
    // eslint-disable-next-line @stylistic/max-len
    // https://storage.googleapis.com/downloads.webmproject.org/docs/vp9/vp9-bitstream-specification-v0.7-20170222-draft.pdf
    // http://downloads.webmproject.org/docs/vp9/vp9-bitstream_superframe-and-uncompressed-header_v1.0.pdf
    const bitstream = new (0, _miscJs.Bitstream)(packet);
    // Frame marker (0b10)
    const frameMarker = bitstream.readBits(2);
    if (frameMarker !== 2) return null;
    // Profile
    const profileLowBit = bitstream.readBits(1);
    const profileHighBit = bitstream.readBits(1);
    const profile = (profileHighBit << 1) + profileLowBit;
    // Skip reserved bit for profile 3
    if (profile === 3) bitstream.skipBits(1);
    // show_existing_frame
    const showExistingFrame = bitstream.readBits(1);
    if (showExistingFrame === 1) return null;
    // frame_type (0 = key frame)
    const frameType = bitstream.readBits(1);
    if (frameType !== 0) return null;
    // Skip show_frame and error_resilient_mode
    bitstream.skipBits(2);
    // Sync code (0x498342)
    const syncCode = bitstream.readBits(24);
    if (syncCode !== 0x498342) return null;
    // Color config
    let bitDepth = 8;
    if (profile >= 2) {
        const tenOrTwelveBit = bitstream.readBits(1);
        bitDepth = tenOrTwelveBit ? 12 : 10;
    }
    // Color space
    const colorSpace = bitstream.readBits(3);
    let chromaSubsampling = 0;
    let videoFullRangeFlag = 0;
    if (colorSpace !== 7) {
        const colorRange = bitstream.readBits(1);
        videoFullRangeFlag = colorRange;
        if (profile === 1 || profile === 3) {
            const subsamplingX = bitstream.readBits(1);
            const subsamplingY = bitstream.readBits(1);
            // 0 = 4:2:0 vertical
            // 1 = 4:2:0 colocated
            // 2 = 4:2:2
            // 3 = 4:4:4
            chromaSubsampling = !subsamplingX && !subsamplingY ? 3 // 0,0 = 4:4:4
             : subsamplingX && !subsamplingY ? 2 // 1,0 = 4:2:2
             : 1; // 1,1 = 4:2:0 colocated (default)
            // Skip reserved bit
            bitstream.skipBits(1);
        } else // For profile 0 and 2, always 4:2:0
        chromaSubsampling = 1; // Using colocated as default
    } else {
        // RGB is always 4:4:4
        chromaSubsampling = 3;
        videoFullRangeFlag = 1;
    }
    // Parse frame size
    const widthMinusOne = bitstream.readBits(16);
    const heightMinusOne = bitstream.readBits(16);
    const width = widthMinusOne + 1;
    const height = heightMinusOne + 1;
    // Calculate level based on dimensions
    const pictureSize = width * height;
    let level = (0, _miscJs.last)((0, _codecJs.VP9_LEVEL_TABLE)).level; // Default to highest level
    for (const entry of (0, _codecJs.VP9_LEVEL_TABLE))if (pictureSize <= entry.maxPictureSize) {
        level = entry.level;
        break;
    }
    // Map color_space to standard values
    const matrixCoefficients = colorSpace === 7 ? 0 : colorSpace === 2 ? 1 : colorSpace === 1 ? 6 : 2;
    const colourPrimaries = colorSpace === 2 ? 1 : colorSpace === 1 ? 6 : 2;
    const transferCharacteristics = colorSpace === 2 ? 1 : colorSpace === 1 ? 6 : 2;
    return {
        profile,
        level,
        bitDepth,
        chromaSubsampling,
        videoFullRangeFlag,
        colourPrimaries,
        transferCharacteristics,
        matrixCoefficients
    };
};
const iterateAv1PacketObus = function*(packet) {
    // https://aomediacodec.github.io/av1-spec/av1-spec.pdf
    const bitstream = new (0, _miscJs.Bitstream)(packet);
    const readLeb128 = ()=>{
        let value = 0;
        for(let i = 0; i < 8; i++){
            const byte = bitstream.readAlignedByte();
            value |= (byte & 0x7f) << i * 7;
            if (!(byte & 0x80)) break;
            // Spec requirement
            if (i === 7 && byte & 0x80) return null;
        }
        // Spec requirement
        if (value >= 2 ** 32 - 1) return null;
        return value;
    };
    while(bitstream.getBitsLeft() >= 8){
        // Parse OBU header
        bitstream.skipBits(1);
        const obuType = bitstream.readBits(4);
        const obuExtension = bitstream.readBits(1);
        const obuHasSizeField = bitstream.readBits(1);
        bitstream.skipBits(1);
        // Skip extension header if present
        if (obuExtension) bitstream.skipBits(8);
        // Read OBU size if present
        let obuSize;
        if (obuHasSizeField) {
            const obuSizeValue = readLeb128();
            if (obuSizeValue === null) return; // It was invalid
            obuSize = obuSizeValue;
        } else // Calculate remaining bits and convert to bytes, rounding down
        obuSize = Math.floor(bitstream.getBitsLeft() / 8);
        (0, _miscJs.assert)(bitstream.pos % 8 === 0);
        yield {
            type: obuType,
            data: packet.subarray(bitstream.pos / 8, bitstream.pos / 8 + obuSize)
        };
        // Move to next OBU
        bitstream.skipBits(obuSize * 8);
    }
};
const extractAv1CodecInfoFromPacket = (packet)=>{
    // https://aomediacodec.github.io/av1-spec/av1-spec.pdf
    for (const { type, data } of iterateAv1PacketObus(packet)){
        if (type !== 1) continue; // 1 == OBU_SEQUENCE_HEADER
        const bitstream = new (0, _miscJs.Bitstream)(data);
        // Read sequence header fields
        const seqProfile = bitstream.readBits(3);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const stillPicture = bitstream.readBits(1);
        const reducedStillPictureHeader = bitstream.readBits(1);
        let seqLevel = 0;
        let seqTier = 0;
        let bufferDelayLengthMinus1 = 0;
        if (reducedStillPictureHeader) seqLevel = bitstream.readBits(5);
        else {
            // Parse timing_info_present_flag
            const timingInfoPresentFlag = bitstream.readBits(1);
            if (timingInfoPresentFlag) {
                // Skip timing info (num_units_in_display_tick, time_scale, equal_picture_interval)
                bitstream.skipBits(32); // num_units_in_display_tick
                bitstream.skipBits(32); // time_scale
                const equalPictureInterval = bitstream.readBits(1);
                if (equalPictureInterval) // Skip num_ticks_per_picture_minus_1 (uvlc)
                // Since this is variable length, we'd need to implement uvlc reading
                // For now, we'll return null as this is rare
                return null;
            }
            // Parse decoder_model_info_present_flag
            const decoderModelInfoPresentFlag = bitstream.readBits(1);
            if (decoderModelInfoPresentFlag) {
                // Store buffer_delay_length_minus_1 instead of just skipping
                bufferDelayLengthMinus1 = bitstream.readBits(5);
                bitstream.skipBits(32); // num_units_in_decoding_tick
                bitstream.skipBits(5); // buffer_removal_time_length_minus_1
                bitstream.skipBits(5); // frame_presentation_time_length_minus_1
            }
            // Parse operating_points_cnt_minus_1
            const operatingPointsCntMinus1 = bitstream.readBits(5);
            // For each operating point
            for(let i = 0; i <= operatingPointsCntMinus1; i++){
                // operating_point_idc[i]
                bitstream.skipBits(12);
                // seq_level_idx[i]
                const seqLevelIdx = bitstream.readBits(5);
                if (i === 0) seqLevel = seqLevelIdx;
                if (seqLevelIdx > 7) {
                    // seq_tier[i]
                    const seqTierTemp = bitstream.readBits(1);
                    if (i === 0) seqTier = seqTierTemp;
                }
                if (decoderModelInfoPresentFlag) {
                    // decoder_model_present_for_this_op[i]
                    const decoderModelPresentForThisOp = bitstream.readBits(1);
                    if (decoderModelPresentForThisOp) {
                        const n = bufferDelayLengthMinus1 + 1;
                        bitstream.skipBits(n); // decoder_buffer_delay[op]
                        bitstream.skipBits(n); // encoder_buffer_delay[op]
                        bitstream.skipBits(1); // low_delay_mode_flag[op]
                    }
                }
                // initial_display_delay_present_flag
                const initialDisplayDelayPresentFlag = bitstream.readBits(1);
                if (initialDisplayDelayPresentFlag) // initial_display_delay_minus_1[i]
                bitstream.skipBits(4);
            }
        }
        // Frame size
        const frameWidthBitsMinus1 = bitstream.readBits(4);
        const frameHeightBitsMinus1 = bitstream.readBits(4);
        const n1 = frameWidthBitsMinus1 + 1;
        bitstream.skipBits(n1); // max_frame_width_minus_1
        const n2 = frameHeightBitsMinus1 + 1;
        bitstream.skipBits(n2); // max_frame_height_minus_1
        // Frame IDs
        let frameIdNumbersPresentFlag = 0;
        if (reducedStillPictureHeader) frameIdNumbersPresentFlag = 0;
        else frameIdNumbersPresentFlag = bitstream.readBits(1);
        if (frameIdNumbersPresentFlag) {
            bitstream.skipBits(4); // delta_frame_id_length_minus_2
            bitstream.skipBits(3); // additional_frame_id_length_minus_1
        }
        bitstream.skipBits(1); // use_128x128_superblock
        bitstream.skipBits(1); // enable_filter_intra
        bitstream.skipBits(1); // enable_intra_edge_filter
        if (!reducedStillPictureHeader) {
            bitstream.skipBits(1); // enable_interintra_compound
            bitstream.skipBits(1); // enable_masked_compound
            bitstream.skipBits(1); // enable_warped_motion
            bitstream.skipBits(1); // enable_dual_filter
            const enableOrderHint = bitstream.readBits(1);
            if (enableOrderHint) {
                bitstream.skipBits(1); // enable_jnt_comp
                bitstream.skipBits(1); // enable_ref_frame_mvs
            }
            const seqChooseScreenContentTools = bitstream.readBits(1);
            let seqForceScreenContentTools = 0;
            if (seqChooseScreenContentTools) seqForceScreenContentTools = 2; // SELECT_SCREEN_CONTENT_TOOLS
            else seqForceScreenContentTools = bitstream.readBits(1);
            if (seqForceScreenContentTools > 0) {
                const seqChooseIntegerMv = bitstream.readBits(1);
                if (!seqChooseIntegerMv) bitstream.skipBits(1); // seq_force_integer_mv
            }
            if (enableOrderHint) bitstream.skipBits(3); // order_hint_bits_minus_1
        }
        bitstream.skipBits(1); // enable_superres
        bitstream.skipBits(1); // enable_cdef
        bitstream.skipBits(1); // enable_restoration
        // color_config()
        const highBitdepth = bitstream.readBits(1);
        let bitDepth = 8;
        if (seqProfile === 2 && highBitdepth) {
            const twelveBit = bitstream.readBits(1);
            bitDepth = twelveBit ? 12 : 10;
        } else if (seqProfile <= 2) bitDepth = highBitdepth ? 10 : 8;
        let monochrome = 0;
        if (seqProfile !== 1) monochrome = bitstream.readBits(1);
        let chromaSubsamplingX = 1;
        let chromaSubsamplingY = 1;
        let chromaSamplePosition = 0;
        if (!monochrome) {
            if (seqProfile === 0) {
                chromaSubsamplingX = 1;
                chromaSubsamplingY = 1;
            } else if (seqProfile === 1) {
                chromaSubsamplingX = 0;
                chromaSubsamplingY = 0;
            } else if (bitDepth === 12) {
                chromaSubsamplingX = bitstream.readBits(1);
                if (chromaSubsamplingX) chromaSubsamplingY = bitstream.readBits(1);
            }
            if (chromaSubsamplingX && chromaSubsamplingY) chromaSamplePosition = bitstream.readBits(2);
        }
        return {
            profile: seqProfile,
            level: seqLevel,
            tier: seqTier,
            bitDepth,
            monochrome,
            chromaSubsamplingX,
            chromaSubsamplingY,
            chromaSamplePosition
        };
    }
    return null;
};
const parseOpusIdentificationHeader = (bytes)=>{
    const view = (0, _miscJs.toDataView)(bytes);
    const outputChannelCount = view.getUint8(9);
    const preSkip = view.getUint16(10, true);
    const inputSampleRate = view.getUint32(12, true);
    const outputGain = view.getInt16(16, true);
    const channelMappingFamily = view.getUint8(18);
    let channelMappingTable = null;
    if (channelMappingFamily) channelMappingTable = bytes.subarray(19, 21 + outputChannelCount);
    return {
        outputChannelCount,
        preSkip,
        inputSampleRate,
        outputGain,
        channelMappingFamily,
        channelMappingTable
    };
};
// From https://datatracker.ietf.org/doc/html/rfc6716, in 48 kHz samples
const OPUS_FRAME_DURATION_TABLE = [
    480,
    960,
    1920,
    2880,
    480,
    960,
    1920,
    2880,
    480,
    960,
    1920,
    2880,
    480,
    960,
    480,
    960,
    120,
    240,
    480,
    960,
    120,
    240,
    480,
    960,
    120,
    240,
    480,
    960,
    120,
    240,
    480,
    960
];
const parseOpusTocByte = (packet)=>{
    const config = packet[0] >> 3;
    return {
        durationInSamples: OPUS_FRAME_DURATION_TABLE[config]
    };
};
const parseModesFromVorbisSetupPacket = (setupHeader)=>{
    // Verify that this is a Setup header.
    if (setupHeader.length < 7) throw new Error('Setup header is too short.');
    if (setupHeader[0] !== 5) throw new Error('Wrong packet type in Setup header.');
    const signature = String.fromCharCode(...setupHeader.slice(1, 7));
    if (signature !== 'vorbis') throw new Error('Invalid packet signature in Setup header.');
    // Reverse the entire buffer.
    const bufSize = setupHeader.length;
    const revBuffer = new Uint8Array(bufSize);
    for(let i = 0; i < bufSize; i++)revBuffer[i] = setupHeader[bufSize - 1 - i];
    // Initialize a Bitstream on the reversed buffer.
    const bitstream = new (0, _miscJs.Bitstream)(revBuffer);
    // --- Find the framing bit.
    // In FFmpeg code, we scan until get_bits1() returns 1.
    let gotFramingBit = 0;
    while(bitstream.getBitsLeft() > 97)if (bitstream.readBits(1) === 1) {
        gotFramingBit = bitstream.pos;
        break;
    }
    if (gotFramingBit === 0) throw new Error('Invalid Setup header: framing bit not found.');
    // --- Search backwards for a valid mode header.
    // We try to “guess” the number of modes by reading a fixed pattern.
    let modeCount = 0;
    let gotModeHeader = false;
    let lastModeCount = 0;
    while(bitstream.getBitsLeft() >= 97){
        const tempPos = bitstream.pos;
        const a = bitstream.readBits(8);
        const b = bitstream.readBits(16);
        const c = bitstream.readBits(16);
        // If a > 63 or b or c nonzero, assume we’ve gone too far.
        if (a > 63 || b !== 0 || c !== 0) {
            bitstream.pos = tempPos;
            break;
        }
        bitstream.skipBits(1);
        modeCount++;
        if (modeCount > 64) break;
        const bsClone = bitstream.clone();
        const candidate = bsClone.readBits(6) + 1;
        if (candidate === modeCount) {
            gotModeHeader = true;
            lastModeCount = modeCount;
        }
    }
    if (!gotModeHeader) throw new Error('Invalid Setup header: mode header not found.');
    if (lastModeCount > 63) throw new Error(`Unsupported mode count: ${lastModeCount}.`);
    const finalModeCount = lastModeCount;
    // --- Reinitialize the bitstream.
    bitstream.pos = 0;
    // Skip the bits up to the found framing bit.
    bitstream.skipBits(gotFramingBit);
    // --- Now read, for each mode (in reverse order), 40 bits then one bit.
    // That one bit is the mode blockflag.
    const modeBlockflags = Array(finalModeCount).fill(0);
    for(let i = finalModeCount - 1; i >= 0; i--){
        bitstream.skipBits(40);
        modeBlockflags[i] = bitstream.readBits(1);
    }
    return {
        modeBlockflags
    };
};
const determineVideoPacketType = (codec, decoderConfig, packetData)=>{
    switch(codec){
        case 'avc':
            {
                const nalUnits = extractAvcNalUnits(packetData, decoderConfig);
                let isKeyframe = nalUnits.some((x)=>extractNalUnitTypeForAvc(x) === AvcNalUnitType.IDR);
                if (!isKeyframe && (!(0, _miscJs.isChromium)() || (0, _miscJs.getChromiumVersion)() >= 144)) // In addition to IDR, Recovery Point SEI also counts as a valid H.264 keyframe by current consensus.
                // See https://github.com/w3c/webcodecs/issues/650 for the relevant discussion. WebKit and Firefox have
                // always supported them, but Chromium hasn't, therefore the (admittedly dirty) version check.
                for (const nalUnit of nalUnits){
                    const type = extractNalUnitTypeForAvc(nalUnit);
                    if (type !== AvcNalUnitType.SEI) continue;
                    const bytes = removeEmulationPreventionBytes(nalUnit);
                    let pos = 1; // Skip NALU header
                    // sei_rbsp()
                    do {
                        // sei_message()
                        let payloadType = 0;
                        while(true){
                            const nextByte = bytes[pos++];
                            if (nextByte === undefined) break;
                            payloadType += nextByte;
                            if (nextByte < 255) break;
                        }
                        let payloadSize = 0;
                        while(true){
                            const nextByte = bytes[pos++];
                            if (nextByte === undefined) break;
                            payloadSize += nextByte;
                            if (nextByte < 255) break;
                        }
                        // sei_payload()
                        const PAYLOAD_TYPE_RECOVERY_POINT = 6;
                        if (payloadType === PAYLOAD_TYPE_RECOVERY_POINT) {
                            const bitstream = new (0, _miscJs.Bitstream)(bytes);
                            bitstream.pos = 8 * pos;
                            const recoveryFrameCount = (0, _miscJs.readExpGolomb)(bitstream);
                            const exactMatchFlag = bitstream.readBits(1);
                            if (recoveryFrameCount === 0 && exactMatchFlag === 1) {
                                // https://github.com/w3c/webcodecs/pull/910
                                // "recovery_frame_cnt == 0 and exact_match_flag=1 in the SEI recovery payload"
                                isKeyframe = true;
                                break;
                            }
                        }
                        pos += payloadSize;
                    }while (pos < bytes.length - 1);
                }
                return isKeyframe ? 'key' : 'delta';
            }
        case 'hevc':
            {
                const nalUnits = extractHevcNalUnits(packetData, decoderConfig);
                const isKeyframe = nalUnits.some((x)=>{
                    const type = extractNalUnitTypeForHevc(x);
                    return HevcNalUnitType.BLA_W_LP <= type && type <= HevcNalUnitType.RSV_IRAP_VCL23;
                });
                return isKeyframe ? 'key' : 'delta';
            }
        case 'vp8':
            {
                // VP8, once again, by far the easiest to deal with.
                const frameType = packetData[0] & 1;
                return frameType === 0 ? 'key' : 'delta';
            }
        case 'vp9':
            {
                const bitstream = new (0, _miscJs.Bitstream)(packetData);
                if (bitstream.readBits(2) !== 2) return null;
                const profileLowBit = bitstream.readBits(1);
                const profileHighBit = bitstream.readBits(1);
                const profile = (profileHighBit << 1) + profileLowBit;
                // Skip reserved bit for profile 3
                if (profile === 3) bitstream.skipBits(1);
                const showExistingFrame = bitstream.readBits(1);
                if (showExistingFrame) return null;
                const frameType = bitstream.readBits(1);
                return frameType === 0 ? 'key' : 'delta';
            }
        case 'av1':
            {
                let reducedStillPictureHeader = false;
                for (const { type, data } of iterateAv1PacketObus(packetData)){
                    if (type === 1) {
                        const bitstream = new (0, _miscJs.Bitstream)(data);
                        bitstream.skipBits(4);
                        reducedStillPictureHeader = !!bitstream.readBits(1);
                    } else if (type === 3 // OBU_FRAME_HEADER
                     || type === 6 // OBU_FRAME
                     || type === 7 // OBU_REDUNDANT_FRAME_HEADER
                    ) {
                        if (reducedStillPictureHeader) return 'key';
                        const bitstream = new (0, _miscJs.Bitstream)(data);
                        const showExistingFrame = bitstream.readBits(1);
                        if (showExistingFrame) return null;
                        const frameType = bitstream.readBits(2);
                        return frameType === 0 ? 'key' : 'delta';
                    }
                }
                return null;
            }
        default:
            (0, _miscJs.assertNever)(codec);
            (0, _miscJs.assert)(false);
    }
};
var FlacBlockType;
(function(FlacBlockType) {
    FlacBlockType[FlacBlockType["STREAMINFO"] = 0] = "STREAMINFO";
    FlacBlockType[FlacBlockType["VORBIS_COMMENT"] = 4] = "VORBIS_COMMENT";
    FlacBlockType[FlacBlockType["PICTURE"] = 6] = "PICTURE";
})(FlacBlockType || (FlacBlockType = {}));
const readVorbisComments = (bytes, metadataTags)=>{
    // https://datatracker.ietf.org/doc/html/rfc7845#section-5.2
    const commentView = (0, _miscJs.toDataView)(bytes);
    let commentPos = 0;
    const vendorStringLength = commentView.getUint32(commentPos, true);
    commentPos += 4;
    const vendorString = (0, _miscJs.textDecoder).decode(bytes.subarray(commentPos, commentPos + vendorStringLength));
    commentPos += vendorStringLength;
    if (vendorStringLength > 0) {
        // Expose the vendor string in the raw metadata
        metadataTags.raw ??= {};
        metadataTags.raw['vendor'] ??= vendorString;
    }
    const listLength = commentView.getUint32(commentPos, true);
    commentPos += 4;
    // Loop over all metadata tags
    for(let i = 0; i < listLength; i++){
        const stringLength = commentView.getUint32(commentPos, true);
        commentPos += 4;
        const string = (0, _miscJs.textDecoder).decode(bytes.subarray(commentPos, commentPos + stringLength));
        commentPos += stringLength;
        const separatorIndex = string.indexOf('=');
        if (separatorIndex === -1) continue;
        const key = string.slice(0, separatorIndex).toUpperCase();
        const value = string.slice(separatorIndex + 1);
        metadataTags.raw ??= {};
        metadataTags.raw[key] ??= value;
        switch(key){
            case 'TITLE':
                metadataTags.title ??= value;
                break;
            case 'DESCRIPTION':
                metadataTags.description ??= value;
                break;
            case 'ARTIST':
                metadataTags.artist ??= value;
                break;
            case 'ALBUM':
                metadataTags.album ??= value;
                break;
            case 'ALBUMARTIST':
                metadataTags.albumArtist ??= value;
                break;
            case 'COMMENT':
                metadataTags.comment ??= value;
                break;
            case 'LYRICS':
                metadataTags.lyrics ??= value;
                break;
            case 'TRACKNUMBER':
                {
                    const parts = value.split('/');
                    const trackNum = Number.parseInt(parts[0], 10);
                    const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                    if (Number.isInteger(trackNum) && trackNum > 0) metadataTags.trackNumber ??= trackNum;
                    if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) metadataTags.tracksTotal ??= tracksTotal;
                }
                break;
            case 'TRACKTOTAL':
                {
                    const tracksTotal = Number.parseInt(value, 10);
                    if (Number.isInteger(tracksTotal) && tracksTotal > 0) metadataTags.tracksTotal ??= tracksTotal;
                }
                break;
            case 'DISCNUMBER':
                {
                    const parts = value.split('/');
                    const discNum = Number.parseInt(parts[0], 10);
                    const discsTotal = parts[1] && Number.parseInt(parts[1], 10);
                    if (Number.isInteger(discNum) && discNum > 0) metadataTags.discNumber ??= discNum;
                    if (discsTotal && Number.isInteger(discsTotal) && discsTotal > 0) metadataTags.discsTotal ??= discsTotal;
                }
                break;
            case 'DISCTOTAL':
                {
                    const discsTotal = Number.parseInt(value, 10);
                    if (Number.isInteger(discsTotal) && discsTotal > 0) metadataTags.discsTotal ??= discsTotal;
                }
                break;
            case 'DATE':
                {
                    const date = new Date(value);
                    if (!Number.isNaN(date.getTime())) metadataTags.date ??= date;
                }
                break;
            case 'GENRE':
                metadataTags.genre ??= value;
                break;
            case 'METADATA_BLOCK_PICTURE':
                {
                    // https://datatracker.ietf.org/doc/rfc9639/ Section 8.8
                    const decoded = (0, _miscJs.base64ToBytes)(value);
                    const view = (0, _miscJs.toDataView)(decoded);
                    const pictureType = view.getUint32(0, false);
                    const mediaTypeLength = view.getUint32(4, false);
                    const mediaType = String.fromCharCode(...decoded.subarray(8, 8 + mediaTypeLength)); // ASCII
                    const descriptionLength = view.getUint32(8 + mediaTypeLength, false);
                    const description = (0, _miscJs.textDecoder).decode(decoded.subarray(12 + mediaTypeLength, 12 + mediaTypeLength + descriptionLength));
                    const dataLength = view.getUint32(mediaTypeLength + descriptionLength + 28);
                    const data = decoded.subarray(mediaTypeLength + descriptionLength + 32, mediaTypeLength + descriptionLength + 32 + dataLength);
                    metadataTags.images ??= [];
                    metadataTags.images.push({
                        data,
                        mimeType: mediaType,
                        kind: pictureType === 3 ? 'coverFront' : pictureType === 4 ? 'coverBack' : 'unknown',
                        name: undefined,
                        description: description || undefined
                    });
                }
                break;
        }
    }
};
const createVorbisComments = (headerBytes, tags, writeImages)=>{
    // https://datatracker.ietf.org/doc/html/rfc7845#section-5.2
    const commentHeaderParts = [
        headerBytes
    ];
    const vendorString = 'Mediabunny';
    const encodedVendorString = (0, _miscJs.textEncoder).encode(vendorString);
    let currentBuffer = new Uint8Array(4 + encodedVendorString.length);
    let currentView = new DataView(currentBuffer.buffer);
    currentView.setUint32(0, encodedVendorString.length, true);
    currentBuffer.set(encodedVendorString, 4);
    commentHeaderParts.push(currentBuffer);
    const writtenTags = new Set();
    const addCommentTag = (key, value)=>{
        const joined = `${key}=${value}`;
        const encoded = (0, _miscJs.textEncoder).encode(joined);
        currentBuffer = new Uint8Array(4 + encoded.length);
        currentView = new DataView(currentBuffer.buffer);
        currentView.setUint32(0, encoded.length, true);
        currentBuffer.set(encoded, 4);
        commentHeaderParts.push(currentBuffer);
        writtenTags.add(key);
    };
    for (const { key, value } of (0, _miscJs.keyValueIterator)(tags))switch(key){
        case 'title':
            addCommentTag('TITLE', value);
            break;
        case 'description':
            addCommentTag('DESCRIPTION', value);
            break;
        case 'artist':
            addCommentTag('ARTIST', value);
            break;
        case 'album':
            addCommentTag('ALBUM', value);
            break;
        case 'albumArtist':
            addCommentTag('ALBUMARTIST', value);
            break;
        case 'genre':
            addCommentTag('GENRE', value);
            break;
        case 'date':
            {
                const rawVersion = tags.raw?.['DATE'] ?? tags.raw?.['date'];
                if (rawVersion && typeof rawVersion === 'string') addCommentTag('DATE', rawVersion);
                else addCommentTag('DATE', value.toISOString().slice(0, 10));
            }
            break;
        case 'comment':
            addCommentTag('COMMENT', value);
            break;
        case 'lyrics':
            addCommentTag('LYRICS', value);
            break;
        case 'trackNumber':
            addCommentTag('TRACKNUMBER', value.toString());
            break;
        case 'tracksTotal':
            addCommentTag('TRACKTOTAL', value.toString());
            break;
        case 'discNumber':
            addCommentTag('DISCNUMBER', value.toString());
            break;
        case 'discsTotal':
            addCommentTag('DISCTOTAL', value.toString());
            break;
        case 'images':
            // For example, in .flac, we put the pictures in a different section,
            // not in the Vorbis comment header.
            if (!writeImages) break;
            for (const image of value){
                // https://datatracker.ietf.org/doc/rfc9639/ Section 8.8
                const pictureType = image.kind === 'coverFront' ? 3 : image.kind === 'coverBack' ? 4 : 0;
                const encodedMediaType = new Uint8Array(image.mimeType.length);
                for(let i = 0; i < image.mimeType.length; i++)encodedMediaType[i] = image.mimeType.charCodeAt(i);
                const encodedDescription = (0, _miscJs.textEncoder).encode(image.description ?? '');
                const buffer = new Uint8Array(8 // MIME type length
                 + encodedMediaType.length // MIME type
                 + 4 // Description length
                 + encodedDescription.length // Description
                 + 16 // Width, height, color depth, number of colors
                 + 4 // Picture data length
                 + image.data.length);
                const view = (0, _miscJs.toDataView)(buffer);
                view.setUint32(0, pictureType, false);
                view.setUint32(4, encodedMediaType.length, false);
                buffer.set(encodedMediaType, 8);
                view.setUint32(8 + encodedMediaType.length, encodedDescription.length, false);
                buffer.set(encodedDescription, 12 + encodedMediaType.length);
                // Skip a bunch of fields (width, height, color depth, number of colors)
                view.setUint32(28 + encodedMediaType.length + encodedDescription.length, image.data.length, false);
                buffer.set(image.data, 32 + encodedMediaType.length + encodedDescription.length);
                const encoded = (0, _miscJs.bytesToBase64)(buffer);
                addCommentTag('METADATA_BLOCK_PICTURE', encoded);
            }
            break;
        case 'raw':
            break;
        default:
            (0, _miscJs.assertNever)(key);
    }
    if (tags.raw) for(const key in tags.raw){
        const value = tags.raw[key] ?? tags.raw[key.toLowerCase()];
        if (key === 'vendor' || value == null || writtenTags.has(key)) continue;
        if (typeof value === 'string') addCommentTag(key, value);
    }
    const listLengthBuffer = new Uint8Array(4);
    (0, _miscJs.toDataView)(listLengthBuffer).setUint32(0, writtenTags.size, true);
    commentHeaderParts.splice(2, 0, listLengthBuffer); // Insert after the header and vendor section
    // Merge all comment header parts into a single buffer
    const commentHeaderLength = commentHeaderParts.reduce((a, b)=>a + b.length, 0);
    const commentHeader = new Uint8Array(commentHeaderLength);
    let pos = 0;
    for (const part of commentHeaderParts){
        commentHeader.set(part, pos);
        pos += part.length;
    }
    return commentHeader;
};

},{"./codec.js":"4oSIO","./misc.js":"kkhLS","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"dZcnn":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Demuxer", ()=>Demuxer);
class Demuxer {
    constructor(input){
        this.input = input;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"dPVVR":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Represents a media track in an input file.
 * @group Input files & tracks
 * @public
 */ parcelHelpers.export(exports, "InputTrack", ()=>InputTrack);
/**
 * Represents a video track in an input file.
 * @group Input files & tracks
 * @public
 */ parcelHelpers.export(exports, "InputVideoTrack", ()=>InputVideoTrack);
/**
 * Represents an audio track in an input file.
 * @group Input files & tracks
 * @public
 */ parcelHelpers.export(exports, "InputAudioTrack", ()=>InputAudioTrack);
var _codecDataJs = require("./codec-data.js");
var _customCoderJs = require("./custom-coder.js");
var _mediaSinkJs = require("./media-sink.js");
var _miscJs = require("./misc.js");
var _packetJs = require("./packet.js");
class InputTrack {
    /** @internal */ constructor(input, backing){
        this.input = input;
        this._backing = backing;
    }
    /** Returns true if and only if this track is a video track. */ isVideoTrack() {
        return this instanceof InputVideoTrack;
    }
    /** Returns true if and only if this track is an audio track. */ isAudioTrack() {
        return this instanceof InputAudioTrack;
    }
    /** The unique ID of this track in the input file. */ get id() {
        return this._backing.getId();
    }
    /**
     * The identifier of the codec used internally by the container. It is not homogenized by Mediabunny
     * and depends entirely on the container format.
     *
     * This field can be used to determine the codec of a track in case Mediabunny doesn't know that codec.
     *
     * - For ISOBMFF files, this field returns the name of the Sample Description Box (e.g. `'avc1'`).
     * - For Matroska files, this field returns the value of the `CodecID` element.
     * - For WAVE files, this field returns the value of the format tag in the `'fmt '` chunk.
     * - For ADTS files, this field contains the `MPEG-4 Audio Object Type`.
     * - In all other cases, this field is `null`.
     */ get internalCodecId() {
        return this._backing.getInternalCodecId();
    }
    /**
     * The ISO 639-2/T language code for this track. If the language is unknown, this field is `'und'` (undetermined).
     */ get languageCode() {
        return this._backing.getLanguageCode();
    }
    /** A user-defined name for this track. */ get name() {
        return this._backing.getName();
    }
    /**
     * A positive number x such that all timestamps and durations of all packets of this track are
     * integer multiples of 1/x.
     */ get timeResolution() {
        return this._backing.getTimeResolution();
    }
    /** The track's disposition, i.e. information about its intended usage. */ get disposition() {
        return this._backing.getDisposition();
    }
    /**
     * Returns the start timestamp of the first packet of this track, in seconds. While often near zero, this value
     * may be positive or even negative. A negative starting timestamp means the track's timing has been offset. Samples
     * with a negative timestamp should not be presented.
     */ getFirstTimestamp() {
        return this._backing.getFirstTimestamp();
    }
    /** Returns the end timestamp of the last packet of this track, in seconds. */ computeDuration() {
        return this._backing.computeDuration();
    }
    /**
     * Computes aggregate packet statistics for this track, such as average packet rate or bitrate.
     *
     * @param targetPacketCount - This optional parameter sets a target for how many packets this method must have
     * looked at before it can return early; this means, you can use it to aggregate only a subset (prefix) of all
     * packets. This is very useful for getting a great estimate of video frame rate without having to scan through the
     * entire file.
     */ async computePacketStats(targetPacketCount = Infinity) {
        const sink = new (0, _mediaSinkJs.EncodedPacketSink)(this);
        let startTimestamp = Infinity;
        let endTimestamp = -Infinity;
        let packetCount = 0;
        let totalPacketBytes = 0;
        for await (const packet of sink.packets(undefined, undefined, {
            metadataOnly: true
        })){
            if (packetCount >= targetPacketCount && packet.timestamp >= endTimestamp) break;
            startTimestamp = Math.min(startTimestamp, packet.timestamp);
            endTimestamp = Math.max(endTimestamp, packet.timestamp + packet.duration);
            packetCount++;
            totalPacketBytes += packet.byteLength;
        }
        return {
            packetCount,
            averagePacketRate: packetCount ? Number((packetCount / (endTimestamp - startTimestamp)).toPrecision(16)) : 0,
            averageBitrate: packetCount ? Number((8 * totalPacketBytes / (endTimestamp - startTimestamp)).toPrecision(16)) : 0
        };
    }
}
class InputVideoTrack extends InputTrack {
    /** @internal */ constructor(input, backing){
        super(input, backing);
        this._backing = backing;
    }
    get type() {
        return 'video';
    }
    get codec() {
        return this._backing.getCodec();
    }
    /** The width in pixels of the track's coded samples, before any transformations or rotations. */ get codedWidth() {
        return this._backing.getCodedWidth();
    }
    /** The height in pixels of the track's coded samples, before any transformations or rotations. */ get codedHeight() {
        return this._backing.getCodedHeight();
    }
    /** The angle in degrees by which the track's frames should be rotated (clockwise). */ get rotation() {
        return this._backing.getRotation();
    }
    /** The width in pixels of the track's frames after rotation. */ get displayWidth() {
        const rotation = this._backing.getRotation();
        return rotation % 180 === 0 ? this._backing.getCodedWidth() : this._backing.getCodedHeight();
    }
    /** The height in pixels of the track's frames after rotation. */ get displayHeight() {
        const rotation = this._backing.getRotation();
        return rotation % 180 === 0 ? this._backing.getCodedHeight() : this._backing.getCodedWidth();
    }
    /** Returns the color space of the track's samples. */ getColorSpace() {
        return this._backing.getColorSpace();
    }
    /** If this method returns true, the track's samples use a high dynamic range (HDR). */ async hasHighDynamicRange() {
        const colorSpace = await this._backing.getColorSpace();
        return colorSpace.primaries === 'bt2020' || colorSpace.primaries === 'smpte432' || colorSpace.transfer === 'pg' || colorSpace.transfer === 'hlg' || colorSpace.matrix === 'bt2020-ncl';
    }
    /** Checks if this track may contain transparent samples with alpha data. */ canBeTransparent() {
        return this._backing.canBeTransparent();
    }
    /**
     * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#video-decoder-config) for decoding the
     * track's packets using a [`VideoDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder). Returns
     * null if the track's codec is unknown.
     */ getDecoderConfig() {
        return this._backing.getDecoderConfig();
    }
    async getCodecParameterString() {
        const decoderConfig = await this._backing.getDecoderConfig();
        return decoderConfig?.codec ?? null;
    }
    async canDecode() {
        try {
            const decoderConfig = await this._backing.getDecoderConfig();
            if (!decoderConfig) return false;
            const codec = this._backing.getCodec();
            (0, _miscJs.assert)(codec !== null);
            if ((0, _customCoderJs.customVideoDecoders).some((x)=>x.supports(codec, decoderConfig))) return true;
            if (typeof VideoDecoder === 'undefined') return false;
            const support = await VideoDecoder.isConfigSupported(decoderConfig);
            return support.supported === true;
        } catch (error) {
            console.error('Error during decodability check:', error);
            return false;
        }
    }
    async determinePacketType(packet) {
        if (!(packet instanceof (0, _packetJs.EncodedPacket))) throw new TypeError('packet must be an EncodedPacket.');
        if (packet.isMetadataOnly) throw new TypeError('packet must not be metadata-only to determine its type.');
        if (this.codec === null) return null;
        const decoderConfig = await this.getDecoderConfig();
        (0, _miscJs.assert)(decoderConfig);
        return (0, _codecDataJs.determineVideoPacketType)(this.codec, decoderConfig, packet.data);
    }
}
class InputAudioTrack extends InputTrack {
    /** @internal */ constructor(input, backing){
        super(input, backing);
        this._backing = backing;
    }
    get type() {
        return 'audio';
    }
    get codec() {
        return this._backing.getCodec();
    }
    /** The number of audio channels in the track. */ get numberOfChannels() {
        return this._backing.getNumberOfChannels();
    }
    /** The track's audio sample rate in hertz. */ get sampleRate() {
        return this._backing.getSampleRate();
    }
    /**
     * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#audio-decoder-config) for decoding the
     * track's packets using an [`AudioDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/AudioDecoder). Returns
     * null if the track's codec is unknown.
     */ getDecoderConfig() {
        return this._backing.getDecoderConfig();
    }
    async getCodecParameterString() {
        const decoderConfig = await this._backing.getDecoderConfig();
        return decoderConfig?.codec ?? null;
    }
    async canDecode() {
        try {
            const decoderConfig = await this._backing.getDecoderConfig();
            if (!decoderConfig) return false;
            const codec = this._backing.getCodec();
            (0, _miscJs.assert)(codec !== null);
            if ((0, _customCoderJs.customAudioDecoders).some((x)=>x.supports(codec, decoderConfig))) return true;
            if (decoderConfig.codec.startsWith('pcm-')) return true; // Since we decode it ourselves
            else {
                if (typeof AudioDecoder === 'undefined') return false;
                const support = await AudioDecoder.isConfigSupported(decoderConfig);
                return support.supported === true;
            }
        } catch (error) {
            console.error('Error during decodability check:', error);
            return false;
        }
    }
    async determinePacketType(packet) {
        if (!(packet instanceof (0, _packetJs.EncodedPacket))) throw new TypeError('packet must be an EncodedPacket.');
        if (this.codec === null) return null;
        return 'key'; // No audio codec with delta packets
    }
}

},{"./codec-data.js":"bzpVB","./custom-coder.js":"95k1I","./media-sink.js":"6Ym7M","./misc.js":"kkhLS","./packet.js":"esYjd","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"95k1I":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ /**
 * Base class for custom video decoders. To add your own custom video decoder, extend this class, implement the
 * abstract methods and static `supports` method, and register the decoder using {@link registerDecoder}.
 * @group Custom coders
 * @public
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CustomVideoDecoder", ()=>CustomVideoDecoder);
/**
 * Base class for custom audio decoders. To add your own custom audio decoder, extend this class, implement the
 * abstract methods and static `supports` method, and register the decoder using {@link registerDecoder}.
 * @group Custom coders
 * @public
 */ parcelHelpers.export(exports, "CustomAudioDecoder", ()=>CustomAudioDecoder);
/**
 * Base class for custom video encoders. To add your own custom video encoder, extend this class, implement the
 * abstract methods and static `supports` method, and register the encoder using {@link registerEncoder}.
 * @group Custom coders
 * @public
 */ parcelHelpers.export(exports, "CustomVideoEncoder", ()=>CustomVideoEncoder);
/**
 * Base class for custom audio encoders. To add your own custom audio encoder, extend this class, implement the
 * abstract methods and static `supports` method, and register the encoder using {@link registerEncoder}.
 * @group Custom coders
 * @public
 */ parcelHelpers.export(exports, "CustomAudioEncoder", ()=>CustomAudioEncoder);
parcelHelpers.export(exports, "customVideoDecoders", ()=>customVideoDecoders);
parcelHelpers.export(exports, "customAudioDecoders", ()=>customAudioDecoders);
parcelHelpers.export(exports, "customVideoEncoders", ()=>customVideoEncoders);
parcelHelpers.export(exports, "customAudioEncoders", ()=>customAudioEncoders);
parcelHelpers.export(exports, "registerDecoder", ()=>registerDecoder);
parcelHelpers.export(exports, "registerEncoder", ()=>registerEncoder);
class CustomVideoDecoder {
    /** Returns true if and only if the decoder can decode the given codec configuration. */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static supports(codec, config) {
        return false;
    }
}
class CustomAudioDecoder {
    /** Returns true if and only if the decoder can decode the given codec configuration. */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static supports(codec, config) {
        return false;
    }
}
class CustomVideoEncoder {
    /** Returns true if and only if the encoder can encode the given codec configuration. */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static supports(codec, config) {
        return false;
    }
}
class CustomAudioEncoder {
    /** Returns true if and only if the encoder can encode the given codec configuration. */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static supports(codec, config) {
        return false;
    }
}
const customVideoDecoders = [];
const customAudioDecoders = [];
const customVideoEncoders = [];
const customAudioEncoders = [];
const registerDecoder = (decoder)=>{
    if (decoder.prototype instanceof CustomVideoDecoder) {
        const casted = decoder;
        if (customVideoDecoders.includes(casted)) {
            console.warn('Video decoder already registered.');
            return;
        }
        customVideoDecoders.push(casted);
    } else if (decoder.prototype instanceof CustomAudioDecoder) {
        const casted = decoder;
        if (customAudioDecoders.includes(casted)) {
            console.warn('Audio decoder already registered.');
            return;
        }
        customAudioDecoders.push(casted);
    } else throw new TypeError('Decoder must be a CustomVideoDecoder or CustomAudioDecoder.');
};
const registerEncoder = (encoder)=>{
    if (encoder.prototype instanceof CustomVideoEncoder) {
        const casted = encoder;
        if (customVideoEncoders.includes(casted)) {
            console.warn('Video encoder already registered.');
            return;
        }
        customVideoEncoders.push(casted);
    } else if (encoder.prototype instanceof CustomAudioEncoder) {
        const casted = encoder;
        if (customAudioEncoders.includes(casted)) {
            console.warn('Audio encoder already registered.');
            return;
        }
        customAudioEncoders.push(casted);
    } else throw new TypeError('Encoder must be a CustomVideoEncoder or CustomAudioEncoder.');
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"6Ym7M":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Sink for retrieving encoded packets from an input track.
 * @group Media sinks
 * @public
 */ parcelHelpers.export(exports, "EncodedPacketSink", ()=>EncodedPacketSink);
/**
 * Base class for decoded media sample sinks.
 * @group Media sinks
 * @public
 */ parcelHelpers.export(exports, "BaseMediaSampleSink", ()=>BaseMediaSampleSink);
/**
 * A sink that retrieves decoded video samples (video frames) from a video track.
 * @group Media sinks
 * @public
 */ parcelHelpers.export(exports, "VideoSampleSink", ()=>VideoSampleSink);
/**
 * A sink that renders video samples (frames) of the given video track to canvases. This is often more useful than
 * directly retrieving frames, as it comes with common preprocessing steps such as resizing or applying rotation
 * metadata.
 *
 * This sink will yield `HTMLCanvasElement`s when in a DOM context, and `OffscreenCanvas`es otherwise.
 *
 * @group Media sinks
 * @public
 */ parcelHelpers.export(exports, "CanvasSink", ()=>CanvasSink);
/**
 * Sink for retrieving decoded audio samples from an audio track.
 * @group Media sinks
 * @public
 */ parcelHelpers.export(exports, "AudioSampleSink", ()=>AudioSampleSink);
/**
 * A sink that retrieves decoded audio samples from an audio track and converts them to `AudioBuffer` instances. This is
 * often more useful than directly retrieving audio samples, as audio buffers can be directly used with the
 * Web Audio API.
 * @group Media sinks
 * @public
 */ parcelHelpers.export(exports, "AudioBufferSink", ()=>AudioBufferSink);
var _codecJs = require("./codec.js");
var _codecDataJs = require("./codec-data.js");
var _customCoderJs = require("./custom-coder.js");
var _inputJs = require("./input.js");
var _inputTrackJs = require("./input-track.js");
var _miscJs = require("./misc.js");
var _packetJs = require("./packet.js");
var _pcmJs = require("./pcm.js");
var _sampleJs = require("./sample.js");
const validatePacketRetrievalOptions = (options)=>{
    if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
    if (options.metadataOnly !== undefined && typeof options.metadataOnly !== 'boolean') throw new TypeError('options.metadataOnly, when defined, must be a boolean.');
    if (options.verifyKeyPackets !== undefined && typeof options.verifyKeyPackets !== 'boolean') throw new TypeError('options.verifyKeyPackets, when defined, must be a boolean.');
    if (options.verifyKeyPackets && options.metadataOnly) throw new TypeError('options.verifyKeyPackets and options.metadataOnly cannot be enabled together.');
};
const validateTimestamp = (timestamp)=>{
    if (!(0, _miscJs.isNumber)(timestamp)) throw new TypeError('timestamp must be a number.'); // It can be non-finite, that's fine
};
const maybeFixPacketType = (track, promise, options)=>{
    if (options.verifyKeyPackets) return promise.then(async (packet)=>{
        if (!packet || packet.type === 'delta') return packet;
        const determinedType = await track.determinePacketType(packet);
        if (determinedType) // @ts-expect-error Technically readonly
        packet.type = determinedType;
        return packet;
    });
    else return promise;
};
class EncodedPacketSink {
    /** Creates a new {@link EncodedPacketSink} for the given {@link InputTrack}. */ constructor(track){
        if (!(track instanceof (0, _inputTrackJs.InputTrack))) throw new TypeError('track must be an InputTrack.');
        this._track = track;
    }
    /**
     * Retrieves the track's first packet (in decode order), or null if it has no packets. The first packet is very
     * likely to be a key packet.
     */ getFirstPacket(options = {}) {
        validatePacketRetrievalOptions(options);
        if (this._track.input._disposed) throw new (0, _inputJs.InputDisposedError)();
        return maybeFixPacketType(this._track, this._track._backing.getFirstPacket(options), options);
    }
    /**
     * Retrieves the packet corresponding to the given timestamp, in seconds. More specifically, returns the last packet
     * (in presentation order) with a start timestamp less than or equal to the given timestamp. This method can be
     * used to retrieve a track's last packet using `getPacket(Infinity)`. The method returns null if the timestamp
     * is before the first packet in the track.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */ getPacket(timestamp, options = {}) {
        validateTimestamp(timestamp);
        validatePacketRetrievalOptions(options);
        if (this._track.input._disposed) throw new (0, _inputJs.InputDisposedError)();
        return maybeFixPacketType(this._track, this._track._backing.getPacket(timestamp, options), options);
    }
    /**
     * Retrieves the packet following the given packet (in decode order), or null if the given packet is the
     * last packet.
     */ getNextPacket(packet, options = {}) {
        if (!(packet instanceof (0, _packetJs.EncodedPacket))) throw new TypeError('packet must be an EncodedPacket.');
        validatePacketRetrievalOptions(options);
        if (this._track.input._disposed) throw new (0, _inputJs.InputDisposedError)();
        return maybeFixPacketType(this._track, this._track._backing.getNextPacket(packet, options), options);
    }
    /**
     * Retrieves the key packet corresponding to the given timestamp, in seconds. More specifically, returns the last
     * key packet (in presentation order) with a start timestamp less than or equal to the given timestamp. A key packet
     * is a packet that doesn't require previous packets to be decoded. This method can be used to retrieve a track's
     * last key packet using `getKeyPacket(Infinity)`. The method returns null if the timestamp is before the first
     * key packet in the track.
     *
     * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */ async getKeyPacket(timestamp, options = {}) {
        validateTimestamp(timestamp);
        validatePacketRetrievalOptions(options);
        if (this._track.input._disposed) throw new (0, _inputJs.InputDisposedError)();
        if (!options.verifyKeyPackets) return this._track._backing.getKeyPacket(timestamp, options);
        const packet = await this._track._backing.getKeyPacket(timestamp, options);
        if (!packet) return packet;
        (0, _miscJs.assert)(packet.type === 'key');
        const determinedType = await this._track.determinePacketType(packet);
        if (determinedType === 'delta') // Try returning the previous key packet (in hopes that it's actually a key packet)
        return this.getKeyPacket(packet.timestamp - 1 / this._track.timeResolution, options);
        return packet;
    }
    /**
     * Retrieves the key packet following the given packet (in decode order), or null if the given packet is the last
     * key packet.
     *
     * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
     */ async getNextKeyPacket(packet, options = {}) {
        if (!(packet instanceof (0, _packetJs.EncodedPacket))) throw new TypeError('packet must be an EncodedPacket.');
        validatePacketRetrievalOptions(options);
        if (this._track.input._disposed) throw new (0, _inputJs.InputDisposedError)();
        if (!options.verifyKeyPackets) return this._track._backing.getNextKeyPacket(packet, options);
        const nextPacket = await this._track._backing.getNextKeyPacket(packet, options);
        if (!nextPacket) return nextPacket;
        (0, _miscJs.assert)(nextPacket.type === 'key');
        const determinedType = await this._track.determinePacketType(nextPacket);
        if (determinedType === 'delta') // Try returning the next key packet (in hopes that it's actually a key packet)
        return this.getNextKeyPacket(nextPacket, options);
        return nextPacket;
    }
    /**
     * Creates an async iterator that yields the packets in this track in decode order. To enable fast iteration, this
     * method will intelligently preload packets based on the speed of the consumer.
     *
     * @param startPacket - (optional) The packet from which iteration should begin. This packet will also be yielded.
     * @param endTimestamp - (optional) The timestamp at which iteration should end. This packet will _not_ be yielded.
     */ packets(startPacket, endPacket, options = {}) {
        if (startPacket !== undefined && !(startPacket instanceof (0, _packetJs.EncodedPacket))) throw new TypeError('startPacket must be an EncodedPacket.');
        if (startPacket !== undefined && startPacket.isMetadataOnly && !options?.metadataOnly) throw new TypeError('startPacket can only be metadata-only if options.metadataOnly is enabled.');
        if (endPacket !== undefined && !(endPacket instanceof (0, _packetJs.EncodedPacket))) throw new TypeError('endPacket must be an EncodedPacket.');
        validatePacketRetrievalOptions(options);
        if (this._track.input._disposed) throw new (0, _inputJs.InputDisposedError)();
        const packetQueue = [];
        let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0, _miscJs.promiseWithResolvers)();
        let { promise: queueDequeue, resolve: onQueueDequeue } = (0, _miscJs.promiseWithResolvers)();
        let ended = false;
        let terminated = false;
        // This stores errors that are "out of band" in the sense that they didn't occur in the normal flow of this
        // method but instead in a different context. This error should not go unnoticed and must be bubbled up to
        // the consumer.
        let outOfBandError = null;
        const timestamps = [];
        // The queue should always be big enough to hold 1 second worth of packets
        const maxQueueSize = ()=>Math.max(2, timestamps.length);
        // The following is the "pump" process that keeps pumping packets into the queue
        (async ()=>{
            let packet = startPacket ?? await this.getFirstPacket(options);
            while(packet && !terminated && !this._track.input._disposed){
                if (endPacket && packet.sequenceNumber >= endPacket?.sequenceNumber) break;
                if (packetQueue.length > maxQueueSize()) {
                    ({ promise: queueDequeue, resolve: onQueueDequeue } = (0, _miscJs.promiseWithResolvers)());
                    await queueDequeue;
                    continue;
                }
                packetQueue.push(packet);
                onQueueNotEmpty();
                ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0, _miscJs.promiseWithResolvers)());
                packet = await this.getNextPacket(packet, options);
            }
            ended = true;
            onQueueNotEmpty();
        })().catch((error)=>{
            if (!outOfBandError) {
                outOfBandError = error;
                onQueueNotEmpty();
            }
        });
        const track = this._track;
        return {
            async next () {
                while(true){
                    if (track.input._disposed) throw new (0, _inputJs.InputDisposedError)();
                    else if (terminated) return {
                        value: undefined,
                        done: true
                    };
                    else if (outOfBandError) throw outOfBandError;
                    else if (packetQueue.length > 0) {
                        const value = packetQueue.shift();
                        const now = performance.now();
                        timestamps.push(now);
                        while(timestamps.length > 0 && now - timestamps[0] >= 1000)timestamps.shift();
                        onQueueDequeue();
                        return {
                            value,
                            done: false
                        };
                    } else if (ended) return {
                        value: undefined,
                        done: true
                    };
                    else await queueNotEmpty;
                }
            },
            async return () {
                terminated = true;
                onQueueDequeue();
                onQueueNotEmpty();
                return {
                    value: undefined,
                    done: true
                };
            },
            async throw (error) {
                throw error;
            },
            [Symbol.asyncIterator] () {
                return this;
            }
        };
    }
}
class DecoderWrapper {
    constructor(onSample, onError){
        this.onSample = onSample;
        this.onError = onError;
    }
}
class BaseMediaSampleSink {
    /** @internal */ mediaSamplesInRange(startTimestamp = 0, endTimestamp = Infinity) {
        validateTimestamp(startTimestamp);
        validateTimestamp(endTimestamp);
        const sampleQueue = [];
        let firstSampleQueued = false;
        let lastSample = null;
        let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0, _miscJs.promiseWithResolvers)();
        let { promise: queueDequeue, resolve: onQueueDequeue } = (0, _miscJs.promiseWithResolvers)();
        let decoderIsFlushed = false;
        let ended = false;
        let terminated = false;
        // This stores errors that are "out of band" in the sense that they didn't occur in the normal flow of this
        // method but instead in a different context. This error should not go unnoticed and must be bubbled up to
        // the consumer.
        let outOfBandError = null;
        // The following is the "pump" process that keeps pumping packets into the decoder
        (async ()=>{
            const decoderError = new Error();
            const decoder = await this._createDecoder((sample)=>{
                onQueueDequeue();
                if (sample.timestamp >= endTimestamp) ended = true;
                if (ended) {
                    sample.close();
                    return;
                }
                if (lastSample) {
                    if (sample.timestamp > startTimestamp) {
                        // We don't know ahead of time what the first first is. This is because the first first is the
                        // last first whose timestamp is less than or equal to the start timestamp. Therefore we need to
                        // wait for the first first after the start timestamp, and then we'll know that the previous
                        // first was the first first.
                        sampleQueue.push(lastSample);
                        firstSampleQueued = true;
                    } else lastSample.close();
                }
                if (sample.timestamp >= startTimestamp) {
                    sampleQueue.push(sample);
                    firstSampleQueued = true;
                }
                lastSample = firstSampleQueued ? null : sample;
                if (sampleQueue.length > 0) {
                    onQueueNotEmpty();
                    ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0, _miscJs.promiseWithResolvers)());
                }
            }, (error)=>{
                if (!outOfBandError) {
                    error.stack = decoderError.stack; // Provide a more useful stack trace
                    outOfBandError = error;
                    onQueueNotEmpty();
                }
            });
            const packetSink = this._createPacketSink();
            const keyPacket = await packetSink.getKeyPacket(startTimestamp, {
                verifyKeyPackets: true
            }) ?? await packetSink.getFirstPacket();
            let currentPacket = keyPacket;
            let endPacket = undefined;
            if (endTimestamp < Infinity) {
                // When an end timestamp is set, we cannot simply use that for the packet iterator due to out-of-order
                // frames (B-frames). Instead, we'll need to keep decoding packets until we get a frame that exceeds
                // this end time. However, we can still put a bound on it: Since key frames are by definition never
                // out of order, we can stop at the first key frame after the end timestamp.
                const packet = await packetSink.getPacket(endTimestamp);
                const keyPacket = !packet ? null : packet.type === 'key' && packet.timestamp === endTimestamp ? packet : await packetSink.getNextKeyPacket(packet, {
                    verifyKeyPackets: true
                });
                if (keyPacket) endPacket = keyPacket;
            }
            const packets = packetSink.packets(keyPacket ?? undefined, endPacket);
            await packets.next(); // Skip the start packet as we already have it
            while(currentPacket && !ended && !this._track.input._disposed){
                const maxQueueSize = computeMaxQueueSize(sampleQueue.length);
                if (sampleQueue.length + decoder.getDecodeQueueSize() > maxQueueSize) {
                    ({ promise: queueDequeue, resolve: onQueueDequeue } = (0, _miscJs.promiseWithResolvers)());
                    await queueDequeue;
                    continue;
                }
                decoder.decode(currentPacket);
                const packetResult = await packets.next();
                if (packetResult.done) break;
                currentPacket = packetResult.value;
            }
            await packets.return();
            if (!terminated && !this._track.input._disposed) await decoder.flush();
            decoder.close();
            if (!firstSampleQueued && lastSample) sampleQueue.push(lastSample);
            decoderIsFlushed = true;
            onQueueNotEmpty(); // To unstuck the generator
        })().catch((error)=>{
            if (!outOfBandError) {
                outOfBandError = error;
                onQueueNotEmpty();
            }
        });
        const track = this._track;
        const closeSamples = ()=>{
            lastSample?.close();
            for (const sample of sampleQueue)sample.close();
        };
        return {
            async next () {
                while(true){
                    if (track.input._disposed) {
                        closeSamples();
                        throw new (0, _inputJs.InputDisposedError)();
                    } else if (terminated) return {
                        value: undefined,
                        done: true
                    };
                    else if (outOfBandError) {
                        closeSamples();
                        throw outOfBandError;
                    } else if (sampleQueue.length > 0) {
                        const value = sampleQueue.shift();
                        onQueueDequeue();
                        return {
                            value,
                            done: false
                        };
                    } else if (!decoderIsFlushed) await queueNotEmpty;
                    else return {
                        value: undefined,
                        done: true
                    };
                }
            },
            async return () {
                terminated = true;
                ended = true;
                onQueueDequeue();
                onQueueNotEmpty();
                closeSamples();
                return {
                    value: undefined,
                    done: true
                };
            },
            async throw (error) {
                throw error;
            },
            [Symbol.asyncIterator] () {
                return this;
            }
        };
    }
    /** @internal */ mediaSamplesAtTimestamps(timestamps) {
        (0, _miscJs.validateAnyIterable)(timestamps);
        const timestampIterator = (0, _miscJs.toAsyncIterator)(timestamps);
        const timestampsOfInterest = [];
        const sampleQueue = [];
        let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0, _miscJs.promiseWithResolvers)();
        let { promise: queueDequeue, resolve: onQueueDequeue } = (0, _miscJs.promiseWithResolvers)();
        let decoderIsFlushed = false;
        let terminated = false;
        // This stores errors that are "out of band" in the sense that they didn't occur in the normal flow of this
        // method but instead in a different context. This error should not go unnoticed and must be bubbled up to
        // the consumer.
        let outOfBandError = null;
        const pushToQueue = (sample)=>{
            sampleQueue.push(sample);
            onQueueNotEmpty();
            ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0, _miscJs.promiseWithResolvers)());
        };
        // The following is the "pump" process that keeps pumping packets into the decoder
        (async ()=>{
            const decoderError = new Error();
            const decoder = await this._createDecoder((sample)=>{
                onQueueDequeue();
                if (terminated) {
                    sample.close();
                    return;
                }
                let sampleUses = 0;
                while(timestampsOfInterest.length > 0 && sample.timestamp - timestampsOfInterest[0] > -0.0000000001 // Give it a little epsilon
                ){
                    sampleUses++;
                    timestampsOfInterest.shift();
                }
                if (sampleUses > 0) for(let i = 0; i < sampleUses; i++)// Clone the sample if we need to emit it multiple times
                pushToQueue(i < sampleUses - 1 ? sample.clone() : sample);
                else sample.close();
            }, (error)=>{
                if (!outOfBandError) {
                    error.stack = decoderError.stack; // Provide a more useful stack trace
                    outOfBandError = error;
                    onQueueNotEmpty();
                }
            });
            const packetSink = this._createPacketSink();
            let lastPacket = null;
            let lastKeyPacket = null;
            // The end sequence number (inclusive) in the next batch of packets that will be decoded. The batch starts
            // at the last key frame and goes until this sequence number.
            let maxSequenceNumber = -1;
            const decodePackets = async ()=>{
                (0, _miscJs.assert)(lastKeyPacket);
                // Start at the current key packet
                let currentPacket = lastKeyPacket;
                decoder.decode(currentPacket);
                while(currentPacket.sequenceNumber < maxSequenceNumber){
                    const maxQueueSize = computeMaxQueueSize(sampleQueue.length);
                    while(sampleQueue.length + decoder.getDecodeQueueSize() > maxQueueSize && !terminated){
                        ({ promise: queueDequeue, resolve: onQueueDequeue } = (0, _miscJs.promiseWithResolvers)());
                        await queueDequeue;
                    }
                    if (terminated) break;
                    const nextPacket = await packetSink.getNextPacket(currentPacket);
                    (0, _miscJs.assert)(nextPacket);
                    decoder.decode(nextPacket);
                    currentPacket = nextPacket;
                }
                maxSequenceNumber = -1;
            };
            const flushDecoder = async ()=>{
                await decoder.flush();
                // We don't expect this list to have any elements in it anymore, but in case it does, let's emit
                // nulls for every remaining element, then clear it.
                for(let i = 0; i < timestampsOfInterest.length; i++)pushToQueue(null);
                timestampsOfInterest.length = 0;
            };
            for await (const timestamp of timestampIterator){
                validateTimestamp(timestamp);
                if (terminated || this._track.input._disposed) break;
                const targetPacket = await packetSink.getPacket(timestamp);
                const keyPacket = targetPacket && await packetSink.getKeyPacket(timestamp, {
                    verifyKeyPackets: true
                });
                if (!keyPacket) {
                    if (maxSequenceNumber !== -1) {
                        await decodePackets();
                        await flushDecoder();
                    }
                    pushToQueue(null);
                    lastPacket = null;
                    continue;
                }
                // Check if the key packet has changed or if we're going back in time
                if (lastPacket && (keyPacket.sequenceNumber !== lastKeyPacket.sequenceNumber || targetPacket.timestamp < lastPacket.timestamp)) {
                    await decodePackets();
                    await flushDecoder(); // Always flush here, improves decoder compatibility
                }
                timestampsOfInterest.push(targetPacket.timestamp);
                maxSequenceNumber = Math.max(targetPacket.sequenceNumber, maxSequenceNumber);
                lastPacket = targetPacket;
                lastKeyPacket = keyPacket;
            }
            if (!terminated && !this._track.input._disposed) {
                if (maxSequenceNumber !== -1) // We still need to decode packets
                await decodePackets();
                await flushDecoder();
            }
            decoder.close();
            decoderIsFlushed = true;
            onQueueNotEmpty(); // To unstuck the generator
        })().catch((error)=>{
            if (!outOfBandError) {
                outOfBandError = error;
                onQueueNotEmpty();
            }
        });
        const track = this._track;
        const closeSamples = ()=>{
            for (const sample of sampleQueue)sample?.close();
        };
        return {
            async next () {
                while(true){
                    if (track.input._disposed) {
                        closeSamples();
                        throw new (0, _inputJs.InputDisposedError)();
                    } else if (terminated) return {
                        value: undefined,
                        done: true
                    };
                    else if (outOfBandError) {
                        closeSamples();
                        throw outOfBandError;
                    } else if (sampleQueue.length > 0) {
                        const value = sampleQueue.shift();
                        (0, _miscJs.assert)(value !== undefined);
                        onQueueDequeue();
                        return {
                            value,
                            done: false
                        };
                    } else if (!decoderIsFlushed) await queueNotEmpty;
                    else return {
                        value: undefined,
                        done: true
                    };
                }
            },
            async return () {
                terminated = true;
                onQueueDequeue();
                onQueueNotEmpty();
                closeSamples();
                return {
                    value: undefined,
                    done: true
                };
            },
            async throw (error) {
                throw error;
            },
            [Symbol.asyncIterator] () {
                return this;
            }
        };
    }
}
const computeMaxQueueSize = (decodedSampleQueueSize)=>{
    // If we have decoded samples lying around, limit the total queue size to a small value (decoded samples can use up
    // a lot of memory). If not, we're fine with a much bigger queue of encoded packets waiting to be decoded. In fact,
    // some decoders only start flushing out decoded chunks when the packet queue is large enough.
    return decodedSampleQueueSize === 0 ? 40 : 8;
};
class VideoDecoderWrapper extends DecoderWrapper {
    constructor(onSample, onError, codec, decoderConfig, rotation, timeResolution){
        super(onSample, onError);
        this.codec = codec;
        this.decoderConfig = decoderConfig;
        this.rotation = rotation;
        this.timeResolution = timeResolution;
        this.decoder = null;
        this.customDecoder = null;
        this.customDecoderCallSerializer = new (0, _miscJs.CallSerializer)();
        this.customDecoderQueueSize = 0;
        this.inputTimestamps = []; // Timestamps input into the decoder, sorted.
        this.sampleQueue = []; // Safari-specific thing, check usage.
        this.currentPacketIndex = 0;
        this.raslSkipped = false; // For HEVC stuff
        // Alpha stuff
        this.alphaDecoder = null;
        this.alphaHadKeyframe = false;
        this.colorQueue = [];
        this.alphaQueue = [];
        this.merger = null;
        this.mergerCreationFailed = false;
        this.decodedAlphaChunkCount = 0;
        this.alphaDecoderQueueSize = 0;
        /** Each value is the number of decoded alpha chunks at which a null alpha frame should be added. */ this.nullAlphaFrameQueue = [];
        this.currentAlphaPacketIndex = 0;
        this.alphaRaslSkipped = false; // For HEVC stuff
        const MatchingCustomDecoder = (0, _customCoderJs.customVideoDecoders).find((x)=>x.supports(codec, decoderConfig));
        if (MatchingCustomDecoder) {
            // @ts-expect-error "Can't create instance of abstract class 🤓"
            this.customDecoder = new MatchingCustomDecoder();
            // @ts-expect-error It's technically readonly
            this.customDecoder.codec = codec;
            // @ts-expect-error It's technically readonly
            this.customDecoder.config = decoderConfig;
            // @ts-expect-error It's technically readonly
            this.customDecoder.onSample = (sample)=>{
                if (!(sample instanceof (0, _sampleJs.VideoSample))) throw new TypeError('The argument passed to onSample must be a VideoSample.');
                this.finalizeAndEmitSample(sample);
            };
            this.customDecoderCallSerializer.call(()=>this.customDecoder.init());
        } else {
            const colorHandler = (frame)=>{
                if (this.alphaQueue.length > 0) {
                    // Even when no alpha data is present (most of the time), there will be nulls in this queue
                    const alphaFrame = this.alphaQueue.shift();
                    (0, _miscJs.assert)(alphaFrame !== undefined);
                    this.mergeAlpha(frame, alphaFrame);
                } else this.colorQueue.push(frame);
            };
            if (codec === 'avc' && this.decoderConfig.description && (0, _miscJs.isChromium)()) {
                // Chromium has/had a bug with playing interlaced AVC (https://issues.chromium.org/issues/456919096)
                // which can be worked around by requesting that software decoding be used. So, here we peek into the
                // AVC description, if present, and switch to software decoding if we find interlaced content.
                const record = (0, _codecDataJs.deserializeAvcDecoderConfigurationRecord)((0, _miscJs.toUint8Array)(this.decoderConfig.description));
                if (record && record.sequenceParameterSets.length > 0) {
                    const sps = (0, _codecDataJs.parseAvcSps)(record.sequenceParameterSets[0]);
                    if (sps && sps.frameMbsOnlyFlag === 0) this.decoderConfig = {
                        ...this.decoderConfig,
                        hardwareAcceleration: 'prefer-software'
                    };
                }
            }
            this.decoder = new VideoDecoder({
                output: (frame)=>{
                    try {
                        colorHandler(frame);
                    } catch (error) {
                        this.onError(error);
                    }
                },
                error: onError
            });
            this.decoder.configure(this.decoderConfig);
        }
    }
    getDecodeQueueSize() {
        if (this.customDecoder) return this.customDecoderQueueSize;
        else {
            (0, _miscJs.assert)(this.decoder);
            return Math.max(this.decoder.decodeQueueSize, this.alphaDecoder?.decodeQueueSize ?? 0);
        }
    }
    decode(packet) {
        if (this.codec === 'hevc' && this.currentPacketIndex > 0 && !this.raslSkipped) {
            if (this.hasHevcRaslPicture(packet.data)) return; // Drop
            this.raslSkipped = true;
        }
        this.currentPacketIndex++;
        if (this.customDecoder) {
            this.customDecoderQueueSize++;
            this.customDecoderCallSerializer.call(()=>this.customDecoder.decode(packet)).then(()=>this.customDecoderQueueSize--);
        } else {
            (0, _miscJs.assert)(this.decoder);
            if (!(0, _miscJs.isWebKit)()) (0, _miscJs.insertSorted)(this.inputTimestamps, packet.timestamp, (x)=>x);
            this.decoder.decode(packet.toEncodedVideoChunk());
            this.decodeAlphaData(packet);
        }
    }
    decodeAlphaData(packet) {
        if (!packet.sideData.alpha || this.mergerCreationFailed) {
            // No alpha side data in the packet, most common case
            this.pushNullAlphaFrame();
            return;
        }
        if (!this.merger) try {
            this.merger = new ColorAlphaMerger();
        } catch (error) {
            console.error('Due to an error, only color data will be decoded.', error);
            this.mergerCreationFailed = true;
            this.decodeAlphaData(packet); // Go again
            return;
        }
        // Check if we need to set up the alpha decoder
        if (!this.alphaDecoder) {
            const alphaHandler = (frame)=>{
                this.alphaDecoderQueueSize--;
                if (this.colorQueue.length > 0) {
                    const colorFrame = this.colorQueue.shift();
                    (0, _miscJs.assert)(colorFrame !== undefined);
                    this.mergeAlpha(colorFrame, frame);
                } else this.alphaQueue.push(frame);
                // Check if any null frames have been queued for this point
                this.decodedAlphaChunkCount++;
                while(this.nullAlphaFrameQueue.length > 0 && this.nullAlphaFrameQueue[0] === this.decodedAlphaChunkCount){
                    this.nullAlphaFrameQueue.shift();
                    if (this.colorQueue.length > 0) {
                        const colorFrame = this.colorQueue.shift();
                        (0, _miscJs.assert)(colorFrame !== undefined);
                        this.mergeAlpha(colorFrame, null);
                    } else this.alphaQueue.push(null);
                }
            };
            this.alphaDecoder = new VideoDecoder({
                output: (frame)=>{
                    try {
                        alphaHandler(frame);
                    } catch (error) {
                        this.onError(error);
                    }
                },
                error: this.onError
            });
            this.alphaDecoder.configure(this.decoderConfig);
        }
        const type = (0, _codecDataJs.determineVideoPacketType)(this.codec, this.decoderConfig, packet.sideData.alpha);
        // Alpha packets might follow a different key frame rhythm than the main packets. Therefore, before we start
        // decoding, we must first find a packet that's actually a key frame. Until then, we treat the image as opaque.
        if (!this.alphaHadKeyframe) this.alphaHadKeyframe = type === 'key';
        if (this.alphaHadKeyframe) {
            // Same RASL skipping logic as for color, unlikely to be hit (since who uses HEVC with separate alpha??) but
            // here for symmetry.
            if (this.codec === 'hevc' && this.currentAlphaPacketIndex > 0 && !this.alphaRaslSkipped) {
                if (this.hasHevcRaslPicture(packet.sideData.alpha)) {
                    this.pushNullAlphaFrame();
                    return;
                }
                this.alphaRaslSkipped = true;
            }
            this.currentAlphaPacketIndex++;
            this.alphaDecoder.decode(packet.alphaToEncodedVideoChunk(type ?? packet.type));
            this.alphaDecoderQueueSize++;
        } else this.pushNullAlphaFrame();
    }
    pushNullAlphaFrame() {
        if (this.alphaDecoderQueueSize === 0) // Easy
        this.alphaQueue.push(null);
        else // There are still alpha chunks being decoded, so pushing `null` immediately would result in out-of-order
        // data and be incorrect. Instead, we need to enqueue a "null frame" for when the current decoder workload
        // has finished.
        this.nullAlphaFrameQueue.push(this.decodedAlphaChunkCount + this.alphaDecoderQueueSize);
    }
    /**
     * If we're using HEVC, we need to make sure to skip any RASL slices that follow a non-IDR key frame such as
     * CRA_NUT. This is because RASL slices cannot be decoded without data before the CRA_NUT. Browsers behave
     * differently here: Chromium drops the packets, Safari throws a decoder error. Either way, it's not good
     * and causes bugs upstream. So, let's take the dropping into our own hands.
     */ hasHevcRaslPicture(packetData) {
        const nalUnits = (0, _codecDataJs.extractHevcNalUnits)(packetData, this.decoderConfig);
        return nalUnits.some((x)=>{
            const type = (0, _codecDataJs.extractNalUnitTypeForHevc)(x);
            return type === (0, _codecDataJs.HevcNalUnitType).RASL_N || type === (0, _codecDataJs.HevcNalUnitType).RASL_R;
        });
    }
    /** Handler for the WebCodecs VideoDecoder for ironing out browser differences. */ sampleHandler(sample) {
        if ((0, _miscJs.isWebKit)()) {
            // For correct B-frame handling, we don't just hand over the frames directly but instead add them to
            // a queue, because we want to ensure frames are emitted in presentation order. We flush the queue
            // each time we receive a frame with a timestamp larger than the highest we've seen so far, as we
            // can sure that is not a B-frame. Typically, WebCodecs automatically guarantees that frames are
            // emitted in presentation order, but Safari doesn't always follow this rule.
            if (this.sampleQueue.length > 0 && sample.timestamp >= (0, _miscJs.last)(this.sampleQueue).timestamp) {
                for (const sample of this.sampleQueue)this.finalizeAndEmitSample(sample);
                this.sampleQueue.length = 0;
            }
            (0, _miscJs.insertSorted)(this.sampleQueue, sample, (x)=>x.timestamp);
        } else {
            // Assign it the next earliest timestamp from the input. We do this because browsers, by spec, are
            // required to emit decoded frames in presentation order *while* retaining the timestamp of their
            // originating EncodedVideoChunk. For files with B-frames but no out-of-order timestamps (like a
            // missing ctts box, for example), this causes a mismatch. We therefore fix the timestamps and
            // ensure they are sorted by doing this.
            const timestamp = this.inputTimestamps.shift();
            // There's no way we'd have more decoded frames than encoded packets we passed in. Actually, the
            // correspondence should be 1:1.
            (0, _miscJs.assert)(timestamp !== undefined);
            sample.setTimestamp(timestamp);
            this.finalizeAndEmitSample(sample);
        }
    }
    finalizeAndEmitSample(sample) {
        // Round the timestamps to the time resolution
        sample.setTimestamp(Math.round(sample.timestamp * this.timeResolution) / this.timeResolution);
        sample.setDuration(Math.round(sample.duration * this.timeResolution) / this.timeResolution);
        sample.setRotation(this.rotation);
        this.onSample(sample);
    }
    mergeAlpha(color, alpha) {
        if (!alpha) {
            // Nothing needs to be merged
            const finalSample = new (0, _sampleJs.VideoSample)(color);
            this.sampleHandler(finalSample);
            return;
        }
        (0, _miscJs.assert)(this.merger);
        this.merger.update(color, alpha);
        color.close();
        alpha.close();
        const finalFrame = new VideoFrame(this.merger.canvas, {
            timestamp: color.timestamp,
            duration: color.duration ?? undefined
        });
        const finalSample = new (0, _sampleJs.VideoSample)(finalFrame);
        this.sampleHandler(finalSample);
    }
    async flush() {
        if (this.customDecoder) await this.customDecoderCallSerializer.call(()=>this.customDecoder.flush());
        else {
            (0, _miscJs.assert)(this.decoder);
            await Promise.all([
                this.decoder.flush(),
                this.alphaDecoder?.flush()
            ]);
            this.colorQueue.forEach((x)=>x.close());
            this.colorQueue.length = 0;
            this.alphaQueue.forEach((x)=>x?.close());
            this.alphaQueue.length = 0;
            this.alphaHadKeyframe = false;
            this.decodedAlphaChunkCount = 0;
            this.alphaDecoderQueueSize = 0;
            this.nullAlphaFrameQueue.length = 0;
            this.currentAlphaPacketIndex = 0;
            this.alphaRaslSkipped = false;
        }
        if ((0, _miscJs.isWebKit)()) {
            for (const sample of this.sampleQueue)this.finalizeAndEmitSample(sample);
            this.sampleQueue.length = 0;
        }
        this.currentPacketIndex = 0;
        this.raslSkipped = false;
    }
    close() {
        if (this.customDecoder) this.customDecoderCallSerializer.call(()=>this.customDecoder.close());
        else {
            (0, _miscJs.assert)(this.decoder);
            this.decoder.close();
            this.alphaDecoder?.close();
            this.colorQueue.forEach((x)=>x.close());
            this.colorQueue.length = 0;
            this.alphaQueue.forEach((x)=>x?.close());
            this.alphaQueue.length = 0;
            this.merger?.close();
        }
        for (const sample of this.sampleQueue)sample.close();
        this.sampleQueue.length = 0;
    }
}
/** Utility class that merges together color and alpha information using simple WebGL 2 shaders. */ class ColorAlphaMerger {
    constructor(){
        // Canvas will be resized later
        if (typeof OffscreenCanvas !== 'undefined') // Prefer OffscreenCanvas for Worker environments
        this.canvas = new OffscreenCanvas(300, 150);
        else this.canvas = document.createElement('canvas');
        const gl = this.canvas.getContext('webgl2', {
            premultipliedAlpha: false
        }); // Casting because of some TypeScript weirdness
        if (!gl) throw new Error('Couldn\'t acquire WebGL 2 context.');
        this.gl = gl;
        this.program = this.createProgram();
        this.vao = this.createVAO();
        this.colorTexture = this.createTexture();
        this.alphaTexture = this.createTexture();
        this.gl.useProgram(this.program);
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_colorTexture'), 0);
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_alphaTexture'), 1);
    }
    createProgram() {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `#version 300 es
			in vec2 a_position;
			in vec2 a_texCoord;
			out vec2 v_texCoord;
			
			void main() {
				gl_Position = vec4(a_position, 0.0, 1.0);
				v_texCoord = a_texCoord;
			}
		`);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `#version 300 es
			precision highp float;
			
			uniform sampler2D u_colorTexture;
			uniform sampler2D u_alphaTexture;
			in vec2 v_texCoord;
			out vec4 fragColor;
			
			void main() {
				vec3 color = texture(u_colorTexture, v_texCoord).rgb;
				float alpha = texture(u_alphaTexture, v_texCoord).r;
				fragColor = vec4(color, alpha);
			}
		`);
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        return program;
    }
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        return shader;
    }
    createVAO() {
        const vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);
        const vertices = new Float32Array([
            -1,
            -1,
            0,
            1,
            1,
            -1,
            1,
            1,
            -1,
            1,
            0,
            0,
            1,
            1,
            1,
            0
        ]);
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 16, 0);
        this.gl.enableVertexAttribArray(texCoordLocation);
        this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);
        return vao;
    }
    createTexture() {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        return texture;
    }
    update(color, alpha) {
        if (color.displayWidth !== this.canvas.width || color.displayHeight !== this.canvas.height) {
            this.canvas.width = color.displayWidth;
            this.canvas.height = color.displayHeight;
        }
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, color);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.alphaTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, alpha);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    close() {
        this.gl.getExtension('WEBGL_lose_context')?.loseContext();
        this.gl = null;
    }
}
class VideoSampleSink extends BaseMediaSampleSink {
    /** Creates a new {@link VideoSampleSink} for the given {@link InputVideoTrack}. */ constructor(videoTrack){
        if (!(videoTrack instanceof (0, _inputTrackJs.InputVideoTrack))) throw new TypeError('videoTrack must be an InputVideoTrack.');
        super();
        this._track = videoTrack;
    }
    /** @internal */ async _createDecoder(onSample, onError) {
        if (!await this._track.canDecode()) throw new Error("This video track cannot be decoded by this browser. Make sure to check decodability before using a track.");
        const codec = this._track.codec;
        const rotation = this._track.rotation;
        const decoderConfig = await this._track.getDecoderConfig();
        const timeResolution = this._track.timeResolution;
        (0, _miscJs.assert)(codec && decoderConfig);
        return new VideoDecoderWrapper(onSample, onError, codec, decoderConfig, rotation, timeResolution);
    }
    /** @internal */ _createPacketSink() {
        return new EncodedPacketSink(this._track);
    }
    /**
     * Retrieves the video sample (frame) corresponding to the given timestamp, in seconds. More specifically, returns
     * the last video sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
     * Returns null if the timestamp is before the track's first timestamp.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */ async getSample(timestamp) {
        validateTimestamp(timestamp);
        for await (const sample of this.mediaSamplesAtTimestamps([
            timestamp
        ]))return sample;
        throw new Error('Internal error: Iterator returned nothing.');
    }
    /**
     * Creates an async iterator that yields the video samples (frames) of this track in presentation order. This method
     * will intelligently pre-decode a few frames ahead to enable fast iteration.
     *
     * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
     * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
     */ samples(startTimestamp = 0, endTimestamp = Infinity) {
        return this.mediaSamplesInRange(startTimestamp, endTimestamp);
    }
    /**
     * Creates an async iterator that yields a video sample (frame) for each timestamp in the argument. This method
     * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
     * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
     * yield null if no frame is available for a given timestamp.
     *
     * @param timestamps - An iterable or async iterable of timestamps in seconds.
     */ samplesAtTimestamps(timestamps) {
        return this.mediaSamplesAtTimestamps(timestamps);
    }
}
class CanvasSink {
    /** Creates a new {@link CanvasSink} for the given {@link InputVideoTrack}. */ constructor(videoTrack, options = {}){
        /** @internal */ this._nextCanvasIndex = 0;
        if (!(videoTrack instanceof (0, _inputTrackJs.InputVideoTrack))) throw new TypeError('videoTrack must be an InputVideoTrack.');
        if (options && typeof options !== 'object') throw new TypeError('options must be an object.');
        if (options.alpha !== undefined && typeof options.alpha !== 'boolean') throw new TypeError('options.alpha, when provided, must be a boolean.');
        if (options.width !== undefined && (!Number.isInteger(options.width) || options.width <= 0)) throw new TypeError('options.width, when defined, must be a positive integer.');
        if (options.height !== undefined && (!Number.isInteger(options.height) || options.height <= 0)) throw new TypeError('options.height, when defined, must be a positive integer.');
        if (options.fit !== undefined && ![
            'fill',
            'contain',
            'cover'
        ].includes(options.fit)) throw new TypeError('options.fit, when provided, must be one of "fill", "contain", or "cover".');
        if (options.width !== undefined && options.height !== undefined && options.fit === undefined) throw new TypeError('When both options.width and options.height are provided, options.fit must also be provided.');
        if (options.rotation !== undefined && ![
            0,
            90,
            180,
            270
        ].includes(options.rotation)) throw new TypeError('options.rotation, when provided, must be 0, 90, 180 or 270.');
        if (options.crop !== undefined) (0, _sampleJs.validateCropRectangle)(options.crop, 'options.');
        if (options.poolSize !== undefined && (typeof options.poolSize !== 'number' || !Number.isInteger(options.poolSize) || options.poolSize < 0)) throw new TypeError('poolSize must be a non-negative integer.');
        const rotation = options.rotation ?? videoTrack.rotation;
        const [rotatedWidth, rotatedHeight] = rotation % 180 === 0 ? [
            videoTrack.codedWidth,
            videoTrack.codedHeight
        ] : [
            videoTrack.codedHeight,
            videoTrack.codedWidth
        ];
        const crop = options.crop;
        if (crop) (0, _sampleJs.clampCropRectangle)(crop, rotatedWidth, rotatedHeight);
        let [width, height] = crop ? [
            crop.width,
            crop.height
        ] : [
            rotatedWidth,
            rotatedHeight
        ];
        const originalAspectRatio = width / height;
        // If width and height aren't defined together, deduce the missing value using the aspect ratio
        if (options.width !== undefined && options.height === undefined) {
            width = options.width;
            height = Math.round(width / originalAspectRatio);
        } else if (options.width === undefined && options.height !== undefined) {
            height = options.height;
            width = Math.round(height * originalAspectRatio);
        } else if (options.width !== undefined && options.height !== undefined) {
            width = options.width;
            height = options.height;
        }
        this._videoTrack = videoTrack;
        this._alpha = options.alpha ?? false;
        this._width = width;
        this._height = height;
        this._rotation = rotation;
        this._crop = crop;
        this._fit = options.fit ?? 'fill';
        this._videoSampleSink = new VideoSampleSink(videoTrack);
        this._canvasPool = Array.from({
            length: options.poolSize ?? 0
        }, ()=>null);
    }
    /** @internal */ _videoSampleToWrappedCanvas(sample) {
        let canvas = this._canvasPool[this._nextCanvasIndex];
        let canvasIsNew = false;
        if (!canvas) {
            if (typeof document !== 'undefined') {
                // Prefer an HTMLCanvasElement
                canvas = document.createElement('canvas');
                canvas.width = this._width;
                canvas.height = this._height;
            } else canvas = new OffscreenCanvas(this._width, this._height);
            if (this._canvasPool.length > 0) this._canvasPool[this._nextCanvasIndex] = canvas;
            canvasIsNew = true;
        }
        if (this._canvasPool.length > 0) this._nextCanvasIndex = (this._nextCanvasIndex + 1) % this._canvasPool.length;
        const context = canvas.getContext('2d', {
            alpha: this._alpha || (0, _miscJs.isFirefox)()
        });
        (0, _miscJs.assert)(context);
        context.resetTransform();
        if (!canvasIsNew) {
            if (!this._alpha && (0, _miscJs.isFirefox)()) {
                context.fillStyle = 'black';
                context.fillRect(0, 0, this._width, this._height);
            } else context.clearRect(0, 0, this._width, this._height);
        }
        sample.drawWithFit(context, {
            fit: this._fit,
            rotation: this._rotation,
            crop: this._crop
        });
        const result = {
            canvas,
            timestamp: sample.timestamp,
            duration: sample.duration
        };
        sample.close();
        return result;
    }
    /**
     * Retrieves a canvas with the video frame corresponding to the given timestamp, in seconds. More specifically,
     * returns the last video frame (in presentation order) with a start timestamp less than or equal to the given
     * timestamp. Returns null if the timestamp is before the track's first timestamp.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */ async getCanvas(timestamp) {
        validateTimestamp(timestamp);
        const sample = await this._videoSampleSink.getSample(timestamp);
        return sample && this._videoSampleToWrappedCanvas(sample);
    }
    /**
     * Creates an async iterator that yields canvases with the video frames of this track in presentation order. This
     * method will intelligently pre-decode a few frames ahead to enable fast iteration.
     *
     * @param startTimestamp - The timestamp in seconds at which to start yielding canvases (inclusive).
     * @param endTimestamp - The timestamp in seconds at which to stop yielding canvases (exclusive).
     */ canvases(startTimestamp = 0, endTimestamp = Infinity) {
        return (0, _miscJs.mapAsyncGenerator)(this._videoSampleSink.samples(startTimestamp, endTimestamp), (sample)=>this._videoSampleToWrappedCanvas(sample));
    }
    /**
     * Creates an async iterator that yields a canvas for each timestamp in the argument. This method uses an optimized
     * decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most once, and is
     * therefore more efficient than manually getting the canvas for every timestamp. The iterator may yield null if
     * no frame is available for a given timestamp.
     *
     * @param timestamps - An iterable or async iterable of timestamps in seconds.
     */ canvasesAtTimestamps(timestamps) {
        return (0, _miscJs.mapAsyncGenerator)(this._videoSampleSink.samplesAtTimestamps(timestamps), (sample)=>sample && this._videoSampleToWrappedCanvas(sample));
    }
}
class AudioDecoderWrapper extends DecoderWrapper {
    constructor(onSample, onError, codec, decoderConfig){
        super(onSample, onError);
        this.decoder = null;
        this.customDecoder = null;
        this.customDecoderCallSerializer = new (0, _miscJs.CallSerializer)();
        this.customDecoderQueueSize = 0;
        // Internal state to accumulate a precise current timestamp based on audio durations, not the (potentially
        // inaccurate) packet timestamps.
        this.currentTimestamp = null;
        const sampleHandler = (sample)=>{
            if (this.currentTimestamp === null || Math.abs(sample.timestamp - this.currentTimestamp) >= sample.duration) // We need to sync with the sample timestamp again
            this.currentTimestamp = sample.timestamp;
            const preciseTimestamp = this.currentTimestamp;
            this.currentTimestamp += sample.duration;
            if (sample.numberOfFrames === 0) {
                // We skip zero-data (empty) AudioSamples. These are sometimes emitted, for example, by Firefox when it
                // decodes Vorbis (at the start).
                sample.close();
                return;
            }
            // Round the timestamp to the sample rate
            const sampleRate = decoderConfig.sampleRate;
            sample.setTimestamp(Math.round(preciseTimestamp * sampleRate) / sampleRate);
            onSample(sample);
        };
        const MatchingCustomDecoder = (0, _customCoderJs.customAudioDecoders).find((x)=>x.supports(codec, decoderConfig));
        if (MatchingCustomDecoder) {
            // @ts-expect-error "Can't create instance of abstract class 🤓"
            this.customDecoder = new MatchingCustomDecoder();
            // @ts-expect-error It's technically readonly
            this.customDecoder.codec = codec;
            // @ts-expect-error It's technically readonly
            this.customDecoder.config = decoderConfig;
            // @ts-expect-error It's technically readonly
            this.customDecoder.onSample = (sample)=>{
                if (!(sample instanceof (0, _sampleJs.AudioSample))) throw new TypeError('The argument passed to onSample must be an AudioSample.');
                sampleHandler(sample);
            };
            this.customDecoderCallSerializer.call(()=>this.customDecoder.init());
        } else {
            this.decoder = new AudioDecoder({
                output: (data)=>{
                    try {
                        sampleHandler(new (0, _sampleJs.AudioSample)(data));
                    } catch (error) {
                        this.onError(error);
                    }
                },
                error: onError
            });
            this.decoder.configure(decoderConfig);
        }
    }
    getDecodeQueueSize() {
        if (this.customDecoder) return this.customDecoderQueueSize;
        else {
            (0, _miscJs.assert)(this.decoder);
            return this.decoder.decodeQueueSize;
        }
    }
    decode(packet) {
        if (this.customDecoder) {
            this.customDecoderQueueSize++;
            this.customDecoderCallSerializer.call(()=>this.customDecoder.decode(packet)).then(()=>this.customDecoderQueueSize--);
        } else {
            (0, _miscJs.assert)(this.decoder);
            this.decoder.decode(packet.toEncodedAudioChunk());
        }
    }
    flush() {
        if (this.customDecoder) return this.customDecoderCallSerializer.call(()=>this.customDecoder.flush());
        else {
            (0, _miscJs.assert)(this.decoder);
            return this.decoder.flush();
        }
    }
    close() {
        if (this.customDecoder) this.customDecoderCallSerializer.call(()=>this.customDecoder.close());
        else {
            (0, _miscJs.assert)(this.decoder);
            this.decoder.close();
        }
    }
}
// There are a lot of PCM variants not natively supported by the browser and by AudioData. Therefore we need a simple
// decoder that maps any input PCM format into a PCM format supported by the browser.
class PcmAudioDecoderWrapper extends DecoderWrapper {
    constructor(onSample, onError, decoderConfig){
        super(onSample, onError);
        this.decoderConfig = decoderConfig;
        // Internal state to accumulate a precise current timestamp based on audio durations, not the (potentially
        // inaccurate) packet timestamps.
        this.currentTimestamp = null;
        (0, _miscJs.assert)((0, _codecJs.PCM_AUDIO_CODECS).includes(decoderConfig.codec));
        this.codec = decoderConfig.codec;
        const { dataType, sampleSize, littleEndian } = (0, _codecJs.parsePcmCodec)(this.codec);
        this.inputSampleSize = sampleSize;
        switch(sampleSize){
            case 1:
                if (dataType === 'unsigned') this.readInputValue = (view, byteOffset)=>view.getUint8(byteOffset) - 128;
                else if (dataType === 'signed') this.readInputValue = (view, byteOffset)=>view.getInt8(byteOffset);
                else if (dataType === 'ulaw') this.readInputValue = (view, byteOffset)=>(0, _pcmJs.fromUlaw)(view.getUint8(byteOffset));
                else if (dataType === 'alaw') this.readInputValue = (view, byteOffset)=>(0, _pcmJs.fromAlaw)(view.getUint8(byteOffset));
                else (0, _miscJs.assert)(false);
                break;
            case 2:
                if (dataType === 'unsigned') this.readInputValue = (view, byteOffset)=>view.getUint16(byteOffset, littleEndian) - 2 ** 15;
                else if (dataType === 'signed') this.readInputValue = (view, byteOffset)=>view.getInt16(byteOffset, littleEndian);
                else (0, _miscJs.assert)(false);
                break;
            case 3:
                if (dataType === 'unsigned') this.readInputValue = (view, byteOffset)=>(0, _miscJs.getUint24)(view, byteOffset, littleEndian) - 2 ** 23;
                else if (dataType === 'signed') this.readInputValue = (view, byteOffset)=>(0, _miscJs.getInt24)(view, byteOffset, littleEndian);
                else (0, _miscJs.assert)(false);
                break;
            case 4:
                if (dataType === 'unsigned') this.readInputValue = (view, byteOffset)=>view.getUint32(byteOffset, littleEndian) - 2 ** 31;
                else if (dataType === 'signed') this.readInputValue = (view, byteOffset)=>view.getInt32(byteOffset, littleEndian);
                else if (dataType === 'float') this.readInputValue = (view, byteOffset)=>view.getFloat32(byteOffset, littleEndian);
                else (0, _miscJs.assert)(false);
                break;
            case 8:
                if (dataType === 'float') this.readInputValue = (view, byteOffset)=>view.getFloat64(byteOffset, littleEndian);
                else (0, _miscJs.assert)(false);
                break;
            default:
                (0, _miscJs.assertNever)(sampleSize);
                (0, _miscJs.assert)(false);
        }
        switch(sampleSize){
            case 1:
                if (dataType === 'ulaw' || dataType === 'alaw') {
                    this.outputSampleSize = 2;
                    this.outputFormat = 's16';
                    this.writeOutputValue = (view, byteOffset, value)=>view.setInt16(byteOffset, value, true);
                } else {
                    this.outputSampleSize = 1;
                    this.outputFormat = 'u8';
                    this.writeOutputValue = (view, byteOffset, value)=>view.setUint8(byteOffset, value + 128);
                }
                break;
            case 2:
                this.outputSampleSize = 2;
                this.outputFormat = 's16';
                this.writeOutputValue = (view, byteOffset, value)=>view.setInt16(byteOffset, value, true);
                break;
            case 3:
                this.outputSampleSize = 4;
                this.outputFormat = 's32';
                // From https://www.w3.org/TR/webcodecs:
                // AudioData containing 24-bit samples SHOULD store those samples in s32 or f32. When samples are
                // stored in s32, each sample MUST be left-shifted by 8 bits.
                this.writeOutputValue = (view, byteOffset, value)=>view.setInt32(byteOffset, value << 8, true);
                break;
            case 4:
                this.outputSampleSize = 4;
                if (dataType === 'float') {
                    this.outputFormat = 'f32';
                    this.writeOutputValue = (view, byteOffset, value)=>view.setFloat32(byteOffset, value, true);
                } else {
                    this.outputFormat = 's32';
                    this.writeOutputValue = (view, byteOffset, value)=>view.setInt32(byteOffset, value, true);
                }
                break;
            case 8:
                this.outputSampleSize = 4;
                this.outputFormat = 'f32';
                this.writeOutputValue = (view, byteOffset, value)=>view.setFloat32(byteOffset, value, true);
                break;
            default:
                (0, _miscJs.assertNever)(sampleSize);
                (0, _miscJs.assert)(false);
        }
    }
    getDecodeQueueSize() {
        return 0;
    }
    decode(packet) {
        const inputView = (0, _miscJs.toDataView)(packet.data);
        const numberOfFrames = packet.byteLength / this.decoderConfig.numberOfChannels / this.inputSampleSize;
        const outputBufferSize = numberOfFrames * this.decoderConfig.numberOfChannels * this.outputSampleSize;
        const outputBuffer = new ArrayBuffer(outputBufferSize);
        const outputView = new DataView(outputBuffer);
        for(let i = 0; i < numberOfFrames * this.decoderConfig.numberOfChannels; i++){
            const inputIndex = i * this.inputSampleSize;
            const outputIndex = i * this.outputSampleSize;
            const value = this.readInputValue(inputView, inputIndex);
            this.writeOutputValue(outputView, outputIndex, value);
        }
        const preciseDuration = numberOfFrames / this.decoderConfig.sampleRate;
        if (this.currentTimestamp === null || Math.abs(packet.timestamp - this.currentTimestamp) >= preciseDuration) // We need to sync with the packet timestamp again
        this.currentTimestamp = packet.timestamp;
        const preciseTimestamp = this.currentTimestamp;
        this.currentTimestamp += preciseDuration;
        const audioSample = new (0, _sampleJs.AudioSample)({
            format: this.outputFormat,
            data: outputBuffer,
            numberOfChannels: this.decoderConfig.numberOfChannels,
            sampleRate: this.decoderConfig.sampleRate,
            numberOfFrames,
            timestamp: preciseTimestamp
        });
        this.onSample(audioSample);
    }
    async flush() {
    // Do nothing
    }
    close() {
    // Do nothing
    }
}
class AudioSampleSink extends BaseMediaSampleSink {
    /** Creates a new {@link AudioSampleSink} for the given {@link InputAudioTrack}. */ constructor(audioTrack){
        if (!(audioTrack instanceof (0, _inputTrackJs.InputAudioTrack))) throw new TypeError('audioTrack must be an InputAudioTrack.');
        super();
        this._track = audioTrack;
    }
    /** @internal */ async _createDecoder(onSample, onError) {
        if (!await this._track.canDecode()) throw new Error("This audio track cannot be decoded by this browser. Make sure to check decodability before using a track.");
        const codec = this._track.codec;
        const decoderConfig = await this._track.getDecoderConfig();
        (0, _miscJs.assert)(codec && decoderConfig);
        if ((0, _codecJs.PCM_AUDIO_CODECS).includes(decoderConfig.codec)) return new PcmAudioDecoderWrapper(onSample, onError, decoderConfig);
        else return new AudioDecoderWrapper(onSample, onError, codec, decoderConfig);
    }
    /** @internal */ _createPacketSink() {
        return new EncodedPacketSink(this._track);
    }
    /**
     * Retrieves the audio sample corresponding to the given timestamp, in seconds. More specifically, returns
     * the last audio sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
     * Returns null if the timestamp is before the track's first timestamp.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */ async getSample(timestamp) {
        validateTimestamp(timestamp);
        for await (const sample of this.mediaSamplesAtTimestamps([
            timestamp
        ]))return sample;
        throw new Error('Internal error: Iterator returned nothing.');
    }
    /**
     * Creates an async iterator that yields the audio samples of this track in presentation order. This method
     * will intelligently pre-decode a few samples ahead to enable fast iteration.
     *
     * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
     * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
     */ samples(startTimestamp = 0, endTimestamp = Infinity) {
        return this.mediaSamplesInRange(startTimestamp, endTimestamp);
    }
    /**
     * Creates an async iterator that yields an audio sample for each timestamp in the argument. This method
     * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
     * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
     * yield null if no sample is available for a given timestamp.
     *
     * @param timestamps - An iterable or async iterable of timestamps in seconds.
     */ samplesAtTimestamps(timestamps) {
        return this.mediaSamplesAtTimestamps(timestamps);
    }
}
class AudioBufferSink {
    /** Creates a new {@link AudioBufferSink} for the given {@link InputAudioTrack}. */ constructor(audioTrack){
        if (!(audioTrack instanceof (0, _inputTrackJs.InputAudioTrack))) throw new TypeError('audioTrack must be an InputAudioTrack.');
        this._audioSampleSink = new AudioSampleSink(audioTrack);
    }
    /** @internal */ _audioSampleToWrappedArrayBuffer(sample) {
        const result = {
            buffer: sample.toAudioBuffer(),
            timestamp: sample.timestamp,
            duration: sample.duration
        };
        sample.close();
        return result;
    }
    /**
     * Retrieves the audio buffer corresponding to the given timestamp, in seconds. More specifically, returns
     * the last audio buffer (in presentation order) with a start timestamp less than or equal to the given timestamp.
     * Returns null if the timestamp is before the track's first timestamp.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */ async getBuffer(timestamp) {
        validateTimestamp(timestamp);
        const data = await this._audioSampleSink.getSample(timestamp);
        return data && this._audioSampleToWrappedArrayBuffer(data);
    }
    /**
     * Creates an async iterator that yields audio buffers of this track in presentation order. This method
     * will intelligently pre-decode a few buffers ahead to enable fast iteration.
     *
     * @param startTimestamp - The timestamp in seconds at which to start yielding buffers (inclusive).
     * @param endTimestamp - The timestamp in seconds at which to stop yielding buffers (exclusive).
     */ buffers(startTimestamp = 0, endTimestamp = Infinity) {
        return (0, _miscJs.mapAsyncGenerator)(this._audioSampleSink.samples(startTimestamp, endTimestamp), (data)=>this._audioSampleToWrappedArrayBuffer(data));
    }
    /**
     * Creates an async iterator that yields an audio buffer for each timestamp in the argument. This method
     * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
     * once, and is therefore more efficient than manually getting the buffer for every timestamp. The iterator may
     * yield null if no buffer is available for a given timestamp.
     *
     * @param timestamps - An iterable or async iterable of timestamps in seconds.
     */ buffersAtTimestamps(timestamps) {
        return (0, _miscJs.mapAsyncGenerator)(this._audioSampleSink.samplesAtTimestamps(timestamps), (data)=>data && this._audioSampleToWrappedArrayBuffer(data));
    }
}

},{"./codec.js":"4oSIO","./codec-data.js":"bzpVB","./custom-coder.js":"95k1I","./input.js":"4IqVo","./input-track.js":"dPVVR","./misc.js":"kkhLS","./packet.js":"esYjd","./pcm.js":"heqRW","./sample.js":"dJBvg","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"esYjd":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PLACEHOLDER_DATA", ()=>PLACEHOLDER_DATA);
/**
 * Represents an encoded chunk of media. Mainly used as an expressive wrapper around WebCodecs API's
 * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) and
 * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk), but can also be used
 * standalone.
 * @group Packets
 * @public
 */ parcelHelpers.export(exports, "EncodedPacket", ()=>EncodedPacket);
var _miscJs = require("./misc.js");
const PLACEHOLDER_DATA = /* #__PURE__ */ new Uint8Array(0);
class EncodedPacket {
    /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */ constructor(/** The encoded data of this packet. */ data, /** The type of this packet. */ type, /**
     * The presentation timestamp of this packet in seconds. May be negative. Samples with negative end timestamps
     * should not be presented.
     */ timestamp, /** The duration of this packet in seconds. */ duration, /**
     * The sequence number indicates the decode order of the packets. Packet A  must be decoded before packet B if A
     * has a lower sequence number than B. If two packets have the same sequence number, they are the same packet.
     * Otherwise, sequence numbers are arbitrary and are not guaranteed to have any meaning besides their relative
     * ordering. Negative sequence numbers mean the sequence number is undefined.
     */ sequenceNumber = -1, byteLength, sideData){
        this.data = data;
        this.type = type;
        this.timestamp = timestamp;
        this.duration = duration;
        this.sequenceNumber = sequenceNumber;
        if (data === PLACEHOLDER_DATA && byteLength === undefined) throw new Error('Internal error: byteLength must be explicitly provided when constructing metadata-only packets.');
        if (byteLength === undefined) byteLength = data.byteLength;
        if (!(data instanceof Uint8Array)) throw new TypeError('data must be a Uint8Array.');
        if (type !== 'key' && type !== 'delta') throw new TypeError('type must be either "key" or "delta".');
        if (!Number.isFinite(timestamp)) throw new TypeError('timestamp must be a number.');
        if (!Number.isFinite(duration) || duration < 0) throw new TypeError('duration must be a non-negative number.');
        if (!Number.isFinite(sequenceNumber)) throw new TypeError('sequenceNumber must be a number.');
        if (!Number.isInteger(byteLength) || byteLength < 0) throw new TypeError('byteLength must be a non-negative integer.');
        if (sideData !== undefined && (typeof sideData !== 'object' || !sideData)) throw new TypeError('sideData, when provided, must be an object.');
        if (sideData?.alpha !== undefined && !(sideData.alpha instanceof Uint8Array)) throw new TypeError('sideData.alpha, when provided, must be a Uint8Array.');
        if (sideData?.alphaByteLength !== undefined && (!Number.isInteger(sideData.alphaByteLength) || sideData.alphaByteLength < 0)) throw new TypeError('sideData.alphaByteLength, when provided, must be a non-negative integer.');
        this.byteLength = byteLength;
        this.sideData = sideData ?? {};
        if (this.sideData.alpha && this.sideData.alphaByteLength === undefined) this.sideData.alphaByteLength = this.sideData.alpha.byteLength;
    }
    /**
     * If this packet is a metadata-only packet. Metadata-only packets don't contain their packet data. They are the
     * result of retrieving packets with {@link PacketRetrievalOptions.metadataOnly} set to `true`.
     */ get isMetadataOnly() {
        return this.data === PLACEHOLDER_DATA;
    }
    /** The timestamp of this packet in microseconds. */ get microsecondTimestamp() {
        return Math.trunc((0, _miscJs.SECOND_TO_MICROSECOND_FACTOR) * this.timestamp);
    }
    /** The duration of this packet in microseconds. */ get microsecondDuration() {
        return Math.trunc((0, _miscJs.SECOND_TO_MICROSECOND_FACTOR) * this.duration);
    }
    /** Converts this packet to an
     * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
     * WebCodecs API. */ toEncodedVideoChunk() {
        if (this.isMetadataOnly) throw new TypeError('Metadata-only packets cannot be converted to a video chunk.');
        if (typeof EncodedVideoChunk === 'undefined') throw new Error('Your browser does not support EncodedVideoChunk.');
        return new EncodedVideoChunk({
            data: this.data,
            type: this.type,
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration
        });
    }
    /**
     * Converts this packet to an
     * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
     * WebCodecs API, using the alpha side data instead of the color data. Throws if no alpha side data is defined.
     */ alphaToEncodedVideoChunk(type = this.type) {
        if (!this.sideData.alpha) throw new TypeError('This packet does not contain alpha side data.');
        if (this.isMetadataOnly) throw new TypeError('Metadata-only packets cannot be converted to a video chunk.');
        if (typeof EncodedVideoChunk === 'undefined') throw new Error('Your browser does not support EncodedVideoChunk.');
        return new EncodedVideoChunk({
            data: this.sideData.alpha,
            type,
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration
        });
    }
    /** Converts this packet to an
     * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk) for use with the
     * WebCodecs API. */ toEncodedAudioChunk() {
        if (this.isMetadataOnly) throw new TypeError('Metadata-only packets cannot be converted to an audio chunk.');
        if (typeof EncodedAudioChunk === 'undefined') throw new Error('Your browser does not support EncodedAudioChunk.');
        return new EncodedAudioChunk({
            data: this.data,
            type: this.type,
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration
        });
    }
    /**
     * Creates an {@link EncodedPacket} from an
     * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) or
     * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk). This method is useful
     * for converting chunks from the WebCodecs API to `EncodedPacket` instances.
     */ static fromEncodedChunk(chunk, sideData) {
        if (!(chunk instanceof EncodedVideoChunk || chunk instanceof EncodedAudioChunk)) throw new TypeError('chunk must be an EncodedVideoChunk or EncodedAudioChunk.');
        const data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data);
        return new EncodedPacket(data, chunk.type, chunk.timestamp / 1e6, (chunk.duration ?? 0) / 1e6, undefined, undefined, sideData);
    }
    /** Clones this packet while optionally updating timing information. */ clone(options) {
        if (options !== undefined && (typeof options !== 'object' || options === null)) throw new TypeError('options, when provided, must be an object.');
        if (options?.timestamp !== undefined && !Number.isFinite(options.timestamp)) throw new TypeError('options.timestamp, when provided, must be a number.');
        if (options?.duration !== undefined && !Number.isFinite(options.duration)) throw new TypeError('options.duration, when provided, must be a number.');
        return new EncodedPacket(this.data, this.type, options?.timestamp ?? this.timestamp, options?.duration ?? this.duration, this.sequenceNumber, this.byteLength);
    }
}

},{"./misc.js":"kkhLS","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"heqRW":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ // https://github.com/dystopiancode/pcm-g711/blob/master/pcm-g711/g711.c
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "toUlaw", ()=>toUlaw);
parcelHelpers.export(exports, "fromUlaw", ()=>fromUlaw);
parcelHelpers.export(exports, "toAlaw", ()=>toAlaw);
parcelHelpers.export(exports, "fromAlaw", ()=>fromAlaw);
const toUlaw = (s16)=>{
    const MULAW_MAX = 0x1FFF;
    const MULAW_BIAS = 33;
    let number = s16;
    let mask = 0x1000;
    let sign = 0;
    let position = 12;
    let lsb = 0;
    if (number < 0) {
        number = -number;
        sign = 0x80;
    }
    number += MULAW_BIAS;
    if (number > MULAW_MAX) number = MULAW_MAX;
    while((number & mask) !== mask && position >= 5){
        mask >>= 1;
        position--;
    }
    lsb = number >> position - 4 & 0x0f;
    return ~(sign | position - 5 << 4 | lsb) & 0xFF;
};
const fromUlaw = (u8)=>{
    const MULAW_BIAS = 33;
    let sign = 0;
    let position = 0;
    let number = ~u8;
    if (number & 0x80) {
        number &= -129;
        sign = -1;
    }
    position = ((number & 0xF0) >> 4) + 5;
    const decoded = (1 << position | (number & 0x0F) << position - 4 | 1 << position - 5) - MULAW_BIAS;
    return sign === 0 ? decoded : -decoded;
};
const toAlaw = (s16)=>{
    const ALAW_MAX = 0xFFF;
    let mask = 0x800;
    let sign = 0;
    let position = 11;
    let lsb = 0;
    let number = s16;
    if (number < 0) {
        number = -number;
        sign = 0x80;
    }
    if (number > ALAW_MAX) number = ALAW_MAX;
    while((number & mask) !== mask && position >= 5){
        mask >>= 1;
        position--;
    }
    lsb = number >> (position === 4 ? 1 : position - 4) & 0x0f;
    return (sign | position - 4 << 4 | lsb) ^ 0x55;
};
const fromAlaw = (u8)=>{
    let sign = 0x00;
    let position = 0;
    let number = u8 ^ 0x55;
    if (number & 0x80) {
        number &= -129;
        sign = -1;
    }
    position = ((number & 0xF0) >> 4) + 4;
    let decoded = 0;
    if (position !== 4) decoded = 1 << position | (number & 0x0F) << position - 4 | 1 << position - 5;
    else decoded = number << 1 | 1;
    return sign === 0 ? decoded : -decoded;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"dJBvg":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Represents a raw, unencoded video sample (frame). Mainly used as an expressive wrapper around WebCodecs API's
 * [`VideoFrame`](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame), but can also be used standalone.
 * @group Samples
 * @public
 */ parcelHelpers.export(exports, "VideoSample", ()=>VideoSample);
parcelHelpers.export(exports, "clampCropRectangle", ()=>clampCropRectangle);
parcelHelpers.export(exports, "validateCropRectangle", ()=>validateCropRectangle);
/**
 * Represents a raw, unencoded audio sample. Mainly used as an expressive wrapper around WebCodecs API's
 * [`AudioData`](https://developer.mozilla.org/en-US/docs/Web/API/AudioData), but can also be used standalone.
 * @group Samples
 * @public
 */ parcelHelpers.export(exports, "AudioSample", ()=>AudioSample);
var _miscJs = require("./misc.js");
(0, _miscJs.polyfillSymbolDispose)();
// Let's manually handle logging the garbage collection errors that are typically logged by the browser. This way, they
// also kick for audio samples (which is normally not the case), making sure any incorrect code is quickly caught.
let lastVideoGcErrorLog = -Infinity;
let lastAudioGcErrorLog = -Infinity;
let finalizationRegistry = null;
if (typeof FinalizationRegistry !== 'undefined') finalizationRegistry = new FinalizationRegistry((value)=>{
    const now = Date.now();
    if (value.type === 'video') {
        if (now - lastVideoGcErrorLog >= 1000) {
            // This error is annoying but oh so important
            console.error(`A VideoSample was garbage collected without first being closed. For proper resource management,` + ` make sure to call close() on all your VideoSamples as soon as you're done using them.`);
            lastVideoGcErrorLog = now;
        }
        if (typeof VideoFrame !== 'undefined' && value.data instanceof VideoFrame) value.data.close(); // Prevent the browser error since we're logging our own
    } else {
        if (now - lastAudioGcErrorLog >= 1000) {
            console.error(`An AudioSample was garbage collected without first being closed. For proper resource management,` + ` make sure to call close() on all your AudioSamples as soon as you're done using them.`);
            lastAudioGcErrorLog = now;
        }
        if (typeof AudioData !== 'undefined' && value.data instanceof AudioData) value.data.close();
    }
});
class VideoSample {
    /** The width of the frame in pixels after rotation. */ get displayWidth() {
        return this.rotation % 180 === 0 ? this.codedWidth : this.codedHeight;
    }
    /** The height of the frame in pixels after rotation. */ get displayHeight() {
        return this.rotation % 180 === 0 ? this.codedHeight : this.codedWidth;
    }
    /** The presentation timestamp of the frame in microseconds. */ get microsecondTimestamp() {
        return Math.trunc((0, _miscJs.SECOND_TO_MICROSECOND_FACTOR) * this.timestamp);
    }
    /** The duration of the frame in microseconds. */ get microsecondDuration() {
        return Math.trunc((0, _miscJs.SECOND_TO_MICROSECOND_FACTOR) * this.duration);
    }
    /**
     * Whether this sample uses a pixel format that can hold transparency data. Note that this doesn't necessarily mean
     * that the sample is transparent.
     */ get hasAlpha() {
        return this.format && this.format.includes('A');
    }
    constructor(data, init){
        /** @internal */ this._closed = false;
        if (data instanceof ArrayBuffer || typeof SharedArrayBuffer !== 'undefined' && data instanceof SharedArrayBuffer || ArrayBuffer.isView(data)) {
            if (!init || typeof init !== 'object') throw new TypeError('init must be an object.');
            if (!('format' in init) || typeof init.format !== 'string') throw new TypeError('init.format must be a string.');
            if (!Number.isInteger(init.codedWidth) || init.codedWidth <= 0) throw new TypeError('init.codedWidth must be a positive integer.');
            if (!Number.isInteger(init.codedHeight) || init.codedHeight <= 0) throw new TypeError('init.codedHeight must be a positive integer.');
            if (init.rotation !== undefined && ![
                0,
                90,
                180,
                270
            ].includes(init.rotation)) throw new TypeError('init.rotation, when provided, must be 0, 90, 180, or 270.');
            if (!Number.isFinite(init.timestamp)) throw new TypeError('init.timestamp must be a number.');
            if (init.duration !== undefined && (!Number.isFinite(init.duration) || init.duration < 0)) throw new TypeError('init.duration, when provided, must be a non-negative number.');
            this._data = (0, _miscJs.toUint8Array)(data).slice(); // Copy it
            this.format = init.format;
            this.codedWidth = init.codedWidth;
            this.codedHeight = init.codedHeight;
            this.rotation = init.rotation ?? 0;
            this.timestamp = init.timestamp;
            this.duration = init.duration ?? 0;
            this.colorSpace = new VideoColorSpace(init.colorSpace);
        } else if (typeof VideoFrame !== 'undefined' && data instanceof VideoFrame) {
            if (init?.rotation !== undefined && ![
                0,
                90,
                180,
                270
            ].includes(init.rotation)) throw new TypeError('init.rotation, when provided, must be 0, 90, 180, or 270.');
            if (init?.timestamp !== undefined && !Number.isFinite(init?.timestamp)) throw new TypeError('init.timestamp, when provided, must be a number.');
            if (init?.duration !== undefined && (!Number.isFinite(init.duration) || init.duration < 0)) throw new TypeError('init.duration, when provided, must be a non-negative number.');
            this._data = data;
            this.format = data.format;
            // Copying the display dimensions here, assuming no innate VideoFrame rotation
            this.codedWidth = data.displayWidth;
            this.codedHeight = data.displayHeight;
            // The VideoFrame's rotation is ignored here. It's still a new field, and I'm not sure of any application
            // where the browser makes use of it. If a case gets found, I'll add it.
            this.rotation = init?.rotation ?? 0;
            this.timestamp = init?.timestamp ?? data.timestamp / 1e6;
            this.duration = init?.duration ?? (data.duration ?? 0) / 1e6;
            this.colorSpace = data.colorSpace;
        } else if (typeof HTMLImageElement !== 'undefined' && data instanceof HTMLImageElement || typeof SVGImageElement !== 'undefined' && data instanceof SVGImageElement || typeof ImageBitmap !== 'undefined' && data instanceof ImageBitmap || typeof HTMLVideoElement !== 'undefined' && data instanceof HTMLVideoElement || typeof HTMLCanvasElement !== 'undefined' && data instanceof HTMLCanvasElement || typeof OffscreenCanvas !== 'undefined' && data instanceof OffscreenCanvas) {
            if (!init || typeof init !== 'object') throw new TypeError('init must be an object.');
            if (init.rotation !== undefined && ![
                0,
                90,
                180,
                270
            ].includes(init.rotation)) throw new TypeError('init.rotation, when provided, must be 0, 90, 180, or 270.');
            if (!Number.isFinite(init.timestamp)) throw new TypeError('init.timestamp must be a number.');
            if (init.duration !== undefined && (!Number.isFinite(init.duration) || init.duration < 0)) throw new TypeError('init.duration, when provided, must be a non-negative number.');
            if (typeof VideoFrame !== 'undefined') return new VideoSample(new VideoFrame(data, {
                timestamp: Math.trunc(init.timestamp * (0, _miscJs.SECOND_TO_MICROSECOND_FACTOR)),
                // Drag 0 to undefined
                duration: Math.trunc((init.duration ?? 0) * (0, _miscJs.SECOND_TO_MICROSECOND_FACTOR)) || undefined
            }), init);
            let width = 0;
            let height = 0;
            // Determine the dimensions of the thing
            if ('naturalWidth' in data) {
                width = data.naturalWidth;
                height = data.naturalHeight;
            } else if ('videoWidth' in data) {
                width = data.videoWidth;
                height = data.videoHeight;
            } else if ('width' in data) {
                width = Number(data.width);
                height = Number(data.height);
            }
            if (!width || !height) throw new TypeError('Could not determine dimensions.');
            const canvas = new OffscreenCanvas(width, height);
            const context = canvas.getContext('2d', {
                alpha: (0, _miscJs.isFirefox)(),
                willReadFrequently: true
            });
            (0, _miscJs.assert)(context);
            // Draw it to a canvas
            context.drawImage(data, 0, 0);
            this._data = canvas;
            this.format = 'RGBX';
            this.codedWidth = width;
            this.codedHeight = height;
            this.rotation = init.rotation ?? 0;
            this.timestamp = init.timestamp;
            this.duration = init.duration ?? 0;
            this.colorSpace = new VideoColorSpace({
                matrix: 'rgb',
                primaries: 'bt709',
                transfer: 'iec61966-2-1',
                fullRange: true
            });
        } else throw new TypeError('Invalid data type: Must be a BufferSource or CanvasImageSource.');
        finalizationRegistry?.register(this, {
            type: 'video',
            data: this._data
        }, this);
    }
    /** Clones this video sample. */ clone() {
        if (this._closed) throw new Error('VideoSample is closed.');
        (0, _miscJs.assert)(this._data !== null);
        if (isVideoFrame(this._data)) return new VideoSample(this._data.clone(), {
            timestamp: this.timestamp,
            duration: this.duration,
            rotation: this.rotation
        });
        else if (this._data instanceof Uint8Array) return new VideoSample(this._data.slice(), {
            format: this.format,
            codedWidth: this.codedWidth,
            codedHeight: this.codedHeight,
            timestamp: this.timestamp,
            duration: this.duration,
            colorSpace: this.colorSpace,
            rotation: this.rotation
        });
        else return new VideoSample(this._data, {
            format: this.format,
            codedWidth: this.codedWidth,
            codedHeight: this.codedHeight,
            timestamp: this.timestamp,
            duration: this.duration,
            colorSpace: this.colorSpace,
            rotation: this.rotation
        });
    }
    /**
     * Closes this video sample, releasing held resources. Video samples should be closed as soon as they are not
     * needed anymore.
     */ close() {
        if (this._closed) return;
        finalizationRegistry?.unregister(this);
        if (isVideoFrame(this._data)) this._data.close();
        else this._data = null; // GC that shit
        this._closed = true;
    }
    /** Returns the number of bytes required to hold this video sample's pixel data. */ allocationSize() {
        if (this._closed) throw new Error('VideoSample is closed.');
        (0, _miscJs.assert)(this._data !== null);
        if (isVideoFrame(this._data)) return this._data.allocationSize();
        else if (this._data instanceof Uint8Array) return this._data.byteLength;
        else return this.codedWidth * this.codedHeight * 4; // RGBX
    }
    /** Copies this video sample's pixel data to an ArrayBuffer or ArrayBufferView. */ async copyTo(destination) {
        if (!(0, _miscJs.isAllowSharedBufferSource)(destination)) throw new TypeError('destination must be an ArrayBuffer or an ArrayBuffer view.');
        if (this._closed) throw new Error('VideoSample is closed.');
        (0, _miscJs.assert)(this._data !== null);
        if (isVideoFrame(this._data)) await this._data.copyTo(destination);
        else if (this._data instanceof Uint8Array) {
            const dest = (0, _miscJs.toUint8Array)(destination);
            dest.set(this._data);
        } else {
            const canvas = this._data;
            const context = canvas.getContext('2d');
            (0, _miscJs.assert)(context);
            const imageData = context.getImageData(0, 0, this.codedWidth, this.codedHeight);
            const dest = (0, _miscJs.toUint8Array)(destination);
            dest.set(imageData.data);
        }
    }
    /**
     * Converts this video sample to a VideoFrame for use with the WebCodecs API. The VideoFrame returned by this
     * method *must* be closed separately from this video sample.
     */ toVideoFrame() {
        if (this._closed) throw new Error('VideoSample is closed.');
        (0, _miscJs.assert)(this._data !== null);
        if (isVideoFrame(this._data)) return new VideoFrame(this._data, {
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration || undefined
        });
        else if (this._data instanceof Uint8Array) return new VideoFrame(this._data, {
            format: this.format,
            codedWidth: this.codedWidth,
            codedHeight: this.codedHeight,
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration || undefined,
            colorSpace: this.colorSpace
        });
        else return new VideoFrame(this._data, {
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration || undefined
        });
    }
    draw(context, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        let sx = 0;
        let sy = 0;
        let sWidth = this.displayWidth;
        let sHeight = this.displayHeight;
        let dx = 0;
        let dy = 0;
        let dWidth = this.displayWidth;
        let dHeight = this.displayHeight;
        if (arg5 !== undefined) {
            sx = arg1;
            sy = arg2;
            sWidth = arg3;
            sHeight = arg4;
            dx = arg5;
            dy = arg6;
            if (arg7 !== undefined) {
                dWidth = arg7;
                dHeight = arg8;
            } else {
                dWidth = sWidth;
                dHeight = sHeight;
            }
        } else {
            dx = arg1;
            dy = arg2;
            if (arg3 !== undefined) {
                dWidth = arg3;
                dHeight = arg4;
            }
        }
        if (!(typeof CanvasRenderingContext2D !== 'undefined' && context instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D !== 'undefined' && context instanceof OffscreenCanvasRenderingContext2D)) throw new TypeError('context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.');
        if (!Number.isFinite(sx)) throw new TypeError('sx must be a number.');
        if (!Number.isFinite(sy)) throw new TypeError('sy must be a number.');
        if (!Number.isFinite(sWidth) || sWidth < 0) throw new TypeError('sWidth must be a non-negative number.');
        if (!Number.isFinite(sHeight) || sHeight < 0) throw new TypeError('sHeight must be a non-negative number.');
        if (!Number.isFinite(dx)) throw new TypeError('dx must be a number.');
        if (!Number.isFinite(dy)) throw new TypeError('dy must be a number.');
        if (!Number.isFinite(dWidth) || dWidth < 0) throw new TypeError('dWidth must be a non-negative number.');
        if (!Number.isFinite(dHeight) || dHeight < 0) throw new TypeError('dHeight must be a non-negative number.');
        if (this._closed) throw new Error('VideoSample is closed.');
        ({ sx, sy, sWidth, sHeight } = this._rotateSourceRegion(sx, sy, sWidth, sHeight, this.rotation));
        const source = this.toCanvasImageSource();
        context.save();
        const centerX = dx + dWidth / 2;
        const centerY = dy + dHeight / 2;
        context.translate(centerX, centerY);
        context.rotate(this.rotation * Math.PI / 180);
        const aspectRatioChange = this.rotation % 180 === 0 ? 1 : dWidth / dHeight;
        // Scale to compensate for aspect ratio changes when rotated
        context.scale(1 / aspectRatioChange, aspectRatioChange);
        context.drawImage(source, sx, sy, sWidth, sHeight, -dWidth / 2, -dHeight / 2, dWidth, dHeight);
        context.restore();
    }
    /**
     * Draws the sample in the middle of the canvas corresponding to the context with the specified fit behavior.
     */ drawWithFit(context, options) {
        if (!(typeof CanvasRenderingContext2D !== 'undefined' && context instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D !== 'undefined' && context instanceof OffscreenCanvasRenderingContext2D)) throw new TypeError('context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.');
        if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
        if (![
            'fill',
            'contain',
            'cover'
        ].includes(options.fit)) throw new TypeError('options.fit must be \'fill\', \'contain\', or \'cover\'.');
        if (options.rotation !== undefined && ![
            0,
            90,
            180,
            270
        ].includes(options.rotation)) throw new TypeError('options.rotation, when provided, must be 0, 90, 180, or 270.');
        if (options.crop !== undefined) validateCropRectangle(options.crop, 'options.');
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        const rotation = options.rotation ?? this.rotation;
        const [rotatedWidth, rotatedHeight] = rotation % 180 === 0 ? [
            this.codedWidth,
            this.codedHeight
        ] : [
            this.codedHeight,
            this.codedWidth
        ];
        if (options.crop) clampCropRectangle(options.crop, rotatedWidth, rotatedHeight);
        // These variables specify where the final sample will be drawn on the canvas
        let dx;
        let dy;
        let newWidth;
        let newHeight;
        const { sx, sy, sWidth, sHeight } = this._rotateSourceRegion(options.crop?.left ?? 0, options.crop?.top ?? 0, options.crop?.width ?? rotatedWidth, options.crop?.height ?? rotatedHeight, rotation);
        if (options.fit === 'fill') {
            dx = 0;
            dy = 0;
            newWidth = canvasWidth;
            newHeight = canvasHeight;
        } else {
            const [sampleWidth, sampleHeight] = options.crop ? [
                options.crop.width,
                options.crop.height
            ] : [
                rotatedWidth,
                rotatedHeight
            ];
            const scale = options.fit === 'contain' ? Math.min(canvasWidth / sampleWidth, canvasHeight / sampleHeight) : Math.max(canvasWidth / sampleWidth, canvasHeight / sampleHeight);
            newWidth = sampleWidth * scale;
            newHeight = sampleHeight * scale;
            dx = (canvasWidth - newWidth) / 2;
            dy = (canvasHeight - newHeight) / 2;
        }
        context.save();
        const aspectRatioChange = rotation % 180 === 0 ? 1 : newWidth / newHeight;
        context.translate(canvasWidth / 2, canvasHeight / 2);
        context.rotate(rotation * Math.PI / 180);
        // This aspect ratio compensation is done so that we can draw the sample with the intended dimensions and
        // don't need to think about how those dimensions change after the rotation
        context.scale(1 / aspectRatioChange, aspectRatioChange);
        context.translate(-canvasWidth / 2, -canvasHeight / 2);
        // Important that we don't use .draw() here since that would take rotation into account, but we wanna handle it
        // ourselves here
        context.drawImage(this.toCanvasImageSource(), sx, sy, sWidth, sHeight, dx, dy, newWidth, newHeight);
        context.restore();
    }
    /** @internal */ _rotateSourceRegion(sx, sy, sWidth, sHeight, rotation) {
        // The provided sx,sy,sWidth,sHeight refer to the final rotated image, but that's not actually how the image is
        // stored. Therefore, we must map these back onto the original, pre-rotation image.
        if (rotation === 90) [sx, sy, sWidth, sHeight] = [
            sy,
            this.codedHeight - sx - sWidth,
            sHeight,
            sWidth
        ];
        else if (rotation === 180) [sx, sy] = [
            this.codedWidth - sx - sWidth,
            this.codedHeight - sy - sHeight
        ];
        else if (rotation === 270) [sx, sy, sWidth, sHeight] = [
            this.codedWidth - sy - sHeight,
            sx,
            sHeight,
            sWidth
        ];
        return {
            sx,
            sy,
            sWidth,
            sHeight
        };
    }
    /**
     * Converts this video sample to a
     * [`CanvasImageSource`](https://udn.realityripple.com/docs/Web/API/CanvasImageSource) for drawing to a canvas.
     *
     * You must use the value returned by this method immediately, as any VideoFrame created internally will
     * automatically be closed in the next microtask.
     */ toCanvasImageSource() {
        if (this._closed) throw new Error('VideoSample is closed.');
        (0, _miscJs.assert)(this._data !== null);
        if (this._data instanceof Uint8Array) {
            // Requires VideoFrame to be defined
            const videoFrame = this.toVideoFrame();
            queueMicrotask(()=>videoFrame.close()); // Let's automatically close the frame in the next microtask
            return videoFrame;
        } else return this._data;
    }
    /** Sets the rotation metadata of this video sample. */ setRotation(newRotation) {
        if (![
            0,
            90,
            180,
            270
        ].includes(newRotation)) throw new TypeError('newRotation must be 0, 90, 180, or 270.');
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        this.rotation = newRotation;
    }
    /** Sets the presentation timestamp of this video sample, in seconds. */ setTimestamp(newTimestamp) {
        if (!Number.isFinite(newTimestamp)) throw new TypeError('newTimestamp must be a number.');
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        this.timestamp = newTimestamp;
    }
    /** Sets the duration of this video sample, in seconds. */ setDuration(newDuration) {
        if (!Number.isFinite(newDuration) || newDuration < 0) throw new TypeError('newDuration must be a non-negative number.');
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        this.duration = newDuration;
    }
    /** Calls `.close()`. */ [Symbol.dispose]() {
        this.close();
    }
}
const isVideoFrame = (x)=>{
    return typeof VideoFrame !== 'undefined' && x instanceof VideoFrame;
};
const clampCropRectangle = (crop, outerWidth, outerHeight)=>{
    crop.left = Math.min(crop.left, outerWidth);
    crop.top = Math.min(crop.top, outerHeight);
    crop.width = Math.min(crop.width, outerWidth - crop.left);
    crop.height = Math.min(crop.height, outerHeight - crop.top);
    (0, _miscJs.assert)(crop.width >= 0);
    (0, _miscJs.assert)(crop.height >= 0);
};
const validateCropRectangle = (crop, prefix)=>{
    if (!crop || typeof crop !== 'object') throw new TypeError(prefix + 'crop, when provided, must be an object.');
    if (!Number.isInteger(crop.left) || crop.left < 0) throw new TypeError(prefix + 'crop.left must be a non-negative integer.');
    if (!Number.isInteger(crop.top) || crop.top < 0) throw new TypeError(prefix + 'crop.top must be a non-negative integer.');
    if (!Number.isInteger(crop.width) || crop.width < 0) throw new TypeError(prefix + 'crop.width must be a non-negative integer.');
    if (!Number.isInteger(crop.height) || crop.height < 0) throw new TypeError(prefix + 'crop.height must be a non-negative integer.');
};
const AUDIO_SAMPLE_FORMATS = new Set([
    'f32',
    'f32-planar',
    's16',
    's16-planar',
    's32',
    's32-planar',
    'u8',
    'u8-planar'
]);
class AudioSample {
    /** The presentation timestamp of the sample in microseconds. */ get microsecondTimestamp() {
        return Math.trunc((0, _miscJs.SECOND_TO_MICROSECOND_FACTOR) * this.timestamp);
    }
    /** The duration of the sample in microseconds. */ get microsecondDuration() {
        return Math.trunc((0, _miscJs.SECOND_TO_MICROSECOND_FACTOR) * this.duration);
    }
    /**
     * Creates a new {@link AudioSample}, either from an existing
     * [`AudioData`](https://developer.mozilla.org/en-US/docs/Web/API/AudioData) or from raw bytes specified in
     * {@link AudioSampleInit}.
     */ constructor(init){
        /** @internal */ this._closed = false;
        if (isAudioData(init)) {
            if (init.format === null) throw new TypeError('AudioData with null format is not supported.');
            this._data = init;
            this.format = init.format;
            this.sampleRate = init.sampleRate;
            this.numberOfFrames = init.numberOfFrames;
            this.numberOfChannels = init.numberOfChannels;
            this.timestamp = init.timestamp / 1e6;
            this.duration = init.numberOfFrames / init.sampleRate;
        } else {
            if (!init || typeof init !== 'object') throw new TypeError('Invalid AudioDataInit: must be an object.');
            if (!AUDIO_SAMPLE_FORMATS.has(init.format)) throw new TypeError('Invalid AudioDataInit: invalid format.');
            if (!Number.isFinite(init.sampleRate) || init.sampleRate <= 0) throw new TypeError('Invalid AudioDataInit: sampleRate must be > 0.');
            if (!Number.isInteger(init.numberOfChannels) || init.numberOfChannels === 0) throw new TypeError('Invalid AudioDataInit: numberOfChannels must be an integer > 0.');
            if (!Number.isFinite(init?.timestamp)) throw new TypeError('init.timestamp must be a number.');
            const numberOfFrames = init.data.byteLength / (getBytesPerSample(init.format) * init.numberOfChannels);
            if (!Number.isInteger(numberOfFrames)) throw new TypeError('Invalid AudioDataInit: data size is not a multiple of frame size.');
            this.format = init.format;
            this.sampleRate = init.sampleRate;
            this.numberOfFrames = numberOfFrames;
            this.numberOfChannels = init.numberOfChannels;
            this.timestamp = init.timestamp;
            this.duration = numberOfFrames / init.sampleRate;
            let dataBuffer;
            if (init.data instanceof ArrayBuffer) dataBuffer = new Uint8Array(init.data);
            else if (ArrayBuffer.isView(init.data)) dataBuffer = new Uint8Array(init.data.buffer, init.data.byteOffset, init.data.byteLength);
            else throw new TypeError('Invalid AudioDataInit: data is not a BufferSource.');
            const expectedSize = this.numberOfFrames * this.numberOfChannels * getBytesPerSample(this.format);
            if (dataBuffer.byteLength < expectedSize) throw new TypeError('Invalid AudioDataInit: insufficient data size.');
            this._data = dataBuffer;
        }
        finalizationRegistry?.register(this, {
            type: 'audio',
            data: this._data
        }, this);
    }
    /** Returns the number of bytes required to hold the audio sample's data as specified by the given options. */ allocationSize(options) {
        if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
        if (!Number.isInteger(options.planeIndex) || options.planeIndex < 0) throw new TypeError('planeIndex must be a non-negative integer.');
        if (options.format !== undefined && !AUDIO_SAMPLE_FORMATS.has(options.format)) throw new TypeError('Invalid format.');
        if (options.frameOffset !== undefined && (!Number.isInteger(options.frameOffset) || options.frameOffset < 0)) throw new TypeError('frameOffset must be a non-negative integer.');
        if (options.frameCount !== undefined && (!Number.isInteger(options.frameCount) || options.frameCount < 0)) throw new TypeError('frameCount must be a non-negative integer.');
        if (this._closed) throw new Error('AudioSample is closed.');
        const destFormat = options.format ?? this.format;
        const frameOffset = options.frameOffset ?? 0;
        if (frameOffset >= this.numberOfFrames) throw new RangeError('frameOffset out of range');
        const copyFrameCount = options.frameCount !== undefined ? options.frameCount : this.numberOfFrames - frameOffset;
        if (copyFrameCount > this.numberOfFrames - frameOffset) throw new RangeError('frameCount out of range');
        const bytesPerSample = getBytesPerSample(destFormat);
        const isPlanar = formatIsPlanar(destFormat);
        if (isPlanar && options.planeIndex >= this.numberOfChannels) throw new RangeError('planeIndex out of range');
        if (!isPlanar && options.planeIndex !== 0) throw new RangeError('planeIndex out of range');
        const elementCount = isPlanar ? copyFrameCount : copyFrameCount * this.numberOfChannels;
        return elementCount * bytesPerSample;
    }
    /** Copies the audio sample's data to an ArrayBuffer or ArrayBufferView as specified by the given options. */ copyTo(destination, options) {
        if (!(0, _miscJs.isAllowSharedBufferSource)(destination)) throw new TypeError('destination must be an ArrayBuffer or an ArrayBuffer view.');
        if (!options || typeof options !== 'object') throw new TypeError('options must be an object.');
        if (!Number.isInteger(options.planeIndex) || options.planeIndex < 0) throw new TypeError('planeIndex must be a non-negative integer.');
        if (options.format !== undefined && !AUDIO_SAMPLE_FORMATS.has(options.format)) throw new TypeError('Invalid format.');
        if (options.frameOffset !== undefined && (!Number.isInteger(options.frameOffset) || options.frameOffset < 0)) throw new TypeError('frameOffset must be a non-negative integer.');
        if (options.frameCount !== undefined && (!Number.isInteger(options.frameCount) || options.frameCount < 0)) throw new TypeError('frameCount must be a non-negative integer.');
        if (this._closed) throw new Error('AudioSample is closed.');
        const { planeIndex, format, frameCount: optFrameCount, frameOffset: optFrameOffset } = options;
        const destFormat = format ?? this.format;
        if (!destFormat) throw new Error('Destination format not determined');
        const numFrames = this.numberOfFrames;
        const numChannels = this.numberOfChannels;
        const frameOffset = optFrameOffset ?? 0;
        if (frameOffset >= numFrames) throw new RangeError('frameOffset out of range');
        const copyFrameCount = optFrameCount !== undefined ? optFrameCount : numFrames - frameOffset;
        if (copyFrameCount > numFrames - frameOffset) throw new RangeError('frameCount out of range');
        const destBytesPerSample = getBytesPerSample(destFormat);
        const destIsPlanar = formatIsPlanar(destFormat);
        if (destIsPlanar && planeIndex >= numChannels) throw new RangeError('planeIndex out of range');
        if (!destIsPlanar && planeIndex !== 0) throw new RangeError('planeIndex out of range');
        const destElementCount = destIsPlanar ? copyFrameCount : copyFrameCount * numChannels;
        const requiredSize = destElementCount * destBytesPerSample;
        if (destination.byteLength < requiredSize) throw new RangeError('Destination buffer is too small');
        const destView = (0, _miscJs.toDataView)(destination);
        const writeFn = getWriteFunction(destFormat);
        if (isAudioData(this._data)) {
            if (destIsPlanar) {
                if (destFormat === 'f32-planar') // Simple, since the browser must support f32-planar, we can just delegate here
                this._data.copyTo(destination, {
                    planeIndex,
                    frameOffset,
                    frameCount: copyFrameCount,
                    format: 'f32-planar'
                });
                else {
                    // Allocate temporary buffer for f32-planar data
                    const tempBuffer = new ArrayBuffer(copyFrameCount * 4);
                    const tempArray = new Float32Array(tempBuffer);
                    this._data.copyTo(tempArray, {
                        planeIndex,
                        frameOffset,
                        frameCount: copyFrameCount,
                        format: 'f32-planar'
                    });
                    // Convert each f32 sample to destination format
                    const tempView = new DataView(tempBuffer);
                    for(let i = 0; i < copyFrameCount; i++){
                        const destOffset = i * destBytesPerSample;
                        const sample = tempView.getFloat32(i * 4, true);
                        writeFn(destView, destOffset, sample);
                    }
                }
            } else {
                // Destination is interleaved.
                // Allocate a temporary Float32Array to hold one channel's worth of data.
                const numCh = numChannels;
                const temp = new Float32Array(copyFrameCount);
                for(let ch = 0; ch < numCh; ch++){
                    this._data.copyTo(temp, {
                        planeIndex: ch,
                        frameOffset,
                        frameCount: copyFrameCount,
                        format: 'f32-planar'
                    });
                    for(let i = 0; i < copyFrameCount; i++){
                        const destIndex = i * numCh + ch;
                        const destOffset = destIndex * destBytesPerSample;
                        writeFn(destView, destOffset, temp[i]);
                    }
                }
            }
        } else {
            const uint8Data = this._data;
            const srcView = (0, _miscJs.toDataView)(uint8Data);
            const srcFormat = this.format;
            const readFn = getReadFunction(srcFormat);
            const srcBytesPerSample = getBytesPerSample(srcFormat);
            const srcIsPlanar = formatIsPlanar(srcFormat);
            for(let i = 0; i < copyFrameCount; i++){
                if (destIsPlanar) {
                    const destOffset = i * destBytesPerSample;
                    let srcOffset;
                    if (srcIsPlanar) srcOffset = (planeIndex * numFrames + (i + frameOffset)) * srcBytesPerSample;
                    else srcOffset = ((i + frameOffset) * numChannels + planeIndex) * srcBytesPerSample;
                    const normalized = readFn(srcView, srcOffset);
                    writeFn(destView, destOffset, normalized);
                } else for(let ch = 0; ch < numChannels; ch++){
                    const destIndex = i * numChannels + ch;
                    const destOffset = destIndex * destBytesPerSample;
                    let srcOffset;
                    if (srcIsPlanar) srcOffset = (ch * numFrames + (i + frameOffset)) * srcBytesPerSample;
                    else srcOffset = ((i + frameOffset) * numChannels + ch) * srcBytesPerSample;
                    const normalized = readFn(srcView, srcOffset);
                    writeFn(destView, destOffset, normalized);
                }
            }
        }
    }
    /** Clones this audio sample. */ clone() {
        if (this._closed) throw new Error('AudioSample is closed.');
        if (isAudioData(this._data)) {
            const sample = new AudioSample(this._data.clone());
            sample.setTimestamp(this.timestamp); // Make sure the timestamp is precise (beyond microsecond accuracy)
            return sample;
        } else return new AudioSample({
            format: this.format,
            sampleRate: this.sampleRate,
            numberOfFrames: this.numberOfFrames,
            numberOfChannels: this.numberOfChannels,
            timestamp: this.timestamp,
            data: this._data
        });
    }
    /**
     * Closes this audio sample, releasing held resources. Audio samples should be closed as soon as they are not
     * needed anymore.
     */ close() {
        if (this._closed) return;
        finalizationRegistry?.unregister(this);
        if (isAudioData(this._data)) this._data.close();
        else this._data = new Uint8Array(0);
        this._closed = true;
    }
    /**
     * Converts this audio sample to an AudioData for use with the WebCodecs API. The AudioData returned by this
     * method *must* be closed separately from this audio sample.
     */ toAudioData() {
        if (this._closed) throw new Error('AudioSample is closed.');
        if (isAudioData(this._data)) {
            if (this._data.timestamp === this.microsecondTimestamp) // Timestamp matches, let's just return the data (but cloned)
            return this._data.clone();
            else // It's impossible to simply change an AudioData's timestamp, so we'll need to create a new one
            if (formatIsPlanar(this.format)) {
                const size = this.allocationSize({
                    planeIndex: 0,
                    format: this.format
                });
                const data = new ArrayBuffer(size * this.numberOfChannels);
                // We gotta read out each plane individually
                for(let i = 0; i < this.numberOfChannels; i++)this.copyTo(new Uint8Array(data, i * size, size), {
                    planeIndex: i,
                    format: this.format
                });
                return new AudioData({
                    format: this.format,
                    sampleRate: this.sampleRate,
                    numberOfFrames: this.numberOfFrames,
                    numberOfChannels: this.numberOfChannels,
                    timestamp: this.microsecondTimestamp,
                    data
                });
            } else {
                const data = new ArrayBuffer(this.allocationSize({
                    planeIndex: 0,
                    format: this.format
                }));
                this.copyTo(data, {
                    planeIndex: 0,
                    format: this.format
                });
                return new AudioData({
                    format: this.format,
                    sampleRate: this.sampleRate,
                    numberOfFrames: this.numberOfFrames,
                    numberOfChannels: this.numberOfChannels,
                    timestamp: this.microsecondTimestamp,
                    data
                });
            }
        } else return new AudioData({
            format: this.format,
            sampleRate: this.sampleRate,
            numberOfFrames: this.numberOfFrames,
            numberOfChannels: this.numberOfChannels,
            timestamp: this.microsecondTimestamp,
            data: this._data.buffer instanceof ArrayBuffer ? this._data.buffer : this._data.slice()
        });
    }
    /** Convert this audio sample to an AudioBuffer for use with the Web Audio API. */ toAudioBuffer() {
        if (this._closed) throw new Error('AudioSample is closed.');
        const audioBuffer = new AudioBuffer({
            numberOfChannels: this.numberOfChannels,
            length: this.numberOfFrames,
            sampleRate: this.sampleRate
        });
        const dataBytes = new Float32Array(this.allocationSize({
            planeIndex: 0,
            format: 'f32-planar'
        }) / 4);
        for(let i = 0; i < this.numberOfChannels; i++){
            this.copyTo(dataBytes, {
                planeIndex: i,
                format: 'f32-planar'
            });
            audioBuffer.copyToChannel(dataBytes, i);
        }
        return audioBuffer;
    }
    /** Sets the presentation timestamp of this audio sample, in seconds. */ setTimestamp(newTimestamp) {
        if (!Number.isFinite(newTimestamp)) throw new TypeError('newTimestamp must be a number.');
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        this.timestamp = newTimestamp;
    }
    /** Calls `.close()`. */ [Symbol.dispose]() {
        this.close();
    }
    /** @internal */ static *_fromAudioBuffer(audioBuffer, timestamp) {
        if (!(audioBuffer instanceof AudioBuffer)) throw new TypeError('audioBuffer must be an AudioBuffer.');
        const MAX_FLOAT_COUNT = 240000; // 5 seconds of mono 48 kHz audio per sample
        const numberOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const totalFrames = audioBuffer.length;
        const maxFramesPerChunk = Math.floor(MAX_FLOAT_COUNT / numberOfChannels);
        let currentRelativeFrame = 0;
        let remainingFrames = totalFrames;
        // Create AudioSamples in a chunked fashion so we don't create huge Float32Arrays
        while(remainingFrames > 0){
            const framesToCopy = Math.min(maxFramesPerChunk, remainingFrames);
            const chunkData = new Float32Array(numberOfChannels * framesToCopy);
            for(let channel = 0; channel < numberOfChannels; channel++)audioBuffer.copyFromChannel(chunkData.subarray(channel * framesToCopy, (channel + 1) * framesToCopy), channel, currentRelativeFrame);
            yield new AudioSample({
                format: 'f32-planar',
                sampleRate,
                numberOfFrames: framesToCopy,
                numberOfChannels,
                timestamp: timestamp + currentRelativeFrame / sampleRate,
                data: chunkData
            });
            currentRelativeFrame += framesToCopy;
            remainingFrames -= framesToCopy;
        }
    }
    /**
     * Creates AudioSamples from an AudioBuffer, starting at the given timestamp in seconds. Typically creates exactly
     * one sample, but may create multiple if the AudioBuffer is exceedingly large.
     */ static fromAudioBuffer(audioBuffer, timestamp) {
        if (!(audioBuffer instanceof AudioBuffer)) throw new TypeError('audioBuffer must be an AudioBuffer.');
        const MAX_FLOAT_COUNT = 240000; // 5 seconds of mono 48 kHz audio per sample
        const numberOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const totalFrames = audioBuffer.length;
        const maxFramesPerChunk = Math.floor(MAX_FLOAT_COUNT / numberOfChannels);
        let currentRelativeFrame = 0;
        let remainingFrames = totalFrames;
        const result = [];
        // Create AudioSamples in a chunked fashion so we don't create huge Float32Arrays
        while(remainingFrames > 0){
            const framesToCopy = Math.min(maxFramesPerChunk, remainingFrames);
            const chunkData = new Float32Array(numberOfChannels * framesToCopy);
            for(let channel = 0; channel < numberOfChannels; channel++)audioBuffer.copyFromChannel(chunkData.subarray(channel * framesToCopy, (channel + 1) * framesToCopy), channel, currentRelativeFrame);
            const audioSample = new AudioSample({
                format: 'f32-planar',
                sampleRate,
                numberOfFrames: framesToCopy,
                numberOfChannels,
                timestamp: timestamp + currentRelativeFrame / sampleRate,
                data: chunkData
            });
            result.push(audioSample);
            currentRelativeFrame += framesToCopy;
            remainingFrames -= framesToCopy;
        }
        return result;
    }
}
const getBytesPerSample = (format)=>{
    switch(format){
        case 'u8':
        case 'u8-planar':
            return 1;
        case 's16':
        case 's16-planar':
            return 2;
        case 's32':
        case 's32-planar':
            return 4;
        case 'f32':
        case 'f32-planar':
            return 4;
        default:
            throw new Error('Unknown AudioSampleFormat');
    }
};
const formatIsPlanar = (format)=>{
    switch(format){
        case 'u8-planar':
        case 's16-planar':
        case 's32-planar':
        case 'f32-planar':
            return true;
        default:
            return false;
    }
};
const getReadFunction = (format)=>{
    switch(format){
        case 'u8':
        case 'u8-planar':
            return (view, offset)=>(view.getUint8(offset) - 128) / 128;
        case 's16':
        case 's16-planar':
            return (view, offset)=>view.getInt16(offset, true) / 32768;
        case 's32':
        case 's32-planar':
            return (view, offset)=>view.getInt32(offset, true) / 2147483648;
        case 'f32':
        case 'f32-planar':
            return (view, offset)=>view.getFloat32(offset, true);
    }
};
const getWriteFunction = (format)=>{
    switch(format){
        case 'u8':
        case 'u8-planar':
            return (view, offset, value)=>view.setUint8(offset, (0, _miscJs.clamp)((value + 1) * 127.5, 0, 255));
        case 's16':
        case 's16-planar':
            return (view, offset, value)=>view.setInt16(offset, (0, _miscJs.clamp)(Math.round(value * 32767), -32768, 32767), true);
        case 's32':
        case 's32-planar':
            return (view, offset, value)=>view.setInt32(offset, (0, _miscJs.clamp)(Math.round(value * 2147483647), -2147483648, 2147483647), true);
        case 'f32':
        case 'f32-planar':
            return (view, offset, value)=>view.setFloat32(offset, value, true);
    }
};
const isAudioData = (x)=>{
    return typeof AudioData !== 'undefined' && x instanceof AudioData;
};

},{"./misc.js":"kkhLS","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2usK6":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "buildIsobmffMimeType", ()=>buildIsobmffMimeType);
const buildIsobmffMimeType = (info)=>{
    const base = info.hasVideo ? 'video/' : info.hasAudio ? 'audio/' : 'application/';
    let string = base + (info.isQuickTime ? 'quicktime' : 'mp4');
    if (info.codecStrings.length > 0) {
        const uniqueCodecMimeTypes = [
            ...new Set(info.codecStrings)
        ];
        string += `; codecs="${uniqueCodecMimeTypes.join(', ')}"`;
    }
    return string;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"hjB9E":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MIN_BOX_HEADER_SIZE", ()=>MIN_BOX_HEADER_SIZE);
parcelHelpers.export(exports, "MAX_BOX_HEADER_SIZE", ()=>MAX_BOX_HEADER_SIZE);
parcelHelpers.export(exports, "readBoxHeader", ()=>readBoxHeader);
parcelHelpers.export(exports, "readFixed_16_16", ()=>readFixed_16_16);
parcelHelpers.export(exports, "readFixed_2_30", ()=>readFixed_2_30);
parcelHelpers.export(exports, "readIsomVariableInteger", ()=>readIsomVariableInteger);
parcelHelpers.export(exports, "readMetadataStringShort", ()=>readMetadataStringShort);
parcelHelpers.export(exports, "readDataBox", ()=>readDataBox);
var _metadataJs = require("../metadata.js");
var _miscJs = require("../misc.js");
var _readerJs = require("../reader.js");
const MIN_BOX_HEADER_SIZE = 8;
const MAX_BOX_HEADER_SIZE = 16;
const readBoxHeader = (slice)=>{
    let totalSize = (0, _readerJs.readU32Be)(slice);
    const name = (0, _readerJs.readAscii)(slice, 4);
    let headerSize = 8;
    const hasLargeSize = totalSize === 1;
    if (hasLargeSize) {
        totalSize = (0, _readerJs.readU64Be)(slice);
        headerSize = 16;
    }
    const contentSize = totalSize - headerSize;
    if (contentSize < 0) return null; // Hardly a box is it
    return {
        name,
        totalSize,
        headerSize,
        contentSize
    };
};
const readFixed_16_16 = (slice)=>{
    return (0, _readerJs.readI32Be)(slice) / 0x10000;
};
const readFixed_2_30 = (slice)=>{
    return (0, _readerJs.readI32Be)(slice) / 0x40000000;
};
const readIsomVariableInteger = (slice)=>{
    let result = 0;
    for(let i = 0; i < 4; i++){
        result <<= 7;
        const nextByte = (0, _readerJs.readU8)(slice);
        result |= nextByte & 0x7f;
        if ((nextByte & 0x80) === 0) break;
    }
    return result;
};
const readMetadataStringShort = (slice)=>{
    let stringLength = (0, _readerJs.readU16Be)(slice);
    slice.skip(2); // Language
    stringLength = Math.min(stringLength, slice.remainingLength);
    return (0, _miscJs.textDecoder).decode((0, _readerJs.readBytes)(slice, stringLength));
};
const readDataBox = (slice)=>{
    const header = readBoxHeader(slice);
    if (!header || header.name !== 'data') return null;
    if (slice.remainingLength < 8) // Box is too small
    return null;
    const typeIndicator = (0, _readerJs.readU32Be)(slice);
    slice.skip(4); // Locale indicator
    const data = (0, _readerJs.readBytes)(slice, header.contentSize - 8);
    switch(typeIndicator){
        case 1:
            return (0, _miscJs.textDecoder).decode(data); // UTF-8
        case 2:
            return new TextDecoder('utf-16be').decode(data); // UTF-16-BE
        case 13:
            return new (0, _metadataJs.RichImageData)(data, 'image/jpeg');
        case 14:
            return new (0, _metadataJs.RichImageData)(data, 'image/png');
        case 27:
            return new (0, _metadataJs.RichImageData)(data, 'image/bmp');
        default:
            return data;
    }
};

},{"../metadata.js":"3j8h1","../misc.js":"kkhLS","../reader.js":"fr2Ka","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"3j8h1":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ /**
 * Image data with additional metadata.
 *
 * @group Metadata tags
 * @public
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "RichImageData", ()=>RichImageData);
/**
 * A file attached to a media file.
 *
 * @group Metadata tags
 * @public
 */ parcelHelpers.export(exports, "AttachedFile", ()=>AttachedFile);
parcelHelpers.export(exports, "validateMetadataTags", ()=>validateMetadataTags);
parcelHelpers.export(exports, "metadataTagsAreEmpty", ()=>metadataTagsAreEmpty);
parcelHelpers.export(exports, "DEFAULT_TRACK_DISPOSITION", ()=>DEFAULT_TRACK_DISPOSITION);
parcelHelpers.export(exports, "validateTrackDisposition", ()=>validateTrackDisposition);
class RichImageData {
    /** Creates a new {@link RichImageData}. */ constructor(/** The raw image data. */ data, /** An RFC 6838 MIME type (e.g. image/jpeg, image/png, etc.) */ mimeType){
        this.data = data;
        this.mimeType = mimeType;
        if (!(data instanceof Uint8Array)) throw new TypeError('data must be a Uint8Array.');
        if (typeof mimeType !== 'string') throw new TypeError('mimeType must be a string.');
    }
}
class AttachedFile {
    /** Creates a new {@link AttachedFile}. */ constructor(/** The raw file data. */ data, /** An RFC 6838 MIME type (e.g. image/jpeg, image/png, font/ttf, etc.) */ mimeType, /** The name of the file. */ name, /** A description of the file. */ description){
        this.data = data;
        this.mimeType = mimeType;
        this.name = name;
        this.description = description;
        if (!(data instanceof Uint8Array)) throw new TypeError('data must be a Uint8Array.');
        if (mimeType !== undefined && typeof mimeType !== 'string') throw new TypeError('mimeType, when provided, must be a string.');
        if (name !== undefined && typeof name !== 'string') throw new TypeError('name, when provided, must be a string.');
        if (description !== undefined && typeof description !== 'string') throw new TypeError('description, when provided, must be a string.');
    }
}
const validateMetadataTags = (tags)=>{
    if (!tags || typeof tags !== 'object') throw new TypeError('tags must be an object.');
    if (tags.title !== undefined && typeof tags.title !== 'string') throw new TypeError('tags.title, when provided, must be a string.');
    if (tags.description !== undefined && typeof tags.description !== 'string') throw new TypeError('tags.description, when provided, must be a string.');
    if (tags.artist !== undefined && typeof tags.artist !== 'string') throw new TypeError('tags.artist, when provided, must be a string.');
    if (tags.album !== undefined && typeof tags.album !== 'string') throw new TypeError('tags.album, when provided, must be a string.');
    if (tags.albumArtist !== undefined && typeof tags.albumArtist !== 'string') throw new TypeError('tags.albumArtist, when provided, must be a string.');
    if (tags.trackNumber !== undefined && (!Number.isInteger(tags.trackNumber) || tags.trackNumber <= 0)) throw new TypeError('tags.trackNumber, when provided, must be a positive integer.');
    if (tags.tracksTotal !== undefined && (!Number.isInteger(tags.tracksTotal) || tags.tracksTotal <= 0)) throw new TypeError('tags.tracksTotal, when provided, must be a positive integer.');
    if (tags.discNumber !== undefined && (!Number.isInteger(tags.discNumber) || tags.discNumber <= 0)) throw new TypeError('tags.discNumber, when provided, must be a positive integer.');
    if (tags.discsTotal !== undefined && (!Number.isInteger(tags.discsTotal) || tags.discsTotal <= 0)) throw new TypeError('tags.discsTotal, when provided, must be a positive integer.');
    if (tags.genre !== undefined && typeof tags.genre !== 'string') throw new TypeError('tags.genre, when provided, must be a string.');
    if (tags.date !== undefined && (!(tags.date instanceof Date) || Number.isNaN(tags.date.getTime()))) throw new TypeError('tags.date, when provided, must be a valid Date.');
    if (tags.lyrics !== undefined && typeof tags.lyrics !== 'string') throw new TypeError('tags.lyrics, when provided, must be a string.');
    if (tags.images !== undefined) {
        if (!Array.isArray(tags.images)) throw new TypeError('tags.images, when provided, must be an array.');
        for (const image of tags.images){
            if (!image || typeof image !== 'object') throw new TypeError('Each image in tags.images must be an object.');
            if (!(image.data instanceof Uint8Array)) throw new TypeError('Each image.data must be a Uint8Array.');
            if (typeof image.mimeType !== 'string') throw new TypeError('Each image.mimeType must be a string.');
            if (![
                'coverFront',
                'coverBack',
                'unknown'
            ].includes(image.kind)) throw new TypeError('Each image.kind must be \'coverFront\', \'coverBack\', or \'unknown\'.');
        }
    }
    if (tags.comment !== undefined && typeof tags.comment !== 'string') throw new TypeError('tags.comment, when provided, must be a string.');
    if (tags.raw !== undefined) {
        if (!tags.raw || typeof tags.raw !== 'object') throw new TypeError('tags.raw, when provided, must be an object.');
        for (const value of Object.values(tags.raw)){
            if (value !== null && typeof value !== 'string' && !(value instanceof Uint8Array) && !(value instanceof RichImageData) && !(value instanceof AttachedFile)) throw new TypeError('Each value in tags.raw must be a string, Uint8Array, RichImageData, AttachedFile, or null.');
        }
    }
};
const metadataTagsAreEmpty = (tags)=>{
    return tags.title === undefined && tags.description === undefined && tags.artist === undefined && tags.album === undefined && tags.albumArtist === undefined && tags.trackNumber === undefined && tags.tracksTotal === undefined && tags.discNumber === undefined && tags.discsTotal === undefined && tags.genre === undefined && tags.date === undefined && tags.lyrics === undefined && (!tags.images || tags.images.length === 0) && tags.comment === undefined && (tags.raw === undefined || Object.keys(tags.raw).length === 0);
};
const DEFAULT_TRACK_DISPOSITION = {
    default: true,
    forced: false,
    original: false,
    commentary: false,
    hearingImpaired: false,
    visuallyImpaired: false
};
const validateTrackDisposition = (disposition)=>{
    if (!disposition || typeof disposition !== 'object') throw new TypeError('disposition must be an object.');
    if (disposition.default !== undefined && typeof disposition.default !== 'boolean') throw new TypeError('disposition.default must be a boolean.');
    if (disposition.forced !== undefined && typeof disposition.forced !== 'boolean') throw new TypeError('disposition.forced must be a boolean.');
    if (disposition.original !== undefined && typeof disposition.original !== 'boolean') throw new TypeError('disposition.original must be a boolean.');
    if (disposition.commentary !== undefined && typeof disposition.commentary !== 'boolean') throw new TypeError('disposition.commentary must be a boolean.');
    if (disposition.hearingImpaired !== undefined && typeof disposition.hearingImpaired !== 'boolean') throw new TypeError('disposition.hearingImpaired must be a boolean.');
    if (disposition.visuallyImpaired !== undefined && typeof disposition.visuallyImpaired !== 'boolean') throw new TypeError('disposition.visuallyImpaired must be a boolean.');
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"fr2Ka":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Reader", ()=>Reader);
parcelHelpers.export(exports, "FileSlice", ()=>FileSlice);
parcelHelpers.export(exports, "readBytes", ()=>readBytes);
parcelHelpers.export(exports, "readU8", ()=>readU8);
parcelHelpers.export(exports, "readU16", ()=>readU16);
parcelHelpers.export(exports, "readU16Be", ()=>readU16Be);
parcelHelpers.export(exports, "readU24Be", ()=>readU24Be);
parcelHelpers.export(exports, "readI16Be", ()=>readI16Be);
parcelHelpers.export(exports, "readU32", ()=>readU32);
parcelHelpers.export(exports, "readU32Be", ()=>readU32Be);
parcelHelpers.export(exports, "readU32Le", ()=>readU32Le);
parcelHelpers.export(exports, "readI32Be", ()=>readI32Be);
parcelHelpers.export(exports, "readI32Le", ()=>readI32Le);
parcelHelpers.export(exports, "readU64", ()=>readU64);
parcelHelpers.export(exports, "readU64Be", ()=>readU64Be);
parcelHelpers.export(exports, "readI64Be", ()=>readI64Be);
parcelHelpers.export(exports, "readI64Le", ()=>readI64Le);
parcelHelpers.export(exports, "readF32Be", ()=>readF32Be);
parcelHelpers.export(exports, "readF64Be", ()=>readF64Be);
parcelHelpers.export(exports, "readAscii", ()=>readAscii);
var _inputJs = require("./input.js");
var _miscJs = require("./misc.js");
class Reader {
    constructor(source){
        this.source = source;
    }
    requestSlice(start, length) {
        if (this.source._disposed) throw new (0, _inputJs.InputDisposedError)();
        if (this.fileSize !== null && start + length > this.fileSize) return null;
        const end = start + length;
        const result = this.source._read(start, end);
        if (result instanceof Promise) return result.then((x)=>{
            if (!x) return null;
            return new FileSlice(x.bytes, x.view, x.offset, start, end);
        });
        else {
            if (!result) return null;
            return new FileSlice(result.bytes, result.view, result.offset, start, end);
        }
    }
    requestSliceRange(start, minLength, maxLength) {
        if (this.source._disposed) throw new (0, _inputJs.InputDisposedError)();
        if (this.fileSize !== null) return this.requestSlice(start, (0, _miscJs.clamp)(this.fileSize - start, minLength, maxLength));
        else {
            const promisedAttempt = this.requestSlice(start, maxLength);
            const handleAttempt = (attempt)=>{
                if (attempt) return attempt;
                const handleFileSize = (fileSize)=>{
                    (0, _miscJs.assert)(fileSize !== null); // The slice couldn't fit, meaning we must know the file size now
                    return this.requestSlice(start, (0, _miscJs.clamp)(fileSize - start, minLength, maxLength));
                };
                const promisedFileSize = this.source._retrieveSize();
                if (promisedFileSize instanceof Promise) return promisedFileSize.then(handleFileSize);
                else return handleFileSize(promisedFileSize);
            };
            if (promisedAttempt instanceof Promise) return promisedAttempt.then(handleAttempt);
            else return handleAttempt(promisedAttempt);
        }
    }
}
class FileSlice {
    constructor(/** The underlying bytes backing this slice. Avoid using this directly and prefer reader functions instead. */ bytes, /** A view into the bytes backing this slice. Avoid using this directly and prefer reader functions instead. */ view, /** The offset in "file bytes" at which `bytes` begins in the file. */ offset, /** The offset in "file bytes" where this slice begins. */ start, /** The offset in "file bytes" where this slice ends (exclusive). */ end){
        this.bytes = bytes;
        this.view = view;
        this.offset = offset;
        this.start = start;
        this.end = end;
        this.bufferPos = start - offset;
    }
    static tempFromBytes(bytes) {
        return new FileSlice(bytes, (0, _miscJs.toDataView)(bytes), 0, 0, bytes.length);
    }
    get length() {
        return this.end - this.start;
    }
    get filePos() {
        return this.offset + this.bufferPos;
    }
    set filePos(value) {
        this.bufferPos = value - this.offset;
    }
    /** The number of bytes left from the current pos to the end of the slice. */ get remainingLength() {
        return Math.max(this.end - this.filePos, 0);
    }
    skip(byteCount) {
        this.bufferPos += byteCount;
    }
    /** Creates a new subslice of this slice whose byte range must be contained within this slice. */ slice(filePos, length = this.end - filePos) {
        if (filePos < this.start || filePos + length > this.end) throw new RangeError('Slicing outside of original slice.');
        return new FileSlice(this.bytes, this.view, this.offset, filePos, filePos + length);
    }
}
const checkIsInRange = (slice, bytesToRead)=>{
    if (slice.filePos < slice.start || slice.filePos + bytesToRead > slice.end) throw new RangeError(`Tried reading [${slice.filePos}, ${slice.filePos + bytesToRead}), but slice is` + ` [${slice.start}, ${slice.end}). This is likely an internal error, please report it alongside the file` + ` that caused it.`);
};
const readBytes = (slice, length)=>{
    checkIsInRange(slice, length);
    const bytes = slice.bytes.subarray(slice.bufferPos, slice.bufferPos + length);
    slice.bufferPos += length;
    return bytes;
};
const readU8 = (slice)=>{
    checkIsInRange(slice, 1);
    return slice.view.getUint8(slice.bufferPos++);
};
const readU16 = (slice, littleEndian)=>{
    checkIsInRange(slice, 2);
    const value = slice.view.getUint16(slice.bufferPos, littleEndian);
    slice.bufferPos += 2;
    return value;
};
const readU16Be = (slice)=>{
    checkIsInRange(slice, 2);
    const value = slice.view.getUint16(slice.bufferPos, false);
    slice.bufferPos += 2;
    return value;
};
const readU24Be = (slice)=>{
    checkIsInRange(slice, 3);
    const value = (0, _miscJs.getUint24)(slice.view, slice.bufferPos, false);
    slice.bufferPos += 3;
    return value;
};
const readI16Be = (slice)=>{
    checkIsInRange(slice, 2);
    const value = slice.view.getInt16(slice.bufferPos, false);
    slice.bufferPos += 2;
    return value;
};
const readU32 = (slice, littleEndian)=>{
    checkIsInRange(slice, 4);
    const value = slice.view.getUint32(slice.bufferPos, littleEndian);
    slice.bufferPos += 4;
    return value;
};
const readU32Be = (slice)=>{
    checkIsInRange(slice, 4);
    const value = slice.view.getUint32(slice.bufferPos, false);
    slice.bufferPos += 4;
    return value;
};
const readU32Le = (slice)=>{
    checkIsInRange(slice, 4);
    const value = slice.view.getUint32(slice.bufferPos, true);
    slice.bufferPos += 4;
    return value;
};
const readI32Be = (slice)=>{
    checkIsInRange(slice, 4);
    const value = slice.view.getInt32(slice.bufferPos, false);
    slice.bufferPos += 4;
    return value;
};
const readI32Le = (slice)=>{
    checkIsInRange(slice, 4);
    const value = slice.view.getInt32(slice.bufferPos, true);
    slice.bufferPos += 4;
    return value;
};
const readU64 = (slice, littleEndian)=>{
    let low;
    let high;
    if (littleEndian) {
        low = readU32(slice, true);
        high = readU32(slice, true);
    } else {
        high = readU32(slice, false);
        low = readU32(slice, false);
    }
    return high * 0x100000000 + low;
};
const readU64Be = (slice)=>{
    const high = readU32Be(slice);
    const low = readU32Be(slice);
    return high * 0x100000000 + low;
};
const readI64Be = (slice)=>{
    const high = readI32Be(slice);
    const low = readU32Be(slice);
    return high * 0x100000000 + low;
};
const readI64Le = (slice)=>{
    const low = readU32Le(slice);
    const high = readI32Le(slice);
    return high * 0x100000000 + low;
};
const readF32Be = (slice)=>{
    checkIsInRange(slice, 4);
    const value = slice.view.getFloat32(slice.bufferPos, false);
    slice.bufferPos += 4;
    return value;
};
const readF64Be = (slice)=>{
    checkIsInRange(slice, 8);
    const value = slice.view.getFloat64(slice.bufferPos, false);
    slice.bufferPos += 8;
    return value;
};
const readAscii = (slice, length)=>{
    checkIsInRange(slice, length);
    let str = '';
    for(let i = 0; i < length; i++)str += String.fromCharCode(slice.bytes[slice.bufferPos++]);
    return str;
};

},{"./input.js":"4IqVo","./misc.js":"kkhLS","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"b6nkD":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/** Wrapper around a number to be able to differentiate it in the writer. */ parcelHelpers.export(exports, "EBMLFloat32", ()=>EBMLFloat32);
/** Wrapper around a number to be able to differentiate it in the writer. */ parcelHelpers.export(exports, "EBMLFloat64", ()=>EBMLFloat64);
/** Wrapper around a number to be able to differentiate it in the writer. */ parcelHelpers.export(exports, "EBMLSignedInt", ()=>EBMLSignedInt);
parcelHelpers.export(exports, "EBMLUnicodeString", ()=>EBMLUnicodeString);
parcelHelpers.export(exports, "EBMLId", ()=>EBMLId);
parcelHelpers.export(exports, "LEVEL_0_EBML_IDS", ()=>LEVEL_0_EBML_IDS);
parcelHelpers.export(exports, "LEVEL_1_EBML_IDS", ()=>LEVEL_1_EBML_IDS);
parcelHelpers.export(exports, "LEVEL_0_AND_1_EBML_IDS", ()=>LEVEL_0_AND_1_EBML_IDS);
parcelHelpers.export(exports, "measureUnsignedInt", ()=>measureUnsignedInt);
parcelHelpers.export(exports, "measureUnsignedBigInt", ()=>measureUnsignedBigInt);
parcelHelpers.export(exports, "measureSignedInt", ()=>measureSignedInt);
parcelHelpers.export(exports, "measureVarInt", ()=>measureVarInt);
parcelHelpers.export(exports, "EBMLWriter", ()=>EBMLWriter);
parcelHelpers.export(exports, "MAX_VAR_INT_SIZE", ()=>MAX_VAR_INT_SIZE);
parcelHelpers.export(exports, "MIN_HEADER_SIZE", ()=>MIN_HEADER_SIZE);
parcelHelpers.export(exports, "MAX_HEADER_SIZE", ()=>MAX_HEADER_SIZE);
parcelHelpers.export(exports, "readVarIntSize", ()=>readVarIntSize);
parcelHelpers.export(exports, "readVarInt", ()=>readVarInt);
parcelHelpers.export(exports, "readUnsignedInt", ()=>readUnsignedInt);
parcelHelpers.export(exports, "readUnsignedBigInt", ()=>readUnsignedBigInt);
parcelHelpers.export(exports, "readSignedInt", ()=>readSignedInt);
parcelHelpers.export(exports, "readElementId", ()=>readElementId);
parcelHelpers.export(exports, "readElementSize", ()=>readElementSize);
parcelHelpers.export(exports, "readElementHeader", ()=>readElementHeader);
parcelHelpers.export(exports, "readAsciiString", ()=>readAsciiString);
parcelHelpers.export(exports, "readUnicodeString", ()=>readUnicodeString);
parcelHelpers.export(exports, "readFloat", ()=>readFloat);
parcelHelpers.export(exports, "searchForNextElementId", ()=>searchForNextElementId);
parcelHelpers.export(exports, "resync", ()=>resync);
parcelHelpers.export(exports, "CODEC_STRING_MAP", ()=>CODEC_STRING_MAP);
parcelHelpers.export(exports, "assertDefinedSize", ()=>assertDefinedSize);
var _miscJs = require("../misc.js");
var _readerJs = require("../reader.js");
class EBMLFloat32 {
    constructor(value){
        this.value = value;
    }
}
class EBMLFloat64 {
    constructor(value){
        this.value = value;
    }
}
class EBMLSignedInt {
    constructor(value){
        this.value = value;
    }
}
class EBMLUnicodeString {
    constructor(value){
        this.value = value;
    }
}
var EBMLId;
(function(EBMLId) {
    EBMLId[EBMLId["EBML"] = 440786851] = "EBML";
    EBMLId[EBMLId["EBMLVersion"] = 17030] = "EBMLVersion";
    EBMLId[EBMLId["EBMLReadVersion"] = 17143] = "EBMLReadVersion";
    EBMLId[EBMLId["EBMLMaxIDLength"] = 17138] = "EBMLMaxIDLength";
    EBMLId[EBMLId["EBMLMaxSizeLength"] = 17139] = "EBMLMaxSizeLength";
    EBMLId[EBMLId["DocType"] = 17026] = "DocType";
    EBMLId[EBMLId["DocTypeVersion"] = 17031] = "DocTypeVersion";
    EBMLId[EBMLId["DocTypeReadVersion"] = 17029] = "DocTypeReadVersion";
    EBMLId[EBMLId["Void"] = 236] = "Void";
    EBMLId[EBMLId["Segment"] = 408125543] = "Segment";
    EBMLId[EBMLId["SeekHead"] = 290298740] = "SeekHead";
    EBMLId[EBMLId["Seek"] = 19899] = "Seek";
    EBMLId[EBMLId["SeekID"] = 21419] = "SeekID";
    EBMLId[EBMLId["SeekPosition"] = 21420] = "SeekPosition";
    EBMLId[EBMLId["Duration"] = 17545] = "Duration";
    EBMLId[EBMLId["Info"] = 357149030] = "Info";
    EBMLId[EBMLId["TimestampScale"] = 2807729] = "TimestampScale";
    EBMLId[EBMLId["MuxingApp"] = 19840] = "MuxingApp";
    EBMLId[EBMLId["WritingApp"] = 22337] = "WritingApp";
    EBMLId[EBMLId["Tracks"] = 374648427] = "Tracks";
    EBMLId[EBMLId["TrackEntry"] = 174] = "TrackEntry";
    EBMLId[EBMLId["TrackNumber"] = 215] = "TrackNumber";
    EBMLId[EBMLId["TrackUID"] = 29637] = "TrackUID";
    EBMLId[EBMLId["TrackType"] = 131] = "TrackType";
    EBMLId[EBMLId["FlagEnabled"] = 185] = "FlagEnabled";
    EBMLId[EBMLId["FlagDefault"] = 136] = "FlagDefault";
    EBMLId[EBMLId["FlagForced"] = 21930] = "FlagForced";
    EBMLId[EBMLId["FlagOriginal"] = 21934] = "FlagOriginal";
    EBMLId[EBMLId["FlagHearingImpaired"] = 21931] = "FlagHearingImpaired";
    EBMLId[EBMLId["FlagVisualImpaired"] = 21932] = "FlagVisualImpaired";
    EBMLId[EBMLId["FlagCommentary"] = 21935] = "FlagCommentary";
    EBMLId[EBMLId["FlagLacing"] = 156] = "FlagLacing";
    EBMLId[EBMLId["Name"] = 21358] = "Name";
    EBMLId[EBMLId["Language"] = 2274716] = "Language";
    EBMLId[EBMLId["LanguageBCP47"] = 2274717] = "LanguageBCP47";
    EBMLId[EBMLId["CodecID"] = 134] = "CodecID";
    EBMLId[EBMLId["CodecPrivate"] = 25506] = "CodecPrivate";
    EBMLId[EBMLId["CodecDelay"] = 22186] = "CodecDelay";
    EBMLId[EBMLId["SeekPreRoll"] = 22203] = "SeekPreRoll";
    EBMLId[EBMLId["DefaultDuration"] = 2352003] = "DefaultDuration";
    EBMLId[EBMLId["Video"] = 224] = "Video";
    EBMLId[EBMLId["PixelWidth"] = 176] = "PixelWidth";
    EBMLId[EBMLId["PixelHeight"] = 186] = "PixelHeight";
    EBMLId[EBMLId["AlphaMode"] = 21440] = "AlphaMode";
    EBMLId[EBMLId["Audio"] = 225] = "Audio";
    EBMLId[EBMLId["SamplingFrequency"] = 181] = "SamplingFrequency";
    EBMLId[EBMLId["Channels"] = 159] = "Channels";
    EBMLId[EBMLId["BitDepth"] = 25188] = "BitDepth";
    EBMLId[EBMLId["SimpleBlock"] = 163] = "SimpleBlock";
    EBMLId[EBMLId["BlockGroup"] = 160] = "BlockGroup";
    EBMLId[EBMLId["Block"] = 161] = "Block";
    EBMLId[EBMLId["BlockAdditions"] = 30113] = "BlockAdditions";
    EBMLId[EBMLId["BlockMore"] = 166] = "BlockMore";
    EBMLId[EBMLId["BlockAdditional"] = 165] = "BlockAdditional";
    EBMLId[EBMLId["BlockAddID"] = 238] = "BlockAddID";
    EBMLId[EBMLId["BlockDuration"] = 155] = "BlockDuration";
    EBMLId[EBMLId["ReferenceBlock"] = 251] = "ReferenceBlock";
    EBMLId[EBMLId["Cluster"] = 524531317] = "Cluster";
    EBMLId[EBMLId["Timestamp"] = 231] = "Timestamp";
    EBMLId[EBMLId["Cues"] = 475249515] = "Cues";
    EBMLId[EBMLId["CuePoint"] = 187] = "CuePoint";
    EBMLId[EBMLId["CueTime"] = 179] = "CueTime";
    EBMLId[EBMLId["CueTrackPositions"] = 183] = "CueTrackPositions";
    EBMLId[EBMLId["CueTrack"] = 247] = "CueTrack";
    EBMLId[EBMLId["CueClusterPosition"] = 241] = "CueClusterPosition";
    EBMLId[EBMLId["Colour"] = 21936] = "Colour";
    EBMLId[EBMLId["MatrixCoefficients"] = 21937] = "MatrixCoefficients";
    EBMLId[EBMLId["TransferCharacteristics"] = 21946] = "TransferCharacteristics";
    EBMLId[EBMLId["Primaries"] = 21947] = "Primaries";
    EBMLId[EBMLId["Range"] = 21945] = "Range";
    EBMLId[EBMLId["Projection"] = 30320] = "Projection";
    EBMLId[EBMLId["ProjectionType"] = 30321] = "ProjectionType";
    EBMLId[EBMLId["ProjectionPoseRoll"] = 30325] = "ProjectionPoseRoll";
    EBMLId[EBMLId["Attachments"] = 423732329] = "Attachments";
    EBMLId[EBMLId["AttachedFile"] = 24999] = "AttachedFile";
    EBMLId[EBMLId["FileDescription"] = 18046] = "FileDescription";
    EBMLId[EBMLId["FileName"] = 18030] = "FileName";
    EBMLId[EBMLId["FileMediaType"] = 18016] = "FileMediaType";
    EBMLId[EBMLId["FileData"] = 18012] = "FileData";
    EBMLId[EBMLId["FileUID"] = 18094] = "FileUID";
    EBMLId[EBMLId["Chapters"] = 272869232] = "Chapters";
    EBMLId[EBMLId["Tags"] = 307544935] = "Tags";
    EBMLId[EBMLId["Tag"] = 29555] = "Tag";
    EBMLId[EBMLId["Targets"] = 25536] = "Targets";
    EBMLId[EBMLId["TargetTypeValue"] = 26826] = "TargetTypeValue";
    EBMLId[EBMLId["TargetType"] = 25546] = "TargetType";
    EBMLId[EBMLId["TagTrackUID"] = 25541] = "TagTrackUID";
    EBMLId[EBMLId["TagEditionUID"] = 25545] = "TagEditionUID";
    EBMLId[EBMLId["TagChapterUID"] = 25540] = "TagChapterUID";
    EBMLId[EBMLId["TagAttachmentUID"] = 25542] = "TagAttachmentUID";
    EBMLId[EBMLId["SimpleTag"] = 26568] = "SimpleTag";
    EBMLId[EBMLId["TagName"] = 17827] = "TagName";
    EBMLId[EBMLId["TagLanguage"] = 17530] = "TagLanguage";
    EBMLId[EBMLId["TagString"] = 17543] = "TagString";
    EBMLId[EBMLId["TagBinary"] = 17541] = "TagBinary";
    EBMLId[EBMLId["ContentEncodings"] = 28032] = "ContentEncodings";
    EBMLId[EBMLId["ContentEncoding"] = 25152] = "ContentEncoding";
    EBMLId[EBMLId["ContentEncodingOrder"] = 20529] = "ContentEncodingOrder";
    EBMLId[EBMLId["ContentEncodingScope"] = 20530] = "ContentEncodingScope";
    EBMLId[EBMLId["ContentCompression"] = 20532] = "ContentCompression";
    EBMLId[EBMLId["ContentCompAlgo"] = 16980] = "ContentCompAlgo";
    EBMLId[EBMLId["ContentCompSettings"] = 16981] = "ContentCompSettings";
    EBMLId[EBMLId["ContentEncryption"] = 20533] = "ContentEncryption";
})(EBMLId || (EBMLId = {}));
const LEVEL_0_EBML_IDS = [
    EBMLId.EBML,
    EBMLId.Segment
];
const LEVEL_1_EBML_IDS = [
    EBMLId.SeekHead,
    EBMLId.Info,
    EBMLId.Cluster,
    EBMLId.Tracks,
    EBMLId.Cues,
    EBMLId.Attachments,
    EBMLId.Chapters,
    EBMLId.Tags
];
const LEVEL_0_AND_1_EBML_IDS = [
    ...LEVEL_0_EBML_IDS,
    ...LEVEL_1_EBML_IDS
];
const measureUnsignedInt = (value)=>{
    if (value < 256) return 1;
    else if (value < 65536) return 2;
    else if (value < 16777216) return 3;
    else if (value < 2 ** 32) return 4;
    else if (value < 2 ** 40) return 5;
    else return 6;
};
const measureUnsignedBigInt = (value)=>{
    if (value < 1n << 8n) return 1;
    else if (value < 1n << 16n) return 2;
    else if (value < 1n << 24n) return 3;
    else if (value < 1n << 32n) return 4;
    else if (value < 1n << 40n) return 5;
    else if (value < 1n << 48n) return 6;
    else if (value < 1n << 56n) return 7;
    else return 8;
};
const measureSignedInt = (value)=>{
    if (value >= -64 && value < 64) return 1;
    else if (value >= -8192 && value < 8192) return 2;
    else if (value >= -1048576 && value < 1048576) return 3;
    else if (value >= -134217728 && value < 134217728) return 4;
    else if (value >= -(2 ** 34) && value < 2 ** 34) return 5;
    else return 6;
};
const measureVarInt = (value)=>{
    if (value < 127) /** Top bit is set, leaving 7 bits to hold the integer, but we can't store
         * 127 because "all bits set to one" is a reserved value. Same thing for the
         * other cases below:
         */ return 1;
    else if (value < 16383) return 2;
    else if (value < 2097151) return 3;
    else if (value < 268435455) return 4;
    else if (value < 2 ** 35 - 1) return 5;
    else if (value < 2 ** 42 - 1) return 6;
    else throw new Error('EBML varint size not supported ' + value);
};
class EBMLWriter {
    constructor(writer){
        this.writer = writer;
        this.helper = new Uint8Array(8);
        this.helperView = new DataView(this.helper.buffer);
        /**
         * Stores the position from the start of the file to where EBML elements have been written. This is used to
         * rewrite/edit elements that were already added before, and to measure sizes of things.
         */ this.offsets = new WeakMap();
        /** Same as offsets, but stores position where the element's data starts (after ID and size fields). */ this.dataOffsets = new WeakMap();
    }
    writeByte(value) {
        this.helperView.setUint8(0, value);
        this.writer.write(this.helper.subarray(0, 1));
    }
    writeFloat32(value) {
        this.helperView.setFloat32(0, value, false);
        this.writer.write(this.helper.subarray(0, 4));
    }
    writeFloat64(value) {
        this.helperView.setFloat64(0, value, false);
        this.writer.write(this.helper);
    }
    writeUnsignedInt(value, width = measureUnsignedInt(value)) {
        let pos = 0;
        // Each case falls through:
        switch(width){
            case 6:
                // Need to use division to access >32 bits of floating point var
                this.helperView.setUint8(pos++, value / 2 ** 40 | 0);
            // eslint-disable-next-line no-fallthrough
            case 5:
                this.helperView.setUint8(pos++, value / 2 ** 32 | 0);
            // eslint-disable-next-line no-fallthrough
            case 4:
                this.helperView.setUint8(pos++, value >> 24);
            // eslint-disable-next-line no-fallthrough
            case 3:
                this.helperView.setUint8(pos++, value >> 16);
            // eslint-disable-next-line no-fallthrough
            case 2:
                this.helperView.setUint8(pos++, value >> 8);
            // eslint-disable-next-line no-fallthrough
            case 1:
                this.helperView.setUint8(pos++, value);
                break;
            default:
                throw new Error('Bad unsigned int size ' + width);
        }
        this.writer.write(this.helper.subarray(0, pos));
    }
    writeUnsignedBigInt(value, width = measureUnsignedBigInt(value)) {
        let pos = 0;
        for(let i = width - 1; i >= 0; i--)this.helperView.setUint8(pos++, Number(value >> BigInt(i * 8) & 0xffn));
        this.writer.write(this.helper.subarray(0, pos));
    }
    writeSignedInt(value, width = measureSignedInt(value)) {
        if (value < 0) // Two's complement stuff
        value += 2 ** (width * 8);
        this.writeUnsignedInt(value, width);
    }
    writeVarInt(value, width = measureVarInt(value)) {
        let pos = 0;
        switch(width){
            case 1:
                this.helperView.setUint8(pos++, 128 | value);
                break;
            case 2:
                this.helperView.setUint8(pos++, 64 | value >> 8);
                this.helperView.setUint8(pos++, value);
                break;
            case 3:
                this.helperView.setUint8(pos++, 32 | value >> 16);
                this.helperView.setUint8(pos++, value >> 8);
                this.helperView.setUint8(pos++, value);
                break;
            case 4:
                this.helperView.setUint8(pos++, 16 | value >> 24);
                this.helperView.setUint8(pos++, value >> 16);
                this.helperView.setUint8(pos++, value >> 8);
                this.helperView.setUint8(pos++, value);
                break;
            case 5:
                /**
                 * JavaScript converts its doubles to 32-bit integers for bitwise
                 * operations, so we need to do a division by 2^32 instead of a
                 * right-shift of 32 to retain those top 3 bits
                 */ this.helperView.setUint8(pos++, 8 | value / 2 ** 32 & 0x7);
                this.helperView.setUint8(pos++, value >> 24);
                this.helperView.setUint8(pos++, value >> 16);
                this.helperView.setUint8(pos++, value >> 8);
                this.helperView.setUint8(pos++, value);
                break;
            case 6:
                this.helperView.setUint8(pos++, 4 | value / 2 ** 40 & 0x3);
                this.helperView.setUint8(pos++, value / 2 ** 32 | 0);
                this.helperView.setUint8(pos++, value >> 24);
                this.helperView.setUint8(pos++, value >> 16);
                this.helperView.setUint8(pos++, value >> 8);
                this.helperView.setUint8(pos++, value);
                break;
            default:
                throw new Error('Bad EBML varint size ' + width);
        }
        this.writer.write(this.helper.subarray(0, pos));
    }
    writeAsciiString(str) {
        this.writer.write(new Uint8Array(str.split('').map((x)=>x.charCodeAt(0))));
    }
    writeEBML(data) {
        if (data === null) return;
        if (data instanceof Uint8Array) this.writer.write(data);
        else if (Array.isArray(data)) for (const elem of data)this.writeEBML(elem);
        else {
            this.offsets.set(data, this.writer.getPos());
            this.writeUnsignedInt(data.id); // ID field
            if (Array.isArray(data.data)) {
                const sizePos = this.writer.getPos();
                const sizeSize = data.size === -1 ? 1 : data.size ?? 4;
                if (data.size === -1) // Write the reserved all-one-bits marker for unknown/unbounded size.
                this.writeByte(0xff);
                else this.writer.seek(this.writer.getPos() + sizeSize);
                const startPos = this.writer.getPos();
                this.dataOffsets.set(data, startPos);
                this.writeEBML(data.data);
                if (data.size !== -1) {
                    const size = this.writer.getPos() - startPos;
                    const endPos = this.writer.getPos();
                    this.writer.seek(sizePos);
                    this.writeVarInt(size, sizeSize);
                    this.writer.seek(endPos);
                }
            } else if (typeof data.data === 'number') {
                const size = data.size ?? measureUnsignedInt(data.data);
                this.writeVarInt(size);
                this.writeUnsignedInt(data.data, size);
            } else if (typeof data.data === 'bigint') {
                const size = data.size ?? measureUnsignedBigInt(data.data);
                this.writeVarInt(size);
                this.writeUnsignedBigInt(data.data, size);
            } else if (typeof data.data === 'string') {
                this.writeVarInt(data.data.length);
                this.writeAsciiString(data.data);
            } else if (data.data instanceof Uint8Array) {
                this.writeVarInt(data.data.byteLength, data.size);
                this.writer.write(data.data);
            } else if (data.data instanceof EBMLFloat32) {
                this.writeVarInt(4);
                this.writeFloat32(data.data.value);
            } else if (data.data instanceof EBMLFloat64) {
                this.writeVarInt(8);
                this.writeFloat64(data.data.value);
            } else if (data.data instanceof EBMLSignedInt) {
                const size = data.size ?? measureSignedInt(data.data.value);
                this.writeVarInt(size);
                this.writeSignedInt(data.data.value, size);
            } else if (data.data instanceof EBMLUnicodeString) {
                const bytes = (0, _miscJs.textEncoder).encode(data.data.value);
                this.writeVarInt(bytes.length);
                this.writer.write(bytes);
            } else (0, _miscJs.assertNever)(data.data);
        }
    }
}
const MAX_VAR_INT_SIZE = 8;
const MIN_HEADER_SIZE = 2; // 1-byte ID and 1-byte size
const MAX_HEADER_SIZE = 2 * MAX_VAR_INT_SIZE; // 8-byte ID and 8-byte size
const readVarIntSize = (slice)=>{
    const firstByte = (0, _readerJs.readU8)(slice);
    slice.skip(-1);
    if (firstByte === 0) return null; // Invalid VINT
    let width = 1;
    let mask = 0x80;
    while((firstByte & mask) === 0){
        width++;
        mask >>= 1;
    }
    return width;
};
const readVarInt = (slice)=>{
    // Read the first byte to determine the width of the variable-length integer
    const firstByte = (0, _readerJs.readU8)(slice);
    if (firstByte === 0) return null; // Invalid VINT
    // Find the position of VINT_MARKER, which determines the width
    let width = 1;
    let mask = 128;
    while((firstByte & mask) === 0){
        width++;
        mask >>= 1;
    }
    // First byte's value needs the marker bit cleared
    let value = firstByte & mask - 1;
    // Read remaining bytes
    for(let i = 1; i < width; i++){
        value *= 256;
        value += (0, _readerJs.readU8)(slice);
    }
    return value;
};
const readUnsignedInt = (slice, width)=>{
    if (width < 1 || width > 8) throw new Error('Bad unsigned int size ' + width);
    let value = 0;
    // Read bytes from most significant to least significant
    for(let i = 0; i < width; i++){
        value *= 256;
        value += (0, _readerJs.readU8)(slice);
    }
    return value;
};
const readUnsignedBigInt = (slice, width)=>{
    if (width < 1) throw new Error('Bad unsigned int size ' + width);
    let value = 0n;
    for(let i = 0; i < width; i++){
        value <<= 8n;
        value += BigInt((0, _readerJs.readU8)(slice));
    }
    return value;
};
const readSignedInt = (slice, width)=>{
    let value = readUnsignedInt(slice, width);
    // If the highest bit is set, convert from two's complement
    if (value & 1 << width * 8 - 1) value -= 2 ** (width * 8);
    return value;
};
const readElementId = (slice)=>{
    const size = readVarIntSize(slice);
    if (size === null) return null;
    const id = readUnsignedInt(slice, size);
    return id;
};
const readElementSize = (slice)=>{
    let size = (0, _readerJs.readU8)(slice);
    if (size === 0xff) size = null;
    else {
        slice.skip(-1);
        size = readVarInt(slice);
        // In some (livestreamed) files, this is the value of the size field. While this technically is just a very
        // large number, it is intended to behave like the reserved size 0xFF, meaning the size is undefined. We
        // catch the number here. Note that it cannot be perfectly represented as a double, but the comparison works
        // nonetheless.
        // eslint-disable-next-line no-loss-of-precision
        if (size === 0x00ffffffffffffff) size = null;
    }
    return size;
};
const readElementHeader = (slice)=>{
    const id = readElementId(slice);
    if (id === null) return null;
    const size = readElementSize(slice);
    return {
        id,
        size
    };
};
const readAsciiString = (slice, length)=>{
    const bytes = (0, _readerJs.readBytes)(slice, length);
    // Actual string length might be shorter due to null terminators
    let strLength = 0;
    while(strLength < length && bytes[strLength] !== 0)strLength += 1;
    return String.fromCharCode(...bytes.subarray(0, strLength));
};
const readUnicodeString = (slice, length)=>{
    const bytes = (0, _readerJs.readBytes)(slice, length);
    // Actual string length might be shorter due to null terminators
    let strLength = 0;
    while(strLength < length && bytes[strLength] !== 0)strLength += 1;
    return (0, _miscJs.textDecoder).decode(bytes.subarray(0, strLength));
};
const readFloat = (slice, width)=>{
    if (width === 0) return 0;
    if (width !== 4 && width !== 8) throw new Error('Bad float size ' + width);
    return width === 4 ? (0, _readerJs.readF32Be)(slice) : (0, _readerJs.readF64Be)(slice);
};
const searchForNextElementId = async (reader, startPos, ids, until)=>{
    const idsSet = new Set(ids);
    let currentPos = startPos;
    while(until === null || currentPos < until){
        let slice = reader.requestSliceRange(currentPos, MIN_HEADER_SIZE, MAX_HEADER_SIZE);
        if (slice instanceof Promise) slice = await slice;
        if (!slice) break;
        const elementHeader = readElementHeader(slice);
        if (!elementHeader) break;
        if (idsSet.has(elementHeader.id)) return {
            pos: currentPos,
            found: true
        };
        assertDefinedSize(elementHeader.size);
        currentPos = slice.filePos + elementHeader.size;
    }
    return {
        pos: until !== null && until > currentPos ? until : currentPos,
        found: false
    };
};
const resync = async (reader, startPos, ids, until)=>{
    const CHUNK_SIZE = 2 ** 16; // So we don't need to grab thousands of slices
    const idsSet = new Set(ids);
    let currentPos = startPos;
    while(currentPos < until){
        let slice = reader.requestSliceRange(currentPos, 0, Math.min(CHUNK_SIZE, until - currentPos));
        if (slice instanceof Promise) slice = await slice;
        if (!slice) break;
        if (slice.length < MAX_VAR_INT_SIZE) break;
        for(let i = 0; i < slice.length - MAX_VAR_INT_SIZE; i++){
            slice.filePos = currentPos;
            const elementId = readElementId(slice);
            if (elementId !== null && idsSet.has(elementId)) return currentPos;
            currentPos++;
        }
    }
    return null;
};
const CODEC_STRING_MAP = {
    'avc': 'V_MPEG4/ISO/AVC',
    'hevc': 'V_MPEGH/ISO/HEVC',
    'vp8': 'V_VP8',
    'vp9': 'V_VP9',
    'av1': 'V_AV1',
    'aac': 'A_AAC',
    'mp3': 'A_MPEG/L3',
    'opus': 'A_OPUS',
    'vorbis': 'A_VORBIS',
    'flac': 'A_FLAC',
    'pcm-u8': 'A_PCM/INT/LIT',
    'pcm-s16': 'A_PCM/INT/LIT',
    'pcm-s16be': 'A_PCM/INT/BIG',
    'pcm-s24': 'A_PCM/INT/LIT',
    'pcm-s24be': 'A_PCM/INT/BIG',
    'pcm-s32': 'A_PCM/INT/LIT',
    'pcm-s32be': 'A_PCM/INT/BIG',
    'pcm-f32': 'A_PCM/FLOAT/IEEE',
    'pcm-f64': 'A_PCM/FLOAT/IEEE',
    'webvtt': 'S_TEXT/WEBVTT'
};
function assertDefinedSize(size) {
    if (size === null) throw new Error('Undefined element size is used in a place where it is not supported.');
}

},{"../misc.js":"kkhLS","../reader.js":"fr2Ka","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"lx8cS":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MatroskaDemuxer", ()=>MatroskaDemuxer);
var _codecDataJs = require("../codec-data.js");
var _codecJs = require("../codec.js");
var _demuxerJs = require("../demuxer.js");
var _inputTrackJs = require("../input-track.js");
var _metadataJs = require("../metadata.js");
var _miscJs = require("../misc.js");
var _packetJs = require("../packet.js");
var _ebmlJs = require("./ebml.js");
var _matroskaMiscJs = require("./matroska-misc.js");
var _readerJs = require("../reader.js");
var BlockLacing;
(function(BlockLacing) {
    BlockLacing[BlockLacing["None"] = 0] = "None";
    BlockLacing[BlockLacing["Xiph"] = 1] = "Xiph";
    BlockLacing[BlockLacing["FixedSize"] = 2] = "FixedSize";
    BlockLacing[BlockLacing["Ebml"] = 3] = "Ebml";
})(BlockLacing || (BlockLacing = {}));
var ContentEncodingScope;
(function(ContentEncodingScope) {
    ContentEncodingScope[ContentEncodingScope["Block"] = 1] = "Block";
    ContentEncodingScope[ContentEncodingScope["Private"] = 2] = "Private";
    ContentEncodingScope[ContentEncodingScope["Next"] = 4] = "Next";
})(ContentEncodingScope || (ContentEncodingScope = {}));
var ContentCompAlgo;
(function(ContentCompAlgo) {
    ContentCompAlgo[ContentCompAlgo["Zlib"] = 0] = "Zlib";
    ContentCompAlgo[ContentCompAlgo["Bzlib"] = 1] = "Bzlib";
    ContentCompAlgo[ContentCompAlgo["lzo1x"] = 2] = "lzo1x";
    ContentCompAlgo[ContentCompAlgo["HeaderStripping"] = 3] = "HeaderStripping";
})(ContentCompAlgo || (ContentCompAlgo = {}));
const METADATA_ELEMENTS = [
    {
        id: (0, _ebmlJs.EBMLId).SeekHead,
        flag: 'seekHeadSeen'
    },
    {
        id: (0, _ebmlJs.EBMLId).Info,
        flag: 'infoSeen'
    },
    {
        id: (0, _ebmlJs.EBMLId).Tracks,
        flag: 'tracksSeen'
    },
    {
        id: (0, _ebmlJs.EBMLId).Cues,
        flag: 'cuesSeen'
    }
];
const MAX_RESYNC_LENGTH = 10 * 2 ** 20; // 10 MiB
class MatroskaDemuxer extends (0, _demuxerJs.Demuxer) {
    constructor(input){
        super(input);
        this.readMetadataPromise = null;
        this.segments = [];
        this.currentSegment = null;
        this.currentTrack = null;
        this.currentCluster = null;
        this.currentBlock = null;
        this.currentBlockAdditional = null;
        this.currentCueTime = null;
        this.currentDecodingInstruction = null;
        this.currentTagTargetIsMovie = true;
        this.currentSimpleTagName = null;
        this.currentAttachedFile = null;
        this.isWebM = false;
        this.reader = input._reader;
    }
    async computeDuration() {
        const tracks = await this.getTracks();
        const trackDurations = await Promise.all(tracks.map((x)=>x.computeDuration()));
        return Math.max(0, ...trackDurations);
    }
    async getTracks() {
        await this.readMetadata();
        return this.segments.flatMap((segment)=>segment.tracks.map((track)=>track.inputTrack));
    }
    async getMimeType() {
        await this.readMetadata();
        const tracks = await this.getTracks();
        const codecStrings = await Promise.all(tracks.map((x)=>x.getCodecParameterString()));
        return (0, _matroskaMiscJs.buildMatroskaMimeType)({
            isWebM: this.isWebM,
            hasVideo: this.segments.some((segment)=>segment.tracks.some((x)=>x.info?.type === 'video')),
            hasAudio: this.segments.some((segment)=>segment.tracks.some((x)=>x.info?.type === 'audio')),
            codecStrings: codecStrings.filter(Boolean)
        });
    }
    async getMetadataTags() {
        await this.readMetadata();
        // Load metadata tags from each segment lazily (only once)
        for (const segment of this.segments)if (!segment.metadataTagsCollected) {
            if (this.reader.fileSize !== null) await this.loadSegmentMetadata(segment);
            segment.metadataTagsCollected = true;
        }
        // This is kinda handwavy, and how we handle multiple segments isn't suuuuper well-defined anyway; so we just
        // shallow-merge metadata tags from all (usually just one) segments.
        let metadataTags = {};
        for (const segment of this.segments)metadataTags = {
            ...metadataTags,
            ...segment.metadataTags
        };
        return metadataTags;
    }
    readMetadata() {
        return this.readMetadataPromise ??= (async ()=>{
            let currentPos = 0;
            // Loop over all top-level elements in the file
            while(true){
                let slice = this.reader.requestSliceRange(currentPos, (0, _ebmlJs.MIN_HEADER_SIZE), (0, _ebmlJs.MAX_HEADER_SIZE));
                if (slice instanceof Promise) slice = await slice;
                if (!slice) break;
                const header = (0, _ebmlJs.readElementHeader)(slice);
                if (!header) break; // Zero padding at the end of the file triggers this, for example
                const id = header.id;
                let size = header.size;
                const dataStartPos = slice.filePos;
                if (id === (0, _ebmlJs.EBMLId).EBML) {
                    (0, _ebmlJs.assertDefinedSize)(size);
                    let slice = this.reader.requestSlice(dataStartPos, size);
                    if (slice instanceof Promise) slice = await slice;
                    if (!slice) break;
                    this.readContiguousElements(slice);
                } else if (id === (0, _ebmlJs.EBMLId).Segment) {
                    await this.readSegment(dataStartPos, size);
                    if (size === null) break;
                    if (this.reader.fileSize === null) break; // Stop at the first segment
                } else if (id === (0, _ebmlJs.EBMLId).Cluster) {
                    if (this.reader.fileSize === null) break; // Shouldn't be reached anyway, since we stop at the first segment
                    // Clusters are not a top-level element in Matroska, but some files contain a Segment whose size
                    // doesn't contain any of the clusters that follow it. In the case, we apply the following logic: if
                    // we find a top-level cluster, attribute it to the previous segment.
                    if (size === null) {
                        // Just in case this is one of those weird sizeless clusters, let's do our best and still try to
                        // determine its size.
                        const nextElementPos = await (0, _ebmlJs.searchForNextElementId)(this.reader, dataStartPos, (0, _ebmlJs.LEVEL_0_AND_1_EBML_IDS), this.reader.fileSize);
                        size = nextElementPos.pos - dataStartPos;
                    }
                    const lastSegment = (0, _miscJs.last)(this.segments);
                    if (lastSegment) // Extend the previous segment's size
                    lastSegment.elementEndPos = dataStartPos + size;
                }
                (0, _ebmlJs.assertDefinedSize)(size);
                currentPos = dataStartPos + size;
            }
        })();
    }
    async readSegment(segmentDataStart, dataSize) {
        this.currentSegment = {
            seekHeadSeen: false,
            infoSeen: false,
            tracksSeen: false,
            cuesSeen: false,
            tagsSeen: false,
            attachmentsSeen: false,
            timestampScale: -1,
            timestampFactor: -1,
            duration: -1,
            seekEntries: [],
            tracks: [],
            cuePoints: [],
            dataStartPos: segmentDataStart,
            elementEndPos: dataSize === null ? null // Assume it goes until the end of the file
             : segmentDataStart + dataSize,
            clusterSeekStartPos: segmentDataStart,
            lastReadCluster: null,
            metadataTags: {},
            metadataTagsCollected: false
        };
        this.segments.push(this.currentSegment);
        let currentPos = segmentDataStart;
        while(this.currentSegment.elementEndPos === null || currentPos < this.currentSegment.elementEndPos){
            let slice = this.reader.requestSliceRange(currentPos, (0, _ebmlJs.MIN_HEADER_SIZE), (0, _ebmlJs.MAX_HEADER_SIZE));
            if (slice instanceof Promise) slice = await slice;
            if (!slice) break;
            const elementStartPos = currentPos;
            const header = (0, _ebmlJs.readElementHeader)(slice);
            if (!header || !(0, _ebmlJs.LEVEL_1_EBML_IDS).includes(header.id) && header.id !== (0, _ebmlJs.EBMLId).Void) {
                // Potential junk. Let's try to resync
                const nextPos = await (0, _ebmlJs.resync)(this.reader, elementStartPos, (0, _ebmlJs.LEVEL_1_EBML_IDS), Math.min(this.currentSegment.elementEndPos ?? Infinity, elementStartPos + MAX_RESYNC_LENGTH));
                if (nextPos) {
                    currentPos = nextPos;
                    continue;
                } else break; // Resync failed
            }
            const { id, size } = header;
            const dataStartPos = slice.filePos;
            const metadataElementIndex = METADATA_ELEMENTS.findIndex((x)=>x.id === id);
            if (metadataElementIndex !== -1) {
                const field = METADATA_ELEMENTS[metadataElementIndex].flag;
                this.currentSegment[field] = true;
                (0, _ebmlJs.assertDefinedSize)(size);
                let slice = this.reader.requestSlice(dataStartPos, size);
                if (slice instanceof Promise) slice = await slice;
                if (slice) this.readContiguousElements(slice);
            } else if (id === (0, _ebmlJs.EBMLId).Tags || id === (0, _ebmlJs.EBMLId).Attachments) {
                // Metadata found at the beginning of the segment, great, let's parse it
                if (id === (0, _ebmlJs.EBMLId).Tags) this.currentSegment.tagsSeen = true;
                else this.currentSegment.attachmentsSeen = true;
                (0, _ebmlJs.assertDefinedSize)(size);
                let slice = this.reader.requestSlice(dataStartPos, size);
                if (slice instanceof Promise) slice = await slice;
                if (slice) this.readContiguousElements(slice);
            } else if (id === (0, _ebmlJs.EBMLId).Cluster) {
                this.currentSegment.clusterSeekStartPos = elementStartPos;
                break; // Stop at the first cluster
            }
            if (size === null) break;
            else currentPos = dataStartPos + size;
        }
        // Sort the seek entries by file position so reading them exhibits a sequential pattern
        this.currentSegment.seekEntries.sort((a, b)=>a.segmentPosition - b.segmentPosition);
        if (this.reader.fileSize !== null) // Use the seek head to read missing metadata elements
        for (const seekEntry of this.currentSegment.seekEntries){
            const target = METADATA_ELEMENTS.find((x)=>x.id === seekEntry.id);
            if (!target) continue;
            if (this.currentSegment[target.flag]) continue;
            let slice = this.reader.requestSliceRange(segmentDataStart + seekEntry.segmentPosition, (0, _ebmlJs.MIN_HEADER_SIZE), (0, _ebmlJs.MAX_HEADER_SIZE));
            if (slice instanceof Promise) slice = await slice;
            if (!slice) continue;
            const header = (0, _ebmlJs.readElementHeader)(slice);
            if (!header) continue;
            const { id, size } = header;
            if (id !== target.id) continue;
            (0, _ebmlJs.assertDefinedSize)(size);
            this.currentSegment[target.flag] = true;
            let dataSlice = this.reader.requestSlice(slice.filePos, size);
            if (dataSlice instanceof Promise) dataSlice = await dataSlice;
            if (!dataSlice) continue;
            this.readContiguousElements(dataSlice);
        }
        if (this.currentSegment.timestampScale === -1) {
            // TimestampScale element is missing. Technically an invalid file, but let's default to the typical value,
            // which is 1e6.
            this.currentSegment.timestampScale = 1e6;
            this.currentSegment.timestampFactor = 1000;
        }
        // Put default tracks first
        this.currentSegment.tracks.sort((a, b)=>Number(b.disposition.default) - Number(a.disposition.default));
        // Now, let's distribute the cue points to the tracks
        const idToTrack = new Map(this.currentSegment.tracks.map((x)=>[
                x.id,
                x
            ]));
        // Assign cue points to their respective tracks
        for (const cuePoint of this.currentSegment.cuePoints){
            const track = idToTrack.get(cuePoint.trackId);
            if (track) track.cuePoints.push(cuePoint);
        }
        for (const track of this.currentSegment.tracks){
            // Sort cue points by time
            track.cuePoints.sort((a, b)=>a.time - b.time);
            // Remove multiple cue points for the same time
            for(let i = 0; i < track.cuePoints.length - 1; i++){
                const cuePoint1 = track.cuePoints[i];
                const cuePoint2 = track.cuePoints[i + 1];
                if (cuePoint1.time === cuePoint2.time) {
                    track.cuePoints.splice(i + 1, 1);
                    i--;
                }
            }
        }
        let trackWithMostCuePoints = null;
        let maxCuePointCount = -Infinity;
        for (const track of this.currentSegment.tracks)if (track.cuePoints.length > maxCuePointCount) {
            maxCuePointCount = track.cuePoints.length;
            trackWithMostCuePoints = track;
        }
        // For every track that has received 0 cue points (can happen, often only the video track receives cue points),
        // we still want to have better seeking. Therefore, let's give it the cue points of the track with the most cue
        // points, which should provide us with the most fine-grained seeking.
        for (const track of this.currentSegment.tracks)if (track.cuePoints.length === 0) track.cuePoints = trackWithMostCuePoints.cuePoints;
        this.currentSegment = null;
    }
    async readCluster(startPos, segment) {
        if (segment.lastReadCluster?.elementStartPos === startPos) return segment.lastReadCluster;
        let headerSlice = this.reader.requestSliceRange(startPos, (0, _ebmlJs.MIN_HEADER_SIZE), (0, _ebmlJs.MAX_HEADER_SIZE));
        if (headerSlice instanceof Promise) headerSlice = await headerSlice;
        (0, _miscJs.assert)(headerSlice);
        const elementStartPos = startPos;
        const elementHeader = (0, _ebmlJs.readElementHeader)(headerSlice);
        (0, _miscJs.assert)(elementHeader);
        const id = elementHeader.id;
        (0, _miscJs.assert)(id === (0, _ebmlJs.EBMLId).Cluster);
        let size = elementHeader.size;
        const dataStartPos = headerSlice.filePos;
        if (size === null) {
            // The cluster's size is undefined (can happen in livestreamed files). We'd still like to know the size of
            // it, so we have no other choice but to iterate over the EBML structure until we find an element at level
            // 0 or 1, indicating the end of the cluster (all elements inside the cluster are at level 2).
            const nextElementPos = await (0, _ebmlJs.searchForNextElementId)(this.reader, dataStartPos, (0, _ebmlJs.LEVEL_0_AND_1_EBML_IDS), segment.elementEndPos);
            size = nextElementPos.pos - dataStartPos;
        }
        // Load the entire cluster
        let dataSlice = this.reader.requestSlice(dataStartPos, size);
        if (dataSlice instanceof Promise) dataSlice = await dataSlice;
        const cluster = {
            segment,
            elementStartPos,
            elementEndPos: dataStartPos + size,
            dataStartPos,
            timestamp: -1,
            trackData: new Map()
        };
        this.currentCluster = cluster;
        if (dataSlice) {
            // Read the children of the cluster, stopping early at level 0 or 1 EBML elements. We do this because some
            // clusters have incorrect sizes that are too large
            const endPos = this.readContiguousElements(dataSlice, (0, _ebmlJs.LEVEL_0_AND_1_EBML_IDS));
            cluster.elementEndPos = endPos;
        }
        for (const [, trackData] of cluster.trackData){
            const track = trackData.track;
            // This must hold, as track datas only get created if a block for that track is encountered
            (0, _miscJs.assert)(trackData.blocks.length > 0);
            let hasLacedBlocks = false;
            for(let i = 0; i < trackData.blocks.length; i++){
                const block = trackData.blocks[i];
                block.timestamp += cluster.timestamp;
                hasLacedBlocks ||= block.lacing !== BlockLacing.None;
            }
            trackData.presentationTimestamps = trackData.blocks.map((block, i)=>({
                    timestamp: block.timestamp,
                    blockIndex: i
                })).sort((a, b)=>a.timestamp - b.timestamp);
            for(let i = 0; i < trackData.presentationTimestamps.length; i++){
                const currentEntry = trackData.presentationTimestamps[i];
                const currentBlock = trackData.blocks[currentEntry.blockIndex];
                if (trackData.firstKeyFrameTimestamp === null && currentBlock.isKeyFrame) trackData.firstKeyFrameTimestamp = currentBlock.timestamp;
                if (i < trackData.presentationTimestamps.length - 1) {
                    // Update block durations based on presentation order
                    const nextEntry = trackData.presentationTimestamps[i + 1];
                    currentBlock.duration = nextEntry.timestamp - currentBlock.timestamp;
                } else if (currentBlock.duration === 0) {
                    if (track.defaultDuration != null) {
                        if (currentBlock.lacing === BlockLacing.None) currentBlock.duration = track.defaultDuration;
                    // Handled by the lace resolution code
                    }
                }
            }
            if (hasLacedBlocks) {
                // Perform lace resolution. Here, we expand each laced block into multiple blocks where each contains
                // one frame of the lace. We do this after determining block timestamps so we can properly distribute
                // the block's duration across the laced frames.
                this.expandLacedBlocks(trackData.blocks, track);
                // Recompute since blocks have changed
                trackData.presentationTimestamps = trackData.blocks.map((block, i)=>({
                        timestamp: block.timestamp,
                        blockIndex: i
                    })).sort((a, b)=>a.timestamp - b.timestamp);
            }
            const firstBlock = trackData.blocks[trackData.presentationTimestamps[0].blockIndex];
            const lastBlock = trackData.blocks[(0, _miscJs.last)(trackData.presentationTimestamps).blockIndex];
            trackData.startTimestamp = firstBlock.timestamp;
            trackData.endTimestamp = lastBlock.timestamp + lastBlock.duration;
            // Let's remember that a cluster with a given timestamp is here, speeding up future lookups if no cues exist
            const insertionIndex = (0, _miscJs.binarySearchLessOrEqual)(track.clusterPositionCache, trackData.startTimestamp, (x)=>x.startTimestamp);
            if (insertionIndex === -1 || track.clusterPositionCache[insertionIndex].elementStartPos !== elementStartPos) track.clusterPositionCache.splice(insertionIndex + 1, 0, {
                elementStartPos: cluster.elementStartPos,
                startTimestamp: trackData.startTimestamp
            });
        }
        segment.lastReadCluster = cluster;
        return cluster;
    }
    getTrackDataInCluster(cluster, trackNumber) {
        let trackData = cluster.trackData.get(trackNumber);
        if (!trackData) {
            const track = cluster.segment.tracks.find((x)=>x.id === trackNumber);
            if (!track) return null;
            trackData = {
                track,
                startTimestamp: 0,
                endTimestamp: 0,
                firstKeyFrameTimestamp: null,
                blocks: [],
                presentationTimestamps: []
            };
            cluster.trackData.set(trackNumber, trackData);
        }
        return trackData;
    }
    expandLacedBlocks(blocks, track) {
        // https://www.matroska.org/technical/notes.html#block-lacing
        for(let blockIndex = 0; blockIndex < blocks.length; blockIndex++){
            const originalBlock = blocks[blockIndex];
            if (originalBlock.lacing === BlockLacing.None) continue;
            // Decode the block data if it hasn't been decoded yet (needed for lacing expansion)
            if (!originalBlock.decoded) {
                originalBlock.data = this.decodeBlockData(track, originalBlock.data);
                originalBlock.decoded = true;
            }
            const slice = (0, _readerJs.FileSlice).tempFromBytes(originalBlock.data);
            const frameSizes = [];
            const frameCount = (0, _readerJs.readU8)(slice) + 1;
            switch(originalBlock.lacing){
                case BlockLacing.Xiph:
                    {
                        let totalUsedSize = 0;
                        // Xiph lacing, just like in Ogg
                        for(let i = 0; i < frameCount - 1; i++){
                            let frameSize = 0;
                            while(slice.bufferPos < slice.length){
                                const value = (0, _readerJs.readU8)(slice);
                                frameSize += value;
                                if (value < 255) {
                                    frameSizes.push(frameSize);
                                    totalUsedSize += frameSize;
                                    break;
                                }
                            }
                        }
                        // Compute the last frame's size from whatever's left
                        frameSizes.push(slice.length - (slice.bufferPos + totalUsedSize));
                    }
                    break;
                case BlockLacing.FixedSize:
                    {
                        // Fixed size lacing: all frames have same size
                        const totalDataSize = slice.length - 1; // Minus the frame count byte
                        const frameSize = Math.floor(totalDataSize / frameCount);
                        for(let i = 0; i < frameCount; i++)frameSizes.push(frameSize);
                    }
                    break;
                case BlockLacing.Ebml:
                    {
                        // EBML lacing: first size absolute, subsequent ones are coded as signed differences from the last
                        const firstResult = (0, _ebmlJs.readVarInt)(slice);
                        (0, _miscJs.assert)(firstResult !== null); // Assume it's not an invalid VINT
                        let currentSize = firstResult;
                        frameSizes.push(currentSize);
                        let totalUsedSize = currentSize;
                        for(let i = 1; i < frameCount - 1; i++){
                            const startPos = slice.bufferPos;
                            const diffResult = (0, _ebmlJs.readVarInt)(slice);
                            (0, _miscJs.assert)(diffResult !== null);
                            const unsignedDiff = diffResult;
                            const width = slice.bufferPos - startPos;
                            const bias = (1 << width * 7 - 1) - 1; // Typo-corrected version of 2^((7*n)-1)^-1
                            const diff = unsignedDiff - bias;
                            currentSize += diff;
                            frameSizes.push(currentSize);
                            totalUsedSize += currentSize;
                        }
                        // Compute the last frame's size from whatever's left
                        frameSizes.push(slice.length - (slice.bufferPos + totalUsedSize));
                    }
                    break;
                default:
                    (0, _miscJs.assert)(false);
            }
            (0, _miscJs.assert)(frameSizes.length === frameCount);
            blocks.splice(blockIndex, 1); // Remove the original block
            const blockDuration = originalBlock.duration || frameCount * (track.defaultDuration ?? 0);
            // Now, let's insert each frame as its own block
            for(let i = 0; i < frameCount; i++){
                const frameSize = frameSizes[i];
                const frameData = (0, _readerJs.readBytes)(slice, frameSize);
                // Distribute timestamps evenly across the block duration
                const frameTimestamp = originalBlock.timestamp + blockDuration * i / frameCount;
                const frameDuration = blockDuration / frameCount;
                blocks.splice(blockIndex + i, 0, {
                    timestamp: frameTimestamp,
                    duration: frameDuration,
                    isKeyFrame: originalBlock.isKeyFrame,
                    data: frameData,
                    lacing: BlockLacing.None,
                    decoded: true,
                    mainAdditional: originalBlock.mainAdditional
                });
            }
            blockIndex += frameCount; // Skip the blocks we just added
            blockIndex--;
        }
    }
    async loadSegmentMetadata(segment) {
        for (const seekEntry of segment.seekEntries){
            if (seekEntry.id === (0, _ebmlJs.EBMLId).Tags && !segment.tagsSeen) ;
            else if (seekEntry.id === (0, _ebmlJs.EBMLId).Attachments && !segment.attachmentsSeen) ;
            else continue;
            let slice = this.reader.requestSliceRange(segment.dataStartPos + seekEntry.segmentPosition, (0, _ebmlJs.MIN_HEADER_SIZE), (0, _ebmlJs.MAX_HEADER_SIZE));
            if (slice instanceof Promise) slice = await slice;
            if (!slice) continue;
            const header = (0, _ebmlJs.readElementHeader)(slice);
            if (!header || header.id !== seekEntry.id) continue;
            const { size } = header;
            (0, _ebmlJs.assertDefinedSize)(size);
            (0, _miscJs.assert)(!this.currentSegment);
            this.currentSegment = segment;
            let dataSlice = this.reader.requestSlice(slice.filePos, size);
            if (dataSlice instanceof Promise) dataSlice = await dataSlice;
            if (dataSlice) this.readContiguousElements(dataSlice);
            this.currentSegment = null;
            // Mark as seen
            if (seekEntry.id === (0, _ebmlJs.EBMLId).Tags) segment.tagsSeen = true;
            else if (seekEntry.id === (0, _ebmlJs.EBMLId).Attachments) segment.attachmentsSeen = true;
        }
    }
    readContiguousElements(slice, stopIds) {
        const startIndex = slice.filePos;
        while(slice.filePos - startIndex <= slice.length - (0, _ebmlJs.MIN_HEADER_SIZE)){
            const startPos = slice.filePos;
            const foundElement = this.traverseElement(slice, stopIds);
            if (!foundElement) return startPos;
        }
        return slice.filePos;
    }
    traverseElement(slice, stopIds) {
        const header = (0, _ebmlJs.readElementHeader)(slice);
        if (!header) return false;
        if (stopIds && stopIds.includes(header.id)) return false;
        const { id, size } = header;
        const dataStartPos = slice.filePos;
        (0, _ebmlJs.assertDefinedSize)(size);
        switch(id){
            case (0, _ebmlJs.EBMLId).DocType:
                this.isWebM = (0, _ebmlJs.readAsciiString)(slice, size) === 'webm';
                break;
            case (0, _ebmlJs.EBMLId).Seek:
                {
                    if (!this.currentSegment) break;
                    const seekEntry = {
                        id: -1,
                        segmentPosition: -1
                    };
                    this.currentSegment.seekEntries.push(seekEntry);
                    this.readContiguousElements(slice.slice(dataStartPos, size));
                    if (seekEntry.id === -1 || seekEntry.segmentPosition === -1) this.currentSegment.seekEntries.pop();
                }
                break;
            case (0, _ebmlJs.EBMLId).SeekID:
                {
                    const lastSeekEntry = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
                    if (!lastSeekEntry) break;
                    lastSeekEntry.id = (0, _ebmlJs.readUnsignedInt)(slice, size);
                }
                break;
            case (0, _ebmlJs.EBMLId).SeekPosition:
                {
                    const lastSeekEntry = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
                    if (!lastSeekEntry) break;
                    lastSeekEntry.segmentPosition = (0, _ebmlJs.readUnsignedInt)(slice, size);
                }
                break;
            case (0, _ebmlJs.EBMLId).TimestampScale:
                if (!this.currentSegment) break;
                this.currentSegment.timestampScale = (0, _ebmlJs.readUnsignedInt)(slice, size);
                this.currentSegment.timestampFactor = 1e9 / this.currentSegment.timestampScale;
                break;
            case (0, _ebmlJs.EBMLId).Duration:
                if (!this.currentSegment) break;
                this.currentSegment.duration = (0, _ebmlJs.readFloat)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).TrackEntry:
                if (!this.currentSegment) break;
                this.currentTrack = {
                    id: -1,
                    segment: this.currentSegment,
                    demuxer: this,
                    clusterPositionCache: [],
                    cuePoints: [],
                    disposition: {
                        ...(0, _metadataJs.DEFAULT_TRACK_DISPOSITION)
                    },
                    inputTrack: null,
                    codecId: null,
                    codecPrivate: null,
                    defaultDuration: null,
                    name: null,
                    languageCode: (0, _miscJs.UNDETERMINED_LANGUAGE),
                    decodingInstructions: [],
                    info: null
                };
                this.readContiguousElements(slice.slice(dataStartPos, size));
                if (this.currentTrack.decodingInstructions.some((instruction)=>{
                    return instruction.data?.type !== 'decompress' || instruction.scope !== ContentEncodingScope.Block || instruction.data.algorithm !== ContentCompAlgo.HeaderStripping;
                })) {
                    console.warn(`Track #${this.currentTrack.id} has an unsupported content encoding; dropping.`);
                    this.currentTrack = null;
                }
                if (this.currentTrack && this.currentTrack.id !== -1 && this.currentTrack.codecId && this.currentTrack.info) {
                    const slashIndex = this.currentTrack.codecId.indexOf('/');
                    const codecIdWithoutSuffix = slashIndex === -1 ? this.currentTrack.codecId : this.currentTrack.codecId.slice(0, slashIndex);
                    if (this.currentTrack.info.type === 'video' && this.currentTrack.info.width !== -1 && this.currentTrack.info.height !== -1) {
                        if (this.currentTrack.codecId === (0, _ebmlJs.CODEC_STRING_MAP).avc) {
                            this.currentTrack.info.codec = 'avc';
                            this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
                        } else if (this.currentTrack.codecId === (0, _ebmlJs.CODEC_STRING_MAP).hevc) {
                            this.currentTrack.info.codec = 'hevc';
                            this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
                        } else if (codecIdWithoutSuffix === (0, _ebmlJs.CODEC_STRING_MAP).vp8) this.currentTrack.info.codec = 'vp8';
                        else if (codecIdWithoutSuffix === (0, _ebmlJs.CODEC_STRING_MAP).vp9) this.currentTrack.info.codec = 'vp9';
                        else if (codecIdWithoutSuffix === (0, _ebmlJs.CODEC_STRING_MAP).av1) this.currentTrack.info.codec = 'av1';
                        const videoTrack = this.currentTrack;
                        const inputTrack = new (0, _inputTrackJs.InputVideoTrack)(this.input, new MatroskaVideoTrackBacking(videoTrack));
                        this.currentTrack.inputTrack = inputTrack;
                        this.currentSegment.tracks.push(this.currentTrack);
                    } else if (this.currentTrack.info.type === 'audio' && this.currentTrack.info.numberOfChannels !== -1 && this.currentTrack.info.sampleRate !== -1) {
                        if (codecIdWithoutSuffix === (0, _ebmlJs.CODEC_STRING_MAP).aac) {
                            this.currentTrack.info.codec = 'aac';
                            this.currentTrack.info.aacCodecInfo = {
                                isMpeg2: this.currentTrack.codecId.includes('MPEG2')
                            };
                            this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
                        } else if (this.currentTrack.codecId === (0, _ebmlJs.CODEC_STRING_MAP).mp3) this.currentTrack.info.codec = 'mp3';
                        else if (codecIdWithoutSuffix === (0, _ebmlJs.CODEC_STRING_MAP).opus) {
                            this.currentTrack.info.codec = 'opus';
                            this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
                            this.currentTrack.info.sampleRate = (0, _codecJs.OPUS_SAMPLE_RATE); // Always the same
                        } else if (codecIdWithoutSuffix === (0, _ebmlJs.CODEC_STRING_MAP).vorbis) {
                            this.currentTrack.info.codec = 'vorbis';
                            this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
                        } else if (codecIdWithoutSuffix === (0, _ebmlJs.CODEC_STRING_MAP).flac) {
                            this.currentTrack.info.codec = 'flac';
                            this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
                        } else if (this.currentTrack.codecId === 'A_PCM/INT/LIT') {
                            if (this.currentTrack.info.bitDepth === 8) this.currentTrack.info.codec = 'pcm-u8';
                            else if (this.currentTrack.info.bitDepth === 16) this.currentTrack.info.codec = 'pcm-s16';
                            else if (this.currentTrack.info.bitDepth === 24) this.currentTrack.info.codec = 'pcm-s24';
                            else if (this.currentTrack.info.bitDepth === 32) this.currentTrack.info.codec = 'pcm-s32';
                        } else if (this.currentTrack.codecId === 'A_PCM/INT/BIG') {
                            if (this.currentTrack.info.bitDepth === 8) this.currentTrack.info.codec = 'pcm-u8';
                            else if (this.currentTrack.info.bitDepth === 16) this.currentTrack.info.codec = 'pcm-s16be';
                            else if (this.currentTrack.info.bitDepth === 24) this.currentTrack.info.codec = 'pcm-s24be';
                            else if (this.currentTrack.info.bitDepth === 32) this.currentTrack.info.codec = 'pcm-s32be';
                        } else if (this.currentTrack.codecId === 'A_PCM/FLOAT/IEEE') {
                            if (this.currentTrack.info.bitDepth === 32) this.currentTrack.info.codec = 'pcm-f32';
                            else if (this.currentTrack.info.bitDepth === 64) this.currentTrack.info.codec = 'pcm-f64';
                        }
                        const audioTrack = this.currentTrack;
                        const inputTrack = new (0, _inputTrackJs.InputAudioTrack)(this.input, new MatroskaAudioTrackBacking(audioTrack));
                        this.currentTrack.inputTrack = inputTrack;
                        this.currentSegment.tracks.push(this.currentTrack);
                    }
                }
                this.currentTrack = null;
                break;
            case (0, _ebmlJs.EBMLId).TrackNumber:
                if (!this.currentTrack) break;
                this.currentTrack.id = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).TrackType:
                {
                    if (!this.currentTrack) break;
                    const type = (0, _ebmlJs.readUnsignedInt)(slice, size);
                    if (type === 1) this.currentTrack.info = {
                        type: 'video',
                        width: -1,
                        height: -1,
                        rotation: 0,
                        codec: null,
                        codecDescription: null,
                        colorSpace: null,
                        alphaMode: false
                    };
                    else if (type === 2) this.currentTrack.info = {
                        type: 'audio',
                        numberOfChannels: -1,
                        sampleRate: -1,
                        bitDepth: -1,
                        codec: null,
                        codecDescription: null,
                        aacCodecInfo: null
                    };
                }
                break;
            case (0, _ebmlJs.EBMLId).FlagEnabled:
                {
                    if (!this.currentTrack) break;
                    const enabled = (0, _ebmlJs.readUnsignedInt)(slice, size);
                    if (!enabled) {
                        this.currentSegment.tracks.pop();
                        this.currentTrack = null;
                    }
                }
                break;
            case (0, _ebmlJs.EBMLId).FlagDefault:
                if (!this.currentTrack) break;
                this.currentTrack.disposition.default = !!(0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).FlagForced:
                if (!this.currentTrack) break;
                this.currentTrack.disposition.forced = !!(0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).FlagOriginal:
                if (!this.currentTrack) break;
                this.currentTrack.disposition.original = !!(0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).FlagHearingImpaired:
                if (!this.currentTrack) break;
                this.currentTrack.disposition.hearingImpaired = !!(0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).FlagVisualImpaired:
                if (!this.currentTrack) break;
                this.currentTrack.disposition.visuallyImpaired = !!(0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).FlagCommentary:
                if (!this.currentTrack) break;
                this.currentTrack.disposition.commentary = !!(0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).CodecID:
                if (!this.currentTrack) break;
                this.currentTrack.codecId = (0, _ebmlJs.readAsciiString)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).CodecPrivate:
                if (!this.currentTrack) break;
                this.currentTrack.codecPrivate = (0, _readerJs.readBytes)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).DefaultDuration:
                if (!this.currentTrack) break;
                this.currentTrack.defaultDuration = this.currentTrack.segment.timestampFactor * (0, _ebmlJs.readUnsignedInt)(slice, size) / 1e9;
                break;
            case (0, _ebmlJs.EBMLId).Name:
                if (!this.currentTrack) break;
                this.currentTrack.name = (0, _ebmlJs.readUnicodeString)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).Language:
                if (!this.currentTrack) break;
                if (this.currentTrack.languageCode !== (0, _miscJs.UNDETERMINED_LANGUAGE)) break;
                this.currentTrack.languageCode = (0, _ebmlJs.readAsciiString)(slice, size);
                if (!(0, _miscJs.isIso639Dash2LanguageCode)(this.currentTrack.languageCode)) this.currentTrack.languageCode = (0, _miscJs.UNDETERMINED_LANGUAGE);
                break;
            case (0, _ebmlJs.EBMLId).LanguageBCP47:
                {
                    if (!this.currentTrack) break;
                    const bcp47 = (0, _ebmlJs.readAsciiString)(slice, size);
                    const languageSubtag = bcp47.split('-')[0];
                    if (languageSubtag) // Technically invalid, for now: The language subtag might be a language code from ISO 639-1,
                    // ISO 639-2, ISO 639-3, ISO 639-5 or some other thing (source: Wikipedia). But, `languageCode` is
                    // documented as ISO 639-2. Changing the definition would be a breaking change. This will get
                    // cleaned up in the future by defining languageCode to be BCP 47 instead.
                    this.currentTrack.languageCode = languageSubtag;
                    else this.currentTrack.languageCode = (0, _miscJs.UNDETERMINED_LANGUAGE);
                }
                break;
            case (0, _ebmlJs.EBMLId).Video:
                if (this.currentTrack?.info?.type !== 'video') break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                break;
            case (0, _ebmlJs.EBMLId).PixelWidth:
                if (this.currentTrack?.info?.type !== 'video') break;
                this.currentTrack.info.width = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).PixelHeight:
                if (this.currentTrack?.info?.type !== 'video') break;
                this.currentTrack.info.height = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).AlphaMode:
                if (this.currentTrack?.info?.type !== 'video') break;
                this.currentTrack.info.alphaMode = (0, _ebmlJs.readUnsignedInt)(slice, size) === 1;
                break;
            case (0, _ebmlJs.EBMLId).Colour:
                if (this.currentTrack?.info?.type !== 'video') break;
                this.currentTrack.info.colorSpace = {};
                this.readContiguousElements(slice.slice(dataStartPos, size));
                break;
            case (0, _ebmlJs.EBMLId).MatrixCoefficients:
                {
                    if (this.currentTrack?.info?.type !== 'video' || !this.currentTrack.info.colorSpace) break;
                    const matrixCoefficients = (0, _ebmlJs.readUnsignedInt)(slice, size);
                    const mapped = (0, _miscJs.MATRIX_COEFFICIENTS_MAP_INVERSE)[matrixCoefficients] ?? null;
                    this.currentTrack.info.colorSpace.matrix = mapped;
                }
                break;
            case (0, _ebmlJs.EBMLId).Range:
                if (this.currentTrack?.info?.type !== 'video' || !this.currentTrack.info.colorSpace) break;
                this.currentTrack.info.colorSpace.fullRange = (0, _ebmlJs.readUnsignedInt)(slice, size) === 2;
                break;
            case (0, _ebmlJs.EBMLId).TransferCharacteristics:
                {
                    if (this.currentTrack?.info?.type !== 'video' || !this.currentTrack.info.colorSpace) break;
                    const transferCharacteristics = (0, _ebmlJs.readUnsignedInt)(slice, size);
                    const mapped = (0, _miscJs.TRANSFER_CHARACTERISTICS_MAP_INVERSE)[transferCharacteristics] ?? null;
                    this.currentTrack.info.colorSpace.transfer = mapped;
                }
                break;
            case (0, _ebmlJs.EBMLId).Primaries:
                {
                    if (this.currentTrack?.info?.type !== 'video' || !this.currentTrack.info.colorSpace) break;
                    const primaries = (0, _ebmlJs.readUnsignedInt)(slice, size);
                    const mapped = (0, _miscJs.COLOR_PRIMARIES_MAP_INVERSE)[primaries] ?? null;
                    this.currentTrack.info.colorSpace.primaries = mapped;
                }
                break;
            case (0, _ebmlJs.EBMLId).Projection:
                if (this.currentTrack?.info?.type !== 'video') break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                break;
            case (0, _ebmlJs.EBMLId).ProjectionPoseRoll:
                {
                    if (this.currentTrack?.info?.type !== 'video') break;
                    const rotation = (0, _ebmlJs.readFloat)(slice, size);
                    const flippedRotation = -rotation; // Convert counter-clockwise to clockwise
                    try {
                        this.currentTrack.info.rotation = (0, _miscJs.normalizeRotation)(flippedRotation);
                    } catch  {
                    // It wasn't a valid rotation
                    }
                }
                break;
            case (0, _ebmlJs.EBMLId).Audio:
                if (this.currentTrack?.info?.type !== 'audio') break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                break;
            case (0, _ebmlJs.EBMLId).SamplingFrequency:
                if (this.currentTrack?.info?.type !== 'audio') break;
                this.currentTrack.info.sampleRate = (0, _ebmlJs.readFloat)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).Channels:
                if (this.currentTrack?.info?.type !== 'audio') break;
                this.currentTrack.info.numberOfChannels = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).BitDepth:
                if (this.currentTrack?.info?.type !== 'audio') break;
                this.currentTrack.info.bitDepth = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).CuePoint:
                if (!this.currentSegment) break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                this.currentCueTime = null;
                break;
            case (0, _ebmlJs.EBMLId).CueTime:
                this.currentCueTime = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).CueTrackPositions:
                {
                    if (this.currentCueTime === null) break;
                    (0, _miscJs.assert)(this.currentSegment);
                    const cuePoint = {
                        time: this.currentCueTime,
                        trackId: -1,
                        clusterPosition: -1
                    };
                    this.currentSegment.cuePoints.push(cuePoint);
                    this.readContiguousElements(slice.slice(dataStartPos, size));
                    if (cuePoint.trackId === -1 || cuePoint.clusterPosition === -1) this.currentSegment.cuePoints.pop();
                }
                break;
            case (0, _ebmlJs.EBMLId).CueTrack:
                {
                    const lastCuePoint = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
                    if (!lastCuePoint) break;
                    lastCuePoint.trackId = (0, _ebmlJs.readUnsignedInt)(slice, size);
                }
                break;
            case (0, _ebmlJs.EBMLId).CueClusterPosition:
                {
                    const lastCuePoint = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
                    if (!lastCuePoint) break;
                    (0, _miscJs.assert)(this.currentSegment);
                    lastCuePoint.clusterPosition = this.currentSegment.dataStartPos + (0, _ebmlJs.readUnsignedInt)(slice, size);
                }
                break;
            case (0, _ebmlJs.EBMLId).Timestamp:
                if (!this.currentCluster) break;
                this.currentCluster.timestamp = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).SimpleBlock:
                {
                    if (!this.currentCluster) break;
                    const trackNumber = (0, _ebmlJs.readVarInt)(slice);
                    if (trackNumber === null) break;
                    const trackData = this.getTrackDataInCluster(this.currentCluster, trackNumber);
                    if (!trackData) break; // Not a track we care about
                    const relativeTimestamp = (0, _readerJs.readI16Be)(slice);
                    const flags = (0, _readerJs.readU8)(slice);
                    const lacing = flags >> 1 & 0x3; // If the block is laced, we'll expand it later
                    let isKeyFrame = !!(flags & 0x80);
                    if (trackData.track.info?.type === 'audio' && trackData.track.info.codec) // Some files don't mark their audio packets as key packets (I'm looking at you, Firefox). But, we
                    // can fix this in most cases: if we recognize the codec of the track, then we know every packet is
                    // necessarily a key packet, no matter what the container says.
                    // https://github.com/Vanilagy/mediabunny/issues/192
                    isKeyFrame = true;
                    const blockData = (0, _readerJs.readBytes)(slice, size - (slice.filePos - dataStartPos));
                    const hasDecodingInstructions = trackData.track.decodingInstructions.length > 0;
                    trackData.blocks.push({
                        timestamp: relativeTimestamp,
                        duration: 0,
                        isKeyFrame,
                        data: blockData,
                        lacing,
                        decoded: !hasDecodingInstructions,
                        mainAdditional: null
                    });
                }
                break;
            case (0, _ebmlJs.EBMLId).BlockGroup:
                if (!this.currentCluster) break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                this.currentBlock = null;
                break;
            case (0, _ebmlJs.EBMLId).Block:
                {
                    if (!this.currentCluster) break;
                    const trackNumber = (0, _ebmlJs.readVarInt)(slice);
                    if (trackNumber === null) break;
                    const trackData = this.getTrackDataInCluster(this.currentCluster, trackNumber);
                    if (!trackData) break;
                    const relativeTimestamp = (0, _readerJs.readI16Be)(slice);
                    const flags = (0, _readerJs.readU8)(slice);
                    const lacing = flags >> 1 & 0x3; // If the block is laced, we'll expand it later
                    const blockData = (0, _readerJs.readBytes)(slice, size - (slice.filePos - dataStartPos));
                    const hasDecodingInstructions = trackData.track.decodingInstructions.length > 0;
                    this.currentBlock = {
                        timestamp: relativeTimestamp,
                        duration: 0,
                        isKeyFrame: true,
                        data: blockData,
                        lacing,
                        decoded: !hasDecodingInstructions,
                        mainAdditional: null
                    };
                    trackData.blocks.push(this.currentBlock);
                }
                break;
            case (0, _ebmlJs.EBMLId).BlockAdditions:
                this.readContiguousElements(slice.slice(dataStartPos, size));
                break;
            case (0, _ebmlJs.EBMLId).BlockMore:
                if (!this.currentBlock) break;
                this.currentBlockAdditional = {
                    addId: 1,
                    data: null
                };
                this.readContiguousElements(slice.slice(dataStartPos, size));
                if (this.currentBlockAdditional.data && this.currentBlockAdditional.addId === 1) this.currentBlock.mainAdditional = this.currentBlockAdditional.data;
                this.currentBlockAdditional = null;
                break;
            case (0, _ebmlJs.EBMLId).BlockAdditional:
                if (!this.currentBlockAdditional) break;
                this.currentBlockAdditional.data = (0, _readerJs.readBytes)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).BlockAddID:
                if (!this.currentBlockAdditional) break;
                this.currentBlockAdditional.addId = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).BlockDuration:
                if (!this.currentBlock) break;
                this.currentBlock.duration = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).ReferenceBlock:
                if (!this.currentBlock) break;
                this.currentBlock.isKeyFrame = false;
                break;
            case (0, _ebmlJs.EBMLId).Tag:
                this.currentTagTargetIsMovie = true;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                break;
            case (0, _ebmlJs.EBMLId).Targets:
                this.readContiguousElements(slice.slice(dataStartPos, size));
                break;
            case (0, _ebmlJs.EBMLId).TargetTypeValue:
                {
                    const targetTypeValue = (0, _ebmlJs.readUnsignedInt)(slice, size);
                    if (targetTypeValue !== 50) this.currentTagTargetIsMovie = false;
                }
                break;
            case (0, _ebmlJs.EBMLId).TagTrackUID:
            case (0, _ebmlJs.EBMLId).TagEditionUID:
            case (0, _ebmlJs.EBMLId).TagChapterUID:
            case (0, _ebmlJs.EBMLId).TagAttachmentUID:
                this.currentTagTargetIsMovie = false;
                break;
            case (0, _ebmlJs.EBMLId).SimpleTag:
                if (!this.currentTagTargetIsMovie) break;
                this.currentSimpleTagName = null;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                break;
            case (0, _ebmlJs.EBMLId).TagName:
                this.currentSimpleTagName = (0, _ebmlJs.readUnicodeString)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).TagString:
                {
                    if (!this.currentSimpleTagName) break;
                    const value = (0, _ebmlJs.readUnicodeString)(slice, size);
                    this.processTagValue(this.currentSimpleTagName, value);
                }
                break;
            case (0, _ebmlJs.EBMLId).TagBinary:
                {
                    if (!this.currentSimpleTagName) break;
                    const value = (0, _readerJs.readBytes)(slice, size);
                    this.processTagValue(this.currentSimpleTagName, value);
                }
                break;
            case (0, _ebmlJs.EBMLId).AttachedFile:
                {
                    if (!this.currentSegment) break;
                    this.currentAttachedFile = {
                        fileUid: null,
                        fileName: null,
                        fileMediaType: null,
                        fileData: null,
                        fileDescription: null
                    };
                    this.readContiguousElements(slice.slice(dataStartPos, size));
                    const tags = this.currentSegment.metadataTags;
                    if (this.currentAttachedFile.fileUid && this.currentAttachedFile.fileData) {
                        // All attached files get surfaced in the `raw` metadata tags
                        tags.raw ??= {};
                        tags.raw[this.currentAttachedFile.fileUid.toString()] = new (0, _metadataJs.AttachedFile)(this.currentAttachedFile.fileData, this.currentAttachedFile.fileMediaType ?? undefined, this.currentAttachedFile.fileName ?? undefined, this.currentAttachedFile.fileDescription ?? undefined);
                    }
                    // Only process image attachments
                    if (this.currentAttachedFile.fileMediaType?.startsWith('image/') && this.currentAttachedFile.fileData) {
                        const fileName = this.currentAttachedFile.fileName;
                        let kind = 'unknown';
                        if (fileName) {
                            const lowerName = fileName.toLowerCase();
                            if (lowerName.startsWith('cover.')) kind = 'coverFront';
                            else if (lowerName.startsWith('back.')) kind = 'coverBack';
                        }
                        tags.images ??= [];
                        tags.images.push({
                            data: this.currentAttachedFile.fileData,
                            mimeType: this.currentAttachedFile.fileMediaType,
                            kind,
                            name: this.currentAttachedFile.fileName ?? undefined,
                            description: this.currentAttachedFile.fileDescription ?? undefined
                        });
                    }
                    this.currentAttachedFile = null;
                }
                break;
            case (0, _ebmlJs.EBMLId).FileUID:
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileUid = (0, _ebmlJs.readUnsignedBigInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).FileName:
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileName = (0, _ebmlJs.readUnicodeString)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).FileMediaType:
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileMediaType = (0, _ebmlJs.readAsciiString)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).FileData:
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileData = (0, _readerJs.readBytes)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).FileDescription:
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileDescription = (0, _ebmlJs.readUnicodeString)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).ContentEncodings:
                if (!this.currentTrack) break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                // "**MUST** start with the `ContentEncoding` with the highest `ContentEncodingOrder`"
                this.currentTrack.decodingInstructions.sort((a, b)=>b.order - a.order);
                break;
            case (0, _ebmlJs.EBMLId).ContentEncoding:
                this.currentDecodingInstruction = {
                    order: 0,
                    scope: ContentEncodingScope.Block,
                    data: null
                };
                this.readContiguousElements(slice.slice(dataStartPos, size));
                if (this.currentDecodingInstruction.data) this.currentTrack.decodingInstructions.push(this.currentDecodingInstruction);
                this.currentDecodingInstruction = null;
                break;
            case (0, _ebmlJs.EBMLId).ContentEncodingOrder:
                if (!this.currentDecodingInstruction) break;
                this.currentDecodingInstruction.order = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).ContentEncodingScope:
                if (!this.currentDecodingInstruction) break;
                this.currentDecodingInstruction.scope = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).ContentCompression:
                if (!this.currentDecodingInstruction) break;
                this.currentDecodingInstruction.data = {
                    type: 'decompress',
                    algorithm: ContentCompAlgo.Zlib,
                    settings: null
                };
                this.readContiguousElements(slice.slice(dataStartPos, size));
                break;
            case (0, _ebmlJs.EBMLId).ContentCompAlgo:
                if (this.currentDecodingInstruction?.data?.type !== 'decompress') break;
                this.currentDecodingInstruction.data.algorithm = (0, _ebmlJs.readUnsignedInt)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).ContentCompSettings:
                if (this.currentDecodingInstruction?.data?.type !== 'decompress') break;
                this.currentDecodingInstruction.data.settings = (0, _readerJs.readBytes)(slice, size);
                break;
            case (0, _ebmlJs.EBMLId).ContentEncryption:
                if (!this.currentDecodingInstruction) break;
                this.currentDecodingInstruction.data = {
                    type: 'decrypt'
                };
                break;
        }
        slice.filePos = dataStartPos + size;
        return true;
    }
    decodeBlockData(track, rawData) {
        (0, _miscJs.assert)(track.decodingInstructions.length > 0); // This method shouldn't be called otherwise
        let currentData = rawData;
        for (const instruction of track.decodingInstructions){
            (0, _miscJs.assert)(instruction.data);
            switch(instruction.data.type){
                case 'decompress':
                    switch(instruction.data.algorithm){
                        case ContentCompAlgo.HeaderStripping:
                            if (instruction.data.settings && instruction.data.settings.length > 0) {
                                const prefix = instruction.data.settings;
                                const newData = new Uint8Array(prefix.length + currentData.length);
                                newData.set(prefix, 0);
                                newData.set(currentData, prefix.length);
                                currentData = newData;
                            }
                            break;
                        default:
                    }
                    break;
                default:
            }
        }
        return currentData;
    }
    processTagValue(name, value) {
        if (!this.currentSegment?.metadataTags) return;
        const metadataTags = this.currentSegment.metadataTags;
        metadataTags.raw ??= {};
        metadataTags.raw[name] ??= value;
        if (typeof value === 'string') switch(name.toLowerCase()){
            case 'title':
                metadataTags.title ??= value;
                break;
            case 'description':
                metadataTags.description ??= value;
                break;
            case 'artist':
                metadataTags.artist ??= value;
                break;
            case 'album':
                metadataTags.album ??= value;
                break;
            case 'album_artist':
                metadataTags.albumArtist ??= value;
                break;
            case 'genre':
                metadataTags.genre ??= value;
                break;
            case 'comment':
                metadataTags.comment ??= value;
                break;
            case 'lyrics':
                metadataTags.lyrics ??= value;
                break;
            case 'date':
                {
                    const date = new Date(value);
                    if (!Number.isNaN(date.getTime())) metadataTags.date ??= date;
                }
                break;
            case 'track_number':
            case 'part_number':
                {
                    const parts = value.split('/');
                    const trackNum = Number.parseInt(parts[0], 10);
                    const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                    if (Number.isInteger(trackNum) && trackNum > 0) metadataTags.trackNumber ??= trackNum;
                    if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) metadataTags.tracksTotal ??= tracksTotal;
                }
                break;
            case 'disc_number':
            case 'disc':
                {
                    const discParts = value.split('/');
                    const discNum = Number.parseInt(discParts[0], 10);
                    const discsTotal = discParts[1] && Number.parseInt(discParts[1], 10);
                    if (Number.isInteger(discNum) && discNum > 0) metadataTags.discNumber ??= discNum;
                    if (discsTotal && Number.isInteger(discsTotal) && discsTotal > 0) metadataTags.discsTotal ??= discsTotal;
                }
                break;
        }
    }
}
class MatroskaTrackBacking {
    constructor(internalTrack){
        this.internalTrack = internalTrack;
        this.packetToClusterLocation = new WeakMap();
    }
    getId() {
        return this.internalTrack.id;
    }
    getCodec() {
        throw new Error('Not implemented on base class.');
    }
    getInternalCodecId() {
        return this.internalTrack.codecId;
    }
    async computeDuration() {
        const lastPacket = await this.getPacket(Infinity, {
            metadataOnly: true
        });
        return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
    }
    getName() {
        return this.internalTrack.name;
    }
    getLanguageCode() {
        return this.internalTrack.languageCode;
    }
    async getFirstTimestamp() {
        const firstPacket = await this.getFirstPacket({
            metadataOnly: true
        });
        return firstPacket?.timestamp ?? 0;
    }
    getTimeResolution() {
        return this.internalTrack.segment.timestampFactor;
    }
    getDisposition() {
        return this.internalTrack.disposition;
    }
    async getFirstPacket(options) {
        return this.performClusterLookup(null, (cluster)=>{
            const trackData = cluster.trackData.get(this.internalTrack.id);
            if (trackData) return {
                blockIndex: 0,
                correctBlockFound: true
            };
            return {
                blockIndex: -1,
                correctBlockFound: false
            };
        }, -Infinity, Infinity, options);
    }
    intoTimescale(timestamp) {
        // Do a little rounding to catch cases where the result is very close to an integer. If it is, it's likely
        // that the number was originally an integer divided by the timescale. For stability, it's best
        // to return the integer in this case.
        return (0, _miscJs.roundIfAlmostInteger)(timestamp * this.internalTrack.segment.timestampFactor);
    }
    async getPacket(timestamp, options) {
        const timestampInTimescale = this.intoTimescale(timestamp);
        return this.performClusterLookup(null, (cluster)=>{
            const trackData = cluster.trackData.get(this.internalTrack.id);
            if (!trackData) return {
                blockIndex: -1,
                correctBlockFound: false
            };
            const index = (0, _miscJs.binarySearchLessOrEqual)(trackData.presentationTimestamps, timestampInTimescale, (x)=>x.timestamp);
            const blockIndex = index !== -1 ? trackData.presentationTimestamps[index].blockIndex : -1;
            const correctBlockFound = index !== -1 && timestampInTimescale < trackData.endTimestamp;
            return {
                blockIndex,
                correctBlockFound
            };
        }, timestampInTimescale, timestampInTimescale, options);
    }
    async getNextPacket(packet, options) {
        const locationInCluster = this.packetToClusterLocation.get(packet);
        if (locationInCluster === undefined) throw new Error('Packet was not created from this track.');
        return this.performClusterLookup(locationInCluster.cluster, (cluster)=>{
            if (cluster === locationInCluster.cluster) {
                const trackData = cluster.trackData.get(this.internalTrack.id);
                if (locationInCluster.blockIndex + 1 < trackData.blocks.length) // We can simply take the next block in the cluster
                return {
                    blockIndex: locationInCluster.blockIndex + 1,
                    correctBlockFound: true
                };
            } else {
                const trackData = cluster.trackData.get(this.internalTrack.id);
                if (trackData) return {
                    blockIndex: 0,
                    correctBlockFound: true
                };
            }
            return {
                blockIndex: -1,
                correctBlockFound: false
            };
        }, -Infinity, Infinity, options);
    }
    async getKeyPacket(timestamp, options) {
        const timestampInTimescale = this.intoTimescale(timestamp);
        return this.performClusterLookup(null, (cluster)=>{
            const trackData = cluster.trackData.get(this.internalTrack.id);
            if (!trackData) return {
                blockIndex: -1,
                correctBlockFound: false
            };
            const index = (0, _miscJs.findLastIndex)(trackData.presentationTimestamps, (x)=>{
                const block = trackData.blocks[x.blockIndex];
                return block.isKeyFrame && x.timestamp <= timestampInTimescale;
            });
            const blockIndex = index !== -1 ? trackData.presentationTimestamps[index].blockIndex : -1;
            const correctBlockFound = index !== -1 && timestampInTimescale < trackData.endTimestamp;
            return {
                blockIndex,
                correctBlockFound
            };
        }, timestampInTimescale, timestampInTimescale, options);
    }
    async getNextKeyPacket(packet, options) {
        const locationInCluster = this.packetToClusterLocation.get(packet);
        if (locationInCluster === undefined) throw new Error('Packet was not created from this track.');
        return this.performClusterLookup(locationInCluster.cluster, (cluster)=>{
            if (cluster === locationInCluster.cluster) {
                const trackData = cluster.trackData.get(this.internalTrack.id);
                const nextKeyFrameIndex = trackData.blocks.findIndex((x, i)=>x.isKeyFrame && i > locationInCluster.blockIndex);
                if (nextKeyFrameIndex !== -1) // We can simply take the next key frame in the cluster
                return {
                    blockIndex: nextKeyFrameIndex,
                    correctBlockFound: true
                };
            } else {
                const trackData = cluster.trackData.get(this.internalTrack.id);
                if (trackData && trackData.firstKeyFrameTimestamp !== null) {
                    const keyFrameIndex = trackData.blocks.findIndex((x)=>x.isKeyFrame);
                    (0, _miscJs.assert)(keyFrameIndex !== -1); // There must be one
                    return {
                        blockIndex: keyFrameIndex,
                        correctBlockFound: true
                    };
                }
            }
            return {
                blockIndex: -1,
                correctBlockFound: false
            };
        }, -Infinity, Infinity, options);
    }
    async fetchPacketInCluster(cluster, blockIndex, options) {
        if (blockIndex === -1) return null;
        const trackData = cluster.trackData.get(this.internalTrack.id);
        const block = trackData.blocks[blockIndex];
        (0, _miscJs.assert)(block);
        // Perform lazy decoding if needed
        if (!block.decoded) {
            block.data = this.internalTrack.demuxer.decodeBlockData(this.internalTrack, block.data);
            block.decoded = true;
        }
        const data = options.metadataOnly ? (0, _packetJs.PLACEHOLDER_DATA) : block.data;
        const timestamp = block.timestamp / this.internalTrack.segment.timestampFactor;
        const duration = block.duration / this.internalTrack.segment.timestampFactor;
        const sideData = {};
        if (block.mainAdditional && this.internalTrack.info?.type === 'video' && this.internalTrack.info.alphaMode) {
            sideData.alpha = options.metadataOnly ? (0, _packetJs.PLACEHOLDER_DATA) : block.mainAdditional;
            sideData.alphaByteLength = block.mainAdditional.byteLength;
        }
        const packet = new (0, _packetJs.EncodedPacket)(data, block.isKeyFrame ? 'key' : 'delta', timestamp, duration, cluster.dataStartPos + blockIndex, block.data.byteLength, sideData);
        this.packetToClusterLocation.set(packet, {
            cluster,
            blockIndex
        });
        return packet;
    }
    /** Looks for a packet in the clusters while trying to load as few clusters as possible to retrieve it. */ async performClusterLookup(// The cluster where we start looking
    startCluster, // This function returns the best-matching block in a given cluster
    getMatchInCluster, // The timestamp with which we can search the lookup table
    searchTimestamp, // The timestamp for which we know the correct block will not come after it
    latestTimestamp, options) {
        const { demuxer, segment } = this.internalTrack;
        let currentCluster = null;
        let bestCluster = null;
        let bestBlockIndex = -1;
        if (startCluster) {
            const { blockIndex, correctBlockFound } = getMatchInCluster(startCluster);
            if (correctBlockFound) return this.fetchPacketInCluster(startCluster, blockIndex, options);
            if (blockIndex !== -1) {
                bestCluster = startCluster;
                bestBlockIndex = blockIndex;
            }
        }
        // Search for a cue point; this way, we won't need to start searching from the start of the file
        // but can jump right into the correct cluster (or at least nearby).
        const cuePointIndex = (0, _miscJs.binarySearchLessOrEqual)(this.internalTrack.cuePoints, searchTimestamp, (x)=>x.time);
        const cuePoint = cuePointIndex !== -1 ? this.internalTrack.cuePoints[cuePointIndex] : null;
        // Also check the position cache
        const positionCacheIndex = (0, _miscJs.binarySearchLessOrEqual)(this.internalTrack.clusterPositionCache, searchTimestamp, (x)=>x.startTimestamp);
        const positionCacheEntry = positionCacheIndex !== -1 ? this.internalTrack.clusterPositionCache[positionCacheIndex] : null;
        const lookupEntryPosition = Math.max(cuePoint?.clusterPosition ?? 0, positionCacheEntry?.elementStartPos ?? 0) || null;
        let currentPos;
        if (!startCluster) currentPos = lookupEntryPosition ?? segment.clusterSeekStartPos;
        else if (lookupEntryPosition === null || startCluster.elementStartPos >= lookupEntryPosition) {
            currentPos = startCluster.elementEndPos;
            currentCluster = startCluster;
        } else // Use the lookup entry
        currentPos = lookupEntryPosition;
        while(segment.elementEndPos === null || currentPos <= segment.elementEndPos - (0, _ebmlJs.MIN_HEADER_SIZE)){
            if (currentCluster) {
                const trackData = currentCluster.trackData.get(this.internalTrack.id);
                if (trackData && trackData.startTimestamp > latestTimestamp) break;
            }
            // Load the header
            let slice = demuxer.reader.requestSliceRange(currentPos, (0, _ebmlJs.MIN_HEADER_SIZE), (0, _ebmlJs.MAX_HEADER_SIZE));
            if (slice instanceof Promise) slice = await slice;
            if (!slice) break;
            const elementStartPos = currentPos;
            const elementHeader = (0, _ebmlJs.readElementHeader)(slice);
            if (!elementHeader || !(0, _ebmlJs.LEVEL_1_EBML_IDS).includes(elementHeader.id) && elementHeader.id !== (0, _ebmlJs.EBMLId).Void) {
                // There's an element here that shouldn't be here. Might be garbage. In this case, let's
                // try and resync to the next valid element.
                const nextPos = await (0, _ebmlJs.resync)(demuxer.reader, elementStartPos, (0, _ebmlJs.LEVEL_1_EBML_IDS), Math.min(segment.elementEndPos ?? Infinity, elementStartPos + MAX_RESYNC_LENGTH));
                if (nextPos) {
                    currentPos = nextPos;
                    continue;
                } else break; // Resync failed
            }
            const id = elementHeader.id;
            let size = elementHeader.size;
            const dataStartPos = slice.filePos;
            if (id === (0, _ebmlJs.EBMLId).Cluster) {
                currentCluster = await demuxer.readCluster(elementStartPos, segment);
                // readCluster computes the proper size even if it's undefined in the header, so let's use that instead
                size = currentCluster.elementEndPos - dataStartPos;
                const { blockIndex, correctBlockFound } = getMatchInCluster(currentCluster);
                if (correctBlockFound) return this.fetchPacketInCluster(currentCluster, blockIndex, options);
                if (blockIndex !== -1) {
                    bestCluster = currentCluster;
                    bestBlockIndex = blockIndex;
                }
            }
            if (size === null) {
                // Undefined element size (can happen in livestreamed files). In this case, we need to do some
                // searching to determine the actual size of the element.
                (0, _miscJs.assert)(id !== (0, _ebmlJs.EBMLId).Cluster); // Undefined cluster sizes are fixed further up
                // Search for the next element at level 0 or 1
                const nextElementPos = await (0, _ebmlJs.searchForNextElementId)(demuxer.reader, dataStartPos, (0, _ebmlJs.LEVEL_0_AND_1_EBML_IDS), segment.elementEndPos);
                size = nextElementPos.pos - dataStartPos;
            }
            const endPos = dataStartPos + size;
            if (segment.elementEndPos === null) {
                // Check the next element. If it's a new segment, we know this segment ends here. The new
                // segment is just ignored, since we're likely in a livestreamed file and thus only care about
                // the first segment.
                let slice = demuxer.reader.requestSliceRange(endPos, (0, _ebmlJs.MIN_HEADER_SIZE), (0, _ebmlJs.MAX_HEADER_SIZE));
                if (slice instanceof Promise) slice = await slice;
                if (!slice) break;
                const elementId = (0, _ebmlJs.readElementId)(slice);
                if (elementId === (0, _ebmlJs.EBMLId).Segment) {
                    segment.elementEndPos = endPos; // We now know the segment's size
                    break;
                }
            }
            currentPos = endPos;
        }
        // Catch faulty cue points
        if (cuePoint && (!bestCluster || bestCluster.elementStartPos < cuePoint.clusterPosition)) {
            // The cue point lied to us! We found a cue point but no cluster there that satisfied the match. In this
            // case, let's search again but using the cue point before that.
            const previousCuePoint = this.internalTrack.cuePoints[cuePointIndex - 1];
            (0, _miscJs.assert)(!previousCuePoint || previousCuePoint.time < cuePoint.time);
            const newSearchTimestamp = previousCuePoint?.time ?? -Infinity;
            return this.performClusterLookup(null, getMatchInCluster, newSearchTimestamp, latestTimestamp, options);
        }
        if (bestCluster) // If we finished looping but didn't find a perfect match, still return the best match we found
        return this.fetchPacketInCluster(bestCluster, bestBlockIndex, options);
        return null;
    }
}
class MatroskaVideoTrackBacking extends MatroskaTrackBacking {
    constructor(internalTrack){
        super(internalTrack);
        this.decoderConfigPromise = null;
        this.internalTrack = internalTrack;
    }
    getCodec() {
        return this.internalTrack.info.codec;
    }
    getCodedWidth() {
        return this.internalTrack.info.width;
    }
    getCodedHeight() {
        return this.internalTrack.info.height;
    }
    getRotation() {
        return this.internalTrack.info.rotation;
    }
    async getColorSpace() {
        return {
            primaries: this.internalTrack.info.colorSpace?.primaries,
            transfer: this.internalTrack.info.colorSpace?.transfer,
            matrix: this.internalTrack.info.colorSpace?.matrix,
            fullRange: this.internalTrack.info.colorSpace?.fullRange
        };
    }
    async canBeTransparent() {
        return this.internalTrack.info.alphaMode;
    }
    async getDecoderConfig() {
        if (!this.internalTrack.info.codec) return null;
        return this.decoderConfigPromise ??= (async ()=>{
            let firstPacket = null;
            const needsPacketForAdditionalInfo = this.internalTrack.info.codec === 'vp9' || this.internalTrack.info.codec === 'av1' || this.internalTrack.info.codec === 'avc' && !this.internalTrack.info.codecDescription || this.internalTrack.info.codec === 'hevc' && !this.internalTrack.info.codecDescription;
            if (needsPacketForAdditionalInfo) firstPacket = await this.getFirstPacket({});
            return {
                codec: (0, _codecJs.extractVideoCodecString)({
                    width: this.internalTrack.info.width,
                    height: this.internalTrack.info.height,
                    codec: this.internalTrack.info.codec,
                    codecDescription: this.internalTrack.info.codecDescription,
                    colorSpace: this.internalTrack.info.colorSpace,
                    avcType: 1,
                    avcCodecInfo: this.internalTrack.info.codec === 'avc' && firstPacket ? (0, _codecDataJs.extractAvcDecoderConfigurationRecord)(firstPacket.data) : null,
                    hevcCodecInfo: this.internalTrack.info.codec === 'hevc' && firstPacket ? (0, _codecDataJs.extractHevcDecoderConfigurationRecord)(firstPacket.data) : null,
                    vp9CodecInfo: this.internalTrack.info.codec === 'vp9' && firstPacket ? (0, _codecDataJs.extractVp9CodecInfoFromPacket)(firstPacket.data) : null,
                    av1CodecInfo: this.internalTrack.info.codec === 'av1' && firstPacket ? (0, _codecDataJs.extractAv1CodecInfoFromPacket)(firstPacket.data) : null
                }),
                codedWidth: this.internalTrack.info.width,
                codedHeight: this.internalTrack.info.height,
                description: this.internalTrack.info.codecDescription ?? undefined,
                colorSpace: this.internalTrack.info.colorSpace ?? undefined
            };
        })();
    }
}
class MatroskaAudioTrackBacking extends MatroskaTrackBacking {
    constructor(internalTrack){
        super(internalTrack);
        this.decoderConfig = null;
        this.internalTrack = internalTrack;
    }
    getCodec() {
        return this.internalTrack.info.codec;
    }
    getNumberOfChannels() {
        return this.internalTrack.info.numberOfChannels;
    }
    getSampleRate() {
        return this.internalTrack.info.sampleRate;
    }
    async getDecoderConfig() {
        if (!this.internalTrack.info.codec) return null;
        return this.decoderConfig ??= {
            codec: (0, _codecJs.extractAudioCodecString)({
                codec: this.internalTrack.info.codec,
                codecDescription: this.internalTrack.info.codecDescription,
                aacCodecInfo: this.internalTrack.info.aacCodecInfo
            }),
            numberOfChannels: this.internalTrack.info.numberOfChannels,
            sampleRate: this.internalTrack.info.sampleRate,
            description: this.internalTrack.info.codecDescription ?? undefined
        };
    }
}

},{"../codec-data.js":"bzpVB","../codec.js":"4oSIO","../demuxer.js":"dZcnn","../input-track.js":"dPVVR","../metadata.js":"3j8h1","../misc.js":"kkhLS","../packet.js":"esYjd","./ebml.js":"b6nkD","./matroska-misc.js":"hb3cl","../reader.js":"fr2Ka","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"hb3cl":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "buildMatroskaMimeType", ()=>buildMatroskaMimeType);
const buildMatroskaMimeType = (info)=>{
    const base = info.hasVideo ? 'video/' : info.hasAudio ? 'audio/' : 'application/';
    let string = base + (info.isWebM ? 'webm' : 'x-matroska');
    if (info.codecStrings.length > 0) {
        const uniqueCodecMimeTypes = [
            ...new Set(info.codecStrings.filter(Boolean))
        ];
        string += `; codecs="${uniqueCodecMimeTypes.join(', ')}"`;
    }
    return string;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"aMGxe":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Mp3Demuxer", ()=>Mp3Demuxer);
var _demuxerJs = require("../demuxer.js");
var _inputTrackJs = require("../input-track.js");
var _metadataJs = require("../metadata.js");
var _miscJs = require("../misc.js");
var _packetJs = require("../packet.js");
var _mp3MiscJs = require("../../shared/mp3-misc.js");
var _id3Js = require("../id3.js");
var _mp3ReaderJs = require("./mp3-reader.js");
var _readerJs = require("../reader.js");
class Mp3Demuxer extends (0, _demuxerJs.Demuxer) {
    constructor(input){
        super(input);
        this.metadataPromise = null;
        this.firstFrameHeader = null;
        this.loadedSamples = []; // All samples from the start of the file to lastLoadedPos
        this.metadataTags = null;
        this.tracks = [];
        this.readingMutex = new (0, _miscJs.AsyncMutex)();
        this.lastSampleLoaded = false;
        this.lastLoadedPos = 0;
        this.nextTimestampInSamples = 0;
        this.reader = input._reader;
    }
    async readMetadata() {
        return this.metadataPromise ??= (async ()=>{
            // Keep loading until we find the first frame header
            while(!this.firstFrameHeader && !this.lastSampleLoaded)await this.advanceReader();
            if (!this.firstFrameHeader) throw new Error('No valid MP3 frame found.');
            this.tracks = [
                new (0, _inputTrackJs.InputAudioTrack)(this.input, new Mp3AudioTrackBacking(this))
            ];
        })();
    }
    async advanceReader() {
        if (this.lastLoadedPos === 0) // Let's skip all ID3v2 tags at the start of the file
        while(true){
            let slice = this.reader.requestSlice(this.lastLoadedPos, (0, _id3Js.ID3_V2_HEADER_SIZE));
            if (slice instanceof Promise) slice = await slice;
            if (!slice) {
                this.lastSampleLoaded = true;
                return;
            }
            const id3V2Header = (0, _id3Js.readId3V2Header)(slice);
            if (!id3V2Header) break;
            this.lastLoadedPos = slice.filePos + id3V2Header.size;
        }
        const result = await (0, _mp3ReaderJs.readNextFrameHeader)(this.reader, this.lastLoadedPos, this.reader.fileSize);
        if (!result) {
            this.lastSampleLoaded = true;
            return;
        }
        const header = result.header;
        this.lastLoadedPos = result.startPos + header.totalSize - 1; // -1 in case the frame is 1 byte too short
        const xingOffset = (0, _mp3MiscJs.getXingOffset)(header.mpegVersionId, header.channel);
        let slice = this.reader.requestSlice(result.startPos + xingOffset, 4);
        if (slice instanceof Promise) slice = await slice;
        if (slice) {
            const word = (0, _readerJs.readU32Be)(slice);
            const isXing = word === (0, _mp3MiscJs.XING) || word === (0, _mp3MiscJs.INFO);
            if (isXing) // There's no actual audio data in this frame, so let's skip it
            return;
        }
        if (!this.firstFrameHeader) this.firstFrameHeader = header;
        if (header.sampleRate !== this.firstFrameHeader.sampleRate) console.warn(`MP3 changed sample rate mid-file: ${this.firstFrameHeader.sampleRate} Hz to ${header.sampleRate} Hz.` + ` Might be a bug, so please report this file.`);
        const sampleDuration = header.audioSamplesInFrame / this.firstFrameHeader.sampleRate;
        const sample = {
            timestamp: this.nextTimestampInSamples / this.firstFrameHeader.sampleRate,
            duration: sampleDuration,
            dataStart: result.startPos,
            dataSize: header.totalSize
        };
        this.loadedSamples.push(sample);
        this.nextTimestampInSamples += header.audioSamplesInFrame;
        return;
    }
    async getMimeType() {
        return 'audio/mpeg';
    }
    async getTracks() {
        await this.readMetadata();
        return this.tracks;
    }
    async computeDuration() {
        await this.readMetadata();
        const track = this.tracks[0];
        (0, _miscJs.assert)(track);
        return track.computeDuration();
    }
    async getMetadataTags() {
        const release = await this.readingMutex.acquire();
        try {
            await this.readMetadata();
            if (this.metadataTags) return this.metadataTags;
            this.metadataTags = {};
            let currentPos = 0;
            let id3V2HeaderFound = false;
            while(true){
                let headerSlice = this.reader.requestSlice(currentPos, (0, _id3Js.ID3_V2_HEADER_SIZE));
                if (headerSlice instanceof Promise) headerSlice = await headerSlice;
                if (!headerSlice) break;
                const id3V2Header = (0, _id3Js.readId3V2Header)(headerSlice);
                if (!id3V2Header) break;
                id3V2HeaderFound = true;
                let contentSlice = this.reader.requestSlice(headerSlice.filePos, id3V2Header.size);
                if (contentSlice instanceof Promise) contentSlice = await contentSlice;
                if (!contentSlice) break;
                (0, _id3Js.parseId3V2Tag)(contentSlice, id3V2Header, this.metadataTags);
                currentPos = headerSlice.filePos + id3V2Header.size;
            }
            if (!id3V2HeaderFound && this.reader.fileSize !== null && this.reader.fileSize >= (0, _id3Js.ID3_V1_TAG_SIZE)) {
                // Try reading an ID3v1 tag at the end of the file
                let slice = this.reader.requestSlice(this.reader.fileSize - (0, _id3Js.ID3_V1_TAG_SIZE), (0, _id3Js.ID3_V1_TAG_SIZE));
                if (slice instanceof Promise) slice = await slice;
                (0, _miscJs.assert)(slice);
                const tag = (0, _readerJs.readAscii)(slice, 3);
                if (tag === 'TAG') (0, _id3Js.parseId3V1Tag)(slice, this.metadataTags);
            }
            return this.metadataTags;
        } finally{
            release();
        }
    }
}
class Mp3AudioTrackBacking {
    constructor(demuxer){
        this.demuxer = demuxer;
    }
    getId() {
        return 1;
    }
    async getFirstTimestamp() {
        return 0;
    }
    getTimeResolution() {
        (0, _miscJs.assert)(this.demuxer.firstFrameHeader);
        return this.demuxer.firstFrameHeader.sampleRate / this.demuxer.firstFrameHeader.audioSamplesInFrame;
    }
    async computeDuration() {
        const lastPacket = await this.getPacket(Infinity, {
            metadataOnly: true
        });
        return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
    }
    getName() {
        return null;
    }
    getLanguageCode() {
        return 0, _miscJs.UNDETERMINED_LANGUAGE;
    }
    getCodec() {
        return 'mp3';
    }
    getInternalCodecId() {
        return null;
    }
    getNumberOfChannels() {
        (0, _miscJs.assert)(this.demuxer.firstFrameHeader);
        return this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2;
    }
    getSampleRate() {
        (0, _miscJs.assert)(this.demuxer.firstFrameHeader);
        return this.demuxer.firstFrameHeader.sampleRate;
    }
    getDisposition() {
        return {
            ...(0, _metadataJs.DEFAULT_TRACK_DISPOSITION)
        };
    }
    async getDecoderConfig() {
        (0, _miscJs.assert)(this.demuxer.firstFrameHeader);
        return {
            codec: 'mp3',
            numberOfChannels: this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2,
            sampleRate: this.demuxer.firstFrameHeader.sampleRate
        };
    }
    async getPacketAtIndex(sampleIndex, options) {
        if (sampleIndex === -1) return null;
        const rawSample = this.demuxer.loadedSamples[sampleIndex];
        if (!rawSample) return null;
        let data;
        if (options.metadataOnly) data = (0, _packetJs.PLACEHOLDER_DATA);
        else {
            let slice = this.demuxer.reader.requestSlice(rawSample.dataStart, rawSample.dataSize);
            if (slice instanceof Promise) slice = await slice;
            if (!slice) return null; // Data didn't fit into the rest of the file
            data = (0, _readerJs.readBytes)(slice, rawSample.dataSize);
        }
        return new (0, _packetJs.EncodedPacket)(data, 'key', rawSample.timestamp, rawSample.duration, sampleIndex, rawSample.dataSize);
    }
    getFirstPacket(options) {
        return this.getPacketAtIndex(0, options);
    }
    async getNextPacket(packet, options) {
        const release = await this.demuxer.readingMutex.acquire();
        try {
            const sampleIndex = (0, _miscJs.binarySearchExact)(this.demuxer.loadedSamples, packet.timestamp, (x)=>x.timestamp);
            if (sampleIndex === -1) throw new Error('Packet was not created from this track.');
            const nextIndex = sampleIndex + 1;
            // Ensure the next sample exists
            while(nextIndex >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded)await this.demuxer.advanceReader();
            return this.getPacketAtIndex(nextIndex, options);
        } finally{
            release();
        }
    }
    async getPacket(timestamp, options) {
        const release = await this.demuxer.readingMutex.acquire();
        try {
            while(true){
                const index = (0, _miscJs.binarySearchLessOrEqual)(this.demuxer.loadedSamples, timestamp, (x)=>x.timestamp);
                if (index === -1 && this.demuxer.loadedSamples.length > 0) // We're before the first sample
                return null;
                if (this.demuxer.lastSampleLoaded) // All data is loaded, return what we found
                return this.getPacketAtIndex(index, options);
                if (index >= 0 && index + 1 < this.demuxer.loadedSamples.length) // The next packet also exists, we're done
                return this.getPacketAtIndex(index, options);
                // Otherwise, keep loading data
                await this.demuxer.advanceReader();
            }
        } finally{
            release();
        }
    }
    getKeyPacket(timestamp, options) {
        return this.getPacket(timestamp, options);
    }
    getNextKeyPacket(packet, options) {
        return this.getNextPacket(packet, options);
    }
}

},{"../demuxer.js":"dZcnn","../input-track.js":"dPVVR","../metadata.js":"3j8h1","../misc.js":"kkhLS","../packet.js":"esYjd","../../shared/mp3-misc.js":"k3lpY","../id3.js":"5tvk3","./mp3-reader.js":"kFP95","../reader.js":"fr2Ka","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"k3lpY":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FRAME_HEADER_SIZE", ()=>FRAME_HEADER_SIZE);
parcelHelpers.export(exports, "SAMPLING_RATES", ()=>SAMPLING_RATES);
parcelHelpers.export(exports, "KILOBIT_RATES", ()=>KILOBIT_RATES);
parcelHelpers.export(exports, "XING", ()=>XING);
parcelHelpers.export(exports, "INFO", ()=>INFO);
parcelHelpers.export(exports, "computeMp3FrameSize", ()=>computeMp3FrameSize);
parcelHelpers.export(exports, "getXingOffset", ()=>getXingOffset);
parcelHelpers.export(exports, "readFrameHeader", ()=>readFrameHeader);
parcelHelpers.export(exports, "encodeSynchsafe", ()=>encodeSynchsafe);
parcelHelpers.export(exports, "decodeSynchsafe", ()=>decodeSynchsafe);
const FRAME_HEADER_SIZE = 4;
const SAMPLING_RATES = [
    44100,
    48000,
    32000
];
const KILOBIT_RATES = [
    // lowSamplingFrequency === 0
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    32,
    40,
    48,
    56,
    64,
    80,
    96,
    112,
    128,
    160,
    192,
    224,
    256,
    320,
    -1,
    -1,
    32,
    48,
    56,
    64,
    80,
    96,
    112,
    128,
    160,
    192,
    224,
    256,
    320,
    384,
    -1,
    -1,
    32,
    64,
    96,
    128,
    160,
    192,
    224,
    256,
    288,
    320,
    352,
    384,
    416,
    448,
    -1,
    // lowSamplingFrequency === 1
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    8,
    16,
    24,
    32,
    40,
    48,
    56,
    64,
    80,
    96,
    112,
    128,
    144,
    160,
    -1,
    -1,
    8,
    16,
    24,
    32,
    40,
    48,
    56,
    64,
    80,
    96,
    112,
    128,
    144,
    160,
    -1,
    -1,
    32,
    48,
    56,
    64,
    80,
    96,
    112,
    128,
    144,
    160,
    176,
    192,
    224,
    256,
    -1
];
const XING = 0x58696e67;
const INFO = 0x496e666f;
const computeMp3FrameSize = (lowSamplingFrequency, layer, bitrate, sampleRate, padding)=>{
    if (layer === 0) return 0; // Not expected that this is hit
    else if (layer === 1) return Math.floor(144 * bitrate / (sampleRate << lowSamplingFrequency)) + padding;
    else if (layer === 2) return Math.floor(144 * bitrate / sampleRate) + padding;
    else return (Math.floor(12 * bitrate / sampleRate) + padding) * 4;
};
const getXingOffset = (mpegVersionId, channel)=>{
    return mpegVersionId === 3 ? channel === 3 ? 21 : 36 : channel === 3 ? 13 : 21;
};
const readFrameHeader = (word, remainingBytes)=>{
    const firstByte = word >>> 24;
    const secondByte = word >>> 16 & 0xff;
    const thirdByte = word >>> 8 & 0xff;
    const fourthByte = word & 0xff;
    if (firstByte !== 0xff && secondByte !== 0xff && thirdByte !== 0xff && fourthByte !== 0xff) return {
        header: null,
        bytesAdvanced: 4
    };
    if (firstByte !== 0xff) return {
        header: null,
        bytesAdvanced: 1
    };
    if ((secondByte & 0xe0) !== 0xe0) return {
        header: null,
        bytesAdvanced: 1
    };
    let lowSamplingFrequency = 0;
    let mpeg25 = 0;
    if (secondByte & 16) lowSamplingFrequency = secondByte & 8 ? 0 : 1;
    else {
        lowSamplingFrequency = 1;
        mpeg25 = 1;
    }
    const mpegVersionId = secondByte >> 3 & 0x3;
    const layer = secondByte >> 1 & 0x3;
    const bitrateIndex = thirdByte >> 4 & 0xf;
    const frequencyIndex = (thirdByte >> 2 & 0x3) % 3;
    const padding = thirdByte >> 1 & 0x1;
    const channel = fourthByte >> 6 & 0x3;
    const modeExtension = fourthByte >> 4 & 0x3;
    const copyright = fourthByte >> 3 & 0x1;
    const original = fourthByte >> 2 & 0x1;
    const emphasis = fourthByte & 0x3;
    const kilobitRate = KILOBIT_RATES[lowSamplingFrequency * 64 + layer * 16 + bitrateIndex];
    if (kilobitRate === -1) return {
        header: null,
        bytesAdvanced: 1
    };
    const bitrate = kilobitRate * 1000;
    const sampleRate = SAMPLING_RATES[frequencyIndex] >> lowSamplingFrequency + mpeg25;
    const frameLength = computeMp3FrameSize(lowSamplingFrequency, layer, bitrate, sampleRate, padding);
    if (remainingBytes !== null && remainingBytes < frameLength) // The frame doesn't fit into the rest of the file
    return {
        header: null,
        bytesAdvanced: 1
    };
    let audioSamplesInFrame;
    if (mpegVersionId === 3) audioSamplesInFrame = layer === 3 ? 384 : 1152;
    else {
        if (layer === 3) audioSamplesInFrame = 384;
        else if (layer === 2) audioSamplesInFrame = 1152;
        else audioSamplesInFrame = 576;
    }
    return {
        header: {
            totalSize: frameLength,
            mpegVersionId,
            layer,
            bitrate,
            frequencyIndex,
            sampleRate,
            channel,
            modeExtension,
            copyright,
            original,
            emphasis,
            audioSamplesInFrame
        },
        bytesAdvanced: 1
    };
};
const encodeSynchsafe = (unsynchsafed)=>{
    let mask = 0x7f;
    let synchsafed = 0;
    let unsynchsafedRest = unsynchsafed;
    while((mask ^ 0x7fffffff) !== 0){
        synchsafed = unsynchsafedRest & ~mask;
        synchsafed <<= 1;
        synchsafed |= unsynchsafedRest & mask;
        mask = (mask + 1 << 8) - 1;
        unsynchsafedRest = synchsafed;
    }
    return synchsafed;
};
const decodeSynchsafe = (synchsafed)=>{
    let mask = 0x7f000000;
    let unsynchsafed = 0;
    while(mask !== 0){
        unsynchsafed >>= 1;
        unsynchsafed |= synchsafed & mask;
        mask >>= 8;
    }
    return unsynchsafed;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"5tvk3":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Id3V2HeaderFlags", ()=>Id3V2HeaderFlags);
parcelHelpers.export(exports, "Id3V2TextEncoding", ()=>Id3V2TextEncoding);
parcelHelpers.export(exports, "ID3_V1_TAG_SIZE", ()=>ID3_V1_TAG_SIZE);
parcelHelpers.export(exports, "ID3_V2_HEADER_SIZE", ()=>ID3_V2_HEADER_SIZE);
parcelHelpers.export(exports, "ID3_V1_GENRES", ()=>ID3_V1_GENRES);
parcelHelpers.export(exports, "parseId3V1Tag", ()=>parseId3V1Tag);
parcelHelpers.export(exports, "readId3V1String", ()=>readId3V1String);
parcelHelpers.export(exports, "readId3V2Header", ()=>readId3V2Header);
parcelHelpers.export(exports, "parseId3V2Tag", ()=>parseId3V2Tag);
// https://id3.org/id3v2.3.0
parcelHelpers.export(exports, "Id3V2Reader", ()=>Id3V2Reader);
parcelHelpers.export(exports, "Id3V2Writer", ()=>Id3V2Writer);
var _mp3MiscJs = require("../shared/mp3-misc.js");
var _miscJs = require("./misc.js");
var _readerJs = require("./reader.js");
var Id3V2HeaderFlags;
(function(Id3V2HeaderFlags) {
    Id3V2HeaderFlags[Id3V2HeaderFlags["Unsynchronisation"] = 128] = "Unsynchronisation";
    Id3V2HeaderFlags[Id3V2HeaderFlags["ExtendedHeader"] = 64] = "ExtendedHeader";
    Id3V2HeaderFlags[Id3V2HeaderFlags["ExperimentalIndicator"] = 32] = "ExperimentalIndicator";
    Id3V2HeaderFlags[Id3V2HeaderFlags["Footer"] = 16] = "Footer";
})(Id3V2HeaderFlags || (Id3V2HeaderFlags = {}));
var Id3V2TextEncoding;
(function(Id3V2TextEncoding) {
    Id3V2TextEncoding[Id3V2TextEncoding["ISO_8859_1"] = 0] = "ISO_8859_1";
    Id3V2TextEncoding[Id3V2TextEncoding["UTF_16_WITH_BOM"] = 1] = "UTF_16_WITH_BOM";
    Id3V2TextEncoding[Id3V2TextEncoding["UTF_16_BE_NO_BOM"] = 2] = "UTF_16_BE_NO_BOM";
    Id3V2TextEncoding[Id3V2TextEncoding["UTF_8"] = 3] = "UTF_8";
})(Id3V2TextEncoding || (Id3V2TextEncoding = {}));
const ID3_V1_TAG_SIZE = 128;
const ID3_V2_HEADER_SIZE = 10;
const ID3_V1_GENRES = [
    'Blues',
    'Classic rock',
    'Country',
    'Dance',
    'Disco',
    'Funk',
    'Grunge',
    'Hip-hop',
    'Jazz',
    'Metal',
    'New age',
    'Oldies',
    'Other',
    'Pop',
    'Rhythm and blues',
    'Rap',
    'Reggae',
    'Rock',
    'Techno',
    'Industrial',
    'Alternative',
    'Ska',
    'Death metal',
    'Pranks',
    'Soundtrack',
    'Euro-techno',
    'Ambient',
    'Trip-hop',
    'Vocal',
    'Jazz & funk',
    'Fusion',
    'Trance',
    'Classical',
    'Instrumental',
    'Acid',
    'House',
    'Game',
    'Sound clip',
    'Gospel',
    'Noise',
    'Alternative rock',
    'Bass',
    'Soul',
    'Punk',
    'Space',
    'Meditative',
    'Instrumental pop',
    'Instrumental rock',
    'Ethnic',
    'Gothic',
    'Darkwave',
    'Techno-industrial',
    'Electronic',
    'Pop-folk',
    'Eurodance',
    'Dream',
    'Southern rock',
    'Comedy',
    'Cult',
    'Gangsta',
    'Top 40',
    'Christian rap',
    'Pop/funk',
    'Jungle music',
    'Native US',
    'Cabaret',
    'New wave',
    'Psychedelic',
    'Rave',
    'Showtunes',
    'Trailer',
    'Lo-fi',
    'Tribal',
    'Acid punk',
    'Acid jazz',
    'Polka',
    'Retro',
    'Musical',
    'Rock \'n\' roll',
    'Hard rock',
    'Folk',
    'Folk rock',
    'National folk',
    'Swing',
    'Fast fusion',
    'Bebop',
    'Latin',
    'Revival',
    'Celtic',
    'Bluegrass',
    'Avantgarde',
    'Gothic rock',
    'Progressive rock',
    'Psychedelic rock',
    'Symphonic rock',
    'Slow rock',
    'Big band',
    'Chorus',
    'Easy listening',
    'Acoustic',
    'Humour',
    'Speech',
    'Chanson',
    'Opera',
    'Chamber music',
    'Sonata',
    'Symphony',
    'Booty bass',
    'Primus',
    'Porn groove',
    'Satire',
    'Slow jam',
    'Club',
    'Tango',
    'Samba',
    'Folklore',
    'Ballad',
    'Power ballad',
    'Rhythmic Soul',
    'Freestyle',
    'Duet',
    'Punk rock',
    'Drum solo',
    'A cappella',
    'Euro-house',
    'Dance hall',
    'Goa music',
    'Drum & bass',
    'Club-house',
    'Hardcore techno',
    'Terror',
    'Indie',
    'Britpop',
    'Negerpunk',
    'Polsk punk',
    'Beat',
    'Christian gangsta rap',
    'Heavy metal',
    'Black metal',
    'Crossover',
    'Contemporary Christian',
    'Christian rock',
    'Merengue',
    'Salsa',
    'Thrash metal',
    'Anime',
    'Jpop',
    'Synthpop',
    'Christmas',
    'Art rock',
    'Baroque',
    'Bhangra',
    'Big beat',
    'Breakbeat',
    'Chillout',
    'Downtempo',
    'Dub',
    'EBM',
    'Eclectic',
    'Electro',
    'Electroclash',
    'Emo',
    'Experimental',
    'Garage',
    'Global',
    'IDM',
    'Illbient',
    'Industro-Goth',
    'Jam Band',
    'Krautrock',
    'Leftfield',
    'Lounge',
    'Math rock',
    'New romantic',
    'Nu-breakz',
    'Post-punk',
    'Post-rock',
    'Psytrance',
    'Shoegaze',
    'Space rock',
    'Trop rock',
    'World music',
    'Neoclassical',
    'Audiobook',
    'Audio theatre',
    'Neue Deutsche Welle',
    'Podcast',
    'Indie rock',
    'G-Funk',
    'Dubstep',
    'Garage rock',
    'Psybient'
];
const parseId3V1Tag = (slice, tags)=>{
    const startPos = slice.filePos;
    tags.raw ??= {};
    tags.raw['TAG'] ??= (0, _readerJs.readBytes)(slice, ID3_V1_TAG_SIZE - 3); // Dump the whole tag into the raw metadata
    slice.filePos = startPos;
    const title = readId3V1String(slice, 30);
    if (title) tags.title ??= title;
    const artist = readId3V1String(slice, 30);
    if (artist) tags.artist ??= artist;
    const album = readId3V1String(slice, 30);
    if (album) tags.album ??= album;
    const yearText = readId3V1String(slice, 4);
    const year = Number.parseInt(yearText, 10);
    if (Number.isInteger(year) && year > 0) tags.date ??= new Date(year, 0, 1);
    const commentBytes = (0, _readerJs.readBytes)(slice, 30);
    let comment;
    // Check for the ID3v1.1 track number format:
    // The 29th byte (index 28) is a null terminator, and the 30th byte is the track number.
    if (commentBytes[28] === 0 && commentBytes[29] !== 0) {
        const trackNum = commentBytes[29];
        if (trackNum > 0) tags.trackNumber ??= trackNum;
        slice.skip(-30);
        comment = readId3V1String(slice, 28);
        slice.skip(2);
    } else {
        slice.skip(-30);
        comment = readId3V1String(slice, 30);
    }
    if (comment) tags.comment ??= comment;
    const genreIndex = (0, _readerJs.readU8)(slice);
    if (genreIndex < ID3_V1_GENRES.length) tags.genre ??= ID3_V1_GENRES[genreIndex];
};
const readId3V1String = (slice, length)=>{
    const bytes = (0, _readerJs.readBytes)(slice, length);
    const endIndex = (0, _miscJs.coalesceIndex)(bytes.indexOf(0), bytes.length);
    const relevantBytes = bytes.subarray(0, endIndex);
    // Decode as ISO-8859-1
    let str = '';
    for(let i = 0; i < relevantBytes.length; i++)str += String.fromCharCode(relevantBytes[i]);
    return str.trimEnd(); // String also may be padded with spaces
};
const readId3V2Header = (slice)=>{
    const startPos = slice.filePos;
    const tag = (0, _readerJs.readAscii)(slice, 3);
    const majorVersion = (0, _readerJs.readU8)(slice);
    const revision = (0, _readerJs.readU8)(slice);
    const flags = (0, _readerJs.readU8)(slice);
    const sizeRaw = (0, _readerJs.readU32Be)(slice);
    if (tag !== 'ID3' || majorVersion === 0xff || revision === 0xff || (sizeRaw & 0x80808080) !== 0) {
        slice.filePos = startPos;
        return null;
    }
    const size = (0, _mp3MiscJs.decodeSynchsafe)(sizeRaw);
    return {
        majorVersion,
        revision,
        flags,
        size
    };
};
const parseId3V2Tag = (slice, header, tags)=>{
    // https://id3.org/id3v2.3.0
    if (![
        2,
        3,
        4
    ].includes(header.majorVersion)) {
        console.warn(`Unsupported ID3v2 major version: ${header.majorVersion}`);
        return;
    }
    const bytes = (0, _readerJs.readBytes)(slice, header.size);
    const reader = new Id3V2Reader(header, bytes);
    if (header.flags & Id3V2HeaderFlags.Footer) reader.removeFooter();
    if (header.flags & Id3V2HeaderFlags.Unsynchronisation && header.majorVersion === 3) reader.ununsynchronizeAll();
    if (header.flags & Id3V2HeaderFlags.ExtendedHeader) {
        const extendedHeaderSize = reader.readU32();
        if (header.majorVersion === 3) reader.pos += extendedHeaderSize; // The extended header size excludes itself
        else reader.pos += extendedHeaderSize - 4; // The extended header size includes itself
    }
    while(reader.pos <= reader.bytes.length - reader.frameHeaderSize()){
        const frame = reader.readId3V2Frame();
        if (!frame) break;
        const frameStartPos = reader.pos;
        const frameEndPos = reader.pos + frame.size;
        let frameEncrypted = false;
        let frameCompressed = false;
        let frameUnsynchronized = false;
        if (header.majorVersion === 3) {
            frameEncrypted = !!(frame.flags & 64);
            frameCompressed = !!(frame.flags & 128);
        } else if (header.majorVersion === 4) {
            frameEncrypted = !!(frame.flags & 4);
            frameCompressed = !!(frame.flags & 8);
            frameUnsynchronized = !!(frame.flags & 2) || !!(header.flags & Id3V2HeaderFlags.Unsynchronisation);
        }
        if (frameEncrypted) {
            console.warn(`Skipping encrypted ID3v2 frame ${frame.id}`);
            reader.pos = frameEndPos;
            continue;
        }
        if (frameCompressed) {
            console.warn(`Skipping compressed ID3v2 frame ${frame.id}`); // Maybe someday? Idk
            reader.pos = frameEndPos;
            continue;
        }
        if (frameUnsynchronized) reader.ununsynchronizeRegion(reader.pos, frameEndPos);
        tags.raw ??= {};
        if (frame.id[0] === 'T') // It's a text frame, let's decode as text
        tags.raw[frame.id] ??= reader.readId3V2EncodingAndText(frameEndPos);
        else // For the others, let's just get the bytes
        tags.raw[frame.id] ??= reader.readBytes(frame.size);
        reader.pos = frameStartPos;
        switch(frame.id){
            case 'TIT2':
            case 'TT2':
                tags.title ??= reader.readId3V2EncodingAndText(frameEndPos);
                break;
            case 'TIT3':
            case 'TT3':
                tags.description ??= reader.readId3V2EncodingAndText(frameEndPos);
                break;
            case 'TPE1':
            case 'TP1':
                tags.artist ??= reader.readId3V2EncodingAndText(frameEndPos);
                break;
            case 'TALB':
            case 'TAL':
                tags.album ??= reader.readId3V2EncodingAndText(frameEndPos);
                break;
            case 'TPE2':
            case 'TP2':
                tags.albumArtist ??= reader.readId3V2EncodingAndText(frameEndPos);
                break;
            case 'TRCK':
            case 'TRK':
                {
                    const trackText = reader.readId3V2EncodingAndText(frameEndPos);
                    const parts = trackText.split('/');
                    const trackNum = Number.parseInt(parts[0], 10);
                    const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                    if (Number.isInteger(trackNum) && trackNum > 0) tags.trackNumber ??= trackNum;
                    if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) tags.tracksTotal ??= tracksTotal;
                }
                break;
            case 'TPOS':
            case 'TPA':
                {
                    const discText = reader.readId3V2EncodingAndText(frameEndPos);
                    const parts = discText.split('/');
                    const discNum = Number.parseInt(parts[0], 10);
                    const discsTotal = parts[1] && Number.parseInt(parts[1], 10);
                    if (Number.isInteger(discNum) && discNum > 0) tags.discNumber ??= discNum;
                    if (discsTotal && Number.isInteger(discsTotal) && discsTotal > 0) tags.discsTotal ??= discsTotal;
                }
                break;
            case 'TCON':
            case 'TCO':
                {
                    const genreText = reader.readId3V2EncodingAndText(frameEndPos);
                    let match = /^\((\d+)\)/.exec(genreText);
                    if (match) {
                        const genreNumber = Number.parseInt(match[1]);
                        if (ID3_V1_GENRES[genreNumber] !== undefined) {
                            tags.genre ??= ID3_V1_GENRES[genreNumber];
                            break;
                        }
                    }
                    match = /^\d+$/.exec(genreText);
                    if (match) {
                        const genreNumber = Number.parseInt(match[0]);
                        if (ID3_V1_GENRES[genreNumber] !== undefined) {
                            tags.genre ??= ID3_V1_GENRES[genreNumber];
                            break;
                        }
                    }
                    tags.genre ??= genreText;
                }
                break;
            case 'TDRC':
            case 'TDAT':
                {
                    const dateText = reader.readId3V2EncodingAndText(frameEndPos);
                    const date = new Date(dateText);
                    if (!Number.isNaN(date.getTime())) tags.date ??= date;
                }
                break;
            case 'TYER':
            case 'TYE':
                {
                    const yearText = reader.readId3V2EncodingAndText(frameEndPos);
                    const year = Number.parseInt(yearText, 10);
                    if (Number.isInteger(year)) tags.date ??= new Date(year, 0, 1);
                }
                break;
            case 'USLT':
            case 'ULT':
                {
                    const encoding = reader.readU8();
                    reader.pos += 3; // Skip language
                    reader.readId3V2Text(encoding, frameEndPos); // Short content description
                    tags.lyrics ??= reader.readId3V2Text(encoding, frameEndPos);
                }
                break;
            case 'COMM':
            case 'COM':
                {
                    const encoding = reader.readU8();
                    reader.pos += 3; // Skip language
                    reader.readId3V2Text(encoding, frameEndPos); // Short content description
                    tags.comment ??= reader.readId3V2Text(encoding, frameEndPos);
                }
                break;
            case 'APIC':
            case 'PIC':
                {
                    const encoding = reader.readId3V2TextEncoding();
                    let mimeType;
                    if (header.majorVersion === 2) {
                        const imageFormat = reader.readAscii(3);
                        mimeType = imageFormat === 'PNG' ? 'image/png' : imageFormat === 'JPG' ? 'image/jpeg' : 'image/*';
                    } else mimeType = reader.readId3V2Text(encoding, frameEndPos);
                    const pictureType = reader.readU8();
                    const description = reader.readId3V2Text(encoding, frameEndPos).trimEnd(); // Trim ending spaces
                    const imageDataSize = frameEndPos - reader.pos;
                    if (imageDataSize >= 0) {
                        const imageData = reader.readBytes(imageDataSize);
                        if (!tags.images) tags.images = [];
                        tags.images.push({
                            data: imageData,
                            mimeType,
                            kind: pictureType === 3 ? 'coverFront' : pictureType === 4 ? 'coverBack' : 'unknown',
                            description
                        });
                    }
                }
                break;
            default:
                reader.pos += frame.size;
                break;
        }
        reader.pos = frameEndPos;
    }
};
class Id3V2Reader {
    constructor(header, bytes){
        this.header = header;
        this.bytes = bytes;
        this.pos = 0;
        this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    }
    frameHeaderSize() {
        return this.header.majorVersion === 2 ? 6 : 10;
    }
    ununsynchronizeAll() {
        const newBytes = [];
        for(let i = 0; i < this.bytes.length; i++){
            const value1 = this.bytes[i];
            newBytes.push(value1);
            if (value1 === 0xff && i !== this.bytes.length - 1) {
                const value2 = this.bytes[i];
                if (value2 === 0x00) i++;
            }
        }
        this.bytes = new Uint8Array(newBytes);
        this.view = new DataView(this.bytes.buffer);
    }
    ununsynchronizeRegion(start, end) {
        const newBytes = [];
        for(let i = start; i < end; i++){
            const value1 = this.bytes[i];
            newBytes.push(value1);
            if (value1 === 0xff && i !== end - 1) {
                const value2 = this.bytes[i + 1];
                if (value2 === 0x00) i++;
            }
        }
        const before = this.bytes.subarray(0, start);
        const after = this.bytes.subarray(end);
        this.bytes = new Uint8Array(before.length + newBytes.length + after.length);
        this.bytes.set(before, 0);
        this.bytes.set(newBytes, before.length);
        this.bytes.set(after, before.length + newBytes.length);
        this.view = new DataView(this.bytes.buffer);
    }
    removeFooter() {
        this.bytes = this.bytes.subarray(0, this.bytes.length - ID3_V2_HEADER_SIZE);
        this.view = new DataView(this.bytes.buffer);
    }
    readBytes(length) {
        const slice = this.bytes.subarray(this.pos, this.pos + length);
        this.pos += length;
        return slice;
    }
    readU8() {
        const value = this.view.getUint8(this.pos);
        this.pos += 1;
        return value;
    }
    readU16() {
        const value = this.view.getUint16(this.pos, false);
        this.pos += 2;
        return value;
    }
    readU24() {
        const high = this.view.getUint16(this.pos, false);
        const low = this.view.getUint8(this.pos + 1);
        this.pos += 3;
        return high * 0x100 + low;
    }
    readU32() {
        const value = this.view.getUint32(this.pos, false);
        this.pos += 4;
        return value;
    }
    readAscii(length) {
        let str = '';
        for(let i = 0; i < length; i++)str += String.fromCharCode(this.view.getUint8(this.pos + i));
        this.pos += length;
        return str;
    }
    readId3V2Frame() {
        if (this.header.majorVersion === 2) {
            const id = this.readAscii(3);
            if (id === '\x00\x00\x00') return null;
            const size = this.readU24();
            return {
                id,
                size,
                flags: 0
            };
        } else {
            const id = this.readAscii(4);
            if (id === '\x00\x00\x00\x00') // We've landed in the padding section
            return null;
            const sizeRaw = this.readU32();
            let size = this.header.majorVersion === 4 ? (0, _mp3MiscJs.decodeSynchsafe)(sizeRaw) : sizeRaw;
            const flags = this.readU16();
            const headerEndPos = this.pos;
            // Some files may have incorrectly synchsafed/unsynchsafed sizes. To validate which interpretation is valid,
            // we validate a size by skipping ahead and seeing if we land at a valid frame header (or at the end of the
            // tag.
            const isSizeValid = (size)=>{
                const nextPos = this.pos + size;
                if (nextPos > this.bytes.length) return false;
                if (nextPos <= this.bytes.length - this.frameHeaderSize()) {
                    this.pos += size;
                    const nextId = this.readAscii(4);
                    if (nextId !== '\x00\x00\x00\x00' && !/[0-9A-Z]{4}/.test(nextId)) return false;
                }
                return true;
            };
            if (!isSizeValid(size)) {
                // Flip the synchsafing, and try if this one makes more sense
                const otherSize = this.header.majorVersion === 4 ? sizeRaw : (0, _mp3MiscJs.decodeSynchsafe)(sizeRaw);
                if (isSizeValid(otherSize)) size = otherSize;
            }
            this.pos = headerEndPos;
            return {
                id,
                size,
                flags
            };
        }
    }
    readId3V2TextEncoding() {
        const number = this.readU8();
        if (number > 3) throw new Error(`Unsupported text encoding: ${number}`);
        return number;
    }
    readId3V2Text(encoding, until) {
        const startPos = this.pos;
        const data = this.readBytes(until - this.pos);
        switch(encoding){
            case Id3V2TextEncoding.ISO_8859_1:
                {
                    let str = '';
                    for(let i = 0; i < data.length; i++){
                        const value = data[i];
                        if (value === 0) {
                            this.pos = startPos + i + 1;
                            break;
                        }
                        str += String.fromCharCode(value);
                    }
                    return str;
                }
            case Id3V2TextEncoding.UTF_16_WITH_BOM:
                if (data[0] === 0xff && data[1] === 0xfe) {
                    const decoder = new TextDecoder('utf-16le');
                    const endIndex = (0, _miscJs.coalesceIndex)(data.findIndex((x, i)=>x === 0 && data[i + 1] === 0 && i % 2 === 0), data.length);
                    this.pos = startPos + Math.min(endIndex + 2, data.length);
                    return decoder.decode(data.subarray(2, endIndex));
                } else if (data[0] === 0xfe && data[1] === 0xff) {
                    const decoder = new TextDecoder('utf-16be');
                    const endIndex = (0, _miscJs.coalesceIndex)(data.findIndex((x, i)=>x === 0 && data[i + 1] === 0 && i % 2 === 0), data.length);
                    this.pos = startPos + Math.min(endIndex + 2, data.length);
                    return decoder.decode(data.subarray(2, endIndex));
                } else {
                    // Treat it like UTF-8, some files do this
                    const endIndex = (0, _miscJs.coalesceIndex)(data.findIndex((x)=>x === 0), data.length);
                    this.pos = startPos + Math.min(endIndex + 1, data.length);
                    return (0, _miscJs.textDecoder).decode(data.subarray(0, endIndex));
                }
            case Id3V2TextEncoding.UTF_16_BE_NO_BOM:
                {
                    const decoder = new TextDecoder('utf-16be');
                    const endIndex = (0, _miscJs.coalesceIndex)(data.findIndex((x, i)=>x === 0 && data[i + 1] === 0 && i % 2 === 0), data.length);
                    this.pos = startPos + Math.min(endIndex + 2, data.length);
                    return decoder.decode(data.subarray(0, endIndex));
                }
            case Id3V2TextEncoding.UTF_8:
                {
                    const endIndex = (0, _miscJs.coalesceIndex)(data.findIndex((x)=>x === 0), data.length);
                    this.pos = startPos + Math.min(endIndex + 1, data.length);
                    return (0, _miscJs.textDecoder).decode(data.subarray(0, endIndex));
                }
        }
    }
    readId3V2EncodingAndText(until) {
        if (this.pos >= until) return '';
        const encoding = this.readId3V2TextEncoding();
        return this.readId3V2Text(encoding, until);
    }
}
class Id3V2Writer {
    constructor(writer){
        this.helper = new Uint8Array(8);
        this.helperView = (0, _miscJs.toDataView)(this.helper);
        this.writer = writer;
    }
    writeId3V2Tag(metadata) {
        const tagStartPos = this.writer.getPos();
        // Write ID3v2.4 header
        this.writeAscii('ID3');
        this.writeU8(0x04); // Version 2.4
        this.writeU8(0x00); // Revision 0
        this.writeU8(0x00); // Flags
        this.writeSynchsafeU32(0); // Size placeholder
        const framesStartPos = this.writer.getPos();
        const writtenTags = new Set();
        // Write all metadata frames
        for (const { key, value } of (0, _miscJs.keyValueIterator)(metadata))switch(key){
            case 'title':
                this.writeId3V2TextFrame('TIT2', value);
                writtenTags.add('TIT2');
                break;
            case 'description':
                this.writeId3V2TextFrame('TIT3', value);
                writtenTags.add('TIT3');
                break;
            case 'artist':
                this.writeId3V2TextFrame('TPE1', value);
                writtenTags.add('TPE1');
                break;
            case 'album':
                this.writeId3V2TextFrame('TALB', value);
                writtenTags.add('TALB');
                break;
            case 'albumArtist':
                this.writeId3V2TextFrame('TPE2', value);
                writtenTags.add('TPE2');
                break;
            case 'trackNumber':
                {
                    const string = metadata.tracksTotal !== undefined ? `${value}/${metadata.tracksTotal}` : value.toString();
                    this.writeId3V2TextFrame('TRCK', string);
                    writtenTags.add('TRCK');
                }
                break;
            case 'discNumber':
                {
                    const string = metadata.discsTotal !== undefined ? `${value}/${metadata.discsTotal}` : value.toString();
                    this.writeId3V2TextFrame('TPOS', string);
                    writtenTags.add('TPOS');
                }
                break;
            case 'genre':
                this.writeId3V2TextFrame('TCON', value);
                writtenTags.add('TCON');
                break;
            case 'date':
                this.writeId3V2TextFrame('TDRC', value.toISOString().slice(0, 10));
                writtenTags.add('TDRC');
                break;
            case 'lyrics':
                this.writeId3V2LyricsFrame(value);
                writtenTags.add('USLT');
                break;
            case 'comment':
                this.writeId3V2CommentFrame(value);
                writtenTags.add('COMM');
                break;
            case 'images':
                {
                    const pictureTypeMap = {
                        coverFront: 0x03,
                        coverBack: 0x04,
                        unknown: 0x00
                    };
                    for (const image of value){
                        const pictureType = pictureTypeMap[image.kind] ?? 0x00;
                        const description = image.description ?? '';
                        this.writeId3V2ApicFrame(image.mimeType, pictureType, description, image.data);
                    }
                }
                break;
            case 'tracksTotal':
            case 'discsTotal':
                break;
            case 'raw':
                break;
            default:
                (0, _miscJs.assertNever)(key);
        }
        if (metadata.raw) for(const key in metadata.raw){
            const value = metadata.raw[key];
            if (value == null || key.length !== 4 || writtenTags.has(key)) continue;
            let bytes;
            if (typeof value === 'string') {
                const encoded = (0, _miscJs.textEncoder).encode(value);
                bytes = new Uint8Array(encoded.byteLength + 2);
                bytes[0] = Id3V2TextEncoding.UTF_8;
                bytes.set(encoded, 1);
            // Last byte is the null terminator
            } else if (value instanceof Uint8Array) bytes = value;
            else continue;
            this.writeAscii(key);
            this.writeSynchsafeU32(bytes.byteLength);
            this.writeU16(0x0000);
            this.writer.write(bytes);
        }
        const framesEndPos = this.writer.getPos();
        const framesSize = framesEndPos - framesStartPos;
        // Update the size field in the header (synchsafe)
        this.writer.seek(tagStartPos + 6); // Skip 'ID3' + version + revision + flags
        this.writeSynchsafeU32(framesSize);
        this.writer.seek(framesEndPos);
        return framesSize + 10; // +10 for the header size
    }
    writeU8(value) {
        this.helper[0] = value;
        this.writer.write(this.helper.subarray(0, 1));
    }
    writeU16(value) {
        this.helperView.setUint16(0, value, false);
        this.writer.write(this.helper.subarray(0, 2));
    }
    writeU32(value) {
        this.helperView.setUint32(0, value, false);
        this.writer.write(this.helper.subarray(0, 4));
    }
    writeAscii(text) {
        for(let i = 0; i < text.length; i++)this.helper[i] = text.charCodeAt(i);
        this.writer.write(this.helper.subarray(0, text.length));
    }
    writeSynchsafeU32(value) {
        this.writeU32((0, _mp3MiscJs.encodeSynchsafe)(value));
    }
    writeIsoString(text) {
        const bytes = new Uint8Array(text.length + 1);
        for(let i = 0; i < text.length; i++)bytes[i] = text.charCodeAt(i);
        bytes[text.length] = 0x00;
        this.writer.write(bytes);
    }
    writeUtf8String(text) {
        const utf8Data = (0, _miscJs.textEncoder).encode(text);
        this.writer.write(utf8Data);
        this.writeU8(0x00);
    }
    writeId3V2TextFrame(frameId, text) {
        const useIso88591 = (0, _miscJs.isIso88591Compatible)(text);
        const textDataLength = useIso88591 ? text.length : (0, _miscJs.textEncoder).encode(text).byteLength;
        const frameSize = 1 + textDataLength + 1;
        this.writeAscii(frameId);
        this.writeSynchsafeU32(frameSize);
        this.writeU16(0x0000);
        this.writeU8(useIso88591 ? Id3V2TextEncoding.ISO_8859_1 : Id3V2TextEncoding.UTF_8);
        if (useIso88591) this.writeIsoString(text);
        else this.writeUtf8String(text);
    }
    writeId3V2LyricsFrame(lyrics) {
        const useIso88591 = (0, _miscJs.isIso88591Compatible)(lyrics);
        const shortDescription = '';
        const frameSize = 4 + shortDescription.length + 1 + lyrics.length + 1;
        this.writeAscii('USLT');
        this.writeSynchsafeU32(frameSize);
        this.writeU16(0x0000);
        this.writeU8(useIso88591 ? Id3V2TextEncoding.ISO_8859_1 : Id3V2TextEncoding.UTF_8);
        this.writeAscii('und');
        if (useIso88591) {
            this.writeIsoString(shortDescription);
            this.writeIsoString(lyrics);
        } else {
            this.writeUtf8String(shortDescription);
            this.writeUtf8String(lyrics);
        }
    }
    writeId3V2CommentFrame(comment) {
        const useIso88591 = (0, _miscJs.isIso88591Compatible)(comment);
        const textDataLength = useIso88591 ? comment.length : (0, _miscJs.textEncoder).encode(comment).byteLength;
        const shortDescription = '';
        const frameSize = 4 + shortDescription.length + 1 + textDataLength + 1;
        this.writeAscii('COMM');
        this.writeSynchsafeU32(frameSize);
        this.writeU16(0x0000);
        this.writeU8(useIso88591 ? Id3V2TextEncoding.ISO_8859_1 : Id3V2TextEncoding.UTF_8);
        this.writeU8(0x75); // 'u'
        this.writeU8(0x6E); // 'n'
        this.writeU8(0x64); // 'd'
        if (useIso88591) {
            this.writeIsoString(shortDescription);
            this.writeIsoString(comment);
        } else {
            this.writeUtf8String(shortDescription);
            this.writeUtf8String(comment);
        }
    }
    writeId3V2ApicFrame(mimeType, pictureType, description, imageData) {
        const useIso88591 = (0, _miscJs.isIso88591Compatible)(mimeType) && (0, _miscJs.isIso88591Compatible)(description);
        const descriptionDataLength = useIso88591 ? description.length : (0, _miscJs.textEncoder).encode(description).byteLength;
        const frameSize = 1 + mimeType.length + 1 + 1 + descriptionDataLength + 1 + imageData.byteLength;
        this.writeAscii('APIC');
        this.writeSynchsafeU32(frameSize);
        this.writeU16(0x0000);
        this.writeU8(useIso88591 ? Id3V2TextEncoding.ISO_8859_1 : Id3V2TextEncoding.UTF_8);
        if (useIso88591) this.writeIsoString(mimeType);
        else this.writeUtf8String(mimeType);
        this.writeU8(pictureType);
        if (useIso88591) this.writeIsoString(description);
        else this.writeUtf8String(description);
        this.writer.write(imageData);
    }
}

},{"../shared/mp3-misc.js":"k3lpY","./misc.js":"kkhLS","./reader.js":"fr2Ka","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"kFP95":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "readNextFrameHeader", ()=>readNextFrameHeader);
var _mp3MiscJs = require("../../shared/mp3-misc.js");
var _readerJs = require("../reader.js");
const readNextFrameHeader = async (reader, startPos, until)=>{
    let currentPos = startPos;
    while(until === null || currentPos < until){
        let slice = reader.requestSlice(currentPos, (0, _mp3MiscJs.FRAME_HEADER_SIZE));
        if (slice instanceof Promise) slice = await slice;
        if (!slice) break;
        const word = (0, _readerJs.readU32Be)(slice);
        const result = (0, _mp3MiscJs.readFrameHeader)(word, reader.fileSize !== null ? reader.fileSize - currentPos : null);
        if (result.header) return {
            header: result.header,
            startPos: currentPos
        };
        currentPos += result.bytesAdvanced;
    }
    return null;
};

},{"../../shared/mp3-misc.js":"k3lpY","../reader.js":"fr2Ka","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2yNaV":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "OggDemuxer", ()=>OggDemuxer);
var _codecJs = require("../codec.js");
var _codecDataJs = require("../codec-data.js");
var _demuxerJs = require("../demuxer.js");
var _inputTrackJs = require("../input-track.js");
var _metadataJs = require("../metadata.js");
var _miscJs = require("../misc.js");
var _packetJs = require("../packet.js");
var _readerJs = require("../reader.js");
var _oggMiscJs = require("./ogg-misc.js");
var _oggReaderJs = require("./ogg-reader.js");
class OggDemuxer extends (0, _demuxerJs.Demuxer) {
    constructor(input){
        super(input);
        this.metadataPromise = null;
        this.bitstreams = [];
        this.tracks = [];
        this.metadataTags = {};
        this.reader = input._reader;
    }
    async readMetadata() {
        return this.metadataPromise ??= (async ()=>{
            let currentPos = 0;
            while(true){
                let slice = this.reader.requestSliceRange(currentPos, (0, _oggReaderJs.MIN_PAGE_HEADER_SIZE), (0, _oggReaderJs.MAX_PAGE_HEADER_SIZE));
                if (slice instanceof Promise) slice = await slice;
                if (!slice) break;
                const page = (0, _oggReaderJs.readPageHeader)(slice);
                if (!page) break;
                const isBos = !!(page.headerType & 0x02);
                if (!isBos) break;
                this.bitstreams.push({
                    serialNumber: page.serialNumber,
                    bosPage: page,
                    description: null,
                    numberOfChannels: -1,
                    sampleRate: -1,
                    codecInfo: {
                        codec: null,
                        vorbisInfo: null,
                        opusInfo: null
                    },
                    lastMetadataPacket: null
                });
                currentPos = page.headerStartPos + page.totalSize;
            }
            for (const bitstream of this.bitstreams){
                const firstPacket = await this.readPacket(bitstream.bosPage, 0);
                if (!firstPacket) continue;
                if (// Check for Vorbis
                firstPacket.data.byteLength >= 7 && firstPacket.data[0] === 0x01 // Packet type 1 = identification header
                 && firstPacket.data[1] === 0x76 // 'v'
                 && firstPacket.data[2] === 0x6f // 'o'
                 && firstPacket.data[3] === 0x72 // 'r'
                 && firstPacket.data[4] === 0x62 // 'b'
                 && firstPacket.data[5] === 0x69 // 'i'
                 && firstPacket.data[6] === 0x73 // 's'
                ) await this.readVorbisMetadata(firstPacket, bitstream);
                else if (// Check for Opus
                firstPacket.data.byteLength >= 8 && firstPacket.data[0] === 0x4f // 'O'
                 && firstPacket.data[1] === 0x70 // 'p'
                 && firstPacket.data[2] === 0x75 // 'u'
                 && firstPacket.data[3] === 0x73 // 's'
                 && firstPacket.data[4] === 0x48 // 'H'
                 && firstPacket.data[5] === 0x65 // 'e'
                 && firstPacket.data[6] === 0x61 // 'a'
                 && firstPacket.data[7] === 0x64 // 'd'
                ) await this.readOpusMetadata(firstPacket, bitstream);
                if (bitstream.codecInfo.codec !== null) this.tracks.push(new (0, _inputTrackJs.InputAudioTrack)(this.input, new OggAudioTrackBacking(bitstream, this)));
            }
        })();
    }
    async readVorbisMetadata(firstPacket, bitstream) {
        let nextPacketPosition = await this.findNextPacketStart(firstPacket);
        if (!nextPacketPosition) return;
        const secondPacket = await this.readPacket(nextPacketPosition.startPage, nextPacketPosition.startSegmentIndex);
        if (!secondPacket) return;
        nextPacketPosition = await this.findNextPacketStart(secondPacket);
        if (!nextPacketPosition) return;
        const thirdPacket = await this.readPacket(nextPacketPosition.startPage, nextPacketPosition.startSegmentIndex);
        if (!thirdPacket) return;
        if (secondPacket.data[0] !== 0x03 || thirdPacket.data[0] !== 0x05) return;
        const lacingValues = [];
        const addBytesToSegmentTable = (bytes)=>{
            while(true){
                lacingValues.push(Math.min(255, bytes));
                if (bytes < 255) break;
                bytes -= 255;
            }
        };
        addBytesToSegmentTable(firstPacket.data.length);
        addBytesToSegmentTable(secondPacket.data.length);
        // We don't add the last packet to the segment table, as it is assumed to be whatever bytes remain
        const description = new Uint8Array(1 + lacingValues.length + firstPacket.data.length + secondPacket.data.length + thirdPacket.data.length);
        description[0] = 2; // Num entries in the segment table
        description.set(lacingValues, 1);
        description.set(firstPacket.data, 1 + lacingValues.length);
        description.set(secondPacket.data, 1 + lacingValues.length + firstPacket.data.length);
        description.set(thirdPacket.data, 1 + lacingValues.length + firstPacket.data.length + secondPacket.data.length);
        bitstream.codecInfo.codec = 'vorbis';
        bitstream.description = description;
        bitstream.lastMetadataPacket = thirdPacket;
        const view = (0, _miscJs.toDataView)(firstPacket.data);
        bitstream.numberOfChannels = view.getUint8(11);
        bitstream.sampleRate = view.getUint32(12, true);
        const blockSizeByte = view.getUint8(28);
        bitstream.codecInfo.vorbisInfo = {
            blocksizes: [
                1 << (blockSizeByte & 0xf),
                1 << (blockSizeByte >> 4)
            ],
            modeBlockflags: (0, _codecDataJs.parseModesFromVorbisSetupPacket)(thirdPacket.data).modeBlockflags
        };
        (0, _codecDataJs.readVorbisComments)(secondPacket.data.subarray(7), this.metadataTags); // Skip header type and 'vorbis'
    }
    async readOpusMetadata(firstPacket, bitstream) {
        // From https://datatracker.ietf.org/doc/html/rfc7845#section-5:
        // "An Ogg Opus logical stream contains exactly two mandatory header packets: an identification header and a
        // comment header."
        const nextPacketPosition = await this.findNextPacketStart(firstPacket);
        if (!nextPacketPosition) return;
        const secondPacket = await this.readPacket(nextPacketPosition.startPage, nextPacketPosition.startSegmentIndex);
        if (!secondPacket) return;
        bitstream.codecInfo.codec = 'opus';
        bitstream.description = firstPacket.data;
        bitstream.lastMetadataPacket = secondPacket;
        const header = (0, _codecDataJs.parseOpusIdentificationHeader)(firstPacket.data);
        bitstream.numberOfChannels = header.outputChannelCount;
        bitstream.sampleRate = (0, _codecJs.OPUS_SAMPLE_RATE); // Always the same
        bitstream.codecInfo.opusInfo = {
            preSkip: header.preSkip
        };
        (0, _codecDataJs.readVorbisComments)(secondPacket.data.subarray(8), this.metadataTags); // Skip 'OpusTags'
    }
    async readPacket(startPage, startSegmentIndex) {
        (0, _miscJs.assert)(startSegmentIndex < startPage.lacingValues.length);
        let startDataOffset = 0;
        for(let i = 0; i < startSegmentIndex; i++)startDataOffset += startPage.lacingValues[i];
        let currentPage = startPage;
        let currentDataOffset = startDataOffset;
        let currentSegmentIndex = startSegmentIndex;
        const chunks = [];
        outer: while(true){
            // Load the entire page data
            let pageSlice = this.reader.requestSlice(currentPage.dataStartPos, currentPage.dataSize);
            if (pageSlice instanceof Promise) pageSlice = await pageSlice;
            (0, _miscJs.assert)(pageSlice);
            const pageData = (0, _readerJs.readBytes)(pageSlice, currentPage.dataSize);
            while(true){
                if (currentSegmentIndex === currentPage.lacingValues.length) {
                    chunks.push(pageData.subarray(startDataOffset, currentDataOffset));
                    break;
                }
                const lacingValue = currentPage.lacingValues[currentSegmentIndex];
                currentDataOffset += lacingValue;
                if (lacingValue < 255) {
                    chunks.push(pageData.subarray(startDataOffset, currentDataOffset));
                    break outer;
                }
                currentSegmentIndex++;
            }
            // The packet extends to the next page; let's find it
            let currentPos = currentPage.headerStartPos + currentPage.totalSize;
            while(true){
                let headerSlice = this.reader.requestSliceRange(currentPos, (0, _oggReaderJs.MIN_PAGE_HEADER_SIZE), (0, _oggReaderJs.MAX_PAGE_HEADER_SIZE));
                if (headerSlice instanceof Promise) headerSlice = await headerSlice;
                if (!headerSlice) return null;
                const nextPage = (0, _oggReaderJs.readPageHeader)(headerSlice);
                if (!nextPage) return null;
                currentPage = nextPage;
                if (currentPage.serialNumber === startPage.serialNumber) break;
                currentPos = currentPage.headerStartPos + currentPage.totalSize;
            }
            startDataOffset = 0;
            currentDataOffset = 0;
            currentSegmentIndex = 0;
        }
        const totalPacketSize = chunks.reduce((sum, chunk)=>sum + chunk.length, 0);
        const packetData = new Uint8Array(totalPacketSize);
        let offset = 0;
        for(let i = 0; i < chunks.length; i++){
            const chunk = chunks[i];
            packetData.set(chunk, offset);
            offset += chunk.length;
        }
        return {
            data: packetData,
            endPage: currentPage,
            endSegmentIndex: currentSegmentIndex
        };
    }
    async findNextPacketStart(lastPacket) {
        // If there's another segment in the same page, return it
        if (lastPacket.endSegmentIndex < lastPacket.endPage.lacingValues.length - 1) return {
            startPage: lastPacket.endPage,
            startSegmentIndex: lastPacket.endSegmentIndex + 1
        };
        const isEos = !!(lastPacket.endPage.headerType & 0x04);
        if (isEos) // The page is marked as the last page of the logical bitstream, so we won't find anything beyond it
        return null;
        // Otherwise, search for the next page belonging to the same bitstream
        let currentPos = lastPacket.endPage.headerStartPos + lastPacket.endPage.totalSize;
        while(true){
            let slice = this.reader.requestSliceRange(currentPos, (0, _oggReaderJs.MIN_PAGE_HEADER_SIZE), (0, _oggReaderJs.MAX_PAGE_HEADER_SIZE));
            if (slice instanceof Promise) slice = await slice;
            if (!slice) return null;
            const nextPage = (0, _oggReaderJs.readPageHeader)(slice);
            if (!nextPage) return null;
            if (nextPage.serialNumber === lastPacket.endPage.serialNumber) return {
                startPage: nextPage,
                startSegmentIndex: 0
            };
            currentPos = nextPage.headerStartPos + nextPage.totalSize;
        }
    }
    async getMimeType() {
        await this.readMetadata();
        const codecStrings = await Promise.all(this.tracks.map((x)=>x.getCodecParameterString()));
        return (0, _oggMiscJs.buildOggMimeType)({
            codecStrings: codecStrings.filter(Boolean)
        });
    }
    async getTracks() {
        await this.readMetadata();
        return this.tracks;
    }
    async computeDuration() {
        const tracks = await this.getTracks();
        const trackDurations = await Promise.all(tracks.map((x)=>x.computeDuration()));
        return Math.max(0, ...trackDurations);
    }
    async getMetadataTags() {
        await this.readMetadata();
        return this.metadataTags;
    }
}
class OggAudioTrackBacking {
    constructor(bitstream, demuxer){
        this.bitstream = bitstream;
        this.demuxer = demuxer;
        this.encodedPacketToMetadata = new WeakMap();
        this.sequentialScanCache = [];
        this.sequentialScanMutex = new (0, _miscJs.AsyncMutex)();
        // Opus always uses a fixed sample rate for its internal calculations, even if the actual rate is different
        this.internalSampleRate = bitstream.codecInfo.codec === 'opus' ? (0, _codecJs.OPUS_SAMPLE_RATE) : bitstream.sampleRate;
    }
    getId() {
        return this.bitstream.serialNumber;
    }
    getNumberOfChannels() {
        return this.bitstream.numberOfChannels;
    }
    getSampleRate() {
        return this.bitstream.sampleRate;
    }
    getTimeResolution() {
        return this.bitstream.sampleRate;
    }
    getCodec() {
        return this.bitstream.codecInfo.codec;
    }
    getInternalCodecId() {
        return null;
    }
    async getDecoderConfig() {
        (0, _miscJs.assert)(this.bitstream.codecInfo.codec);
        return {
            codec: this.bitstream.codecInfo.codec,
            numberOfChannels: this.bitstream.numberOfChannels,
            sampleRate: this.bitstream.sampleRate,
            description: this.bitstream.description ?? undefined
        };
    }
    getName() {
        return null;
    }
    getLanguageCode() {
        return 0, _miscJs.UNDETERMINED_LANGUAGE;
    }
    getDisposition() {
        return {
            ...(0, _metadataJs.DEFAULT_TRACK_DISPOSITION)
        };
    }
    async getFirstTimestamp() {
        return 0;
    }
    async computeDuration() {
        const lastPacket = await this.getPacket(Infinity, {
            metadataOnly: true
        });
        return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
    }
    granulePositionToTimestampInSamples(granulePosition) {
        if (this.bitstream.codecInfo.codec === 'opus') {
            (0, _miscJs.assert)(this.bitstream.codecInfo.opusInfo);
            return granulePosition - this.bitstream.codecInfo.opusInfo.preSkip;
        }
        return granulePosition;
    }
    createEncodedPacketFromOggPacket(packet, additional, options) {
        if (!packet) return null;
        const { durationInSamples, vorbisBlockSize } = (0, _oggMiscJs.extractSampleMetadata)(packet.data, this.bitstream.codecInfo, additional.vorbisLastBlocksize);
        const encodedPacket = new (0, _packetJs.EncodedPacket)(options.metadataOnly ? (0, _packetJs.PLACEHOLDER_DATA) : packet.data, 'key', Math.max(0, additional.timestampInSamples) / this.internalSampleRate, durationInSamples / this.internalSampleRate, packet.endPage.headerStartPos + packet.endSegmentIndex, packet.data.byteLength);
        this.encodedPacketToMetadata.set(encodedPacket, {
            packet,
            timestampInSamples: additional.timestampInSamples,
            durationInSamples,
            vorbisLastBlockSize: additional.vorbisLastBlocksize,
            vorbisBlockSize
        });
        return encodedPacket;
    }
    async getFirstPacket(options) {
        (0, _miscJs.assert)(this.bitstream.lastMetadataPacket);
        const packetPosition = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
        if (!packetPosition) return null;
        let timestampInSamples = 0;
        if (this.bitstream.codecInfo.codec === 'opus') {
            (0, _miscJs.assert)(this.bitstream.codecInfo.opusInfo);
            timestampInSamples -= this.bitstream.codecInfo.opusInfo.preSkip;
        }
        const packet = await this.demuxer.readPacket(packetPosition.startPage, packetPosition.startSegmentIndex);
        return this.createEncodedPacketFromOggPacket(packet, {
            timestampInSamples,
            vorbisLastBlocksize: null
        }, options);
    }
    async getNextPacket(prevPacket, options) {
        const prevMetadata = this.encodedPacketToMetadata.get(prevPacket);
        if (!prevMetadata) throw new Error('Packet was not created from this track.');
        const packetPosition = await this.demuxer.findNextPacketStart(prevMetadata.packet);
        if (!packetPosition) return null;
        const timestampInSamples = prevMetadata.timestampInSamples + prevMetadata.durationInSamples;
        const packet = await this.demuxer.readPacket(packetPosition.startPage, packetPosition.startSegmentIndex);
        return this.createEncodedPacketFromOggPacket(packet, {
            timestampInSamples,
            vorbisLastBlocksize: prevMetadata.vorbisBlockSize
        }, options);
    }
    async getPacket(timestamp, options) {
        if (this.demuxer.reader.fileSize === null) // No file size known, can't do binary search, but fall back to sequential algo instead
        return this.getPacketSequential(timestamp, options);
        const timestampInSamples = (0, _miscJs.roundIfAlmostInteger)(timestamp * this.internalSampleRate);
        if (timestampInSamples === 0) // Fast path for timestamp 0 - avoids binary search when playing back from the start
        return this.getFirstPacket(options);
        if (timestampInSamples < 0) // There's nothing here
        return null;
        (0, _miscJs.assert)(this.bitstream.lastMetadataPacket);
        const startPosition = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
        if (!startPosition) return null;
        let lowPage = startPosition.startPage;
        let high = this.demuxer.reader.fileSize;
        const lowPages = [
            lowPage
        ];
        // First, let's perform a binary serach (bisection search) on the file to find the approximate page where
        // we'll find the packet. We want to find a page whose end packet position is less than or equal to the
        // packet position we're searching for.
        // Outer loop: Does the binary serach
        outer: while(lowPage.headerStartPos + lowPage.totalSize < high){
            const low = lowPage.headerStartPos;
            const mid = Math.floor((low + high) / 2);
            let searchStartPos = mid;
            // Inner loop: Does a linear forward scan if the page cannot be found immediately
            while(true){
                const until = Math.min(searchStartPos + (0, _oggReaderJs.MAX_PAGE_SIZE), high - (0, _oggReaderJs.MIN_PAGE_HEADER_SIZE));
                let searchSlice = this.demuxer.reader.requestSlice(searchStartPos, until - searchStartPos);
                if (searchSlice instanceof Promise) searchSlice = await searchSlice;
                (0, _miscJs.assert)(searchSlice);
                const found = (0, _oggReaderJs.findNextPageHeader)(searchSlice, until);
                if (!found) {
                    high = mid + (0, _oggReaderJs.MIN_PAGE_HEADER_SIZE);
                    continue outer;
                }
                let headerSlice = this.demuxer.reader.requestSliceRange(searchSlice.filePos, (0, _oggReaderJs.MIN_PAGE_HEADER_SIZE), (0, _oggReaderJs.MAX_PAGE_HEADER_SIZE));
                if (headerSlice instanceof Promise) headerSlice = await headerSlice;
                (0, _miscJs.assert)(headerSlice);
                const page = (0, _oggReaderJs.readPageHeader)(headerSlice);
                (0, _miscJs.assert)(page);
                let pageValid = false;
                if (page.serialNumber === this.bitstream.serialNumber) // Serial numbers are basically random numbers, and the chance of finding a fake page with
                // matching serial number is astronomically low, so we can be pretty sure this page is legit.
                pageValid = true;
                else {
                    let pageSlice = this.demuxer.reader.requestSlice(page.headerStartPos, page.totalSize);
                    if (pageSlice instanceof Promise) pageSlice = await pageSlice;
                    (0, _miscJs.assert)(pageSlice);
                    // Validate the page by checking checksum
                    const bytes = (0, _readerJs.readBytes)(pageSlice, page.totalSize);
                    const crc = (0, _oggMiscJs.computeOggPageCrc)(bytes);
                    pageValid = crc === page.checksum;
                }
                if (!pageValid) {
                    // Keep searching for a valid page
                    searchStartPos = page.headerStartPos + 4; // 'OggS' is 4 bytes
                    continue;
                }
                if (pageValid && page.serialNumber !== this.bitstream.serialNumber) {
                    // Page is valid but from a different bitstream, so keep searching forward until we find one
                    // belonging to the our bitstream
                    searchStartPos = page.headerStartPos + page.totalSize;
                    continue;
                }
                const isContinuationPage = page.granulePosition === -1;
                if (isContinuationPage) {
                    // No packet ends on this page - keep looking
                    searchStartPos = page.headerStartPos + page.totalSize;
                    continue;
                }
                // The page is valid and belongs to our bitstream; let's check its granule position to see where we
                // need to take the bisection search.
                if (this.granulePositionToTimestampInSamples(page.granulePosition) > timestampInSamples) high = page.headerStartPos;
                else {
                    lowPage = page;
                    lowPages.push(page);
                }
                continue outer;
            }
        }
        // Now we have the last page with a packet position <= the packet position we're looking for, but there
        // might be multiple pages with the packet position, in which case we actually need to find the first of
        // such pages. We'll do this in two steps: First, let's find the latest page we know with an earlier packet
        // position, and then linear scan ourselves forward until we find the correct page.
        let lowerPage = startPosition.startPage;
        for (const otherLowPage of lowPages){
            if (otherLowPage.granulePosition === lowPage.granulePosition) break;
            if (!lowerPage || otherLowPage.headerStartPos > lowerPage.headerStartPos) lowerPage = otherLowPage;
        }
        let currentPage = lowerPage;
        // Keep track of the pages we traversed, we need these later for backwards seeking
        const previousPages = [
            currentPage
        ];
        while(true){
            // This loop must terminate as we'll eventually reach lowPage
            if (currentPage.serialNumber === this.bitstream.serialNumber && currentPage.granulePosition === lowPage.granulePosition) break;
            const nextPos = currentPage.headerStartPos + currentPage.totalSize;
            let slice = this.demuxer.reader.requestSliceRange(nextPos, (0, _oggReaderJs.MIN_PAGE_HEADER_SIZE), (0, _oggReaderJs.MAX_PAGE_HEADER_SIZE));
            if (slice instanceof Promise) slice = await slice;
            (0, _miscJs.assert)(slice);
            const nextPage = (0, _oggReaderJs.readPageHeader)(slice);
            (0, _miscJs.assert)(nextPage);
            currentPage = nextPage;
            if (currentPage.serialNumber === this.bitstream.serialNumber) previousPages.push(currentPage);
        }
        (0, _miscJs.assert)(currentPage.granulePosition !== -1);
        let currentSegmentIndex = null;
        let currentTimestampInSamples;
        let currentTimestampIsCorrect;
        // These indicate the end position of the packet that the granule position belongs to
        let endPage = currentPage;
        let endSegmentIndex = 0;
        if (currentPage.headerStartPos === startPosition.startPage.headerStartPos) {
            currentTimestampInSamples = this.granulePositionToTimestampInSamples(0);
            currentTimestampIsCorrect = true;
            currentSegmentIndex = 0;
        } else {
            currentTimestampInSamples = 0; // Placeholder value! We'll refine it once we can
            currentTimestampIsCorrect = false;
            // Find the segment index of the next packet
            for(let i = currentPage.lacingValues.length - 1; i >= 0; i--){
                const value = currentPage.lacingValues[i];
                if (value < 255) {
                    // We know the last packet ended at i, so the next one starts at i + 1
                    currentSegmentIndex = i + 1;
                    break;
                }
            }
            // This must hold: Since this page has a granule position set, that means there must be a packet that
            // ends in this page.
            if (currentSegmentIndex === null) throw new Error('Invalid page with granule position: no packets end on this page.');
            endSegmentIndex = currentSegmentIndex - 1;
            const pseudopacket = {
                data: (0, _packetJs.PLACEHOLDER_DATA),
                endPage,
                endSegmentIndex
            };
            const nextPosition = await this.demuxer.findNextPacketStart(pseudopacket);
            if (nextPosition) {
                // Let's rewind a single step (packet) - this previous packet ensures that we'll correctly compute
                // the duration for the packet we're looking for.
                const endPosition = findPreviousPacketEndPosition(previousPages, currentPage, currentSegmentIndex);
                (0, _miscJs.assert)(endPosition);
                const startPosition = findPacketStartPosition(previousPages, endPosition.page, endPosition.segmentIndex);
                if (startPosition) {
                    currentPage = startPosition.page;
                    currentSegmentIndex = startPosition.segmentIndex;
                }
            } else // There is no next position, which means we're looking for the last packet in the bitstream. The
            // granule position on the last page tends to be fucky, so let's instead start the search on the
            // page before that. So let's loop until we find a packet that ends in a previous page.
            while(true){
                const endPosition = findPreviousPacketEndPosition(previousPages, currentPage, currentSegmentIndex);
                if (!endPosition) break;
                const startPosition = findPacketStartPosition(previousPages, endPosition.page, endPosition.segmentIndex);
                if (!startPosition) break;
                currentPage = startPosition.page;
                currentSegmentIndex = startPosition.segmentIndex;
                if (endPosition.page.headerStartPos !== endPage.headerStartPos) {
                    endPage = endPosition.page;
                    endSegmentIndex = endPosition.segmentIndex;
                    break;
                }
            }
        }
        let lastEncodedPacket = null;
        let lastEncodedPacketMetadata = null;
        // Alright, now it's time for the final, granular seek: We keep iterating over packets until we've found the
        // one with the correct timestamp - i.e., the last one with a timestamp <= the timestamp we're looking for.
        while(currentPage !== null){
            (0, _miscJs.assert)(currentSegmentIndex !== null);
            const packet = await this.demuxer.readPacket(currentPage, currentSegmentIndex);
            if (!packet) break;
            // We might need to skip the packet if it's a metadata one
            const skipPacket = currentPage.headerStartPos === startPosition.startPage.headerStartPos && currentSegmentIndex < startPosition.startSegmentIndex;
            if (!skipPacket) {
                let encodedPacket = this.createEncodedPacketFromOggPacket(packet, {
                    timestampInSamples: currentTimestampInSamples,
                    vorbisLastBlocksize: lastEncodedPacketMetadata?.vorbisBlockSize ?? null
                }, options);
                (0, _miscJs.assert)(encodedPacket);
                let encodedPacketMetadata = this.encodedPacketToMetadata.get(encodedPacket);
                (0, _miscJs.assert)(encodedPacketMetadata);
                if (!currentTimestampIsCorrect && packet.endPage.headerStartPos === endPage.headerStartPos && packet.endSegmentIndex === endSegmentIndex) {
                    // We know this packet end timestamp can be derived from the page's granule position
                    currentTimestampInSamples = this.granulePositionToTimestampInSamples(currentPage.granulePosition);
                    currentTimestampIsCorrect = true;
                    // Let's backpatch the packet we just created with the correct timestamp
                    encodedPacket = this.createEncodedPacketFromOggPacket(packet, {
                        timestampInSamples: currentTimestampInSamples - encodedPacketMetadata.durationInSamples,
                        vorbisLastBlocksize: lastEncodedPacketMetadata?.vorbisBlockSize ?? null
                    }, options);
                    (0, _miscJs.assert)(encodedPacket);
                    encodedPacketMetadata = this.encodedPacketToMetadata.get(encodedPacket);
                    (0, _miscJs.assert)(encodedPacketMetadata);
                } else currentTimestampInSamples += encodedPacketMetadata.durationInSamples;
                lastEncodedPacket = encodedPacket;
                lastEncodedPacketMetadata = encodedPacketMetadata;
                if (currentTimestampIsCorrect && // Next timestamp will be too late
                (Math.max(currentTimestampInSamples, 0) > timestampInSamples || Math.max(encodedPacketMetadata.timestampInSamples, 0) === timestampInSamples)) break;
            }
            const nextPosition = await this.demuxer.findNextPacketStart(packet);
            if (!nextPosition) break;
            currentPage = nextPosition.startPage;
            currentSegmentIndex = nextPosition.startSegmentIndex;
        }
        return lastEncodedPacket;
    }
    // A slower but simpler and sequential algorithm for finding a packet in a file
    async getPacketSequential(timestamp, options) {
        const release = await this.sequentialScanMutex.acquire(); // Requires exclusivity because we write to a cache
        try {
            const timestampInSamples = (0, _miscJs.roundIfAlmostInteger)(timestamp * this.internalSampleRate);
            timestamp = timestampInSamples / this.internalSampleRate;
            const index = (0, _miscJs.binarySearchLessOrEqual)(this.sequentialScanCache, timestampInSamples, (x)=>x.timestampInSamples);
            let currentPacket;
            if (index !== -1) {
                // We don't need to start from the beginning, we can start at a previous scan point
                const cacheEntry = this.sequentialScanCache[index];
                currentPacket = this.createEncodedPacketFromOggPacket(cacheEntry.packet, {
                    timestampInSamples: cacheEntry.timestampInSamples,
                    vorbisLastBlocksize: cacheEntry.vorbisLastBlockSize
                }, options);
            } else currentPacket = await this.getFirstPacket(options);
            let i = 0;
            while(currentPacket && currentPacket.timestamp < timestamp){
                const nextPacket = await this.getNextPacket(currentPacket, options);
                if (!nextPacket || nextPacket.timestamp > timestamp) break;
                currentPacket = nextPacket;
                i++;
                if (i === 100) {
                    // Add "checkpoints" every once in a while to speed up subsequent random accesses
                    i = 0;
                    const metadata = this.encodedPacketToMetadata.get(currentPacket);
                    (0, _miscJs.assert)(metadata);
                    if (this.sequentialScanCache.length > 0) // If we reach this case, we must be at the end of the cache
                    (0, _miscJs.assert)((0, _miscJs.last)(this.sequentialScanCache).timestampInSamples <= metadata.timestampInSamples);
                    this.sequentialScanCache.push(metadata);
                }
            }
            return currentPacket;
        } finally{
            release();
        }
    }
    getKeyPacket(timestamp, options) {
        return this.getPacket(timestamp, options);
    }
    getNextKeyPacket(packet, options) {
        return this.getNextPacket(packet, options);
    }
}
/** Finds the start position of a packet given its end position. */ const findPacketStartPosition = (pageList, endPage, endSegmentIndex)=>{
    let page = endPage;
    let segmentIndex = endSegmentIndex;
    outer: while(true){
        segmentIndex--;
        for(segmentIndex; segmentIndex >= 0; segmentIndex--){
            const lacingValue = page.lacingValues[segmentIndex];
            if (lacingValue < 255) {
                segmentIndex++; // We know the last packet starts here
                break outer;
            }
        }
        (0, _miscJs.assert)(segmentIndex === -1);
        const pageStartsWithFreshPacket = !(page.headerType & 0x01);
        if (pageStartsWithFreshPacket) {
            // Fast exit: We know we don't need to look in the previous page
            segmentIndex = 0;
            break;
        }
        const previousPage = (0, _miscJs.findLast)(pageList, (x)=>x.headerStartPos < page.headerStartPos);
        if (!previousPage) return null;
        page = previousPage;
        segmentIndex = page.lacingValues.length;
    }
    (0, _miscJs.assert)(segmentIndex !== -1);
    if (segmentIndex === page.lacingValues.length) {
        // Wrap back around to the first segment of the next page
        const nextPage = pageList[pageList.indexOf(page) + 1];
        (0, _miscJs.assert)(nextPage);
        page = nextPage;
        segmentIndex = 0;
    }
    return {
        page,
        segmentIndex
    };
};
/** Finds the end position of a packet given the start position of the following packet. */ const findPreviousPacketEndPosition = (pageList, startPage, startSegmentIndex)=>{
    if (startSegmentIndex > 0) // Easy
    return {
        page: startPage,
        segmentIndex: startSegmentIndex - 1
    };
    const previousPage = (0, _miscJs.findLast)(pageList, (x)=>x.headerStartPos < startPage.headerStartPos);
    if (!previousPage) return null;
    return {
        page: previousPage,
        segmentIndex: previousPage.lacingValues.length - 1
    };
};

},{"../codec.js":"4oSIO","../codec-data.js":"bzpVB","../demuxer.js":"dZcnn","../input-track.js":"dPVVR","../metadata.js":"3j8h1","../misc.js":"kkhLS","../packet.js":"esYjd","../reader.js":"fr2Ka","./ogg-misc.js":"dss71","./ogg-reader.js":"6KPbV","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"dss71":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "OGGS", ()=>OGGS);
parcelHelpers.export(exports, "computeOggPageCrc", ()=>computeOggPageCrc);
parcelHelpers.export(exports, "extractSampleMetadata", ()=>extractSampleMetadata);
parcelHelpers.export(exports, "buildOggMimeType", ()=>buildOggMimeType);
var _codecDataJs = require("../codec-data.js");
var _miscJs = require("../misc.js");
const OGGS = 0x5367674f; // 'OggS'
const OGG_CRC_POLYNOMIAL = 0x04c11db7;
const OGG_CRC_TABLE = new Uint32Array(256);
for(let n = 0; n < 256; n++){
    let crc = n << 24;
    for(let k = 0; k < 8; k++)crc = crc & 0x80000000 ? crc << 1 ^ OGG_CRC_POLYNOMIAL : crc << 1;
    OGG_CRC_TABLE[n] = crc >>> 0 & 0xffffffff;
}
const computeOggPageCrc = (bytes)=>{
    const view = (0, _miscJs.toDataView)(bytes);
    const originalChecksum = view.getUint32(22, true);
    view.setUint32(22, 0, true); // Zero out checksum field
    let crc = 0;
    for(let i = 0; i < bytes.length; i++){
        const byte = bytes[i];
        crc = (crc << 8 ^ OGG_CRC_TABLE[crc >>> 24 ^ byte]) >>> 0;
    }
    view.setUint32(22, originalChecksum, true); // Restore checksum field
    return crc;
};
const extractSampleMetadata = (data, codecInfo, vorbisLastBlocksize)=>{
    let durationInSamples = 0;
    let currentBlocksize = null;
    if (data.length > 0) {
        // To know sample duration, we'll need to peak inside the packet
        if (codecInfo.codec === 'vorbis') {
            (0, _miscJs.assert)(codecInfo.vorbisInfo);
            const vorbisModeCount = codecInfo.vorbisInfo.modeBlockflags.length;
            const bitCount = (0, _miscJs.ilog)(vorbisModeCount - 1);
            const modeMask = (1 << bitCount) - 1 << 1;
            const modeNumber = (data[0] & modeMask) >> 1;
            if (modeNumber >= codecInfo.vorbisInfo.modeBlockflags.length) throw new Error('Invalid mode number.');
            // In Vorbis, packet duration also depends on the blocksize of the previous packet
            let prevBlocksize = vorbisLastBlocksize;
            const blockflag = codecInfo.vorbisInfo.modeBlockflags[modeNumber];
            currentBlocksize = codecInfo.vorbisInfo.blocksizes[blockflag];
            if (blockflag === 1) {
                const prevMask = (modeMask | 0x1) + 1;
                const flag = data[0] & prevMask ? 1 : 0;
                prevBlocksize = codecInfo.vorbisInfo.blocksizes[flag];
            }
            durationInSamples = prevBlocksize !== null ? prevBlocksize + currentBlocksize >> 2 : 0; // The first sample outputs no audio data and therefore has a duration of 0
        } else if (codecInfo.codec === 'opus') {
            const toc = (0, _codecDataJs.parseOpusTocByte)(data);
            durationInSamples = toc.durationInSamples;
        }
    }
    return {
        durationInSamples,
        vorbisBlockSize: currentBlocksize
    };
};
const buildOggMimeType = (info)=>{
    let string = 'audio/ogg';
    if (info.codecStrings) {
        const uniqueCodecMimeTypes = [
            ...new Set(info.codecStrings)
        ];
        string += `; codecs="${uniqueCodecMimeTypes.join(', ')}"`;
    }
    return string;
};

},{"../codec-data.js":"bzpVB","../misc.js":"kkhLS","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"6KPbV":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MIN_PAGE_HEADER_SIZE", ()=>MIN_PAGE_HEADER_SIZE);
parcelHelpers.export(exports, "MAX_PAGE_HEADER_SIZE", ()=>MAX_PAGE_HEADER_SIZE);
parcelHelpers.export(exports, "MAX_PAGE_SIZE", ()=>MAX_PAGE_SIZE);
parcelHelpers.export(exports, "readPageHeader", ()=>readPageHeader);
parcelHelpers.export(exports, "findNextPageHeader", ()=>findNextPageHeader);
var _readerJs = require("../reader.js");
var _oggMiscJs = require("./ogg-misc.js");
const MIN_PAGE_HEADER_SIZE = 27;
const MAX_PAGE_HEADER_SIZE = 282;
const MAX_PAGE_SIZE = MAX_PAGE_HEADER_SIZE + 65025;
const readPageHeader = (slice)=>{
    const startPos = slice.filePos;
    const capturePattern = (0, _readerJs.readU32Le)(slice);
    if (capturePattern !== (0, _oggMiscJs.OGGS)) return null;
    slice.skip(1); // Version
    const headerType = (0, _readerJs.readU8)(slice);
    const granulePosition = (0, _readerJs.readI64Le)(slice);
    const serialNumber = (0, _readerJs.readU32Le)(slice);
    const sequenceNumber = (0, _readerJs.readU32Le)(slice);
    const checksum = (0, _readerJs.readU32Le)(slice);
    const numberPageSegments = (0, _readerJs.readU8)(slice);
    const lacingValues = new Uint8Array(numberPageSegments);
    for(let i = 0; i < numberPageSegments; i++)lacingValues[i] = (0, _readerJs.readU8)(slice);
    const headerSize = 27 + numberPageSegments;
    const dataSize = lacingValues.reduce((a, b)=>a + b, 0);
    const totalSize = headerSize + dataSize;
    return {
        headerStartPos: startPos,
        totalSize,
        dataStartPos: startPos + headerSize,
        dataSize,
        headerType,
        granulePosition,
        serialNumber,
        sequenceNumber,
        checksum,
        lacingValues
    };
};
const findNextPageHeader = (slice, until)=>{
    while(slice.filePos < until - 3){
        const word = (0, _readerJs.readU32Le)(slice);
        const firstByte = word & 0xff;
        const secondByte = word >>> 8 & 0xff;
        const thirdByte = word >>> 16 & 0xff;
        const fourthByte = word >>> 24 & 0xff;
        const O = 0x4f; // 'O'
        if (firstByte !== O && secondByte !== O && thirdByte !== O && fourthByte !== O) continue;
        slice.skip(-4);
        if (word === (0, _oggMiscJs.OGGS)) // We have found the capture pattern
        return true;
        slice.skip(1);
    }
    return false;
};

},{"../reader.js":"fr2Ka","./ogg-misc.js":"dss71","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"aafYY":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "WaveFormat", ()=>WaveFormat);
parcelHelpers.export(exports, "WaveDemuxer", ()=>WaveDemuxer);
var _demuxerJs = require("../demuxer.js");
var _inputTrackJs = require("../input-track.js");
var _metadataJs = require("../metadata.js");
var _miscJs = require("../misc.js");
var _packetJs = require("../packet.js");
var _readerJs = require("../reader.js");
var _id3Js = require("../id3.js");
var WaveFormat;
(function(WaveFormat) {
    WaveFormat[WaveFormat["PCM"] = 1] = "PCM";
    WaveFormat[WaveFormat["IEEE_FLOAT"] = 3] = "IEEE_FLOAT";
    WaveFormat[WaveFormat["ALAW"] = 6] = "ALAW";
    WaveFormat[WaveFormat["MULAW"] = 7] = "MULAW";
    WaveFormat[WaveFormat["EXTENSIBLE"] = 65534] = "EXTENSIBLE";
})(WaveFormat || (WaveFormat = {}));
class WaveDemuxer extends (0, _demuxerJs.Demuxer) {
    constructor(input){
        super(input);
        this.metadataPromise = null;
        this.dataStart = -1;
        this.dataSize = -1;
        this.audioInfo = null;
        this.tracks = [];
        this.lastKnownPacketIndex = 0;
        this.metadataTags = {};
        this.reader = input._reader;
    }
    async readMetadata() {
        return this.metadataPromise ??= (async ()=>{
            let slice = this.reader.requestSlice(0, 12);
            if (slice instanceof Promise) slice = await slice;
            (0, _miscJs.assert)(slice);
            const riffType = (0, _readerJs.readAscii)(slice, 4);
            const littleEndian = riffType !== 'RIFX';
            const isRf64 = riffType === 'RF64';
            const outerChunkSize = (0, _readerJs.readU32)(slice, littleEndian);
            let totalFileSize = isRf64 ? this.reader.fileSize : Math.min(outerChunkSize + 8, this.reader.fileSize ?? Infinity);
            const format = (0, _readerJs.readAscii)(slice, 4);
            if (format !== 'WAVE') throw new Error('Invalid WAVE file - wrong format');
            let chunksRead = 0;
            let dataChunkSize = null;
            let currentPos = slice.filePos;
            while(totalFileSize === null || currentPos < totalFileSize){
                let slice = this.reader.requestSlice(currentPos, 8);
                if (slice instanceof Promise) slice = await slice;
                if (!slice) break;
                const chunkId = (0, _readerJs.readAscii)(slice, 4);
                const chunkSize = (0, _readerJs.readU32)(slice, littleEndian);
                const startPos = slice.filePos;
                if (isRf64 && chunksRead === 0 && chunkId !== 'ds64') throw new Error('Invalid RF64 file: First chunk must be "ds64".');
                if (chunkId === 'fmt ') await this.parseFmtChunk(startPos, chunkSize, littleEndian);
                else if (chunkId === 'data') {
                    dataChunkSize ??= chunkSize;
                    this.dataStart = slice.filePos;
                    this.dataSize = Math.min(dataChunkSize, (totalFileSize ?? Infinity) - this.dataStart);
                    if (this.reader.fileSize === null) break; // Stop once we hit the data chunk
                } else if (chunkId === 'ds64') {
                    // File and data chunk sizes are defined in here instead
                    let ds64Slice = this.reader.requestSlice(startPos, chunkSize);
                    if (ds64Slice instanceof Promise) ds64Slice = await ds64Slice;
                    if (!ds64Slice) break;
                    const riffChunkSize = (0, _readerJs.readU64)(ds64Slice, littleEndian);
                    dataChunkSize = (0, _readerJs.readU64)(ds64Slice, littleEndian);
                    totalFileSize = Math.min(riffChunkSize + 8, this.reader.fileSize ?? Infinity);
                } else if (chunkId === 'LIST') await this.parseListChunk(startPos, chunkSize, littleEndian);
                else if (chunkId === 'ID3 ' || chunkId === 'id3 ') await this.parseId3Chunk(startPos, chunkSize);
                currentPos = startPos + chunkSize + (chunkSize & 1); // Handle padding
                chunksRead++;
            }
            if (!this.audioInfo) throw new Error('Invalid WAVE file - missing "fmt " chunk');
            if (this.dataStart === -1) throw new Error('Invalid WAVE file - missing "data" chunk');
            const blockSize = this.audioInfo.blockSizeInBytes;
            this.dataSize = Math.floor(this.dataSize / blockSize) * blockSize;
            this.tracks.push(new (0, _inputTrackJs.InputAudioTrack)(this.input, new WaveAudioTrackBacking(this)));
        })();
    }
    async parseFmtChunk(startPos, size, littleEndian) {
        let slice = this.reader.requestSlice(startPos, size);
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return; // File too short
        let formatTag = (0, _readerJs.readU16)(slice, littleEndian);
        const numChannels = (0, _readerJs.readU16)(slice, littleEndian);
        const sampleRate = (0, _readerJs.readU32)(slice, littleEndian);
        slice.skip(4); // Bytes per second
        const blockAlign = (0, _readerJs.readU16)(slice, littleEndian);
        let bitsPerSample;
        if (size === 14) bitsPerSample = 8;
        else bitsPerSample = (0, _readerJs.readU16)(slice, littleEndian);
        // Handle WAVEFORMATEXTENSIBLE
        if (size >= 18 && formatTag !== 0x0165) {
            const cbSize = (0, _readerJs.readU16)(slice, littleEndian);
            const remainingSize = size - 18;
            const extensionSize = Math.min(remainingSize, cbSize);
            if (extensionSize >= 22 && formatTag === WaveFormat.EXTENSIBLE) {
                // Parse WAVEFORMATEXTENSIBLE
                slice.skip(6);
                const subFormat = (0, _readerJs.readBytes)(slice, 16);
                // Get actual format from subFormat GUID
                formatTag = subFormat[0] | subFormat[1] << 8;
            }
        }
        if (formatTag === WaveFormat.MULAW || formatTag === WaveFormat.ALAW) bitsPerSample = 8;
        this.audioInfo = {
            format: formatTag,
            numberOfChannels: numChannels,
            sampleRate,
            sampleSizeInBytes: Math.ceil(bitsPerSample / 8),
            blockSizeInBytes: blockAlign
        };
    }
    async parseListChunk(startPos, size, littleEndian) {
        let slice = this.reader.requestSlice(startPos, size);
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return; // File too short
        const infoType = (0, _readerJs.readAscii)(slice, 4);
        if (infoType !== 'INFO' && infoType !== 'INF0') return; // Not an INFO chunk
        let currentPos = slice.filePos;
        while(currentPos <= startPos + size - 8){
            slice.filePos = currentPos;
            const chunkName = (0, _readerJs.readAscii)(slice, 4);
            const chunkSize = (0, _readerJs.readU32)(slice, littleEndian);
            const bytes = (0, _readerJs.readBytes)(slice, chunkSize);
            let stringLength = 0;
            for(let i = 0; i < bytes.length; i++){
                if (bytes[i] === 0) break;
                stringLength++;
            }
            const value = String.fromCharCode(...bytes.subarray(0, stringLength));
            this.metadataTags.raw ??= {};
            this.metadataTags.raw[chunkName] = value;
            switch(chunkName){
                case 'INAM':
                case 'TITL':
                    this.metadataTags.title ??= value;
                    break;
                case 'TIT3':
                    this.metadataTags.description ??= value;
                    break;
                case 'IART':
                    this.metadataTags.artist ??= value;
                    break;
                case 'IPRD':
                    this.metadataTags.album ??= value;
                    break;
                case 'IPRT':
                case 'ITRK':
                case 'TRCK':
                    {
                        const parts = value.split('/');
                        const trackNum = Number.parseInt(parts[0], 10);
                        const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                        if (Number.isInteger(trackNum) && trackNum > 0) this.metadataTags.trackNumber ??= trackNum;
                        if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) this.metadataTags.tracksTotal ??= tracksTotal;
                    }
                    break;
                case 'ICRD':
                case 'IDIT':
                    {
                        const date = new Date(value);
                        if (!Number.isNaN(date.getTime())) this.metadataTags.date ??= date;
                    }
                    break;
                case 'YEAR':
                    {
                        const year = Number.parseInt(value, 10);
                        if (Number.isInteger(year) && year > 0) this.metadataTags.date ??= new Date(year, 0, 1);
                    }
                    break;
                case 'IGNR':
                case 'GENR':
                    this.metadataTags.genre ??= value;
                    break;
                case 'ICMT':
                case 'CMNT':
                case 'COMM':
                    this.metadataTags.comment ??= value;
                    break;
            }
            currentPos += 8 + chunkSize + (chunkSize & 1); // Handle padding
        }
    }
    async parseId3Chunk(startPos, size) {
        // Parse ID3 tag embedded in WAV file (non-default, but used a lot in practice anyway)
        let slice = this.reader.requestSlice(startPos, size);
        if (slice instanceof Promise) slice = await slice;
        if (!slice) return; // File too short
        const id3V2Header = (0, _id3Js.readId3V2Header)(slice);
        if (id3V2Header) {
            // Extract the content portion (skip the 10-byte header)
            const contentSlice = slice.slice(startPos + 10, id3V2Header.size);
            (0, _id3Js.parseId3V2Tag)(contentSlice, id3V2Header, this.metadataTags);
        }
    }
    getCodec() {
        (0, _miscJs.assert)(this.audioInfo);
        if (this.audioInfo.format === WaveFormat.MULAW) return 'ulaw';
        if (this.audioInfo.format === WaveFormat.ALAW) return 'alaw';
        if (this.audioInfo.format === WaveFormat.PCM) {
            // All formats are little-endian
            if (this.audioInfo.sampleSizeInBytes === 1) return 'pcm-u8';
            else if (this.audioInfo.sampleSizeInBytes === 2) return 'pcm-s16';
            else if (this.audioInfo.sampleSizeInBytes === 3) return 'pcm-s24';
            else if (this.audioInfo.sampleSizeInBytes === 4) return 'pcm-s32';
        }
        if (this.audioInfo.format === WaveFormat.IEEE_FLOAT) {
            if (this.audioInfo.sampleSizeInBytes === 4) return 'pcm-f32';
        }
        return null;
    }
    async getMimeType() {
        return 'audio/wav';
    }
    async computeDuration() {
        await this.readMetadata();
        const track = this.tracks[0];
        (0, _miscJs.assert)(track);
        return track.computeDuration();
    }
    async getTracks() {
        await this.readMetadata();
        return this.tracks;
    }
    async getMetadataTags() {
        await this.readMetadata();
        return this.metadataTags;
    }
}
const PACKET_SIZE_IN_FRAMES = 2048;
class WaveAudioTrackBacking {
    constructor(demuxer){
        this.demuxer = demuxer;
    }
    getId() {
        return 1;
    }
    getCodec() {
        return this.demuxer.getCodec();
    }
    getInternalCodecId() {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        return this.demuxer.audioInfo.format;
    }
    async getDecoderConfig() {
        const codec = this.demuxer.getCodec();
        if (!codec) return null;
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        return {
            codec,
            numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
            sampleRate: this.demuxer.audioInfo.sampleRate
        };
    }
    async computeDuration() {
        const lastPacket = await this.getPacket(Infinity, {
            metadataOnly: true
        });
        return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
    }
    getNumberOfChannels() {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        return this.demuxer.audioInfo.numberOfChannels;
    }
    getSampleRate() {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        return this.demuxer.audioInfo.sampleRate;
    }
    getTimeResolution() {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        return this.demuxer.audioInfo.sampleRate;
    }
    getName() {
        return null;
    }
    getLanguageCode() {
        return 0, _miscJs.UNDETERMINED_LANGUAGE;
    }
    getDisposition() {
        return {
            ...(0, _metadataJs.DEFAULT_TRACK_DISPOSITION)
        };
    }
    async getFirstTimestamp() {
        return 0;
    }
    async getPacketAtIndex(packetIndex, options) {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        const startOffset = packetIndex * PACKET_SIZE_IN_FRAMES * this.demuxer.audioInfo.blockSizeInBytes;
        if (startOffset >= this.demuxer.dataSize) return null;
        const sizeInBytes = Math.min(PACKET_SIZE_IN_FRAMES * this.demuxer.audioInfo.blockSizeInBytes, this.demuxer.dataSize - startOffset);
        if (this.demuxer.reader.fileSize === null) {
            // If the file size is unknown, we weren't able to cap the dataSize in the init logic and we instead have to
            // rely on the headers telling us how large the file is. But, these might be wrong, so let's check if the
            // requested slice actually exists.
            let slice = this.demuxer.reader.requestSlice(this.demuxer.dataStart + startOffset, sizeInBytes);
            if (slice instanceof Promise) slice = await slice;
            if (!slice) return null;
        }
        let data;
        if (options.metadataOnly) data = (0, _packetJs.PLACEHOLDER_DATA);
        else {
            let slice = this.demuxer.reader.requestSlice(this.demuxer.dataStart + startOffset, sizeInBytes);
            if (slice instanceof Promise) slice = await slice;
            (0, _miscJs.assert)(slice);
            data = (0, _readerJs.readBytes)(slice, sizeInBytes);
        }
        const timestamp = packetIndex * PACKET_SIZE_IN_FRAMES / this.demuxer.audioInfo.sampleRate;
        const duration = sizeInBytes / this.demuxer.audioInfo.blockSizeInBytes / this.demuxer.audioInfo.sampleRate;
        this.demuxer.lastKnownPacketIndex = Math.max(packetIndex, timestamp);
        return new (0, _packetJs.EncodedPacket)(data, 'key', timestamp, duration, packetIndex, sizeInBytes);
    }
    getFirstPacket(options) {
        return this.getPacketAtIndex(0, options);
    }
    async getPacket(timestamp, options) {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        const packetIndex = Math.floor(Math.min(timestamp * this.demuxer.audioInfo.sampleRate / PACKET_SIZE_IN_FRAMES, (this.demuxer.dataSize - 1) / (PACKET_SIZE_IN_FRAMES * this.demuxer.audioInfo.blockSizeInBytes)));
        const packet = await this.getPacketAtIndex(packetIndex, options);
        if (packet) return packet;
        if (packetIndex === 0) return null; // Empty data chunk
        (0, _miscJs.assert)(this.demuxer.reader.fileSize === null);
        // The file is shorter than we thought, meaning the packet we were looking for doesn't exist. So, let's find
        // the last packet by doing a sequential scan, instead.
        let currentPacket = await this.getPacketAtIndex(this.demuxer.lastKnownPacketIndex, options);
        while(currentPacket){
            const nextPacket = await this.getNextPacket(currentPacket, options);
            if (!nextPacket) break;
            currentPacket = nextPacket;
        }
        return currentPacket;
    }
    getNextPacket(packet, options) {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        const packetIndex = Math.round(packet.timestamp * this.demuxer.audioInfo.sampleRate / PACKET_SIZE_IN_FRAMES);
        return this.getPacketAtIndex(packetIndex + 1, options);
    }
    getKeyPacket(timestamp, options) {
        return this.getPacket(timestamp, options);
    }
    getNextKeyPacket(packet, options) {
        return this.getNextPacket(packet, options);
    }
}

},{"../demuxer.js":"dZcnn","../input-track.js":"dPVVR","../metadata.js":"3j8h1","../misc.js":"kkhLS","../packet.js":"esYjd","../reader.js":"fr2Ka","../id3.js":"5tvk3","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"jOxJW":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MIN_FRAME_HEADER_SIZE", ()=>MIN_FRAME_HEADER_SIZE);
parcelHelpers.export(exports, "MAX_FRAME_HEADER_SIZE", ()=>MAX_FRAME_HEADER_SIZE);
parcelHelpers.export(exports, "readFrameHeader", ()=>readFrameHeader);
var _miscJs = require("../misc.js");
var _readerJs = require("../reader.js");
const MIN_FRAME_HEADER_SIZE = 7;
const MAX_FRAME_HEADER_SIZE = 9;
const readFrameHeader = (slice)=>{
    // https://wiki.multimedia.cx/index.php/ADTS (last visited: 2025/08/17)
    const startPos = slice.filePos;
    const bytes = (0, _readerJs.readBytes)(slice, 9); // 9 with CRC, 7 without CRC
    const bitstream = new (0, _miscJs.Bitstream)(bytes);
    const syncword = bitstream.readBits(12);
    if (syncword !== 4095) return null;
    bitstream.skipBits(1); // MPEG version
    const layer = bitstream.readBits(2);
    if (layer !== 0) return null;
    const protectionAbsence = bitstream.readBits(1);
    const objectType = bitstream.readBits(2) + 1;
    const samplingFrequencyIndex = bitstream.readBits(4);
    if (samplingFrequencyIndex === 15) return null;
    bitstream.skipBits(1); // Private bit
    const channelConfiguration = bitstream.readBits(3);
    if (channelConfiguration === 0) throw new Error('ADTS frames with channel configuration 0 are not supported.');
    bitstream.skipBits(1); // Originality
    bitstream.skipBits(1); // Home
    bitstream.skipBits(1); // Copyright ID bit
    bitstream.skipBits(1); // Copyright ID start
    const frameLength = bitstream.readBits(13);
    bitstream.skipBits(11); // Buffer fullness
    const numberOfAacFrames = bitstream.readBits(2) + 1;
    if (numberOfAacFrames !== 1) throw new Error('ADTS frames with more than one AAC frame are not supported.');
    let crcCheck = null;
    if (protectionAbsence === 1) slice.filePos -= 2;
    else crcCheck = bitstream.readBits(16);
    return {
        objectType,
        samplingFrequencyIndex,
        channelConfiguration,
        frameLength,
        numberOfAacFrames,
        crcCheck,
        startPos
    };
};

},{"../misc.js":"kkhLS","../reader.js":"fr2Ka","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"fMkVV":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "AdtsDemuxer", ()=>AdtsDemuxer);
var _codecJs = require("../codec.js");
var _demuxerJs = require("../demuxer.js");
var _inputTrackJs = require("../input-track.js");
var _miscJs = require("../misc.js");
var _packetJs = require("../packet.js");
var _readerJs = require("../reader.js");
var _metadataJs = require("../metadata.js");
var _adtsReaderJs = require("./adts-reader.js");
const SAMPLES_PER_AAC_FRAME = 1024;
class AdtsDemuxer extends (0, _demuxerJs.Demuxer) {
    constructor(input){
        super(input);
        this.metadataPromise = null;
        this.firstFrameHeader = null;
        this.loadedSamples = [];
        this.tracks = [];
        this.readingMutex = new (0, _miscJs.AsyncMutex)();
        this.lastSampleLoaded = false;
        this.lastLoadedPos = 0;
        this.nextTimestampInSamples = 0;
        this.reader = input._reader;
    }
    async readMetadata() {
        return this.metadataPromise ??= (async ()=>{
            // Keep loading until we find the first frame header
            while(!this.firstFrameHeader && !this.lastSampleLoaded)await this.advanceReader();
            // There has to be a frame if this demuxer got selected
            (0, _miscJs.assert)(this.firstFrameHeader);
            // Create the single audio track
            this.tracks = [
                new (0, _inputTrackJs.InputAudioTrack)(this.input, new AdtsAudioTrackBacking(this))
            ];
        })();
    }
    async advanceReader() {
        let slice = this.reader.requestSliceRange(this.lastLoadedPos, (0, _adtsReaderJs.MIN_FRAME_HEADER_SIZE), (0, _adtsReaderJs.MAX_FRAME_HEADER_SIZE));
        if (slice instanceof Promise) slice = await slice;
        if (!slice) {
            this.lastSampleLoaded = true;
            return;
        }
        const header = (0, _adtsReaderJs.readFrameHeader)(slice);
        if (!header) {
            this.lastSampleLoaded = true;
            return;
        }
        if (this.reader.fileSize !== null && header.startPos + header.frameLength > this.reader.fileSize) {
            // Frame doesn't fit in the rest of the file
            this.lastSampleLoaded = true;
            return;
        }
        if (!this.firstFrameHeader) this.firstFrameHeader = header;
        const sampleRate = (0, _codecJs.aacFrequencyTable)[header.samplingFrequencyIndex];
        (0, _miscJs.assert)(sampleRate !== undefined);
        const sampleDuration = SAMPLES_PER_AAC_FRAME / sampleRate;
        const headerSize = header.crcCheck ? (0, _adtsReaderJs.MAX_FRAME_HEADER_SIZE) : (0, _adtsReaderJs.MIN_FRAME_HEADER_SIZE);
        const sample = {
            timestamp: this.nextTimestampInSamples / sampleRate,
            duration: sampleDuration,
            dataStart: header.startPos + headerSize,
            dataSize: header.frameLength - headerSize
        };
        this.loadedSamples.push(sample);
        this.nextTimestampInSamples += SAMPLES_PER_AAC_FRAME;
        this.lastLoadedPos = header.startPos + header.frameLength;
    }
    async getMimeType() {
        return 'audio/aac';
    }
    async getTracks() {
        await this.readMetadata();
        return this.tracks;
    }
    async computeDuration() {
        await this.readMetadata();
        const track = this.tracks[0];
        (0, _miscJs.assert)(track);
        return track.computeDuration();
    }
    async getMetadataTags() {
        return {}; // No tags in this one
    }
}
class AdtsAudioTrackBacking {
    constructor(demuxer){
        this.demuxer = demuxer;
    }
    getId() {
        return 1;
    }
    async getFirstTimestamp() {
        return 0;
    }
    getTimeResolution() {
        const sampleRate = this.getSampleRate();
        return sampleRate / SAMPLES_PER_AAC_FRAME;
    }
    async computeDuration() {
        const lastPacket = await this.getPacket(Infinity, {
            metadataOnly: true
        });
        return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
    }
    getName() {
        return null;
    }
    getLanguageCode() {
        return 0, _miscJs.UNDETERMINED_LANGUAGE;
    }
    getCodec() {
        return 'aac';
    }
    getInternalCodecId() {
        (0, _miscJs.assert)(this.demuxer.firstFrameHeader);
        return this.demuxer.firstFrameHeader.objectType;
    }
    getNumberOfChannels() {
        (0, _miscJs.assert)(this.demuxer.firstFrameHeader);
        const numberOfChannels = (0, _codecJs.aacChannelMap)[this.demuxer.firstFrameHeader.channelConfiguration];
        (0, _miscJs.assert)(numberOfChannels !== undefined);
        return numberOfChannels;
    }
    getSampleRate() {
        (0, _miscJs.assert)(this.demuxer.firstFrameHeader);
        const sampleRate = (0, _codecJs.aacFrequencyTable)[this.demuxer.firstFrameHeader.samplingFrequencyIndex];
        (0, _miscJs.assert)(sampleRate !== undefined);
        return sampleRate;
    }
    getDisposition() {
        return {
            ...(0, _metadataJs.DEFAULT_TRACK_DISPOSITION)
        };
    }
    async getDecoderConfig() {
        (0, _miscJs.assert)(this.demuxer.firstFrameHeader);
        const bytes = new Uint8Array(3); // 19 bits max
        const bitstream = new (0, _miscJs.Bitstream)(bytes);
        const { objectType, samplingFrequencyIndex, channelConfiguration } = this.demuxer.firstFrameHeader;
        if (objectType > 31) {
            bitstream.writeBits(5, 31);
            bitstream.writeBits(6, objectType - 32);
        } else bitstream.writeBits(5, objectType);
        bitstream.writeBits(4, samplingFrequencyIndex); // samplingFrequencyIndex === 15 is forbidden
        bitstream.writeBits(4, channelConfiguration);
        return {
            codec: `mp4a.40.${this.demuxer.firstFrameHeader.objectType}`,
            numberOfChannels: this.getNumberOfChannels(),
            sampleRate: this.getSampleRate(),
            description: bytes.subarray(0, Math.ceil((bitstream.pos - 1) / 8))
        };
    }
    async getPacketAtIndex(sampleIndex, options) {
        if (sampleIndex === -1) return null;
        const rawSample = this.demuxer.loadedSamples[sampleIndex];
        if (!rawSample) return null;
        let data;
        if (options.metadataOnly) data = (0, _packetJs.PLACEHOLDER_DATA);
        else {
            let slice = this.demuxer.reader.requestSlice(rawSample.dataStart, rawSample.dataSize);
            if (slice instanceof Promise) slice = await slice;
            if (!slice) return null; // Data didn't fit into the rest of the file
            data = (0, _readerJs.readBytes)(slice, rawSample.dataSize);
        }
        return new (0, _packetJs.EncodedPacket)(data, 'key', rawSample.timestamp, rawSample.duration, sampleIndex, rawSample.dataSize);
    }
    getFirstPacket(options) {
        return this.getPacketAtIndex(0, options);
    }
    async getNextPacket(packet, options) {
        const release = await this.demuxer.readingMutex.acquire();
        try {
            const sampleIndex = (0, _miscJs.binarySearchExact)(this.demuxer.loadedSamples, packet.timestamp, (x)=>x.timestamp);
            if (sampleIndex === -1) throw new Error('Packet was not created from this track.');
            const nextIndex = sampleIndex + 1;
            // Ensure the next sample exists
            while(nextIndex >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded)await this.demuxer.advanceReader();
            return this.getPacketAtIndex(nextIndex, options);
        } finally{
            release();
        }
    }
    async getPacket(timestamp, options) {
        const release = await this.demuxer.readingMutex.acquire();
        try {
            while(true){
                const index = (0, _miscJs.binarySearchLessOrEqual)(this.demuxer.loadedSamples, timestamp, (x)=>x.timestamp);
                if (index === -1 && this.demuxer.loadedSamples.length > 0) // We're before the first sample
                return null;
                if (this.demuxer.lastSampleLoaded) // All data is loaded, return what we found
                return this.getPacketAtIndex(index, options);
                if (index >= 0 && index + 1 < this.demuxer.loadedSamples.length) // The next packet also exists, we're done
                return this.getPacketAtIndex(index, options);
                // Otherwise, keep loading data
                await this.demuxer.advanceReader();
            }
        } finally{
            release();
        }
    }
    getKeyPacket(timestamp, options) {
        return this.getPacket(timestamp, options);
    }
    getNextKeyPacket(packet, options) {
        return this.getNextPacket(packet, options);
    }
}

},{"../codec.js":"4oSIO","../demuxer.js":"dZcnn","../input-track.js":"dPVVR","../misc.js":"kkhLS","../packet.js":"esYjd","../reader.js":"fr2Ka","../metadata.js":"3j8h1","./adts-reader.js":"jOxJW","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"kBazS":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FlacDemuxer", ()=>FlacDemuxer);
var _codecDataJs = require("../codec-data.js");
var _demuxerJs = require("../demuxer.js");
var _inputTrackJs = require("../input-track.js");
var _miscJs = require("../misc.js");
var _packetJs = require("../packet.js");
var _readerJs = require("../reader.js");
var _metadataJs = require("../metadata.js");
var _flacMiscJs = require("./flac-misc.js");
class FlacDemuxer extends (0, _demuxerJs.Demuxer) {
    constructor(input){
        super(input);
        this.loadedSamples = []; // All samples from the start of the file to lastLoadedPos
        this.metadataPromise = null;
        this.track = null;
        this.metadataTags = {};
        this.audioInfo = null;
        this.lastLoadedPos = null;
        this.blockingBit = null;
        this.readingMutex = new (0, _miscJs.AsyncMutex)();
        this.lastSampleLoaded = false;
        this.reader = input._reader;
    }
    async computeDuration() {
        await this.readMetadata();
        (0, _miscJs.assert)(this.track);
        return this.track.computeDuration();
    }
    async getMetadataTags() {
        await this.readMetadata();
        return this.metadataTags;
    }
    async getTracks() {
        await this.readMetadata();
        (0, _miscJs.assert)(this.track);
        return [
            this.track
        ];
    }
    async getMimeType() {
        return 'audio/flac';
    }
    async readMetadata() {
        let currentPos = 4; // Skip 'fLaC'
        return this.metadataPromise ??= (async ()=>{
            while(this.reader.fileSize === null || currentPos < this.reader.fileSize){
                let sizeSlice = this.reader.requestSlice(currentPos, 4);
                if (sizeSlice instanceof Promise) sizeSlice = await sizeSlice;
                currentPos += 4;
                if (sizeSlice === null) throw new Error(`Metadata block at position ${currentPos} is too small! Corrupted file.`);
                (0, _miscJs.assert)(sizeSlice);
                const byte = (0, _readerJs.readU8)(sizeSlice); // first bit: isLastMetadata, remaining 7 bits: metaBlockType
                const size = (0, _readerJs.readU24Be)(sizeSlice);
                const isLastMetadata = (byte & 0x80) !== 0;
                const metaBlockType = byte & 0x7f;
                switch(metaBlockType){
                    case (0, _codecDataJs.FlacBlockType).STREAMINFO:
                        {
                            // Parse streaminfo block
                            // https://www.rfc-editor.org/rfc/rfc9639.html#section-8.2
                            let streamInfoBlock = this.reader.requestSlice(currentPos, size);
                            if (streamInfoBlock instanceof Promise) streamInfoBlock = await streamInfoBlock;
                            (0, _miscJs.assert)(streamInfoBlock);
                            if (streamInfoBlock === null) throw new Error(`StreamInfo block at position ${currentPos} is too small! Corrupted file.`);
                            const streamInfoBytes = (0, _readerJs.readBytes)(streamInfoBlock, 34);
                            const bitstream = new (0, _miscJs.Bitstream)(streamInfoBytes);
                            const minimumBlockSize = bitstream.readBits(16);
                            const maximumBlockSize = bitstream.readBits(16);
                            const minimumFrameSize = bitstream.readBits(24);
                            const maximumFrameSize = bitstream.readBits(24);
                            const sampleRate = bitstream.readBits(20);
                            const numberOfChannels = bitstream.readBits(3) + 1;
                            bitstream.readBits(5); // bitsPerSample - 1
                            const totalSamples = bitstream.readBits(36);
                            // https://www.w3.org/TR/webcodecs-flac-codec-registration/#audiodecoderconfig-description
                            // description is required, and has to be the following:
                            // 1. The bytes 0x66 0x4C 0x61 0x43 ("fLaC" in ASCII)
                            // 2. A metadata block (called the STREAMINFO block) as described in section 7 of [FLAC]
                            // 3. Optionaly (sic) other metadata blocks, that are not used by the specification
                            bitstream.skipBits(128); // md5 hash
                            const description = new Uint8Array(42);
                            // 1. "fLaC"
                            description.set(new Uint8Array([
                                0x66,
                                0x4c,
                                0x61,
                                0x43
                            ]), 0);
                            // 2. STREAMINFO block
                            description.set(new Uint8Array([
                                128,
                                0,
                                0,
                                34
                            ]), 4);
                            // 3. Other metadata blocks
                            description.set(streamInfoBytes, 8);
                            this.audioInfo = {
                                numberOfChannels,
                                sampleRate,
                                totalSamples,
                                minimumBlockSize,
                                maximumBlockSize,
                                minimumFrameSize,
                                maximumFrameSize,
                                description
                            };
                            this.track = new (0, _inputTrackJs.InputAudioTrack)(this.input, new FlacAudioTrackBacking(this));
                            break;
                        }
                    case (0, _codecDataJs.FlacBlockType).VORBIS_COMMENT:
                        {
                            // Parse vorbis comment block
                            // https://www.rfc-editor.org/rfc/rfc9639.html#name-vorbis-comment
                            let vorbisCommentBlock = this.reader.requestSlice(currentPos, size);
                            if (vorbisCommentBlock instanceof Promise) vorbisCommentBlock = await vorbisCommentBlock;
                            (0, _miscJs.assert)(vorbisCommentBlock);
                            (0, _codecDataJs.readVorbisComments)((0, _readerJs.readBytes)(vorbisCommentBlock, size), this.metadataTags);
                            break;
                        }
                    case (0, _codecDataJs.FlacBlockType).PICTURE:
                        {
                            // Parse picture block
                            // https://www.rfc-editor.org/rfc/rfc9639.html#name-picture
                            let pictureBlock = this.reader.requestSlice(currentPos, size);
                            if (pictureBlock instanceof Promise) pictureBlock = await pictureBlock;
                            (0, _miscJs.assert)(pictureBlock);
                            const pictureType = (0, _readerJs.readU32Be)(pictureBlock);
                            const mediaTypeLength = (0, _readerJs.readU32Be)(pictureBlock);
                            const mediaType = (0, _miscJs.textDecoder).decode((0, _readerJs.readBytes)(pictureBlock, mediaTypeLength));
                            const descriptionLength = (0, _readerJs.readU32Be)(pictureBlock);
                            const description = (0, _miscJs.textDecoder).decode((0, _readerJs.readBytes)(pictureBlock, descriptionLength));
                            pictureBlock.skip(16); // Skip width, height, color depth, number of indexed colors
                            const dataLength = (0, _readerJs.readU32Be)(pictureBlock);
                            const data = (0, _readerJs.readBytes)(pictureBlock, dataLength);
                            this.metadataTags.images ??= [];
                            this.metadataTags.images.push({
                                data,
                                mimeType: mediaType,
                                // https://www.rfc-editor.org/rfc/rfc9639.html#table13
                                kind: pictureType === 3 ? 'coverFront' : pictureType === 4 ? 'coverBack' : 'unknown',
                                description
                            });
                            break;
                        }
                    default:
                        break;
                }
                currentPos += size;
                if (isLastMetadata) {
                    this.lastLoadedPos = currentPos;
                    break;
                }
            }
        })();
    }
    async readNextFlacFrame({ startPos, isFirstPacket }) {
        (0, _miscJs.assert)(this.audioInfo);
        // we expect that there are at least `minimumFrameSize` bytes left in the file
        // Ideally we also want to validate the next header is valid
        // to throw out an accidential sync word
        // The shortest valid FLAC header I can think of, based off the code
        // of readFlacFrameHeader:
        // 4 bytes used for bitstream from syncword to bit depth
        // 1 byte coded number
        // (uncommon values, no bytes read)
        // 1 byte crc
        // --> 6 bytes
        const minimumHeaderLength = 6;
        // If we read everything in readFlacFrameHeader, we read 16 bytes
        const maximumHeaderSize = 16;
        const maximumSliceLength = this.audioInfo.maximumFrameSize + maximumHeaderSize;
        const slice = await this.reader.requestSliceRange(startPos, this.audioInfo.minimumFrameSize, maximumSliceLength);
        if (!slice) return null;
        const frameHeader = this.readFlacFrameHeader({
            slice,
            isFirstPacket: isFirstPacket
        });
        if (!frameHeader) return null;
        // We don't know exactly how long the packet is, we only know the `minimumFrameSize` and `maximumFrameSize`
        // The packet is over if the next 2 bytes are the sync word followed by a valid header
        // or the end of the file is reached
        // The next sync word is expected at earliest when `minimumFrameSize` is reached,
        // we can skip over anything before that
        slice.filePos = startPos + this.audioInfo.minimumFrameSize;
        while(true){
            // Reached end of the file, packet is over
            if (slice.filePos > slice.end - minimumHeaderLength) return {
                num: frameHeader.num,
                blockSize: frameHeader.blockSize,
                sampleRate: frameHeader.sampleRate,
                size: slice.end - startPos,
                isLastFrame: true
            };
            const nextByte = (0, _readerJs.readU8)(slice);
            if (nextByte === 0xff) {
                const positionBeforeReading = slice.filePos;
                const byteAfterNextByte = (0, _readerJs.readU8)(slice);
                const expected = this.blockingBit === 1 ? 249 : 248;
                if (byteAfterNextByte !== expected) {
                    slice.filePos = positionBeforeReading;
                    continue;
                }
                slice.skip(-2);
                const lengthIfNextFlacFrameHeaderIsLegit = slice.filePos - startPos;
                const nextFrameHeader = this.readFlacFrameHeader({
                    slice,
                    isFirstPacket: false
                });
                if (!nextFrameHeader) {
                    slice.filePos = positionBeforeReading;
                    continue;
                }
                // Ensure the frameOrSampleNum is consecutive.
                // https://github.com/Vanilagy/mediabunny/issues/194
                if (this.blockingBit === 0) // Case A: If the stream is fixed block size, this is the frame number, which increments by 1
                {
                    if (nextFrameHeader.num - frameHeader.num !== 1) {
                        slice.filePos = positionBeforeReading;
                        continue;
                    }
                } else // Case B: If the stream is variable block size, this is the sample number, which increments by
                // amount of samples in a frame.
                if (nextFrameHeader.num - frameHeader.num !== frameHeader.blockSize) {
                    slice.filePos = positionBeforeReading;
                    continue;
                }
                return {
                    num: frameHeader.num,
                    blockSize: frameHeader.blockSize,
                    sampleRate: frameHeader.sampleRate,
                    size: lengthIfNextFlacFrameHeaderIsLegit,
                    isLastFrame: false
                };
            }
        }
    }
    readFlacFrameHeader({ slice, isFirstPacket }) {
        // In this function, generally it is not safe to throw errors.
        // We might end up here because we stumbled upon a syncword,
        // but the data might not actually be a FLAC frame, it might be random bitstream
        // data, in that case we should return null and continue.
        const startOffset = slice.filePos;
        // https://www.rfc-editor.org/rfc/rfc9639.html#section-9.1
        // Each frame MUST start on a byte boundary and start with the 15-bit frame
        // sync code 0b111111111111100. Following the sync code is the blocking strategy
        // bit, which MUST NOT change during the audio stream.
        const bytes = (0, _readerJs.readBytes)(slice, 4);
        const bitstream = new (0, _miscJs.Bitstream)(bytes);
        const bits = bitstream.readBits(15);
        if (bits !== 32764) // This cannot be a valid FLAC frame, must start with the syncword
        return null;
        if (this.blockingBit === null) {
            (0, _miscJs.assert)(isFirstPacket);
            const newBlockingBit = bitstream.readBits(1);
            this.blockingBit = newBlockingBit;
        } else if (this.blockingBit === 1) {
            (0, _miscJs.assert)(!isFirstPacket);
            const newBlockingBit = bitstream.readBits(1);
            if (newBlockingBit !== 1) // This cannot be a valid FLAC frame, expected 1 but got 0
            return null;
        } else if (this.blockingBit === 0) {
            (0, _miscJs.assert)(!isFirstPacket);
            const newBlockingBit = bitstream.readBits(1);
            if (newBlockingBit !== 0) // This cannot be a valid FLAC frame, expected 0 but got 1
            return null;
        } else throw new Error('Invalid blocking bit');
        const blockSizeOrUncommon = (0, _flacMiscJs.getBlockSizeOrUncommon)(bitstream.readBits(4));
        if (!blockSizeOrUncommon) // This cannot be a valid FLAC frame, the syncword was just coincidental
        return null;
        (0, _miscJs.assert)(this.audioInfo);
        const sampleRateOrUncommon = (0, _flacMiscJs.getSampleRateOrUncommon)(bitstream.readBits(4), this.audioInfo.sampleRate);
        if (!sampleRateOrUncommon) // This cannot be a valid FLAC frame, the syncword was just coincidental
        return null;
        bitstream.readBits(4); // channel count
        bitstream.readBits(3); // bit depth
        const reservedZero = bitstream.readBits(1); // reserved zero
        if (reservedZero !== 0) // This cannot be a valid FLAC frame, the syncword was just coincidental
        return null;
        const num = (0, _flacMiscJs.readCodedNumber)(slice);
        const blockSize = (0, _flacMiscJs.readBlockSize)(slice, blockSizeOrUncommon);
        const sampleRate = (0, _flacMiscJs.readSampleRate)(slice, sampleRateOrUncommon);
        if (sampleRate === null) // This cannot be a valid FLAC frame, the syncword was just coincidental
        return null;
        if (sampleRate !== this.audioInfo.sampleRate) // This cannot be a valid FLAC frame, the sample rate is not the same as in the stream info
        return null;
        const size = slice.filePos - startOffset;
        const crc = (0, _readerJs.readU8)(slice);
        slice.skip(-size);
        slice.skip(-1);
        const crcCalculated = (0, _flacMiscJs.calculateCrc8)((0, _readerJs.readBytes)(slice, size));
        if (crc !== crcCalculated) // Maybe this wasn't a FLAC frame at all, the syncword was just coincidentally
        // in the bitstream
        return null;
        return {
            num,
            blockSize,
            sampleRate
        };
    }
    async advanceReader() {
        await this.readMetadata();
        (0, _miscJs.assert)(this.lastLoadedPos !== null);
        (0, _miscJs.assert)(this.audioInfo);
        const startPos = this.lastLoadedPos;
        const frame = await this.readNextFlacFrame({
            startPos,
            isFirstPacket: this.loadedSamples.length === 0
        });
        if (!frame) {
            // Unexpected case, failed to read next FLAC frame
            // handling gracefully
            this.lastSampleLoaded = true;
            return;
        }
        const lastSample = this.loadedSamples[this.loadedSamples.length - 1];
        const blockOffset = lastSample ? lastSample.blockOffset + lastSample.blockSize : 0;
        const sample = {
            blockOffset,
            blockSize: frame.blockSize,
            byteOffset: startPos,
            byteSize: frame.size
        };
        this.lastLoadedPos = this.lastLoadedPos + frame.size;
        this.loadedSamples.push(sample);
        if (frame.isLastFrame) {
            this.lastSampleLoaded = true;
            return;
        }
    }
}
class FlacAudioTrackBacking {
    constructor(demuxer){
        this.demuxer = demuxer;
    }
    getId() {
        return 1;
    }
    getCodec() {
        return 'flac';
    }
    getInternalCodecId() {
        return null;
    }
    getNumberOfChannels() {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        return this.demuxer.audioInfo.numberOfChannels;
    }
    async computeDuration() {
        const lastPacket = await this.getPacket(Infinity, {
            metadataOnly: true
        });
        return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
    }
    getSampleRate() {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        return this.demuxer.audioInfo.sampleRate;
    }
    getName() {
        return null;
    }
    getLanguageCode() {
        return 0, _miscJs.UNDETERMINED_LANGUAGE;
    }
    getTimeResolution() {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        return this.demuxer.audioInfo.sampleRate;
    }
    getDisposition() {
        return {
            ...(0, _metadataJs.DEFAULT_TRACK_DISPOSITION)
        };
    }
    async getFirstTimestamp() {
        return 0;
    }
    async getDecoderConfig() {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        return {
            codec: 'flac',
            numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
            sampleRate: this.demuxer.audioInfo.sampleRate,
            description: this.demuxer.audioInfo.description
        };
    }
    async getPacket(timestamp, options) {
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        if (timestamp < 0) throw new Error('Timestamp cannot be negative');
        const release = await this.demuxer.readingMutex.acquire();
        try {
            while(true){
                const packetIndex = (0, _miscJs.binarySearchLessOrEqual)(this.demuxer.loadedSamples, timestamp, (x)=>x.blockOffset / this.demuxer.audioInfo.sampleRate);
                if (packetIndex === -1) {
                    await this.demuxer.advanceReader();
                    continue;
                }
                const packet = this.demuxer.loadedSamples[packetIndex];
                const sampleTimestamp = packet.blockOffset / this.demuxer.audioInfo.sampleRate;
                const sampleDuration = packet.blockSize / this.demuxer.audioInfo.sampleRate;
                if (sampleTimestamp + sampleDuration <= timestamp) {
                    if (this.demuxer.lastSampleLoaded) return this.getPacketAtIndex(this.demuxer.loadedSamples.length - 1, options);
                    await this.demuxer.advanceReader();
                    continue;
                }
                return this.getPacketAtIndex(packetIndex, options);
            }
        } finally{
            release();
        }
    }
    async getNextPacket(packet, options) {
        const release = await this.demuxer.readingMutex.acquire();
        try {
            const nextIndex = packet.sequenceNumber + 1;
            if (this.demuxer.lastSampleLoaded && nextIndex >= this.demuxer.loadedSamples.length) return null;
            // Ensure the next sample exists
            while(nextIndex >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded)await this.demuxer.advanceReader();
            return this.getPacketAtIndex(nextIndex, options);
        } finally{
            release();
        }
    }
    getKeyPacket(timestamp, options) {
        return this.getPacket(timestamp, options);
    }
    getNextKeyPacket(packet, options) {
        return this.getNextPacket(packet, options);
    }
    async getPacketAtIndex(sampleIndex, options) {
        const rawSample = this.demuxer.loadedSamples[sampleIndex];
        if (!rawSample) return null;
        let data;
        if (options.metadataOnly) data = (0, _packetJs.PLACEHOLDER_DATA);
        else {
            let slice = this.demuxer.reader.requestSlice(rawSample.byteOffset, rawSample.byteSize);
            if (slice instanceof Promise) slice = await slice;
            if (!slice) return null; // Data didn't fit into the rest of the file
            data = (0, _readerJs.readBytes)(slice, rawSample.byteSize);
        }
        (0, _miscJs.assert)(this.demuxer.audioInfo);
        const timestamp = rawSample.blockOffset / this.demuxer.audioInfo.sampleRate;
        const duration = rawSample.blockSize / this.demuxer.audioInfo.sampleRate;
        return new (0, _packetJs.EncodedPacket)(data, 'key', timestamp, duration, sampleIndex, rawSample.byteSize);
    }
    async getFirstPacket(options) {
        // Ensure the next sample exists
        while(this.demuxer.loadedSamples.length === 0 && !this.demuxer.lastSampleLoaded)await this.demuxer.advanceReader();
        return this.getPacketAtIndex(0, options);
    }
}

},{"../codec-data.js":"bzpVB","../demuxer.js":"dZcnn","../input-track.js":"dPVVR","../misc.js":"kkhLS","../packet.js":"esYjd","../reader.js":"fr2Ka","../metadata.js":"3j8h1","./flac-misc.js":"66ASt","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"66ASt":[function(require,module,exports,__globalThis) {
/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getBlockSizeOrUncommon", ()=>getBlockSizeOrUncommon);
parcelHelpers.export(exports, "getSampleRateOrUncommon", ()=>getSampleRateOrUncommon);
parcelHelpers.export(exports, "readCodedNumber", ()=>readCodedNumber);
parcelHelpers.export(exports, "readBlockSize", ()=>readBlockSize);
parcelHelpers.export(exports, "readSampleRate", ()=>readSampleRate);
parcelHelpers.export(exports, "calculateCrc8", ()=>calculateCrc8);
var _miscJs = require("../misc.js");
var _readerJs = require("../reader.js");
const getBlockSizeOrUncommon = (bits)=>{
    if (bits === 0) return null;
    else if (bits === 1) return 192;
    else if (bits >= 2 && bits <= 5) return 144 * 2 ** bits;
    else if (bits === 6) return 'uncommon-u8';
    else if (bits === 7) return 'uncommon-u16';
    else if (bits >= 8 && bits <= 15) return 2 ** bits;
    else return null;
};
const getSampleRateOrUncommon = (sampleRateBits, streamInfoSampleRate)=>{
    switch(sampleRateBits){
        case 0:
            return streamInfoSampleRate;
        case 1:
            return 88200;
        case 2:
            return 176400;
        case 3:
            return 192000;
        case 4:
            return 8000;
        case 5:
            return 16000;
        case 6:
            return 22050;
        case 7:
            return 24000;
        case 8:
            return 32000;
        case 9:
            return 44100;
        case 10:
            return 48000;
        case 11:
            return 96000;
        case 12:
            return 'uncommon-u8';
        case 13:
            return 'uncommon-u16';
        case 14:
            return 'uncommon-u16-10';
        default:
            return null;
    }
};
const readCodedNumber = (fileSlice)=>{
    let ones = 0;
    const bitstream1 = new (0, _miscJs.Bitstream)((0, _readerJs.readBytes)(fileSlice, 1));
    while(bitstream1.readBits(1) === 1)ones++;
    if (ones === 0) return bitstream1.readBits(7);
    const bitArray = [];
    const extraBytes = ones - 1;
    const bitstream2 = new (0, _miscJs.Bitstream)((0, _readerJs.readBytes)(fileSlice, extraBytes));
    const firstByteBits = 8 - ones - 1;
    for(let i = 0; i < firstByteBits; i++)bitArray.unshift(bitstream1.readBits(1));
    for(let i = 0; i < extraBytes; i++)for(let j = 0; j < 8; j++){
        const val = bitstream2.readBits(1);
        if (j < 2) continue;
        bitArray.unshift(val);
    }
    const encoded = bitArray.reduce((acc, bit, index)=>{
        return acc | bit << index;
    }, 0);
    return encoded;
};
const readBlockSize = (slice, blockSizeBits)=>{
    if (blockSizeBits === 'uncommon-u16') return (0, _readerJs.readU16Be)(slice) + 1;
    else if (blockSizeBits === 'uncommon-u8') return (0, _readerJs.readU8)(slice) + 1;
    else if (typeof blockSizeBits === 'number') return blockSizeBits;
    else {
        (0, _miscJs.assertNever)(blockSizeBits);
        (0, _miscJs.assert)(false);
    }
};
const readSampleRate = (slice, sampleRateOrUncommon)=>{
    if (sampleRateOrUncommon === 'uncommon-u16') return (0, _readerJs.readU16Be)(slice);
    if (sampleRateOrUncommon === 'uncommon-u16-10') return (0, _readerJs.readU16Be)(slice) * 10;
    if (sampleRateOrUncommon === 'uncommon-u8') return (0, _readerJs.readU8)(slice);
    if (typeof sampleRateOrUncommon === 'number') return sampleRateOrUncommon;
    return null;
};
const calculateCrc8 = (data)=>{
    const polynomial = 0x07; // x^8 + x^2 + x^1 + x^0
    let crc = 0x00; // Initialize CRC to 0
    for (const byte of data){
        crc ^= byte; // XOR byte into least significant byte of crc
        for(let i = 0; i < 8; i++){
            // For each bit in the byte
            if ((crc & 0x80) !== 0) // If the leftmost bit (MSB) is set
            crc = crc << 1 ^ polynomial; // Shift left and XOR with polynomial
            else crc <<= 1; // Just shift left
            crc &= 0xff; // Ensure CRC remains 8-bit
        }
    }
    return crc;
};

},{"../misc.js":"kkhLS","../reader.js":"fr2Ka","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"aylqP":[function(require,module,exports,__globalThis) {
/**
 * Video Engine for MediaBunny
 * Handles video frame rendering and synchronization
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _mediabunny = require("mediabunny");
class VideoEngine {
    constructor({ canvas, ctx, events, timeupdateInterval = 250, avSyncTolerance = 0.12, dropLateFrames = false, poster = '', preflightRange = false }){
        this.canvas = canvas;
        this.ctx = ctx;
        this.events = events;
        this.timeupdateInterval = timeupdateInterval;
        this.avSyncTolerance = avSyncTolerance;
        this.dropLateFrames = dropLateFrames;
        this.poster = poster;
        this.preflightRange = preflightRange;
        // MediaBunny instances
        this.input = null;
        this.videoSink = null;
        this.videoIterator = null;
        // Frame rendering
        this.nextFrame = null;
        this.rafId = 0;
        this.asyncId = 0;
        // Video properties
        this.width = 0;
        this.height = 0;
        this.duration = Number.NaN;
        // Playback state
        this.audioClock = null;
        this.lastTimeUpdate = 0;
        this.stalled = false;
        this.playbackRate = 1;
        this.posterDrawn = false;
        this.isFetching = false;
    }
    normalizeSource(src) {
        if (typeof src === 'string') return new (0, _mediabunny.UrlSource)(src);
        if (src instanceof Blob) return new (0, _mediabunny.BlobSource)(src);
        if (typeof ReadableStream !== 'undefined' && src instanceof ReadableStream) return new (0, _mediabunny.ReadableStreamSource)(src);
        return src;
    }
    async preflight(url) {
        if (!this.preflightRange || typeof url !== 'string') return true;
        try {
            const res = await fetch(url, {
                method: 'HEAD'
            });
            const acceptRanges = res.headers.get('accept-ranges');
            if (!acceptRanges || acceptRanges === 'none') {
                this.events.emit('error', new Event('RangeNotSupported'));
                return false;
            }
            return true;
        } catch (e) {
            console.warn('Preflight check failed:', e);
            return true;
        }
    }
    drawPoster() {
        if (!this.poster || this.posterDrawn) return;
        const img = new Image();
        img.onload = ()=>{
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.width = img.naturalWidth || this.canvas.width;
            this.canvas.height = img.naturalHeight || this.canvas.height;
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.posterDrawn = true;
        };
        img.src = this.poster;
    }
    async stopIterator() {
        await this.videoIterator?.return();
        this.videoIterator = null;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    async load(src, onMetadata) {
        const id = ++this.asyncId;
        await this.stopIterator();
        this.clear();
        this.posterDrawn = false;
        if (!await this.preflight(src)) return;
        const source = this.normalizeSource(src);
        if (!source) {
            this.drawPoster();
            return;
        }
        this.input = new (0, _mediabunny.Input)({
            source,
            formats: (0, _mediabunny.ALL_FORMATS)
        });
        this.duration = await this.input.computeDuration();
        if (id !== this.asyncId) return;
        const videoTrack = await this.input.getPrimaryVideoTrack();
        if (!videoTrack) {
            this.handleNoVideoTrack();
            onMetadata?.();
            return;
        }
        if (videoTrack.codec === null || !await videoTrack.canDecode()) {
            this.handleNoVideoTrack();
            onMetadata?.();
            return;
        }
        const transparent = await videoTrack.canBeTransparent();
        this.videoSink = new (0, _mediabunny.CanvasSink)(videoTrack, {
            poolSize: 2,
            fit: 'contain',
            alpha: transparent
        });
        this.width = videoTrack.displayWidth;
        this.height = videoTrack.displayHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        onMetadata?.();
        await this.resetIterator(0);
    }
    handleNoVideoTrack() {
        this.videoSink = null;
        this.width = 0;
        this.height = 0;
        this.canvas.width = 0;
        this.canvas.height = 0;
        this.clear();
        this.drawPoster();
    }
    async resetIterator(time) {
        await this.stopIterator();
        if (!this.videoSink) return;
        this.videoIterator = this.videoSink.canvases(time);
        const first = (await this.videoIterator.next()).value ?? null;
        const second = (await this.videoIterator.next()).value ?? null;
        this.nextFrame = second;
        if (first) {
            this.ctx.drawImage(first.canvas, 0, 0);
            this.events.emit('loadeddata');
        } else this.drawPoster();
    }
    async updateNextFrame(localId) {
        if (!this.videoIterator || this.isFetching) return;
        this.isFetching = true;
        try {
            while(true){
                const frame = (await this.videoIterator.next()).value ?? null;
                if (!frame || localId !== this.asyncId) return;
                const t = this.audioClock.currentTime;
                const tolerance = this.dropLateFrames ? Math.max(0.06, this.avSyncTolerance / Math.max(1, this.playbackRate)) : 0;
                if (this.dropLateFrames && frame.timestamp < t - tolerance) continue;
                if (frame.timestamp <= t + tolerance) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(frame.canvas, 0, 0);
                    if (!this.dropLateFrames && frame.timestamp > t) {
                        this.nextFrame = null;
                        return;
                    }
                } else {
                    this.nextFrame = frame;
                    return;
                }
            }
        } finally{
            this.isFetching = false;
        }
    }
    render() {
        if (!this.audioClock) return;
        const t = this.audioClock.currentTime;
        const now = Date.now();
        // Emit timeupdate event
        if (now - this.lastTimeUpdate >= this.timeupdateInterval) {
            this.events.emit('timeupdate');
            this.lastTimeUpdate = now;
        }
        // Check if reached end
        if (Number.isFinite(this.duration) && t >= this.duration) {
            this.stop();
            this.stalled = false;
            this.events.emit('ended');
            this.events.emit('pause');
            this.events.emit('canplay');
            return;
        }
        // Render next frame if ready
        if (this.nextFrame && this.nextFrame.timestamp <= t) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.nextFrame.canvas, 0, 0);
            this.nextFrame = null;
            this.updateNextFrame(this.asyncId);
            if (this.stalled) {
                this.events.emit('canplay');
                this.events.emit('playing');
                this.stalled = false;
            }
        } else if (!this.nextFrame) {
            this.updateNextFrame(this.asyncId);
            if (!this.nextFrame && Number.isFinite(this.duration) && t < this.duration && !this.stalled) {
                this.stalled = true;
                this.events.emit('waiting');
            }
        }
        this.rafId = requestAnimationFrame(()=>this.render());
    }
    start(audioEngine) {
        this.audioClock = audioEngine;
        this.asyncId++;
        this.stalled = false;
        this.updateNextFrame(this.asyncId);
        this.rafId = requestAnimationFrame(()=>this.render());
    }
    stop() {
        cancelAnimationFrame(this.rafId);
    }
    async seek(time) {
        this.asyncId++;
        await this.resetIterator(time);
    }
    setPlaybackRate(rate) {
        this.playbackRate = Math.max(0.1, Number(rate) || 1);
    }
    destroy() {
        this.asyncId++;
        this.stop();
        this.stopIterator();
        this.posterDrawn = false;
        this.input = null;
        this.videoSink = null;
    }
}
exports.default = VideoEngine;

},{"mediabunny":"6p2EH","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}]},["gqawh"], "gqawh", "parcelRequire4dc0", {})

//# sourceMappingURL=index.js.map
