# Public type maintenance

`artplayer-plugin-danmuku-mask.d.ts` is the authored public declaration for both
the root and `/legacy` entrypoints. Both actual npm 1.0.0 and 1.1.0 shipped this
same factory shape. Keep its optional argument, synchronous registration,
literal result name, `start(): Promise<void>` and `stop(): void`; ordinary
replacement functions and `Parameters`/`ReturnType` extraction are supported.

The declaration already describes these runtime return values correctly. This
migration does not add a second `/runtime` entrypoint or expose SDK model types.
Internal run, canvas and SDK types live under `src/`; they are not the consumer
contract and are excluded from the package archive.

The manifest's exact `typesVersions` mapping makes `/legacy` resolve with older
Node module resolution, including the supported TypeScript 4.3.5 compiler. The
published packages lacked this mapping; their root declaration remains unchanged.
Modern resolution uses the existing `exports` declaration targets.

The package retains its historical NodeNext ESM declaration namespace behavior.
Do not infer a runtime `factory.default` property from that type-only namespace:
the latest CommonJS runtime exports a function without that property. The npm
1.0.0 CommonJS wrapper had a default export object, while 1.1.0 already exports
the callable directly. These are recorded historical differences.

Numeric option types do not redefine runtime defaults. Zero-valued options still
follow the original OR defaults; the installed SDK uses `modelType: general`
and ignores several additional forwarded options. See `../ARCHITECTURE.md` before
changing their effects or claiming a specific inference backend.

Run `node --test refactor/scripts/danmuku-mask-types.test.mjs` for strict factory,
argument/result and negative consumer cases. After a normal package build,
`yarn test:danmuku-mask-types-package` checks actual tarballs installed outside the
workspace, old/current compilers, NodeNext/Bundler resolution and the historical
namespace diagnostics. Those checks do not run a model or prove GPU cleanup.

`yarn build:ts artplayer-plugin-danmuku-mask` generates the standalone online
editor declaration with the semantic generator. This avoids the former mixture
of default and export-assignment syntax. The private Option/Result interfaces
remain private; extract them through `Parameters` and `ReturnType` when needed.
