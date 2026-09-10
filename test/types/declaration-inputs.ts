import type { Emitter, Option, OptionInput, SubtitleUpdateEvents } from 'artplayer'
import Artplayer from 'artplayer'

const historical: Option = { container: '#player', url: '' }
const requiredUrl: string = historical.url
const art = new Artplayer(historical)
const instanceUrl: string = art.option.url
const defaultUrl: string = Artplayer.option.url
const input: OptionInput = {
  container: '#player',
  controls: [{ html: 42, position: 'left' }],
  layers: [{ html: 43 }],
  contextmenu: [{ html: 44 }],
}
void new Artplayer(input, function (instance) {
  const receiverId: number = this.id
  const argument: Artplayer = instance
  void [receiverId, argument]
})
void new Artplayer({ container: '#player' })
art.controls.update({ name: 'numeric', html: 45, position: 'left' })
art.layers.add(() => ({ html: 46 }))
// @ts-expect-error URL must still be a string when provided.
void new Artplayer({ container: '#player', url: 42 })
// @ts-expect-error Numeric HTML does not relax other component fields.
void new Artplayer({ container: '#player', controls: [{ html: 42, position: 42 }] })
// @ts-expect-error An arbitrary object is not renderable HTML.
void new Artplayer({ container: '#player', layers: [{ html: {} }] })
const unescaped: string = Artplayer.utils.unescape('&amp;')
const error: Error = new Artplayer.utils.ArtPlayerError('message')
const timer: Promise<void> = Artplayer.utils.sleep()
const target = { value: 1 }
const identity: typeof target = Artplayer.utils.def(target, Symbol('key'), { value: 2 })
// Existing string-key return assignments remain valid during reconciliation.
const oldDef: void = Artplayer.utils.def(target, 'key', { value: 2 })
void [requiredUrl, instanceUrl, defaultUrl, unescaped, error, timer, identity, oldDef]

const emitter: Emitter<{ ready: [number] }> = new Artplayer.Emitter<{ ready: [number] }>('historically-ignored')
emitter.on('ready', function (value) {
  const id: number = this.id
  const payload: number = value
  void [id, payload]
}, { id: 1 }).once('ready', () => {}).emit('ready', 1).off('ready')
// @ts-expect-error Typed event maps reject wrong payloads.
emitter.emit('ready', 'bad')
// @ts-expect-error Typed event maps reject unknown names.
emitter.on('missing', () => {})
const open = new Artplayer.Emitter()
open.on(Symbol.for('event'), (...values) => values.length).emit(Symbol.for('event'), 1, 'two')
const before = (cues: SubtitleUpdateEvents['subtitleBeforeUpdate'][0]) => cues.map(cue => cue.text)
art.on('subtitleBeforeUpdate', before).once('subtitleAfterUpdate', before)
art.emit('subtitleBeforeUpdate', []).off('subtitleBeforeUpdate', before)
