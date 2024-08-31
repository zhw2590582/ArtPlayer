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
})({"dz77T":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerProxyWebAV);
var _avCliper = require("@webav/av-cliper");
function artplayerProxyWebAV(opt = {}) {
    return (art)=>{
        const { option, constructor } = art;
        const { createElement, def } = constructor.utils;
        const canvas = createElement("canvas");
        const ctx = canvas.getContext("2d");
        let audioCtx;
        let gainNode;
        let clip = null;
        let audioSource = null;
        let intervalId = null;
        let seekTarget = null;
        let lastSeekTime = 0;
        const state = {
            playing: false,
            duration: 0,
            videoWidth: 0,
            videoHeight: 0,
            currentTime: 0,
            playbackRate: 1,
            paused: true,
            ended: false,
            readyState: 0,
            buffered: 0,
            muted: option.muted,
            volume: option.volume,
            autoplay: option.autoplay
        };
        function reset() {
            Object.assign(state, {
                playing: false,
                duration: 0,
                videoWidth: 0,
                videoHeight: 0,
                currentTime: 0,
                playbackRate: 1,
                paused: true,
                ended: false,
                readyState: 0,
                buffered: 0,
                muted: option.muted,
                volume: option.volume,
                autoplay: option.autoplay
            });
        }
        function stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            if (audioSource) {
                audioSource.stop();
                audioSource = null;
            }
        }
        function updateVolume() {
            if (gainNode) {
                const effectiveVolume = state.muted ? 0 : state.volume;
                gainNode.gain.setValueAtTime(effectiveVolume, audioCtx.currentTime);
            }
        }
        async function play() {
            if (!audioCtx) {
                audioCtx = new AudioContext();
                gainNode = audioCtx.createGain();
                gainNode.connect(audioCtx.destination);
            }
            let curTime = state.currentTime * 1e6;
            let startAt = 0;
            let first = true;
            let lastFrameTime = performance.now();
            stop();
            updateVolume();
            async function frameHandler() {
                if (!state.playing) return;
                const currentFrameTime = performance.now();
                const deltaTime = currentFrameTime - lastFrameTime;
                lastFrameTime = currentFrameTime;
                if (seekTarget !== null) {
                    curTime = seekTarget * 1e6;
                    seekTarget = null;
                    first = true;
                } else curTime += deltaTime * 1000 * state.playbackRate;
                state.currentTime = curTime / 1e6;
                const { state: clipState, video, audio } = await clip.tick(Math.round(curTime));
                art.emit("video:timeupdate", {
                    type: "timeupdate"
                });
                if (clipState === "done") {
                    stop();
                    state.ended = true;
                    state.playing = false;
                    state.paused = true;
                    art.emit("video:ended", {
                        type: "ended"
                    });
                    return;
                }
                if (video && clipState === "success") {
                    ctx.clearRect(0, 0, state.videoWidth, state.videoHeight);
                    ctx.drawImage(video, 0, 0, state.videoWidth, state.videoHeight);
                    video.close();
                }
                if (first) first = false;
                else if (audio?.[0]?.length) {
                    const buf = audioCtx.createBuffer(2, audio[0].length, 48000);
                    buf.copyToChannel(audio[0], 0);
                    buf.copyToChannel(audio[1], 1);
                    audioSource = audioCtx.createBufferSource();
                    audioSource.buffer = buf;
                    audioSource.connect(gainNode);
                    audioSource.playbackRate.setValueAtTime(state.playbackRate, audioCtx.currentTime);
                    startAt = Math.max(audioCtx.currentTime, startAt);
                    audioSource.start(startAt);
                    startAt += buf.duration / state.playbackRate;
                }
            }
            state.playing = true;
            state.paused = false;
            intervalId = setInterval(frameHandler, 1000 / 60); // 约60fps
        }
        async function preview(time) {
            const { video } = await clip.tick(time * 1e6);
            if (video) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                video.close();
            }
        }
        function resize() {
            const player = art.template?.$player;
            if (!player || option.autoSize) return;
            const aspectRatio = canvas.videoWidth / canvas.videoHeight;
            const containerWidth = player.clientWidth;
            const containerHeight = player.clientHeight;
            const containerRatio = containerWidth / containerHeight;
            let paddingLeft = 0;
            let paddingTop = 0;
            if (containerRatio > aspectRatio) {
                const canvasWidth = containerHeight * aspectRatio;
                paddingLeft = (containerWidth - canvasWidth) / 2;
            } else {
                const canvasHeight = containerWidth / aspectRatio;
                paddingTop = (containerHeight - canvasHeight) / 2;
            }
            Object.assign(canvas.style, {
                padding: `${paddingTop}px ${paddingLeft}px`
            });
        }
        async function init() {
            const isSupported = await (0, _avCliper.Combinator).isSupported();
            if (!isSupported) {
                art.notice.show = "WebAV is not supported";
                throw new Error("WebAV is not supported");
            }
            stop();
            reset();
            if (clip) {
                clip.destroy();
                art.emit("video:abort", {
                    type: "abort"
                });
                art.emit("video:emptied", {
                    type: "emptied"
                });
            }
            try {
                await Promise.resolve();
                state.readyState = 1;
                art.emit("video:loadstart", {
                    type: "loadstart"
                });
                const response = await fetch(option.url);
                if (!response.body) throw new Error("No response body");
                clip = new (0, _avCliper.MP4Clip)(response.body, opt);
            } catch (error) {
                state.readyState = 0;
                art.emit("video:error", error);
                throw error;
            }
            const info = await clip.ready;
            Object.assign(state, {
                readyState: 4,
                duration: Math.round(info.duration / 1e6),
                videoWidth: info.width,
                videoHeight: info.height
            });
            canvas.width = state.videoWidth;
            canvas.height = state.videoHeight;
            await preview(0.1);
            resize();
            art.emit("video:loadedmetadata", {
                type: "loadedmetadata"
            });
            art.emit("video:durationchange", {
                type: "durationchange"
            });
            art.emit("video:loadeddata", {
                type: "loadeddata"
            });
            art.emit("video:canplay", {
                type: "canplay"
            });
            art.emit("video:canplaythrough", {
                type: "canplaythrough"
            });
        }
        def(canvas, "duration", {
            get: ()=>state.duration
        });
        def(canvas, "videoWidth", {
            get: ()=>state.videoWidth
        });
        def(canvas, "videoHeight", {
            get: ()=>state.videoHeight
        });
        def(canvas, "volume", {
            get: ()=>state.volume,
            set: (val)=>{
                state.volume = Math.max(0, Math.min(1, val));
                updateVolume();
                art.emit("video:volumechange", {
                    type: "volumechange"
                });
            }
        });
        def(canvas, "currentTime", {
            get: ()=>state.currentTime,
            set: (val)=>{
                if (state.readyState < 4) return;
                const newTime = Math.max(0, Math.min(val, state.duration));
                const now = performance.now();
                if (now - lastSeekTime > 16) {
                    lastSeekTime = now;
                    seekTarget = newTime;
                    state.currentTime = newTime;
                    if (!state.playing) preview(newTime);
                    art.emit("video:timeupdate", {
                        type: "timeupdate"
                    });
                }
            }
        });
        def(canvas, "autoplay", {
            get: ()=>state.autoplay,
            set: (val)=>{
                state.autoplay = val;
                if (val && state.readyState >= 4) canvas.play();
            }
        });
        def(canvas, "src", {
            get: ()=>option.url,
            set: (val)=>{
                option.url = val;
                init().then(()=>{
                    if (option.autoplay) canvas.play();
                });
            }
        });
        def(canvas, "playbackRate", {
            get: ()=>state.playbackRate,
            set: (val)=>{
                state.playbackRate = Math.max(0.25, Math.min(2, val));
                if (audioSource) audioSource.playbackRate.setValueAtTime(state.playbackRate, audioCtx.currentTime);
                art.emit("video:ratechange", {
                    type: "ratechange"
                });
            }
        });
        def(canvas, "playing", {
            get: ()=>state.playing
        });
        def(canvas, "paused", {
            get: ()=>state.paused
        });
        def(canvas, "ended", {
            get: ()=>state.ended
        });
        def(canvas, "readyState", {
            get: ()=>state.readyState
        });
        def(canvas, "muted", {
            get: ()=>state.muted,
            set: (val)=>{
                state.muted = val;
                updateVolume();
                art.emit("video:volumechange", {
                    type: "volumechange"
                });
            }
        });
        def(canvas, "buffered", {
            get: ()=>({
                    start: ()=>0,
                    end: ()=>state.buffered,
                    length: 1
                })
        });
        def(canvas, "play", {
            value: async ()=>{
                if (state.readyState < 4) return false;
                await play();
                art.emit("video:play", {
                    type: "play"
                });
                art.emit("video:playing", {
                    type: "playing"
                });
                return true;
            }
        });
        def(canvas, "pause", {
            value: ()=>{
                stop();
                state.playing = false;
                state.paused = true;
                art.emit("video:pause", {
                    type: "pause"
                });
            }
        });
        art.on("destroy", ()=>{
            stop();
            if (clip) clip.destroy();
        });
        art.on("resize", resize);
        return canvas;
    };
}
if (typeof window !== "undefined") window["artplayerProxyWebAV"] = artplayerProxyWebAV;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6","@webav/av-cliper":"129Y5"}],"5dUr6":[function(require,module,exports) {
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
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
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

},{}],"129Y5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "AudioClip", ()=>Ci);
parcelHelpers.export(exports, "Combinator", ()=>Sn);
parcelHelpers.export(exports, "DEFAULT_AUDIO_CONF", ()=>D);
parcelHelpers.export(exports, "EmbedSubtitlesClip", ()=>ts);
parcelHelpers.export(exports, "EventTool", ()=>Je);
parcelHelpers.export(exports, "ImgClip", ()=>Qi);
parcelHelpers.export(exports, "Log", ()=>B);
parcelHelpers.export(exports, "MP4Clip", ()=>Ki);
parcelHelpers.export(exports, "MediaStreamClip", ()=>Ji);
parcelHelpers.export(exports, "OffscreenSprite", ()=>ns);
parcelHelpers.export(exports, "Rect", ()=>Fi);
parcelHelpers.export(exports, "VisibleSprite", ()=>vn);
parcelHelpers.export(exports, "adjustAudioDataVolume", ()=>_n);
parcelHelpers.export(exports, "audioResample", ()=>fr);
parcelHelpers.export(exports, "autoReadStream", ()=>mi);
parcelHelpers.export(exports, "concatAudioClip", ()=>gn);
parcelHelpers.export(exports, "concatFloat32Array", ()=>ms);
parcelHelpers.export(exports, "concatPCMFragments", ()=>ys);
parcelHelpers.export(exports, "createChromakey", ()=>wn);
parcelHelpers.export(exports, "createEl", ()=>Ds);
parcelHelpers.export(exports, "createHLSLoader", ()=>bn);
parcelHelpers.export(exports, "decodeImg", ()=>lr);
parcelHelpers.export(exports, "extractPCM4AudioBuffer", ()=>Di);
parcelHelpers.export(exports, "extractPCM4AudioData", ()=>Ri);
parcelHelpers.export(exports, "fastConcatMP4", ()=>Or);
parcelHelpers.export(exports, "file2stream", ()=>As);
parcelHelpers.export(exports, "fixFMP4Duration", ()=>mn);
parcelHelpers.export(exports, "mixinMP4AndAudio", ()=>yn);
parcelHelpers.export(exports, "mixinPCM", ()=>Ai);
parcelHelpers.export(exports, "recodemux", ()=>Rr);
parcelHelpers.export(exports, "renderTxt2Img", ()=>zs);
parcelHelpers.export(exports, "renderTxt2ImgBitmap", ()=>pn);
parcelHelpers.export(exports, "ringSliceFloat32Array", ()=>Ii);
parcelHelpers.export(exports, "workerTimer", ()=>_s);
var global = arguments[3];
var Buffer = require("718a311db185ef08").Buffer;
var Ps = Object.defineProperty;
var Gi = (l)=>{
    throw TypeError(l);
};
var Rs = (l, n, o)=>n in l ? Ps(l, n, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: o
    }) : l[n] = o;
var F = (l, n, o)=>Rs(l, typeof n != "symbol" ? n + "" : n, o), bi = (l, n, o)=>n.has(l) || Gi("Cannot " + o);
var p = (l, n, o)=>(bi(l, n, "read from private field"), o ? o.call(l) : n.get(l)), U = (l, n, o)=>n.has(l) ? Gi("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(l) : n.set(l, o), x = (l, n, o, r)=>(bi(l, n, "write to private field"), r ? r.call(l, o) : n.set(l, o), o), H = (l, n, o)=>(bi(l, n, "access private method"), o);
function Ds(l) {
    return document.createElement(l);
}
function zs(l, n) {
    const o = Ds("pre");
    o.style.cssText = `margin: 0; ${n}; visibility: hidden; position: fixed;`, o.textContent = l, document.body.appendChild(o);
    const { width: r, height: d } = o.getBoundingClientRect();
    o.remove(), o.style.visibility = "visible";
    const c = new Image();
    c.width = r, c.height = d;
    const u = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${d}">
    <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${o.outerHTML}</div>
    </foreignObject>
    </svg>
  `.replace(/\t/g, "").replace(/#/g, "%23");
    return c.src = `data:image/svg+xml;charset=utf-8,${u}`, c;
}
async function pn(l, n) {
    const o = zs(l, n);
    await new Promise((c)=>{
        o.onload = c;
    });
    const r = new OffscreenCanvas(o.width, o.height), d = r.getContext("2d");
    return d == null || d.drawImage(o, 0, 0, o.width, o.height), await createImageBitmap(r);
}
var as = (l)=>{
    throw TypeError(l);
}, os = (l, n, o)=>n.has(l) || as("Cannot " + o), P = (l, n, o)=>(os(l, n, "read from private field"), o ? o.call(l) : n.get(l)), Q = (l, n, o)=>n.has(l) ? as("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(l) : n.set(l, o), K = (l, n, o, r)=>(os(l, n, "write to private field"), n.set(l, o), o);
const hs = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIHUobil7aWYobj09PSIvIilyZXR1cm57cGFyZW50Om51bGwsbmFtZToiIn07Y29uc3QgZT1uLnNwbGl0KCIvIikuZmlsdGVyKGk9PmkubGVuZ3RoPjApO2lmKGUubGVuZ3RoPT09MCl0aHJvdyBFcnJvcigiSW52YWxpZCBwYXRoIik7Y29uc3QgYT1lW2UubGVuZ3RoLTFdLHI9Ii8iK2Uuc2xpY2UoMCwtMSkuam9pbigiLyIpO3JldHVybntuYW1lOmEscGFyZW50OnJ9fWFzeW5jIGZ1bmN0aW9uIHcobixlKXtjb25zdHtwYXJlbnQ6YSxuYW1lOnJ9PXUobik7aWYoYT09bnVsbClyZXR1cm4gYXdhaXQgbmF2aWdhdG9yLnN0b3JhZ2UuZ2V0RGlyZWN0b3J5KCk7Y29uc3QgaT1hLnNwbGl0KCIvIikuZmlsdGVyKHQ9PnQubGVuZ3RoPjApO3RyeXtsZXQgdD1hd2FpdCBuYXZpZ2F0b3Iuc3RvcmFnZS5nZXREaXJlY3RvcnkoKTtmb3IoY29uc3QgcyBvZiBpKXQ9YXdhaXQgdC5nZXREaXJlY3RvcnlIYW5kbGUocyx7Y3JlYXRlOmUuY3JlYXRlfSk7aWYoZS5pc0ZpbGUpcmV0dXJuIGF3YWl0IHQuZ2V0RmlsZUhhbmRsZShyLHtjcmVhdGU6ZS5jcmVhdGV9KX1jYXRjaCh0KXtpZih0Lm5hbWU9PT0iTm90Rm91bmRFcnJvciIpcmV0dXJuIG51bGw7dGhyb3cgdH19Y29uc3QgZj17fTtzZWxmLm9ubWVzc2FnZT1hc3luYyBuPT57dmFyIGk7Y29uc3R7ZXZ0VHlwZTplLGFyZ3M6YX09bi5kYXRhO2xldCByPWZbYS5maWxlSWRdO3RyeXtsZXQgdDtjb25zdCBzPVtdO2lmKGU9PT0icmVnaXN0ZXIiKXtjb25zdCBsPWF3YWl0IHcoYS5maWxlUGF0aCx7Y3JlYXRlOiEwLGlzRmlsZTohMH0pO2lmKGw9PW51bGwpdGhyb3cgRXJyb3IoYG5vdCBmb3VuZCBmaWxlOiAke2EuZmlsZUlkfWApO3I9YXdhaXQgbC5jcmVhdGVTeW5jQWNjZXNzSGFuZGxlKHttb2RlOmEubW9kZX0pLGZbYS5maWxlSWRdPXJ9ZWxzZSBpZihlPT09ImNsb3NlIilhd2FpdCByLmNsb3NlKCksZGVsZXRlIGZbYS5maWxlSWRdO2Vsc2UgaWYoZT09PSJ0cnVuY2F0ZSIpYXdhaXQgci50cnVuY2F0ZShhLm5ld1NpemUpO2Vsc2UgaWYoZT09PSJ3cml0ZSIpe2NvbnN0e2RhdGE6bCxvcHRzOm99PW4uZGF0YS5hcmdzO3Q9YXdhaXQgci53cml0ZShsLG8pfWVsc2UgaWYoZT09PSJyZWFkIil7Y29uc3R7b2Zmc2V0Omwsc2l6ZTpvfT1uLmRhdGEuYXJncyxnPW5ldyBVaW50OEFycmF5KG8pLGQ9YXdhaXQgci5yZWFkKGcse2F0Omx9KSxjPWcuYnVmZmVyO3Q9ZD09PW8/YzooKGk9Yy50cmFuc2Zlcik9PW51bGw/dm9pZCAwOmkuY2FsbChjLGQpKT8/Yy5zbGljZSgwLGQpLHMucHVzaCh0KX1lbHNlIGU9PT0iZ2V0U2l6ZSI/dD1hd2FpdCByLmdldFNpemUoKTplPT09ImZsdXNoIiYmYXdhaXQgci5mbHVzaCgpO3NlbGYucG9zdE1lc3NhZ2Uoe2V2dFR5cGU6ImNhbGxiYWNrIixjYklkOm4uZGF0YS5jYklkLHJldHVyblZhbDp0fSxzKX1jYXRjaCh0KXtjb25zdCBzPXQ7c2VsZi5wb3N0TWVzc2FnZSh7ZXZ0VHlwZToidGhyb3dFcnJvciIsY2JJZDpuLmRhdGEuY2JJZCxlcnJNc2c6cy5uYW1lKyI6ICIrcy5tZXNzYWdlK2AKYCtKU09OLnN0cmluZ2lmeShuLmRhdGEpfSl9fX0pKCk7Ci8vIyBzb3VyY2VNYXBwaW5nVVJMPW9wZnMtd29ya2VyLUY0UldscWNfLmpzLm1hcAo=", Ls = (l)=>Uint8Array.from(atob(l), (n)=>n.charCodeAt(0)), Yi = typeof self < "u" && self.Blob && new Blob([
    Ls(hs)
], {
    type: "text/javascript;charset=utf-8"
});
function ks(l) {
    let n;
    try {
        if (n = Yi && (self.URL || self.webkitURL).createObjectURL(Yi), !n) throw "";
        const o = new Worker(n, {
            name: l == null ? void 0 : l.name
        });
        return o.addEventListener("error", ()=>{
            (self.URL || self.webkitURL).revokeObjectURL(n);
        }), o;
    } catch  {
        return new Worker("data:text/javascript;base64," + hs, {
            name: l == null ? void 0 : l.name
        });
    } finally{
        n && (self.URL || self.webkitURL).revokeObjectURL(n);
    }
}
async function Os(l, n, o) {
    const r = Ns();
    return await r("register", {
        fileId: l,
        filePath: n,
        mode: o
    }), {
        read: async (d, c)=>await r("read", {
                fileId: l,
                offset: d,
                size: c
            }),
        write: async (d, c)=>await r("write", {
                fileId: l,
                data: d,
                opts: c
            }, [
                ArrayBuffer.isView(d) ? d.buffer : d
            ]),
        close: async ()=>await r("close", {
                fileId: l
            }),
        truncate: async (d)=>await r("truncate", {
                fileId: l,
                newSize: d
            }),
        getSize: async ()=>await r("getSize", {
                fileId: l
            }),
        flush: async ()=>await r("flush", {
                fileId: l
            })
    };
}
const ei = [];
let wi = 0;
function Ns() {
    if (ei.length < 3) {
        const n = l();
        return ei.push(n), n;
    } else {
        const n = ei[wi];
        return wi = (wi + 1) % ei.length, n;
    }
    function l() {
        const n = new ks();
        let o = 0, r = {};
        return n.onmessage = ({ data: d })=>{
            var c, u;
            d.evtType === "callback" ? (c = r[d.cbId]) == null || c.resolve(d.returnVal) : d.evtType === "throwError" && ((u = r[d.cbId]) == null || u.reject(Error(d.errMsg))), delete r[d.cbId];
        }, async function(d, c, u = []) {
            o += 1;
            const a = new Promise((y, v)=>{
                r[o] = {
                    resolve: y,
                    reject: v
                };
            });
            return n.postMessage({
                cbId: o,
                evtType: d,
                args: c
            }, u), a;
        };
    }
}
function gi(l) {
    if (l === "/") return {
        parent: null,
        name: ""
    };
    const n = l.split("/").filter((d)=>d.length > 0);
    if (n.length === 0) throw Error("Invalid path");
    const o = n[n.length - 1], r = "/" + n.slice(0, -1).join("/");
    return {
        name: o,
        parent: r
    };
}
async function kt(l, n) {
    const { parent: o, name: r } = gi(l);
    if (o == null) return await navigator.storage.getDirectory();
    const d = o.split("/").filter((c)=>c.length > 0);
    try {
        let c = await navigator.storage.getDirectory();
        for (const u of d)c = await c.getDirectoryHandle(u, {
            create: n.create
        });
        return n.isFile ? await c.getFileHandle(r, {
            create: n.create
        }) : await c.getDirectoryHandle(r, {
            create: n.create
        });
    } catch (c) {
        if (c.name === "NotFoundError") return null;
        throw c;
    }
}
async function ls(l) {
    const { parent: n, name: o } = gi(l);
    if (n == null) {
        const d = await navigator.storage.getDirectory();
        for await (const c of d.keys())await d.removeEntry(c, {
            recursive: !0
        });
        return;
    }
    const r = await kt(n, {
        create: !1,
        isFile: !1
    });
    r != null && await r.removeEntry(o, {
        recursive: !0
    });
}
function Ui(l, n) {
    return `${l}/${n}`.replace("//", "/");
}
function ae(l) {
    return new fs(l);
}
var it, ii, we;
class fs {
    constructor(n){
        Q(this, it), Q(this, ii), Q(this, we), K(this, it, n);
        const { parent: o, name: r } = gi(n);
        K(this, ii, r), K(this, we, o);
    }
    get kind() {
        return "dir";
    }
    get name() {
        return P(this, ii);
    }
    get path() {
        return P(this, it);
    }
    get parent() {
        return P(this, we) == null ? null : ae(P(this, we));
    }
    /**
   * Creates the directory.
   * return A promise that resolves when the directory is created.
   */ async create() {
        return await kt(P(this, it), {
            create: !0,
            isFile: !1
        }), ae(P(this, it));
    }
    /**
   * Checks if the directory exists.
   * return A promise that resolves to true if the directory exists, otherwise false.
   */ async exists() {
        return await kt(P(this, it), {
            create: !1,
            isFile: !1
        }) instanceof FileSystemDirectoryHandle;
    }
    /**
   * Removes the directory.
   * return A promise that resolves when the directory is removed.
   */ async remove() {
        for (const n of (await this.children()))try {
            await n.remove();
        } catch (o) {
            console.warn(o);
        }
        try {
            await ls(P(this, it));
        } catch (n) {
            console.warn(n);
        }
    }
    /**
   * Retrieves the children of the directory.
   * return A promise that resolves to an array of objects representing the children.
   */ async children() {
        const n = await kt(P(this, it), {
            create: !1,
            isFile: !1
        });
        if (n == null) return [];
        const o = [];
        for await (const r of n.values())o.push((r.kind === "file" ? ee : ae)(Ui(P(this, it), r.name)));
        return o;
    }
    /**
   * If the dest folder exists, copy the current directory into the dest folder;
   * if the dest folder does not exist, rename the current directory to dest name.
   */ async copyTo(n) {
        if (!await this.exists()) throw Error(`dir ${this.path} not exists`);
        const o = await n.exists() ? ae(Ui(n.path, this.name)) : n;
        return await o.create(), await Promise.all((await this.children()).map((r)=>r.copyTo(o))), o;
    }
    /**
   * move directory, copy then remove current
   */ async moveTo(n) {
        const o = await this.copyTo(n);
        return await this.remove(), o;
    }
}
it = /* @__PURE__ */ new WeakMap(), ii = /* @__PURE__ */ new WeakMap(), we = /* @__PURE__ */ new WeakMap();
const Vi = /* @__PURE__ */ new Map();
function ee(l, n = "rw") {
    if (n === "rw") {
        const o = Vi.get(l) ?? new ai(l, n);
        return Vi.set(l, o), o;
    }
    return new ai(l, n);
}
async function Te(l, n, o = {
    overwrite: !0
}) {
    if (n instanceof ai) {
        await Te(l, await n.stream(), o);
        return;
    }
    const r = await (l instanceof ai ? l : ee(l, "rw")).createWriter();
    try {
        if (o.overwrite && await r.truncate(0), n instanceof ReadableStream) {
            const d = n.getReader();
            for(;;){
                const { done: c, value: u } = await d.read();
                if (c) break;
                await r.write(u);
            }
        } else await r.write(n);
    } catch (d) {
        throw d;
    } finally{
        await r.close();
    }
}
let Ms = 0;
const Gs = ()=>++Ms;
var st, ve, si, Se, ri, Et, ni, xe;
const Ys = class ds {
    constructor(n, o){
        Q(this, st), Q(this, ve), Q(this, si), Q(this, Se), Q(this, ri), Q(this, Et, 0), Q(this, ni, /* @__PURE__ */ (()=>{
            let c = null;
            return ()=>(K(this, Et, P(this, Et) + 1), c ?? (c = new Promise(async (u, a)=>{
                    try {
                        const y = await Os(P(this, ri), P(this, st), P(this, Se));
                        u([
                            y,
                            async ()=>{
                                K(this, Et, P(this, Et) - 1), !(P(this, Et) > 0) && (c = null, await y.close());
                            }
                        ]);
                    } catch (y) {
                        a(y);
                    }
                })));
        })()), Q(this, xe, !1), K(this, ri, Gs()), K(this, st, n), K(this, Se, {
            r: "read-only",
            rw: "readwrite",
            "rw-unsafe": "readwrite-unsafe"
        }[o]);
        const { parent: r, name: d } = gi(n);
        K(this, si, d), K(this, ve, r);
    }
    get kind() {
        return "file";
    }
    get path() {
        return P(this, st);
    }
    get name() {
        return P(this, si);
    }
    get parent() {
        return P(this, ve) == null ? null : ae(P(this, ve));
    }
    /**
   * Random write to file
   */ async createWriter() {
        if (P(this, Se) === "read-only") throw Error("file is read-only");
        if (P(this, xe)) throw Error("Other writer have not been closed");
        K(this, xe, !0);
        const n = new TextEncoder(), [o, r] = await P(this, ni).call(this);
        let d = await o.getSize(), c = !1;
        return {
            write: async (u, a = {})=>{
                if (c) throw Error("Writer is closed");
                const y = typeof u == "string" ? n.encode(u) : u, v = a.at ?? d, b = y.byteLength;
                return d = v + b, await o.write(y, {
                    at: v
                });
            },
            truncate: async (u)=>{
                if (c) throw Error("Writer is closed");
                await o.truncate(u), d > u && (d = u);
            },
            flush: async ()=>{
                if (c) throw Error("Writer is closed");
                await o.flush();
            },
            close: async ()=>{
                if (c) throw Error("Writer is closed");
                c = !0, K(this, xe, !1), await r();
            }
        };
    }
    /**
   * Random access to file
   */ async createReader() {
        const [n, o] = await P(this, ni).call(this);
        let r = !1, d = 0;
        return {
            read: async (c, u = {})=>{
                if (r) throw Error("Reader is closed");
                const a = u.at ?? d, y = await n.read(a, c);
                return d = a + y.byteLength, y;
            },
            getSize: async ()=>{
                if (r) throw Error("Reader is closed");
                return await n.getSize();
            },
            close: async ()=>{
                r || (r = !0, await o());
            }
        };
    }
    async text() {
        return new TextDecoder().decode(await this.arrayBuffer());
    }
    async arrayBuffer() {
        const n = await kt(P(this, st), {
            create: !1,
            isFile: !0
        });
        return n == null ? new ArrayBuffer(0) : (await n.getFile()).arrayBuffer();
    }
    async stream() {
        const n = await this.getOriginFile();
        return n == null ? new ReadableStream({
            pull: (o)=>{
                o.close();
            }
        }) : n.stream();
    }
    async getOriginFile() {
        var n;
        return (n = await kt(P(this, st), {
            create: !1,
            isFile: !0
        })) == null ? void 0 : n.getFile();
    }
    async getSize() {
        const n = await kt(P(this, st), {
            create: !1,
            isFile: !0
        });
        return n == null ? 0 : (await n.getFile()).size;
    }
    async exists() {
        return await kt(P(this, st), {
            create: !1,
            isFile: !0
        }) instanceof FileSystemFileHandle;
    }
    async remove() {
        if (P(this, Et)) throw Error("exists unclosed reader/writer");
        await ls(P(this, st));
    }
    /**
   * If the target is a file, use current overwrite the target;
   * if the target is a folder, copy the current file into that folder.
   */ async copyTo(n) {
        if (!await this.exists()) throw Error(`file ${this.path} not exists`);
        if (n instanceof ds) return ee(n.path) === this ? this : (await Te(n.path, this), ee(n.path));
        if (n instanceof fs) return await this.copyTo(ee(Ui(n.path, this.name)));
        throw Error("Illegal target type");
    }
    /**
   * move file, copy then remove current
   */ async moveTo(n) {
        const o = await this.copyTo(n);
        return await this.remove(), o;
    }
};
st = /* @__PURE__ */ new WeakMap(), ve = /* @__PURE__ */ new WeakMap(), si = /* @__PURE__ */ new WeakMap(), Se = /* @__PURE__ */ new WeakMap(), ri = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), ni = /* @__PURE__ */ new WeakMap(), xe = /* @__PURE__ */ new WeakMap();
let ai = Ys;
const Pi = "/.opfs-tools-temp-dir";
async function cs(l) {
    try {
        if (l.kind === "file") {
            if (!await l.exists()) return !0;
            const n = await l.createWriter();
            await n.truncate(0), await n.close(), await l.remove();
        } else await l.remove();
        return !0;
    } catch (n) {
        return console.warn(n), !1;
    }
}
function Vs() {
    setInterval(async ()=>{
        for (const l of (await ae(Pi).children())){
            const n = /^\d+-(\d+)$/.exec(l.name);
            (n == null || Date.now() - Number(n[1]) > 2592e5) && await cs(l);
        }
    }, 60000);
}
const Ei = [];
let Hi = !1;
async function Hs() {
    if (globalThis.localStorage == null) return;
    const l = "OPFS_TOOLS_EXPIRES_TMP_FILES";
    Hi || (Hi = !0, globalThis.addEventListener("unload", ()=>{
        Ei.length !== 0 && localStorage.setItem(l, `${localStorage.getItem(l) ?? ""},${Ei.join(",")}`);
    }));
    let n = localStorage.getItem(l) ?? "";
    for (const o of n.split(","))o.length !== 0 && await cs(ee(`${Pi}/${o}`)) && (n = n.replace(o, ""));
    localStorage.setItem(l, n.replace(/,{2,}/g, ","));
}
(async function() {
    var l;
    globalThis.__opfs_tools_tmpfile_init__ !== !0 && (globalThis.__opfs_tools_tmpfile_init__ = !0, !(globalThis.FileSystemDirectoryHandle == null || globalThis.FileSystemFileHandle == null || ((l = globalThis.navigator) == null ? void 0 : l.storage.getDirectory) == null) && (Vs(), await Hs()));
})();
function oi() {
    const l = `${Math.random().toString().slice(2)}-${Date.now()}`;
    return Ei.push(l), ee(`${Pi}/${l}`);
}
function Xs(l) {
    return l instanceof Error ? String(l) : typeof l == "object" ? JSON.stringify(l, (n, o)=>o instanceof Error ? String(o) : o) : String(l);
}
function Ws() {
    const l = /* @__PURE__ */ new Date();
    return `${l.getHours()}:${l.getMinutes()}:${l.getSeconds()}.${l.getMilliseconds()}`;
}
let us = 1;
const ps = oi();
let ie = null;
const Xi = [
    "debug",
    "info",
    "warn",
    "error"
].reduce((l, n, o)=>Object.assign(l, {
        [n]: (...r)=>{
            us <= o && (console[n](...r), ie == null || ie.write(`[${n}][${Ws()}]  ${r.map((d)=>Xs(d)).join(" ")}
`));
        }
    }), {}), Qe = /* @__PURE__ */ new Map(), B = {
    /**
   * 设置记录日志的级别
   *
   * @example
   * Log.setLogLevel(Log.warn) // 记录 warn，error 日志
   */ setLogLevel: (l)=>{
        us = Qe.get(l) ?? 1;
    },
    ...Xi,
    /**
   * 生成一个 log 实例，所有输出前都会附加 tag
   *
   * @example
   * const log = Log.create('<prefix>')
   * log.info('xxx') // '<prefix> xxx'
   */ create: (l)=>Object.fromEntries(Object.entries(Xi).map(([n, o])=>[
                n,
                (...r)=>o(l, ...r)
            ])),
    /**
   * 将所有日志导出为一个字符串
   *
   * @example
   * Log.dump() // => [level][time]  内容...
   *
   */ async dump () {
        return await js, await (ie == null ? void 0 : ie.flush()), await ps.text();
    }
};
Qe.set(B.debug, 0);
Qe.set(B.info, 1);
Qe.set(B.warn, 2);
Qe.set(B.error, 3);
async function Zs() {
    try {
        ie = await ps.createWriter(), B.info(navigator.userAgent), B.info("date: " + /* @__PURE__ */ new Date().toLocaleDateString());
    } catch (l) {
        if (!(l instanceof Error)) throw l;
        if (l.message.includes("createSyncAccessHandle is not a function")) console.warn(l);
        else throw l;
    }
}
const js = globalThis.navigator == null ? null : Zs(), Ks = ()=>{
    let l, n = 16.6;
    self.onmessage = (o)=>{
        o.data.event === "start" && (self.clearInterval(l), l = self.setInterval(()=>{
            self.postMessage({});
        }, n)), o.data.event === "stop" && self.clearInterval(l);
    };
}, $s = ()=>{
    const l = new Blob([
        `(${Ks.toString()})()`
    ]), n = URL.createObjectURL(l);
    return new Worker(n);
}, re = /* @__PURE__ */ new Map();
let Ti = 1, Tt = null;
globalThis.Worker != null && (Tt = $s(), Tt.onmessage = ()=>{
    Ti += 1;
    for (const [l, n] of re)if (Ti % l === 0) for (const o of n)o();
});
const _s = (l, n)=>{
    const o = Math.round(n / 16.6), r = re.get(o) ?? /* @__PURE__ */ new Set();
    return r.add(l), re.set(o, r), re.size === 1 && r.size === 1 && (Tt == null || Tt.postMessage({
        event: "start"
    })), ()=>{
        r.delete(l), r.size === 0 && re.delete(o), re.size === 0 && (Ti = 0, Tt == null || Tt.postMessage({
            event: "stop"
        }));
    };
};
class qs {
    /**
   * @param {number} scaleFrom the length of the original array.
   * @param {number} scaleTo The length of the new array.
   * @param {?Object} details The extra configuration, if needed.
   */ constructor(n, o, r){
        this.length_ = n, this.scaleFactor_ = (n - 1) / o, this.interpolate = this.cubic, r.method === "point" ? this.interpolate = this.point : r.method === "linear" ? this.interpolate = this.linear : r.method === "sinc" && (this.interpolate = this.sinc), this.tangentFactor_ = 1 - Math.max(0, Math.min(1, r.tension || 0)), this.sincFilterSize_ = r.sincFilterSize || 1, this.kernel_ = Js(r.sincWindow || Qs);
    }
    /**
   * @param {number} t The index to interpolate.
   * @param {Array|TypedArray} samples the original array.
   * @return {number} The interpolated value.
   */ point(n, o) {
        return this.getClippedInput_(Math.round(this.scaleFactor_ * n), o);
    }
    /**
   * @param {number} t The index to interpolate.
   * @param {Array|TypedArray} samples the original array.
   * @return {number} The interpolated value.
   */ linear(n, o) {
        n = this.scaleFactor_ * n;
        let r = Math.floor(n);
        return n -= r, (1 - n) * this.getClippedInput_(r, o) + n * this.getClippedInput_(r + 1, o);
    }
    /**
   * @param {number} t The index to interpolate.
   * @param {Array|TypedArray} samples the original array.
   * @return {number} The interpolated value.
   */ cubic(n, o) {
        n = this.scaleFactor_ * n;
        let r = Math.floor(n), d = [
            this.getTangent_(r, o),
            this.getTangent_(r + 1, o)
        ], c = [
            this.getClippedInput_(r, o),
            this.getClippedInput_(r + 1, o)
        ];
        n -= r;
        let u = n * n, a = n * u;
        return (2 * a - 3 * u + 1) * c[0] + (a - 2 * u + n) * d[0] + (-2 * a + 3 * u) * c[1] + (a - u) * d[1];
    }
    /**
   * @param {number} t The index to interpolate.
   * @param {Array|TypedArray} samples the original array.
   * @return {number} The interpolated value.
   */ sinc(n, o) {
        n = this.scaleFactor_ * n;
        let r = Math.floor(n), d = r - this.sincFilterSize_ + 1, c = r + this.sincFilterSize_, u = 0;
        for(let a = d; a <= c; a++)u += this.kernel_(n - a) * this.getClippedInput_(a, o);
        return u;
    }
    /**
   * @param {number} k The scaled index to interpolate.
   * @param {Array|TypedArray} samples the original array.
   * @return {number} The tangent.
   * @private
   */ getTangent_(n, o) {
        return this.tangentFactor_ * (this.getClippedInput_(n + 1, o) - this.getClippedInput_(n - 1, o)) / 2;
    }
    /**
   * @param {number} t The scaled index to interpolate.
   * @param {Array|TypedArray} samples the original array.
   * @return {number} The interpolated value.
   * @private
   */ getClippedInput_(n, o) {
        return 0 <= n && n < this.length_ ? o[n] : 0;
    }
}
function Qs(l) {
    return Math.exp(-l / 2 * l / 2);
}
function Js(l) {
    return function(n) {
        return tr(n) * l(n);
    };
}
function tr(l) {
    return l === 0 ? 1 : Math.sin(Math.PI * l) / (Math.PI * l);
}
class er {
    /**
   * @param {number} order The order of the filter.
   * @param {number} sampleRate The sample rate.
   * @param {number} cutOff The cut off frequency.
   */ constructor(n, o, r){
        let d = 2 * Math.PI * r / o, c = 0;
        this.filters = [];
        for(let u = 0; u <= n; u++)u - n / 2 === 0 ? this.filters[u] = d : (this.filters[u] = Math.sin(d * (u - n / 2)) / (u - n / 2), this.filters[u] *= 0.54 - 0.46 * Math.cos(2 * Math.PI * u / n)), c = c + this.filters[u];
        for(let u = 0; u <= n; u++)this.filters[u] /= c;
        this.z = this.initZ_();
    }
    /**
   * @param {number} sample A sample of a sequence.
   * @return {number}
   */ filter(n) {
        this.z.buf[this.z.pointer] = n;
        let o = 0;
        for(let r = 0, d = this.z.buf.length; r < d; r++)o += this.filters[r] * this.z.buf[(this.z.pointer + r) % this.z.buf.length];
        return this.z.pointer = (this.z.pointer + 1) % this.z.buf.length, o;
    }
    /**
   * Reset the filter.
   */ reset() {
        this.z = this.initZ_();
    }
    /**
   * Return the default value for z.
   * @private
   */ initZ_() {
        let n = [];
        for(let o = 0; o < this.filters.length - 1; o++)n.push(0);
        return {
            buf: n,
            pointer: 0
        };
    }
}
class ir {
    /**
   * @param {number} order The order of the filter.
   * @param {number} sampleRate The sample rate.
   * @param {number} cutOff The cut off frequency.
   */ constructor(n, o, r){
        let d = [];
        for(let c = 0; c < n; c++)d.push(this.getCoeffs_({
            Fs: o,
            Fc: r,
            Q: 0.5 / Math.sin(Math.PI / (n * 2) * (c + 0.5))
        }));
        this.stages = [];
        for(let c = 0; c < d.length; c++)this.stages[c] = {
            b0: d[c].b[0],
            b1: d[c].b[1],
            b2: d[c].b[2],
            a1: d[c].a[0],
            a2: d[c].a[1],
            k: d[c].k,
            z: [
                0,
                0
            ]
        };
    }
    /**
   * @param {number} sample A sample of a sequence.
   * @return {number}
   */ filter(n) {
        let o = n;
        for(let r = 0, d = this.stages.length; r < d; r++)o = this.runStage_(r, o);
        return o;
    }
    getCoeffs_(n) {
        let o = {};
        o.z = [
            0,
            0
        ], o.a = [], o.b = [];
        let r = this.preCalc_(n, o);
        return o.k = 1, o.b.push((1 - r.cw) / (2 * r.a0)), o.b.push(2 * o.b[0]), o.b.push(o.b[0]), o;
    }
    preCalc_(n, o) {
        let r = {}, d = 2 * Math.PI * n.Fc / n.Fs;
        return r.alpha = Math.sin(d) / (2 * n.Q), r.cw = Math.cos(d), r.a0 = 1 + r.alpha, o.a0 = r.a0, o.a.push(-2 * r.cw / r.a0), o.k = 1, o.a.push((1 - r.alpha) / r.a0), r;
    }
    runStage_(n, o) {
        let r = o * this.stages[n].k - this.stages[n].a1 * this.stages[n].z[0] - this.stages[n].a2 * this.stages[n].z[1], d = this.stages[n].b0 * r + this.stages[n].b1 * this.stages[n].z[0] + this.stages[n].b2 * this.stages[n].z[1];
        return this.stages[n].z[1] = this.stages[n].z[0], this.stages[n].z[0] = r, d;
    }
    /**
   * Reset the filter.
   */ reset() {
        for(let n = 0; n < this.stages.length; n++)this.stages[n].z = [
            0,
            0
        ];
    }
}
const sr = {
    point: !1,
    linear: !1,
    cubic: !0,
    sinc: !0
}, Wi = {
    IIR: 16,
    FIR: 71
}, rr = {
    IIR: ir,
    FIR: er
};
function nr(l, n, o, r = {}) {
    let d = (o - n) / n + 1, c = new Float64Array(l.length * d);
    r.method = r.method || "cubic";
    let u = new qs(l.length, c.length, {
        method: r.method,
        tension: r.tension || 0,
        sincFilterSize: r.sincFilterSize || 6,
        sincWindow: r.sincWindow || void 0
    });
    if (r.LPF === void 0 && (r.LPF = sr[r.method]), r.LPF) {
        r.LPFType = r.LPFType || "IIR";
        const a = rr[r.LPFType];
        if (o > n) {
            let y = new a(r.LPFOrder || Wi[r.LPFType], o, n / 2);
            ar(l, c, u, y);
        } else {
            let y = new a(r.LPFOrder || Wi[r.LPFType], n, o / 2);
            or(l, c, u, y);
        }
    } else gs(l, c, u);
    return c;
}
function gs(l, n, o) {
    for(let r = 0, d = n.length; r < d; r++)n[r] = o.interpolate(r, l);
}
function ar(l, n, o, r) {
    for(let d = 0, c = n.length; d < c; d++)n[d] = r.filter(o.interpolate(d, l));
    r.reset();
    for(let d = n.length - 1; d >= 0; d--)n[d] = r.filter(n[d]);
}
function or(l, n, o, r) {
    for(let d = 0, c = l.length; d < c; d++)l[d] = r.filter(l[d]);
    r.reset();
    for(let d = l.length - 1; d >= 0; d--)l[d] = r.filter(l[d]);
    gs(l, n, o);
}
function ms(l) {
    const n = new Float32Array(l.map((r)=>r.length).reduce((r, d)=>r + d));
    let o = 0;
    for (const r of l)n.set(r, o), o += r.length;
    return n;
}
function ys(l) {
    const n = [];
    for(let o = 0; o < l.length; o += 1)for(let r = 0; r < l[o].length; r += 1)n[r] == null && (n[r] = []), n[r].push(l[o][r]);
    return n.map(ms);
}
function Ri(l) {
    if (l.format === "f32-planar") {
        const n = [];
        for(let o = 0; o < l.numberOfChannels; o += 1){
            const r = l.allocationSize({
                planeIndex: o
            }), d = new ArrayBuffer(r);
            l.copyTo(d, {
                planeIndex: o
            }), n.push(new Float32Array(d));
        }
        return n;
    } else if (l.format === "s16") {
        const n = new ArrayBuffer(l.allocationSize({
            planeIndex: 0
        }));
        return l.copyTo(n, {
            planeIndex: 0
        }), hr(new Int16Array(n), l.numberOfChannels);
    }
    throw Error("Unsupported audio data format");
}
function hr(l, n) {
    const o = l.length / n, r = Array.from({
        length: n
    }, ()=>new Float32Array(o));
    for(let d = 0; d < o; d++)for(let c = 0; c < n; c++){
        const u = l[d * n + c];
        r[c][d] = u / 32768;
    }
    return r;
}
function Di(l) {
    return Array(l.numberOfChannels).fill(0).map((n, o)=>l.getChannelData(o));
}
function _n(l, n) {
    const o = new Float32Array(ms(Ri(l))).map((d)=>d * n), r = new AudioData({
        sampleRate: l.sampleRate,
        numberOfChannels: l.numberOfChannels,
        timestamp: l.timestamp,
        format: l.format,
        numberOfFrames: l.numberOfFrames,
        data: o
    });
    return l.close(), r;
}
async function lr(l, n) {
    var u;
    const o = {
        type: n,
        data: l
    }, r = new ImageDecoder(o);
    await Promise.all([
        r.completed,
        r.tracks.ready
    ]);
    let d = ((u = r.tracks.selectedTrack) == null ? void 0 : u.frameCount) ?? 1;
    const c = [];
    for(let a = 0; a < d; a += 1)c.push((await r.decode({
        frameIndex: a
    })).image);
    return c;
}
function Ai(l) {
    var r, d;
    const n = Math.max(...l.map((c)=>{
        var u;
        return ((u = c[0]) == null ? void 0 : u.length) ?? 0;
    })), o = new Float32Array(n * 2);
    for(let c = 0; c < n; c++){
        let u = 0, a = 0;
        for(let y = 0; y < l.length; y++){
            const v = ((r = l[y][0]) == null ? void 0 : r[c]) ?? 0, b = ((d = l[y][1]) == null ? void 0 : d[c]) ?? v;
            u += v, a += b;
        }
        o[c] = u, o[c + n] = a;
    }
    return o;
}
async function fr(l, n, o) {
    const r = l.length, d = Array(o.chanCount).fill(0).map(()=>new Float32Array(0));
    if (r === 0) return d;
    const c = Math.max(...l.map((v)=>v.length));
    if (c === 0) return d;
    if (globalThis.OfflineAudioContext == null) return l.map((v)=>new Float32Array(nr(v, n, o.rate, {
            method: "sinc",
            LPF: !1
        })));
    const u = new globalThis.OfflineAudioContext(o.chanCount, c * o.rate / n, o.rate), a = u.createBufferSource(), y = u.createBuffer(r, c, n);
    return l.forEach((v, b)=>y.copyToChannel(v, b)), a.buffer = y, a.connect(u.destination), a.start(), Di(await u.startRendering());
}
function zi(l) {
    return new Promise((n)=>{
        const o = _s(()=>{
            o(), n();
        }, l);
    });
}
function Ii(l, n, o) {
    const r = o - n, d = new Float32Array(r);
    let c = 0;
    for(; c < r;)d[c] = l[(n + c) % l.length], c += 1;
    return d;
}
function mi(l, n) {
    let o = !1;
    async function r() {
        const d = l.getReader();
        for(; !o;){
            const { value: c, done: u } = await d.read();
            if (u) {
                n.onDone();
                return;
            }
            await n.onChunk(c);
        }
        d.releaseLock(), await l.cancel();
    }
    return r().catch(B.error), ()=>{
        o = !0;
    };
}
var Zi = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function bs(l) {
    return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var ws = {};
(function(l) {
    var n = /* @__PURE__ */ function() {
        var t = /* @__PURE__ */ new Date(), e = 4, s = 3, h = 2, f = 1, _ = e, g = {
            setLogLevel: function(m) {
                m == this.debug ? _ = f : m == this.info ? _ = h : m == this.warn ? _ = s : (this.error, _ = e);
            },
            debug: function(m, w) {
                console.debug === void 0 && (console.debug = console.log), f >= _ && console.debug("[" + n.getDurationString(/* @__PURE__ */ new Date() - t, 1e3) + "]", "[" + m + "]", w);
            },
            log: function(m, w) {
                this.debug(m.msg);
            },
            info: function(m, w) {
                h >= _ && console.info("[" + n.getDurationString(/* @__PURE__ */ new Date() - t, 1e3) + "]", "[" + m + "]", w);
            },
            warn: function(m, w) {
                s >= _ && console.warn("[" + n.getDurationString(/* @__PURE__ */ new Date() - t, 1e3) + "]", "[" + m + "]", w);
            },
            error: function(m, w) {
                e >= _ && console.error("[" + n.getDurationString(/* @__PURE__ */ new Date() - t, 1e3) + "]", "[" + m + "]", w);
            }
        };
        return g;
    }();
    n.getDurationString = function(t, e) {
        var s;
        function h(S, E) {
            for(var I = "" + S, R = I.split("."); R[0].length < E;)R[0] = "0" + R[0];
            return R.join(".");
        }
        t < 0 ? (s = !0, t = -t) : s = !1;
        var f = e || 1, _ = t / f, g = Math.floor(_ / 3600);
        _ -= g * 3600;
        var m = Math.floor(_ / 60);
        _ -= m * 60;
        var w = _ * 1e3;
        return _ = Math.floor(_), w -= _ * 1e3, w = Math.floor(w), (s ? "-" : "") + g + ":" + h(m, 2) + ":" + h(_, 2) + "." + h(w, 3);
    }, n.printRanges = function(t) {
        var e = t.length;
        if (e > 0) {
            for(var s = "", h = 0; h < e; h++)h > 0 && (s += ","), s += "[" + n.getDurationString(t.start(h)) + "," + n.getDurationString(t.end(h)) + "]";
            return s;
        } else return "(empty)";
    }, l.Log = n;
    var o = function(t) {
        if (t instanceof ArrayBuffer) this.buffer = t, this.dataview = new DataView(t);
        else throw "Needs an array buffer";
        this.position = 0;
    };
    o.prototype.getPosition = function() {
        return this.position;
    }, o.prototype.getEndPosition = function() {
        return this.buffer.byteLength;
    }, o.prototype.getLength = function() {
        return this.buffer.byteLength;
    }, o.prototype.seek = function(t) {
        var e = Math.max(0, Math.min(this.buffer.byteLength, t));
        return this.position = isNaN(e) || !isFinite(e) ? 0 : e, !0;
    }, o.prototype.isEos = function() {
        return this.getPosition() >= this.getEndPosition();
    }, o.prototype.readAnyInt = function(t, e) {
        var s = 0;
        if (this.position + t <= this.buffer.byteLength) {
            switch(t){
                case 1:
                    e ? s = this.dataview.getInt8(this.position) : s = this.dataview.getUint8(this.position);
                    break;
                case 2:
                    e ? s = this.dataview.getInt16(this.position) : s = this.dataview.getUint16(this.position);
                    break;
                case 3:
                    if (e) throw "No method for reading signed 24 bits values";
                    s = this.dataview.getUint8(this.position) << 16, s |= this.dataview.getUint8(this.position + 1) << 8, s |= this.dataview.getUint8(this.position + 2);
                    break;
                case 4:
                    e ? s = this.dataview.getInt32(this.position) : s = this.dataview.getUint32(this.position);
                    break;
                case 8:
                    if (e) throw "No method for reading signed 64 bits values";
                    s = this.dataview.getUint32(this.position) << 32, s |= this.dataview.getUint32(this.position + 4);
                    break;
                default:
                    throw "readInt method not implemented for size: " + t;
            }
            return this.position += t, s;
        } else throw "Not enough bytes in buffer";
    }, o.prototype.readUint8 = function() {
        return this.readAnyInt(1, !1);
    }, o.prototype.readUint16 = function() {
        return this.readAnyInt(2, !1);
    }, o.prototype.readUint24 = function() {
        return this.readAnyInt(3, !1);
    }, o.prototype.readUint32 = function() {
        return this.readAnyInt(4, !1);
    }, o.prototype.readUint64 = function() {
        return this.readAnyInt(8, !1);
    }, o.prototype.readString = function(t) {
        if (this.position + t <= this.buffer.byteLength) {
            for(var e = "", s = 0; s < t; s++)e += String.fromCharCode(this.readUint8());
            return e;
        } else throw "Not enough bytes in buffer";
    }, o.prototype.readCString = function() {
        for(var t = [];;){
            var e = this.readUint8();
            if (e !== 0) t.push(e);
            else break;
        }
        return String.fromCharCode.apply(null, t);
    }, o.prototype.readInt8 = function() {
        return this.readAnyInt(1, !0);
    }, o.prototype.readInt16 = function() {
        return this.readAnyInt(2, !0);
    }, o.prototype.readInt32 = function() {
        return this.readAnyInt(4, !0);
    }, o.prototype.readInt64 = function() {
        return this.readAnyInt(8, !1);
    }, o.prototype.readUint8Array = function(t) {
        for(var e = new Uint8Array(t), s = 0; s < t; s++)e[s] = this.readUint8();
        return e;
    }, o.prototype.readInt16Array = function(t) {
        for(var e = new Int16Array(t), s = 0; s < t; s++)e[s] = this.readInt16();
        return e;
    }, o.prototype.readUint16Array = function(t) {
        for(var e = new Int16Array(t), s = 0; s < t; s++)e[s] = this.readUint16();
        return e;
    }, o.prototype.readUint32Array = function(t) {
        for(var e = new Uint32Array(t), s = 0; s < t; s++)e[s] = this.readUint32();
        return e;
    }, o.prototype.readInt32Array = function(t) {
        for(var e = new Int32Array(t), s = 0; s < t; s++)e[s] = this.readInt32();
        return e;
    }, l.MP4BoxStream = o;
    var r = function(t, e, s) {
        this._byteOffset = e || 0, t instanceof ArrayBuffer ? this.buffer = t : typeof t == "object" ? (this.dataView = t, e && (this._byteOffset += e)) : this.buffer = new ArrayBuffer(t || 0), this.position = 0, this.endianness = s ?? r.LITTLE_ENDIAN;
    };
    r.prototype = {}, r.prototype.getPosition = function() {
        return this.position;
    }, r.prototype._realloc = function(t) {
        if (this._dynamicSize) {
            var e = this._byteOffset + this.position + t, s = this._buffer.byteLength;
            if (e <= s) {
                e > this._byteLength && (this._byteLength = e);
                return;
            }
            for(s < 1 && (s = 1); e > s;)s *= 2;
            var h = new ArrayBuffer(s), f = new Uint8Array(this._buffer), _ = new Uint8Array(h, 0, f.length);
            _.set(f), this.buffer = h, this._byteLength = e;
        }
    }, r.prototype._trimAlloc = function() {
        if (this._byteLength != this._buffer.byteLength) {
            var t = new ArrayBuffer(this._byteLength), e = new Uint8Array(t), s = new Uint8Array(this._buffer, 0, e.length);
            e.set(s), this.buffer = t;
        }
    }, r.BIG_ENDIAN = !1, r.LITTLE_ENDIAN = !0, r.prototype._byteLength = 0, Object.defineProperty(r.prototype, "byteLength", {
        get: function() {
            return this._byteLength - this._byteOffset;
        }
    }), Object.defineProperty(r.prototype, "buffer", {
        get: function() {
            return this._trimAlloc(), this._buffer;
        },
        set: function(t) {
            this._buffer = t, this._dataView = new DataView(this._buffer, this._byteOffset), this._byteLength = this._buffer.byteLength;
        }
    }), Object.defineProperty(r.prototype, "byteOffset", {
        get: function() {
            return this._byteOffset;
        },
        set: function(t) {
            this._byteOffset = t, this._dataView = new DataView(this._buffer, this._byteOffset), this._byteLength = this._buffer.byteLength;
        }
    }), Object.defineProperty(r.prototype, "dataView", {
        get: function() {
            return this._dataView;
        },
        set: function(t) {
            this._byteOffset = t.byteOffset, this._buffer = t.buffer, this._dataView = new DataView(this._buffer, this._byteOffset), this._byteLength = this._byteOffset + t.byteLength;
        }
    }), r.prototype.seek = function(t) {
        var e = Math.max(0, Math.min(this.byteLength, t));
        this.position = isNaN(e) || !isFinite(e) ? 0 : e;
    }, r.prototype.isEof = function() {
        return this.position >= this._byteLength;
    }, r.prototype.mapUint8Array = function(t) {
        this._realloc(t * 1);
        var e = new Uint8Array(this._buffer, this.byteOffset + this.position, t);
        return this.position += t * 1, e;
    }, r.prototype.readInt32Array = function(t, e) {
        t = t ?? this.byteLength - this.position / 4;
        var s = new Int32Array(t);
        return r.memcpy(s.buffer, 0, this.buffer, this.byteOffset + this.position, t * s.BYTES_PER_ELEMENT), r.arrayToNative(s, e ?? this.endianness), this.position += s.byteLength, s;
    }, r.prototype.readInt16Array = function(t, e) {
        t = t ?? this.byteLength - this.position / 2;
        var s = new Int16Array(t);
        return r.memcpy(s.buffer, 0, this.buffer, this.byteOffset + this.position, t * s.BYTES_PER_ELEMENT), r.arrayToNative(s, e ?? this.endianness), this.position += s.byteLength, s;
    }, r.prototype.readInt8Array = function(t) {
        t = t ?? this.byteLength - this.position;
        var e = new Int8Array(t);
        return r.memcpy(e.buffer, 0, this.buffer, this.byteOffset + this.position, t * e.BYTES_PER_ELEMENT), this.position += e.byteLength, e;
    }, r.prototype.readUint32Array = function(t, e) {
        t = t ?? this.byteLength - this.position / 4;
        var s = new Uint32Array(t);
        return r.memcpy(s.buffer, 0, this.buffer, this.byteOffset + this.position, t * s.BYTES_PER_ELEMENT), r.arrayToNative(s, e ?? this.endianness), this.position += s.byteLength, s;
    }, r.prototype.readUint16Array = function(t, e) {
        t = t ?? this.byteLength - this.position / 2;
        var s = new Uint16Array(t);
        return r.memcpy(s.buffer, 0, this.buffer, this.byteOffset + this.position, t * s.BYTES_PER_ELEMENT), r.arrayToNative(s, e ?? this.endianness), this.position += s.byteLength, s;
    }, r.prototype.readUint8Array = function(t) {
        t = t ?? this.byteLength - this.position;
        var e = new Uint8Array(t);
        return r.memcpy(e.buffer, 0, this.buffer, this.byteOffset + this.position, t * e.BYTES_PER_ELEMENT), this.position += e.byteLength, e;
    }, r.prototype.readFloat64Array = function(t, e) {
        t = t ?? this.byteLength - this.position / 8;
        var s = new Float64Array(t);
        return r.memcpy(s.buffer, 0, this.buffer, this.byteOffset + this.position, t * s.BYTES_PER_ELEMENT), r.arrayToNative(s, e ?? this.endianness), this.position += s.byteLength, s;
    }, r.prototype.readFloat32Array = function(t, e) {
        t = t ?? this.byteLength - this.position / 4;
        var s = new Float32Array(t);
        return r.memcpy(s.buffer, 0, this.buffer, this.byteOffset + this.position, t * s.BYTES_PER_ELEMENT), r.arrayToNative(s, e ?? this.endianness), this.position += s.byteLength, s;
    }, r.prototype.readInt32 = function(t) {
        var e = this._dataView.getInt32(this.position, t ?? this.endianness);
        return this.position += 4, e;
    }, r.prototype.readInt16 = function(t) {
        var e = this._dataView.getInt16(this.position, t ?? this.endianness);
        return this.position += 2, e;
    }, r.prototype.readInt8 = function() {
        var t = this._dataView.getInt8(this.position);
        return this.position += 1, t;
    }, r.prototype.readUint32 = function(t) {
        var e = this._dataView.getUint32(this.position, t ?? this.endianness);
        return this.position += 4, e;
    }, r.prototype.readUint16 = function(t) {
        var e = this._dataView.getUint16(this.position, t ?? this.endianness);
        return this.position += 2, e;
    }, r.prototype.readUint8 = function() {
        var t = this._dataView.getUint8(this.position);
        return this.position += 1, t;
    }, r.prototype.readFloat32 = function(t) {
        var e = this._dataView.getFloat32(this.position, t ?? this.endianness);
        return this.position += 4, e;
    }, r.prototype.readFloat64 = function(t) {
        var e = this._dataView.getFloat64(this.position, t ?? this.endianness);
        return this.position += 8, e;
    }, r.endianness = new Int8Array(new Int16Array([
        1
    ]).buffer)[0] > 0, r.memcpy = function(t, e, s, h, f) {
        var _ = new Uint8Array(t, e, f), g = new Uint8Array(s, h, f);
        _.set(g);
    }, r.arrayToNative = function(t, e) {
        return e == this.endianness ? t : this.flipArrayEndianness(t);
    }, r.nativeToEndian = function(t, e) {
        return this.endianness == e ? t : this.flipArrayEndianness(t);
    }, r.flipArrayEndianness = function(t) {
        for(var e = new Uint8Array(t.buffer, t.byteOffset, t.byteLength), s = 0; s < t.byteLength; s += t.BYTES_PER_ELEMENT)for(var h = s + t.BYTES_PER_ELEMENT - 1, f = s; h > f; h--, f++){
            var _ = e[f];
            e[f] = e[h], e[h] = _;
        }
        return t;
    }, r.prototype.failurePosition = 0, String.fromCharCodeUint8 = function(t) {
        for(var e = [], s = 0; s < t.length; s++)e[s] = t[s];
        return String.fromCharCode.apply(null, e);
    }, r.prototype.readString = function(t, e) {
        return e == null || e == "ASCII" ? String.fromCharCodeUint8.apply(null, [
            this.mapUint8Array(t ?? this.byteLength - this.position)
        ]) : new TextDecoder(e).decode(this.mapUint8Array(t));
    }, r.prototype.readCString = function(t) {
        var e = this.byteLength - this.position, s = new Uint8Array(this._buffer, this._byteOffset + this.position), h = e;
        t != null && (h = Math.min(t, e));
        for(var f = 0; f < h && s[f] !== 0; f++);
        var _ = String.fromCharCodeUint8.apply(null, [
            this.mapUint8Array(f)
        ]);
        return t != null ? this.position += h - f : f != e && (this.position += 1), _;
    };
    var d = Math.pow(2, 32);
    r.prototype.readInt64 = function() {
        return this.readInt32() * d + this.readUint32();
    }, r.prototype.readUint64 = function() {
        return this.readUint32() * d + this.readUint32();
    }, r.prototype.readInt64 = function() {
        return this.readUint32() * d + this.readUint32();
    }, r.prototype.readUint24 = function() {
        return (this.readUint8() << 16) + (this.readUint8() << 8) + this.readUint8();
    }, l.DataStream = r, r.prototype.save = function(t) {
        var e = new Blob([
            this.buffer
        ]);
        if (window.URL && URL.createObjectURL) {
            var s = window.URL.createObjectURL(e), h = document.createElement("a");
            document.body.appendChild(h), h.setAttribute("href", s), h.setAttribute("download", t), h.setAttribute("target", "_self"), h.click(), window.URL.revokeObjectURL(s);
        } else throw "DataStream.save: Can't create object URL.";
    }, r.prototype._dynamicSize = !0, Object.defineProperty(r.prototype, "dynamicSize", {
        get: function() {
            return this._dynamicSize;
        },
        set: function(t) {
            t || this._trimAlloc(), this._dynamicSize = t;
        }
    }), r.prototype.shift = function(t) {
        var e = new ArrayBuffer(this._byteLength - t), s = new Uint8Array(e), h = new Uint8Array(this._buffer, t, s.length);
        s.set(h), this.buffer = e, this.position -= t;
    }, r.prototype.writeInt32Array = function(t, e) {
        if (this._realloc(t.length * 4), t instanceof Int32Array && this.byteOffset + this.position % t.BYTES_PER_ELEMENT === 0) r.memcpy(this._buffer, this.byteOffset + this.position, t.buffer, 0, t.byteLength), this.mapInt32Array(t.length, e);
        else for(var s = 0; s < t.length; s++)this.writeInt32(t[s], e);
    }, r.prototype.writeInt16Array = function(t, e) {
        if (this._realloc(t.length * 2), t instanceof Int16Array && this.byteOffset + this.position % t.BYTES_PER_ELEMENT === 0) r.memcpy(this._buffer, this.byteOffset + this.position, t.buffer, 0, t.byteLength), this.mapInt16Array(t.length, e);
        else for(var s = 0; s < t.length; s++)this.writeInt16(t[s], e);
    }, r.prototype.writeInt8Array = function(t) {
        if (this._realloc(t.length * 1), t instanceof Int8Array && this.byteOffset + this.position % t.BYTES_PER_ELEMENT === 0) r.memcpy(this._buffer, this.byteOffset + this.position, t.buffer, 0, t.byteLength), this.mapInt8Array(t.length);
        else for(var e = 0; e < t.length; e++)this.writeInt8(t[e]);
    }, r.prototype.writeUint32Array = function(t, e) {
        if (this._realloc(t.length * 4), t instanceof Uint32Array && this.byteOffset + this.position % t.BYTES_PER_ELEMENT === 0) r.memcpy(this._buffer, this.byteOffset + this.position, t.buffer, 0, t.byteLength), this.mapUint32Array(t.length, e);
        else for(var s = 0; s < t.length; s++)this.writeUint32(t[s], e);
    }, r.prototype.writeUint16Array = function(t, e) {
        if (this._realloc(t.length * 2), t instanceof Uint16Array && this.byteOffset + this.position % t.BYTES_PER_ELEMENT === 0) r.memcpy(this._buffer, this.byteOffset + this.position, t.buffer, 0, t.byteLength), this.mapUint16Array(t.length, e);
        else for(var s = 0; s < t.length; s++)this.writeUint16(t[s], e);
    }, r.prototype.writeUint8Array = function(t) {
        if (this._realloc(t.length * 1), t instanceof Uint8Array && this.byteOffset + this.position % t.BYTES_PER_ELEMENT === 0) r.memcpy(this._buffer, this.byteOffset + this.position, t.buffer, 0, t.byteLength), this.mapUint8Array(t.length);
        else for(var e = 0; e < t.length; e++)this.writeUint8(t[e]);
    }, r.prototype.writeFloat64Array = function(t, e) {
        if (this._realloc(t.length * 8), t instanceof Float64Array && this.byteOffset + this.position % t.BYTES_PER_ELEMENT === 0) r.memcpy(this._buffer, this.byteOffset + this.position, t.buffer, 0, t.byteLength), this.mapFloat64Array(t.length, e);
        else for(var s = 0; s < t.length; s++)this.writeFloat64(t[s], e);
    }, r.prototype.writeFloat32Array = function(t, e) {
        if (this._realloc(t.length * 4), t instanceof Float32Array && this.byteOffset + this.position % t.BYTES_PER_ELEMENT === 0) r.memcpy(this._buffer, this.byteOffset + this.position, t.buffer, 0, t.byteLength), this.mapFloat32Array(t.length, e);
        else for(var s = 0; s < t.length; s++)this.writeFloat32(t[s], e);
    }, r.prototype.writeInt32 = function(t, e) {
        this._realloc(4), this._dataView.setInt32(this.position, t, e ?? this.endianness), this.position += 4;
    }, r.prototype.writeInt16 = function(t, e) {
        this._realloc(2), this._dataView.setInt16(this.position, t, e ?? this.endianness), this.position += 2;
    }, r.prototype.writeInt8 = function(t) {
        this._realloc(1), this._dataView.setInt8(this.position, t), this.position += 1;
    }, r.prototype.writeUint32 = function(t, e) {
        this._realloc(4), this._dataView.setUint32(this.position, t, e ?? this.endianness), this.position += 4;
    }, r.prototype.writeUint16 = function(t, e) {
        this._realloc(2), this._dataView.setUint16(this.position, t, e ?? this.endianness), this.position += 2;
    }, r.prototype.writeUint8 = function(t) {
        this._realloc(1), this._dataView.setUint8(this.position, t), this.position += 1;
    }, r.prototype.writeFloat32 = function(t, e) {
        this._realloc(4), this._dataView.setFloat32(this.position, t, e ?? this.endianness), this.position += 4;
    }, r.prototype.writeFloat64 = function(t, e) {
        this._realloc(8), this._dataView.setFloat64(this.position, t, e ?? this.endianness), this.position += 8;
    }, r.prototype.writeUCS2String = function(t, e, s) {
        s == null && (s = t.length);
        for(var h = 0; h < t.length && h < s; h++)this.writeUint16(t.charCodeAt(h), e);
        for(; h < s; h++)this.writeUint16(0);
    }, r.prototype.writeString = function(t, e, s) {
        var h = 0;
        if (e == null || e == "ASCII") {
            if (s != null) {
                var f = Math.min(t.length, s);
                for(h = 0; h < f; h++)this.writeUint8(t.charCodeAt(h));
                for(; h < s; h++)this.writeUint8(0);
            } else for(h = 0; h < t.length; h++)this.writeUint8(t.charCodeAt(h));
        } else this.writeUint8Array(new TextEncoder(e).encode(t.substring(0, s)));
    }, r.prototype.writeCString = function(t, e) {
        var s = 0;
        if (e != null) {
            var h = Math.min(t.length, e);
            for(s = 0; s < h; s++)this.writeUint8(t.charCodeAt(s));
            for(; s < e; s++)this.writeUint8(0);
        } else {
            for(s = 0; s < t.length; s++)this.writeUint8(t.charCodeAt(s));
            this.writeUint8(0);
        }
    }, r.prototype.writeStruct = function(t, e) {
        for(var s = 0; s < t.length; s += 2){
            var h = t[s + 1];
            this.writeType(h, e[t[s]], e);
        }
    }, r.prototype.writeType = function(t, e, s) {
        var h;
        if (typeof t == "function") return t(this, e);
        if (typeof t == "object" && !(t instanceof Array)) return t.set(this, e, s);
        var f = null, _ = "ASCII", g = this.position;
        switch(typeof t == "string" && /:/.test(t) && (h = t.split(":"), t = h[0], f = parseInt(h[1])), typeof t == "string" && /,/.test(t) && (h = t.split(","), t = h[0], _ = parseInt(h[1])), t){
            case "uint8":
                this.writeUint8(e);
                break;
            case "int8":
                this.writeInt8(e);
                break;
            case "uint16":
                this.writeUint16(e, this.endianness);
                break;
            case "int16":
                this.writeInt16(e, this.endianness);
                break;
            case "uint32":
                this.writeUint32(e, this.endianness);
                break;
            case "int32":
                this.writeInt32(e, this.endianness);
                break;
            case "float32":
                this.writeFloat32(e, this.endianness);
                break;
            case "float64":
                this.writeFloat64(e, this.endianness);
                break;
            case "uint16be":
                this.writeUint16(e, r.BIG_ENDIAN);
                break;
            case "int16be":
                this.writeInt16(e, r.BIG_ENDIAN);
                break;
            case "uint32be":
                this.writeUint32(e, r.BIG_ENDIAN);
                break;
            case "int32be":
                this.writeInt32(e, r.BIG_ENDIAN);
                break;
            case "float32be":
                this.writeFloat32(e, r.BIG_ENDIAN);
                break;
            case "float64be":
                this.writeFloat64(e, r.BIG_ENDIAN);
                break;
            case "uint16le":
                this.writeUint16(e, r.LITTLE_ENDIAN);
                break;
            case "int16le":
                this.writeInt16(e, r.LITTLE_ENDIAN);
                break;
            case "uint32le":
                this.writeUint32(e, r.LITTLE_ENDIAN);
                break;
            case "int32le":
                this.writeInt32(e, r.LITTLE_ENDIAN);
                break;
            case "float32le":
                this.writeFloat32(e, r.LITTLE_ENDIAN);
                break;
            case "float64le":
                this.writeFloat64(e, r.LITTLE_ENDIAN);
                break;
            case "cstring":
                this.writeCString(e, f);
                break;
            case "string":
                this.writeString(e, _, f);
                break;
            case "u16string":
                this.writeUCS2String(e, this.endianness, f);
                break;
            case "u16stringle":
                this.writeUCS2String(e, r.LITTLE_ENDIAN, f);
                break;
            case "u16stringbe":
                this.writeUCS2String(e, r.BIG_ENDIAN, f);
                break;
            default:
                if (t.length == 3) {
                    for(var m = t[1], w = 0; w < e.length; w++)this.writeType(m, e[w]);
                    break;
                } else {
                    this.writeStruct(t, e);
                    break;
                }
        }
        f != null && (this.position = g, this._realloc(f), this.position = g + f);
    }, r.prototype.writeUint64 = function(t) {
        var e = Math.floor(t / d);
        this.writeUint32(e), this.writeUint32(t & 4294967295);
    }, r.prototype.writeUint24 = function(t) {
        this.writeUint8((t & 16711680) >> 16), this.writeUint8((t & 65280) >> 8), this.writeUint8(t & 255);
    }, r.prototype.adjustUint32 = function(t, e) {
        var s = this.position;
        this.seek(t), this.writeUint32(e), this.seek(s);
    }, r.prototype.mapInt32Array = function(t, e) {
        this._realloc(t * 4);
        var s = new Int32Array(this._buffer, this.byteOffset + this.position, t);
        return r.arrayToNative(s, e ?? this.endianness), this.position += t * 4, s;
    }, r.prototype.mapInt16Array = function(t, e) {
        this._realloc(t * 2);
        var s = new Int16Array(this._buffer, this.byteOffset + this.position, t);
        return r.arrayToNative(s, e ?? this.endianness), this.position += t * 2, s;
    }, r.prototype.mapInt8Array = function(t) {
        this._realloc(t * 1);
        var e = new Int8Array(this._buffer, this.byteOffset + this.position, t);
        return this.position += t * 1, e;
    }, r.prototype.mapUint32Array = function(t, e) {
        this._realloc(t * 4);
        var s = new Uint32Array(this._buffer, this.byteOffset + this.position, t);
        return r.arrayToNative(s, e ?? this.endianness), this.position += t * 4, s;
    }, r.prototype.mapUint16Array = function(t, e) {
        this._realloc(t * 2);
        var s = new Uint16Array(this._buffer, this.byteOffset + this.position, t);
        return r.arrayToNative(s, e ?? this.endianness), this.position += t * 2, s;
    }, r.prototype.mapFloat64Array = function(t, e) {
        this._realloc(t * 8);
        var s = new Float64Array(this._buffer, this.byteOffset + this.position, t);
        return r.arrayToNative(s, e ?? this.endianness), this.position += t * 8, s;
    }, r.prototype.mapFloat32Array = function(t, e) {
        this._realloc(t * 4);
        var s = new Float32Array(this._buffer, this.byteOffset + this.position, t);
        return r.arrayToNative(s, e ?? this.endianness), this.position += t * 4, s;
    };
    var c = function(t) {
        this.buffers = [], this.bufferIndex = -1, t && (this.insertBuffer(t), this.bufferIndex = 0);
    };
    c.prototype = new r(new ArrayBuffer(), 0, r.BIG_ENDIAN), c.prototype.initialized = function() {
        var t;
        return this.bufferIndex > -1 ? !0 : this.buffers.length > 0 ? (t = this.buffers[0], t.fileStart === 0 ? (this.buffer = t, this.bufferIndex = 0, n.debug("MultiBufferStream", "Stream ready for parsing"), !0) : (n.warn("MultiBufferStream", "The first buffer should have a fileStart of 0"), this.logBufferLevel(), !1)) : (n.warn("MultiBufferStream", "No buffer to start parsing from"), this.logBufferLevel(), !1);
    }, ArrayBuffer.concat = function(t, e) {
        n.debug("ArrayBuffer", "Trying to create a new buffer of size: " + (t.byteLength + e.byteLength));
        var s = new Uint8Array(t.byteLength + e.byteLength);
        return s.set(new Uint8Array(t), 0), s.set(new Uint8Array(e), t.byteLength), s.buffer;
    }, c.prototype.reduceBuffer = function(t, e, s) {
        var h;
        return h = new Uint8Array(s), h.set(new Uint8Array(t, e, s)), h.buffer.fileStart = t.fileStart + e, h.buffer.usedBytes = 0, h.buffer;
    }, c.prototype.insertBuffer = function(t) {
        for(var e = !0, s = 0; s < this.buffers.length; s++){
            var h = this.buffers[s];
            if (t.fileStart <= h.fileStart) {
                if (t.fileStart === h.fileStart) {
                    if (t.byteLength > h.byteLength) {
                        this.buffers.splice(s, 1), s--;
                        continue;
                    } else n.warn("MultiBufferStream", "Buffer (fileStart: " + t.fileStart + " - Length: " + t.byteLength + ") already appended, ignoring");
                } else t.fileStart + t.byteLength <= h.fileStart || (t = this.reduceBuffer(t, 0, h.fileStart - t.fileStart)), n.debug("MultiBufferStream", "Appending new buffer (fileStart: " + t.fileStart + " - Length: " + t.byteLength + ")"), this.buffers.splice(s, 0, t), s === 0 && (this.buffer = t);
                e = !1;
                break;
            } else if (t.fileStart < h.fileStart + h.byteLength) {
                var f = h.fileStart + h.byteLength - t.fileStart, _ = t.byteLength - f;
                if (_ > 0) t = this.reduceBuffer(t, f, _);
                else {
                    e = !1;
                    break;
                }
            }
        }
        e && (n.debug("MultiBufferStream", "Appending new buffer (fileStart: " + t.fileStart + " - Length: " + t.byteLength + ")"), this.buffers.push(t), s === 0 && (this.buffer = t));
    }, c.prototype.logBufferLevel = function(t) {
        var e, s, h, f, _ = [], g, m = "";
        for(h = 0, f = 0, e = 0; e < this.buffers.length; e++)s = this.buffers[e], e === 0 ? (g = {}, _.push(g), g.start = s.fileStart, g.end = s.fileStart + s.byteLength, m += "[" + g.start + "-") : g.end === s.fileStart ? g.end = s.fileStart + s.byteLength : (g = {}, g.start = s.fileStart, m += _[_.length - 1].end - 1 + "], [" + g.start + "-", g.end = s.fileStart + s.byteLength, _.push(g)), h += s.usedBytes, f += s.byteLength;
        _.length > 0 && (m += g.end - 1 + "]");
        var w = t ? n.info : n.debug;
        this.buffers.length === 0 ? w("MultiBufferStream", "No more buffer in memory") : w("MultiBufferStream", "" + this.buffers.length + " stored buffer(s) (" + h + "/" + f + " bytes), continuous ranges: " + m);
    }, c.prototype.cleanBuffers = function() {
        var t, e;
        for(t = 0; t < this.buffers.length; t++)e = this.buffers[t], e.usedBytes === e.byteLength && (n.debug("MultiBufferStream", "Removing buffer #" + t), this.buffers.splice(t, 1), t--);
    }, c.prototype.mergeNextBuffer = function() {
        var t;
        if (this.bufferIndex + 1 < this.buffers.length) {
            if (t = this.buffers[this.bufferIndex + 1], t.fileStart === this.buffer.fileStart + this.buffer.byteLength) {
                var e = this.buffer.byteLength, s = this.buffer.usedBytes, h = this.buffer.fileStart;
                return this.buffers[this.bufferIndex] = ArrayBuffer.concat(this.buffer, t), this.buffer = this.buffers[this.bufferIndex], this.buffers.splice(this.bufferIndex + 1, 1), this.buffer.usedBytes = s, this.buffer.fileStart = h, n.debug("ISOFile", "Concatenating buffer for box parsing (length: " + e + "->" + this.buffer.byteLength + ")"), !0;
            } else return !1;
        } else return !1;
    }, c.prototype.findPosition = function(t, e, s) {
        var h, f = null, _ = -1;
        for(t === !0 ? h = 0 : h = this.bufferIndex; h < this.buffers.length && (f = this.buffers[h], f.fileStart <= e);){
            _ = h, s && (f.fileStart + f.byteLength <= e ? f.usedBytes = f.byteLength : f.usedBytes = e - f.fileStart, this.logBufferLevel());
            h++;
        }
        return _ !== -1 ? (f = this.buffers[_], f.fileStart + f.byteLength >= e ? (n.debug("MultiBufferStream", "Found position in existing buffer #" + _), _) : -1) : -1;
    }, c.prototype.findEndContiguousBuf = function(t) {
        var e, s, h, f = t !== void 0 ? t : this.bufferIndex;
        if (s = this.buffers[f], this.buffers.length > f + 1) for(e = f + 1; e < this.buffers.length && (h = this.buffers[e], h.fileStart === s.fileStart + s.byteLength); e++)s = h;
        return s.fileStart + s.byteLength;
    }, c.prototype.getEndFilePositionAfter = function(t) {
        var e = this.findPosition(!0, t, !1);
        return e !== -1 ? this.findEndContiguousBuf(e) : t;
    }, c.prototype.addUsedBytes = function(t) {
        this.buffer.usedBytes += t, this.logBufferLevel();
    }, c.prototype.setAllUsedBytes = function() {
        this.buffer.usedBytes = this.buffer.byteLength, this.logBufferLevel();
    }, c.prototype.seek = function(t, e, s) {
        var h;
        return h = this.findPosition(e, t, s), h !== -1 ? (this.buffer = this.buffers[h], this.bufferIndex = h, this.position = t - this.buffer.fileStart, n.debug("MultiBufferStream", "Repositioning parser at buffer position: " + this.position), !0) : (n.debug("MultiBufferStream", "Position " + t + " not found in buffered data"), !1);
    }, c.prototype.getPosition = function() {
        if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === null) throw "Error accessing position in the MultiBufferStream";
        return this.buffers[this.bufferIndex].fileStart + this.position;
    }, c.prototype.getLength = function() {
        return this.byteLength;
    }, c.prototype.getEndPosition = function() {
        if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === null) throw "Error accessing position in the MultiBufferStream";
        return this.buffers[this.bufferIndex].fileStart + this.byteLength;
    }, l.MultiBufferStream = c;
    var u = function() {
        var t = 3, e = 4, s = 5, h = 6, f = [];
        f[t] = "ES_Descriptor", f[e] = "DecoderConfigDescriptor", f[s] = "DecoderSpecificInfo", f[h] = "SLConfigDescriptor", this.getDescriptorName = function(m) {
            return f[m];
        };
        var _ = this, g = {};
        return this.parseOneDescriptor = function(m) {
            var w = 0, S, E, I;
            for(S = m.readUint8(), I = m.readUint8(); I & 128;)w = (I & 127) << 7, I = m.readUint8();
            return w += I & 127, n.debug("MPEG4DescriptorParser", "Found " + (f[S] || "Descriptor " + S) + ", size " + w + " at position " + m.getPosition()), f[S] ? E = new g[f[S]](w) : E = new g.Descriptor(w), E.parse(m), E;
        }, g.Descriptor = function(m, w) {
            this.tag = m, this.size = w, this.descs = [];
        }, g.Descriptor.prototype.parse = function(m) {
            this.data = m.readUint8Array(this.size);
        }, g.Descriptor.prototype.findDescriptor = function(m) {
            for(var w = 0; w < this.descs.length; w++)if (this.descs[w].tag == m) return this.descs[w];
            return null;
        }, g.Descriptor.prototype.parseRemainingDescriptors = function(m) {
            for(var w = m.position; m.position < w + this.size;){
                var S = _.parseOneDescriptor(m);
                this.descs.push(S);
            }
        }, g.ES_Descriptor = function(m) {
            g.Descriptor.call(this, t, m);
        }, g.ES_Descriptor.prototype = new g.Descriptor(), g.ES_Descriptor.prototype.parse = function(m) {
            if (this.ES_ID = m.readUint16(), this.flags = m.readUint8(), this.size -= 3, this.flags & 128 ? (this.dependsOn_ES_ID = m.readUint16(), this.size -= 2) : this.dependsOn_ES_ID = 0, this.flags & 64) {
                var w = m.readUint8();
                this.URL = m.readString(w), this.size -= w + 1;
            } else this.URL = "";
            this.flags & 32 ? (this.OCR_ES_ID = m.readUint16(), this.size -= 2) : this.OCR_ES_ID = 0, this.parseRemainingDescriptors(m);
        }, g.ES_Descriptor.prototype.getOTI = function(m) {
            var w = this.findDescriptor(e);
            return w ? w.oti : 0;
        }, g.ES_Descriptor.prototype.getAudioConfig = function(m) {
            var w = this.findDescriptor(e);
            if (!w) return null;
            var S = w.findDescriptor(s);
            if (S && S.data) {
                var E = (S.data[0] & 248) >> 3;
                return E === 31 && S.data.length >= 2 && (E = 32 + ((S.data[0] & 7) << 3) + ((S.data[1] & 224) >> 5)), E;
            } else return null;
        }, g.DecoderConfigDescriptor = function(m) {
            g.Descriptor.call(this, e, m);
        }, g.DecoderConfigDescriptor.prototype = new g.Descriptor(), g.DecoderConfigDescriptor.prototype.parse = function(m) {
            this.oti = m.readUint8(), this.streamType = m.readUint8(), this.bufferSize = m.readUint24(), this.maxBitrate = m.readUint32(), this.avgBitrate = m.readUint32(), this.size -= 13, this.parseRemainingDescriptors(m);
        }, g.DecoderSpecificInfo = function(m) {
            g.Descriptor.call(this, s, m);
        }, g.DecoderSpecificInfo.prototype = new g.Descriptor(), g.SLConfigDescriptor = function(m) {
            g.Descriptor.call(this, h, m);
        }, g.SLConfigDescriptor.prototype = new g.Descriptor(), this;
    };
    l.MPEG4DescriptorParser = u;
    var a = {
        ERR_INVALID_DATA: -1,
        ERR_NOT_ENOUGH_DATA: 0,
        OK: 1,
        // Boxes to be created with default parsing
        BASIC_BOXES: [
            "mdat",
            "idat",
            "free",
            "skip",
            "meco",
            "strk"
        ],
        FULL_BOXES: [
            "hmhd",
            "nmhd",
            "iods",
            "xml ",
            "bxml",
            "ipro",
            "mere"
        ],
        CONTAINER_BOXES: [
            [
                "moov",
                [
                    "trak",
                    "pssh"
                ]
            ],
            [
                "trak"
            ],
            [
                "edts"
            ],
            [
                "mdia"
            ],
            [
                "minf"
            ],
            [
                "dinf"
            ],
            [
                "stbl",
                [
                    "sgpd",
                    "sbgp"
                ]
            ],
            [
                "mvex",
                [
                    "trex"
                ]
            ],
            [
                "moof",
                [
                    "traf"
                ]
            ],
            [
                "traf",
                [
                    "trun",
                    "sgpd",
                    "sbgp"
                ]
            ],
            [
                "vttc"
            ],
            [
                "tref"
            ],
            [
                "iref"
            ],
            [
                "mfra",
                [
                    "tfra"
                ]
            ],
            [
                "meco"
            ],
            [
                "hnti"
            ],
            [
                "hinf"
            ],
            [
                "strk"
            ],
            [
                "strd"
            ],
            [
                "sinf"
            ],
            [
                "rinf"
            ],
            [
                "schi"
            ],
            [
                "trgr"
            ],
            [
                "udta",
                [
                    "kind"
                ]
            ],
            [
                "iprp",
                [
                    "ipma"
                ]
            ],
            [
                "ipco"
            ],
            [
                "grpl"
            ],
            [
                "j2kH"
            ],
            [
                "etyp",
                [
                    "tyco"
                ]
            ]
        ],
        // Boxes effectively created
        boxCodes: [],
        fullBoxCodes: [],
        containerBoxCodes: [],
        sampleEntryCodes: {},
        sampleGroupEntryCodes: [],
        trackGroupTypes: [],
        UUIDBoxes: {},
        UUIDs: [],
        initialize: function() {
            a.FullBox.prototype = new a.Box(), a.ContainerBox.prototype = new a.Box(), a.SampleEntry.prototype = new a.Box(), a.TrackGroupTypeBox.prototype = new a.FullBox(), a.BASIC_BOXES.forEach(function(t) {
                a.createBoxCtor(t);
            }), a.FULL_BOXES.forEach(function(t) {
                a.createFullBoxCtor(t);
            }), a.CONTAINER_BOXES.forEach(function(t) {
                a.createContainerBoxCtor(t[0], null, t[1]);
            });
        },
        Box: function(t, e, s) {
            this.type = t, this.size = e, this.uuid = s;
        },
        FullBox: function(t, e, s) {
            a.Box.call(this, t, e, s), this.flags = 0, this.version = 0;
        },
        ContainerBox: function(t, e, s) {
            a.Box.call(this, t, e, s), this.boxes = [];
        },
        SampleEntry: function(t, e, s, h) {
            a.ContainerBox.call(this, t, e), this.hdr_size = s, this.start = h;
        },
        SampleGroupEntry: function(t) {
            this.grouping_type = t;
        },
        TrackGroupTypeBox: function(t, e) {
            a.FullBox.call(this, t, e);
        },
        createBoxCtor: function(t, e) {
            a.boxCodes.push(t), a[t + "Box"] = function(s) {
                a.Box.call(this, t, s);
            }, a[t + "Box"].prototype = new a.Box(), e && (a[t + "Box"].prototype.parse = e);
        },
        createFullBoxCtor: function(t, e) {
            a[t + "Box"] = function(s) {
                a.FullBox.call(this, t, s);
            }, a[t + "Box"].prototype = new a.FullBox(), a[t + "Box"].prototype.parse = function(s) {
                this.parseFullHeader(s), e && e.call(this, s);
            };
        },
        addSubBoxArrays: function(t) {
            if (t) {
                this.subBoxNames = t;
                for(var e = t.length, s = 0; s < e; s++)this[t[s] + "s"] = [];
            }
        },
        createContainerBoxCtor: function(t, e, s) {
            a[t + "Box"] = function(h) {
                a.ContainerBox.call(this, t, h), a.addSubBoxArrays.call(this, s);
            }, a[t + "Box"].prototype = new a.ContainerBox(), e && (a[t + "Box"].prototype.parse = e);
        },
        createMediaSampleEntryCtor: function(t, e, s) {
            a.sampleEntryCodes[t] = [], a[t + "SampleEntry"] = function(h, f) {
                a.SampleEntry.call(this, h, f), a.addSubBoxArrays.call(this, s);
            }, a[t + "SampleEntry"].prototype = new a.SampleEntry(), e && (a[t + "SampleEntry"].prototype.parse = e);
        },
        createSampleEntryCtor: function(t, e, s, h) {
            a.sampleEntryCodes[t].push(e), a[e + "SampleEntry"] = function(f) {
                a[t + "SampleEntry"].call(this, e, f), a.addSubBoxArrays.call(this, h);
            }, a[e + "SampleEntry"].prototype = new a[t + "SampleEntry"](), s && (a[e + "SampleEntry"].prototype.parse = s);
        },
        createEncryptedSampleEntryCtor: function(t, e, s) {
            a.createSampleEntryCtor.call(this, t, e, s, [
                "sinf"
            ]);
        },
        createSampleGroupCtor: function(t, e) {
            a[t + "SampleGroupEntry"] = function(s) {
                a.SampleGroupEntry.call(this, t, s);
            }, a[t + "SampleGroupEntry"].prototype = new a.SampleGroupEntry(), e && (a[t + "SampleGroupEntry"].prototype.parse = e);
        },
        createTrackGroupCtor: function(t, e) {
            a[t + "TrackGroupTypeBox"] = function(s) {
                a.TrackGroupTypeBox.call(this, t, s);
            }, a[t + "TrackGroupTypeBox"].prototype = new a.TrackGroupTypeBox(), e && (a[t + "TrackGroupTypeBox"].prototype.parse = e);
        },
        createUUIDBox: function(t, e, s, h) {
            a.UUIDs.push(t), a.UUIDBoxes[t] = function(f) {
                e ? a.FullBox.call(this, "uuid", f, t) : s ? a.ContainerBox.call(this, "uuid", f, t) : a.Box.call(this, "uuid", f, t);
            }, a.UUIDBoxes[t].prototype = e ? new a.FullBox() : s ? new a.ContainerBox() : new a.Box(), h && (e ? a.UUIDBoxes[t].prototype.parse = function(f) {
                this.parseFullHeader(f), h && h.call(this, f);
            } : a.UUIDBoxes[t].prototype.parse = h);
        }
    };
    a.initialize(), a.TKHD_FLAG_ENABLED = 1, a.TKHD_FLAG_IN_MOVIE = 2, a.TKHD_FLAG_IN_PREVIEW = 4, a.TFHD_FLAG_BASE_DATA_OFFSET = 1, a.TFHD_FLAG_SAMPLE_DESC = 2, a.TFHD_FLAG_SAMPLE_DUR = 8, a.TFHD_FLAG_SAMPLE_SIZE = 16, a.TFHD_FLAG_SAMPLE_FLAGS = 32, a.TFHD_FLAG_DUR_EMPTY = 65536, a.TFHD_FLAG_DEFAULT_BASE_IS_MOOF = 131072, a.TRUN_FLAGS_DATA_OFFSET = 1, a.TRUN_FLAGS_FIRST_FLAG = 4, a.TRUN_FLAGS_DURATION = 256, a.TRUN_FLAGS_SIZE = 512, a.TRUN_FLAGS_FLAGS = 1024, a.TRUN_FLAGS_CTS_OFFSET = 2048, a.Box.prototype.add = function(t) {
        return this.addBox(new a[t + "Box"]());
    }, a.Box.prototype.addBox = function(t) {
        return this.boxes.push(t), this[t.type + "s"] ? this[t.type + "s"].push(t) : this[t.type] = t, t;
    }, a.Box.prototype.set = function(t, e) {
        return this[t] = e, this;
    }, a.Box.prototype.addEntry = function(t, e) {
        var s = e || "entries";
        return this[s] || (this[s] = []), this[s].push(t), this;
    }, l.BoxParser = a, a.parseUUID = function(t) {
        return a.parseHex16(t);
    }, a.parseHex16 = function(t) {
        for(var e = "", s = 0; s < 16; s++){
            var h = t.readUint8().toString(16);
            e += h.length === 1 ? "0" + h : h;
        }
        return e;
    }, a.parseOneBox = function(t, e, s) {
        var h, f = t.getPosition(), _ = 0, g, m;
        if (t.getEndPosition() - f < 8) return n.debug("BoxParser", "Not enough data in stream to parse the type and size of the box"), {
            code: a.ERR_NOT_ENOUGH_DATA
        };
        if (s && s < 8) return n.debug("BoxParser", "Not enough bytes left in the parent box to parse a new box"), {
            code: a.ERR_NOT_ENOUGH_DATA
        };
        var w = t.readUint32(), S = t.readString(4), E = S;
        if (n.debug("BoxParser", "Found box of type '" + S + "' and size " + w + " at position " + f), _ = 8, S == "uuid") {
            if (t.getEndPosition() - t.getPosition() < 16 || s - _ < 16) return t.seek(f), n.debug("BoxParser", "Not enough bytes left in the parent box to parse a UUID box"), {
                code: a.ERR_NOT_ENOUGH_DATA
            };
            m = a.parseUUID(t), _ += 16, E = m;
        }
        if (w == 1) {
            if (t.getEndPosition() - t.getPosition() < 8 || s && s - _ < 8) return t.seek(f), n.warn("BoxParser", 'Not enough data in stream to parse the extended size of the "' + S + '" box'), {
                code: a.ERR_NOT_ENOUGH_DATA
            };
            w = t.readUint64(), _ += 8;
        } else if (w === 0) {
            if (s) w = s;
            else if (S !== "mdat") return n.error("BoxParser", "Unlimited box size not supported for type: '" + S + "'"), h = new a.Box(S, w), {
                code: a.OK,
                box: h,
                size: h.size
            };
        }
        return w !== 0 && w < _ ? (n.error("BoxParser", "Box of type " + S + " has an invalid size " + w + " (too small to be a box)"), {
            code: a.ERR_NOT_ENOUGH_DATA,
            type: S,
            size: w,
            hdr_size: _,
            start: f
        }) : w !== 0 && s && w > s ? (n.error("BoxParser", "Box of type '" + S + "' has a size " + w + " greater than its container size " + s), {
            code: a.ERR_NOT_ENOUGH_DATA,
            type: S,
            size: w,
            hdr_size: _,
            start: f
        }) : w !== 0 && f + w > t.getEndPosition() ? (t.seek(f), n.info("BoxParser", "Not enough data in stream to parse the entire '" + S + "' box"), {
            code: a.ERR_NOT_ENOUGH_DATA,
            type: S,
            size: w,
            hdr_size: _,
            start: f
        }) : e ? {
            code: a.OK,
            type: S,
            size: w,
            hdr_size: _,
            start: f
        } : (a[S + "Box"] ? h = new a[S + "Box"](w) : S !== "uuid" ? (n.warn("BoxParser", "Unknown box type: '" + S + "'"), h = new a.Box(S, w), h.has_unparsed_data = !0) : a.UUIDBoxes[m] ? h = new a.UUIDBoxes[m](w) : (n.warn("BoxParser", "Unknown uuid type: '" + m + "'"), h = new a.Box(S, w), h.uuid = m, h.has_unparsed_data = !0), h.hdr_size = _, h.start = f, h.write === a.Box.prototype.write && h.type !== "mdat" && (n.info("BoxParser", "'" + E + "' box writing not yet implemented, keeping unparsed data in memory for later write"), h.parseDataAndRewind(t)), h.parse(t), g = t.getPosition() - (h.start + h.size), g < 0 ? (n.warn("BoxParser", "Parsing of box '" + E + "' did not read the entire indicated box data size (missing " + -g + " bytes), seeking forward"), t.seek(h.start + h.size)) : g > 0 && (n.error("BoxParser", "Parsing of box '" + E + "' read " + g + " more bytes than the indicated box data size, seeking backwards"), h.size !== 0 && t.seek(h.start + h.size)), {
            code: a.OK,
            box: h,
            size: h.size
        });
    }, a.Box.prototype.parse = function(t) {
        this.type != "mdat" ? this.data = t.readUint8Array(this.size - this.hdr_size) : this.size === 0 ? t.seek(t.getEndPosition()) : t.seek(this.start + this.size);
    }, a.Box.prototype.parseDataAndRewind = function(t) {
        this.data = t.readUint8Array(this.size - this.hdr_size), t.position -= this.size - this.hdr_size;
    }, a.FullBox.prototype.parseDataAndRewind = function(t) {
        this.parseFullHeader(t), this.data = t.readUint8Array(this.size - this.hdr_size), this.hdr_size -= 4, t.position -= this.size - this.hdr_size;
    }, a.FullBox.prototype.parseFullHeader = function(t) {
        this.version = t.readUint8(), this.flags = t.readUint24(), this.hdr_size += 4;
    }, a.FullBox.prototype.parse = function(t) {
        this.parseFullHeader(t), this.data = t.readUint8Array(this.size - this.hdr_size);
    }, a.ContainerBox.prototype.parse = function(t) {
        for(var e, s; t.getPosition() < this.start + this.size;)if (e = a.parseOneBox(t, !1, this.size - (t.getPosition() - this.start)), e.code === a.OK) {
            if (s = e.box, this.boxes.push(s), this.subBoxNames && this.subBoxNames.indexOf(s.type) != -1) this[this.subBoxNames[this.subBoxNames.indexOf(s.type)] + "s"].push(s);
            else {
                var h = s.type !== "uuid" ? s.type : s.uuid;
                this[h] ? n.warn("Box of type " + h + " already stored in field of this type") : this[h] = s;
            }
        } else return;
    }, a.Box.prototype.parseLanguage = function(t) {
        this.language = t.readUint16();
        var e = [];
        e[0] = this.language >> 10 & 31, e[1] = this.language >> 5 & 31, e[2] = this.language & 31, this.languageString = String.fromCharCode(e[0] + 96, e[1] + 96, e[2] + 96);
    }, a.SAMPLE_ENTRY_TYPE_VISUAL = "Visual", a.SAMPLE_ENTRY_TYPE_AUDIO = "Audio", a.SAMPLE_ENTRY_TYPE_HINT = "Hint", a.SAMPLE_ENTRY_TYPE_METADATA = "Metadata", a.SAMPLE_ENTRY_TYPE_SUBTITLE = "Subtitle", a.SAMPLE_ENTRY_TYPE_SYSTEM = "System", a.SAMPLE_ENTRY_TYPE_TEXT = "Text", a.SampleEntry.prototype.parseHeader = function(t) {
        t.readUint8Array(6), this.data_reference_index = t.readUint16(), this.hdr_size += 8;
    }, a.SampleEntry.prototype.parse = function(t) {
        this.parseHeader(t), this.data = t.readUint8Array(this.size - this.hdr_size);
    }, a.SampleEntry.prototype.parseDataAndRewind = function(t) {
        this.parseHeader(t), this.data = t.readUint8Array(this.size - this.hdr_size), this.hdr_size -= 8, t.position -= this.size - this.hdr_size;
    }, a.SampleEntry.prototype.parseFooter = function(t) {
        a.ContainerBox.prototype.parse.call(this, t);
    }, a.createMediaSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_HINT), a.createMediaSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_METADATA), a.createMediaSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_SUBTITLE), a.createMediaSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_SYSTEM), a.createMediaSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_TEXT), a.createMediaSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, function(t) {
        var e;
        this.parseHeader(t), t.readUint16(), t.readUint16(), t.readUint32Array(3), this.width = t.readUint16(), this.height = t.readUint16(), this.horizresolution = t.readUint32(), this.vertresolution = t.readUint32(), t.readUint32(), this.frame_count = t.readUint16(), e = Math.min(31, t.readUint8()), this.compressorname = t.readString(e), e < 31 && t.readString(31 - e), this.depth = t.readUint16(), t.readUint16(), this.parseFooter(t);
    }), a.createMediaSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, function(t) {
        this.parseHeader(t), t.readUint32Array(2), this.channel_count = t.readUint16(), this.samplesize = t.readUint16(), t.readUint16(), t.readUint16(), this.samplerate = t.readUint32() / 65536, this.parseFooter(t);
    }), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "avc1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "avc2"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "avc3"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "avc4"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "av01"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "dav1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "hvc1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "hev1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "hvt1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "lhe1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "dvh1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "dvhe"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "vvc1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "vvi1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "vvs1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "vvcN"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "vp08"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "vp09"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "avs3"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "j2ki"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "mjp2"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "mjpg"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "uncv"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "mp4a"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "ac-3"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "ac-4"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "ec-3"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "Opus"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "mha1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "mha2"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "mhm1"), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "mhm2"), a.createEncryptedSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_VISUAL, "encv"), a.createEncryptedSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_AUDIO, "enca"), a.createEncryptedSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_SUBTITLE, "encu"), a.createEncryptedSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_SYSTEM, "encs"), a.createEncryptedSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_TEXT, "enct"), a.createEncryptedSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_METADATA, "encm"), a.createBoxCtor("a1lx", function(t) {
        var e = t.readUint8() & 1, s = ((e & 1) + 1) * 16;
        this.layer_size = [];
        for(var h = 0; h < 3; h++)s == 16 ? this.layer_size[h] = t.readUint16() : this.layer_size[h] = t.readUint32();
    }), a.createBoxCtor("a1op", function(t) {
        this.op_index = t.readUint8();
    }), a.createFullBoxCtor("auxC", function(t) {
        this.aux_type = t.readCString();
        var e = this.size - this.hdr_size - (this.aux_type.length + 1);
        this.aux_subtype = t.readUint8Array(e);
    }), a.createBoxCtor("av1C", function(t) {
        var e = t.readUint8();
        if (this.version = e & 127, this.version !== 1) {
            n.error("av1C version " + this.version + " not supported");
            return;
        }
        if (e = t.readUint8(), this.seq_profile = e >> 5 & 7, this.seq_level_idx_0 = e & 31, e = t.readUint8(), this.seq_tier_0 = e >> 7 & 1, this.high_bitdepth = e >> 6 & 1, this.twelve_bit = e >> 5 & 1, this.monochrome = e >> 4 & 1, this.chroma_subsampling_x = e >> 3 & 1, this.chroma_subsampling_y = e >> 2 & 1, this.chroma_sample_position = e & 3, e = t.readUint8(), this.reserved_1 = e >> 5 & 7, this.reserved_1 !== 0) {
            n.error("av1C reserved_1 parsing problem");
            return;
        }
        if (this.initial_presentation_delay_present = e >> 4 & 1, this.initial_presentation_delay_present === 1) this.initial_presentation_delay_minus_one = e & 15;
        else if (this.reserved_2 = e & 15, this.reserved_2 !== 0) {
            n.error("av1C reserved_2 parsing problem");
            return;
        }
        var s = this.size - this.hdr_size - 4;
        this.configOBUs = t.readUint8Array(s);
    }), a.createBoxCtor("avcC", function(t) {
        var e, s;
        for(this.configurationVersion = t.readUint8(), this.AVCProfileIndication = t.readUint8(), this.profile_compatibility = t.readUint8(), this.AVCLevelIndication = t.readUint8(), this.lengthSizeMinusOne = t.readUint8() & 3, this.nb_SPS_nalus = t.readUint8() & 31, s = this.size - this.hdr_size - 6, this.SPS = [], e = 0; e < this.nb_SPS_nalus; e++)this.SPS[e] = {}, this.SPS[e].length = t.readUint16(), this.SPS[e].nalu = t.readUint8Array(this.SPS[e].length), s -= 2 + this.SPS[e].length;
        for(this.nb_PPS_nalus = t.readUint8(), s--, this.PPS = [], e = 0; e < this.nb_PPS_nalus; e++)this.PPS[e] = {}, this.PPS[e].length = t.readUint16(), this.PPS[e].nalu = t.readUint8Array(this.PPS[e].length), s -= 2 + this.PPS[e].length;
        s > 0 && (this.ext = t.readUint8Array(s));
    }), a.createBoxCtor("btrt", function(t) {
        this.bufferSizeDB = t.readUint32(), this.maxBitrate = t.readUint32(), this.avgBitrate = t.readUint32();
    }), a.createFullBoxCtor("ccst", function(t) {
        var e = t.readUint8();
        this.all_ref_pics_intra = (e & 128) == 128, this.intra_pred_used = (e & 64) == 64, this.max_ref_per_pic = (e & 63) >> 2, t.readUint24();
    }), a.createBoxCtor("cdef", function(t) {
        var e;
        for(this.channel_count = t.readUint16(), this.channel_indexes = [], this.channel_types = [], this.channel_associations = [], e = 0; e < this.channel_count; e++)this.channel_indexes.push(t.readUint16()), this.channel_types.push(t.readUint16()), this.channel_associations.push(t.readUint16());
    }), a.createBoxCtor("clap", function(t) {
        this.cleanApertureWidthN = t.readUint32(), this.cleanApertureWidthD = t.readUint32(), this.cleanApertureHeightN = t.readUint32(), this.cleanApertureHeightD = t.readUint32(), this.horizOffN = t.readUint32(), this.horizOffD = t.readUint32(), this.vertOffN = t.readUint32(), this.vertOffD = t.readUint32();
    }), a.createBoxCtor("clli", function(t) {
        this.max_content_light_level = t.readUint16(), this.max_pic_average_light_level = t.readUint16();
    }), a.createFullBoxCtor("cmex", function(t) {
        this.flags & 1 && (this.pos_x = t.readInt32()), this.flags & 2 && (this.pos_y = t.readInt32()), this.flags & 4 && (this.pos_z = t.readInt32()), this.flags & 8 && (this.version == 0 ? this.flags & 16 ? (this.quat_x = t.readInt32(), this.quat_y = t.readInt32(), this.quat_z = t.readInt32()) : (this.quat_x = t.readInt16(), this.quat_y = t.readInt16(), this.quat_z = t.readInt16()) : this.version), this.flags & 32 && (this.id = t.readUint32());
    }), a.createFullBoxCtor("cmin", function(t) {
        this.focal_length_x = t.readInt32(), this.principal_point_x = t.readInt32(), this.principal_point_y = t.readInt32(), this.flags & 1 && (this.focal_length_y = t.readInt32(), this.skew_factor = t.readInt32());
    }), a.createBoxCtor("cmpd", function(t) {
        for(this.component_count = t.readUint16(), this.component_types = [], this.component_type_urls = [], i = 0; i < this.component_count; i++){
            var e = t.readUint16();
            this.component_types.push(e), e >= 32768 && this.component_type_urls.push(t.readCString());
        }
    }), a.createFullBoxCtor("co64", function(t) {
        var e, s;
        if (e = t.readUint32(), this.chunk_offsets = [], this.version === 0) for(s = 0; s < e; s++)this.chunk_offsets.push(t.readUint64());
    }), a.createFullBoxCtor("CoLL", function(t) {
        this.maxCLL = t.readUint16(), this.maxFALL = t.readUint16();
    }), a.createBoxCtor("colr", function(t) {
        if (this.colour_type = t.readString(4), this.colour_type === "nclx") {
            this.colour_primaries = t.readUint16(), this.transfer_characteristics = t.readUint16(), this.matrix_coefficients = t.readUint16();
            var e = t.readUint8();
            this.full_range_flag = e >> 7;
        } else this.colour_type === "rICC" ? this.ICC_profile = t.readUint8Array(this.size - 4) : this.colour_type === "prof" && (this.ICC_profile = t.readUint8Array(this.size - 4));
    }), a.createFullBoxCtor("cprt", function(t) {
        this.parseLanguage(t), this.notice = t.readCString();
    }), a.createFullBoxCtor("cslg", function(t) {
        this.version === 0 && (this.compositionToDTSShift = t.readInt32(), this.leastDecodeToDisplayDelta = t.readInt32(), this.greatestDecodeToDisplayDelta = t.readInt32(), this.compositionStartTime = t.readInt32(), this.compositionEndTime = t.readInt32());
    }), a.createFullBoxCtor("ctts", function(t) {
        var e, s;
        if (e = t.readUint32(), this.sample_counts = [], this.sample_offsets = [], this.version === 0) for(s = 0; s < e; s++){
            this.sample_counts.push(t.readUint32());
            var h = t.readInt32();
            h < 0 && n.warn("BoxParser", "ctts box uses negative values without using version 1"), this.sample_offsets.push(h);
        }
        else if (this.version == 1) for(s = 0; s < e; s++)this.sample_counts.push(t.readUint32()), this.sample_offsets.push(t.readInt32());
    }), a.createBoxCtor("dac3", function(t) {
        var e = t.readUint8(), s = t.readUint8(), h = t.readUint8();
        this.fscod = e >> 6, this.bsid = e >> 1 & 31, this.bsmod = (e & 1) << 2 | s >> 6 & 3, this.acmod = s >> 3 & 7, this.lfeon = s >> 2 & 1, this.bit_rate_code = s & 3 | h >> 5 & 7;
    }), a.createBoxCtor("dec3", function(t) {
        var e = t.readUint16();
        this.data_rate = e >> 3, this.num_ind_sub = e & 7, this.ind_subs = [];
        for(var s = 0; s < this.num_ind_sub + 1; s++){
            var h = {};
            this.ind_subs.push(h);
            var f = t.readUint8(), _ = t.readUint8(), g = t.readUint8();
            h.fscod = f >> 6, h.bsid = f >> 1 & 31, h.bsmod = (f & 1) << 4 | _ >> 4 & 15, h.acmod = _ >> 1 & 7, h.lfeon = _ & 1, h.num_dep_sub = g >> 1 & 15, h.num_dep_sub > 0 && (h.chan_loc = (g & 1) << 8 | t.readUint8());
        }
    }), a.createFullBoxCtor("dfLa", function(t) {
        var e = 127, s = 128, h = [], f = [
            "STREAMINFO",
            "PADDING",
            "APPLICATION",
            "SEEKTABLE",
            "VORBIS_COMMENT",
            "CUESHEET",
            "PICTURE",
            "RESERVED"
        ];
        this.parseFullHeader(t);
        do {
            var _ = t.readUint8(), g = Math.min(_ & e, f.length - 1);
            if (g ? t.readUint8Array(t.readUint24()) : (t.readUint8Array(13), this.samplerate = t.readUint32() >> 12, t.readUint8Array(20)), h.push(f[g]), _ & s) break;
        }while (!0);
        this.numMetadataBlocks = h.length + " (" + h.join(", ") + ")";
    }), a.createBoxCtor("dimm", function(t) {
        this.bytessent = t.readUint64();
    }), a.createBoxCtor("dmax", function(t) {
        this.time = t.readUint32();
    }), a.createBoxCtor("dmed", function(t) {
        this.bytessent = t.readUint64();
    }), a.createBoxCtor("dOps", function(t) {
        if (this.Version = t.readUint8(), this.OutputChannelCount = t.readUint8(), this.PreSkip = t.readUint16(), this.InputSampleRate = t.readUint32(), this.OutputGain = t.readInt16(), this.ChannelMappingFamily = t.readUint8(), this.ChannelMappingFamily !== 0) {
            this.StreamCount = t.readUint8(), this.CoupledCount = t.readUint8(), this.ChannelMapping = [];
            for(var e = 0; e < this.OutputChannelCount; e++)this.ChannelMapping[e] = t.readUint8();
        }
    }), a.createFullBoxCtor("dref", function(t) {
        var e, s;
        this.entries = [];
        for(var h = t.readUint32(), f = 0; f < h; f++)if (e = a.parseOneBox(t, !1, this.size - (t.getPosition() - this.start)), e.code === a.OK) s = e.box, this.entries.push(s);
        else return;
    }), a.createBoxCtor("drep", function(t) {
        this.bytessent = t.readUint64();
    }), a.createFullBoxCtor("elng", function(t) {
        this.extended_language = t.readString(this.size - this.hdr_size);
    }), a.createFullBoxCtor("elst", function(t) {
        this.entries = [];
        for(var e = t.readUint32(), s = 0; s < e; s++){
            var h = {};
            this.entries.push(h), this.version === 1 ? (h.segment_duration = t.readUint64(), h.media_time = t.readInt64()) : (h.segment_duration = t.readUint32(), h.media_time = t.readInt32()), h.media_rate_integer = t.readInt16(), h.media_rate_fraction = t.readInt16();
        }
    }), a.createFullBoxCtor("emsg", function(t) {
        this.version == 1 ? (this.timescale = t.readUint32(), this.presentation_time = t.readUint64(), this.event_duration = t.readUint32(), this.id = t.readUint32(), this.scheme_id_uri = t.readCString(), this.value = t.readCString()) : (this.scheme_id_uri = t.readCString(), this.value = t.readCString(), this.timescale = t.readUint32(), this.presentation_time_delta = t.readUint32(), this.event_duration = t.readUint32(), this.id = t.readUint32());
        var e = this.size - this.hdr_size - (16 + (this.scheme_id_uri.length + 1) + (this.value.length + 1));
        this.version == 1 && (e -= 4), this.message_data = t.readUint8Array(e);
    }), a.createEntityToGroupCtor = function(t, e) {
        a[t + "Box"] = function(s) {
            a.FullBox.call(this, t, s);
        }, a[t + "Box"].prototype = new a.FullBox(), a[t + "Box"].prototype.parse = function(s) {
            if (this.parseFullHeader(s), e) e.call(this, s);
            else for(this.group_id = s.readUint32(), this.num_entities_in_group = s.readUint32(), this.entity_ids = [], i = 0; i < this.num_entities_in_group; i++){
                var h = s.readUint32();
                this.entity_ids.push(h);
            }
        };
    }, a.createEntityToGroupCtor("aebr"), a.createEntityToGroupCtor("afbr"), a.createEntityToGroupCtor("albc"), a.createEntityToGroupCtor("altr"), a.createEntityToGroupCtor("brst"), a.createEntityToGroupCtor("dobr"), a.createEntityToGroupCtor("eqiv"), a.createEntityToGroupCtor("favc"), a.createEntityToGroupCtor("fobr"), a.createEntityToGroupCtor("iaug"), a.createEntityToGroupCtor("pano"), a.createEntityToGroupCtor("slid"), a.createEntityToGroupCtor("ster"), a.createEntityToGroupCtor("tsyn"), a.createEntityToGroupCtor("wbbr"), a.createEntityToGroupCtor("prgr"), a.createFullBoxCtor("esds", function(t) {
        var e = t.readUint8Array(this.size - this.hdr_size);
        if (this.data = e, typeof u < "u") {
            var s = new u();
            this.esd = s.parseOneDescriptor(new r(e.buffer, 0, r.BIG_ENDIAN));
        }
    }), a.createBoxCtor("fiel", function(t) {
        this.fieldCount = t.readUint8(), this.fieldOrdering = t.readUint8();
    }), a.createBoxCtor("frma", function(t) {
        this.data_format = t.readString(4);
    }), a.createBoxCtor("ftyp", function(t) {
        var e = this.size - this.hdr_size;
        this.major_brand = t.readString(4), this.minor_version = t.readUint32(), e -= 8, this.compatible_brands = [];
        for(var s = 0; e >= 4;)this.compatible_brands[s] = t.readString(4), e -= 4, s++;
    }), a.createFullBoxCtor("hdlr", function(t) {
        this.version === 0 && (t.readUint32(), this.handler = t.readString(4), t.readUint32Array(3), this.name = t.readString(this.size - this.hdr_size - 20), this.name[this.name.length - 1] === "\0" && (this.name = this.name.slice(0, -1)));
    }), a.createBoxCtor("hvcC", function(t) {
        var e, s, h, f;
        this.configurationVersion = t.readUint8(), f = t.readUint8(), this.general_profile_space = f >> 6, this.general_tier_flag = (f & 32) >> 5, this.general_profile_idc = f & 31, this.general_profile_compatibility = t.readUint32(), this.general_constraint_indicator = t.readUint8Array(6), this.general_level_idc = t.readUint8(), this.min_spatial_segmentation_idc = t.readUint16() & 4095, this.parallelismType = t.readUint8() & 3, this.chroma_format_idc = t.readUint8() & 3, this.bit_depth_luma_minus8 = t.readUint8() & 7, this.bit_depth_chroma_minus8 = t.readUint8() & 7, this.avgFrameRate = t.readUint16(), f = t.readUint8(), this.constantFrameRate = f >> 6, this.numTemporalLayers = (f & 13) >> 3, this.temporalIdNested = (f & 4) >> 2, this.lengthSizeMinusOne = f & 3, this.nalu_arrays = [];
        var _ = t.readUint8();
        for(e = 0; e < _; e++){
            var g = [];
            this.nalu_arrays.push(g), f = t.readUint8(), g.completeness = (f & 128) >> 7, g.nalu_type = f & 63;
            var m = t.readUint16();
            for(s = 0; s < m; s++){
                var w = {};
                g.push(w), h = t.readUint16(), w.data = t.readUint8Array(h);
            }
        }
    }), a.createFullBoxCtor("iinf", function(t) {
        var e;
        this.version === 0 ? this.entry_count = t.readUint16() : this.entry_count = t.readUint32(), this.item_infos = [];
        for(var s = 0; s < this.entry_count; s++)if (e = a.parseOneBox(t, !1, this.size - (t.getPosition() - this.start)), e.code === a.OK) e.box.type !== "infe" && n.error("BoxParser", "Expected 'infe' box, got " + e.box.type), this.item_infos[s] = e.box;
        else return;
    }), a.createFullBoxCtor("iloc", function(t) {
        var e;
        e = t.readUint8(), this.offset_size = e >> 4 & 15, this.length_size = e & 15, e = t.readUint8(), this.base_offset_size = e >> 4 & 15, this.version === 1 || this.version === 2 ? this.index_size = e & 15 : this.index_size = 0, this.items = [];
        var s = 0;
        if (this.version < 2) s = t.readUint16();
        else if (this.version === 2) s = t.readUint32();
        else throw "version of iloc box not supported";
        for(var h = 0; h < s; h++){
            var f = {};
            if (this.items.push(f), this.version < 2) f.item_ID = t.readUint16();
            else if (this.version === 2) f.item_ID = t.readUint16();
            else throw "version of iloc box not supported";
            switch(this.version === 1 || this.version === 2 ? f.construction_method = t.readUint16() & 15 : f.construction_method = 0, f.data_reference_index = t.readUint16(), this.base_offset_size){
                case 0:
                    f.base_offset = 0;
                    break;
                case 4:
                    f.base_offset = t.readUint32();
                    break;
                case 8:
                    f.base_offset = t.readUint64();
                    break;
                default:
                    throw "Error reading base offset size";
            }
            var _ = t.readUint16();
            f.extents = [];
            for(var g = 0; g < _; g++){
                var m = {};
                if (f.extents.push(m), this.version === 1 || this.version === 2) switch(this.index_size){
                    case 0:
                        m.extent_index = 0;
                        break;
                    case 4:
                        m.extent_index = t.readUint32();
                        break;
                    case 8:
                        m.extent_index = t.readUint64();
                        break;
                    default:
                        throw "Error reading extent index";
                }
                switch(this.offset_size){
                    case 0:
                        m.extent_offset = 0;
                        break;
                    case 4:
                        m.extent_offset = t.readUint32();
                        break;
                    case 8:
                        m.extent_offset = t.readUint64();
                        break;
                    default:
                        throw "Error reading extent index";
                }
                switch(this.length_size){
                    case 0:
                        m.extent_length = 0;
                        break;
                    case 4:
                        m.extent_length = t.readUint32();
                        break;
                    case 8:
                        m.extent_length = t.readUint64();
                        break;
                    default:
                        throw "Error reading extent index";
                }
            }
        }
    }), a.createBoxCtor("imir", function(t) {
        var e = t.readUint8();
        this.reserved = e >> 7, this.axis = e & 1;
    }), a.createFullBoxCtor("infe", function(t) {
        if ((this.version === 0 || this.version === 1) && (this.item_ID = t.readUint16(), this.item_protection_index = t.readUint16(), this.item_name = t.readCString(), this.content_type = t.readCString(), this.content_encoding = t.readCString()), this.version === 1) {
            this.extension_type = t.readString(4), n.warn("BoxParser", "Cannot parse extension type"), t.seek(this.start + this.size);
            return;
        }
        this.version >= 2 && (this.version === 2 ? this.item_ID = t.readUint16() : this.version === 3 && (this.item_ID = t.readUint32()), this.item_protection_index = t.readUint16(), this.item_type = t.readString(4), this.item_name = t.readCString(), this.item_type === "mime" ? (this.content_type = t.readCString(), this.content_encoding = t.readCString()) : this.item_type === "uri " && (this.item_uri_type = t.readCString()));
    }), a.createFullBoxCtor("ipma", function(t) {
        var e, s;
        for(entry_count = t.readUint32(), this.associations = [], e = 0; e < entry_count; e++){
            var h = {};
            this.associations.push(h), this.version < 1 ? h.id = t.readUint16() : h.id = t.readUint32();
            var f = t.readUint8();
            for(h.props = [], s = 0; s < f; s++){
                var _ = t.readUint8(), g = {};
                h.props.push(g), g.essential = (_ & 128) >> 7 === 1, this.flags & 1 ? g.property_index = (_ & 127) << 8 | t.readUint8() : g.property_index = _ & 127;
            }
        }
    }), a.createFullBoxCtor("iref", function(t) {
        var e, s;
        for(this.references = []; t.getPosition() < this.start + this.size;)if (e = a.parseOneBox(t, !0, this.size - (t.getPosition() - this.start)), e.code === a.OK) this.version === 0 ? s = new a.SingleItemTypeReferenceBox(e.type, e.size, e.hdr_size, e.start) : s = new a.SingleItemTypeReferenceBoxLarge(e.type, e.size, e.hdr_size, e.start), s.write === a.Box.prototype.write && s.type !== "mdat" && (n.warn("BoxParser", s.type + " box writing not yet implemented, keeping unparsed data in memory for later write"), s.parseDataAndRewind(t)), s.parse(t), this.references.push(s);
        else return;
    }), a.createBoxCtor("irot", function(t) {
        this.angle = t.readUint8() & 3;
    }), a.createFullBoxCtor("ispe", function(t) {
        this.image_width = t.readUint32(), this.image_height = t.readUint32();
    }), a.createFullBoxCtor("kind", function(t) {
        this.schemeURI = t.readCString(), this.value = t.readCString();
    }), a.createFullBoxCtor("leva", function(t) {
        var e = t.readUint8();
        this.levels = [];
        for(var s = 0; s < e; s++){
            var h = {};
            this.levels[s] = h, h.track_ID = t.readUint32();
            var f = t.readUint8();
            switch(h.padding_flag = f >> 7, h.assignment_type = f & 127, h.assignment_type){
                case 0:
                    h.grouping_type = t.readString(4);
                    break;
                case 1:
                    h.grouping_type = t.readString(4), h.grouping_type_parameter = t.readUint32();
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    h.sub_track_id = t.readUint32();
                    break;
                default:
                    n.warn("BoxParser", "Unknown leva assignement type");
            }
        }
    }), a.createBoxCtor("lsel", function(t) {
        this.layer_id = t.readUint16();
    }), a.createBoxCtor("maxr", function(t) {
        this.period = t.readUint32(), this.bytes = t.readUint32();
    }), a.createBoxCtor("mdcv", function(t) {
        this.display_primaries = [], this.display_primaries[0] = {}, this.display_primaries[0].x = t.readUint16(), this.display_primaries[0].y = t.readUint16(), this.display_primaries[1] = {}, this.display_primaries[1].x = t.readUint16(), this.display_primaries[1].y = t.readUint16(), this.display_primaries[2] = {}, this.display_primaries[2].x = t.readUint16(), this.display_primaries[2].y = t.readUint16(), this.white_point = {}, this.white_point.x = t.readUint16(), this.white_point.y = t.readUint16(), this.max_display_mastering_luminance = t.readUint32(), this.min_display_mastering_luminance = t.readUint32();
    }), a.createFullBoxCtor("mdhd", function(t) {
        this.version == 1 ? (this.creation_time = t.readUint64(), this.modification_time = t.readUint64(), this.timescale = t.readUint32(), this.duration = t.readUint64()) : (this.creation_time = t.readUint32(), this.modification_time = t.readUint32(), this.timescale = t.readUint32(), this.duration = t.readUint32()), this.parseLanguage(t), t.readUint16();
    }), a.createFullBoxCtor("mehd", function(t) {
        this.flags & 1 && (n.warn("BoxParser", "mehd box incorrectly uses flags set to 1, converting version to 1"), this.version = 1), this.version == 1 ? this.fragment_duration = t.readUint64() : this.fragment_duration = t.readUint32();
    }), a.createFullBoxCtor("meta", function(t) {
        this.boxes = [], a.ContainerBox.prototype.parse.call(this, t);
    }), a.createFullBoxCtor("mfhd", function(t) {
        this.sequence_number = t.readUint32();
    }), a.createFullBoxCtor("mfro", function(t) {
        this._size = t.readUint32();
    }), a.createFullBoxCtor("mvhd", function(t) {
        this.version == 1 ? (this.creation_time = t.readUint64(), this.modification_time = t.readUint64(), this.timescale = t.readUint32(), this.duration = t.readUint64()) : (this.creation_time = t.readUint32(), this.modification_time = t.readUint32(), this.timescale = t.readUint32(), this.duration = t.readUint32()), this.rate = t.readUint32(), this.volume = t.readUint16() >> 8, t.readUint16(), t.readUint32Array(2), this.matrix = t.readUint32Array(9), t.readUint32Array(6), this.next_track_id = t.readUint32();
    }), a.createBoxCtor("npck", function(t) {
        this.packetssent = t.readUint32();
    }), a.createBoxCtor("nump", function(t) {
        this.packetssent = t.readUint64();
    }), a.createFullBoxCtor("padb", function(t) {
        var e = t.readUint32();
        this.padbits = [];
        for(var s = 0; s < Math.floor((e + 1) / 2); s++)this.padbits = t.readUint8();
    }), a.createBoxCtor("pasp", function(t) {
        this.hSpacing = t.readUint32(), this.vSpacing = t.readUint32();
    }), a.createBoxCtor("payl", function(t) {
        this.text = t.readString(this.size - this.hdr_size);
    }), a.createBoxCtor("payt", function(t) {
        this.payloadID = t.readUint32();
        var e = t.readUint8();
        this.rtpmap_string = t.readString(e);
    }), a.createFullBoxCtor("pdin", function(t) {
        var e = (this.size - this.hdr_size) / 8;
        this.rate = [], this.initial_delay = [];
        for(var s = 0; s < e; s++)this.rate[s] = t.readUint32(), this.initial_delay[s] = t.readUint32();
    }), a.createFullBoxCtor("pitm", function(t) {
        this.version === 0 ? this.item_id = t.readUint16() : this.item_id = t.readUint32();
    }), a.createFullBoxCtor("pixi", function(t) {
        var e;
        for(this.num_channels = t.readUint8(), this.bits_per_channels = [], e = 0; e < this.num_channels; e++)this.bits_per_channels[e] = t.readUint8();
    }), a.createBoxCtor("pmax", function(t) {
        this.bytes = t.readUint32();
    }), a.createFullBoxCtor("prdi", function(t) {
        if (this.step_count = t.readUint16(), this.item_count = [], this.flags & 2) for(var e = 0; e < this.step_count; e++)this.item_count[e] = t.readUint16();
    }), a.createFullBoxCtor("prft", function(t) {
        this.ref_track_id = t.readUint32(), this.ntp_timestamp = t.readUint64(), this.version === 0 ? this.media_time = t.readUint32() : this.media_time = t.readUint64();
    }), a.createFullBoxCtor("pssh", function(t) {
        if (this.system_id = a.parseHex16(t), this.version > 0) {
            var e = t.readUint32();
            this.kid = [];
            for(var s = 0; s < e; s++)this.kid[s] = a.parseHex16(t);
        }
        var h = t.readUint32();
        h > 0 && (this.data = t.readUint8Array(h));
    }), a.createFullBoxCtor("clef", function(t) {
        this.width = t.readUint32(), this.height = t.readUint32();
    }), a.createFullBoxCtor("enof", function(t) {
        this.width = t.readUint32(), this.height = t.readUint32();
    }), a.createFullBoxCtor("prof", function(t) {
        this.width = t.readUint32(), this.height = t.readUint32();
    }), a.createContainerBoxCtor("tapt", null, [
        "clef",
        "prof",
        "enof"
    ]), a.createBoxCtor("rtp ", function(t) {
        this.descriptionformat = t.readString(4), this.sdptext = t.readString(this.size - this.hdr_size - 4);
    }), a.createFullBoxCtor("saio", function(t) {
        this.flags & 1 && (this.aux_info_type = t.readUint32(), this.aux_info_type_parameter = t.readUint32());
        var e = t.readUint32();
        this.offset = [];
        for(var s = 0; s < e; s++)this.version === 0 ? this.offset[s] = t.readUint32() : this.offset[s] = t.readUint64();
    }), a.createFullBoxCtor("saiz", function(t) {
        this.flags & 1 && (this.aux_info_type = t.readUint32(), this.aux_info_type_parameter = t.readUint32()), this.default_sample_info_size = t.readUint8();
        var e = t.readUint32();
        if (this.sample_info_size = [], this.default_sample_info_size === 0) for(var s = 0; s < e; s++)this.sample_info_size[s] = t.readUint8();
    }), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_METADATA, "mett", function(t) {
        this.parseHeader(t), this.content_encoding = t.readCString(), this.mime_format = t.readCString(), this.parseFooter(t);
    }), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_METADATA, "metx", function(t) {
        this.parseHeader(t), this.content_encoding = t.readCString(), this.namespace = t.readCString(), this.schema_location = t.readCString(), this.parseFooter(t);
    }), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_SUBTITLE, "sbtt", function(t) {
        this.parseHeader(t), this.content_encoding = t.readCString(), this.mime_format = t.readCString(), this.parseFooter(t);
    }), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_SUBTITLE, "stpp", function(t) {
        this.parseHeader(t), this.namespace = t.readCString(), this.schema_location = t.readCString(), this.auxiliary_mime_types = t.readCString(), this.parseFooter(t);
    }), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_SUBTITLE, "stxt", function(t) {
        this.parseHeader(t), this.content_encoding = t.readCString(), this.mime_format = t.readCString(), this.parseFooter(t);
    }), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_SUBTITLE, "tx3g", function(t) {
        this.parseHeader(t), this.displayFlags = t.readUint32(), this.horizontal_justification = t.readInt8(), this.vertical_justification = t.readInt8(), this.bg_color_rgba = t.readUint8Array(4), this.box_record = t.readInt16Array(4), this.style_record = t.readUint8Array(12), this.parseFooter(t);
    }), a.createSampleEntryCtor(a.SAMPLE_ENTRY_TYPE_METADATA, "wvtt", function(t) {
        this.parseHeader(t), this.parseFooter(t);
    }), a.createSampleGroupCtor("alst", function(t) {
        var e, s = t.readUint16();
        for(this.first_output_sample = t.readUint16(), this.sample_offset = [], e = 0; e < s; e++)this.sample_offset[e] = t.readUint32();
        var h = this.description_length - 4 - 4 * s;
        for(this.num_output_samples = [], this.num_total_samples = [], e = 0; e < h / 4; e++)this.num_output_samples[e] = t.readUint16(), this.num_total_samples[e] = t.readUint16();
    }), a.createSampleGroupCtor("avll", function(t) {
        this.layerNumber = t.readUint8(), this.accurateStatisticsFlag = t.readUint8(), this.avgBitRate = t.readUint16(), this.avgFrameRate = t.readUint16();
    }), a.createSampleGroupCtor("avss", function(t) {
        this.subSequenceIdentifier = t.readUint16(), this.layerNumber = t.readUint8();
        var e = t.readUint8();
        this.durationFlag = e >> 7, this.avgRateFlag = e >> 6 & 1, this.durationFlag && (this.duration = t.readUint32()), this.avgRateFlag && (this.accurateStatisticsFlag = t.readUint8(), this.avgBitRate = t.readUint16(), this.avgFrameRate = t.readUint16()), this.dependency = [];
        for(var s = t.readUint8(), h = 0; h < s; h++){
            var f = {};
            this.dependency.push(f), f.subSeqDirectionFlag = t.readUint8(), f.layerNumber = t.readUint8(), f.subSequenceIdentifier = t.readUint16();
        }
    }), a.createSampleGroupCtor("dtrt", function(t) {
        n.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    }), a.createSampleGroupCtor("mvif", function(t) {
        n.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    }), a.createSampleGroupCtor("prol", function(t) {
        this.roll_distance = t.readInt16();
    }), a.createSampleGroupCtor("rap ", function(t) {
        var e = t.readUint8();
        this.num_leading_samples_known = e >> 7, this.num_leading_samples = e & 127;
    }), a.createSampleGroupCtor("rash", function(t) {
        if (this.operation_point_count = t.readUint16(), this.description_length !== 2 + (this.operation_point_count === 1 ? 2 : this.operation_point_count * 6) + 9) n.warn("BoxParser", "Mismatch in " + this.grouping_type + " sample group length"), this.data = t.readUint8Array(this.description_length - 2);
        else {
            if (this.operation_point_count === 1) this.target_rate_share = t.readUint16();
            else {
                this.target_rate_share = [], this.available_bitrate = [];
                for(var e = 0; e < this.operation_point_count; e++)this.available_bitrate[e] = t.readUint32(), this.target_rate_share[e] = t.readUint16();
            }
            this.maximum_bitrate = t.readUint32(), this.minimum_bitrate = t.readUint32(), this.discard_priority = t.readUint8();
        }
    }), a.createSampleGroupCtor("roll", function(t) {
        this.roll_distance = t.readInt16();
    }), a.SampleGroupEntry.prototype.parse = function(t) {
        n.warn("BoxParser", "Unknown Sample Group type: " + this.grouping_type), this.data = t.readUint8Array(this.description_length);
    }, a.createSampleGroupCtor("scif", function(t) {
        n.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    }), a.createSampleGroupCtor("scnm", function(t) {
        n.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    }), a.createSampleGroupCtor("seig", function(t) {
        this.reserved = t.readUint8();
        var e = t.readUint8();
        this.crypt_byte_block = e >> 4, this.skip_byte_block = e & 15, this.isProtected = t.readUint8(), this.Per_Sample_IV_Size = t.readUint8(), this.KID = a.parseHex16(t), this.constant_IV_size = 0, this.constant_IV = 0, this.isProtected === 1 && this.Per_Sample_IV_Size === 0 && (this.constant_IV_size = t.readUint8(), this.constant_IV = t.readUint8Array(this.constant_IV_size));
    }), a.createSampleGroupCtor("stsa", function(t) {
        n.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    }), a.createSampleGroupCtor("sync", function(t) {
        var e = t.readUint8();
        this.NAL_unit_type = e & 63;
    }), a.createSampleGroupCtor("tele", function(t) {
        var e = t.readUint8();
        this.level_independently_decodable = e >> 7;
    }), a.createSampleGroupCtor("tsas", function(t) {
        n.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    }), a.createSampleGroupCtor("tscl", function(t) {
        n.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    }), a.createSampleGroupCtor("vipr", function(t) {
        n.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    }), a.createFullBoxCtor("sbgp", function(t) {
        this.grouping_type = t.readString(4), this.version === 1 ? this.grouping_type_parameter = t.readUint32() : this.grouping_type_parameter = 0, this.entries = [];
        for(var e = t.readUint32(), s = 0; s < e; s++){
            var h = {};
            this.entries.push(h), h.sample_count = t.readInt32(), h.group_description_index = t.readInt32();
        }
    }), a.createFullBoxCtor("schm", function(t) {
        this.scheme_type = t.readString(4), this.scheme_version = t.readUint32(), this.flags & 1 && (this.scheme_uri = t.readString(this.size - this.hdr_size - 8));
    }), a.createBoxCtor("sdp ", function(t) {
        this.sdptext = t.readString(this.size - this.hdr_size);
    }), a.createFullBoxCtor("sdtp", function(t) {
        var e, s = this.size - this.hdr_size;
        this.is_leading = [], this.sample_depends_on = [], this.sample_is_depended_on = [], this.sample_has_redundancy = [];
        for(var h = 0; h < s; h++)e = t.readUint8(), this.is_leading[h] = e >> 6, this.sample_depends_on[h] = e >> 4 & 3, this.sample_is_depended_on[h] = e >> 2 & 3, this.sample_has_redundancy[h] = e & 3;
    }), a.createFullBoxCtor("senc"), a.createFullBoxCtor("sgpd", function(t) {
        this.grouping_type = t.readString(4), n.debug("BoxParser", "Found Sample Groups of type " + this.grouping_type), this.version === 1 ? this.default_length = t.readUint32() : this.default_length = 0, this.version >= 2 && (this.default_group_description_index = t.readUint32()), this.entries = [];
        for(var e = t.readUint32(), s = 0; s < e; s++){
            var h;
            a[this.grouping_type + "SampleGroupEntry"] ? h = new a[this.grouping_type + "SampleGroupEntry"](this.grouping_type) : h = new a.SampleGroupEntry(this.grouping_type), this.entries.push(h), this.version === 1 ? this.default_length === 0 ? h.description_length = t.readUint32() : h.description_length = this.default_length : h.description_length = this.default_length, h.write === a.SampleGroupEntry.prototype.write && (n.info("BoxParser", "SampleGroup for type " + this.grouping_type + " writing not yet implemented, keeping unparsed data in memory for later write"), h.data = t.readUint8Array(h.description_length), t.position -= h.description_length), h.parse(t);
        }
    }), a.createFullBoxCtor("sidx", function(t) {
        this.reference_ID = t.readUint32(), this.timescale = t.readUint32(), this.version === 0 ? (this.earliest_presentation_time = t.readUint32(), this.first_offset = t.readUint32()) : (this.earliest_presentation_time = t.readUint64(), this.first_offset = t.readUint64()), t.readUint16(), this.references = [];
        for(var e = t.readUint16(), s = 0; s < e; s++){
            var h = {};
            this.references.push(h);
            var f = t.readUint32();
            h.reference_type = f >> 31 & 1, h.referenced_size = f & 2147483647, h.subsegment_duration = t.readUint32(), f = t.readUint32(), h.starts_with_SAP = f >> 31 & 1, h.SAP_type = f >> 28 & 7, h.SAP_delta_time = f & 268435455;
        }
    }), a.SingleItemTypeReferenceBox = function(t, e, s, h) {
        a.Box.call(this, t, e), this.hdr_size = s, this.start = h;
    }, a.SingleItemTypeReferenceBox.prototype = new a.Box(), a.SingleItemTypeReferenceBox.prototype.parse = function(t) {
        this.from_item_ID = t.readUint16();
        var e = t.readUint16();
        this.references = [];
        for(var s = 0; s < e; s++)this.references[s] = {}, this.references[s].to_item_ID = t.readUint16();
    }, a.SingleItemTypeReferenceBoxLarge = function(t, e, s, h) {
        a.Box.call(this, t, e), this.hdr_size = s, this.start = h;
    }, a.SingleItemTypeReferenceBoxLarge.prototype = new a.Box(), a.SingleItemTypeReferenceBoxLarge.prototype.parse = function(t) {
        this.from_item_ID = t.readUint32();
        var e = t.readUint16();
        this.references = [];
        for(var s = 0; s < e; s++)this.references[s] = {}, this.references[s].to_item_ID = t.readUint32();
    }, a.createFullBoxCtor("SmDm", function(t) {
        this.primaryRChromaticity_x = t.readUint16(), this.primaryRChromaticity_y = t.readUint16(), this.primaryGChromaticity_x = t.readUint16(), this.primaryGChromaticity_y = t.readUint16(), this.primaryBChromaticity_x = t.readUint16(), this.primaryBChromaticity_y = t.readUint16(), this.whitePointChromaticity_x = t.readUint16(), this.whitePointChromaticity_y = t.readUint16(), this.luminanceMax = t.readUint32(), this.luminanceMin = t.readUint32();
    }), a.createFullBoxCtor("smhd", function(t) {
        this.balance = t.readUint16(), t.readUint16();
    }), a.createFullBoxCtor("ssix", function(t) {
        this.subsegments = [];
        for(var e = t.readUint32(), s = 0; s < e; s++){
            var h = {};
            this.subsegments.push(h), h.ranges = [];
            for(var f = t.readUint32(), _ = 0; _ < f; _++){
                var g = {};
                h.ranges.push(g), g.level = t.readUint8(), g.range_size = t.readUint24();
            }
        }
    }), a.createFullBoxCtor("stco", function(t) {
        var e;
        if (e = t.readUint32(), this.chunk_offsets = [], this.version === 0) for(var s = 0; s < e; s++)this.chunk_offsets.push(t.readUint32());
    }), a.createFullBoxCtor("stdp", function(t) {
        var e = (this.size - this.hdr_size) / 2;
        this.priority = [];
        for(var s = 0; s < e; s++)this.priority[s] = t.readUint16();
    }), a.createFullBoxCtor("sthd"), a.createFullBoxCtor("stri", function(t) {
        this.switch_group = t.readUint16(), this.alternate_group = t.readUint16(), this.sub_track_id = t.readUint32();
        var e = (this.size - this.hdr_size - 8) / 4;
        this.attribute_list = [];
        for(var s = 0; s < e; s++)this.attribute_list[s] = t.readUint32();
    }), a.createFullBoxCtor("stsc", function(t) {
        var e, s;
        if (e = t.readUint32(), this.first_chunk = [], this.samples_per_chunk = [], this.sample_description_index = [], this.version === 0) for(s = 0; s < e; s++)this.first_chunk.push(t.readUint32()), this.samples_per_chunk.push(t.readUint32()), this.sample_description_index.push(t.readUint32());
    }), a.createFullBoxCtor("stsd", function(t) {
        var e, s, h, f;
        for(this.entries = [], h = t.readUint32(), e = 1; e <= h; e++)if (s = a.parseOneBox(t, !0, this.size - (t.getPosition() - this.start)), s.code === a.OK) a[s.type + "SampleEntry"] ? (f = new a[s.type + "SampleEntry"](s.size), f.hdr_size = s.hdr_size, f.start = s.start) : (n.warn("BoxParser", "Unknown sample entry type: " + s.type), f = new a.SampleEntry(s.type, s.size, s.hdr_size, s.start)), f.write === a.SampleEntry.prototype.write && (n.info("BoxParser", "SampleEntry " + f.type + " box writing not yet implemented, keeping unparsed data in memory for later write"), f.parseDataAndRewind(t)), f.parse(t), this.entries.push(f);
        else return;
    }), a.createFullBoxCtor("stsg", function(t) {
        this.grouping_type = t.readUint32();
        var e = t.readUint16();
        this.group_description_index = [];
        for(var s = 0; s < e; s++)this.group_description_index[s] = t.readUint32();
    }), a.createFullBoxCtor("stsh", function(t) {
        var e, s;
        if (e = t.readUint32(), this.shadowed_sample_numbers = [], this.sync_sample_numbers = [], this.version === 0) for(s = 0; s < e; s++)this.shadowed_sample_numbers.push(t.readUint32()), this.sync_sample_numbers.push(t.readUint32());
    }), a.createFullBoxCtor("stss", function(t) {
        var e, s;
        if (s = t.readUint32(), this.version === 0) for(this.sample_numbers = [], e = 0; e < s; e++)this.sample_numbers.push(t.readUint32());
    }), a.createFullBoxCtor("stsz", function(t) {
        var e;
        if (this.sample_sizes = [], this.version === 0) for(this.sample_size = t.readUint32(), this.sample_count = t.readUint32(), e = 0; e < this.sample_count; e++)this.sample_size === 0 ? this.sample_sizes.push(t.readUint32()) : this.sample_sizes[e] = this.sample_size;
    }), a.createFullBoxCtor("stts", function(t) {
        var e, s, h;
        if (e = t.readUint32(), this.sample_counts = [], this.sample_deltas = [], this.version === 0) for(s = 0; s < e; s++)this.sample_counts.push(t.readUint32()), h = t.readInt32(), h < 0 && (n.warn("BoxParser", "File uses negative stts sample delta, using value 1 instead, sync may be lost!"), h = 1), this.sample_deltas.push(h);
    }), a.createFullBoxCtor("stvi", function(t) {
        var e = t.readUint32();
        this.single_view_allowed = e & 3, this.stereo_scheme = t.readUint32();
        var s = t.readUint32();
        this.stereo_indication_type = t.readString(s);
        var h, f;
        for(this.boxes = []; t.getPosition() < this.start + this.size;)if (h = a.parseOneBox(t, !1, this.size - (t.getPosition() - this.start)), h.code === a.OK) f = h.box, this.boxes.push(f), this[f.type] = f;
        else return;
    }), a.createBoxCtor("styp", function(t) {
        a.ftypBox.prototype.parse.call(this, t);
    }), a.createFullBoxCtor("stz2", function(t) {
        var e, s;
        if (this.sample_sizes = [], this.version === 0) {
            if (this.reserved = t.readUint24(), this.field_size = t.readUint8(), s = t.readUint32(), this.field_size === 4) for(e = 0; e < s; e += 2){
                var h = t.readUint8();
                this.sample_sizes[e] = h >> 4 & 15, this.sample_sizes[e + 1] = h & 15;
            }
            else if (this.field_size === 8) for(e = 0; e < s; e++)this.sample_sizes[e] = t.readUint8();
            else if (this.field_size === 16) for(e = 0; e < s; e++)this.sample_sizes[e] = t.readUint16();
            else n.error("BoxParser", "Error in length field in stz2 box");
        }
    }), a.createFullBoxCtor("subs", function(t) {
        var e, s, h, f;
        for(h = t.readUint32(), this.entries = [], e = 0; e < h; e++){
            var _ = {};
            if (this.entries[e] = _, _.sample_delta = t.readUint32(), _.subsamples = [], f = t.readUint16(), f > 0) for(s = 0; s < f; s++){
                var g = {};
                _.subsamples.push(g), this.version == 1 ? g.size = t.readUint32() : g.size = t.readUint16(), g.priority = t.readUint8(), g.discardable = t.readUint8(), g.codec_specific_parameters = t.readUint32();
            }
        }
    }), a.createFullBoxCtor("tenc", function(t) {
        if (t.readUint8(), this.version === 0) t.readUint8();
        else {
            var e = t.readUint8();
            this.default_crypt_byte_block = e >> 4 & 15, this.default_skip_byte_block = e & 15;
        }
        this.default_isProtected = t.readUint8(), this.default_Per_Sample_IV_Size = t.readUint8(), this.default_KID = a.parseHex16(t), this.default_isProtected === 1 && this.default_Per_Sample_IV_Size === 0 && (this.default_constant_IV_size = t.readUint8(), this.default_constant_IV = t.readUint8Array(this.default_constant_IV_size));
    }), a.createFullBoxCtor("tfdt", function(t) {
        this.version == 1 ? this.baseMediaDecodeTime = t.readUint64() : this.baseMediaDecodeTime = t.readUint32();
    }), a.createFullBoxCtor("tfhd", function(t) {
        var e = 0;
        this.track_id = t.readUint32(), this.size - this.hdr_size > e && this.flags & a.TFHD_FLAG_BASE_DATA_OFFSET ? (this.base_data_offset = t.readUint64(), e += 8) : this.base_data_offset = 0, this.size - this.hdr_size > e && this.flags & a.TFHD_FLAG_SAMPLE_DESC ? (this.default_sample_description_index = t.readUint32(), e += 4) : this.default_sample_description_index = 0, this.size - this.hdr_size > e && this.flags & a.TFHD_FLAG_SAMPLE_DUR ? (this.default_sample_duration = t.readUint32(), e += 4) : this.default_sample_duration = 0, this.size - this.hdr_size > e && this.flags & a.TFHD_FLAG_SAMPLE_SIZE ? (this.default_sample_size = t.readUint32(), e += 4) : this.default_sample_size = 0, this.size - this.hdr_size > e && this.flags & a.TFHD_FLAG_SAMPLE_FLAGS ? (this.default_sample_flags = t.readUint32(), e += 4) : this.default_sample_flags = 0;
    }), a.createFullBoxCtor("tfra", function(t) {
        this.track_ID = t.readUint32(), t.readUint24();
        var e = t.readUint8();
        this.length_size_of_traf_num = e >> 4 & 3, this.length_size_of_trun_num = e >> 2 & 3, this.length_size_of_sample_num = e & 3, this.entries = [];
        for(var s = t.readUint32(), h = 0; h < s; h++)this.version === 1 ? (this.time = t.readUint64(), this.moof_offset = t.readUint64()) : (this.time = t.readUint32(), this.moof_offset = t.readUint32()), this.traf_number = t["readUint" + 8 * (this.length_size_of_traf_num + 1)](), this.trun_number = t["readUint" + 8 * (this.length_size_of_trun_num + 1)](), this.sample_number = t["readUint" + 8 * (this.length_size_of_sample_num + 1)]();
    }), a.createFullBoxCtor("tkhd", function(t) {
        this.version == 1 ? (this.creation_time = t.readUint64(), this.modification_time = t.readUint64(), this.track_id = t.readUint32(), t.readUint32(), this.duration = t.readUint64()) : (this.creation_time = t.readUint32(), this.modification_time = t.readUint32(), this.track_id = t.readUint32(), t.readUint32(), this.duration = t.readUint32()), t.readUint32Array(2), this.layer = t.readInt16(), this.alternate_group = t.readInt16(), this.volume = t.readInt16() >> 8, t.readUint16(), this.matrix = t.readInt32Array(9), this.width = t.readUint32(), this.height = t.readUint32();
    }), a.createBoxCtor("tmax", function(t) {
        this.time = t.readUint32();
    }), a.createBoxCtor("tmin", function(t) {
        this.time = t.readUint32();
    }), a.createBoxCtor("totl", function(t) {
        this.bytessent = t.readUint32();
    }), a.createBoxCtor("tpay", function(t) {
        this.bytessent = t.readUint32();
    }), a.createBoxCtor("tpyl", function(t) {
        this.bytessent = t.readUint64();
    }), a.TrackGroupTypeBox.prototype.parse = function(t) {
        this.parseFullHeader(t), this.track_group_id = t.readUint32();
    }, a.createTrackGroupCtor("msrc"), a.TrackReferenceTypeBox = function(t, e, s, h) {
        a.Box.call(this, t, e), this.hdr_size = s, this.start = h;
    }, a.TrackReferenceTypeBox.prototype = new a.Box(), a.TrackReferenceTypeBox.prototype.parse = function(t) {
        this.track_ids = t.readUint32Array((this.size - this.hdr_size) / 4);
    }, a.trefBox.prototype.parse = function(t) {
        for(var e, s; t.getPosition() < this.start + this.size;)if (e = a.parseOneBox(t, !0, this.size - (t.getPosition() - this.start)), e.code === a.OK) s = new a.TrackReferenceTypeBox(e.type, e.size, e.hdr_size, e.start), s.write === a.Box.prototype.write && s.type !== "mdat" && (n.info("BoxParser", "TrackReference " + s.type + " box writing not yet implemented, keeping unparsed data in memory for later write"), s.parseDataAndRewind(t)), s.parse(t), this.boxes.push(s);
        else return;
    }, a.createFullBoxCtor("trep", function(t) {
        for(this.track_ID = t.readUint32(), this.boxes = []; t.getPosition() < this.start + this.size;)if (ret = a.parseOneBox(t, !1, this.size - (t.getPosition() - this.start)), ret.code === a.OK) box = ret.box, this.boxes.push(box);
        else return;
    }), a.createFullBoxCtor("trex", function(t) {
        this.track_id = t.readUint32(), this.default_sample_description_index = t.readUint32(), this.default_sample_duration = t.readUint32(), this.default_sample_size = t.readUint32(), this.default_sample_flags = t.readUint32();
    }), a.createBoxCtor("trpy", function(t) {
        this.bytessent = t.readUint64();
    }), a.createFullBoxCtor("trun", function(t) {
        var e = 0;
        if (this.sample_count = t.readUint32(), e += 4, this.size - this.hdr_size > e && this.flags & a.TRUN_FLAGS_DATA_OFFSET ? (this.data_offset = t.readInt32(), e += 4) : this.data_offset = 0, this.size - this.hdr_size > e && this.flags & a.TRUN_FLAGS_FIRST_FLAG ? (this.first_sample_flags = t.readUint32(), e += 4) : this.first_sample_flags = 0, this.sample_duration = [], this.sample_size = [], this.sample_flags = [], this.sample_composition_time_offset = [], this.size - this.hdr_size > e) for(var s = 0; s < this.sample_count; s++)this.flags & a.TRUN_FLAGS_DURATION && (this.sample_duration[s] = t.readUint32()), this.flags & a.TRUN_FLAGS_SIZE && (this.sample_size[s] = t.readUint32()), this.flags & a.TRUN_FLAGS_FLAGS && (this.sample_flags[s] = t.readUint32()), this.flags & a.TRUN_FLAGS_CTS_OFFSET && (this.version === 0 ? this.sample_composition_time_offset[s] = t.readUint32() : this.sample_composition_time_offset[s] = t.readInt32());
    }), a.createFullBoxCtor("tsel", function(t) {
        this.switch_group = t.readUint32();
        var e = (this.size - this.hdr_size - 4) / 4;
        this.attribute_list = [];
        for(var s = 0; s < e; s++)this.attribute_list[s] = t.readUint32();
    }), a.createFullBoxCtor("txtC", function(t) {
        this.config = t.readCString();
    }), a.createBoxCtor("tyco", function(t) {
        var e = (this.size - this.hdr_size) / 4;
        this.compatible_brands = [];
        for(var s = 0; s < e; s++)this.compatible_brands[s] = t.readString(4);
    }), a.createFullBoxCtor("udes", function(t) {
        this.lang = t.readCString(), this.name = t.readCString(), this.description = t.readCString(), this.tags = t.readCString();
    }), a.createFullBoxCtor("uncC", function(t) {
        var e;
        for(this.profile = t.readUint32(), this.component_count = t.readUint16(), this.component_index = [], this.component_bit_depth_minus_one = [], this.component_format = [], this.component_align_size = [], e = 0; e < this.component_count; e++)this.component_index.push(t.readUint16()), this.component_bit_depth_minus_one.push(t.readUint8()), this.component_format.push(t.readUint8()), this.component_align_size.push(t.readUint8());
        this.sampling_type = t.readUint8(), this.interleave_type = t.readUint8(), this.block_size = t.readUint8();
        var s = t.readUint8();
        this.component_little_endian = s >> 7 & 1, this.block_pad_lsb = s >> 6 & 1, this.block_little_endian = s >> 5 & 1, this.block_reversed = s >> 4 & 1, this.pad_unknown = s >> 3 & 1, this.pixel_size = t.readUint8(), this.row_align_size = t.readUint32(), this.tile_align_size = t.readUint32(), this.num_tile_cols_minus_one = t.readUint32(), this.num_tile_rows_minus_one = t.readUint32();
    }), a.createFullBoxCtor("url ", function(t) {
        this.flags !== 1 && (this.location = t.readCString());
    }), a.createFullBoxCtor("urn ", function(t) {
        this.name = t.readCString(), this.size - this.hdr_size - this.name.length - 1 > 0 && (this.location = t.readCString());
    }), a.createUUIDBox("a5d40b30e81411ddba2f0800200c9a66", !0, !1, function(t) {
        this.LiveServerManifest = t.readString(this.size - this.hdr_size).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }), a.createUUIDBox("d08a4f1810f34a82b6c832d8aba183d3", !0, !1, function(t) {
        this.system_id = a.parseHex16(t);
        var e = t.readUint32();
        e > 0 && (this.data = t.readUint8Array(e));
    }), a.createUUIDBox("a2394f525a9b4f14a2446c427c648df4", !0, !1), a.createUUIDBox("8974dbce7be74c5184f97148f9882554", !0, !1, function(t) {
        this.default_AlgorithmID = t.readUint24(), this.default_IV_size = t.readUint8(), this.default_KID = a.parseHex16(t);
    }), a.createUUIDBox("d4807ef2ca3946958e5426cb9e46a79f", !0, !1, function(t) {
        this.fragment_count = t.readUint8(), this.entries = [];
        for(var e = 0; e < this.fragment_count; e++){
            var s = {}, h = 0, f = 0;
            this.version === 1 ? (h = t.readUint64(), f = t.readUint64()) : (h = t.readUint32(), f = t.readUint32()), s.absolute_time = h, s.absolute_duration = f, this.entries.push(s);
        }
    }), a.createUUIDBox("6d1d9b0542d544e680e2141daff757b2", !0, !1, function(t) {
        this.version === 1 ? (this.absolute_time = t.readUint64(), this.duration = t.readUint64()) : (this.absolute_time = t.readUint32(), this.duration = t.readUint32());
    }), a.createFullBoxCtor("vmhd", function(t) {
        this.graphicsmode = t.readUint16(), this.opcolor = t.readUint16Array(3);
    }), a.createFullBoxCtor("vpcC", function(t) {
        var e;
        this.version === 1 ? (this.profile = t.readUint8(), this.level = t.readUint8(), e = t.readUint8(), this.bitDepth = e >> 4, this.chromaSubsampling = e >> 1 & 7, this.videoFullRangeFlag = e & 1, this.colourPrimaries = t.readUint8(), this.transferCharacteristics = t.readUint8(), this.matrixCoefficients = t.readUint8(), this.codecIntializationDataSize = t.readUint16(), this.codecIntializationData = t.readUint8Array(this.codecIntializationDataSize)) : (this.profile = t.readUint8(), this.level = t.readUint8(), e = t.readUint8(), this.bitDepth = e >> 4 & 15, this.colorSpace = e & 15, e = t.readUint8(), this.chromaSubsampling = e >> 4 & 15, this.transferFunction = e >> 1 & 7, this.videoFullRangeFlag = e & 1, this.codecIntializationDataSize = t.readUint16(), this.codecIntializationData = t.readUint8Array(this.codecIntializationDataSize));
    }), a.createBoxCtor("vttC", function(t) {
        this.text = t.readString(this.size - this.hdr_size);
    }), a.createFullBoxCtor("vvcC", function(t) {
        var e, s, h = {
            held_bits: void 0,
            num_held_bits: 0,
            stream_read_1_bytes: function(A) {
                this.held_bits = A.readUint8(), this.num_held_bits = 8;
            },
            stream_read_2_bytes: function(A) {
                this.held_bits = A.readUint16(), this.num_held_bits = 16;
            },
            extract_bits: function(A) {
                var L = this.held_bits >> this.num_held_bits - A & (1 << A) - 1;
                return this.num_held_bits -= A, L;
            }
        };
        if (h.stream_read_1_bytes(t), h.extract_bits(5), this.lengthSizeMinusOne = h.extract_bits(2), this.ptl_present_flag = h.extract_bits(1), this.ptl_present_flag) {
            h.stream_read_2_bytes(t), this.ols_idx = h.extract_bits(9), this.num_sublayers = h.extract_bits(3), this.constant_frame_rate = h.extract_bits(2), this.chroma_format_idc = h.extract_bits(2), h.stream_read_1_bytes(t), this.bit_depth_minus8 = h.extract_bits(3), h.extract_bits(5);
            if (h.stream_read_2_bytes(t), h.extract_bits(2), this.num_bytes_constraint_info = h.extract_bits(6), this.general_profile_idc = h.extract_bits(7), this.general_tier_flag = h.extract_bits(1), this.general_level_idc = t.readUint8(), h.stream_read_1_bytes(t), this.ptl_frame_only_constraint_flag = h.extract_bits(1), this.ptl_multilayer_enabled_flag = h.extract_bits(1), this.general_constraint_info = new Uint8Array(this.num_bytes_constraint_info), this.num_bytes_constraint_info) {
                for(e = 0; e < this.num_bytes_constraint_info - 1; e++){
                    var f = h.extract_bits(6);
                    h.stream_read_1_bytes(t);
                    var _ = h.extract_bits(2);
                    this.general_constraint_info[e] = f << 2 | _;
                }
                this.general_constraint_info[this.num_bytes_constraint_info - 1] = h.extract_bits(6);
            } else h.extract_bits(6);
            if (this.num_sublayers > 1) {
                for(h.stream_read_1_bytes(t), this.ptl_sublayer_present_mask = 0, s = this.num_sublayers - 2; s >= 0; --s){
                    var g = h.extract_bits(1);
                    this.ptl_sublayer_present_mask |= g << s;
                }
                for(s = this.num_sublayers; s <= 8 && this.num_sublayers > 1; ++s)h.extract_bits(1);
                for(this.sublayer_level_idc = [], s = this.num_sublayers - 2; s >= 0; --s)this.ptl_sublayer_present_mask & 1 << s && (this.sublayer_level_idc[s] = t.readUint8());
            }
            if (this.ptl_num_sub_profiles = t.readUint8(), this.general_sub_profile_idc = [], this.ptl_num_sub_profiles) for(e = 0; e < this.ptl_num_sub_profiles; e++)this.general_sub_profile_idc.push(t.readUint32());
            this.max_picture_width = t.readUint16(), this.max_picture_height = t.readUint16(), this.avg_frame_rate = t.readUint16();
        }
        var m = 12, w = 13;
        this.nalu_arrays = [];
        var S = t.readUint8();
        for(e = 0; e < S; e++){
            var E = [];
            this.nalu_arrays.push(E), h.stream_read_1_bytes(t), E.completeness = h.extract_bits(1), h.extract_bits(2), E.nalu_type = h.extract_bits(5);
            var I = 1;
            for(E.nalu_type != w && E.nalu_type != m && (I = t.readUint16()), s = 0; s < I; s++){
                var R = t.readUint16();
                E.push({
                    data: t.readUint8Array(R),
                    length: R
                });
            }
        }
    }), a.createFullBoxCtor("vvnC", function(t) {
        var e = strm.readUint8();
        this.lengthSizeMinusOne = e & 3;
    }), a.SampleEntry.prototype.isVideo = function() {
        return !1;
    }, a.SampleEntry.prototype.isAudio = function() {
        return !1;
    }, a.SampleEntry.prototype.isSubtitle = function() {
        return !1;
    }, a.SampleEntry.prototype.isMetadata = function() {
        return !1;
    }, a.SampleEntry.prototype.isHint = function() {
        return !1;
    }, a.SampleEntry.prototype.getCodec = function() {
        return this.type.replace(".", "");
    }, a.SampleEntry.prototype.getWidth = function() {
        return "";
    }, a.SampleEntry.prototype.getHeight = function() {
        return "";
    }, a.SampleEntry.prototype.getChannelCount = function() {
        return "";
    }, a.SampleEntry.prototype.getSampleRate = function() {
        return "";
    }, a.SampleEntry.prototype.getSampleSize = function() {
        return "";
    }, a.VisualSampleEntry.prototype.isVideo = function() {
        return !0;
    }, a.VisualSampleEntry.prototype.getWidth = function() {
        return this.width;
    }, a.VisualSampleEntry.prototype.getHeight = function() {
        return this.height;
    }, a.AudioSampleEntry.prototype.isAudio = function() {
        return !0;
    }, a.AudioSampleEntry.prototype.getChannelCount = function() {
        return this.channel_count;
    }, a.AudioSampleEntry.prototype.getSampleRate = function() {
        return this.samplerate;
    }, a.AudioSampleEntry.prototype.getSampleSize = function() {
        return this.samplesize;
    }, a.SubtitleSampleEntry.prototype.isSubtitle = function() {
        return !0;
    }, a.MetadataSampleEntry.prototype.isMetadata = function() {
        return !0;
    }, a.decimalToHex = function(t, e) {
        var s = Number(t).toString(16);
        for(e = typeof e > "u" || e === null ? e = 2 : e; s.length < e;)s = "0" + s;
        return s;
    }, a.avc1SampleEntry.prototype.getCodec = a.avc2SampleEntry.prototype.getCodec = a.avc3SampleEntry.prototype.getCodec = a.avc4SampleEntry.prototype.getCodec = function() {
        var t = a.SampleEntry.prototype.getCodec.call(this);
        return this.avcC ? t + "." + a.decimalToHex(this.avcC.AVCProfileIndication) + a.decimalToHex(this.avcC.profile_compatibility) + a.decimalToHex(this.avcC.AVCLevelIndication) : t;
    }, a.hev1SampleEntry.prototype.getCodec = a.hvc1SampleEntry.prototype.getCodec = function() {
        var t, e = a.SampleEntry.prototype.getCodec.call(this);
        if (this.hvcC) {
            switch(e += ".", this.hvcC.general_profile_space){
                case 0:
                    e += "";
                    break;
                case 1:
                    e += "A";
                    break;
                case 2:
                    e += "B";
                    break;
                case 3:
                    e += "C";
                    break;
            }
            e += this.hvcC.general_profile_idc, e += ".";
            var s = this.hvcC.general_profile_compatibility, h = 0;
            for(t = 0; t < 32 && (h |= s & 1, t != 31); t++)h <<= 1, s >>= 1;
            e += a.decimalToHex(h, 0), e += ".", this.hvcC.general_tier_flag === 0 ? e += "L" : e += "H", e += this.hvcC.general_level_idc;
            var f = !1, _ = "";
            for(t = 5; t >= 0; t--)(this.hvcC.general_constraint_indicator[t] || f) && (_ = "." + a.decimalToHex(this.hvcC.general_constraint_indicator[t], 0) + _, f = !0);
            e += _;
        }
        return e;
    }, a.vvc1SampleEntry.prototype.getCodec = a.vvi1SampleEntry.prototype.getCodec = function() {
        var t, e = a.SampleEntry.prototype.getCodec.call(this);
        if (this.vvcC) {
            e += "." + this.vvcC.general_profile_idc, this.vvcC.general_tier_flag ? e += ".H" : e += ".L", e += this.vvcC.general_level_idc;
            var s = "";
            if (this.vvcC.general_constraint_info) {
                var h = [], f = 0;
                f |= this.vvcC.ptl_frame_only_constraint << 7, f |= this.vvcC.ptl_multilayer_enabled << 6;
                var _;
                for(t = 0; t < this.vvcC.general_constraint_info.length; ++t)f |= this.vvcC.general_constraint_info[t] >> 2 & 63, h.push(f), f && (_ = t), f = this.vvcC.general_constraint_info[t] >> 2 & 3;
                if (_ === void 0) s = ".CA";
                else {
                    s = ".C";
                    var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", m = 0, w = 0;
                    for(t = 0; t <= _; ++t)for(m = m << 8 | h[t], w += 8; w >= 5;){
                        var S = m >> w - 5 & 31;
                        s += g[S], w -= 5, m &= (1 << w) - 1;
                    }
                    w && (m <<= 5 - w, s += g[m & 31]);
                }
            }
            e += s;
        }
        return e;
    }, a.mp4aSampleEntry.prototype.getCodec = function() {
        var t = a.SampleEntry.prototype.getCodec.call(this);
        if (this.esds && this.esds.esd) {
            var e = this.esds.esd.getOTI(), s = this.esds.esd.getAudioConfig();
            return t + "." + a.decimalToHex(e) + (s ? "." + s : "");
        } else return t;
    }, a.stxtSampleEntry.prototype.getCodec = function() {
        var t = a.SampleEntry.prototype.getCodec.call(this);
        return this.mime_format ? t + "." + this.mime_format : t;
    }, a.vp08SampleEntry.prototype.getCodec = a.vp09SampleEntry.prototype.getCodec = function() {
        var t = a.SampleEntry.prototype.getCodec.call(this), e = this.vpcC.level;
        e == 0 && (e = "00");
        var s = this.vpcC.bitDepth;
        return s == 8 && (s = "08"), t + ".0" + this.vpcC.profile + "." + e + "." + s;
    }, a.av01SampleEntry.prototype.getCodec = function() {
        var t = a.SampleEntry.prototype.getCodec.call(this), e = this.av1C.seq_level_idx_0;
        e < 10 && (e = "0" + e);
        var s;
        return this.av1C.seq_profile === 2 && this.av1C.high_bitdepth === 1 ? s = this.av1C.twelve_bit === 1 ? "12" : "10" : this.av1C.seq_profile <= 2 && (s = this.av1C.high_bitdepth === 1 ? "10" : "08"), t + "." + this.av1C.seq_profile + "." + e + (this.av1C.seq_tier_0 ? "H" : "M") + "." + s;
    }, a.Box.prototype.writeHeader = function(t, e) {
        this.size += 8, this.size > d && (this.size += 8), this.type === "uuid" && (this.size += 16), n.debug("BoxWriter", "Writing box " + this.type + " of size: " + this.size + " at position " + t.getPosition() + (e || "")), this.size > d ? t.writeUint32(1) : (this.sizePosition = t.getPosition(), t.writeUint32(this.size)), t.writeString(this.type, null, 4), this.type === "uuid" && t.writeUint8Array(this.uuid), this.size > d && t.writeUint64(this.size);
    }, a.FullBox.prototype.writeHeader = function(t) {
        this.size += 4, a.Box.prototype.writeHeader.call(this, t, " v=" + this.version + " f=" + this.flags), t.writeUint8(this.version), t.writeUint24(this.flags);
    }, a.Box.prototype.write = function(t) {
        this.type === "mdat" ? this.data && (this.size = this.data.length, this.writeHeader(t), t.writeUint8Array(this.data)) : (this.size = this.data ? this.data.length : 0, this.writeHeader(t), this.data && t.writeUint8Array(this.data));
    }, a.ContainerBox.prototype.write = function(t) {
        this.size = 0, this.writeHeader(t);
        for(var e = 0; e < this.boxes.length; e++)this.boxes[e] && (this.boxes[e].write(t), this.size += this.boxes[e].size);
        n.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size), t.adjustUint32(this.sizePosition, this.size);
    }, a.TrackReferenceTypeBox.prototype.write = function(t) {
        this.size = this.track_ids.length * 4, this.writeHeader(t), t.writeUint32Array(this.track_ids);
    }, a.avcCBox.prototype.write = function(t) {
        var e;
        for(this.size = 7, e = 0; e < this.SPS.length; e++)this.size += 2 + this.SPS[e].length;
        for(e = 0; e < this.PPS.length; e++)this.size += 2 + this.PPS[e].length;
        for(this.ext && (this.size += this.ext.length), this.writeHeader(t), t.writeUint8(this.configurationVersion), t.writeUint8(this.AVCProfileIndication), t.writeUint8(this.profile_compatibility), t.writeUint8(this.AVCLevelIndication), t.writeUint8(this.lengthSizeMinusOne + 252), t.writeUint8(this.SPS.length + 224), e = 0; e < this.SPS.length; e++)t.writeUint16(this.SPS[e].length), t.writeUint8Array(this.SPS[e].nalu);
        for(t.writeUint8(this.PPS.length), e = 0; e < this.PPS.length; e++)t.writeUint16(this.PPS[e].length), t.writeUint8Array(this.PPS[e].nalu);
        this.ext && t.writeUint8Array(this.ext);
    }, a.co64Box.prototype.write = function(t) {
        var e;
        for(this.version = 0, this.flags = 0, this.size = 4 + 8 * this.chunk_offsets.length, this.writeHeader(t), t.writeUint32(this.chunk_offsets.length), e = 0; e < this.chunk_offsets.length; e++)t.writeUint64(this.chunk_offsets[e]);
    }, a.cslgBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 20, this.writeHeader(t), t.writeInt32(this.compositionToDTSShift), t.writeInt32(this.leastDecodeToDisplayDelta), t.writeInt32(this.greatestDecodeToDisplayDelta), t.writeInt32(this.compositionStartTime), t.writeInt32(this.compositionEndTime);
    }, a.cttsBox.prototype.write = function(t) {
        var e;
        for(this.version = 0, this.flags = 0, this.size = 4 + 8 * this.sample_counts.length, this.writeHeader(t), t.writeUint32(this.sample_counts.length), e = 0; e < this.sample_counts.length; e++)t.writeUint32(this.sample_counts[e]), this.version === 1 ? t.writeInt32(this.sample_offsets[e]) : t.writeUint32(this.sample_offsets[e]);
    }, a.drefBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 4, this.writeHeader(t), t.writeUint32(this.entries.length);
        for(var e = 0; e < this.entries.length; e++)this.entries[e].write(t), this.size += this.entries[e].size;
        n.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size), t.adjustUint32(this.sizePosition, this.size);
    }, a.elngBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = this.extended_language.length, this.writeHeader(t), t.writeString(this.extended_language);
    }, a.elstBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 4 + 12 * this.entries.length, this.writeHeader(t), t.writeUint32(this.entries.length);
        for(var e = 0; e < this.entries.length; e++){
            var s = this.entries[e];
            t.writeUint32(s.segment_duration), t.writeInt32(s.media_time), t.writeInt16(s.media_rate_integer), t.writeInt16(s.media_rate_fraction);
        }
    }, a.emsgBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 16 + this.message_data.length + (this.scheme_id_uri.length + 1) + (this.value.length + 1), this.writeHeader(t), t.writeCString(this.scheme_id_uri), t.writeCString(this.value), t.writeUint32(this.timescale), t.writeUint32(this.presentation_time_delta), t.writeUint32(this.event_duration), t.writeUint32(this.id), t.writeUint8Array(this.message_data);
    }, a.ftypBox.prototype.write = function(t) {
        this.size = 8 + 4 * this.compatible_brands.length, this.writeHeader(t), t.writeString(this.major_brand, null, 4), t.writeUint32(this.minor_version);
        for(var e = 0; e < this.compatible_brands.length; e++)t.writeString(this.compatible_brands[e], null, 4);
    }, a.hdlrBox.prototype.write = function(t) {
        this.size = 20 + this.name.length + 1, this.version = 0, this.flags = 0, this.writeHeader(t), t.writeUint32(0), t.writeString(this.handler, null, 4), t.writeUint32(0), t.writeUint32(0), t.writeUint32(0), t.writeCString(this.name);
    }, a.hvcCBox.prototype.write = function(t) {
        var e, s;
        for(this.size = 23, e = 0; e < this.nalu_arrays.length; e++)for(this.size += 3, s = 0; s < this.nalu_arrays[e].length; s++)this.size += 2 + this.nalu_arrays[e][s].data.length;
        for(this.writeHeader(t), t.writeUint8(this.configurationVersion), t.writeUint8(this.general_profile_space << 6 + this.general_tier_flag << 5 + this.general_profile_idc), t.writeUint32(this.general_profile_compatibility), t.writeUint8Array(this.general_constraint_indicator), t.writeUint8(this.general_level_idc), t.writeUint16(this.min_spatial_segmentation_idc + 251658240), t.writeUint8(this.parallelismType + 252), t.writeUint8(this.chroma_format_idc + 252), t.writeUint8(this.bit_depth_luma_minus8 + 248), t.writeUint8(this.bit_depth_chroma_minus8 + 248), t.writeUint16(this.avgFrameRate), t.writeUint8((this.constantFrameRate << 6) + (this.numTemporalLayers << 3) + (this.temporalIdNested << 2) + this.lengthSizeMinusOne), t.writeUint8(this.nalu_arrays.length), e = 0; e < this.nalu_arrays.length; e++)for(t.writeUint8((this.nalu_arrays[e].completeness << 7) + this.nalu_arrays[e].nalu_type), t.writeUint16(this.nalu_arrays[e].length), s = 0; s < this.nalu_arrays[e].length; s++)t.writeUint16(this.nalu_arrays[e][s].data.length), t.writeUint8Array(this.nalu_arrays[e][s].data);
    }, a.kindBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = this.schemeURI.length + 1 + (this.value.length + 1), this.writeHeader(t), t.writeCString(this.schemeURI), t.writeCString(this.value);
    }, a.mdhdBox.prototype.write = function(t) {
        this.size = 20, this.flags = 0, this.version = 0, this.writeHeader(t), t.writeUint32(this.creation_time), t.writeUint32(this.modification_time), t.writeUint32(this.timescale), t.writeUint32(this.duration), t.writeUint16(this.language), t.writeUint16(0);
    }, a.mehdBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 4, this.writeHeader(t), t.writeUint32(this.fragment_duration);
    }, a.mfhdBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 4, this.writeHeader(t), t.writeUint32(this.sequence_number);
    }, a.mvhdBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 96, this.writeHeader(t), t.writeUint32(this.creation_time), t.writeUint32(this.modification_time), t.writeUint32(this.timescale), t.writeUint32(this.duration), t.writeUint32(this.rate), t.writeUint16(this.volume << 8), t.writeUint16(0), t.writeUint32(0), t.writeUint32(0), t.writeUint32Array(this.matrix), t.writeUint32(0), t.writeUint32(0), t.writeUint32(0), t.writeUint32(0), t.writeUint32(0), t.writeUint32(0), t.writeUint32(this.next_track_id);
    }, a.SampleEntry.prototype.writeHeader = function(t) {
        this.size = 8, a.Box.prototype.writeHeader.call(this, t), t.writeUint8(0), t.writeUint8(0), t.writeUint8(0), t.writeUint8(0), t.writeUint8(0), t.writeUint8(0), t.writeUint16(this.data_reference_index);
    }, a.SampleEntry.prototype.writeFooter = function(t) {
        for(var e = 0; e < this.boxes.length; e++)this.boxes[e].write(t), this.size += this.boxes[e].size;
        n.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size), t.adjustUint32(this.sizePosition, this.size);
    }, a.SampleEntry.prototype.write = function(t) {
        this.writeHeader(t), t.writeUint8Array(this.data), this.size += this.data.length, n.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size), t.adjustUint32(this.sizePosition, this.size);
    }, a.VisualSampleEntry.prototype.write = function(t) {
        this.writeHeader(t), this.size += 70, t.writeUint16(0), t.writeUint16(0), t.writeUint32(0), t.writeUint32(0), t.writeUint32(0), t.writeUint16(this.width), t.writeUint16(this.height), t.writeUint32(this.horizresolution), t.writeUint32(this.vertresolution), t.writeUint32(0), t.writeUint16(this.frame_count), t.writeUint8(Math.min(31, this.compressorname.length)), t.writeString(this.compressorname, null, 31), t.writeUint16(this.depth), t.writeInt16(-1), this.writeFooter(t);
    }, a.AudioSampleEntry.prototype.write = function(t) {
        this.writeHeader(t), this.size += 20, t.writeUint32(0), t.writeUint32(0), t.writeUint16(this.channel_count), t.writeUint16(this.samplesize), t.writeUint16(0), t.writeUint16(0), t.writeUint32(this.samplerate << 16), this.writeFooter(t);
    }, a.stppSampleEntry.prototype.write = function(t) {
        this.writeHeader(t), this.size += this.namespace.length + 1 + this.schema_location.length + 1 + this.auxiliary_mime_types.length + 1, t.writeCString(this.namespace), t.writeCString(this.schema_location), t.writeCString(this.auxiliary_mime_types), this.writeFooter(t);
    }, a.SampleGroupEntry.prototype.write = function(t) {
        t.writeUint8Array(this.data);
    }, a.sbgpBox.prototype.write = function(t) {
        this.version = 1, this.flags = 0, this.size = 12 + 8 * this.entries.length, this.writeHeader(t), t.writeString(this.grouping_type, null, 4), t.writeUint32(this.grouping_type_parameter), t.writeUint32(this.entries.length);
        for(var e = 0; e < this.entries.length; e++){
            var s = this.entries[e];
            t.writeInt32(s.sample_count), t.writeInt32(s.group_description_index);
        }
    }, a.sgpdBox.prototype.write = function(t) {
        var e, s;
        for(this.flags = 0, this.size = 12, e = 0; e < this.entries.length; e++)s = this.entries[e], this.version === 1 && (this.default_length === 0 && (this.size += 4), this.size += s.data.length);
        for(this.writeHeader(t), t.writeString(this.grouping_type, null, 4), this.version === 1 && t.writeUint32(this.default_length), this.version >= 2 && t.writeUint32(this.default_sample_description_index), t.writeUint32(this.entries.length), e = 0; e < this.entries.length; e++)s = this.entries[e], this.version === 1 && this.default_length === 0 && t.writeUint32(s.description_length), s.write(t);
    }, a.sidxBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 20 + 12 * this.references.length, this.writeHeader(t), t.writeUint32(this.reference_ID), t.writeUint32(this.timescale), t.writeUint32(this.earliest_presentation_time), t.writeUint32(this.first_offset), t.writeUint16(0), t.writeUint16(this.references.length);
        for(var e = 0; e < this.references.length; e++){
            var s = this.references[e];
            t.writeUint32(s.reference_type << 31 | s.referenced_size), t.writeUint32(s.subsegment_duration), t.writeUint32(s.starts_with_SAP << 31 | s.SAP_type << 28 | s.SAP_delta_time);
        }
    }, a.smhdBox.prototype.write = function(t) {
        this.version = 0, this.flags = 1, this.size = 4, this.writeHeader(t), t.writeUint16(this.balance), t.writeUint16(0);
    }, a.stcoBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 4 + 4 * this.chunk_offsets.length, this.writeHeader(t), t.writeUint32(this.chunk_offsets.length), t.writeUint32Array(this.chunk_offsets);
    }, a.stscBox.prototype.write = function(t) {
        var e;
        for(this.version = 0, this.flags = 0, this.size = 4 + 12 * this.first_chunk.length, this.writeHeader(t), t.writeUint32(this.first_chunk.length), e = 0; e < this.first_chunk.length; e++)t.writeUint32(this.first_chunk[e]), t.writeUint32(this.samples_per_chunk[e]), t.writeUint32(this.sample_description_index[e]);
    }, a.stsdBox.prototype.write = function(t) {
        var e;
        for(this.version = 0, this.flags = 0, this.size = 0, this.writeHeader(t), t.writeUint32(this.entries.length), this.size += 4, e = 0; e < this.entries.length; e++)this.entries[e].write(t), this.size += this.entries[e].size;
        n.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size), t.adjustUint32(this.sizePosition, this.size);
    }, a.stshBox.prototype.write = function(t) {
        var e;
        for(this.version = 0, this.flags = 0, this.size = 4 + 8 * this.shadowed_sample_numbers.length, this.writeHeader(t), t.writeUint32(this.shadowed_sample_numbers.length), e = 0; e < this.shadowed_sample_numbers.length; e++)t.writeUint32(this.shadowed_sample_numbers[e]), t.writeUint32(this.sync_sample_numbers[e]);
    }, a.stssBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 4 + 4 * this.sample_numbers.length, this.writeHeader(t), t.writeUint32(this.sample_numbers.length), t.writeUint32Array(this.sample_numbers);
    }, a.stszBox.prototype.write = function(t) {
        var e, s = !0;
        if (this.version = 0, this.flags = 0, this.sample_sizes.length > 0) for(e = 0; e + 1 < this.sample_sizes.length;)if (this.sample_sizes[e + 1] !== this.sample_sizes[0]) {
            s = !1;
            break;
        } else e++;
        else s = !1;
        this.size = 8, s || (this.size += 4 * this.sample_sizes.length), this.writeHeader(t), s ? t.writeUint32(this.sample_sizes[0]) : t.writeUint32(0), t.writeUint32(this.sample_sizes.length), s || t.writeUint32Array(this.sample_sizes);
    }, a.sttsBox.prototype.write = function(t) {
        var e;
        for(this.version = 0, this.flags = 0, this.size = 4 + 8 * this.sample_counts.length, this.writeHeader(t), t.writeUint32(this.sample_counts.length), e = 0; e < this.sample_counts.length; e++)t.writeUint32(this.sample_counts[e]), t.writeUint32(this.sample_deltas[e]);
    }, a.tfdtBox.prototype.write = function(t) {
        var e = Math.pow(2, 32) - 1;
        this.version = this.baseMediaDecodeTime > e ? 1 : 0, this.flags = 0, this.size = 4, this.version === 1 && (this.size += 4), this.writeHeader(t), this.version === 1 ? t.writeUint64(this.baseMediaDecodeTime) : t.writeUint32(this.baseMediaDecodeTime);
    }, a.tfhdBox.prototype.write = function(t) {
        this.version = 0, this.size = 4, this.flags & a.TFHD_FLAG_BASE_DATA_OFFSET && (this.size += 8), this.flags & a.TFHD_FLAG_SAMPLE_DESC && (this.size += 4), this.flags & a.TFHD_FLAG_SAMPLE_DUR && (this.size += 4), this.flags & a.TFHD_FLAG_SAMPLE_SIZE && (this.size += 4), this.flags & a.TFHD_FLAG_SAMPLE_FLAGS && (this.size += 4), this.writeHeader(t), t.writeUint32(this.track_id), this.flags & a.TFHD_FLAG_BASE_DATA_OFFSET && t.writeUint64(this.base_data_offset), this.flags & a.TFHD_FLAG_SAMPLE_DESC && t.writeUint32(this.default_sample_description_index), this.flags & a.TFHD_FLAG_SAMPLE_DUR && t.writeUint32(this.default_sample_duration), this.flags & a.TFHD_FLAG_SAMPLE_SIZE && t.writeUint32(this.default_sample_size), this.flags & a.TFHD_FLAG_SAMPLE_FLAGS && t.writeUint32(this.default_sample_flags);
    }, a.tkhdBox.prototype.write = function(t) {
        this.version = 0, this.size = 80, this.writeHeader(t), t.writeUint32(this.creation_time), t.writeUint32(this.modification_time), t.writeUint32(this.track_id), t.writeUint32(0), t.writeUint32(this.duration), t.writeUint32(0), t.writeUint32(0), t.writeInt16(this.layer), t.writeInt16(this.alternate_group), t.writeInt16(this.volume << 8), t.writeUint16(0), t.writeInt32Array(this.matrix), t.writeUint32(this.width), t.writeUint32(this.height);
    }, a.trexBox.prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = 20, this.writeHeader(t), t.writeUint32(this.track_id), t.writeUint32(this.default_sample_description_index), t.writeUint32(this.default_sample_duration), t.writeUint32(this.default_sample_size), t.writeUint32(this.default_sample_flags);
    }, a.trunBox.prototype.write = function(t) {
        this.version = 0, this.size = 4, this.flags & a.TRUN_FLAGS_DATA_OFFSET && (this.size += 4), this.flags & a.TRUN_FLAGS_FIRST_FLAG && (this.size += 4), this.flags & a.TRUN_FLAGS_DURATION && (this.size += 4 * this.sample_duration.length), this.flags & a.TRUN_FLAGS_SIZE && (this.size += 4 * this.sample_size.length), this.flags & a.TRUN_FLAGS_FLAGS && (this.size += 4 * this.sample_flags.length), this.flags & a.TRUN_FLAGS_CTS_OFFSET && (this.size += 4 * this.sample_composition_time_offset.length), this.writeHeader(t), t.writeUint32(this.sample_count), this.flags & a.TRUN_FLAGS_DATA_OFFSET && (this.data_offset_position = t.getPosition(), t.writeInt32(this.data_offset)), this.flags & a.TRUN_FLAGS_FIRST_FLAG && t.writeUint32(this.first_sample_flags);
        for(var e = 0; e < this.sample_count; e++)this.flags & a.TRUN_FLAGS_DURATION && t.writeUint32(this.sample_duration[e]), this.flags & a.TRUN_FLAGS_SIZE && t.writeUint32(this.sample_size[e]), this.flags & a.TRUN_FLAGS_FLAGS && t.writeUint32(this.sample_flags[e]), this.flags & a.TRUN_FLAGS_CTS_OFFSET && (this.version === 0 ? t.writeUint32(this.sample_composition_time_offset[e]) : t.writeInt32(this.sample_composition_time_offset[e]));
    }, a["url Box"].prototype.write = function(t) {
        this.version = 0, this.location ? (this.flags = 0, this.size = this.location.length + 1) : (this.flags = 1, this.size = 0), this.writeHeader(t), this.location && t.writeCString(this.location);
    }, a["urn Box"].prototype.write = function(t) {
        this.version = 0, this.flags = 0, this.size = this.name.length + 1 + (this.location ? this.location.length + 1 : 0), this.writeHeader(t), t.writeCString(this.name), this.location && t.writeCString(this.location);
    }, a.vmhdBox.prototype.write = function(t) {
        this.version = 0, this.flags = 1, this.size = 8, this.writeHeader(t), t.writeUint16(this.graphicsmode), t.writeUint16Array(this.opcolor);
    }, a.cttsBox.prototype.unpack = function(t) {
        var e, s, h;
        for(h = 0, e = 0; e < this.sample_counts.length; e++)for(s = 0; s < this.sample_counts[e]; s++)t[h].pts = t[h].dts + this.sample_offsets[e], h++;
    }, a.sttsBox.prototype.unpack = function(t) {
        var e, s, h;
        for(h = 0, e = 0; e < this.sample_counts.length; e++)for(s = 0; s < this.sample_counts[e]; s++)h === 0 ? t[h].dts = 0 : t[h].dts = t[h - 1].dts + this.sample_deltas[e], h++;
    }, a.stcoBox.prototype.unpack = function(t) {
        var e;
        for(e = 0; e < this.chunk_offsets.length; e++)t[e].offset = this.chunk_offsets[e];
    }, a.stscBox.prototype.unpack = function(t) {
        var e, s, h, f, _;
        for(f = 0, _ = 0, e = 0; e < this.first_chunk.length; e++)for(s = 0; s < (e + 1 < this.first_chunk.length ? this.first_chunk[e + 1] : 1 / 0); s++)for(_++, h = 0; h < this.samples_per_chunk[e]; h++){
            if (t[f]) t[f].description_index = this.sample_description_index[e], t[f].chunk_index = _;
            else return;
            f++;
        }
    }, a.stszBox.prototype.unpack = function(t) {
        var e;
        for(e = 0; e < this.sample_sizes.length; e++)t[e].size = this.sample_sizes[e];
    }, a.DIFF_BOXES_PROP_NAMES = [
        "boxes",
        "entries",
        "references",
        "subsamples",
        "items",
        "item_infos",
        "extents",
        "associations",
        "subsegments",
        "ranges",
        "seekLists",
        "seekPoints",
        "esd",
        "levels"
    ], a.DIFF_PRIMITIVE_ARRAY_PROP_NAMES = [
        "compatible_brands",
        "matrix",
        "opcolor",
        "sample_counts",
        "sample_counts",
        "sample_deltas",
        "first_chunk",
        "samples_per_chunk",
        "sample_sizes",
        "chunk_offsets",
        "sample_offsets",
        "sample_description_index",
        "sample_duration"
    ], a.boxEqualFields = function(t, e) {
        if (t && !e) return !1;
        var s;
        for(s in t)if (!(a.DIFF_BOXES_PROP_NAMES.indexOf(s) > -1)) {
            if (t[s] instanceof a.Box || e[s] instanceof a.Box) continue;
            if (typeof t[s] > "u" || typeof e[s] > "u") continue;
            if (typeof t[s] == "function" || typeof e[s] == "function") continue;
            if (t.subBoxNames && t.subBoxNames.indexOf(s.slice(0, 4)) > -1 || e.subBoxNames && e.subBoxNames.indexOf(s.slice(0, 4)) > -1) continue;
            if (s === "data" || s === "start" || s === "size" || s === "creation_time" || s === "modification_time") continue;
            if (a.DIFF_PRIMITIVE_ARRAY_PROP_NAMES.indexOf(s) > -1) continue;
            if (t[s] !== e[s]) return !1;
        }
        return !0;
    }, a.boxEqual = function(t, e) {
        if (!a.boxEqualFields(t, e)) return !1;
        for(var s = 0; s < a.DIFF_BOXES_PROP_NAMES.length; s++){
            var h = a.DIFF_BOXES_PROP_NAMES[s];
            if (t[h] && e[h] && !a.boxEqual(t[h], e[h])) return !1;
        }
        return !0;
    };
    var y = function() {};
    y.prototype.parseSample = function(t) {
        var e = {}, s;
        e.resources = [];
        var h = new o(t.data.buffer);
        if (!t.subsamples || t.subsamples.length === 0) e.documentString = h.readString(t.data.length);
        else if (e.documentString = h.readString(t.subsamples[0].size), t.subsamples.length > 1) for(s = 1; s < t.subsamples.length; s++)e.resources[s] = h.readUint8Array(t.subsamples[s].size);
        return typeof DOMParser < "u" && (e.document = new DOMParser().parseFromString(e.documentString, "application/xml")), e;
    };
    var v = function() {};
    v.prototype.parseSample = function(t) {
        var e, s = new o(t.data.buffer);
        return e = s.readString(t.data.length), e;
    }, v.prototype.parseConfig = function(t) {
        var e, s = new o(t.buffer);
        return s.readUint32(), e = s.readCString(), e;
    }, l.XMLSubtitlein4Parser = y, l.Textin4Parser = v;
    var b = function(t) {
        this.stream = t || new c(), this.boxes = [], this.mdats = [], this.moofs = [], this.isProgressive = !1, this.moovStartFound = !1, this.onMoovStart = null, this.moovStartSent = !1, this.onReady = null, this.readySent = !1, this.onSegment = null, this.onSamples = null, this.onError = null, this.sampleListBuilt = !1, this.fragmentedTracks = [], this.extractedTracks = [], this.isFragmentationInitialized = !1, this.sampleProcessingStarted = !1, this.nextMoofNumber = 0, this.itemListBuilt = !1, this.onSidx = null, this.sidxSent = !1;
    };
    b.prototype.setSegmentOptions = function(t, e, s) {
        var h = this.getTrackById(t);
        if (h) {
            var f = {};
            this.fragmentedTracks.push(f), f.id = t, f.user = e, f.trak = h, h.nextSample = 0, f.segmentStream = null, f.nb_samples = 1e3, f.rapAlignement = !0, s && (s.nbSamples && (f.nb_samples = s.nbSamples), s.rapAlignement && (f.rapAlignement = s.rapAlignement));
        }
    }, b.prototype.unsetSegmentOptions = function(t) {
        for(var e = -1, s = 0; s < this.fragmentedTracks.length; s++){
            var h = this.fragmentedTracks[s];
            h.id == t && (e = s);
        }
        e > -1 && this.fragmentedTracks.splice(e, 1);
    }, b.prototype.setExtractionOptions = function(t, e, s) {
        var h = this.getTrackById(t);
        if (h) {
            var f = {};
            this.extractedTracks.push(f), f.id = t, f.user = e, f.trak = h, h.nextSample = 0, f.nb_samples = 1e3, f.samples = [], s && s.nbSamples && (f.nb_samples = s.nbSamples);
        }
    }, b.prototype.unsetExtractionOptions = function(t) {
        for(var e = -1, s = 0; s < this.extractedTracks.length; s++){
            var h = this.extractedTracks[s];
            h.id == t && (e = s);
        }
        e > -1 && this.extractedTracks.splice(e, 1);
    }, b.prototype.parse = function() {
        var t, e, s = !1;
        if (!(this.restoreParsePosition && !this.restoreParsePosition())) for(;;)if (this.hasIncompleteMdat && this.hasIncompleteMdat()) {
            if (this.processIncompleteMdat()) continue;
            return;
        } else if (this.saveParsePosition && this.saveParsePosition(), t = a.parseOneBox(this.stream, s), t.code === a.ERR_NOT_ENOUGH_DATA) {
            if (this.processIncompleteBox) {
                if (this.processIncompleteBox(t)) continue;
                return;
            } else return;
        } else {
            var h;
            switch(e = t.box, h = e.type !== "uuid" ? e.type : e.uuid, this.boxes.push(e), h){
                case "mdat":
                    this.mdats.push(e);
                    break;
                case "moof":
                    this.moofs.push(e);
                    break;
                case "moov":
                    this.moovStartFound = !0, this.mdats.length === 0 && (this.isProgressive = !0);
                default:
                    this[h] !== void 0 && n.warn("ISOFile", "Duplicate Box of type: " + h + ", overriding previous occurrence"), this[h] = e;
                    break;
            }
            this.updateUsedBytes && this.updateUsedBytes(e, t);
        }
    }, b.prototype.checkBuffer = function(t) {
        if (t == null) throw "Buffer must be defined and non empty";
        if (t.fileStart === void 0) throw "Buffer must have a fileStart property";
        return t.byteLength === 0 ? (n.warn("ISOFile", "Ignoring empty buffer (fileStart: " + t.fileStart + ")"), this.stream.logBufferLevel(), !1) : (n.info("ISOFile", "Processing buffer (fileStart: " + t.fileStart + ")"), t.usedBytes = 0, this.stream.insertBuffer(t), this.stream.logBufferLevel(), this.stream.initialized() ? !0 : (n.warn("ISOFile", "Not ready to start parsing"), !1));
    }, b.prototype.appendBuffer = function(t, e) {
        var s;
        if (this.checkBuffer(t)) return this.parse(), this.moovStartFound && !this.moovStartSent && (this.moovStartSent = !0, this.onMoovStart && this.onMoovStart()), this.moov ? (this.sampleListBuilt || (this.buildSampleLists(), this.sampleListBuilt = !0), this.updateSampleLists(), this.onReady && !this.readySent && (this.readySent = !0, this.onReady(this.getInfo())), this.processSamples(e), this.nextSeekPosition ? (s = this.nextSeekPosition, this.nextSeekPosition = void 0) : s = this.nextParsePosition, this.stream.getEndFilePositionAfter && (s = this.stream.getEndFilePositionAfter(s))) : this.nextParsePosition ? s = this.nextParsePosition : s = 0, this.sidx && this.onSidx && !this.sidxSent && (this.onSidx(this.sidx), this.sidxSent = !0), this.meta && (this.flattenItemInfo && !this.itemListBuilt && (this.flattenItemInfo(), this.itemListBuilt = !0), this.processItems && this.processItems(this.onItem)), this.stream.cleanBuffers && (n.info("ISOFile", "Done processing buffer (fileStart: " + t.fileStart + ") - next buffer to fetch should have a fileStart position of " + s), this.stream.logBufferLevel(), this.stream.cleanBuffers(), this.stream.logBufferLevel(!0), n.info("ISOFile", "Sample data size in memory: " + this.getAllocatedSampleDataSize())), s;
    }, b.prototype.getInfo = function() {
        var t, e, s = {}, h, f, _, g, m = /* @__PURE__ */ new Date("1904-01-01T00:00:00Z").getTime();
        if (this.moov) for(s.hasMoov = !0, s.duration = this.moov.mvhd.duration, s.timescale = this.moov.mvhd.timescale, s.isFragmented = this.moov.mvex != null, s.isFragmented && this.moov.mvex.mehd && (s.fragment_duration = this.moov.mvex.mehd.fragment_duration), s.isProgressive = this.isProgressive, s.hasIOD = this.moov.iods != null, s.brands = [], s.brands.push(this.ftyp.major_brand), s.brands = s.brands.concat(this.ftyp.compatible_brands), s.created = new Date(m + this.moov.mvhd.creation_time * 1e3), s.modified = new Date(m + this.moov.mvhd.modification_time * 1e3), s.tracks = [], s.audioTracks = [], s.videoTracks = [], s.subtitleTracks = [], s.metadataTracks = [], s.hintTracks = [], s.otherTracks = [], t = 0; t < this.moov.traks.length; t++){
            if (h = this.moov.traks[t], g = h.mdia.minf.stbl.stsd.entries[0], f = {}, s.tracks.push(f), f.id = h.tkhd.track_id, f.name = h.mdia.hdlr.name, f.references = [], h.tref) for(e = 0; e < h.tref.boxes.length; e++)_ = {}, f.references.push(_), _.type = h.tref.boxes[e].type, _.track_ids = h.tref.boxes[e].track_ids;
            h.edts && (f.edits = h.edts.elst.entries), f.created = new Date(m + h.tkhd.creation_time * 1e3), f.modified = new Date(m + h.tkhd.modification_time * 1e3), f.movie_duration = h.tkhd.duration, f.movie_timescale = s.timescale, f.layer = h.tkhd.layer, f.alternate_group = h.tkhd.alternate_group, f.volume = h.tkhd.volume, f.matrix = h.tkhd.matrix, f.track_width = h.tkhd.width / 65536, f.track_height = h.tkhd.height / 65536, f.timescale = h.mdia.mdhd.timescale, f.cts_shift = h.mdia.minf.stbl.cslg, f.duration = h.mdia.mdhd.duration, f.samples_duration = h.samples_duration, f.codec = g.getCodec(), f.kind = h.udta && h.udta.kinds.length ? h.udta.kinds[0] : {
                schemeURI: "",
                value: ""
            }, f.language = h.mdia.elng ? h.mdia.elng.extended_language : h.mdia.mdhd.languageString, f.nb_samples = h.samples.length, f.size = h.samples_size, f.bitrate = f.size * 8 * f.timescale / f.samples_duration, g.isAudio() ? (f.type = "audio", s.audioTracks.push(f), f.audio = {}, f.audio.sample_rate = g.getSampleRate(), f.audio.channel_count = g.getChannelCount(), f.audio.sample_size = g.getSampleSize()) : g.isVideo() ? (f.type = "video", s.videoTracks.push(f), f.video = {}, f.video.width = g.getWidth(), f.video.height = g.getHeight()) : g.isSubtitle() ? (f.type = "subtitles", s.subtitleTracks.push(f)) : g.isHint() ? (f.type = "metadata", s.hintTracks.push(f)) : g.isMetadata() ? (f.type = "metadata", s.metadataTracks.push(f)) : (f.type = "metadata", s.otherTracks.push(f));
        }
        else s.hasMoov = !1;
        if (s.mime = "", s.hasMoov && s.tracks) {
            for(s.videoTracks && s.videoTracks.length > 0 ? s.mime += 'video/mp4; codecs="' : s.audioTracks && s.audioTracks.length > 0 ? s.mime += 'audio/mp4; codecs="' : s.mime += 'application/mp4; codecs="', t = 0; t < s.tracks.length; t++)t !== 0 && (s.mime += ","), s.mime += s.tracks[t].codec;
            s.mime += '"; profiles="', s.mime += this.ftyp.compatible_brands.join(), s.mime += '"';
        }
        return s;
    }, b.prototype.setNextSeekPositionFromSample = function(t) {
        t && (this.nextSeekPosition ? this.nextSeekPosition = Math.min(t.offset + t.alreadyRead, this.nextSeekPosition) : this.nextSeekPosition = t.offset + t.alreadyRead);
    }, b.prototype.processSamples = function(t) {
        var e, s;
        if (this.sampleProcessingStarted) {
            if (this.isFragmentationInitialized && this.onSegment !== null) for(e = 0; e < this.fragmentedTracks.length; e++){
                var h = this.fragmentedTracks[e];
                for(s = h.trak; s.nextSample < s.samples.length && this.sampleProcessingStarted;){
                    n.debug("ISOFile", "Creating media fragment on track #" + h.id + " for sample " + s.nextSample);
                    var f = this.createFragment(h.id, s.nextSample, h.segmentStream);
                    if (f) h.segmentStream = f, s.nextSample++;
                    else break;
                    if ((s.nextSample % h.nb_samples === 0 || t || s.nextSample >= s.samples.length) && (n.info("ISOFile", "Sending fragmented data on track #" + h.id + " for samples [" + Math.max(0, s.nextSample - h.nb_samples) + "," + (s.nextSample - 1) + "]"), n.info("ISOFile", "Sample data size in memory: " + this.getAllocatedSampleDataSize()), this.onSegment && this.onSegment(h.id, h.user, h.segmentStream.buffer, s.nextSample, t || s.nextSample >= s.samples.length), h.segmentStream = null, h !== this.fragmentedTracks[e])) break;
                }
            }
            if (this.onSamples !== null) for(e = 0; e < this.extractedTracks.length; e++){
                var _ = this.extractedTracks[e];
                for(s = _.trak; s.nextSample < s.samples.length && this.sampleProcessingStarted;){
                    n.debug("ISOFile", "Exporting on track #" + _.id + " sample #" + s.nextSample);
                    var g = this.getSample(s, s.nextSample);
                    if (g) s.nextSample++, _.samples.push(g);
                    else {
                        this.setNextSeekPositionFromSample(s.samples[s.nextSample]);
                        break;
                    }
                    if ((s.nextSample % _.nb_samples === 0 || s.nextSample >= s.samples.length) && (n.debug("ISOFile", "Sending samples on track #" + _.id + " for sample " + s.nextSample), this.onSamples && this.onSamples(_.id, _.user, _.samples), _.samples = [], _ !== this.extractedTracks[e])) break;
                }
            }
        }
    }, b.prototype.getBox = function(t) {
        var e = this.getBoxes(t, !0);
        return e.length ? e[0] : null;
    }, b.prototype.getBoxes = function(t, e) {
        var s = [];
        return b._sweep.call(this, t, s, e), s;
    }, b._sweep = function(t, e, s) {
        this.type && this.type == t && e.push(this);
        for(var h in this.boxes){
            if (e.length && s) return;
            b._sweep.call(this.boxes[h], t, e, s);
        }
    }, b.prototype.getTrackSamplesInfo = function(t) {
        var e = this.getTrackById(t);
        if (e) return e.samples;
    }, b.prototype.getTrackSample = function(t, e) {
        var s = this.getTrackById(t), h = this.getSample(s, e);
        return h;
    }, b.prototype.releaseUsedSamples = function(t, e) {
        var s = 0, h = this.getTrackById(t);
        h.lastValidSample || (h.lastValidSample = 0);
        for(var f = h.lastValidSample; f < e; f++)s += this.releaseSample(h, f);
        n.info("ISOFile", "Track #" + t + " released samples up to " + e + " (released size: " + s + ", remaining: " + this.samplesDataSize + ")"), h.lastValidSample = e;
    }, b.prototype.start = function() {
        this.sampleProcessingStarted = !0, this.processSamples(!1);
    }, b.prototype.stop = function() {
        this.sampleProcessingStarted = !1;
    }, b.prototype.flush = function() {
        n.info("ISOFile", "Flushing remaining samples"), this.updateSampleLists(), this.processSamples(!0), this.stream.cleanBuffers(), this.stream.logBufferLevel(!0);
    }, b.prototype.seekTrack = function(t, e, s) {
        var h, f, _ = 1 / 0, g = 0, m = 0, w;
        if (s.samples.length === 0) return n.info("ISOFile", "No sample in track, cannot seek! Using time " + n.getDurationString(0, 1) + " and offset: 0"), {
            offset: 0,
            time: 0
        };
        for(h = 0; h < s.samples.length; h++){
            if (f = s.samples[h], h === 0) m = 0, w = f.timescale;
            else if (f.cts > t * f.timescale) {
                m = h - 1;
                break;
            }
            e && f.is_sync && (g = h);
        }
        for(e && (m = g), t = s.samples[m].cts, s.nextSample = m; s.samples[m].alreadyRead === s.samples[m].size && s.samples[m + 1];)m++;
        return _ = s.samples[m].offset + s.samples[m].alreadyRead, n.info("ISOFile", "Seeking to " + (e ? "RAP" : "") + " sample #" + s.nextSample + " on track " + s.tkhd.track_id + ", time " + n.getDurationString(t, w) + " and offset: " + _), {
            offset: _,
            time: t / w
        };
    }, b.prototype.getTrackDuration = function(t) {
        var e;
        return t.samples ? (e = t.samples[t.samples.length - 1], (e.cts + e.duration) / e.timescale) : 1 / 0;
    }, b.prototype.seek = function(t, e) {
        var s = this.moov, h, f, _, g = {
            offset: 1 / 0,
            time: 1 / 0
        };
        if (this.moov) {
            for(_ = 0; _ < s.traks.length; _++)h = s.traks[_], !(t > this.getTrackDuration(h)) && (f = this.seekTrack(t, e, h), f.offset < g.offset && (g.offset = f.offset), f.time < g.time && (g.time = f.time));
            return n.info("ISOFile", "Seeking at time " + n.getDurationString(g.time, 1) + " needs a buffer with a fileStart position of " + g.offset), g.offset === 1 / 0 ? g = {
                offset: this.nextParsePosition,
                time: 0
            } : g.offset = this.stream.getEndFilePositionAfter(g.offset), n.info("ISOFile", "Adjusted seek position (after checking data already in buffer): " + g.offset), g;
        } else throw "Cannot seek: moov not received!";
    }, b.prototype.equal = function(t) {
        for(var e = 0; e < this.boxes.length && e < t.boxes.length;){
            var s = this.boxes[e], h = t.boxes[e];
            if (!a.boxEqual(s, h)) return !1;
            e++;
        }
        return !0;
    }, l.ISOFile = b, b.prototype.lastBoxStartPosition = 0, b.prototype.parsingMdat = null, b.prototype.nextParsePosition = 0, b.prototype.discardMdatData = !1, b.prototype.processIncompleteBox = function(t) {
        var e, s, h;
        return t.type === "mdat" ? (e = new a[t.type + "Box"](t.size), this.parsingMdat = e, this.boxes.push(e), this.mdats.push(e), e.start = t.start, e.hdr_size = t.hdr_size, this.stream.addUsedBytes(e.hdr_size), this.lastBoxStartPosition = e.start + e.size, h = this.stream.seek(e.start + e.size, !1, this.discardMdatData), h ? (this.parsingMdat = null, !0) : (this.moovStartFound ? this.nextParsePosition = this.stream.findEndContiguousBuf() : this.nextParsePosition = e.start + e.size, !1)) : (t.type === "moov" && (this.moovStartFound = !0, this.mdats.length === 0 && (this.isProgressive = !0)), s = this.stream.mergeNextBuffer ? this.stream.mergeNextBuffer() : !1, s ? (this.nextParsePosition = this.stream.getEndPosition(), !0) : (t.type ? this.moovStartFound ? this.nextParsePosition = this.stream.getEndPosition() : this.nextParsePosition = this.stream.getPosition() + t.size : this.nextParsePosition = this.stream.getEndPosition(), !1));
    }, b.prototype.hasIncompleteMdat = function() {
        return this.parsingMdat !== null;
    }, b.prototype.processIncompleteMdat = function() {
        var t, e;
        return t = this.parsingMdat, e = this.stream.seek(t.start + t.size, !1, this.discardMdatData), e ? (n.debug("ISOFile", "Found 'mdat' end in buffered data"), this.parsingMdat = null, !0) : (this.nextParsePosition = this.stream.findEndContiguousBuf(), !1);
    }, b.prototype.restoreParsePosition = function() {
        return this.stream.seek(this.lastBoxStartPosition, !0, this.discardMdatData);
    }, b.prototype.saveParsePosition = function() {
        this.lastBoxStartPosition = this.stream.getPosition();
    }, b.prototype.updateUsedBytes = function(t, e) {
        this.stream.addUsedBytes && (t.type === "mdat" ? (this.stream.addUsedBytes(t.hdr_size), this.discardMdatData && this.stream.addUsedBytes(t.size - t.hdr_size)) : this.stream.addUsedBytes(t.size));
    }, b.prototype.add = a.Box.prototype.add, b.prototype.addBox = a.Box.prototype.addBox, b.prototype.init = function(t) {
        var e = t || {};
        this.add("ftyp").set("major_brand", e.brands && e.brands[0] || "iso4").set("minor_version", 0).set("compatible_brands", e.brands || [
            "iso4"
        ]);
        var s = this.add("moov");
        return s.add("mvhd").set("timescale", e.timescale || 600).set("rate", e.rate || 65536).set("creation_time", 0).set("modification_time", 0).set("duration", e.duration || 0).set("volume", e.width ? 0 : 256).set("matrix", [
            65536,
            0,
            0,
            0,
            65536,
            0,
            0,
            0,
            1073741824
        ]).set("next_track_id", 1), s.add("mvex"), this;
    }, b.prototype.addTrack = function(t) {
        this.moov || this.init(t);
        var e = t || {};
        e.width = e.width || 320, e.height = e.height || 320, e.id = e.id || this.moov.mvhd.next_track_id, e.type = e.type || "avc1";
        var s = this.moov.add("trak");
        this.moov.mvhd.next_track_id = e.id + 1, s.add("tkhd").set("flags", a.TKHD_FLAG_ENABLED | a.TKHD_FLAG_IN_MOVIE | a.TKHD_FLAG_IN_PREVIEW).set("creation_time", 0).set("modification_time", 0).set("track_id", e.id).set("duration", e.duration || 0).set("layer", e.layer || 0).set("alternate_group", 0).set("volume", 1).set("matrix", [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ]).set("width", e.width << 16).set("height", e.height << 16);
        var h = s.add("mdia");
        h.add("mdhd").set("creation_time", 0).set("modification_time", 0).set("timescale", e.timescale || 1).set("duration", e.media_duration || 0).set("language", e.language || "und"), h.add("hdlr").set("handler", e.hdlr || "vide").set("name", e.name || "Track created with MP4Box.js"), h.add("elng").set("extended_language", e.language || "fr-FR");
        var f = h.add("minf");
        if (a[e.type + "SampleEntry"] !== void 0) {
            var _ = new a[e.type + "SampleEntry"]();
            _.data_reference_index = 1;
            var g = "";
            for(var m in a.sampleEntryCodes)for(var w = a.sampleEntryCodes[m], S = 0; S < w.length; S++)if (w.indexOf(e.type) > -1) {
                g = m;
                break;
            }
            switch(g){
                case "Visual":
                    if (f.add("vmhd").set("graphicsmode", 0).set("opcolor", [
                        0,
                        0,
                        0
                    ]), _.set("width", e.width).set("height", e.height).set("horizresolution", 4718592).set("vertresolution", 4718592).set("frame_count", 1).set("compressorname", e.type + " Compressor").set("depth", 24), e.avcDecoderConfigRecord) {
                        var E = new a.avcCBox();
                        E.parse(new o(e.avcDecoderConfigRecord)), _.addBox(E);
                    } else if (e.hevcDecoderConfigRecord) {
                        var I = new a.hvcCBox();
                        I.parse(new o(e.hevcDecoderConfigRecord)), _.addBox(I);
                    }
                    break;
                case "Audio":
                    f.add("smhd").set("balance", e.balance || 0), _.set("channel_count", e.channel_count || 2).set("samplesize", e.samplesize || 16).set("samplerate", e.samplerate || 65536);
                    break;
                case "Hint":
                    f.add("hmhd");
                    break;
                case "Subtitle":
                    switch(f.add("sthd"), e.type){
                        case "stpp":
                            _.set("namespace", e.namespace || "nonamespace").set("schema_location", e.schema_location || "").set("auxiliary_mime_types", e.auxiliary_mime_types || "");
                            break;
                    }
                    break;
                case "Metadata":
                    f.add("nmhd");
                    break;
                case "System":
                    f.add("nmhd");
                    break;
                default:
                    f.add("nmhd");
                    break;
            }
            e.description && _.addBox(e.description), e.description_boxes && e.description_boxes.forEach(function(A) {
                _.addBox(A);
            }), f.add("dinf").add("dref").addEntry(new a["url Box"]().set("flags", 1));
            var R = f.add("stbl");
            return R.add("stsd").addEntry(_), R.add("stts").set("sample_counts", []).set("sample_deltas", []), R.add("stsc").set("first_chunk", []).set("samples_per_chunk", []).set("sample_description_index", []), R.add("stco").set("chunk_offsets", []), R.add("stsz").set("sample_sizes", []), this.moov.mvex.add("trex").set("track_id", e.id).set("default_sample_description_index", e.default_sample_description_index || 1).set("default_sample_duration", e.default_sample_duration || 0).set("default_sample_size", e.default_sample_size || 0).set("default_sample_flags", e.default_sample_flags || 0), this.buildTrakSampleLists(s), e.id;
        }
    }, a.Box.prototype.computeSize = function(t) {
        var e = t || new r();
        e.endianness = r.BIG_ENDIAN, this.write(e);
    }, b.prototype.addSample = function(t, e, s) {
        var h = s || {}, f = {}, _ = this.getTrackById(t);
        if (_ !== null) {
            f.number = _.samples.length, f.track_id = _.tkhd.track_id, f.timescale = _.mdia.mdhd.timescale, f.description_index = h.sample_description_index ? h.sample_description_index - 1 : 0, f.description = _.mdia.minf.stbl.stsd.entries[f.description_index], f.data = e, f.size = e.byteLength, f.alreadyRead = f.size, f.duration = h.duration || 1, f.cts = h.cts || 0, f.dts = h.dts || 0, f.is_sync = h.is_sync || !1, f.is_leading = h.is_leading || 0, f.depends_on = h.depends_on || 0, f.is_depended_on = h.is_depended_on || 0, f.has_redundancy = h.has_redundancy || 0, f.degradation_priority = h.degradation_priority || 0, f.offset = 0, f.subsamples = h.subsamples, _.samples.push(f), _.samples_size += f.size, _.samples_duration += f.duration, _.first_dts === void 0 && (_.first_dts = h.dts), this.processSamples();
            var g = this.createSingleSampleMoof(f);
            return this.addBox(g), g.computeSize(), g.trafs[0].truns[0].data_offset = g.size + 8, this.add("mdat").data = new Uint8Array(e), f;
        }
    }, b.prototype.createSingleSampleMoof = function(t) {
        var e = 0;
        t.is_sync ? e = 33554432 : e = 65536;
        var s = new a.moofBox();
        s.add("mfhd").set("sequence_number", this.nextMoofNumber), this.nextMoofNumber++;
        var h = s.add("traf"), f = this.getTrackById(t.track_id);
        return h.add("tfhd").set("track_id", t.track_id).set("flags", a.TFHD_FLAG_DEFAULT_BASE_IS_MOOF), h.add("tfdt").set("baseMediaDecodeTime", t.dts - (f.first_dts || 0)), h.add("trun").set("flags", a.TRUN_FLAGS_DATA_OFFSET | a.TRUN_FLAGS_DURATION | a.TRUN_FLAGS_SIZE | a.TRUN_FLAGS_FLAGS | a.TRUN_FLAGS_CTS_OFFSET).set("data_offset", 0).set("first_sample_flags", 0).set("sample_count", 1).set("sample_duration", [
            t.duration
        ]).set("sample_size", [
            t.size
        ]).set("sample_flags", [
            e
        ]).set("sample_composition_time_offset", [
            t.cts - t.dts
        ]), s;
    }, b.prototype.lastMoofIndex = 0, b.prototype.samplesDataSize = 0, b.prototype.resetTables = function() {
        var t, e, s, h, f, _, g, m;
        for(this.initial_duration = this.moov.mvhd.duration, this.moov.mvhd.duration = 0, t = 0; t < this.moov.traks.length; t++){
            e = this.moov.traks[t], e.tkhd.duration = 0, e.mdia.mdhd.duration = 0, s = e.mdia.minf.stbl.stco || e.mdia.minf.stbl.co64, s.chunk_offsets = [], h = e.mdia.minf.stbl.stsc, h.first_chunk = [], h.samples_per_chunk = [], h.sample_description_index = [], f = e.mdia.minf.stbl.stsz || e.mdia.minf.stbl.stz2, f.sample_sizes = [], _ = e.mdia.minf.stbl.stts, _.sample_counts = [], _.sample_deltas = [], g = e.mdia.minf.stbl.ctts, g && (g.sample_counts = [], g.sample_offsets = []), m = e.mdia.minf.stbl.stss;
            var w = e.mdia.minf.stbl.boxes.indexOf(m);
            w != -1 && (e.mdia.minf.stbl.boxes[w] = null);
        }
    }, b.initSampleGroups = function(t, e, s, h, f) {
        var _, g, m, w;
        function S(E, I, R) {
            this.grouping_type = E, this.grouping_type_parameter = I, this.sbgp = R, this.last_sample_in_run = -1, this.entry_index = -1;
        }
        for(e && (e.sample_groups_info = []), t.sample_groups_info || (t.sample_groups_info = []), g = 0; g < s.length; g++){
            for(w = s[g].grouping_type + "/" + s[g].grouping_type_parameter, m = new S(s[g].grouping_type, s[g].grouping_type_parameter, s[g]), e && (e.sample_groups_info[w] = m), t.sample_groups_info[w] || (t.sample_groups_info[w] = m), _ = 0; _ < h.length; _++)h[_].grouping_type === s[g].grouping_type && (m.description = h[_], m.description.used = !0);
            if (f) for(_ = 0; _ < f.length; _++)f[_].grouping_type === s[g].grouping_type && (m.fragment_description = f[_], m.fragment_description.used = !0, m.is_fragment = !0);
        }
        if (e) {
            if (f) for(g = 0; g < f.length; g++)!f[g].used && f[g].version >= 2 && (w = f[g].grouping_type + "/0", m = new S(f[g].grouping_type, 0), m.is_fragment = !0, e.sample_groups_info[w] || (e.sample_groups_info[w] = m));
        } else for(g = 0; g < h.length; g++)!h[g].used && h[g].version >= 2 && (w = h[g].grouping_type + "/0", m = new S(h[g].grouping_type, 0), t.sample_groups_info[w] || (t.sample_groups_info[w] = m));
    }, b.setSampleGroupProperties = function(t, e, s, h) {
        var f, _;
        e.sample_groups = [];
        for(f in h)if (e.sample_groups[f] = {}, e.sample_groups[f].grouping_type = h[f].grouping_type, e.sample_groups[f].grouping_type_parameter = h[f].grouping_type_parameter, s >= h[f].last_sample_in_run && (h[f].last_sample_in_run < 0 && (h[f].last_sample_in_run = 0), h[f].entry_index++, h[f].entry_index <= h[f].sbgp.entries.length - 1 && (h[f].last_sample_in_run += h[f].sbgp.entries[h[f].entry_index].sample_count)), h[f].entry_index <= h[f].sbgp.entries.length - 1 ? e.sample_groups[f].group_description_index = h[f].sbgp.entries[h[f].entry_index].group_description_index : e.sample_groups[f].group_description_index = -1, e.sample_groups[f].group_description_index !== 0) {
            var g;
            h[f].fragment_description ? g = h[f].fragment_description : g = h[f].description, e.sample_groups[f].group_description_index > 0 ? (e.sample_groups[f].group_description_index > 65535 ? _ = (e.sample_groups[f].group_description_index >> 16) - 1 : _ = e.sample_groups[f].group_description_index - 1, g && _ >= 0 && (e.sample_groups[f].description = g.entries[_])) : g && g.version >= 2 && g.default_group_description_index > 0 && (e.sample_groups[f].description = g.entries[g.default_group_description_index - 1]);
        }
    }, b.process_sdtp = function(t, e, s) {
        e && (t ? (e.is_leading = t.is_leading[s], e.depends_on = t.sample_depends_on[s], e.is_depended_on = t.sample_is_depended_on[s], e.has_redundancy = t.sample_has_redundancy[s]) : (e.is_leading = 0, e.depends_on = 0, e.is_depended_on = 0, e.has_redundancy = 0));
    }, b.prototype.buildSampleLists = function() {
        var t, e;
        for(t = 0; t < this.moov.traks.length; t++)e = this.moov.traks[t], this.buildTrakSampleLists(e);
    }, b.prototype.buildTrakSampleLists = function(t) {
        var e, s, h, f, _, g, m, w, S, E, I, R, A, L, z, se, ye, Ot, q, St, ti, yi, xt, be;
        if (t.samples = [], t.samples_duration = 0, t.samples_size = 0, s = t.mdia.minf.stbl.stco || t.mdia.minf.stbl.co64, h = t.mdia.minf.stbl.stsc, f = t.mdia.minf.stbl.stsz || t.mdia.minf.stbl.stz2, _ = t.mdia.minf.stbl.stts, g = t.mdia.minf.stbl.ctts, m = t.mdia.minf.stbl.stss, w = t.mdia.minf.stbl.stsd, S = t.mdia.minf.stbl.subs, R = t.mdia.minf.stbl.stdp, E = t.mdia.minf.stbl.sbgps, I = t.mdia.minf.stbl.sgpds, Ot = -1, q = -1, St = -1, ti = -1, yi = 0, xt = 0, be = 0, b.initSampleGroups(t, null, E, I), !(typeof f > "u")) {
            for(e = 0; e < f.sample_sizes.length; e++){
                var C = {};
                C.number = e, C.track_id = t.tkhd.track_id, C.timescale = t.mdia.mdhd.timescale, C.alreadyRead = 0, t.samples[e] = C, C.size = f.sample_sizes[e], t.samples_size += C.size, e === 0 ? (L = 1, A = 0, C.chunk_index = L, C.chunk_run_index = A, ye = h.samples_per_chunk[A], se = 0, A + 1 < h.first_chunk.length ? z = h.first_chunk[A + 1] - 1 : z = 1 / 0) : e < ye ? (C.chunk_index = L, C.chunk_run_index = A) : (L++, C.chunk_index = L, se = 0, L <= z || (A++, A + 1 < h.first_chunk.length ? z = h.first_chunk[A + 1] - 1 : z = 1 / 0), C.chunk_run_index = A, ye += h.samples_per_chunk[A]), C.description_index = h.sample_description_index[C.chunk_run_index] - 1, C.description = w.entries[C.description_index], C.offset = s.chunk_offsets[C.chunk_index - 1] + se, se += C.size, e > Ot && (q++, Ot < 0 && (Ot = 0), Ot += _.sample_counts[q]), e > 0 ? (t.samples[e - 1].duration = _.sample_deltas[q], t.samples_duration += t.samples[e - 1].duration, C.dts = t.samples[e - 1].dts + t.samples[e - 1].duration) : C.dts = 0, g ? (e >= St && (ti++, St < 0 && (St = 0), St += g.sample_counts[ti]), C.cts = t.samples[e].dts + g.sample_offsets[ti]) : C.cts = C.dts, m ? (e == m.sample_numbers[yi] - 1 ? (C.is_sync = !0, yi++) : (C.is_sync = !1, C.degradation_priority = 0), S && S.entries[xt].sample_delta + be == e + 1 && (C.subsamples = S.entries[xt].subsamples, be += S.entries[xt].sample_delta, xt++)) : C.is_sync = !0, b.process_sdtp(t.mdia.minf.stbl.sdtp, C, C.number), R ? C.degradation_priority = R.priority[e] : C.degradation_priority = 0, S && S.entries[xt].sample_delta + be == e && (C.subsamples = S.entries[xt].subsamples, be += S.entries[xt].sample_delta), (E.length > 0 || I.length > 0) && b.setSampleGroupProperties(t, C, e, t.sample_groups_info);
            }
            e > 0 && (t.samples[e - 1].duration = Math.max(t.mdia.mdhd.duration - t.samples[e - 1].dts, 0), t.samples_duration += t.samples[e - 1].duration);
        }
    }, b.prototype.updateSampleLists = function() {
        var t, e, s, h, f, _, g, m, w, S, E, I, R, A, L;
        if (this.moov !== void 0) {
            for(; this.lastMoofIndex < this.moofs.length;)if (w = this.moofs[this.lastMoofIndex], this.lastMoofIndex++, w.type == "moof") for(S = w, t = 0; t < S.trafs.length; t++){
                for(E = S.trafs[t], I = this.getTrackById(E.tfhd.track_id), R = this.getTrexById(E.tfhd.track_id), E.tfhd.flags & a.TFHD_FLAG_SAMPLE_DESC ? h = E.tfhd.default_sample_description_index : h = R ? R.default_sample_description_index : 1, E.tfhd.flags & a.TFHD_FLAG_SAMPLE_DUR ? f = E.tfhd.default_sample_duration : f = R ? R.default_sample_duration : 0, E.tfhd.flags & a.TFHD_FLAG_SAMPLE_SIZE ? _ = E.tfhd.default_sample_size : _ = R ? R.default_sample_size : 0, E.tfhd.flags & a.TFHD_FLAG_SAMPLE_FLAGS ? g = E.tfhd.default_sample_flags : g = R ? R.default_sample_flags : 0, E.sample_number = 0, E.sbgps.length > 0 && b.initSampleGroups(I, E, E.sbgps, I.mdia.minf.stbl.sgpds, E.sgpds), e = 0; e < E.truns.length; e++){
                    var z = E.truns[e];
                    for(s = 0; s < z.sample_count; s++){
                        A = {}, A.moof_number = this.lastMoofIndex, A.number_in_traf = E.sample_number, E.sample_number++, A.number = I.samples.length, E.first_sample_index = I.samples.length, I.samples.push(A), A.track_id = I.tkhd.track_id, A.timescale = I.mdia.mdhd.timescale, A.description_index = h - 1, A.description = I.mdia.minf.stbl.stsd.entries[A.description_index], A.size = _, z.flags & a.TRUN_FLAGS_SIZE && (A.size = z.sample_size[s]), I.samples_size += A.size, A.duration = f, z.flags & a.TRUN_FLAGS_DURATION && (A.duration = z.sample_duration[s]), I.samples_duration += A.duration, I.first_traf_merged || s > 0 ? A.dts = I.samples[I.samples.length - 2].dts + I.samples[I.samples.length - 2].duration : (E.tfdt ? A.dts = E.tfdt.baseMediaDecodeTime : A.dts = 0, I.first_traf_merged = !0), A.cts = A.dts, z.flags & a.TRUN_FLAGS_CTS_OFFSET && (A.cts = A.dts + z.sample_composition_time_offset[s]), L = g, z.flags & a.TRUN_FLAGS_FLAGS ? L = z.sample_flags[s] : s === 0 && z.flags & a.TRUN_FLAGS_FIRST_FLAG && (L = z.first_sample_flags), A.is_sync = !(L >> 16 & 1), A.is_leading = L >> 26 & 3, A.depends_on = L >> 24 & 3, A.is_depended_on = L >> 22 & 3, A.has_redundancy = L >> 20 & 3, A.degradation_priority = L & 65535;
                        var se = !!(E.tfhd.flags & a.TFHD_FLAG_BASE_DATA_OFFSET), ye = !!(E.tfhd.flags & a.TFHD_FLAG_DEFAULT_BASE_IS_MOOF), Ot = !!(z.flags & a.TRUN_FLAGS_DATA_OFFSET), q = 0;
                        se ? q = E.tfhd.base_data_offset : ye || e === 0 ? q = S.start : q = m, e === 0 && s === 0 ? Ot ? A.offset = q + z.data_offset : A.offset = q : A.offset = m, m = A.offset + A.size, (E.sbgps.length > 0 || E.sgpds.length > 0 || I.mdia.minf.stbl.sbgps.length > 0 || I.mdia.minf.stbl.sgpds.length > 0) && b.setSampleGroupProperties(I, A, A.number_in_traf, E.sample_groups_info);
                    }
                }
                if (E.subs) {
                    I.has_fragment_subsamples = !0;
                    var St = E.first_sample_index;
                    for(e = 0; e < E.subs.entries.length; e++)St += E.subs.entries[e].sample_delta, A = I.samples[St - 1], A.subsamples = E.subs.entries[e].subsamples;
                }
            }
        }
    }, b.prototype.getSample = function(t, e) {
        var s, h = t.samples[e];
        if (!this.moov) return null;
        if (!h.data) h.data = new Uint8Array(h.size), h.alreadyRead = 0, this.samplesDataSize += h.size, n.debug("ISOFile", "Allocating sample #" + e + " on track #" + t.tkhd.track_id + " of size " + h.size + " (total: " + this.samplesDataSize + ")");
        else if (h.alreadyRead == h.size) return h;
        for(;;){
            var f = this.stream.findPosition(!0, h.offset + h.alreadyRead, !1);
            if (f > -1) {
                s = this.stream.buffers[f];
                var _ = s.byteLength - (h.offset + h.alreadyRead - s.fileStart);
                if (h.size - h.alreadyRead <= _) return n.debug("ISOFile", "Getting sample #" + e + " data (alreadyRead: " + h.alreadyRead + " offset: " + (h.offset + h.alreadyRead - s.fileStart) + " read size: " + (h.size - h.alreadyRead) + " full size: " + h.size + ")"), r.memcpy(h.data.buffer, h.alreadyRead, s, h.offset + h.alreadyRead - s.fileStart, h.size - h.alreadyRead), s.usedBytes += h.size - h.alreadyRead, this.stream.logBufferLevel(), h.alreadyRead = h.size, h;
                if (_ === 0) return null;
                n.debug("ISOFile", "Getting sample #" + e + " partial data (alreadyRead: " + h.alreadyRead + " offset: " + (h.offset + h.alreadyRead - s.fileStart) + " read size: " + _ + " full size: " + h.size + ")"), r.memcpy(h.data.buffer, h.alreadyRead, s, h.offset + h.alreadyRead - s.fileStart, _), h.alreadyRead += _, s.usedBytes += _, this.stream.logBufferLevel();
            } else return null;
        }
    }, b.prototype.releaseSample = function(t, e) {
        var s = t.samples[e];
        return s.data ? (this.samplesDataSize -= s.size, s.data = null, s.alreadyRead = 0, s.size) : 0;
    }, b.prototype.getAllocatedSampleDataSize = function() {
        return this.samplesDataSize;
    }, b.prototype.getCodecs = function() {
        var t, e = "";
        for(t = 0; t < this.moov.traks.length; t++){
            var s = this.moov.traks[t];
            t > 0 && (e += ","), e += s.mdia.minf.stbl.stsd.entries[0].getCodec();
        }
        return e;
    }, b.prototype.getTrexById = function(t) {
        var e;
        if (!this.moov || !this.moov.mvex) return null;
        for(e = 0; e < this.moov.mvex.trexs.length; e++){
            var s = this.moov.mvex.trexs[e];
            if (s.track_id == t) return s;
        }
        return null;
    }, b.prototype.getTrackById = function(t) {
        if (this.moov === void 0) return null;
        for(var e = 0; e < this.moov.traks.length; e++){
            var s = this.moov.traks[e];
            if (s.tkhd.track_id == t) return s;
        }
        return null;
    }, b.prototype.items = [], b.prototype.itemsDataSize = 0, b.prototype.flattenItemInfo = function() {
        var t = this.items, e, s, h, f = this.meta;
        if (f != null && f.hdlr !== void 0 && f.iinf !== void 0) {
            for(e = 0; e < f.iinf.item_infos.length; e++)h = {}, h.id = f.iinf.item_infos[e].item_ID, t[h.id] = h, h.ref_to = [], h.name = f.iinf.item_infos[e].item_name, f.iinf.item_infos[e].protection_index > 0 && (h.protection = f.ipro.protections[f.iinf.item_infos[e].protection_index - 1]), f.iinf.item_infos[e].item_type ? h.type = f.iinf.item_infos[e].item_type : h.type = "mime", h.content_type = f.iinf.item_infos[e].content_type, h.content_encoding = f.iinf.item_infos[e].content_encoding;
            if (f.iloc) for(e = 0; e < f.iloc.items.length; e++){
                var _ = f.iloc.items[e];
                switch(h = t[_.item_ID], _.data_reference_index !== 0 && (n.warn("Item storage with reference to other files: not supported"), h.source = f.dinf.boxes[_.data_reference_index - 1]), _.construction_method){
                    case 0:
                        break;
                    case 1:
                        n.warn("Item storage with construction_method : not supported");
                        break;
                    case 2:
                        n.warn("Item storage with construction_method : not supported");
                        break;
                }
                for(h.extents = [], h.size = 0, s = 0; s < _.extents.length; s++)h.extents[s] = {}, h.extents[s].offset = _.extents[s].extent_offset + _.base_offset, h.extents[s].length = _.extents[s].extent_length, h.extents[s].alreadyRead = 0, h.size += h.extents[s].length;
            }
            if (f.pitm && (t[f.pitm.item_id].primary = !0), f.iref) for(e = 0; e < f.iref.references.length; e++){
                var g = f.iref.references[e];
                for(s = 0; s < g.references.length; s++)t[g.from_item_ID].ref_to.push({
                    type: g.type,
                    id: g.references[s]
                });
            }
            if (f.iprp) for(var m = 0; m < f.iprp.ipmas.length; m++){
                var w = f.iprp.ipmas[m];
                for(e = 0; e < w.associations.length; e++){
                    var S = w.associations[e];
                    for(h = t[S.id], h.properties === void 0 && (h.properties = {}, h.properties.boxes = []), s = 0; s < S.props.length; s++){
                        var E = S.props[s];
                        if (E.property_index > 0 && E.property_index - 1 < f.iprp.ipco.boxes.length) {
                            var I = f.iprp.ipco.boxes[E.property_index - 1];
                            h.properties[I.type] = I, h.properties.boxes.push(I);
                        }
                    }
                }
            }
        }
    }, b.prototype.getItem = function(t) {
        var e, s;
        if (!this.meta) return null;
        if (s = this.items[t], !s.data && s.size) s.data = new Uint8Array(s.size), s.alreadyRead = 0, this.itemsDataSize += s.size, n.debug("ISOFile", "Allocating item #" + t + " of size " + s.size + " (total: " + this.itemsDataSize + ")");
        else if (s.alreadyRead === s.size) return s;
        for(var h = 0; h < s.extents.length; h++){
            var f = s.extents[h];
            if (f.alreadyRead !== f.length) {
                var _ = this.stream.findPosition(!0, f.offset + f.alreadyRead, !1);
                if (_ > -1) {
                    e = this.stream.buffers[_];
                    var g = e.byteLength - (f.offset + f.alreadyRead - e.fileStart);
                    if (f.length - f.alreadyRead <= g) n.debug("ISOFile", "Getting item #" + t + " extent #" + h + " data (alreadyRead: " + f.alreadyRead + " offset: " + (f.offset + f.alreadyRead - e.fileStart) + " read size: " + (f.length - f.alreadyRead) + " full extent size: " + f.length + " full item size: " + s.size + ")"), r.memcpy(s.data.buffer, s.alreadyRead, e, f.offset + f.alreadyRead - e.fileStart, f.length - f.alreadyRead), e.usedBytes += f.length - f.alreadyRead, this.stream.logBufferLevel(), s.alreadyRead += f.length - f.alreadyRead, f.alreadyRead = f.length;
                    else return n.debug("ISOFile", "Getting item #" + t + " extent #" + h + " partial data (alreadyRead: " + f.alreadyRead + " offset: " + (f.offset + f.alreadyRead - e.fileStart) + " read size: " + g + " full extent size: " + f.length + " full item size: " + s.size + ")"), r.memcpy(s.data.buffer, s.alreadyRead, e, f.offset + f.alreadyRead - e.fileStart, g), f.alreadyRead += g, s.alreadyRead += g, e.usedBytes += g, this.stream.logBufferLevel(), null;
                } else return null;
            }
        }
        return s.alreadyRead === s.size ? s : null;
    }, b.prototype.releaseItem = function(t) {
        var e = this.items[t];
        if (e.data) {
            this.itemsDataSize -= e.size, e.data = null, e.alreadyRead = 0;
            for(var s = 0; s < e.extents.length; s++){
                var h = e.extents[s];
                h.alreadyRead = 0;
            }
            return e.size;
        } else return 0;
    }, b.prototype.processItems = function(t) {
        for(var e in this.items){
            var s = this.items[e];
            this.getItem(s.id), t && !s.sent && (t(s), s.sent = !0, s.data = null);
        }
    }, b.prototype.hasItem = function(t) {
        for(var e in this.items){
            var s = this.items[e];
            if (s.name === t) return s.id;
        }
        return -1;
    }, b.prototype.getMetaHandler = function() {
        return this.meta ? this.meta.hdlr.handler : null;
    }, b.prototype.getPrimaryItem = function() {
        return !this.meta || !this.meta.pitm ? null : this.getItem(this.meta.pitm.item_id);
    }, b.prototype.itemToFragmentedTrackFile = function(t) {
        var e = t || {}, s = null;
        if (e.itemId ? s = this.getItem(e.itemId) : s = this.getPrimaryItem(), s == null) return null;
        var h = new b();
        h.discardMdatData = !1;
        var f = {
            type: s.type,
            description_boxes: s.properties.boxes
        };
        s.properties.ispe && (f.width = s.properties.ispe.image_width, f.height = s.properties.ispe.image_height);
        var _ = h.addTrack(f);
        return _ ? (h.addSample(_, s.data), h) : null;
    }, b.prototype.write = function(t) {
        for(var e = 0; e < this.boxes.length; e++)this.boxes[e].write(t);
    }, b.prototype.createFragment = function(t, e, s) {
        var h = this.getTrackById(t), f = this.getSample(h, e);
        if (f == null) return this.setNextSeekPositionFromSample(h.samples[e]), null;
        var _ = s || new r();
        _.endianness = r.BIG_ENDIAN;
        var g = this.createSingleSampleMoof(f);
        g.write(_), g.trafs[0].truns[0].data_offset = g.size + 8, n.debug("MP4Box", "Adjusting data_offset with new value " + g.trafs[0].truns[0].data_offset), _.adjustUint32(g.trafs[0].truns[0].data_offset_position, g.trafs[0].truns[0].data_offset);
        var m = new a.mdatBox();
        return m.data = f.data, m.write(_), _;
    }, b.writeInitializationSegment = function(t, e, s, h) {
        var f;
        n.debug("ISOFile", "Generating initialization segment");
        var _ = new r();
        _.endianness = r.BIG_ENDIAN, t.write(_);
        var g = e.add("mvex");
        for(s && g.add("mehd").set("fragment_duration", s), f = 0; f < e.traks.length; f++)g.add("trex").set("track_id", e.traks[f].tkhd.track_id).set("default_sample_description_index", 1).set("default_sample_duration", h).set("default_sample_size", 0).set("default_sample_flags", 65536);
        return e.write(_), _.buffer;
    }, b.prototype.save = function(t) {
        var e = new r();
        e.endianness = r.BIG_ENDIAN, this.write(e), e.save(t);
    }, b.prototype.getBuffer = function() {
        var t = new r();
        return t.endianness = r.BIG_ENDIAN, this.write(t), t.buffer;
    }, b.prototype.initializeSegmentation = function() {
        var t, e, s, h;
        for(this.onSegment === null && n.warn("MP4Box", "No segmentation callback set!"), this.isFragmentationInitialized || (this.isFragmentationInitialized = !0, this.nextMoofNumber = 0, this.resetTables()), e = [], t = 0; t < this.fragmentedTracks.length; t++){
            var f = new a.moovBox();
            f.mvhd = this.moov.mvhd, f.boxes.push(f.mvhd), s = this.getTrackById(this.fragmentedTracks[t].id), f.boxes.push(s), f.traks.push(s), h = {}, h.id = s.tkhd.track_id, h.user = this.fragmentedTracks[t].user, h.buffer = b.writeInitializationSegment(this.ftyp, f, this.moov.mvex && this.moov.mvex.mehd ? this.moov.mvex.mehd.fragment_duration : void 0, this.moov.traks[t].samples.length > 0 ? this.moov.traks[t].samples[0].duration : 0), e.push(h);
        }
        return e;
    }, a.Box.prototype.printHeader = function(t) {
        this.size += 8, this.size > d && (this.size += 8), this.type === "uuid" && (this.size += 16), t.log(t.indent + "size:" + this.size), t.log(t.indent + "type:" + this.type);
    }, a.FullBox.prototype.printHeader = function(t) {
        this.size += 4, a.Box.prototype.printHeader.call(this, t), t.log(t.indent + "version:" + this.version), t.log(t.indent + "flags:" + this.flags);
    }, a.Box.prototype.print = function(t) {
        this.printHeader(t);
    }, a.ContainerBox.prototype.print = function(t) {
        this.printHeader(t);
        for(var e = 0; e < this.boxes.length; e++)if (this.boxes[e]) {
            var s = t.indent;
            t.indent += " ", this.boxes[e].print(t), t.indent = s;
        }
    }, b.prototype.print = function(t) {
        t.indent = "";
        for(var e = 0; e < this.boxes.length; e++)this.boxes[e] && this.boxes[e].print(t);
    }, a.mvhdBox.prototype.print = function(t) {
        a.FullBox.prototype.printHeader.call(this, t), t.log(t.indent + "creation_time: " + this.creation_time), t.log(t.indent + "modification_time: " + this.modification_time), t.log(t.indent + "timescale: " + this.timescale), t.log(t.indent + "duration: " + this.duration), t.log(t.indent + "rate: " + this.rate), t.log(t.indent + "volume: " + (this.volume >> 8)), t.log(t.indent + "matrix: " + this.matrix.join(", ")), t.log(t.indent + "next_track_id: " + this.next_track_id);
    }, a.tkhdBox.prototype.print = function(t) {
        a.FullBox.prototype.printHeader.call(this, t), t.log(t.indent + "creation_time: " + this.creation_time), t.log(t.indent + "modification_time: " + this.modification_time), t.log(t.indent + "track_id: " + this.track_id), t.log(t.indent + "duration: " + this.duration), t.log(t.indent + "volume: " + (this.volume >> 8)), t.log(t.indent + "matrix: " + this.matrix.join(", ")), t.log(t.indent + "layer: " + this.layer), t.log(t.indent + "alternate_group: " + this.alternate_group), t.log(t.indent + "width: " + this.width), t.log(t.indent + "height: " + this.height);
    };
    var T = {};
    T.createFile = function(t, e) {
        var s = t !== void 0 ? t : !0, h = new b(e);
        return h.discardMdatData = !s, h;
    }, l.createFile = T.createFile;
})(ws);
const j = /* @__PURE__ */ bs(ws), D = {
    sampleRate: 48e3,
    channelCount: 2,
    codec: "mp4a.40.2"
};
function Li(l, n) {
    const o = n.videoTracks[0], r = {};
    if (o != null) {
        const c = dr(l.getTrackById(o.id)).buffer, { descKey: u, type: a } = o.codec.startsWith("avc1") ? {
            descKey: "avcDecoderConfigRecord",
            type: "avc1"
        } : o.codec.startsWith("hvc1") ? {
            descKey: "hevcDecoderConfigRecord",
            type: "hvc1"
        } : {
            descKey: "",
            type: ""
        };
        u !== "" && (r.videoTrackConf = {
            timescale: o.timescale,
            duration: o.duration,
            width: o.video.width,
            height: o.video.height,
            brands: n.brands,
            type: a,
            [u]: c
        }), r.videoDecoderConf = {
            codec: o.codec,
            codedHeight: o.video.height,
            codedWidth: o.video.width,
            description: c
        };
    }
    const d = n.audioTracks[0];
    if (d != null) {
        const c = ji(l);
        r.audioTrackConf = {
            timescale: d.timescale,
            samplerate: d.audio.sample_rate,
            channel_count: d.audio.channel_count,
            hdlr: "soun",
            type: d.codec.startsWith("mp4a") ? "mp4a" : d.codec,
            description: ji(l)
        }, r.audioDecoderConf = {
            codec: d.codec.startsWith("mp4a") ? D.codec : d.codec,
            numberOfChannels: d.audio.channel_count,
            sampleRate: d.audio.sample_rate,
            ...c == null ? {} : cr(c)
        };
    }
    return r;
}
function dr(l) {
    for (const n of l.mdia.minf.stbl.stsd.entries){
        const o = n.avcC ?? n.hvcC ?? n.vpcC;
        if (o != null) {
            const r = new j.DataStream(void 0, 0, j.DataStream.BIG_ENDIAN);
            return o.write(r), new Uint8Array(r.buffer.slice(8));
        }
    }
    throw Error("avcC, hvcC or VPX not found");
}
function ji(l, n = "mp4a") {
    var r;
    const o = (r = l.moov) == null ? void 0 : r.traks.map((d)=>d.mdia.minf.stbl.stsd.entries).flat().find(({ type: d })=>d === n);
    return o == null ? void 0 : o.esds;
}
function cr(l) {
    var a;
    const n = (a = l.esd.descs[0]) == null ? void 0 : a.descs[0];
    if (n == null) return {};
    const [o, r] = n.data, d = ((o & 7) << 1) + (r >> 7), c = (r & 127) >> 3;
    return {
        sampleRate: [
            96e3,
            88200,
            64e3,
            48e3,
            44100,
            32e3,
            24e3,
            22050,
            16e3,
            12e3,
            11025,
            8e3,
            7350
        ][d],
        numberOfChannels: c
    };
}
function ur(l) {
    if (l.moov != null) {
        for(var n = 0; n < l.moov.traks.length; n++)l.moov.traks[n].samples = [];
        l.mdats = [], l.moofs = [];
    }
}
var Ae;
class ki {
    constructor(){
        F(this, "readable");
        F(this, "writable");
        U(this, Ae, 0);
        const n = j.createFile();
        let o = !1;
        this.readable = new ReadableStream({
            start: (r)=>{
                n.onReady = (c)=>{
                    var y, v;
                    const u = (y = c.videoTracks[0]) == null ? void 0 : y.id;
                    u != null && n.setExtractionOptions(u, "video", {
                        nbSamples: 100
                    });
                    const a = (v = c.audioTracks[0]) == null ? void 0 : v.id;
                    a != null && n.setExtractionOptions(a, "audio", {
                        nbSamples: 100
                    }), r.enqueue({
                        chunkType: "ready",
                        data: {
                            info: c,
                            file: n
                        }
                    }), n.start();
                };
                const d = {};
                n.onSamples = (c, u, a)=>{
                    r.enqueue({
                        chunkType: "samples",
                        data: {
                            id: c,
                            type: u,
                            samples: a.map((y)=>({
                                    ...y
                                }))
                        }
                    }), d[c] = (d[c] ?? 0) + a.length, n.releaseUsedSamples(c, d[c]);
                }, n.onFlush = ()=>{
                    r.close();
                };
            },
            cancel: ()=>{
                n.stop(), o = !0;
            }
        }, {
            // 每条消息 100 个 samples
            highWaterMark: 50
        }), this.writable = new WritableStream({
            write: async (r)=>{
                if (o) {
                    this.writable.abort();
                    return;
                }
                const d = r.buffer;
                d.fileStart = p(this, Ae), x(this, Ae, p(this, Ae) + d.byteLength), n.appendBuffer(d);
            },
            close: ()=>{
                var r;
                n.flush(), n.stop(), (r = n.onFlush) == null || r.call(n);
            }
        });
    }
}
Ae = new WeakMap();
let pr = 0;
function vi(l) {
    return l.kind === "file" && l.createReader instanceof Function;
}
var Ie, Ce, J, G, Fe, tt, At, he, le, rt, Y, fe;
const Nt = class Nt {
    constructor(n, o = {
        audio: !0
    }){
        U(this, Ie, B.create(`MP4Clip id:${pr++},`));
        F(this, "ready");
        U(this, Ce, !1);
        U(this, J, {
            // 微秒
            duration: 0,
            width: 0,
            height: 0,
            audioSampleRate: 0,
            audioChanCount: 0
        });
        U(this, G);
        U(this, Fe, 1);
        U(this, tt, []);
        U(this, At, []);
        U(this, he, null);
        U(this, le, null);
        U(this, rt, {
            video: null,
            audio: null
        });
        U(this, Y, {
            audio: !0
        });
        /**
     * 拦截 {@link MP4Clip.tick} 方法返回的数据，用于对图像、音频数据二次处理
     * @param time 调用 tick 的时间
     * @param tickRet tick 返回的数据
     *
     * @see [移除视频绿幕背景](https://bilibili.github.io/WebAV/demo/3_2-chromakey-video)
     */ F(this, "tickInterceptor", async (n, o)=>o);
        U(this, fe, new AbortController());
        if (!(n instanceof ReadableStream) && !vi(n) && !Array.isArray(n.videoSamples)) throw Error("Illegal argument");
        x(this, Y, {
            ...o
        }), x(this, Fe, typeof o.audio == "object" && "volume" in o.audio ? o.audio.volume : 1);
        const r = async (d)=>(await Te(p(this, G), d), await p(this, G).stream());
        x(this, G, vi(n) ? n : "localFile" in n ? n.localFile : oi()), this.ready = (n instanceof ReadableStream ? r(n).then((d)=>$i(d, p(this, Y))) : vi(n) ? n.stream().then((d)=>$i(d, p(this, Y))) : Promise.resolve(n)).then(async ({ videoSamples: d, audioSamples: c, decoderConf: u })=>{
            x(this, tt, d), x(this, At, c), x(this, rt, u);
            const { videoFrameFinder: a, audioFrameFinder: y } = gr({
                video: u.video == null ? null : {
                    ...u.video,
                    hardwareAcceleration: p(this, Y).__unsafe_hardwareAcceleration__
                },
                audio: u.audio
            }, await p(this, G).createReader(), d, c, p(this, Y).audio !== !1 ? p(this, Fe) : null);
            return x(this, he, a), x(this, le, y), x(this, J, _r(u, d, c)), p(this, Ie).info("MP4Clip meta:", p(this, J)), {
                ...p(this, J)
            };
        });
    }
    get meta() {
        return {
            ...p(this, J)
        };
    }
    /**
   * 获取素材指定时刻的图像帧、音频数据
   * @param time 微秒
   */ async tick(n) {
        var d, c;
        if (n >= p(this, J).duration) return await this.tickInterceptor(n, {
            audio: [],
            state: "done"
        });
        const [o, r] = await Promise.all([
            ((d = p(this, le)) == null ? void 0 : d.find(n)) ?? [],
            (c = p(this, he)) == null ? void 0 : c.find(n)
        ]);
        return r == null ? await this.tickInterceptor(n, {
            audio: o,
            state: "success"
        }) : await this.tickInterceptor(n, {
            video: r,
            audio: o,
            state: "success"
        });
    }
    /**
   * 生成缩略图，默认每个关键帧生成一个 100px 宽度的缩略图。
   *
   * @param imgWidth 缩略图宽度，默认 100
   * @param opts Partial<ThumbnailOpts>
   * @returns Promise<Array<{ ts: number; img: Blob }>>
   */ async thumbnails(n = 100, o) {
        p(this, fe).abort(), x(this, fe, new AbortController());
        const r = p(this, fe).signal;
        await this.ready;
        const d = "generate thumbnails aborted";
        if (r.aborted) throw Error(d);
        const { width: c, height: u } = p(this, J), a = vr(n, Math.round(u * (n / c)), {
            quality: 0.1,
            type: "image/png"
        });
        return new Promise(async (y, v)=>{
            let b = [];
            const T = p(this, rt).video;
            if (T == null || p(this, tt).length === 0) {
                t();
                return;
            }
            r.addEventListener("abort", ()=>{
                v(Error(d));
            });
            async function t() {
                r.aborted || y(await Promise.all(b.map(async (_)=>({
                        ts: _.ts,
                        img: await _.img
                    }))));
            }
            function e(_) {
                b.push({
                    ts: _.timestamp,
                    img: a(_)
                });
            }
            const { start: s = 0, end: h = p(this, J).duration, step: f } = o ?? {};
            if (f) {
                let _ = s;
                const g = new vs(await p(this, G).createReader(), p(this, tt), {
                    ...T,
                    hardwareAcceleration: p(this, Y).__unsafe_hardwareAcceleration__
                });
                for(; _ <= h && !r.aborted;){
                    const m = await g.find(_);
                    m && e(m), _ += f;
                }
                g.destroy(), t();
            } else await Er(p(this, tt), p(this, G), T, r, {
                start: s,
                end: h
            }, (_, g)=>{
                e(_), g && t();
            });
        });
    }
    async split(n) {
        if (await this.ready, n <= 0 || n >= p(this, J).duration) throw Error('"time" out of bounds');
        const [o, r] = Sr(p(this, tt), n), [d, c] = xr(p(this, At), n), u = new Nt({
            localFile: p(this, G),
            videoSamples: o ?? [],
            audioSamples: d ?? [],
            decoderConf: p(this, rt)
        }, p(this, Y)), a = new Nt({
            localFile: p(this, G),
            videoSamples: r ?? [],
            audioSamples: c ?? [],
            decoderConf: p(this, rt)
        }, p(this, Y));
        return await Promise.all([
            u.ready,
            a.ready
        ]), [
            u,
            a
        ];
    }
    async clone() {
        await this.ready;
        const n = new Nt({
            localFile: p(this, G),
            videoSamples: [
                ...p(this, tt)
            ],
            audioSamples: [
                ...p(this, At)
            ],
            decoderConf: p(this, rt)
        }, p(this, Y));
        return await n.ready, n.tickInterceptor = this.tickInterceptor, n;
    }
    /**
   * 拆分 MP4Clip 为仅包含视频轨道和音频轨道的 MP4Clip
   * @returns Mp4CLip[]
   */ async splitTrack() {
        await this.ready;
        const n = [];
        if (p(this, tt).length > 0) {
            const o = new Nt({
                localFile: p(this, G),
                videoSamples: [
                    ...p(this, tt)
                ],
                audioSamples: [],
                decoderConf: {
                    video: p(this, rt).video,
                    audio: null
                }
            }, p(this, Y));
            await o.ready, o.tickInterceptor = this.tickInterceptor, n.push(o);
        }
        if (p(this, At).length > 0) {
            const o = new Nt({
                localFile: p(this, G),
                videoSamples: [],
                audioSamples: [
                    ...p(this, At)
                ],
                decoderConf: {
                    audio: p(this, rt).audio,
                    video: null
                }
            }, p(this, Y));
            await o.ready, o.tickInterceptor = this.tickInterceptor, n.push(o);
        }
        return n;
    }
    destroy() {
        var n, o;
        p(this, Ce) || (p(this, Ie).info("MP4Clip destroy"), x(this, Ce, !0), (n = p(this, he)) == null || n.destroy(), (o = p(this, le)) == null || o.destroy());
    }
};
Ie = new WeakMap(), Ce = new WeakMap(), J = new WeakMap(), G = new WeakMap(), Fe = new WeakMap(), tt = new WeakMap(), At = new WeakMap(), he = new WeakMap(), le = new WeakMap(), rt = new WeakMap(), Y = new WeakMap(), fe = new WeakMap();
let Ki = Nt;
function _r(l, n, o) {
    const r = {
        duration: 0,
        width: 0,
        height: 0,
        audioSampleRate: 0,
        audioChanCount: 0
    };
    l.video != null && n.length > 0 && (r.width = l.video.codedWidth ?? 0, r.height = l.video.codedHeight ?? 0), l.audio != null && o.length > 0 && (r.audioSampleRate = D.sampleRate, r.audioChanCount = D.channelCount);
    let d = 0, c = 0;
    if (n.length > 0) for(let u = n.length - 1; u >= 0; u--){
        const a = n[u];
        if (!a.deleted) {
            d = a.cts + a.duration;
            break;
        }
    }
    if (o.length > 0) {
        const u = o.at(-1);
        c = u.cts + u.duration;
    }
    return r.duration = Math.max(d, c), r;
}
function gr(l, n, o, r, d) {
    return {
        audioFrameFinder: d == null || l.audio == null || r.length === 0 ? null : new mr(n, r, l.audio, {
            volume: d,
            targetSampleRate: D.sampleRate
        }),
        videoFrameFinder: l.video == null || o.length === 0 ? null : new vs(n, o, l.video)
    };
}
async function $i(l, n = {}) {
    let o;
    const r = {
        video: null,
        audio: null
    };
    let d = [], c = [];
    return new Promise(async (a, y)=>{
        let v = -1, b = -1;
        const T = mi(l.pipeThrough(new ki()), {
            onChunk: async ({ chunkType: t, data: e })=>{
                if (t === "ready") {
                    o = e.info;
                    let { videoDecoderConf: s, audioDecoderConf: h } = Li(e.file, e.info);
                    r.video = s ?? null, r.audio = h ?? null, s == null && h == null && (T(), y(Error("MP4Clip must contain at least one video or audio track"))), B.info("mp4BoxFile moov ready", {
                        ...e.info,
                        tracks: null,
                        videoTracks: null,
                        audioTracks: null
                    }, r);
                } else if (t === "samples") {
                    if (e.type === "video") {
                        v === -1 && (v = e.samples[0].dts);
                        for (const s of e.samples)d.push(u(s, v, "video"));
                    } else if (e.type === "audio" && n.audio) {
                        b === -1 && (b = e.samples[0].dts);
                        for (const s of e.samples)c.push(u(s, b, "audio"));
                    }
                }
            },
            onDone: ()=>{
                const t = d.at(-1) ?? c.at(-1);
                if (o == null) {
                    y(Error("MP4Clip stream is done, but not emit ready"));
                    return;
                } else if (t == null) {
                    y(Error("MP4Clip stream not contain any sample"));
                    return;
                }
                const e = d[0];
                e != null && e.cts < 2e5 && (e.duration += e.cts, e.cts = 0), B.info("mp4 stream parsed"), a({
                    videoSamples: d,
                    audioSamples: c,
                    decoderConf: r
                });
            }
        });
    });
    function u(a, y = 0, v) {
        return {
            ...a,
            is_idr: v === "video" && a.is_sync && Ur(a.data),
            cts: (a.cts - y) / a.timescale * 1e6,
            dts: (a.dts - y) / a.timescale * 1e6,
            duration: a.duration / a.timescale * 1e6,
            timescale: 1e6,
            // 音频数据量可控，直接保存在内存中
            data: v === "video" ? null : a.data
        };
    }
}
var V, Gt, Yt, Be, Vt, nt, W, Ht, Xt, de, It, Pe, Wt, li;
class vs {
    constructor(n, o, r){
        U(this, V, null);
        U(this, Gt, 0);
        U(this, Yt, {
            abort: !1,
            st: performance.now()
        });
        F(this, "find", async (n)=>((p(this, V) == null || n <= p(this, Gt) || n - p(this, Gt) > 3e6) && p(this, Wt).call(this, n), p(this, Yt).abort = !0, x(this, Gt, n), x(this, Yt, {
                abort: !1,
                st: performance.now()
            }), await p(this, de).call(this, n, p(this, V), p(this, Yt))));
        // fix VideoFrame duration is null
        U(this, Be, 0);
        U(this, Vt, !1);
        U(this, nt, 0);
        U(this, W, []);
        U(this, Ht, 0);
        U(this, Xt, 0);
        U(this, de, async (n, o, r)=>{
            if (o == null || o.state === "closed" || r.abort) return null;
            if (p(this, W).length > 0) {
                const d = p(this, W)[0];
                return n < d.timestamp ? null : (p(this, W).shift(), n > d.timestamp + (d.duration ?? 0) ? (d.close(), await p(this, de).call(this, n, o, r)) : (p(this, W).length < 10 && p(this, Pe).call(this, o).catch((c)=>{
                    throw p(this, Wt).call(this, n), c;
                }), d));
            }
            if (p(this, It) || p(this, Ht) < p(this, Xt) && o.decodeQueueSize > 0) {
                if (performance.now() - r.st > 3e3) throw Error(`MP4Clip.tick video timeout, ${JSON.stringify(p(this, li).call(this))}`);
                await zi(15);
            } else {
                if (p(this, nt) >= this.samples.length) return null;
                try {
                    await p(this, Pe).call(this, o);
                } catch (d) {
                    throw p(this, Wt).call(this, n), d;
                }
            }
            return await p(this, de).call(this, n, o, r);
        });
        U(this, It, !1);
        U(this, Pe, async (n)=>{
            var d, c;
            if (p(this, It)) return;
            x(this, It, !0);
            let o = p(this, nt) + 1, r = !1;
            for(; o < this.samples.length; o++){
                const u = this.samples[o];
                if (!r && !u.deleted && (r = !0), u.is_idr) break;
            }
            if (r) {
                const u = this.samples.slice(p(this, nt), o);
                if (((d = u[0]) == null ? void 0 : d.is_idr) !== !0) B.warn("First sample not idr frame");
                else {
                    const a = await Ss(u, this.localFileReader);
                    if (n.state === "closed") return;
                    x(this, Be, ((c = a[0]) == null ? void 0 : c.duration) ?? 0), xs(n, a, {
                        onDecodingError: (y)=>{
                            if (p(this, Vt)) throw y;
                            x(this, Vt, !0), B.warn("Downgrade to software decode"), p(this, Wt).call(this);
                        }
                    }), x(this, Xt, p(this, Xt) + a.length);
                }
            }
            x(this, nt, o), x(this, It, !1);
        });
        U(this, Wt, (n)=>{
            var o, r;
            if (x(this, It, !1), p(this, W).forEach((d)=>d.close()), x(this, W, []), n == null || n === 0) x(this, nt, 0);
            else {
                let d = 0;
                for(let c = 0; c < this.samples.length; c++){
                    const u = this.samples[c];
                    if (u.is_idr && (d = c), !(u.cts < n)) {
                        x(this, nt, d);
                        break;
                    }
                }
            }
            x(this, Xt, 0), x(this, Ht, 0), ((o = p(this, V)) == null ? void 0 : o.state) !== "closed" && ((r = p(this, V)) == null || r.close()), x(this, V, new VideoDecoder({
                output: (d)=>{
                    if (x(this, Ht, p(this, Ht) + 1), d.timestamp === -1) {
                        d.close();
                        return;
                    }
                    let c = d;
                    d.duration == null && (c = new VideoFrame(d, {
                        duration: p(this, Be)
                    }), d.close()), p(this, W).push(c);
                },
                error: (d)=>{
                    B.error(`MP4Clip VideoDecoder err: ${d.message}`);
                }
            })), p(this, V).configure({
                ...this.conf,
                ...p(this, Vt) ? {
                    hardwareAcceleration: "prefer-software"
                } : {}
            });
        });
        U(this, li, ()=>{
            var n, o;
            return {
                time: p(this, Gt),
                decState: (n = p(this, V)) == null ? void 0 : n.state,
                decQSize: (o = p(this, V)) == null ? void 0 : o.decodeQueueSize,
                decCusorIdx: p(this, nt),
                sampleLen: this.samples.length,
                inputCnt: p(this, Xt),
                outputCnt: p(this, Ht),
                cacheFrameLen: p(this, W).length,
                softDeocde: p(this, Vt)
            };
        });
        F(this, "destroy", ()=>{
            var n, o;
            ((n = p(this, V)) == null ? void 0 : n.state) !== "closed" && ((o = p(this, V)) == null || o.close()), x(this, V, null), p(this, Yt).abort = !0, p(this, W).forEach((r)=>r.close()), x(this, W, []), this.localFileReader.close();
        });
        this.localFileReader = n, this.samples = o, this.conf = r;
    }
}
V = new WeakMap(), Gt = new WeakMap(), Yt = new WeakMap(), Be = new WeakMap(), Vt = new WeakMap(), nt = new WeakMap(), W = new WeakMap(), Ht = new WeakMap(), Xt = new WeakMap(), de = new WeakMap(), It = new WeakMap(), Pe = new WeakMap(), Wt = new WeakMap(), li = new WeakMap();
var Re, De, at, Zt, ot, mt, ht, ze, Le, fi, di;
class mr {
    constructor(n, o, r, d){
        U(this, Re, 1);
        U(this, De);
        U(this, at, null);
        U(this, Zt, {
            abort: !1,
            st: performance.now()
        });
        F(this, "find", async (n)=>{
            if (p(this, at) == null || n <= p(this, ot) || n - p(this, ot) > 1e5) {
                p(this, fi).call(this), x(this, ot, n);
                for(let r = 0; r < this.samples.length; r++)if (!(this.samples[r].cts < n)) {
                    x(this, mt, r);
                    break;
                }
                return [];
            }
            p(this, Zt).abort = !0;
            const o = n - p(this, ot);
            return x(this, ot, n), x(this, Zt, {
                abort: !1,
                st: performance.now()
            }), await p(this, ze).call(this, o, p(this, at), p(this, Zt));
        });
        U(this, ot, 0);
        U(this, mt, 0);
        U(this, ht, {
            frameCnt: 0,
            data: []
        });
        U(this, ze, async (n, o = null, r)=>{
            if (o == null || r.abort || o.state === "closed") return [];
            const d = Math.ceil(n * (p(this, De) / 1e6));
            if (d === 0) return [];
            const c = p(this, ht).frameCnt - d;
            if (c > 0) return c < D.sampleRate / 10 && p(this, Le).call(this, o), wr(p(this, ht), d);
            if (o.decodeQueueSize > 10) {
                if (performance.now() - r.st > 3e3) throw r.abort = !0, Error(`MP4Clip.tick audio timeout, ${JSON.stringify(p(this, di).call(this))}`);
                await zi(15);
            } else {
                if (p(this, mt) >= this.samples.length - 1) return [];
                p(this, Le).call(this, o);
            }
            return p(this, ze).call(this, n, o, r);
        });
        U(this, Le, (n)=>{
            if (n.decodeQueueSize > 100) return;
            const o = [];
            let r = p(this, mt);
            for(; r < this.samples.length;){
                const d = this.samples[r];
                if (r += 1, !d.deleted && (o.push(d), o.length >= 10)) break;
            }
            x(this, mt, r), n.decode(o.map((d)=>new EncodedAudioChunk({
                    type: "key",
                    timestamp: d.cts,
                    duration: d.duration,
                    data: d.data
                })));
        });
        U(this, fi, ()=>{
            var n;
            x(this, ot, 0), x(this, mt, 0), x(this, ht, {
                frameCnt: 0,
                data: []
            }), (n = p(this, at)) == null || n.close(), x(this, at, yr(this.conf, {
                resampleRate: D.sampleRate,
                volume: p(this, Re)
            }, (o)=>{
                p(this, ht).data.push(o), p(this, ht).frameCnt += o[0].length;
            }));
        });
        U(this, di, ()=>{
            var n, o;
            return {
                time: p(this, ot),
                decState: (n = p(this, at)) == null ? void 0 : n.state,
                decQSize: (o = p(this, at)) == null ? void 0 : o.decodeQueueSize,
                decCusorIdx: p(this, mt),
                sampleLen: this.samples.length,
                pcmLen: p(this, ht).frameCnt
            };
        });
        F(this, "destroy", ()=>{
            x(this, at, null), p(this, Zt).abort = !0, x(this, ht, {
                frameCnt: 0,
                data: []
            }), this.localFileReader.close();
        });
        this.localFileReader = n, this.samples = o, this.conf = r, x(this, Re, d.volume), x(this, De, d.targetSampleRate);
    }
}
Re = new WeakMap(), De = new WeakMap(), at = new WeakMap(), Zt = new WeakMap(), ot = new WeakMap(), mt = new WeakMap(), ht = new WeakMap(), ze = new WeakMap(), Le = new WeakMap(), fi = new WeakMap(), di = new WeakMap();
function yr(l, n, o) {
    const r = (a)=>{
        if (a.length !== 0) {
            if (n.volume !== 1) for (const y of a)for(let v = 0; v < y.length; v++)y[v] *= n.volume;
            a.length === 1 && (a = [
                a[0],
                a[0]
            ]), o(a);
        }
    }, d = br(r), c = n.resampleRate !== l.sampleRate, u = new AudioDecoder({
        output: (a)=>{
            const y = Ri(a);
            c ? d(()=>fr(y, a.sampleRate, {
                    rate: n.resampleRate,
                    chanCount: a.numberOfChannels
                })) : r(y), a.close();
        },
        error: (a)=>{
            B.error(`MP4Clip AudioDecoder err: ${a.message}`);
        }
    });
    return u.configure(l), {
        decode (a) {
            for (const y of a)u.decode(y);
        },
        close () {
            u.state !== "closed" && u.close();
        },
        get state () {
            return u.state;
        },
        get decodeQueueSize () {
            return u.decodeQueueSize;
        }
    };
}
function br(l) {
    const n = [];
    let o = 0;
    function r(u, a) {
        n[a] = u, d();
    }
    function d() {
        const u = n[o];
        u != null && (l(u), o += 1, d());
    }
    let c = 0;
    return (u)=>{
        const a = c;
        c += 1, u().then((y)=>r(y, a)).catch((y)=>r(y, a));
    };
}
function wr(l, n) {
    const o = [
        new Float32Array(n),
        new Float32Array(n)
    ];
    let r = 0, d = 0;
    for(; d < l.data.length;){
        const [c, u] = l.data[d];
        if (r + c.length > n) {
            const a = n - r;
            o[0].set(c.subarray(0, a), r), o[1].set(u.subarray(0, a), r), l.data[d][0] = c.subarray(a, c.length), l.data[d][1] = u.subarray(a, u.length);
            break;
        } else o[0].set(c, r), o[1].set(u, r), r += c.length, d++;
    }
    return l.data = l.data.slice(d), l.frameCnt -= n, o;
}
async function Ss(l, n) {
    const o = l[0], r = l.at(-1);
    if (r == null) return [];
    const d = r.offset + r.size - o.offset;
    if (d < 3e7) {
        const c = new Uint8Array(await n.read(d, {
            at: o.offset
        }));
        return l.map((u)=>{
            const a = u.offset - o.offset;
            let y = c.subarray(a, a + u.size);
            return u.is_idr && (y = qi(y)), new EncodedVideoChunk({
                type: u.is_sync ? "key" : "delta",
                timestamp: u.cts,
                duration: u.duration,
                data: y
            });
        });
    }
    return await Promise.all(l.map(async (c)=>{
        let u = await n.read(c.size, {
            at: c.offset
        });
        return c.is_idr && (u = qi(new Uint8Array(u))), new EncodedVideoChunk({
            type: c.is_sync ? "key" : "delta",
            timestamp: c.cts,
            duration: c.duration,
            data: u
        });
    }));
}
function vr(l, n, o) {
    const r = new OffscreenCanvas(l, n), d = r.getContext("2d");
    return async (c)=>(d.drawImage(c, 0, 0, l, n), c.close(), await r.convertToBlob(o));
}
function Sr(l, n) {
    if (l.length === 0) return [];
    let o = 0, r = 0, d = -1;
    for(let y = 0; y < l.length; y++){
        const v = l[y];
        if (d === -1 && n < v.cts && (d = y - 1), v.is_idr) {
            if (d === -1) o = y;
            else {
                r = y;
                break;
            }
        }
    }
    const c = l[d];
    if (c == null) throw Error("Not found video sample by time");
    const u = l.slice(0, r === 0 ? l.length : r).map((y)=>({
            ...y
        }));
    for(let y = o; y < u.length; y++){
        const v = u[y];
        n < v.cts && (v.deleted = !0, v.cts = -1);
    }
    const a = l.slice(c.is_idr ? r : o).map((y)=>({
            ...y,
            cts: y.cts - n
        }));
    for (const y of a){
        if (y.cts >= 0) break;
        y.deleted = !0, y.cts = -1;
    }
    return [
        u,
        a
    ];
}
function xr(l, n) {
    if (l.length === 0) return [];
    let o = -1;
    for(let c = 0; c < l.length; c++){
        const u = l[c];
        if (!(n > u.cts)) {
            o = c;
            break;
        }
    }
    if (o === -1) throw Error("Not found audio sample by time");
    const r = l.slice(0, o), d = l.slice(o).map((c)=>({
            ...c,
            cts: c.cts - n
        }));
    return [
        r,
        d
    ];
}
function xs(l, n, o) {
    let r = 0;
    if (l.state === "configured") {
        for(; r < n.length; r++)l.decode(n[r]);
        l.flush().catch((d)=>{
            if (!(d instanceof Error)) throw d;
            if (d.message.includes("Decoding error") && o.onDecodingError != null) {
                o.onDecodingError(d);
                return;
            }
            if (!d.message.includes("Aborted due to close")) throw d;
        });
    }
}
function qi(l) {
    const n = new DataView(l.buffer);
    return (n.getUint8(4) & 31) === 6 ? l.subarray(n.getUint32(0) + 4) : l;
}
function Ur(l) {
    const n = new DataView(l.buffer);
    let o = 0;
    for(; o < l.byteLength - 4;){
        if ((n.getUint8(o + 4) & 31) === 5) return !0;
        o += n.getUint32(o) + 4;
    }
    return !1;
}
async function Er(l, n, o, r, d, c) {
    const u = await n.createReader();
    let a = 0;
    const y = new VideoDecoder({
        output: (b)=>{
            a += 1;
            const T = a === v.length;
            c(b, T), T && u.close();
        },
        error: B.error
    });
    r.addEventListener("abort", ()=>{
        u.close(), y.close();
    });
    const v = await Ss(l.filter((b)=>!b.deleted && b.is_sync && b.cts >= d.start && b.cts <= d.end), u);
    v.length === 0 || r.aborted || (y.configure(o), xs(y, v, {}));
}
var N, $, k, ci, Us;
const Mt = class Mt {
    /**
   * 静态图片可使用流、ImageBitmap 初始化
   *
   * 动图需要使用 VideoFrame[] 或提供图片类型
   */ constructor(n){
        U(this, ci);
        F(this, "ready");
        U(this, N, {
            // 微秒
            duration: 0,
            width: 0,
            height: 0
        });
        U(this, $, null);
        U(this, k, []);
        const o = (r)=>(x(this, $, r), p(this, N).width = r.width, p(this, N).height = r.height, p(this, N).duration = 1 / 0, {
                ...p(this, N)
            });
        if (n instanceof ReadableStream) this.ready = new Response(n).blob().then((r)=>createImageBitmap(r)).then(o);
        else if (n instanceof ImageBitmap) this.ready = Promise.resolve(o(n));
        else if (Array.isArray(n) && n.every((r)=>r instanceof VideoFrame)) {
            x(this, k, n);
            const r = p(this, k)[0];
            if (r == null) throw Error("The frame count must be greater than 0");
            x(this, N, {
                width: r.displayWidth,
                height: r.displayHeight,
                duration: p(this, k).reduce((d, c)=>d + (c.duration ?? 0), 0)
            }), this.ready = Promise.resolve({
                ...p(this, N),
                duration: 1 / 0
            });
        } else if ("type" in n) this.ready = H(this, ci, Us).call(this, n.stream, n.type).then(()=>({
                width: p(this, N).width,
                height: p(this, N).height,
                duration: 1 / 0
            }));
        else throw Error("Illegal arguments");
    }
    /**
   * ⚠️ 静态图片的 duration 为 Infinity
   *
   * 使用 Sprite 包装时需要将它的 duration 设置为有限数
   *
   */ get meta() {
        return {
            ...p(this, N)
        };
    }
    async tick(n) {
        if (p(this, $) != null) return {
            video: await createImageBitmap(p(this, $)),
            state: "success"
        };
        const o = n % p(this, N).duration;
        return {
            video: (p(this, k).find((r)=>o >= r.timestamp && o <= r.timestamp + (r.duration ?? 0)) ?? p(this, k)[0]).clone(),
            state: "success"
        };
    }
    async split(n) {
        if (await this.ready, p(this, $) != null) return [
            new Mt(await createImageBitmap(p(this, $))),
            new Mt(await createImageBitmap(p(this, $)))
        ];
        let o = -1;
        for(let c = 0; c < p(this, k).length; c++){
            const u = p(this, k)[c];
            if (!(n > u.timestamp)) {
                o = c;
                break;
            }
        }
        if (o === -1) throw Error("Not found frame by time");
        const r = p(this, k).slice(0, o).map((c)=>new VideoFrame(c)), d = p(this, k).slice(o).map((c)=>new VideoFrame(c, {
                timestamp: c.timestamp - n
            }));
        return [
            new Mt(r),
            new Mt(d)
        ];
    }
    async clone() {
        await this.ready;
        const n = p(this, $) == null ? p(this, k).map((o)=>o.clone()) : await createImageBitmap(p(this, $));
        return new Mt(n);
    }
    destroy() {
        var n;
        B.info("ImgClip destroy"), (n = p(this, $)) == null || n.close(), p(this, k).forEach((o)=>o.close());
    }
};
N = new WeakMap(), $ = new WeakMap(), k = new WeakMap(), ci = new WeakSet(), Us = async function(n, o) {
    x(this, k, await lr(n, o));
    const r = p(this, k)[0];
    if (r == null) throw Error("No frame available in gif");
    x(this, N, {
        duration: p(this, k).reduce((d, c)=>d + (c.duration ?? 0), 0),
        width: r.codedWidth,
        height: r.codedHeight
    }), B.info("ImgClip ready:", p(this, N));
};
let Qi = Mt;
var jt, yt, Ct, lt, ui, Es, Ft, ft;
const gt = class gt {
    /**
   *
   * @param dataSource 音频文件流
   * @param opts 音频配置，控制音量、是否循环
   */ constructor(n, o = {}){
        U(this, ui);
        F(this, "ready");
        U(this, jt, {
            // 微秒
            duration: 0,
            width: 0,
            height: 0
        });
        U(this, yt, new Float32Array());
        U(this, Ct, new Float32Array());
        U(this, lt);
        // 微秒
        U(this, Ft, 0);
        U(this, ft, 0);
        x(this, lt, {
            loop: !1,
            volume: 1,
            ...o
        }), this.ready = H(this, ui, Es).call(this, n).then(()=>({
                // audio 没有宽高，无需绘制
                width: 0,
                height: 0,
                duration: o.loop ? 1 / 0 : p(this, jt).duration
            }));
    }
    /**
   * 音频元信息
   *
   * ⚠️ 注意，这里是转换后（标准化）的元信息，非原始音频元信息
   */ get meta() {
        return {
            ...p(this, jt),
            sampleRate: D.sampleRate,
            chanCount: 2
        };
    }
    /**
   * 获取音频素材完整的 PCM 数据
   */ getPCMData() {
        return [
            p(this, yt),
            p(this, Ct)
        ];
    }
    /**
   * 返回上次与当前时刻差对应的音频 PCM 数据；
   *
   * 若差值超过 3s 或当前时间小于上次时间，则重置状态
   * @example
   * tick(0) // => []
   * tick(1e6) // => [leftChanPCM(1s), rightChanPCM(1s)]
   *
   */ async tick(n) {
        if (!p(this, lt).loop && n >= p(this, jt).duration) return {
            audio: [],
            state: "done"
        };
        const o = n - p(this, Ft);
        if (n < p(this, Ft) || o > 3e6) return x(this, Ft, n), x(this, ft, Math.ceil(p(this, Ft) / 1e6 * D.sampleRate)), {
            audio: [
                new Float32Array(0),
                new Float32Array(0)
            ],
            state: "success"
        };
        x(this, Ft, n);
        const r = Math.ceil(o / 1e6 * D.sampleRate), d = p(this, ft) + r, c = p(this, lt).loop ? [
            Ii(p(this, yt), p(this, ft), d),
            Ii(p(this, Ct), p(this, ft), d)
        ] : [
            p(this, yt).slice(p(this, ft), d),
            p(this, Ct).slice(p(this, ft), d)
        ];
        return x(this, ft, d), {
            audio: c,
            state: "success"
        };
    }
    /**
   * 按指定时间切割，返回前后两个音频素材
   * @param time 时间，单位微秒
   */ async split(n) {
        await this.ready;
        const o = Math.ceil(n / 1e6 * D.sampleRate), r = new gt(this.getPCMData().map((c)=>c.slice(0, o)), p(this, lt)), d = new gt(this.getPCMData().map((c)=>c.slice(o)), p(this, lt));
        return [
            r,
            d
        ];
    }
    async clone() {
        await this.ready;
        const n = new gt(this.getPCMData(), p(this, lt));
        return await n.ready, n;
    }
    /**
   * 销毁实例，释放资源
   */ destroy() {
        x(this, yt, new Float32Array(0)), x(this, Ct, new Float32Array(0)), B.info("---- audioclip destroy ----");
    }
};
jt = new WeakMap(), yt = new WeakMap(), Ct = new WeakMap(), lt = new WeakMap(), ui = new WeakSet(), Es = async function(n) {
    gt.ctx == null && (gt.ctx = new AudioContext({
        sampleRate: D.sampleRate
    }));
    const o = performance.now(), r = n instanceof ReadableStream ? await Tr(n, gt.ctx) : n;
    B.info("Audio clip decoded complete:", performance.now() - o);
    const d = p(this, lt).volume;
    if (d !== 1) for (const c of r)for(let u = 0; u < c.length; u += 1)c[u] *= d;
    p(this, jt).duration = r[0].length / D.sampleRate * 1e6, x(this, yt, r[0]), x(this, Ct, r[1] ?? p(this, yt)), B.info("Audio clip convert to AudioData, time:", performance.now() - o);
}, Ft = new WeakMap(), ft = new WeakMap(), F(gt, "ctx", null);
let Ci = gt;
async function gn(l, n) {
    const o = [];
    for (const r of l)await r.ready, o.push(r.getPCMData());
    return new Ci(ys(o), n);
}
async function Tr(l, n) {
    const o = await new Response(l).arrayBuffer();
    return Di(await n.decodeAudioData(o));
}
var Kt, ke, $t, ce;
const pi = class pi {
    constructor(n){
        F(this, "ready");
        U(this, Kt, {
            // 微秒
            duration: 0,
            width: 0,
            height: 0
        });
        U(this, ke, ()=>{});
        /**
     * 实时流的音轨
     */ F(this, "audioTrack");
        U(this, $t, null);
        U(this, ce);
        x(this, ce, n);
        const o = n.getVideoTracks()[0];
        if (o != null) {
            const { width: r, height: d } = o.getSettings();
            o.contentHint = "motion", p(this, Kt).width = r ?? 0, p(this, Kt).height = d ?? 0, x(this, $t, new OffscreenCanvas(r ?? 0, d ?? 0)), x(this, ke, Ar(p(this, $t).getContext("2d"), o));
        }
        this.audioTrack = n.getAudioTracks()[0] ?? null, p(this, Kt).duration = 1 / 0, this.ready = Promise.resolve(this.meta);
    }
    get meta() {
        return {
            ...p(this, Kt)
        };
    }
    async tick() {
        return {
            video: p(this, $t) == null ? null : await createImageBitmap(p(this, $t)),
            audio: [],
            state: "success"
        };
    }
    async split() {
        return [
            await this.clone(),
            await this.clone()
        ];
    }
    async clone() {
        return new pi(p(this, ce).clone());
    }
    destroy() {
        p(this, ce).getTracks().forEach((n)=>n.stop()), p(this, ke).call(this);
    }
};
Kt = new WeakMap(), ke = new WeakMap(), $t = new WeakMap(), ce = new WeakMap(), F(pi, "ctx", null);
let Ji = pi;
function Ar(l, n) {
    return mi(new MediaStreamTrackProcessor({
        track: n
    }).readable, {
        onChunk: async (o)=>{
            l.drawImage(o, 0, 0), o.close();
        },
        onDone: async ()=>{}
    });
}
var M, Oe, dt, ct, ut, Z, bt, wt, _i, Ts;
const Ee = class Ee {
    constructor(n, o){
        U(this, _i);
        F(this, "ready");
        U(this, M, []);
        U(this, Oe, {
            width: 0,
            height: 0,
            duration: 0
        });
        U(this, dt, {
            color: "#FFF",
            textBgColor: null,
            type: "srt",
            fontSize: 30,
            letterSpacing: null,
            bottomOffset: 30,
            fontFamily: "Noto Sans SC",
            strokeStyle: "#000",
            lineWidth: null,
            lineCap: null,
            lineJoin: null,
            textShadow: {
                offsetX: 2,
                offsetY: 2,
                blur: 4,
                color: "#000"
            },
            videoWidth: 1280,
            videoHeight: 720
        });
        U(this, ct);
        U(this, ut);
        U(this, Z, null);
        U(this, bt, 0);
        U(this, wt, 0);
        var y;
        if (x(this, M, Array.isArray(n) ? n : Ir(n).map(({ start: v, end: b, text: T })=>({
                start: v * 1e6,
                end: b * 1e6,
                text: T
            }))), p(this, M).length === 0) throw Error("No subtitles content");
        x(this, dt, Object.assign(p(this, dt), o)), x(this, wt, o.textBgColor == null ? 0 : (o.fontSize ?? 50) * 0.2);
        const { fontSize: r, fontFamily: d, videoWidth: c, videoHeight: u, letterSpacing: a } = p(this, dt);
        x(this, bt, r + p(this, wt) * 2), x(this, ct, new OffscreenCanvas(c, u)), x(this, ut, p(this, ct).getContext("2d")), p(this, ut).font = `${r}px ${d}`, p(this, ut).textAlign = "center", p(this, ut).textBaseline = "top", p(this, ut).letterSpacing = a ?? "0px", x(this, Oe, {
            width: c,
            height: u,
            duration: ((y = p(this, M).at(-1)) == null ? void 0 : y.end) ?? 0
        }), this.ready = Promise.resolve(this.meta);
    }
    get meta() {
        return {
            ...p(this, Oe)
        };
    }
    /**
   * @see {@link IClip.tick}
   */ async tick(n) {
        var c, u;
        if (p(this, Z) != null && n >= p(this, Z).timestamp && n <= p(this, Z).timestamp + (p(this, Z).duration ?? 0)) return {
            video: p(this, Z).clone(),
            state: "success"
        };
        let o = 0;
        for(; o < p(this, M).length && !(n <= p(this, M)[o].end); o += 1);
        const r = p(this, M)[o] ?? p(this, M).at(-1);
        if (n > r.end) return {
            state: "done"
        };
        if (n < r.start) {
            p(this, ut).clearRect(0, 0, p(this, ct).width, p(this, ct).height);
            const a = new VideoFrame(p(this, ct), {
                timestamp: n,
                // 直到下个字幕出现的时机
                duration: r.start - n
            });
            return (c = p(this, Z)) == null || c.close(), x(this, Z, a), {
                video: a.clone(),
                state: "success"
            };
        }
        H(this, _i, Ts).call(this, r.text);
        const d = new VideoFrame(p(this, ct), {
            timestamp: n,
            duration: r.end - n
        });
        return (u = p(this, Z)) == null || u.close(), x(this, Z, d), {
            video: d.clone(),
            state: "success"
        };
    }
    /**
   * @see {@link IClip.destroy}
   */ async split(n) {
        await this.ready;
        let o = -1;
        for(let a = 0; a < p(this, M).length; a++){
            const y = p(this, M)[a];
            if (!(n > y.start)) {
                o = a;
                break;
            }
        }
        if (o === -1) throw Error("Not found subtitle by time");
        const r = p(this, M).slice(0, o).map((a)=>({
                ...a
            }));
        let d = r.at(-1), c = null;
        d != null && d.end > n && (c = {
            start: 0,
            end: d.end - n,
            text: d.text
        }, d.end = n);
        const u = p(this, M).slice(o).map((a)=>({
                ...a,
                start: a.start - n,
                end: a.end - n
            }));
        return c != null && u.unshift(c), [
            new Ee(r, p(this, dt)),
            new Ee(u, p(this, dt))
        ];
    }
    /**
   * @see {@link IClip.clone}
   */ async clone() {
        return new Ee(p(this, M).slice(0), p(this, dt));
    }
    /**
   * @see {@link IClip.destroy}
   */ destroy() {
        var n;
        (n = p(this, Z)) == null || n.close();
    }
};
M = new WeakMap(), Oe = new WeakMap(), dt = new WeakMap(), ct = new WeakMap(), ut = new WeakMap(), Z = new WeakMap(), bt = new WeakMap(), wt = new WeakMap(), _i = new WeakSet(), Ts = function(n) {
    const o = n.split(`
`).reverse().map((f)=>f.trim()), { width: r, height: d } = p(this, ct), { color: c, fontSize: u, textBgColor: a, textShadow: y, strokeStyle: v, lineWidth: b, lineCap: T, lineJoin: t, bottomOffset: e } = p(this, dt), s = p(this, ut);
    s.clearRect(0, 0, r, d), s.globalAlpha = 0.6;
    let h = e;
    for (const f of o){
        const _ = s.measureText(f), g = r / 2;
        a != null && (s.shadowOffsetX = 0, s.shadowOffsetY = 0, s.shadowBlur = 0, s.fillStyle = a, s.globalAlpha = 0.5, s.fillRect(g - _.actualBoundingBoxLeft - p(this, wt), d - h - p(this, bt), _.width + p(this, wt) * 2, p(this, bt))), s.shadowColor = y.color, s.shadowOffsetX = y.offsetX, s.shadowOffsetY = y.offsetY, s.shadowBlur = y.blur, s.globalAlpha = 1, v != null && (s.lineWidth = b ?? u / 6, T != null && (s.lineCap = T), t != null && (s.lineJoin = t), s.strokeStyle = v, s.strokeText(f, g, d - h - p(this, bt) + p(this, wt))), s.fillStyle = c, s.fillText(f, g, d - h - p(this, bt) + p(this, wt)), h += p(this, bt) + u * 0.2;
    }
};
let ts = Ee;
function es(l) {
    const n = l.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    if (n == null) throw Error(`time format error: ${l}`);
    const o = Number(n[1]), r = Number(n[2]), d = Number(n[3]), c = Number(n[4]);
    return o * 3600 + r * 60 + d + c / 1e3;
}
function Ir(l) {
    return l.split(/\r|\n/).map((n)=>n.trim()).filter((n)=>n.length > 0).map((n)=>({
            lineStr: n,
            match: n.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/)
        })).filter(({ lineStr: n }, o, r)=>{
        var d;
        return !(/^\d+$/.test(n) && ((d = r[o + 1]) == null ? void 0 : d.match) != null);
    }).reduce((n, { lineStr: o, match: r })=>{
        if (r == null) {
            const d = n.at(-1);
            if (d == null) return n;
            d.text += d.text.length === 0 ? o : `
${o}`;
        } else n.push({
            start: es(r[1]),
            end: es(r[2]),
            text: ""
        });
        return n;
    }, []);
}
var vt;
class Je {
    constructor(){
        U(this, vt, /* @__PURE__ */ new Map());
        /**
     * 监听 EventType 中定义的事件
     */ F(this, "on", (n, o)=>{
            const r = p(this, vt).get(n) ?? /* @__PURE__ */ new Set();
            return r.add(o), p(this, vt).has(n) || p(this, vt).set(n, r), ()=>{
                r.delete(o), r.size === 0 && p(this, vt).delete(n);
            };
        });
        /**
     * 监听事件，首次触发后自动移除监听
     *
     * 期望回调一次的事件，使用 once; 期望多次回调使用 on
     */ F(this, "once", (n, o)=>{
            const r = this.on(n, (...d)=>{
                r(), o(...d);
            });
            return r;
        });
        /**
     * 触发事件
     * @param type
     * @param args
     * @returns
     */ F(this, "emit", (n, ...o)=>{
            const r = p(this, vt).get(n);
            r != null && r.forEach((d)=>d(...o));
        });
    }
    /**
   * 在两个 EventTool 实例间转发消息
   * @param from
   * @param to
   * @param evtTypes 需转发的消息类型
   *
   * @example
   * EventTool.forwardEvent(from, to, ['evtName']),
   */ static forwardEvent(n, o, r) {
        const d = r.map((c)=>{
            const [u, a] = Array.isArray(c) ? c : [
                c,
                c
            ];
            return n.on(u, (...y)=>{
                o.emit(a, ...y);
            });
        });
        return ()=>{
            d.forEach((c)=>c());
        };
    }
    destroy() {
        p(this, vt).clear();
    }
}
vt = new WeakMap();
const Oi = (l, n)=>{
    const o = new Uint8Array(8);
    new DataView(o.buffer).setUint32(0, n);
    for(let d = 0; d < 4; d++)o[4 + d] = l.charCodeAt(d);
    return o;
}, Cr = ()=>{
    const l = new TextEncoder(), n = l.encode("mdta"), o = l.encode("mp4 handler"), r = 32 + o.byteLength + 1, d = new Uint8Array(r), c = new DataView(d.buffer);
    return d.set(Oi("hdlr", r), 0), c.setUint32(8, 0), d.set(n, 16), d.set(o, 32), d;
}, Fr = (l)=>{
    const n = new TextEncoder(), o = n.encode("mdta"), r = l.map((v)=>{
        const b = n.encode(v), T = 8 + b.byteLength, t = new Uint8Array(T);
        return new DataView(t.buffer).setUint32(0, T), t.set(o, 4), t.set(b, 4 + o.byteLength), t;
    }), c = 16 + r.reduce((v, b)=>v + b.byteLength, 0), u = new Uint8Array(c), a = new DataView(u.buffer);
    u.set(Oi("keys", c), 0), a.setUint32(8, 0), a.setUint32(12, l.length);
    let y = 16;
    for (const v of r)u.set(v, y), y += v.byteLength;
    return u;
}, Br = (l)=>{
    const n = new TextEncoder(), o = n.encode("data"), r = Object.entries(l).map(([y, v], b)=>{
        const T = b + 1, t = n.encode(v), e = 24 + t.byteLength, s = new Uint8Array(e), h = new DataView(s.buffer);
        return h.setUint32(0, e), h.setUint32(4, T), h.setUint32(8, 16 + t.byteLength), s.set(o, 12), h.setUint32(16, 1), s.set(t, 24), s;
    }), c = 8 + r.reduce((y, v)=>y + v.byteLength, 0), u = new Uint8Array(c);
    u.set(Oi("ilst", c), 0);
    let a = 8;
    for (const y of r)u.set(y, a), a += y.byteLength;
    return u;
}, Pr = (l)=>{
    const n = Cr(), o = Fr(Object.keys(l)), r = Br(l), d = n.length + o.length + r.length, c = new Uint8Array(d);
    return c.set(n, 0), c.set(o, n.length), c.set(r, n.length + o.length), c;
};
function Rr(l) {
    B.info("recodemux opts:", l);
    const n = j.createFile(), o = new Je(), r = (y, v)=>{
        const T = y.add("udta").add("meta");
        T.data = Pr(v), T.size = T.data.byteLength;
    };
    let d = !1;
    const c = ()=>{
        n.moov == null || d || (d = !0, l.metaDataTags != null && r(n.moov, l.metaDataTags), l.duration != null && (n.moov.mvhd.duration = l.duration));
    };
    o.once("VideoReady", c), o.once("AudioReady", c);
    let u = l.video != null ? Dr(l.video, n, o) : null, a = l.audio != null ? Lr(l.audio, n, o) : null;
    return l.video == null && o.emit("VideoReady"), l.audio == null && o.emit("AudioReady"), {
        encodeVideo: (y, v)=>{
            u == null || u.encode(y, v), y.close();
        },
        encodeAudio: (y)=>{
            a != null && (a.encode(y), y.close());
        },
        getEncodeQueueSize: ()=>(u == null ? void 0 : u.encodeQueueSize) ?? (a == null ? void 0 : a.encodeQueueSize) ?? 0,
        flush: async ()=>{
            await Promise.all([
                u == null ? void 0 : u.flush(),
                (a == null ? void 0 : a.state) === "configured" ? a.flush() : null
            ]);
        },
        close: ()=>{
            o.destroy(), u == null || u.close(), (a == null ? void 0 : a.state) === "configured" && a.close();
        },
        mp4file: n
    };
}
function Dr(l, n, o) {
    const r = {
        // 微秒
        timescale: 1e6,
        width: l.width,
        height: l.height,
        brands: [
            "isom",
            "iso2",
            "avc1",
            "mp42",
            "mp41"
        ],
        avcDecoderConfigRecord: null,
        name: "Track created with WebAV"
    };
    let d = -1, c = !1;
    o.once("AudioReady", ()=>{
        c = !0;
    });
    const u = {
        encoder0: [],
        encoder1: []
    }, a = (_, g, m)=>{
        var w;
        if (d === -1 && m != null) {
            const S = (w = m.decoderConfig) == null ? void 0 : w.description;
            zr(S), r.avcDecoderConfigRecord = S, d = n.addTrack(r), o.emit("VideoReady"), B.info("VideoEncoder, video track ready, trackId:", d);
        }
        u[_].push(hi(g));
    };
    let y = "encoder1", v = 0;
    const b = 1e4;
    function T() {
        if (!c) return;
        const _ = y === "encoder1" ? "encoder0" : "encoder1", g = u[y], m = u[_];
        if (g.length === 0 && m.length === 0) return;
        let w = g[0];
        if (w != null && w.cts - v < b) {
            const E = t(g);
            E > v && (v = E);
        }
        const S = m[0];
        S != null && S.cts - v < b && (y = _, T());
    }
    function t(_) {
        let g = -1, m = 0;
        for(; m < _.length; m++){
            const w = _[m];
            if (m > 0 && w.is_sync) break;
            n.addSample(d, w.data, w), g = w.cts + w.duration;
        }
        return _.splice(0, m), g;
    }
    const e = _s(T, 15), s = is(l, (_, g)=>a("encoder0", _, g)), h = is(l, (_, g)=>a("encoder1", _, g));
    let f = 0;
    return {
        get encodeQueueSize () {
            return s.encodeQueueSize + h.encodeQueueSize;
        },
        encode: (_, g)=>{
            g.keyFrame && (f += 1), (f % 2 === 0 ? s : h).encode(_, g);
        },
        flush: async ()=>{
            await Promise.all([
                s.state === "configured" ? await s.flush() : null,
                h.state === "configured" ? await h.flush() : null
            ]), e(), T();
        },
        close: ()=>{
            s.state === "configured" && s.close(), h.state === "configured" && h.close();
        }
    };
}
function zr(l) {
    const n = new Uint8Array(l);
    n[2].toString(2).slice(-2).includes("1") && (n[2] = 0);
}
function is(l, n) {
    const o = new VideoEncoder({
        error: B.error,
        output: n
    });
    return o.configure({
        codec: l.codec,
        framerate: l.expectFPS,
        hardwareAcceleration: l.__unsafe_hardwareAcceleration__,
        // 码率
        bitrate: l.bitrate,
        width: l.width,
        height: l.height,
        // H264 不支持背景透明度
        alpha: "discard",
        // macos 自带播放器只支持avc
        avc: {
            format: "avc"
        }
    }), o;
}
function Lr(l, n, o) {
    const r = {
        timescale: 1e6,
        samplerate: l.sampleRate,
        channel_count: l.channelCount,
        hdlr: "soun",
        type: l.codec === "aac" ? "mp4a" : "Opus",
        name: "Track created with WebAV"
    };
    let d = -1, c = [], u = !1;
    o.once("VideoReady", ()=>{
        u = !0, c.forEach((y)=>{
            const v = hi(y);
            n.addSample(d, v.data, v);
        }), c = [];
    });
    const a = new AudioEncoder({
        error: B.error,
        output: (y, v)=>{
            var b;
            if (d === -1) {
                const T = (b = v.decoderConfig) == null ? void 0 : b.description;
                d = n.addTrack({
                    ...r,
                    description: T == null ? void 0 : Vr(T)
                }), o.emit("AudioReady"), B.info("AudioEncoder, audio track ready, trackId:", d);
            }
            if (u) {
                const T = hi(y);
                n.addSample(d, T.data, T);
            } else c.push(y);
        }
    });
    return a.configure({
        codec: l.codec === "aac" ? D.codec : "opus",
        sampleRate: l.sampleRate,
        numberOfChannels: l.channelCount,
        bitrate: 128e3
    }), a;
}
function As(l, n, o) {
    let r = 0, d = 0;
    const c = l.boxes;
    let u = !1;
    const a = ()=>{
        var s;
        if (!u) {
            if (c.find((h)=>h.type === "moof") != null) u = !0;
            else return null;
        }
        if (d >= c.length) return null;
        const t = new j.DataStream();
        t.endianness = j.DataStream.BIG_ENDIAN;
        let e = d;
        try {
            for(; e < c.length;)c[e].write(t), delete c[e], e += 1;
        } catch (h) {
            const f = c[e];
            throw h instanceof Error && f != null ? Error(`${h.message} | deltaBuf( boxType: ${f.type}, boxSize: ${f.size}, boxDataLen: ${((s = f.data) == null ? void 0 : s.length) ?? -1})`) : h;
        }
        return ur(l), d = c.length, new Uint8Array(t.buffer);
    };
    let y = !1, v = !1, b = null;
    return {
        stream: new ReadableStream({
            start (t) {
                r = self.setInterval(()=>{
                    const e = a();
                    e != null && !v && t.enqueue(e);
                }, n), b = (e)=>{
                    if (clearInterval(r), l.flush(), e != null) {
                        t.error(e);
                        return;
                    }
                    const s = a();
                    s != null && !v && t.enqueue(s), v || t.close();
                }, y && b();
            },
            cancel () {
                v = !0, clearInterval(r), o == null || o();
            }
        }),
        stop: (t)=>{
            y || (y = !0, b == null || b(t));
        }
    };
}
function kr(l) {
    let n = 0;
    const o = l.boxes, r = [];
    let d = 0;
    async function c() {
        const s = e(o, n);
        n = o.length, r.forEach(({ track: h, id: f })=>{
            const _ = h.samples.at(-1);
            _ != null && (d = Math.max(d, _.cts + _.duration)), l.releaseUsedSamples(f, h.samples.length), h.samples = [];
        }), l.mdats = [], l.moofs = [], s != null && await (b == null ? void 0 : b.write(s));
    }
    let u = [];
    function a() {
        if (u.length > 0) return !0;
        const s = o.findIndex((h)=>h.type === "moov");
        if (s === -1) return !1;
        if (u = o.slice(0, s + 1), n = s + 1, r.length === 0) for(let h = 1;; h += 1){
            const f = l.getTrackById(h);
            if (f == null) break;
            r.push({
                track: f,
                id: h
            });
        }
        return !0;
    }
    let y = 0;
    const v = oi();
    let b = null;
    const T = (async ()=>{
        b = await v.createWriter(), y = self.setInterval(()=>{
            a() && c();
        }, 100);
    })();
    let t = !1;
    return async ()=>{
        if (t) throw Error("File exported");
        if (t = !0, await T, clearInterval(y), !a() || b == null) return null;
        l.flush(), await c(), await (b == null ? void 0 : b.close());
        const s = u.find((_)=>_.type === "moov");
        if (s == null) return null;
        s.mvhd.duration = d;
        const h = oi(), f = e(u, 0);
        return await Te(h, f), await Te(h, v, {
            overwrite: !1
        }), await h.stream();
    };
    function e(s, h) {
        if (h >= s.length) return null;
        const f = new j.DataStream();
        f.endianness = j.DataStream.BIG_ENDIAN;
        for(let _ = h; _ < s.length; _++)s[_] !== null && (s[_].write(f), delete s[_]);
        return new Uint8Array(f.buffer);
    }
}
function hi(l) {
    const n = new ArrayBuffer(l.byteLength);
    l.copyTo(n);
    const o = l.timestamp;
    return {
        duration: l.duration ?? 0,
        dts: o,
        cts: o,
        is_sync: l.type === "key",
        data: n
    };
}
async function Or(l) {
    const n = j.createFile(), o = kr(n);
    await Nr(l, n);
    const r = await o();
    if (r == null) throw Error("Can not generate file from streams");
    return r;
}
async function Nr(l, n) {
    let o = 0, r = 0, d = 0, c = 0, u = 0, a = 0, y = null, v = null;
    for (const b of l)await new Promise(async (T)=>{
        mi(b.pipeThrough(new ki()), {
            onDone: T,
            onChunk: async ({ chunkType: t, data: e })=>{
                if (t === "ready") {
                    const { videoTrackConf: s, audioTrackConf: h } = Li(e.file, e.info);
                    o === 0 && s != null && (o = n.addTrack(s)), c === 0 && h != null && (c = n.addTrack(h));
                } else if (t === "samples") {
                    const { type: s, samples: h } = e, f = s === "video" ? o : c, _ = s === "video" ? r : u, g = s === "video" ? d : a;
                    h.forEach((w)=>{
                        n.addSample(f, w.data, {
                            duration: w.duration,
                            dts: w.dts + _,
                            cts: w.cts + g,
                            is_sync: w.is_sync
                        });
                    });
                    const m = h.at(-1);
                    if (m == null) return;
                    s === "video" ? y = m : s === "audio" && (v = m);
                }
            }
        });
    }), y != null && (r += y.dts, d += y.cts), v != null && (u += v.dts, a += v.cts);
}
async function mn(l) {
    return await Or([
        l
    ]);
}
function Mr(l) {
    let n = [];
    const o = new AudioDecoder({
        output: (r)=>{
            n.push(r);
        },
        error: B.error
    });
    return o.configure(l), {
        decode: async (r)=>{
            r.forEach((c)=>{
                o.decode(new EncodedAudioChunk({
                    type: c.is_sync ? "key" : "delta",
                    timestamp: 1e6 * c.cts / c.timescale,
                    duration: 1e6 * c.duration / c.timescale,
                    data: c.data
                }));
            }), await o.flush();
            const d = n;
            return n = [], d;
        },
        close: ()=>{
            o.close();
        }
    };
}
function Gr(l, n) {
    const o = new AudioEncoder({
        output: (c)=>{
            n(hi(c));
        },
        error: B.error
    });
    o.configure({
        codec: l.codec,
        sampleRate: l.sampleRate,
        numberOfChannels: l.numberOfChannels
    });
    let r = null;
    function d(c, u) {
        return new AudioData({
            timestamp: u,
            numberOfChannels: l.numberOfChannels,
            numberOfFrames: c.length / l.numberOfChannels,
            sampleRate: l.sampleRate,
            format: "f32-planar",
            data: c
        });
    }
    return {
        encode: async (c, u)=>{
            r != null && o.encode(d(r.data, r.ts)), r = {
                data: c,
                ts: u
            };
        },
        stop: async ()=>{
            r != null && (Yr(r.data, l.numberOfChannels, l.sampleRate), o.encode(d(r.data, r.ts)), r = null), await o.flush(), o.close();
        }
    };
}
function Yr(l, n, o) {
    const r = l.length - 1, d = Math.min(o / 2, r);
    for(let c = 0; c < d; c++)for(let u = 1; u <= n; u++)l[Math.floor(r / u) - c] *= c / d;
}
function yn(l, n) {
    B.info("mixinMP4AndAudio, opts:", {
        volume: n.volume,
        loop: n.loop
    });
    const o = j.createFile(), { stream: r, stop: d } = As(o, 500);
    let c = null, u = null, a = [], y = 0, v = 0, b = 0, T = !0, t = 48e3;
    mi(l.pipeThrough(new ki()), {
        onDone: async ()=>{
            await (u == null ? void 0 : u.stop()), c == null || c.close(), d();
        },
        onChunk: async ({ chunkType: f, data: _ })=>{
            if (f === "ready") {
                const { videoTrackConf: g, audioTrackConf: m, audioDecoderConf: w } = Li(_.file, _.info);
                y === 0 && g != null && (y = o.addTrack(g));
                const S = m ?? {
                    timescale: 1e6,
                    samplerate: t,
                    channel_count: D.channelCount,
                    hdlr: "soun",
                    name: "SoundHandler",
                    type: "mp4a"
                };
                v === 0 && (v = o.addTrack(S), t = (m == null ? void 0 : m.samplerate) ?? t, T = m != null);
                const E = new AudioContext({
                    sampleRate: t
                });
                a = Di(await E.decodeAudioData(await new Response(n.stream).arrayBuffer())), w != null && (c = Mr(w)), u = Gr(w ?? {
                    codec: S.type === "mp4a" ? D.codec : S.type,
                    numberOfChannels: S.channel_count,
                    sampleRate: S.samplerate
                }, (I)=>o.addSample(v, I.data, I));
            } else if (f === "samples") {
                const { id: g, type: m, samples: w } = _;
                if (m === "video") {
                    w.forEach((S)=>o.addSample(g, S.data, S)), T || await s(w);
                    return;
                }
                m === "audio" && await h(w);
            }
        }
    });
    function e(f) {
        const _ = a.map((g)=>n.loop ? Ii(g, b, b + f) : g.slice(b, b + f));
        if (b += f, n.volume !== 1) for (const g of _)for(let m = 0; m < g.length; m++)g[m] *= n.volume;
        return _;
    }
    async function s(f) {
        const _ = f[0], g = f[f.length - 1], m = Math.floor((g.cts + g.duration - _.cts) / g.timescale * t), w = Ai([
            e(m)
        ]);
        w.length !== 0 && (u == null || u.encode(w, _.cts / _.timescale * 1e6));
    }
    async function h(f) {
        if (c == null) return;
        const _ = (await c.decode(f)).map(Ri), g = ys(_), m = e(g[0].length), w = f[0];
        u == null || u.encode(// 2. 混合输入的音频
        Ai([
            g,
            m
        ]), w.cts / w.timescale * 1e6);
    }
    return r;
}
function Vr(l) {
    const n = l.byteLength, o = new Uint8Array([
        0,
        // version 0
        0,
        0,
        0,
        // flags
        3,
        // descriptor_type
        23 + n,
        // length
        0,
        // 0x01, // es_id
        2,
        // es_id
        0,
        // stream_priority
        4,
        // descriptor_type
        18 + n,
        // length
        64,
        // codec : mpeg4_audio
        21,
        // stream_type
        0,
        0,
        0,
        // buffer_size
        0,
        0,
        0,
        0,
        // maxBitrate
        0,
        0,
        0,
        0,
        // avgBitrate
        5,
        // descriptor_type
        n,
        ...new Uint8Array(l instanceof ArrayBuffer ? l : l.buffer),
        6,
        1,
        2
    ]), r = new j.BoxParser.esdsBox(o.byteLength);
    return r.hdr_size = 0, r.parse(new j.DataStream(o, 0, j.DataStream.BIG_ENDIAN)), r;
}
var Ni = /* @__PURE__ */ function() {
    function l() {
        this.listeners = {};
    }
    var n = l.prototype;
    return n.on = function(r, d) {
        this.listeners[r] || (this.listeners[r] = []), this.listeners[r].push(d);
    }, n.off = function(r, d) {
        if (!this.listeners[r]) return !1;
        var c = this.listeners[r].indexOf(d);
        return this.listeners[r] = this.listeners[r].slice(0), this.listeners[r].splice(c, 1), c > -1;
    }, n.trigger = function(r) {
        var d = this.listeners[r];
        if (d) {
            if (arguments.length === 2) for(var c = d.length, u = 0; u < c; ++u)d[u].call(this, arguments[1]);
            else for(var a = Array.prototype.slice.call(arguments, 1), y = d.length, v = 0; v < y; ++v)d[v].apply(this, a);
        }
    }, n.dispose = function() {
        this.listeners = {};
    }, n.pipe = function(r) {
        this.on("data", function(d) {
            r.push(d);
        });
    }, l;
}();
function oe() {
    return oe = Object.assign ? Object.assign.bind() : function(l) {
        for(var n = 1; n < arguments.length; n++){
            var o = arguments[n];
            for(var r in o)({}).hasOwnProperty.call(o, r) && (l[r] = o[r]);
        }
        return l;
    }, oe.apply(null, arguments);
}
var Ue;
typeof window < "u" ? Ue = window : typeof Zi < "u" ? Ue = Zi : typeof self < "u" ? Ue = self : Ue = {};
var Hr = Ue;
const ss = /* @__PURE__ */ bs(Hr);
var Xr = function(n) {
    return ss.atob ? ss.atob(n) : Buffer.from(n, "base64").toString("binary");
};
function Wr(l) {
    for(var n = Xr(l), o = new Uint8Array(n.length), r = 0; r < n.length; r++)o[r] = n.charCodeAt(r);
    return o;
}
/*! @name m3u8-parser @version 7.1.0 @license Apache-2.0 */ class Zr extends Ni {
    constructor(){
        super(), this.buffer = "";
    }
    /**
   * Add new data to be parsed.
   *
   * @param {string} data the text to process
   */ push(n) {
        let o;
        for(this.buffer += n, o = this.buffer.indexOf(`
`); o > -1; o = this.buffer.indexOf(`
`))this.trigger("data", this.buffer.substring(0, o)), this.buffer = this.buffer.substring(o + 1);
    }
}
const jr = "	", Si = function(l) {
    const n = /([0-9.]*)?@?([0-9.]*)?/.exec(l || ""), o = {};
    return n[1] && (o.length = parseInt(n[1], 10)), n[2] && (o.offset = parseInt(n[2], 10)), o;
}, Kr = function() {
    const o = '(?:[^=]*)=(?:"[^"]*"|[^,]*)';
    return new RegExp("(?:^|,)(" + o + ")");
}, X = function(l) {
    const n = {};
    if (!l) return n;
    const o = l.split(Kr());
    let r = o.length, d;
    for(; r--;)o[r] !== "" && (d = /([^=]*)=(.*)/.exec(o[r]).slice(1), d[0] = d[0].replace(/^\s+|\s+$/g, ""), d[1] = d[1].replace(/^\s+|\s+$/g, ""), d[1] = d[1].replace(/^['"](.*)['"]$/g, "$1"), n[d[0]] = d[1]);
    return n;
};
class $r extends Ni {
    constructor(){
        super(), this.customParsers = [], this.tagMappers = [];
    }
    /**
   * Parses an additional line of input.
   *
   * @param {string} line a single line of an M3U8 file to parse
   */ push(n) {
        let o, r;
        if (n = n.trim(), n.length === 0) return;
        if (n[0] !== "#") {
            this.trigger("data", {
                type: "uri",
                uri: n
            });
            return;
        }
        this.tagMappers.reduce((c, u)=>{
            const a = u(n);
            return a === n ? c : c.concat([
                a
            ]);
        }, [
            n
        ]).forEach((c)=>{
            for(let u = 0; u < this.customParsers.length; u++)if (this.customParsers[u].call(this, c)) return;
            if (c.indexOf("#EXT") !== 0) {
                this.trigger("data", {
                    type: "comment",
                    text: c.slice(1)
                });
                return;
            }
            if (c = c.replace("\r", ""), o = /^#EXTM3U/.exec(c), o) {
                this.trigger("data", {
                    type: "tag",
                    tagType: "m3u"
                });
                return;
            }
            if (o = /^#EXTINF:([0-9\.]*)?,?(.*)?$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "inf"
                }, o[1] && (r.duration = parseFloat(o[1])), o[2] && (r.title = o[2]), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-TARGETDURATION:([0-9.]*)?/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "targetduration"
                }, o[1] && (r.duration = parseInt(o[1], 10)), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-VERSION:([0-9.]*)?/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "version"
                }, o[1] && (r.version = parseInt(o[1], 10)), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-MEDIA-SEQUENCE:(\-?[0-9.]*)?/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "media-sequence"
                }, o[1] && (r.number = parseInt(o[1], 10)), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-DISCONTINUITY-SEQUENCE:(\-?[0-9.]*)?/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "discontinuity-sequence"
                }, o[1] && (r.number = parseInt(o[1], 10)), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-PLAYLIST-TYPE:(.*)?$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "playlist-type"
                }, o[1] && (r.playlistType = o[1]), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-BYTERANGE:(.*)?$/.exec(c), o) {
                r = oe(Si(o[1]), {
                    type: "tag",
                    tagType: "byterange"
                }), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-ALLOW-CACHE:(YES|NO)?/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "allow-cache"
                }, o[1] && (r.allowed = !/NO/.test(o[1])), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-MAP:(.*)$/.exec(c), o) {
                if (r = {
                    type: "tag",
                    tagType: "map"
                }, o[1]) {
                    const u = X(o[1]);
                    u.URI && (r.uri = u.URI), u.BYTERANGE && (r.byterange = Si(u.BYTERANGE));
                }
                this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-STREAM-INF:(.*)$/.exec(c), o) {
                if (r = {
                    type: "tag",
                    tagType: "stream-inf"
                }, o[1]) {
                    if (r.attributes = X(o[1]), r.attributes.RESOLUTION) {
                        const u = r.attributes.RESOLUTION.split("x"), a = {};
                        u[0] && (a.width = parseInt(u[0], 10)), u[1] && (a.height = parseInt(u[1], 10)), r.attributes.RESOLUTION = a;
                    }
                    r.attributes.BANDWIDTH && (r.attributes.BANDWIDTH = parseInt(r.attributes.BANDWIDTH, 10)), r.attributes["FRAME-RATE"] && (r.attributes["FRAME-RATE"] = parseFloat(r.attributes["FRAME-RATE"])), r.attributes["PROGRAM-ID"] && (r.attributes["PROGRAM-ID"] = parseInt(r.attributes["PROGRAM-ID"], 10));
                }
                this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-MEDIA:(.*)$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "media"
                }, o[1] && (r.attributes = X(o[1])), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-ENDLIST/.exec(c), o) {
                this.trigger("data", {
                    type: "tag",
                    tagType: "endlist"
                });
                return;
            }
            if (o = /^#EXT-X-DISCONTINUITY/.exec(c), o) {
                this.trigger("data", {
                    type: "tag",
                    tagType: "discontinuity"
                });
                return;
            }
            if (o = /^#EXT-X-PROGRAM-DATE-TIME:(.*)$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "program-date-time"
                }, o[1] && (r.dateTimeString = o[1], r.dateTimeObject = new Date(o[1])), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-KEY:(.*)$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "key"
                }, o[1] && (r.attributes = X(o[1]), r.attributes.IV && (r.attributes.IV.substring(0, 2).toLowerCase() === "0x" && (r.attributes.IV = r.attributes.IV.substring(2)), r.attributes.IV = r.attributes.IV.match(/.{8}/g), r.attributes.IV[0] = parseInt(r.attributes.IV[0], 16), r.attributes.IV[1] = parseInt(r.attributes.IV[1], 16), r.attributes.IV[2] = parseInt(r.attributes.IV[2], 16), r.attributes.IV[3] = parseInt(r.attributes.IV[3], 16), r.attributes.IV = new Uint32Array(r.attributes.IV))), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-START:(.*)$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "start"
                }, o[1] && (r.attributes = X(o[1]), r.attributes["TIME-OFFSET"] = parseFloat(r.attributes["TIME-OFFSET"]), r.attributes.PRECISE = /YES/.test(r.attributes.PRECISE)), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-CUE-OUT-CONT:(.*)?$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "cue-out-cont"
                }, o[1] ? r.data = o[1] : r.data = "", this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-CUE-OUT:(.*)?$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "cue-out"
                }, o[1] ? r.data = o[1] : r.data = "", this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-CUE-IN:(.*)?$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "cue-in"
                }, o[1] ? r.data = o[1] : r.data = "", this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-SKIP:(.*)$/.exec(c), o && o[1]) {
                r = {
                    type: "tag",
                    tagType: "skip"
                }, r.attributes = X(o[1]), r.attributes.hasOwnProperty("SKIPPED-SEGMENTS") && (r.attributes["SKIPPED-SEGMENTS"] = parseInt(r.attributes["SKIPPED-SEGMENTS"], 10)), r.attributes.hasOwnProperty("RECENTLY-REMOVED-DATERANGES") && (r.attributes["RECENTLY-REMOVED-DATERANGES"] = r.attributes["RECENTLY-REMOVED-DATERANGES"].split(jr)), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-PART:(.*)$/.exec(c), o && o[1]) {
                r = {
                    type: "tag",
                    tagType: "part"
                }, r.attributes = X(o[1]), [
                    "DURATION"
                ].forEach(function(u) {
                    r.attributes.hasOwnProperty(u) && (r.attributes[u] = parseFloat(r.attributes[u]));
                }), [
                    "INDEPENDENT",
                    "GAP"
                ].forEach(function(u) {
                    r.attributes.hasOwnProperty(u) && (r.attributes[u] = /YES/.test(r.attributes[u]));
                }), r.attributes.hasOwnProperty("BYTERANGE") && (r.attributes.byterange = Si(r.attributes.BYTERANGE)), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-SERVER-CONTROL:(.*)$/.exec(c), o && o[1]) {
                r = {
                    type: "tag",
                    tagType: "server-control"
                }, r.attributes = X(o[1]), [
                    "CAN-SKIP-UNTIL",
                    "PART-HOLD-BACK",
                    "HOLD-BACK"
                ].forEach(function(u) {
                    r.attributes.hasOwnProperty(u) && (r.attributes[u] = parseFloat(r.attributes[u]));
                }), [
                    "CAN-SKIP-DATERANGES",
                    "CAN-BLOCK-RELOAD"
                ].forEach(function(u) {
                    r.attributes.hasOwnProperty(u) && (r.attributes[u] = /YES/.test(r.attributes[u]));
                }), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-PART-INF:(.*)$/.exec(c), o && o[1]) {
                r = {
                    type: "tag",
                    tagType: "part-inf"
                }, r.attributes = X(o[1]), [
                    "PART-TARGET"
                ].forEach(function(u) {
                    r.attributes.hasOwnProperty(u) && (r.attributes[u] = parseFloat(r.attributes[u]));
                }), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-PRELOAD-HINT:(.*)$/.exec(c), o && o[1]) {
                r = {
                    type: "tag",
                    tagType: "preload-hint"
                }, r.attributes = X(o[1]), [
                    "BYTERANGE-START",
                    "BYTERANGE-LENGTH"
                ].forEach(function(u) {
                    if (r.attributes.hasOwnProperty(u)) {
                        r.attributes[u] = parseInt(r.attributes[u], 10);
                        const a = u === "BYTERANGE-LENGTH" ? "length" : "offset";
                        r.attributes.byterange = r.attributes.byterange || {}, r.attributes.byterange[a] = r.attributes[u], delete r.attributes[u];
                    }
                }), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-RENDITION-REPORT:(.*)$/.exec(c), o && o[1]) {
                r = {
                    type: "tag",
                    tagType: "rendition-report"
                }, r.attributes = X(o[1]), [
                    "LAST-MSN",
                    "LAST-PART"
                ].forEach(function(u) {
                    r.attributes.hasOwnProperty(u) && (r.attributes[u] = parseInt(r.attributes[u], 10));
                }), this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-DATERANGE:(.*)$/.exec(c), o && o[1]) {
                r = {
                    type: "tag",
                    tagType: "daterange"
                }, r.attributes = X(o[1]), [
                    "ID",
                    "CLASS"
                ].forEach(function(a) {
                    r.attributes.hasOwnProperty(a) && (r.attributes[a] = String(r.attributes[a]));
                }), [
                    "START-DATE",
                    "END-DATE"
                ].forEach(function(a) {
                    r.attributes.hasOwnProperty(a) && (r.attributes[a] = new Date(r.attributes[a]));
                }), [
                    "DURATION",
                    "PLANNED-DURATION"
                ].forEach(function(a) {
                    r.attributes.hasOwnProperty(a) && (r.attributes[a] = parseFloat(r.attributes[a]));
                }), [
                    "END-ON-NEXT"
                ].forEach(function(a) {
                    r.attributes.hasOwnProperty(a) && (r.attributes[a] = /YES/i.test(r.attributes[a]));
                }), [
                    "SCTE35-CMD",
                    " SCTE35-OUT",
                    "SCTE35-IN"
                ].forEach(function(a) {
                    r.attributes.hasOwnProperty(a) && (r.attributes[a] = r.attributes[a].toString(16));
                });
                const u = /^X-([A-Z]+-)+[A-Z]+$/;
                for(const a in r.attributes){
                    if (!u.test(a)) continue;
                    const y = /[0-9A-Fa-f]{6}/g.test(r.attributes[a]), v = /^\d+(\.\d+)?$/.test(r.attributes[a]);
                    r.attributes[a] = y ? r.attributes[a].toString(16) : v ? parseFloat(r.attributes[a]) : String(r.attributes[a]);
                }
                this.trigger("data", r);
                return;
            }
            if (o = /^#EXT-X-INDEPENDENT-SEGMENTS/.exec(c), o) {
                this.trigger("data", {
                    type: "tag",
                    tagType: "independent-segments"
                });
                return;
            }
            if (o = /^#EXT-X-CONTENT-STEERING:(.*)$/.exec(c), o) {
                r = {
                    type: "tag",
                    tagType: "content-steering"
                }, r.attributes = X(o[1]), this.trigger("data", r);
                return;
            }
            this.trigger("data", {
                type: "tag",
                data: c.slice(4)
            });
        });
    }
    /**
   * Add a parser for custom headers
   *
   * @param {Object}   options              a map of options for the added parser
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {string}   options.customType   the custom type to register to the output
   * @param {Function} [options.dataParser] function to parse the line into an object
   * @param {boolean}  [options.segment]    should tag data be attached to the segment object
   */ addParser({ expression: n, customType: o, dataParser: r, segment: d }) {
        typeof r != "function" && (r = (c)=>c), this.customParsers.push((c)=>{
            if (n.exec(c)) return this.trigger("data", {
                type: "custom",
                data: r(c),
                customType: o,
                segment: d
            }), !0;
        });
    }
    /**
   * Add a custom header mapper
   *
   * @param {Object}   options
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {Function} options.map          function to translate tag into a different tag
   */ addTagMapper({ expression: n, map: o }) {
        const r = (d)=>n.test(d) ? o(d) : d;
        this.tagMappers.push(r);
    }
}
const qr = (l)=>l.toLowerCase().replace(/-(\w)/g, (n)=>n[1].toUpperCase()), Ut = function(l) {
    const n = {};
    return Object.keys(l).forEach(function(o) {
        n[qr(o)] = l[o];
    }), n;
}, xi = function(l) {
    const { serverControl: n, targetDuration: o, partTargetDuration: r } = l;
    if (!n) return;
    const d = "#EXT-X-SERVER-CONTROL", c = "holdBack", u = "partHoldBack", a = o && o * 3, y = r && r * 2;
    o && !n.hasOwnProperty(c) && (n[c] = a, this.trigger("info", {
        message: `${d} defaulting HOLD-BACK to targetDuration * 3 (${a}).`
    })), a && n[c] < a && (this.trigger("warn", {
        message: `${d} clamping HOLD-BACK (${n[c]}) to targetDuration * 3 (${a})`
    }), n[c] = a), r && !n.hasOwnProperty(u) && (n[u] = r * 3, this.trigger("info", {
        message: `${d} defaulting PART-HOLD-BACK to partTargetDuration * 3 (${n[u]}).`
    })), r && n[u] < y && (this.trigger("warn", {
        message: `${d} clamping PART-HOLD-BACK (${n[u]}) to partTargetDuration * 2 (${y}).`
    }), n[u] = y);
};
class Qr extends Ni {
    constructor(){
        super(), this.lineStream = new Zr(), this.parseStream = new $r(), this.lineStream.pipe(this.parseStream), this.lastProgramDateTime = null;
        const n = this, o = [];
        let r = {}, d, c, u = !1;
        const a = function() {}, y = {
            AUDIO: {},
            VIDEO: {},
            "CLOSED-CAPTIONS": {},
            SUBTITLES: {}
        }, v = "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed";
        let b = 0;
        this.manifest = {
            allowCache: !0,
            discontinuityStarts: [],
            dateRanges: [],
            segments: []
        };
        let T = 0, t = 0;
        const e = {};
        this.on("end", ()=>{
            r.uri || !r.parts && !r.preloadHints || (!r.map && d && (r.map = d), !r.key && c && (r.key = c), !r.timeline && typeof b == "number" && (r.timeline = b), this.manifest.preloadSegment = r);
        }), this.parseStream.on("data", function(s) {
            let h, f;
            ({
                tag () {
                    (({
                        version () {
                            s.version && (this.manifest.version = s.version);
                        },
                        "allow-cache" () {
                            this.manifest.allowCache = s.allowed, "allowed" in s || (this.trigger("info", {
                                message: "defaulting allowCache to YES"
                            }), this.manifest.allowCache = !0);
                        },
                        byterange () {
                            const _ = {};
                            "length" in s && (r.byterange = _, _.length = s.length, "offset" in s || (s.offset = T)), "offset" in s && (r.byterange = _, _.offset = s.offset), T = _.offset + _.length;
                        },
                        endlist () {
                            this.manifest.endList = !0;
                        },
                        inf () {
                            "mediaSequence" in this.manifest || (this.manifest.mediaSequence = 0, this.trigger("info", {
                                message: "defaulting media sequence to zero"
                            })), "discontinuitySequence" in this.manifest || (this.manifest.discontinuitySequence = 0, this.trigger("info", {
                                message: "defaulting discontinuity sequence to zero"
                            })), s.title && (r.title = s.title), s.duration > 0 && (r.duration = s.duration), s.duration === 0 && (r.duration = 0.01, this.trigger("info", {
                                message: "updating zero segment duration to a small value"
                            })), this.manifest.segments = o;
                        },
                        key () {
                            if (!s.attributes) {
                                this.trigger("warn", {
                                    message: "ignoring key declaration without attribute list"
                                });
                                return;
                            }
                            if (s.attributes.METHOD === "NONE") {
                                c = null;
                                return;
                            }
                            if (!s.attributes.URI) {
                                this.trigger("warn", {
                                    message: "ignoring key declaration without URI"
                                });
                                return;
                            }
                            if (s.attributes.KEYFORMAT === "com.apple.streamingkeydelivery") {
                                this.manifest.contentProtection = this.manifest.contentProtection || {}, this.manifest.contentProtection["com.apple.fps.1_0"] = {
                                    attributes: s.attributes
                                };
                                return;
                            }
                            if (s.attributes.KEYFORMAT === "com.microsoft.playready") {
                                this.manifest.contentProtection = this.manifest.contentProtection || {}, this.manifest.contentProtection["com.microsoft.playready"] = {
                                    uri: s.attributes.URI
                                };
                                return;
                            }
                            if (s.attributes.KEYFORMAT === v) {
                                if ([
                                    "SAMPLE-AES",
                                    "SAMPLE-AES-CTR",
                                    "SAMPLE-AES-CENC"
                                ].indexOf(s.attributes.METHOD) === -1) {
                                    this.trigger("warn", {
                                        message: "invalid key method provided for Widevine"
                                    });
                                    return;
                                }
                                if (s.attributes.METHOD === "SAMPLE-AES-CENC" && this.trigger("warn", {
                                    message: "SAMPLE-AES-CENC is deprecated, please use SAMPLE-AES-CTR instead"
                                }), s.attributes.URI.substring(0, 23) !== "data:text/plain;base64,") {
                                    this.trigger("warn", {
                                        message: "invalid key URI provided for Widevine"
                                    });
                                    return;
                                }
                                if (!(s.attributes.KEYID && s.attributes.KEYID.substring(0, 2) === "0x")) {
                                    this.trigger("warn", {
                                        message: "invalid key ID provided for Widevine"
                                    });
                                    return;
                                }
                                this.manifest.contentProtection = this.manifest.contentProtection || {}, this.manifest.contentProtection["com.widevine.alpha"] = {
                                    attributes: {
                                        schemeIdUri: s.attributes.KEYFORMAT,
                                        // remove '0x' from the key id string
                                        keyId: s.attributes.KEYID.substring(2)
                                    },
                                    // decode the base64-encoded PSSH box
                                    pssh: Wr(s.attributes.URI.split(",")[1])
                                };
                                return;
                            }
                            s.attributes.METHOD || this.trigger("warn", {
                                message: "defaulting key method to AES-128"
                            }), c = {
                                method: s.attributes.METHOD || "AES-128",
                                uri: s.attributes.URI
                            }, typeof s.attributes.IV < "u" && (c.iv = s.attributes.IV);
                        },
                        "media-sequence" () {
                            if (!isFinite(s.number)) {
                                this.trigger("warn", {
                                    message: "ignoring invalid media sequence: " + s.number
                                });
                                return;
                            }
                            this.manifest.mediaSequence = s.number;
                        },
                        "discontinuity-sequence" () {
                            if (!isFinite(s.number)) {
                                this.trigger("warn", {
                                    message: "ignoring invalid discontinuity sequence: " + s.number
                                });
                                return;
                            }
                            this.manifest.discontinuitySequence = s.number, b = s.number;
                        },
                        "playlist-type" () {
                            if (!/VOD|EVENT/.test(s.playlistType)) {
                                this.trigger("warn", {
                                    message: "ignoring unknown playlist type: " + s.playlist
                                });
                                return;
                            }
                            this.manifest.playlistType = s.playlistType;
                        },
                        map () {
                            d = {}, s.uri && (d.uri = s.uri), s.byterange && (d.byterange = s.byterange), c && (d.key = c);
                        },
                        "stream-inf" () {
                            if (this.manifest.playlists = o, this.manifest.mediaGroups = this.manifest.mediaGroups || y, !s.attributes) {
                                this.trigger("warn", {
                                    message: "ignoring empty stream-inf attributes"
                                });
                                return;
                            }
                            r.attributes || (r.attributes = {}), oe(r.attributes, s.attributes);
                        },
                        media () {
                            if (this.manifest.mediaGroups = this.manifest.mediaGroups || y, !(s.attributes && s.attributes.TYPE && s.attributes["GROUP-ID"] && s.attributes.NAME)) {
                                this.trigger("warn", {
                                    message: "ignoring incomplete or missing media group"
                                });
                                return;
                            }
                            const _ = this.manifest.mediaGroups[s.attributes.TYPE];
                            _[s.attributes["GROUP-ID"]] = _[s.attributes["GROUP-ID"]] || {}, h = _[s.attributes["GROUP-ID"]], f = {
                                default: /yes/i.test(s.attributes.DEFAULT)
                            }, f.default ? f.autoselect = !0 : f.autoselect = /yes/i.test(s.attributes.AUTOSELECT), s.attributes.LANGUAGE && (f.language = s.attributes.LANGUAGE), s.attributes.URI && (f.uri = s.attributes.URI), s.attributes["INSTREAM-ID"] && (f.instreamId = s.attributes["INSTREAM-ID"]), s.attributes.CHARACTERISTICS && (f.characteristics = s.attributes.CHARACTERISTICS), s.attributes.FORCED && (f.forced = /yes/i.test(s.attributes.FORCED)), h[s.attributes.NAME] = f;
                        },
                        discontinuity () {
                            b += 1, r.discontinuity = !0, this.manifest.discontinuityStarts.push(o.length);
                        },
                        "program-date-time" () {
                            typeof this.manifest.dateTimeString > "u" && (this.manifest.dateTimeString = s.dateTimeString, this.manifest.dateTimeObject = s.dateTimeObject), r.dateTimeString = s.dateTimeString, r.dateTimeObject = s.dateTimeObject;
                            const { lastProgramDateTime: _ } = this;
                            this.lastProgramDateTime = new Date(s.dateTimeString).getTime(), _ === null && this.manifest.segments.reduceRight((g, m)=>(m.programDateTime = g - m.duration * 1e3, m.programDateTime), this.lastProgramDateTime);
                        },
                        targetduration () {
                            if (!isFinite(s.duration) || s.duration < 0) {
                                this.trigger("warn", {
                                    message: "ignoring invalid target duration: " + s.duration
                                });
                                return;
                            }
                            this.manifest.targetDuration = s.duration, xi.call(this, this.manifest);
                        },
                        start () {
                            if (!s.attributes || isNaN(s.attributes["TIME-OFFSET"])) {
                                this.trigger("warn", {
                                    message: "ignoring start declaration without appropriate attribute list"
                                });
                                return;
                            }
                            this.manifest.start = {
                                timeOffset: s.attributes["TIME-OFFSET"],
                                precise: s.attributes.PRECISE
                            };
                        },
                        "cue-out" () {
                            r.cueOut = s.data;
                        },
                        "cue-out-cont" () {
                            r.cueOutCont = s.data;
                        },
                        "cue-in" () {
                            r.cueIn = s.data;
                        },
                        skip () {
                            this.manifest.skip = Ut(s.attributes), this.warnOnMissingAttributes_("#EXT-X-SKIP", s.attributes, [
                                "SKIPPED-SEGMENTS"
                            ]);
                        },
                        part () {
                            u = !0;
                            const _ = this.manifest.segments.length, g = Ut(s.attributes);
                            r.parts = r.parts || [], r.parts.push(g), g.byterange && (g.byterange.hasOwnProperty("offset") || (g.byterange.offset = t), t = g.byterange.offset + g.byterange.length);
                            const m = r.parts.length - 1;
                            this.warnOnMissingAttributes_(`#EXT-X-PART #${m} for segment #${_}`, s.attributes, [
                                "URI",
                                "DURATION"
                            ]), this.manifest.renditionReports && this.manifest.renditionReports.forEach((w, S)=>{
                                w.hasOwnProperty("lastPart") || this.trigger("warn", {
                                    message: `#EXT-X-RENDITION-REPORT #${S} lacks required attribute(s): LAST-PART`
                                });
                            });
                        },
                        "server-control" () {
                            const _ = this.manifest.serverControl = Ut(s.attributes);
                            _.hasOwnProperty("canBlockReload") || (_.canBlockReload = !1, this.trigger("info", {
                                message: "#EXT-X-SERVER-CONTROL defaulting CAN-BLOCK-RELOAD to false"
                            })), xi.call(this, this.manifest), _.canSkipDateranges && !_.hasOwnProperty("canSkipUntil") && this.trigger("warn", {
                                message: "#EXT-X-SERVER-CONTROL lacks required attribute CAN-SKIP-UNTIL which is required when CAN-SKIP-DATERANGES is set"
                            });
                        },
                        "preload-hint" () {
                            const _ = this.manifest.segments.length, g = Ut(s.attributes), m = g.type && g.type === "PART";
                            r.preloadHints = r.preloadHints || [], r.preloadHints.push(g), g.byterange && (g.byterange.hasOwnProperty("offset") || (g.byterange.offset = m ? t : 0, m && (t = g.byterange.offset + g.byterange.length)));
                            const w = r.preloadHints.length - 1;
                            if (this.warnOnMissingAttributes_(`#EXT-X-PRELOAD-HINT #${w} for segment #${_}`, s.attributes, [
                                "TYPE",
                                "URI"
                            ]), !!g.type) for(let S = 0; S < r.preloadHints.length - 1; S++){
                                const E = r.preloadHints[S];
                                E.type && E.type === g.type && this.trigger("warn", {
                                    message: `#EXT-X-PRELOAD-HINT #${w} for segment #${_} has the same TYPE ${g.type} as preload hint #${S}`
                                });
                            }
                        },
                        "rendition-report" () {
                            const _ = Ut(s.attributes);
                            this.manifest.renditionReports = this.manifest.renditionReports || [], this.manifest.renditionReports.push(_);
                            const g = this.manifest.renditionReports.length - 1, m = [
                                "LAST-MSN",
                                "URI"
                            ];
                            u && m.push("LAST-PART"), this.warnOnMissingAttributes_(`#EXT-X-RENDITION-REPORT #${g}`, s.attributes, m);
                        },
                        "part-inf" () {
                            this.manifest.partInf = Ut(s.attributes), this.warnOnMissingAttributes_("#EXT-X-PART-INF", s.attributes, [
                                "PART-TARGET"
                            ]), this.manifest.partInf.partTarget && (this.manifest.partTargetDuration = this.manifest.partInf.partTarget), xi.call(this, this.manifest);
                        },
                        daterange () {
                            this.manifest.dateRanges.push(Ut(s.attributes));
                            const _ = this.manifest.dateRanges.length - 1;
                            this.warnOnMissingAttributes_(`#EXT-X-DATERANGE #${_}`, s.attributes, [
                                "ID",
                                "START-DATE"
                            ]);
                            const g = this.manifest.dateRanges[_];
                            g.endDate && g.startDate && new Date(g.endDate) < new Date(g.startDate) && this.trigger("warn", {
                                message: "EXT-X-DATERANGE END-DATE must be equal to or later than the value of the START-DATE"
                            }), g.duration && g.duration < 0 && this.trigger("warn", {
                                message: "EXT-X-DATERANGE DURATION must not be negative"
                            }), g.plannedDuration && g.plannedDuration < 0 && this.trigger("warn", {
                                message: "EXT-X-DATERANGE PLANNED-DURATION must not be negative"
                            });
                            const m = !!g.endOnNext;
                            if (m && !g.class && this.trigger("warn", {
                                message: "EXT-X-DATERANGE with an END-ON-NEXT=YES attribute must have a CLASS attribute"
                            }), m && (g.duration || g.endDate) && this.trigger("warn", {
                                message: "EXT-X-DATERANGE with an END-ON-NEXT=YES attribute must not contain DURATION or END-DATE attributes"
                            }), g.duration && g.endDate) {
                                const S = g.startDate.getTime() + g.duration * 1e3;
                                this.manifest.dateRanges[_].endDate = new Date(S);
                            }
                            if (!e[g.id]) e[g.id] = g;
                            else {
                                for(const S in e[g.id])if (g[S] && JSON.stringify(e[g.id][S]) !== JSON.stringify(g[S])) {
                                    this.trigger("warn", {
                                        message: "EXT-X-DATERANGE tags with the same ID in a playlist must have the same attributes values"
                                    });
                                    break;
                                }
                                const w = this.manifest.dateRanges.findIndex((S)=>S.id === g.id);
                                this.manifest.dateRanges[w] = oe(this.manifest.dateRanges[w], g), e[g.id] = oe(e[g.id], g), this.manifest.dateRanges.pop();
                            }
                        },
                        "independent-segments" () {
                            this.manifest.independentSegments = !0;
                        },
                        "content-steering" () {
                            this.manifest.contentSteering = Ut(s.attributes), this.warnOnMissingAttributes_("#EXT-X-CONTENT-STEERING", s.attributes, [
                                "SERVER-URI"
                            ]);
                        }
                    })[s.tagType] || a).call(n);
                },
                uri () {
                    r.uri = s.uri, o.push(r), this.manifest.targetDuration && !("duration" in r) && (this.trigger("warn", {
                        message: "defaulting segment duration to the target duration"
                    }), r.duration = this.manifest.targetDuration), c && (r.key = c), r.timeline = b, d && (r.map = d), t = 0, this.lastProgramDateTime !== null && (r.programDateTime = this.lastProgramDateTime, this.lastProgramDateTime += r.duration * 1e3), r = {};
                },
                comment () {},
                custom () {
                    s.segment ? (r.custom = r.custom || {}, r.custom[s.customType] = s.data) : (this.manifest.custom = this.manifest.custom || {}, this.manifest.custom[s.customType] = s.data);
                }
            })[s.type].call(n);
        });
    }
    warnOnMissingAttributes_(n, o, r) {
        const d = [];
        r.forEach(function(c) {
            o.hasOwnProperty(c) || d.push(c);
        }), d.length && this.trigger("warn", {
            message: `${n} lacks required attribute(s): ${d.join(", ")}`
        });
    }
    /**
   * Parse the input string and update the manifest object.
   *
   * @param {string} chunk a potentially incomplete portion of the manifest
   */ push(n) {
        this.lineStream.push(n);
    }
    /**
   * Flush any remaining input. This can be handy if the last line of an M3U8
   * manifest did not contain a trailing newline but the file has been
   * completely received.
   */ end() {
        this.lineStream.push(`
`), this.manifest.dateRanges.length && this.lastProgramDateTime === null && this.trigger("warn", {
            message: "A playlist with EXT-X-DATERANGE tag must contain atleast one EXT-X-PROGRAM-DATE-TIME tag"
        }), this.lastProgramDateTime = null, this.trigger("end");
    }
    /**
   * Add an additional parser for non-standard tags
   *
   * @param {Object}   options              a map of options for the added parser
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {string}   options.customType   the custom type to register to the output
   * @param {Function} [options.dataParser] function to parse the line into an object
   * @param {boolean}  [options.segment]    should tag data be attached to the segment object
   */ addParser(n) {
        this.parseStream.addParser(n);
    }
    /**
   * Add a custom header mapper
   *
   * @param {Object}   options
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {Function} options.map          function to translate tag into a different tag
   */ addTagMapper(n) {
        this.parseStream.addTagMapper(n);
    }
}
async function bn(l, n = 10) {
    const o = new Qr();
    o.push(await (await fetch(l)).text()), o.end();
    const r = o.manifest.segments.reduce((y, v)=>(y[v.map.uri] = y[v.map.uri] ?? [], y[v.map.uri].push(v), y), {}), d = new URL(l, location.href), c = {};
    async function u(y, v, b) {
        function T(s) {
            let h = 0, f = 0, _ = [];
            async function g(w) {
                _.push(w), m();
            }
            async function m() {
                if (h < s && _.length) {
                    const w = _.shift();
                    h++;
                    try {
                        await (w == null ? void 0 : w()), f++, b.emit("progress", Math.round(f / y.length * 100) / 100), m();
                    } catch (S) {
                        _ = [], v.error(S), b.destroy(), B.error(S);
                    }
                    h--;
                }
            }
            return g;
        }
        async function t(s) {
            return (await fetch(s)).arrayBuffer();
        }
        const e = T(n);
        for (const [, s] of y.entries()){
            const h = new URL(s.uri, d).href;
            e(()=>c[h] = t(h));
        }
    }
    async function a(y) {
        const v = await c[y];
        return delete c[y], v;
    }
    return {
        /**
     * 下载期望时间区间的分配数据，封装成流
     * 每个分片包含一个时间段，实际下载的分片数据时长会略大于期望的时间区间
     */ load (y = 0, v = 1 / 0) {
            const b = {};
            let T = 0, t = 0;
            for (const [e, s] of Object.entries(r)){
                let h = 0, f = [], _ = -1, g = -1;
                for(let m = 0; m < s.length; m++){
                    const w = s[m];
                    if (h += w.duration, _ === -1 && h > y / 1e6 && (_ = m, T = (h - w.duration) * 1e6), _ > -1 && g === -1 && h >= v / 1e6) {
                        g = m + 1, t = h * 1e6;
                        break;
                    }
                }
                v >= h * 1e6 && (g = s.length, t = h * 1e6), g > _ && (f = f.concat(s.slice(_, g))), f.length > 0 && (b[e] = {
                    actualStartTime: T,
                    actualEndTime: t,
                    segments: f
                });
            }
            return Object.keys(b).length === 0 ? null : Object.entries(b).map(([e, { actualStartTime: s, actualEndTime: h, segments: f }])=>{
                let _ = 0;
                const g = new Je();
                return {
                    actualStartTime: s,
                    actualEndTime: h,
                    on: g.on,
                    stream: new ReadableStream({
                        start: async (m)=>{
                            u(f, m, g), m.enqueue(new Uint8Array(await (await fetch(new URL(e, d).href)).arrayBuffer()));
                        },
                        pull: async (m)=>{
                            const w = new URL(f[_].uri, d).href;
                            m.enqueue(new Uint8Array(await a(w))), _ += 1, _ >= f.length && (m.close(), g.destroy());
                        }
                    })
                };
            });
        }
    };
}
const Jr = `#version 300 es
  layout (location = 0) in vec4 a_position;
  layout (location = 1) in vec2 a_texCoord;
  out vec2 v_texCoord;
  void main () {
    gl_Position = a_position;
    v_texCoord = a_texCoord;
  }
`, tn = `#version 300 es
precision mediump float;
out vec4 FragColor;
in vec2 v_texCoord;

uniform sampler2D frameTexture;
uniform vec3 keyColor;

// \u{8272}\u{5EA6}\u{7684}\u{76F8}\u{4F3C}\u{5EA6}\u{8BA1}\u{7B97}
uniform float similarity;
// \u{900F}\u{660E}\u{5EA6}\u{7684}\u{5E73}\u{6ED1}\u{5EA6}\u{8BA1}\u{7B97}
uniform float smoothness;
// \u{964D}\u{4F4E}\u{7EFF}\u{5E55}\u{9971}\u{548C}\u{5EA6}\u{FF0C}\u{63D0}\u{9AD8}\u{62A0}\u{56FE}\u{51C6}\u{786E}\u{5EA6}
uniform float spill;

vec2 RGBtoUV(vec3 rgb) {
  return vec2(
    rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,
    rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5
  );
}

void main() {
  // \u{83B7}\u{53D6}\u{5F53}\u{524D}\u{50CF}\u{7D20}\u{7684}rgba\u{503C}
  vec4 rgba = texture(frameTexture, v_texCoord);
  // \u{8BA1}\u{7B97}\u{5F53}\u{524D}\u{50CF}\u{7D20}\u{4E0E}\u{7EFF}\u{5E55}\u{50CF}\u{7D20}\u{7684}\u{8272}\u{5EA6}\u{5DEE}\u{503C}
  vec2 chromaVec = RGBtoUV(rgba.rgb) - RGBtoUV(keyColor);
  // \u{8BA1}\u{7B97}\u{5F53}\u{524D}\u{50CF}\u{7D20}\u{4E0E}\u{7EFF}\u{5E55}\u{50CF}\u{7D20}\u{7684}\u{8272}\u{5EA6}\u{8DDD}\u{79BB}\u{FF08}\u{5411}\u{91CF}\u{957F}\u{5EA6}\u{FF09}, \u{8D8A}\u{76F8}\u{50CF}\u{5219}\u{8272}\u{5EA6}\u{8DDD}\u{79BB}\u{8D8A}\u{5C0F}
  float chromaDist = sqrt(dot(chromaVec, chromaVec));
  // \u{8BBE}\u{7F6E}\u{4E86}\u{4E00}\u{4E2A}\u{76F8}\u{4F3C}\u{5EA6}\u{9608}\u{503C}\u{FF0C}baseMask\u{4E3A}\u{8D1F}\u{FF0C}\u{5219}\u{8868}\u{660E}\u{662F}\u{7EFF}\u{5E55}\u{FF0C}\u{4E3A}\u{6B63}\u{5219}\u{8868}\u{660E}\u{4E0D}\u{662F}\u{7EFF}\u{5E55}
  float baseMask = chromaDist - similarity;
  // \u{5982}\u{679C}baseMask\u{4E3A}\u{8D1F}\u{6570}\u{FF0C}fullMask\u{7B49}\u{4E8E}0\u{FF1B}baseMask\u{4E3A}\u{6B63}\u{6570}\u{FF0C}\u{8D8A}\u{5927}\u{FF0C}\u{5219}\u{900F}\u{660E}\u{5EA6}\u{8D8A}\u{4F4E}
  float fullMask = pow(clamp(baseMask / smoothness, 0., 1.), 1.5);
  rgba.a = fullMask; // \u{8BBE}\u{7F6E}\u{900F}\u{660E}\u{5EA6}
  // \u{5982}\u{679C}baseMask\u{4E3A}\u{8D1F}\u{6570}\u{FF0C}spillVal\u{7B49}\u{4E8E}0\u{FF1B}baseMask\u{4E3A}\u{6574}\u{6570}\u{FF0C}\u{8D8A}\u{5C0F}\u{FF0C}\u{9971}\u{548C}\u{5EA6}\u{8D8A}\u{4F4E}
  float spillVal = pow(clamp(baseMask / spill, 0., 1.), 1.5);
  float desat = clamp(rgba.r * 0.2126 + rgba.g * 0.7152 + rgba.b * 0.0722, 0., 1.); // \u{8BA1}\u{7B97}\u{5F53}\u{524D}\u{50CF}\u{7D20}\u{7684}\u{7070}\u{5EA6}\u{503C}
  rgba.rgb = mix(vec3(desat, desat, desat), rgba.rgb, spillVal);
  FragColor = rgba;
}
`, en = [
    -1,
    1,
    -1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    1,
    -1,
    1
], sn = [
    0,
    1,
    0,
    0,
    1,
    0,
    1,
    0,
    1,
    1,
    0,
    1
];
function rn(l, n, o) {
    const r = rs(l, l.VERTEX_SHADER, n), d = rs(l, l.FRAGMENT_SHADER, o), c = l.createProgram();
    if (l.attachShader(c, r), l.attachShader(c, d), l.linkProgram(c), !l.getProgramParameter(c, l.LINK_STATUS)) throw Error(l.getProgramInfoLog(c) ?? "Unable to initialize the shader program");
    return c;
}
function rs(l, n, o) {
    const r = l.createShader(n);
    if (l.shaderSource(r, o), l.compileShader(r), !l.getShaderParameter(r, l.COMPILE_STATUS)) {
        const d = l.getShaderInfoLog(r);
        throw l.deleteShader(r), Error(d ?? "An error occurred compiling the shaders");
    }
    return r;
}
function nn(l, n, o) {
    l.bindTexture(l.TEXTURE_2D, o), l.texImage2D(l.TEXTURE_2D, 0, l.RGBA, l.RGBA, l.UNSIGNED_BYTE, n), l.drawArrays(l.TRIANGLES, 0, 6);
}
function an(l) {
    const n = l.createTexture();
    if (n == null) throw Error("Create WebGL texture error");
    l.bindTexture(l.TEXTURE_2D, n);
    const o = 0, r = l.RGBA, d = 1, c = 1, u = 0, a = l.RGBA, y = l.UNSIGNED_BYTE, v = new Uint8Array([
        0,
        0,
        255,
        255
    ]);
    return l.texImage2D(l.TEXTURE_2D, o, r, d, c, u, a, y, v), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_MAG_FILTER, l.LINEAR), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_MIN_FILTER, l.LINEAR), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_WRAP_S, l.CLAMP_TO_EDGE), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_WRAP_T, l.CLAMP_TO_EDGE), n;
}
function on(l) {
    const n = "document" in globalThis ? globalThis.document.createElement("canvas") : new OffscreenCanvas(l.width, l.height);
    n.width = l.width, n.height = l.height;
    const o = n.getContext("webgl2", {
        premultipliedAlpha: !1,
        alpha: !0
    });
    if (o == null) throw Error("Cant create gl context");
    const r = rn(o, Jr, tn);
    o.useProgram(r), o.uniform3fv(o.getUniformLocation(r, "keyColor"), l.keyColor.map((y)=>y / 255)), o.uniform1f(o.getUniformLocation(r, "similarity"), l.similarity), o.uniform1f(o.getUniformLocation(r, "smoothness"), l.smoothness), o.uniform1f(o.getUniformLocation(r, "spill"), l.spill);
    const d = o.createBuffer();
    o.bindBuffer(o.ARRAY_BUFFER, d), o.bufferData(o.ARRAY_BUFFER, new Float32Array(en), o.STATIC_DRAW);
    const c = o.getAttribLocation(r, "a_position");
    o.vertexAttribPointer(c, 2, o.FLOAT, !1, Float32Array.BYTES_PER_ELEMENT * 2, 0), o.enableVertexAttribArray(c);
    const u = o.createBuffer();
    o.bindBuffer(o.ARRAY_BUFFER, u), o.bufferData(o.ARRAY_BUFFER, new Float32Array(sn), o.STATIC_DRAW);
    const a = o.getAttribLocation(r, "a_texCoord");
    return o.vertexAttribPointer(a, 2, o.FLOAT, !1, Float32Array.BYTES_PER_ELEMENT * 2, 0), o.enableVertexAttribArray(a), o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL, 1), {
        cvs: n,
        gl: o
    };
}
function hn(l) {
    return l instanceof VideoFrame ? {
        width: l.codedWidth,
        height: l.codedHeight
    } : {
        width: l.width,
        height: l.height
    };
}
function ln(l) {
    const o = new OffscreenCanvas(1, 1).getContext("2d");
    o.drawImage(l, 0, 0);
    const { data: [r, d, c] } = o.getImageData(0, 0, 1, 1);
    return [
        r,
        d,
        c
    ];
}
const wn = (l)=>{
    let n = null, o = null, r = l.keyColor, d = null;
    return async (c)=>{
        if ((n == null || o == null || d == null) && (r == null && (r = ln(c)), { cvs: n, gl: o } = on({
            ...hn(c),
            keyColor: r,
            ...l
        }), d = an(o)), nn(o, c, d), globalThis.VideoFrame != null && c instanceof globalThis.VideoFrame) {
            const u = new VideoFrame(n, {
                alpha: "keep",
                timestamp: c.timestamp,
                duration: c.duration ?? void 0
            });
            return c.close(), u;
        }
        return createImageBitmap(n, {
            imageOrientation: c instanceof ImageBitmap ? "flipY" : "none"
        });
    };
};
var Ne, Me, Ge, Ye, Ve, He, Bt, ne;
const O = class O {
    constructor(n, o, r, d, c){
        U(this, Bt);
        U(this, Ne, new Je());
        /**
     * 监听属性变更事件
     * @example
     * rect.on('propsChange', (changedProps) => {})
     */ F(this, "on", p(this, Ne).on);
        U(this, Me, 0);
        U(this, Ge, 0);
        U(this, Ye, 0);
        U(this, Ve, 0);
        U(this, He, 0);
        /**
     * 如果当前实例是 Rect 控制点（{@link Rect.ctrls}）之一，`master` 将指向该 Rect
     *
     * 控制点的坐标是相对于它的 `master` 定位到
     */ F(this, "master", null);
        /**
     * 是否保持固定宽高比例，禁止变形缩放
     *
     * 值为 true 时，{@link Rect.ctrls} 将缺少上下左右四个控制点
     */ F(this, "fixedAspectRatio", !1);
        this.x = n ?? 0, this.y = o ?? 0, this.w = r ?? 0, this.h = d ?? 0, this.master = c ?? null;
    }
    /**
   * x 坐标
   */ get x() {
        return p(this, Me);
    }
    set x(n) {
        H(this, Bt, ne).call(this, "x", n);
    }
    get y() {
        return p(this, Ge);
    }
    /**
   * y 坐标
   */ set y(n) {
        H(this, Bt, ne).call(this, "y", n);
    }
    /**
   * 宽
   */ get w() {
        return p(this, Ye);
    }
    set w(n) {
        H(this, Bt, ne).call(this, "w", n);
    }
    /**
   * 高
   */ get h() {
        return p(this, Ve);
    }
    set h(n) {
        H(this, Bt, ne).call(this, "h", n);
    }
    /**
   * 旋转角度
   * @see [MDN Canvas rotate](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rotate)
   */ get angle() {
        return p(this, He);
    }
    set angle(n) {
        H(this, Bt, ne).call(this, "angle", n);
    }
    /**
   * 根据坐标、宽高计算出来的矩形中心点
   */ get center() {
        const { x: n, y: o, w: r, h: d } = this;
        return {
            x: n + r / 2,
            y: o + d / 2
        };
    }
    /**
   * 根据坐标、宽高计算出来的矩形控制点
   *
   * {@link Rect.fixedAspectRatio} = `true` 时，将缺少上下左右(`t,b,l,r`)四个控制点
   */ get ctrls() {
        const { w: n, h: o } = this, r = O.CTRL_SIZE, d = r / 2, c = n / 2, u = o / 2, a = r * 1.5, y = a / 2;
        return {
            ...this.fixedAspectRatio ? {} : {
                t: new O(-d, -u - d, r, r, this),
                b: new O(-d, u - d, r, r, this),
                l: new O(-c - d, -d, r, r, this),
                r: new O(c - d, -d, r, r, this)
            },
            lt: new O(-c - d, -u - d, r, r, this),
            lb: new O(-c - d, u - d, r, r, this),
            rt: new O(c - d, -u - d, r, r, this),
            rb: new O(c - d, u - d, r, r, this),
            rotate: new O(-y, -u - r * 2 - y, a, a, this)
        };
    }
    clone() {
        const { x: n, y: o, w: r, h: d, master: c } = this, u = new O(n, o, r, d, c);
        return u.angle = this.angle, u.fixedAspectRatio = this.fixedAspectRatio, u;
    }
    /**
   * 检测目标坐标是否命中当前实例
   * @param tx 目标点 x 坐标
   * @param ty 目标点 y 坐标
   */ checkHit(n, o) {
        let { angle: r, center: d, x: c, y: u, w: a, h: y, master: v } = this;
        const b = (v == null ? void 0 : v.center) ?? d, T = (v == null ? void 0 : v.angle) ?? r;
        v == null && (c = c - b.x, u = u - b.y);
        const t = n - b.x, e = o - b.y;
        let s = t, h = e;
        return T !== 0 && (s = t * Math.cos(T) + e * Math.sin(T), h = e * Math.cos(T) - t * Math.sin(T)), !(s < c || s > c + a || h < u || h > u + y);
    }
};
Ne = new WeakMap(), Me = new WeakMap(), Ge = new WeakMap(), Ye = new WeakMap(), Ve = new WeakMap(), He = new WeakMap(), Bt = new WeakSet(), ne = function(n, o) {
    const r = this[n] !== o;
    switch(n){
        case "x":
            x(this, Me, o);
            break;
        case "y":
            x(this, Ge, o);
            break;
        case "w":
            x(this, Ye, o);
            break;
        case "h":
            x(this, Ve, o);
            break;
        case "angle":
            x(this, He, o);
            break;
    }
    r && p(this, Ne).emit("propsChange", {
        [n]: o
    });
}, /**
 * 统一设置所有 {@link Rect.ctrls} 的边长
 *
 * ⚠️ 交给 [AVCanvas](../../av-canvas/classes/AVCanvas.html) 设置，不要随意改变它的值
 */ F(O, "CTRL_SIZE", 16), /**
 * 控制点：上、下、左、右，左上、左下、右上、右下、旋转
 */ F(O, "CTRL_KEYS", [
    "t",
    "b",
    "l",
    "r",
    "lt",
    "lb",
    "rt",
    "rb",
    "rotate"
]);
let Fi = O;
var qt, ue, Pt, pt;
class Is {
    constructor(){
        /**
     * 控制素材在视频中的空间属性（坐标、旋转、缩放）
     */ F(this, "rect", new Fi());
        /**
     * 控制素材在视频中的时间偏移与时长，常用于剪辑场景时间轴（轨道）模块
     *
     * duration 不能大于引用 {@link IClip} 的时长，单位 微秒
     */ F(this, "time", {
            offset: 0,
            duration: 0
        });
        /**
     * 元素是否可见，用于不想删除，期望临时隐藏 Sprite 的场景
     */ F(this, "visible", !0);
        U(this, qt, new Je());
        /**
     * 监听属性变更事件
     * @example
     * sprite.on('propsChange', (changedProps) => {})
     */ F(this, "on", p(this, qt).on);
        U(this, ue, 0);
        /**
     * 不透明度
     */ F(this, "opacity", 1);
        /**
     * 水平或垂直方向翻转素材
     */ F(this, "flip", null);
        U(this, Pt, null);
        U(this, pt, null);
        /**
     * @see {@link IClip.ready}
     */ F(this, "ready", Promise.resolve());
        this.rect.on("propsChange", (n)=>{
            p(this, qt).emit("propsChange", {
                rect: n
            });
        });
    }
    get zIndex() {
        return p(this, ue);
    }
    /**
   * 控制素材间的层级关系，zIndex 值较小的素材会被遮挡
   */ set zIndex(n) {
        const o = p(this, ue) !== n;
        x(this, ue, n), o && p(this, qt).emit("propsChange", {
            zIndex: n
        });
    }
    _render(n) {
        const { rect: { center: o, angle: r } } = this;
        n.setTransform(// 水平 缩放、倾斜
        this.flip === "horizontal" ? -1 : 1, 0, // 垂直 倾斜、缩放
        0, this.flip === "vertical" ? -1 : 1, // 坐标原点偏移 x y
        o.x, o.y), n.rotate((this.flip == null ? 1 : -1) * r), n.globalAlpha = this.opacity;
    }
    /**
   * 给素材添加动画，使用方法参考 css animation
   *
   * @example
   * sprite.setAnimation(
   *   {
   *     '0%': { x: 0, y: 0 },
   *     '25%': { x: 1200, y: 680 },
   *     '50%': { x: 1200, y: 0 },
   *     '75%': { x: 0, y: 680 },
   *     '100%': { x: 0, y: 0 },
   *   },
   *   { duration: 4, iterCount: 1 },
   * );
   *
   * @see [视频水印动画](https://bilibili.github.io/WebAV/demo/2_1-concat-video)
   */ setAnimation(n, o) {
        x(this, Pt, Object.entries(n).map(([r, d])=>{
            const c = {
                from: 0,
                to: 100
            }[r] ?? Number(r.slice(0, -1));
            if (isNaN(c) || c > 100 || c < 0) throw Error("keyFrame must between 0~100");
            return [
                c / 100,
                d
            ];
        })), x(this, pt, Object.assign({}, p(this, pt), {
            duration: o.duration * 1e6,
            delay: (o.delay ?? 0) * 1e6,
            iterCount: o.iterCount ?? 1 / 0
        }));
    }
    /**
   * 如果当前 sprite 已被设置动画，将 sprite 的动画属性设定到指定时间的状态
   */ animate(n) {
        if (p(this, Pt) == null || p(this, pt) == null || n < p(this, pt).delay) return;
        const o = fn(n, p(this, Pt), p(this, pt));
        for(const r in o)switch(r){
            case "opacity":
                this.opacity = o[r];
                break;
            case "x":
            case "y":
            case "w":
            case "h":
            case "angle":
                this.rect[r] = o[r];
                break;
        }
    }
    /**
   * 将当前 sprite 的属性赋值到目标
   *
   * 用于 clone，或 {@link VisibleSprite} 与 {@link OffscreenSprite} 实例间的类型转换
   */ copyStateTo(n) {
        x(n, Pt, p(this, Pt)), x(n, pt, p(this, pt)), n.visible = this.visible, n.zIndex = this.zIndex, n.opacity = this.opacity, n.flip = this.flip, n.rect = this.rect.clone(), n.time = {
            ...this.time
        };
    }
    destroy() {
        p(this, qt).destroy();
    }
}
qt = new WeakMap(), ue = new WeakMap(), Pt = new WeakMap(), pt = new WeakMap();
function fn(l, n, o) {
    if (l / o.duration >= o.iterCount) return {};
    const r = l % o.duration, d = l === o.duration ? 1 : r / o.duration, c = n.findIndex((t)=>t[0] >= d);
    if (c === -1) return {};
    const u = n[c - 1], a = n[c], y = a[1];
    if (u == null) return y;
    const v = u[1], b = {}, T = (d - u[0]) / (a[0] - u[0]);
    for(const t in y){
        const e = t;
        v[e] != null && (b[e] = (y[e] - v[e]) * T + v[e]);
    }
    return b;
}
var Qt, Rt, Xe;
const Mi = class Mi extends Is {
    constructor(o){
        super();
        U(this, Qt);
        // 保持最近一帧，若 clip 在当前帧无数据，则绘制最近一帧
        U(this, Rt, null);
        U(this, Xe, !1);
        x(this, Qt, o), this.ready = o.ready.then(({ width: r, height: d, duration: c })=>{
            this.rect.w = this.rect.w === 0 ? r : this.rect.w, this.rect.h = this.rect.h === 0 ? d : this.rect.h, this.time.duration = this.time.duration === 0 ? c : this.time.duration;
        });
    }
    /**
   * 绘制素材指定时刻的图像到 canvas 上下文，并返回对应的音频数据
   * @param time 指定时刻，微秒
   */ async offscreenRender(o, r) {
        var b;
        this.animate(r), super._render(o);
        const { w: d, h: c } = this.rect, { video: u, audio: a, state: y } = await p(this, Qt).tick(r);
        if (y === "done") return {
            audio: a ?? [],
            done: !0
        };
        const v = u ?? p(this, Rt);
        return v != null && o.drawImage(v, -d / 2, -c / 2, d, c), u != null && ((b = p(this, Rt)) == null || b.close(), x(this, Rt, u)), {
            audio: a ?? [],
            done: !1
        };
    }
    async clone() {
        const o = new Mi(await p(this, Qt).clone());
        return await o.ready, this.copyStateTo(o), o;
    }
    destroy() {
        var o;
        p(this, Xe) || (x(this, Xe, !0), B.info("OffscreenSprite destroy"), super.destroy(), (o = p(this, Rt)) == null || o.close(), x(this, Rt, null), p(this, Qt).destroy());
    }
};
Qt = new WeakMap(), Rt = new WeakMap(), Xe = new WeakMap();
let ns = Mi;
var Jt, Dt, pe, _e, We, Bi, Ze, je;
class vn extends Is {
    constructor(o){
        super();
        U(this, We);
        U(this, Jt);
        // 保持最近一帧，若 clip 在当前帧无数据，则绘制最近一帧
        U(this, Dt, null);
        U(this, pe, []);
        U(this, _e, !1);
        U(this, Ze, -1);
        U(this, je, !1);
        x(this, Jt, o), this.ready = o.ready.then(({ width: r, height: d, duration: c })=>{
            this.rect.w = this.rect.w === 0 ? r : this.rect.w, this.rect.h = this.rect.h === 0 ? d : this.rect.h, this.time.duration = this.time.duration === 0 ? c : this.time.duration;
        });
    }
    getClip() {
        return p(this, Jt);
    }
    /**
   * 提前准备指定 time 的帧
   */ preFrame(o) {
        H(this, We, Bi).call(this, o);
    }
    /**
   * 绘制素材指定时刻的图像到 canvas 上下文，并返回对应的音频数据
   * @param time 指定时刻，微秒
   */ render(o, r) {
        this.animate(r), super._render(o);
        const { w: d, h: c } = this.rect;
        p(this, Ze) !== r && H(this, We, Bi).call(this, r), x(this, Ze, r);
        const u = p(this, pe);
        x(this, pe, []);
        const a = p(this, Dt);
        return a != null && o.drawImage(a, -d / 2, -c / 2, d, c), {
            audio: u
        };
    }
    destroy() {
        var o;
        p(this, je) || (x(this, je, !0), B.info("VisibleSprite destroy"), super.destroy(), (o = p(this, Dt)) == null || o.close(), x(this, Dt, null), p(this, Jt).destroy());
    }
}
Jt = new WeakMap(), Dt = new WeakMap(), pe = new WeakMap(), _e = new WeakMap(), We = new WeakSet(), Bi = function(o) {
    p(this, _e) || (x(this, _e, !0), p(this, Jt).tick(o).then(({ video: r, audio: d })=>{
        var c;
        r != null && ((c = p(this, Dt)) == null || c.close(), x(this, Dt, r ?? null)), x(this, pe, d ?? []);
    }).finally(()=>{
        x(this, _e, !1);
    }));
}, Ze = new WeakMap(), je = new WeakMap();
let dn = 0;
async function Cs(l) {
    l() > 50 && (await zi(15), await Cs(l));
}
var _t, Ke, et, te, $e, qe, zt, ge, Lt, me, Fs, Bs;
class Sn {
    /**
   * 根据配置创建合成器实例
   * @param opts ICombinatorOpts
   */ constructor(n = {}){
        U(this, me);
        U(this, _t, B.create(`id:${dn++},`));
        U(this, Ke, !1);
        U(this, et, []);
        U(this, te);
        U(this, $e);
        // 中断输出
        U(this, qe, null);
        U(this, zt);
        U(this, ge);
        U(this, Lt, new Je());
        F(this, "on", p(this, Lt).on);
        const { width: o = 0, height: r = 0 } = n;
        x(this, te, new OffscreenCanvas(o, r));
        const d = p(this, te).getContext("2d", {
            alpha: !1
        });
        if (d == null) throw Error("Can not create 2d offscreen context");
        x(this, $e, d), x(this, zt, Object.assign({
            bgColor: "#000",
            width: 0,
            height: 0,
            videoCodec: "avc1.42E032",
            audio: !0,
            bitrate: 5e6,
            metaDataTags: null
        }, n)), x(this, ge, o * r > 0);
    }
    /**
   * 检测当前环境的兼容性
   * @param args.videoCodec 指定视频编码格式，默认 avc1.42E032
   */ static async isSupported(n = {
        videoCodec: "avc1.42E032"
    }) {
        return self.OffscreenCanvas != null && self.VideoEncoder != null && self.VideoDecoder != null && self.VideoFrame != null && self.AudioEncoder != null && self.AudioDecoder != null && self.AudioData != null && ((await self.VideoEncoder.isConfigSupported({
            codec: n.videoCodec,
            width: 1280,
            height: 720
        })).supported ?? !1) && (await self.AudioEncoder.isConfigSupported({
            codec: D.codec,
            sampleRate: D.sampleRate,
            numberOfChannels: D.channelCount
        })).supported;
    }
    /**
   * 添加用于合成视频的 Sprite，视频时长默认取所有素材 duration 字段的最大值
   * @param os Sprite
   * @param opts.main 如果 main 为 true，视频时长为该素材的 duration 值
   */ async addSprite(n, o = {}) {
        p(this, _t).info("Combinator add sprite", n);
        const r = await n.clone();
        p(this, _t).info("Combinator add sprite ready", n), p(this, et).push(Object.assign(r, {
            main: o.main ?? !1,
            expired: !1
        })), p(this, et).sort((d, c)=>d.zIndex - c.zIndex);
    }
    /**
   * 输出视频文件二进制流
   */ output() {
        if (p(this, et).length === 0) throw Error("No sprite added");
        const n = p(this, et).find((y)=>y.main), o = n != null ? n.time.offset + n.time.duration : Math.max(...p(this, et).map((y)=>y.time.offset + y.time.duration));
        if (o === 1 / 0) throw Error("Unable to determine the end time, please specify a main sprite, or limit the duration of ImgClip, AudioCli");
        o === -1 && p(this, _t).warn("Unable to determine the end time, process value don't update"), p(this, _t).info(`start combinate video, maxTime:${o}`);
        const r = H(this, me, Fs).call(this, o);
        let d = performance.now();
        const c = H(this, me, Bs).call(this, r, o, {
            onProgress: (y)=>{
                p(this, _t).debug("OutputProgress:", y), p(this, Lt).emit("OutputProgress", y);
            },
            onEnded: async ()=>{
                await r.flush(), p(this, _t).info("===== output ended =====, cost:", performance.now() - d), p(this, Lt).emit("OutputProgress", 1), this.destroy();
            },
            onError: (y)=>{
                p(this, Lt).emit("error", y), a(y), this.destroy();
            }
        });
        x(this, qe, ()=>{
            c(), r.close(), a();
        });
        const { stream: u, stop: a } = As(r.mp4file, 500, this.destroy);
        return u;
    }
    /**
   * 销毁实例，释放资源
   */ destroy() {
        var n;
        p(this, Ke) || (x(this, Ke, !0), (n = p(this, qe)) == null || n.call(this), p(this, Lt).destroy());
    }
}
_t = new WeakMap(), Ke = new WeakMap(), et = new WeakMap(), te = new WeakMap(), $e = new WeakMap(), qe = new WeakMap(), zt = new WeakMap(), ge = new WeakMap(), Lt = new WeakMap(), me = new WeakSet(), Fs = function(n) {
    const { width: o, height: r, videoCodec: d, bitrate: c, audio: u, metaDataTags: a } = p(this, zt);
    return Rr({
        video: p(this, ge) ? {
            width: o,
            height: r,
            expectFPS: 30,
            codec: d,
            bitrate: c,
            __unsafe_hardwareAcceleration__: p(this, zt).__unsafe_hardwareAcceleration__
        } : null,
        audio: u === !1 ? null : {
            codec: "aac",
            sampleRate: D.sampleRate,
            channelCount: D.channelCount
        },
        duration: n,
        metaDataTags: a
    });
}, Bs = function(n, o, { onProgress: r, onEnded: d, onError: c }) {
    let u = 0, a = !1, y = null;
    (async ()=>{
        let e = 0;
        const { width: s, height: h } = p(this, te), f = p(this, $e);
        let _ = 0;
        for(;;){
            if (y != null) return;
            if (a || o !== -1 && _ > o || p(this, et).length === 0) {
                T(), await d();
                return;
            }
            u = _ / o, f.fillStyle = p(this, zt).bgColor, f.fillRect(0, 0, s, h);
            const g = [];
            for (const m of p(this, et)){
                if (a) break;
                if (_ < m.time.offset || m.expired) continue;
                f.save();
                const { audio: w, done: S } = await m.offscreenRender(f, _ - m.time.offset);
                if (g.push(w), f.restore(), m.time.duration > 0 && _ > m.time.offset + m.time.duration || S) {
                    if (m.main) {
                        T(), await d();
                        return;
                    }
                    m.destroy(), m.expired = !0;
                }
            }
            if (a) return;
            if (p(this, zt).audio !== !1) {
                if (g.flat().every((m)=>m.length === 0)) n.encodeAudio(cn(_, 33e3, D.sampleRate));
                else {
                    const m = Ai(g);
                    n.encodeAudio(new AudioData({
                        timestamp: _,
                        numberOfChannels: D.channelCount,
                        numberOfFrames: m.length / D.channelCount,
                        sampleRate: D.sampleRate,
                        format: "f32-planar",
                        data: m
                    }));
                }
            }
            if (p(this, ge)) {
                const m = new VideoFrame(p(this, te), {
                    duration: 33e3,
                    timestamp: _
                });
                n.encodeVideo(m, {
                    keyFrame: e % 150 === 0
                }), f.resetTransform(), f.clearRect(0, 0, s, h), e += 1;
            }
            _ += 33e3, await Cs(n.getEncodeQueueSize);
        }
    })().catch((t)=>{
        y = t, p(this, _t).error(t), T(), c(t);
    });
    const b = setInterval(()=>{
        r(u);
    }, 500), T = ()=>{
        a || (a = !0, clearInterval(b), p(this, et).forEach((t)=>t.destroy()));
    };
    return T;
};
function cn(l, n, o) {
    const r = Math.floor(o * n / 1e6);
    return new AudioData({
        timestamp: l,
        numberOfChannels: D.channelCount,
        numberOfFrames: r,
        sampleRate: o,
        format: "f32-planar",
        data: new Float32Array(r * 2)
    });
}

},{"718a311db185ef08":"kLBSi","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"kLBSi":[function(require,module,exports) {
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ /* eslint-disable no-proto */ "use strict";
var base64 = require("9c62938f1dccc73c");
var ieee754 = require("aceacb6a4531a9d2");
var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" // eslint-disable-line dot-notation
 ? Symbol["for"]("nodejs.util.inspect.custom") // eslint-disable-line dot-notation
 : null;
exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
var K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */ Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
function typedArraySupport() {
    // Can typed array instances can be augmented?
    try {
        var arr = new Uint8Array(1);
        var proto = {
            foo: function() {
                return 42;
            }
        };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
    } catch (e) {
        return false;
    }
}
Object.defineProperty(Buffer.prototype, "parent", {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.buffer;
    }
});
Object.defineProperty(Buffer.prototype, "offset", {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.byteOffset;
    }
});
function createBuffer(length) {
    if (length > K_MAX_LENGTH) throw new RangeError('The value "' + length + '" is invalid for option "size"');
    // Return an augmented `Uint8Array` instance
    var buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */ function Buffer(arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") throw new TypeError('The "string" argument must be of type string. Received type number');
        return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192 // not used by this implementation
;
function from(value, encodingOrOffset, length) {
    if (typeof value === "string") return fromString(value, encodingOrOffset);
    if (ArrayBuffer.isView(value)) return fromArrayView(value);
    if (value == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) return fromArrayBuffer(value, encodingOrOffset, length);
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) return fromArrayBuffer(value, encodingOrOffset, length);
    if (typeof value === "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
    var valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) return Buffer.from(valueOf, encodingOrOffset, length);
    var b = fromObject(value);
    if (b) return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") return Buffer.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/ Buffer.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
};
// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);
function assertSize(size) {
    if (typeof size !== "number") throw new TypeError('"size" argument must be of type number');
    else if (size < 0) throw new RangeError('The value "' + size + '" is invalid for option "size"');
}
function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) return createBuffer(size);
    if (fill !== undefined) // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    return createBuffer(size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/ Buffer.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
};
function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */ Buffer.allocUnsafe = function(size) {
    return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */ Buffer.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
};
function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") encoding = "utf8";
    if (!Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
    var length = byteLength(string, encoding) | 0;
    var buf = createBuffer(length);
    var actual = buf.write(string, encoding);
    if (actual !== length) // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
    return buf;
}
function fromArrayLike(array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    var buf = createBuffer(length);
    for(var i = 0; i < length; i += 1)buf[i] = array[i] & 255;
    return buf;
}
function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
        var copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
}
function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError('"offset" is outside of buffer bounds');
    if (array.byteLength < byteOffset + (length || 0)) throw new RangeError('"length" is outside of buffer bounds');
    var buf;
    if (byteOffset === undefined && length === undefined) buf = new Uint8Array(array);
    else if (length === undefined) buf = new Uint8Array(array, byteOffset);
    else buf = new Uint8Array(array, byteOffset, length);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);
        if (buf.length === 0) return buf;
        obj.copy(buf, 0, 0, len);
        return buf;
    }
    if (obj.length !== undefined) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) return createBuffer(0);
        return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) return fromArrayLike(obj.data);
}
function checked(length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    return length | 0;
}
function SlowBuffer(length) {
    if (+length != length) length = 0;
    return Buffer.alloc(+length);
}
Buffer.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
    ;
};
Buffer.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    if (a === b) return 0;
    var x = a.length;
    var y = b.length;
    for(var i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
    switch(String(encoding).toLowerCase()){
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return true;
        default:
            return false;
    }
};
Buffer.concat = function concat(list, length) {
    if (!Array.isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (list.length === 0) return Buffer.alloc(0);
    var i;
    if (length === undefined) {
        length = 0;
        for(i = 0; i < list.length; ++i)length += list[i].length;
    }
    var buffer = Buffer.allocUnsafe(length);
    var pos = 0;
    for(i = 0; i < list.length; ++i){
        var buf = list[i];
        if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) Buffer.from(buf).copy(buffer, pos);
            else Uint8Array.prototype.set.call(buffer, buf, pos);
        } else if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
        else buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};
function byteLength(string, encoding) {
    if (Buffer.isBuffer(string)) return string.length;
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) return string.byteLength;
    if (typeof string !== "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
    var len = string.length;
    var mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) return 0;
    // Use a for loop to avoid recursion
    var loweredCase = false;
    for(;;)switch(encoding){
        case "ascii":
        case "latin1":
        case "binary":
            return len;
        case "utf8":
        case "utf-8":
            return utf8ToBytes(string).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return len * 2;
        case "hex":
            return len >>> 1;
        case "base64":
            return base64ToBytes(string).length;
        default:
            if (loweredCase) return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
            ;
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
    }
}
Buffer.byteLength = byteLength;
function slowToString(encoding, start, end) {
    var loweredCase = false;
    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) start = 0;
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) return "";
    if (end === undefined || end > this.length) end = this.length;
    if (end <= 0) return "";
    // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0;
    start >>>= 0;
    if (end <= start) return "";
    if (!encoding) encoding = "utf8";
    while(true)switch(encoding){
        case "hex":
            return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
            return utf8Slice(this, start, end);
        case "ascii":
            return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
            return latin1Slice(this, start, end);
        case "base64":
            return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return utf16leSlice(this, start, end);
        default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
    }
}
// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;
function swap(b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
    var len = this.length;
    if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for(var i = 0; i < len; i += 2)swap(this, i, i + 1);
    return this;
};
Buffer.prototype.swap32 = function swap32() {
    var len = this.length;
    if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for(var i = 0; i < len; i += 4){
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }
    return this;
};
Buffer.prototype.swap64 = function swap64() {
    var len = this.length;
    if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
    for(var i = 0; i < len; i += 8){
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }
    return this;
};
Buffer.prototype.toString = function toString() {
    var length = this.length;
    if (length === 0) return "";
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
};
Buffer.prototype.toLocaleString = Buffer.prototype.toString;
Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
    var str = "";
    var max = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max) str += " ... ";
    return "<Buffer " + str + ">";
};
if (customInspectSymbol) Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) target = Buffer.from(target, target.offset, target.byteLength);
    if (!Buffer.isBuffer(target)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
    if (start === undefined) start = 0;
    if (end === undefined) end = target ? target.length : 0;
    if (thisStart === undefined) thisStart = 0;
    if (thisEnd === undefined) thisEnd = this.length;
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
    if (thisStart >= thisEnd && start >= end) return 0;
    if (thisStart >= thisEnd) return -1;
    if (start >= end) return 1;
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    var x = thisEnd - thisStart;
    var y = end - start;
    var len = Math.min(x, y);
    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end);
    for(var i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1;
    // Normalize byteOffset
    if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
    } else if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;
    else if (byteOffset < -2147483648) byteOffset = -2147483648;
    byteOffset = +byteOffset // Coerce to Number.
    ;
    if (numberIsNaN(byteOffset)) // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
    }
    // Normalize val
    if (typeof val === "string") val = Buffer.from(val, encoding);
    // Finally, search either indexOf (if dir is true) or lastIndexOf
    if (Buffer.isBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) return -1;
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
        val = val & 0xFF // Search for a byte value [0-255]
        ;
        if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            else return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
        return arrayIndexOf(buffer, [
            val
        ], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;
    if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
        }
    }
    function read(buf, i) {
        if (indexSize === 1) return buf[i];
        else return buf.readUInt16BE(i * indexSize);
    }
    var i;
    if (dir) {
        var foundIndex = -1;
        for(i = byteOffset; i < arrLength; i++)if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
        }
    } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for(i = byteOffset; i >= 0; i--){
            var found = true;
            for(var j = 0; j < valLength; j++)if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
            }
            if (found) return i;
        }
    }
    return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) length = remaining;
    else {
        length = Number(length);
        if (length > remaining) length = remaining;
    }
    var strLen = string.length;
    if (length > strLen / 2) length = strLen / 2;
    for(var i = 0; i < length; ++i){
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
    }
    return i;
}
function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
    // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === undefined) encoding = "utf8";
        } else {
            encoding = length;
            length = undefined;
        }
    } else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    var remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    if (!encoding) encoding = "utf8";
    var loweredCase = false;
    for(;;)switch(encoding){
        case "hex":
            return hexWrite(this, string, offset, length);
        case "utf8":
        case "utf-8":
            return utf8Write(this, string, offset, length);
        case "ascii":
        case "latin1":
        case "binary":
            return asciiWrite(this, string, offset, length);
        case "base64":
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return ucs2Write(this, string, offset, length);
        default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
    }
};
Buffer.prototype.toJSON = function toJSON() {
    return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
    };
};
function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) return base64.fromByteArray(buf);
    else return base64.fromByteArray(buf.slice(start, end));
}
function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];
    var i = start;
    while(i < end){
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
        if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch(bytesPerSequence){
                case 1:
                    if (firstByte < 0x80) codePoint = firstByte;
                    break;
                case 2:
                    secondByte = buf[i + 1];
                    if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
                        if (tempCodePoint > 0x7F) codePoint = tempCodePoint;
                    }
                    break;
                case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) codePoint = tempCodePoint;
                    }
                    break;
                case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) codePoint = tempCodePoint;
                    }
            }
        }
        if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD;
            bytesPerSequence = 1;
        } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000;
            res.push(codePoint >>> 10 & 0x3FF | 0xD800);
            codePoint = 0xDC00 | codePoint & 0x3FF;
        }
        res.push(codePoint);
        i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
}
// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;
function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
    ;
    // Decode in chunks to avoid "call stack size exceeded".
    var res = "";
    var i = 0;
    while(i < len)res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    return res;
}
function asciiSlice(buf, start, end) {
    var ret = "";
    end = Math.min(buf.length, end);
    for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i] & 0x7F);
    return ret;
}
function latin1Slice(buf, start, end) {
    var ret = "";
    end = Math.min(buf.length, end);
    for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i]);
    return ret;
}
function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    var out = "";
    for(var i = start; i < end; ++i)out += hexSliceLookupTable[buf[i]];
    return out;
}
function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = "";
    // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
    for(var i = 0; i < bytes.length - 1; i += 2)res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    return res;
}
Buffer.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;
    if (start < 0) {
        start += len;
        if (start < 0) start = 0;
    } else if (start > len) start = len;
    if (end < 0) {
        end += len;
        if (end < 0) end = 0;
    } else if (end > len) end = len;
    if (end < start) end = start;
    var newBuf = this.subarray(start, end);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(newBuf, Buffer.prototype);
    return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */ function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
    if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
}
Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while(++i < byteLength && (mul *= 0x100))val += this[offset + i] * mul;
    return val;
};
Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset + --byteLength];
    var mul = 1;
    while(byteLength > 0 && (mul *= 0x100))val += this[offset + --byteLength] * mul;
    return val;
};
Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
};
Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};
Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while(++i < byteLength && (mul *= 0x100))val += this[offset + i] * mul;
    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var i = byteLength;
    var mul = 1;
    var val = this[offset + --i];
    while(i > 0 && (mul *= 0x100))val += this[offset + --i] * mul;
    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xff - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError("Index out of range");
}
Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    var mul = 1;
    var i = 0;
    this[offset] = value & 0xFF;
    while(++i < byteLength && (mul *= 0x100))this[offset + i] = value / mul & 0xFF;
    return offset + byteLength;
};
Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    var i = byteLength - 1;
    var mul = 1;
    this[offset + i] = value & 0xFF;
    while(--i >= 0 && (mul *= 0x100))this[offset + i] = value / mul & 0xFF;
    return offset + byteLength;
};
Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    this[offset] = value & 0xff;
    return offset + 1;
};
Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
};
Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
    return offset + 4;
};
Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
};
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 0xFF;
    while(++i < byteLength && (mul *= 0x100)){
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) sub = 1;
        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    var i = byteLength - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value & 0xFF;
    while(--i >= 0 && (mul *= 0x100)){
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) sub = 1;
        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = value & 0xff;
    return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
    if (value < 0) value = 0xffffffff + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
};
function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError("Index out of range");
    if (offset < 0) throw new RangeError("Index out of range");
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -340282346638528860000000000000000000000);
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
};
// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer.isBuffer(target)) throw new TypeError("argument should be a Buffer");
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;
    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;
    // Fatal error conditions
    if (targetStart < 0) throw new RangeError("targetStart out of bounds");
    if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
    if (end < 0) throw new RangeError("sourceEnd out of bounds");
    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) end = target.length - targetStart + start;
    var len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end);
    else Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    return len;
};
// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === "string") {
        if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
        }
        if (encoding !== undefined && typeof encoding !== "string") throw new TypeError("encoding must be a string");
        if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
        if (val.length === 1) {
            var code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") // Fast path: If `val` fits into a single byte, use that numeric value.
            val = code;
        }
    } else if (typeof val === "number") val = val & 255;
    else if (typeof val === "boolean") val = Number(val);
    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
    if (end <= start) return this;
    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    var i;
    if (typeof val === "number") for(i = start; i < end; ++i)this[i] = val;
    else {
        var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
        var len = bytes.length;
        if (len === 0) throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
    }
    return this;
};
// HELPER FUNCTIONS
// ================
var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
function base64clean(str) {
    // Node takes equal signs as end of the Base64 encoding
    str = str.split("=")[0];
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = str.trim().replace(INVALID_BASE64_RE, "");
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return "";
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while(str.length % 4 !== 0)str = str + "=";
    return str;
}
function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];
    for(var i = 0; i < length; ++i){
        codePoint = string.charCodeAt(i);
        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                }
                // valid lead
                leadSurrogate = codePoint;
                continue;
            }
            // 2 leads in a row
            if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                leadSurrogate = codePoint;
                continue;
            }
            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) // valid bmp char, but last char was a lead
        {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }
        leadSurrogate = null;
        // encode utf8
        if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
        } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else throw new Error("Invalid code point");
    }
    return bytes;
}
function asciiToBytes(str) {
    var byteArray = [];
    for(var i = 0; i < str.length; ++i)// Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
    return byteArray;
}
function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];
    for(var i = 0; i < str.length; ++i){
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }
    return byteArray;
}
function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
    for(var i = 0; i < length; ++i){
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
    }
    return i;
}
// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}
function numberIsNaN(obj) {
    // For IE11 support
    return obj !== obj // eslint-disable-line no-self-compare
    ;
}
// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = function() {
    var alphabet = "0123456789abcdef";
    var table = new Array(256);
    for(var i = 0; i < 16; ++i){
        var i16 = i * 16;
        for(var j = 0; j < 16; ++j)table[i16 + j] = alphabet[i] + alphabet[j];
    }
    return table;
}();

},{"9c62938f1dccc73c":"jvQRR","aceacb6a4531a9d2":"9hhlZ"}],"jvQRR":[function(require,module,exports) {
"use strict";
exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for(var i = 0, len = code.length; i < len; ++i){
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf("=");
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for(i = 0; i < len; i += 4){
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for(var i = start; i < end; i += 3){
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
    }
    return output.join("");
}
function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    ;
    var parts = [];
    var maxChunkLength = 16383 // must be multiple of 3
    ;
    // go through the array every three bytes, we'll deal with trailing stuff later
    for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + "==");
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + "=");
    }
    return parts.join("");
}

},{}],"9hhlZ":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for(; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for(; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);
    if (e === 0) e = 1 - eBias;
    else if (e === eMax) return m ? NaN : (s ? -1 : 1) * Infinity;
    else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) value += rt / c;
        else value += rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
            e++;
            c /= 2;
        }
        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }
    for(; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);
    e = e << mLen | m;
    eLen += mLen;
    for(; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);
    buffer[offset + i - d] |= s * 128;
};

},{}]},["dz77T"], "dz77T", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
