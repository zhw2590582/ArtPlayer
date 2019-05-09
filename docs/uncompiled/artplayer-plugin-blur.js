(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.artplayerPluginBlur = factory());
}(this, function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var blurImageUrl = createCommonjsModule(function (module, exports) {
	(function(window, factory) {
	  {
	    module.exports = factory();
	  }
	})(commonjsGlobal, function() {
	  return function blurImageUrl(url, radius) {
	    return new Promise(function(resolve) {
	      var img = new Image();
	      img.onload = function() {
	        var w = img.naturalWidth;
	        var h = img.naturalHeight;
	        var canvas = document.createElement('canvas');
	        canvas.style.width = w + 'px';
	        canvas.style.height = h + 'px';
	        canvas.width = w;
	        canvas.height = h;
	        var context = canvas.getContext('2d');
	        context.filter = 'blur(' + radius + 'px)';
	        context.drawImage(
	          img,
	          -radius,
	          -radius,
	          w + radius * 2,
	          h + radius * 2
	        );
	        canvas.toBlob(function(blob) {
	          resolve(URL.createObjectURL(blob));
	          img.onload = null;
	        });
	      };
	      img.src = url;
	    });
	  };
	});
	});

	function artplayerPluginBlur(art) {
	  var _art$constructor$util = art.constructor.utils,
	      errorHandle = _art$constructor$util.errorHandle,
	      clamp = _art$constructor$util.clamp;
	  errorHandle(CanvasRenderingContext2D && Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, 'filter'), 'artplayerPluginBlur: Your browser does not support canvas blur');
	  var player = art.player;
	  var blurUrlCache = '';
	  return {
	    name: 'artplayerPluginBlur',
	    attach: function attach($ref) {
	      var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
	      errorHandle($ref instanceof Element, 'The attach element is not a dom element');
	      $ref.style.backgroundRepeat = 'no-repeat';
	      $ref.style.transition = 'all .2s ease';

	      function hide() {
	        window.URL.revokeObjectURL(blurUrlCache);
	        $ref.classList.remove('artplayer-blur-show');
	        $ref.style.visibility = 'hidden';
	        $ref.style.opacity = '0';
	        $ref.style.backgroundImage = 'none';
	      }

	      function show() {
	        var _$ref$getBoundingClie = $ref.getBoundingClientRect(),
	            left = _$ref$getBoundingClie.left,
	            top = _$ref$getBoundingClie.top;

	        $ref.style.backgroundImage = 'none';
	        $ref.style.backgroundSize = "".concat(player.width, "px ").concat(player.height, "px");
	        $ref.style.backgroundPosition = "".concat(player.left - left, "px ").concat(player.top - top, "px");
	        var time = player.currentTime;
	        player.getScreenshotBlobUrl().then(function (screenshotBlobUrl) {
	          blurImageUrl(screenshotBlobUrl, clamp(radius, 0, 50)).then(function (blurUrl) {
	            window.URL.revokeObjectURL(screenshotBlobUrl);

	            if (!player.playing && time === player.currentTime) {
	              blurUrlCache = blurUrl;
	              $ref.classList.add('artplayer-blur-show');
	              $ref.style.visibility = 'visible';
	              $ref.style.opacity = '1';
	              $ref.style.backgroundImage = "url(".concat(blurUrl, ")");
	            } else {
	              hide();
	            }
	          });
	        });
	      }

	      hide();
	      art.on('video:pause', show);
	      art.on('video:seeked', show);
	      art.on('video:playing', hide);
	      art.on('video:seeking', hide);
	      art.on('video:timeupdate', hide);
	    }
	  };
	}

	return artplayerPluginBlur;

}));
//# sourceMappingURL=artplayer-plugin-blur.js.map
