# Video ambilight

[简体中文](../../plugin/ambilight.md)

Sample colors from the video to display a blurred glow around the player. The plugin reads pixels with Canvas, needs no additional SDK, and does not change video playback or audio output.

This page describes the refactor branch. Its lifecycle fixes and accurate type entry are not published yet. The online example and unpinned npm/CDN packages are not the current candidate.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-ambilight
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAmbilight from 'artplayer-plugin-ambilight';
```

For script usage, load ArtPlayer before `dist/artplayer-plugin-ambilight.js`. The global is `artplayerPluginAmbilight`. The following code is unchanged from the [online ambilight example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ambilight/index.js&example=ambilight). Your application must provide its own container and accessible video.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-ambilight/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-ambilight
// import artplayerPluginAmbilight from 'artplayer-plugin-ambilight';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  autoSize: true,
  plugins: [
    artplayerPluginAmbilight({
      blur: '50px',
      opacity: 1,
      frequency: 10,
      duration: 0.3,
    }),
  ],
})
```

## Options

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `blur` | `string` | `'50px'` | CSS blur radius |
| `opacity` | `number` | `0.5` | Glow grid opacity; the example explicitly uses `1` |
| `frequency` | `number` | `10` | Maximum samples per second; use a positive value; playback and frame scheduling limit the actual rate |
| `duration` | `number` | `0.3` | Color transition duration in seconds |
| `zIndex` | `number` | Actual value fixed at `9` | Historical accepted input that does not change the grid's stacking order |

The plugin samples a 3×3 grid. Colors update only while the player is playing and the sampling interval has elapsed. `frequency` does not set the video's frame rate. Masks, clipping and an ancestor's `overflow` styles can also affect how much of the glow is visible.

## start and stop

The result has the fixed `name` of `artplayerPluginAmbilight`. When installed through the constructor options, it starts scheduling after the player's `ready` event:

```js
const light = art.plugins.artplayerPluginAmbilight;
light.stop();  // Stop sampling and retain the last colors.
light.start(); // Resume sampling while the player is playing.
```

Both methods return `undefined` synchronously and do not play or pause the video. `stop()` retains the last colors. `start()` is not a Promise that captures a frame immediately. Repeated calls do not create multiple sampling loops. If you install the plugin with `art.plugins.add(...)` after `ready` has already fired, call `start()` on the returned result yourself.

There is no plugin `update` or separate `destroy` method. Destroying the player stops frame scheduling, removes the grid and plugin subscriptions, and releases the sampling canvas. Retained `start/stop` methods do no work after destruction.

## Media access and proxies

The browser must be able to decode the video and read its pixels into Canvas. Cross-origin video needs the appropriate media CORS configuration and server response headers; successful playback alone does not grant pixel access. A failed pixel read skips that update and retains existing colors. A later readable source can recover. The plugin does not bypass browser origin restrictions.

Canvas proxy sampling uses the actual dimensions of its output canvas. Other proxies must be checked for a drawable output; a passing desktop combination does not establish support for every browser or proxy. The effect does not control a physical monitor's backlight.

## TypeScript compatibility entries

The root and `/legacy` entries retain the published 1.1.0 factory type: the options object is required, while its fields are optional. Pass `{}` for defaults with those types. JavaScript calls can still omit the argument.

For accurate optional calls, the CommonJS `.default` self-alias, or callable NodeNext ESM default types, use `/runtime`, which shares the same implementation:

```ts
import ambilight from 'artplayer-plugin-ambilight/runtime';

const installLight = ambilight();
const installDefaultLight = ambilight.default({ opacity: 0.5 });
```

The root declarations export the named types `Option`, `Result`, `Callable`, `Factory` and `RuntimeFactory`. Version 1.0.0 used `export =` and required option fields, unlike 1.1.0. Earlier `import = require` callers can move to `/runtime`; reads of optional fields need a fallback. Node10 TypeScript default imports of `/runtime` require `esModuleInterop`; `import = require` works without it.
