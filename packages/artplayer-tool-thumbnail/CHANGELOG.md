# Changelog

## 5.0.0 (unreleased)

This independent major version identifies the compatibility modernization. Existing public APIs remain the compatibility target; documented historical differences and release gates still apply.

- Typed source/extraction/input/emitter ownership and actual constructor declarations.
- Approved published-3.5 default with workspace-4.4 opt-in; preserve delay/height, event and input policies and historical creat* names.

Internal dependencies and public entrypoints retain their documented compatibility boundaries. No new core-major peer restriction is introduced.

Implementation and migration details: [README.md](./README.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [types/README.md](./types/README.md).

This entry records local preparation. Candidate contents, browser/device evidence and publication still require their release checks.
