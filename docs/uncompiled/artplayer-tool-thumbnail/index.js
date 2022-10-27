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
var _emitter = require("./emitter");
var _emitterDefault = parcelHelpers.interopDefault(_emitter);
var _utils = require("./utils");
class ArtplayerToolThumbnail extends (0, _emitterDefault.default) {
    constructor(option = {}){
        super();
        this.processing = false;
        this.option = {};
        this.setup(Object.assign({}, ArtplayerToolThumbnail.DEFAULTS, option));
        this.video = ArtplayerToolThumbnail.creatVideo();
        this.duration = 0;
        this.inputChange = this.inputChange.bind(this);
        this.ondrop = this.ondrop.bind(this);
        this.option.fileInput.addEventListener("change", this.inputChange);
        this.option.fileInput.addEventListener("dragover", ArtplayerToolThumbnail.ondragover);
        this.option.fileInput.addEventListener("drop", ArtplayerToolThumbnail.ondrop);
    }
    static get DEFAULTS() {
        return {
            number: 60,
            width: 160,
            height: 90,
            column: 10,
            begin: 0,
            end: NaN
        };
    }
    static ondragover(event) {
        event.preventDefault();
    }
    ondrop(event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        this.loadVideo(file);
    }
    setup(option = {}) {
        this.option = Object.assign({}, this.option, option);
        const { fileInput , number , width , column  } = this.option;
        this.errorHandle(fileInput instanceof Element, "The 'fileInput' is not a Element");
        if (!(fileInput.tagName === "INPUT" && fileInput.type === "file")) {
            fileInput.style.position = "relative";
            const newFileInput = document.createElement("input");
            newFileInput.type = "file";
            newFileInput.style.position = "absolute";
            newFileInput.style.width = "100%";
            newFileInput.style.height = "100%";
            newFileInput.style.left = "0";
            newFileInput.style.top = "0";
            newFileInput.style.right = "0";
            newFileInput.style.bottom = "0";
            newFileInput.style.opacity = "0";
            fileInput.appendChild(newFileInput);
            this.option.fileInput = newFileInput;
        }
        [
            "number",
            "width",
            "column",
            "begin",
            "end"
        ].forEach((item)=>{
            this.errorHandle(typeof this.option[item] === "number", `The '${item}' is not a number`);
        });
        this.option.number = (0, _utils.clamp)(number, 10, 1000);
        this.option.width = (0, _utils.clamp)(width, 10, 1000);
        this.option.column = (0, _utils.clamp)(column, 1, 1000);
        return this;
    }
    static creatVideo() {
        const video = document.createElement("video");
        video.style.position = "absolute";
        video.style.top = "-9999px";
        video.style.left = "-9999px";
        video.muted = true;
        video.controls = true;
        document.body.appendChild(video);
        return video;
    }
    inputChange(event) {
        const file = this.option.fileInput.files[0];
        this.loadVideo(file);
        event.target.value = "";
    }
    loadVideo(file) {
        if (file) {
            const canPlayType = this.video.canPlayType(file.type);
            this.errorHandle(canPlayType === "maybe" || canPlayType === "probably", `Playback of this file format is not supported: ${file.type}`);
            const videoUrl = URL.createObjectURL(file);
            this.videoUrl = videoUrl;
            this.file = file;
            this.emit("file", this.file);
            this.video.src = videoUrl;
            this.emit("video", this.video);
        }
    }
    start() {
        if (!this.video.duration) return (0, _utils.sleep)(1000).then(()=>this.start());
        const { width , number , begin , end  } = this.option;
        const height = this.video.videoHeight / this.video.videoWidth * width;
        this.option.height = height;
        this.option.begin = (0, _utils.clamp)(begin, 0, this.video.duration);
        this.option.end = (0, _utils.clamp)(end || this.video.duration, begin, this.video.duration);
        this.errorHandle(this.option.end > this.option.begin, `End time must be greater than the start time`);
        this.duration = this.option.end - this.option.begin;
        this.density = number / this.duration;
        this.errorHandle(this.file && this.video, "Please select the video file first");
        this.errorHandle(!this.processing, "There is currently a task in progress, please wait a moment...");
        this.errorHandle(this.density <= 1, `The preview density cannot be greater than 1, but got ${this.density}`);
        const screenshotDate = this.creatScreenshotDate();
        const canvas = this.creatCanvas();
        const context2D = canvas.getContext("2d");
        this.emit("canvas", canvas);
        const promiseList = screenshotDate.map((item, index)=>()=>{
                return new Promise((resolve)=>{
                    this.video.oncanplay = ()=>{
                        context2D.drawImage(this.video, item.x, item.y, width, height);
                        canvas.toBlob((blob)=>{
                            if (this.thumbnailUrl) URL.revokeObjectURL(this.thumbnailUrl);
                            this.thumbnailUrl = URL.createObjectURL(blob);
                            this.emit("update", this.thumbnailUrl, (index + 1) / number);
                            this.video.oncanplay = null;
                            resolve();
                        });
                    };
                    this.video.currentTime = item.time;
                });
            });
        this.processing = true;
        return (0, _utils.runPromisesInSeries)(promiseList).then(()=>{
            this.processing = false;
            this.emit("done");
        }).catch((err)=>{
            this.processing = false;
            this.emit("error", err.message);
            throw err;
        });
    }
    creatScreenshotDate() {
        const { number , width , height , column , begin  } = this.option;
        const timeGap = this.duration / number;
        const timePoints = [
            begin + timeGap
        ];
        while(timePoints.length < number){
            const last = timePoints[timePoints.length - 1];
            timePoints.push(last + timeGap);
        }
        return timePoints.map((item, index)=>({
                time: item - timeGap / 2,
                x: index % column * width,
                y: Math.floor(index / column) * height
            }));
    }
    creatCanvas() {
        const { number , width , height , column  } = this.option;
        const canvas = document.createElement("canvas");
        const context2D = canvas.getContext("2d");
        canvas.width = width * column;
        canvas.height = Math.ceil(number / column) * height + 30;
        context2D.fillStyle = "black";
        context2D.fillRect(0, 0, canvas.width, canvas.height);
        context2D.font = "14px Georgia";
        context2D.fillStyle = "#fff";
        context2D.fillText(`From: https://artplayer.org/, Number: ${number}, Width: ${width}, Height: ${height}, Column: ${column}`, 10, canvas.height - 11);
        return canvas;
    }
    download() {
        this.errorHandle(this.file && this.thumbnailUrl, "Download does not seem to be ready, please create preview first");
        this.errorHandle(!this.processing, "There is currently a task in progress, please wait a moment...");
        const elink = document.createElement("a");
        const name = `${(0, _utils.getFileName)(this.file.name)}.png`;
        elink.download = name;
        elink.href = this.thumbnailUrl;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
        this.emit("download", name);
        return this;
    }
    errorHandle(condition, msg) {
        if (!condition) {
            this.emit("error", msg);
            throw new Error(msg);
        }
    }
    destroy() {
        this.option.fileInput.removeEventListener("change", this.inputChange);
        this.option.fileInput.removeEventListener("dragover", ArtplayerToolThumbnail.ondragover);
        this.option.fileInput.removeEventListener("drop", ArtplayerToolThumbnail.ondrop);
        document.body.removeChild(this.video);
        if (this.videoUrl) URL.revokeObjectURL(this.videoUrl);
        if (this.thumbnailUrl) URL.revokeObjectURL(this.thumbnailUrl);
        this.emit("destroy");
    }
}
exports.default = ArtplayerToolThumbnail;
window["ArtplayerToolThumbnail"] = ArtplayerToolThumbnail;

},{"./emitter":"2ZQK0","./utils":"5vF3n","@parcel/transformer-js/src/esmodule-helpers.js":"8MjWm"}],"2ZQK0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Emitter {
    on(name, fn, ctx) {
        const e = this.e || (this.e = {});
        (e[name] || (e[name] = [])).push({
            fn,
            ctx
        });
        return this;
    }
    once(name, fn, ctx) {
        const self = this;
        function listener(...args) {
            self.off(name, listener);
            fn.apply(ctx, args);
        }
        listener._ = fn;
        return this.on(name, listener, ctx);
    }
    emit(name, ...data) {
        const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        for(let i = 0; i < evtArr.length; i += 1)evtArr[i].fn.apply(evtArr[i].ctx, data);
        return this;
    }
    off(name, callback) {
        const e = this.e || (this.e = {});
        const evts = e[name];
        const liveEvents = [];
        if (evts && callback) {
            for(let i = 0, len = evts.length; i < len; i += 1)if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
        }
        if (liveEvents.length) e[name] = liveEvents;
        else delete e[name];
        return this;
    }
}
exports.default = Emitter;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8MjWm"}],"8MjWm":[function(require,module,exports) {
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

},{}],"5vF3n":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "sleep", ()=>sleep);
parcelHelpers.export(exports, "runPromisesInSeries", ()=>runPromisesInSeries);
parcelHelpers.export(exports, "getFileName", ()=>getFileName);
parcelHelpers.export(exports, "clamp", ()=>clamp);
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function runPromisesInSeries(ps) {
    return ps.reduce((p, next)=>p.then(next), Promise.resolve());
}
function getFileName(name) {
    const nameArray = name.split(".");
    nameArray.pop();
    return nameArray.join(".");
}
function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8MjWm"}]},["gEVO5"], "gEVO5", "parcelRequire7b4c")

//# sourceMappingURL=index.js.map
