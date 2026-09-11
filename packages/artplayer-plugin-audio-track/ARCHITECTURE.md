# Audio Track maintenance

The default factory in src/index.ts keeps the public `(option) => (art) => result`
contract. The result exposes the same HTMLAudioElement for its entire lifetime, a
literal name, and synchronous update. Public declarations are authored in types/ and checked
against the strict source by test/types/audio-track-source.ts. Do not infer public methods
from internal helpers. Both source files are strict TS without ambient Node types or any escapes.

## Responsibilities

- src/index.ts owns ArtPlayer subscriptions, reads host media/volume/rate, adapts public
  update, and rolls back partial installation. It uses only on/off and existing media
  properties, so it does not require new core lifecycle utilities.
- src/track.ts creates the Audio element and owns URL/offset/threshold and closed state.
  It handles synchronization, play rejection and source updates. It does not import ArtPlayer,
  inspect DOM registries or install listeners. Dependencies flow from the entry to the track.

There are no custom timers, UI nodes, styles, workers or playback SDKs. Browser media
loading belongs to the exposed Audio element. Changing its URL preserves element identity.
The plugin does not mute the main video; consumers still choose their own mixing behavior.

## Events and lifetime

Public play synchronizes before audio playback. Native pause/ended/waiting/emptied/seeking
pause audio; seeked synchronizes and resumes only if the video is playing. Native playing
synchronizes again before resume. Ordinary playing timeupdate retains the strict drift
threshold and offset rule. Rate and volume/mute follow the existing core properties.

The entry owns 15 subscriptions. Resume checks respect an explicit proxy video.playing
boolean first. For native media they also accept an unpaused, non-ended video with
readyState > 2 at currentTime zero: the historical art.playing getter requires time > 0,
which can otherwise leave audio paused after the seek associated with a source switch.
If seeked arrives before readiness, canplay synchronizes and resumes only paused audio
whose host is playing. A paused host or proxy playing=false must never trigger recovery.

Destroy marks the entry inactive before removing listeners. The track then closes before
pausing, removing the src attribute and loading the empty element. Cleanup attempts all
steps even when a consumer-overridden method throws, then propagates the first cleanup error.
Installation failures preserve the original error after attempting rollback. Saved callbacks
and update are inert after close, including when a host off method fails. Rejections from
an already closed track are consumed; active play failures still warn with the original error.
No promise is added to the public update return value.

URL truthiness/same-URL handling, defaults, deferred offset/sync update and exposed audio are
preserved. Negative offset start and duration boundaries are not redesigned in this lifecycle
change; their remaining media validation is tracked in refactor/audio-validation.md.

## Change and verify

Edit track.ts for URL/sync/media ownership and index.ts for host event handling. Keep
published-only defect observations in the tests when adding candidate regressions.

```sh
node --test test/audio-track.test.js
yarn build artplayer-plugin-audio-track
yarn test:browser test/browser/audio-track.spec.js --trace on
yarn ci:check
```

ARTPLAYER_TEST_AUDIO accepts platform-delimited built filenames for all three Node artifact
formats. ARTPLAYER_AUDIO_ARTIFACT selects one main/legacy browser build; otherwise tests compile
source. These are explicit local artifacts, not isolated installed npm packages.
The browser suite includes frozen old core/plugin combinations, real AAC/decoded video,
source failure recovery, and old/native pause/end plus corrected candidate cleanup.
See refactor/audio-validation.md for failed baseline probes, Windows WebKit WAV/size limits,
physical-device gaps and the remaining 05/06 combination/distribution gates.

## Public type compatibility

The default and /legacy entries preserve the original Result.update(Option) signature,
including required URL inference in Parameters and contextual mock implementations.
Simply widening that argument or adding overloads broke verified old consumers, even though
ordinary old calls still compiled. Do not reintroduce that change without these fixtures.

The additive /runtime entry points to the exact same JS/mjs files and exposes RuntimeFactory
and RuntimeResult.update(UpdateOption), where UpdateOption is Partial<Option>. It does not
add a second player/plugin implementation. Result remains the legacy result type; RuntimeResult
is the opt-in precise update contract. Both keep factory options required and update synchronous.
The .d.cts/.d.mts bridges describe actual CJS/ESM identities; typesVersions keeps old Node10
resolution for /legacy and /runtime. TS 4.3 and 5.9 consumers exercise both paths.

The editor global keeps legacy inference, with an explicit RuntimeFactory type assertion for
scripts opting into partial-update inference. The assertion selects a contract checked against
the same implementation; it does not bypass the plugin's strict source checks. build:ts uses
the shared AST generator for this package and rejects standalone declaration diagnostics in
both compilers. Do not manually edit docs/assets/ts output.

The package .npmignore excludes the implementation tsconfig along with src. Yarn pack must
retain all six declaration files and every historical dist/type path. Audio-04 verified these
files and identical JavaScript bytes to Audio-03; isolated installed consumers and the 8082
demo still belong to Audio-06. See refactor/baselines/audio-types-validation.json for evidence.
