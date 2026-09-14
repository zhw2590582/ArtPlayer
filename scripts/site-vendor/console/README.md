# Desktop console maintenance

`yarn build:console` generates `docs/assets/js/console.js`; `yarn check:console`
compares it without writing. Never edit that output. This is the desktop editor
console, separate from the mobile vConsole integration.

## Modules and ownership

| File                       | Responsibility                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `build.ts`                 | Verify frozen input, compile two owned modules, replace their Parcel function bodies |
| `runtime/entry.ts`         | Install React, ReactDOM and consoleLog globals; return the React render result       |
| `runtime/view.ts`          | Component state, Clear, hover, scroll scheduling and unmount                         |
| `runtime/subscriptions.ts` | One hook owner, subscriptions, queued delivery and descriptor restoration            |
| `runtime/errors.ts`        | Preserve native error message and stack without mutating the input                   |
| `runtime/style.ts`         | Original stylesheet, decoded exactly from the frozen view                            |
| `runtime/types.ts`         | Structural interfaces for injected runtimes and parser                               |

The fixed upstream is `refactor/baselines/site-vendor/console-original.js`, checked
by SHA-256. Only W5CS (view) and Focm (entry) bodies change. The other 100 modules,
their dependency maps and Parcel runtime remain byte-for-byte intact. The dead
`/index.js.map` trailer is removed; a complete upstream source map is unavailable.
The entry injects existing React/ReactDOM 17.0.2, console-feed and
styled-components 5.3.3. RxPG supplies the historical parser and V2JG the method
list. Root `@types/react` 19.1.10 is used for type checking only; no React 19 runtime
is included. These module IDs are a frozen build boundary, not a general Parcel
patching API. Changing the vendor requires a separate provenance review.

## Data and cleanup

Each native call forwards once with its receiver, then queues parsing. Wrappers
retain the old undefined return behavior. Count/timing/assert parsing runs once
per call, and active viewers receive the same parsed record; raw object references
remain available to the old inspector. Error-only logs add a missing error header
before the historical stack conversion, preserving the original Error object.

The first subscriber captures method/feed descriptors and installs the hook.
Additional viewers share it. Delivery snapshots subscribers when the call occurs;
removed viewers do not receive it and later viewers do not receive old logs.
The final subscriber cancels pending delivery and restores only wrappers and
metadata still owned by this instance. Later external wrappers remain intact.
An external wrapper retaining an old hook can forward native calls without
retaining viewer callbacks. Failed installation rolls back. A throwing listener
does not starve other viewers; its error remains observable asynchronously.
No general interception of third-party console mutations is attempted.

The component owns its 200ms scroll timer and cancels it on unmount; the callback
also verifies the live element. `consoleLog(element)` still returns the React
component, and repeat mounting into the same container reuses it. The additive
`consoleLog.unmount(element)` forwards ReactDOM's boolean result. The editor uses
it on non-persisted pagehide. Persisted pagehide retains state; controlled lifecycle
tests do not certify physical-device BFCache behavior.

```sh
yarn build:console
yarn check:console
yarn typecheck:docs-tools
yarn test:site-console
yarn build:site-assets
yarn test:browser test/browser/site-console.spec.js test/browser/site-editor.spec.js --workers=1
```

Historical browser cases intentionally reproduce frozen defects; candidate cases
prove their repairs independently. Unit tests check shared ownership, failed
installation, callback errors, object identity, exact CSS and vendor preservation.
No new dependency is required. Existing esbuild 0.27.7 and TypeScript 5.9.3 provide
generation and structural parsing. Full console dependency provenance and notices
remain SITE-07 / VENDOR-08; this build does not close them. See
`refactor/console-modernization.md` for contracts and evidence.

## Historical source reconstruction

`refactor/baselines/console-feed-provenance.json` maps all 32 modules reachable
through relative imports from m6b6 to the official console-feed 3.2.2 archive.
Their rebuilt bodies exactly match the frozen bundle. The 68 remaining vendor
modules and Parcel wrapper need further provenance; this does not establish a
unique original installed version or recover its missing lockfile.

```sh
node scripts/site-vendor/console/reproduce.ts --fetch
node scripts/site-vendor/console/reproduce.ts
yarn test:site-console
```

The first command downloads two pinned npm archives into the dedicated ignored
`refactor/.cache/console-feed-reproduction/` directory. The second uses that cache
offline. Both verify SHA-512 SRI, archive SHA-256, source member fingerprints,
compiler bytes and exact output. They load Terser 3.17.0 as a historical build
tool with the already installed source-map 0.6.1; they do not install dependencies,
change Yarn or execute the archived console-feed runtime. Canonical Node is required.
The minification recipe is recovered from Parcel 1.12.5's archive; this proves a
reproducing transform, not that the original author used precisely that Parcel
version. `provenance.ts` separately verifies complete traversal, relative source
mapping and external dependency boundaries. Missing, unreachable, duplicate or
changed evidence fails instead of silently shrinking the comparison.

The archived LICENSE is preserved verbatim with its Facebook attribution under
`refactor/baselines/site-vendor/console-feed-3.2.2-LICENSE.txt`. Do not rewrite it
or infer it covers every embedded/external component. Complete notices remain
open, including the bundled replicator and remaining dependencies.
