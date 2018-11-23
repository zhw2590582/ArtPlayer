(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['artplayer-plugin-subtitle'] = {})));
}(this, (function (exports) { 'use strict';

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

	function artplayerPluginSubtitle(option) {
	  return function (art) {
	    var _art$constructor$util = art.constructor.utils,
	        errorHandle = _art$constructor$util.errorHandle,
	        clamp = _art$constructor$util.clamp,
	        sleep = _art$constructor$util.sleep;
	    errorHandle(option && typeof option.time === 'number', "The plugin 'artplayerPluginSubtitle': 'option.time' require 'number' type, but got '".concat(_typeof_1(option.time), "'"));
	    var retry = 0;
	    var maxRetry = 10;
	    var time = clamp(option.time, -10, 10);

	    function adjust() {
	      errorHandle(retry < maxRetry, 'It seems that something wrong for reading subtitle');
	      retry += 1;
	      var cues = Array.from(art.refs.$track.track.cues);

	      if (cues.length === 0) {
	        sleep(100).then(adjust);
	      } else {
	        cues.forEach(function (cue) {
	          cue.startTime += time;
	          cue.endTime += time;
	        });
	      }
	    }

	    art.on('subtitle:load', adjust);
	  };
	}

	window.artplayerPluginSubtitle = artplayerPluginSubtitle;

	exports.default = artplayerPluginSubtitle;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer-plugin-subtitle.js.map
