# Public thumbnail types

The declaration describes the existing tool class, not an ArtPlayer plugin factory.
The previous workspace manifest pointed to a missing declaration. There is no
recovered legacy declaration to claim as an exact TypeScript baseline.

| Entry | Declaration | Runtime |
| --- | --- | --- |
| Root ESM import | artplayer-tool-thumbnail.d.mts | Default constructor in dist/artplayer-tool-thumbnail.mjs |
| Root require | artplayer-tool-thumbnail.d.cts | Direct constructor in dist/artplayer-tool-thumbnail.js |
| Older Node resolution / TS 4.3 | artplayer-tool-thumbnail.d.ts | main points to the direct CommonJS constructor |
| artplayer-tool-thumbnail/legacy | d.cts or typesVersions fallback | Direct legacy constructor; native ESM gets its default |
| Browser script / editor | Generated docs/assets/ts declaration | ArtplayerToolThumbnail global |

The d.ts file is the public source of truth. d.cts forwards its export assignment;
d.mts exposes the default constructor and type-only named exports. No runtime
named exports or .default self-alias exist. Keep the wrappers sharing one class.

```ts
import Thumbnail, { Option } from 'artplayer-tool-thumbnail'

const input = document.createElement('input')
input.type = 'file'
const options: Option = { fileInput: input, number: 10 }
const tool = new Thumbnail(options)
tool.on('update', (url, progress) => console.log(url, progress))
tool.on('custom', (value: number) => console.log(value))
tool.emit('custom', 1)
```

CommonJS TS can use `import Thumbnail = require('artplayer-tool-thumbnail')` without
esModuleInterop. The optional constructor argument mirrors the JS signature, but
successful initialization requires fileInput to be an actual file input or Element
wrapper. Missing input throws synchronously. setup accepts partial options and
retains unknown fields. Numeric range/clamp validation remains a runtime condition.

Known event tuples are precise. Custom string/number/symbol events infer annotated
callback arguments; those protocols remain the caller's responsibility. ctx is
inferred from the optional third argument. Dispatch through emit to retain event
argument checks rather than directly invoking the heterogeneous e registry.
file/videoUrl/thumbnailUrl/density may be absent before their operation.
start returns Promise<void>; ready-metadata preflight may throw synchronously,
and source replacement/destroy reject with AbortError. Error events usually contain
strings, but callback throws can supply any message value, so narrow unknown first.

Source/declaration constructors are mutually checked in test/types/thumbnail-source.ts.
Current and TS 4.3.5 consumers include ten invalid uses. Installed checks pack/install
outside the workspace, offline with an unchanged frozen lock, verify every file
and exercise native Node require/import without a DOM.

```sh
yarn test:thumbnail
yarn test:thumbnail-types-package
yarn build:ts
yarn test:browser test/browser/thumbnail-editor-types.spec.js
```

build:ts selects package declaration entries rather than auxiliary types and emits
the uppercase global. Actual file extraction, old-core composition and the full
demo remain separate checks. The 3.5.31 versus 4.4.0 default policy remains pending.
