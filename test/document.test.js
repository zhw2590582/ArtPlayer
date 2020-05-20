
describe('Document', function() {
    afterEach(function() {
        [...Artplayer.instances].forEach(art => {
            art.destroy(true);
        });
    });

    
    it(`Configuration.container`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

    });
        

    it(`Class.version`, function() {
            
console.info(Artplayer.version);

    });
        

    it(`Class.env`, function() {
            
console.info(Artplayer.env);

    });
        

    it(`Class.config`, function() {
            
console.info(Artplayer.config);

    });
        

    it(`Class.utils`, function() {
            
console.info(Object.keys(Artplayer.utils));

    });
        

    it(`Class.option`, function() {
            
console.log(Artplayer.option);

    });
        

    it(`Class.instances`, function() {
            
console.info(Artplayer.instances);

    });
        

    it(`Class.scheme`, function() {
            
console.info(Artplayer.scheme);

    });
        

    it(`Class.validator`, function() {
            
console.info(Artplayer.validator);

    });
        

    it(`Class.kindOf`, function() {
            
console.info(Artplayer.kindOf);

    });
        

    it(`Class.Emitter`, function() {
            
console.info(Artplayer.Emitter);

    });
        

    it(`Events.canplay`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:canplay', function (event) {
    console.info(event);
});

    });
        

    it(`Events.example`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', function (args) {
    console.info('The player can play');
});

    });
        

    it(`lib=https://cdn.bootcss.com/flv.js/1.4.2/flv.js`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url: '/assets/sample/video.flv',
    customType: {
        flv: function (video, url) {
            const flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: url,
            });
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
        },
    },
});

    });
        

    it(`lib=https://cdn.bootcss.com/hls.js/0.10.1/hls.js`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    customType: {
        m3u8: function (video, url) {
            var hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        },
    },
});

    });
        

    it(`lib=https://cdn.bootcss.com/dashjs/2.9.2/dash.all.min.js`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
    customType: {
        mpd: function (video, url) {
            var player = dashjs.MediaPlayer().create();
            player.initialize(video, url, true);
        },
    },
});

    });
        

    it(`lib=https://cdn.bootcss.com/shaka-player/2.5.0-beta/shaka-player.compiled.js`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url: '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    customType: {
        mpd: function (video, url) {
            shaka.polyfill.installAll();
            var player = new shaka.Player(video);
            player.load(url);
        },
    },
});

    });
        

    it(`lib=https://cdn.bootcss.com/webtorrent/0.102.4/webtorrent.min.js`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url:
        'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4',
    type: 'torrent',
    customType: {
        torrent: function (video, url, art) {
            var client = new WebTorrent();
            art.loading.show = true;
            client.add(url, function (torrent) {
                var file = torrent.files[0];
                file.renderTo(video, {
                    autoplay: true,
                });
            });
        },
    },
});

    });
        

    it(`Configuration.container`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
});

    });
        

    it(`Configuration.url`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

    });
        

    it(`Configuration.type`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.flv',
    type: 'flv',
});

    });
        

    it(`Configuration.customType`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.flv',
    type: 'flv',
    customType: {
        flv: function (video, url, art) {
            // video: The video element
            // url: The video url
            // art: The Artplayer instance
        },
    },
});

    });
        

    it(`Configuration.poster`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
});

    });
        

    it(`Configuration.title`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    title: '【新海诚动画】『秒速5センチメートル』',
    screenshot: true,
});

    });
        

    it(`Configuration.volume`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});

    });
        

    it(`Configuration.muted`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

    });
        

    it(`Configuration.autoplay`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoplay: true,
});

    });
        

    it(`Configuration.autoSize`, function() {
            
// Zoom browser window

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
});

    });
        

    it(`Configuration.autoMin`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoMin: true,
});

    });
        

    it(`Configuration.loop`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    loop: true,
});

    });
        

    it(`Configuration.playbackRate`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    playbackRate: true,
    setting: true,
});

    });
        

    it(`Configuration.aspectRatio`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    aspectRatio: true,
    setting: true,
});

    });
        

    it(`Configuration.screenshot`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,

    // Optional
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
});

    });
        

    it(`Configuration.setting`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});

    });
        

    it(`Configuration.pip`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    pip: true,
});

    });
        

    it(`Configuration.fullscreen`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
});

    });
        

    it(`Configuration.fullscreenWeb`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});

    });
        

    it(`Configuration.mutex`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    mutex: true,
});

    });
        

    it(`Configuration.light`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    light: true,
});

    });
        

    it(`Configuration.backdrop`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    backdrop: true,
});

    });
        

    it(`Configuration.hotkey`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    hotkey: true,
});

    });
        

    it(`Configuration.lang`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'en',
});

    });
        

    it(`Configuration.icons`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    icons: {
        loading: '',
        state: '',
        play: '',
        pause: '',
        volume: '',
        volumeClose: '',
        subtitle: '',
        screenshot: '',
        setting: '',
        fullscreen: '',
        fullscreenWeb: '',
        pip: '',
    },
});

    });
        

    it(`Configuration.theme`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    theme: '#ffad00',
});

    });
        

    it(`Configuration.subtitleOffset`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
    setting: true,
    subtitleOffset: true,
});

    });
        

    it(`Configuration.miniProgressBar`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});

    });
        

    it(`Configuration.localVideo`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    localVideo: true,
    controls: [
        {
            name: 'preview',
            position: 'right',
            html: 'OPEN VIDEO',
            mounted: ($preview) => {
                art.plugins.localVideo.attach($preview);
            },
        },
    ],
});

    });
        

    it(`Configuration.localSubtitle`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    localSubtitle: true,
    controls: [
        {
            name: 'preview',
            position: 'right',
            html: 'OPEN SUBTITLE',
            mounted: ($preview) => {
                art.plugins.localSubtitle.attach($preview);
            },
        },
    ],
});

    });
        

    it(`Configuration.networkMonitor`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    networkMonitor: true,
});

