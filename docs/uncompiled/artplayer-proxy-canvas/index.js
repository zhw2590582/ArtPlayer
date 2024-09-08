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
})({"iXeaa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerProxyCanvas);
function artplayerProxyCanvas(callback) {
    return (art)=>{
        const { option, constructor } = art;
        const { createElement, def, append, sleep } = constructor.utils;
        const canvas = createElement("canvas");
        const ctx = canvas.getContext("2d");
        const video = createElement("video");
        const track = createElement("track");
        track.default = true;
        track.kind = "metadata";
        append(video, track);
        let animationFrame = null;
        const { propertys, methods, prototypes, events } = constructor.config;
        const keys = [
            ...propertys,
            ...methods,
            ...prototypes
        ];
        // 存储 canvas 的原始属性
        const originalCanvasProperties = {};
        [
            "width",
            "height"
        ].forEach((prop)=>{
            originalCanvasProperties[prop] = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, prop);
        });
        keys.forEach((key)=>{
            if (key === "width" || key === "height") def(canvas, key, {
                get () {
                    return originalCanvasProperties[key].get.call(this);
                },
                set (value) {
                    originalCanvasProperties[key].set.call(this, value);
                    video[key] = value;
                }
            });
            else def(canvas, key, {
                get () {
                    const value = video[key];
                    return typeof value === "function" ? value.bind(video) : value;
                },
                set (value) {
                    video[key] = value;
                }
            });
        });
        setTimeout(()=>{
            for(let index = 0; index < events.length; index++){
                const event = events[index];
                art.proxy(video, event, (event)=>{
                    art.emit(`video:${event.type}`, event);
                });
            }
        });
        const drawFrame = async ()=>{
            if (!video.videoWidth || !video.videoHeight) {
                console.log("Video dimensions not ready yet");
                return;
            }
            try {
                if (video.readyState >= 2) {
                    // HAVE_CURRENT_DATA or higher
                    // 使用 createImageBitmap 进行预处理
                    const bitmap = await createImageBitmap(video);
                    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                    bitmap.close();
                } else console.log("Video not ready for frame extraction");
            } catch (error) {
                console.error("Error drawing video frame:", error);
            }
        };
        // 使用 requestVideoFrameCallback 进行精确同步
        let videoFrameCallback;
        if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) videoFrameCallback = ()=>{
            drawFrame();
            video.requestVideoFrameCallback(videoFrameCallback);
        };
        else // 降级方案：使用 requestAnimationFrame
        videoFrameCallback = ()=>{
            drawFrame();
            animationFrame = requestAnimationFrame(videoFrameCallback);
        };
        const resize = ()=>{
            try {
                const player = art.template?.$player;
                if (!player || option.autoSize) return;
                const aspectRatio = video.videoWidth / video.videoHeight;
                const containerWidth = player.clientWidth;
                const containerHeight = player.clientHeight;
                const containerRatio = containerWidth / containerHeight;
                let canvasWidth, canvasHeight;
                if (containerRatio > aspectRatio) {
                    canvasHeight = containerHeight;
                    canvasWidth = canvasHeight * aspectRatio;
                } else {
                    canvasWidth = containerWidth;
                    canvasHeight = canvasWidth / aspectRatio;
                }
                // 设置 canvas 大小为实际显示大小
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                // 居中 canvas
                const paddingLeft = (containerWidth - canvasWidth) / 2;
                const paddingTop = (containerHeight - canvasHeight) / 2;
                Object.assign(canvas.style, {
                    padding: `${paddingTop}px ${paddingLeft}px`
                });
            } catch (error) {
                console.error("Error in resize function:", error);
            }
        };
        // 在视频元数据加载完成后设置 canvas 尺寸并绘制第一帧
        art.on("video:loadedmetadata", async ()=>{
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            resize();
        });
        // 在视频数据可用时绘制第一帧
        art.on("video:canplay", async ()=>{
            await sleep(300);
            drawFrame();
        });
        art.on("video:play", ()=>{
            if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) video.requestVideoFrameCallback(videoFrameCallback);
            else {
                cancelAnimationFrame(animationFrame);
                animationFrame = requestAnimationFrame(videoFrameCallback);
            }
        });
        art.on("video:pause", ()=>{
            if (!("requestVideoFrameCallback" in HTMLVideoElement.prototype)) cancelAnimationFrame(animationFrame);
        });
        art.on("resize", resize);
        const destroy = ()=>{
            if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) video.cancelVideoFrameCallback(videoFrameCallback);
            else cancelAnimationFrame(animationFrame);
        // 清理其他可能的资源...
        };
        art.on("destroy", destroy);
        if (typeof callback === "function") callback.call(art, video, option.url, art);
        else video.src = option.url;
        return canvas;
    };
}
if (typeof window !== "undefined") window["artplayerProxyCanvas"] = artplayerProxyCanvas;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5dUr6":[function(require,module,exports) {
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

},{}]},["iXeaa"], "iXeaa", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
