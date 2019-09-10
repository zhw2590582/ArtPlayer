(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Artplayer = factory());
}(this, function () { 'use strict';

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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

  var optionValidator = createCommonjsModule(function (module, exports) {
  !function(r,t){module.exports=t();}(commonjsGlobal,function(){function e(r){return (e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(r)}var n=Object.prototype.toString,c=function(r){if(void 0===r)return "undefined";if(null===r)return "null";var t=e(r);if("boolean"===t)return "boolean";if("string"===t)return "string";if("number"===t)return "number";if("symbol"===t)return "symbol";if("function"===t)return function(r){return "GeneratorFunction"===o(r)}(r)?"generatorfunction":"function";if(function(r){return Array.isArray?Array.isArray(r):r instanceof Array}(r))return "array";if(function(r){if(r.constructor&&"function"==typeof r.constructor.isBuffer)return r.constructor.isBuffer(r);return !1}(r))return "buffer";if(function(r){try{if("number"==typeof r.length&&"function"==typeof r.callee)return !0}catch(r){if(-1!==r.message.indexOf("callee"))return !0}return !1}(r))return "arguments";if(function(r){return r instanceof Date||"function"==typeof r.toDateString&&"function"==typeof r.getDate&&"function"==typeof r.setDate}(r))return "date";if(function(r){return r instanceof Error||"string"==typeof r.message&&r.constructor&&"number"==typeof r.constructor.stackTraceLimit}(r))return "error";if(function(r){return r instanceof RegExp||"string"==typeof r.flags&&"boolean"==typeof r.ignoreCase&&"boolean"==typeof r.multiline&&"boolean"==typeof r.global}(r))return "regexp";switch(o(r)){case"Symbol":return "symbol";case"Promise":return "promise";case"WeakMap":return "weakmap";case"WeakSet":return "weakset";case"Map":return "map";case"Set":return "set";case"Int8Array":return "int8array";case"Uint8Array":return "uint8array";case"Uint8ClampedArray":return "uint8clampedarray";case"Int16Array":return "int16array";case"Uint16Array":return "uint16array";case"Int32Array":return "int32array";case"Uint32Array":return "uint32array";case"Float32Array":return "float32array";case"Float64Array":return "float64array"}if(function(r){return "function"==typeof r.throw&&"function"==typeof r.return&&"function"==typeof r.next}(r))return "generator";switch(t=n.call(r)){case"[object Object]":return "object";case"[object Map Iterator]":return "mapiterator";case"[object Set Iterator]":return "setiterator";case"[object String Iterator]":return "stringiterator";case"[object Array Iterator]":return "arrayiterator"}return t.slice(8,-1).toLowerCase().replace(/\s/g,"")};function o(r){return r.constructor?r.constructor.name:null}function f(r,t){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:["option"];return s(r,t,e),y(r,t,e),function(a,i,u){var r=c(i),t=c(a);if("object"===r){if("object"!==t)throw new Error("[Type Error]: '".concat(u.join("."),"' require 'object' type, but got '").concat(t,"'"));Object.keys(i).forEach(function(r){var t=a[r],e=i[r],n=u.slice();n.push(r),s(t,e,n),y(t,e,n),f(t,e,n);});}if("array"===r){if("array"!==t)throw new Error("[Type Error]: '".concat(u.join("."),"' require 'array' type, but got '").concat(t,"'"));a.forEach(function(r,t){var e=a[t],n=i[t]||i[0],o=u.slice();o.push(t),s(e,n,o),y(e,n,o),f(e,n,o);});}}(r,t,e),r}function s(r,t,e){if("string"===c(t)){var n=c(r);if(!(-1<t.indexOf("|")?t.split("|").map(function(r){return r.toLowerCase().trim()}).filter(Boolean).some(function(r){return n===r}):t.toLowerCase().trim()===n))throw new Error("[Type Error]: '".concat(e.join("."),"' require '").concat(t,"' type, but got '").concat(n,"'"))}}function y(r,t,e){if("function"===c(t)){var n=t(r,c(r),e);if(!0!==n){var o=c(n);throw"string"===o?new Error(n):"error"===o?n:new Error("[Validator Error]: The scheme for '".concat(e.join("."),"' validator require return true, but got '").concat(n,"'"))}}}return f.kindOf=c,f});
  });

  var Emitter =
  /*#__PURE__*/
  function () {
    function Emitter() {
      classCallCheck(this, Emitter);
    }

    createClass(Emitter, [{
      key: "on",
      value: function on(name, fn, ctx) {
        var e = this.e || (this.e = {});
        (e[name] || (e[name] = [])).push({
          fn: fn,
          ctx: ctx
        });
        return this;
      }
    }, {
      key: "once",
      value: function once(name, fn, ctx) {
        var self = this;

        function listener() {
          self.off(name, listener);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          fn.apply(ctx, args);
        }

        listener._ = fn;
        return this.on(name, listener, ctx);
      }
    }, {
      key: "emit",
      value: function emit(name) {
        var evtArr = ((this.e || (this.e = {}))[name] || []).slice();

        for (var _len2 = arguments.length, data = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          data[_key2 - 1] = arguments[_key2];
        }

        for (var i = 0; i < evtArr.length; i += 1) {
          evtArr[i].fn.apply(evtArr[i].ctx, data);
        }

        return this;
      }
    }, {
      key: "off",
      value: function off(name, callback) {
        var e = this.e || (this.e = {});
        var evts = e[name];
        var liveEvents = [];

        if (evts && callback) {
          for (var i = 0, len = evts.length; i < len; i += 1) {
            if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
          }
        }

        if (liveEvents.length) {
          e[name] = liveEvents;
        } else {
          delete e[name];
        }

        return this;
      }
    }]);

    return Emitter;
  }();

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
        Error.captureStackTrace(assertThisInitialized(_this), context || _this.constructor);
      }

      _this.name = 'ArtPlayerError';
      return _this;
    }

    return ArtPlayerError;
  }(wrapNativeSuper(Error));

  function errorHandle(condition, msg) {
    if (!condition) {
      throw new ArtPlayerError(msg);
    }

    return condition;
  }
  function hasOwnProperty(obj, name) {
    return Object.prototype.hasOwnProperty.call(obj, name);
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
  function secondToTime(second) {
    var add0 = function add0(num) {
      return num < 10 ? "0".concat(num) : String(num);
    };

    var hour = Math.floor(second / 3600);
    var min = Math.floor((second - hour * 3600) / 60);
    var sec = Math.floor(second - hour * 3600 - min * 60);
    return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
  }
  function sleep() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }
  function debounce(func, wait, context) {
    var timeout;

    function fn() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

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
  function throttle(callback, delay) {
    var isThrottled = false;
    var args;
    var context;

    function fn() {
      for (var _len2 = arguments.length, args2 = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args2[_key2] = arguments[_key2];
      }

      if (isThrottled) {
        args = args2;
        context = this;
        return;
      }

      isThrottled = true;
      callback.apply(this, args2);
      setTimeout(function () {
        isThrottled = false;

        if (args) {
          fn.apply(context, args);
          args = null;
          context = null;
        }
      }, delay);
    }

    return fn;
  }
  function mergeDeep() {
    var isObject = function isObject(item) {
      return item && _typeof_1(item) === 'object' && !Array.isArray(item);
    };

    for (var _len3 = arguments.length, objects = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      objects[_key3] = arguments[_key3];
    }

    return objects.reduce(function (prev, obj) {
      Object.keys(obj).forEach(function (key) {
        var pVal = prev[key];
        var oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat.apply(pVal, toConsumableArray(oVal));
        } else if (isObject(pVal) && isObject(oVal) && !(oVal instanceof Element)) {
          prev[key] = mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });
      return prev;
    }, {});
  }
  function append(parent, child) {
    if (child instanceof Element) {
      parent.appendChild(child);
    } else {
      parent.insertAdjacentHTML('beforeend', String(child));
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
    Object.keys(styles).forEach(function (key) {
      setStyle(element, key, styles[key]);
    });
    return element;
  }
  function getStyle(element, key) {
    var numberType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var value = window.getComputedStyle(element, null).getPropertyValue(key);
    return numberType ? parseFloat(value) : value;
  }
  function sublings(target) {
    return Array.from(target.parentElement.children).filter(function (item) {
      return item !== target;
    });
  }
  function inverseClass(target, className) {
    sublings(target).forEach(function (item) {
      return item.classList.remove(className);
    });
    target.classList.add(className);
  }
  function tooltip(target, msg) {
    var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'up';
    target.setAttribute('aria-label', msg);
    target.setAttribute('data-balloon-pos', pos);
  }
  function srtToVtt(srtText) {
    return 'WEBVTT \r\n\r\n'.concat(srtText.replace(/\{\\([ibu])\}/g, '</$1>').replace(/\{\\([ibu])1\}/g, '<$1>').replace(/\{([ibu])\}/g, '<$1>').replace(/\{\/([ibu])\}/g, '</$1>').replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2').concat('\r\n\r\n'));
  }
  function vttToBlob(vttText) {
    return URL.createObjectURL(new Blob([vttText], {
      type: 'text/vtt'
    }));
  }
  function downloadFile(url, name) {
    var elink = document.createElement('a');
    setStyle(elink, 'display', 'none');
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }
  function proxyPropertys(target) {
    for (var _len4 = arguments.length, sources = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      sources[_key4 - 1] = arguments[_key4];
    }

    return sources.reduce(function (result, source) {
      Object.getOwnPropertyNames(source).forEach(function (key) {
        errorHandle(!hasOwnProperty(result, key), "Target attribute name is duplicated: ".concat(key));
        Object.defineProperty(result, key, Object.getOwnPropertyDescriptor(source, key));
      });
      return result;
    }, target);
  }

  var utils = /*#__PURE__*/Object.freeze({
    errorHandle: errorHandle,
    hasOwnProperty: hasOwnProperty,
    clamp: clamp,
    getExt: getExt,
    secondToTime: secondToTime,
    sleep: sleep,
    debounce: debounce,
    throttle: throttle,
    mergeDeep: mergeDeep,
    append: append,
    remove: remove,
    setStyle: setStyle,
    setStyles: setStyles,
    getStyle: getStyle,
    sublings: sublings,
    inverseClass: inverseClass,
    tooltip: tooltip,
    srtToVtt: srtToVtt,
    vttToBlob: vttToBlob,
    downloadFile: downloadFile,
    proxyPropertys: proxyPropertys
  });

  function validElement(value, type, paths) {
    return errorHandle(type === 'string' || value instanceof Element, "".concat(paths.join('.'), " require 'string' or 'Element' type"));
  }

  var scheme = {
    container: validElement,
    url: 'string|function',
    poster: 'string',
    title: 'string',
    theme: 'string',
    lang: 'string',
    volume: 'number',
    isLive: 'boolean',
    muted: 'boolean',
    autoplay: 'boolean',
    autoSize: 'boolean',
    loop: 'boolean',
    flip: 'boolean',
    playbackRate: 'boolean',
    aspectRatio: 'boolean',
    screenshot: 'boolean',
    setting: 'boolean',
    hotkey: 'boolean',
    pip: 'boolean',
    mutex: 'boolean',
    fullscreen: 'boolean',
    fullscreenWeb: 'boolean',
    subtitleOffset: 'boolean',
    miniProgressBar: 'boolean',
    localPreview: 'boolean',
    autoPip: 'boolean',
    plugins: ['function'],
    whitelist: ['string|function|regexp'],
    layers: [{
      disable: 'boolean|undefined',
      name: 'string|undefined',
      index: 'number|undefined',
      html: validElement,
      style: 'object|undefined',
      click: 'function|undefined',
      mounted: 'function|undefined'
    }],
    contextmenu: [{
      disable: 'boolean|undefined',
      name: 'string|undefined',
      index: 'number|undefined',
      html: validElement,
      style: 'object|undefined',
      click: 'function|undefined',
      mounted: 'function|undefined'
    }],
    quality: [{
      default: 'boolean|undefined',
      name: 'string',
      url: 'string'
    }],
    controls: [{
      disable: 'boolean|undefined',
      name: 'string|undefined',
      index: 'number|undefined',
      html: validElement,
      style: 'object|undefined',
      click: 'function|undefined',
      mounted: 'function|undefined',
      position: function position(value, type, paths) {
        var position = ['top', 'left', 'right'];
        return errorHandle(position.includes(value), "".concat(paths.join('.'), " only accept ").concat(position.toString(), " as parameters"));
      }
    }],
    highlight: [{
      time: 'number',
      text: 'string'
    }],
    thumbnails: {
      url: 'string',
      number: 'number',
      width: 'number',
      height: 'number',
      column: 'number'
    },
    subtitle: {
      url: 'string',
      style: 'object'
    },
    moreVideoAttr: 'object',
    icons: 'object',
    customType: 'object'
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

  var Whitelist = function Whitelist(art) {
    var _this = this;

    classCallCheck(this, Whitelist);

    var kindOf = art.constructor.kindOf;
    var whitelist = art.option.whitelist;
    this.userAgent = window.navigator.userAgent;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.userAgent);
    this.state = !this.isMobile || whitelist.some(function (item) {
      var type = kindOf(item);

      switch (type) {
        case 'string':
          return _this.userAgent.indexOf(item) > -1;

        case 'function':
          return item(_this.userAgent);

        case 'regexp':
          return item.test(_this.userAgent);

        default:
          return false;
      }
    });
  };

  var Template =
  /*#__PURE__*/
  function () {
    function Template(art) {
      var _this = this;

      classCallCheck(this, Template);

      this.art = art;

      if (art.option.container instanceof Element) {
        this.$container = art.option.container;
      } else {
        this.$container = document.querySelector(art.option.container);
        errorHandle(this.$container, "No container element found by ".concat(art.option.container));
      }

      if (art.constructor.instances.some(function (art) {
        return art.template.$container === _this.$container;
      })) {
        errorHandle(false, 'Cannot mount multiple instances on the same dom element');
      }

      if (art.whitelist.state) {
        this.initDesktop();
      } else {
        this.initMobile();
      }
    }

    createClass(Template, [{
      key: "initDesktop",
      value: function initDesktop() {
        this.$container.innerHTML = "\n          <div class=\"artplayer-video-player\" style=\"--theme: ".concat(this.art.option.theme, "\">\n            <video class=\"artplayer-video\"></video>\n            <div class=\"artplayer-subtitle\"></div>\n            <div class=\"artplayer-danmuku\"></div>\n            <div class=\"artplayer-layers\"></div>\n            <div class=\"artplayer-mask\"></div>\n            <div class=\"artplayer-bottom\">\n              <div class=\"artplayer-progress\"></div>\n              <div class=\"artplayer-controls\">\n                <div class=\"artplayer-controls-left\"></div>\n                <div class=\"artplayer-controls-right\"></div>\n              </div>\n            </div>\n            <div class=\"artplayer-loading\"></div>\n            <div class=\"artplayer-notice\">\n              <div class=\"artplayer-notice-inner\"></div>\n            </div>\n            <div class=\"artplayer-setting\">\n              <div class=\"artplayer-setting-inner\">\n                <div class=\"artplayer-setting-body\"></div>\n              </div>\n            </div>\n            <div class=\"artplayer-info\">\n              <div class=\"artplayer-info-panel\"></div>\n              <div class=\"artplayer-info-close\">[x]</div>\n            </div>\n            <div class=\"artplayer-pip-header\">\n              <div class=\"artplayer-pip-title\"></div>\n              <div class=\"artplayer-pip-close\">\xD7</div>\n            </div>\n            <div class=\"artplayer-contextmenu\"></div>\n          </div>\n        ");
        this.$player = this.$container.querySelector('.artplayer-video-player');
        this.$video = this.$container.querySelector('.artplayer-video');
        this.$subtitle = this.$container.querySelector('.artplayer-subtitle');
        this.$danmuku = this.$container.querySelector('.artplayer-danmuku');
        this.$bottom = this.$container.querySelector('.artplayer-bottom');
        this.$progress = this.$container.querySelector('.artplayer-progress');
        this.$controls = this.$container.querySelector('.artplayer-controls');
        this.$controlsLeft = this.$container.querySelector('.artplayer-controls-left');
        this.$controlsRight = this.$container.querySelector('.artplayer-controls-right');
        this.$layers = this.$container.querySelector('.artplayer-layers');
        this.$loading = this.$container.querySelector('.artplayer-loading');
        this.$notice = this.$container.querySelector('.artplayer-notice');
        this.$noticeInner = this.$container.querySelector('.artplayer-notice-inner');
        this.$mask = this.$container.querySelector('.artplayer-mask');
        this.$setting = this.$container.querySelector('.artplayer-setting');
        this.$settingInner = this.$container.querySelector('.artplayer-setting-inner');
        this.$settingBody = this.$container.querySelector('.artplayer-setting-body');
        this.$info = this.$container.querySelector('.artplayer-info');
        this.$infoPanel = this.$container.querySelector('.artplayer-info-panel');
        this.$infoClose = this.$container.querySelector('.artplayer-info-close');
        this.$pipHeader = this.$container.querySelector('.artplayer-pip-header');
        this.$pipTitle = this.$container.querySelector('.artplayer-pip-title');
        this.$pipClose = this.$container.querySelector('.artplayer-pip-close');
        this.$contextmenu = this.$container.querySelector('.artplayer-contextmenu');
      }
    }, {
      key: "initMobile",
      value: function initMobile() {
        this.$container.innerHTML = "\n          <div class=\"artplayer-video-player\">\n            <video class=\"artplayer-video\"></video>\n          </div>\n        ";
        this.$player = this.$container.querySelector('.artplayer-video-player');
        this.$video = this.$container.querySelector('.artplayer-video');
      }
    }, {
      key: "destroy",
      value: function destroy(removeHtml) {
        if (removeHtml) {
          this.$container.innerHTML = '';
        } else {
          this.$player.classList.add('artplayer-destroy');
        }
      }
    }]);

    return Template;
  }();

  var Close = "关闭";
  var Volume = "音量";
  var Play = "播放";
  var Pause = "暂停";
  var Rate = "速度";
  var Mute = "静音";
  var Flip = "视频翻转";
  var Horizontal = "水平";
  var Vertical = "垂直";
  var Reconnect = "重新连接";
  var Screenshot = "截图";
  var Default = "默认";
  var Normal = "正常";
  var Fullscreen = "全屏";
  var zhCn = {
  	"About author": "关于作者",
  	"Video info": "视频统计信息",
  	Close: Close,
  	"Video load failed": "视频加载失败",
  	Volume: Volume,
  	Play: Play,
  	Pause: Pause,
  	Rate: Rate,
  	Mute: Mute,
  	Flip: Flip,
  	Horizontal: Horizontal,
  	Vertical: Vertical,
  	Reconnect: Reconnect,
  	"Hide subtitle": "隐藏字幕",
  	"Show subtitle": "显示字幕",
  	"Hide danmu": "隐藏弹幕",
  	"Show danmu": "显示弹幕",
  	"Show setting": "显示设置",
  	"Hide setting": "隐藏设置",
  	Screenshot: Screenshot,
  	"Play speed": "播放速度",
  	"Aspect ratio": "画面比例",
  	Default: Default,
  	Normal: Normal,
  	"Switch video": "切换",
  	"Switch subtitle": "切换字幕",
  	Fullscreen: Fullscreen,
  	"Exit fullscreen": "退出全屏",
  	"Web fullscreen": "网页全屏",
  	"Exit web fullscreen": "退出网页全屏",
  	"Mini player": "迷你播放器",
  	"This does not seem to support full screen functionality": "似乎不支持全屏功能"
  };

  var Close$1 = "關閉";
  var Volume$1 = "音量";
  var Play$1 = "播放";
  var Pause$1 = "暫停";
  var Rate$1 = "速度";
  var Mute$1 = "靜音";
  var Flip$1 = "影片翻轉";
  var Horizontal$1 = "水平";
  var Vertical$1 = "垂直";
  var Reconnect$1 = "重新連接";
  var Screenshot$1 = "截圖";
  var Default$1 = "默認";
  var Normal$1 = "正常";
  var Fullscreen$1 = "全屏";
  var zhTw = {
  	"About author": "關於作者",
  	"Video info": "影片統計訊息",
  	Close: Close$1,
  	"Video load failed": "影片載入失敗",
  	Volume: Volume$1,
  	Play: Play$1,
  	Pause: Pause$1,
  	Rate: Rate$1,
  	Mute: Mute$1,
  	Flip: Flip$1,
  	Horizontal: Horizontal$1,
  	Vertical: Vertical$1,
  	Reconnect: Reconnect$1,
  	"Hide subtitle": "隱藏字幕",
  	"Show subtitle": "顯示字幕",
  	"Show setting": "顯示设置",
  	"Hide setting": "隱藏设置",
  	"Hide danmu": "隱藏彈幕",
  	"Show danmu": "顯示彈幕",
  	Screenshot: Screenshot$1,
  	"Play speed": "播放速度",
  	"Aspect ratio": "畫面比例",
  	Default: Default$1,
  	Normal: Normal$1,
  	"Switch video": "切換",
  	"Switch subtitle": "切換字幕",
  	Fullscreen: Fullscreen$1,
  	"Exit fullscreen": "退出全屏",
  	"Web fullscreen": "網頁全屏",
  	"Exit web fullscreen": "退出網頁全屏",
  	"Mini player": "迷你播放器",
  	"This does not seem to support full screen functionality": "似乎不支持全屏功能"
  };

  var I18n =
  /*#__PURE__*/
  function () {
    function I18n(art) {
      classCallCheck(this, I18n);

      this.art = art;
      this.languages = {
        'zh-cn': zhCn,
        'zh-tw': zhTw
      };
      this.init();
    }

    createClass(I18n, [{
      key: "init",
      value: function init() {
        var lang = this.art.option.lang.toLowerCase();
        this.language = this.languages[lang] || {};
      }
    }, {
      key: "get",
      value: function get(key) {
        return this.language[key] || key;
      }
    }, {
      key: "update",
      value: function update(value) {
        this.languages = mergeDeep(this.languages, value);
        this.init();
      }
    }]);

    return I18n;
  }();

  function attachUrlMix(art, player) {
    var _art$option = art.option,
        type = _art$option.type,
        customType = _art$option.customType,
        $video = art.template.$video;
    Object.defineProperty(player, 'attachUrl', {
      value: function value(url) {
        return sleep().then(function () {
          function attachUrl(videoUrl) {
            var typeName = type || getExt(videoUrl);
            var typeCallback = customType[typeName];

            if (typeName && typeCallback) {
              art.loading.show = true;
              art.emit('beforeCustomType', typeName);
              typeCallback.call(art, $video, videoUrl, art);
              art.emit('afterCustomType', typeName);
            } else {
              art.emit('beforeAttachUrl', videoUrl);
              $video.src = videoUrl;
              art.emit('afterAttachUrl', videoUrl);
            }

            return Promise.resolve(videoUrl);
          }

          if (typeof url === 'function') {
            var result = url.call(art);
            errorHandle(typeof result.then === 'function', 'If url is a function, it needs to return a promise.');
            return result.then(function (videoUrl) {
              art.loading.show = true;
              return attachUrl(videoUrl);
            });
          }

          return attachUrl(url);
        });
      }
    });
  }

  function attrInit(art, player) {
    var option = art.option,
        $video = art.template.$video;
    Object.keys(option.moreVideoAttr).forEach(function (key) {
      $video[key] = option.moreVideoAttr[key];
    });

    if (option.muted) {
      $video.muted = option.muted;
    }

    if (option.volume) {
      $video.volume = clamp(option.volume, 0, 1);
    }

    if (option.poster) {
      $video.poster = option.poster;
    }

    if (option.autoplay) {
      $video.autoplay = option.autoplay;
    }

    player.attachUrl(option.url);
  }

  function eventInit(art, player) {
    var option = art.option,
        proxy = art.events.proxy,
        _art$template = art.template,
        $player = _art$template.$player,
        $video = _art$template.$video,
        i18n = art.i18n,
        notice = art.notice;
    var reconnectTime = 0;
    var maxReconnectTime = 5;
    proxy($video, 'click', function () {
      player.toggle = true;
    });
    config.video.events.forEach(function (eventName) {
      proxy($video, eventName, function (event) {
        art.emit("video:".concat(event.type), event);
      });
    }); // art.on('video:abort', () => {
    // });

    art.on('video:canplay', function () {
      reconnectTime = 0;
      art.controls.show = true;
      art.mask.show = true;
      art.loading.show = false;
    }); // art.on('video:canplaythrough', () => {
    // });
    // art.on('video:durationchange', () => {
    // });
    // art.on('video:emptied', () => {
    // });

    art.on('video:ended', function () {
      art.controls.show = true;
      art.mask.show = true;

      if (option.loop) {
        player.seek = 0;
        player.play = true;
      }
    });
    art.on('video:error', function () {
      if (reconnectTime < maxReconnectTime) {
        sleep(1000).then(function () {
          reconnectTime += 1;
          player.attachUrl(option.url);
          notice.show("".concat(i18n.get('Reconnect'), ": ").concat(reconnectTime));
        });
      } else {
        art.loading.show = false;
        art.controls.show = false;
        $player.classList.add('artplayer-error');
        sleep(1000).then(function () {
          notice.show(i18n.get('Video load failed'), false);
          art.destroy();
        });
      }
    }); // art.on('video:loadeddata', () => {
    // });

    art.on('video:loadedmetadata', function () {
      if (option.autoSize) {
        player.autoSize = true;
      }
    });
    art.on('video:loadstart', function () {
      art.loading.show = true;
    });
    art.on('video:pause', function () {
      art.controls.show = true;
      art.mask.show = true;
    });
    art.on('video:play', function () {
      art.mask.show = false;
    });
    art.on('video:playing', function () {
      art.mask.show = false;
    }); // art.on('video:progress', () => {
    // });
    // art.on('video:ratechange', () => {
    // });

    art.on('video:seeked', function () {
      art.loading.show = false;
    });
    art.on('video:seeking', function () {
      art.loading.show = true;
    }); // art.on('video:stalled', () => {
    // });
    // art.on('video:suspend', () => {
    // });

    art.on('video:timeupdate', function () {
      art.mask.show = false;
    }); // art.on('video:volumechange', () => {
    // });

    art.on('video:waiting', function () {
      art.loading.show = true;
    });
  }

  function playMix(art, player) {
    var $video = art.template.$video,
        i18n = art.i18n,
        notice = art.notice,
        mutex = art.option.mutex;
    Object.defineProperty(player, 'play', {
      set: function set(value) {
        if (value) {
          var promise = $video.play();

          if (promise !== undefined) {
            promise.then().catch(function (err) {
              notice.show(err, true, 3000);
              throw err;
            });
          }

          if (mutex) {
            art.constructor.instances.filter(function (item) {
              return item !== art;
            }).forEach(function (item) {
              item.player.pause = true;
            });
          }

          notice.show(i18n.get('Play'));
          art.emit('play');
        } else {
          player.pause = true;
        }
      }
    });
  }

  function pauseMin(art, player) {
    var $video = art.template.$video,
        i18n = art.i18n,
        notice = art.notice;
    Object.defineProperty(player, 'pause', {
      get: function get() {
        return $video.paused;
      },
      set: function set(value) {
        if (value) {
          $video.pause();
          notice.show(i18n.get('Pause'));
          art.emit('pause');
        } else {
          player.play = true;
        }
      }
    });
  }

  function toggleMix(art, player) {
    Object.defineProperty(player, 'toggle', {
      set: function set(value) {
        if (value) {
          if (player.playing) {
            player.pause = true;
          } else {
            player.play = true;
          }
        }
      }
    });
  }

  function seekMix(art, player) {
    var notice = art.notice;
    Object.defineProperty(player, 'seek', {
      set: function set(time) {
        player.currentTime = time;
        notice.show("".concat(secondToTime(time), " / ").concat(secondToTime(player.duration)));
        art.emit('seek', time);
      }
    });
  }

  function volumeMix(art, player) {
    var $video = art.template.$video,
        i18n = art.i18n,
        notice = art.notice,
        storage = art.storage;
    Object.defineProperty(player, 'volume', {
      get: function get() {
        return $video.volume || 0;
      },
      set: function set(percentage) {
        $video.volume = clamp(percentage, 0, 1);
        notice.show("".concat(i18n.get('Volume'), ": ").concat(parseInt($video.volume * 100, 10)));

        if ($video.volume !== 0) {
          storage.set('volume', $video.volume);
        }

        art.emit('volumeChange', $video.volume);
      }
    });
    Object.defineProperty(player, 'muted', {
      get: function get() {
        return $video.muted;
      },
      set: function set(muted) {
        $video.muted = muted;
        art.emit('volumeChange', $video.volume);
      }
    });
  }

  function currentTimeMix(art, player) {
    Object.defineProperty(player, 'currentTime', {
      get: function get() {
        return art.template.$video.currentTime || 0;
      },
      set: function set(currentTime) {
        art.template.$video.currentTime = clamp(currentTime, 0, player.duration);
      }
    });
  }

  function durationMix(art, player) {
    Object.defineProperty(player, 'duration', {
      get: function get() {
        return art.template.$video.duration || 0;
      }
    });
  }

  function switchMix(art, player) {
    var i18n = art.i18n,
        notice = art.notice,
        option = art.option;
    Object.defineProperty(player, 'switchQuality', {
      value: function value(url) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'unknown';

        if (url !== option.url) {
          var currentTime = player.currentTime,
              playing = player.playing;
          return player.attachUrl(url).then(function () {
            option.url = url;
            player.playbackRate = false;
            player.aspectRatio = false;
            art.once('video:canplay', function () {
              player.currentTime = currentTime;
            });

            if (playing) {
              player.play = true;
            }

            notice.show("".concat(i18n.get('Switch video'), ": ").concat(name));
            art.emit('switch', url);
          });
        }

        return null;
      }
    });
    Object.defineProperty(player, 'switchUrl', {
      value: function value(url) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'unknown';

        if (url !== option.url) {
          var playing = player.playing;
          return player.attachUrl(url).then(function () {
            option.url = url;
            player.playbackRate = false;
            player.aspectRatio = false;
            player.currentTime = 0;

            if (playing) {
              player.play = true;
            }

            notice.show("".concat(i18n.get('Switch video'), ": ").concat(name));
            art.emit('switch', url);
          });
        }

        return null;
      }
    });
  }

  function playbackRateMix(art, player) {
    var _art$template = art.template,
        $video = _art$template.$video,
        $player = _art$template.$player,
        i18n = art.i18n,
        notice = art.notice;
    Object.defineProperty(player, 'playbackRate', {
      get: function get() {
        return $player.dataset.playbackRate;
      },
      set: function set(rate) {
        if (rate) {
          var rateList = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
          errorHandle(rateList.includes(rate), "'playbackRate' only accept ".concat(rateList.toString(), " as parameters"));

          if (rate === $player.dataset.playbackRate) {
            return;
          }

          $video.playbackRate = rate;
          $player.dataset.playbackRate = rate;
          notice.show("".concat(i18n.get('Rate'), ": ").concat(rate === 1.0 ? i18n.get('Normal') : "".concat(rate, "x")));
          art.emit('playbackRateChange', rate);
        } else if (player.playbackRate) {
          player.playbackRate = 1;
          delete $player.dataset.playbackRate;
          art.emit('playbackRateRemove');
        }
      }
    });
    Object.defineProperty(player, 'playbackRateReset', {
      set: function set(value) {
        if (value) {
          var playbackRate = $player.dataset.playbackRate;

          if (playbackRate) {
            player.playbackRate = Number(playbackRate);
            art.emit('playbackRateReset');
          }
        }
      }
    });
  }

  function aspectRatioMix(art, player) {
    var _art$template = art.template,
        $video = _art$template.$video,
        $player = _art$template.$player,
        i18n = art.i18n,
        notice = art.notice;
    Object.defineProperty(player, 'aspectRatio', {
      get: function get() {
        return $player.dataset.aspectRatio || '';
      },
      set: function set(ratio) {
        if (ratio) {
          var ratioList = ['default', '4:3', '16:9'];
          errorHandle(ratioList.includes(ratio), "'aspectRatio' only accept ".concat(ratioList.toString(), " as parameters"));

          if (ratio === 'default') {
            player.aspectRatio = false;
          } else {
            var ratioArray = ratio.split(':');
            var videoWidth = $video.videoWidth,
                videoHeight = $video.videoHeight;
            var clientWidth = $player.clientWidth,
                clientHeight = $player.clientHeight;
            var videoRatio = videoWidth / videoHeight;
            var setupRatio = ratioArray[0] / ratioArray[1];

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
          }

          $player.dataset.aspectRatio = ratio;
          notice.show("".concat(i18n.get('Aspect ratio'), ": ").concat(ratio === 'default' ? i18n.get('Default') : ratio));
          art.emit('aspectRatioChange', ratio);
        } else if (player.aspectRatio) {
          setStyle($video, 'width', null);
          setStyle($video, 'height', null);
          setStyle($video, 'padding', null);
          delete $player.dataset.aspectRatio;
          art.emit('aspectRatioRemove');
        }
      }
    });
    Object.defineProperty(player, 'aspectRatioReset', {
      set: function set(value) {
        if (value && player.aspectRatio) {
          var aspectRatio = player.aspectRatio;
          player.aspectRatio = aspectRatio;
          art.emit('aspectRatioReset');
        }
      }
    });
  }

  function screenshotMix(art, player) {
    var option = art.option,
        notice = art.notice,
        $video = art.template.$video;
    Object.defineProperty(player, 'getScreenshotDataURL', {
      value: function value() {
        try {
          var canvas = document.createElement('canvas');
          canvas.width = $video.videoWidth;
          canvas.height = $video.videoHeight;
          canvas.getContext('2d').drawImage($video, 0, 0);
          return canvas.toDataURL('image/png');
        } catch (error) {
          notice.show(error);
          throw error;
        }
      }
    });
    Object.defineProperty(player, 'getScreenshotBlobUrl', {
      value: function value() {
        return new Promise(function (resolve, reject) {
          try {
            var canvas = document.createElement('canvas');
            canvas.width = $video.videoWidth;
            canvas.height = $video.videoHeight;
            canvas.getContext('2d').drawImage($video, 0, 0);
            canvas.toBlob(function (blob) {
              resolve(URL.createObjectURL(blob));
            });
          } catch (error) {
            notice.show(error);
            reject(error);
          }
        });
      }
    });
    Object.defineProperty(player, 'screenshot', {
      value: function value() {
        var dataUri = player.getScreenshotDataURL();

        if (dataUri) {
          downloadFile(dataUri, "".concat(option.title || 'artplayer', "_").concat(secondToTime($video.currentTime), ".png"));
          art.emit('screenshot', dataUri);
        }
      }
    });
  }

  var screenfull = createCommonjsModule(function (module) {
  /*!
  * screenfull
  * v5.0.0 - 2019-09-09
  * (c) Sindre Sorhus; MIT License
  */
  (function () {

  	var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
  	var isCommonjs =  module.exports;

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
  			// Old WebKit
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
  		request: function (element) {
  			return new Promise(function (resolve, reject) {
  				var onFullScreenEntered = function () {
  					this.off('change', onFullScreenEntered);
  					resolve();
  				}.bind(this);

  				this.on('change', onFullScreenEntered);

  				element = element || document.documentElement;

  				Promise.resolve(element[fn.requestFullscreen]()).catch(reject);
  			}.bind(this));
  		},
  		exit: function () {
  			return new Promise(function (resolve, reject) {
  				if (!this.isFullscreen) {
  					resolve();
  					return;
  				}

  				var onFullScreenExit = function () {
  					this.off('change', onFullScreenExit);
  					resolve();
  				}.bind(this);

  				this.on('change', onFullScreenExit);

  				Promise.resolve(document[fn.exitFullscreen]()).catch(reject);
  			}.bind(this));
  		},
  		toggle: function (element) {
  			return this.isFullscreen ? this.exit() : this.request(element);
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
  			module.exports = {isEnabled: false};
  		} else {
  			window.screenfull = {isEnabled: false};
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
  		isEnabled: {
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
  var screenfull_1 = screenfull.isEnabled;

  function fullscreenMix(art, player) {
    var i18n = art.i18n,
        notice = art.notice,
        destroyEvents = art.events.destroyEvents,
        $player = art.template.$player;

    var screenfullChange = function screenfullChange() {
      art.emit('fullscreen:change', screenfull.isFullscreen);
    };

    var screenfullError = function screenfullError() {
      notice.show(i18n.get('This does not seem to support full screen functionality'));
    };

    if (player.fullscreenIsEnabled) {
      screenfull.on('change', screenfullChange);
      screenfull.on('error', screenfullError);
      destroyEvents.push(function () {
        screenfull.off('change', screenfullChange);
        screenfull.off('error', screenfullError);
      });
    }

    Object.defineProperty(player, 'fullscreen', {
      get: function get() {
        return screenfull.isFullscreen;
      },
      set: function set(value) {
        if (!player.fullscreenIsEnabled) {
          screenfullError();
          return;
        }

        if (value) {
          if (player.fullscreenWeb) {
            player.fullscreenWeb = false;
          }

          screenfull.request($player).then(function () {
            $player.classList.add('artplayer-fullscreen');
            player.aspectRatioReset = true;
            art.emit('fullscreen:enabled');
          });
        } else {
          if (player.fullscreenWeb) {
            player.fullscreenWeb = false;
          }

          screenfull.exit().then(function () {
            $player.classList.remove('artplayer-fullscreen');
            player.aspectRatioReset = true;
            art.emit('fullscreen:exit');
          });
        }
      }
    });
    Object.defineProperty(player, 'fullscreenToggle', {
      set: function set(value) {
        if (value) {
          player.fullscreen = !player.fullscreen;
        }
      }
    });
    Object.defineProperty(player, 'fullscreenIsEnabled', {
      get: function get() {
        return screenfull.isEnabled;
      }
    });
  }

  function fullscreenWebMix(art, player) {
    var $player = art.template.$player;
    Object.defineProperty(player, 'fullscreenWeb', {
      get: function get() {
        return $player.classList.contains('artplayer-web-fullscreen');
      },
      set: function set(value) {
        if (value) {
          if (player.fullscreen) {
            player.fullscreen = false;
          }

          $player.classList.add('artplayer-web-fullscreen');
          player.aspectRatioReset = true;
          art.emit('fullscreenWeb:enabled');
        } else {
          if (player.fullscreen) {
            player.fullscreen = false;
          }

          $player.classList.remove('artplayer-web-fullscreen');
          player.aspectRatioReset = true;
          art.emit('fullscreenWeb:exit');
        }
      }
    });
    Object.defineProperty(player, 'fullscreenWebToggle', {
      set: function set(value) {
        if (value) {
          player.fullscreenWeb = !player.fullscreenWeb;
        }
      }
    });
  }

  function nativePip(art, player) {
    var $video = art.template.$video,
        proxy = art.events.proxy;
    $video.disablePictureInPicture = false;
    Object.defineProperty(player, 'pip', {
      get: function get() {
        return document.pictureInPictureElement;
      },
      set: function set(value) {
        if (value) {
          $video.requestPictureInPicture().catch(function (error) {
            throw error;
          });
        } else {
          document.exitPictureInPicture().catch(function (error) {
            throw error;
          });
        }
      }
    });
    proxy($video, 'enterpictureinpicture', function () {
      art.emit('pipEnabled');
    });
    proxy($video, 'leavepictureinpicture', function () {
      art.emit('pipExit');
    });
    art.on('destroy', function () {
      if (player.pip) {
        player.pip = false;
      }
    });
  }

  function webkitPip(art, player) {
    var $video = art.template.$video;
    $video.webkitSetPresentationMode('inline');
    Object.defineProperty(player, 'pip', {
      get: function get() {
        return $video.webkitPresentationMode === 'picture-in-picture';
      },
      set: function set(value) {
        if (value) {
          $video.webkitSetPresentationMode('picture-in-picture');
          art.emit('pipEnabled');
        } else {
          $video.webkitSetPresentationMode('inline');
          art.emit('pipExit');
        }
      }
    });
  }

  function customPip(art, player) {
    var option = art.option,
        i18n = art.i18n,
        _art$template = art.template,
        $player = _art$template.$player,
        $pipClose = _art$template.$pipClose,
        $pipTitle = _art$template.$pipTitle,
        $pipHeader = _art$template.$pipHeader,
        proxy = art.events.proxy;
    var cacheStyle = '';
    var isDroging = false;
    var lastPageX = 0;
    var lastPageY = 0;
    var lastPlayerLeft = 0;
    var lastPlayerTop = 0;
    proxy($pipHeader, 'mousedown', function (event) {
      isDroging = true;
      lastPageX = event.pageX;
      lastPageY = event.pageY;
      lastPlayerLeft = player.left;
      lastPlayerTop = player.top;
    });
    proxy($pipHeader, 'mousemove', function (event) {
      if (isDroging) {
        $player.classList.add('is-dragging');
        setStyle($player, 'left', "".concat(lastPlayerLeft + event.pageX - lastPageX, "px"));
        setStyle($player, 'top', "".concat(lastPlayerTop + event.pageY - lastPageY, "px"));
      }
    });
    proxy(document, 'mouseup', function () {
      isDroging = false;
      $player.classList.remove('is-dragging');
    });
    proxy($pipClose, 'click', function () {
      player.pip = false;
      isDroging = false;
      $player.classList.remove('is-dragging');
    });
    append($pipTitle, option.title || i18n.get('Mini player'));
    Object.defineProperty(player, 'pip', {
      get: function get() {
        return $player.classList.contains('artplayer-pip');
      },
      set: function set(value) {
        if (value) {
          player.autoSize = false;
          cacheStyle = $player.style.cssText;
          $player.classList.add('artplayer-pip');
          var $body = document.body;
          setStyle($player, 'top', "".concat($body.clientHeight - player.height - 50, "px"));
          setStyle($player, 'left', "".concat($body.clientWidth - player.width - 50, "px"));
          player.fullscreen = false;
          player.fullscreenWeb = false;
          player.aspectRatio = false;
          player.playbackRate = false;
          art.emit('pipEnabled');
        } else if (player.pip) {
          $player.style.cssText = cacheStyle;
          $player.classList.remove('artplayer-pip');
          setStyle($player, 'top', null);
          setStyle($player, 'left', null);
          player.fullscreen = false;
          player.fullscreenWeb = false;
          player.aspectRatio = false;
          player.playbackRate = false;
          player.autoSize = true;
          art.emit('pipExit');
        }
      }
    });
  }

  function pipMix(art, player) {
    var $video = art.template.$video;

    if (document.pictureInPictureEnabled) {
      nativePip(art, player);
    } else if ($video.webkitSupportsPresentationMode && typeof $video.webkitSetPresentationMode === 'function') {
      webkitPip(art, player);
    } else {
      customPip(art, player);
    }

    Object.defineProperty(player, 'pipToggle', {
      set: function set(value) {
        if (value) {
          player.pip = !player.pip;
        }
      }
    });
  }

  function seekMix$1(art, player) {
    var $video = art.template.$video;
    Object.defineProperty(player, 'loaded', {
      get: function get() {
        return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) / $video.duration : 0;
      }
    });
  }

  function seekMix$2(art, player) {
    Object.defineProperty(player, 'played', {
      get: function get() {
        return art.template.$video.currentTime / art.template.$video.duration;
      }
    });
  }

  function playingMix(art, player) {
    var $video = art.template.$video;
    Object.defineProperty(player, 'playing', {
      get: function get() {
        return !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2);
      }
    });
  }

  function resizeMix(art, player) {
    var _art$template = art.template,
        $container = _art$template.$container,
        $player = _art$template.$player,
        $video = _art$template.$video;
    Object.defineProperty(player, 'autoSize', {
      get: function get() {
        return $container.classList.contains('artplayer-auto-size');
      },
      set: function set(value) {
        if (value) {
          var videoWidth = $video.videoWidth,
              videoHeight = $video.videoHeight;

          var _$container$getBoundi = $container.getBoundingClientRect(),
              width = _$container$getBoundi.width,
              height = _$container$getBoundi.height;

          var videoRatio = videoWidth / videoHeight;
          var containerRatio = width / height;
          $container.classList.add('artplayer-auto-size');

          if (containerRatio > videoRatio) {
            var percentage = height * videoRatio / width * 100;
            setStyle($player, 'width', "".concat(percentage, "%"));
            setStyle($player, 'height', '100%');
          } else {
            var _percentage = width / videoRatio / height * 100;

            setStyle($player, 'width', '100%');
            setStyle($player, 'height', "".concat(_percentage, "%"));
          }

          art.emit('autoSizeChange');
        } else {
          $container.classList.remove('artplayer-auto-size');
          setStyle($player, 'width', null);
          setStyle($player, 'height', null);
          art.emit('autoSizeRemove');
        }
      }
    });
  }

  function rectMix(art, player) {
    Object.defineProperty(player, 'rect', {
      get: function get() {
        return art.template.$player.getBoundingClientRect();
      }
    });
    ['bottom', 'height', 'left', 'right', 'top', 'width'].forEach(function (key) {
      Object.defineProperty(player, key, {
        get: function get() {
          return player.rect[key];
        }
      });
    });
    Object.defineProperty(player, 'x', {
      get: function get() {
        return player.left + window.pageXOffset;
      }
    });
    Object.defineProperty(player, 'y', {
      get: function get() {
        return player.top + window.pageYOffset;
      }
    });
  }

  function flipMix(art, player) {
    Object.defineProperty(player, 'flip', {
      get: function get() {
        return art.template.$player.dataset.flip;
      },
      set: function set(flip) {
        if (flip) {
          var flipList = ['normal', 'horizontal', 'vertical'];
          errorHandle(flipList.includes(flip), "'flip' only accept ".concat(flipList.toString(), " as parameters"));
          art.template.$player.dataset.flip = flip;
          art.emit('flipChange', flip);
        } else {
          delete art.template.$player.dataset.flip;
          art.emit('flipRemove');
        }
      }
    });
  }

  var Player = function Player(art) {
    classCallCheck(this, Player);

    attachUrlMix(art, this);
    eventInit(art, this);
    attrInit(art, this);
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
    seekMix$1(art, this);
    seekMix$2(art, this);
    playingMix(art, this);
    resizeMix(art, this);
    rectMix(art, this);
    flipMix(art, this);
    proxyPropertys(art, this);
  };

  function component(art, parent, target, getOption, callback, title) {
    var option = typeof getOption === 'function' ? getOption(art) : getOption;
    if (option.disable) return {};
    var componentID = parent.id;
    var name = option.name || "".concat(title).concat(componentID);
    errorHandle(!hasOwnProperty(parent, name), "Cannot create a component that already has the same name: ".concat(title, " -> ").concat(name));
    var $element = document.createElement('div');
    $element.classList.value = "art-".concat(title, " art-").concat(title, "-").concat(name);

    if (option.html) {
      append($element, option.html);
    }

    if (option.style) {
      setStyles($element, option.style);
    }

    var childs = Array.from(target.children);
    $element.dataset.index = option.index || componentID;
    var nextChild = childs.find(function (item) {
      return Number(item.dataset.index) >= Number($element.dataset.index);
    });

    if (nextChild) {
      nextChild.insertAdjacentElement('beforebegin', $element);
    } else {
      append(target, $element);
    }

    if (option.click) {
      art.events.proxy($element, 'click', function (event) {
        event.preventDefault();
        option.click.call(art, parent, event);
        art.emit("".concat(title, ":click"), $element);
      });
    }

    if (option.mounted) {
      option.mounted($element, parent, art);
    }

    if (callback) {
      callback($element, parent, art);
    }

    Object.defineProperty(parent, name, {
      value: {
        get id() {
          return componentID;
        },

        get $ref() {
          return $element;
        },

        set show(value) {
          if (value) {
            setStyle($element, 'display', 'block');
            art.emit("".concat(title, ":show"), $element);
          } else {
            setStyle($element, 'display', 'none');
            art.emit("".concat(title, ":hide"), $element);
          }
        },

        set remove(value) {
          if (value) {
            remove($element);
            art.emit("".concat(title, ":remove"), $element);
          }
        }

      }
    });
    art.emit("".concat(title, ":add"), option);
    return parent[name];
  }

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

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function fullscreen(controlOption) {
    return function (art) {
      return _objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              player = art.player;
          var $fullscreen = append($control, icons.fullscreen);
          tooltip($fullscreen, i18n.get('Fullscreen'));
          proxy($control, 'click', function () {
            player.fullscreenToggle = true;
          });
          art.on('fullscreen:enabled', function () {
            setStyle($fullscreen, 'opacity', '0.8');
            tooltip($fullscreen, i18n.get('Exit fullscreen'));
          });
          art.on('fullscreen:exit', function () {
            setStyle($fullscreen, 'opacity', '1');
            tooltip($fullscreen, i18n.get('Fullscreen'));
          });
        }
      });
    };
  }

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function fullscreenWeb(controlOption) {
    return function (art) {
      return _objectSpread$1({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              player = art.player;
          var $fullscreenWeb = append($control, icons.fullscreenWeb);
          tooltip($fullscreenWeb, i18n.get('Web fullscreen'));
          proxy($control, 'click', function () {
            player.fullscreenWebToggle = true;
          });
          art.on('fullscreenWeb:enabled', function () {
            setStyle($fullscreenWeb, 'opacity', '0.8');
            tooltip($fullscreenWeb, i18n.get('Exit web fullscreen'));
          });
          art.on('fullscreenWeb:exit', function () {
            setStyle($fullscreenWeb, 'opacity', '1');
            tooltip($fullscreenWeb, i18n.get('Web fullscreen'));
          });
        }
      });
    };
  }

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function pip(controlOption) {
    return function (art) {
      return _objectSpread$2({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              player = art.player;
          var $pip = append($control, icons.pip);
          tooltip($pip, i18n.get('Mini player'));
          proxy($control, 'click', function () {
            player.pip = true;
          });
        }
      });
    };
  }

  function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function playAndPause(controlOption) {
    return function (art) {
      return _objectSpread$3({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              player = art.player;
          var $play = append($control, icons.play);
          var $pause = append($control, icons.pause);
          tooltip($play, i18n.get('Play'));
          tooltip($pause, i18n.get('Pause'));
          proxy($play, 'click', function () {
            player.play = true;
          });
          proxy($pause, 'click', function () {
            player.pause = true;
          });

          function showPlay() {
            setStyle($play, 'display', 'flex');
            setStyle($pause, 'display', 'none');
          }

          function showPause() {
            setStyle($play, 'display', 'none');
            setStyle($pause, 'display', 'flex');
          }

          if (player.playing) {
            showPause();
          } else {
            showPlay();
          }

          art.on('video:playing', function () {
            showPause();
          });
          art.on('video:pause', function () {
            showPlay();
          });
        }
      });
    };
  }

  function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function getPosFromEvent(art, event) {
    var $progress = art.template.$progress,
        player = art.player;

    var _$progress$getBoundin = $progress.getBoundingClientRect(),
        left = _$progress$getBoundin.left;

    var width = clamp(event.pageX - left, 0, $progress.clientWidth);
    var second = width / $progress.clientWidth * player.duration;
    var time = secondToTime(second);
    var percentage = clamp(width / $progress.clientWidth, 0, 1);
    return {
      second: second,
      time: time,
      width: width,
      percentage: percentage
    };
  }
  function progress(controlOption) {
    return function (art) {
      var _art$option = art.option,
          highlight = _art$option.highlight,
          theme = _art$option.theme,
          proxy = art.events.proxy,
          player = art.player;
      return _objectSpread$4({}, controlOption, {
        html: "\n                <div class=\"art-control-progress-inner\">\n                    <div class=\"art-progress-loaded\"></div>\n                    <div class=\"art-progress-played\" style=\"background: ".concat(theme, "\"></div>\n                    <div class=\"art-progress-highlight\"></div>\n                    <div class=\"art-progress-indicator\" style=\"background: ").concat(theme, "\"></div>\n                    <div class=\"art-progress-tip art-tip\"></div>\n                </div>\n            "),
        mounted: function mounted($control) {
          var isDroging = false;
          var $loaded = $control.querySelector('.art-progress-loaded');
          var $played = $control.querySelector('.art-progress-played');
          var $highlight = $control.querySelector('.art-progress-highlight');
          var $indicator = $control.querySelector('.art-progress-indicator');
          var $tip = $control.querySelector('.art-progress-tip');

          function showHighlight(event) {
            var _getPosFromEvent = getPosFromEvent(art, event),
                width = _getPosFromEvent.width;

            var text = event.target.dataset.text;
            $tip.innerHTML = text;
            var tipWidth = $tip.clientWidth;

            if (width <= tipWidth / 2) {
              setStyle($tip, 'left', 0);
            } else if (width > $control.clientWidth - tipWidth / 2) {
              setStyle($tip, 'left', "".concat($control.clientWidth - tipWidth, "px"));
            } else {
              setStyle($tip, 'left', "".concat(width - tipWidth / 2, "px"));
            }
          }

          function showTime(event) {
            var _getPosFromEvent2 = getPosFromEvent(art, event),
                width = _getPosFromEvent2.width,
                time = _getPosFromEvent2.time;

            $tip.innerHTML = time;
            var tipWidth = $tip.clientWidth;

            if (width <= tipWidth / 2) {
              setStyle($tip, 'left', 0);
            } else if (width > $control.clientWidth - tipWidth / 2) {
              setStyle($tip, 'left', "".concat($control.clientWidth - tipWidth, "px"));
            } else {
              setStyle($tip, 'left', "".concat(width - tipWidth / 2, "px"));
            }
          }

          function setBar(type, percentage) {
            if (type === 'loaded') {
              setStyle($loaded, 'width', "".concat(percentage * 100, "%"));
            }

            if (type === 'played') {
              setStyle($played, 'width', "".concat(percentage * 100, "%"));
              setStyle($indicator, 'left', "calc(".concat(percentage * 100, "% - ").concat(getStyle($indicator, 'width') / 2, "px)"));
            }
          }

          highlight.forEach(function (item) {
            var left = clamp(item.time, 0, player.duration) / player.duration * 100;
            append($highlight, "<span data-text=\"".concat(item.text, "\" data-time=\"").concat(item.time, "\" style=\"left: ").concat(left, "%\"></span>"));
          });
          setBar('loaded', player.loaded);
          art.on('video:progress', function () {
            setBar('loaded', player.loaded);
          });
          art.on('video:timeupdate', function () {
            setBar('played', player.played);
          });
          art.on('video:ended', function () {
            setBar('played', 1);
          });
          proxy($control, 'mousemove', function (event) {
            setStyle($tip, 'display', 'block');

            if (event.composedPath().indexOf($highlight) > -1) {
              showHighlight(event);
            } else {
              showTime(event);
            }
          });
          proxy($control, 'mouseout', function () {
            setStyle($tip, 'display', 'none');
          });
          proxy($control, 'click', function (event) {
            if (event.target !== $indicator) {
              var _getPosFromEvent3 = getPosFromEvent(art, event),
                  second = _getPosFromEvent3.second,
                  percentage = _getPosFromEvent3.percentage;

              setBar('played', percentage);
              player.seek = second;
            }
          });
          proxy($indicator, 'mousedown', function () {
            isDroging = true;
          });
          proxy(document, 'mousemove', function (event) {
            if (isDroging) {
              var _getPosFromEvent4 = getPosFromEvent(art, event),
                  second = _getPosFromEvent4.second,
                  percentage = _getPosFromEvent4.percentage;

              $indicator.classList.add('art-show-indicator');
              setBar('played', percentage);
              player.seek = second;
            }
          });
          proxy(document, 'mouseup', function () {
            if (isDroging) {
              isDroging = false;
              $indicator.classList.remove('art-show-indicator');
            }
          });
        }
      });
    };
  }

  function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function subtitle(controlOption) {
    return function (art) {
      return _objectSpread$5({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              subtitle = art.subtitle;
          var $subtitle = append($control, icons.subtitle);
          tooltip($subtitle, i18n.get('Hide subtitle'));
          proxy($control, 'click', function () {
            subtitle.toggle();
          });
          art.on('subtitle:show', function () {
            setStyle($subtitle, 'opacity', '1');
            tooltip($subtitle, i18n.get('Hide subtitle'));
          });
          art.on('subtitle:hide', function () {
            setStyle($subtitle, 'opacity', '0.8');
            tooltip($subtitle, i18n.get('Show subtitle'));
          });
        }
      });
    };
  }

  function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function time(controlOption) {
    return function (art) {
      return _objectSpread$6({}, controlOption, {
        mounted: function mounted($control) {
          function getTime() {
            var newTime = "".concat(secondToTime(art.player.currentTime), " / ").concat(secondToTime(art.player.duration));

            if (newTime !== $control.innerHTML) {
              $control.innerHTML = newTime;
            }
          }

          getTime();
          ['video:loadedmetadata', 'video:timeupdate', 'video:progress'].forEach(function (event) {
            art.on(event, getTime);
          });
        }
      });
    };
  }

  function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function volume(controlOption) {
    return function (art) {
      return _objectSpread$7({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              player = art.player,
              i18n = art.i18n;
          var isDroging = false;
          var $volume = append($control, icons.volume);
          var $volumeClose = append($control, icons.volumeClose);
          var $volumePanel = append($control, '<div class="art-volume-panel"></div>');
          var $volumeHandle = append($volumePanel, '<div class="art-volume-slider-handle"></div>');
          tooltip($volume, i18n.get('Mute'));
          setStyle($volumeClose, 'display', 'none');

          function volumeChangeFromEvent(event) {
            var _$volumePanel$getBoun = $volumePanel.getBoundingClientRect(),
                panelLeft = _$volumePanel$getBoun.left,
                panelWidth = _$volumePanel$getBoun.width;

            var _$volumeHandle$getBou = $volumeHandle.getBoundingClientRect(),
                handleWidth = _$volumeHandle$getBou.width;

            var percentage = clamp(event.pageX - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) / (panelWidth - handleWidth);
            return percentage;
          }

          function setVolumeHandle() {
            var percentage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.7;

            if (player.muted || percentage === 0) {
              setStyle($volume, 'display', 'none');
              setStyle($volumeClose, 'display', 'flex');
              setStyle($volumeHandle, 'left', '0');
            } else {
              // TODO...
              var panelWidth = getStyle($volumePanel, 'width') || 60;
              var handleWidth = getStyle($volumeHandle, 'width');
              var width = (panelWidth - handleWidth) * percentage;
              setStyle($volume, 'display', 'flex');
              setStyle($volumeClose, 'display', 'none');
              setStyle($volumeHandle, 'left', "".concat(width, "px"));
            }
          }

          setVolumeHandle(player.volume);
          art.on('video:volumechange', function () {
            setVolumeHandle(player.volume);
          });
          proxy($volume, 'click', function () {
            player.muted = true;
          });
          proxy($volumeClose, 'click', function () {
            player.muted = false;
          });
          proxy($volumePanel, 'click', function (event) {
            player.muted = false;
            player.volume = volumeChangeFromEvent(event);
          });
          proxy($volumeHandle, 'mousedown', function () {
            isDroging = true;
          });
          proxy($volumeHandle, 'mousemove', function (event) {
            if (isDroging) {
              player.muted = false;
              player.volume = volumeChangeFromEvent(event);
            }
          });
          proxy(document, 'mouseup', function () {
            if (isDroging) {
              isDroging = false;
            }
          });
        }
      });
    };
  }

  function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$8(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$8(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function setting(controlOption) {
    return function (art) {
      return _objectSpread$8({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              setting = art.setting;
          var $setting = append($control, icons.setting);
          tooltip($setting, i18n.get('Show setting'));
          proxy($control, 'click', function () {
            setting.toggle();
          });
          art.on('setting:show', function () {
            setStyle($setting, 'opacity', '0.8');
            tooltip($setting, i18n.get('Hide setting'));
          });
          art.on('setting:hide', function () {
            setStyle($setting, 'opacity', '1');
            tooltip($setting, i18n.get('Show setting'));
          });
        }
      });
    };
  }

  function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$9(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$9(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function thumbnails(controlOption) {
    return function (art) {
      return _objectSpread$9({}, controlOption, {
        mounted: function mounted($control) {
          var $progress = art.template.$progress,
              _art$events = art.events,
              proxy = _art$events.proxy,
              loadImg = _art$events.loadImg;
          var loading = false;
          var isLoad = false;

          function showThumbnails(event) {
            var _getPosFromEvent = getPosFromEvent(art, event),
                posWidth = _getPosFromEvent.width;

            var _art$option$thumbnail = art.option.thumbnails,
                url = _art$option$thumbnail.url,
                height = _art$option$thumbnail.height,
                width = _art$option$thumbnail.width,
                number = _art$option$thumbnail.number,
                column = _art$option$thumbnail.column;
            var perWidth = $progress.clientWidth / number;
            var perIndex = Math.floor(posWidth / perWidth);
            var yIndex = Math.ceil(perIndex / column) - 1;
            var xIndex = perIndex % column || column - 1;
            setStyle($control, 'backgroundImage', "url(".concat(url, ")"));
            setStyle($control, 'height', "".concat(height, "px"));
            setStyle($control, 'width', "".concat(width, "px"));
            setStyle($control, 'backgroundPosition', "-".concat(xIndex * width, "px -").concat(yIndex * height, "px"));

            if (posWidth <= width / 2) {
              setStyle($control, 'left', 0);
            } else if (posWidth > $progress.clientWidth - width / 2) {
              setStyle($control, 'left', "".concat($progress.clientWidth - width, "px"));
            } else {
              setStyle($control, 'left', "".concat(posWidth - width / 2, "px"));
            }
          }

          proxy($progress, 'mousemove', function (event) {
            if (!loading) {
              loading = true;
              loadImg(art.option.thumbnails.url).then(function () {
                isLoad = true;
              });
            }

            if (isLoad) {
              setStyle($control, 'display', 'block');
              showThumbnails(event);
            }
          });
          proxy($progress, 'mouseout', function () {
            setStyle($control, 'display', 'none');
          });
        }
      });
    };
  }

  function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$a(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$a(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function screenshot(controlOption) {
    return function (art) {
      return _objectSpread$a({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              player = art.player;
          var $screenshot = append($control, icons.screenshot);
          tooltip($screenshot, i18n.get('Screenshot'));
          proxy($screenshot, 'click', function () {
            player.screenshot();
          });
        }
      });
    };
  }

  function ownKeys$b(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$b(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$b(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function quality(controlOption) {
    return function (art) {
      return _objectSpread$b({}, controlOption, {
        mounted: function mounted($control) {
          var option = art.option,
              _art$events = art.events,
              proxy = _art$events.proxy,
              hover = _art$events.hover,
              player = art.player;
          var playIndex = -1;
          var defaultQuality = option.quality.find(function (item) {
            return item.default;
          }) || option.quality[0];
          playIndex = option.quality.indexOf(defaultQuality);
          var $qualityName = append($control, "<div class=\"art-quality-name\">".concat(defaultQuality.name, "</div>"));
          var qualityList = option.quality.map(function (item, index) {
            return "<div class=\"art-quality-item\" data-index=\"".concat(index, "\">").concat(item.name, "</div>");
          }).join('');
          var $qualitys = append($control, "<div class=\"art-qualitys\">".concat(qualityList, "</div>"));
          hover($control, function () {
            $qualitys.style.left = "-".concat(getStyle($qualitys, 'width') / 2 - $control.clientWidth / 2, "px");
          });
          proxy($qualitys, 'click', function (event) {
            var index = Number(event.target.dataset.index);
            var _option$quality$index = option.quality[index],
                url = _option$quality$index.url,
                name = _option$quality$index.name;

            if (url && name && playIndex !== index) {
              player.switchQuality(url, name);
              $qualityName.innerHTML = name;
              playIndex = index;
            }
          });
        }
      });
    };
  }

  var Controls =
  /*#__PURE__*/
  function () {
    function Controls(art) {
      var _this = this;

      classCallCheck(this, Controls);

      this.id = 0;
      this.art = art;
      this.art.once('video:canplay', function () {
        _this.init();
      });
    }

    createClass(Controls, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var option = this.art.option;
        this.add(progress({
          name: 'progress',
          disable: option.isLive,
          position: 'top',
          index: 10
        }));
        this.add(thumbnails({
          name: 'thumbnails',
          disable: !option.thumbnails.url || option.isLive,
          position: 'top',
          index: 20
        }));
        this.add(playAndPause({
          name: 'playAndPause',
          disable: false,
          position: 'left',
          index: 10
        }));
        this.add(volume({
          name: 'volume',
          disable: false,
          position: 'left',
          index: 20
        }));
        this.add(time({
          name: 'time',
          disable: option.isLive,
          position: 'left',
          index: 30
        }));
        this.add(quality({
          name: 'quality',
          disable: option.quality.length === 0,
          position: 'right',
          index: 10
        }));
        this.add(screenshot({
          name: 'screenshot',
          disable: !option.screenshot,
          position: 'right',
          index: 20
        }));
        this.add(subtitle({
          name: 'subtitle',
          disable: !option.subtitle.url,
          position: 'right',
          index: 30
        }));
        this.add(setting({
          name: 'setting',
          disable: !option.setting,
          position: 'right',
          index: 40
        }));
        this.add(pip({
          name: 'pip',
          disable: !option.pip,
          position: 'right',
          index: 50
        }));
        this.add(fullscreenWeb({
          name: 'fullscreenWeb',
          disable: !option.fullscreenWeb,
          position: 'right',
          index: 60
        }));
        this.add(fullscreen({
          name: 'fullscreen',
          disable: !option.fullscreen,
          position: 'right',
          index: 70
        }));
        option.controls.forEach(function (item) {
          _this2.add(item);
        });
      }
    }, {
      key: "add",
      value: function add(item, callback) {
        var option = typeof item === 'function' ? item(this.art) : item;
        var _this$art$template = this.art.template,
            $progress = _this$art$template.$progress,
            $controlsLeft = _this$art$template.$controlsLeft,
            $controlsRight = _this$art$template.$controlsRight;
        var parent;

        switch (option.position) {
          case 'top':
            parent = $progress;
            break;

          case 'left':
            parent = $controlsLeft;
            break;

          case 'right':
            parent = $controlsRight;
            break;

          default:
            break;
        }

        errorHandle(parent, 'Controls option.position can not be empty');
        this.id += 1;
        var control = component(this.art, this, parent, option, callback, 'control');

        if (!option.disable && option.position !== 'top' && !(control.$ref.firstElementChild && control.$ref.firstElementChild.tagName === 'I')) {
          control.$ref.classList.add('art-control-onlyText');
        }

        return control;
      }
    }, {
      key: "toggle",
      value: function toggle() {
        this.show = !this.state;
      }
    }, {
      key: "show",
      set: function set(value) {
        var $player = this.art.template.$player;

        if (value) {
          this.state = true;
          $player.classList.add('artplayer-controls-show');
          this.art.emit('controls:show');
        } else {
          this.state = false;
          $player.classList.remove('artplayer-controls-show');
          this.art.emit('controls:hide');
        }
      }
    }]);

    return Controls;
  }();

  function ownKeys$c(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$c(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$c(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function playbackRate(menuOption) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$c({}, menuOption, {
        html: "\n                ".concat(i18n.get('Play speed'), ":\n                <span data-rate=\"0.5\">0.5</span>\n                <span data-rate=\"0.75\">0.75</span>\n                <span data-rate=\"1.0\" class=\"normal current\">").concat(i18n.get('Normal'), "</span>\n                <span data-rate=\"1.25\">1.25</span>\n                <span data-rate=\"1.5\">1.5</span>\n                <span data-rate=\"2.0\">2.0</span>\n            "),
        click: function click(contextmenu, event) {
          var target = event.target;
          var rate = target.dataset.rate;

          if (rate) {
            player.playbackRate = Number(rate);
            contextmenu.show = false;
          }
        },
        mounted: function mounted($menu) {
          art.on('playbackRateChange', function (rate) {
            var $current = Array.from($menu.querySelectorAll('span')).find(function (item) {
              return Number(item.dataset.rate) === rate;
            });

            if ($current) {
              inverseClass($current, 'current');
            }
          });
        }
      });
    };
  }

  function ownKeys$d(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$d(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$d(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$d(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function aspectRatio(menuOption) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$d({}, menuOption, {
        html: "\n                ".concat(i18n.get('Aspect ratio'), ":\n                <span data-ratio=\"default\" class=\"default current\">").concat(i18n.get('Default'), "</span>\n                <span data-ratio=\"4:3\">4:3</span>\n                <span data-ratio=\"16:9\">16:9</span>\n            "),
        click: function click(contextmenu, event) {
          var target = event.target;
          var ratio = target.dataset.ratio;

          if (ratio) {
            player.aspectRatio = ratio;
            contextmenu.show = false;
          }
        },
        mounted: function mounted($menu) {
          art.on('aspectRatioChange', function (ratio) {
            var $current = Array.from($menu.querySelectorAll('span')).find(function (item) {
              return item.dataset.ratio === ratio;
            });
            inverseClass($current, 'current');
          });
        }
      });
    };
  }

  function ownKeys$e(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$e(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$e(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$e(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function info(menuOption) {
    return function (art) {
      return _objectSpread$e({}, menuOption, {
        html: art.i18n.get('Video info'),
        click: function click(contextmenu) {
          art.info.show = true;
          contextmenu.show = false;
        }
      });
    };
  }

  function ownKeys$f(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$f(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$f(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$f(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function version(menuOption) {
    return _objectSpread$f({}, menuOption, {
      html: '<a href="https://artplayer.org" target="_blank">ArtPlayer 3.1.14</a>'
    });
  }

  function ownKeys$g(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$g(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$g(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$g(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function close(menuOption) {
    return function (art) {
      return _objectSpread$g({}, menuOption, {
        html: art.i18n.get('Close'),
        click: function click(contextmenu) {
          contextmenu.show = false;
        }
      });
    };
  }

  var Contextmenu =
  /*#__PURE__*/
  function () {
    function Contextmenu(art) {
      var _this = this;

      classCallCheck(this, Contextmenu);

      this.id = 0;
      this.art = art;
      this.art.once('video:canplay', function () {
        _this.init();
      });
      this.art.on('blur', function () {
        _this.show = false;
      });
    }

    createClass(Contextmenu, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var _this$art = this.art,
            option = _this$art.option,
            _this$art$template = _this$art.template,
            $player = _this$art$template.$player,
            $contextmenu = _this$art$template.$contextmenu,
            proxy = _this$art.events.proxy;
        this.add(playbackRate({
          disable: !option.playbackRate,
          name: 'playbackRate',
          index: 10
        }));
        this.add(aspectRatio({
          disable: !option.aspectRatio,
          name: 'aspectRatio',
          index: 20
        }));
        this.add(info({
          disable: false,
          name: 'info',
          index: 30
        }));
        this.add(version({
          disable: false,
          name: 'version',
          index: 40
        }));
        this.add(close({
          disable: false,
          name: 'close',
          index: 50
        }));
        option.contextmenu.forEach(function (item) {
          _this2.add(item);
        });
        proxy($player, 'contextmenu', function (event) {
          event.preventDefault();
          _this2.show = true;

          _this2.setPos(event);
        });
        proxy($player, 'click', function (event) {
          if (!event.composedPath().includes($contextmenu)) {
            _this2.show = false;
          }
        });
      }
    }, {
      key: "add",
      value: function add(item, callback) {
        var $contextmenu = this.art.template.$contextmenu;
        this.id += 1;
        return component(this.art, this, $contextmenu, item, callback, 'contextmenu');
      }
    }, {
      key: "setPos",
      value: function setPos(event) {
        var _this$art$template2 = this.art.template,
            $player = _this$art$template2.$player,
            $contextmenu = _this$art$template2.$contextmenu;
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        var _$player$getBoundingC = $player.getBoundingClientRect(),
            cHeight = _$player$getBoundingC.height,
            cWidth = _$player$getBoundingC.width,
            cLeft = _$player$getBoundingC.left,
            cTop = _$player$getBoundingC.top;

        var _$contextmenu$getBoun = $contextmenu.getBoundingClientRect(),
            mHeight = _$contextmenu$getBoun.height,
            mWidth = _$contextmenu$getBoun.width;

        var menuLeft = mouseX - cLeft;
        var menuTop = mouseY - cTop;

        if (mouseX + mWidth > cLeft + cWidth) {
          menuLeft = cWidth - mWidth;
        }

        if (mouseY + mHeight > cTop + cHeight) {
          menuTop = cHeight - mHeight;
        }

        setStyle($contextmenu, 'left', "".concat(menuLeft, "px"));
        setStyle($contextmenu, 'top', "".concat(menuTop, "px"));
      }
    }, {
      key: "toggle",
      value: function toggle() {
        this.show = !this.state;
      }
    }, {
      key: "show",
      set: function set(value) {
        var $player = this.art.template.$player;

        if (value) {
          this.state = true;
          $player.classList.add('artplayer-contextmenu-show');
          this.art.emit('contextmenu:show');
        } else {
          this.state = false;
          $player.classList.remove('artplayer-contextmenu-show');
          this.art.emit('contextmenu:hide');
        }
      }
    }]);

    return Contextmenu;
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
            $infoClose = _this$art.template.$infoClose,
            proxy = _this$art.events.proxy;
        proxy($infoClose, 'click', function () {
          _this.show = false;
        });
        this.art.on('destroy', function () {
          if (_this.timer) {
            clearTimeout(_this.timer);
          }
        });
      }
    }, {
      key: "creatInfo",
      value: function creatInfo() {
        var infoHtml = [];
        infoHtml.push("\n          <div class=\"art-info-item \">\n            <div class=\"art-info-title\">Player version:</div>\n            <div class=\"art-info-content\">3.1.14</div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video url:</div>\n            <div class=\"art-info-content\">".concat(this.art.option.url, "</div>\n          </div>\n        "));
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video volume:</div>\n            <div class=\"art-info-content\" data-video=\"volume\"></div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video time:</div>\n            <div class=\"art-info-content\" data-video=\"currentTime\"></div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video duration:</div>\n            <div class=\"art-info-content\" data-video=\"duration\"></div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video resolution:</div>\n            <div class=\"art-info-content\">\n              <span data-video=\"videoWidth\"></span> x <span data-video=\"videoHeight\"></span>\n            </div>\n          </div>\n        ");
        return infoHtml.join('');
      }
    }, {
      key: "readInfo",
      value: function readInfo() {
        var _this$art$template = this.art.template,
            $infoPanel = _this$art$template.$infoPanel,
            $video = _this$art$template.$video;
        var types = Array.from($infoPanel.querySelectorAll('[data-video]'));
        types.forEach(function (item) {
          var value = $video[item.dataset.video];

          if (value !== undefined) {
            item.innerHTML = typeof value === 'number' ? value.toFixed(2) : value;
          } else {
            item.innerHTML = 'unknown';
          }
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
      key: "toggle",
      value: function toggle() {
        this.show = !this.state;
      }
    }, {
      key: "show",
      set: function set(value) {
        var _this$art$template2 = this.art.template,
            $player = _this$art$template2.$player,
            $infoPanel = _this$art$template2.$infoPanel;

        if (value) {
          this.state = true;
          $player.classList.add('artplayer-info-show');

          if (!$infoPanel.innerHTML) {
            append($infoPanel, this.creatInfo());
          }

          clearTimeout(this.timer);
          this.loop();
          this.art.emit('info:show');
        } else {
          this.state = false;
          $player.classList.remove('artplayer-info-show');
          clearTimeout(this.timer);
          this.art.emit('info:hide');
        }
      }
    }]);

    return Info;
  }();

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

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

  var Subtitle =
  /*#__PURE__*/
  function () {
    function Subtitle(art) {
      classCallCheck(this, Subtitle);

      this.art = art;
      this.state = true;
      var url = this.art.option.subtitle.url;

      if (url) {
        this.init(url);
      }
    }

    createClass(Subtitle, [{
      key: "init",
      value: function init(url) {
        var _this = this;

        var _this$art = this.art,
            proxy = _this$art.events.proxy,
            subtitle = _this$art.option.subtitle,
            _this$art$template = _this$art.template,
            $video = _this$art$template.$video,
            $subtitle = _this$art$template.$subtitle,
            $track = _this$art$template.$track;
        setStyles($subtitle, subtitle.style || {});

        if (!$track) {
          var $newTrack = document.createElement('track');
          $newTrack.default = true;
          $newTrack.kind = 'metadata';
          $video.appendChild($newTrack);
          this.art.template.$track = $newTrack;
        }

        this.load(url).then(function (url) {
          _this.art.template.$track.src = url;

          _this.art.emit('subtitle:load', url);

          if ($video.textTracks && $video.textTracks[0]) {
            // eslint-disable-next-line no-inner-declarations
            var updateSubtitle = function updateSubtitle() {
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

              this.art.emit('subtitle:update', $subtitle);
            };

            var _$video$textTracks = slicedToArray($video.textTracks, 1),
                track = _$video$textTracks[0];

            proxy(track, 'cuechange', updateSubtitle.bind(_this));

            _this.art.on('artplayerPluginSubtitle:set', updateSubtitle.bind(_this));
          }
        });
      }
    }, {
      key: "load",
      value: function load(url) {
        var notice = this.art.notice;
        var type;
        return fetch(url).then(function (response) {
          type = response.headers.get('Content-Type');
          return response.text();
        }).then(function (text) {
          if (/x-subrip/gi.test(type)) {
            return vttToBlob(srtToVtt(text));
          }

          return url;
        }).catch(function (err) {
          notice.show(err);
          throw err;
        });
      }
    }, {
      key: "toggle",
      value: function toggle() {
        this.show = !this.state;
      }
    }, {
      key: "show",
      set: function set(value) {
        var $player = this.art.template.$player;

        if (value) {
          this.state = true;
          $player.classList.remove('artplayer-subtitle-hide');
          this.art.emit('subtitle:show');
        } else {
          this.state = false;
          $player.classList.add('artplayer-subtitle-hide');
          this.art.emit('subtitle:hide');
        }
      }
    }]);

    return Subtitle;
  }();

  function clickInit(art, events) {
    var $player = art.template.$player;
    events.proxy(document, ['click', 'contextmenu'], function (event) {
      if (event.composedPath().indexOf($player) > -1) {
        art.isFocus = true;
        art.emit('focus');
      } else {
        art.isFocus = false;
        art.emit('blur');
      }
    });
  }

  function hoverInit(art, events) {
    var $player = art.template.$player;
    events.hover($player, function () {
      $player.classList.add('artplayer-hover');
      art.emit('hoverenter');
    }, function () {
      $player.classList.remove('artplayer-hover');
      art.emit('hoverleave');
    });
  }

  function mousemoveInitInit(art, events) {
    var _art$template = art.template,
        $player = _art$template.$player,
        $video = _art$template.$video,
        player = art.player;
    var autoHide = debounce(function () {
      $player.classList.add('artplayer-hide-cursor');
      $player.classList.remove('artplayer-hover');
      art.controls.show = false;
    }, 5000);
    art.on('hoverleave', function () {
      if (player.playing) {
        autoHide();
      }
    });
    events.proxy($player, 'mousemove', function (event) {
      autoHide.clearTimeout();
      $player.classList.remove('artplayer-hide-cursor');
      art.controls.show = true;

      if (!art.player.pip && player.playing && event.target === $video) {
        autoHide();
      }
    });
  }

  function resizeInit(art, events) {
    var option = art.option,
        player = art.player,
        $player = art.template.$player;
    var object = document.createElement('object');
    object.setAttribute('aria-hidden', 'true');
    object.setAttribute('tabindex', -1);
    object.type = 'text/html';
    object.data = 'about:blank';
    var playerWidth = player.width;
    var playerHeight = player.height;
    var resizeFn = throttle(function () {
      if (player.width !== playerWidth || player.height !== playerHeight) {
        playerWidth = player.width;
        playerHeight = player.height;

        if (option.autoSize) {
          if (!art.player.fullscreen && !art.player.fullscreenWeb && !art.player.pip) {
            art.player.autoSize = true;
          } else {
            art.player.autoSize = false;
          }
        }

        art.player.aspectRatioReset = true;
        art.emit('resize', {
          width: player.width,
          height: player.height
        });
      }
    }, 500);
    events.proxy(object, 'load', function () {
      events.proxy(object.contentDocument.defaultView, 'resize', resizeFn);
    });
    $player.appendChild(object);
  }

  var Events =
  /*#__PURE__*/
  function () {
    function Events(art) {
      var _this = this;

      classCallCheck(this, Events);

      this.destroyEvents = [];
      this.proxy = this.proxy.bind(this);
      this.hover = this.hover.bind(this);
      this.loadImg = this.loadImg.bind(this);

      if (art.whitelist.state) {
        art.once('video:canplay', function () {
          clickInit(art, _this);
          hoverInit(art, _this);
          mousemoveInitInit(art, _this);
          resizeInit(art, _this);
        });
      }
    }

    createClass(Events, [{
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
        if (mouseenter) {
          this.proxy(target, 'mouseenter', mouseenter);
        }

        if (mouseleave) {
          this.proxy(target, 'mouseleave', mouseleave);
        }
      }
    }, {
      key: "loadImg",
      value: function loadImg(img) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          var image;

          if (img instanceof HTMLImageElement) {
            image = img;
          } else if (typeof img === 'string') {
            image = new Image();
            image.src = img;
          } else {
            return reject(img);
          }

          if (image.complete) {
            return resolve(image);
          }

          _this3.proxy(image, 'load', function () {
            return resolve(image);
          });

          _this3.proxy(image, 'error', function () {
            return reject(image);
          });

          return img;
        });
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
      var _this = this;

      classCallCheck(this, Hotkey);

      this.art = art;
      this.keys = {};

      if (this.art.option.hotkey) {
        this.art.once('video:canplay', function () {
          _this.add(27, function () {
            if (art.player.fullscreenWeb) {
              art.player.fullscreenWeb = false;
            }
          });

          _this.add(32, function () {
            art.player.toggle = true;
          });

          _this.add(37, function () {
            art.player.seek = art.player.currentTime - 10;
          });

          _this.add(38, function () {
            art.player.volume += 0.05;
          });

          _this.add(39, function () {
            art.player.seek = art.player.currentTime + 10;
          });

          _this.add(40, function () {
            art.player.volume -= 0.05;
          });

          _this.init();
        });
      }
    }

    createClass(Hotkey, [{
      key: "add",
      value: function add(key, event) {
        if (this.keys[key]) {
          this.keys[key].push(event);
        } else {
          this.keys[key] = [event];
        }
      }
    }, {
      key: "init",
      value: function init() {
        var _this2 = this;

        var proxy = this.art.events.proxy;
        proxy(window, 'keydown', function (event) {
          if (_this2.art.isFocus) {
            var tag = document.activeElement.tagName.toUpperCase();
            var editable = document.activeElement.getAttribute('contenteditable');

            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
              var events = _this2.keys[event.keyCode];

              if (events) {
                event.preventDefault();
                events.forEach(function (fn) {
                  return fn();
                });

                _this2.art.emit('hotkey', event);
              }
            }
          }
        });
      }
    }]);

    return Hotkey;
  }();

  var Layers =
  /*#__PURE__*/
  function () {
    function Layers(art) {
      var _this = this;

      classCallCheck(this, Layers);

      this.id = 0;
      this.art = art;
      this.add = this.add.bind(this);
      this.art.once('video:canplay', function () {
        _this.art.option.layers.forEach(function (item) {
          _this.add(item);
        });
      });
    }

    createClass(Layers, [{
      key: "add",
      value: function add(item, callback) {
        this.id += 1;
        var $layers = this.art.template.$layers;
        return component(this.art, this, $layers, item, callback, 'layer');
      }
    }, {
      key: "toggle",
      value: function toggle() {
        this.show = !this.state;
      }
    }, {
      key: "show",
      set: function set(value) {
        var $player = this.art.template.$player;

        if (value) {
          this.state = true;
          $player.classList.remove('artplayer-layers-hide');
          this.art.emit('layers:show');
        } else {
          this.state = false;
          $player.classList.add('artplayer-layers-hide');
          this.art.emit('layers:hide');
        }
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
      var $loading = art.template.$loading;
      append($loading, art.icons.loading);
    }

    createClass(Loading, [{
      key: "toggle",
      value: function toggle() {
        this.show = !this.state;
      }
    }, {
      key: "show",
      set: function set(value) {
        var $player = this.art.template.$player;

        if (value) {
          this.state = true;
          $player.classList.add('artplayer-loading-show');
          this.art.emit('loading:show');
        } else {
          this.state = false;
          $player.classList.remove('artplayer-loading-show');
          this.art.emit('loading:hide');
        }
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
        var _this$art$template = this.art.template,
            $player = _this$art$template.$player,
            $noticeInner = _this$art$template.$noticeInner;
        this.state = true;
        $player.classList.add('artplayer-notice-show');
        $noticeInner.innerHTML = msg instanceof Error ? msg.message.trim() : msg;
        clearTimeout(this.timer);

        if (autoHide) {
          this.timer = setTimeout(function () {
            _this.hide();
          }, time);
        }

        this.art.emit('notice:show');
      }
    }, {
      key: "hide",
      value: function hide() {
        var $player = this.art.template.$player;
        this.state = false;
        $player.classList.remove('artplayer-notice-show');
        this.art.emit('notice:hide');
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
      var $mask = art.template.$mask;
      var $playBig = append($mask, '<div class="art-state"></div>');
      append($playBig, art.icons.state);
    }

    createClass(Mask, [{
      key: "toggle",
      value: function toggle() {
        this.show = !this.state;
      }
    }, {
      key: "show",
      set: function set(value) {
        var $player = this.art.template.$player;

        if (value) {
          this.state = true;
          $player.classList.add('artplayer-mask-show');
          this.art.emit('mask:show');
        } else {
          this.state = false;
          $player.classList.remove('artplayer-mask-show');
          this.art.emit('mask:hide');
        }
      }
    }]);

    return Mask;
  }();

  var loading = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50px\" height=\"50px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"uil-default\">\n  <rect x=\"0\" y=\"0\" width=\"100\" height=\"100\" fill=\"none\" class=\"bk\"/>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(0 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-1s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(30 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.9166666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(60 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.8333333333333334s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(90 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.75s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(120 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.6666666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(150 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5833333333333334s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(180 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(210 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.4166666666666667s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(240 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.3333333333333333s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(270 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.25s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(300 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.16666666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(330 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.08333333333333333s\" repeatCount=\"indefinite\"/>\n  </rect>\n</svg>";

  var state = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"60\" width=\"60\" style=\"filter: drop-shadow(0px 1px 1px black);\" viewBox=\"0 0 24 24\">\n    <path d=\"M20,2H4C1.8,2,0,3.8,0,6v12c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V6C24,3.8,22.2,2,20,2z M15.6,12.8L10.5,16 C9.9,16.5,9,16,9,15.2V8.8C9,8,9.9,7.5,10.5,8l5.1,3.2C16.3,11.5,16.3,12.5,15.6,12.8z\"/>\n</svg>";

  var play = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n  <path d=\"M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z\"></path>\n</svg>";

  var pause = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z\"></path>\n</svg>";

  var volume$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z\"></path>\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z\"></path>\n</svg>";

  var volumeClose = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z\"></path>\n    <path d=\"M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z\"></path>\n</svg>";

  var subtitle$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 48 48\">\n    <path d=\"M0 0h48v48H0z\" fill=\"none\"/>\n    <path d=\"M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z\"/>\n</svg>";

  var screenshot$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 50 50\">\n\t<path d=\"M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z \"/>\n</svg>\n";

  var setting$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <circle cx=\"11\" cy=\"11\" r=\"2\"></circle>\n    <path d=\"M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z\"></path>\n</svg>";

  var fullscreen$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"36\" width=\"36\" viewBox=\"0 0 36 36\">\n\t<path d=\"m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z\"></path>\n\t<path d=\"m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z\"></path>\n\t<path d=\"m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z\"></path>\n\t<path d=\"M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z\"></path>\n</svg>";

  var fullscreenWeb$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" height=\"36\" width=\"36\">\n\t<path d=\"m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z\" fill-rule=\"evenodd\"></path>\n</svg>";

  var pip$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" height=\"32\" width=\"32\">\n    <path d=\"M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z\"></path>\n</svg>";

  var prev = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"36\" width=\"36\" viewBox=\"0 0 36 36\">\n    <path d=\"m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z\"></path>\n</svg>";

  var next = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"36\" width=\"36\" viewBox=\"0 0 36 36\">\n    <path d=\"M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z\"></path>\n</svg>";

  var Icons = function Icons(art) {
    var _this = this;

    classCallCheck(this, Icons);

    var icons = Object.assign({
      loading: loading,
      state: state,
      play: play,
      pause: pause,
      volume: volume$1,
      volumeClose: volumeClose,
      subtitle: subtitle$1,
      screenshot: screenshot$1,
      setting: setting$1,
      fullscreen: fullscreen$1,
      fullscreenWeb: fullscreenWeb$1,
      pip: pip$1,
      prev: prev,
      next: next
    }, art.option.icons);
    Object.keys(icons).forEach(function (key) {
      var icon = document.createElement('i');
      icon.classList.add('art-icon');
      icon.classList.add("art-icon-".concat(key));
      append(icon, icons[key]);
      _this[key] = icon;
    });
  };

  function ownKeys$h(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$h(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$h(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$h(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function flip(settingOption) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$h({}, settingOption, {
        html: "\n                <div class=\"art-setting-header\">".concat(i18n.get('Flip'), "</div>\n                <div class=\"art-setting-radio\">\n                    <div class=\"art-radio-item current\">\n                        <button type=\"button\" data-value=\"normal\">").concat(i18n.get('Normal'), "</button>\n                    </div>\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"horizontal\">").concat(i18n.get('Horizontal'), "</button>\n                    </div>\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"vertical\">").concat(i18n.get('Vertical'), "</button>\n                    </div>\n                </div>\n            "),
        click: function click(setting, event) {
          var value = event.target.dataset.value;

          if (value) {
            player.flip = value;
          }
        },
        mounted: function mounted($setting) {
          art.on('flipChange', function (flip) {
            var $current = Array.from($setting.querySelectorAll('button')).find(function (item) {
              return item.dataset.value === flip;
            });
            inverseClass($current.parentElement, 'current');
          });
        }
      });
    };
  }

  function ownKeys$i(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$i(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$i(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$i(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function aspectRatio$1(settingOption) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$i({}, settingOption, {
        html: "\n                <div class=\"art-setting-header\">".concat(i18n.get('Aspect ratio'), "</div>\n                <div class=\"art-setting-radio\">\n                    <div class=\"art-radio-item current\">\n                        <button type=\"button\" data-value=\"default\">").concat(i18n.get('Default'), "</button>\n                    </div>\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"4:3\">4:3</button>\n                    </div>\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"16:9\">16:9</button>\n                    </div>\n                </div>\n            "),
        click: function click(setting, event) {
          var value = event.target.dataset.value;

          if (value) {
            player.aspectRatio = value;
          }
        },
        mounted: function mounted($setting) {
          art.on('aspectRatioChange', function (ratio) {
            var $current = Array.from($setting.querySelectorAll('button')).find(function (item) {
              return item.dataset.value === ratio;
            });
            inverseClass($current.parentElement, 'current');
          });
        }
      });
    };
  }

  function ownKeys$j(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$j(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$j(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$j(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function playbackRate$1(settingOption) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player,
          proxy = art.events.proxy;
      return _objectSpread$j({}, settingOption, {
        html: "\n                <div class=\"art-setting-header\">\n                    ".concat(i18n.get('Play speed'), ": <span class=\"art-subtitle-value\">1.0</span>x\n                </div>\n                <div class=\"art-setting-range\">\n                    <input class=\"art-subtitle-range\" value=\"1\" type=\"range\" min=\"0.5\" max=\"2\" step=\"0.25\">\n                </div>\n            "),
        mounted: function mounted($setting) {
          var $range = $setting.querySelector('.art-setting-range input');
          var $value = $setting.querySelector('.art-subtitle-value');
          proxy($range, 'change', function () {
            var value = $range.value;
            $value.innerText = value;
            player.playbackRate = Number(value);
          });
          art.on('playbackRateChange', function (rate) {
            if ($range.value !== rate) {
              $range.value = rate;
              $value.innerText = rate;
            }
          });
        }
      });
    };
  }

  var Setting =
  /*#__PURE__*/
  function () {
    function Setting(art) {
      var _this = this;

      classCallCheck(this, Setting);

      this.id = 0;
      this.art = art;
      this.state = false;

      if (art.option.setting) {
        this.art.once('video:canplay', function () {
          _this.init();
        });
        this.art.on('blur', function () {
          _this.show = false;
        });
      }
    }

    createClass(Setting, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var _this$art = this.art,
            option = _this$art.option,
            $setting = _this$art.template.$setting,
            proxy = _this$art.events.proxy;
        proxy($setting, 'click', function (e) {
          if (e.target === $setting) {
            _this2.show = false;
          }
        });
        this.add(flip({
          disable: !option.flip,
          name: 'flip'
        }));
        this.add(aspectRatio$1({
          disable: !option.aspectRatio,
          name: 'aspectRatio'
        }));
        this.add(playbackRate$1({
          disable: !option.playbackRate,
          name: 'playbackRate'
        }));
      }
    }, {
      key: "add",
      value: function add(item, callback) {
        this.id += 1;
        var $settingBody = this.art.template.$settingBody;
        return component(this.art, this, $settingBody, item, callback, 'setting');
      }
    }, {
      key: "toggle",
      value: function toggle() {
        this.show = !this.state;
      }
    }, {
      key: "show",
      set: function set(value) {
        var $player = this.art.template.$player;

        if (value) {
          this.state = true;
          $player.classList.add('artplayer-setting-show');
          this.art.emit('setting:show');
        } else {
          this.state = false;
          $player.classList.remove('artplayer-setting-show');
          this.art.emit('setting:hide');
        }
      }
    }]);

    return Setting;
  }();

  var Storage =
  /*#__PURE__*/
  function () {
    function Storage(art) {
      classCallCheck(this, Storage);

      this.art = art;
      this.name = 'artplayer_settings';
      this.init();
    }

    createClass(Storage, [{
      key: "init",
      value: function init() {
        var option = this.art.option;
        var volume = this.get('volume');

        if (volume) {
          option.volume = volume;
        }
      }
    }, {
      key: "get",
      value: function get(key) {
        var storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
        return key ? storage[key] : {};
      }
    }, {
      key: "set",
      value: function set(key, value) {
        var storage = Object.assign({}, this.get(), defineProperty({}, key, value));
        window.localStorage.setItem(this.name, JSON.stringify(storage));
      }
    }, {
      key: "del",
      value: function del(key) {
        var storage = this.get();
        delete storage[key];
        window.localStorage.setItem(this.name, JSON.stringify(storage));
      }
    }, {
      key: "clean",
      value: function clean() {
        window.localStorage.removeItem(this.name);
      }
    }]);

    return Storage;
  }();

  function settingMix(art) {
    var i18n = art.i18n,
        proxy = art.events.proxy;
    return {
      title: 'Subtitle',
      name: 'subtitle',
      index: 20,
      html: "\n            <div class=\"art-setting-header\">\n                ".concat(i18n.get('Subtitle offset time'), ": <span class=\"art-subtitle-value\">0</span>s\n            </div>\n            <div class=\"art-setting-range\">\n                <input class=\"art-subtitle-range\" value=\"0\" type=\"range\" min=\"-5\" max=\"5\" step=\"0.5\">\n            </div>\n        "),
      mounted: function mounted($setting) {
        var $range = $setting.querySelector('.art-setting-range input');
        var $value = $setting.querySelector('.art-subtitle-value');
        proxy($range, 'change', function () {
          var value = $range.value;
          $value.innerText = value;
          art.plugins.subtitle.offset(Number(value));
        });
        art.on('subtitle:switch', function () {
          $range.value = 0;
          $value.innerText = 0;
        });
        art.on('artplayerPluginSubtitle:set', function (value) {
          if ($range.value !== value) {
            $range.value = value;
            $value.innerText = value;
          }
        });
      }
    };
  }

  function subtitleOffset(art) {
    var clamp = art.constructor.utils.clamp;
    var setting = art.setting,
        notice = art.notice,
        template = art.template,
        i18n = art.i18n,
        player = art.player;
    i18n.update({
      'zh-cn': {
        'Subtitle offset time': '字幕偏移时间',
        'No subtitles found': '未发现字幕'
      },
      'zh-tw': {
        'Subtitle offset time': '字幕偏移時間',
        'No subtitles found': '未發現字幕'
      }
    });
    setting.add(settingMix);
    var cuesCache = [];
    art.on('subtitle:switch', function () {
      cuesCache = [];
    });
    return {
      name: 'subtitle',
      offset: function offset(value) {
        if (template.$track && template.$track.track) {
          var cues = Array.from(template.$track.track.cues);
          var time = clamp(value, -5, 5);
          cues.forEach(function (cue, index) {
            if (!cuesCache[index]) {
              cuesCache[index] = {
                startTime: cue.startTime,
                endTime: cue.endTime
              };
            }

            cue.startTime = clamp(cuesCache[index].startTime + time, 0, player.duration);
            cue.endTime = clamp(cuesCache[index].endTime + time, 0, player.duration);
          });
          notice.show("".concat(i18n.get('Subtitle offset time'), ": ").concat(value, "s"));
          art.emit('artplayerPluginSubtitle:set', value);
        } else {
          notice.show("".concat(i18n.get('No subtitles found')));
          art.emit('artplayerPluginSubtitle:set', 0);
        }
      }
    };
  }

  function localPreview(art) {
    var _art$constructor$util = art.constructor.utils,
        append = _art$constructor$util.append,
        setStyle = _art$constructor$util.setStyle,
        setStyles = _art$constructor$util.setStyles,
        sleep = _art$constructor$util.sleep,
        errorHandle = _art$constructor$util.errorHandle;
    var proxy = art.events.proxy,
        option = art.option,
        notice = art.notice,
        i18n = art.i18n,
        template = art.template,
        player = art.player;
    i18n.update({
      'zh-cn': {
        'Playback of this file format is not supported': '不支持播放该文件格式',
        'Load local video successfully': '加载本地视频成功'
      },
      'zh-tw': {
        'Playback of this file format is not supported': '不支持播放該文件格式',
        'Load local video successfully': '加載本地視頻成功'
      }
    });

    function loadVideo(file) {
      if (file) {
        var canPlayType = template.$video.canPlayType(file.type);

        if (canPlayType === 'maybe' || canPlayType === 'probably') {
          var url = URL.createObjectURL(file);
          player.playbackRate = false;
          player.aspectRatio = false;
          template.$video.src = url;
          sleep(1000).then(function () {
            player.currentTime = 0;
          });
          option.url = url;
          art.emit('switch', url);
          notice.show(i18n.get('Load local video successfully'));
        } else {
          var tip = "".concat(i18n.get('Playback of this file format is not supported'), ": ").concat(file.type);
          notice.show(tip, true, 3000);
          errorHandle(false, tip);
        }
      }
    }

    proxy(template.$player, 'dragover', function (e) {
      e.preventDefault();
      notice.show(i18n.get('Load local video successfully'));
    });
    proxy(template.$player, 'drop', function (e) {
      e.preventDefault();
      var file = e.dataTransfer.files[0];
      loadVideo(file);
    });
    return {
      name: 'localPreview',
      attach: function attach(target) {
        var $input = append(target, '<input type="file">');
        setStyle(target, 'position', 'relative');
        setStyles($input, {
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: '0',
          top: '0',
          opacity: '0'
        });
        proxy($input, 'change', function () {
          var file = $input.files[0];
          loadVideo(file);
        });
      }
    };
  }

  function miniProgressBar(art) {
    var layers = art.layers,
        player = art.player,
        theme = art.option.theme;
    layers.add({
      name: 'miniProgressBar',
      style: {
        display: 'none',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '3px',
        background: theme
      },
      mounted: function mounted($progressBar) {
        art.on('controls:show', function () {
          $progressBar.style.display = 'none';
        });
        art.on('controls:hide', function () {
          $progressBar.style.display = 'block';
        });
        art.on('video:timeupdate', function () {
          $progressBar.style.width = "".concat(player.played * 100, "%");
        });
      }
    });
    return {
      name: 'miniProgressBar'
    };
  }

  function autoPip(art) {
    var events = art.events,
        player = art.player,
        template = art.template;
    var scrollDebounce = debounce(function () {
      var _template$$player$get = template.$player.getBoundingClientRect(),
          top = _template$$player$get.top,
          height = _template$$player$get.height;

      if (top + height <= 0 && !player.pip && player.playing) {
        player.pip = true;
      } else if (player.pip) {
        player.pip = false;
      }
    }, 300);
    events.proxy(window, 'scroll', scrollDebounce);
  }

  var Plugins =
  /*#__PURE__*/
  function () {
    function Plugins(art) {
      var _this = this;

      classCallCheck(this, Plugins);

      this.art = art;
      this.id = 0;
      var option = art.option;

      if (option.subtitle.url && option.subtitleOffset) {
        this.add(subtitleOffset);
      }

      if (!option.isLive && option.miniProgressBar) {
        this.add(miniProgressBar);
      }

      if (option.localPreview) {
        this.add(localPreview);
      }

      if (option.autoPip) {
        this.add(autoPip);
      }

      art.option.plugins.forEach(function (plugin) {
        _this.add(plugin);
      });
    }

    createClass(Plugins, [{
      key: "add",
      value: function add(plugin) {
        this.id += 1;
        var result = plugin.call(this, this.art);
        var pluginName = '';

        if (result && result.name) {
          pluginName = result.name;
        } else if (plugin.name) {
          pluginName = plugin.name;
        } else {
          pluginName = "plugin".concat(this.id);
        }

        errorHandle(!hasOwnProperty(this, pluginName), "Cannot add a plugin that already has the same name: ".concat(pluginName));
        Object.defineProperty(this, pluginName, {
          value: result
        });
        this.art.emit('plugin:add', plugin);
        return this;
      }
    }]);

    return Plugins;
  }();

  var Mobile = function Mobile(art) {
    classCallCheck(this, Mobile);

    var option = art.option,
        proxy = art.events.proxy,
        $video = art.template.$video;
    config.video.events.forEach(function (eventName) {
      proxy($video, eventName, function (event) {
        art.emit("video:".concat(event.type), event);
      });
    });
    Object.keys(option.moreVideoAttr).forEach(function (key) {
      $video[key] = option.moreVideoAttr[key];
    });

    if (option.muted) {
      $video.muted = option.muted;
    }

    if (option.volume) {
      $video.volume = clamp(option.volume, 0, 1);
    }

    if (option.poster) {
      $video.poster = option.poster;
    }

    if (option.autoplay) {
      $video.autoplay = option.autoplay;
    }

    $video.controls = true;
    var typeName = option.type || getExt(option.url);
    var typeCallback = option.customType[typeName];

    if (typeName && typeCallback) {
      art.emit('beforeCustomType', typeName);
      typeCallback($video, option.url, art);
      art.emit('afterCustomType', typeName);
    } else {
      art.emit('beforeAttachUrl', option.url);
      $video.src = option.url;
      art.emit('afterAttachUrl', $video.src);
    }
  };

  var id = 0;

  var Artplayer =
  /*#__PURE__*/
  function (_Emitter) {
    inherits(Artplayer, _Emitter);

    function Artplayer(option) {
      var _this;

      classCallCheck(this, Artplayer);

      _this = possibleConstructorReturn(this, getPrototypeOf(Artplayer).call(this));
      _this.option = optionValidator(mergeDeep(Artplayer.option, option), scheme);
      _this.isFocus = false;
      _this.isDestroy = false;
      _this.whitelist = new Whitelist(assertThisInitialized(_this));
      _this.template = new Template(assertThisInitialized(_this));
      _this.events = new Events(assertThisInitialized(_this));

      if (_this.whitelist.state) {
        _this.storage = new Storage(assertThisInitialized(_this));
        _this.icons = new Icons(assertThisInitialized(_this));
        _this.i18n = new I18n(assertThisInitialized(_this));
        _this.notice = new Notice(assertThisInitialized(_this));
        _this.player = new Player(assertThisInitialized(_this));
        _this.layers = new Layers(assertThisInitialized(_this));
        _this.controls = new Controls(assertThisInitialized(_this));
        _this.contextmenu = new Contextmenu(assertThisInitialized(_this));
        _this.subtitle = new Subtitle(assertThisInitialized(_this));
        _this.info = new Info(assertThisInitialized(_this));
        _this.loading = new Loading(assertThisInitialized(_this));
        _this.hotkey = new Hotkey(assertThisInitialized(_this));
        _this.mask = new Mask(assertThisInitialized(_this));
        _this.setting = new Setting(assertThisInitialized(_this));
        _this.plugins = new Plugins(assertThisInitialized(_this));
      } else {
        _this.mobile = new Mobile(assertThisInitialized(_this));
      }

      id += 1;
      _this.id = id;
      Artplayer.instances.push(assertThisInitialized(_this)); // eslint-disable-next-line no-console

      console.log('%c ArtPlayer %c 3.1.14 %c https://artplayer.org', 'color: #fff; background: #5f5f5f', 'color: #fff; background: #4bc729', '');
      return _this;
    }

    createClass(Artplayer, [{
      key: "destroy",
      value: function destroy() {
        var removeHtml = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this.events.destroy();
        this.template.destroy(removeHtml);
        Artplayer.instances.splice(Artplayer.instances.indexOf(this), 1);
        this.isDestroy = true;
        this.emit('destroy');
      }
    }], [{
      key: "version",
      get: function get() {
        return '3.1.14';
      }
    }, {
      key: "env",
      get: function get() {
        return '"development"';
      }
    }, {
      key: "config",
      get: function get() {
        return config;
      }
    }, {
      key: "utils",
      get: function get() {
        return utils;
      }
    }, {
      key: "scheme",
      get: function get() {
        return scheme;
      }
    }, {
      key: "Emitter",
      get: function get() {
        return Emitter;
      }
    }, {
      key: "validator",
      get: function get() {
        return optionValidator;
      }
    }, {
      key: "kindOf",
      get: function get() {
        return optionValidator.kindOf;
      }
    }, {
      key: "option",
      get: function get() {
        return {
          container: '#artplayer',
          url: '',
          poster: '',
          title: '',
          theme: '#f00',
          volume: 0.7,
          isLive: false,
          muted: false,
          autoplay: false,
          autoSize: false,
          loop: false,
          flip: false,
          playbackRate: false,
          aspectRatio: false,
          screenshot: false,
          setting: false,
          hotkey: true,
          pip: false,
          mutex: true,
          fullscreen: false,
          fullscreenWeb: false,
          subtitleOffset: false,
          miniProgressBar: false,
          localPreview: false,
          autoPip: false,
          layers: [],
          contextmenu: [],
          quality: [],
          controls: [],
          highlight: [],
          plugins: [],
          whitelist: [],
          thumbnails: {
            url: '',
            number: 60,
            width: 160,
            height: 90,
            column: 10
          },
          subtitle: {
            url: '',
            style: {}
          },
          moreVideoAttr: {
            controls: false,
            preload: 'auto'
          },
          icons: {},
          customType: {},
          lang: navigator.language.toLowerCase()
        };
      }
    }]);

    return Artplayer;
  }(Emitter);

  Object.defineProperty(Artplayer, 'instances', {
    value: []
  });

  return Artplayer;

}));
//# sourceMappingURL=artplayer.js.map
