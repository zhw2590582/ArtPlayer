var $cTKjd$optionvalidator = require("option-validator");
var $cTKjd$screenfull = require("screenfull");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $cdf9fe9adb2d02f9$export$2e2bcd8739ae039);
var $fc322dd812272489$exports = {};
$fc322dd812272489$exports = ".art-video-player {\n  z-index: 20;\n  width: 100%;\n  height: 100%;\n  zoom: 1;\n  color: #eee;\n  text-align: left;\n  direction: ltr;\n  user-select: none;\n  -webkit-tap-highlight-color: #0000;\n  touch-action: manipulation;\n  -ms-high-contrast-adjust: none;\n  background-color: #000;\n  outline: none;\n  margin: 0 auto;\n  font-family: Roboto, Arial, Helvetica, sans-serif;\n  font-size: 14px;\n  line-height: 1.3;\n  display: flex;\n  position: relative;\n}\n\n.art-video-player * {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\n.art-video-player ::-webkit-scrollbar {\n  width: 5px;\n  height: 5px;\n}\n\n.art-video-player ::-webkit-scrollbar-thumb {\n  background-color: #666;\n}\n\n.art-video-player ::-webkit-scrollbar-thumb:hover {\n  background-color: #ccc;\n}\n\n.art-video-player .art-icon {\n  justify-content: center;\n  align-items: center;\n  line-height: 1.5;\n  display: inline-flex;\n}\n\n.art-video-player .art-icon svg {\n  fill: #fff;\n}\n\n.art-video-player img {\n  max-width: 100%;\n  vertical-align: top;\n}\n\n@supports ((-webkit-backdrop-filter: initial) or (backdrop-filter: initial)) {\n  .art-video-player .art-backdrop-filter {\n    -webkit-backdrop-filter: saturate(180%) blur(20px);\n    backdrop-filter: saturate(180%) blur(20px);\n    background-color: #000000b3 !important;\n  }\n}\n\n.art-video-player .art-video {\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n  cursor: pointer;\n  background-color: #000;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-poster {\n  z-index: 11;\n  width: 100%;\n  height: 100%;\n  user-select: none;\n  pointer-events: none;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-subtitle {\n  z-index: 20;\n  width: 100%;\n  text-align: center;\n  color: #fff;\n  pointer-events: none;\n  text-shadow: 1px 0 1px #000, 0 1px 1px #000, -1px 0 1px #000, 0 -1px 1px #000, 1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000;\n  padding: 0 20px;\n  font-size: 20px;\n  display: none;\n  position: absolute;\n  bottom: 10px;\n}\n\n.art-video-player .art-subtitle p {\n  word-break: break-all;\n  height: fit-content;\n  margin: 5px 0 0;\n  line-height: 1.2;\n}\n\n.art-video-player.art-subtitle-show .art-subtitle {\n  display: block;\n}\n\n.art-video-player.art-control-show .art-subtitle {\n  bottom: 50px;\n}\n\n.art-video-player .art-danmuku {\n  z-index: 30;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\n.art-video-player .art-layers {\n  z-index: 40;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  display: none;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\n.art-video-player .art-layers .art-layer {\n  pointer-events: auto;\n}\n\n.art-video-player.art-layer-show .art-layers {\n  display: block;\n}\n\n.art-video-player .art-mask {\n  z-index: 50;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  justify-content: center;\n  align-items: center;\n  display: none;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\n.art-video-player .art-mask .art-state {\n  width: 60px;\n  height: 60px;\n  opacity: .85;\n  cursor: pointer;\n  pointer-events: all;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  position: absolute;\n  bottom: 65px;\n  right: 30px;\n}\n\n.art-video-player.art-mask-show .art-mask {\n  display: flex;\n}\n\n.art-video-player.art-mobile .art-state {\n  position: static;\n}\n\n.art-video-player .art-loading {\n  z-index: 70;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  justify-content: center;\n  align-items: center;\n  display: none;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player.art-loading-show .art-loading {\n  display: flex;\n}\n\n.art-video-player .art-bottom {\n  z-index: 60;\n  height: 100px;\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==) bottom repeat-x;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: 50px 10px 0;\n  transition: all .2s ease-in-out;\n  display: flex;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n\n.art-video-player .art-bottom .art-progress {\n  z-index: 0;\n  pointer-events: auto;\n  flex: 1;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress {\n  height: 4px;\n  cursor: pointer;\n  flex-direction: row;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner {\n  height: 50%;\n  width: 100%;\n  background: #fff3;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-loaded {\n  z-index: 10;\n  height: 100%;\n  width: 0;\n  background: #fff6;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-played {\n  z-index: 20;\n  height: 100%;\n  width: 0;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight {\n  z-index: 30;\n  height: 100%;\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight span {\n  width: 7px;\n  height: 100%;\n  pointer-events: auto;\n  background: #fff;\n  display: inline-block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  visibility: hidden;\n  z-index: 40;\n  border-radius: 50%;\n  justify-content: center;\n  align-items: center;\n  transition: transform .1s ease-in-out;\n  position: absolute;\n  transform: scale(.1);\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator .art-icon {\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  user-select: none;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip {\n  z-index: 50;\n  height: 20px;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  background: #000000b3;\n  border-radius: 3px;\n  padding: 0 5px;\n  font-size: 12px;\n  font-weight: bold;\n  line-height: 20px;\n  display: none;\n  position: absolute;\n  top: -25px;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-thumbnails {\n  pointer-events: none;\n  background-color: #000000b3;\n  display: none;\n  position: absolute;\n  bottom: 8px;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-loop {\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  display: none;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-loop .art-loop-point {\n  width: 2px;\n  height: 8px;\n  background: #ffffffbf;\n  position: absolute;\n  top: -2px;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-controls {\n  z-index: 1;\n  pointer-events: auto;\n  height: 45px;\n  justify-content: space-between;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-controls .art-controls-left, .art-video-player .art-bottom .art-controls .art-controls-right {\n  display: flex;\n}\n\n.art-video-player .art-bottom .art-controls .art-control {\n  opacity: .9;\n  min-height: 36px;\n  min-width: 36px;\n  text-align: center;\n  cursor: pointer;\n  white-space: nowrap;\n  align-items: center;\n  font-size: 12px;\n  line-height: 1;\n  display: flex;\n}\n\n.art-video-player .art-bottom .art-controls .art-control .art-icon {\n  float: left;\n  height: 36px;\n  width: 36px;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-bottom .art-controls .art-control:hover {\n  opacity: 1;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-onlyText {\n  padding: 0 10px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel {\n  float: left;\n  width: 0;\n  height: 100%;\n  transition: margin .2s cubic-bezier(.4, 0, 1, 1), width .2s cubic-bezier(.4, 0, 1, 1);\n  position: relative;\n  overflow: hidden;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle {\n  width: 12px;\n  height: 12px;\n  background: #fff;\n  border-radius: 12px;\n  margin-top: -6px;\n  position: absolute;\n  top: 50%;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:before {\n  background: #fff;\n  left: -54px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:after {\n  background: #fff3;\n  left: 6px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:before, .art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:after {\n  content: \"\";\n  height: 3px;\n  width: 60px;\n  margin-top: -2px;\n  display: block;\n  position: absolute;\n  top: 50%;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume:hover .art-volume-panel {\n  width: 60px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality {\n  z-index: 30;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys {\n  width: 100px;\n  text-align: center;\n  color: #fff;\n  background: #000c;\n  border-radius: 3px;\n  padding: 5px 0;\n  display: none;\n  position: absolute;\n  bottom: 35px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys .art-quality-item {\n  height: 30px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-shadow: 0 0 2px #00000080;\n  line-height: 30px;\n  overflow: hidden;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys .art-quality-item:hover {\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality:hover .art-qualitys {\n  display: block;\n}\n\n.art-video-player .art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner {\n  height: 100%;\n}\n\n.art-video-player .art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  visibility: visible;\n  transform: scale(1);\n}\n\n.art-video-player.art-control-show .art-bottom, .art-video-player.art-hover .art-bottom {\n  opacity: 1;\n  visibility: visible;\n}\n\n.art-video-player.art-error .art-progress-indicator, .art-video-player.art-destroy .art-progress-indicator, .art-video-player.art-error .art-progress-tip, .art-video-player.art-destroy .art-progress-tip {\n  display: none !important;\n}\n\n.art-video-player.art-mobile .art-bottom {\n  padding: 50px 7px 0;\n}\n\n.art-video-player.art-mobile .art-bottom .art-controls {\n  height: 40px;\n}\n\n.art-video-player.art-mobile .art-bottom .art-progress-indicator {\n  visibility: visible !important;\n  transform: scale(1) !important;\n}\n\n.art-video-player .art-notice {\n  z-index: 80;\n  width: 100%;\n  pointer-events: none;\n  padding: 10px;\n  font-size: 14px;\n  display: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.art-video-player .art-notice .art-notice-inner {\n  color: #fff;\n  background-color: #0009;\n  border-radius: 3px;\n  padding: 5px 10px;\n  display: inline-block;\n}\n\n.art-video-player.art-notice-show .art-notice {\n  display: flex;\n}\n\n.art-video-player .art-contextmenus {\n  z-index: 120;\n  min-width: 200px;\n  background-color: #000000e6;\n  border-radius: 3px;\n  flex-direction: column;\n  padding: 5px 0;\n  display: none;\n  position: absolute;\n  top: 10px;\n  left: 10px;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu {\n  cursor: pointer;\n  color: #fff;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-shadow: 0 0 2px #00000080;\n  border-bottom: 1px solid #ffffff1a;\n  padding: 10px 15px;\n  font-size: 12px;\n  display: block;\n  overflow: hidden;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu a {\n  color: #fff;\n  text-decoration: none;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu span {\n  padding: 0 7px;\n  display: inline-block;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu span:hover, .art-video-player .art-contextmenus .art-contextmenu span.art-current {\n  color: #00c9ff;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu:hover {\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu:last-child {\n  border-bottom: none;\n}\n\n.art-video-player.art-contextmenu-show .art-contextmenus {\n  display: flex;\n}\n\n.art-video-player .art-settings {\n  z-index: 90;\n  max-height: 300px;\n  background-color: #000000e6;\n  border-radius: 3px;\n  font-size: 13px;\n  transition: all .2s;\n  display: none;\n  position: absolute;\n  bottom: 50px;\n  right: 10px;\n  overflow: auto;\n}\n\n.art-video-player .art-settings .art-setting-panel {\n  display: none;\n}\n\n.art-video-player .art-settings .art-setting-panel.art-current {\n  display: block;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item {\n  height: 35px;\n  cursor: pointer;\n  color: #fffc;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 5px;\n  line-height: 1;\n  display: flex;\n  overflow: hidden;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item:hover, .art-video-player .art-settings .art-setting-panel .art-setting-item.art-current {\n  color: #fff;\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon {\n  width: 30px;\n  height: 30px;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon-check {\n  visibility: hidden;\n  height: 15px;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current .art-icon-check {\n  visibility: visible;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left {\n  white-space: nowrap;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left .art-setting-item-left-icon {\n  height: 24px;\n  width: 24px;\n  justify-content: center;\n  align-items: center;\n  margin-right: 10px;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right {\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-tooltip {\n  white-space: nowrap;\n  color: #ffffff80;\n  font-size: 12px;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-icon {\n  height: 24px;\n  width: 24px;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item-back {\n  border-bottom: 1px solid #ffffff1a;\n}\n\n.art-video-player.art-setting-show .art-settings {\n  display: block;\n}\n\n.art-video-player.art-mobile .art-settings {\n  max-height: 200px;\n}\n\n.art-video-player .art-info {\n  z-index: 100;\n  width: 350px;\n  color: #fff;\n  -webkit-font-smoothing: antialiased;\n  background-color: #000000e6;\n  flex-direction: column;\n  padding: 10px;\n  font-family: Noto Sans CJK SC DemiLight, Roboto, Segoe UI, Tahoma, Arial, Helvetica, sans-serif;\n  font-size: 12px;\n  display: none;\n  position: absolute;\n  top: 10px;\n  left: 10px;\n}\n\n.art-video-player .art-info .art-info-item {\n  margin-bottom: 5px;\n  display: flex;\n}\n\n.art-video-player .art-info .art-info-item .art-info-title {\n  width: 100px;\n  text-align: right;\n}\n\n.art-video-player .art-info .art-info-item .art-info-content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n  padding-left: 5px;\n  overflow: hidden;\n}\n\n.art-video-player .art-info .art-info-item:last-child {\n  margin-bottom: 0;\n}\n\n.art-video-player .art-info .art-info-close {\n  cursor: pointer;\n  position: absolute;\n  top: 5px;\n  right: 5px;\n}\n\n.art-video-player.art-info-show .art-info {\n  display: flex;\n}\n\n.art-video-player.art-hide-cursor * {\n  cursor: none !important;\n}\n\n.art-video-player[data-aspect-ratio] video {\n  box-sizing: content-box;\n  object-fit: fill;\n}\n\n.art-video-player.art-fullscreen-web {\n  z-index: 9999;\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  inset: 0;\n}\n\n.art-fullscreen-rotate {\n  z-index: 9999;\n  width: 100%;\n  height: 100%;\n  background-color: #000;\n  position: fixed;\n  inset: 0;\n}\n\n.art-video-player .art-mini-header {\n  z-index: 110;\n  height: 35px;\n  color: #fff;\n  opacity: 0;\n  visibility: hidden;\n  background-color: #00000080;\n  justify-content: space-between;\n  align-items: center;\n  line-height: 35px;\n  transition: all .2s ease-in-out;\n  display: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n}\n\n.art-video-player .art-mini-header .art-mini-title {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: move;\n  flex: 1;\n  padding: 0 10px;\n  overflow: hidden;\n}\n\n.art-video-player .art-mini-header .art-mini-close {\n  width: 35px;\n  text-align: center;\n  cursor: pointer;\n  font-size: 22px;\n}\n\n.art-video-player.art-is-dragging {\n  opacity: .7;\n}\n\n.art-video-player.art-mini {\n  z-index: 9999;\n  width: 400px;\n  height: 225px;\n  position: fixed;\n  box-shadow: 0 2px 5px #00000029, 0 3px 6px #0003;\n}\n\n.art-video-player.art-mini .art-mini-header {\n  user-select: none;\n  display: flex;\n}\n\n.art-video-player.art-mini.art-hover .art-mini-header {\n  opacity: 1;\n  visibility: visible;\n}\n\n.art-video-player.art-mini .art-mask .art-state {\n  position: static;\n}\n\n.art-video-player.art-mini .art-contextmenu, .art-video-player.art-mini .art-bottom, .art-video-player.art-mini .art-danmu, .art-video-player.art-mini .art-info, .art-video-player.art-mini .art-layers, .art-video-player.art-mini .art-notice, .art-video-player.art-mini .art-setting, .art-video-player.art-mini .art-subtitle {\n  display: none !important;\n}\n\n.art-auto-size {\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player[data-flip=\"horizontal\"] .art-video {\n  transform: scaleX(-1);\n}\n\n.art-video-player[data-flip=\"vertical\"] .art-video {\n  transform: scaleY(-1);\n}\n\n.art-video-player .art-layer-miniProgressBar {\n  height: 2px;\n  background-color: var(--theme);\n  display: block;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n\n.art-video-player .art-layer-lock {\n  height: 34px;\n  width: 34px;\n  color: #fff;\n  background-color: #00000080;\n  border-radius: 50%;\n  justify-content: center;\n  align-items: center;\n  display: none;\n  position: absolute;\n  top: calc(50% - 17px);\n  left: 15px;\n}\n\n.art-video-player.art-lock .art-bottom {\n  display: none !important;\n}\n\n.art-video-player.art-lock .art-subtitle {\n  bottom: 10px !important;\n}\n\n.art-video-player.art-lock .art-layer-miniProgressBar {\n  display: block !important;\n}\n\n.art-video-player.art-control-show .art-layer-miniProgressBar {\n  display: none;\n}\n\n.art-video-player.art-control-show .art-layer-lock {\n  display: flex;\n}\n\n.art-video-player .art-control-selector {\n  position: relative;\n}\n\n.art-video-player .art-control-selector .art-selector-list {\n  min-width: 100px;\n  max-width: 200px;\n  max-height: 200px;\n  text-align: center;\n  color: #fff;\n  background-color: #000c;\n  border-radius: 3px;\n  padding: 5px 0;\n  display: none;\n  position: absolute;\n  bottom: 35px;\n  overflow: auto;\n}\n\n.art-video-player .art-control-selector .art-selector-list .art-selector-item {\n  height: 30px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-shadow: 0 0 2px #00000080;\n  padding: 0 5px;\n  line-height: 30px;\n  overflow: hidden;\n}\n\n.art-video-player .art-control-selector .art-selector-list .art-selector-item:hover {\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-control-selector .art-selector-list .art-selector-item:hover, .art-video-player .art-control-selector .art-selector-list .art-selector-item.art-current {\n  color: #00c9ff;\n}\n\n.art-video-player .art-control-selector:hover .art-selector-list {\n  display: block;\n}\n\n";



class $a2113e5ff6e5df5a$export$2e2bcd8739ae039 {
    on(name, fn, ctx) {
        const e = this.e || (this.e = {});
        (e[name] || (e[name] = [])).push({
            fn: fn,
            ctx: ctx
        });
        return this;
    }
    once(name, fn, ctx) {
        const self = this;
        function listener(...args) {
            self.off(name, listener);
            fn.apply(ctx, args);
        }
        listener._ = fn;
        return this.on(name, listener, ctx);
    }
    emit(name, ...data) {
        const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        for(let i = 0; i < evtArr.length; i += 1)evtArr[i].fn.apply(evtArr[i].ctx, data);
        return this;
    }
    off(name, callback) {
        const e = this.e || (this.e = {});
        const evts = e[name];
        const liveEvents = [];
        if (evts && callback) {
            for(let i = 0, len = evts.length; i < len; i += 1)if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
        }
        if (liveEvents.length) e[name] = liveEvents;
        else delete e[name];
        return this;
    }
}


var $719e22089069758c$exports = {};
var $1617d61110f74a7d$exports = {};

$parcel$export($1617d61110f74a7d$exports, "query", () => $1617d61110f74a7d$export$2fa187e846a241c4);
$parcel$export($1617d61110f74a7d$exports, "queryAll", () => $1617d61110f74a7d$export$dcd0d083aa86c355);
$parcel$export($1617d61110f74a7d$exports, "addClass", () => $1617d61110f74a7d$export$d2cf6cd1dc7067d3);
$parcel$export($1617d61110f74a7d$exports, "removeClass", () => $1617d61110f74a7d$export$c2255604a80b4506);
$parcel$export($1617d61110f74a7d$exports, "hasClass", () => $1617d61110f74a7d$export$4ea3d958472af68f);
$parcel$export($1617d61110f74a7d$exports, "append", () => $1617d61110f74a7d$export$10d8903dec122b9d);
$parcel$export($1617d61110f74a7d$exports, "remove", () => $1617d61110f74a7d$export$cd7f480d6b8286c3);
$parcel$export($1617d61110f74a7d$exports, "setStyle", () => $1617d61110f74a7d$export$37a5fde709c1db82);
$parcel$export($1617d61110f74a7d$exports, "setStyles", () => $1617d61110f74a7d$export$ac3d318a39e8020a);
$parcel$export($1617d61110f74a7d$exports, "getStyle", () => $1617d61110f74a7d$export$3d2f074408bd1b82);
$parcel$export($1617d61110f74a7d$exports, "sublings", () => $1617d61110f74a7d$export$cba12de11953f3f1);
$parcel$export($1617d61110f74a7d$exports, "inverseClass", () => $1617d61110f74a7d$export$ff1a70dcfa68e743);
$parcel$export($1617d61110f74a7d$exports, "tooltip", () => $1617d61110f74a7d$export$4e6f96734dfe12f4);
$parcel$export($1617d61110f74a7d$exports, "isInViewport", () => $1617d61110f74a7d$export$157b27307c5a0381);
$parcel$export($1617d61110f74a7d$exports, "includeFromEvent", () => $1617d61110f74a7d$export$89ce434956e92c43);
$parcel$export($1617d61110f74a7d$exports, "replaceElement", () => $1617d61110f74a7d$export$2dfe578f95754f6a);
var $46f6a63658609cc7$exports = {};

$parcel$export($46f6a63658609cc7$exports, "userAgent", () => $46f6a63658609cc7$export$3dcce53a3755dc8c);
$parcel$export($46f6a63658609cc7$exports, "isMobile", () => $46f6a63658609cc7$export$d0a8044dce8ff2fc);
$parcel$export($46f6a63658609cc7$exports, "isSafari", () => $46f6a63658609cc7$export$95df08bae54cb4df);
$parcel$export($46f6a63658609cc7$exports, "isWechat", () => $46f6a63658609cc7$export$c4eaf35627cc1b2);
$parcel$export($46f6a63658609cc7$exports, "isIE", () => $46f6a63658609cc7$export$7e7b1a9668aaed8);
const $46f6a63658609cc7$export$3dcce53a3755dc8c = typeof window !== 'undefined' ? window.navigator.userAgent : '';
const $46f6a63658609cc7$export$d0a8044dce8ff2fc = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test($46f6a63658609cc7$export$3dcce53a3755dc8c);
const $46f6a63658609cc7$export$95df08bae54cb4df = /^((?!chrome|android).)*safari/i.test($46f6a63658609cc7$export$3dcce53a3755dc8c);
const $46f6a63658609cc7$export$c4eaf35627cc1b2 = /MicroMessenger/i.test($46f6a63658609cc7$export$3dcce53a3755dc8c);
const $46f6a63658609cc7$export$7e7b1a9668aaed8 = /MSIE|Trident/i.test($46f6a63658609cc7$export$3dcce53a3755dc8c);


