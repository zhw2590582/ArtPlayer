# PKG-VAST-07: retain historical default calls

Baseline: eb6402fdca910fd39d329d0c26222c4359915150. Independent of the
unresolved eager/lazy initialization decision; task04 depends on this delivery.

## Implementation and contract

The frozen npm1.0.0 CommonJS main/legacy exports a namespace with a default
factory; the current workspace main exports a direct function without that
property. Consequently existing JavaScript `require('artplayer-plugin-vast').default(cb)`
fails before registration. The final four-format regression also fails against
the exact pre-change main and ESM files retrieved from Git.

The entry now assigns `artplayerPluginVast.default = artplayerPluginVast` before
default export, as in other ecosystem compatibility factories. Direct and default
calls reach the same function, preserve closure state and create no wrapper or
SDK load at module evaluation. TypeScript infers the self-reference without casts.
The property is writable/enumerable/configurable. Current exports remain callable;
this is supported historical call compatibility, not recreation of the old
namespace object's `typeof`, keys or identity. Existing namespace-derived reflection
and public declaration reconciliation remain under VAST-DIST-01 and task04/06.

API-04/05/06/09: original SDK/callback waits, request behavior, Promise result and
cleanup remain unchanged. Initialization defaults, IDs, callback aliases and SDK
settings are not reconciled by this change; VAST-CONTEXT-01 and task03 remain open.
Public declarations, dependency versions, lockfile and package version are unchanged.
The export suite joins existing test:vast/test:unit; no new tool is installed.

## Validation

See [evidence and fingerprints](../baselines/vast-alias-validation.json).

- Initial SDK-controlled alias plus three UMD-format tests: all four fail on the
  old source. An initial AMD harness signature error was corrected before this
  red result; final errors are missing alias assertions.
- Final bundled CommonJS/global/AMD/ESM tests: four fail on pre-change artifacts,
  four pass on actual main+ESM and four on actual legacy+ESM.
- Full VAST suite:65 pass, including historical observations and current lifecycle
  assertions. Source alias test covers deferred SDK, deferred callback, request and
  cleanup; artifact tests use a destroyed host and do not load Google IMA.
- Strict package TypeScript and targeted source/Node/browser lint pass. A test
  import ordering error was corrected. Normal package build regenerates three
  formats and docs copies.
- Three desktop engines across old5.1.7, published5.4.1 and candidate core:117
  wrapper browser assertions pass, zero retries/skips. Nine candidate registration
  cases use the alias and wait for SDK and callback; other cases keep direct calls.
  SDK is controlled, while core DOM/main-video decoding is real. Historical bug
  observations remain explicitly historical, not successful compatibility claims.
- Actual Google IMA ad loading/playback, device coverage, full declarations and
  installed distribution remain unverified. No VPN exception or remote CI claim.

## Rollback and remaining work

Revert this dedicated commit and rebuild VAST to restore the previous exports;
the alias tests then reproduce the broken old call. Continue the initialization
decision in vast-compatibility-decision.md, then complete task03/04 and real SDK
and package acceptance. This task is not overall VAST completion.
