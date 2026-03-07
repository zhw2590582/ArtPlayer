/*!
 * artplayer-plugin-auto-thumbnail.js v1.0.2
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function e(e){return async t=>(t.on("video:loadedmetadata",()=>{const n=e.url||t.option.url,o=e.width||160,a=e.number||100,r=e.scale||1;!function({url:e,width:t,number:n},o){const a=document.createElement("video");a.crossOrigin="anonymous",a.src=e,a.onloadedmetadata=()=>{const e=a.duration,r=document.createElement("canvas"),i=r.getContext("2d"),u=Math.floor(t*a.videoHeight/a.videoWidth);r.width=10*t,r.height=u*Math.ceil(n/10);let l=null;!function d(c){r.toBlob(e=>{URL.revokeObjectURL(l),l=URL.createObjectURL(e),o({url:l,height:u})},"image/jpeg"),c>=n||(a.currentTime=e*c/n,a.onseeked=()=>{i.drawImage(a,c%10*t,Math.floor(c/10)*u,t,u),d(c+1)})}(0)}}({url:n,width:o,number:a},e=>{t.thumbnails={...e,column:10,number:a,width:o,scale:r}})}),{name:"artplayerPluginAutoThumbnail"})}export{e as default};
