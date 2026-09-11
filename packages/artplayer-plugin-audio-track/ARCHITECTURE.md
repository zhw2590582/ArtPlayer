# Audio Track maintenance

The default factory in src/index.js keeps the public `(option) => (art) => result`
contract. The result exposes the same HTMLAudioElement for its entire lifetime, a
literal name, and synchronous update. Public declarations remain authored in types/
until the separate type migration; do not infer new public methods from internal helpers.

## Responsibilities

- src/index.js owns ArtPlayer subscriptions, reads host media/volume/rate, adapts public
  update, and rolls back partial installation. It uses only on/off and existing media
  properties, so it does not require new core lifecycle utilities.
- src/track.js creates the Audio element and owns URL/offset/threshold and closed state.
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

Edit track.js for URL/sync/media ownership and index.js for host event handling. Keep
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
physical-device gaps and the separate 04/05/06 type/combination/distribution gates.
