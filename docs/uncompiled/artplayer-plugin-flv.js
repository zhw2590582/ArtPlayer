(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['artplayer-plugin-flv'] = {})));
}(this, (function (exports) { 'use strict';

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

	function E() {// Keep this empty so it's easier to inherit from
	  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
	}

	E.prototype = {
	  on: function on(name, callback, ctx) {
	    var e = this.e || (this.e = {});
	    (e[name] || (e[name] = [])).push({
	      fn: callback,
	      ctx: ctx
	    });
	    return this;
	  },
	  once: function once(name, callback, ctx) {
	    var self = this;

	    function listener() {
	      self.off(name, listener);
	      callback.apply(ctx, arguments);
	    }
	    listener._ = callback;
	    return this.on(name, listener, ctx);
	  },
	  emit: function emit(name) {
	    var data = [].slice.call(arguments, 1);
	    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
	    var i = 0;
	    var len = evtArr.length;

	    for (i; i < len; i++) {
	      evtArr[i].fn.apply(evtArr[i].ctx, data);
	    }

	    return this;
	  },
	  off: function off(name, callback) {
	    var e = this.e || (this.e = {});
	    var evts = e[name];
	    var liveEvents = [];

	    if (evts && callback) {
	      for (var i = 0, len = evts.length; i < len; i++) {
	        if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
	      }
	    } // Remove event from queue to prevent memory leak
	    // Suggested by https://github.com/lazd
	    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910


	    liveEvents.length ? e[name] = liveEvents : delete e[name];
	    return this;
	  }
	};
	var tinyEmitter = E;

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

	var FlvError =
	/*#__PURE__*/
	function (_Error) {
	  inherits(FlvError, _Error);

	  function FlvError(message, context) {
	    var _this;

	    classCallCheck(this, FlvError);

	    _this = possibleConstructorReturn(this, getPrototypeOf(FlvError).call(this, message));

	    if (typeof Error.captureStackTrace === 'function') {
	      Error.captureStackTrace(assertThisInitialized(assertThisInitialized(_this)), context || _this.constructor);
	    }

	    _this.name = 'FlvError';
	    return _this;
	  }

	  return FlvError;
	}(wrapNativeSuper(Error));
	function errorHandle(condition, msg) {
	  if (!condition) {
	    throw new FlvError(msg);
	  }
	}

	var CheckSupport = function CheckSupport() {
	  classCallCheck(this, CheckSupport);

	  var MP4H264MimeCodec = 'video/mp4; codecs="avc1.42001E, mp4a.40.2"';
	  var videoElement = window.document.createElement('video');
	  var canPlay = videoElement.canPlayType(MP4H264MimeCodec);
	  errorHandle(window.MediaSource && window.MediaSource.isTypeSupported(MP4H264MimeCodec) && (canPlay === 'probably' || canPlay === 'maybe'), "Unsupported MIME type or codec: ".concat(MP4H264MimeCodec));
	  errorHandle(typeof window.Promise === 'function', "Unsupported 'Promise' method");
	  errorHandle(typeof window.fetch === 'function', "Unsupported 'fetch' method");
	};

	var CreatMediaSource = function CreatMediaSource(art) {
	  classCallCheck(this, CreatMediaSource);

	  this.mediaSource = new MediaSource();
	  this.url = URL.createObjectURL(this.mediaSource);
	};

	var Flv =
	/*#__PURE__*/
	function (_Emitter) {
	  inherits(Flv, _Emitter);

	  function Flv(mediaElement, url) {
	    var _this;

	    classCallCheck(this, Flv);

	    _this = possibleConstructorReturn(this, getPrototypeOf(Flv).call(this));
	    _this.support = new CheckSupport();

	    if (mediaElement) {
	      _this.attachMediaElement(mediaElement);
	    }

	    if (url) {
	      _this.loadUrl(url);
	    }

	    return _this;
	  }

	  createClass(Flv, [{
	    key: "attachMediaElement",
	    value: function attachMediaElement(mediaElement) {
	      errorHandle(mediaElement instanceof HTMLVideoElement && mediaElement.tagName === 'VIDEO', "The 'mediaElement' does not seem to be a HTMLVideoElement");
	      this.mediaElement = mediaElement;
	      return this;
	    }
	  }, {
	    key: "loadUrl",
	    value: function loadUrl(url) {
	      var type = _typeof_1(url);

	      errorHandle(type === 'string', "The 'url' require 'string' type, but got '".concat(type, "'"));
	      this.url = url;
	      return this;
	    }
	  }, {
	    key: "start",
	    value: function start() {
	      this.mediaSource = new CreatMediaSource();
	      console.log('start');
	      return this;
	    }
	  }]);

	  return Flv;
	}(tinyEmitter);

	window.Flv = Flv;

	function artplayerPluginFlv(art) {
	  var $video = art.template.$video;
	  var flv = new Flv($video);
	  return {
	    load: function load(url) {
	      return new Promise(function (resolve) {
	        flv.loadUrl(url).start();
	        return resolve(flv.mediaSource.url);
	      });
	    }
	  };
	}

	window.artplayerPluginFlv = artplayerPluginFlv;

	exports.default = artplayerPluginFlv;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer-plugin-flv.js.map
