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
})({"1gq8W":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginVttThumbnail);
var _getVttArray = require("./getVttArray");
var _getVttArrayDefault = parcelHelpers.interopDefault(_getVttArray);
function artplayerPluginVttThumbnail(option) {
    return async (art)=>{
        const { constructor: { utils: { setStyle, isMobile, addClass } }, template: { $progress } } = art;
        let timer = null;
        const thumbnails = await (0, _getVttArrayDefault.default)(option.vtt);
        function showThumbnails($control, find, width) {
            setStyle($control, "backgroundImage", `url(${find.url})`);
            setStyle($control, "height", `${find.h}px`);
            setStyle($control, "width", `${find.w}px`);
            setStyle($control, "backgroundPosition", `-${find.x}px -${find.y}px`);
            if (width <= find.w / 2) setStyle($control, "left", 0);
            else if (width > $progress.clientWidth - find.w / 2) setStyle($control, "left", `${$progress.clientWidth - find.w}px`);
            else setStyle($control, "left", `${width - find.w / 2}px`);
        }
        art.controls.add({
            name: "vtt-thumbnail",
            position: "top",
            index: 20,
            style: option.style || {},
            mounted ($control) {
                addClass($control, "art-control-thumbnails");
                art.on("setBar", async (type, percentage, event)=>{
                    const isMobileDroging = type === "played" && event && isMobile;
                    if (type === "hover" || isMobileDroging) {
                        const width = $progress.clientWidth * percentage;
                        const second = percentage * art.duration;
                        setStyle($control, "display", "flex");
                        const find = thumbnails.find((item)=>second >= item.start && second <= item.end);
                        if (!find) return setStyle($control, "display", "none");
                        if (width > 0 && width < $progress.clientWidth) showThumbnails($control, find, width);
                        else if (!isMobile) setStyle($control, "display", "none");
                        if (isMobileDroging) {
                            clearTimeout(timer);
                            timer = setTimeout(()=>{
                                setStyle($control, "display", "none");
                            }, 500);
                        }
                    }
                });
            }
        });
        return {
            name: "artplayerPluginVttThumbnail"
        };
    };
}
if (typeof window !== "undefined") window["artplayerPluginVttThumbnail"] = artplayerPluginVttThumbnail;

},{"./getVttArray":"gSM1I","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"gSM1I":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>getVttArray);
function padEnd(str, targetLength, padString) {
    if (str.length > targetLength) return String(str);
    else {
        targetLength = targetLength - str.length;
        if (targetLength > padString.length) padString += padString.repeat(targetLength / padString.length);
        return String(str) + padString.slice(0, targetLength);
    }
}
function t2d(time) {
    var arr = time.split(".");
    var left = arr[0].split(":") || [];
    var right = padEnd(arr[1] || "0", 3, "0");
    var ms = Number(right) / 1000;
    var h = Number(left[left.length - 3] || 0) * 3600;
    var m = Number(left[left.length - 2] || 0) * 60;
    var s = Number(left[left.length - 1] || 0);
    return h + m + s + ms;
}
async function getVttArray(vttUrl = "") {
    const vttString = await (await fetch(vttUrl)).text();
    const lines = vttString.split(/[\n\r]/gm).filter((item)=>item.trim());
    const vttArray = [];
    for(let i = 1; i < lines.length; i += 2){
        const time = lines[i];
        const text = lines[i + 1];
        if (!text.trim()) continue;
        const timeReg = /((?:[0-9]{2}:)?(?:[0-9]{2}:)?[0-9]{2}(?:.[0-9]{3})?)(?: ?--> ?)((?:[0-9]{2}:)?(?:[0-9]{2}:)?[0-9]{2}(?:.[0-9]{3})?)/;
        const timeMatch = time.match(timeReg);
        const textReg = /(.*)#(\w{4})=(.*)/i;
        const textMatch = text.match(textReg);
        const start = Math.floor(t2d(timeMatch[1]));
        const end = Math.floor(t2d(timeMatch[2]));
        let url = textMatch[1];
        const isAbsoluteUrl = /^\/|((https?|ftp|file):\/\/)/i.test(url);
        if (!isAbsoluteUrl) {
            const urlArr = vttUrl.split("/");
            urlArr.pop();
            urlArr.push(url);
            url = urlArr.join("/");
        }
        const result = {
            start,
            end,
            url
        };
        const keys = textMatch[2].split("");
        const values = textMatch[3].split(",");
        for(let j = 0; j < keys.length; j++)result[keys[j]] = values[j];
        vttArray.push(result);
    }
    return vttArray;
}

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

},{}]},["1gq8W"], "1gq8W", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
