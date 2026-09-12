# Auto-thumbnail maintenance

This package registers an asynchronous ArtPlayer plugin and generates progressive
JPEG thumbnail sheets using a separate media element. Its public result remains
`{ name: 'artplayerPluginAutoThumbnail' }`; the registration Promise does not wait
for video processing.

## Modules and ownership

- `src/index.js` owns ArtPlayer subscriptions and the public factory. Options are
  read at each `video:loadedmetadata` event, including subsequent changes to the
  original options object. `restart` cancels the old decoder immediately. `destroy`
  closes the session and removes subscriptions. Partial registration is rolled back.
- `src/options.js` preserves truthy defaults and computes the ten-column layout.
  Coercible numeric JS inputs and fractional frame counts retain their previous
  behavior; raw option values are forwarded to the thumbnail configuration.
  Invalid/nonfinite dimensions fail before canvas allocation. Canvas dimensions
  are checked against integer/IDL bounds, not a universal memory budget.
- `src/session.js` owns one active extraction job and the generated object URLs.
  Guards prevent obsolete callbacks from publishing or scheduling another frame.
  Cleanup runs all registered actions even if one fails. Installing a replacement
  before cleaning up its predecessor makes synchronous host reentry observable.
- `src/extraction.js` owns the private video and canvas, metadata/seek/error
  handlers, and the frame/encode sequence. Each valid draw is encoded before the
  next seek. The final decoder is paused, cleared and reset; the final sheet URL
  remains owned by the session until another usable sheet replaces it or destroy.
- `src/video.js` creates and owns the hidden media element. It is attached to the
  document root because detached media loses drawable pixels on Windows WebKit.
  `visibility:hidden` preserves its rendered box; `display:none` and a 1px box do
  not. Metadata locks the box to intrinsic dimensions, overriding ordinary global
  video sizing rules. It is silent, excluded from focus/accessibility, and never
  played by this implementation. Cleanup also removes the element if insertion,
  cancellation, pause or decoder reset fails.

Only the entry module receives ArtPlayer. Extraction receives a guarded job and a
  configuration snapshot. These internal modules do not add public player fields,
plugin methods, or a dependency on a particular core implementation.

## Compatibility and intentional fixes

The factory/global name, Promise registration, result name, default width 160,
count 100, scale 1, ten columns, aspect-ratio height, and time formula
`duration * index / number` are retained. An explicit URL takes precedence over
`art.option.url`; the fallback is read lazily only when no explicit URL is supplied.
Duration and sheet dimensions are captured at metadata time; later duration changes
do not move the remaining samples within the current sheet.
The old `height` option remains ignored at runtime.

A `seeked` callback is ignored while another seek is pending. Before drawing,
extraction checks that the media time is finite and within 50ms of the requested
sample; a mismatch retries that same target at most three times, then fails with
cleanup and retains any previous preview. This prevents observed stale seek
events from advancing the sheet, but does not prove frame presentation accuracy:
the current time can match even when the drawable first frame is stale.

The previous empty first encode is removed. Encoding is serial, duplicate native
callbacks are consumed once, and source replacement/destruction invalidates old
metadata, seek and Blob callbacks. Failure does not revoke an earlier usable
preview. Only generated URLs are revoked; a foreign public thumbnail URL is not
owned by this package. A failed host setter releases the newly created URL.

Extraction failures are observed with `console.warn('ArtPlayer auto-thumbnail failed:', error)`
after cleanup. The already-resolved registration Promise cannot represent later
media failures. Native callbacks do not escape with an unhandled exception. A
registration failure still rejects its original Promise with the original error.

## Verification and remaining work

Use the root Yarn toolchain:

```sh
yarn test:auto-thumbnail
yarn test:browser test/browser/auto-thumbnail-lifecycle.spec.js
yarn test:browser test/browser/auto-thumbnail-pixels.spec.js
yarn build artplayer-plugin-auto-thumbnail
```

`ARTPLAYER_AUTO_THUMBNAIL_BASELINE=1` selects the frozen workspace for candidate
regression tests. `ARTPLAYER_AUTO_THUMBNAIL_ARTIFACT` selects an actual bundle.
Historical contract/failure tests remain separate and continue to reproduce old
defects; their passing status does not mean those defects should remain.

This is an intermediate `PKG-AUTO-THUMB-03` implementation. Native lifecycle
validation does not prove correct pixels. The attached renderer now has native
pixel checks for cells 2-4 (zero-based) on a five-frame sheet, including real black
content, changing colors and spatial detail. Cells 0-1 remain diagnostic only:
initial transparent/stale draws and WebKit frame-time offsets are unresolved
(`AUTO-THUMB-PIXEL-01`). Merely waiting for `seeked`, adding two animation frames,
or seeking away and back did not consistently repair the first frame. Do not
close this risk based on the later-cell assertions or replace it with a nonblack
test; legitimate black frames have opaque pixels. Frame timing, additional
reentry/cleanup boundaries and resource budgets still need the remaining task03 work.

The frozen eight-second timeline has one unique purple first frame followed by
red, black, blue and yellow sections. Its command and fingerprint are in
`refactor/baselines/auto-thumbnail-timeline-media.json`. Reproduce into a new
directory with `ARTPLAYER_FFMPEG` and `node scripts/generate-auto-thumbnail-fixture.mjs
<new-directory>`; never silently replace the committed fixture.

Task04 converts these modules to strict TypeScript and resolves historical public
declaration/CommonJS differences. Task05 verifies old/final cores and actual
devices; task06 covers installed package entries and the real demo/editor. The
types and package version are unchanged at this checkpoint. Use
`refactor/baselines/auto-thumbnail-contract.md` and `auto-thumbnail-failures.md` as
the historical evidence map; do not regenerate those baselines from this source.
