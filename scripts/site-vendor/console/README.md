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
