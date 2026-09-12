# PKG-IFRAME-05 native cached history and interrupted navigation checkpoint

Started from b35183c7af10a7309c9409b50fe8d5fda9db9ffb with a clean worktree.
The preceding checkpoint verifies actual player and Monaco integration. This
checkpoint addresses genuine BFCache restoration and external navigation
interruption without changing public APIs or production runtime bytes.

## Reproducible browser environment

The installed Playwright 1.63.0 source explicitly adds
`--disable-back-forward-cache` to Chromium. Its default headless shell also
reloaded this fixture after that argument was removed. The separate
`playwright.iframe-history.config.js` therefore uses the full `chromium` channel
and removes only that BFCache-disabling argument. Ordinary browser tests retain
their original configuration and report directory.

Initial download of full Chromium 153.0.8010.12 timed out. A supplementary probe
with the already installed full 151.0.7922.34 demonstrated actual restoration,
but is not substituted for the pinned-version results. After confirming a local
proxy listener, a process-scoped HTTPS_PROXY allowed the normal Playwright
installer to download full 153.0.8010.12. No machine proxy or repository proxy
configuration was changed. No package dependency version was changed.

`yarn test:iframe-history` uses a separate local fixture server on port 8085 and
records to `refactor/.cache/iframe-history`. The browser receives real HTTP pages,
core/tool scripts and media with cacheable headers. There is no request routing,
synthetic pageshow event, reconstructed document, or mocked media in this matrix.
The parent and child each retain an independent random document witness and
native page lifecycle events. All candidate script and fixture hashes are in
the environment attachment. Artifact overrides never silently fall back to source.

The GitHub browser job now runs this command and uploads its evidence directory.
Local Windows evidence is not evidence that the hosted macOS job has executed.

## History assertions

The history matrix has 36 cases: cores 4.5.9, frozen 5.4.0 and candidate; same
and cross origin; paused and playing; Chromium, Firefox and WebKit. Full Chromium
must show actual `pageshow.persisted`, unchanged parent/child witnesses and
unchanged private document IDs. Player position/rate and the pending resolver
survive in the same document, communication resumes, playback works and resources
can be destroyed. Private resume packets must not become public callbacks or
duplicate the original inject callback.

Whole-page caching freezes the parent too. A child's best-effort pagehide message
may not reach that frozen parent. The test correlates the request state with the
actual delivered private phases: with no delivered leave, the old request stays
pending and can resolve after restoration; with a delivered leave it must already
be rejected and a late resolver cannot change the result. This is distinct from
the existing child-only navigation tests, where an active parent processes leave.

Firefox and WebKit currently recreate both documents. These cases explicitly
record `reload-control`, verify changed witnesses and successful fresh playback,
and do not count toward actual BFCache acceptance. Native Firefox/WebKit cached
restoration and physical devices remain unverified.

## Interrupted navigation assertions

Another 54 cases cover the same three cores and two origins on all three engines:

- Stop a genuinely pending HTTP navigation. Chromium uses native CDP
  `Page.stopLoading`; Firefox and WebKit use top-window `window.stop()`.
- Return HTTP 204, retaining the old document.
- Start an HTTP 200 document response, declare more bytes than are sent, then
  destroy the connection after writing the partial HTML.

An active old document can still settle a request it already received. A committed
replacement cancels old owned work. Queued new requests cannot execute in the old
document and remain waiting until a subsequent valid iframe source injects. The
test then starts another stalled navigation, destroys the tool and removes the
frame, checking immediate rejection and release of the test server's barrier.

This preserves the existing absence of implicit request timeouts. A failed target
does not automatically authorize commands to run in a different old document.
The application can navigate to another valid source or destroy the tool. These
tests establish those recovery paths, not automatic recovery from every network
failure or an undocumented timeout policy.

## Failed probes retained

`iframe05-history-probe*.json/log` retain shell/full browser comparisons, the
missing full-browser executable, and actual supplementary/pinned-version probes.
The full installer logs retain direct timeout and process-proxy success.

Chromium's automation frame inventory omitted the restored cross-origin child in
the probe even while native parent/child witnesses and SDK communication survived.
The permanent tests inspect the restored child through the actual public commit
protocol rather than relying on an automation-side Frame object.

The first stop probe stalled while evaluating the old cross-origin child during
its pending navigation. Sending a stop signal to that child, and then calling
top-window stop, also failed to terminate the pending cross-process navigation in
Chromium. The final test uses the browser's Page.stopLoading command there. These
failures are preserved in `iframe05-interruption-probe*.json` and complete results
directories. No SDK behavior was changed to work around the driver/browser stop
boundary; the exact stop mechanism is recorded per engine.

Final source/main/legacy results, input hashes, CI and workflow verification are
recorded in `baselines/iframe-history-validation.json`. Task 05 remains doing and
its risk records stay open for remaining device/cache-engine/release acceptance.
No push, tag, npm publication or major-version release is performed.

## Final verification and rollback

- Source/main/legacy each pass 90 cases without skips, retries or flaky results:
  270 total, including 36 actual Chromium cache restorations, 72 explicit reload
  controls and 162 interruption/recovery cases.
- Full CI passes 1544 tests (1365 unit, 14 engineering, 165 baseline) and strict
  checking of 330 production TypeScript files; import/SSR checks pass 3 tests.
- actionlint 1.7.12 validates the updated workflow. All new browser/config files
  pass lint. The generated core editor's existing unused directive warning is
  unchanged. No new coverage run is claimed for unchanged production source.
- The runtime source and all three iframe distribution files match the preceding
  checkpoint byte-for-byte. No package rebuild is necessary for these test/docs
  and CI-only changes. Hosted CI, physical devices and other cache engines are
  not promoted to passed from local evidence.

Rollback removes the independent history test/config/server/script and CI step
together, and restores the linked documentation/evidence. It does not require a
runtime rollback or change the old public API.

Checkpoint subject: `test(iframe): [PKG-IFRAME-05] verify native cached history and interrupted navigation`.
