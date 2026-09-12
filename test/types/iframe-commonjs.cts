/* eslint-disable ts/no-require-imports -- Verify native TypeScript CommonJS constructor imports. */
import Iframe = require('artplayer-tool-iframe')
import Legacy = require('artplayer-tool-iframe/legacy')

declare const frame: HTMLIFrameElement
const option: Iframe.Option = { iframe: frame, url: '/frame' }
const tool: Iframe = new Iframe(option)
const old: Legacy = new Legacy(option)
const message: Iframe.Message<number> = { type: 'custom', data: 2 }
tool.postMessage(message)
old.commit(() => {
  return 2
})
// @ts-expect-error Direct CommonJS constructor has no default namespace.
const wrong = Iframe.default
void wrong
