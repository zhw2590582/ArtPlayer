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
})({"fIfgU":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginWebsr);
var _upscaler = require("./Upscaler");
var _upscalerDefault = parcelHelpers.interopDefault(_upscaler);
function artplayerPluginWebsr(option = {
    networkSize: "medium",
    compare: false
}) {
    return async (art)=>{
        const { $video, $player } = art.template;
        const $canvas = document.createElement("canvas");
        $player.appendChild($canvas);
        $canvas.style.position = "absolute";
        $canvas.style.zIndex = "11";
        $canvas.style.pointerEvents = "none";
        $canvas.style.top = "50%";
        $canvas.style.left = "50%";
        $canvas.style.transform = "translate(-50%, -50%)";
        function calcCanvasSize() {
            const videoElement = art.video;
            const containerWidth = $player.offsetWidth || 640;
            const containerHeight = $player.offsetHeight || 360;
            const videoWidth = videoElement.videoWidth || 640;
            const videoHeight = videoElement.videoHeight || 360;
            const aspectRatio = videoWidth / videoHeight;
            let displayWidth = containerWidth;
            let displayHeight = containerHeight;
            if (containerWidth / containerHeight > aspectRatio) displayWidth = containerHeight * aspectRatio;
            else displayHeight = containerWidth / aspectRatio;
            return {
                displayWidth,
                displayHeight
            };
        }
        const upscaler = new (0, _upscalerDefault.default)(option);
        upscaler.init();
        await upscaler.startRealtimeUpscale($video, $canvas, option.networkSize);
        // 初始化 canvas 显示尺寸
        const { displayWidth, displayHeight } = calcCanvasSize();
        $canvas.style.width = displayWidth + "px";
        $canvas.style.height = displayHeight + "px";
        // 对比模式
        let comparePosition = 50;
        let isDragging = false;
        // 创建对比手柄
        const $handler = document.createElement("div");
        $handler.style.position = "absolute";
        $handler.style.width = "3px";
        $handler.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
        $handler.style.cursor = "ew-resize";
        $handler.style.zIndex = "12";
        $handler.style.pointerEvents = "auto";
        $handler.style.display = option.compare ? "block" : "none";
        $handler.style.boxShadow = "0 0 4px rgba(0, 0, 0, 0.1)";
        if (option.compare) {
            $player.appendChild($handler);
            $handler.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            updateCompareMask();
        }
        function updateCompareMask() {
            if (option.compare) {
                const { displayWidth, displayHeight } = calcCanvasSize();
                const gradient = `linear-gradient(to right, transparent 0%, transparent ${comparePosition}%, black ${comparePosition}%, black 100%)`;
                $canvas.style.maskImage = gradient;
                const containerWidth = $player.offsetWidth || 640;
                const containerHeight = $player.offsetHeight || 360;
                const canvasLeft = (containerWidth - displayWidth) / 2;
                const canvasTop = (containerHeight - displayHeight) / 2;
                const handlerX = canvasLeft + displayWidth * comparePosition / 100;
                $handler.style.top = canvasTop + "px";
                $handler.style.left = handlerX + "px";
                $handler.style.height = displayHeight + "px";
                $handler.style.transform = "translateX(-50%)";
            } else $canvas.style.maskImage = "none";
        }
        function handleMouseDown(e) {
            if (option.compare) isDragging = true;
        }
        function handleMouseMove(e) {
            if (option.compare && isDragging) {
                const rect = $player.getBoundingClientRect();
                const { displayWidth } = calcCanvasSize();
                const containerWidth = $player.offsetWidth || 640;
                const canvasLeft = (containerWidth - displayWidth) / 2;
                const x = e.clientX - rect.left;
                const relativeX = x - canvasLeft;
                comparePosition = relativeX / displayWidth * 100;
                comparePosition = Math.max(0, Math.min(100, comparePosition));
                updateCompareMask();
            }
        }
        function handleMouseUp(e) {
            isDragging = false;
        }
        art.on("destroy", ()=>{
            upscaler.dispose();
            $handler.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        });
        art.on("resize", ()=>{
            const { displayWidth, displayHeight } = calcCanvasSize();
            $canvas.style.width = displayWidth + "px";
            $canvas.style.height = displayHeight + "px";
            updateCompareMask();
        });
        return {
            name: "artplayerPluginWebsr"
        };
    };
}
if (typeof window !== "undefined") window.artplayerPluginWebsr = artplayerPluginWebsr;

},{"./Upscaler":"d22Rz","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"d22Rz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Upscaler {
    static DEFAULT_TIMEOUTS = {
        IMAGE: 300000,
        VIDEO: 3600000,
        METADATA: 10000
    };
    static DEFAULT_DELAYS = {
        INIT: 500,
        NETWORK: 300
    };
    static isSupported() {
        try {
            const hasWorker = typeof Worker !== "undefined";
            const hasOffscreen = typeof OffscreenCanvas !== "undefined" || typeof document !== "undefined" && !!document.createElement("canvas").transferControlToOffscreen;
            const hasBlob = typeof Blob !== "undefined";
            return hasWorker && hasOffscreen && hasBlob;
        } catch  {
            return false;
        }
    }
    static isVideoSupported() {
        try {
            return typeof VideoEncoder !== "undefined" && typeof VideoDecoder !== "undefined";
        } catch  {
            return false;
        }
    }
    constructor(options = {}){
        const weightsBaseUrl = options.weightsBaseUrl || "/weights";
        this.networks = options.networks || {
            small: {
                name: "anime4k/cnn-2x-l",
                weightsUrl: `${weightsBaseUrl}/cnn-8.json`
            },
            medium: {
                name: "anime4k/cnn-2x-16",
                weightsUrl: `${weightsBaseUrl}/cnn-16.json`
            },
            large: {
                name: "anime4k/cnn-2x-28",
                weightsUrl: `${weightsBaseUrl}/cnn-28.json`
            }
        };
        this.networkSize = options.networkSize || "medium";
        this.weightsBaseUrl = weightsBaseUrl;
        this.workerUrl = options.workerUrl || "/worker/main.js";
        this.timeouts = {
            ...Upscaler.DEFAULT_TIMEOUTS,
            ...options.timeouts || {}
        };
        this.delays = {
            ...Upscaler.DEFAULT_DELAYS,
            ...options.delays || {}
        };
        this.imageScale = typeof options.imageScale === "number" && options.imageScale > 0 ? options.imageScale : 2;
        this.videoScale = typeof options.videoScale === "number" && options.videoScale > 0 ? options.videoScale : 2;
        this.weightsCache = new Map();
        this.workerInstance = null;
        this.messageHandlers = {};
        this.progressCallback = null;
        this.processingType = null;
        this.realtimeLoopId = null;
        this.realtimeState = null;
    }
    init({ prewarm = true } = {}) {
        if (!Upscaler.isSupported()) throw new Error("Upscaler is not supported in this environment");
        if (prewarm) this.getWorker().postMessage({
            cmd: "isSupported"
        });
        return this;
    }
    getWorker() {
        if (!this.workerInstance) {
            this.workerInstance = new Worker(this.workerUrl);
            this.workerInstance.onmessage = (event)=>this.handleWorkerMessage(event);
        }
        return this.workerInstance;
    }
    static extractProgressValue(data) {
        const value = data.data ?? data.progress ?? data.value ?? data.percentage;
        return typeof value === "number" ? Math.min(100, Math.max(0, Math.round(value))) : null;
    }
    handleBlobResponse(data) {
        const blobType = this.processingType === "video" ? "videoBlob" : "imageBlob";
        const handler = this.messageHandlers[blobType];
        if (data.data instanceof Blob && handler) handler({
            [blobType]: data.data
        });
    }
    requestBlob() {
        const cmd = this.processingType === "video" ? "getVideoBlob" : "getImageBlob";
        this.getWorker().postMessage({
            cmd
        });
    }
    handleWorkerMessage(event) {
        const { data } = event;
        if (!data.cmd) return;
        const { cmd } = data;
        if (cmd === "progress") {
            const progress = Upscaler.extractProgressValue(data);
            if (progress !== null && this.progressCallback) this.progressCallback(progress);
            if (this.messageHandlers.progress) this.messageHandlers.progress(data);
        } else if (cmd === "finished") {
            if (data.data instanceof Blob) this.handleBlobResponse(data);
            else this.requestBlob();
        } else if (this.messageHandlers[cmd]) this.messageHandlers[cmd](data);
    }
    async loadWeights(networkSize) {
        this.validateNetworkSize(networkSize);
        if (this.weightsCache.has(networkSize)) return this.weightsCache.get(networkSize);
        const network = this.networks[networkSize];
        const response = await fetch(network.weightsUrl);
        if (!response.ok) throw new Error(`Failed to fetch weights: ${response.statusText}`);
        const weights = await response.json();
        this.weightsCache.set(networkSize, weights);
        return weights;
    }
    static loadImageMetadata(arrayBuffer, mimeType) {
        return new Promise((resolve, reject)=>{
            const blob = new Blob([
                arrayBuffer
            ], {
                type: mimeType
            });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = ()=>{
                URL.revokeObjectURL(url);
                resolve({
                    width: img.width,
                    height: img.height
                });
            };
            img.onerror = ()=>{
                URL.revokeObjectURL(url);
                reject(new Error("Failed to load image"));
            };
            img.src = url;
        });
    }
    static loadVideoMetadata(file, timeoutMs) {
        return new Promise((resolve, reject)=>{
            const url = URL.createObjectURL(file);
            const video = document.createElement("video");
            video.src = url;
            const timeout = setTimeout(()=>reject(new Error("Timeout")), timeoutMs);
            video.onloadedmetadata = ()=>{
                clearTimeout(timeout);
                URL.revokeObjectURL(url);
                resolve({
                    width: video.videoWidth,
                    height: video.videoHeight,
                    duration: video.duration
                });
            };
            video.onerror = ()=>{
                clearTimeout(timeout);
                URL.revokeObjectURL(url);
                reject(new Error("Failed to load video"));
            };
        });
    }
    createOffscreenCanvas(width, height, scale = 2) {
        const factor = typeof scale === "number" && scale > 0 ? scale : 1;
        const canvas = document.createElement("canvas");
        canvas.width = width * factor;
        canvas.height = height * factor;
        if (typeof canvas.transferControlToOffscreen !== "function") throw new Error("OffscreenCanvas is not supported in this environment");
        return canvas.transferControlToOffscreen();
    }
    createBlobPromise(blobType, timeout) {
        return new Promise((resolve, reject)=>{
            const timeoutId = setTimeout(()=>{
                if (this.messageHandlers[blobType]) {
                    delete this.messageHandlers[blobType];
                    reject(new Error(`${blobType} processing timeout`));
                }
            }, timeout);
            this.messageHandlers[blobType] = (msg)=>{
                delete this.messageHandlers[blobType];
                clearTimeout(timeoutId);
                const blob = msg[blobType] || msg.data;
                if (blob instanceof Blob) resolve(blob);
                else reject(new Error(`Invalid ${blobType} format`));
            };
        });
    }
    validateNetworkSize(size) {
        if (!this.networks[size]) throw new Error("Invalid networkSize: use one of " + Object.keys(this.networks).join(", "));
    }
    async upscaleImage(imageFile, networkSize, scaleOverride) {
        if (!imageFile) throw new Error("Image file is required");
        const size = networkSize || this.networkSize;
        this.validateNetworkSize(size);
        this.processingType = "image";
        const arrayBuffer = await imageFile.arrayBuffer();
        const mimeType = imageFile.type || "image/jpeg";
        const { width, height } = await Upscaler.loadImageMetadata(arrayBuffer, mimeType);
        const weights = await this.loadWeights(size);
        const network = this.networks[size];
        const scale = typeof scaleOverride === "number" && scaleOverride > 0 ? scaleOverride : this.imageScale;
        const [canvasUp, canvasOrig] = [
            this.createOffscreenCanvas(width, height, scale),
            this.createOffscreenCanvas(width, height, 1)
        ];
        const blobPromise = this.createBlobPromise("imageBlob", this.timeouts.IMAGE);
        this.getWorker().postMessage({
            cmd: "init",
            data: {
                imageArrayBuffer: arrayBuffer,
                imageMimeType: mimeType,
                upscaled: canvasUp,
                original: canvasOrig,
                resolution: {
                    width,
                    height
                },
                network_name: network.name,
                weights
            }
        }, [
            canvasUp,
            canvasOrig
        ]);
        setTimeout(()=>{
            this.getWorker().postMessage({
                cmd: "network",
                data: {
                    name: network.name,
                    imageArrayBuffer: arrayBuffer,
                    imageMimeType: mimeType,
                    weights
                }
            });
            setTimeout(()=>{
                this.getWorker().postMessage({
                    cmd: "getImageBlob",
                    data: {
                        imageArrayBuffer: arrayBuffer,
                        imageMimeType: mimeType
                    }
                });
            }, this.delays.NETWORK);
        }, this.delays.INIT);
        return blobPromise;
    }
    async upscaleVideo(videoFile, networkSize, scaleOverride) {
        if (!videoFile) throw new Error("Video file is required");
        const size = networkSize || this.networkSize;
        this.validateNetworkSize(size);
        if (!Upscaler.isVideoSupported()) throw new Error("WebCodecs API not supported. Requires Chrome 94+");
        this.processingType = "video";
        const { width, height, duration } = await Upscaler.loadVideoMetadata(videoFile, this.timeouts.METADATA);
        const weights = await this.loadWeights(size);
        const network = this.networks[size];
        const scale = typeof scaleOverride === "number" && scaleOverride > 0 ? scaleOverride : this.videoScale;
        const [canvasOut, canvasIn] = [
            this.createOffscreenCanvas(width, height, scale),
            this.createOffscreenCanvas(width, height, 1)
        ];
        const blobPromise = this.createBlobPromise("videoBlob", this.timeouts.VIDEO);
        this.getWorker().postMessage({
            cmd: "process",
            file: videoFile,
            fileSize: videoFile.size,
            duration,
            adjustedResolution: {
                adjustedInputWidth: width,
                adjustedInputHeight: height,
                adjustedOutputWidth: width * scale,
                adjustedOutputHeight: height * scale
            },
            upscaled: canvasOut,
            original: canvasIn,
            weights,
            network_name: network.name,
            skipDemuxProgress: true
        }, [
            canvasOut,
            canvasIn
        ]);
        return blobPromise;
    }
    async startRealtimeUpscale(videoElement, canvasElement, networkSize, scaleOverride) {
        if (!videoElement || !canvasElement) throw new Error("videoElement and canvasElement are required");
        const size = networkSize || this.networkSize;
        this.validateNetworkSize(size);
        const network = this.networks[size];
        const weights = await this.loadWeights(size);
        const scale = typeof scaleOverride === "number" && scaleOverride > 0 ? scaleOverride : this.videoScale;
        const ensureMetadata = ()=>{
            return new Promise((resolve, reject)=>{
                if (videoElement.readyState >= 1) {
                    resolve();
                    return;
                }
                const onLoaded = ()=>{
                    cleanup();
                    resolve();
                };
                const onError = ()=>{
                    cleanup();
                    reject(new Error("Failed to load video metadata"));
                };
                const cleanup = ()=>{
                    videoElement.removeEventListener("loadedmetadata", onLoaded);
                    videoElement.removeEventListener("error", onError);
                };
                videoElement.addEventListener("loadedmetadata", onLoaded);
                videoElement.addEventListener("error", onError);
            });
        };
        await ensureMetadata();
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
        if (!width || !height) throw new Error("Invalid video dimensions");
        canvasElement.width = width * scale;
        canvasElement.height = height * scale;
        if (typeof canvasElement.transferControlToOffscreen !== "function") throw new Error("OffscreenCanvas is not supported in this environment");
        const offscreen = canvasElement.transferControlToOffscreen();
        if (this.realtimeLoopId) {
            cancelAnimationFrame(this.realtimeLoopId);
            this.realtimeLoopId = null;
        }
        this.getWorker().postMessage({
            cmd: "realtimeInit",
            data: {
                upscaled: offscreen,
                resolution: {
                    width,
                    height,
                    scale,
                    outputWidth: width * scale,
                    outputHeight: height * scale
                },
                network_name: network.name,
                weights
            }
        }, [
            offscreen
        ]);
        this.realtimeState = {
            running: true,
            video: videoElement,
            canvas: canvasElement,
            scale,
            busy: false,
            frameIndex: 0
        };
        const loop = async ()=>{
            if (!this.realtimeState || !this.realtimeState.running) return;
            const state = this.realtimeState;
            const v = state.video;
            if (!v.paused && !v.ended && !state.busy) {
                state.busy = true;
                try {
                    const frame = await createImageBitmap(v);
                    state.frameIndex += 1;
                    this.getWorker().postMessage({
                        cmd: "realtimeFrame",
                        frame
                    }, [
                        frame
                    ]);
                } catch (e) {
                    console.warn("realtimeFrame error", e);
                } finally{
                    if (this.realtimeState) this.realtimeState.busy = false;
                }
            }
            this.realtimeLoopId = requestAnimationFrame(loop);
        };
        this.realtimeLoopId = requestAnimationFrame(loop);
    }
    stopRealtimeUpscale() {
        if (this.realtimeLoopId) {
            cancelAnimationFrame(this.realtimeLoopId);
            this.realtimeLoopId = null;
        }
        if (this.realtimeState) {
            this.realtimeState.running = false;
            this.realtimeState = null;
        }
    }
    async downloadUpscaled(file, networkSize, filename = null) {
        const isVideo = file.type.startsWith("video");
        const size = networkSize || this.networkSize;
        const blob = isVideo ? await this.upscaleVideo(file, size) : await this.upscaleImage(file, size);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || `upscaled_${Date.now()}.${isVideo ? "mp4" : "png"}`;
        link.click();
        URL.revokeObjectURL(url);
        return blob;
    }
    getSupportedNetworks() {
        return Object.keys(this.networks);
    }
    static async getGPUCapability() {
        try {
            if (navigator.gpu) {
                const adapter = await navigator.gpu.requestAdapter();
                if (adapter) {
                    const buffer = adapter.limits.maxStorageBufferBindingSize / 512;
                    const texture = 67108864;
                    return Math.min(buffer, texture);
                }
            }
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl2");
            if (gl) return gl.getParameter(gl.MAX_TEXTURE_SIZE) ** 2;
            return 8388608;
        } catch  {
            return 8388608;
        }
    }
    static getBackendType() {
        try {
            if (navigator.gpu) return "webgpu";
            if (document.createElement("canvas").getContext("webgl2")) return "webgl";
            return "unknown";
        } catch  {
            return "unknown";
        }
    }
    getAppState() {
        return {
            backend: Upscaler.getBackendType(),
            isProcessing: false,
            progress: 0,
            width: 0,
            height: 0
        };
    }
    onProgress(callback) {
        if (typeof callback === "function") this.progressCallback = callback;
    }
    dispose() {
        this.stopRealtimeUpscale();
        if (this.workerInstance) {
            this.workerInstance.terminate();
            this.workerInstance = null;
        }
        this.messageHandlers = {};
        this.progressCallback = null;
        this.processingType = null;
        this.weightsCache.clear();
    }
}
exports.default = Upscaler;

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

},{}]},["fIfgU"], "fIfgU", "parcelRequire4dc0", {})

//# sourceMappingURL=index.js.map
