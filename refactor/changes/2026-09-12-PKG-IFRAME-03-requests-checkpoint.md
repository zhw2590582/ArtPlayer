# PKG-IFRAME-03 request ownership checkpoint (doing)

The old single JS file is now a strict TS public entry plus a request ownership
module. Entry methods and fields remain in place; the private WeakMap does not
add reflective instance keys. Source types are checked by a new package tsconfig,
without changing published declarations or installing dependencies. Package
ARCHITECTURE.md explains state, ownership, compatibility and follow-up work.

## Corrections and compatibility

| Boundary | Previous result | Candidate result |
| --- | --- | --- |
| Same millisecond / clock rollback | Callbacks overwrite each other or old IDs recur | Module-wide increasing numeric IDs preserve independent responses |
| Multiple instances, one frame | Each instance can settle from the same response ID | Instances from the same module allocate distinct IDs |
| Destroy sent/waiting request | Sent promise hangs; waiting poll remains until its next tick | Immediate rejection with the existing destroyed Error message, timers/registry released |
| Saved callback after destroy | Can settle or notify | Inert |
| Native send failure | Immediate rejection leaks record; delayed failure escapes callback | Same original error rejects in both paths, all owned state removed |
| Public resove/reject | Promise settles but its registry entry remains | Promise and corresponding owned registry entry released once |
| Inherited response ID | `toString` can be mistaken for a request and throws | Only own registry entries participate, generic message callback still runs |

These are deliberate fixes under API-02/03/04/05/12, not a new wire format.
Constructor validation, seven field descriptors/order, bound onMessage, callback
receiver/packet shape, numeric envelopes, `resove`, ordinary registry identity,
wildcard target origin, 200ms polling, generic non-error responses, function-body
commit serialization, child sync/resolve timing and child error channel remain.
An ID is now a correlation number rather than an exact clock reading. Callers
must handle pending request rejection on destroy; old promises hung indefinitely.
No automatic timeout, new public option, SDK or version change is introduced.

The counter is local to a library module; separately evaluated copies are not
coordinated. Source typing uses `any` only for the existing arbitrary message
payload/callback/result boundary; ownership and state are explicit. The child
error `.message` assertion intentionally retains the old error serialization,
including its existing behavior for unusual thrown values. The contentWindow
assertion does not add an availability guarantee: a null window throws inside the
send boundary and rejects the request rather than leaving it owned.

## Validation

The same 16 candidate Node assertions against the frozen workspace pass 5 and
fail 11; candidate source passes all 16. The unchanged candidate browser checks
against that old artifact pass 2 round trips and fail 8 lifecycle cases across
same/cross-origin Chromium. Full failure reports/results/traces are archived in
`refactor/.cache/iframe03-before-results`; Node log is `iframe03-before-node.log`.
This contrasts candidate acceptance with the separate historical defect assertions.

During the independent diff review, the new own-property guard was found to
throw for consumer-cleared `promises[id] = undefined`, whereas the old workspace
ignored it. `iframe03-empty-record-before.log` records that old/current contrast.
The guard now retains the old truthiness check as well; the existing regression
case covers this edge. Earlier passing CI/browser records predate this fix and
remain archived; final candidate builds and checks are rerun against the new bytes.

Final production/browser/CI results and hashes are recorded in the checkpoint
validation file after execution. No player is created by these iframe-only
fixtures; they do not establish full demo/core/media integration.

## Remaining work and rollback

PKG-IFRAME-03 remains doing. Navigation/reinjection, malformed packets, constructor
setup failure cleanup and the independent source/origin policy still need work.
IFRAME-LIFE-01, IFRAME-TRUST-01 and IFRAME-DIST-01 remain open. Trust policy has not
silently changed; current foreign-message behavior is still a known defect.
PKG-IFRAME-04 owns declaration/helper/old-name compatibility and 05/06 own complete
integration/distribution. This checkpoint is not release acceptance.

Rollback by reverting this checkpoint and rebuilding `artplayer-tool-iframe`
through the normal script. The frozen artifacts and previous evidence remain
immutable. Commit subject: `fix(iframe): [PKG-IFRAME-03] own pending requests and cancellation`.

Final source/main/legacy Node checks each pass 16. Final main browser matrix
passes 174 (144 historical defect assertions + 30 candidate acceptance), and
final legacy passes 30 candidate rows. All three engines execute real windows;
there are no skips/capability substitutes. CI passes 1505 (1331 unit + 14
engineering + 160 baseline), 44 repeated contracts and 326 production TS files;
3 import/SSR files pass after the final rebuild. All hashes match archived
reports and the final source/artifacts; docs copies are byte-identical.

One normal build attempt failed copying the legacy file into docs with Windows
copyfile UNKNOWN; the cause is not established. The failure log is retained,
and a normal build rerun succeeded before final checks. No manual artifact edit
or ignored build failure was used. Status stays doing and all three risks open.