function $1617d61110f74a7d$export$2fa187e846a241c4(selector, parent = document) {
    return parent.querySelector(selector);
}
function $1617d61110f74a7d$export$dcd0d083aa86c355(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}
function $1617d61110f74a7d$export$d2cf6cd1dc7067d3(target, className) {
    return target.classList.add(className);
}
function $1617d61110f74a7d$export$c2255604a80b4506(target, className) {
    return target.classList.remove(className);
}
function $1617d61110f74a7d$export$4ea3d958472af68f(target, className) {
    return target.classList.contains(className);
}
function $1617d61110f74a7d$export$10d8903dec122b9d(parent, child) {
    if (child instanceof Element) parent.appendChild(child);
    else parent.insertAdjacentHTML('beforeend', String(child));
    return parent.lastElementChild || parent.lastChild;
}
function $1617d61110f74a7d$export$cd7f480d6b8286c3(child) {
    return child.parentNode.removeChild(child);
}
function $1617d61110f74a7d$export$37a5fde709c1db82(element, key, value) {
    element.style[key] = value;
    return element;
}
function $1617d61110f74a7d$export$ac3d318a39e8020a(element, styles) {
    Object.keys(styles).forEach((key)=>{
        $1617d61110f74a7d$export$37a5fde709c1db82(element, key, styles[key]);
    });
    return element;
}
function $1617d61110f74a7d$export$3d2f074408bd1b82(element, key, numberType = true) {
    const value = window.getComputedStyle(element, null).getPropertyValue(key);
    return numberType ? parseFloat(value) : value;
}
function $1617d61110f74a7d$export$cba12de11953f3f1(target) {
    return Array.from(target.parentElement.children).filter((item)=>item !== target
    );
}
function $1617d61110f74a7d$export$ff1a70dcfa68e743(target, className) {
    $1617d61110f74a7d$export$cba12de11953f3f1(target).forEach((item)=>$1617d61110f74a7d$export$c2255604a80b4506(item, className)
    );
    $1617d61110f74a7d$export$d2cf6cd1dc7067d3(target, className);
}
function $1617d61110f74a7d$export$4e6f96734dfe12f4(target, msg, pos = 'up') {
    if ($46f6a63658609cc7$export$d0a8044dce8ff2fc) return;
    target.setAttribute('aria-label', msg);
    target.setAttribute('data-balloon-pos', pos);
}
function $1617d61110f74a7d$export$157b27307c5a0381(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top - offset <= windowHeight && rect.top + rect.height + offset >= 0;
    const horInView = rect.left - offset <= windowWidth + offset && rect.left + rect.width + offset >= 0;
    return vertInView && horInView;
}
function $1617d61110f74a7d$export$89ce434956e92c43(event, target) {
    return event.composedPath && event.composedPath().indexOf(target) > -1;
}
function $1617d61110f74a7d$export$2dfe578f95754f6a(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
    return newChild;
}


var $9f39e86245920cd9$exports = {};

$parcel$export($9f39e86245920cd9$exports, "ArtPlayerError", () => $9f39e86245920cd9$export$8f14b18212bb1ea5);
$parcel$export($9f39e86245920cd9$exports, "errorHandle", () => $9f39e86245920cd9$export$ff496a5a51be1527);
class $9f39e86245920cd9$export$8f14b18212bb1ea5 extends Error {
    constructor(message, context){
        super(message);
        if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(this, context || this.constructor);
        this.name = 'ArtPlayerError';
    }
}
function $9f39e86245920cd9$export$ff496a5a51be1527(condition, msg) {
    if (!condition) throw new $9f39e86245920cd9$export$8f14b18212bb1ea5(msg);
    return condition;
}


var $3bd617987c2ca385$exports = {};

