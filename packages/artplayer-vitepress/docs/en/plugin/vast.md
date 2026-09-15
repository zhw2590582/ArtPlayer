# VAST Ads

[简体中文](../../plugin/vast.md)

Request and display ads through Glomex VAST IMA Player and Google IMA. Unlike the separate [Ads plugin](./ads.md), this accepts ad-tag URLs or VAST responses rather than managing a local countdown ad. SDK and ad resources must be reachable; network, VPN or blocking rules can prevent loading. This page describes the unreleased refactor branch, not proof that the online example validates the current candidate.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-vast
```

```js
import Artplayer from 'artplayer';
import artplayerPluginVast from 'artplayer-plugin-vast';
```

For script usage, load ArtPlayer before `dist/artplayer-plugin-vast.js`; the global is `artplayerPluginVast`. Its Glomex dependency loads IMA, so no separate custom loader is needed. This preserves the [original online example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vast/index.js&example=vast); its external ad URL is not a local test fixture.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-vast/index.js">▶ Run Code</div>

```js
// Depends on:
// https://glomex.github.io/vast-ima-player/
// https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side

// Google's IMA SDK are blocked by your Ad blocker.
// Please Turn Off Your Ad Blocker.

// npm i artplayer-plugin-vast
// import artplayerPluginVast from 'artplayer-plugin-vast';

var art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  fullscreen: true,
  fullscreenWeb: true,
  plugins: [
    artplayerPluginVast(({ playUrl, imaPlayer, ima }) => {
      // Play the ad when the video is played
      art.once('play', () => {
        playUrl('https://artplayer.org/assets/vast/linear-ad.xml')
      })
    }),
  ],
})
```

## Initialization compatibility

`artplayerPluginVast(callback?, options?)` returns an asynchronous registrar. It loads the SDK, creates the appropriate context and awaits the callback before resolving. A callback can return a Promise. Registration does not imply an ad was requested or played.

| Behavior | Default npm mode | `{ compatibility: 'workspace-1.2' }` |
| --- | --- | --- |
| Callback entry | SDK player and container already allocated | Allocation waits for init/playUrl/playRes |
| IMA settings | SDK defaults preserved | Preloading and restoration of custom playback state default to true |
| Resource fields | Writable imaPlayer/id/$container data fields | Live readonly getters, null before allocation and after release |
| Requests | Wrapper forwards every explicit request | New requests are suppressed during an active ad |
| Container | SDK manages visibility with default styles | Black overlay, four ad events manage visibility and active state |

This implements the approved decision: published npm1.0.0 calls retain their default behavior. Code relying on unpublished workspace1.2 lazy initialization must select it explicitly. The mode is captured once at factory creation; unknown values immediately throw TypeError before SDK loading.

## Callback context

| Field | Runtime purpose |
| --- | --- |
| `art` | Current ArtPlayer instance |
| `ima` | Loaded IMA SDK |
| `adsRenderingSettings` | IMA AdsRenderingSettings passed to a newly allocated SDK player |
| `playerOptions` | Glomex PlayerOptions passed to a newly allocated SDK player |
| `imaPlayer` | SDK player; already created in default mode, nullable in workspace mode |
| `id` / `$container` | Container ID/element, with the mode-specific snapshot/null rules above |
| `container` | Live readonly container getter in both modes, null before allocation or after release |
| `init()` | Return or create the current SDK player; null after terminal disposal |
| `playUrl(url, config?)` | Create an AdsRequest, set adTagUrl and request ads; returns void synchronously |
| `playRes(response, config?)` | Create an AdsRequest, set adsResponse and request ads; returns void synchronously |

The extra config fields retain historical for-in copying, including enumerable inherited fields. Copying follows the primary assignment, so config can override adTagUrl/adsResponse. Use application-controlled configuration. Request construction or SDK synchronous errors can throw; void does not signal success or provide an ad-completion Promise.

To configure before SDK player allocation, select workspace mode and mutate the original settings/options objects before init or request methods. The default mode's first player already exists on callback entry; do not assume later option changes retroactively alter construction.

Default imaPlayer/id/$container fields retain the last allocation after release, even though that SDK is destroyed and its container removed. They are not active resources. Explicit recreation updates them, and assigning these fields does not transfer internal ownership. In workspace mode, keep the context and read getters when needed rather than destructuring their initial null values.

## Events and destruction

Subscribe to SDK events on imaPlayer; they are not same-named ArtPlayer events. Workspace mode listens to `AdContentPauseRequested`, `AdContentResumeRequested`, `AdStarted` and `AdError` to update its overlay and active state, logging AdError details. Default mode does not add those workspace listeners. The SDK handles content pause/resume; the wrapper does not duplicate it.

The result is named `artplayerPluginVast` and registered at `art.plugins.artplayerPluginVast`. Its synchronous `destroy()` releases the current session. While the core remains alive, retained context init/playUrl/playRes methods can create a new session. A recreated SDK player is a different object; reinstall your own SDK subscriptions on it.

Core destruction makes this attachment terminal: late SDK completion cannot invoke the callback or allocate a container, init returns null and request methods become inert. It does not cancel a shared SDK script load for other instances. SDK loading or callback failure cleans up the attachment and preserves the original rejection value. Cleanup errors can be observable while remaining resources are still released. Plugin destroy and core destroy therefore have different restart semantics.

Real ad playback depends on an available response, IMA, browser policies and devices. When SDK loading is blocked, mocks, guide navigation or continued main-content playback cannot count as successful ads. Validate those separately on the target network and device.

## TypeScript entries

The root and `/legacy` preserve npm1.0.0's required callback, any SDK fields and inaccurate synchronous name-only result. Plain historical replacement factories do not need a `.default` property. Registration has always been asynchronous. Use `/runtime` for accurate types, optional callback, the second parameter and destroy, with the same implementation:

```ts
import vast from 'artplayer-plugin-vast/runtime';
import type { RuntimeResult } from 'artplayer-plugin-vast/runtime';

const installPublished = vast(({ imaPlayer }) => {
  imaPlayer.addEventListener('AdStarted', () => console.log('Ad started'));
});

const installWorkspace = vast((context) => {
  context.playerOptions.autoResize = false;
  context.init()?.addEventListener('AdStarted', () => console.log('Ad started'));
}, { compatibility: 'workspace-1.2' });

function releaseAd(result: RuntimeResult): void {
  result.destroy();
}
```

Runtime exports RequestConfig, CompatibilityOptions, Context, PublishedContext, WorkspaceContext, RuntimeContext, RuntimeCallback, RuntimeResult, Registration and RuntimeFactory, plus the historical workspace aliases ArtplayerPluginVastOption and ArtplayerPluginVastInstance. Those aliases describe the workspace callback and awaited result, respectively. CommonJS without interop can use runtime `import = require`, supporting both direct and `.default` calls. These types do not modify the old root declaration.
