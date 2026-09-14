# PKG-VTT-THUMB-05: browser combination checkpoint

Baseline: `4fa5c68be9d2d0d60d725c2a87b8d92a4dc8a85a`. Task05 remains doing;
this checkpoint does not claim physical-device or complete distribution acceptance.

## Inputs and actual coverage

The new 5.1.6 core snapshot verifies the registry SHA-512, archive SHA-256 and
197 archive members. The browser server verifies the actual main entry before
serving it. This is the source-associated core for usable VTT 1.0.1, not a newly
invented minimum-supported version. Existing frozen 5.1.7, 5.3.0 and 5.4.0 inputs
and the current candidate complete the five-core comparison. Npm 5.3.1 was
previously found absent; 5.3.0 is only an adjacent published stable comparison.

`vtt-thumbnail-combinations.spec.js` covers:

- Candidate plugin on all five cores: actual red/blue preview pixels from DOM
  screenshots, real pointer positioning, Chapter progress coexistence, native
  video play/pause, web and native fullscreen, source switching without refetch,
  unchanged control identity and owned UI removal on destroy.
- Actual published 1.0.2/1.0.3/1.1.0 main bundles on candidate core, and 1.0.1
  on 5.1.6: historical callable/default exports, previews, control identities,
  source switching and a single VTT fetch. The historical compact-arrow input
  requirement is explicit; ordinary-arrow parser failures remain separate tests.
- Android user-agent profiles with synthetic DOM touch payloads: the actual core
  gesture handlers emit setBar and perform native media seeking, the preview
  follows the drag and its real 500ms timer hides it. This is not trusted OS input
  or physical Android/iOS evidence.
- Existing native fetch/abort, malformed input/recovery and lifecycle tests remain.

The current source build is the plugin input. This is not an installed tarball,
every old legacy bundle, a browser-device farm or the online editor. Those gates
remain task06/EX-03 and the relevant device/release tasks. No new dependencies,
runtime code, public types or shippable build artifacts change in this checkpoint.

## Findings and failed runs

VTT 1.0.1 registers `thumbnails`. Actual core 5.1.6 creates its built-in control
only when a thumbnail URL is configured, so the plugin can register normally.
Core 5.1.7 reserves the control unconditionally. The resulting duplicate-name
rejection reproduces on 5.1.7, 5.4.0 and candidate cores in all three engines.
The nine explicit failure assertions are historical evidence, not successful
old-plugin/new-core acceptance. Preserve the current reserved control; any
compatibility accommodation must account for its public identity and duplicate
registration behavior. The pairing is recorded as an open release-review issue.

The initial 27-case run had nine passes and eighteen failures. Fifteen failures
came from test-only setBar calls without the event required by newer core hover
handlers; the tests now use real mouse movement. Three exposed the 1.0.1 collision.
Legal and incompatible combinations now have distinct explicit assertions.

The expanded 69-case run passed. Adding native fullscreen then produced fourteen
passes and one Chromium candidate screenshot timeout. Trace showed actual
fullscreen ownership followed by a hidden preview at screenshot time; cleanup
also timed out after the interrupted screenshot. Mouse positioning now first
uses Playwright's stable/actionable progress hover, then computes the desired
position, and verifies visible preview/background before screenshot. The final
69-case run passes. This changes test interaction timing, not player code, and
does not prove a product fix for every prior timeout. Initial reports are retained;
no retry, skip, timeout increase or weaker pixel expectation was introduced.

## Verification and handoff

`../baselines/vtt-thumbnail-combinations.json` records exact browser versions,
input identities, passes/failures, screenshots/report fingerprints and Node/CI/lint
results. Nine passing assertions deliberately confirm historical incompatibility.
The task remains open for physical-device evidence, final candidate revalidation
and disposition of the old reserved-name pairing; controlled HTTP fixtures do
not establish external CDN or every sprite format's behavior.

The package architecture and environment/browser guides describe actual scope.
Revert this checkpoint as one unit to remove the new route, frozen core snapshot,
combination tests and evidence without reverting the earlier VTT implementation.
Local checkpoint commit only; no push or publication.
