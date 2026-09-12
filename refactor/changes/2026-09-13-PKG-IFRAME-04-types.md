# PKG-IFRAME-04 public types and installed consumers

Started from 1342de94ef2e9dc3e06ddac12fcf1fc5229b648d with a clean worktree.
The previous task completed six strict source modules and native document
ownership. This task owns public declarations and their consumer/editor paths.

## Verified starting points

- Frozen npm plugin-iframe@1.0.0 has export= / global ArtplayerPluginIframe but
  actually returns a CommonJS default namespace. Its extra helper is a distinct
  protocol and has no dedicated declaration. No tool@1.1.0 npm archive is invented.
- Frozen/current workspace default class has required Message.data, readonly
  instance fields, void static onMessage and Promise<ReturnType<T>> commit.
  Runtime static onMessage is async, data may be omitted and callback can be null.
  Preserve legacy extraction/replacement types; expose precise opt-in views.
- Current main/legacy return the class directly, with no self-default property.
  Do not borrow factory.default declarations from other packages.
- The generated editor declaration uses lowercase artplayerToolIframe although
  runtime/class is ArtplayerToolIframe, and combines default export with export=.
  Reproduce and repair generation, not the generated file by hand.

## Planned acceptance

Named option/message/protocol/callback types, unchanged default class signatures,
precise optional runtime views, correct CJS/ESM declaration routing, strict
current/old compiler consumers and standalone editor generation. Isolated Yarn
pack/install must distinguish the real old npm archive, frozen workspace and
candidate, preserve exact historical errors and verify no workspace type leakage.
Legacy package-name/helper distribution remains independently tracked by 06;
full player/demo/device integration remains 05. Do not claim either passed here.

## Implementation and decisions

The default .d.ts keeps all old field/method types and adds named option, envelope,
notification and callback types. The CJS .d.cts exports the actual class with an
instance alias and type namespace; .d.mts handles native ESM. The legacy route and
typesVersions preserve old compiler resolution. No runtime default property or
JavaScript method is added. Source files and all three runtime artifacts remain
byte-identical to task 03; package/editor declaration routes are tested separately.

RuntimeConstructor/RuntimeInstance opt into async static receipt, optional outgoing
data and a nullable typed callback. Generic response T is an application assertion,
not payload validation. ResolverInstance gives an explicit result for the existing
literal resolve(...) function-body protocol. The default nested-Promise/void commit
inference remains unchanged; no async-function-body or closure execution is added.

Independent review proved error payloads may be numbers or undefined when executed
code throws non-Error values, in four historical main/legacy builds and candidate
source. The new ProtocolMessage error data therefore uses unknown with narrowing;
the first green CI predated this correction and is retained as intermediate only.

The frozen editor yields 2309/2686/2303; semantic class generation removes the
default/export= conflict and uses ArtplayerToolIframe with named-type aliases.
build:ts accepts selected package names to regenerate the current package without
rewriting unrelated packages mid-migration. Its old all-package mode remains;
the initial all-package run exposed split MediaBunny media declaration treatment,
now explicitly assigned to MB-10. No hand-editing of generated declarations.

Isolated Yarn installs cover the real npm archive, a pack made exclusively from
frozen Git inputs, and candidate pack. Every installed file matches its archive;
frozen reinstall preserves the lock and compiler files cannot resolve outside the
consumer except standard libraries. Old workspace NodeNext ESM has 18 exact
diagnostics; candidate accepts the unchanged fixture. Published Function callback
fields and its CJS namespace are existing differences from workspace callable
fields/direct class, not silently rewritten. Old package/helper facade and emitted
consumer compatibility stay under IFRAME-06, with IFRAME-DIST-01 still open.

The default non-null callback also differs from source's nullable field. Tests pin
exact diagnostic 2419 for the old view and prove the source satisfies the opt-in
RuntimeConstructor. This documents a preserved type boundary, not skipLibCheck.

No new dependencies, version changes, push or publish. Final checks and hashes
are in baselines/iframe-types-validation.json. Roll back this task's declarations,
manifest and generator changes together, then regenerate the iframe editor types.
Completion subject: `refactor(iframe): [PKG-IFRAME-04] preserve types across module consumers`.

## Final verification

Full CI passes 1543 (1365 unit + 14 engineering + 164 baseline), 44 repeated
contracts and 330 production TS files. The four new baseline tests include
positive/negative views, exact historical differences, error-payload runtime
evidence and both-compiler standalone editor checks. Installed consumers verify
16 compiler cases across three archives, including six candidate cases with
81 rejected invalid uses; old workspace ESM errors stay explicit negative controls.
Three import/SSR files pass. Source/declaration/editor hashes, final tarball bytes,
all runtime source modules and byte-identical runtime/docs outputs are verified.
Package-name/helper and full integration gates remain open under 05/06. This is
a declaration/consumer completion, not an npm release or final browser/demo review.
