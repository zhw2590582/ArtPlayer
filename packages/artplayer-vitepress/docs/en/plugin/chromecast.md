# Chromecast

[简体中文](../../plugin/chromecast.md)

Add a right-side Cast control that selects a Cast session and loads media. Use a supported Chrome sender, HTTPS, a real receiver and receiver-accessible media. This page describes the unreleased branch. A local page, mocked SDK or successful session does not prove playback on a television.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-chromecast
```

```js
import Artplayer from 'artplayer';
import artplayerPluginChromecast from 'artplayer-plugin-chromecast';
```

For scripts, load ArtPlayer before `dist/artplayer-plugin-chromecast.js`; the global is `artplayerPluginChromecast`. This preserves the [original example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chromecast/index.js&example=chromecast). Supply an absolute media URL reachable by your receiver; sender localhost, relative URLs and Blob URLs are not rewritten automatically.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-chromecast/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-chromecast
// import artplayerPluginChromecast from 'artplayer-plugin-chromecast';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  fullscreen: true,
  fullscreenWeb: true,
  plugins: [
    artplayerPluginChromecast({
      // sdk: '', // The URL of the Cast SDK
      // mimeType: '', // The MIME type of the media
    }),
  ],
})
```

## Options and callbacks

An options object is required; `{}` uses defaults. The icon is captured at registration; other options and callbacks are read from the original object at the relevant operation.

| Field | Type | Behavior |
| --- | --- | --- |
| `url` | `string` | Nonempty override, otherwise current art.option.url |
| `sdk` | `string` | Override the Cast SDK script URL |
| `icon` | `string` | Trusted control HTML inside the retained art-icon/art-icon-cast wrapper |
| `mimeType` | `string` | Nonempty override, otherwise inferred from the URL extension |
| `onStateChange` | `(state) => void` | Normalized disconnected/connecting/connected/disconnecting state |
| `onCastAvailable` | `(available: boolean) => void` | SDK availability event, not playback success |
| `onCastStart` | `() => void` | Called after the current loadMedia completes |
| `onError` | `(error: unknown) => void` | SDK, connection or loading failure; not necessarily an Error instance |

Callback this is the original options object. The default SDK URL is `https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1`. Concurrent loads in the same module/window share the first pending URL; a later retry can read another URL.

MIME inference strips query/hash and lowercases the extension. mp4/webm/ogg/ogv/mp3/wav/flv/mov/avi/wmv/mpd/m3u8 map respectively to video/mp4, video/webm, video/ogg, video/ogg, audio/mp3, audio/wav, video/x-flv, video/quicktime, video/x-msvideo, video/x-ms-wmv, application/dash+xml and application/x-mpegURL. Unknown extensions use application/octet-stream. This mapping is not receiver codec support; provide mimeType explicitly when needed.

## Registration and session state

Registration returns a Promise but adds the `chromecast` control immediately. SDK loading starts on first click, so registration is not SDK readiness. The loader has a 30-second readiness limit; script load alone is insufficient without the Framework. It configures the default media receiver and ORIGIN_SCOPED auto-join policy, with no custom receiver-application option.

A click initializes the SDK and checks the current session. If absent, it requests a session, reads it again, then awaits loadMedia. Pending clicks for one controller share the operation. A successful session request without a current session is a connection error. The media URL is read when sending; later player source changes do not automatically cast again. Use the control to send the new media.

The result is at `art.plugins.artplayerPluginChromecast`:

| Member | Meaning |
| --- | --- |
| `name` | Always artplayerPluginChromecast |
| `getCastState()` | Last raw SDK SessionState, initially null; not the normalized callback state |
| `isCasting()` | Whether a session reference is retained, not proof of receiver playback |

The icon uses white for disconnected, orange for transitional and red for connected states. Session termination, failure or replacement invalidates pending work; late results cannot start stale media or show obsolete notices. SDK failures display a stage-specific notice and call onError. User callback exceptions can still propagate.

## Cleanup and shared sessions

Player destruction releases this controller's loader subscription, SDK listeners and pending operation. It does not interrupt another player waiting for the SDK or end the page-shared receiver session. Successful scripts remain; failed or last-owner-cancelled pending scripts are removed. The core owns control DOM removal.

There is no public start, stop, disconnect or destroy method, and no continuous synchronization of local pause, time or volume. Callbacks and icons describe observed controller state. Receiver playback, network reachability, source changes and disconnection require real hardware validation; local tests cannot substitute for it.

## TypeScript

Root and `/legacy` preserve npm1.1.0's required options and synchronous name-only declaration. For precise callbacks, Promise registration and state methods, use `/runtime`, with the same implementation:

```ts
import cast from 'artplayer-plugin-chromecast/runtime';
import type { RuntimeOption, RuntimeResult } from 'artplayer-plugin-chromecast/runtime';

const options: RuntimeOption = {
  onStateChange(state) { console.log(state, this.url); },
  onError(error) { console.error(error); },
};
const registerCast = cast(options);
function readSession(plugin: RuntimeResult): boolean {
  return plugin.isCasting(); // Session presence, not receiver playback.
}
```

Root/runtime named types are Option, Chromecast, Result, Factory, ConnectionState, RuntimeOption, RuntimeResult and RuntimeFactory. Historical root NodeNext namespace behavior remains. Use runtime for accurate ESM default calls or older `import = require` syntax. JavaScript supports direct and `.default(...)` factory calls; type compatibility does not establish device capabilities.
