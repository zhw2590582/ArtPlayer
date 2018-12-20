(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['artplayer-plugin-flv'] = {})));
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
  function mergeTypedArrays(a, b) {
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  var utils = /*#__PURE__*/Object.freeze({
    FlvError: FlvError,
    errorHandle: errorHandle,
    mergeTypedArrays: mergeTypedArrays
  });

  function checkSupport(options) {
    var mediaElement = options.mediaElement,
        url = options.url;
    errorHandle(mediaElement instanceof HTMLVideoElement, 'The first parameter is not a video tag element');
    errorHandle(typeof url === 'string' || url instanceof File && url.type === 'video/x-flv', 'The second parameter is not a string type or flv file');
    var MP4H264MimeCodec = 'video/mp4; codecs="avc1.42001E, mp4a.40.2"';
    var canPlay = mediaElement.canPlayType(MP4H264MimeCodec);
    errorHandle(window.MediaSource && window.MediaSource.isTypeSupported(MP4H264MimeCodec) && (canPlay === 'probably' || canPlay === 'maybe'), "Unsupported MIME type or codec: ".concat(MP4H264MimeCodec));
    errorHandle(typeof window.Promise === 'function', "Unsupported 'Promise' method");
    errorHandle(typeof window.fetch === 'function', "Unsupported 'fetch' method");
    errorHandle(typeof window.Worker === 'function', "Unsupported 'Worker' method");
    errorHandle(typeof window.ReadableStream === 'function', "Unsupported 'ReadableStream' method");
  }

  var EventProxy =
  /*#__PURE__*/
  function () {
    function EventProxy() {
      classCallCheck(this, EventProxy);

      this.destroyEvents = [];
      this.proxy = this.proxy.bind(this);
    }

    createClass(EventProxy, [{
      key: "proxy",
      value: function proxy(target, name, callback) {
        var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
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

    return EventProxy;
  }();

  var CreatWorker =
  /*#__PURE__*/
  function () {
    function CreatWorker() {
      classCallCheck(this, CreatWorker);

      this.workers = new Map();
    }

    createClass(CreatWorker, [{
      key: "add",
      value: function add(name, fn) {
        if (!this.workers.has(name)) {
          this.workers.set(name, CreatWorker.create(fn));
        }
      }
    }, {
      key: "run",
      value: function run(name) {
        var worker = this.workers.get(name);

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return worker.post(args);
      }
    }, {
      key: "kill",
      value: function kill(name) {
        var worker = this.workers.get(name);
        worker.kill();
      }
    }, {
      key: "killAll",
      value: function killAll() {
        this.workers.forEach(function (worker) {
          worker.kill();
        });
      }
    }], [{
      key: "fnToStr",
      value: function fnToStr(fn) {
        return "\n           self.onmessage = event => {\n               return self.postMessage((".concat(fn, ").apply(null, event.data));\n           }\n         ");
      }
    }, {
      key: "create",
      value: function create(fn) {
        var blob = new Blob([CreatWorker.fnToStr(fn)], {
          type: 'application/javascript'
        });
        var objectURL = window.URL.createObjectURL(blob);
        var worker = new Worker(objectURL);

        worker.kill = function () {
          URL.revokeObjectURL(objectURL);
          worker.terminate();
        };

        worker.post = function (args) {
          return new Promise(function (resolve, reject) {
            worker.onmessage = function (event) {
              resolve(event.data);
            };

            worker.onerror = function (error) {
              reject(error);
            };

            worker.postMessage(args);
          });
        };

        return worker;
      }
    }]);

    return CreatWorker;
  }();

  var config = {
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

  var CreatMediaSource =
  /*#__PURE__*/
  function () {
    function CreatMediaSource(flv) {
      classCallCheck(this, CreatMediaSource);

      this.flv = flv;
      this.creatUrl();
      this.eventBind();
    }

    createClass(CreatMediaSource, [{
      key: "creatUrl",
      value: function creatUrl() {
        var _this$flv = this.flv,
            mediaElement = _this$flv.options.mediaElement,
            destroyEvents = _this$flv.events.destroyEvents;
        this.mediaSource = new MediaSource();
        var url = URL.createObjectURL(this.mediaSource);
        destroyEvents.push(function () {
          URL.revokeObjectURL(url);
        });
        mediaElement.src = url;
      }
    }, {
      key: "eventBind",
      value: function eventBind() {
        var _this = this;

        var proxy = this.flv.events.proxy;
        config.mediaSource.events.forEach(function (eventName) {
          proxy(_this.mediaSource, eventName, function (event) {
            _this.flv.emit("mediaSource:".concat(event.type), event);
          });
        });
        config.sourceBufferList.events.forEach(function (eventName) {
          proxy(_this.mediaSource.sourceBuffers, eventName, function (event) {
            _this.flv.emit("sourceBuffers:".concat(event.type), event);
          });
          proxy(_this.mediaSource.activeSourceBuffers, eventName, function (event) {
            _this.flv.emit("activeSourceBuffers:".concat(event.type), event);
          });
        });
      }
    }]);

    return CreatMediaSource;
  }();

  function fetchStream(flv, url) {
    flv.emit('flvFetchStart');
    fetch(url).then(function (response) {
      errorHandle(response.ok && response.status >= 200 && response.status <= 299, "".concat(response.status, " ").concat(response.statusText));
      var contentType = response.headers.get('content-type');
      errorHandle(contentType.includes('x-flv'), 'The resource does not seem to be a flv file');
      return new Response(new ReadableStream({
        start: function start(controller) {
          var reader = response.body.getReader();
          flv.on('destroy', function () {
            reader.cancel();
          });
          flv.on('readerCancel', function () {
            reader.cancel();
          });

          (function read() {
            reader.read().then(function (_ref) {
              var done = _ref.done,
                  value = _ref.value;

              if (done) {
                flv.emit('flvFetchEnd');
                controller.close();
                return;
              }

              flv.emit('flvFetching', new Uint8Array(value));
              controller.enqueue(value);
              read();
            }).catch(function (error) {
              flv.emit('flvFetchError', error);
            });
          })();
        },
        cancel: function cancel() {
          flv.emit('flvFetchCancel');
        }
      }));
    });
  }

  function readFile(flv, file) {
    flv.emit('flvFetchStart');
    var proxy = flv.events.proxy;
    var reader = new FileReader();
    proxy(reader, 'load', function (e) {
      var buffer = e.target.result;
      var uint8 = new Uint8Array(buffer);
      flv.emit('flvFetchEnd', uint8);
    });
    reader.readAsArrayBuffer(file);
  }

  var FlvParse =
  /*#__PURE__*/
  function () {
    function FlvParse(flv) {
      var _this = this;

      classCallCheck(this, FlvParse);

      var url = flv.options.url;
      this.uint8 = new Uint8Array(0);
      this.index = 0;
      this.header = null;
      this.tags = [];
      this.done = false;
      flv.on('flvFetchStart', function () {
        console.log('[flv-fetch-start]');
      });
      flv.on('flvFetchCancel', function () {
        console.log('[flv-fetch-cancel]');
      });
      flv.on('flvFetchError', function (error) {
        console.log('[flv-fetch-error]', error);
      });
      flv.on('flvFetching', function (uint8) {
        _this.uint8 = mergeTypedArrays(_this.uint8, uint8);

        _this.parse();
      });
      flv.on('flvFetchEnd', function (uint8) {
        console.log('[flv-fetch-end]');
        _this.done = true;

        if (uint8) {
          _this.uint8 = uint8;
          _this.index = 0;
          _this.header = null;
          _this.tags = [];

          _this.parse();
        }

        _this.verify();
      });

      if (typeof url === 'string') {
        fetchStream(flv, url);
      } else {
        readFile(flv, url);
      }
    }

    createClass(FlvParse, [{
      key: "parse",
      value: function parse() {
        if (this.uint8.length >= 13 && !this.header) {
          var header = Object.create(null);
          header.signature = this.read(3);
          header.version = this.read(1);
          header.flags = this.read(1);
          header.headersize = this.read(4);
          this.header = header;
          this.read(4);
        }

        while (this.index < this.uint8.length) {
          var tag = Object.create(null);
          tag.tagType = this.read(1);
          tag.dataSize = this.read(3);
          tag.Timestamp = this.read(4);
          tag.StreamID = this.read(3);
          tag.body = this.read(FlvParse.getBodySum(tag.dataSize));
          this.tags.push(tag);
          this.read(4);
        }
      }
    }, {
      key: "read",
      value: function read(length) {
        var tempUint8 = [];

        for (var i = 0; i < length; i += 1) {
          tempUint8.push(this.uint8[this.index]);
          this.index += 1;
        }

        return tempUint8;
      }
    }, {
      key: "verify",
      value: function verify() {
        var types = Object.create(null);
        this.tags.forEach(function (item) {
          var tagType = item.tagType[0];

          if (types[tagType]) {
            types[tagType] += 1;
          } else {
            types[tagType] = 1;
          }
        });
        console.log(this.header);
        console.log(this.tags);
        console.log(types);
      }
    }], [{
      key: "getBodySum",
      value: function getBodySum(arr) {
        return arr[0] * Math.pow(256, 2) + arr[1] * 256 + arr[2];
      }
    }]);

    return FlvParse;
  }();

  var id = 0;

  var Flv =
  /*#__PURE__*/
  function (_Emitter) {
    inherits(Flv, _Emitter);

    function Flv(options) {
      var _this;

      classCallCheck(this, Flv);

      _this = possibleConstructorReturn(this, getPrototypeOf(Flv).call(this));
      _this.options = Object.assign({}, Flv.DEFAULTS, options);
      console.log(_this.options);
      checkSupport(_this.options);
      id += 1;
      _this.id = id;
      Flv.instances.push(assertThisInitialized(assertThisInitialized(_this)));
      return _this;
    }

    createClass(Flv, [{
      key: "load",
      value: function load() {
        this.events = new EventProxy(this);
        this.workers = new CreatWorker(this);
        this.mediaSource = new CreatMediaSource(this);
        this.flvData = new FlvParse(this);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.events.destroy();
        this.workers.killAll();
        Flv.instances.splice(Flv.instances.indexOf(this), 1);
        this.emit('destroy');
      }
    }], [{
      key: "DEFAULTS",
      get: function get() {
        return {
          mediaElement: '',
          url: ''
        };
      }
    }, {
      key: "version",
      get: function get() {
        return '1.0.6';
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
    }]);

    return Flv;
  }(tinyEmitter);

  Object.defineProperty(Flv, 'instances', {
    value: []
  });
  window.Flv = Flv;

  exports.default = Flv;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer-plugin-flv.js.map
