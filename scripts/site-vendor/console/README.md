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
A non-executable attribution comment is appended for the matched Stack Overflow
snippet. The build test compares every other byte outside the two owned bodies.
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
generation and structural parsing. All vendor module bodies now have exact
reconstruction evidence; full embedded attribution and notices remain
SITE-07 / VENDOR-08. See
`refactor/console-modernization.md` for contracts and evidence.

## Historical source reconstruction

`refactor/baselines/console-feed-provenance.json` maps all 32 modules reachable
through relative imports from m6b6 to the official console-feed 3.2.2 archive.
Their rebuilt bodies exactly match the frozen bundle. The separate
`console-commonjs-provenance.json` adds 41 exact modules from 13 official archives:
React/ReactDOM, scheduler, object-assign, react-is, prop-types, shallowequal,
process, hoist-non-react-statics, is-dom/is-object/is-window and linkifyjs.
`console-esm-provenance.json` adds the final 27 modules from 18 archives and the
Parcel 1.12.5 prelude/invocation. All 100 vendor bodies match; this does not
establish unique original installed versions or recover the missing lockfile.

```sh
node scripts/site-vendor/console/reproduce.ts --fetch
node scripts/site-vendor/console/reproduce.ts
yarn test:site-console
```

The first command downloads 35 pinned npm archives into the dedicated ignored
`refactor/.cache/console-feed-reproduction/` directory. The second uses that cache
offline. Both verify SHA-512 SRI, archive SHA-256, source member fingerprints,
compiler bytes, original notice bytes and exact output of all 100 identified
modules. They load Terser 3.17.0 with the installed source-map 0.6.1, and the
self-contained Babel 7.16.4 archive. They do not install dependencies, change Yarn
or execute the archived runtime libraries. Canonical Node is required.
The minification recipe is recovered from Parcel 1.12.5's archive; this proves a
reproducing transform, not that the original author used precisely that Parcel
version. `provenance.ts` separately verifies complete traversal, relative source
mapping and external dependency boundaries. Missing, unreachable, duplicate or
changed evidence fails instead of silently shrinking the comparison. Multiple
package roots are explicit, relative edges must stay in the same archive, and
all module IDs are covered once. Named/scoped imports must resolve to the
identified package. Production entrypoints
use the pinned-source process.env.NODE_ENV substitution. The process shim's
single process.browser assignment is removed following Parcel's original visitor;
this is checked against exact source/output bytes, not a general JS rewrite.

`reconstruction.ts` owns the ordered Babel stages, explicit historical environment
and Parcel global injection. Most ESM inputs need only CommonJS conversion.
Styled-components needs a separate earlier typeof-symbol pass; combining the
passes also changes newly generated interop helpers and fails exact comparison.
Parcel adds globals before minification and again before final output. Preserve
that sequence, including the observed process/define declarations. Compiler
options are cloned per module because historical Terser mutates them.
`reproduce.ts` orchestrates archives, hashes and all three source groups; normal
site builds continue using the frozen verified vendor boundary.

The archived LICENSE is preserved verbatim with its Facebook attribution under
`refactor/baselines/site-vendor/console-feed-3.2.2-LICENSE.txt`. Do not rewrite it
or infer it covers every embedded/external component. Complete notices remain
open, including the bundled replicator and remaining dependencies.
The other 13 archives' LICENSE texts are also frozen under
`refactor/baselines/site-vendor/console-commonjs/`, with exact bytes preserved by
Git attributes. They are source evidence; complete site notice delivery still
requires the remaining component review. The final ESM and Parcel texts live in
`refactor/baselines/site-vendor/console-esm/`. React-inspector 5.1.1's ESM member
is an exact match after historical conversion; its CJS member was a failed
candidate. Styled-components 5.3.3 omits LICENSE in npm; the supplemental original
comes from fixed upstream commit 9b3457036cfedf1d5336f654f3171657630a9fd8.
The fetch command verifies that immutable upstream text through GitHub's Contents
API too (the raw URL had connection resets); both URLs and the blob ID are
recorded, and decoded content must match the same hash. Offline mode checks
the frozen bytes. Full embedded-component attribution remains open.

