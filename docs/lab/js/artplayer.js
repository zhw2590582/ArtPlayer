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

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
  }

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

  var optionValidator = createCommonjsModule(function (module, exports) {
  !function(r,t){module.exports=t();}(commonjsGlobal,function(){function c(r){return (c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(r)}var u=Object.prototype.toString,i=function(r){if(void 0===r)return "undefined";if(null===r)return "null";var t,e,n,o,a,i=c(r);if("boolean"===i)return "boolean";if("string"===i)return "string";if("number"===i)return "number";if("symbol"===i)return "symbol";if("function"===i)return "GeneratorFunction"===f(r)?"generatorfunction":"function";if(t=r,Array.isArray?Array.isArray(t):t instanceof Array)return "array";if(function(r){if(r.constructor&&"function"==typeof r.constructor.isBuffer)return r.constructor.isBuffer(r);return !1}(r))return "buffer";if(function(r){try{if("number"==typeof r.length&&"function"==typeof r.callee)return !0}catch(r){if(-1!==r.message.indexOf("callee"))return !0}return !1}(r))return "arguments";if((e=r)instanceof Date||"function"==typeof e.toDateString&&"function"==typeof e.getDate&&"function"==typeof e.setDate)return "date";if((n=r)instanceof Error||"string"==typeof n.message&&n.constructor&&"number"==typeof n.constructor.stackTraceLimit)return "error";if((o=r)instanceof RegExp||"string"==typeof o.flags&&"boolean"==typeof o.ignoreCase&&"boolean"==typeof o.multiline&&"boolean"==typeof o.global)return "regexp";switch(f(r)){case"Symbol":return "symbol";case"Promise":return "promise";case"WeakMap":return "weakmap";case"WeakSet":return "weakset";case"Map":return "map";case"Set":return "set";case"Int8Array":return "int8array";case"Uint8Array":return "uint8array";case"Uint8ClampedArray":return "uint8clampedarray";case"Int16Array":return "int16array";case"Uint16Array":return "uint16array";case"Int32Array":return "int32array";case"Uint32Array":return "uint32array";case"Float32Array":return "float32array";case"Float64Array":return "float64array"}if("function"==typeof(a=r).throw&&"function"==typeof a.return&&"function"==typeof a.next)return "generator";switch(i=u.call(r)){case"[object Object]":return "object";case"[object Map Iterator]":return "mapiterator";case"[object Set Iterator]":return "setiterator";case"[object String Iterator]":return "stringiterator";case"[object Array Iterator]":return "arrayiterator"}return i.slice(8,-1).toLowerCase().replace(/\s/g,"")};function f(r){return r.constructor?r.constructor.name:null}function a(r,t){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:["option"];for(var n in y(r,t,e),l(r,t,e),p(r,t,e),t)if(t.hasOwnProperty(n)){var o=r[n],a=t[n],i=e.concat(n);if(s(r,n,a,i))continue;y(o,a,i),l(o,a,i),p(o,a,i);}}function s(r,t,e,n){if(!Object.prototype.hasOwnProperty.call(r,t)){if(!0===e.__required__||!0===e.required)throw new TypeError("'".concat(n.join("."),"' is required"));return !0}}function y(r,t,e){var n;if("string"===i(t)?n=t:"function"===i(t)?t.___validator__=t:t.__type__?n=t.__type__:t.type&&(n=t.type),n&&"string"===i(n)){n=n.trim().toLowerCase();var o=i(r),a=o===n;if(-1<n.indexOf("|"))a=n.split("|").filter(Boolean).some(function(r){return o===r.trim()});if(!a)throw new TypeError("'".concat(e.join("."),"' require '").concat(n,"' type, but got '").concat(o,"'"))}}function l(r,t,e){var n;if(t.___validator__?n=t.___validator__:t.validator&&(n=t.validator),"function"===i(n)){var o=n(e,r,i(r));if(!0!==o)throw new TypeError("The scheme for '".concat(e.join("."),"' validator function require return true, but got '").concat(o,"'"))}}function p(r,t,e){var n;if(t.___child__?n=t.___child__:t.child&&(n=t.child),"object"===i(n)){var o=i(r);"object"===o?a(r,n,e):"array"===o&&r.forEach(function(r,t){a(r,n,e.concat(t));});}}return a.kindOf=i,window.optionValidator=a});
  });

  var isMergeableObject = function isMergeableObject(value) {
  	return isNonNullObject(value)
  		&& !isSpecial(value)
  };

  function isNonNullObject(value) {
  	return !!value && typeof value === 'object'
  }

  function isSpecial(value) {
  	var stringValue = Object.prototype.toString.call(value);

  	return stringValue === '[object RegExp]'
  		|| stringValue === '[object Date]'
  		|| isReactElement(value)
  }

  // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
  var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
  var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

  function isReactElement(value) {
  	return value.$$typeof === REACT_ELEMENT_TYPE
  }

  function emptyTarget(val) {
  	return Array.isArray(val) ? [] : {}
  }

  function cloneUnlessOtherwiseSpecified(value, options) {
  	return (options.clone !== false && options.isMergeableObject(value))
  		? deepmerge(emptyTarget(value), value, options)
  		: value
  }

  function defaultArrayMerge(target, source, options) {
  	return target.concat(source).map(function(element) {
  		return cloneUnlessOtherwiseSpecified(element, options)
  	})
  }

  function mergeObject(target, source, options) {
  	var destination = {};
  	if (options.isMergeableObject(target)) {
  		Object.keys(target).forEach(function(key) {
  			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
  		});
  	}
  	Object.keys(source).forEach(function(key) {
  		if (!options.isMergeableObject(source[key]) || !target[key]) {
  			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
  		} else {
  			destination[key] = deepmerge(target[key], source[key], options);
  		}
  	});
  	return destination
  }

  function deepmerge(target, source, options) {
  	options = options || {};
  	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  	options.isMergeableObject = options.isMergeableObject || isMergeableObject;

  	var sourceIsArray = Array.isArray(source);
  	var targetIsArray = Array.isArray(target);
  	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  	if (!sourceAndTargetTypesMatch) {
  		return cloneUnlessOtherwiseSpecified(source, options)
  	} else if (sourceIsArray) {
  		return options.arrayMerge(target, source, options)
  	} else {
  		return mergeObject(target, source, options)
  	}
  }

  deepmerge.all = function deepmergeAll(array, options) {
  	if (!Array.isArray(array)) {
  		throw new Error('first argument should be an array')
  	}

  	return array.reduce(function(prev, next) {
  		return deepmerge(prev, next, options)
  	}, {})
  };

  var deepmerge_1 = deepmerge;

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

  function append(parent, child) {
    if (child instanceof Element) {
      parent.appendChild(child);
    } else {
      parent.insertAdjacentHTML('beforeend', child);
    }

    return parent.lastElementChild;
  }
  function insertByIndex(parent, child, index) {
    var childs = Array.from(parent.children);
    child.dataset.index = index;
    var nextChild = childs.find(function (item) {
      return Number(item.dataset.index) >= Number(index);
    });

    if (nextChild) {
      nextChild.insertAdjacentElement('beforebegin', child);
    } else {
      append(parent, child);
    }

    return child;
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
    target.setAttribute('data-balloon', msg);
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

  var utils = /*#__PURE__*/Object.freeze({
    clamp: clamp,
    getExt: getExt,
    secondToTime: secondToTime,
    sleep: sleep,
    debounce: debounce,
    ArtPlayerError: ArtPlayerError,
    errorHandle: errorHandle,
    append: append,
    insertByIndex: insertByIndex,
    setStyle: setStyle,
    setStyles: setStyles,
    getStyle: getStyle,
    sublings: sublings,
    inverseClass: inverseClass,
    tooltip: tooltip,
    srtToVtt: srtToVtt,
    vttToBlob: vttToBlob
  });

  function validElement(paths, value, type) {
    if (type === 'string') {
      if (value.trim() === '') {
        throw new ArtPlayerError("".concat(paths.join('.'), " can not be empty"));
      } else {
        return true;
      }
    }

    if (value instanceof Element) {
      return true;
    }

    throw new ArtPlayerError("".concat(paths.join('.'), " require 'string' or 'Element' type, but got '").concat(type, "'"));
  }

  function validStringEmpty(paths, value, type) {
    if (type !== 'string') {
      throw new ArtPlayerError("".concat(paths.join('.'), " required 'string' type."));
    }

    if (value.trim() === '') {
      throw new ArtPlayerError("".concat(paths.join('.'), " can not be empty"));
    }

    return true;
  }

  var scheme = {
    container: {
      validator: validElement,
      required: true
    },
    url: {
      type: 'string',
      required: true,
      validator: validStringEmpty
    },
    poster: 'string',
    title: 'string',
    type: {
      type: 'string'
    },
    mimeCodec: 'string',
    theme: 'string',
    volume: 'number',
    mse: 'boolean',
    muted: 'boolean',
    autoplay: 'boolean',
    autoSize: 'boolean',
    loop: 'boolean',
    playbackRate: 'boolean',
    aspectRatio: 'boolean',
    screenshot: 'boolean',
    setting: 'boolean',
    hotkey: 'boolean',
    pip: 'boolean',
    mutex: 'boolean',
    fullscreen: 'boolean',
    fullscreenWeb: 'boolean',
    plugins: {
      type: 'array',
      child: {
        type: 'function'
      }
    },
    layers: {
      type: 'array',
      child: {
        type: 'object|function',
        disable: 'boolean',
        name: 'string',
        index: 'number',
        html: validElement,
        style: 'object',
        click: 'function'
      }
    },
    contextmenu: {
      type: 'array',
      child: {
        type: 'object|function',
        disable: 'boolean',
        name: 'string',
        index: 'number',
        html: validElement,
        style: 'object',
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
    controls: {
      type: 'array',
      child: {
        type: 'object|function',
        disable: 'boolean',
        name: 'string',
        index: 'number',
        html: validElement,
        style: 'object',
        click: 'function',
        position: function position(paths, value) {
          return ['top', 'left', 'right'].includes(value);
        }
      }
    },
    highlight: {
      type: 'array',
      child: {
        type: 'object',
        time: 'number',
        text: 'string'
      }
    },
    thumbnails: {
      type: 'object',
      child: {
        type: 'object',
        url: 'string',
        number: 'number',
        width: 'number',
        height: 'number',
        column: 'number'
      }
    },
    subtitle: {
      type: 'object',
      child: {
        type: 'object',
        url: 'string',
        style: 'object'
      }
    },
    moreVideoAttr: 'object',
    icons: 'object',
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

  var Template = function Template(art) {
    classCallCheck(this, Template);

    var refs = art.refs;
    refs.$container.innerHTML = "\n          <div class=\"artplayer-video-player\">\n            <video data-index=\"10\" class=\"artplayer-video\"></video>\n            <div data-index=\"20\" class=\"artplayer-subtitle\"></div>\n            <div data-index=\"30\" class=\"artplayer-layers\"></div>\n            <div data-index=\"40\" class=\"artplayer-mask\"></div>\n            <div data-index=\"50\" class=\"artplayer-bottom\">\n              <div class=\"artplayer-progress\"></div>\n              <div class=\"artplayer-controls\">\n                <div class=\"artplayer-controls-left\"></div>\n                <div class=\"artplayer-controls-right\"></div>\n              </div>\n            </div>\n            <div data-index=\"60\" class=\"artplayer-loading\"></div>\n            <div data-index=\"70\" class=\"artplayer-notice\">\n              <div class=\"artplayer-notice-inner\"></div>\n            </div>\n            <div data-index=\"80\" class=\"artplayer-setting\">\n              <div class=\"artplayer-setting-inner\">\n                <div class=\"artplayer-setting-body\"></div>\n                <div class=\"artplayer-setting-close\">\xD7</div>\n              </div>\n            </div>\n            <div data-index=\"90\" class=\"artplayer-info\">\n              <div class=\"artplayer-info-panel\"></div>\n              <div class=\"artplayer-info-close\">[x]</div>\n            </div>\n            <div data-index=\"100\" class=\"artplayer-pip-header\">\n              <div class=\"artplayer-pip-title\"></div>\n              <div class=\"artplayer-pip-close\">\xD7</div>\n            </div>\n            <div data-index=\"110\" class=\"artplayer-contextmenu\"></div>\n          </div>\n        ";
    refs.$player = refs.$container.querySelector('.artplayer-video-player');
    refs.$video = refs.$container.querySelector('.artplayer-video');
    refs.$subtitle = refs.$container.querySelector('.artplayer-subtitle');
    refs.$bottom = refs.$container.querySelector('.artplayer-bottom');
    refs.$progress = refs.$container.querySelector('.artplayer-progress');
    refs.$controls = refs.$container.querySelector('.artplayer-controls');
    refs.$controlsLeft = refs.$container.querySelector('.artplayer-controls-left');
    refs.$controlsRight = refs.$container.querySelector('.artplayer-controls-right');
    refs.$layers = refs.$container.querySelector('.artplayer-layers');
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
    refs.$contextmenu = refs.$container.querySelector('.artplayer-contextmenu');
  };

  var i18nMap = {
    'zh-cn': {
      'About author': '关于作者',
      'Video info': '视频统计信息',
      Close: '关闭',
      'Video load failed': '视频加载失败',
      Volume: '音量',
      Play: '播放',
      Pause: '暂停',
      Rate: '速度',
      Mute: '静音',
      Flip: '视频翻转',
      Horizontal: '水平',
      Vertical: '垂直',
      Reconnect: '重新连接',
      'Hide subtitle': '隐藏字幕',
      'Show subtitle': '显示字幕',
      'Hide danmu': '隐藏弹幕',
      'Show danmu': '显示弹幕',
      'Show setting': '显示设置',
      'Hide setting': '隐藏设置',
      Screenshot: '截图',
      'Play speed': '播放速度',
      'Aspect ratio': '画面比例',
      Default: '默认',
      Normal: '正常',
      'Switch video': '切换',
      'Switch subtitle': '切换字幕',
      Fullscreen: '全屏',
      'Exit fullscreen': '退出全屏',
      'Web fullscreen': '网页全屏',
      'Exit web fullscreen': '退出网页全屏',
      'Mini player': '迷你播放器'
    },
    'zh-tw': {
      'About author': '關於作者',
      'Video info': '影片統計訊息',
      Close: '關閉',
      'Video load failed': '影片載入失敗',
      Volume: '音量',
      Play: '播放',
      Pause: '暫停',
      Rate: '速度',
      Mute: '靜音',
      Flip: '影片翻轉',
      Horizontal: '水平',
      Vertical: '垂直',
      Reconnect: '重新連接',
      'Hide subtitle': '隱藏字幕',
      'Show subtitle': '顯示字幕',
      'Show setting': '顯示设置',
      'Hide setting': '隱藏设置',
      'Hide danmu': '隱藏彈幕',
      'Show danmu': '顯示彈幕',
      Screenshot: '截圖',
      'Play speed': '播放速度',
      'Aspect ratio': '畫面比例',
      Default: '默認',
      Normal: '正常',
      'Switch video': '切換',
      'Switch subtitle': '切換字幕',
      Fullscreen: '全屏',
      'Exit fullscreen': '退出全屏',
      'Web fullscreen': '網頁全屏',
      'Exit web fullscreen': '退出網頁全屏',
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
      value: function update(value) {
        i18nMap = deepmerge_1(i18nMap, value);
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

    sleep().then(function () {
      art.emit('beforeMountUrl', option.url);
      $video.src = player.mountUrl(option.url);
      art.emit('afterMountUrl', option.url);
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
    var reconnectTime = 0;
    var maxReconnectTime = 5;
    proxy($video, 'click', function () {
      player.toggle();
    });
    art.on('video:loadstart', function () {
      art.loading.show();
    });
    art.on('video:loadedmetadata', function () {
      if (option.autoSize) {
        player.autoSize();
      }
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
      reconnectTime = 0;

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
      if (reconnectTime < maxReconnectTime) {
        sleep(1000).then(function () {
          reconnectTime += 1;
          art.emit('beforeMountUrl', option.url);
          $video.src = player.mountUrl(option.url);
          notice.show("".concat(i18n.get('Reconnect'), ": ").concat(reconnectTime));
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
    config.video.events.forEach(function (eventName) {
      proxy($video, eventName, function (event) {
        art.emit("video:".concat(event.type), event);
      });
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
        art.emit('play');
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
        art.emit('pause');
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
    var notice = art.notice;
    Object.defineProperty(player, 'seek', {
      value: function value(time) {
        var newTime = Math.max(time, 0);

        if (player.duration) {
          newTime = Math.min(newTime, player.duration);
        }

        player.currentTime = newTime;
        notice.show("".concat(secondToTime(newTime), " / ").concat(secondToTime(player.duration)));
        art.emit('seek', newTime);
      }
    });
  }

  function volumeMix(art, player) {
    var $video = art.refs.$video,
        i18n = art.i18n,
        notice = art.notice,
        storage = art.storage;
    Object.defineProperty(player, 'volume', {
      get: function get() {
        return $video.volume || 0;
      },
      set: function set(percentage) {
        if (percentage !== undefined) {
          $video.volume = clamp(percentage, 0, 1);
          notice.show("".concat(i18n.get('Volume'), ": ").concat(parseInt($video.volume * 100, 10)));

          if ($video.volume !== 0) {
            storage.set('volume', $video.volume);
          }

          art.emit('volumeChange', $video.volume);
        }
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
        return art.refs.$video.currentTime || 0;
      },
      set: function set(currentTime) {
        art.refs.$video.currentTime = currentTime;
      }
    });
  }

  function durationMix(art, player) {
    Object.defineProperty(player, 'duration', {
      get: function get() {
        return art.refs.$video.duration || 0;
      }
    });
  }

  function switchMix(art, player) {
    var $video = art.refs.$video,
        i18n = art.i18n,
        notice = art.notice,
        option = art.option;
    Object.defineProperty(player, 'switchQuality', {
      value: function value(url) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'unknown';

        if (url !== option.url) {
          var isPlaying = art.isPlaying;
          var currentTime = player.currentTime;
          art.emit('beforeMountUrl', url);
          $video.src = player.mountUrl(url);
          art.emit('afterMountUrl', url);
          option.url = url;
          player.playbackRateRemove();
          player.aspectRatioRemove();
          player.seek(currentTime);

          if (isPlaying) {
            player.play();
          }

          notice.show("".concat(i18n.get('Switch video'), ": ").concat(name));
          art.emit('switch', url);
        }
      }
    });
  }

  function playbackRateMix(art, player) {
    var _art$refs = art.refs,
        $video = _art$refs.$video,
        $player = _art$refs.$player,
        i18n = art.i18n,
        notice = art.notice;
    Object.defineProperty(player, 'playbackRateState', {
      get: function get() {
        return $player.dataset.playbackRate;
      }
    });
    Object.defineProperty(player, 'playbackRate', {
      value: function value(rate) {
        var rateList = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
        errorHandle(rateList.includes(rate), "'playbackRate' only accept ".concat(rateList.toString(), " as parameters"));

        if (rate === $player.dataset.playbackRate) {
          return;
        }

        $video.playbackRate = rate;
        $player.dataset.playbackRate = rate;
        notice.show("".concat(i18n.get('Rate'), ": ").concat(rate, "x"));
        art.emit('playbackRateChange', rate);
      }
    });
    Object.defineProperty(player, 'playbackRateRemove', {
      value: function value() {
        if (player.$playbackRateState) {
          player.playbackRate(1);
          delete $player.dataset.playbackRate;
          art.emit('playbackRateRemove');
        }
      }
    });
    Object.defineProperty(player, 'playbackRateReset', {
      value: function value() {
        var playbackRate = $player.dataset.playbackRate;

        if (playbackRate) {
          player.playbackRate(Number(playbackRate));
          art.emit('playbackRateReset');
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
    Object.defineProperty(player, 'aspectRatioState', {
      get: function get() {
        return $player.dataset.aspectRatio;
      }
    });
    Object.defineProperty(player, 'aspectRatio', {
      value: function value(ratio) {
        var ratioList = ['default', '4:3', '16:9'];
        errorHandle(ratioList.includes(ratio), "'aspectRatio' only accept ".concat(ratioList.toString(), " as parameters"));

        if (ratio === $player.dataset.aspectRatio) {
          return;
        }

        if (ratio === 'default') {
          player.aspectRatioRemove();
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
        notice.show("".concat(i18n.get('Aspect ratio'), ": ").concat(ratio));
        art.emit('aspectRatioChange', ratio);
      }
    });
    Object.defineProperty(player, 'aspectRatioRemove', {
      value: function value() {
        if (player.aspectRatioState) {
          setStyle($video, 'width', null);
          setStyle($video, 'height', null);
          setStyle($video, 'padding', null);
          delete $player.dataset.aspectRatio;
          art.emit('aspectRatioRemove');
        }
      }
    });
    Object.defineProperty(player, 'aspectRatioReset', {
      value: function value() {
        var aspectRatio = $player.dataset.aspectRatio;

        if (aspectRatio) {
          player.aspectRatio(aspectRatio);
          art.emit('aspectRatioReset');
        }
      }
    });
  }

  function screenshotMix(art, player) {
    var option = art.option,
        notice = art.notice,
        $video = art.refs.$video;

    function captureFrame() {
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
      return dataUri;
    }

    Object.defineProperty(player, 'screenshot', {
      value: function value() {
        var crossOrigin = $video.crossOrigin;

        try {
          $video.crossOrigin = 'anonymous';
          var dataUri = captureFrame();
          art.emit('screenshot', dataUri);
        } catch (error) {
          notice.show(error);
          console.warn(error);
        } finally {
          $video.crossOrigin = crossOrigin;
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
        if (player.fullscreenState) {
          player.fullscreenWebExit();
          $player.classList.remove('artplayer-fullscreen');
          screenfull.exit();
          art.emit('fullscreen:exit');
        }
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
        art.emit('fullscreenWeb:enabled');
      }
    });
    Object.defineProperty(player, 'fullscreenWebExit', {
      value: function value() {
        if (player.fullscreenWebState) {
          player.fullscreenExit();
          $player.classList.remove('artplayer-web-fullscreen');
          art.emit('fullscreenWeb:exit');
        }
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

  function nativePip(art, player) {
    var notice = art.notice,
        $video = art.refs.$video,
        proxy = art.events.proxy;
    $video.disablePictureInPicture = false;
    Object.defineProperty(player, 'pipState', {
      get: function get() {
        return document.pictureInPictureElement;
      }
    });
    Object.defineProperty(player, 'pipEnabled', {
      value: function value() {
        $video.requestPictureInPicture().catch(function (error) {
          notice.show(error, true, 3000);
          console.warn(error);
        });
      }
    });
    Object.defineProperty(player, 'pipExit', {
      value: function value() {
        document.exitPictureInPicture().catch(function (error) {
          notice.show(error, true, 3000);
          console.warn(error);
        });
      }
    });
    proxy($video, 'enterpictureinpicture', function () {
      art.emit('pipEnabled');
    });
    proxy($video, 'leavepictureinpicture', function () {
      art.emit('pipExit');

      if (art.isPlaying) {
        player.play();
      }
    });
    art.on('destroy', function () {
      if (player.pipState) {
        player.pipExit();
      }
    });
  }

  function customPip(art, player) {
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
    Object.defineProperty(player, 'pipEnabled', {
      value: function value() {
        if (player.autoSizeState) {
          player.autoSizeRemove();
        }

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
        art.emit('pipEnabled');
      }
    });
    Object.defineProperty(player, 'pipExit', {
      value: function value() {
        if (player.pipState) {
          $player.classList.remove('artplayer-pip');
          cachePos = draggie.position;
          setStyle($player, 'left', null);
          setStyle($player, 'top', null);
          player.fullscreenExit();
          player.fullscreenWebExit();
          player.aspectRatioRemove();
          player.playbackRateRemove();
          art.emit('pipExit');
        }
      }
    });
  }

  function pipMix(art, player) {
    if (document.pictureInPictureEnabled) {
      nativePip(art, player);
    } else {
      customPip(art, player);
    }

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

  function seekMix$1(art, player) {
    Object.defineProperty(player, 'loaded', {
      get: function get() {
        return art.refs.$video.buffered.length ? art.refs.$video.buffered.end(art.refs.$video.buffered.length - 1) / art.refs.$video.duration : 0;
      }
    });
  }

  function seekMix$2(art, player) {
    Object.defineProperty(player, 'played', {
      get: function get() {
        return art.refs.$video.currentTime / art.refs.$video.duration;
      }
    });
  }

  function resizeMix(art, player) {
    var _art$refs = art.refs,
        $container = _art$refs.$container,
        $player = _art$refs.$player,
        $video = _art$refs.$video;
    Object.defineProperty(player, 'autoSizeState', {
      get: function get() {
        return $container.classList.contains('artplayer-auto-size');
      }
    });
    Object.defineProperty(player, 'autoSize', {
      value: function value() {
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
      }
    });
    Object.defineProperty(player, 'autoSizeRemove', {
      value: function value() {
        $container.classList.remove('artplayer-auto-size');
        setStyle($player, 'width', null);
        setStyle($player, 'height', null);
        art.emit('autoSizeRemove');
      }
    });
  }

  function flipMix(art, player) {
    Object.defineProperty(player, 'flipState', {
      get: function get() {
        return art.refs.$player.dataset.flip;
      }
    });
    Object.defineProperty(player, 'flip', {
      value: function value(flip) {
        var flipList = ['normal', 'horizontal', 'vertical'];
        errorHandle(flipList.includes(flip), "'flip' only accept ".concat(flipList.toString(), " as parameters"));
        art.refs.$player.dataset.flip = flip;
        art.emit('flipChange', flip);
      }
    });
    Object.defineProperty(player, 'flipRemove', {
      value: function value() {
        delete art.refs.$player.dataset.flip;
        art.emit('flipRemove');
      }
    });
  }

  var Player = function Player(art) {
    classCallCheck(this, Player);

    mountUrlMix(art, this);
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
    resizeMix(art, this);
    flipMix(art, this);
  };

  var Mse =
  /*#__PURE__*/
  function () {
    function Mse(art) {
      classCallCheck(this, Mse);

      this.art = art;

      if (art.option.mse) {
        this.init();
      }
    }

    createClass(Mse, [{
      key: "init",
      value: function init() {
        var _this = this;

        var _this$art = this.art,
            player = _this$art.player,
            events = _this$art.events;
        this.setMimeCodec();
        Object.defineProperty(player, 'mountUrl', {
          value: function value() {
            _this.mediaSource = new MediaSource();
            var url = URL.createObjectURL(_this.mediaSource);

            _this.eventBind();

            events.destroyEvents.push(function () {
              URL.revokeObjectURL(url);
            });
            return url;
          }
        });
      }
    }, {
      key: "setMimeCodec",
      value: function setMimeCodec() {
        var option = this.art.option;

        if (!option.type) {
          var type = getExt(option.url);
          errorHandle(Object.keys(config.mimeCodec).includes(type), "Can't find video's type '".concat(type, "' from '").concat(option.url, "'"));
          option.type = type;
        }

        if (!option.mimeCodec) {
          var mimeCodec = config.mimeCodec[option.type];
          errorHandle(mimeCodec, "Can't find video's mimeCodec from ".concat(option.type));
          option.mimeCodec = mimeCodec;
        }

        errorHandle('MediaSource' in window && MediaSource.isTypeSupported(option.mimeCodec), "Unsupported MIME type or codec: ".concat(option.mimeCodec));
      }
    }, {
      key: "eventBind",
      value: function eventBind() {
        var _this2 = this;

        var _this$art2 = this.art,
            option = _this$art2.option,
            proxy = _this$art2.events.proxy;
        var _config$mse = config.mse,
            mediaSource = _config$mse.mediaSource,
            sourceBufferList = _config$mse.sourceBufferList,
            sourceBuffer = _config$mse.sourceBuffer;
        mediaSource.events.forEach(function (eventName) {
          proxy(_this2.mediaSource, eventName, function (event) {
            _this2.art.emit("mediaSource:".concat(event.type), event);
          });
        });
        sourceBufferList.events.forEach(function (eventName) {
          proxy(_this2.mediaSource.sourceBuffers, eventName, function (event) {
            _this2.art.emit("sourceBuffers:".concat(event.type), event);
          });
          proxy(_this2.mediaSource.activeSourceBuffers, eventName, function (event) {
            _this2.art.emit("activeSourceBuffers:".concat(event.type), event);
          });
        });
        this.art.on('mediaSource:sourceopen', function () {
          _this2.sourceBuffer = _this2.mediaSource.addSourceBuffer(option.mimeCodec);
          sourceBuffer.events.forEach(function (eventName) {
            proxy(_this2.sourceBuffer, eventName, function (event) {
              _this2.art.emit("sourceBuffer:".concat(event.type), event);
            });
          });
        });
        this.art.on('sourceBuffer:updateend', function () {
          _this2.mediaSource.endOfStream();
        });
      }
    }]);

    return Mse;
  }();

  function component(art, parent, target, component, callback, title) {
    var option = typeof component === 'function' ? component(art) : component;

    if (!option.disable) {
      parent.id += 1;
      var name = option.name || "".concat(title).concat(parent.id);
      var $element = document.createElement('div');
      $element.classList.value = "art-".concat(title, " art-").concat(title, "-").concat(name);

      if (option.html) {
        append($element, option.html);
      }

      if (option.style) {
        setStyles($element, option.style);
      }

      if (option.click) {
        art.events.proxy($element, 'click', function (event) {
          event.preventDefault();
          option.click.call(parent, event);
          art.emit("".concat(title, ":click"), $element);
        });
      }

      Object.defineProperty(option, '$ref', {
        get: function get() {
          return $element;
        }
      });
      Object.defineProperty(option, 'hide', {
        value: function value() {
          setStyle($element, 'display', 'none');
          art.emit("".concat(title, ":hide"), $element);
        }
      });
      Object.defineProperty(option, 'show', {
        value: function value() {
          setStyle($element, 'display', 'block');
          art.emit("".concat(title, ":show"), $element);
        }
      });
      insertByIndex(target, $element, option.index || parent.id);

      if (option.mounted) {
        option.mounted($element);
      }

      if (callback) {
        callback($element);
      }

      parent[name] = option;
      art.emit("".concat(title, ":add"), option);
    }
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

  var playBig = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"60\" width=\"60\" style=\"filter: drop-shadow(0px 1px 1px black);\" viewBox=\"0 0 24 24\">\n    <path d=\"M20,2H4C1.8,2,0,3.8,0,6v12c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V6C24,3.8,22.2,2,20,2z M15.6,12.8L10.5,16 C9.9,16.5,9,16,9,15.2V8.8C9,8,9.9,7.5,10.5,8l5.1,3.2C16.3,11.5,16.3,12.5,15.6,12.8z\"/>\n</svg>";

  var play = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n  <path d=\"M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z\"></path>\n</svg>";

  var pause = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z\"></path>\n</svg>";

  var volume = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z\"></path>\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z\"></path>\n</svg>";

  var volumeClose = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z\"></path>\n    <path d=\"M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z\"></path>\n</svg>";

  var subtitle = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 48 48\">\n    <path d=\"M0 0h48v48H0z\" fill=\"none\"/>\n    <path d=\"M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z\"/>\n</svg>";

  var screenshot = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 50 50\">\n\t<path d=\"M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z \"/>\n</svg>\n";

  var setting = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <circle cx=\"11\" cy=\"11\" r=\"2\"></circle>\n    <path d=\"M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z\"></path>\n</svg>";

  var fullscreen = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"36\" width=\"36\" viewBox=\"0 0 36 36\">\r\n\t<path d=\"m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z\"></path>\r\n\t<path d=\"m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z\"></path>\r\n\t<path d=\"m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z\"></path>\r\n\t<path d=\"M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z\"></path>\r\n</svg>";

  var fullscreenWeb = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" height=\"36\" width=\"36\">\r\n\t<path d=\"m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z\" fill-rule=\"evenodd\"></path>\r\n</svg>";

  var pip = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" height=\"32\" width=\"32\">\n    <path d=\"M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z\"></path>\n</svg>";

  var prev = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"36\" width=\"36\" viewBox=\"0 0 36 36\">\n    <path d=\"m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z\"></path>\n</svg>";

  var next = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"36\" width=\"36\" viewBox=\"0 0 36 36\">\n    <path d=\"M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z\"></path>\n</svg>";

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

  var icons = creatDomFromSvg({
    loading: loading,
    playBig: playBig,
    play: play,
    pause: pause,
    volume: volume,
    volumeClose: volumeClose,
    subtitle: subtitle,
    screenshot: screenshot,
    setting: setting,
    fullscreen: fullscreen,
    fullscreenWeb: fullscreenWeb,
    pip: pip,
    prev: prev,
    next: next
  });

  function fullscreen$1(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              i18n = art.i18n,
              player = art.player;
          var $fullscreen = append($control, icons.fullscreen);
          tooltip($fullscreen, i18n.get('Fullscreen'));
          proxy($control, 'click', function () {
            player.fullscreenToggle();
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

  function fullscreenWeb$1(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              i18n = art.i18n,
              player = art.player;
          var $fullscreenWeb = append($control, icons.fullscreenWeb);
          tooltip($fullscreenWeb, i18n.get('Web fullscreen'));
          proxy($control, 'click', function () {
            player.fullscreenWebToggle();
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

  function pip$1(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              i18n = art.i18n,
              player = art.player;
          var $pip = append($control, icons.pip);
          tooltip($pip, i18n.get('Mini player'));
          proxy($control, 'click', function () {
            player.pipEnabled();
          });
        }
      });
    };
  }

  function playAndPause(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              player = art.player,
              i18n = art.i18n;
          var $play = append($control, icons.play);
          var $pause = append($control, icons.pause);
          tooltip($play, i18n.get('Play'));
          tooltip($pause, i18n.get('Pause'));
          setStyle($pause, 'display', 'none');
          proxy($play, 'click', function () {
            player.play();
          });
          proxy($pause, 'click', function () {
            player.pause();
          });
          art.on('video:playing', function () {
            setStyle($play, 'display', 'none');
            setStyle($pause, 'display', 'flex');
          });
          art.on('video:pause', function () {
            setStyle($play, 'display', 'flex');
            setStyle($pause, 'display', 'none');
          });
        }
      });
    };
  }

  function getPosFromEvent(art, event) {
    var $progress = art.refs.$progress,
        player = art.player;

    var _$progress$getBoundin = $progress.getBoundingClientRect(),
        left = _$progress$getBoundin.left;

    var width = clamp(event.x - left, 0, $progress.clientWidth);
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
      return objectSpread({}, controlOption, {
        html: "\n                <div class=\"art-control-progress-inner\">\n                    <div class=\"art-progress-loaded\"></div>\n                    <div class=\"art-progress-played\" style=\"background: ".concat(theme, "\"></div>\n                    <div class=\"art-progress-highlight\"></div>\n                    <div class=\"art-progress-indicator\" style=\"background: ").concat(theme, "\"></div>\n                    <div class=\"art-progress-tip art-tip\"></div>\n                </div>\n            "),
        mounted: function mounted($control) {
          var isDroging = false;
          var $loaded = $control.querySelector('.art-progress-loaded');
          var $played = $control.querySelector('.art-progress-played');
          var $highlight = $control.querySelector('.art-progress-highlight');
          var $indicator = $control.querySelector('.art-progress-indicator');
          var $tip = $control.querySelector('.art-progress-tip');

          function showHighlight(event) {
            var _event$target$dataset = event.target.dataset,
                text = _event$target$dataset.text,
                time = _event$target$dataset.time;
            $tip.innerHTML = text;
            var left = Number(time) / art.player.duration * $control.clientWidth + event.target.clientWidth / 2 - $tip.clientWidth / 2;
            setStyle($tip, 'left', "".concat(left, "px"));
          }

          function showTime(event) {
            var _getPosFromEvent = getPosFromEvent(art, event),
                width = _getPosFromEvent.width,
                time = _getPosFromEvent.time;

            var tipWidth = $tip.clientWidth;
            $tip.innerHTML = time;

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
              var _getPosFromEvent2 = getPosFromEvent(art, event),
                  second = _getPosFromEvent2.second,
                  percentage = _getPosFromEvent2.percentage;

              setBar('played', percentage);
              player.seek(second);
            }
          });
          proxy($indicator, 'mousedown', function () {
            isDroging = true;
          });
          proxy(document, 'mousemove', function (event) {
            if (isDroging) {
              var _getPosFromEvent3 = getPosFromEvent(art, event),
                  second = _getPosFromEvent3.second,
                  percentage = _getPosFromEvent3.percentage;

              $indicator.classList.add('art-show-indicator');
              setBar('played', percentage);
              player.seek(second);
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

  function subtitle$1(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
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

  function time(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
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

  function volume$1(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
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

            var percentage = clamp(event.x - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) / (panelWidth - handleWidth);
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
              var width = handleWidth / 2 + (panelWidth - handleWidth) * percentage - handleWidth / 2;
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

  function setting$1(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
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

  function thumbnails(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var $progress = art.refs.$progress,
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
            var perIndex = Math.ceil(posWidth / perWidth);
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

  function screenshot$1(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
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

  function quality(controlOption) {
    return function (art) {
      return objectSpread({}, controlOption, {
        mounted: function mounted($control) {
          var option = art.option,
              proxy = art.events.proxy,
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
      this.art.on('firstCanplay', function () {
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
          disable: false,
          position: 'top',
          index: 10
        }));
        this.add(thumbnails({
          name: 'thumbnails',
          disable: !option.thumbnails.url,
          position: 'top',
          index: 20
        }));
        this.add(playAndPause({
          name: 'playAndPause',
          disable: false,
          position: 'left',
          index: 10
        }));
        this.add(volume$1({
          name: 'volume',
          disable: false,
          position: 'left',
          index: 20
        }));
        this.add(time({
          name: 'time',
          disable: false,
          position: 'left',
          index: 30
        }));
        this.add(quality({
          name: 'quality',
          disable: option.quality.length === 0,
          position: 'right',
          index: 10
        }));
        this.add(screenshot$1({
          name: 'screenshot',
          disable: !option.screenshot,
          position: 'right',
          index: 20
        }));
        this.add(subtitle$1({
          name: 'subtitle',
          disable: !option.subtitle.url,
          position: 'right',
          index: 30
        }));
        this.add(setting$1({
          name: 'setting',
          disable: !option.setting,
          position: 'right',
          index: 40
        }));
        this.add(pip$1({
          name: 'pip',
          disable: !option.pip,
          position: 'right',
          index: 50
        }));
        this.add(fullscreenWeb$1({
          name: 'fullscreenWeb',
          disable: !option.fullscreenWeb,
          position: 'right',
          index: 60
        }));
        this.add(fullscreen$1({
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
        var _this$art$refs = this.art.refs,
            $progress = _this$art$refs.$progress,
            $controlsLeft = _this$art$refs.$controlsLeft,
            $controlsRight = _this$art$refs.$controlsRight;
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

        if (parent) {
          component(this.art, this, parent, option, callback, 'control');
        }
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

  function playbackRate(menuOption) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return objectSpread({}, menuOption, {
        html: "\n                ".concat(i18n.get('Play speed'), ":\n                <span data-rate=\"0.5\">0.5</span>\n                <span data-rate=\"0.75\">0.75</span>\n                <span data-rate=\"1.0\" class=\"normal current\">").concat(i18n.get('Normal'), "</span>\n                <span data-rate=\"1.25\">1.25</span>\n                <span data-rate=\"1.5\">1.5</span>\n                <span data-rate=\"2.0\">2.0</span>\n            "),
        click: function click(event) {
          var target = event.target;
          var rate = target.dataset.rate;

          if (rate) {
            player.playbackRate(Number(rate));
            art.contextmenu.hide();
          }
        },
        mounted: function mounted($menu) {
          art.on('playbackRateChange', function (rate) {
            var $current = Array.from($menu.querySelectorAll('span')).find(function (item) {
              return Number(item.dataset.rate) === rate;
            });
            inverseClass($current, 'current');
          });
        }
      });
    };
  }

  function aspectRatio(menuOption) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return objectSpread({}, menuOption, {
        html: "\n                ".concat(i18n.get('Aspect ratio'), ":\n                <span data-ratio=\"default\" class=\"default current\">").concat(i18n.get('Default'), "</span>\n                <span data-ratio=\"4:3\">4:3</span>\n                <span data-ratio=\"16:9\">16:9</span>\n            "),
        click: function click(event) {
          var target = event.target;
          var ratio = target.dataset.ratio;

          if (ratio) {
            player.aspectRatio(ratio);
            art.contextmenu.hide();
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

  function info(menuOption) {
    return function (art) {
      return objectSpread({}, menuOption, {
        html: art.i18n.get('Video info'),
        click: function click() {
          art.info.show();
          art.contextmenu.hide();
        }
      });
    };
  }

  function version(menuOption) {
    return objectSpread({}, menuOption, {
      html: '<a href="https://github.com/zhw2590582/artplayer" target="_blank">ArtPlayer 1.0.3</a>'
    });
  }

  function close(menuOption) {
    return function (art) {
      return objectSpread({}, menuOption, {
        html: art.i18n.get('Close'),
        click: function click() {
          art.contextmenu.hide();
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
      this.art.on('firstCanplay', function () {
        _this.init();
      });
    }

    createClass(Contextmenu, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var _this$art = this.art,
            option = _this$art.option,
            _this$art$refs = _this$art.refs,
            $player = _this$art$refs.$player,
            $contextmenu = _this$art$refs.$contextmenu,
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

          _this2.show();

          _this2.setPos(event);
        });
        proxy($player, 'click', function (event) {
          if (!event.composedPath().includes($contextmenu)) {
            _this2.hide();
          }
        });
      }
    }, {
      key: "add",
      value: function add(item, callback) {
        var $contextmenu = this.art.refs.$contextmenu;
        component(this.art, this, $contextmenu, item, callback, 'contextmenu');
      }
    }, {
      key: "setPos",
      value: function setPos(event) {
        var _this$art$refs2 = this.art.refs,
            $player = _this$art$refs2.$player,
            $contextmenu = _this$art$refs2.$contextmenu;
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
      key: "hide",
      value: function hide() {
        var $contextmenu = this.art.refs.$contextmenu;
        setStyle($contextmenu, 'display', 'none');
        this.art.emit('contextmenu:hide', $contextmenu);
      }
    }, {
      key: "show",
      value: function show() {
        var $contextmenu = this.art.refs.$contextmenu;
        setStyle($contextmenu, 'display', 'block');
        this.art.emit('contextmenu:show', $contextmenu);
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
          append($infoPanel, Info.creatInfo());
          this.getHeader();
        }

        clearTimeout(this.timer);
        this.loop();
        this.art.emit('info:show', $info);
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
    }], [{
      key: "creatInfo",
      value: function creatInfo() {
        var infoHtml = [];
        infoHtml.push("\n          <div class=\"art-info-item \">\n            <div class=\"art-info-title\">Player version:</div>\n            <div class=\"art-info-content\">1.0.3</div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video url:</div>\n            <div class=\"art-info-content\" data-video=\"currentSrc\"></div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video type:</div>\n            <div class=\"art-info-content\" data-head=\"Content-Type\"></div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video size:</div>\n            <div class=\"art-info-content\" data-head=\"Content-length\"></div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video volume:</div>\n            <div class=\"art-info-content\" data-video=\"volume\"></div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video time:</div>\n            <div class=\"art-info-content\" data-video=\"currentTime\"></div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video duration:</div>\n            <div class=\"art-info-content\" data-video=\"duration\"></div>\n          </div>\n        ");
        infoHtml.push("\n          <div class=\"art-info-item\">\n            <div class=\"art-info-title\">Video resolution:</div>\n            <div class=\"art-info-content\">\n              <span data-video=\"videoWidth\"></span> x <span data-video=\"videoHeight\"></span>\n            </div>\n          </div>\n        ");
        return infoHtml.join('');
      }
    }]);

    return Info;
  }();

  var Subtitle =
  /*#__PURE__*/
  function () {
    function Subtitle(art) {
      classCallCheck(this, Subtitle);

      this.art = art;
      this.state = true;
      var url = this.art.option.subtitle.url;

      if (url) {
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
        $video.appendChild($track);
        this.art.refs.$track = $track;
        this.load(subtitle.url).then(function (vttText) {
          $track.src = vttToBlob(vttText);

          _this.art.emit('subtitle:load', vttText);

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
        var notice = this.art.notice;
        var type;
        return fetch(url).then(function (response) {
          type = response.headers.get('Content-Type');
          return response.text();
        }).then(function (text) {
          var vttText = '';

          if (/x-subrip/gi.test(type)) {
            vttText = srtToVtt(text);
          } else {
            vttText = text;
          }

          return vttText;
        }).catch(function (err) {
          notice.show(err);
          console.warn(err);
          throw err;
        });
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
        var _this2 = this;

        var $track = this.art.refs.$track;
        errorHandle($track, 'You need to initialize the subtitle option first.');
        this.load(url).then(function (vttText) {
          $track.src = vttToBlob(vttText);

          _this2.art.emit('subtitle:load', vttText);

          _this2.art.emit('subtitle:switch', url);
        });
      }
    }]);

    return Subtitle;
  }();

  function clickInit(art, events) {
    var $player = art.refs.$player;
    events.proxy(document, ['click', 'contextmenu'], function (event) {
      if (event.composedPath().indexOf($player) > -1) {
        art.isFocus = true;
      } else {
        art.isFocus = false;
        art.contextmenu.hide();
      }
    });
  }

  function hoverInit(art, events) {
    var $player = art.refs.$player;
    events.hover($player, function () {
      $player.classList.add('artplayer-hover');
      art.emit('hoverenter');
    }, function () {
      $player.classList.remove('artplayer-hover');
      art.emit('hoverleave');
    });
  }

  function mousemoveInitInit(art, events) {
    var _art$refs = art.refs,
        $player = _art$refs.$player,
        $video = _art$refs.$video;
    var autoHide = debounce(function () {
      $player.classList.add('artplayer-hide-cursor');
      $player.classList.remove('artplayer-hover');
      art.controls.hide();
    }, 5000);
    art.on('hoverleave', function () {
      if (art.isPlaying) {
        autoHide();
      }
    });
    events.proxy($player, 'mousemove', function (event) {
      autoHide.clearTimeout();
      $player.classList.remove('artplayer-hide-cursor');
      art.controls.show();

      if (!art.player.pipState && art.isPlaying && event.target === $video) {
        autoHide();
      }
    });
  }

  var ContentRect_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var ContentRect = function (target) {
      if ('getBBox' in target) {
          var box = target.getBBox();
          return Object.freeze({
              height: box.height,
              left: 0,
              top: 0,
              width: box.width,
          });
      }
      else { // if (target instanceof HTMLElement) { // also includes all other non-SVGGraphicsElements
          var styles = window.getComputedStyle(target);
          return Object.freeze({
              height: parseFloat(styles.height || '0'),
              left: parseFloat(styles.paddingLeft || '0'),
              top: parseFloat(styles.paddingTop || '0'),
              width: parseFloat(styles.width || '0'),
          });
      }
  };
  exports.ContentRect = ContentRect;
  //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGVudFJlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQ29udGVudFJlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSxJQUFNLFdBQVcsR0FBRyxVQUFDLE1BQWU7SUFDaEMsSUFBSSxTQUFTLElBQUssTUFBNkIsRUFBRTtRQUM3QyxJQUFNLEdBQUcsR0FBSSxNQUE2QixDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNqQixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07WUFDbEIsSUFBSSxFQUFFLENBQUM7WUFDUCxHQUFHLEVBQUUsQ0FBQztZQUNOLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSztTQUNuQixDQUFDLENBQUM7S0FDTjtTQUFNLEVBQUUsMEZBQTBGO1FBQy9GLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDakIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztZQUN4QyxJQUFJLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDO1lBQzNDLEdBQUcsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUM7WUFDekMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQztTQUN6QyxDQUFDLENBQUM7S0FDTjtBQUNMLENBQUMsQ0FBQztBQUVPLGtDQUFXIn0=
  });

  unwrapExports(ContentRect_1);
  var ContentRect_2 = ContentRect_1.ContentRect;

  var ResizeObservation_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  var ResizeObservation = /** @class */ (function () {
      function ResizeObservation(target) {
          this.target = target;
          this.$$broadcastWidth = this.$$broadcastHeight = 0;
      }
      Object.defineProperty(ResizeObservation.prototype, "broadcastWidth", {
          get: function () {
              return this.$$broadcastWidth;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ResizeObservation.prototype, "broadcastHeight", {
          get: function () {
              return this.$$broadcastHeight;
          },
          enumerable: true,
          configurable: true
      });
      ResizeObservation.prototype.isActive = function () {
          var cr = ContentRect_1.ContentRect(this.target);
          return !!cr
              && (cr.width !== this.broadcastWidth
                  || cr.height !== this.broadcastHeight);
      };
      return ResizeObservation;
  }());
  exports.ResizeObservation = ResizeObservation;
  //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzaXplT2JzZXJ2YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUmVzaXplT2JzZXJ2YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNEM7QUFFNUM7SUFlSSwyQkFBWSxNQUFlO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFWRCxzQkFBVyw2Q0FBYzthQUF6QjtZQUNJLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQ2pDLENBQUM7OztPQUFBO0lBQ0Qsc0JBQVcsOENBQWU7YUFBMUI7WUFDSSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNsQyxDQUFDOzs7T0FBQTtJQU9NLG9DQUFRLEdBQWY7UUFDSSxJQUFNLEVBQUUsR0FBRyx5QkFBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwQyxPQUFPLENBQUMsQ0FBQyxFQUFFO2VBQ0osQ0FDQyxFQUFFLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxjQUFjO21CQUM3QixFQUFFLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxlQUFlLENBQ3hDLENBQUM7SUFDVixDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDO0FBRVEsOENBQWlCIn0=
  });

  unwrapExports(ResizeObservation_1);
  var ResizeObservation_2 = ResizeObservation_1.ResizeObservation;

  var ResizeObserverEntry_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  var ResizeObserverEntry = /** @class */ (function () {
      function ResizeObserverEntry(target) {
          this.target = target;
          this.contentRect = ContentRect_1.ContentRect(target);
      }
      return ResizeObserverEntry;
  }());
  exports.ResizeObserverEntry = ResizeObserverEntry;
  //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzaXplT2JzZXJ2ZXJFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXNpemVPYnNlcnZlckVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTRDO0FBRTVDO0lBR0ksNkJBQVksTUFBZTtRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLHlCQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFUSxrREFBbUIifQ==
  });

  unwrapExports(ResizeObserverEntry_1);
  var ResizeObserverEntry_2 = ResizeObserverEntry_1.ResizeObserverEntry;

  var ResizeObserver_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  var resizeObservers = [];
  var ResizeObserver = /** @class */ (function () {
      function ResizeObserver(callback) {
          /** @internal */
          this.$$observationTargets = [];
          /** @internal */
          this.$$activeTargets = [];
          /** @internal */
          this.$$skippedTargets = [];
          var message = callbackGuard(callback);
          if (message) {
              throw TypeError(message);
          }
          this.$$callback = callback;
          resizeObservers.push(this);
      }
      ResizeObserver.prototype.observe = function (target) {
          var message = targetGuard('observe', target);
          if (message) {
              throw TypeError(message);
          }
          var index = findTargetIndex(this.$$observationTargets, target);
          if (index > 0) {
              return;
          }
          this.$$observationTargets.push(new ResizeObservation_1.ResizeObservation(target));
          startLoop();
      };
      ResizeObserver.prototype.unobserve = function (target) {
          var message = targetGuard('unobserve', target);
          if (message) {
              throw TypeError(message);
          }
          var index = findTargetIndex(this.$$observationTargets, target);
          if (index < 0) {
              return;
          }
          this.$$observationTargets.splice(index, 1);
          checkStopLoop();
      };
      ResizeObserver.prototype.disconnect = function () {
          this.$$observationTargets = [];
          this.$$activeTargets = [];
      };
      return ResizeObserver;
  }());
  exports.ResizeObserver = ResizeObserver;
  function callbackGuard(callback) {
      if (typeof (callback) === 'undefined') {
          return "Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.";
      }
      if (typeof (callback) !== 'function') {
          return "Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.";
      }
  }
  function targetGuard(functionName, target) {
      if (typeof (target) === 'undefined') {
          return "Failed to execute '" + functionName + "' on 'ResizeObserver': 1 argument required, but only 0 present.";
      }
      if (!(target instanceof window.Element)) {
          return "Failed to execute '" + functionName + "' on 'ResizeObserver': parameter 1 is not of type 'Element'.";
      }
  }
  function findTargetIndex(collection, target) {
      for (var index = 0; index < collection.length; index += 1) {
          if (collection[index].target === target) {
              return index;
          }
      }
      return -1;
  }
  var gatherActiveObservationsAtDepth = function (depth) {
      resizeObservers.forEach(function (ro) {
          ro.$$activeTargets = [];
          ro.$$skippedTargets = [];
          ro.$$observationTargets.forEach(function (ot) {
              if (ot.isActive()) {
                  var targetDepth = calculateDepthForNode(ot.target);
                  if (targetDepth > depth) {
                      ro.$$activeTargets.push(ot);
                  }
                  else {
                      ro.$$skippedTargets.push(ot);
                  }
              }
          });
      });
  };
  var hasActiveObservations = function () {
      return resizeObservers.some(function (ro) { return !!ro.$$activeTargets.length; });
  };
  var hasSkippedObservations = function () {
      return resizeObservers.some(function (ro) { return !!ro.$$skippedTargets.length; });
  };
  var broadcastActiveObservations = function () {
      var shallowestTargetDepth = Infinity;
      resizeObservers.forEach(function (ro) {
          if (!ro.$$activeTargets.length) {
              return;
          }
          var entries = [];
          ro.$$activeTargets.forEach(function (obs) {
              var entry = new ResizeObserverEntry_1.ResizeObserverEntry(obs.target);
              entries.push(entry);
              obs.$$broadcastWidth = entry.contentRect.width;
              obs.$$broadcastHeight = entry.contentRect.height;
              var targetDepth = calculateDepthForNode(obs.target);
              if (targetDepth < shallowestTargetDepth) {
                  shallowestTargetDepth = targetDepth;
              }
          });
          ro.$$callback(entries, ro);
          ro.$$activeTargets = [];
      });
      return shallowestTargetDepth;
  };
  var deliverResizeLoopErrorNotification = function () {
      var errorEvent = new window.ErrorEvent('ResizeLoopError', {
          message: 'ResizeObserver loop completed with undelivered notifications.',
      });
      window.dispatchEvent(errorEvent);
  };
  var calculateDepthForNode = function (target) {
      var depth = 0;
      while (target.parentNode) {
          target = target.parentNode;
          depth += 1;
      }
      return depth;
  };
  var notificationIteration = function () {
      var depth = 0;
      gatherActiveObservationsAtDepth(depth);
      while (hasActiveObservations()) {
          depth = broadcastActiveObservations();
          gatherActiveObservationsAtDepth(depth);
      }
      if (hasSkippedObservations()) {
          deliverResizeLoopErrorNotification();
      }
  };
  var animationFrameCancelToken;
  var startLoop = function () {
      if (animationFrameCancelToken)
          return;
      runLoop();
  };
  var runLoop = function () {
      animationFrameCancelToken = window.requestAnimationFrame(function () {
          notificationIteration();
          runLoop();
      });
  };
  var checkStopLoop = function () {
      if (animationFrameCancelToken && !resizeObservers.some(function (ro) { return !!ro.$$observationTargets.length; })) {
          window.cancelAnimationFrame(animationFrameCancelToken);
          animationFrameCancelToken = undefined;
      }
  };
  var install = function () {
      return window.ResizeObserver = ResizeObserver;
  };
  exports.install = install;
  //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzaXplT2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUmVzaXplT2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5REFBd0Q7QUFFeEQsNkRBQTREO0FBRTVELElBQU0sZUFBZSxHQUFHLEVBQXNCLENBQUM7QUFFL0M7SUFVSSx3QkFBWSxRQUFnQztRQVA1QyxnQkFBZ0I7UUFDVCx5QkFBb0IsR0FBRyxFQUF5QixDQUFDO1FBQ3hELGdCQUFnQjtRQUNULG9CQUFlLEdBQUcsRUFBeUIsQ0FBQztRQUNuRCxnQkFBZ0I7UUFDVCxxQkFBZ0IsR0FBRyxFQUF5QixDQUFDO1FBR2hELElBQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxJQUFJLE9BQU8sRUFBRTtZQUNULE1BQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDM0IsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU0sZ0NBQU8sR0FBZCxVQUFlLE1BQWU7UUFDMUIsSUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvQyxJQUFJLE9BQU8sRUFBRTtZQUNULE1BQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsSUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDWCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUkscUNBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5RCxTQUFTLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRU0sa0NBQVMsR0FBaEIsVUFBaUIsTUFBZTtRQUM1QixJQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELElBQUksT0FBTyxFQUFFO1lBQ1QsTUFBTSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUI7UUFDRCxJQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pFLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNYLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNDLGFBQWEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxtQ0FBVSxHQUFqQjtRQUNJLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQWpERCxJQWlEQztBQXVJRyx3Q0FBYztBQXJJbEIsU0FBUyxhQUFhLENBQUMsUUFBZ0M7SUFDbkQsSUFBSSxPQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssV0FBVyxFQUFFO1FBQ2xDLE9BQU8sZ0ZBQWdGLENBQUM7S0FDM0Y7SUFDRCxJQUFJLE9BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxVQUFVLEVBQUU7UUFDakMsT0FBTywrRkFBK0YsQ0FBQztLQUMxRztBQUNMLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxZQUFvQixFQUFFLE1BQWU7SUFDdEQsSUFBSSxPQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssV0FBVyxFQUFFO1FBQ2hDLE9BQU8sd0JBQXNCLFlBQVksb0VBQWlFLENBQUM7S0FDOUc7SUFDRCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQWEsTUFBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzlDLE9BQU8sd0JBQXNCLFlBQVksaUVBQThELENBQUM7S0FDM0c7QUFDTCxDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsVUFBK0IsRUFBRSxNQUFlO0lBQ3JFLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7UUFDdkQsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtZQUNyQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtLQUNKO0lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNkLENBQUM7QUFFRCxJQUFNLCtCQUErQixHQUFHLFVBQUMsS0FBYTtJQUNsRCxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtRQUN2QixFQUFFLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUN4QixFQUFFLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFO1lBQy9CLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNmLElBQU0sV0FBVyxHQUFHLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckQsSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFFO29CQUNyQixFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDL0I7cUJBQU07b0JBQ0gsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDaEM7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFFRixJQUFNLHFCQUFxQixHQUFHO0lBQzFCLE9BQUEsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFDLEVBQUUsSUFBSyxPQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBM0IsQ0FBMkIsQ0FBQztBQUF6RCxDQUF5RCxDQUFDO0FBRTlELElBQU0sc0JBQXNCLEdBQUc7SUFDM0IsT0FBQSxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQUMsRUFBRSxJQUFLLE9BQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQTVCLENBQTRCLENBQUM7QUFBMUQsQ0FBMEQsQ0FBQztBQUUvRCxJQUFNLDJCQUEyQixHQUFHO0lBQ2hDLElBQUkscUJBQXFCLEdBQUcsUUFBUSxDQUFDO0lBQ3JDLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFO1FBQ3ZCLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRTtZQUM1QixPQUFPO1NBQ1Y7UUFFRCxJQUFNLE9BQU8sR0FBRyxFQUEyQixDQUFDO1FBQzVDLEVBQUUsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztZQUMzQixJQUFNLEtBQUssR0FBRyxJQUFJLHlDQUFtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUMvQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDakQsSUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RELElBQUksV0FBVyxHQUFHLHFCQUFxQixFQUFFO2dCQUNyQyxxQkFBcUIsR0FBRyxXQUFXLENBQUM7YUFDdkM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxxQkFBcUIsQ0FBQztBQUNqQyxDQUFDLENBQUM7QUFFRixJQUFNLGtDQUFrQyxHQUFHO0lBQ3ZDLElBQU0sVUFBVSxHQUFHLElBQUssTUFBYyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtRQUNqRSxPQUFPLEVBQUUsK0RBQStEO0tBQzNFLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDckMsQ0FBQyxDQUFDO0FBRUYsSUFBTSxxQkFBcUIsR0FBRyxVQUFDLE1BQVk7SUFDdkMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsT0FBTyxNQUFNLENBQUMsVUFBVSxFQUFFO1FBQ3RCLE1BQU0sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQzNCLEtBQUssSUFBSSxDQUFDLENBQUM7S0FDZDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLElBQU0scUJBQXFCLEdBQUc7SUFDMUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsK0JBQStCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkMsT0FBTyxxQkFBcUIsRUFBRSxFQUFFO1FBQzVCLEtBQUssR0FBRywyQkFBMkIsRUFBRSxDQUFDO1FBQ3RDLCtCQUErQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFDO0lBRUQsSUFBSSxzQkFBc0IsRUFBRSxFQUFFO1FBQzFCLGtDQUFrQyxFQUFFLENBQUM7S0FDeEM7QUFDTCxDQUFDLENBQUM7QUFFRixJQUFJLHlCQUE2QyxDQUFDO0FBRWxELElBQU0sU0FBUyxHQUFHO0lBQ2QsSUFBSSx5QkFBeUI7UUFBRSxPQUFPO0lBRXRDLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBRUYsSUFBTSxPQUFPLEdBQUc7SUFDWix5QkFBeUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7UUFDckQscUJBQXFCLEVBQUUsQ0FBQztRQUN4QixPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBRUYsSUFBTSxhQUFhLEdBQUc7SUFDbEIsSUFBSSx5QkFBeUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFFLElBQUssT0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBaEMsQ0FBZ0MsQ0FBQyxFQUFFO1FBQzlGLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3ZELHlCQUF5QixHQUFHLFNBQVMsQ0FBQztLQUN6QztBQUNMLENBQUMsQ0FBQztBQUVGLElBQU0sT0FBTyxHQUFHO0lBQ1osT0FBQyxNQUFjLENBQUMsY0FBYyxHQUFHLGNBQWM7QUFBL0MsQ0FBK0MsQ0FBQztBQUdoRCwwQkFBTyJ9
  });

  unwrapExports(ResizeObserver_1);
  var ResizeObserver_2 = ResizeObserver_1.ResizeObserver;
  var ResizeObserver_3 = ResizeObserver_1.install;

  function resizeInit(art, events) {
    var option = art.option,
        $player = art.refs.$player;
    var resizeObserver = new ResizeObserver_2(function () {
      sleep().then(function () {
        if (option.autoSize) {
          if (!art.player.fullscreenState && !art.player.fullscreenWebState && !art.player.pipState) {
            art.player.autoSize();
          } else {
            art.player.autoSizeRemove();
          }
        }

        art.player.aspectRatioReset();
        art.emit('resize', $player);
      });
    });
    resizeObserver.observe($player);
    events.destroyEvents.push(function () {
      resizeObserver.unobserve($player);
    });
  }

  function doubleClickInit(art, events) {
    var $video = art.refs.$video;
    events.proxy($video, 'dblclick', function () {
      art.player.fullscreenToggle();
      art.emit('dblclick');
    });
  }

  var Events =
  /*#__PURE__*/
  function () {
    function Events(art) {
      classCallCheck(this, Events);

      this.destroyEvents = [];
      this.proxy = this.proxy.bind(this);
      this.hover = this.hover.bind(this);
      this.loadImg = this.loadImg.bind(this);
      clickInit(art, this);
      hoverInit(art, this);
      mousemoveInitInit(art, this);
      resizeInit(art, this);
      doubleClickInit(art, this);
    }

    createClass(Events, [{
      key: "proxy",
      value: function proxy(target, name, callback) {
        var _this = this;

        var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        if (Array.isArray(name)) {
          name.forEach(function (item) {
            return _this.proxy(target, item, callback, option);
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
      key: "loadImg",
      value: function loadImg(img) {
        var _this2 = this;

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

          _this2.proxy(image, 'load', function () {
            return resolve(image);
          });

          _this2.proxy(image, 'error', function () {
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

      if (this.art.option.hotkey) {
        this.art.on('firstCanplay', function () {
          _this.init();
        });
      }
    }

    createClass(Hotkey, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var _this$art = this.art,
            player = _this$art.player,
            proxy = _this$art.events.proxy;
        proxy(window, 'keydown', function (event) {
          if (_this2.art.isFocus) {
            var tag = document.activeElement.tagName.toUpperCase();
            var editable = document.activeElement.getAttribute('contenteditable');

            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
              _this2.art.emit('hotkey', event);

              switch (event.keyCode) {
                case 39:
                  event.preventDefault();
                  player.seek(player.currentTime + 10);
                  break;

                case 37:
                  event.preventDefault();
                  player.seek(player.currentTime - 10);
                  break;

                case 38:
                  event.preventDefault();
                  player.volume += 0.05;
                  break;

                case 40:
                  event.preventDefault();
                  player.volume -= 0.05;
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

  var Layers =
  /*#__PURE__*/
  function () {
    function Layers(art) {
      var _this = this;

      classCallCheck(this, Layers);

      this.id = 0;
      this.art = art;
      this.add = this.add.bind(this);
      this.art.option.layers.forEach(function (item) {
        _this.add(item);
      });
    }

    createClass(Layers, [{
      key: "add",
      value: function add(item, callback) {
        var $layers = this.art.refs.$layers;
        component(this.art, this, $layers, item, callback, 'layer');
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
      append($loading, option.icons.loading || icons.loading);
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
      var $playBig = append($mask, '<div class="art-playBig"></div>');
      append($playBig, option.icons.playBig || icons.playBig);
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

  function flip(settingOption) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return objectSpread({}, settingOption, {
        html: "\n                <div class=\"art-setting-header\">".concat(i18n.get('Flip'), "</div>\n                <div class=\"art-setting-body\">\n                    <div class=\"art-setting-btns\">\n                        <div class=\"art-setting-btn current\">\n                            <span data-flip=\"normal\">").concat(i18n.get('Normal'), "</span>\n                        </div>\n                        <div class=\"art-setting-btn\">\n                            <span data-flip=\"horizontal\">").concat(i18n.get('Horizontal'), "</span>\n                        </div>\n                        <div class=\"art-setting-btn\">\n                            <span data-flip=\"vertical\">").concat(i18n.get('Vertical'), "</span>\n                        </div>\n                    </div>\n                </div>\n            "),
        click: function click(event) {
          var target = event.target;
          var flip = target.dataset.flip;

          if (flip) {
            player.flip(flip);
          }
        },
        mounted: function mounted($setting) {
          art.on('flipChange', function (flip) {
            var $current = Array.from($setting.querySelectorAll('span')).find(function (item) {
              return item.dataset.flip === flip;
            });
            inverseClass($current.parentElement, 'current');
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
        this.art.on('firstCanplay', function () {
          _this.init();
        });
      }
    }

    createClass(Setting, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var _this$art = this.art,
            $settingClose = _this$art.refs.$settingClose,
            proxy = _this$art.events.proxy;
        proxy($settingClose, 'click', function () {
          _this2.hide();
        });
        this.add(flip({
          disable: false,
          name: 'flip',
          index: 10
        }));
      }
    }, {
      key: "add",
      value: function add(item, callback) {
        var $settingBody = this.art.refs.$settingBody;
        component(this.art, this, $settingBody, item, callback, 'setting');
      }
    }, {
      key: "show",
      value: function show() {
        var $setting = this.art.refs.$setting;
        setStyle($setting, 'display', 'flex');
        this.state = true;
        this.art.emit('setting:show', $setting);
      }
    }, {
      key: "hide",
      value: function hide() {
        var $setting = this.art.refs.$setting;
        setStyle($setting, 'display', 'none');
        this.state = false;
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

  var Storage =
  /*#__PURE__*/
  function () {
    function Storage(art) {
      var _this = this;

      classCallCheck(this, Storage);

      this.art = art;
      this.storageName = 'artplayer_settings';
      sleep().then(function () {
        _this.initVolume();
      });
    }

    createClass(Storage, [{
      key: "get",
      value: function get(key) {
        var storage = JSON.parse(localStorage.getItem(this.storageName)) || {};
        return key ? storage[key] : {};
      }
    }, {
      key: "set",
      value: function set(key, value) {
        var storage = Object.assign({}, this.get(), defineProperty({}, key, value));
        localStorage.setItem(this.storageName, JSON.stringify(storage));
      }
    }, {
      key: "initVolume",
      value: function initVolume() {
        var player = this.art.player;
        var volume = this.get('volume');

        if (volume) {
          player.volume = volume;
        }
      }
    }]);

    return Storage;
  }();

  var Plugins =
  /*#__PURE__*/
  function () {
    function Plugins(art) {
      var _this = this;

      classCallCheck(this, Plugins);

      this.art = art;
      this.id = 0;
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

        this[pluginName] = result;
        this.art.emit('plugin:add', plugin);
        return this;
      }
    }]);

    return Plugins;
  }();

  var id = 0;

  var Artplayer =
  /*#__PURE__*/
  function (_Emitter) {
    inherits(Artplayer, _Emitter);

    function Artplayer(option) {
      var _this;

      classCallCheck(this, Artplayer);

      _this = possibleConstructorReturn(this, getPrototypeOf(Artplayer).call(this));
      _this.option = deepmerge_1(Artplayer.DEFAULTS, option);
      optionValidator(_this.option, scheme);

      _this.init();

      return _this;
    }

    createClass(Artplayer, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        this.isFocus = false;
        this.isPlaying = false;
        this.refs = {};

        if (this.option.container instanceof Element) {
          this.refs.$container = this.option.container;
        } else {
          this.refs.$container = document.querySelector(this.option.container);
        }

        if (Artplayer.instances.some(function (art) {
          return art.refs.$container === _this2.refs.$container;
        })) {
          errorHandle(false, 'Cannot mount multiple instances on the same dom element');
        }

        this.template = new Template(this);
        this.storage = new Storage(this);
        this.i18n = new I18n(this);
        this.notice = new Notice(this);
        this.events = new Events(this);
        this.player = new Player(this);
        this.mse = new Mse(this);
        this.layers = new Layers(this);
        this.controls = new Controls(this);
        this.contextmenu = new Contextmenu(this);
        this.subtitle = new Subtitle(this);
        this.info = new Info(this);
        this.loading = new Loading(this);
        this.hotkey = new Hotkey(this);
        this.mask = new Mask(this);
        this.setting = new Setting(this);
        this.plugins = new Plugins(this);
        id += 1;
        this.id = id;
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
      key: "version",
      get: function get() {
        return '1.0.3';
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
      key: "DEFAULTS",
      get: function get() {
        return {
          container: '#artplayer',
          url: '',
          poster: '',
          title: '',
          type: '',
          mimeCodec: '',
          theme: '#f00',
          volume: 0.7,
          mse: false,
          muted: false,
          autoplay: false,
          autoSize: false,
          loop: false,
          playbackRate: false,
          aspectRatio: false,
          screenshot: false,
          setting: false,
          hotkey: true,
          pip: false,
          mutex: true,
          fullscreen: false,
          fullscreenWeb: false,
          layers: [],
          contextmenu: [],
          quality: [],
          controls: [],
          highlight: [],
          plugins: [],
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
          icons: {
            loading: '',
            playBig: ''
          },
          lang: navigator.language.toLowerCase()
        };
      }
    }]);

    return Artplayer;
  }(tinyEmitter);

  Object.defineProperty(Artplayer, 'instances', {
    value: []
  });
  window.Artplayer = Artplayer;

  exports.default = Artplayer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer.js.map
