// eslint-disable-next-line ts/no-require-imports -- Test the actual CommonJS constructor without interop helpers.
import Thumbnail = require('artplayer-tool-thumbnail')
// eslint-disable-next-line ts/no-require-imports -- The legacy subpath also directly exports its constructor.
import Legacy = require('artplayer-tool-thumbnail/legacy')

const option: Thumbnail.Option = { fileInput: document.createElement('input') }
const tool: Thumbnail = new Thumbnail(option)
const legacy: Thumbnail = new Legacy(option)
const pending: Promise<void> = tool.start()
tool.on('update', (url, progress) => url + progress.toFixed())
void [legacy, pending]
// @ts-expect-error No self-default constructor is exported.
const WrongAlias = Thumbnail.default
void WrongAlias