$parcel$export($3bd617987c2ca385$exports, "srtToVtt", () => $3bd617987c2ca385$export$5ae19f500bb84e8b);
$parcel$export($3bd617987c2ca385$exports, "vttToBlob", () => $3bd617987c2ca385$export$108f84c95df61951);
$parcel$export($3bd617987c2ca385$exports, "assToVtt", () => $3bd617987c2ca385$export$aaf95c443eb8118a);
function $3bd617987c2ca385$export$5ae19f500bb84e8b(srtText) {
    return 'WEBVTT \r\n\r\n'.concat(srtText.replace(/{[\s\S]*?}/g, '').replace(/\{\\([ibu])\}/g, '</$1>').replace(/\{\\([ibu])1\}/g, '<$1>').replace(/\{([ibu])\}/g, '<$1>').replace(/\{\/([ibu])\}/g, '</$1>').replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2').concat('\r\n\r\n'));
}
function $3bd617987c2ca385$export$108f84c95df61951(vttText) {
    return URL.createObjectURL(new Blob([
        vttText
    ], {
        type: 'text/vtt'
    }));
}
function $3bd617987c2ca385$export$aaf95c443eb8118a(ass) {
    const reAss = new RegExp("Dialogue:\\s\\d,(\\d+:\\d\\d:\\d\\d.\\d\\d),(\\d+:\\d\\d:\\d\\d.\\d\\d),([^,]*),([^,]*),(?:[^,]*,){4}([\\s\\S]*)$", 'i');
    function fixTime(time = '') {
        return time.split(/[:.]/).map((item, index, arr)=>{
            if (index === arr.length - 1) {
                if (item.length === 1) return `.${item}00`;
                if (item.length === 2) return `.${item}0`;
            } else if (item.length === 1) return (index === 0 ? '0' : ':0') + item;
            // eslint-disable-next-line no-nested-ternary
            return index === 0 ? item : index === arr.length - 1 ? `.${item}` : `:${item}`;
        }).join('');
    }
    return `WEBVTT\n\n${ass.split(/\r?\n/).map((line)=>{
        const m = line.match(reAss);
        if (!m) return null;
        return {
            start: fixTime(m[1].trim()),
            end: fixTime(m[2].trim()),
            text: m[5].replace(/{[\s\S]*?}/g, '').replace(/(\\N)/g, '\n').trim().split(/\r?\n/).map((item)=>item.trim()
            ).join('\n')
        };
    }).filter((line)=>line
    ).map((line, index)=>{
        if (line) return `${index + 1}\n${line.start} --> ${line.end}\n${line.text}`;
        return '';
    }).filter((line)=>line.trim()
    ).join('\n\n')}`;
}


var $112d5cbf48554e5f$exports = {};

$parcel$export($112d5cbf48554e5f$exports, "getExt", () => $112d5cbf48554e5f$export$ba319cdd039ba52e);
$parcel$export($112d5cbf48554e5f$exports, "download", () => $112d5cbf48554e5f$export$24422be91ad4011f);
function $112d5cbf48554e5f$export$ba319cdd039ba52e(url) {
    if (url.includes('?')) return $112d5cbf48554e5f$export$ba319cdd039ba52e(url.split('?')[0]);
    if (url.includes('#')) return $112d5cbf48554e5f$export$ba319cdd039ba52e(url.split('#')[0]);
    return url.trim().toLowerCase().split('.').pop();
}
function $112d5cbf48554e5f$export$24422be91ad4011f(url, name) {
    const elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
}


var $6b21bd176607d26d$exports = {};

$parcel$export($6b21bd176607d26d$exports, "def", () => $6b21bd176607d26d$export$8afb76124cf08683);
$parcel$export($6b21bd176607d26d$exports, "has", () => $6b21bd176607d26d$export$a4f4bb6b1453fff5);
$parcel$export($6b21bd176607d26d$exports, "get", () => $6b21bd176607d26d$export$3988ae62b71be9a3);
$parcel$export($6b21bd176607d26d$exports, "mergeDeep", () => $6b21bd176607d26d$export$dd702b3c8240390c);
const $6b21bd176607d26d$export$8afb76124cf08683 = Object.defineProperty;
const { hasOwnProperty: $6b21bd176607d26d$var$hasOwnProperty  } = Object.prototype;
function $6b21bd176607d26d$export$a4f4bb6b1453fff5(obj, name) {
    return $6b21bd176607d26d$var$hasOwnProperty.call(obj, name);
}
function $6b21bd176607d26d$export$3988ae62b71be9a3(obj, name) {
    return Object.getOwnPropertyDescriptor(obj, name);
}
function $6b21bd176607d26d$export$dd702b3c8240390c(...objects) {
    const isObject = (item)=>item && typeof item === 'object' && !Array.isArray(item)
    ;
    return objects.reduce((prev, obj)=>{
        Object.keys(obj).forEach((key)=>{
            const pVal = prev[key];
            const oVal = obj[key];
            if (Array.isArray(pVal) && Array.isArray(oVal)) prev[key] = pVal.concat(...oVal);
            else if (isObject(pVal) && isObject(oVal) && !(oVal instanceof Element)) prev[key] = $6b21bd176607d26d$export$dd702b3c8240390c(pVal, oVal);
            else prev[key] = oVal;
        });
        return prev;
    }, {});
}


var $c4508bb07fd554bb$exports = {};

$parcel$export($c4508bb07fd554bb$exports, "sleep", () => $c4508bb07fd554bb$export$e772c8ff12451969);
$parcel$export($c4508bb07fd554bb$exports, "debounce", () => $c4508bb07fd554bb$export$61fc7d43ac8f84b0);
$parcel$export($c4508bb07fd554bb$exports, "throttle", () => $c4508bb07fd554bb$export$de363e709c412c8a);
function $c4508bb07fd554bb$export$e772c8ff12451969(ms = 0) {
    return new Promise((resolve)=>setTimeout(resolve, ms)
    );
}
function $c4508bb07fd554bb$export$61fc7d43ac8f84b0(func, wait, context) {
    let timeout;
    function fn(...args) {
        const later = function later() {
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
function $c4508bb07fd554bb$export$de363e709c412c8a(callback, delay) {
    let isThrottled = false;
    let args;
    let context;
    function fn(...args2) {
        if (isThrottled) {
            args = args2;
            context = this;
            return;
        }
        isThrottled = true;
        callback.apply(this, args2);
        setTimeout(()=>{
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


var $f82eff12ae1758cb$exports = {};

$parcel$export($f82eff12ae1758cb$exports, "clamp", () => $f82eff12ae1758cb$export$7d15b64cf5a3a4c4);
$parcel$export($f82eff12ae1758cb$exports, "secondToTime", () => $f82eff12ae1758cb$export$bfdd1c721864a50a);
$parcel$export($f82eff12ae1758cb$exports, "escape", () => $f82eff12ae1758cb$export$4e7f196112fea3c5);
function $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}
function $f82eff12ae1758cb$export$bfdd1c721864a50a(second) {
    const add0 = (num)=>num < 10 ? `0${num}` : String(num)
    ;
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    const sec = Math.floor(second - hour * 3600 - min * 60);
    return (hour > 0 ? [
        hour,
        min,
        sec
    ] : [
        min,
        sec
    ]).map(add0).join(':');
}
function $f82eff12ae1758cb$export$4e7f196112fea3c5(str) {
    return str.replace(/[&<>'"]/g, (tag)=>({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        })[tag] || tag
    );
}



$parcel$exportWildcard($719e22089069758c$exports, $1617d61110f74a7d$exports);
$parcel$exportWildcard($719e22089069758c$exports, $9f39e86245920cd9$exports);
$parcel$exportWildcard($719e22089069758c$exports, $3bd617987c2ca385$exports);
$parcel$exportWildcard($719e22089069758c$exports, $112d5cbf48554e5f$exports);
$parcel$exportWildcard($719e22089069758c$exports, $6b21bd176607d26d$exports);
$parcel$exportWildcard($719e22089069758c$exports, $c4508bb07fd554bb$exports);
$parcel$exportWildcard($719e22089069758c$exports, $f82eff12ae1758cb$exports);
$parcel$exportWildcard($719e22089069758c$exports, $46f6a63658609cc7$exports);



const $10469c873ed71d57$var$a = 'array';
const $10469c873ed71d57$var$b = 'boolean';
const $10469c873ed71d57$var$s = 'string';
const $10469c873ed71d57$var$n = 'number';
const $10469c873ed71d57$var$o = 'object';
const $10469c873ed71d57$var$f = 'function';
const $10469c873ed71d57$var$r = 'regexp';
function $10469c873ed71d57$var$validElement(value, type, paths) {
    return $9f39e86245920cd9$export$ff496a5a51be1527(type === $10469c873ed71d57$var$s || value instanceof Element, `${paths.join('.')} require '${$10469c873ed71d57$var$s}' or 'Element' type`);
}
const $10469c873ed71d57$export$fa4c546e01a0c57c = {
    html: $10469c873ed71d57$var$validElement,
    disable: `?${$10469c873ed71d57$var$b}`,
    name: `?${$10469c873ed71d57$var$s}`,
    index: `?${$10469c873ed71d57$var$n}`,
    style: `?${$10469c873ed71d57$var$o}`,
    click: `?${$10469c873ed71d57$var$f}`,
    mounted: `?${$10469c873ed71d57$var$f}`,
    tooltip: `?${$10469c873ed71d57$var$s}`,
    width: `?${$10469c873ed71d57$var$n}`,
    selector: `?${$10469c873ed71d57$var$a}`,
    onSelect: `?${$10469c873ed71d57$var$f}`
};
var $10469c873ed71d57$export$2e2bcd8739ae039 = {
    container: $10469c873ed71d57$var$validElement,
    url: $10469c873ed71d57$var$s,
    poster: $10469c873ed71d57$var$s,
    title: $10469c873ed71d57$var$s,
    type: $10469c873ed71d57$var$s,
    theme: $10469c873ed71d57$var$s,
    lang: $10469c873ed71d57$var$s,
    volume: $10469c873ed71d57$var$n,
    isLive: $10469c873ed71d57$var$b,
    muted: $10469c873ed71d57$var$b,
    autoplay: $10469c873ed71d57$var$b,
    autoSize: $10469c873ed71d57$var$b,
    autoMini: $10469c873ed71d57$var$b,
    loop: $10469c873ed71d57$var$b,
    flip: $10469c873ed71d57$var$b,
    playbackRate: $10469c873ed71d57$var$b,
    aspectRatio: $10469c873ed71d57$var$b,
    screenshot: $10469c873ed71d57$var$b,
    setting: $10469c873ed71d57$var$b,
    hotkey: $10469c873ed71d57$var$b,
    pip: $10469c873ed71d57$var$b,
    mutex: $10469c873ed71d57$var$b,
    backdrop: $10469c873ed71d57$var$b,
    fullscreen: $10469c873ed71d57$var$b,
    fullscreenWeb: $10469c873ed71d57$var$b,
    subtitleOffset: $10469c873ed71d57$var$b,
    miniProgressBar: $10469c873ed71d57$var$b,
    useSSR: $10469c873ed71d57$var$b,
    playsInline: $10469c873ed71d57$var$b,
    lock: $10469c873ed71d57$var$b,
    fastForward: $10469c873ed71d57$var$b,
    autoPlayback: $10469c873ed71d57$var$b,
    autoOrientation: $10469c873ed71d57$var$b,
    ads: [
        {
            url: $10469c873ed71d57$var$s
        }, 
    ],
    plugins: [
        $10469c873ed71d57$var$f
    ],
    whitelist: [
        `${$10469c873ed71d57$var$s}|${$10469c873ed71d57$var$f}|${$10469c873ed71d57$var$r}`
    ],
    layers: [
        $10469c873ed71d57$export$fa4c546e01a0c57c
    ],
    contextmenu: [
        $10469c873ed71d57$export$fa4c546e01a0c57c
    ],
    settings: [
        $10469c873ed71d57$export$fa4c546e01a0c57c
    ],
    controls: [
        {
            ...$10469c873ed71d57$export$fa4c546e01a0c57c,
            position: (value, _, paths)=>{
                const position = [
                    'top',
                    'left',
                    'right'
                ];
                return $9f39e86245920cd9$export$ff496a5a51be1527(position.includes(value), `${paths.join('.')} only accept ${position.toString()} as parameters`);
            }
        }, 
    ],
    quality: [
        {
            default: `?${$10469c873ed71d57$var$b}`,
            html: $10469c873ed71d57$var$s,
            url: $10469c873ed71d57$var$s
        }, 
    ],
    highlight: [
        {
            time: $10469c873ed71d57$var$n,
            text: $10469c873ed71d57$var$s
        }, 
    ],
    thumbnails: {
        url: $10469c873ed71d57$var$s,
        number: $10469c873ed71d57$var$n,
        column: $10469c873ed71d57$var$n
    },
    subtitle: {
        url: $10469c873ed71d57$var$s,
        type: $10469c873ed71d57$var$s,
        style: $10469c873ed71d57$var$o,
        encoding: $10469c873ed71d57$var$s
    },
    moreVideoAttr: $10469c873ed71d57$var$o,
    icons: $10469c873ed71d57$var$o,
    customType: $10469c873ed71d57$var$o
};


var $6bdef3f9911d4dfd$export$2e2bcd8739ae039 = {
    propertys: [
        'audioTracks',
        'autoplay',
        'buffered',
        'controller',
        'controls',
        'crossOrigin',
        'currentSrc',
        'currentTime',
        'defaultMuted',
        'defaultPlaybackRate',
        'duration',
        'ended',
        'error',
        'loop',
        'mediaGroup',
        'muted',
        'networkState',
        'paused',
        'playbackRate',
        'played',
        'preload',
        'readyState',
        'seekable',
        'seeking',
        'src',
        'startDate',
        'textTracks',
        'videoTracks',
        'volume', 
    ],
    methods: [
        'addTextTrack',
        'canPlayType',
        'load',
        'play',
        'pause'
    ],
    events: [
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'seeked',
        'seeking',
        'stalled',
        'suspend',
        'timeupdate',
        'volumechange',
        'waiting', 
    ],
    prototypes: [
        "width",
        "height",
        "videoWidth",
        "videoHeight",
        "poster",
        "webkitDecodedFrameCount",
        "webkitDroppedFrameCount",
        "playsInline",
        "webkitSupportsFullscreen",
        "webkitDisplayingFullscreen",
        "onenterpictureinpicture",
        "onleavepictureinpicture",
        "disablePictureInPicture",
        "cancelVideoFrameCallback",
        "requestVideoFrameCallback",
        "getVideoPlaybackQuality",
        "requestPictureInPicture",
        "webkitEnterFullScreen",
        "webkitEnterFullscreen",
        "webkitExitFullScreen",
        "webkitExitFullscreen", 
    ]
};



class $63bba146437a34c3$export$2e2bcd8739ae039 {
    constructor(art){
        this.art = art;
    }
    get state() {
        const { option: option , constructor: { kindOf: kindOf  } ,  } = this.art;
        return !$46f6a63658609cc7$export$d0a8044dce8ff2fc || option.whitelist.some((item)=>{
            switch(kindOf(item)){
                case 'string':
                    return item === '*' || $46f6a63658609cc7$export$3dcce53a3755dc8c.indexOf(item) > -1;
                case 'function':
                    return item($46f6a63658609cc7$export$3dcce53a3755dc8c);
                case 'regexp':
                    return item.test($46f6a63658609cc7$export$3dcce53a3755dc8c);
                default:
                    return false;
            }
        });
    }
}



class $420c1882d92b952b$export$2e2bcd8739ae039 {
    constructor(art){
        this.art = art;
        const { option: option , constructor: constructor , whitelist: whitelist  } = art;
        if (option.container instanceof Element) this.$container = option.container;
        else {
            this.$container = $1617d61110f74a7d$export$2fa187e846a241c4(option.container);
            $9f39e86245920cd9$export$ff496a5a51be1527(this.$container, `No container element found by ${option.container}`);
        }
        const type = this.$container.tagName.toLowerCase();
        $9f39e86245920cd9$export$ff496a5a51be1527(type === 'div', `Unsupported container element type, only support 'div' but got '${type}'`);
        $9f39e86245920cd9$export$ff496a5a51be1527(constructor.instances.every((ins)=>ins.template.$container !== this.$container
        ), 'Cannot mount multiple instances on the same dom element');
        this.query = this.query.bind(this);
        this.$container.dataset.artId = art.id;
        this.$original = this.$container.cloneNode(true);
        if (whitelist.state) this.desktop();
        else this.mobile();
    }
    static get html() {
        return `
          <div class="art-video-player art-subtitle-show art-layer-show">
            <video class="art-video"></video>
            <div class="art-poster"></div>
            <div class="art-subtitle"></div>
            <div class="art-danmuku"></div>
            <div class="art-layers"></div>
            <div class="art-mask">
              <div class="art-state"></div>
            </div>
            <div class="art-bottom">
              <div class="art-progress"></div>
              <div class="art-controls">
                <div class="art-controls-left"></div>
                <div class="art-controls-right"></div>
              </div>
            </div>
            <div class="art-loading"></div>
            <div class="art-notice">
              <div class="art-notice-inner"></div>
            </div>
            <div class="art-settings"></div>
            <div class="art-info">
              <div class="art-info-panel">
                <div class="art-info-item">
                  <div class="art-info-title">Player version:</div>
                  <div class="art-info-content">__VERSION__</div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video url:</div>
                  <div class="art-info-content" data-video="src"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video volume:</div>
                  <div class="art-info-content" data-video="volume"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video time:</div>
                  <div class="art-info-content" data-video="currentTime"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video duration:</div>
                  <div class="art-info-content" data-video="duration"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video resolution:</div>
                  <div class="art-info-content">
                    <span data-video="videoWidth"></span> x <span data-video="videoHeight"></span>
                  </div>
                </div>
              </div>
              <div class="art-info-close">[x]</div>
            </div>
            <div class="art-mini-header">
              <div class="art-mini-title"></div>
              <div class="art-mini-close">×</div>
            </div>
            <div class="art-contextmenus"></div>
          </div>
        `;
    }
    query(className) {
        return $1617d61110f74a7d$export$2fa187e846a241c4(className, this.$container);
    }
    desktop() {
        const { option: option  } = this.art;
        if (!option.useSSR) this.$container.innerHTML = $420c1882d92b952b$export$2e2bcd8739ae039.html;
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
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3(this.$setting, 'art-backdrop-filter');
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3(this.$contextmenu, 'art-backdrop-filter');
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3(this.$info, 'art-backdrop-filter');
        }
        if ($46f6a63658609cc7$export$d0a8044dce8ff2fc) $1617d61110f74a7d$export$d2cf6cd1dc7067d3(this.$player, 'art-mobile');
    }
    mobile() {
        this.$container.innerHTML = `
          <div class="art-video-player">
            <video class="art-video"></video>
          </div>
        `;
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
    }
    destroy(removeHtml) {
        if (removeHtml) $1617d61110f74a7d$export$2dfe578f95754f6a(this.$original, this.$container);
        else $1617d61110f74a7d$export$d2cf6cd1dc7067d3(this.$player, 'art-destroy');
    }
}



var $57e51b10b335e0fc$exports = {};
$57e51b10b335e0fc$exports = JSON.parse("{\"Video Info\":\"统计信息\",\"Close\":\"关闭\",\"Video Load Failed\":\"加载失败\",\"Volume\":\"音量\",\"Play\":\"播放\",\"Pause\":\"暂停\",\"Rate\":\"速度\",\"Mute\":\"静音\",\"Video Flip\":\"画面翻转\",\"Horizontal\":\"水平\",\"Vertical\":\"垂直\",\"Reconnect\":\"重新连接\",\"Hide Subtitle\":\"隐藏字幕\",\"Show Subtitle\":\"显示字幕\",\"Show Setting\":\"显示设置\",\"Hide Setting\":\"隐藏设置\",\"Screenshot\":\"截图\",\"Play Speed\":\"播放速度\",\"Aspect Ratio\":\"画面比例\",\"Default\":\"默认\",\"Normal\":\"正常\",\"Open\":\"打开\",\"Switch Video\":\"切换\",\"Switch Subtitle\":\"切换字幕\",\"Fullscreen\":\"全屏\",\"Exit Fullscreen\":\"退出全屏\",\"Web Fullscreen\":\"网页全屏\",\"Exit Web Fullscreen\":\"退出网页全屏\",\"Mini Player\":\"迷你播放器\",\"PIP Mode\":\"画中画模式\",\"Exit PIP Mode\":\"退出画中画模式\",\"PIP Not Supported\":\"不支持画中画模式\",\"Fullscreen Not Supported\":\"不支持全屏模式\",\"Subtitle Offset\":\"字幕偏移\",\"Auto playback at\":\"已为您定位至\"}");


var $84381ae66b9700b3$exports = {};
$84381ae66b9700b3$exports = JSON.parse("{\"Video Info\":\"統計訊息\",\"Close\":\"關閉\",\"Video Load Failed\":\"載入失敗\",\"Volume\":\"音量\",\"Play\":\"播放\",\"Pause\":\"暫停\",\"Rate\":\"速度\",\"Mute\":\"靜音\",\"Video Flip\":\"畫面翻轉\",\"Horizontal\":\"水平\",\"Vertical\":\"垂直\",\"Reconnect\":\"重新連接\",\"Hide Subtitle\":\"隱藏字幕\",\"Show Subtitle\":\"顯示字幕\",\"Show Setting\":\"顯示设置\",\"Hide Setting\":\"隱藏设置\",\"Screenshot\":\"截圖\",\"Play Speed\":\"播放速度\",\"Aspect Ratio\":\"畫面比例\",\"Default\":\"默認\",\"Normal\":\"正常\",\"Open\":\"打開\",\"Switch Video\":\"切換\",\"Switch Subtitle\":\"切換字幕\",\"Fullscreen\":\"全屏\",\"Exit Fullscreen\":\"退出全屏\",\"Web Fullscreen\":\"網頁全屏\",\"Exit Web Fullscreen\":\"退出網頁全屏\",\"Mini Player\":\"迷你播放器\",\"PIP Mode\":\"畫中畫模式\",\"Exit PIP Mode\":\"退出畫中畫模式\",\"PIP Not Supported\":\"不支持畫中畫模式\",\"Fullscreen Not Supported\":\"不支持全屏模式\",\"Subtitle Offset\":\"字幕偏移\",\"Auto playback at\":\"已為您定位至\"}");


class $8988e731cb9b6b27$export$2e2bcd8739ae039 {
    constructor(art){
        this.art = art;
        this.languages = {
            'zh-cn': (/*@__PURE__*/$parcel$interopDefault($57e51b10b335e0fc$exports)),
            'zh-tw': (/*@__PURE__*/$parcel$interopDefault($84381ae66b9700b3$exports))
        };
        this.init();
    }
    init() {
        const lang = this.art.option.lang.toLowerCase();
        this.language = this.languages[lang] || {};
    }
    get(key) {
        return this.language[key] || key;
    }
    update(value) {
        this.languages = $6b21bd176607d26d$export$dd702b3c8240390c(this.languages, value);
        this.init();
    }
}



function $78588f8b73477893$export$2e2bcd8739ae039(art) {
    const { option: option , template: { $video: $video  } ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'url', {
        get () {
            return $video.currentSrc;
        },
        set (url) {
            const typeName = option.type || $112d5cbf48554e5f$export$ba319cdd039ba52e(url);
            const typeCallback = option.customType[typeName];
            if (typeName && typeCallback) $c4508bb07fd554bb$export$e772c8ff12451969().then(()=>{
                art.loading.show = true;
                typeCallback.call(art, $video, url, art);
            });
            else {
                if (art.url && art.url !== url) art.once('video:canplay', ()=>{
                    if (art.isReady) art.emit('restart');
                });
                $video.src = url;
                art.option.url = url;
                art.emit('url', url);
            }
        }
    });
}



function $be98068739fad791$export$2e2bcd8739ae039(art) {
    const { template: { $video: $video  } ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'attr', {
        value (key, value) {
            if (value === undefined) return $video[key];
            $video[key] = value;
        }
    });
}



function $72450db29b4a0619$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , notice: notice , option: option , constructor: { instances: instances  } , template: { $video: $video  } ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'play', {
        value () {
            const promise = $video.play();
            if (promise && promise.then) promise.then().catch((err)=>{
                notice.show = err;
                throw err;
            });
            if (option.mutex) for(let index = 0; index < instances.length; index++){
                const instance = instances[index];
                if (instance !== art) instance.pause();
            }
            notice.show = i18n.get('Play');
            art.emit('play');
            return promise;
        }
    });
}



function $c8c1874114a1e9a2$export$2e2bcd8739ae039(art) {
    const { template: { $video: $video  } , i18n: i18n , notice: notice ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'pause', {
        value () {
            const result = $video.pause();
            notice.show = i18n.get('Pause');
            art.emit('pause');
            return result;
        }
    });
}



function $b0ce1df3a2786735$export$2e2bcd8739ae039(art) {
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'toggle', {
        value () {
            if (art.playing) return art.pause();
            else return art.play();
        }
    });
}



function $97cc863b08e0c30f$export$2e2bcd8739ae039(art) {
    const { notice: notice  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'seek', {
        set (time) {
            art.currentTime = time;
            art.emit('seek', art.currentTime);
            if (art.duration) notice.show = `${$f82eff12ae1758cb$export$bfdd1c721864a50a(art.currentTime)} / ${$f82eff12ae1758cb$export$bfdd1c721864a50a(art.duration)}`;
        }
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'forward', {
        set (time) {
            art.seek = art.currentTime + time;
        }
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'backward', {
        set (time) {
            art.seek = art.currentTime - time;
        }
    });
}



function $1873c8304570ae71$export$2e2bcd8739ae039(art) {
    const { template: { $video: $video  } , i18n: i18n , notice: notice , storage: storage ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'volume', {
        get: ()=>$video.volume || 0
        ,
        set: (percentage)=>{
            $video.volume = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(percentage, 0, 1);
            notice.show = `${i18n.get('Volume')}: ${parseInt($video.volume * 100, 10)}`;
            if ($video.volume !== 0) storage.set('volume', $video.volume);
            art.emit('volume', $video.volume);
        }
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'muted', {
        get: ()=>$video.muted
        ,
        set: (muted)=>{
            $video.muted = muted;
            art.emit('volume', $video.volume);
        }
    });
}



function $0ac9b78c104e6c27$export$2e2bcd8739ae039(art) {
    const { $video: $video  } = art.template;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'currentTime', {
        get: ()=>$video.currentTime || 0
        ,
        set: (time)=>{
            time = parseFloat(time);
            if (Number.isNaN(time)) return;
            $video.currentTime = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(time, 0, art.duration);
        }
    });
}



function $d10941cb97c59aa9$export$2e2bcd8739ae039(art) {
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'duration', {
        get: ()=>{
            const { duration: duration  } = art.template.$video;
            if (duration === Infinity) return 0;
            return duration || 0;
        }
    });
}



function $9887571a7668b1ac$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , option: option , notice: notice  } = art;
    function switchUrl(url, name, currentTime) {
        return new Promise((resolve)=>{
            if (url === art.url) return resolve(url);
            const { playing: playing  } = art;
            art.pause();
            URL.revokeObjectURL(art.url);
            art.url = url;
            art.once('video:canplay', ()=>{
                art.playbackRate = false;
                art.aspectRatio = false;
                art.flip = 'normal';
                art.autoSize = option.autoSize;
                art.currentTime = currentTime;
                art.notice.show = '';
                if (playing) art.play();
                if (name) notice.show = `${i18n.get('Switch Video')}: ${name}`;
                art.emit('switch', url);
                resolve(url);
            });
        });
    }
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'switchQuality', {
        value: (url, name)=>{
            return switchUrl(url, name, art.currentTime);
        }
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'switchUrl', {
        value: (url, name)=>{
            return switchUrl(url, name, 0);
        }
    });
}



function $76cdd3fd5d9381da$export$2e2bcd8739ae039(art) {
    const { template: { $video: $video  } , i18n: i18n , notice: notice ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'playbackRate', {
        get () {
            return $video.playbackRate;
        },
        set (rate) {
            if (rate) {
                if (rate === $video.playbackRate) return;
                const rateList = [
                    0.25,
                    0.5,
                    0.75,
                    1.0,
                    1.25,
                    1.5,
                    1.75,
                    2.0,
                    3.0,
                    4.0
                ];
                $9f39e86245920cd9$export$ff496a5a51be1527(rateList.includes(rate), `'playbackRate' only accept ${rateList.toString()} as parameters`);
                $video.playbackRate = rate;
                notice.show = `${i18n.get('Rate')}: ${rate === 1.0 ? i18n.get('Normal') : `${rate}x`}`;
                art.emit('playbackRate', rate);
            } else {
                art.playbackRate = 1;
                art.emit('playbackRate');
            }
        }
    });
}



function $1265246d0adfd805$export$2e2bcd8739ae039(art) {
    const { template: { $video: $video , $player: $player  } , i18n: i18n , notice: notice ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'aspectRatio', {
        get () {
            return $player.dataset.aspectRatio || 'default';
        },
        set (ratio) {
            if (!ratio) ratio = 'default';
            const ratioList = [
                'default',
                '4:3',
                '16:9'
            ];
            $9f39e86245920cd9$export$ff496a5a51be1527(ratioList.includes(ratio), `'aspectRatio' only accept ${ratioList.toString()} as parameters`);
            if (ratio === 'default') {
                $1617d61110f74a7d$export$37a5fde709c1db82($video, 'width', null);
                $1617d61110f74a7d$export$37a5fde709c1db82($video, 'height', null);
                $1617d61110f74a7d$export$37a5fde709c1db82($video, 'padding', null);
                delete $player.dataset.aspectRatio;
            } else {
                const ratioArray = ratio.split(':').map(Number);
                const { videoWidth: videoWidth , videoHeight: videoHeight  } = $video;
                const { clientWidth: clientWidth , clientHeight: clientHeight  } = $player;
                const videoRatio = videoWidth / videoHeight;
                const setupRatio = ratioArray[0] / ratioArray[1];
                if (videoRatio > setupRatio) {
                    const percentage = setupRatio * videoHeight / videoWidth;
                    $1617d61110f74a7d$export$37a5fde709c1db82($video, 'width', `${percentage * 100}%`);
                    $1617d61110f74a7d$export$37a5fde709c1db82($video, 'height', '100%');
                    $1617d61110f74a7d$export$37a5fde709c1db82($video, 'padding', `0 ${(clientWidth - clientWidth * percentage) / 2}px`);
                } else {
                    const percentage = videoWidth / setupRatio / videoHeight;
                    $1617d61110f74a7d$export$37a5fde709c1db82($video, 'width', '100%');
                    $1617d61110f74a7d$export$37a5fde709c1db82($video, 'height', `${percentage * 100}%`);
                    $1617d61110f74a7d$export$37a5fde709c1db82($video, 'padding', `${(clientHeight - clientHeight * percentage) / 2}px 0`);
                }
                $player.dataset.aspectRatio = ratio;
            }
            notice.show = `${i18n.get('Aspect Ratio')}: ${ratio === 'default' ? i18n.get('Default') : ratio}`;
            art.emit('aspectRatio', ratio);
        }
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'aspectRatioReset', {
        set (value) {
            if (value) {
                const { aspectRatio: aspectRatio  } = art;
                art.aspectRatio = aspectRatio;
            }
        }
    });
}



function $784e09a0793a81cc$export$2e2bcd8739ae039(art) {
    const { option: option , notice: notice , template: { $video: $video  } ,  } = art;
    const $canvas = document.createElement('canvas');
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'getDataURL', {
        value: ()=>new Promise((resolve, reject)=>{
                try {
                    $canvas.width = $video.videoWidth;
                    $canvas.height = $video.videoHeight;
                    $canvas.getContext('2d').drawImage($video, 0, 0);
                    resolve($canvas.toDataURL('image/png'));
                } catch (err) {
                    notice.show = err;
                    reject(err);
                }
            })
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'getBlobUrl', {
        value: ()=>new Promise((resolve, reject)=>{
                try {
                    $canvas.width = $video.videoWidth;
                    $canvas.height = $video.videoHeight;
                    $canvas.getContext('2d').drawImage($video, 0, 0);
                    $canvas.toBlob((blob)=>{
                        resolve(URL.createObjectURL(blob));
                    });
                } catch (err) {
                    notice.show = err;
                    reject(err);
                }
            })
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'screenshot', {
        value: ()=>{
            return art.getDataURL().then((dataUri)=>{
                $112d5cbf48554e5f$export$24422be91ad4011f(dataUri, `${option.title || 'artplayer'}_${$f82eff12ae1758cb$export$bfdd1c721864a50a($video.currentTime)}.png`);
                art.emit('screenshot', dataUri);
                return dataUri;
            });
        }
    });
}




const $8cb95e120184906b$var$nativeScreenfull = (art)=>{
    const { notice: notice , template: { $player: $player  } ,  } = art;
    ($parcel$interopDefault($cTKjd$screenfull)).on('change', ()=>art.emit('fullscreen', ($parcel$interopDefault($cTKjd$screenfull)).isFullscreen)
    );
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'fullscreen', {
        get () {
            return ($parcel$interopDefault($cTKjd$screenfull)).isFullscreen;
        },
        set (value) {
            if (value) ($parcel$interopDefault($cTKjd$screenfull)).request($player).then(()=>{
                $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-fullscreen');
                art.aspectRatioReset = true;
                art.autoSize = false;
                art.emit('resize');
                art.emit('fullscreen', true);
                notice.show = '';
            });
            else ($parcel$interopDefault($cTKjd$screenfull)).exit().then(()=>{
                $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-fullscreen');
                art.aspectRatioReset = true;
                art.autoSize = art.option.autoSize;
                art.emit('resize');
                art.emit('fullscreen');
                notice.show = '';
            });
        }
    });
};
const $8cb95e120184906b$var$webkitScreenfull = (art)=>{
    const { notice: notice , template: { $video: $video  } ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'fullscreen', {
        get () {
            return $video.webkitDisplayingFullscreen;
        },
        set (value) {
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
function $8cb95e120184906b$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , notice: notice , template: { $video: $video  } ,  } = art;
    art.once('video:loadedmetadata', ()=>{
        if (($parcel$interopDefault($cTKjd$screenfull)).isEnabled) $8cb95e120184906b$var$nativeScreenfull(art);
        else if (document.fullscreenEnabled || $video.webkitSupportsFullscreen) $8cb95e120184906b$var$webkitScreenfull(art);
        else $6b21bd176607d26d$export$8afb76124cf08683(art, 'fullscreen', {
            get () {
                return false;
            },
            set () {
                notice.show = i18n.get('Fullscreen Not Supported');
            }
        });
        // Asynchronous setting
        $6b21bd176607d26d$export$8afb76124cf08683(art, 'fullscreen', $6b21bd176607d26d$export$3988ae62b71be9a3(art, 'fullscreen'));
    });
}



function $314923b44f2751da$export$2e2bcd8739ae039(art) {
    const { notice: notice , template: { $player: $player  } ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'fullscreenWeb', {
        get () {
            return $1617d61110f74a7d$export$4ea3d958472af68f($player, 'art-fullscreen-web');
        },
        set (value) {
            if (value) {
                $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-fullscreen-web');
                art.aspectRatioReset = true;
                art.autoSize = false;
                art.emit('resize');
                art.emit('fullscreenWeb', true);
                notice.show = '';
            } else {
                $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-fullscreen-web');
                art.aspectRatioReset = true;
                art.autoSize = art.option.autoSize;
                art.emit('resize');
                art.emit('fullscreenWeb');
                notice.show = '';
            }
        }
    });
}



function $d73ef059475a783b$var$nativePip(art) {
    const { template: { $video: $video  } , events: { proxy: proxy  } , notice: notice ,  } = art;
    $video.disablePictureInPicture = false;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'pip', {
        get () {
            return document.pictureInPictureElement;
        },
        set (value) {
            if (value) $video.requestPictureInPicture().catch((err)=>{
                notice.show = err;
                throw err;
            });
            else document.exitPictureInPicture().catch((err)=>{
                notice.show = err;
                throw err;
            });
        }
    });
    proxy($video, 'enterpictureinpicture', ()=>{
        art.emit('pip', true);
    });
    proxy($video, 'leavepictureinpicture', ()=>{
        art.emit('pip');
    });
}
function $d73ef059475a783b$var$webkitPip(art) {
    const { $video: $video  } = art.template;
    $video.webkitSetPresentationMode('inline');
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'pip', {
        get () {
            return $video.webkitPresentationMode === 'picture-in-picture';
        },
        set (value) {
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
function $d73ef059475a783b$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , notice: notice , template: { $video: $video  } ,  } = art;
    if (document.pictureInPictureEnabled) $d73ef059475a783b$var$nativePip(art);
    else if ($video.webkitSupportsPresentationMode) $d73ef059475a783b$var$webkitPip(art);
    else $6b21bd176607d26d$export$8afb76124cf08683(art, 'pip', {
        get () {
            return false;
        },
        set () {
            notice.show = i18n.get('PIP Not Supported');
        }
    });
}



function $b22d35e9b748099f$export$2e2bcd8739ae039(art) {
    const { $video: $video  } = art.template;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'loaded', {
        get: ()=>art.loadedTime / $video.duration
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'loadedTime', {
        get: ()=>$video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0
    });
}



function $2fa6e09c649b8299$export$2e2bcd8739ae039(art) {
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'played', {
        get: ()=>art.currentTime / art.duration
    });
}



function $f056beb9f96549cc$export$2e2bcd8739ae039(art) {
    const { $video: $video  } = art.template;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'playing', {
        get: ()=>!!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2)
    });
}



function $d5ebf944f6c02602$export$2e2bcd8739ae039(art) {
    const { $container: $container , $player: $player , $video: $video  } = art.template;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'autoSize', {
        get () {
            return $1617d61110f74a7d$export$4ea3d958472af68f($container, 'art-auto-size');
        },
        set (value) {
            if (value) {
                const { videoWidth: videoWidth , videoHeight: videoHeight  } = $video;
                const { width: width , height: height  } = $container.getBoundingClientRect();
                const videoRatio = videoWidth / videoHeight;
                const containerRatio = width / height;
                $1617d61110f74a7d$export$d2cf6cd1dc7067d3($container, 'art-auto-size');
                if (containerRatio > videoRatio) {
                    const percentage = height * videoRatio / width * 100;
                    $1617d61110f74a7d$export$37a5fde709c1db82($player, 'width', `${percentage}%`);
                    $1617d61110f74a7d$export$37a5fde709c1db82($player, 'height', '100%');
                } else {
                    const percentage = width / videoRatio / height * 100;
                    $1617d61110f74a7d$export$37a5fde709c1db82($player, 'width', '100%');
                    $1617d61110f74a7d$export$37a5fde709c1db82($player, 'height', `${percentage}%`);
                }
                art.emit('autoSize', {
                    width: art.width,
                    height: art.height
                });
            } else {
                $1617d61110f74a7d$export$c2255604a80b4506($container, 'art-auto-size');
                $1617d61110f74a7d$export$37a5fde709c1db82($player, 'width', null);
                $1617d61110f74a7d$export$37a5fde709c1db82($player, 'height', null);
                art.emit('autoSize');
            }
        }
    });
}



function $eb23d3d959cef33c$export$2e2bcd8739ae039(art) {
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'rect', {
        get: ()=>{
            return art.template.$player.getBoundingClientRect();
        }
    });
    const keys = [
        'bottom',
        'height',
        'left',
        'right',
        'top',
        'width'
    ];
    for(let index = 0; index < keys.length; index++){
        const key = keys[index];
        $6b21bd176607d26d$export$8afb76124cf08683(art, key, {
            get: ()=>{
                return art.rect[key];
            }
        });
    }
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'x', {
        get: ()=>{
            return art.left + window.pageXOffset;
        }
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'y', {
        get: ()=>{
            return art.top + window.pageYOffset;
        }
    });
}



function $b0b3bb93ddcc1973$export$2e2bcd8739ae039(art) {
    const { template: { $player: $player  } , i18n: i18n , notice: notice ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'flip', {
        get () {
            return $player.dataset.flip || 'normal';
        },
        set (flip) {
            if (!flip) flip = 'normal';
            const flipList = [
                'normal',
                'horizontal',
                'vertical'
            ];
            $9f39e86245920cd9$export$ff496a5a51be1527(flipList.includes(flip), `'flip' only accept ${flipList.toString()} as parameters`);
            if (flip === 'normal') delete $player.dataset.flip;
            else {
                art.rotate = false;
                $player.dataset.flip = flip;
            }
            const word = flip.replace(flip[0], flip[0].toUpperCase());
            notice.show = `${i18n.get('Video Flip')}: ${i18n.get(word)}`;
            art.emit('flip', flip);
        }
    });
}



function $dcdd6d111014332f$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , option: option , storage: storage , events: { proxy: proxy  } , template: { $player: $player , $miniClose: $miniClose , $miniTitle: $miniTitle , $miniHeader: $miniHeader  } ,  } = art;
    let cacheStyle = '';
    let isDroging = false;
    let lastPageX = 0;
    let lastPageY = 0;
    let lastPlayerLeft = 0;
    let lastPlayerTop = 0;
    proxy($miniHeader, 'mousedown', (event)=>{
        isDroging = true;
        lastPageX = event.pageX;
        lastPageY = event.pageY;
        lastPlayerLeft = art.left;
        lastPlayerTop = art.top;
    });
    proxy(document, 'mousemove', (event)=>{
        if (isDroging) {
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-is-dragging');
            const top = lastPlayerTop + event.pageY - lastPageY;
            const left = lastPlayerLeft + event.pageX - lastPageX;
            $1617d61110f74a7d$export$37a5fde709c1db82($player, 'top', `${top}px`);
            $1617d61110f74a7d$export$37a5fde709c1db82($player, 'left', `${left}px`);
            storage.set('top', top);
            storage.set('left', left);
        }
    });
    proxy(document, 'mouseup', ()=>{
        isDroging = false;
        $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-is-dragging');
    });
    proxy($miniClose, 'click', ()=>{
        art.mini = false;
        isDroging = false;
        $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-is-dragging');
    });
    $1617d61110f74a7d$export$10d8903dec122b9d($miniTitle, option.title || i18n.get('Mini Player'));
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'mini', {
        get () {
            return $1617d61110f74a7d$export$4ea3d958472af68f($player, 'art-mini');
        },
        set (value) {
            if (value) {
                art.autoSize = false;
                cacheStyle = $player.style.cssText;
                $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-mini');
                const top = storage.get('top');
                const left = storage.get('left');
                if (top && left) {
                    $1617d61110f74a7d$export$37a5fde709c1db82($player, 'top', `${top}px`);
                    $1617d61110f74a7d$export$37a5fde709c1db82($player, 'left', `${left}px`);
                    if (!$1617d61110f74a7d$export$157b27307c5a0381($miniHeader)) {
                        storage.del('top');
                        storage.del('left');
                        art.mini = true;
                    }
                } else {
                    const $body = document.body;
                    const top = $body.clientHeight - art.height - 50;
                    const left = $body.clientWidth - art.width - 50;
                    storage.set('top', top);
                    storage.set('left', left);
                    $1617d61110f74a7d$export$37a5fde709c1db82($player, 'top', `${top}px`);
                    $1617d61110f74a7d$export$37a5fde709c1db82($player, 'left', `${left}px`);
                }
                art.aspectRatio = false;
                art.playbackRate = false;
                art.notice.show = '';
                art.emit('mini', true);
            } else {
                $player.style.cssText = cacheStyle;
                $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-mini');
                $1617d61110f74a7d$export$37a5fde709c1db82($player, 'top', null);
                $1617d61110f74a7d$export$37a5fde709c1db82($player, 'left', null);
                art.aspectRatio = false;
                art.playbackRate = false;
                art.autoSize = option.autoSize;
                art.notice.show = '';
                art.emit('mini');
            }
        }
    });
}



