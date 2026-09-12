# artplayer-tool-iframe

Iframe tool for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-tool-iframe/index.js&example=iframe)

## TypeScript

Default imports keep the historical class signatures, including `resove`,
required message `data`, and the original `commit` result inference. Named types
include `Option`, `Message`, `ProtocolMessage` and optional runtime views:

```ts
import type { ResolverInstance, RuntimeConstructor } from 'artplayer-tool-iframe'
import Iframe from 'artplayer-tool-iframe'

const Runtime = Iframe as RuntimeConstructor
const tool = new Runtime({ iframe: document.querySelector('iframe')!, url: '/iframe.html' })
const resolver = tool as ResolverInstance
const value = await resolver.commit<number>((resolve) => {
  resolve(42)
})
```

`commit` serializes the function body. Keep its braces, use the literal `resolve`
name for asynchronous replies, and do not depend on closures or an async function
body. Handle rejection when the child document changes or the tool is destroyed.
The runtime views are types only; they do not validate messages or sandbox code.

The browser global is `ArtplayerToolIframe`. Modern TypeScript CommonJS consumers
can use `import Iframe = require('artplayer-tool-iframe')`; older Node resolution
uses the default import with `esModuleInterop`. The class has no `.default`
property. The historical `artplayer-plugin-iframe` package and its separate helper
have different export/protocol details; they are not aliases for this tool.

## Maintenance

See [ARCHITECTURE.md](ARCHITECTURE.md) for the TypeScript module map, request
cleanup, compatibility constraints, executable checks and remaining migration work.

## License

MIT © Harvey Zhao
