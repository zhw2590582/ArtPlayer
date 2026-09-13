# Chromecast maintenance

The factory remains `artplayerPluginChromecast(option)`. Registration is async and
adds the `chromecast` right control immediately. Its resolved object retains
`name`, `getCastState()` and `isCasting()`. SDK loading remains lazy on first click.
The option object stays live: later changes to `url`, `mimeType`, `sdk` and callback
properties are read at the corresponding operation. Callbacks retain `this === option`.
The control HTML is captured at registration, as before.

## Modules

| File | Responsibility |
| --- | --- |
| `src/index.ts` | Public factory and historical `.default` factory alias |
| `src/controller.ts` | One registration's subscriptions, raw session state, click operation, notices and owned control icon |
| `src/sdk.ts` | Framework readiness, shared in-flight script leases, callback preservation and context configuration |
| `src/media.ts` | Existing URL/extension MIME rules and SDK media request construction |
| `src/types.ts` | Narrow internal SDK, event and callback contracts; not the published declaration entrypoint |
| `src/cast.svg` | Original default Cast artwork imported as inline SVG |

Dependencies point from the factory to the controller, then to the SDK loader and
media builder. The loader and media builder do not receive an ArtPlayer instance.
Public declarations remain in `types/`; their historical mismatch with async
registration is tracked separately by PKG-CAST-04. Internal strict typing does not
silently change those declarations.

## Initialization and ownership

Each registration has its own session state and subscriptions, even when one
factory is reused for several players. Unclicked instances do not subscribe to
the SDK. An initialized instance observes page-wide CastContext events; this is
the SDK's shared session, not an exclusively owned receiver session.

Within a loaded plugin module, controllers share one pending SDK load per window.
The first pending request's SDK URL wins; another URL can be used on a later retry.
A complete existing Framework is reused immediately. A partial `chrome.cast`
object is insufficient readiness and still permits loading the Framework script.
The original availability callback is invoked with its window receiver and both
arguments. Its thrown exception still escapes to its caller, while the plugin's
own subscribers settle independently. Cleanup restores that handler only while
our handler is still installed, so a later external replacement is preserved.

On availability, each subscriber installs its listeners synchronously before its
loader promise resolves. This preserves the historical boundary where a session
event immediately following `__onGCastApiAvailable(true)` is observable. One
subscriber's setup exception rejects that subscriber without stranding the rest.
The default receiver and ORIGIN_SCOPED policy are configured once per observed
context. This does not negotiate receiver configuration with unrelated Cast apps.

Successful scripts remain on the page. Failed or last-owner-cancelled scripts are
removed and can be retried. Script `load` may precede Framework availability, so
incomplete load does not fail immediately; a 30-second readiness timeout settles
an unavailable Framework even if no error/availability event arrives. The timeout
is cleared on success, failure and last-owner cancellation. Destroying one player
releases its lease without interrupting another pending player. Independently
loaded copies of this plugin do not share their module-local lease registry.

## Session operations and failure semantics

One player has at most one pending click operation; concurrent clicks receive the
same promise. After initialization, the controller reads `getCurrentSession()`.
If absent, it awaits `requestSession()` and reads `getCurrentSession()` again.
The request's completion value is not a CastSession. No active session after a
successful request is a connection error. Media URL selection uses the current
`option.url || art.option.url`; no receiver URL rewriting is performed.

The complete media load is awaited. The click promise rejects with the original
SDK error and reports one stage-specific notice and `onError`. A separate rejection
observer handles ArtPlayer's DOM dispatcher, which ignores returned click promises;
programmatic callers still receive the original rejecting promise. Callback
exceptions retain their normal propagation and are not interpreted as receiver
success evidence.

`getCastState()` retains the last raw SDK SessionState, initially null, and is not
the normalized callback state. `isCasting()` reflects a retained session reference,
including one acquired by a successful session request; it does not prove receiver
playback. `NO_SESSION`, `SESSION_ENDED` and `SESSION_START_FAILED` clear that reference
and notify disconnected. Initial `NO_SESSION` during SDK setup does not cancel the
first click before a session operation begins. Ending/terminal events during a
request or media load, and replacement of the current session, invalidate pending
work. Late success/rejection is observed without stale media starts or notices.

Destroy marks the controller inactive, settles its pending click, releases its
loader lease, attempts both SDK listener removals and removes its ArtPlayer
subscription. All cleanup is attempted even when one SDK removal throws; the first
cleanup error is preserved. Any callback left behind by a broken SDK removal is
inactive. The plugin never ends a page-shared session. ArtPlayer owns control DOM
removal; the plugin only updates the icon under the element supplied to its own
control's `mounted` callback, retaining `.art-icon.art-icon-cast` and the
red/orange/white states. The actual `Control.add` override returns undefined even
though the shared component superclass returns an element; never rely on the
control add return value for DOM ownership. Candidate fixtures replay `mounted`
and preserve this undefined return so the browser-discovered regression remains
covered outside the browser too.

## Artwork provenance

The default SVG now uses original rectangle, circular arc and dot geometry authored
for this refactor under the repository MIT license. It does not copy the former
Font Awesome Pro path. `src/cast.svg` is the single artwork source; custom `icon`
HTML and the existing wrapper hooks remain supported. The previous commercial
notice/source gap is tracked as VENDOR-10; production bundles must be regenerated
from this source rather than edited by hand.

## Validation and next changes

Use the pinned Node and Yarn versions. Scoped commands from the repository root:

```sh
node --test test/chromecast.test.js test/chromecast-failures.test.js test/chromecast-runtime.test.js
yarn exec tsc -p packages/artplayer-plugin-chromecast/tsconfig.json
yarn exec eslint packages/artplayer-plugin-chromecast/src test/chromecast-runtime.test.js
yarn build artplayer-plugin-chromecast
```

`ARTPLAYER_CHROMECAST_ARTIFACT` selects a built main or legacy file for the candidate
tests. `ARTPLAYER_CHROMECAST_ESM_ARTIFACT` selects the native ESM artifact for the
default-export identity check. Without these variables tests bundle current source
in memory. Historical tests retain actual frozen npm/source inputs and deliberately
observe the old defects; candidate tests assert their corrections separately.

Change SDK loading in `sdk.ts`, state/cleanup in `controller.ts`, and MIME behavior
in `media.ts`. Always retain synchronous availability-event coverage, ignored DOM
promise rejection coverage, multi-player ownership, partial failure cleanup and
late completion tests when changing those boundaries.

Controlled SDK tests and local browser DOM interaction cannot establish real Cast
receiver playback. PKG-CAST-05 still requires the supported Chrome/HTTPS sender,
actual receiver, network-reachable media, source changes and disconnection evidence.
The default SDK URL is mutable; no remote SDK version, physical receiver or Safari
support is established by this source migration.
