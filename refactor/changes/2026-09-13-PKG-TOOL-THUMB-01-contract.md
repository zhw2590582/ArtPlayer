# PKG-TOOL-THUMB-01 contract inventory

Started from cb6c7677319f22074ae2ec09989022ddf0f8ea87. Frozen published-cache and
workspace identities establish the thumbnail tool's actual public contract.
Recovered CDN main matches historical Git byte-for-byte; original npm tarballs
remain unavailable. No complete-archive verification is claimed.

The contract document distinguishes 3.5.31 delayed events/configured height from
4.4.0 synchronous events/aspect-derived height, including different input reset
and metadata waiting behavior. Default compatibility remains an explicit open
decision for implementation, not an approved runtime break. It corrects the
plan's earlier conflation of workspace missing main/types/ESM with old npm facts.

Added an offline verifier and 26 contract tests across recovered old main,
frozen workspace main/legacy and workspace ESM. Tests cover export/field shape,
historical method spellings, setup/defaults, emitter semantics, event timing,
input/drop, height, grid/footer, errors, downloads and cleanup. The helper uses
controlled DOM/media; real browser extraction is not claimed by this task.

Production source, declarations, manifests and dist/docs artifacts are untouched.
No dependencies changed. PKG-TOOL-THUMB-02 owns extraction and asynchronous failure
baselines; 03/04 own resource/module/TS implementation; 05/06 own real integration
and distribution. BASE-DIST-01 and thumbnail-specific risks remain open.

Validation results are recorded in thumbnail-contract-validation.json. Task
completion uses its own local commit; there is no push, tag or npm publication.
