/*!
 * artplayer-plugin-audio-track.js v1.0.2
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function e(e){return a=>{let{url:o,offset:n=0,sync:t=.3}=e;const u=new Audio;function c(){if(!a.video||!o)return;const e=a.currentTime+n;Math.abs(u.currentTime-e)>t&&(u.currentTime=e)}return u.preload="auto",o&&(u.src=o),a.on("play",()=>{o&&(c(),u.play().catch(e=>{console.warn(e)}))}),a.on("pause",()=>{u.pause()}),a.on("seek",()=>{c()}),a.on("video:timeupdate",()=>{a.playing&&c()}),a.on("video:ratechange",()=>{u.playbackRate=a.video.playbackRate}),a.on("video:volumechange",()=>{u.volume=a.volume,u.muted=a.muted}),a.on("video:waiting",()=>{u.pause()}),a.on("video:playing",()=>{o&&a.playing&&u.play().catch(e=>{console.warn(e)})}),a.on("destroy",()=>{u.pause(),u.src="",u.load()}),u.volume=a.volume,u.muted=a.muted,u.playbackRate=a.video?.playbackRate||1,{name:"artplayerPluginAudioTrack",audio:u,update:function(e){e.url&&e.url!==o&&(o=e.url,u.src=o,a.playing&&u.play().catch(e=>console.warn(e))),void 0!==e.offset&&(n=e.offset),void 0!==e.sync&&(t=e.sync)}}}}export{e as default};
