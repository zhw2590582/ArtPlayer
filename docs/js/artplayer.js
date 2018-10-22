(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.artplayer = {})));
}(this, (function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

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

	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}

	var isNativeFunction = _isNativeFunction;

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

	  return parent;
	}
	function setStyle(element, styles) {
	  Object.keys(styles).forEach(function (key) {
	    element.style[key] = styles[key];
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
	      var _arr = Object.entries(source);

	      for (var _i2 = 0; _i2 < _arr.length; _i2++) {
	        var _arr$_i = slicedToArray(_arr[_i2], 2),
	            key = _arr$_i[0],
	            value = _arr$_i[1];

	        if (isObject(value) && Reflect.has(returnValue, key)) {
	          value = deepMerge(returnValue[key], value);
	        }

	        returnValue = objectSpread({}, returnValue, defineProperty({}, key, value));
	      }
	    }
	  }

	  return returnValue;
	}

	function validOption(option) {
	  errorHandle(option.container, '\'container\' option is required.');
	  errorHandle(option.url, '\'url\' option is required.');
	  errorHandle(typeof option.container === 'string' || option.container instanceof Element, "'container' option require 'string' or 'Element' type, but got '".concat(_typeof_1(option.container), "'."));
	  errorHandle(typeof option.url === 'string', "'url' option require 'string' type, but got '".concat(_typeof_1(option.url), "'."));
	  errorHandle(typeof option.poster === 'string', "'poster' option require 'string' type, but got '".concat(_typeof_1(option.poster), "'."));
	  errorHandle(Object.prototype.toString.call(option.thumbnails) === '[object Object]', "'thumbnails' option require 'object' type, but got '".concat(_typeof_1(option.thumbnails), "'."));
	  errorHandle(typeof option.volume === 'number', "'volume' option require 'number' type, but got '".concat(_typeof_1(option.volume), "'."));
	  errorHandle(typeof option.autoplay === 'boolean', "'autoplay' option require 'boolean' type, but got '".concat(_typeof_1(option.autoplay), "'."));
	  errorHandle(typeof option.loop === 'boolean', "'loop' option require 'boolean' type, but got '".concat(_typeof_1(option.loop), "'."));
	  errorHandle(['none', 'metadata', 'auto'].indexOf(option.preload) > -1, "'preload' option require one of 'none\u3001metadata\u3001auto', but got '".concat(option.preload, "."));
	  errorHandle(typeof option.lang === 'string', "'lang' option require 'string' type, but got '".concat(_typeof_1(option.lang), "'."));
	  errorHandle(typeof option.type === 'string', "'type' option require 'string' type, but got '".concat(_typeof_1(option.type), "'."));
	  errorHandle(typeof option.mimeCodec === 'string', "'mimeCodec' option require 'string' type, but got '".concat(_typeof_1(option.mimeCodec), "'."));
	  errorHandle(Array.isArray(option.layers), "'layers' option require 'array' type, but got '".concat(_typeof_1(option.layers), "'."));
	  errorHandle(Array.isArray(option.contextmenu), "'contextmenu' option require 'array' type, but got '".concat(_typeof_1(option.contextmenu), "'."));
	  errorHandle(typeof option.loading === 'string' || option.loading instanceof Element, "'loading' option require 'string' type, but got '".concat(_typeof_1(option.loading), "'."));
	  errorHandle(typeof option.theme === 'string', "'theme' option require 'string' type, but got '".concat(_typeof_1(option.theme), "'."));
	  errorHandle(typeof option.hotkey === 'boolean', "'hotkey' option require 'boolean' type, but got '".concat(_typeof_1(option.hotkey), "'."));
	  errorHandle(Object.prototype.toString.call(option.subtitle) === '[object Object]', "'subtitle' option require 'object' type, but got '".concat(_typeof_1(option.subtitle), "'."));
	  errorHandle(Array.isArray(option.controls), "'controls' option require 'array' type, but got '".concat(_typeof_1(option.controls), "'."));
	  errorHandle(Array.isArray(option.highlight), "'highlight' option require 'array' type, but got '".concat(_typeof_1(option.highlight), "'."));
	}

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

	var Template =
	/*#__PURE__*/
	function () {
	  function Template(art) {
	    classCallCheck(this, Template);

	    this.art = art;
	    this.init();
	  }

	  createClass(Template, [{
	    key: "init",
	    value: function init() {
	      var refs = this.art.refs;
	      refs.$container.innerHTML = "\n        <div class=\"artplayer-video-player\">\n          <video class=\"artplayer-video\" webkit-playsinline playsinline></video>\n          <div class=\"artplayer-subtitle\"></div>\n          <div class=\"artplayer-layers\"></div>\n          <div class=\"artplayer-mask\"></div>\n          <div class=\"artplayer-bottom\">\n            <div class=\"artplayer-progress\"></div>\n            <div class=\"artplayer-controls\">\n              <div class=\"artplayer-controls-left\"></div>\n              <div class=\"artplayer-controls-right\"></div>\n            </div>\n          </div>\n          <div class=\"artplayer-loading\"></div>\n          <div class=\"artplayer-notice\"></div>\n          <div class=\"artplayer-info\">\n            <div class=\"artplayer-info-panel\"></div>\n            <div class=\"artplayer-info-close\">[x]</div>\n          </div>\n        </div>\n      ";
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
	      refs.$mask = refs.$container.querySelector('.artplayer-mask');
	      refs.$info = refs.$container.querySelector('.artplayer-info');
	      refs.$infoPanel = refs.$container.querySelector('.artplayer-info-panel');
	      refs.$infoClose = refs.$container.querySelector('.artplayer-info-close');
	    }
	  }]);

	  return Template;
	}();

	var i18nMap = {
	  'zh-cn': {
	    'About author': '关于作者',
	    'Video info': '视频统计信息',
	    'Close': '关闭',
	    'Video load failed': '视频加载失败',
	    'Volume': '音量',
	    'Start': '开始',
	    'Pause': '暂停',
	    'Rate': '速度'
	  },
	  'zh-tw': {
	    'About author': '關於作者',
	    'Video info': '影片統計訊息',
	    'Close': '關閉',
	    'Video load failed': '影片載入失敗',
	    'Volume': '音量',
	    'Start': '開始',
	    'Pause': '暫停',
	    'Rate': '速度'
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

	var Player =
	/*#__PURE__*/
	function () {
	  function Player(art) {
	    classCallCheck(this, Player);

	    this.art = art;
	    this.init();
	    this.eventBind();
	  }

	  createClass(Player, [{
	    key: "init",
	    value: function init() {
	      var option = this.art.option;
	      var $video = this.art.refs.$video;
	      $video.controls = false;
	      $video.poster = option.poster;
	      $video.volume = clamp(option.volume, 0, 1);
	      $video.autoplay = option.autoplay;
	      $video.preload = option.preload;
	      $video.src = option.url;
	    }
	  }, {
	    key: "eventBind",
	    value: function eventBind() {
	      var _this = this;

	      var _this$art = this.art,
	          proxy = _this$art.events.proxy,
	          _this$art$refs = _this$art.refs,
	          $player = _this$art$refs.$player,
	          $video = _this$art$refs.$video,
	          i18n = _this$art.i18n,
	          notice = _this$art.notice;
	      config.video.events.forEach(function (eventName) {
	        proxy($video, eventName, function (event) {
	          _this.art.emit("video:".concat(event.type), event);
	        });
	      });
	      this.art.on('video:loadstart', function () {
	        _this.art.loading.show();
	      });
	      this.art.on('video:loadeddata', function () {
	        _this.art.loading.hide();
	      });
	      this.art.on('video:waiting', function () {
	        _this.art.loading.show();
	      });
	      this.art.on('video:seeking', function () {
	        _this.art.loading.show();
	      });
	      this.art.on('video:canplay', function () {
	        _this.art.controls.show();

	        _this.art.mask.show();

	        _this.art.loading.hide();

	        if (_this.art.option.autoplay) {
	          var promise = _this.play();

	          if (promise !== undefined) {
	            promise.then().catch(function (err) {
	              console.warn(err);
	            });
	          }
	        }
	      });
	      this.art.on('video:playing', function () {
	        _this.art.isPlaying = true;

	        _this.art.controls.hide();

	        _this.art.mask.hide();
	      });
	      this.art.on('video:pause', function () {
	        _this.art.isPlaying = false;

	        _this.art.controls.show();

	        _this.art.mask.show();
	      });
	      this.art.on('video:ended', function () {
	        _this.art.isPlaying = false;

	        _this.art.controls.show();

	        _this.art.mask.show();

	        if (_this.art.option.loop) {
	          _this.seek(0);

	          _this.play();
	        }
	      });
	      this.art.on('video:error', function () {
	        _this.art.isError = true;
	        _this.art.isPlaying = false;

	        _this.art.loading.hide();

	        _this.art.controls.hide();

	        $player.classList.add('artplayer-error');
	        notice.show(i18n.get('Video load failed'), false);

	        _this.art.destroy();
	      });
	    }
	  }, {
	    key: "play",
	    value: function play() {
	      var _this$art2 = this.art,
	          $video = _this$art2.refs.$video,
	          i18n = _this$art2.i18n,
	          notice = _this$art2.notice;
	      var promise = $video.play();
	      notice.show(i18n.get('Start'));
	      this.art.emit('play', $video);
	      return promise;
	    }
	  }, {
	    key: "pause",
	    value: function pause() {
	      var _this$art3 = this.art,
	          $video = _this$art3.refs.$video,
	          i18n = _this$art3.i18n,
	          notice = _this$art3.notice;
	      $video.pause();
	      notice.show(i18n.get('Pause'));
	      this.art.emit('pause', $video);
	    }
	  }, {
	    key: "toggle",
	    value: function toggle() {
	      if (this.art.isPlaying) {
	        this.pause();
	      } else {
	        this.play();
	      }
	    }
	  }, {
	    key: "seek",
	    value: function seek(time) {
	      var _this$art4 = this.art,
	          $video = _this$art4.refs.$video,
	          notice = _this$art4.notice;
	      var newTime = Math.max(time, 0);

	      if ($video.duration) {
	        newTime = Math.min(newTime, $video.duration);
	      }

	      $video.currentTime = newTime;
	      notice.show("".concat(secondToTime(newTime), " / ").concat(secondToTime($video.duration)));
	      this.art.emit('seek', newTime);
	    }
	  }, {
	    key: "volume",
	    value: function volume(percentage) {
	      var _this$art5 = this.art,
	          $video = _this$art5.refs.$video,
	          i18n = _this$art5.i18n,
	          notice = _this$art5.notice;

	      if (percentage) {
	        $video.volume = clamp(percentage, 0, 1);
	        notice.show("".concat(i18n.get('Volume'), ": ").concat(parseInt($video.volume * 100)));
	        this.art.emit('volume', $video.volume);
	      }

	      return $video.volume;
	    }
	  }, {
	    key: "currentTime",
	    value: function currentTime() {
	      return this.art.refs.$video.currentTime;
	    }
	  }, {
	    key: "duration",
	    value: function duration() {
	      return this.art.refs.$video.duration;
	    }
	  }, {
	    key: "playbackRate",
	    value: function playbackRate(rate) {
	      var _this$art6 = this.art,
	          $video = _this$art6.refs.$video,
	          i18n = _this$art6.i18n,
	          notice = _this$art6.notice;
	      var newRate = clamp(rate, 0.1, 10);
	      $video.playbackRate = newRate;
	      notice.show("".concat(i18n.get('Rate'), ": ").concat(newRate, "x"));
	      this.art.emit('playbackRate', newRate);
	    }
	  }]);

	  return Player;
	}();

	function validControl(option) {
	  errorHandle(typeof option.control === 'function', "'control' option require 'function' type, but got '".concat(_typeof_1(option.control), "'."));
	  errorHandle(typeof option.disable === 'boolean', "'disable' option require 'boolean' type, but got '".concat(_typeof_1(option.disable), "'."));
	  errorHandle(['top', 'left', 'right'].indexOf(option.position) > -1, "'position' option require one of 'top\u3001left\u3001right', but got '".concat(option.position, "'."));
	  errorHandle(typeof option.index === 'number', "'index' option require 'number' type, but got '".concat(_typeof_1(option.index), "'."));
	}

	var Danmu = function Danmu(art, option) {
	  classCallCheck(this, Danmu);

	  this.art = art;
	  this.option = option;
	};

	var Fullscreen = function Fullscreen(art, option) {
	  classCallCheck(this, Fullscreen);

	  this.art = art;
	  this.option = option;
	};

	var Pip = function Pip(art, option) {
	  classCallCheck(this, Pip);

	  this.art = art;
	  this.option = option;
	};

	var PlayAndPause = function PlayAndPause(art, option) {
	  classCallCheck(this, PlayAndPause);

	  this.art = art;
	  this.option = option;
	};

	var Progress =
	/*#__PURE__*/
	function () {
	  function Progress(art, option) {
	    classCallCheck(this, Progress);

	    this.art = art;
	    this.option = option;
	    this.isDroging = false;
	    this.getLoaded = this.getLoaded.bind(this);
	    this.getPlayed = this.getPlayed.bind(this);
	    this.set = this.set.bind(this);
	    this.init();
	  }

	  createClass(Progress, [{
	    key: "init",
	    value: function init() {
	      var _this = this;

	      var _this$art = this.art,
	          _this$art$option = _this$art.option,
	          highlight = _this$art$option.highlight,
	          theme = _this$art$option.theme,
	          proxy = _this$art.events.proxy,
	          $video = _this$art.refs.$video,
	          player = _this$art.player;
	      append(this.option.ref, "\n        <div class=\"art-control-progress-inner\">\n          <div class=\"art-progress-loaded\"></div>\n          <div class=\"art-progress-played\" style=\"background: ".concat(theme, "\"></div>\n          <div class=\"art-progress-highlight\"></div>\n          <div class=\"art-progress-indicator\" style=\"background: ").concat(theme, "\"></div>\n          <div class=\"art-progress-tip art-tip\"></div>\n        </div>\n      "));
	      this.$loaded = this.option.ref.querySelector('.art-progress-loaded');
	      this.$played = this.option.ref.querySelector('.art-progress-played');
	      this.$highlight = this.option.ref.querySelector('.art-progress-highlight');
	      this.$indicator = this.option.ref.querySelector('.art-progress-indicator');
	      this.$tip = this.option.ref.querySelector('.art-progress-tip');
	      this.art.on('video:canplay', function () {
	        _this.set('loaded', _this.getLoaded());

	        highlight.forEach(function (item) {
	          var left = Number(item.time) / $video.duration;
	          append(_this.$highlight, "\n          <span data-text=\"".concat(item.text, "\" data-time=\"").concat(item.time, "\" style=\"left: ").concat(left * 100, "%\"></span>\n        "));
	        });
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
	      proxy(this.option.ref, 'mousemove', function (event) {
	        _this.$tip.style.display = 'block';

	        if (event.path.indexOf(_this.$highlight) > -1) {
	          _this.showHighlight(event);
	        } else {
	          _this.showTime(event);
	        }
	      });
	      proxy(this.option.ref, 'mouseout', function () {
	        _this.$tip.style.display = 'none';
	      });
	      proxy(this.option.ref, 'click', function (event) {
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
	      var left = Number(time) / $video.duration * this.option.ref.clientWidth + event.target.clientWidth / 2 - this.$tip.clientWidth / 2;
	      this.$tip.style.left = "".concat(left, "px");
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
	        this.$tip.style.left = 0;
	      } else if (width > this.option.ref.clientWidth - tipWidth / 2) {
	        this.$tip.style.left = "".concat(this.option.ref.clientWidth - tipWidth, "px");
	      } else {
	        this.$tip.style.left = "".concat(width - tipWidth / 2, "px");
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
	    key: "set",
	    value: function set(type, percentage) {
	      this["$".concat(type)].style.width = "".concat(percentage * 100, "%");

	      if (type === 'played') {
	        this.$indicator.style.left = "calc(".concat(percentage * 100, "% - 6.5px)");
	      }
	    }
	  }]);

	  return Progress;
	}();

	var Subtitle = function Subtitle(art, option) {
	  classCallCheck(this, Subtitle);

	  this.art = art;
	  this.option = option;
	};

	var Time = function Time(art, option) {
	  classCallCheck(this, Time);

	  this.art = art;
	  this.option = option;
	};

	var Volume = function Volume(art, option) {
	  classCallCheck(this, Volume);

	  this.art = art;
	  this.option = option;
	};

	var Setting = function Setting(art, option) {
	  classCallCheck(this, Setting);

	  this.art = art;
	  this.option = option;
	};

	var Thumbnails =
	/*#__PURE__*/
	function () {
	  function Thumbnails(art, option) {
	    classCallCheck(this, Thumbnails);

	    this.art = art;
	    this.option = option;
	    this.init();
	  }

	  createClass(Thumbnails, [{
	    key: "init",
	    value: function init() {
	      var _this = this;

	      var _this$art = this.art,
	          $progress = _this$art.refs.$progress,
	          proxy = _this$art.events.proxy;
	      proxy($progress, 'mousemove', function (event) {
	        _this.option.ref.style.display = 'block';

	        _this.showThumbnails(event);
	      });
	      proxy($progress, 'mouseout', function () {
	        _this.option.ref.style.display = 'none';
	      });
	    }
	  }, {
	    key: "showThumbnails",
	    value: function showThumbnails(event) {
	      var $progress = this.art.refs.$progress;

	      var _this$getPosFromEvent = this.getPosFromEvent(event),
	          posWidth = _this$getPosFromEvent.width;

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
	      this.option.ref.style.backgroundImage = "url(".concat(url, ")");
	      this.option.ref.style.height = "".concat(height, "px");
	      this.option.ref.style.width = "".concat(width, "px");
	      this.option.ref.style.backgroundPosition = "-".concat(--xIndex * width, "px -").concat(--yIndex * height, "px");

	      if (posWidth <= width / 2) {
	        this.option.ref.style.left = 0;
	      } else if (posWidth > $progress.clientWidth - width / 2) {
	        this.option.ref.style.left = "".concat($progress.clientWidth - width, "px");
	      } else {
	        this.option.ref.style.left = "".concat(posWidth - width / 2, "px");
	      }
	    }
	  }]);

	  return Thumbnails;
	}();

	var id = 0;

	var Controls =
	/*#__PURE__*/
	function () {
	  function Controls(art) {
	    classCallCheck(this, Controls);

	    this.art = art;
	    this.$map = {
	      top: [],
	      left: [],
	      right: []
	    };
	    this.init();
	    this.mount();
	  }

	  createClass(Controls, [{
	    key: "init",
	    value: function init() {
	      var _this = this;

	      this.add({
	        control: Progress,
	        disable: false,
	        position: 'top',
	        index: 10
	      });
	      this.add({
	        control: Thumbnails,
	        disable: !this.art.option.thumbnails.url,
	        position: 'top',
	        index: 20
	      });
	      this.add({
	        control: PlayAndPause,
	        disable: false,
	        position: 'left',
	        index: 10
	      });
	      this.add({
	        control: Volume,
	        disable: false,
	        tooltip: 'Volume',
	        position: 'left',
	        index: 20
	      });
	      this.add({
	        control: Time,
	        disable: false,
	        tooltip: 'Volume',
	        position: 'left',
	        index: 30
	      });
	      this.add({
	        control: Danmu,
	        disable: false,
	        tooltip: 'Danmu',
	        position: 'right',
	        index: 10
	      });
	      this.add({
	        control: Subtitle,
	        disable: false,
	        tooltip: 'Subtitle',
	        position: 'right',
	        index: 20
	      });
	      this.add({
	        control: Setting,
	        disable: false,
	        tooltip: 'Setting',
	        position: 'right',
	        index: 30
	      });
	      this.add({
	        control: Pip,
	        disable: false,
	        tooltip: 'Pip',
	        position: 'right',
	        index: 40
	      });
	      this.add({
	        control: Fullscreen,
	        disable: false,
	        tooltip: 'Fullscreen',
	        position: 'right',
	        index: 50
	      });
	      this.art.option.controls.forEach(function (item) {
	        _this.add(item);
	      });
	    }
	  }, {
	    key: "add",
	    value: function add(option) {
	      validControl(option);

	      if (!option.disable) {
	        id++;
	        var name = option.control.name.toLowerCase() || "control".concat(id);
	        var $control = document.createElement('div');
	        $control.setAttribute('class', "art-control art-control-".concat(name));
	        $control.setAttribute('data-control-index', String(option.index) || id);
	        option.ref = $control;
	        this.commonMethod(option);
	        this[name] = new option.control(this.art, option);
	        this.$map[option.position].push($control);
	      }
	    }
	  }, {
	    key: "mount",
	    value: function mount() {
	      var _this2 = this;

	      var _this$art$refs = this.art.refs,
	          $progress = _this$art$refs.$progress,
	          $controlsLeft = _this$art$refs.$controlsLeft,
	          $controlsRight = _this$art$refs.$controlsRight;
	      Object.keys(this.$map).forEach(function (key) {
	        _this2.$map[key].sort(function (a, b) {
	          return Number(a.dataset.controlIndex) - Number(b.dataset.controlIndex);
	        }).forEach(function ($control) {
	          switch (key) {
	            case 'top':
	              $progress.appendChild($control);
	              break;

	            case 'left':
	              $controlsLeft.appendChild($control);
	              break;

	            case 'right':
	              $controlsRight.appendChild($control);
	              break;

	            default:
	              break;
	          }
	        });
	      });
	    }
	  }, {
	    key: "commonMethod",
	    value: function commonMethod(option) {
	      var _this3 = this;

	      Object.defineProperty(option.control.prototype, 'hide', {
	        value: function value() {
	          option.ref.style.display = 'none';

	          _this3.art.emit('control:hide', option.ref);
	        }
	      });
	      Object.defineProperty(option.control.prototype, 'show', {
	        value: function value() {
	          option.ref.style.display = option.position === 'top' ? 'block' : 'inline-block';

	          _this3.art.emit('control:show', option.ref);
	        }
	      });
	      Object.defineProperty(option.control.prototype, 'getPosFromEvent', {
	        value: function value(event) {
	          var _this3$art$refs = _this3.art.refs,
	              $video = _this3$art$refs.$video,
	              $progress = _this3$art$refs.$progress;

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
	      });
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      var $player = this.art.refs.$player;
	      $player.classList.add('controls-show');
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      var $player = this.art.refs.$player;
	      $player.classList.remove('controls-show');
	    }
	  }]);

	  return Controls;
	}();

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
	          i18n = _this$art.i18n,
	          refs = _this$art.refs,
	          proxy = _this$art.events.proxy;
	      option.contextmenu.push({
	        text: i18n.get('Video info'),
	        click: function click() {
	          _this.art.info.show();
	        }
	      }, {
	        text: i18n.get('About author'),
	        link: 'https://github.com/zhw2590582'
	      }, {
	        text: 'ArtPlayer 1.0.0',
	        link: 'https://github.com/zhw2590582/artplayer'
	      }, {
	        text: i18n.get('Close'),
	        click: function click() {
	          _this.hide();
	        }
	      });
	      proxy(refs.$player, 'contextmenu', function (event) {
	        event.preventDefault();
	        _this.art.isFocus = true;

	        if (!refs.$contextmenu) {
	          _this.creatMenu();
	        }

	        _this.show();

	        _this.setPos(event);
	      });
	      proxy(refs.$player, 'click', function (event) {
	        if (refs.$contextmenu && !event.path.includes(refs.$contextmenu)) {
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
	      option.contextmenu.forEach(function (item) {
	        var $menu = document.createElement('a');
	        $menu.innerHTML = item.text;
	        $menu.classList.add('art-menu');

	        if (item.link) {
	          $menu.target = '_blank';
	          $menu.href = item.link;
	        } else if (item.click) {
	          $menu.href = '#';
	          proxy($menu, 'click', function (event) {
	            event.preventDefault();
	            item.click(_this2.art, event);

	            _this2.hide();
	          });
	        }

	        append(refs.$contextmenu, $menu);
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

	      refs.$contextmenu.style.left = "".concat(menuLeft, "px");
	      refs.$contextmenu.style.top = "".concat(menuTop, "px");
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      var $contextmenu = this.art.refs.$contextmenu;

	      if ($contextmenu) {
	        $contextmenu.style.display = 'none';
	        this.art.emit('contextmenu:hide', $contextmenu);
	      }
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      var $contextmenu = this.art.refs.$contextmenu;

	      if ($contextmenu) {
	        $contextmenu.style.display = 'block';
	        this.art.emit('contextmenu:show', $contextmenu);
	      }
	    }
	  }]);

	  return Contextmenu;
	}();

	var Danmu$1 = function Danmu(art) {
	  classCallCheck(this, Danmu);

	  this.art = art;
	};

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
	          $infoClose = _this$art.refs.$infoClose,
	          proxy = _this$art.events.proxy;
	      proxy($infoClose, 'click', function () {
	        _this.hide();
	      });
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      var _this$art$refs = this.art.refs,
	          $info = _this$art$refs.$info,
	          $infoPanel = _this$art$refs.$infoPanel;
	      $info.style.display = 'block';

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
	      var _this$art2 = this.art,
	          url = _this$art2.option.url,
	          $infoPanel = _this$art2.refs.$infoPanel;
	      var types = Array.from($infoPanel.querySelectorAll('[data-head]'));
	      fetch(url, {
	        method: 'HEAD'
	      }).then(function (data) {
	        types.forEach(function (item) {
	          item.innerHTML = data.headers.get(item.dataset.head) || 'unknown';
	        });
	      }).catch(function () {
	        types.forEach(function (item) {
	          item.innerHTML = 'unknown';
	        });
	      });
	    }
	  }, {
	    key: "loop",
	    value: function loop() {
	      var _this2 = this;

	      var _this$art$refs2 = this.art.refs,
	          $infoPanel = _this$art$refs2.$infoPanel,
	          $video = _this$art$refs2.$video;
	      this.timer = setTimeout(function () {
	        var types = Array.from($infoPanel.querySelectorAll('[data-video]'));
	        types.forEach(function (item) {
	          item.innerHTML = $video[item.dataset.video] || 'unknown';
	        });

	        _this2.loop();
	      }, 1000);
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      var $info = this.art.refs.$info;
	      $info.style.display = 'none';
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
	    this.checkExt(this.art.option.subtitle.url);
	    this.init();
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
	      setStyle($subtitle, subtitle.style || {});
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

	      var type;
	      return fetch(url).then(function (response) {
	        type = response.headers.get('Content-Type');
	        return response.text();
	      }).then(function (text) {
	        if (/x-subrip/gi.test(type)) {
	          return _this2.srtToVtt(text);
	        }

	        return url;
	      }).catch(function (err) {
	        throw err;
	      });
	    }
	  }, {
	    key: "srtToVtt",
	    value: function srtToVtt(text) {
	      var vttText = 'WEBVTT \r\n\r\n'.concat(text.replace(/\{\\([ibu])\}/g, '</$1>').replace(/\{\\([ibu])1\}/g, '<$1>').replace(/\{([ibu])\}/g, '<$1>').replace(/\{\/([ibu])\}/g, '</$1>').replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2').concat('\r\n\r\n'));
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
	      var $subtitle = this.art.refs.$subtitle;
	      $subtitle.style.display = 'block';
	      this.art.emit('subtitle:show', $subtitle);
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      var $subtitle = this.art.refs.$subtitle;
	      $subtitle.style.display = 'none';
	      this.art.emit('subtitle:hide', $subtitle);
	    }
	  }, {
	    key: "switch",
	    value: function _switch(url) {
	      var _this3 = this;

	      var $track = this.art.refs.$track;
	      this.checkExt(url);
	      errorHandle($track, 'You need to initialize the subtitle option first.');
	      this.load(url).then(function (data) {
	        if (url !== data) {
	          $track.src = data;

	          _this3.art.emit('subtitle:switch', url);
	        }
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
	      }

	      target.addEventListener(name, callback, option);
	      this.destroyEvents.push(function () {
	        target.removeEventListener(name, callback, option);
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
	          $player = _this$art.refs.$player,
	          proxy = _this$art.events.proxy;
	      proxy(document, 'click', function (event) {
	        _this.art.isFocus = event.path.indexOf($player) > -1;
	      });
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

	var id$1 = 0;

	var Layers =
	/*#__PURE__*/
	function () {
	  function Layers(art) {
	    classCallCheck(this, Layers);

	    this.art = art;
	    this.add = this.add.bind(this);
	    this.art.option.layers.forEach(this.add);
	    this.init();
	  }

	  createClass(Layers, [{
	    key: "init",
	    value: function init() {
	      var _this$art = this.art,
	          refs = _this$art.refs,
	          player = _this$art.player,
	          proxy = _this$art.events.proxy;
	      proxy(refs.$layers, 'click', function (event) {
	        if (event.path[0] === refs.$layers) {
	          player.pause();
	        }
	      });
	    }
	  }, {
	    key: "add",
	    value: function add(option, callback) {
	      var refs = this.art.refs;
	      id$1++;
	      var $layer = document.createElement('div');
	      $layer.setAttribute('data-art-layer-id', id$1);
	      $layer.setAttribute('class', "art-layer art-layer-".concat(option.name || id$1));
	      $layer.style.zIndex = option.index || id$1;
	      append($layer, option.html);
	      setStyle($layer, option.style || {});
	      refs.$layers.appendChild($layer);
	      this.art.emit('layers:add', $layer);
	      callback && callback($layer);
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      var $layers = this.art.refs.$layers;
	      $layers.style.display = 'block';
	      this.art.emit('layers:show', $layers);
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      var $layers = this.art.refs.$layers;
	      $layers.style.display = 'none';
	      this.art.emit('layers:hide', $layers);
	    }
	  }]);

	  return Layers;
	}();

	var loading = "<svg class=\"lds-spinner\" width=\"80px\" height=\"80px\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" style=\"background: none;\"><g transform=\"rotate(0 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.9166666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(30 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.8333333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(60 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.75s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(90 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.6666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(120 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.5833333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(150 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.5s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(180 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.4166666666666667s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(210 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.3333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(240 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.25s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(270 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.16666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(300 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.08333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(330 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"9.4\" ry=\"4.8\" width=\"6\" height=\"12\" fill=\"#ffffff\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"0s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g></svg>\n";

	var play = "<svg id=\"plyr-play\" width=\"16px\" height=\"18px\">\n  <path d=\"M15.562 8.1L3.87.225C3.052-.337 2 .225 2 1.125v15.75c0 .9 1.052 1.462 1.87.9L15.563 9.9c.584-.45.584-1.35 0-1.8z\"></path>\n</svg>\n";

	var icons = {
	  loading: loading,
	  play: play
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

	var Loading =
	/*#__PURE__*/
	function () {
	  function Loading(art) {
	    classCallCheck(this, Loading);

	    this.art = art;
	    this.init();
	  }

	  createClass(Loading, [{
	    key: "init",
	    value: function init() {
	      var _this$art = this.art,
	          option = _this$art.option,
	          $loading = _this$art.refs.$loading;
	      append($loading, option.loading || icons$1.loading);
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      var $loading = this.art.refs.$loading;
	      $loading.style.display = 'none';
	      this.art.emit('loading:hide', $loading);
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      var $loading = this.art.refs.$loading;
	      $loading.style.display = 'flex';
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
	      var $notice = this.art.refs.$notice;
	      $notice.style.display = 'block';
	      $notice.innerHTML = msg instanceof Error ? msg.message.trim() : msg;

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
	      $notice.style.display = 'none';
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
	    this.init();
	  }

	  createClass(Mask, [{
	    key: "init",
	    value: function init() {
	      var _this = this;

	      var _this$art = this.art,
	          player = _this$art.player,
	          option = _this$art.option,
	          refs = _this$art.refs,
	          proxy = _this$art.events.proxy;
	      var playClone = icons$1.play.cloneNode(true);
	      playClone.style.backgroundColor = option.theme;
	      append(refs.$mask, playClone);
	      proxy(refs.$mask, 'click', function () {
	        player.play();

	        _this.hide();
	      });
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      var $mask = this.art.refs.$mask;
	      $mask.style.display = 'flex';
	      this.art.emit('mask:show', $mask);
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      var $mask = this.art.refs.$mask;
	      $mask.style.display = 'none';
	      this.art.emit('mask:show', $mask);
	    }
	  }]);

	  return Mask;
	}();

	var id$2 = 0;
	var instances = [];

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
	    validOption(_this.option);

	    _this.init();

	    _this.emit('init:end');

	    return _this;
	  }

	  createClass(Artplayer, [{
	    key: "init",
	    value: function init() {
	      this.isError = false;
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
	      this.id = id$2++;
	      instances.push(this);
	      return this;
	    }
	  }, {
	    key: "destroy",
	    value: function destroy() {
	      var removeHtml = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	      this.events.destroy();
	      instances.splice(instances.indexOf(this), 1);

	      if (removeHtml) {
	        this.refs.$container.innerHTML = '';
	      }

	      this.emit('destroy');
	    }
	  }], [{
	    key: "use",
	    value: function use(Plugin) {
	      var name = Plugin.name.toLowerCase();
	      var installedPlugins = this.plugins || (this.plugins = {});

	      if (!installedPlugins[name]) {
	        var args = Array.from(arguments).slice(1);
	        args.unshift(this);
	        installedPlugins[name] = construct(Plugin, toConsumableArray(args));
	        this.prototype.emit('use', Plugin);
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
	        thumbnails: {
	          url: '',
	          number: 60,
	          width: 160,
	          height: 90,
	          column: 10
	        },
	        volume: 0.7,
	        autoplay: false,
	        loop: false,
	        preload: 'auto',
	        type: '',
	        mimeCodec: '',
	        layers: [],
	        contextmenu: [],
	        loading: '',
	        theme: '#f00',
	        hotkey: true,
	        subtitle: {
	          url: '',
	          style: {}
	        },
	        controls: [],
	        highlight: [],
	        lang: navigator.language.toLowerCase()
	      };
	    }
	  }]);

	  return Artplayer;
	}(tinyEmitter);

	window.Artplayer = Artplayer;

	exports.instances = instances;
	exports.default = Artplayer;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer.js.map
