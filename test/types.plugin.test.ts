import Artplayer from '../packages/artplayer';
import artplayerPluginDanmuku from '../packages/artplayer-plugin-danmuku/types/artplayer-plugin-danmuku';
import artplayerPluginAds from '../packages/artplayer-plugin-ads/types/artplayer-plugin-ads';

const art = new Artplayer({
    container: '.artplayer-app',
    url: './assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '',
            margin: [0, '10%'],
            theme: 'light',
        }),
        artplayerPluginAds({
            html: '<img src="/assets/sample/poster.jpg">',
            video: '/assets/sample/test1.mp4',
            url: 'http://artplayer.org',
        }),
    ],
});

art.plugins
    .add(
        artplayerPluginDanmuku({
            danmuku: '',
            margin: [0, '10%'],
            theme: 'light',
        }),
    )
    .add(
        artplayerPluginAds({
            html: '<img src="/assets/sample/poster.jpg">',
            video: '/assets/sample/test1.mp4',
            url: 'http://artplayer.org',
        }),
    );
