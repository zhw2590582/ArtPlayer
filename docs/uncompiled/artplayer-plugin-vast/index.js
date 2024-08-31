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
})({"eSwxK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginVast);
var _vastImaPlayer = require("@glomex/vast-ima-player");
function artplayerPluginVast(callback) {
    return async (art)=>{
        const { template, constructor } = art;
        const { createElement, setStyles, append } = constructor.utils;
        const { $video, $player } = template;
        await (0, _vastImaPlayer.loadImaSdk)();
        const google = window.google;
        const ima = google.ima;
        const adsRenderingSettings = new ima.AdsRenderingSettings();
        const playerOptions = new (0, _vastImaPlayer.PlayerOptions)();
        const id = `art-${Date.now()}`;
        const $container = createElement("div");
        append($player, $container);
        $container.id = id;
        setStyles($container, {
            position: "absolute",
            inset: "0",
            width: "100%",
            height: "100%",
            zIndex: "150",
            display: "none"
        });
        const imaPlayer = new (0, _vastImaPlayer.Player)(ima, $video, $container, adsRenderingSettings, playerOptions);
        function playUrl(url) {
            const playAdsRequest = new ima.AdsRequest();
            playAdsRequest.adTagUrl = url;
            imaPlayer.playAds(playAdsRequest);
        }
        function playRes(res) {
            const playAdsRequest = new ima.AdsRequest();
            playAdsRequest.adsResponse = res;
            imaPlayer.playAds(playAdsRequest);
        }
        if (typeof callback === "function") await callback({
            art,
            id,
            ima,
            imaPlayer,
            $container,
            playUrl,
            playRes
        });
        return {
            name: "artplayerPluginVast"
        };
    };
}
if (typeof window !== "undefined") window["artplayerPluginVast"] = artplayerPluginVast;

},{"@glomex/vast-ima-player":"9NIGZ","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"9NIGZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Player", ()=>nt);
parcelHelpers.export(exports, "PlayerError", ()=>T);
parcelHelpers.export(exports, "PlayerEvent", ()=>R);
parcelHelpers.export(exports, "PlayerOptions", ()=>E);
parcelHelpers.export(exports, "loadImaSdk", ()=>e);
var t = null, i = function() {
    t = null;
}, e = function() {
    var e = window;
    return e.google && e.google.ima ? Promise.resolve(e.google.ima) : t || ((t = new Promise(function(t, i) {
        var e = document.createElement("script");
        e.async = !0, e.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js", e.onload = t, e.onerror = i, document.body.appendChild(e);
    }).then(function() {
        return e.google.ima;
    })).then(i).catch(i), t);
};
function n(t, i) {
    for(var e = 0; e < i.length; e++){
        var n = i[e];
        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
    }
}
function s(t, i, e) {
    return i && n(t.prototype, i), e && n(t, e), t;
}
function h() {
    return h = Object.assign || function(t) {
        for(var i = 1; i < arguments.length; i++){
            var e = arguments[i];
            for(var n in e)Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
        }
        return t;
    }, h.apply(this, arguments);
}
function r(t, i) {
    t.prototype = Object.create(i.prototype), t.prototype.constructor = t, a(t, i);
}
function o(t) {
    return o = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
        return t.__proto__ || Object.getPrototypeOf(t);
    }, o(t);
}
function a(t, i) {
    return a = Object.setPrototypeOf || function(t, i) {
        return t.__proto__ = i, t;
    }, a(t, i);
}
function u() {
    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
    if (Reflect.construct.sham) return !1;
    if ("function" == typeof Proxy) return !0;
    try {
        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
    } catch (t) {
        return !1;
    }
}
function c(t, i, e) {
    return c = u() ? Reflect.construct : function(t, i, e) {
        var n = [
            null
        ];
        n.push.apply(n, i);
        var s = new (Function.bind.apply(t, n));
        return e && a(s, e.prototype), s;
    }, c.apply(null, arguments);
}
function d(t) {
    var i = "function" == typeof Map ? new Map : void 0;
    return d = function(t) {
        if (null === t || -1 === Function.toString.call(t).indexOf("[native code]")) return t;
        if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
        if (void 0 !== i) {
            if (i.has(t)) return i.get(t);
            i.set(t, e);
        }
        function e() {
            return c(t, arguments, o(this).constructor);
        }
        return e.prototype = Object.create(t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), a(e, t);
    }, d(t);
}
function l(t) {
    if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return t;
}
function f(t, i) {
    (null == i || i > t.length) && (i = t.length);
    for(var e = 0, n = new Array(i); e < i; e++)n[e] = t[e];
    return n;
}
var v = 0;
function b(t) {
    return "__private_" + v++ + "_" + t;
}
function w(t, i) {
    if (!Object.prototype.hasOwnProperty.call(t, i)) throw new TypeError("attempted to use private field on non-instance");
    return t;
}
var m = {};
m.CustomEvent = "function" == typeof CustomEvent ? CustomEvent : function(t) {
    return i[t] = new i("").constructor[t], i;
    function i(t, i) {
        i || (i = {});
        var e = document.createEvent("CustomEvent");
        return e.initCustomEvent(t, !!i.bubbles, !!i.cancelable, i.detail), e;
    }
}("prototype");
var p, y, O = m.CustomEvent, j = b("mediaElement"), g = b("currentTime"), A = b("enabled"), k = function() {
    function t(t) {
        Object.defineProperty(this, j, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(this, g, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(this, A, {
            writable: !0,
            value: void 0
        }), this.seeking = void 0, w(this, j)[j] = t, w(this, g)[g] = 0, w(this, A)[A] = !1, this.seeking = !1, this.t = this.t.bind(this), this.i = this.i.bind(this), this.h = this.h.bind(this), this.enable();
    }
    var i = t.prototype;
    return i.i = function() {
        this.seeking = !0;
    }, i.h = function() {
        this.seeking = !1;
    }, i.t = function() {
        var t, i;
        this.seeking || null != (t = w(this, j)[j]) && t.paused || (w(this, g)[g] = null == (i = w(this, j)[j]) ? void 0 : i.currentTime);
    }, i.enable = function() {
        var t, i, e;
        w(this, A)[A] || (null == (t = w(this, j)[j]) || t.addEventListener("seeking", this.i), null == (i = w(this, j)[j]) || i.addEventListener("seeked", this.h), null == (e = w(this, j)[j]) || e.addEventListener("timeupdate", this.t), w(this, A)[A] = !0);
    }, i.disable = function() {
        var t, i, e;
        w(this, A)[A] && (null == (t = w(this, j)[j]) || t.removeEventListener("seeking", this.i), null == (i = w(this, j)[j]) || i.removeEventListener("seeked", this.h), null == (e = w(this, j)[j]) || e.removeEventListener("timeupdate", this.t), w(this, A)[A] = !1);
    }, i.play = function() {
        var t = this;
        return new Promise(function(i) {
            var e;
            i(null == (e = w(t, j)[j]) ? void 0 : e.play());
        });
    }, i.pause = function() {
        var t;
        null == (t = w(this, j)[j]) || t.pause();
    }, i.reset = function() {
        w(this, g)[g] = 0, w(this, A)[A] = !1, this.seeking = !1, this.enable();
    }, i.destroy = function() {
        w(this, g)[g] = 0, w(this, A)[A] = !1, this.seeking = !1, this.disable(), w(this, j)[j] = void 0;
    }, s(t, [
        {
            key: "enabled",
            get: function() {
                return w(this, A)[A];
            }
        },
        {
            key: "currentTime",
            get: function() {
                return w(this, g)[g];
            }
        },
        {
            key: "duration",
            get: function() {
                var t;
                return null == (t = w(this, j)[j]) ? void 0 : t.duration;
            }
        },
        {
            key: "muted",
            get: function() {
                var t;
                return null == (t = w(this, j)[j]) ? void 0 : t.muted;
            }
        },
        {
            key: "volume",
            get: function() {
                var t;
                return null == (t = w(this, j)[j]) ? void 0 : t.volume;
            }
        }
    ]), t;
}(), C = function() {
    function t() {
        this.delegate = document.createDocumentFragment();
    }
    var i = t.prototype;
    return i.addEventListener = function() {
        this.delegate.addEventListener.apply(this.delegate, [].slice.call(arguments));
    }, i.dispatchEvent = function() {
        return this.delegate.dispatchEvent.apply(this.delegate, [].slice.call(arguments));
    }, i.removeEventListener = function() {
        return this.delegate.removeEventListener.apply(this.delegate, [].slice.call(arguments));
    }, t;
}(), P = [
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
];
!function(t) {
    t.MEDIA_START = "MediaStart", t.MEDIA_IMPRESSION = "MediaImpression", t.MEDIA_STOP = "MediaStop", t.MEDIA_CUE_POINTS_CHANGE = "MediaCuePointsChange", t.MEDIA_RESUMED = "MediaResumed";
}(p || (p = {})), function(t) {
    t.AD_ERROR = "AdError", t.AD_BUFFERING = "AdBuffering", t.LOADED = "AdLoaded", t.IMPRESSION = "AdImpression", t.STARTED = "AdStarted", t.FIRST_QUARTILE = "AdFirstQuartile", t.MIDPOINT = "AdMidpoint", t.THIRD_QUARTILE = "AdThirdQuartile", t.AD_PROGRESS = "AdProgress", t.COMPLETE = "AdComplete", t.CLICK = "AdClick", t.PAUSED = "AdPaused", t.RESUMED = "AdResumed", t.SKIPPED = "AdSkipped", t.SKIPPABLE_STATE_CHANGED = "AdSkippableStateChanged", t.VOLUME_CHANGED = "AdVolumeChanged", t.VOLUME_MUTED = "AdMuted", t.AD_METADATA = "AdMetadata", t.AD_BREAK_READY = "AdBreakReady", t.CONTENT_PAUSE_REQUESTED = "AdContentPauseRequested", t.CONTENT_RESUME_REQUESTED = "AdContentResumeRequested", t.ALL_ADS_COMPLETED = "AdAllAdsCompleted", t.DURATION_CHANGE = "AdDurationChange", t.INTERACTION = "AdInteraction", t.LINEAR_CHANGED = "AdLinearChanged", t.LOG = "AdLog", t.USER_CLOSE = "AdUserClose", t.AD_CAN_PLAY = "AdCanPlay", t.EXPANDED_CHANGED = "AdExpandedChanged", t.VIEWABLE_IMPRESSION = "AdViewableImpression";
}(y || (y = {}));
var R = h({}, y, p), E = function() {
    this.disableCustomPlaybackForIOS10Plus = !1, this.autoResize = !0, this.clickTrackingElement = void 0;
}, T = function(t) {
    function i() {
        var i;
        return (i = t.call.apply(t, [
            this
        ].concat([].slice.call(arguments))) || this).errorCode = void 0, i.innerError = void 0, i.type = void 0, i.vastErrorCode = void 0, i;
    }
    return r(i, t), i;
}(d(Error));
T.ERROR_CODE_ADS_MANAGER_LOADED_TIMEOUT = 9e3, T.ERROR_CODE_REQUEST_ADS_TIMEOUT = 9001;
var S = b("mediaElement"), M = b("adElement"), x = b("customPlayhead"), I = b("adsRenderingSettings"), B = b("ima"), L = b("adDisplayContainer"), D = b("adsManager"), W = b("width"), _ = b("height"), q = b("adsLoader"), F = b("playerOptions"), N = b("resizeObserver"), V = b("currentAd"), G = b("loadedAd"), Q = b("mediaStartTriggered"), U = b("mediaImpressionTriggered"), z = b("mediaInActivation"), Z = b("customPlaybackTimeAdjustedOnEnded"), $ = b("cuePoints"), H = b("adCurrentTime"), J = b("adDuration"), K = b("startAdCallback"), X = b("adsManagerLoadedTimeout"), Y = b("requestAdsTimeout"), tt = b("wasExternallyPaused"), it = b("lastNonZeroAdVolume"), et = b("activatePromise"), nt = function(t) {
    function i(i, e, n, s, h) {
        var r;
        void 0 === s && (s = new i.AdsRenderingSettings), void 0 === h && (h = new E), r = t.call(this) || this, Object.defineProperty(l(r), S, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), M, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), x, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), I, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), B, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), L, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), D, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), W, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), _, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), q, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), F, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), N, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), V, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), G, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), Q, {
            writable: !0,
            value: !1
        }), Object.defineProperty(l(r), U, {
            writable: !0,
            value: !1
        }), Object.defineProperty(l(r), z, {
            writable: !0,
            value: !1
        }), Object.defineProperty(l(r), Z, {
            writable: !0,
            value: !1
        }), Object.defineProperty(l(r), $, {
            writable: !0,
            value: []
        }), Object.defineProperty(l(r), H, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), J, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), K, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), X, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), Y, {
            writable: !0,
            value: void 0
        }), Object.defineProperty(l(r), tt, {
            writable: !0,
            value: !1
        }), Object.defineProperty(l(r), it, {
            writable: !0,
            value: 1
        }), Object.defineProperty(l(r), et, {
            writable: !0,
            value: Promise.resolve()
        }), w(l(r), S)[S] = e, w(l(r), M)[M] = n, w(l(r), B)[B] = i, w(l(r), F)[F] = h, w(l(r), I)[I] = s, w(l(r), I)[I].restoreCustomPlaybackStateOnAdBreakComplete = !0, h.disableCustomPlaybackForIOS10Plus && !w(l(r), S)[S].hasAttribute("playsinline") && w(l(r), S)[S].setAttribute("playsinline", ""), w(l(r), B)[B].settings.setDisableCustomPlaybackForIOS10Plus(h.disableCustomPlaybackForIOS10Plus), w(l(r), x)[x] = new k(w(l(r), S)[S]), r.o = r.o.bind(l(r)), P.forEach(function(t) {
            w(l(r), S)[S].addEventListener(t, r.o);
        }), r.u = r.u.bind(l(r)), r.l = r.l.bind(l(r));
        var o = w(l(r), S)[S], a = o.offsetHeight, u = o.offsetWidth;
        return w(l(r), W)[W] = u, w(l(r), _)[_] = a, h.autoResize && window.ResizeObserver && (w(l(r), N)[N] = new window.ResizeObserver(function(t) {
            return r.v(t);
        }), w(l(r), N)[N].observe(w(l(r), S)[S])), r;
    }
    r(i, t);
    var e = i.prototype;
    return e.activate = function() {
        var t = this;
        if (!w(this, Q)[Q] && !w(this, z)[z] && (w(this, z)[z] = !0, w(this, S)[S].paused)) {
            var i = function() {
                return w(t, S)[S].pause(), new Promise(function(i) {
                    setTimeout(function() {
                        w(t, z)[z] = !1, i();
                    }, 1);
                });
            };
            w(this, et)[et] = new Promise(function(i) {
                return i(w(t, S)[S].play());
            }).then(i).catch(i);
        }
    }, e.playAds = function(t) {
        this.m(t);
    }, e.loadAds = function(t, i) {
        this.m(t, !1, i);
    }, e.p = function() {
        var t = this;
        return w(this, et)[et].then(function() {
            return new Promise(function(i) {
                return i(w(t, S)[S].play());
            });
        });
    }, e.m = function(t, i, e) {
        var n = this;
        void 0 === i && (i = !0), this.reset(), this.O(), w(this, B)[B].settings.setAutoPlayAdBreaks(i), w(this, S)[S].ended && (w(this, x)[x].reset(), w(this, S)[S].currentTime = 0), w(this, K)[K] = e, t.linearAdSlotWidth = w(this, W)[W], t.linearAdSlotHeight = w(this, _)[_], t.nonLinearAdSlotWidth = w(this, W)[W], t.nonLinearAdSlotHeight = w(this, _)[_], null == t.contentDuration && (t.contentDuration = -3), w(this, X)[X] = window.setTimeout(function() {
            var t = new T("No adsManagerLoadedEvent within 5000ms.");
            t.errorCode = T.ERROR_CODE_ADS_MANAGER_LOADED_TIMEOUT, n.j(t);
        }, 5e3), w(this, Y)[Y] = window.setTimeout(function() {
            var t = new T("No response for ads-request within 10000ms.");
            t.errorCode = T.ERROR_CODE_REQUEST_ADS_TIMEOUT, n.j(t);
        }, 1e4), w(this, q)[q].requestAds(t);
    }, e.O = function() {
        w(this, L)[L] = new (w(this, B))[B].AdDisplayContainer(w(this, M)[M], w(this, F)[F].disableCustomPlaybackForIOS10Plus ? void 0 : w(this, S)[S], w(this, F)[F].clickTrackingElement), w(this, q)[q] = new (w(this, B))[B].AdsLoader(w(this, L)[L]), w(this, q)[q].addEventListener(w(this, B)[B].AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.u, !1), w(this, q)[q].addEventListener(w(this, B)[B].AdErrorEvent.Type.AD_ERROR, this.l, !1);
    }, e.skipAd = function() {
        w(this, D)[D] && w(this, D)[D].skip();
    }, e.discardAdBreak = function() {
        w(this, D)[D] && w(this, D)[D].discardAdBreak();
    }, e.play = function() {
        var t = this;
        w(this, tt)[tt] = !1, !w(this, x)[x].enabled && w(this, D)[D] ? w(this, D)[D].resume() : w(this, X)[X] || this.p().then(function() {}).catch(function() {
            t.dispatchEvent(new O("pause"));
        });
    }, e.pause = function() {
        w(this, tt)[tt] = !0, !w(this, x)[x].enabled && w(this, D)[D] ? w(this, D)[D].pause() : w(this, S)[S].pause();
    }, e.g = function(t) {
        w(this, $)[$] = [].concat(t), this.dispatchEvent(new O(R.MEDIA_CUE_POINTS_CHANGE, {
            detail: {
                cuePoints: [].concat(w(this, $)[$])
            }
        }));
    }, e.A = function(t) {
        var i = this.cuePoints.indexOf(t);
        i > -1 && (w(this, $)[$].splice(i, 1), this.g(w(this, $)[$]));
    }, e.resizeAd = function(t, i) {
        w(this, W)[W] = t, w(this, _)[_] = i, w(this, D)[D] && w(this, D)[D].resize(t, i, this.k()), w(this, M)[M].style.width = t + "px", w(this, M)[M].style.height = i + "px";
    }, e.reset = function(t) {
        void 0 === t && (t = !1), t && (w(this, U)[U] = !1, w(this, Q)[Q] = !1, w(this, Z)[Z] = !1), this.C(), w(this, $)[$] = [], w(this, tt)[tt] = !1, w(this, K)[K] = void 0, w(this, D)[D] && w(this, D)[D].destroy(), w(this, D)[D] = void 0, w(this, B)[B].settings.setAutoPlayAdBreaks(!0), t && this.P(), w(this, M)[M].style.display = "none";
    }, e.P = function() {
        w(this, q)[q] && (w(this, q)[q].removeEventListener(w(this, B)[B].AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.u, !1), w(this, q)[q].removeEventListener(w(this, B)[B].AdErrorEvent.Type.AD_ERROR, this.l, !1), w(this, q)[q].destroy()), w(this, L)[L] && w(this, L)[L].destroy();
    }, e.destroy = function() {
        var t, i, e, n, s = this;
        this.reset(!0), w(this, x)[x].destroy(), P.forEach(function(t) {
            w(s, S)[S].removeEventListener(t, s.o);
        }), null == (t = w(this, q)[q]) || t.removeEventListener(w(this, B)[B].AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.u, !1), null == (i = w(this, L)[L]) || i.destroy(), null == (e = w(this, q)[q]) || e.destroy(), w(this, U)[U] = !1, w(this, Z)[Z] = !1, w(this, Q)[Q] = !1, null == (n = w(this, N)[N]) || n.disconnect();
    }, e.isCustomPlaybackUsed = function() {
        return !1 === w(this, B)[B].settings.getDisableCustomPlaybackForIOS10Plus() && !w(this, M)[M].querySelector("video");
    }, e.C = function() {
        window.clearTimeout(w(this, X)[X]), window.clearTimeout(w(this, Y)[Y]), w(this, X)[X] = void 0, w(this, Y)[Y] = void 0, w(this, V)[V] = void 0, w(this, H)[H] = void 0, w(this, J)[J] = void 0, w(this, M)[M].style.display = "none", w(this, M)[M].classList.remove("nonlinear"), w(this, D)[D] && this.R();
    }, e.o = function(t) {
        var i = this;
        if (w(this, x)[x].enabled || "volumechange" === t.type) {
            if ("timeupdate" === t.type) {
                if (w(this, S)[S].currentTime < .5) return;
                if (w(this, D)[D]) {
                    var e = w(this, D)[D].getCuePoints().filter(function(t) {
                        return t >= 0 && t < w(i, x)[x].currentTime;
                    }).pop();
                    this.A(e);
                }
                !w(this, U)[U] && w(this, Q)[Q] && (this.dispatchEvent(new O(R.MEDIA_IMPRESSION)), w(this, U)[U] = !0);
            }
            if ("play" !== t.type || w(this, Q)[Q] || w(this, z)[z] || (this.dispatchEvent(new O(R.MEDIA_START)), w(this, Q)[Q] = !0), "ended" === t.type && (this.isCustomPlaybackUsed() && w(this, S)[S].currentTime === w(this, S)[S].duration && w(this, $)[$].indexOf(-1) > -1 && (w(this, S)[S].currentTime = w(this, S)[S].duration - 1e-5, w(this, Z)[Z] = !0), w(this, q)[q].contentComplete(), w(this, D)[D] || this.T()), !window.ResizeObserver && w(this, F)[F].autoResize && "loadedmetadata" === t.type) {
                var n = w(this, S)[S], s = n.offsetHeight, h = n.offsetWidth;
                w(this, W)[W] = h, w(this, _)[_] = s, this.R();
            }
            w(this, z)[z] && "volumechange" !== t.type || this.dispatchEvent(new O(t.type));
        }
    }, e.S = function(t) {
        var i = this, e = w(this, B)[B].AdEvent;
        switch(t.type){
            case e.Type.LOADED:
                var n = t.getAd();
                w(this, K)[K] && 0 === w(this, $)[$].length ? w(this, K)[K]({
                    ad: n,
                    start: function() {
                        i.M(), w(i, K)[K] = void 0;
                    },
                    startWithoutReset: function() {
                        i.M();
                    }
                }) : w(this, G)[G] = n;
                break;
            case e.Type.AD_BREAK_READY:
                this.C(), w(this, K)[K] ? (w(this, K)[K]({
                    ad: w(this, G)[G],
                    adBreakTime: t.getAdData().adBreakTime,
                    start: function() {
                        i.M(), w(i, K)[K] = void 0;
                    },
                    startWithoutReset: function() {
                        i.M();
                    }
                }), w(this, G)[G] = void 0) : this.M();
                break;
            case e.Type.STARTED:
                var s = w(this, V)[V] = t.getAd();
                s.getAdPodInfo().getAdPosition() > 1 && w(this, D)[D].setVolume(w(this, D)[D].getVolume()), w(this, M)[M].classList.remove("nonlinear"), this.R(), s.isLinear() ? (w(this, x)[x].disable(), w(this, J)[J] = s.getDuration(), w(this, H)[H] = 0) : (w(this, M)[M].classList.add("nonlinear"), this.I()), w(this, M)[M].style.display = "", w(this, tt)[tt] && (w(this, tt)[tt] = !1, w(this, D)[D].pause());
                break;
            case e.Type.ALL_ADS_COMPLETED:
                if (w(this, Z)[Z]) return;
                this.isCustomPlaybackUsed() && Boolean(w(this, V)[V]) && -1 !== w(this, V)[V].getAdPodInfo().getTimeOffset() && this.I(), this.reset();
                break;
            case e.Type.CONTENT_PAUSE_REQUESTED:
                this.C(), w(this, V)[V] = t.getAd(), w(this, M)[M].style.display = "", w(this, S)[S].pause(), this.R(), w(this, V)[V] && this.A(w(this, V)[V].getAdPodInfo().getTimeOffset()), w(this, D)[D].setVolume(w(this, S)[S].muted ? 0 : w(this, S)[S].volume), w(this, x)[x].disable(), w(this, J)[J] = w(this, V)[V].getDuration(), w(this, H)[H] = 0;
                break;
            case e.Type.CONTENT_RESUME_REQUESTED:
                var h = Boolean(w(this, V)[V]);
                if (h) {
                    var r = w(this, D)[D].getVolume();
                    w(this, S)[S].muted = 0 === r, w(this, S)[S].volume = w(this, it)[it];
                }
                w(this, Z)[Z] && (w(this, S)[S].currentTime = w(this, S)[S].duration + 1, w(this, Z)[Z] = !1), w(this, S)[S].ended ? (this.reset(), this.T()) : this.C(), h && (w(this, tt)[tt] = !1, this.I());
                break;
            case e.Type.AD_METADATA:
                this.g(w(this, D)[D].getCuePoints()), -1 === w(this, $)[$].indexOf(0) && (w(this, K)[K] ? w(this, K)[K]({
                    start: function() {
                        i.I(), w(i, K)[K] = void 0;
                    },
                    startWithoutReset: function() {
                        i.I();
                    }
                }) : this.I());
                break;
            case e.Type.AD_PROGRESS:
                var o = t.getAdData();
                w(this, H)[H] = o.currentTime, w(this, J)[J] = o.duration;
                break;
            case e.Type.LOG:
                var a = t.getAdData();
                w(this, K)[K] ? w(this, K)[K]({
                    start: function() {
                        i.I(), w(i, K)[K] = void 0;
                    },
                    startWithoutReset: function() {
                        i.I();
                    }
                }) : a.adError && !w(this, V)[V] && this.I();
                break;
            case e.Type.VOLUME_CHANGED:
                var u = w(this, D)[D].getVolume();
                u > 0 && (w(this, it)[it] = u);
        }
    }, e.l = function(t) {
        this.j(this.B(t));
    }, e.u = function(t) {
        var i = this, e = w(this, B)[B], n = e.AdEvent, s = e.AdErrorEvent.Type.AD_ERROR;
        window.clearTimeout(w(this, X)[X]);
        var h = w(this, D)[D] = t.getAdsManager(w(this, x)[x], w(this, I)[I]);
        Object.keys(n.Type).forEach(function(t) {
            h.addEventListener(n.Type[t], function(e) {
                if (i.S(e), R[t]) {
                    var n = [
                        "LOG",
                        "AD_PROGRESS"
                    ].indexOf(t) > -1;
                    i.dispatchEvent(new O(R[t], {
                        detail: {
                            ad: e.getAd() || w(i, V)[V],
                            adData: n ? e.getAdData() : {}
                        }
                    }));
                }
            });
        }), h.addEventListener(s, function(t) {
            return i.j(i.B(t));
        });
        try {
            var r;
            h.init(w(this, W)[W], w(this, _)[_], this.k()), h.setVolume(w(this, S)[S].muted ? 0 : w(this, S)[S].volume), null == (r = w(this, L)[L]) || r.initialize(), w(this, K)[K] || this.M();
        } catch (t) {
            this.j(new T(t.message));
        }
    }, e.M = function() {
        if (w(this, Q)[Q] || (this.dispatchEvent(new O(R.MEDIA_START)), w(this, Q)[Q] = !0), w(this, D)[D]) try {
            w(this, D)[D].start();
        } catch (t) {
            this.j(new T(t.message));
        }
        else this.I();
    }, e.T = function() {
        var t = this;
        setTimeout(function() {
            w(t, U)[U] = !1, w(t, Q)[Q] = !1, w(t, Z)[Z] = !1, t.dispatchEvent(new O(R.MEDIA_STOP));
        }, 1);
    }, e.v = function(t) {
        for(var i, e = function(t, i) {
            var e = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
            if (e) return (e = e.call(t)).next.bind(e);
            if (Array.isArray(t) || (e = function(t, i) {
                if (t) {
                    if ("string" == typeof t) return f(t, i);
                    var e = Object.prototype.toString.call(t).slice(8, -1);
                    return "Object" === e && t.constructor && (e = t.constructor.name), "Map" === e || "Set" === e ? Array.from(t) : "Arguments" === e || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? f(t, i) : void 0;
                }
            }(t))) {
                e && (t = e);
                var n = 0;
                return function() {
                    return n >= t.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: t[n++]
                    };
                };
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }(t); !(i = e()).done;){
            var n = i.value;
            n.contentBoxSize && 1 === n.contentBoxSize.length ? (w(this, W)[W] = n.contentBoxSize[0].inlineSize, w(this, _)[_] = n.contentBoxSize[0].blockSize) : n.contentBoxSize && n.contentBoxSize.inlineSize ? (w(this, W)[W] = n.contentBoxSize.inlineSize, w(this, _)[_] = n.contentBoxSize.blockSize) : (w(this, W)[W] = n.contentRect.width, w(this, _)[_] = n.contentRect.height);
        }
        this.R();
    }, e.R = function() {
        if (w(this, F)[F].autoResize && w(this, D)[D]) {
            var t = w(this, V)[V], i = this.k();
            t && !t.isLinear() ? t && (t.getWidth() > w(this, W)[W] || t.getHeight() > w(this, _)[_] ? this.resizeAd(w(this, W)[W], w(this, _)[_]) : (w(this, D)[D].resize(t.getWidth(), t.getHeight() + 20, i), w(this, M)[M].style.width = t.getWidth() + "px", w(this, M)[M].style.height = t.getHeight() + 20 + "px")) : this.resizeAd(w(this, W)[W], w(this, _)[_]);
        }
    }, e.k = function() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || w(this, S)[S].webkitDisplayingFullscreen ? w(this, B)[B].ViewMode.FULLSCREEN : w(this, B)[B].ViewMode.NORMAL;
    }, e.I = function() {
        var t = this;
        w(this, M)[M].style.display = "none", w(this, S)[S].ended || (w(this, x)[x].enable(), w(this, tt)[tt] ? (w(this, S)[S].pause(), this.dispatchEvent(new O("pause"))) : (this.p().then(function() {}).catch(function() {
            t.dispatchEvent(new O("pause"));
        }), this.dispatchEvent(new O("play")), this.dispatchEvent(new O(R.MEDIA_RESUMED))), w(this, tt)[tt] = !1);
    }, e.B = function(t) {
        var i = t.getError(), e = new T(i.getMessage());
        return e.type = i.getType(), e.errorCode = i.getErrorCode(), e.vastErrorCode = i.getVastErrorCode && i.getVastErrorCode(), e.innerError = i.getInnerError(), e;
    }, e.j = function(t) {
        var i = this;
        this.dispatchEvent(new O(R.AD_ERROR, {
            detail: {
                error: t
            }
        })), this.C(), w(this, K)[K] ? w(this, K)[K]({
            start: function() {
                i.I(), w(i, K)[K] = void 0;
            },
            startWithoutReset: function() {
                i.I();
            }
        }) : this.I();
    }, s(i, [
        {
            key: "volume",
            get: function() {
                return !w(this, x)[x].enabled && w(this, D)[D] ? w(this, D)[D].getVolume() : w(this, S)[S].volume;
            },
            set: function(t) {
                !w(this, x)[x].enabled && w(this, D)[D] && w(this, D)[D].setVolume(t), w(this, S)[S].volume = t;
            }
        },
        {
            key: "muted",
            get: function() {
                return !w(this, x)[x].enabled && w(this, D)[D] ? 0 === w(this, D)[D].getVolume() : w(this, S)[S].muted;
            },
            set: function(t) {
                !w(this, x)[x].enabled && w(this, D)[D] && w(this, D)[D].setVolume(t ? 0 : w(this, it)[it]), w(this, S)[S].muted = t;
            }
        },
        {
            key: "currentTime",
            get: function() {
                return void 0 !== w(this, H)[H] ? w(this, H)[H] : w(this, S)[S].currentTime;
            },
            set: function(t) {
                w(this, x)[x].enabled && (w(this, S)[S].currentTime = t);
            }
        },
        {
            key: "duration",
            get: function() {
                return void 0 !== w(this, J)[J] ? w(this, J)[J] : w(this, S)[S].duration;
            }
        },
        {
            key: "cuePoints",
            get: function() {
                return [].concat(w(this, $)[$]);
            }
        }
    ]), i;
}(C);

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

},{}]},["eSwxK"], "eSwxK", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map
