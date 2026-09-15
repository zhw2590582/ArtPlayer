# Changelog

## 2.0.0 (unreleased)

This independent major version identifies the compatibility modernization. Existing public APIs remain the compatibility target; documented historical differences and release gates still apply.

- Typed renderer/Worker/font ownership and native drawing compatibility.
- Preserve root entry and precise /runtime; hybrid late drawing issue remains an explicit blocker.

Internal dependencies and public entrypoints retain their documented compatibility boundaries. No new core-major peer restriction is introduced.

Implementation and migration details: [README.md](./README.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [types/README.md](./types/README.md).

This entry records local preparation. Candidate contents, browser/device evidence and publication still require their release checks.
