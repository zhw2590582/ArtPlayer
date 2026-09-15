# SITE-04 checkpoint: shared component contracts

Six bilingual layers/controls/contextmenu guides now cover shared creation,
configuration mutation, identity, insertion order, callbacks, updates and cleanup.
The layer guide owns the common contract; the other guides link to it and explain
their distinct return values, routing, selectors and desktop/mobile behavior.
Existing runnable snippets are unchanged. Configuration tables now include
beforeUnmount, numeric content/tooltips and the required top/left/right positions.

The guides explain that update shallow-merges the original options before replacing
the node, uses the merged beforeUnmount callback, and is not an atomic rollback.
Controls retain undefined returns. Player destruction does not invoke every entry's
beforeUnmount. The selector section covers initial labels, bound readonly metadata,
HTML coercion, selection flags, latest-result ownership, removal and object reuse.
Internal cache-entry types are not incorrectly advertised as runtime named exports.
No production code, public declarations, dependencies or project scripts changed.

The [core mapping](../core-content-review.json) adds 73 explicit declaration records
from root/runtime component shapes and the three Artplayer manager properties.
Total: 245 reviewed, 718 remaining out of 963. Counts include aliases and separate
declaration shapes; they are not independent feature or overall completion counts.
All seven previous groups' source and guide hashes were checked unchanged.

## Verification

- Six exact TS examples pass strict NodeNext with skipLibCheck:false and types:[].
  All 24 previous Run Code snippets are unchanged and parse. Local links and
  heading fragments resolve, including the shared component contract anchors.
- Chromium 153.0.8010.12, Firefox 155.0 and Windows WebKit 26.6 pass 18 generated
  page cases and all 72 code-forwarding checks. Popup targets are isolated; this
  does not execute the online editor. Two Chromium screenshots were inspected.
- Each engine passes 38 actual DOM assertions against core bytes matched to the
  registered candidate. These cover manager aliases/cache/callbacks; duplicate,
  missing, disabled and factory cases; ordering and numeric-zero fallbacks; shallow
  replacement, listener release and throwing hooks; three control positions;
  async selector races and removed results; item reuse/sharing; menu returns and
  visibility; and destruction without per-entry hooks. No retries or page errors.
- Existing component-resource/accessibility/documentation tests: 35 pass,
  zero fail/skip, 1253.4366ms. This is not playback, SDK or physical-device proof.
- Final build: 9.18s VitePress / 10.77s Yarn. LLM generation/check, inventory and
  demo-route validation pass. Node 24.21.0, Yarn 1.22.22, TypeScript 5.9.3.
- A failed edited-guide build is retained: bare generic type text was parsed as
  HTML. Inline code formatting and accurate export wording fixed it. An earlier
  ignored edit-helper fence syntax error happened before changing any guide.
- All 21 library build envelopes remain valid; release blockers remain open.

See [evidence](../baselines/site04-components.json). SITE-04 stays doing and totals
remain 224/22/39. Continue remaining core groups, then the planned implementation
checks. Formal review rounds remain user-directed. No push, deployment or publish.
Revert this checkpoint to restore guides, generated pages, evidence and mapping.