// Is the ratio of the time the video is blocked to the time the video has been played.
// For example, when the ratio is equal to 0.3, it means that every 10 seconds of sampling time, it is blocked for three seconds.

let notice = false;
art.on('networkMonitor', (ratio) => {
    if (ratio >= 0.5 && !notice) {
        notice = true;
        console.log('Current network condition is not good');
    }
});

// Modify sampling time, the unit is milliseconds, default 10 seconds.
art.plugins.networkMonitor.sample(30000);

    });
        

    it(`Configuration.subtitle`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
        style: {
            color: '#03A9F4',
            'font-size': '30px',
        },
    },
});

    });
        

    it(`Configuration.thumbnails`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 100,
        width: 160,
        height: 90,
        column: 10,
    },
});

    });
        

    it(`Configuration.moreVideoAttr`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    moreVideoAttr: {
        'webkit-playsinline': true,
        playsInline: true,
    },
});

    });
        

    it(`Configuration.quality`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    quality: [
        {
            default: true,
            name: 'SD 480P',
            url: '/assets/sample/video.mp4',
        },
        {
            name: 'HD 720P',
            url: '/assets/sample/video.mp4',
        },
    ],
});

    });
        

    it(`Configuration.highlight`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    highlight: [
        {
            time: 60,
            text: 'One more chance',
        },
        {
            time: 120,
            text: '谁でもいいはずなのに',
        },
        {
            time: 180,
            text: '夏の想い出がまわる',
        },
        {
            time: 240,
            text: 'こんなとこにあるはずもないのに',
        },
        {
            time: 300,
            text: '－－终わり－－',
        },
    ],
});

    });
        

    it(`Configuration.layers`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            html: `<img style="width: 100px" src="/assets/sample/layer.png">`,
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '.9',
            },
        },
    ],
});

    });
        

    it(`Configuration.contextmenu`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            html: 'Custom menu',
            click: function (contextmenu) {
                console.info('You clicked on the custom menu');
                contextmenu.show = false;
            },
        },
    ],
});

    });
        

    it(`Configuration.controls`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            name: 'myController',
            position: 'right',
            index: 10,
            html: 'myController',
            tooltip: 'This is my controller',
            click: function () {
                console.log('myController');
            },
        },
    ],
});

    });
        

    it(`Configuration.plugins`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        function myPlugin(art) {
            // Do something you like here.
            // You can also return an object for external calls.
            console.info('myPlugin running...');
            return {
                // This exposes plugin properties or methods for others to use. Like:
                something: 'something',
                doSomething: function () {
                    console.info('Do something here...');
                },
            };
        },
    ],
});