function $83e125d00c630381$export$2e2bcd8739ae039(art) {
    let interval = [];
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'loop', {
        get: ()=>interval
        ,
        set: (value)=>{
            if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
                const start = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(value[0], 0, Math.min(value[1], art.duration));
                const end = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(value[1], start, art.duration);
                if (end - start >= 1) {
                    interval = [
                        start,
                        end
                    ];
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
    art.on('video:timeupdate', ()=>{
        if (interval.length) {
            if (art.currentTime < interval[0] || art.currentTime > interval[1]) art.seek = interval[0];
        }
    });
}



function $91dc1e363cc97ed1$export$2e2bcd8739ae039(art) {
    const { option: option , template: { $poster: $poster  } ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'poster', {
        get: ()=>option.poster
        ,
        set (url) {
            option.poster = url;
            $1617d61110f74a7d$export$37a5fde709c1db82($poster, 'backgroundImage', `url(${url})`);
        }
    });
}



function $a76a5fb1ed628a22$export$2e2bcd8739ae039(art) {
    const { option: option , template: { $container: $container , $video: $video  } ,  } = art;
    const heightCache = $container.style.height;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'autoHeight', {
        get () {
            return $1617d61110f74a7d$export$4ea3d958472af68f($container, 'art-auto-height');
        },
        set (value) {
            if (value) {
                const { clientWidth: clientWidth  } = $container;
                const { videoHeight: videoHeight , videoWidth: videoWidth  } = $video;
                const height = videoHeight * (clientWidth / videoWidth);
                $1617d61110f74a7d$export$37a5fde709c1db82($container, 'height', height + 'px');
                $1617d61110f74a7d$export$d2cf6cd1dc7067d3($container, 'art-auto-height');
                art.autoSize = option.autoSize;
                art.emit('autoHeight', height);
            } else {
                $1617d61110f74a7d$export$37a5fde709c1db82($container, 'height', heightCache);
                $1617d61110f74a7d$export$c2255604a80b4506($container, 'art-auto-height');
                art.autoSize = option.autoSize;
                art.emit('autoHeight');
            }
        }
    });
}



function $79512d8acfcec26e$export$2e2bcd8739ae039(art) {
    const { option: option , template: { $player: $player  } ,  } = art;
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'theme', {
        get () {
            return getComputedStyle($player).getPropertyValue('--theme');
        },
        set (theme) {
            option.theme = theme;
            $player.style.setProperty('--theme', theme);
        }
    });
}



function $33fc7d1ee58013db$export$2e2bcd8739ae039(art) {
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'title', {
        get () {
            return art.option.title;
        },
        set (title) {
            art.option.title = title;
        }
    });
}



function $1161f2ada0e5360f$export$2e2bcd8739ae039(art) {
    const sizeProps = [
        'mini',
        'pip',
        'fullscreen',
        'fullscreenWeb'
    ];
    function exclusive(props) {
        for(let index = 0; index < props.length; index++){
            const name = props[index];
            art.on(name, ()=>{
                if (art[name]) props.filter((item)=>item !== name
                ).forEach((item)=>{
                    if (art[item]) art[item] = false;
                });
            });
        }
    }
    exclusive(sizeProps);
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'normalSize', {
        get () {
            return sizeProps.every((name)=>!art[name]
            );
        }
    });
}



function $20a0b2c4205f58e3$export$2e2bcd8739ae039(art) {
    const { clamp: clamp  } = art.constructor.utils;
    const { notice: notice , template: template , i18n: i18n  } = art;
    let offsetCache = 0;
    let cuesCache = [];
    art.on('subtitle:switch', ()=>{
        cuesCache = [];
    });
    $6b21bd176607d26d$export$8afb76124cf08683(art, 'subtitleOffset', {
        get () {
            return offsetCache;
        },
        set (value) {
            if (template.$track && template.$track.track) {
                const cues = Array.from(template.$track.track.cues);
                offsetCache = clamp(value, -5, 5);
                for(let index = 0; index < cues.length; index++){
                    const cue = cues[index];
                    if (!cuesCache[index]) cuesCache[index] = {
                        startTime: cue.startTime,
                        endTime: cue.endTime
                    };
                    cue.startTime = clamp(cuesCache[index].startTime + offsetCache, 0, art.duration);
                    cue.endTime = clamp(cuesCache[index].endTime + offsetCache, 0, art.duration);
                }
                art.subtitle.update();
                notice.show = `${i18n.get('Subtitle Offset')}: ${value}s`;
                art.emit('subtitleOffset', value);
            } else art.emit('subtitleOffset', 0);
        }
    });
}



function $33845adf1300e3d0$export$2e2bcd8739ae039(art) {
    const { option: option , storage: storage , template: { $video: $video , $poster: $poster  } ,  } = art;
    Object.keys(option.moreVideoAttr).forEach((key)=>{
        art.attr(key, option.moreVideoAttr[key]);
    });
    if (option.muted) art.muted = option.muted;
    if (option.volume) $video.volume = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(option.volume, 0, 1);
    const volumeStorage = storage.get('volume');
    if (typeof volumeStorage === 'number') $video.volume = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(volumeStorage, 0, 1);
    if (option.poster) $1617d61110f74a7d$export$37a5fde709c1db82($poster, 'backgroundImage', `url(${option.poster})`);
    if (option.autoplay) $video.autoplay = option.autoplay;
    if (option.playsInline) {
        $video.playsInline = true;
        $video['webkit-playsinline'] = true;
    }
    if (option.theme) art.theme = option.theme;
    if (option.ads.length === 0) art.url = option.url;
}




function $caf3509540cde9aa$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , notice: notice , option: option , constructor: constructor , events: { proxy: proxy  } , template: { $player: $player , $video: $video , $poster: $poster  } ,  } = art;
    let reconnectTime = 0;
    for(let index = 0; index < $6bdef3f9911d4dfd$export$2e2bcd8739ae039.events.length; index++)proxy($video, $6bdef3f9911d4dfd$export$2e2bcd8739ae039.events[index], (event)=>{
        art.emit(`video:${event.type}`, event);
    });
    // art.on('video:abort', () => {
    // });
    art.on('video:canplay', ()=>{
        reconnectTime = 0;
        art.loading.show = false;
    });
    art.once('video:canplay', ()=>{
        art.loading.show = false;
        art.controls.show = true;
        art.mask.show = true;
        art.isReady = true;
        art.emit('ready');
    });
    // art.on('video:canplaythrough', () => {
    // });
    // art.on('video:durationchange', () => {
    // });
    // art.on('video:emptied', () => {
    // });
    art.on('video:ended', ()=>{
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
    art.on('video:error', ()=>{
        if (reconnectTime < constructor.RECONNECT_TIME_MAX) $c4508bb07fd554bb$export$e772c8ff12451969(constructor.RECONNECT_SLEEP_TIME).then(()=>{
            reconnectTime += 1;
            art.url = option.url;
            notice.show = `${i18n.get('Reconnect')}: ${reconnectTime}`;
            art.emit('error', reconnectTime);
        });
        else {
            art.loading.show = false;
            art.controls.show = false;
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-error');
            $c4508bb07fd554bb$export$e772c8ff12451969(constructor.RECONNECT_SLEEP_TIME).then(()=>{
                notice.show = i18n.get('Video Load Failed');
                art.destroy(false);
            });
        }
    });
    // art.on('video:loadeddata', () => {
    // });
    art.once('video:loadedmetadata', ()=>{
        art.autoSize = option.autoSize;
        if ($46f6a63658609cc7$export$d0a8044dce8ff2fc) {
            art.loading.show = false;
            art.controls.show = true;
            art.mask.show = true;
        }
    });
    art.on('video:loadstart', ()=>{
        art.loading.show = true;
    });
    art.on('video:pause', ()=>{
        art.controls.show = true;
        art.mask.show = true;
    });
    art.on('video:play', ()=>{
        art.mask.show = false;
        $1617d61110f74a7d$export$37a5fde709c1db82($poster, 'display', 'none');
    });
    art.on('video:playing', ()=>{
        art.mask.show = false;
    });
    // art.on('video:progress', () => {
    // });
    // art.on('video:ratechange', () => {
    // });
    art.on('video:seeked', ()=>{
        art.loading.show = false;
    });
    art.on('video:seeking', ()=>{
        art.loading.show = true;
    });
    // art.on('video:stalled', () => {
    // });
    // art.on('video:suspend', () => {
    // });
    art.on('video:timeupdate', ()=>{
        art.mask.show = false;
    });
    // art.on('video:volumechange', () => {
    // });
    art.on('video:waiting', ()=>{
        art.loading.show = true;
    });
}


class $8f55b19a5260c651$export$2e2bcd8739ae039 {
    constructor(art){
        $78588f8b73477893$export$2e2bcd8739ae039(art);
        $be98068739fad791$export$2e2bcd8739ae039(art);
        $72450db29b4a0619$export$2e2bcd8739ae039(art);
        $c8c1874114a1e9a2$export$2e2bcd8739ae039(art);
        $b0ce1df3a2786735$export$2e2bcd8739ae039(art);
        $97cc863b08e0c30f$export$2e2bcd8739ae039(art);
        $1873c8304570ae71$export$2e2bcd8739ae039(art);
        $0ac9b78c104e6c27$export$2e2bcd8739ae039(art);
        $d10941cb97c59aa9$export$2e2bcd8739ae039(art);
        $9887571a7668b1ac$export$2e2bcd8739ae039(art);
        $76cdd3fd5d9381da$export$2e2bcd8739ae039(art);
        $1265246d0adfd805$export$2e2bcd8739ae039(art);
        $784e09a0793a81cc$export$2e2bcd8739ae039(art);
        $8cb95e120184906b$export$2e2bcd8739ae039(art);
        $314923b44f2751da$export$2e2bcd8739ae039(art);
        $d73ef059475a783b$export$2e2bcd8739ae039(art);
        $b22d35e9b748099f$export$2e2bcd8739ae039(art);
        $2fa6e09c649b8299$export$2e2bcd8739ae039(art);
        $f056beb9f96549cc$export$2e2bcd8739ae039(art);
        $d5ebf944f6c02602$export$2e2bcd8739ae039(art);
        $eb23d3d959cef33c$export$2e2bcd8739ae039(art);
        $b0b3bb93ddcc1973$export$2e2bcd8739ae039(art);
        $dcdd6d111014332f$export$2e2bcd8739ae039(art);
        $83e125d00c630381$export$2e2bcd8739ae039(art);
        $91dc1e363cc97ed1$export$2e2bcd8739ae039(art);
        $a76a5fb1ed628a22$export$2e2bcd8739ae039(art);
        $79512d8acfcec26e$export$2e2bcd8739ae039(art);
        $33fc7d1ee58013db$export$2e2bcd8739ae039(art);
        $1161f2ada0e5360f$export$2e2bcd8739ae039(art);
        $20a0b2c4205f58e3$export$2e2bcd8739ae039(art);
        $caf3509540cde9aa$export$2e2bcd8739ae039(art);
        $33845adf1300e3d0$export$2e2bcd8739ae039(art);
    }
}








class $9c5a9d082f4955c3$export$2e2bcd8739ae039 {
    constructor(art){
        this.id = 0;
        this.art = art;
        this.add = this.add.bind(this);
    }
    get show() {
        return $1617d61110f74a7d$export$4ea3d958472af68f(this.art.template.$player, `art-${this.name}-show`);
    }
    set show(value) {
        const { $player: $player  } = this.art.template;
        const className = `art-${this.name}-show`;
        if (value) $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, className);
        else $1617d61110f74a7d$export$c2255604a80b4506($player, className);
        this.art.emit(this.name, value);
    }
    set toggle(value) {
        if (value) this.show = !this.show;
    }
    add(getOption) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        option.html = option.html || '';
        ($parcel$interopDefault($cTKjd$optionvalidator))(option, $10469c873ed71d57$export$fa4c546e01a0c57c);
        if (!this.$parent || !this.name || option.disable) return;
        const name = option.name || `${this.name}${this.id}`;
        $9f39e86245920cd9$export$ff496a5a51be1527(!$6b21bd176607d26d$export$a4f4bb6b1453fff5(this, name), `Cannot add an existing name [${name}] to the [${this.name}]`);
        this.id += 1;
        const $ref = document.createElement('div');
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($ref, `art-${this.name}`);
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($ref, `art-${this.name}-${name}`);
        const childs = Array.from(this.$parent.children);
        $ref.dataset.index = option.index || this.id;
        const nextChild = childs.find((item)=>Number(item.dataset.index) >= Number($ref.dataset.index)
        );
        if (nextChild) nextChild.insertAdjacentElement('beforebegin', $ref);
        else $1617d61110f74a7d$export$10d8903dec122b9d(this.$parent, $ref);
        if (option.html) $1617d61110f74a7d$export$10d8903dec122b9d($ref, option.html);
        if (option.style) $1617d61110f74a7d$export$ac3d318a39e8020a($ref, option.style);
        if (option.tooltip) $1617d61110f74a7d$export$4e6f96734dfe12f4($ref, option.tooltip);
        if (option.click) this.art.events.proxy($ref, 'click', (event)=>{
            event.preventDefault();
            option.click.call(this.art, this, event);
        });
        if (option.selector && [
            'left',
            'right'
        ].includes(option.position)) this.selector(option, $ref);
        if (option.mounted) option.mounted.call(this.art, $ref);
        if ($ref.childNodes.length === 1 && $ref.childNodes[0].nodeType === 3) $1617d61110f74a7d$export$d2cf6cd1dc7067d3($ref, 'art-control-onlyText');
        $6b21bd176607d26d$export$8afb76124cf08683(this, name, {
            value: $ref
        });
        return $ref;
    }
    selector(option, $ref) {
        const { hover: hover , proxy: proxy  } = this.art.events;
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($ref, 'art-control-selector');
        const $value = document.createElement('div');
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($value, 'art-selector-value');
        $1617d61110f74a7d$export$10d8903dec122b9d($value, option.html);
        $ref.innerText = '';
        $1617d61110f74a7d$export$10d8903dec122b9d($ref, $value);
        const list = option.selector.map((item, index)=>`<div class="art-selector-item ${item.default ? 'art-current' : ''}" data-index="${index}">${item.html}</div>`
        ).join('');
        const $list = document.createElement('div');
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($list, 'art-selector-list');
        $1617d61110f74a7d$export$10d8903dec122b9d($list, list);
        $1617d61110f74a7d$export$10d8903dec122b9d($ref, $list);
        const setLeft = ()=>{
            const left = $1617d61110f74a7d$export$3d2f074408bd1b82($ref, 'width') / 2 - $1617d61110f74a7d$export$3d2f074408bd1b82($list, 'width') / 2;
            $list.style.left = `${left}px`;
        };
        hover($ref, setLeft);
        proxy($list, 'click', async (event)=>{
            const path = event.composedPath() || [];
            const $item = path.find((item)=>$1617d61110f74a7d$export$4ea3d958472af68f(item, 'art-selector-item')
            );
            if (!$item) return;
            $1617d61110f74a7d$export$ff1a70dcfa68e743($item, 'art-current');
            const index = Number($item.dataset.index);
            const find = option.selector[index] || {};
            $value.innerText = $item.innerText;
            if (option.onSelect) {
                const result = await option.onSelect.call(this.art, find, $item, event);
                if (typeof result === 'string' || typeof result === 'number') $value.innerHTML = result;
            }
            setLeft();
            this.art.emit('selector', find, $item);
        });
    }
}



function $24f74a036b70ef15$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Fullscreen'),
            mounted: ($control)=>{
                const { events: { proxy: proxy  } , icons: icons , i18n: i18n ,  } = art;
                $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.fullscreen);
                proxy($control, 'click', ()=>{
                    art.fullscreen = !art.fullscreen;
                });
                art.on('fullscreen', (value)=>{
                    $1617d61110f74a7d$export$4e6f96734dfe12f4($control, i18n.get(value ? 'Exit Fullscreen' : 'Fullscreen'));
                });
            }
        })
    ;
}



