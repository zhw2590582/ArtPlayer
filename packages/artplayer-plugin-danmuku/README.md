# artplayer-plugin-danmuku

Danmuku plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku)

## TypeScript entrypoints

Existing imports from `artplayer-plugin-danmuku` and `/legacy` retain the npm
5.3.0 declarations. Use `/runtime` for declarations that describe the actual
factory, asynchronous commands and returned internal owner:

```ts
import danmuku from 'artplayer-plugin-danmuku/runtime'
import type { Point, RuntimeOption } from 'artplayer-plugin-danmuku/runtime'

const option: RuntimeOption = { danmuku: [], heatmap: true }
const points: Point[] = [[0, 10], [200, 20]]
```

The option object is required; each field is optional. Registration returns the
plugin facade immediately. `await plugin.emit(row)` and `await plugin.load()`
return the internal owner, as do synchronous `config/hide/show/reset` commands.
That owner differs from the registered facade. `mount(target)` returns undefined
and requires a valid element or selector. The facade's option/state getters
remain live.

The accurate entrypoint also exposes icon types, callback receivers and an
explicit `EventMap` of payload tuples. Filters and visibility callbacks receive
the current option as `this`; `beforeEmit` does too and accepts only strict
`true`. Importing these types does not automatically alter Artplayer's historical
event declarations. Custom points use mutable `[number, number]` tuples and
retain the existing inner-array modifications during rendering.

ESM imports select the existing ESM factory; CommonJS
`require('artplayer-plugin-danmuku/runtime')` returns the existing callable
factory directly. No additional runtime implementation is loaded.

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

## Settings and heatmap cleanup

Destroy removes the plugin's external settings panel, cancels its send countdown
and prevents an unfinished `beforeEmit` from clearing input or starting another
send. Other instances and later user changes to their shared mount remain intact.
The shared stylesheet remains installed for other players. Setting initialization
failure also releases the already-created plugin Worker.

Heatmap supports narrow containers with a positive sampling step and uses an
independent gradient for each instance. Its existing points event still changes
the inner point arrays as before; copy those arrays first if the original values
must be retained. Removing or replacing its control releases its listeners.

Dense automatically sampled heatmaps now scale down instead of becoming a tall,
flat block over the video (issue #958). When the sampled peak exceeds one quarter
of the chart height, the curve fits inside that bottom quarter (25px in the
default 100px control). Small curves keep their existing appearance. Explicit
finite `heatmap.yMin` or `heatmap.yMax`, and custom points events, retain their
original coordinate mapping; use these when deliberately controlling the scale.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module ownership, compatibility
constraints and editing/verification commands. All owned runtime modules now use
TypeScript, with shared public runtime data types maintained in
`types/runtime-shared.d.ts`. Long-duration load tests, combination/distribution
acceptance and release reviews remain separate unfinished stages.

## License

MIT © Harvey Zhao
