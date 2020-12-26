/*!
 * artplayer-plugin-ass.js v3.5.27
 * Github: https://github.com/zhw2590582/ArtPlayer#readme
 * (c) 2017-2020 Harvey Zack
 * Released under the MIT License.
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("assjs")):"function"==typeof define&&define.amd?define(["assjs"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).artplayerPluginAss=t(e.ASS)}(this,(function(e){"use strict";function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var n=t(e);return function(e,t){void 0===t&&(t={});var n=t.insertAt;if(e&&"undefined"!=typeof document){var i=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css","top"===n&&i.firstChild?i.insertBefore(r,i.firstChild):i.appendChild(r),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(document.createTextNode(e))}}(".artplayer-plugin-ass{bottom:0!important}"),function(e){return function(t){var i=null;return fetch(e).then((function(e){return e.text()})).then((function(e){var r=t.template,s=r.$video,o=r.$subtitle;o.classList.add("artplayer-plugin-ass"),t.once("ready",(function(){(i=new n.default(e,s,{container:o,resampling:"video_width"})).resize(),t.emit("artplayerPluginAss",i),t.on("resize",(function(){return i.resize()})),t.on("destroy",(function(){return i.destroy()}))}))})),{name:"artplayerPluginAss",ass:i}}}}));
