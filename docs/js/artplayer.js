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
        refs.$container.innerHTML = "\n        <div class=\"artplayer-wrap\">\n          <video class=\"artplayer-video\" webkit-playsinline playsinline></video>\n          <div class=\"artplayer-controls\"></div>\n          <div class=\"artplayer-layers\"></div>\n          <div class=\"artplayer-loading\"></div>\n          <div class=\"artplayer-notice\"></div>\n        </div>\n      ";
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

      this.language = i18nMap[option.lang.toLowerCase()] || i18nMap.en;
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
        $video.controls = true;
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
      value: function add(option) {
        var refs = this.art.refs;
        id++;
        refs.$layers.insertAdjacentHTML('beforeend', "\n      <div\n        data-art-layer-id=\"".concat(id, "\"\n        class=\"art-layer art-layer-").concat(option.name || id, "\"\n        style=\"z-index: ").concat(option.index || id, "\"\n      >\n        ").concat(option.html || '', "\n      </div>\n    "));
        var $layer = refs.$layers.querySelector("[data-art-layer-id=\"".concat(id, "\"]"));
        option.callback && option.callback($layer);
      }
    }]);

    return Layers;
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
