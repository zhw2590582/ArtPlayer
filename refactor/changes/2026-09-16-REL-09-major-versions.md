# REL-09: prepare independent major versions

## Scope and compatibility

All 22 workspace manifests now use the exact targets frozen by REL-01: core and
Danmuku 6.0.0, Ads and ASR 3.0.0, Thumbnail tool 5.0.0, and the remaining
17 workspaces 2.0.0. The private root and example versions remain unchanged.
Each package has an unreleased CHANGELOG with its own implementation and
migration details. Thumbnail's explicit package file list includes that file;
the other library packages already include it through their existing pack rules.
VitePress remains site distribution, without new npm publication authorization.

External dependency and peer ranges are unchanged. The 22 packages do not declare
dependencies on one another, so this change needs no workspace dependency range
rewrite and introduces no core-6-only peer requirement. Frozen Yarn installation
retains the root lockfile byte for byte; no example lockfiles are introduced.
The React and Vue example manifests now reference the local core, Danmuku and
Document PiP packages. Their READMEs explain root commands and rebuilding those
libraries before use. External consumer tests still install actual tarballs
outside the repository and verify their contents, rather than using these links.

`yarn check:versions` runs the existing prepared-plan validator and is now in
`ci:check`. It rejects incomplete version/changelog/example preparation and
unplanned external dependency changes. The frozen source-version inventory,
registry observation and historical consumer fixtures are preserved.

## Build and package checks

Canonical Node 24.21.0 and Yarn 1.22.22 were used. The frozen offline root install,
strict toolchain check and `yarn ci:build` passed. That build regenerated library
distributions, editor/site outputs and the docs site through repository scripts.
All five import/SSR/i18n/distribution smoke tests passed. Core's ESM public
`Artplayer.version` was separately asserted to equal the manifest's 6.0.0.

A local validation packed all 21 libraries with Yarn, then used the existing
`packedFiles`, `checkFiles` and `readMember` helpers to verify:

- packed manifest names and versions match the frozen targets;
- CHANGELOG content and unreleased headings match the workspace files;
- declared entrypoints/exports exist and implementation TypeScript does not leak;
- main, legacy and ESM bytes match both package/dist and docs/compiled;
- all three entrypoint banners contain the target version.

The report retains tarball and entrypoint hashes. This preparation check does
not replace REL-02's full candidate compatibility matrix or publication gates.

The fresh read-only registry snapshot is
`baselines/version-registry-prepared-2026-09-16.json`: all target versions remained
unobserved, with no higher stable major conflict. A 404 or unpublished history
does not establish package-name ownership. No registry write occurred.

## Native consumer validation and discovered test issue

React initially passed the three development browser profiles, then failed
before loading the production page: Windows assigned port 6566 to the test
server's port-0 request and Chromium rejected it with `ERR_UNSAFE_PORT`.
The original failed report remains in `.cache/react-consumer-Jmwio4`.
The consumer scripts now start Vite's available-port search at 4173 (React)
and 4174 (Vue), instead of requesting an arbitrary operating-system port.
No player API or browser assertion was changed to resolve this failure.

Both final isolated consumer runs passed types, frozen installs, development and
production builds, and all six native browser profiles each: Chromium
153.0.8010.12, Firefox 155.0 and Windows WebKit 26.6. Checks include actual
play/pause/seek, decoded pixels, plugin use, component updates and resource
cleanup. Their three tarball hashes match the 21-package preparation snapshot.
Windows WebKit is not physical Safari/device evidence.

`yarn ci:check` finished successfully in 414.63 seconds. Its three Node test
groups passed 2,952 implementation tests, 180 engineering tests and 627 frozen
baseline tests (3,759 total, zero failures/skips). Strict types, lint, generated
declaration/site checks and the new prepared-version gate also passed. The two
consumer scripts additionally passed targeted lint after their port change.

The [machine-readable validation record](../baselines/major-version-preparation.json)
links the full command logs, final reports and package hashes. Previously
collected reports with the old version
numbers remain historical evidence; this task does not relabel them as new-major
candidate validation. Existing SDK/device, site, combination and release blockers
remain tracked. After implementation the user will guide the formal review
rounds; this task does not start them, push, deploy or publish.
