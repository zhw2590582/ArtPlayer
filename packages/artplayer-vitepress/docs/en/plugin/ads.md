# 视频广告

## 演示

👉 [查看完整演示](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ads/index.js&example=ads)

## 安装

::: code-group

```bash [npm]
npm install artplayer-plugin-ads
```

```bash [yarn]
yarn add artplayer-plugin-ads
```

```bash [pnpm]
pnpm add artplayer-plugin-ads
```

```html [script]
<script src="path/to/artplayer-plugin-ads.js"></script>
```

:::

## CDN

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer-plugin-ads/dist/artplayer-plugin-ads.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer-plugin-ads/dist/artplayer-plugin-ads.js
```

:::

## 使用

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-ads/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginAds({
            // html广告，假如是视频广告则忽略该值
            html: '<img src="/assets/sample/poster.jpg">',

            // 视频广告的地址
            video: '/assets/sample/test1.mp4',

            // 广告跳转网址，为空则不跳转
            url: 'http://artplayer.org',

            // 必须观看的时长，期间不能被跳过，单位为秒
            // 当该值大于或等于totalDuration时，不能提前关闭广告
            // 当该值等于或小于0时，则随时都可以关闭广告
            playDuration: 5,

            // 广告总时长，单位为秒
            totalDuration: 10,

            // 视频广告是否默认静音
            muted: false,

            // 多语言支持
            i18n: {
                close: '关闭广告',
                countdown: '%s秒',
                detail: '查看详情',
                canBeClosed: '%s秒后可关闭广告',
            },
        }),
    ],
});

// ad is clicked
art.on('artplayerPluginAds:click', (ads) => {
    console.info(ads);
});

// Ad skipped
art.on('artplayerPluginAds:skip', (ads) => {
    console.info(ads);
});
```
