# Changelog

## 2.0.0 (unreleased)

This independent major version identifies the compatibility modernization. Existing public APIs remain the compatibility target; documented historical differences and release gates still apply.

- Separated metadata, frame capture, encoding and plugin cleanup in TypeScript.
- Native frame readiness/pixel issues remain tracked; migration does not claim all browsers passed.

Internal dependencies and public entrypoints retain their documented compatibility boundaries. No new core-major peer restriction is introduced.

Implementation and migration details: [README.md](./README.md), [ARCHITECTURE.md](./ARCHITECTURE.md).

This entry records local preparation. Candidate contents, browser/device evidence and publication still require their release checks.
