var Artplayer = (function() {
  "use strict";
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var optionValidator$1 = { exports: {} };
  var optionValidator = optionValidator$1.exports;
  var hasRequiredOptionValidator;
  function requireOptionValidator() {
    if (hasRequiredOptionValidator) return optionValidator$1.exports;
    hasRequiredOptionValidator = 1;
    (function(module, exports$1) {
      !(function(r, t) {
        module.exports = t();
      })(optionValidator, function() {
        function e(r) {
          return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r2) {
            return typeof r2;
          } : function(r2) {
            return r2 && "function" == typeof Symbol && r2.constructor === Symbol && r2 !== Symbol.prototype ? "symbol" : typeof r2;
          })(r);
        }
        var n2 = Object.prototype.toString, c = function(r) {
          if (void 0 === r) return "undefined";
          if (null === r) return "null";
          var t = e(r);
          if ("boolean" === t) return "boolean";
          if ("string" === t) return "string";
          if ("number" === t) return "number";
          if ("symbol" === t) return "symbol";
          if ("function" === t) return (function(r2) {
            return "GeneratorFunction" === o2(r2);
          })(r) ? "generatorfunction" : "function";
          if ((function(r2) {
            return Array.isArray ? Array.isArray(r2) : r2 instanceof Array;
          })(r)) return "array";
          if ((function(r2) {
            if (r2.constructor && "function" == typeof r2.constructor.isBuffer) return r2.constructor.isBuffer(r2);
            return false;
          })(r)) return "buffer";
          if ((function(r2) {
            try {
              if ("number" == typeof r2.length && "function" == typeof r2.callee) return true;
            } catch (r3) {
              if (-1 !== r3.message.indexOf("callee")) return true;
            }
            return false;
          })(r)) return "arguments";
          if ((function(r2) {
            return r2 instanceof Date || "function" == typeof r2.toDateString && "function" == typeof r2.getDate && "function" == typeof r2.setDate;
          })(r)) return "date";
          if ((function(r2) {
            return r2 instanceof Error || "string" == typeof r2.message && r2.constructor && "number" == typeof r2.constructor.stackTraceLimit;
          })(r)) return "error";
          if ((function(r2) {
            return r2 instanceof RegExp || "string" == typeof r2.flags && "boolean" == typeof r2.ignoreCase && "boolean" == typeof r2.multiline && "boolean" == typeof r2.global;
          })(r)) return "regexp";
          switch (o2(r)) {
            case "Symbol":
              return "symbol";
            case "Promise":
              return "promise";
            case "WeakMap":
              return "weakmap";
            case "WeakSet":
              return "weakset";
            case "Map":
              return "map";
            case "Set":
              return "set";
            case "Int8Array":
              return "int8array";
            case "Uint8Array":
              return "uint8array";
            case "Uint8ClampedArray":
              return "uint8clampedarray";
            case "Int16Array":
              return "int16array";
            case "Uint16Array":
              return "uint16array";
            case "Int32Array":
              return "int32array";
            case "Uint32Array":
              return "uint32array";
            case "Float32Array":
              return "float32array";
            case "Float64Array":
              return "float64array";
          }
          if ((function(r2) {
            return "function" == typeof r2.throw && "function" == typeof r2.return && "function" == typeof r2.next;
          })(r)) return "generator";
          switch (t = n2.call(r)) {
            case "[object Object]":
              return "object";
            case "[object Map Iterator]":
              return "mapiterator";
            case "[object Set Iterator]":
              return "setiterator";
            case "[object String Iterator]":
              return "stringiterator";
            case "[object Array Iterator]":
              return "arrayiterator";
          }
          return t.slice(8, -1).toLowerCase().replace(/\s/g, "");
        };
        function o2(r) {
          return r.constructor ? r.constructor.name : null;
        }
        function f2(r, t) {
          var e2 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : ["option"];
          return s2(r, t, e2), y(r, t, e2), (function(a2, i, u) {
            var r2 = c(i), t2 = c(a2);
            if ("object" === r2) {
              if ("object" !== t2) throw new Error("[Type Error]: '".concat(u.join("."), "' require 'object' type, but got '").concat(t2, "'"));
              Object.keys(i).forEach(function(r3) {
                var t3 = a2[r3], e3 = i[r3], n3 = u.slice();
                n3.push(r3), s2(t3, e3, n3), y(t3, e3, n3), f2(t3, e3, n3);
              });
            }
            if ("array" === r2) {
              if ("array" !== t2) throw new Error("[Type Error]: '".concat(u.join("."), "' require 'array' type, but got '").concat(t2, "'"));
              a2.forEach(function(r3, t3) {
                var e3 = a2[t3], n3 = i[t3] || i[0], o3 = u.slice();
                o3.push(t3), s2(e3, n3, o3), y(e3, n3, o3), f2(e3, n3, o3);
              });
            }
          })(r, t, e2), r;
        }
        function s2(r, t, e2) {
          if ("string" === c(t)) {
            var n3 = c(r);
            if ("?" === t[0] && (t = t.slice(1) + "|undefined"), !(-1 < t.indexOf("|") ? t.split("|").map(function(r2) {
              return r2.toLowerCase().trim();
            }).filter(Boolean).some(function(r2) {
              return n3 === r2;
            }) : t.toLowerCase().trim() === n3)) throw new Error("[Type Error]: '".concat(e2.join("."), "' require '").concat(t, "' type, but got '").concat(n3, "'"));
          }
        }
        function y(r, t, e2) {
          if ("function" === c(t)) {
            var n3 = t(r, c(r), e2);
            if (true !== n3) {
              var o3 = c(n3);
              throw "string" === o3 ? new Error(n3) : "error" === o3 ? n3 : new Error("[Validator Error]: The scheme for '".concat(e2.join("."), "' validator require return true, but got '").concat(n3, "'"));
            }
          }
        }
        return f2.kindOf = c, f2;
      });
    })(optionValidator$1);
    return optionValidator$1.exports;
  }
  var optionValidatorExports = requireOptionValidator();
  const validator = /* @__PURE__ */ getDefaultExportFromCjs(optionValidatorExports);
  const version$1 = "5.4.1";
  const config$1 = {
    properties: [
      "audioTracks",
      "autoplay",
      "buffered",
      "controller",
      "controls",
      "crossOrigin",
      "currentSrc",
      "currentTime",
      "defaultMuted",
      "defaultPlaybackRate",
      "duration",
      "ended",
      "error",
      "loop",
      "mediaGroup",
      "muted",
      "networkState",
      "paused",
      "playbackRate",
      "played",
      "preload",
      "readyState",
      "seekable",
      "seeking",
      "src",
      "startDate",
      "textTracks",
      "videoTracks",
      "volume"
    ],
    methods: ["addTextTrack", "canPlayType", "load", "play", "pause"],
    events: [
      "abort",
      "canplay",
      "canplaythrough",
      "durationchange",
      "emptied",
      "ended",
      "error",
      "loadeddata",
      "loadedmetadata",
      "loadstart",
      "pause",
      "play",
      "playing",
      "progress",
      "ratechange",
      "seeked",
      "seeking",
      "stalled",
      "suspend",
      "timeupdate",
      "volumechange",
      "waiting"
    ],
    prototypes: [
      "width",
      "height",
      "videoWidth",
      "videoHeight",
      "poster",
      "webkitDecodedFrameCount",
      "webkitDroppedFrameCount",
      "playsInline",
      "webkitSupportsFullscreen",
      "webkitDisplayingFullscreen",
      "onenterpictureinpicture",
      "onleavepictureinpicture",
      "disablePictureInPicture",
      "cancelVideoFrameCallback",
      "requestVideoFrameCallback",
      "getVideoPlaybackQuality",
      "requestPictureInPicture",
      "webkitEnterFullScreen",
      "webkitEnterFullscreen",
      "webkitExitFullScreen",
      "webkitExitFullscreen"
    ]
  };
  const userAgent = globalThis?.CUSTOM_USER_AGENT ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  const isSafari = /^(?:(?!chrome|android).)*safari/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream;
  const isIOS13 = isIOS || userAgent.includes("Macintosh") && navigator.maxTouchPoints >= 1;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || isIOS13;
  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  function query(selector, parent = document) {
    return parent.querySelector(selector);
  }
  function queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }
  function addClass(target, className) {
    return target.classList.add(className);
  }
  function removeClass(target, className) {
    return target.classList.remove(className);
  }
  function hasClass(target, className) {
    return target.classList.contains(className);
  }
  function append(parent, child) {
    if (child instanceof Element) {
      parent.appendChild(child);
    } else {
      parent.insertAdjacentHTML("beforeend", String(child));
    }
    return parent.lastElementChild || parent.lastChild;
  }
  function remove(child) {
    return child.parentNode.removeChild(child);
  }
  function setStyle(element, key, value) {
    element.style[key] = value;
    return element;
  }
  function setStyles(element, styles) {
    for (const key in styles) {
      setStyle(element, key, styles[key]);
    }
    return element;
  }
  function getStyle(element, key, numberType = true) {
    const value = window.getComputedStyle(element, null).getPropertyValue(key);
    return numberType ? Number.parseFloat(value) : value;
  }
  function siblings(target) {
    return Array.from(target.parentElement.children).filter((item) => item !== target);
  }
  function inverseClass(target, className) {
    siblings(target).forEach((item) => removeClass(item, className));
    addClass(target, className);
  }
  function tooltip(target, msg, pos = "top") {
    if (isMobile)
      return;
    target.setAttribute("aria-label", msg);
    addClass(target, "hint--rounded");
    addClass(target, `hint--${pos}`);
  }
  function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top - offset <= windowHeight && rect.top + rect.height + offset >= 0;
    const horInView = rect.left - offset <= windowWidth + offset && rect.left + rect.width + offset >= 0;
    return vertInView && horInView;
  }
  function includeFromEvent(event, target) {
    return getComposedPath(event).includes(target);
  }
  function replaceElement(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
    return newChild;
  }
  function createElement(tag) {
    return document.createElement(tag);
  }
  function getIcon(key = "", html = "") {
    const icon = createElement("i");
    addClass(icon, "art-icon");
    addClass(icon, `art-icon-${key}`);
    append(icon, html);
    return icon;
  }
  function setStyleText(id2, style2) {
    let $style = document.getElementById(id2);
    if (!$style) {
      $style = document.createElement("style");
      $style.id = id2;
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          document.head.appendChild($style);
        });
      } else {
        (document.head || document.documentElement).appendChild($style);
      }
    }
    $style.textContent = style2;
  }
  function supportsFlex() {
    const div = document.createElement("div");
    div.style.display = "flex";
    return div.style.display === "flex";
  }
  function getRect(el) {
    return el.getBoundingClientRect();
  }
  function loadImg(url, scale) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function() {
        if (!scale || scale === 1) {
          resolve(img);
        } else {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const scaledImg = new Image();
            scaledImg.onload = function() {
              resolve(scaledImg);
            };
            scaledImg.onerror = function() {
              URL.revokeObjectURL(blobUrl);
              reject(new Error(`Image load failed: ${url}`));
            };
            scaledImg.src = blobUrl;
          });
        }
      };
      img.onerror = function() {
        reject(new Error(`Image load failed: ${url}`));
      };
      img.src = url;
    });
  }
  function getComposedPath(event) {
    if (event.composedPath)
      return event.composedPath();
    const path = [];
    let node = event.target;
    while (node) {
      path.push(node);
      node = node.parentNode;
    }
    if (!path.includes(window) && window !== void 0) {
      path.push(window);
    }
    return path;
  }
  function getSafeAreaInsets() {
    const div = document.createElement("div");
    div.style.cssText = "position:fixed;top:env(safe-area-inset-top,0px);right:env(safe-area-inset-right,0px);bottom:env(safe-area-inset-bottom,0px);left:env(safe-area-inset-left,0px);pointer-events:none;visibility:hidden;";
    document.body.appendChild(div);
    const style2 = getComputedStyle(div);
    const insets = {
      top: Number.parseFloat(style2.top) || 0,
      right: Number.parseFloat(style2.right) || 0,
      bottom: Number.parseFloat(style2.bottom) || 0,
      left: Number.parseFloat(style2.left) || 0
    };
    div.remove();
    return insets;
  }
  class ArtPlayerError extends Error {
    constructor(message, context) {
      super(message);
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, context || this.constructor);
      }
      this.name = "ArtPlayerError";
    }
  }
  function errorHandle(condition, msg) {
    if (!condition) {
      throw new ArtPlayerError(msg);
    }
    return condition;
  }
  function getExt(url) {
    if (url.includes("?")) {
      return getExt(url.split("?")[0]);
    }
    if (url.includes("#")) {
      return getExt(url.split("#")[0]);
    }
    return url.trim().toLowerCase().split(".").pop();
  }
  function download(url, name) {
    const elink = document.createElement("a");
    elink.style.display = "none";
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }
  function clamp(num, a2, b2) {
    return Math.max(Math.min(num, Math.max(a2, b2)), Math.min(a2, b2));
  }
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function secondToTime(second) {
    if (!second)
      return "00:00";
    const add0 = (num) => num < 10 ? `0${num}` : String(num);
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    const sec = Math.floor(second - hour * 3600 - min * 60);
    return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(":");
  }
  function escape(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      })[tag] || tag
    );
  }
  function unescape(str) {
    const map = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&#39;": "'",
      "&quot;": '"'
    };
    const reg = new RegExp(`(${Object.keys(map).join("|")})`, "g");
    return str.replace(reg, (tag) => map[tag] || tag);
  }
  const def = Object.defineProperty;
  const { hasOwnProperty } = Object.prototype;
  function has(obj, name) {
    return hasOwnProperty.call(obj, name);
  }
  function get(obj, name) {
    return Object.getOwnPropertyDescriptor(obj, name);
  }
  function mergeDeep(...objects) {
    const isObject = (item) => item && typeof item === "object" && !Array.isArray(item);
    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });
      return prev;
    }, {});
  }
  function fixSrt(srt) {
    return srt.replace(/(\d\d:\d\d:\d\d)[,.](\d+)/g, (_, $1, $2) => {
      let ms = $2.slice(0, 3);
      if ($2.length === 1) {
        ms = `${$2}00`;
      }
      if ($2.length === 2) {
        ms = `${$2}0`;
      }
      return `${$1},${ms}`;
    });
  }
  function srtToVtt(srtText) {
    return "WEBVTT \r\n\r\n".concat(
      fixSrt(srtText).replace(/\{\\([ibu])\}/g, "</$1>").replace(/\{\\([ibu])1\}/g, "<$1>").replace(/\{([ibu])\}/g, "<$1>").replace(/\{\/([ibu])\}/g, "</$1>").replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, "$1.$2").replace(/\{[\s\S]*?\}/g, "").concat("\r\n\r\n")
    );
  }
  function vttToBlob(vttText) {
    return URL.createObjectURL(
      new Blob([vttText], {
        type: "text/vtt"
      })
    );
  }
  function assToVtt(ass) {
    const reAss = new RegExp(
      "Dialogue:\\s\\d,(\\d+:\\d\\d:\\d\\d.\\d\\d),(\\d+:\\d\\d:\\d\\d.\\d\\d),([^,]*),([^,]*),(?:[^,]*,){4}([\\s\\S]*)$",
      "i"
    );
    function fixTime(time2 = "") {
      return time2.split(/[:.]/).map((item, index, arr) => {
        if (index === arr.length - 1) {
          if (item.length === 1) {
            return `.${item}00`;
          }
          if (item.length === 2) {
            return `.${item}0`;
          }
        } else if (item.length === 1) {
          return (index === 0 ? "0" : ":0") + item;
        }
        return index === 0 ? item : index === arr.length - 1 ? `.${item}` : `:${item}`;
      }).join("");
    }
    return `WEBVTT

${ass.split(/\r?\n/).map((line) => {
      const m = line.match(reAss);
      if (!m)
        return null;
      return {
        start: fixTime(m[1].trim()),
        end: fixTime(m[2].trim()),
        text: m[5].replace(/\{[\s\S]*?\}/g, "").replace(/(\\N)/g, "\n").trim().split(/\r?\n/).map((item) => item.trim()).join("\n")
      };
    }).filter((line) => line).map((line, index) => {
      if (line) {
        return `${index + 1}
${line.start} --> ${line.end}
${line.text}`;
      }
      return "";
    }).filter((line) => line.trim()).join("\n\n")}`;
  }
  function sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function debounce(func, duration) {
    let timeout;
    return function(...args) {
      const effect = () => {
        timeout = null;
        return func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(effect, duration);
    };
  }
  function throttle(func, duration) {
    let shouldWait = false;
    return function(...args) {
      if (!shouldWait) {
        func.apply(this, args);
        shouldWait = true;
        setTimeout(() => {
          shouldWait = false;
        }, duration);
      }
    };
  }
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    ArtPlayerError,
    addClass,
    append,
    assToVtt,
    capitalize,
    clamp,
    createElement,
    debounce,
    def,
    download,
    errorHandle,
    escape,
    get,
    getComposedPath,
    getExt,
    getIcon,
    getRect,
    getSafeAreaInsets,
    getStyle,
    has,
    hasClass,
    includeFromEvent,
    inverseClass,
    isBrowser,
    isIOS,
    isIOS13,
    isInViewport,
    isMobile,
    isSafari,
    loadImg,
    mergeDeep,
    query,
    queryAll,
    remove,
    removeClass,
    replaceElement,
    secondToTime,
    setStyle,
    setStyleText,
    setStyles,
    siblings,
    sleep,
    srtToVtt,
    supportsFlex,
    throttle,
    tooltip,
    unescape,
    userAgent,
    vttToBlob
  }, Symbol.toStringTag, { value: "Module" }));
  const a = "array";
  const b = "boolean";
  const s = "string";
  const n = "number";
  const o = "object";
  const f = "function";
  function validElement(value, type, paths) {
    return errorHandle(
      type === s || type === n || value instanceof Element,
      `${paths.join(".")} require '${s}' or 'Element' type`
    );
  }
  const ComponentOption = {
    html: validElement,
    disable: `?${b}`,
    name: `?${s}`,
    index: `?${n}`,
    style: `?${o}`,
    click: `?${f}`,
    mounted: `?${f}`,
    tooltip: `?${s}|${n}`,
    width: `?${n}`,
    selector: `?${a}`,
    onSelect: `?${f}`,
    switch: `?${b}`,
    onSwitch: `?${f}`,
    range: `?${a}`,
    onRange: `?${f}`,
    onChange: `?${f}`
  };
  const scheme = {
    id: s,
    container: validElement,
    url: s,
    poster: s,
    type: s,
    theme: s,
    lang: s,
    volume: n,
    isLive: b,
    muted: b,
    autoplay: b,
    autoSize: b,
    autoMini: b,
    loop: b,
    flip: b,
    playbackRate: b,
    aspectRatio: b,
    screenshot: b,
    setting: b,
    hotkey: b,
    pip: b,
    mutex: b,
    backdrop: b,
    fullscreen: b,
    fullscreenWeb: b,
    subtitleOffset: b,
    miniProgressBar: b,
    useSSR: b,
    playsInline: b,
    lock: b,
    gesture: b,
    fastForward: b,
    autoPlayback: b,
    autoOrientation: b,
    airplay: b,
    proxy: `?${f}`,
    plugins: [f],
    layers: [ComponentOption],
    contextmenu: [ComponentOption],
    settings: [ComponentOption],
    controls: [
      {
        ...ComponentOption,
        position: (value, _, paths) => {
          const position = ["top", "left", "right"];
          return errorHandle(
            position.includes(value),
            `${paths.join(".")} only accept ${position.toString()} as parameters`
          );
        }
      }
    ],
    quality: [
      {
        default: `?${b}`,
        html: s,
        url: s
      }
    ],
    highlight: [
      {
        time: n,
        text: s
      }
    ],
    thumbnails: {
      url: s,
      number: n,
      column: n,
      width: n,
      height: n,
      scale: n
    },
    subtitle: {
      url: s,
      name: s,
      type: s,
      style: o,
      escape: b,
      encoding: s,
      onVttLoad: f
    },
    moreVideoAttr: o,
    i18n: o,
    icons: o,
    cssVar: o,
    customType: o
  };
  class Component {
    constructor(art) {
      this.id = 0;
      this.art = art;
      this.cache = /* @__PURE__ */ new Map();
      this.add = this.add.bind(this);
      this.remove = this.remove.bind(this);
      this.update = this.update.bind(this);
    }
    get show() {
      return hasClass(this.art.template.$player, `art-${this.name}-show`);
    }
    set show(value) {
      const { $player } = this.art.template;
      const className = `art-${this.name}-show`;
      if (value) {
        addClass($player, className);
      } else {
        removeClass($player, className);
      }
      this.art.emit(this.name, value);
    }
    toggle() {
      this.show = !this.show;
    }
    add(getOption) {
      const option = typeof getOption === "function" ? getOption(this.art) : getOption;
      option.html = option.html || "";
      validator(option, ComponentOption);
      if (!this.$parent || !this.name || option.disable)
        return;
      const name = option.name || `${this.name}${this.id}`;
      errorHandle(!this.cache.has(name), `Can't add an existing [${name}] to the [${this.name}]`);
      this.id += 1;
      const $ref = createElement("div");
      addClass($ref, `art-${this.name}`);
      addClass($ref, `art-${this.name}-${name}`);
      const childs = Array.from(this.$parent.children);
      $ref.dataset.index = option.index || this.id;
      const nextChild = childs.find((item) => Number(item.dataset.index) >= Number($ref.dataset.index));
      if (nextChild) {
        nextChild.insertAdjacentElement("beforebegin", $ref);
      } else {
        append(this.$parent, $ref);
      }
      if (option.html) {
        append($ref, option.html);
      }
      if (option.style) {
        setStyles($ref, option.style);
      }
      if (option.tooltip) {
        tooltip($ref, option.tooltip);
      }
      const events = [];
      if (option.click) {
        const destroyEvent = this.art.events.proxy($ref, "click", (event) => {
          event.preventDefault();
          option.click.call(this.art, this, event);
        });
        events.push(destroyEvent);
      }
      if (option.selector && ["left", "right"].includes(option.position)) {
        this.selector(option, $ref, events);
      }
      this[name] = $ref;
      this.cache.set(name, { $ref, events, option });
      if (option.mounted) {
        option.mounted.call(this.art, $ref);
      }
      return $ref;
    }
    remove(name) {
      errorHandle(this.cache.has(name), `Can't find [${name}] from the [${this.name}]`);
      const item = this.cache.get(name);
      if (item.option.beforeUnmount) {
        item.option.beforeUnmount.call(this.art, item.$ref);
      }
      for (const event of item.events) {
        this.art.events.remove(event);
      }
      this.cache.delete(name);
      delete this[name];
      remove(item.$ref);
    }
    update(option) {
      if (this.cache.has(option.name)) {
        const item = this.cache.get(option.name);
        option = Object.assign(item.option, option);
        this.remove(option.name);
      }
      return this.add(option);
    }
  }
  function aspectRatio$2(option) {
    return (art) => {
      const {
        i18n,
        constructor: { ASPECT_RATIO }
      } = art;
      const html = ASPECT_RATIO.map(
        (item) => `<span data-value="${item}">${item === "default" ? i18n.get("Default") : item}</span>`
      ).join("");
      return {
        ...option,
        html: `${i18n.get("Aspect Ratio")}: ${html}`,
        click: (contextmenu, event) => {
          const { value } = event.target.dataset;
          if (value) {
            art.aspectRatio = value;
            contextmenu.show = false;
          }
        },
        mounted: ($panel) => {
          const $default = query('[data-value="default"]', $panel);
          if ($default) {
            inverseClass($default, "art-current");
          }
          art.on("aspectRatio", (value) => {
            const $current = queryAll("span", $panel).find((item) => item.dataset.value === value);
            if ($current) {
              inverseClass($current, "art-current");
            }
          });
        }
      };
    };
  }
  function close$1(option) {
    return (art) => ({
      ...option,
      html: art.i18n.get("Close"),
      click: (contextmenu) => {
        contextmenu.show = false;
      }
    });
  }
  function flip$2(option) {
    return (art) => {
      const {
        i18n,
        constructor: { FLIP }
      } = art;
      const html = FLIP.map((item) => `<span data-value="${item}">${i18n.get(capitalize(item))}</span>`).join("");
      return {
        ...option,
        html: `${i18n.get("Video Flip")}: ${html}`,
        click: (contextmenu, event) => {
          const { value } = event.target.dataset;
          if (value) {
            art.flip = value.toLowerCase();
            contextmenu.show = false;
          }
        },
        mounted: ($panel) => {
          const $default = query('[data-value="normal"]', $panel);
          if ($default) {
            inverseClass($default, "art-current");
          }
          art.on("flip", (value) => {
            const $current = queryAll("span", $panel).find((item) => item.dataset.value === value);
            if ($current) {
              inverseClass($current, "art-current");
            }
          });
        }
      };
    };
  }
  function info(option) {
    return (art) => ({
      ...option,
      html: art.i18n.get("Video Info"),
      click: (contextmenu) => {
        art.info.show = true;
        contextmenu.show = false;
      }
    });
  }
  function playbackRate$2(option) {
    return (art) => {
      const {
        i18n,
        constructor: { PLAYBACK_RATE }
      } = art;
      const html = PLAYBACK_RATE.map(
        (item) => `<span data-value="${item}">${item === 1 ? i18n.get("Normal") : item.toFixed(1)}</span>`
      ).join("");
      return {
        ...option,
        html: `${i18n.get("Play Speed")}: ${html}`,
        click: (contextmenu, event) => {
          const { value } = event.target.dataset;
          if (value) {
            art.playbackRate = Number(value);
            contextmenu.show = false;
          }
        },
        mounted: ($panel) => {
          const $default = query('[data-value="1"]', $panel);
          if ($default)
            inverseClass($default, "art-current");
          art.on("video:ratechange", () => {
            const $current = queryAll("span", $panel).find(
              (item) => Number(item.dataset.value) === art.playbackRate
            );
            if ($current) {
              inverseClass($current, "art-current");
            }
          });
        }
      };
    };
  }
  function version(option) {
    const url = isBrowser ? location.href : "";
    return {
      ...option,
      html: `<a href="https://artplayer.org?ref=${encodeURIComponent(url)}" target="_blank" style="width:100%;">ArtPlayer ${version$1}</a>`
    };
  }
  class Contextmenu extends Component {
    constructor(art) {
      super(art);
      this.name = "contextmenu";
      this.$parent = art.template.$contextmenu;
      if (!isMobile) {
        this.init();
      }
    }
    init() {
      const {
        option,
        proxy,
        template: { $player, $contextmenu }
      } = this.art;
      if (option.playbackRate) {
        this.add(
          playbackRate$2({
            name: "playbackRate",
            index: 10
          })
        );
      }
      if (option.aspectRatio) {
        this.add(
          aspectRatio$2({
            name: "aspectRatio",
            index: 20
          })
        );
      }
      if (option.flip) {
        this.add(
          flip$2({
            name: "flip",
            index: 30
          })
        );
      }
      this.add(
        info({
          name: "info",
          index: 40
        })
      );
      this.add(
        version({
          name: "version",
          index: 50
        })
      );
      this.add(
        close$1({
          name: "close",
          index: 60
        })
      );
      for (let index = 0; index < option.contextmenu.length; index++) {
        this.add(option.contextmenu[index]);
      }
      proxy($player, "contextmenu", (event) => {
        if (!this.art.constructor.CONTEXTMENU)
          return;
        event.preventDefault();
        this.show = true;
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = getRect($player);
        const { height: mHeight, width: mWidth } = getRect($contextmenu);
        let menuLeft = mouseX - cLeft;
        let menuTop = mouseY - cTop;
        if (mouseX + mWidth > cLeft + cWidth) {
          menuLeft = cWidth - mWidth;
        }
        if (mouseY + mHeight > cTop + cHeight) {
          menuTop = cHeight - mHeight;
        }
        setStyles($contextmenu, {
          top: `${menuTop}px`,
          left: `${menuLeft}px`
        });
      });
      proxy($player, "click", (event) => {
        if (!includeFromEvent(event, $contextmenu)) {
          this.show = false;
        }
      });
      this.art.on("blur", () => {
        this.show = false;
      });
    }
  }
  function airplay$1(option) {
    return (art) => ({
      ...option,
      tooltip: art.i18n.get("AirPlay"),
      mounted: ($control) => {
        const { proxy, icons } = art;
        append($control, icons.airplay);
        proxy($control, "click", () => art.airplay());
      }
    });
  }
  function fullscreen(option) {
    return (art) => ({
      ...option,
      tooltip: art.i18n.get("Fullscreen"),
      mounted: ($control) => {
        const { proxy, icons, i18n } = art;
        const $fullscreenOn = append($control, icons.fullscreenOn);
        const $fullscreenOff = append($control, icons.fullscreenOff);
        setStyle($fullscreenOff, "display", "none");
        proxy($control, "click", () => {
          art.fullscreen = !art.fullscreen;
        });
        art.on("fullscreen", (state2) => {
          if (state2) {
            tooltip($control, i18n.get("Exit Fullscreen"));
            setStyle($fullscreenOn, "display", "none");
            setStyle($fullscreenOff, "display", "inline-flex");
          } else {
            tooltip($control, i18n.get("Fullscreen"));
            setStyle($fullscreenOn, "display", "inline-flex");
            setStyle($fullscreenOff, "display", "none");
          }
        });
      }
    });
  }
  function fullscreenWeb(option) {
    return (art) => ({
      ...option,
      tooltip: art.i18n.get("Web Fullscreen"),
      mounted: ($control) => {
        const { proxy, icons, i18n } = art;
        const $fullscreenWebOn = append($control, icons.fullscreenWebOn);
        const $fullscreenWebOff = append($control, icons.fullscreenWebOff);
        setStyle($fullscreenWebOff, "display", "none");
        proxy($control, "click", () => {
          art.fullscreenWeb = !art.fullscreenWeb;
        });
        art.on("fullscreenWeb", (value) => {
          if (value) {
            tooltip($control, i18n.get("Exit Web Fullscreen"));
            setStyle($fullscreenWebOn, "display", "none");
            setStyle($fullscreenWebOff, "display", "inline-flex");
          } else {
            tooltip($control, i18n.get("Web Fullscreen"));
            setStyle($fullscreenWebOn, "display", "inline-flex");
            setStyle($fullscreenWebOff, "display", "none");
          }
        });
      }
    });
  }
  function pip$1(option) {
    return (art) => ({
      ...option,
      tooltip: art.i18n.get("PIP Mode"),
      mounted: ($control) => {
        const { proxy, icons, i18n } = art;
        append($control, icons.pip);
        proxy($control, "click", () => {
          art.pip = !art.pip;
        });
        art.on("pip", (value) => {
          tooltip($control, i18n.get(value ? "Exit PIP Mode" : "PIP Mode"));
        });
      }
    });
  }
  function playAndPause(option) {
    return (art) => ({
      ...option,
      mounted: ($control) => {
        const { proxy, icons, i18n } = art;
        const $play = append($control, icons.play);
        const $pause = append($control, icons.pause);
        tooltip($play, i18n.get("Play"));
        tooltip($pause, i18n.get("Pause"));
        proxy($play, "click", () => {
          art.play();
        });
        proxy($pause, "click", () => {
          art.pause();
        });
        function showPlay() {
          setStyle($play, "display", "flex");
          setStyle($pause, "display", "none");
        }
        function showPause() {
          setStyle($play, "display", "none");
          setStyle($pause, "display", "flex");
        }
        if (art.playing) {
          showPause();
        } else {
          showPlay();
        }
        art.on("video:playing", () => {
          showPause();
        });
        art.on("video:pause", () => {
          showPlay();
        });
      }
    });
  }
  function getPosFromEvent(art, event) {
    const { $progress } = art.template;
    const { left } = getRect($progress);
    const eventLeft = isMobile ? event.touches[0].clientX : event.clientX;
    const width = clamp(eventLeft - left, 0, $progress.clientWidth);
    const second = width / $progress.clientWidth * art.duration;
    const time2 = secondToTime(second);
    const percentage = clamp(width / $progress.clientWidth, 0, 1);
    return { second, time: time2, width, percentage };
  }
  function setCurrentTime(art, event) {
    if (art.isRotate) {
      const percentage = (event.touches[0].clientY - art.top) / art.height;
      const second = percentage * art.duration;
      art.emit("setBar", "played", percentage, event);
      art.seek = second;
    } else {
      const { second, percentage } = getPosFromEvent(art, event);
      art.emit("setBar", "played", percentage, event);
      art.seek = second;
    }
  }
  function progress(options) {
    return (art) => {
      const { icons, option, proxy } = art;
      const { $player, $progress } = art.template;
      return {
        ...options,
        html: `
                <div class="art-control-progress-inner">
                    <div class="art-progress-hover"></div>
                    <div class="art-progress-loaded"></div>
                    <div class="art-progress-played"></div>
                    <div class="art-progress-highlight"></div>
                    <div class="art-progress-indicator"></div>
                    <div class="art-progress-tip">00:00</div>
                </div>
            `,
        mounted: ($control) => {
          let tipTimer = null;
          let isDragging = false;
          const $hover = query(".art-progress-hover", $control);
          const $loaded = query(".art-progress-loaded", $control);
          const $played = query(".art-progress-played", $control);
          const $highlight = query(".art-progress-highlight", $control);
          const $indicator = query(".art-progress-indicator", $control);
          const $tip = query(".art-progress-tip", $control);
          if (icons.indicator) {
            append($indicator, icons.indicator);
          } else {
            setStyle($indicator, "backgroundColor", "var(--art-theme)");
          }
          function showHighlight(event) {
            const { width } = getPosFromEvent(art, event);
            const { text } = event.target.dataset;
            $tip.textContent = text;
            const tipWidth = $tip.clientWidth;
            if (width <= tipWidth / 2) {
              setStyle($tip, "left", 0);
            } else if (width > $control.clientWidth - tipWidth / 2) {
              setStyle($tip, "left", `${$control.clientWidth - tipWidth}px`);
            } else {
              setStyle($tip, "left", `${width - tipWidth / 2}px`);
            }
          }
          function showTime(event, touch) {
            const { width, time: time2 } = touch || getPosFromEvent(art, event);
            $tip.textContent = time2 || "00:00";
            const tipWidth = $tip.clientWidth;
            if (width <= tipWidth / 2) {
              setStyle($tip, "left", 0);
            } else if (width > $control.clientWidth - tipWidth / 2) {
              setStyle($tip, "left", `${$control.clientWidth - tipWidth}px`);
            } else {
              setStyle($tip, "left", `${width - tipWidth / 2}px`);
            }
          }
          function updateHighlight() {
            $highlight.textContent = "";
            for (let index = 0; index < option.highlight.length; index++) {
              const item = option.highlight[index];
              const left = clamp(item.time, 0, art.duration) / art.duration * 100;
              const html = `<span data-text="${item.text}" data-time="${item.time}" style="left: ${left}%"></span>`;
              append($highlight, html);
            }
          }
          function setBar(type, percentage, event) {
            const isMobileDragging = type === "played" && event && isMobile;
            if (type === "loaded") {
              setStyle($loaded, "width", `${percentage * 100}%`);
            }
            if (type === "hover") {
              setStyle($hover, "width", `${percentage * 100}%`);
              if (includeFromEvent(event, $highlight)) {
                showHighlight(event);
              } else {
                showTime(event);
              }
              if (percentage === 0) {
                removeClass($player, "art-progress-hover");
              } else {
                addClass($player, "art-progress-hover");
              }
            }
            if (type === "played") {
              setStyle($played, "width", `${percentage * 100}%`);
              setStyle($indicator, "left", `${percentage * 100}%`);
            }
            if (isMobileDragging) {
              addClass($player, "art-progress-hover");
              const width = $control.clientWidth * percentage;
              const time2 = secondToTime(percentage * art.duration);
              showTime(event, { width, time: time2 });
              clearTimeout(tipTimer);
              tipTimer = setTimeout(() => {
                removeClass($player, "art-progress-hover");
              }, 500);
            }
          }
          art.on("setBar", setBar);
          art.on("video:loadedmetadata", updateHighlight);
          if (art.constructor.USE_RAF) {
            art.on("raf", () => {
              art.emit("setBar", "played", art.played);
              art.emit("setBar", "loaded", art.loaded);
            });
          } else {
            art.on("video:timeupdate", () => {
              art.emit("setBar", "played", art.played);
            });
            art.on("video:progress", () => {
              art.emit("setBar", "loaded", art.loaded);
            });
            art.on("video:ended", () => {
              art.emit("setBar", "played", 1);
            });
          }
          art.emit("setBar", "loaded", art.loaded || 0);
          if (!isMobile) {
            proxy($progress, "click", (event) => {
              if (event.target !== $indicator) {
                setCurrentTime(art, event);
              }
            });
            proxy($progress, "mousemove", (event) => {
              const { percentage } = getPosFromEvent(art, event);
              art.emit("setBar", "hover", percentage, event);
            });
            proxy($progress, "mouseleave", (event) => {
              art.emit("setBar", "hover", 0, event);
            });
            proxy($progress, "mousedown", (event) => {
              isDragging = event.button === 0;
            });
            art.on("document:mousemove", (event) => {
              if (isDragging) {
                const { second, percentage } = getPosFromEvent(art, event);
                art.emit("setBar", "played", percentage, event);
                art.seek = second;
              }
            });
            art.on("document:mouseup", () => {
              if (isDragging) {
                isDragging = false;
              }
            });
          }
        }
      };
    };
  }
  function screenshot$1(option) {
    return (art) => ({
      ...option,
      tooltip: art.i18n.get("Screenshot"),
      mounted: ($control) => {
        const { proxy, icons } = art;
        append($control, icons.screenshot);
        proxy($control, "click", () => {
          art.screenshot();
        });
      }
    });
  }
  function setting$1(option) {
    return (art) => ({
      ...option,
      tooltip: art.i18n.get("Show Setting"),
      mounted: ($control) => {
        const { proxy, icons, i18n } = art;
        append($control, icons.setting);
        proxy($control, "click", () => {
          art.setting.toggle();
          art.setting.resize();
        });
        art.on("setting", (value) => {
          tooltip($control, i18n.get(value ? "Hide Setting" : "Show Setting"));
        });
      }
    });
  }
  function time(option) {
    return (art) => ({
      ...option,
      style: isMobile ? {
        fontSize: "12px",
        padding: "0 5px"
      } : {
        cursor: "auto",
        padding: "0 10px"
      },
      mounted: ($control) => {
        function getTime() {
          const newTime = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`;
          if (newTime !== $control.textContent) {
            $control.textContent = newTime;
          }
        }
        getTime();
        const events = ["video:loadedmetadata", "video:timeupdate", "video:progress"];
        for (let index = 0; index < events.length; index++) {
          art.on(events[index], getTime);
        }
      }
    });
  }
  function volume$1(option) {
    return (art) => ({
      ...option,
      mounted: ($control) => {
        const { proxy, icons } = art;
        const $volume = append($control, icons.volume);
        const $close = append($control, icons.volumeClose);
        const $panel = append($control, '<div class="art-volume-panel"></div>');
        const $inner = append($panel, '<div class="art-volume-inner"></div>');
        const $value = append($inner, `<div class="art-volume-val"></div>`);
        const $slider = append($inner, `<div class="art-volume-slider"></div>`);
        const $handle = append($slider, `<div class="art-volume-handle"></div>`);
        const $loaded = append($handle, `<div class="art-volume-loaded"></div>`);
        const $indicator = append($slider, `<div class="art-volume-indicator"></div>`);
        function getVolumeFromEvent(event) {
          const { top, height } = getRect($slider);
          return 1 - (event.clientY - top) / height;
        }
        function update() {
          if (art.muted || art.volume === 0) {
            setStyle($volume, "display", "none");
            setStyle($close, "display", "flex");
            setStyle($indicator, "top", "100%");
            setStyle($loaded, "top", "100%");
            $value.textContent = 0;
          } else {
            const percentage = art.volume * 100;
            setStyle($volume, "display", "flex");
            setStyle($close, "display", "none");
            setStyle($indicator, "top", `${100 - percentage}%`);
            setStyle($loaded, "top", `${100 - percentage}%`);
            $value.textContent = Math.floor(percentage);
          }
        }
        update();
        art.on("video:volumechange", update);
        proxy($volume, "click", () => {
          art.muted = true;
        });
        proxy($close, "click", () => {
          art.muted = false;
        });
        if (isMobile) {
          setStyle($panel, "display", "none");
        } else {
          let isDragging = false;
          proxy($slider, "mousedown", (event) => {
            isDragging = event.button === 0;
            art.volume = getVolumeFromEvent(event);
          });
          art.on("document:mousemove", (event) => {
            if (isDragging) {
              art.muted = false;
              art.volume = getVolumeFromEvent(event);
            }
          });
          art.on("document:mouseup", () => {
            if (isDragging) {
              isDragging = false;
            }
          });
        }
      }
    });
  }
  class Control extends Component {
    constructor(art) {
      super(art);
      this.isHover = false;
      this.name = "control";
      this.timer = Date.now();
      const { constructor } = art;
      const { $player, $bottom } = this.art.template;
      art.on("mousemove", () => {
        if (!isMobile) {
          this.show = true;
        }
      });
      art.on("click", () => {
        if (isMobile) {
          this.toggle();
        } else {
          this.show = true;
        }
      });
      art.on("document:mousemove", (event) => {
        this.isHover = includeFromEvent(event, $bottom);
      });
      art.on("video:timeupdate", () => {
        if (!art.setting.show && !this.isHover && !art.isInput && art.playing && this.show && Date.now() - this.timer >= constructor.CONTROL_HIDE_TIME) {
          this.show = false;
        }
      });
      art.on("control", (state2) => {
        if (state2) {
          removeClass($player, "art-hide-cursor");
          addClass($player, "art-hover");
          this.timer = Date.now();
        } else {
          addClass($player, "art-hide-cursor");
          removeClass($player, "art-hover");
        }
      });
      this.init();
    }
    init() {
      const { option } = this.art;
      if (!option.isLive) {
        this.add(
          progress({
            name: "progress",
            position: "top",
            index: 10
          })
        );
      }
      this.add({
        name: "thumbnails",
        position: "top",
        index: 20
      });
      this.add(
        playAndPause({
          name: "playAndPause",
          position: "left",
          index: 10
        })
      );
      this.add(
        volume$1({
          name: "volume",
          position: "left",
          index: 20
        })
      );
      if (!option.isLive) {
        this.add(
          time({
            name: "time",
            position: "left",
            index: 30
          })
        );
      }
      if (option.quality.length) {
        sleep().then(() => {
          this.art.quality = option.quality;
        });
      }
      if (option.screenshot && !isMobile) {
        this.add(
          screenshot$1({
            name: "screenshot",
            position: "right",
            index: 20
          })
        );
      }
      if (option.setting) {
        this.add(
          setting$1({
            name: "setting",
            position: "right",
            index: 30
          })
        );
      }
      if (option.pip) {
        this.add(
          pip$1({
            name: "pip",
            position: "right",
            index: 40
          })
        );
      }
      if (option.airplay && window.WebKitPlaybackTargetAvailabilityEvent) {
        this.add(
          airplay$1({
            name: "airplay",
            position: "right",
            index: 50
          })
        );
      }
      if (option.fullscreenWeb) {
        this.add(
          fullscreenWeb({
            name: "fullscreenWeb",
            position: "right",
            index: 60
          })
        );
      }
      if (option.fullscreen) {
        this.add(
          fullscreen({
            name: "fullscreen",
            position: "right",
            index: 70
          })
        );
      }
      for (let index = 0; index < option.controls.length; index++) {
        this.add(option.controls[index]);
      }
    }
    add(getOption) {
      const option = typeof getOption === "function" ? getOption(this.art) : getOption;
      const { $progress, $controlsLeft, $controlsRight } = this.art.template;
      switch (option.position) {
        case "top":
          this.$parent = $progress;
          break;
        case "left":
          this.$parent = $controlsLeft;
          break;
        case "right":
          this.$parent = $controlsRight;
          break;
        default:
          errorHandle(false, `Control option.position must one of 'top', 'left', 'right'`);
          break;
      }
      super.add(option);
    }
    check(target) {
      if (!target) {
        return;
      }
      target.$control_value.innerHTML = target.html;
      for (let index = 0; index < target.$control_option.length; index++) {
        const item = target.$control_option[index];
        item.default = item === target;
        if (item.default) {
          inverseClass(item.$control_item, "art-current");
        }
      }
    }
    selector(option, $ref, events) {
      const { proxy } = this.art.events;
      addClass($ref, "art-control-selector");
      const $value = createElement("div");
      addClass($value, "art-selector-value");
      append($value, option.html);
      $ref.textContent = "";
      append($ref, $value);
      const $list = createElement("div");
      addClass($list, "art-selector-list");
      append($ref, $list);
      for (let index = 0; index < option.selector.length; index++) {
        const item = option.selector[index];
        const $item = createElement("div");
        addClass($item, "art-selector-item");
        if (item.default)
          addClass($item, "art-current");
        $item.dataset.index = index;
        $item.dataset.value = item.value;
        $item.innerHTML = item.html;
        append($list, $item);
        def(item, "$control_option", {
          get: () => option.selector
        });
        def(item, "$control_item", {
          get: () => $item
        });
        def(item, "$control_value", {
          get: () => $value
        });
      }
      const event = proxy($list, "click", async (event2) => {
        const path = getComposedPath(event2);
        const item = option.selector.find(
          (item2) => item2.$control_item === path.find(($item) => item2.$control_item === $item)
        );
        this.check(item);
        if (option.onSelect) {
          $value.innerHTML = await option.onSelect.call(this.art, item, item.$control_item, event2);
        }
      });
      events.push(event);
    }
  }
  function clickInit(art, events) {
    const {
      constructor,
      template: { $player, $video }
    } = art;
    function onDocumentClick(event) {
      if (includeFromEvent(event, $player)) {
        art.isInput = event.target.tagName === "INPUT";
        art.isFocus = true;
        art.emit("focus", event);
      } else {
        art.isInput = false;
        art.isFocus = false;
        art.emit("blur", event);
      }
    }
    art.on("document:click", onDocumentClick);
    art.on("document:contextmenu", onDocumentClick);
    let clickTimes = [];
    events.proxy($video, "click", (event) => {
      const now = Date.now();
      clickTimes.push(now);
      const { MOBILE_CLICK_PLAY, DBCLICK_TIME, MOBILE_DBCLICK_PLAY, DBCLICK_FULLSCREEN } = constructor;
      const clicks = clickTimes.filter((t) => now - t <= DBCLICK_TIME);
      switch (clicks.length) {
        case 1:
          art.emit("click", event);
          if (isMobile) {
            if (!art.isLock && MOBILE_CLICK_PLAY) {
              art.toggle();
            }
          } else {
            art.toggle();
          }
          clickTimes = clicks;
          break;
        case 2:
          art.emit("dblclick", event);
          if (isMobile) {
            if (!art.isLock && MOBILE_DBCLICK_PLAY) {
              art.toggle();
            }
          } else {
            if (DBCLICK_FULLSCREEN) {
              art.fullscreen = !art.fullscreen;
            }
          }
          clickTimes = [];
          break;
        default:
          clickTimes = [];
      }
    });
  }
  function GetSlideAngle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }
  function GetSlideDirection(startX, startY, endX, endY) {
    const dy = startY - endY;
    const dx = endX - startX;
    let result = 0;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
      return result;
    }
    const angle = GetSlideAngle(dx, dy);
    if (angle >= -45 && angle < 45) {
      result = 4;
    } else if (angle >= 45 && angle < 135) {
      result = 1;
    } else if (angle >= -135 && angle < -45) {
      result = 2;
    } else if (angle >= 135 && angle <= 180 || angle >= -180 && angle < -135) {
      result = 3;
    }
    return result;
  }
  function gestureInit(art, events) {
    if (isMobile && !art.option.isLive) {
      const { $video, $progress } = art.template;
      let touchTarget = null;
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let startTime = 0;
      const onTouchStart = (event) => {
        if (event.touches.length === 1 && !art.isLock) {
          if (touchTarget === $progress) {
            setCurrentTime(art, event);
          }
          isDragging = true;
          const { pageX, pageY } = event.touches[0];
          startX = pageX;
          startY = pageY;
          startTime = art.currentTime;
        }
      };
      const onTouchMove = (event) => {
        if (event.touches.length === 1 && isDragging && art.duration) {
          const { pageX, pageY } = event.touches[0];
          const direction = GetSlideDirection(startX, startY, pageX, pageY);
          const isHorizontal = [3, 4].includes(direction);
          const isVertical = [1, 2].includes(direction);
          const isLegal = isHorizontal && !art.isRotate || isVertical && art.isRotate;
          if (isLegal) {
            const ratioX = clamp((pageX - startX) / art.width, -1, 1);
            const ratioY = clamp((pageY - startY) / art.height, -1, 1);
            const ratio = art.isRotate ? ratioY : ratioX;
            const TOUCH_MOVE_RATIO = touchTarget === $video ? art.constructor.TOUCH_MOVE_RATIO : 1;
            const currentTime = clamp(startTime + art.duration * ratio * TOUCH_MOVE_RATIO, 0, art.duration);
            art.seek = currentTime;
            art.emit("setBar", "played", clamp(currentTime / art.duration, 0, 1), event);
            art.notice.show = `${secondToTime(currentTime)} / ${secondToTime(art.duration)}`;
          }
        }
      };
      const onTouchEnd = () => {
        if (isDragging) {
          startX = 0;
          startY = 0;
          startTime = 0;
          isDragging = false;
          touchTarget = null;
        }
      };
      if (art.option.gesture) {
        events.proxy($video, "touchstart", (event) => {
          touchTarget = $video;
          onTouchStart(event);
        });
        events.proxy($video, "touchmove", onTouchMove);
      }
      events.proxy($progress, "touchstart", (event) => {
        touchTarget = $progress;
        onTouchStart(event);
      });
      events.proxy($progress, "touchmove", onTouchMove);
      art.on("document:touchend", onTouchEnd);
    }
  }
  function globalInit(art, events) {
    const documentEvents = [
      "click",
      "mouseup",
      "keydown",
      "touchend",
      "touchmove",
      "mousemove",
      "pointerup",
      "contextmenu",
      "pointermove",
      "visibilitychange",
      "webkitfullscreenchange"
    ];
    const windowEvents = [
      "resize",
      "scroll",
      "orientationchange"
    ];
    const destroyEvents = [];
    function bindGlobalEvents(source = {}) {
      for (let index = 0; index < destroyEvents.length; index++) {
        events.remove(destroyEvents[index]);
      }
      destroyEvents.length = 0;
      const { $player } = art.template;
      documentEvents.forEach((name) => {
        const doc = source.document || $player.ownerDocument || document;
        const destroy = events.proxy(doc, name, (event) => {
          art.emit(`document:${name}`, event);
        });
        destroyEvents.push(destroy);
      });
      windowEvents.forEach((name) => {
        const win = source.window || $player.ownerDocument?.defaultView || window;
        const destroy = events.proxy(win, name, (event) => {
          art.emit(`window:${name}`, event);
        });
        destroyEvents.push(destroy);
      });
    }
    bindGlobalEvents();
    events.bindGlobalEvents = bindGlobalEvents;
  }
  function hoverInit(art, events) {
    const { $player } = art.template;
    events.hover(
      $player,
      (event) => {
        addClass($player, "art-hover");
        art.emit("hover", true, event);
      },
      (event) => {
        removeClass($player, "art-hover");
        art.emit("hover", false, event);
      }
    );
  }
  function moveInit(art, events) {
    const { $player } = art.template;
    events.proxy($player, "mousemove", (event) => {
      art.emit("mousemove", event);
    });
  }
  function resizeInit(art, events) {
    const { option, constructor } = art;
    art.on("resize", () => {
      const { aspectRatio: aspectRatio2, notice } = art;
      if (art.state === "standard" && option.autoSize) {
        art.autoSize();
      }
      art.aspectRatio = aspectRatio2;
      notice.show = "";
    });
    const resizeFn = debounce(() => art.emit("resize"), constructor.RESIZE_TIME);
    art.on("window:orientationchange", () => resizeFn());
    art.on("window:resize", () => resizeFn());
    if (screen && screen.orientation && screen.orientation.onchange) {
      events.proxy(screen.orientation, "change", () => resizeFn());
    }
  }
  function updateInit(art) {
    if (art.constructor.USE_RAF) {
      let timer = null;
      (function update() {
        if (art.playing) {
          art.emit("raf");
        }
        if (!art.isDestroy) {
          timer = requestAnimationFrame(update);
        }
      })();
      art.on("destroy", () => {
        cancelAnimationFrame(timer);
      });
    }
  }
  function viewInit(art) {
    const {
      option,
      constructor,
      template: { $container }
    } = art;
    const scrollFn = throttle(() => {
      art.emit("view", isInViewport($container, constructor.SCROLL_GAP));
    }, constructor.SCROLL_TIME);
    art.on("window:scroll", () => scrollFn());
    art.on("view", (state2) => {
      if (option.autoMini) {
        art.mini = !state2;
      }
    });
  }
  class Events {
    constructor(art) {
      this.destroyEvents = /* @__PURE__ */ new Set();
      this.proxy = this.proxy.bind(this);
      this.hover = this.hover.bind(this);
      clickInit(art, this);
      hoverInit(art, this);
      moveInit(art, this);
      resizeInit(art, this);
      gestureInit(art, this);
      viewInit(art);
      globalInit(art, this);
      updateInit(art);
    }
    proxy(target, name, callback, option = {}) {
      if (Array.isArray(name)) {
        return name.map((item) => this.proxy(target, item, callback, option));
      }
      target.addEventListener(name, callback, option);
      const destroy = () => target.removeEventListener(name, callback, option);
      this.destroyEvents.add(destroy);
      return destroy;
    }
    hover(target, mouseenter, mouseleave) {
      if (mouseenter) {
        this.proxy(target, "mouseenter", mouseenter);
      }
      if (mouseleave) {
        this.proxy(target, "mouseleave", mouseleave);
      }
    }
    remove(destroyEvent) {
      if (this.destroyEvents.has(destroyEvent)) {
        try {
          destroyEvent();
        } catch (error2) {
          console.warn("Failed to remove event listener:", error2);
        } finally {
          this.destroyEvents.delete(destroyEvent);
        }
      }
    }
    destroy() {
      for (const destroyEvent of this.destroyEvents) {
        try {
          destroyEvent();
        } catch (error2) {
          console.warn("Failed to destroy event listener:", error2);
        }
      }
      this.destroyEvents.clear();
    }
  }
  class Hotkey {
    constructor(art) {
      this.art = art;
      this.keys = {};
      if (!isMobile) {
        this.init();
      }
    }
    init() {
      const { constructor } = this.art;
      if (this.art.option.hotkey) {
        this.add("Escape", () => {
          if (this.art.fullscreenWeb) {
            this.art.fullscreenWeb = false;
          }
        });
        this.add("Space", () => {
          this.art.toggle();
        });
        this.add("ArrowLeft", () => {
          this.art.backward = constructor.SEEK_STEP;
        });
        this.add("ArrowUp", () => {
          this.art.volume += constructor.VOLUME_STEP;
        });
        this.add("ArrowRight", () => {
          this.art.forward = constructor.SEEK_STEP;
        });
        this.add("ArrowDown", () => {
          this.art.volume -= constructor.VOLUME_STEP;
        });
      }
      this.art.on("document:keydown", (event) => {
        if (this.art.isFocus) {
          const tag = document.activeElement.tagName.toUpperCase();
          const editable = document.activeElement.getAttribute("contenteditable");
          if (tag !== "INPUT" && tag !== "TEXTAREA" && editable !== "" && editable !== "true" && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            const events = this.keys[event.code];
            if (events) {
              event.preventDefault();
              for (let index = 0; index < events.length; index++) {
                events[index].call(this.art, event);
              }
              this.art.emit("hotkey", event);
            }
          }
        }
        this.art.emit("keydown", event);
      });
    }
    add(key, event) {
      if (this.keys[key]) {
        if (!this.keys[key].includes(event)) {
          this.keys[key].push(event);
        }
      } else {
        this.keys[key] = [event];
      }
      return this;
    }
    remove(key, event) {
      if (this.keys[key]) {
        const index = this.keys[key].indexOf(event);
        if (index !== -1) {
          this.keys[key].splice(index, 1);
        }
        if (this.keys[key].length === 0) {
          delete this.keys[key];
        }
      }
      return this;
    }
  }
  const zhCn = {
    "Video Info": "统计信息",
    "Close": "关闭",
    "Video Load Failed": "加载失败",
    "Volume": "音量",
    "Play": "播放",
    "Pause": "暂停",
    "Rate": "速度",
    "Mute": "静音",
    "Video Flip": "画面翻转",
    "Horizontal": "水平",
    "Vertical": "垂直",
    "Reconnect": "重新连接",
    "Show Setting": "显示设置",
    "Hide Setting": "隐藏设置",
    "Screenshot": "截图",
    "Play Speed": "播放速度",
    "Aspect Ratio": "画面比例",
    "Default": "默认",
    "Normal": "正常",
    "Open": "打开",
    "Switch Video": "切换",
    "Switch Subtitle": "切换字幕",
    "Fullscreen": "全屏",
    "Exit Fullscreen": "退出全屏",
    "Web Fullscreen": "网页全屏",
    "Exit Web Fullscreen": "退出网页全屏",
    "Mini Player": "迷你播放器",
    "PIP Mode": "开启画中画",
    "Exit PIP Mode": "退出画中画",
    "PIP Not Supported": "不支持画中画",
    "Fullscreen Not Supported": "不支持全屏",
    "Subtitle Offset": "字幕偏移",
    "Last Seen": "上次看到",
    "Jump Play": "跳转播放",
    "AirPlay": "隔空播放",
    "AirPlay Not Available": "隔空播放不可用"
  };
  if (typeof window !== "undefined") {
    window["artplayer-i18n-zh-cn"] = zhCn;
  }
  class I18n {
    constructor(art) {
      this.art = art;
      this.languages = {
        "zh-cn": zhCn
      };
      this.language = {};
      this.update(art.option.i18n);
    }
    init() {
      const lang = this.art.option.lang.toLowerCase();
      this.language = this.languages[lang] || {};
    }
    get(key) {
      return this.language[key] || key;
    }
    update(value) {
      this.languages = mergeDeep(this.languages, value);
      this.init();
    }
  }
  const airplay = '<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">\n    <g>\n        <path d="M16,1 L2,1 C1.447,1 1,1.447 1,2 L1,12 C1,12.553 1.447,13 2,13 L5,13 L5,11 L3,11 L3,3 L15,3 L15,11 L13,11 L13,13 L16,13 C16.553,13 17,12.553 17,12 L17,2 C17,1.447 16.553,1 16,1 L16,1 Z"></path>\n        <polygon points="4 17 14 17 9 11"></polygon>\n    </g>\n</svg>\n';
  const arrowLeft = '<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" version="1.1" viewBox="0 0 32 32">\n    <path d="M 19.41,20.09 14.83,15.5 19.41,10.91 18,9.5 l -6,6 6,6 z" />\n</svg>';
  const arrowRight = '<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" version="1.1" viewBox="0 0 32 32">\n    <path d="m 12.59,20.34 4.58,-4.59 -4.58,-4.59 1.41,-1.41 6,6 -6,6 z" />\n</svg>';
  const aspectRatio$1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"><defs><clipPath id="__lottie_element_216"><rect width="88" height="88" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_216)"><g transform="matrix(1,0,0,1,44,44)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill-opacity="1" d=" M12.437999725341797,-12.70199966430664 C12.437999725341797,-12.70199966430664 9.618000030517578,-9.881999969482422 9.618000030517578,-9.881999969482422 C8.82800006866455,-9.092000007629395 8.82800006866455,-7.831999778747559 9.618000030517578,-7.052000045776367 C9.618000030517578,-7.052000045776367 16.687999725341797,0.017999999225139618 16.687999725341797,0.017999999225139618 C16.687999725341797,0.017999999225139618 9.618000030517578,7.0879998207092285 9.618000030517578,7.0879998207092285 C8.82800006866455,7.877999782562256 8.82800006866455,9.137999534606934 9.618000030517578,9.918000221252441 C9.618000030517578,9.918000221252441 12.437999725341797,12.748000144958496 12.437999725341797,12.748000144958496 C13.227999687194824,13.527999877929688 14.48799991607666,13.527999877929688 15.267999649047852,12.748000144958496 C15.267999649047852,12.748000144958496 26.58799934387207,1.437999963760376 26.58799934387207,1.437999963760376 C27.368000030517578,0.6579999923706055 27.368000030517578,-0.6119999885559082 26.58799934387207,-1.3919999599456787 C26.58799934387207,-1.3919999599456787 15.267999649047852,-12.70199966430664 15.267999649047852,-12.70199966430664 C14.48799991607666,-13.491999626159668 13.227999687194824,-13.491999626159668 12.437999725341797,-12.70199966430664z M-12.442000389099121,-12.70199966430664 C-13.182000160217285,-13.442000389099121 -14.362000465393066,-13.482000350952148 -15.142000198364258,-12.821999549865723 C-15.142000198364258,-12.821999549865723 -15.272000312805176,-12.70199966430664 -15.272000312805176,-12.70199966430664 C-15.272000312805176,-12.70199966430664 -26.582000732421875,-1.3919999599456787 -26.582000732421875,-1.3919999599456787 C-27.32200050354004,-0.6520000100135803 -27.36199951171875,0.5180000066757202 -26.70199966430664,1.3079999685287476 C-26.70199966430664,1.3079999685287476 -26.582000732421875,1.437999963760376 -26.582000732421875,1.437999963760376 C-26.582000732421875,1.437999963760376 -15.272000312805176,12.748000144958496 -15.272000312805176,12.748000144958496 C-14.531999588012695,13.48799991607666 -13.362000465393066,13.527999877929688 -12.571999549865723,12.868000030517578 C-12.571999549865723,12.868000030517578 -12.442000389099121,12.748000144958496 -12.442000389099121,12.748000144958496 C-12.442000389099121,12.748000144958496 -9.612000465393066,9.918000221252441 -9.612000465393066,9.918000221252441 C-8.871999740600586,9.178000450134277 -8.831999778747559,8.008000373840332 -9.501999855041504,7.2179999351501465 C-9.501999855041504,7.2179999351501465 -9.612000465393066,7.0879998207092285 -9.612000465393066,7.0879998207092285 C-9.612000465393066,7.0879998207092285 -16.68199920654297,0.017999999225139618 -16.68199920654297,0.017999999225139618 C-16.68199920654297,0.017999999225139618 -9.612000465393066,-7.052000045776367 -9.612000465393066,-7.052000045776367 C-8.871999740600586,-7.791999816894531 -8.831999778747559,-8.961999893188477 -9.501999855041504,-9.751999855041504 C-9.501999855041504,-9.751999855041504 -9.612000465393066,-9.881999969482422 -9.612000465393066,-9.881999969482422 C-9.612000465393066,-9.881999969482422 -12.442000389099121,-12.70199966430664 -12.442000389099121,-12.70199966430664z M28,-28 C32.41999816894531,-28 36,-24.420000076293945 36,-20 C36,-20 36,20 36,20 C36,24.420000076293945 32.41999816894531,28 28,28 C28,28 -28,28 -28,28 C-32.41999816894531,28 -36,24.420000076293945 -36,20 C-36,20 -36,-20 -36,-20 C-36,-24.420000076293945 -32.41999816894531,-28 -28,-28 C-28,-28 28,-28 28,-28z" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#a8a6a4;"></path></g></g></g></svg>';
  const check = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24" style="width: 100%; height: 100%;">\n<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />\n</svg>';
  const close = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg t="1655876154826" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22">\n<path d="M571.733333 512l268.8-268.8c17.066667-17.066667 17.066667-42.666667 0-59.733333-17.066667-17.066667-42.666667-17.066667-59.733333 0L512 452.266667 243.2 183.466667c-17.066667-17.066667-42.666667-17.066667-59.733333 0-17.066667 17.066667-17.066667 42.666667 0 59.733333L452.266667 512 183.466667 780.8c-17.066667 17.066667-17.066667 42.666667 0 59.733333 8.533333 8.533333 19.2 12.8 29.866666 12.8s21.333333-4.266667 29.866667-12.8L512 571.733333l268.8 268.8c8.533333 8.533333 19.2 12.8 29.866667 12.8s21.333333-4.266667 29.866666-12.8c17.066667-17.066667 17.066667-42.666667 0-59.733333L571.733333 512z" p-id="2131">\n</path>\n</svg>';
  const config = '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z            M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#a8a6a4;"></path></svg>';
  const error = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg t="1652850026663" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2749" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50">\n<path d="M593.8176 168.5504l356.00384 595.21024c26.15296 43.74528 10.73152 99.7376-34.44736 125.05088-14.39744 8.06912-30.72 12.30848-47.37024 12.30848H155.97568C103.75168 901.12 61.44 860.16 61.44 809.61536c0-16.09728 4.38272-31.92832 12.71808-45.8752L430.16192 168.5504c26.17344-43.7248 84.00896-58.65472 129.20832-33.34144a93.0816 93.0816 0 0 1 34.44736 33.34144zM512 819.2a61.44 61.44 0 1 0 0-122.88 61.44 61.44 0 0 0 0 122.88z m0-512a72.31488 72.31488 0 0 0-71.76192 81.3056l25.72288 205.7216a46.40768 46.40768 0 0 0 92.07808 0l25.72288-205.74208A72.31488 72.31488 0 0 0 512 307.2z" p-id="2750">\n</path>\n</svg>';
  const flip$1 = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg t="1652445277062" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">\n<path d="M554.666667 810.666667v85.333333h-85.333334v-85.333333h85.333334zM170.666667 178.005333a42.666667 42.666667 0 0 1 34.986666 18.218667l203.904 291.328a42.666667 42.666667 0 0 1 0 48.896l-203.946666 291.328A42.666667 42.666667 0 0 1 128 803.328V220.672a42.666667 42.666667 0 0 1 42.666667-42.666667z m682.666666 0a42.666667 42.666667 0 0 1 42.368 37.717334l0.298667 4.949333v582.656a42.666667 42.666667 0 0 1-74.24 28.629333l-3.413333-4.181333-203.904-291.328a42.666667 42.666667 0 0 1-3.029334-43.861333l3.029334-5.034667 203.946666-291.328A42.666667 42.666667 0 0 1 853.333333 178.005333zM554.666667 640v85.333333h-85.333334v-85.333333h85.333334zM196.266667 319.104V716.8L335.957333 512 196.309333 319.104zM554.666667 469.333333v85.333334h-85.333334v-85.333334h85.333334z m0-170.666666v85.333333h-85.333334V298.666667h85.333334z m0-170.666667v85.333333h-85.333334V128h85.333334z">\n</path>\n</svg>\n';
  const fullscreenOff = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg class="icon" width="22" height="22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\n<path d="M768 298.666667h170.666667v85.333333h-256V128h85.333333v170.666667zM341.333333 384H85.333333V298.666667h170.666667V128h85.333333v256z m426.666667 341.333333v170.666667h-85.333333v-256h256v85.333333h-170.666667zM341.333333 640v256H256v-170.666667H85.333333v-85.333333h256z" />\n</svg>\n';
  const fullscreenOn = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg class="icon" width="22" height="22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\n<path d="M625.777778 256h142.222222V398.222222h113.777778V142.222222H625.777778v113.777778zM256 398.222222V256H398.222222v-113.777778H142.222222V398.222222h113.777778zM768 625.777778v142.222222H625.777778v113.777778h256V625.777778h-113.777778zM398.222222 768H256V625.777778h-113.777778v256H398.222222v-113.777778z" />\n</svg>\n';
  const fullscreenWebOff = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg class="icon" width="18" height="18" viewBox="0 0 1152 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\n<path d="M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4A76.8 76.8 0 0 0 76.8 1024h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0zM1024 128v768H128V128h896zM896 512a64 64 0 0 1 7.488 127.552L896 640h-128v128a64 64 0 0 1-56.512 63.552L704 832a64 64 0 0 1-63.552-56.512L640 768V582.592c0-34.496 25.024-66.112 61.632-70.208L709.632 512H896zM256 512a64 64 0 0 1-7.488-127.552L256 384h128V256a64 64 0 0 1 56.512-63.552L448 192a64 64 0 0 1 63.552 56.512L512 256v185.408c0 34.432-25.024 66.112-61.632 70.144L442.368 512H256z" />\n</svg>\n';
  const fullscreenWebOn = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg class="icon" width="18" height="18" viewBox="0 0 1152 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\n<path d="M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4A76.8 76.8 0 0 0 76.8 1024h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0zM1024 128v768H128V128h896zM448 192a64 64 0 0 1 7.488 127.552L448 320H320v128a64 64 0 0 1-56.512 63.552L256 512a64 64 0 0 1-63.552-56.512L192 448V262.592c0-34.432 25.024-66.112 61.632-70.144L261.632 192H448zM704 832a64 64 0 0 1-7.488-127.552L704 704h128V576a64 64 0 0 1 56.512-63.552L896 512a64 64 0 0 1 63.552 56.512L960 576v185.408c0 34.496-25.024 66.112-61.632 70.208l-8 0.384H704z" />\n</svg>\n';
  const loading = '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default">\n  <rect x="0" y="0" width="100" height="100" fill="none" class="bk"/>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(0 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-1s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(30 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(60 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(90 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.75s" repeatCount="indefinite"/></rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(120 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(150 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(180 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.5s" repeatCount="indefinite"/></rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(210 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(240 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(270 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.25s" repeatCount="indefinite"/></rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(300 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(330 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"/>\n  </rect>\n</svg>';
  const lock$1 = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg t="1650612139149" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">\n<path d="M298.666667 426.666667V341.333333a213.333333 213.333333 0 1 1 426.666666 0v85.333334h42.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667z m213.333333-213.333334a128 128 0 0 0-128 128v85.333334h256V341.333333a128 128 0 0 0-128-128z"></path>\n</svg>\n';
  const pause = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n    <path d="M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z"></path>\n</svg>';
  const pip = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="22" height="22">\n<path d="M844.8 219.648h-665.6c-6.144 0-10.24 4.608-10.24 10.752v563.2c0 5.632 4.096 10.24 10.24 10.24h256v92.16h-256a102.4 102.4 0 0 1-102.4-102.4v-563.2c0-56.832 45.568-102.4 102.4-102.4h665.6a102.4 102.4 0 0 1 102.4 102.4v204.8h-92.16v-204.8c0-6.144-4.608-10.752-10.24-10.752zM614.4 588.8c-28.672 0-51.2 22.528-51.2 51.2v204.8c0 28.16 22.528 51.2 51.2 51.2h281.6c28.16 0 51.2-23.04 51.2-51.2v-204.8c0-28.672-23.04-51.2-51.2-51.2H614.4z"></path>\n</svg>';
  const play = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n  <path d="M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z"></path>\n</svg>';
  const playbackRate$1 = '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#a8a6a4;"></path></svg>';
  const screenshot = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 50 50">\n	<path d="M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z "/>\n</svg>\n';
  const setting = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n    <circle cx="11" cy="11" r="2"></circle>\n    <path d="M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"></path>\n</svg>';
  const state = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">\n<path d="M9.5 9.325v5.35q0 .575.525.875t1.025-.05l4.15-2.65q.475-.3.475-.85t-.475-.85L11.05 8.5q-.5-.35-1.025-.05t-.525.875ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/>\n</svg>\n';
  const switchOff = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg class="icon" width="26" height="26" viewBox="0 0 1740 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\n    <path d="M511.8976 1024h670.5152c282.4192-0.4096 511.1808-229.4784 511.1808-511.8976 0-282.4192-228.7616-511.488-511.1808-511.8976H511.8976C229.4784 0.6144 0.7168 229.6832 0.7168 512.1024c0 282.4192 228.7616 511.488 511.1808 511.8976zM511.3344 48.64A464.5888 464.5888 0 1 1 48.0256 513.024 463.872 463.872 0 0 1 511.3344 48.4352V48.64z" />\n</svg>\n';
  const switchOn = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg class="icon" width="26" height="26" viewBox="0 0 1664 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\n    <path fill="#648FFC" d="M1152 0H512a512 512 0 0 0 0 1024h640a512 512 0 0 0 0-1024z m0 960a448 448 0 1 1 448-448 448 448 0 0 1-448 448z"  />\n</svg>';
  const unlock = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg t="1650612464266" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M666.752 194.517333L617.386667 268.629333A128 128 0 0 0 384 341.333333l0.042667 85.333334h384a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667V341.333333a213.333333 213.333333 0 0 1 368.085333-146.816z"></path></svg>\n';
  const volumeClose = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n    <path d="M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z"></path>\n    <path d="M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z"></path>\n</svg>';
  const volume = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n    <path d="M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z"></path>\n    <path d="M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z"></path>\n</svg>';
  class Icons {
    constructor(art) {
      const icons = {
        loading,
        state,
        play,
        pause,
        check,
        volume,
        volumeClose,
        screenshot,
        setting,
        pip,
        arrowLeft,
        arrowRight,
        playbackRate: playbackRate$1,
        aspectRatio: aspectRatio$1,
        config,
        lock: lock$1,
        flip: flip$1,
        unlock,
        fullscreenOff,
        fullscreenOn,
        fullscreenWebOff,
        fullscreenWebOn,
        switchOn,
        switchOff,
        error,
        close,
        airplay,
        ...art.option.icons
      };
      for (const key in icons) {
        def(this, key, {
          get: () => getIcon(key, icons[key])
        });
      }
    }
  }
  class Info extends Component {
    constructor(art) {
      super(art);
      this.name = "info";
      if (!isMobile) {
        this.init();
      }
    }
    init() {
      const {
        proxy,
        constructor,
        template: { $infoPanel, $infoClose, $video }
      } = this.art;
      proxy($infoClose, "click", () => {
        this.show = false;
      });
      let timer = null;
      const $types = queryAll("[data-video]", $infoPanel) || [];
      this.art.on("destroy", () => clearTimeout(timer));
      function loop() {
        for (let index = 0; index < $types.length; index++) {
          const item = $types[index];
          const value = $video[item.dataset.video];
          const textContent = typeof value === "number" ? value.toFixed(2) : value;
          if (item.textContent !== textContent) {
            item.textContent = textContent;
          }
        }
        timer = setTimeout(loop, constructor.INFO_LOOP_TIME);
      }
      loop();
    }
  }
  class Layer extends Component {
    constructor(art) {
      super(art);
      const {
        option,
        template: { $layer }
      } = art;
      this.name = "layer";
      this.$parent = $layer;
      for (let index = 0; index < option.layers.length; index++) {
        this.add(option.layers[index]);
      }
    }
  }
  class Loading extends Component {
    constructor(art) {
      super(art);
      this.name = "loading";
      append(art.template.$loading, art.icons.loading);
    }
  }
  class Mask extends Component {
    constructor(art) {
      super(art);
      this.name = "mask";
      const { template, icons, events } = art;
      const $state = append(template.$state, icons.state);
      const $error = append(template.$state, icons.error);
      setStyle($error, "display", "none");
      art.on("destroy", () => {
        setStyle($state, "display", "none");
        setStyle($error, "display", null);
      });
      events.proxy(template.$state, "click", () => art.play());
    }
  }
  class Notice {
    constructor(art) {
      this.art = art;
      this.timer = null;
      art.on("destroy", () => this.destroy());
    }
    destroy() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
    set show(msg) {
      const {
        constructor,
        template: { $player, $noticeInner }
      } = this.art;
      if (msg) {
        $noticeInner.textContent = msg instanceof Error ? msg.message.trim() : msg;
        addClass($player, "art-notice-show");
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          $noticeInner.textContent = "";
          removeClass($player, "art-notice-show");
        }, constructor.NOTICE_TIME);
      } else {
        removeClass($player, "art-notice-show");
      }
    }
    get show() {
      const {
        template: { $player }
      } = this.art;
      return $player.classList.contains("art-notice-show");
    }
  }
  function airplayMix(art) {
    const {
      i18n,
      notice,
      proxy,
      template: { $video }
    } = art;
    let available = true;
    if (window.WebKitPlaybackTargetAvailabilityEvent && $video.webkitShowPlaybackTargetPicker) {
      proxy($video, "webkitplaybacktargetavailabilitychanged", (event) => {
        switch (event.availability) {
          case "available":
            available = true;
            break;
          case "not-available":
            available = false;
            break;
        }
      });
    } else {
      available = false;
    }
    def(art, "airplay", {
      value() {
        if (available) {
          $video.webkitShowPlaybackTargetPicker();
          art.emit("airplay");
        } else {
          notice.show = i18n.get("AirPlay Not Available");
        }
      }
    });
  }
  function aspectRatioMix(art) {
    const {
      i18n,
      notice,
      template: { $video, $player }
    } = art;
    def(art, "aspectRatio", {
      get() {
        return $player.dataset.aspectRatio || "default";
      },
      set(ratio) {
        if (!ratio)
          ratio = "default";
        if (ratio === "default") {
          setStyle($video, "width", null);
          setStyle($video, "height", null);
          setStyle($video, "margin", null);
          delete $player.dataset.aspectRatio;
        } else {
          const ratioArray = ratio.split(":").map(Number);
          const { clientWidth, clientHeight } = $player;
          const playerRatio = clientWidth / clientHeight;
          const setupRatio = ratioArray[0] / ratioArray[1];
          if (playerRatio > setupRatio) {
            setStyle($video, "width", `${setupRatio * clientHeight}px`);
            setStyle($video, "height", "100%");
            setStyle($video, "margin", "0 auto");
          } else {
            setStyle($video, "width", "100%");
            setStyle($video, "height", `${clientWidth / setupRatio}px`);
            setStyle($video, "margin", "auto 0");
          }
          $player.dataset.aspectRatio = ratio;
        }
        notice.show = `${i18n.get("Aspect Ratio")}: ${ratio === "default" ? i18n.get("Default") : ratio}`;
        art.emit("aspectRatio", ratio);
      }
    });
  }
  function attrMix(art) {
    const {
      template: { $video }
    } = art;
    def(art, "attr", {
      value(key, value) {
        if (value === void 0)
          return $video[key];
        $video[key] = value;
      }
    });
  }
  function autoHeightMix(art) {
    const {
      template: { $container, $video }
    } = art;
    def(art, "autoHeight", {
      value() {
        const { clientWidth } = $container;
        const { videoHeight, videoWidth } = $video;
        const height = videoHeight * (clientWidth / videoWidth);
        setStyle($container, "height", `${height}px`);
        art.emit("autoHeight", height);
      }
    });
  }
  function autoSizeMix(art) {
    const { $container, $player, $video } = art.template;
    def(art, "autoSize", {
      value() {
        const { videoWidth, videoHeight } = $video;
        const { width, height } = getRect($container);
        const videoRatio = videoWidth / videoHeight;
        const containerRatio = width / height;
        if (containerRatio > videoRatio) {
          const percentage = height * videoRatio / width * 100;
          setStyle($player, "width", `${percentage}%`);
          setStyle($player, "height", "100%");
        } else {
          const percentage = width / videoRatio / height * 100;
          setStyle($player, "width", "100%");
          setStyle($player, "height", `${percentage}%`);
        }
        art.emit("autoSize", {
          width: art.width,
          height: art.height
        });
      }
    });
  }
  function cssVarMix(art) {
    const { $player } = art.template;
    def(art, "cssVar", {
      value(key, value) {
        if (value) {
          return $player.style.setProperty(key, value);
        } else {
          return getComputedStyle($player).getPropertyValue(key);
        }
      }
    });
  }
  function currentTimeMix(art) {
    const { $video } = art.template;
    def(art, "currentTime", {
      get: () => $video.currentTime || 0,
      set: (time2) => {
        time2 = Number.parseFloat(time2);
        if (Number.isNaN(time2))
          return;
        $video.currentTime = clamp(time2, 0, art.duration);
      }
    });
  }
  function durationMix(art) {
    def(art, "duration", {
      get: () => {
        const { duration } = art.template.$video;
        if (duration === Infinity)
          return 0;
        return duration || 0;
      }
    });
  }
  function eventInit(art) {
    const {
      i18n,
      notice,
      option,
      constructor,
      proxy,
      template: { $player, $video, $poster }
    } = art;
    let reconnectTime = 0;
    for (let index = 0; index < config$1.events.length; index++) {
      proxy($video, config$1.events[index], (event) => {
        art.emit(`video:${event.type}`, event);
      });
    }
    art.on("video:canplay", () => {
      reconnectTime = 0;
      art.loading.show = false;
    });
    art.once("video:canplay", () => {
      art.loading.show = false;
      art.controls.show = true;
      art.mask.show = true;
      art.isReady = true;
      art.emit("ready");
    });
    art.on("video:ended", () => {
      if (option.loop) {
        art.seek = 0;
        art.play();
        art.controls.show = false;
        art.mask.show = false;
      } else {
        art.controls.show = true;
        art.mask.show = true;
      }
    });
    art.on("video:error", async (error2) => {
      if (reconnectTime < constructor.RECONNECT_TIME_MAX) {
        await sleep(constructor.RECONNECT_SLEEP_TIME);
        reconnectTime += 1;
        art.url = option.url;
        notice.show = `${i18n.get("Reconnect")}: ${reconnectTime}`;
        art.emit("error", error2, reconnectTime);
      } else {
        art.mask.show = true;
        art.loading.show = false;
        art.controls.show = true;
        addClass($player, "art-error");
        await sleep(constructor.RECONNECT_SLEEP_TIME);
        notice.show = i18n.get("Video Load Failed");
      }
    });
    art.on("video:loadedmetadata", () => {
      art.emit("resize");
      if (isMobile) {
        art.loading.show = false;
        art.controls.show = true;
        art.mask.show = true;
      }
    });
    art.on("video:loadstart", () => {
      art.loading.show = true;
      art.mask.show = false;
      art.controls.show = true;
    });
    art.on("video:pause", () => {
      art.controls.show = true;
      art.mask.show = true;
    });
    art.on("video:play", () => {
      art.mask.show = false;
      setStyle($poster, "display", "none");
    });
    art.on("video:playing", () => {
      art.mask.show = false;
    });
    art.on("video:progress", () => {
      if (art.playing) {
        art.loading.show = false;
      }
    });
    art.on("video:seeked", () => {
      art.loading.show = false;
      art.mask.show = true;
    });
    art.on("video:seeking", () => {
      art.loading.show = true;
      art.mask.show = false;
    });
    art.on("video:timeupdate", () => {
      art.mask.show = false;
    });
    art.on("video:waiting", () => {
      art.loading.show = true;
      art.mask.show = false;
    });
  }
  function flipMix(art) {
    const {
      template: { $player },
      i18n,
      notice
    } = art;
    def(art, "flip", {
      get() {
        return $player.dataset.flip || "normal";
      },
      set(flip2) {
        if (!flip2)
          flip2 = "normal";
        if (flip2 === "normal") {
          delete $player.dataset.flip;
        } else {
          $player.dataset.flip = flip2;
        }
        notice.show = `${i18n.get("Video Flip")}: ${i18n.get(capitalize(flip2))}`;
        art.emit("flip", flip2);
      }
    });
  }
  const methodMap = [
    [
      "requestFullscreen",
      "exitFullscreen",
      "fullscreenElement",
      "fullscreenEnabled",
      "fullscreenchange",
      "fullscreenerror"
    ],
    // New WebKit
    [
      "webkitRequestFullscreen",
      "webkitExitFullscreen",
      "webkitFullscreenElement",
      "webkitFullscreenEnabled",
      "webkitfullscreenchange",
      "webkitfullscreenerror"
    ],
    // Old WebKit
    [
      "webkitRequestFullScreen",
      "webkitCancelFullScreen",
      "webkitCurrentFullScreenElement",
      "webkitCancelFullScreen",
      "webkitfullscreenchange",
      "webkitfullscreenerror"
    ],
    [
      "mozRequestFullScreen",
      "mozCancelFullScreen",
      "mozFullScreenElement",
      "mozFullScreenEnabled",
      "mozfullscreenchange",
      "mozfullscreenerror"
    ],
    [
      "msRequestFullscreen",
      "msExitFullscreen",
      "msFullscreenElement",
      "msFullscreenEnabled",
      "MSFullscreenChange",
      "MSFullscreenError"
    ]
  ];
  const nativeAPI = (() => {
    if (typeof document === "undefined") {
      return false;
    }
    const unprefixedMethods = methodMap[0];
    const returnValue = {};
    for (const methodList of methodMap) {
      const exitFullscreenMethod = methodList[1];
      if (exitFullscreenMethod in document) {
        for (const [index, method] of methodList.entries()) {
          returnValue[unprefixedMethods[index]] = method;
        }
        return returnValue;
      }
    }
    return false;
  })();
  const eventNameMap = {
    change: nativeAPI.fullscreenchange,
    error: nativeAPI.fullscreenerror
  };
  const screenfull = {
    request(element = document.documentElement, options) {
      return new Promise((resolve, reject) => {
        const onFullScreenEntered = () => {
          screenfull.off("change", onFullScreenEntered);
          resolve();
        };
        screenfull.on("change", onFullScreenEntered);
        const returnPromise = element[nativeAPI.requestFullscreen](options);
        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenEntered).catch(reject);
        }
      });
    },
    exit() {
      return new Promise((resolve, reject) => {
        if (!screenfull.isFullscreen) {
          resolve();
          return;
        }
        const onFullScreenExit = () => {
          screenfull.off("change", onFullScreenExit);
          resolve();
        };
        screenfull.on("change", onFullScreenExit);
        const returnPromise = document[nativeAPI.exitFullscreen]();
        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenExit).catch(reject);
        }
      });
    },
    toggle(element, options) {
      return screenfull.isFullscreen ? screenfull.exit() : screenfull.request(element, options);
    },
    onchange(callback) {
      screenfull.on("change", callback);
    },
    onerror(callback) {
      screenfull.on("error", callback);
    },
    on(event, callback) {
      const eventName = eventNameMap[event];
      if (eventName) {
        document.addEventListener(eventName, callback, false);
      }
    },
    off(event, callback) {
      const eventName = eventNameMap[event];
      if (eventName) {
        document.removeEventListener(eventName, callback, false);
      }
    },
    raw: nativeAPI
  };
  Object.defineProperties(screenfull, {
    isFullscreen: {
      get: () => Boolean(document[nativeAPI.fullscreenElement])
    },
    element: {
      enumerable: true,
      get: () => document[nativeAPI.fullscreenElement]
    },
    isEnabled: {
      enumerable: true,
      get: () => Boolean(document[nativeAPI.fullscreenEnabled])
    }
  });
  function fullscreenMix(art) {
    const {
      i18n,
      notice,
      template: { $video, $player }
    } = art;
    const nativeScreenfull = (art2) => {
      screenfull.on("change", () => {
        art2.emit("fullscreen", screenfull.isFullscreen);
        if (screenfull.isFullscreen) {
          art2.state = "fullscreen";
          addClass($player, "art-fullscreen");
        } else {
          removeClass($player, "art-fullscreen");
        }
        art2.emit("resize");
      });
      screenfull.on("error", (event) => {
        art2.emit("fullscreenError", event);
      });
      def(art2, "fullscreen", {
        get() {
          return screenfull.isFullscreen;
        },
        async set(value) {
          if (value) {
            await screenfull.request($player);
          } else {
            await screenfull.exit();
          }
        }
      });
    };
    const webkitScreenfull = (art2) => {
      art2.on("document:webkitfullscreenchange", () => {
        art2.emit("fullscreen", art2.fullscreen);
        art2.emit("resize");
      });
      def(art2, "fullscreen", {
        get() {
          return document.fullscreenElement === $video;
        },
        set(value) {
          if (value) {
            art2.state = "fullscreen";
            $video.webkitEnterFullscreen();
          } else {
            $video.webkitExitFullscreen();
          }
        }
      });
    };
    art.once("video:loadedmetadata", () => {
      if (screenfull.isEnabled) {
        nativeScreenfull(art);
      } else if ($video.webkitSupportsFullscreen) {
        webkitScreenfull(art);
      } else {
        def(art, "fullscreen", {
          get() {
            return false;
          },
          set() {
            notice.show = i18n.get("Fullscreen Not Supported");
          }
        });
      }
      def(art, "fullscreen", get(art, "fullscreen"));
    });
  }
  function fullscreenWebMix(art) {
    const {
      constructor,
      template: { $container, $player }
    } = art;
    let cssText = "";
    def(art, "fullscreenWeb", {
      get() {
        return hasClass($player, "art-fullscreen-web");
      },
      set(value) {
        if (value) {
          cssText = $player.style.cssText;
          if (constructor.FULLSCREEN_WEB_IN_BODY) {
            append(document.body, $player);
          }
          art.state = "fullscreenWeb";
          setStyle($player, "width", "100%");
          setStyle($player, "height", "100%");
          addClass($player, "art-fullscreen-web");
          art.emit("fullscreenWeb", true);
        } else {
          if (constructor.FULLSCREEN_WEB_IN_BODY) {
            append($container, $player);
          }
          if (cssText) {
            $player.style.cssText = cssText;
            cssText = "";
          }
          removeClass($player, "art-fullscreen-web");
          art.emit("fullscreenWeb", false);
        }
        art.emit("resize");
      }
    });
  }
  function loadedMix(art) {
    const { $video } = art.template;
    def(art, "loaded", {
      get: () => art.loadedTime / $video.duration
    });
    def(art, "loadedTime", {
      get: () => {
        return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0;
      }
    });
  }
  function miniMix(art) {
    const {
      icons,
      proxy,
      storage,
      template: { $player, $video }
    } = art;
    let isDragging = false;
    let lastPageX = 0;
    let lastPageY = 0;
    function hideMini() {
      const { $mini } = art.template;
      if ($mini) {
        removeClass($player, "art-mini");
        setStyle($mini, "display", "none");
        $player.prepend($video);
        art.emit("mini", false);
      }
    }
    function initState($play, $pause) {
      if (art.playing) {
        setStyle($play, "display", `none`);
        setStyle($pause, "display", `flex`);
      } else {
        setStyle($play, "display", `flex`);
        setStyle($pause, "display", `none`);
      }
    }
    function createMini() {
      const { $mini } = art.template;
      if ($mini) {
        append($mini, $video);
        return setStyle($mini, "display", "flex");
      } else {
        const $mini2 = createElement("div");
        addClass($mini2, "art-mini-popup");
        append(document.body, $mini2);
        art.template.$mini = $mini2;
        append($mini2, $video);
        const $close = append($mini2, `<div class="art-mini-close"></div>`);
        append($close, icons.close);
        proxy($close, "click", hideMini);
        const $state = append($mini2, `<div class="art-mini-state"></div>`);
        const $play = append($state, icons.play);
        const $pause = append($state, icons.pause);
        proxy($play, "click", () => art.play());
        proxy($pause, "click", () => art.pause());
        initState($play, $pause);
        art.on("video:playing", () => initState($play, $pause));
        art.on("video:pause", () => initState($play, $pause));
        art.on("video:timeupdate", () => initState($play, $pause));
        proxy($mini2, "mousedown", (event) => {
          isDragging = event.button === 0;
          lastPageX = event.pageX;
          lastPageY = event.pageY;
        });
        art.on("document:mousemove", (event) => {
          if (isDragging) {
            addClass($mini2, "art-mini-dragging");
            const x = event.pageX - lastPageX;
            const y = event.pageY - lastPageY;
            setStyle($mini2, "transform", `translate(${x}px, ${y}px)`);
          }
        });
        art.on("document:mouseup", () => {
          if (isDragging) {
            isDragging = false;
            removeClass($mini2, "art-mini-dragging");
            const rect = getRect($mini2);
            storage.set("left", rect.left);
            storage.set("top", rect.top);
            setStyle($mini2, "left", `${rect.left}px`);
            setStyle($mini2, "top", `${rect.top}px`);
            setStyle($mini2, "transform", null);
          }
        });
        return $mini2;
      }
    }
    function initMini() {
      const { $mini } = art.template;
      const rect = getRect($mini);
      const top = window.innerHeight - rect.height - 50;
      const left = window.innerWidth - rect.width - 50;
      storage.set("top", top);
      storage.set("left", left);
      setStyle($mini, "top", `${top}px`);
      setStyle($mini, "left", `${left}px`);
    }
    def(art, "mini", {
      get() {
        return hasClass($player, "art-mini");
      },
      set(value) {
        if (value) {
          art.state = "mini";
          addClass($player, "art-mini");
          const $mini = createMini();
          const top = storage.get("top");
          const left = storage.get("left");
          if (typeof top === "number" && typeof left === "number") {
            setStyle($mini, "top", `${top}px`);
            setStyle($mini, "left", `${left}px`);
            if (!isInViewport($mini)) {
              initMini();
            }
          } else {
            initMini();
          }
          art.emit("mini", true);
        } else {
          hideMini();
        }
      }
    });
  }
  function optionInit(art) {
    const {
      option,
      storage,
      template: { $video, $poster }
    } = art;
    for (const key in option.moreVideoAttr) {
      art.attr(key, option.moreVideoAttr[key]);
    }
    if (option.muted) {
      art.muted = option.muted;
    }
    if (option.volume) {
      $video.volume = clamp(option.volume, 0, 1);
    }
    const volumeStorage = storage.get("volume");
    if (typeof volumeStorage === "number") {
      $video.volume = clamp(volumeStorage, 0, 1);
    }
    if (option.poster) {
      setStyle($poster, "backgroundImage", `url(${option.poster})`);
    }
    if (option.autoplay) {
      $video.autoplay = option.autoplay;
    }
    if (option.playsInline) {
      $video.playsInline = true;
      $video["webkit-playsinline"] = true;
    }
    if (option.theme) {
      option.cssVar["--art-theme"] = option.theme;
    }
    for (const key in option.cssVar) {
      art.cssVar(key, option.cssVar[key]);
    }
    art.url = option.url;
  }
  function pauseMix(art) {
    const {
      template: { $video },
      i18n,
      notice
    } = art;
    def(art, "pause", {
      value() {
        const result = $video.pause();
        notice.show = i18n.get("Pause");
        art.emit("pause");
        return result;
      }
    });
  }
  function nativePip(art) {
    const {
      template: { $video },
      proxy,
      notice
    } = art;
    $video.disablePictureInPicture = false;
    def(art, "pip", {
      get() {
        return document.pictureInPictureElement;
      },
      set(value) {
        if (value) {
          art.state = "pip";
          $video.requestPictureInPicture().catch((err) => {
            notice.show = err;
            throw err;
          });
        } else {
          document.exitPictureInPicture().catch((err) => {
            notice.show = err;
            throw err;
          });
        }
      }
    });
    proxy($video, "enterpictureinpicture", () => {
      art.emit("pip", true);
    });
    proxy($video, "leavepictureinpicture", () => {
      art.emit("pip", false);
    });
  }
  function webkitPip(art) {
    const { $video } = art.template;
    $video.webkitSetPresentationMode("inline");
    def(art, "pip", {
      get() {
        return $video.webkitPresentationMode === "picture-in-picture";
      },
      set(value) {
        if (value) {
          art.state = "pip";
          $video.webkitSetPresentationMode("picture-in-picture");
          art.emit("pip", true);
        } else {
          $video.webkitSetPresentationMode("inline");
          art.emit("pip", false);
        }
      }
    });
  }
  function pipMix(art) {
    const {
      i18n,
      notice,
      template: { $video }
    } = art;
    if (document.pictureInPictureEnabled) {
      nativePip(art);
    } else if ($video.webkitSupportsPresentationMode) {
      webkitPip(art);
    } else {
      def(art, "pip", {
        get() {
          return false;
        },
        set() {
          notice.show = i18n.get("PIP Not Supported");
        }
      });
    }
  }
  function playbackRateMix(art) {
    const {
      template: { $video },
      i18n,
      notice
    } = art;
    def(art, "playbackRate", {
      get() {
        return $video.playbackRate;
      },
      set(rate) {
        if (rate) {
          if (rate === $video.playbackRate)
            return;
          $video.playbackRate = rate;
          notice.show = `${i18n.get("Rate")}: ${rate === 1 ? i18n.get("Normal") : `${rate}x`}`;
        } else {
          art.playbackRate = 1;
        }
      }
    });
  }
  function playedMix(art) {
    def(art, "played", {
      get: () => art.currentTime / art.duration
    });
  }
  function playingMix(art) {
    const { $video } = art.template;
    def(art, "playing", {
      get: () => {
        if (typeof $video.playing === "boolean")
          return $video.playing;
        return !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2);
      }
    });
  }
  function playMix(art) {
    const {
      i18n,
      notice,
      option,
      constructor: { instances: instances2 },
      template: { $video }
    } = art;
    def(art, "play", {
      async value() {
        const result = await $video.play();
        notice.show = i18n.get("Play");
        art.emit("play");
        if (option.mutex) {
          for (let index = 0; index < instances2.length; index++) {
            const instance = instances2[index];
            if (instance !== art) {
              instance.pause();
            }
          }
        }
        return result;
      }
    });
  }
  function posterMix(art) {
    const {
      template: { $poster }
    } = art;
    def(art, "poster", {
      get: () => {
        try {
          return $poster.style.backgroundImage.match(/"(.*)"/)[1];
        } catch {
          return "";
        }
      },
      set(url) {
        setStyle($poster, "backgroundImage", `url(${url})`);
      }
    });
  }
  function qualityMix(art) {
    def(art, "quality", {
      set(quality) {
        const { controls, notice, i18n } = art;
        const qualityDefault = quality.find((item) => item.default) || quality[0];
        controls.update({
          name: "quality",
          position: "right",
          index: 10,
          style: {
            marginRight: "10px"
          },
          html: qualityDefault?.html || "",
          selector: quality,
          async onSelect(item) {
            await art.switchQuality(item.url);
            notice.show = `${i18n.get("Switch Video")}: ${item.html}`;
            return item.html;
          }
        });
      }
    });
  }
  function rectMix(art) {
    def(art, "rect", {
      get: () => {
        return getRect(art.template.$player);
      }
    });
    const keys = ["bottom", "height", "left", "right", "top", "width"];
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      def(art, key, {
        get: () => {
          return art.rect[key];
        }
      });
    }
    def(art, "x", {
      get: () => {
        return art.left + window.pageXOffset;
      }
    });
    def(art, "y", {
      get: () => {
        return art.top + window.pageYOffset;
      }
    });
  }
  function screenshotMix(art) {
    const {
      notice,
      template: { $video }
    } = art;
    const $canvas = createElement("canvas");
    def(art, "getDataURL", {
      value: () => new Promise((resolve, reject) => {
        try {
          $canvas.width = $video.videoWidth;
          $canvas.height = $video.videoHeight;
          $canvas.getContext("2d").drawImage($video, 0, 0);
          resolve($canvas.toDataURL("image/png"));
        } catch (err) {
          notice.show = err;
          reject(err);
        }
      })
    });
    def(art, "getBlobUrl", {
      value: () => new Promise((resolve, reject) => {
        try {
          $canvas.width = $video.videoWidth;
          $canvas.height = $video.videoHeight;
          $canvas.getContext("2d").drawImage($video, 0, 0);
          $canvas.toBlob((blob) => {
            resolve(URL.createObjectURL(blob));
          });
        } catch (err) {
          notice.show = err;
          reject(err);
        }
      })
    });
    def(art, "screenshot", {
      value: async (name) => {
        const dataUri = await art.getDataURL();
        const fileName = name || `artplayer_${secondToTime($video.currentTime)}`;
        download(dataUri, `${fileName}.png`);
        art.emit("screenshot", dataUri);
        return dataUri;
      }
    });
  }
  function seekMix(art) {
    const { notice } = art;
    def(art, "seek", {
      set(time2) {
        art.currentTime = time2;
        if (art.duration) {
          notice.show = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`;
        }
        art.emit("seek", art.currentTime, time2);
      }
    });
    def(art, "forward", {
      set(time2) {
        art.seek = art.currentTime + time2;
      }
    });
    def(art, "backward", {
      set(time2) {
        art.seek = art.currentTime - time2;
      }
    });
  }
  function stateMix(art) {
    const states = ["mini", "pip", "fullscreen", "fullscreenWeb"];
    def(art, "state", {
      get: () => states.find((name) => art[name]) || "standard",
      set(name) {
        for (let index = 0; index < states.length; index++) {
          const prop = states[index];
          if (prop !== name && art[prop]) {
            art[prop] = false;
          }
        }
      }
    });
  }
  function subtitleOffsetMix(art) {
    const { notice, i18n, template } = art;
    def(art, "subtitleOffset", {
      get() {
        return template.$track?.offset || 0;
      },
      set(value) {
        const { cues } = art.subtitle;
        if (!template.$track || cues.length === 0)
          return;
        const offset = clamp(value, -10, 10);
        template.$track.offset = offset;
        for (let index = 0; index < cues.length; index++) {
          const cue = cues[index];
          cue.originalStartTime = cue.originalStartTime ?? cue.startTime;
          cue.originalEndTime = cue.originalEndTime ?? cue.endTime;
          cue.startTime = clamp(cue.originalStartTime + offset, 0, art.duration);
          cue.endTime = clamp(cue.originalEndTime + offset, 0, art.duration);
        }
        art.subtitle.update();
        notice.show = `${i18n.get("Subtitle Offset")}: ${value}s`;
        art.emit("subtitleOffset", value);
      }
    });
  }
  function switchMix(art) {
    function switchUrl(url, currentTime) {
      return new Promise((resolve, reject) => {
        if (url === art.url) {
          resolve();
          return;
        }
        const { playing, aspectRatio: aspectRatio2, playbackRate: playbackRate2 } = art;
        art.pause();
        art.url = url;
        art.notice.show = "";
        const handlers = {};
        handlers.error = (error2) => {
          art.off("video:canplay", handlers.canplay);
          art.off("video:loadedmetadata", handlers.metadata);
          reject(error2);
        };
        handlers.metadata = () => {
          art.currentTime = currentTime;
        };
        handlers.canplay = async () => {
          art.off("video:error", handlers.error);
          art.playbackRate = playbackRate2;
          art.aspectRatio = aspectRatio2;
          if (playing) {
            await art.play();
          }
          art.notice.show = "";
          resolve();
        };
        art.once("video:error", handlers.error);
        art.once("video:loadedmetadata", handlers.metadata);
        art.once("video:canplay", handlers.canplay);
      });
    }
    def(art, "switchQuality", {
      value: (url) => {
        return switchUrl(url, art.currentTime);
      }
    });
    def(art, "switchUrl", {
      value: (url) => {
        return switchUrl(url, 0);
      }
    });
    def(art, "switch", {
      set: art.switchUrl
    });
  }
  function themeMix(art) {
    def(art, "theme", {
      get() {
        return art.cssVar("--art-theme");
      },
      set(theme) {
        art.cssVar("--art-theme", theme);
      }
    });
  }
  function thumbnailsMix(art) {
    const {
      option,
      template: { $progress, $video }
    } = art;
    let timer = null;
    let loding = false;
    let image = null;
    function reset() {
      clearTimeout(timer);
      timer = null;
      loding = false;
      image = null;
    }
    function showThumbnails(posWidth) {
      const $thumbnails = art.controls?.thumbnails;
      if (!$thumbnails)
        return;
      const { number, column, width, height, scale } = option.thumbnails;
      const width2 = width * scale || image.naturalWidth / column;
      const height2 = height * scale || width2 / ($video.videoWidth / $video.videoHeight);
      const perWidth = $progress.clientWidth / number;
      const perIndex = Math.floor(posWidth / perWidth);
      const yIndex = Math.ceil(perIndex / column) - 1;
      const xIndex = perIndex % column || column - 1;
      setStyle($thumbnails, "backgroundImage", `url(${image.src})`);
      setStyle($thumbnails, "height", `${height2}px`);
      setStyle($thumbnails, "width", `${width2}px`);
      setStyle($thumbnails, "backgroundPosition", `-${xIndex * width2}px -${yIndex * height2}px`);
      if (posWidth <= width2 / 2) {
        setStyle($thumbnails, "left", 0);
      } else if (posWidth > $progress.clientWidth - width2 / 2) {
        setStyle($thumbnails, "left", `${$progress.clientWidth - width2}px`);
      } else {
        setStyle($thumbnails, "left", `${posWidth - width2 / 2}px`);
      }
    }
    art.on("setBar", async (type, percentage, event) => {
      const $thumbnails = art.controls?.thumbnails;
      const { url, scale } = option.thumbnails;
      if (!$thumbnails || !url)
        return;
      const isMobileDragging = type === "played" && event && isMobile;
      if (type === "hover" || isMobileDragging) {
        if (!image && !loding) {
          loding = true;
          image = await loadImg(url, scale);
          loding = false;
        }
        if (!image)
          return;
        const width = $progress.clientWidth * percentage;
        if (width > 0 && width < $progress.clientWidth) {
          showThumbnails(width);
        }
      }
    });
    def(art, "thumbnails", {
      get() {
        return art.option.thumbnails;
      },
      set(thumbnails) {
        if (thumbnails.url && !art.option.isLive) {
          art.option.thumbnails = thumbnails;
          reset();
        }
      }
    });
  }
  function toggleMix(art) {
    def(art, "toggle", {
      value() {
        if (art.playing) {
          return art.pause();
        } else {
          return art.play();
        }
      }
    });
  }
  function typeMix(art) {
    def(art, "type", {
      get() {
        return art.option.type;
      },
      set(type) {
        art.option.type = type;
      }
    });
  }
  function urlMix(art) {
    const {
      option,
      template: { $video }
    } = art;
    def(art, "url", {
      get() {
        return $video.src;
      },
      async set(newUrl) {
        if (newUrl) {
          const oldUrl = art.url;
          const typeName = option.type || getExt(newUrl);
          const typeCallback = option.customType[typeName];
          if (typeName && typeCallback) {
            await sleep();
            art.loading.show = true;
            typeCallback.call(art, $video, newUrl, art);
          } else {
            URL.revokeObjectURL(oldUrl);
            $video.src = newUrl;
          }
          if (oldUrl !== art.url) {
            art.option.url = newUrl;
            if (art.isReady && oldUrl) {
              art.once("video:canplay", () => {
                art.emit("restart", newUrl);
              });
            }
          }
        } else {
          await sleep();
          art.loading.show = true;
        }
      }
    });
  }
  function volumeMix(art) {
    const {
      template: { $video },
      i18n,
      notice,
      storage
    } = art;
    def(art, "volume", {
      get: () => $video.volume || 0,
      set: (percentage) => {
        $video.volume = clamp(percentage, 0, 1);
        notice.show = `${i18n.get("Volume")}: ${Number.parseInt($video.volume * 100, 10)}`;
        if ($video.volume !== 0) {
          storage.set("volume", $video.volume);
        }
      }
    });
    def(art, "muted", {
      get: () => $video.muted,
      set: (muted) => {
        $video.muted = muted;
        art.emit("muted", muted);
      }
    });
  }
  class Player {
    constructor(art) {
      urlMix(art);
      attrMix(art);
      playMix(art);
      pauseMix(art);
      toggleMix(art);
      seekMix(art);
      volumeMix(art);
      currentTimeMix(art);
      durationMix(art);
      switchMix(art);
      playbackRateMix(art);
      aspectRatioMix(art);
      screenshotMix(art);
      fullscreenMix(art);
      fullscreenWebMix(art);
      pipMix(art);
      loadedMix(art);
      playedMix(art);
      playingMix(art);
      autoSizeMix(art);
      rectMix(art);
      flipMix(art);
      miniMix(art);
      posterMix(art);
      autoHeightMix(art);
      cssVarMix(art);
      themeMix(art);
      typeMix(art);
      stateMix(art);
      subtitleOffsetMix(art);
      airplayMix(art);
      qualityMix(art);
      thumbnailsMix(art);
      eventInit(art);
      optionInit(art);
    }
  }
  function autoOrientation(art) {
    const {
      notice,
      constructor,
      template: { $player, $video }
    } = art;
    const WEB_CLASS = "art-auto-orientation";
    const FS_CLASS = "art-auto-orientation-fullscreen";
    let fsLocked = false;
    function applyWebRotate() {
      const insets = getSafeAreaInsets();
      const viewWidth = document.documentElement.clientWidth;
      const viewHeight = document.documentElement.clientHeight;
      const safeWidth = viewHeight - insets.top - insets.bottom;
      const safeHeight = viewWidth - insets.left - insets.right;
      setStyle($player, "width", `${safeWidth}px`);
      setStyle($player, "height", `${safeHeight}px`);
      setStyle($player, "transform-origin", "0 0");
      setStyle($player, "transform", `rotate(90deg) translate(${insets.top}px, -${viewWidth - insets.right}px)`);
      addClass($player, WEB_CLASS);
      art.isRotate = true;
      art.emit("resize");
    }
    function clearWebRotate() {
      setStyle($player, "width", "");
      setStyle($player, "height", "");
      setStyle($player, "transform-origin", "");
      setStyle($player, "transform", "");
      removeClass($player, WEB_CLASS);
      art.isRotate = false;
      art.emit("resize");
    }
    function needRotate() {
      const { videoWidth, videoHeight } = $video;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      return videoWidth > videoHeight && vw < vh || videoWidth < videoHeight && vw > vh;
    }
    art.on("fullscreenWeb", (state2) => {
      if (state2) {
        if (needRotate()) {
          const delay = Number(constructor.AUTO_ORIENTATION_TIME ?? 0);
          setTimeout(() => {
            if (art.fullscreenWeb && !hasClass($player, WEB_CLASS)) {
              applyWebRotate();
            }
          }, delay);
        }
      } else {
        if (hasClass($player, WEB_CLASS))
          clearWebRotate();
      }
    });
    art.on("fullscreen", async (state2) => {
      const canLock = !!screen?.orientation?.lock;
      if (state2) {
        if (canLock && needRotate()) {
          try {
            const last = screen.orientation.type;
            const opposite = last.startsWith("portrait") ? "landscape" : "portrait";
            await screen.orientation.lock(opposite);
            fsLocked = true;
            addClass($player, FS_CLASS);
          } catch (err) {
            fsLocked = false;
            notice.show = err;
          }
        }
      } else {
        if (hasClass($player, FS_CLASS)) {
          removeClass($player, FS_CLASS);
        }
        if (canLock && fsLocked) {
          try {
            screen.orientation.unlock();
          } catch {
          }
          fsLocked = false;
        }
      }
    });
    return {
      name: "autoOrientation",
      get state() {
        return hasClass($player, WEB_CLASS);
      }
    };
  }
  function autoPlayback(art) {
    const {
      i18n,
      icons,
      storage,
      constructor,
      proxy,
      template: { $poster }
    } = art;
    const $autoPlayback = art.layers.add({
      name: "auto-playback",
      html: `
            <div class="art-auto-playback-close"></div>
            <div class="art-auto-playback-last"></div>
            <div class="art-auto-playback-jump"></div>
        `
    });
    const $last = query(".art-auto-playback-last", $autoPlayback);
    const $jump = query(".art-auto-playback-jump", $autoPlayback);
    const $close = query(".art-auto-playback-close", $autoPlayback);
    append($close, icons.close);
    let timer = null;
    art.on("video:timeupdate", () => {
      if (art.playing) {
        const times = storage.get("times") || {};
        const keys = Object.keys(times);
        if (keys.length > constructor.AUTO_PLAYBACK_MAX) {
          delete times[keys[0]];
        }
        times[art.option.id || art.option.url] = art.currentTime;
        storage.set("times", times);
      }
    });
    function init() {
      const times = storage.get("times") || {};
      const currentTime = times[art.option.id || art.option.url];
      clearTimeout(timer);
      setStyle($autoPlayback, "display", "none");
      if (currentTime && currentTime >= constructor.AUTO_PLAYBACK_MIN) {
        setStyle($autoPlayback, "display", "flex");
        $last.textContent = `${i18n.get("Last Seen")} ${secondToTime(currentTime)}`;
        $jump.textContent = i18n.get("Jump Play");
        proxy($close, "click", () => {
          setStyle($autoPlayback, "display", "none");
        });
        proxy($jump, "click", () => {
          art.seek = currentTime;
          art.play();
          setStyle($poster, "display", "none");
          setStyle($autoPlayback, "display", "none");
        });
        art.once("video:timeupdate", () => {
          timer = setTimeout(() => {
            setStyle($autoPlayback, "display", "none");
          }, constructor.AUTO_PLAYBACK_TIMEOUT);
        });
      }
    }
    art.on("ready", init);
    art.on("restart", init);
    return {
      name: "auto-playback",
      get times() {
        return storage.get("times") || {};
      },
      clear() {
        return storage.del("times");
      },
      delete(id2) {
        const times = storage.get("times") || {};
        delete times[id2];
        storage.set("times", times);
        return times;
      }
    };
  }
  function fastForward(art) {
    const {
      constructor,
      proxy,
      template: { $player, $video }
    } = art;
    let timer = null;
    let isPress = false;
    let lastPlaybackRate = 1;
    const onStart = (event) => {
      if (event.touches.length === 1 && art.playing && !art.isLock) {
        timer = setTimeout(() => {
          isPress = true;
          lastPlaybackRate = art.playbackRate;
          art.playbackRate = constructor.FAST_FORWARD_VALUE;
          addClass($player, "art-fast-forward");
        }, constructor.FAST_FORWARD_TIME);
      }
    };
    const onStop = () => {
      clearTimeout(timer);
      if (isPress) {
        isPress = false;
        art.playbackRate = lastPlaybackRate;
        removeClass($player, "art-fast-forward");
      }
    };
    proxy($video, "touchstart", onStart);
    art.on("document:touchmove", onStop);
    art.on("document:touchend", onStop);
    return {
      name: "fastForward",
      get state() {
        return hasClass($player, "art-fast-forward");
      }
    };
  }
  function lock(art) {
    const {
      layers,
      icons,
      template: { $player }
    } = art;
    function getState() {
      return hasClass($player, "art-lock");
    }
    function setLock() {
      addClass($player, "art-lock");
      art.isLock = true;
      art.emit("lock", true);
    }
    function setUnlock() {
      removeClass($player, "art-lock");
      art.isLock = false;
      art.emit("lock", false);
    }
    layers.add({
      name: "lock",
      mounted($el) {
        const $lock = append($el, icons.lock);
        const $unlock = append($el, icons.unlock);
        setStyle($lock, "display", "none");
        art.on("lock", (state2) => {
          if (state2) {
            setStyle($lock, "display", "inline-flex");
            setStyle($unlock, "display", "none");
          } else {
            setStyle($lock, "display", "none");
            setStyle($unlock, "display", "inline-flex");
          }
        });
      },
      click() {
        if (getState()) {
          setUnlock();
        } else {
          setLock();
        }
      }
    });
    return {
      name: "lock",
      get state() {
        return getState();
      },
      set state(value) {
        if (value) {
          setLock();
        } else {
          setUnlock();
        }
      }
    };
  }
  function miniProgressBar(art) {
    art.on("control", (state2) => {
      if (state2) {
        removeClass(art.template.$player, "art-mini-progress-bar");
      } else {
        addClass(art.template.$player, "art-mini-progress-bar");
      }
    });
    return { name: "mini-progress-bar" };
  }
  class Plugins {
    constructor(art) {
      this.art = art;
      this.id = 0;
      const { option } = art;
      if (option.miniProgressBar && !option.isLive) {
        this.add(miniProgressBar);
      }
      if (option.lock && isMobile) {
        this.add(lock);
      }
      if (option.autoPlayback && !option.isLive) {
        this.add(autoPlayback);
      }
      if (option.autoOrientation && isMobile) {
        this.add(autoOrientation);
      }
      if (option.fastForward && isMobile && !option.isLive) {
        this.add(fastForward);
      }
      for (let index = 0; index < option.plugins.length; index++) {
        this.add(option.plugins[index]);
      }
    }
    add(plugin) {
      this.id += 1;
      const result = plugin.call(this.art, this.art);
      if (result instanceof Promise) {
        return result.then((res) => this.next(plugin, res));
      } else {
        return this.next(plugin, result);
      }
    }
    next(plugin, result) {
      const pluginName = result && result.name || plugin.name || `plugin${this.id}`;
      errorHandle(!has(this, pluginName), `Cannot add a plugin that already has the same name: ${pluginName}`);
      def(this, pluginName, {
        value: result
      });
      return this;
    }
  }
  function aspectRatio(art) {
    const {
      i18n,
      icons,
      constructor: { SETTING_ITEM_WIDTH, ASPECT_RATIO }
    } = art;
    function getI18n(value) {
      return value === "default" ? i18n.get("Default") : value;
    }
    function update() {
      const target = art.setting.find(`aspect-ratio-${art.aspectRatio}`);
      art.setting.check(target);
    }
    return {
      width: SETTING_ITEM_WIDTH,
      name: "aspect-ratio",
      html: i18n.get("Aspect Ratio"),
      icon: icons.aspectRatio,
      tooltip: getI18n(art.aspectRatio),
      selector: ASPECT_RATIO.map((item) => {
        return {
          value: item,
          name: `aspect-ratio-${item}`,
          default: item === art.aspectRatio,
          html: getI18n(item)
        };
      }),
      onSelect(item) {
        art.aspectRatio = item.value;
        return item.html;
      },
      mounted: () => {
        update();
        art.on("aspectRatio", () => update());
      }
    };
  }
  function flip(art) {
    const {
      i18n,
      icons,
      constructor: { SETTING_ITEM_WIDTH, FLIP }
    } = art;
    function getI18n(value) {
      return i18n.get(capitalize(value));
    }
    function update() {
      const target = art.setting.find(`flip-${art.flip}`);
      art.setting.check(target);
    }
    return {
      width: SETTING_ITEM_WIDTH,
      name: "flip",
      html: i18n.get("Video Flip"),
      tooltip: getI18n(art.flip),
      icon: icons.flip,
      selector: FLIP.map((item) => {
        return {
          value: item,
          name: `flip-${item}`,
          default: item === art.flip,
          html: getI18n(item)
        };
      }),
      onSelect(item) {
        art.flip = item.value;
        return item.html;
      },
      mounted: () => {
        update();
        art.on("flip", () => update());
      }
    };
  }
  function playbackRate(art) {
    const {
      i18n,
      icons,
      constructor: { SETTING_ITEM_WIDTH, PLAYBACK_RATE }
    } = art;
    function getI18n(value) {
      return value === 1 ? i18n.get("Normal") : value.toFixed(1);
    }
    function update() {
      const target = art.setting.find(`playback-rate-${art.playbackRate}`);
      art.setting.check(target);
    }
    return {
      width: SETTING_ITEM_WIDTH,
      name: "playback-rate",
      html: i18n.get("Play Speed"),
      tooltip: getI18n(art.playbackRate),
      icon: icons.playbackRate,
      selector: PLAYBACK_RATE.map((item) => {
        return {
          value: item,
          name: `playback-rate-${item}`,
          default: item === art.playbackRate,
          html: getI18n(item)
        };
      }),
      onSelect(item) {
        art.playbackRate = item.value;
        return item.html;
      },
      mounted: () => {
        update();
        art.on("video:ratechange", () => update());
      }
    };
  }
  function subtitleOffset(art) {
    const { i18n, icons, constructor } = art;
    return {
      width: constructor.SETTING_ITEM_WIDTH,
      name: "subtitle-offset",
      html: i18n.get("Subtitle Offset"),
      icon: icons.subtitle,
      tooltip: "0s",
      range: [0, -10, 10, 0.1],
      onChange(item) {
        art.subtitleOffset = item.range[0];
        return `${item.range[0]}s`;
      },
      mounted: (_, item) => {
        art.on("subtitleOffset", (value) => {
          item.$range.value = value;
          item.tooltip = `${value}s`;
        });
      }
    };
  }
  class Setting extends Component {
    constructor(art) {
      super(art);
      const {
        option,
        controls,
        template: { $setting }
      } = art;
      this.name = "setting";
      this.$parent = $setting;
      this.id = 0;
      this.active = null;
      this.cache = /* @__PURE__ */ new Map();
      this.option = [...this.builtin, ...option.settings];
      if (option.setting) {
        this.format();
        this.render();
        art.on("blur", () => {
          if (this.show) {
            this.show = false;
            this.render();
          }
        });
        art.on("focus", (event) => {
          const isControl = includeFromEvent(event, controls.setting);
          const isSetting = includeFromEvent(event, this.$parent);
          if (this.show && !isControl && !isSetting) {
            this.show = false;
            this.render();
          }
        });
        art.on("resize", () => this.resize());
      }
    }
    get builtin() {
      const result = [];
      const { option } = this.art;
      if (option.playbackRate) {
        result.push(playbackRate(this.art));
      }
      if (option.aspectRatio) {
        result.push(aspectRatio(this.art));
      }
      if (option.flip) {
        result.push(flip(this.art));
      }
      if (option.subtitleOffset) {
        result.push(subtitleOffset(this.art));
      }
      return result;
    }
    traverse(callback, option = this.option) {
      for (let index = 0; index < option.length; index++) {
        const item = option[index];
        callback(item);
        if (item.selector?.length) {
          this.traverse(callback, item.selector);
        }
      }
    }
    check(target) {
      if (!target) {
        return;
      }
      target.$parent.tooltip = target.html;
      this.traverse((item) => {
        item.default = item === target;
        if (item.default && item.$item) {
          inverseClass(item.$item, "art-current");
        }
      }, target.$option);
      this.render(target.$parents);
    }
    format(option = this.option, parent, parents, names = []) {
      for (let index = 0; index < option.length; index++) {
        const item = option[index];
        if (item?.name) {
          errorHandle(!names.includes(item.name), `The [${item.name}] already exists in [setting]`);
          names.push(item.name);
        } else {
          item.name = `setting-${this.id++}`;
        }
        if (!item.$formatted) {
          def(item, "$parent", {
            get: () => parent
          });
          def(item, "$parents", {
            get: () => parents
          });
          def(item, "$option", {
            get: () => option
          });
          const $events = [];
          def(item, "$events", {
            get: () => $events
          });
          def(item, "$formatted", {
            get: () => true
          });
        }
        this.format(item.selector || [], item, option, names);
      }
      this.option = option;
    }
    find(name = "") {
      let result = null;
      this.traverse((item) => {
        if (item.name === name) {
          result = item;
        }
      });
      return result;
    }
    resize() {
      const {
        controls,
        constructor: { SETTING_WIDTH, SETTING_ITEM_HEIGHT },
        template: { $player, $setting }
      } = this.art;
      if (controls.setting && this.show) {
        const settingWidth = this.active[0]?.$parent?.width || SETTING_WIDTH;
        const { left: controlLeft, width: controlWidth } = getRect(controls.setting);
        const { left: playerLeft, width: playerWidth } = getRect($player);
        const settingLeft = controlLeft - playerLeft + controlWidth / 2 - settingWidth / 2;
        const settingHeight = this.active === this.option ? this.active.length * SETTING_ITEM_HEIGHT : (this.active.length + 1) * SETTING_ITEM_HEIGHT;
        setStyle($setting, "height", `${settingHeight}px`);
        setStyle($setting, "width", `${settingWidth}px`);
        if (this.art.isRotate || isMobile)
          return;
        if (settingLeft + settingWidth > playerWidth) {
          setStyle($setting, "left", null);
          setStyle($setting, "right", null);
        } else {
          setStyle($setting, "left", `${settingLeft}px`);
          setStyle($setting, "right", "auto");
        }
      }
    }
    inactivate(item) {
      for (let index = 0; index < item.$events.length; index++) {
        this.art.events.remove(item.$events[index]);
      }
      item.$events.length = 0;
    }
    remove(name) {
      const item = this.find(name);
      errorHandle(item, `Can't find [${name}] in the [setting]`);
      const index = item.$option.indexOf(item);
      item.$option.splice(index, 1);
      this.inactivate(item);
      if (item.$item)
        remove(item.$item);
      this.render();
    }
    update(target) {
      const item = this.find(target.name);
      if (item) {
        this.inactivate(item);
        Object.assign(item, target);
        this.format();
        this.createItem(item, true);
        this.render();
        return item;
      } else {
        return this.add(target);
      }
    }
    add(item, option = this.option) {
      option.push(item);
      this.format();
      this.createItem(item);
      this.render();
      return item;
    }
    createHeader(item) {
      if (!this.cache.has(item.$option))
        return;
      const $panel = this.cache.get(item.$option);
      const {
        proxy,
        icons: { arrowLeft: arrowLeft2 },
        constructor: { SETTING_ITEM_HEIGHT }
      } = this.art;
      const $item = createElement("div");
      setStyle($item, "height", `${SETTING_ITEM_HEIGHT}px`);
      addClass($item, "art-setting-item");
      addClass($item, "art-setting-item-back");
      const $left = append($item, '<div class="art-setting-item-left"></div>');
      const $icon = createElement("div");
      addClass($icon, "art-setting-item-left-icon");
      append($icon, arrowLeft2);
      append($left, $icon);
      append($left, item.$parent.html);
      const event = proxy($item, "click", () => this.render(item.$parents));
      item.$parent.$events.push(event);
      append($panel, $item);
    }
    createItem(item, isUpdate = false) {
      if (!this.cache.has(item.$option))
        return;
      const $panel = this.cache.get(item.$option);
      const oldItem = item.$item;
      let type = "selector";
      if (has(item, "switch")) {
        type = "switch";
      }
      if (has(item, "range")) {
        type = "range";
      }
      if (has(item, "onClick")) {
        type = "button";
      }
      const { icons, proxy, constructor } = this.art;
      const $item = createElement("div");
      addClass($item, "art-setting-item");
      setStyle($item, "height", `${constructor.SETTING_ITEM_HEIGHT}px`);
      $item.dataset.name = item.name || "";
      $item.dataset.value = item.value || "";
      const $left = append($item, '<div class="art-setting-item-left"></div>');
      const $right = append($item, '<div class="art-setting-item-right"></div>');
      const $icon = createElement("div");
      addClass($icon, "art-setting-item-left-icon");
      switch (type) {
        case "button":
        case "switch":
        case "range":
          append($icon, item.icon || icons.config);
          break;
        case "selector":
          if (item.selector?.length) {
            append($icon, item.icon || icons.config);
          } else {
            append($icon, icons.check);
          }
          break;
      }
      append($left, $icon);
      def(item, "$icon", {
        configurable: true,
        get: () => $icon
      });
      def(item, "icon", {
        configurable: true,
        get() {
          return $icon.innerHTML;
        },
        set(value) {
          $icon.innerHTML = "";
          append($icon, value);
        }
      });
      const $html = createElement("div");
      addClass($html, "art-setting-item-left-text");
      append($html, item.html || "");
      append($left, $html);
      def(item, "$html", {
        configurable: true,
        get: () => $html
      });
      def(item, "html", {
        configurable: true,
        get() {
          return $html.innerHTML;
        },
        set(value) {
          $html.innerHTML = "";
          append($html, value);
        }
      });
      const $tooltip = createElement("div");
      addClass($tooltip, "art-setting-item-right-tooltip");
      append($tooltip, item.tooltip || "");
      append($right, $tooltip);
      def(item, "$tooltip", {
        configurable: true,
        get: () => $tooltip
      });
      def(item, "tooltip", {
        configurable: true,
        get() {
          return $tooltip.innerHTML;
        },
        set(value) {
          $tooltip.innerHTML = "";
          append($tooltip, value);
        }
      });
      switch (type) {
        case "switch": {
          const $switch = createElement("div");
          addClass($switch, "art-setting-item-right-icon");
          const $switchOn = append($switch, icons.switchOn);
          const $switchOff = append($switch, icons.switchOff);
          setStyle(item.switch ? $switchOff : $switchOn, "display", "none");
          append($right, $switch);
          def(item, "$switch", {
            configurable: true,
            get: () => $switch
          });
          let $switchValue = item.switch;
          def(item, "switch", {
            configurable: true,
            get: () => $switchValue,
            set(value) {
              $switchValue = value;
              if (value) {
                setStyle($switchOff, "display", "none");
                setStyle($switchOn, "display", null);
              } else {
                setStyle($switchOff, "display", null);
                setStyle($switchOn, "display", "none");
              }
            }
          });
          break;
        }
        case "range":
          {
            const $state = createElement("div");
            addClass($state, "art-setting-item-right-icon");
            const $range = append($state, '<input type="range">');
            $range.value = item.range[0];
            $range.min = item.range[1];
            $range.max = item.range[2];
            $range.step = item.range[3];
            addClass($range, "art-setting-range");
            append($right, $state);
            def(item, "$range", {
              configurable: true,
              get: () => $range
            });
            let $rangeValue = [...item.range];
            def(item, "range", {
              configurable: true,
              get: () => $rangeValue,
              set(value) {
                $rangeValue = [...value];
                $range.value = value[0];
                $range.min = value[1];
                $range.max = value[2];
                $range.step = value[3];
              }
            });
          }
          break;
        case "selector":
          if (item.selector?.length) {
            const $state = createElement("div");
            addClass($state, "art-setting-item-right-icon");
            append($state, icons.arrowRight);
            append($right, $state);
          }
          break;
      }
      switch (type) {
        case "switch": {
          if (item.onSwitch) {
            const event = proxy($item, "click", async (event2) => {
              item.switch = await item.onSwitch.call(this.art, item, $item, event2);
            });
            item.$events.push(event);
          }
          break;
        }
        case "range": {
          if (item.$range) {
            if (item.onRange) {
              const event = proxy(item.$range, "change", async (event2) => {
                item.range[0] = item.$range.valueAsNumber;
                item.tooltip = await item.onRange.call(this.art, item, $item, event2);
              });
              item.$events.push(event);
            }
            if (item.onChange) {
              const event = proxy(item.$range, "input", async (event2) => {
                item.range[0] = item.$range.valueAsNumber;
                item.tooltip = await item.onChange.call(this.art, item, $item, event2);
              });
              item.$events.push(event);
            }
          }
          break;
        }
        case "selector":
          {
            const event = proxy($item, "click", async (event2) => {
              if (item.selector?.length) {
                this.render(item.selector);
              } else {
                this.check(item);
                if (item.$parent.onSelect) {
                  item.$parent.tooltip = await item.$parent.onSelect.call(this.art, item, $item, event2);
                }
              }
            });
            item.$events.push(event);
            if (item.default) {
              addClass($item, "art-current");
            }
          }
          break;
        case "button":
          if (item.onClick) {
            const event = proxy($item, "click", async (event2) => {
              item.tooltip = await item.onClick.call(this.art, item, $item, event2);
            });
            item.$events.push(event);
          }
          break;
      }
      def(item, "$item", {
        configurable: true,
        get: () => $item
      });
      if (isUpdate) {
        replaceElement($item, oldItem);
      } else {
        append($panel, $item);
      }
      if (item.mounted) {
        setTimeout(() => item.mounted.call(this.art, item.$item, item), 0);
      }
    }
    render(option = this.option) {
      this.active = option;
      if (this.cache.has(option)) {
        const $panel = this.cache.get(option);
        inverseClass($panel, "art-current");
      } else {
        const $panel = createElement("div");
        this.cache.set(option, $panel);
        addClass($panel, "art-setting-panel");
        append(this.$parent, $panel);
        inverseClass($panel, "art-current");
        if (option[0]?.$parent) {
          this.createHeader(option[0]);
        }
        for (let index = 0; index < option.length; index++) {
          this.createItem(option[index]);
        }
      }
      this.resize();
    }
  }
  class Storage {
    constructor() {
      this.name = "artplayer_settings";
      this.settings = {};
    }
    get(key) {
      try {
        const storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
        return key ? storage[key] : storage;
      } catch {
        return key ? this.settings[key] : this.settings;
      }
    }
    set(key, value) {
      try {
        const storage = Object.assign({}, this.get(), {
          [key]: value
        });
        window.localStorage.setItem(this.name, JSON.stringify(storage));
      } catch {
        this.settings[key] = value;
      }
    }
    del(key) {
      try {
        const storage = this.get();
        delete storage[key];
        window.localStorage.setItem(this.name, JSON.stringify(storage));
      } catch {
        delete this.settings[key];
      }
    }
    clear() {
      try {
        window.localStorage.removeItem(this.name);
      } catch {
        this.settings = {};
      }
    }
  }
  const style = ".art-video-player {\n  --art-theme: #f00;\n  --art-font-color: #fff;\n  --art-background-color: #000;\n  --art-text-shadow-color: rgba(0, 0, 0, 0.5);\n  --art-transition-duration: 0.2s;\n  --art-padding: 10px;\n  --art-border-radius: 3px;\n  --art-progress-height: 6px;\n  --art-progress-color: rgba(255, 255, 255, 0.25);\n  --art-progress-top-gap: 10px;\n  --art-hover-color: rgba(255, 255, 255, 0.25);\n  --art-loaded-color: rgba(255, 255, 255, 0.25);\n  --art-state-size: 80px;\n  --art-state-opacity: 0.8;\n  --art-bottom-height: 100px;\n  --art-bottom-offset: 20px;\n  --art-bottom-gap: 5px;\n  --art-highlight-width: 8px;\n  --art-highlight-color: rgba(255, 255, 255, 0.5);\n  --art-control-height: 46px;\n  --art-control-opacity: 0.75;\n  --art-control-icon-size: 36px;\n  --art-control-icon-scale: 1.1;\n  --art-volume-height: 120px;\n  --art-volume-handle-size: 14px;\n  --art-lock-size: 36px;\n  --art-indicator-scale: 0;\n  --art-indicator-size: 16px;\n  --art-fullscreen-web-index: 9999;\n  --art-settings-icon-size: 24px;\n  --art-settings-max-height: 300px;\n  --art-selector-max-height: 300px;\n  --art-contextmenus-min-width: 250px;\n  --art-subtitle-font-size: 20px;\n  --art-subtitle-gap: 5px;\n  --art-subtitle-bottom: 15px;\n  --art-subtitle-border: #000;\n  --art-widget-background: rgba(0, 0, 0, 0.85);\n  --art-tip-background: rgba(0, 0, 0, 0.7);\n  --art-scrollbar-size: 4px;\n  --art-scrollbar-background: rgba(255, 255, 255, 0.25);\n  --art-scrollbar-background-hover: rgba(255, 255, 255, 0.5);\n  --art-mini-progress-height: 2px;\n}\n.art-bg-cover {\n  background-position: center center;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.art-bottom-gradient {\n  background-image: linear-gradient(to top, #000, rgba(0, 0, 0, 0.4), transparent);\n  background-repeat: repeat-x;\n  background-position: center bottom;\n}\n.art-backdrop-filter {\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n  backdrop-filter: saturate(180%) blur(20px);\n  background-color: rgba(0, 0, 0, 0.75) !important;\n}\n.art-truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.art-video-player {\n  position: relative;\n  margin: 0 auto;\n  width: 100%;\n  height: 100%;\n  outline: 0;\n  zoom: 1;\n  padding: 0;\n  text-align: left;\n  direction: ltr;\n  font-size: 14px;\n  line-height: 1.3;\n  user-select: none;\n  box-sizing: border-box;\n  color: var(--art-font-color);\n  background-color: var(--art-background-color);\n  text-shadow: 0 0 2px var(--art-text-shadow-color);\n  font-family: PingFang SC, Helvetica Neue, Microsoft YaHei, Roboto, Arial, sans-serif;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  -ms-touch-action: manipulation;\n  touch-action: manipulation;\n  -ms-high-contrast-adjust: none;\n}\n.art-video-player *,\n.art-video-player *::before,\n.art-video-player *::after {\n  box-sizing: border-box;\n}\n.art-video-player ::-webkit-scrollbar {\n  width: var(--art-scrollbar-size);\n  height: var(--art-scrollbar-size);\n}\n.art-video-player ::-webkit-scrollbar-thumb {\n  background-color: var(--art-scrollbar-background);\n}\n.art-video-player ::-webkit-scrollbar-thumb:hover {\n  background-color: var(--art-scrollbar-background-hover);\n}\n.art-video-player img {\n  max-width: 100%;\n  vertical-align: top;\n}\n.art-video-player svg {\n  fill: var(--art-font-color);\n}\n.art-video-player a {\n  color: var(--art-font-color);\n  text-decoration: none;\n}\n.art-icon {\n  line-height: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.art-video-player.art-backdrop .art-contextmenus,\n.art-video-player.art-backdrop .art-info,\n.art-video-player.art-backdrop .art-settings,\n.art-video-player.art-backdrop .art-layer-auto-playback,\n.art-video-player.art-backdrop .art-selector-list,\n.art-video-player.art-backdrop .art-volume-inner {\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n  backdrop-filter: saturate(180%) blur(20px);\n  background-color: rgba(0, 0, 0, 0.75) !important;\n}\n.art-video {\n  position: absolute;\n  inset: 0;\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n}\n.art-poster {\n  position: absolute;\n  inset: 0;\n  z-index: 11;\n  width: 100%;\n  height: 100%;\n  background-position: center center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  pointer-events: none;\n}\n.art-video-player .art-subtitle {\n  display: none;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  position: absolute;\n  z-index: 20;\n  width: 100%;\n  padding: 0 5%;\n  text-align: center;\n  pointer-events: none;\n  gap: var(--art-subtitle-gap);\n  bottom: var(--art-subtitle-bottom);\n  font-size: var(--art-subtitle-font-size);\n  transition: bottom var(--art-transition-duration) ease;\n  text-shadow: var(--art-subtitle-border) 1px 0 1px, var(--art-subtitle-border) 0 1px 1px, var(--art-subtitle-border) -1px 0 1px, var(--art-subtitle-border) 0 -1px 1px, var(--art-subtitle-border) 1px 1px 1px, var(--art-subtitle-border) -1px -1px 1px, var(--art-subtitle-border) 1px -1px 1px, var(--art-subtitle-border) -1px 1px 1px;\n}\n.art-video-player.art-subtitle-show .art-subtitle {\n  display: flex;\n}\n.art-video-player.art-control-show .art-subtitle {\n  bottom: calc(var(--art-control-height) + var(--art-subtitle-bottom));\n}\n.art-danmuku {\n  position: absolute;\n  inset: 0;\n  z-index: 30;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  overflow: hidden;\n}\n.art-video-player .art-layers {\n  position: absolute;\n  inset: 0;\n  z-index: 40;\n  width: 100%;\n  height: 100%;\n  display: none;\n  pointer-events: none;\n}\n.art-video-player .art-layers .art-layer {\n  pointer-events: auto;\n}\n.art-video-player.art-layer-show .art-layers {\n  display: flex;\n}\n.art-video-player .art-mask {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  inset: 0;\n  z-index: 50;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.art-video-player .art-mask .art-state {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  opacity: 0;\n  transform: scale(2);\n  width: var(--art-state-size);\n  height: var(--art-state-size);\n  transition: all var(--art-transition-duration) ease;\n}\n.art-video-player.art-mask-show .art-state {\n  pointer-events: auto;\n  opacity: var(--art-state-opacity);\n  transform: scale(1);\n}\n.art-video-player.art-loading-show .art-state {\n  display: none;\n}\n.art-video-player .art-loading {\n  display: none;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  inset: 0;\n  z-index: 70;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.art-video-player.art-loading-show .art-loading {\n  display: flex;\n}\n.art-video-player.art-loading-show .art-mask {\n  display: none;\n}\n.art-video-player .art-bottom {\n  position: absolute;\n  inset: 0;\n  z-index: 60;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  opacity: 0;\n  overflow: hidden;\n  pointer-events: none;\n  padding: 0 var(--art-padding);\n  transition: all var(--art-transition-duration) ease;\n  background-size: 100% var(--art-bottom-height);\n  background-image: linear-gradient(to top, #000, rgba(0, 0, 0, 0.4), transparent);\n  background-repeat: repeat-x;\n  background-position: center bottom;\n}\n.art-video-player .art-bottom .art-controls,\n.art-video-player .art-bottom .art-progress {\n  transform: translateY(var(--art-bottom-offset));\n  transition: transform var(--art-transition-duration) ease;\n}\n.art-video-player.art-control-show .art-bottom,\n.art-video-player.art-hover .art-bottom {\n  opacity: 1;\n}\n.art-video-player.art-control-show .art-bottom .art-controls,\n.art-video-player.art-hover .art-bottom .art-controls,\n.art-video-player.art-control-show .art-bottom .art-progress,\n.art-video-player.art-hover .art-bottom .art-progress {\n  transform: translateY(0);\n}\n.art-bottom .art-progress {\n  position: relative;\n  z-index: 0;\n  cursor: pointer;\n  pointer-events: auto;\n  padding-top: var(--art-progress-top-gap);\n  padding-bottom: var(--art-bottom-gap);\n}\n.art-bottom .art-progress .art-control-progress {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: var(--art-progress-height);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner {\n  display: flex;\n  align-items: center;\n  position: relative;\n  height: 50%;\n  width: 100%;\n  transition: height var(--art-transition-duration) ease;\n  background-color: var(--art-progress-color);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-hover {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  width: 0%;\n  background-color: var(--art-hover-color);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-loaded {\n  position: absolute;\n  inset: 0;\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n  width: 0%;\n  background-color: var(--art-loaded-color);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-played {\n  position: absolute;\n  inset: 0;\n  z-index: 20;\n  width: 100%;\n  height: 100%;\n  width: 0%;\n  background-color: var(--art-theme);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight {\n  position: absolute;\n  inset: 0;\n  z-index: 30;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight span {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  right: auto;\n  pointer-events: auto;\n  width: var(--art-highlight-width) !important;\n  transform: translateX(calc(var(--art-highlight-width) / -2));\n  background-color: var(--art-highlight-color);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  z-index: 40;\n  left: 0;\n  border-radius: 50%;\n  width: var(--art-indicator-size);\n  height: var(--art-indicator-size);\n  transform: scale(var(--art-indicator-scale));\n  margin-left: calc(var(--art-indicator-size) / -2);\n  transition: transform var(--art-transition-duration) ease;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator .art-icon {\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator:hover {\n  transform: scale(1.2) !important;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator:active {\n  transform: scale(1) !important;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip {\n  transform-origin: bottom center;\n  transform: scale(0.5);\n  opacity: 0;\n  position: absolute;\n  z-index: 50;\n  top: -25px;\n  left: 0;\n  padding: 3px 5px;\n  line-height: 1;\n  font-size: 12px;\n  border-radius: var(--art-border-radius);\n  white-space: nowrap;\n  background-color: var(--art-tip-background);\n  transition: transform var(--art-transition-duration) ease, opacity var(--art-transition-duration) ease;\n}\n.art-bottom .art-progress .art-control-thumbnails {\n  transform-origin: bottom center;\n  transform: scale(0.5);\n  opacity: 0;\n  position: absolute;\n  bottom: calc(var(--art-bottom-gap) + 10px);\n  left: 0;\n  border-radius: var(--art-border-radius);\n  pointer-events: none;\n  background-color: var(--art-widget-background);\n  transition: transform var(--art-transition-duration) ease, opacity var(--art-transition-duration) ease;\n  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2);\n}\n.art-bottom .art-progress:hover .art-control-progress .art-control-progress-inner {\n  height: 100%;\n}\n.art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  transform: scale(1);\n}\n.art-progress-hover .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip,\n.art-progress-hover .art-bottom .art-progress .art-control-thumbnails {\n  transform: scale(1);\n  opacity: 1;\n}\n.art-video-player .art-controls {\n  position: relative;\n  z-index: 10;\n  pointer-events: auto;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: var(--art-control-height);\n}\n.art-video-player .art-controls .art-controls-left,\n.art-video-player .art-controls .art-controls-right {\n  display: flex;\n  height: 100%;\n}\n.art-video-player .art-controls .art-controls-center {\n  display: none;\n  justify-content: center;\n  align-items: center;\n  flex: 1;\n  height: 100%;\n  padding: 0 10px;\n}\n.art-video-player .art-controls .art-controls-right {\n  justify-content: flex-end;\n}\n.art-video-player .art-controls .art-control {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-shrink: 0;\n  cursor: pointer;\n  white-space: nowrap;\n  opacity: var(--art-control-opacity);\n  min-height: var(--art-control-height);\n  min-width: var(--art-control-height);\n  transition: opacity var(--art-transition-duration) ease;\n}\n.art-video-player .art-controls .art-control .art-icon {\n  height: var(--art-control-icon-size);\n  width: var(--art-control-icon-size);\n  transform: scale(var(--art-control-icon-scale));\n  transition: transform var(--art-transition-duration) ease;\n}\n.art-video-player .art-controls .art-control .art-icon:active {\n  transform: scale(calc(var(--art-control-icon-scale) * 0.8));\n}\n.art-video-player .art-controls .art-control:hover {\n  opacity: 1;\n}\n.art-control-volume {\n  position: relative;\n}\n.art-control-volume .art-volume-panel {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  left: 0;\n  right: 0;\n  padding: 0 5px;\n  font-size: 12px;\n  text-align: center;\n  cursor: default;\n  opacity: 0;\n  transform: translateY(10px);\n  pointer-events: none;\n  bottom: var(--art-control-height);\n  width: var(--art-control-height);\n  height: var(--art-volume-height);\n  transition: all var(--art-transition-duration) ease;\n}\n.art-control-volume .art-volume-panel .art-volume-inner {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n  height: 100%;\n  width: 100%;\n  padding: 10px 0 12px;\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-widget-background);\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider {\n  flex: 1;\n  width: 100%;\n  display: flex;\n  cursor: pointer;\n  position: relative;\n  justify-content: center;\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-handle {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  width: 2px;\n  border-radius: var(--art-border-radius);\n  overflow: hidden;\n  background-color: rgba(255, 255, 255, 0.25);\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-handle .art-volume-loaded {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  background-color: var(--art-theme);\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-indicator {\n  position: absolute;\n  width: var(--art-volume-handle-size);\n  height: var(--art-volume-handle-size);\n  margin-top: calc(var(--art-volume-handle-size) / -2);\n  flex-shrink: 0;\n  transform: scale(1);\n  border-radius: 100%;\n  background-color: var(--art-theme);\n  transition: transform var(--art-transition-duration) ease;\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider:active .art-volume-indicator {\n  transform: scale(0.9);\n}\n.art-control-volume:hover .art-volume-panel {\n  opacity: 1;\n  transform: translateY(0);\n  pointer-events: auto;\n}\n.art-video-player .art-notice {\n  display: none;\n  position: absolute;\n  inset: 0;\n  z-index: 80;\n  width: 100%;\n  height: 100%;\n  height: auto;\n  bottom: auto;\n  padding: var(--art-padding);\n  pointer-events: none;\n}\n.art-video-player .art-notice .art-notice-inner {\n  display: inline-flex;\n  padding: 5px;\n  line-height: 1;\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-tip-background);\n}\n.art-video-player.art-notice-show .art-notice {\n  display: flex;\n}\n.art-video-player .art-contextmenus {\n  display: none;\n  flex-direction: column;\n  position: absolute;\n  z-index: 120;\n  padding: 5px 0;\n  border-radius: var(--art-border-radius);\n  font-size: 12px;\n  background-color: var(--art-widget-background);\n  min-width: var(--art-contextmenus-min-width);\n}\n.art-video-player .art-contextmenus .art-contextmenu {\n  cursor: pointer;\n  display: flex;\n  padding: 10px 15px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n.art-video-player .art-contextmenus .art-contextmenu span {\n  padding: 0 8px;\n}\n.art-video-player .art-contextmenus .art-contextmenu span:hover,\n.art-video-player .art-contextmenus .art-contextmenu span.art-current {\n  color: var(--art-theme);\n}\n.art-video-player .art-contextmenus .art-contextmenu:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.art-video-player .art-contextmenus .art-contextmenu:last-child {\n  border-bottom: none;\n}\n.art-video-player.art-contextmenu-show .art-contextmenus {\n  display: flex;\n}\n.art-video-player .art-settings {\n  display: none;\n  flex-direction: column;\n  position: absolute;\n  z-index: 90;\n  left: auto;\n  overflow-y: auto;\n  overflow-x: hidden;\n  border-radius: var(--art-border-radius);\n  max-height: var(--art-settings-max-height);\n  right: var(--art-padding);\n  bottom: var(--art-control-height);\n  transition: all var(--art-transition-duration) ease;\n  background-color: var(--art-widget-background);\n}\n.art-video-player .art-settings .art-setting-panel {\n  display: none;\n  flex-direction: column;\n}\n.art-video-player .art-settings .art-setting-panel.art-current {\n  display: flex;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 5px;\n  cursor: pointer;\n  overflow: hidden;\n  transition: background-color var(--art-transition-duration) ease;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current {\n  color: var(--art-theme);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon-check {\n  visibility: hidden;\n  height: 15px;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current .art-icon-check {\n  visibility: visible;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-shrink: 0;\n  gap: 5px;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left .art-setting-item-left-icon {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: var(--art-settings-icon-size);\n  width: var(--art-settings-icon-size);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 5px;\n  font-size: 12px;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-tooltip {\n  white-space: nowrap;\n  color: rgba(255, 255, 255, 0.5);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-icon {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-width: 32px;\n  height: 24px;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-range {\n  height: 3px;\n  width: 80px;\n  outline: none;\n  appearance: none;\n  background-color: rgba(255, 255, 255, 0.2);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item-back {\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n.art-video-player.art-setting-show .art-settings {\n  display: flex;\n}\n.art-video-player .art-info {\n  display: none;\n  position: absolute;\n  left: var(--art-padding);\n  top: var(--art-padding);\n  z-index: 100;\n  padding: 10px;\n  font-size: 12px;\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-widget-background);\n}\n.art-video-player .art-info .art-info-panel {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n.art-video-player .art-info .art-info-panel .art-info-item {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n.art-video-player .art-info .art-info-panel .art-info-item .art-info-title {\n  width: 100px;\n  text-align: right;\n}\n.art-video-player .art-info .art-info-panel .art-info-item .art-info-content {\n  width: 250px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  user-select: all;\n}\n.art-video-player .art-info .art-info-close {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  cursor: pointer;\n}\n.art-video-player.art-info-show .art-info {\n  display: flex;\n}\n.art-hide-cursor * {\n  cursor: none !important;\n}\n.art-video-player[data-aspect-ratio] {\n  overflow: hidden;\n}\n.art-video-player[data-aspect-ratio] .art-video {\n  object-fit: fill;\n  box-sizing: content-box;\n}\n.art-fullscreen {\n  --art-progress-height: 8px;\n  --art-indicator-size: 20px;\n  --art-control-height: 60px;\n  --art-control-icon-scale: 1.3;\n}\n.art-fullscreen-web {\n  --art-progress-height: 8px;\n  --art-indicator-size: 20px;\n  --art-control-height: 60px;\n  --art-control-icon-scale: 1.3;\n  position: fixed;\n  inset: 0;\n  z-index: var(--art-fullscreen-web-index);\n  width: 100%;\n  height: 100%;\n}\n.art-mini-popup {\n  position: fixed;\n  z-index: 9999;\n  width: 320px;\n  height: 180px;\n  background: #000;\n  border-radius: var(--art-border-radius);\n  cursor: move;\n  user-select: none;\n  overflow: hidden;\n  transition: opacity 0.2s ease;\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);\n}\n.art-mini-popup svg {\n  fill: #fff;\n}\n.art-mini-popup .art-video {\n  pointer-events: none;\n}\n.art-mini-popup .art-mini-close {\n  position: absolute;\n  z-index: 20;\n  right: 10px;\n  top: 10px;\n  cursor: pointer;\n  opacity: 0;\n  transition: opacity 0.2s ease;\n}\n.art-mini-popup .art-mini-state {\n  position: absolute;\n  inset: 0;\n  z-index: 30;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 0.2s ease;\n  background-color: rgba(0, 0, 0, 0.25);\n}\n.art-mini-popup .art-mini-state .art-icon {\n  opacity: 0.75;\n  cursor: pointer;\n  transform: scale(3);\n  pointer-events: auto;\n  transition: transform 0.2s ease;\n}\n.art-mini-popup .art-mini-state .art-icon:active {\n  transform: scale(2.5);\n}\n.art-mini-popup.art-mini-dragging {\n  opacity: 0.9;\n}\n.art-mini-popup:hover .art-mini-close,\n.art-mini-popup:hover .art-mini-state {\n  opacity: 1;\n}\n.art-video-player[data-flip='horizontal'] .art-video {\n  transform: scaleX(-1);\n}\n.art-video-player[data-flip='vertical'] .art-video {\n  transform: scaleY(-1);\n}\n.art-video-player .art-layer-lock {\n  display: none;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  top: 50%;\n  border-radius: 50%;\n  transform: translateY(-50%);\n  height: var(--art-lock-size);\n  width: var(--art-lock-size);\n  left: var(--art-padding);\n  background-color: var(--art-tip-background);\n}\n.art-video-player .art-layer-auto-playback {\n  display: none;\n  gap: 10px;\n  align-items: center;\n  position: absolute;\n  border-radius: var(--art-border-radius);\n  padding: 10px;\n  line-height: 1;\n  left: var(--art-padding);\n  bottom: calc(var(--art-control-height) + var(--art-bottom-gap) + 10px);\n  background-color: var(--art-widget-background);\n}\n.art-video-player .art-layer-auto-playback .art-auto-playback-close {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n}\n.art-video-player .art-layer-auto-playback .art-auto-playback-close svg {\n  width: 15px;\n  height: 15px;\n  fill: var(--art-theme);\n}\n.art-video-player .art-layer-auto-playback .art-auto-playback-jump {\n  color: var(--art-theme);\n  cursor: pointer;\n}\n.art-video-player.art-lock .art-subtitle {\n  bottom: var(--art-subtitle-bottom) !important;\n}\n.art-video-player.art-mini-progress-bar .art-bottom,\n.art-video-player.art-lock .art-bottom {\n  opacity: 1;\n  padding: 0;\n  background-image: none;\n}\n.art-video-player.art-mini-progress-bar .art-bottom .art-controls,\n.art-video-player.art-lock .art-bottom .art-controls,\n.art-video-player.art-mini-progress-bar .art-bottom .art-progress,\n.art-video-player.art-lock .art-bottom .art-progress {\n  transform: translateY(calc(var(--art-control-height) + var(--art-bottom-gap) + var(--art-progress-height) / 4));\n}\n.art-video-player.art-mini-progress-bar .art-bottom .art-progress-indicator,\n.art-video-player.art-lock .art-bottom .art-progress-indicator {\n  display: none !important;\n}\n.art-video-player.art-control-show .art-layer-lock {\n  display: flex;\n}\n.art-control-selector {\n  position: relative;\n  display: flex;\n  justify-content: center;\n}\n.art-control-selector .art-selector-list {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  position: absolute;\n  border-radius: var(--art-border-radius);\n  overflow-y: auto;\n  overflow-x: hidden;\n  opacity: 0;\n  transform: translateY(10px);\n  pointer-events: none;\n  bottom: var(--art-control-height);\n  max-height: var(--art-selector-max-height);\n  background-color: var(--art-widget-background);\n  transition: all var(--art-transition-duration) ease;\n}\n.art-control-selector .art-selector-list .art-selector-item {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  padding: 10px 15px;\n  flex-shrink: 0;\n  line-height: 1;\n}\n.art-control-selector .art-selector-list .art-selector-item:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.art-control-selector .art-selector-list .art-selector-item:hover,\n.art-control-selector .art-selector-list .art-selector-item.art-current {\n  color: var(--art-theme);\n}\n.art-control-selector:hover .art-selector-list {\n  opacity: 1;\n  transform: translateY(0);\n  pointer-events: auto;\n}\n.art-video-player {\n  /*! Hint.css - v2.7.0 - 2021-10-01\n    * https://kushagra.dev/lab/hint/\n    * Copyright (c) 2021 Kushagra Gour */\n  /*-------------------------------------*\\\n        HINT.css - A CSS tooltip library\n    \\*-------------------------------------*/\n  /**\n    * HINT.css is a tooltip library made in pure CSS.\n    *\n    * Source: https://github.com/chinchang/hint.css\n    * Demo: http://kushagragour.in/lab/hint/\n    *\n    */\n  /**\n    * source: hint-core.scss\n    *\n    * Defines the basic styling for the tooltip.\n    * Each tooltip is made of 2 parts:\n    * 	1) body (:after)\n    * 	2) arrow (:before)\n    *\n    * Classes added:\n    * 	1) hint\n    */\n  /**\n    * source: hint-position.scss\n    *\n    * Defines the positoning logic for the tooltips.\n    *\n    * Classes added:\n    * 	1) hint--top\n    * 	2) hint--bottom\n    * 	3) hint--left\n    * 	4) hint--right\n    */\n  /**\n    * set default color for tooltip arrows\n    */\n  /**\n    * top tooltip\n    */\n  /**\n    * bottom tooltip\n    */\n  /**\n    * right tooltip\n    */\n  /**\n    * left tooltip\n    */\n  /**\n    * top-left tooltip\n    */\n  /**\n    * top-right tooltip\n    */\n  /**\n    * bottom-left tooltip\n    */\n  /**\n    * bottom-right tooltip\n    */\n  /**\n    * source: hint-sizes.scss\n    *\n    * Defines width restricted tooltips that can span\n    * across multiple lines.\n    *\n    * Classes added:\n    * 	1) hint--small\n    * 	2) hint--medium\n    * 	3) hint--large\n    *\n    */\n  /**\n    * source: hint-theme.scss\n    *\n    * Defines basic theme for tooltips.\n    *\n    */\n  /**\n    * source: hint-color-types.scss\n    *\n    * Contains tooltips of various types based on color differences.\n    *\n    * Classes added:\n    * 	1) hint--error\n    * 	2) hint--warning\n    * 	3) hint--info\n    * 	4) hint--success\n    *\n    */\n  /**\n    * Error\n    */\n  /**\n    * Warning\n    */\n  /**\n    * Info\n    */\n  /**\n    * Success\n    */\n  /**\n    * source: hint-always.scss\n    *\n    * Defines a persisted tooltip which shows always.\n    *\n    * Classes added:\n    * 	1) hint--always\n    *\n    */\n  /**\n    * source: hint-rounded.scss\n    *\n    * Defines rounded corner tooltips.\n    *\n    * Classes added:\n    * 	1) hint--rounded\n    *\n    */\n  /**\n    * source: hint-effects.scss\n    *\n    * Defines various transition effects for the tooltips.\n    *\n    * Classes added:\n    * 	1) hint--no-animate\n    * 	2) hint--bounce\n    *\n    */\n}\n.art-video-player [class*='hint--'] {\n  position: relative;\n  display: inline-block;\n  font-style: normal;\n  /**\n        * tooltip arrow\n        */\n  /**\n        * tooltip body\n        */\n}\n.art-video-player [class*='hint--']:before,\n.art-video-player [class*='hint--']:after {\n  position: absolute;\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  visibility: hidden;\n  opacity: 0;\n  z-index: 1000000;\n  pointer-events: none;\n  -webkit-transition: 0.3s ease;\n  -moz-transition: 0.3s ease;\n  transition: 0.3s ease;\n  -webkit-transition-delay: 0ms;\n  -moz-transition-delay: 0ms;\n  transition-delay: 0ms;\n}\n.art-video-player [class*='hint--']:hover:before,\n.art-video-player [class*='hint--']:hover:after {\n  visibility: visible;\n  opacity: 1;\n}\n.art-video-player [class*='hint--']:hover:before,\n.art-video-player [class*='hint--']:hover:after {\n  -webkit-transition-delay: 100ms;\n  -moz-transition-delay: 100ms;\n  transition-delay: 100ms;\n}\n.art-video-player [class*='hint--']:before {\n  content: '';\n  position: absolute;\n  background: transparent;\n  border: 6px solid transparent;\n  z-index: 1000001;\n}\n.art-video-player [class*='hint--']:after {\n  background: #000000;\n  color: white;\n  padding: 8px 10px;\n  font-size: 12px;\n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  line-height: 12px;\n  white-space: nowrap;\n}\n.art-video-player [class*='hint--'][aria-label]:after {\n  content: attr(aria-label);\n}\n.art-video-player [class*='hint--'][data-hint]:after {\n  content: attr(data-hint);\n}\n.art-video-player [aria-label='']:before,\n.art-video-player [aria-label='']:after,\n.art-video-player [data-hint='']:before,\n.art-video-player [data-hint='']:after {\n  display: none !important;\n}\n.art-video-player .hint--top-left:before {\n  border-top-color: #000000;\n}\n.art-video-player .hint--top-right:before {\n  border-top-color: #000000;\n}\n.art-video-player .hint--top:before {\n  border-top-color: #000000;\n}\n.art-video-player .hint--bottom-left:before {\n  border-bottom-color: #000000;\n}\n.art-video-player .hint--bottom-right:before {\n  border-bottom-color: #000000;\n}\n.art-video-player .hint--bottom:before {\n  border-bottom-color: #000000;\n}\n.art-video-player .hint--left:before {\n  border-left-color: #000000;\n}\n.art-video-player .hint--right:before {\n  border-right-color: #000000;\n}\n.art-video-player .hint--top:before {\n  margin-bottom: -11px;\n}\n.art-video-player .hint--top:before,\n.art-video-player .hint--top:after {\n  bottom: 100%;\n  left: 50%;\n}\n.art-video-player .hint--top:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--top:after {\n  -webkit-transform: translateX(-50%);\n  -moz-transform: translateX(-50%);\n  transform: translateX(-50%);\n}\n.art-video-player .hint--top:hover:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--top:hover:after {\n  -webkit-transform: translateX(-50%) translateY(-8px);\n  -moz-transform: translateX(-50%) translateY(-8px);\n  transform: translateX(-50%) translateY(-8px);\n}\n.art-video-player .hint--bottom:before {\n  margin-top: -11px;\n}\n.art-video-player .hint--bottom:before,\n.art-video-player .hint--bottom:after {\n  top: 100%;\n  left: 50%;\n}\n.art-video-player .hint--bottom:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--bottom:after {\n  -webkit-transform: translateX(-50%);\n  -moz-transform: translateX(-50%);\n  transform: translateX(-50%);\n}\n.art-video-player .hint--bottom:hover:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--bottom:hover:after {\n  -webkit-transform: translateX(-50%) translateY(8px);\n  -moz-transform: translateX(-50%) translateY(8px);\n  transform: translateX(-50%) translateY(8px);\n}\n.art-video-player .hint--right:before {\n  margin-left: -11px;\n  margin-bottom: -6px;\n}\n.art-video-player .hint--right:after {\n  margin-bottom: -14px;\n}\n.art-video-player .hint--right:before,\n.art-video-player .hint--right:after {\n  left: 100%;\n  bottom: 50%;\n}\n.art-video-player .hint--right:hover:before {\n  -webkit-transform: translateX(8px);\n  -moz-transform: translateX(8px);\n  transform: translateX(8px);\n}\n.art-video-player .hint--right:hover:after {\n  -webkit-transform: translateX(8px);\n  -moz-transform: translateX(8px);\n  transform: translateX(8px);\n}\n.art-video-player .hint--left:before {\n  margin-right: -11px;\n  margin-bottom: -6px;\n}\n.art-video-player .hint--left:after {\n  margin-bottom: -14px;\n}\n.art-video-player .hint--left:before,\n.art-video-player .hint--left:after {\n  right: 100%;\n  bottom: 50%;\n}\n.art-video-player .hint--left:hover:before {\n  -webkit-transform: translateX(-8px);\n  -moz-transform: translateX(-8px);\n  transform: translateX(-8px);\n}\n.art-video-player .hint--left:hover:after {\n  -webkit-transform: translateX(-8px);\n  -moz-transform: translateX(-8px);\n  transform: translateX(-8px);\n}\n.art-video-player .hint--top-left:before {\n  margin-bottom: -11px;\n}\n.art-video-player .hint--top-left:before,\n.art-video-player .hint--top-left:after {\n  bottom: 100%;\n  left: 50%;\n}\n.art-video-player .hint--top-left:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--top-left:after {\n  -webkit-transform: translateX(-100%);\n  -moz-transform: translateX(-100%);\n  transform: translateX(-100%);\n}\n.art-video-player .hint--top-left:after {\n  margin-left: 12px;\n}\n.art-video-player .hint--top-left:hover:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--top-left:hover:after {\n  -webkit-transform: translateX(-100%) translateY(-8px);\n  -moz-transform: translateX(-100%) translateY(-8px);\n  transform: translateX(-100%) translateY(-8px);\n}\n.art-video-player .hint--top-right:before {\n  margin-bottom: -11px;\n}\n.art-video-player .hint--top-right:before,\n.art-video-player .hint--top-right:after {\n  bottom: 100%;\n  left: 50%;\n}\n.art-video-player .hint--top-right:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--top-right:after {\n  -webkit-transform: translateX(0);\n  -moz-transform: translateX(0);\n  transform: translateX(0);\n}\n.art-video-player .hint--top-right:after {\n  margin-left: -12px;\n}\n.art-video-player .hint--top-right:hover:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--top-right:hover:after {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--bottom-left:before {\n  margin-top: -11px;\n}\n.art-video-player .hint--bottom-left:before,\n.art-video-player .hint--bottom-left:after {\n  top: 100%;\n  left: 50%;\n}\n.art-video-player .hint--bottom-left:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--bottom-left:after {\n  -webkit-transform: translateX(-100%);\n  -moz-transform: translateX(-100%);\n  transform: translateX(-100%);\n}\n.art-video-player .hint--bottom-left:after {\n  margin-left: 12px;\n}\n.art-video-player .hint--bottom-left:hover:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--bottom-left:hover:after {\n  -webkit-transform: translateX(-100%) translateY(8px);\n  -moz-transform: translateX(-100%) translateY(8px);\n  transform: translateX(-100%) translateY(8px);\n}\n.art-video-player .hint--bottom-right:before {\n  margin-top: -11px;\n}\n.art-video-player .hint--bottom-right:before,\n.art-video-player .hint--bottom-right:after {\n  top: 100%;\n  left: 50%;\n}\n.art-video-player .hint--bottom-right:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--bottom-right:after {\n  -webkit-transform: translateX(0);\n  -moz-transform: translateX(0);\n  transform: translateX(0);\n}\n.art-video-player .hint--bottom-right:after {\n  margin-left: -12px;\n}\n.art-video-player .hint--bottom-right:hover:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--bottom-right:hover:after {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--small:after,\n.art-video-player .hint--medium:after,\n.art-video-player .hint--large:after {\n  white-space: normal;\n  line-height: 1.4em;\n  word-wrap: break-word;\n}\n.art-video-player .hint--small:after {\n  width: 80px;\n}\n.art-video-player .hint--medium:after {\n  width: 150px;\n}\n.art-video-player .hint--large:after {\n  width: 300px;\n}\n.art-video-player [class*='hint--'] {\n  /**\n        * tooltip body\n        */\n}\n.art-video-player [class*='hint--']:after {\n  text-shadow: 0 -1px 0px black;\n  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);\n}\n.art-video-player .hint--error:after {\n  background-color: #b34e4d;\n  text-shadow: 0 -1px 0px #592726;\n}\n.art-video-player .hint--error.hint--top-left:before {\n  border-top-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--top-right:before {\n  border-top-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--top:before {\n  border-top-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--bottom-left:before {\n  border-bottom-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--bottom-right:before {\n  border-bottom-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--bottom:before {\n  border-bottom-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--left:before {\n  border-left-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--right:before {\n  border-right-color: #b34e4d;\n}\n.art-video-player .hint--warning:after {\n  background-color: #c09854;\n  text-shadow: 0 -1px 0px #6c5328;\n}\n.art-video-player .hint--warning.hint--top-left:before {\n  border-top-color: #c09854;\n}\n.art-video-player .hint--warning.hint--top-right:before {\n  border-top-color: #c09854;\n}\n.art-video-player .hint--warning.hint--top:before {\n  border-top-color: #c09854;\n}\n.art-video-player .hint--warning.hint--bottom-left:before {\n  border-bottom-color: #c09854;\n}\n.art-video-player .hint--warning.hint--bottom-right:before {\n  border-bottom-color: #c09854;\n}\n.art-video-player .hint--warning.hint--bottom:before {\n  border-bottom-color: #c09854;\n}\n.art-video-player .hint--warning.hint--left:before {\n  border-left-color: #c09854;\n}\n.art-video-player .hint--warning.hint--right:before {\n  border-right-color: #c09854;\n}\n.art-video-player .hint--info:after {\n  background-color: #3986ac;\n  text-shadow: 0 -1px 0px #1a3c4d;\n}\n.art-video-player .hint--info.hint--top-left:before {\n  border-top-color: #3986ac;\n}\n.art-video-player .hint--info.hint--top-right:before {\n  border-top-color: #3986ac;\n}\n.art-video-player .hint--info.hint--top:before {\n  border-top-color: #3986ac;\n}\n.art-video-player .hint--info.hint--bottom-left:before {\n  border-bottom-color: #3986ac;\n}\n.art-video-player .hint--info.hint--bottom-right:before {\n  border-bottom-color: #3986ac;\n}\n.art-video-player .hint--info.hint--bottom:before {\n  border-bottom-color: #3986ac;\n}\n.art-video-player .hint--info.hint--left:before {\n  border-left-color: #3986ac;\n}\n.art-video-player .hint--info.hint--right:before {\n  border-right-color: #3986ac;\n}\n.art-video-player .hint--success:after {\n  background-color: #458746;\n  text-shadow: 0 -1px 0px #1a321a;\n}\n.art-video-player .hint--success.hint--top-left:before {\n  border-top-color: #458746;\n}\n.art-video-player .hint--success.hint--top-right:before {\n  border-top-color: #458746;\n}\n.art-video-player .hint--success.hint--top:before {\n  border-top-color: #458746;\n}\n.art-video-player .hint--success.hint--bottom-left:before {\n  border-bottom-color: #458746;\n}\n.art-video-player .hint--success.hint--bottom-right:before {\n  border-bottom-color: #458746;\n}\n.art-video-player .hint--success.hint--bottom:before {\n  border-bottom-color: #458746;\n}\n.art-video-player .hint--success.hint--left:before {\n  border-left-color: #458746;\n}\n.art-video-player .hint--success.hint--right:before {\n  border-right-color: #458746;\n}\n.art-video-player .hint--always:after,\n.art-video-player .hint--always:before {\n  opacity: 1;\n  visibility: visible;\n}\n.art-video-player .hint--always.hint--top:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--always.hint--top:after {\n  -webkit-transform: translateX(-50%) translateY(-8px);\n  -moz-transform: translateX(-50%) translateY(-8px);\n  transform: translateX(-50%) translateY(-8px);\n}\n.art-video-player .hint--always.hint--top-left:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--always.hint--top-left:after {\n  -webkit-transform: translateX(-100%) translateY(-8px);\n  -moz-transform: translateX(-100%) translateY(-8px);\n  transform: translateX(-100%) translateY(-8px);\n}\n.art-video-player .hint--always.hint--top-right:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--always.hint--top-right:after {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--always.hint--bottom:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom:after {\n  -webkit-transform: translateX(-50%) translateY(8px);\n  -moz-transform: translateX(-50%) translateY(8px);\n  transform: translateX(-50%) translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom-left:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom-left:after {\n  -webkit-transform: translateX(-100%) translateY(8px);\n  -moz-transform: translateX(-100%) translateY(8px);\n  transform: translateX(-100%) translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom-right:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom-right:after {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--always.hint--left:before {\n  -webkit-transform: translateX(-8px);\n  -moz-transform: translateX(-8px);\n  transform: translateX(-8px);\n}\n.art-video-player .hint--always.hint--left:after {\n  -webkit-transform: translateX(-8px);\n  -moz-transform: translateX(-8px);\n  transform: translateX(-8px);\n}\n.art-video-player .hint--always.hint--right:before {\n  -webkit-transform: translateX(8px);\n  -moz-transform: translateX(8px);\n  transform: translateX(8px);\n}\n.art-video-player .hint--always.hint--right:after {\n  -webkit-transform: translateX(8px);\n  -moz-transform: translateX(8px);\n  transform: translateX(8px);\n}\n.art-video-player .hint--rounded:after {\n  border-radius: 4px;\n}\n.art-video-player .hint--no-animate:before,\n.art-video-player .hint--no-animate:after {\n  -webkit-transition-duration: 0ms;\n  -moz-transition-duration: 0ms;\n  transition-duration: 0ms;\n}\n.art-video-player .hint--bounce:before,\n.art-video-player .hint--bounce:after {\n  -webkit-transition: opacity 0.3s ease, visibility 0.3s ease, -webkit-transform 0.3s cubic-bezier(0.71, 1.7, 0.77, 1.24);\n  -moz-transition: opacity 0.3s ease, visibility 0.3s ease, -moz-transform 0.3s cubic-bezier(0.71, 1.7, 0.77, 1.24);\n  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s cubic-bezier(0.71, 1.7, 0.77, 1.24);\n}\n.art-video-player .hint--no-shadow:before,\n.art-video-player .hint--no-shadow:after {\n  text-shadow: initial;\n  box-shadow: initial;\n}\n.art-video-player .hint--no-arrow:before {\n  display: none;\n}\n.art-video-player.art-mobile {\n  --art-bottom-gap: 10px;\n  --art-control-height: 38px;\n  --art-control-icon-scale: 1;\n  --art-state-size: 60px;\n  --art-settings-max-height: 180px;\n  --art-selector-max-height: 180px;\n  --art-indicator-scale: 1;\n  --art-control-opacity: 1;\n}\n.art-video-player.art-mobile .art-controls-left {\n  margin-left: calc(var(--art-padding) / -1);\n}\n.art-video-player.art-mobile .art-controls-right {\n  margin-right: calc(var(--art-padding) / -1);\n}\n";
  class Subtitle extends Component {
    constructor(art) {
      super(art);
      this.name = "subtitle";
      this.option = null;
      this.destroyEvent = () => null;
      this.init(art.option.subtitle);
      let lastState = false;
      art.on("video:timeupdate", () => {
        if (!this.url)
          return;
        const state2 = this.art.template.$video.webkitDisplayingFullscreen;
        if (typeof state2 !== "boolean")
          return;
        if (state2 !== lastState) {
          lastState = state2;
          this.createTrack(state2 ? "subtitles" : "metadata", this.url);
        }
      });
    }
    get url() {
      return this.art.template.$track.src;
    }
    set url(url) {
      this.switch(url);
    }
    get textTrack() {
      return this.art.template.$video?.textTracks?.[0];
    }
    get activeCues() {
      if (!this.textTrack)
        return [];
      return Array.from(this.textTrack.activeCues);
    }
    get cues() {
      if (!this.textTrack)
        return [];
      return Array.from(this.textTrack.cues);
    }
    style(key, value) {
      const { $subtitle } = this.art.template;
      if (typeof key === "object") {
        return setStyles($subtitle, key);
      }
      return setStyle($subtitle, key, value);
    }
    update() {
      const {
        option: { subtitle },
        template: { $subtitle }
      } = this.art;
      $subtitle.innerHTML = "";
      if (!this.activeCues.length)
        return;
      this.art.emit("subtitleBeforeUpdate", this.activeCues);
      $subtitle.innerHTML = this.activeCues.map(
        (cue, index) => cue.text.split(/\r?\n/).filter((line) => line.trim()).map(
          (line) => `<div class="art-subtitle-line" data-group="${index}">
                                ${subtitle.escape ? escape(line) : line}
                            </div>`
        ).join("")
      ).join("");
      this.art.emit("subtitleAfterUpdate", this.activeCues);
    }
    async switch(url, newOption = {}) {
      const { i18n, notice, option } = this.art;
      const subtitleOption = { ...option.subtitle, ...newOption, url };
      const subUrl = await this.init(subtitleOption);
      if (newOption.name) {
        notice.show = `${i18n.get("Switch Subtitle")}: ${newOption.name}`;
      }
      return subUrl;
    }
    createTrack(kind, url) {
      const { template, proxy, option } = this.art;
      const { $video, $track } = template;
      const $newTrack = createElement("track");
      $newTrack.default = true;
      $newTrack.kind = kind;
      $newTrack.src = url;
      $newTrack.label = option.subtitle.name || "Artplayer";
      $newTrack.track.mode = "hidden";
      $newTrack.onload = () => {
        this.art.emit("subtitleLoad", this.cues, this.option);
      };
      this.art.events.remove(this.destroyEvent);
      $track.onload = null;
      remove($track);
      append($video, $newTrack);
      template.$track = $newTrack;
      this.destroyEvent = proxy(this.textTrack, "cuechange", () => this.update());
    }
    async init(subtitleOption) {
      const {
        notice,
        template: { $subtitle }
      } = this.art;
      if (!this.textTrack)
        return null;
      validator(subtitleOption, scheme.subtitle);
      if (!subtitleOption.url)
        return;
      this.option = subtitleOption;
      this.style(subtitleOption.style);
      return fetch(subtitleOption.url).then((response) => response.arrayBuffer()).then((buffer) => {
        const decoder = new TextDecoder(subtitleOption.encoding);
        const text = decoder.decode(buffer);
        switch (subtitleOption.type || getExt(subtitleOption.url)) {
          case "srt": {
            const vtt = srtToVtt(text);
            const vttNew = subtitleOption.onVttLoad(vtt);
            return vttToBlob(vttNew);
          }
          case "ass": {
            const vtt = assToVtt(text);
            const vttNew = subtitleOption.onVttLoad(vtt);
            return vttToBlob(vttNew);
          }
          case "vtt": {
            const vttNew = subtitleOption.onVttLoad(text);
            return vttToBlob(vttNew);
          }
          default:
            return subtitleOption.url;
        }
      }).then((subUrl) => {
        $subtitle.innerHTML = "";
        if (this.url === subUrl)
          return subUrl;
        URL.revokeObjectURL(this.url);
        this.createTrack("metadata", subUrl);
        return subUrl;
      }).catch((err) => {
        $subtitle.innerHTML = "";
        notice.show = err;
        throw err;
      });
    }
  }
  class Template {
    constructor(art) {
      this.art = art;
      const { option, constructor } = art;
      if (option.container instanceof Element) {
        this.$container = option.container;
      } else {
        this.$container = query(option.container);
        errorHandle(this.$container, `No container element found by ${option.container}`);
      }
      errorHandle(supportsFlex(), "The current browser does not support flex layout");
      const type = this.$container.tagName.toLowerCase();
      errorHandle(type === "div", `Unsupported container element type, only support 'div' but got '${type}'`);
      errorHandle(
        constructor.instances.every((ins) => ins.template.$container !== this.$container),
        "Cannot mount multiple instances on the same dom element"
      );
      this.query = this.query.bind(this);
      this.$container.dataset.artId = art.id;
      this.init();
    }
    static get html() {
      return `
          <div class="art-video-player art-subtitle-show art-layer-show art-control-show art-mask-show">
            <video class="art-video">
              <track default kind="metadata" src=""></track>
            </video>
            <div class="art-poster"></div>
            <div class="art-subtitle"></div>
            <div class="art-danmuku"></div>
            <div class="art-layers"></div>
            <div class="art-mask">
              <div class="art-state"></div>
            </div>
            <div class="art-bottom">
              <div class="art-progress"></div>
              <div class="art-controls">
                <div class="art-controls-left"></div>
                <div class="art-controls-center"></div>
                <div class="art-controls-right"></div>
              </div>
            </div>
            <div class="art-loading"></div>
            <div class="art-notice">
              <div class="art-notice-inner"></div>
            </div>
            <div class="art-settings"></div>
            <div class="art-info">
              <div class="art-info-panel">
                <div class="art-info-item">
                  <div class="art-info-title">Player version:</div>
                  <div class="art-info-content">${version$1}</div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video url:</div>
                  <div class="art-info-content" data-video="currentSrc"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video volume:</div>
                  <div class="art-info-content" data-video="volume"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video time:</div>
                  <div class="art-info-content" data-video="currentTime"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video duration:</div>
                  <div class="art-info-content" data-video="duration"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video resolution:</div>
                  <div class="art-info-content">
                    <span data-video="videoWidth"></span> x <span data-video="videoHeight"></span>
                  </div>
                </div>
              </div>
              <div class="art-info-close">[x]</div>
            </div>
            <div class="art-contextmenus"></div>
          </div>
        `;
    }
    query(className) {
      return query(className, this.$container);
    }
    init() {
      const { option } = this.art;
      if (!option.useSSR) {
        this.$container.innerHTML = Template.html;
      }
      this.$player = this.query(".art-video-player");
      this.$video = this.query(".art-video");
      this.$track = this.query("track");
      this.$poster = this.query(".art-poster");
      this.$subtitle = this.query(".art-subtitle");
      this.$danmuku = this.query(".art-danmuku");
      this.$bottom = this.query(".art-bottom");
      this.$progress = this.query(".art-progress");
      this.$controls = this.query(".art-controls");
      this.$controlsLeft = this.query(".art-controls-left");
      this.$controlsCenter = this.query(".art-controls-center");
      this.$controlsRight = this.query(".art-controls-right");
      this.$layer = this.query(".art-layers");
      this.$loading = this.query(".art-loading");
      this.$notice = this.query(".art-notice");
      this.$noticeInner = this.query(".art-notice-inner");
      this.$mask = this.query(".art-mask");
      this.$state = this.query(".art-state");
      this.$setting = this.query(".art-settings");
      this.$info = this.query(".art-info");
      this.$infoPanel = this.query(".art-info-panel");
      this.$infoClose = this.query(".art-info-close");
      this.$contextmenu = this.query(".art-contextmenus");
      if (option.proxy) {
        const video = option.proxy.call(this.art, this.art);
        errorHandle(
          video instanceof HTMLVideoElement || video instanceof HTMLCanvasElement,
          `Function 'option.proxy' needs to return 'HTMLVideoElement' or 'HTMLCanvasElement'`
        );
        replaceElement(video, this.$video);
        video.className = "art-video";
        this.$video = video;
      }
      if (option.backdrop) {
        addClass(this.$player, "art-backdrop");
      }
      if (isMobile) {
        addClass(this.$player, "art-mobile");
      }
    }
    destroy(removeHtml) {
      if (removeHtml) {
        this.$container.innerHTML = "";
      } else {
        addClass(this.$player, "art-destroy");
      }
    }
  }
  class Emitter {
    on(name, fn, ctx) {
      const e = this.e || (this.e = {});
      (e[name] || (e[name] = [])).push({ fn, ctx });
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
      for (let i = 0; i < evtArr.length; i += 1) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }
      return this;
    }
    off(name, callback) {
      const e = this.e || (this.e = {});
      const evts = e[name];
      const liveEvents = [];
      if (evts && callback) {
        for (let i = 0, len = evts.length; i < len; i += 1) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback)
            liveEvents.push(evts[i]);
        }
      }
      if (liveEvents.length) {
        e[name] = liveEvents;
      } else {
        delete e[name];
      }
      return this;
    }
  }
  let id = 0;
  const instances = [];
  class Artplayer2 extends Emitter {
    constructor(option, readyCallback) {
      super();
      if (!isBrowser) {
        throw new Error("Artplayer can only be used in the browser environment");
      }
      this.id = ++id;
      const mergeOption = mergeDeep(Artplayer2.option, option);
      mergeOption.container = option.container;
      this.option = validator(mergeOption, scheme);
      this.isLock = false;
      this.isReady = false;
      this.isFocus = false;
      this.isInput = false;
      this.isRotate = false;
      this.isDestroy = false;
      this.template = new Template(this);
      this.events = new Events(this);
      this.storage = new Storage(this);
      this.icons = new Icons(this);
      this.i18n = new I18n(this);
      this.notice = new Notice(this);
      this.player = new Player(this);
      this.layers = new Layer(this);
      this.controls = new Control(this);
      this.contextmenu = new Contextmenu(this);
      this.subtitle = new Subtitle(this);
      this.info = new Info(this);
      this.loading = new Loading(this);
      this.hotkey = new Hotkey(this);
      this.mask = new Mask(this);
      this.setting = new Setting(this);
      this.plugins = new Plugins(this);
      if (typeof readyCallback === "function") {
        this.on("ready", () => readyCallback.call(this, this));
      }
      if (Artplayer2.DEBUG) {
        const log = (msg) => console.log(`[ART.${this.id}] -> ${msg}`);
        log(`Version@${Artplayer2.version}`);
        for (let index = 0; index < config$1.events.length; index++) {
          this.on(`video:${config$1.events[index]}`, (event) => log(`Event@${event.type}`));
        }
      }
      instances.push(this);
    }
    static get instances() {
      return instances;
    }
    static get version() {
      return version$1;
    }
    static get config() {
      return config$1;
    }
    static get utils() {
      return utils;
    }
    static get scheme() {
      return scheme;
    }
    static get Emitter() {
      return Emitter;
    }
    static get validator() {
      return validator;
    }
    static get kindOf() {
      return validator.kindOf;
    }
    static get html() {
      return Template.html;
    }
    static get option() {
      return {
        id: "",
        container: "#artplayer",
        url: "",
        poster: "",
        type: "",
        theme: "#f00",
        volume: 0.7,
        isLive: false,
        muted: false,
        autoplay: false,
        autoSize: false,
        autoMini: false,
        loop: false,
        flip: false,
        playbackRate: false,
        aspectRatio: false,
        screenshot: false,
        setting: false,
        hotkey: true,
        pip: false,
        mutex: true,
        backdrop: true,
        fullscreen: false,
        fullscreenWeb: false,
        subtitleOffset: false,
        miniProgressBar: false,
        useSSR: false,
        playsInline: true,
        lock: false,
        gesture: true,
        fastForward: false,
        autoPlayback: false,
        autoOrientation: false,
        airplay: false,
        proxy: void 0,
        layers: [],
        contextmenu: [],
        controls: [],
        settings: [],
        quality: [],
        highlight: [],
        plugins: [],
        thumbnails: {
          url: "",
          number: 60,
          column: 10,
          width: 0,
          height: 0,
          scale: 1
        },
        subtitle: {
          url: "",
          type: "",
          style: {},
          name: "",
          escape: true,
          encoding: "utf-8",
          onVttLoad: (vtt) => vtt
        },
        moreVideoAttr: {
          controls: false,
          preload: isSafari ? "auto" : "metadata"
        },
        i18n: {},
        icons: {},
        cssVar: {},
        customType: {},
        lang: navigator?.language.toLowerCase()
      };
    }
    get proxy() {
      return this.events.proxy;
    }
    get query() {
      return this.template.query;
    }
    get video() {
      return this.template.$video;
    }
    reset() {
      this.video.removeAttribute("src");
      this.video.load();
    }
    destroy(removeHtml = true) {
      if (Artplayer2.REMOVE_SRC_WHEN_DESTROY) {
        this.reset();
      }
      this.events.destroy();
      this.template.destroy(removeHtml);
      instances.splice(instances.indexOf(this), 1);
      this.isDestroy = true;
      this.emit("destroy");
    }
  }
  Artplayer2.STYLE = style;
  Artplayer2.DEBUG = false;
  Artplayer2.CONTEXTMENU = true;
  Artplayer2.NOTICE_TIME = 2e3;
  Artplayer2.SETTING_WIDTH = 250;
  Artplayer2.SETTING_ITEM_WIDTH = 200;
  Artplayer2.SETTING_ITEM_HEIGHT = 35;
  Artplayer2.RESIZE_TIME = 200;
  Artplayer2.SCROLL_TIME = 200;
  Artplayer2.SCROLL_GAP = 50;
  Artplayer2.AUTO_PLAYBACK_MAX = 10;
  Artplayer2.AUTO_PLAYBACK_MIN = 5;
  Artplayer2.AUTO_PLAYBACK_TIMEOUT = 3e3;
  Artplayer2.RECONNECT_TIME_MAX = 5;
  Artplayer2.RECONNECT_SLEEP_TIME = 1e3;
  Artplayer2.CONTROL_HIDE_TIME = 3e3;
  Artplayer2.DBCLICK_TIME = 300;
  Artplayer2.DBCLICK_FULLSCREEN = true;
  Artplayer2.MOBILE_DBCLICK_PLAY = true;
  Artplayer2.MOBILE_CLICK_PLAY = false;
  Artplayer2.AUTO_ORIENTATION_TIME = 200;
  Artplayer2.INFO_LOOP_TIME = 1e3;
  Artplayer2.FAST_FORWARD_VALUE = 3;
  Artplayer2.FAST_FORWARD_TIME = 1e3;
  Artplayer2.TOUCH_MOVE_RATIO = 0.5;
  Artplayer2.VOLUME_STEP = 0.1;
  Artplayer2.SEEK_STEP = 5;
  Artplayer2.PLAYBACK_RATE = [0.5, 0.75, 1, 1.25, 1.5, 2];
  Artplayer2.ASPECT_RATIO = ["default", "4:3", "16:9"];
  Artplayer2.FLIP = ["normal", "horizontal", "vertical"];
  Artplayer2.FULLSCREEN_WEB_IN_BODY = true;
  Artplayer2.LOG_VERSION = true;
  Artplayer2.USE_RAF = false;
  Artplayer2.REMOVE_SRC_WHEN_DESTROY = true;
  if (isBrowser) {
    setStyleText("artplayer-style", style);
    setTimeout(() => {
      if (Artplayer2.LOG_VERSION) {
        console.log(
          `%c ArtPlayer %c ${Artplayer2.version} %c https://artplayer.org`,
          "color: #fff; background: #5f5f5f",
          "color: #fff; background: #4bc729",
          ""
        );
      }
    }, 100);
  }
  return Artplayer2;
})();
