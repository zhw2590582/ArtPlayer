/*!
 * artplayer-plugin-vast.js v1.2.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
var t = null, i = function() {
  t = null;
}, e = function() {
  var e2 = window;
  return e2.google && e2.google.ima ? Promise.resolve(e2.google.ima) : t || ((t = new Promise(function(t2, i2) {
    var e3 = document.createElement("script");
    e3.async = true, e3.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js", e3.onload = t2, e3.onerror = i2, document.body.appendChild(e3);
  }).then(function() {
    return e2.google.ima;
  })).then(i).catch(i), t);
};
function n(t2, i2) {
  for (var e2 = 0; e2 < i2.length; e2++) {
    var n2 = i2[e2];
    n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t2, n2.key, n2);
  }
}
function s(t2, i2, e2) {
  return i2 && n(t2.prototype, i2), t2;
}
function h() {
  return h = Object.assign || function(t2) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var e2 = arguments[i2];
      for (var n2 in e2) Object.prototype.hasOwnProperty.call(e2, n2) && (t2[n2] = e2[n2]);
    }
    return t2;
  }, h.apply(this, arguments);
}
function r(t2, i2) {
  t2.prototype = Object.create(i2.prototype), t2.prototype.constructor = t2, a(t2, i2);
}
function o(t2) {
  return o = Object.setPrototypeOf ? Object.getPrototypeOf : function(t3) {
    return t3.__proto__ || Object.getPrototypeOf(t3);
  }, o(t2);
}
function a(t2, i2) {
  return a = Object.setPrototypeOf || function(t3, i3) {
    return t3.__proto__ = i3, t3;
  }, a(t2, i2);
}
function u() {
  if ("undefined" == typeof Reflect || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if ("function" == typeof Proxy) return true;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), true;
  } catch (t2) {
    return false;
  }
}
function c(t2, i2, e2) {
  return c = u() ? Reflect.construct : function(t3, i3, e3) {
    var n2 = [null];
    n2.push.apply(n2, i3);
    var s2 = new (Function.bind.apply(t3, n2))();
    return e3 && a(s2, e3.prototype), s2;
  }, c.apply(null, arguments);
}
function d(t2) {
  var i2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
  return d = function(t3) {
    if (null === t3 || -1 === Function.toString.call(t3).indexOf("[native code]")) return t3;
    if ("function" != typeof t3) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== i2) {
      if (i2.has(t3)) return i2.get(t3);
      i2.set(t3, e2);
    }
    function e2() {
      return c(t3, arguments, o(this).constructor);
    }
    return e2.prototype = Object.create(t3.prototype, { constructor: { value: e2, enumerable: false, writable: true, configurable: true } }), a(e2, t3);
  }, d(t2);
}
function l(t2) {
  if (void 0 === t2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return t2;
}
function f(t2, i2) {
  (null == i2 || i2 > t2.length) && (i2 = t2.length);
  for (var e2 = 0, n2 = new Array(i2); e2 < i2; e2++) n2[e2] = t2[e2];
  return n2;
}
var v = 0;
function b(t2) {
  return "__private_" + v++ + "_" + t2;
}
function w(t2, i2) {
  if (!Object.prototype.hasOwnProperty.call(t2, i2)) throw new TypeError("attempted to use private field on non-instance");
  return t2;
}
var m = {};
m.CustomEvent = "function" == typeof CustomEvent ? CustomEvent : (function(t2) {
  return i2[t2] = new i2("").constructor[t2], i2;
  function i2(t3, i3) {
    i3 || (i3 = {});
    var e2 = document.createEvent("CustomEvent");
    return e2.initCustomEvent(t3, !!i3.bubbles, !!i3.cancelable, i3.detail), e2;
  }
})("prototype");
var p, y, O = m.CustomEvent, j = b("mediaElement"), g = b("currentTime"), A = b("enabled"), k = (function() {
  function t2(t3) {
    Object.defineProperty(this, j, { writable: true, value: void 0 }), Object.defineProperty(this, g, { writable: true, value: void 0 }), Object.defineProperty(this, A, { writable: true, value: void 0 }), this.seeking = void 0, w(this, j)[j] = t3, w(this, g)[g] = 0, w(this, A)[A] = false, this.seeking = false, this.t = this.t.bind(this), this.i = this.i.bind(this), this.h = this.h.bind(this), this.enable();
  }
  var i2 = t2.prototype;
  return i2.i = function() {
    this.seeking = true;
  }, i2.h = function() {
    this.seeking = false;
  }, i2.t = function() {
    var t3, i3;
    this.seeking || null != (t3 = w(this, j)[j]) && t3.paused || (w(this, g)[g] = null == (i3 = w(this, j)[j]) ? void 0 : i3.currentTime);
  }, i2.enable = function() {
    var t3, i3, e2;
    w(this, A)[A] || (null == (t3 = w(this, j)[j]) || t3.addEventListener("seeking", this.i), null == (i3 = w(this, j)[j]) || i3.addEventListener("seeked", this.h), null == (e2 = w(this, j)[j]) || e2.addEventListener("timeupdate", this.t), w(this, A)[A] = true);
  }, i2.disable = function() {
    var t3, i3, e2;
    w(this, A)[A] && (null == (t3 = w(this, j)[j]) || t3.removeEventListener("seeking", this.i), null == (i3 = w(this, j)[j]) || i3.removeEventListener("seeked", this.h), null == (e2 = w(this, j)[j]) || e2.removeEventListener("timeupdate", this.t), w(this, A)[A] = false);
  }, i2.play = function() {
    var t3 = this;
    return new Promise(function(i3) {
      var e2;
      i3(null == (e2 = w(t3, j)[j]) ? void 0 : e2.play());
    });
  }, i2.pause = function() {
    var t3;
    null == (t3 = w(this, j)[j]) || t3.pause();
  }, i2.reset = function() {
    w(this, g)[g] = 0, w(this, A)[A] = false, this.seeking = false, this.enable();
  }, i2.destroy = function() {
    w(this, g)[g] = 0, w(this, A)[A] = false, this.seeking = false, this.disable(), w(this, j)[j] = void 0;
  }, s(t2, [{ key: "enabled", get: function() {
    return w(this, A)[A];
  } }, { key: "currentTime", get: function() {
    return w(this, g)[g];
  } }, { key: "duration", get: function() {
    var t3;
    return null == (t3 = w(this, j)[j]) ? void 0 : t3.duration;
  } }, { key: "muted", get: function() {
    var t3;
    return null == (t3 = w(this, j)[j]) ? void 0 : t3.muted;
  } }, { key: "volume", get: function() {
    var t3;
    return null == (t3 = w(this, j)[j]) ? void 0 : t3.volume;
  } }]), t2;
})(), C = (function() {
  function t2() {
    this.delegate = document.createDocumentFragment();
  }
  var i2 = t2.prototype;
  return i2.addEventListener = function() {
    this.delegate.addEventListener.apply(this.delegate, [].slice.call(arguments));
  }, i2.dispatchEvent = function() {
    return this.delegate.dispatchEvent.apply(this.delegate, [].slice.call(arguments));
  }, i2.removeEventListener = function() {
    return this.delegate.removeEventListener.apply(this.delegate, [].slice.call(arguments));
  }, t2;
})(), P = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"];
!(function(t2) {
  t2.MEDIA_START = "MediaStart", t2.MEDIA_IMPRESSION = "MediaImpression", t2.MEDIA_STOP = "MediaStop", t2.MEDIA_CUE_POINTS_CHANGE = "MediaCuePointsChange", t2.MEDIA_RESUMED = "MediaResumed";
})(p || (p = {})), (function(t2) {
  t2.AD_ERROR = "AdError", t2.AD_BUFFERING = "AdBuffering", t2.LOADED = "AdLoaded", t2.IMPRESSION = "AdImpression", t2.STARTED = "AdStarted", t2.FIRST_QUARTILE = "AdFirstQuartile", t2.MIDPOINT = "AdMidpoint", t2.THIRD_QUARTILE = "AdThirdQuartile", t2.AD_PROGRESS = "AdProgress", t2.COMPLETE = "AdComplete", t2.CLICK = "AdClick", t2.PAUSED = "AdPaused", t2.RESUMED = "AdResumed", t2.SKIPPED = "AdSkipped", t2.SKIPPABLE_STATE_CHANGED = "AdSkippableStateChanged", t2.VOLUME_CHANGED = "AdVolumeChanged", t2.VOLUME_MUTED = "AdMuted", t2.AD_METADATA = "AdMetadata", t2.AD_BREAK_READY = "AdBreakReady", t2.CONTENT_PAUSE_REQUESTED = "AdContentPauseRequested", t2.CONTENT_RESUME_REQUESTED = "AdContentResumeRequested", t2.ALL_ADS_COMPLETED = "AdAllAdsCompleted", t2.DURATION_CHANGE = "AdDurationChange", t2.INTERACTION = "AdInteraction", t2.LINEAR_CHANGED = "AdLinearChanged", t2.LOG = "AdLog", t2.USER_CLOSE = "AdUserClose", t2.AD_CAN_PLAY = "AdCanPlay", t2.EXPANDED_CHANGED = "AdExpandedChanged", t2.VIEWABLE_IMPRESSION = "AdViewableImpression";
})(y || (y = {}));
var R = h({}, y, p), E = function() {
  this.disableCustomPlaybackForIOS10Plus = false, this.autoResize = true, this.clickTrackingElement = void 0;
}, T = (function(t2) {
  function i2() {
    var i3;
    return (i3 = t2.call.apply(t2, [this].concat([].slice.call(arguments))) || this).errorCode = void 0, i3.innerError = void 0, i3.type = void 0, i3.vastErrorCode = void 0, i3;
  }
  return r(i2, t2), i2;
})(d(Error));
T.ERROR_CODE_ADS_MANAGER_LOADED_TIMEOUT = 9e3, T.ERROR_CODE_REQUEST_ADS_TIMEOUT = 9001;
var S = b("mediaElement"), M = b("adElement"), x = b("customPlayhead"), I = b("adsRenderingSettings"), B = b("ima"), L = b("adDisplayContainer"), D = b("adsManager"), W = b("width"), _ = b("height"), q = b("adsLoader"), F = b("playerOptions"), N = b("resizeObserver"), V = b("currentAd"), G = b("loadedAd"), Q = b("mediaStartTriggered"), U = b("mediaImpressionTriggered"), z = b("mediaInActivation"), Z = b("customPlaybackTimeAdjustedOnEnded"), $ = b("cuePoints"), H = b("adCurrentTime"), J = b("adDuration"), K = b("startAdCallback"), X = b("adsManagerLoadedTimeout"), Y = b("requestAdsTimeout"), tt = b("wasExternallyPaused"), it = b("lastNonZeroAdVolume"), et = b("activatePromise"), nt = (function(t2) {
  function i2(i3, e3, n2, s2, h2) {
    var r2;
    void 0 === s2 && (s2 = new i3.AdsRenderingSettings()), void 0 === h2 && (h2 = new E()), r2 = t2.call(this) || this, Object.defineProperty(l(r2), S, { writable: true, value: void 0 }), Object.defineProperty(l(r2), M, { writable: true, value: void 0 }), Object.defineProperty(l(r2), x, { writable: true, value: void 0 }), Object.defineProperty(l(r2), I, { writable: true, value: void 0 }), Object.defineProperty(l(r2), B, { writable: true, value: void 0 }), Object.defineProperty(l(r2), L, { writable: true, value: void 0 }), Object.defineProperty(l(r2), D, { writable: true, value: void 0 }), Object.defineProperty(l(r2), W, { writable: true, value: void 0 }), Object.defineProperty(l(r2), _, { writable: true, value: void 0 }), Object.defineProperty(l(r2), q, { writable: true, value: void 0 }), Object.defineProperty(l(r2), F, { writable: true, value: void 0 }), Object.defineProperty(l(r2), N, { writable: true, value: void 0 }), Object.defineProperty(l(r2), V, { writable: true, value: void 0 }), Object.defineProperty(l(r2), G, { writable: true, value: void 0 }), Object.defineProperty(l(r2), Q, { writable: true, value: false }), Object.defineProperty(l(r2), U, { writable: true, value: false }), Object.defineProperty(l(r2), z, { writable: true, value: false }), Object.defineProperty(l(r2), Z, { writable: true, value: false }), Object.defineProperty(l(r2), $, { writable: true, value: [] }), Object.defineProperty(l(r2), H, { writable: true, value: void 0 }), Object.defineProperty(l(r2), J, { writable: true, value: void 0 }), Object.defineProperty(l(r2), K, { writable: true, value: void 0 }), Object.defineProperty(l(r2), X, { writable: true, value: void 0 }), Object.defineProperty(l(r2), Y, { writable: true, value: void 0 }), Object.defineProperty(l(r2), tt, { writable: true, value: false }), Object.defineProperty(l(r2), it, { writable: true, value: 1 }), Object.defineProperty(l(r2), et, { writable: true, value: Promise.resolve() }), w(l(r2), S)[S] = e3, w(l(r2), M)[M] = n2, w(l(r2), B)[B] = i3, w(l(r2), F)[F] = h2, w(l(r2), I)[I] = s2, w(l(r2), I)[I].restoreCustomPlaybackStateOnAdBreakComplete = true, h2.disableCustomPlaybackForIOS10Plus && !w(l(r2), S)[S].hasAttribute("playsinline") && w(l(r2), S)[S].setAttribute("playsinline", ""), w(l(r2), B)[B].settings.setDisableCustomPlaybackForIOS10Plus(h2.disableCustomPlaybackForIOS10Plus), w(l(r2), x)[x] = new k(w(l(r2), S)[S]), r2.o = r2.o.bind(l(r2)), P.forEach(function(t3) {
      w(l(r2), S)[S].addEventListener(t3, r2.o);
    }), r2.u = r2.u.bind(l(r2)), r2.l = r2.l.bind(l(r2));
    var o2 = w(l(r2), S)[S], a2 = o2.offsetHeight, u2 = o2.offsetWidth;
    return w(l(r2), W)[W] = u2, w(l(r2), _)[_] = a2, h2.autoResize && window.ResizeObserver && (w(l(r2), N)[N] = new window.ResizeObserver(function(t3) {
      return r2.v(t3);
    }), w(l(r2), N)[N].observe(w(l(r2), S)[S])), r2;
  }
  r(i2, t2);
  var e2 = i2.prototype;
  return e2.activate = function() {
    var t3 = this;
    if (!w(this, Q)[Q] && !w(this, z)[z] && (w(this, z)[z] = true, w(this, S)[S].paused)) {
      var i3 = function() {
        return w(t3, S)[S].pause(), new Promise(function(i4) {
          setTimeout(function() {
            w(t3, z)[z] = false, i4();
          }, 1);
        });
      };
      w(this, et)[et] = new Promise(function(i4) {
        return i4(w(t3, S)[S].play());
      }).then(i3).catch(i3);
    }
  }, e2.playAds = function(t3) {
    this.m(t3);
  }, e2.loadAds = function(t3, i3) {
    this.m(t3, false, i3);
  }, e2.p = function() {
    var t3 = this;
    return w(this, et)[et].then(function() {
      return new Promise(function(i3) {
        return i3(w(t3, S)[S].play());
      });
    });
  }, e2.m = function(t3, i3, e3) {
    var n2 = this;
    void 0 === i3 && (i3 = true), this.reset(), this.O(), w(this, B)[B].settings.setAutoPlayAdBreaks(i3), w(this, S)[S].ended && (w(this, x)[x].reset(), w(this, S)[S].currentTime = 0), w(this, K)[K] = e3, t3.linearAdSlotWidth = w(this, W)[W], t3.linearAdSlotHeight = w(this, _)[_], t3.nonLinearAdSlotWidth = w(this, W)[W], t3.nonLinearAdSlotHeight = w(this, _)[_], null == t3.contentDuration && (t3.contentDuration = -3), w(this, X)[X] = window.setTimeout(function() {
      var t4 = new T("No adsManagerLoadedEvent within 5000ms.");
      t4.errorCode = T.ERROR_CODE_ADS_MANAGER_LOADED_TIMEOUT, n2.j(t4);
    }, 5e3), w(this, Y)[Y] = window.setTimeout(function() {
      var t4 = new T("No response for ads-request within 10000ms.");
      t4.errorCode = T.ERROR_CODE_REQUEST_ADS_TIMEOUT, n2.j(t4);
    }, 1e4), w(this, q)[q].requestAds(t3);
  }, e2.O = function() {
    w(this, L)[L] = new (w(this, B))[B].AdDisplayContainer(w(this, M)[M], w(this, F)[F].disableCustomPlaybackForIOS10Plus ? void 0 : w(this, S)[S], w(this, F)[F].clickTrackingElement), w(this, q)[q] = new (w(this, B))[B].AdsLoader(w(this, L)[L]), w(this, q)[q].addEventListener(w(this, B)[B].AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.u, false), w(this, q)[q].addEventListener(w(this, B)[B].AdErrorEvent.Type.AD_ERROR, this.l, false);
  }, e2.skipAd = function() {
    w(this, D)[D] && w(this, D)[D].skip();
  }, e2.discardAdBreak = function() {
    w(this, D)[D] && w(this, D)[D].discardAdBreak();
  }, e2.play = function() {
    var t3 = this;
    w(this, tt)[tt] = false, !w(this, x)[x].enabled && w(this, D)[D] ? w(this, D)[D].resume() : w(this, X)[X] || this.p().then(function() {
    }).catch(function() {
      t3.dispatchEvent(new O("pause"));
    });
  }, e2.pause = function() {
    w(this, tt)[tt] = true, !w(this, x)[x].enabled && w(this, D)[D] ? w(this, D)[D].pause() : w(this, S)[S].pause();
  }, e2.g = function(t3) {
    w(this, $)[$] = [].concat(t3), this.dispatchEvent(new O(R.MEDIA_CUE_POINTS_CHANGE, { detail: { cuePoints: [].concat(w(this, $)[$]) } }));
  }, e2.A = function(t3) {
    var i3 = this.cuePoints.indexOf(t3);
    i3 > -1 && (w(this, $)[$].splice(i3, 1), this.g(w(this, $)[$]));
  }, e2.resizeAd = function(t3, i3) {
    w(this, W)[W] = t3, w(this, _)[_] = i3, w(this, D)[D] && w(this, D)[D].resize(t3, i3, this.k()), w(this, M)[M].style.width = t3 + "px", w(this, M)[M].style.height = i3 + "px";
  }, e2.reset = function(t3) {
    void 0 === t3 && (t3 = false), t3 && (w(this, U)[U] = false, w(this, Q)[Q] = false, w(this, Z)[Z] = false), this.C(), w(this, $)[$] = [], w(this, tt)[tt] = false, w(this, K)[K] = void 0, w(this, D)[D] && w(this, D)[D].destroy(), w(this, D)[D] = void 0, w(this, B)[B].settings.setAutoPlayAdBreaks(true), t3 && this.P(), w(this, M)[M].style.display = "none";
  }, e2.P = function() {
    w(this, q)[q] && (w(this, q)[q].removeEventListener(w(this, B)[B].AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.u, false), w(this, q)[q].removeEventListener(w(this, B)[B].AdErrorEvent.Type.AD_ERROR, this.l, false), w(this, q)[q].destroy()), w(this, L)[L] && w(this, L)[L].destroy();
  }, e2.destroy = function() {
    var t3, i3, e3, n2, s2 = this;
    this.reset(true), w(this, x)[x].destroy(), P.forEach(function(t4) {
      w(s2, S)[S].removeEventListener(t4, s2.o);
    }), null == (t3 = w(this, q)[q]) || t3.removeEventListener(w(this, B)[B].AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.u, false), null == (i3 = w(this, L)[L]) || i3.destroy(), null == (e3 = w(this, q)[q]) || e3.destroy(), w(this, U)[U] = false, w(this, Z)[Z] = false, w(this, Q)[Q] = false, null == (n2 = w(this, N)[N]) || n2.disconnect();
  }, e2.isCustomPlaybackUsed = function() {
    return false === w(this, B)[B].settings.getDisableCustomPlaybackForIOS10Plus() && !w(this, M)[M].querySelector("video");
  }, e2.C = function() {
    window.clearTimeout(w(this, X)[X]), window.clearTimeout(w(this, Y)[Y]), w(this, X)[X] = void 0, w(this, Y)[Y] = void 0, w(this, V)[V] = void 0, w(this, H)[H] = void 0, w(this, J)[J] = void 0, w(this, M)[M].style.display = "none", w(this, M)[M].classList.remove("nonlinear"), w(this, D)[D] && this.R();
  }, e2.o = function(t3) {
    var i3 = this;
    if (w(this, x)[x].enabled || "volumechange" === t3.type) {
      if ("timeupdate" === t3.type) {
        if (w(this, D)[D]) {
          var e3 = w(this, D)[D].getCuePoints().filter(function(t4) {
            return t4 >= 0 && t4 < w(i3, x)[x].currentTime;
          }).pop();
          this.A(e3);
        }
        !w(this, U)[U] && w(this, Q)[Q] && w(this, S)[S].currentTime >= 0.5 && (this.dispatchEvent(new O(R.MEDIA_IMPRESSION)), w(this, U)[U] = true);
      }
      if ("play" !== t3.type || w(this, Q)[Q] || w(this, z)[z] || (this.dispatchEvent(new O(R.MEDIA_START)), w(this, Q)[Q] = true), "ended" === t3.type && (this.isCustomPlaybackUsed() && w(this, S)[S].currentTime === w(this, S)[S].duration && w(this, $)[$].indexOf(-1) > -1 && (w(this, S)[S].currentTime = w(this, S)[S].duration - 1e-5, w(this, Z)[Z] = true), w(this, q)[q].contentComplete(), w(this, D)[D] || this.T()), !window.ResizeObserver && w(this, F)[F].autoResize && "loadedmetadata" === t3.type) {
        var n2 = w(this, S)[S], s2 = n2.offsetHeight, h2 = n2.offsetWidth;
        w(this, W)[W] = h2, w(this, _)[_] = s2, this.R();
      }
      w(this, z)[z] && "volumechange" !== t3.type || this.dispatchEvent(new O(t3.type));
    }
  }, e2.S = function(t3) {
    var i3 = this, e3 = w(this, B)[B].AdEvent;
    switch (t3.type) {
      case e3.Type.LOADED:
        var n2 = t3.getAd();
        w(this, K)[K] && 0 === w(this, $)[$].length ? w(this, K)[K]({ ad: n2, start: function() {
          i3.M(), w(i3, K)[K] = void 0;
        }, startWithoutReset: function() {
          i3.M();
        } }) : w(this, G)[G] = n2;
        break;
      case e3.Type.AD_BREAK_READY:
        this.C(), w(this, K)[K] ? (w(this, K)[K]({ ad: w(this, G)[G], adBreakTime: t3.getAdData().adBreakTime, start: function() {
          i3.M(), w(i3, K)[K] = void 0;
        }, startWithoutReset: function() {
          i3.M();
        } }), w(this, G)[G] = void 0) : this.M();
        break;
      case e3.Type.STARTED:
        var s2 = w(this, V)[V] = t3.getAd();
        s2.getAdPodInfo().getAdPosition() > 1 && w(this, D)[D].setVolume(w(this, D)[D].getVolume()), w(this, M)[M].classList.remove("nonlinear"), this.R(), s2.isLinear() ? (w(this, x)[x].disable(), w(this, J)[J] = s2.getDuration(), w(this, H)[H] = 0) : (w(this, M)[M].classList.add("nonlinear"), this.I()), w(this, M)[M].style.display = "", w(this, tt)[tt] && (w(this, tt)[tt] = false, w(this, D)[D].pause());
        break;
      case e3.Type.ALL_ADS_COMPLETED:
        if (w(this, Z)[Z]) return;
        this.isCustomPlaybackUsed() && Boolean(w(this, V)[V]) && -1 !== w(this, V)[V].getAdPodInfo().getTimeOffset() && this.I(), this.reset();
        break;
      case e3.Type.CONTENT_PAUSE_REQUESTED:
        this.C(), w(this, V)[V] = t3.getAd(), w(this, M)[M].style.display = "", w(this, S)[S].pause(), this.R(), w(this, V)[V] && this.A(w(this, V)[V].getAdPodInfo().getTimeOffset()), w(this, D)[D].setVolume(w(this, S)[S].muted ? 0 : w(this, S)[S].volume), w(this, x)[x].disable(), w(this, J)[J] = w(this, V)[V].getDuration(), w(this, H)[H] = 0;
        break;
      case e3.Type.CONTENT_RESUME_REQUESTED:
        var h2 = Boolean(w(this, V)[V]);
        if (h2) {
          var r2 = w(this, D)[D].getVolume();
          w(this, S)[S].muted = 0 === r2, w(this, S)[S].volume = w(this, it)[it];
        }
        w(this, Z)[Z] && (w(this, S)[S].currentTime = w(this, S)[S].duration + 1, w(this, Z)[Z] = false), w(this, S)[S].ended ? (this.reset(), this.T()) : this.C(), h2 && (w(this, tt)[tt] = false, this.I());
        break;
      case e3.Type.AD_METADATA:
        this.g(w(this, D)[D].getCuePoints()), -1 === w(this, $)[$].indexOf(0) && (w(this, K)[K] ? w(this, K)[K]({ start: function() {
          i3.I(), w(i3, K)[K] = void 0;
        }, startWithoutReset: function() {
          i3.I();
        } }) : this.I());
        break;
      case e3.Type.AD_PROGRESS:
        var o2 = t3.getAdData();
        w(this, H)[H] = o2.currentTime, w(this, J)[J] = o2.duration;
        break;
      case e3.Type.LOG:
        var a2 = t3.getAdData();
        w(this, K)[K] ? w(this, K)[K]({ start: function() {
          i3.I(), w(i3, K)[K] = void 0;
        }, startWithoutReset: function() {
          i3.I();
        } }) : a2.adError && !w(this, V)[V] && this.I();
        break;
      case e3.Type.VOLUME_CHANGED:
        var u2 = w(this, D)[D].getVolume();
        u2 > 0 && (w(this, it)[it] = u2);
    }
  }, e2.l = function(t3) {
    this.j(this.B(t3));
  }, e2.u = function(t3) {
    var i3 = this, e3 = w(this, B)[B], n2 = e3.AdEvent, s2 = e3.AdErrorEvent.Type.AD_ERROR;
    window.clearTimeout(w(this, X)[X]);
    var h2 = w(this, D)[D] = t3.getAdsManager(w(this, x)[x], w(this, I)[I]);
    Object.keys(n2.Type).forEach(function(t4) {
      h2.addEventListener(n2.Type[t4], function(e4) {
        if (i3.S(e4), R[t4]) {
          var n3 = ["LOG", "AD_PROGRESS"].indexOf(t4) > -1;
          i3.dispatchEvent(new O(R[t4], { detail: { ad: e4.getAd() || w(i3, V)[V], adData: n3 ? e4.getAdData() : {} } }));
        }
      });
    }), h2.addEventListener(s2, function(t4) {
      return i3.j(i3.B(t4));
    });
    try {
      var r2;
      h2.init(w(this, W)[W], w(this, _)[_], this.k()), h2.setVolume(w(this, S)[S].muted ? 0 : w(this, S)[S].volume), null == (r2 = w(this, L)[L]) || r2.initialize(), w(this, K)[K] || this.M();
    } catch (t4) {
      this.j(new T(t4.message));
    }
  }, e2.M = function() {
    if (w(this, Q)[Q] || (this.dispatchEvent(new O(R.MEDIA_START)), w(this, Q)[Q] = true), w(this, D)[D]) try {
      w(this, D)[D].start();
    } catch (t3) {
      this.j(new T(t3.message));
    }
    else this.I();
  }, e2.T = function() {
    var t3 = this;
    setTimeout(function() {
      w(t3, U)[U] = false, w(t3, Q)[Q] = false, w(t3, Z)[Z] = false, t3.dispatchEvent(new O(R.MEDIA_STOP));
    }, 1);
  }, e2.v = function(t3) {
    for (var i3, e3 = (function(t4, i4) {
      var e4 = "undefined" != typeof Symbol && t4[Symbol.iterator] || t4["@@iterator"];
      if (e4) return (e4 = e4.call(t4)).next.bind(e4);
      if (Array.isArray(t4) || (e4 = (function(t5, i5) {
        if (t5) {
          if ("string" == typeof t5) return f(t5, i5);
          var e5 = Object.prototype.toString.call(t5).slice(8, -1);
          return "Object" === e5 && t5.constructor && (e5 = t5.constructor.name), "Map" === e5 || "Set" === e5 ? Array.from(t5) : "Arguments" === e5 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e5) ? f(t5, i5) : void 0;
        }
      })(t4))) {
        e4 && (t4 = e4);
        var n3 = 0;
        return function() {
          return n3 >= t4.length ? { done: true } : { done: false, value: t4[n3++] };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })(t3); !(i3 = e3()).done; ) {
      var n2 = i3.value;
      n2.contentBoxSize && 1 === n2.contentBoxSize.length ? (w(this, W)[W] = n2.contentBoxSize[0].inlineSize, w(this, _)[_] = n2.contentBoxSize[0].blockSize) : n2.contentBoxSize && n2.contentBoxSize.inlineSize ? (w(this, W)[W] = n2.contentBoxSize.inlineSize, w(this, _)[_] = n2.contentBoxSize.blockSize) : (w(this, W)[W] = n2.contentRect.width, w(this, _)[_] = n2.contentRect.height);
    }
    this.R();
  }, e2.R = function() {
    if (w(this, F)[F].autoResize && w(this, D)[D]) {
      var t3 = w(this, V)[V], i3 = this.k();
      t3 && !t3.isLinear() ? t3 && (t3.getWidth() > w(this, W)[W] || t3.getHeight() > w(this, _)[_] ? this.resizeAd(w(this, W)[W], w(this, _)[_]) : (w(this, D)[D].resize(t3.getWidth(), t3.getHeight() + 20, i3), w(this, M)[M].style.width = t3.getWidth() + "px", w(this, M)[M].style.height = t3.getHeight() + 20 + "px")) : this.resizeAd(w(this, W)[W], w(this, _)[_]);
    }
  }, e2.k = function() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || w(this, S)[S].webkitDisplayingFullscreen ? w(this, B)[B].ViewMode.FULLSCREEN : w(this, B)[B].ViewMode.NORMAL;
  }, e2.I = function() {
    var t3 = this;
    w(this, M)[M].style.display = "none", w(this, S)[S].ended || (w(this, x)[x].enable(), w(this, tt)[tt] ? (w(this, S)[S].pause(), this.dispatchEvent(new O("pause"))) : (this.p().then(function() {
    }).catch(function() {
      t3.dispatchEvent(new O("pause"));
    }), this.dispatchEvent(new O("play")), this.dispatchEvent(new O(R.MEDIA_RESUMED))), w(this, tt)[tt] = false);
  }, e2.B = function(t3) {
    var i3 = t3.getError(), e3 = new T(i3.getMessage());
    return e3.type = i3.getType(), e3.errorCode = i3.getErrorCode(), e3.vastErrorCode = i3.getVastErrorCode && i3.getVastErrorCode(), e3.innerError = i3.getInnerError(), e3;
  }, e2.j = function(t3) {
    var i3 = this;
    this.dispatchEvent(new O(R.AD_ERROR, { detail: { error: t3 } })), this.C(), w(this, K)[K] ? w(this, K)[K]({ start: function() {
      i3.I(), w(i3, K)[K] = void 0;
    }, startWithoutReset: function() {
      i3.I();
    } }) : this.I();
  }, s(i2, [{ key: "volume", get: function() {
    return !w(this, x)[x].enabled && w(this, D)[D] ? w(this, D)[D].getVolume() : w(this, S)[S].volume;
  }, set: function(t3) {
    !w(this, x)[x].enabled && w(this, D)[D] && w(this, D)[D].setVolume(t3), w(this, S)[S].volume = t3;
  } }, { key: "muted", get: function() {
    return !w(this, x)[x].enabled && w(this, D)[D] ? 0 === w(this, D)[D].getVolume() : w(this, S)[S].muted;
  }, set: function(t3) {
    !w(this, x)[x].enabled && w(this, D)[D] && w(this, D)[D].setVolume(t3 ? 0 : w(this, it)[it]), w(this, S)[S].muted = t3;
  } }, { key: "currentTime", get: function() {
    return void 0 !== w(this, H)[H] ? w(this, H)[H] : w(this, S)[S].currentTime;
  }, set: function(t3) {
    w(this, x)[x].enabled && (w(this, S)[S].currentTime = t3);
  } }, { key: "duration", get: function() {
    return void 0 !== w(this, J)[J] ? w(this, J)[J] : w(this, S)[S].duration;
  } }, { key: "cuePoints", get: function() {
    return [].concat(w(this, $)[$]);
  } }]), i2;
})(C);
function artplayerPluginVast(callback) {
  return async (art) => {
    const { template, constructor } = art;
    const { createElement, setStyles } = constructor.utils;
    const { $video, $player } = template;
    await e();
    const google = window.google;
    const ima = google.ima;
    const adsRenderingSettings = new ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    adsRenderingSettings.enablePreloading = true;
    const playerOptions = new E();
    let isAdPlaying = false;
    let imaPlayer = null;
    let $container = null;
    function createContainer() {
      const container = createElement("div");
      const id = `art-vast-${Date.now()}`;
      container.id = id;
      setStyles(container, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        zIndex: "150",
        backgroundColor: "black",
        display: "none",
        pointerEvents: "auto"
      });
      return container;
    }
    function initPlayer() {
      if (imaPlayer)
        return imaPlayer;
      $container = createContainer();
      $player.appendChild($container);
      imaPlayer = new nt(ima, $video, $container, adsRenderingSettings, playerOptions);
      imaPlayer.addEventListener("AdContentPauseRequested", () => {
        isAdPlaying = true;
        $container.style.display = "block";
      });
      imaPlayer.addEventListener("AdContentResumeRequested", () => {
        isAdPlaying = false;
        $container.style.display = "none";
      });
      imaPlayer.addEventListener("AdStarted", () => {
        isAdPlaying = true;
        $container.style.display = "block";
      });
      imaPlayer.addEventListener("AdError", (event) => {
        console.error("VAST Ad Error:", event.detail);
        isAdPlaying = false;
        $container.style.display = "none";
      });
      return imaPlayer;
    }
    function destroyPlayer() {
      if (imaPlayer?.destroy)
        imaPlayer.destroy();
      if ($container?.parentNode)
        $container.parentNode.removeChild($container);
      $container = null;
      imaPlayer = null;
    }
    function playUrl(url, config = {}) {
      if (isAdPlaying)
        return;
      if (!imaPlayer)
        initPlayer();
      const request = new ima.AdsRequest();
      request.adTagUrl = url;
      for (const key in config) {
        request[key] = config[key];
      }
      imaPlayer.playAds(request);
    }
    function playRes(res, config = {}) {
      if (isAdPlaying)
        return;
      if (!imaPlayer)
        initPlayer();
      const request = new ima.AdsRequest();
      request.adsResponse = res;
      for (const key in config) {
        request[key] = config[key];
      }
      imaPlayer.playAds(request);
    }
    if (typeof callback === "function") {
      await callback({
        art,
        playUrl,
        playRes,
        init: initPlayer,
        ima,
        adsRenderingSettings,
        playerOptions,
        get imaPlayer() {
          return imaPlayer;
        },
        get container() {
          return $container;
        }
      });
    }
    return {
      name: "artplayerPluginVast",
      destroy: destroyPlayer
    };
  };
}
export {
  artplayerPluginVast as default
};
