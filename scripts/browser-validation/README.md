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
`yarn test:package --include=artplayer-plugin-ambilight,artplayer-proxy-canvas,artplayer-plugin-document-pip,artplayer-plugin-ads,artplayer-plugin-audio-track,artplayer-plugin-vtt-thumbnail,artplayer-plugin-multiple-subtitles`.
Both launcher and config validate the selected nine packages' installed hashes
and source/build freshness. `scope.ts` lists the currently supported installed
test files. This is a growing installed subset, not full ecosystem acceptance.
Source checks remain complete when the installed list grows.

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
The complete five-package installed main subset was run on Windows with two
workers: 255 successful cases across 11 files and three engines, including six
unsupported WebKit Document PiP capability records. See
`../../refactor/baselines/ci-installed-full-validation.json` for the exact inputs,
per-engine/file counts and limitations; this is not full ecosystem or remote CI.
Local `--grep`, file names, workers and project options are supported for diagnosis;
config/output/report overrides and passing with zero tests are rejected.

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