function $4f2ccb8e31ca06ed$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Web Fullscreen'),
            mounted: ($control)=>{
                const { events: { proxy: proxy  } , icons: icons , i18n: i18n ,  } = art;
                $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.fullscreenWeb);
                proxy($control, 'click', ()=>{
                    art.fullscreenWeb = !art.fullscreenWeb;
                });
                art.on('fullscreenWeb', (value)=>{
                    $1617d61110f74a7d$export$4e6f96734dfe12f4($control, i18n.get(value ? 'Exit Web Fullscreen' : 'Web Fullscreen'));
                });
            }
        })
    ;
}



function $38d0dc792113fa97$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('PIP Mode'),
            mounted: ($control)=>{
                const { events: { proxy: proxy  } , icons: icons , i18n: i18n ,  } = art;
                $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.pip);
                proxy($control, 'click', ()=>{
                    art.pip = !art.pip;
                });
                art.on('pip', (value)=>{
                    $1617d61110f74a7d$export$4e6f96734dfe12f4($control, i18n.get(value ? 'Exit PIP Mode' : 'PIP Mode'));
                });
            }
        })
    ;
}



function $378fa3df15dbfef1$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const { events: { proxy: proxy  } , icons: icons , i18n: i18n ,  } = art;
                const $play = $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.play);
                const $pause = $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.pause);
                $1617d61110f74a7d$export$4e6f96734dfe12f4($play, i18n.get('Play'));
                $1617d61110f74a7d$export$4e6f96734dfe12f4($pause, i18n.get('Pause'));
                proxy($play, 'click', ()=>{
                    art.play();
                });
                proxy($pause, 'click', ()=>{
                    art.pause();
                });
                function showPlay() {
                    $1617d61110f74a7d$export$37a5fde709c1db82($play, 'display', 'flex');
                    $1617d61110f74a7d$export$37a5fde709c1db82($pause, 'display', 'none');
                }
                function showPause() {
                    $1617d61110f74a7d$export$37a5fde709c1db82($play, 'display', 'none');
                    $1617d61110f74a7d$export$37a5fde709c1db82($pause, 'display', 'flex');
                }
                if (art.playing) showPause();
                else showPlay();
                art.on('video:playing', ()=>{
                    showPause();
                });
                art.on('video:pause', ()=>{
                    showPlay();
                });
            }
        })
    ;
}



function $d0a08a7bd65803b8$export$9c32e9cb86f41a03(art, event) {
    const { $progress: $progress  } = art.template;
    const { left: left  } = $progress.getBoundingClientRect();
    const eventLeft = event.pageX;
    const width = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(eventLeft - left, 0, $progress.clientWidth);
    const second = width / $progress.clientWidth * art.duration;
    const time = $f82eff12ae1758cb$export$bfdd1c721864a50a(second);
    const percentage = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(width / $progress.clientWidth, 0, 1);
    return {
        second: second,
        time: time,
        width: width,
        percentage: percentage
    };
}
function $d0a08a7bd65803b8$export$2e2bcd8739ae039(options) {
    return (art)=>{
        const { icons: icons , option: option , events: { proxy: proxy  } ,  } = art;
        return {
            ...options,
            html: `
                <div class="art-control-progress-inner">
                    <div class="art-progress-loaded"></div>
                    <div class="art-progress-played"></div>
                    <div class="art-progress-highlight"></div>
                    <div class="art-progress-indicator"></div>
                    <div class="art-progress-tip"></div>
                </div>
            `,
            mounted: ($control)=>{
                let isDroging = false;
                const $loaded = $1617d61110f74a7d$export$2fa187e846a241c4('.art-progress-loaded', $control);
                const $played = $1617d61110f74a7d$export$2fa187e846a241c4('.art-progress-played', $control);
                const $highlight = $1617d61110f74a7d$export$2fa187e846a241c4('.art-progress-highlight', $control);
                const $indicator = $1617d61110f74a7d$export$2fa187e846a241c4('.art-progress-indicator', $control);
                const $tip = $1617d61110f74a7d$export$2fa187e846a241c4('.art-progress-tip', $control);
                $1617d61110f74a7d$export$37a5fde709c1db82($played, 'backgroundColor', 'var(--theme)');
                let indicatorSize = art.constructor.INDICATOR_SIZE;
                if (icons.indicator) {
                    indicatorSize = art.constructor.INDICATOR_SIZE_ICON;
                    $1617d61110f74a7d$export$10d8903dec122b9d($indicator, icons.indicator);
                } else $1617d61110f74a7d$export$ac3d318a39e8020a($indicator, {
                    backgroundColor: 'var(--theme)'
                });
                if ($46f6a63658609cc7$export$d0a8044dce8ff2fc) {
                    indicatorSize = art.constructor.INDICATOR_SIZE_MOBILE;
                    if (icons.indicator) indicatorSize = art.constructor.INDICATOR_SIZE_MOBILE_ICON;
                }
                $1617d61110f74a7d$export$ac3d318a39e8020a($indicator, {
                    left: `-${indicatorSize / 2}px`,
                    width: `${indicatorSize}px`,
                    height: `${indicatorSize}px`
                });
                function showHighlight(event) {
                    const { width: width  } = $d0a08a7bd65803b8$export$9c32e9cb86f41a03(art, event);
                    const { text: text  } = event.target.dataset;
                    $tip.innerHTML = text;
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) $1617d61110f74a7d$export$37a5fde709c1db82($tip, 'left', 0);
                    else if (width > $control.clientWidth - tipWidth / 2) $1617d61110f74a7d$export$37a5fde709c1db82($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    else $1617d61110f74a7d$export$37a5fde709c1db82($tip, 'left', `${width - tipWidth / 2}px`);
                }
                function showTime(event) {
                    const { width: width , time: time  } = $d0a08a7bd65803b8$export$9c32e9cb86f41a03(art, event);
                    $tip.innerHTML = time;
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) $1617d61110f74a7d$export$37a5fde709c1db82($tip, 'left', 0);
                    else if (width > $control.clientWidth - tipWidth / 2) $1617d61110f74a7d$export$37a5fde709c1db82($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    else $1617d61110f74a7d$export$37a5fde709c1db82($tip, 'left', `${width - tipWidth / 2}px`);
                }
                function setBar(type, percentage) {
                    if (type === 'loaded') $1617d61110f74a7d$export$37a5fde709c1db82($loaded, 'width', `${percentage * 100}%`);
                    if (type === 'played') {
                        $1617d61110f74a7d$export$37a5fde709c1db82($played, 'width', `${percentage * 100}%`);
                        $1617d61110f74a7d$export$37a5fde709c1db82($indicator, 'left', `calc(${percentage * 100}% - ${indicatorSize / 2}px)`);
                    }
                }
                for(let index = 0; index < option.highlight.length; index++){
                    const item = option.highlight[index];
                    const left = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(item.time, 0, art.duration) / art.duration * 100;
                    $1617d61110f74a7d$export$10d8903dec122b9d($highlight, `<span data-text="${item.text}" data-time="${item.time}" style="left: ${left}%"></span>`);
                }
                setBar('loaded', art.loaded);
                art.on('setBar', (type, percentage)=>{
                    setBar(type, percentage);
                });
                art.on('video:progress', ()=>{
                    setBar('loaded', art.loaded);
                });
                art.on('video:timeupdate', ()=>{
                    setBar('played', art.played);
                });
                art.on('video:ended', ()=>{
                    setBar('played', 1);
                });
                if (!$46f6a63658609cc7$export$d0a8044dce8ff2fc) {
                    proxy($control, 'click', (event)=>{
                        if (event.target !== $indicator) {
                            const { second: second , percentage: percentage  } = $d0a08a7bd65803b8$export$9c32e9cb86f41a03(art, event);
                            setBar('played', percentage);
                            art.seek = second;
                        }
                    });
                    proxy($control, 'mousemove', (event)=>{
                        $1617d61110f74a7d$export$37a5fde709c1db82($tip, 'display', 'block');
                        if ($1617d61110f74a7d$export$89ce434956e92c43(event, $highlight)) showHighlight(event);
                        else showTime(event);
                    });
                    proxy($control, 'mouseout', ()=>{
                        $1617d61110f74a7d$export$37a5fde709c1db82($tip, 'display', 'none');
                    });
                    proxy($indicator, 'mousedown', ()=>{
                        isDroging = true;
                    });
                    proxy(document, 'mousemove', (event)=>{
                        if (isDroging) {
                            const { second: second , percentage: percentage  } = $d0a08a7bd65803b8$export$9c32e9cb86f41a03(art, event);
                            setBar('played', percentage);
                            art.seek = second;
                        }
                    });
                    proxy(document, 'mouseup', ()=>{
                        if (isDroging) isDroging = false;
                    });
                }
            }
        };
    };
}



function $e0f85588ad7a7211$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Hide Subtitle'),
            mounted: ($control)=>{
                const { events: { proxy: proxy  } , icons: icons , i18n: i18n , subtitle: $e0f85588ad7a7211$export$2e2bcd8739ae039 ,  } = art;
                $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.subtitle);
                proxy($control, 'click', ()=>{
                    $e0f85588ad7a7211$export$2e2bcd8739ae039.toggle = true;
                });
                art.on('subtitle', (value)=>{
                    $1617d61110f74a7d$export$4e6f96734dfe12f4($control, i18n.get(value ? 'Hide Subtitle' : 'Show Subtitle'));
                });
            }
        })
    ;
}



function $541d258a590e5455$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                function getTime() {
                    const newTime = `${$f82eff12ae1758cb$export$bfdd1c721864a50a(art.currentTime)} / ${$f82eff12ae1758cb$export$bfdd1c721864a50a(art.duration)}`;
                    if (newTime !== $control.innerText) $control.innerText = newTime;
                }
                getTime();
                const events = [
                    'video:loadedmetadata',
                    'video:timeupdate',
                    'video:progress'
                ];
                for(let index = 0; index < events.length; index++)art.on(events[index], getTime);
            }
        })
    ;
}



function $f2401af696c06ceb$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const { events: { proxy: proxy  } , icons: icons , i18n: i18n ,  } = art;
                let isDroging = false;
                const panelWidth = art.constructor.VOLUME_PANEL_WIDTH;
                const handleWidth = art.constructor.VOLUME_HANDLE_WIDTH;
                const $volume = $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.volume);
                const $volumeClose = $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.volumeClose);
                const $volumePanel = $1617d61110f74a7d$export$10d8903dec122b9d($control, '<div class="art-volume-panel"></div>');
                const $volumeHandle = $1617d61110f74a7d$export$10d8903dec122b9d($volumePanel, '<div class="art-volume-slider-handle"></div>');
                $1617d61110f74a7d$export$4e6f96734dfe12f4($volume, i18n.get('Mute'));
                $1617d61110f74a7d$export$37a5fde709c1db82($volumeClose, 'display', 'none');
                if ($46f6a63658609cc7$export$d0a8044dce8ff2fc) $1617d61110f74a7d$export$37a5fde709c1db82($volumePanel, 'display', 'none');
                function volumeChangeFromEvent(event) {
                    const { left: panelLeft  } = $volumePanel.getBoundingClientRect();
                    const percentage = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(event.pageX - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) / (panelWidth - handleWidth);
                    return percentage;
                }
                function setVolumeHandle(percentage = 0.7) {
                    if (art.muted || percentage === 0) {
                        $1617d61110f74a7d$export$37a5fde709c1db82($volume, 'display', 'none');
                        $1617d61110f74a7d$export$37a5fde709c1db82($volumeClose, 'display', 'flex');
                        $1617d61110f74a7d$export$37a5fde709c1db82($volumeHandle, 'left', '0');
                    } else {
                        const width = (panelWidth - handleWidth) * percentage;
                        $1617d61110f74a7d$export$37a5fde709c1db82($volume, 'display', 'flex');
                        $1617d61110f74a7d$export$37a5fde709c1db82($volumeClose, 'display', 'none');
                        $1617d61110f74a7d$export$37a5fde709c1db82($volumeHandle, 'left', `${width}px`);
                    }
                }
                setVolumeHandle(art.volume);
                art.on('video:volumechange', ()=>{
                    setVolumeHandle(art.volume);
                });
                proxy($volume, 'click', ()=>{
                    art.muted = true;
                });
                proxy($volumeClose, 'click', ()=>{
                    art.muted = false;
                });
                proxy($volumePanel, 'click', (event)=>{
                    art.muted = false;
                    art.volume = volumeChangeFromEvent(event);
                });
                proxy($volumeHandle, 'mousedown', ()=>{
                    isDroging = true;
                });
                proxy($control, 'mousemove', (event)=>{
                    if (isDroging) {
                        art.muted = false;
                        art.volume = volumeChangeFromEvent(event);
                    }
                });
                proxy(document, 'mouseup', ()=>{
                    if (isDroging) isDroging = false;
                });
            }
        })
    ;
}



function $b05be089de6b7db6$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Show Setting'),
            mounted: ($control)=>{
                const { events: { proxy: proxy  } , icons: icons , i18n: i18n , setting: $b05be089de6b7db6$export$2e2bcd8739ae039 ,  } = art;
                $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.setting);
                proxy($control, 'click', ()=>{
                    $b05be089de6b7db6$export$2e2bcd8739ae039.toggle = true;
                });
                art.on('setting', (value)=>{
                    $1617d61110f74a7d$export$4e6f96734dfe12f4($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'));
                });
            }
        })
    ;
}




function $767203a3d397536b$export$2e2bcd8739ae039(options) {
    return (art)=>({
            ...options,
            mounted: ($control)=>{
                const { option: option , template: { $progress: $progress , $video: $video  } , events: { proxy: proxy , loadImg: loadImg  } ,  } = art;
                let image = null;
                let loading = false;
                let isLoad = false;
                function showThumbnails(event) {
                    const { width: posWidth  } = $d0a08a7bd65803b8$export$9c32e9cb86f41a03(art, event);
                    const { url: url , number: number , column: column  } = option.thumbnails;
                    const width = image.naturalWidth / column;
                    const height = width / ($video.videoWidth / $video.videoHeight);
                    const perWidth = $progress.clientWidth / number;
                    const perIndex = Math.floor(posWidth / perWidth);
                    const yIndex = Math.ceil(perIndex / column) - 1;
                    const xIndex = perIndex % column || column - 1;
                    $1617d61110f74a7d$export$37a5fde709c1db82($control, 'backgroundImage', `url(${url})`);
                    $1617d61110f74a7d$export$37a5fde709c1db82($control, 'height', `${height}px`);
                    $1617d61110f74a7d$export$37a5fde709c1db82($control, 'width', `${width}px`);
                    $1617d61110f74a7d$export$37a5fde709c1db82($control, 'backgroundPosition', `-${xIndex * width}px -${yIndex * height}px`);
                    if (posWidth <= width / 2) $1617d61110f74a7d$export$37a5fde709c1db82($control, 'left', 0);
                    else if (posWidth > $progress.clientWidth - width / 2) $1617d61110f74a7d$export$37a5fde709c1db82($control, 'left', `${$progress.clientWidth - width}px`);
                    else $1617d61110f74a7d$export$37a5fde709c1db82($control, 'left', `${posWidth - width / 2}px`);
                }
                proxy($progress, 'mousemove', (event)=>{
                    if (!loading) {
                        loading = true;
                        loadImg(option.thumbnails.url).then((img)=>{
                            image = img;
                            isLoad = true;
                        });
                    }
                    if (isLoad) {
                        $1617d61110f74a7d$export$37a5fde709c1db82($control, 'display', 'block');
                        showThumbnails(event);
                    }
                });
                proxy($progress, 'mouseout', ()=>{
                    $1617d61110f74a7d$export$37a5fde709c1db82($control, 'display', 'none');
                });
            }
        })
    ;
}



function $976f9f6ebb1a7dfb$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Screenshot'),
            mounted: ($control)=>{
                const { events: { proxy: proxy  } , icons: icons ,  } = art;
                $1617d61110f74a7d$export$10d8903dec122b9d($control, icons.screenshot);
                proxy($control, 'click', ()=>{
                    art.screenshot();
                });
            }
        })
    ;
}


function $dfc8c666169f6710$export$2e2bcd8739ae039(option) {
    return (art)=>{
        const qualityOption = art.option.quality;
        const qualityDefault = qualityOption.find((item)=>item.default
        ) || qualityOption[0];
        return {
            ...option,
            html: qualityDefault ? qualityDefault.html : '',
            selector: qualityOption,
            onSelect (item) {
                art.switchQuality(item.url, item.html);
            }
        };
    };
}



function $602035290fccdc3d$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const $left = $1617d61110f74a7d$export$10d8903dec122b9d($control, `<span class="art-loop-point"></span>`);
                const $right = $1617d61110f74a7d$export$10d8903dec122b9d($control, `<span class="art-loop-point"></span>`);
                art.on('loop', (value)=>{
                    if (value) {
                        $1617d61110f74a7d$export$37a5fde709c1db82($control, 'display', 'block');
                        $1617d61110f74a7d$export$37a5fde709c1db82($left, 'left', `calc(${value[0] / art.duration * 100}% - ${$left.clientWidth}px)`);
                        $1617d61110f74a7d$export$37a5fde709c1db82($right, 'left', `${value[1] / art.duration * 100}%`);
                    } else $1617d61110f74a7d$export$37a5fde709c1db82($control, 'display', 'none');
                });
            }
        })
    ;
}


class $5fbd4a5b2c9a3876$export$2e2bcd8739ae039 extends $9c5a9d082f4955c3$export$2e2bcd8739ae039 {
    constructor(art){
        super(art);
        this.name = 'control';
        const { option: option , constructor: constructor , events: { proxy: proxy  } , template: { $player: $player  } ,  } = art;
        let activeTime = Date.now();
        proxy($player, [
            'click',
            'mousemove',
            'touchstart',
            'touchmove'
        ], ()=>{
            this.show = true;
            $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-hide-cursor');
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-hover');
            activeTime = Date.now();
        });
        art.on('video:timeupdate', ()=>{
            if (art.playing && this.show && Date.now() - activeTime >= constructor.CONTROL_HIDE_TIME) {
                this.show = false;
                $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-hide-cursor');
                $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-hover');
            }
        });
        art.once('video:loadedmetadata', ()=>{
            this.add($d0a08a7bd65803b8$export$2e2bcd8739ae039({
                name: 'progress',
                disable: option.isLive,
                position: 'top',
                index: 10
            }));
            this.add($767203a3d397536b$export$2e2bcd8739ae039({
                name: 'thumbnails',
                disable: !option.thumbnails.url || option.isLive || $46f6a63658609cc7$export$d0a8044dce8ff2fc,
                position: 'top',
                index: 20
            }));
            this.add($602035290fccdc3d$export$2e2bcd8739ae039({
                name: 'loop',
                disable: false,
                position: 'top',
                index: 30
            }));
            this.add($378fa3df15dbfef1$export$2e2bcd8739ae039({
                name: 'playAndPause',
                disable: false,
                position: 'left',
                index: 10
            }));
            this.add($f2401af696c06ceb$export$2e2bcd8739ae039({
                name: 'volume',
                disable: false,
                position: 'left',
                index: 20
            }));
            this.add($541d258a590e5455$export$2e2bcd8739ae039({
                name: 'time',
                disable: option.isLive,
                position: 'left',
                index: 30
            }));
            this.add($dfc8c666169f6710$export$2e2bcd8739ae039({
                name: 'quality',
                disable: option.quality.length === 0,
                position: 'right',
                index: 10
            }));
            this.add($976f9f6ebb1a7dfb$export$2e2bcd8739ae039({
                name: 'screenshot',
                disable: !option.screenshot || $46f6a63658609cc7$export$d0a8044dce8ff2fc,
                position: 'right',
                index: 20
            }));
            this.add($e0f85588ad7a7211$export$2e2bcd8739ae039({
                name: 'subtitle',
                disable: !option.subtitle.url,
                position: 'right',
                index: 30
            }));
            this.add($b05be089de6b7db6$export$2e2bcd8739ae039({
                name: 'setting',
                disable: !option.setting,
                position: 'right',
                index: 40
            }));
            this.add($38d0dc792113fa97$export$2e2bcd8739ae039({
                name: 'pip',
                disable: !option.pip,
                position: 'right',
                index: 50
            }));
            this.add($4f2ccb8e31ca06ed$export$2e2bcd8739ae039({
                name: 'fullscreenWeb',
                disable: !option.fullscreenWeb,
                position: 'right',
                index: 60
            }));
            this.add($24f74a036b70ef15$export$2e2bcd8739ae039({
                name: 'fullscreen',
                disable: !option.fullscreen,
                position: 'right',
                index: 70
            }));
            for(let index = 0; index < option.controls.length; index++)this.add(option.controls[index]);
        });
    }
    add(getOption) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        const { $progress: $progress , $controlsLeft: $controlsLeft , $controlsRight: $controlsRight  } = this.art.template;
        switch(option.position){
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
                $9f39e86245920cd9$export$ff496a5a51be1527(false, `Control option.position must one of 'top', 'left', 'right'`);
                break;
        }
        super.add(option);
    }
}





function $9597d351d2e4bb2f$export$2e2bcd8739ae039(option) {
    return (art)=>{
        const { i18n: i18n  } = art;
        return {
            ...option,
            html: `${i18n.get('Play Speed')}:
                <span data-value="0.5">0.5</span>
                <span data-value="0.75">0.75</span>
                <span data-value="1.0" class="art-current">${i18n.get('Normal')}</span>
                <span data-value="1.25">1.25</span>
                <span data-value="1.5">1.5</span>
                <span data-value="2.0">2.0</span>
            `,
            click: (contextmenu, event)=>{
                const { value: value  } = event.target.dataset;
                if (value) {
                    art.playbackRate = Number(value);
                    contextmenu.show = false;
                }
            },
            mounted: ($panel)=>{
                art.on('playbackRate', (value)=>{
                    const $current = $1617d61110f74a7d$export$dcd0d083aa86c355('span', $panel).find((item)=>Number(item.dataset.value) === value
                    );
                    if ($current) $1617d61110f74a7d$export$ff1a70dcfa68e743($current, 'art-current');
                });
            }
        };
    };
}



