/*!
 * artplayer-plugin-auto-thumbnail.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
!function(e,t){"object"===typeof exports&&"undefined"!==typeof module?module.exports=t():"function"==typeof define&&define.amd?(t.artplayerPluginAutoThumbnail=t(),define(function(){return t.artplayerPluginAutoThumbnail})):(e="undefined"!==typeof globalThis?globalThis:e||self).artplayerPluginAutoThumbnail=t()}(this,function(){"use strict";return function(e){return async t=>(t.on("video:loadedmetadata",()=>{const n=e.url||t.option.url,o=e.width||160,i=e.number||100,u=e.scale||1;!function({url:e,width:t,number:n},o){const i=document.createElement("video");i.crossOrigin="anonymous",i.src=e,i.onloadedmetadata=()=>{const e=i.duration,u=document.createElement("canvas"),a=u.getContext("2d"),l=Math.floor(t*i.videoHeight/i.videoWidth);u.width=10*t,u.height=l*Math.ceil(n/10);let r=null;!function d(c){u.toBlob(e=>{URL.revokeObjectURL(r),r=URL.createObjectURL(e),o({url:r,height:l})},"image/jpeg"),c>=n||(i.currentTime=e*c/n,i.onseeked=()=>{a.drawImage(i,c%10*t,Math.floor(c/10)*l,t,l),d(c+1)})}(0)}}({url:n,width:o,number:i},e=>{t.thumbnails={...e,column:10,number:i,width:o,scale:u}})}),{name:"artplayerPluginAutoThumbnail"})}});
