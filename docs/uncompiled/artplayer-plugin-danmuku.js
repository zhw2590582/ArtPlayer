(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.artplayerPluginDanmuku = factory());
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

  var i18n = {
    'zh-cn': {
      'Danmu opacity': '弹幕透明度',
      'Danmu speed': '弹幕速度',
      'Danmu size': '弹幕大小',
      'Danmu text cannot be empty': '弹幕文本不能为空',
      'The length of the danmu does not exceed': '弹幕文本字数不能超过',
      'Danmu speed synchronous playback multiple': '弹幕速度同步播放倍数'
    },
    'zh-tw': {
      'Danmu opacity': '彈幕透明度',
      'Danmu speed': '彈幕速度',
      'Danmu size': '弹幕大小',
      'Danmu text cannot be empty': '彈幕文本不能為空',
      'The length of the danmu does not exceed': '彈幕文本字數不能超過',
      'Danmu speed synchronous playback multiple': '彈幕速度同步播放倍數'
    }
  };

  function opacity(art) {
    var i18n = art.i18n,
        proxy = art.events.proxy;
    return {
      name: 'danmuku-opacity',
      index: 10,
      html: "\n            <div class=\"art-setting-header\">\n                ".concat(i18n.get('Danmu opacity'), ": <span class=\"art-value\">100</span>%\n            </div>\n            <div class=\"art-setting-range\">\n                <input type=\"range\" value=\"1\" min=\"0.1\" max=\"1\" step=\"0.1\">\n            </div>\n        "),
      mounted: function mounted($setting) {
        var $range = $setting.querySelector('input[type=range]');
        var $value = $setting.querySelector('.art-value');
        proxy($range, 'change', function () {
          var value = $range.value;
          $value.innerText = Number(value) * 100;
          art.plugins.artplayerPluginDanmuku.config({
            opacity: Number(value)
          });
        });
        art.on('artplayerPluginDanmuku:config', function (config) {
          if ($range.value !== config.opacity) {
            $range.value = config.opacity;
            $value.innerText = config.opacity * 100;
          }
        });
      }
    };
  }
  function size(art) {
    var i18n = art.i18n,
        proxy = art.events.proxy;
    return {
      name: 'danmuku-size',
      index: 11,
      html: "\n            <div class=\"art-setting-header\">\n                ".concat(i18n.get('Danmu size'), ": <span class=\"art-value\">25</span>px\n            </div>\n            <div class=\"art-setting-range\">\n                <input type=\"range\" value=\"25\" min=\"14\" max=\"30\" step=\"1\">\n            </div>\n        "),
      mounted: function mounted($setting) {
        var $range = $setting.querySelector('input[type=range]');
        var $value = $setting.querySelector('.art-value');
        proxy($range, 'change', function () {
          var value = $range.value;
          $value.innerText = value;
          art.plugins.artplayerPluginDanmuku.config({
            fontSize: Number(value)
          });
        });
        art.on('artplayerPluginDanmuku:config', function (config) {
          if ($range.value !== config.fontSize) {
            $range.value = config.fontSize;
            $value.innerText = config.fontSize;
          }
        });
      }
    };
  }
  function speed(art) {
    var i18n = art.i18n,
        proxy = art.events.proxy;
    return {
      name: 'danmuku-speed',
      index: 12,
      html: "\n            <div class=\"art-setting-header\">\n                ".concat(i18n.get('Danmu speed'), ": <span class=\"art-value\">5</span>s\n            </div>\n            <div class=\"art-setting-range\">\n                <input type=\"range\" value=\"5\" min=\"1\" max=\"10\" step=\"1\">\n            </div>\n        "),
      mounted: function mounted($setting) {
        var $range = $setting.querySelector('input[type=range]');
        var $value = $setting.querySelector('.art-value');
        proxy($range, 'change', function () {
          var value = $range.value;
          $value.innerText = value;
          art.plugins.artplayerPluginDanmuku.config({
            speed: Number(value)
          });
        });
        art.on('artplayerPluginDanmuku:config', function (config) {
          if ($range.value !== config.speed) {
            $range.value = config.speed;
            $value.innerText = config.speed;
          }
        });
      }
    };
  }
  function synchronousPlayback(art) {
    var i18n = art.i18n,
        proxy = art.events.proxy;
    return {
      name: 'danmuku-synchronousPlayback',
      index: 13,
      html: "\n            <label class=\"art-setting-checkbox\">\n                <input type=\"checkbox\"/>".concat(i18n.get('Danmu speed synchronous playback multiple'), "\n            </label>\n        "),
      mounted: function mounted($setting) {
        var $checkbox = $setting.querySelector('input[type=checkbox]');
        proxy($checkbox, 'change', function () {
          art.plugins.artplayerPluginDanmuku.config({
            synchronousPlayback: $checkbox.checked
          });
        });
        art.on('artplayerPluginDanmuku:config', function (config) {
          if ($checkbox.checked !== config.synchronousPlayback) {
            $checkbox.checked = config.synchronousPlayback;
          }
        });
      }
    };
  }

  function filter(queue, state, callback) {
    return queue.filter(function (danmu) {
      return danmu.$state === state;
    }).map(callback);
  }
  function getRect(ref, key) {
    var result = ref.getBoundingClientRect();
    return key ? result[key] : result;
  }
  function getDanmuRef(queue) {
    var result = queue.find(function (danmu) {
      return danmu.$ref && danmu.$state === 'wait';
    });

    if (result) {
      var _$ref = result.$ref;
      result.$ref = null;
      return _$ref;
    }

    var $ref = document.createElement('div');
    $ref.style.cssText = "\n        user-select: none;\n        position: absolute;\n        white-space: pre;\n        pointer-events: none;\n        perspective: 500px;\n        display: inline-block;\n        will-change: transform;\n        font-family: SimHei, \"Microsoft JhengHei\", Arial, Helvetica, sans-serif;\n        font-weight: normal;\n        line-height: 1.125;\n        text-shadow: rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px;\n    ";
    return $ref;
  }

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

  function getMode(key) {
    switch (key) {
      case 1:
      case 2:
      case 3:
        return 0;

      case 4:
      case 5:
        return 1;

      default:
        return 0;
    }
  }
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
        mode: getMode(Number(attr[1])),
        fontSize: Number(attr[2]),
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

  function calculatedTop(danmus) {
    var top = 0;
    var topMap = {};

    for (var index = 0; index < danmus.length; index += 1) {
      var item = danmus[index];

      if (topMap[item.top]) {
        topMap[item.top].push(item);
      } else {
        topMap[item.top] = [item];
      }
    }

    var topMapKeys = Object.keys(topMap);
    var maxDiff = 0;

    for (var _index = 1; _index < danmus.length; _index += 1) {
      var _item = danmus[_index];
      var prev = danmus[_index - 1];
      var prevTop = prev.top + prev.height;
      var diff = _item.top - prevTop;

      if (diff > maxDiff) {
        top = prevTop;
        maxDiff = diff;
      }
    }

    if (top === 0) {
      var maxRight = 0;

      for (var _index2 = 0; _index2 < topMapKeys.length; _index2 += 1) {
        var minRight = danmus[0].width;
        var topKey = topMapKeys[_index2];
        var danmuArr = topMap[topKey];

        for (var _index3 = 0; _index3 < danmuArr.length; _index3 += 1) {
          var danmu = danmuArr[_index3];

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
    }

    if (top === 0) {
      var _topMapKeys$filter$so = topMapKeys.filter(function (item, index) {
        return index !== 0 && index !== topMapKeys.length - 1;
      }).sort(function (prev, next) {
        return topMap[prev].length - topMap[next].length;
      });

      var _topMapKeys$filter$so2 = slicedToArray(_topMapKeys$filter$so, 1);

      top = _topMapKeys$filter$so2[0];
    }

    return top;
  }

  function getDanmuTop(ins, danmu) {
    var _ins$option$margin = slicedToArray(ins.option.margin, 2),
        marginTop = _ins$option$margin[0],
        marginBottom = _ins$option$margin[1];

    var playerData = getRect(ins.art.template.$player);
    var danmus = ins.queue.filter(function (item) {
      return item.mode === danmu.mode && item.$state === 'emit' && item.$ref && item.$ref.style.fontSize === danmu.$ref.style.fontSize && parseFloat(item.$ref.style.top) <= playerData.height - marginBottom;
    }).map(function (item) {
      var danmuData = getRect(item.$ref);
      var width = danmuData.width,
          height = danmuData.height;
      var top = danmuData.top - playerData.top;
      var left = danmuData.left - playerData.left;
      var right = playerData.width - left - width;
      return {
        top: top,
        left: left,
        height: height,
        width: width,
        right: right
      };
    }).sort(function (prev, next) {
      return prev.top - next.top;
    });

    if (danmus.length === 0) {
      return marginTop;
    }

    danmus.unshift({
      top: 0,
      left: 0,
      right: 0,
      height: marginTop,
      width: playerData.width
    });
    danmus.push({
      top: playerData.height - marginBottom,
      left: 0,
      right: 0,
      height: marginBottom,
      width: playerData.width
    });
    return calculatedTop(danmus);
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var Danmuku =
  /*#__PURE__*/
  function () {
    function Danmuku(art, option) {
      var _this = this;

      classCallCheck(this, Danmuku);

      art.i18n.update(i18n);
      art.setting.add(opacity);
      art.setting.add(size);
      art.setting.add(speed);
      art.setting.add(synchronousPlayback);
      this.art = art;
      this.queue = [];
      this.option = {};
      this.config(option);
      this.isStop = false;
      this.isHide = false;
      this.animationFrameTimer = null;
      this.$danmuku = art.template.$danmuku;
      art.on('video:play', this.start.bind(this));
      art.on('video:playing', this.start.bind(this));
      art.on('video:pause', this.stop.bind(this));
      art.on('video:waiting', this.stop.bind(this));
      art.on('resize', this.resize.bind(this));
      art.on('destroy', this.stop.bind(this));

      if (typeof this.option.danmuku === 'function') {
        this.option.danmuku().then(function (danmus) {
          danmus.forEach(_this.emit.bind(_this));
          art.emit('artplayerPluginDanmuku:loaded');
        });
      } else if (typeof this.option.danmuku === 'string') {
        bilibiliDanmuParseFromUrl(this.option.danmuku).then(function (danmus) {
          danmus.forEach(_this.emit.bind(_this));
          art.emit('artplayerPluginDanmuku:loaded');
        });
      } else {
        this.option.danmuku.forEach(this.emit.bind(this));
        art.emit('artplayerPluginDanmuku:loaded');
      }
    }

    createClass(Danmuku, [{
      key: "config",
      value: function config(option) {
        var _this$art$constructor = this.art.constructor,
            clamp = _this$art$constructor.utils.clamp,
            validator = _this$art$constructor.validator;
        this.option = Object.assign({}, Danmuku.option, this.option, option);
        validator(this.option, Danmuku.scheme);
        this.option.speed = clamp(this.option.speed, 1, 10);
        this.option.maxlength = clamp(this.option.maxlength, 10, 100);
        this.option.margin[0] = clamp(this.option.margin[0], 0, 100);
        this.option.margin[1] = clamp(this.option.margin[1], 0, 100);
        this.option.opacity = clamp(this.option.opacity, 0, 1);
        this.option.fontSize = clamp(this.option.fontSize, 12, 30);
        this.art.emit('artplayerPluginDanmuku:config', this.option);
      }
    }, {
      key: "continue",
      value: function _continue() {
        filter(this.queue, 'stop', function (danmu) {
          danmu.$state = 'emit';
          danmu.$lastStartTime = Date.now();

          switch (danmu.mode) {
            case 0:
              danmu.$ref.style.transform = "translateX(".concat(-danmu.$restWidth, "px) translateY(0px) translateZ(0px)");
              danmu.$ref.style.transition = "transform ".concat(danmu.$restTime, "s linear 0s");
              break;
          }
        });
      }
    }, {
      key: "suspend",
      value: function suspend() {
        var $player = this.art.template.$player;
        filter(this.queue, 'emit', function (danmu) {
          danmu.$state = 'stop';

          switch (danmu.mode) {
            case 0:
              {
                var _getRect = getRect($player),
                    playerLeft = _getRect.left,
                    playerWidth = _getRect.width;

                var _getRect2 = getRect(danmu.$ref),
                    danmuLeft = _getRect2.left;

                var translateX = playerWidth - (danmuLeft - playerLeft) + 5;
                danmu.$ref.style.transform = "translateX(".concat(-translateX, "px) translateY(0px) translateZ(0px)");
                danmu.$ref.style.transition = 'transform 0s linear 0s';
                break;
              }
          }
        });
      }
    }, {
      key: "resize",
      value: function resize() {
        var $player = this.art.template.$player;
        var danmuLeft = getRect($player, 'width');
        filter(this.queue, 'wait', function (danmu) {
          if (danmu.$ref) {
            danmu.$ref.style.border = 'none';
            danmu.$ref.style.left = "".concat(danmuLeft, "px");
            danmu.$ref.style.marginLeft = '0px';
            danmu.$ref.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
            danmu.$ref.style.transition = 'transform 0s linear 0s';
          }
        });
      }
    }, {
      key: "update",
      value: function update() {
        var _this2 = this;

        var _this$art = this.art,
            player = _this$art.player,
            $player = _this$art.template.$player;
        this.animationFrameTimer = window.requestAnimationFrame(function () {
          if (player.playing && !_this2.isHide) {
            var danmuLeft = getRect($player, 'width');
            filter(_this2.queue, 'emit', function (danmu) {
              danmu.$restTime -= (Date.now() - danmu.$lastStartTime) / 1000;
              danmu.$lastStartTime = Date.now();

              if (danmu.$restTime <= 0) {
                danmu.$state = 'wait';
                danmu.$ref.style.border = 'none';
                danmu.$ref.style.left = "".concat(danmuLeft, "px");
                danmu.$ref.style.marginLeft = '0px';
                danmu.$ref.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
                danmu.$ref.style.transition = 'transform 0s linear 0s';
              }
            });

            _this2.queue.filter(function (danmu) {
              return player.currentTime + 0.1 >= danmu.time && danmu.time >= player.currentTime - 0.1 && danmu.$state === 'wait';
            }).forEach(function (danmu) {
              danmu.$ref = getDanmuRef(_this2.queue);

              _this2.$danmuku.appendChild(danmu.$ref);

              danmu.$ref.style.opacity = _this2.option.opacity;
              danmu.$ref.style.fontSize = "".concat(_this2.option.fontSize, "px");
              danmu.$ref.innerText = danmu.text;
              danmu.$ref.style.color = danmu.color || '#fff';
              danmu.$ref.style.border = danmu.border ? "1px solid ".concat(danmu.color || '#fff') : 'none';
              danmu.$restTime = _this2.option.synchronousPlayback && player.playbackRate ? _this2.option.speed / Number(player.playbackRate) : _this2.option.speed;
              danmu.$lastStartTime = Date.now();
              var danmuWidth = getRect(danmu.$ref, 'width');
              var danmuTop = getDanmuTop(_this2, danmu);
              danmu.$state = 'emit';

              switch (danmu.mode) {
                case 0:
                  {
                    danmu.$restWidth = danmuLeft + danmuWidth + 5;
                    danmu.$ref.style.left = "".concat(danmuLeft, "px");
                    danmu.$ref.style.top = "".concat(danmuTop, "px");
                    danmu.$ref.style.transform = "translateX(".concat(-danmu.$restWidth, "px) translateY(0px) translateZ(0px)");
                    danmu.$ref.style.transition = "transform ".concat(danmu.$restTime, "s linear 0s");
                    break;
                  }

                case 1:
                  danmu.$ref.style.top = "".concat(danmuTop, "px");
                  danmu.$ref.style.left = '50%';
                  danmu.$ref.style.marginLeft = "-".concat(danmuWidth / 2, "px");
                  break;
              }
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
        this.isStop = true;
        this.suspend();
        window.cancelAnimationFrame(this.animationFrameTimer);
        this.art.emit('artplayerPluginDanmuku:stop');
      }
    }, {
      key: "start",
      value: function start() {
        this.isStop = false;
        this.continue();
        this.update();
        this.art.emit('artplayerPluginDanmuku:start');
      }
    }, {
      key: "show",
      value: function show() {
        this.isHide = false;
        this.$danmuku.style.display = 'block';
        this.art.emit('artplayerPluginDanmuku:show');
      }
    }, {
      key: "hide",
      value: function hide() {
        this.isHide = true;
        this.$danmuku.style.display = 'none';
        this.art.emit('artplayerPluginDanmuku:hide');
      }
    }, {
      key: "emit",
      value: function emit(danmu) {
        var _this$art2 = this.art,
            notice = _this$art2.notice,
            player = _this$art2.player,
            i18n = _this$art2.i18n;
        var _this$art$constructor2 = this.art.constructor,
            clamp = _this$art$constructor2.utils.clamp,
            validator = _this$art$constructor2.validator;
        validator(danmu, {
          text: 'string',
          mode: 'number|undefined',
          color: 'string|undefined',
          time: 'number|undefined',
          border: 'boolean|undefined'
        });

        if (!danmu.text.trim()) {
          notice.show = i18n.get('Danmu text cannot be empty');
          return;
        }

        if (danmu.text.length > this.option.maxlength) {
          notice.show = "".concat(i18n.get('The length of the danmu does not exceed'), " ").concat(this.option.maxlength);
          return;
        }

        if (danmu.time) {
          danmu.time = clamp(danmu.time, 0, Infinity);
        } else {
          danmu.time = player.currentTime + 0.5;
        }

        this.queue.push(_objectSpread({
          mode: 0
        }, danmu, {
          $state: 'wait',
          $ref: null,
          $restTime: 0,
          $lastStartTime: 0,
          $restWidth: 0
        }));
      }
    }], [{
      key: "option",
      get: function get() {
        return {
          danmuku: [],
          speed: 5,
          maxlength: 50,
          margin: [10, 100],
          opacity: 1,
          fontSize: 25,
          synchronousPlayback: false
        };
      }
    }, {
      key: "scheme",
      get: function get() {
        return {
          danmuku: 'array|function|string',
          speed: 'number',
          maxlength: 'number',
          margin: 'array',
          opacity: 'number',
          fontSize: 'number',
          synchronousPlayback: 'boolean'
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
        emit: danmuku.emit.bind(danmuku),
        config: danmuku.config.bind(danmuku),
        hide: danmuku.hide.bind(danmuku),
        show: danmuku.show.bind(danmuku),

        get isHide() {
          return danmuku.isHide;
        }

      };
    };
  }

  return artplayerPluginDanmuku;

})));
//# sourceMappingURL=artplayer-plugin-danmuku.js.map
