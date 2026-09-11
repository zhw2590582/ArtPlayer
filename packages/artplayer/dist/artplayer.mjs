/*!
 * artplayer.js v5.4.1
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 *
 * ArtPlayer bundled third-party notices
 *
 *
 * screenfull - reference v6.0.2, locally adapted
 * https://github.com/sindresorhus/screenfull
 * MIT License
 *
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Hint.css v2.7.0 - scoped and styled for ArtPlayer
 * https://github.com/chinchang/hint.css
 * MIT License
 *
 * Copyright (c) 2021 Kushagra Gour
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * option-validator v2.0.6
 * https://github.com/zhw2590582/option-validator
 * MIT License
 *
 * Copyright (c) 2018 Harvey Zack
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
function setStyleText(id2, style) {
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
  $style.textContent = style;
}
const customAgent = globalThis.CUSTOM_USER_AGENT;
const userAgent = customAgent ?? (typeof navigator === "undefined" ? "" : navigator.userAgent);
const isSafari = /^(?:(?!chrome|android).)*safari/i.test(userAgent);
const isIOS = /iPad|iPhone|iPod/i.test(userAgent) && (typeof window === "undefined" || !window.MSStream);
const isIOS13 = isIOS || userAgent.includes("Macintosh") && typeof navigator !== "undefined" && navigator.maxTouchPoints >= 1;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || isIOS13;
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
function publishBrowserEntry(Artplayer2, style) {
  if (!isBrowser)
    return;
  window.Artplayer = Artplayer2;
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
class ResourceCleanupError extends Error {
  constructor(errors) {
    super("Failed to release ArtPlayer resources");
    this.errors = errors;
    this.name = "ResourceCleanupError";
  }
}
class ResourceScope {
  constructor() {
    this.cleanups = /* @__PURE__ */ new Set();
    this.disposed = false;
  }
  get closed() {
    return this.disposed;
  }
  add(cleanup) {
    let active2 = true;
    const release = () => {
      if (!active2)
        return;
      active2 = false;
      this.cleanups.delete(release);
      cleanup();
    };
    if (this.closed)
      release();
    else
      this.cleanups.add(release);
    return release;
  }
  child() {
    const child = new ResourceScope();
    const release = this.add(() => {
      child.dispose();
    });
    child.add(() => {
      release();
    });
    return child;
  }
  dispose() {
    if (this.closed)
      return;
    this.disposed = true;
    const errors = [];
    for (const release of Array.from(this.cleanups).reverse()) {
      try {
        release();
      } catch (error2) {
        if (error2 instanceof ResourceCleanupError)
          errors.push(...error2.errors);
        else
          errors.push(error2);
      }
    }
    if (errors.length)
      throw new ResourceCleanupError(errors);
  }
}
const states$6 = /* @__PURE__ */ new WeakMap();
const containers = /* @__PURE__ */ new WeakMap();
function beginLifecycle(owner) {
  const state2 = { scope: new ResourceScope(), finalizers: new ResourceScope(), destroying: false };
  states$6.set(owner, state2);
  state2.scope.add(() => {
    if (!state2.destroying)
      state2.finalizers.dispose();
  });
}
function stateOf$1(owner) {
  const state2 = states$6.get(owner);
  if (!state2)
    throw new Error("ArtPlayer lifecycle has not been initialized");
  return state2;
}
function getScope(owner) {
  return stateOf$1(owner).scope;
}
function getFinalizationScope(owner) {
  return stateOf$1(owner).finalizers;
}
function isClosing(owner) {
  const state2 = stateOf$1(owner);
  return state2.destroying || state2.scope.closed;
}
function duringTemplateMount(owner, template, initialize) {
  const state2 = stateOf$1(owner);
  const previous = state2.mountingTemplate;
  state2.mountingTemplate = template;
  try {
    initialize();
  } finally {
    state2.mountingTemplate = previous;
  }
}
function ownContainer(owner, container, rollback) {
  const current2 = containers.get(container);
  if (current2 && current2 !== owner)
    throw new Error("Cannot mount multiple instances on the same dom element");
  const state2 = stateOf$1(owner);
  state2.rollback = rollback;
  containers.set(container, owner);
  state2.releaseContainer = () => {
    if (containers.get(container) === owner)
      containers.delete(container);
  };
}
function finishLifecycle(owner) {
  const state2 = stateOf$1(owner);
  state2.rollback = void 0;
  return !state2.scope.closed;
}
function destroyInstance(owner, instances2, removeHtml, removeSource, failed = false) {
  const state2 = stateOf$1(owner);
  if (state2.destroying || state2.scope.closed)
    return;
  state2.destroying = true;
  const errors = [];
  const attempt = (cleanup) => {
    try {
      cleanup();
    } catch (error2) {
      errors.push(...error2 instanceof ResourceCleanupError ? error2.errors : [error2]);
    }
  };
  if (removeSource && owner.template?.$video)
    attempt(() => owner.reset());
  attempt(() => state2.scope.dispose());
  attempt(() => (owner.template || state2.mountingTemplate)?.destroy(removeHtml));
  const index = instances2.indexOf(owner);
  if (index !== -1)
    instances2.splice(index, 1);
  owner.isDestroy = true;
  if (!failed) {
    state2.releaseContainer?.();
    state2.releaseContainer = void 0;
  }
  attempt(() => owner.emit("destroy"));
  attempt(() => state2.finalizers.dispose());
  if (failed && state2.rollback)
    attempt(state2.rollback);
  state2.rollback = void 0;
  state2.releaseContainer?.();
  state2.releaseContainer = void 0;
  for (const error2 of errors.slice(1))
    console.warn("Additional ArtPlayer cleanup failure:", error2);
  if (errors.length)
    throw errors[0];
}
const scopes$2 = /* @__PURE__ */ new WeakMap();
function ownEntry(art, element) {
  const scope = getScope(art).child();
  scopes$2.set(element, scope);
  return scope;
}
function entryScope(element) {
  const scope = scopes$2.get(element);
  if (!scope)
    throw new Error("ArtPlayer component has not been registered");
  return scope;
}
function releaseEntry(element) {
  scopes$2.get(element)?.dispose();
}
function proxyEntry(art, element, target, name, callback) {
  const scope = entryScope(element);
  if (scope.closed)
    return () => {
    };
  const cleanup = art.events.proxy(target, name, (event) => {
    if (!scope.closed)
      return callback(event);
  });
  return scope.add(() => {
    art.events.remove(cleanup);
  });
}
function subscribeEntry(art, element, name, callback) {
  const scope = entryScope(element);
  if (scope.closed)
    return;
  const guarded = (...args) => {
    if (!scope.closed)
      return callback(...args);
  };
  art.on(name, guarded);
  scope.add(() => {
    art.off(name, guarded);
  });
}
function controlEvents(art, element) {
  return {
    on: (name, callback) => {
      subscribeEntry(art, element, name, callback);
    },
    proxy: (target, name, callback) => proxyEntry(art, element, target, name, callback)
  };
}
function getComposedPath(event) {
  if (event.composedPath)
    return event.composedPath();
  const path = [];
  let node = event.target;
  while (node) {
    path.push(node);
    node = node.parentNode ?? null;
  }
  if (typeof window !== "undefined" && !path.includes(window))
    path.push(window);
  return path;
}
function includeFromEvent(event, target) {
  return getComposedPath(event).includes(target);
}
function supportsFlex() {
  const div = document.createElement("div");
  div.style.display = "flex";
  return div.style.display === "flex";
}
function getRect(el) {
  return el.getBoundingClientRect();
}
function isInViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const vertInView = rect.top - offset <= windowHeight && rect.top + rect.height + offset >= 0;
  const horInView = rect.left - offset <= windowWidth + offset && rect.left + rect.width + offset >= 0;
  return vertInView && horInView;
}
function getSafeAreaInsets() {
  const div = document.createElement("div");
  div.style.cssText = "position:fixed;top:env(safe-area-inset-top,0px);right:env(safe-area-inset-right,0px);bottom:env(safe-area-inset-bottom,0px);left:env(safe-area-inset-left,0px);pointer-events:none;visibility:hidden;";
  try {
    document.body.appendChild(div);
    const style = getComputedStyle(div);
    return {
      top: Number.parseFloat(style.top) || 0,
      right: Number.parseFloat(style.right) || 0,
      bottom: Number.parseFloat(style.bottom) || 0,
      left: Number.parseFloat(style.left) || 0
    };
  } finally {
    div.remove();
  }
}
function query(selector, parent = document) {
  return parent.querySelector(selector);
}
function queryAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}
function addClass(target, className2) {
  return target.classList.add(className2);
}
function removeClass(target, className2) {
  return target.classList.remove(className2);
}
function hasClass(target, className2) {
  return target.classList.contains(className2);
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
function siblings(target) {
  return Array.from(target.parentElement.children).filter((item) => item !== target);
}
function inverseClass(target, className2) {
  siblings(target).forEach((item) => removeClass(item, className2));
  addClass(target, className2);
}
function replaceElement(newChild, oldChild) {
  oldChild.parentNode.replaceChild(newChild, oldChild);
  return newChild;
}
function createElement(tag) {
  return document.createElement(tag);
}
function tooltip(target, msg, pos = "top") {
  if (isMobile)
    return;
  target.setAttribute("aria-label", msg);
  addClass(target, "hint--rounded");
  addClass(target, `hint--${pos}`);
}
function getIcon(key = "", html2 = "") {
  const icon = createElement("i");
  addClass(icon, "art-icon");
  addClass(icon, `art-icon-${key}`);
  append(icon, html2);
  return icon;
}
function setStyle(element, key, value) {
  const style = element.style;
  style[key] = value;
  return element;
}
function setStyles(element, styles) {
  for (const key in styles)
    setStyle(element, key, styles[key]);
  return element;
}
function getStyle(element, key, numberType = true) {
  const value = window.getComputedStyle(element, null).getPropertyValue(key);
  return numberType ? Number.parseFloat(value) : value;
}
function requestImage(url, scale, owner) {
  return new Promise((resolve, reject) => {
    const request = owner ? owner.child() : new ResourceScope();
    let complete = false;
    let releaseBlob = () => {
    };
    function fail(error2) {
      if (complete)
        return;
      complete = true;
      try {
        request.dispose();
      } catch (cleanupError) {
        console.warn("Additional image cleanup failure:", cleanupError);
      }
      try {
        releaseBlob();
      } catch (cleanupError) {
        console.warn("Additional image cleanup failure:", cleanupError);
      }
      reject(error2);
    }
    function finish2(image) {
      if (complete || request.closed)
        return;
      complete = true;
      try {
        request.dispose();
        resolve(image);
      } catch (error2) {
        try {
          releaseBlob();
        } finally {
          reject(error2);
        }
      }
    }
    request.add(() => {
      if (!complete) {
        complete = true;
        try {
          releaseBlob();
        } finally {
          resolve(void 0);
        }
      }
    });
    if (request.closed)
      return;
    function watch(image, loaded) {
      image.onload = () => {
        if (!complete && !request.closed) {
          try {
            loaded();
          } catch (error2) {
            fail(error2);
          }
        }
      };
      image.onerror = () => fail(new Error(`Image load failed: ${url}`));
      request.add(() => {
        image.onload = null;
        image.onerror = null;
        if (!complete)
          image.removeAttribute("src");
      });
    }
    try {
      const image = new Image();
      watch(image, () => {
        if (!scale || scale === 1) {
          finish2(image);
          return;
        }
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        if (!context)
          throw new TypeError("Canvas 2D context is unavailable");
        if (complete || request.closed)
          return;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        if (complete || request.closed)
          return;
        canvas.toBlob((blob) => {
          if (complete || request.closed)
            return;
          try {
            if (!blob)
              throw new Error("Unable to encode thumbnail image");
            const blobUrl = URL.createObjectURL(blob);
            let revoked = false;
            const revoke = () => {
              if (!revoked) {
                revoked = true;
                URL.revokeObjectURL(blobUrl);
              }
            };
            releaseBlob = owner ? owner.add(revoke) : revoke;
            if (complete || request.closed) {
              releaseBlob();
              return;
            }
            const scaled = new Image();
            watch(scaled, () => finish2(scaled));
            if (!request.closed)
              scaled.src = blobUrl;
          } catch (error2) {
            fail(error2);
          }
        });
      });
      if (!request.closed)
        image.src = url;
    } catch (error2) {
      fail(error2);
    }
  });
}
function loadImg(url, scale) {
  return requestImage(url, scale, void 0);
}
function loadThumbnailImage(url, scale, owner) {
  return requestImage(url, scale, owner);
}
class ArtPlayerError extends Error {
  constructor(message, context) {
    super(message);
    if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
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
function silencePromise(value) {
  const candidate = value;
  if (candidate && typeof candidate.catch === "function") {
    return candidate.catch(() => {
    });
  }
  return value;
}
function getExt(url) {
  const end = url.search(/[?#]/);
  const clean = (end < 0 ? url : url.slice(0, end)).trim().toLowerCase();
  return clean.slice(clean.lastIndexOf(".") + 1);
}
function download(url, name) {
  const elink = document.createElement("a");
  elink.style.display = "none";
  elink.href = url;
  elink.download = name;
  document.body.appendChild(elink);
  try {
    elink.click();
  } finally {
    elink.remove();
  }
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
const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;"
};
const unescapeMap = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&#39;": "'",
  "&quot;": '"'
};
const unescapePattern = /(&amp;|&lt;|&gt;|&#39;|&quot;)/g;
function escape(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) => escapeMap[tag] || tag
  );
}
function unescape(str) {
  return str.replace(unescapePattern, (tag) => unescapeMap[tag] || tag);
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
  const isObject = (item) => !!item && typeof item === "object" && !Array.isArray(item);
  const result = objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];
      let value;
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        value = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        value = mergeDeep(pVal, oVal);
      } else {
        value = oVal;
      }
      def(prev, key, { value, enumerable: true, configurable: true, writable: true });
    });
    return prev;
  }, {});
  return result;
}
function fixSrt(srt) {
  return srt.replace(/(\d\d:\d\d:\d\d)[,.](\d+)/g, (_match, $1, $2) => {
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
    const [, start = "", end = "", , , text = ""] = m;
    return {
      start: fixTime(start.trim()),
      end: fixTime(end.trim()),
      text: text.replace(/\{[\s\S]*?\}/g, "").replace(/(\\N)/g, "\n").trim().split(/\r?\n/).map((item) => item.trim()).join("\n")
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
  let timeout2;
  return function(...args) {
    const effect = () => {
      timeout2 = void 0;
      return func.apply(this, args);
    };
    clearTimeout(timeout2);
    timeout2 = setTimeout(effect, duration);
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
  silencePromise,
  sleep,
  srtToVtt,
  supportsFlex,
  throttle,
  tooltip,
  unescape,
  userAgent,
  vttToBlob
}, Symbol.toStringTag, { value: "Module" }));
function noop() {
}
function listen(scope, target, name, callback, options = {}) {
  const { capture = false, once = false, signal } = options;
  if (scope.closed || signal?.aborted)
    return noop;
  let release = noop;
  function listener(event) {
    if (once)
      release();
    if (scope.closed)
      return;
    if (typeof callback === "function")
      callback.call(this, event);
    else
      callback.handleEvent(event);
  }
  target.addEventListener(name, listener, options);
  release = scope.add(() => {
    try {
      target.removeEventListener(name, listener, capture);
    } finally {
      signal?.removeEventListener("abort", release);
    }
  });
  signal?.addEventListener("abort", release, { once: true });
  return release;
}
function timeout(scope, callback, delay) {
  if (scope.closed)
    return noop;
  let pending2 = true;
  let release = noop;
  const timer = setTimeout(() => {
    if (!pending2)
      return;
    release();
    if (!scope.closed)
      callback();
  }, delay);
  release = scope.add(() => {
    pending2 = false;
    clearTimeout(timer);
  });
  return release;
}
function animationFrame(scope, callback) {
  if (scope.closed)
    return noop;
  let pending2 = true;
  let release = noop;
  const frame = requestAnimationFrame((time2) => {
    if (!pending2)
      return;
    release();
    if (!scope.closed)
      callback(time2);
  });
  release = scope.add(() => {
    pending2 = false;
    cancelAnimationFrame(frame);
  });
  return release;
}
function requestController(scope) {
  if (typeof AbortController === "undefined")
    return void 0;
  const controller = new AbortController();
  scope.add(() => {
    controller.abort();
  });
  return controller;
}
function wait(scope, delay = 0) {
  if (scope.closed)
    return Promise.resolve(false);
  return new Promise((resolve) => {
    let completed = false;
    let release = noop;
    const timer = setTimeout(() => {
      completed = true;
      release();
      resolve(true);
    }, delay);
    release = scope.add(() => {
      clearTimeout(timer);
      if (!completed)
        resolve(false);
    });
  });
}
const handled = /* @__PURE__ */ new WeakSet();
function claimKey(event) {
  handled.add(event);
  event.preventDefault();
}
function isClaimedKey(event) {
  return handled.has(event);
}
function plainKey(event) {
  return !event.altKey && !event.ctrlKey && !event.metaKey && !event.isComposing && event.keyCode !== 229;
}
function keyboardButton(scope, element, activate = () => element.click(), active2 = () => true) {
  if (scope.closed)
    return;
  if (!element.hasAttribute("role"))
    element.setAttribute("role", "button");
  if (!element.hasAttribute("tabindex"))
    element.tabIndex = 0;
  let space = false;
  const enabled = () => active2() && element.getAttribute("aria-disabled") !== "true" && !element.hasAttribute("disabled");
  const own = (event) => (event.composedPath()[0] || event.target) === element;
  listen(scope, element, "keydown", (value) => {
    const event = value;
    if (!own(event) || !plainKey(event) || event.defaultPrevented)
      return;
    if (event.key === "Enter") {
      claimKey(event);
      if (!event.repeat && enabled())
        activate();
    } else if (event.key === " ") {
      claimKey(event);
      if (!event.repeat && enabled())
        space = true;
    }
  });
  listen(scope, element, "keyup", (value) => {
    const event = value;
    if (event.key !== " ")
      return;
    const armed = space;
    space = false;
    if (armed && own(event) && plainKey(event) && !event.defaultPrevented && enabled() && element.ownerDocument.activeElement === element) {
      claimKey(event);
      activate();
    }
  });
  listen(scope, element, "blur", () => {
    space = false;
  });
  scope.add(() => {
    space = false;
  });
}
function renderEntry(element, parent, kind, name, id2, option) {
  addClass(element, `art-${kind}`);
  addClass(element, `art-${kind}-${name}`);
  const children = Array.from(parent.children);
  element.dataset.index = String(option.index || id2);
  const next = children.find((child) => Number(child.dataset.index) >= Number(element.dataset.index));
  if (next)
    next.insertAdjacentElement("beforebegin", element);
  else
    append(parent, element);
  if (option.html)
    append(element, option.html);
  if (option.style)
    setStyles(element, option.style);
  if (option.tooltip)
    tooltip(element, option.tooltip);
}
function appendElement(parent, child) {
  return append(parent, child);
}
function queryElement(selector, parent) {
  return parent.querySelector(selector);
}
const owned = /* @__PURE__ */ new WeakSet();
function focusPlayer(art) {
  const player = art.template.$player;
  if (isClosing(art) || !player.isConnected)
    return;
  if (!player.hasAttribute("tabindex")) {
    player.setAttribute("tabindex", "-1");
    if (!owned.has(player)) {
      owned.add(player);
      getScope(art).add(() => {
        owned.delete(player);
        if (player.getAttribute("tabindex") === "-1")
          player.removeAttribute("tabindex");
      });
    }
  }
  player.focus({ preventScroll: true });
}
const pending$1 = /* @__PURE__ */ new WeakSet();
const focusable = "[tabindex],button,input,select,textarea,a[href],[contenteditable]";
function targetIn(element) {
  const targets = [element, ...element.querySelectorAll(focusable)];
  return targets.find((target) => {
    if (!target.matches(focusable) || target.tabIndex < 0 || target.matches(":disabled") || target.closest("[inert]") || target.getAttribute("aria-disabled") === "true" || !target.getClientRects().length)
      return false;
    const style = target.ownerDocument.defaultView?.getComputedStyle(target);
    return style?.visibility !== "hidden" && style?.visibility !== "collapse";
  });
}
function captureComponentFocus(owner, element, replacement) {
  const doc = element?.ownerDocument;
  const focused = doc?.activeElement;
  if (!["control", "contextmenu"].includes(owner.name ?? "") || pending$1.has(owner) || !element || !doc || !focused || !element.contains(focused))
    return () => {
    };
  const player = owner.art.template.$player;
  const controls = Array.from(player.querySelectorAll(`.art-${owner.name}`));
  const index = controls.indexOf(element);
  const neighbors = [...controls.slice(index + 1), ...controls.slice(0, index).reverse()];
  pending$1.add(owner);
  return () => {
    pending$1.delete(owner);
    if (isClosing(owner.art) || !player.isConnected || doc.activeElement !== doc.body)
      return;
    const next = replacement ? owner.cache.get(replacement)?.$ref : void 0;
    for (const candidate of [...next ? [next] : [], ...neighbors]) {
      if (!player.contains(candidate))
        continue;
      const target = targetIn(candidate);
      if (target) {
        target.focus({ preventScroll: true });
        return;
      }
    }
    focusPlayer(owner.art);
  };
}
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
          typeof value === "string" && position.includes(value),
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
const removing = /* @__PURE__ */ new WeakSet();
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
    const className2 = `art-${this.name}-show`;
    if (value)
      addClass($player, className2);
    else
      removeClass($player, className2);
    this.art.emit(this.name, value);
  }
  toggle() {
    this.show = !this.show;
  }
  add(getOption) {
    if (isClosing(this.art))
      return;
    const option = typeof getOption === "function" ? getOption(this.art) : getOption;
    if (isClosing(this.art))
      return;
    option.html = option.html || "";
    validator(option, ComponentOption);
    if (!this.$parent || !this.name || option.disable)
      return;
    const name = option.name || `${this.name}${this.id}`;
    const cache = this.cache;
    errorHandle(!cache.has(name), `Can't add an existing [${name}] to the [${this.name}]`);
    this.id += 1;
    const $ref = document.createElement("div");
    const scope = ownEntry(this.art, $ref);
    const events = [];
    const previous = Object.getOwnPropertyDescriptor(this, name);
    let aliased = false;
    scope.add(() => {
      for (const event of events)
        this.art.events.remove(event);
    });
    try {
      if (scope.closed)
        return;
      renderEntry($ref, this.$parent, this.name, name, this.id, option);
      if (scope.closed)
        return;
      if (option.click) {
        const actionable = this.name === "control" && !option.selector || this.name === "contextmenu" && !$ref.querySelector("[data-value]");
        if (actionable && !$ref.querySelector("button,input,select,textarea,a[href],[tabindex],[contenteditable]"))
          keyboardButton(scope, $ref);
        const cleanup = this.art.events.proxy($ref, "click", (event) => {
          if (scope.closed)
            return;
          event.preventDefault();
          option.click.call(this.art, this, event);
        });
        events.push(cleanup);
      }
      if (option.selector && ["left", "right"].includes(option.position))
        this.selector(option, $ref, events);
      if (scope.closed)
        return;
      assignAlias(this, name, $ref);
      aliased = true;
      cache.set(name, { $ref, events, option });
      if (option.mounted)
        option.mounted.call(this.art, $ref);
      return $ref;
    } catch (error2) {
      try {
        releaseEntry($ref);
      } catch (cleanupError) {
        console.warn("ArtPlayer component cleanup failed:", cleanupError);
      }
      if (cache.get(name)?.$ref === $ref)
        cache.delete(name);
      if (aliased && this[name] === $ref) {
        if (previous)
          Object.defineProperty(this, name, previous);
        else
          delete this[name];
      }
      $ref.remove();
      throw error2;
    }
  }
  remove(name) {
    errorHandle(this.cache.has(name), `Can't find [${name}] from the [${this.name}]`);
    const item = this.cache.get(name);
    if (removing.has(item))
      return;
    const restoreFocus = captureComponentFocus(this, item.$ref);
    removing.add(item);
    try {
      if (item.option.beforeUnmount)
        item.option.beforeUnmount.call(this.art, item.$ref);
      try {
        releaseEntry(item.$ref);
      } finally {
        if (this.cache.get(name) === item) {
          this.cache.delete(name);
          delete this[name];
        }
        item.$ref.remove();
      }
    } finally {
      removing.delete(item);
      restoreFocus();
    }
  }
  update(option) {
    const restoreFocus = captureComponentFocus(this, this.cache.get(option.name)?.$ref, option.name);
    try {
      if (this.cache.has(option.name)) {
        const item = this.cache.get(option.name);
        option = Object.assign(item.option, option);
        this.remove(option.name);
      }
      return this.add(option);
    } finally {
      restoreFocus();
    }
  }
}
function assignAlias(owner, name, value) {
  const aliases = owner;
  if (name === "__proto__")
    Object.defineProperty(aliases, name, { value, enumerable: true, configurable: true, writable: true });
  else
    aliases[name] = value;
}
function updateChoices(panel) {
  for (const item of panel.querySelectorAll("[data-value]"))
    item.setAttribute("aria-pressed", String(item.classList.contains("art-current")));
}
function keyboardChoices(panel, label) {
  const scope = entryScope(panel);
  if (scope.closed)
    return;
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", label);
  for (const item of panel.querySelectorAll("[data-value]")) {
    keyboardButton(scope, item);
    item.setAttribute("aria-label", `${label}: ${item.textContent?.trim() ?? ""}`);
  }
  updateChoices(panel);
}
function aspectRatio$2(option) {
  return (art) => {
    const {
      i18n,
      constructor: { ASPECT_RATIO }
    } = art;
    const html2 = ASPECT_RATIO.map(
      (item) => `<span data-value="${item}">${item === "default" ? i18n.get("Default") : item}</span>`
    ).join("");
    const label = i18n.get("Aspect Ratio");
    return {
      ...option,
      html: `${label}: ${html2}`,
      click: (contextmenu, event) => {
        const value = event.target instanceof HTMLElement ? event.target.dataset.value : void 0;
        if (value) {
          art.aspectRatio = value;
          contextmenu.show = false;
        }
      },
      mounted: ($panel) => {
        const { on } = controlEvents(art, $panel);
        const $default = query('[data-value="default"]', $panel);
        if ($default) {
          inverseClass($default, "art-current");
        }
        keyboardChoices($panel, label);
        on("aspectRatio", (value) => {
          const $current = Array.from($panel.querySelectorAll("span")).find((item) => item.dataset.value === value);
          if ($current) {
            inverseClass($current, "art-current");
            updateChoices($panel);
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
    const html2 = FLIP.map((item) => `<span data-value="${item}">${i18n.get(capitalize(item))}</span>`).join("");
    const label = i18n.get("Video Flip");
    return {
      ...option,
      html: `${label}: ${html2}`,
      click: (contextmenu, event) => {
        const value = event.target instanceof HTMLElement ? event.target.dataset.value : void 0;
        if (value) {
          art.flip = value.toLowerCase();
          contextmenu.show = false;
        }
      },
      mounted: ($panel) => {
        const { on } = controlEvents(art, $panel);
        const $default = query('[data-value="normal"]', $panel);
        if ($default) {
          inverseClass($default, "art-current");
        }
        keyboardChoices($panel, label);
        on("flip", (value) => {
          const $current = Array.from($panel.querySelectorAll("span")).find((item) => item.dataset.value === value);
          if ($current) {
            inverseClass($current, "art-current");
            updateChoices($panel);
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
const origins$1 = /* @__PURE__ */ new WeakMap();
function setOverlayOrigin(overlay, origin) {
  if (origin)
    origins$1.set(overlay, origin);
  else
    origins$1.delete(overlay);
}
function resolveFocusOrigin(target) {
  const visited = /* @__PURE__ */ new Set();
  let current2 = target;
  while (!visited.has(current2)) {
    visited.add(current2);
    let element = current2;
    let origin;
    while (element && !origin) {
      origin = origins$1.get(element);
      element = element.parentElement;
    }
    if (!origin)
      return current2;
    current2 = origin;
  }
  return target;
}
function editable$1(target) {
  const element = target;
  return !!element && (["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName) || element.isContentEditable);
}
function available$1(element) {
  const visibility = element.ownerDocument.defaultView?.getComputedStyle(element).visibility;
  return element.isConnected && !element.matches(":disabled") && !element.closest("[inert]") && element.getAttribute("aria-disabled") !== "true" && element.getClientRects().length > 0 && visibility !== "hidden" && visibility !== "collapse";
}
function contextmenuKeyboard(menu, open) {
  const { art } = menu;
  const { $player, $contextmenu } = art.template;
  const scope = entryScope($contextmenu);
  const active2 = () => !scope.closed && !isClosing(art);
  let origin;
  let hadFocus = false;
  let prefix = "";
  let typedAt = 0;
  const capture = () => {
    const focused = $player.ownerDocument.activeElement;
    origin = focused && $player.contains(focused) ? resolveFocusOrigin(focused) : $player;
    setOverlayOrigin($contextmenu, origin);
  };
  const targets = () => Array.from($contextmenu.querySelectorAll("[tabindex],button,input,select,textarea,a[href],[contenteditable]")).filter((element) => element.tabIndex >= 0 && available$1(element));
  const label = art.i18n.get("Context Menu");
  if (!active2())
    return { pointer: () => false };
  $contextmenu.setAttribute("role", "group");
  $contextmenu.setAttribute("aria-label", label);
  const changed = (show) => {
    if (!active2())
      return;
    if (show) {
      if (!$contextmenu.contains($player.ownerDocument.activeElement))
        capture();
      return;
    }
    const focused = $player.ownerDocument.activeElement;
    const restore = $contextmenu.contains(focused) || hadFocus && focused === $player.ownerDocument.body;
    const previous = origin;
    origin = void 0;
    hadFocus = false;
    prefix = "";
    setOverlayOrigin($contextmenu);
    if (!restore)
      return;
    if (previous && $player.contains(previous) && available$1(previous))
      previous.focus({ preventScroll: true });
    if ($player.ownerDocument.activeElement === $player.ownerDocument.body || $contextmenu.contains($player.ownerDocument.activeElement))
      focusPlayer(art);
  };
  art.on("contextmenu", changed);
  scope.add(() => {
    art.off("contextmenu", changed);
    setOverlayOrigin($contextmenu);
  });
  listen(scope, $contextmenu, "focusin", () => {
    hadFocus = true;
  });
  let pending2 = false;
  listen(scope, $contextmenu, "focusout", (input) => {
    if ($contextmenu.contains(input.relatedTarget) || pending2)
      return;
    pending2 = true;
    timeout(scope, () => {
      pending2 = false;
      if (active2() && menu.show && !$contextmenu.contains($player.ownerDocument.activeElement))
        menu.show = false;
    }, 0);
  });
  listen(scope, $player, "keydown", (input) => {
    const event = input;
    if (!active2() || !plainKey(event) || event.defaultPrevented)
      return;
    const opening = event.key === "ContextMenu" || event.key === "F10" && event.shiftKey;
    if (opening && art.constructor.CONTEXTMENU && !editable$1(event.target)) {
      claimKey(event);
      capture();
      const rect = event.target.getBoundingClientRect();
      open(rect.left, rect.bottom);
      if (active2() && menu.show)
        targets()[0]?.focus({ preventScroll: true });
      return;
    }
    if (!menu.show || !$contextmenu.contains(event.target))
      return;
    if (event.key === "Escape") {
      claimKey(event);
      menu.show = false;
      return;
    }
    if (event.key === "Tab") {
      menu.show = false;
      return;
    }
    if (editable$1(event.target))
      return;
    const items = targets();
    const index = items.indexOf(event.target);
    let target;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      target = items[(index + 1) % items.length];
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      target = items[(index + items.length - 1) % items.length];
    } else if (event.key === "Home") {
      target = items[0];
    } else if (event.key === "End") {
      target = items[items.length - 1];
    } else if (event.key.length === 1 && event.key !== " ") {
      const key = event.key.toLowerCase();
      prefix = Date.now() - typedAt > 700 ? key : prefix + key;
      typedAt = Date.now();
      const search = [...prefix].every((letter) => letter === key) ? key : prefix;
      target = [...items.slice(index + 1), ...items.slice(0, index + 1)].find((item) => (item.getAttribute("aria-label") || item.textContent || "").trim().toLowerCase().startsWith(search));
    } else {
      return;
    }
    claimKey(event);
    target?.focus({ preventScroll: true });
  });
  return {
    pointer(event) {
      if (!active2() || !art.constructor.CONTEXTMENU || editable$1(event.target))
        return false;
      capture();
      return true;
    }
  };
}
function playbackRate$2(option) {
  return (art) => {
    const {
      i18n,
      constructor: { PLAYBACK_RATE }
    } = art;
    const html2 = PLAYBACK_RATE.map(
      (item) => `<span data-value="${item}">${item === 1 ? i18n.get("Normal") : item.toFixed(1)}</span>`
    ).join("");
    const label = i18n.get("Play Speed");
    return {
      ...option,
      html: `${label}: ${html2}`,
      click: (contextmenu, event) => {
        const value = event.target instanceof HTMLElement ? event.target.dataset.value : void 0;
        if (value) {
          art.playbackRate = Number(value);
          contextmenu.show = false;
        }
      },
      mounted: ($panel) => {
        const { on } = controlEvents(art, $panel);
        const $default = query('[data-value="1"]', $panel);
        if ($default)
          inverseClass($default, "art-current");
        keyboardChoices($panel, label);
        on("video:ratechange", () => {
          const $current = Array.from($panel.querySelectorAll("span")).find(
            (item) => Number(item.dataset.value) === art.playbackRate
          );
          if ($current) {
            inverseClass($current, "art-current");
            updateChoices($panel);
          }
        });
      }
    };
  };
}
function positionContextmenu(art, mouseX, mouseY) {
  const { $player, $contextmenu } = art.template;
  const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = getRect($player);
  const { height: mHeight, width: mWidth } = getRect($contextmenu);
  let menuLeft = mouseX - cLeft;
  let menuTop = mouseY - cTop;
  if (mouseX + mWidth > cLeft + cWidth)
    menuLeft = cWidth - mWidth;
  if (mouseY + mHeight > cTop + cHeight)
    menuTop = cHeight - mHeight;
  if (!isClosing(art))
    setStyles($contextmenu, { top: `${menuTop}px`, left: `${menuLeft}px` });
}
function version(option) {
  return {
    ...option,
    html: `<a href="https://artplayer.org" target="_blank" style="width:100%;">ArtPlayer ${version$1}</a>`
  };
}
class Contextmenu extends Component {
  constructor(art) {
    super(art);
    this.name = "contextmenu";
    this.$parent = art.template.$contextmenu;
    ownEntry(art, this.$parent);
    if (!isMobile) {
      this.init();
    }
  }
  init() {
    const {
      option,
      template: { $player, $contextmenu }
    } = this.art;
    const { on, proxy } = controlEvents(this.art, $contextmenu);
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
    if (isClosing(this.art))
      return;
    releaseEntry($contextmenu);
    const scope = ownEntry(this.art, $contextmenu);
    const open = (x, y) => {
      this.show = true;
      if (!scope.closed && !isClosing(this.art) && this.show)
        positionContextmenu(this.art, x, y);
    };
    const keyboard = contextmenuKeyboard(this, open);
    proxy($player, "contextmenu", (event) => {
      if (!keyboard.pointer(event))
        return;
      event.preventDefault();
      open(event.clientX, event.clientY);
    });
    proxy($player, "click", (event) => {
      if (!includeFromEvent(event, $contextmenu)) {
        this.show = false;
      }
    });
    on("blur", () => {
      this.show = false;
    });
  }
}
function focusVisibility(scope, root, show) {
  let keyboard = true;
  let document2;
  let documentScope;
  const focused = () => !scope.closed && keyboard && root.contains(root.ownerDocument.activeElement);
  const update = () => {
    const visible = focused();
    const previous = root.classList.contains("art-keyboard-focus");
    root.classList.toggle("art-keyboard-focus", visible);
    if (visible && !previous)
      show();
  };
  const key = () => {
    keyboard = true;
    update();
  };
  const pointer = () => {
    keyboard = false;
    update();
  };
  const bindDocument = () => {
    if (document2 === root.ownerDocument)
      return;
    documentScope?.dispose();
    document2 = root.ownerDocument;
    documentScope = scope.child();
    listen(documentScope, document2, "keydown", key, { capture: true });
    listen(documentScope, document2, "mousedown", pointer, { capture: true });
    listen(documentScope, document2, "touchstart", pointer, { capture: true, passive: true });
  };
  bindDocument();
  listen(scope, root, "keydown", key, { capture: true });
  listen(scope, root, "mousedown", pointer, { capture: true });
  listen(scope, root, "touchstart", pointer, { capture: true, passive: true });
  listen(scope, root, "focusin", () => {
    bindDocument();
    update();
  });
  listen(scope, root, "focusout", () => {
    root.classList.remove("art-keyboard-focus");
  });
  scope.add(() => {
    root.classList.remove("art-keyboard-focus");
  });
  return focused;
}
function airplay$1(option) {
  return (art) => ({
    ...option,
    tooltip: art.i18n.get("AirPlay"),
    mounted: ($control) => {
      const { proxy } = controlEvents(art, $control);
      const { icons } = art;
      keyboardButton(entryScope($control), $control);
      appendElement($control, icons.airplay);
      proxy($control, "click", () => art.airplay());
    }
  });
}
function fullscreen(option) {
  return (art) => ({
    ...option,
    tooltip: art.i18n.get("Fullscreen"),
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control);
      const { icons, i18n } = art;
      keyboardButton(entryScope($control), $control);
      const $fullscreenOn = appendElement($control, icons.fullscreenOn);
      const $fullscreenOff = appendElement($control, icons.fullscreenOff);
      setStyle($fullscreenOff, "display", "none");
      proxy($control, "click", () => {
        art.fullscreen = !art.fullscreen;
      });
      on("fullscreen", (state2) => {
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
      const { on, proxy } = controlEvents(art, $control);
      const { icons, i18n } = art;
      keyboardButton(entryScope($control), $control);
      const $fullscreenWebOn = appendElement($control, icons.fullscreenWebOn);
      const $fullscreenWebOff = appendElement($control, icons.fullscreenWebOff);
      setStyle($fullscreenWebOff, "display", "none");
      proxy($control, "click", () => {
        art.fullscreenWeb = !art.fullscreenWeb;
      });
      on("fullscreenWeb", (value) => {
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
      const { on, proxy } = controlEvents(art, $control);
      const { icons, i18n } = art;
      keyboardButton(entryScope($control), $control);
      appendElement($control, icons.pip);
      proxy($control, "click", () => {
        art.pip = !art.pip;
      });
      on("pip", (value) => {
        tooltip($control, i18n.get(value ? "Exit PIP Mode" : "PIP Mode"));
      });
    }
  });
}
function playAndPause(option) {
  return (art) => ({
    ...option,
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control);
      const { icons, i18n } = art;
      const $play = appendElement($control, icons.play);
      const $pause = appendElement($control, icons.pause);
      keyboardButton(entryScope($control), $control, () => (art.playing ? $pause : $play).click());
      tooltip($play, i18n.get("Play"));
      tooltip($pause, i18n.get("Pause"));
      proxy($play, "click", () => {
        silencePromise(art.play());
      });
      proxy($pause, "click", () => {
        art.pause();
      });
      function showPlay() {
        $control.setAttribute("aria-label", i18n.get("Play"));
        setStyle($play, "display", "flex");
        setStyle($pause, "display", "none");
      }
      function showPause() {
        $control.setAttribute("aria-label", i18n.get("Pause"));
        setStyle($play, "display", "none");
        setStyle($pause, "display", "flex");
      }
      if (art.playing) {
        showPause();
      } else {
        showPlay();
      }
      on("video:playing", () => {
        showPause();
      });
      on("video:pause", () => {
        showPlay();
      });
    }
  });
}
const current = /* @__PURE__ */ new WeakMap();
const assignments = /* @__PURE__ */ new WeakMap();
const sources = /* @__PURE__ */ new WeakMap();
function getSourceScope(owner) {
  return sources.get(owner) || getScope(owner);
}
function captureSource(owner) {
  const operation = current.get(owner);
  const source = sources.get(owner);
  return () => current.get(owner) === operation && (!operation || operation.active()) && sources.get(owner) === source && (!source || !source.closed);
}
function beginSource(owner) {
  const previous = sources.get(owner);
  const source = getScope(owner).child();
  const scope = source.child();
  sources.set(owner, source);
  source.add(() => {
    if (sources.get(owner) === source)
      sources.delete(owner);
  });
  const operation = {
    scope,
    assigned: false,
    acceptingEvents: false,
    active: () => !isClosing(owner) && !scope.closed && current.get(owner) === operation
  };
  current.set(owner, operation);
  scope.add(() => {
    if (current.get(owner) === operation)
      current.delete(owner);
    operation.onAssigned = void 0;
    operation.onError = void 0;
  });
  previous?.dispose();
  return operation;
}
function takeAssignment(owner) {
  const operation = assignments.get(owner);
  assignments.delete(owner);
  return operation || beginSource(owner);
}
function finishAssignment(operation) {
  operation.assigned = true;
  const callback = operation.onAssigned;
  operation.onAssigned = void 0;
  if (operation.active())
    callback?.();
}
function assignUrl(owner, operation, url) {
  assignments.set(owner, operation);
  operation.acceptingEvents = true;
  try {
    owner.url = url;
  } finally {
    if (assignments.get(owner) === operation) {
      assignments.delete(owner);
      finishAssignment(operation);
    }
  }
}
function failSource(operation, error2) {
  if (!operation.active())
    return;
  if (operation.onError)
    operation.onError(error2);
  else
    console.warn("Failed to initialize ArtPlayer source:", error2);
  operation.scope.dispose();
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
function setCurrentTime(art, event, active2 = () => true) {
  if (!active2())
    return;
  if (art.isRotate) {
    const percentage = (event.touches[0].clientY - art.top) / art.height;
    const second = percentage * art.duration;
    if (!active2())
      return;
    art.emit("setBar", "played", percentage, event);
    if (active2())
      art.seek = second;
  } else {
    const { second, percentage } = getPosFromEvent(art, event);
    if (!active2())
      return;
    art.emit("setBar", "played", percentage, event);
    if (active2())
      art.seek = second;
  }
}
function installProgressInteractions(art, $control) {
  const { $progress } = art.template;
  const $indicator = $control.querySelector(".art-progress-indicator");
  const { on, proxy } = controlEvents(art, $control);
  const scope = entryScope($control);
  let action = 0;
  const capture = () => {
    const sourceActive = captureSource(art);
    return () => !scope.closed && !isClosing(art) && sourceActive();
  };
  const captureAction = () => {
    const revision = ++action;
    const active2 = capture();
    return () => revision === action && active2();
  };
  if (!isMobile) {
    let dragging;
    proxy($progress, "click", (event) => {
      if (event.target !== $indicator) {
        setCurrentTime(art, event, captureAction());
      }
    });
    proxy($progress, "mousemove", (event) => {
      const active2 = capture();
      const { percentage } = getPosFromEvent(art, event);
      if (active2())
        art.emit("setBar", "hover", percentage, event);
    });
    proxy($progress, "mouseleave", (event) => {
      art.emit("setBar", "hover", 0, event);
    });
    proxy($progress, "mousedown", (event) => {
      dragging = event.button === 0 ? captureAction() : void 0;
    });
    on("document:mousemove", (event) => {
      const active2 = dragging;
      if (active2?.()) {
        const { second, percentage } = getPosFromEvent(art, event);
        if (!active2() || dragging !== active2)
          return;
        art.emit("setBar", "played", percentage, event);
        if (active2() && dragging === active2)
          art.seek = second;
      } else {
        dragging = void 0;
      }
    });
    on("document:mouseup", () => {
      dragging = void 0;
    });
  }
}
const directions = /* @__PURE__ */ new Map([["ArrowRight", 1], ["ArrowUp", 1], ["ArrowLeft", -1], ["ArrowDown", -1], ["PageUp", 10], ["PageDown", -10]]);
function keyboardSlider(scope, element, label, read, write, orientation = "horizontal") {
  const valid = (range) => [range.min, range.max, range.value, range.step].every(Number.isFinite) && range.max > range.min && range.step > 0;
  const clamp2 = (value, range) => Math.min(range.max, Math.max(range.min, value));
  const update = () => {
    if (scope.closed)
      return;
    const range = read();
    const enabled = valid(range);
    const value = enabled ? clamp2(range.value, range) : 0;
    element.setAttribute("aria-disabled", String(!enabled));
    element.setAttribute("aria-valuemin", String(enabled ? range.min : 0));
    element.setAttribute("aria-valuemax", String(enabled ? range.max : 0));
    element.setAttribute("aria-valuenow", String(value));
    element.setAttribute("aria-valuetext", range.text(value));
  };
  if (scope.closed)
    return update;
  element.setAttribute("role", "slider");
  element.tabIndex = 0;
  element.setAttribute("aria-label", label);
  element.setAttribute("aria-orientation", orientation);
  listen(scope, element, "keydown", (value) => {
    const event = value;
    if ((event.composedPath()[0] || event.target) !== element || !plainKey(event) || event.defaultPrevented)
      return;
    const direction = directions.get(event.key);
    if (direction === void 0 && event.key !== "Home" && event.key !== "End")
      return;
    claimKey(event);
    const range = read();
    if (!valid(range)) {
      update();
      return;
    }
    const next = event.key === "Home" ? range.min : event.key === "End" ? range.max : clamp2(range.value, range) + direction * range.step;
    write(clamp2(next, range));
    update();
  });
  update();
  return update;
}
const revisions = /* @__PURE__ */ new WeakMap();
function positionRevision(art) {
  return revisions.get(art) || 0;
}
function advancePosition(art) {
  revisions.set(art, positionRevision(art) + 1);
}
const POSITION_TOLERANCE = 0.05;
function positionRestoration(art, target, active2) {
  let expected;
  let observedSeek = false;
  let corrected = false;
  let manual = false;
  let revision = positionRevision(art);
  const manualPosition = () => manual || positionRevision(art) !== revision;
  const seeking = () => !!art.template?.$video?.seeking;
  return {
    restore(write = () => {
      art.currentTime = target;
    }) {
      if (!active2() || manualPosition())
        return;
      const previousRevision = positionRevision(art);
      write();
      revision = positionRevision(art);
      if (revision > previousRevision + 1)
        manual = true;
      if (!active2())
        return;
      expected = art.currentTime;
      if (!active2() || manualPosition())
        return;
      observedSeek = seeking();
    },
    manual() {
      manual = true;
    },
    ready() {
      if (!active2() || seeking())
        return false;
      const missed = expected !== void 0 && Math.abs(art.currentTime - expected) > POSITION_TOLERANCE;
      if (!manualPosition() && observedSeek && !corrected && expected !== void 0 && missed) {
        corrected = true;
        if (!active2())
          return false;
        art.currentTime = expected;
      }
      return active2() && !seeking();
    }
  };
}
function installProgressKeyboard(art, element) {
  const scope = entryScope(element);
  const { on } = controlEvents(art, element);
  let revision = 0;
  let pending2;
  const update = keyboardSlider(scope, element, art.i18n.get("Progress"), () => ({
    min: 0,
    max: art.duration,
    value: art.currentTime,
    step: art.constructor.SEEK_STEP,
    text: (value) => `${secondToTime(value)} / ${secondToTime(Number.isFinite(art.duration) && art.duration > 0 ? art.duration : 0)}`
  }), (value) => {
    const action = ++revision;
    pending2?.dispose();
    const operation = scope.child();
    pending2 = operation;
    const releaseSource = getSourceScope(art).add(() => {
      operation.dispose();
    });
    operation.add(() => {
      releaseSource();
    });
    operation.add(() => {
      if (pending2 === operation)
        pending2 = void 0;
    });
    const sourceActive = captureSource(art);
    const active2 = () => action === revision && !operation.closed && !isClosing(art) && sourceActive();
    const position = positionRestoration(art, value, active2);
    const settle = () => {
      if (!active2()) {
        operation.dispose();
        return;
      }
      if (position.ready()) {
        operation.dispose();
        update();
      }
    };
    for (const name of ["video:seeked", "video:ended"]) {
      art.on(name, settle);
      operation.add(() => {
        art.off(name, settle);
      });
    }
    try {
      art.emit("setBar", "played", value / art.duration);
      if (active2()) {
        position.restore(() => {
          art.seek = value;
        });
      }
      settle();
    } catch (error2) {
      operation.dispose();
      throw error2;
    }
  });
  on("video:loadedmetadata", update);
  on("video:durationchange", update);
  on("video:emptied", update);
  on("video:timeupdate", update);
  on("video:seeking", update);
  on("video:seeked", update);
  on("video:ended", update);
}
function mountProgressView(art, $control) {
  const { icons, option } = art;
  const { $player } = art.template;
  const scope = entryScope($control);
  const { on } = controlEvents(art, $control);
  let cancelTip = () => {
  };
  const $hover = queryElement(".art-progress-hover", $control);
  const $loaded = queryElement(".art-progress-loaded", $control);
  const $played = queryElement(".art-progress-played", $control);
  const $highlight = queryElement(".art-progress-highlight", $control);
  const $indicator = queryElement(".art-progress-indicator", $control);
  const $tip = queryElement(".art-progress-tip", $control);
  if (icons.indicator) {
    append($indicator, icons.indicator);
  } else {
    setStyle($indicator, "backgroundColor", "var(--art-theme)");
  }
  function showHighlight(event) {
    const { width } = getPosFromEvent(art, event);
    const text = event.target instanceof HTMLElement ? event.target.dataset.text : void 0;
    $tip.textContent = text ?? "";
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
      const marker = document.createElement("span");
      marker.dataset.text = item.text;
      marker.dataset.time = String(item.time);
      marker.style.left = `${left}%`;
      append($highlight, marker);
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
      cancelTip();
      cancelTip = timeout(scope, () => {
        removeClass($player, "art-progress-hover");
      }, 500);
    }
  }
  on("setBar", setBar);
  on("video:loadedmetadata", updateHighlight);
  if (art.constructor.USE_RAF) {
    on("raf", () => {
      art.emit("setBar", "played", art.played);
      art.emit("setBar", "loaded", art.loaded);
    });
  } else {
    on("video:timeupdate", () => {
      art.emit("setBar", "played", art.played);
    });
    on("video:progress", () => {
      art.emit("setBar", "loaded", art.loaded);
    });
    on("video:ended", () => {
      art.emit("setBar", "played", 1);
    });
  }
  art.emit("setBar", "loaded", art.loaded || 0);
}
function progress(options) {
  return (art) => ({
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
      mountProgressView(art, $control);
      installProgressInteractions(art, $control);
      installProgressKeyboard(art, $control);
    }
  });
}
function screenshot$1(option) {
  return (art) => ({
    ...option,
    tooltip: art.i18n.get("Screenshot"),
    mounted: ($control) => {
      const { proxy } = controlEvents(art, $control);
      const { icons } = art;
      keyboardButton(entryScope($control), $control);
      appendElement($control, icons.screenshot);
      proxy($control, "click", () => {
        silencePromise(art.screenshot());
      });
    }
  });
}
function setting$1(option) {
  return (art) => ({
    ...option,
    tooltip: art.i18n.get("Show Setting"),
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control);
      const { icons, i18n } = art;
      appendElement($control, icons.setting);
      keyboardButton(entryScope($control), $control);
      $control.setAttribute("aria-expanded", "false");
      proxy($control, "click", () => {
        art.setting.toggle();
        art.setting.resize();
      });
      on("setting", (value) => {
        $control.setAttribute("aria-expanded", String(value));
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
      const { on } = controlEvents(art, $control);
      function getTime() {
        const newTime = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`;
        if (newTime !== $control.textContent) {
          $control.textContent = newTime;
        }
      }
      getTime();
      const events = ["video:loadedmetadata", "video:timeupdate", "video:progress"];
      for (let index = 0; index < events.length; index++) {
        on(events[index], getTime);
      }
    }
  });
}
function volume$1(option) {
  return (art) => ({
    ...option,
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control);
      const { icons, i18n } = art;
      const $volume = appendElement($control, icons.volume);
      const $close = appendElement($control, icons.volumeClose);
      for (const element of [$volume, $close]) {
        keyboardButton(entryScope($control), element);
        element.setAttribute("aria-label", i18n.get("Mute"));
      }
      const $panel = appendElement($control, '<div class="art-volume-panel"></div>');
      const $inner = appendElement($panel, '<div class="art-volume-inner"></div>');
      const $value = appendElement($inner, `<div class="art-volume-val"></div>`);
      const $slider = appendElement($inner, `<div class="art-volume-slider"></div>`);
      const $handle = appendElement($slider, `<div class="art-volume-handle"></div>`);
      const $loaded = appendElement($handle, `<div class="art-volume-loaded"></div>`);
      const $indicator = appendElement($slider, `<div class="art-volume-indicator"></div>`);
      const scope = entryScope($control);
      let revision = 0;
      const updateSlider = keyboardSlider(scope, $slider, i18n.get("Volume"), () => ({
        min: 0,
        max: 100,
        value: art.muted ? 0 : art.volume * 100,
        step: art.constructor.VOLUME_STEP * 100,
        text: (value) => `${Math.round(value)}%`
      }), (value) => {
        const action = ++revision;
        art.muted = false;
        if (action === revision && !scope.closed && !isClosing(art))
          art.volume = value / 100;
      }, "vertical");
      function getVolumeFromEvent(event) {
        const { top, height } = getRect($slider);
        return 1 - (event.clientY - top) / height;
      }
      function update() {
        updateSlider();
        const focused = $control.ownerDocument.activeElement;
        const muted = art.muted || art.volume === 0;
        const visible = muted ? $close : $volume;
        $volume.setAttribute("aria-pressed", String(art.muted));
        $close.setAttribute("aria-pressed", String(art.muted));
        if (muted) {
          setStyle($volume, "display", "none");
          setStyle($close, "display", "flex");
          setStyle($indicator, "top", "100%");
          setStyle($loaded, "top", "100%");
          $value.textContent = "0";
        } else {
          const percentage = art.volume * 100;
          setStyle($volume, "display", "flex");
          setStyle($close, "display", "none");
          setStyle($indicator, "top", `${100 - percentage}%`);
          setStyle($loaded, "top", `${100 - percentage}%`);
          $value.textContent = String(Math.floor(percentage));
        }
        if ((focused === $volume || focused === $close) && focused !== visible)
          visible.focus({ preventScroll: true });
      }
      update();
      on("video:volumechange", update);
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
        on("document:mousemove", (event) => {
          if (isDragging) {
            art.muted = false;
            art.volume = getVolumeFromEvent(event);
          }
        });
        on("document:mouseup", () => {
          if (isDragging) {
            isDragging = false;
          }
        });
      }
    }
  });
}
function installControls(controls) {
  const { option } = controls.art;
  if (!option.isLive) {
    controls.add(
      progress({
        name: "progress",
        position: "top",
        index: 10
      })
    );
  }
  controls.add({
    name: "thumbnails",
    position: "top",
    index: 20
  });
  controls.add(
    playAndPause({
      name: "playAndPause",
      position: "left",
      index: 10
    })
  );
  controls.add(
    volume$1({
      name: "volume",
      position: "left",
      index: 20
    })
  );
  if (!option.isLive) {
    controls.add(
      time({
        name: "time",
        position: "left",
        index: 30
      })
    );
  }
  if (option.quality.length) {
    wait(getScope(controls.art)).then((active2) => {
      if (!active2 || getScope(controls.art).closed)
        return;
      controls.art.quality = option.quality;
    }).catch((error2) => {
      console.warn("ArtPlayer quality initialization failed:", error2);
    });
  }
  if (option.screenshot && !isMobile) {
    controls.add(
      screenshot$1({
        name: "screenshot",
        position: "right",
        index: 20
      })
    );
  }
  if (option.setting) {
    controls.add(
      setting$1({
        name: "setting",
        position: "right",
        index: 30
      })
    );
  }
  if (option.pip) {
    controls.add(
      pip$1({
        name: "pip",
        position: "right",
        index: 40
      })
    );
  }
  if (option.airplay && "WebKitPlaybackTargetAvailabilityEvent" in window && window.WebKitPlaybackTargetAvailabilityEvent) {
    controls.add(
      airplay$1({
        name: "airplay",
        position: "right",
        index: 50
      })
    );
  }
  if (option.fullscreenWeb) {
    controls.add(
      fullscreenWeb({
        name: "fullscreenWeb",
        position: "right",
        index: 60
      })
    );
  }
  if (option.fullscreen) {
    controls.add(
      fullscreen({
        name: "fullscreen",
        position: "right",
        index: 70
      })
    );
  }
  for (let index = 0; index < option.controls.length; index++) {
    controls.add(option.controls[index]);
  }
}
function observeControlLayout(art) {
  const { $bottom, $controls, $player } = art.template;
  const scope = entryScope($bottom);
  const { on } = controlEvents(art, $bottom);
  const update = () => {
    if (scope.closed)
      return;
    const height = $controls.offsetHeight;
    if (height > 0 && $player.style.getPropertyValue("--art-controls-height") !== `${height}px`)
      $player.style.setProperty("--art-controls-height", `${height}px`);
  };
  on("resize", update);
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(update);
    observer.observe($controls);
    scope.add(() => {
      observer.disconnect();
    });
    return;
  } else if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(update);
    observer.observe($controls, { childList: true, subtree: true, attributes: true, characterData: true });
    scope.add(() => {
      observer.disconnect();
    });
  }
  update();
}
const selections = /* @__PURE__ */ new WeakMap();
function trackSelection(event, active2) {
  selections.set(event, active2);
  return () => {
    if (selections.get(event) === active2)
      selections.delete(event);
  };
}
function captureSelection(event) {
  return event && selections.get(event) || (() => true);
}
const interactive = "button,input,select,textarea,a[href],[tabindex],[contenteditable]";
function selectorKeyboard(scope, owner, value, list, label) {
  if (scope.closed)
    return () => {
    };
  const items = Array.from(list.children);
  const complex = items.some((item) => item.querySelector(interactive));
  list.setAttribute("role", complex ? "group" : "listbox");
  list.setAttribute("aria-label", label);
  let hovered = false;
  let opened = false;
  let dismissed = false;
  let prefix = "";
  let typedAt = 0;
  const expanded = () => items.length > 0 && (opened || hovered && !dismissed);
  const trigger = () => value.querySelector('button,a[href],[role="button"]') || value;
  const refresh = (restore = false) => {
    if (scope.closed)
      return;
    const target = trigger();
    if (value.querySelector(interactive)) {
      value.removeAttribute("role");
      value.removeAttribute("tabindex");
    } else {
      value.setAttribute("role", "button");
      value.tabIndex = 0;
    }
    if (target !== value) {
      value.removeAttribute("aria-haspopup");
      value.removeAttribute("aria-expanded");
      value.removeAttribute("aria-disabled");
    }
    if (complex)
      target.removeAttribute("aria-haspopup");
    else
      target.setAttribute("aria-haspopup", "listbox");
    target.setAttribute("aria-expanded", String(expanded()));
    target.setAttribute("aria-disabled", String(items.length === 0));
    if (restore && value.isConnected && value.ownerDocument.activeElement === value.ownerDocument.body)
      target.focus({ preventScroll: true });
  };
  const visibility = (state2, hide = false) => {
    opened = state2;
    dismissed = hide;
    owner.classList.toggle("art-selector-open", state2);
    owner.classList.toggle("art-selector-dismissed", hide);
    refresh();
  };
  const focus = (item) => {
    if (!item || scope.closed)
      return;
    const target = item.querySelector(interactive) || item;
    target.focus({ preventScroll: true });
    if (!scope.closed)
      item.scrollIntoView({ block: "nearest", inline: "nearest" });
  };
  const open = (last = false) => {
    if (scope.closed || !items.length)
      return;
    visibility(true);
    prefix = "";
    focus(items.find((item) => item.classList.contains("art-current")) || items[last ? items.length - 1 : 0]);
  };
  const close2 = () => {
    if (scope.closed)
      return;
    const restore = list.contains(owner.ownerDocument.activeElement);
    visibility(false, true);
    prefix = "";
    if (restore && value.isConnected)
      trigger().focus({ preventScroll: true });
  };
  keyboardButton(scope, value, () => {
    value.click();
    if (owner.ownerDocument.activeElement === value)
      open();
  });
  refresh();
  for (const item of items) {
    const selected = item.classList.contains("art-current");
    if (!complex) {
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", String(selected));
    } else {
      item.setAttribute("aria-current", String(selected));
    }
    if (!item.querySelector(interactive)) {
      item.tabIndex = -1;
      keyboardButton(scope, item, () => {
        item.click();
        close2();
      });
    }
  }
  listen(scope, value, "keydown", (input) => {
    const event = input;
    if (!plainKey(event) || event.defaultPrevented || event.target !== value && event.target !== trigger())
      return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      claimKey(event);
      open(event.key === "ArrowUp");
    } else if (event.key === "Escape" && expanded()) {
      claimKey(event);
      close2();
    }
  });
  listen(scope, value, "click", (event) => {
    if (event.isTrusted && event.detail === 0 && trigger() !== value)
      open();
  });
  listen(scope, list, "keydown", (input) => {
    const event = input;
    if (!plainKey(event) || event.defaultPrevented)
      return;
    if (event.key === "Escape") {
      claimKey(event);
      close2();
      return;
    }
    const index = items.indexOf(event.target);
    if (index < 0)
      return;
    if (event.key.length !== 1)
      prefix = "";
    let next;
    switch (event.key) {
      case "ArrowDown":
        next = Math.min(index + 1, items.length - 1);
        break;
      case "ArrowUp":
        next = Math.max(index - 1, 0);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = items.length - 1;
        break;
      case "ArrowLeft":
      case "ArrowRight":
        claimKey(event);
        return;
      default: {
        if (event.key.length !== 1 || event.key === " ")
          return;
        const now = Date.now();
        prefix = now - typedAt < 500 ? prefix + event.key.toLocaleLowerCase() : event.key.toLocaleLowerCase();
        typedAt = now;
        const query2 = [...prefix].every((char) => char === prefix[0]) ? prefix[0] : prefix;
        for (let offset = 1; offset <= items.length; offset++) {
          const candidate = (index + offset) % items.length;
          if (items[candidate].textContent?.trim().toLocaleLowerCase().startsWith(query2)) {
            next = candidate;
            break;
          }
        }
      }
    }
    claimKey(event);
    if (next !== void 0)
      focus(items[next]);
  });
  listen(scope, list, "click", (event) => {
    if (event.isTrusted && event.detail === 0)
      close2();
  });
  listen(scope, owner, "mouseenter", () => {
    hovered = true;
    visibility(opened);
  });
  listen(scope, owner, "mouseleave", () => {
    hovered = false;
    visibility(list.contains(owner.ownerDocument.activeElement));
  });
  listen(scope, owner, "focusout", (event) => {
    if (!owner.contains(event.relatedTarget))
      visibility(false, true);
  });
  scope.add(() => {
    owner.classList.remove("art-selector-open", "art-selector-dismissed");
  });
  return refresh;
}
const bindings$1 = /* @__PURE__ */ new WeakMap();
function bind(item, binding) {
  const previous = bindings$1.get(item);
  errorHandle(!previous || entryScope(previous.owner).closed, "Cannot share selector items between active controls");
  if (!previous) {
    def(item, "$control_option", { get: () => bindings$1.get(item).option.selector });
    def(item, "$control_item", { get: () => bindings$1.get(item).item });
    def(item, "$control_value", { get: () => bindings$1.get(item).value });
  }
  bindings$1.set(item, binding);
}
function setHTML(element, value) {
  element.innerHTML = value;
}
function checkSelector(target) {
  if (!target)
    return;
  const restore = target.$control_value.contains(target.$control_value.ownerDocument.activeElement);
  setHTML(target.$control_value, target.html);
  for (let index = 0; index < target.$control_option.length; index++) {
    const item = target.$control_option[index];
    item.default = item === target;
    const element = item.$control_item;
    element.setAttribute(element.getAttribute("role") === "option" ? "aria-selected" : "aria-current", String(item.default));
    if (item.default)
      inverseClass(item.$control_item, "art-current");
  }
  bindings$1.get(target)?.refresh?.(restore);
}
function renderSelector(art, check2, option, $ref, events) {
  const { proxy } = art.events;
  const scope = entryScope($ref);
  const selector = option.selector;
  addClass($ref, "art-control-selector");
  const $value = document.createElement("div");
  addClass($value, "art-selector-value");
  append($value, option.html);
  $ref.textContent = "";
  append($ref, $value);
  const $list = appendElement($ref, '<div class="art-selector-list"></div>');
  for (let index = 0; index < selector.length; index++) {
    const item = selector[index];
    const $item = document.createElement("div");
    addClass($item, "art-selector-item");
    if (item.default)
      addClass($item, "art-current");
    $item.dataset.index = String(index);
    $item.dataset.value = String(item.value);
    setHTML($item, item.html);
    append($list, $item);
    bind(item, { option, item: $item, value: $value, owner: $ref });
  }
  let generation = 0;
  const event = proxy($list, "click", async (event2) => {
    if (scope.closed)
      return;
    const path = getComposedPath(event2);
    const item = option.selector.find((item2) => path.includes(item2.$control_item));
    if (!item)
      return;
    const current2 = ++generation;
    const active2 = () => !scope.closed && current2 === generation;
    const release = scope.add(trackSelection(event2, active2));
    try {
      check2(item);
      if (scope.closed)
        return;
      if (option.onSelect) {
        const value = await option.onSelect.call(art, item, item.$control_item, event2);
        if (active2()) {
          const restore = $value.contains($value.ownerDocument.activeElement);
          setHTML($value, value);
          bindings$1.get(item)?.refresh?.(restore);
        }
      }
    } catch (error2) {
      console.warn("ArtPlayer selector failed:", error2);
    } finally {
      release();
    }
  });
  events.push(event);
  const refresh = selectorKeyboard(scope, $ref, $value, $list, String(option.tooltip || option.name || $value.textContent || art.i18n.get("Open")));
  for (const item of selector)
    bindings$1.get(item).refresh = refresh;
}
class Control extends Component {
  constructor(art) {
    super(art);
    this.isHover = false;
    this.name = "control";
    this.timer = Date.now();
    const { constructor } = art;
    const { $player, $bottom } = this.art.template;
    const scope = ownEntry(art, $bottom);
    const keyboardFocused = focusVisibility(scope, $player, () => {
      this.show = true;
    });
    const { on, proxy } = controlEvents(art, $bottom);
    proxy($player, "focusin", (event) => {
      art.isFocus = true;
      art.isInput = event.target?.tagName === "INPUT";
    });
    proxy($player, "focusout", (event) => {
      if (!$player.contains(event.relatedTarget)) {
        art.isFocus = false;
        art.isInput = false;
      }
    });
    on("mousemove", () => {
      if (!isMobile) {
        this.show = true;
      }
    });
    on("click", () => {
      if (isMobile) {
        this.toggle();
      } else {
        this.show = true;
      }
    });
    on("document:mousemove", (event) => {
      this.isHover = includeFromEvent(event, $bottom);
    });
    on("video:timeupdate", () => {
      if (!art.setting.show && !this.isHover && !art.isInput && !keyboardFocused() && art.playing && this.show && Date.now() - this.timer >= constructor.CONTROL_HIDE_TIME) {
        this.show = false;
      }
    });
    on("control", (state2) => {
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
    if (!getScope(art).closed)
      observeControlLayout(art);
  }
  init() {
    installControls(this);
  }
  add(getOption) {
    if (isClosing(this.art))
      return;
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
    checkSelector(target);
  }
  selector(option, $ref, events) {
    renderSelector(this.art, (target) => this.check(target), option, $ref, events);
  }
}
function pointerFocus(art) {
  const { $player } = art.template;
  const onDocumentClick = (event) => {
    if (isClosing(art))
      return;
    const inside = includeFromEvent(event, $player);
    art.isInput = inside && event.target?.tagName === "INPUT";
    art.isFocus = inside;
    art.emit(inside ? "focus" : "blur", event);
  };
  art.on("document:click", onDocumentClick);
  art.on("document:contextmenu", onDocumentClick);
  getScope(art).add(() => {
    art.off("document:click", onDocumentClick);
    art.off("document:contextmenu", onDocumentClick);
  });
}
function clickInit(art, events) {
  const { constructor, template: { $video } } = art;
  pointerFocus(art);
  let clickTimes = [];
  events.proxy($video, "click", (event) => {
    if (isClosing(art))
      return;
    const now = Date.now();
    clickTimes.push(now);
    const { MOBILE_CLICK_PLAY, DBCLICK_TIME, MOBILE_DBCLICK_PLAY, DBCLICK_FULLSCREEN } = constructor;
    const clicks = clickTimes.filter((t) => now - t <= DBCLICK_TIME);
    switch (clicks.length) {
      case 1:
        art.emit("click", event);
        if (isClosing(art))
          return;
        if (!isMobile || !art.isLock && MOBILE_CLICK_PLAY)
          silencePromise(art.toggle());
        clickTimes = clicks;
        break;
      case 2:
        art.emit("dblclick", event);
        if (isClosing(art))
          return;
        if (isMobile) {
          if (!art.isLock && MOBILE_DBCLICK_PLAY)
            silencePromise(art.toggle());
        } else if (DBCLICK_FULLSCREEN) {
          art.fullscreen = !art.fullscreen;
        }
        clickTimes = [];
        break;
      default:
        clickTimes = [];
    }
  });
}
function slideDirection(startX, startY, endX, endY) {
  const dy = startY - endY;
  const dx = endX - startX;
  if (Math.abs(dx) < 2 && Math.abs(dy) < 2)
    return 0;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  if (angle >= -45 && angle < 45)
    return 4;
  if (angle >= 45 && angle < 135)
    return 1;
  if (angle >= -135 && angle < -45)
    return 2;
  if (angle >= 135 && angle <= 180 || angle >= -180 && angle < -135)
    return 3;
  return 0;
}
function gestureController(art) {
  let drag;
  const cancel = () => {
    drag = void 0;
  };
  const active2 = (current2) => drag === current2 && !isClosing(art) && !art.isLock && !art.option.isLive && art.isRotate === current2.rotated && current2.sourceActive();
  const onLock = (locked) => {
    if (locked)
      cancel();
  };
  art.on("document:touchend", cancel);
  art.on("document:touchcancel", cancel);
  art.on("lock", onLock);
  getScope(art).add(() => {
    cancel();
    art.off("document:touchend", cancel);
    art.off("document:touchcancel", cancel);
    art.off("lock", onLock);
  });
  const start = (target, event) => {
    cancel();
    const touch = event.touches[0];
    if (isClosing(art) || art.isLock || art.option.isLive || event.touches.length !== 1 || !touch)
      return;
    if (![touch.pageX, touch.pageY, touch.clientX, touch.clientY, art.currentTime].every(Number.isFinite))
      return;
    const current2 = {
      target,
      identifier: touch.identifier,
      x: touch.pageX,
      y: touch.pageY,
      time: art.currentTime,
      rotated: art.isRotate,
      sourceActive: captureSource(art)
    };
    drag = current2;
    if (target === art.template.$progress) {
      const size = art.isRotate ? art.height : art.template.$progress.clientWidth;
      if (!Number.isFinite(size) || size <= 0 || !Number.isFinite(art.duration) || art.duration <= 0) {
        cancel();
        return;
      }
      try {
        setCurrentTime(art, event, () => active2(current2));
      } catch (error2) {
        if (drag === current2)
          cancel();
        throw error2;
      }
      if (active2(current2))
        current2.time = art.currentTime;
    }
  };
  const move = (event) => {
    const current2 = drag;
    const touch = event.touches[0];
    if (!current2)
      return;
    if (!active2(current2) || event.touches.length !== 1 || !touch || touch.identifier !== current2.identifier) {
      cancel();
      return;
    }
    const size = current2.rotated ? art.height : art.width;
    const multiplier = current2.target === art.template.$video ? art.constructor.TOUCH_MOVE_RATIO : 1;
    if (![touch.pageX, touch.pageY, size, art.duration, multiplier].every(Number.isFinite) || size <= 0 || art.duration <= 0) {
      cancel();
      return;
    }
    const direction = slideDirection(current2.x, current2.y, touch.pageX, touch.pageY);
    if (!(current2.rotated ? direction === 1 || direction === 2 : direction === 3 || direction === 4))
      return;
    const distance = current2.rotated ? touch.pageY - current2.y : touch.pageX - current2.x;
    const ratio = clamp(distance / size, -1, 1);
    const time2 = clamp(current2.time + art.duration * ratio * multiplier, 0, art.duration);
    art.seek = time2;
    if (!active2(current2))
      return;
    art.emit("setBar", "played", clamp(time2 / art.duration, 0, 1), event);
    if (active2(current2))
      art.notice.show = `${secondToTime(time2)} / ${secondToTime(art.duration)}`;
  };
  return { start, move, cancel };
}
function gestureInit(art, events) {
  if (!isMobile || art.option.isLive)
    return;
  const { $video, $progress } = art.template;
  const gesture = gestureController(art);
  const bind2 = (target) => {
    events.proxy(target, "touchstart", (event) => gesture.start(target, event));
    events.proxy(target, "touchmove", (event) => gesture.move(event));
    events.proxy(target, "touchcancel", gesture.cancel);
  };
  if (art.option.gesture)
    bind2($video);
  bind2($progress);
}
const documentEvents = [
  "click",
  "mouseup",
  "keydown",
  "touchend",
  "touchcancel",
  "touchmove",
  "mousemove",
  "pointerup",
  "contextmenu",
  "pointermove",
  "visibilitychange",
  "webkitfullscreenchange"
];
const windowEvents = ["resize", "scroll", "orientationchange"];
function globalInit(art, events) {
  let active2;
  let generation = 0;
  getScope(art).add(() => {
    active2 = void 0;
    generation++;
    return void 0;
  });
  const release = (binding) => {
    if (binding) {
      for (const dispose of binding.disposers)
        events.remove(dispose);
      binding.disposers.length = 0;
    }
  };
  function bindGlobalEvents(source = {}) {
    if (isClosing(art))
      return;
    const current2 = ++generation;
    const binding = { disposers: [] };
    const cancelled = () => current2 !== generation || isClosing(art);
    try {
      const { $player } = art.template;
      const doc = source.document || $player.ownerDocument || document;
      const win = source.window || $player.ownerDocument?.defaultView || window;
      const register = (target, names, prefix) => {
        for (const name of names) {
          if (cancelled())
            return;
          binding.disposers.push(events.proxy(target, name, (event) => {
            if (active2 === binding && !isClosing(art))
              art.emit(`${prefix}:${name}`, event);
          }));
        }
      };
      register(doc, documentEvents, "document");
      register(win, windowEvents, "window");
    } catch (error2) {
      release(binding);
      throw error2;
    }
    if (cancelled()) {
      release(binding);
      return;
    }
    const previous = active2;
    active2 = binding;
    release(previous);
  }
  bindGlobalEvents();
  events.bindGlobalEvents = bindGlobalEvents;
}
function hoverInit(art, events) {
  const { $player } = art.template;
  events.hover(
    $player,
    (event) => {
      if (isClosing(art))
        return;
      addClass($player, "art-hover");
      art.emit("hover", true, event);
    },
    (event) => {
      if (isClosing(art))
        return;
      removeClass($player, "art-hover");
      art.emit("hover", false, event);
    }
  );
}
const states$5 = /* @__PURE__ */ new WeakMap();
function ownListeners(registry, art) {
  states$5.set(registry, { scope: getScope(art), cleaning: false });
}
function stateOf(registry) {
  const state2 = states$5.get(registry);
  if (!state2)
    throw new Error("ArtPlayer event registry has not been initialized");
  return state2;
}
function proxyListener(registry, target, names, callback, option = {}) {
  if (Array.isArray(names)) {
    const created = [];
    try {
      return names.map((name2) => {
        const dispose2 = proxyListener(registry, target, name2, callback, option);
        created.push(dispose2);
        return dispose2;
      });
    } catch (error2) {
      for (const dispose2 of created.reverse()) {
        try {
          dispose2();
        } catch (cleanupError) {
          console.warn("Failed to roll back event listener:", cleanupError);
        }
      }
      throw error2;
    }
  }
  const name = names;
  const state2 = stateOf(registry);
  if (state2.scope.closed || state2.cleaning)
    return () => {
    };
  const options = typeof option === "boolean" ? option : {
    capture: Boolean(option?.capture),
    once: Boolean(option?.once),
    passive: option?.passive,
    signal: option?.signal
  };
  const capture = typeof options === "boolean" ? options : options.capture;
  const signal = typeof options === "boolean" ? void 0 : options.signal;
  if (state2.scope.closed || state2.cleaning || signal?.aborted)
    return () => {
    };
  let active2 = true;
  function clean(force = false) {
    if (!active2 && !force)
      return;
    target.removeEventListener(name, callback, capture);
    signal?.removeEventListener("abort", dispose);
    active2 = false;
    registry.destroyEvents.delete(dispose);
  }
  function dispose() {
    clean();
  }
  registry.destroyEvents.add(dispose);
  try {
    target.addEventListener(name, callback, options);
    if (!active2 || state2.scope.closed || state2.cleaning)
      clean(true);
    else if (signal?.aborted)
      dispose();
    else
      signal?.addEventListener("abort", dispose, { once: true });
  } catch (error2) {
    try {
      clean(true);
    } catch (cleanupError) {
      console.warn("Failed to roll back event listener:", cleanupError);
    }
    throw error2;
  }
  return dispose;
}
function removeListener(registry, dispose) {
  if (!registry.destroyEvents.has(dispose))
    return;
  try {
    dispose();
    registry.destroyEvents.delete(dispose);
  } catch (error2) {
    console.warn("Failed to remove event listener:", error2);
  }
}
function destroyListeners(registry) {
  const state2 = stateOf(registry);
  if (state2.cleaning)
    return;
  state2.cleaning = true;
  try {
    for (const dispose of registry.destroyEvents) {
      try {
        dispose();
        registry.destroyEvents.delete(dispose);
      } catch (error2) {
        console.warn("Failed to destroy event listener:", error2);
      }
    }
  } finally {
    state2.cleaning = false;
  }
}
function moveInit(art, events) {
  const { $player } = art.template;
  events.proxy($player, "mousemove", (event) => {
    if (!isClosing(art))
      art.emit("mousemove", event);
  });
}
function eventSubscriptions(art) {
  return (name, callback) => {
    if (isClosing(art))
      return;
    const listener = (...args) => {
      if (!isClosing(art))
        return callback(...args);
    };
    art.on(name, listener);
    getScope(art).add(() => {
      art.off(name, listener);
    });
  };
}
function resizeInit(art, events) {
  const { option, constructor } = art;
  const on = eventSubscriptions(art);
  on("resize", () => {
    const { aspectRatio: aspectRatio2, notice } = art;
    if (art.state === "standard" && option.autoSize)
      art.autoSize();
    if (isClosing(art))
      return;
    art.aspectRatio = aspectRatio2;
    if (!isClosing(art))
      notice.show = "";
  });
  const scope = getScope(art);
  let cancel = () => {
  };
  const resize = () => {
    if (isClosing(art))
      return;
    cancel();
    cancel = timeout(scope, () => art.emit("resize"), constructor.RESIZE_TIME);
  };
  on("window:orientationchange", resize);
  on("window:resize", resize);
  const orientation = art.template.$player.ownerDocument.defaultView?.screen?.orientation;
  if (typeof orientation?.addEventListener === "function")
    events.proxy(orientation, "change", resize);
}
function updateInit(art) {
  if (!art.constructor.USE_RAF)
    return;
  const scope = getScope(art);
  let cancel = () => {
  };
  const update = () => {
    if (isClosing(art))
      return;
    if (art.playing)
      art.emit("raf");
    if (!isClosing(art))
      cancel = animationFrame(scope, update);
  };
  update();
  eventSubscriptions(art)("destroy", () => cancel());
}
function inViewport(element, offset) {
  const rect = element.getBoundingClientRect();
  const document2 = element.ownerDocument;
  const window2 = document2.defaultView;
  const height = window2?.innerHeight || document2.documentElement.clientHeight;
  const width = window2?.innerWidth || document2.documentElement.clientWidth;
  const vertical = rect.top - offset <= height && rect.top + rect.height + offset >= 0;
  const horizontal = rect.left - offset <= width + offset && rect.left + rect.width + offset >= 0;
  return vertical && horizontal;
}
function viewInit(art) {
  const { option, constructor, template: { $container } } = art;
  const delay = constructor.SCROLL_TIME;
  const scope = getScope(art);
  const on = eventSubscriptions(art);
  let waiting = false;
  on("window:scroll", () => {
    if (waiting)
      return;
    art.emit("view", inViewport($container, constructor.SCROLL_GAP));
    if (isClosing(art))
      return;
    waiting = true;
    timeout(scope, () => {
      waiting = false;
    }, delay);
  });
  on("view", (visible) => {
    if (option.autoMini)
      art.mini = !visible;
  });
}
class Events {
  constructor(art) {
    this.destroyEvents = /* @__PURE__ */ new Set();
    ownListeners(this, art);
    getScope(art).add(() => {
      this.destroy();
    });
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
    return Array.isArray(name) ? proxyListener(this, target, name, callback, option) : proxyListener(this, target, name, callback, option);
  }
  hover(target, mouseenter, mouseleave) {
    if (mouseenter)
      this.proxy(target, "mouseenter", mouseenter);
    if (mouseleave)
      this.proxy(target, "mouseleave", mouseleave);
  }
  remove(dispose) {
    removeListener(this, dispose);
  }
  destroy() {
    destroyListeners(this);
  }
}
function defaultHotkeys(art) {
  const { constructor } = art;
  return {
    Escape: () => {
      if (art.fullscreenWeb)
        art.fullscreenWeb = false;
    },
    Space: () => {
      silencePromise(art.toggle());
    },
    ArrowLeft: () => {
      art.backward = constructor.SEEK_STEP;
    },
    ArrowUp: () => {
      art.volume += constructor.VOLUME_STEP;
    },
    ArrowRight: () => {
      art.forward = constructor.SEEK_STEP;
    },
    ArrowDown: () => {
      art.volume -= constructor.VOLUME_STEP;
    }
  };
}
function asElement(target) {
  if (target && target.nodeType === 1)
    return target;
}
function eventDocument(event, fallback) {
  const target = event.target;
  return target?.nodeType === 9 ? target : target?.ownerDocument || event.view?.document || fallback;
}
function editable(target) {
  const tag = target.tagName.toUpperCase();
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")
    return true;
  return target.isContentEditable;
}
function acceptsHotkey(event, fallback) {
  if (isClaimedKey(event) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing || event.keyCode === 229)
    return false;
  const doc = eventDocument(event, fallback);
  let active2 = asElement(doc.activeElement);
  while (active2?.shadowRoot?.activeElement)
    active2 = asElement(active2.shadowRoot.activeElement);
  if (active2 && editable(active2))
    return false;
  const first = asElement(event.composedPath?.()[0]) || asElement(event.target);
  const enter = event.key === "Enter" || event.code === "Enter" || event.code === "NumpadEnter";
  const activation = enter || event.key === " " || event.code === "Space";
  if (activation) {
    const selector = `button,summary,[role="button"],[role="switch"]${enter ? ",a[href]" : ""}`;
    if (first?.closest?.(selector) || active2?.closest?.(selector))
      return false;
  }
  return !first || !editable(first);
}
const states$4 = /* @__PURE__ */ new WeakMap();
class Hotkey {
  constructor(art) {
    this.art = art;
    this.keys = {};
    states$4.set(this, { subscribed: false });
    if (!isMobile)
      this.init();
  }
  init() {
    const art = this.art;
    if (isClosing(art))
      return;
    const state2 = states$4.get(this);
    if (art.option.hotkey) {
      if (!state2.defaults) {
        const callbacks = defaultHotkeys(art);
        state2.defaults = () => {
          for (const key of Object.keys(callbacks))
            this.add(key, callbacks[key]);
        };
      }
      state2.defaults();
    }
    if (state2.subscribed)
      return;
    state2.subscribed = true;
    const onKeydown = (event) => {
      if (isClosing(art))
        return;
      if (art.isFocus && acceptsHotkey(event, art.template.$player.ownerDocument)) {
        const callbacks = Object.prototype.hasOwnProperty.call(this.keys, event.code) ? this.keys[event.code] : void 0;
        if (callbacks) {
          event.preventDefault();
          for (let index = 0; index < callbacks.length; index++) {
            if (isClosing(art))
              return;
            callbacks[index].call(art, event);
          }
          if (isClosing(art))
            return;
          art.emit("hotkey", event);
        }
      }
      if (!isClosing(art))
        art.emit("keydown", event);
    };
    art.on("document:keydown", onKeydown);
    getScope(art).add(() => {
      state2.subscribed = false;
      art.off("document:keydown", onKeydown);
    });
  }
  add(key, callback) {
    const existing = Object.prototype.hasOwnProperty.call(this.keys, key) ? this.keys[key] : void 0;
    if (existing) {
      if (!existing.includes(callback))
        existing.push(callback);
    } else {
      Object.defineProperty(this.keys, key, { value: [callback], enumerable: true, configurable: true, writable: true });
    }
    return this;
  }
  remove(key, callback) {
    const existing = Object.prototype.hasOwnProperty.call(this.keys, key) ? this.keys[key] : void 0;
    if (existing) {
      const index = existing.indexOf(callback);
      if (index !== -1)
        existing.splice(index, 1);
      if (existing.length === 0)
        delete this.keys[key];
    }
    return this;
  }
}
function publishLanguage(name, value) {
  if (typeof window !== "undefined") {
    const globals = window;
    globals[name] = value;
  }
}
const zhCn = {
  "Context Menu": "快捷菜单",
  "Lock": "锁定",
  "Back": "返回",
  "Settings": "设置",
  "Progress": "播放进度",
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
publishLanguage("artplayer-i18n-zh-cn", zhCn);
class I18n {
  constructor(art) {
    this.art = art;
    this.languages = { "zh-cn": zhCn };
    this.language = {};
    this.update(art.option.i18n);
  }
  init() {
    const lang = this.art.option.lang.toLowerCase();
    this.language = has(this.languages, lang) && this.languages[lang] || {};
  }
  get(key) {
    return has(this.language, key) && this.language[key] || key;
  }
  update(value) {
    this.languages = mergeDeep(this.languages, value);
    this.init();
  }
}
const airplay = '<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">\r\n    <g>\r\n        <path d="M16,1 L2,1 C1.447,1 1,1.447 1,2 L1,12 C1,12.553 1.447,13 2,13 L5,13 L5,11 L3,11 L3,3 L15,3 L15,11 L13,11 L13,13 L16,13 C16.553,13 17,12.553 17,12 L17,2 C17,1.447 16.553,1 16,1 L16,1 Z"></path>\r\n        <polygon points="4 17 14 17 9 11"></polygon>\r\n    </g>\r\n</svg>\r\n';
const arrowLeft = '<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" version="1.1" viewBox="0 0 32 32">\r\n    <path d="M 19.41,20.09 14.83,15.5 19.41,10.91 18,9.5 l -6,6 6,6 z" />\r\n</svg>';
const arrowRight = '<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" version="1.1" viewBox="0 0 32 32">\r\n    <path d="m 12.59,20.34 4.58,-4.59 -4.58,-4.59 1.41,-1.41 6,6 -6,6 z" />\r\n</svg>';
const aspectRatio$1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"><defs><clipPath id="__lottie_element_216"><rect width="88" height="88" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_216)"><g transform="matrix(1,0,0,1,44,44)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill-opacity="1" d=" M12.437999725341797,-12.70199966430664 C12.437999725341797,-12.70199966430664 9.618000030517578,-9.881999969482422 9.618000030517578,-9.881999969482422 C8.82800006866455,-9.092000007629395 8.82800006866455,-7.831999778747559 9.618000030517578,-7.052000045776367 C9.618000030517578,-7.052000045776367 16.687999725341797,0.017999999225139618 16.687999725341797,0.017999999225139618 C16.687999725341797,0.017999999225139618 9.618000030517578,7.0879998207092285 9.618000030517578,7.0879998207092285 C8.82800006866455,7.877999782562256 8.82800006866455,9.137999534606934 9.618000030517578,9.918000221252441 C9.618000030517578,9.918000221252441 12.437999725341797,12.748000144958496 12.437999725341797,12.748000144958496 C13.227999687194824,13.527999877929688 14.48799991607666,13.527999877929688 15.267999649047852,12.748000144958496 C15.267999649047852,12.748000144958496 26.58799934387207,1.437999963760376 26.58799934387207,1.437999963760376 C27.368000030517578,0.6579999923706055 27.368000030517578,-0.6119999885559082 26.58799934387207,-1.3919999599456787 C26.58799934387207,-1.3919999599456787 15.267999649047852,-12.70199966430664 15.267999649047852,-12.70199966430664 C14.48799991607666,-13.491999626159668 13.227999687194824,-13.491999626159668 12.437999725341797,-12.70199966430664z M-12.442000389099121,-12.70199966430664 C-13.182000160217285,-13.442000389099121 -14.362000465393066,-13.482000350952148 -15.142000198364258,-12.821999549865723 C-15.142000198364258,-12.821999549865723 -15.272000312805176,-12.70199966430664 -15.272000312805176,-12.70199966430664 C-15.272000312805176,-12.70199966430664 -26.582000732421875,-1.3919999599456787 -26.582000732421875,-1.3919999599456787 C-27.32200050354004,-0.6520000100135803 -27.36199951171875,0.5180000066757202 -26.70199966430664,1.3079999685287476 C-26.70199966430664,1.3079999685287476 -26.582000732421875,1.437999963760376 -26.582000732421875,1.437999963760376 C-26.582000732421875,1.437999963760376 -15.272000312805176,12.748000144958496 -15.272000312805176,12.748000144958496 C-14.531999588012695,13.48799991607666 -13.362000465393066,13.527999877929688 -12.571999549865723,12.868000030517578 C-12.571999549865723,12.868000030517578 -12.442000389099121,12.748000144958496 -12.442000389099121,12.748000144958496 C-12.442000389099121,12.748000144958496 -9.612000465393066,9.918000221252441 -9.612000465393066,9.918000221252441 C-8.871999740600586,9.178000450134277 -8.831999778747559,8.008000373840332 -9.501999855041504,7.2179999351501465 C-9.501999855041504,7.2179999351501465 -9.612000465393066,7.0879998207092285 -9.612000465393066,7.0879998207092285 C-9.612000465393066,7.0879998207092285 -16.68199920654297,0.017999999225139618 -16.68199920654297,0.017999999225139618 C-16.68199920654297,0.017999999225139618 -9.612000465393066,-7.052000045776367 -9.612000465393066,-7.052000045776367 C-8.871999740600586,-7.791999816894531 -8.831999778747559,-8.961999893188477 -9.501999855041504,-9.751999855041504 C-9.501999855041504,-9.751999855041504 -9.612000465393066,-9.881999969482422 -9.612000465393066,-9.881999969482422 C-9.612000465393066,-9.881999969482422 -12.442000389099121,-12.70199966430664 -12.442000389099121,-12.70199966430664z M28,-28 C32.41999816894531,-28 36,-24.420000076293945 36,-20 C36,-20 36,20 36,20 C36,24.420000076293945 32.41999816894531,28 28,28 C28,28 -28,28 -28,28 C-32.41999816894531,28 -36,24.420000076293945 -36,20 C-36,20 -36,-20 -36,-20 C-36,-24.420000076293945 -32.41999816894531,-28 -28,-28 C-28,-28 28,-28 28,-28z" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#a8a6a4;"></path></g></g></g></svg>';
const check = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24" style="width: 100%; height: 100%;">\r\n<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />\r\n</svg>';
const close = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg t="1655876154826" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22">\r\n<path d="M571.733333 512l268.8-268.8c17.066667-17.066667 17.066667-42.666667 0-59.733333-17.066667-17.066667-42.666667-17.066667-59.733333 0L512 452.266667 243.2 183.466667c-17.066667-17.066667-42.666667-17.066667-59.733333 0-17.066667 17.066667-17.066667 42.666667 0 59.733333L452.266667 512 183.466667 780.8c-17.066667 17.066667-17.066667 42.666667 0 59.733333 8.533333 8.533333 19.2 12.8 29.866666 12.8s21.333333-4.266667 29.866667-12.8L512 571.733333l268.8 268.8c8.533333 8.533333 19.2 12.8 29.866667 12.8s21.333333-4.266667 29.866666-12.8c17.066667-17.066667 17.066667-42.666667 0-59.733333L571.733333 512z" p-id="2131">\r\n</path>\r\n</svg>';
const config = '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z            M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#a8a6a4;"></path></svg>';
const error = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg t="1652850026663" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2749" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50">\r\n<path d="M593.8176 168.5504l356.00384 595.21024c26.15296 43.74528 10.73152 99.7376-34.44736 125.05088-14.39744 8.06912-30.72 12.30848-47.37024 12.30848H155.97568C103.75168 901.12 61.44 860.16 61.44 809.61536c0-16.09728 4.38272-31.92832 12.71808-45.8752L430.16192 168.5504c26.17344-43.7248 84.00896-58.65472 129.20832-33.34144a93.0816 93.0816 0 0 1 34.44736 33.34144zM512 819.2a61.44 61.44 0 1 0 0-122.88 61.44 61.44 0 0 0 0 122.88z m0-512a72.31488 72.31488 0 0 0-71.76192 81.3056l25.72288 205.7216a46.40768 46.40768 0 0 0 92.07808 0l25.72288-205.74208A72.31488 72.31488 0 0 0 512 307.2z" p-id="2750">\r\n</path>\r\n</svg>';
const flip$1 = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg t="1652445277062" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">\r\n<path d="M554.666667 810.666667v85.333333h-85.333334v-85.333333h85.333334zM170.666667 178.005333a42.666667 42.666667 0 0 1 34.986666 18.218667l203.904 291.328a42.666667 42.666667 0 0 1 0 48.896l-203.946666 291.328A42.666667 42.666667 0 0 1 128 803.328V220.672a42.666667 42.666667 0 0 1 42.666667-42.666667z m682.666666 0a42.666667 42.666667 0 0 1 42.368 37.717334l0.298667 4.949333v582.656a42.666667 42.666667 0 0 1-74.24 28.629333l-3.413333-4.181333-203.904-291.328a42.666667 42.666667 0 0 1-3.029334-43.861333l3.029334-5.034667 203.946666-291.328A42.666667 42.666667 0 0 1 853.333333 178.005333zM554.666667 640v85.333333h-85.333334v-85.333333h85.333334zM196.266667 319.104V716.8L335.957333 512 196.309333 319.104zM554.666667 469.333333v85.333334h-85.333334v-85.333334h85.333334z m0-170.666666v85.333333h-85.333334V298.666667h85.333334z m0-170.666667v85.333333h-85.333334V128h85.333334z">\r\n</path>\r\n</svg>\r\n';
const fullscreenOff = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg class="icon" width="22" height="22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\r\n<path d="M768 298.666667h170.666667v85.333333h-256V128h85.333333v170.666667zM341.333333 384H85.333333V298.666667h170.666667V128h85.333333v256z m426.666667 341.333333v170.666667h-85.333333v-256h256v85.333333h-170.666667zM341.333333 640v256H256v-170.666667H85.333333v-85.333333h256z" />\r\n</svg>\r\n';
const fullscreenOn = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg class="icon" width="22" height="22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\r\n<path d="M625.777778 256h142.222222V398.222222h113.777778V142.222222H625.777778v113.777778zM256 398.222222V256H398.222222v-113.777778H142.222222V398.222222h113.777778zM768 625.777778v142.222222H625.777778v113.777778h256V625.777778h-113.777778zM398.222222 768H256V625.777778h-113.777778v256H398.222222v-113.777778z" />\r\n</svg>\r\n';
const fullscreenWebOff = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg class="icon" width="18" height="18" viewBox="0 0 1152 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\r\n<path d="M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4A76.8 76.8 0 0 0 76.8 1024h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0zM1024 128v768H128V128h896zM896 512a64 64 0 0 1 7.488 127.552L896 640h-128v128a64 64 0 0 1-56.512 63.552L704 832a64 64 0 0 1-63.552-56.512L640 768V582.592c0-34.496 25.024-66.112 61.632-70.208L709.632 512H896zM256 512a64 64 0 0 1-7.488-127.552L256 384h128V256a64 64 0 0 1 56.512-63.552L448 192a64 64 0 0 1 63.552 56.512L512 256v185.408c0 34.432-25.024 66.112-61.632 70.144L442.368 512H256z" />\r\n</svg>\r\n';
const fullscreenWebOn = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg class="icon" width="18" height="18" viewBox="0 0 1152 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\r\n<path d="M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4A76.8 76.8 0 0 0 76.8 1024h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0zM1024 128v768H128V128h896zM448 192a64 64 0 0 1 7.488 127.552L448 320H320v128a64 64 0 0 1-56.512 63.552L256 512a64 64 0 0 1-63.552-56.512L192 448V262.592c0-34.432 25.024-66.112 61.632-70.144L261.632 192H448zM704 832a64 64 0 0 1-7.488-127.552L704 704h128V576a64 64 0 0 1 56.512-63.552L896 512a64 64 0 0 1 63.552 56.512L960 576v185.408c0 34.496-25.024 66.112-61.632 70.208l-8 0.384H704z" />\r\n</svg>\r\n';
const loading = '<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default">\r\n  <rect x="0" y="0" width="100" height="100" fill="none" class="bk"/>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(0 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-1s" repeatCount="indefinite"/>\r\n  </rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(30 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"/>\r\n  </rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(60 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"/>\r\n  </rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(90 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.75s" repeatCount="indefinite"/></rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(120 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"/>\r\n  </rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(150 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"/>\r\n  </rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(180 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.5s" repeatCount="indefinite"/></rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(210 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"/>\r\n  </rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(240 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"/>\r\n  </rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(270 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.25s" repeatCount="indefinite"/></rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(300 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"/>\r\n  </rect>\r\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" transform="rotate(330 50 50) translate(0 -30)">\r\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"/>\r\n  </rect>\r\n</svg>';
const lock$1 = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg t="1650612139149" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">\r\n<path d="M298.666667 426.666667V341.333333a213.333333 213.333333 0 1 1 426.666666 0v85.333334h42.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667z m213.333333-213.333334a128 128 0 0 0-128 128v85.333334h256V341.333333a128 128 0 0 0-128-128z"></path>\r\n</svg>\r\n';
const pause = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\r\n    <path d="M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z"></path>\r\n</svg>';
const pip = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="22" height="22">\r\n<path d="M844.8 219.648h-665.6c-6.144 0-10.24 4.608-10.24 10.752v563.2c0 5.632 4.096 10.24 10.24 10.24h256v92.16h-256a102.4 102.4 0 0 1-102.4-102.4v-563.2c0-56.832 45.568-102.4 102.4-102.4h665.6a102.4 102.4 0 0 1 102.4 102.4v204.8h-92.16v-204.8c0-6.144-4.608-10.752-10.24-10.752zM614.4 588.8c-28.672 0-51.2 22.528-51.2 51.2v204.8c0 28.16 22.528 51.2 51.2 51.2h281.6c28.16 0 51.2-23.04 51.2-51.2v-204.8c0-28.672-23.04-51.2-51.2-51.2H614.4z"></path>\r\n</svg>';
const play = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\r\n  <path d="M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z"></path>\r\n</svg>';
const playbackRate$1 = '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#a8a6a4;"></path></svg>';
const screenshot = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 50 50">\r\n	<path d="M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z "/>\r\n</svg>\r\n';
const setting = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\r\n    <circle cx="11" cy="11" r="2"></circle>\r\n    <path d="M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"></path>\r\n</svg>';
const state = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">\r\n<path d="M9.5 9.325v5.35q0 .575.525.875t1.025-.05l4.15-2.65q.475-.3.475-.85t-.475-.85L11.05 8.5q-.5-.35-1.025-.05t-.525.875ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/>\r\n</svg>\r\n';
const switchOff = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg class="icon" width="26" height="26" viewBox="0 0 1740 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\r\n    <path d="M511.8976 1024h670.5152c282.4192-0.4096 511.1808-229.4784 511.1808-511.8976 0-282.4192-228.7616-511.488-511.1808-511.8976H511.8976C229.4784 0.6144 0.7168 229.6832 0.7168 512.1024c0 282.4192 228.7616 511.488 511.1808 511.8976zM511.3344 48.64A464.5888 464.5888 0 1 1 48.0256 513.024 463.872 463.872 0 0 1 511.3344 48.4352V48.64z" />\r\n</svg>\r\n';
const switchOn = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg class="icon" width="26" height="26" viewBox="0 0 1664 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">\r\n    <path fill="#648FFC" d="M1152 0H512a512 512 0 0 0 0 1024h640a512 512 0 0 0 0-1024z m0 960a448 448 0 1 1 448-448 448 448 0 0 1-448 448z"  />\r\n</svg>';
const unlock$1 = '<?xml version="1.0" standalone="no"?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg t="1650612464266" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M666.752 194.517333L617.386667 268.629333A128 128 0 0 0 384 341.333333l0.042667 85.333334h384a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667V341.333333a213.333333 213.333333 0 0 1 368.085333-146.816z"></path></svg>\r\n';
const volumeClose = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\r\n    <path d="M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z"></path>\r\n    <path d="M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z"></path>\r\n</svg>';
const volume = '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\r\n    <path d="M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z"></path>\r\n    <path d="M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z"></path>\r\n</svg>';
const defaults = {
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
  unlock: unlock$1,
  fullscreenOff,
  fullscreenOn,
  fullscreenWebOff,
  fullscreenWebOn,
  switchOn,
  switchOff,
  error,
  close,
  airplay
};
class Icons {
  constructor(art) {
    const icons = { ...defaults, ...art.option.icons };
    for (const key in icons) {
      def(this, key, {
        get: () => getIcon(key, icons[key])
      });
    }
  }
}
const origins = /* @__PURE__ */ new WeakMap();
function infoKeyboard(art, scope, close2) {
  const { $player, $info, $infoClose } = art.template;
  if (!$info)
    return;
  const active2 = () => !scope.closed && !isClosing(art);
  const visible = () => $player.classList.contains("art-info-show");
  const closeLabel = art.i18n.get("Close");
  if (!active2())
    return;
  const groupLabel = art.i18n.get("Video Info");
  if (!active2())
    return;
  $infoClose.setAttribute("aria-label", closeLabel);
  $info.setAttribute("role", "group");
  $info.setAttribute("aria-label", groupLabel);
  keyboardButton(scope, $infoClose, () => $infoClose.click(), visible);
  listen(scope, $info, "keydown", (input) => {
    const event = input;
    if (active2() && visible() && plainKey(event) && !event.defaultPrevented && event.key === "Escape") {
      claimKey(event);
      close2();
    }
  });
  const changed = (show) => {
    if (!active2())
      return;
    const doc = $player.ownerDocument;
    const focused = doc.activeElement;
    if (show) {
      if (!$info.contains(focused)) {
        origins.delete(art);
        if (focused && $player.contains(focused)) {
          origins.set(art, resolveFocusOrigin(focused));
          if ($player.classList.contains("art-keyboard-focus"))
            $infoClose.focus({ preventScroll: true });
        }
      }
    } else {
      const origin = origins.get(art);
      origins.delete(art);
      if (!$info.contains(focused))
        return;
      const visibility = origin && doc.defaultView?.getComputedStyle(origin).visibility;
      if (origin?.isConnected && $player.contains(origin) && origin.getClientRects().length && visibility !== "hidden" && visibility !== "collapse" && !origin.matches(":disabled") && !origin.closest("[inert]") && origin.getAttribute("aria-disabled") !== "true")
        origin.focus({ preventScroll: true });
      else
        focusPlayer(art);
    }
  };
  art.on("info", changed);
  scope.add(() => {
    art.off("info", changed);
  });
}
function pollInfo(art, scope, close2) {
  const active2 = () => !scope.closed && !isClosing(art);
  const fail = (error2) => {
    try {
      scope.dispose();
    } catch (cleanupError) {
      console.warn("Failed to release info polling resources:", cleanupError);
    }
    throw error2;
  };
  try {
    const { proxy, constructor, template: { $infoPanel, $infoClose, $video } } = art;
    const cleanup = proxy($infoClose, "click", () => {
      if (active2())
        close2();
    });
    scope.add(() => {
      art.events.remove(cleanup);
    });
    const items = Array.from($infoPanel.querySelectorAll("[data-video]"));
    const destroy = () => scope.dispose();
    art.on("destroy", destroy);
    scope.add(() => {
      art.off("destroy", destroy);
    });
    infoKeyboard(art, scope, close2);
    const loop = () => {
      try {
        for (const item of items) {
          if (!active2())
            return;
          const value = Reflect.get($video, item.dataset.video ?? "undefined");
          if (!active2())
            return;
          const raw = typeof value === "number" ? value.toFixed(2) : value;
          if (!active2())
            return;
          if (item.textContent !== raw) {
            const text = raw == null ? null : `${raw}`;
            if (!active2())
              return;
            item.textContent = text;
          }
        }
        if (active2())
          timeout(scope, loop, constructor.INFO_LOOP_TIME);
      } catch (error2) {
        fail(error2);
      }
    };
    if (active2())
      loop();
  } catch (error2) {
    fail(error2);
  }
}
const states$3 = /* @__PURE__ */ new WeakMap();
class Info extends Component {
  constructor(art) {
    super(art);
    this.name = "info";
    states$3.set(this, { revision: 0 });
    if (!isMobile)
      this.init();
  }
  init() {
    const state2 = states$3.get(this);
    const revision = ++state2.revision;
    state2.scope?.dispose();
    if (isClosing(this.art) || state2.revision !== revision)
      return;
    const scope = getScope(this.art).child();
    state2.scope = scope;
    scope.add(() => {
      if (state2.scope === scope)
        state2.scope = void 0;
    });
    pollInfo(this.art, scope, () => {
      this.show = false;
    });
  }
}
class Layer extends Component {
  constructor(art) {
    super(art);
    const { option, template: { $layer } } = art;
    this.name = "layer";
    this.$parent = $layer;
    for (let index = 0; index < option.layers.length; index++)
      this.add(option.layers[index]);
  }
}
class Loading extends Component {
  constructor(art) {
    super(art);
    this.name = "loading";
    const icon = art.icons.loading;
    if (!isClosing(art))
      appendElement(art.template.$loading, icon);
  }
}
class Mask extends Component {
  constructor(art) {
    super(art);
    this.name = "mask";
    const { template, icons, events } = art;
    const stateIcon = icons.state;
    if (isClosing(art))
      return;
    const $state = appendElement(template.$state, stateIcon);
    const errorIcon = icons.error;
    if (isClosing(art))
      return;
    const $error = appendElement(template.$state, errorIcon);
    setStyle($error, "display", "none");
    let terminalEventHandled = false;
    const destroy = () => {
      setStyle($state, "display", "none");
      setStyle($error, "display", null);
      if (isClosing(art))
        terminalEventHandled = true;
    };
    art.on("destroy", destroy);
    getFinalizationScope(art).add(() => {
      try {
        if (!terminalEventHandled)
          destroy();
      } finally {
        art.off("destroy", destroy);
      }
    });
    if (!isClosing(art)) {
      events.proxy(template.$state, "click", () => {
        if (!isClosing(art))
          silencePromise(art.play());
      });
    }
  }
}
const states$2 = /* @__PURE__ */ new WeakMap();
function cancelNotice(notice) {
  const state2 = states$2.get(notice);
  state2.revision++;
  state2.pending = void 0;
  if (notice.timer !== null) {
    clearTimeout(notice.timer);
    notice.timer = null;
  }
}
class Notice {
  constructor(art) {
    this.art = art;
    this.timer = null;
    states$2.set(this, { revision: 0 });
    const destroy = () => this.destroy();
    art.on("destroy", destroy);
    getScope(art).add(() => {
      art.off("destroy", destroy);
    });
    getScope(art).add(() => {
      this.destroy();
    });
  }
  destroy() {
    cancelNotice(this);
  }
  set show(msg) {
    if (isClosing(this.art))
      return;
    const state2 = states$2.get(this);
    state2.revision++;
    const {
      constructor,
      template: { $player, $noticeInner }
    } = this.art;
    if (msg) {
      cancelNotice(this);
      const revision = state2.revision;
      const active2 = () => !isClosing(this.art) && state2.revision === revision;
      $noticeInner.textContent = msg instanceof Error ? msg.message.trim() : msg;
      if (!active2())
        return;
      addClass($player, "art-notice-show");
      if (!active2())
        return;
      const delay = constructor.NOTICE_TIME;
      if (!active2())
        return;
      const pending2 = {};
      state2.pending = pending2;
      const timer = setTimeout(() => {
        if (isClosing(this.art) || state2.pending !== pending2)
          return;
        state2.pending = void 0;
        const before = state2.revision;
        $noticeInner.textContent = "";
        if (!isClosing(this.art) && state2.revision === before)
          removeClass($player, "art-notice-show");
      }, delay);
      if (active2())
        this.timer = timer;
      else
        clearTimeout(timer);
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
function createDefaults() {
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
function resolveOption(input, defaults2) {
  const merged = mergeDeep(defaults2, input);
  merged.container = input.container;
  return validator(merged, scheme);
}
function resolveRuntimeOption(input, defaults2) {
  return resolveOption(input, defaults2);
}
function airplayMix(art) {
  if (isClosing(art))
    return;
  const {
    i18n,
    notice,
    proxy,
    template: { $video }
  } = art;
  let available2 = true;
  const supported = window.WebKitPlaybackTargetAvailabilityEvent;
  if (isClosing(art))
    return;
  const picker = supported && $video.webkitShowPlaybackTargetPicker;
  if (isClosing(art))
    return;
  if (picker) {
    proxy($video, "webkitplaybacktargetavailabilitychanged", (event) => {
      if (isClosing(art))
        return;
      switch (event.availability) {
        case "available":
          available2 = true;
          break;
        case "not-available":
          available2 = false;
          break;
      }
    });
  } else {
    available2 = false;
  }
  if (isClosing(art))
    return;
  def(art, "airplay", {
    value() {
      if (isClosing(art))
        return;
      if (available2) {
        const picker2 = $video.webkitShowPlaybackTargetPicker;
        if (isClosing(art))
          return;
        Reflect.apply(picker2, $video, []);
        if (!isClosing(art))
          art.emit("airplay");
      } else {
        const message = i18n.get("AirPlay Not Available");
        if (!isClosing(art))
          notice.show = message;
      }
    }
  });
}
function positiveSize({ width, height }) {
  return Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0;
}
function containSize(container, ratio) {
  if (!positiveSize(container) || !Number.isFinite(ratio) || ratio <= 0)
    return;
  const result = container.width / container.height > ratio ? { width: ratio * container.height, height: container.height, axis: "width" } : { width: container.width, height: container.width / ratio, axis: "height" };
  return positiveSize(result) ? result : void 0;
}
function proportionalHeight(width, media) {
  if (!Number.isFinite(width) || width <= 0 || !positiveSize(media))
    return;
  const height = media.height * (width / media.width);
  return Number.isFinite(height) && height > 0 ? height : void 0;
}
function aspectRatioMix(art) {
  const { i18n, notice, template: { $video, $player } } = art;
  def(art, "aspectRatio", {
    get: () => $player.dataset.aspectRatio || "default",
    set(ratio) {
      if (isClosing(art))
        return;
      if (!ratio)
        ratio = "default";
      if (ratio === "default") {
        $video.style.width = "";
        $video.style.height = "";
        $video.style.margin = "";
        delete $player.dataset.aspectRatio;
      } else {
        const parts = ratio.split(":").map(Number);
        const size = containSize({ width: $player.clientWidth, height: $player.clientHeight }, parts[0] / parts[1]);
        if (isClosing(art))
          return;
        if (size?.axis === "width") {
          $video.style.width = `${size.width}px`;
          $video.style.height = "100%";
          $video.style.margin = "0 auto";
        } else if (size) {
          $video.style.width = "100%";
          $video.style.height = `${size.height}px`;
          $video.style.margin = "auto 0";
        }
        $player.dataset.aspectRatio = ratio;
      }
      notice.show = `${i18n.get("Aspect Ratio")}: ${ratio === "default" ? i18n.get("Default") : ratio}`;
      if (!isClosing(art))
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
      const target = $video;
      if (value === void 0)
        return target[key];
      target[key] = value;
    }
  });
}
function autoHeightMix(art) {
  const { $container, $video } = art.template;
  def(art, "autoHeight", {
    value() {
      if (isClosing(art))
        return;
      const height = proportionalHeight($container.clientWidth, { width: $video.videoWidth, height: $video.videoHeight });
      if (height === void 0 || isClosing(art))
        return;
      $container.style.height = `${height}px`;
      art.emit("autoHeight", height);
    }
  });
}
function autoSizeMix(art) {
  const { $container, $player, $video } = art.template;
  def(art, "autoSize", {
    value() {
      if (isClosing(art))
        return;
      const media = { width: $video.videoWidth, height: $video.videoHeight };
      if (!positiveSize(media))
        return;
      const container = getRect($container);
      const size = containSize(container, media.width / media.height);
      if (!size || isClosing(art))
        return;
      if (size.axis === "width") {
        $player.style.width = `${size.width / container.width * 100}%`;
        $player.style.height = "100%";
      } else {
        $player.style.width = "100%";
        $player.style.height = `${size.height / container.height * 100}%`;
      }
      art.emit("autoSize", { width: art.width, height: art.height });
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
      const parsed = Number.parseFloat(time2);
      if (Number.isNaN(parsed))
        return;
      advancePosition(art);
      $video.currentTime = clamp(parsed, 0, art.duration);
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
function forwardMediaEvents(art) {
  const { proxy, template: { $video } } = art;
  for (let index = 0; index < config$1.events.length; index++) {
    proxy($video, config$1.events[index], (event) => {
      if (!isClosing(art))
        art.emit(`video:${event.type}`, event);
    });
  }
}
function listenMedia(art, name, callback, once = false) {
  const guarded = (event) => {
    if (!isClosing(art))
      callback(event);
  };
  art[once ? "once" : "on"](name, guarded);
  getScope(art).add(() => {
    art.off(name, guarded);
  });
}
function showMediaUI(art, changes, active2) {
  for (const [name, value] of changes) {
    if (isClosing(art) || active2 && !active2())
      return;
    art[name].show = value;
  }
}
function installEnded(art) {
  const { option } = art;
  listenMedia(art, "video:ended", () => {
    if (option.loop) {
      const active2 = captureSource(art);
      art.seek = 0;
      if (isClosing(art) || !active2())
        return;
      silencePromise(art.play());
      if (active2())
        showMediaUI(art, [["controls", false], ["mask", false]], active2);
    } else {
      showMediaUI(art, [["controls", true], ["mask", true]]);
    }
  });
}
function installPlaybackUI(art, reconnect) {
  const { template: { $poster } } = art;
  listenMedia(art, "video:loadedmetadata", () => {
    art.emit("resize");
    if (isMobile)
      showMediaUI(art, [["loading", false], ["controls", true], ["mask", true]]);
  });
  listenMedia(art, "video:loadstart", () => {
    reconnect.loadStart();
    showMediaUI(art, [["loading", true], ["mask", false], ["controls", true]]);
  });
  listenMedia(art, "video:pause", () => {
    showMediaUI(art, [["controls", true], ["mask", true]]);
  });
  listenMedia(art, "video:play", () => {
    showMediaUI(art, [["mask", false]]);
    if (!isClosing(art))
      setStyle($poster, "display", "none");
  });
  listenMedia(art, "video:playing", () => showMediaUI(art, [["mask", false]]));
  listenMedia(art, "video:progress", () => {
    if (art.playing)
      showMediaUI(art, [["loading", false]]);
  });
  listenMedia(art, "video:seeked", () => showMediaUI(art, [["loading", false], ["mask", true]]));
  listenMedia(art, "video:seeking", () => showMediaUI(art, [["loading", true], ["mask", false]]));
  listenMedia(art, "video:timeupdate", () => showMediaUI(art, [["mask", false]]));
  listenMedia(art, "video:waiting", () => showMediaUI(art, [["loading", true], ["mask", false]]));
}
function installReadiness(art, reconnect) {
  listenMedia(art, "video:canplay", () => {
    reconnect.reset();
    showMediaUI(art, [["loading", false]]);
  });
  listenMedia(art, "video:canplay", () => {
    showMediaUI(art, [["loading", false], ["controls", true], ["mask", true]]);
    if (isClosing(art))
      return;
    art.isReady = true;
    art.emit("ready");
  }, true);
}
function createReconnect(art) {
  const { option, constructor, i18n, notice, template: { $player } } = art;
  let source = getSourceScope(art);
  let attempts = 0;
  let pending2;
  const run = async (error2) => {
    if (isClosing(art))
      return;
    const current2 = getSourceScope(art);
    if (current2 !== source) {
      source = current2;
      attempts = 0;
    }
    if (pending2 && !pending2.closed)
      return;
    const attempt = current2.child();
    pending2 = attempt;
    attempt.add(() => {
      if (pending2 === attempt)
        pending2 = void 0;
    });
    const active2 = () => !isClosing(art) && !attempt.closed && current2 === getSourceScope(art);
    const retry = attempts < constructor.RECONNECT_TIME_MAX;
    try {
      if (!retry) {
        showMediaUI(art, [["mask", true], ["loading", false], ["controls", true]], active2);
        if (!active2())
          return;
        addClass($player, "art-error");
      }
      if (!await wait(attempt, constructor.RECONNECT_SLEEP_TIME) || !active2())
        return;
      if (retry) {
        const url = option.url;
        if (!active2())
          return;
        attempts += 1;
        const attemptNumber = attempts;
        attempt.dispose();
        const operation = beginSource(art);
        source = getSourceScope(art);
        assignUrl(art, operation, url);
        if (!operation.active())
          return;
        const message = `${i18n.get("Reconnect")}: ${attemptNumber}`;
        if (!operation.active())
          return;
        notice.show = message;
        if (operation.active())
          art.emit("error", error2, attemptNumber);
      } else {
        const message = i18n.get("Video Load Failed");
        if (active2())
          notice.show = message;
      }
    } finally {
      attempt.dispose();
    }
  };
  return {
    reset() {
      attempts = 0;
      pending2?.dispose();
      removeClass($player, "art-error");
    },
    loadStart() {
      removeClass($player, "art-error");
    },
    schedule(error2) {
      void run(error2).catch((failure) => {
        console.warn("ArtPlayer reconnect failed:", failure);
      });
    }
  };
}
function eventInit(art) {
  forwardMediaEvents(art);
  const reconnect = createReconnect(art);
  installReadiness(art, reconnect);
  installEnded(art);
  listenMedia(art, "video:error", reconnect.schedule);
  installPlaybackUI(art, reconnect);
}
function flipMix(art) {
  const { template: { $player }, i18n, notice } = art;
  def(art, "flip", {
    get: () => $player.dataset.flip || "normal",
    set(flip2) {
      if (isClosing(art))
        return;
      if (!flip2)
        flip2 = "normal";
      if (flip2 === "normal")
        delete $player.dataset.flip;
      else
        $player.dataset.flip = flip2;
      notice.show = `${i18n.get("Video Flip")}: ${i18n.get(capitalize(flip2))}`;
      if (!isClosing(art))
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
function call(target, name, ...args) {
  const method = Reflect.get(target, name);
  if (typeof method !== "function")
    throw new TypeError(`Fullscreen method ${name} is not available`);
  return method.apply(target, args);
}
function fullscreenAdapter(target) {
  const raw = screenfull.raw;
  const document2 = target.ownerDocument;
  if (!raw || !Reflect.get(document2, raw.fullscreenEnabled))
    return void 0;
  return {
    document: document2,
    target,
    get element() {
      return Reflect.get(document2, raw.fullscreenElement);
    },
    elementProperty: raw.fullscreenElement,
    changeEvent: raw.fullscreenchange,
    errorEvent: raw.fullscreenerror,
    request: () => call(target, raw.requestFullscreen, void 0),
    exit: () => call(document2, raw.exitFullscreen)
  };
}
const abandoned$2 = /* @__PURE__ */ new WeakMap();
function hasAbandonedFullscreen(adapter) {
  return abandoned$2.get(adapter.document)?.has(adapter.target) ?? false;
}
function clearAbandonedFullscreen(adapter) {
  abandoned$2.get(adapter.document)?.delete(adapter.target);
}
function exitNative(exit) {
  try {
    void Promise.resolve(exit()).catch(() => {
    });
  } catch {
  }
}
function entriesFor(document2, elementProperty, changeEvent) {
  let entries = abandoned$2.get(document2);
  if (!entries) {
    entries = /* @__PURE__ */ new WeakMap();
    abandoned$2.set(document2, entries);
    const pending2 = entries;
    document2.addEventListener(changeEvent, () => {
      const element = Reflect.get(document2, elementProperty);
      const release = element && pending2.get(element);
      if (!release)
        return;
      pending2.delete(element);
      exitNative(release);
    });
  }
  return entries;
}
function abandonFullscreen(adapter) {
  const { document: document2, elementProperty, changeEvent, target, exit } = adapter;
  const entries = entriesFor(document2, elementProperty, changeEvent);
  entries.set(target, exit);
  if (adapter.element === target) {
    entries.delete(target);
    exitNative(exit);
  }
}
function requestFullscreen(adapter, parent, entering, lateCompletion, hasExited = () => adapter.element !== adapter.target) {
  const scope = parent.child();
  let done = false;
  let cancelled = false;
  let returned = false;
  let promiseResult = false;
  let eventFailed = false;
  let resolve;
  let reject;
  const promise = new Promise((accept, fail) => {
    resolve = accept;
    reject = fail;
  });
  scope.add(() => {
    if (!done) {
      done = true;
      cancelled = true;
      resolve();
      if (returned && !promiseResult && entering)
        abandonFullscreen(adapter);
    }
  });
  function finish2(failed = false, error2) {
    if (done)
      return;
    done = true;
    try {
      scope.dispose();
    } catch (cleanupError) {
      if (!failed) {
        failed = true;
        error2 = cleanupError;
      }
    }
    if (failed)
      reject(error2);
    else
      resolve();
  }
  const changed = () => {
    if (returned && !promiseResult && (entering ? adapter.element === adapter.target : hasExited()))
      finish2();
  };
  listen(scope, adapter.document, adapter.changeEvent, changed);
  listen(scope, adapter.document, adapter.errorEvent, (event) => {
    if (event.target === adapter.target || event.target === adapter.document) {
      eventFailed = true;
      if (returned && !promiseResult)
        finish2(true, new Error("Fullscreen request failed"));
    }
  });
  if (!scope.closed) {
    try {
      if (entering)
        clearAbandonedFullscreen(adapter);
      const result = entering ? adapter.request() : adapter.exit();
      promiseResult = Boolean(result && typeof result.then === "function");
      returned = true;
      if (cancelled && !promiseResult && entering)
        abandonFullscreen(adapter);
      if (promiseResult) {
        void Promise.resolve(result).then(() => {
          if (cancelled)
            lateCompletion();
          else
            finish2();
        }, (error2) => finish2(true, error2)).catch(() => {
        });
      } else if (eventFailed) {
        finish2(true, new Error("Fullscreen request failed"));
      } else {
        changed();
      }
    } catch (error2) {
      finish2(true, error2);
    }
  }
  return { promise, cancel: () => scope.dispose() };
}
function nativeFullscreen(art, adapter) {
  const scope = getScope(art).child();
  const { $player, $video } = art.template;
  const ownsFullscreen = () => adapter.element === $player || adapter.element === $video;
  let last = ownsFullscreen();
  let revision = 0;
  let desired = last;
  let pending2;
  let pendingEntry = false;
  let cancelledEntry = false;
  let requesting = false;
  function exitOwned() {
    if (!ownsFullscreen())
      return;
    try {
      void Promise.resolve(adapter.exit()).catch(() => {
      });
    } catch {
    }
  }
  scope.add(() => {
    revision += 1;
    desired = false;
    $player.classList.remove("art-fullscreen");
    exitOwned();
  });
  listen(scope, adapter.document, adapter.changeEvent, () => {
    const value = ownsFullscreen();
    if (value && hasAbandonedFullscreen(adapter))
      return;
    if (value && cancelledEntry) {
      exitOwned();
      return;
    }
    if (value === last || isClosing(art))
      return;
    last = value;
    const current2 = revision;
    const stale = () => isClosing(art) || ownsFullscreen() !== value || current2 !== revision && desired !== value;
    art.emit("fullscreen", value);
    if (stale())
      return;
    if (value)
      art.state = "fullscreen";
    if (stale())
      return;
    $player.classList.toggle("art-fullscreen", value);
    art.emit("resize");
  });
  listen(scope, adapter.document, adapter.errorEvent, (event) => {
    const ownEvent = event.target === $player || event.target === $video || event.target === adapter.document && (requesting || pending2 !== void 0 || ownsFullscreen());
    if (ownEvent && !isClosing(art))
      art.emit("fullscreenError", event);
  });
  return {
    get: () => !isClosing(art) && ownsFullscreen(),
    set(value) {
      if (isClosing(art))
        return Promise.resolve();
      const current2 = ++revision;
      desired = Boolean(value);
      if (desired)
        cancelledEntry = false;
      else if (pendingEntry)
        cancelledEntry = true;
      pending2?.cancel();
      pending2 = void 0;
      pendingEntry = false;
      if (!desired && !ownsFullscreen())
        return Promise.resolve();
      requesting = true;
      pendingEntry = desired;
      const operation = requestFullscreen(adapter, scope, desired, () => {
        if (isClosing(art) || !desired)
          exitOwned();
      }, () => !ownsFullscreen());
      requesting = false;
      if (revision === current2)
        pending2 = operation;
      else
        operation.cancel();
      const result = operation.promise.catch((error2) => {
        if (!isClosing(art) && revision === current2)
          art.notice.show = error2;
        throw error2;
      }).finally(() => {
        if (revision === current2) {
          pending2 = void 0;
          pendingEntry = false;
        }
      });
      void result.catch(() => {
      });
      return result;
    }
  };
}
const abandoned$1 = /* @__PURE__ */ new WeakSet();
function videoIsFullscreen(video, observed = false) {
  if (typeof video.webkitPresentationMode === "string")
    return video.webkitPresentationMode === "fullscreen";
  if (typeof video.webkitDisplayingFullscreen === "boolean")
    return video.webkitDisplayingFullscreen;
  return video.ownerDocument.fullscreenElement === video || observed;
}
function clearAbandonedVideo(video) {
  abandoned$1.delete(video);
  video.removeEventListener("webkitbeginfullscreen", releaseAbandonedVideo);
  video.removeEventListener("webkitpresentationmodechanged", releaseAbandonedVideo);
}
function releaseAbandonedVideo(event) {
  if (!abandoned$1.has(this) || !videoIsFullscreen(this, event.type === "webkitbeginfullscreen"))
    return;
  clearAbandonedVideo(this);
  try {
    this.webkitExitFullscreen?.();
  } catch {
  }
}
function abandonVideo(video) {
  abandoned$1.add(video);
  video.addEventListener("webkitbeginfullscreen", releaseAbandonedVideo);
  video.addEventListener("webkitpresentationmodechanged", releaseAbandonedVideo);
}
function isAbandonedVideo(video) {
  return abandoned$1.has(video);
}
function videoFullscreen(art) {
  const { $video } = art.template;
  const scope = getScope(art).child();
  let observed = false;
  let last = videoIsFullscreen($video);
  let desired = last;
  let pending2 = false;
  let revision = 0;
  const active2 = () => videoIsFullscreen($video, observed);
  function changed(hint) {
    if (isClosing(art) || isAbandonedVideo($video))
      return;
    if (typeof hint === "boolean")
      observed = hint;
    const value = active2();
    if (value)
      pending2 = false;
    if (value === last)
      return;
    last = value;
    const current2 = revision;
    const stale = () => isClosing(art) || active2() !== value || current2 !== revision && desired !== value;
    art.emit("fullscreen", value);
    if (stale())
      return;
    if (value)
      art.state = "fullscreen";
    if (!stale())
      art.emit("resize");
  }
  scope.add(() => {
    revision++;
    desired = false;
    if (pending2)
      abandonVideo($video);
    if (active2())
      $video.webkitExitFullscreen?.();
  });
  listen(scope, $video, "webkitbeginfullscreen", () => changed(true));
  listen(scope, $video, "webkitendfullscreen", () => changed(false));
  listen(scope, $video, "webkitpresentationmodechanged", () => changed());
  const documentChanged = () => changed();
  art.on("document:webkitfullscreenchange", documentChanged);
  scope.add(() => {
    art.off("document:webkitfullscreenchange", documentChanged);
  });
  return {
    get: () => !isClosing(art) && active2(),
    set(value) {
      if (isClosing(art))
        return;
      const current2 = ++revision;
      desired = Boolean(value);
      if (value) {
        clearAbandonedVideo($video);
        art.state = "fullscreen";
        if (isClosing(art) || current2 !== revision)
          return;
        pending2 = true;
        try {
          $video.webkitEnterFullscreen();
        } catch (error2) {
          if (current2 === revision)
            pending2 = false;
          throw error2;
        }
      } else {
        if (pending2) {
          pending2 = false;
          abandonVideo($video);
        }
        if (active2())
          $video.webkitExitFullscreen();
      }
    }
  };
}
function fullscreenMix(art) {
  const { i18n, notice, template: { $video, $player } } = art;
  const metadata = () => {
    if (isClosing(art))
      return;
    const adapter = fullscreenAdapter($player);
    if (adapter) {
      def(art, "fullscreen", nativeFullscreen(art, adapter));
    } else if ($video.webkitSupportsFullscreen && typeof $video.webkitEnterFullscreen === "function" && typeof $video.webkitExitFullscreen === "function") {
      def(art, "fullscreen", videoFullscreen(art));
    } else {
      def(art, "fullscreen", {
        get: () => false,
        set() {
          if (!isClosing(art))
            notice.show = i18n.get("Fullscreen Not Supported");
        }
      });
    }
    def(art, "fullscreen", get(art, "fullscreen"));
  };
  art.once("video:loadedmetadata", metadata);
  getScope(art).add(() => {
    art.off("video:loadedmetadata", metadata);
  });
}
function captureMovedFocus(root) {
  const focused = root.ownerDocument?.activeElement;
  const inside = focused && root.contains(focused);
  return () => {
    if (inside && focused.isConnected && root.contains(focused) && focused.ownerDocument.activeElement === focused.ownerDocument.body)
      focused.focus({ preventScroll: true });
  };
}
function capturePlacement(node) {
  return { node, parent: node.parentNode, next: node.nextSibling };
}
function restorePlacement({ node, parent, next }) {
  if (!parent) {
    node.parentNode?.removeChild(node);
    return;
  }
  const anchor = next?.parentNode === parent ? next : null;
  if (node.parentNode !== parent || node.nextSibling !== anchor)
    parent.insertBefore(node, anchor);
}
function webFullscreen(art) {
  const { $player } = art.template;
  let saved;
  let revision = 0;
  function restore(snapshot, active2) {
    if (snapshot.style === null)
      $player.removeAttribute("style");
    else
      $player.setAttribute("style", snapshot.style);
    if (!active2())
      return false;
    $player.classList.remove("art-fullscreen-web");
    if (!active2())
      return false;
    restorePlacement(snapshot.placement);
    return active2();
  }
  getScope(art).add(() => {
    revision += 1;
    const snapshot = saved;
    saved = void 0;
    if (snapshot) {
      try {
        restore(snapshot, () => true);
      } catch (error2) {
        try {
          if ($player.parentNode !== snapshot.placement.parent)
            $player.parentNode?.removeChild($player);
        } catch (detachError) {
          throw new ResourceCleanupError([error2, detachError]);
        }
        throw error2;
      }
    }
  });
  return (value) => {
    if (isClosing(art))
      return;
    const current2 = ++revision;
    const active2 = () => current2 === revision && !isClosing(art);
    const restoreFocus = captureMovedFocus($player);
    if (value) {
      if (!saved)
        saved = { placement: capturePlacement($player), style: $player.getAttribute("style") };
      const snapshot = saved;
      try {
        if (art.constructor.FULLSCREEN_WEB_IN_BODY && $player.parentNode !== document.body)
          document.body.appendChild($player);
        if (!active2())
          return;
        art.state = "fullscreenWeb";
        if (!active2())
          return;
        $player.style.width = "100%";
        $player.style.height = "100%";
        $player.classList.add("art-fullscreen-web");
      } catch (error2) {
        if (active2() && restore(snapshot, active2)) {
          saved = void 0;
          restoreFocus();
        }
        throw error2;
      }
      if (!active2())
        return;
      restoreFocus();
      if (!active2())
        return;
      art.emit("fullscreenWeb", true);
    } else {
      if (saved) {
        if (!restore(saved, active2))
          return;
        saved = void 0;
      } else {
        $player.classList.remove("art-fullscreen-web");
      }
      if (!active2())
        return;
      restoreFocus();
      if (!active2())
        return;
      art.emit("fullscreenWeb", false);
    }
    if (active2())
      art.emit("resize");
  };
}
function fullscreenWebMix(art) {
  const setFullscreen = webFullscreen(art);
  def(art, "fullscreenWeb", {
    get() {
      return art.template.$player.classList.contains("art-fullscreen-web");
    },
    set: setFullscreen
  });
}
function loadedMix(art) {
  const { $video } = art.template;
  const target = art;
  def(art, "loaded", { get: () => target.loadedTime / $video.duration });
  def(art, "loadedTime", {
    get: () => $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0
  });
}
function miniFocus(art) {
  const player = art.template.$player;
  let origin;
  return {
    entering() {
      const doc = player.ownerDocument;
      const focused = doc.activeElement;
      const inside = focused && player.contains(focused);
      if (!art.template.$mini?.contains(focused))
        origin = inside ? resolveFocusOrigin(focused) : void 0;
      const keyboard = inside && player.classList.contains("art-keyboard-focus");
      return (focus) => {
        if (keyboard && !isClosing(art) && (doc.activeElement === focused || doc.activeElement === doc.body))
          focus?.();
      };
    },
    leaving(popup) {
      const doc = player.ownerDocument;
      const inside = popup?.contains(doc.activeElement);
      return () => {
        if (!inside || isClosing(art) || doc.activeElement !== doc.body && !popup?.contains(doc.activeElement))
          return;
        const visible = origin && doc.defaultView?.getComputedStyle(origin).visibility;
        if (origin?.isConnected && origin.getClientRects().length && visible !== "hidden" && visible !== "collapse" && origin.getAttribute("aria-disabled") !== "true" && !origin.matches(":disabled") && !origin.closest("[inert]"))
          origin.focus({ preventScroll: true });
        else
          focusPlayer(art);
      };
    }
  };
}
function clampMini(left, top, geometry) {
  const maxLeft = Math.max(0, geometry.viewportWidth - geometry.width);
  const maxTop = Math.max(0, geometry.viewportHeight - geometry.height);
  return { left: Math.max(0, Math.min(left, maxLeft)), top: Math.max(0, Math.min(top, maxTop)) };
}
function miniPosition(left, top, geometry) {
  if (typeof left === "number" && Number.isFinite(left) && typeof top === "number" && Number.isFinite(top) && left >= 0 && top >= 0 && left + geometry.width <= geometry.viewportWidth && top + geometry.height <= geometry.viewportHeight) {
    return { left, top, reset: false };
  }
  return { ...clampMini(geometry.viewportWidth - geometry.width - 50, geometry.viewportHeight - geometry.height - 50, geometry), reset: true };
}
function miniGeometry(element) {
  const { width, height } = element.getBoundingClientRect();
  const view = element.ownerDocument.defaultView;
  return { width, height, viewportWidth: view.innerWidth, viewportHeight: view.innerHeight };
}
function miniDrag(art, element, scope, active2) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  const cancel = () => {
    dragging = false;
    element.classList.remove("art-mini-dragging");
    element.style.transform = "";
  };
  listen(scope, element, "mousedown", (event) => {
    const mouse = event;
    if (mouse.button !== 0 || !active2())
      return;
    dragging = true;
    startX = mouse.clientX;
    startY = mouse.clientY;
  });
  const move = (event) => {
    if (!scope.closed && dragging && active2()) {
      element.classList.add("art-mini-dragging");
      element.style.transform = `translate(${event.clientX - startX}px, ${event.clientY - startY}px)`;
    }
  };
  const end = () => {
    if (scope.closed || !dragging || !active2())
      return;
    const rect = element.getBoundingClientRect();
    const position = clampMini(rect.left, rect.top, miniGeometry(element));
    cancel();
    element.style.left = `${position.left}px`;
    element.style.top = `${position.top}px`;
    art.storage.set("left", position.left);
    if (!scope.closed)
      art.storage.set("top", position.top);
  };
  art.on("document:mousemove", move);
  scope.add(() => {
    art.off("document:mousemove", move);
  });
  art.on("document:mouseup", end);
  scope.add(() => {
    art.off("document:mouseup", end);
  });
  scope.add(cancel);
  return cancel;
}
function createMiniView(art, parent, active2, hide) {
  const scope = parent.child();
  if (scope.closed)
    return;
  const existing = art.template.$mini;
  if (existing) {
    const display = existing.style.display;
    scope.add(() => {
      existing.style.display = display;
    });
    return { element: existing, cancelDrag: () => {
    }, fresh: false };
  }
  const document2 = art.template.$player.ownerDocument;
  const element = document2.createElement("div");
  element.className = "art-mini-popup";
  scope.add(() => {
    element.remove();
  });
  try {
    const close2 = document2.createElement("div");
    close2.className = "art-mini-close";
    close2.append(art.icons.close);
    if (scope.closed)
      return;
    const state2 = document2.createElement("div");
    state2.className = "art-mini-state";
    const play2 = art.icons.play;
    const pause2 = art.icons.pause;
    if (scope.closed)
      return;
    state2.append(play2, pause2);
    element.append(close2, state2);
    keyboardButton(scope, close2, () => close2.click(), active2);
    keyboardButton(scope, state2, () => (art.playing ? pause2 : play2).click(), active2);
    const closeLabel = art.i18n.get("Close");
    if (scope.closed || isClosing(art))
      return;
    close2.setAttribute("aria-label", closeLabel);
    const groupLabel = art.i18n.get("Mini Player");
    if (scope.closed || isClosing(art))
      return;
    element.setAttribute("role", "group");
    element.setAttribute("aria-label", groupLabel);
    listen(scope, element, "keydown", (input) => {
      const event = input;
      if (active2() && plainKey(event) && !event.defaultPrevented && event.key === "Escape") {
        claimKey(event);
        hide();
      }
    });
    listen(scope, close2, "click", hide);
    listen(scope, play2, "click", () => {
      silencePromise(art.play());
    });
    listen(scope, pause2, "click", () => {
      art.pause();
    });
    const update = () => {
      if (scope.closed)
        return;
      const label = art.i18n.get(art.playing ? "Pause" : "Play");
      if (scope.closed || isClosing(art))
        return;
      state2.setAttribute("aria-label", label);
      play2.style.display = art.playing ? "none" : "flex";
      pause2.style.display = art.playing ? "flex" : "none";
    };
    update();
    for (const name of ["video:playing", "video:pause", "video:timeupdate"]) {
      art.on(name, update);
      scope.add(() => {
        art.off(name, update);
      });
    }
    const cancelDrag = miniDrag(art, element, scope, active2);
    if (scope.closed)
      return;
    art.template.$mini = element;
    document2.body.append(element);
    if (!scope.closed)
      return { element, cancelDrag, fresh: true, focus: () => close2.focus({ preventScroll: true }) };
  } catch (error2) {
    scope.dispose();
    if (art.template.$mini === element)
      delete art.template.$mini;
    throw error2;
  }
}
function mini(art) {
  const { $player, $video } = art.template;
  const scope = getScope(art).child();
  let view;
  let placement;
  let revision = 0;
  let creating = false;
  let queued = false;
  const active2 = () => !isClosing(art) && $player.classList.contains("art-mini");
  const focus = miniFocus(art);
  function restore() {
    if (placement) {
      const saved = placement;
      const current2 = revision;
      placement = void 0;
      try {
        restorePlacement(saved);
      } catch (error2) {
        if (current2 === revision && !placement)
          placement = saved;
        throw error2;
      }
    }
  }
  function hide() {
    if (isClosing(art))
      return;
    const current2 = ++revision;
    queued = false;
    const restoreFocus = focus.leaving(art.template.$mini);
    restore();
    if (isClosing(art) || current2 !== revision)
      return;
    view?.cancelDrag();
    $player.classList.remove("art-mini");
    if (art.template.$mini) {
      art.template.$mini.style.display = "none";
      restoreFocus();
      if (!isClosing(art) && current2 === revision)
        art.emit("mini", false);
    }
  }
  scope.add(() => {
    revision++;
    try {
      restore();
    } finally {
      view?.cancelDrag();
      $player.classList.remove("art-mini");
    }
  });
  function show() {
    if (isClosing(art))
      return;
    const current2 = ++revision;
    if (creating) {
      queued = true;
      return;
    }
    const enterFocus = focus.entering();
    art.state = "mini";
    if (isClosing(art) || current2 !== revision)
      return;
    placement ?? (placement = capturePlacement($video));
    $player.classList.add("art-mini");
    try {
      if (!view) {
        creating = true;
        try {
          view = createMiniView(art, scope, active2, hide);
        } finally {
          creating = false;
        }
      }
      if (queued) {
        queued = false;
        show();
        return;
      }
      if (!view || isClosing(art))
        return;
      if (current2 !== revision) {
        if (!active2())
          view.element.style.display = "none";
        return;
      }
      if (view.fresh)
        view.element.prepend($video);
      else
        view.element.append($video);
      if (isClosing(art) || current2 !== revision)
        return;
      view.element.style.display = view.fresh ? "" : "flex";
      view.fresh = false;
      const top = art.storage.get("top");
      const left = art.storage.get("left");
      const position = miniPosition(left, top, miniGeometry(view.element));
      if (isClosing(art) || current2 !== revision)
        return;
      view.element.style.left = `${position.left}px`;
      view.element.style.top = `${position.top}px`;
      if (position.reset) {
        art.storage.set("top", position.top);
        if (isClosing(art) || current2 !== revision)
          return;
        art.storage.set("left", position.left);
      }
      if (!isClosing(art) && current2 === revision)
        enterFocus(view.focus);
      if (!isClosing(art) && current2 === revision)
        art.emit("mini", true);
    } catch (error2) {
      const pendingReentry = queued;
      queued = false;
      if (!isClosing(art) && (current2 === revision || pendingReentry)) {
        restore();
        $player.classList.remove("art-mini");
        if (view)
          view.element.style.display = "none";
      }
      throw error2;
    }
  }
  return {
    get: active2,
    set(value) {
      if (value)
        show();
      else
        hide();
    }
  };
}
function miniMix(art) {
  def(art, "mini", mini(art));
}
function optionInit(art) {
  if (isClosing(art))
    return;
  const {
    option,
    storage,
    template: { $video, $poster }
  } = art;
  for (const key in option.moreVideoAttr) {
    if (isClosing(art))
      return;
    const value = option.moreVideoAttr[key];
    if (isClosing(art))
      return;
    art.attr(key, value);
  }
  if (isClosing(art))
    return;
  if (option.muted) {
    const value = option.muted;
    if (isClosing(art))
      return;
    art.muted = value;
  }
  if (isClosing(art))
    return;
  if (option.volume) {
    const value = clamp(option.volume, 0, 1);
    if (isClosing(art))
      return;
    $video.volume = value;
  }
  if (isClosing(art))
    return;
  const volumeStorage = storage.get("volume");
  if (isClosing(art))
    return;
  if (typeof volumeStorage === "number") {
    $video.volume = clamp(volumeStorage, 0, 1);
  }
  if (isClosing(art))
    return;
  if (option.poster) {
    const value = `url(${option.poster})`;
    if (isClosing(art))
      return;
    setStyle($poster, "backgroundImage", value);
  }
  if (isClosing(art))
    return;
  if (option.autoplay) {
    const value = option.autoplay;
    if (isClosing(art))
      return;
    $video.autoplay = value;
  }
  if (isClosing(art))
    return;
  if (option.playsInline) {
    if (isClosing(art))
      return;
    $video.playsInline = true;
    if (isClosing(art))
      return;
    $video["webkit-playsinline"] = true;
  }
  if (isClosing(art))
    return;
  if (option.theme) {
    const styles = option.cssVar;
    const theme = option.theme;
    if (isClosing(art))
      return;
    styles["--art-theme"] = theme;
  }
  for (const key in option.cssVar) {
    if (isClosing(art))
      return;
    const value = option.cssVar[key];
    if (isClosing(art))
      return;
    art.cssVar(key, value);
  }
  if (isClosing(art))
    return;
  const url = option.url;
  if (!isClosing(art))
    art.url = url;
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
  const { $video } = art.template;
  const document2 = $video.ownerDocument;
  const scope = getScope(art).child();
  const owns2 = () => document2.pictureInPictureElement === $video;
  let last = owns2();
  let desired = last;
  let pending2 = false;
  let cancelled = false;
  let revision = 0;
  $video.disablePictureInPicture = false;
  function exitOwned() {
    if (!owns2())
      return;
    try {
      void document2.exitPictureInPicture().catch(() => {
      });
    } catch {
    }
  }
  function observe(result, entering, current2) {
    void result.then(() => {
      if (entering && (isClosing(art) || !desired))
        exitOwned();
    }, (error2) => {
      if (!isClosing(art) && revision === current2)
        art.notice.show = error2;
    }).finally(() => {
      if (revision === current2)
        pending2 = false;
    }).catch(() => {
    });
  }
  scope.add(() => {
    revision++;
    desired = false;
    exitOwned();
  });
  listen(scope, $video, "enterpictureinpicture", () => {
    if (cancelled) {
      exitOwned();
      return;
    }
    if (!owns2() || last)
      return;
    const current2 = revision;
    art.state = "pip";
    if (!isClosing(art) && current2 === revision && owns2()) {
      last = true;
      art.emit("pip", true);
    }
  });
  listen(scope, $video, "leavepictureinpicture", () => {
    if (!last || owns2())
      return;
    last = false;
    art.emit("pip", false);
  });
  return {
    // Native callers historically receive the media element, not a boolean.
    get: () => !isClosing(art) && owns2() ? $video : null,
    set(value) {
      if (isClosing(art))
        return;
      const current2 = ++revision;
      desired = Boolean(value);
      if (desired)
        cancelled = false;
      else if (pending2)
        cancelled = true;
      pending2 = false;
      if (desired) {
        art.state = "pip";
        if (isClosing(art) || revision !== current2)
          return;
        pending2 = true;
        try {
          observe($video.requestPictureInPicture(), true, current2);
        } catch (error2) {
          if (revision === current2)
            pending2 = false;
          throw error2;
        }
      } else if (owns2()) {
        observe(document2.exitPictureInPicture(), false, current2);
      }
    }
  };
}
const abandoned = /* @__PURE__ */ new WeakSet();
const active = (video) => video.webkitPresentationMode === "picture-in-picture";
function clearAbandoned(video) {
  abandoned.delete(video);
  video.removeEventListener("webkitpresentationmodechanged", releaseAbandoned);
  video.removeEventListener("enterpictureinpicture", releaseAbandoned);
}
function releaseAbandoned() {
  if (!abandoned.has(this) || !active(this))
    return;
  clearAbandoned(this);
  try {
    this.webkitSetPresentationMode?.("inline");
  } catch {
  }
}
function abandon(video) {
  abandoned.add(video);
  video.addEventListener("webkitpresentationmodechanged", releaseAbandoned);
  video.addEventListener("enterpictureinpicture", releaseAbandoned);
}
function webkitPip(art) {
  const { $video } = art.template;
  const scope = getScope(art).child();
  let last = false;
  let pending2 = false;
  let revision = 0;
  let emissions = 0;
  $video.webkitSetPresentationMode("inline");
  function changed(force = false) {
    if (isClosing(art) || abandoned.has($video))
      return;
    const value = active($video);
    if (value)
      pending2 = false;
    if (value === last && !force)
      return;
    const current2 = revision;
    if (value)
      art.state = "pip";
    if (isClosing(art) || revision !== current2 || active($video) !== value)
      return;
    last = value;
    emissions++;
    art.emit("pip", value);
  }
  scope.add(() => {
    revision++;
    if (pending2)
      abandon($video);
    if (active($video))
      $video.webkitSetPresentationMode("inline");
  });
  for (const name of ["webkitpresentationmodechanged", "enterpictureinpicture", "leavepictureinpicture"])
    listen(scope, $video, name, () => changed());
  return {
    get: () => !isClosing(art) && active($video),
    set(value) {
      if (isClosing(art))
        return;
      const current2 = ++revision;
      const before = emissions;
      if (value) {
        if ($video.webkitSupportsPresentationMode?.("picture-in-picture") === false) {
          art.notice.show = art.i18n.get("PIP Not Supported");
          return;
        }
        clearAbandoned($video);
        art.state = "pip";
        if (isClosing(art) || revision !== current2)
          return;
        pending2 = true;
        try {
          $video.webkitSetPresentationMode("picture-in-picture");
        } catch (error2) {
          if (current2 === revision)
            pending2 = false;
          throw error2;
        }
      } else {
        if (pending2) {
          pending2 = false;
          abandon($video);
        }
        if (active($video))
          $video.webkitSetPresentationMode("inline");
      }
      if (!isClosing(art) && current2 === revision && before === emissions && active($video) === Boolean(value))
        changed(true);
    }
  };
}
function pipMix(art) {
  const { i18n, notice, template: { $video } } = art;
  const document2 = $video.ownerDocument;
  if (document2.pictureInPictureEnabled && typeof $video.requestPictureInPicture === "function" && typeof document2.exitPictureInPicture === "function") {
    def(art, "pip", nativePip(art));
  } else if (typeof $video.webkitSupportsPresentationMode === "function" && typeof $video.webkitSetPresentationMode === "function") {
    def(art, "pip", webkitPip(art));
  } else {
    def(art, "pip", {
      get: () => false,
      set() {
        if (!isClosing(art))
          notice.show = i18n.get("PIP Not Supported");
      }
    });
  }
}
function playbackRateMix(art) {
  const { template: { $video }, i18n, notice } = art;
  const target = art;
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
        target.playbackRate = 1;
      }
    }
  });
}
function playedMix(art) {
  def(art, "played", { get: () => art.currentTime / art.duration });
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
      const active2 = captureSource(art);
      const result = await $video.play();
      if (!active2())
        return result;
      const message = i18n.get("Play");
      if (!active2())
        return result;
      notice.show = message;
      if (!active2())
        return result;
      art.emit("play");
      if (option.mutex) {
        for (let index = 0; index < instances2.length; index++) {
          if (!active2())
            break;
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
        style: { marginRight: "10px" },
        html: qualityDefault?.html || "",
        selector: quality,
        async onSelect(item, _element, event) {
          const active2 = captureSelection(event);
          await art.switchQuality(item.url);
          if (!isClosing(art) && active2()) {
            const message = `${i18n.get("Switch Video")}: ${item.html}`;
            if (!isClosing(art) && active2())
              notice.show = message;
          }
          return item.html;
        }
      });
    }
  });
}
function rectMix(art) {
  const host = art;
  def(art, "rect", {
    get: () => {
      return getRect(art.template.$player);
    }
  });
  const keys2 = ["bottom", "height", "left", "right", "top", "width"];
  for (let index = 0; index < keys2.length; index++) {
    const key = keys2[index];
    def(art, key, {
      get: () => {
        return host.rect[key];
      }
    });
  }
  def(art, "x", {
    get: () => {
      return host.left + window.pageXOffset;
    }
  });
  def(art, "y", {
    get: () => {
      return host.top + window.pageYOffset;
    }
  });
}
function drawFrame(canvas, video) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  if (!context)
    throw new TypeError("Canvas 2D context is unavailable");
  context.drawImage(video, 0, 0);
}
function captureBlobUrl(canvas, resolve, reject) {
  canvas.toBlob((blob) => {
    try {
      if (!blob)
        throw new Error("Unable to encode screenshot blob");
      resolve(URL.createObjectURL(blob));
    } catch (error2) {
      reject(error2);
    }
  });
}
function screenshotMix(art) {
  const { notice, template: { $video } } = art;
  const canvas = document.createElement("canvas");
  function capture(blob) {
    const active2 = captureSource(art);
    return new Promise((resolve, reject) => {
      const fail = (error2) => {
        try {
          if (!isClosing(art) && active2())
            notice.show = error2;
        } catch (noticeError) {
          reject(noticeError);
          return;
        }
        reject(error2);
      };
      try {
        drawFrame(canvas, $video);
        if (blob) {
          captureBlobUrl(canvas, resolve, fail);
        } else {
          resolve(canvas.toDataURL("image/png"));
        }
      } catch (error2) {
        fail(error2);
      }
    });
  }
  def(art, "getDataURL", { value: () => capture(false) });
  def(art, "getBlobUrl", { value: () => capture(true) });
  def(art, "screenshot", {
    value: async (name) => {
      const active2 = captureSource(art);
      const dataUri = await art.getDataURL();
      if (!isClosing(art) && active2()) {
        const fileName = name || `artplayer_${secondToTime($video.currentTime)}`;
        if (!isClosing(art) && active2())
          download(dataUri, `${fileName}.png`);
        if (!isClosing(art) && active2())
          art.emit("screenshot", dataUri);
      }
      return dataUri;
    }
  });
}
function seekMix(art) {
  const { notice } = art;
  def(art, "seek", {
    set(time2) {
      art.currentTime = time2;
      if (art.duration)
        notice.show = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`;
      art.emit("seek", art.currentTime, time2);
    }
  });
  const target = art;
  def(art, "forward", {
    set(time2) {
      target.seek = art.currentTime + time2;
    }
  });
  def(art, "backward", {
    set(time2) {
      target.seek = art.currentTime - time2;
    }
  });
}
function stateMix(art) {
  const states2 = ["mini", "pip", "fullscreen", "fullscreenWeb"];
  def(art, "state", {
    get: () => states2.find((name) => art[name]) || "standard",
    set(name) {
      for (let index = 0; index < states2.length; index++) {
        const prop = states2[index];
        if (prop !== name && art[prop])
          art[prop] = false;
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
function listenSource(scope, art, name, callback, once = true) {
  let fired = false;
  let release;
  const guarded = (event) => {
    if (scope.closed || fired)
      return;
    if (once) {
      fired = true;
      release();
    }
    callback(event);
  };
  art[once ? "once" : "on"](name, guarded);
  release = scope.add(() => {
    art.off(name, guarded);
  });
  return guarded;
}
function switchSource(art, url, currentTime) {
  return new Promise((resolve, reject) => {
    if (isClosing(art) || url === art.url) {
      resolve();
      return;
    }
    const operation = beginSource(art);
    const scope = operation.scope.child();
    let settled = false;
    const settle = (failed = false, error2) => {
      if (settled)
        return;
      settled = true;
      operation.onError = void 0;
      operation.onAssigned = void 0;
      scope.dispose();
      if (failed)
        reject(error2);
      else
        resolve();
      if (failed)
        operation.scope.dispose();
    };
    scope.add(() => {
      settle();
    });
    const active2 = () => !settled && operation.active();
    const fail = (error2) => settle(true, error2);
    operation.onError = fail;
    try {
      const { playing, aspectRatio: aspectRatio2, playbackRate: playbackRate2 } = art;
      art.pause();
      if (!active2())
        return;
      const readiness = scope.child();
      let canPlay = false;
      let resuming = false;
      let rateRestored = false;
      const position = positionRestoration(art, currentTime, active2);
      const resume = async () => {
        art.aspectRatio = aspectRatio2;
        if (!active2())
          return;
        if (playing) {
          try {
            await art.play();
          } catch {
          }
        }
        if (!active2())
          return;
        art.notice.show = "";
        settle();
      };
      const resumeWhenReady = () => {
        if (!active2() || resuming || !canPlay)
          return;
        try {
          if (art.template?.$video?.seeking)
            return;
          if (!active2())
            return;
          if (!rateRestored) {
            rateRestored = true;
            art.playbackRate = playbackRate2;
          }
          if (!position.ready() || !active2() || resuming)
            return;
          resuming = true;
          readiness.dispose();
          void resume().catch(fail);
        } catch (error2) {
          fail(error2);
        }
      };
      const handlers = {
        "video:error": fail,
        "video:loadedmetadata": () => {
          if (!active2())
            return;
          try {
            position.restore();
          } catch (error2) {
            fail(error2);
          }
        },
        "video:canplay": () => {
          canPlay = true;
          resumeWhenReady();
        },
        "video:seeked": resumeWhenReady,
        "seek": position.manual
      };
      const capture = scope.child();
      const queued = [];
      const names = Object.keys(handlers);
      for (const name of names) {
        listenSource(capture, art, name, (event) => {
          if (operation.acceptingEvents)
            queued.push([name, event]);
        }, false);
      }
      assignUrl(art, operation, url);
      if (!active2())
        return;
      art.notice.show = "";
      if (!active2())
        return;
      const activate = () => {
        capture.dispose();
        if (!url) {
          settle();
          return;
        }
        const dispatch = {};
        for (const name of names)
          dispatch[name] = listenSource(readiness, art, name, handlers[name], name !== "video:seeked");
        for (const [name, event] of queued) {
          if (!active2() || readiness.closed)
            break;
          dispatch[name](event);
        }
        queued.length = 0;
      };
      if (operation.assigned)
        activate();
      else
        operation.onAssigned = activate;
    } catch (error2) {
      fail(error2);
    }
  });
}
function switchMix(art) {
  const switchUrl = (url) => switchSource(art, url, 0);
  def(art, "switchQuality", { value: (url) => switchSource(art, url, art.currentTime) });
  def(art, "switchUrl", { value: switchUrl });
  def(art, "switch", { set: switchUrl });
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
function thumbnailLayout(option, geometry) {
  const { number, column, width, height, scale } = option;
  const { imageWidth, videoWidth, videoHeight, progressWidth, position } = geometry;
  const columns = Number(column);
  const previewWidth = Number(width) * Number(scale) || imageWidth / columns;
  const previewHeight = Number(height) * Number(scale) || previewWidth / (videoWidth / videoHeight);
  const index = Math.floor(position / (progressWidth / Number(number)));
  const row = Math.floor(index / columns);
  const cell = index % columns;
  const left = position <= previewWidth / 2 ? 0 : position > progressWidth - previewWidth / 2 ? `${progressWidth - previewWidth}px` : `${position - previewWidth / 2}px`;
  return {
    height: `${previewHeight}px`,
    width: `${previewWidth}px`,
    backgroundPosition: `-${cell * previewWidth}px -${row * previewHeight}px`,
    left
  };
}
function thumbnailsMix(art) {
  const { option, template: { $progress, $video } } = art;
  let scope = getScope(art).child();
  let image;
  let loading2 = false;
  let control;
  let hover;
  function reset() {
    const previous = scope;
    scope = getScope(art).child();
    image = void 0;
    loading2 = false;
    hover = void 0;
    previous.dispose();
  }
  function render() {
    const current2 = hover;
    const currentScope = scope;
    if (!current2 || !image)
      return;
    const active2 = () => !isClosing(art) && !currentScope.closed && scope === currentScope && hover === current2 && current2.sourceActive() && art.controls?.thumbnails === current2.element;
    if (!active2())
      return;
    const position = $progress.clientWidth * current2.percentage;
    if (!(position > 0 && position < $progress.clientWidth))
      return;
    const styles = {
      backgroundImage: `url(${image.src})`,
      ...thumbnailLayout(option.thumbnails, {
        imageWidth: image.naturalWidth,
        videoWidth: $video.videoWidth,
        videoHeight: $video.videoHeight,
        progressWidth: $progress.clientWidth,
        position
      })
    };
    for (const [key, value] of Object.entries(styles)) {
      if (!active2())
        return;
      setStyle(current2.element, key, value);
    }
  }
  eventSubscriptions(art)("setBar", (type, percentage, event) => {
    const element = art.controls?.thumbnails;
    const { url, scale } = option.thumbnails;
    if (isClosing(art) || !element || !url || !(type === "hover" || type === "played" && event && isMobile))
      return;
    if (control !== element) {
      const elementScope = entryScope(element);
      if (elementScope.closed)
        return;
      control = element;
      elementScope.add(() => {
        if (control === element) {
          control = void 0;
          reset();
        }
      });
    }
    hover = { percentage, element, sourceActive: captureSource(art) };
    if (image) {
      render();
    } else if (!loading2) {
      const currentScope = scope;
      loading2 = true;
      loadThumbnailImage(url, scale, currentScope).then((loaded) => {
        if (scope !== currentScope || currentScope.closed)
          return;
        loading2 = false;
        image = loaded;
        render();
      }).catch((error2) => {
        if (scope === currentScope && !currentScope.closed) {
          loading2 = false;
          console.warn("ArtPlayer thumbnail load failed:", error2);
        }
      });
    }
  });
  def(art, "thumbnails", {
    get: () => art.option.thumbnails,
    set: (thumbnails) => {
      if (!isClosing(art) && thumbnails.url && !art.option.isLive && !isClosing(art)) {
        art.option.thumbnails = thumbnails;
        reset();
      }
    }
  });
}
function toggleMix(art) {
  def(art, "toggle", {
    value() {
      if (art.playing)
        return art.pause();
      else
        return art.play();
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
  const { option, template: { $video } } = art;
  def(art, "url", {
    get() {
      return $video.src;
    },
    async set(newUrl) {
      if (isClosing(art))
        return;
      const operation = takeAssignment(art);
      operation.acceptingEvents = false;
      try {
        if (!newUrl) {
          if (await wait(operation.scope) && operation.active())
            art.loading.show = true;
          return;
        }
        const oldUrl = art.url;
        const typeName = option.type || getExt(newUrl);
        const typeCallback = option.customType[typeName];
        if (typeName && typeCallback) {
          if (!await wait(operation.scope) || !operation.active())
            return;
          art.loading.show = true;
        }
        if (!operation.active())
          return;
        const capture = operation.scope.child();
        let ready = false;
        let failed = false;
        listenSource(capture, art, "video:canplay", () => {
          ready = !failed;
        });
        listenSource(capture, art, "video:error", () => {
          failed = true;
        });
        try {
          operation.acceptingEvents = true;
          if (typeName && typeCallback) {
            const result = typeCallback.call(art, $video, newUrl, art);
            void Promise.resolve(result).catch((error2) => failSource(operation, error2));
          } else {
            if (!operation.active())
              return;
            $video.src = newUrl;
          }
        } finally {
          capture.dispose();
        }
        if (!operation.active())
          return;
        if (oldUrl !== art.url) {
          art.option.url = newUrl;
          if (operation.active() && art.isReady && oldUrl) {
            const restart = () => {
              if (operation.active())
                art.emit("restart", newUrl);
            };
            if (ready)
              restart();
            else if (!failed)
              listenSource(operation.scope, art, "video:canplay", restart);
          }
        }
      } catch (error2) {
        failSource(operation, error2);
      } finally {
        finishAssignment(operation);
      }
    }
  });
}
function volumeMix(art) {
  const { template: { $video }, i18n, notice, storage } = art;
  def(art, "volume", {
    get: () => $video.volume || 0,
    set: (percentage) => {
      $video.volume = clamp(percentage, 0, 1);
      notice.show = `${i18n.get("Volume")}: ${Number.parseInt(String($video.volume * 100), 10)}`;
      if ($video.volume !== 0)
        storage.set("volume", $video.volume);
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
const installers = [
  attrMix,
  playMix,
  pauseMix,
  toggleMix,
  seekMix,
  volumeMix,
  currentTimeMix,
  durationMix,
  switchMix,
  playbackRateMix,
  aspectRatioMix,
  screenshotMix,
  fullscreenMix,
  fullscreenWebMix,
  pipMix,
  loadedMix,
  playedMix,
  playingMix,
  autoSizeMix,
  rectMix,
  flipMix,
  miniMix,
  posterMix,
  autoHeightMix,
  cssVarMix,
  themeMix,
  typeMix,
  stateMix,
  subtitleOffsetMix,
  airplayMix,
  qualityMix,
  thumbnailsMix,
  eventInit,
  optionInit
];
class Player {
  constructor(art) {
    if (isClosing(art))
      return;
    urlMix(art);
    for (const install of installers) {
      if (isClosing(art))
        return;
      install(art);
    }
  }
}
const owners$2 = /* @__PURE__ */ new WeakMap();
const className$1 = "art-auto-orientation-fullscreen";
function unlock(request) {
  if (owners$2.get(request.orientation) !== request)
    return;
  try {
    request.orientation.unlock();
  } catch {
  }
}
function nativeOrientation(art, needRotate) {
  const { $player } = art.template;
  let current2;
  function cancel() {
    const request = current2;
    current2 = void 0;
    $player.classList.remove(className$1);
    if (request) {
      request.cancelled = true;
      unlock(request);
      if (request.settled && owners$2.get(request.orientation) === request)
        owners$2.delete(request.orientation);
    }
  }
  getScope(art).add(cancel);
  return (state2) => {
    if (isClosing(art))
      return;
    if (!state2) {
      cancel();
      return;
    }
    if (current2 && !current2.cancelled && owners$2.get(current2.orientation) === current2)
      return;
    const orientation = $player.ownerDocument.defaultView?.screen?.orientation;
    if (typeof orientation?.lock !== "function" || typeof orientation.unlock !== "function" || !needRotate())
      return;
    const request = { orientation, cancelled: false, settled: false };
    current2 = request;
    owners$2.set(orientation, request);
    const active2 = () => !isClosing(art) && !request.cancelled && current2 === request && owners$2.get(orientation) === request;
    const failed = (error2) => {
      request.settled = true;
      const show = active2();
      if (owners$2.get(orientation) === request)
        owners$2.delete(orientation);
      if (current2 === request)
        current2 = void 0;
      if (show) {
        $player.classList.remove(className$1);
        art.notice.show = error2;
      }
    };
    try {
      const result = orientation.lock(orientation.type.startsWith("portrait") ? "landscape" : "portrait");
      Promise.resolve(result).then(() => {
        request.settled = true;
        if (active2()) {
          $player.classList.add(className$1);
        } else {
          unlock(request);
          if (owners$2.get(orientation) === request)
            owners$2.delete(orientation);
        }
      }).catch(failed);
    } catch (error2) {
      failed(error2);
    }
  };
}
const className = "art-auto-orientation";
const properties = ["width", "height", "transform-origin", "transform"];
function webOrientation(art, needRotate) {
  const { $player } = art.template;
  const scope = getScope(art);
  let cancel = () => {
  };
  let saved;
  function clear() {
    cancel();
    cancel = () => {
    };
    const previous = saved;
    saved = void 0;
    if (previous && art.fullscreenWeb) {
      for (const { name, value, priority } of previous)
        $player.style.setProperty(name, value, priority);
    }
    const wasRotated = $player.classList.contains(className);
    $player.classList.remove(className);
    if (wasRotated) {
      art.isRotate = false;
      if (!isClosing(art))
        art.emit("resize");
    }
  }
  scope.add(clear);
  function apply(emit) {
    if (!art.fullscreenWeb || !needRotate())
      return;
    const insets = getSafeAreaInsets();
    if (isClosing(art) || !art.fullscreenWeb)
      return;
    const viewport = $player.ownerDocument.documentElement;
    saved ?? (saved = properties.map((name) => ({ name, value: $player.style.getPropertyValue(name), priority: $player.style.getPropertyPriority(name) })));
    $player.style.width = `${viewport.clientHeight - insets.top - insets.bottom}px`;
    $player.style.height = `${viewport.clientWidth - insets.left - insets.right}px`;
    $player.style.transformOrigin = "0 0";
    $player.style.transform = `rotate(90deg) translate(${insets.top}px, -${viewport.clientWidth - insets.right}px)`;
    $player.classList.add(className);
    art.isRotate = true;
    if (emit)
      art.emit("resize");
  }
  return (state2) => {
    if (isClosing(art))
      return;
    if (!state2) {
      clear();
      return;
    }
    if (saved) {
      apply(false);
      return;
    }
    if (!needRotate())
      return;
    cancel();
    cancel = timeout(scope, () => {
      if (!saved)
        apply(true);
    }, Number(art.constructor.AUTO_ORIENTATION_TIME ?? 0));
  };
}
function autoOrientation(art) {
  const { $player, $video } = art.template;
  const needRotate = () => {
    const media = { width: $video.videoWidth, height: $video.videoHeight };
    const viewport = $player.ownerDocument.documentElement;
    const view = { width: viewport.clientWidth, height: viewport.clientHeight };
    return positiveSize(media) && positiveSize(view) && (media.width > media.height && view.width < view.height || media.width < media.height && view.width > view.height);
  };
  const web = webOrientation(art, needRotate);
  const native = nativeOrientation(art, needRotate);
  art.on("fullscreenWeb", web);
  art.on("fullscreen", native);
  getScope(art).add(() => {
    art.off("fullscreenWeb", web);
    art.off("fullscreen", native);
  });
  return {
    name: "autoOrientation",
    get state() {
      return $player.classList.contains("art-auto-orientation");
    }
  };
}
function readTimes(storage) {
  return storage.get("times") || {};
}
function installPlaybackRecords(art) {
  const { storage, constructor } = art;
  eventSubscriptions(art)("video:timeupdate", () => {
    if (!art.playing)
      return;
    const times = readTimes(storage);
    const keys2 = Object.keys(times);
    const max = constructor.AUTO_PLAYBACK_MAX;
    const key = art.option.id || art.option.url;
    const time2 = art.currentTime;
    if (isClosing(art))
      return;
    if (keys2.length > max)
      delete times[keys2[0]];
    times[key] = time2;
    if (!isClosing(art))
      storage.set("times", times);
  });
}
function installResumePrompt(art) {
  const { i18n, icons, storage, constructor, template: { $poster } } = art;
  const element = art.layers.add({
    name: "auto-playback",
    html: `
            <div class="art-auto-playback-close"></div>
            <div class="art-auto-playback-last"></div>
            <div class="art-auto-playback-jump"></div>
        `
  });
  if (!element || isClosing(art))
    return () => {
    };
  const $last = queryElement(".art-auto-playback-last", element);
  const $jump = queryElement(".art-auto-playback-jump", element);
  const $close = queryElement(".art-auto-playback-close", element);
  appendElement($close, icons.close);
  const owner = entryScope(element);
  let current2;
  let revision = 0;
  const init = () => {
    const generation = ++revision;
    current2?.dispose();
    if (owner.closed || isClosing(art) || revision !== generation)
      return;
    const scope = owner.child();
    current2 = scope;
    const active2 = () => current2 === scope && !scope.closed && !isClosing(art);
    scope.add(() => {
      if (current2 === scope) {
        current2 = void 0;
        setStyle(element, "display", "none");
      }
    });
    const releaseSource = getSourceScope(art).add(() => {
      scope.dispose();
    });
    scope.add(() => {
      releaseSource();
    });
    const times = readTimes(storage);
    const currentTime = times[art.option.id || art.option.url];
    if (!active2())
      return;
    setStyle(element, "display", "none");
    if (!active2() || !currentTime || !(currentTime >= constructor.AUTO_PLAYBACK_MIN))
      return;
    if (!active2())
      return;
    setStyle(element, "display", "flex");
    if (!active2())
      return;
    const lastText = `${i18n.get("Last Seen")} ${secondToTime(currentTime)}`;
    if (!active2())
      return;
    $last.textContent = lastText;
    if (!active2())
      return;
    const jumpText = i18n.get("Jump Play");
    if (!active2())
      return;
    $jump.textContent = jumpText;
    if (!active2())
      return;
    const bind2 = (target, callback) => {
      const cleanup = art.events.proxy(target, "click", () => {
        if (active2())
          callback();
      });
      scope.add(() => {
        art.events.remove(cleanup);
      });
    };
    bind2($close, () => {
      setStyle(element, "display", "none");
    });
    if (!active2())
      return;
    bind2($jump, () => {
      art.seek = currentTime;
      if (!active2())
        return;
      silencePromise(art.play());
      if (!active2())
        return;
      setStyle($poster, "display", "none");
      if (active2())
        setStyle(element, "display", "none");
    });
    if (!active2())
      return;
    let releaseUpdate = () => {
    };
    let fired = false;
    const update = () => {
      if (fired || !active2())
        return;
      fired = true;
      releaseUpdate();
      timeout(scope, () => {
        if (active2())
          setStyle(element, "display", "none");
      }, constructor.AUTO_PLAYBACK_TIMEOUT);
    };
    art.on("video:timeupdate", update);
    releaseUpdate = scope.add(() => {
      art.off("video:timeupdate", update);
    });
    if (fired)
      releaseUpdate();
  };
  return () => {
    subscribeEntry(art, element, "ready", init);
    subscribeEntry(art, element, "restart", init);
  };
}
function autoPlayback(art) {
  const { storage } = art;
  const installPrompt = installResumePrompt(art);
  installPlaybackRecords(art);
  installPrompt();
  return {
    name: "auto-playback",
    get times() {
      return readTimes(storage);
    },
    clear() {
      return storage.del("times");
    },
    delete(id2) {
      const times = readTimes(storage);
      delete times[id2];
      storage.set("times", times);
      return times;
    }
  };
}
function longPress(art) {
  let current2;
  let generation = 0;
  const hasActivePress = () => current2?.active;
  const stop = () => {
    generation++;
    current2?.scope.dispose();
  };
  const start = (event) => {
    const revision = ++generation;
    current2?.scope.dispose();
    if (revision !== generation || isClosing(art) || event.touches.length !== 1 || !art.playing || art.isLock)
      return;
    const press = { scope: getSourceScope(art).child(), active: false, previousRate: 1 };
    current2 = press;
    press.scope.add(() => {
      if (current2 !== press)
        return;
      current2 = void 0;
      if (press.active) {
        try {
          art.playbackRate = press.previousRate;
        } finally {
          if (!hasActivePress())
            removeClass(art.template.$player, "art-fast-forward");
        }
      }
    });
    timeout(press.scope, () => {
      if (current2 !== press || isClosing(art) || !art.playing || art.isLock) {
        press.scope.dispose();
        return;
      }
      try {
        press.previousRate = art.playbackRate;
        if (current2 !== press || press.scope.closed)
          return;
        press.active = true;
        const rate = art.constructor.FAST_FORWARD_VALUE;
        if (current2 !== press || press.scope.closed || isClosing(art))
          return;
        art.playbackRate = rate;
        if (current2 === press && !press.scope.closed && !isClosing(art))
          addClass(art.template.$player, "art-fast-forward");
      } catch (error2) {
        try {
          press.scope.dispose();
        } catch (cleanupError) {
          console.warn("Failed to restore fast-forward playback rate:", cleanupError);
        }
        throw error2;
      }
    }, art.constructor.FAST_FORWARD_TIME);
  };
  return { start, stop };
}
function fastForward(art) {
  const { proxy, template: { $player, $video } } = art;
  const press = longPress(art);
  const subscribe = eventSubscriptions(art);
  proxy($video, "touchstart", (event) => press.start(event));
  proxy($video, "touchcancel", press.stop);
  subscribe("document:touchmove", press.stop);
  subscribe("document:touchend", press.stop);
  subscribe("document:touchcancel", press.stop);
  subscribe("video:pause", press.stop);
  subscribe("destroy", press.stop);
  subscribe("lock", (locked) => {
    if (locked)
      press.stop();
  });
  return {
    name: "fastForward",
    get state() {
      return hasClass($player, "art-fast-forward");
    }
  };
}
function suspendFocus(scope, root) {
  const original = /* @__PURE__ */ new Map();
  const inert = root.hasAttribute("inert");
  const hidden = root.getAttribute("aria-hidden");
  const restore = (element, value) => {
    if (element.getAttribute("tabindex") !== "-1")
      return;
    if (value === null)
      element.removeAttribute("tabindex");
    else
      element.setAttribute("tabindex", value);
  };
  scope.add(() => {
    for (const [element, value] of original)
      restore(element, value);
    original.clear();
    if (!inert && root.getAttribute("inert") === "")
      root.removeAttribute("inert");
    if (root.getAttribute("aria-hidden") === "true") {
      if (hidden === null)
        root.removeAttribute("aria-hidden");
      else
        root.setAttribute("aria-hidden", hidden);
    }
  });
  if (scope.closed)
    return;
  if (!inert)
    root.setAttribute("inert", "");
  root.setAttribute("aria-hidden", "true");
  const update = () => {
    if (scope.closed)
      return;
    for (const [element, value] of original) {
      if (!root.contains(element)) {
        restore(element, value);
        original.delete(element);
      }
    }
    for (const element of root.querySelectorAll("[tabindex],button,input,select,textarea,a[href],[contenteditable]")) {
      if (!original.has(element)) {
        original.set(element, element.getAttribute("tabindex"));
        element.setAttribute("tabindex", "-1");
      }
    }
  };
  update();
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(update);
    observer.observe(root, { childList: true, subtree: true });
    scope.add(() => {
      observer.disconnect();
    });
  }
}
function lockKeyboard(art, element, scope, locked) {
  let suspension;
  const active2 = () => !scope.closed && !isClosing(art);
  const label = art.i18n.get("Lock");
  if (!active2())
    return () => {
    };
  element.setAttribute("aria-label", label);
  keyboardButton(scope, element);
  listen(scope, element, "keydown", (input) => {
    const event = input;
    if (active2() && locked() && plainKey(event) && !event.defaultPrevented && event.key === "Escape") {
      claimKey(event);
      element.click();
    }
  });
  const update = (state2) => {
    if (!active2())
      return;
    element.setAttribute("aria-pressed", String(state2));
    if (state2 && !suspension) {
      const { $player, $bottom } = art.template;
      const hiddenFocus = $bottom.contains($bottom.ownerDocument.activeElement) && $player.classList.contains("art-keyboard-focus");
      suspension = scope.child();
      suspendFocus(suspension, $bottom);
      if (active2() && hiddenFocus)
        element.focus({ preventScroll: true });
    } else if (!state2 && suspension) {
      const previous = suspension;
      suspension = void 0;
      previous.dispose();
    }
  };
  update(locked());
  return update;
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
    if (isClosing(art))
      return;
    addClass($player, "art-lock");
    if (isClosing(art))
      return;
    art.isLock = true;
    if (!isClosing(art))
      art.emit("lock", true);
  }
  function setUnlock() {
    if (isClosing(art))
      return;
    removeClass($player, "art-lock");
    if (isClosing(art))
      return;
    art.isLock = false;
    if (!isClosing(art))
      art.emit("lock", false);
  }
  layers.add({
    name: "lock",
    mounted($el) {
      const scope = entryScope($el);
      if (scope.closed || isClosing(art))
        return;
      const $lock = appendElement($el, icons.lock);
      if (scope.closed || isClosing(art))
        return;
      const $unlock = appendElement($el, icons.unlock);
      if (scope.closed || isClosing(art))
        return;
      const updateKeyboard = lockKeyboard(art, $el, scope, getState);
      if (scope.closed || isClosing(art))
        return;
      if (getState()) {
        setStyle($lock, "display", "inline-flex");
        if (!scope.closed && !isClosing(art))
          setStyle($unlock, "display", "none");
      } else {
        setStyle($lock, "display", "none");
      }
      subscribeEntry(art, $el, "lock", (state2) => {
        if (isClosing(art))
          return;
        setStyle($lock, "display", state2 ? "inline-flex" : "none");
        if (!scope.closed && !isClosing(art))
          setStyle($unlock, "display", state2 ? "none" : "inline-flex");
        if (!scope.closed && !isClosing(art))
          updateKeyboard(state2);
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
  eventSubscriptions(art)("control", (state2) => {
    if (state2) {
      removeClass(art.template.$player, "art-mini-progress-bar");
    } else {
      addClass(art.template.$player, "art-mini-progress-bar");
    }
  });
  return { name: "mini-progress-bar" };
}
function installBuiltins(registry, option) {
  if (!isClosing(registry.art) && option.miniProgressBar && !option.isLive)
    registry.add(miniProgressBar);
  if (!isClosing(registry.art) && option.lock && isMobile)
    registry.add(lock);
  if (!isClosing(registry.art) && option.autoPlayback && !option.isLive)
    registry.add(autoPlayback);
  if (!isClosing(registry.art) && option.autoOrientation && isMobile)
    registry.add(autoOrientation);
  if (!isClosing(registry.art) && option.fastForward && isMobile && !option.isLive)
    registry.add(fastForward);
}
function registerPlugin(registry, plugin, result) {
  if (isClosing(registry.art))
    return registry;
  const name = result && result.name || plugin.name || `plugin${registry.id}`;
  if (isClosing(registry.art))
    return registry;
  let key = name;
  const duplicate = has(registry, key);
  if (isClosing(registry.art))
    return registry;
  const message = `Cannot add a plugin that already has the same name: ${name}`;
  if (isClosing(registry.art))
    return registry;
  errorHandle(!duplicate, message);
  if (typeof name === "object" && name !== null || typeof name === "function")
    key = Reflect.ownKeys({ [key]: void 0 })[0];
  if (!isClosing(registry.art))
    def(registry, key, { value: result });
  return registry;
}
class Plugins {
  constructor(art) {
    this.art = art;
    this.id = 0;
    const { option } = art;
    installBuiltins(this, option);
    for (let index = 0; index < option.plugins.length; index++) {
      if (isClosing(art))
        return;
      const registration = this.add(option.plugins[index]);
      if (registration instanceof Promise) {
        registration.catch((error2) => console.warn("Failed to initialize ArtPlayer plugin:", error2));
      }
    }
  }
  add(plugin) {
    errorHandle(!isClosing(this.art), "Cannot add a plugin after ArtPlayer is destroyed");
    this.id += 1;
    const result = plugin.call(this.art, this.art);
    if (result instanceof Promise)
      return result.then((res) => this.next(plugin, res));
    return this.next(plugin, result);
  }
  next(plugin, result) {
    return registerPlugin(this, plugin, result);
  }
}
const pauses = /* @__PURE__ */ new WeakMap();
function settingScopeActive(scope) {
  return !scope.closed && !pauses.get(scope);
}
function pauseSettingScope(scope) {
  pauses.set(scope, (pauses.get(scope) || 0) + 1);
  let paused = true;
  return () => {
    if (!paused)
      return;
    paused = false;
    const count = (pauses.get(scope) || 1) - 1;
    if (count)
      pauses.set(scope, count);
    else
      pauses.delete(scope);
  };
}
const bindings = /* @__PURE__ */ new WeakMap();
const owners$1 = /* @__PURE__ */ new WeakMap();
const keys = ["$parent", "$parents", "$option", "$events", "$formatted"];
function hasTreeBinding(item) {
  return bindings.has(item);
}
function registerTreeOwner(owner, scope) {
  owners$1.set(owner, { active: true, scope });
}
function releaseTreeOwner(owner) {
  const state2 = owners$1.get(owner);
  if (state2) {
    state2.active = false;
    state2.root = void 0;
    state2.scope = void 0;
  }
}
function activeBinding(item) {
  const visited = /* @__PURE__ */ new Set();
  let current2 = item;
  while (current2 && !visited.has(current2)) {
    visited.add(current2);
    const binding = bindings.get(current2);
    if (!binding || !binding.owner.active || binding.owner.scope?.closed || !binding.option.includes(current2))
      return false;
    if (!binding.parent)
      return binding.owner.root === binding.option;
    if (bindings.get(binding.parent)?.owner !== binding.owner)
      return false;
    current2 = binding.parent;
  }
  return false;
}
function canAssignName(item) {
  let target = item;
  while (target) {
    const descriptor = Object.getOwnPropertyDescriptor(target, "name");
    if (descriptor) {
      if ("set" in descriptor)
        return typeof descriptor.set === "function";
      return Boolean(descriptor.writable && (target === item || Object.isExtensible(item)));
    }
    target = Object.getPrototypeOf(target);
  }
  return Object.isExtensible(item);
}
function treeBinding(item) {
  const binding = bindings.get(item);
  if (!binding)
    throw new Error("Setting item has not been formatted");
  return binding;
}
function traverseTree(option, callback) {
  for (let index = 0; index < option.length; index++) {
    const item = option[index];
    callback(item);
    if (item.selector?.length)
      traverseTree(item.selector, callback);
  }
}
function findItem(option, name = "") {
  let result = null;
  traverseTree(option, (item) => {
    if (item.name === name)
      result = item;
  });
  return result;
}
function formatTree(owner, option, parent, parents, names = []) {
  const ownerState = owners$1.get(owner) || { active: true };
  const placements = [];
  const seen = /* @__PURE__ */ new Set();
  const used = new Set(names);
  const collect = (list, parent2, parents2) => {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      if (!item || typeof item !== "object")
        throw new TypeError("Setting item must be an object");
      if (seen.has(item))
        throw new Error("Setting items must appear only once in a tree");
      seen.add(item);
      const previous = bindings.get(item);
      if (previous && previous.owner !== ownerState && activeBinding(item))
        errorHandle(false, `Setting item [${item.name || ""}] already belongs to another active player`);
      if (item.name) {
        errorHandle(!used.has(item.name), `The [${item.name}] already exists in [setting]`);
        used.add(item.name);
      }
      if (!bindings.has(item)) {
        for (const key of keys) {
          const descriptor = Object.getOwnPropertyDescriptor(item, key);
          if (descriptor ? !descriptor.configurable : !Object.isExtensible(item))
            throw new TypeError(`Cannot format setting item property [${key}]`);
        }
      }
      if (!item.name && !canAssignName(item))
        throw new TypeError("Cannot assign an automatic setting item name");
      placements.push({ item, parent: parent2, parents: parents2, option: list, name: item.name || "", generated: !item.name });
      if (item.selector?.length)
        collect(item.selector, item, list);
    }
  };
  collect(option, parent, parents);
  let nextId = owner.id;
  owners$1.set(owner, ownerState);
  ownerState.root = option;
  for (const placement of placements) {
    if (!placement.name) {
      do {
        placement.name = `setting-${nextId++}`;
      } while (used.has(placement.name));
      used.add(placement.name);
    }
  }
  for (const placement of placements) {
    const { item, name, parent: parent2, parents: parents2, option: option2 } = placement;
    const previous = bindings.get(item);
    if (!previous) {
      Object.defineProperties(item, {
        $parent: { get: () => treeBinding(item).parent },
        $parents: { get: () => treeBinding(item).parents },
        $option: { get: () => treeBinding(item).option },
        $events: { get: () => treeBinding(item).events },
        $formatted: { get: () => true }
      });
    }
    bindings.set(item, { parent: parent2, parents: parents2, option: option2, events: previous?.events || [], owner: ownerState });
    if (placement.generated)
      item.name = name;
  }
  for (const placement of placements) {
    if (!placement.generated)
      names.push(placement.name);
  }
  owner.id = nextId;
  return option;
}
const scopes$1 = /* @__PURE__ */ new WeakMap();
function ownSettingPanel(setting2, option, panel) {
  const scope = getScope(setting2.art).child();
  scopes$1.set(panel, scope);
  scope.add(() => {
    if (setting2.cache.get(option) === panel)
      setting2.cache.delete(option);
    panel.remove();
  });
  return scope;
}
function settingPanelScope(panel) {
  const scope = scopes$1.get(panel);
  if (!scope)
    throw new Error("Setting panel has not been registered");
  return scope;
}
function releaseSettingPanel(panel) {
  const scope = scopes$1.get(panel);
  if (scope)
    scope.dispose();
  else
    panel.remove();
}
const scopes = /* @__PURE__ */ new WeakMap();
const owners = /* @__PURE__ */ new WeakMap();
const eventLists = /* @__PURE__ */ new WeakMap();
function releaseEvents(art, events) {
  const pending2 = events.splice(0);
  const failures = [];
  for (const cleanup of pending2) {
    try {
      art.events.remove(cleanup);
    } catch (error2) {
      failures.push(error2);
    }
  }
  if (failures.length)
    throw new ResourceCleanupError(failures);
}
function ownSettingItem(art, item, owner = getScope(art)) {
  const previous = scopes.get(item);
  if (!previous || settingScopeActive(previous) || previous.closed)
    releaseSettingItem(art, item);
  const scope = owner.child();
  scopes.set(item, scope);
  owners.set(item, owner);
  eventLists.set(scope, treeBinding(item).events);
  scope.add(() => {
    releaseEvents(art, eventLists.get(scope));
  });
  return scope;
}
function settingItemOwner(item) {
  return owners.get(item);
}
function settingScope(item) {
  const scope = scopes.get(item);
  if (!scope)
    throw new Error("Setting item has not been rendered");
  return scope;
}
function releaseSettingItem(art, item) {
  const scope = scopes.get(item);
  if (scope && !scope.closed)
    scope.dispose();
  else if (hasTreeBinding(item))
    releaseEvents(art, treeBinding(item).events);
}
function suspendSettingItem(art, item) {
  const previous = scopes.get(item);
  if (!previous || previous.closed)
    return;
  if (!settingScopeActive(previous))
    throw new Error("Setting item update is already in progress");
  const owner = owners.get(item);
  const events = treeBinding(item).events;
  const saved = events.splice(0);
  eventLists.set(previous, saved);
  const unpause = pauseSettingScope(previous);
  let pending2 = true;
  return {
    resume() {
      if (!pending2)
        return;
      pending2 = false;
      const failures = [];
      const current2 = scopes.get(item);
      for (const cleanup of [() => {
        if (current2 && current2 !== previous)
          current2.dispose();
      }, () => releaseEvents(art, events)]) {
        try {
          cleanup();
        } catch (error2) {
          if (error2 instanceof ResourceCleanupError)
            failures.push(...error2.errors);
          else
            failures.push(error2);
        }
      }
      if (!previous.closed && !isClosing(art)) {
        events.push(...saved.splice(0));
        eventLists.set(previous, events);
        scopes.set(item, previous);
        owners.set(item, owner);
      }
      unpause();
      if (failures.length)
        throw new ResourceCleanupError(failures);
    },
    dispose() {
      if (!pending2)
        return;
      pending2 = false;
      try {
        previous.dispose();
      } finally {
        unpause();
      }
    }
  };
}
function proxySetting(art, item, target, name, callback, owner) {
  const scope = owner || settingScope(item);
  if (!settingScopeActive(scope) || isClosing(art))
    return;
  const event = art.proxy(target, name, (event2) => {
    if (settingScopeActive(scope) && !isClosing(art)) {
      try {
        return callback(event2);
      } catch (error2) {
        console.warn("ArtPlayer setting callback failed:", error2);
      }
    }
  });
  if (!settingScopeActive(scope) || isClosing(art)) {
    art.events.remove(event);
  } else {
    treeBinding(item).events.push(event);
    if (owner && owner !== scopes.get(item)) {
      owner.add(() => {
        const events = treeBinding(item).events;
        const index = events.indexOf(event);
        if (index >= 0) {
          events.splice(index, 1);
          art.events.remove(event);
        }
      });
    }
  }
}
function subscribeSetting(art, item, name, callback) {
  const scope = settingScope(item);
  if (!settingScopeActive(scope) || isClosing(art))
    return;
  const guarded = (...args) => {
    if (settingScopeActive(scope) && !isClosing(art))
      return callback(...args);
  };
  art.on(name, guarded);
  scope.add(() => {
    art.off(name, guarded);
  });
}
function releaseSettingTree(setting2, item) {
  const failures = [];
  const visited = /* @__PURE__ */ new Set();
  const visit = (item2) => {
    if (visited.has(item2))
      return;
    visited.add(item2);
    for (const child of item2.selector || [])
      visit(child);
    if (item2.selector) {
      const panel = setting2.cache.get(item2.selector);
      setting2.cache.delete(item2.selector);
      try {
        if (panel)
          releaseSettingPanel(panel);
      } catch (error2) {
        failures.push(error2);
      }
    }
    try {
      releaseSettingItem(setting2.art, item2);
    } catch (error2) {
      if (error2 instanceof ResourceCleanupError)
        failures.push(...error2.errors);
      else
        failures.push(error2);
    }
  };
  visit(item);
  if (failures.length)
    throw new ResourceCleanupError(failures);
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
    mounted: (_element, item) => {
      update();
      subscribeSetting(art, item, "aspectRatio", () => update());
    }
  };
}
function installSettingEvents(setting2) {
  const { art } = setting2;
  const scope = getScope(art).child();
  const on = (name, callback) => {
    if (scope.closed || isClosing(art))
      return;
    const guarded = (...args) => {
      if (!scope.closed && !isClosing(art))
        return callback(...args);
    };
    art.on(name, guarded);
    scope.add(() => {
      art.off(name, guarded);
    });
  };
  on("blur", () => {
    if (setting2.show) {
      setting2.show = false;
      setting2.render();
    }
  });
  on("focus", (event) => {
    const isControl = includeFromEvent(event, art.controls.setting);
    const isSetting = includeFromEvent(event, setting2.$parent);
    if (setting2.show && !isControl && !isSetting) {
      setting2.show = false;
      setting2.render();
    }
  });
  on("resize", () => setting2.resize());
  const resize = () => {
    if (!scope.closed && !isClosing(art))
      setting2.resize();
  };
  const transitioned = art.proxy(setting2.$parent, "transitionend", (event) => {
    if (event.target === setting2.$parent && event.propertyName === "bottom")
      resize();
  });
  scope.add(() => {
    art.events.remove(transitioned);
  });
  const { $player, $controls } = art.template;
  if (!scope.closed && typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(resize);
    observer.observe($player);
    observer.observe($controls);
    scope.add(() => {
      observer.disconnect();
    });
  }
  if (!scope.closed && typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(resize);
    if (typeof ResizeObserver === "undefined")
      observer.observe($controls, { childList: true, subtree: true, attributes: true, characterData: true });
    observer.observe($player, { attributes: true, attributeFilter: ["class", "style"] });
    scope.add(() => {
      observer.disconnect();
    });
  }
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
    mounted: (_element, item) => {
      update();
      subscribeSetting(art, item, "flip", () => update());
    }
  };
}
const focusSelector = '[tabindex="0"],button,input,select,textarea,a[href],[contenteditable]';
function available(element) {
  if (!element.isConnected || element.matches(":disabled") || element.closest("[inert]") || element.getAttribute("aria-disabled") === "true" || !element.getClientRects().length)
    return false;
  const visibility = element.ownerDocument.defaultView?.getComputedStyle(element).visibility;
  return visibility !== "hidden" && visibility !== "collapse";
}
function settingFocusTargets(panel) {
  return Array.from(panel.querySelectorAll(focusSelector)).filter((element) => element.getAttribute("tabindex") !== "-1" && available(element));
}
function selectSettingTarget(panel, preferred, last = false) {
  if (preferred && preferred !== panel && panel.contains(preferred) && preferred.matches(focusSelector) && preferred.getAttribute("tabindex") !== "-1" && available(preferred))
    return preferred;
  const targets = settingFocusTargets(panel);
  const selected = panel.querySelector(".art-setting-item.art-current");
  return targets.find((element) => preferred?.contains(element)) || (last ? targets[targets.length - 1] : targets.find((element) => selected?.contains(element)) || targets.find((element) => !element.classList.contains("art-setting-item-back")) || targets[0]);
}
function returnSettingFocus(setting2) {
  const { art, $parent } = setting2;
  const player = art.template.$player;
  const doc = $parent.ownerDocument;
  const button = art.controls.setting;
  if (isClosing(art) || !$parent.contains(doc.activeElement))
    return;
  if (button && player.contains(button) && available(button))
    button.focus({ preventScroll: true });
  if (doc.activeElement === doc.body || $parent.contains(doc.activeElement))
    focusPlayer(art);
}
function focusSettingPanel(setting2, preferred, last = false) {
  if (!setting2.show || isClosing(setting2.art) || !setting2.active)
    return;
  const panel = setting2.cache.get(setting2.active);
  if (!panel || !settingScopeActive(settingPanelScope(panel)))
    return;
  const target = selectSettingTarget(panel, preferred, last);
  target?.focus({ preventScroll: true });
  if (!isClosing(setting2.art))
    target?.scrollIntoView({ block: "nearest", inline: "nearest" });
}
function captureSettingFocus(setting2) {
  const doc = setting2.$parent.ownerDocument;
  const focused = doc.activeElement;
  const inside = setting2.$parent.contains(focused);
  return (preferred) => {
    if (!inside || isClosing(setting2.art))
      return;
    if (doc.activeElement === doc.body || doc.activeElement === focused && !focused?.getClientRects().length)
      focusSettingPanel(setting2, preferred);
  };
}
function installSettingKeyboard(setting2) {
  const { art } = setting2;
  const scope = getScope(art).child();
  if (scope.closed)
    return;
  const doc = () => setting2.$parent.ownerDocument;
  let enterLast = false;
  const close2 = () => {
    setting2.show = false;
    if (!scope.closed && !isClosing(art))
      setting2.render();
  };
  const changed = (show) => {
    if (scope.closed || isClosing(art))
      return;
    if (show) {
      if (doc().activeElement === art.controls.setting && art.template.$player.classList.contains("art-keyboard-focus"))
        focusSettingPanel(setting2, void 0, enterLast);
    } else if (setting2.$parent.contains(doc().activeElement)) {
      returnSettingFocus(setting2);
    }
  };
  art.on("setting", changed);
  scope.add(() => {
    art.off("setting", changed);
  });
  listen(scope, art.template.$player, "keydown", (input) => {
    const event = input;
    if (!plainKey(event) || event.defaultPrevented || isClosing(art))
      return;
    const target = event.target;
    if (target === art.controls.setting) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        claimKey(event);
        if (!setting2.show) {
          enterLast = event.key === "ArrowUp";
          try {
            setting2.show = true;
          } finally {
            enterLast = false;
          }
        } else {
          focusSettingPanel(setting2, void 0, event.key === "ArrowUp");
        }
      } else if (event.key === "Escape" && setting2.show) {
        claimKey(event);
        close2();
      }
      return;
    }
    if (!setting2.show || !setting2.$parent.contains(target))
      return;
    if (event.key === "Escape") {
      claimKey(event);
      close2();
      return;
    }
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
      return;
    const row = target.closest(".art-setting-item");
    if (!row || target !== row && !target.matches('button,a[href],[role="button"]'))
      return;
    const panel = setting2.active && setting2.cache.get(setting2.active);
    if (!panel)
      return;
    const currentItem = setting2.active?.find((item) => item.$item === row);
    if (!settingScopeActive(settingPanelScope(panel)) || currentItem && !settingScopeActive(settingScope(currentItem))) {
      claimKey(event);
      return;
    }
    const targets = settingFocusTargets(panel);
    const index = targets.indexOf(target);
    if (index < 0)
      return;
    let next;
    switch (event.key) {
      case "ArrowDown":
        next = Math.min(index + 1, targets.length - 1);
        break;
      case "ArrowUp":
        next = Math.max(index - 1, 0);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = targets.length - 1;
        break;
      case "ArrowLeft": {
        const back = panel.querySelector(".art-setting-item-back");
        claimKey(event);
        back?.click();
        return;
      }
      case "ArrowRight": {
        claimKey(event);
        if (currentItem?.selector?.length)
          target.click();
        return;
      }
      default:
        return;
    }
    claimKey(event);
    if (next !== void 0)
      focusSettingPanel(setting2, targets[next]);
  });
  let pending2 = false;
  listen(scope, setting2.$parent, "focusout", (event) => {
    const next = event.relatedTarget;
    if (next && (setting2.$parent.contains(next) || next === art.controls.setting))
      return;
    if (pending2)
      return;
    pending2 = true;
    timeout(scope, () => {
      pending2 = false;
      if (!scope.closed && !isClosing(art) && setting2.show && !setting2.$parent.contains(doc().activeElement) && doc().activeElement !== art.controls.setting)
        close2();
    }, 0);
  });
}
function calculateSettingLayout(input) {
  const { containerWidth, containerHeight, requestedWidth, rows, rowHeight, controlCenter, bottom, padding } = input;
  const inset = Math.min(Math.max(0, padding), Math.max(0, containerWidth / 2));
  const width = Math.min(Math.max(0, requestedWidth), Math.max(0, containerWidth - 2 * inset));
  const height = Math.min(Math.max(0, rows * rowHeight), Math.max(0, containerHeight - bottom - inset));
  const left = Math.max(inset, Math.min(controlCenter - width / 2, containerWidth - inset - width));
  return { width, height, left };
}
function resizeSetting(setting2) {
  const { art, active: active2 } = setting2;
  const { controls, constructor: { SETTING_WIDTH, SETTING_ITEM_HEIGHT }, template: { $player, $setting, $bottom } } = art;
  if (!controls.setting || !setting2.show || !active2)
    return;
  const player = $player.getBoundingClientRect();
  const control = controls.setting.getBoundingClientRect();
  const scale = player.width / $player.offsetWidth || 1;
  const controlCenter = (control.left - player.left + control.width / 2) / scale - $player.clientLeft;
  const layout = calculateSettingLayout({
    containerWidth: $player.clientWidth,
    containerHeight: $player.clientHeight,
    requestedWidth: active2[0]?.$parent?.width || SETTING_WIDTH,
    rows: active2.length + (active2 === setting2.option ? 0 : 1),
    rowHeight: SETTING_ITEM_HEIGHT,
    controlCenter,
    bottom: Number.parseFloat(getComputedStyle($setting).bottom) || 0,
    padding: Number.parseFloat(getComputedStyle($bottom).paddingLeft) || 0
  });
  $setting.style.height = `${layout.height}px`;
  $setting.style.width = `${layout.width}px`;
  if (art.isRotate || isMobile)
    return;
  if (controlCenter + layout.width / 2 > $player.clientWidth) {
    $setting.style.left = "";
    $setting.style.right = "";
  } else {
    $setting.style.left = `${layout.left}px`;
    $setting.style.right = "auto";
  }
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
    mounted: (_element, item) => {
      update();
      subscribeSetting(art, item, "video:ratechange", () => update());
    }
  };
}
const registrations = /* @__PURE__ */ new WeakMap();
function cancelSettingAdd(item) {
  registrations.delete(item);
}
function beginSettingAdd(item) {
  const token = {};
  registrations.set(item, token);
  const current2 = () => registrations.get(item) === token;
  return {
    current: current2,
    finish() {
      if (current2())
        registrations.delete(item);
    }
  };
}
const states$1 = /* @__PURE__ */ new WeakMap();
function rememberSettingState(item, capture) {
  if (capture)
    states$1.set(item, capture);
  else
    states$1.delete(item);
}
function captureSettingItem(item) {
  const descriptors = new Map(Reflect.ownKeys(item).map((key) => [key, Object.getOwnPropertyDescriptor(item, key)]));
  const nodes = [];
  const state2 = states$1.get(item);
  const restoreState = state2?.();
  for (const key of ["html", "icon", "tooltip"]) {
    const value = descriptors.get(key)?.value;
    if (value instanceof Node)
      nodes.push({ node: value, parent: value.parentNode, next: value.nextSibling });
  }
  return () => {
    for (const key of Reflect.ownKeys(item)) {
      if (!descriptors.has(key) && Object.getOwnPropertyDescriptor(item, key)?.configurable)
        Reflect.deleteProperty(item, key);
    }
    for (const [key, descriptor] of descriptors)
      Object.defineProperty(item, key, descriptor);
    restoreState?.();
    rememberSettingState(item, state2);
    for (const { node, parent, next } of nodes) {
      if (parent)
        parent.insertBefore(node, next?.parentNode === parent ? next : null);
      else
        node.parentNode?.removeChild(node);
    }
  };
}
function nameSettingRange(item) {
  const input = item.$item?.querySelector(".art-setting-range");
  if (input)
    input.setAttribute("aria-label", item.$html?.textContent || "");
}
function settingItemKeyboard(setting2, item, element, kind, scope) {
  if (kind === "range") {
    nameSettingRange(item);
    return;
  }
  if (element.querySelector("button,input,select,textarea,a[href],[tabindex],[contenteditable]"))
    return;
  if (kind === "switch") {
    element.setAttribute("role", "switch");
    element.setAttribute("aria-checked", String(Boolean(item.switch)));
    element.setAttribute("aria-disabled", String(!item.onSwitch));
  } else if (kind === "selector" && !item.selector?.length) {
    element.setAttribute("aria-current", String(Boolean(item.default)));
  }
  keyboardButton(scope, element, () => element.click(), () => settingScopeActive(scope) && !isClosing(setting2.art));
}
const generations = /* @__PURE__ */ new WeakMap();
function checkSetting(setting2, target) {
  if (!target?.$parent)
    return;
  target.$parent.tooltip = target.html;
  setting2.traverse((item) => {
    item.default = item === target;
    if (item.$item)
      item.$item.setAttribute("aria-current", String(item.default));
    if (item.default && item.$item)
      inverseClass(item.$item, "art-current");
  }, target.$option);
  setting2.render(target.$parents);
}
async function act(setting2, item, element, event, callback, target, property, before) {
  try {
    const scope = settingScope(item);
    const targetScope = settingScope(target);
    const generation = (generations.get(target) || 0) + 1;
    generations.set(target, generation);
    const active2 = () => settingScopeActive(scope) && settingScopeActive(targetScope) && !isClosing(setting2.art) && generations.get(target) === generation;
    before?.();
    if (!active2())
      return;
    const value = await callback.call(setting2.art, item, element, event);
    if (active2())
      Reflect.set(target, property, value);
  } catch (error2) {
    console.warn("ArtPlayer setting callback failed:", error2);
  }
}
function bindSettingActions(setting2, item, element, kind) {
  const { art } = setting2;
  const scope = settingScope(item);
  const proxy = (target, name, callback) => proxySetting(art, item, target, name, callback, scope);
  switch (kind) {
    case "switch":
      if (item.onSwitch)
        proxy(element, "click", (event) => act(setting2, item, element, event, item.onSwitch, item, "switch"));
      break;
    case "range": {
      const range = item.$range;
      if (range) {
        for (const [name, callback] of [["change", "onRange"], ["input", "onChange"]]) {
          if (item[callback]) {
            proxy(range, name, (event) => act(setting2, item, element, event, item[callback], item, "tooltip", () => {
              item.range[0] = range.valueAsNumber;
            }));
          }
        }
      }
      break;
    }
    case "selector":
      proxy(element, "click", (event) => {
        if (item.selector?.length) {
          setting2.render(item.selector);
        } else if (item.$parent?.onSelect) {
          return act(setting2, item, element, event, item.$parent.onSelect, item.$parent, "tooltip", () => setting2.check(item));
        } else {
          setting2.check(item);
        }
      });
      if (item.default)
        addClass(element, "art-current");
      break;
    case "button":
      if (item.onClick)
        proxy(element, "click", (event) => act(setting2, item, element, event, item.onClick, item, "tooltip"));
      break;
  }
}
function captureTemplate(container) {
  const snapshots = [];
  function capture(node) {
    const children = Array.from(node.childNodes);
    snapshots.push({
      node,
      children,
      attributes: node.nodeType === 1 ? Array.from(node.attributes, (attr) => [attr.name, attr.value]) : void 0,
      value: node.nodeValue
    });
    children.forEach(capture);
  }
  capture(container);
  return () => {
    for (const { node, children, attributes, value } of snapshots) {
      while (node.firstChild)
        node.removeChild(node.firstChild);
      for (const child of children)
        node.appendChild(child);
      if (attributes) {
        const element = node;
        for (const attr of Array.from(element.attributes))
          element.removeAttribute(attr.name);
        for (const [name, content] of attributes)
          element.setAttribute(name, content);
      } else {
        node.nodeValue = value;
      }
    }
  };
}
const pending = /* @__PURE__ */ new WeakMap();
function finish(cleanups) {
  const errors = [];
  for (const cleanup of cleanups) {
    try {
      cleanup();
    } catch (error2) {
      if (error2 instanceof ResourceCleanupError)
        errors.push(...error2.errors);
      else
        errors.push(error2);
    }
  }
  if (errors.length)
    throw new ResourceCleanupError(errors);
}
function suspendTree(setting2, root) {
  const items = /* @__PURE__ */ new Set();
  const panels = /* @__PURE__ */ new Set();
  const collect = (item) => {
    if (items.has(item))
      return;
    items.add(item);
    if (item.selector) {
      const panel = setting2.cache.get(item.selector);
      if (panel)
        panels.add(panel);
      item.selector.forEach(collect);
    }
  };
  collect(root);
  const suspended = [];
  const unpause = [];
  try {
    for (const item of items) {
      const suspension = suspendSettingItem(setting2.art, item);
      if (suspension)
        suspended.push(suspension);
    }
    for (const panel of panels)
      unpause.push(pauseSettingScope(settingPanelScope(panel)));
  } catch (error2) {
    try {
      finish([...suspended.reverse().map((item) => item.resume), ...unpause]);
    } catch (cleanupError) {
      console.warn("ArtPlayer setting restore failed:", cleanupError);
    }
    throw error2;
  }
  let active2 = true;
  return {
    items,
    resume() {
      if (!active2)
        return;
      active2 = false;
      finish([...suspended.reverse().map((item) => item.resume), ...unpause]);
    },
    dispose() {
      if (!active2)
        return;
      active2 = false;
      finish([...suspended.reverse().map((item) => item.dispose), ...Array.from(panels).reverse().map((panel) => () => releaseSettingPanel(panel)), ...unpause]);
    }
  };
}
function cancelSettingUpdate(item) {
  pending.get(item)?.();
}
function captureSettingUpdate(item) {
  const operation = pending.get(item);
  return () => !operation || pending.get(item) === operation;
}
function assignSetting(item, target, current2) {
  for (const key of Reflect.ownKeys(target)) {
    if (!current2())
      return;
    const descriptor = Object.getOwnPropertyDescriptor(target, key);
    if (!descriptor?.enumerable || !current2())
      continue;
    const value = Reflect.get(target, key);
    if (!current2())
      return;
    if (!Reflect.set(item, key, value))
      throw new TypeError(`Cannot assign setting item property [${String(key)}]`);
  }
}
function updateSetting(setting2, target) {
  const item = setting2.find(target.name);
  if (isClosing(setting2.art))
    return item || target;
  if (!item)
    return setting2.add(target);
  const restoreFocus = captureSettingFocus(setting2);
  cancelSettingAdd(item);
  cancelSettingUpdate(item);
  const restoreItem = captureSettingItem(item);
  const element = item.$item;
  const parent = element?.parentNode;
  const next = element?.nextSibling;
  const restoreTemplate = element ? captureTemplate(element) : void 0;
  const previous = setting2.active;
  const layout = ["height", "width", "left", "right"].map((key) => [key, setting2.$parent.style.getPropertyValue(key), setting2.$parent.style.getPropertyPriority(key)]);
  const tree = suspendTree(setting2, item);
  let active2 = true;
  let rendered = false;
  const cancel = () => {
    if (!active2)
      return;
    active2 = false;
    for (const affected of tree.items) {
      if (pending.get(affected) === cancel)
        pending.delete(affected);
    }
    if (isClosing(setting2.art)) {
      tree.dispose();
      return;
    }
    const replacement = item.$item;
    try {
      finish([
        tree.resume,
        () => {
          if (replacement && replacement !== element)
            replacement.remove();
        },
        restoreItem,
        () => restoreTemplate?.(),
        () => {
          if (parent && element)
            parent.insertBefore(element, next?.parentNode === parent ? next : null);
        },
        () => setting2.format(),
        () => {
          if (rendered) {
            setting2.active = previous;
            if (previous && setting2.cache.has(previous))
              inverseClass(setting2.cache.get(previous), "art-current");
            for (const [key, value, priority] of layout)
              setting2.$parent.style.setProperty(key, value, priority);
          }
        }
      ]);
      restoreFocus(element);
    } catch (error2) {
      console.warn("ArtPlayer setting restore failed:", error2);
    }
  };
  const current2 = () => active2 && !isClosing(setting2.art) && pending.get(item) === cancel;
  for (const affected of tree.items)
    pending.set(affected, cancel);
  const release = getScope(setting2.art).add(() => {
    active2 = false;
    for (const affected of tree.items) {
      if (pending.get(affected) === cancel)
        pending.delete(affected);
    }
    tree.dispose();
  });
  try {
    assignSetting(item, target, current2);
    if (!current2())
      return item;
    setting2.format();
    if (!current2())
      return item;
    setting2.createItem(item, true);
    if (!current2())
      return item;
    rendered = true;
    setting2.render();
    if (!current2())
      return item;
    active2 = false;
    for (const affected of tree.items) {
      if (pending.get(affected) === cancel)
        pending.delete(affected);
    }
    tree.dispose();
    restoreFocus(item.$item);
    return item;
  } catch (error2) {
    if (current2())
      cancel();
    throw error2;
  } finally {
    release();
  }
}
const navigations = /* @__PURE__ */ new WeakMap();
function bindContent(item, key, element) {
  def(item, `$${key}`, { configurable: true, get: () => element });
  def(item, key, {
    configurable: true,
    get: () => element.innerHTML,
    set(value) {
      element.innerHTML = "";
      append(element, value);
      if (key === "html")
        nameSettingRange(item);
    }
  });
}
function createSettingHeader(setting2, item) {
  if (!setting2.cache.has(item.$option))
    return;
  const $panel = setting2.cache.get(item.$option);
  const {
    icons: { arrowLeft: arrowLeft2 },
    constructor: { SETTING_ITEM_HEIGHT }
  } = setting2.art;
  const $item = document.createElement("div");
  setStyle($item, "height", `${SETTING_ITEM_HEIGHT}px`);
  addClass($item, "art-setting-item");
  addClass($item, "art-setting-item-back");
  const $left = appendElement($item, '<div class="art-setting-item-left"></div>');
  const $icon = document.createElement("div");
  addClass($icon, "art-setting-item-left-icon");
  append($icon, arrowLeft2);
  append($left, $icon);
  append($left, item.$parent.html);
  proxySetting(setting2.art, item.$parent, $item, "click", () => setting2.render(item.$parents), settingPanelScope($panel));
  const scope = settingPanelScope($panel);
  if (!$item.querySelector("button,input,select,textarea,a[href],[tabindex],[contenteditable]"))
    keyboardButton(scope, $item, () => $item.click(), () => settingScopeActive(scope) && !isClosing(setting2.art));
  $item.setAttribute("aria-label", `${setting2.art.i18n.get("Back")}: ${$item.textContent?.trim() || ""}`);
  append($panel, $item);
}
function createSettingItem(setting2, item, isUpdate = false) {
  const currentUpdate = captureSettingUpdate(item);
  if (!setting2.cache.has(item.$option))
    return;
  const $panel = setting2.cache.get(item.$option);
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
  const { icons, constructor } = setting2.art;
  if (!currentUpdate())
    return;
  const scope = ownSettingItem(setting2.art, item, settingPanelScope($panel));
  const current2 = () => settingScopeActive(scope) && !isClosing(setting2.art) && currentUpdate();
  if (!current2())
    return;
  const $item = document.createElement("div");
  try {
    rememberSettingState(item);
    addClass($item, "art-setting-item");
    setStyle($item, "height", `${constructor.SETTING_ITEM_HEIGHT}px`);
    $item.dataset.name = item.name || "";
    $item.dataset.value = String(item.value || "");
    if (!current2())
      return;
    const $left = appendElement($item, '<div class="art-setting-item-left"></div>');
    const $right = appendElement($item, '<div class="art-setting-item-right"></div>');
    const $icon = document.createElement("div");
    addClass($icon, "art-setting-item-left-icon");
    switch (type) {
      case "button":
      case "switch":
      case "range": {
        const icon = item.icon || icons.config;
        if (!current2())
          return;
        append($icon, icon);
        break;
      }
      case "selector":
        if (item.selector?.length) {
          const icon = item.icon || icons.config;
          if (!current2())
            return;
          append($icon, icon);
        } else {
          append($icon, icons.check);
        }
        break;
      default:
        break;
    }
    append($left, $icon);
    if (!current2())
      return;
    bindContent(item, "icon", $icon);
    const $html = document.createElement("div");
    addClass($html, "art-setting-item-left-text");
    const html2 = item.html || "";
    if (!current2())
      return;
    append($html, html2);
    append($left, $html);
    bindContent(item, "html", $html);
    const $tooltip = document.createElement("div");
    addClass($tooltip, "art-setting-item-right-tooltip");
    const tooltip2 = item.tooltip || "";
    if (!current2())
      return;
    append($tooltip, tooltip2);
    append($right, $tooltip);
    bindContent(item, "tooltip", $tooltip);
    switch (type) {
      case "switch": {
        const $switch = document.createElement("div");
        addClass($switch, "art-setting-item-right-icon");
        const $switchOn = appendElement($switch, icons.switchOn);
        const $switchOff = appendElement($switch, icons.switchOff);
        const initialSwitch = item.switch;
        if (!current2())
          return;
        setStyle(initialSwitch ? $switchOff : $switchOn, "display", "none");
        append($right, $switch);
        def(item, "$switch", {
          configurable: true,
          get: () => $switch
        });
        let $switchValue = item.switch;
        if (!current2())
          return;
        rememberSettingState(item, () => {
          const value = $switchValue;
          return () => {
            $switchValue = value;
          };
        });
        def(item, "switch", {
          configurable: true,
          get: () => $switchValue,
          set(value) {
            $switchValue = value;
            $item.setAttribute("aria-checked", String(Boolean(value)));
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
          const $state = document.createElement("div");
          addClass($state, "art-setting-item-right-icon");
          const $range = document.createElement("input");
          $range.type = "range";
          append($state, $range);
          for (const [index, key] of ["value", "min", "max", "step"].entries()) {
            const value = item.range[index];
            if (!current2())
              return;
            Reflect.set($range, key, String(value));
          }
          addClass($range, "art-setting-range");
          append($right, $state);
          def(item, "$range", {
            configurable: true,
            get: () => $range
          });
          let $rangeValue = [...item.range];
          if (!current2())
            return;
          rememberSettingState(item, () => {
            const value = $rangeValue;
            const values = [...value];
            const input = { min: $range.min, max: $range.max, step: $range.step, value: $range.value };
            return () => {
              value.splice(0, value.length, ...values);
              $rangeValue = value;
              Object.assign($range, input);
            };
          });
          def(item, "range", {
            configurable: true,
            get: () => $rangeValue,
            set(value) {
              $rangeValue = [...value];
              $range.value = String(value[0]);
              $range.min = String(value[1]);
              $range.max = String(value[2]);
              $range.step = String(value[3]);
            }
          });
        }
        break;
      case "selector":
        if (item.selector?.length) {
          const $state = document.createElement("div");
          addClass($state, "art-setting-item-right-icon");
          append($state, icons.arrowRight);
          append($right, $state);
        }
        break;
      default:
        break;
    }
    if (!current2())
      return;
    bindSettingActions(setting2, item, $item, type);
    if (!current2())
      return;
    def(item, "$item", {
      configurable: true,
      get: () => $item
    });
    settingItemKeyboard(setting2, item, $item, type, scope);
    if (isUpdate) {
      if (oldItem?.parentNode)
        oldItem.replaceWith($item);
      else
        append($panel, $item);
    } else {
      append($panel, $item);
    }
    if (item.mounted && current2()) {
      timeout(scope, () => {
        if (isClosing(setting2.art))
          return;
        try {
          const result = item.mounted?.call(setting2.art, $item, item);
          void Promise.resolve(result).catch((error2) => console.warn("ArtPlayer setting mounted failed:", error2));
        } catch (error2) {
          console.warn("ArtPlayer setting mounted failed:", error2);
        }
      }, 0);
    }
  } catch (error2) {
    try {
      scope.dispose();
    } catch (cleanupError) {
      console.warn("ArtPlayer setting cleanup failed:", cleanupError);
    }
    $item.remove();
    throw error2;
  }
}
function renderSetting(setting2, option = setting2.option) {
  if (isClosing(setting2.art))
    return;
  const restoreFocus = captureSettingFocus(setting2);
  const cached = setting2.cache.get(option);
  if (cached && !settingScopeActive(settingPanelScope(cached)))
    return;
  const navigation = (navigations.get(setting2) || 0) + 1;
  navigations.set(setting2, navigation);
  const currentNavigation = () => navigations.get(setting2) === navigation && !isClosing(setting2.art);
  const previous = setting2.active;
  const previousLayout = ["height", "width", "left", "right"].map((key) => [key, setting2.$parent.style.getPropertyValue(key), setting2.$parent.style.getPropertyPriority(key)]);
  const restoreNavigation = () => {
    setting2.active = previous;
    if (previous && setting2.cache.has(previous))
      inverseClass(setting2.cache.get(previous), "art-current");
    for (const [key, value, priority] of previousLayout)
      setting2.$parent.style.setProperty(key, value, priority);
  };
  setting2.active = option;
  if (cached) {
    try {
      inverseClass(cached, "art-current");
      setting2.resize();
    } catch (error2) {
      if (currentNavigation() && setting2.cache.get(option) === cached && !settingPanelScope(cached).closed)
        restoreNavigation();
      throw error2;
    }
  } else {
    const $panel = document.createElement("div");
    setting2.cache.set(option, $panel);
    const scope = ownSettingPanel(setting2, option, $panel);
    const current2 = () => !scope.closed && !isClosing(setting2.art) && setting2.cache.get(option) === $panel;
    const checkpoints = [];
    try {
      if (!current2())
        return;
      addClass($panel, "art-setting-panel");
      $panel.setAttribute("role", "group");
      $panel.setAttribute("aria-label", option[0]?.$parent?.$html?.textContent || setting2.art.i18n.get("Settings"));
      append(setting2.$parent, $panel);
      inverseClass($panel, "art-current");
      if (option[0]?.$parent)
        setting2.createHeader(option[0]);
      for (let index = 0; index < option.length && current2(); index++) {
        const item = option[index];
        checkpoints.push({ item, restore: captureSettingItem(item) });
        setting2.createItem(item);
      }
      if (!current2())
        return;
      setting2.resize();
    } catch (error2) {
      const restore = current2();
      const restoreActive = setting2.active === option && currentNavigation();
      try {
        releaseSettingPanel($panel);
      } catch (cleanupError) {
        console.warn("ArtPlayer setting cleanup failed:", cleanupError);
      }
      if (restore && !isClosing(setting2.art)) {
        for (const checkpoint of checkpoints.reverse()) {
          if (settingItemOwner(checkpoint.item) === scope) {
            try {
              checkpoint.restore();
            } catch (restoreError) {
              console.warn("ArtPlayer setting restore failed:", restoreError);
            }
          }
        }
        if (restoreActive)
          restoreNavigation();
      }
      throw error2;
    }
  }
  if (currentNavigation())
    restoreFocus(previous?.[0]?.$parent?.$item);
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
      subscribeSetting(art, item, "subtitleOffset", (value) => {
        item.$range.value = String(value);
        item.tooltip = `${value}s`;
      });
    }
  };
}
const SettingBase = Component;
class Setting extends SettingBase {
  constructor(art) {
    super(art);
    const {
      option,
      template: { $setting }
    } = art;
    this.name = "setting";
    this.$parent = $setting;
    this.id = 0;
    this.active = null;
    this.cache = /* @__PURE__ */ new Map();
    this.option = [...this.builtin, ...option.settings];
    const scope = getScope(art);
    registerTreeOwner(this, scope);
    scope.add(() => {
      releaseTreeOwner(this);
    });
    if (option.setting) {
      this.format();
      this.render();
      installSettingEvents(this);
    }
    installSettingKeyboard(this);
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
    traverseTree(option, callback);
  }
  check(target) {
    checkSetting(this, target);
  }
  format(option = this.option, parent, parents, names = []) {
    this.option = formatTree(this, option, parent, parents, names);
  }
  find(name = "") {
    return findItem(this.option, name);
  }
  resize() {
    resizeSetting(this);
  }
  inactivate(item) {
    releaseSettingTree(this, item);
  }
  remove(name) {
    const restoreFocus = captureSettingFocus(this);
    const item = this.find(name);
    errorHandle(item, `Can't find [${name}] in the [setting]`);
    this.traverse((item2) => {
      cancelSettingAdd(item2);
      cancelSettingUpdate(item2);
    }, [item]);
    const index = item.$option.indexOf(item);
    item.$option.splice(index, 1);
    const element = item.$item;
    const failures = [];
    for (const cleanup of [() => this.inactivate(item), () => element?.remove(), () => this.render()]) {
      try {
        cleanup();
      } catch (error2) {
        if (error2 instanceof ResourceCleanupError)
          failures.push(...error2.errors);
        else
          failures.push(error2);
      }
    }
    if (failures.length)
      throw new ResourceCleanupError(failures);
    restoreFocus();
  }
  update(target) {
    return updateSetting(this, target);
  }
  add(item, option = this.option) {
    if (isClosing(this.art))
      return item;
    let registered = false;
    this.traverse((existing) => {
      registered || (registered = existing === item);
    });
    const index = option.length;
    const registration = registered ? void 0 : beginSettingAdd(item);
    let formatted = false;
    try {
      option.push(item);
      this.format();
      formatted = true;
      this.createItem(item);
      this.render();
    } catch (error2) {
      if (isClosing(this.art) || registration && !registration.current())
        throw error2;
      if (option[index] === item)
        option.splice(index, 1);
      if (!registered && formatted) {
        try {
          this.inactivate(item);
        } catch (cleanupError) {
          console.warn("ArtPlayer setting cleanup failed:", cleanupError);
        }
        item.$item?.remove();
      }
      throw error2;
    } finally {
      registration?.finish();
    }
    return item;
  }
  createHeader(item) {
    createSettingHeader(this, item);
  }
  createItem(item, isUpdate = false) {
    createSettingItem(this, item, isUpdate);
  }
  render(option = this.option) {
    renderSetting(this, option);
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
const css = ".art-video-player {\n  --art-theme: #f00;\n  --art-font-color: #fff;\n  --art-background-color: #000;\n  --art-text-shadow-color: rgba(0, 0, 0, 0.5);\n  --art-transition-duration: 0.2s;\n  --art-padding: 10px;\n  --art-border-radius: 3px;\n  --art-progress-height: 6px;\n  --art-progress-color: rgba(255, 255, 255, 0.25);\n  --art-progress-top-gap: 10px;\n  --art-hover-color: rgba(255, 255, 255, 0.25);\n  --art-loaded-color: rgba(255, 255, 255, 0.25);\n  --art-state-size: 80px;\n  --art-state-opacity: 0.8;\n  --art-bottom-height: 100px;\n  --art-bottom-offset: 20px;\n  --art-bottom-gap: 5px;\n  --art-highlight-width: 8px;\n  --art-highlight-color: rgba(255, 255, 255, 0.5);\n  --art-control-height: 46px;\n  --art-control-opacity: 0.75;\n  --art-control-icon-size: 36px;\n  --art-control-icon-scale: 1.1;\n  --art-volume-height: 120px;\n  --art-volume-handle-size: 14px;\n  --art-lock-size: 36px;\n  --art-indicator-scale: 0;\n  --art-indicator-size: 16px;\n  --art-fullscreen-web-index: 9999;\n  --art-settings-icon-size: 24px;\n  --art-settings-max-height: 300px;\n  --art-selector-max-height: 300px;\n  --art-contextmenus-min-width: 250px;\n  --art-subtitle-font-size: 20px;\n  --art-subtitle-gap: 5px;\n  --art-subtitle-bottom: 15px;\n  --art-subtitle-border: #000;\n  --art-widget-background: rgba(0, 0, 0, 0.85);\n  --art-tip-background: rgba(0, 0, 0, 0.7);\n  --art-scrollbar-size: 4px;\n  --art-scrollbar-background: rgba(255, 255, 255, 0.25);\n  --art-scrollbar-background-hover: rgba(255, 255, 255, 0.5);\n  --art-mini-progress-height: 2px;\n}\n.art-bg-cover {\n  background-position: center center;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n.art-bottom-gradient {\n  background-image: linear-gradient(to top, #000, rgba(0, 0, 0, 0.4), transparent);\n  background-repeat: repeat-x;\n  background-position: center bottom;\n}\n.art-backdrop-filter {\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n  backdrop-filter: saturate(180%) blur(20px);\n  background-color: rgba(0, 0, 0, 0.75) !important;\n}\n.art-truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.art-video-player {\n  position: relative;\n  margin: 0 auto;\n  width: 100%;\n  height: 100%;\n  outline: 0;\n  zoom: 1;\n  padding: 0;\n  text-align: left;\n  direction: ltr;\n  font-size: 14px;\n  line-height: 1.3;\n  user-select: none;\n  box-sizing: border-box;\n  color: var(--art-font-color);\n  background-color: var(--art-background-color);\n  text-shadow: 0 0 2px var(--art-text-shadow-color);\n  font-family: PingFang SC, Helvetica Neue, Microsoft YaHei, Roboto, Arial, sans-serif;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  -ms-touch-action: manipulation;\n  touch-action: manipulation;\n  -ms-high-contrast-adjust: none;\n}\n.art-video-player *,\n.art-video-player *::before,\n.art-video-player *::after {\n  box-sizing: border-box;\n}\n.art-video-player ::-webkit-scrollbar {\n  width: var(--art-scrollbar-size);\n  height: var(--art-scrollbar-size);\n}\n.art-video-player ::-webkit-scrollbar-thumb {\n  background-color: var(--art-scrollbar-background);\n}\n.art-video-player ::-webkit-scrollbar-thumb:hover {\n  background-color: var(--art-scrollbar-background-hover);\n}\n.art-video-player img {\n  max-width: 100%;\n  vertical-align: top;\n}\n.art-video-player svg {\n  fill: var(--art-font-color);\n}\n.art-video-player a {\n  color: var(--art-font-color);\n  text-decoration: none;\n}\n.art-icon {\n  line-height: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.art-video-player.art-backdrop .art-contextmenus,\n.art-video-player.art-backdrop .art-info,\n.art-video-player.art-backdrop .art-settings,\n.art-video-player.art-backdrop .art-layer-auto-playback,\n.art-video-player.art-backdrop .art-selector-list,\n.art-video-player.art-backdrop .art-volume-inner {\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n  backdrop-filter: saturate(180%) blur(20px);\n  background-color: rgba(0, 0, 0, 0.75) !important;\n}\n.art-video {\n  position: absolute;\n  inset: 0;\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n}\n.art-poster {\n  position: absolute;\n  inset: 0;\n  z-index: 11;\n  width: 100%;\n  height: 100%;\n  background-position: center center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  pointer-events: none;\n}\n.art-video-player .art-subtitle {\n  display: none;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  position: absolute;\n  z-index: 20;\n  width: 100%;\n  padding: 0 5%;\n  text-align: center;\n  pointer-events: none;\n  gap: var(--art-subtitle-gap);\n  bottom: var(--art-subtitle-bottom);\n  font-size: var(--art-subtitle-font-size);\n  transition: bottom var(--art-transition-duration) ease;\n  text-shadow: var(--art-subtitle-border) 1px 0 1px, var(--art-subtitle-border) 0 1px 1px, var(--art-subtitle-border) -1px 0 1px, var(--art-subtitle-border) 0 -1px 1px, var(--art-subtitle-border) 1px 1px 1px, var(--art-subtitle-border) -1px -1px 1px, var(--art-subtitle-border) 1px -1px 1px, var(--art-subtitle-border) -1px 1px 1px;\n}\n.art-video-player.art-subtitle-show .art-subtitle {\n  display: flex;\n}\n.art-video-player.art-control-show .art-subtitle {\n  bottom: calc(var(--art-controls-height, var(--art-control-height)) + var(--art-subtitle-bottom));\n}\n.art-danmuku {\n  position: absolute;\n  inset: 0;\n  z-index: 30;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  overflow: hidden;\n}\n.art-video-player .art-layers {\n  position: absolute;\n  inset: 0;\n  z-index: 40;\n  width: 100%;\n  height: 100%;\n  display: none;\n  pointer-events: none;\n}\n.art-video-player .art-layers .art-layer {\n  pointer-events: auto;\n}\n.art-video-player.art-layer-show .art-layers {\n  display: flex;\n}\n.art-video-player .art-mask {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  inset: 0;\n  z-index: 50;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.art-video-player .art-mask .art-state {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  opacity: 0;\n  transform: scale(2);\n  width: var(--art-state-size);\n  height: var(--art-state-size);\n  transition: all var(--art-transition-duration) ease;\n}\n.art-video-player.art-mask-show .art-state {\n  pointer-events: auto;\n  opacity: var(--art-state-opacity);\n  transform: scale(1);\n}\n.art-video-player.art-loading-show .art-state {\n  display: none;\n}\n.art-video-player .art-loading {\n  display: none;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  inset: 0;\n  z-index: 70;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.art-video-player.art-loading-show .art-loading {\n  display: flex;\n}\n.art-video-player.art-loading-show .art-mask {\n  display: none;\n}\n.art-video-player .art-bottom {\n  position: absolute;\n  inset: 0;\n  z-index: 60;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  opacity: 0;\n  overflow: hidden;\n  pointer-events: none;\n  padding: 0 var(--art-padding);\n  transition: all var(--art-transition-duration) ease;\n  background-size: 100% var(--art-bottom-height);\n  background-image: linear-gradient(to top, #000, rgba(0, 0, 0, 0.4), transparent);\n  background-repeat: repeat-x;\n  background-position: center bottom;\n}\n.art-video-player .art-bottom .art-controls,\n.art-video-player .art-bottom .art-progress {\n  transform: translateY(var(--art-bottom-offset));\n  transition: transform var(--art-transition-duration) ease;\n}\n.art-video-player.art-control-show .art-bottom,\n.art-video-player.art-hover .art-bottom {\n  opacity: 1;\n}\n.art-video-player.art-control-show .art-bottom .art-controls,\n.art-video-player.art-hover .art-bottom .art-controls,\n.art-video-player.art-control-show .art-bottom .art-progress,\n.art-video-player.art-hover .art-bottom .art-progress {\n  transform: translateY(0);\n}\n.art-bottom .art-progress {\n  position: relative;\n  z-index: 0;\n  cursor: pointer;\n  pointer-events: auto;\n  padding-top: var(--art-progress-top-gap);\n  padding-bottom: var(--art-bottom-gap);\n}\n.art-bottom .art-progress .art-control-progress {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: var(--art-progress-height);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner {\n  display: flex;\n  align-items: center;\n  position: relative;\n  height: 50%;\n  width: 100%;\n  transition: height var(--art-transition-duration) ease;\n  background-color: var(--art-progress-color);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-hover {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  width: 0%;\n  background-color: var(--art-hover-color);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-loaded {\n  position: absolute;\n  inset: 0;\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n  width: 0%;\n  background-color: var(--art-loaded-color);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-played {\n  position: absolute;\n  inset: 0;\n  z-index: 20;\n  width: 100%;\n  height: 100%;\n  width: 0%;\n  background-color: var(--art-theme);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight {\n  position: absolute;\n  inset: 0;\n  z-index: 30;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight span {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  right: auto;\n  pointer-events: auto;\n  width: var(--art-highlight-width) !important;\n  transform: translateX(calc(var(--art-highlight-width) / -2));\n  background-color: var(--art-highlight-color);\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  z-index: 40;\n  left: 0;\n  border-radius: 50%;\n  width: var(--art-indicator-size);\n  height: var(--art-indicator-size);\n  transform: scale(var(--art-indicator-scale));\n  margin-left: calc(var(--art-indicator-size) / -2);\n  transition: transform var(--art-transition-duration) ease;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator .art-icon {\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator:hover {\n  transform: scale(1.2) !important;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator:active {\n  transform: scale(1) !important;\n}\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip {\n  transform-origin: bottom center;\n  transform: scale(0.5);\n  opacity: 0;\n  position: absolute;\n  z-index: 50;\n  top: -25px;\n  left: 0;\n  padding: 3px 5px;\n  line-height: 1;\n  font-size: 12px;\n  border-radius: var(--art-border-radius);\n  white-space: nowrap;\n  background-color: var(--art-tip-background);\n  transition: transform var(--art-transition-duration) ease, opacity var(--art-transition-duration) ease;\n}\n.art-bottom .art-progress .art-control-thumbnails {\n  transform-origin: bottom center;\n  transform: scale(0.5);\n  opacity: 0;\n  position: absolute;\n  bottom: calc(var(--art-bottom-gap) + 10px);\n  left: 0;\n  border-radius: var(--art-border-radius);\n  pointer-events: none;\n  background-color: var(--art-widget-background);\n  transition: transform var(--art-transition-duration) ease, opacity var(--art-transition-duration) ease;\n  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2);\n}\n.art-bottom .art-progress:hover .art-control-progress .art-control-progress-inner {\n  height: 100%;\n}\n.art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  transform: scale(1);\n}\n.art-progress-hover .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip,\n.art-progress-hover .art-bottom .art-progress .art-control-thumbnails {\n  transform: scale(1);\n  opacity: 1;\n}\n.art-video-player .art-controls {\n  position: relative;\n  z-index: 10;\n  pointer-events: auto;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  flex-shrink: 0;\n  height: auto;\n  min-height: var(--art-control-height);\n}\n.art-video-player .art-controls .art-controls-left,\n.art-video-player .art-controls .art-controls-right {\n  display: flex;\n  flex-wrap: wrap;\n  max-width: 100%;\n  min-height: var(--art-control-height);\n}\n.art-video-player .art-controls .art-controls-center {\n  display: none;\n  justify-content: center;\n  align-items: center;\n  flex: 1;\n  height: 100%;\n  padding: 0 10px;\n}\n.art-video-player .art-controls .art-controls-right {\n  justify-content: flex-end;\n  margin-left: auto;\n}\n.art-video-player .art-controls .art-control {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-shrink: 0;\n  max-width: 100%;\n  cursor: pointer;\n  white-space: nowrap;\n  opacity: var(--art-control-opacity);\n  min-height: var(--art-control-height);\n  min-width: var(--art-control-height);\n  transition: opacity var(--art-transition-duration) ease;\n}\n.art-video-player .art-controls .art-control .art-icon {\n  height: var(--art-control-icon-size);\n  width: var(--art-control-icon-size);\n  transform: scale(var(--art-control-icon-scale));\n  transition: transform var(--art-transition-duration) ease;\n}\n.art-video-player .art-controls .art-control .art-icon:active {\n  transform: scale(calc(var(--art-control-icon-scale) * 0.8));\n}\n.art-video-player .art-controls .art-control:hover {\n  opacity: 1;\n}\n.art-control-volume {\n  position: relative;\n}\n.art-control-volume .art-volume-panel {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  left: 0;\n  right: 0;\n  padding: 0 5px;\n  font-size: 12px;\n  text-align: center;\n  cursor: default;\n  opacity: 0;\n  visibility: hidden;\n  transform: translateY(10px);\n  pointer-events: none;\n  bottom: var(--art-control-height);\n  width: var(--art-control-height);\n  height: var(--art-volume-height);\n  transition: opacity var(--art-transition-duration) ease, transform var(--art-transition-duration) ease;\n}\n.art-control-volume .art-volume-panel .art-volume-inner {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n  height: 100%;\n  width: 100%;\n  padding: 10px 0 12px;\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-widget-background);\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider {\n  flex: 1;\n  width: 100%;\n  display: flex;\n  cursor: pointer;\n  position: relative;\n  justify-content: center;\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-handle {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  width: 2px;\n  border-radius: var(--art-border-radius);\n  overflow: hidden;\n  background-color: rgba(255, 255, 255, 0.25);\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-handle .art-volume-loaded {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  background-color: var(--art-theme);\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-indicator {\n  position: absolute;\n  width: var(--art-volume-handle-size);\n  height: var(--art-volume-handle-size);\n  margin-top: calc(var(--art-volume-handle-size) / -2);\n  flex-shrink: 0;\n  transform: scale(1);\n  border-radius: 100%;\n  background-color: var(--art-theme);\n  transition: transform var(--art-transition-duration) ease;\n}\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider:active .art-volume-indicator {\n  transform: scale(0.9);\n}\n.art-control-volume:hover .art-volume-panel,\n.art-control-volume:focus-within .art-volume-panel {\n  opacity: 1;\n  visibility: visible;\n  transform: translateY(0);\n  pointer-events: auto;\n}\n.art-video-player .art-notice {\n  display: none;\n  position: absolute;\n  inset: 0;\n  z-index: 80;\n  width: 100%;\n  height: 100%;\n  height: auto;\n  bottom: auto;\n  padding: var(--art-padding);\n  pointer-events: none;\n}\n.art-video-player .art-notice .art-notice-inner {\n  display: inline-flex;\n  padding: 5px;\n  line-height: 1;\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-tip-background);\n}\n.art-video-player.art-notice-show .art-notice {\n  display: flex;\n}\n.art-video-player .art-contextmenus {\n  display: none;\n  flex-direction: column;\n  position: absolute;\n  z-index: 120;\n  padding: 5px 0;\n  border-radius: var(--art-border-radius);\n  font-size: 12px;\n  background-color: var(--art-widget-background);\n  min-width: var(--art-contextmenus-min-width);\n}\n.art-video-player .art-contextmenus .art-contextmenu {\n  cursor: pointer;\n  display: flex;\n  padding: 10px 15px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n.art-video-player .art-contextmenus .art-contextmenu span {\n  padding: 0 8px;\n}\n.art-video-player .art-contextmenus .art-contextmenu span:hover,\n.art-video-player .art-contextmenus .art-contextmenu span.art-current {\n  color: var(--art-theme);\n}\n.art-video-player .art-contextmenus .art-contextmenu:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.art-video-player .art-contextmenus .art-contextmenu:last-child {\n  border-bottom: none;\n}\n.art-video-player.art-contextmenu-show .art-contextmenus {\n  display: flex;\n}\n.art-video-player .art-settings {\n  display: none;\n  flex-direction: column;\n  position: absolute;\n  z-index: 90;\n  left: auto;\n  overflow-y: auto;\n  overflow-x: hidden;\n  border-radius: var(--art-border-radius);\n  max-height: var(--art-settings-max-height);\n  right: var(--art-padding);\n  bottom: var(--art-controls-height, var(--art-control-height));\n  transition: all var(--art-transition-duration) ease;\n  background-color: var(--art-widget-background);\n}\n.art-video-player .art-settings .art-setting-panel {\n  display: none;\n  flex-direction: column;\n}\n.art-video-player .art-settings .art-setting-panel.art-current {\n  display: flex;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 5px;\n  padding: 0 5px;\n  cursor: pointer;\n  overflow: hidden;\n  transition: background-color var(--art-transition-duration) ease;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current {\n  color: var(--art-theme);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon-check {\n  visibility: hidden;\n  height: 15px;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current .art-icon-check {\n  visibility: visible;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-shrink: 1;\n  min-width: 0;\n  overflow: hidden;\n  gap: 5px;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left .art-setting-item-left-icon {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-shrink: 0;\n  height: var(--art-settings-icon-size);\n  width: var(--art-settings-icon-size);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left .art-setting-item-left-text {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-shrink: 0;\n  min-width: 0;\n  max-width: 55%;\n  gap: 5px;\n  font-size: 12px;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-tooltip {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: rgba(255, 255, 255, 0.5);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-icon {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-shrink: 0;\n  min-width: 32px;\n  height: 24px;\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-range {\n  height: 3px;\n  width: 80px;\n  outline: none;\n  appearance: none;\n  background-color: rgba(255, 255, 255, 0.2);\n}\n.art-video-player .art-settings .art-setting-panel .art-setting-item-back {\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n.art-video-player.art-setting-show .art-settings {\n  display: flex;\n}\n.art-video-player .art-info {\n  display: none;\n  position: absolute;\n  left: var(--art-padding);\n  top: var(--art-padding);\n  z-index: 100;\n  padding: 10px;\n  font-size: 12px;\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-widget-background);\n}\n.art-video-player .art-info .art-info-panel {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n.art-video-player .art-info .art-info-panel .art-info-item {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n.art-video-player .art-info .art-info-panel .art-info-item .art-info-title {\n  width: 100px;\n  text-align: right;\n}\n.art-video-player .art-info .art-info-panel .art-info-item .art-info-content {\n  width: 250px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  user-select: all;\n}\n.art-video-player .art-info .art-info-close {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  cursor: pointer;\n}\n.art-video-player.art-info-show .art-info {\n  display: flex;\n}\n.art-hide-cursor * {\n  cursor: none !important;\n}\n.art-video-player[data-aspect-ratio] {\n  overflow: hidden;\n}\n.art-video-player[data-aspect-ratio] .art-video {\n  object-fit: fill;\n  box-sizing: content-box;\n}\n.art-fullscreen {\n  --art-progress-height: 8px;\n  --art-indicator-size: 20px;\n  --art-control-height: 60px;\n  --art-control-icon-scale: 1.3;\n}\n.art-fullscreen-web {\n  --art-progress-height: 8px;\n  --art-indicator-size: 20px;\n  --art-control-height: 60px;\n  --art-control-icon-scale: 1.3;\n  position: fixed;\n  inset: 0;\n  z-index: var(--art-fullscreen-web-index);\n  width: 100%;\n  height: 100%;\n}\n.art-mini-popup {\n  position: fixed;\n  z-index: 9999;\n  width: 320px;\n  height: 180px;\n  max-width: 100vw;\n  max-height: 100vh;\n  background: #000;\n  border-radius: var(--art-border-radius);\n  cursor: move;\n  user-select: none;\n  overflow: hidden;\n  transition: opacity 0.2s ease;\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);\n}\n.art-mini-popup svg {\n  fill: #fff;\n}\n.art-mini-popup .art-video {\n  pointer-events: none;\n}\n.art-mini-popup .art-mini-close {\n  position: absolute;\n  z-index: 20;\n  right: 10px;\n  top: 10px;\n  cursor: pointer;\n  opacity: 0;\n  transition: opacity 0.2s ease;\n}\n.art-mini-popup .art-mini-state {\n  position: absolute;\n  inset: 0;\n  z-index: 30;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 0.2s ease;\n  background-color: rgba(0, 0, 0, 0.25);\n}\n.art-mini-popup .art-mini-state .art-icon {\n  opacity: 0.75;\n  cursor: pointer;\n  transform: scale(3);\n  pointer-events: auto;\n  transition: transform 0.2s ease;\n}\n.art-mini-popup .art-mini-state .art-icon:active {\n  transform: scale(2.5);\n}\n.art-mini-popup.art-mini-dragging {\n  opacity: 0.9;\n}\n.art-mini-popup:hover .art-mini-close,\n.art-mini-popup:focus-within .art-mini-close,\n.art-mini-popup:hover .art-mini-state,\n.art-mini-popup:focus-within .art-mini-state {\n  opacity: 1;\n}\n.art-mini-popup [role='button']:focus-visible {\n  outline: 2px solid #fff;\n  outline-offset: -2px;\n}\n.art-video-player[data-flip='horizontal'] .art-video {\n  transform: scaleX(-1);\n}\n.art-video-player[data-flip='vertical'] .art-video {\n  transform: scaleY(-1);\n}\n.art-video-player .art-layer-lock {\n  display: none;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  top: 50%;\n  border-radius: 50%;\n  transform: translateY(-50%);\n  height: var(--art-lock-size);\n  width: var(--art-lock-size);\n  left: var(--art-padding);\n  background-color: var(--art-tip-background);\n}\n.art-video-player .art-layer-auto-playback {\n  display: none;\n  gap: 10px;\n  align-items: center;\n  position: absolute;\n  border-radius: var(--art-border-radius);\n  padding: 10px;\n  line-height: 1;\n  left: var(--art-padding);\n  bottom: calc(var(--art-controls-height, var(--art-control-height)) + var(--art-bottom-gap) + 10px);\n  background-color: var(--art-widget-background);\n}\n.art-video-player .art-layer-auto-playback .art-auto-playback-close {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n}\n.art-video-player .art-layer-auto-playback .art-auto-playback-close svg {\n  width: 15px;\n  height: 15px;\n  fill: var(--art-theme);\n}\n.art-video-player .art-layer-auto-playback .art-auto-playback-jump {\n  color: var(--art-theme);\n  cursor: pointer;\n}\n.art-video-player.art-lock .art-layer-lock {\n  display: flex;\n}\n.art-video-player.art-lock:not(.art-control-show) .art-layer-lock {\n  opacity: 0;\n  pointer-events: none;\n}\n.art-video-player.art-lock:not(.art-control-show) .art-layer-lock:focus-within {\n  opacity: 1;\n  pointer-events: auto;\n}\n.art-video-player.art-lock .art-subtitle {\n  bottom: var(--art-subtitle-bottom) !important;\n}\n.art-video-player.art-mini-progress-bar .art-bottom,\n.art-video-player.art-lock .art-bottom {\n  opacity: 1;\n  padding: 0;\n  background-image: none;\n}\n.art-video-player.art-mini-progress-bar .art-bottom .art-controls,\n.art-video-player.art-lock .art-bottom .art-controls,\n.art-video-player.art-mini-progress-bar .art-bottom .art-progress,\n.art-video-player.art-lock .art-bottom .art-progress {\n  transform: translateY(calc(var(--art-controls-height, var(--art-control-height)) + var(--art-bottom-gap) + var(--art-progress-height) / 4));\n}\n.art-video-player.art-mini-progress-bar .art-bottom .art-progress-indicator,\n.art-video-player.art-lock .art-bottom .art-progress-indicator {\n  display: none !important;\n}\n.art-video-player.art-control-show .art-layer-lock {\n  display: flex;\n}\n.art-control-selector {\n  position: relative;\n  display: flex;\n  justify-content: center;\n}\n.art-control-selector .art-selector-list {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  position: absolute;\n  border-radius: var(--art-border-radius);\n  overflow-y: auto;\n  overflow-x: hidden;\n  opacity: 0;\n  visibility: hidden;\n  transform: translateY(10px);\n  pointer-events: none;\n  bottom: var(--art-control-height);\n  max-height: var(--art-selector-max-height);\n  background-color: var(--art-widget-background);\n  transition: opacity var(--art-transition-duration) ease, transform var(--art-transition-duration) ease;\n}\n.art-control-selector .art-selector-list .art-selector-item {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  padding: 10px 15px;\n  flex-shrink: 0;\n  line-height: 1;\n}\n.art-control-selector .art-selector-list .art-selector-item:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.art-control-selector .art-selector-list .art-selector-item:hover,\n.art-control-selector .art-selector-list .art-selector-item.art-current {\n  color: var(--art-theme);\n}\n.art-control-selector:hover:not(.art-selector-dismissed) .art-selector-list,\n.art-control-selector.art-selector-open .art-selector-list {\n  opacity: 1;\n  visibility: visible;\n  transform: translateY(0);\n  pointer-events: auto;\n}\n.art-video-player {\n  /*! Hint.css - v2.7.0 - 2021-10-01\n    * https://kushagra.dev/lab/hint/\n    * Copyright (c) 2021 Kushagra Gour */\n  /*-------------------------------------*\\\n        HINT.css - A CSS tooltip library\n    \\*-------------------------------------*/\n  /**\n    * HINT.css is a tooltip library made in pure CSS.\n    *\n    * Source: https://github.com/chinchang/hint.css\n    * Demo: http://kushagragour.in/lab/hint/\n    *\n    */\n  /**\n    * source: hint-core.scss\n    *\n    * Defines the basic styling for the tooltip.\n    * Each tooltip is made of 2 parts:\n    * 	1) body (:after)\n    * 	2) arrow (:before)\n    *\n    * Classes added:\n    * 	1) hint\n    */\n  /**\n    * source: hint-position.scss\n    *\n    * Defines the positoning logic for the tooltips.\n    *\n    * Classes added:\n    * 	1) hint--top\n    * 	2) hint--bottom\n    * 	3) hint--left\n    * 	4) hint--right\n    */\n  /**\n    * set default color for tooltip arrows\n    */\n  /**\n    * top tooltip\n    */\n  /**\n    * bottom tooltip\n    */\n  /**\n    * right tooltip\n    */\n  /**\n    * left tooltip\n    */\n  /**\n    * top-left tooltip\n    */\n  /**\n    * top-right tooltip\n    */\n  /**\n    * bottom-left tooltip\n    */\n  /**\n    * bottom-right tooltip\n    */\n  /**\n    * source: hint-sizes.scss\n    *\n    * Defines width restricted tooltips that can span\n    * across multiple lines.\n    *\n    * Classes added:\n    * 	1) hint--small\n    * 	2) hint--medium\n    * 	3) hint--large\n    *\n    */\n  /**\n    * source: hint-theme.scss\n    *\n    * Defines basic theme for tooltips.\n    *\n    */\n  /**\n    * source: hint-color-types.scss\n    *\n    * Contains tooltips of various types based on color differences.\n    *\n    * Classes added:\n    * 	1) hint--error\n    * 	2) hint--warning\n    * 	3) hint--info\n    * 	4) hint--success\n    *\n    */\n  /**\n    * Error\n    */\n  /**\n    * Warning\n    */\n  /**\n    * Info\n    */\n  /**\n    * Success\n    */\n  /**\n    * source: hint-always.scss\n    *\n    * Defines a persisted tooltip which shows always.\n    *\n    * Classes added:\n    * 	1) hint--always\n    *\n    */\n  /**\n    * source: hint-rounded.scss\n    *\n    * Defines rounded corner tooltips.\n    *\n    * Classes added:\n    * 	1) hint--rounded\n    *\n    */\n  /**\n    * source: hint-effects.scss\n    *\n    * Defines various transition effects for the tooltips.\n    *\n    * Classes added:\n    * 	1) hint--no-animate\n    * 	2) hint--bounce\n    *\n    */\n}\n.art-video-player [class*='hint--'] {\n  position: relative;\n  display: inline-block;\n  font-style: normal;\n  /**\n        * tooltip arrow\n        */\n  /**\n        * tooltip body\n        */\n}\n.art-video-player [class*='hint--']:before,\n.art-video-player [class*='hint--']:after {\n  position: absolute;\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  visibility: hidden;\n  opacity: 0;\n  z-index: 1000000;\n  pointer-events: none;\n  -webkit-transition: 0.3s ease;\n  -moz-transition: 0.3s ease;\n  transition: 0.3s ease;\n  -webkit-transition-delay: 0ms;\n  -moz-transition-delay: 0ms;\n  transition-delay: 0ms;\n}\n.art-video-player [class*='hint--']:hover:before,\n.art-video-player [class*='hint--']:hover:after {\n  visibility: visible;\n  opacity: 1;\n}\n.art-video-player [class*='hint--']:hover:before,\n.art-video-player [class*='hint--']:hover:after {\n  -webkit-transition-delay: 100ms;\n  -moz-transition-delay: 100ms;\n  transition-delay: 100ms;\n}\n.art-video-player [class*='hint--']:before {\n  content: '';\n  position: absolute;\n  background: transparent;\n  border: 6px solid transparent;\n  z-index: 1000001;\n}\n.art-video-player [class*='hint--']:after {\n  background: #000000;\n  color: white;\n  padding: 8px 10px;\n  font-size: 12px;\n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  line-height: 12px;\n  white-space: nowrap;\n}\n.art-video-player [class*='hint--'][aria-label]:after {\n  content: attr(aria-label);\n}\n.art-video-player [class*='hint--'][data-hint]:after {\n  content: attr(data-hint);\n}\n.art-video-player [aria-label='']:before,\n.art-video-player [aria-label='']:after,\n.art-video-player [data-hint='']:before,\n.art-video-player [data-hint='']:after {\n  display: none !important;\n}\n.art-video-player .hint--top-left:before {\n  border-top-color: #000000;\n}\n.art-video-player .hint--top-right:before {\n  border-top-color: #000000;\n}\n.art-video-player .hint--top:before {\n  border-top-color: #000000;\n}\n.art-video-player .hint--bottom-left:before {\n  border-bottom-color: #000000;\n}\n.art-video-player .hint--bottom-right:before {\n  border-bottom-color: #000000;\n}\n.art-video-player .hint--bottom:before {\n  border-bottom-color: #000000;\n}\n.art-video-player .hint--left:before {\n  border-left-color: #000000;\n}\n.art-video-player .hint--right:before {\n  border-right-color: #000000;\n}\n.art-video-player .hint--top:before {\n  margin-bottom: -11px;\n}\n.art-video-player .hint--top:before,\n.art-video-player .hint--top:after {\n  bottom: 100%;\n  left: 50%;\n}\n.art-video-player .hint--top:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--top:after {\n  -webkit-transform: translateX(-50%);\n  -moz-transform: translateX(-50%);\n  transform: translateX(-50%);\n}\n.art-video-player .hint--top:hover:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--top:hover:after {\n  -webkit-transform: translateX(-50%) translateY(-8px);\n  -moz-transform: translateX(-50%) translateY(-8px);\n  transform: translateX(-50%) translateY(-8px);\n}\n.art-video-player .hint--bottom:before {\n  margin-top: -11px;\n}\n.art-video-player .hint--bottom:before,\n.art-video-player .hint--bottom:after {\n  top: 100%;\n  left: 50%;\n}\n.art-video-player .hint--bottom:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--bottom:after {\n  -webkit-transform: translateX(-50%);\n  -moz-transform: translateX(-50%);\n  transform: translateX(-50%);\n}\n.art-video-player .hint--bottom:hover:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--bottom:hover:after {\n  -webkit-transform: translateX(-50%) translateY(8px);\n  -moz-transform: translateX(-50%) translateY(8px);\n  transform: translateX(-50%) translateY(8px);\n}\n.art-video-player .hint--right:before {\n  margin-left: -11px;\n  margin-bottom: -6px;\n}\n.art-video-player .hint--right:after {\n  margin-bottom: -14px;\n}\n.art-video-player .hint--right:before,\n.art-video-player .hint--right:after {\n  left: 100%;\n  bottom: 50%;\n}\n.art-video-player .hint--right:hover:before {\n  -webkit-transform: translateX(8px);\n  -moz-transform: translateX(8px);\n  transform: translateX(8px);\n}\n.art-video-player .hint--right:hover:after {\n  -webkit-transform: translateX(8px);\n  -moz-transform: translateX(8px);\n  transform: translateX(8px);\n}\n.art-video-player .hint--left:before {\n  margin-right: -11px;\n  margin-bottom: -6px;\n}\n.art-video-player .hint--left:after {\n  margin-bottom: -14px;\n}\n.art-video-player .hint--left:before,\n.art-video-player .hint--left:after {\n  right: 100%;\n  bottom: 50%;\n}\n.art-video-player .hint--left:hover:before {\n  -webkit-transform: translateX(-8px);\n  -moz-transform: translateX(-8px);\n  transform: translateX(-8px);\n}\n.art-video-player .hint--left:hover:after {\n  -webkit-transform: translateX(-8px);\n  -moz-transform: translateX(-8px);\n  transform: translateX(-8px);\n}\n.art-video-player .hint--top-left:before {\n  margin-bottom: -11px;\n}\n.art-video-player .hint--top-left:before,\n.art-video-player .hint--top-left:after {\n  bottom: 100%;\n  left: 50%;\n}\n.art-video-player .hint--top-left:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--top-left:after {\n  -webkit-transform: translateX(-100%);\n  -moz-transform: translateX(-100%);\n  transform: translateX(-100%);\n}\n.art-video-player .hint--top-left:after {\n  margin-left: 12px;\n}\n.art-video-player .hint--top-left:hover:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--top-left:hover:after {\n  -webkit-transform: translateX(-100%) translateY(-8px);\n  -moz-transform: translateX(-100%) translateY(-8px);\n  transform: translateX(-100%) translateY(-8px);\n}\n.art-video-player .hint--top-right:before {\n  margin-bottom: -11px;\n}\n.art-video-player .hint--top-right:before,\n.art-video-player .hint--top-right:after {\n  bottom: 100%;\n  left: 50%;\n}\n.art-video-player .hint--top-right:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--top-right:after {\n  -webkit-transform: translateX(0);\n  -moz-transform: translateX(0);\n  transform: translateX(0);\n}\n.art-video-player .hint--top-right:after {\n  margin-left: -12px;\n}\n.art-video-player .hint--top-right:hover:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--top-right:hover:after {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--bottom-left:before {\n  margin-top: -11px;\n}\n.art-video-player .hint--bottom-left:before,\n.art-video-player .hint--bottom-left:after {\n  top: 100%;\n  left: 50%;\n}\n.art-video-player .hint--bottom-left:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--bottom-left:after {\n  -webkit-transform: translateX(-100%);\n  -moz-transform: translateX(-100%);\n  transform: translateX(-100%);\n}\n.art-video-player .hint--bottom-left:after {\n  margin-left: 12px;\n}\n.art-video-player .hint--bottom-left:hover:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--bottom-left:hover:after {\n  -webkit-transform: translateX(-100%) translateY(8px);\n  -moz-transform: translateX(-100%) translateY(8px);\n  transform: translateX(-100%) translateY(8px);\n}\n.art-video-player .hint--bottom-right:before {\n  margin-top: -11px;\n}\n.art-video-player .hint--bottom-right:before,\n.art-video-player .hint--bottom-right:after {\n  top: 100%;\n  left: 50%;\n}\n.art-video-player .hint--bottom-right:before {\n  left: calc(50% - 6px);\n}\n.art-video-player .hint--bottom-right:after {\n  -webkit-transform: translateX(0);\n  -moz-transform: translateX(0);\n  transform: translateX(0);\n}\n.art-video-player .hint--bottom-right:after {\n  margin-left: -12px;\n}\n.art-video-player .hint--bottom-right:hover:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--bottom-right:hover:after {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--small:after,\n.art-video-player .hint--medium:after,\n.art-video-player .hint--large:after {\n  white-space: normal;\n  line-height: 1.4em;\n  word-wrap: break-word;\n}\n.art-video-player .hint--small:after {\n  width: 80px;\n}\n.art-video-player .hint--medium:after {\n  width: 150px;\n}\n.art-video-player .hint--large:after {\n  width: 300px;\n}\n.art-video-player [class*='hint--'] {\n  /**\n        * tooltip body\n        */\n}\n.art-video-player [class*='hint--']:after {\n  text-shadow: 0 -1px 0px black;\n  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);\n}\n.art-video-player .hint--error:after {\n  background-color: #b34e4d;\n  text-shadow: 0 -1px 0px #592726;\n}\n.art-video-player .hint--error.hint--top-left:before {\n  border-top-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--top-right:before {\n  border-top-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--top:before {\n  border-top-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--bottom-left:before {\n  border-bottom-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--bottom-right:before {\n  border-bottom-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--bottom:before {\n  border-bottom-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--left:before {\n  border-left-color: #b34e4d;\n}\n.art-video-player .hint--error.hint--right:before {\n  border-right-color: #b34e4d;\n}\n.art-video-player .hint--warning:after {\n  background-color: #c09854;\n  text-shadow: 0 -1px 0px #6c5328;\n}\n.art-video-player .hint--warning.hint--top-left:before {\n  border-top-color: #c09854;\n}\n.art-video-player .hint--warning.hint--top-right:before {\n  border-top-color: #c09854;\n}\n.art-video-player .hint--warning.hint--top:before {\n  border-top-color: #c09854;\n}\n.art-video-player .hint--warning.hint--bottom-left:before {\n  border-bottom-color: #c09854;\n}\n.art-video-player .hint--warning.hint--bottom-right:before {\n  border-bottom-color: #c09854;\n}\n.art-video-player .hint--warning.hint--bottom:before {\n  border-bottom-color: #c09854;\n}\n.art-video-player .hint--warning.hint--left:before {\n  border-left-color: #c09854;\n}\n.art-video-player .hint--warning.hint--right:before {\n  border-right-color: #c09854;\n}\n.art-video-player .hint--info:after {\n  background-color: #3986ac;\n  text-shadow: 0 -1px 0px #1a3c4d;\n}\n.art-video-player .hint--info.hint--top-left:before {\n  border-top-color: #3986ac;\n}\n.art-video-player .hint--info.hint--top-right:before {\n  border-top-color: #3986ac;\n}\n.art-video-player .hint--info.hint--top:before {\n  border-top-color: #3986ac;\n}\n.art-video-player .hint--info.hint--bottom-left:before {\n  border-bottom-color: #3986ac;\n}\n.art-video-player .hint--info.hint--bottom-right:before {\n  border-bottom-color: #3986ac;\n}\n.art-video-player .hint--info.hint--bottom:before {\n  border-bottom-color: #3986ac;\n}\n.art-video-player .hint--info.hint--left:before {\n  border-left-color: #3986ac;\n}\n.art-video-player .hint--info.hint--right:before {\n  border-right-color: #3986ac;\n}\n.art-video-player .hint--success:after {\n  background-color: #458746;\n  text-shadow: 0 -1px 0px #1a321a;\n}\n.art-video-player .hint--success.hint--top-left:before {\n  border-top-color: #458746;\n}\n.art-video-player .hint--success.hint--top-right:before {\n  border-top-color: #458746;\n}\n.art-video-player .hint--success.hint--top:before {\n  border-top-color: #458746;\n}\n.art-video-player .hint--success.hint--bottom-left:before {\n  border-bottom-color: #458746;\n}\n.art-video-player .hint--success.hint--bottom-right:before {\n  border-bottom-color: #458746;\n}\n.art-video-player .hint--success.hint--bottom:before {\n  border-bottom-color: #458746;\n}\n.art-video-player .hint--success.hint--left:before {\n  border-left-color: #458746;\n}\n.art-video-player .hint--success.hint--right:before {\n  border-right-color: #458746;\n}\n.art-video-player .hint--always:after,\n.art-video-player .hint--always:before {\n  opacity: 1;\n  visibility: visible;\n}\n.art-video-player .hint--always.hint--top:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--always.hint--top:after {\n  -webkit-transform: translateX(-50%) translateY(-8px);\n  -moz-transform: translateX(-50%) translateY(-8px);\n  transform: translateX(-50%) translateY(-8px);\n}\n.art-video-player .hint--always.hint--top-left:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--always.hint--top-left:after {\n  -webkit-transform: translateX(-100%) translateY(-8px);\n  -moz-transform: translateX(-100%) translateY(-8px);\n  transform: translateX(-100%) translateY(-8px);\n}\n.art-video-player .hint--always.hint--top-right:before {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--always.hint--top-right:after {\n  -webkit-transform: translateY(-8px);\n  -moz-transform: translateY(-8px);\n  transform: translateY(-8px);\n}\n.art-video-player .hint--always.hint--bottom:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom:after {\n  -webkit-transform: translateX(-50%) translateY(8px);\n  -moz-transform: translateX(-50%) translateY(8px);\n  transform: translateX(-50%) translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom-left:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom-left:after {\n  -webkit-transform: translateX(-100%) translateY(8px);\n  -moz-transform: translateX(-100%) translateY(8px);\n  transform: translateX(-100%) translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom-right:before {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--always.hint--bottom-right:after {\n  -webkit-transform: translateY(8px);\n  -moz-transform: translateY(8px);\n  transform: translateY(8px);\n}\n.art-video-player .hint--always.hint--left:before {\n  -webkit-transform: translateX(-8px);\n  -moz-transform: translateX(-8px);\n  transform: translateX(-8px);\n}\n.art-video-player .hint--always.hint--left:after {\n  -webkit-transform: translateX(-8px);\n  -moz-transform: translateX(-8px);\n  transform: translateX(-8px);\n}\n.art-video-player .hint--always.hint--right:before {\n  -webkit-transform: translateX(8px);\n  -moz-transform: translateX(8px);\n  transform: translateX(8px);\n}\n.art-video-player .hint--always.hint--right:after {\n  -webkit-transform: translateX(8px);\n  -moz-transform: translateX(8px);\n  transform: translateX(8px);\n}\n.art-video-player .hint--rounded:after {\n  border-radius: 4px;\n}\n.art-video-player .hint--no-animate:before,\n.art-video-player .hint--no-animate:after {\n  -webkit-transition-duration: 0ms;\n  -moz-transition-duration: 0ms;\n  transition-duration: 0ms;\n}\n.art-video-player .hint--bounce:before,\n.art-video-player .hint--bounce:after {\n  -webkit-transition: opacity 0.3s ease, visibility 0.3s ease, -webkit-transform 0.3s cubic-bezier(0.71, 1.7, 0.77, 1.24);\n  -moz-transition: opacity 0.3s ease, visibility 0.3s ease, -moz-transform 0.3s cubic-bezier(0.71, 1.7, 0.77, 1.24);\n  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s cubic-bezier(0.71, 1.7, 0.77, 1.24);\n}\n.art-video-player .hint--no-shadow:before,\n.art-video-player .hint--no-shadow:after {\n  text-shadow: initial;\n  box-shadow: initial;\n}\n.art-video-player .hint--no-arrow:before {\n  display: none;\n}\n.art-video-player.art-mobile {\n  --art-bottom-gap: 10px;\n  --art-control-height: 38px;\n  --art-control-icon-scale: 1;\n  --art-state-size: 60px;\n  --art-settings-max-height: 180px;\n  --art-selector-max-height: 180px;\n  --art-indicator-scale: 1;\n  --art-control-opacity: 1;\n}\n.art-video-player.art-mobile .art-controls-left {\n  margin-left: calc(var(--art-padding) / -1);\n}\n.art-video-player.art-mobile .art-controls-right {\n  margin-right: calc(var(--art-padding) / -1);\n}\n.art-video-player [tabindex]:focus-visible,\n.art-video-player input:focus-visible,\n.art-video-player button:focus-visible,\n.art-video-player a:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: -2px;\n}\n.art-video-player.art-keyboard-focus :focus {\n  outline: 2px solid currentColor;\n  outline-offset: -2px;\n}\n.art-video-player.art-keyboard-focus:not(.art-lock) .art-bottom {\n  opacity: 1;\n}\n.art-video-player.art-keyboard-focus:not(.art-lock) .art-bottom .art-controls,\n.art-video-player.art-keyboard-focus:not(.art-lock) .art-bottom .art-progress {\n  transform: translateY(0);\n}\n";
function parseSubtitle(buffer, option) {
  const text = new TextDecoder(option.encoding).decode(buffer);
  switch (option.type || getExt(option.url)) {
    case "srt":
      return { vtt: option.onVttLoad(srtToVtt(text)) };
    case "ass":
      return { vtt: option.onVttLoad(assToVtt(text)) };
    case "vtt":
      return { vtt: option.onVttLoad(text) };
    default:
      return void 0;
  }
}
class SubtitleRequest {
  constructor(parent) {
    this.scope = parent.child();
    this.cancelled = new Promise((resolve) => {
      this.scope.add(() => {
        resolve(void 0);
      });
    });
    this.signal = requestController(this.scope)?.signal;
  }
  get active() {
    return !this.scope.closed;
  }
  cancel() {
    this.scope.dispose();
  }
  async run(work) {
    if (!this.active)
      return void 0;
    try {
      return await Promise.race([work(), this.cancelled]);
    } finally {
      this.cancel();
    }
  }
}
const states = /* @__PURE__ */ new WeakMap();
function initSubtitleState(subtitle, art) {
  const scope = getScope(art).child();
  const state2 = { scope, revision: 0, render: 0, trackRevision: 0 };
  states.set(subtitle, state2);
  scope.add(() => {
    releaseSubtitleURL(state2);
  });
  return state2;
}
function subtitleState(subtitle) {
  return states.get(subtitle);
}
function beginSubtitleRequest(state2) {
  const previous = state2.request;
  const request = new SubtitleRequest(state2.scope);
  state2.request = request;
  state2.revision += 1;
  previous?.cancel();
  return request;
}
function releaseSubtitleURL(state2) {
  const url = state2.ownedURL;
  state2.ownedURL = void 0;
  if (url)
    URL.revokeObjectURL(url);
}
function renderSubtitle(subtitle) {
  const state2 = subtitleState(subtitle);
  if (state2.scope.closed)
    return;
  const revision = state2.revision;
  const render = ++state2.render;
  const active2 = () => !state2.scope.closed && state2.revision === revision && state2.render === render;
  const { art } = subtitle;
  const { $subtitle } = art.template;
  $subtitle.innerHTML = "";
  if (!subtitle.activeCues.length)
    return;
  art.emit("subtitleBeforeUpdate", subtitle.activeCues);
  if (!active2())
    return;
  const html2 = subtitle.activeCues.map((cue, index) => cue.text.split(/\r?\n/).filter((line) => line.trim()).map((line) => `<div class="art-subtitle-line" data-group="${index}">
                                ${art.option.subtitle.escape ? escape(line) : line}
                            </div>`).join("")).join("");
  if (!active2())
    return;
  $subtitle.innerHTML = html2;
  art.emit("subtitleAfterUpdate", subtitle.activeCues);
}
function replaceSubtitleTrack(subtitle, kind, url) {
  const state2 = subtitleState(subtitle);
  if (state2.scope.closed)
    return;
  const revision = ++state2.trackRevision;
  const { art } = subtitle;
  const { template } = art;
  const previous = template.$track;
  const parent = previous.parentNode;
  const next = previous.nextSibling;
  const track = document.createElement("track");
  const scope = state2.scope.child();
  scope.add(() => {
    track.onload = null;
    track.onerror = null;
  });
  let committed = false;
  try {
    track.default = true;
    track.kind = kind;
    track.src = url;
    track.label = art.option.subtitle.name || "Artplayer";
    track.track.mode = "hidden";
    track.onload = () => {
      if (!scope.closed && template.$track === track)
        art.emit("subtitleLoad", subtitle.cues, subtitle.option);
    };
    track.onerror = () => {
      if (!scope.closed && template.$track === track)
        art.notice.show = new Error("Failed to load subtitle track");
    };
    if (scope.closed || state2.trackRevision !== revision) {
      scope.dispose();
      return;
    }
    previous.remove();
    template.$video.appendChild(track);
    template.$track = track;
    const textTrack = subtitle.textTrack;
    const cleanup = textTrack ? art.proxy(textTrack, "cuechange", () => {
      if (!scope.closed && template.$track === track)
        subtitle.update();
    }) : () => {
    };
    scope.add(() => {
      art.events.remove(cleanup);
    });
    if (scope.closed || state2.trackRevision !== revision) {
      scope.dispose();
      track.remove();
      return;
    }
    const previousScope = state2.track;
    state2.track = scope;
    subtitle.destroyEvent = cleanup;
    previous.onload = null;
    previous.onerror = null;
    committed = true;
    try {
      previousScope?.dispose();
    } finally {
      if (state2.ownedURL && state2.ownedURL !== url)
        releaseSubtitleURL(state2);
    }
  } catch (error2) {
    if (committed)
      throw error2;
    scope.dispose();
    track.remove();
    if (state2.scope.closed || state2.trackRevision !== revision)
      throw error2;
    template.$track = previous;
    if (parent)
      parent.insertBefore(previous, next?.parentNode === parent ? next : null);
    throw error2;
  }
}
const SubtitleBase = Component;
class Subtitle extends SubtitleBase {
  constructor(art) {
    super(art);
    this.name = "subtitle";
    this.option = null;
    this.destroyEvent = () => null;
    const state2 = initSubtitleState(this, art);
    void this.init(art.option.subtitle).catch(() => {
    });
    let lastState = false;
    const timeupdate = () => {
      if (state2.scope.closed || !this.url)
        return;
      const fullscreen2 = art.template.$video.webkitDisplayingFullscreen;
      if (typeof fullscreen2 === "boolean" && fullscreen2 !== lastState) {
        lastState = fullscreen2;
        this.createTrack(fullscreen2 ? "subtitles" : "metadata", this.url);
      }
    };
    art.on("video:timeupdate", timeupdate);
    state2.scope.add(() => {
      art.off("video:timeupdate", timeupdate);
    });
  }
  get url() {
    return this.art.template.$track.src;
  }
  set url(url) {
    void this.switch(url).catch(() => {
    });
  }
  get textTrack() {
    return this.art.template.$video?.textTracks?.[0];
  }
  get activeCues() {
    return Array.from(this.textTrack?.activeCues || []);
  }
  get cues() {
    return Array.from(this.textTrack?.cues || []);
  }
  style(key, value) {
    const { $subtitle } = this.art.template;
    return typeof key === "object" ? setStyles($subtitle, key) : setStyle($subtitle, key, value);
  }
  update() {
    renderSubtitle(this);
  }
  async switch(url, newOption = {}) {
    const { i18n, notice, option } = this.art;
    const subtitleOption = { ...option.subtitle, ...newOption, url };
    const state2 = subtitleState(this);
    const revision = state2.revision + 1;
    const subUrl = await this.init(subtitleOption);
    if (!state2.scope.closed && state2.revision === revision && newOption.name)
      notice.show = `${i18n.get("Switch Subtitle")}: ${newOption.name}`;
    return subUrl;
  }
  createTrack(kind, url) {
    replaceSubtitleTrack(this, kind, url);
  }
  async init(subtitleOption) {
    const state2 = subtitleState(this);
    const request = beginSubtitleRequest(state2);
    const { notice, template: { $subtitle } } = this.art;
    return request.run(async () => {
      if (!this.textTrack)
        return null;
      validator(subtitleOption, scheme.subtitle);
      if (!subtitleOption.url)
        return void 0;
      this.option = subtitleOption;
      this.style(subtitleOption.style);
      let generated;
      try {
        if (!request.active)
          return void 0;
        const response = await fetch(subtitleOption.url, { signal: request.signal });
        if (!request.active)
          return void 0;
        if (!response.ok)
          throw new Error(`Failed to load subtitle: ${response.status} ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        if (!request.active)
          return void 0;
        const vtt = parseSubtitle(buffer, subtitleOption);
        if (!request.active)
          return void 0;
        const subUrl = vtt === void 0 ? subtitleOption.url : generated = vttToBlob(vtt.vtt);
        if (!request.active)
          return void 0;
        $subtitle.innerHTML = "";
        const trackRevision = state2.trackRevision + 1;
        if (this.url !== subUrl)
          this.createTrack("metadata", subUrl);
        if (!request.active || state2.trackRevision > trackRevision)
          return void 0;
        if (generated) {
          state2.ownedURL = generated;
          generated = void 0;
        }
        return subUrl;
      } catch (error2) {
        if (!request.active)
          return void 0;
        $subtitle.innerHTML = "";
        notice.show = error2;
        throw error2;
      } finally {
        if (generated) {
          if (!state2.scope.closed && this.url === generated)
            state2.ownedURL = generated;
          else
            URL.revokeObjectURL(generated);
        }
      }
    });
  }
}
const html = `
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
function bindNodes(target) {
  target.$player = target.query(".art-video-player");
  target.$video = target.query(".art-video");
  target.$track = target.query("track");
  target.$poster = target.query(".art-poster");
  target.$subtitle = target.query(".art-subtitle");
  target.$danmuku = target.query(".art-danmuku");
  target.$bottom = target.query(".art-bottom");
  target.$progress = target.query(".art-progress");
  target.$controls = target.query(".art-controls");
  target.$controlsLeft = target.query(".art-controls-left");
  target.$controlsCenter = target.query(".art-controls-center");
  target.$controlsRight = target.query(".art-controls-right");
  target.$layer = target.query(".art-layers");
  target.$loading = target.query(".art-loading");
  target.$notice = target.query(".art-notice");
  target.$noticeInner = target.query(".art-notice-inner");
  target.$mask = target.query(".art-mask");
  target.$state = target.query(".art-state");
  target.$setting = target.query(".art-settings");
  target.$info = target.query(".art-info");
  target.$infoPanel = target.query(".art-info-panel");
  target.$infoClose = target.query(".art-info-close");
  target.$contextmenu = target.query(".art-contextmenus");
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
    ownContainer(art, this.$container, captureTemplate(this.$container));
    duringTemplateMount(art, this, () => {
      this.$container.dataset.artId = String(art.id);
      this.init();
    });
  }
  static get html() {
    return html;
  }
  query(className2) {
    return query(className2, this.$container);
  }
  init() {
    const { option } = this.art;
    if (!option.useSSR) {
      this.$container.innerHTML = Template.html;
    }
    bindNodes(this);
    if (option.proxy) {
      const video = option.proxy.call(this.art, this.art);
      if (isClosing(this.art))
        return;
      assertProxy(video);
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
function assertProxy(video) {
  errorHandle(
    video instanceof HTMLVideoElement || video instanceof HTMLCanvasElement,
    "Function 'option.proxy' needs to return 'HTMLVideoElement' or 'HTMLCanvasElement'"
  );
}
const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
class Emitter {
  on(name, fn, ctx) {
    const e = this.e || (this.e = {});
    let listeners = owns(e, name) ? e[name] : void 0;
    if (!listeners) {
      listeners = [];
      Object.defineProperty(e, name, { value: listeners, enumerable: true, configurable: true, writable: true });
    }
    listeners.push({ fn, ctx });
    return this;
  }
  once(name, fn, ctx) {
    const self = this;
    const callback = fn;
    let fired = false;
    function listener(...args) {
      if (fired)
        return;
      fired = true;
      self.off(name, listener);
      callback.apply(ctx, args);
    }
    listener._ = fn;
    return this.on(name, listener, ctx);
  }
  emit(name, ...data) {
    const e = this.e || (this.e = {});
    const snapshot = (owns(e, name) ? e[name] || [] : []).slice();
    for (const event of snapshot) {
      event.fn.apply(event.ctx, data);
    }
    return this;
  }
  off(name, callback) {
    const e = this.e || (this.e = {});
    const evts = owns(e, name) ? e[name] : void 0;
    const liveEvents = [];
    if (evts && callback) {
      for (let i = 0, len = evts.length; i < len; i += 1) {
        const event = evts[i];
        if (event.fn !== callback && event.fn._ !== callback)
          liveEvents.push(event);
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
class Artplayer extends Emitter {
  constructor(option, readyCallback) {
    super();
    if (!isBrowser) {
      throw new Error("Artplayer can only be used in the browser environment");
    }
    this.id = ++id;
    this.option = resolveRuntimeOption(option, Artplayer.option);
    this.isLock = false;
    this.isReady = false;
    this.isFocus = false;
    this.isInput = false;
    this.isRotate = false;
    this.isDestroy = false;
    beginLifecycle(this);
    try {
      this.template = new Template(this);
      if (getScope(this).closed)
        return;
      this.events = new Events(this);
      if (getScope(this).closed)
        return;
      this.storage = new Storage();
      if (getScope(this).closed)
        return;
      this.icons = new Icons(this);
      if (getScope(this).closed)
        return;
      this.i18n = new I18n(this);
      if (getScope(this).closed)
        return;
      this.notice = new Notice(this);
      if (getScope(this).closed)
        return;
      this.player = new Player(this);
      if (getScope(this).closed)
        return;
      this.layers = new Layer(this);
      if (getScope(this).closed)
        return;
      this.controls = new Control(this);
      if (getScope(this).closed)
        return;
      this.contextmenu = new Contextmenu(this);
      if (getScope(this).closed)
        return;
      this.subtitle = new Subtitle(this);
      if (getScope(this).closed)
        return;
      this.info = new Info(this);
      if (getScope(this).closed)
        return;
      this.loading = new Loading(this);
      if (getScope(this).closed)
        return;
      this.hotkey = new Hotkey(this);
      if (getScope(this).closed)
        return;
      this.mask = new Mask(this);
      if (getScope(this).closed)
        return;
      this.setting = new Setting(this);
      if (getScope(this).closed)
        return;
      this.plugins = new Plugins(this);
      if (getScope(this).closed)
        return;
      if (typeof readyCallback === "function") {
        this.on("ready", () => readyCallback.call(this, this));
      }
      if (Artplayer.DEBUG) {
        const log = (msg) => console.log(`[ART.${this.id}] -> ${msg}`);
        log(`Version@${Artplayer.version}`);
        for (let index = 0; index < config$1.events.length; index++) {
          this.on(`video:${config$1.events[index]}`, (event) => log(`Event@${event.type}`));
        }
      }
      if (finishLifecycle(this))
        instances.push(this);
    } catch (error2) {
      try {
        destroyInstance(this, instances, true, Artplayer.REMOVE_SRC_WHEN_DESTROY, true);
      } catch (cleanupError) {
        console.warn("Failed to clean up ArtPlayer initialization:", cleanupError);
      }
      throw error2;
    }
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
    return createDefaults();
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
    destroyInstance(this, instances, removeHtml, Artplayer.REMOVE_SRC_WHEN_DESTROY);
  }
}
Artplayer.STYLE = css;
Artplayer.DEBUG = false;
Artplayer.CONTEXTMENU = true;
Artplayer.NOTICE_TIME = 2e3;
Artplayer.SETTING_WIDTH = 250;
Artplayer.SETTING_ITEM_WIDTH = 200;
Artplayer.SETTING_ITEM_HEIGHT = 35;
Artplayer.RESIZE_TIME = 200;
Artplayer.SCROLL_TIME = 200;
Artplayer.SCROLL_GAP = 50;
Artplayer.AUTO_PLAYBACK_MAX = 10;
Artplayer.AUTO_PLAYBACK_MIN = 5;
Artplayer.AUTO_PLAYBACK_TIMEOUT = 3e3;
Artplayer.RECONNECT_TIME_MAX = 5;
Artplayer.RECONNECT_SLEEP_TIME = 1e3;
Artplayer.CONTROL_HIDE_TIME = 3e3;
Artplayer.DBCLICK_TIME = 300;
Artplayer.DBCLICK_FULLSCREEN = true;
Artplayer.MOBILE_DBCLICK_PLAY = true;
Artplayer.MOBILE_CLICK_PLAY = false;
Artplayer.AUTO_ORIENTATION_TIME = 200;
Artplayer.INFO_LOOP_TIME = 1e3;
Artplayer.FAST_FORWARD_VALUE = 3;
Artplayer.FAST_FORWARD_TIME = 1e3;
Artplayer.TOUCH_MOVE_RATIO = 0.5;
Artplayer.VOLUME_STEP = 0.1;
Artplayer.SEEK_STEP = 5;
Artplayer.PLAYBACK_RATE = [0.5, 0.75, 1, 1.25, 1.5, 2];
Artplayer.ASPECT_RATIO = ["default", "4:3", "16:9"];
Artplayer.FLIP = ["normal", "horizontal", "vertical"];
Artplayer.FULLSCREEN_WEB_IN_BODY = true;
Artplayer.LOG_VERSION = true;
Artplayer.USE_RAF = false;
Artplayer.REMOVE_SRC_WHEN_DESTROY = true;
publishBrowserEntry(Artplayer, css);
export {
  Artplayer as default
};
