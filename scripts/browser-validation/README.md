# Browser validation scopes

`yarn test:browser:source` runs every `test/browser/**/*.spec.js` under the normal
three-engine configuration. The launcher clears only ARTPLAYER_BROWSER_ARTIFACTS
from the child environment, so an installed-core map inherited from CI cannot
mislabel source/explicit-vendor SDK tests. The caller's environment is untouched.
Other deliberate fixture switches retain their existing meaning.

`yarn test:browser:installed` requires ARTPLAYER_BROWSER_ARTIFACTS from
`yarn test:package --include=artplayer-plugin-ambilight,artplayer-proxy-canvas,artplayer-plugin-document-pip`.
Both launcher and config validate the selected five packages' installed hashes
and source/build freshness. `scope.ts` lists the currently supported installed
test files. This is a growing installed subset, not full ecosystem acceptance.
Source checks remain complete when the installed list grows.

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

CI executes both scopes with `if: !cancelled()` and no continue-on-error. An
ordinary source failure still permits installed evidence, while the failed step
keeps the job failed. Both report directories upload with always(). Node/runtime
and framework consumers keep their earlier fixed two-package scope. Full matrix
timing, remote cancellation behavior and runner execution remain CI-01/CI-04
acceptance items; local configuration checks do not establish those results.