// Call plugin from the outside
art.plugins.myPlugin.doSomething();

    });
        

    it(`Properties.instance`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.log('isFocus', art.isFocus);
console.log('isDestroy', art.isDestroy);
console.log('option', art.option);

setTimeout(function () {
    // remove dom
    art.destroy();

    // keep dom
    // art.destroy(false);
}, 1000);

    });
        

    it(`Properties.player`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.player.seek = 5;
    art.player.screenshot();
});

    });
        

    it(`Properties.storage`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.storage.set('your-key', 'your-value');
console.log(art.storage.get('your-key'));

    });
        

    it(`Properties.i18n`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'jp',
});

console.log(art.i18n.get('Play'));
art.i18n.update({
    'zh-cn': {
        Language: '简体',
    },
    'zh-tw': {
        Language: '繁體',
    },
    jp: {
        Language: '日文',
    },
});
console.log(art.i18n.get('Language'));

    });
        

    it(`Properties.hotkey`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

// Add a hotkey
art.hotkey.add(27, function (event) {
    console.log('You pressed esc button');
});

    });
        

    it(`Properties.notice`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

// auto hide
art.notice.show = 'some message';

    });
        

    it(`Properties.events`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

var target = document.querySelector('body');
art.events.proxy(target, 'click', function (e) {
    console.log('body click');
});

    });
        

    it(`Properties.layers`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.layers.add({
    html: `<img style="width: 100px" src="/assets/sample/layer.png">`,
    style: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        opacity: '.9',
    },
});

    });
        

    it(`Properties.controls`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.controls.add({
    name: 'myController',
    position: 'right',
    index: 10,
    html: 'myController',
    tooltip: 'This is my controller',
    click: function () {
        console.log('myController');
    },
});

    });
        

    it(`Properties.contextmenu`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.contextmenu.add({
    html: 'Custom menu',
    click: function (contextmenu) {
        console.info('You clicked on the custom menu');
        contextmenu.show = false;
    },
});

    });
        

    it(`Properties.subtitle`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
    controls: [
        {
            position: 'right',
            index: 10,
            html: 'subtitle 01',
            click: function () {
                art.subtitle.switch('/assets/sample/subtitle.srt', 'srt subtitle name');
            },
        },
        {
            position: 'right',
            index: 20,
            html: 'subtitle 02',
            click: function () {
                art.subtitle.switch('/assets/sample/subtitle.vtt', 'vtt subtitle name');
            },
        },
    ],
});

    });
        

    it(`Properties.loading`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', function () {
    // Show the loading
    art.loading.show = true;
    setTimeout(function () {
        // Hide the loading
        art.loading.show = false;
    }, 5000);
});

    });
        

    it(`Properties.mask`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', function () {
    // Show the mask
    art.mask.show = true;
    setTimeout(function () {
        // Hide the mask
        art.mask.show = false;
    }, 5000);
});

    });
        

    it(`Properties.setting`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});

