// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"bppPX":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>artplayerPluginBilControl);
var _styleLess = require("bundle-text:./style.less");
var _styleLessDefault = parcelHelpers.interopDefault(_styleLess);
var _loadingJson = require("./icon/loading.json");
var _loadingJsonDefault = parcelHelpers.interopDefault(_loadingJson);
var _utils = require("./utils");
var _fullscreen = require("./fullscreen");
var _fullscreenDefault = parcelHelpers.interopDefault(_fullscreen);
var _fullscreenWeb = require("./fullscreenWeb");
var _fullscreenWebDefault = parcelHelpers.interopDefault(_fullscreenWeb);
var _setting = require("./setting");
var _settingDefault = parcelHelpers.interopDefault(_setting);
var _pip = require("./pip");
var _pipDefault = parcelHelpers.interopDefault(_pip);
var _volume = require("./volume");
var _volumeDefault = parcelHelpers.interopDefault(_volume);
var _playAndPause = require("./playAndPause");
var _playAndPauseDefault = parcelHelpers.interopDefault(_playAndPause);
function artplayerPluginBilControl(option) {
    return (art)=>{
        const { option, controls, template: { $loading }, constructor: { utils: { isMobile, query } } } = art;
        const $loadingDom = query(".art-icon-loading", $loading);
        $loadingDom.innerHTML = "";
        (0, _utils.createAnimation)({
            name: "loading",
            dom: $loadingDom,
            json: (0, _loadingJsonDefault.default),
            loop: true,
            autoplay: true
        });
        controls.remove("playAndPause");
        controls.add((0, _playAndPauseDefault.default)({
            name: "playAndPause",
            position: "left",
            index: 20
        }));
        controls.remove("volume");
        if (!isMobile) controls.add((0, _volumeDefault.default)({
            name: 'volume',
            position: 'right',
            index: 20
        }));
        if (option.fullscreen) {
            controls.remove("fullscreen");
            controls.add((0, _fullscreenDefault.default)({
                name: 'fullscreen',
                position: 'right',
                index: 70
            }));
        }
        if (option.setting) {
            controls.remove("setting");
            controls.add((0, _settingDefault.default)({
                name: 'setting',
                position: 'right',
                index: 30
            }));
        }
        if (option.fullscreenWeb) {
            controls.remove("fullscreenWeb");
            controls.add((0, _fullscreenWebDefault.default)({
                name: 'fullscreenWeb',
                position: 'right',
                index: 60
            }));
        }
        if (option.pip) {
            controls.remove("pip");
            controls.add((0, _pipDefault.default)({
                name: 'pip',
                position: 'right',
                index: 40
            }));
        }
        return {
            name: 'artplayerPluginBilControl'
        };
    };
}
if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-bil-control';
    const $style = document.getElementById(id);
    if ($style) $style.textContent = (0, _styleLessDefault.default);
    else {
        const $style = document.createElement('style');
        $style.id = id;
        $style.textContent = (0, _styleLessDefault.default);
        document.head.appendChild($style);
    }
}
if (typeof window !== 'undefined') window['artplayerPluginBilControl'] = artplayerPluginBilControl;

},{"bundle-text:./style.less":"1noEW","./icon/loading.json":"1oonX","./utils":"MbBnn","./fullscreen":"2oJPK","./fullscreenWeb":"kkGp3","./setting":"4Fa0q","./pip":"d3fFw","./volume":"kZYtt","./playAndPause":"bZrNz","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"1noEW":[function(require,module,exports,__globalThis) {
module.exports = ".art-video-player {\n  --art-control-icon-size: 22px;\n}\n";

},{}],"1oonX":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.5","fr":30,"ip":0,"op":90,"w":24,"h":24,"nm":"loading - blue","ddd":0,"assets":[{"id":"comp_0","layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u5706\u70B93","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":10,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":20,"s":[100]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":30,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":40,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":50,"s":[100]},{"t":60,"s":[0]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[16.844,14.031,0],"ix":2},"a":{"a":0,"k":[-2.25,2.781,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.774,0],[0,-0.774],[-0.774,0],[0,0.774]],"o":[[-0.774,0],[0,0.774],[0.774,0],[0,-0.774]],"v":[[0,-1.402],[-1.402,0],[0,1.402],[1.402,0]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.270588248968,0.270588248968,0.270588248968,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-2.285,2.715],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u692D\u5706 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":60,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"\u5706\u70B92","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":5,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":15,"s":[100]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":25,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":35,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":45,"s":[100]},{"t":55,"s":[0]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[12.156,14.031,0],"ix":2},"a":{"a":0,"k":[-2.25,2.781,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.774,0],[0,-0.774],[-0.774,0],[0,0.774]],"o":[[-0.774,0],[0,0.774],[0.774,0],[0,-0.774]],"v":[[0,-1.402],[-1.402,0],[0,1.402],[1.402,0]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.270588248968,0.270588248968,0.270588248968,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-2.285,2.715],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u692D\u5706 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":60,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"\u5706\u70B91","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":10,"s":[100]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":20,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":30,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":40,"s":[100]},{"t":50,"s":[0]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[7.625,14.031,0],"ix":2},"a":{"a":0,"k":[-2.25,2.781,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.774,0],[0,-0.774],[-0.774,0],[0,0.774]],"o":[[-0.774,0],[0,0.774],[0.774,0],[0,-0.774]],"v":[[0,-1.402],[-1.402,0],[0,1.402],[1.402,0]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.270588248968,0.270588248968,0.270588248968,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-2.285,2.715],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u692D\u5706 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":60,"st":0,"bm":0}]}],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u5F62\u72B6\u56FE\u5C42 4","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[12,12,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[],"ip":0,"op":90,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"\u5929\u7EBF\u5DE6 2","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":-45,"ix":10},"p":{"a":0,"k":[7.391,1.8,0],"ix":2},"a":{"a":0,"k":[-0.298,-9.69,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":60,"s":[100,0,100]},{"t":63,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.408,0],[0,-0.408],[0,0],[-0.408,0],[0,0.408],[0,0]],"o":[[-0.408,0],[0,0],[0,0.408],[0.408,0],[0,0],[0,-0.408]],"v":[[0,-3.388],[-0.739,-2.649],[-0.739,2.649],[0,3.388],[0.739,2.649],[0.739,-2.649]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.270588248968,0.270588248968,0.270588248968,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-0.26,-6.371],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u77E9\u5F62 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":60,"op":90,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"\u5929\u7EBF\u53F3 2","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":45,"ix":10},"p":{"a":0,"k":[12.297,5.7,0],"ix":2},"a":{"a":0,"k":[-0.376,-4.176,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":80,"s":[100,0,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":84,"s":[100,110,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":87,"s":[100,95,100]},{"t":90,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.408,0],[0,-0.408],[0,0],[-0.408,0],[0,0.408],[0,0]],"o":[[-0.408,0],[0,0],[0,0.408],[0.408,0],[0,0],[0,-0.408]],"v":[[0,-3.388],[-0.739,-2.649],[-0.739,2.649],[0,3.388],[0.739,2.649],[0.739,-2.649]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.270588248968,0.270588248968,0.270588248968,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-0.26,-6.371],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u77E9\u5F62 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":60,"op":90,"st":0,"bm":0},{"ddd":0,"ind":4,"ty":4,"nm":"\u5F62\u72B6\u56FE\u5C42 5","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[12,13.75,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[98.401,107.097,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"st","c":{"a":0,"k":[0.043137256056,0.639215707779,0.584313750267,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":1.5,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0.043137256056,0.639215707779,0.584313750267,1],"ix":4},"o":{"a":0,"k":0,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6 3","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0]],"o":[[0,0]],"v":[[-0.191,0.233]],"c":false},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0.631372570992,0.839215695858,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":1.5,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0.043137256056,0.639215707779,0.584313750267,1],"ix":4},"o":{"a":0,"k":0,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6 2","np":3,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[3.048,0],[0,-2.201],[0,-1.598],[-3.016,0],[-2.482,0],[0,2.092],[0,1.8],[3.055,0]],"o":[[0,0],[-3.048,0],[0,2.031],[0,2.087],[2.031,0],[3.054,0],[0,-1.875],[0,-2.15],[-1.844,0]],"v":[[-0.05,-6.758],[-6.13,-6.726],[-10.121,-2.585],[-10.137,3.078],[-6.162,6.816],[6.092,6.822],[10.27,3.073],[10.285,-2.635],[6.091,-6.718]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":0,"k":100,"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"\u4FEE\u526A\u8DEF\u5F84 1","mn":"ADBE Vector Filter - Trim","hd":false},{"ty":"st","c":{"a":0,"k":[0,0.631372570992,0.839215695858,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":1.5,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0.043137256056,0.639215707779,0.584313750267,1],"ix":4},"o":{"a":0,"k":0,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6 1","np":4,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":60,"st":-60,"bm":0},{"ddd":0,"ind":5,"ty":4,"nm":"\u5F62\u72B6\u56FE\u5C42 1","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[12,13.75,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[98.401,107.097,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"st","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":1.5,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0.043137254902,0.639215686275,0.58431372549,1],"ix":4},"o":{"a":0,"k":0,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6 3","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0]],"o":[[0,0]],"v":[[-0.191,0.233]],"c":false},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":1.5,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0.043137254902,0.639215686275,0.58431372549,1],"ix":4},"o":{"a":0,"k":0,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6 2","np":3,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[3.048,0],[0,-2.201],[0,-1.598],[-3.016,0],[-2.482,0],[0,2.092],[0,1.8],[3.055,0]],"o":[[0,0],[-3.048,0],[0,2.031],[0,2.087],[2.031,0],[3.054,0],[0,-1.875],[0,-2.15],[-1.844,0]],"v":[[-0.05,-6.758],[-6.13,-6.726],[-10.121,-2.585],[-10.137,3.078],[-6.162,6.816],[6.092,6.822],[10.27,3.073],[10.285,-2.635],[6.091,-6.718]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.547],"y":[1]},"o":{"x":[0.453],"y":[0]},"t":63,"s":[0]},{"t":80,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"\u4FEE\u526A\u8DEF\u5F84 1","mn":"ADBE Vector Filter - Trim","hd":false},{"ty":"st","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":1.5,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0.043137254902,0.639215686275,0.58431372549,1],"ix":4},"o":{"a":0,"k":0,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6 1","np":4,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false}],"ip":60,"op":90,"st":0,"bm":0},{"ddd":0,"ind":6,"ty":0,"nm":"\u70B9\u70B9\u70B9 - blue","refId":"comp_0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[12,12,0],"ix":2},"a":{"a":0,"k":[12,12,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"w":24,"h":24,"ip":0,"op":90,"st":0,"bm":0},{"ddd":0,"ind":7,"ty":4,"nm":"\u5929\u7EBF\u5DE6","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":50,"s":[100]},{"t":60,"s":[0]}],"ix":11},"r":{"a":0,"k":-45,"ix":10},"p":{"a":0,"k":[7.391,1.8,0],"ix":2},"a":{"a":0,"k":[-0.298,-9.69,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.408,0],[0,-0.408],[0,0],[-0.408,0],[0,0.408],[0,0]],"o":[[-0.408,0],[0,0],[0,0.408],[0.408,0],[0,0],[0,-0.408]],"v":[[0,-3.388],[-0.739,-2.649],[-0.739,2.649],[0,3.388],[0.739,2.649],[0.739,-2.649]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.270588248968,0.270588248968,0.270588248968,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-0.26,-6.371],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u77E9\u5F62 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":60,"st":0,"bm":0},{"ddd":0,"ind":8,"ty":4,"nm":"\u5929\u7EBF\u53F3","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":50,"s":[100]},{"t":60,"s":[0]}],"ix":11},"r":{"a":0,"k":45,"ix":10},"p":{"a":0,"k":[12.297,5.7,0],"ix":2},"a":{"a":0,"k":[-0.376,-4.176,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.408,0],[0,-0.408],[0,0],[-0.408,0],[0,0.408],[0,0]],"o":[[-0.408,0],[0,0],[0,0.408],[0.408,0],[0,0],[0,-0.408]],"v":[[0,-3.388],[-0.739,-2.649],[-0.739,2.649],[0,3.388],[0.739,2.649],[0.739,-2.649]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.270588248968,0.270588248968,0.270588248968,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"\u63CF\u8FB9 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0.63137254902,0.839215686275,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-0.26,-6.371],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u77E9\u5F62 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":60,"st":0,"bm":0}],"markers":[]}');

},{}],"MbBnn":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createAnimation", ()=>createAnimation);
var _lottieLightMinJs = require("lottie-web/build/player/lottie_light.min.js");
var _lottieLightMinJsDefault = parcelHelpers.interopDefault(_lottieLightMinJs);
const createAnimation = (options)=>{
    const { name, dom, json, loop = false, autoplay = false } = options;
    return (0, _lottieLightMinJsDefault.default).loadAnimation({
        name,
        animationData: json,
        container: dom,
        renderer: "svg",
        loop,
        autoplay
    });
};

},{"lottie-web/build/player/lottie_light.min.js":"7A5d3","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"7A5d3":[function(require,module,exports,__globalThis) {
"undefined" != typeof document && "undefined" != typeof navigator && function(t, e) {
    module.exports = e();
}(this, function() {
    "use strict";
    var t = "", e = !1, i = -999999, s = function() {
        return t;
    };
    function a(t) {
        return document.createElement(t);
    }
    function r(t, e) {
        var i, s, a = t.length;
        for(i = 0; i < a; i += 1)for(var r in s = t[i].prototype)Object.prototype.hasOwnProperty.call(s, r) && (e.prototype[r] = s[r]);
    }
    function n(t) {
        function e() {}
        return e.prototype = t, e;
    }
    var o = function() {
        function t(t) {
            this.audios = [], this.audioFactory = t, this._volume = 1, this._isMuted = !1;
        }
        return t.prototype = {
            addAudio: function(t) {
                this.audios.push(t);
            },
            pause: function() {
                var t, e = this.audios.length;
                for(t = 0; t < e; t += 1)this.audios[t].pause();
            },
            resume: function() {
                var t, e = this.audios.length;
                for(t = 0; t < e; t += 1)this.audios[t].resume();
            },
            setRate: function(t) {
                var e, i = this.audios.length;
                for(e = 0; e < i; e += 1)this.audios[e].setRate(t);
            },
            createAudio: function(t) {
                return this.audioFactory ? this.audioFactory(t) : window.Howl ? new window.Howl({
                    src: [
                        t
                    ]
                }) : {
                    isPlaying: !1,
                    play: function() {
                        this.isPlaying = !0;
                    },
                    seek: function() {
                        this.isPlaying = !1;
                    },
                    playing: function() {},
                    rate: function() {},
                    setVolume: function() {}
                };
            },
            setAudioFactory: function(t) {
                this.audioFactory = t;
            },
            setVolume: function(t) {
                this._volume = t, this._updateVolume();
            },
            mute: function() {
                this._isMuted = !0, this._updateVolume();
            },
            unmute: function() {
                this._isMuted = !1, this._updateVolume();
            },
            getVolume: function() {
                return this._volume;
            },
            _updateVolume: function() {
                var t, e = this.audios.length;
                for(t = 0; t < e; t += 1)this.audios[t].volume(this._volume * (this._isMuted ? 0 : 1));
            }
        }, function() {
            return new t;
        };
    }(), h = function() {
        function t(t, e) {
            var i, s = 0, a = [];
            switch(t){
                case "int16":
                case "uint8c":
                    i = 1;
                    break;
                default:
                    i = 1.1;
            }
            for(s = 0; s < e; s += 1)a.push(i);
            return a;
        }
        return "function" == typeof Uint8ClampedArray && "function" == typeof Float32Array ? function(e, i) {
            return "float32" === e ? new Float32Array(i) : "int16" === e ? new Int16Array(i) : "uint8c" === e ? new Uint8ClampedArray(i) : t(e, i);
        } : t;
    }();
    function l(t) {
        return Array.apply(null, {
            length: t
        });
    }
    function p(t) {
        return p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t;
        } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
        }, p(t);
    }
    var f = !0, d = null, m = null, c = "", u = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), g = Math.pow, y = Math.sqrt, v = Math.floor, b = (Math.max, Math.min), _ = {};
    !function() {
        var t, e = [
            "abs",
            "acos",
            "acosh",
            "asin",
            "asinh",
            "atan",
            "atanh",
            "atan2",
            "ceil",
            "cbrt",
            "expm1",
            "clz32",
            "cos",
            "cosh",
            "exp",
            "floor",
            "fround",
            "hypot",
            "imul",
            "log",
            "log1p",
            "log2",
            "log10",
            "max",
            "min",
            "pow",
            "random",
            "round",
            "sign",
            "sin",
            "sinh",
            "sqrt",
            "tan",
            "tanh",
            "trunc",
            "E",
            "LN10",
            "LN2",
            "LOG10E",
            "LOG2E",
            "PI",
            "SQRT1_2",
            "SQRT2"
        ], i = e.length;
        for(t = 0; t < i; t += 1)_[e[t]] = Math[e[t]];
    }(), _.random = Math.random, _.abs = function(t) {
        if ("object" === p(t) && t.length) {
            var e, i = l(t.length), s = t.length;
            for(e = 0; e < s; e += 1)i[e] = Math.abs(t[e]);
            return i;
        }
        return Math.abs(t);
    };
    var k = 150, P = Math.PI / 180, A = .5519;
    function S(t) {}
    function x(t, e, i, s) {
        this.type = t, this.currentTime = e, this.totalTime = i, this.direction = s < 0 ? -1 : 1;
    }
    function w(t, e) {
        this.type = t, this.direction = e < 0 ? -1 : 1;
    }
    function D(t, e, i, s) {
        this.type = t, this.currentLoop = i, this.totalLoops = e, this.direction = s < 0 ? -1 : 1;
    }
    function C(t, e, i) {
        this.type = t, this.firstFrame = e, this.totalFrames = i;
    }
    function M(t, e) {
        this.type = t, this.target = e;
    }
    function T(t, e) {
        this.type = "renderFrameError", this.nativeError = t, this.currentTime = e;
    }
    function F(t) {
        this.type = "configError", this.nativeError = t;
    }
    var E, I = (E = 0, function() {
        return c + "__lottie_element_" + (E += 1);
    });
    function L(t, e, i) {
        var s, a, r, n, o, h, l, p;
        switch(h = i * (1 - e), l = i * (1 - (o = 6 * t - (n = Math.floor(6 * t))) * e), p = i * (1 - (1 - o) * e), n % 6){
            case 0:
                s = i, a = p, r = h;
                break;
            case 1:
                s = l, a = i, r = h;
                break;
            case 2:
                s = h, a = i, r = p;
                break;
            case 3:
                s = h, a = l, r = i;
                break;
            case 4:
                s = p, a = h, r = i;
                break;
            case 5:
                s = i, a = h, r = l;
        }
        return [
            s,
            a,
            r
        ];
    }
    function V(t, e, i) {
        var s, a = Math.max(t, e, i), r = Math.min(t, e, i), n = a - r, o = 0 === a ? 0 : n / a, h = a / 255;
        switch(a){
            case r:
                s = 0;
                break;
            case t:
                s = e - i + n * (e < i ? 6 : 0), s /= 6 * n;
                break;
            case e:
                s = i - t + 2 * n, s /= 6 * n;
                break;
            case i:
                s = t - e + 4 * n, s /= 6 * n;
        }
        return [
            s,
            o,
            h
        ];
    }
    function R(t, e) {
        var i = V(255 * t[0], 255 * t[1], 255 * t[2]);
        return i[1] += e, i[1] > 1 ? i[1] = 1 : i[1] <= 0 && (i[1] = 0), L(i[0], i[1], i[2]);
    }
    function z(t, e) {
        var i = V(255 * t[0], 255 * t[1], 255 * t[2]);
        return i[2] += e, i[2] > 1 ? i[2] = 1 : i[2] < 0 && (i[2] = 0), L(i[0], i[1], i[2]);
    }
    function O(t, e) {
        var i = V(255 * t[0], 255 * t[1], 255 * t[2]);
        return i[0] += e / 360, i[0] > 1 ? i[0] -= 1 : i[0] < 0 && (i[0] += 1), L(i[0], i[1], i[2]);
    }
    !function() {
        var t, e, i = [];
        for(t = 0; t < 256; t += 1)e = t.toString(16), i[t] = 1 === e.length ? "0" + e : e;
    }();
    var N = function() {
        return d;
    }, B = function() {
        return m;
    }, q = function(t) {
        k = t;
    }, j = function() {
        return k;
    };
    function W(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t);
    }
    function X(t) {
        return X = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t;
        } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
        }, X(t);
    }
    var H = function() {
        var t, i, s = 1, a = [], r = {
            onmessage: function() {},
            postMessage: function(e) {
                t({
                    data: e
                });
            }
        }, n = {
            postMessage: function(t) {
                r.onmessage({
                    data: t
                });
            }
        };
        function o(i) {
            if (window.Worker && window.Blob && e) {
                var s = new Blob([
                    "var _workerSelf = self; self.onmessage = ",
                    i.toString()
                ], {
                    type: "text/javascript"
                }), a = URL.createObjectURL(s);
                return new Worker(a);
            }
            return t = i, r;
        }
        function h() {
            i || (i = o(function(t) {
                if (n.dataManager || (n.dataManager = function() {
                    function t(a, r) {
                        var n, o, h, l, p, d, m = a.length;
                        for(o = 0; o < m; o += 1)if ("ks" in (n = a[o]) && !n.completed) {
                            if (n.completed = !0, n.hasMask) {
                                var c = n.masksProperties;
                                for(l = c.length, h = 0; h < l; h += 1)if (c[h].pt.k.i) s(c[h].pt.k);
                                else for(d = c[h].pt.k.length, p = 0; p < d; p += 1)c[h].pt.k[p].s && s(c[h].pt.k[p].s[0]), c[h].pt.k[p].e && s(c[h].pt.k[p].e[0]);
                            }
                            0 === n.ty ? (n.layers = e(n.refId, r), t(n.layers, r)) : 4 === n.ty ? i(n.shapes) : 5 === n.ty && f(n);
                        }
                    }
                    function e(t, e) {
                        var i = function(t, e) {
                            for(var i = 0, s = e.length; i < s;){
                                if (e[i].id === t) return e[i];
                                i += 1;
                            }
                            return null;
                        }(t, e);
                        return i ? i.layers.__used ? JSON.parse(JSON.stringify(i.layers)) : (i.layers.__used = !0, i.layers) : null;
                    }
                    function i(t) {
                        var e, a, r;
                        for(e = t.length - 1; e >= 0; e -= 1)if ("sh" === t[e].ty) {
                            if (t[e].ks.k.i) s(t[e].ks.k);
                            else for(r = t[e].ks.k.length, a = 0; a < r; a += 1)t[e].ks.k[a].s && s(t[e].ks.k[a].s[0]), t[e].ks.k[a].e && s(t[e].ks.k[a].e[0]);
                        } else "gr" === t[e].ty && i(t[e].it);
                    }
                    function s(t) {
                        var e, i = t.i.length;
                        for(e = 0; e < i; e += 1)t.i[e][0] += t.v[e][0], t.i[e][1] += t.v[e][1], t.o[e][0] += t.v[e][0], t.o[e][1] += t.v[e][1];
                    }
                    function a(t, e) {
                        var i = e ? e.split(".") : [
                            100,
                            100,
                            100
                        ];
                        return t[0] > i[0] || !(i[0] > t[0]) && (t[1] > i[1] || !(i[1] > t[1]) && (t[2] > i[2] || !(i[2] > t[2]) && null));
                    }
                    var r, n = function() {
                        var t = [
                            4,
                            4,
                            14
                        ];
                        function e(t) {
                            var e, i, s, a = t.length;
                            for(e = 0; e < a; e += 1)5 === t[e].ty && (s = void 0, s = (i = t[e]).t.d, i.t.d = {
                                k: [
                                    {
                                        s: s,
                                        t: 0
                                    }
                                ]
                            });
                        }
                        return function(i) {
                            if (a(t, i.v) && (e(i.layers), i.assets)) {
                                var s, r = i.assets.length;
                                for(s = 0; s < r; s += 1)i.assets[s].layers && e(i.assets[s].layers);
                            }
                        };
                    }(), o = (r = [
                        4,
                        7,
                        99
                    ], function(t) {
                        if (t.chars && !a(r, t.v)) {
                            var e, s = t.chars.length;
                            for(e = 0; e < s; e += 1){
                                var n = t.chars[e];
                                n.data && n.data.shapes && (i(n.data.shapes), n.data.ip = 0, n.data.op = 99999, n.data.st = 0, n.data.sr = 1, n.data.ks = {
                                    p: {
                                        k: [
                                            0,
                                            0
                                        ],
                                        a: 0
                                    },
                                    s: {
                                        k: [
                                            100,
                                            100
                                        ],
                                        a: 0
                                    },
                                    a: {
                                        k: [
                                            0,
                                            0
                                        ],
                                        a: 0
                                    },
                                    r: {
                                        k: 0,
                                        a: 0
                                    },
                                    o: {
                                        k: 100,
                                        a: 0
                                    }
                                }, t.chars[e].t || (n.data.shapes.push({
                                    ty: "no"
                                }), n.data.shapes[0].it.push({
                                    p: {
                                        k: [
                                            0,
                                            0
                                        ],
                                        a: 0
                                    },
                                    s: {
                                        k: [
                                            100,
                                            100
                                        ],
                                        a: 0
                                    },
                                    a: {
                                        k: [
                                            0,
                                            0
                                        ],
                                        a: 0
                                    },
                                    r: {
                                        k: 0,
                                        a: 0
                                    },
                                    o: {
                                        k: 100,
                                        a: 0
                                    },
                                    sk: {
                                        k: 0,
                                        a: 0
                                    },
                                    sa: {
                                        k: 0,
                                        a: 0
                                    },
                                    ty: "tr"
                                })));
                            }
                        }
                    }), h = function() {
                        var t = [
                            5,
                            7,
                            15
                        ];
                        function e(t) {
                            var e, i, s = t.length;
                            for(e = 0; e < s; e += 1)5 === t[e].ty && (i = void 0, "number" == typeof (i = t[e].t.p).a && (i.a = {
                                a: 0,
                                k: i.a
                            }), "number" == typeof i.p && (i.p = {
                                a: 0,
                                k: i.p
                            }), "number" == typeof i.r && (i.r = {
                                a: 0,
                                k: i.r
                            }));
                        }
                        return function(i) {
                            if (a(t, i.v) && (e(i.layers), i.assets)) {
                                var s, r = i.assets.length;
                                for(s = 0; s < r; s += 1)i.assets[s].layers && e(i.assets[s].layers);
                            }
                        };
                    }(), l = function() {
                        var t = [
                            4,
                            1,
                            9
                        ];
                        function e(t) {
                            var i, s, a, r = t.length;
                            for(i = 0; i < r; i += 1)if ("gr" === t[i].ty) e(t[i].it);
                            else if ("fl" === t[i].ty || "st" === t[i].ty) {
                                if (t[i].c.k && t[i].c.k[0].i) for(a = t[i].c.k.length, s = 0; s < a; s += 1)t[i].c.k[s].s && (t[i].c.k[s].s[0] /= 255, t[i].c.k[s].s[1] /= 255, t[i].c.k[s].s[2] /= 255, t[i].c.k[s].s[3] /= 255), t[i].c.k[s].e && (t[i].c.k[s].e[0] /= 255, t[i].c.k[s].e[1] /= 255, t[i].c.k[s].e[2] /= 255, t[i].c.k[s].e[3] /= 255);
                                else t[i].c.k[0] /= 255, t[i].c.k[1] /= 255, t[i].c.k[2] /= 255, t[i].c.k[3] /= 255;
                            }
                        }
                        function i(t) {
                            var i, s = t.length;
                            for(i = 0; i < s; i += 1)4 === t[i].ty && e(t[i].shapes);
                        }
                        return function(e) {
                            if (a(t, e.v) && (i(e.layers), e.assets)) {
                                var s, r = e.assets.length;
                                for(s = 0; s < r; s += 1)e.assets[s].layers && i(e.assets[s].layers);
                            }
                        };
                    }(), p = function() {
                        var t = [
                            4,
                            4,
                            18
                        ];
                        function e(t) {
                            var i, s, a;
                            for(i = t.length - 1; i >= 0; i -= 1)if ("sh" === t[i].ty) {
                                if (t[i].ks.k.i) t[i].ks.k.c = t[i].closed;
                                else for(a = t[i].ks.k.length, s = 0; s < a; s += 1)t[i].ks.k[s].s && (t[i].ks.k[s].s[0].c = t[i].closed), t[i].ks.k[s].e && (t[i].ks.k[s].e[0].c = t[i].closed);
                            } else "gr" === t[i].ty && e(t[i].it);
                        }
                        function i(t) {
                            var i, s, a, r, n, o, h = t.length;
                            for(s = 0; s < h; s += 1){
                                if ((i = t[s]).hasMask) {
                                    var l = i.masksProperties;
                                    for(r = l.length, a = 0; a < r; a += 1)if (l[a].pt.k.i) l[a].pt.k.c = l[a].cl;
                                    else for(o = l[a].pt.k.length, n = 0; n < o; n += 1)l[a].pt.k[n].s && (l[a].pt.k[n].s[0].c = l[a].cl), l[a].pt.k[n].e && (l[a].pt.k[n].e[0].c = l[a].cl);
                                }
                                4 === i.ty && e(i.shapes);
                            }
                        }
                        return function(e) {
                            if (a(t, e.v) && (i(e.layers), e.assets)) {
                                var s, r = e.assets.length;
                                for(s = 0; s < r; s += 1)e.assets[s].layers && i(e.assets[s].layers);
                            }
                        };
                    }();
                    function f(t) {
                        0 === t.t.a.length && t.t.p;
                    }
                    var d = {
                        completeData: function(i) {
                            i.__complete || (l(i), n(i), o(i), h(i), p(i), t(i.layers, i.assets), function(i, s) {
                                if (i) {
                                    var a = 0, r = i.length;
                                    for(a = 0; a < r; a += 1)1 === i[a].t && (i[a].data.layers = e(i[a].data.refId, s), t(i[a].data.layers, s));
                                }
                            }(i.chars, i.assets), i.__complete = !0);
                        }
                    };
                    return d.checkColors = l, d.checkChars = o, d.checkPathProperties = h, d.checkShapes = p, d.completeLayers = t, d;
                }()), n.assetLoader || (n.assetLoader = function() {
                    function t(t) {
                        var e = t.getResponseHeader("content-type");
                        return e && "json" === t.responseType && -1 !== e.indexOf("json") || t.response && "object" === X(t.response) ? t.response : t.response && "string" == typeof t.response ? JSON.parse(t.response) : t.responseText ? JSON.parse(t.responseText) : null;
                    }
                    return {
                        load: function(e, i, s, a) {
                            var r, n = new XMLHttpRequest;
                            try {
                                n.responseType = "json";
                            } catch (t) {}
                            n.onreadystatechange = function() {
                                if (4 === n.readyState) {
                                    if (200 === n.status) r = t(n), s(r);
                                    else try {
                                        r = t(n), s(r);
                                    } catch (t) {
                                        a && a(t);
                                    }
                                }
                            };
                            try {
                                n.open([
                                    "G",
                                    "E",
                                    "T"
                                ].join(""), e, !0);
                            } catch (t) {
                                n.open([
                                    "G",
                                    "E",
                                    "T"
                                ].join(""), i + "/" + e, !0);
                            }
                            n.send();
                        }
                    };
                }()), "loadAnimation" === t.data.type) n.assetLoader.load(t.data.path, t.data.fullPath, function(e) {
                    n.dataManager.completeData(e), n.postMessage({
                        id: t.data.id,
                        payload: e,
                        status: "success"
                    });
                }, function() {
                    n.postMessage({
                        id: t.data.id,
                        status: "error"
                    });
                });
                else if ("complete" === t.data.type) {
                    var e = t.data.animation;
                    n.dataManager.completeData(e), n.postMessage({
                        id: t.data.id,
                        payload: e,
                        status: "success"
                    });
                } else "loadData" === t.data.type && n.assetLoader.load(t.data.path, t.data.fullPath, function(e) {
                    n.postMessage({
                        id: t.data.id,
                        payload: e,
                        status: "success"
                    });
                }, function() {
                    n.postMessage({
                        id: t.data.id,
                        status: "error"
                    });
                });
            }), i.onmessage = function(t) {
                var e = t.data, i = e.id, s = a[i];
                a[i] = null, "success" === e.status ? s.onComplete(e.payload) : s.onError && s.onError();
            });
        }
        function l(t, e) {
            var i = "processId_" + (s += 1);
            return a[i] = {
                onComplete: t,
                onError: e
            }, i;
        }
        return {
            loadAnimation: function(t, e, s) {
                h();
                var a = l(e, s);
                i.postMessage({
                    type: "loadAnimation",
                    path: t,
                    fullPath: window.location.origin + window.location.pathname,
                    id: a
                });
            },
            loadData: function(t, e, s) {
                h();
                var a = l(e, s);
                i.postMessage({
                    type: "loadData",
                    path: t,
                    fullPath: window.location.origin + window.location.pathname,
                    id: a
                });
            },
            completeAnimation: function(t, e, s) {
                h();
                var a = l(e, s);
                i.postMessage({
                    type: "complete",
                    animation: t,
                    id: a
                });
            }
        };
    }(), Y = function() {
        var t = function() {
            var t = a("canvas");
            t.width = 1, t.height = 1;
            var e = t.getContext("2d");
            return e.fillStyle = "rgba(0,0,0,0)", e.fillRect(0, 0, 1, 1), t;
        }();
        function e() {
            this.loadedAssets += 1, this.loadedAssets === this.totalImages && this.loadedFootagesCount === this.totalFootages && this.imagesLoadedCb && this.imagesLoadedCb(null);
        }
        function i() {
            this.loadedFootagesCount += 1, this.loadedAssets === this.totalImages && this.loadedFootagesCount === this.totalFootages && this.imagesLoadedCb && this.imagesLoadedCb(null);
        }
        function s(t, e, i) {
            var s = "";
            if (t.e) s = t.p;
            else if (e) {
                var a = t.p;
                -1 !== a.indexOf("images/") && (a = a.split("/")[1]), s = e + a;
            } else s = i, s += t.u ? t.u : "", s += t.p;
            return s;
        }
        function r(t) {
            var e = 0, i = setInterval((function() {
                (t.getBBox().width || e > 500) && (this._imageLoaded(), clearInterval(i)), e += 1;
            }).bind(this), 50);
        }
        function n(t) {
            var e = {
                assetData: t
            }, i = s(t, this.assetsPath, this.path);
            return H.loadData(i, (function(t) {
                e.img = t, this._footageLoaded();
            }).bind(this), (function() {
                e.img = {}, this._footageLoaded();
            }).bind(this)), e;
        }
        function o() {
            this._imageLoaded = e.bind(this), this._footageLoaded = i.bind(this), this.testImageLoaded = r.bind(this), this.createFootageData = n.bind(this), this.assetsPath = "", this.path = "", this.totalImages = 0, this.totalFootages = 0, this.loadedAssets = 0, this.loadedFootagesCount = 0, this.imagesLoadedCb = null, this.images = [];
        }
        return o.prototype = {
            loadAssets: function(t, e) {
                var i;
                this.imagesLoadedCb = e;
                var s = t.length;
                for(i = 0; i < s; i += 1)t[i].layers || (t[i].t && "seq" !== t[i].t ? 3 === t[i].t && (this.totalFootages += 1, this.images.push(this.createFootageData(t[i]))) : (this.totalImages += 1, this.images.push(this._createImageData(t[i]))));
            },
            setAssetsPath: function(t) {
                this.assetsPath = t || "";
            },
            setPath: function(t) {
                this.path = t || "";
            },
            loadedImages: function() {
                return this.totalImages === this.loadedAssets;
            },
            loadedFootages: function() {
                return this.totalFootages === this.loadedFootagesCount;
            },
            destroy: function() {
                this.imagesLoadedCb = null, this.images.length = 0;
            },
            getAsset: function(t) {
                for(var e = 0, i = this.images.length; e < i;){
                    if (this.images[e].assetData === t) return this.images[e].img;
                    e += 1;
                }
                return null;
            },
            createImgData: function(e) {
                var i = s(e, this.assetsPath, this.path), r = a("img");
                r.crossOrigin = "anonymous", r.addEventListener("load", this._imageLoaded, !1), r.addEventListener("error", (function() {
                    n.img = t, this._imageLoaded();
                }).bind(this), !1), r.src = i;
                var n = {
                    img: r,
                    assetData: e
                };
                return n;
            },
            createImageData: function(e) {
                var i = s(e, this.assetsPath, this.path), a = W("image");
                u ? this.testImageLoaded(a) : a.addEventListener("load", this._imageLoaded, !1), a.addEventListener("error", (function() {
                    r.img = t, this._imageLoaded();
                }).bind(this), !1), a.setAttributeNS("http://www.w3.org/1999/xlink", "href", i), this._elementHelper.append ? this._elementHelper.append(a) : this._elementHelper.appendChild(a);
                var r = {
                    img: a,
                    assetData: e
                };
                return r;
            },
            imageLoaded: e,
            footageLoaded: i,
            setCacheType: function(t, e) {
                "svg" === t ? (this._elementHelper = e, this._createImageData = this.createImageData.bind(this)) : this._createImageData = this.createImgData.bind(this);
            }
        }, o;
    }();
    function G() {}
    G.prototype = {
        triggerEvent: function(t, e) {
            if (this._cbs[t]) for(var i = this._cbs[t], s = 0; s < i.length; s += 1)i[s](e);
        },
        addEventListener: function(t, e) {
            return this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e), (function() {
                this.removeEventListener(t, e);
            }).bind(this);
        },
        removeEventListener: function(t, e) {
            if (e) {
                if (this._cbs[t]) {
                    for(var i = 0, s = this._cbs[t].length; i < s;)this._cbs[t][i] === e && (this._cbs[t].splice(i, 1), i -= 1, s -= 1), i += 1;
                    this._cbs[t].length || (this._cbs[t] = null);
                }
            } else this._cbs[t] = null;
        }
    };
    var K = function() {
        function t(t) {
            for(var e, i = t.split("\r\n"), s = {}, a = 0, r = 0; r < i.length; r += 1)2 === (e = i[r].split(":")).length && (s[e[0]] = e[1].trim(), a += 1);
            if (0 === a) throw new Error;
            return s;
        }
        return function(e) {
            for(var i = [], s = 0; s < e.length; s += 1){
                var a = e[s], r = {
                    time: a.tm,
                    duration: a.dr
                };
                try {
                    r.payload = JSON.parse(e[s].cm);
                } catch (i) {
                    try {
                        r.payload = t(e[s].cm);
                    } catch (t) {
                        r.payload = {
                            name: e[s].cm
                        };
                    }
                }
                i.push(r);
            }
            return i;
        };
    }(), J = function() {
        function t(t) {
            this.compositions.push(t);
        }
        return function() {
            function e(t) {
                for(var e = 0, i = this.compositions.length; e < i;){
                    if (this.compositions[e].data && this.compositions[e].data.nm === t) return this.compositions[e].prepareFrame && this.compositions[e].data.xt && this.compositions[e].prepareFrame(this.currentFrame), this.compositions[e].compInterface;
                    e += 1;
                }
                return null;
            }
            return e.compositions = [], e.currentFrame = 0, e.registerComposition = t, e;
        };
    }(), U = {};
    function Z(t) {
        return Z = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t;
        } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
        }, Z(t);
    }
    var Q = function() {
        this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.firstFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.playCount = 0, this.animationData = {}, this.assets = [], this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = I(), this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, this.isSubframeEnabled = f, this.segments = [], this._idle = !0, this._completedLoop = !1, this.projectInterface = J(), this.imagePreloader = new Y, this.audioController = o(), this.markers = [], this.configAnimation = this.configAnimation.bind(this), this.onSetupError = this.onSetupError.bind(this), this.onSegmentComplete = this.onSegmentComplete.bind(this), this.drawnFrameEvent = new x("drawnFrame", 0, 0, 0), this.expressionsPlugin = N();
    };
    r([
        G
    ], Q), Q.prototype.setParams = function(t) {
        (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
        var e = "svg";
        t.animType ? e = t.animType : t.renderer && (e = t.renderer);
        var i = U[e];
        this.renderer = new i(this, t.rendererSettings), this.imagePreloader.setCacheType(e, this.renderer.globalData.defs), this.renderer.setProjectInterface(this.projectInterface), this.animType = e, "" === t.loop || null === t.loop || void 0 === t.loop || !0 === t.loop ? this.loop = !0 : !1 === t.loop ? this.loop = !1 : this.loop = parseInt(t.loop, 10), this.autoplay = !("autoplay" in t) || t.autoplay, this.name = t.name ? t.name : "", this.autoloadSegments = !Object.prototype.hasOwnProperty.call(t, "autoloadSegments") || t.autoloadSegments, this.assetsPath = t.assetsPath, this.initialSegment = t.initialSegment, t.audioFactory && this.audioController.setAudioFactory(t.audioFactory), t.animationData ? this.setupAnimation(t.animationData) : t.path && (-1 !== t.path.lastIndexOf("\\") ? this.path = t.path.substr(0, t.path.lastIndexOf("\\") + 1) : this.path = t.path.substr(0, t.path.lastIndexOf("/") + 1), this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), H.loadAnimation(t.path, this.configAnimation, this.onSetupError));
    }, Q.prototype.onSetupError = function() {
        this.trigger("data_failed");
    }, Q.prototype.setupAnimation = function(t) {
        H.completeAnimation(t, this.configAnimation);
    }, Q.prototype.setData = function(t, e) {
        e && "object" !== Z(e) && (e = JSON.parse(e));
        var i = {
            wrapper: t,
            animationData: e
        }, s = t.attributes;
        i.path = s.getNamedItem("data-animation-path") ? s.getNamedItem("data-animation-path").value : s.getNamedItem("data-bm-path") ? s.getNamedItem("data-bm-path").value : s.getNamedItem("bm-path") ? s.getNamedItem("bm-path").value : "", i.animType = s.getNamedItem("data-anim-type") ? s.getNamedItem("data-anim-type").value : s.getNamedItem("data-bm-type") ? s.getNamedItem("data-bm-type").value : s.getNamedItem("bm-type") ? s.getNamedItem("bm-type").value : s.getNamedItem("data-bm-renderer") ? s.getNamedItem("data-bm-renderer").value : s.getNamedItem("bm-renderer") ? s.getNamedItem("bm-renderer").value : function() {
            if (U.canvas) return "canvas";
            for(var t in U)if (U[t]) return t;
            return "";
        }() || "canvas";
        var a = s.getNamedItem("data-anim-loop") ? s.getNamedItem("data-anim-loop").value : s.getNamedItem("data-bm-loop") ? s.getNamedItem("data-bm-loop").value : s.getNamedItem("bm-loop") ? s.getNamedItem("bm-loop").value : "";
        "false" === a ? i.loop = !1 : "true" === a ? i.loop = !0 : "" !== a && (i.loop = parseInt(a, 10));
        var r = s.getNamedItem("data-anim-autoplay") ? s.getNamedItem("data-anim-autoplay").value : s.getNamedItem("data-bm-autoplay") ? s.getNamedItem("data-bm-autoplay").value : !s.getNamedItem("bm-autoplay") || s.getNamedItem("bm-autoplay").value;
        i.autoplay = "false" !== r, i.name = s.getNamedItem("data-name") ? s.getNamedItem("data-name").value : s.getNamedItem("data-bm-name") ? s.getNamedItem("data-bm-name").value : s.getNamedItem("bm-name") ? s.getNamedItem("bm-name").value : "", "false" === (s.getNamedItem("data-anim-prerender") ? s.getNamedItem("data-anim-prerender").value : s.getNamedItem("data-bm-prerender") ? s.getNamedItem("data-bm-prerender").value : s.getNamedItem("bm-prerender") ? s.getNamedItem("bm-prerender").value : "") && (i.prerender = !1), i.path ? this.setParams(i) : this.trigger("destroy");
    }, Q.prototype.includeLayers = function(t) {
        t.op > this.animationData.op && (this.animationData.op = t.op, this.totalFrames = Math.floor(t.op - this.animationData.ip));
        var e, i, s = this.animationData.layers, a = s.length, r = t.layers, n = r.length;
        for(i = 0; i < n; i += 1)for(e = 0; e < a;){
            if (s[e].id === r[i].id) {
                s[e] = r[i];
                break;
            }
            e += 1;
        }
        if ((t.chars || t.fonts) && (this.renderer.globalData.fontManager.addChars(t.chars), this.renderer.globalData.fontManager.addFonts(t.fonts, this.renderer.globalData.defs)), t.assets) for(a = t.assets.length, e = 0; e < a; e += 1)this.animationData.assets.push(t.assets[e]);
        this.animationData.__complete = !1, H.completeAnimation(this.animationData, this.onSegmentComplete);
    }, Q.prototype.onSegmentComplete = function(t) {
        this.animationData = t;
        var e = N();
        e && e.initExpressions(this), this.loadNextSegment();
    }, Q.prototype.loadNextSegment = function() {
        var t = this.animationData.segments;
        if (!t || 0 === t.length || !this.autoloadSegments) return this.trigger("data_ready"), void (this.timeCompleted = this.totalFrames);
        var e = t.shift();
        this.timeCompleted = e.time * this.frameRate;
        var i = this.path + this.fileName + "_" + this.segmentPos + ".json";
        this.segmentPos += 1, H.loadData(i, this.includeLayers.bind(this), (function() {
            this.trigger("data_failed");
        }).bind(this));
    }, Q.prototype.loadSegments = function() {
        this.animationData.segments || (this.timeCompleted = this.totalFrames), this.loadNextSegment();
    }, Q.prototype.imagesLoaded = function() {
        this.trigger("loaded_images"), this.checkLoaded();
    }, Q.prototype.preloadImages = function() {
        this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this));
    }, Q.prototype.configAnimation = function(t) {
        if (this.renderer) try {
            this.animationData = t, this.initialSegment ? (this.totalFrames = Math.floor(this.initialSegment[1] - this.initialSegment[0]), this.firstFrame = Math.round(this.initialSegment[0])) : (this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.firstFrame = Math.round(this.animationData.ip)), this.renderer.configAnimation(t), t.assets || (t.assets = []), this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.frameMult = this.animationData.fr / 1e3, this.renderer.searchExtraCompositions(t.assets), this.markers = K(t.markers || []), this.trigger("config_ready"), this.preloadImages(), this.loadSegments(), this.updaFrameModifier(), this.waitForFontsLoaded(), this.isPaused && this.audioController.pause();
        } catch (t) {
            this.triggerConfigError(t);
        }
    }, Q.prototype.waitForFontsLoaded = function() {
        this.renderer && (this.renderer.globalData.fontManager.isLoaded ? this.checkLoaded() : setTimeout(this.waitForFontsLoaded.bind(this), 20));
    }, Q.prototype.checkLoaded = function() {
        if (!this.isLoaded && this.renderer.globalData.fontManager.isLoaded && (this.imagePreloader.loadedImages() || "canvas" !== this.renderer.rendererType) && this.imagePreloader.loadedFootages()) {
            this.isLoaded = !0;
            var t = N();
            t && t.initExpressions(this), this.renderer.initItems(), setTimeout((function() {
                this.trigger("DOMLoaded");
            }).bind(this), 0), this.gotoFrame(), this.autoplay && this.play();
        }
    }, Q.prototype.resize = function(t, e) {
        var i = "number" == typeof t ? t : void 0, s = "number" == typeof e ? e : void 0;
        this.renderer.updateContainerSize(i, s);
    }, Q.prototype.setSubframe = function(t) {
        this.isSubframeEnabled = !!t;
    }, Q.prototype.gotoFrame = function() {
        this.currentFrame = this.isSubframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame, this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame(), this.trigger("drawnFrame");
    }, Q.prototype.renderFrame = function() {
        if (!1 !== this.isLoaded && this.renderer) try {
            this.expressionsPlugin && this.expressionsPlugin.resetFrame(), this.renderer.renderFrame(this.currentFrame + this.firstFrame);
        } catch (t) {
            this.triggerRenderFrameError(t);
        }
    }, Q.prototype.play = function(t) {
        t && this.name !== t || !0 === this.isPaused && (this.isPaused = !1, this.trigger("_play"), this.audioController.resume(), this._idle && (this._idle = !1, this.trigger("_active")));
    }, Q.prototype.pause = function(t) {
        t && this.name !== t || !1 === this.isPaused && (this.isPaused = !0, this.trigger("_pause"), this._idle = !0, this.trigger("_idle"), this.audioController.pause());
    }, Q.prototype.togglePause = function(t) {
        t && this.name !== t || (!0 === this.isPaused ? this.play() : this.pause());
    }, Q.prototype.stop = function(t) {
        t && this.name !== t || (this.pause(), this.playCount = 0, this._completedLoop = !1, this.setCurrentRawFrameValue(0));
    }, Q.prototype.getMarkerData = function(t) {
        for(var e, i = 0; i < this.markers.length; i += 1)if ((e = this.markers[i]).payload && e.payload.name === t) return e;
        return null;
    }, Q.prototype.goToAndStop = function(t, e, i) {
        if (!i || this.name === i) {
            var s = Number(t);
            if (isNaN(s)) {
                var a = this.getMarkerData(t);
                a && this.goToAndStop(a.time, !0);
            } else e ? this.setCurrentRawFrameValue(t) : this.setCurrentRawFrameValue(t * this.frameModifier);
            this.pause();
        }
    }, Q.prototype.goToAndPlay = function(t, e, i) {
        if (!i || this.name === i) {
            var s = Number(t);
            if (isNaN(s)) {
                var a = this.getMarkerData(t);
                a && (a.duration ? this.playSegments([
                    a.time,
                    a.time + a.duration
                ], !0) : this.goToAndStop(a.time, !0));
            } else this.goToAndStop(s, e, i);
            this.play();
        }
    }, Q.prototype.advanceTime = function(t) {
        if (!0 !== this.isPaused && !1 !== this.isLoaded) {
            var e = this.currentRawFrame + t * this.frameModifier, i = !1;
            e >= this.totalFrames - 1 && this.frameModifier > 0 ? this.loop && this.playCount !== this.loop ? e >= this.totalFrames ? (this.playCount += 1, this.checkSegments(e % this.totalFrames) || (this.setCurrentRawFrameValue(e % this.totalFrames), this._completedLoop = !0, this.trigger("loopComplete"))) : this.setCurrentRawFrameValue(e) : this.checkSegments(e > this.totalFrames ? e % this.totalFrames : 0) || (i = !0, e = this.totalFrames - 1) : e < 0 ? this.checkSegments(e % this.totalFrames) || (!this.loop || this.playCount-- <= 0 && !0 !== this.loop ? (i = !0, e = 0) : (this.setCurrentRawFrameValue(this.totalFrames + e % this.totalFrames), this._completedLoop ? this.trigger("loopComplete") : this._completedLoop = !0)) : this.setCurrentRawFrameValue(e), i && (this.setCurrentRawFrameValue(e), this.pause(), this.trigger("complete"));
        }
    }, Q.prototype.adjustSegment = function(t, e) {
        this.playCount = 0, t[1] < t[0] ? (this.frameModifier > 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.totalFrames = t[0] - t[1], this.timeCompleted = this.totalFrames, this.firstFrame = t[1], this.setCurrentRawFrameValue(this.totalFrames - .001 - e)) : t[1] > t[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.totalFrames = t[1] - t[0], this.timeCompleted = this.totalFrames, this.firstFrame = t[0], this.setCurrentRawFrameValue(.001 + e)), this.trigger("segmentStart");
    }, Q.prototype.setSegment = function(t, e) {
        var i = -1;
        this.isPaused && (this.currentRawFrame + this.firstFrame < t ? i = t : this.currentRawFrame + this.firstFrame > e && (i = e - t)), this.firstFrame = t, this.totalFrames = e - t, this.timeCompleted = this.totalFrames, -1 !== i && this.goToAndStop(i, !0);
    }, Q.prototype.playSegments = function(t, e) {
        if (e && (this.segments.length = 0), "object" === Z(t[0])) {
            var i, s = t.length;
            for(i = 0; i < s; i += 1)this.segments.push(t[i]);
        } else this.segments.push(t);
        this.segments.length && e && this.adjustSegment(this.segments.shift(), 0), this.isPaused && this.play();
    }, Q.prototype.resetSegments = function(t) {
        this.segments.length = 0, this.segments.push([
            this.animationData.ip,
            this.animationData.op
        ]), t && this.checkSegments(0);
    }, Q.prototype.checkSegments = function(t) {
        return !!this.segments.length && (this.adjustSegment(this.segments.shift(), t), !0);
    }, Q.prototype.destroy = function(t) {
        t && this.name !== t || !this.renderer || (this.renderer.destroy(), this.imagePreloader.destroy(), this.trigger("destroy"), this._cbs = null, this.onEnterFrame = null, this.onLoopComplete = null, this.onComplete = null, this.onSegmentStart = null, this.onDestroy = null, this.renderer = null, this.expressionsPlugin = null, this.imagePreloader = null, this.projectInterface = null);
    }, Q.prototype.setCurrentRawFrameValue = function(t) {
        this.currentRawFrame = t, this.gotoFrame();
    }, Q.prototype.setSpeed = function(t) {
        this.playSpeed = t, this.updaFrameModifier();
    }, Q.prototype.setDirection = function(t) {
        this.playDirection = t < 0 ? -1 : 1, this.updaFrameModifier();
    }, Q.prototype.setLoop = function(t) {
        this.loop = t;
    }, Q.prototype.setVolume = function(t, e) {
        e && this.name !== e || this.audioController.setVolume(t);
    }, Q.prototype.getVolume = function() {
        return this.audioController.getVolume();
    }, Q.prototype.mute = function(t) {
        t && this.name !== t || this.audioController.mute();
    }, Q.prototype.unmute = function(t) {
        t && this.name !== t || this.audioController.unmute();
    }, Q.prototype.updaFrameModifier = function() {
        this.frameModifier = this.frameMult * this.playSpeed * this.playDirection, this.audioController.setRate(this.playSpeed * this.playDirection);
    }, Q.prototype.getPath = function() {
        return this.path;
    }, Q.prototype.getAssetsPath = function(t) {
        var e = "";
        if (t.e) e = t.p;
        else if (this.assetsPath) {
            var i = t.p;
            -1 !== i.indexOf("images/") && (i = i.split("/")[1]), e = this.assetsPath + i;
        } else e = this.path, e += t.u ? t.u : "", e += t.p;
        return e;
    }, Q.prototype.getAssetData = function(t) {
        for(var e = 0, i = this.assets.length; e < i;){
            if (t === this.assets[e].id) return this.assets[e];
            e += 1;
        }
        return null;
    }, Q.prototype.hide = function() {
        this.renderer.hide();
    }, Q.prototype.show = function() {
        this.renderer.show();
    }, Q.prototype.getDuration = function(t) {
        return t ? this.totalFrames : this.totalFrames / this.frameRate;
    }, Q.prototype.updateDocumentData = function(t, e, i) {
        try {
            this.renderer.getElementByPath(t).updateDocumentData(e, i);
        } catch (t) {}
    }, Q.prototype.trigger = function(t) {
        if (this._cbs && this._cbs[t]) switch(t){
            case "enterFrame":
                this.triggerEvent(t, new x(t, this.currentFrame, this.totalFrames, this.frameModifier));
                break;
            case "drawnFrame":
                this.drawnFrameEvent.currentTime = this.currentFrame, this.drawnFrameEvent.totalTime = this.totalFrames, this.drawnFrameEvent.direction = this.frameModifier, this.triggerEvent(t, this.drawnFrameEvent);
                break;
            case "loopComplete":
                this.triggerEvent(t, new D(t, this.loop, this.playCount, this.frameMult));
                break;
            case "complete":
                this.triggerEvent(t, new w(t, this.frameMult));
                break;
            case "segmentStart":
                this.triggerEvent(t, new C(t, this.firstFrame, this.totalFrames));
                break;
            case "destroy":
                this.triggerEvent(t, new M(t, this));
                break;
            default:
                this.triggerEvent(t);
        }
        "enterFrame" === t && this.onEnterFrame && this.onEnterFrame.call(this, new x(t, this.currentFrame, this.totalFrames, this.frameMult)), "loopComplete" === t && this.onLoopComplete && this.onLoopComplete.call(this, new D(t, this.loop, this.playCount, this.frameMult)), "complete" === t && this.onComplete && this.onComplete.call(this, new w(t, this.frameMult)), "segmentStart" === t && this.onSegmentStart && this.onSegmentStart.call(this, new C(t, this.firstFrame, this.totalFrames)), "destroy" === t && this.onDestroy && this.onDestroy.call(this, new M(t, this));
    }, Q.prototype.triggerRenderFrameError = function(t) {
        var e = new T(t, this.currentFrame);
        this.triggerEvent("error", e), this.onError && this.onError.call(this, e);
    }, Q.prototype.triggerConfigError = function(t) {
        var e = new F(t, this.currentFrame);
        this.triggerEvent("error", e), this.onError && this.onError.call(this, e);
    };
    var $ = function() {
        var t = {}, e = [], i = 0, s = 0, r = 0, n = !0, o = !1;
        function h(t) {
            for(var i = 0, a = t.target; i < s;)e[i].animation === a && (e.splice(i, 1), i -= 1, s -= 1, a.isPaused || f()), i += 1;
        }
        function l(t, i) {
            if (!t) return null;
            for(var a = 0; a < s;){
                if (e[a].elem === t && null !== e[a].elem) return e[a].animation;
                a += 1;
            }
            var r = new Q;
            return d(r, t), r.setData(t, i), r;
        }
        function p() {
            r += 1, u();
        }
        function f() {
            r -= 1;
        }
        function d(t, i) {
            t.addEventListener("destroy", h), t.addEventListener("_active", p), t.addEventListener("_idle", f), e.push({
                elem: i,
                animation: t
            }), s += 1;
        }
        function m(t) {
            var a, h = t - i;
            for(a = 0; a < s; a += 1)e[a].animation.advanceTime(h);
            i = t, r && !o ? window.requestAnimationFrame(m) : n = !0;
        }
        function c(t) {
            i = t, window.requestAnimationFrame(m);
        }
        function u() {
            !o && r && n && (window.requestAnimationFrame(c), n = !1);
        }
        return t.registerAnimation = l, t.loadAnimation = function(t) {
            var e = new Q;
            return d(e, null), e.setParams(t), e;
        }, t.setSpeed = function(t, i) {
            var a;
            for(a = 0; a < s; a += 1)e[a].animation.setSpeed(t, i);
        }, t.setDirection = function(t, i) {
            var a;
            for(a = 0; a < s; a += 1)e[a].animation.setDirection(t, i);
        }, t.play = function(t) {
            var i;
            for(i = 0; i < s; i += 1)e[i].animation.play(t);
        }, t.pause = function(t) {
            var i;
            for(i = 0; i < s; i += 1)e[i].animation.pause(t);
        }, t.stop = function(t) {
            var i;
            for(i = 0; i < s; i += 1)e[i].animation.stop(t);
        }, t.togglePause = function(t) {
            var i;
            for(i = 0; i < s; i += 1)e[i].animation.togglePause(t);
        }, t.searchAnimations = function(t, e, i) {
            var s, r = [].concat([].slice.call(document.getElementsByClassName("lottie")), [].slice.call(document.getElementsByClassName("bodymovin"))), n = r.length;
            for(s = 0; s < n; s += 1)i && r[s].setAttribute("data-bm-type", i), l(r[s], t);
            if (e && 0 === n) {
                i || (i = "svg");
                var o = document.getElementsByTagName("body")[0];
                o.innerText = "";
                var h = a("div");
                h.style.width = "100%", h.style.height = "100%", h.setAttribute("data-bm-type", i), o.appendChild(h), l(h, t);
            }
        }, t.resize = function() {
            var t;
            for(t = 0; t < s; t += 1)e[t].animation.resize();
        }, t.goToAndStop = function(t, i, a) {
            var r;
            for(r = 0; r < s; r += 1)e[r].animation.goToAndStop(t, i, a);
        }, t.destroy = function(t) {
            var i;
            for(i = s - 1; i >= 0; i -= 1)e[i].animation.destroy(t);
        }, t.freeze = function() {
            o = !0;
        }, t.unfreeze = function() {
            o = !1, u();
        }, t.setVolume = function(t, i) {
            var a;
            for(a = 0; a < s; a += 1)e[a].animation.setVolume(t, i);
        }, t.mute = function(t) {
            var i;
            for(i = 0; i < s; i += 1)e[i].animation.mute(t);
        }, t.unmute = function(t) {
            var i;
            for(i = 0; i < s; i += 1)e[i].animation.unmute(t);
        }, t.getRegisteredAnimations = function() {
            var t, i = e.length, s = [];
            for(t = 0; t < i; t += 1)s.push(e[t].animation);
            return s;
        }, t;
    }(), tt = function() {
        var t = {
            getBezierEasing: function(t, i, s, a, r) {
                var n = r || ("bez_" + t + "_" + i + "_" + s + "_" + a).replace(/\./g, "p");
                if (e[n]) return e[n];
                var o = new p([
                    t,
                    i,
                    s,
                    a
                ]);
                return e[n] = o, o;
            }
        }, e = {};
        var i = 11, s = 1 / (i - 1), a = "function" == typeof Float32Array;
        function r(t, e) {
            return 1 - 3 * e + 3 * t;
        }
        function n(t, e) {
            return 3 * e - 6 * t;
        }
        function o(t) {
            return 3 * t;
        }
        function h(t, e, i) {
            return ((r(e, i) * t + n(e, i)) * t + o(e)) * t;
        }
        function l(t, e, i) {
            return 3 * r(e, i) * t * t + 2 * n(e, i) * t + o(e);
        }
        function p(t) {
            this._p = t, this._mSampleValues = a ? new Float32Array(i) : new Array(i), this._precomputed = !1, this.get = this.get.bind(this);
        }
        return p.prototype = {
            get: function(t) {
                var e = this._p[0], i = this._p[1], s = this._p[2], a = this._p[3];
                return this._precomputed || this._precompute(), e === i && s === a ? t : 0 === t ? 0 : 1 === t ? 1 : h(this._getTForX(t), i, a);
            },
            _precompute: function() {
                var t = this._p[0], e = this._p[1], i = this._p[2], s = this._p[3];
                this._precomputed = !0, t === e && i === s || this._calcSampleValues();
            },
            _calcSampleValues: function() {
                for(var t = this._p[0], e = this._p[2], a = 0; a < i; ++a)this._mSampleValues[a] = h(a * s, t, e);
            },
            _getTForX: function(t) {
                for(var e = this._p[0], a = this._p[2], r = this._mSampleValues, n = 0, o = 1, p = i - 1; o !== p && r[o] <= t; ++o)n += s;
                var f = n + (t - r[--o]) / (r[o + 1] - r[o]) * s, d = l(f, e, a);
                return d >= .001 ? function(t, e, i, s) {
                    for(var a = 0; a < 4; ++a){
                        var r = l(e, i, s);
                        if (0 === r) return e;
                        e -= (h(e, i, s) - t) / r;
                    }
                    return e;
                }(t, f, e, a) : 0 === d ? f : function(t, e, i, s, a) {
                    var r, n, o = 0;
                    do (r = h(n = e + (i - e) / 2, s, a) - t) > 0 ? i = n : e = n;
                    while (Math.abs(r) > 1e-7 && ++o < 10);
                    return n;
                }(t, n, n + s, e, a);
            }
        }, t;
    }(), et = {
        double: function(t) {
            return t.concat(l(t.length));
        }
    }, it = function(t, e, i) {
        var s = 0, a = t, r = l(a);
        return {
            newElement: function() {
                return s ? r[s -= 1] : e();
            },
            release: function(t) {
                s === a && (r = et.double(r), a *= 2), i && i(t), r[s] = t, s += 1;
            }
        };
    }, st = it(8, function() {
        return {
            addedLength: 0,
            percents: h("float32", j()),
            lengths: h("float32", j())
        };
    }), at = it(8, function() {
        return {
            lengths: [],
            totalLength: 0
        };
    }, function(t) {
        var e, i = t.lengths.length;
        for(e = 0; e < i; e += 1)st.release(t.lengths[e]);
        t.lengths.length = 0;
    });
    var rt = function() {
        var t = Math;
        function e(t, e, i, s, a, r) {
            var n = t * s + e * a + i * r - a * s - r * t - i * e;
            return n > -0.001 && n < .001;
        }
        var i = function(t, e, i, s) {
            var a, r, n, o, h, l, p = j(), f = 0, d = [], m = [], c = st.newElement();
            for(n = i.length, a = 0; a < p; a += 1){
                for(h = a / (p - 1), l = 0, r = 0; r < n; r += 1)o = g(1 - h, 3) * t[r] + 3 * g(1 - h, 2) * h * i[r] + 3 * (1 - h) * g(h, 2) * s[r] + g(h, 3) * e[r], d[r] = o, null !== m[r] && (l += g(d[r] - m[r], 2)), m[r] = d[r];
                l && (f += l = y(l)), c.percents[a] = h, c.lengths[a] = f;
            }
            return c.addedLength = f, c;
        };
        function s(t) {
            this.segmentLength = 0, this.points = new Array(t);
        }
        function a(t, e) {
            this.partialLength = t, this.point = e;
        }
        var r, n = (r = {}, function(t, i, n, o) {
            var h = (t[0] + "_" + t[1] + "_" + i[0] + "_" + i[1] + "_" + n[0] + "_" + n[1] + "_" + o[0] + "_" + o[1]).replace(/\./g, "p");
            if (!r[h]) {
                var p, f, d, m, c, u, v, b = j(), _ = 0, k = null;
                2 === t.length && (t[0] !== i[0] || t[1] !== i[1]) && e(t[0], t[1], i[0], i[1], t[0] + n[0], t[1] + n[1]) && e(t[0], t[1], i[0], i[1], i[0] + o[0], i[1] + o[1]) && (b = 2);
                var P = new s(b);
                for(d = n.length, p = 0; p < b; p += 1){
                    for(v = l(d), c = p / (b - 1), u = 0, f = 0; f < d; f += 1)m = g(1 - c, 3) * t[f] + 3 * g(1 - c, 2) * c * (t[f] + n[f]) + 3 * (1 - c) * g(c, 2) * (i[f] + o[f]) + g(c, 3) * i[f], v[f] = m, null !== k && (u += g(v[f] - k[f], 2));
                    _ += u = y(u), P.points[p] = new a(u, v), k = v;
                }
                P.segmentLength = _, r[h] = P;
            }
            return r[h];
        });
        function o(t, e) {
            var i = e.percents, s = e.lengths, a = i.length, r = v((a - 1) * t), n = t * e.addedLength, o = 0;
            if (r === a - 1 || 0 === r || n === s[r]) return i[r];
            for(var h = s[r] > n ? -1 : 1, l = !0; l;)if (s[r] <= n && s[r + 1] > n ? (o = (n - s[r]) / (s[r + 1] - s[r]), l = !1) : r += h, r < 0 || r >= a - 1) {
                if (r === a - 1) return i[r];
                l = !1;
            }
            return i[r] + (i[r + 1] - i[r]) * o;
        }
        var p = h("float32", 8);
        return {
            getSegmentsLength: function(t) {
                var e, s = at.newElement(), a = t.c, r = t.v, n = t.o, o = t.i, h = t._length, l = s.lengths, p = 0;
                for(e = 0; e < h - 1; e += 1)l[e] = i(r[e], r[e + 1], n[e], o[e + 1]), p += l[e].addedLength;
                return a && h && (l[e] = i(r[e], r[0], n[e], o[0]), p += l[e].addedLength), s.totalLength = p, s;
            },
            getNewSegment: function(e, i, s, a, r, n, h) {
                r < 0 ? r = 0 : r > 1 && (r = 1);
                var l, f = o(r, h), d = o(n = n > 1 ? 1 : n, h), m = e.length, c = 1 - f, u = 1 - d, g = c * c * c, y = f * c * c * 3, v = f * f * c * 3, b = f * f * f, _ = c * c * u, k = f * c * u + c * f * u + c * c * d, P = f * f * u + c * f * d + f * c * d, A = f * f * d, S = c * u * u, x = f * u * u + c * d * u + c * u * d, w = f * d * u + c * d * d + f * u * d, D = f * d * d, C = u * u * u, M = d * u * u + u * d * u + u * u * d, T = d * d * u + u * d * d + d * u * d, F = d * d * d;
                for(l = 0; l < m; l += 1)p[4 * l] = t.round(1e3 * (g * e[l] + y * s[l] + v * a[l] + b * i[l])) / 1e3, p[4 * l + 1] = t.round(1e3 * (_ * e[l] + k * s[l] + P * a[l] + A * i[l])) / 1e3, p[4 * l + 2] = t.round(1e3 * (S * e[l] + x * s[l] + w * a[l] + D * i[l])) / 1e3, p[4 * l + 3] = t.round(1e3 * (C * e[l] + M * s[l] + T * a[l] + F * i[l])) / 1e3;
                return p;
            },
            getPointInSegment: function(e, i, s, a, r, n) {
                var h = o(r, n), l = 1 - h;
                return [
                    t.round(1e3 * (l * l * l * e[0] + (h * l * l + l * h * l + l * l * h) * s[0] + (h * h * l + l * h * h + h * l * h) * a[0] + h * h * h * i[0])) / 1e3,
                    t.round(1e3 * (l * l * l * e[1] + (h * l * l + l * h * l + l * l * h) * s[1] + (h * h * l + l * h * h + h * l * h) * a[1] + h * h * h * i[1])) / 1e3
                ];
            },
            buildBezierData: n,
            pointOnLine2D: e,
            pointOnLine3D: function(i, s, a, r, n, o, h, l, p) {
                if (0 === a && 0 === o && 0 === p) return e(i, s, r, n, h, l);
                var f, d = t.sqrt(t.pow(r - i, 2) + t.pow(n - s, 2) + t.pow(o - a, 2)), m = t.sqrt(t.pow(h - i, 2) + t.pow(l - s, 2) + t.pow(p - a, 2)), c = t.sqrt(t.pow(h - r, 2) + t.pow(l - n, 2) + t.pow(p - o, 2));
                return (f = d > m ? d > c ? d - m - c : c - m - d : c > m ? c - m - d : m - d - c) > -0.0001 && f < 1e-4;
            }
        };
    }(), nt = i, ot = Math.abs;
    function ht(t, e) {
        var i, s = this.offsetTime;
        "multidimensional" === this.propType && (i = h("float32", this.pv.length));
        for(var a, r, n, o, l, p, f, d, m, c = e.lastIndex, u = c, g = this.keyframes.length - 1, y = !0; y;){
            if (a = this.keyframes[u], r = this.keyframes[u + 1], u === g - 1 && t >= r.t - s) {
                a.h && (a = r), c = 0;
                break;
            }
            if (r.t - s > t) {
                c = u;
                break;
            }
            u < g - 1 ? u += 1 : (c = 0, y = !1);
        }
        n = this.keyframesMetadata[u] || {};
        var v, b, _, k, A, S, x, w, D, C, M = r.t - s, T = a.t - s;
        if (a.to) {
            n.bezierData || (n.bezierData = rt.buildBezierData(a.s, r.s || a.e, a.to, a.ti));
            var F = n.bezierData;
            if (t >= M || t < T) {
                var E = t >= M ? F.points.length - 1 : 0;
                for(l = F.points[E].point.length, o = 0; o < l; o += 1)i[o] = F.points[E].point[o];
            } else {
                n.__fnct ? m = n.__fnct : (m = tt.getBezierEasing(a.o.x, a.o.y, a.i.x, a.i.y, a.n).get, n.__fnct = m), p = m((t - T) / (M - T));
                var I, L = F.segmentLength * p, V = e.lastFrame < t && e._lastKeyframeIndex === u ? e._lastAddedLength : 0;
                for(d = e.lastFrame < t && e._lastKeyframeIndex === u ? e._lastPoint : 0, y = !0, f = F.points.length; y;){
                    if (V += F.points[d].partialLength, 0 === L || 0 === p || d === F.points.length - 1) {
                        for(l = F.points[d].point.length, o = 0; o < l; o += 1)i[o] = F.points[d].point[o];
                        break;
                    }
                    if (L >= V && L < V + F.points[d + 1].partialLength) {
                        for(I = (L - V) / F.points[d + 1].partialLength, l = F.points[d].point.length, o = 0; o < l; o += 1)i[o] = F.points[d].point[o] + (F.points[d + 1].point[o] - F.points[d].point[o]) * I;
                        break;
                    }
                    d < f - 1 ? d += 1 : y = !1;
                }
                e._lastPoint = d, e._lastAddedLength = V - F.points[d].partialLength, e._lastKeyframeIndex = u;
            }
        } else {
            var R, z, O, N, B;
            if (g = a.s.length, v = r.s || a.e, this.sh && 1 !== a.h) {
                if (t >= M) i[0] = v[0], i[1] = v[1], i[2] = v[2];
                else if (t <= T) i[0] = a.s[0], i[1] = a.s[1], i[2] = a.s[2];
                else {
                    var q = lt(a.s), j = lt(v);
                    b = i, _ = function(t, e, i) {
                        var s, a, r, n, o, h = [], l = t[0], p = t[1], f = t[2], d = t[3], m = e[0], c = e[1], u = e[2], g = e[3];
                        return (a = l * m + p * c + f * u + d * g) < 0 && (a = -a, m = -m, c = -c, u = -u, g = -g), 1 - a > 1e-6 ? (s = Math.acos(a), r = Math.sin(s), n = Math.sin((1 - i) * s) / r, o = Math.sin(i * s) / r) : (n = 1 - i, o = i), h[0] = n * l + o * m, h[1] = n * p + o * c, h[2] = n * f + o * u, h[3] = n * d + o * g, h;
                    }(q, j, (t - T) / (M - T)), k = _[0], A = _[1], S = _[2], x = _[3], w = Math.atan2(2 * A * x - 2 * k * S, 1 - 2 * A * A - 2 * S * S), D = Math.asin(2 * k * A + 2 * S * x), C = Math.atan2(2 * k * x - 2 * A * S, 1 - 2 * k * k - 2 * S * S), b[0] = w / P, b[1] = D / P, b[2] = C / P;
                }
            } else for(u = 0; u < g; u += 1)1 !== a.h && (t >= M ? p = 1 : t < T ? p = 0 : (a.o.x.constructor === Array ? (n.__fnct || (n.__fnct = []), n.__fnct[u] ? m = n.__fnct[u] : (R = void 0 === a.o.x[u] ? a.o.x[0] : a.o.x[u], z = void 0 === a.o.y[u] ? a.o.y[0] : a.o.y[u], O = void 0 === a.i.x[u] ? a.i.x[0] : a.i.x[u], N = void 0 === a.i.y[u] ? a.i.y[0] : a.i.y[u], m = tt.getBezierEasing(R, z, O, N).get, n.__fnct[u] = m)) : n.__fnct ? m = n.__fnct : (R = a.o.x, z = a.o.y, O = a.i.x, N = a.i.y, m = tt.getBezierEasing(R, z, O, N).get, a.keyframeMetadata = m), p = m((t - T) / (M - T)))), v = r.s || a.e, B = 1 === a.h ? a.s[u] : a.s[u] + (v[u] - a.s[u]) * p, "multidimensional" === this.propType ? i[u] = B : i = B;
        }
        return e.lastIndex = c, i;
    }
    function lt(t) {
        var e = t[0] * P, i = t[1] * P, s = t[2] * P, a = Math.cos(e / 2), r = Math.cos(i / 2), n = Math.cos(s / 2), o = Math.sin(e / 2), h = Math.sin(i / 2), l = Math.sin(s / 2);
        return [
            o * h * n + a * r * l,
            o * r * n + a * h * l,
            a * h * n - o * r * l,
            a * r * n - o * h * l
        ];
    }
    function pt() {
        var t = this.comp.renderedFrame - this.offsetTime, e = this.keyframes[0].t - this.offsetTime, i = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
        if (!(t === this._caching.lastFrame || this._caching.lastFrame !== nt && (this._caching.lastFrame >= i && t >= i || this._caching.lastFrame < e && t < e))) {
            this._caching.lastFrame >= t && (this._caching._lastKeyframeIndex = -1, this._caching.lastIndex = 0);
            var s = this.interpolateValue(t, this._caching);
            this.pv = s;
        }
        return this._caching.lastFrame = t, this.pv;
    }
    function ft(t) {
        var e;
        if ("unidimensional" === this.propType) e = t * this.mult, ot(this.v - e) > 1e-5 && (this.v = e, this._mdf = !0);
        else for(var i = 0, s = this.v.length; i < s;)e = t[i] * this.mult, ot(this.v[i] - e) > 1e-5 && (this.v[i] = e, this._mdf = !0), i += 1;
    }
    function dt() {
        if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length) {
            if (this.lock) this.setVValue(this.pv);
            else {
                var t;
                this.lock = !0, this._mdf = this._isFirstFrame;
                var e = this.effectsSequence.length, i = this.kf ? this.pv : this.data.k;
                for(t = 0; t < e; t += 1)i = this.effectsSequence[t](i);
                this.setVValue(i), this._isFirstFrame = !1, this.lock = !1, this.frameId = this.elem.globalData.frameId;
            }
        }
    }
    function mt(t) {
        this.effectsSequence.push(t), this.container.addDynamicProperty(this);
    }
    function ct(t, e, i, s) {
        this.propType = "unidimensional", this.mult = i || 1, this.data = e, this.v = i ? e.k * i : e.k, this.pv = e.k, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.vel = 0, this.effectsSequence = [], this._isFirstFrame = !0, this.getValue = dt, this.setVValue = ft, this.addEffect = mt;
    }
    function ut(t, e, i, s) {
        var a;
        this.propType = "multidimensional", this.mult = i || 1, this.data = e, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.frameId = -1;
        var r = e.k.length;
        for(this.v = h("float32", r), this.pv = h("float32", r), this.vel = h("float32", r), a = 0; a < r; a += 1)this.v[a] = e.k[a] * this.mult, this.pv[a] = e.k[a];
        this._isFirstFrame = !0, this.effectsSequence = [], this.getValue = dt, this.setVValue = ft, this.addEffect = mt;
    }
    function gt(t, e, i, s) {
        this.propType = "unidimensional", this.keyframes = e.k, this.keyframesMetadata = [], this.offsetTime = t.data.st, this.frameId = -1, this._caching = {
            lastFrame: nt,
            lastIndex: 0,
            value: 0,
            _lastKeyframeIndex: -1
        }, this.k = !0, this.kf = !0, this.data = e, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.v = nt, this.pv = nt, this._isFirstFrame = !0, this.getValue = dt, this.setVValue = ft, this.interpolateValue = ht, this.effectsSequence = [
            pt.bind(this)
        ], this.addEffect = mt;
    }
    function yt(t, e, i, s) {
        var a;
        this.propType = "multidimensional";
        var r, n, o, l, p = e.k.length;
        for(a = 0; a < p - 1; a += 1)e.k[a].to && e.k[a].s && e.k[a + 1] && e.k[a + 1].s && (r = e.k[a].s, n = e.k[a + 1].s, o = e.k[a].to, l = e.k[a].ti, (2 === r.length && (r[0] !== n[0] || r[1] !== n[1]) && rt.pointOnLine2D(r[0], r[1], n[0], n[1], r[0] + o[0], r[1] + o[1]) && rt.pointOnLine2D(r[0], r[1], n[0], n[1], n[0] + l[0], n[1] + l[1]) || 3 === r.length && (r[0] !== n[0] || r[1] !== n[1] || r[2] !== n[2]) && rt.pointOnLine3D(r[0], r[1], r[2], n[0], n[1], n[2], r[0] + o[0], r[1] + o[1], r[2] + o[2]) && rt.pointOnLine3D(r[0], r[1], r[2], n[0], n[1], n[2], n[0] + l[0], n[1] + l[1], n[2] + l[2])) && (e.k[a].to = null, e.k[a].ti = null), r[0] === n[0] && r[1] === n[1] && 0 === o[0] && 0 === o[1] && 0 === l[0] && 0 === l[1] && (2 === r.length || r[2] === n[2] && 0 === o[2] && 0 === l[2]) && (e.k[a].to = null, e.k[a].ti = null));
        this.effectsSequence = [
            pt.bind(this)
        ], this.data = e, this.keyframes = e.k, this.keyframesMetadata = [], this.offsetTime = t.data.st, this.k = !0, this.kf = !0, this._isFirstFrame = !0, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.getValue = dt, this.setVValue = ft, this.interpolateValue = ht, this.frameId = -1;
        var f = e.k[0].s.length;
        for(this.v = h("float32", f), this.pv = h("float32", f), a = 0; a < f; a += 1)this.v[a] = nt, this.pv[a] = nt;
        this._caching = {
            lastFrame: nt,
            lastIndex: 0,
            value: h("float32", f)
        }, this.addEffect = mt;
    }
    var vt = {
        getProp: function(t, e, i, s, a) {
            var r;
            if (e.sid && (e = t.globalData.slotManager.getProp(e)), e.k.length) {
                if ("number" == typeof e.k[0]) r = new ut(t, e, s, a);
                else switch(i){
                    case 0:
                        r = new gt(t, e, s, a);
                        break;
                    case 1:
                        r = new yt(t, e, s, a);
                }
            } else r = new ct(t, e, s, a);
            return r.effectsSequence.length && a.addDynamicProperty(r), r;
        }
    };
    function bt() {}
    bt.prototype = {
        addDynamicProperty: function(t) {
            -1 === this.dynamicProperties.indexOf(t) && (this.dynamicProperties.push(t), this.container.addDynamicProperty(this), this._isAnimated = !0);
        },
        iterateDynamicProperties: function() {
            var t;
            this._mdf = !1;
            var e = this.dynamicProperties.length;
            for(t = 0; t < e; t += 1)this.dynamicProperties[t].getValue(), this.dynamicProperties[t]._mdf && (this._mdf = !0);
        },
        initDynamicPropertyContainer: function(t) {
            this.container = t, this.dynamicProperties = [], this._mdf = !1, this._isAnimated = !1;
        }
    };
    var _t = it(8, function() {
        return h("float32", 2);
    });
    function kt() {
        this.c = !1, this._length = 0, this._maxLength = 8, this.v = l(this._maxLength), this.o = l(this._maxLength), this.i = l(this._maxLength);
    }
    kt.prototype.setPathData = function(t, e) {
        this.c = t, this.setLength(e);
        for(var i = 0; i < e;)this.v[i] = _t.newElement(), this.o[i] = _t.newElement(), this.i[i] = _t.newElement(), i += 1;
    }, kt.prototype.setLength = function(t) {
        for(; this._maxLength < t;)this.doubleArrayLength();
        this._length = t;
    }, kt.prototype.doubleArrayLength = function() {
        this.v = this.v.concat(l(this._maxLength)), this.i = this.i.concat(l(this._maxLength)), this.o = this.o.concat(l(this._maxLength)), this._maxLength *= 2;
    }, kt.prototype.setXYAt = function(t, e, i, s, a) {
        var r;
        switch(this._length = Math.max(this._length, s + 1), this._length >= this._maxLength && this.doubleArrayLength(), i){
            case "v":
                r = this.v;
                break;
            case "i":
                r = this.i;
                break;
            case "o":
                r = this.o;
                break;
            default:
                r = [];
        }
        (!r[s] || r[s] && !a) && (r[s] = _t.newElement()), r[s][0] = t, r[s][1] = e;
    }, kt.prototype.setTripleAt = function(t, e, i, s, a, r, n, o) {
        this.setXYAt(t, e, "v", n, o), this.setXYAt(i, s, "o", n, o), this.setXYAt(a, r, "i", n, o);
    }, kt.prototype.reverse = function() {
        var t = new kt;
        t.setPathData(this.c, this._length);
        var e = this.v, i = this.o, s = this.i, a = 0;
        this.c && (t.setTripleAt(e[0][0], e[0][1], s[0][0], s[0][1], i[0][0], i[0][1], 0, !1), a = 1);
        var r, n = this._length - 1, o = this._length;
        for(r = a; r < o; r += 1)t.setTripleAt(e[n][0], e[n][1], s[n][0], s[n][1], i[n][0], i[n][1], r, !1), n -= 1;
        return t;
    }, kt.prototype.length = function() {
        return this._length;
    };
    var Pt, At = ((Pt = it(4, function() {
        return new kt;
    }, function(t) {
        var e, i = t._length;
        for(e = 0; e < i; e += 1)_t.release(t.v[e]), _t.release(t.i[e]), _t.release(t.o[e]), t.v[e] = null, t.i[e] = null, t.o[e] = null;
        t._length = 0, t.c = !1;
    })).clone = function(t) {
        var e, i = Pt.newElement(), s = void 0 === t._length ? t.v.length : t._length;
        for(i.setLength(s), i.c = t.c, e = 0; e < s; e += 1)i.setTripleAt(t.v[e][0], t.v[e][1], t.o[e][0], t.o[e][1], t.i[e][0], t.i[e][1], e);
        return i;
    }, Pt);
    function St() {
        this._length = 0, this._maxLength = 4, this.shapes = l(this._maxLength);
    }
    St.prototype.addShape = function(t) {
        this._length === this._maxLength && (this.shapes = this.shapes.concat(l(this._maxLength)), this._maxLength *= 2), this.shapes[this._length] = t, this._length += 1;
    }, St.prototype.releaseShapes = function() {
        var t;
        for(t = 0; t < this._length; t += 1)At.release(this.shapes[t]);
        this._length = 0;
    };
    var xt, wt, Dt, Ct, Mt = (xt = {
        newShapeCollection: function() {
            return wt ? Ct[wt -= 1] : new St;
        },
        release: function(t) {
            var e, i = t._length;
            for(e = 0; e < i; e += 1)At.release(t.shapes[e]);
            t._length = 0, wt === Dt && (Ct = et.double(Ct), Dt *= 2), Ct[wt] = t, wt += 1;
        }
    }, wt = 0, Ct = l(Dt = 4), xt), Tt = function() {
        var t = -999999;
        function e(t, e, i) {
            var s, a, r, n, o, h, l, p, f, d = i.lastIndex, m = this.keyframes;
            if (t < m[0].t - this.offsetTime) s = m[0].s[0], r = !0, d = 0;
            else if (t >= m[m.length - 1].t - this.offsetTime) s = m[m.length - 1].s ? m[m.length - 1].s[0] : m[m.length - 2].e[0], r = !0;
            else {
                for(var c, u, g, y = d, v = m.length - 1, b = !0; b && (c = m[y], !((u = m[y + 1]).t - this.offsetTime > t));)y < v - 1 ? y += 1 : b = !1;
                if (g = this.keyframesMetadata[y] || {}, d = y, !(r = 1 === c.h)) {
                    if (t >= u.t - this.offsetTime) p = 1;
                    else if (t < c.t - this.offsetTime) p = 0;
                    else {
                        var _;
                        g.__fnct ? _ = g.__fnct : (_ = tt.getBezierEasing(c.o.x, c.o.y, c.i.x, c.i.y).get, g.__fnct = _), p = _((t - (c.t - this.offsetTime)) / (u.t - this.offsetTime - (c.t - this.offsetTime)));
                    }
                    a = u.s ? u.s[0] : c.e[0];
                }
                s = c.s[0];
            }
            for(h = e._length, l = s.i[0].length, i.lastIndex = d, n = 0; n < h; n += 1)for(o = 0; o < l; o += 1)f = r ? s.i[n][o] : s.i[n][o] + (a.i[n][o] - s.i[n][o]) * p, e.i[n][o] = f, f = r ? s.o[n][o] : s.o[n][o] + (a.o[n][o] - s.o[n][o]) * p, e.o[n][o] = f, f = r ? s.v[n][o] : s.v[n][o] + (a.v[n][o] - s.v[n][o]) * p, e.v[n][o] = f;
        }
        function i() {
            var e = this.comp.renderedFrame - this.offsetTime, i = this.keyframes[0].t - this.offsetTime, s = this.keyframes[this.keyframes.length - 1].t - this.offsetTime, a = this._caching.lastFrame;
            return a !== t && (a < i && e < i || a > s && e > s) || (this._caching.lastIndex = a < e ? this._caching.lastIndex : 0, this.interpolateShape(e, this.pv, this._caching)), this._caching.lastFrame = e, this.pv;
        }
        function s() {
            this.paths = this.localShapeCollection;
        }
        function a(t) {
            (function(t, e) {
                if (t._length !== e._length || t.c !== e.c) return !1;
                var i, s = t._length;
                for(i = 0; i < s; i += 1)if (t.v[i][0] !== e.v[i][0] || t.v[i][1] !== e.v[i][1] || t.o[i][0] !== e.o[i][0] || t.o[i][1] !== e.o[i][1] || t.i[i][0] !== e.i[i][0] || t.i[i][1] !== e.i[i][1]) return !1;
                return !0;
            })(this.v, t) || (this.v = At.clone(t), this.localShapeCollection.releaseShapes(), this.localShapeCollection.addShape(this.v), this._mdf = !0, this.paths = this.localShapeCollection);
        }
        function n() {
            if (this.elem.globalData.frameId !== this.frameId) {
                if (this.effectsSequence.length) {
                    if (this.lock) this.setVValue(this.pv);
                    else {
                        var t, e;
                        this.lock = !0, this._mdf = !1, t = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k;
                        var i = this.effectsSequence.length;
                        for(e = 0; e < i; e += 1)t = this.effectsSequence[e](t);
                        this.setVValue(t), this.lock = !1, this.frameId = this.elem.globalData.frameId;
                    }
                } else this._mdf = !1;
            }
        }
        function o(t, e, i) {
            this.propType = "shape", this.comp = t.comp, this.container = t, this.elem = t, this.data = e, this.k = !1, this.kf = !1, this._mdf = !1;
            var a = 3 === i ? e.pt.k : e.ks.k;
            this.v = At.clone(a), this.pv = At.clone(this.v), this.localShapeCollection = Mt.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = s, this.effectsSequence = [];
        }
        function h(t) {
            this.effectsSequence.push(t), this.container.addDynamicProperty(this);
        }
        function l(e, a, r) {
            this.propType = "shape", this.comp = e.comp, this.elem = e, this.container = e, this.offsetTime = e.data.st, this.keyframes = 3 === r ? a.pt.k : a.ks.k, this.keyframesMetadata = [], this.k = !0, this.kf = !0;
            var n = this.keyframes[0].s[0].i.length;
            this.v = At.newElement(), this.v.setPathData(this.keyframes[0].s[0].c, n), this.pv = At.clone(this.v), this.localShapeCollection = Mt.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.lastFrame = t, this.reset = s, this._caching = {
                lastFrame: t,
                lastIndex: 0
            }, this.effectsSequence = [
                i.bind(this)
            ];
        }
        o.prototype.interpolateShape = e, o.prototype.getValue = n, o.prototype.setVValue = a, o.prototype.addEffect = h, l.prototype.getValue = n, l.prototype.interpolateShape = e, l.prototype.setVValue = a, l.prototype.addEffect = h;
        var p = function() {
            var t = A;
            function e(t, e) {
                this.v = At.newElement(), this.v.setPathData(!0, 4), this.localShapeCollection = Mt.newShapeCollection(), this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), this.d = e.d, this.elem = t, this.comp = t.comp, this.frameId = -1, this.initDynamicPropertyContainer(t), this.p = vt.getProp(t, e.p, 1, 0, this), this.s = vt.getProp(t, e.s, 1, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertEllToPath());
            }
            return e.prototype = {
                reset: s,
                getValue: function() {
                    this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertEllToPath());
                },
                convertEllToPath: function() {
                    var e = this.p.v[0], i = this.p.v[1], s = this.s.v[0] / 2, a = this.s.v[1] / 2, r = 3 !== this.d, n = this.v;
                    n.v[0][0] = e, n.v[0][1] = i - a, n.v[1][0] = r ? e + s : e - s, n.v[1][1] = i, n.v[2][0] = e, n.v[2][1] = i + a, n.v[3][0] = r ? e - s : e + s, n.v[3][1] = i, n.i[0][0] = r ? e - s * t : e + s * t, n.i[0][1] = i - a, n.i[1][0] = r ? e + s : e - s, n.i[1][1] = i - a * t, n.i[2][0] = r ? e + s * t : e - s * t, n.i[2][1] = i + a, n.i[3][0] = r ? e - s : e + s, n.i[3][1] = i + a * t, n.o[0][0] = r ? e + s * t : e - s * t, n.o[0][1] = i - a, n.o[1][0] = r ? e + s : e - s, n.o[1][1] = i + a * t, n.o[2][0] = r ? e - s * t : e + s * t, n.o[2][1] = i + a, n.o[3][0] = r ? e - s : e + s, n.o[3][1] = i - a * t;
                }
            }, r([
                bt
            ], e), e;
        }(), f = function() {
            function t(t, e) {
                this.v = At.newElement(), this.v.setPathData(!0, 0), this.elem = t, this.comp = t.comp, this.data = e, this.frameId = -1, this.d = e.d, this.initDynamicPropertyContainer(t), 1 === e.sy ? (this.ir = vt.getProp(t, e.ir, 0, 0, this), this.is = vt.getProp(t, e.is, 0, .01, this), this.convertToPath = this.convertStarToPath) : this.convertToPath = this.convertPolygonToPath, this.pt = vt.getProp(t, e.pt, 0, 0, this), this.p = vt.getProp(t, e.p, 1, 0, this), this.r = vt.getProp(t, e.r, 0, P, this), this.or = vt.getProp(t, e.or, 0, 0, this), this.os = vt.getProp(t, e.os, 0, .01, this), this.localShapeCollection = Mt.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertToPath());
            }
            return t.prototype = {
                reset: s,
                getValue: function() {
                    this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertToPath());
                },
                convertStarToPath: function() {
                    var t, e, i, s, a = 2 * Math.floor(this.pt.v), r = 2 * Math.PI / a, n = !0, o = this.or.v, h = this.ir.v, l = this.os.v, p = this.is.v, f = 2 * Math.PI * o / (2 * a), d = 2 * Math.PI * h / (2 * a), m = -Math.PI / 2;
                    m += this.r.v;
                    var c = 3 === this.data.d ? -1 : 1;
                    for(this.v._length = 0, t = 0; t < a; t += 1){
                        i = n ? l : p, s = n ? f : d;
                        var u = (e = n ? o : h) * Math.cos(m), g = e * Math.sin(m), y = 0 === u && 0 === g ? 0 : g / Math.sqrt(u * u + g * g), v = 0 === u && 0 === g ? 0 : -u / Math.sqrt(u * u + g * g);
                        u += +this.p.v[0], g += +this.p.v[1], this.v.setTripleAt(u, g, u - y * s * i * c, g - v * s * i * c, u + y * s * i * c, g + v * s * i * c, t, !0), n = !n, m += r * c;
                    }
                },
                convertPolygonToPath: function() {
                    var t, e = Math.floor(this.pt.v), i = 2 * Math.PI / e, s = this.or.v, a = this.os.v, r = 2 * Math.PI * s / (4 * e), n = .5 * -Math.PI, o = 3 === this.data.d ? -1 : 1;
                    for(n += this.r.v, this.v._length = 0, t = 0; t < e; t += 1){
                        var h = s * Math.cos(n), l = s * Math.sin(n), p = 0 === h && 0 === l ? 0 : l / Math.sqrt(h * h + l * l), f = 0 === h && 0 === l ? 0 : -h / Math.sqrt(h * h + l * l);
                        h += +this.p.v[0], l += +this.p.v[1], this.v.setTripleAt(h, l, h - p * r * a * o, l - f * r * a * o, h + p * r * a * o, l + f * r * a * o, t, !0), n += i * o;
                    }
                    this.paths.length = 0, this.paths[0] = this.v;
                }
            }, r([
                bt
            ], t), t;
        }(), d = function() {
            function t(t, e) {
                this.v = At.newElement(), this.v.c = !0, this.localShapeCollection = Mt.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.elem = t, this.comp = t.comp, this.frameId = -1, this.d = e.d, this.initDynamicPropertyContainer(t), this.p = vt.getProp(t, e.p, 1, 0, this), this.s = vt.getProp(t, e.s, 1, 0, this), this.r = vt.getProp(t, e.r, 0, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertRectToPath());
            }
            return t.prototype = {
                convertRectToPath: function() {
                    var t = this.p.v[0], e = this.p.v[1], i = this.s.v[0] / 2, s = this.s.v[1] / 2, a = b(i, s, this.r.v), r = a * (1 - A);
                    this.v._length = 0, 2 === this.d || 1 === this.d ? (this.v.setTripleAt(t + i, e - s + a, t + i, e - s + a, t + i, e - s + r, 0, !0), this.v.setTripleAt(t + i, e + s - a, t + i, e + s - r, t + i, e + s - a, 1, !0), 0 !== a ? (this.v.setTripleAt(t + i - a, e + s, t + i - a, e + s, t + i - r, e + s, 2, !0), this.v.setTripleAt(t - i + a, e + s, t - i + r, e + s, t - i + a, e + s, 3, !0), this.v.setTripleAt(t - i, e + s - a, t - i, e + s - a, t - i, e + s - r, 4, !0), this.v.setTripleAt(t - i, e - s + a, t - i, e - s + r, t - i, e - s + a, 5, !0), this.v.setTripleAt(t - i + a, e - s, t - i + a, e - s, t - i + r, e - s, 6, !0), this.v.setTripleAt(t + i - a, e - s, t + i - r, e - s, t + i - a, e - s, 7, !0)) : (this.v.setTripleAt(t - i, e + s, t - i + r, e + s, t - i, e + s, 2), this.v.setTripleAt(t - i, e - s, t - i, e - s + r, t - i, e - s, 3))) : (this.v.setTripleAt(t + i, e - s + a, t + i, e - s + r, t + i, e - s + a, 0, !0), 0 !== a ? (this.v.setTripleAt(t + i - a, e - s, t + i - a, e - s, t + i - r, e - s, 1, !0), this.v.setTripleAt(t - i + a, e - s, t - i + r, e - s, t - i + a, e - s, 2, !0), this.v.setTripleAt(t - i, e - s + a, t - i, e - s + a, t - i, e - s + r, 3, !0), this.v.setTripleAt(t - i, e + s - a, t - i, e + s - r, t - i, e + s - a, 4, !0), this.v.setTripleAt(t - i + a, e + s, t - i + a, e + s, t - i + r, e + s, 5, !0), this.v.setTripleAt(t + i - a, e + s, t + i - r, e + s, t + i - a, e + s, 6, !0), this.v.setTripleAt(t + i, e + s - a, t + i, e + s - a, t + i, e + s - r, 7, !0)) : (this.v.setTripleAt(t - i, e - s, t - i + r, e - s, t - i, e - s, 1, !0), this.v.setTripleAt(t - i, e + s, t - i, e + s - r, t - i, e + s, 2, !0), this.v.setTripleAt(t + i, e + s, t + i - r, e + s, t + i, e + s, 3, !0)));
                },
                getValue: function() {
                    this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertRectToPath());
                },
                reset: s
            }, r([
                bt
            ], t), t;
        }();
        var m = {
            getShapeProp: function(t, e, i) {
                var s;
                return 3 === i || 4 === i ? s = (3 === i ? e.pt : e.ks).k.length ? new l(t, e, i) : new o(t, e, i) : 5 === i ? s = new d(t, e) : 6 === i ? s = new p(t, e) : 7 === i && (s = new f(t, e)), s.k && t.addDynamicProperty(s), s;
            },
            getConstructorFunction: function() {
                return o;
            },
            getKeyframedConstructorFunction: function() {
                return l;
            }
        };
        return m;
    }(), Ft = function() {
        var t = Math.cos, e = Math.sin, i = Math.tan, s = Math.round;
        function a() {
            return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this;
        }
        function r(i) {
            if (0 === i) return this;
            var s = t(i), a = e(i);
            return this._t(s, -a, 0, 0, a, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function n(i) {
            if (0 === i) return this;
            var s = t(i), a = e(i);
            return this._t(1, 0, 0, 0, 0, s, -a, 0, 0, a, s, 0, 0, 0, 0, 1);
        }
        function o(i) {
            if (0 === i) return this;
            var s = t(i), a = e(i);
            return this._t(s, 0, a, 0, 0, 1, 0, 0, -a, 0, s, 0, 0, 0, 0, 1);
        }
        function l(i) {
            if (0 === i) return this;
            var s = t(i), a = e(i);
            return this._t(s, -a, 0, 0, a, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function p(t, e) {
            return this._t(1, e, t, 1, 0, 0);
        }
        function f(t, e) {
            return this.shear(i(t), i(e));
        }
        function d(s, a) {
            var r = t(a), n = e(a);
            return this._t(r, n, 0, 0, -n, r, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, i(s), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(r, -n, 0, 0, n, r, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function m(t, e, i) {
            return i || 0 === i || (i = 1), 1 === t && 1 === e && 1 === i ? this : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, i, 0, 0, 0, 0, 1);
        }
        function c(t, e, i, s, a, r, n, o, h, l, p, f, d, m, c, u) {
            return this.props[0] = t, this.props[1] = e, this.props[2] = i, this.props[3] = s, this.props[4] = a, this.props[5] = r, this.props[6] = n, this.props[7] = o, this.props[8] = h, this.props[9] = l, this.props[10] = p, this.props[11] = f, this.props[12] = d, this.props[13] = m, this.props[14] = c, this.props[15] = u, this;
        }
        function u(t, e, i) {
            return i = i || 0, 0 !== t || 0 !== e || 0 !== i ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, i, 1) : this;
        }
        function g(t, e, i, s, a, r, n, o, h, l, p, f, d, m, c, u) {
            var g = this.props;
            if (1 === t && 0 === e && 0 === i && 0 === s && 0 === a && 1 === r && 0 === n && 0 === o && 0 === h && 0 === l && 1 === p && 0 === f) return g[12] = g[12] * t + g[15] * d, g[13] = g[13] * r + g[15] * m, g[14] = g[14] * p + g[15] * c, g[15] *= u, this._identityCalculated = !1, this;
            var y = g[0], v = g[1], b = g[2], _ = g[3], k = g[4], P = g[5], A = g[6], S = g[7], x = g[8], w = g[9], D = g[10], C = g[11], M = g[12], T = g[13], F = g[14], E = g[15];
            return g[0] = y * t + v * a + b * h + _ * d, g[1] = y * e + v * r + b * l + _ * m, g[2] = y * i + v * n + b * p + _ * c, g[3] = y * s + v * o + b * f + _ * u, g[4] = k * t + P * a + A * h + S * d, g[5] = k * e + P * r + A * l + S * m, g[6] = k * i + P * n + A * p + S * c, g[7] = k * s + P * o + A * f + S * u, g[8] = x * t + w * a + D * h + C * d, g[9] = x * e + w * r + D * l + C * m, g[10] = x * i + w * n + D * p + C * c, g[11] = x * s + w * o + D * f + C * u, g[12] = M * t + T * a + F * h + E * d, g[13] = M * e + T * r + F * l + E * m, g[14] = M * i + T * n + F * p + E * c, g[15] = M * s + T * o + F * f + E * u, this._identityCalculated = !1, this;
        }
        function y(t) {
            var e = t.props;
            return this.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]);
        }
        function v() {
            return this._identityCalculated || (this._identity = !(1 !== this.props[0] || 0 !== this.props[1] || 0 !== this.props[2] || 0 !== this.props[3] || 0 !== this.props[4] || 1 !== this.props[5] || 0 !== this.props[6] || 0 !== this.props[7] || 0 !== this.props[8] || 0 !== this.props[9] || 1 !== this.props[10] || 0 !== this.props[11] || 0 !== this.props[12] || 0 !== this.props[13] || 0 !== this.props[14] || 1 !== this.props[15]), this._identityCalculated = !0), this._identity;
        }
        function b(t) {
            for(var e = 0; e < 16;){
                if (t.props[e] !== this.props[e]) return !1;
                e += 1;
            }
            return !0;
        }
        function _(t) {
            var e;
            for(e = 0; e < 16; e += 1)t.props[e] = this.props[e];
            return t;
        }
        function k(t) {
            var e;
            for(e = 0; e < 16; e += 1)this.props[e] = t[e];
        }
        function P(t, e, i) {
            return {
                x: t * this.props[0] + e * this.props[4] + i * this.props[8] + this.props[12],
                y: t * this.props[1] + e * this.props[5] + i * this.props[9] + this.props[13],
                z: t * this.props[2] + e * this.props[6] + i * this.props[10] + this.props[14]
            };
        }
        function A(t, e, i) {
            return t * this.props[0] + e * this.props[4] + i * this.props[8] + this.props[12];
        }
        function S(t, e, i) {
            return t * this.props[1] + e * this.props[5] + i * this.props[9] + this.props[13];
        }
        function x(t, e, i) {
            return t * this.props[2] + e * this.props[6] + i * this.props[10] + this.props[14];
        }
        function w() {
            var t = this.props[0] * this.props[5] - this.props[1] * this.props[4], e = this.props[5] / t, i = -this.props[1] / t, s = -this.props[4] / t, a = this.props[0] / t, r = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / t, n = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / t, o = new Ft;
            return o.props[0] = e, o.props[1] = i, o.props[4] = s, o.props[5] = a, o.props[12] = r, o.props[13] = n, o;
        }
        function D(t) {
            return this.getInverseMatrix().applyToPointArray(t[0], t[1], t[2] || 0);
        }
        function C(t) {
            var e, i = t.length, s = [];
            for(e = 0; e < i; e += 1)s[e] = D(t[e]);
            return s;
        }
        function M(t, e, i) {
            var s = h("float32", 6);
            if (this.isIdentity()) s[0] = t[0], s[1] = t[1], s[2] = e[0], s[3] = e[1], s[4] = i[0], s[5] = i[1];
            else {
                var a = this.props[0], r = this.props[1], n = this.props[4], o = this.props[5], l = this.props[12], p = this.props[13];
                s[0] = t[0] * a + t[1] * n + l, s[1] = t[0] * r + t[1] * o + p, s[2] = e[0] * a + e[1] * n + l, s[3] = e[0] * r + e[1] * o + p, s[4] = i[0] * a + i[1] * n + l, s[5] = i[0] * r + i[1] * o + p;
            }
            return s;
        }
        function T(t, e, i) {
            return this.isIdentity() ? [
                t,
                e,
                i
            ] : [
                t * this.props[0] + e * this.props[4] + i * this.props[8] + this.props[12],
                t * this.props[1] + e * this.props[5] + i * this.props[9] + this.props[13],
                t * this.props[2] + e * this.props[6] + i * this.props[10] + this.props[14]
            ];
        }
        function F(t, e) {
            if (this.isIdentity()) return t + "," + e;
            var i = this.props;
            return Math.round(100 * (t * i[0] + e * i[4] + i[12])) / 100 + "," + Math.round(100 * (t * i[1] + e * i[5] + i[13])) / 100;
        }
        function E() {
            for(var t = 0, e = this.props, i = "matrix3d("; t < 16;)i += s(1e4 * e[t]) / 1e4, i += 15 === t ? ")" : ",", t += 1;
            return i;
        }
        function I(t) {
            return t < 1e-6 && t > 0 || t > -0.000001 && t < 0 ? s(1e4 * t) / 1e4 : t;
        }
        function L() {
            var t = this.props;
            return "matrix(" + I(t[0]) + "," + I(t[1]) + "," + I(t[4]) + "," + I(t[5]) + "," + I(t[12]) + "," + I(t[13]) + ")";
        }
        return function() {
            this.reset = a, this.rotate = r, this.rotateX = n, this.rotateY = o, this.rotateZ = l, this.skew = f, this.skewFromAxis = d, this.shear = p, this.scale = m, this.setTransform = c, this.translate = u, this.transform = g, this.multiply = y, this.applyToPoint = P, this.applyToX = A, this.applyToY = S, this.applyToZ = x, this.applyToPointArray = T, this.applyToTriplePoints = M, this.applyToPointStringified = F, this.toCSS = E, this.to2dCSS = L, this.clone = _, this.cloneFromProps = k, this.equals = b, this.inversePoints = C, this.inversePoint = D, this.getInverseMatrix = w, this._t = this.transform, this.isIdentity = v, this._identity = !0, this._identityCalculated = !1, this.props = h("float32", 16), this.reset();
        };
    }();
    function Et(t) {
        return Et = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t;
        } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
        }, Et(t);
    }
    var It = {}, Lt = "__[STANDALONE]__";
    function Vt() {
        $.searchAnimations();
    }
    It.play = $.play, It.pause = $.pause, It.setLocationHref = function(e) {
        t = e;
    }, It.togglePause = $.togglePause, It.setSpeed = $.setSpeed, It.setDirection = $.setDirection, It.stop = $.stop, It.searchAnimations = Vt, It.registerAnimation = $.registerAnimation, It.loadAnimation = function(t) {
        return $.loadAnimation(t);
    }, It.setSubframeRendering = function(t) {
        !function(t) {
            f = !!t;
        }(t);
    }, It.resize = $.resize, It.goToAndStop = $.goToAndStop, It.destroy = $.destroy, It.setQuality = function(t) {
        if ("string" == typeof t) switch(t){
            case "high":
                q(200);
                break;
            default:
            case "medium":
                q(50);
                break;
            case "low":
                q(10);
        }
        else !isNaN(t) && t > 1 && q(t);
        j() >= 50 ? S(!1) : S(!0);
    }, It.inBrowser = function() {
        return "undefined" != typeof navigator;
    }, It.installPlugin = function(t, e) {
        "expressions" === t && (d = e);
    }, It.freeze = $.freeze, It.unfreeze = $.unfreeze, It.setVolume = $.setVolume, It.mute = $.mute, It.unmute = $.unmute, It.getRegisteredAnimations = $.getRegisteredAnimations, It.useWebWorker = function(t) {
        e = !!t;
    }, It.setIDPrefix = function(t) {
        c = t;
    }, It.__getFactory = function(t) {
        switch(t){
            case "propertyFactory":
                return vt;
            case "shapePropertyFactory":
                return Tt;
            case "matrix":
                return Ft;
            default:
                return null;
        }
    }, It.version = "5.13.0";
    var Rt = "";
    if (Lt) {
        var zt = document.getElementsByTagName("script"), Ot = zt[zt.length - 1] || {
            src: ""
        };
        Rt = Ot.src ? Ot.src.replace(/^[^\?]+\??/, "") : "", function(t) {
            for(var e = Rt.split("&"), i = 0; i < e.length; i += 1){
                var s = e[i].split("=");
                if (decodeURIComponent(s[0]) == t) return decodeURIComponent(s[1]);
            }
            return null;
        }("renderer");
    }
    var Nt = setInterval(function() {
        "complete" === document.readyState && (clearInterval(Nt), Vt());
    }, 100);
    try {
        "object" === Et(exports) && true || "function" == typeof define && define.amd || (window.bodymovin = It);
    } catch (t) {}
    var Bt = function() {
        var t = {}, e = {};
        return t.registerModifier = function(t, i) {
            e[t] || (e[t] = i);
        }, t.getModifier = function(t, i, s) {
            return new e[t](i, s);
        }, t;
    }();
    function qt() {}
    function jt() {}
    function Wt() {}
    qt.prototype.initModifierProperties = function() {}, qt.prototype.addShapeToModifier = function() {}, qt.prototype.addShape = function(t) {
        if (!this.closed) {
            t.sh.container.addDynamicProperty(t.sh);
            var e = {
                shape: t.sh,
                data: t,
                localShapeCollection: Mt.newShapeCollection()
            };
            this.shapes.push(e), this.addShapeToModifier(e), this._isAnimated && t.setAsAnimated();
        }
    }, qt.prototype.init = function(t, e) {
        this.shapes = [], this.elem = t, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e), this.frameId = i, this.closed = !1, this.k = !1, this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
    }, qt.prototype.processKeys = function() {
        this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties());
    }, r([
        bt
    ], qt), r([
        qt
    ], jt), jt.prototype.initModifierProperties = function(t, e) {
        this.s = vt.getProp(t, e.s, 0, .01, this), this.e = vt.getProp(t, e.e, 0, .01, this), this.o = vt.getProp(t, e.o, 0, 0, this), this.sValue = 0, this.eValue = 0, this.getValue = this.processKeys, this.m = e.m, this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
    }, jt.prototype.addShapeToModifier = function(t) {
        t.pathsData = [];
    }, jt.prototype.calculateShapeEdges = function(t, e, i, s, a) {
        var r = [];
        e <= 1 ? r.push({
            s: t,
            e: e
        }) : t >= 1 ? r.push({
            s: t - 1,
            e: e - 1
        }) : (r.push({
            s: t,
            e: 1
        }), r.push({
            s: 0,
            e: e - 1
        }));
        var n, o, h = [], l = r.length;
        for(n = 0; n < l; n += 1){
            var p, f;
            if (!((o = r[n]).e * a < s || o.s * a > s + i)) p = o.s * a <= s ? 0 : (o.s * a - s) / i, f = o.e * a >= s + i ? 1 : (o.e * a - s) / i, h.push([
                p,
                f
            ]);
        }
        return h.length || h.push([
            0,
            0
        ]), h;
    }, jt.prototype.releasePathsData = function(t) {
        var e, i = t.length;
        for(e = 0; e < i; e += 1)at.release(t[e]);
        return t.length = 0, t;
    }, jt.prototype.processShapes = function(t) {
        var e, i, s, a;
        if (this._mdf || t) {
            var r = this.o.v % 360 / 360;
            if (r < 0 && (r += 1), (e = this.s.v > 1 ? 1 + r : this.s.v < 0 ? 0 + r : this.s.v + r) > (i = this.e.v > 1 ? 1 + r : this.e.v < 0 ? 0 + r : this.e.v + r)) {
                var n = e;
                e = i, i = n;
            }
            e = 1e-4 * Math.round(1e4 * e), i = 1e-4 * Math.round(1e4 * i), this.sValue = e, this.eValue = i;
        } else e = this.sValue, i = this.eValue;
        var o, h, l, p, f, d = this.shapes.length, m = 0;
        if (i === e) for(a = 0; a < d; a += 1)this.shapes[a].localShapeCollection.releaseShapes(), this.shapes[a].shape._mdf = !0, this.shapes[a].shape.paths = this.shapes[a].localShapeCollection, this._mdf && (this.shapes[a].pathsData.length = 0);
        else if (1 === i && 0 === e || 0 === i && 1 === e) {
            if (this._mdf) for(a = 0; a < d; a += 1)this.shapes[a].pathsData.length = 0, this.shapes[a].shape._mdf = !0;
        } else {
            var c, u, g = [];
            for(a = 0; a < d; a += 1)if ((c = this.shapes[a]).shape._mdf || this._mdf || t || 2 === this.m) {
                if (h = (s = c.shape.paths)._length, f = 0, !c.shape._mdf && c.pathsData.length) f = c.totalShapeLength;
                else {
                    for(l = this.releasePathsData(c.pathsData), o = 0; o < h; o += 1)p = rt.getSegmentsLength(s.shapes[o]), l.push(p), f += p.totalLength;
                    c.totalShapeLength = f, c.pathsData = l;
                }
                m += f, c.shape._mdf = !0;
            } else c.shape.paths = c.localShapeCollection;
            var y, v = e, b = i, _ = 0;
            for(a = d - 1; a >= 0; a -= 1)if ((c = this.shapes[a]).shape._mdf) {
                for((u = c.localShapeCollection).releaseShapes(), 2 === this.m && d > 1 ? (y = this.calculateShapeEdges(e, i, c.totalShapeLength, _, m), _ += c.totalShapeLength) : y = [
                    [
                        v,
                        b
                    ]
                ], h = y.length, o = 0; o < h; o += 1){
                    v = y[o][0], b = y[o][1], g.length = 0, b <= 1 ? g.push({
                        s: c.totalShapeLength * v,
                        e: c.totalShapeLength * b
                    }) : v >= 1 ? g.push({
                        s: c.totalShapeLength * (v - 1),
                        e: c.totalShapeLength * (b - 1)
                    }) : (g.push({
                        s: c.totalShapeLength * v,
                        e: c.totalShapeLength
                    }), g.push({
                        s: 0,
                        e: c.totalShapeLength * (b - 1)
                    }));
                    var k = this.addShapes(c, g[0]);
                    if (g[0].s !== g[0].e) {
                        if (g.length > 1) {
                            if (c.shape.paths.shapes[c.shape.paths._length - 1].c) {
                                var P = k.pop();
                                this.addPaths(k, u), k = this.addShapes(c, g[1], P);
                            } else this.addPaths(k, u), k = this.addShapes(c, g[1]);
                        }
                        this.addPaths(k, u);
                    }
                }
                c.shape.paths = u;
            }
        }
    }, jt.prototype.addPaths = function(t, e) {
        var i, s = t.length;
        for(i = 0; i < s; i += 1)e.addShape(t[i]);
    }, jt.prototype.addSegment = function(t, e, i, s, a, r, n) {
        a.setXYAt(e[0], e[1], "o", r), a.setXYAt(i[0], i[1], "i", r + 1), n && a.setXYAt(t[0], t[1], "v", r), a.setXYAt(s[0], s[1], "v", r + 1);
    }, jt.prototype.addSegmentFromArray = function(t, e, i, s) {
        e.setXYAt(t[1], t[5], "o", i), e.setXYAt(t[2], t[6], "i", i + 1), s && e.setXYAt(t[0], t[4], "v", i), e.setXYAt(t[3], t[7], "v", i + 1);
    }, jt.prototype.addShapes = function(t, e, i) {
        var s, a, r, n, o, h, l, p, f = t.pathsData, d = t.shape.paths.shapes, m = t.shape.paths._length, c = 0, u = [], g = !0;
        for(i ? (o = i._length, p = i._length) : (i = At.newElement(), o = 0, p = 0), u.push(i), s = 0; s < m; s += 1){
            for(h = f[s].lengths, i.c = d[s].c, r = d[s].c ? h.length : h.length + 1, a = 1; a < r; a += 1)if (c + (n = h[a - 1]).addedLength < e.s) c += n.addedLength, i.c = !1;
            else {
                if (c > e.e) {
                    i.c = !1;
                    break;
                }
                e.s <= c && e.e >= c + n.addedLength ? (this.addSegment(d[s].v[a - 1], d[s].o[a - 1], d[s].i[a], d[s].v[a], i, o, g), g = !1) : (l = rt.getNewSegment(d[s].v[a - 1], d[s].v[a], d[s].o[a - 1], d[s].i[a], (e.s - c) / n.addedLength, (e.e - c) / n.addedLength, h[a - 1]), this.addSegmentFromArray(l, i, o, g), g = !1, i.c = !1), c += n.addedLength, o += 1;
            }
            if (d[s].c && h.length) {
                if (n = h[a - 1], c <= e.e) {
                    var y = h[a - 1].addedLength;
                    e.s <= c && e.e >= c + y ? (this.addSegment(d[s].v[a - 1], d[s].o[a - 1], d[s].i[0], d[s].v[0], i, o, g), g = !1) : (l = rt.getNewSegment(d[s].v[a - 1], d[s].v[0], d[s].o[a - 1], d[s].i[0], (e.s - c) / y, (e.e - c) / y, h[a - 1]), this.addSegmentFromArray(l, i, o, g), g = !1, i.c = !1);
                } else i.c = !1;
                c += n.addedLength, o += 1;
            }
            if (i._length && (i.setXYAt(i.v[p][0], i.v[p][1], "i", p), i.setXYAt(i.v[i._length - 1][0], i.v[i._length - 1][1], "o", i._length - 1)), c > e.e) break;
            s < m - 1 && (i = At.newElement(), g = !0, u.push(i), o = 0);
        }
        return u;
    }, r([
        qt
    ], Wt), Wt.prototype.initModifierProperties = function(t, e) {
        this.getValue = this.processKeys, this.amount = vt.getProp(t, e.a, 0, null, this), this._isAnimated = !!this.amount.effectsSequence.length;
    }, Wt.prototype.processPath = function(t, e) {
        var i = e / 100, s = [
            0,
            0
        ], a = t._length, r = 0;
        for(r = 0; r < a; r += 1)s[0] += t.v[r][0], s[1] += t.v[r][1];
        s[0] /= a, s[1] /= a;
        var n, o, h, l, p, f, d = At.newElement();
        for(d.c = t.c, r = 0; r < a; r += 1)n = t.v[r][0] + (s[0] - t.v[r][0]) * i, o = t.v[r][1] + (s[1] - t.v[r][1]) * i, h = t.o[r][0] + (s[0] - t.o[r][0]) * -i, l = t.o[r][1] + (s[1] - t.o[r][1]) * -i, p = t.i[r][0] + (s[0] - t.i[r][0]) * -i, f = t.i[r][1] + (s[1] - t.i[r][1]) * -i, d.setTripleAt(n, o, h, l, p, f, r);
        return d;
    }, Wt.prototype.processShapes = function(t) {
        var e, i, s, a, r, n, o = this.shapes.length, h = this.amount.v;
        if (0 !== h) for(i = 0; i < o; i += 1){
            if (n = (r = this.shapes[i]).localShapeCollection, r.shape._mdf || this._mdf || t) for(n.releaseShapes(), r.shape._mdf = !0, e = r.shape.paths.shapes, a = r.shape.paths._length, s = 0; s < a; s += 1)n.addShape(this.processPath(e[s], h));
            r.shape.paths = r.localShapeCollection;
        }
        this.dynamicProperties.length || (this._mdf = !1);
    };
    var Xt = function() {
        var t = [
            0,
            0
        ];
        function e(t, e, i) {
            if (this.elem = t, this.frameId = -1, this.propType = "transform", this.data = e, this.v = new Ft, this.pre = new Ft, this.appliedTransformations = 0, this.initDynamicPropertyContainer(i || t), e.p && e.p.s ? (this.px = vt.getProp(t, e.p.x, 0, 0, this), this.py = vt.getProp(t, e.p.y, 0, 0, this), e.p.z && (this.pz = vt.getProp(t, e.p.z, 0, 0, this))) : this.p = vt.getProp(t, e.p || {
                k: [
                    0,
                    0,
                    0
                ]
            }, 1, 0, this), e.rx) {
                if (this.rx = vt.getProp(t, e.rx, 0, P, this), this.ry = vt.getProp(t, e.ry, 0, P, this), this.rz = vt.getProp(t, e.rz, 0, P, this), e.or.k[0].ti) {
                    var s, a = e.or.k.length;
                    for(s = 0; s < a; s += 1)e.or.k[s].to = null, e.or.k[s].ti = null;
                }
                this.or = vt.getProp(t, e.or, 1, P, this), this.or.sh = !0;
            } else this.r = vt.getProp(t, e.r || {
                k: 0
            }, 0, P, this);
            e.sk && (this.sk = vt.getProp(t, e.sk, 0, P, this), this.sa = vt.getProp(t, e.sa, 0, P, this)), this.a = vt.getProp(t, e.a || {
                k: [
                    0,
                    0,
                    0
                ]
            }, 1, 0, this), this.s = vt.getProp(t, e.s || {
                k: [
                    100,
                    100,
                    100
                ]
            }, 1, .01, this), e.o ? this.o = vt.getProp(t, e.o, 0, .01, t) : this.o = {
                _mdf: !1,
                v: 1
            }, this._isDirty = !0, this.dynamicProperties.length || this.getValue(!0);
        }
        return e.prototype = {
            applyToMatrix: function(t) {
                var e = this._mdf;
                this.iterateDynamicProperties(), this._mdf = this._mdf || e, this.a && t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && t.skewFromAxis(-this.sk.v, this.sa.v), this.r ? t.rotate(-this.r.v) : t.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? this.data.p.z ? t.translate(this.px.v, this.py.v, -this.pz.v) : t.translate(this.px.v, this.py.v, 0) : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
            },
            getValue: function(e) {
                if (this.elem.globalData.frameId !== this.frameId) {
                    if (this._isDirty && (this.precalculateMatrix(), this._isDirty = !1), this.iterateDynamicProperties(), this._mdf || e) {
                        var i;
                        if (this.v.cloneFromProps(this.pre.props), this.appliedTransformations < 1 && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations < 2 && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.appliedTransformations < 3 && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r && this.appliedTransformations < 4 ? this.v.rotate(-this.r.v) : !this.r && this.appliedTransformations < 4 && this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.autoOriented) {
                            var s, a;
                            if (i = this.elem.globalData.frameRate, this.p && this.p.keyframes && this.p.getValueAtTime) this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (s = this.p.getValueAtTime((this.p.keyframes[0].t + .01) / i, 0), a = this.p.getValueAtTime(this.p.keyframes[0].t / i, 0)) : this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (s = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / i, 0), a = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - .05) / i, 0)) : (s = this.p.pv, a = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - .01) / i, this.p.offsetTime));
                            else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
                                s = [], a = [];
                                var r = this.px, n = this.py;
                                r._caching.lastFrame + r.offsetTime <= r.keyframes[0].t ? (s[0] = r.getValueAtTime((r.keyframes[0].t + .01) / i, 0), s[1] = n.getValueAtTime((n.keyframes[0].t + .01) / i, 0), a[0] = r.getValueAtTime(r.keyframes[0].t / i, 0), a[1] = n.getValueAtTime(n.keyframes[0].t / i, 0)) : r._caching.lastFrame + r.offsetTime >= r.keyframes[r.keyframes.length - 1].t ? (s[0] = r.getValueAtTime(r.keyframes[r.keyframes.length - 1].t / i, 0), s[1] = n.getValueAtTime(n.keyframes[n.keyframes.length - 1].t / i, 0), a[0] = r.getValueAtTime((r.keyframes[r.keyframes.length - 1].t - .01) / i, 0), a[1] = n.getValueAtTime((n.keyframes[n.keyframes.length - 1].t - .01) / i, 0)) : (s = [
                                    r.pv,
                                    n.pv
                                ], a[0] = r.getValueAtTime((r._caching.lastFrame + r.offsetTime - .01) / i, r.offsetTime), a[1] = n.getValueAtTime((n._caching.lastFrame + n.offsetTime - .01) / i, n.offsetTime));
                            } else s = a = t;
                            this.v.rotate(-Math.atan2(s[1] - a[1], s[0] - a[0]));
                        }
                        this.data.p && this.data.p.s ? this.data.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
                    }
                    this.frameId = this.elem.globalData.frameId;
                }
            },
            precalculateMatrix: function() {
                if (this.appliedTransformations = 0, this.pre.reset(), !this.a.effectsSequence.length && (this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations = 1, !this.s.effectsSequence.length)) {
                    if (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.appliedTransformations = 2, this.sk) {
                        if (this.sk.effectsSequence.length || this.sa.effectsSequence.length) return;
                        this.pre.skewFromAxis(-this.sk.v, this.sa.v), this.appliedTransformations = 3;
                    }
                    this.r ? this.r.effectsSequence.length || (this.pre.rotate(-this.r.v), this.appliedTransformations = 4) : this.rz.effectsSequence.length || this.ry.effectsSequence.length || this.rx.effectsSequence.length || this.or.effectsSequence.length || (this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.appliedTransformations = 4);
                }
            },
            autoOrient: function() {}
        }, r([
            bt
        ], e), e.prototype.addDynamicProperty = function(t) {
            this._addDynamicProperty(t), this.elem.addDynamicProperty(t), this._isDirty = !0;
        }, e.prototype._addDynamicProperty = bt.prototype.addDynamicProperty, {
            getTransformProperty: function(t, i, s) {
                return new e(t, i, s);
            }
        };
    }();
    function Ht() {}
    function Yt() {}
    function Gt(t, e) {
        return 1e5 * Math.abs(t - e) <= Math.min(Math.abs(t), Math.abs(e));
    }
    function Kt(t) {
        return Math.abs(t) <= 1e-5;
    }
    function Jt(t, e, i) {
        return t * (1 - i) + e * i;
    }
    function Ut(t, e, i) {
        return [
            Jt(t[0], e[0], i),
            Jt(t[1], e[1], i)
        ];
    }
    function Zt(t, e, i, s) {
        return [
            3 * e - t - 3 * i + s,
            3 * t - 6 * e + 3 * i,
            -3 * t + 3 * e,
            t
        ];
    }
    function Qt(t) {
        return new $t(t, t, t, t, !1);
    }
    function $t(t, e, i, s, a) {
        a && he(t, e) && (e = Ut(t, s, 1 / 3)), a && he(i, s) && (i = Ut(t, s, 2 / 3));
        var r = Zt(t[0], e[0], i[0], s[0]), n = Zt(t[1], e[1], i[1], s[1]);
        this.a = [
            r[0],
            n[0]
        ], this.b = [
            r[1],
            n[1]
        ], this.c = [
            r[2],
            n[2]
        ], this.d = [
            r[3],
            n[3]
        ], this.points = [
            t,
            e,
            i,
            s
        ];
    }
    function te(t, e) {
        var i = t.points[0][e], s = t.points[t.points.length - 1][e];
        if (i > s) {
            var a = s;
            s = i, i = a;
        }
        for(var r = function(t, e, i) {
            if (0 === t) return [];
            var s = e * e - 4 * t * i;
            if (s < 0) return [];
            var a = -e / (2 * t);
            if (0 === s) return [
                a
            ];
            var r = Math.sqrt(s) / (2 * t);
            return [
                a - r,
                a + r
            ];
        }(3 * t.a[e], 2 * t.b[e], t.c[e]), n = 0; n < r.length; n += 1)if (r[n] > 0 && r[n] < 1) {
            var o = t.point(r[n])[e];
            o < i ? i = o : o > s && (s = o);
        }
        return {
            min: i,
            max: s
        };
    }
    function ee(t, e, i) {
        var s = t.boundingBox();
        return {
            cx: s.cx,
            cy: s.cy,
            width: s.width,
            height: s.height,
            bez: t,
            t: (e + i) / 2,
            t1: e,
            t2: i
        };
    }
    function ie(t) {
        var e = t.bez.split(.5);
        return [
            ee(e[0], t.t1, t.t),
            ee(e[1], t.t, t.t2)
        ];
    }
    function se(t, e, i, s, a, r) {
        var n, o;
        if (n = t, o = e, 2 * Math.abs(n.cx - o.cx) < n.width + o.width && 2 * Math.abs(n.cy - o.cy) < n.height + o.height) {
            if (i >= r || t.width <= s && t.height <= s && e.width <= s && e.height <= s) a.push([
                t.t,
                e.t
            ]);
            else {
                var h = ie(t), l = ie(e);
                se(h[0], l[0], i + 1, s, a, r), se(h[0], l[1], i + 1, s, a, r), se(h[1], l[0], i + 1, s, a, r), se(h[1], l[1], i + 1, s, a, r);
            }
        }
    }
    function ae(t, e) {
        return [
            t[1] * e[2] - t[2] * e[1],
            t[2] * e[0] - t[0] * e[2],
            t[0] * e[1] - t[1] * e[0]
        ];
    }
    function re(t, e, i, s) {
        var a = [
            t[0],
            t[1],
            1
        ], r = [
            e[0],
            e[1],
            1
        ], n = [
            i[0],
            i[1],
            1
        ], o = [
            s[0],
            s[1],
            1
        ], h = ae(ae(a, r), ae(n, o));
        return Kt(h[2]) ? null : [
            h[0] / h[2],
            h[1] / h[2]
        ];
    }
    function ne(t, e, i) {
        return [
            t[0] + Math.cos(e) * i,
            t[1] - Math.sin(e) * i
        ];
    }
    function oe(t, e) {
        return Math.hypot(t[0] - e[0], t[1] - e[1]);
    }
    function he(t, e) {
        return Gt(t[0], e[0]) && Gt(t[1], e[1]);
    }
    function le() {}
    function pe(t, e, i, s, a, r, n) {
        var o = i - Math.PI / 2, h = i + Math.PI / 2, l = e[0] + Math.cos(i) * s * a, p = e[1] - Math.sin(i) * s * a;
        t.setTripleAt(l, p, l + Math.cos(o) * r, p - Math.sin(o) * r, l + Math.cos(h) * n, p - Math.sin(h) * n, t.length());
    }
    function fe(t, e) {
        var i, s, a, r, n = 0 === e ? t.length() - 1 : e - 1, o = (e + 1) % t.length(), h = t.v[n], l = t.v[o], p = (i = h, a = [
            (s = l)[0] - i[0],
            s[1] - i[1]
        ], r = .5 * -Math.PI, [
            Math.cos(r) * a[0] - Math.sin(r) * a[1],
            Math.sin(r) * a[0] + Math.cos(r) * a[1]
        ]);
        return Math.atan2(0, 1) - Math.atan2(p[1], p[0]);
    }
    function de(t, e, i, s, a, r, n) {
        var o = fe(e, i), h = e.v[i % e._length], l = e.v[0 === i ? e._length - 1 : i - 1], p = e.v[(i + 1) % e._length], f = 2 === r ? Math.sqrt(Math.pow(h[0] - l[0], 2) + Math.pow(h[1] - l[1], 2)) : 0, d = 2 === r ? Math.sqrt(Math.pow(h[0] - p[0], 2) + Math.pow(h[1] - p[1], 2)) : 0;
        pe(t, e.v[i % e._length], o, n, s, d / (2 * (a + 1)), f / (2 * (a + 1)));
    }
    function me(t, e, i, s, a, r) {
        for(var n = 0; n < s; n += 1){
            var o = (n + 1) / (s + 1), h = 2 === a ? Math.sqrt(Math.pow(e.points[3][0] - e.points[0][0], 2) + Math.pow(e.points[3][1] - e.points[0][1], 2)) : 0, l = e.normalAngle(o);
            pe(t, e.point(o), l, r, i, h / (2 * (s + 1)), h / (2 * (s + 1))), r = -r;
        }
        return r;
    }
    function ce(t, e, i) {
        var s = Math.atan2(e[0] - t[0], e[1] - t[1]);
        return [
            ne(t, s, i),
            ne(e, s, i)
        ];
    }
    function ue(t, e) {
        var i, s, a, r, n, o, h;
        i = (h = ce(t.points[0], t.points[1], e))[0], s = h[1], a = (h = ce(t.points[1], t.points[2], e))[0], r = h[1], n = (h = ce(t.points[2], t.points[3], e))[0], o = h[1];
        var l = re(i, s, a, r);
        null === l && (l = s);
        var p = re(n, o, a, r);
        return null === p && (p = n), new $t(i, l, p, o);
    }
    function ge(t, e, i, s, a) {
        var r = e.points[3], n = i.points[0];
        if (3 === s) return r;
        if (he(r, n)) return r;
        if (2 === s) {
            var o = -e.tangentAngle(1), h = -i.tangentAngle(0) + Math.PI, l = re(r, ne(r, o + Math.PI / 2, 100), n, ne(n, o + Math.PI / 2, 100)), p = l ? oe(l, r) : oe(r, n) / 2, f = ne(r, o, 2 * p * A);
            return t.setXYAt(f[0], f[1], "o", t.length() - 1), f = ne(n, h, 2 * p * A), t.setTripleAt(n[0], n[1], n[0], n[1], f[0], f[1], t.length()), n;
        }
        var d = re(he(r, e.points[2]) ? e.points[0] : e.points[2], r, n, he(n, i.points[1]) ? i.points[3] : i.points[1]);
        return d && oe(d, r) < a ? (t.setTripleAt(d[0], d[1], d[0], d[1], d[0], d[1], t.length()), d) : r;
    }
    function ye(t, e) {
        var i = t.intersections(e);
        return i.length && Gt(i[0][0], 1) && i.shift(), i.length ? i[0] : null;
    }
    function ve(t, e) {
        var i = t.slice(), s = e.slice(), a = ye(t[t.length - 1], e[0]);
        return a && (i[t.length - 1] = t[t.length - 1].split(a[0])[0], s[0] = e[0].split(a[1])[1]), t.length > 1 && e.length > 1 && (a = ye(t[0], e[e.length - 1])) ? [
            [
                t[0].split(a[0])[0]
            ],
            [
                e[e.length - 1].split(a[1])[1]
            ]
        ] : [
            i,
            s
        ];
    }
    function be(t, e) {
        var i, s, a, r, n = t.inflectionPoints();
        if (0 === n.length) return [
            ue(t, e)
        ];
        if (1 === n.length || Gt(n[1], 1)) return i = (a = t.split(n[0]))[0], s = a[1], [
            ue(i, e),
            ue(s, e)
        ];
        i = (a = t.split(n[0]))[0];
        var o = (n[1] - n[0]) / (1 - n[0]);
        return r = (a = a[1].split(o))[0], s = a[1], [
            ue(i, e),
            ue(r, e),
            ue(s, e)
        ];
    }
    function _e() {}
    function ke(t) {
        for(var e = t.fStyle ? t.fStyle.split(" ") : [], i = "normal", s = "normal", a = e.length, r = 0; r < a; r += 1)switch(e[r].toLowerCase()){
            case "italic":
                s = "italic";
                break;
            case "bold":
                i = "700";
                break;
            case "black":
                i = "900";
                break;
            case "medium":
                i = "500";
                break;
            case "regular":
            case "normal":
                i = "400";
                break;
            case "light":
            case "thin":
                i = "200";
        }
        return {
            style: s,
            weight: t.fWeight || i
        };
    }
    r([
        qt
    ], Ht), Ht.prototype.initModifierProperties = function(t, e) {
        this.getValue = this.processKeys, this.c = vt.getProp(t, e.c, 0, null, this), this.o = vt.getProp(t, e.o, 0, null, this), this.tr = Xt.getTransformProperty(t, e.tr, this), this.so = vt.getProp(t, e.tr.so, 0, .01, this), this.eo = vt.getProp(t, e.tr.eo, 0, .01, this), this.data = e, this.dynamicProperties.length || this.getValue(!0), this._isAnimated = !!this.dynamicProperties.length, this.pMatrix = new Ft, this.rMatrix = new Ft, this.sMatrix = new Ft, this.tMatrix = new Ft, this.matrix = new Ft;
    }, Ht.prototype.applyTransforms = function(t, e, i, s, a, r) {
        var n = r ? -1 : 1, o = s.s.v[0] + (1 - s.s.v[0]) * (1 - a), h = s.s.v[1] + (1 - s.s.v[1]) * (1 - a);
        t.translate(s.p.v[0] * n * a, s.p.v[1] * n * a, s.p.v[2]), e.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), e.rotate(-s.r.v * n * a), e.translate(s.a.v[0], s.a.v[1], s.a.v[2]), i.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), i.scale(r ? 1 / o : o, r ? 1 / h : h), i.translate(s.a.v[0], s.a.v[1], s.a.v[2]);
    }, Ht.prototype.init = function(t, e, i, s) {
        for(this.elem = t, this.arr = e, this.pos = i, this.elemsData = s, this._currentCopies = 0, this._elements = [], this._groups = [], this.frameId = -1, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e[i]); i > 0;)i -= 1, this._elements.unshift(e[i]);
        this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
    }, Ht.prototype.resetElements = function(t) {
        var e, i = t.length;
        for(e = 0; e < i; e += 1)t[e]._processed = !1, "gr" === t[e].ty && this.resetElements(t[e].it);
    }, Ht.prototype.cloneElements = function(t) {
        var e = JSON.parse(JSON.stringify(t));
        return this.resetElements(e), e;
    }, Ht.prototype.changeGroupRender = function(t, e) {
        var i, s = t.length;
        for(i = 0; i < s; i += 1)t[i]._render = e, "gr" === t[i].ty && this.changeGroupRender(t[i].it, e);
    }, Ht.prototype.processShapes = function(t) {
        var e, i, s, a, r, n = !1;
        if (this._mdf || t) {
            var o, h = Math.ceil(this.c.v);
            if (this._groups.length < h) {
                for(; this._groups.length < h;){
                    var l = {
                        it: this.cloneElements(this._elements),
                        ty: "gr"
                    };
                    l.it.push({
                        a: {
                            a: 0,
                            ix: 1,
                            k: [
                                0,
                                0
                            ]
                        },
                        nm: "Transform",
                        o: {
                            a: 0,
                            ix: 7,
                            k: 100
                        },
                        p: {
                            a: 0,
                            ix: 2,
                            k: [
                                0,
                                0
                            ]
                        },
                        r: {
                            a: 1,
                            ix: 6,
                            k: [
                                {
                                    s: 0,
                                    e: 0,
                                    t: 0
                                },
                                {
                                    s: 0,
                                    e: 0,
                                    t: 1
                                }
                            ]
                        },
                        s: {
                            a: 0,
                            ix: 3,
                            k: [
                                100,
                                100
                            ]
                        },
                        sa: {
                            a: 0,
                            ix: 5,
                            k: 0
                        },
                        sk: {
                            a: 0,
                            ix: 4,
                            k: 0
                        },
                        ty: "tr"
                    }), this.arr.splice(0, 0, l), this._groups.splice(0, 0, l), this._currentCopies += 1;
                }
                this.elem.reloadShapes(), n = !0;
            }
            for(r = 0, s = 0; s <= this._groups.length - 1; s += 1){
                if (o = r < h, this._groups[s]._render = o, this.changeGroupRender(this._groups[s].it, o), !o) {
                    var p = this.elemsData[s].it, f = p[p.length - 1];
                    0 !== f.transform.op.v ? (f.transform.op._mdf = !0, f.transform.op.v = 0) : f.transform.op._mdf = !1;
                }
                r += 1;
            }
            this._currentCopies = h;
            var d = this.o.v, m = d % 1, c = d > 0 ? Math.floor(d) : Math.ceil(d), u = this.pMatrix.props, g = this.rMatrix.props, y = this.sMatrix.props;
            this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), this.matrix.reset();
            var v, b, _ = 0;
            if (d > 0) {
                for(; _ < c;)this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), _ += 1;
                m && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, m, !1), _ += m);
            } else if (d < 0) {
                for(; _ > c;)this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0), _ -= 1;
                m && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -m, !0), _ -= m);
            }
            for(s = 1 === this.data.m ? 0 : this._currentCopies - 1, a = 1 === this.data.m ? 1 : -1, r = this._currentCopies; r;){
                if (b = (i = (e = this.elemsData[s].it)[e.length - 1].transform.mProps.v.props).length, e[e.length - 1].transform.mProps._mdf = !0, e[e.length - 1].transform.op._mdf = !0, e[e.length - 1].transform.op.v = 1 === this._currentCopies ? this.so.v : this.so.v + (this.eo.v - this.so.v) * (s / (this._currentCopies - 1)), 0 !== _) {
                    for((0 !== s && 1 === a || s !== this._currentCopies - 1 && -1 === a) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), this.matrix.transform(g[0], g[1], g[2], g[3], g[4], g[5], g[6], g[7], g[8], g[9], g[10], g[11], g[12], g[13], g[14], g[15]), this.matrix.transform(y[0], y[1], y[2], y[3], y[4], y[5], y[6], y[7], y[8], y[9], y[10], y[11], y[12], y[13], y[14], y[15]), this.matrix.transform(u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], u[8], u[9], u[10], u[11], u[12], u[13], u[14], u[15]), v = 0; v < b; v += 1)i[v] = this.matrix.props[v];
                    this.matrix.reset();
                } else for(this.matrix.reset(), v = 0; v < b; v += 1)i[v] = this.matrix.props[v];
                _ += 1, r -= 1, s += a;
            }
        } else for(r = this._currentCopies, s = 0, a = 1; r;)i = (e = this.elemsData[s].it)[e.length - 1].transform.mProps.v.props, e[e.length - 1].transform.mProps._mdf = !1, e[e.length - 1].transform.op._mdf = !1, r -= 1, s += a;
        return n;
    }, Ht.prototype.addShape = function() {}, r([
        qt
    ], Yt), Yt.prototype.initModifierProperties = function(t, e) {
        this.getValue = this.processKeys, this.rd = vt.getProp(t, e.r, 0, null, this), this._isAnimated = !!this.rd.effectsSequence.length;
    }, Yt.prototype.processPath = function(t, e) {
        var i, s = At.newElement();
        s.c = t.c;
        var a, r, n, o, h, l, p, f, d, m, c, u, g = t._length, y = 0;
        for(i = 0; i < g; i += 1)a = t.v[i], n = t.o[i], r = t.i[i], a[0] === n[0] && a[1] === n[1] && a[0] === r[0] && a[1] === r[1] ? 0 !== i && i !== g - 1 || t.c ? (o = 0 === i ? t.v[g - 1] : t.v[i - 1], l = (h = Math.sqrt(Math.pow(a[0] - o[0], 2) + Math.pow(a[1] - o[1], 2))) ? Math.min(h / 2, e) / h : 0, p = c = a[0] + (o[0] - a[0]) * l, f = u = a[1] - (a[1] - o[1]) * l, d = p - (p - a[0]) * A, m = f - (f - a[1]) * A, s.setTripleAt(p, f, d, m, c, u, y), y += 1, o = i === g - 1 ? t.v[0] : t.v[i + 1], l = (h = Math.sqrt(Math.pow(a[0] - o[0], 2) + Math.pow(a[1] - o[1], 2))) ? Math.min(h / 2, e) / h : 0, p = d = a[0] + (o[0] - a[0]) * l, f = m = a[1] + (o[1] - a[1]) * l, c = p - (p - a[0]) * A, u = f - (f - a[1]) * A, s.setTripleAt(p, f, d, m, c, u, y), y += 1) : (s.setTripleAt(a[0], a[1], n[0], n[1], r[0], r[1], y), y += 1) : (s.setTripleAt(t.v[i][0], t.v[i][1], t.o[i][0], t.o[i][1], t.i[i][0], t.i[i][1], y), y += 1);
        return s;
    }, Yt.prototype.processShapes = function(t) {
        var e, i, s, a, r, n, o = this.shapes.length, h = this.rd.v;
        if (0 !== h) for(i = 0; i < o; i += 1){
            if (n = (r = this.shapes[i]).localShapeCollection, r.shape._mdf || this._mdf || t) for(n.releaseShapes(), r.shape._mdf = !0, e = r.shape.paths.shapes, a = r.shape.paths._length, s = 0; s < a; s += 1)n.addShape(this.processPath(e[s], h));
            r.shape.paths = r.localShapeCollection;
        }
        this.dynamicProperties.length || (this._mdf = !1);
    }, $t.prototype.point = function(t) {
        return [
            ((this.a[0] * t + this.b[0]) * t + this.c[0]) * t + this.d[0],
            ((this.a[1] * t + this.b[1]) * t + this.c[1]) * t + this.d[1]
        ];
    }, $t.prototype.derivative = function(t) {
        return [
            (3 * t * this.a[0] + 2 * this.b[0]) * t + this.c[0],
            (3 * t * this.a[1] + 2 * this.b[1]) * t + this.c[1]
        ];
    }, $t.prototype.tangentAngle = function(t) {
        var e = this.derivative(t);
        return Math.atan2(e[1], e[0]);
    }, $t.prototype.normalAngle = function(t) {
        var e = this.derivative(t);
        return Math.atan2(e[0], e[1]);
    }, $t.prototype.inflectionPoints = function() {
        var t = this.a[1] * this.b[0] - this.a[0] * this.b[1];
        if (Kt(t)) return [];
        var e = -0.5 * (this.a[1] * this.c[0] - this.a[0] * this.c[1]) / t, i = e * e - 1 / 3 * (this.b[1] * this.c[0] - this.b[0] * this.c[1]) / t;
        if (i < 0) return [];
        var s = Math.sqrt(i);
        return Kt(s) ? s > 0 && s < 1 ? [
            e
        ] : [] : [
            e - s,
            e + s
        ].filter(function(t) {
            return t > 0 && t < 1;
        });
    }, $t.prototype.split = function(t) {
        if (t <= 0) return [
            Qt(this.points[0]),
            this
        ];
        if (t >= 1) return [
            this,
            Qt(this.points[this.points.length - 1])
        ];
        var e = Ut(this.points[0], this.points[1], t), i = Ut(this.points[1], this.points[2], t), s = Ut(this.points[2], this.points[3], t), a = Ut(e, i, t), r = Ut(i, s, t), n = Ut(a, r, t);
        return [
            new $t(this.points[0], e, a, n, !0),
            new $t(n, r, s, this.points[3], !0)
        ];
    }, $t.prototype.bounds = function() {
        return {
            x: te(this, 0),
            y: te(this, 1)
        };
    }, $t.prototype.boundingBox = function() {
        var t = this.bounds();
        return {
            left: t.x.min,
            right: t.x.max,
            top: t.y.min,
            bottom: t.y.max,
            width: t.x.max - t.x.min,
            height: t.y.max - t.y.min,
            cx: (t.x.max + t.x.min) / 2,
            cy: (t.y.max + t.y.min) / 2
        };
    }, $t.prototype.intersections = function(t, e, i) {
        void 0 === e && (e = 2), void 0 === i && (i = 7);
        var s = [];
        return se(ee(this, 0, 1), ee(t, 0, 1), 0, e, s, i), s;
    }, $t.shapeSegment = function(t, e) {
        var i = (e + 1) % t.length();
        return new $t(t.v[e], t.o[e], t.i[i], t.v[i], !0);
    }, $t.shapeSegmentInverted = function(t, e) {
        var i = (e + 1) % t.length();
        return new $t(t.v[i], t.i[i], t.o[e], t.v[e], !0);
    }, r([
        qt
    ], le), le.prototype.initModifierProperties = function(t, e) {
        this.getValue = this.processKeys, this.amplitude = vt.getProp(t, e.s, 0, null, this), this.frequency = vt.getProp(t, e.r, 0, null, this), this.pointsType = vt.getProp(t, e.pt, 0, null, this), this._isAnimated = 0 !== this.amplitude.effectsSequence.length || 0 !== this.frequency.effectsSequence.length || 0 !== this.pointsType.effectsSequence.length;
    }, le.prototype.processPath = function(t, e, i, s) {
        var a = t._length, r = At.newElement();
        if (r.c = t.c, t.c || (a -= 1), 0 === a) return r;
        var n = -1, o = $t.shapeSegment(t, 0);
        de(r, t, 0, e, i, s, n);
        for(var h = 0; h < a; h += 1)n = me(r, o, e, i, s, -n), o = h !== a - 1 || t.c ? $t.shapeSegment(t, (h + 1) % a) : null, de(r, t, h + 1, e, i, s, n);
        return r;
    }, le.prototype.processShapes = function(t) {
        var e, i, s, a, r, n, o = this.shapes.length, h = this.amplitude.v, l = Math.max(0, Math.round(this.frequency.v)), p = this.pointsType.v;
        if (0 !== h) for(i = 0; i < o; i += 1){
            if (n = (r = this.shapes[i]).localShapeCollection, r.shape._mdf || this._mdf || t) for(n.releaseShapes(), r.shape._mdf = !0, e = r.shape.paths.shapes, a = r.shape.paths._length, s = 0; s < a; s += 1)n.addShape(this.processPath(e[s], h, l, p));
            r.shape.paths = r.localShapeCollection;
        }
        this.dynamicProperties.length || (this._mdf = !1);
    }, r([
        qt
    ], _e), _e.prototype.initModifierProperties = function(t, e) {
        this.getValue = this.processKeys, this.amount = vt.getProp(t, e.a, 0, null, this), this.miterLimit = vt.getProp(t, e.ml, 0, null, this), this.lineJoin = e.lj, this._isAnimated = 0 !== this.amount.effectsSequence.length;
    }, _e.prototype.processPath = function(t, e, i, s) {
        var a = At.newElement();
        a.c = t.c;
        var r, n, o, h = t.length();
        t.c || (h -= 1);
        var l = [];
        for(r = 0; r < h; r += 1)o = $t.shapeSegment(t, r), l.push(be(o, e));
        if (!t.c) for(r = h - 1; r >= 0; r -= 1)o = $t.shapeSegmentInverted(t, r), l.push(be(o, e));
        l = function(t) {
            for(var e, i = 1; i < t.length; i += 1)e = ve(t[i - 1], t[i]), t[i - 1] = e[0], t[i] = e[1];
            return t.length > 1 && (e = ve(t[t.length - 1], t[0]), t[t.length - 1] = e[0], t[0] = e[1]), t;
        }(l);
        var p = null, f = null;
        for(r = 0; r < l.length; r += 1){
            var d = l[r];
            for(f && (p = ge(a, f, d[0], i, s)), f = d[d.length - 1], n = 0; n < d.length; n += 1)o = d[n], p && he(o.points[0], p) ? a.setXYAt(o.points[1][0], o.points[1][1], "o", a.length() - 1) : a.setTripleAt(o.points[0][0], o.points[0][1], o.points[1][0], o.points[1][1], o.points[0][0], o.points[0][1], a.length()), a.setTripleAt(o.points[3][0], o.points[3][1], o.points[3][0], o.points[3][1], o.points[2][0], o.points[2][1], a.length()), p = o.points[3];
        }
        return l.length && ge(a, f, l[0][0], i, s), a;
    }, _e.prototype.processShapes = function(t) {
        var e, i, s, a, r, n, o = this.shapes.length, h = this.amount.v, l = this.miterLimit.v, p = this.lineJoin;
        if (0 !== h) for(i = 0; i < o; i += 1){
            if (n = (r = this.shapes[i]).localShapeCollection, r.shape._mdf || this._mdf || t) for(n.releaseShapes(), r.shape._mdf = !0, e = r.shape.paths.shapes, a = r.shape.paths._length, s = 0; s < a; s += 1)n.addShape(this.processPath(e[s], h, p, l));
            r.shape.paths = r.localShapeCollection;
        }
        this.dynamicProperties.length || (this._mdf = !1);
    };
    var Pe = function() {
        var t = {
            w: 0,
            size: 0,
            shapes: [],
            data: {
                shapes: []
            }
        }, e = [];
        e = e.concat([
            2304,
            2305,
            2306,
            2307,
            2362,
            2363,
            2364,
            2364,
            2366,
            2367,
            2368,
            2369,
            2370,
            2371,
            2372,
            2373,
            2374,
            2375,
            2376,
            2377,
            2378,
            2379,
            2380,
            2381,
            2382,
            2383,
            2387,
            2388,
            2389,
            2390,
            2391,
            2402,
            2403
        ]);
        var i = 127988, s = [
            "d83cdffb",
            "d83cdffc",
            "d83cdffd",
            "d83cdffe",
            "d83cdfff"
        ];
        function r(t, e) {
            var i = a("span");
            i.setAttribute("aria-hidden", !0), i.style.fontFamily = e;
            var s = a("span");
            s.innerText = "giItT1WQy@!-/#", i.style.position = "absolute", i.style.left = "-10000px", i.style.top = "-10000px", i.style.fontSize = "300px", i.style.fontVariant = "normal", i.style.fontStyle = "normal", i.style.fontWeight = "normal", i.style.letterSpacing = "0", i.appendChild(s), document.body.appendChild(i);
            var r = s.offsetWidth;
            return s.style.fontFamily = function(t) {
                var e, i = t.split(","), s = i.length, a = [];
                for(e = 0; e < s; e += 1)"sans-serif" !== i[e] && "monospace" !== i[e] && a.push(i[e]);
                return a.join(",");
            }(t) + ", " + e, {
                node: s,
                w: r,
                parent: i
            };
        }
        function n(t, e) {
            var i, s = document.body && e ? "svg" : "canvas", a = ke(t);
            if ("svg" === s) {
                var r = W("text");
                r.style.fontSize = "100px", r.setAttribute("font-family", t.fFamily), r.setAttribute("font-style", a.style), r.setAttribute("font-weight", a.weight), r.textContent = "1", t.fClass ? (r.style.fontFamily = "inherit", r.setAttribute("class", t.fClass)) : r.style.fontFamily = t.fFamily, e.appendChild(r), i = r;
            } else {
                var n = new OffscreenCanvas(500, 500).getContext("2d");
                n.font = a.style + " " + a.weight + " 100px " + t.fFamily, i = n;
            }
            return {
                measureText: function(t) {
                    return "svg" === s ? (i.textContent = t, i.getComputedTextLength()) : i.measureText(t).width;
                }
            };
        }
        function o(t) {
            var e = 0, i = t.charCodeAt(0);
            if (i >= 55296 && i <= 56319) {
                var s = t.charCodeAt(1);
                s >= 56320 && s <= 57343 && (e = 1024 * (i - 55296) + s - 56320 + 65536);
            }
            return e;
        }
        function h(t) {
            var e = o(t);
            return e >= 127462 && e <= 127487;
        }
        var l = function() {
            this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.isLoaded = !1, this._warned = !1, this.initTime = Date.now(), this.setIsLoadedBinded = this.setIsLoaded.bind(this), this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this);
        };
        l.isModifier = function(t, e) {
            var i = t.toString(16) + e.toString(16);
            return -1 !== s.indexOf(i);
        }, l.isZeroWidthJoiner = function(t) {
            return 8205 === t;
        }, l.isFlagEmoji = function(t) {
            return h(t.substr(0, 2)) && h(t.substr(2, 2));
        }, l.isRegionalCode = h, l.isCombinedCharacter = function(t) {
            return -1 !== e.indexOf(t);
        }, l.isRegionalFlag = function(t, e) {
            var s = o(t.substr(e, 2));
            if (s !== i) return !1;
            var a = 0;
            for(e += 2; a < 5;){
                if ((s = o(t.substr(e, 2))) < 917601 || s > 917626) return !1;
                a += 1, e += 2;
            }
            return 917631 === o(t.substr(e, 2));
        }, l.isVariationSelector = function(t) {
            return 65039 === t;
        }, l.BLACK_FLAG_CODE_POINT = i;
        var p = {
            addChars: function(t) {
                if (t) {
                    var e;
                    this.chars || (this.chars = []);
                    var i, s, a = t.length, r = this.chars.length;
                    for(e = 0; e < a; e += 1){
                        for(i = 0, s = !1; i < r;)this.chars[i].style === t[e].style && this.chars[i].fFamily === t[e].fFamily && this.chars[i].ch === t[e].ch && (s = !0), i += 1;
                        s || (this.chars.push(t[e]), r += 1);
                    }
                }
            },
            addFonts: function(t, e) {
                if (t) {
                    if (this.chars) return this.isLoaded = !0, void (this.fonts = t.list);
                    if (!document.body) return this.isLoaded = !0, t.list.forEach(function(t) {
                        t.helper = n(t), t.cache = {};
                    }), void (this.fonts = t.list);
                    var i, s = t.list, o = s.length, h = o;
                    for(i = 0; i < o; i += 1){
                        var l, p, f = !0;
                        if (s[i].loaded = !1, s[i].monoCase = r(s[i].fFamily, "monospace"), s[i].sansCase = r(s[i].fFamily, "sans-serif"), s[i].fPath) {
                            if ("p" === s[i].fOrigin || 3 === s[i].origin) {
                                if ((l = document.querySelectorAll('style[f-forigin="p"][f-family="' + s[i].fFamily + '"], style[f-origin="3"][f-family="' + s[i].fFamily + '"]')).length > 0 && (f = !1), f) {
                                    var d = a("style");
                                    d.setAttribute("f-forigin", s[i].fOrigin), d.setAttribute("f-origin", s[i].origin), d.setAttribute("f-family", s[i].fFamily), d.type = "text/css", d.innerText = "@font-face {font-family: " + s[i].fFamily + "; font-style: normal; src: url('" + s[i].fPath + "');}", e.appendChild(d);
                                }
                            } else if ("g" === s[i].fOrigin || 1 === s[i].origin) {
                                for(l = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), p = 0; p < l.length; p += 1)-1 !== l[p].href.indexOf(s[i].fPath) && (f = !1);
                                if (f) {
                                    var m = a("link");
                                    m.setAttribute("f-forigin", s[i].fOrigin), m.setAttribute("f-origin", s[i].origin), m.type = "text/css", m.rel = "stylesheet", m.href = s[i].fPath, document.body.appendChild(m);
                                }
                            } else if ("t" === s[i].fOrigin || 2 === s[i].origin) {
                                for(l = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'), p = 0; p < l.length; p += 1)s[i].fPath === l[p].src && (f = !1);
                                if (f) {
                                    var c = a("link");
                                    c.setAttribute("f-forigin", s[i].fOrigin), c.setAttribute("f-origin", s[i].origin), c.setAttribute("rel", "stylesheet"), c.setAttribute("href", s[i].fPath), e.appendChild(c);
                                }
                            }
                        } else s[i].loaded = !0, h -= 1;
                        s[i].helper = n(s[i], e), s[i].cache = {}, this.fonts.push(s[i]);
                    }
                    0 === h ? this.isLoaded = !0 : setTimeout(this.checkLoadedFonts.bind(this), 100);
                } else this.isLoaded = !0;
            },
            getCharData: function(e, i, s) {
                for(var a = 0, r = this.chars.length; a < r;){
                    if (this.chars[a].ch === e && this.chars[a].style === i && this.chars[a].fFamily === s) return this.chars[a];
                    a += 1;
                }
                return ("string" == typeof e && 13 !== e.charCodeAt(0) || !e) && console && console.warn && !this._warned && (this._warned = !0, console.warn("Missing character from exported characters list: ", e, i, s)), t;
            },
            getFontByName: function(t) {
                for(var e = 0, i = this.fonts.length; e < i;){
                    if (this.fonts[e].fName === t) return this.fonts[e];
                    e += 1;
                }
                return this.fonts[0];
            },
            measureText: function(t, e, i) {
                var s = this.getFontByName(e), a = t;
                if (!s.cache[a]) {
                    var r = s.helper;
                    if (" " === t) {
                        var n = r.measureText("|" + t + "|"), o = r.measureText("||");
                        s.cache[a] = (n - o) / 100;
                    } else s.cache[a] = r.measureText(t) / 100;
                }
                return s.cache[a] * i;
            },
            checkLoadedFonts: function() {
                var t, e, i, s = this.fonts.length, a = s;
                for(t = 0; t < s; t += 1)this.fonts[t].loaded ? a -= 1 : "n" === this.fonts[t].fOrigin || 0 === this.fonts[t].origin ? this.fonts[t].loaded = !0 : (e = this.fonts[t].monoCase.node, i = this.fonts[t].monoCase.w, e.offsetWidth !== i ? (a -= 1, this.fonts[t].loaded = !0) : (e = this.fonts[t].sansCase.node, i = this.fonts[t].sansCase.w, e.offsetWidth !== i && (a -= 1, this.fonts[t].loaded = !0)), this.fonts[t].loaded && (this.fonts[t].sansCase.parent.parentNode.removeChild(this.fonts[t].sansCase.parent), this.fonts[t].monoCase.parent.parentNode.removeChild(this.fonts[t].monoCase.parent)));
                0 !== a && Date.now() - this.initTime < 5e3 ? setTimeout(this.checkLoadedFontsBinded, 20) : setTimeout(this.setIsLoadedBinded, 10);
            },
            setIsLoaded: function() {
                this.isLoaded = !0;
            }
        };
        return l.prototype = p, l;
    }();
    function Ae(t) {
        this.animationData = t;
    }
    function Se() {}
    Ae.prototype.getProp = function(t) {
        return this.animationData.slots && this.animationData.slots[t.sid] ? Object.assign(t, this.animationData.slots[t.sid].p) : t;
    }, Se.prototype = {
        initRenderable: function() {
            this.isInRange = !1, this.hidden = !1, this.isTransparent = !1, this.renderableComponents = [];
        },
        addRenderableComponent: function(t) {
            -1 === this.renderableComponents.indexOf(t) && this.renderableComponents.push(t);
        },
        removeRenderableComponent: function(t) {
            -1 !== this.renderableComponents.indexOf(t) && this.renderableComponents.splice(this.renderableComponents.indexOf(t), 1);
        },
        prepareRenderableFrame: function(t) {
            this.checkLayerLimits(t);
        },
        checkTransparency: function() {
            this.finalTransform.mProp.o.v <= 0 ? !this.isTransparent && this.globalData.renderConfig.hideOnTransparent && (this.isTransparent = !0, this.hide()) : this.isTransparent && (this.isTransparent = !1, this.show());
        },
        checkLayerLimits: function(t) {
            this.data.ip - this.data.st <= t && this.data.op - this.data.st > t ? !0 !== this.isInRange && (this.globalData._mdf = !0, this._mdf = !0, this.isInRange = !0, this.show()) : !1 !== this.isInRange && (this.globalData._mdf = !0, this.isInRange = !1, this.hide());
        },
        renderRenderable: function() {
            var t, e = this.renderableComponents.length;
            for(t = 0; t < e; t += 1)this.renderableComponents[t].renderFrame(this._isFirstFrame);
        },
        sourceRectAtTime: function() {
            return {
                top: 0,
                left: 0,
                width: 100,
                height: 100
            };
        },
        getLayerSize: function() {
            return 5 === this.data.ty ? {
                w: this.data.textData.width,
                h: this.data.textData.height
            } : {
                w: this.data.width,
                h: this.data.height
            };
        }
    };
    var xe, we = (xe = {
        0: "source-over",
        1: "multiply",
        2: "screen",
        3: "overlay",
        4: "darken",
        5: "lighten",
        6: "color-dodge",
        7: "color-burn",
        8: "hard-light",
        9: "soft-light",
        10: "difference",
        11: "exclusion",
        12: "hue",
        13: "saturation",
        14: "color",
        15: "luminosity"
    }, function(t) {
        return xe[t] || "";
    });
    function De(t, e, i) {
        this.p = vt.getProp(e, t.v, 0, 0, i);
    }
    function Ce(t, e, i) {
        this.p = vt.getProp(e, t.v, 0, 0, i);
    }
    function Me(t, e, i) {
        this.p = vt.getProp(e, t.v, 1, 0, i);
    }
    function Te(t, e, i) {
        this.p = vt.getProp(e, t.v, 1, 0, i);
    }
    function Fe(t, e, i) {
        this.p = vt.getProp(e, t.v, 0, 0, i);
    }
    function Ee(t, e, i) {
        this.p = vt.getProp(e, t.v, 0, 0, i);
    }
    function Ie(t, e, i) {
        this.p = vt.getProp(e, t.v, 0, 0, i);
    }
    function Le() {
        this.p = {};
    }
    function Ve(t, e) {
        var i, s = t.ef || [];
        this.effectElements = [];
        var a, r = s.length;
        for(i = 0; i < r; i += 1)a = new Re(s[i], e), this.effectElements.push(a);
    }
    function Re(t, e) {
        this.init(t, e);
    }
    function ze() {}
    function Oe() {}
    function Ne(t, e, i) {
        this.initFrame(), this.initRenderable(), this.assetData = e.getAssetData(t.refId), this.footageData = e.imageLoader.getAsset(this.assetData), this.initBaseData(t, e, i);
    }
    function Be(t, e, i) {
        this.initFrame(), this.initRenderable(), this.assetData = e.getAssetData(t.refId), this.initBaseData(t, e, i), this._isPlaying = !1, this._canPlay = !1;
        var s = this.globalData.getAssetsPath(this.assetData);
        this.audio = this.globalData.audioController.createAudio(s), this._currentTime = 0, this.globalData.audioController.addAudio(this), this._volumeMultiplier = 1, this._volume = 1, this._previousVolume = null, this.tm = t.tm ? vt.getProp(this, t.tm, 0, e.frameRate, this) : {
            _placeholder: !0
        }, this.lv = vt.getProp(this, t.au && t.au.lv ? t.au.lv : {
            k: [
                100
            ]
        }, 1, .01, this);
    }
    function qe() {}
    r([
        bt
    ], Re), Re.prototype.getValue = Re.prototype.iterateDynamicProperties, Re.prototype.init = function(t, e) {
        var i;
        this.data = t, this.effectElements = [], this.initDynamicPropertyContainer(e);
        var s, a = this.data.ef.length, r = this.data.ef;
        for(i = 0; i < a; i += 1){
            switch(s = null, r[i].ty){
                case 0:
                    s = new De(r[i], e, this);
                    break;
                case 1:
                    s = new Ce(r[i], e, this);
                    break;
                case 2:
                    s = new Me(r[i], e, this);
                    break;
                case 3:
                    s = new Te(r[i], e, this);
                    break;
                case 4:
                case 7:
                    s = new Ie(r[i], e, this);
                    break;
                case 10:
                    s = new Fe(r[i], e, this);
                    break;
                case 11:
                    s = new Ee(r[i], e, this);
                    break;
                case 5:
                    s = new Ve(r[i], e, this);
                    break;
                default:
                    s = new Le(r[i], e, this);
            }
            s && this.effectElements.push(s);
        }
    }, ze.prototype = {
        checkMasks: function() {
            if (!this.data.hasMask) return !1;
            for(var t = 0, e = this.data.masksProperties.length; t < e;){
                if ("n" !== this.data.masksProperties[t].mode && !1 !== this.data.masksProperties[t].cl) return !0;
                t += 1;
            }
            return !1;
        },
        initExpressions: function() {
            var t = B();
            if (t) {
                var e = t("layer"), i = t("effects"), s = t("shape"), a = t("text"), r = t("comp");
                this.layerInterface = e(this), this.data.hasMask && this.maskManager && this.layerInterface.registerMaskInterface(this.maskManager);
                var n = i.createEffectsInterface(this, this.layerInterface);
                this.layerInterface.registerEffectsInterface(n), 0 === this.data.ty || this.data.xt ? this.compInterface = r(this) : 4 === this.data.ty ? (this.layerInterface.shapeInterface = s(this.shapesData, this.itemsData, this.layerInterface), this.layerInterface.content = this.layerInterface.shapeInterface) : 5 === this.data.ty && (this.layerInterface.textInterface = a(this), this.layerInterface.text = this.layerInterface.textInterface);
            }
        },
        setBlendMode: function() {
            var t = we(this.data.bm);
            (this.baseElement || this.layerElement).style["mix-blend-mode"] = t;
        },
        initBaseData: function(t, e, i) {
            this.globalData = e, this.comp = i, this.data = t, this.layerId = I(), this.data.sr || (this.data.sr = 1), this.effectsManager = new Ve(this.data, this, this.dynamicProperties);
        },
        getType: function() {
            return this.type;
        },
        sourceRectAtTime: function() {}
    }, Oe.prototype = {
        initFrame: function() {
            this._isFirstFrame = !1, this.dynamicProperties = [], this._mdf = !1;
        },
        prepareProperties: function(t, e) {
            var i, s = this.dynamicProperties.length;
            for(i = 0; i < s; i += 1)(e || this._isParent && "transform" === this.dynamicProperties[i].propType) && (this.dynamicProperties[i].getValue(), this.dynamicProperties[i]._mdf && (this.globalData._mdf = !0, this._mdf = !0));
        },
        addDynamicProperty: function(t) {
            -1 === this.dynamicProperties.indexOf(t) && this.dynamicProperties.push(t);
        }
    }, Ne.prototype.prepareFrame = function() {}, r([
        Se,
        ze,
        Oe
    ], Ne), Ne.prototype.getBaseElement = function() {
        return null;
    }, Ne.prototype.renderFrame = function() {}, Ne.prototype.destroy = function() {}, Ne.prototype.initExpressions = function() {
        var t = B();
        if (t) {
            var e = t("footage");
            this.layerInterface = e(this);
        }
    }, Ne.prototype.getFootageData = function() {
        return this.footageData;
    }, Be.prototype.prepareFrame = function(t) {
        if (this.prepareRenderableFrame(t, !0), this.prepareProperties(t, !0), this.tm._placeholder) this._currentTime = t / this.data.sr;
        else {
            var e = this.tm.v;
            this._currentTime = e;
        }
        this._volume = this.lv.v[0];
        var i = this._volume * this._volumeMultiplier;
        this._previousVolume !== i && (this._previousVolume = i, this.audio.volume(i));
    }, r([
        Se,
        ze,
        Oe
    ], Be), Be.prototype.renderFrame = function() {
        this.isInRange && this._canPlay && (this._isPlaying ? (!this.audio.playing() || Math.abs(this._currentTime / this.globalData.frameRate - this.audio.seek()) > .1) && this.audio.seek(this._currentTime / this.globalData.frameRate) : (this.audio.play(), this.audio.seek(this._currentTime / this.globalData.frameRate), this._isPlaying = !0));
    }, Be.prototype.show = function() {}, Be.prototype.hide = function() {
        this.audio.pause(), this._isPlaying = !1;
    }, Be.prototype.pause = function() {
        this.audio.pause(), this._isPlaying = !1, this._canPlay = !1;
    }, Be.prototype.resume = function() {
        this._canPlay = !0;
    }, Be.prototype.setRate = function(t) {
        this.audio.rate(t);
    }, Be.prototype.volume = function(t) {
        this._volumeMultiplier = t, this._previousVolume = t * this._volume, this.audio.volume(this._previousVolume);
    }, Be.prototype.getBaseElement = function() {
        return null;
    }, Be.prototype.destroy = function() {}, Be.prototype.sourceRectAtTime = function() {}, Be.prototype.initExpressions = function() {}, qe.prototype.checkLayers = function(t) {
        var e, i, s = this.layers.length;
        for(this.completeLayers = !0, e = s - 1; e >= 0; e -= 1)this.elements[e] || (i = this.layers[e]).ip - i.st <= t - this.layers[e].st && i.op - i.st > t - this.layers[e].st && this.buildItem(e), this.completeLayers = !!this.elements[e] && this.completeLayers;
        this.checkPendingElements();
    }, qe.prototype.createItem = function(t) {
        switch(t.ty){
            case 2:
                return this.createImage(t);
            case 0:
                return this.createComp(t);
            case 1:
                return this.createSolid(t);
            case 3:
            default:
                return this.createNull(t);
            case 4:
                return this.createShape(t);
            case 5:
                return this.createText(t);
            case 6:
                return this.createAudio(t);
            case 13:
                return this.createCamera(t);
            case 15:
                return this.createFootage(t);
        }
    }, qe.prototype.createCamera = function() {
        throw new Error("You're using a 3d camera. Try the html renderer.");
    }, qe.prototype.createAudio = function(t) {
        return new Be(t, this.globalData, this);
    }, qe.prototype.createFootage = function(t) {
        return new Ne(t, this.globalData, this);
    }, qe.prototype.buildAllItems = function() {
        var t, e = this.layers.length;
        for(t = 0; t < e; t += 1)this.buildItem(t);
        this.checkPendingElements();
    }, qe.prototype.includeLayers = function(t) {
        var e;
        this.completeLayers = !1;
        var i, s = t.length, a = this.layers.length;
        for(e = 0; e < s; e += 1)for(i = 0; i < a;){
            if (this.layers[i].id === t[e].id) {
                this.layers[i] = t[e];
                break;
            }
            i += 1;
        }
    }, qe.prototype.setProjectInterface = function(t) {
        this.globalData.projectInterface = t;
    }, qe.prototype.initItems = function() {
        this.globalData.progressiveLoad || this.buildAllItems();
    }, qe.prototype.buildElementParenting = function(t, e, i) {
        for(var s = this.elements, a = this.layers, r = 0, n = a.length; r < n;)a[r].ind == e && (s[r] && !0 !== s[r] ? (i.push(s[r]), s[r].setAsParent(), void 0 !== a[r].parent ? this.buildElementParenting(t, a[r].parent, i) : t.setHierarchy(i)) : (this.buildItem(r), this.addPendingElement(t))), r += 1;
    }, qe.prototype.addPendingElement = function(t) {
        this.pendingElements.push(t);
    }, qe.prototype.searchExtraCompositions = function(t) {
        var e, i = t.length;
        for(e = 0; e < i; e += 1)if (t[e].xt) {
            var s = this.createComp(t[e]);
            s.initExpressions(), this.globalData.projectInterface.registerComposition(s);
        }
    }, qe.prototype.getElementById = function(t) {
        var e, i = this.elements.length;
        for(e = 0; e < i; e += 1)if (this.elements[e].data.ind === t) return this.elements[e];
        return null;
    }, qe.prototype.getElementByPath = function(t) {
        var e, i = t.shift();
        if ("number" == typeof i) e = this.elements[i];
        else {
            var s, a = this.elements.length;
            for(s = 0; s < a; s += 1)if (this.elements[s].data.nm === i) {
                e = this.elements[s];
                break;
            }
        }
        return 0 === t.length ? e : e.getElementByPath(t);
    }, qe.prototype.setupGlobalData = function(t, e) {
        this.globalData.fontManager = new Pe, this.globalData.slotManager = function(t) {
            return new Ae(t);
        }(t), this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), this.globalData.imageLoader = this.animationItem.imagePreloader, this.globalData.audioController = this.animationItem.audioController, this.globalData.frameId = 0, this.globalData.frameRate = t.fr, this.globalData.nm = t.nm, this.globalData.compSize = {
            w: t.w,
            h: t.h
        };
    };
    var je = "transformEFfect";
    function We() {}
    function Xe(t, e, i) {
        this.data = t, this.element = e, this.globalData = i, this.storedData = [], this.masksProperties = this.data.masksProperties || [], this.maskElement = null;
        var a, r, n = this.globalData.defs, o = this.masksProperties ? this.masksProperties.length : 0;
        this.viewData = l(o), this.solidPath = "";
        var h, p, f, d, m, c, u = this.masksProperties, g = 0, y = [], v = I(), b = "clipPath", _ = "clip-path";
        for(a = 0; a < o; a += 1)if (("a" !== u[a].mode && "n" !== u[a].mode || u[a].inv || 100 !== u[a].o.k || u[a].o.x) && (b = "mask", _ = "mask"), "s" !== u[a].mode && "i" !== u[a].mode || 0 !== g ? f = null : ((f = W("rect")).setAttribute("fill", "#ffffff"), f.setAttribute("width", this.element.comp.data.w || 0), f.setAttribute("height", this.element.comp.data.h || 0), y.push(f)), r = W("path"), "n" === u[a].mode) this.viewData[a] = {
            op: vt.getProp(this.element, u[a].o, 0, .01, this.element),
            prop: Tt.getShapeProp(this.element, u[a], 3),
            elem: r,
            lastPath: ""
        }, n.appendChild(r);
        else {
            var k;
            if (g += 1, r.setAttribute("fill", "s" === u[a].mode ? "#000000" : "#ffffff"), r.setAttribute("clip-rule", "nonzero"), 0 !== u[a].x.k ? (b = "mask", _ = "mask", c = vt.getProp(this.element, u[a].x, 0, null, this.element), k = I(), (d = W("filter")).setAttribute("id", k), (m = W("feMorphology")).setAttribute("operator", "erode"), m.setAttribute("in", "SourceGraphic"), m.setAttribute("radius", "0"), d.appendChild(m), n.appendChild(d), r.setAttribute("stroke", "s" === u[a].mode ? "#000000" : "#ffffff")) : (m = null, c = null), this.storedData[a] = {
                elem: r,
                x: c,
                expan: m,
                lastPath: "",
                lastOperator: "",
                filterId: k,
                lastRadius: 0
            }, "i" === u[a].mode) {
                p = y.length;
                var P = W("g");
                for(h = 0; h < p; h += 1)P.appendChild(y[h]);
                var A = W("mask");
                A.setAttribute("mask-type", "alpha"), A.setAttribute("id", v + "_" + g), A.appendChild(r), n.appendChild(A), P.setAttribute("mask", "url(" + s() + "#" + v + "_" + g + ")"), y.length = 0, y.push(P);
            } else y.push(r);
            u[a].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[a] = {
                elem: r,
                lastPath: "",
                op: vt.getProp(this.element, u[a].o, 0, .01, this.element),
                prop: Tt.getShapeProp(this.element, u[a], 3),
                invRect: f
            }, this.viewData[a].prop.k || this.drawPath(u[a], this.viewData[a].prop.v, this.viewData[a]);
        }
        for(this.maskElement = W(b), o = y.length, a = 0; a < o; a += 1)this.maskElement.appendChild(y[a]);
        g > 0 && (this.maskElement.setAttribute("id", v), this.element.maskedElement.setAttribute(_, "url(" + s() + "#" + v + ")"), n.appendChild(this.maskElement)), this.viewData.length && this.element.addRenderableComponent(this);
    }
    We.prototype = {
        initTransform: function() {
            var t = new Ft;
            this.finalTransform = {
                mProp: this.data.ks ? Xt.getTransformProperty(this, this.data.ks, this) : {
                    o: 0
                },
                _matMdf: !1,
                _localMatMdf: !1,
                _opMdf: !1,
                mat: t,
                localMat: t,
                localOpacity: 1
            }, this.data.ao && (this.finalTransform.mProp.autoOriented = !0), this.data.ty;
        },
        renderTransform: function() {
            if (this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame, this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame, this.hierarchy) {
                var t, e = this.finalTransform.mat, i = 0, s = this.hierarchy.length;
                if (!this.finalTransform._matMdf) for(; i < s;){
                    if (this.hierarchy[i].finalTransform.mProp._mdf) {
                        this.finalTransform._matMdf = !0;
                        break;
                    }
                    i += 1;
                }
                if (this.finalTransform._matMdf) for(t = this.finalTransform.mProp.v.props, e.cloneFromProps(t), i = 0; i < s; i += 1)e.multiply(this.hierarchy[i].finalTransform.mProp.v);
            }
            this.localTransforms && !this.finalTransform._matMdf || (this.finalTransform._localMatMdf = this.finalTransform._matMdf), this.finalTransform._opMdf && (this.finalTransform.localOpacity = this.finalTransform.mProp.o.v);
        },
        renderLocalTransform: function() {
            if (this.localTransforms) {
                var t = 0, e = this.localTransforms.length;
                if (this.finalTransform._localMatMdf = this.finalTransform._matMdf, !this.finalTransform._localMatMdf || !this.finalTransform._opMdf) for(; t < e;)this.localTransforms[t]._mdf && (this.finalTransform._localMatMdf = !0), this.localTransforms[t]._opMdf && !this.finalTransform._opMdf && (this.finalTransform.localOpacity = this.finalTransform.mProp.o.v, this.finalTransform._opMdf = !0), t += 1;
                if (this.finalTransform._localMatMdf) {
                    var i = this.finalTransform.localMat;
                    for(this.localTransforms[0].matrix.clone(i), t = 1; t < e; t += 1){
                        var s = this.localTransforms[t].matrix;
                        i.multiply(s);
                    }
                    i.multiply(this.finalTransform.mat);
                }
                if (this.finalTransform._opMdf) {
                    var a = this.finalTransform.localOpacity;
                    for(t = 0; t < e; t += 1)a *= .01 * this.localTransforms[t].opacity;
                    this.finalTransform.localOpacity = a;
                }
            }
        },
        searchEffectTransforms: function() {
            if (this.renderableEffectsManager) {
                var t = this.renderableEffectsManager.getEffects(je);
                if (t.length) {
                    this.localTransforms = [], this.finalTransform.localMat = new Ft;
                    var e = 0, i = t.length;
                    for(e = 0; e < i; e += 1)this.localTransforms.push(t[e]);
                }
            }
        },
        globalToLocal: function(t) {
            var e = [];
            e.push(this.finalTransform);
            for(var i, s = !0, a = this.comp; s;)a.finalTransform ? (a.data.hasMask && e.splice(0, 0, a.finalTransform), a = a.comp) : s = !1;
            var r, n = e.length;
            for(i = 0; i < n; i += 1)r = e[i].mat.applyToPointArray(0, 0, 0), t = [
                t[0] - r[0],
                t[1] - r[1],
                0
            ];
            return t;
        },
        mHelper: new Ft
    }, Xe.prototype.getMaskProperty = function(t) {
        return this.viewData[t].prop;
    }, Xe.prototype.renderFrame = function(t) {
        var e, i = this.element.finalTransform.mat, a = this.masksProperties.length;
        for(e = 0; e < a; e += 1)if ((this.viewData[e].prop._mdf || t) && this.drawPath(this.masksProperties[e], this.viewData[e].prop.v, this.viewData[e]), (this.viewData[e].op._mdf || t) && this.viewData[e].elem.setAttribute("fill-opacity", this.viewData[e].op.v), "n" !== this.masksProperties[e].mode && (this.viewData[e].invRect && (this.element.finalTransform.mProp._mdf || t) && this.viewData[e].invRect.setAttribute("transform", i.getInverseMatrix().to2dCSS()), this.storedData[e].x && (this.storedData[e].x._mdf || t))) {
            var r = this.storedData[e].expan;
            this.storedData[e].x.v < 0 ? ("erode" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "erode", this.storedData[e].elem.setAttribute("filter", "url(" + s() + "#" + this.storedData[e].filterId + ")")), r.setAttribute("radius", -this.storedData[e].x.v)) : ("dilate" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "dilate", this.storedData[e].elem.setAttribute("filter", null)), this.storedData[e].elem.setAttribute("stroke-width", 2 * this.storedData[e].x.v));
        }
    }, Xe.prototype.getMaskelement = function() {
        return this.maskElement;
    }, Xe.prototype.createLayerSolidPath = function() {
        var t = "M0,0 ";
        return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, t += " h-" + this.globalData.compSize.w, t += " v-" + this.globalData.compSize.h + " ";
    }, Xe.prototype.drawPath = function(t, e, i) {
        var s, a, r = " M" + e.v[0][0] + "," + e.v[0][1];
        for(a = e._length, s = 1; s < a; s += 1)r += " C" + e.o[s - 1][0] + "," + e.o[s - 1][1] + " " + e.i[s][0] + "," + e.i[s][1] + " " + e.v[s][0] + "," + e.v[s][1];
        if (e.c && a > 1 && (r += " C" + e.o[s - 1][0] + "," + e.o[s - 1][1] + " " + e.i[0][0] + "," + e.i[0][1] + " " + e.v[0][0] + "," + e.v[0][1]), i.lastPath !== r) {
            var n = "";
            i.elem && (e.c && (n = t.inv ? this.solidPath + r : r), i.elem.setAttribute("d", n)), i.lastPath = r;
        }
    }, Xe.prototype.destroy = function() {
        this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.masksProperties = null;
    };
    var He = function() {
        var t = {};
        return t.createFilter = function(t, e) {
            var i = W("filter");
            i.setAttribute("id", t), !0 !== e && (i.setAttribute("filterUnits", "objectBoundingBox"), i.setAttribute("x", "0%"), i.setAttribute("y", "0%"), i.setAttribute("width", "100%"), i.setAttribute("height", "100%"));
            return i;
        }, t.createAlphaToLuminanceFilter = function() {
            var t = W("feColorMatrix");
            return t.setAttribute("type", "matrix"), t.setAttribute("color-interpolation-filters", "sRGB"), t.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"), t;
        }, t;
    }(), Ye = function() {
        var t = {
            maskType: !0,
            svgLumaHidden: !0,
            offscreenCanvas: "undefined" != typeof OffscreenCanvas
        };
        return (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (t.maskType = !1), /firefox/i.test(navigator.userAgent) && (t.svgLumaHidden = !1), t;
    }(), Ge = {}, Ke = "filter_result_";
    function Je(t) {
        var e, i, a = "SourceGraphic", r = t.data.ef ? t.data.ef.length : 0, n = I(), o = He.createFilter(n, !0), h = 0;
        for(this.filters = [], e = 0; e < r; e += 1){
            i = null;
            var l = t.data.ef[e].ty;
            if (Ge[l]) i = new Ge[l].effect(o, t.effectsManager.effectElements[e], t, Ke + h, a), a = Ke + h, Ge[l].countsAsEffect && (h += 1);
            i && this.filters.push(i);
        }
        h && (t.globalData.defs.appendChild(o), t.layerElement.setAttribute("filter", "url(" + s() + "#" + n + ")")), this.filters.length && t.addRenderableComponent(this);
    }
    function Ue() {}
    function Ze() {}
    function Qe() {}
    function $e(t, e, i) {
        this.assetData = e.getAssetData(t.refId), this.assetData && this.assetData.sid && (this.assetData = e.slotManager.getProp(this.assetData)), this.initElement(t, e, i), this.sourceRect = {
            top: 0,
            left: 0,
            width: this.assetData.w,
            height: this.assetData.h
        };
    }
    function ti(t, e) {
        this.elem = t, this.pos = e;
    }
    function ei() {}
    Je.prototype.renderFrame = function(t) {
        var e, i = this.filters.length;
        for(e = 0; e < i; e += 1)this.filters[e].renderFrame(t);
    }, Je.prototype.getEffects = function(t) {
        var e, i = this.filters.length, s = [];
        for(e = 0; e < i; e += 1)this.filters[e].type === t && s.push(this.filters[e]);
        return s;
    }, Ue.prototype = {
        initRendererElement: function() {
            this.layerElement = W("g");
        },
        createContainerElements: function() {
            this.matteElement = W("g"), this.transformedElement = this.layerElement, this.maskedElement = this.layerElement, this._sizeChanged = !1;
            var t = null;
            if (this.data.td) {
                this.matteMasks = {};
                var e = W("g");
                e.setAttribute("id", this.layerId), e.appendChild(this.layerElement), t = e, this.globalData.defs.appendChild(e);
            } else this.data.tt ? (this.matteElement.appendChild(this.layerElement), t = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
            if (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), 0 === this.data.ty && !this.data.hd) {
                var i = W("clipPath"), a = W("path");
                a.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
                var r = I();
                if (i.setAttribute("id", r), i.appendChild(a), this.globalData.defs.appendChild(i), this.checkMasks()) {
                    var n = W("g");
                    n.setAttribute("clip-path", "url(" + s() + "#" + r + ")"), n.appendChild(this.layerElement), this.transformedElement = n, t ? t.appendChild(this.transformedElement) : this.baseElement = this.transformedElement;
                } else this.layerElement.setAttribute("clip-path", "url(" + s() + "#" + r + ")");
            }
            0 !== this.data.bm && this.setBlendMode();
        },
        renderElement: function() {
            this.finalTransform._localMatMdf && this.transformedElement.setAttribute("transform", this.finalTransform.localMat.to2dCSS()), this.finalTransform._opMdf && this.transformedElement.setAttribute("opacity", this.finalTransform.localOpacity);
        },
        destroyBaseElement: function() {
            this.layerElement = null, this.matteElement = null, this.maskManager.destroy();
        },
        getBaseElement: function() {
            return this.data.hd ? null : this.baseElement;
        },
        createRenderableComponents: function() {
            this.maskManager = new Xe(this.data, this, this.globalData), this.renderableEffectsManager = new Je(this), this.searchEffectTransforms();
        },
        getMatte: function(t) {
            if (this.matteMasks || (this.matteMasks = {}), !this.matteMasks[t]) {
                var e, i, a, r, n = this.layerId + "_" + t;
                if (1 === t || 3 === t) {
                    var o = W("mask");
                    o.setAttribute("id", n), o.setAttribute("mask-type", 3 === t ? "luminance" : "alpha"), (a = W("use")).setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + this.layerId), o.appendChild(a), this.globalData.defs.appendChild(o), Ye.maskType || 1 !== t || (o.setAttribute("mask-type", "luminance"), e = I(), i = He.createFilter(e), this.globalData.defs.appendChild(i), i.appendChild(He.createAlphaToLuminanceFilter()), (r = W("g")).appendChild(a), o.appendChild(r), r.setAttribute("filter", "url(" + s() + "#" + e + ")"));
                } else if (2 === t) {
                    var h = W("mask");
                    h.setAttribute("id", n), h.setAttribute("mask-type", "alpha");
                    var l = W("g");
                    h.appendChild(l), e = I(), i = He.createFilter(e);
                    var p = W("feComponentTransfer");
                    p.setAttribute("in", "SourceGraphic"), i.appendChild(p);
                    var f = W("feFuncA");
                    f.setAttribute("type", "table"), f.setAttribute("tableValues", "1.0 0.0"), p.appendChild(f), this.globalData.defs.appendChild(i);
                    var d = W("rect");
                    d.setAttribute("width", this.comp.data.w), d.setAttribute("height", this.comp.data.h), d.setAttribute("x", "0"), d.setAttribute("y", "0"), d.setAttribute("fill", "#ffffff"), d.setAttribute("opacity", "0"), l.setAttribute("filter", "url(" + s() + "#" + e + ")"), l.appendChild(d), (a = W("use")).setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + this.layerId), l.appendChild(a), Ye.maskType || (h.setAttribute("mask-type", "luminance"), i.appendChild(He.createAlphaToLuminanceFilter()), r = W("g"), l.appendChild(d), r.appendChild(this.layerElement), l.appendChild(r)), this.globalData.defs.appendChild(h);
                }
                this.matteMasks[t] = n;
            }
            return this.matteMasks[t];
        },
        setMatte: function(t) {
            this.matteElement && this.matteElement.setAttribute("mask", "url(" + s() + "#" + t + ")");
        }
    }, Ze.prototype = {
        initHierarchy: function() {
            this.hierarchy = [], this._isParent = !1, this.checkParenting();
        },
        setHierarchy: function(t) {
            this.hierarchy = t;
        },
        setAsParent: function() {
            this._isParent = !0;
        },
        checkParenting: function() {
            void 0 !== this.data.parent && this.comp.buildElementParenting(this, this.data.parent, []);
        }
    }, r([
        Se,
        n({
            initElement: function(t, e, i) {
                this.initFrame(), this.initBaseData(t, e, i), this.initTransform(t, e, i), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide();
            },
            hide: function() {
                this.hidden || this.isInRange && !this.isTransparent || ((this.baseElement || this.layerElement).style.display = "none", this.hidden = !0);
            },
            show: function() {
                this.isInRange && !this.isTransparent && (this.data.hd || ((this.baseElement || this.layerElement).style.display = "block"), this.hidden = !1, this._isFirstFrame = !0);
            },
            renderFrame: function() {
                this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderLocalTransform(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1));
            },
            renderInnerContent: function() {},
            prepareFrame: function(t) {
                this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.checkTransparency();
            },
            destroy: function() {
                this.innerElem = null, this.destroyBaseElement();
            }
        })
    ], Qe), r([
        ze,
        We,
        Ue,
        Ze,
        Oe,
        Qe
    ], $e), $e.prototype.createContent = function() {
        var t = this.globalData.getAssetsPath(this.assetData);
        this.innerElem = W("image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), this.layerElement.appendChild(this.innerElem);
    }, $e.prototype.sourceRectAtTime = function() {
        return this.sourceRect;
    }, ei.prototype = {
        addShapeToModifiers: function(t) {
            var e, i = this.shapeModifiers.length;
            for(e = 0; e < i; e += 1)this.shapeModifiers[e].addShape(t);
        },
        isShapeInAnimatedModifiers: function(t) {
            for(var e = this.shapeModifiers.length; 0 < e;)if (this.shapeModifiers[0].isAnimatedWithShape(t)) return !0;
            return !1;
        },
        renderModifiers: function() {
            if (this.shapeModifiers.length) {
                var t, e = this.shapes.length;
                for(t = 0; t < e; t += 1)this.shapes[t].sh.reset();
                for(t = (e = this.shapeModifiers.length) - 1; t >= 0 && !this.shapeModifiers[t].processShapes(this._isFirstFrame); t -= 1);
            }
        },
        searchProcessedElement: function(t) {
            for(var e = this.processedElements, i = 0, s = e.length; i < s;){
                if (e[i].elem === t) return e[i].pos;
                i += 1;
            }
            return 0;
        },
        addProcessedElement: function(t, e) {
            for(var i = this.processedElements, s = i.length; s;)if (i[s -= 1].elem === t) return void (i[s].pos = e);
            i.push(new ti(t, e));
        },
        prepareFrame: function(t) {
            this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange);
        }
    };
    var ii = {
        1: "butt",
        2: "round",
        3: "square"
    }, si = {
        1: "miter",
        2: "round",
        3: "bevel"
    };
    function ai(t, e, i) {
        this.caches = [], this.styles = [], this.transformers = t, this.lStr = "", this.sh = i, this.lvl = e, this._isAnimated = !!i.k;
        for(var s = 0, a = t.length; s < a;){
            if (t[s].mProps.dynamicProperties.length) {
                this._isAnimated = !0;
                break;
            }
            s += 1;
        }
    }
    function ri(t, e) {
        this.data = t, this.type = t.ty, this.d = "", this.lvl = e, this._mdf = !1, this.closed = !0 === t.hd, this.pElem = W("path"), this.msElem = null;
    }
    function ni(t, e, i, s) {
        var a;
        this.elem = t, this.frameId = -1, this.dataProps = l(e.length), this.renderer = i, this.k = !1, this.dashStr = "", this.dashArray = h("float32", e.length ? e.length - 1 : 0), this.dashoffset = h("float32", 1), this.initDynamicPropertyContainer(s);
        var r, n = e.length || 0;
        for(a = 0; a < n; a += 1)r = vt.getProp(t, e[a].v, 0, 0, this), this.k = r.k || this.k, this.dataProps[a] = {
            n: e[a].n,
            p: r
        };
        this.k || this.getValue(!0), this._isAnimated = this.k;
    }
    function oi(t, e, i) {
        this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = vt.getProp(t, e.o, 0, .01, this), this.w = vt.getProp(t, e.w, 0, null, this), this.d = new ni(t, e.d || {}, "svg", this), this.c = vt.getProp(t, e.c, 1, 255, this), this.style = i, this._isAnimated = !!this._isAnimated;
    }
    function hi(t, e, i) {
        this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = vt.getProp(t, e.o, 0, .01, this), this.c = vt.getProp(t, e.c, 1, 255, this), this.style = i;
    }
    function li(t, e, i) {
        this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.style = i;
    }
    function pi(t, e, i) {
        this.data = e, this.c = h("uint8c", 4 * e.p);
        var s = e.k.k[0].s ? e.k.k[0].s.length - 4 * e.p : e.k.k.length - 4 * e.p;
        this.o = h("float32", s), this._cmdf = !1, this._omdf = !1, this._collapsable = this.checkCollapsable(), this._hasOpacity = s, this.initDynamicPropertyContainer(i), this.prop = vt.getProp(t, e.k, 1, null, this), this.k = this.prop.k, this.getValue(!0);
    }
    function fi(t, e, i) {
        this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.initGradientData(t, e, i);
    }
    function di(t, e, i) {
        this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.w = vt.getProp(t, e.w, 0, null, this), this.d = new ni(t, e.d || {}, "svg", this), this.initGradientData(t, e, i), this._isAnimated = !!this._isAnimated;
    }
    function mi() {
        this.it = [], this.prevViewData = [], this.gr = W("g");
    }
    function ci(t, e, i) {
        this.transform = {
            mProps: t,
            op: e,
            container: i
        }, this.elements = [], this._isAnimated = this.transform.mProps.dynamicProperties.length || this.transform.op.effectsSequence.length;
    }
    ai.prototype.setAsAnimated = function() {
        this._isAnimated = !0;
    }, ri.prototype.reset = function() {
        this.d = "", this._mdf = !1;
    }, ni.prototype.getValue = function(t) {
        if ((this.elem.globalData.frameId !== this.frameId || t) && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf = this._mdf || t, this._mdf)) {
            var e = 0, i = this.dataProps.length;
            for("svg" === this.renderer && (this.dashStr = ""), e = 0; e < i; e += 1)"o" !== this.dataProps[e].n ? "svg" === this.renderer ? this.dashStr += " " + this.dataProps[e].p.v : this.dashArray[e] = this.dataProps[e].p.v : this.dashoffset[0] = this.dataProps[e].p.v;
        }
    }, r([
        bt
    ], ni), r([
        bt
    ], oi), r([
        bt
    ], hi), r([
        bt
    ], li), pi.prototype.comparePoints = function(t, e) {
        for(var i = 0, s = this.o.length / 2; i < s;){
            if (Math.abs(t[4 * i] - t[4 * e + 2 * i]) > .01) return !1;
            i += 1;
        }
        return !0;
    }, pi.prototype.checkCollapsable = function() {
        if (this.o.length / 2 != this.c.length / 4) return !1;
        if (this.data.k.k[0].s) for(var t = 0, e = this.data.k.k.length; t < e;){
            if (!this.comparePoints(this.data.k.k[t].s, this.data.p)) return !1;
            t += 1;
        }
        else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1;
        return !0;
    }, pi.prototype.getValue = function(t) {
        if (this.prop.getValue(), this._mdf = !1, this._cmdf = !1, this._omdf = !1, this.prop._mdf || t) {
            var e, i, s, a = 4 * this.data.p;
            for(e = 0; e < a; e += 1)i = e % 4 == 0 ? 100 : 255, s = Math.round(this.prop.v[e] * i), this.c[e] !== s && (this.c[e] = s, this._cmdf = !t);
            if (this.o.length) for(a = this.prop.v.length, e = 4 * this.data.p; e < a; e += 1)i = e % 2 == 0 ? 100 : 1, s = e % 2 == 0 ? Math.round(100 * this.prop.v[e]) : this.prop.v[e], this.o[e - 4 * this.data.p] !== s && (this.o[e - 4 * this.data.p] = s, this._omdf = !t);
            this._mdf = !t;
        }
    }, r([
        bt
    ], pi), fi.prototype.initGradientData = function(t, e, i) {
        this.o = vt.getProp(t, e.o, 0, .01, this), this.s = vt.getProp(t, e.s, 1, null, this), this.e = vt.getProp(t, e.e, 1, null, this), this.h = vt.getProp(t, e.h || {
            k: 0
        }, 0, .01, this), this.a = vt.getProp(t, e.a || {
            k: 0
        }, 0, P, this), this.g = new pi(t, e.g, this), this.style = i, this.stops = [], this.setGradientData(i.pElem, e), this.setGradientOpacity(e, i), this._isAnimated = !!this._isAnimated;
    }, fi.prototype.setGradientData = function(t, e) {
        var i = I(), a = W(1 === e.t ? "linearGradient" : "radialGradient");
        a.setAttribute("id", i), a.setAttribute("spreadMethod", "pad"), a.setAttribute("gradientUnits", "userSpaceOnUse");
        var r, n, o, h = [];
        for(o = 4 * e.g.p, n = 0; n < o; n += 4)r = W("stop"), a.appendChild(r), h.push(r);
        t.setAttribute("gf" === e.ty ? "fill" : "stroke", "url(" + s() + "#" + i + ")"), this.gf = a, this.cst = h;
    }, fi.prototype.setGradientOpacity = function(t, e) {
        if (this.g._hasOpacity && !this.g._collapsable) {
            var i, a, r, n = W("mask"), o = W("path");
            n.appendChild(o);
            var h = I(), l = I();
            n.setAttribute("id", l);
            var p = W(1 === t.t ? "linearGradient" : "radialGradient");
            p.setAttribute("id", h), p.setAttribute("spreadMethod", "pad"), p.setAttribute("gradientUnits", "userSpaceOnUse"), r = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length;
            var f = this.stops;
            for(a = 4 * t.g.p; a < r; a += 2)(i = W("stop")).setAttribute("stop-color", "rgb(255,255,255)"), p.appendChild(i), f.push(i);
            o.setAttribute("gf" === t.ty ? "fill" : "stroke", "url(" + s() + "#" + h + ")"), "gs" === t.ty && (o.setAttribute("stroke-linecap", ii[t.lc || 2]), o.setAttribute("stroke-linejoin", si[t.lj || 2]), 1 === t.lj && o.setAttribute("stroke-miterlimit", t.ml)), this.of = p, this.ms = n, this.ost = f, this.maskId = l, e.msElem = o;
        }
    }, r([
        bt
    ], fi), r([
        fi,
        bt
    ], di);
    var ui = function(t, e, i, s) {
        if (0 === e) return "";
        var a, r = t.o, n = t.i, o = t.v, h = " M" + s.applyToPointStringified(o[0][0], o[0][1]);
        for(a = 1; a < e; a += 1)h += " C" + s.applyToPointStringified(r[a - 1][0], r[a - 1][1]) + " " + s.applyToPointStringified(n[a][0], n[a][1]) + " " + s.applyToPointStringified(o[a][0], o[a][1]);
        return i && e && (h += " C" + s.applyToPointStringified(r[a - 1][0], r[a - 1][1]) + " " + s.applyToPointStringified(n[0][0], n[0][1]) + " " + s.applyToPointStringified(o[0][0], o[0][1]), h += "z"), h;
    }, gi = function() {
        var t = new Ft, e = new Ft;
        function i(t, e, i) {
            (i || e.transform.op._mdf) && e.transform.container.setAttribute("opacity", e.transform.op.v), (i || e.transform.mProps._mdf) && e.transform.container.setAttribute("transform", e.transform.mProps.v.to2dCSS());
        }
        function s() {}
        function a(i, s, a) {
            var r, n, o, h, l, p, f, d, m, c, u = s.styles.length, g = s.lvl;
            for(p = 0; p < u; p += 1){
                if (h = s.sh._mdf || a, s.styles[p].lvl < g) {
                    for(d = e.reset(), m = g - s.styles[p].lvl, c = s.transformers.length - 1; !h && m > 0;)h = s.transformers[c].mProps._mdf || h, m -= 1, c -= 1;
                    if (h) for(m = g - s.styles[p].lvl, c = s.transformers.length - 1; m > 0;)d.multiply(s.transformers[c].mProps.v), m -= 1, c -= 1;
                } else d = t;
                if (n = (f = s.sh.paths)._length, h) {
                    for(o = "", r = 0; r < n; r += 1)(l = f.shapes[r]) && l._length && (o += ui(l, l._length, l.c, d));
                    s.caches[p] = o;
                } else o = s.caches[p];
                s.styles[p].d += !0 === i.hd ? "" : o, s.styles[p]._mdf = h || s.styles[p]._mdf;
            }
        }
        function r(t, e, i) {
            var s = e.style;
            (e.c._mdf || i) && s.pElem.setAttribute("fill", "rgb(" + v(e.c.v[0]) + "," + v(e.c.v[1]) + "," + v(e.c.v[2]) + ")"), (e.o._mdf || i) && s.pElem.setAttribute("fill-opacity", e.o.v);
        }
        function n(t, e, i) {
            o(t, e, i), h(t, e, i);
        }
        function o(t, e, i) {
            var s, a, r, n, o, h = e.gf, l = e.g._hasOpacity, p = e.s.v, f = e.e.v;
            if (e.o._mdf || i) {
                var d = "gf" === t.ty ? "fill-opacity" : "stroke-opacity";
                e.style.pElem.setAttribute(d, e.o.v);
            }
            if (e.s._mdf || i) {
                var m = 1 === t.t ? "x1" : "cx", c = "x1" === m ? "y1" : "cy";
                h.setAttribute(m, p[0]), h.setAttribute(c, p[1]), l && !e.g._collapsable && (e.of.setAttribute(m, p[0]), e.of.setAttribute(c, p[1]));
            }
            if (e.g._cmdf || i) {
                s = e.cst;
                var u = e.g.c;
                for(r = s.length, a = 0; a < r; a += 1)(n = s[a]).setAttribute("offset", u[4 * a] + "%"), n.setAttribute("stop-color", "rgb(" + u[4 * a + 1] + "," + u[4 * a + 2] + "," + u[4 * a + 3] + ")");
            }
            if (l && (e.g._omdf || i)) {
                var g = e.g.o;
                for(r = (s = e.g._collapsable ? e.cst : e.ost).length, a = 0; a < r; a += 1)n = s[a], e.g._collapsable || n.setAttribute("offset", g[2 * a] + "%"), n.setAttribute("stop-opacity", g[2 * a + 1]);
            }
            if (1 === t.t) (e.e._mdf || i) && (h.setAttribute("x2", f[0]), h.setAttribute("y2", f[1]), l && !e.g._collapsable && (e.of.setAttribute("x2", f[0]), e.of.setAttribute("y2", f[1])));
            else if ((e.s._mdf || e.e._mdf || i) && (o = Math.sqrt(Math.pow(p[0] - f[0], 2) + Math.pow(p[1] - f[1], 2)), h.setAttribute("r", o), l && !e.g._collapsable && e.of.setAttribute("r", o)), e.s._mdf || e.e._mdf || e.h._mdf || e.a._mdf || i) {
                o || (o = Math.sqrt(Math.pow(p[0] - f[0], 2) + Math.pow(p[1] - f[1], 2)));
                var y = Math.atan2(f[1] - p[1], f[0] - p[0]), v = e.h.v;
                v >= 1 ? v = .99 : v <= -1 && (v = -0.99);
                var b = o * v, _ = Math.cos(y + e.a.v) * b + p[0], k = Math.sin(y + e.a.v) * b + p[1];
                h.setAttribute("fx", _), h.setAttribute("fy", k), l && !e.g._collapsable && (e.of.setAttribute("fx", _), e.of.setAttribute("fy", k));
            }
        }
        function h(t, e, i) {
            var s = e.style, a = e.d;
            a && (a._mdf || i) && a.dashStr && (s.pElem.setAttribute("stroke-dasharray", a.dashStr), s.pElem.setAttribute("stroke-dashoffset", a.dashoffset[0])), e.c && (e.c._mdf || i) && s.pElem.setAttribute("stroke", "rgb(" + v(e.c.v[0]) + "," + v(e.c.v[1]) + "," + v(e.c.v[2]) + ")"), (e.o._mdf || i) && s.pElem.setAttribute("stroke-opacity", e.o.v), (e.w._mdf || i) && (s.pElem.setAttribute("stroke-width", e.w.v), s.msElem && s.msElem.setAttribute("stroke-width", e.w.v));
        }
        return {
            createRenderFunction: function(t) {
                switch(t.ty){
                    case "fl":
                        return r;
                    case "gf":
                        return o;
                    case "gs":
                        return n;
                    case "st":
                        return h;
                    case "sh":
                    case "el":
                    case "rc":
                    case "sr":
                        return a;
                    case "tr":
                        return i;
                    case "no":
                        return s;
                    default:
                        return null;
                }
            }
        };
    }();
    function yi(t, e, i) {
        this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.initElement(t, e, i), this.prevViewData = [];
    }
    function vi(t, e, i, s, a, r) {
        this.o = t, this.sw = e, this.sc = i, this.fc = s, this.m = a, this.p = r, this._mdf = {
            o: !0,
            sw: !!e,
            sc: !!i,
            fc: !!s,
            m: !0,
            p: !0
        };
    }
    function bi(t, e) {
        this._frameId = i, this.pv = "", this.v = "", this.kf = !1, this._isFirstFrame = !0, this._mdf = !1, e.d && e.d.sid && (e.d = t.globalData.slotManager.getProp(e.d)), this.data = e, this.elem = t, this.comp = this.elem.comp, this.keysIndex = 0, this.canResize = !1, this.minimumFontSize = 1, this.effectsSequence = [], this.currentData = {
            ascent: 0,
            boxWidth: this.defaultBoxWidth,
            f: "",
            fStyle: "",
            fWeight: "",
            fc: "",
            j: "",
            justifyOffset: "",
            l: [],
            lh: 0,
            lineWidths: [],
            ls: "",
            of: "",
            s: "",
            sc: "",
            sw: 0,
            t: 0,
            tr: 0,
            sz: 0,
            ps: null,
            fillColorAnim: !1,
            strokeColorAnim: !1,
            strokeWidthAnim: !1,
            yOffset: 0,
            finalSize: 0,
            finalText: [],
            finalLineHeight: 0,
            __complete: !1
        }, this.copyData(this.currentData, this.data.d.k[0].s), this.searchProperty() || this.completeTextData(this.currentData);
    }
    r([
        ze,
        We,
        Ue,
        ei,
        Ze,
        Oe,
        Qe
    ], yi), yi.prototype.initSecondaryElement = function() {}, yi.prototype.identityMatrix = new Ft, yi.prototype.buildExpressionInterface = function() {}, yi.prototype.createContent = function() {
        this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes();
    }, yi.prototype.filterUniqueShapes = function() {
        var t, e, i, s, a = this.shapes.length, r = this.stylesList.length, n = [], o = !1;
        for(i = 0; i < r; i += 1){
            for(s = this.stylesList[i], o = !1, n.length = 0, t = 0; t < a; t += 1)-1 !== (e = this.shapes[t]).styles.indexOf(s) && (n.push(e), o = e._isAnimated || o);
            n.length > 1 && o && this.setShapesAsAnimated(n);
        }
    }, yi.prototype.setShapesAsAnimated = function(t) {
        var e, i = t.length;
        for(e = 0; e < i; e += 1)t[e].setAsAnimated();
    }, yi.prototype.createStyleElement = function(t, e) {
        var i, a = new ri(t, e), r = a.pElem;
        if ("st" === t.ty) i = new oi(this, t, a);
        else if ("fl" === t.ty) i = new hi(this, t, a);
        else if ("gf" === t.ty || "gs" === t.ty) i = new ("gf" === t.ty ? fi : di)(this, t, a), this.globalData.defs.appendChild(i.gf), i.maskId && (this.globalData.defs.appendChild(i.ms), this.globalData.defs.appendChild(i.of), r.setAttribute("mask", "url(" + s() + "#" + i.maskId + ")"));
        else "no" === t.ty && (i = new li(this, t, a));
        return "st" !== t.ty && "gs" !== t.ty || (r.setAttribute("stroke-linecap", ii[t.lc || 2]), r.setAttribute("stroke-linejoin", si[t.lj || 2]), r.setAttribute("fill-opacity", "0"), 1 === t.lj && r.setAttribute("stroke-miterlimit", t.ml)), 2 === t.r && r.setAttribute("fill-rule", "evenodd"), t.ln && r.setAttribute("id", t.ln), t.cl && r.setAttribute("class", t.cl), t.bm && (r.style["mix-blend-mode"] = we(t.bm)), this.stylesList.push(a), this.addToAnimatedContents(t, i), i;
    }, yi.prototype.createGroupElement = function(t) {
        var e = new mi;
        return t.ln && e.gr.setAttribute("id", t.ln), t.cl && e.gr.setAttribute("class", t.cl), t.bm && (e.gr.style["mix-blend-mode"] = we(t.bm)), e;
    }, yi.prototype.createTransformElement = function(t, e) {
        var i = Xt.getTransformProperty(this, t, this), s = new ci(i, i.o, e);
        return this.addToAnimatedContents(t, s), s;
    }, yi.prototype.createShapeElement = function(t, e, i) {
        var s = 4;
        "rc" === t.ty ? s = 5 : "el" === t.ty ? s = 6 : "sr" === t.ty && (s = 7);
        var a = new ai(e, i, Tt.getShapeProp(this, t, s, this));
        return this.shapes.push(a), this.addShapeToModifiers(a), this.addToAnimatedContents(t, a), a;
    }, yi.prototype.addToAnimatedContents = function(t, e) {
        for(var i = 0, s = this.animatedContents.length; i < s;){
            if (this.animatedContents[i].element === e) return;
            i += 1;
        }
        this.animatedContents.push({
            fn: gi.createRenderFunction(t),
            element: e,
            data: t
        });
    }, yi.prototype.setElementStyles = function(t) {
        var e, i = t.styles, s = this.stylesList.length;
        for(e = 0; e < s; e += 1)-1 !== i.indexOf(this.stylesList[e]) || this.stylesList[e].closed || i.push(this.stylesList[e]);
    }, yi.prototype.reloadShapes = function() {
        var t;
        this._isFirstFrame = !0;
        var e = this.itemsData.length;
        for(t = 0; t < e; t += 1)this.prevViewData[t] = this.itemsData[t];
        for(this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes(), e = this.dynamicProperties.length, t = 0; t < e; t += 1)this.dynamicProperties[t].getValue();
        this.renderModifiers();
    }, yi.prototype.searchShapes = function(t, e, i, s, a, r, n) {
        var o, h, l, p, f, d, m = [].concat(r), c = t.length - 1, u = [], g = [];
        for(o = c; o >= 0; o -= 1){
            if ((d = this.searchProcessedElement(t[o])) ? e[o] = i[d - 1] : t[o]._render = n, "fl" === t[o].ty || "st" === t[o].ty || "gf" === t[o].ty || "gs" === t[o].ty || "no" === t[o].ty) d ? e[o].style.closed = t[o].hd : e[o] = this.createStyleElement(t[o], a), t[o]._render && e[o].style.pElem.parentNode !== s && s.appendChild(e[o].style.pElem), u.push(e[o].style);
            else if ("gr" === t[o].ty) {
                if (d) for(l = e[o].it.length, h = 0; h < l; h += 1)e[o].prevViewData[h] = e[o].it[h];
                else e[o] = this.createGroupElement(t[o]);
                this.searchShapes(t[o].it, e[o].it, e[o].prevViewData, e[o].gr, a + 1, m, n), t[o]._render && e[o].gr.parentNode !== s && s.appendChild(e[o].gr);
            } else "tr" === t[o].ty ? (d || (e[o] = this.createTransformElement(t[o], s)), p = e[o].transform, m.push(p)) : "sh" === t[o].ty || "rc" === t[o].ty || "el" === t[o].ty || "sr" === t[o].ty ? (d || (e[o] = this.createShapeElement(t[o], m, a)), this.setElementStyles(e[o])) : "tm" === t[o].ty || "rd" === t[o].ty || "ms" === t[o].ty || "pb" === t[o].ty || "zz" === t[o].ty || "op" === t[o].ty ? (d ? (f = e[o]).closed = !1 : ((f = Bt.getModifier(t[o].ty)).init(this, t[o]), e[o] = f, this.shapeModifiers.push(f)), g.push(f)) : "rp" === t[o].ty && (d ? (f = e[o]).closed = !0 : (f = Bt.getModifier(t[o].ty), e[o] = f, f.init(this, t, o, e), this.shapeModifiers.push(f), n = !1), g.push(f));
            this.addProcessedElement(t[o], o + 1);
        }
        for(c = u.length, o = 0; o < c; o += 1)u[o].closed = !0;
        for(c = g.length, o = 0; o < c; o += 1)g[o].closed = !0;
    }, yi.prototype.renderInnerContent = function() {
        var t;
        this.renderModifiers();
        var e = this.stylesList.length;
        for(t = 0; t < e; t += 1)this.stylesList[t].reset();
        for(this.renderShape(), t = 0; t < e; t += 1)(this.stylesList[t]._mdf || this._isFirstFrame) && (this.stylesList[t].msElem && (this.stylesList[t].msElem.setAttribute("d", this.stylesList[t].d), this.stylesList[t].d = "M0 0" + this.stylesList[t].d), this.stylesList[t].pElem.setAttribute("d", this.stylesList[t].d || "M0 0"));
    }, yi.prototype.renderShape = function() {
        var t, e, i = this.animatedContents.length;
        for(t = 0; t < i; t += 1)e = this.animatedContents[t], (this._isFirstFrame || e.element._isAnimated) && !0 !== e.data && e.fn(e.data, e.element, this._isFirstFrame);
    }, yi.prototype.destroy = function() {
        this.destroyBaseElement(), this.shapesData = null, this.itemsData = null;
    }, vi.prototype.update = function(t, e, i, s, a, r) {
        this._mdf.o = !1, this._mdf.sw = !1, this._mdf.sc = !1, this._mdf.fc = !1, this._mdf.m = !1, this._mdf.p = !1;
        var n = !1;
        return this.o !== t && (this.o = t, this._mdf.o = !0, n = !0), this.sw !== e && (this.sw = e, this._mdf.sw = !0, n = !0), this.sc !== i && (this.sc = i, this._mdf.sc = !0, n = !0), this.fc !== s && (this.fc = s, this._mdf.fc = !0, n = !0), this.m !== a && (this.m = a, this._mdf.m = !0, n = !0), !r.length || this.p[0] === r[0] && this.p[1] === r[1] && this.p[4] === r[4] && this.p[5] === r[5] && this.p[12] === r[12] && this.p[13] === r[13] || (this.p = r, this._mdf.p = !0, n = !0), n;
    }, bi.prototype.defaultBoxWidth = [
        0,
        0
    ], bi.prototype.copyData = function(t, e) {
        for(var i in e)Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
        return t;
    }, bi.prototype.setCurrentData = function(t) {
        t.__complete || this.completeTextData(t), this.currentData = t, this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth, this._mdf = !0;
    }, bi.prototype.searchProperty = function() {
        return this.searchKeyframes();
    }, bi.prototype.searchKeyframes = function() {
        return this.kf = this.data.d.k.length > 1, this.kf && this.addEffect(this.getKeyframeValue.bind(this)), this.kf;
    }, bi.prototype.addEffect = function(t) {
        this.effectsSequence.push(t), this.elem.addDynamicProperty(this);
    }, bi.prototype.getValue = function(t) {
        if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length || t) {
            this.currentData.t = this.data.d.k[this.keysIndex].s.t;
            var e = this.currentData, i = this.keysIndex;
            if (this.lock) this.setCurrentData(this.currentData);
            else {
                var s;
                this.lock = !0, this._mdf = !1;
                var a = this.effectsSequence.length, r = t || this.data.d.k[this.keysIndex].s;
                for(s = 0; s < a; s += 1)r = i !== this.keysIndex ? this.effectsSequence[s](r, r.t) : this.effectsSequence[s](this.currentData, r.t);
                e !== r && this.setCurrentData(r), this.v = this.currentData, this.pv = this.v, this.lock = !1, this.frameId = this.elem.globalData.frameId;
            }
        }
    }, bi.prototype.getKeyframeValue = function() {
        for(var t = this.data.d.k, e = this.elem.comp.renderedFrame, i = 0, s = t.length; i <= s - 1 && !(i === s - 1 || t[i + 1].t > e);)i += 1;
        return this.keysIndex !== i && (this.keysIndex = i), this.data.d.k[this.keysIndex].s;
    }, bi.prototype.buildFinalText = function(t) {
        for(var e, i, s = [], a = 0, r = t.length, n = !1, o = !1, h = ""; a < r;)n = o, o = !1, e = t.charCodeAt(a), h = t.charAt(a), Pe.isCombinedCharacter(e) ? n = !0 : e >= 55296 && e <= 56319 ? Pe.isRegionalFlag(t, a) ? h = t.substr(a, 14) : (i = t.charCodeAt(a + 1)) >= 56320 && i <= 57343 && (Pe.isModifier(e, i) ? (h = t.substr(a, 2), n = !0) : h = Pe.isFlagEmoji(t.substr(a, 4)) ? t.substr(a, 4) : t.substr(a, 2)) : e > 56319 ? (i = t.charCodeAt(a + 1), Pe.isVariationSelector(e) && (n = !0)) : Pe.isZeroWidthJoiner(e) && (n = !0, o = !0), n ? (s[s.length - 1] += h, n = !1) : s.push(h), a += h.length;
        return s;
    }, bi.prototype.completeTextData = function(t) {
        t.__complete = !0;
        var e, i, s, a, r, n, o, h = this.elem.globalData.fontManager, l = this.data, p = [], f = 0, d = l.m.g, m = 0, c = 0, u = 0, g = [], y = 0, v = 0, b = h.getFontByName(t.f), _ = 0, k = ke(b);
        t.fWeight = k.weight, t.fStyle = k.style, t.finalSize = t.s, t.finalText = this.buildFinalText(t.t), i = t.finalText.length, t.finalLineHeight = t.lh;
        var P, A = t.tr / 1e3 * t.finalSize;
        if (t.sz) for(var S, x, w = !0, D = t.sz[0], C = t.sz[1]; w;){
            S = 0, y = 0, i = (x = this.buildFinalText(t.t)).length, A = t.tr / 1e3 * t.finalSize;
            var M = -1;
            for(e = 0; e < i; e += 1)P = x[e].charCodeAt(0), s = !1, " " === x[e] ? M = e : 13 !== P && 3 !== P || (y = 0, s = !0, S += t.finalLineHeight || 1.2 * t.finalSize), h.chars ? (o = h.getCharData(x[e], b.fStyle, b.fFamily), _ = s ? 0 : o.w * t.finalSize / 100) : _ = h.measureText(x[e], t.f, t.finalSize), y + _ > D && " " !== x[e] ? (-1 === M ? i += 1 : e = M, S += t.finalLineHeight || 1.2 * t.finalSize, x.splice(e, M === e ? 1 : 0, "\r"), M = -1, y = 0) : (y += _, y += A);
            S += b.ascent * t.finalSize / 100, this.canResize && t.finalSize > this.minimumFontSize && C < S ? (t.finalSize -= 1, t.finalLineHeight = t.finalSize * t.lh / t.s) : (t.finalText = x, i = t.finalText.length, w = !1);
        }
        y = -A, _ = 0;
        var T, F = 0;
        for(e = 0; e < i; e += 1)if (s = !1, 13 === (P = (T = t.finalText[e]).charCodeAt(0)) || 3 === P ? (F = 0, g.push(y), v = y > v ? y : v, y = -2 * A, a = "", s = !0, u += 1) : a = T, h.chars ? (o = h.getCharData(T, b.fStyle, h.getFontByName(t.f).fFamily), _ = s ? 0 : o.w * t.finalSize / 100) : _ = h.measureText(a, t.f, t.finalSize), " " === T ? F += _ + A : (y += _ + A + F, F = 0), p.push({
            l: _,
            an: _,
            add: m,
            n: s,
            anIndexes: [],
            val: a,
            line: u,
            animatorJustifyOffset: 0
        }), 2 == d) {
            if (m += _, "" === a || " " === a || e === i - 1) {
                for("" !== a && " " !== a || (m -= _); c <= e;)p[c].an = m, p[c].ind = f, p[c].extra = _, c += 1;
                f += 1, m = 0;
            }
        } else if (3 == d) {
            if (m += _, "" === a || e === i - 1) {
                for("" === a && (m -= _); c <= e;)p[c].an = m, p[c].ind = f, p[c].extra = _, c += 1;
                m = 0, f += 1;
            }
        } else p[f].ind = f, p[f].extra = 0, f += 1;
        if (t.l = p, v = y > v ? y : v, g.push(y), t.sz) t.boxWidth = t.sz[0], t.justifyOffset = 0;
        else switch(t.boxWidth = v, t.j){
            case 1:
                t.justifyOffset = -t.boxWidth;
                break;
            case 2:
                t.justifyOffset = -t.boxWidth / 2;
                break;
            default:
                t.justifyOffset = 0;
        }
        t.lineWidths = g;
        var E, I, L, V, R = l.a;
        n = R.length;
        var z = [];
        for(r = 0; r < n; r += 1){
            for((E = R[r]).a.sc && (t.strokeColorAnim = !0), E.a.sw && (t.strokeWidthAnim = !0), (E.a.fc || E.a.fh || E.a.fs || E.a.fb) && (t.fillColorAnim = !0), V = 0, L = E.s.b, e = 0; e < i; e += 1)(I = p[e]).anIndexes[r] = V, (1 == L && "" !== I.val || 2 == L && "" !== I.val && " " !== I.val || 3 == L && (I.n || " " == I.val || e == i - 1) || 4 == L && (I.n || e == i - 1)) && (1 === E.s.rn && z.push(V), V += 1);
            l.a[r].s.totalChars = V;
            var O, N = -1;
            if (1 === E.s.rn) for(e = 0; e < i; e += 1)N != (I = p[e]).anIndexes[r] && (N = I.anIndexes[r], O = z.splice(Math.floor(Math.random() * z.length), 1)[0]), I.anIndexes[r] = O;
        }
        t.yOffset = t.finalLineHeight || 1.2 * t.finalSize, t.ls = t.ls || 0, t.ascent = b.ascent * t.finalSize / 100;
    }, bi.prototype.updateDocumentData = function(t, e) {
        e = void 0 === e ? this.keysIndex : e;
        var i = this.copyData({}, this.data.d.k[e].s);
        i = this.copyData(i, t), this.data.d.k[e].s = i, this.recalculate(e), this.setCurrentData(i), this.elem.addDynamicProperty(this);
    }, bi.prototype.recalculate = function(t) {
        var e = this.data.d.k[t].s;
        e.__complete = !1, this.keysIndex = 0, this._isFirstFrame = !0, this.getValue(e);
    }, bi.prototype.canResizeFont = function(t) {
        this.canResize = t, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
    }, bi.prototype.setMinimumFontSize = function(t) {
        this.minimumFontSize = Math.floor(t) || 1, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
    };
    var _i = function() {
        var t = Math.max, e = Math.min, i = Math.floor;
        function s(t, e) {
            this._currentTextLength = -1, this.k = !1, this.data = e, this.elem = t, this.comp = t.comp, this.finalS = 0, this.finalE = 0, this.initDynamicPropertyContainer(t), this.s = vt.getProp(t, e.s || {
                k: 0
            }, 0, 0, this), this.e = "e" in e ? vt.getProp(t, e.e, 0, 0, this) : {
                v: 100
            }, this.o = vt.getProp(t, e.o || {
                k: 0
            }, 0, 0, this), this.xe = vt.getProp(t, e.xe || {
                k: 0
            }, 0, 0, this), this.ne = vt.getProp(t, e.ne || {
                k: 0
            }, 0, 0, this), this.sm = vt.getProp(t, e.sm || {
                k: 100
            }, 0, 0, this), this.a = vt.getProp(t, e.a, 0, .01, this), this.dynamicProperties.length || this.getValue();
        }
        return s.prototype = {
            getMult: function(s) {
                this._currentTextLength !== this.elem.textProperty.currentData.l.length && this.getValue();
                var a = 0, r = 0, n = 1, o = 1;
                this.ne.v > 0 ? a = this.ne.v / 100 : r = -this.ne.v / 100, this.xe.v > 0 ? n = 1 - this.xe.v / 100 : o = 1 + this.xe.v / 100;
                var h = tt.getBezierEasing(a, r, n, o).get, l = 0, p = this.finalS, f = this.finalE, d = this.data.sh;
                if (2 === d) l = h(l = f === p ? s >= f ? 1 : 0 : t(0, e(.5 / (f - p) + (s - p) / (f - p), 1)));
                else if (3 === d) l = h(l = f === p ? s >= f ? 0 : 1 : 1 - t(0, e(.5 / (f - p) + (s - p) / (f - p), 1)));
                else if (4 === d) f === p ? l = 0 : (l = t(0, e(.5 / (f - p) + (s - p) / (f - p), 1))) < .5 ? l *= 2 : l = 1 - 2 * (l - .5), l = h(l);
                else if (5 === d) {
                    if (f === p) l = 0;
                    else {
                        var m = f - p, c = -m / 2 + (s = e(t(0, s + .5 - p), f - p)), u = m / 2;
                        l = Math.sqrt(1 - c * c / (u * u));
                    }
                    l = h(l);
                } else 6 === d ? (f === p ? l = 0 : (s = e(t(0, s + .5 - p), f - p), l = (1 + Math.cos(Math.PI + 2 * Math.PI * s / (f - p))) / 2), l = h(l)) : (s >= i(p) && (l = t(0, e(s - p < 0 ? e(f, 1) - (p - s) : f - s, 1))), l = h(l));
                if (100 !== this.sm.v) {
                    var g = .01 * this.sm.v;
                    0 === g && (g = 1e-8);
                    var y = .5 - .5 * g;
                    l < y ? l = 0 : (l = (l - y) / g) > 1 && (l = 1);
                }
                return l * this.a.v;
            },
            getValue: function(t) {
                this.iterateDynamicProperties(), this._mdf = t || this._mdf, this._currentTextLength = this.elem.textProperty.currentData.l.length || 0, t && 2 === this.data.r && (this.e.v = this._currentTextLength);
                var e = 2 === this.data.r ? 1 : 100 / this.data.totalChars, i = this.o.v / e, s = this.s.v / e + i, a = this.e.v / e + i;
                if (s > a) {
                    var r = s;
                    s = a, a = r;
                }
                this.finalS = s, this.finalE = a;
            }
        }, r([
            bt
        ], s), {
            getTextSelectorProp: function(t, e, i) {
                return new s(t, e, i);
            }
        };
    }();
    function ki(t, e, i) {
        var s = {
            propType: !1
        }, a = vt.getProp, r = e.a;
        this.a = {
            r: r.r ? a(t, r.r, 0, P, i) : s,
            rx: r.rx ? a(t, r.rx, 0, P, i) : s,
            ry: r.ry ? a(t, r.ry, 0, P, i) : s,
            sk: r.sk ? a(t, r.sk, 0, P, i) : s,
            sa: r.sa ? a(t, r.sa, 0, P, i) : s,
            s: r.s ? a(t, r.s, 1, .01, i) : s,
            a: r.a ? a(t, r.a, 1, 0, i) : s,
            o: r.o ? a(t, r.o, 0, .01, i) : s,
            p: r.p ? a(t, r.p, 1, 0, i) : s,
            sw: r.sw ? a(t, r.sw, 0, 0, i) : s,
            sc: r.sc ? a(t, r.sc, 1, 0, i) : s,
            fc: r.fc ? a(t, r.fc, 1, 0, i) : s,
            fh: r.fh ? a(t, r.fh, 0, 0, i) : s,
            fs: r.fs ? a(t, r.fs, 0, .01, i) : s,
            fb: r.fb ? a(t, r.fb, 0, .01, i) : s,
            t: r.t ? a(t, r.t, 0, 0, i) : s
        }, this.s = _i.getTextSelectorProp(t, e.s, i), this.s.t = e.s.t;
    }
    function Pi(t, e, i) {
        this._isFirstFrame = !0, this._hasMaskedPath = !1, this._frameId = -1, this._textData = t, this._renderType = e, this._elem = i, this._animatorsData = l(this._textData.a.length), this._pathData = {}, this._moreOptions = {
            alignment: {}
        }, this.renderedLetters = [], this.lettersChangedFlag = !1, this.initDynamicPropertyContainer(i);
    }
    function Ai() {}
    Pi.prototype.searchProperties = function() {
        var t, e, i = this._textData.a.length, s = vt.getProp;
        for(t = 0; t < i; t += 1)e = this._textData.a[t], this._animatorsData[t] = new ki(this._elem, e, this);
        this._textData.p && "m" in this._textData.p ? (this._pathData = {
            a: s(this._elem, this._textData.p.a, 0, 0, this),
            f: s(this._elem, this._textData.p.f, 0, 0, this),
            l: s(this._elem, this._textData.p.l, 0, 0, this),
            r: s(this._elem, this._textData.p.r, 0, 0, this),
            p: s(this._elem, this._textData.p.p, 0, 0, this),
            m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
        }, this._hasMaskedPath = !0) : this._hasMaskedPath = !1, this._moreOptions.alignment = s(this._elem, this._textData.m.a, 1, 0, this);
    }, Pi.prototype.getMeasures = function(t, e) {
        if (this.lettersChangedFlag = e, this._mdf || this._isFirstFrame || e || this._hasMaskedPath && this._pathData.m._mdf) {
            this._isFirstFrame = !1;
            var i, s, a, r, n, o, h, l, p, f, d, m, c, u, g, y, v, b, _, k = this._moreOptions.alignment.v, P = this._animatorsData, A = this._textData, S = this.mHelper, x = this._renderType, w = this.renderedLetters.length, D = t.l;
            if (this._hasMaskedPath) {
                if (_ = this._pathData.m, !this._pathData.n || this._pathData._mdf) {
                    var C, M = _.v;
                    for(this._pathData.r.v && (M = M.reverse()), n = {
                        tLength: 0,
                        segments: []
                    }, r = M._length - 1, y = 0, a = 0; a < r; a += 1)C = rt.buildBezierData(M.v[a], M.v[a + 1], [
                        M.o[a][0] - M.v[a][0],
                        M.o[a][1] - M.v[a][1]
                    ], [
                        M.i[a + 1][0] - M.v[a + 1][0],
                        M.i[a + 1][1] - M.v[a + 1][1]
                    ]), n.tLength += C.segmentLength, n.segments.push(C), y += C.segmentLength;
                    a = r, _.v.c && (C = rt.buildBezierData(M.v[a], M.v[0], [
                        M.o[a][0] - M.v[a][0],
                        M.o[a][1] - M.v[a][1]
                    ], [
                        M.i[0][0] - M.v[0][0],
                        M.i[0][1] - M.v[0][1]
                    ]), n.tLength += C.segmentLength, n.segments.push(C), y += C.segmentLength), this._pathData.pi = n;
                }
                if (n = this._pathData.pi, o = this._pathData.f.v, d = 0, f = 1, l = 0, p = !0, u = n.segments, o < 0 && _.v.c) for(n.tLength < Math.abs(o) && (o = -Math.abs(o) % n.tLength), f = (c = u[d = u.length - 1].points).length - 1; o < 0;)o += c[f].partialLength, (f -= 1) < 0 && (f = (c = u[d -= 1].points).length - 1);
                m = (c = u[d].points)[f - 1], g = (h = c[f]).partialLength;
            }
            r = D.length, i = 0, s = 0;
            var T, F, E, I, L, V = 1.2 * t.finalSize * .714, N = !0;
            E = P.length;
            var B, q, j, W, X, H, Y, G, K, J, U, Z, Q = -1, $ = o, tt = d, et = f, it = -1, st = "", at = this.defaultPropsArray;
            if (2 === t.j || 1 === t.j) {
                var nt = 0, ot = 0, ht = 2 === t.j ? -0.5 : -1, lt = 0, pt = !0;
                for(a = 0; a < r; a += 1)if (D[a].n) {
                    for(nt && (nt += ot); lt < a;)D[lt].animatorJustifyOffset = nt, lt += 1;
                    nt = 0, pt = !0;
                } else {
                    for(F = 0; F < E; F += 1)(T = P[F].a).t.propType && (pt && 2 === t.j && (ot += T.t.v * ht), (L = P[F].s.getMult(D[a].anIndexes[F], A.a[F].s.totalChars)).length ? nt += T.t.v * L[0] * ht : nt += T.t.v * L * ht);
                    pt = !1;
                }
                for(nt && (nt += ot); lt < a;)D[lt].animatorJustifyOffset = nt, lt += 1;
            }
            for(a = 0; a < r; a += 1){
                if (S.reset(), W = 1, D[a].n) i = 0, s += t.yOffset, s += N ? 1 : 0, o = $, N = !1, this._hasMaskedPath && (f = et, m = (c = u[d = tt].points)[f - 1], g = (h = c[f]).partialLength, l = 0), st = "", U = "", K = "", Z = "", at = this.defaultPropsArray;
                else {
                    if (this._hasMaskedPath) {
                        if (it !== D[a].line) {
                            switch(t.j){
                                case 1:
                                    o += y - t.lineWidths[D[a].line];
                                    break;
                                case 2:
                                    o += (y - t.lineWidths[D[a].line]) / 2;
                            }
                            it = D[a].line;
                        }
                        Q !== D[a].ind && (D[Q] && (o += D[Q].extra), o += D[a].an / 2, Q = D[a].ind), o += k[0] * D[a].an * .005;
                        var ft = 0;
                        for(F = 0; F < E; F += 1)(T = P[F].a).p.propType && ((L = P[F].s.getMult(D[a].anIndexes[F], A.a[F].s.totalChars)).length ? ft += T.p.v[0] * L[0] : ft += T.p.v[0] * L), T.a.propType && ((L = P[F].s.getMult(D[a].anIndexes[F], A.a[F].s.totalChars)).length ? ft += T.a.v[0] * L[0] : ft += T.a.v[0] * L);
                        for(p = !0, this._pathData.a.v && (o = .5 * D[0].an + (y - this._pathData.f.v - .5 * D[0].an - .5 * D[D.length - 1].an) * Q / (r - 1), o += this._pathData.f.v); p;)l + g >= o + ft || !c ? (v = (o + ft - l) / h.partialLength, q = m.point[0] + (h.point[0] - m.point[0]) * v, j = m.point[1] + (h.point[1] - m.point[1]) * v, S.translate(-k[0] * D[a].an * .005, -k[1] * V * .01), p = !1) : c && (l += h.partialLength, (f += 1) >= c.length && (f = 0, u[d += 1] ? c = u[d].points : _.v.c ? (f = 0, c = u[d = 0].points) : (l -= h.partialLength, c = null)), c && (m = h, g = (h = c[f]).partialLength));
                        B = D[a].an / 2 - D[a].add, S.translate(-B, 0, 0);
                    } else B = D[a].an / 2 - D[a].add, S.translate(-B, 0, 0), S.translate(-k[0] * D[a].an * .005, -k[1] * V * .01, 0);
                    for(F = 0; F < E; F += 1)(T = P[F].a).t.propType && (L = P[F].s.getMult(D[a].anIndexes[F], A.a[F].s.totalChars), 0 === i && 0 === t.j || (this._hasMaskedPath ? L.length ? o += T.t.v * L[0] : o += T.t.v * L : L.length ? i += T.t.v * L[0] : i += T.t.v * L));
                    for(t.strokeWidthAnim && (H = t.sw || 0), t.strokeColorAnim && (X = t.sc ? [
                        t.sc[0],
                        t.sc[1],
                        t.sc[2]
                    ] : [
                        0,
                        0,
                        0
                    ]), t.fillColorAnim && t.fc && (Y = [
                        t.fc[0],
                        t.fc[1],
                        t.fc[2]
                    ]), F = 0; F < E; F += 1)(T = P[F].a).a.propType && ((L = P[F].s.getMult(D[a].anIndexes[F], A.a[F].s.totalChars)).length ? S.translate(-T.a.v[0] * L[0], -T.a.v[1] * L[1], T.a.v[2] * L[2]) : S.translate(-T.a.v[0] * L, -T.a.v[1] * L, T.a.v[2] * L));
                    for(F = 0; F < E; F += 1)(T = P[F].a).s.propType && ((L = P[F].s.getMult(D[a].anIndexes[F], A.a[F].s.totalChars)).length ? S.scale(1 + (T.s.v[0] - 1) * L[0], 1 + (T.s.v[1] - 1) * L[1], 1) : S.scale(1 + (T.s.v[0] - 1) * L, 1 + (T.s.v[1] - 1) * L, 1));
                    for(F = 0; F < E; F += 1){
                        if (T = P[F].a, L = P[F].s.getMult(D[a].anIndexes[F], A.a[F].s.totalChars), T.sk.propType && (L.length ? S.skewFromAxis(-T.sk.v * L[0], T.sa.v * L[1]) : S.skewFromAxis(-T.sk.v * L, T.sa.v * L)), T.r.propType && (L.length ? S.rotateZ(-T.r.v * L[2]) : S.rotateZ(-T.r.v * L)), T.ry.propType && (L.length ? S.rotateY(T.ry.v * L[1]) : S.rotateY(T.ry.v * L)), T.rx.propType && (L.length ? S.rotateX(T.rx.v * L[0]) : S.rotateX(T.rx.v * L)), T.o.propType && (L.length ? W += (T.o.v * L[0] - W) * L[0] : W += (T.o.v * L - W) * L), t.strokeWidthAnim && T.sw.propType && (L.length ? H += T.sw.v * L[0] : H += T.sw.v * L), t.strokeColorAnim && T.sc.propType) for(G = 0; G < 3; G += 1)L.length ? X[G] += (T.sc.v[G] - X[G]) * L[0] : X[G] += (T.sc.v[G] - X[G]) * L;
                        if (t.fillColorAnim && t.fc) {
                            if (T.fc.propType) for(G = 0; G < 3; G += 1)L.length ? Y[G] += (T.fc.v[G] - Y[G]) * L[0] : Y[G] += (T.fc.v[G] - Y[G]) * L;
                            T.fh.propType && (Y = L.length ? O(Y, T.fh.v * L[0]) : O(Y, T.fh.v * L)), T.fs.propType && (Y = L.length ? R(Y, T.fs.v * L[0]) : R(Y, T.fs.v * L)), T.fb.propType && (Y = L.length ? z(Y, T.fb.v * L[0]) : z(Y, T.fb.v * L));
                        }
                    }
                    for(F = 0; F < E; F += 1)(T = P[F].a).p.propType && (L = P[F].s.getMult(D[a].anIndexes[F], A.a[F].s.totalChars), this._hasMaskedPath ? L.length ? S.translate(0, T.p.v[1] * L[0], -T.p.v[2] * L[1]) : S.translate(0, T.p.v[1] * L, -T.p.v[2] * L) : L.length ? S.translate(T.p.v[0] * L[0], T.p.v[1] * L[1], -T.p.v[2] * L[2]) : S.translate(T.p.v[0] * L, T.p.v[1] * L, -T.p.v[2] * L));
                    if (t.strokeWidthAnim && (K = H < 0 ? 0 : H), t.strokeColorAnim && (J = "rgb(" + Math.round(255 * X[0]) + "," + Math.round(255 * X[1]) + "," + Math.round(255 * X[2]) + ")"), t.fillColorAnim && t.fc && (U = "rgb(" + Math.round(255 * Y[0]) + "," + Math.round(255 * Y[1]) + "," + Math.round(255 * Y[2]) + ")"), this._hasMaskedPath) {
                        if (S.translate(0, -t.ls), S.translate(0, k[1] * V * .01 + s, 0), this._pathData.p.v) {
                            b = (h.point[1] - m.point[1]) / (h.point[0] - m.point[0]);
                            var dt = 180 * Math.atan(b) / Math.PI;
                            h.point[0] < m.point[0] && (dt += 180), S.rotate(-dt * Math.PI / 180);
                        }
                        S.translate(q, j, 0), o -= k[0] * D[a].an * .005, D[a + 1] && Q !== D[a + 1].ind && (o += D[a].an / 2, o += .001 * t.tr * t.finalSize);
                    } else {
                        switch(S.translate(i, s, 0), t.ps && S.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j){
                            case 1:
                                S.translate(D[a].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[D[a].line]), 0, 0);
                                break;
                            case 2:
                                S.translate(D[a].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[D[a].line]) / 2, 0, 0);
                        }
                        S.translate(0, -t.ls), S.translate(B, 0, 0), S.translate(k[0] * D[a].an * .005, k[1] * V * .01, 0), i += D[a].l + .001 * t.tr * t.finalSize;
                    }
                    "html" === x ? st = S.toCSS() : "svg" === x ? st = S.to2dCSS() : at = [
                        S.props[0],
                        S.props[1],
                        S.props[2],
                        S.props[3],
                        S.props[4],
                        S.props[5],
                        S.props[6],
                        S.props[7],
                        S.props[8],
                        S.props[9],
                        S.props[10],
                        S.props[11],
                        S.props[12],
                        S.props[13],
                        S.props[14],
                        S.props[15]
                    ], Z = W;
                }
                w <= a ? (I = new vi(Z, K, J, U, st, at), this.renderedLetters.push(I), w += 1, this.lettersChangedFlag = !0) : (I = this.renderedLetters[a], this.lettersChangedFlag = I.update(Z, K, J, U, st, at) || this.lettersChangedFlag);
            }
        }
    }, Pi.prototype.getValue = function() {
        this._elem.globalData.frameId !== this._frameId && (this._frameId = this._elem.globalData.frameId, this.iterateDynamicProperties());
    }, Pi.prototype.mHelper = new Ft, Pi.prototype.defaultPropsArray = [], r([
        bt
    ], Pi), Ai.prototype.initElement = function(t, e, i) {
        this.lettersChangedFlag = !0, this.initFrame(), this.initBaseData(t, e, i), this.textProperty = new bi(this, t.t, this.dynamicProperties), this.textAnimator = new Pi(t.t, this.renderType, this), this.initTransform(t, e, i), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide(), this.textAnimator.searchProperties(this.dynamicProperties);
    }, Ai.prototype.prepareFrame = function(t) {
        this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange);
    }, Ai.prototype.createPathShape = function(t, e) {
        var i, s, a = e.length, r = "";
        for(i = 0; i < a; i += 1)"sh" === e[i].ty && (s = e[i].ks.k, r += ui(s, s.i.length, !0, t));
        return r;
    }, Ai.prototype.updateDocumentData = function(t, e) {
        this.textProperty.updateDocumentData(t, e);
    }, Ai.prototype.canResizeFont = function(t) {
        this.textProperty.canResizeFont(t);
    }, Ai.prototype.setMinimumFontSize = function(t) {
        this.textProperty.setMinimumFontSize(t);
    }, Ai.prototype.applyTextPropertiesToMatrix = function(t, e, i, s, a) {
        switch(t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0), e.translate(0, -t.ls, 0), t.j){
            case 1:
                e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]), 0, 0);
                break;
            case 2:
                e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]) / 2, 0, 0);
        }
        e.translate(s, a, 0);
    }, Ai.prototype.buildColor = function(t) {
        return "rgb(" + Math.round(255 * t[0]) + "," + Math.round(255 * t[1]) + "," + Math.round(255 * t[2]) + ")";
    }, Ai.prototype.emptyProp = new vi, Ai.prototype.destroy = function() {}, Ai.prototype.validateText = function() {
        (this.textProperty._mdf || this.textProperty._isFirstFrame) && (this.buildNewText(), this.textProperty._isFirstFrame = !1, this.textProperty._mdf = !1);
    };
    var Si, xi = {
        shapes: []
    };
    function wi(t, e, i) {
        this.textSpans = [], this.renderType = "svg", this.initElement(t, e, i);
    }
    function Di(t, e, i) {
        this.initElement(t, e, i);
    }
    function Ci(t, e, i) {
        this.initFrame(), this.initBaseData(t, e, i), this.initFrame(), this.initTransform(t, e, i), this.initHierarchy();
    }
    function Mi() {}
    function Ti() {}
    function Fi(t, e, i) {
        this.layers = t.layers, this.supports3d = !0, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? l(this.layers.length) : [], this.initElement(t, e, i), this.tm = t.tm ? vt.getProp(this, t.tm, 0, e.frameRate, this) : {
            _placeholder: !0
        };
    }
    function Ei(t, e) {
        this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.svgElement = W("svg");
        var i = "";
        if (e && e.title) {
            var s = W("title"), a = I();
            s.setAttribute("id", a), s.textContent = e.title, this.svgElement.appendChild(s), i += a;
        }
        if (e && e.description) {
            var r = W("desc"), n = I();
            r.setAttribute("id", n), r.textContent = e.description, this.svgElement.appendChild(r), i += " " + n;
        }
        i && this.svgElement.setAttribute("aria-labelledby", i);
        var o = W("defs");
        this.svgElement.appendChild(o);
        var h = W("g");
        this.svgElement.appendChild(h), this.layerElement = h, this.renderConfig = {
            preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet",
            imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice",
            contentVisibility: e && e.contentVisibility || "visible",
            progressiveLoad: e && e.progressiveLoad || !1,
            hideOnTransparent: !(e && !1 === e.hideOnTransparent),
            viewBoxOnly: e && e.viewBoxOnly || !1,
            viewBoxSize: e && e.viewBoxSize || !1,
            className: e && e.className || "",
            id: e && e.id || "",
            focusable: e && e.focusable,
            filterSize: {
                width: e && e.filterSize && e.filterSize.width || "100%",
                height: e && e.filterSize && e.filterSize.height || "100%",
                x: e && e.filterSize && e.filterSize.x || "0%",
                y: e && e.filterSize && e.filterSize.y || "0%"
            },
            width: e && e.width,
            height: e && e.height,
            runExpressions: !e || void 0 === e.runExpressions || e.runExpressions
        }, this.globalData = {
            _mdf: !1,
            frameNum: -1,
            defs: o,
            renderConfig: this.renderConfig
        }, this.elements = [], this.pendingElements = [], this.destroyed = !1, this.rendererType = "svg";
    }
    return r([
        ze,
        We,
        Ue,
        Ze,
        Oe,
        Qe,
        Ai
    ], wi), wi.prototype.createContent = function() {
        this.data.singleShape && !this.globalData.fontManager.chars && (this.textContainer = W("text"));
    }, wi.prototype.buildTextContents = function(t) {
        for(var e = 0, i = t.length, s = [], a = ""; e < i;)t[e] === String.fromCharCode(13) || t[e] === String.fromCharCode(3) ? (s.push(a), a = "") : a += t[e], e += 1;
        return s.push(a), s;
    }, wi.prototype.buildShapeData = function(t, e) {
        if (t.shapes && t.shapes.length) {
            var i = t.shapes[0];
            if (i.it) {
                var s = i.it[i.it.length - 1];
                s.s && (s.s.k[0] = e, s.s.k[1] = e);
            }
        }
        return t;
    }, wi.prototype.buildNewText = function() {
        var t, e;
        this.addDynamicProperty(this);
        var i = this.textProperty.currentData;
        this.renderedLetters = l(i ? i.l.length : 0), i.fc ? this.layerElement.setAttribute("fill", this.buildColor(i.fc)) : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"), i.sc && (this.layerElement.setAttribute("stroke", this.buildColor(i.sc)), this.layerElement.setAttribute("stroke-width", i.sw)), this.layerElement.setAttribute("font-size", i.finalSize);
        var s = this.globalData.fontManager.getFontByName(i.f);
        if (s.fClass) this.layerElement.setAttribute("class", s.fClass);
        else {
            this.layerElement.setAttribute("font-family", s.fFamily);
            var a = i.fWeight, r = i.fStyle;
            this.layerElement.setAttribute("font-style", r), this.layerElement.setAttribute("font-weight", a);
        }
        this.layerElement.setAttribute("aria-label", i.t);
        var n, o = i.l || [], h = !!this.globalData.fontManager.chars;
        e = o.length;
        var p = this.mHelper, f = this.data.singleShape, d = 0, m = 0, c = !0, u = .001 * i.tr * i.finalSize;
        if (!f || h || i.sz) {
            var g, y = this.textSpans.length;
            for(t = 0; t < e; t += 1){
                if (this.textSpans[t] || (this.textSpans[t] = {
                    span: null,
                    childSpan: null,
                    glyph: null
                }), !h || !f || 0 === t) {
                    if (n = y > t ? this.textSpans[t].span : W(h ? "g" : "text"), y <= t) {
                        if (n.setAttribute("stroke-linecap", "butt"), n.setAttribute("stroke-linejoin", "round"), n.setAttribute("stroke-miterlimit", "4"), this.textSpans[t].span = n, h) {
                            var v = W("g");
                            n.appendChild(v), this.textSpans[t].childSpan = v;
                        }
                        this.textSpans[t].span = n, this.layerElement.appendChild(n);
                    }
                    n.style.display = "inherit";
                }
                if (p.reset(), f && (o[t].n && (d = -u, m += i.yOffset, m += c ? 1 : 0, c = !1), this.applyTextPropertiesToMatrix(i, p, o[t].line, d, m), d += o[t].l || 0, d += u), h) {
                    var b;
                    if (1 === (g = this.globalData.fontManager.getCharData(i.finalText[t], s.fStyle, this.globalData.fontManager.getFontByName(i.f).fFamily)).t) b = new Fi(g.data, this.globalData, this);
                    else {
                        var _ = xi;
                        g.data && g.data.shapes && (_ = this.buildShapeData(g.data, i.finalSize)), b = new yi(_, this.globalData, this);
                    }
                    if (this.textSpans[t].glyph) {
                        var k = this.textSpans[t].glyph;
                        this.textSpans[t].childSpan.removeChild(k.layerElement), k.destroy();
                    }
                    this.textSpans[t].glyph = b, b._debug = !0, b.prepareFrame(0), b.renderFrame(), this.textSpans[t].childSpan.appendChild(b.layerElement), 1 === g.t && this.textSpans[t].childSpan.setAttribute("transform", "scale(" + i.finalSize / 100 + "," + i.finalSize / 100 + ")");
                } else f && n.setAttribute("transform", "translate(" + p.props[12] + "," + p.props[13] + ")"), n.textContent = o[t].val, n.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
            }
            f && n && n.setAttribute("d", "");
        } else {
            var P = this.textContainer, A = "start";
            switch(i.j){
                case 1:
                    A = "end";
                    break;
                case 2:
                    A = "middle";
                    break;
                default:
                    A = "start";
            }
            P.setAttribute("text-anchor", A), P.setAttribute("letter-spacing", u);
            var S = this.buildTextContents(i.finalText);
            for(e = S.length, m = i.ps ? i.ps[1] + i.ascent : 0, t = 0; t < e; t += 1)(n = this.textSpans[t].span || W("tspan")).textContent = S[t], n.setAttribute("x", 0), n.setAttribute("y", m), n.style.display = "inherit", P.appendChild(n), this.textSpans[t] || (this.textSpans[t] = {
                span: null,
                glyph: null
            }), this.textSpans[t].span = n, m += i.finalLineHeight;
            this.layerElement.appendChild(P);
        }
        for(; t < this.textSpans.length;)this.textSpans[t].span.style.display = "none", t += 1;
        this._sizeChanged = !0;
    }, wi.prototype.sourceRectAtTime = function() {
        if (this.prepareFrame(this.comp.renderedFrame - this.data.st), this.renderInnerContent(), this._sizeChanged) {
            this._sizeChanged = !1;
            var t = this.layerElement.getBBox();
            this.bbox = {
                top: t.y,
                left: t.x,
                width: t.width,
                height: t.height
            };
        }
        return this.bbox;
    }, wi.prototype.getValue = function() {
        var t, e, i = this.textSpans.length;
        for(this.renderedFrame = this.comp.renderedFrame, t = 0; t < i; t += 1)(e = this.textSpans[t].glyph) && (e.prepareFrame(this.comp.renderedFrame - this.data.st), e._mdf && (this._mdf = !0));
    }, wi.prototype.renderInnerContent = function() {
        if (this.validateText(), (!this.data.singleShape || this._mdf) && (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)) {
            var t, e;
            this._sizeChanged = !0;
            var i, s, a, r = this.textAnimator.renderedLetters, n = this.textProperty.currentData.l;
            for(e = n.length, t = 0; t < e; t += 1)n[t].n || (i = r[t], s = this.textSpans[t].span, (a = this.textSpans[t].glyph) && a.renderFrame(), i._mdf.m && s.setAttribute("transform", i.m), i._mdf.o && s.setAttribute("opacity", i.o), i._mdf.sw && s.setAttribute("stroke-width", i.sw), i._mdf.sc && s.setAttribute("stroke", i.sc), i._mdf.fc && s.setAttribute("fill", i.fc));
        }
    }, r([
        $e
    ], Di), Di.prototype.createContent = function() {
        var t = W("rect");
        t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.layerElement.appendChild(t);
    }, Ci.prototype.prepareFrame = function(t) {
        this.prepareProperties(t, !0);
    }, Ci.prototype.renderFrame = function() {}, Ci.prototype.getBaseElement = function() {
        return null;
    }, Ci.prototype.destroy = function() {}, Ci.prototype.sourceRectAtTime = function() {}, Ci.prototype.hide = function() {}, r([
        ze,
        We,
        Ze,
        Oe
    ], Ci), r([
        qe
    ], Mi), Mi.prototype.createNull = function(t) {
        return new Ci(t, this.globalData, this);
    }, Mi.prototype.createShape = function(t) {
        return new yi(t, this.globalData, this);
    }, Mi.prototype.createText = function(t) {
        return new wi(t, this.globalData, this);
    }, Mi.prototype.createImage = function(t) {
        return new $e(t, this.globalData, this);
    }, Mi.prototype.createSolid = function(t) {
        return new Di(t, this.globalData, this);
    }, Mi.prototype.configAnimation = function(t) {
        this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), this.renderConfig.viewBoxSize ? this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize) : this.svgElement.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.renderConfig.viewBoxOnly || (this.svgElement.setAttribute("width", t.w), this.svgElement.setAttribute("height", t.h), this.svgElement.style.width = "100%", this.svgElement.style.height = "100%", this.svgElement.style.transform = "translate3d(0,0,0)", this.svgElement.style.contentVisibility = this.renderConfig.contentVisibility), this.renderConfig.width && this.svgElement.setAttribute("width", this.renderConfig.width), this.renderConfig.height && this.svgElement.setAttribute("height", this.renderConfig.height), this.renderConfig.className && this.svgElement.setAttribute("class", this.renderConfig.className), this.renderConfig.id && this.svgElement.setAttribute("id", this.renderConfig.id), void 0 !== this.renderConfig.focusable && this.svgElement.setAttribute("focusable", this.renderConfig.focusable), this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.wrapper.appendChild(this.svgElement);
        var e = this.globalData.defs;
        this.setupGlobalData(t, e), this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.data = t;
        var i = W("clipPath"), a = W("rect");
        a.setAttribute("width", t.w), a.setAttribute("height", t.h), a.setAttribute("x", 0), a.setAttribute("y", 0);
        var r = I();
        i.setAttribute("id", r), i.appendChild(a), this.layerElement.setAttribute("clip-path", "url(" + s() + "#" + r + ")"), e.appendChild(i), this.layers = t.layers, this.elements = l(t.layers.length);
    }, Mi.prototype.destroy = function() {
        var t;
        this.animationItem.wrapper && (this.animationItem.wrapper.innerText = ""), this.layerElement = null, this.globalData.defs = null;
        var e = this.layers ? this.layers.length : 0;
        for(t = 0; t < e; t += 1)this.elements[t] && this.elements[t].destroy && this.elements[t].destroy();
        this.elements.length = 0, this.destroyed = !0, this.animationItem = null;
    }, Mi.prototype.updateContainerSize = function() {}, Mi.prototype.findIndexByInd = function(t) {
        var e = 0, i = this.layers.length;
        for(e = 0; e < i; e += 1)if (this.layers[e].ind === t) return e;
        return -1;
    }, Mi.prototype.buildItem = function(t) {
        var e = this.elements;
        if (!e[t] && 99 !== this.layers[t].ty) {
            e[t] = !0;
            var i = this.createItem(this.layers[t]);
            if (e[t] = i, N() && (0 === this.layers[t].ty && this.globalData.projectInterface.registerComposition(i), i.initExpressions()), this.appendElementInPos(i, t), this.layers[t].tt) {
                var s = "tp" in this.layers[t] ? this.findIndexByInd(this.layers[t].tp) : t - 1;
                if (-1 === s) return;
                if (this.elements[s] && !0 !== this.elements[s]) {
                    var a = e[s].getMatte(this.layers[t].tt);
                    i.setMatte(a);
                } else this.buildItem(s), this.addPendingElement(i);
            }
        }
    }, Mi.prototype.checkPendingElements = function() {
        for(; this.pendingElements.length;){
            var t = this.pendingElements.pop();
            if (t.checkParenting(), t.data.tt) for(var e = 0, i = this.elements.length; e < i;){
                if (this.elements[e] === t) {
                    var s = "tp" in t.data ? this.findIndexByInd(t.data.tp) : e - 1, a = this.elements[s].getMatte(this.layers[e].tt);
                    t.setMatte(a);
                    break;
                }
                e += 1;
            }
        }
    }, Mi.prototype.renderFrame = function(t) {
        if (this.renderedFrame !== t && !this.destroyed) {
            var e;
            null === t ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = t, this.globalData._mdf = !1;
            var i = this.layers.length;
            for(this.completeLayers || this.checkLayers(t), e = i - 1; e >= 0; e -= 1)(this.completeLayers || this.elements[e]) && this.elements[e].prepareFrame(t - this.layers[e].st);
            if (this.globalData._mdf) for(e = 0; e < i; e += 1)(this.completeLayers || this.elements[e]) && this.elements[e].renderFrame();
        }
    }, Mi.prototype.appendElementInPos = function(t, e) {
        var i = t.getBaseElement();
        if (i) {
            for(var s, a = 0; a < e;)this.elements[a] && !0 !== this.elements[a] && this.elements[a].getBaseElement() && (s = this.elements[a].getBaseElement()), a += 1;
            s ? this.layerElement.insertBefore(i, s) : this.layerElement.appendChild(i);
        }
    }, Mi.prototype.hide = function() {
        this.layerElement.style.display = "none";
    }, Mi.prototype.show = function() {
        this.layerElement.style.display = "block";
    }, r([
        ze,
        We,
        Ze,
        Oe,
        Qe
    ], Ti), Ti.prototype.initElement = function(t, e, i) {
        this.initFrame(), this.initBaseData(t, e, i), this.initTransform(t, e, i), this.initRenderable(), this.initHierarchy(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), !this.data.xt && e.progressiveLoad || this.buildAllItems(), this.hide();
    }, Ti.prototype.prepareFrame = function(t) {
        if (this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.isInRange || this.data.xt) {
            if (this.tm._placeholder) this.renderedFrame = t / this.data.sr;
            else {
                var e = this.tm.v;
                e === this.data.op && (e = this.data.op - 1), this.renderedFrame = e;
            }
            var i, s = this.elements.length;
            for(this.completeLayers || this.checkLayers(this.renderedFrame), i = s - 1; i >= 0; i -= 1)(this.completeLayers || this.elements[i]) && (this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st), this.elements[i]._mdf && (this._mdf = !0));
        }
    }, Ti.prototype.renderInnerContent = function() {
        var t, e = this.layers.length;
        for(t = 0; t < e; t += 1)(this.completeLayers || this.elements[t]) && this.elements[t].renderFrame();
    }, Ti.prototype.setElements = function(t) {
        this.elements = t;
    }, Ti.prototype.getElements = function() {
        return this.elements;
    }, Ti.prototype.destroyElements = function() {
        var t, e = this.layers.length;
        for(t = 0; t < e; t += 1)this.elements[t] && this.elements[t].destroy();
    }, Ti.prototype.destroy = function() {
        this.destroyElements(), this.destroyBaseElement();
    }, r([
        Mi,
        Ti,
        Ue
    ], Fi), Fi.prototype.createComp = function(t) {
        return new Fi(t, this.globalData, this);
    }, r([
        Mi
    ], Ei), Ei.prototype.createComp = function(t) {
        return new Fi(t, this.globalData, this);
    }, Si = Ei, U["svg"] = Si, Bt.registerModifier("tm", jt), Bt.registerModifier("pb", Wt), Bt.registerModifier("rp", Ht), Bt.registerModifier("rd", Yt), Bt.registerModifier("zz", le), Bt.registerModifier("op", _e), It;
});

},{}],"8oCsH":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"2oJPK":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>fullscreen);
var _fullScreenJson = require("./icon/fullScreen.json");
var _fullScreenJsonDefault = parcelHelpers.interopDefault(_fullScreenJson);
var _utils = require("./utils");
function fullscreen(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Fullscreen'),
            mounted: ($control)=>{
                const { proxy, i18n, constructor: { utils: { append, isMobile, getIcon, tooltip } } } = art;
                const $fullscreenDom = append($control, getIcon("fullscreen"));
                const fullScreenAnimation = (0, _utils.createAnimation)({
                    name: "fullscreen",
                    dom: $fullscreenDom,
                    json: (0, _fullScreenJsonDefault.default)
                });
                const stopAnimation = ()=>{
                    fullScreenAnimation.stop();
                };
                const playAnimation = ()=>{
                    fullScreenAnimation.play();
                };
                if (isMobile) proxy($control, "touchstart", playAnimation);
                else proxy($control, "mouseenter", playAnimation);
                proxy($control, 'click', ()=>{
                    art.fullscreen = !art.fullscreen;
                });
                fullScreenAnimation.addEventListener("complete", stopAnimation);
                art.on('fullscreen', (state)=>{
                    if (state) tooltip($control, i18n.get('Exit Fullscreen'));
                    else tooltip($control, i18n.get('Fullscreen'));
                });
                art.on("destroy", ()=>{
                    fullScreenAnimation.destroy();
                });
            }
        });
}

},{"./icon/fullScreen.json":"glPQz","./utils":"MbBnn","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"glPQz":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":60,"w":88,"h":88,"nm":"\u5168\u5C4F\u6E10\u53D8","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u4E2D\u5FC3\u5706","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[44,44,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.81,0.81,0.833],"y":[1,1,1]},"o":{"x":[1,1,0.68],"y":[0,0,0]},"t":2,"s":[100,100,100]},{"i":{"x":[0.991,0.991,0.27],"y":[1,1,1]},"o":{"x":[1,1,0.167],"y":[-0.014,-0.014,0]},"t":13,"s":[184,184,100]},{"t":22,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-2.21,0],[-0.11,-2.12],[0,0],[0,0],[2.14,0],[0,2.21]],"o":[[2.14,0],[0,0],[0,0],[-0.11,2.12],[-2.21,0],[0,-2.21]],"v":[[0,-4],[4,-0.2],[4,0],[4,0.2],[0,4],[-4,0]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"\u5DE6\u6247\u5F62","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":6,"s":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":34,"s":[0]},{"t":40,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[23.316,27.897,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-11.8,5.91],[0,0],[0,-4.7],[0,0]],"o":[[0,0],[-3.93,1.97],[0,0],[0,-14.1]],"v":[[4.584,-16.103],[15.314,5.367],[8.684,16.107],[-15.316,16.107]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"\u53F3\u6247\u5F62","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":6,"s":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":34,"s":[0]},{"t":40,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[64.684,27.897,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-14.1],[0,0],[3.93,1.97],[0,0]],"o":[[0,0],[0,-4.7],[0,0],[11.79,5.91]],"v":[[15.314,16.107],[-8.686,16.107],[-15.316,5.367],[-4.576,-16.103]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0},{"ddd":0,"ind":4,"ty":4,"nm":"\u4E0B\u6247\u5F62","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":6,"s":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":34,"s":[0]},{"t":40,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[44,66.323,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-2.15,2.08],[0,0],[7.07,0],[5.56,3.52],[0,0],[-3.23,0]],"o":[[0,0],[-5.56,3.52],[-7.07,0],[0,0],[2.16,2.08],[3.23,0]],"v":[[8.319,-13.677],[19.219,8.123],[-0.001,13.673],[-19.221,8.123],[-8.321,-13.677],[-0.001,-10.327]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0},{"ddd":0,"ind":5,"ty":4,"nm":"\u5DE6\u653E\u5C041","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[30]},{"t":21,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":0,"s":[31.995,35.665,0],"to":[0.208,0.208,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":4,"s":[33.245,36.915,0],"to":[0,0,0],"ti":[0.625,0.625,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":10,"s":[31.995,35.665,0],"to":[-0.625,-0.625,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":21,"s":[29.495,33.165,0],"to":[0,0,0],"ti":[-0.417,-0.417,0]},{"t":29,"s":[31.995,35.665,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,-4.55],[0,0],[-6.32,3.15]],"o":[[-4.07,2.03],[0,0],[0,-7.06],[0,0]],"v":[[6.635,-2.405],[0.005,8.335],[-6.635,8.335],[3.675,-8.335]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-1,"op":300,"st":0,"bm":0},{"ddd":0,"ind":6,"ty":4,"nm":"\u53F3\u653E\u5C041","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[30]},{"t":21,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":0,"s":[55.99,35.665,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":4,"s":[54.74,36.915,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":10,"s":[55.99,35.665,0],"to":[0.417,-0.417,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":21,"s":[58.49,33.165,0],"to":[0,0,0],"ti":[0.417,-0.417,0]},{"t":29,"s":[55.99,35.665,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[4.07,2.03],[0,0],[-0.32,-6.71]],"o":[[0,0],[0,0],[0,-4.55],[0,0],[6,3.01],[0,0]],"v":[[6.62,7.405],[6.62,8.335],[0.01,8.335],[-6.62,-2.405],[-3.62,-8.335],[6.62,7.405]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-1,"op":300,"st":0,"bm":0},{"ddd":0,"ind":7,"ty":4,"nm":"\u4E0B\u653E\u5C041","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[30]},{"t":21,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":0,"s":[44,57.655,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":4,"s":[44,56.405,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":10,"s":[44,57.655,0],"to":[0,0.417,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":21,"s":[44,60.155,0],"to":[0,0,0],"ti":[0,0.417,0]},{"t":29,"s":[44,57.655,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[3.26,2.51],[0,0],[-4.65,4.47],[0,0],[4.11,0.01]],"o":[[-4.11,0.02],[0,0],[4.65,4.47],[0,0],[-3.27,2.5],[0,0]],"v":[[0,4.975],[-11.38,1.135],[-8.32,-4.975],[8.32,-4.975],[11.38,1.135],[0,4.975]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-1,"op":300,"st":0,"bm":0},{"ddd":0,"ind":8,"ty":4,"nm":"\u5DE6\u653E\u5C042","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[30]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":13,"s":[30]},{"t":24,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":3,"s":[25.73,31.78,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":7,"s":[26.98,33.03,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":13,"s":[25.73,31.78,0],"to":[-0.417,-0.417,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":24,"s":[23.23,29.28,0],"to":[0,0,0],"ti":[-0.417,-0.417,0]},{"t":32,"s":[25.73,31.78,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[-9.26,4.63],[0,0],[0.01,-7.86]],"o":[[0,0],[0,-10.35],[0,0],[-7.03,3.5],[0,0]],"v":[[-2.44,12.22],[-9.05,12.22],[6.05,-12.22],[9.05,-6.31],[-2.44,12.22]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-1,"op":300,"st":0,"bm":0},{"ddd":0,"ind":9,"ty":4,"nm":"\u53F3\u653E\u5C042","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[30]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":13,"s":[30]},{"t":24,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":3,"s":[62.275,31.78,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":7,"s":[61.025,33.03,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":13,"s":[62.275,31.78,0],"to":[0.417,-0.417,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":24,"s":[64.775,29.28,0],"to":[0,0,0],"ti":[0.417,-0.417,0]},{"t":32,"s":[62.275,31.78,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[6.71,3.34],[0,0],[0,0],[-0.49,-9.84]],"o":[[0,0],[0,0],[0,0],[-0.36,-7.48],[0,0],[0,0],[8.8,4.42],[0,0]],"v":[[9.015,10.85],[9.015,12.22],[2.435,12.22],[2.435,11.22],[-9.015,-6.31],[-6.015,-12.22],[-6.015,-12.22],[9.015,10.85]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-1,"op":300,"st":0,"bm":0},{"ddd":0,"ind":10,"ty":4,"nm":"\u4E0B\u653E\u5C042","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[30]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":13,"s":[30]},{"t":24,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":3,"s":[44.01,65.965,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":7,"s":[44.01,64.715,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":13,"s":[44.01,65.965,0],"to":[0,0.417,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":24,"s":[44.01,68.465,0],"to":[0,0,0],"ti":[0,0.417,0]},{"t":32,"s":[44.01,65.965,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[5.47,0.01],[4.52,3.06],[0,0],[-7.32,5.43],[0,0]],"o":[[-5.46,0.01],[0,0],[7.32,5.43],[0,0],[-4.52,3.07]],"v":[[-0.01,5.345],[-15.32,0.655],[-12.32,-5.345],[12.32,-5.345],[15.32,0.655]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-1,"op":300,"st":0,"bm":0},{"ddd":0,"ind":11,"ty":4,"nm":"\u5DE6\u653E\u5C043","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[30]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":16,"s":[30]},{"t":27,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":6,"s":[19.45,27.895,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":10,"s":[20.7,29.145,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":16,"s":[19.45,27.895,0],"to":[-0.417,-0.417,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":27,"s":[16.95,25.395,0],"to":[0,0,0],"ti":[-0.417,-0.417,0]},{"t":35,"s":[19.45,27.895,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[-12.2,6.1],[0,0],[0,-11.13]],"o":[[0,0],[0,-13.64],[0,0],[-9.96,4.96],[0,0]],"v":[[-4.81,16.105],[-11.45,16.105],[8.45,-16.105],[11.45,-10.165],[-4.81,16.105]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-1,"op":300,"st":0,"bm":0},{"ddd":0,"ind":12,"ty":4,"nm":"\u53F3\u653E\u5C043","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[30]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":16,"s":[30]},{"t":27,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":6,"s":[68.58,27.895,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":10,"s":[67.33,29.145,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":16,"s":[68.58,27.895,0],"to":[0.417,-0.417,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":27,"s":[71.08,25.395,0],"to":[0,0,0],"ti":[0.417,-0.417,0]},{"t":35,"s":[68.58,27.895,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[9.48,4.74],[0,0],[0,-13.64]],"o":[[0,0],[0,0],[-0.53,-10.58],[0,0],[12.2,6.1],[0,0]],"v":[[11.42,16.105],[4.78,16.105],[4.78,14.635],[-11.42,-10.165],[-8.48,-16.105],[11.42,16.105]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-1,"op":300,"st":0,"bm":0},{"ddd":0,"ind":13,"ty":4,"nm":"\u4E0B\u653E\u5C043","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[30]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":16,"s":[30]},{"t":27,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":6,"s":[44,74.22,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":10,"s":[44,72.97,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":16,"s":[44,74.22,0],"to":[0,0.417,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"t":27,"s":[44,76.72,0],"to":[0,0,0],"ti":[0,0.417,0]},{"t":35,"s":[44,74.22,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[11.74,7.41],[0,0],[-9.83,6.53]],"o":[[-11.74,7.41],[0,0],[9.83,6.53],[0,0]],"v":[[19.22,0.22],[-19.22,0.22],[-16.22,-5.78],[16.24,-5.78]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-1,"op":300,"st":0,"bm":0}],"markers":[]}');

},{}],"kkGp3":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>fullscreenWeb);
var _webscreenEnterJson = require("./icon/webscreenEnter.json");
var _webscreenEnterJsonDefault = parcelHelpers.interopDefault(_webscreenEnterJson);
var _webscreenLeaveJson = require("./icon/webscreenLeave.json");
var _webscreenLeaveJsonDefault = parcelHelpers.interopDefault(_webscreenLeaveJson);
var _utils = require("./utils");
function fullscreenWeb(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Web Fullscreen'),
            mounted: ($control)=>{
                const { proxy, i18n, constructor: { utils: { append, isMobile, getIcon, setStyle, tooltip } } } = art;
                const $webscreenEnterDom = append($control, getIcon("webscreenEnter"));
                const $webscreenLeaveDom = append($control, getIcon("webscreenLeave"));
                setStyle($webscreenLeaveDom, "display", "none");
                const webscreenEnterAnimation = (0, _utils.createAnimation)({
                    name: "webscreenEnter",
                    dom: $webscreenEnterDom,
                    json: (0, _webscreenEnterJsonDefault.default)
                });
                const webscreenLeaveAnimation = (0, _utils.createAnimation)({
                    name: "webscreenLeave",
                    dom: $webscreenLeaveDom,
                    json: (0, _webscreenLeaveJsonDefault.default)
                });
                const webscreenMouseEnter = ()=>{
                    art.fullscreenWeb ? webscreenLeaveAnimation.play() : webscreenEnterAnimation.play();
                };
                const webscreenEnterComplete = ()=>{
                    webscreenEnterAnimation.stop();
                };
                const webscreenLeaveComplete = ()=>{
                    webscreenLeaveAnimation.stop();
                };
                if (isMobile) proxy($control, "touchstart", webscreenMouseEnter);
                else proxy($control, "mouseenter", webscreenMouseEnter);
                proxy($control, 'click', ()=>{
                    art.fullscreenWeb = !art.fullscreenWeb;
                });
                webscreenEnterAnimation.addEventListener("complete", webscreenEnterComplete);
                webscreenLeaveAnimation.addEventListener("complete", webscreenLeaveComplete);
                art.on("fullscreenWeb", (value)=>{
                    if (value) {
                        tooltip($control, i18n.get('Exit Web Fullscreen'));
                        setStyle($webscreenEnterDom, "display", "none");
                        setStyle($webscreenLeaveDom, "display", "inline-flex");
                    } else {
                        tooltip($control, i18n.get('Web Fullscreen'));
                        setStyle($webscreenEnterDom, "display", "inline-flex");
                        setStyle($webscreenLeaveDom, "display", "none");
                    }
                });
                art.on("destroy", ()=>{
                    webscreenLeaveAnimation.destroy();
                    webscreenLeaveAnimation.destroy();
                });
            }
        });
}

},{"./icon/webscreenEnter.json":"2ErZZ","./icon/webscreenLeave.json":"4ZBhe","./utils":"MbBnn","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2ErZZ":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":81,"w":88,"h":88,"nm":"\u7F51\u9875 \u5168\u5C4F 2","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u5F62\u72B6","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[44,44,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[28,-28],[36,-20],[36,20],[28,28],[-28,28],[-36,20],[-36,-20],[-28,-28]],"c":true}],"e":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[23.25,-24.75],[31.25,-16.75],[31.25,16.625],[23.25,24.625],[-23.25,24.625],[-31.25,16.625],[-31.25,-16.75],[-23.25,-24.75]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[23.25,-24.75],[31.25,-16.75],[31.25,16.625],[23.25,24.625],[-23.25,24.625],[-31.25,16.625],[-31.25,-16.75],[-23.25,-24.75]],"c":true}],"e":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[31.625,-30.75],[39.625,-22.75],[39.625,22.75],[31.625,30.75],[-32,30.75],[-40,22.75],[-40,-22.75],[-32,-30.75]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[31.625,-30.75],[39.625,-22.75],[39.625,22.75],[31.625,30.75],[-32,30.75],[-40,22.75],[-40,-22.75],[-32,-30.75]],"c":true}],"e":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[23.25,-24.75],[31.25,-16.75],[31.25,16.625],[23.25,24.625],[-23.25,24.625],[-31.25,16.625],[-31.25,-16.75],[-23.25,-24.75]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[23.25,-24.75],[31.25,-16.75],[31.25,16.625],[23.25,24.625],[-23.25,24.625],[-31.25,16.625],[-31.25,-16.75],[-23.25,-24.75]],"c":true}],"e":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[28,-28],[36,-20],[36,20],[28,28],[-28,28],[-36,20],[-36,-20],[-28,-28]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[26,4],[22,4],[20.01,5.85],[20,6],[20,12],[14,12],[12.01,13.85],[12,14],[12,18],[13.85,19.99],[14,20],[26,20],[27.99,18.15],[28,18],[28,6],[26.15,4.01]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.125,1.875],[13.125,1.875],[11.135,3.725],[11.125,3.875],[11.125,9.875],[5.125,9.875],[3.135,11.725],[3.125,11.875],[3.125,15.875],[4.975,17.865],[5.125,17.875],[17.125,17.875],[19.115,16.025],[19.125,15.875],[19.125,3.875],[17.275,1.885]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.125,1.875],[13.125,1.875],[11.135,3.725],[11.125,3.875],[11.125,9.875],[5.125,9.875],[3.135,11.725],[3.125,11.875],[3.125,15.875],[4.975,17.865],[5.125,17.875],[17.125,17.875],[19.115,16.025],[19.125,15.875],[19.125,3.875],[17.275,1.885]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[30.75,9],[26.75,9],[24.76,10.85],[24.75,11],[24.75,17],[18.75,17],[16.76,18.85],[16.75,19],[16.75,23],[18.6,24.99],[18.75,25],[30.75,25],[32.74,23.15],[32.75,23],[32.75,11],[30.9,9.01]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[30.75,9],[26.75,9],[24.76,10.85],[24.75,11],[24.75,17],[18.75,17],[16.76,18.85],[16.75,19],[16.75,23],[18.6,24.99],[18.75,25],[30.75,25],[32.74,23.15],[32.75,23],[32.75,11],[30.9,9.01]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.125,1.875],[13.125,1.875],[11.135,3.725],[11.125,3.875],[11.125,9.875],[5.125,9.875],[3.135,11.725],[3.125,11.875],[3.125,15.875],[4.975,17.865],[5.125,17.875],[17.125,17.875],[19.115,16.025],[19.125,15.875],[19.125,3.875],[17.275,1.885]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.125,1.875],[13.125,1.875],[11.135,3.725],[11.125,3.875],[11.125,9.875],[5.125,9.875],[3.135,11.725],[3.125,11.875],[3.125,15.875],[4.975,17.865],[5.125,17.875],[17.125,17.875],[19.115,16.025],[19.125,15.875],[19.125,3.875],[17.275,1.885]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[26,4],[22,4],[20.01,5.85],[20,6],[20,12],[14,12],[12.01,13.85],[12,14],[12,18],[13.85,19.99],[14,20],[26,20],[27.99,18.15],[28,18],[28,6],[26.15,4.01]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 2","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-22,4],[-26,4],[-27.99,5.85],[-28,6],[-28,18],[-26.15,19.99],[-26,20],[-14,20],[-12.01,18.15],[-12,18],[-12,14],[-13.85,12.01],[-14,12],[-20,12],[-20,6],[-21.85,4.01]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-12.938,1.885],[-16.938,1.885],[-18.928,3.735],[-18.938,3.885],[-18.938,15.885],[-17.087,17.875],[-16.938,17.885],[-4.938,17.885],[-2.947,16.035],[-2.938,15.885],[-2.938,11.885],[-4.788,9.895],[-4.938,9.885],[-10.938,9.885],[-10.938,3.885],[-12.788,1.895]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-12.938,1.885],[-16.938,1.885],[-18.928,3.735],[-18.938,3.885],[-18.938,15.885],[-17.087,17.875],[-16.938,17.885],[-4.938,17.885],[-2.947,16.035],[-2.938,15.885],[-2.938,11.885],[-4.788,9.895],[-4.938,9.885],[-10.938,9.885],[-10.938,3.885],[-12.788,1.895]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-26.938,9.02],[-30.938,9.02],[-32.928,10.87],[-32.938,11.02],[-32.938,23.02],[-31.087,25.01],[-30.938,25.02],[-18.938,25.02],[-16.947,23.17],[-16.938,23.02],[-16.938,19.02],[-18.788,17.03],[-18.938,17.02],[-24.938,17.02],[-24.938,11.02],[-26.788,9.03]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-26.938,9.02],[-30.938,9.02],[-32.928,10.87],[-32.938,11.02],[-32.938,23.02],[-31.087,25.01],[-30.938,25.02],[-18.938,25.02],[-16.947,23.17],[-16.938,23.02],[-16.938,19.02],[-18.788,17.03],[-18.938,17.02],[-24.938,17.02],[-24.938,11.02],[-26.788,9.03]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-12.938,1.885],[-16.938,1.885],[-18.928,3.735],[-18.938,3.885],[-18.938,15.885],[-17.087,17.875],[-16.938,17.885],[-4.938,17.885],[-2.947,16.035],[-2.938,15.885],[-2.938,11.885],[-4.788,9.895],[-4.938,9.885],[-10.938,9.885],[-10.938,3.885],[-12.788,1.895]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-12.938,1.885],[-16.938,1.885],[-18.928,3.735],[-18.938,3.885],[-18.938,15.885],[-17.087,17.875],[-16.938,17.885],[-4.938,17.885],[-2.947,16.035],[-2.938,15.885],[-2.938,11.885],[-4.788,9.895],[-4.938,9.885],[-10.938,9.885],[-10.938,3.885],[-12.788,1.895]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-22,4],[-26,4],[-27.99,5.85],[-28,6],[-28,18],[-26.15,19.99],[-26,20],[-14,20],[-12.01,18.15],[-12,18],[-12,14],[-13.85,12.01],[-14,12],[-20,12],[-20,6],[-21.85,4.01]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 3","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[26,-20],[14,-20],[12.01,-18.15],[12,-18],[12,-14],[13.85,-12.01],[14,-12],[20,-12],[20,-6],[21.85,-4.01],[22,-4],[26,-4],[27.99,-5.85],[28,-6],[28,-18],[26.15,-19.99]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.125,-17.625],[5.125,-17.625],[3.135,-15.775],[3.125,-15.625],[3.125,-11.625],[4.975,-9.635],[5.125,-9.625],[11.125,-9.625],[11.125,-3.625],[12.975,-1.635],[13.125,-1.625],[17.125,-1.625],[19.115,-3.475],[19.125,-3.625],[19.125,-15.625],[17.275,-17.615]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.125,-17.625],[5.125,-17.625],[3.135,-15.775],[3.125,-15.625],[3.125,-11.625],[4.975,-9.635],[5.125,-9.625],[11.125,-9.625],[11.125,-3.625],[12.975,-1.635],[13.125,-1.625],[17.125,-1.625],[19.115,-3.475],[19.125,-3.625],[19.125,-15.625],[17.275,-17.615]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[30.75,-24.75],[18.75,-24.75],[16.76,-22.9],[16.75,-22.75],[16.75,-18.75],[18.6,-16.76],[18.75,-16.75],[24.75,-16.75],[24.75,-10.75],[26.6,-8.76],[26.75,-8.75],[30.75,-8.75],[32.74,-10.6],[32.75,-10.75],[32.75,-22.75],[30.9,-24.74]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[30.75,-24.75],[18.75,-24.75],[16.76,-22.9],[16.75,-22.75],[16.75,-18.75],[18.6,-16.76],[18.75,-16.75],[24.75,-16.75],[24.75,-10.75],[26.6,-8.76],[26.75,-8.75],[30.75,-8.75],[32.74,-10.6],[32.75,-10.75],[32.75,-22.75],[30.9,-24.74]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.125,-17.625],[5.125,-17.625],[3.135,-15.775],[3.125,-15.625],[3.125,-11.625],[4.975,-9.635],[5.125,-9.625],[11.125,-9.625],[11.125,-3.625],[12.975,-1.635],[13.125,-1.625],[17.125,-1.625],[19.115,-3.475],[19.125,-3.625],[19.125,-15.625],[17.275,-17.615]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.125,-17.625],[5.125,-17.625],[3.135,-15.775],[3.125,-15.625],[3.125,-11.625],[4.975,-9.635],[5.125,-9.625],[11.125,-9.625],[11.125,-3.625],[12.975,-1.635],[13.125,-1.625],[17.125,-1.625],[19.115,-3.475],[19.125,-3.625],[19.125,-15.625],[17.275,-17.615]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[26,-20],[14,-20],[12.01,-18.15],[12,-18],[12,-14],[13.85,-12.01],[14,-12],[20,-12],[20,-6],[21.85,-4.01],[22,-4],[26,-4],[27.99,-5.85],[28,-6],[28,-18],[26.15,-19.99]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 4","mn":"ADBE Vector Shape - Group","hd":false},{"ind":4,"ty":"sh","ix":5,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-14,-20],[-26,-20],[-27.99,-18.15],[-28,-18],[-28,-6],[-26.15,-4.01],[-26,-4],[-22,-4],[-20.01,-5.85],[-20,-6],[-20,-12],[-14,-12],[-12.01,-13.85],[-12,-14],[-12,-18],[-13.85,-19.99]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-4.938,-17.615],[-16.938,-17.615],[-18.928,-15.765],[-18.938,-15.615],[-18.938,-3.615],[-17.087,-1.625],[-16.938,-1.615],[-12.938,-1.615],[-10.947,-3.465],[-10.938,-3.615],[-10.938,-9.615],[-4.938,-9.615],[-2.947,-11.465],[-2.938,-11.615],[-2.938,-15.615],[-4.788,-17.605]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-4.938,-17.615],[-16.938,-17.615],[-18.928,-15.765],[-18.938,-15.615],[-18.938,-3.615],[-17.087,-1.625],[-16.938,-1.615],[-12.938,-1.615],[-10.947,-3.465],[-10.938,-3.615],[-10.938,-9.615],[-4.938,-9.615],[-2.947,-11.465],[-2.938,-11.615],[-2.938,-15.615],[-4.788,-17.605]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.938,-24.73],[-30.938,-24.73],[-32.928,-22.88],[-32.938,-22.73],[-32.938,-10.73],[-31.087,-8.74],[-30.938,-8.73],[-26.938,-8.73],[-24.947,-10.58],[-24.938,-10.73],[-24.938,-16.73],[-18.938,-16.73],[-16.947,-18.58],[-16.938,-18.73],[-16.938,-22.73],[-18.788,-24.72]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.938,-24.73],[-30.938,-24.73],[-32.928,-22.88],[-32.938,-22.73],[-32.938,-10.73],[-31.087,-8.74],[-30.938,-8.73],[-26.938,-8.73],[-24.947,-10.58],[-24.938,-10.73],[-24.938,-16.73],[-18.938,-16.73],[-16.947,-18.58],[-16.938,-18.73],[-16.938,-22.73],[-18.788,-24.72]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-4.938,-17.615],[-16.938,-17.615],[-18.928,-15.765],[-18.938,-15.615],[-18.938,-3.615],[-17.087,-1.625],[-16.938,-1.615],[-12.938,-1.615],[-10.947,-3.465],[-10.938,-3.615],[-10.938,-9.615],[-4.938,-9.615],[-2.947,-11.465],[-2.938,-11.615],[-2.938,-15.615],[-4.788,-17.605]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-4.938,-17.615],[-16.938,-17.615],[-18.928,-15.765],[-18.938,-15.615],[-18.938,-3.615],[-17.087,-1.625],[-16.938,-1.615],[-12.938,-1.615],[-10.947,-3.465],[-10.938,-3.615],[-10.938,-9.615],[-4.938,-9.615],[-2.947,-11.465],[-2.938,-11.615],[-2.938,-15.615],[-4.788,-17.605]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-14,-20],[-26,-20],[-27.99,-18.15],[-28,-18],[-28,-6],[-26.15,-4.01],[-26,-4],[-22,-4],[-20.01,-5.85],[-20,-6],[-20,-12],[-14,-12],[-12.01,-13.85],[-12,-14],[-12,-18],[-13.85,-19.99]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 5","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"\u5408\u5E76\u8DEF\u5F84 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6","np":7,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0}],"markers":[]}');

},{}],"4ZBhe":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":81,"w":88,"h":88,"nm":"\u7F51\u9875 \u9000\u51FA\u5168\u5C4F","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u5F62\u72B6","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[44,44,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[28,-28],[36,-20],[36,20],[28,28],[-28,28],[-36,20],[-36,-20],[-28,-28]],"c":true}],"e":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[31.875,-30.875],[39.875,-22.875],[39.875,23],[31.875,31],[-31.75,31],[-39.75,23],[-39.75,-22.875],[-31.75,-30.875]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[31.875,-30.875],[39.875,-22.875],[39.875,23],[31.875,31],[-31.75,31],[-39.75,23],[-39.75,-22.875],[-31.75,-30.875]],"c":true}],"e":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[23,-24.125],[31,-16.125],[31,16.375],[23,24.375],[-23,24.375],[-31,16.375],[-31,-16.125],[-23,-24.125]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[23,-24.125],[31,-16.125],[31,16.375],[23,24.375],[-23,24.375],[-31,16.375],[-31,-16.125],[-23,-24.125]],"c":true}],"e":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[31.875,-30.875],[39.875,-22.875],[39.875,23],[31.875,31],[-31.75,31],[-39.75,23],[-39.75,-22.875],[-31.75,-30.875]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[31.875,-30.875],[39.875,-22.875],[39.875,23],[31.875,31],[-31.75,31],[-39.75,23],[-39.75,-22.875],[-31.75,-30.875]],"c":true}],"e":[{"i":[[0,0],[0,-4.42],[0,0],[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[28,-28],[36,-20],[36,20],[28,28],[-28,28],[-36,20],[-36,-20],[-28,-28]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[26,4],[14,4],[12.01,5.85],[12,6],[12,18],[13.85,19.99],[14,20],[18,20],[19.99,18.15],[20,18],[20,12],[26,12],[27.99,10.15],[28,10],[28,6],[26.15,4.01]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[30.75,9.25],[18.75,9.25],[16.76,11.1],[16.75,11.25],[16.75,23.25],[18.6,25.24],[18.75,25.25],[22.75,25.25],[24.74,23.4],[24.75,23.25],[24.75,17.25],[30.75,17.25],[32.74,15.4],[32.75,15.25],[32.75,11.25],[30.9,9.26]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[30.75,9.25],[18.75,9.25],[16.76,11.1],[16.75,11.25],[16.75,23.25],[18.6,25.24],[18.75,25.25],[22.75,25.25],[24.74,23.4],[24.75,23.25],[24.75,17.25],[30.75,17.25],[32.74,15.4],[32.75,15.25],[32.75,11.25],[30.9,9.26]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.25,2.25],[5.25,2.25],[3.26,4.1],[3.25,4.25],[3.25,16.25],[5.1,18.24],[5.25,18.25],[9.25,18.25],[11.24,16.4],[11.25,16.25],[11.25,10.25],[17.25,10.25],[19.24,8.4],[19.25,8.25],[19.25,4.25],[17.4,2.26]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[17.25,2.25],[5.25,2.25],[3.26,4.1],[3.25,4.25],[3.25,16.25],[5.1,18.24],[5.25,18.25],[9.25,18.25],[11.24,16.4],[11.25,16.25],[11.25,10.25],[17.25,10.25],[19.24,8.4],[19.25,8.25],[19.25,4.25],[17.4,2.26]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[30.75,9.25],[18.75,9.25],[16.76,11.1],[16.75,11.25],[16.75,23.25],[18.6,25.24],[18.75,25.25],[22.75,25.25],[24.74,23.4],[24.75,23.25],[24.75,17.25],[30.75,17.25],[32.74,15.4],[32.75,15.25],[32.75,11.25],[30.9,9.26]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[30.75,9.25],[18.75,9.25],[16.76,11.1],[16.75,11.25],[16.75,23.25],[18.6,25.24],[18.75,25.25],[22.75,25.25],[24.74,23.4],[24.75,23.25],[24.75,17.25],[30.75,17.25],[32.74,15.4],[32.75,15.25],[32.75,11.25],[30.9,9.26]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[26,4],[14,4],[12.01,5.85],[12,6],[12,18],[13.85,19.99],[14,20],[18,20],[19.99,18.15],[20,18],[20,12],[26,12],[27.99,10.15],[28,10],[28,6],[26.15,4.01]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 2","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-14,4],[-26,4],[-27.99,5.85],[-28,6],[-28,10],[-26.15,11.99],[-26,12],[-20,12],[-20,18],[-18.15,19.99],[-18,20],[-14,20],[-12.01,18.15],[-12,18],[-12,6],[-13.85,4.01]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.875,9.25],[-30.875,9.25],[-32.865,11.1],[-32.875,11.25],[-32.875,15.25],[-31.025,17.24],[-30.875,17.25],[-24.875,17.25],[-24.875,23.25],[-23.025,25.24],[-22.875,25.25],[-18.875,25.25],[-16.885,23.4],[-16.875,23.25],[-16.875,11.25],[-18.725,9.26]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.875,9.25],[-30.875,9.25],[-32.865,11.1],[-32.875,11.25],[-32.875,15.25],[-31.025,17.24],[-30.875,17.25],[-24.875,17.25],[-24.875,23.25],[-23.025,25.24],[-22.875,25.25],[-18.875,25.25],[-16.885,23.4],[-16.875,23.25],[-16.875,11.25],[-18.725,9.26]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-5.5,2.25],[-17.5,2.25],[-19.49,4.1],[-19.5,4.25],[-19.5,8.25],[-17.65,10.24],[-17.5,10.25],[-11.5,10.25],[-11.5,16.25],[-9.65,18.24],[-9.5,18.25],[-5.5,18.25],[-3.51,16.4],[-3.5,16.25],[-3.5,4.25],[-5.35,2.26]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-5.5,2.25],[-17.5,2.25],[-19.49,4.1],[-19.5,4.25],[-19.5,8.25],[-17.65,10.24],[-17.5,10.25],[-11.5,10.25],[-11.5,16.25],[-9.65,18.24],[-9.5,18.25],[-5.5,18.25],[-3.51,16.4],[-3.5,16.25],[-3.5,4.25],[-5.35,2.26]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.875,9.25],[-30.875,9.25],[-32.865,11.1],[-32.875,11.25],[-32.875,15.25],[-31.025,17.24],[-30.875,17.25],[-24.875,17.25],[-24.875,23.25],[-23.025,25.24],[-22.875,25.25],[-18.875,25.25],[-16.885,23.4],[-16.875,23.25],[-16.875,11.25],[-18.725,9.26]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.875,9.25],[-30.875,9.25],[-32.865,11.1],[-32.875,11.25],[-32.875,15.25],[-31.025,17.24],[-30.875,17.25],[-24.875,17.25],[-24.875,23.25],[-23.025,25.24],[-22.875,25.25],[-18.875,25.25],[-16.885,23.4],[-16.875,23.25],[-16.875,11.25],[-18.725,9.26]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-14,4],[-26,4],[-27.99,5.85],[-28,6],[-28,10],[-26.15,11.99],[-26,12],[-20,12],[-20,18],[-18.15,19.99],[-18,20],[-14,20],[-12.01,18.15],[-12,18],[-12,6],[-13.85,4.01]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 3","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[18,-20],[14,-20],[12.01,-18.15],[12,-18],[12,-6],[13.85,-4.01],[14,-4],[26,-4],[27.99,-5.85],[28,-6],[28,-10],[26.15,-11.99],[26,-12],[20,-12],[20,-18],[18.15,-19.99]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[22.75,-25],[18.75,-25],[16.76,-23.15],[16.75,-23],[16.75,-11],[18.6,-9.01],[18.75,-9],[30.75,-9],[32.74,-10.85],[32.75,-11],[32.75,-15],[30.9,-16.99],[30.75,-17],[24.75,-17],[24.75,-23],[22.9,-24.99]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[22.75,-25],[18.75,-25],[16.76,-23.15],[16.75,-23],[16.75,-11],[18.6,-9.01],[18.75,-9],[30.75,-9],[32.74,-10.85],[32.75,-11],[32.75,-15],[30.9,-16.99],[30.75,-17],[24.75,-17],[24.75,-23],[22.9,-24.99]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[9.25,-17.5],[5.25,-17.5],[3.26,-15.65],[3.25,-15.5],[3.25,-3.5],[5.1,-1.51],[5.25,-1.5],[17.25,-1.5],[19.24,-3.35],[19.25,-3.5],[19.25,-7.5],[17.4,-9.49],[17.25,-9.5],[11.25,-9.5],[11.25,-15.5],[9.4,-17.49]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[9.25,-17.5],[5.25,-17.5],[3.26,-15.65],[3.25,-15.5],[3.25,-3.5],[5.1,-1.51],[5.25,-1.5],[17.25,-1.5],[19.24,-3.35],[19.25,-3.5],[19.25,-7.5],[17.4,-9.49],[17.25,-9.5],[11.25,-9.5],[11.25,-15.5],[9.4,-17.49]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[22.75,-25],[18.75,-25],[16.76,-23.15],[16.75,-23],[16.75,-11],[18.6,-9.01],[18.75,-9],[30.75,-9],[32.74,-10.85],[32.75,-11],[32.75,-15],[30.9,-16.99],[30.75,-17],[24.75,-17],[24.75,-23],[22.9,-24.99]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[22.75,-25],[18.75,-25],[16.76,-23.15],[16.75,-23],[16.75,-11],[18.6,-9.01],[18.75,-9],[30.75,-9],[32.74,-10.85],[32.75,-11],[32.75,-15],[30.9,-16.99],[30.75,-17],[24.75,-17],[24.75,-23],[22.9,-24.99]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07],[0,0],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[18,-20],[14,-20],[12.01,-18.15],[12,-18],[12,-6],[13.85,-4.01],[14,-4],[26,-4],[27.99,-5.85],[28,-6],[28,-10],[26.15,-11.99],[26,-12],[20,-12],[20,-18],[18.15,-19.99]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 4","mn":"ADBE Vector Shape - Group","hd":false},{"ind":4,"ty":"sh","ix":5,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":0,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-14,-20],[-18,-20],[-19.99,-18.15],[-20,-18],[-20,-12],[-26,-12],[-27.99,-10.15],[-28,-10],[-28,-6],[-26.15,-4.01],[-26,-4],[-14,-4],[-12.01,-5.85],[-12,-6],[-12,-18],[-13.85,-19.99]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.875,-25],[-22.875,-25],[-24.865,-23.15],[-24.875,-23],[-24.875,-17],[-30.875,-17],[-32.865,-15.15],[-32.875,-15],[-32.875,-11],[-31.025,-9.01],[-30.875,-9],[-18.875,-9],[-16.885,-10.85],[-16.875,-11],[-16.875,-23],[-18.725,-24.99]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":10,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.875,-25],[-22.875,-25],[-24.865,-23.15],[-24.875,-23],[-24.875,-17],[-30.875,-17],[-32.865,-15.15],[-32.875,-15],[-32.875,-11],[-31.025,-9.01],[-30.875,-9],[-18.875,-9],[-16.885,-10.85],[-16.875,-11],[-16.875,-23],[-18.725,-24.99]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-5.5,-17.5],[-9.5,-17.5],[-11.49,-15.65],[-11.5,-15.5],[-11.5,-9.5],[-17.5,-9.5],[-19.49,-7.65],[-19.5,-7.5],[-19.5,-3.5],[-17.65,-1.51],[-17.5,-1.5],[-5.5,-1.5],[-3.51,-3.35],[-3.5,-3.5],[-3.5,-15.5],[-5.35,-17.49]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":20,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-5.5,-17.5],[-9.5,-17.5],[-11.49,-15.65],[-11.5,-15.5],[-11.5,-9.5],[-17.5,-9.5],[-19.49,-7.65],[-19.5,-7.5],[-19.5,-3.5],[-17.65,-1.51],[-17.5,-1.5],[-5.5,-1.5],[-3.51,-3.35],[-3.5,-3.5],[-3.5,-15.5],[-5.35,-17.49]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.875,-25],[-22.875,-25],[-24.865,-23.15],[-24.875,-23],[-24.875,-17],[-30.875,-17],[-32.865,-15.15],[-32.875,-15],[-32.875,-11],[-31.025,-9.01],[-30.875,-9],[-18.875,-9],[-16.885,-10.85],[-16.875,-11],[-16.875,-23],[-18.725,-24.99]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":1,"y":0},"t":30,"s":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-18.875,-25],[-22.875,-25],[-24.865,-23.15],[-24.875,-23],[-24.875,-17],[-30.875,-17],[-32.865,-15.15],[-32.875,-15],[-32.875,-11],[-31.025,-9.01],[-30.875,-9],[-18.875,-9],[-16.885,-10.85],[-16.875,-11],[-16.875,-23],[-18.725,-24.99]],"c":true}],"e":[{"i":[[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[0,0],[0.07,-1.03],[0,0],[0,0],[-1.03,-0.07],[0,0],[0,0],[-0.07,1.03],[0,0],[0,0],[1.03,0.07]],"o":[[0,0],[-1.05,0],[0,0],[0,0],[0,0],[-1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,-1.05],[0,0]],"v":[[-14,-20],[-18,-20],[-19.99,-18.15],[-20,-18],[-20,-12],[-26,-12],[-27.99,-10.15],[-28,-10],[-28,-6],[-26.15,-4.01],[-26,-4],[-14,-4],[-12.01,-5.85],[-12,-6],[-12,-18],[-13.85,-19.99]],"c":true}]},{"t":40}],"ix":2},"nm":"\u8DEF\u5F84 5","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"\u5408\u5E76\u8DEF\u5F84 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6","np":7,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0}],"markers":[]}');

},{}],"4Fa0q":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>setting);
var _settingJson = require("./icon/setting.json");
var _settingJsonDefault = parcelHelpers.interopDefault(_settingJson);
var _utils = require("./utils");
function setting(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Show Setting'),
            mounted: ($control)=>{
                const { proxy, i18n, constructor: { utils: { append, isMobile, getIcon, tooltip } } } = art;
                const $settingDom = append($control, getIcon("setting"));
                const settingAnimation = (0, _utils.createAnimation)({
                    name: "setting",
                    dom: $settingDom,
                    json: (0, _settingJsonDefault.default)
                });
                const stopAnimation = ()=>{
                    settingAnimation.stop();
                };
                const playAnimation = ()=>{
                    settingAnimation.play();
                };
                if (isMobile) proxy($control, "touchstart", playAnimation);
                else proxy($control, "mouseenter", playAnimation);
                proxy($control, 'click', ()=>{
                    art.setting.toggle();
                    art.setting.resize();
                });
                settingAnimation.addEventListener("complete", stopAnimation);
                art.on('setting', (value)=>{
                    tooltip($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'));
                });
                art.on("destroy", ()=>{
                    settingAnimation.destroy();
                });
            }
        });
}

},{"./icon/setting.json":"fwaGb","./utils":"MbBnn","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"fwaGb":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":60,"w":88,"h":88,"nm":"\u8BBE\u7F6E\u6D41\u7545","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u5F62\u72B6","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[0]},{"t":40,"s":[120]}],"ix":10},"p":{"a":0,"k":[44,43.875,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":0,"s":[100,100,100]},{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.167,0.167,0.167],"y":[0,0,0]},"t":10.668,"s":[88,88,100]},{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.167,0.167,0.167],"y":[0,0,0]},"t":22,"s":[88,88,100]},{"t":40,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[1.55,0],[1.48,0.24],[0,0],[1.69,0.98],[0,0],[-0.69,1.83],[0,0],[1.16,3.05],[0,0],[0,1.95],[0,0],[-1.93,0.32],[0,0],[-2.03,2.48],[0,0],[-1.69,0.98],[0,0],[-1.25,-1.51],[0,0],[-1.74,0],[-1.65,-0.31],[0,0],[-1.69,-0.98],[0,0],[0.68,-1.84],[0,0],[-1.09,-3.08],[0,0],[0,-1.95],[0,0],[1.93,-0.32],[0,0],[2.09,-2.44],[0,0],[1.69,-0.98],[0,0],[1.24,1.51]],"o":[[-1.48,0.24],[-1.55,0],[0,0],[-1.24,1.51],[0,0],[-1.69,-0.98],[0,0],[-2.09,-2.44],[0,0],[-1.93,-0.32],[0,0],[0,-1.95],[0,0],[1.09,-3.08],[0,0],[-0.68,-1.84],[0,0],[1.69,-0.98],[0,0],[1.65,-0.31],[1.74,0],[0,0],[1.25,-1.51],[0,0],[1.69,0.98],[0,0],[2.03,2.48],[0,0],[1.93,0.32],[0,0],[0,1.95],[0,0],[-1.16,3.05],[0,0],[0.69,1.83],[0,0],[-1.69,0.98],[0,0]],"v":[[4.54,27.511],[0,27.871],[-4.54,27.511],[-8.7,32.561],[-13.79,33.481],[-21.78,28.871],[-23.52,24.001],[-21.29,18.061],[-26.21,9.761],[-32.66,8.681],[-36,4.741],[-36,-4.489],[-32.66,-8.429],[-26.4,-9.479],[-21.66,-17.869],[-23.96,-23.999],[-22.21,-28.869],[-14.22,-33.479],[-9.13,-32.559],[-5.1,-27.659],[0,-28.129],[5.1,-27.659],[9.13,-32.559],[14.22,-33.479],[22.21,-28.869],[23.96,-23.999],[21.66,-17.869],[26.4,-9.479],[32.66,-8.429],[36,-4.489],[36,4.741],[32.66,8.681],[26.21,9.761],[21.29,18.061],[23.52,24.001],[21.78,28.871],[13.79,33.481],[8.7,32.561]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[-8.84,0],[0,8.84],[8.84,0],[0,-8.84]],"o":[[8.84,0],[0,-8.84],[-8.84,0],[0,8.84]],"v":[[0,16.125],[16,0.125],[0,-15.875],[-16,0.125]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 2","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[4.42,0],[0,4.42],[-4.42,0],[0,-4.42]],"o":[[-4.42,0],[0,-4.42],[4.42,0],[0,4.42]],"v":[[0,8.125],[-8,0.125],[0,-7.875],[8,0.125]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 3","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"\u5408\u5E76\u8DEF\u5F84 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6","np":5,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0}],"markers":[]}');

},{}],"d3fFw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>pip);
var _pipEnterJson = require("./icon/pipEnter.json");
var _pipEnterJsonDefault = parcelHelpers.interopDefault(_pipEnterJson);
var _pipLeaveJson = require("./icon/pipLeave.json");
var _pipLeaveJsonDefault = parcelHelpers.interopDefault(_pipLeaveJson);
var _utils = require("./utils");
function pip(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('PIP Mode'),
            mounted: ($control)=>{
                const { proxy, i18n, constructor: { utils: { append, isMobile, getIcon, setStyle, tooltip } } } = art;
                const $pipEnterDom = append($control, getIcon("pipEnter"));
                const $pipLeaveDom = append($control, getIcon("pipLeave"));
                setStyle($pipLeaveDom, "display", "none");
                const pipEnterAnimation = (0, _utils.createAnimation)({
                    name: "pipEnter",
                    dom: $pipEnterDom,
                    json: (0, _pipEnterJsonDefault.default)
                });
                const pipLeaveAnimation = (0, _utils.createAnimation)({
                    name: "pipLeave",
                    dom: $pipLeaveDom,
                    json: (0, _pipLeaveJsonDefault.default)
                });
                const pipMouseEnter = ()=>{
                    art.pip ? pipLeaveAnimation.play() : pipEnterAnimation.play();
                };
                const pipEnterComplete = ()=>{
                    pipEnterAnimation.stop();
                };
                const pipLeaveComplete = ()=>{
                    pipLeaveAnimation.stop();
                };
                if (isMobile) proxy($control, "touchstart", pipMouseEnter);
                else proxy($control, "mouseenter", pipMouseEnter);
                proxy($control, 'click', ()=>{
                    art.pip = !art.pip;
                });
                pipEnterAnimation.addEventListener("complete", pipEnterComplete);
                pipLeaveAnimation.addEventListener("complete", pipLeaveComplete);
                art.on("pip", (value)=>{
                    tooltip($control, i18n.get(value ? 'Exit PIP Mode' : 'PIP Mode'));
                    if (value) {
                        tooltip($control, i18n.get('Exit PIP Mode'));
                        setStyle($pipEnterDom, "display", "none");
                        setStyle($pipLeaveDom, "display", "inline-flex");
                    } else {
                        tooltip($control, i18n.get('PIP Mode'));
                        setStyle($pipEnterDom, "display", "inline-flex");
                        setStyle($pipLeaveDom, "display", "none");
                    }
                });
                art.on("destroy", ()=>{
                    pipEnterAnimation.destroy();
                    pipLeaveAnimation.destroy();
                });
            }
        });
}

},{"./icon/pipEnter.json":"c83uf","./icon/pipLeave.json":"aohXK","./utils":"MbBnn","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"c83uf":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":61,"w":88,"h":88,"nm":"\u5C0F\u7A97 hover \u989D\u5916\u5143\u7D20","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u8DEF\u5F84","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":30,"s":[100]},{"t":40,"s":[0]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":10,"s":[30.496,33.743,0],"to":[2.062,1.833,0],"ti":[0,0,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":20,"s":[42.871,44.743,0],"to":[0,0,0],"ti":[2.062,1.833,0]},{"t":30,"s":[30.496,33.743,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-0.78,-0.79],[0,0],[0,0],[-1.04,0.08],[0,0],[0,0],[-0.08,-1.04],[0,0],[0,0],[1.03,-0.07],[0,0],[0,0],[0.08,1.03],[0,0],[0,0],[-1.04,0.08],[0,0],[0,0],[0,0],[-0.79,0.79],[0,0]],"o":[[0,0],[0,0],[0,-1.06],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[-1.06,0],[0,0],[0,0],[0,-1.06],[0,0],[0,0],[0,0],[-0.79,-0.78],[0,0],[0.79,-0.79]],"v":[[-4.038,-9.809],[2.282,-3.499],[2.282,-7.6],[4.132,-9.6],[4.282,-9.6],[8.282,-9.6],[10.272,-7.749],[10.282,-7.6],[10.282,8.4],[8.432,10.391],[8.282,10.4],[-7.718,10.4],[-9.718,8.551],[-9.718,8.4],[-9.718,4.4],[-7.868,2.4],[-7.718,2.4],[-3.138,2.4],[-9.688,-4.16],[-9.688,-6.99],[-6.868,-9.809]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"\u5C0F\u7A97","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[67,65,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":10,"s":[{"i":[[0,-2.209],[0,0],[2.209,0],[0,0],[0,2.209],[0,0],[-2.209,0],[0,0]],"o":[[0,0],[0,2.209],[0,0],[-2.209,0],[0,0],[0,-2.209],[0,0],[2.209,0]],"v":[[16,-8],[16,8],[12,12],[-12,12],[-16,8],[-16,-8],[-12,-12],[12,-12]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":23,"s":[{"i":[[0,-2.209],[0,0],[2.209,0],[0,0],[0,2.209],[0,0],[-2.209,0],[0,0]],"o":[[0,0],[0,2.209],[0,0],[-2.209,0],[0,0],[0,-2.209],[0,0],[2.209,0]],"v":[[19,-4.875],[19,11.125],[15,15.125],[-9,15.125],[-13,11.125],[-13,-4.875],[-9,-8.875],[15,-8.875]],"c":true}]},{"t":40,"s":[{"i":[[0,-2.209],[0,0],[2.209,0],[0,0],[0,2.209],[0,0],[-2.209,0],[0,0]],"o":[[0,0],[0,2.209],[0,0],[-2.209,0],[0,0],[0,-2.209],[0,0],[2.209,0]],"v":[[16,-8],[16,8],[12,12],[-12,12],[-16,8],[-16,-8],[-12,-12],[12,-12]],"c":true}]}],"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"Rectangle","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"\u8DEF\u5F84","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[41,41,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":10,"s":[{"i":[[0,0],[0,-4.42],[0,0],[0,0],[0,0],[1.77,0],[0,0],[0.09,-1.68],[0,0],[0,0],[-1.68,-0.09],[0,0],[0,0],[0,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,0],[0,0],[0,-1.77],[0,0],[-1.71,0],[0,0],[0,0],[0,1.71],[0,0],[0,0],[0,0],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[26,-28],[34,-20],[34,4],[26,4],[26,-16.8],[22.8,-20],[-22.8,-20],[-25.99,-16.98],[-26,-16.8],[-26,16.8],[-22.98,19.99],[-22.8,20],[2,20],[2,28],[-26,28],[-34,20],[-34,-20],[-26,-28]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":20,"s":[{"i":[[0,0],[0,-4.42],[0,0],[0,0],[0,0],[1.77,0],[0,0],[0.09,-1.68],[0,0],[0,0],[-1.68,-0.09],[0,0],[0,0],[0,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,0],[0,0],[0,-1.77],[0,0],[-1.71,0],[0,0],[0,0],[0,1.71],[0,0],[0,0],[0,0],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[29.35,-21.5],[37.35,-13.5],[37.45,8],[29.45,8],[29.35,-10.3],[26.15,-13.5],[-17.45,-13.5],[-20.64,-10.48],[-20.65,-10.3],[-20.7,19.3],[-17.68,22.49],[-17.5,22.5],[7.05,22.5],[7.05,30.5],[-20.7,30.5],[-28.7,22.5],[-28.65,-13.5],[-20.65,-21.5]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":40,"s":[{"i":[[0,0],[0,-4.42],[0,0],[0,0],[0,0],[1.77,0],[0,0],[0.09,-1.68],[0,0],[0,0],[-1.68,-0.09],[0,0],[0,0],[0,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,0],[0,0],[0,-1.77],[0,0],[-1.71,0],[0,0],[0,0],[0,1.71],[0,0],[0,0],[0,0],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[26,-28],[34,-20],[34,4],[26,4],[26,-16.8],[22.8,-20],[-22.8,-20],[-25.99,-16.98],[-26,-16.8],[-26,16.8],[-22.98,19.99],[-22.8,20],[2,20],[2,28],[-26,28],[-34,20],[-34,-20],[-26,-28]],"c":true}]},{"t":50,"s":[{"i":[[0,0],[0,-4.42],[0,0],[0,0],[0,0],[1.77,0],[0,0],[0.09,-1.68],[0,0],[0,0],[-1.68,-0.09],[0,0],[0,0],[0,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,0],[0,0],[0,-1.77],[0,0],[-1.71,0],[0,0],[0,0],[0,1.71],[0,0],[0,0],[0,0],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[26,-28],[34,-20],[34,4],[26,4],[26,-16.8],[22.8,-20],[-22.8,-20],[-25.99,-16.98],[-26,-16.8],[-26,16.8],[-22.98,19.99],[-22.8,20],[2,20],[2,28],[-26,28],[-34,20],[-34,-20],[-26,-28]],"c":true}]}],"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0}],"markers":[]}');

},{}],"aohXK":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":61,"w":88,"h":88,"nm":"\u5C0F\u7A97 hover \u989D\u5916\u5143\u7D20\u9000\u51FA ","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u5927\u6846","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[42,44,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":10,"s":[{"i":[[0,0],[0,-4.42],[0,0],[0,0],[0,0],[1.77,0],[0,0],[0.09,-1.68],[0,0],[0,0],[-1.68,-0.09],[0,0],[0,0],[0,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,0],[0,0],[0,-1.77],[0,0],[-1.71,0],[0,0],[0,0],[0,1.71],[0,0],[0,0],[0,0],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[26,-28],[34,-20],[34,4],[26,4],[26,-16.8],[22.8,-20],[-22.8,-20],[-25.99,-16.98],[-26,-16.8],[-26,16.8],[-22.98,19.99],[-22.8,20],[2,20],[2,28],[-26,28],[-34,20],[-34,-20],[-26,-28]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":23,"s":[{"i":[[0,0],[0,-4.42],[0,0],[0,0],[0,0],[1.77,0],[0,0],[0.09,-1.68],[0,0],[0,0],[-1.68,-0.09],[0,0],[0,0],[0,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,0],[0,0],[0,-1.77],[0,0],[-1.71,0],[0,0],[0,0],[0,1.71],[0,0],[0,0],[0,0],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[15,-31.875],[23,-23.875],[23,-15.5],[15,-15.5],[15,-20.675],[11.8,-23.875],[-27.05,-23.875],[-30.24,-20.855],[-30.25,-20.675],[-30.25,8.05],[-27.23,11.24],[-27.05,11.25],[-23.25,11.25],[-23.25,19.25],[-30.25,19.25],[-38.25,11.25],[-38.25,-23.875],[-30.25,-31.875]],"c":true}]},{"t":40,"s":[{"i":[[0,0],[0,-4.42],[0,0],[0,0],[0,0],[1.77,0],[0,0],[0.09,-1.68],[0,0],[0,0],[-1.68,-0.09],[0,0],[0,0],[0,0],[0,0],[0,4.42],[0,0],[-4.42,0]],"o":[[4.42,0],[0,0],[0,0],[0,0],[0,-1.77],[0,0],[-1.71,0],[0,0],[0,0],[0,1.71],[0,0],[0,0],[0,0],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0]],"v":[[26,-28],[34,-20],[34,4],[26,4],[26,-16.8],[22.8,-20],[-22.8,-20],[-25.99,-16.98],[-26,-16.8],[-26,16.8],[-22.98,19.99],[-22.8,20],[2,20],[2,28],[-26,28],[-34,20],[-34,-20],[-26,-28]],"c":true}]}],"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"\u7BAD\u5934","td":1,"sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":10,"s":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":30,"s":[100]},{"t":40,"s":[0]}],"ix":11},"r":{"a":0,"k":180,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":10,"s":[66.913,68.947,0],"to":[-2.062,-1.833,0],"ti":[0,0,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":20,"s":[54.538,57.947,0],"to":[0,0,0],"ti":[-2.062,-1.833,0]},{"t":30,"s":[66.913,68.947,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-0.78,-0.79],[0,0],[0,0],[-1.04,0.08],[0,0],[0,0],[-0.08,-1.04],[0,0],[0,0],[1.03,-0.07],[0,0],[0,0],[0.08,1.03],[0,0],[0,0],[-1.04,0.08],[0,0],[0,0],[0,0],[-0.79,0.79],[0,0]],"o":[[0,0],[0,0],[0,-1.06],[0,0],[0,0],[1.05,0],[0,0],[0,0],[0,1.05],[0,0],[0,0],[-1.06,0],[0,0],[0,0],[0,-1.06],[0,0],[0,0],[0,0],[-0.79,-0.78],[0,0],[0.79,-0.79]],"v":[[-4.038,-9.809],[2.282,-3.499],[2.282,-7.6],[4.132,-9.6],[4.282,-9.6],[8.282,-9.6],[10.272,-7.749],[10.282,-7.6],[10.282,8.4],[8.432,10.391],[8.282,10.4],[-7.718,10.4],[-9.718,8.551],[-9.718,8.4],[-9.718,4.4],[-7.868,2.4],[-7.718,2.4],[-3.138,2.4],[-9.688,-4.16],[-9.688,-6.99],[-6.868,-9.809]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":" \u5C0F\u7A97","tt":2,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[68,68,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":10,"s":[{"i":[[0,-2.209],[0,0],[2.209,0],[0,0],[0,2.209],[0,0],[-2.209,0],[0,0]],"o":[[0,0],[0,2.209],[0,0],[-2.209,0],[0,0],[0,-2.209],[0,0],[2.209,0]],"v":[[16,-8],[16,8],[12,12],[-12,12],[-16,8],[-16,-8],[-12,-12],[12,-12]],"c":true}]},{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0},"t":20,"s":[{"i":[[0,-2.209],[0,0],[2.209,0],[0,0],[0,2.209],[0,0],[-2.209,0],[0,0]],"o":[[0,0],[0,2.209],[0,0],[-2.209,0],[0,0],[0,-2.209],[0,0],[2.209,0]],"v":[[9.188,-30.25],[9.188,4.5],[5.188,8.5],[-40.375,8.625],[-44.375,4.625],[-44.375,-30.125],[-40.375,-34.125],[5.188,-34.25]],"c":true}]},{"t":40,"s":[{"i":[[0,-2.209],[0,0],[2.209,0],[0,0],[0,2.209],[0,0],[-2.209,0],[0,0]],"o":[[0,0],[0,2.209],[0,0],[-2.209,0],[0,0],[0,-2.209],[0,0],[2.209,0]],"v":[[16,-8],[16,8],[12,12],[-12,12],[-16,8],[-16,-8],[-12,-12],[12,-12]],"c":true}]}],"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"Rectangle","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300,"st":0,"bm":0}],"markers":[]}');

},{}],"kZYtt":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>volume);
var _volumeJson = require("./icon/volume.json");
var _volumeJsonDefault = parcelHelpers.interopDefault(_volumeJson);
var _muteJson = require("./icon/mute.json");
var _muteJsonDefault = parcelHelpers.interopDefault(_muteJson);
var _utils = require("./utils");
function volume(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const { proxy, constructor: { utils: { append, getIcon, setStyle, getRect } } } = art;
                let isDragging = false;
                const $volume = append($control, getIcon('volume'));
                const $close = append($control, getIcon('volumeClose'));
                const $panel = append($control, '<div class="art-volume-panel"></div>');
                const $inner = append($panel, '<div class="art-volume-inner"></div>');
                const $value = append($inner, `<div class="art-volume-val"></div>`);
                const $slider = append($inner, `<div class="art-volume-slider"></div>`);
                const $handle = append($slider, `<div class="art-volume-handle"></div>`);
                const $loaded = append($handle, `<div class="art-volume-loaded"></div>`);
                const $indicator = append($slider, `<div class="art-volume-indicator"></div>`);
                function getVolumeFromEvent(event) {
                    const { top, height } = getRect($slider);
                    return 1 - (event.clientY - top) / height;
                }
                const volumeAnimation = (0, _utils.createAnimation)({
                    name: "volume",
                    dom: $volume,
                    json: (0, _volumeJsonDefault.default)
                });
                const muteAnimation = (0, _utils.createAnimation)({
                    name: "mute",
                    dom: $close,
                    json: (0, _muteJsonDefault.default)
                });
                function update() {
                    if (art.muted || art.volume === 0) {
                        setStyle($volume, 'display', 'none');
                        setStyle($close, 'display', 'flex');
                        setStyle($indicator, 'top', '100%');
                        setStyle($loaded, 'top', '100%');
                        $value.textContent = 0;
                        muteAnimation.play();
                    } else {
                        const percentage = art.volume * 100;
                        setStyle($volume, 'display', 'flex');
                        setStyle($close, 'display', 'none');
                        setStyle($indicator, 'top', `${100 - percentage}%`);
                        setStyle($loaded, 'top', `${100 - percentage}%`);
                        $value.textContent = Math.floor(percentage);
                    }
                }
                update();
                art.on('video:volumechange', update);
                proxy($volume, 'click', ()=>{
                    art.muted = true;
                    volumeMouseEnter();
                });
                proxy($close, 'click', ()=>{
                    art.muted = false;
                    volumeMouseEnter();
                });
                const volumeMouseEnter = ()=>{
                    art.muted ? muteAnimation.play() : volumeAnimation.play();
                };
                const volumeComplete = ()=>{
                    volumeAnimation.stop();
                };
                const muteComplete = ()=>{
                    muteAnimation.stop();
                };
                proxy($control, "mouseenter", volumeMouseEnter);
                volumeAnimation.addEventListener("complete", volumeComplete);
                muteAnimation.addEventListener("complete", muteComplete);
                proxy($slider, 'mousedown', (event)=>{
                    isDragging = event.button === 0;
                    art.volume = getVolumeFromEvent(event);
                });
                art.on('document:mousemove', (event)=>{
                    if (isDragging) {
                        art.muted = false;
                        art.volume = getVolumeFromEvent(event);
                    }
                });
                art.on('document:mouseup', ()=>{
                    if (isDragging) isDragging = false;
                });
                art.on("destroy", ()=>{
                    volumeAnimation.destroy();
                    muteAnimation.destroy();
                });
            }
        });
}

},{"./icon/volume.json":"26EDB","./icon/mute.json":"aB54T","./utils":"MbBnn","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"26EDB":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":91,"w":88,"h":88,"nm":"\u97F3\u91CF hover","ddd":0,"assets":[{"id":"comp_0","layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u8DEF\u5F84","parent":8,"sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":2.5,"s":[100]},{"t":7.5,"s":[0]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[36.014,0.007,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-1.99,-0.95],[0,-12.45],[11.06,-5.27],[0.95,2],[-1.99,0.95],[0,9.35],[8.28,3.96],[-0.95,1.99]],"o":[[11.04,5.28],[0,12.46],[-1.99,0.95],[-0.95,-1.99],[8.3,-3.95],[0,-9.34],[-2,-0.95],[0.95,-2]],"v":[[-6.236,-28.896],[11.984,-0.006],[-6.266,28.894],[-11.596,27.004],[-9.706,21.674],[3.984,-0.006],[-9.676,-21.676],[-11.566,-27.006]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-7,"op":28,"st":-23,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"\u8DEF\u5F84","parent":8,"sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":0,"s":[100]},{"t":5,"s":[0]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[28,0,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,-5.92],[4.78,-2.77]],"o":[[4.78,2.77],[0,5.92],[0,0]],"v":[[-4,-13.859],[4,0.001],[-4,13.861]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-7,"op":28,"st":-23,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"\u5916\u90E8\u97F3\u6D6A 2","parent":8,"sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":28.334,"s":[0]},{"t":41.478515625,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.227,"y":1},"t":28.334,"s":[20.015,0.007,0],"to":[2.665,0,0],"ti":[-2.665,0,0]},{"t":46.48046875,"s":[36.004,0.007,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[1.002,1.002,0]},"t":28.334,"s":[79.017,79.017,100]},{"t":46.48046875,"s":[100.021,100.021,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-1.99,-0.95],[0,-12.45],[11.06,-5.27],[0.95,2],[-1.99,0.95],[0,9.35],[8.28,3.96],[-0.95,1.99]],"o":[[11.04,5.28],[0,12.46],[-1.99,0.95],[-0.95,-1.99],[8.3,-3.95],[0,-9.34],[-2,-0.95],[0.95,-2]],"v":[[-6.236,-28.896],[11.984,-0.006],[-6.266,28.894],[-11.596,27.004],[-9.706,21.674],[3.984,-0.006],[-9.676,-21.676],[-11.566,-27.006]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":34,"op":131,"st":24,"bm":0},{"ddd":0,"ind":4,"ty":4,"nm":"\u5185\u90E8\u97F3\u6D6A 2","parent":8,"sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":30.188,"s":[0]},{"t":43.333984375,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.201,"y":1},"t":30.188,"s":[12.749,0,0],"to":[2.542,0,0],"ti":[-2.542,0,0]},{"t":48.333984375,"s":[28.003,0,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[1.058,1.058,0]},"t":30.188,"s":[79.017,79.017,100]},{"t":48.333984375,"s":[100.021,100.021,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,-5.92],[4.78,-2.77]],"o":[[4.78,2.77],[0,5.92],[0,0]],"v":[[-4,-13.859],[4,0.001],[-4,13.861]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":39,"op":129,"st":23,"bm":0},{"ddd":0,"ind":5,"ty":4,"nm":"\u5916\u90E8\u97F3\u6D6A","parent":8,"sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":6.666,"s":[0]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":14.465,"s":[100]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":17.648,"s":[100]},{"t":26.3984375,"s":[0]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0.907},"t":6.666,"s":[20.015,0.007,0],"to":[3.859,0,0],"ti":[-3.859,0,0]},{"t":24.166015625,"s":[43.171,0.007,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0.336,0.336,0]},"t":6.666,"s":[79.017,79.017,100]},{"t":24.166015625,"s":[135.021,135.021,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-1.99,-0.95],[0,-12.45],[11.06,-5.27],[0.95,2],[-1.99,0.95],[0,9.35],[8.28,3.96],[-0.95,1.99]],"o":[[11.04,5.28],[0,12.46],[-1.99,0.95],[-0.95,-1.99],[8.3,-3.95],[0,-9.34],[-2,-0.95],[0.95,-2]],"v":[[-6.236,-28.896],[11.984,-0.006],[-6.266,28.894],[-11.596,27.004],[-9.706,21.674],[3.984,-0.006],[-9.676,-21.676],[-11.566,-27.006]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":8,"op":68,"st":-2,"bm":0},{"ddd":0,"ind":6,"ty":4,"nm":"\u5185\u90E8\u97F3\u6D6A","parent":8,"sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":10.533,"s":[0]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":18.334,"s":[100]},{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":22.916,"s":[100]},{"t":31.666015625,"s":[0]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.296,"y":1},"t":10.533,"s":[12.749,0,0],"to":[3.209,0,0],"ti":[-3.209,0,0]},{"t":27.291015625,"s":[32.003,0,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0.346,0.346,0]},"t":10.533,"s":[79.017,79.017,100]},{"t":27.291015625,"s":[134.021,134.021,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,-5.92],[4.78,-2.77]],"o":[[4.78,2.77],[0,5.92],[0,0]],"v":[[-4,-13.859],[4,0.001],[-4,13.861]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":15,"op":68,"st":-1,"bm":0},{"ddd":0,"ind":7,"ty":4,"nm":" \u4E3B\u4F53 3","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[44,44.002,0],"ix":2},"a":{"a":0,"k":[16,0.002,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":0,"s":[100,100,100]},{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.167,0.167,0.167],"y":[0,0,0]},"t":13.334,"s":[88,88,100]},{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.167,0.167,0.167],"y":[0,0,0]},"t":30.834,"s":[88,88,100]},{"t":50,"s":[100,100,100]}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-0.69,-0.86],[0,-0.45],[0,0],[1.1,0],[0.36,0.28],[0,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,0]],"o":[[0.29,0.36],[0,0],[0,1.1],[-0.45,0],[0,0],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0],[0,0],[0.86,-0.69]],"v":[[15.56,-25.089],[16,-23.839],[16,23.841],[14,25.841],[12.75,25.401],[-4,12.001],[-8,12.001],[-16,4.001],[-16,-3.999],[-8,-11.999],[-4,-11.999],[12.75,-25.399]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u8DEF\u5F84","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-8,"op":315,"st":15,"bm":0},{"ddd":0,"ind":8,"ty":3,"nm":" \u4E3B\u4F53 2","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[44,44.002,0],"ix":2},"a":{"a":0,"k":[16,0.002,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":0,"s":[100,100,100]},{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.167,0.167,0.167],"y":[0,0,0]},"t":6.871,"s":[75,75,100]},{"i":{"x":[0,0,0.833],"y":[1,1,1]},"o":{"x":[0.167,0.167,0.167],"y":[0,0,0]},"t":30.834,"s":[75,75,100]},{"t":50,"s":[100,100,100]}],"ix":6}},"ao":0,"ip":-8,"op":315,"st":15,"bm":0}]}],"layers":[{"ddd":0,"ind":1,"ty":0,"nm":" \u97F3\u91CF hover \u65F6\u95F4\u91CD\u6620\u5C04","refId":"comp_0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[44,44,0],"ix":2},"a":{"a":0,"k":[44,44,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"tm":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":60,"s":[1]},{"t":300,"s":[5]}],"ix":2},"w":88,"h":88,"ip":0,"op":300,"st":0,"bm":0}],"markers":[]}');

},{}],"aB54T":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":60,"w":88,"h":88,"nm":"\u9759\u97F3\u6D88\u9664hover","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Path 4","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.502,"y":0},"o":{"x":0.167,"y":0},"t":0,"s":[41.172,46.828,0],"to":[0.417,0.417,0],"ti":[0.417,0.5,0]},{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0.205},"t":8.666,"s":[43.672,49.328,0],"to":[-0.417,-0.5,0],"ti":[0.417,0.417,0]},{"i":{"x":0,"y":1},"o":{"x":0.167,"y":0},"t":14,"s":[38.672,43.828,0],"to":[-0.417,-0.417,0],"ti":[-0.417,-0.5,0]},{"i":{"x":0,"y":0},"o":{"x":0.167,"y":0.167},"t":16.666,"s":[41.172,46.828,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.502,"y":0},"o":{"x":0.167,"y":0},"t":22.666,"s":[41.172,46.828,0],"to":[0.417,0.417,0],"ti":[0.417,0.5,0]},{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0.205},"t":31.334,"s":[43.672,49.328,0],"to":[-0.417,-0.5,0],"ti":[0.417,0.417,0]},{"i":{"x":0,"y":1},"o":{"x":0.167,"y":0},"t":36.666,"s":[38.672,43.828,0],"to":[-0.417,-0.417,0],"ti":[-0.417,-0.5,0]},{"t":40,"s":[41.172,46.828,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-36.77,-31.11],[-31.11,-36.77],[36.77,31.11],[31.11,36.77]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"rd","nm":"\u5706\u89D2 1","r":{"a":0,"k":4,"ix":1},"ix":2,"mn":"ADBE Vector Filter - RC","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-0.5,-0.5],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"Path","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-66,"op":183,"st":-83,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"Path 3","td":1,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.222,"y":0},"o":{"x":0.167,"y":0},"t":0,"s":[47.422,41.703,0],"to":[0.667,0.667,0],"ti":[0.417,0.5,0]},{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0.159},"t":8.666,"s":[51.422,45.703,0],"to":[-0.417,-0.5,0],"ti":[0.667,0.667,0]},{"i":{"x":0,"y":1},"o":{"x":0.167,"y":0},"t":14,"s":[44.922,38.703,0],"to":[-0.667,-0.667,0],"ti":[-0.417,-0.5,0]},{"i":{"x":0,"y":0},"o":{"x":0.167,"y":0.167},"t":16.666,"s":[47.422,41.703,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.222,"y":0},"o":{"x":0.167,"y":0},"t":22.666,"s":[47.422,41.703,0],"to":[0.667,0.667,0],"ti":[0.417,0.5,0]},{"i":{"x":0,"y":1},"o":{"x":0.333,"y":0.159},"t":31.334,"s":[51.422,45.703,0],"to":[-0.417,-0.5,0],"ti":[0.667,0.667,0]},{"i":{"x":0,"y":1},"o":{"x":0.167,"y":0},"t":36.666,"s":[44.922,38.703,0],"to":[-0.667,-0.667,0],"ti":[-0.417,-0.5,0]},{"t":40,"s":[47.422,41.703,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-36.77,-31.11],[-31.11,-36.77],[36.77,31.11],[31.11,36.77]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"rd","nm":"\u5706\u89D2 1","r":{"a":0,"k":4,"ix":1},"ix":2,"mn":"ADBE Vector Filter - RC","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-0.5,-0.5],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"Path","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-66,"op":183,"st":-83,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"\u5F62\u72B6","tt":2,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.333,"y":0.876},"o":{"x":0.167,"y":0},"t":0,"s":[44,44,0],"to":[1.167,1.25,0],"ti":[0,0,0]},{"i":{"x":0.667,"y":0.884},"o":{"x":0.275,"y":0.021},"t":7.334,"s":[51,51.5,0],"to":[0,0,0],"ti":[-0.352,-0.352,0]},{"i":{"x":0.833,"y":1},"o":{"x":0.111,"y":0.066},"t":12.666,"s":[38.039,38.539,0],"to":[0.748,0.748,0],"ti":[-0.417,-0.417,0]},{"i":{"x":0,"y":1},"o":{"x":0.167,"y":0},"t":16.666,"s":[44,44,0],"to":[0.133,0.133,0],"ti":[0,0,0]},{"i":{"x":0.333,"y":0.904},"o":{"x":0.167,"y":0},"t":22.666,"s":[44,44,0],"to":[1.667,1.75,0],"ti":[0,0,0]},{"i":{"x":0.667,"y":0.923},"o":{"x":0.275,"y":0.014},"t":30.666,"s":[54,54.5,0],"to":[0,0,0],"ti":[-0.352,-0.352,0]},{"i":{"x":0.833,"y":1},"o":{"x":0.111,"y":0.04},"t":36,"s":[34.289,34.789,0],"to":[0.748,0.748,0],"ti":[-0.417,-0.417,0]},{"t":40,"s":[44,44,0]}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,-5.92],[4.78,-2.77]],"o":[[4.78,2.77],[0,5.92],[0,0]],"v":[[8,-13.866],[16,-0.006],[8,13.854]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[-1.99,-0.95],[0,-12.45],[11.06,-5.27],[0.95,2],[-1.99,0.95],[0,9.35],[8.28,3.96],[-0.95,1.99]],"o":[[11.04,5.28],[0,12.46],[-1.99,0.95],[-0.95,-1.99],[8.3,-3.95],[0,-9.34],[-2,-0.95],[0.95,-2]],"v":[[13.778,-28.896],[31.998,-0.006],[13.748,28.894],[8.418,27.004],[10.308,21.674],[23.998,-0.006],[10.338,-21.676],[8.448,-27.006]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 2","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[-0.69,-0.86],[0,-0.45],[0,0],[1.1,0],[0.36,0.28],[0,0],[0,0],[0,4.42],[0,0],[-4.42,0],[0,0],[0,0]],"o":[[0.29,0.36],[0,0],[0,1.1],[-0.45,0],[0,0],[0,0],[-4.42,0],[0,0],[0,-4.42],[0,0],[0,0],[0.86,-0.69]],"v":[[-0.44,-25.096],[0,-23.846],[0,23.834],[-2,25.834],[-3.25,25.394],[-20,11.994],[-24,11.994],[-32,3.994],[-32,-4.006],[-24,-12.006],[-20,-12.006],[-3.25,-25.406]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 3","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"\u5408\u5E76\u8DEF\u5F84 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"\u586B\u5145 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"\u5F62\u72B6","np":5,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":-83,"op":239,"st":-83,"bm":0}],"markers":[]}');

},{}],"bZrNz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>playAndPause);
var _pausePlayJson = require("./icon/pause-play.json");
var _pausePlayJsonDefault = parcelHelpers.interopDefault(_pausePlayJson);
var _playPauseJson = require("./icon/play-pause.json");
var _playPauseJsonDefault = parcelHelpers.interopDefault(_playPauseJson);
var _utils = require("./utils");
function playAndPause(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const { proxy, constructor: { utils: { append, getIcon } } } = art;
                let animation = null;
                const $playPause = append($control, getIcon("playPause"));
                const createplayPauseAnimation = (t)=>{
                    if (animation) animation.destroy(); // 销毁原有的 Animation 实例
                    animation = (0, _utils.createAnimation)({
                        name: "play",
                        dom: $playPause,
                        json: t ? (0, _pausePlayJsonDefault.default) : (0, _playPauseJsonDefault.default)
                    });
                    return animation;
                };
                const toggleAnimation = ()=>{
                    createplayPauseAnimation(art.playing).play();
                };
                proxy($playPause, "click", ()=>{
                    if (!art.playing) art.play();
                    else art.pause();
                    toggleAnimation();
                });
                toggleAnimation(); // 初始化时切换动画状态
                art.on("video:play", ()=>{
                    createplayPauseAnimation(true).play();
                });
                art.on("video:pause", ()=>{
                    createplayPauseAnimation(false).play();
                });
                art.on("destroy", ()=>{
                    animation.destroy();
                });
            }
        });
}

},{"./icon/pause-play.json":"8kK8u","./icon/play-pause.json":"RRy7D","./utils":"MbBnn","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"8kK8u":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":60,"w":28,"h":28,"nm":"\u6682\u505C->\u64AD\u653E","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u5F62\u72B6\u56FE\u5C42 3","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.67],"y":[1]},"o":{"x":[0.33],"y":[0]},"t":0,"s":[100],"e":[0]},{"t":10}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.67,"y":1},"o":{"x":1,"y":0},"t":0,"s":[14.6,14,0],"e":[4,14,0],"to":[1.583,0,0],"ti":[0,0,0]},{"t":12}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[1.094,-0.781],[0,0],[0,0],[-1.125,-0.75],[0,0],[0,0],[0,1.062],[0,0]],"o":[[0,0],[-0.688,0.562],[0,0],[0,0],[1.125,0.75],[0,0],[0,0],[0,-1.062],[0,0]],"v":[[-7.031,-10.875],[-9.422,-10.469],[-10,-7.992],[-10,8.016],[-9,10.992],[-5,10.031],[7.969,1.875],[9,0],[7.969,-1.938]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"?? 2","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"?? 1","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":-5,"op":88,"st":-5,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"\u5F62\u72B6\u56FE\u5C42 2","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":11.199,"s":[0],"e":[100]},{"t":20.80078125}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[24.812,14,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[0.809,0.809,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":6.4,"s":[0,0,100],"e":[110,110,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[-0.525,-0.525,0]},"t":16,"s":[110,110,100],"e":[90,90,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":20.801,"s":[90,90,100],"e":[100,100,100]},{"t":28}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[2.469,0],[0,0],[0,0],[-2.484,0],[0,0],[0,0]],"o":[[-2.469,0],[0,0],[0,0],[2.484,0],[0,0],[0,0]],"v":[[-5.484,-10],[-8,-7.984],[-8.008,7.984],[-5.5,9.992],[-3.004,7.996],[-2.984,-8]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"?? 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":4,"op":70,"st":4,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"\u5F62\u72B6\u56FE\u5C42 1","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.571],"y":[1]},"o":{"x":[0.05],"y":[0]},"t":4,"s":[0],"e":[100]},{"t":23.19921875}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"s":true,"x":{"a":1,"k":[{"i":{"x":[0.889],"y":[1]},"o":{"x":[0.192],"y":[0.965]},"t":4,"s":[25],"e":[14]},{"t":23.19921875}],"ix":3},"y":{"a":1,"k":[{"i":{"x":[0.95],"y":[1]},"o":{"x":[0.05],"y":[0]},"t":4,"s":[14],"e":[14]},{"t":23.19921875}],"ix":4}},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[2.469,0],[0,0],[0,0],[-2.484,0],[0,0],[0,0]],"o":[[-2.469,0],[0,0],[0,0],[2.484,0],[0,0],[0,0]],"v":[[-5.484,-10],[-8,-7.984],[-8.008,7.984],[-5.5,9.992],[-3.004,7.996],[-2.984,-8]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"?? 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":4,"op":70,"st":4,"bm":0}],"markers":[]}');

},{}],"RRy7D":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"v":"5.6.7","fr":60,"ip":0,"op":60,"w":28,"h":28,"nm":"\u64AD\u653E->\u6682\u505C","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"\u5F62\u72B6\u56FE\u5C42 1","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":7.199,"s":[0],"e":[100]},{"t":26.400390625}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":4.801,"s":[4,14,0],"e":[14.6,14,0],"to":[1.767,0,0],"ti":[-1.583,0,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":24,"s":[14.6,14,0],"e":[13.5,14,0],"to":[1.583,0,0],"ti":[0.1,0,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.333,"y":0},"t":28.801,"s":[13.5,14,0],"e":[14,14,0],"to":[-0.1,0,0],"ti":[-0.083,0,0]},{"t":38.400390625}],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[1.094,-0.781],[0,0],[0,0],[-1.125,-0.75],[0,0],[0,0],[0,1.062],[0,0]],"o":[[0,0],[-0.688,0.562],[0,0],[0,0],[1.125,0.75],[0,0],[0,0],[0,-1.062],[0,0]],"v":[[-7.031,-10.875],[-9.422,-10.469],[-10,-7.992],[-10,8.016],[-9,10.992],[-5,10.031],[7.969,1.875],[9,0],[7.969,-1.938]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"?? 2","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"?? 1","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":93,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"\u5F62\u72B6\u56FE\u5C42 3","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[100],"e":[0]},{"t":9.599609375}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"s":true,"x":{"a":1,"k":[{"i":{"x":[0.259],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[8.75],"e":[19]},{"t":9.599609375}],"ix":3},"y":{"a":0,"k":14,"ix":4}},"a":{"a":0,"k":[-5.25,0,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":4.801,"s":[100,100,100],"e":[0,0,100]},{"t":16.80078125}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[2.469,0],[0,0],[0,0],[-2.484,0],[0,0],[0,0]],"o":[[-2.469,0],[0,0],[0,0],[2.484,0],[0,0],[0,0]],"v":[[-5.484,-10],[-8,-7.984],[-8.008,7.984],[-5.5,9.992],[-3.004,7.996],[-2.984,-8]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"?? 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":93,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"\u5F62\u72B6\u56FE\u5C42 2","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[100],"e":[0]},{"t":12}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[19.438,14.125,0],"ix":2},"a":{"a":0,"k":[-5.375,0.125,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":0,"s":[100,100,100],"e":[0,0,100]},{"t":16.80078125}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[2.469,0],[0,0],[0,0],[-2.484,0],[0,0],[0,0]],"o":[[-2.469,0],[0,0],[0,0],[2.484,0],[0,0],[0,0]],"v":[[-5.484,-10],[-8,-7.984],[-8.008,7.984],[-5.5,9.992],[-3.004,7.996],[-2.984,-8]],"c":true},"ix":2},"nm":"\u8DEF\u5F84 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":0,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[1,1,1,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"?? 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"\u53D8\u6362"}],"nm":"?? 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":93,"st":0,"bm":0}],"markers":[]}');

},{}]},["bppPX"], "bppPX", "parcelRequire4dc0", {})

//# sourceMappingURL=index.js.map
