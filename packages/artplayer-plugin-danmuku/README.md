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

Explicit `time: 0` is preserved. A replacement callback passed to `config()`
takes effect, and invalid configuration leaves the current option intact.
Existing method return identities, getters, input normalization and XML fields
remain compatible. Configuration changes do not automatically reload data.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module ownership, compatibility
constraints, tests and the remaining staged TypeScript migration.

## License

MIT © Harvey Zhao
