# Public type compatibility boundaries

The declarations preserve legal historical TypeScript consumers as well as runtime
calls. Some old return and callback declarations were inaccurate. Changing a
return from Promise to a union, or an inferred callback parameter from cue to cue
array, can break old source even when runtime behavior is unchanged. Do not hide
that conflict with `any`, an impossible intersection, or a runtime Promise wrapper.

## Additive declarations

- Option retains its required string URL and existing component read types.
  OptionInput accepts omitted URL and numeric component HTML. Constructor overloads
  accept both; Component.add/update also accept ComponentInput. Use OptionInput for
  new configurations that require these forms. Instance/static option read types
  retain their old surface; internal ResolvedOption models the expanded input.
- Artplayer.Emitter now returns the named Emitter interface. It supports optional
  typed event maps, correlated payloads, explicit callback context, symbols and
  chaining. Constructor arguments remain accepted and ignored at runtime.
- SubtitleUpdateEvents describes the real before/after update cue arrays. Extra
  on/once/off/emit overloads accept explicit array callbacks. Historical Events
  and the first overload retain old contextual inference for compatibility:

```ts
art.on('subtitleBeforeUpdate', (cues: VTTCue[]) => {
  cues.forEach(cue => console.log(cue.text))
})
```

- Utils includes existing unescape and ArtPlayerError exports and optional sleep
  delay. A PropertyKey/identity def overload supports symbol keys while the old
  string-key signature remains first. These are type additions, not new runtime
  functions or exports.

## Retained conflicts and owners

CORE-10 adds an accurate method view without wrapping or replacing the player:

```ts
import type { PlaybackControls } from 'artplayer'

const playback: PlaybackControls = art
const pending = playback.toggle()
if (pending)
  pending.catch(error => console.error(error))
```

The original `art.toggle(): void` declaration remains accepted by historical
consumers. The optional view exposes `Promise<void> | void`; play rejection and
the original object identity remain unchanged. CORE-21 also provides a complete
optional precise entry for these differences, described below.

| Surface                                    | Actual runtime                                                                | Retained historical declaration                         | Owning task / finding    |
| ------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------ |
| plugins.add                                | Registry for a synchronous factory; Promise of registry for a Promise factory | Always Promise                                          | CORE-08/21, BASE-TYPE-04 |
| toggle                                     | Pause result or original play Promise, including rejection                    | void                                                    | CORE-10/21, BASE-TYPE-04 |
| debounce/throttle                          | Wrapper returns undefined; debounce ignores its old context argument          | Callback return type                                    | CORE-21, BASE-TYPE-05    |
| def with string key                        | Native defineProperty returns the target                                      | void, arbitrary descriptor input accepted               | CORE-21, BASE-TYPE-05    |
| setting.find                               | Item or null                                                                  | Item or undefined                                       | CORE-14/21, BASE-TYPE-07 |
| setting.add/update/remove                  | Item/item/undefined                                                           | Setting registry                                        | CORE-14/21, BASE-TYPE-07 |
| subtitle update events                     | VTTCue array                                                                  | Scalar contextual inference unless explicitly annotated | CORE-15/21, BASE-TYPE-07 |
| notice.show getter                         | Boolean visibility                                                            | Historical message/false union                          | CORE-18/21, BASE-TYPE-07 |
| seek/forward/backward/switch/quality reads | Undefined: these descriptors only have setters                                | Numeric/string/quality-array getters                    | CORE-21, BASE-TYPE-08    |

These historical declarations remain intentionally compatible. The runtime entry
below provides their accurate counterparts; it does not change the implementation
to make historical inaccuracies true. Migrated modules use accurate internal types.
For existing application code, awaiting plugins.add or toggle works for synchronous
and Promise results; ignore timer results, guard setting.find with a truthiness
check, and explicitly annotate cue-array listeners. Do not rely on the inaccurate
return types to call Promise methods on synchronous results or chain settings.

CORE-10 records BASE-TYPE-08 from real published/candidate descriptors. Reading
these command properties returns undefined; use currentTime, option and media
state for observations. Source interfaces model undefined reads independently
of setter inputs. Historical public getter declarations are not removed here.

## Precise entry and compiler boundary

Use `artplayer/runtime` for precise types on the existing modern JS constructor,
or `artplayer/runtime/legacy` for the existing legacy JS constructor. Both share
the `artplayer/runtime/types` augmentation entry and the same public TypeScript
source graph. Existing root/legacy/types/i18n imports retain their old acceptance
and TypeScript 4.3.5 support. The precise entry is tested with 5.1.6 and 5.9.3;
unrelated getter/setter types require the TypeScript 5.1 language feature.

```ts
import Artplayer from 'artplayer/runtime'

const art = new Artplayer({ container: '#player' })
const registered = art.plugins.add(() => ({ name: 'example' })) // same registry
art.seek = 12
const seekRead: undefined = art.seek
const visible: boolean = art.notice.show
const item = art.setting.find('quality') // item or null
```

Precise timer wrappers return void, def requires object target/descriptor and
returns the target, settings return their actual item/null/void values, and
subtitle update callbacks infer cue arrays. Media/proxy method return types are
kept distinct. Command reads are undefined; native PiP reads Element|null while
fallbacks read boolean. Template nodes may be null, icons are HTMLElement wrappers,
template.html is absent, and only the constructor exposes html. env/build are
not fabricated. Containers must be div elements and new controls need a supported
position. The old fields and wrong signatures remain available only in the legacy
type view; precise instances are not asserted assignable to that inaccurate view.

Constructor input overloads accept old typed plugins without wrapping factories.
Named plugin result/custom event augmentation flows from the old shared types to
the new view; new augmentation should target artplayer/runtime/types. Constructor
plugin callbacks see plugins as optional until its registry is assigned. Other
early construction hosts similarly expose only initialized components; customType,
setting mounted and ready callbacks run after construction. The actual input
factory, callback receiver and player identities are unchanged.

The docs global keeps the legacy view for its bundled Monaco compiler. build:ts
follows the public type graph and generates a standalone UMD declaration; modern
runtime declarations are not merged into it. This is independent of the npm
declaration generator and does not add runtime code.

## Evidence and maintenance

declaration-legacy.ts is a compile-only regression fixture, not recommended runtime
usage. It retains the historical assignments that make direct return tightening
incompatible. declaration-inputs.ts covers the additions with old and current TS,
Node10/NodeNext/Bundler, and actual installed packages. emitter-source.ts also checks
the public Emitter shape against the real implementation.

Browser declarations.spec.js compares published/candidate plugin registration,
rejection identity, actual toggle playback, settings return identity, notice state,
static Emitter context and native subtitle cue events. The generated VTT is test
content; explicit Blob URL teardown there does not certify subtitle resource cleanup
(CORE-15). options.spec.js verifies numeric content and omitted URL in the real DOM.

Run yarn typecheck, yarn ci:check, yarn build:ts and yarn test:package:release, then
the installed-artifact browser suite. Keep the exact historical TS 4.3.5 notice
getter/setter error isolated to the frozen 5.4.0 package. Current declarations must
remain free of diagnostics in every supported compiler mode.