function $9bfaae294ba0fe76$export$2e2bcd8739ae039(option) {
    return (art)=>{
        const { i18n: i18n  } = art;
        return {
            ...option,
            html: `${i18n.get('Aspect Ratio')}:
                <span data-value="default" class="art-current">${i18n.get('Default')}</span>
                <span data-value="4:3">4:3</span>
                <span data-value="16:9">16:9</span>
            `,
            click: (contextmenu, event)=>{
                const { value: value  } = event.target.dataset;
                if (value) {
                    art.aspectRatio = value;
                    contextmenu.show = false;
                }
            },
            mounted: ($panel)=>{
                art.on('aspectRatio', (value)=>{
                    const $current = $1617d61110f74a7d$export$dcd0d083aa86c355('span', $panel).find((item)=>item.dataset.value === value
                    );
                    if ($current) $1617d61110f74a7d$export$ff1a70dcfa68e743($current, 'art-current');
                });
            }
        };
    };
}



function $8a001627e61c9c3c$export$2e2bcd8739ae039(option) {
    return (art)=>{
        const { i18n: i18n  } = art;
        return {
            ...option,
            html: `${i18n.get('Video Flip')}:
                <span data-value="normal" class="art-current">${i18n.get('Normal')}</span>
                <span data-value="horizontal">${i18n.get('Horizontal')}</span>
                <span data-value="vertical">${i18n.get('Vertical')}</span>
            `,
            click: (contextmenu, event)=>{
                const { value: value  } = event.target.dataset;
                if (value) {
                    art.flip = value;
                    contextmenu.show = false;
                }
            },
            mounted: ($panel)=>{
                art.on('flip', (value)=>{
                    const $current = $1617d61110f74a7d$export$dcd0d083aa86c355('span', $panel).find((item)=>item.dataset.value === value
                    );
                    if ($current) $1617d61110f74a7d$export$ff1a70dcfa68e743($current, 'art-current');
                });
            }
        };
    };
}


function $7852a2608da0bc8f$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            html: art.i18n.get('Video Info'),
            click: (contextmenu)=>{
                art.info.show = true;
                contextmenu.show = false;
            }
        })
    ;
}


function $8f389b7f3ee028c7$export$2e2bcd8739ae039(option) {
    return {
        ...option,
        html: `<a href="https://artplayer.org" target="_blank">ArtPlayer ${"4.3.11"}</a>`
    };
}


function $b88cbde00258c088$export$2e2bcd8739ae039(option) {
    return (art)=>({
            ...option,
            html: art.i18n.get('Close'),
            click: (contextmenu)=>{
                contextmenu.show = false;
            }
        })
    ;
}


class $058f60678a15f124$export$2e2bcd8739ae039 extends $9c5a9d082f4955c3$export$2e2bcd8739ae039 {
    constructor(art){
        super(art);
        this.art = art;
        this.name = 'contextmenu';
        this.$parent = art.template.$contextmenu;
        art.once('video:loadedmetadata', ()=>{
            if (!$46f6a63658609cc7$export$d0a8044dce8ff2fc) this.init();
        });
    }
    init() {
        const { option: option , template: { $player: $player , $contextmenu: $contextmenu  } , events: { proxy: proxy  } ,  } = this.art;
        this.add($9597d351d2e4bb2f$export$2e2bcd8739ae039({
            disable: !option.playbackRate,
            name: 'playbackRate',
            index: 10
        }));
        this.add($9bfaae294ba0fe76$export$2e2bcd8739ae039({
            disable: !option.aspectRatio,
            name: 'aspectRatio',
            index: 20
        }));
        this.add($8a001627e61c9c3c$export$2e2bcd8739ae039({
            disable: !option.flip,
            name: 'flip',
            index: 30
        }));
        this.add($7852a2608da0bc8f$export$2e2bcd8739ae039({
            disable: false,
            name: 'info',
            index: 40
        }));
        this.add($8f389b7f3ee028c7$export$2e2bcd8739ae039({
            disable: false,
            name: 'version',
            index: 50
        }));
        this.add($b88cbde00258c088$export$2e2bcd8739ae039({
            disable: false,
            name: 'close',
            index: 60
        }));
        for(let index = 0; index < option.contextmenu.length; index++)this.add(option.contextmenu[index]);
        proxy($player, 'contextmenu', (event)=>{
            event.preventDefault();
            this.show = true;
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const { height: cHeight , width: cWidth , left: cLeft , top: cTop  } = $player.getBoundingClientRect();
            const { height: mHeight , width: mWidth  } = $contextmenu.getBoundingClientRect();
            let menuLeft = mouseX - cLeft;
            let menuTop = mouseY - cTop;
            if (mouseX + mWidth > cLeft + cWidth) menuLeft = cWidth - mWidth;
            if (mouseY + mHeight > cTop + cHeight) menuTop = cHeight - mHeight;
            $1617d61110f74a7d$export$ac3d318a39e8020a($contextmenu, {
                top: `${menuTop}px`,
                left: `${menuLeft}px`
            });
        });
        proxy($player, 'click', (event)=>{
            if (!$1617d61110f74a7d$export$89ce434956e92c43(event, $contextmenu)) this.show = false;
        });
        this.art.on('blur', ()=>{
            this.show = false;
        });
    }
}




class $d6c99f18c678401b$export$2e2bcd8739ae039 extends $9c5a9d082f4955c3$export$2e2bcd8739ae039 {
    constructor(art){
        super(art);
        this.name = 'info';
        art.once('video:loadedmetadata', ()=>{
            if (!$46f6a63658609cc7$export$d0a8044dce8ff2fc) this.init();
        });
    }
    init() {
        const { constructor: constructor , events: { proxy: proxy  } , template: { $infoPanel: $infoPanel , $infoClose: $infoClose , $video: $video  } ,  } = this.art;
        proxy($infoClose, 'click', ()=>{
            this.show = false;
        });
        let timer = null;
        const $types = $1617d61110f74a7d$export$dcd0d083aa86c355('[data-video]', $infoPanel) || [];
        this.art.on('destroy', ()=>{
            clearTimeout(timer);
        });
        function loop() {
            for(let index = 0; index < $types.length; index++){
                const item = $types[index];
                const value = $video[item.dataset.video];
                const innerText = typeof value === 'number' ? value.toFixed(2) : value;
                if (item.innerText !== innerText) item.innerText = innerText;
            }
            timer = setTimeout(loop, constructor.INFO_LOOP_TIME);
        }
        loop();
    }
}






class $832c66d5be9ddefa$export$2e2bcd8739ae039 extends $9c5a9d082f4955c3$export$2e2bcd8739ae039 {
    constructor(art){
        super(art);
        this.name = 'subtitle';
        art.once('video:loadedmetadata', ()=>{
            this.init(art.option.subtitle);
        });
    }
    get url() {
        return this.art.template.$track.src;
    }
    set url(url) {
        this.switch(url);
    }
    get textTrack() {
        return this.art.template.$video.textTracks[0];
    }
    get activeCue() {
        return this.textTrack.activeCues[0];
    }
    style(key, value) {
        const { $subtitle: $subtitle  } = this.art.template;
        if (typeof key === 'object') return $1617d61110f74a7d$export$ac3d318a39e8020a($subtitle, key);
        return $1617d61110f74a7d$export$37a5fde709c1db82($subtitle, key, value);
    }
    update() {
        const { $subtitle: $subtitle  } = this.art.template;
        $subtitle.innerHTML = '';
        if (this.activeCue) {
            $subtitle.innerHTML = this.activeCue.text.split(/\r?\n/).map((item)=>`<p>${$f82eff12ae1758cb$export$4e7f196112fea3c5(item)}</p>`
            ).join('');
            this.art.emit('subtitleUpdate', this.activeCue.text);
        }
    }
    switch(url, newOption = {}) {
        const { i18n: i18n , notice: notice , option: option  } = this.art;
        const subtitleOption = {
            ...option.subtitle,
            ...newOption,
            url: url
        };
        return this.init(subtitleOption).then((subUrl)=>{
            if (newOption.name) notice.show = `${i18n.get('Switch Subtitle')}: ${newOption.name}`;
            return subUrl;
        });
    }
    init(subtitleOption) {
        ($parcel$interopDefault($cTKjd$optionvalidator))(subtitleOption, $10469c873ed71d57$export$2e2bcd8739ae039.subtitle);
        if (!subtitleOption.url) return;
        const { notice: notice , events: { proxy: proxy  } , template: { $subtitle: $subtitle , $video: $video , $track: $track  } ,  } = this.art;
        if (!$track) {
            const $track = document.createElement('track');
            $track.default = true;
            $track.kind = 'metadata';
            $video.appendChild($track);
            this.art.template.$track = $track;
            proxy(this.textTrack, 'cuechange', this.update.bind(this));
        }
        this.style(subtitleOption.style);
        $9f39e86245920cd9$export$ff496a5a51be1527(window.fetch, 'fetch not support');
        return fetch(subtitleOption.url).then((response)=>response.arrayBuffer()
        ).then((buffer)=>{
            $9f39e86245920cd9$export$ff496a5a51be1527(window.TextDecoder, 'TextDecoder not support');
            const decoder = new TextDecoder(subtitleOption.encoding);
            const text = decoder.decode(buffer);
            this.art.emit('subtitleLoad', subtitleOption.url);
            switch(subtitleOption.type || $112d5cbf48554e5f$export$ba319cdd039ba52e(subtitleOption.url)){
                case 'srt':
                    return $3bd617987c2ca385$export$108f84c95df61951($3bd617987c2ca385$export$5ae19f500bb84e8b(text));
                case 'ass':
                    return $3bd617987c2ca385$export$108f84c95df61951($3bd617987c2ca385$export$aaf95c443eb8118a(text));
                case 'vtt':
                    return $3bd617987c2ca385$export$108f84c95df61951(text);
                default:
                    return subtitleOption.url;
            }
        }).then((subUrl)=>{
            $subtitle.innerHTML = '';
            if (this.url === subUrl) return subUrl;
            URL.revokeObjectURL(this.url);
            this.art.template.$track.src = subUrl;
            this.art.emit('subtitleSwitch', subUrl);
            return subUrl;
        }).catch((err)=>{
            notice.show = err;
            throw err;
        });
    }
}




function $73a3e403a4b80fbc$export$2e2bcd8739ae039(art, events) {
    const { constructor: constructor , template: { $player: $player , $video: $video  } ,  } = art;
    events.proxy(document, [
        'click',
        'contextmenu'
    ], (event)=>{
        if ($1617d61110f74a7d$export$89ce434956e92c43(event, $player)) {
            art.isFocus = true;
            art.emit('focus');
        } else {
            art.isFocus = false;
            art.emit('blur');
        }
    });
    let clickTime = 0;
    events.proxy($video, 'click', ()=>{
        const now = Date.now();
        if (now - clickTime <= constructor.DB_CLICE_TIME) {
            art.emit('dblclick');
            if ($46f6a63658609cc7$export$d0a8044dce8ff2fc) art.toggle();
            else art.fullscreen = !art.fullscreen;
        } else {
            art.emit('click');
            if (!$46f6a63658609cc7$export$d0a8044dce8ff2fc) art.toggle();
        }
        clickTime = now;
    });
}



function $eccc38f47ad4e496$export$2e2bcd8739ae039(art, events) {
    const { $player: $player  } = art.template;
    events.hover($player, ()=>{
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-hover');
        art.emit('hover', true);
    }, ()=>{
        $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-hover');
        art.emit('hover');
    });
}


function $af27990c30407626$export$2e2bcd8739ae039(art, events) {
    const { $player: $player  } = art.template;
    events.proxy($player, 'mousemove', (event)=>{
        art.emit('mousemove', event);
    });
}



function $4875c55156125b7f$export$2e2bcd8739ae039(art, events) {
    const { notice: notice , option: option  } = art;
    const resizeFn = $c4508bb07fd554bb$export$de363e709c412c8a(()=>{
        if (art.normalSize) art.autoSize = option.autoSize;
        art.aspectRatioReset = true;
        notice.show = '';
        art.emit('resize');
    }, art.constructor.RESIZE_TIME);
    events.proxy(window, [
        'orientationchange',
        'resize'
    ], ()=>{
        resizeFn();
    });
    if (screen && screen.orientation && screen.orientation.onchange) events.proxy(screen.orientation, 'change', ()=>{
        resizeFn();
    });
}



function $aceb871fa680c246$export$2e2bcd8739ae039(art, events) {
    if ($46f6a63658609cc7$export$d0a8044dce8ff2fc && !art.option.isLive) {
        const { notice: notice , plugins: plugins , template: { $video: $video , $bottom: $bottom , $controls: $controls  } ,  } = art;
        let isDroging = false;
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        const onTouchStart = (event)=>{
            if (event.touches.length === 1) {
                isDroging = true;
                const { clientX: clientX , clientY: clientY  } = event.touches[0];
                startX = clientX;
                startY = clientY;
                startTime = art.currentTime;
            }
        };
        const onTouchMove = (event)=>{
            if (event.touches.length === 1 && isDroging && art.duration) {
                const autoOrientation = plugins.autoOrientation && plugins.autoOrientation.state;
                const { clientX: clientX , clientY: clientY  } = event.touches[0];
                const ratioX = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4((clientX - startX) / art.width, -1, 1);
                const ratioY = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4((clientY - startY) / art.height, -1, 1);
                const ratio = autoOrientation ? ratioY : ratioX;
                const currentTime = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(startTime + art.duration * ratio / 2, 0, art.duration);
                art.seek = currentTime;
                art.emit('setBar', 'played', $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(currentTime / art.duration, 0, 1));
                notice.show = `${$f82eff12ae1758cb$export$bfdd1c721864a50a(currentTime)} / ${$f82eff12ae1758cb$export$bfdd1c721864a50a(art.duration)}`;
            }
        };
        const onTouchEnd = ()=>{
            if (isDroging) {
                startX = 0;
                startY = 0;
                startTime = 0;
                isDroging = false;
            }
        };
        events.proxy($bottom, 'touchstart', (event)=>{
            if (!$1617d61110f74a7d$export$89ce434956e92c43(event, $controls)) onTouchStart(event);
        });
        events.proxy($bottom, 'touchmove', onTouchMove);
        events.proxy($video, 'touchstart', onTouchStart);
        events.proxy($video, 'touchmove', onTouchMove);
        events.proxy(document, 'touchend', onTouchEnd);
    }
}



function $f71d899ac667f7fb$export$2e2bcd8739ae039(art, events) {
    const { option: option , constructor: constructor , template: { $container: $container  } ,  } = art;
    const scrollFn = $c4508bb07fd554bb$export$de363e709c412c8a(()=>{
        art.emit('view', $1617d61110f74a7d$export$157b27307c5a0381($container, constructor.SCROLL_GAP));
    }, constructor.SCROLL_TIME);
    events.proxy(window, 'scroll', ()=>{
        scrollFn();
    });
    art.on('view', (state)=>{
        if (option.autoMini) art.mini = !state;
    });
}


class $9dd1746ab026757b$export$2e2bcd8739ae039 {
    constructor(art){
        this.destroyEvents = [];
        this.proxy = this.proxy.bind(this);
        this.hover = this.hover.bind(this);
        this.loadImg = this.loadImg.bind(this);
        if (art.whitelist.state) art.once('video:loadedmetadata', ()=>{
            $73a3e403a4b80fbc$export$2e2bcd8739ae039(art, this);
            $eccc38f47ad4e496$export$2e2bcd8739ae039(art, this);
            $af27990c30407626$export$2e2bcd8739ae039(art, this);
            $4875c55156125b7f$export$2e2bcd8739ae039(art, this);
            $aceb871fa680c246$export$2e2bcd8739ae039(art, this);
            $f71d899ac667f7fb$export$2e2bcd8739ae039(art, this);
        });
    }
    proxy(target, name, callback, option = {}) {
        if (Array.isArray(name)) return name.map((item)=>this.proxy(target, item, callback, option)
        );
        target.addEventListener(name, callback, option);
        const destroy = ()=>target.removeEventListener(name, callback, option)
        ;
        this.destroyEvents.push(destroy);
        return destroy;
    }
    hover(target, mouseenter, mouseleave) {
        if (mouseenter) this.proxy(target, 'mouseenter', mouseenter);
        if (mouseleave) this.proxy(target, 'mouseleave', mouseleave);
    }
    loadImg(img) {
        return new Promise((resolve, reject)=>{
            let image;
            if (img instanceof HTMLImageElement) image = img;
            else if (typeof img === 'string') {
                image = new Image();
                image.src = img;
            } else return reject(new $9f39e86245920cd9$export$8f14b18212bb1ea5('Unable to get Image'));
            if (image.complete) return resolve(image);
            this.proxy(image, 'load', ()=>resolve(image)
            );
            this.proxy(image, 'error', ()=>reject(new $9f39e86245920cd9$export$8f14b18212bb1ea5(`Failed to load Image: ${image.src}`))
            );
        });
    }
    destroy() {
        for(let index = 0; index < this.destroyEvents.length; index++)this.destroyEvents[index]();
    }
}



class $3e1980c05dfeee5d$export$2e2bcd8739ae039 {
    constructor(art){
        this.art = art;
        this.keys = {};
        art.once('video:loadedmetadata', ()=>{
            if (art.option.hotkey && !$46f6a63658609cc7$export$d0a8044dce8ff2fc) this.init();
        });
    }
    init() {
        const { proxy: proxy  } = this.art.events;
        this.add(27, ()=>{
            if (this.art.fullscreenWeb) this.art.fullscreenWeb = false;
        });
        this.add(32, ()=>{
            this.art.toggle();
        });
        this.add(37, ()=>{
            this.art.backward = 5;
        });
        this.add(38, ()=>{
            this.art.volume += 0.1;
        });
        this.add(39, ()=>{
            this.art.forward = 5;
        });
        this.add(40, ()=>{
            this.art.volume -= 0.1;
        });
        proxy(window, 'keydown', (event)=>{
            if (this.art.isFocus) {
                const tag = document.activeElement.tagName.toUpperCase();
                const editable = document.activeElement.getAttribute('contenteditable');
                if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
                    const events = this.keys[event.keyCode];
                    if (events) {
                        event.preventDefault();
                        for(let index = 0; index < events.length; index++)events[index].call(this.art, event);
                        this.art.emit('hotkey', event);
                    }
                }
            }
        });
    }
    add(key, event) {
        if (this.keys[key]) this.keys[key].push(event);
        else this.keys[key] = [
            event
        ];
        return this;
    }
    remove(key, event) {
        if (this.keys[key]) {
            const index = this.keys[key].indexOf(event);
            if (index !== -1) this.keys[key].splice(index, 1);
        }
        return this;
    }
}



class $87ad6b3f378139e4$export$2e2bcd8739ae039 extends $9c5a9d082f4955c3$export$2e2bcd8739ae039 {
    constructor(art){
        super(art);
        const { option: option , template: { $layer: $layer  } ,  } = art;
        this.name = 'layer';
        this.$parent = $layer;
        art.once('video:loadedmetadata', ()=>{
            for(let index = 0; index < option.layers.length; index++)this.add(option.layers[index]);
        });
    }
}




class $e3e38774bcec1905$export$2e2bcd8739ae039 extends $9c5a9d082f4955c3$export$2e2bcd8739ae039 {
    constructor(art){
        super(art);
        this.name = 'loading';
        $1617d61110f74a7d$export$10d8903dec122b9d(art.template.$loading, art.icons.loading);
    }
}



class $6281e0d09498f459$export$2e2bcd8739ae039 {
    constructor(art){
        this.art = art;
        this.timer = null;
    }
    set show(msg) {
        const { $player: $player , $noticeInner: $noticeInner  } = this.art.template;
        if (!msg) return $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-notice-show');
        $noticeInner.innerText = msg instanceof Error ? msg.message.trim() : msg;
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-notice-show');
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            $noticeInner.innerText = '';
            $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-notice-show');
        }, this.art.constructor.NOTICE_TIME);
    }
}




class $846b6021e30a62e3$export$2e2bcd8739ae039 extends $9c5a9d082f4955c3$export$2e2bcd8739ae039 {
    constructor(art){
        super(art);
        this.name = 'mask';
        const { template: template , icons: icons , events: events  } = art;
        $1617d61110f74a7d$export$10d8903dec122b9d(template.$state, icons.state);
        events.proxy(template.$state, 'click', ()=>art.play()
        );
    }
}



var $ea73f885035fc70c$exports = {};
$ea73f885035fc70c$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50px\" height=\"50px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"uil-default\">\n  <rect x=\"0\" y=\"0\" width=\"100\" height=\"100\" fill=\"none\" class=\"bk\"></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(0 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-1s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(30 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.9166666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(60 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.8333333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(90 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.75s\" repeatCount=\"indefinite\"></animate></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(120 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.6666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(150 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5833333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(180 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5s\" repeatCount=\"indefinite\"></animate></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(210 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.4166666666666667s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(240 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.3333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(270 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.25s\" repeatCount=\"indefinite\"></animate></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(300 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.16666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(330 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.08333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</svg>";


