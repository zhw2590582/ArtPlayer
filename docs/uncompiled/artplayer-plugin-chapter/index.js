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
})({"4OysR":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginChapter);
var _styleLess = require("bundle-text:./style.less");
var _styleLessDefault = parcelHelpers.interopDefault(_styleLess);
function artplayerPluginChapter(option = {}) {
    return (art)=>{
        const { $player } = art.template;
        const { setStyle, append, clamp, query, isMobile, addClass, removeClass } = art.constructor.utils;
        const html = `
                <div class="art-chapter">
                    <div class="art-chapter-inner">
                        <div class="art-progress-hover"></div>
                        <div class="art-progress-loaded"></div>
                        <div class="art-progress-played"></div>
                    </div>
                </div>
        `;
        let titleTimer = null;
        let $chapters = [];
        const $progress = art.query(".art-control-progress");
        const $inner = art.query(".art-control-progress-inner");
        const $control = append($inner, '<div class="art-chapters"></div>');
        const $title = append($inner, '<div class="art-chapter-title"></div>');
        function showTitle({ $chapter, width }) {
            const title = $chapter.dataset.title.trim();
            if (title) {
                setStyle($title, "display", "flex");
                $title.innerText = title;
                const titleWidth = $title.clientWidth;
                if (width <= titleWidth / 2) setStyle($title, "left", 0);
                else if (width > $inner.clientWidth - titleWidth / 2) setStyle($title, "left", `${$inner.clientWidth - titleWidth}px`);
                else setStyle($title, "left", `${width - titleWidth / 2}px`);
            } else setStyle($title, "display", "none");
        }
        function update(chapters = []) {
            $chapters = [];
            $control.innerText = "";
            removeClass($player, "artplayer-plugin-chapter");
            if (!Array.isArray(chapters)) return;
            if (!chapters.length) return;
            if (!art.duration) return;
            chapters = chapters.sort((a, b)=>a.start - b.start);
            for(let i = 0; i < chapters.length; i++){
                const chapter = chapters[i];
                const nextChapter = chapters[i + 1];
                if (chapter.end === Infinity) chapter.end = art.duration;
                if (typeof chapter.start !== "number" || typeof chapter.end !== "number" || typeof chapter.title !== "string") throw new Error("Illegal chapter data type");
                if (chapter.start < 0 || chapter.end > art.duration || chapter.start >= chapter.end) throw new Error("Illegal chapter time point");
                if (nextChapter && chapter.end > nextChapter.start) throw new Error("Illegal chapter time point");
            }
            if (chapters[0].start > 0) chapters.unshift({
                start: 0,
                end: chapters[0].start,
                title: ""
            });
            if (chapters[chapters.length - 1].end < art.duration) chapters.push({
                start: chapters[chapters.length - 1].end,
                end: art.duration,
                title: ""
            });
            for(let i = 0; i < chapters.length - 1; i++)if (chapters[i].end !== chapters[i + 1].start) chapters.splice(i + 1, 0, {
                start: chapters[i].end,
                end: chapters[i + 1].start,
                title: ""
            });
            $chapters = chapters.map((chapter)=>{
                const $chapter = append($control, html);
                const start = clamp(chapter.start, 0, art.duration);
                const end = clamp(chapter.end, 0, art.duration);
                const duration = end - start;
                const percentage = duration / art.duration;
                $chapter.dataset.start = start;
                $chapter.dataset.end = end;
                $chapter.dataset.duration = duration;
                $chapter.dataset.title = chapter.title.trim();
                $chapter.style.width = `${percentage * 100}%`;
                return {
                    $chapter,
                    $hover: query(".art-progress-hover", $chapter),
                    $loaded: query(".art-progress-loaded", $chapter),
                    $played: query(".art-progress-played", $chapter)
                };
            });
            addClass($player, "artplayer-plugin-chapter");
            art.emit("setBar", "loaded", art.loaded || 0);
        }
        art.on("setBar", (type, percentage, event)=>{
            if (!$chapters.length) return;
            for(let i = 0; i < $chapters.length; i++){
                const { $chapter, $loaded, $played, $hover } = $chapters[i];
                const $target = {
                    hover: $hover,
                    loaded: $loaded,
                    played: $played
                }[type];
                if (!$target) return;
                const width = $control.clientWidth * percentage;
                const currentTime = art.duration * percentage;
                const duration = parseFloat($chapter.dataset.duration);
                const start = parseFloat($chapter.dataset.start);
                const end = parseFloat($chapter.dataset.end);
                if (currentTime < start) setStyle($target, "width", 0);
                if (currentTime > end) setStyle($target, "width", "100%");
                if (currentTime >= start && currentTime <= end) {
                    const percentage = (currentTime - start) / duration;
                    setStyle($target, "width", `${percentage * 100}%`);
                    if (isMobile) {
                        if (type === "played" && event) {
                            showTitle({
                                $chapter,
                                width
                            });
                            clearTimeout(titleTimer);
                            titleTimer = setTimeout(()=>{
                                setStyle($title, "display", "none");
                            }, 500);
                        }
                    } else if (type === "hover") showTitle({
                        $chapter,
                        width
                    });
                }
            }
        });
        if (!isMobile) art.proxy($progress, "mouseleave", ()=>{
            if (!$chapters.length) return;
            setStyle($title, "display", "none");
        });
        art.once("video:loadedmetadata", ()=>update(option.chapters));
        return {
            name: "artplayerPluginChapter",
            update: ({ chapters })=>update(chapters)
        };
    };
}
if (typeof document !== "undefined") {
    const id = "artplayer-plugin-chapter";
    let $style = document.getElementById(id);
    if (!$style) {
        $style = document.createElement("style");
        $style.id = id;
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ()=>{
            document.head.appendChild($style);
        });
        else (document.head || document.documentElement).appendChild($style);
    }
    $style.textContent = (0, _styleLessDefault.default);
}
if (typeof window !== "undefined") window["artplayerPluginChapter"] = artplayerPluginChapter;

},{"bundle-text:./style.less":"8SOjD","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"8SOjD":[function(require,module,exports) {
module.exports = ".artplayer-plugin-chapter .art-control-progress-inner {\n  background-color: #0000 !important;\n  height: 100% !important;\n}\n\n.artplayer-plugin-chapter .art-control-progress-inner > .art-progress-hover, .artplayer-plugin-chapter .art-control-progress-inner > .art-progress-loaded, .artplayer-plugin-chapter .art-control-progress-inner > .art-progress-played {\n  display: none !important;\n}\n\n.artplayer-plugin-chapter .art-control-thumbnails {\n  bottom: calc(var(--art-bottom-gap)  + 64px) !important;\n}\n\n.artplayer-plugin-chapter .art-chapters {\n  z-index: 0;\n  align-items: center;\n  gap: 4px;\n  height: 100%;\n  display: flex;\n  position: absolute;\n  inset: 0;\n  transform: scaleY(1.25);\n}\n\n.artplayer-plugin-chapter .art-chapters .art-chapter {\n  align-items: center;\n  height: 100%;\n  display: flex;\n}\n\n.artplayer-plugin-chapter .art-chapters .art-chapter .art-chapter-inner {\n  cursor: pointer;\n  transition: height var(--art-transition-duration) ease;\n  background-color: var(--art-progress-color);\n  border-radius: 10px;\n  width: 100%;\n  height: 50%;\n  position: relative;\n  overflow: hidden;\n}\n\n.artplayer-plugin-chapter .art-chapters .art-chapter:hover .art-chapter-inner {\n  height: 100%;\n}\n\n.artplayer-plugin-chapter .art-chapter-title {\n  z-index: 70;\n  border-radius: var(--art-border-radius);\n  white-space: nowrap;\n  background-color: var(--art-tip-background);\n  padding: 3px 5px;\n  font-size: 14px;\n  line-height: 1;\n  display: none;\n  position: absolute;\n  top: -50px;\n  left: 0;\n}\n";

},{}],"5dUr6":[function(require,module,exports) {
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

},{}]},["4OysR"], "4OysR", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
