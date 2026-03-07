/*!
 * artplayer-plugin-auto-thumbnail.js v1.0.2
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
!function(e,t){"object"===typeof exports&&"undefined"!==typeof module?module.exports=t():"function"==typeof define&&define.amd?(t.ArtplayerPluginAutoThumbnail=t(),define(function(){return t.ArtplayerPluginAutoThumbnail})):(e="undefined"!==typeof globalThis?globalThis:e||self).ArtplayerPluginAutoThumbnail=t()}(this,function(){"use strict";function e(e){return async t=>(t.on("video:loadedmetadata",()=>{const n=e.url||t.option.url,o=e.width||160,i=e.number||100,u=e.scale||1;!function({url:e,width:t,number:n},o){const i=document.createElement("video");i.crossOrigin="anonymous",i.src=e,i.onloadedmetadata=()=>{const e=i.duration,u=document.createElement("canvas"),a=u.getContext("2d"),d=Math.floor(t*i.videoHeight/i.videoWidth);u.width=10*t,u.height=d*Math.ceil(n/10);let l=null;!function r(c){u.toBlob(e=>{URL.revokeObjectURL(l),l=URL.createObjectURL(e),o({url:l,height:d})},"image/jpeg"),c>=n||(i.currentTime=e*c/n,i.onseeked=()=>{a.drawImage(i,c%10*t,Math.floor(c/10)*d,t,d),r(c+1)})}(0)}}({url:n,width:o,number:i},e=>{t.thumbnails={...e,column:10,number:i,width:o,scale:u}})}),{name:"artplayerPluginAutoThumbnail"})}return"undefined"!==typeof window&&(window.artplayerPluginAutoThumbnail=e),e});
