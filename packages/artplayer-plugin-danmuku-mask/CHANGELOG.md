# Changelog

## 2.0.0 (unreleased)

This independent major version identifies the compatibility modernization. Existing public APIs remain the compatibility target; documented historical differences and release gates still apply.

- Typed model/SDK lifecycle, rendering and cancellation.
- Preserve model behavior; combined native load and final SDK/device resource evidence stay explicit.

Internal dependencies and public entrypoints retain their documented compatibility boundaries. No new core-major peer restriction is introduced.

Implementation and migration details: [README.md](./README.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [types/README.md](./types/README.md).

This entry records local preparation. Candidate contents, browser/device evidence and publication still require their release checks.