var $a318808550c32ac6$exports = {};
$a318808550c32ac6$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"60\" width=\"60\" style=\"filter: drop-shadow(0 1px 1px #000)\" viewBox=\"0 0 24 24\">\n    <path d=\"M20,2H4C1.8,2,0,3.8,0,6v12c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V6C24,3.8,22.2,2,20,2z M15.6,12.8L10.5,16 C9.9,16.5,9,16,9,15.2V8.8C9,8,9.9,7.5,10.5,8l5.1,3.2C16.3,11.5,16.3,12.5,15.6,12.8z\"></path>\n</svg>";


var $f4a5ad62ee3af34e$exports = {};
$f4a5ad62ee3af34e$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"100%\" version=\"1.1\" viewBox=\"0 0 24 24\" width=\"100%\"><path d=\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\" fill=\"#fff\"></path></svg>";


var $93fafa15944f6274$exports = {};
$93fafa15944f6274$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n  <path d=\"M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z\"></path>\n</svg>";


var $1bfbe8e3a51fd237$exports = {};
$1bfbe8e3a51fd237$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z\"></path>\n</svg>";


var $3565d9857c49b4ba$exports = {};
$3565d9857c49b4ba$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z\"></path>\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z\"></path>\n</svg>";


var $34048e42a1cebf0c$exports = {};
$34048e42a1cebf0c$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z\"></path>\n    <path d=\"M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z\"></path>\n</svg>";


var $e1361ff4dcafdf4b$exports = {};
$e1361ff4dcafdf4b$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 48 48\">\n    <path d=\"M0 0h48v48H0z\" fill=\"none\"></path>\n    <path d=\"M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z\"></path>\n</svg>";


var $e0523ecc964a3d0f$exports = {};
$e0523ecc964a3d0f$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 50 50\">\n\t<path d=\"M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z \"></path>\n</svg>\n";


var $659436e8c6d8debf$exports = {};
$659436e8c6d8debf$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <circle cx=\"11\" cy=\"11\" r=\"2\"></circle>\n    <path d=\"M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z\"></path>\n</svg>";


var $667a538d9bdd13c5$exports = {};
$667a538d9bdd13c5$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"36\" width=\"36\" viewBox=\"0 0 36 36\">\n\t<path d=\"m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z\"></path>\n\t<path d=\"m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z\"></path>\n\t<path d=\"m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z\"></path>\n\t<path d=\"M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z\"></path>\n</svg>";


var $238fab3092857e42$exports = {};
$238fab3092857e42$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" height=\"36\" width=\"36\">\n\t<path d=\"m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z\" fill-rule=\"evenodd\"></path>\n</svg>";


var $be072e4880963a9b$exports = {};
$be072e4880963a9b$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"100%\" version=\"1.1\" viewBox=\"0 0 32 32\" width=\"100%\"><path d=\"M 19.41,20.09 14.83,15.5 19.41,10.91 18,9.5 l -6,6 6,6 z\" fill=\"#fff\"></path></svg>";


var $cfca05de282e5208$exports = {};
$cfca05de282e5208$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"100%\" version=\"1.1\" viewBox=\"0 0 32 32\" width=\"100%\"><path d=\"m 12.59,20.34 4.58,-4.59 -4.58,-4.59 1.41,-1.41 6,6 -6,6 z\" fill=\"#fff\"></path></svg>";


var $ea77b339b12614aa$exports = {};
$ea77b339b12614aa$exports = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z\" fill=\"white\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill: #a8a6a4\"></path></svg>";


var $c6a8a0c1103b1f88$exports = {};
$c6a8a0c1103b1f88$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 88 88\" width=\"88\" height=\"88\" preserveAspectRatio=\"xMidYMid meet\" style=\"width: 100%; height: 100%; transform: translate3d(0, 0, 0)\"><defs><clipPath id=\"__lottie_element_216\"><rect width=\"88\" height=\"88\" x=\"0\" y=\"0\"></rect></clipPath></defs><g clip-path=\"url('#__lottie_element_216')\"><g transform=\"matrix(1,0,0,1,44,44)\" opacity=\"1\" style=\"display: block\"><g opacity=\"1\" transform=\"matrix(1,0,0,1,0,0)\"><path fill=\"rgb(255,255,255)\" fill-opacity=\"1\" d=\" M12.437999725341797,-12.70199966430664 C12.437999725341797,-12.70199966430664 9.618000030517578,-9.881999969482422 9.618000030517578,-9.881999969482422 C8.82800006866455,-9.092000007629395 8.82800006866455,-7.831999778747559 9.618000030517578,-7.052000045776367 C9.618000030517578,-7.052000045776367 16.687999725341797,0.017999999225139618 16.687999725341797,0.017999999225139618 C16.687999725341797,0.017999999225139618 9.618000030517578,7.0879998207092285 9.618000030517578,7.0879998207092285 C8.82800006866455,7.877999782562256 8.82800006866455,9.137999534606934 9.618000030517578,9.918000221252441 C9.618000030517578,9.918000221252441 12.437999725341797,12.748000144958496 12.437999725341797,12.748000144958496 C13.227999687194824,13.527999877929688 14.48799991607666,13.527999877929688 15.267999649047852,12.748000144958496 C15.267999649047852,12.748000144958496 26.58799934387207,1.437999963760376 26.58799934387207,1.437999963760376 C27.368000030517578,0.6579999923706055 27.368000030517578,-0.6119999885559082 26.58799934387207,-1.3919999599456787 C26.58799934387207,-1.3919999599456787 15.267999649047852,-12.70199966430664 15.267999649047852,-12.70199966430664 C14.48799991607666,-13.491999626159668 13.227999687194824,-13.491999626159668 12.437999725341797,-12.70199966430664z M-12.442000389099121,-12.70199966430664 C-13.182000160217285,-13.442000389099121 -14.362000465393066,-13.482000350952148 -15.142000198364258,-12.821999549865723 C-15.142000198364258,-12.821999549865723 -15.272000312805176,-12.70199966430664 -15.272000312805176,-12.70199966430664 C-15.272000312805176,-12.70199966430664 -26.582000732421875,-1.3919999599456787 -26.582000732421875,-1.3919999599456787 C-27.32200050354004,-0.6520000100135803 -27.36199951171875,0.5180000066757202 -26.70199966430664,1.3079999685287476 C-26.70199966430664,1.3079999685287476 -26.582000732421875,1.437999963760376 -26.582000732421875,1.437999963760376 C-26.582000732421875,1.437999963760376 -15.272000312805176,12.748000144958496 -15.272000312805176,12.748000144958496 C-14.531999588012695,13.48799991607666 -13.362000465393066,13.527999877929688 -12.571999549865723,12.868000030517578 C-12.571999549865723,12.868000030517578 -12.442000389099121,12.748000144958496 -12.442000389099121,12.748000144958496 C-12.442000389099121,12.748000144958496 -9.612000465393066,9.918000221252441 -9.612000465393066,9.918000221252441 C-8.871999740600586,9.178000450134277 -8.831999778747559,8.008000373840332 -9.501999855041504,7.2179999351501465 C-9.501999855041504,7.2179999351501465 -9.612000465393066,7.0879998207092285 -9.612000465393066,7.0879998207092285 C-9.612000465393066,7.0879998207092285 -16.68199920654297,0.017999999225139618 -16.68199920654297,0.017999999225139618 C-16.68199920654297,0.017999999225139618 -9.612000465393066,-7.052000045776367 -9.612000465393066,-7.052000045776367 C-8.871999740600586,-7.791999816894531 -8.831999778747559,-8.961999893188477 -9.501999855041504,-9.751999855041504 C-9.501999855041504,-9.751999855041504 -9.612000465393066,-9.881999969482422 -9.612000465393066,-9.881999969482422 C-9.612000465393066,-9.881999969482422 -12.442000389099121,-12.70199966430664 -12.442000389099121,-12.70199966430664z M28,-28 C32.41999816894531,-28 36,-24.420000076293945 36,-20 C36,-20 36,20 36,20 C36,24.420000076293945 32.41999816894531,28 28,28 C28,28 -28,28 -28,28 C-32.41999816894531,28 -36,24.420000076293945 -36,20 C-36,20 -36,-20 -36,-20 C-36,-24.420000076293945 -32.41999816894531,-28 -28,-28 C-28,-28 28,-28 28,-28z\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill: #a8a6a4\"></path></g></g></g></svg>";


var $1dad62262a809e52$exports = {};
$1dad62262a809e52$exports = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z            M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z\" fill=\"white\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill: #a8a6a4\"></path></svg>";


var $e0de5fe9f40e0c64$exports = {};
$e0de5fe9f40e0c64$exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" height=\"32\" width=\"32\">\n    <path d=\"M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z\"></path>\n</svg>";


var $baad8354f50de513$exports = {};
$baad8354f50de513$exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg t=\"1650612139149\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"12683\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"20\" height=\"20\"><defs>\n<style type=\"text/css\"></style></defs><path d=\"M298.666667 426.666667V341.333333a213.333333 213.333333 0 1 1 426.666666 0v85.333334h42.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667z m213.333333-213.333334a128 128 0 0 0-128 128v85.333334h256V341.333333a128 128 0 0 0-128-128z\" fill=\"#ffffff\" p-id=\"12684\"></path>\n</svg>";


var $a6b31ea821176f04$exports = {};
$a6b31ea821176f04$exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg t=\"1650612464266\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"14150\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"20\" height=\"20\"><defs>\n<style type=\"text/css\"></style></defs><path d=\"M666.752 194.517333L617.386667 268.629333A128 128 0 0 0 384 341.333333l0.042667 85.333334h384a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667V341.333333a213.333333 213.333333 0 0 1 368.085333-146.816z\" fill=\"#ffffff\" p-id=\"14151\"></path></svg>";


class $82c4f6420e2bb729$export$2e2bcd8739ae039 {
    constructor(art){
        const icons = {
            loading: (/*@__PURE__*/$parcel$interopDefault($ea73f885035fc70c$exports)),
            state: (/*@__PURE__*/$parcel$interopDefault($a318808550c32ac6$exports)),
            play: (/*@__PURE__*/$parcel$interopDefault($93fafa15944f6274$exports)),
            pause: (/*@__PURE__*/$parcel$interopDefault($1bfbe8e3a51fd237$exports)),
            check: (/*@__PURE__*/$parcel$interopDefault($f4a5ad62ee3af34e$exports)),
            volume: (/*@__PURE__*/$parcel$interopDefault($3565d9857c49b4ba$exports)),
            volumeClose: (/*@__PURE__*/$parcel$interopDefault($34048e42a1cebf0c$exports)),
            subtitle: (/*@__PURE__*/$parcel$interopDefault($e1361ff4dcafdf4b$exports)),
            screenshot: (/*@__PURE__*/$parcel$interopDefault($e0523ecc964a3d0f$exports)),
            setting: (/*@__PURE__*/$parcel$interopDefault($659436e8c6d8debf$exports)),
            fullscreen: (/*@__PURE__*/$parcel$interopDefault($667a538d9bdd13c5$exports)),
            fullscreenWeb: (/*@__PURE__*/$parcel$interopDefault($238fab3092857e42$exports)),
            pip: (/*@__PURE__*/$parcel$interopDefault($e0de5fe9f40e0c64$exports)),
            arrowLeft: (/*@__PURE__*/$parcel$interopDefault($be072e4880963a9b$exports)),
            arrowRight: (/*@__PURE__*/$parcel$interopDefault($cfca05de282e5208$exports)),
            playbackRate: (/*@__PURE__*/$parcel$interopDefault($ea77b339b12614aa$exports)),
            aspectRatio: (/*@__PURE__*/$parcel$interopDefault($c6a8a0c1103b1f88$exports)),
            config: (/*@__PURE__*/$parcel$interopDefault($1dad62262a809e52$exports)),
            lock: (/*@__PURE__*/$parcel$interopDefault($baad8354f50de513$exports)),
            unlock: (/*@__PURE__*/$parcel$interopDefault($a6b31ea821176f04$exports)),
            ...art.option.icons
        };
        Object.keys(icons).forEach((key)=>{
            $6b21bd176607d26d$export$8afb76124cf08683(this, key, {
                get: ()=>{
                    const icon = document.createElement('i');
                    $1617d61110f74a7d$export$d2cf6cd1dc7067d3(icon, 'art-icon');
                    $1617d61110f74a7d$export$d2cf6cd1dc7067d3(icon, `art-icon-${key}`);
                    $1617d61110f74a7d$export$10d8903dec122b9d(icon, icons[key]);
                    return icon;
                }
            });
        });
    }
}



function $07522957bcac9a25$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , icons: icons , constructor: constructor  } = art;
    const keys = {
        normal: 'Normal',
        horizontal: 'Horizontal',
        vertical: 'Vertical'
    };
    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = i18n.get(keys[value]);
        const $current = $1617d61110f74a7d$export$dcd0d083aa86c355('.art-setting-item', $panel).find((item)=>item.dataset.value === value
        );
        if ($current) $1617d61110f74a7d$export$ff1a70dcfa68e743($current, 'art-current');
    }
    return {
        width: constructor.SETTING_ITEM_WIDTH,
        html: i18n.get('Video Flip'),
        tooltip: i18n.get(keys[art.flip]),
        icon: icons.config,
        selector: Object.keys(keys).map((item)=>{
            return {
                value: item,
                default: item === art.flip,
                html: i18n.get(keys[item])
            };
        }),
        onSelect (item) {
            art.flip = item.value;
        },
        mounted: ($panel, item)=>{
            update($panel, item._$tooltip, art.flip);
            art.on('flip', ()=>{
                update($panel, item._$tooltip, art.flip);
            });
        }
    };
}



function $85bc3f596413f7b9$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , icons: icons , constructor: constructor  } = art;
    function getI18n(value) {
        return value === 'default' ? i18n.get('Default') : value;
    }
    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = $1617d61110f74a7d$export$dcd0d083aa86c355('.art-setting-item', $panel).find((item)=>item.dataset.value === value
        );
        if ($current) $1617d61110f74a7d$export$ff1a70dcfa68e743($current, 'art-current');
    }
    return {
        width: constructor.SETTING_ITEM_WIDTH,
        html: i18n.get('Aspect Ratio'),
        icon: icons.aspectRatio,
        tooltip: getI18n(art.aspectRatio),
        selector: [
            'default',
            '4:3',
            '16:9'
        ].map((item)=>{
            return {
                value: item,
                default: item === art.aspectRatio,
                html: getI18n(item)
            };
        }),
        onSelect (item) {
            art.aspectRatio = item.value;
        },
        mounted: ($panel, item)=>{
            update($panel, item._$tooltip, art.aspectRatio);
            art.on('aspectRatio', ()=>{
                update($panel, item._$tooltip, art.aspectRatio);
            });
        }
    };
}



function $ccc4e5bb833602ad$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , icons: icons , constructor: constructor  } = art;
    function getI18n(value) {
        return value === 1.0 ? i18n.get('Normal') : value;
    }
    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = $1617d61110f74a7d$export$dcd0d083aa86c355('.art-setting-item', $panel).find((item)=>Number(item.dataset.value) === value
        );
        if ($current) $1617d61110f74a7d$export$ff1a70dcfa68e743($current, 'art-current');
    }
    return {
        width: constructor.SETTING_ITEM_WIDTH,
        html: i18n.get('Play Speed'),
        tooltip: getI18n(art.playbackRate),
        icon: icons.playbackRate,
        selector: [
            0.5,
            0.75,
            1.0,
            1.25,
            1.5,
            2.0
        ].map((item)=>{
            return {
                value: item,
                default: item === art.playbackRate,
                html: getI18n(item)
            };
        }),
        onSelect (item) {
            art.playbackRate = item.value;
        },
        mounted: ($panel, item)=>{
            update($panel, item._$tooltip, art.playbackRate);
            art.on('playbackRate', ()=>{
                update($panel, item._$tooltip, art.playbackRate);
            });
        }
    };
}



function $5847b96169acf576$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , icons: icons , constructor: constructor  } = art;
    function getI18n(value) {
        return value === 0 ? i18n.get('Normal') : value;
    }
    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = $1617d61110f74a7d$export$dcd0d083aa86c355('.art-setting-item', $panel).find((item)=>Number(item.dataset.value) === value
        );
        if ($current) $1617d61110f74a7d$export$ff1a70dcfa68e743($current, 'art-current');
    }
    return {
        width: constructor.SETTING_ITEM_WIDTH,
        html: i18n.get('Subtitle Offset'),
        tooltip: getI18n(art.subtitleOffset),
        icon: icons.subtitle,
        selector: [
            -5,
            -4,
            -3,
            -2,
            -1,
            0,
            1,
            2,
            3,
            4,
            5
        ].map((item)=>{
            return {
                value: item,
                default: item === art.subtitleOffset,
                html: getI18n(item)
            };
        }),
        onSelect (item) {
            art.subtitleOffset = item.value;
        },
        mounted: ($panel, item)=>{
            update($panel, item._$tooltip, art.subtitleOffset);
            art.on('subtitleOffset', ()=>{
                update($panel, item._$tooltip, art.subtitleOffset);
            });
        }
    };
}




function $e5ec7c417fcf0d47$var$makeRecursion(option, parentItem, parentList) {
    for(let index = 0; index < option.length; index++){
        const item = option[index];
        item._parentItem = parentItem;
        item._parentList = parentList;
        if (item.selector) $e5ec7c417fcf0d47$var$makeRecursion(item.selector, item, option);
    }
    return option;
}
class $e5ec7c417fcf0d47$export$2e2bcd8739ae039 extends $9c5a9d082f4955c3$export$2e2bcd8739ae039 {
    constructor(art){
        super(art);
        const { option: option , events: { proxy: proxy  } , template: { $setting: $setting , $player: $player  } ,  } = art;
        this.art = art;
        this.name = 'setting';
        this.$parent = $setting;
        this.option = [];
        this.events = [];
        this.cache = new Map();
        if (option.setting) {
            art.once('video:loadedmetadata', ()=>{
                if (option.playbackRate) this.option.push($ccc4e5bb833602ad$export$2e2bcd8739ae039(art));
                if (option.aspectRatio) this.option.push($85bc3f596413f7b9$export$2e2bcd8739ae039(art));
                if (option.flip) this.option.push($07522957bcac9a25$export$2e2bcd8739ae039(art));
                if (option.subtitleOffset) this.option.push($5847b96169acf576$export$2e2bcd8739ae039(art));
                for(let index = 0; index < option.settings.length; index++)this.option.push(option.settings[index]);
                this.option = $e5ec7c417fcf0d47$var$makeRecursion(this.option);
                this.init(this.option);
            });
            art.on('blur', ()=>{
                if (this.show) {
                    this.show = false;
                    this.init(this.option);
                }
            });
            proxy($player, 'click', (event)=>{
                if (this.show && !$1617d61110f74a7d$export$89ce434956e92c43(event, art.controls.setting) && !$1617d61110f74a7d$export$89ce434956e92c43(event, this.$parent)) {
                    this.show = false;
                    this.init(this.option);
                }
            });
        }
    }
    add(callback) {
        if (typeof callback === 'function') this.option.push(callback(this.art));
        else this.option.push(callback);
        this.cache = new Map();
        this.events.forEach((event)=>event()
        );
        this.events = [];
        this.$parent.innerHTML = '';
        this.option = $e5ec7c417fcf0d47$var$makeRecursion(this.option);
        this.init(this.option);
    }
    creatHeader(item) {
        const { icons: icons , events: { proxy: proxy  } ,  } = this.art;
        const $item = document.createElement('div');
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($item, 'art-setting-item');
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($item, 'art-setting-item-back');
        const $left = $1617d61110f74a7d$export$10d8903dec122b9d($item, '<div class="art-setting-item-left"></div>');
        const $icon = document.createElement('div');
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($icon, 'art-setting-item-left-icon');
        $1617d61110f74a7d$export$10d8903dec122b9d($icon, icons.arrowLeft);
        $1617d61110f74a7d$export$10d8903dec122b9d($left, $icon);
        $1617d61110f74a7d$export$10d8903dec122b9d($left, item._parentItem.html);
        const event = proxy($item, 'click', ()=>{
            this.init(item._parentList);
        });
        this.events.push(event);
        return $item;
    }
    creatItem(item) {
        const { icons: icons , events: { proxy: proxy  } ,  } = this.art;
        const hasChildren = item.selector && item.selector.length;
        const $item = document.createElement('div');
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($item, 'art-setting-item');
        if (item.default) $1617d61110f74a7d$export$d2cf6cd1dc7067d3($item, 'art-current');
        const $left = $1617d61110f74a7d$export$10d8903dec122b9d($item, '<div class="art-setting-item-left"></div>');
        const $right = $1617d61110f74a7d$export$10d8903dec122b9d($item, '<div class="art-setting-item-right"></div>');
        const $icon = document.createElement('div');
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($icon, 'art-setting-item-left-icon');
        $1617d61110f74a7d$export$10d8903dec122b9d($icon, hasChildren ? item.icon || icons.config : icons.check);
        $1617d61110f74a7d$export$10d8903dec122b9d($left, $icon);
        item._$icon = $icon;
        $6b21bd176607d26d$export$8afb76124cf08683(item, 'icon', {
            get () {
                return $icon.innerHTML;
            },
            set (value) {
                if (typeof value === 'string' || typeof value === 'number') $icon.innerHTML = value;
            }
        });
        const $html = document.createElement('div');
        $1617d61110f74a7d$export$d2cf6cd1dc7067d3($html, 'art-setting-item-left-text');
        $1617d61110f74a7d$export$10d8903dec122b9d($html, item.html || '');
        $1617d61110f74a7d$export$10d8903dec122b9d($left, $html);
        item._$html = $html;
        $6b21bd176607d26d$export$8afb76124cf08683(item, 'html', {
            get () {
                return $html.innerHTML;
            },
            set (value) {
                if (typeof value === 'string' || typeof value === 'number') $html.innerHTML = value;
            }
        });
        if (hasChildren) {
            const $tooltip = document.createElement('div');
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3($tooltip, 'art-setting-item-right-tooltip');
            $1617d61110f74a7d$export$10d8903dec122b9d($tooltip, item.tooltip || '');
            $1617d61110f74a7d$export$10d8903dec122b9d($right, $tooltip);
            item._$tooltip = $tooltip;
            $6b21bd176607d26d$export$8afb76124cf08683(item, 'tooltip', {
                get () {
                    return $tooltip.innerHTML;
                },
                set (value) {
                    if (typeof value === 'string' || typeof value === 'number') $tooltip.innerHTML = value;
                }
            });
            const $arrow = document.createElement('div');
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3($arrow, 'art-setting-item-right-icon');
            $1617d61110f74a7d$export$10d8903dec122b9d($arrow, icons.arrowRight);
            $1617d61110f74a7d$export$10d8903dec122b9d($right, $arrow);
        }
        const event1 = proxy($item, 'click', async (event)=>{
            if (hasChildren) this.init(item.selector, item.width);
            else {
                $1617d61110f74a7d$export$ff1a70dcfa68e743($item, 'art-current');
                if (item._parentList) this.init(item._parentList);
                if (item._parentItem && item._parentItem.onSelect) {
                    const result = await item._parentItem.onSelect.call(this.art, item, $item, event);
                    if (item._parentItem._$tooltip) {
                        if (typeof result === 'string' || typeof result === 'number') item._parentItem._$tooltip.innerHTML = result;
                    }
                }
            }
        });
        this.events.push(event1);
        return $item;
    }
    init(option, width) {
        if (this.cache.has(option)) {
            const $panel = this.cache.get(option);
            $1617d61110f74a7d$export$ff1a70dcfa68e743($panel, 'art-current');
            $1617d61110f74a7d$export$37a5fde709c1db82(this.$parent, 'width', `${$panel.dataset.width}px`);
        } else {
            const $panel = document.createElement('div');
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3($panel, 'art-setting-panel');
            if (option[0] && option[0]._parentItem) $1617d61110f74a7d$export$10d8903dec122b9d($panel, this.creatHeader(option[0]));
            for(let index = 0; index < option.length; index++)$1617d61110f74a7d$export$10d8903dec122b9d($panel, this.creatItem(option[index]));
            $panel.dataset.width = width || this.art.constructor.SETTING_WIDTH;
            $1617d61110f74a7d$export$10d8903dec122b9d(this.$parent, $panel);
            this.cache.set(option, $panel);
            $1617d61110f74a7d$export$ff1a70dcfa68e743($panel, 'art-current');
            $1617d61110f74a7d$export$37a5fde709c1db82(this.$parent, 'width', `${$panel.dataset.width}px`);
            if (option[0] && option[0]._parentItem && option[0]._parentItem.mounted) option[0]._parentItem.mounted.call(this.art, $panel, option[0]._parentItem);
        }
    }
}


