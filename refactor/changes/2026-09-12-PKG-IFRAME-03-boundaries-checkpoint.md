# PKG-IFRAME-03 connection and peer boundary checkpoint (doing)

Connection acquisition/release and packet/peer admission now have separate TS
modules. Entry calls them without changing own fields or the bound receiver.
Listeners are captured with their owning window and released once; request
cancellation runs in finally. Failed setup marks the partial instance destroyed,
releases partial registration and cancels reentrant sent/waiting requests. If
release also fails, the original constructor error remains the public result.

The parent processes native packets only from its configured iframe WindowProxy;
the child processes them only from window.parent. Null/non-object payloads and
non-string types are ignored. Source-less/null-source local onMessage calls,
empty-string generic types and invalid commit payload error serialization remain
supported. The explicit compatibility/trust decision is ADR-025 in
[iframe-message-boundary.md](../iframe-message-boundary.md).

The first boundary assertion run against the preceding committed build exposed
an accidental cross-realm object-prototype comparison in a positive control;
copying the packet into the test realm corrected that test without changing
production behavior. The final unchanged 18 boundary assertions against b8d03e73
pass 2 and fail 16. Candidate source plus previous 16 lifecycle assertions pass 34.
The preceding build fails all 12 actual Chromium boundary cases (three scenarios
and four origin relationships). Failure reports/results/traces are retained.

Browser cases use real same/cross-origin windows, actual HTTP302 redirects and
opaque sandbox origins, with foreign handshake/response/commit and malformed
messages. Separate normal wire controls pair actual npm plugin-iframe@1.0.0 and
initial workspace tool main builds with a candidate on either side. They do not
claim to secure a receiver still running old code, or to test player/media/demo
integration. Final build/node/browser/CI results live in the checkpoint record.

The first source browser run passed 51 and failed 9 redirect cases because a
route-only redirect target was not served by the actual HTTP fixture. The first
old-build redirect failures therefore cannot establish product behavior. Both
reports are preserved. The fixture now serves its child HTML and HTTP302 from
the local server, asserting the observed status and Location. With that fix,
the old build fails all 12 boundary cases at the intended peer/payload assertions,
and candidate source passes all 60 boundary/mixed-version cases. No production
change or timeout widening was used to repair the test setup.

No protocol fields, public declarations, dependencies, versions or targetOrigin
policy change. The additional window admission and ignored malformed packets are
intentional defect corrections under API-04/05/12, documented rather than hidden.
All other generic message and commit behavior remains protected by historical
and candidate tests. Package architecture and executable script entries are
updated in the same checkpoint.

PKG-IFRAME-03 remains doing: navigation and reinjection need document-generation
handling that preserves child inject-before-load ordering. Source WindowProxy
identity alone does not identify the currently loaded document. All three Iframe
risks stay open pending their remaining lifecycle/integration/distribution gates.
Revert this checkpoint and run the normal package build to roll back. No push,
tag or publication. Commit subject:
`fix(iframe): [PKG-IFRAME-03] release failed setup and bind message peers`.

Final source/main/legacy each pass 34 Node assertions. Browser source passes 60,
main 234 (144 historical + 30 lifecycle + 60 boundary/mixed), and legacy 90
(30 lifecycle + 60 boundary/mixed), with no skips or unhandled candidate errors.
Each boundary suite contains 36 actual peer/payload cases and 24 normal historical
wire combinations, including observed server 302/Location and opaque origins.
Full CI passes 1523 (1349 unit + 14 engineering + 160 baseline), 44 repeated
contracts and 328 production TS files. Three import/SSR files pass. Final source,
artifact, old Git build, report hashes and byte-identical docs copies are checked.
Task remains doing; no risk closure or release claim. This task began 2026-09-12;
completion of this checkpoint is timestamped in the validation record.
