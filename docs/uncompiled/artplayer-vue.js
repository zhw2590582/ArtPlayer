(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ArtplayerVue = factory());
}(this, (function () { 'use strict';

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
  !function(r,t){module.exports=t();}(commonjsGlobal,function(){function e(r){return (e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(r)}var n=Object.prototype.toString,c=function(r){if(void 0===r)return "undefined";if(null===r)return "null";var t=e(r);if("boolean"===t)return "boolean";if("string"===t)return "string";if("number"===t)return "number";if("symbol"===t)return "symbol";if("function"===t)return function(r){return "GeneratorFunction"===o(r)}(r)?"generatorfunction":"function";if(function(r){return Array.isArray?Array.isArray(r):r instanceof Array}(r))return "array";if(function(r){if(r.constructor&&"function"==typeof r.constructor.isBuffer)return r.constructor.isBuffer(r);return !1}(r))return "buffer";if(function(r){try{if("number"==typeof r.length&&"function"==typeof r.callee)return !0}catch(r){if(-1!==r.message.indexOf("callee"))return !0}return !1}(r))return "arguments";if(function(r){return r instanceof Date||"function"==typeof r.toDateString&&"function"==typeof r.getDate&&"function"==typeof r.setDate}(r))return "date";if(function(r){return r instanceof Error||"string"==typeof r.message&&r.constructor&&"number"==typeof r.constructor.stackTraceLimit}(r))return "error";if(function(r){return r instanceof RegExp||"string"==typeof r.flags&&"boolean"==typeof r.ignoreCase&&"boolean"==typeof r.multiline&&"boolean"==typeof r.global}(r))return "regexp";switch(o(r)){case"Symbol":return "symbol";case"Promise":return "promise";case"WeakMap":return "weakmap";case"WeakSet":return "weakset";case"Map":return "map";case"Set":return "set";case"Int8Array":return "int8array";case"Uint8Array":return "uint8array";case"Uint8ClampedArray":return "uint8clampedarray";case"Int16Array":return "int16array";case"Uint16Array":return "uint16array";case"Int32Array":return "int32array";case"Uint32Array":return "uint32array";case"Float32Array":return "float32array";case"Float64Array":return "float64array"}if(function(r){return "function"==typeof r.throw&&"function"==typeof r.return&&"function"==typeof r.next}(r))return "generator";switch(t=n.call(r)){case"[object Object]":return "object";case"[object Map Iterator]":return "mapiterator";case"[object Set Iterator]":return "setiterator";case"[object String Iterator]":return "stringiterator";case"[object Array Iterator]":return "arrayiterator"}return t.slice(8,-1).toLowerCase().replace(/\s/g,"")};function o(r){return r.constructor?r.constructor.name:null}function f(r,t){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:["option"];return s(r,t,e),y(r,t,e),function(a,i,u){var r=c(i),t=c(a);if("object"===r){if("object"!==t)throw new Error("[Type Error]: '".concat(u.join("."),"' require 'object' type, but got '").concat(t,"'"));Object.keys(i).forEach(function(r){var t=a[r],e=i[r],n=u.slice();n.push(r),s(t,e,n),y(t,e,n),f(t,e,n);});}if("array"===r){if("array"!==t)throw new Error("[Type Error]: '".concat(u.join("."),"' require 'array' type, but got '").concat(t,"'"));a.forEach(function(r,t){var e=a[t],n=i[t]||i[0],o=u.slice();o.push(t),s(e,n,o),y(e,n,o),f(e,n,o);});}}(r,t,e),r}function s(r,t,e){if("string"===c(t)){var n=c(r);if(!(-1<t.indexOf("|")?t.split("|").map(function(r){return r.toLowerCase().trim()}).filter(Boolean).some(function(r){return n===r}):t.toLowerCase().trim()===n))throw new Error("[Type Error]: '".concat(e.join("."),"' require '").concat(t,"' type, but got '").concat(n,"'"))}}function y(r,t,e){if("function"===c(t)){var n=t(r,c(r),e);if(!0!==n){var o=c(n);throw "string"===o?new Error(n):"error"===o?n:new Error("[Validator Error]: The scheme for '".concat(e.join("."),"' validator require return true, but got '").concat(n,"'"))}}}return f.kindOf=c,f});
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

  function query(selector) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return parent.querySelector(selector);
  }
  function queryAll(selector) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
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
      return removeClass(item, className);
    });
    addClass(target, className);
  }
  function tooltip(target, msg) {
    var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'up';
    target.setAttribute('aria-label', msg);
    target.setAttribute('data-balloon-pos', pos);
  }

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

  function srtToVtt(srtText) {
    return 'WEBVTT \r\n\r\n'.concat(srtText.replace(/{[\s\S]*?}/g, '').replace(/\{\\([ibu])\}/g, '</$1>').replace(/\{\\([ibu])1\}/g, '<$1>').replace(/\{([ibu])\}/g, '<$1>').replace(/\{\/([ibu])\}/g, '</$1>').replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2').concat('\r\n\r\n'));
  }
  function vttToBlob(vttText) {
    return URL.createObjectURL(new Blob([vttText], {
      type: 'text/vtt'
    }));
  }
  function assToVtt(ass) {
    var reAss = new RegExp('Dialogue:\\s\\d,' + '(\\d+:\\d\\d:\\d\\d.\\d\\d),' + '(\\d+:\\d\\d:\\d\\d.\\d\\d),' + '([^,]*),' + '([^,]*),' + '(?:[^,]*,){4}' + '([\\s\\S]*)$', 'i');

    function fixTime() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return time.split(/[:.]/).map(function (item, index, arr) {
        if (index === arr.length - 1) {
          if (item.length === 1) {
            return ".".concat(item, "00");
          }

          if (item.length === 2) {
            return ".".concat(item, "0");
          }
        } else if (item.length === 1) {
          return (index === 0 ? '0' : ':0') + item;
        } // eslint-disable-next-line no-nested-ternary


        return index === 0 ? item : index === arr.length - 1 ? ".".concat(item) : ":".concat(item);
      }).join('');
    }

    return "WEBVTT\n\n".concat(ass.split(/\r?\n/).map(function (line) {
      var m = line.match(reAss);
      if (!m) return null;
      return {
        start: fixTime(m[1].trim()),
        end: fixTime(m[2].trim()),
        text: m[5].replace(/{[\s\S]*?}/g, '').replace(/(\\N)/g, '\n').trim().split(/\r?\n/).map(function (item) {
          return item.trim();
        }).join('\n')
      };
    }).filter(function (line) {
      return line;
    }).map(function (line, index) {
      if (line) {
        return "".concat(index + 1, "\n").concat(line.start, " --> ").concat(line.end, "\n").concat(line.text);
      }

      return '';
    }).filter(function (line) {
      return line.trim();
    }).join('\n\n'));
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
  function downloadFile(url, name) {
    var elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }

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

  var def = Object.defineProperty;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function has(obj, name) {
    return hasOwnProperty.call(obj, name);
  }
  function proxyPropertys(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    return sources.reduce(function (result, source) {
      Object.getOwnPropertyNames(source).forEach(function (key) {
        errorHandle(!has(result, key), "Target attribute name is duplicated: ".concat(key));
        def(result, key, Object.getOwnPropertyDescriptor(source, key));
      });
      return result;
    }, target);
  }
  function mergeDeep() {
    var isObject = function isObject(item) {
      return item && _typeof_1(item) === 'object' && !Array.isArray(item);
    };

    for (var _len2 = arguments.length, objects = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      objects[_key2] = arguments[_key2];
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

  function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
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



  var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    query: query,
    queryAll: queryAll,
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    append: append,
    remove: remove,
    setStyle: setStyle,
    setStyles: setStyles,
    getStyle: getStyle,
    sublings: sublings,
    inverseClass: inverseClass,
    tooltip: tooltip,
    ArtPlayerError: ArtPlayerError,
    errorHandle: errorHandle,
    srtToVtt: srtToVtt,
    vttToBlob: vttToBlob,
    assToVtt: assToVtt,
    getExt: getExt,
    downloadFile: downloadFile,
    def: def,
    has: has,
    proxyPropertys: proxyPropertys,
    mergeDeep: mergeDeep,
    sleep: sleep,
    debounce: debounce,
    throttle: throttle,
    clamp: clamp,
    secondToTime: secondToTime
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
    localVideo: 'boolean',
    localSubtitle: 'boolean',
    autoPip: 'boolean',
    networkMonitor: 'boolean',
    plugins: ['function'],
    whitelist: ['string|function|regexp'],
    layers: [{
      disable: 'boolean|undefined',
      name: 'string|undefined',
      index: 'number|undefined',
      html: validElement,
      style: 'object|undefined',
      click: 'function|undefined',
      mounted: 'function|undefined',
      tooltip: 'string|undefined'
    }],
    contextmenu: [{
      disable: 'boolean|undefined',
      name: 'string|undefined',
      index: 'number|undefined',
      html: validElement,
      style: 'object|undefined',
      click: 'function|undefined',
      mounted: 'function|undefined',
      tooltip: 'string|undefined'
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
      tooltip: 'string|undefined',
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

  var video = {
    propertys: ['audioTracks', 'autoplay', 'buffered', 'controller', 'controls', 'crossOrigin', 'currentSrc', 'currentTime', 'defaultMuted', 'defaultPlaybackRate', 'duration', 'ended', 'error', 'loop', 'mediaGroup', 'muted', 'networkState', 'paused', 'playbackRate', 'played', 'preload', 'readyState', 'seekable', 'seeking', 'src', 'startDate', 'textTracks', 'videoTracks', 'volume'],
    methods: ['addTextTrack', 'canPlayType', 'load', 'play', 'pause'],
    events: ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']
  };

  var config = {
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
        this.$container = query(art.option.container);
        errorHandle(this.$container, "No container element found by ".concat(art.option.container));
      }

      errorHandle(art.constructor.instances.every(function (art) {
        return art.template.$container !== _this.$container;
      }), 'Cannot mount multiple instances on the same dom element');
      errorHandle(this.$container.clientWidth && this.$container.clientHeight, 'The width and height of the container cannot be 0');

      if (art.whitelist.state) {
        this.initDesktop();
      } else {
        this.initMobile();
      }
    }

    createClass(Template, [{
      key: "query",
      value: function query$1(className) {
        return query(className, this.$container);
      }
    }, {
      key: "initDesktop",
      value: function initDesktop() {
        this.$container.innerHTML = "\n<div class=\"art-video-player art-subtitle-show art-layer-show\" style=\"--theme: ".concat(this.art.option.theme, "\">\n  <video class=\"art-video\">\n    <track default kind=\"metadata\"></track>\n  </video>\n  <div class=\"art-subtitle\"></div>\n  <div class=\"art-danmuku\"></div>\n  <div class=\"art-layers\"></div>\n  <div class=\"art-mask\">\n    <div class=\"art-state\"></div>\n  </div>\n  <div class=\"art-bottom\">\n    <div class=\"art-progress\"></div>\n    <div class=\"art-controls\">\n      <div class=\"art-controls-left\"></div>\n      <div class=\"art-controls-right\"></div>\n    </div>\n  </div>\n  <div class=\"art-loading\"></div>\n  <div class=\"art-notice\">\n    <div class=\"art-notice-inner\"></div>\n  </div>\n  <div class=\"art-settings\">\n    <div class=\"art-setting-inner art-backdrop-filter\">\n      <div class=\"art-setting-body\"></div>\n    </div>\n  </div>\n  <div class=\"art-info art-backdrop-filter\">\n    <div class=\"art-info-panel\">\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Player version:</div>\n        <div class=\"art-info-content\">3.1.20</div>\n      </div>\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video url:</div>\n        <div class=\"art-info-content\" data-video=\"src\"></div>\n      </div>\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video volume:</div>\n        <div class=\"art-info-content\" data-video=\"volume\"></div>\n      </div>\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video time:</div>\n        <div class=\"art-info-content\" data-video=\"currentTime\"></div>\n      </div>\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video duration:</div>\n        <div class=\"art-info-content\" data-video=\"duration\"></div>\n      </div>\n      <div class=\"art-info-item\">\n        <div class=\"art-info-title\">Video resolution:</div>\n        <div class=\"art-info-content\">\n          <span data-video=\"videoWidth\"></span> x <span data-video=\"videoHeight\"></span>\n        </div>\n      </div>\n    </div>\n    <div class=\"art-info-close\">[x]</div>\n  </div>\n  <div class=\"art-pip-header\">\n    <div class=\"art-pip-title\"></div>\n    <div class=\"art-pip-close\">\xD7</div>\n  </div>\n  <div class=\"art-contextmenus art-backdrop-filter\"></div>\n</div>\n        ");
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
        this.$track = this.query('.art-video track');
        this.$subtitle = this.query('.art-subtitle');
        this.$danmuku = this.query('.art-danmuku');
        this.$bottom = this.query('.art-bottom');
        this.$progress = this.query('.art-progress');
        this.$controls = this.query('.art-controls');
        this.$controlsLeft = this.query('.art-controls-left');
        this.$controlsRight = this.query('.art-controls-right');
        this.$layer = this.query('.art-layers');
        this.$loading = this.query('.art-loading');
        this.$notice = this.query('.art-notice');
        this.$noticeInner = this.query('.art-notice-inner');
        this.$mask = this.query('.art-mask');
        this.$state = this.query('.art-state');
        this.$setting = this.query('.art-settings');
        this.$settingInner = this.query('.art-setting-inner');
        this.$settingBody = this.query('.art-setting-body');
        this.$info = this.query('.art-info');
        this.$infoPanel = this.query('.art-info-panel');
        this.$infoClose = this.query('.art-info-close');
        this.$pipHeader = this.query('.art-pip-header');
        this.$pipTitle = this.query('.art-pip-title');
        this.$pipClose = this.query('.art-pip-close');
        this.$contextmenu = this.query('.art-contextmenus');
      }
    }, {
      key: "initMobile",
      value: function initMobile() {
        this.$container.innerHTML = "\n<div class=\"art-video-player\">\n  <video class=\"art-video\"></video>\n</div>\n        ";
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
      }
    }, {
      key: "destroy",
      value: function destroy(removeHtml) {
        if (removeHtml) {
          this.$container.innerHTML = '';
        } else {
          addClass(this.$player, 'art-destroy');
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
  var Open = "打开";
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
  	Open: Open,
  	"Switch video": "切换",
  	"Switch subtitle": "切换字幕",
  	Fullscreen: Fullscreen,
  	"Exit fullscreen": "退出全屏",
  	"Web fullscreen": "网页全屏",
  	"Exit web fullscreen": "退出网页全屏",
  	"Mini player": "迷你播放器",
  	"Does not support fullscreen": "不支持全屏",
  	"Local Subtitle": "本地字幕",
  	"Local Video": "本地视频",
  	"Subtitle offset time": "字幕偏移时间",
  	"No subtitles found": "未发现字幕"
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
  var Open$1 = "打開";
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
  	"Hide danmu": "隱藏彈幕",
  	"Show danmu": "顯示彈幕",
  	"Show setting": "顯示设置",
  	"Hide setting": "隱藏设置",
  	Screenshot: Screenshot$1,
  	"Play speed": "播放速度",
  	"Aspect ratio": "畫面比例",
  	Default: Default$1,
  	Normal: Normal$1,
  	Open: Open$1,
  	"Switch video": "切換",
  	"Switch subtitle": "切換字幕",
  	Fullscreen: Fullscreen$1,
  	"Exit fullscreen": "退出全屏",
  	"Web fullscreen": "網頁全屏",
  	"Exit web fullscreen": "退出網頁全屏",
  	"Mini player": "迷你播放器",
  	"Does not support fullscreen": "不支持全屏",
  	"Local Subtitle": "本地字幕",
  	"Local Video": "本地視頻",
  	"Subtitle offset time": "字幕偏移時間",
  	"No subtitles found": "未發現字幕"
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
    def(player, 'url', {
      get: function get() {
        return $video.src;
      },
      set: function set() {
        errorHandle(false, 'You should use this method: art.attachUrl()');
      }
    });
    def(player, 'attachUrl', {
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

    $video.controls = false;
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
    });
    art.once('video:canplay', function () {
      art.emit('ready');
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
        addClass($player, 'art-error');
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
    def(player, 'play', {
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
    def(player, 'pause', {
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
    def(player, 'toggle', {
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
    def(player, 'seek', {
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
    def(player, 'volume', {
      get: function get() {
        return $video.volume || 0;
      },
      set: function set(percentage) {
        $video.volume = clamp(percentage, 0, 1);
        notice.show("".concat(i18n.get('Volume'), ": ").concat(parseInt($video.volume * 100, 10)));

        if ($video.volume !== 0) {
          storage.set('volume', $video.volume);
        }

        art.emit('volume', $video.volume);
      }
    });
    def(player, 'muted', {
      get: function get() {
        return $video.muted;
      },
      set: function set(muted) {
        $video.muted = muted;
        art.emit('volume', $video.volume);
      }
    });
  }

  function currentTimeMix(art, player) {
    def(player, 'currentTime', {
      get: function get() {
        return art.template.$video.currentTime || 0;
      },
      set: function set(currentTime) {
        art.template.$video.currentTime = clamp(currentTime, 0, player.duration);
      }
    });
  }

  function durationMix(art, player) {
    def(player, 'duration', {
      get: function get() {
        return art.template.$video.duration || 0;
      }
    });
  }

  function switchMix(art, player) {
    var i18n = art.i18n,
        notice = art.notice,
        option = art.option;
    def(player, 'switchQuality', {
      value: function value(url, name) {
        if (url !== player.url) {
          URL.revokeObjectURL(player.url);
          var currentTime = player.currentTime,
              playing = player.playing;
          return player.attachUrl(url).then(function () {
            option.url = url;
            player.playbackRate = false;
            player.aspectRatio = false;
            art.on('ready', function () {
              player.currentTime = currentTime;
            });

            if (playing) {
              player.play = true;
            }

            if (name) {
              notice.show("".concat(i18n.get('Switch video'), ": ").concat(name));
            }

            art.emit('switch', url);
          });
        }

        return null;
      }
    });
    def(player, 'switchUrl', {
      value: function value(url, name) {
        if (url !== player.url) {
          URL.revokeObjectURL(player.url);
          var playing = player.playing;
          return player.attachUrl(url).then(function () {
            option.url = url;
            player.playbackRate = false;
            player.aspectRatio = false;
            art.on('ready', function () {
              player.currentTime = 0;
            });

            if (playing) {
              player.play = true;
            }

            if (name) {
              notice.show("".concat(i18n.get('Switch video'), ": ").concat(name));
            }

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
    def(player, 'playbackRate', {
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
    def(player, 'playbackRateReset', {
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
    def(player, 'aspectRatio', {
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
    def(player, 'aspectRatioReset', {
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
    def(player, 'getScreenshotDataURL', {
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
    def(player, 'getScreenshotBlobUrl', {
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
    def(player, 'screenshot', {
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
      art.emit('fullscreenChange', screenfull.isFullscreen);
    };

    var screenfullError = function screenfullError() {
      notice.show(i18n.get('Does not support fullscreen'));
    };

    if (player.fullscreenIsEnabled) {
      screenfull.on('change', screenfullChange);
      screenfull.on('error', screenfullError);
      destroyEvents.push(function () {
        screenfull.off('change', screenfullChange);
        screenfull.off('error', screenfullError);
      });
    }

    def(player, 'fullscreen', {
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
            addClass($player, 'art-fullscreen');
            player.aspectRatioReset = true;
            art.emit('fullscreenEnabled');
          });
        } else {
          if (player.fullscreenWeb) {
            player.fullscreenWeb = false;
          }

          screenfull.exit().then(function () {
            removeClass($player, 'art-fullscreen');
            player.aspectRatioReset = true;
            art.emit('fullscreenExit');
          });
        }
      }
    });
    def(player, 'fullscreenToggle', {
      set: function set(value) {
        if (value) {
          player.fullscreen = !player.fullscreen;
        }
      }
    });
    def(player, 'fullscreenIsEnabled', {
      get: function get() {
        return screenfull.isEnabled;
      }
    });
  }

  function fullscreenWebMix(art, player) {
    var $player = art.template.$player;
    def(player, 'fullscreenWeb', {
      get: function get() {
        return hasClass($player, 'art-web-fullscreen');
      },
      set: function set(value) {
        if (value) {
          if (player.fullscreen) {
            player.fullscreen = false;
          }

          addClass($player, 'art-web-fullscreen');
          player.aspectRatioReset = true;
          art.emit('fullscreenWebEnabled');
        } else {
          if (player.fullscreen) {
            player.fullscreen = false;
          }

          removeClass($player, 'art-web-fullscreen');
          player.aspectRatioReset = true;
          art.emit('fullscreenWebExit');
        }
      }
    });
    def(player, 'fullscreenWebToggle', {
      set: function set(value) {
        if (value) {
          player.fullscreenWeb = !player.fullscreenWeb;
        }
      }
    });
  }

  function nativePip(art, player) {
    var $video = art.template.$video,
        proxy = art.events.proxy,
        notice = art.notice;
    $video.disablePictureInPicture = false;
    def(player, 'pip', {
      get: function get() {
        return document.pictureInPictureElement;
      },
      set: function set(value) {
        if (value) {
          $video.requestPictureInPicture().catch(function (error) {
            notice.show(error);
            throw error;
          });
        } else {
          document.exitPictureInPicture().catch(function (error) {
            notice.show(error);
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
    def(player, 'pip', {
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
        addClass($player, 'art-is-dragging');
        setStyle($player, 'left', "".concat(lastPlayerLeft + event.pageX - lastPageX, "px"));
        setStyle($player, 'top', "".concat(lastPlayerTop + event.pageY - lastPageY, "px"));
      }
    });
    proxy(document, 'mouseup', function () {
      isDroging = false;
      removeClass($player, 'art-is-dragging');
    });
    proxy($pipClose, 'click', function () {
      player.pip = false;
      isDroging = false;
      removeClass($player, 'art-is-dragging');
    });
    append($pipTitle, option.title || i18n.get('Mini player'));
    var property = {
      get: function get() {
        return hasClass($player, 'art-pip');
      },
      set: function set(value) {
        if (value) {
          player.autoSize = false;
          cacheStyle = $player.style.cssText;
          addClass($player, 'art-pip');
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
          removeClass($player, 'art-pip');
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
    };
    def(player, 'pip', property);
  }

  function pipMix(art, player) {
    var $video = art.template.$video;

    if (document.pictureInPictureEnabled) {
      nativePip(art, player);
    } else if ($video.webkitSupportsPresentationMode) {
      webkitPip(art, player);
    } else {
      customPip(art, player);
    }

    def(player, 'pipToggle', {
      set: function set(value) {
        if (value) {
          player.pip = !player.pip;
        }
      }
    });
  }

  function seekMix$1(art, player) {
    var $video = art.template.$video;
    def(player, 'loaded', {
      get: function get() {
        return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) / $video.duration : 0;
      }
    });
    def(player, 'loadedTime', {
      get: function get() {
        return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0;
      }
    });
  }

  function seekMix$2(art, player) {
    def(player, 'played', {
      get: function get() {
        return art.template.$video.currentTime / art.template.$video.duration;
      }
    });
  }

  function playingMix(art, player) {
    var $video = art.template.$video;
    def(player, 'playing', {
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
    def(player, 'autoSize', {
      get: function get() {
        return hasClass($container, 'art-auto-size');
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
          addClass($container, 'art-auto-size');

          if (containerRatio > videoRatio) {
            var percentage = height * videoRatio / width * 100;
            setStyle($player, 'width', "".concat(percentage, "%"));
            setStyle($player, 'height', '100%');
          } else {
            var _percentage = width / videoRatio / height * 100;

            setStyle($player, 'width', '100%');
            setStyle($player, 'height', "".concat(_percentage, "%"));
          }

          art.emit('autoSizeChange', {
            width: player.width,
            height: player.height
          });
        } else {
          removeClass($container, 'art-auto-size');
          setStyle($player, 'width', null);
          setStyle($player, 'height', null);
          art.emit('autoSizeRemove');
        }
      }
    });
  }

  function rectMix(art, player) {
    def(player, 'rect', {
      get: function get() {
        return art.template.$player.getBoundingClientRect();
      }
    });
    ['bottom', 'height', 'left', 'right', 'top', 'width'].forEach(function (key) {
      def(player, key, {
        get: function get() {
          return player.rect[key];
        }
      });
    });
    def(player, 'x', {
      get: function get() {
        return player.left + window.pageXOffset;
      }
    });
    def(player, 'y', {
      get: function get() {
        return player.top + window.pageYOffset;
      }
    });
  }

  function flipMix(art, player) {
    def(player, 'flip', {
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

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  var superPropBase = _superPropBase;

  var get = createCommonjsModule(function (module) {
  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      module.exports = _get = Reflect.get;
    } else {
      module.exports = _get = function _get(target, property, receiver) {
        var base = superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  module.exports = _get;
  });

  var Component =
  /*#__PURE__*/
  function () {
    function Component(art) {
      classCallCheck(this, Component);

      this.id = 0;
      this.art = art;
      this.add = this.add.bind(this);
      this.name = this.constructor.name.toLowerCase();
    }

    createClass(Component, [{
      key: "toggle",
      value: function toggle() {
        this.show = !this.show;
      }
    }, {
      key: "add",
      value: function add(getOption, callback) {
        var _this = this;

        var option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        if (!this.$parent || option.disable) return {};
        this.id += 1;
        var name = option.name || "".concat(this.name).concat(this.id);
        errorHandle(!has(this, name), "Cannot add a component that already has the same name: ".concat(name));
        var $ref = document.createElement('div');
        $ref.classList.value = "art-".concat(this.name, " art-").concat(this.name, "-").concat(name);

        if (option.html) {
          append($ref, option.html);
        }

        if (option.style) {
          setStyles($ref, option.style);
        }

        if (option.tooltip) {
          tooltip($ref, option.tooltip);
        }

        var childs = Array.from(this.$parent.children);
        $ref.dataset.index = option.index || this.id;
        var nextChild = childs.find(function (item) {
          return Number(item.dataset.index) >= Number($ref.dataset.index);
        });

        if (nextChild) {
          nextChild.insertAdjacentElement('beforebegin', $ref);
        } else {
          append(this.$parent, $ref);
        }

        if (option.click) {
          this.art.events.proxy($ref, 'click', function (event) {
            event.preventDefault();
            option.click.call(_this.art, _this, event);
          });
        }

        if (option.mounted) {
          option.mounted($ref, this, this.art);
        }

        if (callback) {
          callback($ref, this, this.art);
        }

        def(this, name, {
          value: {
            get $ref() {
              return $ref;
            },

            set show(value) {
              if (value) {
                setStyle($ref, 'display', 'block');
              } else {
                setStyle($ref, 'display', 'none');
              }
            }

          }
        });
        this.art.emit("".concat(this.name, ":add"), option);
        return this[name];
      }
    }, {
      key: "show",
      get: function get() {
        return hasClass(this.art.template.$player, "art-".concat(this.name, "-show"));
      },
      set: function set(value) {
        errorHandle(value === false || value === true, 'The show attribute expects a boolean value');
        var $player = this.art.template.$player;
        var className = "art-".concat(this.name, "-show");

        if (value) {
          addClass($player, className);
        } else {
          removeClass($player, className);
        }

        this.art.emit("".concat(this.name, ":toggle"), value);
      }
    }]);

    return Component;
  }();

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function fullscreen(option) {
    return function (art) {
      return _objectSpread({}, option, {
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
          art.on('fullscreenEnabled', function () {
            setStyle($fullscreen, 'opacity', '0.8');
            tooltip($fullscreen, i18n.get('Exit fullscreen'));
          });
          art.on('fullscreenExit', function () {
            setStyle($fullscreen, 'opacity', '1');
            tooltip($fullscreen, i18n.get('Fullscreen'));
          });
        }
      });
    };
  }

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function fullscreenWeb(option) {
    return function (art) {
      return _objectSpread$1({}, option, {
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
          art.on('fullscreenWebEnabled', function () {
            setStyle($fullscreenWeb, 'opacity', '0.8');
            tooltip($fullscreenWeb, i18n.get('Exit web fullscreen'));
          });
          art.on('fullscreenWebExit', function () {
            setStyle($fullscreenWeb, 'opacity', '1');
            tooltip($fullscreenWeb, i18n.get('Web fullscreen'));
          });
        }
      });
    };
  }

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function pip(option) {
    return function (art) {
      return _objectSpread$2({}, option, {
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
  function playAndPause(option) {
    return function (art) {
      return _objectSpread$3({}, option, {
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
  function progress(option) {
    return function (art) {
      var _art$option = art.option,
          highlight = _art$option.highlight,
          theme = _art$option.theme,
          proxy = art.events.proxy,
          player = art.player;
      return _objectSpread$4({}, option, {
        html: "\n<div class=\"art-control-progress-inner\">\n    <div class=\"art-progress-loaded\"></div>\n    <div class=\"art-progress-played\" style=\"background: ".concat(theme, "\"></div>\n    <div class=\"art-progress-highlight\"></div>\n    <div class=\"art-progress-indicator\" style=\"background: ").concat(theme, "\"></div>\n    <div class=\"art-progress-tip art-tip\"></div>\n</div>\n            "),
        mounted: function mounted($control) {
          var isDroging = false;
          var $loaded = query('.art-progress-loaded', $control);
          var $played = query('.art-progress-played', $control);
          var $highlight = query('.art-progress-highlight', $control);
          var $indicator = query('.art-progress-indicator', $control);
          var $tip = query('.art-progress-tip', $control);

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

              addClass($indicator, 'art-show-indicator');
              setBar('played', percentage);
              player.seek = second;
            }
          });
          proxy(document, 'mouseup', function () {
            if (isDroging) {
              isDroging = false;
              removeClass($indicator, 'art-show-indicator');
            }
          });
        }
      });
    };
  }

  function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function subtitle(option) {
    return function (art) {
      return _objectSpread$5({}, option, {
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
          art.on('subtitle:toggle', function (value) {
            if (value) {
              setStyle($subtitle, 'opacity', '1');
              tooltip($subtitle, i18n.get('Hide subtitle'));
            } else {
              setStyle($subtitle, 'opacity', '0.8');
              tooltip($subtitle, i18n.get('Show subtitle'));
            }
          });
        }
      });
    };
  }

  function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function time(option) {
    return function (art) {
      return _objectSpread$6({}, option, {
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
  function volume(option) {
    return function (art) {
      return _objectSpread$7({}, option, {
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
          proxy(document, 'mousemove', function (event) {
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
  function setting(option) {
    return function (art) {
      return _objectSpread$8({}, option, {
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
          art.on('setting:toggle', function (value) {
            if (value) {
              setStyle($setting, 'opacity', '0.8');
              tooltip($setting, i18n.get('Hide setting'));
            } else {
              setStyle($setting, 'opacity', '1');
              tooltip($setting, i18n.get('Show setting'));
            }
          });
        }
      });
    };
  }

  function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$9(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$9(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function thumbnails(option) {
    return function (art) {
      return _objectSpread$9({}, option, {
        mounted: function mounted($control) {
          var thumbnails = art.option.thumbnails,
              $progress = art.template.$progress,
              _art$events = art.events,
              proxy = _art$events.proxy,
              loadImg = _art$events.loadImg;
          var loading = false;
          var isLoad = false;

          function showThumbnails(event) {
            var _getPosFromEvent = getPosFromEvent(art, event),
                posWidth = _getPosFromEvent.width;

            var url = thumbnails.url,
                height = thumbnails.height,
                width = thumbnails.width,
                number = thumbnails.number,
                column = thumbnails.column;
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
              loadImg(thumbnails.url).then(function () {
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
  function screenshot(option) {
    return function (art) {
      return _objectSpread$a({}, option, {
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
  function quality(option) {
    return function (art) {
      return _objectSpread$b({}, option, {
        mounted: function mounted($control) {
          var quality = art.option.quality,
              _art$events = art.events,
              proxy = _art$events.proxy,
              hover = _art$events.hover,
              player = art.player;
          var playIndex = -1;
          var defaultQuality = quality.find(function (item) {
            return item.default;
          }) || quality[0];
          playIndex = quality.indexOf(defaultQuality);
          var $qualityName = append($control, "<div class=\"art-quality-name\">".concat(defaultQuality.name, "</div>"));
          var qualityList = quality.map(function (item, index) {
            return "<div class=\"art-quality-item\" data-index=\"".concat(index, "\">").concat(item.name, "</div>");
          }).join('');
          var $qualitys = append($control, "<div class=\"art-qualitys\">".concat(qualityList, "</div>"));
          hover($control, function () {
            $qualitys.style.left = "-".concat(getStyle($qualitys, 'width') / 2 - $control.clientWidth / 2, "px");
          });
          proxy($qualitys, 'click', function (event) {
            var index = Number(event.target.dataset.index);
            var _quality$index = quality[index],
                url = _quality$index.url,
                name = _quality$index.name;

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

  var Control =
  /*#__PURE__*/
  function (_Component) {
    inherits(Control, _Component);

    function Control(art) {
      var _this;

      classCallCheck(this, Control);

      _this = possibleConstructorReturn(this, getPrototypeOf(Control).call(this, art));
      var option = art.option;
      art.on('ready', function () {
        _this.add(progress({
          name: 'progress',
          disable: option.isLive,
          position: 'top',
          index: 10
        }));

        _this.add(thumbnails({
          name: 'thumbnails',
          disable: !option.thumbnails.url || option.isLive,
          position: 'top',
          index: 20
        }));

        _this.add(playAndPause({
          name: 'playAndPause',
          disable: false,
          position: 'left',
          index: 10
        }));

        _this.add(volume({
          name: 'volume',
          disable: false,
          position: 'left',
          index: 20
        }));

        _this.add(time({
          name: 'time',
          disable: option.isLive,
          position: 'left',
          index: 30
        }));

        _this.add(quality({
          name: 'quality',
          disable: option.quality.length === 0,
          position: 'right',
          index: 10
        }));

        _this.add(screenshot({
          name: 'screenshot',
          disable: !option.screenshot,
          position: 'right',
          index: 20
        }));

        _this.add(subtitle({
          name: 'subtitle',
          disable: !option.subtitle.url,
          position: 'right',
          index: 30
        }));

        _this.add(setting({
          name: 'setting',
          disable: !option.setting,
          position: 'right',
          index: 40
        }));

        _this.add(pip({
          name: 'pip',
          disable: !option.pip,
          position: 'right',
          index: 50
        }));

        _this.add(fullscreenWeb({
          name: 'fullscreenWeb',
          disable: !option.fullscreenWeb,
          position: 'right',
          index: 60
        }));

        _this.add(fullscreen({
          name: 'fullscreen',
          disable: !option.fullscreen,
          position: 'right',
          index: 70
        }));

        option.controls.forEach(function (item) {
          _this.add(item);
        });
      });
      return _this;
    }

    createClass(Control, [{
      key: "add",
      value: function add(getOption, callback) {
        var option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        errorHandle(option.position, 'Controls option.position can not be empty');
        var _this$art$template = this.art.template,
            $progress = _this$art$template.$progress,
            $controlsLeft = _this$art$template.$controlsLeft,
            $controlsRight = _this$art$template.$controlsRight;

        switch (option.position) {
          case 'top':
            this.$parent = $progress;
            break;

          case 'left':
            this.$parent = $controlsLeft;
            break;

          case 'right':
            this.$parent = $controlsRight;
            break;
        }

        var control = get(getPrototypeOf(Control.prototype), "add", this).call(this, option, callback);

        if (!option.disable && option.position !== 'top' && !(control.$ref.firstElementChild && control.$ref.firstElementChild.tagName === 'I')) {
          addClass(control.$ref, 'art-control-onlyText');
        }

        return control;
      }
    }]);

    return Control;
  }(Component);

  function ownKeys$c(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$c(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$c(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function playbackRate(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$c({}, option, {
        html: "\n".concat(i18n.get('Play speed'), ":\n<span data-rate=\"0.5\">0.5</span>\n<span data-rate=\"0.75\">0.75</span>\n<span data-rate=\"1.0\" class=\"art-current\">").concat(i18n.get('Normal'), "</span>\n<span data-rate=\"1.25\">1.25</span>\n<span data-rate=\"1.5\">1.5</span>\n<span data-rate=\"2.0\">2.0</span>\n            "),
        click: function click(contextmenu, event) {
          var rate = event.target.dataset.rate;

          if (rate) {
            player.playbackRate = Number(rate);
            contextmenu.show = false;
          }
        },
        mounted: function mounted($menu) {
          art.on('playbackRateChange', function (rate) {
            var $current = queryAll('span', $menu).find(function (item) {
              return Number(item.dataset.rate) === rate;
            });

            if ($current) {
              inverseClass($current, 'art-current');
            }
          });
        }
      });
    };
  }

  function ownKeys$d(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$d(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$d(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$d(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function aspectRatio(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$d({}, option, {
        html: "\n".concat(i18n.get('Aspect ratio'), ":\n<span data-ratio=\"default\" class=\"art-current\">").concat(i18n.get('Default'), "</span>\n<span data-ratio=\"4:3\">4:3</span>\n<span data-ratio=\"16:9\">16:9</span>\n            "),
        click: function click(contextmenu, event) {
          var ratio = event.target.dataset.ratio;

          if (ratio) {
            player.aspectRatio = ratio;
            contextmenu.show = false;
          }
        },
        mounted: function mounted($menu) {
          art.on('aspectRatioChange', function (ratio) {
            var $current = queryAll('span', $menu).find(function (item) {
              return item.dataset.ratio === ratio;
            });

            if ($current) {
              inverseClass($current, 'art-current');
            }
          });
        }
      });
    };
  }

  function ownKeys$e(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$e(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$e(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$e(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function info(option) {
    return function (art) {
      return _objectSpread$e({}, option, {
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

  function version(option) {
    return _objectSpread$f({}, option, {
      html: '<a href="https://artplayer.org" target="_blank">ArtPlayer 3.1.20</a>'
    });
  }

  function ownKeys$g(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$g(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$g(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$g(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function close(option) {
    return function (art) {
      return _objectSpread$g({}, option, {
        html: art.i18n.get('Close'),
        click: function click(contextmenu) {
          contextmenu.show = false;
        }
      });
    };
  }

  var Contextmenu =
  /*#__PURE__*/
  function (_Component) {
    inherits(Contextmenu, _Component);

    function Contextmenu(art) {
      var _this;

      classCallCheck(this, Contextmenu);

      _this = possibleConstructorReturn(this, getPrototypeOf(Contextmenu).call(this, art));
      var option = art.option,
          _art$template = art.template,
          $player = _art$template.$player,
          $contextmenu = _art$template.$contextmenu,
          proxy = art.events.proxy;
      _this.$parent = $contextmenu;
      art.on('ready', function () {
        _this.add(playbackRate({
          disable: !option.playbackRate,
          name: 'playbackRate',
          index: 10
        }));

        _this.add(aspectRatio({
          disable: !option.aspectRatio,
          name: 'aspectRatio',
          index: 20
        }));

        _this.add(info({
          disable: false,
          name: 'info',
          index: 30
        }));

        _this.add(version({
          disable: false,
          name: 'version',
          index: 40
        }));

        _this.add(close({
          disable: false,
          name: 'close',
          index: 50
        }));

        option.contextmenu.forEach(function (item) {
          _this.add(item);
        });
        proxy($player, 'contextmenu', function (event) {
          event.preventDefault();
          _this.show = true;
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
        });
        proxy($player, 'click', function (event) {
          if (!event.composedPath().includes($contextmenu)) {
            _this.show = false;
          }
        });
        art.on('blur', function () {
          _this.show = false;
        });
      });
      return _this;
    }

    return Contextmenu;
  }(Component);

  var Info =
  /*#__PURE__*/
  function (_Component) {
    inherits(Info, _Component);

    function Info(art) {
      var _this;

      classCallCheck(this, Info);

      _this = possibleConstructorReturn(this, getPrototypeOf(Info).call(this, art));
      var _art$template = art.template,
          $infoPanel = _art$template.$infoPanel,
          $infoClose = _art$template.$infoClose,
          $video = _art$template.$video,
          proxy = art.events.proxy;
      proxy($infoClose, 'click', function () {
        _this.show = false;
      });
      var timer = null;
      var types = queryAll('[data-video]', $infoPanel);
      art.on('destroy', function () {
        clearTimeout(timer);
      });

      function loop() {
        types.forEach(function (item) {
          var value = $video[item.dataset.video];
          item.innerHTML = typeof value === 'number' ? value.toFixed(2) : value;
        });
        timer = setTimeout(function () {
          loop();
        }, 1000);
      }

      art.on('info:toggle', function (value) {
        clearTimeout(timer);

        if (value) {
          loop();
        }
      });
      return _this;
    }

    return Info;
  }(Component);

  var Subtitle =
  /*#__PURE__*/
  function (_Component) {
    inherits(Subtitle, _Component);

    function Subtitle(art) {
      var _this;

      classCallCheck(this, Subtitle);

      _this = possibleConstructorReturn(this, getPrototypeOf(Subtitle).call(this, art));
      var proxy = art.events.proxy,
          subtitle = art.option.subtitle,
          $subtitle = art.template.$subtitle;
      setStyles($subtitle, subtitle.style);
      proxy(_this.textTrack, 'cuechange', _this.update.bind(assertThisInitialized(_this)));

      if (subtitle.url) {
        _this.init(subtitle.url);
      }

      return _this;
    }

    createClass(Subtitle, [{
      key: "update",
      value: function update() {
        var $subtitle = this.art.template.$subtitle;
        $subtitle.innerHTML = '';

        if (this.activeCue) {
          $subtitle.innerHTML = this.activeCue.text.split(/\r?\n/).map(function (item) {
            return "<p>".concat(item, "</p>");
          }).join('');
          this.art.emit('subtitle:update', this.activeCue.text);
        }
      }
    }, {
      key: "switch",
      value: function _switch(url, name) {
        var _this2 = this;

        var _this$art = this.art,
            i18n = _this$art.i18n,
            notice = _this$art.notice;
        return this.init(url).then(function (subUrl) {
          if (name) {
            notice.show("".concat(i18n.get('Switch subtitle'), ": ").concat(name));
          }

          _this2.art.emit('subtitle:switch', subUrl);

          return subUrl;
        });
      }
    }, {
      key: "init",
      value: function init(url) {
        var _this3 = this;

        var _this$art2 = this.art,
            notice = _this$art2.notice,
            _this$art2$template = _this$art2.template,
            $subtitle = _this$art2$template.$subtitle,
            $track = _this$art2$template.$track;
        return fetch(url).then(function (response) {
          return response.text();
        }).then(function (text) {
          _this3.art.emit('subtitle:load', url);

          switch (getExt(url)) {
            case 'srt':
              return vttToBlob(srtToVtt(text));

            case 'ass':
              return vttToBlob(assToVtt(text));

            case 'vtt':
              return vttToBlob(text);

            default:
              return url;
          }
        }).then(function (subUrl) {
          $subtitle.innerHTML = '';
          if (_this3.url === subUrl) return subUrl;
          URL.revokeObjectURL(_this3.url);
          $track.src = subUrl;
          return subUrl;
        }).catch(function (err) {
          notice.show(err);

          _this3.art.emit('subtitle:err', err);

          throw err;
        });
      }
    }, {
      key: "url",
      get: function get() {
        return this.art.template.$track.src;
      }
    }, {
      key: "textTrack",
      get: function get() {
        return this.art.template.$video.textTracks[0];
      }
    }, {
      key: "activeCue",
      get: function get() {
        return this.textTrack.activeCues[0];
      }
    }]);

    return Subtitle;
  }(Component);

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
      addClass($player, 'art-hover');
      art.emit('hoverenter');
    }, function () {
      removeClass($player, 'art-hover');
      art.emit('hoverleave');
    });
  }

  function mousemoveInitInit(art, events) {
    var _art$template = art.template,
        $player = _art$template.$player,
        $video = _art$template.$video,
        player = art.player;
    var autoHide = debounce(function () {
      addClass($player, 'art-hide-cursor');
      removeClass($player, 'art-hover');
      art.controls.show = false;
    }, 3000);
    art.on('hoverleave', function () {
      if (player.playing) {
        autoHide();
      }
    });
    events.proxy($player, 'mousemove', function (event) {
      autoHide.clearTimeout();
      removeClass($player, 'art-hide-cursor');
      art.controls.show = true;

      if (!art.player.pip && player.playing && event.target === $video) {
        autoHide();
      }

      art.emit('mousemove');
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

      this.keys = {};
      var option = art.option,
          player = art.player,
          proxy = art.events.proxy;

      if (option.hotkey) {
        art.on('ready', function () {
          _this.add(27, function () {
            if (player.fullscreenWeb) {
              player.fullscreenWeb = false;
            }
          });

          _this.add(32, function () {
            player.toggle = true;
          });

          _this.add(37, function () {
            player.seek = player.currentTime - 5;
          });

          _this.add(38, function () {
            player.volume += 0.1;
          });

          _this.add(39, function () {
            player.seek = player.currentTime + 5;
          });

          _this.add(40, function () {
            player.volume -= 0.1;
          });

          proxy(window, 'keydown', function (event) {
            if (art.isFocus) {
              var tag = document.activeElement.tagName.toUpperCase();
              var editable = document.activeElement.getAttribute('contenteditable');

              if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
                var events = _this.keys[event.keyCode];

                if (events) {
                  event.preventDefault();
                  events.forEach(function (fn) {
                    return fn();
                  });
                  art.emit('hotkey', event);
                }
              }
            }
          });
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
    }]);

    return Hotkey;
  }();

  var Layer =
  /*#__PURE__*/
  function (_Component) {
    inherits(Layer, _Component);

    function Layer(art) {
      var _this;

      classCallCheck(this, Layer);

      _this = possibleConstructorReturn(this, getPrototypeOf(Layer).call(this, art));
      _this.$parent = art.template.$layer;
      art.on('ready', function () {
        art.option.layers.forEach(function (item) {
          _this.add(item);
        });
      });
      return _this;
    }

    return Layer;
  }(Component);

  var Loading =
  /*#__PURE__*/
  function (_Component) {
    inherits(Loading, _Component);

    function Loading(art) {
      var _this;

      classCallCheck(this, Loading);

      _this = possibleConstructorReturn(this, getPrototypeOf(Loading).call(this, art));
      append(art.template.$loading, art.icons.loading);
      return _this;
    }

    return Loading;
  }(Component);

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
        $noticeInner.innerHTML = msg instanceof Error ? msg.message.trim() : msg;
        clearTimeout(this.timer);

        if (autoHide) {
          this.timer = setTimeout(function () {
            _this.hide();
          }, time);
        }

        addClass($player, 'art-notice-show');
        this.art.emit('notice:toggle', true);
      }
    }, {
      key: "hide",
      value: function hide() {
        var _this$art$template2 = this.art.template,
            $player = _this$art$template2.$player,
            $noticeInner = _this$art$template2.$noticeInner;
        $noticeInner.innerHTML = '';
        removeClass($player, 'art-notice-show');
        this.art.emit('notice:toggle', true);
      }
    }]);

    return Notice;
  }();

  var Mask =
  /*#__PURE__*/
  function (_Component) {
    inherits(Mask, _Component);

    function Mask(art) {
      var _this;

      classCallCheck(this, Mask);

      _this = possibleConstructorReturn(this, getPrototypeOf(Mask).call(this, art));
      append(art.template.$state, art.icons.state);
      return _this;
    }

    return Mask;
  }(Component);

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
  function flip(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$h({}, option, {
        html: "\n<div class=\"art-setting-header\">".concat(i18n.get('Flip'), "</div>\n<div class=\"art-setting-radio\">\n    <div class=\"art-radio-item current\">\n        <button type=\"button\" data-value=\"normal\">").concat(i18n.get('Normal'), "</button>\n    </div>\n    <div class=\"art-radio-item\">\n        <button type=\"button\" data-value=\"horizontal\">").concat(i18n.get('Horizontal'), "</button>\n    </div>\n    <div class=\"art-radio-item\">\n        <button type=\"button\" data-value=\"vertical\">").concat(i18n.get('Vertical'), "</button>\n    </div>\n</div>\n            "),
        click: function click(setting, event) {
          var value = event.target.dataset.value;

          if (value) {
            player.flip = value;
          }
        },
        mounted: function mounted($setting) {
          art.on('flipChange', function (flip) {
            var $current = queryAll('button', $setting).find(function (item) {
              return item.dataset.value === flip;
            });

            if ($current) {
              inverseClass($current.parentElement, 'current');
            }
          });
        }
      });
    };
  }

  function ownKeys$i(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$i(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$i(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$i(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function aspectRatio$1(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$i({}, option, {
        html: "\n<div class=\"art-setting-header\">".concat(i18n.get('Aspect ratio'), "</div>\n<div class=\"art-setting-radio\">\n    <div class=\"art-radio-item current\">\n        <button type=\"button\" data-value=\"default\">").concat(i18n.get('Default'), "</button>\n    </div>\n    <div class=\"art-radio-item\">\n        <button type=\"button\" data-value=\"4:3\">4:3</button>\n    </div>\n    <div class=\"art-radio-item\">\n        <button type=\"button\" data-value=\"16:9\">16:9</button>\n    </div>\n</div>\n            "),
        click: function click(setting, event) {
          var value = event.target.dataset.value;

          if (value) {
            player.aspectRatio = value;
          }
        },
        mounted: function mounted($setting) {
          art.on('aspectRatioChange', function (ratio) {
            var $current = queryAll('button', $setting).find(function (item) {
              return item.dataset.value === ratio;
            });

            if ($current) {
              inverseClass($current.parentElement, 'current');
            }
          });
        }
      });
    };
  }

  function ownKeys$j(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$j(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$j(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$j(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function playbackRate$1(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player,
          proxy = art.events.proxy;
      return _objectSpread$j({}, option, {
        html: "\n<div class=\"art-setting-header\">\n    ".concat(i18n.get('Play speed'), ": <span class=\"art-subtitle-value\">1.0</span>x\n</div>\n<div class=\"art-setting-range\">\n    <input class=\"art-subtitle-range\" value=\"1\" type=\"range\" min=\"0.5\" max=\"2\" step=\"0.25\">\n</div>\n            "),
        mounted: function mounted($setting) {
          var $range = query('.art-setting-range input', $setting);
          var $value = query('.art-subtitle-value', $setting);
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
  function (_Component) {
    inherits(Setting, _Component);

    function Setting(art) {
      var _this;

      classCallCheck(this, Setting);

      _this = possibleConstructorReturn(this, getPrototypeOf(Setting).call(this, art));
      var option = art.option,
          _art$template = art.template,
          $setting = _art$template.$setting,
          $settingBody = _art$template.$settingBody,
          proxy = art.events.proxy;
      _this.$parent = $settingBody;

      if (option.setting) {
        art.on('ready', function () {
          proxy($setting, 'click', function (e) {
            if (e.target === $setting) {
              _this.show = false;
            }
          });

          _this.add(flip({
            disable: !option.flip,
            name: 'flip'
          }));

          _this.add(aspectRatio$1({
            disable: !option.aspectRatio,
            name: 'aspectRatio'
          }));

          _this.add(playbackRate$1({
            disable: !option.playbackRate,
            name: 'playbackRate'
          }));
        });
        art.on('blur', function () {
          _this.show = false;
        });
      }

      return _this;
    }

    return Setting;
  }(Component);

  var Storage =
  /*#__PURE__*/
  function () {
    function Storage(art) {
      classCallCheck(this, Storage);

      this.art = art;
      this.name = 'artplayer_settings';
      var option = art.option;
      var volume = this.get('volume');

      if (volume) {
        option.volume = volume;
      }
    }

    createClass(Storage, [{
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
        subtitle = art.subtitle,
        proxy = art.events.proxy;
    return {
      title: 'Subtitle',
      name: 'subtitleOffset',
      index: 20,
      html: "\n<div class=\"art-setting-header\">\n    ".concat(i18n.get('Subtitle offset time'), ": <span class=\"art-subtitle-value\">0</span>s\n</div>\n<div class=\"art-setting-range\">\n    <input class=\"art-subtitle-range\" value=\"0\" type=\"range\" min=\"-5\" max=\"5\" step=\"0.5\">\n</div>\n        "),
      mounted: function mounted($setting) {
        var $range = query('.art-setting-range input', $setting);
        var $value = query('.art-subtitle-value', $setting);
        proxy($range, 'change', function () {
          var value = $range.value;
          $value.innerText = value;
          art.plugins.subtitleOffset.offset(Number(value));
        });
        art.on('subtitle:switch', function () {
          $range.value = 0;
          $value.innerText = 0;
        });
        art.on('subtitleOffset', function (value) {
          subtitle.update();

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
    setting.add(settingMix);
    var cuesCache = [];
    art.on('subtitle:switch', function () {
      cuesCache = [];
    });
    return {
      name: 'subtitleOffset',
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
          art.emit('subtitleOffset', value);
        } else {
          notice.show("".concat(i18n.get('No subtitles found')));
          art.emit('subtitleOffset', 0);
        }
      }
    };
  }

  function localVideo(art) {
    var proxy = art.events.proxy,
        template = art.template,
        player = art.player,
        option = art.option,
        setting = art.setting,
        i18n = art.i18n;

    function loadVideo(file) {
      if (file) {
        var canPlayType = template.$video.canPlayType(file.type);

        if (canPlayType === 'maybe' || canPlayType === 'probably') {
          var url = URL.createObjectURL(file);
          option.title = file.name;
          player.switchUrl(url, file.name);
          art.emit('localVideo', file);
        } else {
          errorHandle(false, 'Playback of this file format is not supported');
        }
      }
    }

    proxy(template.$player, 'dragover', function (e) {
      e.preventDefault();
    });
    proxy(template.$player, 'drop', function (e) {
      e.preventDefault();
      var file = e.dataTransfer.files[0];
      loadVideo(file);
    });

    function attach(target) {
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

    art.on('ready', function () {
      setting.add({
        title: 'Local Video',
        name: 'localVideo',
        index: 30,
        html: "\n<div class=\"art-setting-header\">\n    ".concat(i18n.get('Local Video'), "\n</div>\n<div class=\"art-setting-upload\">\n    <div class=\"art-upload-btn\">").concat(i18n.get('Open'), "</div>\n    <div class=\"art-upload-value\"></div>\n</div>\n            "),
        mounted: function mounted($setting) {
          var $btn = query('.art-upload-btn', $setting);
          var $value = query('.art-upload-value', $setting);
          art.on('localVideo', function (file) {
            $value.textContent = file.name;
            $value.title = file.name;
          });
          attach($btn);
        }
      });
    });
    return {
      name: 'localVideo',
      attach: attach
    };
  }

  function localSubtitle(art) {
    var proxy = art.events.proxy,
        subtitle = art.subtitle,
        setting = art.setting,
        i18n = art.i18n;

    function loadSubtitle(file) {
      if (file) {
        var type = getExt(file.name);

        if (['ass', 'vtt', 'srt'].includes(type)) {
          var reader = new FileReader();
          proxy(reader, 'load', function (event) {
            var text = event.target.result;

            switch (type) {
              case 'srt':
                {
                  var url = vttToBlob(srtToVtt(text));
                  subtitle.switch(url, file.name);
                  break;
                }

              case 'ass':
                {
                  var _url = vttToBlob(assToVtt(text));

                  subtitle.switch(_url, file.name);
                  break;
                }

              case 'vtt':
                {
                  var _url2 = vttToBlob(text);

                  subtitle.switch(_url2, file.name);
                  break;
                }
            }

            art.emit('localSubtitle', file);
          });
          reader.readAsText(file);
        } else {
          errorHandle(false, 'Only supports subtitle files in .ass, .vtt and .srt format');
        }
      }
    }

    function attach(target) {
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
        loadSubtitle(file);
      });
    }

    art.on('ready', function () {
      setting.add({
        title: 'Local Subtitle',
        name: 'localSubtitle',
        index: 40,
        html: "\n<div class=\"art-setting-header\">\n    ".concat(i18n.get('Local Subtitle'), "\n</div>\n<div class=\"art-setting-upload\">\n    <div class=\"art-upload-btn\">").concat(i18n.get('Open'), "</div>\n    <div class=\"art-upload-value\"></div>\n</div>\n            "),
        mounted: function mounted($setting) {
          var $btn = query('.art-upload-btn', $setting);
          var $value = query('.art-upload-value', $setting);
          art.on('localSubtitle', function (file) {
            $value.textContent = file.name;
            $value.title = file.name;
          });
          attach($btn);
        }
      });
    });
    return {
      name: 'localSubtitle',
      attach: attach
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
        height: '2px',
        background: theme
      },
      mounted: function mounted($progressBar) {
        art.on('control:toggle', function (value) {
          $progressBar.style.display = value ? 'none' : 'block';
        });
        art.on('destroy', function () {
          $progressBar.style.display = 'none';
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

  function networkMonitor(art) {
    var sampleTime = 10000;
    var waitTime = 0;
    var playTime = 0;
    var lastTime = 0;
    var timer = null;

    function resetTime() {
      waitTime = 0;
      playTime = 0;
      lastTime = 0;
      cancelAnimationFrame(timer);
      timer = null;
    }

    function startTime() {
      if (timer) return;

      (function loop() {
        if (art.isDestroy) return;
        timer = requestAnimationFrame(function () {
          var nowTime = Date.now();

          if (lastTime) {
            var diffTime = nowTime - lastTime;
            playTime += diffTime;

            if (!art.player.playing) {
              waitTime += diffTime;
            }
          }

          lastTime = nowTime;
          art.emit('networkMonitor', waitTime / playTime);

          if (playTime >= sampleTime) {
            waitTime = 0;
            playTime = 0;
          }

          loop();
        });
      })();
    }

    art.on('play', startTime);
    art.on('pause', resetTime);
    return {
      name: 'networkMonitor',
      reset: resetTime,
      start: startTime,
      sample: function sample(time) {
        sampleTime = time;
      }
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

      if (top + height <= 0 && !player.pip) {
        player.pip = true;
        art.emit('autoPip', true);
      } else if (player.pip) {
        player.pip = false;
        art.emit('autoPip', false);
      }
    }, 300);
    events.proxy(window, 'scroll', scrollDebounce);
    return {
      name: 'autoPip'
    };
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

      if (option.localVideo) {
        this.add(localVideo);
      }

      if (option.localSubtitle) {
        this.add(localSubtitle);
      }

      if (option.networkMonitor) {
        this.add(networkMonitor);
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

        errorHandle(!has(this, pluginName), "Cannot add a plugin that already has the same name: ".concat(pluginName));
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
        _this.layers = new Layer(assertThisInitialized(_this));
        _this.controls = new Control(assertThisInitialized(_this));
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
      Artplayer.instances.push(assertThisInitialized(_this));
      return _this;
    }

    createClass(Artplayer, [{
      key: "destroy",
      value: function destroy() {
        var removeHtml = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        this.events.destroy();
        this.template.destroy(removeHtml);
        Artplayer.instances.splice(Artplayer.instances.indexOf(this), 1);
        this.isDestroy = true;
        this.emit('destroy');
      }
    }], [{
      key: "version",
      get: function get() {
        return '3.1.20';
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
          localVideo: false,
          localSubtitle: false,
          autoPip: false,
          networkMonitor: false,
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
            preload: 'metadata'
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
  }); // eslint-disable-next-line no-console

  console.log('%c ArtPlayer %c 3.1.20 %c https://artplayer.org', 'color: #fff; background: #5f5f5f', 'color: #fff; background: #4bc729', '');

  function ownKeys$k(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$k(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$k(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$k(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var index = {
    data: function data() {
      return {
        instance: null
      };
    },
    props: {
      option: {
        type: Object,
        required: true
      },
      getInstance: Function
    },
    mounted: function mounted() {
      this.instance = new Artplayer(_objectSpread$k({}, this.option, {
        container: this.$refs.artRef
      }));
      this.$emit('getInstance', this.instance);
    },
    beforeDestroy: function beforeDestroy() {
      if (this.instance && this.instance.destroy) {
        this.instance.destroy();
      }
    },
    render: function render(h) {
      return h('div', {
        ref: 'artRef'
      });
    }
  };

  return index;

})));
//# sourceMappingURL=artplayer-vue.js.map
