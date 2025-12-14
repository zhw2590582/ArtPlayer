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
})({"4J69a":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginChapter);
var _styleLess = require("bundle-text:./style.less");
var _styleLessDefault = parcelHelpers.interopDefault(_styleLess);
function artplayerPluginChapter(option = {}) {
    return (art)=>{
        const { $player } = art.template;
        const { setStyle, append, clamp, query, addClass, removeClass } = art.constructor.utils;
        const html = `
                <div class="art-chapter">
                    <div class="art-chapter-inner">
                        <div class="art-progress-hover"></div>
                        <div class="art-progress-loaded"></div>
                        <div class="art-progress-played"></div>
                    </div>
                </div>
        `;
        let $chapters = [];
        const $inner = art.query('.art-control-progress-inner');
        const $control = append($inner, '<div class="art-chapters"></div>');
        const $title = append($inner, '<div class="art-chapter-title"></div>');
        function showTitle({ $chapter, width }) {
            const title = $chapter.dataset.title.trim();
            if (title) {
                $title.textContent = title;
                const titleWidth = $title.clientWidth;
                if (width <= titleWidth / 2) setStyle($title, 'left', 0);
                else if (width > $inner.clientWidth - titleWidth / 2) setStyle($title, 'left', `${$inner.clientWidth - titleWidth}px`);
                else setStyle($title, 'left', `${width - titleWidth / 2}px`);
            }
        }
        function update(chapters = []) {
            $chapters = [];
            $control.textContent = '';
            removeClass($player, 'artplayer-plugin-chapter');
            if (!Array.isArray(chapters)) return;
            if (!chapters.length) return;
            if (!art.duration) return;
            chapters = chapters.sort((a, b)=>a.start - b.start);
            for(let i = 0; i < chapters.length; i++){
                const chapter = chapters[i];
                const nextChapter = chapters[i + 1];
                if (chapter.end === Infinity) chapter.end = art.duration;
                if (typeof chapter.start !== 'number' || typeof chapter.end !== 'number' || typeof chapter.title !== 'string') throw new TypeError('Illegal chapter data type');
                if (chapter.start < 0 || chapter.end > art.duration || chapter.start >= chapter.end) throw new Error('Illegal chapter time point');
                if (nextChapter && chapter.end > nextChapter.start) throw new Error('Illegal chapter time point');
            }
            if (chapters[0].start > 0) chapters.unshift({
                start: 0,
                end: chapters[0].start,
                title: ''
            });
            if (chapters[chapters.length - 1].end < art.duration) chapters.push({
                start: chapters[chapters.length - 1].end,
                end: art.duration,
                title: ''
            });
            for(let i = 0; i < chapters.length - 1; i++)if (chapters[i].end !== chapters[i + 1].start) chapters.splice(i + 1, 0, {
                start: chapters[i].end,
                end: chapters[i + 1].start,
                title: ''
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
                    $hover: query('.art-progress-hover', $chapter),
                    $loaded: query('.art-progress-loaded', $chapter),
                    $played: query('.art-progress-played', $chapter)
                };
            });
            addClass($player, 'artplayer-plugin-chapter');
            art.emit('setBar', 'loaded', art.loaded || 0);
        }
        art.on('setBar', (type, percentage)=>{
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
                const duration = Number.parseFloat($chapter.dataset.duration);
                const start = Number.parseFloat($chapter.dataset.start);
                const end = Number.parseFloat($chapter.dataset.end);
                if (currentTime < start) setStyle($target, 'width', 0);
                if (currentTime > end) setStyle($target, 'width', '100%');
                if (currentTime >= start && currentTime <= end) {
                    const percentage = (currentTime - start) / duration;
                    setStyle($target, 'width', `${percentage * 100}%`);
                    if (type === 'hover' && width > 0) showTitle({
                        $chapter,
                        width
                    });
                }
            }
        });
        art.once('video:loadedmetadata', ()=>update(option.chapters));
        return {
            name: 'artplayerPluginChapter',
            update: ({ chapters })=>update(chapters)
        };
    };
}
if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-chapter';
    let $style = document.getElementById(id);
    if (!$style) {
        $style = document.createElement('style');
        $style.id = id;
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>{
            document.head.appendChild($style);
        });
        else (document.head || document.documentElement).appendChild($style);
    }
    $style.textContent = (0, _styleLessDefault.default);
}
if (typeof window !== 'undefined') window.artplayerPluginChapter = artplayerPluginChapter;

},{"bundle-text:./style.less":"fshgG","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"fshgG":[function(require,module,exports,__globalThis) {
module.exports = ".artplayer-plugin-chapter .art-control-progress-inner {\n  background-color: #0000 !important;\n  height: 100% !important;\n}\n\n.artplayer-plugin-chapter .art-control-progress-inner > .art-progress-hover, .artplayer-plugin-chapter .art-control-progress-inner > .art-progress-loaded, .artplayer-plugin-chapter .art-control-progress-inner > .art-progress-played {\n  display: none !important;\n}\n\n.artplayer-plugin-chapter .art-control-thumbnails {\n  bottom: calc(var(--art-bottom-gap)  + 64px) !important;\n}\n\n.artplayer-plugin-chapter .art-chapters {\n  z-index: 0;\n  align-items: center;\n  gap: 4px;\n  height: 100%;\n  display: flex;\n  position: absolute;\n  inset: 0;\n  transform: scaleY(1.25);\n}\n\n.artplayer-plugin-chapter .art-chapters .art-chapter {\n  align-items: center;\n  height: 100%;\n  display: flex;\n}\n\n.artplayer-plugin-chapter .art-chapters .art-chapter .art-chapter-inner {\n  cursor: pointer;\n  width: 100%;\n  height: 50%;\n  transition: height var(--art-transition-duration) ease;\n  background-color: var(--art-progress-color);\n  border-radius: 10px;\n  position: relative;\n  overflow: hidden;\n}\n\n.artplayer-plugin-chapter .art-chapters .art-chapter:hover .art-chapter-inner {\n  height: 100%;\n}\n\n.artplayer-plugin-chapter .art-chapter-title {\n  transform-origin: bottom;\n  opacity: 0;\n  z-index: 70;\n  border-radius: var(--art-border-radius);\n  white-space: nowrap;\n  background-color: var(--art-tip-background);\n  transition: transform var(--art-transition-duration) ease, opacity var(--art-transition-duration) ease;\n  padding: 3px 5px;\n  font-size: 14px;\n  line-height: 1;\n  position: absolute;\n  top: -50px;\n  left: 0;\n  transform: scale(.5);\n}\n\n.artplayer-plugin-chapter.art-progress-hover .art-chapter-title {\n  opacity: 1;\n  transform: scale(1);\n}\n";

},{}],"8oCsH":[function(require,module,exports,__globalThis) {
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

},{}]},["4J69a"], "4J69a", "parcelRequire4dc0", {})

//# sourceMappingURL=index.js.map