class $3978873f41bb02b6$export$2e2bcd8739ae039 {
    constructor(){
        this.name = 'artplayer_settings';
        this.settings = {};
    }
    get(key) {
        try {
            const storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
            return key ? storage[key] : storage;
        } catch (error) {
            return key ? this.settings[key] : this.settings;
        }
    }
    set(key, value) {
        try {
            const storage = Object.assign({}, this.get(), {
                [key]: value
            });
            window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch (error) {
            this.settings[key] = value;
        }
    }
    del(key) {
        try {
            const storage = this.get();
            delete storage[key];
            window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch (error) {
            delete this.settings[key];
        }
    }
    clear() {
        try {
            window.localStorage.removeItem(this.name);
        } catch (error) {
            this.settings = {};
        }
    }
}



function $8e33b1de5b364dcf$export$2e2bcd8739ae039(art) {
    art.on('ready', ()=>{
        art.layers.add({
            name: 'miniProgressBar',
            mounted ($progressBar) {
                art.on('destroy', ()=>{
                    $progressBar.style.display = 'none';
                });
                art.on('video:timeupdate', ()=>{
                    $progressBar.style.width = `${art.played * 100}%`;
                });
                art.on('setBar', (type, percentage)=>{
                    if (type === 'played') $progressBar.style.width = `${percentage * 100}%`;
                });
            }
        });
    });
    return {
        name: 'miniProgressBar'
    };
}



function $c1e42da5837b57c2$export$2e2bcd8739ae039(art) {
    const { option: option , constructor: constructor , template: { $player: $player , $video: $video  } ,  } = art;
    art.on('fullscreenWeb', (state)=>{
        if (state) {
            const { videoWidth: videoWidth , videoHeight: videoHeight  } = $video;
            const { clientWidth: viewWidth , clientHeight: viewHeight  } = document.documentElement;
            if (videoWidth > videoHeight && viewWidth < viewHeight || videoWidth < videoHeight && viewWidth > viewHeight) // There is a conflict with the fullscreen event, and it is changed to asynchronous execution
            setTimeout(()=>{
                $1617d61110f74a7d$export$37a5fde709c1db82($player, 'width', `${viewHeight}px`);
                $1617d61110f74a7d$export$37a5fde709c1db82($player, 'height', `${viewWidth}px`);
                $1617d61110f74a7d$export$37a5fde709c1db82($player, 'transform-origin', '0 0');
                $1617d61110f74a7d$export$37a5fde709c1db82($player, 'transform', `rotate(90deg) translate(0, -${viewWidth}px)`);
                $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-auto-orientation');
            }, constructor.MOBILE_AUTO_ORIENTATION_TIME);
        } else if ($1617d61110f74a7d$export$4ea3d958472af68f($player, 'art-auto-orientation')) {
            $1617d61110f74a7d$export$37a5fde709c1db82($player, 'width', null);
            $1617d61110f74a7d$export$37a5fde709c1db82($player, 'height', null);
            $1617d61110f74a7d$export$37a5fde709c1db82($player, 'transform', null);
            $1617d61110f74a7d$export$37a5fde709c1db82($player, 'transform-origin', null);
            $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-auto-orientation');
            art.aspectRatioReset = true;
            art.autoSize = option.autoSize;
            art.notice.show = '';
        }
    });
    art.on('fullscreen', (state)=>{
        const lastOrientation = screen.orientation.type;
        if (state) {
            const { videoWidth: videoWidth , videoHeight: videoHeight  } = $video;
            const { clientWidth: viewWidth , clientHeight: viewHeight  } = document.documentElement;
            if (videoWidth > videoHeight && viewWidth < viewHeight || videoWidth < videoHeight && viewWidth > viewHeight) {
                const oppositeOrientation = lastOrientation.startsWith('portrait') ? 'landscape' : 'portrait';
                screen.orientation.lock(oppositeOrientation).then(()=>{
                    $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-auto-orientation-fullscreen');
                });
            }
        } else if ($1617d61110f74a7d$export$4ea3d958472af68f($player, 'art-auto-orientation-fullscreen')) screen.orientation.lock(lastOrientation).then(()=>{
            $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-auto-orientation-fullscreen');
        });
    });
    return {
        name: 'autoOrientation',
        get state () {
            return $1617d61110f74a7d$export$4ea3d958472af68f($player, 'art-auto-orientation');
        }
    };
}



function $78b87c2a2d050eb1$export$2e2bcd8739ae039(art) {
    const { i18n: i18n , storage: storage , constructor: constructor , template: { $poster: $poster  } ,  } = art;
    art.on('video:timeupdate', ()=>{
        const times = storage.get('times') || {};
        const keys = Object.keys(times);
        if (keys.length > constructor.AUTO_PLAYBACK_MAX) delete times[keys[0]];
        times[art.option.url] = art.currentTime;
        storage.set('times', times);
    });
    art.on('ready', ()=>{
        const times = storage.get('times') || {};
        const currentTime = times[art.option.url];
        if (currentTime) {
            art.seek = currentTime;
            $1617d61110f74a7d$export$37a5fde709c1db82($poster, 'display', 'none');
            art.notice.show = `${i18n.get('Auto playback at')} ${$f82eff12ae1758cb$export$bfdd1c721864a50a(currentTime)}`;
        }
    });
    return {
        name: 'autoPlayback',
        get times () {
            return storage.get('times') || {};
        },
        clear () {
            return storage.del('times');
        }
    };
}



function $723aeb30421d5ffe$export$2e2bcd8739ae039(art) {
    const { constructor: constructor , events: { proxy: proxy  } , template: { $player: $player , $video: $video  } ,  } = art;
    let timer = null;
    let isPress = false;
    const onStart = (event)=>{
        if (event.touches.length === 1 && art.playing) timer = setTimeout(()=>{
            isPress = true;
            art.playbackRate = constructor.FAST_FORWARD_VALUE;
            $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-fast-forward');
        }, constructor.FAST_FORWARD_TIME);
    };
    const onStop = ()=>{
        clearTimeout(timer);
        if (isPress) {
            isPress = false;
            art.playbackRate = 1;
            $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-fast-forward');
        }
    };
    proxy($video, 'touchstart', onStart);
    proxy(document, 'touchmove', onStop);
    proxy(document, 'touchend', onStop);
    return {
        name: 'fastForward',
        get state () {
            return $1617d61110f74a7d$export$4ea3d958472af68f($player, 'art-fast-forward');
        }
    };
}



function $987d9aaf8fa2e706$export$2e2bcd8739ae039(art) {
    const { layers: layers , icons: icons , template: { $player: $player  } ,  } = art;
    layers.add({
        name: 'lock',
        mounted ($el) {
            const $lock = $1617d61110f74a7d$export$10d8903dec122b9d($el, icons.lock);
            const $unlock = $1617d61110f74a7d$export$10d8903dec122b9d($el, icons.unlock);
            $1617d61110f74a7d$export$37a5fde709c1db82($lock, 'display', 'none');
            art.on('lock', (state)=>{
                if (state) {
                    $1617d61110f74a7d$export$37a5fde709c1db82($lock, 'display', 'inline-flex');
                    $1617d61110f74a7d$export$37a5fde709c1db82($unlock, 'display', 'none');
                } else {
                    $1617d61110f74a7d$export$37a5fde709c1db82($lock, 'display', 'none');
                    $1617d61110f74a7d$export$37a5fde709c1db82($unlock, 'display', 'inline-flex');
                }
            });
        },
        click () {
            if ($1617d61110f74a7d$export$4ea3d958472af68f($player, 'art-lock')) {
                $1617d61110f74a7d$export$c2255604a80b4506($player, 'art-lock');
                art.emit('lock', false);
            } else {
                $1617d61110f74a7d$export$d2cf6cd1dc7067d3($player, 'art-lock');
                art.emit('lock', true);
            }
        }
    });
    return {
        name: 'lock',
        get state () {
            return $1617d61110f74a7d$export$4ea3d958472af68f($player, 'art-lock');
        }
    };
}


class $9d9cbfc93570c5e0$export$2e2bcd8739ae039 {
    constructor(art){
        this.art = art;
        this.id = 0;
        const { option: option  } = art;
        if (option.miniProgressBar && !option.isLive) this.add($8e33b1de5b364dcf$export$2e2bcd8739ae039);
        if (option.lock && $46f6a63658609cc7$export$d0a8044dce8ff2fc) this.add($987d9aaf8fa2e706$export$2e2bcd8739ae039);
        if (option.autoPlayback) this.add($78b87c2a2d050eb1$export$2e2bcd8739ae039);
        if (option.autoOrientation && $46f6a63658609cc7$export$d0a8044dce8ff2fc) this.add($c1e42da5837b57c2$export$2e2bcd8739ae039);
        if (option.fastForward && $46f6a63658609cc7$export$d0a8044dce8ff2fc && !option.isLive) this.add($723aeb30421d5ffe$export$2e2bcd8739ae039);
        for(let index = 0; index < option.plugins.length; index++)this.add(option.plugins[index]);
    }
    add(plugin) {
        this.id += 1;
        const result = plugin.call(this, this.art);
        const pluginName = result && result.name || plugin.name || `plugin${this.id}`;
        $9f39e86245920cd9$export$ff496a5a51be1527(!$6b21bd176607d26d$export$a4f4bb6b1453fff5(this, pluginName), `Cannot add a plugin that already has the same name: ${pluginName}`);
        $6b21bd176607d26d$export$8afb76124cf08683(this, pluginName, {
            value: result
        });
        return this;
    }
}


class $741625d8671c484a$export$2e2bcd8739ae039 {
    constructor(art){
        this.art = art;
        this.init();
    }
    get current() {
        return this.art.option.ads[this.index];
    }
    get prev() {
        return this.art.option.ads[this.index - 1];
    }
    get next() {
        return this.art.option.ads[this.index + 1];
    }
    init() {
        this.index = 0;
        this.isEnd = false;
        this.playing = false;
        this.urlCache = this.art.option.url;
        if (this.current) {
            this.playing = true;
            this.play(this.current);
        }
    }
    play(item = {}) {
        if (this.isEnd) return;
        this.art.switchUrl(item.url);
        this.art.once('video:timeupdate', ()=>{
            this.art.emit('ads:start', item);
        });
        this.art.once('video:ended', ()=>{
            const next = this.next;
            if (next) {
                this.index += 1;
                this.play(next);
            } else this.end();
        });
    }
    end() {
        if (this.isEnd) return;
        this.isEnd = true;
        this.playing = false;
        this.art.option.url = this.urlCache;
        this.art.switchUrl(this.urlCache);
        this.art.emit('ads:end');
    }
}




class $cf28796c28b9e292$export$2e2bcd8739ae039 {
    constructor(art){
        const { option: option , events: { proxy: proxy  } , template: { $video: $video  } ,  } = art;
        for(let index = 0; index < $6bdef3f9911d4dfd$export$2e2bcd8739ae039.events.length; index++)proxy($video, $6bdef3f9911d4dfd$export$2e2bcd8739ae039.events[index], (event)=>{
            art.emit(`video:${event.type}`, event);
        });
        Object.keys(option.moreVideoAttr).forEach((key)=>{
            $video[key] = option.moreVideoAttr[key];
        });
        if (option.muted) $video.muted = option.muted;
        if (option.volume) $video.volume = $f82eff12ae1758cb$export$7d15b64cf5a3a4c4(option.volume, 0, 1);
        if (option.poster) $video.poster = option.poster;
        if (option.autoplay) $video.autoplay = option.autoplay;
        if (option.playsInline) {
            $video.playsInline = true;
            $video['webkit-playsinline'] = true;
        }
        const typeName = option.type || $112d5cbf48554e5f$export$ba319cdd039ba52e(option.url);
        const typeCallback = option.customType[typeName];
        if (typeName && typeCallback) {
            typeCallback($video, option.url, art);
            art.emit('customType', typeName);
        } else {
            $video.src = option.url;
            art.emit('url', $video.src);
        }
    }
}


let $cdf9fe9adb2d02f9$var$id = 0;
const $cdf9fe9adb2d02f9$var$instances = [];
class $cdf9fe9adb2d02f9$export$2e2bcd8739ae039 extends $a2113e5ff6e5df5a$export$2e2bcd8739ae039 {
    constructor(option, readyCallback){
        super();
        this.id = ++$cdf9fe9adb2d02f9$var$id;
        const mergeOption = $719e22089069758c$exports.mergeDeep($cdf9fe9adb2d02f9$export$2e2bcd8739ae039.option, option);
        this.option = ($parcel$interopDefault($cTKjd$optionvalidator))(mergeOption, $10469c873ed71d57$export$2e2bcd8739ae039);
        this.isReady = false;
        this.isFocus = false;
        this.isDestroy = false;
        this.whitelist = new $63bba146437a34c3$export$2e2bcd8739ae039(this);
        this.template = new $420c1882d92b952b$export$2e2bcd8739ae039(this);
        this.events = new $9dd1746ab026757b$export$2e2bcd8739ae039(this);
        if (this.whitelist.state) {
            this.storage = new $3978873f41bb02b6$export$2e2bcd8739ae039(this);
            this.icons = new $82c4f6420e2bb729$export$2e2bcd8739ae039(this);
            this.i18n = new $8988e731cb9b6b27$export$2e2bcd8739ae039(this);
            this.notice = new $6281e0d09498f459$export$2e2bcd8739ae039(this);
            this.player = new $8f55b19a5260c651$export$2e2bcd8739ae039(this);
            this.layers = new $87ad6b3f378139e4$export$2e2bcd8739ae039(this);
            this.controls = new $5fbd4a5b2c9a3876$export$2e2bcd8739ae039(this);
            this.contextmenu = new $058f60678a15f124$export$2e2bcd8739ae039(this);
            this.subtitle = new $832c66d5be9ddefa$export$2e2bcd8739ae039(this);
            this.ads = new $741625d8671c484a$export$2e2bcd8739ae039(this);
            this.info = new $d6c99f18c678401b$export$2e2bcd8739ae039(this);
            this.loading = new $e3e38774bcec1905$export$2e2bcd8739ae039(this);
            this.hotkey = new $3e1980c05dfeee5d$export$2e2bcd8739ae039(this);
            this.mask = new $846b6021e30a62e3$export$2e2bcd8739ae039(this);
            this.setting = new $e5ec7c417fcf0d47$export$2e2bcd8739ae039(this);
            this.plugins = new $9d9cbfc93570c5e0$export$2e2bcd8739ae039(this);
        } else this.mobile = new $cf28796c28b9e292$export$2e2bcd8739ae039(this);
        if (typeof readyCallback === 'function') this.on('ready', ()=>readyCallback.call(this)
        );
        $cdf9fe9adb2d02f9$var$instances.push(this);
    }
    static get instances() {
        return $cdf9fe9adb2d02f9$var$instances;
    }
    static get version() {
        return "4.3.11";
    }
    static get env() {
        return "production";
    }
    static get build() {
        return "1651116320085";
    }
    static get config() {
        return $6bdef3f9911d4dfd$export$2e2bcd8739ae039;
    }
    static get utils() {
        return $719e22089069758c$exports;
    }
    static get scheme() {
        return $10469c873ed71d57$export$2e2bcd8739ae039;
    }
    static get Emitter() {
        return $a2113e5ff6e5df5a$export$2e2bcd8739ae039;
    }
    static get validator() {
        return ($parcel$interopDefault($cTKjd$optionvalidator));
    }
    static get kindOf() {
        return ($parcel$interopDefault($cTKjd$optionvalidator)).kindOf;
    }
    static get html() {
        return $420c1882d92b952b$export$2e2bcd8739ae039.html;
    }
    static get option() {
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
                preload: $719e22089069758c$exports.isSafari ? 'auto' : 'metadata'
            },
            icons: {},
            customType: {},
            lang: navigator.language.toLowerCase()
        };
    }
    get proxy() {
        return this.events.proxy;
    }
    get query() {
        return this.template.query;
    }
    destroy(removeHtml = true) {
        this.events.destroy();
        this.template.destroy(removeHtml);
        $cdf9fe9adb2d02f9$var$instances.splice($cdf9fe9adb2d02f9$var$instances.indexOf(this), 1);
        this.isDestroy = true;
        this.emit('destroy');
    }
}
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.NOTICE_TIME = 2000;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.SETTING_WIDTH = 250;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.SETTING_ITEM_WIDTH = 200;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.INDICATOR_SIZE = 14;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.INDICATOR_SIZE_ICON = 16;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.INDICATOR_SIZE_MOBILE = 18;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.INDICATOR_SIZE_MOBILE_ICON = 20;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.VOLUME_PANEL_WIDTH = 60;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.VOLUME_HANDLE_WIDTH = 12;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.RESIZE_TIME = 500;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.SCROLL_TIME = 200;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.SCROLL_GAP = 50;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.AUTO_PLAYBACK_MAX = 10;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.RECONNECT_TIME_MAX = 5;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.RECONNECT_SLEEP_TIME = 1000;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.CONTROL_HIDE_TIME = 3000;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.DB_CLICE_TIME = 300;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.MOBILE_AUTO_PLAYBACKRATE = 3;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.MOBILE_AUTO_PLAYBACKRATE_TIME = 1000;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.MOBILE_AUTO_ORIENTATION_TIME = 500;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.INFO_LOOP_TIME = 1000;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.FAST_FORWARD_VALUE = 3;
$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.FAST_FORWARD_TIME = 1000;
const $cdf9fe9adb2d02f9$var$$style = document.createElement('style');
$cdf9fe9adb2d02f9$var$$style.textContent = (/*@__PURE__*/$parcel$interopDefault($fc322dd812272489$exports));
document.head.appendChild($cdf9fe9adb2d02f9$var$$style);
window['Artplayer'] = $cdf9fe9adb2d02f9$export$2e2bcd8739ae039;
// eslint-disable-next-line no-console
console.log(`%c ArtPlayer %c ${$cdf9fe9adb2d02f9$export$2e2bcd8739ae039.version} %c https://artplayer.org`, 'color: #fff; background: #5f5f5f', 'color: #fff; background: #4bc729', '');


