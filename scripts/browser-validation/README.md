# Browser validation scopes

`yarn test:browser:source` runs every `test/browser/**/*.spec.js` under the normal
three-engine configuration. The launcher clears only ARTPLAYER_BROWSER_ARTIFACTS
from the child environment, so an installed-core map inherited from CI cannot
mislabel source/explicit-vendor SDK tests. The caller's environment is untouched.
Other deliberate fixture switches retain their existing meaning.
The complete Chromium source collection at the recorded checkpoint executed
1,481 cases in 152 files: 1,480 passed and the original dash.js 4.5.2 native seek
control failed with exit 1. See
`../../refactor/baselines/ci-source-chromium-validation.json`; this is evidence of
the open DASH-SEEK-01 issue, not a green full CI or all-engine result. Source scope
also retains explicit historical and committed-artifact cases; its name does not
promise that every dependency is rebuilt from current source in every test.

`yarn test:browser:installed` requires ARTPLAYER_BROWSER_ARTIFACTS from
`yarn test:package --browser`.
Both launcher and config validate the selected packages' installed hashes
and source/build freshness. `scope.ts` lists the currently supported installed
test files. This is a growing installed subset, not full ecosystem acceptance.
Source checks remain complete when the installed list grows.

Iframe adds five installed files through `iframeBrowserCandidate()`. Its actual
published predecessor is `artplayer-plugin-iframe`; required current tool paths
are checked against the frozen workspace manifest rather than invented npm tool
contents. Candidate parent/child evidence includes installed provenance, while
historical rows retain their own names and bytes. Installed scope rejects the
Iframe baseline/lifecycle-only/boundaries-only diagnostic flags. The separate
history server still uses `iframeCandidate()` and may receive a core-only map;
its source/explicit tool selection has not become installed-tool acceptance.

VAST's installed entry is `vast-package.spec.js`: complete glomex bundle,
controlled native SDK script failure/readiness, registration cleanup and actual
main-content decoding. The original `vast.spec.js` substitutes the glomex boundary
and remains source-only. Real Google IMA execution stays in `test:vast-native`;
that separate config now accepts a verified core/Chapter/VAST installation map
and all native candidate files record the installed identity before initialization.
Loader tests cannot stand in for native advertising, devices or SDK availability.

Ads media/lifecycle and UI files use `test/helpers/browser-candidate.js` to select
the verified installed plugin whenever an artifact map is present. An additional
ARTPLAYER_ADS_ARTIFACT override is rejected instead of mixing candidates. Missing,
stale or changed installations fail before source compilation; each candidate
case attaches installed file, archive and source identities. Explicit published
Ads/core controls still use their frozen old inputs. Without a map the same files
keep source or explicitly selected artifact behavior. This does not cover VAST,
Ads editor types, the separate native-visibility suite or physical devices.

`scope.ts` owns the typed scope, package/test roster, argument policy and report
paths. The two thin Playwright configs preserve the base engine, retry, timeout
and server settings. `../browser-check.mjs` owns preflight, child environment,
process exit/signal forwarding and invocation/result metadata. The existing
`yarn test:browser` entry remains available for established ad hoc commands.

Reports use `refactor/.cache/browser-source/` and `browser-installed/`; one scope
cannot overwrite the other's JSON, HTML, traces or screenshots. Archive existing
local reports before rerunning the same scope. Invocation JSON records arguments
and artifact identity; result JSON records the child's actual exit. Preflight
errors occur before starting Playwright and remain in the terminal/CI tee log.
Listing tests with `--list` is collection evidence only, not playback validation.
`verifyInstalledBrowserEnvironment()` in `scope.ts` runs in both the launcher
and the installed Playwright config, before reading installed artifacts. Direct
config loading therefore cannot bypass the launcher's existing MediaBunny,
Iframe, Mask or DASH execution-policy checks. Both paths also reject active
JASSUB fixture substitutions (custom canvas, on-demand/offscreen/async selection,
rAF/screenshot observation, bitmap/idle/single-flight controls) and Multiple
Subtitles' native-event restoration control. Explicit inactive values remain
valid; source tracing that does not replace the restoration condition remains
available. This protects the standard test contract, not the player's public
runtime configuration. The existing native JASSUB test keeps its explicit
main-thread setting, and hybrid still selects actual browser capability.
For deliberate alternate scheduling/rendering, use `yarn test:browser` with
explicit input selection or the source launcher; do not label that run as the
standard installed scope. No environment variable is silently cleared to turn a
diagnostic run into an apparent normal result.
The complete five-package installed main subset was run on Windows with two
workers: 255 successful cases across 11 files and three engines, including six
unsupported WebKit Document PiP capability records. See
`../../refactor/baselines/ci-installed-full-validation.json` for the exact inputs,
per-engine/file counts and limitations; this is not full ecosystem or remote CI.
Local `--grep`, file names, workers and project options are supported for diagnosis;
config/output/report overrides and passing with zero tests are rejected.

CI runs a complete OS × engine matrix (Linux, Windows, macOS; Chromium, Firefox,
WebKit). Each playback job prepares `test:package --browser`, then invokes both
scope launchers with only `--project=${{ matrix.browser }}`. Matrix jobs have
independent runners, artifact names include the engine, and the final `CI result`
requires every combination. Node/framework consumers, iframe history and
performance run once per OS in the separate `browser-consumers` job. This avoids
repeating their existing three-engine suites for every playback engine. No test
filter or retry policy changed. Remote timings remain unverified; collection
equivalence proves coverage selection, not playback success. See
`../../refactor/changes/2026-09-15-CI-01-browser-matrix.md`.

