import type { Events, Emitter as PublicEmitter } from 'artplayer'
import Emitter from '../../packages/artplayer/src/utils/emitter'

const symbol = Symbol('message')
interface Messages {
  ready: []
  value: [count: number, label?: string]
  readonly: readonly [value: number]
  [symbol]: [message: string]
}
class TypedEmitter extends Emitter<Messages> {
  count = 0
}
const events = new TypedEmitter()
const publicShape: PublicEmitter<Messages> = events
const context = { total: 0 }
const chain: TypedEmitter = events.on('value', function (count, label) {
  this.total += count
  label?.toUpperCase()
}, context).once('ready', () => {}).emit('value', 1).off('ready')
events.emit(symbol, 'message')
events.emit('readonly', 1)
const playerEvents = new Emitter<Events & Record<string, unknown[]>>()
playerEvents.emit('setBar', 'loaded', 0.5)
playerEvents.emit('custom:event', { extra: true })
// @ts-expect-error Known events retain their payload types with open custom names.
playerEvents.emit('setBar', 'invalid', 0.5)
// @ts-expect-error A declared map rejects unknown names.
events.emit('missing')
// @ts-expect-error Payload types are correlated with the event name.
events.emit('value', 'one')
// @ts-expect-error Required payloads cannot be omitted.
events.emit('value')
// @ts-expect-error Empty events reject extra values.
events.emit('ready', 1)
// @ts-expect-error Listener arguments must match the event.
events.on('value', (count: string) => count)
// @ts-expect-error Explicit receiver types must agree with the provided context.
events.on('ready', contextListener, { total: 'zero' })
function contextListener(this: { total: number }) {
  return this.total
}
void [chain, publicShape]
