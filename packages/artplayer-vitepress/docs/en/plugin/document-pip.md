# Document Picture-in-Picture

[简体中文](../../plugin/document-pip.md)

Move the whole player, including its controls, into a browser Document Picture-in-Picture window. Closing the window restores the same player node to its original position. This page describes the unreleased refactor branch; the online example and unpinned npm/CDN packages are not the current candidate.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-document-pip
```

```js
import Artplayer from 'artplayer';
import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip';
```

For script usage, load ArtPlayer before `dist/artplayer-plugin-document-pip.js`. The global is `artplayerPluginDocumentPip`. The following code preserves the original [online example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-document-pip/index.js&example=document.pip).

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-document-pip/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-document-pip
// import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [
    artplayerPluginDocumentPip({
      width: 480,
      height: 270,
      fallbackToVideoPiP: true,
      placeholder: `Playing in Document Picture-in-Picture`,
    }),
  ],
})

art.on('document-pip', (state) => {
  console.log('Document Picture-in-Picture', state)
})
```

## Options

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `width` | `number` | `480` | Requested window width; the browser determines the actual size |
| `height` | `number` | `270` | Requested window height |
| `placeholder` | `string` | `'Playing in Document Picture-in-Picture'` | Placeholder text at the original player position |
| `fallbackToVideoPiP` | `boolean` | `true` | Try setting `art.pip = true` when the Document PiP API is absent |

The plugin registers as `artplayerPluginDocumentPip` and adds a PiP control button. It detects `documentPictureInPicture.requestWindow`; a positive result does not guarantee that permissions, the calling context or user activation will allow opening. Call `open()` or `toggle()` directly from a user click handler, before awaiting unrelated work.

Video PiP fallback also depends on the browser and media. It does not move the whole player, set the plugin's `isActive` flag or emit a Document PiP activation event. `close()` manages the Document PiP window; use `art.pip = false` to exit video PiP. Disabling fallback does not add Document PiP support to the browser.

## State, methods and events

Access the result through `art.plugins.artplayerPluginDocumentPip`:

| Member | Runtime behavior |
| --- | --- |
| `name` | Always `artplayerPluginDocumentPip` |
| `isSupported` | Readonly getter; Document PiP API capability snapshot taken at plugin creation |
| `isActive` | Readonly getter; whether a Document PiP session is held, not video PiP state |
| `open()` | Returns `Promise<void>`; requests a window and moves the player, coalesces pending requests and does nothing when already open |
| `close()` | Returns `Promise<void>`; cancels a pending request or restores the node and closes the window |
| `toggle()` | Returns `undefined` synchronously; opens or closes the active/pending window |

Successful activation and normal closure emit the player's `document-pip` event with `true` and `false`, respectively. The plugin updates the existing `artplayer-document-pip` class, rebinds document events and schedules resize. This event does not signal successful media loading or playback.

Normal window request/restoration failures display a notice and console warning; awaiting `open()` alone is not proof that a window opened. An error thrown by the video PiP fallback setter can still reject its Promise. A window arriving after cancellation is closed without adopting the player. Destroying the player releases the window, control, subscriptions and timers, suppressing further plugin state events. There is no separate public plugin `destroy()`.

Styles are copied from the player's document on a best-effort basis. Inaccessible cross-origin styles and externally managed DOM need validation in your environment. Canvas, other proxies, keyboard focus and continuous playback also need their own checks; the capability flag cannot establish those results.

## Compatible TypeScript views

The root and `/legacy` declarations preserve the old required options object, writable `Result` flags and void actions. JavaScript permits omitted options, the runtime flags are readonly getters, and `open/close` return Promises. The old shape preserves consumer and replacement-function compatibility; it does not make the runtime getters writable.

This package has no `/runtime` subpath. For accurate types, explicitly view the real factory as `RuntimeFactory`:

```ts
import documentPip from 'artplayer-plugin-document-pip';
import type { AsyncResult, RuntimeFactory } from 'artplayer-plugin-document-pip';

const runtimeFactory = documentPip as RuntimeFactory;
const installPip = runtimeFactory();
const installDefaultPip = runtimeFactory.default({ width: 480 });

async function closePip(pip: AsyncResult): Promise<void> {
  await pip.close();
}
```

Named types are `Option`, `Result`, `AsyncResult`, `Factory` and `RuntimeFactory`. Apply the precise view only to the unmodified implementation, not a void-returning mock or replaced method. CommonJS runtime supports both `require(package)(options)` and `.default(options)`. Historical `import = require` types use `.default`; use the precise factory view when direct calling is needed.
