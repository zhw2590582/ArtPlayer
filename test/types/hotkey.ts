import type { HotkeyHost } from '../../packages/artplayer/src/input/hotkey-types'
import Hotkey from '../../packages/artplayer/src/hotkey'

declare const host: HotkeyHost & { extension: string }
const keys = new Hotkey(host)
keys.add('KeyK', function (event) {
  const extension: string = this.extension
  const code: string = event.code
  return { extension, code }
}).remove('KeyK', () => {})
const same: typeof host = keys.art
// @ts-expect-error Keyboard callbacks receive a keyboard event.
keys.add('KeyK', (event: MouseEvent) => event.clientX)
// @ts-expect-error The callback receiver preserves the host extension type.
keys.add('KeyK', function (this: { extension: number }) {
  return this.extension
})
export { same }
