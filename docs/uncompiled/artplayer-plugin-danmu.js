(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['artplayer-plugin-danmu'] = factory());
}(this, function () { 'use strict';

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

  function bilibiliDanmuParseFromXml(xmlString) {
    if (typeof xmlString !== 'string') return [];
    var srtList = xmlString.match(/<d([\S ]*?>[\S ]*?)<\/d>/gi);
    return srtList.length ? srtList.map(function (item) {
      var _item$match = item.match(/<d p="(.+)">(.+)<\/d>/),
          _item$match2 = slicedToArray(_item$match, 3),
          attrStr = _item$match2[1],
          text = _item$match2[2];

      var attr = attrStr.split(',');
      return attr.length === 8 && text.trim() ? {
        text: text,
        time: Number(attr[0]),
        mode: Number(attr[1]),
        size: Number(attr[2]),
        color: "#".concat(Number(attr[3]).toString(16)),
        timestamp: Number(attr[4]),
        pool: Number(attr[5]),
        userID: attr[6],
        rowID: Number(attr[7])
      } : null;
    }) : [];
  }
  function bilibiliDanmuParseFromAv(av) {
    var corsUrl = 'https://cors-anywhere.herokuapp.com/';
    return fetch("".concat(corsUrl, "https://api.bilibili.com/x/web-interface/view?aid=").concat(av)).then(function (res) {
      return res.json();
    }).then(function (res) {
      if (res.code === 0 && res.data && res.data.cid) {
        return fetch("".concat(corsUrl, "https://api.bilibili.com/x/v1/dm/list.so?oid=").concat(res.data.cid)).then(function (res) {
          return res.text();
        }).then(function (xmlString) {
          return bilibiliDanmuParseFromXml(xmlString);
        });
      }

      throw new Error("Unable to get data: ".concat(JSON.stringify(res)));
    });
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

  var Danmuku =
  /*#__PURE__*/
  function () {
    function Danmuku(art) {
      var _this = this;

      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      classCallCheck(this, Danmuku);

      this.art = art;
      this.queue = [];
      this.layer = null;
      this.isStop = false;
      this.timer = null;
      this.option = Object.assign({}, Danmuku.option, option);
      art.constructor.validator(this.option, Danmuku.scheme);
      art.on('video:play', this.start.bind(this));
      art.on('video:pause', this.stop.bind(this));
      art.on('video:ended', this.stop.bind(this));
      art.on('destroy', this.stop.bind(this));

      if (typeof this.option.danmus === 'function') {
        this.option.danmus().then(function (danmus) {
          art.emit('artplayerPluginDanmu:loaded', danmus);
          danmus.forEach(_this.addToQueue.bind(_this));

          _this.init();
        });
      } else {
        this.option.danmus.forEach(this.addToQueue);
        this.init();
      }
    }

    createClass(Danmuku, [{
      key: "init",
      value: function init() {
        this.layer = this.art.layers.add({
          name: 'danmu',
          style: {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none'
          }
        });
      }
    }, {
      key: "emit",
      value: function emit(danmu) {
        var errorHandle = this.art.constructor.utils.errorHandle;
        errorHandle(this.layer, 'The danmuku is not ready');
        var _this$art$template$$p = this.art.template.$player,
            playerWidth = _this$art$template$$p.clientWidth,
            playerHeight = _this$art$template$$p.clientHeight;
        danmu.$ref.innerText = danmu.text;
        danmu.$ref.style.fontSize = "".concat(danmu.size || this.option.size, "px");
        var _danmu$$ref = danmu.$ref,
            danmuWidth = _danmu$$ref.clientWidth,
            danmuHeight = _danmu$$ref.clientHeight;
        danmu.$ref.style.opacity = danmu.opacity || this.option.opacity;
        danmu.$ref.style.color = danmu.color || this.option.color;
        danmu.$ref.style.top = this.getDanmuTop(playerHeight, danmuHeight);
        danmu.$ref.style.left = "".concat(playerWidth, "px");
        var translateX = -playerWidth - danmuWidth - 10;
        danmu.$ref.style.transform = "translateX(".concat(translateX, "px) translateY(0px) translateZ(0px)");
        danmu.$ref.style.transition = "-webkit-transform ".concat(danmu.speed || this.option.speed, "s linear 0s");
      }
    }, {
      key: "addToQueue",
      value: function addToQueue(danmu) {
        var errorHandle = this.art.constructor.utils.errorHandle;
        errorHandle(danmu.text, 'Danmu text cannot be empty');
        errorHandle(typeof danmu.time === 'number', 'Danmu time cannot be empty');
        errorHandle(danmu.text.length <= this.option.maxlength, "The length of the danmu does not exceed ".concat(this.option.maxlength));
        this.queue.push(objectSpread({}, danmu, {
          $state: 'wait',
          $ref: null,
          $emitTime: 0
        }));
      }
    }, {
      key: "getDanmuRef",
      value: function getDanmuRef() {
        var $player = this.art.template.$player;
        var _this$art$constructor = this.art.constructor.utils,
            setStyles = _this$art$constructor.setStyles,
            append = _this$art$constructor.append;
        var playerLeft = $player.getBoundingClientRect().left;
        var waitDanmu = this.queue.find(function (danmu) {
          if (danmu.$ref) {
            var _danmu$$ref$getBoundi = danmu.$ref.getBoundingClientRect(),
                left = _danmu$$ref$getBoundi.left,
                width = _danmu$$ref$getBoundi.width;

            return playerLeft >= left + width;
          }

          return false;
        });

        if (waitDanmu) {
          waitDanmu.$state = 'wait';
          waitDanmu.$ref.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
          waitDanmu.$ref.style.transition = '-webkit-transform 0s linear 0s';
          return waitDanmu.$ref;
        }

        var $ref = document.createElement('div');
        setStyles($ref, {
          userSelect: 'none',
          position: 'absolute',
          whiteSpace: 'pre',
          pointerEvents: 'none',
          perspective: '500px',
          display: 'inline-block',
          willChange: 'transform',
          fontFamily: 'SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif',
          fontWeight: 'normal',
          lineHeight: '1.125',
          textShadow: 'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px'
        });
        append(this.layer.$ref, $ref);
        return $ref;
      }
    }, {
      key: "getDanmuTop",
      value: function getDanmuTop(playerHeight, danmuHeight) {
        return 0;
      }
    }, {
      key: "changeState",
      value: function changeState(before, after) {
        return this.queue.filter(function (danmu) {
          return danmu.$state === before;
        }).map(function (danmu) {
          danmu.$state = after;
          return danmu;
        });
      }
    }, {
      key: "update",
      value: function update() {
        var _this2 = this;

        var player = this.art.player;
        this.timer = window.requestAnimationFrame(function () {
          _this2.queue.filter(function (danmu) {
            return player.currentTime + 0.25 >= danmu.time && danmu.time >= player.currentTime - 0.25 && danmu.$state === 'wait';
          }).map(function (danmu) {
            danmu.$emitTime = Date.now();
            danmu.$ref = _this2.getDanmuRef();
            danmu.$state = 'emit';
            return danmu;
          }).forEach(function (danmu) {
            _this2.emit(danmu);
          });

          if (!_this2.isStop) {
            _this2.update();
          }
        });
      }
    }, {
      key: "stop",
      value: function stop() {
        this.isStop = true;
        this.changeState('emit', 'stop');
        this.changeState('continue', 'stop');
        window.cancelAnimationFrame(this.timer);
        this.art.emit('artplayerPluginDanmu:stop');
      }
    }, {
      key: "start",
      value: function start() {
        this.isStop = false;
        this.changeState('stop', 'continue');
        this.update();
        this.art.emit('artplayerPluginDanmu:start');
      }
    }, {
      key: "show",
      value: function show() {
        this.layer.$ref.style = 'none';
        this.art.emit('artplayerPluginDanmu:show');
      }
    }, {
      key: "hide",
      value: function hide() {
        this.layer.$ref.style = 'block';
        this.art.emit('artplayerPluginDanmu:hide');
      }
    }], [{
      key: "option",
      get: function get() {
        return {
          danmus: [],
          speed: 5,
          opacity: 1,
          color: '#fff',
          size: 14,
          maxlength: 50
        };
      }
    }, {
      key: "scheme",
      get: function get() {
        return {
          danmus: 'array|function',
          speed: 'number',
          opacity: 'number',
          color: 'string',
          size: 'number',
          maxlength: 'number'
        };
      }
    }]);

    return Danmuku;
  }();

  function artplayerPluginDanmu(option) {
    return function (art) {
      var danmuku = new Danmuku(art, option);
      return {
        name: 'artplayerPluginDanmu',
        emit: danmuku.addToQueue.bind(danmuku),
        start: danmuku.start.bind(danmuku),
        stop: danmuku.stop.bind(danmuku),
        hide: danmuku.hide.bind(danmuku),
        show: danmuku.show.bind(danmuku)
      };
    };
  }

  artplayerPluginDanmu.bilibiliDanmuParseFromXml = bilibiliDanmuParseFromXml;
  artplayerPluginDanmu.bilibiliDanmuParseFromAv = bilibiliDanmuParseFromAv;
  window.artplayerPluginDanmu = artplayerPluginDanmu;

  return artplayerPluginDanmu;

}));
//# sourceMappingURL=artplayer-plugin-danmu.js.map
