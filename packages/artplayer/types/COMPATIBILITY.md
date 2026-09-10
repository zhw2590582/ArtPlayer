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
the original object identity remain unchanged. BASE-TYPE-04 stays open for the
remaining plugins.add conflict and CORE-21's full facade review.

| Surface                                    | Actual runtime                                                                | Retained historical declaration                         | Follow-up                |
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

These remain open declaration work, not release waivers. CORE-21 must resolve the
public/generated facade strategy against both actual returns and historical source
consumers. Migrated implementation modules must use their accurate internal types.
For existing application code, awaiting plugins.add or toggle works for synchronous
and Promise results; ignore timer results, guard setting.find with a truthiness
check, and explicitly annotate cue-array listeners. Do not rely on the inaccurate
return types to call Promise methods on synchronous results or chain settings.

CORE-10 records BASE-TYPE-08 from real published/candidate descriptors. Reading
these command properties returns undefined; use currentTime, option and media
state for observations. Source interfaces model undefined reads independently
of setter inputs. Historical public getter declarations are not removed here.

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
