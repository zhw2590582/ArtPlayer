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
	  var player = art.player;
	  return {
	    name: 'artplayerPluginBlur',
	    attach: function attach($ref) {
	      var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
	      errorHandle($ref instanceof Element, 'The attach element is not a dom element');
	      $ref.style.backgroundRepeat = 'no-repeat';
	      $ref.style.transition = 'all .2s ease';

	      function show() {
	        var _$ref$getBoundingClie = $ref.getBoundingClientRect(),
	            left = _$ref$getBoundingClie.left,
	            top = _$ref$getBoundingClie.top;

	        $ref.style.backgroundImage = 'none';
	        $ref.style.backgroundSize = "".concat(player.width, "px ").concat(player.height, "px");
	        $ref.style.backgroundPosition = "".concat(player.left - left, "px ").concat(player.top - top, "px");
	        player.getScreenshotBlobUrl().then(function (url) {
	          blurImageUrl(url, clamp(radius, 0, 50)).then(function (img) {
	            $ref.style.backgroundImage = "url(".concat(img, ")");
	            $ref.style.visibility = 'visible';
	            $ref.style.opacity = '1';
	            $ref.style.pointerEvents = 'auto';
	          });
	        });
	      }

	      function hide() {
	        $ref.style.visibility = 'hidden';
	        $ref.style.opacity = '0';
	        $ref.style.pointerEvents = 'none';
	        $ref.style.backgroundImage = 'none';
	      }

	      hide();
	      art.on('video:pause', show);
	      art.on('video:ended', show);
	      art.on('video:seeked', show);
	      art.on('video:playing', hide);
	      art.on('video:timeupdate', hide);
	    }
	  };
	}

	return artplayerPluginBlur;

}));
//# sourceMappingURL=artplayer-plugin-blur.js.map
