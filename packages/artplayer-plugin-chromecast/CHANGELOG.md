# Changelog

## 2.0.0 (unreleased)

This independent major version identifies the compatibility modernization. Existing public APIs remain the compatibility target; documented historical differences and release gates still apply.

- Typed SDK initialization, session/receiver state and failure ownership.
- Keep old public plugin surface; physical Cast/receiver verification is separate.

Internal dependencies and public entrypoints retain their documented compatibility boundaries. No new core-major peer restriction is introduced.

Implementation and migration details: [README.md](./README.md), [ARCHITECTURE.md](./ARCHITECTURE.md).

This entry records local preparation. Candidate contents, browser/device evidence and publication still require their release checks.
