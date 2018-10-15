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
    if (!condition) {
      throw new ArtPlayerError(msg);
    }
  }
  function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
  }
  function request(url) {
    return fetch(url).then(function (response) {
      return response.arrayBuffer();
    }).catch(function (err) {
      throw new ArtPlayerError(err.message);
    });
  }

  function verification(option) {
    errorHandle(option.container, '\'container\' option is required.');
    errorHandle(option.url, '\'url\' option is required.');
    errorHandle(option.container instanceof Element, "'container' option require 'Element' type, but got '".concat(_typeof_1(option.container), "'."));
    errorHandle(typeof option.url === 'string', "'url' option require 'string' type, but got '".concat(_typeof_1(option.url), "'."));
    errorHandle(typeof option.poster === 'string', "'poster' option require 'string' type, but got '".concat(_typeof_1(option.poster), "'."));
    errorHandle(typeof option.volume === 'number', "'volume' option require 'number' type, but got '".concat(_typeof_1(option.volume), "'."));
    errorHandle(typeof option.autoplay === 'boolean', "'autoplay' option require 'boolean' type, but got '".concat(_typeof_1(option.autoplay), "'."));
    errorHandle(['none', 'metadata', 'auto'].indexOf(option.preload) > -1, '\'preload\' option require one of \'none、metadata、auto\'.');
    errorHandle(typeof option.lang === 'string', "'lang' option require 'string' type, but got '".concat(_typeof_1(option.lang), "'."));
    errorHandle(typeof option.type === 'string', "'type' option require 'string' type, but got '".concat(_typeof_1(option.type), "'."));
    errorHandle(typeof option.mimeCodec === 'string', "'mimeCodec' option require 'string' type, but got '".concat(_typeof_1(option.mimeCodec), "'."));
    errorHandle(Array.isArray(option.layers), "'layers' option require 'array' type, but got '".concat(_typeof_1(option.layers), "'."));
    errorHandle(Array.isArray(option.contextmenu), "'contextmenu' option require 'array' type, but got '".concat(_typeof_1(option.contextmenu), "'."));
    errorHandle(typeof option.loading === 'string', "'loading' option require 'string' type, but got '".concat(_typeof_1(option.loading), "'."));
  }

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
        refs.$container.innerHTML = "\n        <div class=\"artplayer-wrap\">\n          <video class=\"artplayer-video\" webkit-playsinline playsinline></video>\n          <div class=\"artplayer-layers\"></div>\n          <div class=\"artplayer-controls\"></div>\n          <div class=\"artplayer-loading\"></div>\n          <div class=\"artplayer-notice\"></div>\n        </div>\n      ";
        refs.$wrap = refs.$container.querySelector('.artplayer-wrap');
        refs.$video = refs.$container.querySelector('.artplayer-video');
        refs.$controls = refs.$container.querySelector('.artplayer-controls');
        refs.$layers = refs.$container.querySelector('.artplayer-layers');
        refs.$loading = refs.$container.querySelector('.artplayer-loading');
        refs.$notice = refs.$container.querySelector('.artplayer-notice');
      }
    }]);

    return Template;
  }();

  var i18nMap = {
    'zh-cn': {
      'About author': '关于作者',
      'Video info': '视频统计信息'
    },
    'zh-tw': {
      'About author': '關於作者',
      'Video info': '影片統計訊息'
    }
  };

  var I18n =
  /*#__PURE__*/
  function () {
    function I18n(_ref) {
      var option = _ref.option;

      classCallCheck(this, I18n);

      this.language = i18nMap[option.lang.toLowerCase()] || {};
    }

    createClass(I18n, [{
      key: "get",
      value: function get(key) {
        return this.language[key] || key;
      }
    }]);

    return I18n;
  }();

  var mediaElement = {
    propertys: ['audioTracks', 'autoplay', 'buffered', 'controller', 'controls', 'crossOrigin', 'currentSrc', 'currentTime', 'defaultMuted', 'defaultPlaybackRate', 'duration', 'ended', 'error', 'loop', 'mediaGroup', 'muted', 'networkState', 'paused', 'playbackRate', 'played', 'preload', 'readyState', 'seekable', 'seeking', 'src', 'startDate', 'textTracks', 'videoTracks', 'volume'],
    methods: ['addTextTrack', 'canPlayType', 'load', 'play', 'pause'],
    events: ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']
  };

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
      }
    }, {
      key: "eventBind",
      value: function eventBind() {
        var _this = this;

        var proxy = this.art.events.proxy;
        var $video = this.art.refs.$video;
        var events = mediaElement.events;
        events.forEach(function (eventName) {
          proxy($video, eventName, function (event) {
            _this.art.emit("video:".concat(event.type), event);
          });
        });
      }
    }]);

    return Player;
  }();

  var mimeCodeces = {
    mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
    webm: 'video/webm; codecs="vorbis, vp8"',
    ts: 'video/mp2t; codecs="avc1.42E01E, mp4a.40.2"'
  };

  var mseConfig = {
    instance: {
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

  var Mse =
  /*#__PURE__*/
  function () {
    function Mse(art) {
      classCallCheck(this, Mse);

      this.art = art;
      this.setMimeCodec();
      this.init();
      this.eventBind();
      this.eventStart();
    }

    createClass(Mse, [{
      key: "setMimeCodec",
      value: function setMimeCodec() {
        var option = this.art.option;

        if (!option.type) {
          var type = option.url.trim().toLowerCase().split('.').pop();
          errorHandle(Object.keys(mimeCodeces).includes(type), "Can't find video's type '".concat(type, "' from '").concat(option.url, "'"));
          option.type = type;
        }

        if (!option.mimeCodec) {
          var mimeCodec = mimeCodeces[option.type];
          errorHandle(mimeCodec, "Can't find video's mimeCodec from ".concat(option.type));
          option.mimeCodec = mimeCodec;
        }
      }
    }, {
      key: "init",
      value: function init() {
        var _this$art = this.art,
            option = _this$art.option,
            $video = _this$art.refs.$video;
        errorHandle(MediaSource.isTypeSupported(option.mimeCodec), "Unsupported MIME type or codec: ".concat(option.mimeCodec));
        this.mediaSource = new MediaSource();
        $video.src = URL.createObjectURL(this.mediaSource);
        this.art.events.destroys.push(function () {
          URL.revokeObjectURL($video.src);
        });
      }
    }, {
      key: "eventBind",
      value: function eventBind() {
        var _this = this;

        var proxy = this.art.events.proxy;
        var instance = mseConfig.instance,
            sourceBufferList = mseConfig.sourceBufferList;
        instance.events.forEach(function (eventName) {
          proxy(_this.mediaSource, eventName, function (event) {
            _this.art.emit("mediaSource:".concat(event.type), event);
          });
        });
        sourceBufferList.events.forEach(function (eventName) {
          proxy(_this.mediaSource.sourceBuffers, eventName, function (event) {
            _this.art.emit("sourceBuffers:".concat(event.type), event);
          });
          proxy(_this.mediaSource.activeSourceBuffers, eventName, function (event) {
            _this.art.emit("activeSourceBuffers:".concat(event.type), event);
          });
        });
      }
    }, {
      key: "eventStart",
      value: function eventStart() {
        var _this2 = this;

        var option = this.art.option;
        var proxy = this.art.events.proxy;
        var sourceBuffer = mseConfig.sourceBuffer;
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
        request(option.url).then(function (response) {
          _this2.sourceBuffer.appendBuffer(response);
        });
      }
    }]);

    return Mse;
  }();

  var Controls = function Controls(_ref) {//

    var option = _ref.option;

    classCallCheck(this, Controls);
  };

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
          click: function click(art) {
            art.info.show();
          }
        }, {
          text: i18n.get('About author'),
          link: 'https://github.com/zhw2590582'
        }, {
          text: 'ArtPlayer 1.0.0',
          link: 'https://github.com/zhw2590582/artplayer'
        });
        proxy(refs.$container, 'contextmenu', function (event) {
          event.preventDefault();

          if (!refs.$contextmenu) {
            _this.creatMenu();
          }

          _this.show();

          _this.setPos(event);
        });
        proxy(refs.$container, 'click', function () {
          if (refs.$contextmenu) {
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

          refs.$contextmenu.appendChild($menu);
        });
        refs.$wrap.appendChild(refs.$contextmenu);
      }
    }, {
      key: "setPos",
      value: function setPos(event) {
        var refs = this.art.refs;
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        var _refs$$container$getB = refs.$container.getBoundingClientRect(),
            cHeight = _refs$$container$getB.height,
            cWidth = _refs$$container$getB.width,
            cLeft = _refs$$container$getB.left,
            cTop = _refs$$container$getB.top;

        var _refs$$contextmenu$ge = refs.$contextmenu.getBoundingClientRect(),
            mHeight = _refs$$contextmenu$ge.height,
            mWidth = _refs$$contextmenu$ge.width;

        var menuLeft = mouseX - cLeft;
        var menuTop = mouseY - cTop;

        if (mouseX + mWidth > cLeft + cWidth) {
          menuLeft -= mWidth;
        }

        if (mouseY + mHeight > cTop + cHeight) {
          menuTop -= mHeight;
        }

        refs.$contextmenu.style.left = "".concat(menuLeft, "px");
        refs.$contextmenu.style.top = "".concat(menuTop, "px");
      }
    }, {
      key: "hide",
      value: function hide() {
        var refs = this.art.refs;
        refs.$contextmenu && (refs.$contextmenu.style.display = 'none');
      }
    }, {
      key: "show",
      value: function show() {
        var refs = this.art.refs;
        refs.$contextmenu && (refs.$contextmenu.style.display = 'block');
      }
    }]);

    return Contextmenu;
  }();

  var Danmu = function Danmu(art) {
    classCallCheck(this, Danmu);

    this.art = art;
  };

  var Info =
  /*#__PURE__*/
  function () {
    function Info(art) {
      classCallCheck(this, Info);

      this.art = art;
    }

    createClass(Info, [{
      key: "show",
      value: function show() {
        console.log('info show');
      }
    }, {
      key: "hide",
      value: function hide() {
        console.log('info hide');
      }
    }]);

    return Info;
  }();

  var Subtitle = function Subtitle(art) {
    classCallCheck(this, Subtitle);

    this.art = art;
  };

  var Events =
  /*#__PURE__*/
  function () {
    function Events(art) {
      classCallCheck(this, Events);

      this.art = art;
      this.destroys = [];
      this.proxy = this.proxy.bind(this);
      this.init();
    }

    createClass(Events, [{
      key: "proxy",
      value: function proxy(target, name, callback) {
        target.addEventListener(name, callback);
        this.destroys.push(function () {
          target.removeEventListener(name, callback);
        });
      }
    }, {
      key: "init",
      value: function init() {
        console.log('init');
      }
    }]);

    return Events;
  }();

  var Hotkey = function Hotkey(art) {
    classCallCheck(this, Hotkey);

    this.art = art;
  };

  var id = 0;

  var Layers =
  /*#__PURE__*/
  function () {
    function Layers(art) {
      classCallCheck(this, Layers);

      this.art = art;
      this.add = this.add.bind(this);
      this.art.option.layers.forEach(this.add);
    }

    createClass(Layers, [{
      key: "add",
      value: function add(option, callback) {
        var refs = this.art.refs;
        id++;
        refs.$layers.insertAdjacentHTML('beforeend', "\n      <div\n        data-art-layer-id=\"".concat(id, "\"\n        class=\"art-layer art-layer-").concat(option.name || id, "\"\n        style=\"z-index: ").concat(option.index || id, "\"\n      >\n        ").concat(option.html || '', "\n      </div>\n    "));
        var $layer = refs.$layers.querySelector("[data-art-layer-id=\"".concat(id, "\"]"));
        callback && callback($layer);
      }
    }]);

    return Layers;
  }();

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

  var loading = "<svg class=\"lds-bluecat\" width=\"80px\"  height=\"80px\"  xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\">\n      <g transform=\"rotate(0.97464 50 50)\">\n        <animateTransform attributeName=\"transform\" type=\"rotate\" values=\"360 50 50;0 50 50\" keyTimes=\"0;1\" dur=\"1.5s\" repeatCount=\"indefinite\" calcMode=\"spline\" keySplines=\"0.5 0 0.5 1\" begin=\"-0.15000000000000002s\"></animateTransform>\n        <circle cx=\"50\" cy=\"50\" r=\"39.891\" stroke=\"#6994b7\" stroke-width=\"14.4\" fill=\"none\" stroke-dasharray=\"0 300\">\n          <animate attributeName=\"stroke-dasharray\" values=\"15 300;55.1413599195142 300;15 300\" keyTimes=\"0;0.5;1\" dur=\"1.5s\" repeatCount=\"indefinite\" calcMode=\"linear\" keySplines=\"0 0.4 0.6 1;0.4 0 1 0.6\" begin=\"-0.069s\"></animate>\n        </circle>\n        <circle cx=\"50\" cy=\"50\" r=\"39.891\" stroke=\"#eeeeee\" stroke-width=\"7.2\" fill=\"none\" stroke-dasharray=\"0 300\">\n          <animate attributeName=\"stroke-dasharray\" values=\"15 300;55.1413599195142 300;15 300\" keyTimes=\"0;0.5;1\" dur=\"1.5s\" repeatCount=\"indefinite\" calcMode=\"linear\" keySplines=\"0 0.4 0.6 1;0.4 0 1 0.6\" begin=\"-0.069s\"></animate>\n        </circle>\n        <circle cx=\"50\" cy=\"50\" r=\"32.771\" stroke=\"#000000\" stroke-width=\"1\" fill=\"none\" stroke-dasharray=\"0 300\">\n          <animate attributeName=\"stroke-dasharray\" values=\"15 300;45.299378454348094 300;15 300\" keyTimes=\"0;0.5;1\" dur=\"1.5s\" repeatCount=\"indefinite\" calcMode=\"linear\" keySplines=\"0 0.4 0.6 1;0.4 0 1 0.6\" begin=\"-0.069s\"></animate>\n        </circle>\n        <circle cx=\"50\" cy=\"50\" r=\"47.171\" stroke=\"#000000\" stroke-width=\"1\" fill=\"none\" stroke-dasharray=\"0 300\">\n          <animate attributeName=\"stroke-dasharray\" values=\"15 300;66.03388996804073 300;15 300\" keyTimes=\"0;0.5;1\" dur=\"1.5s\" repeatCount=\"indefinite\" calcMode=\"linear\" keySplines=\"0 0.4 0.6 1;0.4 0 1 0.6\" begin=\"-0.069s\"></animate>\n        </circle>\n      </g>\n\n      <g transform=\"rotate(11.1822 50 50)\">\n        <animateTransform attributeName=\"transform\" type=\"rotate\" values=\"360 50 50;0 50 50\" keyTimes=\"0;1\" dur=\"1.5s\" repeatCount=\"indefinite\" calcMode=\"spline\" keySplines=\"0.5 0 0.5 1\"></animateTransform>\n\t<path fill=\"#6994b7\" stroke=\"#000000\" d=\"M97.2,50.1c0,6.1-1.2,12.2-3.5,17.9l-13.3-5.4c1.6-3.9,2.4-8.2,2.4-12.4\"></path>\n\t<path fill=\"#eeeeee\" d=\"M93.5,49.9c0,1.2,0,2.7-0.1,3.9l-0.4,3.6c-0.4,2-2.3,3.3-4.1,2.8l-0.2-0.1c-1.8-0.5-3.1-2.3-2.7-3.9l0.4-3 c0.1-1,0.1-2.3,0.1-3.3\"></path>\n\t<path fill=\"#6994b7\" stroke=\"#000000\" d=\"M85.4,62.7c-0.2,0.7-0.5,1.4-0.8,2.1c-0.3,0.7-0.6,1.4-0.9,2c-0.6,1.1-2,1.4-3.2,0.8c-1.1-0.7-1.7-2-1.2-2.9 c0.3-0.6,0.5-1.2,0.8-1.8c0.2-0.6,0.6-1.2,0.7-1.8\"></path>\n\t<path fill=\"#6994b7\" stroke=\"#000000\" d=\"M94.5,65.8c-0.3,0.9-0.7,1.7-1,2.6c-0.4,0.9-0.7,1.7-1.1,2.5c-0.7,1.4-2.3,1.9-3.4,1.3h0 c-1.1-0.7-1.5-2.2-0.9-3.4c0.4-0.8,0.7-1.5,1-2.3c0.3-0.8,0.7-1.5,0.9-2.3\"></path>\n      </g>\n      <g transform=\"rotate(0.97464 50 50)\">\n        <animateTransform attributeName=\"transform\" type=\"rotate\" values=\"360 50 50;0 50 50\" keyTimes=\"0;1\" dur=\"1.5s\" repeatCount=\"indefinite\" calcMode=\"spline\" keySplines=\"0.5 0 0.5 1\" begin=\"-0.15000000000000002s\"></animateTransform>\n        <path fill=\"#eeeeee\" stroke=\"#000000\" d=\"M86.9,35.3l-6,2.4c-0.4-1.2-1.1-2.4-1.7-3.5c-0.2-0.5,0.3-1.1,0.9-1C82.3,33.8,84.8,34.4,86.9,35.3z\"></path>\n        <path fill=\"#eeeeee\" stroke=\"#000000\" d=\"M87.1,35.3l6-2.4c-0.6-1.7-1.5-3.3-2.3-4.9c-0.3-0.7-1.2-0.6-1.4,0.1C88.8,30.6,88.2,33,87.1,35.3z\"></path>\n        <path fill=\"#6994b7\" stroke=\"#000000\" d=\"M82.8,50.1c0-3.4-0.5-6.8-1.6-10c-0.2-0.8-0.4-1.5-0.3-2.3c0.1-0.8,0.4-1.6,0.7-2.4c0.7-1.5,1.9-3.1,3.7-4l0,0 c1.8-0.9,3.7-1.1,5.6-0.3c0.9,0.4,1.7,1,2.4,1.8c0.7,0.8,1.3,1.7,1.7,2.8c1.5,4.6,2.2,9.5,2.3,14.4\"></path>\n        <path fill=\"#eeeeee\" d=\"M86.3,50.2l0-0.9l-0.1-0.9l-0.1-1.9c0-0.9,0.2-1.7,0.7-2.3c0.5-0.7,1.3-1.2,2.3-1.4l0.3,0 c0.9-0.2,1.9,0,2.6,0.6c0.7,0.5,1.3,1.4,1.4,2.4l0.2,2.2l0.1,1.1l0,1.1\"></path>\n        <path fill=\"#ff9922\" d=\"M93.2,34.6c0.1,0.4-0.3,0.8-0.9,1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1 C92.4,34.2,93,34.3,93.2,34.6z\"></path>\n        <path fill=\"#ff9922\" d=\"M81.9,38.7c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.2,38,81.8,38.4,81.9,38.7z\"></path>\n        <path fill=\"#000000\" d=\"M88.5,36.8c0.1,0.3-0.2,0.7-0.6,0.8c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.8C87.9,36.3,88.4,36.4,88.5,36.8z\"></path>\n        <path stroke=\"#000000\" d=\"M85.9,38.9c0.2,0.6,0.8,0.9,1.4,0.7c0.6-0.2,0.9-0.9,0.6-2.1c0.3,1.2,1,1.7,1.6,1.5c0.6-0.2,0.9-0.8,0.8-1.4\"></path>\n        <path fill=\"#6994b7\" stroke=\"#000000\" d=\"M86.8,42.3l0.4,2.2c0.1,0.4,0.1,0.7,0.2,1.1l0.1,1.1c0.1,1.2-0.9,2.3-2.2,2.3c-1.3,0-2.5-0.8-2.5-1.9l-0.1-1 c0-0.3-0.1-0.6-0.2-1l-0.3-1.9\"></path>\n        <path fill=\"#6994b7\" stroke=\"#000000\" d=\"M96.2,40.3l0.5,2.7c0.1,0.5,0.2,0.9,0.2,1.4l0.1,1.4c0.1,1.5-0.9,2.8-2.2,2.9h0c-1.3,0-2.5-1.1-2.6-2.4 L92.1,45c0-0.4-0.1-0.8-0.2-1.2l-0.4-2.5\"></path>\n        <path fill=\"#000000\" d=\"M91.1,34.1c0.3,0.7,0,1.4-0.7,1.6c-0.6,0.2-1.3-0.1-1.6-0.7c-0.2-0.6,0-1.4,0.7-1.6C90.1,33.1,90.8,33.5,91.1,34.1z\"></path>\n        <path fill=\"#000000\" d=\"M85.5,36.3c0.2,0.6-0.1,1.2-0.7,1.5c-0.6,0.2-1.3,0-1.5-0.6C83,36.7,83.4,36,84,35.8C84.6,35.5,85.3,35.7,85.5,36.3z\"></path>\n\n      </g></svg>";

  var Icons = {
    loading: loading
  };

  function creatDomFromSvg(map) {
    var result = {};
    Object.keys(map).forEach(function (name) {
      var tmp = document.createElement('div');
      tmp.innerHTML = map[name];

      var _tmp$childNodes = slicedToArray(tmp.childNodes, 1);

      result[name] = _tmp$childNodes[0];
    });
    return result;
  }

  var Icons$1 = creatDomFromSvg(Icons);

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
        var option = this.art.option;

        if (option.loading) {
          this.art.refs.$loading.insertAdjacentHTML('beforeend', option.loading);
        } else {
          this.art.refs.$loading.appendChild(Icons$1.loading);
        }
      }
    }, {
      key: "hide",
      value: function hide() {
        this.art.refs.$loading.style.display = 'none';
      }
    }, {
      key: "show",
      value: function show() {
        this.art.refs.$loading.style.display = 'block';
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
    }

    createClass(Notice, [{
      key: "show",
      value: function show(msg) {
        var $notice = this.art.refs.$notice;
        $notice.style.display = 'block';
        $notice.innerHTML = msg instanceof Error ? msg.message.trim() : msg;
      }
    }, {
      key: "hide",
      value: function hide() {
        var $notice = this.art.refs.$notice;
        $notice.style.display = 'none';
      }
    }]);

    return Notice;
  }();

  var id$1 = 0;
  var instances = [];

  var Artplayer =
  /*#__PURE__*/
  function (_Emitter) {
    inherits(Artplayer, _Emitter);

    function Artplayer(option) {
      var _this;

      classCallCheck(this, Artplayer);

      _this = possibleConstructorReturn(this, getPrototypeOf(Artplayer).call(this));
      _this.option = Object.assign({}, Artplayer.DEFAULTS, option);
      verification(_this.option);

      _this.init();

      return _this;
    }

    createClass(Artplayer, [{
      key: "init",
      value: function init() {
        this.refs = {
          $container: this.option.container
        };
        this.template = new Template(this);
        this.i18n = new I18n(this);
        this.events = new Events(this);
        this.player = new Player(this);
        this.mse = new Mse(this);
        this.layers = new Layers(this);
        this.controls = new Controls(this);
        this.contextmenu = new Contextmenu(this);
        this.danmaku = new Danmu(this);
        this.subtitle = new Subtitle(this);
        this.info = new Info(this);
        this.hotkey = new Hotkey(this);
        this.loading = new Loading(this);
        this.notice = new Notice(this);
        this.id = id$1++;
        instances.push(this);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.events.destroys.forEach(function (destroy) {
          return destroy();
        });
        this.refs.$container.innerHTML = '';
        instances.splice(instances.indexOf(this), 1);
      }
    }], [{
      key: "use",
      value: function use(plugin) {
        var installedPlugins = this.plugins || (this.plugins = []);

        if (installedPlugins.indexOf(plugin) > -1) {
          return this;
        }

        var args = Array.from(arguments).slice(1);
        args.unshift(this);

        if (typeof plugin.install === 'function') {
          plugin.install.apply(plugin, args);
        } else if (typeof plugin === 'function') {
          plugin.apply(null, args);
        }

        installedPlugins.push(plugin);
        return this;
      }
    }, {
      key: "version",
      get: function get() {
        return '1.0.0';
      }
    }, {
      key: "DEFAULTS",
      get: function get() {
        return {
          container: document.querySelector('.artplayer'),
          url: '',
          poster: '',
          volume: 0.7,
          autoplay: false,
          preload: 'auto',
          type: '',
          mimeCodec: '',
          layers: [],
          contextmenu: [],
          loading: '',
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
