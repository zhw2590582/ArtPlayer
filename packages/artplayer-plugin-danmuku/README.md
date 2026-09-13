# artplayer-plugin-danmuku

Danmuku plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku)

## Loading and configuration

`plugin.load()` reloads the configured input and replaces the queue after input
succeeds. `plugin.load(input)` appends; concurrent append operations remain
independent. A newer replacement supersedes an unfinished older replacement.
Destroy cancels pending loads and prevents late queue changes. Cancelled loads
resolve to the same internal Danmuku instance as successful loads, without a
late `loaded` or `error` event.

Fetch or response-text failures emit `artplayerPluginDanmuku:error` once and
reject the corresponding public `load()` Promise. Initial automatic loading
observes its rejection and logs a warning. XML Worker startup/runtime failures
use the existing parser locally and release Worker/Blob resources.

Explicit `time: 0` is preserved. Missing time and `NaN` retain the historical
default of the current playback time plus 0.5 seconds. Positive infinity remains
unchanged; negative values, including negative infinity, are clamped to zero.
A replacement callback passed to `config()` takes effect, and invalid
configuration leaves the current option intact.
Existing method return identities, getters, input normalization and XML fields
remain compatible. Configuration changes do not automatically reload data.

## Scheduling failures and recovery

Playback uses one scheduling loop. Pausing, seeking, hiding, resetting or
destroying the player cancels unfinished visibility preparation. Updating
`beforeVisible` also releases an unfinished old callback; seeking and callback
changes preserve already displayed comments.

A rejected `beforeVisible` emits the original `artplayerPluginDanmuku:error`
once for that item in the current run, while other items continue. It is not
retried every frame. Pause/resume, reset or a replacement callback permits a
retry if the item still matches the display-time rules. A track Worker failure
reports once and halts scheduling until pause/resume or reset rebuilds it.

If an error listener synchronously stops, destroys, resets or hides the instance,
the interrupted recovery respects that action. A nested start can recover once
without the outer call resuming it again or emitting another start event.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module ownership, compatibility
constraints, tests and the remaining staged TypeScript migration.

## License

MIT © Harvey Zhao
