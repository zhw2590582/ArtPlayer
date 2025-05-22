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
})({"eiaCd":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginAsr);
function artplayerPluginAsr(option = {}) {
    const { hideTimeout = 3000, interval = 100, sampleRate = 16000, onAudioChunk = ()=>null } = option;
    return (art)=>{
        let started = false;
        let audioCtx = null;
        let sourceNode = null;
        let recorderNode = null;
        let bufferChunks = [];
        let timer = null;
        let workletLoaded = false;
        let hideTimer = null;
        function hide() {
        //
        }
        function append(subtitle) {
            if (typeof subtitle !== 'string') return;
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hide, hideTimeout);
        }
        const recorderProcessorCode = `
            class RecorderProcessor extends AudioWorkletProcessor {
                process(inputs) {
                    const input = inputs[0];
                    if (input && input[0]) {
                        this.port.postMessage(input[0]);
                    }
                    return true;
                }
            }
            registerProcessor('recorder-processor', RecorderProcessor);
        `;
        const createWorkletBlobUrl = ()=>{
            const blob = new Blob([
                recorderProcessorCode
            ], {
                type: 'application/javascript'
            });
            return URL.createObjectURL(blob);
        };
        function floatTo16BitPCM(float32Array) {
            const len = float32Array.length;
            const buffer = new ArrayBuffer(len * 2);
            const view = new DataView(buffer);
            for(let i = 0; i < len; i++){
                let s = Math.max(-1, Math.min(1, float32Array[i]));
                view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
            }
            return buffer;
        }
        async function startCapture() {
            if (started) return;
            started = true;
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)({
                    sampleRate
                });
                if (audioCtx.state === 'suspended') await audioCtx.resume();
            }
            if (!sourceNode) try {
                sourceNode = audioCtx.createMediaElementSource(art.video);
                sourceNode.connect(audioCtx.destination);
            } catch (err) {
                console.warn('[artplayerPluginAsr] Failed to access audio stream:', err);
                return;
            }
            if (!workletLoaded) {
                const blobUrl = createWorkletBlobUrl();
                await audioCtx.audioWorklet.addModule(blobUrl);
                URL.revokeObjectURL(blobUrl);
                workletLoaded = true;
            }
            recorderNode = new AudioWorkletNode(audioCtx, 'recorder-processor');
            recorderNode.port.onmessage = (event)=>{
                bufferChunks.push(new Float32Array(event.data));
            };
            sourceNode.connect(recorderNode);
            recorderNode.connect(audioCtx.destination);
            const CHUNK_SAMPLES = sampleRate * (interval / 1000);
            timer = setInterval(async ()=>{
                if (bufferChunks.length === 0) return;
                let accumulated = new Float32Array(0);
                while(accumulated.length < CHUNK_SAMPLES && bufferChunks.length){
                    const next = bufferChunks.shift();
                    const tmp = new Float32Array(accumulated.length + next.length);
                    tmp.set(accumulated, 0);
                    tmp.set(next, accumulated.length);
                    accumulated = tmp;
                }
                if (accumulated.length < CHUNK_SAMPLES) return;
                const chunkToSend = accumulated.slice(0, CHUNK_SAMPLES);
                const pcm = floatTo16BitPCM(chunkToSend);
                const subtitle = await onAudioChunk(pcm);
                append(subtitle);
            }, interval);
        }
        function stopCapture() {
            if (!started) return;
            started = false;
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            if (recorderNode) {
                try {
                    recorderNode.disconnect();
                } catch  {}
                recorderNode = null;
            }
            bufferChunks = [];
        }
        art.on('play', startCapture);
        art.on('pause', stopCapture);
        art.on('destroy', stopCapture);
        return {
            name: 'artplayerPluginAsr',
            hide,
            append
        };
    };
}
if (typeof window !== 'undefined') window['artplayerPluginAsr'] = artplayerPluginAsr;

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

},{}]},["eiaCd"], "eiaCd", "parcelRequire4dc0", {})

//# sourceMappingURL=index.js.map
