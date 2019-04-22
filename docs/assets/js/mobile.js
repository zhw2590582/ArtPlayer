var vConsole = new VConsole();
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    // whitelist: ['iPhone OS 11'],
    // whitelist: [(ua)=>{ return /iPhone OS 11/gi.test(ua); }],
    // whitelist: [/iPhone OS 11/gi]
});

console.warn('ArtPlayer.js: 移动端功能尚未完成适配，请用电脑打开.')