art.on('ready', function () {
    // Add a setting
    art.setting.add({
        html: 'Your Setting',
        name: 'yourSetting',
    });

    // Show the setting
    art.setting.show = true;
    setTimeout(function () {
        // Hide the setting
        art.setting.show = false;
    }, 5000);
});

    });
        

    it(`Properties.plugins`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.plugins.add(function myPlugin(art) {
    // Do something you like here.
    // You can also return an object for external calls.
    console.info('myPlugin running...');
    return {
        // This exposes plugin properties or methods for others to use. Like:
        something: 'something',
        doSomething: function () {
            console.info('Do something here...');
        },
    };
});

// Call plugin from the outside
art.plugins.myPlugin.something === 'something';
art.plugins.myPlugin.doSomething();

    });
        

    it(`Properties.instance`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.log('isFocus', art.isFocus);
console.log('isDestroy', art.isDestroy);
console.log('option', art.option);

setTimeout(function () {
    // remove dom
    art.destroy();

    // keep dom
    // art.destroy(false);
}, 1000);

    });
        

    it(`Properties.player`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.player.seek = 5;
    art.player.screenshot();
});

    });
        

    it(`Properties.storage`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.storage.set('your-key', 'your-value');
console.log(art.storage.get('your-key'));

    });
        

    it(`Properties.i18n`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'jp',
});

console.log(art.i18n.get('Play'));
art.i18n.update({
    'zh-cn': {
        Language: '简体',
    },
    'zh-tw': {
        Language: '繁體',
    },
    jp: {
        Language: '日文',
    },
});
console.log(art.i18n.get('Language'));

    });
        

    it(`Properties.hotkey`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

// Add a hotkey
art.hotkey.add(27, function (event) {
    console.log('You pressed esc button');
});

    });
        

    it(`Properties.notice`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

// auto hide
art.notice.show = 'some message';

    });
        

    it(`Properties.events`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

var target = document.querySelector('body');
art.events.proxy(target, 'click', function (e) {
    console.log('body click');
});

    });
        

    it(`Properties.layers`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.layers.add({
    html: `<img style="width: 100px" src="/assets/sample/layer.png">`,
    style: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        opacity: '.9',
    },
});

    });
        

    it(`Properties.controls`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.controls.add({
    name: 'myController',
    position: 'right',
    index: 10,
    html: 'myController',
    tooltip: 'This is my controller',
    click: function () {
        console.log('myController');
    },
});

    });
        

    it(`Properties.contextmenu`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.contextmenu.add({
    html: 'Custom menu',
    click: function (contextmenu) {
        console.info('You clicked on the custom menu');
        contextmenu.show = false;
    },
});

    });
        

    it(`Properties.subtitle`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
    controls: [
        {
            position: 'right',
            index: 10,
            html: 'subtitle 01',
            click: function () {
                art.subtitle.switch('/assets/sample/subtitle.srt', 'srt subtitle name');
            },
        },
        {
            position: 'right',
            index: 20,
            html: 'subtitle 02',
            click: function () {
                art.subtitle.switch('/assets/sample/subtitle.vtt', 'vtt subtitle name');
            },
        },
    ],
});

    });
        

    it(`Properties.loading`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', function () {
    // Show the loading
    art.loading.show = true;
    setTimeout(function () {
        // Hide the loading
        art.loading.show = false;
    }, 5000);
});

    });
        

    it(`Properties.mask`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', function () {
    // Show the mask
    art.mask.show = true;
    setTimeout(function () {
        // Hide the mask
        art.mask.show = false;
    }, 5000);
});

    });
        

    it(`Properties.setting`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});

art.on('ready', function () {
    // Add a setting
    art.setting.add({
        html: 'Your Setting',
        name: 'yourSetting',
    });

    // Show the setting
    art.setting.show = true;
    setTimeout(function () {
        // Hide the setting
        art.setting.show = false;
    }, 5000);
});

    });
        

    it(`Properties.plugins`, function() {
            
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.plugins.add(function myPlugin(art) {
    // Do something you like here.
    // You can also return an object for external calls.
    console.info('myPlugin running...');
    return {
        // This exposes plugin properties or methods for others to use. Like:
        something: 'something',
        doSomething: function () {
            console.info('Do something here...');
        },
    };
});

// Call plugin from the outside
art.plugins.myPlugin.something === 'something';
art.plugins.myPlugin.doSomething();

    });
        ;
});    
    