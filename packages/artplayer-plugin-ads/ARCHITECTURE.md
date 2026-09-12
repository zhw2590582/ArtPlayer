# Ads implementation and maintenance

Ads is a single preroll attached by `artplayerPluginAds(option)(art)`. The factory and
returned `{ name, skip, pause, play }` are synchronous. Runtime input remains html/video/url
plus timing, mute and i18n. Historical source/type fields are accepted by the compatibility
declaration but are not implemented runtime aliases.

## Module boundaries

| File | Responsibility |
| --- | --- |
| src/index.ts | Public factory, checked legacy constructor capabilities, import-time style injection |
| src/options.ts | Per-attachment defaults and the existing shallow validator schema |
| src/types.ts | Normalized options and narrow core/DOM dependencies, reusing public input/result shapes |
| src/countdown.ts | One owned timeout, whole-second counting, pause/resume and terminal cancellation; no core or DOM dependency |
| src/view.ts | Existing HTML/CSS hooks, labels, ad element, mute and fullscreen icon rendering |
| src/resources.ts | Instance-owned core/DOM subscriptions, guarded callbacks and disposal that continues after cleanup failures |
| src/session.ts | Ready/first-play lifecycle, ad readiness, playback requests, completion, destruction and cross-module ownership |

The entry calls options/session. Session composes view/countdown/resources. View receives
only a parent, icons, options, three DOM utilities and callbacks, rather than the whole player.
Style remains in src/style.less. There are no runtime imports from the ArtPlayer core package;
all imports of its declarations are erased. Old cores do not need new lifecycle helpers.

## Public declarations and imports

`types/artplayer-plugin-ads.d.ts` owns the callable namespace and public shapes. CommonJS
bridges use `.d.cts`; ESM bridges use `.d.mts`. Root and `/legacy` accept historical inputs.
The new `/runtime` entry resolves to the same JS implementation and restricts options to
implemented fields. `Option` is accurate, `LegacyOption` preserves the published string
duration declaration error, and `WorkspaceOption` represents the unpublished source/type
declaration. `CompatOption` accepts both families. No runtime duration coercion was added.
The existing validator rejects string durations before the single localized normalization
assertion in options.ts. Translation objects still replace all four fields together.

The factory has a self-referencing `.default`, supporting both callable require and the
published `require(package).default` access. This does not emulate the old noncallable
CommonJS namespace object's identity or key set. The returned plugin and its lifecycle
remain unchanged. Root and `/runtime` resolve to the same module for each module system.

The editor generator in scripts/plugin-editor-types.mjs accepts this type-only namespace
shape explicitly and rejects unknown imports/exports. Generate docs globals with
`yarn build:ts`; test their semantics and actual Monaco emit/run, not only parseability.

ADS-TYPE-01 is accepted with scope by the maintainer on 2026-09-12: `Parameters<typeof factory>[0]` accepts both old option
objects, but reading totalDuration yields `number | string | undefined`; the published
declaration yielded `string | undefined`. Workspace source/type fields also become optional.
Frozen consumers reproduce these differences. This approval covers only these historical
inference corrections, not general API changes. Preserve the diagnostic cases and migration
examples in the README; do not claim every historical TS program compiles unchanged.

## State and ordering

`waiting -> active -> ended`, with any state able to become `destroyed`. Ready arms the two
existing first-play signals; only one can initialize. Repeated ready/play/metadata cannot
create another view or timer. The normalized option belongs to this attachment even when a
caller reuses the factory. Emitted options retain their identity and remain live: for example,
changing totalDuration in an ad-click listener affects subsequent ticks.

For video, the element is created without a source. Error and loadedmetadata listeners are
installed before assigning src. Metadata starts the timer and requests ad playback. HTML
starts immediately. The ad video loops independently from the totalDuration countdown.
Public pause/play still control only the countdown; they do not pause/resume the ad video.
Native document visibility and the newer core visibility bridge both control that same timer;
idempotent resume prevents duplicate timer chains. Initially hidden documents pause counting.

Skip first closes the timer and active subscriptions. For an initialized ad it requests main
content playback, pauses the ad, hides the overlay and synchronously emits
artplayerPluginAds:skip with the normalized option. This keeps the historical successful
ordering. Reentrant destruction prevents subsequent dispatch. Repeated completion is inert.
Before initialization, play/pause are inert; skip cancels the pending preroll and emits once
without starting main playback or creating DOM. These early-call semantics repair historical
exceptions and are covered separately from normal old behavior.

Internally requested play Promises are observed. An ad play rejection warns with the original
error and completes the ad like a media load failure. Rejected main-content restoration also
warns, while completion remains visible and synchronous. Direct consumer calls to art.play
are not wrapped or changed. If an ad play settles after its owner ended/died, its own video is
paused again; stale rejections cannot restart content.

## Resource ownership

The session owns one countdown, active core/native listeners, a separate destroy subscription,
and the overlay. Finishing releases active listeners and pauses video, but keeps the hidden
overlay and source/error state available until destroy. Destroy cancels the timer, disposes
all owned subscriptions, pauses/releases the ad src via load, and removes the overlay even
when the core keeps its HTML. Only an owned template.$ads value is removed. Foreign DOM
listeners and caller-owned replacement template references are not removed.

Native DOM listeners are locally owned; the plugin does not mutate the core event registry
or depend on new resource APIs. Cleanup guards stale callbacks and handles partial view
construction/registration failure. A failure while cleaning one subscription does not stop
the remaining cleanup. Root ownership is recorded as soon as it is appended.

Keep all artplayer-plugin-ads class names and the template.$ads hook. The full screen button
uses the core fullscreen property; its icons reflect both the initial value and the core
fullscreen event. Actual device/native fullscreen acceptance remains part of PKG-ADS-05.

## Verification and remaining work

Use pinned Yarn/Node. `yarn test:ads` covers source/frozen releases and candidate lifecycle
regressions; `yarn test:browser test/browser/ads.spec.js` covers real local media and old/new
cores. `yarn typecheck` checks the strict package configuration. `yarn build artplayer-plugin-ads`
generates main/legacy/ESM through the repository build. Do not hand-edit dist or copied docs assets.

Tests distinguish actual media decoding from injected errors/controlled clocks. Baseline and
open release gates live in [Ads validation](../../refactor/ads-validation.md). Public declaration
reconciliation is recorded in PKG-ADS-04; complete historical distribution and demo validation
remain PKG-ADS-06. `yarn test:ads-types-package` packs and installs outside the workspace,
checks all installed bytes, frozen offline install, five compiler modes and Node exports.
`yarn test:browser test/browser/ads-editor-types.spec.js` verifies actual Monaco integration.
Real hidden-page/device behavior and complete media-resource
acceptance remain PKG-ADS-05. No claim of compatibility with every historical 4.x core is made.
