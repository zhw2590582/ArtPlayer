# PKG-TOOL-THUMB-04 public types and installed entry checkpoint

Task remains doing while THUMB-COMPAT-01's default policy is pending. Starts from
15485b6420dece2b04503bd4fa99a9da0f9c8ba0. Public declarations and installed consumption
are implemented; this does not declare package release or full refactor readiness.

## Public contracts and distribution

The missing d.ts entry is replaced with a CommonJS class/namespace declaration,
paired d.cts/d.mts wrappers and type-only names. Root require/default keeps the
direct constructor. Root import/module targets the actually generated .mjs, main
is explicit, and the new legacy subpath includes old TS resolution. No .default
self-alias is invented. Existing frozen dist files remain packed. The frozen
.esm.js target was absent; fixing root import does not restore a nonexistent file.
Historical 3.5.31 CSS disposition remains a 06 question under BASE-DIST-01.

A files allowlist includes dist, declarations, README, architecture and full MIT
notices while excluding implementation/config/dependencies. No new dependency,
lockfile, runtime target, version or package-manager change is introduced.
Known tuples, ctx, coordinates, partial options, lazy fields, returns and old
method spellings are declared. Custom event callbacks infer application tuples
without any. Error payloads are unknown because arbitrary throws produce numeric,
object or absent message values; a new runtime test verifies delivery and identical
Promise rejection, including primitive/null throws. Source changes since the prior
checkpoint are erased types; all final built bundles are compared byte-for-byte.

## Editor generator issue found and fixed

Full build:ts exposed an existing regression: MediaBunny's auxiliary media.d.ts was
globbed into an invalid standalone media global, while the proxy declaration kept
an unresolved ./media re-export. Generation now selects package-named entries.
Explicit local type re-exports require supplied complete matching type sources;
missing/renamed/partial definitions fail rather than disappearing. Callable
variables and CommonJS classes preserve namespaces. MediaBunny's source declarations
are unchanged; its editor output now includes opt-in media types. Thumbnail's exact
uppercase global is generated and added to the real docs library list.

Tests reproduce the old missing-relative-type diagnostic, compile the new types
with current/old TS and reject incomplete inputs. The real Monaco worker consumes
core/Thumbnail/MediaBunny declarations, rejects invalid selector input, emits and
runs the Thumbnail constructor, custom event and repeated native DOM cleanup.
This is not a file extraction test.

## Evidence and continuation

The installed runner creates a fixture from frozen Git inputs and a candidate Yarn
tarball. The former is explicitly not an original npm archive. Frozen require
works, import reports ERR_MODULE_NOT_FOUND and strict compilers report missing
entry/declarations. Candidate installation is outside the workspace, offline with
an unchanged frozen lock and verification of every installed byte. Current/old TS,
no-interop CJS, root/legacy runtime and complete notices are covered. Final evidence
distinguishes exploratory and final packs after package documentation changes.

The pending user question describes the incompatible defaults: published recovered
3.5.31 delay/fixed height versus unpublished workspace 4.4.0 synchronous video and
aspect-derived height. No answer is inferred from elapsed time and these defaults
remain unchanged. Continue the chosen policy/regressions before closing 04.
Inherited emitter event-name handling still needs behavior review; 05/06 retain
full demo/core combinations and supported Safari/WebKit file extraction.

Revert this checkpoint to undo declaration/entry/generator changes, then run normal
builds. Preserve prior 03 lifecycle fixes and upstream attribution. No push, tag,
npm publication or hosted CI result is claimed.