The six-package Ads expansion ran 426 cases across 13 files: 425 passed and one
WebKit candidate Chapter quality-readiness check failed. All 171 Ads cases passed,
including 108 with verified candidate tarballs; this is not a green full suite.
The trace includes a 9.94-second media-state evaluation and remains open under
CHAPTER-TIMING-01. A separate targeted Chromium source-build Ads case passed.
See `../../refactor/baselines/ci-ads-installed-validation.json`; old reports and
the actual exit 1 remain intact, without retries or increased timeouts.

CI executes both scopes with `if: !cancelled()` and no continue-on-error. An
ordinary source failure still permits installed evidence, while the failed step
keeps the job failed. Both report directories upload with always(). Node/runtime
and framework consumers keep their earlier fixed two-package scope. Full matrix
timing, remote cancellation behavior and runner execution remain CI-01/CI-04
acceptance items; local configuration checks do not establish those results.

The Audio Track, VTT Thumbnail and Multiple Subtitles expansion adds 12 files.
Each candidate loader selects verified installed bytes when a map is present and
rejects a conflicting explicit artifact; VTT also rejects its frozen baseline flag.
Candidate attachments carry the file, archive and source identities. Audio retains
its historical "source audio" test label for the candidate slot; audio-inputs.selected
is the actual origin. Native WAV capability and old-host defect observations must
not be counted as successful feature acceptance. Shared Node/type consumers retain
the core/chapter scope. See ../../refactor/changes/2026-09-15-CI-01-subtitles-installed.md
for the executed subset and results; extending collection does not revalidate the
previous Chapter failure or establish a green complete matrix.

HLS Control, DASH Control and Auto Thumbnail add seven installed files. HLS/DASH
real SDK cases retain frozen release and media hashes; controlled DASH DOM cases
are separate from adaptive playback. DASH SDK capability probes do not load the
plugin; dash-plugin-inputs identifies actual plugin integration. Installed mode
rejects diagnostic SDK patches/debug replacements and synthetic recovery probes,
while source diagnostics remain explicit. Auto Thumbnail uses native media/JPEG
with a stub host and retains its presentation/fallback pixel limitations. See
../../refactor/changes/2026-09-15-CI-01-adaptive-installed.md for executed results.

`yarn test:package --browser` derives additional packages from installedPackages
in scope.ts, so CI preparation and browser preflight share one roster. The default
command still prepares core/chapter; --include retains explicit subsets. Unknown,
duplicate, empty or conflicting --browser/--release/--include options fail before
building. --browser is preparation, never full release acceptance.

ASR adds six native audio/routing/CORS files, including a composition that checks
ASR and Audio Track identities separately. Historical inputs, unsupported WebAudio
and deliberately forced fallback branches remain labeled. Chromecast adds its
controlled SDK lifecycle file with actual core DOM/local media; it does not run
a Cast receiver. VAST controlled tests externalize and replace a dependency, so
they are not advertised as installed bundle coverage. Its real IMA suite retains
its independent gate. See ../../refactor/changes/2026-09-15-CI-01-asr-cast-installed.md.

MediaBunny adds ten files using the installed proxy and its bundled SDK; native
Document PiP combinations also record the verified PiP package identity. The
runner rejects ARTPLAYER_MB_BROWSER_CANDIDATE=1 in installed mode, retaining
historical controls, and the loader rejects frozen-workspace/artifact overrides.
Available-input attachments list possible inputs; per-observation provenance
identifies the selected one. Native media/decoding, controlled races, API absence
and physical/long-run verification remain separate. See
../../refactor/changes/2026-09-15-CI-01-mediabunny-installed.md for actual results.

JASSUB adds its native rendering, lifecycle, hybrid, render-failure and platform
control files. The native-render file retains published inputs and adds installed
candidates; its source-mode historical default stays unchanged. Three other
wrapper suites build source unless an installed map or explicit artifact selects
them. Installed worker JS and both WASM files are served at the existing URLs,
with archived-member and frozen-resource hashes verified before serving. The
local font is identified separately; it is not part of the plugin tarball.
Package worker inventories now participate in input freshness checks. The
platform control loads no JASSUB; historical failures, capability controls and
actual rendering must be reported separately. See
../../refactor/changes/2026-09-15-CI-01-jassub-installed.md.

Danmuku and Mask add thirteen files, including immutable historical/load controls,
Worker lifecycle/scheduling, heatmap density, timing/pressure, fullscreen, native
PiP and actual model composition. Candidate wrappers use installed UMDs; Danmuku
executes the Worker embedded in that UMD. Each composition records its selected
Danmuku and PiP/Mask identities. The model is a separately configured local asset
set, verified against frozen bytes and exposed as local-model-resource in the
server manifest. Metadata may normalize checkout newlines; executable/model bytes
may not. Installed runs reject Mask CPU profiling; source diagnostics retain it.
Actual resource requests, available assets, capability controls and successful
playback remain separate. See
../../refactor/changes/2026-09-15-CI-01-danmuku-installed.md for executed results.