## Public notice delivery and embedded sources

The site manifest now delivers all 32 runtime package licenses, Parcel's loader
license, and two embedded headers through `yarn build:site-notices`. The hashes
are tied to the current generated console asset. `check:console` must run before
`check:site-notices`; adapter changes require an explicit manifest fingerprint
update after runtime validation. No runtime code is appended by the notice build.

`embedded-notices.ts` extracts exact license comment blocks from verified archive
members, or from a unique source in the member's source map. It verifies member,
source and excerpt hashes, without removing comment markers or changing lines.
`reproduce.ts` compares those excerpts with the preserved files. The record is
`refactor/baselines/console-embedded-notices.json`; Chromium's complete BSD header
comes from console-feed string-utils, and Sultan Tarimo's MIT header comes from
styled-components' rule-sheet source map. Both are independently attributed in
the public index and protected by the notice CLI's omission checks.

`embedded-sources.ts` verifies dependency source-map inventories and exact source
transforms. Its record is `refactor/baselines/console-embedded-sources.json`.
All 16 Babel members embedded in react-inspector match runtime 7.13.10; its single
regenerator member matches runtime 0.13.7. The consumer map and each source member
are hashed, and the checker rejects omitted or extra external map sources. These
versions identify matching source content; the original full lock is not recovered.

Linkifyjs 2.1.9 pins simple-html-tokenizer to Git commit
04799f4638ec5ed903a4e5aa6e832269fa59be6b in its published package manifest. All seven
tokenizer members exactly reproduce with the self-contained Babel 6.26.0 compiler
and es2015 loose preset. Archive, compiler, source and output bytes are checked.
The Git archive's SHA-512 is a measured fingerprint, not an npm registry SRI;
the recorded immutable URL and dependency string retain its actual provenance.
These three licenses are included in the console notice outputs. The normal
site build still executes only the owned TS build; historical reproduction now
fetches 42 archives and fixed Git sources only when explicitly run with `--fetch`.

`attribution.ts` verifies immutable Git content against SHA-256 and Git blob SHA-1,
and compares compiled forks with the archived runtime before its single terminal
inline source map. `console-derived-attribution.json` pins the console-feed
replicator TS revision and TypeScript 4.1.2 ES3/CommonJS/LF compiler options. The
fork's runtime matches exactly; it is not a verbatim npm replicator release.
Ivan Nikulin's original MIT notice is retained from the 1.0.x source family.
Historical compiler extraction permits 16 MiB because this fixed compiler member
is 9,002,076 bytes; it is not an installed workspace dependency.

Emotion's Stylis source matches its fixed tag commit and declares Stylis 3.5.4.
The original build recipe modifies Stylis and uses an unversioned online Closure
service. We preserve that recipe and the matching generated source without claiming
to rerun the earlier service. Sultan Tarimo's MIT notice covers the upstream
attribution, including the separately identified rule-sheet reference in cache.
Gary Court's original README/MIT text and Austin Appleby's public-domain header
are preserved for the two explicit MurmurHash source references. Original sources
and excerpts are hashed; attribution is never inferred from the outer Emotion MIT.

`stackoverflow.ts` verifies a fixed answer revision's author, timestamp, license,
body and code, then locates the unique module declaration for comparison.
The customStringify function matches answer 48254637 revision 5, dated 2018-09-19,
under CC BY-SA 4.0. Revision 1 used Map and the current revision changes duplicate
handling; neither is the matching source. TypeScript 4.1.2 reproduces the function
exactly before minification. `console-stackoverflow-provenance.json` retains the
minimal revision response, source and full license; the public attribution credits
Alexander Mills and Rob W. A generated bundle comment retains the license and
links even when the script is read separately from the site notice index.

There are now 45 console notice outputs for 43 components. This includes a
CC BY-SA snippet; never describe the bundle as MIT-only. Final embedded-source
and mixed-license distribution review remains open. The shallowequal 1.1.0 README
explicitly identifies react-pure-render as its code origin; review that original
notice before closing VENDOR-08. Exact Parcel module reproduction alone is insufficient.
