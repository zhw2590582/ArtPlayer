# PKG-TOOL-THUMB-04 runtime TypeScript checkpoint

Status: doing. This checkpoint migrates executable source and records emitter
attribution. It does not complete public declarations, installed entrypoints or
the task's compatibility policy gate.

## Source and compatibility

Starts at efd9f42fb984302dd061d5cd9f96bd4de74fcccf. Eight runtime JS modules become
strict TS, with a ninth type-only module for configuration, events, frame points,
job controls and lifecycle state. The input and source WeakMaps remain private;
helpers import the facade only as an erased type. Existing runtime validation is
retained. There are no ts-ignore, ts-nocheck or broad any escape hatches. Local
assertions and initialization invariants are explained in the package architecture
map. Unused sleep and serial-promise helpers are removed; neither was reachable
from the public bundle or used by the owned extraction job.

declare fields preserve the old own-property order and lazy optional fields.
Normal class exports, historical creat* spellings, synchronous validation,
Promise<void> completion, cancellation and the workspace 4.4.0 defaults remain.
Source options accept Element wrappers and unknown extension fields. Known event
tuples are checked and unknown string/number/symbol events remain possible.
The source types are internal until the package's declaration entry is supplied.

## Emitter origin

Pinned upstream comparison: tiny-emitter 2.1.0 index.js, package.json and LICENSE,
fetched from its fixed Git tag and recorded with SHA-256. Its four methods and
listener registry structure correspond to the local class; the recovered 3.5.31
manifest also declared tiny-emitter ^2.1.0. This establishes the appropriate
attribution, not an exact original copied revision or a recovered complete npm
archive. Changes from that comparison reference are the existing class/ES module
conversion, rest arguments, local names and loop/style forms, plus this migration's
erased generic types and equivalent typed local aliases.

The complete upstream MIT notice is retained in package THIRD_PARTY_NOTICES and
the existing normal build banner includes it in all three standalone artifacts.
No new runtime dependency is introduced. VENDOR-09 records final packed-content
verification still outstanding; THUMB-PROVENANCE-01 retains the historical archive
limit. Source attribution must not be replaced with the repository author's name.

## Validation

The validation JSON for this checkpoint records final commands, file hashes and
browser outcomes. Six new runtime tests check public descriptors/defaults/unknown
options/validation and compare upstream, recovered 3.5.31, frozen workspace main
and legacy, and the selected candidate for emitter snapshot/removal/ctx/symbol/
exception behavior. Two provenance tests verify fixed upstream bytes and full
notice retention in package and dist/docs copies. Existing lifecycle/input tests
remain unchanged. Source type consumers include six negative uses.

Browser runs retain native media controls. Windows WebKit Blob decoding remains
an unavailable-capability control, not successful thumbnail extraction. No new
coverage percentage, physical Safari, remote GitHub CI or npm result is claimed.

## Continue / rollback

Continue 04 with the missing public declaration, legacy compiler and isolated
installed CommonJS/ESM consumers. Resolve or explicitly request a decision for
THUMB-COMPAT-01 (recovered 3.5.31 delay/fixed height versus workspace 4.4.0 defaults)
before claiming compatibility closure. Review custom emitter typing and dispatch
boundaries alongside those consumers. BASE-DIST-01 still covers the missing
promised .esm.js and types entries; task 06 owns final distribution acceptance.
05/06 retain supported WebKit/Safari file extraction and core integration/demo
verification. No manifest entry, version, lockfile or package manager changes in
this checkpoint. No push, tag or publication.

To roll back, revert this checkpoint commit and rebuild the tool using the normal
Yarn package build. Preserve upstream provenance/notice records for any retained
copy of the emitter. Do not revert the separate 03 resource fixes accidentally.
