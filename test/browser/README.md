# Browser regression entry

Use the pinned Node and Yarn versions, then run:

```sh
yarn install --frozen-lockfile
yarn test:browser:install
yarn test:browser
yarn test:browser --project=chromium
yarn test:browser:report
```

The three projects run actual Chromium, Firefox and WebKit. They use isolated browser contexts,
no retries, a loopback server on 8084, and no existing dev server. Set `ARTPLAYER_BROWSER_PORT`
to use another free port. The server builds core and chapter from current JS/TS entries in memory;
it does not modify dist or docs outputs. Restart the test command after source changes.

`hls-control.spec.js` separately builds HLS control and verifies a pinned Hls.js 1.5.17 archive.
Its local playlists/segments are generated fixtures with checked hashes. Windows WebKit lacks MSE:
one explicit capability/error-cleanup test covers that limitation and its 14 playback cases are
skipped with a reason. Chromium/Firefox run the full four-combination HLS matrix. This is not
Safari playback approval; see [HLS validation](../../refactor/hls-validation.md) for evidence and open gates.

`playback.spec.js` tests published/current core with current chapter, real decoded frame colors,
media time advancing, pause, seek, source change to the existing docs video, destroy and real
HTTP failure. These are initial smoke contracts, not full chapter or lifecycle coverage.
`fixtures.js` captures browser version, actual scripts/media hashes, page errors, console errors,
failed requests and final state. Tests attach decoded pixels and server-side media requests too.
Windows WebKit media requests are not reliably visible to Playwright's page network events;
use the loopback request log to prove that media was fetched. Its `videoWidth` can reflect layout
size, so intrinsic-size compatibility is a separate test, not the playback-success predicate.
Chromium's `net::ERR_ABORTED` and Firefox's `NS_ERROR_PARSED_DATA_CACHED` may cancel media range
requests after buffering. The successful-playback tests allow only the exact engine-specific code,
same-origin media type and two URLs bearing the current test ID; raw failures remain in reports.
See [Mozilla's media-cache explanation](https://bugzilla.mozilla.org/show_bug.cgi?id=1347174#c4).

Reports, failure screenshots and traces are under `refactor/.cache/browser/`. They contain local
test URLs and paths. JSON and HTML are regenerated each run; archive them before another run
if evidence must be retained. A successful HTTP page fetch does not validate its editor UI.

## Files and routes

- `server.mjs`: current/published artifact provenance, docs serving, Range and controlled failures.
- `player.html`: lightweight page, real ArtPlayer constructor and user-gesture play/pause buttons.
- `fixtures.js`: per-test error and provenance attachment; contexts/storage are Playwright-owned.
- `playback.spec.js`: behavior assertions shared by browser and core version.
- `media/`: committed synthetic fixtures. CI needs no FFmpeg to use them.

`/test/manifest.json` identifies every mapped core/chapter artifact and synthetic media file by
SHA-256. `/published/<package>.js` verifies the frozen npm archive/member from BASE-01.
`/candidate/<package>.js` maps the current build. Existing docs `/compiled/<package>.js` and
`/uncompiled/<package>/index.js` are aliases for that candidate. Other compiled/uncompiled paths
fail explicitly; add a verified mapping before testing another package, rather than serving stale
build output. Other docs pages, examples and samples use their existing paths without source edits.

`/test/pattern.mp4` and `.webm` support GET/HEAD and single byte ranges (including suffix ranges).
Invalid ranges return 416. `/test/fail.mp4` always returns 503. Add a unique `?case=<test-id>` to
media URLs and inspect `/test/requests.json?case=<test-id>` for actual server requests. The log is
bounded and server-local; it is not a production endpoint or a substitute for decoded frames.

To test extracted candidate UMD files, set `ARTPLAYER_BROWSER_ARTIFACTS` to a JSON file:

```json
{
  "artplayer": "./extracted/artplayer/dist/artplayer.js",
  "artplayer-plugin-chapter": "./extracted/chapter/dist/artplayer-plugin-chapter.js"
}
```

Paths resolve relative to that JSON. Both keys are required; missing files abort startup. No source
fallback is allowed in this mode. ENG-07 owns tarball creation and broader consumer checks.
For manual docs interaction, run `node test/browser/server.mjs` and open the existing editor URL
on 8084 with chapter's libs/example parameters. EX-03 still owns the full Monaco Run/TS/storage
workflow, all examples and external SDKs. The lightweight page does not complete that task.

## Synthetic media provenance

Generated locally from FFmpeg's `testsrc2`, without external footage or audio, using
`ffmpeg version 2025-11-12-git-6cdd2cbe32-full_build-www.gyan.dev`:

```sh
ffmpeg -f lavfi -i testsrc2=size=320x180:rate=24 -t 8 -an -c:v libx264 -profile:v baseline -pix_fmt yuv420p -movflags +faststart test/browser/media/pattern.mp4
ffmpeg -f lavfi -i testsrc2=size=320x180:rate=24 -t 8 -an -c:v libvpx -b:v 160k test/browser/media/pattern.webm
```

MP4 SHA-256: `0ad1d7ad286aec6e0fa9e27fc1e487e7277df2e603e30040fb942365763d0233`.
WebM SHA-256: `9d3c2b3dec9581a599de2d6732992ef7846790e0d1368e6e131bd339b39e984f`.
MP4 is the initial playback contract; WebM is available for subsequent codec-specific cases.
Do not regenerate fixtures silently: update hashes and decoded-frame checks together.

The docs `assets/sample/video.mp4` remains an existing sample with its original provenance limits
tracked by BASE-MEDIA-01. The new synthetic fixtures do not resolve rights for existing media.
Browser binaries/codec support vary by OS; these projects do not replace Safari/iOS/Android
device checks. See the [official browser guidance](https://playwright.dev/docs/browsers).
