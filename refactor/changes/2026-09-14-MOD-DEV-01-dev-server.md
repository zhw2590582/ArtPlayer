# MOD-DEV-01: Owned development server and failure lifecycle

## Scope and reproduced defect

Starting from MOD-02 commit 401d4cdd6557a69f9cfaf564f2b68f8589e526e2,
replace Servor's HTTP/watch/reload lifetime with small strict TS modules. This
changes repository development tooling, not any package runtime, declarations,
DOM hooks or distribution entrypoints. Default port8082, docs root, package output
paths, old dev command, --no-open and first-success browser opening remain.

The retained `refactor/scripts/servor-port-probe.mjs` reproduces pinned Servor4.0.2
printing an occupied-port error then exiting0. It uses a private random port;
the user's existing8082 service is untouched. Missing close ownership was observed
in upstream source; this does not assert an independently measured upstream leak.

## Structure and resource ownership

- `server.ts`: bind exactly the requested port, own HTTP sockets/request Promises,
  recursive docs watcher, debounce and shutdown. Fatal errors notify the session
  immediately so late builds cannot reopen/reload it, then finish cleanup.
- `assets.ts`: realpath-contained static files, directory/index/fallback routing,
  classic JS MIME, HTML reload injection, gzip and single media byte ranges.
  Node stream pipelines release file/compression resources on disconnect and are
  awaited by shutdown. Outside symlinks/junctions are rejected.
- `reload.ts`: SSE client set and one shared heartbeat, removed when the final
  client disconnects or the channel closes. Browser pagehide closes EventSource.
- `development.ts`: explicit session `{ url, close, done }`, source watcher,
  serialized/coalesced builds and AbortSignal. Close stops future work and awaits
  startup/active build, including abort while asynchronous binding is unfinished.
- `dev.js`: owns/removes SIGINT/SIGTERM handlers, validates optional
  ARTPLAYER_DEV_PORT and propagates fatal failures as exit1. Port0 requests atomic
  allocation for tests. Ordinary compiler failures retain the watcher for retry.

The actual module map and modification guidance live in
[scripts/library/README.md](../../scripts/library/README.md), with test, browser,
typechecking, CI and development entry documentation updated together.
`LibraryConfigOptions.outDir` becomes optional to describe existing write:false
browser resource builds accurately; runtime production config is unchanged.

## Dependencies and compatibility

Add only root devDependency **mrmime2.0.1** (installed MIT license), using its own
types for MIME lookup. The root Yarn lock gains its single entry. A brief sirv3.0.2
evaluation was removed: owning range and stream teardown directly keeps these
critical media-serving semantics visible. Vite dev transforms are unsuitable for
the existing classic Monaco scripts, and preview process hooks would compete with
the session's shutdown ownership. Servor4.0.2 stays only for openBrowser and the
historical probe; its HTTP API is no longer imported or declared.

Yarn1.22.22/Node24.21.0, Lerna, package runtime dependencies and installation hooks
remain. Frozen install with --ignore-scripts and strict toolchain validation pass;
the install check does not claim executing postinstall. `test:dev-server` is added
to `test:node`/`test:library`; existing CI strict types and three-browser jobs cover
the new modules/spec automatically. No remote workflow run is claimed.

| Surface | Result |
| --- | --- |
| Consumer API/types/events/DOM/exports | No package source or public declaration changes |
| CLI and URLs | Existing commands/default8082 retained; optional port env is additive |
| Failure | Occupied port now exit1; never kills the pre-existing server |
| Build/watch | Serial builds, compiler-error recovery and first-success open retained; successful output alone triggers build reload |
| HTTP | Valid directory slash redirect/index; missing extensionless route returns fallback200 instead of old malformed301 without Location |
| Media/static HTTP | Correct body-free HEAD, gzip;q=0, byte0-0/suffix/open ranges and 416 for invalid ranges; files remain untransformed |
| Shutdown | Idempotent close/done, SIGINT/SIGTERM cleanup, no process.exit or global server signal hooks |

These are development-server corrections, not a new public playback API or a
production hosting replacement. Shared source/config/dependency edits still need
restart; only selected src builds and docs asset edits are watched.

## Verification and limits

Authoritative results and fingerprints are in
[dev-server-validation.json](../baselines/dev-server-validation.json).

- 8 new Node tests: real HTTP/HEAD/gzip/ranges and malformed paths, outside
  junction, real occupied-port CLI exit1 with the original service still serving,
  three same-port lifetimes with SSE, aborted16MB download, cancellation during
  startup/build and a separate controlled-clock heartbeat test.
- 26 library regression tests pass, including real generated plugin builds and
  consumers. Strict library types and lint pass with the existing one docs type
  warning. 50 CI regressions and the full baseline suite are recorded separately.
- Six final Windows browser cases cover real CLI TS/Less/SVG/worker builds,
  automatic source/docs reload, syntax-error recovery and natural exit0 after
  invoking the SIGTERM handler. Windows uses IPC to emit that event; native Unix
  signal delivery remains a remote OS check.
- Actual docs/Monaco runs TS, plays local MP4, pauses/seeks and yields opaque
  decoded canvas pixels in Chromium153.0.8010.12, Firefox155.0 and WebKit26.6.
  Attachments record the actual tracked core5.4.1 and sample hashes, dimensions,
  time, editor models and browser versions. This validates the replacement server;
  it does not certify a newly built npm candidate or all editor type diagnostics.
  Third-party analytics/ads are inert test routes.
- Initial Node failure was a message-regex assertion against Node's empty
  AggregateError message; the test now requires exact ECONNREFUSED code. Initial
  docs failures were an init script writing storage on about:blank and assuming
  WebKit supplies requestVideoFrameCallback. Restrict storage setup to the owned
  origin and assert a real decoded canvas frame alongside actual playback/seek.
  Failed reports are retained; no production pixel or playback assertion removed.

Linux/macOS remote CI, physical devices and release candidate validation remain
their own gates. These local results close DEV-SERVOR-PORT-01 within this task's
occupied-port and resource ownership scope, not the whole modernization plan.

## Delivery and rollback

Commit this task alone with [MOD-DEV-01], including source/tests/docs/lock/status.
Revert that dedicated commit as a unit to restore the previous tooling; doing so
also restores the recorded upstream port failure. No package artifacts needed
regeneration, no version bump, push or publication occurs here. Subsequent
performance measurements must use fresh artifacts because the lock/tooling
fingerprint changed; previous measurements cannot silently remain current.
