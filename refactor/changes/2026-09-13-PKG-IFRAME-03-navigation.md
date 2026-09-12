# PKG-IFRAME-03 document ownership and internal structure

The public class now delegates connection cleanup, request ownership, envelope
admission, parent navigation and child lifecycle to six strict TS modules.
Requests receive an internal boundary hook; child and parent session code use
the shared envelope helpers without importing the public class or core. The
module map and ownership/maintenance commands are in the package architecture.
Earlier request and peer-boundary checkpoints remain separate evidence.

## Compatibility decision and defect changes

ADR-026 adds optional document metadata to the existing type/data/id protocol.
Normal new/old wire combinations preserve the public callback data and receiver,
constructor/field descriptors, resove spelling, generic responses and the old
function-body/resolve commit convention. New private lifecycle traffic starts
only after acknowledgement and is not forwarded through the public message API.
An unchanged peer remains on the legacy path; its limitations are explicit.

Document departure now rejects owned work with `The iframe document has changed`.
The code pauses new sends while replacing a source, captures only the old request
set, and preserves requests queued for the replacement. Old pagehide/repeated
inject cannot cancel or activate the replacement's queue. Different-document
responses/notifications and commands are filtered. Destroy still owns all remaining
requests even if consumers replaced/deleted their public callback records.

The first source matrix passed 342, but an independent fragment review found a
real regression in three Chromium cases: the document witness was unchanged while
the candidate rejected its request. A source setter is not proof of document
departure. The final design captures requests provisionally and waits for pagehide
or another document marker before cancelling; a matching native hashchange report
preserves same-document work. The failing report is retained. Raw attribute
tracking also avoids inventing navigation when only a src getter's base resolution
changes. These repairs are not made by weakening the document-identity assertions.

A later ownership review reproduced another candidate defect: repeated source
mutations recaptured and cancelled requests queued after navigation began. The
snapshot now belongs to the departing document and is captured once. Unsent work
waits for the final document to inject, including when an intermediate target is
superseded. The browser rapid-navigation expectation was corrected to this explicit
contract; a separate Node regression proves both before/after-pagehide orderings.

## Evidence and limits

The navigation tests include marked and legacy peers, synchronous post after src,
rapid changes, source/srcdoc priority, repeated injection, inject-before-load,
same-address reload, native fragment transitions, old packet replay, history and
listener/observer cleanup. A controlled load barrier proves the inject-before-load
order. Browser history records actual pageshow.persisted rather than treating all
history navigation as cached restoration. Stale-packet cases replay old metadata
from owned fixtures to isolate routing; they are not a claim of cross-site access.

Final counts, source/artifact hashes, frozen preceding-build association and
reports are in `baselines/iframe-navigation-validation.json`. Public declaration
reconciliation remains PKG-IFRAME-04; full old/new core/demo integration, actual
BFCache/device and interrupted navigation evidence remain PKG-IFRAME-05/review.
The corresponding risks remain open with that owner; no distribution or release
gate is silently closed. No dependency, version, package manager, push or publish.

Rollback: revert this task completion and rebuild artplayer-tool-iframe normally.
Earlier frozen npm/Git evidence remains intact. Dedicated commit subject:
`refactor(iframe): [PKG-IFRAME-03] scope requests to active documents`.

Final source/main/legacy each pass 50 Node assertions (16 navigation, 18 boundary,
16 request lifecycle). Native browsers pass source 351, main 351 and legacy 207;
each includes 117 navigation/legacy-child, 60 boundary/mixed and 30 lifecycle cases.
Source/main additionally preserve 144 historical defect assertions. Final matrices
have no skips, automatic retries/flakes or unhandled browser errors. The preceding
legacy run was 206 pass/1 Firefox context-close teardown timeout, after all product
assertions, destroy/frame removal and diagnostics had completed in the trace.
No root cause or fix is claimed: the unchanged case passed ten focused repetitions,
then the unchanged full legacy matrix passed. Original trace/report remain archived;
IFRAME-05/release review retain harness reproducibility if the symptom recurs.
History details remain in the evidence;
ordinary reloads are not BFCache. Full CI passes 1539 (1365 unit, 14 engineering,
160 baseline), 44 repeated contracts and 330 production TS files. Three import/SSR
files pass. Source, artifact, report and preceding Git hashes plus all three docs
copies are verified. PKG-IFRAME-03 is done; 04/05/06 and the three iframe risks
remain open. No package version or publication gate is advanced by this task.
