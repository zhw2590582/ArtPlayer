# Video and HTML Ads

[简体中文](../../plugin/ads.md)

Show one preroll when content first plays, using a separate video or HTML. The plugin supplies countdown, close, details, mute and fullscreen controls without IMA. Ad-tag requests belong to the separate [VAST plugin](./vast.md). This page describes the unreleased refactor branch; online examples and unpinned packages are not the current candidate.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-ads
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAds from 'artplayer-plugin-ads';
```

For script usage, load ArtPlayer before `dist/artplayer-plugin-ads.js`; the global is `artplayerPluginAds`. The [original online example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ads/index.js&example=ads) below supplies both video and HTML, so the video takes precedence.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-ads/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-ads
// import artplayerPluginAds from 'artplayer-plugin-ads';

const art = new Artplayer({
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

      // 多语言支持
      i18n: {
        close: '关闭广告',
        countdown: '%s秒',
        detail: '查看详情',
        canBeClosed: '%s秒后可关闭广告',
      },
    }),
  ],
})

// 广告被点击
art.on('artplayerPluginAds:click', (ads) => {
  console.info('广告被点击', ads)
})

// 广告被跳过
art.on('artplayerPluginAds:skip', (ads) => {
  console.info('广告被跳过', ads)
})
```

## Options

Options may be omitted or supplied as `{}` to use defaults.

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `html` | `string` | `''` | Ad HTML, including images; not sanitized automatically, so supply trusted content |
| `video` | `string` | `''` | Ad video URL; a nonempty value overrides html |
| `url` | `string` | `''` | Destination opened from ad content or details; empty disables navigation and hides details |
| `playDuration` | `number` | `5` | Countdown seconds before the close button is enabled; does not restrict programmatic skip |
| `totalDuration` | `number` | `10` | Total countdown seconds, independent of the video duration |
| `muted` | `boolean` | `false` | Initial ad-video mute state |
| `i18n` | `Translations` | Below | Replaces the entire translations object; all four fields are required |

| Translation | Default |
| --- | --- |
| `close` | `'关闭广告'` |
| `countdown` | `'%s秒'` |
| `detail` | `'查看详情'` |
| `canBeClosed` | `'%s秒后可关闭广告'` |

`%s` is replaced with the time value. Options are shallowly merged; partial i18n objects are not supported. Use numeric seconds: string durations are rejected without coercion. Historical workspace source/type fields are not runtime aliases for video/html; supply images through an img in html.

Positive integer durations are recommended. With `playDuration <= 0`, the button allows immediate closure; with `playDuration >= totalDuration`, it is hidden. Counting advances once per timer execution and pauses while the document is hidden. It is not an exact measure of video currentTime or real elapsed time. The ad video loops; countdown completion or skip ends the ad.

## Methods and events

Registration is synchronous. The result is `art.plugins.artplayerPluginAds`, with the fixed name `artplayerPluginAds`.

| Method | Runtime behavior |
| --- | --- |
| `pause()` | Pause only the countdown, leaving ad video playback unchanged |
| `play()` | Resume only the countdown without adding duplicate timer chains |
| `skip()` | Finish once, regardless of the button's playDuration restriction |

All return `undefined` synchronously. Before initialization, play/pause do not start an ad. Early skip cancels the pending preroll and emits once without creating DOM or starting content. Repeated skip after completion is inert.

| Player event | Payload and timing |
| --- | --- |
| `artplayerPluginAds:click` | The normalized options when ad content or available details are clicked; a nonempty url is opened first |
| `artplayerPluginAds:skip` | The same normalized options on completion, including countdown expiry, programmatic skip or media failure; not solely a user-click signal |

Event options remain live, not readonly snapshots. Listener mutations affect later reads, such as totalDuration. Opening the details destination remains subject to browser window policies.

## Lifecycle and media

Install through construction options. After ready, the first play or video:playing signal creates the overlay and pauses content. Late installation does not replay an earlier ready event. Video ads wait for their own metadata before counting and requesting playback; HTML ads start counting immediately.

Ad media loading or playback failure completes the ad, and rejected internal play requests warn. Normal completion requests content playback, pauses the ad, hides the overlay and synchronously emits skip. A playback request does not guarantee the browser has started playing; direct application `art.play()` rejection behavior remains unchanged.

The hidden overlay stays until player destruction. Destroy releases the ad source, listeners, timer and overlay, removing its own `art.template.$ads` even if player HTML is retained. There is no separate public destroy, reset or replay-ad API. Existing `artplayer-plugin-ads*` classes remain; the fullscreen control uses core fullscreen.

The separate ad video must be loadable and decodable by the browser. Main-player SDKs and proxies do not automatically handle it. Native fullscreen, mobile playback policies and media behavior require target-environment validation; page navigation is not that evidence.

## TypeScript compatibility

The root and `/legacy` retain acceptance of the old erroneous `totalDuration: string` declaration, but runtime still rejects strings. The approved inference correction makes `Parameters<typeof ads>[0].totalDuration` read as `number | string | undefined`; historical source/type also become optional. Narrow those values or migrate to the accurate Option type.

New code can select `/runtime`, which uses the same implementation:

```ts
import ads from 'artplayer-plugin-ads/runtime';
import type { Option, Result } from 'artplayer-plugin-ads';

const options: Option = { video: '/advertisement.mp4', totalDuration: 10 };
const installAds = ads(options);

function pauseCountdown(plugin: Result): void {
  plugin.pause();
}
```

Public types include Translations, Option, LegacyOption, WorkspaceOption, CompatOption, Result, Callable, Factory, RuntimeCallable and RuntimeFactory. Historical option types do not add runtime aliases. CommonJS supports the function and `.default(...)`; ESM uses the default export. The precise entry is not a second plugin implementation.
