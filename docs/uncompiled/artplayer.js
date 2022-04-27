(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Artplayer = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

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
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

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
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

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

  var css_248z = ".art-video-player{zoom:1;-webkit-tap-highlight-color:rgba(0,0,0,0);-ms-high-contrast-adjust:none;background-color:#000;color:#eee;direction:ltr;display:flex;font-family:Roboto,Arial,Helvetica,sans-serif;font-size:14px;height:100%;line-height:1.3;margin:0 auto;outline:0;position:relative;text-align:left;touch-action:manipulation;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:100%;z-index:20}.art-video-player *{box-sizing:border-box;margin:0;padding:0}.art-video-player ::-webkit-scrollbar{height:5px;width:5px}.art-video-player ::-webkit-scrollbar-thumb{background-color:#666}.art-video-player ::-webkit-scrollbar-thumb:hover{background-color:#ccc}.art-video-player .art-icon{align-items:center;display:inline-flex;justify-content:center;line-height:1.5}.art-video-player .art-icon svg{fill:#fff}.art-video-player img{max-width:100%;vertical-align:top}@supports ((-webkit-backdrop-filter:initial) or (backdrop-filter:initial)){.art-video-player .art-backdrop-filter{-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px);background-color:rgba(0,0,0,.7)!important}}.art-video-player .art-video{background-color:#000;cursor:pointer;z-index:10}.art-video-player .art-poster,.art-video-player .art-video{bottom:0;height:100%;left:0;position:absolute;right:0;top:0;width:100%}.art-video-player .art-poster{background-position:50%;background-repeat:no-repeat;background-size:cover;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:11}.art-video-player .art-subtitle{bottom:10px;color:#fff;display:none;font-size:20px;padding:0 20px;pointer-events:none;position:absolute;text-align:center;text-shadow:.5px .5px .5px rgba(0,0,0,.5);width:100%;z-index:20}.art-video-player .art-subtitle p{height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;line-height:1.2;margin:5px 0 0;word-break:break-all}.art-video-player.art-subtitle-show .art-subtitle{display:block}.art-video-player.art-control-show .art-subtitle{bottom:50px}.art-video-player .art-danmuku{z-index:30}.art-video-player .art-danmuku,.art-video-player .art-layers{bottom:0;height:100%;left:0;overflow:hidden;pointer-events:none;position:absolute;right:0;top:0;width:100%}.art-video-player .art-layers{display:none;z-index:40}.art-video-player .art-layers .art-layer{pointer-events:auto}.art-video-player.art-layer-show .art-layers{display:block}.art-video-player .art-mask{align-items:center;bottom:0;display:none;height:100%;justify-content:center;left:0;overflow:hidden;pointer-events:none;position:absolute;right:0;top:0;width:100%;z-index:50}.art-video-player .art-mask .art-state{align-items:center;bottom:65px;cursor:pointer;display:flex;height:60px;justify-content:center;opacity:.85;pointer-events:all;position:absolute;right:30px;width:60px}.art-video-player.art-mask-show .art-mask{display:flex}.art-video-player.art-mobile .art-state{position:static}.art-video-player .art-loading{align-items:center;bottom:0;display:none;height:100%;justify-content:center;left:0;pointer-events:none;position:absolute;right:0;top:0;width:100%;z-index:70}.art-video-player.art-loading-show .art-loading{display:flex}.art-video-player .art-bottom{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==) repeat-x bottom;bottom:0;display:flex;flex-direction:column;height:100px;justify-content:space-between;left:0;opacity:0;padding:50px 10px 0;pointer-events:none;position:absolute;right:0;transition:all .2s ease-in-out;visibility:hidden;z-index:60}.art-video-player .art-bottom .art-progress{flex:1;pointer-events:auto;position:relative;z-index:0}.art-video-player .art-bottom .art-progress .art-control-progress{align-items:center;cursor:pointer;display:flex;flex-direction:row;height:4px;position:relative}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner{align-items:center;background:hsla(0,0%,100%,.2);display:flex;height:50%;position:relative;width:100%}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-loaded{background:hsla(0,0%,100%,.4);bottom:0;height:100%;left:0;position:absolute;right:0;top:0;width:0;z-index:10}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-played{bottom:0;height:100%;left:0;position:absolute;right:0;top:0;width:0;z-index:20}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight{bottom:0;height:100%;left:0;pointer-events:none;position:absolute;right:0;top:0;z-index:30}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight span{background:#fff;display:inline-block;height:100%;left:0;pointer-events:auto;position:absolute;top:0;width:7px}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator{align-items:center;border-radius:50%;justify-content:center;position:absolute;transform:scale(.1);transition:transform .1s ease-in-out;visibility:hidden;z-index:40}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator .art-icon{height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:100%}.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip{background:rgba(0,0,0,.7);border-radius:3px;color:#fff;display:none;font-size:12px;font-weight:700;height:20px;left:0;line-height:20px;padding:0 5px;position:absolute;text-align:center;top:-25px;white-space:nowrap;z-index:50}.art-video-player .art-bottom .art-progress .art-control-thumbnails{background-color:rgba(0,0,0,.7);bottom:8px;display:none;left:0;pointer-events:none;position:absolute}.art-video-player .art-bottom .art-progress .art-control-loop{bottom:0;display:none;height:100%;left:0;pointer-events:none;position:absolute;right:0;top:0;width:100%}.art-video-player .art-bottom .art-progress .art-control-loop .art-loop-point{background:hsla(0,0%,100%,.75);height:8px;left:0;position:absolute;top:-2px;width:2px}.art-video-player .art-bottom .art-controls{align-items:center;display:flex;height:45px;justify-content:space-between;pointer-events:auto;position:relative;z-index:1}.art-video-player .art-bottom .art-controls .art-controls-left,.art-video-player .art-bottom .art-controls .art-controls-right{display:flex}.art-video-player .art-bottom .art-controls .art-control{align-items:center;cursor:pointer;display:flex;font-size:12px;line-height:1;min-height:36px;min-width:36px;opacity:.9;text-align:center;white-space:nowrap}.art-video-player .art-bottom .art-controls .art-control .art-icon{align-items:center;display:flex;float:left;height:36px;justify-content:center;width:36px}.art-video-player .art-bottom .art-controls .art-control:hover{opacity:1}.art-video-player .art-bottom .art-controls .art-control-onlyText{padding:0 10px}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel{float:left;height:100%;overflow:hidden;position:relative;transition:margin .2s cubic-bezier(.4,0,1,1),width .2s cubic-bezier(.4,0,1,1);width:0}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle{background:#fff;border-radius:12px;height:12px;left:0;margin-top:-6px;position:absolute;top:50%;width:12px}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:before{background:#fff;left:-54px}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:after{background:hsla(0,0%,100%,.2);left:6px}.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:after,.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:before{content:\"\";display:block;height:3px;margin-top:-2px;position:absolute;top:50%;width:60px}.art-video-player .art-bottom .art-controls .art-control-volume:hover .art-volume-panel{width:60px}.art-video-player .art-bottom .art-controls .art-control-quality{position:relative;z-index:30}.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys{background:rgba(0,0,0,.8);border-radius:3px;bottom:35px;color:#fff;display:none;padding:5px 0;position:absolute;text-align:center;width:100px}.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys .art-quality-item{height:30px;line-height:30px;overflow:hidden;text-overflow:ellipsis;text-shadow:0 0 2px rgba(0,0,0,.5);white-space:nowrap}.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys .art-quality-item:hover{background-color:hsla(0,0%,100%,.1)}.art-video-player .art-bottom .art-controls .art-control-quality:hover .art-qualitys{display:block}.art-video-player .art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner{height:100%}.art-video-player .art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator{transform:scale(1);visibility:visible}.art-video-player.art-control-show .art-bottom,.art-video-player.art-hover .art-bottom{opacity:1;visibility:visible}.art-video-player.art-destroy .art-progress-indicator,.art-video-player.art-destroy .art-progress-tip,.art-video-player.art-error .art-progress-indicator,.art-video-player.art-error .art-progress-tip{display:none!important}.art-video-player.art-mobile .art-bottom{padding:50px 7px 0}.art-video-player.art-mobile .art-bottom .art-controls{height:40px}.art-video-player.art-mobile .art-bottom .art-progress-indicator{transform:scale(1)!important;visibility:visible!important}.art-video-player .art-notice{display:none;font-size:14px;left:0;padding:10px;pointer-events:none;position:absolute;top:0;width:100%;z-index:80}.art-video-player .art-notice .art-notice-inner{background-color:rgba(0,0,0,.6);border-radius:3px;color:#fff;display:inline-block;padding:5px 10px}.art-video-player.art-notice-show .art-notice{display:flex}.art-video-player .art-contextmenus{background-color:rgba(0,0,0,.9);border-radius:3px;display:none;flex-direction:column;left:10px;min-width:200px;padding:5px 0;position:absolute;top:10px;z-index:120}.art-video-player .art-contextmenus .art-contextmenu{border-bottom:1px solid hsla(0,0%,100%,.1);color:#fff;cursor:pointer;display:block;font-size:12px;overflow:hidden;padding:10px 15px;text-overflow:ellipsis;text-shadow:0 0 2px rgba(0,0,0,.5);white-space:nowrap}.art-video-player .art-contextmenus .art-contextmenu a{color:#fff;text-decoration:none}.art-video-player .art-contextmenus .art-contextmenu span{display:inline-block;padding:0 7px}.art-video-player .art-contextmenus .art-contextmenu span.art-current,.art-video-player .art-contextmenus .art-contextmenu span:hover{color:#00c9ff}.art-video-player .art-contextmenus .art-contextmenu:hover{background-color:hsla(0,0%,100%,.1)}.art-video-player .art-contextmenus .art-contextmenu:last-child{border-bottom:none}.art-video-player.art-contextmenu-show .art-contextmenus{display:flex}.art-video-player .art-settings{background-color:rgba(0,0,0,.9);border-radius:3px;bottom:50px;display:none;font-size:13px;max-height:300px;overflow:auto;position:absolute;right:10px;transition:all .2s ease;z-index:90}.art-video-player .art-settings .art-setting-panel{display:none}.art-video-player .art-settings .art-setting-panel.art-current{display:block}.art-video-player .art-settings .art-setting-panel .art-setting-item{align-items:center;color:hsla(0,0%,100%,.8);cursor:pointer;display:flex;height:35px;justify-content:space-between;line-height:1;overflow:hidden;padding:0 5px}.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current,.art-video-player .art-settings .art-setting-panel .art-setting-item:hover{background-color:hsla(0,0%,100%,.1);color:#fff}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon{align-items:center;display:flex;height:30px;justify-content:center;width:30px}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon-check{height:15px;visibility:hidden}.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current .art-icon-check{visibility:visible}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left{align-items:center;display:flex;white-space:nowrap}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left .art-setting-item-left-icon{align-items:center;display:flex;height:24px;justify-content:center;margin-right:10px;width:24px}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right{align-items:center;display:flex}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-tooltip{color:hsla(0,0%,100%,.5);font-size:12px;white-space:nowrap}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-icon{align-items:center;display:flex;height:24px;justify-content:center;width:24px}.art-video-player .art-settings .art-setting-panel .art-setting-item-back{border-bottom:1px solid hsla(0,0%,100%,.1)}.art-video-player.art-setting-show .art-settings{display:block}.art-video-player.art-mobile .art-settings{max-height:200px}.art-video-player .art-info{-webkit-font-smoothing:antialiased;background-color:rgba(0,0,0,.9);color:#fff;display:none;flex-direction:column;font-family:Noto Sans CJK SC DemiLight,Roboto,Segoe UI,Tahoma,Arial,Helvetica,sans-serif;font-size:12px;left:10px;padding:10px;position:absolute;top:10px;width:350px;z-index:100}.art-video-player .art-info .art-info-item{display:flex;margin-bottom:5px}.art-video-player .art-info .art-info-item .art-info-title{text-align:right;width:100px}.art-video-player .art-info .art-info-item .art-info-content{flex:1;overflow:hidden;padding-left:5px;text-overflow:ellipsis;white-space:nowrap}.art-video-player .art-info .art-info-item:last-child{margin-bottom:0}.art-video-player .art-info .art-info-close{cursor:pointer;position:absolute;right:5px;top:5px}.art-video-player.art-info-show .art-info{display:flex}.art-video-player.art-hide-cursor *{cursor:none!important}.art-video-player[data-aspect-ratio] video{box-sizing:content-box;-o-object-fit:fill;object-fit:fill}.art-fullscreen-rotate,.art-video-player.art-fullscreen-web{bottom:0;height:100%;left:0;position:fixed;right:0;top:0;width:100%;z-index:9999}.art-fullscreen-rotate{background-color:#000}.art-video-player .art-mini-header{align-items:center;background-color:rgba(0,0,0,.5);color:#fff;display:none;height:35px;justify-content:space-between;left:0;line-height:35px;opacity:0;position:absolute;right:0;top:0;transition:all .2s ease-in-out;visibility:hidden;z-index:110}.art-video-player .art-mini-header .art-mini-title{cursor:move;flex:1;overflow:hidden;padding:0 10px;text-overflow:ellipsis;white-space:nowrap}.art-video-player .art-mini-header .art-mini-close{cursor:pointer;font-size:22px;text-align:center;width:35px}.art-video-player.art-is-dragging{opacity:.7}.art-video-player.art-mini{box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 3px 6px 0 rgba(0,0,0,.2);height:225px;position:fixed;width:400px;z-index:9999}.art-video-player.art-mini .art-mini-header{display:flex;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.art-video-player.art-mini.art-hover .art-mini-header{opacity:1;visibility:visible}.art-video-player.art-mini .art-mask .art-state{position:static}.art-video-player.art-mini .art-bottom,.art-video-player.art-mini .art-contextmenu,.art-video-player.art-mini .art-danmu,.art-video-player.art-mini .art-info,.art-video-player.art-mini .art-layers,.art-video-player.art-mini .art-notice,.art-video-player.art-mini .art-setting,.art-video-player.art-mini .art-subtitle{display:none!important}.art-auto-size{align-items:center;display:flex;justify-content:center}.art-video-player[data-flip=horizontal] .art-video{transform:scaleX(-1)}.art-video-player[data-flip=vertical] .art-video{transform:scaleY(-1)}.art-video-player .art-layer-miniProgressBar{background-color:var(--theme);bottom:0;display:block;height:2px;left:0;position:absolute;right:0}.art-video-player .art-layer-lock{left:15px}.art-video-player .art-layer-fast-forward,.art-video-player .art-layer-lock{align-items:center;background-color:rgba(0,0,0,.5);border-radius:50%;color:#fff;display:none;height:34px;justify-content:center;position:absolute;top:calc(50% - 17px);width:34px}.art-video-player .art-layer-fast-forward{-webkit-touch-callout:none;-webkit-tap-highlight-color:rgba(0,0,0,0);right:15px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.art-video-player.art-lock .art-bottom,.art-video-player.art-lock .art-layer-fast-forward{display:none!important}.art-video-player.art-lock .art-subtitle{bottom:10px!important}.art-video-player.art-lock .art-layer-miniProgressBar{display:block!important}.art-video-player.art-control-show .art-layer-miniProgressBar{display:none}.art-video-player.art-control-show .art-layer-fast-forward,.art-video-player.art-control-show .art-layer-lock{display:flex}.art-video-player .art-control-selector{position:relative}.art-video-player .art-control-selector .art-selector-list{background-color:rgba(0,0,0,.8);border-radius:3px;bottom:35px;color:#fff;display:none;max-height:200px;max-width:200px;min-width:100px;overflow:auto;padding:5px 0;position:absolute;text-align:center}.art-video-player .art-control-selector .art-selector-list .art-selector-item{height:30px;line-height:30px;overflow:hidden;padding:0 5px;text-overflow:ellipsis;text-shadow:0 0 2px rgba(0,0,0,.5);white-space:nowrap}.art-video-player .art-control-selector .art-selector-list .art-selector-item:hover{background-color:hsla(0,0%,100%,.1)}.art-video-player .art-control-selector .art-selector-list .art-selector-item.art-current,.art-video-player .art-control-selector .art-selector-list .art-selector-item:hover{color:#00c9ff}.art-video-player .art-control-selector:hover .art-selector-list{display:block}:root{--balloon-color:hsla(0,0%,6%,.95);--balloon-font-size:12px;--balloon-move:4px}button[aria-label][data-balloon-pos]{overflow:visible}[aria-label][data-balloon-pos]{cursor:pointer;position:relative}[aria-label][data-balloon-pos]:after{background:var(--balloon-color);border-radius:2px;color:#fff;content:attr(aria-label);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:var(--balloon-font-size);font-style:normal;font-weight:400;line-height:1.2;padding:.5em 1em;text-indent:0;text-shadow:none;white-space:nowrap}[aria-label][data-balloon-pos]:after,[aria-label][data-balloon-pos]:before{opacity:0;pointer-events:none;position:absolute;transition:all .18s ease-out .18s;z-index:10}[aria-label][data-balloon-pos]:before{border:5px solid transparent;border-top:5px solid var(--balloon-color);content:\"\";height:0;width:0}[aria-label][data-balloon-pos]:hover:after,[aria-label][data-balloon-pos]:hover:before{opacity:1;pointer-events:none}[aria-label][data-balloon-pos][data-balloon-pos=up]:after{margin-bottom:10px}[aria-label][data-balloon-pos][data-balloon-pos=up]:after,[aria-label][data-balloon-pos][data-balloon-pos=up]:before{bottom:100%;left:50%;transform:translate(-50%,var(--balloon-move));transform-origin:top}[aria-label][data-balloon-pos][data-balloon-pos=up]:hover:after,[aria-label][data-balloon-pos][data-balloon-pos=up]:hover:before{transform:translate(-50%)}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0JBUUUsTUFBTyxDQVNQLHlDQUE2QyxDQUU3Qyw2QkFBOEIsQ0FSOUIscUJBQXNCLENBRHRCLFVBQVcsQ0FHWCxhQUFjLENBWmQsWUFBYSxDQVFiLDZDQUFpRCxDQUtqRCxjQUFlLENBUmYsV0FBWSxDQVNaLGVBQWdCLENBWmhCLGFBQWMsQ0FJZCxTQUFVLENBTFYsaUJBQWtCLENBVWxCLGVBQWdCLENBTWhCLHlCQUEwQixDQUYxQix3QkFBaUIsQ0FBakIscUJBQWlCLENBQWpCLG9CQUFpQixDQUFqQixnQkFBaUIsQ0FYakIsVUFBVyxDQURYLFVBZWdDLENBQ2hDLG9CQUdFLHFCQUFzQixDQUZ0QixRQUFTLENBQ1QsU0FDd0IsQ0FDMUIsc0NBRUUsVUFBVyxDQURYLFNBQ2EsQ0FDZiw0Q0FDRSxxQkFBd0IsQ0FDMUIsa0RBQ0UscUJBQXdCLENBQzFCLDRCQUdFLGtCQUFtQixDQUZuQixtQkFBb0IsQ0FDcEIsc0JBQXVCLENBRXZCLGVBQWtCLENBQ2xCLGdDQUNFLFNBQVksQ0FDaEIsc0JBQ0UsY0FBZSxDQUNmLGtCQUFxQixDQUN2QiwyRUFDRSx1Q0FDRSxpREFBa0QsQ0FDbEQseUNBQTBDLENBQzFDLHlDQUFpRCxDQUFFLENBRXpELDZCQVNFLHFCQUFzQixDQUN0QixjQUFlLENBUmYsVUFRaUIsQ0FFbkIsMkRBTkUsUUFBUyxDQUVULFdBQVksQ0FMWixNQUFPLENBRlAsaUJBQWtCLENBSWxCLE9BQVEsQ0FEUixLQUFNLENBR04sVUFrQnNCLENBYnhCLDhCQVNFLHVCQUFrQyxDQUNsQywyQkFBNEIsQ0FDNUIscUJBQXNCLENBRXRCLG1CQUFvQixDQURwQix3QkFBaUIsQ0FBakIscUJBQWlCLENBQWpCLG9CQUFpQixDQUFqQixnQkFBaUIsQ0FWakIsVUFXc0IsQ0FFeEIsZ0NBSUUsV0FBWSxDQUlaLFVBQVcsQ0FQWCxZQUFhLENBUWIsY0FBZSxDQUhmLGNBQWUsQ0FJZixtQkFBb0IsQ0FScEIsaUJBQWtCLENBS2xCLGlCQUFrQixDQUlsQix5Q0FBaUQsQ0FOakQsVUFBVyxDQUZYLFVBUW1ELENBQ25ELGtDQUVFLDBCQUFtQixDQUFuQix1QkFBbUIsQ0FBbkIsa0JBQW1CLENBRW5CLGVBQWdCLENBRGhCLGNBQWUsQ0FGZixvQkFHa0IsQ0FFdEIsa0RBQ0UsYUFBZ0IsQ0FFbEIsaURBQ0UsV0FBYyxDQUVoQiwrQkFFRSxVQVFzQixDQUV4Qiw2REFORSxRQUFTLENBRVQsV0FBWSxDQUxaLE1BQU8sQ0FNUCxlQUFnQixDQUNoQixtQkFBb0IsQ0FUcEIsaUJBQWtCLENBSWxCLE9BQVEsQ0FEUixLQUFNLENBR04sVUFnQnNCLENBWHhCLDhCQUNFLFlBQWEsQ0FFYixVQVFzQixDQUN0Qix5Q0FDRSxtQkFBc0IsQ0FFMUIsNkNBQ0UsYUFBZ0IsQ0FFbEIsNEJBRUUsa0JBQW1CLENBT25CLFFBQVMsQ0FSVCxZQUFhLENBVWIsV0FBWSxDQVJaLHNCQUF1QixDQUd2QixNQUFPLENBTVAsZUFBZ0IsQ0FDaEIsbUJBQW9CLENBVHBCLGlCQUFrQixDQUlsQixPQUFRLENBRFIsS0FBTSxDQUdOLFVBQVcsQ0FMWCxVQVFzQixDQUN0Qix1Q0FHRSxrQkFBbUIsQ0FHbkIsV0FBWSxDQUlaLGNBQWUsQ0FUZixZQUFhLENBT2IsV0FBWSxDQU5aLHNCQUF1QixDQU92QixXQUFhLENBRWIsa0JBQW1CLENBUG5CLGlCQUFrQixDQUNsQixVQUFXLENBRVgsVUFJcUIsQ0FFekIsMENBQ0UsWUFBZSxDQUVqQix3Q0FDRSxlQUFrQixDQUVwQiwrQkFVRSxrQkFBbUIsQ0FIbkIsUUFBUyxDQU5ULFlBQWEsQ0FRYixXQUFZLENBRVosc0JBQXVCLENBUHZCLE1BQU8sQ0FRUCxtQkFBb0IsQ0FWcEIsaUJBQWtCLENBSWxCLE9BQVEsQ0FEUixLQUFNLENBR04sVUFBVyxDQUxYLFVBU3NCLENBRXhCLGdEQUNFLFlBQWUsQ0FFakIsOEJBZUUsa1NBQW1TLENBUG5TLFFBQVMsQ0FQVCxZQUFhLENBQ2IscUJBQXNCLENBT3RCLFlBQWEsQ0FOYiw2QkFBOEIsQ0FHOUIsTUFBTyxDQUtQLFNBQVUsQ0FEVixtQkFBb0IsQ0FJcEIsbUJBQW9CLENBVnBCLGlCQUFrQixDQUdsQixPQUFRLENBTVIsOEJBQWdDLENBRGhDLGlCQUFrQixDQVBsQixVQVVxUyxDQUNyUyw0Q0FDRSxNQUFPLENBR1AsbUJBQW9CLENBRnBCLGlCQUFrQixDQUNsQixTQUNzQixDQUN0QixrRUFJRSxrQkFBbUIsQ0FFbkIsY0FBZSxDQUpmLFlBQWEsQ0FDYixrQkFBbUIsQ0FFbkIsVUFBVyxDQUpYLGlCQUtpQixDQUNqQiw4RkFFRSxrQkFBbUIsQ0FJbkIsNkJBQW9DLENBTHBDLFlBQWEsQ0FHYixVQUFXLENBRFgsaUJBQWtCLENBRWxCLFVBQ3NDLENBQ3RDLG1IQVNFLDZCQUFvQyxDQUhwQyxRQUFTLENBQ1QsV0FBWSxDQUpaLE1BQU8sQ0FGUCxpQkFBa0IsQ0FJbEIsT0FBUSxDQURSLEtBQU0sQ0FJTixPQUFRLENBTlIsVUFPc0MsQ0FDeEMsbUhBTUUsUUFBUyxDQUNULFdBQVksQ0FKWixNQUFPLENBRlAsaUJBQWtCLENBSWxCLE9BQVEsQ0FEUixLQUFNLENBSU4sT0FBUSxDQU5SLFVBTVUsQ0FDWixzSEFNRSxRQUFTLENBQ1QsV0FBWSxDQUpaLE1BQU8sQ0FLUCxtQkFBb0IsQ0FQcEIsaUJBQWtCLENBSWxCLE9BQVEsQ0FEUixLQUFNLENBRk4sVUFNc0IsQ0FDdEIsMkhBT0UsZUFBZ0IsQ0FOaEIsb0JBQXFCLENBS3JCLFdBQVksQ0FIWixNQUFPLENBS1AsbUJBQW9CLENBTnBCLGlCQUFrQixDQUVsQixLQUFNLENBQ04sU0FHc0IsQ0FDMUIsc0hBRUUsa0JBQW1CLENBSW5CLGlCQUFrQixDQUhsQixzQkFBdUIsQ0FDdkIsaUJBQWtCLENBR2xCLG1CQUEwQixDQUMxQixvQ0FBc0MsQ0FQdEMsaUJBQWtCLENBSWxCLFVBR3dDLENBQ3hDLGdJQUVFLFdBQVksQ0FDWixtQkFBb0IsQ0FDcEIsd0JBQWlCLENBQWpCLHFCQUFpQixDQUFqQixvQkFBaUIsQ0FBakIsZ0JBQWlCLENBSGpCLFVBR21CLENBQ3ZCLGdIQVlFLHlCQUE4QixDQUM5QixpQkFBa0IsQ0FKbEIsVUFBVyxDQVJYLFlBQWEsQ0FTYixjQUFlLENBSWYsZUFBaUIsQ0FSakIsV0FBWSxDQURaLE1BQU8sQ0FHUCxnQkFBaUIsQ0FEakIsYUFBYyxDQUxkLGlCQUFrQixDQVNsQixpQkFBa0IsQ0FQbEIsU0FBVSxDQVdWLGtCQUFtQixDQVpuQixVQVlxQixDQUMzQixvRUFNRSwrQkFBb0MsQ0FIcEMsVUFBVyxDQUZYLFlBQWEsQ0FHYixNQUFPLENBQ1AsbUJBQW9CLENBSHBCLGlCQUlzQyxDQUN4Qyw4REFRRSxRQUFTLENBUFQsWUFBYSxDQUdiLFdBQVksQ0FDWixNQUFPLENBSVAsbUJBQW9CLENBUHBCLGlCQUFrQixDQUtsQixPQUFRLENBRFIsS0FBTSxDQUhOLFVBTXNCLENBQ3RCLDhFQU1FLDhCQUFxQyxDQURyQyxVQUFXLENBSFgsTUFBTyxDQURQLGlCQUFrQixDQUVsQixRQUFTLENBQ1QsU0FFdUMsQ0FDN0MsNENBS0Usa0JBQW1CLENBRG5CLFlBQWEsQ0FHYixXQUFZLENBRFosNkJBQThCLENBSDlCLG1CQUFvQixDQUZwQixpQkFBa0IsQ0FDbEIsU0FLYyxDQUNkLCtIQUVFLFlBQWUsQ0FDakIseURBRUUsa0JBQW1CLENBT25CLGNBQWUsQ0FSZixZQUFhLENBR2IsY0FBZSxDQUdmLGFBQWMsQ0FGZCxlQUFnQixDQUNoQixjQUFlLENBSGYsVUFBWSxDQUtaLGlCQUFrQixDQUVsQixrQkFBcUIsQ0FDckIsbUVBRUUsa0JBQW1CLENBRG5CLFlBQWEsQ0FHYixVQUFXLENBQ1gsV0FBWSxDQUZaLHNCQUF1QixDQUd2QixVQUFhLENBQ2YsK0RBQ0UsU0FBWSxDQUNoQixrRUFDRSxjQUFpQixDQUNuQixrRkFFRSxVQUFXLENBRVgsV0FBWSxDQUVaLGVBQWdCLENBTGhCLGlCQUFrQixDQUlsQiw2RUFBeUYsQ0FGekYsT0FHa0IsQ0FDbEIsNEdBUUUsZUFBZ0IsQ0FGaEIsa0JBQW1CLENBRG5CLFdBQVksQ0FGWixNQUFPLENBSVAsZUFBZ0IsQ0FOaEIsaUJBQWtCLENBQ2xCLE9BQVEsQ0FFUixVQUlrQixDQUNsQixtSEFFRSxlQUFnQixDQURoQixVQUNrQixDQUNwQixrSEFFRSw2QkFBb0MsQ0FEcEMsUUFDc0MsQ0FDeEMscU9BQ0UsVUFBVyxDQUVYLGFBQWMsQ0FFZCxVQUFXLENBQ1gsZUFBZ0IsQ0FKaEIsaUJBQWtCLENBRWxCLE9BQVEsQ0FHUixVQUFhLENBQ25CLHdGQUNFLFVBQWEsQ0FDZixpRUFDRSxpQkFBa0IsQ0FDbEIsVUFBYSxDQUNiLCtFQVFFLHlCQUE4QixDQUM5QixpQkFBa0IsQ0FObEIsV0FBWSxDQUlaLFVBQVcsQ0FOWCxZQUFhLENBSWIsYUFBYyxDQUhkLGlCQUFrQixDQUlsQixpQkFBa0IsQ0FGbEIsV0FLb0IsQ0FDcEIsaUdBQ0UsV0FBWSxDQUNaLGdCQUFpQixDQUNqQixlQUFnQixDQUNoQixzQkFBdUIsQ0FFdkIsa0NBQXVDLENBRHZDLGtCQUN5QyxDQUN6Qyx1R0FDRSxtQ0FBNEMsQ0FDbEQscUZBQ0UsYUFBZ0IsQ0FDdEIsb0dBQ0UsV0FBYyxDQUNkLDRIQUNFLGtCQUFzQixDQUN0QixrQkFBcUIsQ0FFM0IsdUZBQ0UsU0FBVSxDQUNWLGtCQUFxQixDQUV2Qix3TUFHRSxzQkFBMEIsQ0FFNUIseUNBQ0Usa0JBQXFCLENBQ3JCLHVEQUNFLFdBQWMsQ0FDaEIsaUVBQ0UsNEJBQWlDLENBQ2pDLDRCQUFnQyxDQUVwQyw4QkFDRSxZQUFhLENBQ2IsY0FBZSxDQUdmLE1BQU8sQ0FFUCxZQUFhLENBRWIsbUJBQW9CLENBTnBCLGlCQUFrQixDQUdsQixLQUFNLENBRU4sVUFBVyxDQUpYLFVBS3NCLENBQ3RCLGdEQUlFLCtCQUFvQyxDQUNwQyxpQkFBa0IsQ0FGbEIsVUFBVyxDQUZYLG9CQUFxQixDQUNyQixnQkFHb0IsQ0FFeEIsOENBQ0UsWUFBZSxDQUVqQixvQ0FTRSwrQkFBb0MsQ0FDcEMsaUJBQWtCLENBVGxCLFlBQWEsQ0FDYixxQkFBc0IsQ0FHdEIsU0FBVSxDQUVWLGVBQWdCLENBQ2hCLGFBQWMsQ0FMZCxpQkFBa0IsQ0FHbEIsUUFBUyxDQUZULFdBTW9CLENBQ3BCLHFEQVVFLDBDQUFpRCxDQU5qRCxVQUFXLENBSFgsY0FBZSxDQUVmLGFBQWMsQ0FEZCxjQUFlLENBSWYsZUFBZ0IsQ0FEaEIsaUJBQWtCLENBRWxCLHNCQUF1QixDQUV2QixrQ0FBdUMsQ0FEdkMsa0JBRW1ELENBQ25ELHVEQUNFLFVBQVcsQ0FDWCxvQkFBdUIsQ0FDekIsMERBQ0Usb0JBQXFCLENBQ3JCLGFBQWdCLENBQ2hCLHNJQUNFLGFBQWdCLENBQ3BCLDJEQUNFLG1DQUE0QyxDQUM5QyxnRUFDRSxrQkFBcUIsQ0FFM0IseURBQ0UsWUFBZSxDQUVqQixnQ0FXRSwrQkFBb0MsQ0FIcEMsaUJBQWtCLENBSGxCLFdBQVksQ0FKWixZQUFhLENBTWIsY0FBZSxDQUVmLGdCQUFpQixDQUhqQixhQUFjLENBSmQsaUJBQWtCLENBRWxCLFVBQVcsQ0FNWCx1QkFBeUIsQ0FQekIsVUFRc0MsQ0FDdEMsbURBQ0UsWUFBZSxDQUNmLCtEQUNFLGFBQWdCLENBQ2xCLHFFQUdFLGtCQUFtQixDQU1uQix3QkFBK0IsQ0FGL0IsY0FBZSxDQU5mLFlBQWEsQ0FHYixXQUFZLENBRlosNkJBQThCLENBSTlCLGFBQWMsQ0FFZCxlQUFnQixDQUhoQixhQUlpQyxDQUNqQyw0SkFFRSxtQ0FBMEMsQ0FEMUMsVUFDNEMsQ0FDOUMsK0VBR0Usa0JBQW1CLENBRm5CLFlBQWEsQ0FJYixXQUFZLENBSFosc0JBQXVCLENBRXZCLFVBQ2MsQ0FDaEIscUZBRUUsV0FBWSxDQURaLGlCQUNjLENBQ2hCLGlHQUNFLGtCQUFxQixDQUN2Qiw0RkFFRSxrQkFBbUIsQ0FEbkIsWUFBYSxDQUViLGtCQUFxQixDQUNyQix3SEFHRSxrQkFBbUIsQ0FGbkIsWUFBYSxDQUdiLFdBQVksQ0FGWixzQkFBdUIsQ0FJdkIsaUJBQWtCLENBRGxCLFVBQ29CLENBQ3hCLDZGQUVFLGtCQUFtQixDQURuQixZQUNxQixDQUNyQiw2SEFHRSx3QkFBK0IsQ0FGL0IsY0FBZSxDQUNmLGtCQUNpQyxDQUNuQywwSEFHRSxrQkFBbUIsQ0FGbkIsWUFBYSxDQUdiLFdBQVksQ0FGWixzQkFBdUIsQ0FHdkIsVUFBYSxDQUNuQiwwRUFDRSwwQ0FBbUQsQ0FFekQsaURBQ0UsYUFBZ0IsQ0FFbEIsMkNBQ0UsZ0JBQW1CLENBRXJCLDRCQVlFLGtDQUFtQyxDQUNuQywrQkFBb0MsQ0FKcEMsVUFBVyxDQVJYLFlBQWEsQ0FDYixxQkFBc0IsQ0FTdEIsd0ZBQStGLENBRC9GLGNBQWUsQ0FOZixTQUFVLENBSVYsWUFBYSxDQUxiLGlCQUFrQixDQUVsQixRQUFTLENBRVQsV0FBWSxDQURaLFdBT3NDLENBQ3RDLDJDQUNFLFlBQWEsQ0FDYixpQkFBb0IsQ0FDcEIsMkRBRUUsZ0JBQWlCLENBRGpCLFdBQ21CLENBQ3JCLDZEQUNFLE1BQU8sQ0FDUCxlQUFnQixDQUdoQixnQkFBaUIsQ0FGakIsc0JBQXVCLENBQ3ZCLGtCQUNtQixDQUNyQixzREFDRSxlQUFrQixDQUN0Qiw0Q0FJRSxjQUFlLENBSGYsaUJBQWtCLENBRWxCLFNBQVUsQ0FEVixPQUVpQixDQUVyQiwwQ0FDRSxZQUFlLENBRWpCLG9DQUNFLHFCQUF5QixDQUUzQiwyQ0FDRSxzQkFBdUIsQ0FDdkIsa0JBQWdCLENBQWhCLGVBQWtCLENBWXBCLDREQUZFLFFBQVMsQ0FKVCxXQUFZLENBQ1osTUFBTyxDQUpQLGNBQWUsQ0FNZixPQUFRLENBRFIsS0FBTSxDQUhOLFVBQVcsQ0FEWCxZQWlCd0IsQ0FUMUIsdUJBU0UscUJBQXdCLENBRTFCLG1DQVdFLGtCQUFtQixDQURuQiwrQkFBb0MsQ0FEcEMsVUFBVyxDQVJYLFlBQWEsQ0FNYixXQUFZLENBS1osNkJBQThCLENBUjlCLE1BQU8sQ0FJUCxnQkFBaUIsQ0FLakIsU0FBVSxDQVhWLGlCQUFrQixDQUlsQixPQUFRLENBRFIsS0FBTSxDQVVOLDhCQUFnQyxDQURoQyxpQkFBa0IsQ0FYbEIsV0FZa0MsQ0FDbEMsbURBTUUsV0FBWSxDQUxaLE1BQU8sQ0FFUCxlQUFnQixDQURoQixjQUFlLENBRWYsc0JBQXVCLENBQ3ZCLGtCQUNjLENBQ2hCLG1EQUlFLGNBQWUsQ0FEZixjQUFlLENBRGYsaUJBQWtCLENBRGxCLFVBR2lCLENBRXJCLGtDQUNFLFVBQWMsQ0FFaEIsMkJBS0UsaUVBQTJFLENBRDNFLFlBQWEsQ0FIYixjQUFlLENBRWYsV0FBWSxDQURaLFlBRzZFLENBQzdFLDRDQUNFLFlBQWEsQ0FDYix3QkFBaUIsQ0FBakIscUJBQWlCLENBQWpCLG9CQUFpQixDQUFqQixnQkFBbUIsQ0FDckIsc0RBQ0UsU0FBVSxDQUNWLGtCQUFxQixDQUN2QixnREFDRSxlQUFrQixDQUNwQiw2VEFRRSxzQkFBMEIsQ0FFOUIsZUFFRSxrQkFBbUIsQ0FEbkIsWUFBYSxDQUViLHNCQUF5QixDQUUzQixtREFDRSxvQkFBdUIsQ0FFekIsaURBQ0Usb0JBQXVCLENBRXpCLDZDQU9FLDZCQUE4QixDQUY5QixRQUFTLENBSlQsYUFBYyxDQUtkLFVBQVcsQ0FIWCxNQUFPLENBRFAsaUJBQWtCLENBRWxCLE9BR2dDLENBRWxDLGtDQUtFLFNBTXNDLENBRXhDLDRFQVhFLGtCQUFtQixDQVNuQiwrQkFBb0MsQ0FEcEMsaUJBQWtCLENBRGxCLFVBQVcsQ0FSWCxZQUFhLENBTWIsV0FBWSxDQUpaLHNCQUF1QixDQUN2QixpQkFBa0IsQ0FFbEIsb0JBQXFCLENBRXJCLFVBbUIrQyxDQWRqRCwwQ0FhRSwwQkFBMkIsQ0FDM0IseUNBQTZDLENBVDdDLFVBQVcsQ0FPWCx3QkFBaUIsQ0FBakIscUJBQWlCLENBQWpCLG9CQUFpQixDQUFqQixnQkFFK0MsQ0FFakQsMEZBRUUsc0JBQTBCLENBRTVCLHlDQUNFLHFCQUF5QixDQUUzQixzREFDRSx1QkFBMkIsQ0FFN0IsOERBQ0UsWUFBZSxDQUtqQiw4R0FDRSxZQUFlLENBRWpCLHdDQUNFLGlCQUFvQixDQUNwQiwyREFXRSwrQkFBb0MsQ0FDcEMsaUJBQWtCLENBVGxCLFdBQVksQ0FPWixVQUFXLENBVFgsWUFBYSxDQUtiLGdCQUFpQixDQURqQixlQUFnQixDQURoQixlQUFnQixDQUdoQixhQUFjLENBQ2QsYUFBYyxDQU5kLGlCQUFrQixDQU9sQixpQkFHb0IsQ0FDcEIsOEVBQ0UsV0FBWSxDQUNaLGdCQUFpQixDQUNqQixlQUFnQixDQUdoQixhQUFjLENBRmQsc0JBQXVCLENBR3ZCLGtDQUF1QyxDQUZ2QyxrQkFFeUMsQ0FDekMsb0ZBQ0UsbUNBQTRDLENBQzlDLDhLQUNFLGFBQWdCLENBQ3RCLGlFQUNFLGFBQWdCLENBRXBCLE1BQ0UsaUNBQXVDLENBQ3ZDLHdCQUF5QixDQUN6QixrQkFBcUIsQ0FFdkIscUNBQ0UsZ0JBQW1CLENBRXJCLCtCQUVFLGNBQWUsQ0FEZixpQkFDaUIsQ0FDakIscUNBVUUsK0JBQWdDLENBQ2hDLGlCQUFrQixDQUNsQixVQUFXLENBQ1gsd0JBQXlCLENBUnpCLHdIQUF3SSxDQUl4SSxrQ0FBbUMsQ0FGbkMsaUJBQWtCLENBRGxCLGVBQW1CLENBV25CLGVBQWdCLENBSGhCLGdCQUFrQixDQVZsQixhQUFjLENBSWQsZ0JBQWlCLENBUWpCLGtCQUVhLENBQ2YsMkVBbEJFLFNBQVUsQ0FDVixtQkFBb0IsQ0FhcEIsaUJBQWtCLENBWmxCLGlDQUFvQyxDQWVwQyxVQVdhLENBVmYsc0NBSUUsNEJBQXNDLENBQXRDLHlDQUFzQyxDQUl0QyxVQUFXLENBTlgsUUFBUyxDQURULE9BU2EsQ0FDZix1RkFDRSxTQUFVLENBQ1YsbUJBQXNCLENBQ3hCLDBEQUdFLGtCQUV1QixDQUN6QixxSEFMRSxXQUFZLENBQ1osUUFBUyxDQUVULDZDQUErQyxDQUMvQyxvQkFLdUIsQ0FHekIsaUlBQ0UseUJBQStCIiwiZmlsZSI6ImluZGV4LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYXJ0LXZpZGVvLXBsYXllciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHotaW5kZXg6IDIwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvdXRsaW5lOiAwO1xuICB6b29tOiAxO1xuICBmb250LWZhbWlseTogUm9ib3RvLCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICBjb2xvcjogI2VlZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgZGlyZWN0aW9uOiBsdHI7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgbGluZS1oZWlnaHQ6IDEuMztcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTtcbiAgdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb247XG4gIC1tcy1oaWdoLWNvbnRyYXN0LWFkanVzdDogbm9uZTsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAqIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIHdpZHRoOiA1cHg7XG4gICAgaGVpZ2h0OiA1cHg7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzY2NjsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtaWNvbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBsaW5lLWhlaWdodDogMS41OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1pY29uIHN2ZyB7XG4gICAgICBmaWxsOiAjZmZmOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIGltZyB7XG4gICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7IH1cbiAgQHN1cHBvcnRzICgtd2Via2l0LWJhY2tkcm9wLWZpbHRlcjogaW5pdGlhbCkgb3IgKGJhY2tkcm9wLWZpbHRlcjogaW5pdGlhbCkge1xuICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYmFja2Ryb3AtZmlsdGVyIHtcbiAgICAgIC13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOiBzYXR1cmF0ZSgxODAlKSBibHVyKDIwcHgpO1xuICAgICAgYmFja2Ryb3AtZmlsdGVyOiBzYXR1cmF0ZSgxODAlKSBibHVyKDIwcHgpO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjcpICFpbXBvcnRhbnQ7IH0gfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXZpZGVvIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAxMDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuICBjdXJzb3I6IHBvaW50ZXI7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1wb3N0ZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDExO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXN1YnRpdGxlIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAyMDtcbiAgYm90dG9tOiAxMHB4O1xuICB3aWR0aDogMTAwJTtcbiAgcGFkZGluZzogMCAyMHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiAjZmZmO1xuICBmb250LXNpemU6IDIwcHg7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB0ZXh0LXNoYWRvdzogMC41cHggMC41cHggMC41cHggcmdiYSgwLCAwLCAwLCAwLjUpOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtc3VidGl0bGUgcCB7XG4gICAgd29yZC1icmVhazogYnJlYWstYWxsO1xuICAgIGhlaWdodDogZml0LWNvbnRlbnQ7XG4gICAgbWFyZ2luOiA1cHggMCAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjI7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LXN1YnRpdGxlLXNob3cgLmFydC1zdWJ0aXRsZSB7XG4gIGRpc3BsYXk6IGJsb2NrOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyLmFydC1jb250cm9sLXNob3cgLmFydC1zdWJ0aXRsZSB7XG4gIGJvdHRvbTogNTBweDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWRhbm11a3Uge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDMwO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBvaW50ZXItZXZlbnRzOiBub25lOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbGF5ZXJzIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiA0MDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWxheWVycyAuYXJ0LWxheWVyIHtcbiAgICBwb2ludGVyLWV2ZW50czogYXV0bzsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtbGF5ZXItc2hvdyAuYXJ0LWxheWVycyB7XG4gIGRpc3BsYXk6IGJsb2NrOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbWFzayB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDUwO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBvaW50ZXItZXZlbnRzOiBub25lOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbWFzayAuYXJ0LXN0YXRlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAzMHB4O1xuICAgIGJvdHRvbTogNjVweDtcbiAgICB3aWR0aDogNjBweDtcbiAgICBoZWlnaHQ6IDYwcHg7XG4gICAgb3BhY2l0eTogMC44NTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgcG9pbnRlci1ldmVudHM6IGFsbDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtbWFzay1zaG93IC5hcnQtbWFzayB7XG4gIGRpc3BsYXk6IGZsZXg7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1vYmlsZSAuYXJ0LXN0YXRlIHtcbiAgcG9zaXRpb246IHN0YXRpYzsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWxvYWRpbmcge1xuICBkaXNwbGF5OiBub25lO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDcwO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtbG9hZGluZy1zaG93IC5hcnQtbG9hZGluZyB7XG4gIGRpc3BsYXk6IGZsZXg7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogNjA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIGhlaWdodDogMTAwcHg7XG4gIHBhZGRpbmc6IDUwcHggMTBweCAwO1xuICBvcGFjaXR5OiAwO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UtaW4tb3V0O1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgYmFja2dyb3VuZDogdXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQUVBQUFER0NBWUFBQUFUK09xRkFBQUFka2xFUVZRb3o0MlFRUTdBSUFnRUYvVC9EK2ticS9SV0FsblF5eWF6QTRhb0FCNEZzQlNBL2JGanVGMUVPTDdWYnJJckJ1dXNtcnQ0WlpPUmZiNmVoYldkblJIRUlpSVRhRVVLYTVFSnFVYWtSU2FFWUJKU0NZMmRFc3RRWTdBdXhhaHdYRnJ2Wm1XbDJyaDRKWjA3ejlkTHRlc2ZOajVxMEZVM0E1T2Jid0FBQUFCSlJVNUVya0pnZ2c9PSkgcmVwZWF0LXggYm90dG9tOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtcHJvZ3Jlc3Mge1xuICAgIGZsZXg6IDE7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHotaW5kZXg6IDA7XG4gICAgcG9pbnRlci1ldmVudHM6IGF1dG87IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyB7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBoZWlnaHQ6IDRweDtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzLWlubmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBoZWlnaHQ6IDUwJTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKTsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MtaW5uZXIgLmFydC1wcm9ncmVzcy1sb2FkZWQge1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICB6LWluZGV4OiAxMDtcbiAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICByaWdodDogMDtcbiAgICAgICAgICBib3R0b206IDA7XG4gICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgIHdpZHRoOiAwO1xuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC40KTsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MtaW5uZXIgLmFydC1wcm9ncmVzcy1wbGF5ZWQge1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICB6LWluZGV4OiAyMDtcbiAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICByaWdodDogMDtcbiAgICAgICAgICBib3R0b206IDA7XG4gICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgIHdpZHRoOiAwOyB9XG4gICAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcy1pbm5lciAuYXJ0LXByb2dyZXNzLWhpZ2hsaWdodCB7XG4gICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgIHotaW5kZXg6IDMwO1xuICAgICAgICAgIGxlZnQ6IDA7XG4gICAgICAgICAgdG9wOiAwO1xuICAgICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICAgIGJvdHRvbTogMDtcbiAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7IH1cbiAgICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MtaW5uZXIgLmFydC1wcm9ncmVzcy1oaWdobGlnaHQgc3BhbiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgICAgdG9wOiAwO1xuICAgICAgICAgICAgd2lkdGg6IDdweDtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgICAgICBwb2ludGVyLWV2ZW50czogYXV0bzsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MtaW5uZXIgLmFydC1wcm9ncmVzcy1pbmRpY2F0b3Ige1xuICAgICAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICB6LWluZGV4OiA0MDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjEsIDAuMSk7XG4gICAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMXMgZWFzZS1pbi1vdXQ7IH1cbiAgICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MtaW5uZXIgLmFydC1wcm9ncmVzcy1pbmRpY2F0b3IgLmFydC1pY29uIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MtaW5uZXIgLmFydC1wcm9ncmVzcy10aXAge1xuICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgIHotaW5kZXg6IDUwO1xuICAgICAgICAgIHRvcDogLTI1cHg7XG4gICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgICAgcGFkZGluZzogMCA1cHg7XG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDIwcHg7XG4gICAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNyk7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC10aHVtYm5haWxzIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBib3R0b206IDhweDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43KTsgfVxuICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtcHJvZ3Jlc3MgLmFydC1jb250cm9sLWxvb3Age1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgbGVmdDogMDtcbiAgICAgIHRvcDogMDtcbiAgICAgIHJpZ2h0OiAwO1xuICAgICAgYm90dG9tOiAwO1xuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtcHJvZ3Jlc3MgLmFydC1jb250cm9sLWxvb3AgLmFydC1sb29wLXBvaW50IHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBsZWZ0OiAwO1xuICAgICAgICB0b3A6IC0ycHg7XG4gICAgICAgIHdpZHRoOiAycHg7XG4gICAgICAgIGhlaWdodDogOHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNzUpOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB6LWluZGV4OiAxO1xuICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgaGVpZ2h0OiA0NXB4OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2xzLWxlZnQsXG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2xzLXJpZ2h0IHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbCB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIG9wYWNpdHk6IDAuOTtcbiAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgIG1pbi1oZWlnaHQ6IDM2cHg7XG4gICAgICBtaW4td2lkdGg6IDM2cHg7XG4gICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMgLmFydC1jb250cm9sIC5hcnQtaWNvbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBmbG9hdDogbGVmdDtcbiAgICAgICAgaGVpZ2h0OiAzNnB4O1xuICAgICAgICB3aWR0aDogMzZweDsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2w6aG92ZXIge1xuICAgICAgICBvcGFjaXR5OiAxOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtb25seVRleHQge1xuICAgICAgcGFkZGluZzogMCAxMHB4OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtdm9sdW1lIC5hcnQtdm9sdW1lLXBhbmVsIHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIGZsb2F0OiBsZWZ0O1xuICAgICAgd2lkdGg6IDA7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICB0cmFuc2l0aW9uOiBtYXJnaW4gMC4ycyBjdWJpYy1iZXppZXIoMC40LCAwLCAxLCAxKSwgd2lkdGggMC4ycyBjdWJpYy1iZXppZXIoMC40LCAwLCAxLCAxKTtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMgLmFydC1jb250cm9sLXZvbHVtZSAuYXJ0LXZvbHVtZS1wYW5lbCAuYXJ0LXZvbHVtZS1zbGlkZXItaGFuZGxlIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDUwJTtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgICAgd2lkdGg6IDEycHg7XG4gICAgICAgIGhlaWdodDogMTJweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgbWFyZ2luLXRvcDogLTZweDtcbiAgICAgICAgYmFja2dyb3VuZDogI2ZmZjsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC12b2x1bWUgLmFydC12b2x1bWUtcGFuZWwgLmFydC12b2x1bWUtc2xpZGVyLWhhbmRsZTo6YmVmb3JlIHtcbiAgICAgICAgICBsZWZ0OiAtNTRweDtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmOyB9XG4gICAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMgLmFydC1jb250cm9sLXZvbHVtZSAuYXJ0LXZvbHVtZS1wYW5lbCAuYXJ0LXZvbHVtZS1zbGlkZXItaGFuZGxlOjphZnRlciB7XG4gICAgICAgICAgbGVmdDogNnB4O1xuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKTsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC12b2x1bWUgLmFydC12b2x1bWUtcGFuZWwgLmFydC12b2x1bWUtc2xpZGVyLWhhbmRsZTo6YmVmb3JlLCAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC12b2x1bWUgLmFydC12b2x1bWUtcGFuZWwgLmFydC12b2x1bWUtc2xpZGVyLWhhbmRsZTo6YWZ0ZXIge1xuICAgICAgICAgIGNvbnRlbnQ6ICcnO1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICB0b3A6IDUwJTtcbiAgICAgICAgICBoZWlnaHQ6IDNweDtcbiAgICAgICAgICBtYXJnaW4tdG9wOiAtMnB4O1xuICAgICAgICAgIHdpZHRoOiA2MHB4OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtdm9sdW1lOmhvdmVyIC5hcnQtdm9sdW1lLXBhbmVsIHtcbiAgICAgIHdpZHRoOiA2MHB4OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtcXVhbGl0eSB7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICB6LWluZGV4OiAzMDsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1ib3R0b20gLmFydC1jb250cm9scyAuYXJ0LWNvbnRyb2wtcXVhbGl0eSAuYXJ0LXF1YWxpdHlzIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBib3R0b206IDM1cHg7XG4gICAgICAgIHdpZHRoOiAxMDBweDtcbiAgICAgICAgcGFkZGluZzogNXB4IDA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC44KTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4OyB9XG4gICAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMgLmFydC1jb250cm9sLXF1YWxpdHkgLmFydC1xdWFsaXR5cyAuYXJ0LXF1YWxpdHktaXRlbSB7XG4gICAgICAgICAgaGVpZ2h0OiAzMHB4O1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAzMHB4O1xuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICB0ZXh0LXNoYWRvdzogMCAwIDJweCByZ2JhKDAsIDAsIDAsIDAuNSk7IH1cbiAgICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC1xdWFsaXR5IC5hcnQtcXVhbGl0eXMgLmFydC1xdWFsaXR5LWl0ZW06aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpOyB9XG4gICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbSAuYXJ0LWNvbnRyb2xzIC5hcnQtY29udHJvbC1xdWFsaXR5OmhvdmVyIC5hcnQtcXVhbGl0eXMge1xuICAgICAgICBkaXNwbGF5OiBibG9jazsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWJvdHRvbTpob3ZlciAuYXJ0LXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcyAuYXJ0LWNvbnRyb2wtcHJvZ3Jlc3MtaW5uZXIge1xuICAgIGhlaWdodDogMTAwJTsgfVxuICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtYm90dG9tOmhvdmVyIC5hcnQtcHJvZ3Jlc3MgLmFydC1jb250cm9sLXByb2dyZXNzIC5hcnQtY29udHJvbC1wcm9ncmVzcy1pbm5lciAuYXJ0LXByb2dyZXNzLWluZGljYXRvciB7XG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDEsIDEpO1xuICAgICAgdmlzaWJpbGl0eTogdmlzaWJsZTsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtY29udHJvbC1zaG93IC5hcnQtYm90dG9tLCAuYXJ0LXZpZGVvLXBsYXllci5hcnQtaG92ZXIgLmFydC1ib3R0b20ge1xuICBvcGFjaXR5OiAxO1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyLmFydC1lcnJvciAuYXJ0LXByb2dyZXNzLWluZGljYXRvcixcbi5hcnQtdmlkZW8tcGxheWVyLmFydC1lcnJvciAuYXJ0LXByb2dyZXNzLXRpcCwgLmFydC12aWRlby1wbGF5ZXIuYXJ0LWRlc3Ryb3kgLmFydC1wcm9ncmVzcy1pbmRpY2F0b3IsXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtZGVzdHJveSAuYXJ0LXByb2dyZXNzLXRpcCB7XG4gIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtbW9iaWxlIC5hcnQtYm90dG9tIHtcbiAgcGFkZGluZzogNTBweCA3cHggMDsgfVxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbW9iaWxlIC5hcnQtYm90dG9tIC5hcnQtY29udHJvbHMge1xuICAgIGhlaWdodDogNDBweDsgfVxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbW9iaWxlIC5hcnQtYm90dG9tIC5hcnQtcHJvZ3Jlc3MtaW5kaWNhdG9yIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEsIDEpICFpbXBvcnRhbnQ7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZSAhaW1wb3J0YW50OyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbm90aWNlIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDgwO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHBhZGRpbmc6IDEwcHg7XG4gIHdpZHRoOiAxMDAlO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LW5vdGljZSAuYXJ0LW5vdGljZS1pbm5lciB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHBhZGRpbmc6IDVweCAxMHB4O1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42KTtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LW5vdGljZS1zaG93IC5hcnQtbm90aWNlIHtcbiAgZGlzcGxheTogZmxleDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRleHRtZW51cyB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMTIwO1xuICBsZWZ0OiAxMHB4O1xuICB0b3A6IDEwcHg7XG4gIG1pbi13aWR0aDogMjAwcHg7XG4gIHBhZGRpbmc6IDVweCAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOSk7XG4gIGJvcmRlci1yYWRpdXM6IDNweDsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRleHRtZW51cyAuYXJ0LWNvbnRleHRtZW51IHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIHBhZGRpbmc6IDEwcHggMTVweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgdGV4dC1zaGFkb3c6IDAgMCAycHggcmdiYSgwLCAwLCAwLCAwLjUpO1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRleHRtZW51cyAuYXJ0LWNvbnRleHRtZW51IGEge1xuICAgICAgY29sb3I6ICNmZmY7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRleHRtZW51cyAuYXJ0LWNvbnRleHRtZW51IHNwYW4ge1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgcGFkZGluZzogMCA3cHg7IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtY29udGV4dG1lbnVzIC5hcnQtY29udGV4dG1lbnUgc3Bhbjpob3ZlciwgLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250ZXh0bWVudXMgLmFydC1jb250ZXh0bWVudSBzcGFuLmFydC1jdXJyZW50IHtcbiAgICAgICAgY29sb3I6ICMwMGM5ZmY7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRleHRtZW51cyAuYXJ0LWNvbnRleHRtZW51OmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTsgfVxuICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtY29udGV4dG1lbnVzIC5hcnQtY29udGV4dG1lbnU6bGFzdC1jaGlsZCB7XG4gICAgICBib3JkZXItYm90dG9tOiBub25lOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyLmFydC1jb250ZXh0bWVudS1zaG93IC5hcnQtY29udGV4dG1lbnVzIHtcbiAgZGlzcGxheTogZmxleDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiA5MDtcbiAgcmlnaHQ6IDEwcHg7XG4gIGJvdHRvbTogNTBweDtcbiAgb3ZlcmZsb3c6IGF1dG87XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBtYXgtaGVpZ2h0OiAzMDBweDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtc2V0dGluZ3MgLmFydC1zZXR0aW5nLXBhbmVsIHtcbiAgICBkaXNwbGF5OiBub25lOyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1zZXR0aW5ncyAuYXJ0LXNldHRpbmctcGFuZWwuYXJ0LWN1cnJlbnQge1xuICAgICAgZGlzcGxheTogYmxvY2s7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1wYW5lbCAuYXJ0LXNldHRpbmctaXRlbSB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIGhlaWdodDogMzVweDtcbiAgICAgIHBhZGRpbmc6IDAgNXB4O1xuICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1zZXR0aW5ncyAuYXJ0LXNldHRpbmctcGFuZWwgLmFydC1zZXR0aW5nLWl0ZW06aG92ZXIsIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtc2V0dGluZ3MgLmFydC1zZXR0aW5nLXBhbmVsIC5hcnQtc2V0dGluZy1pdGVtLmFydC1jdXJyZW50IHtcbiAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1zZXR0aW5ncyAuYXJ0LXNldHRpbmctcGFuZWwgLmFydC1zZXR0aW5nLWl0ZW0gLmFydC1pY29uIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAzMHB4O1xuICAgICAgICBoZWlnaHQ6IDMwcHg7IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtc2V0dGluZ3MgLmFydC1zZXR0aW5nLXBhbmVsIC5hcnQtc2V0dGluZy1pdGVtIC5hcnQtaWNvbi1jaGVjayB7XG4gICAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgICAgICAgaGVpZ2h0OiAxNXB4OyB9XG4gICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1wYW5lbCAuYXJ0LXNldHRpbmctaXRlbS5hcnQtY3VycmVudCAuYXJ0LWljb24tY2hlY2sge1xuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmxlOyB9XG4gICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1wYW5lbCAuYXJ0LXNldHRpbmctaXRlbSAuYXJ0LXNldHRpbmctaXRlbS1sZWZ0IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1wYW5lbCAuYXJ0LXNldHRpbmctaXRlbSAuYXJ0LXNldHRpbmctaXRlbS1sZWZ0IC5hcnQtc2V0dGluZy1pdGVtLWxlZnQtaWNvbiB7XG4gICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgIGhlaWdodDogMjRweDtcbiAgICAgICAgICB3aWR0aDogMjRweDtcbiAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7IH1cbiAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtc2V0dGluZ3MgLmFydC1zZXR0aW5nLXBhbmVsIC5hcnQtc2V0dGluZy1pdGVtIC5hcnQtc2V0dGluZy1pdGVtLXJpZ2h0IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfVxuICAgICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1wYW5lbCAuYXJ0LXNldHRpbmctaXRlbSAuYXJ0LXNldHRpbmctaXRlbS1yaWdodCAuYXJ0LXNldHRpbmctaXRlbS1yaWdodC10b29sdGlwIHtcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpOyB9XG4gICAgICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtc2V0dGluZ3MgLmFydC1zZXR0aW5nLXBhbmVsIC5hcnQtc2V0dGluZy1pdGVtIC5hcnQtc2V0dGluZy1pdGVtLXJpZ2h0IC5hcnQtc2V0dGluZy1pdGVtLXJpZ2h0LWljb24ge1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgICAgd2lkdGg6IDI0cHg7IH1cbiAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LXNldHRpbmdzIC5hcnQtc2V0dGluZy1wYW5lbCAuYXJ0LXNldHRpbmctaXRlbS1iYWNrIHtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LXNldHRpbmctc2hvdyAuYXJ0LXNldHRpbmdzIHtcbiAgZGlzcGxheTogYmxvY2s7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1vYmlsZSAuYXJ0LXNldHRpbmdzIHtcbiAgbWF4LWhlaWdodDogMjAwcHg7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1pbmZvIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAxMHB4O1xuICB0b3A6IDEwcHg7XG4gIHotaW5kZXg6IDEwMDtcbiAgd2lkdGg6IDM1MHB4O1xuICBwYWRkaW5nOiAxMHB4O1xuICBjb2xvcjogI2ZmZjtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LWZhbWlseTogTm90byBTYW5zIENKSyBTQyBEZW1pTGlnaHQsIFJvYm90bywgU2Vnb2UgVUksIFRhaG9tYSwgQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC45KTsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWluZm8gLmFydC1pbmZvLWl0ZW0ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgbWFyZ2luLWJvdHRvbTogNXB4OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1pbmZvIC5hcnQtaW5mby1pdGVtIC5hcnQtaW5mby10aXRsZSB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICB0ZXh0LWFsaWduOiByaWdodDsgfVxuICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtaW5mbyAuYXJ0LWluZm8taXRlbSAuYXJ0LWluZm8tY29udGVudCB7XG4gICAgICBmbGV4OiAxO1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgIHBhZGRpbmctbGVmdDogNXB4OyB9XG4gICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1pbmZvIC5hcnQtaW5mby1pdGVtOmxhc3QtY2hpbGQge1xuICAgICAgbWFyZ2luLWJvdHRvbTogMDsgfVxuICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWluZm8gLmFydC1pbmZvLWNsb3NlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiA1cHg7XG4gICAgcmlnaHQ6IDVweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LWluZm8tc2hvdyAuYXJ0LWluZm8ge1xuICBkaXNwbGF5OiBmbGV4OyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyLmFydC1oaWRlLWN1cnNvciAqIHtcbiAgY3Vyc29yOiBub25lICFpbXBvcnRhbnQ7IH1cblxuLmFydC12aWRlby1wbGF5ZXJbZGF0YS1hc3BlY3QtcmF0aW9dIHZpZGVvIHtcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7XG4gIG9iamVjdC1maXQ6IGZpbGw7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LWZ1bGxzY3JlZW4td2ViIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB6LWluZGV4OiA5OTk5O1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7IH1cblxuLmFydC1mdWxsc2NyZWVuLXJvdGF0ZSB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgei1pbmRleDogOTk5OTtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbWluaS1oZWFkZXIge1xuICBkaXNwbGF5OiBub25lO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDExMDtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgaGVpZ2h0OiAzNXB4O1xuICBsaW5lLWhlaWdodDogMzVweDtcbiAgY29sb3I6ICNmZmY7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBvcGFjaXR5OiAwO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UtaW4tb3V0OyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbWluaS1oZWFkZXIgLmFydC1taW5pLXRpdGxlIHtcbiAgICBmbGV4OiAxO1xuICAgIHBhZGRpbmc6IDAgMTBweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgY3Vyc29yOiBtb3ZlOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbWluaS1oZWFkZXIgLmFydC1taW5pLWNsb3NlIHtcbiAgICB3aWR0aDogMzVweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZm9udC1zaXplOiAyMnB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtaXMtZHJhZ2dpbmcge1xuICBvcGFjaXR5OiAwLjc7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHotaW5kZXg6IDk5OTk7XG4gIHdpZHRoOiA0MDBweDtcbiAgaGVpZ2h0OiAyMjVweDtcbiAgYm94LXNoYWRvdzogMCAycHggNXB4IDAgcmdiYSgwLCAwLCAwLCAwLjE2KSwgMCAzcHggNnB4IDAgcmdiYSgwLCAwLCAwLCAwLjIpOyB9XG4gIC5hcnQtdmlkZW8tcGxheWVyLmFydC1taW5pIC5hcnQtbWluaS1oZWFkZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkuYXJ0LWhvdmVyIC5hcnQtbWluaS1oZWFkZXIge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTsgfVxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbWluaSAuYXJ0LW1hc2sgLmFydC1zdGF0ZSB7XG4gICAgcG9zaXRpb246IHN0YXRpYzsgfVxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbWluaSAuYXJ0LWNvbnRleHRtZW51LFxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbWluaSAuYXJ0LWJvdHRvbSxcbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkgLmFydC1kYW5tdSxcbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkgLmFydC1pbmZvLFxuICAuYXJ0LXZpZGVvLXBsYXllci5hcnQtbWluaSAuYXJ0LWxheWVycyxcbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkgLmFydC1ub3RpY2UsXG4gIC5hcnQtdmlkZW8tcGxheWVyLmFydC1taW5pIC5hcnQtc2V0dGluZyxcbiAgLmFydC12aWRlby1wbGF5ZXIuYXJ0LW1pbmkgLmFydC1zdWJ0aXRsZSB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50OyB9XG5cbi5hcnQtYXV0by1zaXplIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IH1cblxuLmFydC12aWRlby1wbGF5ZXJbZGF0YS1mbGlwPVwiaG9yaXpvbnRhbFwiXSAuYXJ0LXZpZGVvIHtcbiAgdHJhbnNmb3JtOiBzY2FsZVgoLTEpOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyW2RhdGEtZmxpcD1cInZlcnRpY2FsXCJdIC5hcnQtdmlkZW8ge1xuICB0cmFuc2Zvcm06IHNjYWxlWSgtMSk7IH1cblxuLmFydC12aWRlby1wbGF5ZXIgLmFydC1sYXllci1taW5pUHJvZ3Jlc3NCYXIge1xuICBkaXNwbGF5OiBibG9jaztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBoZWlnaHQ6IDJweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGhlbWUpOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbGF5ZXItbG9jayB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDE1cHg7XG4gIHRvcDogY2FsYyg1MCUgLSAxN3B4KTtcbiAgaGVpZ2h0OiAzNHB4O1xuICB3aWR0aDogMzRweDtcbiAgY29sb3I6ICNmZmY7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjUpOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyIC5hcnQtbGF5ZXItZmFzdC1mb3J3YXJkIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDE1cHg7XG4gIHRvcDogY2FsYyg1MCUgLSAxN3B4KTtcbiAgaGVpZ2h0OiAzNHB4O1xuICB3aWR0aDogMzRweDtcbiAgY29sb3I6ICNmZmY7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjUpO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lO1xuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LWxvY2sgLmFydC1ib3R0b20sXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtbG9jayAuYXJ0LWxheWVyLWZhc3QtZm9yd2FyZCB7XG4gIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtbG9jayAuYXJ0LXN1YnRpdGxlIHtcbiAgYm90dG9tOiAxMHB4ICFpbXBvcnRhbnQ7IH1cblxuLmFydC12aWRlby1wbGF5ZXIuYXJ0LWxvY2sgLmFydC1sYXllci1taW5pUHJvZ3Jlc3NCYXIge1xuICBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50OyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyLmFydC1jb250cm9sLXNob3cgLmFydC1sYXllci1taW5pUHJvZ3Jlc3NCYXIge1xuICBkaXNwbGF5OiBub25lOyB9XG5cbi5hcnQtdmlkZW8tcGxheWVyLmFydC1jb250cm9sLXNob3cgLmFydC1sYXllci1sb2NrIHtcbiAgZGlzcGxheTogZmxleDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllci5hcnQtY29udHJvbC1zaG93IC5hcnQtbGF5ZXItZmFzdC1mb3J3YXJkIHtcbiAgZGlzcGxheTogZmxleDsgfVxuXG4uYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRyb2wtc2VsZWN0b3Ige1xuICBwb3NpdGlvbjogcmVsYXRpdmU7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250cm9sLXNlbGVjdG9yIC5hcnQtc2VsZWN0b3ItbGlzdCB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgYm90dG9tOiAzNXB4O1xuICAgIG1pbi13aWR0aDogMTAwcHg7XG4gICAgbWF4LXdpZHRoOiAyMDBweDtcbiAgICBtYXgtaGVpZ2h0OiAyMDBweDtcbiAgICBvdmVyZmxvdzogYXV0bztcbiAgICBwYWRkaW5nOiA1cHggMDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjgpO1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDsgfVxuICAgIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtY29udHJvbC1zZWxlY3RvciAuYXJ0LXNlbGVjdG9yLWxpc3QgLmFydC1zZWxlY3Rvci1pdGVtIHtcbiAgICAgIGhlaWdodDogMzBweDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAzMHB4O1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgIHBhZGRpbmc6IDAgNXB4O1xuICAgICAgdGV4dC1zaGFkb3c6IDAgMCAycHggcmdiYSgwLCAwLCAwLCAwLjUpOyB9XG4gICAgICAuYXJ0LXZpZGVvLXBsYXllciAuYXJ0LWNvbnRyb2wtc2VsZWN0b3IgLmFydC1zZWxlY3Rvci1saXN0IC5hcnQtc2VsZWN0b3ItaXRlbTpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTsgfVxuICAgICAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250cm9sLXNlbGVjdG9yIC5hcnQtc2VsZWN0b3ItbGlzdCAuYXJ0LXNlbGVjdG9yLWl0ZW06aG92ZXIsIC5hcnQtdmlkZW8tcGxheWVyIC5hcnQtY29udHJvbC1zZWxlY3RvciAuYXJ0LXNlbGVjdG9yLWxpc3QgLmFydC1zZWxlY3Rvci1pdGVtLmFydC1jdXJyZW50IHtcbiAgICAgICAgY29sb3I6ICMwMGM5ZmY7IH1cbiAgLmFydC12aWRlby1wbGF5ZXIgLmFydC1jb250cm9sLXNlbGVjdG9yOmhvdmVyIC5hcnQtc2VsZWN0b3ItbGlzdCB7XG4gICAgZGlzcGxheTogYmxvY2s7IH1cblxuOnJvb3Qge1xuICAtLWJhbGxvb24tY29sb3I6IHJnYmEoMTYsIDE2LCAxNiwgMC45NSk7XG4gIC0tYmFsbG9vbi1mb250LXNpemU6IDEycHg7XG4gIC0tYmFsbG9vbi1tb3ZlOiA0cHg7IH1cblxuYnV0dG9uW2FyaWEtbGFiZWxdW2RhdGEtYmFsbG9vbi1wb3NdIHtcbiAgb3ZlcmZsb3c6IHZpc2libGU7IH1cblxuW2FyaWEtbGFiZWxdW2RhdGEtYmFsbG9vbi1wb3NdIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBjdXJzb3I6IHBvaW50ZXI7IH1cbiAgW2FyaWEtbGFiZWxdW2RhdGEtYmFsbG9vbi1wb3NdOmFmdGVyIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjE4cyBlYXNlLW91dCAwLjE4cztcbiAgICB0ZXh0LWluZGVudDogMDtcbiAgICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBSb2JvdG8sIE94eWdlbiwgVWJ1bnR1LCBDYW50YXJlbGwsICdPcGVuIFNhbnMnLCAnSGVsdmV0aWNhIE5ldWUnLCBzYW5zLXNlcmlmO1xuICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIHRleHQtc2hhZG93OiBub25lO1xuICAgIGZvbnQtc2l6ZTogdmFyKC0tYmFsbG9vbi1mb250LXNpemUpO1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhbGxvb24tY29sb3IpO1xuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBjb250ZW50OiBhdHRyKGFyaWEtbGFiZWwpO1xuICAgIHBhZGRpbmc6IDAuNWVtIDFlbTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBsaW5lLWhlaWdodDogMS4yO1xuICAgIHotaW5kZXg6IDEwOyB9XG4gIFthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXTpiZWZvcmUge1xuICAgIHdpZHRoOiAwO1xuICAgIGhlaWdodDogMDtcbiAgICBib3JkZXI6IDVweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgICBib3JkZXItdG9wLWNvbG9yOiB2YXIoLS1iYWxsb29uLWNvbG9yKTtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjE4cyBlYXNlLW91dCAwLjE4cztcbiAgICBjb250ZW50OiAnJztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgei1pbmRleDogMTA7IH1cbiAgW2FyaWEtbGFiZWxdW2RhdGEtYmFsbG9vbi1wb3NdOmhvdmVyOmJlZm9yZSwgW2FyaWEtbGFiZWxdW2RhdGEtYmFsbG9vbi1wb3NdOmhvdmVyOmFmdGVyIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lOyB9XG4gIFthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXVtkYXRhLWJhbGxvb24tcG9zPSd1cCddOmFmdGVyIHtcbiAgICBib3R0b206IDEwMCU7XG4gICAgbGVmdDogNTAlO1xuICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgdmFyKC0tYmFsbG9vbi1tb3ZlKSk7XG4gICAgdHJhbnNmb3JtLW9yaWdpbjogdG9wOyB9XG4gIFthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXVtkYXRhLWJhbGxvb24tcG9zPSd1cCddOmJlZm9yZSB7XG4gICAgYm90dG9tOiAxMDAlO1xuICAgIGxlZnQ6IDUwJTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCB2YXIoLS1iYWxsb29uLW1vdmUpKTtcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiB0b3A7IH1cbiAgW2FyaWEtbGFiZWxdW2RhdGEtYmFsbG9vbi1wb3NdW2RhdGEtYmFsbG9vbi1wb3M9J3VwJ106aG92ZXI6YWZ0ZXIge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDApOyB9XG4gIFthcmlhLWxhYmVsXVtkYXRhLWJhbGxvb24tcG9zXVtkYXRhLWJhbGxvb24tcG9zPSd1cCddOmhvdmVyOmJlZm9yZSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgMCk7IH1cbiJdfQ== */";
  styleInject(css_248z);

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var optionValidator = {exports: {}};

  (function (module, exports) {
  !function(r,t){module.exports=t();}(commonjsGlobal,function(){function e(r){return (e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(r)}var n=Object.prototype.toString,c=function(r){if(void 0===r)return "undefined";if(null===r)return "null";var t=e(r);if("boolean"===t)return "boolean";if("string"===t)return "string";if("number"===t)return "number";if("symbol"===t)return "symbol";if("function"===t)return function(r){return "GeneratorFunction"===o(r)}(r)?"generatorfunction":"function";if(function(r){return Array.isArray?Array.isArray(r):r instanceof Array}(r))return "array";if(function(r){if(r.constructor&&"function"==typeof r.constructor.isBuffer)return r.constructor.isBuffer(r);return !1}(r))return "buffer";if(function(r){try{if("number"==typeof r.length&&"function"==typeof r.callee)return !0}catch(r){if(-1!==r.message.indexOf("callee"))return !0}return !1}(r))return "arguments";if(function(r){return r instanceof Date||"function"==typeof r.toDateString&&"function"==typeof r.getDate&&"function"==typeof r.setDate}(r))return "date";if(function(r){return r instanceof Error||"string"==typeof r.message&&r.constructor&&"number"==typeof r.constructor.stackTraceLimit}(r))return "error";if(function(r){return r instanceof RegExp||"string"==typeof r.flags&&"boolean"==typeof r.ignoreCase&&"boolean"==typeof r.multiline&&"boolean"==typeof r.global}(r))return "regexp";switch(o(r)){case"Symbol":return "symbol";case"Promise":return "promise";case"WeakMap":return "weakmap";case"WeakSet":return "weakset";case"Map":return "map";case"Set":return "set";case"Int8Array":return "int8array";case"Uint8Array":return "uint8array";case"Uint8ClampedArray":return "uint8clampedarray";case"Int16Array":return "int16array";case"Uint16Array":return "uint16array";case"Int32Array":return "int32array";case"Uint32Array":return "uint32array";case"Float32Array":return "float32array";case"Float64Array":return "float64array"}if(function(r){return "function"==typeof r.throw&&"function"==typeof r.return&&"function"==typeof r.next}(r))return "generator";switch(t=n.call(r)){case"[object Object]":return "object";case"[object Map Iterator]":return "mapiterator";case"[object Set Iterator]":return "setiterator";case"[object String Iterator]":return "stringiterator";case"[object Array Iterator]":return "arrayiterator"}return t.slice(8,-1).toLowerCase().replace(/\s/g,"")};function o(r){return r.constructor?r.constructor.name:null}function f(r,t){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:["option"];return s(r,t,e),y(r,t,e),function(a,i,u){var r=c(i),t=c(a);if("object"===r){if("object"!==t)throw new Error("[Type Error]: '".concat(u.join("."),"' require 'object' type, but got '").concat(t,"'"));Object.keys(i).forEach(function(r){var t=a[r],e=i[r],n=u.slice();n.push(r),s(t,e,n),y(t,e,n),f(t,e,n);});}if("array"===r){if("array"!==t)throw new Error("[Type Error]: '".concat(u.join("."),"' require 'array' type, but got '").concat(t,"'"));a.forEach(function(r,t){var e=a[t],n=i[t]||i[0],o=u.slice();o.push(t),s(e,n,o),y(e,n,o),f(e,n,o);});}}(r,t,e),r}function s(r,t,e){if("string"===c(t)){var n=c(r);if("?"===t[0]&&(t=t.slice(1)+"|undefined"),!(-1<t.indexOf("|")?t.split("|").map(function(r){return r.toLowerCase().trim()}).filter(Boolean).some(function(r){return n===r}):t.toLowerCase().trim()===n))throw new Error("[Type Error]: '".concat(e.join("."),"' require '").concat(t,"' type, but got '").concat(n,"'"))}}function y(r,t,e){if("function"===c(t)){var n=t(r,c(r),e);if(!0!==n){var o=c(n);throw "string"===o?new Error(n):"error"===o?n:new Error("[Validator Error]: The scheme for '".concat(e.join("."),"' validator require return true, but got '").concat(n,"'"))}}}return f.kindOf=c,f});
  }(optionValidator));

  var validator = optionValidator.exports;

  var Emitter = /*#__PURE__*/function () {
    function Emitter() {
      _classCallCheck(this, Emitter);
    }

    _createClass(Emitter, [{
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

  var userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  var isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  var isWechat = /MicroMessenger/i.test(userAgent);
  var isIE = /MSIE|Trident/i.test(userAgent);

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
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var rect = el.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    var windowWidth = window.innerWidth || document.documentElement.clientWidth;
    var vertInView = rect.top - offset <= windowHeight && rect.top + rect.height + offset >= 0;
    var horInView = rect.left - offset <= windowWidth + offset && rect.left + rect.width + offset >= 0;
    return vertInView && horInView;
  }
  function includeFromEvent(event, target) {
    return event.composedPath && event.composedPath().indexOf(target) > -1;
  }
  function replaceElement(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
    return newChild;
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _isNativeReflectConstruct$a() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct$a()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _createSuper$9(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$9(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$9() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var ArtPlayerError = /*#__PURE__*/function (_Error) {
    _inherits(ArtPlayerError, _Error);

    var _super = _createSuper$9(ArtPlayerError);

    function ArtPlayerError(message, context) {
      var _this;

      _classCallCheck(this, ArtPlayerError);

      _this = _super.call(this, message);

      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(_assertThisInitialized(_this), context || _this.constructor);
      }

      _this.name = 'ArtPlayerError';
      return _this;
    }

    return _createClass(ArtPlayerError);
  }( /*#__PURE__*/_wrapNativeSuper(Error));
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
  function outline() {
    var outlineColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#000';
    var outlineSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var blurSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return [[outlineSize, 0], [0, outlineSize], [-outlineSize, 0], [0, -outlineSize], [outlineSize, outlineSize], [-outlineSize, -outlineSize], [outlineSize, -outlineSize], [-outlineSize, outlineSize]].map(function (item) {
      return "".concat(outlineColor, " ").concat(item[0], "px ").concat(item[1], "px ").concat(blurSize, "px");
    }).join(',');
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

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  var def = Object.defineProperty;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function has(obj, name) {
    return hasOwnProperty.call(obj, name);
  }
  function get(obj, name) {
    return Object.getOwnPropertyDescriptor(obj, name);
  }
  function mergeDeep() {
    var isObject = function isObject(item) {
      return item && _typeof(item) === 'object' && !Array.isArray(item);
    };

    for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
      objects[_key] = arguments[_key];
    }

    return objects.reduce(function (prev, obj) {
      Object.keys(obj).forEach(function (key) {
        var pVal = prev[key];
        var oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat.apply(pVal, _toConsumableArray(oVal));
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
    replaceElement: replaceElement,
    ArtPlayerError: ArtPlayerError,
    errorHandle: errorHandle,
    srtToVtt: srtToVtt,
    vttToBlob: vttToBlob,
    assToVtt: assToVtt,
    outline: outline,
    getExt: getExt,
    download: download,
    def: def,
    has: has,
    get: get,
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
    isWechat: isWechat,
    isIE: isIE
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

  function ownKeys$l(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$l(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$l(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$l(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  var a = 'array';
  var b = 'boolean';
  var s = 'string';
  var n = 'number';
  var o = 'object';
  var f = 'function';
  var r = 'regexp';

  function validElement(value, type, paths) {
    return errorHandle(type === s || value instanceof Element, "".concat(paths.join('.'), " require '").concat(s, "' or 'Element' type"));
  }

  var ComponentOption = {
    html: validElement,
    disable: "?".concat(b),
    name: "?".concat(s),
    index: "?".concat(n),
    style: "?".concat(o),
    click: "?".concat(f),
    mounted: "?".concat(f),
    tooltip: "?".concat(s),
    width: "?".concat(n),
    selector: "?".concat(a),
    onSelect: "?".concat(f)
  };
  var scheme = {
    container: validElement,
    url: s,
    poster: s,
    title: s,
    type: s,
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
    playbackRate: b,
    aspectRatio: b,
    screenshot: b,
    setting: b,
    hotkey: b,
    pip: b,
    mutex: b,
    backdrop: b,
    fullscreen: b,
    fullscreenWeb: b,
    subtitleOffset: b,
    miniProgressBar: b,
    useSSR: b,
    playsInline: b,
    lock: b,
    fastForward: b,
    autoPlayback: b,
    autoOrientation: b,
    ads: [{
      url: s
    }],
    plugins: [f],
    whitelist: ["".concat(s, "|").concat(f, "|").concat(r)],
    layers: [ComponentOption],
    contextmenu: [ComponentOption],
    settings: [ComponentOption],
    controls: [_objectSpread$l(_objectSpread$l({}, ComponentOption), {}, {
      position: function position(value, _, paths) {
        var position = ['top', 'left', 'right'];
        return errorHandle(position.includes(value), "".concat(paths.join('.'), " only accept ").concat(position.toString(), " as parameters"));
      }
    })],
    quality: [{
      default: "?".concat(b),
      html: s,
      url: s
    }],
    highlight: [{
      time: n,
      text: s
    }],
    thumbnails: {
      url: s,
      number: n,
      column: n
    },
    subtitle: {
      url: s,
      type: s,
      style: o,
      encoding: s
    },
    moreVideoAttr: o,
    icons: o,
    customType: o
  };

  var config$1 = {
    propertys: ['audioTracks', 'autoplay', 'buffered', 'controller', 'controls', 'crossOrigin', 'currentSrc', 'currentTime', 'defaultMuted', 'defaultPlaybackRate', 'duration', 'ended', 'error', 'loop', 'mediaGroup', 'muted', 'networkState', 'paused', 'playbackRate', 'played', 'preload', 'readyState', 'seekable', 'seeking', 'src', 'startDate', 'textTracks', 'videoTracks', 'volume'],
    methods: ['addTextTrack', 'canPlayType', 'load', 'play', 'pause'],
    events: ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'],
    prototypes: ["width", "height", "videoWidth", "videoHeight", "poster", "webkitDecodedFrameCount", "webkitDroppedFrameCount", "playsInline", "webkitSupportsFullscreen", "webkitDisplayingFullscreen", "onenterpictureinpicture", "onleavepictureinpicture", "disablePictureInPicture", "cancelVideoFrameCallback", "requestVideoFrameCallback", "getVideoPlaybackQuality", "requestPictureInPicture", "webkitEnterFullScreen", "webkitEnterFullscreen", "webkitExitFullScreen", "webkitExitFullscreen"]
  };

  var Whitelist = /*#__PURE__*/function () {
    function Whitelist(art) {
      _classCallCheck(this, Whitelist);

      this.art = art;
    }

    _createClass(Whitelist, [{
      key: "state",
      get: function get() {
        var _this$art = this.art,
            option = _this$art.option,
            kindOf = _this$art.constructor.kindOf;
        return !isMobile || option.whitelist.some(function (item) {
          switch (kindOf(item)) {
            case 'string':
              return item === '*' || userAgent.indexOf(item) > -1;

            case 'function':
              return item(userAgent);

            case 'regexp':
              return item.test(userAgent);

            default:
              return false;
          }
        });
      }
    }]);

    return Whitelist;
  }();

  var Template = /*#__PURE__*/function () {
    function Template(art) {
      var _this = this;

      _classCallCheck(this, Template);

      this.art = art;
      var option = art.option,
          constructor = art.constructor,
          whitelist = art.whitelist;

      if (option.container instanceof Element) {
        this.$container = option.container;
      } else {
        this.$container = query(option.container);
        errorHandle(this.$container, "No container element found by ".concat(option.container));
      }

      var type = this.$container.tagName.toLowerCase();
      errorHandle(type === 'div', "Unsupported container element type, only support 'div' but got '".concat(type, "'"));
      errorHandle(constructor.instances.every(function (ins) {
        return ins.template.$container !== _this.$container;
      }), 'Cannot mount multiple instances on the same dom element');
      this.query = this.query.bind(this);
      this.$container.dataset.artId = art.id;
      this.$original = this.$container.cloneNode(true);

      if (whitelist.state) {
        this.desktop();
      } else {
        this.mobile();
      }
    }

    _createClass(Template, [{
      key: "query",
      value: function query$1(className) {
        return query(className, this.$container);
      }
    }, {
      key: "desktop",
      value: function desktop() {
        var option = this.art.option;

        if (!option.useSSR) {
          this.$container.innerHTML = Template.html;
        }

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
        this.$info = this.query('.art-info');
        this.$infoPanel = this.query('.art-info-panel');
        this.$infoClose = this.query('.art-info-close');
        this.$miniHeader = this.query('.art-mini-header');
        this.$miniTitle = this.query('.art-mini-title');
        this.$miniClose = this.query('.art-mini-close');
        this.$contextmenu = this.query('.art-contextmenus');

        if (option.backdrop) {
          addClass(this.$setting, 'art-backdrop-filter');
          addClass(this.$contextmenu, 'art-backdrop-filter');
          addClass(this.$info, 'art-backdrop-filter');
        }

        if (isMobile) {
          addClass(this.$player, 'art-mobile');
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
      value: function destroy(removeHtml) {
        if (removeHtml) {
          replaceElement(this.$original, this.$container);
        } else {
          addClass(this.$player, 'art-destroy');
        }
      }
    }], [{
      key: "html",
      get: function get() {
        return "\n          <div class=\"art-video-player art-subtitle-show art-layer-show\">\n            <video class=\"art-video\"></video>\n            <div class=\"art-poster\"></div>\n            <div class=\"art-subtitle\"></div>\n            <div class=\"art-danmuku\"></div>\n            <div class=\"art-layers\"></div>\n            <div class=\"art-mask\">\n              <div class=\"art-state\"></div>\n            </div>\n            <div class=\"art-bottom\">\n              <div class=\"art-progress\"></div>\n              <div class=\"art-controls\">\n                <div class=\"art-controls-left\"></div>\n                <div class=\"art-controls-right\"></div>\n              </div>\n            </div>\n            <div class=\"art-loading\"></div>\n            <div class=\"art-notice\">\n              <div class=\"art-notice-inner\"></div>\n            </div>\n            <div class=\"art-settings\"></div>\n            <div class=\"art-info\">\n              <div class=\"art-info-panel\">\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Player version:</div>\n                  <div class=\"art-info-content\">4.3.11</div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video url:</div>\n                  <div class=\"art-info-content\" data-video=\"src\"></div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video volume:</div>\n                  <div class=\"art-info-content\" data-video=\"volume\"></div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video time:</div>\n                  <div class=\"art-info-content\" data-video=\"currentTime\"></div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video duration:</div>\n                  <div class=\"art-info-content\" data-video=\"duration\"></div>\n                </div>\n                <div class=\"art-info-item\">\n                  <div class=\"art-info-title\">Video resolution:</div>\n                  <div class=\"art-info-content\">\n                    <span data-video=\"videoWidth\"></span> x <span data-video=\"videoHeight\"></span>\n                  </div>\n                </div>\n              </div>\n              <div class=\"art-info-close\">[x]</div>\n            </div>\n            <div class=\"art-mini-header\">\n              <div class=\"art-mini-title\"></div>\n              <div class=\"art-mini-close\">\xD7</div>\n            </div>\n            <div class=\"art-contextmenus\"></div>\n          </div>\n        ";
      }
    }]);

    return Template;
  }();

  var Close$1 = "关闭";
  var Volume$1 = "音量";
  var Play$1 = "播放";
  var Pause$1 = "暂停";
  var Rate$1 = "速度";
  var Mute$1 = "静音";
  var Horizontal$1 = "水平";
  var Vertical$1 = "垂直";
  var Reconnect$1 = "重新连接";
  var Screenshot$1 = "截图";
  var Default$1 = "默认";
  var Normal$1 = "正常";
  var Open$1 = "打开";
  var Fullscreen$1 = "全屏";
  var zhCn = {
  	"Video Info": "统计信息",
  	Close: Close$1,
  	"Video Load Failed": "加载失败",
  	Volume: Volume$1,
  	Play: Play$1,
  	Pause: Pause$1,
  	Rate: Rate$1,
  	Mute: Mute$1,
  	"Video Flip": "画面翻转",
  	Horizontal: Horizontal$1,
  	Vertical: Vertical$1,
  	Reconnect: Reconnect$1,
  	"Hide Subtitle": "隐藏字幕",
  	"Show Subtitle": "显示字幕",
  	"Show Setting": "显示设置",
  	"Hide Setting": "隐藏设置",
  	Screenshot: Screenshot$1,
  	"Play Speed": "播放速度",
  	"Aspect Ratio": "画面比例",
  	Default: Default$1,
  	Normal: Normal$1,
  	Open: Open$1,
  	"Switch Video": "切换",
  	"Switch Subtitle": "切换字幕",
  	Fullscreen: Fullscreen$1,
  	"Exit Fullscreen": "退出全屏",
  	"Web Fullscreen": "网页全屏",
  	"Exit Web Fullscreen": "退出网页全屏",
  	"Mini Player": "迷你播放器",
  	"PIP Mode": "画中画模式",
  	"Exit PIP Mode": "退出画中画模式",
  	"PIP Not Supported": "不支持画中画模式",
  	"Fullscreen Not Supported": "不支持全屏模式",
  	"Subtitle Offset": "字幕偏移",
  	"Auto playback at": "已为您定位至"
  };

  var Close = "關閉";
  var Volume = "音量";
  var Play = "播放";
  var Pause = "暫停";
  var Rate = "速度";
  var Mute = "靜音";
  var Horizontal = "水平";
  var Vertical = "垂直";
  var Reconnect = "重新連接";
  var Screenshot = "截圖";
  var Default = "默認";
  var Normal = "正常";
  var Open = "打開";
  var Fullscreen = "全屏";
  var zhTw = {
  	"Video Info": "統計訊息",
  	Close: Close,
  	"Video Load Failed": "載入失敗",
  	Volume: Volume,
  	Play: Play,
  	Pause: Pause,
  	Rate: Rate,
  	Mute: Mute,
  	"Video Flip": "畫面翻轉",
  	Horizontal: Horizontal,
  	Vertical: Vertical,
  	Reconnect: Reconnect,
  	"Hide Subtitle": "隱藏字幕",
  	"Show Subtitle": "顯示字幕",
  	"Show Setting": "顯示设置",
  	"Hide Setting": "隱藏设置",
  	Screenshot: Screenshot,
  	"Play Speed": "播放速度",
  	"Aspect Ratio": "畫面比例",
  	Default: Default,
  	Normal: Normal,
  	Open: Open,
  	"Switch Video": "切換",
  	"Switch Subtitle": "切換字幕",
  	Fullscreen: Fullscreen,
  	"Exit Fullscreen": "退出全屏",
  	"Web Fullscreen": "網頁全屏",
  	"Exit Web Fullscreen": "退出網頁全屏",
  	"Mini Player": "迷你播放器",
  	"PIP Mode": "畫中畫模式",
  	"Exit PIP Mode": "退出畫中畫模式",
  	"PIP Not Supported": "不支持畫中畫模式",
  	"Fullscreen Not Supported": "不支持全屏模式",
  	"Subtitle Offset": "字幕偏移",
  	"Auto playback at": "已為您定位至"
  };

  var I18n = /*#__PURE__*/function () {
    function I18n(art) {
      _classCallCheck(this, I18n);

      this.art = art;
      this.languages = {
        'zh-cn': zhCn,
        'zh-tw': zhTw
      };
      this.init();
    }

    _createClass(I18n, [{
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

  function urlMix(art) {
    var option = art.option,
        $video = art.template.$video;
    def(art, 'url', {
      get: function get() {
        return $video.currentSrc;
      },
      set: function set(url) {
        var typeName = option.type || getExt(url);
        var typeCallback = option.customType[typeName];

        if (typeName && typeCallback) {
          sleep().then(function () {
            art.loading.show = true;
            typeCallback.call(art, $video, url, art);
          });
        } else {
          if (art.url && art.url !== url) {
            art.once('video:canplay', function () {
              if (art.isReady) {
                art.emit('restart');
              }
            });
          }

          $video.src = url;
          art.option.url = url;
          art.emit('url', url);
        }
      }
    });
  }

  function attrMix(art) {
    var $video = art.template.$video;
    def(art, 'attr', {
      value: function value(key, _value) {
        if (_value === undefined) return $video[key];
        $video[key] = _value;
      }
    });
  }

  function playMix(art) {
    var i18n = art.i18n,
        notice = art.notice,
        option = art.option,
        instances = art.constructor.instances,
        $video = art.template.$video;
    def(art, 'play', {
      value: function value() {
        var promise = $video.play();

        if (promise && promise.then) {
          promise.then().catch(function (err) {
            notice.show = err;
            throw err;
          });
        }

        if (option.mutex) {
          for (var index = 0; index < instances.length; index++) {
            var instance = instances[index];

            if (instance !== art) {
              instance.pause();
            }
          }
        }

        notice.show = i18n.get('Play');
        art.emit('play');
        return promise;
      }
    });
  }

  function pauseMix(art) {
    var $video = art.template.$video,
        i18n = art.i18n,
        notice = art.notice;
    def(art, 'pause', {
      value: function value() {
        var result = $video.pause();
        notice.show = i18n.get('Pause');
        art.emit('pause');
        return result;
      }
    });
  }

  function toggleMix(art) {
    def(art, 'toggle', {
      value: function value() {
        if (art.playing) {
          return art.pause();
        } else {
          return art.play();
        }
      }
    });
  }

  function seekMix$1(art) {
    var notice = art.notice;
    def(art, 'seek', {
      set: function set(time) {
        art.currentTime = time;
        art.emit('seek', art.currentTime);

        if (art.duration) {
          notice.show = "".concat(secondToTime(art.currentTime), " / ").concat(secondToTime(art.duration));
        }
      }
    });
    def(art, 'forward', {
      set: function set(time) {
        art.seek = art.currentTime + time;
      }
    });
    def(art, 'backward', {
      set: function set(time) {
        art.seek = art.currentTime - time;
      }
    });
  }

  function volumeMix(art) {
    var $video = art.template.$video,
        i18n = art.i18n,
        notice = art.notice,
        storage = art.storage;
    def(art, 'volume', {
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
    def(art, 'muted', {
      get: function get() {
        return $video.muted;
      },
      set: function set(muted) {
        $video.muted = muted;
        art.emit('volume', $video.volume);
      }
    });
  }

  function currentTimeMix(art) {
    var $video = art.template.$video;
    def(art, 'currentTime', {
      get: function get() {
        return $video.currentTime || 0;
      },
      set: function set(time) {
        time = parseFloat(time);
        if (Number.isNaN(time)) return;
        $video.currentTime = clamp(time, 0, art.duration);
      }
    });
  }

  function durationMix(art) {
    def(art, 'duration', {
      get: function get() {
        var duration = art.template.$video.duration;
        if (duration === Infinity) return 0;
        return duration || 0;
      }
    });
  }

  function switchMix(art) {
    var i18n = art.i18n,
        option = art.option,
        notice = art.notice;

    function switchUrl(url, name, currentTime) {
      return new Promise(function (resolve) {
        if (url === art.url) return resolve(url);
        var playing = art.playing;
        art.pause();
        URL.revokeObjectURL(art.url);
        art.url = url;
        art.once('video:canplay', function () {
          art.playbackRate = false;
          art.aspectRatio = false;
          art.flip = 'normal';
          art.autoSize = option.autoSize;
          art.currentTime = currentTime;
          art.notice.show = '';

          if (playing) {
            art.play();
          }

          if (name) {
            notice.show = "".concat(i18n.get('Switch Video'), ": ").concat(name);
          }

          art.emit('switch', url);
          resolve(url);
        });
      });
    }

    def(art, 'switchQuality', {
      value: function value(url, name) {
        return switchUrl(url, name, art.currentTime);
      }
    });
    def(art, 'switchUrl', {
      value: function value(url, name) {
        return switchUrl(url, name, 0);
      }
    });
  }

  function playbackRateMix(art) {
    var $video = art.template.$video,
        i18n = art.i18n,
        notice = art.notice;
    def(art, 'playbackRate', {
      get: function get() {
        return $video.playbackRate;
      },
      set: function set(rate) {
        if (rate) {
          if (rate === $video.playbackRate) return;
          var rateList = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0, 4.0];
          errorHandle(rateList.includes(rate), "'playbackRate' only accept ".concat(rateList.toString(), " as parameters"));
          $video.playbackRate = rate;
          notice.show = "".concat(i18n.get('Rate'), ": ").concat(rate === 1.0 ? i18n.get('Normal') : "".concat(rate, "x"));
          art.emit('playbackRate', rate);
        } else {
          art.playbackRate = 1;
          art.emit('playbackRate');
        }
      }
    });
  }

  function aspectRatioMix(art) {
    var _art$template = art.template,
        $video = _art$template.$video,
        $player = _art$template.$player,
        i18n = art.i18n,
        notice = art.notice;
    def(art, 'aspectRatio', {
      get: function get() {
        return $player.dataset.aspectRatio || 'default';
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
          var ratioArray = ratio.split(':').map(Number);
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

        notice.show = "".concat(i18n.get('Aspect Ratio'), ": ").concat(ratio === 'default' ? i18n.get('Default') : ratio);
        art.emit('aspectRatio', ratio);
      }
    });
    def(art, 'aspectRatioReset', {
      set: function set(value) {
        if (value) {
          var aspectRatio = art.aspectRatio;
          art.aspectRatio = aspectRatio;
        }
      }
    });
  }

  function screenshotMix(art) {
    var option = art.option,
        notice = art.notice,
        $video = art.template.$video;
    var $canvas = document.createElement('canvas');
    def(art, 'getDataURL', {
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
    def(art, 'getBlobUrl', {
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
    def(art, 'screenshot', {
      value: function value() {
        return art.getDataURL().then(function (dataUri) {
          download(dataUri, "".concat(option.title || 'artplayer', "_").concat(secondToTime($video.currentTime), ".png"));
          art.emit('screenshot', dataUri);
          return dataUri;
        });
      }
    });
  }

  /* eslint-disable promise/prefer-await-to-then */

  const methodMap = [
  	[
  		'requestFullscreen',
  		'exitFullscreen',
  		'fullscreenElement',
  		'fullscreenEnabled',
  		'fullscreenchange',
  		'fullscreenerror',
  	],
  	// New WebKit
  	[
  		'webkitRequestFullscreen',
  		'webkitExitFullscreen',
  		'webkitFullscreenElement',
  		'webkitFullscreenEnabled',
  		'webkitfullscreenchange',
  		'webkitfullscreenerror',

  	],
  	// Old WebKit
  	[
  		'webkitRequestFullScreen',
  		'webkitCancelFullScreen',
  		'webkitCurrentFullScreenElement',
  		'webkitCancelFullScreen',
  		'webkitfullscreenchange',
  		'webkitfullscreenerror',

  	],
  	[
  		'mozRequestFullScreen',
  		'mozCancelFullScreen',
  		'mozFullScreenElement',
  		'mozFullScreenEnabled',
  		'mozfullscreenchange',
  		'mozfullscreenerror',
  	],
  	[
  		'msRequestFullscreen',
  		'msExitFullscreen',
  		'msFullscreenElement',
  		'msFullscreenEnabled',
  		'MSFullscreenChange',
  		'MSFullscreenError',
  	],
  ];

  const nativeAPI = (() => {
  	const unprefixedMethods = methodMap[0];
  	const returnValue = {};

  	for (const methodList of methodMap) {
  		const exitFullscreenMethod = methodList?.[1];
  		if (exitFullscreenMethod in document) {
  			for (const [index, method] of methodList.entries()) {
  				returnValue[unprefixedMethods[index]] = method;
  			}

  			return returnValue;
  		}
  	}

  	return false;
  })();

  const eventNameMap = {
  	change: nativeAPI.fullscreenchange,
  	error: nativeAPI.fullscreenerror,
  };

  // eslint-disable-next-line import/no-mutable-exports
  let screenfull = {
  	// eslint-disable-next-line default-param-last
  	request(element = document.documentElement, options) {
  		return new Promise((resolve, reject) => {
  			const onFullScreenEntered = () => {
  				screenfull.off('change', onFullScreenEntered);
  				resolve();
  			};

  			screenfull.on('change', onFullScreenEntered);

  			const returnPromise = element[nativeAPI.requestFullscreen](options);

  			if (returnPromise instanceof Promise) {
  				returnPromise.then(onFullScreenEntered).catch(reject);
  			}
  		});
  	},
  	exit() {
  		return new Promise((resolve, reject) => {
  			if (!screenfull.isFullscreen) {
  				resolve();
  				return;
  			}

  			const onFullScreenExit = () => {
  				screenfull.off('change', onFullScreenExit);
  				resolve();
  			};

  			screenfull.on('change', onFullScreenExit);

  			const returnPromise = document[nativeAPI.exitFullscreen]();

  			if (returnPromise instanceof Promise) {
  				returnPromise.then(onFullScreenExit).catch(reject);
  			}
  		});
  	},
  	toggle(element, options) {
  		return screenfull.isFullscreen ? screenfull.exit() : screenfull.request(element, options);
  	},
  	onchange(callback) {
  		screenfull.on('change', callback);
  	},
  	onerror(callback) {
  		screenfull.on('error', callback);
  	},
  	on(event, callback) {
  		const eventName = eventNameMap[event];
  		if (eventName) {
  			document.addEventListener(eventName, callback, false);
  		}
  	},
  	off(event, callback) {
  		const eventName = eventNameMap[event];
  		if (eventName) {
  			document.removeEventListener(eventName, callback, false);
  		}
  	},
  	raw: nativeAPI,
  };

  Object.defineProperties(screenfull, {
  	isFullscreen: {
  		get: () => Boolean(document[nativeAPI.fullscreenElement]),
  	},
  	element: {
  		enumerable: true,
  		get: () => document[nativeAPI.fullscreenElement] ?? undefined,
  	},
  	isEnabled: {
  		enumerable: true,
  		// Coerce to boolean in case of old WebKit.
  		get: () => Boolean(document[nativeAPI.fullscreenEnabled]),
  	},
  });

  if (!nativeAPI) {
  	screenfull = {isEnabled: false};
  }

  var screenfull$1 = screenfull;

  var nativeScreenfull = function nativeScreenfull(art) {
    var notice = art.notice,
        $player = art.template.$player;
    screenfull$1.on('change', function () {
      return art.emit('fullscreen', screenfull$1.isFullscreen);
    });
    def(art, 'fullscreen', {
      get: function get() {
        return screenfull$1.isFullscreen;
      },
      set: function set(value) {
        if (value) {
          screenfull$1.request($player).then(function () {
            addClass($player, 'art-fullscreen');
            art.aspectRatioReset = true;
            art.autoSize = false;
            art.emit('resize');
            art.emit('fullscreen', true);
            notice.show = '';
          });
        } else {
          screenfull$1.exit().then(function () {
            removeClass($player, 'art-fullscreen');
            art.aspectRatioReset = true;
            art.autoSize = art.option.autoSize;
            art.emit('resize');
            art.emit('fullscreen');
            notice.show = '';
          });
        }
      }
    });
  };

  var webkitScreenfull = function webkitScreenfull(art) {
    var notice = art.notice,
        $video = art.template.$video;
    def(art, 'fullscreen', {
      get: function get() {
        return $video.webkitDisplayingFullscreen;
      },
      set: function set(value) {
        if (value) {
          $video.webkitEnterFullscreen();
          art.emit('fullscreen', true);
          notice.show = '';
        } else {
          $video.webkitExitFullscreen();
          art.emit('fullscreen');
          notice.show = '';
        }
      }
    });
  };

  function fullscreenMix(art) {
    var i18n = art.i18n,
        notice = art.notice,
        $video = art.template.$video;
    art.once('video:loadedmetadata', function () {
      if (screenfull$1.isEnabled) {
        nativeScreenfull(art);
      } else if (document.fullscreenEnabled || $video.webkitSupportsFullscreen) {
        webkitScreenfull(art);
      } else {
        def(art, 'fullscreen', {
          get: function get() {
            return false;
          },
          set: function set() {
            notice.show = i18n.get('Fullscreen Not Supported');
          }
        });
      } // Asynchronous setting


      def(art, 'fullscreen', get(art, 'fullscreen'));
    });
  }

  function fullscreenWebMix(art) {
    var notice = art.notice,
        $player = art.template.$player;
    def(art, 'fullscreenWeb', {
      get: function get() {
        return hasClass($player, 'art-fullscreen-web');
      },
      set: function set(value) {
        if (value) {
          addClass($player, 'art-fullscreen-web');
          art.aspectRatioReset = true;
          art.autoSize = false;
          art.emit('resize');
          art.emit('fullscreenWeb', true);
          notice.show = '';
        } else {
          removeClass($player, 'art-fullscreen-web');
          art.aspectRatioReset = true;
          art.autoSize = art.option.autoSize;
          art.emit('resize');
          art.emit('fullscreenWeb');
          notice.show = '';
        }
      }
    });
  }

  function nativePip(art) {
    var $video = art.template.$video,
        proxy = art.events.proxy,
        notice = art.notice;
    $video.disablePictureInPicture = false;
    def(art, 'pip', {
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

  function webkitPip(art) {
    var $video = art.template.$video;
    $video.webkitSetPresentationMode('inline');
    def(art, 'pip', {
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

  function pipMix(art) {
    var i18n = art.i18n,
        notice = art.notice,
        $video = art.template.$video;

    if (document.pictureInPictureEnabled) {
      nativePip(art);
    } else if ($video.webkitSupportsPresentationMode) {
      webkitPip(art);
    } else {
      def(art, 'pip', {
        get: function get() {
          return false;
        },
        set: function set() {
          notice.show = i18n.get('PIP Not Supported');
        }
      });
    }
  }

  function seekMix(art) {
    var $video = art.template.$video;
    def(art, 'loaded', {
      get: function get() {
        return art.loadedTime / $video.duration;
      }
    });
    def(art, 'loadedTime', {
      get: function get() {
        return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0;
      }
    });
  }

  function playedMix(art) {
    def(art, 'played', {
      get: function get() {
        return art.currentTime / art.duration;
      }
    });
  }

  function playingMix(art) {
    var $video = art.template.$video;
    def(art, 'playing', {
      get: function get() {
        return !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2);
      }
    });
  }

  function resizeMix(art) {
    var _art$template = art.template,
        $container = _art$template.$container,
        $player = _art$template.$player,
        $video = _art$template.$video;
    def(art, 'autoSize', {
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
            width: art.width,
            height: art.height
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

  function rectMix(art) {
    def(art, 'rect', {
      get: function get() {
        return art.template.$player.getBoundingClientRect();
      }
    });
    var keys = ['bottom', 'height', 'left', 'right', 'top', 'width'];

    var _loop = function _loop(index) {
      var key = keys[index];
      def(art, key, {
        get: function get() {
          return art.rect[key];
        }
      });
    };

    for (var index = 0; index < keys.length; index++) {
      _loop(index);
    }

    def(art, 'x', {
      get: function get() {
        return art.left + window.pageXOffset;
      }
    });
    def(art, 'y', {
      get: function get() {
        return art.top + window.pageYOffset;
      }
    });
  }

  function flipMix(art) {
    var $player = art.template.$player,
        i18n = art.i18n,
        notice = art.notice;
    def(art, 'flip', {
      get: function get() {
        return $player.dataset.flip || 'normal';
      },
      set: function set(flip) {
        if (!flip) flip = 'normal';
        var flipList = ['normal', 'horizontal', 'vertical'];
        errorHandle(flipList.includes(flip), "'flip' only accept ".concat(flipList.toString(), " as parameters"));

        if (flip === 'normal') {
          delete $player.dataset.flip;
        } else {
          art.rotate = false;
          $player.dataset.flip = flip;
        }

        var word = flip.replace(flip[0], flip[0].toUpperCase());
        notice.show = "".concat(i18n.get('Video Flip'), ": ").concat(i18n.get(word));
        art.emit('flip', flip);
      }
    });
  }

  function miniMix(art) {
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
      lastPlayerLeft = art.left;
      lastPlayerTop = art.top;
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
      art.mini = false;
      isDroging = false;
      removeClass($player, 'art-is-dragging');
    });
    append($miniTitle, option.title || i18n.get('Mini Player'));
    def(art, 'mini', {
      get: function get() {
        return hasClass($player, 'art-mini');
      },
      set: function set(value) {
        if (value) {
          art.autoSize = false;
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
              art.mini = true;
            }
          } else {
            var $body = document.body;

            var _top = $body.clientHeight - art.height - 50;

            var _left = $body.clientWidth - art.width - 50;

            storage.set('top', _top);
            storage.set('left', _left);
            setStyle($player, 'top', "".concat(_top, "px"));
            setStyle($player, 'left', "".concat(_left, "px"));
          }

          art.aspectRatio = false;
          art.playbackRate = false;
          art.notice.show = '';
          art.emit('mini', true);
        } else {
          $player.style.cssText = cacheStyle;
          removeClass($player, 'art-mini');
          setStyle($player, 'top', null);
          setStyle($player, 'left', null);
          art.aspectRatio = false;
          art.playbackRate = false;
          art.autoSize = option.autoSize;
          art.notice.show = '';
          art.emit('mini');
        }
      }
    });
  }

  function loopMix(art) {
    var interval = [];
    def(art, 'loop', {
      get: function get() {
        return interval;
      },
      set: function set(value) {
        if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
          var start = clamp(value[0], 0, Math.min(value[1], art.duration));
          var end = clamp(value[1], start, art.duration);

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
        if (art.currentTime < interval[0] || art.currentTime > interval[1]) {
          art.seek = interval[0];
        }
      }
    });
  }

  function posterMix(art) {
    var option = art.option,
        $poster = art.template.$poster;
    def(art, 'poster', {
      get: function get() {
        return option.poster;
      },
      set: function set(url) {
        option.poster = url;
        setStyle($poster, 'backgroundImage', "url(".concat(url, ")"));
      }
    });
  }

  function autoHeightMix(art) {
    var option = art.option,
        _art$template = art.template,
        $container = _art$template.$container,
        $video = _art$template.$video;
    var heightCache = $container.style.height;
    def(art, 'autoHeight', {
      get: function get() {
        return hasClass($container, 'art-auto-height');
      },
      set: function set(value) {
        if (value) {
          var clientWidth = $container.clientWidth;
          var videoHeight = $video.videoHeight,
              videoWidth = $video.videoWidth;
          var height = videoHeight * (clientWidth / videoWidth);
          setStyle($container, 'height', height + 'px');
          addClass($container, 'art-auto-height');
          art.autoSize = option.autoSize;
          art.emit('autoHeight', height);
        } else {
          setStyle($container, 'height', heightCache);
          removeClass($container, 'art-auto-height');
          art.autoSize = option.autoSize;
          art.emit('autoHeight');
        }
      }
    });
  }

  function themeMix(art) {
    var option = art.option,
        $player = art.template.$player;
    def(art, 'theme', {
      get: function get() {
        return getComputedStyle($player).getPropertyValue('--theme');
      },
      set: function set(theme) {
        option.theme = theme;
        $player.style.setProperty('--theme', theme);
      }
    });
  }

  function titleMix(art) {
    def(art, 'title', {
      get: function get() {
        return art.option.title;
      },
      set: function set(title) {
        art.option.title = title;
      }
    });
  }

  function exclusiveMix(art) {
    var sizeProps = ['mini', 'pip', 'fullscreen', 'fullscreenWeb'];

    function exclusive(props) {
      var _loop = function _loop(index) {
        var name = props[index];
        art.on(name, function () {
          if (art[name]) {
            props.filter(function (item) {
              return item !== name;
            }).forEach(function (item) {
              if (art[item]) {
                art[item] = false;
              }
            });
          }
        });
      };

      for (var index = 0; index < props.length; index++) {
        _loop(index);
      }
    }

    exclusive(sizeProps);
    def(art, 'normalSize', {
      get: function get() {
        return sizeProps.every(function (name) {
          return !art[name];
        });
      }
    });
  }

  function subtitleOffsetMix(art) {
    var clamp = art.constructor.utils.clamp;
    var notice = art.notice,
        template = art.template,
        i18n = art.i18n;
    var offsetCache = 0;
    var cuesCache = [];
    art.on('subtitle:switch', function () {
      cuesCache = [];
    });
    def(art, 'subtitleOffset', {
      get: function get() {
        return offsetCache;
      },
      set: function set(value) {
        if (template.$track && template.$track.track) {
          var cues = Array.from(template.$track.track.cues);
          offsetCache = clamp(value, -5, 5);

          for (var index = 0; index < cues.length; index++) {
            var cue = cues[index];

            if (!cuesCache[index]) {
              cuesCache[index] = {
                startTime: cue.startTime,
                endTime: cue.endTime
              };
            }

            cue.startTime = clamp(cuesCache[index].startTime + offsetCache, 0, art.duration);
            cue.endTime = clamp(cuesCache[index].endTime + offsetCache, 0, art.duration);
          }

          art.subtitle.update();
          notice.show = "".concat(i18n.get('Subtitle Offset'), ": ").concat(value, "s");
          art.emit('subtitleOffset', value);
        } else {
          art.emit('subtitleOffset', 0);
        }
      }
    });
  }

  function attrInit(art) {
    var option = art.option,
        storage = art.storage,
        _art$template = art.template,
        $video = _art$template.$video,
        $poster = _art$template.$poster;
    Object.keys(option.moreVideoAttr).forEach(function (key) {
      art.attr(key, option.moreVideoAttr[key]);
    });

    if (option.muted) {
      art.muted = option.muted;
    }

    if (option.volume) {
      $video.volume = clamp(option.volume, 0, 1);
    }

    var volumeStorage = storage.get('volume');

    if (typeof volumeStorage === 'number') {
      $video.volume = clamp(volumeStorage, 0, 1);
    }

    if (option.poster) {
      setStyle($poster, 'backgroundImage', "url(".concat(option.poster, ")"));
    }

    if (option.autoplay) {
      $video.autoplay = option.autoplay;
    }

    if (option.playsInline) {
      $video.playsInline = true;
      $video['webkit-playsinline'] = true;
    }

    if (option.theme) {
      art.theme = option.theme;
    }

    if (option.ads.length === 0) {
      art.url = option.url;
    }
  }

  function eventInit(art) {
    var i18n = art.i18n,
        notice = art.notice,
        option = art.option,
        constructor = art.constructor,
        proxy = art.events.proxy,
        _art$template = art.template,
        $player = _art$template.$player,
        $video = _art$template.$video,
        $poster = _art$template.$poster;
    var reconnectTime = 0;

    for (var index = 0; index < config$1.events.length; index++) {
      proxy($video, config$1.events[index], function (event) {
        art.emit("video:".concat(event.type), event);
      });
    } // art.on('video:abort', () => {
    // });


    art.on('video:canplay', function () {
      reconnectTime = 0;
      art.loading.show = false;
    });
    art.once('video:canplay', function () {
      art.loading.show = false;
      art.controls.show = true;
      art.mask.show = true;
      art.isReady = true;
      art.emit('ready');
    }); // art.on('video:canplaythrough', () => {
    // });
    // art.on('video:durationchange', () => {
    // });
    // art.on('video:emptied', () => {
    // });

    art.on('video:ended', function () {
      if (option.loop) {
        art.seek = 0;
        art.play();
        art.controls.show = false;
        art.mask.show = false;
      } else {
        art.controls.show = true;
        art.mask.show = true;
      }
    });
    art.on('video:error', function () {
      if (reconnectTime < constructor.RECONNECT_TIME_MAX) {
        sleep(constructor.RECONNECT_SLEEP_TIME).then(function () {
          reconnectTime += 1;
          art.url = option.url;
          notice.show = "".concat(i18n.get('Reconnect'), ": ").concat(reconnectTime);
          art.emit('error', reconnectTime);
        });
      } else {
        art.loading.show = false;
        art.controls.show = false;
        addClass($player, 'art-error');
        sleep(constructor.RECONNECT_SLEEP_TIME).then(function () {
          notice.show = i18n.get('Video Load Failed');
          art.destroy(false);
        });
      }
    }); // art.on('video:loadeddata', () => {
    // });

    art.once('video:loadedmetadata', function () {
      art.autoSize = option.autoSize;

      if (isMobile) {
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

  var Player = /*#__PURE__*/_createClass(function Player(art) {
    _classCallCheck(this, Player);

    urlMix(art);
    attrMix(art);
    playMix(art);
    pauseMix(art);
    toggleMix(art);
    seekMix$1(art);
    volumeMix(art);
    currentTimeMix(art);
    durationMix(art);
    switchMix(art);
    playbackRateMix(art);
    aspectRatioMix(art);
    screenshotMix(art);
    fullscreenMix(art);
    fullscreenWebMix(art);
    pipMix(art);
    seekMix(art);
    playedMix(art);
    playingMix(art);
    resizeMix(art);
    rectMix(art);
    flipMix(art);
    miniMix(art);
    loopMix(art);
    posterMix(art);
    autoHeightMix(art);
    themeMix(art);
    titleMix(art);
    exclusiveMix(art);
    subtitleOffsetMix(art);
    eventInit(art);
    attrInit(art);
  });

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get() {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(arguments.length < 3 ? target : receiver);
        }

        return desc.value;
      };
    }

    return _get.apply(this, arguments);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var runtime = {exports: {}};

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  (function (module) {
  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    define(Gp, "constructor", GeneratorFunctionPrototype);
    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    });
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    define(Gp, iteratorSymbol, function() {
      return this;
    });

    define(Gp, "toString", function() {
      return "[object Generator]";
    });

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, in modern engines
    // we can explicitly access globalThis. In older engines we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }
  }(runtime));

  var regenerator = runtime.exports;

  var Component = /*#__PURE__*/function () {
    function Component(art) {
      _classCallCheck(this, Component);

      this.id = 0;
      this.art = art;
      this.add = this.add.bind(this);
    }

    _createClass(Component, [{
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
    }, {
      key: "add",
      value: function add(getOption) {
        var _this = this;

        var option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        option.html = option.html || '';
        validator(option, ComponentOption);
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

        def(this, name, {
          value: $ref
        });
        return $ref;
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
        var list = option.selector.map(function (item, index) {
          return "<div class=\"art-selector-item ".concat(item.default ? 'art-current' : '', "\" data-index=\"").concat(index, "\">").concat(item.html, "</div>");
        }).join('');
        var $list = document.createElement('div');
        addClass($list, 'art-selector-list');
        append($list, list);
        append($ref, $list);

        var setLeft = function setLeft() {
          var left = getStyle($ref, 'width') / 2 - getStyle($list, 'width') / 2;
          $list.style.left = "".concat(left, "px");
        };

        hover($ref, setLeft);
        proxy($list, 'click', /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(event) {
            var path, $item, index, find, result;
            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    path = event.composedPath() || [];
                    $item = path.find(function (item) {
                      return hasClass(item, 'art-selector-item');
                    });

                    if ($item) {
                      _context.next = 4;
                      break;
                    }

                    return _context.abrupt("return");

                  case 4:
                    inverseClass($item, 'art-current');
                    index = Number($item.dataset.index);
                    find = option.selector[index] || {};
                    $value.innerText = $item.innerText;

                    if (!option.onSelect) {
                      _context.next = 13;
                      break;
                    }

                    _context.next = 11;
                    return option.onSelect.call(_this2.art, find, $item, event);

                  case 11:
                    result = _context.sent;

                    if (typeof result === 'string' || typeof result === 'number') {
                      $value.innerHTML = result;
                    }

                  case 13:
                    setLeft();

                    _this2.art.emit('selector', find, $item);

                  case 15:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      }
    }]);

    return Component;
  }();

  function ownKeys$k(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$k(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$k(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$k(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function fullscreen$1(option) {
    return function (art) {
      return _objectSpread$k(_objectSpread$k({}, option), {}, {
        tooltip: art.i18n.get('Fullscreen'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n;
          append($control, icons.fullscreen);
          proxy($control, 'click', function () {
            art.fullscreen = !art.fullscreen;
          });
          art.on('fullscreen', function (value) {
            tooltip($control, i18n.get(value ? 'Exit Fullscreen' : 'Fullscreen'));
          });
        }
      });
    };
  }

  function ownKeys$j(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$j(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$j(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$j(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function fullscreenWeb$1(option) {
    return function (art) {
      return _objectSpread$j(_objectSpread$j({}, option), {}, {
        tooltip: art.i18n.get('Web Fullscreen'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n;
          append($control, icons.fullscreenWeb);
          proxy($control, 'click', function () {
            art.fullscreenWeb = !art.fullscreenWeb;
          });
          art.on('fullscreenWeb', function (value) {
            tooltip($control, i18n.get(value ? 'Exit Web Fullscreen' : 'Web Fullscreen'));
          });
        }
      });
    };
  }

  function ownKeys$i(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$i(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$i(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$i(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function pip$1(option) {
    return function (art) {
      return _objectSpread$i(_objectSpread$i({}, option), {}, {
        tooltip: art.i18n.get('PIP Mode'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n;
          append($control, icons.pip);
          proxy($control, 'click', function () {
            art.pip = !art.pip;
          });
          art.on('pip', function (value) {
            tooltip($control, i18n.get(value ? 'Exit PIP Mode' : 'PIP Mode'));
          });
        }
      });
    };
  }

  function ownKeys$h(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$h(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$h(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$h(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function playAndPause(option) {
    return function (art) {
      return _objectSpread$h(_objectSpread$h({}, option), {}, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n;
          var $play = append($control, icons.play);
          var $pause = append($control, icons.pause);
          tooltip($play, i18n.get('Play'));
          tooltip($pause, i18n.get('Pause'));
          proxy($play, 'click', function () {
            art.play();
          });
          proxy($pause, 'click', function () {
            art.pause();
          });

          function showPlay() {
            setStyle($play, 'display', 'flex');
            setStyle($pause, 'display', 'none');
          }

          function showPause() {
            setStyle($play, 'display', 'none');
            setStyle($pause, 'display', 'flex');
          }

          if (art.playing) {
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

  function ownKeys$g(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$g(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$g(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$g(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function getPosFromEvent(art, event) {
    var $progress = art.template.$progress;

    var _$progress$getBoundin = $progress.getBoundingClientRect(),
        left = _$progress$getBoundin.left;

    var eventLeft = event.pageX;
    var width = clamp(eventLeft - left, 0, $progress.clientWidth);
    var second = width / $progress.clientWidth * art.duration;
    var time = secondToTime(second);
    var percentage = clamp(width / $progress.clientWidth, 0, 1);
    return {
      second: second,
      time: time,
      width: width,
      percentage: percentage
    };
  }
  function progress(options) {
    return function (art) {
      var icons = art.icons,
          option = art.option,
          proxy = art.events.proxy;
      return _objectSpread$g(_objectSpread$g({}, options), {}, {
        html: "\n                <div class=\"art-control-progress-inner\">\n                    <div class=\"art-progress-loaded\"></div>\n                    <div class=\"art-progress-played\"></div>\n                    <div class=\"art-progress-highlight\"></div>\n                    <div class=\"art-progress-indicator\"></div>\n                    <div class=\"art-progress-tip\"></div>\n                </div>\n            ",
        mounted: function mounted($control) {
          var isDroging = false;
          var $loaded = query('.art-progress-loaded', $control);
          var $played = query('.art-progress-played', $control);
          var $highlight = query('.art-progress-highlight', $control);
          var $indicator = query('.art-progress-indicator', $control);
          var $tip = query('.art-progress-tip', $control);
          setStyle($played, 'backgroundColor', 'var(--theme)');
          var indicatorSize = art.constructor.INDICATOR_SIZE;

          if (icons.indicator) {
            indicatorSize = art.constructor.INDICATOR_SIZE_ICON;
            append($indicator, icons.indicator);
          } else {
            setStyles($indicator, {
              backgroundColor: 'var(--theme)'
            });
          }

          if (isMobile) {
            indicatorSize = art.constructor.INDICATOR_SIZE_MOBILE;

            if (icons.indicator) {
              indicatorSize = art.constructor.INDICATOR_SIZE_MOBILE_ICON;
            }
          }

          setStyles($indicator, {
            left: "-".concat(indicatorSize / 2, "px"),
            width: "".concat(indicatorSize, "px"),
            height: "".concat(indicatorSize, "px")
          });

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
              setStyle($indicator, 'left', "calc(".concat(percentage * 100, "% - ").concat(indicatorSize / 2, "px)"));
            }
          }

          for (var index = 0; index < option.highlight.length; index++) {
            var item = option.highlight[index];
            var left = clamp(item.time, 0, art.duration) / art.duration * 100;
            append($highlight, "<span data-text=\"".concat(item.text, "\" data-time=\"").concat(item.time, "\" style=\"left: ").concat(left, "%\"></span>"));
          }

          setBar('loaded', art.loaded);
          art.on('setBar', function (type, percentage) {
            setBar(type, percentage);
          });
          art.on('video:progress', function () {
            setBar('loaded', art.loaded);
          });
          art.on('video:timeupdate', function () {
            setBar('played', art.played);
          });
          art.on('video:ended', function () {
            setBar('played', 1);
          });

          if (!isMobile) {
            proxy($control, 'click', function (event) {
              if (event.target !== $indicator) {
                var _getPosFromEvent3 = getPosFromEvent(art, event),
                    second = _getPosFromEvent3.second,
                    percentage = _getPosFromEvent3.percentage;

                setBar('played', percentage);
                art.seek = second;
              }
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
            proxy($indicator, 'mousedown', function () {
              isDroging = true;
            });
            proxy(document, 'mousemove', function (event) {
              if (isDroging) {
                var _getPosFromEvent4 = getPosFromEvent(art, event),
                    second = _getPosFromEvent4.second,
                    percentage = _getPosFromEvent4.percentage;

                setBar('played', percentage);
                art.seek = second;
              }
            });
            proxy(document, 'mouseup', function () {
              if (isDroging) {
                isDroging = false;
              }
            });
          }
        }
      });
    };
  }

  function ownKeys$f(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$f(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$f(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$f(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function subtitle$1(option) {
    return function (art) {
      return _objectSpread$f(_objectSpread$f({}, option), {}, {
        tooltip: art.i18n.get('Hide Subtitle'),
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
            tooltip($control, i18n.get(value ? 'Hide Subtitle' : 'Show Subtitle'));
          });
        }
      });
    };
  }

  function ownKeys$e(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$e(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$e(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$e(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function time(option) {
    return function (art) {
      return _objectSpread$e(_objectSpread$e({}, option), {}, {
        mounted: function mounted($control) {
          function getTime() {
            var newTime = "".concat(secondToTime(art.currentTime), " / ").concat(secondToTime(art.duration));

            if (newTime !== $control.innerText) {
              $control.innerText = newTime;
            }
          }

          getTime();
          var events = ['video:loadedmetadata', 'video:timeupdate', 'video:progress'];

          for (var index = 0; index < events.length; index++) {
            art.on(events[index], getTime);
          }
        }
      });
    };
  }

  function ownKeys$d(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$d(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$d(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$d(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function volume$1(option) {
    return function (art) {
      return _objectSpread$d(_objectSpread$d({}, option), {}, {
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons,
              i18n = art.i18n;
          var isDroging = false;
          var panelWidth = art.constructor.VOLUME_PANEL_WIDTH;
          var handleWidth = art.constructor.VOLUME_HANDLE_WIDTH;
          var $volume = append($control, icons.volume);
          var $volumeClose = append($control, icons.volumeClose);
          var $volumePanel = append($control, '<div class="art-volume-panel"></div>');
          var $volumeHandle = append($volumePanel, '<div class="art-volume-slider-handle"></div>');
          tooltip($volume, i18n.get('Mute'));
          setStyle($volumeClose, 'display', 'none');

          if (isMobile) {
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

            if (art.muted || percentage === 0) {
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

          setVolumeHandle(art.volume);
          art.on('video:volumechange', function () {
            setVolumeHandle(art.volume);
          });
          proxy($volume, 'click', function () {
            art.muted = true;
          });
          proxy($volumeClose, 'click', function () {
            art.muted = false;
          });
          proxy($volumePanel, 'click', function (event) {
            art.muted = false;
            art.volume = volumeChangeFromEvent(event);
          });
          proxy($volumeHandle, 'mousedown', function () {
            isDroging = true;
          });
          proxy($control, 'mousemove', function (event) {
            if (isDroging) {
              art.muted = false;
              art.volume = volumeChangeFromEvent(event);
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

  function ownKeys$c(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$c(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$c(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function setting$1(option) {
    return function (art) {
      return _objectSpread$c(_objectSpread$c({}, option), {}, {
        tooltip: art.i18n.get('Show Setting'),
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
            tooltip($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'));
          });
        }
      });
    };
  }

  function ownKeys$b(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$b(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$b(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function thumbnails(options) {
    return function (art) {
      return _objectSpread$b(_objectSpread$b({}, options), {}, {
        mounted: function mounted($control) {
          var option = art.option,
              _art$template = art.template,
              $progress = _art$template.$progress,
              $video = _art$template.$video,
              _art$events = art.events,
              proxy = _art$events.proxy,
              loadImg = _art$events.loadImg;
          var image = null;
          var loading = false;
          var isLoad = false;

          function showThumbnails(event) {
            var _getPosFromEvent = getPosFromEvent(art, event),
                posWidth = _getPosFromEvent.width;

            var _option$thumbnails = option.thumbnails,
                url = _option$thumbnails.url,
                number = _option$thumbnails.number,
                column = _option$thumbnails.column;
            var width = image.naturalWidth / column;
            var height = width / ($video.videoWidth / $video.videoHeight);
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
              loadImg(option.thumbnails.url).then(function (img) {
                image = img;
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

  function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$a(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$a(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function screenshot$1(option) {
    return function (art) {
      return _objectSpread$a(_objectSpread$a({}, option), {}, {
        tooltip: art.i18n.get('Screenshot'),
        mounted: function mounted($control) {
          var proxy = art.events.proxy,
              icons = art.icons;
          append($control, icons.screenshot);
          proxy($control, 'click', function () {
            art.screenshot();
          });
        }
      });
    };
  }

  function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$9(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function quality(option) {
    return function (art) {
      var qualityOption = art.option.quality;
      var qualityDefault = qualityOption.find(function (item) {
        return item.default;
      }) || qualityOption[0];
      return _objectSpread$9(_objectSpread$9({}, option), {}, {
        html: qualityDefault ? qualityDefault.html : '',
        selector: qualityOption,
        onSelect: function onSelect(item) {
          art.switchQuality(item.url, item.html);
        }
      });
    };
  }

  function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$8(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function loop(option) {
    return function (art) {
      return _objectSpread$8(_objectSpread$8({}, option), {}, {
        mounted: function mounted($control) {
          var $left = append($control, "<span class=\"art-loop-point\"></span>");
          var $right = append($control, "<span class=\"art-loop-point\"></span>");
          art.on('loop', function (value) {
            if (value) {
              setStyle($control, 'display', 'block');
              setStyle($left, 'left', "calc(".concat(value[0] / art.duration * 100, "% - ").concat($left.clientWidth, "px)"));
              setStyle($right, 'left', "".concat(value[1] / art.duration * 100, "%"));
            } else {
              setStyle($control, 'display', 'none');
            }
          });
        }
      });
    };
  }

  function _createSuper$8(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$8(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$8() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var Control = /*#__PURE__*/function (_Component) {
    _inherits(Control, _Component);

    var _super = _createSuper$8(Control);

    function Control(art) {
      var _this;

      _classCallCheck(this, Control);

      _this = _super.call(this, art);
      _this.name = 'control';
      var option = art.option,
          constructor = art.constructor,
          proxy = art.events.proxy,
          $player = art.template.$player;
      var activeTime = Date.now();
      proxy($player, ['click', 'mousemove', 'touchstart', 'touchmove'], function () {
        _this.show = true;
        removeClass($player, 'art-hide-cursor');
        addClass($player, 'art-hover');
        activeTime = Date.now();
      });
      art.on('video:timeupdate', function () {
        if (art.playing && _this.show && Date.now() - activeTime >= constructor.CONTROL_HIDE_TIME) {
          _this.show = false;
          addClass($player, 'art-hide-cursor');
          removeClass($player, 'art-hover');
        }
      });
      art.once('video:loadedmetadata', function () {
        _this.add(progress({
          name: 'progress',
          disable: option.isLive,
          position: 'top',
          index: 10
        }));

        _this.add(thumbnails({
          name: 'thumbnails',
          disable: !option.thumbnails.url || option.isLive || isMobile,
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

        _this.add(volume$1({
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

        _this.add(screenshot$1({
          name: 'screenshot',
          disable: !option.screenshot || isMobile,
          position: 'right',
          index: 20
        }));

        _this.add(subtitle$1({
          name: 'subtitle',
          disable: !option.subtitle.url,
          position: 'right',
          index: 30
        }));

        _this.add(setting$1({
          name: 'setting',
          disable: !option.setting,
          position: 'right',
          index: 40
        }));

        _this.add(pip$1({
          name: 'pip',
          disable: !option.pip,
          position: 'right',
          index: 50
        }));

        _this.add(fullscreenWeb$1({
          name: 'fullscreenWeb',
          disable: !option.fullscreenWeb,
          position: 'right',
          index: 60
        }));

        _this.add(fullscreen$1({
          name: 'fullscreen',
          disable: !option.fullscreen,
          position: 'right',
          index: 70
        }));

        for (var index = 0; index < option.controls.length; index++) {
          _this.add(option.controls[index]);
        }
      });
      return _this;
    }

    _createClass(Control, [{
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

        _get(_getPrototypeOf(Control.prototype), "add", this).call(this, option);
      }
    }]);

    return Control;
  }(Component);

  function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$7(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function playbackRate$2(option) {
    return function (art) {
      var i18n = art.i18n;
      return _objectSpread$7(_objectSpread$7({}, option), {}, {
        html: "".concat(i18n.get('Play Speed'), ":\n                <span data-value=\"0.5\">0.5</span>\n                <span data-value=\"0.75\">0.75</span>\n                <span data-value=\"1.0\" class=\"art-current\">").concat(i18n.get('Normal'), "</span>\n                <span data-value=\"1.25\">1.25</span>\n                <span data-value=\"1.5\">1.5</span>\n                <span data-value=\"2.0\">2.0</span>\n            "),
        click: function click(contextmenu, event) {
          var value = event.target.dataset.value;

          if (value) {
            art.playbackRate = Number(value);
            contextmenu.show = false;
          }
        },
        mounted: function mounted($panel) {
          art.on('playbackRate', function (value) {
            var $current = queryAll('span', $panel).find(function (item) {
              return Number(item.dataset.value) === value;
            });

            if ($current) {
              inverseClass($current, 'art-current');
            }
          });
        }
      });
    };
  }

  function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$6(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function aspectRatio$2(option) {
    return function (art) {
      var i18n = art.i18n;
      return _objectSpread$6(_objectSpread$6({}, option), {}, {
        html: "".concat(i18n.get('Aspect Ratio'), ":\n                <span data-value=\"default\" class=\"art-current\">").concat(i18n.get('Default'), "</span>\n                <span data-value=\"4:3\">4:3</span>\n                <span data-value=\"16:9\">16:9</span>\n            "),
        click: function click(contextmenu, event) {
          var value = event.target.dataset.value;

          if (value) {
            art.aspectRatio = value;
            contextmenu.show = false;
          }
        },
        mounted: function mounted($panel) {
          art.on('aspectRatio', function (value) {
            var $current = queryAll('span', $panel).find(function (item) {
              return item.dataset.value === value;
            });

            if ($current) {
              inverseClass($current, 'art-current');
            }
          });
        }
      });
    };
  }

  function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$5(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function flip$1(option) {
    return function (art) {
      var i18n = art.i18n;
      return _objectSpread$5(_objectSpread$5({}, option), {}, {
        html: "".concat(i18n.get('Video Flip'), ":\n                <span data-value=\"normal\" class=\"art-current\">").concat(i18n.get('Normal'), "</span>\n                <span data-value=\"horizontal\">").concat(i18n.get('Horizontal'), "</span>\n                <span data-value=\"vertical\">").concat(i18n.get('Vertical'), "</span>\n            "),
        click: function click(contextmenu, event) {
          var value = event.target.dataset.value;

          if (value) {
            art.flip = value;
            contextmenu.show = false;
          }
        },
        mounted: function mounted($panel) {
          art.on('flip', function (value) {
            var $current = queryAll('span', $panel).find(function (item) {
              return item.dataset.value === value;
            });

            if ($current) {
              inverseClass($current, 'art-current');
            }
          });
        }
      });
    };
  }

  function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$4(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function info(option) {
    return function (art) {
      return _objectSpread$4(_objectSpread$4({}, option), {}, {
        html: art.i18n.get('Video Info'),
        click: function click(contextmenu) {
          art.info.show = true;
          contextmenu.show = false;
        }
      });
    };
  }

  function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function version(option) {
    return _objectSpread$3(_objectSpread$3({}, option), {}, {
      html: '<a href="https://artplayer.org" target="_blank">ArtPlayer 4.3.11</a>'
    });
  }

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function close(option) {
    return function (art) {
      return _objectSpread$2(_objectSpread$2({}, option), {}, {
        html: art.i18n.get('Close'),
        click: function click(contextmenu) {
          contextmenu.show = false;
        }
      });
    };
  }

  function _createSuper$7(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$7(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$7() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var Contextmenu = /*#__PURE__*/function (_Component) {
    _inherits(Contextmenu, _Component);

    var _super = _createSuper$7(Contextmenu);

    function Contextmenu(art) {
      var _this;

      _classCallCheck(this, Contextmenu);

      _this = _super.call(this, art);
      _this.art = art;
      _this.name = 'contextmenu';
      _this.$parent = art.template.$contextmenu;
      art.once('video:loadedmetadata', function () {
        if (!isMobile) {
          _this.init();
        }
      });
      return _this;
    }

    _createClass(Contextmenu, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var _this$art = this.art,
            option = _this$art.option,
            _this$art$template = _this$art.template,
            $player = _this$art$template.$player,
            $contextmenu = _this$art$template.$contextmenu,
            proxy = _this$art.events.proxy;
        this.add(playbackRate$2({
          disable: !option.playbackRate,
          name: 'playbackRate',
          index: 10
        }));
        this.add(aspectRatio$2({
          disable: !option.aspectRatio,
          name: 'aspectRatio',
          index: 20
        }));
        this.add(flip$1({
          disable: !option.flip,
          name: 'flip',
          index: 30
        }));
        this.add(info({
          disable: false,
          name: 'info',
          index: 40
        }));
        this.add(version({
          disable: false,
          name: 'version',
          index: 50
        }));
        this.add(close({
          disable: false,
          name: 'close',
          index: 60
        }));

        for (var index = 0; index < option.contextmenu.length; index++) {
          this.add(option.contextmenu[index]);
        }

        proxy($player, 'contextmenu', function (event) {
          event.preventDefault();
          _this2.show = true;
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
            _this2.show = false;
          }
        });
        this.art.on('blur', function () {
          _this2.show = false;
        });
      }
    }]);

    return Contextmenu;
  }(Component);

  function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var Info = /*#__PURE__*/function (_Component) {
    _inherits(Info, _Component);

    var _super = _createSuper$6(Info);

    function Info(art) {
      var _this;

      _classCallCheck(this, Info);

      _this = _super.call(this, art);
      _this.name = 'info';
      art.once('video:loadedmetadata', function () {
        if (!isMobile) {
          _this.init();
        }
      });
      return _this;
    }

    _createClass(Info, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var _this$art = this.art,
            constructor = _this$art.constructor,
            proxy = _this$art.events.proxy,
            _this$art$template = _this$art.template,
            $infoPanel = _this$art$template.$infoPanel,
            $infoClose = _this$art$template.$infoClose,
            $video = _this$art$template.$video;
        proxy($infoClose, 'click', function () {
          _this2.show = false;
        });
        var timer = null;
        var $types = queryAll('[data-video]', $infoPanel) || [];
        this.art.on('destroy', function () {
          clearTimeout(timer);
        });

        function loop() {
          for (var index = 0; index < $types.length; index++) {
            var item = $types[index];
            var value = $video[item.dataset.video];
            var innerText = typeof value === 'number' ? value.toFixed(2) : value;

            if (item.innerText !== innerText) {
              item.innerText = innerText;
            }
          }

          timer = setTimeout(loop, constructor.INFO_LOOP_TIME);
        }

        loop();
      }
    }]);

    return Info;
  }(Component);

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var Subtitle = /*#__PURE__*/function (_Component) {
    _inherits(Subtitle, _Component);

    var _super = _createSuper$5(Subtitle);

    function Subtitle(art) {
      var _this;

      _classCallCheck(this, Subtitle);

      _this = _super.call(this, art);
      _this.name = 'subtitle';
      art.once('video:loadedmetadata', function () {
        _this.init(art.option.subtitle);
      });
      return _this;
    }

    _createClass(Subtitle, [{
      key: "url",
      get: function get() {
        return this.art.template.$track.src;
      },
      set: function set(url) {
        this.switch(url);
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
      key: "style",
      value: function style(key, value) {
        var $subtitle = this.art.template.$subtitle;

        if (_typeof(key) === 'object') {
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
        var newOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var _this$art = this.art,
            i18n = _this$art.i18n,
            notice = _this$art.notice,
            option = _this$art.option;

        var subtitleOption = _objectSpread$1(_objectSpread$1(_objectSpread$1({}, option.subtitle), newOption), {}, {
          url: url
        });

        return this.init(subtitleOption).then(function (subUrl) {
          if (newOption.name) {
            notice.show = "".concat(i18n.get('Switch Subtitle'), ": ").concat(newOption.name);
          }

          return subUrl;
        });
      }
    }, {
      key: "init",
      value: function init(subtitleOption) {
        var _this2 = this;

        validator(subtitleOption, scheme.subtitle);
        if (!subtitleOption.url) return;
        var _this$art2 = this.art,
            notice = _this$art2.notice,
            proxy = _this$art2.events.proxy,
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

        this.style(_objectSpread$1({
          'text-shadow': outline()
        }, subtitleOption.style));
        errorHandle(window.fetch, 'fetch not support');
        return fetch(subtitleOption.url).then(function (response) {
          return response.arrayBuffer();
        }).then(function (buffer) {
          errorHandle(window.TextDecoder, 'TextDecoder not support');
          var decoder = new TextDecoder(subtitleOption.encoding);
          var text = decoder.decode(buffer);

          _this2.art.emit('subtitleLoad', subtitleOption.url);

          switch (subtitleOption.type || getExt(subtitleOption.url)) {
            case 'srt':
              return vttToBlob(srtToVtt(text));

            case 'ass':
              return vttToBlob(assToVtt(text));

            case 'vtt':
              return vttToBlob(text);

            default:
              return subtitleOption.url;
          }
        }).then(function (subUrl) {
          $subtitle.innerHTML = '';
          if (_this2.url === subUrl) return subUrl;
          URL.revokeObjectURL(_this2.url);
          _this2.art.template.$track.src = subUrl;

          _this2.art.emit('subtitleSwitch', subUrl);

          return subUrl;
        }).catch(function (err) {
          notice.show = err;
          throw err;
        });
      }
    }]);

    return Subtitle;
  }(Component);

  function clickInit(art, events) {
    var constructor = art.constructor,
        _art$template = art.template,
        $player = _art$template.$player,
        $video = _art$template.$video;
    events.proxy(document, ['click', 'contextmenu'], function (event) {
      if (includeFromEvent(event, $player)) {
        art.isFocus = true;
        art.emit('focus');
      } else {
        art.isFocus = false;
        art.emit('blur');
      }
    });
    var clickTime = 0;
    events.proxy($video, 'click', function () {
      var now = Date.now();

      if (now - clickTime <= constructor.DB_CLICE_TIME) {
        art.emit('dblclick');

        if (isMobile) {
          art.toggle();
        } else {
          art.fullscreen = !art.fullscreen;
        }
      } else {
        art.emit('click');

        if (!isMobile) {
          art.toggle();
        }
      }

      clickTime = now;
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
    var notice = art.notice,
        option = art.option;
    var resizeFn = throttle(function () {
      if (art.normalSize) {
        art.autoSize = option.autoSize;
      }

      art.aspectRatioReset = true;
      notice.show = '';
      art.emit('resize');
    }, art.constructor.RESIZE_TIME);
    events.proxy(window, ['orientationchange', 'resize'], function () {
      resizeFn();
    });

    if (screen && screen.orientation && screen.orientation.onchange) {
      events.proxy(screen.orientation, 'change', function () {
        resizeFn();
      });
    }
  }

  function gestureInit(art, events) {
    if (isMobile && !art.option.isLive) {
      var notice = art.notice,
          plugins = art.plugins,
          _art$template = art.template,
          $video = _art$template.$video,
          $bottom = _art$template.$bottom,
          $controls = _art$template.$controls;
      var isDroging = false;
      var startX = 0;
      var startY = 0;
      var startTime = 0;

      var onTouchStart = function onTouchStart(event) {
        if (event.touches.length === 1) {
          isDroging = true;
          var _event$touches$ = event.touches[0],
              clientX = _event$touches$.clientX,
              clientY = _event$touches$.clientY;
          startX = clientX;
          startY = clientY;
          startTime = art.currentTime;
        }
      };

      var onTouchMove = function onTouchMove(event) {
        if (event.touches.length === 1 && isDroging && art.duration) {
          var autoOrientation = plugins.autoOrientation && plugins.autoOrientation.state;
          var _event$touches$2 = event.touches[0],
              clientX = _event$touches$2.clientX,
              clientY = _event$touches$2.clientY;
          var ratioX = clamp((clientX - startX) / art.width, -1, 1);
          var ratioY = clamp((clientY - startY) / art.height, -1, 1);
          var ratio = autoOrientation ? ratioY : ratioX;
          var currentTime = clamp(startTime + art.duration * ratio / 2, 0, art.duration);
          art.seek = currentTime;
          art.emit('setBar', 'played', clamp(currentTime / art.duration, 0, 1));
          notice.show = "".concat(secondToTime(currentTime), " / ").concat(secondToTime(art.duration));
        }
      };

      var onTouchEnd = function onTouchEnd() {
        if (isDroging) {
          startX = 0;
          startY = 0;
          startTime = 0;
          isDroging = false;
        }
      };

      events.proxy($bottom, 'touchstart', function (event) {
        if (!includeFromEvent(event, $controls)) {
          onTouchStart(event);
        }
      });
      events.proxy($bottom, 'touchmove', onTouchMove);
      events.proxy($video, 'touchstart', onTouchStart);
      events.proxy($video, 'touchmove', onTouchMove);
      events.proxy(document, 'touchend', onTouchEnd);
    }
  }

  function viewInit(art, events) {
    var option = art.option,
        constructor = art.constructor,
        $container = art.template.$container;
    var scrollFn = throttle(function () {
      art.emit('view', isInViewport($container, constructor.SCROLL_GAP));
    }, constructor.SCROLL_TIME);
    events.proxy(window, 'scroll', function () {
      scrollFn();
    });
    art.on('view', function (state) {
      if (option.autoMini) {
        art.mini = !state;
      }
    });
  }

  var Events = /*#__PURE__*/function () {
    function Events(art) {
      var _this = this;

      _classCallCheck(this, Events);

      this.destroyEvents = [];
      this.proxy = this.proxy.bind(this);
      this.hover = this.hover.bind(this);
      this.loadImg = this.loadImg.bind(this);

      if (art.whitelist.state) {
        art.once('video:loadedmetadata', function () {
          clickInit(art, _this);
          hoverInit(art, _this);
          mousemoveInitInit(art, _this);
          resizeInit(art, _this);
          gestureInit(art, _this);
          viewInit(art, _this);
        });
      }
    }

    _createClass(Events, [{
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
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        for (var index = 0; index < this.destroyEvents.length; index++) {
          this.destroyEvents[index]();
        }
      }
    }]);

    return Events;
  }();

  var Hotkey = /*#__PURE__*/function () {
    function Hotkey(art) {
      var _this = this;

      _classCallCheck(this, Hotkey);

      this.art = art;
      this.keys = {};
      art.once('video:loadedmetadata', function () {
        if (art.option.hotkey && !isMobile) {
          _this.init();
        }
      });
    }

    _createClass(Hotkey, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var proxy = this.art.events.proxy;
        this.add(27, function () {
          if (_this2.art.fullscreenWeb) {
            _this2.art.fullscreenWeb = false;
          }
        });
        this.add(32, function () {
          _this2.art.toggle();
        });
        this.add(37, function () {
          _this2.art.backward = 5;
        });
        this.add(38, function () {
          _this2.art.volume += 0.1;
        });
        this.add(39, function () {
          _this2.art.forward = 5;
        });
        this.add(40, function () {
          _this2.art.volume -= 0.1;
        });
        proxy(window, 'keydown', function (event) {
          if (_this2.art.isFocus) {
            var tag = document.activeElement.tagName.toUpperCase();
            var editable = document.activeElement.getAttribute('contenteditable');

            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
              var events = _this2.keys[event.keyCode];

              if (events) {
                event.preventDefault();

                for (var index = 0; index < events.length; index++) {
                  events[index].call(_this2.art, event);
                }

                _this2.art.emit('hotkey', event);
              }
            }
          }
        });
      }
    }, {
      key: "add",
      value: function add(key, event) {
        if (this.keys[key]) {
          this.keys[key].push(event);
        } else {
          this.keys[key] = [event];
        }

        return this;
      }
    }, {
      key: "remove",
      value: function remove(key, event) {
        if (this.keys[key]) {
          var index = this.keys[key].indexOf(event);

          if (index !== -1) {
            this.keys[key].splice(index, 1);
          }
        }

        return this;
      }
    }]);

    return Hotkey;
  }();

  function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var Layer = /*#__PURE__*/function (_Component) {
    _inherits(Layer, _Component);

    var _super = _createSuper$4(Layer);

    function Layer(art) {
      var _this;

      _classCallCheck(this, Layer);

      _this = _super.call(this, art);
      var option = art.option,
          $layer = art.template.$layer;
      _this.name = 'layer';
      _this.$parent = $layer;
      art.once('video:loadedmetadata', function () {
        for (var index = 0; index < option.layers.length; index++) {
          _this.add(option.layers[index]);
        }
      });
      return _this;
    }

    return _createClass(Layer);
  }(Component);

  function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var Loading = /*#__PURE__*/function (_Component) {
    _inherits(Loading, _Component);

    var _super = _createSuper$3(Loading);

    function Loading(art) {
      var _this;

      _classCallCheck(this, Loading);

      _this = _super.call(this, art);
      _this.name = 'loading';
      append(art.template.$loading, art.icons.loading);
      return _this;
    }

    return _createClass(Loading);
  }(Component);

  var Notice = /*#__PURE__*/function () {
    function Notice(art) {
      _classCallCheck(this, Notice);

      this.art = art;
      this.timer = null;
    }

    _createClass(Notice, [{
      key: "show",
      set: function set(msg) {
        var _this$art$template = this.art.template,
            $player = _this$art$template.$player,
            $noticeInner = _this$art$template.$noticeInner;
        if (!msg) return removeClass($player, 'art-notice-show');
        $noticeInner.innerText = msg instanceof Error ? msg.message.trim() : msg;
        addClass($player, 'art-notice-show');
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
          $noticeInner.innerText = '';
          removeClass($player, 'art-notice-show');
        }, this.art.constructor.NOTICE_TIME);
      }
    }]);

    return Notice;
  }();

  function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var Mask = /*#__PURE__*/function (_Component) {
    _inherits(Mask, _Component);

    var _super = _createSuper$2(Mask);

    function Mask(art) {
      var _this;

      _classCallCheck(this, Mask);

      _this = _super.call(this, art);
      _this.name = 'mask';
      var template = art.template,
          icons = art.icons,
          events = art.events;
      append(template.$state, icons.state);
      events.proxy(template.$state, 'click', function () {
        return art.play();
      });
      return _this;
    }

    return _createClass(Mask);
  }(Component);

  var loading = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50px\" height=\"50px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"uil-default\">\n  <rect x=\"0\" y=\"0\" width=\"100\" height=\"100\" fill=\"none\" class=\"bk\"/>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(0 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-1s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(30 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.9166666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(60 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.8333333333333334s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(90 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.75s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(120 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.6666666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(150 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5833333333333334s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(180 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(210 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.4166666666666667s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(240 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.3333333333333333s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(270 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.25s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(300 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.16666666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(330 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.08333333333333333s\" repeatCount=\"indefinite\"/>\n  </rect>\n</svg>";

  var state = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"60\" width=\"60\" style=\"filter: drop-shadow(0px 1px 1px black);\" viewBox=\"0 0 24 24\">\n    <path d=\"M20,2H4C1.8,2,0,3.8,0,6v12c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V6C24,3.8,22.2,2,20,2z M15.6,12.8L10.5,16 C9.9,16.5,9,16,9,15.2V8.8C9,8,9.9,7.5,10.5,8l5.1,3.2C16.3,11.5,16.3,12.5,15.6,12.8z\"/>\n</svg>";

  var check = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"100%\" version=\"1.1\" viewBox=\"0 0 24 24\" width=\"100%\"><path d=\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\" fill=\"#fff\" /></svg>";

  var play = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n  <path d=\"M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z\"></path>\n</svg>";

  var pause = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z\"></path>\n</svg>";

  var volume = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z\"></path>\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z\"></path>\n</svg>";

  var volumeClose = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z\"></path>\n    <path d=\"M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z\"></path>\n</svg>";

  var subtitle = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 48 48\">\n    <path d=\"M0 0h48v48H0z\" fill=\"none\"/>\n    <path d=\"M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z\"/>\n</svg>";

  var screenshot = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 50 50\">\n\t<path d=\"M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z \"/>\n</svg>\n";

  var setting = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <circle cx=\"11\" cy=\"11\" r=\"2\"></circle>\n    <path d=\"M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z\"></path>\n</svg>";

  var fullscreen = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"36\" width=\"36\" viewBox=\"0 0 36 36\">\n\t<path d=\"m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z\"></path>\n\t<path d=\"m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z\"></path>\n\t<path d=\"m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z\"></path>\n\t<path d=\"M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z\"></path>\n</svg>";

  var fullscreenWeb = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" height=\"36\" width=\"36\">\n\t<path d=\"m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z\" fill-rule=\"evenodd\"></path>\n</svg>";

  var arrowLeft = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"100%\" version=\"1.1\" viewBox=\"0 0 32 32\" width=\"100%\"><path d=\"M 19.41,20.09 14.83,15.5 19.41,10.91 18,9.5 l -6,6 6,6 z\" fill=\"#fff\" /></svg>";

  var arrowRight = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"100%\" version=\"1.1\" viewBox=\"0 0 32 32\" width=\"100%\"><path d=\"m 12.59,20.34 4.58,-4.59 -4.58,-4.59 1.41,-1.41 6,6 -6,6 z\" fill=\"#fff\"/></svg>";

  var playbackRate$1 = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z\" fill=\"white\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill:#a8a6a4;\"></path></svg>";

  var aspectRatio$1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 88 88\" width=\"88\" height=\"88\" preserveAspectRatio=\"xMidYMid meet\" style=\"width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);\"><defs><clipPath id=\"__lottie_element_216\"><rect width=\"88\" height=\"88\" x=\"0\" y=\"0\"></rect></clipPath></defs><g clip-path=\"url(#__lottie_element_216)\"><g transform=\"matrix(1,0,0,1,44,44)\" opacity=\"1\" style=\"display: block;\"><g opacity=\"1\" transform=\"matrix(1,0,0,1,0,0)\"><path fill=\"rgb(255,255,255)\" fill-opacity=\"1\" d=\" M12.437999725341797,-12.70199966430664 C12.437999725341797,-12.70199966430664 9.618000030517578,-9.881999969482422 9.618000030517578,-9.881999969482422 C8.82800006866455,-9.092000007629395 8.82800006866455,-7.831999778747559 9.618000030517578,-7.052000045776367 C9.618000030517578,-7.052000045776367 16.687999725341797,0.017999999225139618 16.687999725341797,0.017999999225139618 C16.687999725341797,0.017999999225139618 9.618000030517578,7.0879998207092285 9.618000030517578,7.0879998207092285 C8.82800006866455,7.877999782562256 8.82800006866455,9.137999534606934 9.618000030517578,9.918000221252441 C9.618000030517578,9.918000221252441 12.437999725341797,12.748000144958496 12.437999725341797,12.748000144958496 C13.227999687194824,13.527999877929688 14.48799991607666,13.527999877929688 15.267999649047852,12.748000144958496 C15.267999649047852,12.748000144958496 26.58799934387207,1.437999963760376 26.58799934387207,1.437999963760376 C27.368000030517578,0.6579999923706055 27.368000030517578,-0.6119999885559082 26.58799934387207,-1.3919999599456787 C26.58799934387207,-1.3919999599456787 15.267999649047852,-12.70199966430664 15.267999649047852,-12.70199966430664 C14.48799991607666,-13.491999626159668 13.227999687194824,-13.491999626159668 12.437999725341797,-12.70199966430664z M-12.442000389099121,-12.70199966430664 C-13.182000160217285,-13.442000389099121 -14.362000465393066,-13.482000350952148 -15.142000198364258,-12.821999549865723 C-15.142000198364258,-12.821999549865723 -15.272000312805176,-12.70199966430664 -15.272000312805176,-12.70199966430664 C-15.272000312805176,-12.70199966430664 -26.582000732421875,-1.3919999599456787 -26.582000732421875,-1.3919999599456787 C-27.32200050354004,-0.6520000100135803 -27.36199951171875,0.5180000066757202 -26.70199966430664,1.3079999685287476 C-26.70199966430664,1.3079999685287476 -26.582000732421875,1.437999963760376 -26.582000732421875,1.437999963760376 C-26.582000732421875,1.437999963760376 -15.272000312805176,12.748000144958496 -15.272000312805176,12.748000144958496 C-14.531999588012695,13.48799991607666 -13.362000465393066,13.527999877929688 -12.571999549865723,12.868000030517578 C-12.571999549865723,12.868000030517578 -12.442000389099121,12.748000144958496 -12.442000389099121,12.748000144958496 C-12.442000389099121,12.748000144958496 -9.612000465393066,9.918000221252441 -9.612000465393066,9.918000221252441 C-8.871999740600586,9.178000450134277 -8.831999778747559,8.008000373840332 -9.501999855041504,7.2179999351501465 C-9.501999855041504,7.2179999351501465 -9.612000465393066,7.0879998207092285 -9.612000465393066,7.0879998207092285 C-9.612000465393066,7.0879998207092285 -16.68199920654297,0.017999999225139618 -16.68199920654297,0.017999999225139618 C-16.68199920654297,0.017999999225139618 -9.612000465393066,-7.052000045776367 -9.612000465393066,-7.052000045776367 C-8.871999740600586,-7.791999816894531 -8.831999778747559,-8.961999893188477 -9.501999855041504,-9.751999855041504 C-9.501999855041504,-9.751999855041504 -9.612000465393066,-9.881999969482422 -9.612000465393066,-9.881999969482422 C-9.612000465393066,-9.881999969482422 -12.442000389099121,-12.70199966430664 -12.442000389099121,-12.70199966430664z M28,-28 C32.41999816894531,-28 36,-24.420000076293945 36,-20 C36,-20 36,20 36,20 C36,24.420000076293945 32.41999816894531,28 28,28 C28,28 -28,28 -28,28 C-32.41999816894531,28 -36,24.420000076293945 -36,20 C-36,20 -36,-20 -36,-20 C-36,-24.420000076293945 -32.41999816894531,-28 -28,-28 C-28,-28 28,-28 28,-28z\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill:#a8a6a4;\"></path></g></g></g></svg>";

  var config = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z            M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z\" fill=\"white\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill:#a8a6a4;\"></path></svg>";

  var pip = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" height=\"32\" width=\"32\">\n    <path d=\"M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z\"></path>\n</svg>";

  var lock$1 = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg t=\"1650612139149\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"12683\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"20\" height=\"20\"><defs>\n<style type=\"text/css\"></style></defs><path d=\"M298.666667 426.666667V341.333333a213.333333 213.333333 0 1 1 426.666666 0v85.333334h42.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667z m213.333333-213.333334a128 128 0 0 0-128 128v85.333334h256V341.333333a128 128 0 0 0-128-128z\" fill=\"#ffffff\" p-id=\"12684\"></path>\n</svg>";

  var unlock = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg t=\"1650612464266\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"14150\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"20\" height=\"20\"><defs>\n<style type=\"text/css\"></style></defs><path d=\"M666.752 194.517333L617.386667 268.629333A128 128 0 0 0 384 341.333333l0.042667 85.333334h384a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667V341.333333a213.333333 213.333333 0 0 1 368.085333-146.816z\" fill=\"#ffffff\" p-id=\"14151\"></path></svg>";

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  var Icons = /*#__PURE__*/_createClass(function Icons(art) {
    var _this = this;

    _classCallCheck(this, Icons);

    var icons = _objectSpread({
      loading: loading,
      state: state,
      play: play,
      pause: pause,
      check: check,
      volume: volume,
      volumeClose: volumeClose,
      subtitle: subtitle,
      screenshot: screenshot,
      setting: setting,
      fullscreen: fullscreen,
      fullscreenWeb: fullscreenWeb,
      pip: pip,
      arrowLeft: arrowLeft,
      arrowRight: arrowRight,
      playbackRate: playbackRate$1,
      aspectRatio: aspectRatio$1,
      config: config,
      lock: lock$1,
      unlock: unlock
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
  });

  function flip(art) {
    var i18n = art.i18n,
        icons = art.icons,
        constructor = art.constructor;
    var keys = {
      normal: 'Normal',
      horizontal: 'Horizontal',
      vertical: 'Vertical'
    };

    function update($panel, $tooltip, value) {
      if ($tooltip) $tooltip.innerText = i18n.get(keys[value]);
      var $current = queryAll('.art-setting-item', $panel).find(function (item) {
        return item.dataset.value === value;
      });
      if ($current) inverseClass($current, 'art-current');
    }

    return {
      width: constructor.SETTING_ITEM_WIDTH,
      html: i18n.get('Video Flip'),
      tooltip: i18n.get(keys[art.flip]),
      icon: icons.config,
      selector: Object.keys(keys).map(function (item) {
        return {
          value: item,
          default: item === art.flip,
          html: i18n.get(keys[item])
        };
      }),
      onSelect: function onSelect(item) {
        art.flip = item.value;
      },
      mounted: function mounted($panel, item) {
        update($panel, item._$tooltip, art.flip);
        art.on('flip', function () {
          update($panel, item._$tooltip, art.flip);
        });
      }
    };
  }

  function aspectRatio(art) {
    var i18n = art.i18n,
        icons = art.icons,
        constructor = art.constructor;

    function getI18n(value) {
      return value === 'default' ? i18n.get('Default') : value;
    }

    function update($panel, $tooltip, value) {
      if ($tooltip) $tooltip.innerText = getI18n(value);
      var $current = queryAll('.art-setting-item', $panel).find(function (item) {
        return item.dataset.value === value;
      });
      if ($current) inverseClass($current, 'art-current');
    }

    return {
      width: constructor.SETTING_ITEM_WIDTH,
      html: i18n.get('Aspect Ratio'),
      icon: icons.aspectRatio,
      tooltip: getI18n(art.aspectRatio),
      selector: ['default', '4:3', '16:9'].map(function (item) {
        return {
          value: item,
          default: item === art.aspectRatio,
          html: getI18n(item)
        };
      }),
      onSelect: function onSelect(item) {
        art.aspectRatio = item.value;
      },
      mounted: function mounted($panel, item) {
        update($panel, item._$tooltip, art.aspectRatio);
        art.on('aspectRatio', function () {
          update($panel, item._$tooltip, art.aspectRatio);
        });
      }
    };
  }

  function playbackRate(art) {
    var i18n = art.i18n,
        icons = art.icons,
        constructor = art.constructor;

    function getI18n(value) {
      return value === 1.0 ? i18n.get('Normal') : value;
    }

    function update($panel, $tooltip, value) {
      if ($tooltip) $tooltip.innerText = getI18n(value);
      var $current = queryAll('.art-setting-item', $panel).find(function (item) {
        return Number(item.dataset.value) === value;
      });
      if ($current) inverseClass($current, 'art-current');
    }

    return {
      width: constructor.SETTING_ITEM_WIDTH,
      html: i18n.get('Play Speed'),
      tooltip: getI18n(art.playbackRate),
      icon: icons.playbackRate,
      selector: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(function (item) {
        return {
          value: item,
          default: item === art.playbackRate,
          html: getI18n(item)
        };
      }),
      onSelect: function onSelect(item) {
        art.playbackRate = item.value;
      },
      mounted: function mounted($panel, item) {
        update($panel, item._$tooltip, art.playbackRate);
        art.on('playbackRate', function () {
          update($panel, item._$tooltip, art.playbackRate);
        });
      }
    };
  }

  function subtitleOffset(art) {
    var i18n = art.i18n,
        icons = art.icons,
        constructor = art.constructor;

    function getI18n(value) {
      return value === 0 ? i18n.get('Normal') : value;
    }

    function update($panel, $tooltip, value) {
      if ($tooltip) $tooltip.innerText = getI18n(value);
      var $current = queryAll('.art-setting-item', $panel).find(function (item) {
        return Number(item.dataset.value) === value;
      });
      if ($current) inverseClass($current, 'art-current');
    }

    return {
      width: constructor.SETTING_ITEM_WIDTH,
      html: i18n.get('Subtitle Offset'),
      tooltip: getI18n(art.subtitleOffset),
      icon: icons.subtitle,
      selector: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(function (item) {
        return {
          value: item,
          default: item === art.subtitleOffset,
          html: getI18n(item)
        };
      }),
      onSelect: function onSelect(item) {
        art.subtitleOffset = item.value;
      },
      mounted: function mounted($panel, item) {
        update($panel, item._$tooltip, art.subtitleOffset);
        art.on('subtitleOffset', function () {
          update($panel, item._$tooltip, art.subtitleOffset);
        });
      }
    };
  }

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function makeRecursion(option, parentItem, parentList) {
    for (var index = 0; index < option.length; index++) {
      var item = option[index];
      item._parentItem = parentItem;
      item._parentList = parentList;

      if (item.selector) {
        makeRecursion(item.selector, item, option);
      }
    }

    return option;
  }

  var Setting = /*#__PURE__*/function (_Component) {
    _inherits(Setting, _Component);

    var _super = _createSuper$1(Setting);

    function Setting(art) {
      var _this;

      _classCallCheck(this, Setting);

      _this = _super.call(this, art);
      var option = art.option,
          proxy = art.events.proxy,
          _art$template = art.template,
          $setting = _art$template.$setting,
          $player = _art$template.$player;
      _this.art = art;
      _this.name = 'setting';
      _this.$parent = $setting;
      _this.option = [];
      _this.events = [];
      _this.cache = new Map();

      if (option.setting) {
        art.once('video:loadedmetadata', function () {
          if (option.playbackRate) {
            _this.option.push(playbackRate(art));
          }

          if (option.aspectRatio) {
            _this.option.push(aspectRatio(art));
          }

          if (option.flip) {
            _this.option.push(flip(art));
          }

          if (option.subtitleOffset) {
            _this.option.push(subtitleOffset(art));
          }

          for (var index = 0; index < option.settings.length; index++) {
            _this.option.push(option.settings[index]);
          }

          _this.option = makeRecursion(_this.option);

          _this.init(_this.option);
        });
        art.on('blur', function () {
          if (_this.show) {
            _this.show = false;

            _this.init(_this.option);
          }
        });
        proxy($player, 'click', function (event) {
          if (_this.show && !includeFromEvent(event, art.controls.setting) && !includeFromEvent(event, _this.$parent)) {
            _this.show = false;

            _this.init(_this.option);
          }
        });
      }

      return _this;
    }

    _createClass(Setting, [{
      key: "add",
      value: function add(callback) {
        if (typeof callback === 'function') {
          this.option.push(callback(this.art));
        } else {
          this.option.push(callback);
        }

        this.cache = new Map();
        this.events.forEach(function (event) {
          return event();
        });
        this.events = [];
        this.$parent.innerHTML = '';
        this.option = makeRecursion(this.option);
        this.init(this.option);
      }
    }, {
      key: "creatHeader",
      value: function creatHeader(item) {
        var _this2 = this;

        var _this$art = this.art,
            icons = _this$art.icons,
            proxy = _this$art.events.proxy;
        var $item = document.createElement('div');
        addClass($item, 'art-setting-item');
        addClass($item, 'art-setting-item-back');
        var $left = append($item, '<div class="art-setting-item-left"></div>');
        var $icon = document.createElement('div');
        addClass($icon, 'art-setting-item-left-icon');
        append($icon, icons.arrowLeft);
        append($left, $icon);
        append($left, item._parentItem.html);
        var event = proxy($item, 'click', function () {
          _this2.init(item._parentList);
        });
        this.events.push(event);
        return $item;
      }
    }, {
      key: "creatItem",
      value: function creatItem(item) {
        var _this3 = this;

        var _this$art2 = this.art,
            icons = _this$art2.icons,
            proxy = _this$art2.events.proxy;
        var hasChildren = item.selector && item.selector.length;
        var $item = document.createElement('div');
        addClass($item, 'art-setting-item');

        if (item.default) {
          addClass($item, 'art-current');
        }

        var $left = append($item, '<div class="art-setting-item-left"></div>');
        var $right = append($item, '<div class="art-setting-item-right"></div>');
        var $icon = document.createElement('div');
        addClass($icon, 'art-setting-item-left-icon');
        append($icon, hasChildren ? item.icon || icons.config : icons.check);
        append($left, $icon);
        item._$icon = $icon;
        def(item, 'icon', {
          get: function get() {
            return $icon.innerHTML;
          },
          set: function set(value) {
            if (typeof value === 'string' || typeof value === 'number') {
              $icon.innerHTML = value;
            }
          }
        });
        var $html = document.createElement('div');
        addClass($html, 'art-setting-item-left-text');
        append($html, item.html || '');
        append($left, $html);
        item._$html = $html;
        def(item, 'html', {
          get: function get() {
            return $html.innerHTML;
          },
          set: function set(value) {
            if (typeof value === 'string' || typeof value === 'number') {
              $html.innerHTML = value;
            }
          }
        });

        if (hasChildren) {
          var $tooltip = document.createElement('div');
          addClass($tooltip, 'art-setting-item-right-tooltip');
          append($tooltip, item.tooltip || '');
          append($right, $tooltip);
          item._$tooltip = $tooltip;
          def(item, 'tooltip', {
            get: function get() {
              return $tooltip.innerHTML;
            },
            set: function set(value) {
              if (typeof value === 'string' || typeof value === 'number') {
                $tooltip.innerHTML = value;
              }
            }
          });
          var $arrow = document.createElement('div');
          addClass($arrow, 'art-setting-item-right-icon');
          append($arrow, icons.arrowRight);
          append($right, $arrow);
        }

        var event = proxy($item, 'click', /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(event) {
            var result;
            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!hasChildren) {
                      _context.next = 4;
                      break;
                    }

                    _this3.init(item.selector, item.width);

                    _context.next = 11;
                    break;

                  case 4:
                    inverseClass($item, 'art-current');

                    if (item._parentList) {
                      _this3.init(item._parentList);
                    }

                    if (!(item._parentItem && item._parentItem.onSelect)) {
                      _context.next = 11;
                      break;
                    }

                    _context.next = 9;
                    return item._parentItem.onSelect.call(_this3.art, item, $item, event);

                  case 9:
                    result = _context.sent;

                    if (item._parentItem._$tooltip) {
                      if (typeof result === 'string' || typeof result === 'number') {
                        item._parentItem._$tooltip.innerHTML = result;
                      }
                    }

                  case 11:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
        this.events.push(event);
        return $item;
      }
    }, {
      key: "init",
      value: function init(option, width) {
        if (this.cache.has(option)) {
          var $panel = this.cache.get(option);
          inverseClass($panel, 'art-current');
          setStyle(this.$parent, 'width', "".concat($panel.dataset.width, "px"));
        } else {
          var _$panel = document.createElement('div');

          addClass(_$panel, 'art-setting-panel');

          if (option[0] && option[0]._parentItem) {
            append(_$panel, this.creatHeader(option[0]));
          }

          for (var index = 0; index < option.length; index++) {
            append(_$panel, this.creatItem(option[index]));
          }

          _$panel.dataset.width = width || this.art.constructor.SETTING_WIDTH;
          append(this.$parent, _$panel);
          this.cache.set(option, _$panel);
          inverseClass(_$panel, 'art-current');
          setStyle(this.$parent, 'width', "".concat(_$panel.dataset.width, "px"));

          if (option[0] && option[0]._parentItem && option[0]._parentItem.mounted) {
            option[0]._parentItem.mounted.call(this.art, _$panel, option[0]._parentItem);
          }
        }
      }
    }]);

    return Setting;
  }(Component);

  var Storage = /*#__PURE__*/function () {
    function Storage() {
      _classCallCheck(this, Storage);

      this.name = 'artplayer_settings';
      this.settings = {};
    }

    _createClass(Storage, [{
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
          var storage = Object.assign({}, this.get(), _defineProperty({}, key, value));
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
      key: "clear",
      value: function clear() {
        try {
          window.localStorage.removeItem(this.name);
        } catch (error) {
          this.settings = {};
        }
      }
    }]);

    return Storage;
  }();

  function miniProgressBar(art) {
    art.on('ready', function () {
      art.layers.add({
        name: 'miniProgressBar',
        mounted: function mounted($progressBar) {
          art.on('destroy', function () {
            $progressBar.style.display = 'none';
          });
          art.on('video:timeupdate', function () {
            $progressBar.style.width = "".concat(art.played * 100, "%");
          });
        }
      });
    });
    return {
      name: 'miniProgressBar'
    };
  }

  function autoOrientation(art) {
    var option = art.option,
        constructor = art.constructor,
        _art$template = art.template,
        $player = _art$template.$player,
        $video = _art$template.$video;
    art.on('fullscreenWeb', function (state) {
      if (state) {
        var videoWidth = $video.videoWidth,
            videoHeight = $video.videoHeight;
        var _document$documentEle = document.documentElement,
            viewWidth = _document$documentEle.clientWidth,
            viewHeight = _document$documentEle.clientHeight;

        if (videoWidth > videoHeight && viewWidth < viewHeight || videoWidth < videoHeight && viewWidth > viewHeight) {
          // There is a conflict with the fullscreen event, and it is changed to asynchronous execution
          setTimeout(function () {
            setStyle($player, 'width', "".concat(viewHeight, "px"));
            setStyle($player, 'height', "".concat(viewWidth, "px"));
            setStyle($player, 'transform-origin', '0 0');
            setStyle($player, 'transform', "rotate(90deg) translate(0, -".concat(viewWidth, "px)"));
            addClass($player, 'art-auto-orientation');
          }, constructor.MOBILE_AUTO_ORIENTATION_TIME);
        }
      } else {
        if (hasClass($player, 'art-auto-orientation')) {
          setStyle($player, 'width', null);
          setStyle($player, 'height', null);
          setStyle($player, 'transform', null);
          setStyle($player, 'transform-origin', null);
          removeClass($player, 'art-auto-orientation');
          art.aspectRatioReset = true;
          art.autoSize = option.autoSize;
          art.notice.show = '';
        }
      }
    });
    art.on('fullscreen', function (state) {
      var lastOrientation = screen.orientation.type;

      if (state) {
        var videoWidth = $video.videoWidth,
            videoHeight = $video.videoHeight;
        var _document$documentEle2 = document.documentElement,
            viewWidth = _document$documentEle2.clientWidth,
            viewHeight = _document$documentEle2.clientHeight;

        if (videoWidth > videoHeight && viewWidth < viewHeight || videoWidth < videoHeight && viewWidth > viewHeight) {
          var oppositeOrientation = lastOrientation.startsWith('portrait') ? 'landscape' : 'portrait';
          screen.orientation.lock(oppositeOrientation).then(function () {
            addClass($player, 'art-auto-orientation-fullscreen');
          });
        }
      } else {
        if (hasClass($player, 'art-auto-orientation-fullscreen')) {
          screen.orientation.lock(lastOrientation).then(function () {
            removeClass($player, 'art-auto-orientation-fullscreen');
          });
        }
      }
    });
    return {
      name: 'autoOrientation',

      get state() {
        return hasClass($player, 'art-auto-orientation');
      }

    };
  }

  function autoPlayback(art) {
    var i18n = art.i18n,
        storage = art.storage,
        constructor = art.constructor,
        $poster = art.template.$poster;
    art.on('video:timeupdate', function () {
      var times = storage.get('times') || {};
      var keys = Object.keys(times);
      if (keys.length > constructor.AUTO_PLAYBACK_MAX) delete times[keys[0]];
      times[art.option.url] = art.currentTime;
      storage.set('times', times);
    });
    art.on('ready', function () {
      var times = storage.get('times') || {};
      var currentTime = times[art.option.url];

      if (currentTime) {
        art.seek = currentTime;
        setStyle($poster, 'display', 'none');
        art.notice.show = "".concat(i18n.get('Auto playback at'), " ").concat(secondToTime(currentTime));
      }
    });
    return {
      name: 'autoPlayback',

      get times() {
        return storage.get('times') || {};
      },

      clear: function clear() {
        return storage.del('times');
      }
    };
  }

  function fastForward(art) {
    var constructor = art.constructor,
        proxy = art.events.proxy,
        _art$template = art.template,
        $player = _art$template.$player,
        $video = _art$template.$video;
    var timer = null;
    var isPress = false;

    var onStart = function onStart(event) {
      if (event.touches.length === 1 && art.playing) {
        timer = setTimeout(function () {
          isPress = true;
          art.playbackRate = constructor.FAST_FORWARD_VALUE;
          addClass($player, 'art-fast-forward');
        }, constructor.FAST_FORWARD_TIME);
      }
    };

    var onStop = function onStop() {
      clearTimeout(timer);

      if (isPress) {
        isPress = false;
        art.playbackRate = 1;
        removeClass($player, 'art-fast-forward');
      }
    };

    proxy($video, 'touchstart', onStart);
    proxy(document, 'touchmove', onStop);
    proxy(document, 'touchend', onStop);
    return {
      name: 'fastForward',

      get state() {
        return hasClass($player, 'art-fast-forward');
      }

    };
  }

  function lock(art) {
    var layers = art.layers,
        icons = art.icons,
        $player = art.template.$player;
    layers.add({
      name: 'lock',
      mounted: function mounted($el) {
        var $lock = append($el, icons.lock);
        var $unlock = append($el, icons.unlock);
        setStyle($lock, 'display', 'none');
        art.on('lock', function (state) {
          if (state) {
            setStyle($lock, 'display', 'inline-flex');
            setStyle($unlock, 'display', 'none');
          } else {
            setStyle($lock, 'display', 'none');
            setStyle($unlock, 'display', 'inline-flex');
          }
        });
      },
      click: function click() {
        if (hasClass($player, 'art-lock')) {
          removeClass($player, 'art-lock');
          art.emit('lock', false);
        } else {
          addClass($player, 'art-lock');
          art.emit('lock', true);
        }
      }
    });
    return {
      name: 'lock',

      get state() {
        return hasClass($player, 'art-lock');
      }

    };
  }

  var Plugins = /*#__PURE__*/function () {
    function Plugins(art) {
      _classCallCheck(this, Plugins);

      this.art = art;
      this.id = 0;
      var option = art.option;

      if (option.miniProgressBar && !option.isLive) {
        this.add(miniProgressBar);
      }

      if (option.lock && isMobile) {
        this.add(lock);
      }

      if (option.autoPlayback) {
        this.add(autoPlayback);
      }

      if (option.autoOrientation && isMobile) {
        this.add(autoOrientation);
      }

      if (option.fastForward && isMobile && !option.isLive) {
        this.add(fastForward);
      }

      for (var index = 0; index < option.plugins.length; index++) {
        this.add(option.plugins[index]);
      }
    }

    _createClass(Plugins, [{
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

  var Ads = /*#__PURE__*/function () {
    function Ads(art) {
      _classCallCheck(this, Ads);

      this.art = art;
      this.init();
    }

    _createClass(Ads, [{
      key: "current",
      get: function get() {
        return this.art.option.ads[this.index];
      }
    }, {
      key: "prev",
      get: function get() {
        return this.art.option.ads[this.index - 1];
      }
    }, {
      key: "next",
      get: function get() {
        return this.art.option.ads[this.index + 1];
      }
    }, {
      key: "init",
      value: function init() {
        this.index = 0;
        this.isEnd = false;
        this.playing = false;
        this.urlCache = this.art.option.url;

        if (this.current) {
          this.playing = true;
          this.play(this.current);
        }
      }
    }, {
      key: "play",
      value: function play() {
        var _this = this;

        var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (this.isEnd) return;
        this.art.switchUrl(item.url);
        this.art.once('video:timeupdate', function () {
          _this.art.emit('ads:start', item);
        });
        this.art.once('video:ended', function () {
          var next = _this.next;

          if (next) {
            _this.index += 1;

            _this.play(next);
          } else {
            _this.end();
          }
        });
      }
    }, {
      key: "end",
      value: function end() {
        if (this.isEnd) return;
        this.isEnd = true;
        this.playing = false;
        this.art.option.url = this.urlCache;
        this.art.switchUrl(this.urlCache);
        this.art.emit('ads:end');
      }
    }]);

    return Ads;
  }();

  var Mobile = /*#__PURE__*/_createClass(function Mobile(art) {
    _classCallCheck(this, Mobile);

    var option = art.option,
        proxy = art.events.proxy,
        $video = art.template.$video;

    for (var index = 0; index < config$1.events.length; index++) {
      proxy($video, config$1.events[index], function (event) {
        art.emit("video:".concat(event.type), event);
      });
    }

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

    if (option.playsInline) {
      $video.playsInline = true;
      $video['webkit-playsinline'] = true;
    }

    var typeName = option.type || getExt(option.url);
    var typeCallback = option.customType[typeName];

    if (typeName && typeCallback) {
      typeCallback($video, option.url, art);
      art.emit('customType', typeName);
    } else {
      $video.src = option.url;
      art.emit('url', $video.src);
    }
  });

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  var id = 0;
  var instances = [];

  var Artplayer = /*#__PURE__*/function (_Emitter) {
    _inherits(Artplayer, _Emitter);

    var _super = _createSuper(Artplayer);

    function Artplayer(option, readyCallback) {
      var _this;

      _classCallCheck(this, Artplayer);

      _this = _super.call(this);
      _this.id = ++id;
      var mergeOption = mergeDeep(Artplayer.option, option);
      _this.option = validator(mergeOption, scheme);
      _this.isReady = false;
      _this.isFocus = false;
      _this.isDestroy = false;
      _this.whitelist = new Whitelist(_assertThisInitialized(_this));
      _this.template = new Template(_assertThisInitialized(_this));
      _this.events = new Events(_assertThisInitialized(_this));

      if (_this.whitelist.state) {
        _this.storage = new Storage(_assertThisInitialized(_this));
        _this.icons = new Icons(_assertThisInitialized(_this));
        _this.i18n = new I18n(_assertThisInitialized(_this));
        _this.notice = new Notice(_assertThisInitialized(_this));
        _this.player = new Player(_assertThisInitialized(_this));
        _this.layers = new Layer(_assertThisInitialized(_this));
        _this.controls = new Control(_assertThisInitialized(_this));
        _this.contextmenu = new Contextmenu(_assertThisInitialized(_this));
        _this.subtitle = new Subtitle(_assertThisInitialized(_this));
        _this.ads = new Ads(_assertThisInitialized(_this));
        _this.info = new Info(_assertThisInitialized(_this));
        _this.loading = new Loading(_assertThisInitialized(_this));
        _this.hotkey = new Hotkey(_assertThisInitialized(_this));
        _this.mask = new Mask(_assertThisInitialized(_this));
        _this.setting = new Setting(_assertThisInitialized(_this));
        _this.plugins = new Plugins(_assertThisInitialized(_this));
      } else {
        _this.mobile = new Mobile(_assertThisInitialized(_this));
      }

      if (typeof readyCallback === 'function') {
        _this.on('ready', function () {
          return readyCallback.call(_assertThisInitialized(_this));
        });
      }

      instances.push(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(Artplayer, [{
      key: "proxy",
      get: function get() {
        return this.events.proxy;
      }
    }, {
      key: "query",
      get: function get() {
        return this.template.query;
      }
    }, {
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
        return '4.3.11';
      }
    }, {
      key: "env",
      get: function get() {
        return 'development';
      }
    }, {
      key: "build",
      get: function get() {
        return '1651062536627';
      }
    }, {
      key: "config",
      get: function get() {
        return config$1;
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
        return validator;
      }
    }, {
      key: "kindOf",
      get: function get() {
        return validator.kindOf;
      }
    }, {
      key: "html",
      get: function get() {
        return Template.html;
      }
    }, {
      key: "option",
      get: function get() {
        return {
          container: '#artplayer',
          url: '',
          poster: '',
          title: '',
          type: '',
          theme: '#f00',
          volume: 0.7,
          isLive: false,
          muted: false,
          autoplay: false,
          autoSize: false,
          autoMini: false,
          loop: false,
          flip: false,
          playbackRate: false,
          aspectRatio: false,
          screenshot: false,
          setting: false,
          hotkey: true,
          pip: false,
          mutex: true,
          backdrop: true,
          fullscreen: false,
          fullscreenWeb: false,
          subtitleOffset: false,
          miniProgressBar: false,
          useSSR: false,
          playsInline: true,
          lock: false,
          fastForward: false,
          autoPlayback: false,
          autoOrientation: false,
          ads: [],
          layers: [],
          contextmenu: [],
          controls: [],
          settings: [],
          quality: [],
          highlight: [],
          plugins: [],
          whitelist: [],
          thumbnails: {
            url: '',
            number: 60,
            column: 10
          },
          subtitle: {
            url: '',
            type: '',
            style: {},
            encoding: 'utf-8'
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
  }(Emitter);
  Artplayer.NOTICE_TIME = 2000;
  Artplayer.SETTING_WIDTH = 250;
  Artplayer.SETTING_ITEM_WIDTH = 200;
  Artplayer.INDICATOR_SIZE = 14;
  Artplayer.INDICATOR_SIZE_ICON = 16;
  Artplayer.INDICATOR_SIZE_MOBILE = 18;
  Artplayer.INDICATOR_SIZE_MOBILE_ICON = 20;
  Artplayer.VOLUME_PANEL_WIDTH = 60;
  Artplayer.VOLUME_HANDLE_WIDTH = 12;
  Artplayer.RESIZE_TIME = 500;
  Artplayer.SCROLL_TIME = 200;
  Artplayer.SCROLL_GAP = 50;
  Artplayer.AUTO_PLAYBACK_MAX = 10;
  Artplayer.RECONNECT_TIME_MAX = 5;
  Artplayer.RECONNECT_SLEEP_TIME = 1000;
  Artplayer.CONTROL_HIDE_TIME = 3000;
  Artplayer.DB_CLICE_TIME = 300;
  Artplayer.MOBILE_AUTO_PLAYBACKRATE = 3;
  Artplayer.MOBILE_AUTO_PLAYBACKRATE_TIME = 1000;
  Artplayer.MOBILE_AUTO_ORIENTATION_TIME = 100;
  Artplayer.INFO_LOOP_TIME = 1000;
  Artplayer.FAST_FORWARD_VALUE = 3;
  Artplayer.FAST_FORWARD_TIME = 1000; // eslint-disable-next-line no-console

  console.log('%c ArtPlayer %c 4.3.11 %c https://artplayer.org', 'color: #fff; background: #5f5f5f', 'color: #fff; background: #4bc729', '');

  return Artplayer;

}));
//# sourceMappingURL=artplayer.js.map
