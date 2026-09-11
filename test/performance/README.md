# Paired performance and cleanup

Run `yarn test:package` first. Set `ARTPLAYER_BROWSER_ARTIFACTS` to the resulting
`refactor/.cache/packages/run-*/browser-artifacts.json`, then run
`yarn test:performance`. The command starts its own local server; do not run it
alongside other browser tests or CPU-heavy builds. All three engines run with one
worker, no trace/video recording and the same media and viewport within a pair.

Each engine runs three alternating published/candidate pairs. Each side retains
one warm-up and five timed samples for both core and core + chapter, followed by
separate instrumented resource probes. `scripts/performance-fixture.mjs` adapts
only the frozen BASE-06 fixture's script URLs and report transport. Its original
files remain unchanged and their existing baseline tests still run.

The candidate must come from an isolated package installation. Artifact hashes,
source snapshots, package inputs and build tools are checked before measurement;
an old candidate cannot silently stand in for changed source. Raw, gzip 9 and
Brotli 6 compare matching modern, legacy and ESM files from the same installation.
Timing uses the exact JS files selected by the artifact map.

Reports are in `refactor/.cache/performance/run-<engine>-*/report.json` and
`summary.md`. Playwright evidence is in `refactor/.cache/performance/browser/`.
CI uploads both and appends summaries to the workflow run. Failed or incomplete
runs remain recorded and are not promoted to a passing baseline.

A successful test proves the measurement contract and candidate resource cleanup.
`review-required` means size or timing thresholds were exceeded; it is not release
approval. CORE-22 and release reviews must resolve the corresponding risks before
publishing. These counters do not measure native heap/GPU memory, real mobile
hardware or screen-reader behavior. See `refactor/coverage-performance.md`.
