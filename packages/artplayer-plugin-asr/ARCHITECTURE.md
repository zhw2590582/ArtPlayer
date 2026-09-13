# ASR maintenance

The current implementation is still in `src/index.js`. TypeScript migration and
resource ownership changes are tracked in the repository refactor plan as
PKG-ASR-02 through PKG-ASR-06. Do not interpret the baseline tests as completion.

- The default factory snapshots options. Registration creates the `asr` layer
  and subscribes to player play, pause, volumechange and destroy events.
- Play creates an AudioContext and tries a media element source, then a captured
  MediaStream source. An inline Blob contains the `recorder-processor` Worklet.
- Worklet messages supply first-channel Float32 samples. The interval callback
  encodes little-endian mono PCM16 and a 44-byte-header WAV and invokes the
  caller's `onAudioChunk({ pcm, wav })`. A returned string replaces subtitles.
- `append` splits punctuation and sets HTML in `div.art-asr-line`; `hide` changes
  display only. `src/style.less` owns layout and existing player CSS variables.
- `stop()` is actually asynchronous and releases audio resources, but retains
  playback subscriptions. It is not a permanent disable API. There is no public
  `start()` method. Public declarations currently describe stop as returning void.

This package does not implement recognition or open an ASR network connection.
The demo service and its WebSocket belong to the caller. Do not run that service
to validate audio capture; use local media and a local callback.

The initial implementation has suspected chunk loss, partial initialization
cleanup and stale callback issues. Preserve the frozen historical tests while
adding candidate regression tests when fixing these. Keep callback/stop typing
compatible with historical assignments, and preserve public entrypoints, HTML
rendering behavior, layer names and stylesheet identity.

From the repository root, `yarn test:asr` verifies historical public behavior;
`yarn test:baseline` includes archive provenance. `yarn dev artplayer-plugin-asr`
and `yarn build artplayer-plugin-asr` use repository build tools. Real browser
audio and lifecycle validation remains a separate required migration step.
