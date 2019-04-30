(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.artplayerPluginDanmuku = factory());
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
  function bilibiliDanmuParseFromUrl(url) {
    return fetch(url).then(function (res) {
      return res.text();
    }).then(function (xmlString) {
      return bilibiliDanmuParseFromXml(xmlString);
    });
  }
  function bilibiliDanmuParseFromAv(av) {
    var corsUrl = 'https://cors-anywhere.herokuapp.com/';
    return fetch("".concat(corsUrl, "https://api.bilibili.com/x/web-interface/view?aid=").concat(av)).then(function (res) {
      return res.json();
    }).then(function (res) {
      if (res.code === 0 && res.data && res.data.cid) {
        return bilibiliDanmuParseFromUrl("".concat(corsUrl, "https://api.bilibili.com/x/v1/dm/list.so?oid=").concat(res.data.cid));
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

  function getDanmuTopByDiff(danmus) {
    var top = 0;
    var maxDiff = 0;

    for (var index = 1; index < danmus.length; index += 1) {
      var item = danmus[index];
      var prev = danmus[index - 1];
      var prevTop = prev.top + prev.height;
      var diff = item.top - prevTop;

      if (diff > maxDiff) {
        top = prevTop;
        maxDiff = diff;
      }
    }

    return top;
  }

  function getDanmuTopBySparse(danmus) {
    var topMap = {};

    for (var index = 0; index < danmus.length; index += 1) {
      var item = danmus[index];

      if (topMap[item.top]) {
        topMap[item.top].push(item);
      } else {
        topMap[item.top] = [item];
      }
    }

    var maxRight = 0;
    var top = 0;
    var topMapKeys = Object.keys(topMap);

    for (var _index = 0; _index < topMapKeys.length; _index += 1) {
      var minRight = danmus[0].width;
      var topKey = topMapKeys[_index];
      var danmuArr = topMap[topKey];

      for (var _index2 = 0; _index2 < danmuArr.length; _index2 += 1) {
        var danmu = danmuArr[_index2];

        if (danmu.right < minRight) {
          minRight = danmu.right;
        }
      }

      if (minRight > maxRight) {
        maxRight = minRight;

        var _danmuArr = slicedToArray(danmuArr, 1);

        top = _danmuArr[0].top;
      }
    }

    if (top === 0) {
      var randomKey = Math.floor(Math.random() * (2 - topMapKeys.length) + topMapKeys.length - 1);
      top = topMapKeys[randomKey];
    }

    return top;
  }

  function getDanmuTop(danmus) {
    var top = getDanmuTopByDiff(danmus);

    if (top === 0) {
      top = getDanmuTopBySparse(danmus);
    }

    return top;
  }

  var Danmuku =
  /*#__PURE__*/
  function () {
    function Danmuku(art, option) {
      var _this = this;

      classCallCheck(this, Danmuku);

      this.art = art;
      this.queue = [];
      this.isStop = false;
      this.refs = [];
      this.animationFrameTimer = null;
      this.$danmuku = art.template.$danmuku;
      art.i18n.update(Danmuku.i18n);
      art.on('video:play', this.start.bind(this));
      art.on('video:playing', this.start.bind(this));
      art.on('video:pause', this.stop.bind(this));
      art.on('video:waiting', this.stop.bind(this));
      art.on('resize', this.resize.bind(this));
      art.on('destroy', this.stop.bind(this));
      this.config(option);

      if (typeof this.option.danmuku === 'function') {
        this.option.danmuku().then(function (danmus) {
          danmus.forEach(_this.addToQueue.bind(_this));
          art.emit('artplayerPluginDanmuku:loaded');
        });
      } else if (typeof this.option.danmuku === 'string') {
        bilibiliDanmuParseFromUrl(this.option.danmuku).then(function (danmus) {
          danmus.forEach(_this.addToQueue.bind(_this));
          art.emit('artplayerPluginDanmuku:loaded');
        });
      } else {
        this.option.danmuku.forEach(this.addToQueue.bind(this));
        art.emit('artplayerPluginDanmuku:loaded');
      }
    }

    createClass(Danmuku, [{
      key: "config",
      value: function config(option) {
        var _this$art$constructor = this.art.constructor,
            clamp = _this$art$constructor.utils.clamp,
            validator = _this$art$constructor.validator;
        this.option = Object.assign({}, Danmuku.option, option);
        validator(this.option, Danmuku.scheme);
        this.option.speed = clamp(this.option.speed, 1, 10);
        this.option.opacity = clamp(this.option.opacity, 0, 1);
        this.option.size = clamp(this.option.size, 12, 30);
        this.option.maxlength = clamp(this.option.maxlength, 10, 100);
        this.option.margin[0] = clamp(this.option.margin[0], 0, 100);
        this.option.margin[1] = clamp(this.option.margin[1], 0, 100);
      }
    }, {
      key: "emit",
      value: function emit(danmu) {
        var $player = this.art.template.$player;
        danmu.$ref = this.getDanmuRef();
        danmu.$ref.innerText = danmu.text;
        danmu.$ref.style.fontSize = "".concat(danmu.size || this.option.size, "px");
        var playerWidth = Danmuku.getRect($player, 'width');
        var danmuWidth = Danmuku.getRect(danmu.$ref, 'width');
        danmu.$restWidth = playerWidth + danmuWidth + 5;
        danmu.$restTime = this.option.speed;
        danmu.$lastStartTime = Date.now();
        danmu.$ref.style.color = danmu.color || this.option.color;
        danmu.$ref.style.left = "".concat(playerWidth, "px");
        danmu.$ref.style.top = "".concat(this.getDanmuTop(), "px");
        danmu.$ref.style.transform = "translateX(".concat(-danmu.$restWidth, "px) translateY(0px) translateZ(0px)");
        danmu.$ref.style.transition = "transform ".concat(danmu.$restTime, "s linear 0s");

        if (danmu.border) {
          danmu.$ref.style.border = "1px solid ".concat(danmu.border);
        }

        danmu.$state = 'emit';
      }
    }, {
      key: "resize",
      value: function resize() {
        var $player = this.art.template.$player;

        var _Danmuku$getRect = Danmuku.getRect($player),
            playerWidth = _Danmuku$getRect.width;

        this.queue.forEach(function (danmu) {
          danmu.$state = 'wait';
        });
        this.refs.forEach(function ($ref) {
          $ref.style.left = "".concat(playerWidth, "px");
          $ref.style.border = 'none';
          $ref.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
          $ref.style.transition = 'transform 0s linear 0s';
        });
      }
    }, {
      key: "suspend",
      value: function suspend(danmu) {
        var $player = this.art.template.$player;

        var _Danmuku$getRect2 = Danmuku.getRect($player),
            playerLeft = _Danmuku$getRect2.left,
            playerWidth = _Danmuku$getRect2.width;

        var _Danmuku$getRect3 = Danmuku.getRect(danmu.$ref),
            danmuLeft = _Danmuku$getRect3.left;

        danmu.$restTime -= (Date.now() - danmu.$lastStartTime) / 1000;
        var translateX = playerWidth - (danmuLeft - playerLeft) + 5;
        danmu.$ref.style.transform = "translateX(".concat(-translateX, "px) translateY(0px) translateZ(0px)");
        danmu.$ref.style.transition = 'transform 0s linear 0s';
        danmu.$state = 'stop';
      }
    }, {
      key: "addToQueue",
      value: function addToQueue(danmu) {
        var _this$art = this.art,
            notice = _this$art.notice,
            player = _this$art.player,
            i18n = _this$art.i18n;

        if (!danmu.text.trim()) {
          notice.show(i18n.get('Danmu text cannot be empty'));
          return;
        }

        if (danmu.text.length > this.option.maxlength) {
          notice.show("".concat(i18n.get('The length of the danmu does not exceed'), " ").concat(this.option.maxlength));
          return;
        }

        if (typeof danmu.time !== 'number') {
          danmu.time = player.currentTime;
        }

        this.queue.push(objectSpread({}, danmu, {
          $state: 'wait',
          $ref: null,
          $restTime: 0,
          $lastStartTime: 0
        }));
      }
    }, {
      key: "getDanmuRef",
      value: function getDanmuRef() {
        var $player = this.art.template.$player;
        var _this$art$constructor2 = this.art.constructor.utils,
            setStyles = _this$art$constructor2.setStyles,
            append = _this$art$constructor2.append;
        var playerLeft = Danmuku.getRect($player, 'left');
        var waitDanmu = this.queue.find(function (danmu) {
          if (danmu.$ref) {
            var _Danmuku$getRect4 = Danmuku.getRect(danmu.$ref),
                danmuLeft = _Danmuku$getRect4.left,
                danmuWidth = _Danmuku$getRect4.width;

            return danmu.$state === 'emit' && playerLeft > danmuLeft + danmuWidth;
          }

          return false;
        });

        if (waitDanmu) {
          waitDanmu.$state = 'wait';
          waitDanmu.$ref.style.border = 'none';
          waitDanmu.$ref.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
          waitDanmu.$ref.style.transition = 'transform 0s linear 0s';
          this.$danmuku.appendChild(waitDanmu.$ref);
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
        append(this.$danmuku, $ref);
        this.refs.push($ref);
        return $ref;
      }
    }, {
      key: "getDanmuTop",
      value: function getDanmuTop$1() {
        var $player = this.art.template.$player;

        var _Danmuku$getRect5 = Danmuku.getRect($player),
            playerLeft = _Danmuku$getRect5.left,
            playerTop = _Danmuku$getRect5.top,
            playerHeight = _Danmuku$getRect5.height,
            playerWidth = _Danmuku$getRect5.width;

        var danmus = this.queue.filter(function (danmu) {
          return danmu.$state === 'emit';
        });

        if (danmus.length === 0) {
          return this.option.margin[0];
        }

        var danmusBySort = danmus.map(function (danmu) {
          var _Danmuku$getRect6 = Danmuku.getRect(danmu.$ref),
              danmuLeft = _Danmuku$getRect6.left,
              danmuTop = _Danmuku$getRect6.top,
              danmuWidth = _Danmuku$getRect6.width,
              danmuHeight = _Danmuku$getRect6.height;

          var top = danmuTop - playerTop;
          var left = danmuLeft - playerLeft;
          var right = playerWidth - left - danmuWidth;
          return {
            top: top,
            left: left,
            right: right,
            height: danmuHeight,
            width: danmuWidth
          };
        }).sort(function (prev, next) {
          return prev.top - next.top;
        });
        danmusBySort.unshift({
          top: 0,
          left: 0,
          right: 0,
          height: this.option.margin[0],
          width: playerWidth
        });
        danmusBySort.push({
          top: playerHeight - this.option.margin[1],
          left: 0,
          right: 0,
          height: this.option.margin[1],
          width: playerWidth
        });
        return getDanmuTop(danmusBySort);
      }
    }, {
      key: "update",
      value: function update() {
        var _this2 = this;

        var player = this.art.player;
        this.animationFrameTimer = window.requestAnimationFrame(function () {
          if (player.playing) {
            _this2.queue.filter(function (danmu) {
              return player.currentTime + 0.1 >= danmu.time && danmu.time >= player.currentTime - 0.1 && danmu.$state === 'wait';
            }).forEach(function (danmu) {
              _this2.emit(danmu);
            });
          }

          if (!_this2.isStop) {
            _this2.update();
          }
        });
      }
    }, {
      key: "stop",
      value: function stop() {
        var _this3 = this;

        this.isStop = true;
        this.queue.filter(function (danmu) {
          return danmu.$state === 'emit';
        }).forEach(function (danmu) {
          _this3.suspend(danmu);
        });
        window.cancelAnimationFrame(this.animationFrameTimer);
        this.art.emit('artplayerPluginDanmu:stop');
      }
    }, {
      key: "start",
      value: function start() {
        this.isStop = false;
        this.queue.filter(function (danmu) {
          return danmu.$state === 'stop';
        }).forEach(function (danmu) {
          Danmuku["continue"](danmu);
        });
        this.update();
        this.art.emit('artplayerPluginDanmu:start');
      }
    }, {
      key: "show",
      value: function show() {
        this.$danmuku.style = 'none';
        this.art.emit('artplayerPluginDanmu:show');
      }
    }, {
      key: "hide",
      value: function hide() {
        this.$danmuku.style = 'block';
        this.art.emit('artplayerPluginDanmu:hide');
      }
    }], [{
      key: "getRect",
      value: function getRect(ref, key) {
        var result = ref.getBoundingClientRect();
        return key ? result[key] : result;
      }
    }, {
      key: "continue",
      value: function _continue(danmu) {
        danmu.$lastStartTime = Date.now();
        danmu.$ref.style.transform = "translateX(".concat(-danmu.$restWidth, "px) translateY(0px) translateZ(0px)");
        danmu.$ref.style.transition = "transform ".concat(danmu.$restTime, "s linear 0s");
        danmu.$state = 'emit';
      }
    }, {
      key: "i18n",
      get: function get() {
        return {
          'zh-cn': {
            'Danmu text cannot be empty': '弹幕文本不能为空',
            'The length of the danmu does not exceed': '弹幕文本字数不能超过'
          },
          'zh-tw': {
            'Danmu text cannot be empty': '彈幕文本不能為空',
            'The length of the danmu does not exceed': '彈幕文本字數不能超過'
          }
        };
      }
    }, {
      key: "option",
      get: function get() {
        return {
          danmuku: [],
          speed: 5,
          opacity: 1,
          color: '#fff',
          size: 25,
          maxlength: 50,
          margin: [10, 20]
        };
      }
    }, {
      key: "scheme",
      get: function get() {
        return {
          danmuku: 'array|function|string',
          speed: 'number',
          opacity: 'number',
          color: 'string',
          size: 'number',
          maxlength: 'number',
          margin: 'array'
        };
      }
    }]);

    return Danmuku;
  }();

  function artplayerPluginDanmuku(option) {
    return function (art) {
      var danmuku = new Danmuku(art, option);
      return {
        name: 'artplayerPluginDanmuku',
        emit: danmuku.addToQueue.bind(danmuku),
        config: danmuku.config.bind(danmuku),
        start: danmuku.start.bind(danmuku),
        stop: danmuku.stop.bind(danmuku),
        hide: danmuku.hide.bind(danmuku),
        show: danmuku.show.bind(danmuku)
      };
    };
  }

  artplayerPluginDanmuku.bilibiliDanmuParseFromXml = bilibiliDanmuParseFromXml;
  artplayerPluginDanmuku.bilibiliDanmuParseFromAv = bilibiliDanmuParseFromAv;
  artplayerPluginDanmuku.bilibiliDanmuParseFromUrl = bilibiliDanmuParseFromUrl;

  return artplayerPluginDanmuku;

}));
//# sourceMappingURL=artplayer-plugin-danmuku.js.map
