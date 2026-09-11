import type { Utils } from '../../packages/artplayer/public/runtime/utils'
import * as source from '../../packages/artplayer/src/utils'

const utils: Utils = source
const target = { enabled: true }
const same: typeof target = utils.def(target, 'value', { value: 1 })
const delayed: void = utils.debounce(() => 123, 0, {})()
const throttled: void = utils.throttle(() => 456, 0)()
const receiver = { count: 0 }
const callback = utils.debounce(function (this: typeof receiver, increment: number) {
  this.count += increment
}, 0)
callback.call(receiver, 2)
const append: Element | ChildNode | null = utils.append(document.createElement('div'), '')
const style: number | string = utils.getStyle(document.body, 'width', Math.random() > 0.5)
const queried: HTMLVideoElement | null = utils.query<HTMLVideoElement>('video', document.createDocumentFragment())
const removed: Text = utils.remove(document.createTextNode('text'))
utils.sleep()
// @ts-expect-error The callback result is not returned by the debounce wrapper.
const immediate: number = utils.debounce(() => 1, 0)()
// @ts-expect-error Native defineProperty requires a descriptor object.
utils.def(target, 'value', 123)
// @ts-expect-error Native defineProperty also requires an object target.
utils.def(123, 'value', { value: 1 })
// @ts-expect-error Optional event targets do not make composed paths optional arrays.
const nullable: null = utils.getComposedPath({ target: null })
type Assert<Condition extends true> = Condition
type Complete = Assert<Exclude<keyof typeof source, keyof Utils> extends never ? true : false>
type NoInventedExports = Assert<Exclude<keyof Utils, keyof typeof source> extends never ? true : false>
export type { Complete, NoInventedExports }
export { append, delayed, immediate, nullable, queried, removed, same, style, throttled }
