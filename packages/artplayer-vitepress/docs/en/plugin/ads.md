# Video Ads

## Demo

👉 [View Full Demo](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ads/index.js&example=ads)

## Installation

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
## Usage

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
            // HTML ad, ignored if it's a video ad
            html: '<img src="/assets/sample/poster.jpg">',

            // URL of the video ad
            video: '/assets/sample/test1.mp4',

            // Ad redirect URL, no redirection if empty
            url: 'http://artplayer.org',

            // The duration that must be watched, which can't be skipped, in seconds
            // If this value is greater than or equal to totalDuration, the ad can't be closed early
            // If this value is less than or equal to 0, then the ad can be closed at any time
            playDuration: 5,

            // Total duration of the ad, in seconds
            totalDuration: 10,

            // Whether the video ad is muted by default
            muted: false,

            // Multilingual support
            i18n: {
                close: 'Close ad',
                countdown: '%s seconds',
                detail: 'See details',
                canBeClosed: '%s seconds until the ad can be closed',
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