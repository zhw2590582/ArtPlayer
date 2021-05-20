(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Artplayer = factory());
}(this, (function () { 'use strict';

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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

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

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".art-undercover{background:#000;position:fixed;top:0;left:0;display:none;height:100%;width:100%;opacity:.9;z-index:10}.art-video-player{display:-webkit-box;display:-ms-flexbox;display:flex;position:relative;margin:0 auto;z-index:20;width:100%;height:100%;outline:0;zoom:1;font-family:Roboto,Arial,Helvetica,sans-serif;color:#eee;background-color:#000;text-align:left;direction:ltr;font-size:14px;line-height:1.3;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-ms-touch-action:manipulation;touch-action:manipulation;-ms-high-contrast-adjust:none}.art-video-player *{margin:0;padding:0;-webkit-box-sizing:border-box;box-sizing:border-box}.art-video-player ::-webkit-scrollbar{width:5px}.art-video-player ::-webkit-scrollbar-thumb{background-color:#666}.art-video-player ::-webkit-scrollbar-thumb:hover{background-color:#ccc}.art-video-player .art-icon{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;line-height:1.5}.art-video-player .art-icon svg{fill:#fff}.art-video-player img{max-width:100%;vertical-align:top}@supports ((-webkit-backdrop-filter:initial) or (backdrop-filter:initial)){.art-video-player .art-backdrop-filter{-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px);background-color:rgba(0,0,0,.7)!important}}.art-video-player .art-video{z-index:10;background-color:#000;cursor:pointer}.art-video-player .art-poster,.art-video-player .art-video{position:absolute;left:0;top:0;right:0;bottom:0;width:100%;height:100%}.art-video-player .art-poster{z-index:11;background-position:50%;background-repeat:no-repeat;background-size:cover;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}.art-video-player .art-subtitle{display:none;position:absolute;z-index:20;bottom:10px;width:100%;padding:0 20px;text-align:center;color:#fff;font-size:20px;pointer-events:none;text-shadow:.5px .5px .5px rgba(0,0,0,.5)}.art-video-player .art-subtitle p{word-break:break-all;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;margin:5px 0 0;line-height:1.2}.art-video-player .art-bilingual p:nth-child(n+2){-webkit-transform:scale(.6);transform:scale(.6);-webkit-transform-origin:center top;transform-origin:center top}.art-video-player.art-subtitle-show .art-subtitle{display:block}.art-video-player.art-control-show .art-subtitle{bottom:50px}.art-video-player .art-danmuku{z-index:30}.art-video-player .art-danmuku,.art-video-player .art-layers{position:absolute;left:0;top:0;right:0;bottom:0;width:100%;height:100%;overflow:hidden;pointer-events:none}.art-video-player .art-layers{display:none;z-index:40}.art-video-player .art-layers .art-layer{pointer-events:auto}.art-video-player.art-layer-show .art-layers{display:block}.art-video-player .art-mask{display:none;z-index:50;left:0;top:0;right:0;bottom:0;width:100%;height:100%;overflow:hidden;pointer-events:none}.art-video-player .art-mask,.art-video-player .art-mask .art-state{-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;position:absolute}.art-video-player .art-mask .art-state{right:30px;bottom:55px;width:60px;height:60px;opacity:.6}.art-video-player.art-mask-show .art-mask,.art-video-player .art-mask .art-state{display:-webkit-box;display:-ms-flexbox;display:flex}.art-video-player .art-loading{display:none;position:absolute;z-index:70;left:0;top:0;right:0;bottom:0;width:100%;height:100%;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;pointer-events:none}.art-video-player.art-loading-show .art-loading{display:-webkit-box;display:-ms-flexbox;display:flex}.art-video-player .art-bottom{position:absolute;z-index:60;left:0;right:0;bottom:0;height:100px;padding:55px 10px 0;opacity:0;visibility:hidden;-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out;pointer-events:none;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==) repeat-x bottom}.art-video-player .art-bottom .art-progress{position:relative;pointer-events:auto}.art-video-player .art-bottom .art-progress .art-control-progress{position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:4px;cursor:pointer}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner{position:relative;height:50%;width:100%;background:hsla(0,0%,100%,.2)}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-loaded{position:absolute;z-index:10;left:0;top:0;right:0;bottom:0;height:100%;width:0;background:hsla(0,0%,100%,.4)}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-played{position:absolute;z-index:20;left:0;top:0;right:0;bottom:0;height:100%;width:0}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight{position:absolute;z-index:30;left:0;top:0;right:0;bottom:0;height:100%;pointer-events:none}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight span{display:inline-block;position:absolute;left:0;top:0;width:7px;height:100%;background:#fff;pointer-events:auto}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator{display:none;position:absolute;z-index:40;top:-5px;left:-6.5px;width:13px;height:13px;border-radius:50%}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator.art-show-indicator{display:block}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip{display:none;position:absolute;z-index:50;top:-25px;left:0;height:20px;padding:0 5px;line-height:20px;color:#fff;font-size:12px;text-align:center;background:rgba(0,0,0,.7);border-radius:3px;font-weight:700;white-space:nowrap}.art-video-player .art-bottom .art-progress .art-control-progress:hover .art-control-progress-inner{height:100%}.art-video-player .art-bottom .art-progress .art-control-progress:hover .art-control-progress-inner .art-progress-indicator,.art-video-player .art-bottom .art-progress .art-control-progress:hover .art-control-progress-inner .art-progress-tip{display:block}.art-video-player .art-bottom .art-progress .art-control-thumbnails{display:none;position:absolute;bottom:8px;left:0;pointer-events:none;background-color:rgba(0,0,0,.7)}.art-video-player .art-bottom .art-progress .art-control-loop{display:none;position:absolute;width:100%;height:100%;left:0;top:0;right:0;bottom:0;pointer-events:none}.art-video-player .art-bottom .art-progress .art-control-loop .art-loop-point{position:absolute;left:0;top:-2px;width:2px;height:8px;background:hsla(0,0%,100%,.75)}.art-video-player .art-bottom .art-controls{position:relative;pointer-events:auto;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;height:40px;padding:5px 0}.art-video-player .art-bottom .art-controls,.art-video-player .art-bottom .art-controls .art-controls-left,.art-video-player .art-bottom .art-controls .art-controls-right{display:-webkit-box;display:-ms-flexbox;display:flex}.art-video-player .art-bottom .art-controls .art-control{opacity:.9;font-size:12px;height:36px;min-width:36px;line-height:36px;text-align:center;cursor:pointer;white-space:nowrap}.art-video-player .art-bottom .art-controls .art-control .art-icon{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;float:left;height:36px;width:36px}.art-video-player .art-bottom .art-controls .art-control:hover{opacity:1}.art-video-player .art-bottom .art-controls .art-control-onlyText{padding:0 10px}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel{position:relative;float:left;width:0;height:100%;-webkit-transition:margin .2s cubic-bezier(.4,0,1,1),width .2s cubic-bezier(.4,0,1,1);transition:margin .2s cubic-bezier(.4,0,1,1),width .2s cubic-bezier(.4,0,1,1);overflow:hidden}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle{position:absolute;top:50%;left:0;width:12px;height:12px;border-radius:12px;margin-top:-6px;background:#fff}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:before{left:-54px;background:#fff}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:after{left:6px;background:hsla(0,0%,100%,.2)}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:after,.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:before{content:\"\";position:absolute;display:block;top:50%;height:3px;margin-top:-2px;width:60px}.art-video-player .art-bottom .art-controls .art-control-volume:hover .art-volume-panel{width:60px}.art-video-player .art-bottom .art-controls .art-control-quality{position:relative;z-index:30}.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys{display:none;position:absolute;bottom:35px;width:100px;padding:5px 0;text-align:center;color:#fff;background:rgba(0,0,0,.8);border-radius:3px}.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys .art-quality-item{height:30px;line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 0 2px rgba(0,0,0,.5)}.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys .art-quality-item:hover{background-color:hsla(0,0%,100%,.1)}.art-video-player .art-bottom .art-controls .art-control-quality:hover .art-qualitys{display:block}.art-video-player.art-control-show .art-bottom,.art-video-player.art-hover .art-bottom{opacity:1;visibility:visible}.art-video-player.art-destroy .art-progress-indicator,.art-video-player.art-destroy .art-progress-tip,.art-video-player.art-error .art-progress-indicator,.art-video-player.art-error .art-progress-tip{display:none!important}.art-video-player .art-notice{display:none;font-size:14px;position:absolute;z-index:80;left:0;top:0;padding:10px;width:100%;pointer-events:none}.art-video-player .art-notice .art-notice-inner{display:inline-block;padding:5px 10px;color:#fff;background:rgba(0,0,0,.6);border-radius:3px}.art-video-player.art-notice-show .art-notice{display:-webkit-box;display:-ms-flexbox;display:flex}.art-video-player .art-contextmenus{display:none;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;position:absolute;z-index:120;left:0;top:0;min-width:200px;padding:5px 0;background:rgba(0,0,0,.9);border-radius:3px}.art-video-player .art-contextmenus .art-contextmenu{cursor:pointer;font-size:12px;display:block;color:#fff;padding:10px 15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 0 2px rgba(0,0,0,.5);border-bottom:1px solid hsla(0,0%,100%,.1)}.art-video-player .art-contextmenus .art-contextmenu a{color:#fff;text-decoration:none}.art-video-player .art-contextmenus .art-contextmenu span{display:inline-block;padding:0 7px}.art-video-player .art-contextmenus .art-contextmenu span.art-current,.art-video-player .art-contextmenus .art-contextmenu span:hover{color:#00c9ff}.art-video-player .art-contextmenus .art-contextmenu:hover{background-color:hsla(0,0%,100%,.1)}.art-video-player .art-contextmenus .art-contextmenu:last-child{border-bottom:none}.art-video-player.art-contextmenu-show .art-contextmenus,.art-video-player .art-settings{display:-webkit-box;display:-ms-flexbox;display:flex}.art-video-player .art-settings{-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;position:absolute;z-index:90;left:0;top:0;height:100%;width:100%;opacity:0;visibility:hidden;pointer-events:none;overflow:hidden}.art-video-player .art-settings .art-setting-inner{position:absolute;top:0;right:-300px;bottom:0;width:300px;height:100%;font-size:12px;background:rgba(0,0,0,.9);-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out;overflow:auto}.art-video-player .art-settings .art-setting-inner .art-setting-body{overflow-y:auto;width:100%;height:100%}.art-video-player .art-settings .art-setting-inner .art-setting-body .art-setting{border-bottom:1px solid hsla(0,0%,100%,.1);padding:10px 15px}.art-video-player .art-settings .art-setting-inner .art-setting-body .art-setting .art-setting-header{margin-bottom:5px}.art-video-player .art-settings .art-setting-radio{display:-webkit-box;display:-ms-flexbox;display:flex}.art-video-player .art-settings .art-setting-radio .art-radio-item{-webkit-box-flex:1;-ms-flex:1;flex:1;padding:0 2px}.art-video-player .art-settings .art-setting-radio .art-radio-item button{height:22px;width:100%;border:none;outline:none;color:#fff;background:hsla(0,0%,100%,.2);border-radius:2px}.art-video-player .art-settings .art-setting-radio .art-radio-item.current button,.art-video-player .art-settings .art-setting-radio .art-radio-item button:active{background-color:#00a1d6}.art-video-player .art-settings .art-setting-range input{width:100%;height:3px;outline:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:hsla(0,0%,100%,.5)}.art-video-player .art-settings .art-setting-checkbox{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.art-video-player .art-settings .art-setting-checkbox input{height:14px;width:14px;margin-right:5px}.art-video-player .art-settings .art-setting-upload{display:-webkit-box;display:-ms-flexbox;display:flex}.art-video-player .art-settings .art-setting-upload .art-upload-btn{width:80px;height:22px;line-height:22px;border:none;outline:none;color:#fff;background:hsla(0,0%,100%,.2);border-radius:2px;text-align:center}.art-video-player .art-settings .art-setting-upload .art-upload-value{-webkit-box-flex:1;-ms-flex:1;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;height:22px;line-height:22px;padding-left:10px}.art-video-player.art-setting-show .art-settings{opacity:1;visibility:visible;pointer-events:auto}.art-video-player.art-setting-show .art-settings .art-setting-inner{right:0}.art-video-player .art-info{display:none;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;position:absolute;left:10px;top:10px;z-index:100;width:350px;padding:10px;color:#fff;font-size:12px;font-family:Noto Sans CJK SC DemiLight,Roboto,Segoe UI,Tahoma,Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;background:rgba(0,0,0,.9)}.art-video-player .art-info .art-info-item{display:-webkit-box;display:-ms-flexbox;display:flex;margin-bottom:5px}.art-video-player .art-info .art-info-item .art-info-title{width:100px;text-align:right}.art-video-player .art-info .art-info-item .art-info-content{-webkit-box-flex:1;-ms-flex:1;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:5px}.art-video-player .art-info .art-info-item:last-child{margin-bottom:0}.art-video-player .art-info .art-info-close{position:absolute;top:5px;right:5px;cursor:pointer}.art-video-player.art-info-show .art-info{display:-webkit-box;display:-ms-flexbox;display:flex}.art-video-player.art-hide-cursor *{cursor:none!important}.art-video-player[data-aspect-ratio] video{-webkit-box-sizing:content-box;box-sizing:content-box;-o-object-fit:fill;object-fit:fill}.art-video-player.art-fullscreen-web{position:fixed;z-index:9999;width:100%!important;height:100%!important;left:0;top:0;right:0;bottom:0}.art-fullscreen-rotate{position:fixed;z-index:9999;width:100%;height:100%;left:0;top:0;right:0;bottom:0;background:#000}.art-video-player .art-mini-header{display:none;position:absolute;z-index:110;left:0;top:0;right:0;height:35px;line-height:35px;color:#fff;background:rgba(0,0,0,.5);-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;opacity:0;visibility:hidden;-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.art-video-player .art-mini-header .art-mini-title{-webkit-box-flex:1;-ms-flex:1;flex:1;padding:0 10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:move}.art-video-player .art-mini-header .art-mini-close{width:35px;text-align:center;font-size:22px;cursor:pointer}.art-video-player.art-is-dragging{opacity:.7}.art-video-player.art-mini{position:fixed;z-index:9999;width:400px;height:225px;-webkit-box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 3px 6px 0 rgba(0,0,0,.2);box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 3px 6px 0 rgba(0,0,0,.2)}.art-video-player.art-mini .art-mini-header{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.art-video-player.art-mini.art-hover .art-mini-header{opacity:1;visibility:visible}.art-video-player.art-mini .art-mask .art-state{position:static}.art-video-player.art-mini .art-bottom,.art-video-player.art-mini .art-contextmenu,.art-video-player.art-mini .art-danmu,.art-video-player.art-mini .art-info,.art-video-player.art-mini .art-layers,.art-video-player.art-mini .art-notice,.art-video-player.art-mini .art-setting,.art-video-player.art-mini .art-subtitle{display:none!important}.art-auto-size{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.art-video-player[data-flip=horizontal] .art-video{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.art-video-player[data-flip=vertical] .art-video{-webkit-transform:scaleY(-1);transform:scaleY(-1)}.art-video-player .art-control-selector{position:relative}.art-video-player .art-control-selector .art-selector-list{display:none;position:absolute;bottom:35px;width:100px;padding:5px 0;text-align:center;color:#fff;background:rgba(0,0,0,.8);border-radius:3px}.art-video-player .art-control-selector .art-selector-list .art-selector-item{height:30px;line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 0 2px rgba(0,0,0,.5)}.art-video-player .art-control-selector .art-selector-list .art-selector-item:hover{background-color:hsla(0,0%,100%,.1)}.art-video-player .art-control-selector:hover .art-selector-list{display:block}:root{--balloon-color:rgba(16,16,16,0.95);--balloon-font-size:12px;--balloon-move:4px}button[aria-label][data-balloon-pos]{overflow:visible}[aria-label][data-balloon-pos]{position:relative;cursor:pointer}[aria-label][data-balloon-pos]:after{text-indent:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-weight:400;font-style:normal;text-shadow:none;font-size:var(--balloon-font-size);background:var(--balloon-color);border-radius:2px;color:#fff;content:attr(aria-label);padding:.5em 1em;white-space:nowrap;line-height:1.2}[aria-label][data-balloon-pos]:after,[aria-label][data-balloon-pos]:before{opacity:0;pointer-events:none;-webkit-transition:all .18s ease-out .18s;transition:all .18s ease-out .18s;position:absolute;z-index:10}[aria-label][data-balloon-pos]:before{width:0;height:0;border:5px solid transparent;border-top:5px solid var(--balloon-color);content:\"\"}[aria-label][data-balloon-pos]:hover:after,[aria-label][data-balloon-pos]:hover:before{opacity:1;pointer-events:none}[aria-label][data-balloon-pos][data-balloon-pos=up]:after{margin-bottom:10px}[aria-label][data-balloon-pos][data-balloon-pos=up]:after,[aria-label][data-balloon-pos][data-balloon-pos=up]:before{bottom:100%;left:50%;-webkit-transform:translate(-50%,var(--balloon-move));transform:translate(-50%,var(--balloon-move));-webkit-transform-origin:top;transform-origin:top}[aria-label][data-balloon-pos][data-balloon-pos=up]:hover:after,[aria-label][data-balloon-pos][data-balloon-pos=up]:hover:before{-webkit-transform:translate(-50%);transform:translate(-50%)}\n/*# sourceMappingURL=data:application/json;base64,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cUIsQ0FFdkIscUNBQ0UsZ0JBQW1CLENBRXJCLCtCQUNFLGlCQUFrQixDQUNsQixjQUFpQixDQUNqQixxQ0FJRSxhQUFjLENBQ2Qsd0hBQXdJLENBQ3hJLGVBQW1CLENBQ25CLGlCQUFrQixDQUNsQixnQkFBaUIsQ0FDakIsa0NBQW1DLENBQ25DLCtCQUFnQyxDQUNoQyxpQkFBa0IsQ0FDbEIsVUFBVyxDQUNYLHdCQUF5QixDQUN6QixnQkFBa0IsQ0FFbEIsa0JBQW1CLENBQ25CLGVBQ2EsQ0FDZiwyRUFsQkUsU0FBVSxDQUNWLG1CQUFvQixDQUNwQix5Q0FBb0MsQ0FBcEMsaUNBQW9DLENBWXBDLGlCQUFrQixDQUdsQixVQVdhLENBVmYsc0NBQ0UsT0FBUSxDQUNSLFFBQVMsQ0FFVCw0QkFBc0MsQ0FBdEMseUNBQXNDLENBSXRDLFVBRWEsQ0FDZix1RkFDRSxTQUFVLENBQ1YsbUJBQXNCLENBQ3hCLDBEQUdFLGtCQUV1QixDQUN6QixxSEFMRSxXQUFZLENBQ1osUUFBUyxDQUVULHFEQUErQyxDQUEvQyw2Q0FBK0MsQ0FDL0MsNEJBQXFCLENBQXJCLG9CQUt1QixDQUd6QixpSUFDRSxpQ0FBNkIsQ0FBN0IseUJBQStCIiwiZmlsZSI6ImluZGV4LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYXJ0LXVuZGVyY292ZXIge1xuICBiYWNrZ3JvdW5kOiAjMDAwO1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgZGlzcGxheTogbm9uZTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbiAgb3BhY2l0eTogMC45O1xuICB6LWluZGV4OiAxMDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHotaW5kZXg6IDIwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvdXRsaW5lOiAwO1xuICB6b29tOiAxO1xuICBmb250LWZhbWlseTogUm9ib3RvLCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICBjb2xvcjogI2VlZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgZGlyZWN0aW9uOiBsdHI7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgbGluZS1oZWlnaHQ6IDEuMztcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTtcbiAgdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb247XG4gIC1tcy1oaWdoLWNvbnRyYXN0LWFkanVzdDogbm9uZTsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAqIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIHdpZHRoOiA1cHg7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzY2NjsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtaWNvbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBsaW5lLWhlaWdodDogMS41OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1pY29uIHN2ZyB7XG4gICAgICBmaWxsOiAjZmZmOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIGltZyB7XG4gICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7IH1cbiAgQHN1cHBvcnRzICgtd2Via2l0LWJhY2tkcm9wLWZpbHRlcjogaW5pdGlhbCkgb3IgKGJhY2tkcm9wLWZpbHRlcjogaW5pdGlhbCkge1xuICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYmFja2Ryb3AtZmlsdGVyIHtcbiAgICAgIC13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOiBzYXR1cmF0ZSgxODAlKSBibHVyKDIwcHgpO1xuICAgICAgYmFja2Ryb3AtZmlsdGVyOiBzYXR1cmF0ZSgxODAlKSBibHVyKDIwcHgpO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjcpICFpbXBvcnRhbnQ7IH0gfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXZpZGVvIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAxMDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuICBjdXJzb3I6IHBvaW50ZXI7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1wb3N0ZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDExO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXN1YnRpdGxlIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAyMDtcbiAgYm90dG9tOiAxMHB4O1xuICB3aWR0aDogMTAwJTtcbiAgcGFkZGluZzogMCAyMHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiAjZmZmO1xuICBmb250LXNpemU6IDIwcHg7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB0ZXh0LXNoYWRvdzogMC41cHggMC41cHggMC41cHggcmdiYSgwLCAwLCAwLCAwLjUpOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtc3VidGl0bGUgcCB7XG4gICAgd29yZC1icmVhazogYnJlYWstYWxsO1xuICAgIGhlaWdodDogZml0LWNvbnRlbnQ7XG4gICAgbWFyZ2luOiA1cHggMCAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjI7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1iaWxpbmd1YWwgcDpudGgtY2hpbGQobiArIDIpIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXIgdG9wOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyLmFydC1zdWJ0aXRsZS1zaG93IC5hcnQtc3VidGl0bGUge1xuICBkaXNwbGF5OiBibG9jazsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtY29udHJvbC1zaG93IC5hcnQtc3VidGl0bGUge1xuICBib3R0b206IDUwcHg7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1kYW5tdWt1IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAzMDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWxheWVycyB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogNDA7XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1sYXllcnMgLmFydC1sYXllciB7XG4gICAgcG9pbnRlci1ldmVudHM6IGF1dG87IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LWxheWVyLXNob3cgLmFydC1sYXllcnMge1xuICBkaXNwbGF5OiBibG9jazsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LW1hc2sge1xuICBkaXNwbGF5OiBub25lO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiA1MDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LW1hc2sgLmFydC1zdGF0ZSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICByaWdodDogMzBweDtcbiAgICBib3R0b206IDU1cHg7XG4gICAgd2lkdGg6IDYwcHg7XG4gICAgaGVpZ2h0OiA2MHB4O1xuICAgIG9wYWNpdHk6IDAuNjsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtbWFzay1zaG93IC5hcnQtbWFzayB7XG4gIGRpc3BsYXk6IGZsZXg7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1sb2FkaW5nIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiA3MDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LWxvYWRpbmctc2hvdyAuYXJ0LWxvYWRpbmcge1xuICBkaXNwbGF5OiBmbGV4OyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiA2MDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgaGVpZ2h0OiAxMDBweDtcbiAgcGFkZGluZzogNTVweCAxMHB4IDA7XG4gIG9wYWNpdHk6IDA7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZS1pbi1vdXQ7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBiYWNrZ3JvdW5kOiB1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQURHQ0FZQUFBQVQrT3FGQUFBQWRrbEVRVlFvejQyUVFRN0FJQWdFRi9UL0Qra2JxL1JXQWxuUXl5YXpBNGFvQUI0RnNCU0EvYkZqdUYxRU9MN1ZicklyQnV1c21ydDRaWk9SZmI2ZWhiV2RuUkhFSWlJVGFFVUthNUVKcVVha1JTYUVZQkpTQ1kyZEVzdFFZN0F1eGFod1hGcnZabVdsMnJoNEpaMDd6OWRMdGVzZk5qNXEwRlUzQTVPYmJ3QUFBQUJKUlU1RXJrSmdnZz09KSByZXBlYXQteCBib3R0b207IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3Mge1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgaGVpZ2h0OiA0cHg7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcy1pbm5lciB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgaGVpZ2h0OiA1MCU7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7IH1cbiAgICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzLWlubmVyIC5hcnQtcHJvZ3Jlc3MtbG9hZGVkIHtcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgei1pbmRleDogMTA7XG4gICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICB0b3A6IDA7XG4gICAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICB3aWR0aDogMDtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNCk7IH1cbiAgICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzLWlubmVyIC5hcnQtcHJvZ3Jlc3MtcGxheWVkIHtcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgei1pbmRleDogMjA7XG4gICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICB0b3A6IDA7XG4gICAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICB3aWR0aDogMDsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MtaW5uZXIgLmFydC1wcm9ncmVzcy1oaWdobGlnaHQge1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICB6LWluZGV4OiAzMDtcbiAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICByaWdodDogMDtcbiAgICAgICAgICBib3R0b206IDA7XG4gICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lOyB9XG4gICAgICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzLWlubmVyIC5hcnQtcHJvZ3Jlc3MtaGlnaGxpZ2h0IHNwYW4ge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICAgIHdpZHRoOiA3cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87IH1cbiAgICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzLWlubmVyIC5hcnQtcHJvZ3Jlc3MtaW5kaWNhdG9yIHtcbiAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICB6LWluZGV4OiA0MDtcbiAgICAgICAgICB0b3A6IC01cHg7XG4gICAgICAgICAgbGVmdDogLTYuNXB4O1xuICAgICAgICAgIHdpZHRoOiAxM3B4O1xuICAgICAgICAgIGhlaWdodDogMTNweDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7IH1cbiAgICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MtaW5uZXIgLmFydC1wcm9ncmVzcy1pbmRpY2F0b3IuYXJ0LXNob3ctaW5kaWNhdG9yIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrOyB9XG4gICAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcy1pbm5lciAuYXJ0LXByb2dyZXNzLXRpcCB7XG4gICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgei1pbmRleDogNTA7XG4gICAgICAgICAgdG9wOiAtMjVweDtcbiAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgIGhlaWdodDogMjBweDtcbiAgICAgICAgICBwYWRkaW5nOiAwIDVweDtcbiAgICAgICAgICBsaW5lLWhlaWdodDogMjBweDtcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC43KTtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3M6aG92ZXIgLmFydC1jb250cm9sLXByb2dyZXNzLWlubmVyIHtcbiAgICAgICAgaGVpZ2h0OiAxMDAlOyB9XG4gICAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzOmhvdmVyIC5hcnQtY29udHJvbC1wcm9ncmVzcy1pbm5lciAuYXJ0LXByb2dyZXNzLWluZGljYXRvcixcbiAgICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3M6aG92ZXIgLmFydC1jb250cm9sLXByb2dyZXNzLWlubmVyIC5hcnQtcHJvZ3Jlc3MtdGlwIHtcbiAgICAgICAgICBkaXNwbGF5OiBibG9jazsgfVxuICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXRodW1ibmFpbHMge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGJvdHRvbTogOHB4O1xuICAgICAgbGVmdDogMDtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjcpOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtbG9vcCB7XG4gICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBsZWZ0OiAwO1xuICAgICAgdG9wOiAwO1xuICAgICAgcmlnaHQ6IDA7XG4gICAgICBib3R0b206IDA7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtbG9vcCAuYXJ0LWxvb3AtcG9pbnQge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGxlZnQ6IDA7XG4gICAgICAgIHRvcDogLTJweDtcbiAgICAgICAgd2lkdGg6IDJweDtcbiAgICAgICAgaGVpZ2h0OiA4cHg7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43NSk7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIHBhZGRpbmc6IDVweCAwOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2xzLWxlZnQsXG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2xzLXJpZ2h0IHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbCB7XG4gICAgICBvcGFjaXR5OiAwLjk7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICBoZWlnaHQ6IDM2cHg7XG4gICAgICBtaW4td2lkdGg6IDM2cHg7XG4gICAgICBsaW5lLWhlaWdodDogMzZweDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMgLmFydC1jb250cm9sIC5hcnQtaWNvbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBmbG9hdDogbGVmdDtcbiAgICAgICAgaGVpZ2h0OiAzNnB4O1xuICAgICAgICB3aWR0aDogMzZweDsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2w6aG92ZXIge1xuICAgICAgICBvcGFjaXR5OiAxOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtb25seVRleHQge1xuICAgICAgcGFkZGluZzogMCAxMHB4OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtdm9sdW1lIC5hcnQtdm9sdW1lLXBhbmVsIHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIGZsb2F0OiBsZWZ0O1xuICAgICAgd2lkdGg6IDA7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICB0cmFuc2l0aW9uOiBtYXJnaW4gMC4ycyBjdWJpYy1iZXppZXIoMC40LCAwLCAxLCAxKSwgd2lkdGggMC4ycyBjdWJpYy1iZXppZXIoMC40LCAwLCAxLCAxKTtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMgLmFydC1jb250cm9sLXZvbHVtZSAuYXJ0LXZvbHVtZS1wYW5lbCAuYXJ0LXZvbHVtZS1zbGlkZXItaGFuZGxlIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDUwJTtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgICAgd2lkdGg6IDEycHg7XG4gICAgICAgIGhlaWdodDogMTJweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgbWFyZ2luLXRvcDogLTZweDtcbiAgICAgICAgYmFja2dyb3VuZDogI2ZmZjsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC12b2x1bWUgLmFydC12b2x1bWUtcGFuZWwgLmFydC12b2x1bWUtc2xpZGVyLWhhbmRsZTo6YmVmb3JlIHtcbiAgICAgICAgICBsZWZ0OiAtNTRweDtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmOyB9XG4gICAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMgLmFydC1jb250cm9sLXZvbHVtZSAuYXJ0LXZvbHVtZS1wYW5lbCAuYXJ0LXZvbHVtZS1zbGlkZXItaGFuZGxlOjphZnRlciB7XG4gICAgICAgICAgbGVmdDogNnB4O1xuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKTsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC12b2x1bWUgLmFydC12b2x1bWUtcGFuZWwgLmFydC12b2x1bWUtc2xpZGVyLWhhbmRsZTo6YmVmb3JlLCAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC12b2x1bWUgLmFydC12b2x1bWUtcGFuZWwgLmFydC12b2x1bWUtc2xpZGVyLWhhbmRsZTo6YWZ0ZXIge1xuICAgICAgICAgIGNvbnRlbnQ6ICcnO1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICB0b3A6IDUwJTtcbiAgICAgICAgICBoZWlnaHQ6IDNweDtcbiAgICAgICAgICBtYXJnaW4tdG9wOiAtMnB4O1xuICAgICAgICAgIHdpZHRoOiA2MHB4OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtdm9sdW1lOmhvdmVyIC5hcnQtdm9sdW1lLXBhbmVsIHtcbiAgICAgIHdpZHRoOiA2MHB4OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtcXVhbGl0eSB7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICB6LWluZGV4OiAzMDsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtcXVhbGl0eSAuYXJ0LXF1YWxpdHlzIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBib3R0b206IDM1cHg7XG4gICAgICAgIHdpZHRoOiAxMDBweDtcbiAgICAgICAgcGFkZGluZzogNXB4IDA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC44KTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4OyB9XG4gICAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMgLmFydC1jb250cm9sLXF1YWxpdHkgLmFydC1xdWFsaXR5cyAuYXJ0LXF1YWxpdHktaXRlbSB7XG4gICAgICAgICAgaGVpZ2h0OiAzMHB4O1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAzMHB4O1xuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICB0ZXh0LXNoYWRvdzogMCAwIDJweCByZ2JhKDAsIDAsIDAsIDAuNSk7IH1cbiAgICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC1xdWFsaXR5IC5hcnQtcXVhbGl0eXMgLmFydC1xdWFsaXR5LWl0ZW06aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpOyB9XG4gICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC1xdWFsaXR5OmhvdmVyIC5hcnQtcXVhbGl0eXMge1xuICAgICAgICBkaXNwbGF5OiBibG9jazsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtY29udHJvbC1zaG93IC5hcnQtYm90dG9tLCAuYXJ0LXZpZGVvLXBsYXllci5hcnQtaG92ZXIgLmFydC1ib3R0b20ge1xuICBvcGFjaXR5OiAxO1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyLmFydC1lcnJvciAuYXJ0LXByb2dyZXNzLWluZGljYXRvcixcbi5hcnQtdmlkZW8tcGxheWVyLmFydC1lcnJvciAuYXJ0LXByb2dyZXNzLXRpcCwgLmFydC12aWRlby1wbGF5ZXIuYXJ0LWRlc3Ryb3kgLmFydC1wcm9ncmVzcy1pbmRpY2F0b3IsXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtZGVzdHJveSAuYXJ0LXByb2dyZXNzLXRpcCB7XG4gIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LW5vdGljZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiA4MDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICBwYWRkaW5nOiAxMHB4O1xuICB3aWR0aDogMTAwJTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ub3RpY2UgLmFydC1ub3RpY2UtaW5uZXIge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBwYWRkaW5nOiA1cHggMTBweDtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNik7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4OyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyLmFydC1ub3RpY2Utc2hvdyAuYXJ0LW5vdGljZSB7XG4gIGRpc3BsYXk6IGZsZXg7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250ZXh0bWVudXMge1xuICBkaXNwbGF5OiBub25lO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDEyMDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICBtaW4td2lkdGg6IDIwMHB4O1xuICBwYWRkaW5nOiA1cHggMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjkpO1xuICBib3JkZXItcmFkaXVzOiAzcHg7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250ZXh0bWVudXMgLmFydC1jb250ZXh0bWVudSB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBwYWRkaW5nOiAxMHB4IDE1cHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIHRleHQtc2hhZG93OiAwIDAgMnB4IHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250ZXh0bWVudXMgLmFydC1jb250ZXh0bWVudSBhIHtcbiAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250ZXh0bWVudXMgLmFydC1jb250ZXh0bWVudSBzcGFuIHtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIHBhZGRpbmc6IDAgN3B4OyB9XG4gICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRleHRtZW51cyAuYXJ0LWNvbnRleHRtZW51IHNwYW46aG92ZXIsIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtY29udGV4dG1lbnVzIC5hcnQtY29udGV4dG1lbnUgc3Bhbi5hcnQtY3VycmVudCB7XG4gICAgICAgIGNvbG9yOiAjMDBjOWZmOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250ZXh0bWVudXMgLmFydC1jb250ZXh0bWVudTpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRleHRtZW51cyAuYXJ0LWNvbnRleHRtZW51Omxhc3QtY2hpbGQge1xuICAgICAgYm9yZGVyLWJvdHRvbTogbm9uZTsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtY29udGV4dG1lbnUtc2hvdyAuYXJ0LWNvbnRleHRtZW51cyB7XG4gIGRpc3BsYXk6IGZsZXg7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1zZXR0aW5ncyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDkwO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG4gIG9wYWNpdHk6IDA7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1zZXR0aW5ncyAuYXJ0LXNldHRpbmctaW5uZXIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IC0zMDBweDtcbiAgICBib3R0b206IDA7XG4gICAgd2lkdGg6IDMwMHB4O1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjkpO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UtaW4tb3V0O1xuICAgIG92ZXJmbG93OiBhdXRvOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1zZXR0aW5ncyAuYXJ0LXNldHRpbmctaW5uZXIgLmFydC1zZXR0aW5nLWJvZHkge1xuICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlOyB9XG4gICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1pbm5lciAuYXJ0LXNldHRpbmctYm9keSAuYXJ0LXNldHRpbmcge1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xuICAgICAgICBwYWRkaW5nOiAxMHB4IDE1cHg7IH1cbiAgICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1zZXR0aW5ncyAuYXJ0LXNldHRpbmctaW5uZXIgLmFydC1zZXR0aW5nLWJvZHkgLmFydC1zZXR0aW5nIC5hcnQtc2V0dGluZy1oZWFkZXIge1xuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDVweDsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1yYWRpbyB7XG4gICAgZGlzcGxheTogZmxleDsgfVxuICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtc2V0dGluZ3MgLmFydC1zZXR0aW5nLXJhZGlvIC5hcnQtcmFkaW8taXRlbSB7XG4gICAgICBmbGV4OiAxO1xuICAgICAgcGFkZGluZzogMCAycHg7IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtc2V0dGluZ3MgLmFydC1zZXR0aW5nLXJhZGlvIC5hcnQtcmFkaW8taXRlbSBidXR0b24ge1xuICAgICAgICBoZWlnaHQ6IDIycHg7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDJweDsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1yYWRpbyAuYXJ0LXJhZGlvLWl0ZW0gYnV0dG9uOmFjdGl2ZSB7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAwYTFkNjsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1zZXR0aW5ncyAuYXJ0LXNldHRpbmctcmFkaW8gLmFydC1yYWRpby1pdGVtLmN1cnJlbnQgYnV0dG9uIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAwYTFkNjsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1yYW5nZSBpbnB1dCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAzcHg7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBhcHBlYXJhbmNlOiBub25lO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1jaGVja2JveCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1zZXR0aW5ncyAuYXJ0LXNldHRpbmctY2hlY2tib3ggaW5wdXQge1xuICAgICAgaGVpZ2h0OiAxNHB4O1xuICAgICAgd2lkdGg6IDE0cHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDVweDsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy11cGxvYWQge1xuICAgIGRpc3BsYXk6IGZsZXg7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy11cGxvYWQgLmFydC11cGxvYWQtYnRuIHtcbiAgICAgIHdpZHRoOiA4MHB4O1xuICAgICAgaGVpZ2h0OiAyMnB4O1xuICAgICAgbGluZS1oZWlnaHQ6IDIycHg7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgY29sb3I6ICNmZmY7XG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7XG4gICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy11cGxvYWQgLmFydC11cGxvYWQtdmFsdWUge1xuICAgICAgZmxleDogMTtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICBoZWlnaHQ6IDIycHg7XG4gICAgICBsaW5lLWhlaWdodDogMjJweDtcbiAgICAgIHBhZGRpbmctbGVmdDogMTBweDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtc2V0dGluZy1zaG93IC5hcnQtc2V0dGluZ3Mge1xuICBvcGFjaXR5OiAxO1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICBwb2ludGVyLWV2ZW50czogYXV0bzsgfVxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtc2V0dGluZy1zaG93IC5hcnQtc2V0dGluZ3MgLmFydC1zZXR0aW5nLWlubmVyIHtcbiAgICByaWdodDogMDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWluZm8ge1xuICBkaXNwbGF5OiBub25lO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDEwcHg7XG4gIHRvcDogMTBweDtcbiAgei1pbmRleDogMTAwO1xuICB3aWR0aDogMzUwcHg7XG4gIHBhZGRpbmc6IDEwcHg7XG4gIGNvbG9yOiAjZmZmO1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtZmFtaWx5OiBOb3RvIFNhbnMgQ0pLIFNDIERlbWlMaWdodCwgUm9ib3RvLCBTZWdvZSBVSSwgVGFob21hLCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjkpOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtaW5mbyAuYXJ0LWluZm8taXRlbSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBtYXJnaW4tYm90dG9tOiA1cHg7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWluZm8gLmFydC1pbmZvLWl0ZW0gLmFydC1pbmZvLXRpdGxlIHtcbiAgICAgIHdpZHRoOiAxMDBweDtcbiAgICAgIHRleHQtYWxpZ246IHJpZ2h0OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1pbmZvIC5hcnQtaW5mby1pdGVtIC5hcnQtaW5mby1jb250ZW50IHtcbiAgICAgIGZsZXg6IDE7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgcGFkZGluZy1sZWZ0OiA1cHg7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWluZm8gLmFydC1pbmZvLWl0ZW06bGFzdC1jaGlsZCB7XG4gICAgICBtYXJnaW4tYm90dG9tOiAwOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtaW5mbyAuYXJ0LWluZm8tY2xvc2Uge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDVweDtcbiAgICByaWdodDogNXB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtaW5mby1zaG93IC5hcnQtaW5mbyB7XG4gIGRpc3BsYXk6IGZsZXg7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LWhpZGUtY3Vyc29yICoge1xuICBjdXJzb3I6IG5vbmUgIWltcG9ydGFudDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllcltkYXRhLWFzcGVjdC1yYXRpb10gdmlkZW8ge1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbiAgb2JqZWN0LWZpdDogZmlsbDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtZnVsbHNjcmVlbi13ZWIge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHotaW5kZXg6IDk5OTk7XG4gIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogMTAwJSAhaW1wb3J0YW50O1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7IH1cblxuLmFydC1mdWxsc2NyZWVuLXJvdGF0ZSB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgei1pbmRleDogOTk5OTtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBiYWNrZ3JvdW5kOiAjMDAwOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbWluaS1oZWFkZXIge1xuICBkaXNwbGF5OiBub25lO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDExMDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgaGVpZ2h0OiAzNXB4O1xuICBsaW5lLWhlaWdodDogMzVweDtcbiAgY29sb3I6ICNmZmY7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBvcGFjaXR5OiAwO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UtaW4tb3V0OyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbWluaS1oZWFkZXIgLmFydC1taW5pLXRpdGxlIHtcbiAgICBmbGV4OiAxO1xuICAgIHBhZGRpbmc6IDAgMTBweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgY3Vyc29yOiBtb3ZlOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbWluaS1oZWFkZXIgLmFydC1taW5pLWNsb3NlIHtcbiAgICB3aWR0aDogMzVweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZm9udC1zaXplOiAyMnB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtaXMtZHJhZ2dpbmcge1xuICBvcGFjaXR5OiAwLjc7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHotaW5kZXg6IDk5OTk7XG4gIHdpZHRoOiA0MDBweDtcbiAgaGVpZ2h0OiAyMjVweDtcbiAgYm94LXNoYWRvdzogMCAycHggNXB4IDAgcmdiYSgwLCAwLCAwLCAwLjE2KSwgMCAzcHggNnB4IDAgcmdiYSgwLCAwLCAwLCAwLjIpOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyLmFydC1taW5pIC5hcnQtbWluaS1oZWFkZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkuYXJ0LWhvdmVyIC5hcnQtbWluaS1oZWFkZXIge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTsgfVxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbWluaSAuYXJ0LW1hc2sgLmFydC1zdGF0ZSB7XG4gICAgcG9zaXRpb246IHN0YXRpYzsgfVxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbWluaSAuYXJ0LWNvbnRleHRtZW51LFxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbWluaSAuYXJ0LWJvdHRvbSxcbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkgLmFydC1kYW5tdSxcbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkgLmFydC1pbmZvLFxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbWluaSAuYXJ0LWxheWVycyxcbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkgLmFydC1ub3RpY2UsXG4gIC5hcnQtdmlkZW8tcGxheWVyLmFydC1taW5pIC5hcnQtc2V0dGluZyxcbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkgLmFydC1zdWJ0aXRsZSB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50OyB9XG5cbi5hcnQtYXV0by1zaXplIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IH1cblxuLmFydC12aWRlby1wbGF5ZXJbZGF0YS1mbGlwPVwiaG9yaXpvbnRhbFwiXSAuYXJ0LXZpZGVvIHtcbiAgdHJhbnNmb3JtOiBzY2FsZVgoLTEpOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyW2RhdGEtZmxpcD1cInZlcnRpY2FsXCJdIC5hcnQtdmlkZW8ge1xuICB0cmFuc2Zvcm06IHNjYWxlWSgtMSk7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250cm9sLXNlbGVjdG9yIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtY29udHJvbC1zZWxlY3RvciAuYXJ0LXNlbGVjdG9yLWxpc3Qge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGJvdHRvbTogMzVweDtcbiAgICB3aWR0aDogMTAwcHg7XG4gICAgcGFkZGluZzogNXB4IDA7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC44KTtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRyb2wtc2VsZWN0b3IgLmFydC1zZWxlY3Rvci1saXN0IC5hcnQtc2VsZWN0b3ItaXRlbSB7XG4gICAgICBoZWlnaHQ6IDMwcHg7XG4gICAgICBsaW5lLWhlaWdodDogMzBweDtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICB0ZXh0LXNoYWRvdzogMCAwIDJweCByZ2JhKDAsIDAsIDAsIDAuNSk7IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtY29udHJvbC1zZWxlY3RvciAuYXJ0LXNlbGVjdG9yLWxpc3QgLmFydC1zZWxlY3Rvci1pdGVtOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtY29udHJvbC1zZWxlY3Rvcjpob3ZlciAuYXJ0LXNlbGVjdG9yLWxpc3Qge1xuICAgIGRpc3BsYXk6IGJsb2NrOyB9XG5cbjpyb290IHtcbiAgLS1iYWxsb29uLWNvbG9yOiByZ2JhKDE2LCAxNiwgMTYsIDAuOTUpO1xuICAtLWJhbGxvb24tZm9udC1zaXplOiAxMnB4O1xuICAtLWJhbGxvb24tbW92ZTogNHB4OyB9XG5cbmJ1dHRvblthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXSB7XG4gIG92ZXJmbG93OiB2aXNpYmxlOyB9XG5cblthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgY3Vyc29yOiBwb2ludGVyOyB9XG4gIFthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXTphZnRlciB7XG4gICAgb3BhY2l0eTogMDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4xOHMgZWFzZS1vdXQgMC4xOHM7XG4gICAgdGV4dC1pbmRlbnQ6IDA7XG4gICAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCBPeHlnZW4sIFVidW50dSwgQ2FudGFyZWxsLCAnT3BlbiBTYW5zJywgJ0hlbHZldGljYSBOZXVlJywgc2Fucy1zZXJpZjtcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICB0ZXh0LXNoYWRvdzogbm9uZTtcbiAgICBmb250LXNpemU6IHZhcigtLWJhbGxvb24tZm9udC1zaXplKTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iYWxsb29uLWNvbG9yKTtcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgY29udGVudDogYXR0cihhcmlhLWxhYmVsKTtcbiAgICBwYWRkaW5nOiAwLjVlbSAxZW07XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgICB6LWluZGV4OiAxMDsgfVxuICBbYXJpYS1sYWJlbF1bZGF0YS1iYWxsb29uLXBvc106YmVmb3JlIHtcbiAgICB3aWR0aDogMDtcbiAgICBoZWlnaHQ6IDA7XG4gICAgYm9yZGVyOiA1cHggc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLXRvcC1jb2xvcjogdmFyKC0tYmFsbG9vbi1jb2xvcik7XG4gICAgb3BhY2l0eTogMDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4xOHMgZWFzZS1vdXQgMC4xOHM7XG4gICAgY29udGVudDogJyc7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHotaW5kZXg6IDEwOyB9XG4gIFthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXTpob3ZlcjpiZWZvcmUsIFthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXTpob3ZlcjphZnRlciB7XG4gICAgb3BhY2l0eTogMTtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuICBbYXJpYS1sYWJlbF1bZGF0YS1iYWxsb29uLXBvc11bZGF0YS1iYWxsb29uLXBvcz0ndXAnXTphZnRlciB7XG4gICAgYm90dG9tOiAxMDAlO1xuICAgIGxlZnQ6IDUwJTtcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIHZhcigtLWJhbGxvb24tbW92ZSkpO1xuICAgIHRyYW5zZm9ybS1vcmlnaW46IHRvcDsgfVxuICBbYXJpYS1sYWJlbF1bZGF0YS1iYWxsb29uLXBvc11bZGF0YS1iYWxsb29uLXBvcz0ndXAnXTpiZWZvcmUge1xuICAgIGJvdHRvbTogMTAwJTtcbiAgICBsZWZ0OiA1MCU7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgdmFyKC0tYmFsbG9vbi1tb3ZlKSk7XG4gICAgdHJhbnNmb3JtLW9yaWdpbjogdG9wOyB9XG4gIFthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXVtkYXRhLWJhbGxvb24tcG9zPSd1cCddOmhvdmVyOmFmdGVyIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAwKTsgfVxuICBbYXJpYS1sYWJlbF1bZGF0YS1iYWxsb29uLXBvc11bZGF0YS1iYWxsb29uLXBvcz0ndXAnXTpob3ZlcjpiZWZvcmUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDApOyB9XG4iXX0= */";
  styleInject(css_248z);

  var optionValidator = createCommonjsModule(function (module, exports) {
  !function(r,t){module.exports=t();}(commonjsGlobal,function(){function e(r){return (e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(r)}var n=Object.prototype.toString,c=function(r){if(void 0===r)return "undefined";if(null===r)return "null";var t=e(r);if("boolean"===t)return "boolean";if("string"===t)return "string";if("number"===t)return "number";if("symbol"===t)return "symbol";if("function"===t)return function(r){return "GeneratorFunction"===o(r)}(r)?"generatorfunction":"function";if(function(r){return Array.isArray?Array.isArray(r):r instanceof Array}(r))return "array";if(function(r){if(r.constructor&&"function"==typeof r.constructor.isBuffer)return r.constructor.isBuffer(r);return !1}(r))return "buffer";if(function(r){try{if("number"==typeof r.length&&"function"==typeof r.callee)return !0}catch(r){if(-1!==r.message.indexOf("callee"))return !0}return !1}(r))return "arguments";if(function(r){return r instanceof Date||"function"==typeof r.toDateString&&"function"==typeof r.getDate&&"function"==typeof r.setDate}(r))return "date";if(function(r){return r instanceof Error||"string"==typeof r.message&&r.constructor&&"number"==typeof r.constructor.stackTraceLimit}(r))return "error";if(function(r){return r instanceof RegExp||"string"==typeof r.flags&&"boolean"==typeof r.ignoreCase&&"boolean"==typeof r.multiline&&"boolean"==typeof r.global}(r))return "regexp";switch(o(r)){case"Symbol":return "symbol";case"Promise":return "promise";case"WeakMap":return "weakmap";case"WeakSet":return "weakset";case"Map":return "map";case"Set":return "set";case"Int8Array":return "int8array";case"Uint8Array":return "uint8array";case"Uint8ClampedArray":return "uint8clampedarray";case"Int16Array":return "int16array";case"Uint16Array":return "uint16array";case"Int32Array":return "int32array";case"Uint32Array":return "uint32array";case"Float32Array":return "float32array";case"Float64Array":return "float64array"}if(function(r){return "function"==typeof r.throw&&"function"==typeof r.return&&"function"==typeof r.next}(r))return "generator";switch(t=n.call(r)){case"[object Object]":return "object";case"[object Map Iterator]":return "mapiterator";case"[object Set Iterator]":return "setiterator";case"[object String Iterator]":return "stringiterator";case"[object Array Iterator]":return "arrayiterator"}return t.slice(8,-1).toLowerCase().replace(/\s/g,"")};function o(r){return r.constructor?r.constructor.name:null}function f(r,t){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:["option"];return s(r,t,e),y(r,t,e),function(a,i,u){var r=c(i),t=c(a);if("object"===r){if("object"!==t)throw new Error("[Type Error]: '".concat(u.join("."),"' require 'object' type, but got '").concat(t,"'"));Object.keys(i).forEach(function(r){var t=a[r],e=i[r],n=u.slice();n.push(r),s(t,e,n),y(t,e,n),f(t,e,n);});}if("array"===r){if("array"!==t)throw new Error("[Type Error]: '".concat(u.join("."),"' require 'array' type, but got '").concat(t,"'"));a.forEach(function(r,t){var e=a[t],n=i[t]||i[0],o=u.slice();o.push(t),s(e,n,o),y(e,n,o),f(e,n,o);});}}(r,t,e),r}function s(r,t,e){if("string"===c(t)){var n=c(r);if("?"===t[0]&&(t=t.slice(1)+"|undefined"),!(-1<t.indexOf("|")?t.split("|").map(function(r){return r.toLowerCase().trim()}).filter(Boolean).some(function(r){return n===r}):t.toLowerCase().trim()===n))throw new Error("[Type Error]: '".concat(e.join("."),"' require '").concat(t,"' type, but got '").concat(n,"'"))}}function y(r,t,e){if("function"===c(t)){var n=t(r,c(r),e);if(!0!==n){var o=c(n);throw "string"===o?new Error(n):"error"===o?n:new Error("[Validator Error]: The scheme for '".concat(e.join("."),"' validator require return true, but got '").concat(n,"'"))}}}return f.kindOf=c,f});
  });

  var Emitter = /*#__PURE__*/function () {
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

  var userAgent = window.navigator.userAgent;
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  var isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  var isWechat = /MicroMessenger/i.test(userAgent);

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
    if (isMobile) return;
    target.setAttribute('aria-label', msg);
    target.setAttribute('data-balloon-pos', pos);
  }
  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    var windowWidth = window.innerWidth || document.documentElement.clientWidth;
    var vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
    var horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
    return vertInView && horInView;
  }
  function includeFromEvent(event, target) {
    return event.composedPath && event.composedPath().indexOf(target) > -1;
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  var isNativeFunction = _isNativeFunction;

  function _isNativeReflectConstruct() {
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

  var isNativeReflectConstruct = _isNativeReflectConstruct;

  var construct = createCommonjsModule(function (module) {
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

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  var ArtPlayerError = /*#__PURE__*/function (_Error) {
    inherits(ArtPlayerError, _Error);

    var _super = _createSuper(ArtPlayerError);

    function ArtPlayerError(message, context) {
      var _this;

      classCallCheck(this, ArtPlayerError);

      _this = _super.call(this, message);

      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(assertThisInitialized(_this), context || _this.constructor);
      }

      _this.name = 'ArtPlayerError';
      return _this;
    }

    return ArtPlayerError;
  }( /*#__PURE__*/wrapNativeSuper(Error));
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
  function download(url, name) {
    var elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var arrayLikeToArray = _arrayLikeToArray;

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
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
  function escape(str) {
    return str.replace(/[&<>'"]/g, function (tag) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag;
    });
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
    isInViewport: isInViewport,
    includeFromEvent: includeFromEvent,
    ArtPlayerError: ArtPlayerError,
    errorHandle: errorHandle,
    srtToVtt: srtToVtt,
    vttToBlob: vttToBlob,
    assToVtt: assToVtt,
    getExt: getExt,
    download: download,
    def: def,
    has: has,
    proxyPropertys: proxyPropertys,
    mergeDeep: mergeDeep,
    sleep: sleep,
    debounce: debounce,
    throttle: throttle,
    clamp: clamp,
    secondToTime: secondToTime,
    escape: escape,
    userAgent: userAgent,
    isMobile: isMobile,
    isSafari: isSafari,
    isWechat: isWechat
  });

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

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var b = 'boolean';
  var s = 'string';
  var n = 'number';
  var o = 'object';
  var a = 'array';
  var f = 'function';
  var r = 'regexp';

  function validElement(value, type, paths) {
    return errorHandle(type === s || value instanceof Element, "".concat(paths.join('.'), " require '").concat(s, "' or 'Element' type"));
  }

  var component = {
    html: validElement,
    disable: "?".concat(b),
    name: "?".concat(s),
    index: "?".concat(n),
    style: "?".concat(o),
    click: "?".concat(f),
    mounted: "?".concat(f),
    tooltip: "?".concat(s),
    selector: "?".concat(a),
    onSelect: "?".concat(f)
  };
  var scheme = {
    container: validElement,
    url: s,
    poster: s,
    title: s,
    theme: s,
    lang: s,
    volume: n,
    isLive: b,
    muted: b,
    autoplay: b,
    autoSize: b,
    autoMini: b,
    loop: b,
    flip: b,
    rotate: b,
    playbackRate: b,
    aspectRatio: b,
    screenshot: b,
    setting: b,
    hotkey: b,
    pip: b,
    mutex: b,
    light: b,
    backdrop: b,
    fullscreen: b,
    fullscreenWeb: b,
    subtitleOffset: b,
    miniProgressBar: b,
    localVideo: b,
    localSubtitle: b,
    networkMonitor: b,
    plugins: [f],
    whitelist: ["".concat(s, "|").concat(f, "|").concat(r)],
    layers: [component],
    contextmenu: [component],
    controls: [_objectSpread(_objectSpread({}, component), {}, {
      position: function position(value, type, paths) {
        var position = ['top', 'left', 'right'];
        return errorHandle(position.includes(value), "".concat(paths.join('.'), " only accept ").concat(position.toString(), " as parameters"));
      }
    })],
    quality: [{
      default: "?".concat(b),
      name: s,
      url: s
    }],
    highlight: [{
      time: n,
      text: s
    }],
    thumbnails: {
      url: s,
      number: n,
      width: n,
      height: n,
      column: n
    },
    subtitle: {
      url: s,
      style: o,
      encoding: s,
      bilingual: b
    },
    moreVideoAttr: o,
    icons: o,
    customType: o
  };

  var config = {
    propertys: ['audioTracks', 'autoplay', 'buffered', 'controller', 'controls', 'crossOrigin', 'currentSrc', 'currentTime', 'defaultMuted', 'defaultPlaybackRate', 'duration', 'ended', 'error', 'loop', 'mediaGroup', 'muted', 'networkState', 'paused', 'playbackRate', 'played', 'preload', 'readyState', 'seekable', 'seeking', 'src', 'startDate', 'textTracks', 'videoTracks', 'volume'],
    methods: ['addTextTrack', 'canPlayType', 'load', 'play', 'pause'],
    events: ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting']
  };

  var Whitelist = function Whitelist(art) {
    classCallCheck(this, Whitelist);

    var kindOf = art.constructor.kindOf,
        whitelist = art.option.whitelist;
    this.state = !art.isMobile || whitelist.some(function (item) {
      switch (kindOf(item)) {
        case 'string':
          return item === '*' || art.userAgent.indexOf(item) > -1;

        case 'function':
          return item(art.userAgent);

        case 'regexp':
          return item.test(art.userAgent);

        default:
          return false;
      }
    });
  };

  var Template = /*#__PURE__*/function () {
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

      errorHandle(art.constructor.instances.every(function (ins) {
        return ins.template.$container !== _this.$container;
      }), 'Cannot mount multiple instances on the same dom element');

      if (art.whitelist.state) {
        this.desktop();
      } else {
        this.mobile();
      }
    }

    createClass(Template, [{
      key: "query",
      value: function query$1(className) {
        return query(className, this.$container);
      }
    }, {
      key: "desktop",
      value: function desktop() {
        var _this$art$option = this.art.option,
            theme = _this$art$option.theme,
            backdrop = _this$art$option.backdrop;
        this.$container.innerHTML = "\n          <div class=\"art-undercover\"></div>\n          <div class=\"art-video-player art-subtitle-show art-layer-show\" style=\"--theme: ".concat(theme, "\">\n            <video class=\"art-video\"></video>\n            <div class=\"art-poster\"></div>\n            <div class=\"art-subtitle\"></div>\n            <div class=\"art-danmuku\"></div>\n            <div class=\"art-layers\"></div>\n            <div class=\"art-mask\">\n              <div class=\"art-state\"></div>\n            </div>\n            <div class=\"art-bottom\">\n              <div class=\"art-progress\"></div>\n              <div class=\"art-controls\">\n                <div class=\"art-controls-left\"></div>\n                <div class=\"art-controls-right\"></div>\n              </div>\n            </div>\n            <div class=\"art-loading\"></div>\n            <div class=\"art-notice\">\n              <div class=\"art-notice-inner\"></div>\n            </div>\n            <div class=\"art-settings\">\n              <div class=\"art-setting-inner\">\n                <div class=\"art-setting-body\"></div>\n              </div>\n            </div>\n            <div class=\"art-info\">\n              <div class=\"art-info-panel\">\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Player version:</div>\n                  <div class=\"art-info-content\">3.5.29</div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video url:</div>\n                  <div class=\"art-info-content\" data-video=\"src\"></div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video volume:</div>\n                  <div class=\"art-info-content\" data-video=\"volume\"></div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video time:</div>\n                  <div class=\"art-info-content\" data-video=\"currentTime\"></div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video duration:</div>\n                  <div class=\"art-info-content\" data-video=\"duration\"></div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video resolution:</div>\n                  <div class=\"art-info-content\">\n                    <span data-video=\"videoWidth\"></span> x <span data-video=\"videoHeight\"></span>\n                  </div>\n                </div>\n              </div>\n              <div class=\"art-info-close\">[x]</div>\n            </div>\n            <div class=\"art-mini-header\">\n              <div class=\"art-mini-title\"></div>\n              <div class=\"art-mini-close\">\xD7</div>\n            </div>\n            <div class=\"art-contextmenus\"></div>\n          </div>\n        ");
        this.$undercover = this.query('.art-undercover');
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
        this.$poster = this.query('.art-poster');
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
        this.$miniHeader = this.query('.art-mini-header');
        this.$miniTitle = this.query('.art-mini-title');
        this.$miniClose = this.query('.art-mini-close');
        this.$contextmenu = this.query('.art-contextmenus');

        if (backdrop) {
          addClass(this.$settingInner, 'art-backdrop-filter');
          addClass(this.$info, 'art-backdrop-filter');
          addClass(this.$contextmenu, 'art-backdrop-filter');
        }

        if (this.art.isMobile) {
          addClass(this.$container, 'art-mobile');
        }
      }
    }, {
      key: "mobile",
      value: function mobile() {
        this.$container.innerHTML = "\n          <div class=\"art-video-player\">\n            <video class=\"art-video\"></video>\n          </div>\n        ";
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
      }
    }, {
      key: "destroy",
      value: function destroy(remove) {
        if (remove) {
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
  var Flip = "翻转";
  var Rotate = "旋转";
  var Horizontal = "水平";
  var Vertical = "垂直";
  var Reconnect = "重新连接";
  var Screenshot = "截图";
  var Default = "默认";
  var Normal = "正常";
  var Open = "打开";
  var Fullscreen = "全屏";
  var zhCn = {
  	"Video info": "统计信息",
  	Close: Close,
  	"Light Off": "关灯",
  	"Light On": "开灯",
  	"Video load failed": "加载失败",
  	Volume: Volume,
  	Play: Play,
  	Pause: Pause,
  	Rate: Rate,
  	Mute: Mute,
  	Flip: Flip,
  	Rotate: Rotate,
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
  	"PIP mode": "画中画模式",
  	"Exit PIP mode": "退出画中画模式",
  	"PIP not supported": "不支持画中画模式",
  	"Fullscreen not supported": "不支持全屏模式",
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
  var Flip$1 = "翻轉";
  var Rotate$1 = "旋轉";
  var Horizontal$1 = "水平";
  var Vertical$1 = "垂直";
  var Reconnect$1 = "重新連接";
  var Screenshot$1 = "截圖";
  var Default$1 = "默認";
  var Normal$1 = "正常";
  var Open$1 = "打開";
  var Fullscreen$1 = "全屏";
  var zhTw = {
  	"Video info": "統計訊息",
  	Close: Close$1,
  	"Light Off": "關燈",
  	"Light On": "開燈",
  	"Video load failed": "載入失敗",
  	Volume: Volume$1,
  	Play: Play$1,
  	Pause: Pause$1,
  	Rate: Rate$1,
  	Mute: Mute$1,
  	Flip: Flip$1,
  	Rotate: Rotate$1,
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
  	"PIP mode": "畫中畫模式",
  	"Exit PIP mode": "退出畫中畫模式",
  	"PIP not supported": "不支持畫中畫模式",
  	"Fullscreen not supported": "不支持全屏模式",
  	"Local Subtitle": "本地字幕",
  	"Local Video": "本地視頻",
  	"Subtitle offset time": "字幕偏移時間",
  	"No subtitles found": "未發現字幕"
  };

  var I18n = /*#__PURE__*/function () {
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

  function urlMix(art, player) {
    var option = art.option,
        $video = art.template.$video;
    def(player, 'url', {
      get: function get() {
        return $video.src;
      },
      set: function set(url) {
        var typeName = option.type || getExt(url);
        var typeCallback = option.customType[typeName];

        if (typeName && typeCallback) {
          sleep().then(function () {
            art.loading.show = true;
            var result = typeCallback.call(art, $video, url, art);
            def(art, typeName, {
              value: result
            });
          });
        } else {
          $video.src = url;
          art.option.url = url;
          art.emit('url', url);
        }
      }
    });
  }

  function attrInit(art, player) {
    var option = art.option,
        storage = art.storage,
        _art$template = art.template,
        $video = _art$template.$video,
        $poster = _art$template.$poster;
    Object.keys(option.moreVideoAttr).forEach(function (key) {
      $video[key] = option.moreVideoAttr[key];
    });

    if (option.muted) {
      $video.muted = option.muted;
    }

    if (option.volume) {
      $video.volume = clamp(option.volume, 0, 1);
    }

    var volume = storage.get('volume');

    if (volume) {
      $video.volume = clamp(volume, 0, 1);
    }

    if (option.poster) {
      // $video.poster = option.poster;
      setStyle($poster, 'backgroundImage', "url(".concat(option.poster, ")"));
    }

    if (option.autoplay) {
      $video.autoplay = option.autoplay;
    }

    $video.controls = false;
    player.url = option.url;
  }

  function eventInit(art, player) {
    var option = art.option,
        proxy = art.events.proxy,
        _art$template = art.template,
        $player = _art$template.$player,
        $video = _art$template.$video,
        $poster = _art$template.$poster,
        i18n = art.i18n,
        notice = art.notice;
    var reconnectTime = 0;
    var maxReconnectTime = 5;
    proxy($video, 'click', function () {
      player.toggle = true;
    });
    config.events.forEach(function (eventName) {
      proxy($video, eventName, function (event) {
        art.emit("video:".concat(event.type), event);
      });
    }); // art.on('video:abort', () => {
    // });

    art.on('video:canplay', function () {
      reconnectTime = 0;
      art.loading.show = false;
    });
    art.once('video:canplay', function () {
      art.loading.show = false;
      art.controls.show = true;
      art.mask.show = true;
      art.emit('ready');
    }); // art.on('video:canplaythrough', () => {
    // });
    // art.on('video:durationchange', () => {
    // });
    // art.on('video:emptied', () => {
    // });

    art.on('video:ended', function () {
      if (option.loop) {
        player.seek = 0;
        player.play = true;
        art.controls.show = false;
        art.mask.show = false;
      } else {
        art.controls.show = true;
        art.mask.show = true;
      }
    });
    art.on('video:error', function () {
      if (reconnectTime < maxReconnectTime) {
        sleep(1000).then(function () {
          reconnectTime += 1;
          player.url = option.url;
          notice.show = "".concat(i18n.get('Reconnect'), ": ").concat(reconnectTime);
        });
      } else {
        art.loading.show = false;
        art.controls.show = false;
        addClass($player, 'art-error');
        sleep(1000).then(function () {
          notice.show = i18n.get('Video load failed');
          art.destroy(false);
        });
      }
    }); // art.on('video:loadeddata', () => {
    // });

    art.once('video:loadedmetadata', function () {
      player.autoSize = option.autoSize;

      if (art.isMobile) {
        art.loading.show = false;
        art.controls.show = true;
        art.mask.show = true;
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
      setStyle($poster, 'display', 'none');
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

  function exclusiveInit(art, player) {
    var sizeProps = ['mini', 'pip', 'fullscreen', 'fullscreenWeb', 'fullscreenRotate'];

    function exclusive(props) {
      props.forEach(function (name) {
        art.on(name, function () {
          if (player[name]) {
            props.filter(function (item) {
              return item !== name;
            }).forEach(function (item) {
              if (player[item]) {
                player[item] = false;
              }
            });
          }
        });
      });
    }

    exclusive(sizeProps);
    def(player, 'normalSize', {
      get: function get() {
        return sizeProps.every(function (name) {
          return !player[name];
        });
      }
    });
  }

  function playMix(art, player) {
    var i18n = art.i18n,
        notice = art.notice,
        instances = art.constructor.instances,
        mutex = art.option.mutex,
        $video = art.template.$video;
    def(player, 'play', {
      set: function set(value) {
        if (value) {
          var promise = $video.play();

          if (promise.then) {
            promise.then().catch(function (err) {
              notice.show = err;
              throw err;
            });
          }

          if (mutex) {
            instances.filter(function (item) {
              return item !== art;
            }).forEach(function (item) {
              item.player.pause = true;
            });
          }

          notice.show = i18n.get('Play');
          art.emit('play');
        } else {
          player.pause = true;
        }
      }
    });
  }

  function pauseMix(art, player) {
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
          notice.show = i18n.get('Pause');
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
        art.emit('seek', player.currentTime);

        if (player.duration) {
          notice.show = "".concat(secondToTime(player.currentTime), " / ").concat(secondToTime(player.duration));
        }
      }
    });
    def(player, 'forward', {
      set: function set(time) {
        player.seek = player.currentTime + time;
      }
    });
    def(player, 'backward', {
      set: function set(time) {
        player.seek = player.currentTime - time;
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
        notice.show = "".concat(i18n.get('Volume'), ": ").concat(parseInt($video.volume * 100, 10));

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
    var $video = art.template.$video;
    def(player, 'currentTime', {
      get: function get() {
        return $video.currentTime || 0;
      },
      set: function set(time) {
        $video.currentTime = clamp(time, 0, player.duration);
      }
    });
  }

  function durationMix(art, player) {
    def(player, 'duration', {
      get: function get() {
        var duration = art.template.$video.duration;
        if (duration === Infinity) return 0;
        return duration || 0;
      }
    });
  }

  function switchMix(art, player) {
    var i18n = art.i18n,
        notice = art.notice;

    function switchUrl(url, name, currentTime) {
      if (url === player.url) return;
      URL.revokeObjectURL(player.url);
      var playing = player.playing;
      player.url = url;
      art.once('video:canplay', function () {
        player.playbackRate = false;
        player.aspectRatio = false;
        player.flip = 'normal';
        player.autoSize = true;
        player.currentTime = currentTime;

        if (playing) {
          player.play = true;
        }
      });

      if (name) {
        notice.show = "".concat(i18n.get('Switch video'), ": ").concat(name);
      }

      art.emit('switch', url);
    }

    def(player, 'switchQuality', {
      value: function value(url, name) {
        return switchUrl(url, name, player.currentTime);
      }
    });
    def(player, 'switchUrl', {
      value: function value(url, name) {
        return switchUrl(url, name, 0);
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
          if (rate === $player.dataset.playbackRate) return;
          var rateList = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
          errorHandle(rateList.includes(rate), "'playbackRate' only accept ".concat(rateList.toString(), " as parameters"));
          $video.playbackRate = rate;
          $player.dataset.playbackRate = rate;
          notice.show = "".concat(i18n.get('Rate'), ": ").concat(rate === 1.0 ? i18n.get('Normal') : "".concat(rate, "x"));
          art.emit('playbackRate', rate);
        } else if (player.playbackRate) {
          player.playbackRate = 1;
          delete $player.dataset.playbackRate;
          art.emit('playbackRate');
        }
      }
    });
    def(player, 'playbackRateReset', {
      set: function set(value) {
        if (value) {
          var playbackRate = $player.dataset.playbackRate;

          if (playbackRate) {
            player.playbackRate = Number(playbackRate);
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
        if (!ratio) ratio = 'default';
        var ratioList = ['default', '4:3', '16:9'];
        errorHandle(ratioList.includes(ratio), "'aspectRatio' only accept ".concat(ratioList.toString(), " as parameters"));

        if (ratio === 'default') {
          setStyle($video, 'width', null);
          setStyle($video, 'height', null);
          setStyle($video, 'padding', null);
          delete $player.dataset.aspectRatio;
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

          $player.dataset.aspectRatio = ratio;
        }

        notice.show = "".concat(i18n.get('Aspect ratio'), ": ").concat(ratio === 'default' ? i18n.get('Default') : ratio);
        art.emit('aspectRatio', ratio);
      }
    });
    def(player, 'aspectRatioReset', {
      set: function set(value) {
        if (value && player.aspectRatio) {
          var aspectRatio = player.aspectRatio;
          player.aspectRatio = aspectRatio;
        }
      }
    });
  }

  function screenshotMix(art, player) {
    var option = art.option,
        notice = art.notice,
        $video = art.template.$video;
    var $canvas = document.createElement('canvas');
    def(player, 'getDataURL', {
      value: function value() {
        return new Promise(function (resolve, reject) {
          try {
            $canvas.width = $video.videoWidth;
            $canvas.height = $video.videoHeight;
            $canvas.getContext('2d').drawImage($video, 0, 0);
            resolve($canvas.toDataURL('image/png'));
          } catch (err) {
            notice.show = err;
            reject(err);
          }
        });
      }
    });
    def(player, 'getBlobUrl', {
      value: function value() {
        return new Promise(function (resolve, reject) {
          try {
            $canvas.width = $video.videoWidth;
            $canvas.height = $video.videoHeight;
            $canvas.getContext('2d').drawImage($video, 0, 0);
            $canvas.toBlob(function (blob) {
              resolve(URL.createObjectURL(blob));
            });
          } catch (err) {
            notice.show = err;
            reject(err);
          }
        });
      }
    });
    def(player, 'screenshot', {
      value: function value() {
        player.getDataURL().then(function (dataUri) {
          download(dataUri, "".concat(option.title || 'artplayer', "_").concat(secondToTime($video.currentTime), ".png"));
          art.emit('screenshot', dataUri);
        });
      }
    });
  }

  var screenfull = createCommonjsModule(function (module) {
  /*!
  * screenfull
  * v5.0.2 - 2020-02-13
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

  				var returnPromise = element[fn.requestFullscreen]();

  				if (returnPromise instanceof Promise) {
  					returnPromise.then(onFullScreenEntered).catch(reject);
  				}
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

  				var returnPromise = document[fn.exitFullscreen]();

  				if (returnPromise instanceof Promise) {
  					returnPromise.then(onFullScreenExit).catch(reject);
  				}
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

  var nativeScreenfull = function nativeScreenfull(art, player) {
    var $player = art.template.$player;
    def(player, 'fullscreen', {
      get: function get() {
        return screenfull.isFullscreen;
      },
      set: function set(value) {
        if (value) {
          screenfull.request($player).then(function () {
            addClass($player, 'art-fullscreen');
            player.aspectRatioReset = true;
            art.emit('resize');
            art.emit('fullscreen', true);
          });
        } else {
          screenfull.exit().then(function () {
            removeClass($player, 'art-fullscreen');
            player.aspectRatioReset = true;
            player.autoSize = art.option.autoSize;
            art.emit('resize');
            art.emit('fullscreen');
          });
        }
      }
    });
  };

  var webkitScreenfull = function webkitScreenfull(art, player) {
    var $video = art.template.$video;
    def(player, 'fullscreen', {
      get: function get() {
        return $video.webkitDisplayingFullscreen;
      },
      set: function set(value) {
        if (value) {
          $video.webkitEnterFullscreen();
          art.emit('fullscreen', true);
        } else {
          $video.webkitExitFullscreen();
          art.emit('fullscreen');
        }
      }
    });
  };

  function fullscreenMix(art, player) {
    var i18n = art.i18n,
        notice = art.notice,
        $video = art.template.$video;
    art.once('ready', function () {
      if (screenfull.isEnabled) {
        nativeScreenfull(art, player);
      } else if (document.fullscreenEnabled || $video.webkitSupportsFullscreen) {
        webkitScreenfull(art, player);
      } else {
        def(player, 'fullscreen', {
          get: function get() {
            return false;
          },
          set: function set() {
            notice.show = i18n.get('Fullscreen not supported');
          }
        });
      }
    });
    def(player, 'fullscreenToggle', {
      set: function set(value) {
        if (value) {
          player.fullscreen = !player.fullscreen;
        }
      }
    });
  }

  function fullscreenWebMix(art, player) {
    var $player = art.template.$player;
    def(player, 'fullscreenWeb', {
      get: function get() {
        return hasClass($player, 'art-fullscreen-web');
      },
      set: function set(value) {
        if (value) {
          addClass($player, 'art-fullscreen-web');
          player.aspectRatioReset = true;
          art.emit('resize');
          art.emit('fullscreenWeb', true);
        } else {
          removeClass($player, 'art-fullscreen-web');
          player.aspectRatioReset = true;
          player.autoSize = art.option.autoSize;
          art.emit('resize');
          art.emit('fullscreenWeb');
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

  function fullscreenRotateMix(art, player) {
    var _art$template = art.template,
        $container = _art$template.$container,
        $player = _art$template.$player;
    def(player, 'fullscreenRotate', {
      get: function get() {
        return hasClass($container, 'art-fullscreen-rotate');
      },
      set: function set(value) {
        if (value) {
          addClass($container, 'art-fullscreen-rotate');
          player.autoSize = true;
          var _document$body = document.body,
              bodyHeight = _document$body.clientHeight,
              bodyWidth = _document$body.clientWidth;
          var playerHeight = $player.clientHeight,
              playerWidth = $player.clientWidth;
          var bodyRatio = bodyWidth / bodyHeight;
          var videoRatio = playerWidth / playerHeight;
          var needSpin = bodyRatio < videoRatio;

          if (needSpin) {
            var scale = Math.min(bodyHeight / playerWidth, bodyWidth / playerHeight).toFixed(2);
            setStyle($player, 'transform', "rotate(90deg) scale(".concat(scale, ",").concat(scale, ")"));
            art.emit('resize');
            art.emit('fullscreenRotate', true);
          }
        } else {
          removeClass($container, 'art-fullscreen-rotate');
          player.autoSize = art.option.autoSize;
          setStyle($player, 'transform', null);
          art.emit('resize');
          art.emit('fullscreenRotate');
        }
      }
    });
    def(player, 'fullscreenRotateToggle', {
      set: function set(value) {
        if (value) {
          player.fullscreenRotate = !player.fullscreenRotate;
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
          $video.requestPictureInPicture().catch(function (err) {
            notice.show = err;
            throw err;
          });
        } else {
          document.exitPictureInPicture().catch(function (err) {
            notice.show = err;
            throw err;
          });
        }
      }
    });
    proxy($video, 'enterpictureinpicture', function () {
      art.emit('pip', true);
    });
    proxy($video, 'leavepictureinpicture', function () {
      art.emit('pip');
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
          art.emit('pip', true);
        } else {
          $video.webkitSetPresentationMode('inline');
          art.emit('pip');
        }
      }
    });
  }

  function pipMix(art, player) {
    var i18n = art.i18n,
        notice = art.notice,
        $video = art.template.$video;

    if (document.pictureInPictureEnabled) {
      nativePip(art, player);
    } else if ($video.webkitSupportsPresentationMode) {
      webkitPip(art, player);
    } else {
      def(player, 'pip', {
        get: function get() {
          return false;
        },
        set: function set() {
          notice.show = i18n.get('PIP not supported');
        }
      });
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
        return player.loadedTime / $video.duration;
      }
    });
    def(player, 'loadedTime', {
      get: function get() {
        return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0;
      }
    });
  }

  function playedMix(art, player) {
    def(player, 'played', {
      get: function get() {
        return player.currentTime / player.duration;
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

          art.emit('autoSize', {
            width: player.width,
            height: player.height
          });
        } else {
          removeClass($container, 'art-auto-size');
          setStyle($player, 'width', null);
          setStyle($player, 'height', null);
          art.emit('autoSize');
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
    var $player = art.template.$player,
        i18n = art.i18n,
        notice = art.notice;
    def(player, 'flip', {
      get: function get() {
        return $player.dataset.flip;
      },
      set: function set(flip) {
        if (!flip) flip = 'normal';
        var flipList = ['normal', 'horizontal', 'vertical'];
        errorHandle(flipList.includes(flip), "'flip' only accept ".concat(flipList.toString(), " as parameters"));

        if (flip === 'normal') {
          delete $player.dataset.flip;
        } else {
          player.rotate = false;
          $player.dataset.flip = flip;
        }

        var word = flip.replace(flip[0], flip[0].toUpperCase());
        notice.show = "".concat(i18n.get('Flip'), ": ").concat(i18n.get(word));
        art.emit('flip', flip);
      }
    });
    def(player, 'flipReset', {
      set: function set(value) {
        if (value && player.flip) {
          var flip = player.flip;
          player.flip = flip;
        }
      }
    });
  }

  function lightMix(art, player) {
    var $undercover = art.template.$undercover;
    def(player, 'light', {
      get: function get() {
        return getStyle($undercover, 'display', false) !== 'none';
      },
      set: function set(value) {
        setStyle($undercover, 'display', value ? 'block' : 'none');
        art.emit('light', value);
      }
    });
  }

  function miniMix(art, player) {
    var i18n = art.i18n,
        option = art.option,
        storage = art.storage,
        proxy = art.events.proxy,
        _art$template = art.template,
        $player = _art$template.$player,
        $miniClose = _art$template.$miniClose,
        $miniTitle = _art$template.$miniTitle,
        $miniHeader = _art$template.$miniHeader;
    var cacheStyle = '';
    var isDroging = false;
    var lastPageX = 0;
    var lastPageY = 0;
    var lastPlayerLeft = 0;
    var lastPlayerTop = 0;
    proxy($miniHeader, 'mousedown', function (event) {
      isDroging = true;
      lastPageX = event.pageX;
      lastPageY = event.pageY;
      lastPlayerLeft = player.left;
      lastPlayerTop = player.top;
    });
    proxy(document, 'mousemove', function (event) {
      if (isDroging) {
        addClass($player, 'art-is-dragging');
        var top = lastPlayerTop + event.pageY - lastPageY;
        var left = lastPlayerLeft + event.pageX - lastPageX;
        setStyle($player, 'top', "".concat(top, "px"));
        setStyle($player, 'left', "".concat(left, "px"));
        storage.set('top', top);
        storage.set('left', left);
      }
    });
    proxy(document, 'mouseup', function () {
      isDroging = false;
      removeClass($player, 'art-is-dragging');
    });
    proxy($miniClose, 'click', function () {
      player.mini = false;
      isDroging = false;
      removeClass($player, 'art-is-dragging');
    });
    append($miniTitle, option.title || i18n.get('Mini player'));
    def(player, 'mini', {
      get: function get() {
        return hasClass($player, 'art-mini');
      },
      set: function set(value) {
        if (value) {
          player.autoSize = false;
          cacheStyle = $player.style.cssText;
          addClass($player, 'art-mini');
          var top = storage.get('top');
          var left = storage.get('left');

          if (top && left) {
            setStyle($player, 'top', "".concat(top, "px"));
            setStyle($player, 'left', "".concat(left, "px"));

            if (!isInViewport($miniHeader)) {
              storage.del('top');
              storage.del('left');
              player.mini = true;
            }
          } else {
            var $body = document.body;

            var _top = $body.clientHeight - player.height - 50;

            var _left = $body.clientWidth - player.width - 50;

            storage.set('top', _top);
            storage.set('left', _left);
            setStyle($player, 'top', "".concat(_top, "px"));
            setStyle($player, 'left', "".concat(_left, "px"));
          }

          player.aspectRatio = false;
          player.playbackRate = false;
          art.emit('mini', true);
        } else {
          $player.style.cssText = cacheStyle;
          removeClass($player, 'art-mini');
          setStyle($player, 'top', null);
          setStyle($player, 'left', null);
          player.aspectRatio = false;
          player.playbackRate = false;
          player.autoSize = option.autoSize;
          art.emit('mini');
        }
      }
    });
    def(player, 'miniToggle', {
      set: function set(value) {
        if (value) {
          player.mini = !player.mini;
        }
      }
    });
  }

  function loopMin(art, player) {
    var interval = [];
    def(player, 'loop', {
      get: function get() {
        return interval;
      },
      set: function set(value) {
        if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
          var start = clamp(value[0], 0, Math.min(value[1], player.duration));
          var end = clamp(value[1], start, player.duration);

          if (end - start >= 1) {
            interval = [start, end];
            art.emit('loop', interval);
          } else {
            interval = [];
            art.emit('loop');
          }
        } else {
          interval = [];
          art.emit('loop');
        }
      }
    });
    art.on('video:timeupdate', function () {
      if (interval.length) {
        if (player.currentTime < interval[0] || player.currentTime > interval[1]) {
          player.seek = interval[0];
        }
      }
    });
  }

  function rotateMix(art, player) {
    var _art$template = art.template,
        $video = _art$template.$video,
        $player = _art$template.$player,
        i18n = art.i18n,
        notice = art.notice;
    def(player, 'rotate', {
      get: function get() {
        return Number($player.dataset.rotate) || 0;
      },
      set: function set(deg) {
        if (!deg) deg = 0;
        var degList = [-270, -180, -90, 0, 90, 180, 270];
        errorHandle(degList.includes(deg), "'rotate' only accept ".concat(degList.toString(), " as parameters"));

        if (deg === 0) {
          delete $player.dataset.rotate;
          setStyle($video, 'transform', null);
        } else {
          player.flip = false;
          $player.dataset.rotate = deg;

          var getScaleValue = function getScaleValue() {
            var videoWidth = $video.videoWidth,
                videoHeight = $video.videoHeight;
            return videoWidth > videoHeight ? videoHeight / videoWidth : videoWidth / videoHeight;
          };

          var degValue = 0;
          var scaleValue = 1;

          switch (deg) {
            case -270:
              degValue = 90;
              scaleValue = getScaleValue();
              break;

            case -180:
              degValue = 180;
              break;

            case -90:
              degValue = 270;
              scaleValue = getScaleValue();
              break;

            case 90:
              degValue = 90;
              scaleValue = getScaleValue();
              break;

            case 180:
              degValue = 180;
              break;

            case 270:
              degValue = 270;
              scaleValue = getScaleValue();
              break;
          }

          setStyle($video, 'transform', "rotate(".concat(degValue, "deg) scale(").concat(scaleValue, ")"));
        }

        notice.show = "".concat(i18n.get('Rotate'), ": ").concat(deg, "\xB0");
        art.emit('rotate', deg);
      }
    });
    def(player, 'rotateReset', {
      set: function set(value) {
        if (value && player.rotate) {
          var rotate = player.rotate;
          player.rotate = rotate;
        }
      }
    });
  }

  var Player = function Player(art) {
    classCallCheck(this, Player);

    urlMix(art, this);
    eventInit(art, this);
    attrInit(art, this);
    exclusiveInit(art, this);
    playMix(art, this);
    pauseMix(art, this);
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
    fullscreenRotateMix(art, this);
    pipMix(art, this);
    seekMix$1(art, this);
    playedMix(art, this);
    playingMix(art, this);
    resizeMix(art, this);
    rectMix(art, this);
    flipMix(art, this);
    lightMix(art, this);
    miniMix(art, this);
    loopMin(art, this);
    rotateMix(art, this);
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

  var Component = /*#__PURE__*/function () {
    function Component(art) {
      classCallCheck(this, Component);

      this.id = 0;
      this.art = art;
      this.add = this.add.bind(this);
    }

    createClass(Component, [{
      key: "add",
      value: function add(getOption) {
        var _this = this;

        var option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        if (!this.$parent || !this.name || option.disable) return;
        var name = option.name || "".concat(this.name).concat(this.id);
        errorHandle(!has(this, name), "Cannot add an existing name [".concat(name, "] to the [").concat(this.name, "]"));
        this.id += 1;
        var $ref = document.createElement('div');
        addClass($ref, "art-".concat(this.name));
        addClass($ref, "art-".concat(this.name, "-").concat(name));
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

        if (option.html) {
          append($ref, option.html);
        }

        if (option.style) {
          setStyles($ref, option.style);
        }

        if (option.tooltip) {
          tooltip($ref, option.tooltip);
        }

        if (option.click) {
          this.art.events.proxy($ref, 'click', function (event) {
            event.preventDefault();
            option.click.call(_this.art, _this, event);
          });
        }

        if (option.selector && ['left', 'right'].includes(option.position)) {
          this.selector(option, $ref);
        }

        if (option.mounted) {
          option.mounted.call(this.art, $ref);
        }

        if ($ref.childNodes.length === 1 && $ref.childNodes[0].nodeType === 3) {
          addClass($ref, 'art-control-onlyText');
        }
      }
    }, {
      key: "selector",
      value: function selector(option, $ref) {
        var _this2 = this;

        var _this$art$events = this.art.events,
            hover = _this$art$events.hover,
            proxy = _this$art$events.proxy;
        addClass($ref, 'art-control-selector');
        var $value = document.createElement('div');
        addClass($value, 'art-selector-value');
        append($value, option.html);
        $ref.innerText = '';
        append($ref, $value);
        var list = option.selector.map(function (item) {
          return "<div class=\"art-selector-item\">".concat(item.name, "</div>");
        }).join('');
        var $list = document.createElement('div');
        addClass($list, 'art-selector-list');
        append($list, list);
        append($ref, $list);

        var setLeft = function setLeft() {
          $list.style.left = "-".concat(getStyle($list, 'width') / 2 - getStyle($ref, 'width') / 2, "px");
        };

        hover($ref, setLeft);
        proxy($ref, 'click', function (event) {
          if (hasClass(event.target, 'art-selector-item')) {
            var name = event.target.innerText;
            if ($value.innerText === name) return;
            var find = option.selector.find(function (item) {
              return item.name === name;
            });
            $value.innerText = name;
            setLeft();

            if (find) {
              if (option.onSelect) {
                option.onSelect.call(_this2.art, find);
              }

              _this2.art.emit('selector', find);
            }
          }
        });
      }
    }, {
      key: "show",
      get: function get() {
        return hasClass(this.art.template.$player, "art-".concat(this.name, "-show"));
      },
      set: function set(value) {
        var $player = this.art.template.$player;
        var className = "art-".concat(this.name, "-show");

        if (value) {
          addClass($player, className);
        } else {
          removeClass($player, className);
        }

        this.art.emit(this.name, value);
      }
    }, {
      key: "toggle",
      set: function set(value) {
        if (value) {
          this.show = !this.show;
        }
      }
    }]);

    return Component;
  }();

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function fullscreen(option) {
    return function (art) {
      return _objectSpread$1(_objectSpread$1({}, option), {}, {
        tooltip: art.i18n.get('Fullscreen'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              player = art.player;
          append($control, icons.fullscreen);
          proxy($control, 'click', function () {
            player.fullscreenToggle = true;
          });
          art.on('fullscreen', function (value) {
            tooltip($control, i18n.get(value ? 'Exit fullscreen' : 'Fullscreen'));
          });
        }
      });
    };
  }

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function fullscreenWeb(option) {
    return function (art) {
      return _objectSpread$2(_objectSpread$2({}, option), {}, {
        tooltip: art.i18n.get('Web fullscreen'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              player = art.player;
          append($control, icons.fullscreenWeb);
          proxy($control, 'click', function () {
            player.fullscreenWebToggle = true;
          });
          art.on('fullscreenWeb', function (value) {
            tooltip($control, i18n.get(value ? 'Exit web fullscreen' : 'Web fullscreen'));
          });
        }
      });
    };
  }

  function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function pip(option) {
    return function (art) {
      return _objectSpread$3(_objectSpread$3({}, option), {}, {
        tooltip: art.i18n.get('PIP mode'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              player = art.player;
          append($control, icons.pip);
          proxy($control, 'click', function () {
            player.pipToggle = true;
          });
          art.on('pip', function (value) {
            tooltip($control, i18n.get(value ? 'Exit PIP mode' : 'PIP mode'));
          });
        }
      });
    };
  }

  function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function playAndPause(option) {
    return function (art) {
      return _objectSpread$4(_objectSpread$4({}, option), {}, {
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

  function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
      return _objectSpread$5(_objectSpread$5({}, option), {}, {
        html: "\n                <div class=\"art-control-progress-inner\">\n                    <div class=\"art-progress-loaded\"></div>\n                    <div class=\"art-progress-played\" style=\"background: ".concat(theme, "\"></div>\n                    <div class=\"art-progress-highlight\"></div>\n                    <div class=\"art-progress-indicator\" style=\"background: ").concat(theme, "\"></div>\n                    <div class=\"art-progress-tip art-tip\"></div>\n                </div>\n            "),
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

            if (includeFromEvent(event, $highlight)) {
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

  function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function subtitle(option) {
    return function (art) {
      return _objectSpread$6(_objectSpread$6({}, option), {}, {
        tooltip: art.i18n.get('Hide subtitle'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              subtitle = art.subtitle;
          append($control, icons.subtitle);
          proxy($control, 'click', function () {
            subtitle.toggle = true;
          });
          art.on('subtitle', function (value) {
            tooltip($control, i18n.get(value ? 'Hide subtitle' : 'Show subtitle'));
          });
        }
      });
    };
  }

  function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function time(option) {
    return function (art) {
      return _objectSpread$7(_objectSpread$7({}, option), {}, {
        mounted: function mounted($control) {
          function getTime() {
            var newTime = "".concat(secondToTime(art.player.currentTime), " / ").concat(secondToTime(art.player.duration));

            if (newTime !== $control.innerText) {
              $control.innerText = newTime;
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

  function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$8(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function volume(option) {
    return function (art) {
      return _objectSpread$8(_objectSpread$8({}, option), {}, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              player = art.player,
              i18n = art.i18n;
          var isDroging = false;
          var panelWidth = 60; // 音量条宽度

          var handleWidth = 12; // 音量把手宽度

          var $volume = append($control, icons.volume);
          var $volumeClose = append($control, icons.volumeClose);
          var $volumePanel = append($control, '<div class="art-volume-panel"></div>');
          var $volumeHandle = append($volumePanel, '<div class="art-volume-slider-handle"></div>');
          tooltip($volume, i18n.get('Mute'));
          setStyle($volumeClose, 'display', 'none');

          if (art.isMobile) {
            setStyle($volumePanel, 'display', 'none');
          }

          function volumeChangeFromEvent(event) {
            var _$volumePanel$getBoun = $volumePanel.getBoundingClientRect(),
                panelLeft = _$volumePanel$getBoun.left;

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
          proxy($control, 'mousemove', function (event) {
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

  function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$9(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function setting(option) {
    return function (art) {
      return _objectSpread$9(_objectSpread$9({}, option), {}, {
        tooltip: art.i18n.get('Show setting'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n,
              setting = art.setting;
          append($control, icons.setting);
          proxy($control, 'click', function () {
            setting.toggle = true;
          });
          art.on('setting', function (value) {
            tooltip($control, i18n.get(value ? 'Hide setting' : 'Show setting'));
          });
        }
      });
    };
  }

  function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$a(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$a(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function thumbnails(option) {
    return function (art) {
      return _objectSpread$a(_objectSpread$a({}, option), {}, {
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

  function ownKeys$b(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$b(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$b(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function screenshot(option) {
    return function (art) {
      return _objectSpread$b(_objectSpread$b({}, option), {}, {
        tooltip: art.i18n.get('Screenshot'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              player = art.player;
          append($control, icons.screenshot);
          proxy($control, 'click', function () {
            player.screenshot();
          });
        }
      });
    };
  }

  function ownKeys$c(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$c(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$c(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function quality(option) {
    return function (art) {
      var qualityOption = art.option.quality;
      var qualityDefault = qualityOption.find(function (item) {
        return item.default;
      }) || qualityOption[0];
      return _objectSpread$c(_objectSpread$c({}, option), {}, {
        html: qualityDefault ? qualityDefault.name : '',
        selector: qualityOption,
        onSelect: function onSelect(item) {
          art.player.switchQuality(item.url, item.name);
        }
      });
    };
  }

  function ownKeys$d(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$d(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$d(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$d(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function loop(option) {
    return function (art) {
      return _objectSpread$d(_objectSpread$d({}, option), {}, {
        mounted: function mounted($control) {
          var player = art.player;
          var $left = append($control, "<span class=\"art-loop-point\"></span>");
          var $right = append($control, "<span class=\"art-loop-point\"></span>");
          art.on('loop', function (value) {
            if (value) {
              setStyle($control, 'display', 'block');
              setStyle($left, 'left', "calc(".concat(value[0] / player.duration * 100, "% - ").concat($left.clientWidth, "px)"));
              setStyle($right, 'left', "".concat(value[1] / player.duration * 100, "%"));
            } else {
              setStyle($control, 'display', 'none');
            }
          });
        }
      });
    };
  }

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  var Control = /*#__PURE__*/function (_Component) {
    inherits(Control, _Component);

    var _super = _createSuper$1(Control);

    function Control(art) {
      var _this;

      classCallCheck(this, Control);

      _this = _super.call(this, art);
      _this.name = 'control';
      var option = art.option,
          player = art.player,
          $player = art.template.$player;
      _this.mouseMoveTime = Date.now();
      art.on('mousemove', function () {
        _this.show = true;
        removeClass($player, 'art-hide-cursor');
        addClass($player, 'art-hover');
        _this.mouseMoveTime = Date.now();
      });
      art.on('video:timeupdate', function () {
        if (player.playing && _this.show && Date.now() - _this.mouseMoveTime >= 3000) {
          _this.show = false;
          addClass($player, 'art-hide-cursor');
          removeClass($player, 'art-hover');
        }
      });
      art.once('ready', function () {
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

        _this.add(loop({
          name: 'loop',
          disable: false,
          position: 'top',
          index: 30
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
      value: function add(getOption) {
        var option = typeof getOption === 'function' ? getOption(this.art) : getOption;
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

          default:
            errorHandle(false, "Control option.position must one of 'top', 'left', 'right'");
            break;
        }

        get(getPrototypeOf(Control.prototype), "add", this).call(this, option);
      }
    }]);

    return Control;
  }(Component);

  function ownKeys$e(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$e(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$e(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$e(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function playbackRate(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$e(_objectSpread$e({}, option), {}, {
        html: "".concat(i18n.get('Play speed'), ":\n                <span data-rate=\"0.5\">0.5</span>\n                <span data-rate=\"0.75\">0.75</span>\n                <span data-rate=\"1.0\" class=\"art-current\">").concat(i18n.get('Normal'), "</span>\n                <span data-rate=\"1.25\">1.25</span>\n                <span data-rate=\"1.5\">1.5</span>\n                <span data-rate=\"2.0\">2.0</span>\n            "),
        click: function click(contextmenu, event) {
          var rate = event.target.dataset.rate;

          if (rate) {
            player.playbackRate = Number(rate);
            contextmenu.show = false;
          }
        },
        mounted: function mounted($menu) {
          art.on('playbackRate', function (rate) {
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

  function ownKeys$f(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$f(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$f(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$f(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function aspectRatio(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$f(_objectSpread$f({}, option), {}, {
        html: "".concat(i18n.get('Aspect ratio'), ":\n                <span data-ratio=\"default\" class=\"art-current\">").concat(i18n.get('Default'), "</span>\n                <span data-ratio=\"4:3\">4:3</span>\n                <span data-ratio=\"16:9\">16:9</span>\n            "),
        click: function click(contextmenu, event) {
          var ratio = event.target.dataset.ratio;

          if (ratio) {
            player.aspectRatio = ratio;
            contextmenu.show = false;
          }
        },
        mounted: function mounted($menu) {
          art.on('aspectRatio', function (ratio) {
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

  function ownKeys$g(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$g(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$g(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$g(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function info(option) {
    return function (art) {
      return _objectSpread$g(_objectSpread$g({}, option), {}, {
        html: art.i18n.get('Video info'),
        click: function click(contextmenu) {
          art.info.show = true;
          contextmenu.show = false;
        }
      });
    };
  }

  function ownKeys$h(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$h(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$h(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$h(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function version(option) {
    return _objectSpread$h(_objectSpread$h({}, option), {}, {
      html: '<a href="https://artplayer.org" target="_blank">ArtPlayer 3.5.29</a>'
    });
  }

  function ownKeys$i(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$i(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$i(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$i(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function light(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$i(_objectSpread$i({}, option), {}, {
        html: i18n.get('Light Off'),
        click: function click(contextmenu) {
          player.light = !player.light;
          contextmenu.show = false;
        },
        mounted: function mounted($menu) {
          art.on('light', function (value) {
            $menu.innerText = i18n.get(value ? 'Light On' : 'Light Off');
          });
        }
      });
    };
  }

  function ownKeys$j(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$j(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$j(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$j(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function close(option) {
    return function (art) {
      return _objectSpread$j(_objectSpread$j({}, option), {}, {
        html: art.i18n.get('Close'),
        click: function click(contextmenu) {
          contextmenu.show = false;
        }
      });
    };
  }

  function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  var Contextmenu = /*#__PURE__*/function (_Component) {
    inherits(Contextmenu, _Component);

    var _super = _createSuper$2(Contextmenu);

    function Contextmenu(art) {
      var _this;

      classCallCheck(this, Contextmenu);

      _this = _super.call(this, art);
      _this.name = 'contextmenu';
      var option = art.option,
          _art$template = art.template,
          $player = _art$template.$player,
          $contextmenu = _art$template.$contextmenu,
          proxy = art.events.proxy;
      _this.$parent = $contextmenu;
      art.once('ready', function () {
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

        _this.add(light({
          disable: !option.light,
          name: 'light',
          index: 50
        }));

        _this.add(close({
          disable: false,
          name: 'close',
          index: 60
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

          setStyles($contextmenu, {
            top: "".concat(menuTop, "px"),
            left: "".concat(menuLeft, "px")
          });
        });
        proxy($player, 'click', function (event) {
          if (!includeFromEvent(event, $contextmenu)) {
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

  function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  var Info = /*#__PURE__*/function (_Component) {
    inherits(Info, _Component);

    var _super = _createSuper$3(Info);

    function Info(art) {
      var _this;

      classCallCheck(this, Info);

      _this = _super.call(this, art);
      _this.name = 'info';
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
          item.innerText = typeof value === 'number' ? value.toFixed(2) : value;
        });
        timer = setTimeout(function () {
          loop();
        }, 1000);
      }

      art.on('info', function (value) {
        clearTimeout(timer);

        if (value) {
          loop();
        }
      });
      return _this;
    }

    return Info;
  }(Component);

  function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  var Subtitle = /*#__PURE__*/function (_Component) {
    inherits(Subtitle, _Component);

    var _super = _createSuper$4(Subtitle);

    function Subtitle(art) {
      var _this;

      classCallCheck(this, Subtitle);

      _this = _super.call(this, art);
      _this.name = 'subtitle';
      var subtitle = art.option.subtitle,
          $subtitle = art.template.$subtitle;
      setStyles($subtitle, subtitle.style);

      if (subtitle.url) {
        _this.init(subtitle.url);
      }

      if (subtitle.bilingual) {
        addClass($subtitle, 'art-bilingual');
      }

      return _this;
    }

    createClass(Subtitle, [{
      key: "style",
      value: function style(key, value) {
        var $subtitle = this.art.template.$subtitle;

        if (_typeof_1(key) === 'object') {
          return setStyles($subtitle, key);
        }

        return setStyle($subtitle, key, value);
      }
    }, {
      key: "update",
      value: function update() {
        var $subtitle = this.art.template.$subtitle;
        $subtitle.innerHTML = '';

        if (this.activeCue) {
          $subtitle.innerHTML = this.activeCue.text.split(/\r?\n/).map(function (item) {
            return "<p>".concat(escape(item), "</p>");
          }).join('');
          this.art.emit('subtitleUpdate', this.activeCue.text);
        }
      }
    }, {
      key: "switch",
      value: function _switch(url) {
        var _this2 = this;

        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var _this$art = this.art,
            i18n = _this$art.i18n,
            notice = _this$art.notice;
        return this.init(url, opt).then(function (subUrl) {
          if (opt.name) {
            notice.show = "".concat(i18n.get('Switch subtitle'), ": ").concat(opt.name);
          }

          _this2.art.emit('subtitleSwitch', subUrl);

          return subUrl;
        });
      }
    }, {
      key: "init",
      value: function init(url) {
        var _this3 = this;

        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var _this$art2 = this.art,
            notice = _this$art2.notice,
            proxy = _this$art2.events.proxy,
            subtitle = _this$art2.option.subtitle,
            _this$art2$template = _this$art2.template,
            $subtitle = _this$art2$template.$subtitle,
            $video = _this$art2$template.$video,
            $track = _this$art2$template.$track;

        if (!$track) {
          var _$track = document.createElement('track');

          _$track.default = true;
          _$track.kind = 'metadata';
          $video.appendChild(_$track);
          this.art.template.$track = _$track;
          proxy(this.textTrack, 'cuechange', this.update.bind(this));
        }

        return fetch(url).then(function (response) {
          return response.arrayBuffer();
        }).then(function (buffer) {
          var decoder = new TextDecoder(opt.encoding || subtitle.encoding);
          var text = decoder.decode(buffer);

          _this3.art.emit('subtitleLoad', url);

          switch (opt.ext || getExt(url)) {
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
          _this3.art.template.$track.src = subUrl;
          return subUrl;
        }).catch(function (err) {
          notice.show = err;
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
    }, {
      key: "bilingual",
      get: function get() {
        var $subtitle = this.art.template.$subtitle;
        return hasClass($subtitle, 'art-bilingual');
      },
      set: function set(val) {
        var $subtitle = this.art.template.$subtitle;

        if (val) {
          addClass($subtitle, 'art-bilingual');
        } else {
          removeClass($subtitle, 'art-bilingual');
        }
      }
    }]);

    return Subtitle;
  }(Component);

  function clickInit(art, events) {
    var $player = art.template.$player;
    events.proxy(document, ['click', 'contextmenu'], function (event) {
      if (includeFromEvent(event, $player)) {
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
      art.emit('hover', true);
    }, function () {
      removeClass($player, 'art-hover');
      art.emit('hover');
    });
  }

  function mousemoveInitInit(art, events) {
    var $player = art.template.$player;
    events.proxy($player, 'mousemove', function (event) {
      art.emit('mousemove', event);
    });
  }

  function resizeInit(art, events) {
    var option = art.option,
        player = art.player;
    var resizeFn = throttle(function () {
      if (player.normalSize) {
        player.autoSize = option.autoSize;
      }

      player.aspectRatioReset = true;
      art.emit('resize');
    }, 500);
    events.proxy(window, ['orientationchange', 'resize'], function () {
      resizeFn();
    });
  }

  function gestureInit(art, events) {
    if (art.isMobile && !art.option.isLive) {
      var player = art.player,
          notice = art.notice,
          $video = art.template.$video;
      var isDroging = false;
      var startX = 0;
      var currentTime = 0;
      events.proxy($video, 'touchstart', function (event) {
        if (event.touches.length === 1) {
          isDroging = true;
          startX = event.touches[0].clientX;
        }
      });
      events.proxy(document, 'touchmove', function (event) {
        if (event.touches.length === 1 && isDroging) {
          var widthDiff = event.touches[0].clientX - startX;
          var proportion = clamp(widthDiff / $video.clientWidth, -1, 1);
          currentTime = clamp(player.currentTime + 60 * proportion, 0, player.duration);
          notice.show = "".concat(secondToTime(currentTime), " / ").concat(secondToTime(player.duration));
        }
      });
      events.proxy(document, 'touchend', function () {
        if (isDroging && currentTime) {
          player.seek = currentTime;
        }

        isDroging = false;
        startX = 0;
        currentTime = 0;
      });
    }
  }

  function viewInit(art, events) {
    var player = art.player,
        autoMini = art.option.autoMini,
        $container = art.template.$container;
    var scrollFn = debounce(function () {
      art.emit('view', isInViewport($container));
    }, 200);
    events.proxy(window, 'scroll', function () {
      scrollFn();
    });
    art.on('view', function (state) {
      if (autoMini) {
        player.mini = !state;
      }
    });
  }

  var Events = /*#__PURE__*/function () {
    function Events(art) {
      var _this = this;

      classCallCheck(this, Events);

      this.destroyEvents = [];
      this.proxy = this.proxy.bind(this);
      this.hover = this.hover.bind(this);
      this.loadImg = this.loadImg.bind(this);

      if (art.whitelist.state) {
        art.once('ready', function () {
          clickInit(art, _this);
          hoverInit(art, _this);
          mousemoveInitInit(art, _this);
          resizeInit(art, _this);
          gestureInit(art, _this);
          viewInit(art, _this);
        });
      }
    }

    createClass(Events, [{
      key: "proxy",
      value: function proxy(target, name, callback) {
        var _this2 = this;

        var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        if (Array.isArray(name)) {
          return name.map(function (item) {
            return _this2.proxy(target, item, callback, option);
          });
        }

        target.addEventListener(name, callback, option);

        var destroy = function destroy() {
          return target.removeEventListener(name, callback, option);
        };

        this.destroyEvents.push(destroy);
        return destroy;
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
            return reject(new ArtPlayerError('Unable to get Image'));
          }

          if (image.complete) {
            return resolve(image);
          }

          _this3.proxy(image, 'load', function () {
            return resolve(image);
          });

          _this3.proxy(image, 'error', function () {
            return reject(new ArtPlayerError("Failed to load Image: ".concat(image.src)));
          });

          return resolve(image);
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

  var Hotkey = /*#__PURE__*/function () {
    function Hotkey(art) {
      var _this = this;

      classCallCheck(this, Hotkey);

      this.keys = {};
      var option = art.option,
          player = art.player,
          proxy = art.events.proxy;

      if (option.hotkey) {
        art.once('ready', function () {
          _this.add(27, function () {
            if (player.fullscreenWeb) {
              player.fullscreenWeb = false;
            }
          });

          _this.add(32, function () {
            player.toggle = true;
          });

          _this.add(37, function () {
            player.backward = 5;
          });

          _this.add(38, function () {
            player.volume += 0.1;
          });

          _this.add(39, function () {
            player.forward = 5;
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
                    return fn.call(art);
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

  function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  var Layer = /*#__PURE__*/function (_Component) {
    inherits(Layer, _Component);

    var _super = _createSuper$5(Layer);

    function Layer(art) {
      var _this;

      classCallCheck(this, Layer);

      _this = _super.call(this, art);
      _this.name = 'layer';
      _this.$parent = art.template.$layer;
      art.once('ready', function () {
        art.option.layers.forEach(function (item) {
          _this.add(item);
        });
      });
      return _this;
    }

    return Layer;
  }(Component);

  function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$7(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$7() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  var Loading = /*#__PURE__*/function (_Component) {
    inherits(Loading, _Component);

    var _super = _createSuper$6(Loading);

    function Loading(art) {
      var _this;

      classCallCheck(this, Loading);

      _this = _super.call(this, art);
      _this.name = 'loading';
      append(art.template.$loading, art.icons.loading);
      return _this;
    }

    return Loading;
  }(Component);

  var Notice = /*#__PURE__*/function () {
    function Notice(art) {
      classCallCheck(this, Notice);

      this.art = art;
      this.time = 2000;
      this.timer = null;
    }

    createClass(Notice, [{
      key: "show",
      set: function set(msg) {
        var _this$art$template = this.art.template,
            $player = _this$art$template.$player,
            $noticeInner = _this$art$template.$noticeInner;
        $noticeInner.innerText = msg instanceof Error ? msg.message.trim() : msg;
        addClass($player, 'art-notice-show');
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
          $noticeInner.innerText = '';
          removeClass($player, 'art-notice-show');
        }, this.time);
      }
    }]);

    return Notice;
  }();

  function _createSuper$7(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$8(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$8() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  var Mask = /*#__PURE__*/function (_Component) {
    inherits(Mask, _Component);

    var _super = _createSuper$7(Mask);

    function Mask(art) {
      var _this;

      classCallCheck(this, Mask);

      _this = _super.call(this, art);
      _this.name = 'mask';
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

  function ownKeys$k(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$k(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$k(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$k(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var Icons = function Icons(art) {
    var _this = this;

    classCallCheck(this, Icons);

    var icons = _objectSpread$k({
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
      pip: pip$1
    }, art.option.icons);

    Object.keys(icons).forEach(function (key) {
      def(_this, key, {
        get: function get() {
          var icon = document.createElement('i');
          addClass(icon, 'art-icon');
          addClass(icon, "art-icon-".concat(key));
          append(icon, icons[key]);
          return icon;
        }
      });
    });
  };

  function ownKeys$l(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$l(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$l(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$l(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function flip(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$l(_objectSpread$l({}, option), {}, {
        html: "\n                <div class=\"art-setting-header\">".concat(i18n.get('Flip'), "</div>\n                <div class=\"art-setting-radio\">\n                    <div class=\"art-radio-item current\">\n                        <button type=\"button\" data-value=\"normal\">").concat(i18n.get('Normal'), "</button>\n                    </div>\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"horizontal\">").concat(i18n.get('Horizontal'), "</button>\n                    </div>\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"vertical\">").concat(i18n.get('Vertical'), "</button>\n                    </div>\n                </div>\n            "),
        click: function click(setting, event) {
          var value = event.target.dataset.value;

          if (value) {
            player.flip = value;
          }
        },
        mounted: function mounted($setting) {
          art.on('flip', function (flip) {
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

  function ownKeys$m(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$m(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$m(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$m(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function rotate(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$m(_objectSpread$m({}, option), {}, {
        html: "\n                <div class=\"art-setting-header\">\n                    ".concat(i18n.get('Rotate'), ": <span class=\"art-rotate-value\">0\xB0</span>\n                </div>\n                <div class=\"art-setting-radio\">\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"90\">+90\xB0</button>\n                    </div>\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"-90\">-90\xB0</button>\n                    </div>\n                </div>\n            "),
        click: function click(setting, event) {
          var value = event.target.dataset.value;

          if (value) {
            var deg = player.rotate + Number(value);

            if (deg === 360 || deg === -360) {
              player.rotate = 0;
            } else {
              player.rotate = deg;
            }
          } else {
            player.rotate = 0;
          }
        },
        mounted: function mounted($setting) {
          var $value = query('.art-rotate-value', $setting);
          art.on('rotate', function (rotate) {
            $value.innerText = "".concat(rotate || 0, "\xB0");
          });
        }
      });
    };
  }

  function ownKeys$n(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$n(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$n(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$n(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function aspectRatio$1(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player;
      return _objectSpread$n(_objectSpread$n({}, option), {}, {
        html: "\n                <div class=\"art-setting-header\">".concat(i18n.get('Aspect ratio'), "</div>\n                <div class=\"art-setting-radio\">\n                    <div class=\"art-radio-item current\">\n                        <button type=\"button\" data-value=\"default\">").concat(i18n.get('Default'), "</button>\n                    </div>\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"4:3\">4:3</button>\n                    </div>\n                    <div class=\"art-radio-item\">\n                        <button type=\"button\" data-value=\"16:9\">16:9</button>\n                    </div>\n                </div>\n            "),
        click: function click(setting, event) {
          var value = event.target.dataset.value;

          if (value) {
            player.aspectRatio = value;
          }
        },
        mounted: function mounted($setting) {
          art.on('aspectRatio', function (ratio) {
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

  function ownKeys$o(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$o(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$o(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$o(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function playbackRate$1(option) {
    return function (art) {
      var i18n = art.i18n,
          player = art.player,
          proxy = art.events.proxy;
      return _objectSpread$o(_objectSpread$o({}, option), {}, {
        html: "\n                <div class=\"art-setting-header\">\n                    ".concat(i18n.get('Play speed'), ": <span class=\"art-subtitle-value\">1.0</span>x\n                </div>\n                <div class=\"art-setting-range\">\n                    <input class=\"art-subtitle-range\" value=\"1\" type=\"range\" min=\"0.5\" max=\"2\" step=\"0.25\">\n                </div>\n            "),
        mounted: function mounted($setting) {
          var $range = query('.art-setting-range input', $setting);
          var $value = query('.art-subtitle-value', $setting);
          proxy($range, 'change', function () {
            var value = $range.value;
            $value.innerText = value;
            player.playbackRate = Number(value);
          });
          art.on('playbackRate', function (rate) {
            if (rate && $range.value !== rate) {
              $range.value = rate;
              $value.innerText = rate;
            }
          });
        }
      });
    };
  }

  function _createSuper$8(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$9(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$9() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  var Setting = /*#__PURE__*/function (_Component) {
    inherits(Setting, _Component);

    var _super = _createSuper$8(Setting);

    function Setting(art) {
      var _this;

      classCallCheck(this, Setting);

      _this = _super.call(this, art);
      _this.name = 'setting';
      var option = art.option,
          _art$template = art.template,
          $setting = _art$template.$setting,
          $settingBody = _art$template.$settingBody,
          proxy = art.events.proxy;
      _this.$parent = $settingBody;

      if (option.setting) {
        art.once('ready', function () {
          proxy($setting, 'click', function (e) {
            if (e.target === $setting) {
              _this.show = false;
            }
          });

          _this.add(flip({
            disable: !option.flip,
            name: 'flip'
          }));

          _this.add(rotate({
            disable: !option.rotate,
            name: 'rotate'
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

  var Storage = /*#__PURE__*/function () {
    function Storage() {
      classCallCheck(this, Storage);

      this.name = 'artplayer_settings';
      this.settings = {};
    }

    createClass(Storage, [{
      key: "get",
      value: function get(key) {
        try {
          var storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
          return key ? storage[key] : storage;
        } catch (error) {
          return key ? this.settings[key] : this.settings;
        }
      }
    }, {
      key: "set",
      value: function set(key, value) {
        try {
          var storage = Object.assign({}, this.get(), defineProperty({}, key, value));
          window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch (error) {
          this.settings[key] = value;
        }
      }
    }, {
      key: "del",
      value: function del(key) {
        try {
          var storage = this.get();
          delete storage[key];
          window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch (error) {
          delete this.settings[key];
        }
      }
    }, {
      key: "clean",
      value: function clean() {
        try {
          window.localStorage.removeItem(this.name);
        } catch (error) {
          this.settings = {};
        }
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
      html: "\n            <div class=\"art-setting-header\">\n                ".concat(i18n.get('Subtitle offset time'), ": <span class=\"art-subtitle-value\">0</span>s\n            </div>\n            <div class=\"art-setting-range\">\n                <input class=\"art-subtitle-range\" value=\"0\" type=\"range\" min=\"-5\" max=\"5\" step=\"0.5\">\n            </div>\n        "),
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
          notice.show = "".concat(i18n.get('Subtitle offset time'), ": ").concat(value, "s");
          art.emit('subtitleOffset', value);
        } else {
          notice.show = "".concat(i18n.get('No subtitles found'));
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

    art.once('ready', function () {
      setting.add({
        title: 'Local Video',
        name: 'localVideo',
        index: 30,
        html: "\n                <div class=\"art-setting-header\">\n                    ".concat(i18n.get('Local Video'), "\n                </div>\n                <div class=\"art-setting-upload\">\n                    <div class=\"art-upload-btn\">").concat(i18n.get('Open'), "</div>\n                    <div class=\"art-upload-value\"></div>\n                </div>\n            "),
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
          subtitle.switch(URL.createObjectURL(file), {
            name: file.name,
            ext: type
          });
          art.emit('localSubtitle', file);
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

    art.once('ready', function () {
      setting.add({
        title: 'Local Subtitle',
        name: 'localSubtitle',
        index: 40,
        html: "\n                <div class=\"art-setting-header\">\n                    ".concat(i18n.get('Local Subtitle'), "\n                </div>\n                <div class=\"art-setting-upload\">\n                    <div class=\"art-upload-btn\">").concat(i18n.get('Open'), "</div>\n                    <div class=\"art-upload-value\"></div>\n                </div>\n            "),
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
        art.on('control', function (value) {
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

  var Plugins = /*#__PURE__*/function () {
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

      art.option.plugins.forEach(function (plugin) {
        _this.add(plugin);
      });
    }

    createClass(Plugins, [{
      key: "add",
      value: function add(plugin) {
        this.id += 1;
        var result = plugin.call(this, this.art);
        var pluginName = result && result.name || plugin.name || "plugin".concat(this.id);
        errorHandle(!has(this, pluginName), "Cannot add a plugin that already has the same name: ".concat(pluginName));
        def(this, pluginName, {
          value: result
        });
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
    config.events.forEach(function (eventName) {
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
      typeCallback($video, option.url, art);
      art.emit('customType', typeName);
    } else {
      $video.src = option.url;
      art.emit('url', $video.src);
    }
  };

  function _createSuper$9(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$a(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$a() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
  var id = 0;
  var instances = [];

  var Artplayer = /*#__PURE__*/function (_Emitter) {
    inherits(Artplayer, _Emitter);

    var _super = _createSuper$9(Artplayer);

    function Artplayer(option) {
      var _this;

      classCallCheck(this, Artplayer);

      _this = _super.call(this);
      _this.option = optionValidator(mergeDeep(Artplayer.option, option), scheme);
      _this.isFocus = false;
      _this.isDestroy = false;
      _this.userAgent = userAgent;
      _this.isMobile = isMobile;
      _this.isWechat = isWechat;
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
      instances.push(assertThisInitialized(_this));
      return _this;
    }

    createClass(Artplayer, [{
      key: "destroy",
      value: function destroy() {
        var removeHtml = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        this.events.destroy();
        this.template.destroy(removeHtml);
        instances.splice(instances.indexOf(this), 1);
        this.isDestroy = true;
        this.emit('destroy');
      }
    }], [{
      key: "instances",
      get: function get() {
        return instances;
      }
    }, {
      key: "version",
      get: function get() {
        return '3.5.29';
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
          autoMini: false,
          loop: false,
          flip: false,
          rotate: false,
          playbackRate: false,
          aspectRatio: false,
          screenshot: false,
          setting: false,
          hotkey: true,
          pip: false,
          mutex: true,
          light: false,
          backdrop: true,
          fullscreen: false,
          fullscreenWeb: false,
          subtitleOffset: false,
          miniProgressBar: false,
          localVideo: false,
          localSubtitle: false,
          networkMonitor: false,
          layers: [],
          contextmenu: [],
          controls: [],
          quality: [],
          highlight: [],
          plugins: [],
          whitelist: [],
          switcher: [],
          thumbnails: {
            url: '',
            number: 60,
            width: 160,
            height: 90,
            column: 10
          },
          subtitle: {
            url: '',
            style: {},
            encoding: 'utf-8',
            bilingual: false
          },
          moreVideoAttr: {
            controls: false,
            preload: isSafari ? 'auto' : 'metadata'
          },
          icons: {},
          customType: {},
          lang: navigator.language.toLowerCase()
        };
      }
    }]);

    return Artplayer;
  }(Emitter); // eslint-disable-next-line no-console
  console.log('%c ArtPlayer %c 3.5.29 %c https://artplayer.org', 'color: #fff; background: #5f5f5f', 'color: #fff; background: #4bc729', '');

  return Artplayer;

})));
//# sourceMappingURL=artplayer.js.map
