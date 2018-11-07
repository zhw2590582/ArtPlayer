(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.artplayer = {})));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
      return call;
    }

    return assertThisInitialized(self);
  }

  var possibleConstructorReturn = _possibleConstructorReturn;

  var getPrototypeOf = createCommonjsModule(function (module) {
  function _getPrototypeOf(o) {
    module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  module.exports = _getPrototypeOf;
  });

  var setPrototypeOf = createCommonjsModule(function (module) {
  function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  module.exports = _setPrototypeOf;
  });

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) setPrototypeOf(subClass, superClass);
  }

  var inherits = _inherits;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var objectSpread = _objectSpread;

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  var isNativeFunction = _isNativeFunction;

  var construct = createCommonjsModule(function (module) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      module.exports = _construct = Reflect.construct;
    } else {
      module.exports = _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  module.exports = _construct;
  });

  var wrapNativeSuper = createCommonjsModule(function (module) {
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return construct(Class, arguments, getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  module.exports = _wrapNativeSuper;
  });

  var ArtPlayerError =
  /*#__PURE__*/
  function (_Error) {
    inherits(ArtPlayerError, _Error);

    function ArtPlayerError(message, context) {
      var _this;

      classCallCheck(this, ArtPlayerError);

      _this = possibleConstructorReturn(this, getPrototypeOf(ArtPlayerError).call(this, message));

      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(assertThisInitialized(assertThisInitialized(_this)), context || _this.constructor);
      }

      _this.name = 'ArtPlayerError';
      return _this;
    }

    return ArtPlayerError;
  }(wrapNativeSuper(Error));
  function errorHandle(condition, msg) {
    var isFun = typeof condition === 'function';

    if (isFun ? !isFun() : !condition) {
      throw new ArtPlayerError(msg);
    }
  }
  function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
  }
  function getExt(url) {
    if (url.includes('?')) {
      return getExt(url.split('?')[0]);
    }

    if (url.includes('#')) {
      return getExt(url.split('#')[0]);
    }

    return url.trim().toLowerCase().split('.').pop();
  }
  function append(parent, child) {
    if (child instanceof Element) {
      parent.appendChild(child);
    } else {
      parent.insertAdjacentHTML('beforeend', child);
    }

    return parent.lastElementChild;
  }
  function setStyle(element, key, value) {
    element.style[key] = value;
    return element;
  }
  function setStyles(element, styles) {
    Object.keys(styles).forEach(function (key) {
      setStyle(element, key, styles[key]);
    });
    return element;
  }
  function secondToTime(second) {
    var add0 = function add0(num) {
      return num < 10 ? "0".concat(num) : String(num);
    };

    var hour = Math.floor(second / 3600);
    var min = Math.floor((second - hour * 3600) / 60);
    var sec = Math.floor(second - hour * 3600 - min * 60);
    return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
  }
  function deepMerge() {
    var isObject = function isObject(value) {
      return value !== null && _typeof_1(value) === 'object';
    };

    var returnValue = {};

    for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
      sources[_key] = arguments[_key];
    }

    for (var _i = 0; _i < sources.length; _i++) {
      var source = sources[_i];

      if (Array.isArray(source)) {
        if (!Array.isArray(returnValue)) {
          returnValue = [];
        }

        returnValue = toConsumableArray(returnValue).concat(toConsumableArray(source));
      } else if (isObject(source)) {
        if (source instanceof Element) {
          return source;
        }

        for (var key in source) {
          if (source.hasOwnProperty(key)) {
            var value = source[key];

            if (isObject(value) && key in returnValue) {
              value = deepMerge(returnValue[key], value);
            }

            returnValue = objectSpread({}, returnValue, defineProperty({}, key, value));
          }
        }
      }
    }

    return returnValue;
  }
  function getStorage(key) {
    var storage = JSON.parse(localStorage.getItem('artplayer_settings')) || {};
    return key ? storage[key] : storage;
  }
  function setStorage(key, value) {
    var storage = Object.assign({}, getStorage(), defineProperty({}, key, value));
    localStorage.setItem('artplayer_settings', JSON.stringify(storage));
  }
  function tooltip(target, msg) {
    var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'up';
    target.setAttribute('data-balloon', msg);
    target.setAttribute('data-balloon-pos', pos);
  }
  function sleep() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }
  function sublings(target) {
    return Array.from(target.parentElement.children).filter(function (item) {
      return item !== target;
    });
  }
  function debounce(func, wait, context) {
    var timeout;

    function fn() {
      var args = arguments;

      var later = function later() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }

    fn.clearTimeout = function ct() {
      clearTimeout(timeout);
    };

    return fn;
  }

  var optionValidator = createCommonjsModule(function (module, exports) {
  !function(r,t){module.exports=t();}(commonjsGlobal,function(){function c(r){return (c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(r)}var u=Object.prototype.toString,i=function(r){if(void 0===r)return "undefined";if(null===r)return "null";var t,e,n,o,a,i=c(r);if("boolean"===i)return "boolean";if("string"===i)return "string";if("number"===i)return "number";if("symbol"===i)return "symbol";if("function"===i)return "GeneratorFunction"===f(r)?"generatorfunction":"function";if(t=r,Array.isArray?Array.isArray(t):t instanceof Array)return "array";if(function(r){if(r.constructor&&"function"==typeof r.constructor.isBuffer)return r.constructor.isBuffer(r);return !1}(r))return "buffer";if(function(r){try{if("number"==typeof r.length&&"function"==typeof r.callee)return !0}catch(r){if(-1!==r.message.indexOf("callee"))return !0}return !1}(r))return "arguments";if((e=r)instanceof Date||"function"==typeof e.toDateString&&"function"==typeof e.getDate&&"function"==typeof e.setDate)return "date";if((n=r)instanceof Error||"string"==typeof n.message&&n.constructor&&"number"==typeof n.constructor.stackTraceLimit)return "error";if((o=r)instanceof RegExp||"string"==typeof o.flags&&"boolean"==typeof o.ignoreCase&&"boolean"==typeof o.multiline&&"boolean"==typeof o.global)return "regexp";switch(f(r)){case"Symbol":return "symbol";case"Promise":return "promise";case"WeakMap":return "weakmap";case"WeakSet":return "weakset";case"Map":return "map";case"Set":return "set";case"Int8Array":return "int8array";case"Uint8Array":return "uint8array";case"Uint8ClampedArray":return "uint8clampedarray";case"Int16Array":return "int16array";case"Uint16Array":return "uint16array";case"Int32Array":return "int32array";case"Uint32Array":return "uint32array";case"Float32Array":return "float32array";case"Float64Array":return "float64array"}if("function"==typeof(a=r).throw&&"function"==typeof a.return&&"function"==typeof a.next)return "generator";switch(i=u.call(r)){case"[object Object]":return "object";case"[object Map Iterator]":return "mapiterator";case"[object Set Iterator]":return "setiterator";case"[object String Iterator]":return "stringiterator";case"[object Array Iterator]":return "arrayiterator"}return i.slice(8,-1).toLowerCase().replace(/\s/g,"")};function f(r){return r.constructor?r.constructor.name:null}function a(r,t){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:["option"];for(var n in y(r,t,e),l(r,t,e),p(r,t,e),t)if(t.hasOwnProperty(n)){var o=r[n],a=t[n],i=e.concat(n);if(s(r,n,a,i))continue;y(o,a,i),l(o,a,i),p(o,a,i);}}function s(r,t,e,n){if(!Object.prototype.hasOwnProperty.call(r,t)){if(!0===e.__required__||!0===e.required)throw new TypeError("'".concat(n.join("."),"' is required"));return !0}}function y(r,t,e){var n;if("string"===i(t)?n=t:t.__type__?n=t.__type__:t.type&&(n=t.type),n&&"string"===i(n)){n=n.trim().toLowerCase();var o=i(r),a=o===n;if(-1<n.indexOf("|"))a=n.split("|").filter(Boolean).some(function(r){return o===r.trim()});if(!a)throw new TypeError("'".concat(e.join("."),"' require '").concat(n,"' type, but got '").concat(o,"'"))}}function l(r,t,e){var n;if(t.___validator__?n=t.___validator__:t.validator&&(n=t.validator),"function"===i(n)){var o=n(e,r,i(r));if(!0!==o)throw new TypeError("The scheme for '".concat(e.join("."),"' validator function require return true, but got '").concat(o,"'"))}}function p(r,t,e){var n;if(t.___child__?n=t.___child__:t.child&&(n=t.child),"object"===i(n)){var o=i(r);"object"===o?a(r,n,e):"array"===o&&r.forEach(function(r,t){a(r,n,e.concat(t));});}}return a.kindOf=i,window.optionValidator=a});
  });

  function validElement(paths, value, type) {
    if (type === 'string') {
      if (value.trim() === '') {
        throw new ArtPlayerError("".concat(paths.join('.'), " can not be empty'"));
      } else {
        return true;
      }
    }

    if (value instanceof Element) {
      return true;
    }

    throw new ArtPlayerError("".concat(paths.join('.'), " require 'string' or 'Element' type, but got '").concat(type, "'"));
  }

  var scheme = {
    container: {
      validator: validElement,
      required: true
    },
    url: {
      type: 'string',
      required: true
    },
    title: 'string',
    volume: 'number',
    thumbnails: {
      type: 'object',
      child: {
        url: 'string',
        number: 'number',
        width: 'number',
        height: 'number',
        column: 'number'
      }
    },
    screenshot: 'boolean',
    autoplay: 'boolean',
    playbackRate: 'boolean',
    aspectRatio: 'boolean',
    loop: 'boolean',
    type: {
      type: 'string'
    },
    mimeCodec: 'string',
    layers: {
      type: 'array',
      child: {
        name: 'string',
        index: 'number',
        html: {
          validator: validElement
        },
        style: 'object'
      }
    },
    contextmenu: {
      type: 'array',
      child: {
        type: 'object|function',
        name: 'string',
        html: {
          validator: validElement
        },
        click: 'function'
      }
    },
    quality: {
      type: 'array',
      child: {
        default: 'boolean',
        name: 'string',
        url: 'string'
      }
    },
    loading: validElement,
    play: validElement,
    theme: 'string',
    hotkey: 'boolean',
    pip: 'boolean',
    mutex: 'boolean',
    fullscreen: 'boolean',
    fullscreenWeb: 'boolean',
    subtitle: {
      type: 'object',
      child: {
        url: 'string',
        style: 'object'
      }
    },
    controls: {
      type: 'array',
      child: {
        option: {
          type: 'object',
          child: {
            disable: 'boolean',
            position: 'boolean',
            index: 'number'
          }
        }
      }
    },
    highlight: {
      type: 'array',
      child: {
        time: 'number',
        text: 'string'
      }
    },
    moreVideoAttr: 'object',
    lang: 'string'
  };

  var mimeCodec = {
    mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
    webm: 'video/webm; codecs="vorbis, vp8"',
    ts: 'video/mp2t; codecs="avc1.42E01E, mp4a.40.2"'
  };

  var mse = {
    mediaSource: {
      propertys: ['activeSourceBuffers', 'duration', 'readyState', 'sourceBuffers'],
      methods: ['addSourceBuffer', 'endOfStream', 'removeSourceBuffer', 'clearLiveSeekableRange', 'setLiveSeekableRange'],
      events: ['sourceclose', 'sourceended', 'sourceopen']
    },
    sourceBuffer: {
      propertys: ['mode', 'updating', 'buffered', 'timestampOffset', 'audioTracks', 'videoTracks', 'textTracks', 'appendWindowStart', 'appendWindowEnd', 'trackDefaults'],
      methods: ['appendBuffer', 'appendStream', 'abort', 'remove'],
      events: ['abort', 'error', 'update', 'updateend', 'updatestart']
    },
    sourceBufferList: {
      propertys: ['length'],
      events: ['addsourcebuffer', 'removesourcebuffer']
    }
  };

  var video = {
    propertys: ['audioTracks', 'autoplay', 'buffered', 'controller', 'controls', 'crossOrigin', 'currentSrc', 'currentTime', 'defaultMuted', 'defaultPlaybackRate', 'duration', 'ended', 'error', 'loop', 'mediaGroup', 'muted', 'networkState', 'paused', 'playbackRate', 'played', 'preload', 'readyState', 'seekable', 'seeking', 'src', 'startDate', 'textTracks', 'videoTracks', 'volume'],
    methods: ['addTextTrack', 'canPlayType', 'load', 'play', 'pause'],
    events: ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']
  };

  var config = {
    mimeCodec: mimeCodec,
    mse: mse,
    video: video
  };

  function E () {
    // Keep this empty so it's easier to inherit from
    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
  }

  E.prototype = {
    on: function (name, callback, ctx) {
      var e = this.e || (this.e = {});

      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx
      });

      return this;
    },

    once: function (name, callback, ctx) {
      var self = this;
      function listener () {
        self.off(name, listener);
        callback.apply(ctx, arguments);
      }
      listener._ = callback;
      return this.on(name, listener, ctx);
    },

    emit: function (name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;

      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }

      return this;
    },

    off: function (name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];

      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback)
            liveEvents.push(evts[i]);
        }
      }

      // Remove event from queue to prevent memory leak
      // Suggested by https://github.com/lazd
      // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

      (liveEvents.length)
        ? e[name] = liveEvents
        : delete e[name];

      return this;
    }
  };

  var tinyEmitter = E;

  var Template = function Template(art) {
    classCallCheck(this, Template);

    var refs = art.refs;
    refs.$container.innerHTML = "\n      <div class=\"artplayer-video-player\">\n        <video class=\"artplayer-video\"></video>\n        <div class=\"artplayer-subtitle\"></div>\n        <div class=\"artplayer-danmu\"></div>\n        <div class=\"artplayer-layers\"></div>\n        <div class=\"artplayer-mask\"></div>\n        <div class=\"artplayer-bottom\">\n          <div class=\"artplayer-progress\"></div>\n          <div class=\"artplayer-controls\">\n            <div class=\"artplayer-controls-left\"></div>\n            <div class=\"artplayer-controls-right\"></div>\n          </div>\n        </div>\n        <div class=\"artplayer-loading\"></div>\n        <div class=\"artplayer-notice\">\n          <div class=\"artplayer-notice-inner\"></div>\n        </div>\n        <div class=\"artplayer-setting\">\n          <div class=\"artplayer-setting-inner\">\n            <div class=\"artplayer-setting-body\"></div>\n            <div class=\"artplayer-setting-close\">\xD7</div>\n          </div>\n        </div>\n        <div class=\"artplayer-info\">\n          <div class=\"artplayer-info-panel\"></div>\n          <div class=\"artplayer-info-close\">[x]</div>\n        </div>\n        <div class=\"artplayer-pip-header\">\n          <div class=\"artplayer-pip-title\"></div>\n          <div class=\"artplayer-pip-close\">\xD7</div>\n        </div>\n      </div>\n    ";
    refs.$player = refs.$container.querySelector('.artplayer-video-player');
    refs.$video = refs.$container.querySelector('.artplayer-video');
    refs.$subtitle = refs.$container.querySelector('.artplayer-subtitle');
    refs.$bottom = refs.$container.querySelector('.artplayer-bottom');
    refs.$progress = refs.$container.querySelector('.artplayer-progress');
    refs.$controls = refs.$container.querySelector('.artplayer-controls');
    refs.$controlsLeft = refs.$container.querySelector('.artplayer-controls-left');
    refs.$controlsRight = refs.$container.querySelector('.artplayer-controls-right');
    refs.$layers = refs.$container.querySelector('.artplayer-layers');
    refs.$danmu = refs.$container.querySelector('.artplayer-danmu');
    refs.$loading = refs.$container.querySelector('.artplayer-loading');
    refs.$notice = refs.$container.querySelector('.artplayer-notice');
    refs.$noticeInner = refs.$container.querySelector('.artplayer-notice-inner');
    refs.$mask = refs.$container.querySelector('.artplayer-mask');
    refs.$setting = refs.$container.querySelector('.artplayer-setting');
    refs.$settingInner = refs.$container.querySelector('.artplayer-setting-inner');
    refs.$settingBody = refs.$container.querySelector('.artplayer-setting-body');
    refs.$settingClose = refs.$container.querySelector('.artplayer-setting-close');
    refs.$info = refs.$container.querySelector('.artplayer-info');
    refs.$infoPanel = refs.$container.querySelector('.artplayer-info-panel');
    refs.$infoClose = refs.$container.querySelector('.artplayer-info-close');
    refs.$pipHeader = refs.$container.querySelector('.artplayer-pip-header');
    refs.$pipTitle = refs.$container.querySelector('.artplayer-pip-title');
    refs.$pipClose = refs.$container.querySelector('.artplayer-pip-close');
  };

  var i18nMap = {
    'zh-cn': {
      'About author': '关于作者',
      'Video info': '视频统计信息',
      'Close': '关闭',
      'Video load failed': '视频加载失败',
      'Volume': '音量',
      'Play': '播放',
      'Pause': '暂停',
      'Rate': '速度',
      'Mute': '静音',
      'Reconnect': '重新连接',
      'Hide subtitle': '隐藏字幕',
      'Show subtitle': '显示字幕',
      'Hide danmu': '隐藏弹幕',
      'Show danmu': '显示弹幕',
      'Screenshot': '截图',
      'Play speed': '播放速度',
      'Aspect ratio': '画面比例',
      'Default': '默认',
      'Normal': '正常',
      'Switch video': '切换',
      'Switch subtitle': '切换字幕',
      'Fullscreen': '全屏',
      'Exit fullscreen': '退出全屏',
      'Web fullscreen': '网页全屏',
      'Exit web fullscreen': '退出网页全屏',
      'Common': '常规',
      'Hide setting': '隐藏设置',
      'Show setting': '显示设置',
      'Mini player': '迷你播放器'
    },
    'zh-tw': {
      'About author': '關於作者',
      'Video info': '影片統計訊息',
      'Close': '關閉',
      'Video load failed': '影片載入失敗',
      'Volume': '音量',
      'Play': '播放',
      'Pause': '暫停',
      'Rate': '速度',
      'Mute': '靜音',
      'Reconnect': '重新連接',
      'Hide subtitle': '隱藏字幕',
      'Show subtitle': '顯示字幕',
      'Hide danmu': '隱藏彈幕',
      'Show danmu': '顯示彈幕',
      'Screenshot': '截圖',
      'Play speed': '播放速度',
      'Aspect ratio': '畫面比例',
      'Default': '默認',
      'Normal': '正常',
      'Switch video': '切換',
      'Switch subtitle': '切換字幕',
      'Fullscreen': '全屏',
      'Exit fullscreen': '退出全屏',
      'Web fullscreen': '網頁全屏',
      'Exit web fullscreen': '退出網頁全屏',
      'Common': '常規',
      'Hide setting': '隱藏設置',
      'Show setting': '顯示設置',
      'Mini player': '迷你播放器'
    }
  };

  var I18n =
  /*#__PURE__*/
  function () {
    function I18n(_ref) {
      var option = _ref.option;

      classCallCheck(this, I18n);

      this.option = option;
      this.init();
    }

    createClass(I18n, [{
      key: "init",
      value: function init() {
        this.language = i18nMap[this.option.lang.toLowerCase()] || {};
      }
    }, {
      key: "get",
      value: function get(key) {
        return this.language[key] || key;
      }
    }, {
      key: "update",
      value: function update(callback) {
        i18nMap = callback(i18nMap);
        this.init();
      }
    }]);

    return I18n;
  }();

  function mountUrlMix(art, player) {
    Object.defineProperty(player, 'mountUrl', {
      writable: true,
      value: function value(url) {
        return url;
      }
    });
  }

  function attrInit(art, player) {
    var option = art.option,
        $video = art.refs.$video;
    Object.keys(option.moreVideoAttr).forEach(function (key) {
      $video[key] = option.moreVideoAttr[key];
    });
    $video.volume = clamp(option.volume, 0, 1);
    $video.poster = option.poster;
    $video.autoplay = option.autoplay;
    sleep().then(function () {
      art.emit('beforeMountUrl', option.url);
      $video.src = player.mountUrl(option.url);
    });
  }

  function eventInit(art, player) {
    var option = art.option,
        proxy = art.events.proxy,
        _art$refs = art.refs,
        $player = _art$refs.$player,
        $video = _art$refs.$video,
        i18n = art.i18n,
        notice = art.notice;
    var firstCanplay = false;
    proxy($video, 'click', function () {
      player.toggle();
    });
    config.video.events.forEach(function (eventName) {
      proxy($video, eventName, function (event) {
        art.emit("video:".concat(event.type), event);
      });
    });
    art.on('video:loadstart', function () {
      art.loading.show();
    });
    art.on('video:loadeddata', function () {
      art.loading.hide();
    });
    art.on('video:waiting', function () {
      art.loading.show();
    });
    art.on('video:seeking', function () {
      art.loading.show();
    });
    art.on('video:canplay', function () {
      if (!firstCanplay) {
        firstCanplay = true;
        art.emit('firstCanplay');
      }

      art.controls.show();
      art.mask.show();
      art.loading.hide();

      if (option.autoplay) {
        player.play();
      }
    });
    art.on('video:playing', function () {
      art.isPlaying = true;
      art.controls.hide();
      art.mask.hide();
    });
    art.on('video:pause', function () {
      art.isPlaying = false;
      art.controls.show();
      art.mask.show();
    });
    art.on('video:ended', function () {
      art.isPlaying = false;
      art.controls.show();
      art.mask.show();

      if (option.loop) {
        player.seek(0);
        player.play();
      }
    });
    art.on('video:error', function () {
      if (player.reconnectTime < player.maxReconnectTime) {
        sleep(1000).then(function () {
          player.reconnectTime++;
          $video.src = option.url;
          notice.show("".concat(i18n.get('Reconnect'), ": ").concat(player.reconnectTime));
        });
      } else {
        art.isPlaying = false;
        art.loading.hide();
        art.controls.hide();
        $player.classList.add('artplayer-error');
        sleep(1000).then(function () {
          notice.show(i18n.get('Video load failed'), false);
          art.destroy();
        });
      }
    });
  }

  function playMix(art, player) {
    var $video = art.refs.$video,
        i18n = art.i18n,
        notice = art.notice,
        mutex = art.option.mutex;
    Object.defineProperty(player, 'play', {
      value: function value() {
        var promise = $video.play();

        if (promise !== undefined) {
          promise.then().catch(function (err) {
            notice.show(err, true, 3000);
            console.warn(err);
          });
        }

        if (mutex) {
          art.constructor.instances.filter(function (item) {
            return item !== art;
          }).forEach(function (item) {
            return item.player.pause();
          });
        }

        notice.show(i18n.get('Play'));
        art.emit('play', $video);
      }
    });
  }

  function pauseMin(art, player) {
    var $video = art.refs.$video,
        i18n = art.i18n,
        notice = art.notice;
    Object.defineProperty(player, 'pause', {
      value: function value() {
        $video.pause();
        notice.show(i18n.get('Pause'));
        art.emit('pause', $video);
      }
    });
  }

  function toggleMix(art, player) {
    Object.defineProperty(player, 'toggle', {
      value: function value() {
        if (art.isPlaying) {
          player.pause();
        } else {
          player.play();
        }
      }
    });
  }

  function seekMix(art, player) {
    var $video = art.refs.$video,
        notice = art.notice;
    Object.defineProperty(player, 'seek', {
      value: function value(time) {
        var newTime = Math.max(time, 0);

        if ($video.duration) {
          newTime = Math.min(newTime, $video.duration);
        }

        $video.currentTime = newTime;
        notice.show("".concat(secondToTime(newTime), " / ").concat(secondToTime($video.duration)));
        art.emit('seek', newTime);
      }
    });
  }

  function volumeMix(art, player) {
    var $video = art.refs.$video,
        i18n = art.i18n,
        notice = art.notice;
    Object.defineProperty(player, 'volume', {
      value: function value(percentage) {
        if (percentage !== undefined) {
          $video.volume = clamp(percentage, 0, 1);
          notice.show("".concat(i18n.get('Volume'), ": ").concat(parseInt($video.volume * 100)));

          if ($video.volume !== 0) {
            setStorage('volume', $video.volume);
          }

          art.emit('volume', $video.volume);
        }

        return $video.volume || 0;
      }
    });
  }

  function currentTimeMix(art, player) {
    Object.defineProperty(player, 'currentTime', {
      value: function value() {
        return art.refs.$video.currentTime || 0;
      }
    });
  }

  function durationMix(art, player) {
    Object.defineProperty(player, 'duration', {
      value: function value() {
        return art.refs.$video.duration || 0;
      }
    });
  }

  function switchMix(art, player) {
    var $video = art.refs.$video,
        i18n = art.i18n,
        notice = art.notice,
        isPlaying = art.isPlaying,
        option = art.option;
    Object.defineProperty(player, 'switch', {
      value: function value(url) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'unknown';
        var currentTime = player.currentTime();
        art.emit('beforeMountUrl', url);
        $video.src = player.mountUrl(url);
        option.url = url;
        player.playbackRateRemove();
        player.aspectRatioRemove();
        player.reconnectTime = 0;
        player.seek(currentTime);

        if (isPlaying) {
          player.play();
        }

        notice.show("".concat(i18n.get('Switch video'), ": ").concat(name));
        art.emit('switch', url);
      }
    });
  }

  function playbackRateMix(art, player) {
    var _art$refs = art.refs,
        $video = _art$refs.$video,
        $player = _art$refs.$player,
        i18n = art.i18n,
        notice = art.notice;
    Object.defineProperty(player, 'playbackRate', {
      value: function value(rate) {
        var newRate = clamp(rate, 0.1, 10);
        $video.playbackRate = newRate;
        $player.dataset.playbackRate = newRate;
        notice.show("".concat(i18n.get('Rate'), ": ").concat(newRate === 1 ? i18n.get('Normal') : "".concat(newRate, "x")));
        art.emit('playbackRate', newRate);
      }
    });
    Object.defineProperty(player, 'playbackRateRemove', {
      value: function value() {
        player.playbackRate(1);
        delete $player.dataset.playbackRate;

        if (art.contextmenu.$playbackRate) {
          var $normal = art.contextmenu.$playbackRate.querySelector('.normal');
          sublings($normal).forEach(function (item) {
            return item.classList.remove('current');
          });
          $normal.classList.add('current');
        }
      }
    });
    Object.defineProperty(player, 'playbackRateReset', {
      value: function value() {
        var playbackRate = $player.dataset.playbackRate;

        if (playbackRate) {
          player.playbackRate(Number(playbackRate));
        }
      }
    });
  }

  function aspectRatioMix(art, player) {
    var _art$refs = art.refs,
        $video = _art$refs.$video,
        $player = _art$refs.$player,
        i18n = art.i18n,
        notice = art.notice;
    Object.defineProperty(player, 'aspectRatio', {
      value: function value(ratio) {
        var ratioName = ratio.length === 2 ? "".concat(ratio[0], ":").concat(ratio[1]) : i18n.get('Default');

        if (ratio.length === 2) {
          var videoWidth = $video.videoWidth,
              videoHeight = $video.videoHeight;
          var clientWidth = $player.clientWidth,
              clientHeight = $player.clientHeight;
          var videoRatio = videoWidth / videoHeight;
          var setupRatio = Number(ratio[0]) / Number(ratio[1]);

          if (videoRatio > setupRatio) {
            var percentage = setupRatio * videoHeight / videoWidth;
            setStyle($video, 'width', "".concat(percentage * 100, "%"));
            setStyle($video, 'height', '100%');
            setStyle($video, 'padding', "0 ".concat((clientWidth - clientWidth * percentage) / 2, "px"));
          } else {
            var _percentage = videoWidth / setupRatio / videoHeight;

            setStyle($video, 'width', '100%');
            setStyle($video, 'height', "".concat(_percentage * 100, "%"));
            setStyle($video, 'padding', "".concat((clientHeight - clientHeight * _percentage) / 2, "px 0"));
          }

          $player.dataset.aspectRatio = ratioName;
        } else {
          player.aspectRatioRemove();
        }

        notice.show("".concat(i18n.get('Aspect ratio'), ": ").concat(ratioName));
        art.emit('aspectRatio', ratio);
      }
    });
    Object.defineProperty(player, 'aspectRatioRemove', {
      value: function value() {
        setStyle($video, 'width', null);
        setStyle($video, 'height', null);
        setStyle($video, 'padding', null);
        delete $player.dataset.aspectRatio;

        if (art.contextmenu.$aspectRatio) {
          var $default = art.contextmenu.$aspectRatio.querySelector('.default');
          sublings($default).forEach(function (item) {
            return item.classList.remove('current');
          });
          $default.classList.add('current');
        }
      }
    });
    Object.defineProperty(player, 'aspectRatioReset', {
      value: function value() {
        var aspectRatio = $player.dataset.aspectRatio;

        if (aspectRatio) {
          player.aspectRatio(aspectRatio.split(':'));
        }
      }
    });
  }

  function screenshotMix(art, player) {
    var option = art.option,
        notice = art.notice;

    function captureFrame() {
      var $video = art.refs.$video;
      var canvas = document.createElement('canvas');
      canvas.width = $video.videoWidth;
      canvas.height = $video.videoHeight;
      canvas.getContext('2d').drawImage($video, 0, 0);
      var dataUri = canvas.toDataURL('image/png');
      var elink = document.createElement('a');
      setStyle(elink, 'display', 'none');
      elink.href = dataUri;
      elink.download = "".concat(option.title || 'artplayer', "_").concat(secondToTime($video.currentTime), ".png");
      document.body.appendChild(elink);
      elink.click();
      document.body.removeChild(elink);
    }

    Object.defineProperty(player, 'screenshot', {
      value: function value() {
        try {
          captureFrame();
          art.emit('screenshot');
        } catch (error) {
          notice.show(error);
          console.warn(error);
        }
      }
    });
  }

  var screenfull = createCommonjsModule(function (module) {
  /*!
  * screenfull
  * v3.3.3 - 2018-09-04
  * (c) Sindre Sorhus; MIT License
  */
  (function () {

  	var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
  	var isCommonjs = module.exports;
  	var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

  	var fn = (function () {
  		var val;

  		var fnMap = [
  			[
  				'requestFullscreen',
  				'exitFullscreen',
  				'fullscreenElement',
  				'fullscreenEnabled',
  				'fullscreenchange',
  				'fullscreenerror'
  			],
  			// New WebKit
  			[
  				'webkitRequestFullscreen',
  				'webkitExitFullscreen',
  				'webkitFullscreenElement',
  				'webkitFullscreenEnabled',
  				'webkitfullscreenchange',
  				'webkitfullscreenerror'

  			],
  			// Old WebKit (Safari 5.1)
  			[
  				'webkitRequestFullScreen',
  				'webkitCancelFullScreen',
  				'webkitCurrentFullScreenElement',
  				'webkitCancelFullScreen',
  				'webkitfullscreenchange',
  				'webkitfullscreenerror'

  			],
  			[
  				'mozRequestFullScreen',
  				'mozCancelFullScreen',
  				'mozFullScreenElement',
  				'mozFullScreenEnabled',
  				'mozfullscreenchange',
  				'mozfullscreenerror'
  			],
  			[
  				'msRequestFullscreen',
  				'msExitFullscreen',
  				'msFullscreenElement',
  				'msFullscreenEnabled',
  				'MSFullscreenChange',
  				'MSFullscreenError'
  			]
  		];

  		var i = 0;
  		var l = fnMap.length;
  		var ret = {};

  		for (; i < l; i++) {
  			val = fnMap[i];
  			if (val && val[1] in document) {
  				for (i = 0; i < val.length; i++) {
  					ret[fnMap[0][i]] = val[i];
  				}
  				return ret;
  			}
  		}

  		return false;
  	})();

  	var eventNameMap = {
  		change: fn.fullscreenchange,
  		error: fn.fullscreenerror
  	};

  	var screenfull = {
  		request: function (elem) {
  			var request = fn.requestFullscreen;

  			elem = elem || document.documentElement;

  			// Work around Safari 5.1 bug: reports support for
  			// keyboard in fullscreen even though it doesn't.
  			// Browser sniffing, since the alternative with
  			// setTimeout is even worse.
  			if (/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent)) {
  				elem[request]();
  			} else {
  				elem[request](keyboardAllowed ? Element.ALLOW_KEYBOARD_INPUT : {});
  			}
  		},
  		exit: function () {
  			document[fn.exitFullscreen]();
  		},
  		toggle: function (elem) {
  			if (this.isFullscreen) {
  				this.exit();
  			} else {
  				this.request(elem);
  			}
  		},
  		onchange: function (callback) {
  			this.on('change', callback);
  		},
  		onerror: function (callback) {
  			this.on('error', callback);
  		},
  		on: function (event, callback) {
  			var eventName = eventNameMap[event];
  			if (eventName) {
  				document.addEventListener(eventName, callback, false);
  			}
  		},
  		off: function (event, callback) {
  			var eventName = eventNameMap[event];
  			if (eventName) {
  				document.removeEventListener(eventName, callback, false);
  			}
  		},
  		raw: fn
  	};

  	if (!fn) {
  		if (isCommonjs) {
  			module.exports = false;
  		} else {
  			window.screenfull = false;
  		}

  		return;
  	}

  	Object.defineProperties(screenfull, {
  		isFullscreen: {
  			get: function () {
  				return Boolean(document[fn.fullscreenElement]);
  			}
  		},
  		element: {
  			enumerable: true,
  			get: function () {
  				return document[fn.fullscreenElement];
  			}
  		},
  		enabled: {
  			enumerable: true,
  			get: function () {
  				// Coerce to boolean in case of old WebKit
  				return Boolean(document[fn.fullscreenEnabled]);
  			}
  		}
  	});

  	if (isCommonjs) {
  		module.exports = screenfull;
  	} else {
  		window.screenfull = screenfull;
  	}
  })();
  });

  function fullscreenMix(art, player) {
    var notice = art.notice,
        destroyEvents = art.events.destroyEvents,
        $player = art.refs.$player;

    var screenfullChange = function screenfullChange() {
      player.aspectRatioReset();
      art.emit('fullscreen', screenfull.isFullscreen);
    };

    var screenfullError = function screenfullError() {
      notice.show('Your browser does not seem to support full screen functionality.');
    };

    screenfull.on('change', screenfullChange);
    screenfull.on('error', screenfullError);
    destroyEvents.push(function () {
      screenfull.off('change', screenfullChange);
      screenfull.off('error', screenfullError);
    });
    Object.defineProperty(player, 'fullscreenState', {
      get: function get() {
        return screenfull.isFullscreen;
      }
    });
    Object.defineProperty(player, 'fullscreenEnabled', {
      value: function value() {
        if (player.fullscreenWebState) {
          player.fullscreenWebExit();
        }

        $player.classList.add('artplayer-fullscreen');
        screenfull.request($player);
        art.emit('fullscreen:enabled');
      }
    });
    Object.defineProperty(player, 'fullscreenExit', {
      value: function value() {
        if (player.fullscreenWebState) {
          player.fullscreenWebExit();
        }

        $player.classList.remove('artplayer-fullscreen');
        screenfull.exit();
        art.emit('fullscreen:exit');
      }
    });
    Object.defineProperty(player, 'fullscreenToggle', {
      value: function value() {
        if (player.fullscreenState) {
          player.fullscreenExit();
        } else {
          player.fullscreenEnabled();
        }
      }
    });
  }

  function fullscreenWebMix(art, player) {
    var $player = art.refs.$player;
    Object.defineProperty(player, 'fullscreenWebState', {
      get: function get() {
        return $player.classList.contains('artplayer-web-fullscreen');
      }
    });
    Object.defineProperty(player, 'fullscreenWebEnabled', {
      value: function value() {
        if (player.fullscreenState) {
          player.fullscreenExit();
        }

        $player.classList.add('artplayer-web-fullscreen');
        player.aspectRatioReset();
        art.emit('fullscreenWeb:enabled');
      }
    });
    Object.defineProperty(player, 'fullscreenWebExit', {
      value: function value() {
        if (player.fullscreenState) {
          player.fullscreenExit();
        }

        $player.classList.remove('artplayer-web-fullscreen');
        player.aspectRatioReset();
        art.emit('fullscreenWeb:exit');
      }
    });
    Object.defineProperty(player, 'fullscreenWebToggle', {
      value: function value() {
        if (player.fullscreenWebState) {
          player.fullscreenWebExit();
        } else {
          player.fullscreenWebEnabled();
        }
      }
    });
  }

  var getSize = createCommonjsModule(function (module) {
  /*!
   * getSize v2.0.3
   * measure size of elements
   * MIT license
   */

  /* jshint browser: true, strict: true, undef: true, unused: true */
  /* globals console: false */

  ( function( window, factory ) {
    /* jshint strict: false */ /* globals define, module */
    if ( module.exports ) {
      // CommonJS
      module.exports = factory();
    } else {
      // browser global
      window.getSize = factory();
    }

  })( window, function factory() {

  // -------------------------- helpers -------------------------- //

  // get a number from a string, not a percentage
  function getStyleSize( value ) {
    var num = parseFloat( value );
    // not a percent like '100%', and a number
    var isValid = value.indexOf('%') == -1 && !isNaN( num );
    return isValid && num;
  }

  function noop() {}

  var logError = typeof console == 'undefined' ? noop :
    function( message ) {
      console.error( message );
    };

  // -------------------------- measurements -------------------------- //

  var measurements = [
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopWidth',
    'borderBottomWidth'
  ];

  var measurementsLength = measurements.length;

  function getZeroSize() {
    var size = {
      width: 0,
      height: 0,
      innerWidth: 0,
      innerHeight: 0,
      outerWidth: 0,
      outerHeight: 0
    };
    for ( var i=0; i < measurementsLength; i++ ) {
      var measurement = measurements[i];
      size[ measurement ] = 0;
    }
    return size;
  }

  // -------------------------- getStyle -------------------------- //

  /**
   * getStyle, get style of element, check for Firefox bug
   * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
   */
  function getStyle( elem ) {
    var style = getComputedStyle( elem );
    if ( !style ) {
      logError( 'Style returned ' + style +
        '. Are you running this code in a hidden iframe on Firefox? ' +
        'See https://bit.ly/getsizebug1' );
    }
    return style;
  }

  // -------------------------- setup -------------------------- //

  var isSetup = false;

  var isBoxSizeOuter;

  /**
   * setup
   * check isBoxSizerOuter
   * do on first getSize() rather than on page load for Firefox bug
   */
  function setup() {
    // setup once
    if ( isSetup ) {
      return;
    }
    isSetup = true;

    // -------------------------- box sizing -------------------------- //

    /**
     * Chrome & Safari measure the outer-width on style.width on border-box elems
     * IE11 & Firefox<29 measures the inner-width
     */
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style.boxSizing = 'border-box';

    var body = document.body || document.documentElement;
    body.appendChild( div );
    var style = getStyle( div );
    // round value for browser zoom. desandro/masonry#928
    isBoxSizeOuter = Math.round( getStyleSize( style.width ) ) == 200;
    getSize.isBoxSizeOuter = isBoxSizeOuter;

    body.removeChild( div );
  }

  // -------------------------- getSize -------------------------- //

  function getSize( elem ) {
    setup();

    // use querySeletor if elem is string
    if ( typeof elem == 'string' ) {
      elem = document.querySelector( elem );
    }

    // do not proceed on non-objects
    if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
      return;
    }

    var style = getStyle( elem );

    // if hidden, everything is 0
    if ( style.display == 'none' ) {
      return getZeroSize();
    }

    var size = {};
    size.width = elem.offsetWidth;
    size.height = elem.offsetHeight;

    var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

    // get all measurements
    for ( var i=0; i < measurementsLength; i++ ) {
      var measurement = measurements[i];
      var value = style[ measurement ];
      var num = parseFloat( value );
      // any 'auto', 'medium' value will be 0
      size[ measurement ] = !isNaN( num ) ? num : 0;
    }

    var paddingWidth = size.paddingLeft + size.paddingRight;
    var paddingHeight = size.paddingTop + size.paddingBottom;
    var marginWidth = size.marginLeft + size.marginRight;
    var marginHeight = size.marginTop + size.marginBottom;
    var borderWidth = size.borderLeftWidth + size.borderRightWidth;
    var borderHeight = size.borderTopWidth + size.borderBottomWidth;

    var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

    // overwrite width and height if we can get it from style
    var styleWidth = getStyleSize( style.width );
    if ( styleWidth !== false ) {
      size.width = styleWidth +
        // add padding and border unless it's already including it
        ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
    }

    var styleHeight = getStyleSize( style.height );
    if ( styleHeight !== false ) {
      size.height = styleHeight +
        // add padding and border unless it's already including it
        ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
    }

    size.innerWidth = size.width - ( paddingWidth + borderWidth );
    size.innerHeight = size.height - ( paddingHeight + borderHeight );

    size.outerWidth = size.width + marginWidth;
    size.outerHeight = size.height + marginHeight;

    return size;
  }

  return getSize;

  });
  });

  var evEmitter = createCommonjsModule(function (module) {
  /**
   * EvEmitter v1.1.0
   * Lil' event emitter
   * MIT License
   */

  /* jshint unused: true, undef: true, strict: true */

  ( function( global, factory ) {
    // universal module definition
    /* jshint strict: false */ /* globals define, module, window */
    if ( module.exports ) {
      // CommonJS - Browserify, Webpack
      module.exports = factory();
    } else {
      // Browser globals
      global.EvEmitter = factory();
    }

  }( typeof window != 'undefined' ? window : commonjsGlobal, function() {

  function EvEmitter() {}

  var proto = EvEmitter.prototype;

  proto.on = function( eventName, listener ) {
    if ( !eventName || !listener ) {
      return;
    }
    // set events hash
    var events = this._events = this._events || {};
    // set listeners array
    var listeners = events[ eventName ] = events[ eventName ] || [];
    // only add once
    if ( listeners.indexOf( listener ) == -1 ) {
      listeners.push( listener );
    }

    return this;
  };

  proto.once = function( eventName, listener ) {
    if ( !eventName || !listener ) {
      return;
    }
    // add event
    this.on( eventName, listener );
    // set once flag
    // set onceEvents hash
    var onceEvents = this._onceEvents = this._onceEvents || {};
    // set onceListeners object
    var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
    // set flag
    onceListeners[ listener ] = true;

    return this;
  };

  proto.off = function( eventName, listener ) {
    var listeners = this._events && this._events[ eventName ];
    if ( !listeners || !listeners.length ) {
      return;
    }
    var index = listeners.indexOf( listener );
    if ( index != -1 ) {
      listeners.splice( index, 1 );
    }

    return this;
  };

  proto.emitEvent = function( eventName, args ) {
    var listeners = this._events && this._events[ eventName ];
    if ( !listeners || !listeners.length ) {
      return;
    }
    // copy over to avoid interference if .off() in listener
    listeners = listeners.slice(0);
    args = args || [];
    // once stuff
    var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

    for ( var i=0; i < listeners.length; i++ ) {
      var listener = listeners[i];
      var isOnce = onceListeners && onceListeners[ listener ];
      if ( isOnce ) {
        // remove listener
        // remove before trigger to prevent recursion
        this.off( eventName, listener );
        // unset once flag
        delete onceListeners[ listener ];
      }
      // trigger listener
      listener.apply( this, args );
    }

    return this;
  };

  proto.allOff = function() {
    delete this._events;
    delete this._onceEvents;
  };

  return EvEmitter;

  }));
  });

  var unipointer = createCommonjsModule(function (module) {
  /*!
   * Unipointer v2.3.0
   * base class for doing one thing with pointer event
   * MIT license
   */

  /*jshint browser: true, undef: true, unused: true, strict: true */

  ( function( window, factory ) {
    // universal module definition
    /* jshint strict: false */ /*global define, module, require */
    if ( module.exports ) {
      // CommonJS
      module.exports = factory(
        window,
        evEmitter
      );
    } else {
      // browser global
      window.Unipointer = factory(
        window,
        window.EvEmitter
      );
    }

  }( window, function factory( window, EvEmitter ) {

  function noop() {}

  function Unipointer() {}

  // inherit EvEmitter
  var proto = Unipointer.prototype = Object.create( EvEmitter.prototype );

  proto.bindStartEvent = function( elem ) {
    this._bindStartEvent( elem, true );
  };

  proto.unbindStartEvent = function( elem ) {
    this._bindStartEvent( elem, false );
  };

  /**
   * Add or remove start event
   * @param {Boolean} isAdd - remove if falsey
   */
  proto._bindStartEvent = function( elem, isAdd ) {
    // munge isAdd, default to true
    isAdd = isAdd === undefined ? true : isAdd;
    var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';

    // default to mouse events
    var startEvent = 'mousedown';
    if ( window.PointerEvent ) {
      // Pointer Events
      startEvent = 'pointerdown';
    } else if ( 'ontouchstart' in window ) {
      // Touch Events. iOS Safari
      startEvent = 'touchstart';
    }
    elem[ bindMethod ]( startEvent, this );
  };

  // trigger handler methods for events
  proto.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  // returns the touch that we're keeping track of
  proto.getTouch = function( touches ) {
    for ( var i=0; i < touches.length; i++ ) {
      var touch = touches[i];
      if ( touch.identifier == this.pointerIdentifier ) {
        return touch;
      }
    }
  };

  // ----- start event ----- //

  proto.onmousedown = function( event ) {
    // dismiss clicks from right or middle buttons
    var button = event.button;
    if ( button && ( button !== 0 && button !== 1 ) ) {
      return;
    }
    this._pointerDown( event, event );
  };

  proto.ontouchstart = function( event ) {
    this._pointerDown( event, event.changedTouches[0] );
  };

  proto.onpointerdown = function( event ) {
    this._pointerDown( event, event );
  };

  /**
   * pointer start
   * @param {Event} event
   * @param {Event or Touch} pointer
   */
  proto._pointerDown = function( event, pointer ) {
    // dismiss right click and other pointers
    // button = 0 is okay, 1-4 not
    if ( event.button || this.isPointerDown ) {
      return;
    }

    this.isPointerDown = true;
    // save pointer identifier to match up touch events
    this.pointerIdentifier = pointer.pointerId !== undefined ?
      // pointerId for pointer events, touch.indentifier for touch events
      pointer.pointerId : pointer.identifier;

    this.pointerDown( event, pointer );
  };

  proto.pointerDown = function( event, pointer ) {
    this._bindPostStartEvents( event );
    this.emitEvent( 'pointerDown', [ event, pointer ] );
  };

  // hash of events to be bound after start event
  var postStartEvents = {
    mousedown: [ 'mousemove', 'mouseup' ],
    touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
    pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
  };

  proto._bindPostStartEvents = function( event ) {
    if ( !event ) {
      return;
    }
    // get proper events to match start event
    var events = postStartEvents[ event.type ];
    // bind events to node
    events.forEach( function( eventName ) {
      window.addEventListener( eventName, this );
    }, this );
    // save these arguments
    this._boundPointerEvents = events;
  };

  proto._unbindPostStartEvents = function() {
    // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
    if ( !this._boundPointerEvents ) {
      return;
    }
    this._boundPointerEvents.forEach( function( eventName ) {
      window.removeEventListener( eventName, this );
    }, this );

    delete this._boundPointerEvents;
  };

  // ----- move event ----- //

  proto.onmousemove = function( event ) {
    this._pointerMove( event, event );
  };

  proto.onpointermove = function( event ) {
    if ( event.pointerId == this.pointerIdentifier ) {
      this._pointerMove( event, event );
    }
  };

  proto.ontouchmove = function( event ) {
    var touch = this.getTouch( event.changedTouches );
    if ( touch ) {
      this._pointerMove( event, touch );
    }
  };

  /**
   * pointer move
   * @param {Event} event
   * @param {Event or Touch} pointer
   * @private
   */
  proto._pointerMove = function( event, pointer ) {
    this.pointerMove( event, pointer );
  };

  // public
  proto.pointerMove = function( event, pointer ) {
    this.emitEvent( 'pointerMove', [ event, pointer ] );
  };

  // ----- end event ----- //


  proto.onmouseup = function( event ) {
    this._pointerUp( event, event );
  };

  proto.onpointerup = function( event ) {
    if ( event.pointerId == this.pointerIdentifier ) {
      this._pointerUp( event, event );
    }
  };

  proto.ontouchend = function( event ) {
    var touch = this.getTouch( event.changedTouches );
    if ( touch ) {
      this._pointerUp( event, touch );
    }
  };

  /**
   * pointer up
   * @param {Event} event
   * @param {Event or Touch} pointer
   * @private
   */
  proto._pointerUp = function( event, pointer ) {
    this._pointerDone();
    this.pointerUp( event, pointer );
  };

  // public
  proto.pointerUp = function( event, pointer ) {
    this.emitEvent( 'pointerUp', [ event, pointer ] );
  };

  // ----- pointer done ----- //

  // triggered on pointer up & pointer cancel
  proto._pointerDone = function() {
    this._pointerReset();
    this._unbindPostStartEvents();
    this.pointerDone();
  };

  proto._pointerReset = function() {
    // reset properties
    this.isPointerDown = false;
    delete this.pointerIdentifier;
  };

  proto.pointerDone = noop;

  // ----- pointer cancel ----- //

  proto.onpointercancel = function( event ) {
    if ( event.pointerId == this.pointerIdentifier ) {
      this._pointerCancel( event, event );
    }
  };

  proto.ontouchcancel = function( event ) {
    var touch = this.getTouch( event.changedTouches );
    if ( touch ) {
      this._pointerCancel( event, touch );
    }
  };

  /**
   * pointer cancel
   * @param {Event} event
   * @param {Event or Touch} pointer
   * @private
   */
  proto._pointerCancel = function( event, pointer ) {
    this._pointerDone();
    this.pointerCancel( event, pointer );
  };

  // public
  proto.pointerCancel = function( event, pointer ) {
    this.emitEvent( 'pointerCancel', [ event, pointer ] );
  };

  // -----  ----- //

  // utility function for getting x/y coords from event
  Unipointer.getPointerPoint = function( pointer ) {
    return {
      x: pointer.pageX,
      y: pointer.pageY
    };
  };

  // -----  ----- //

  return Unipointer;

  }));
  });

  var unidragger = createCommonjsModule(function (module) {
  /*!
   * Unidragger v2.3.0
   * Draggable base class
   * MIT license
   */

  /*jshint browser: true, unused: true, undef: true, strict: true */

  ( function( window, factory ) {
    // universal module definition
    /*jshint strict: false */ /*globals define, module, require */

    if ( module.exports ) {
      // CommonJS
      module.exports = factory(
        window,
        unipointer
      );
    } else {
      // browser global
      window.Unidragger = factory(
        window,
        window.Unipointer
      );
    }

  }( window, function factory( window, Unipointer ) {

  // -------------------------- Unidragger -------------------------- //

  function Unidragger() {}

  // inherit Unipointer & EvEmitter
  var proto = Unidragger.prototype = Object.create( Unipointer.prototype );

  // ----- bind start ----- //

  proto.bindHandles = function() {
    this._bindHandles( true );
  };

  proto.unbindHandles = function() {
    this._bindHandles( false );
  };

  /**
   * Add or remove start event
   * @param {Boolean} isAdd
   */
  proto._bindHandles = function( isAdd ) {
    // munge isAdd, default to true
    isAdd = isAdd === undefined ? true : isAdd;
    // bind each handle
    var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';
    var touchAction = isAdd ? this._touchActionValue : '';
    for ( var i=0; i < this.handles.length; i++ ) {
      var handle = this.handles[i];
      this._bindStartEvent( handle, isAdd );
      handle[ bindMethod ]( 'click', this );
      // touch-action: none to override browser touch gestures. metafizzy/flickity#540
      if ( window.PointerEvent ) {
        handle.style.touchAction = touchAction;
      }
    }
  };

  // prototype so it can be overwriteable by Flickity
  proto._touchActionValue = 'none';

  // ----- start event ----- //

  /**
   * pointer start
   * @param {Event} event
   * @param {Event or Touch} pointer
   */
  proto.pointerDown = function( event, pointer ) {
    var isOkay = this.okayPointerDown( event );
    if ( !isOkay ) {
      return;
    }
    // track start event position
    this.pointerDownPointer = pointer;

    event.preventDefault();
    this.pointerDownBlur();
    // bind move and end events
    this._bindPostStartEvents( event );
    this.emitEvent( 'pointerDown', [ event, pointer ] );
  };

  // nodes that have text fields
  var cursorNodes = {
    TEXTAREA: true,
    INPUT: true,
    SELECT: true,
    OPTION: true,
  };

  // input types that do not have text fields
  var clickTypes = {
    radio: true,
    checkbox: true,
    button: true,
    submit: true,
    image: true,
    file: true,
  };

  // dismiss inputs with text fields. flickity#403, flickity#404
  proto.okayPointerDown = function( event ) {
    var isCursorNode = cursorNodes[ event.target.nodeName ];
    var isClickType = clickTypes[ event.target.type ];
    var isOkay = !isCursorNode || isClickType;
    if ( !isOkay ) {
      this._pointerReset();
    }
    return isOkay;
  };

  // kludge to blur previously focused input
  proto.pointerDownBlur = function() {
    var focused = document.activeElement;
    // do not blur body for IE10, metafizzy/flickity#117
    var canBlur = focused && focused.blur && focused != document.body;
    if ( canBlur ) {
      focused.blur();
    }
  };

  // ----- move event ----- //

  /**
   * drag move
   * @param {Event} event
   * @param {Event or Touch} pointer
   */
  proto.pointerMove = function( event, pointer ) {
    var moveVector = this._dragPointerMove( event, pointer );
    this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
    this._dragMove( event, pointer, moveVector );
  };

  // base pointer move logic
  proto._dragPointerMove = function( event, pointer ) {
    var moveVector = {
      x: pointer.pageX - this.pointerDownPointer.pageX,
      y: pointer.pageY - this.pointerDownPointer.pageY
    };
    // start drag if pointer has moved far enough to start drag
    if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
      this._dragStart( event, pointer );
    }
    return moveVector;
  };

  // condition if pointer has moved far enough to start drag
  proto.hasDragStarted = function( moveVector ) {
    return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
  };

  // ----- end event ----- //

  /**
   * pointer up
   * @param {Event} event
   * @param {Event or Touch} pointer
   */
  proto.pointerUp = function( event, pointer ) {
    this.emitEvent( 'pointerUp', [ event, pointer ] );
    this._dragPointerUp( event, pointer );
  };

  proto._dragPointerUp = function( event, pointer ) {
    if ( this.isDragging ) {
      this._dragEnd( event, pointer );
    } else {
      // pointer didn't move enough for drag to start
      this._staticClick( event, pointer );
    }
  };

  // -------------------------- drag -------------------------- //

  // dragStart
  proto._dragStart = function( event, pointer ) {
    this.isDragging = true;
    // prevent clicks
    this.isPreventingClicks = true;
    this.dragStart( event, pointer );
  };

  proto.dragStart = function( event, pointer ) {
    this.emitEvent( 'dragStart', [ event, pointer ] );
  };

  // dragMove
  proto._dragMove = function( event, pointer, moveVector ) {
    // do not drag if not dragging yet
    if ( !this.isDragging ) {
      return;
    }

    this.dragMove( event, pointer, moveVector );
  };

  proto.dragMove = function( event, pointer, moveVector ) {
    event.preventDefault();
    this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
  };

  // dragEnd
  proto._dragEnd = function( event, pointer ) {
    // set flags
    this.isDragging = false;
    // re-enable clicking async
    setTimeout( function() {
      delete this.isPreventingClicks;
    }.bind( this ) );

    this.dragEnd( event, pointer );
  };

  proto.dragEnd = function( event, pointer ) {
    this.emitEvent( 'dragEnd', [ event, pointer ] );
  };

  // ----- onclick ----- //

  // handle all clicks and prevent clicks when dragging
  proto.onclick = function( event ) {
    if ( this.isPreventingClicks ) {
      event.preventDefault();
    }
  };

  // ----- staticClick ----- //

  // triggered after pointer down & up with no/tiny movement
  proto._staticClick = function( event, pointer ) {
    // ignore emulated mouse up clicks
    if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
      return;
    }

    this.staticClick( event, pointer );

    // set flag for emulated clicks 300ms after touchend
    if ( event.type != 'mouseup' ) {
      this.isIgnoringMouseUp = true;
      // reset flag after 300ms
      setTimeout( function() {
        delete this.isIgnoringMouseUp;
      }.bind( this ), 400 );
    }
  };

  proto.staticClick = function( event, pointer ) {
    this.emitEvent( 'staticClick', [ event, pointer ] );
  };

  // ----- utils ----- //

  Unidragger.getPointerPoint = Unipointer.getPointerPoint;

  // -----  ----- //

  return Unidragger;

  }));
  });

  var draggabilly = createCommonjsModule(function (module) {
  /*!
   * Draggabilly v2.2.0
   * Make that shiz draggable
   * https://draggabilly.desandro.com
   * MIT license
   */

  /*jshint browser: true, strict: true, undef: true, unused: true */

  ( function( window, factory ) {
    // universal module definition
    /* jshint strict: false */ /*globals define, module, require */
    if ( module.exports ) {
      // CommonJS
      module.exports = factory(
        window,
        getSize,
        unidragger
      );
    } else {
      // browser global
      window.Draggabilly = factory(
        window,
        window.getSize,
        window.Unidragger
      );
    }

  }( window, function factory( window, getSize$$1, Unidragger ) {

  // -------------------------- helpers & variables -------------------------- //

  // extend objects
  function extend( a, b ) {
    for ( var prop in b ) {
      a[ prop ] = b[ prop ];
    }
    return a;
  }

  function noop() {}

  var jQuery = window.jQuery;

  // --------------------------  -------------------------- //

  function Draggabilly( element, options ) {
    // querySelector if string
    this.element = typeof element == 'string' ?
      document.querySelector( element ) : element;

    if ( jQuery ) {
      this.$element = jQuery( this.element );
    }

    // options
    this.options = extend( {}, this.constructor.defaults );
    this.option( options );

    this._create();
  }

  // inherit Unidragger methods
  var proto = Draggabilly.prototype = Object.create( Unidragger.prototype );

  Draggabilly.defaults = {
  };

  /**
   * set options
   * @param {Object} opts
   */
  proto.option = function( opts ) {
    extend( this.options, opts );
  };

  // css position values that don't need to be set
  var positionValues = {
    relative: true,
    absolute: true,
    fixed: true
  };

  proto._create = function() {
    // properties
    this.position = {};
    this._getPosition();

    this.startPoint = { x: 0, y: 0 };
    this.dragPoint = { x: 0, y: 0 };

    this.startPosition = extend( {}, this.position );

    // set relative positioning
    var style = getComputedStyle( this.element );
    if ( !positionValues[ style.position ] ) {
      this.element.style.position = 'relative';
    }

    // events, bridge jQuery events from vanilla
    this.on( 'pointerDown', this.onPointerDown );
    this.on( 'pointerMove', this.onPointerMove );
    this.on( 'pointerUp', this.onPointerUp );

    this.enable();
    this.setHandles();
  };

  /**
   * set this.handles and bind start events to 'em
   */
  proto.setHandles = function() {
    this.handles = this.options.handle ?
      this.element.querySelectorAll( this.options.handle ) : [ this.element ];

    this.bindHandles();
  };

  /**
   * emits events via EvEmitter and jQuery events
   * @param {String} type - name of event
   * @param {Event} event - original event
   * @param {Array} args - extra arguments
   */
  proto.dispatchEvent = function( type, event, args ) {
    var emitArgs = [ event ].concat( args );
    this.emitEvent( type, emitArgs );
    this.dispatchJQueryEvent( type, event, args );
  };

  proto.dispatchJQueryEvent = function( type, event, args ) {
    var jQuery = window.jQuery;
    // trigger jQuery event
    if ( !jQuery || !this.$element ) {
      return;
    }
    // create jQuery event
    var $event = jQuery.Event( event );
    $event.type = type;
    this.$element.trigger( $event, args );
  };

  // -------------------------- position -------------------------- //

  // get x/y position from style
  proto._getPosition = function() {
    var style = getComputedStyle( this.element );
    var x = this._getPositionCoord( style.left, 'width' );
    var y = this._getPositionCoord( style.top, 'height' );
    // clean up 'auto' or other non-integer values
    this.position.x = isNaN( x ) ? 0 : x;
    this.position.y = isNaN( y ) ? 0 : y;

    this._addTransformPosition( style );
  };

  proto._getPositionCoord = function( styleSide, measure ) {
    if ( styleSide.indexOf('%') != -1 ) {
      // convert percent into pixel for Safari, #75
      var parentSize = getSize$$1( this.element.parentNode );
      // prevent not-in-DOM element throwing bug, #131
      return !parentSize ? 0 :
        ( parseFloat( styleSide ) / 100 ) * parentSize[ measure ];
    }
    return parseInt( styleSide, 10 );
  };

  // add transform: translate( x, y ) to position
  proto._addTransformPosition = function( style ) {
    var transform = style.transform;
    // bail out if value is 'none'
    if ( transform.indexOf('matrix') !== 0 ) {
      return;
    }
    // split matrix(1, 0, 0, 1, x, y)
    var matrixValues = transform.split(',');
    // translate X value is in 12th or 4th position
    var xIndex = transform.indexOf('matrix3d') === 0 ? 12 : 4;
    var translateX = parseInt( matrixValues[ xIndex ], 10 );
    // translate Y value is in 13th or 5th position
    var translateY = parseInt( matrixValues[ xIndex + 1 ], 10 );
    this.position.x += translateX;
    this.position.y += translateY;
  };

  // -------------------------- events -------------------------- //

  proto.onPointerDown = function( event, pointer ) {
    this.element.classList.add('is-pointer-down');
    this.dispatchJQueryEvent( 'pointerDown', event, [ pointer ] );
  };

  /**
   * drag start
   * @param {Event} event
   * @param {Event or Touch} pointer
   */
  proto.dragStart = function( event, pointer ) {
    if ( !this.isEnabled ) {
      return;
    }
    this._getPosition();
    this.measureContainment();
    // position _when_ drag began
    this.startPosition.x = this.position.x;
    this.startPosition.y = this.position.y;
    // reset left/top style
    this.setLeftTop();

    this.dragPoint.x = 0;
    this.dragPoint.y = 0;

    this.element.classList.add('is-dragging');
    this.dispatchEvent( 'dragStart', event, [ pointer ] );
    // start animation
    this.animate();
  };

  proto.measureContainment = function() {
    var container = this.getContainer();
    if ( !container ) {
      return;
    }

    var elemSize = getSize$$1( this.element );
    var containerSize = getSize$$1( container );
    var elemRect = this.element.getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();

    var borderSizeX = containerSize.borderLeftWidth + containerSize.borderRightWidth;
    var borderSizeY = containerSize.borderTopWidth + containerSize.borderBottomWidth;

    var position = this.relativeStartPosition = {
      x: elemRect.left - ( containerRect.left + containerSize.borderLeftWidth ),
      y: elemRect.top - ( containerRect.top + containerSize.borderTopWidth )
    };

    this.containSize = {
      width: ( containerSize.width - borderSizeX ) - position.x - elemSize.width,
      height: ( containerSize.height - borderSizeY ) - position.y - elemSize.height
    };
  };

  proto.getContainer = function() {
    var containment = this.options.containment;
    if ( !containment ) {
      return;
    }
    var isElement = containment instanceof HTMLElement;
    // use as element
    if ( isElement ) {
      return containment;
    }
    // querySelector if string
    if ( typeof containment == 'string' ) {
      return document.querySelector( containment );
    }
    // fallback to parent element
    return this.element.parentNode;
  };

  // ----- move event ----- //

  proto.onPointerMove = function( event, pointer, moveVector ) {
    this.dispatchJQueryEvent( 'pointerMove', event, [ pointer, moveVector ] );
  };

  /**
   * drag move
   * @param {Event} event
   * @param {Event or Touch} pointer
   */
  proto.dragMove = function( event, pointer, moveVector ) {
    if ( !this.isEnabled ) {
      return;
    }
    var dragX = moveVector.x;
    var dragY = moveVector.y;

    var grid = this.options.grid;
    var gridX = grid && grid[0];
    var gridY = grid && grid[1];

    dragX = applyGrid( dragX, gridX );
    dragY = applyGrid( dragY, gridY );

    dragX = this.containDrag( 'x', dragX, gridX );
    dragY = this.containDrag( 'y', dragY, gridY );

    // constrain to axis
    dragX = this.options.axis == 'y' ? 0 : dragX;
    dragY = this.options.axis == 'x' ? 0 : dragY;

    this.position.x = this.startPosition.x + dragX;
    this.position.y = this.startPosition.y + dragY;
    // set dragPoint properties
    this.dragPoint.x = dragX;
    this.dragPoint.y = dragY;

    this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
  };

  function applyGrid( value, grid, method ) {
    method = method || 'round';
    return grid ? Math[ method ]( value / grid ) * grid : value;
  }

  proto.containDrag = function( axis, drag, grid ) {
    if ( !this.options.containment ) {
      return drag;
    }
    var measure = axis == 'x' ? 'width' : 'height';

    var rel = this.relativeStartPosition[ axis ];
    var min = applyGrid( -rel, grid, 'ceil' );
    var max = this.containSize[ measure ];
    max = applyGrid( max, grid, 'floor' );
    return  Math.max( min, Math.min( max, drag ) );
  };

  // ----- end event ----- //

  /**
   * pointer up
   * @param {Event} event
   * @param {Event or Touch} pointer
   */
  proto.onPointerUp = function( event, pointer ) {
    this.element.classList.remove('is-pointer-down');
    this.dispatchJQueryEvent( 'pointerUp', event, [ pointer ] );
  };

  /**
   * drag end
   * @param {Event} event
   * @param {Event or Touch} pointer
   */
  proto.dragEnd = function( event, pointer ) {
    if ( !this.isEnabled ) {
      return;
    }
    // use top left position when complete
    this.element.style.transform = '';
    this.setLeftTop();
    this.element.classList.remove('is-dragging');
    this.dispatchEvent( 'dragEnd', event, [ pointer ] );
  };

  // -------------------------- animation -------------------------- //

  proto.animate = function() {
    // only render and animate if dragging
    if ( !this.isDragging ) {
      return;
    }

    this.positionDrag();

    var _this = this;
    requestAnimationFrame( function animateFrame() {
      _this.animate();
    });

  };

  // left/top positioning
  proto.setLeftTop = function() {
    this.element.style.left = this.position.x + 'px';
    this.element.style.top  = this.position.y + 'px';
  };

  proto.positionDrag = function() {
    this.element.style.transform = 'translate3d( ' + this.dragPoint.x +
      'px, ' + this.dragPoint.y + 'px, 0)';
  };

  // ----- staticClick ----- //

  proto.staticClick = function( event, pointer ) {
    this.dispatchEvent( 'staticClick', event, [ pointer ] );
  };

  // ----- methods ----- //

  /**
   * @param {Number} x
   * @param {Number} y
   */
  proto.setPosition = function( x, y ) {
    this.position.x = x;
    this.position.y = y;
    this.setLeftTop();
  };

  proto.enable = function() {
    this.isEnabled = true;
  };

  proto.disable = function() {
    this.isEnabled = false;
    if ( this.isDragging ) {
      this.dragEnd();
    }
  };

  proto.destroy = function() {
    this.disable();
    // reset styles
    this.element.style.transform = '';
    this.element.style.left = '';
    this.element.style.top = '';
    this.element.style.position = '';
    // unbind handles
    this.unbindHandles();
    // remove jQuery data
    if ( this.$element ) {
      this.$element.removeData('draggabilly');
    }
  };

  // ----- jQuery bridget ----- //

  // required for jQuery bridget
  proto._init = noop;

  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( 'draggabilly', Draggabilly );
  }

  // -----  ----- //

  return Draggabilly;

  }));
  });

  function pipMix(art, player) {
    var option = art.option,
        i18n = art.i18n,
        _art$refs = art.refs,
        $player = _art$refs.$player,
        $pipClose = _art$refs.$pipClose,
        $pipTitle = _art$refs.$pipTitle,
        _art$events = art.events,
        destroyEvents = _art$events.destroyEvents,
        proxy = _art$events.proxy;
    var cachePos = null;
    var draggie = null;
    Object.defineProperty(player, 'pipState', {
      get: function get() {
        return $player.classList.contains('artplayer-pip');
      }
    });
    Object.defineProperty(player, 'pipDraggie', {
      get: function get() {
        return draggie;
      }
    });
    Object.defineProperty(player, 'pipEnabled', {
      value: function value() {
        if (!draggie) {
          draggie = new draggabilly($player, {
            handle: '.artplayer-pip-header'
          });
          append($pipTitle, option.title || i18n.get('Mini player'));
          proxy($pipClose, 'click', function () {
            player.pipExit();
          });
          destroyEvents.push(function () {
            draggie.destroy();
          });
        } else {
          setStyle($player, 'left', "".concat(cachePos.x, "px"));
          setStyle($player, 'top', "".concat(cachePos.y, "px"));
        }

        $player.classList.add('artplayer-pip');
        player.fullscreenExit();
        player.fullscreenWebExit();
        player.aspectRatioRemove();
        player.playbackRateRemove();
        art.emit('pip', true);
      }
    });
    Object.defineProperty(player, 'pipExit', {
      value: function value() {
        $player.classList.remove('artplayer-pip');
        cachePos = draggie.position;
        setStyle($player, 'left', null);
        setStyle($player, 'top', null);
        player.fullscreenExit();
        player.fullscreenWebExit();
        player.aspectRatioRemove();
        player.playbackRateRemove();
        art.emit('pip', false);
      }
    });
    Object.defineProperty(player, 'pipToggle', {
      value: function value() {
        if (player.pipState) {
          player.pipExit();
        } else {
          player.pipEnabled();
        }
      }
    });
  }

  var Player = function Player(art) {
    classCallCheck(this, Player);

    this.reconnectTime = 0;
    this.maxReconnectTime = 5;
    mountUrlMix(art, this);
    attrInit(art, this);
    eventInit(art, this);
    playMix(art, this);
    pauseMin(art, this);
    toggleMix(art, this);
    seekMix(art, this);
    volumeMix(art, this);
    currentTimeMix(art, this);
    durationMix(art, this);
    switchMix(art, this);
    playbackRateMix(art, this);
    aspectRatioMix(art, this);
    screenshotMix(art, this);
    fullscreenMix(art, this);
    fullscreenWebMix(art, this);
    pipMix(art, this);
  };

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
  }

  var slicedToArray = _slicedToArray;

  var loading = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50px\" height=\"50px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"uil-default\">\n  <rect x=\"0\" y=\"0\" width=\"100\" height=\"100\" fill=\"none\" class=\"bk\"/>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(0 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-1s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(30 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.9166666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(60 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.8333333333333334s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(90 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.75s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(120 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.6666666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(150 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5833333333333334s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(180 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(210 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.4166666666666667s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(240 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.3333333333333333s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(270 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.25s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(300 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.16666666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(330 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.08333333333333333s\" repeatCount=\"indefinite\"/>\n  </rect>\n</svg>";

  var playBig = "<svg style=\"width: 60px; height: 60px; filter: drop-shadow(0px 1px 1px black);\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" >\n    <path d=\"M20,2H4C1.8,2,0,3.8,0,6v12c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V6C24,3.8,22.2,2,20,2z M15.6,12.8L10.5,16   C9.9,16.5,9,16,9,15.2V8.8C9,8,9.9,7.5,10.5,8l5.1,3.2C16.3,11.5,16.3,12.5,15.6,12.8z\" id=\"video\"/>\n</svg>";

  var play = "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"width: 100%; height: 100%\" viewBox=\"0 0 22 22\">\n  <path d=\"M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z\"></path>\n</svg>";

  var pause = "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"width: 100%; height: 100%\" viewBox=\"0 0 22 22\">\n    <path d=\"M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z\"></path>\n</svg>";

  var volume = "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"width: 100%; height: 100%\" viewBox=\"0 0 22 22\">\n    <path d=\"M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z\"></path><path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z\"></path>\n</svg>";

  var volumeClose = "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"width: 100%; height: 100%\" viewBox=\"0 0 22 22\">\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z\"></path>\n    <path d=\"M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z\"></path>\n</svg>";

  var subtitle = "<svg style=\"width: 100%; height: 100%\" viewBox=\"0 0 48 48\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path d=\"M0 0h48v48H0z\" fill=\"none\"/>\n    <path d=\"M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z\"/>\n</svg>";

  var screenshot = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 50 50\" style=\"width: 100%; height: 100%\">\n\t<g id=\"surface1\">\n\t\t<path d=\"M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z \"/>\n\t</g>\n</svg>\n";

  var danmu = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 60 60\" style=\"width: 85%; height: 85%\">\r\n\t<path d=\"M54,2.5H6c-3.252,0-6,2.748-6,6v33c0,3.252,2.748,6,6,6h14.555l8.702,9.669C29.446,57.38,29.717,57.5,30,57.5 s0.554-0.12,0.743-0.331l8.702-9.669H54c3.252,0,6-2.748,6-6v-33C60,5.248,57.252,2.5,54,2.5z M16,28.5c-2.206,0-4-1.794-4-4 s1.794-4,4-4s4,1.794,4,4S18.206,28.5,16,28.5z M30,28.5c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S32.206,28.5,30,28.5z M44,28.5c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S46.206,28.5,44,28.5z\"/>\r\n</svg>\r\n";

  var setting = "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"width: 100%; height: 100%\" viewBox=\"0 0 22 22\">\n    <circle cx=\"11\" cy=\"11\" r=\"2\"></circle>\n    <path d=\"M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z\"></path>\n</svg>";

  var fullscreen = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"  style=\"width: 80%; height: 80%\">\r\n<g>\r\n\t<g>\r\n\t\t<path d=\"M236.454,172.808L132.421,68.789l43.184-43.184C185.014,16.197,178.365,0,165,0H15C6.709,0,0,6.709,0,15v150\r\n\t\t\tc0,13.241,16.066,20.112,25.606,10.606l43.198-43.169l104.004,104.018c5.856,5.856,15.351,5.859,21.209,0.001l42.437-42.437\r\n\t\t\tC242.286,188.187,242.334,178.688,236.454,172.808z\"/>\r\n\t</g>\r\n</g>\r\n<g>\r\n\t<g>\r\n\t\t<path d=\"M497,0H347c-13.361,0-20.018,16.193-10.606,25.605l43.184,43.184L275.544,172.792c-5.844,5.844-5.868,15.358,0,21.226\r\n\t\t\tl42.437,42.437c5.86,5.86,15.352,5.859,21.211,0l104.019-104.034l43.184,43.184C495.93,185.141,512,178.23,512,165V15\r\n\t\t\tC512,6.709,505.291,0,497,0z\"/>\r\n\t</g>\r\n</g>\r\n<g>\r\n\t<g>\r\n\t\t<path d=\"M486.396,336.393l-43.184,43.184L339.193,275.544c-5.856-5.856-15.349-5.862-21.211,0l-42.437,42.437\r\n\t\t\tc-5.868,5.868-5.844,15.382,0,21.226l104.034,104.004l-43.184,43.184C326.986,495.803,333.635,512,347,512h150\r\n\t\t\tc8.291,0,15-6.709,15-15V347C512,333.639,495.807,326.982,486.396,336.393z\"/>\r\n\t</g>\r\n</g>\r\n<g>\r\n\t<g>\r\n\t\t<path d=\"M236.456,317.983l-42.437-42.437c-5.625-5.625-15.586-5.625-21.211,0L68.789,379.579l-43.184-43.184\r\n\t\t\tC16.283,327.04,0,333.563,0,347v150c0,8.291,6.709,15,15,15h150c13.361,0,20.018-16.193,10.606-25.605l-43.184-43.184\r\n\t\t\tl104.034-104.017C242.336,333.314,242.289,323.816,236.456,317.983z\"/>\r\n\t</g>\r\n</g>\r\n</svg>\r\n";

  var fullscreenWeb = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 22\" style=\"width: 80%; height: 80%\">\r\n\t<path d=\"M4,18h14V4H4V18z M6,6h10v10H6V6z\"/>\r\n\t<polygon points=\"2,16 0,16 0,22 6,22 6,20 2,20\"/>\r\n\t<polygon points=\"2,2 6,2 6,0 0,0 0,6 2,6\"/>\r\n\t<polygon points=\"20,20 16,20 16,22 22,22 22,16 20,16\"/>\r\n\t<polygon points=\"16,0 16,2 20,2 20,6 22,6 22,0\"/>\r\n</svg>\r\n";

  var pip = "<svg viewBox=\"0 0 36 36\" style=\"width: 100%; height: 100%\">\n    <path d=\"M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z\" fill=\"#fff\" id=\"ytp-id-20\"></path>\n</svg>";

  var icons = {
    loading: loading,
    playBig: playBig,
    play: play,
    pause: pause,
    volume: volume,
    volumeClose: volumeClose,
    subtitle: subtitle,
    screenshot: screenshot,
    danmu: danmu,
    setting: setting,
    fullscreen: fullscreen,
    fullscreenWeb: fullscreenWeb,
    pip: pip
  };

  function creatDomFromSvg(map) {
    var result = {};
    Object.keys(map).forEach(function (name) {
      var tmp = document.createElement('div');
      tmp.innerHTML = "<i class=\"art-icon art-icon-".concat(name, "\">").concat(map[name], "</i>");

      var _tmp$childNodes = slicedToArray(tmp.childNodes, 1);

      result[name] = _tmp$childNodes[0];
    });
    return result;
  }

  var icons$1 = creatDomFromSvg(icons);

  var Danmu =
  /*#__PURE__*/
  function () {
    function Danmu(option) {
      classCallCheck(this, Danmu);

      this.option = option;
    }

    createClass(Danmu, [{
      key: "apply",
      value: function apply(art, $control) {
        var _this = this;

        var proxy = art.events.proxy,
            i18n = art.i18n,
            danmu = art.danmu;
        this.$danmu = append($control, icons$1.danmu);
        tooltip(this.$danmu, i18n.get('Hide danmu'));
        proxy($control, 'click', function () {
          if (danmu.isOpen) {
            danmu.hide();
            setStyle(_this.$danmu, 'opacity', '1');
            tooltip(_this.$danmu, i18n.get('Show danmu'));
          } else {
            danmu.show();
            setStyle(_this.$danmu, 'opacity', '0.8');
            tooltip(_this.$danmu, i18n.get('Hide danmu'));
          }
        });
      }
    }]);

    return Danmu;
  }();

  var Fullscreen =
  /*#__PURE__*/
  function () {
    function Fullscreen(option) {
      classCallCheck(this, Fullscreen);

      this.option = option;
    }

    createClass(Fullscreen, [{
      key: "apply",
      value: function apply(art, $control) {
        var _this = this;

        var proxy = art.events.proxy,
            i18n = art.i18n,
            player = art.player;
        this.$fullscreen = append($control, icons$1.fullscreen);
        tooltip(this.$fullscreen, i18n.get('Fullscreen'));
        proxy($control, 'click', function () {
          player.fullscreenToggle();
        });
        art.on('fullscreen:enabled', function () {
          setStyle(_this.$fullscreen, 'opacity', '0.8');
          tooltip(_this.$fullscreen, i18n.get('Exit fullscreen'));
        });
        art.on('fullscreen:exit', function () {
          setStyle(_this.$fullscreen, 'opacity', '1');
          tooltip(_this.$fullscreen, i18n.get('Fullscreen'));
        });
      }
    }]);

    return Fullscreen;
  }();

  var FullscreenWeb =
  /*#__PURE__*/
  function () {
    function FullscreenWeb(option) {
      classCallCheck(this, FullscreenWeb);

      this.option = option;
    }

    createClass(FullscreenWeb, [{
      key: "apply",
      value: function apply(art, $control) {
        var _this = this;

        var proxy = art.events.proxy,
            i18n = art.i18n,
            player = art.player;
        this.$fullscreenWeb = append($control, icons$1.fullscreenWeb);
        tooltip(this.$fullscreenWeb, i18n.get('Web fullscreen'));
        proxy($control, 'click', function () {
          player.fullscreenWebToggle();
        });
        art.on('fullscreenWeb:enabled', function () {
          setStyle(_this.$fullscreenWeb, 'opacity', '0.8');
          tooltip(_this.$fullscreenWeb, i18n.get('Exit web fullscreen'));
        });
        art.on('fullscreenWeb:exit', function () {
          setStyle(_this.$fullscreenWeb, 'opacity', '1');
          tooltip(_this.$fullscreenWeb, i18n.get('Web fullscreen'));
        });
      }
    }]);

    return FullscreenWeb;
  }();

  var Pip =
  /*#__PURE__*/
  function () {
    function Pip(option) {
      classCallCheck(this, Pip);

      this.option = option;
    }

    createClass(Pip, [{
      key: "apply",
      value: function apply(art, $control) {
        var proxy = art.events.proxy,
            i18n = art.i18n,
            player = art.player;
        this.$pip = append($control, icons$1.pip);
        tooltip(this.$pip, i18n.get('Mini player'));
        proxy($control, 'click', function () {
          player.pipEnabled();
        });
      }
    }]);

    return Pip;
  }();

  var PlayAndPause =
  /*#__PURE__*/
  function () {
    function PlayAndPause(option) {
      classCallCheck(this, PlayAndPause);

      this.option = option;
    }

    createClass(PlayAndPause, [{
      key: "apply",
      value: function apply(art, $control) {
        var _this = this;

        var proxy = art.events.proxy,
            player = art.player,
            i18n = art.i18n;
        this.$play = append($control, icons$1.play);
        this.$pause = append($control, icons$1.pause);
        tooltip(this.$play, i18n.get('Play'));
        tooltip(this.$pause, i18n.get('Pause'));
        setStyle(this.$pause, 'display', 'none');
        proxy(this.$play, 'click', function () {
          player.play();
        });
        proxy(this.$pause, 'click', function () {
          player.pause();
        });
        art.on('video:playing', function () {
          setStyle(_this.$play, 'display', 'none');
          setStyle(_this.$pause, 'display', 'block');
        });
        art.on('video:pause', function () {
          setStyle(_this.$play, 'display', 'block');
          setStyle(_this.$pause, 'display', 'none');
        });
      }
    }]);

    return PlayAndPause;
  }();

  var Progress =
  /*#__PURE__*/
  function () {
    function Progress(option) {
      classCallCheck(this, Progress);

      this.option = option;
      this.isDroging = false;
      this.getLoaded = this.getLoaded.bind(this);
      this.getPlayed = this.getPlayed.bind(this);
      this.set = this.set.bind(this);
    }

    createClass(Progress, [{
      key: "apply",
      value: function apply(art, $control) {
        var _this = this;

        this.art = art;
        this.$control = $control;
        var _art$option = art.option,
            highlight = _art$option.highlight,
            theme = _art$option.theme,
            proxy = art.events.proxy,
            $video = art.refs.$video,
            player = art.player;
        append($control, "\n        <div class=\"art-control-progress-inner\">\n          <div class=\"art-progress-loaded\"></div>\n          <div class=\"art-progress-played\" style=\"background: ".concat(theme, "\"></div>\n          <div class=\"art-progress-highlight\"></div>\n          <div class=\"art-progress-indicator\" style=\"background: ").concat(theme, "\"></div>\n          <div class=\"art-progress-tip art-tip\"></div>\n        </div>\n      "));
        this.$loaded = $control.querySelector('.art-progress-loaded');
        this.$played = $control.querySelector('.art-progress-played');
        this.$highlight = $control.querySelector('.art-progress-highlight');
        this.$indicator = $control.querySelector('.art-progress-indicator');
        this.$tip = $control.querySelector('.art-progress-tip');
        this.set('loaded', this.getLoaded());
        highlight.forEach(function (item) {
          var left = Number(item.time) / $video.duration;
          append(_this.$highlight, "<span data-text=\"".concat(item.text, "\" data-time=\"").concat(item.time, "\" style=\"left: ").concat(left * 100, "%\"></span>"));
        });
        this.art.on('video:progress', function () {
          _this.set('loaded', _this.getLoaded());
        });
        this.art.on('video:timeupdate', function () {
          _this.set('played', _this.getPlayed());
        });
        this.art.on('video:ended', function () {
          _this.set('played', 1);
        });
        proxy($control, 'mousemove', function (event) {
          setStyle(_this.$tip, 'display', 'block');

          if (event.composedPath().indexOf(_this.$highlight) > -1) {
            _this.showHighlight(event);
          } else {
            _this.showTime(event);
          }
        });
        proxy($control, 'mouseout', function () {
          setStyle(_this.$tip, 'display', 'none');
        });
        proxy($control, 'click', function (event) {
          if (event.target !== _this.$indicator) {
            var _this$getPosFromEvent = _this.getPosFromEvent(event),
                second = _this$getPosFromEvent.second,
                percentage = _this$getPosFromEvent.percentage;

            _this.set('played', percentage);

            player.seek(second);
          }
        });
        proxy(this.$indicator, 'mousedown', function () {
          _this.isDroging = true;
        });
        proxy(document, 'mousemove', function (event) {
          if (_this.isDroging) {
            var _this$getPosFromEvent2 = _this.getPosFromEvent(event),
                second = _this$getPosFromEvent2.second,
                percentage = _this$getPosFromEvent2.percentage;

            _this.$indicator.classList.add('show-indicator');

            _this.set('played', percentage);

            player.seek(second);
          }
        });
        proxy(document, 'mouseup', function () {
          if (_this.isDroging) {
            _this.isDroging = false;

            _this.$indicator.classList.remove('show-indicator');
          }
        });
      }
    }, {
      key: "showHighlight",
      value: function showHighlight(event) {
        var $video = this.art.refs.$video;
        var _event$target$dataset = event.target.dataset,
            text = _event$target$dataset.text,
            time = _event$target$dataset.time;
        this.$tip.innerHTML = text;
        var left = Number(time) / $video.duration * this.$control.clientWidth + event.target.clientWidth / 2 - this.$tip.clientWidth / 2;
        setStyle(this.$tip, 'left', "".concat(left, "px"));
      }
    }, {
      key: "showTime",
      value: function showTime(event) {
        var _this$getPosFromEvent3 = this.getPosFromEvent(event),
            width = _this$getPosFromEvent3.width,
            time = _this$getPosFromEvent3.time;

        var tipWidth = this.$tip.clientWidth;
        this.$tip.innerHTML = time;

        if (width <= tipWidth / 2) {
          setStyle(this.$tip, 'left', 0);
        } else if (width > this.$control.clientWidth - tipWidth / 2) {
          setStyle(this.$tip, 'left', "".concat(this.$control.clientWidth - tipWidth, "px"));
        } else {
          setStyle(this.$tip, 'left', "".concat(width - tipWidth / 2, "px"));
        }
      }
    }, {
      key: "getPlayed",
      value: function getPlayed() {
        var $video = this.art.refs.$video;
        return $video.currentTime / $video.duration;
      }
    }, {
      key: "getLoaded",
      value: function getLoaded() {
        var $video = this.art.refs.$video;
        return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) / $video.duration : 0;
      }
    }, {
      key: "getPosFromEvent",
      value: function getPosFromEvent(event) {
        var _this$art$refs = this.art.refs,
            $video = _this$art$refs.$video,
            $progress = _this$art$refs.$progress;

        var _$progress$getBoundin = $progress.getBoundingClientRect(),
            left = _$progress$getBoundin.left;

        var width = clamp(event.x - left, 0, $progress.clientWidth);
        var second = width / $progress.clientWidth * $video.duration;
        var time = secondToTime(second);
        var percentage = clamp(width / $progress.clientWidth, 0, 1);
        return {
          second: second,
          time: time,
          width: width,
          percentage: percentage
        };
      }
    }, {
      key: "set",
      value: function set(type, percentage) {
        setStyle(this["$".concat(type)], 'width', "".concat(percentage * 100, "%"));

        if (type === 'played') {
          setStyle(this.$indicator, 'left', "calc(".concat(percentage * 100, "% - 6.5px)"));
        }
      }
    }]);

    return Progress;
  }();

  var Subtitle =
  /*#__PURE__*/
  function () {
    function Subtitle(option) {
      classCallCheck(this, Subtitle);

      this.option = option;
    }

    createClass(Subtitle, [{
      key: "apply",
      value: function apply(art, $control) {
        var _this = this;

        var proxy = art.events.proxy,
            i18n = art.i18n,
            subtitle = art.subtitle;
        this.$subtitle = append($control, icons$1.subtitle);
        tooltip(this.$subtitle, i18n.get('Hide subtitle'));
        proxy($control, 'click', function () {
          subtitle.toggle();
        });
        art.on('subtitle:show', function () {
          setStyle(_this.$subtitle, 'opacity', '0.8');
          tooltip(_this.$subtitle, i18n.get('Hide subtitle'));
        });
        art.on('subtitle:hide', function () {
          setStyle(_this.$subtitle, 'opacity', '1');
          tooltip(_this.$subtitle, i18n.get('Show subtitle'));
        });
      }
    }]);

    return Subtitle;
  }();

  var Time =
  /*#__PURE__*/
  function () {
    function Time(option) {
      classCallCheck(this, Time);

      this.option = option;
    }

    createClass(Time, [{
      key: "apply",
      value: function apply(art, $control) {
        $control.innerHTML = '00:00 / 00:00';

        function setTime() {
          $control.innerHTML = "".concat(secondToTime(art.player.currentTime()), " / ").concat(secondToTime(art.player.duration()));
        }

        art.on('video:canplay', function () {
          setTime();
        });
        art.on('video:timeupdate', function () {
          setTime();
        });
        art.on('video:seeking', function () {
          setTime();
        });
      }
    }]);

    return Time;
  }();

  var Volume =
  /*#__PURE__*/
  function () {
    function Volume(option) {
      classCallCheck(this, Volume);

      this.option = option;
      this.isDroging = false;
    }

    createClass(Volume, [{
      key: "apply",
      value: function apply(art, $control) {
        this.art = art;
        this.$control = $control;
        this.init();
      }
    }, {
      key: "init",
      value: function init() {
        var _this = this;

        var _this$art = this.art,
            proxy = _this$art.events.proxy,
            player = _this$art.player,
            i18n = _this$art.i18n;
        this.$volume = append(this.$control, icons$1.volume);
        this.$volumeClose = append(this.$control, icons$1.volumeClose);
        this.$volumePanel = append(this.$control, '<div class="art-volume-panel"></div>');
        this.$volumeHandle = append(this.$volumePanel, '<div class="art-volume-slider-handle"></div>');
        tooltip(this.$volume, i18n.get('Mute'));
        setStyle(this.$volumeClose, 'display', 'none');
        var volume = getStorage('volume');
        this.setVolumeHandle(volume);
        player.volume(volume);
        proxy(this.$volume, 'click', function () {
          setStyle(_this.$volume, 'display', 'none');
          setStyle(_this.$volumeClose, 'display', 'block');
          player.volume(0);
        });
        proxy(this.$volumeClose, 'click', function () {
          setStyle(_this.$volume, 'display', 'block');
          setStyle(_this.$volumeClose, 'display', 'none');
          player.volume(getStorage('volume'));
        });
        proxy(this.$control, 'mouseenter', function () {
          _this.$volumePanel.classList.add('art-volume-panel-hover'); // TODO


          setTimeout(function () {
            _this.setVolumeHandle(player.volume());
          }, 200);
        });
        proxy(this.$control, 'mouseleave', function () {
          _this.$volumePanel.classList.remove('art-volume-panel-hover');
        });
        proxy(this.$volumePanel, 'click', function (event) {
          _this.volumeChangeFromEvent(event);
        });
        proxy(this.$volumeHandle, 'mousedown', function () {
          _this.isDroging = true;
        });
        proxy(this.$volumeHandle, 'mousemove', function (event) {
          if (_this.isDroging) {
            _this.volumeChangeFromEvent(event);
          }
        });
        proxy(document, 'mouseup', function () {
          if (_this.isDroging) {
            _this.isDroging = false;
          }
        });
        this.art.on('video:volumechange', function () {
          var percentage = player.volume();

          _this.setVolumeHandle(percentage);

          if (percentage === 0) {
            setStyle(_this.$volume, 'display', 'none');
            setStyle(_this.$volumeClose, 'display', 'block');
          } else {
            setStyle(_this.$volume, 'display', 'block');
            setStyle(_this.$volumeClose, 'display', 'none');
          }
        });
      }
    }, {
      key: "volumeChangeFromEvent",
      value: function volumeChangeFromEvent(event) {
        var player = this.art.player;

        var _this$$volumePanel$ge = this.$volumePanel.getBoundingClientRect(),
            panelLeft = _this$$volumePanel$ge.left,
            panelWidth = _this$$volumePanel$ge.width;

        var _this$$volumeHandle$g = this.$volumeHandle.getBoundingClientRect(),
            handleWidth = _this$$volumeHandle$g.width;

        var percentage = clamp(event.x - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) / (panelWidth - handleWidth);
        player.volume(percentage);
      }
    }, {
      key: "setVolumeHandle",
      value: function setVolumeHandle() {
        var percentage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.7;

        var _this$$volumePanel$ge2 = this.$volumePanel.getBoundingClientRect(),
            panelWidth = _this$$volumePanel$ge2.width;

        var _this$$volumeHandle$g2 = this.$volumeHandle.getBoundingClientRect(),
            handleWidth = _this$$volumeHandle$g2.width;

        var width = handleWidth / 2 + (panelWidth - handleWidth) * percentage - handleWidth / 2;
        setStyle(this.$volumeHandle, 'left', "".concat(width, "px"));
      }
    }]);

    return Volume;
  }();

  var Setting =
  /*#__PURE__*/
  function () {
    function Setting(option) {
      classCallCheck(this, Setting);

      this.option = option;
    }

    createClass(Setting, [{
      key: "apply",
      value: function apply(art, $control) {
        var _this = this;

        var proxy = art.events.proxy,
            i18n = art.i18n,
            setting = art.setting;
        this.$setting = append($control, icons$1.setting);
        tooltip(this.$setting, i18n.get('Show setting'));
        proxy($control, 'click', function () {
          setting.toggle();
        });
        art.on('setting:show', function () {
          setStyle(_this.$setting, 'opacity', '0.8');
          tooltip(_this.$setting, i18n.get('Hide setting'));
        });
        art.on('setting:hide', function () {
          setStyle(_this.$setting, 'opacity', '1');
          tooltip(_this.$setting, i18n.get('Show setting'));
        });
      }
    }]);

    return Setting;
  }();

  var Thumbnails =
  /*#__PURE__*/
  function () {
    function Thumbnails(option) {
      classCallCheck(this, Thumbnails);

      this.option = option;
      this.loading = false;
      this.isLoad = false;
    }

    createClass(Thumbnails, [{
      key: "apply",
      value: function apply(art, $control) {
        var _this = this;

        this.art = art;
        errorHandle(art.controls.progress, '\'thumbnails\' control dependent on \'progress\' control');
        var $progress = art.refs.$progress,
            proxy = art.events.proxy;
        this.$control = $control;
        proxy($progress, 'mousemove', function (event) {
          if (!_this.loading) {
            _this.loading = true;

            _this.load(_this.art.option.thumbnails.url).then(function () {
              _this.isLoad = true;
            });
          }

          if (_this.isLoad) {
            setStyle($control, 'display', 'block');

            _this.showThumbnails(event);
          }
        });
        proxy($progress, 'mouseout', function () {
          setStyle($control, 'display', 'none');
        });
      }
    }, {
      key: "load",
      value: function load(url) {
        var proxy = this.art.events.proxy;
        return new Promise(function (resolve, reject) {
          var image = new Image();
          image.src = url;

          if (image.complete) {
            return resolve(image);
          }

          proxy(image, 'load', function () {
            return resolve(image);
          });
          proxy(image, 'error', function () {
            return reject(image);
          });
        });
      }
    }, {
      key: "showThumbnails",
      value: function showThumbnails(event) {
        var _this$art = this.art,
            $progress = _this$art.refs.$progress,
            controls = _this$art.controls;

        var _controls$progress$ge = controls.progress.getPosFromEvent(event),
            posWidth = _controls$progress$ge.width;

        var _this$art$option$thum = this.art.option.thumbnails,
            url = _this$art$option$thum.url,
            height = _this$art$option$thum.height,
            width = _this$art$option$thum.width,
            number = _this$art$option$thum.number,
            column = _this$art$option$thum.column;
        var perWidth = $progress.clientWidth / number;
        var perIndex = Math.ceil(posWidth / perWidth);
        var yIndex = Math.ceil(perIndex / column);
        var xIndex = perIndex % column || column;
        setStyle(this.$control, 'backgroundImage', "url(".concat(url, ")"));
        setStyle(this.$control, 'height', "".concat(height, "px"));
        setStyle(this.$control, 'width', "".concat(width, "px"));
        setStyle(this.$control, 'backgroundPosition', "-".concat(--xIndex * width, "px -").concat(--yIndex * height, "px"));

        if (posWidth <= width / 2) {
          setStyle(this.$control, 'left', 0);
        } else if (posWidth > $progress.clientWidth - width / 2) {
          setStyle(this.$control, 'left', "".concat($progress.clientWidth - width, "px"));
        } else {
          setStyle(this.$control, 'left', "".concat(posWidth - width / 2, "px"));
        }
      }
    }]);

    return Thumbnails;
  }();

  var Screenshot =
  /*#__PURE__*/
  function () {
    function Screenshot(option) {
      classCallCheck(this, Screenshot);

      this.option = option;
    }

    createClass(Screenshot, [{
      key: "apply",
      value: function apply(art, $control) {
        var proxy = art.events.proxy,
            i18n = art.i18n,
            player = art.player;
        this.$screenshot = append($control, icons$1.screenshot);
        tooltip(this.$screenshot, i18n.get('Screenshot'));
        proxy(this.$screenshot, 'click', function () {
          player.screenshot();
        });
      }
    }]);

    return Screenshot;
  }();

  var Quality =
  /*#__PURE__*/
  function () {
    function Quality(option) {
      classCallCheck(this, Quality);

      this.option = option;
      this.playIndex = -1;
    }

    createClass(Quality, [{
      key: "apply",
      value: function apply(art, $control) {
        var _this = this;

        var option = art.option,
            _art$events = art.events,
            proxy = _art$events.proxy,
            hover = _art$events.hover,
            player = art.player;
        var defaultQuality = option.quality.find(function (item) {
          return item.default;
        }) || option.quality[0];
        this.playIndex = option.quality.indexOf(defaultQuality);
        var $qualityName = append($control, "<div class=\"art-quality-name\">".concat(defaultQuality.name, "</div>"));
        var qualityList = option.quality.map(function (item, index) {
          return "<div class=\"art-quality-item\" data-index=\"".concat(index, "\">").concat(item.name, "</div>");
        }).join('');
        var $qualitys = append($control, "<div class=\"art-qualitys\">".concat(qualityList, "</div>"));
        hover($control, function () {
          $control.classList.add('hover');
        }, function () {
          $control.classList.remove('hover');
        });
        proxy($qualitys, 'click', function (event) {
          var index = Number(event.target.dataset.index);
          var _option$quality$index = option.quality[index],
              url = _option$quality$index.url,
              name = _option$quality$index.name;

          if (url && name && _this.playIndex !== index) {
            player.switch(url, name);
            $qualityName.innerHTML = name;
            _this.playIndex = index;
          }
        });
      }
    }]);

    return Quality;
  }();

  var id = 0;

  var Controls =
  /*#__PURE__*/
  function () {
    function Controls(art) {
      var _this = this;

      classCallCheck(this, Controls);

      this.art = art;
      this.$map = {};
      this.art.on('firstCanplay', function () {
        _this.init();

        _this.mount();
      });
    }

    createClass(Controls, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        this.add(new Progress({
          name: 'progress',
          disable: false,
          position: 'top',
          index: 10
        }));
        this.add(new Thumbnails({
          name: 'thumbnails',
          disable: !this.art.option.thumbnails.url,
          position: 'top',
          index: 20
        }));
        this.add(new PlayAndPause({
          name: 'playAndPause',
          disable: false,
          position: 'left',
          index: 10
        }));
        this.add(new Volume({
          name: 'volume',
          disable: false,
          position: 'left',
          index: 20
        }));
        this.add(new Time({
          name: 'time',
          disable: false,
          position: 'left',
          index: 30
        }));
        this.add(new Quality({
          name: 'quality',
          disable: this.art.option.quality.length === 0,
          position: 'right',
          index: 10
        }));
        this.add(new Danmu({
          name: 'danmu',
          disable: false,
          position: 'right',
          index: 20
        }));
        this.add(new Screenshot({
          name: 'screenshot',
          disable: !this.art.option.screenshot,
          position: 'right',
          index: 30
        }));
        this.add(new Subtitle({
          name: 'subtitle',
          disable: !this.art.option.subtitle.url,
          position: 'right',
          index: 40
        }));
        this.add(new Setting({
          name: 'setting',
          disable: !this.art.option.setting,
          position: 'right',
          index: 50
        }));
        this.add(new Pip({
          name: 'pip',
          disable: !this.art.option.pip,
          position: 'right',
          index: 60
        }));
        this.add(new FullscreenWeb({
          name: 'fullscreenWeb',
          disable: !this.art.option.fullscreenWeb,
          position: 'right',
          index: 70
        }));
        this.add(new Fullscreen({
          name: 'fullscreen',
          disable: !this.art.option.fullscreen,
          position: 'right',
          index: 80
        }));
        this.art.option.controls.forEach(function (item) {
          _this2.add(item);
        });
      }
    }, {
      key: "add",
      value: function add(control) {
        var option = control.option;

        if (option && !option.disable) {
          id++;
          var name = option.name || control.constructor.name.toLowerCase() || "control".concat(id);
          var $control = document.createElement('div');
          $control.setAttribute('class', "art-control art-control-".concat(name));
          $control.dataset.controlIndex = option.index || id;
          this.commonMethod(control);
          (this.$map[option.position] || (this.$map[option.position] = [])).push($control);
          control.apply && control.apply(this.art, $control);
          this[name] = control;
        }
      }
    }, {
      key: "mount",
      value: function mount() {
        var _this3 = this;

        var _this$art$refs = this.art.refs,
            $progress = _this$art$refs.$progress,
            $controlsLeft = _this$art$refs.$controlsLeft,
            $controlsRight = _this$art$refs.$controlsRight;
        Object.keys(this.$map).forEach(function (key) {
          _this3.$map[key].sort(function (a, b) {
            return Number(a.dataset.controlIndex) - Number(b.dataset.controlIndex);
          }).forEach(function ($control) {
            switch (key) {
              case 'top':
                append($progress, $control);
                break;

              case 'left':
                append($controlsLeft, $control);
                break;

              case 'right':
                append($controlsRight, $control);
                break;

              default:
                break;
            }
          });
        });
      }
    }, {
      key: "commonMethod",
      value: function commonMethod(control) {
        var _this4 = this;

        Object.defineProperty(control, 'hide', {
          value: function value() {
            setStyle(control.option.$control, 'display', 'none');

            _this4.art.emit('control:hide', control.option.$control);
          }
        });
        Object.defineProperty(control, 'show', {
          value: function value() {
            setStyle(control.option.$control, 'display', 'block');

            _this4.art.emit('control:show', control.option.$control);
          }
        });
      }
    }, {
      key: "show",
      value: function show() {
        var $player = this.art.refs.$player;
        $player.classList.add('artplayer-controls-show');
      }
    }, {
      key: "hide",
      value: function hide() {
        var $player = this.art.refs.$player;
        $player.classList.remove('artplayer-controls-show');
      }
    }]);

    return Controls;
  }();

  function playbackRate(art) {
    var option = art.option,
        i18n = art.i18n,
        player = art.player,
        contextmenu = art.contextmenu;
    return {
      disable: !option.playbackRate,
      name: 'playbackRate',
      index: 10,
      html: "\n      ".concat(i18n.get('Play speed'), ":\n      <span data-rate=\"0.5\">0.5</span>\n      <span data-rate=\"0.75\">0.75</span>\n      <span data-rate=\"1\" class=\"normal current\">").concat(i18n.get('Normal'), "</span>\n      <span data-rate=\"1.25\">1.25</span>\n      <span data-rate=\"1.5\">1.5</span>\n      <span data-rate=\"2.0\">2.0</span>\n    "),
      click: function click(event) {
        var target = event.target;
        var rate = target.dataset.rate;

        if (rate) {
          player.playbackRate(Number(rate));
          sublings(target).forEach(function (item) {
            return item.classList.remove('current');
          });
          target.classList.add('current');
          contextmenu.hide();
        }
      }
    };
  }

  function aspectRatio(art) {
    var option = art.option,
        i18n = art.i18n,
        player = art.player,
        contextmenu = art.contextmenu;
    return {
      disable: !option.aspectRatio,
      name: 'aspectRatio',
      index: 20,
      html: "\n      ".concat(i18n.get('Aspect ratio'), ":\n      <span data-ratio=\"default\" class=\"default current\">").concat(i18n.get('Default'), "</span>\n      <span data-ratio=\"4:3\">4:3</span>\n      <span data-ratio=\"16:9\">16:9</span>\n    "),
      click: function click(event) {
        var target = event.target;
        var ratio = target.dataset.ratio;

        if (ratio) {
          player.aspectRatio(ratio.split(':'));
          sublings(target).forEach(function (item) {
            return item.classList.remove('current');
          });
          target.classList.add('current');
          contextmenu.hide();
        }
      }
    };
  }

  function info(art) {
    return {
      disable: false,
      name: 'info',
      index: 30,
      html: art.i18n.get('Video info'),
      click: function click() {
        art.info.show();
        art.contextmenu.hide();
      }
    };
  }

  var version = {
    disable: false,
    name: 'version',
    index: 40,
    html: '<a href="https://github.com/zhw2590582/artplayer" target="_blank">ArtPlayer 1.0.0</a>'
  };

  function close(art) {
    return {
      disable: false,
      name: 'close',
      index: 50,
      html: art.i18n.get('Close'),
      click: function click() {
        art.contextmenu.hide();
      }
    };
  }

  var id$1 = 0;

  var Contextmenu =
  /*#__PURE__*/
  function () {
    function Contextmenu(art) {
      classCallCheck(this, Contextmenu);

      this.art = art;
      this.init();
    }

    createClass(Contextmenu, [{
      key: "init",
      value: function init() {
        var _this = this;

        var _this$art = this.art,
            option = _this$art.option,
            refs = _this$art.refs,
            proxy = _this$art.events.proxy;
        option.contextmenu.push(playbackRate, aspectRatio, info, version, close);
        proxy(refs.$player, 'contextmenu', function (event) {
          event.preventDefault();

          if (!refs.$contextmenu) {
            _this.creatMenu();
          }

          _this.show();

          _this.setPos(event);
        });
        proxy(refs.$player, 'click', function (event) {
          if (refs.$contextmenu && !event.composedPath().includes(refs.$contextmenu)) {
            _this.hide();
          }
        });
      }
    }, {
      key: "creatMenu",
      value: function creatMenu() {
        var _this2 = this;

        var _this$art2 = this.art,
            option = _this$art2.option,
            refs = _this$art2.refs,
            proxy = _this$art2.events.proxy;
        refs.$contextmenu = document.createElement('div');
        refs.$contextmenu.classList.add('artplayer-contextmenu');
        option.contextmenu.filter(function (item) {
          return !item.disable;
        }).map(function (item) {
          id$1++;
          var menu = typeof item === 'function' ? item(_this2.art) : item;
          var $menu = document.createElement('div');
          $menu.dataset.artMenuId = menu.index || id$1;
          $menu.setAttribute('class', "art-menu art-menu-".concat(menu.name || id$1));
          append($menu, menu.html);
          setStyles($menu, menu.style || {});

          if (menu.click) {
            proxy($menu, 'click', function (event) {
              event.preventDefault();
              menu.click.call(_this2, event);

              _this2.art.emit('contextmenu:click', $menu);
            });
          }

          _this2["$".concat(menu.name || id$1)] = $menu;
          return $menu;
        }).sort(function (a, b) {
          return Number(a.dataset.artMenuId) - Number(b.dataset.artMenuId);
        }).forEach(function (item) {
          append(refs.$contextmenu, item);
        });
        append(refs.$player, refs.$contextmenu);
      }
    }, {
      key: "setPos",
      value: function setPos(event) {
        var refs = this.art.refs;
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        var _refs$$player$getBoun = refs.$player.getBoundingClientRect(),
            cHeight = _refs$$player$getBoun.height,
            cWidth = _refs$$player$getBoun.width,
            cLeft = _refs$$player$getBoun.left,
            cTop = _refs$$player$getBoun.top;

        var _refs$$contextmenu$ge = refs.$contextmenu.getBoundingClientRect(),
            mHeight = _refs$$contextmenu$ge.height,
            mWidth = _refs$$contextmenu$ge.width;

        var menuLeft = mouseX - cLeft;
        var menuTop = mouseY - cTop;

        if (mouseX + mWidth > cLeft + cWidth) {
          menuLeft = cWidth - mWidth;
        }

        if (mouseY + mHeight > cTop + cHeight) {
          menuTop = cHeight - mHeight;
        }

        setStyle(refs.$contextmenu, 'left', "".concat(menuLeft, "px"));
        setStyle(refs.$contextmenu, 'top', "".concat(menuTop, "px"));
      }
    }, {
      key: "hide",
      value: function hide() {
        var $contextmenu = this.art.refs.$contextmenu;

        if ($contextmenu) {
          setStyle($contextmenu, 'display', 'none');
          this.art.emit('contextmenu:hide', $contextmenu);
        }
      }
    }, {
      key: "show",
      value: function show() {
        var $contextmenu = this.art.refs.$contextmenu;

        if ($contextmenu) {
          setStyle($contextmenu, 'display', 'block');
          this.art.emit('contextmenu:show', $contextmenu);
        }
      }
    }]);

    return Contextmenu;
  }();

  var Danmu$1 =
  /*#__PURE__*/
  function () {
    function Danmu(art) {
      classCallCheck(this, Danmu);

      this.art = art;
      this.isOpen = true;
      this.init();
    }

    createClass(Danmu, [{
      key: "init",
      value: function init() {//
      }
    }, {
      key: "show",
      value: function show() {
        var _this$art = this.art,
            $danmu = _this$art.refs.$danmu,
            i18n = _this$art.i18n,
            notice = _this$art.notice;
        setStyle($danmu, 'display', 'block');
        this.isOpen = true;
        notice.show(i18n.get('Show danmu'));
        this.art.emit('danmu:show', $danmu);
      }
    }, {
      key: "hide",
      value: function hide() {
        var _this$art2 = this.art,
            $danmu = _this$art2.refs.$danmu,
            i18n = _this$art2.i18n,
            notice = _this$art2.notice;
        setStyle($danmu, 'display', 'none');
        this.isOpen = false;
        notice.show(i18n.get('Hide danmu'));
        this.art.emit('danmu:hide', $danmu);
      }
    }]);

    return Danmu;
  }();

  var Info =
  /*#__PURE__*/
  function () {
    function Info(art) {
      classCallCheck(this, Info);

      this.art = art;
      this.init();
    }

    createClass(Info, [{
      key: "init",
      value: function init() {
        var _this = this;

        var _this$art = this.art,
            _this$art$refs = _this$art.refs,
            $infoClose = _this$art$refs.$infoClose,
            $infoPanel = _this$art$refs.$infoPanel,
            proxy = _this$art.events.proxy;
        proxy($infoClose, 'click', function () {
          _this.hide();
        });
        this.art.on('switch', function () {
          if ($infoPanel.innerHTML) {
            _this.getHeader();
          }
        });
      }
    }, {
      key: "show",
      value: function show() {
        var _this$art$refs2 = this.art.refs,
            $info = _this$art$refs2.$info,
            $infoPanel = _this$art$refs2.$infoPanel;
        setStyle($info, 'display', 'block');

        if (!$infoPanel.innerHTML) {
          append($infoPanel, this.creatInfo());
          this.getHeader();
        }

        clearTimeout(this.timer);
        this.loop();
        this.art.emit('info:show', $info);
      }
    }, {
      key: "creatInfo",
      value: function creatInfo() {
        var infoHtml = [];
        infoHtml.push("\n      <div class=\"art-info-item \">\n        <div class=\"art-info-title\">Player version:</div>\n        <div class=\"art-info-content\">1.0.0</div>\n      </div>\n    ");
        infoHtml.push("\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video url:</div>\n        <div class=\"art-info-content\" data-video=\"currentSrc\"></div>\n      </div>\n    ");
        infoHtml.push("\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video type:</div>\n        <div class=\"art-info-content\" data-head=\"Content-Type\"></div>\n      </div>\n    ");
        infoHtml.push("\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video size:</div>\n        <div class=\"art-info-content\" data-head=\"Content-length\"></div>\n      </div>\n    ");
        infoHtml.push("\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video volume:</div>\n        <div class=\"art-info-content\" data-video=\"volume\"></div>\n      </div>\n    ");
        infoHtml.push("\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video time:</div>\n        <div class=\"art-info-content\" data-video=\"currentTime\"></div>\n      </div>\n    ");
        infoHtml.push("\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video duration:</div>\n        <div class=\"art-info-content\" data-video=\"duration\"></div>\n      </div>\n    ");
        infoHtml.push("\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video resolution:</div>\n        <div class=\"art-info-content\">\n          <span data-video=\"videoWidth\"></span> x <span data-video=\"videoHeight\"></span>\n        </div>\n      </div>\n    ");
        return infoHtml.join('');
      }
    }, {
      key: "getHeader",
      value: function getHeader() {
        var _this$art$refs3 = this.art.refs,
            $infoPanel = _this$art$refs3.$infoPanel,
            $video = _this$art$refs3.$video;
        var url = $video.src;
        var types = Array.from($infoPanel.querySelectorAll('[data-head]'));
        types.forEach(function (item) {
          item.innerHTML = 'loading...';
        });
        fetch(url, {
          method: 'HEAD'
        }).then(function (data) {
          types.forEach(function (item) {
            var value = data.headers.get(item.dataset.head);
            item.innerHTML = value !== undefined ? value : 'unknown';
          });
        }).catch(function () {
          types.forEach(function (item) {
            item.innerHTML = 'unknown';
          });
        });
      }
    }, {
      key: "readInfo",
      value: function readInfo() {
        var _this$art$refs4 = this.art.refs,
            $infoPanel = _this$art$refs4.$infoPanel,
            $video = _this$art$refs4.$video;
        var types = Array.from($infoPanel.querySelectorAll('[data-video]'));
        types.forEach(function (item) {
          var value = $video[item.dataset.video];
          item.innerHTML = value !== undefined ? value : 'unknown';
        });
      }
    }, {
      key: "loop",
      value: function loop() {
        var _this2 = this;

        this.readInfo();
        this.timer = setTimeout(function () {
          _this2.readInfo();

          _this2.loop();
        }, 1000);
      }
    }, {
      key: "hide",
      value: function hide() {
        var $info = this.art.refs.$info;
        setStyle($info, 'display', 'none');
        clearTimeout(this.timer);
        this.art.emit('info:hide', $info);
      }
    }]);

    return Info;
  }();

  var Subtitle$1 =
  /*#__PURE__*/
  function () {
    function Subtitle(art) {
      classCallCheck(this, Subtitle);

      this.art = art;
      this.state = true;
      this.vttText = '';
      var url = this.art.option.subtitle.url;

      if (url) {
        this.checkExt(url);
        this.init();
      }
    }

    createClass(Subtitle, [{
      key: "init",
      value: function init() {
        var _this = this;

        var _this$art = this.art,
            proxy = _this$art.events.proxy,
            subtitle = _this$art.option.subtitle,
            _this$art$refs = _this$art.refs,
            $video = _this$art$refs.$video,
            $subtitle = _this$art$refs.$subtitle;
        setStyles($subtitle, subtitle.style || {});
        var $track = document.createElement('track');
        $track.default = true;
        $track.kind = 'metadata';
        this.load(subtitle.url).then(function (data) {
          $track.src = data;
          $video.appendChild($track);
          _this.art.refs.$track = $track;

          if ($video.textTracks && $video.textTracks[0]) {
            var _$video$textTracks = slicedToArray($video.textTracks, 1),
                track = _$video$textTracks[0];

            proxy(track, 'cuechange', function () {
              var _track$activeCues = slicedToArray(track.activeCues, 1),
                  cue = _track$activeCues[0];

              $subtitle.innerHTML = '';

              if (cue) {
                var template = document.createElement('div');
                template.appendChild(cue.getCueAsHTML());
                $subtitle.innerHTML = template.innerHTML.split(/\r?\n/).map(function (item) {
                  return "<p>".concat(item, "</p>");
                }).join('');
              }

              _this.art.emit('subtitle:update', $subtitle);
            });
          }
        });
      }
    }, {
      key: "load",
      value: function load(url) {
        var _this2 = this;

        var notice = this.art.notice;
        var type;
        return fetch(url).then(function (response) {
          type = response.headers.get('Content-Type');
          return response.text();
        }).then(function (text) {
          if (/x-subrip/gi.test(type)) {
            _this2.vttText = _this2.srtToVtt(text);
          } else {
            _this2.vttText = text;
          }

          return _this2.vttToBlob(_this2.vttText);
        }).catch(function (err) {
          notice.show(err);
          console.warn(err);
          throw err;
        });
      }
    }, {
      key: "srtToVtt",
      value: function srtToVtt(text) {
        return 'WEBVTT \r\n\r\n'.concat(text.replace(/\{\\([ibu])\}/g, '</$1>').replace(/\{\\([ibu])1\}/g, '<$1>').replace(/\{([ibu])\}/g, '<$1>').replace(/\{\/([ibu])\}/g, '</$1>').replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2').concat('\r\n\r\n'));
      }
    }, {
      key: "vttToBlob",
      value: function vttToBlob(vttText) {
        return URL.createObjectURL(new Blob([vttText], {
          type: 'text/vtt'
        }));
      }
    }, {
      key: "checkExt",
      value: function checkExt(url) {
        var ext = getExt(url);
        errorHandle(ext === 'vtt' || ext === 'srt', "'subtitle.url' option require 'vtt' or 'srt' format, but got '".concat(ext, "'."));
      }
    }, {
      key: "show",
      value: function show() {
        var _this$art2 = this.art,
            $subtitle = _this$art2.refs.$subtitle,
            i18n = _this$art2.i18n,
            notice = _this$art2.notice;
        setStyle($subtitle, 'display', 'block');
        this.state = true;
        notice.show(i18n.get('Show subtitle'));
        this.art.emit('subtitle:show', $subtitle);
      }
    }, {
      key: "hide",
      value: function hide() {
        var _this$art3 = this.art,
            $subtitle = _this$art3.refs.$subtitle,
            i18n = _this$art3.i18n,
            notice = _this$art3.notice;
        setStyle($subtitle, 'display', 'none');
        this.state = false;
        notice.show(i18n.get('Hide subtitle'));
        this.art.emit('subtitle:hide', $subtitle);
      }
    }, {
      key: "toggle",
      value: function toggle() {
        if (this.state) {
          this.hide();
        } else {
          this.show();
        }
      }
    }, {
      key: "switch",
      value: function _switch(url) {
        var _this3 = this;

        var $track = this.art.refs.$track;
        this.checkExt(url);
        errorHandle($track, 'You need to initialize the subtitle option first.');
        this.load(url).then(function (data) {
          $track.src = data;

          _this3.art.emit('subtitle:switch', url);
        });
      }
    }]);

    return Subtitle;
  }();

  var Events =
  /*#__PURE__*/
  function () {
    function Events(art) {
      classCallCheck(this, Events);

      this.art = art;
      this.destroyEvents = [];
      this.proxy = this.proxy.bind(this);
      this.hover = this.hover.bind(this);
      this.init();
    }

    createClass(Events, [{
      key: "init",
      value: function init() {
        var _this = this;

        var $player = this.art.refs.$player;
        this.hover($player, function () {
          $player.classList.add('artplayer-hover');

          _this.art.emit('hoverenter');
        }, function () {
          $player.classList.remove('artplayer-hover');
          $player.classList.remove('artplayer-hide-cursor');

          _this.art.emit('hoverleave');
        });
        this.proxy(document, ['click', 'contextmenu'], function (event) {
          if (event.composedPath().indexOf($player) > -1) {
            _this.art.isFocus = true;
          } else {
            _this.art.isFocus = false;

            _this.art.contextmenu.hide();
          }
        });
        var hideCursor = debounce(function () {
          $player.classList.add('artplayer-hide-cursor');

          if (_this.art.player.fullscreenState || _this.art.player.fullscreenWebState) {
            $player.classList.remove('artplayer-hover');

            _this.art.controls.hide();
          }
        }, 5000);
        this.proxy($player, 'mousemove', function () {
          $player.classList.remove('artplayer-hide-cursor');

          _this.art.controls.show();

          if (!_this.art.player.pipState) {
            hideCursor();
          } else {
            hideCursor.clearTimeout();
          }
        });
      }
    }, {
      key: "proxy",
      value: function proxy(target, name, callback) {
        var _this2 = this;

        var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        if (Array.isArray(name)) {
          name.forEach(function (item) {
            return _this2.proxy(target, item, callback, option);
          });
          return;
        }

        target.addEventListener(name, callback, option);
        this.destroyEvents.push(function () {
          target.removeEventListener(name, callback, option);
        });
      }
    }, {
      key: "hover",
      value: function hover(target, mouseenter, mouseleave) {
        this.proxy(target, 'mouseenter', mouseenter);
        this.proxy(target, 'mouseleave', mouseleave);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.destroyEvents.forEach(function (event) {
          return event();
        });
      }
    }]);

    return Events;
  }();

  var Hotkey =
  /*#__PURE__*/
  function () {
    function Hotkey(art) {
      classCallCheck(this, Hotkey);

      this.art = art;

      if (this.art.option.hotkey) {
        this.init();
      }
    }

    createClass(Hotkey, [{
      key: "init",
      value: function init() {
        var _this = this;

        var _this$art = this.art,
            player = _this$art.player,
            proxy = _this$art.events.proxy;
        proxy(window, 'keydown', function (event) {
          if (_this.art.isFocus) {
            var tag = document.activeElement.tagName.toUpperCase();
            var editable = document.activeElement.getAttribute('contenteditable');

            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
              switch (event.keyCode) {
                case 39:
                  event.preventDefault();
                  player.seek(player.currentTime() + 10);
                  break;

                case 37:
                  event.preventDefault();
                  player.seek(player.currentTime() - 10);
                  break;

                case 38:
                  event.preventDefault();
                  player.volume(player.volume() + 0.05);
                  break;

                case 40:
                  event.preventDefault();
                  player.volume(player.volume() - 0.05);
                  break;

                case 32:
                  event.preventDefault();
                  player.toggle();
                  break;

                default:
                  break;
              }
            }
          }
        });
      }
    }]);

    return Hotkey;
  }();

  var id$2 = 0;

  var Layers =
  /*#__PURE__*/
  function () {
    function Layers(art) {
      classCallCheck(this, Layers);

      this.art = art;
      this.add = this.add.bind(this);
      this.art.option.layers.filter(function (item) {
        return !item.disable;
      }).forEach(this.add);
    }

    createClass(Layers, [{
      key: "add",
      value: function add(option, callback) {
        var $layers = this.art.refs.$layers;
        id$2++;
        var $layer = document.createElement('div');
        $layer.setAttribute('data-art-layer-id', id$2);
        $layer.setAttribute('class', "art-layer art-layer-".concat(option.name || id$2));
        setStyle($layer, 'z-index', option.index || id$2);
        append($layer, option.html);
        setStyles($layer, option.style || {});
        $layers.appendChild($layer);
        this.art.emit('layers:add', $layer);
        callback && callback($layer);
      }
    }, {
      key: "show",
      value: function show() {
        var $layers = this.art.refs.$layers;
        setStyle($layers, 'display', 'block');
        this.art.emit('layers:show', $layers);
      }
    }, {
      key: "hide",
      value: function hide() {
        var $layers = this.art.refs.$layers;
        setStyle($layers, 'display', 'none');
        this.art.emit('layers:hide', $layers);
      }
    }]);

    return Layers;
  }();

  var Loading =
  /*#__PURE__*/
  function () {
    function Loading(art) {
      classCallCheck(this, Loading);

      this.art = art;
      var option = art.option,
          $loading = art.refs.$loading;
      append($loading, option.loading || icons$1.loading);
    }

    createClass(Loading, [{
      key: "hide",
      value: function hide() {
        var $loading = this.art.refs.$loading;
        setStyle($loading, 'display', 'none');
        this.art.emit('loading:hide', $loading);
      }
    }, {
      key: "show",
      value: function show() {
        var $loading = this.art.refs.$loading;
        setStyle($loading, 'display', 'flex');
        this.art.emit('loading:show', $loading);
      }
    }]);

    return Loading;
  }();

  var Notice =
  /*#__PURE__*/
  function () {
    function Notice(art) {
      classCallCheck(this, Notice);

      this.art = art;
      this.timer = null;
    }

    createClass(Notice, [{
      key: "show",
      value: function show(msg) {
        var _this = this;

        var autoHide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
        var _this$art$refs = this.art.refs,
            $notice = _this$art$refs.$notice,
            $noticeInner = _this$art$refs.$noticeInner;
        setStyle($notice, 'display', 'block');
        $noticeInner.innerHTML = msg instanceof Error ? msg.message.trim() : msg;

        if (autoHide) {
          clearTimeout(this.timer);
          this.timer = setTimeout(function () {
            _this.hide();
          }, time);
        }

        this.art.emit('notice:show', $notice);
      }
    }, {
      key: "hide",
      value: function hide() {
        var $notice = this.art.refs.$notice;
        setStyle($notice, 'display', 'none');
        this.art.emit('notice:hide', $notice);
      }
    }]);

    return Notice;
  }();

  var Mask =
  /*#__PURE__*/
  function () {
    function Mask(art) {
      classCallCheck(this, Mask);

      this.art = art;
      var option = art.option,
          $mask = art.refs.$mask;
      append($mask, option.play || icons$1.playBig);
    }

    createClass(Mask, [{
      key: "show",
      value: function show() {
        var $mask = this.art.refs.$mask;
        setStyle($mask, 'display', 'flex');
        this.art.emit('mask:show', $mask);
      }
    }, {
      key: "hide",
      value: function hide() {
        var $mask = this.art.refs.$mask;
        setStyle($mask, 'display', 'none');
        this.art.emit('mask:show', $mask);
      }
    }]);

    return Mask;
  }();

  var Common =
  /*#__PURE__*/
  function () {
    function Common(option) {
      classCallCheck(this, Common);

      this.option = option;
    }

    createClass(Common, [{
      key: "apply",
      value: function apply(art, $setting) {
        this.art = art;
        this.$header = $setting.querySelector('.art-setting-header');
        this.$body = $setting.querySelector('.art-setting-body');
        append(this.$body, '———— 先占坑，暂无设置 ————');
      }
    }]);

    return Common;
  }();

  var id$3 = 0;

  var Setting$1 =
  /*#__PURE__*/
  function () {
    function Setting(art) {
      classCallCheck(this, Setting);

      this.art = art;
      this.state = false;
      this.$settings = [];

      if (art.option.setting) {
        this.init();
        this.mount();
      }
    }

    createClass(Setting, [{
      key: "init",
      value: function init() {
        var _this = this;

        var _this$art = this.art,
            $settingClose = _this$art.refs.$settingClose,
            proxy = _this$art.events.proxy;
        proxy($settingClose, 'click', function () {
          _this.hide();
        });
        this.add(new Common({
          name: 'common',
          title: 'Common',
          disable: false,
          index: 10
        }));
      }
    }, {
      key: "add",
      value: function add(setting) {
        var option = setting.option;

        if (option && !option.disable) {
          id$3++;
          var name = option.name || setting.constructor.name.toLowerCase() || "setting".concat(id$3);
          var title = option.title || name;
          var $setting = document.createElement('div');
          $setting.setAttribute('class', "art-setting art-setting-".concat(name));
          $setting.dataset.settingIndex = option.index || id$3;
          append($setting, "<div class=\"art-setting-header\">".concat(this.art.i18n.get(title), "</div>"));
          append($setting, '<div class="art-setting-body"></div>');
          this.$settings.push($setting);
          setting.apply && setting.apply(this.art, $setting);
          this[name] = setting;
        }
      }
    }, {
      key: "mount",
      value: function mount() {
        var _this2 = this;

        this.$settings.sort(function (a, b) {
          return Number(a.dataset.settingIndex) - Number(b.dataset.settingIndex);
        }).forEach(function ($setting) {
          append(_this2.art.refs.$settingBody, $setting);
        });
      }
    }, {
      key: "show",
      value: function show() {
        var _this$art2 = this.art,
            $setting = _this$art2.refs.$setting,
            i18n = _this$art2.i18n,
            notice = _this$art2.notice;
        setStyle($setting, 'display', 'flex');
        this.state = true;
        notice.show(i18n.get('Show setting'));
        this.art.emit('setting:show', $setting);
      }
    }, {
      key: "hide",
      value: function hide() {
        var _this$art3 = this.art,
            $setting = _this$art3.refs.$setting,
            i18n = _this$art3.i18n,
            notice = _this$art3.notice;
        setStyle($setting, 'display', 'none');
        this.state = false;
        notice.show(i18n.get('Hide setting'));
        this.art.emit('setting:hide', $setting);
      }
    }, {
      key: "toggle",
      value: function toggle() {
        if (this.state) {
          this.hide();
        } else {
          this.show();
        }
      }
    }]);

    return Setting;
  }();

  var id$4 = 0;

  var Artplayer =
  /*#__PURE__*/
  function (_Emitter) {
    inherits(Artplayer, _Emitter);

    function Artplayer(option) {
      var _this;

      classCallCheck(this, Artplayer);

      _this = possibleConstructorReturn(this, getPrototypeOf(Artplayer).call(this));

      _this.emit('init:start');

      _this.option = deepMerge({}, Artplayer.DEFAULTS, option);
      optionValidator(_this.option, scheme);

      _this.init();

      _this.emit('init:end');

      return _this;
    }

    createClass(Artplayer, [{
      key: "init",
      value: function init() {
        this.isFocus = false;
        this.isPlaying = false;
        this.refs = {};

        if (this.option.container instanceof Element) {
          this.refs.$container = this.option.container;
        } else {
          this.refs.$container = document.querySelector(this.option.container);
        }

        this.template = new Template(this);
        this.i18n = new I18n(this);
        this.notice = new Notice(this);
        this.events = new Events(this);
        this.player = new Player(this);
        this.layers = new Layers(this);
        this.controls = new Controls(this);
        this.contextmenu = new Contextmenu(this);
        this.danmu = new Danmu$1(this);
        this.subtitle = new Subtitle$1(this);
        this.info = new Info(this);
        this.loading = new Loading(this);
        this.hotkey = new Hotkey(this);
        this.mask = new Mask(this);
        this.setting = new Setting$1(this);
        this.id = id$4++;
        Artplayer.instances.push(this);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var removeHtml = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this.events.destroy();
        Artplayer.instances.splice(Artplayer.instances.indexOf(this), 1);

        if (removeHtml) {
          this.refs.$container.innerHTML = '';
        } else {
          this.refs.$player.classList.add('artplayer-destroy');
        }

        this.emit('destroy');
      }
    }], [{
      key: "use",
      value: function use(plugin) {
        var installedPlugins = this.plugins || (this.plugins = []);

        if (installedPlugins.indexOf === -1) {
          installedPlugins.push(plugin);
          var args = Array.from(arguments).slice(1);
          args.unshift(this);
          plugin.apply(null, args);
          this.prototype.emit('use', plugin);
        }

        return this;
      }
    }, {
      key: "version",
      get: function get() {
        return '1.0.0';
      }
    }, {
      key: "config",
      get: function get() {
        return config;
      }
    }, {
      key: "DEFAULTS",
      get: function get() {
        return {
          container: '.artplayer',
          url: '',
          poster: '',
          title: '',
          volume: 0.7,
          thumbnails: {
            url: '',
            number: 60,
            width: 160,
            height: 90,
            column: 10
          },
          screenshot: true,
          autoplay: false,
          playbackRate: true,
          aspectRatio: true,
          loop: false,
          type: '',
          mimeCodec: '',
          layers: [],
          contextmenu: [],
          quality: [],
          loading: '',
          play: '',
          theme: '#f00',
          setting: false,
          hotkey: true,
          pip: true,
          mutex: true,
          fullscreen: true,
          fullscreenWeb: true,
          subtitle: {
            url: '',
            style: {}
          },
          controls: [],
          highlight: [],
          moreVideoAttr: {
            'crossOrigin': 'anonymous',
            'controls': false,
            'preload': 'auto',
            'webkit-playsinline': true,
            'playsinline': true
          },
          lang: navigator.language.toLowerCase()
        };
      }
    }]);

    return Artplayer;
  }(tinyEmitter);

  Artplayer.instances = [];
  window.Artplayer = Artplayer;

  exports.default = Artplayer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer.js.map
