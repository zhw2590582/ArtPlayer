# Changelog

## 6.0.0 (unreleased)

This independent major version identifies the compatibility modernization. Existing public APIs remain the compatibility target; documented historical differences and release gates still apply.

- Typed input, scheduling, Worker placement, renderer, UI and resource ownership.
- Fix issue #958 heatmap density and CPU/async/first-frame scheduling loss; retain root published types with precise /runtime.

Internal dependencies and public entrypoints retain their documented compatibility boundaries. No new core-major peer restriction is introduced.

Implementation and migration details: [README.md](./README.md), [ARCHITECTURE.md](./ARCHITECTURE.md).

This entry records local preparation. Candidate contents, browser/device evidence and publication still require their release checks.
